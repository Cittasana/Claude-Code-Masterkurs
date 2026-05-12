#!/usr/bin/env -S npx tsx
/**
 * Phase C — Multi-Agent critic for the freshness audit.
 *
 * Reads the latest freshness-output/*.json (from freshness-audit.ts) and runs
 * every proposed patch through Opus 4.7 as an independent critic. The critic
 * verifies the patch against:
 *   - the original lesson content
 *   - the research source it claims
 *   - the riskClass declared by the executor
 *
 * Output:
 *   masterkurs-agent/freshness-output/YYYY-MM-DD-reviewed.json
 *
 * Verdicts per patch:
 *   - "approve"        → ready to apply (used by freshness-apply.ts)
 *   - "reject"         → drop the patch, keep as warning only
 *   - "needs-human"    → keep as warning, surface in PR description
 *
 * Audit-throttle: by default, only up to MAX_AUTOPATCHES_PER_RUN safe patches
 * are flagged for auto-apply. Anything beyond that drops to "needs-human" so
 * weekly content churn stays bounded.
 */
import Anthropic from '@anthropic-ai/sdk';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { lessons } from '../../src/data/lessons.js';
import { freelancerModules } from '../../src/data/freelancerTrack.js';
import type { Lesson } from '../../src/types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const AGENT_ROOT = resolve(REPO_ROOT, '..', 'masterkurs-agent');
const AUDIT_OUTPUT_DIR = join(AGENT_ROOT, 'freshness-output');
const RESEARCH_DIR = join(AGENT_ROOT, 'research');

const MAX_AUTOPATCHES_PER_RUN = 10;

// ──────────────────────────────────────────────────────────────
// Types — mirror the executor's shape, add verdict fields.
// ──────────────────────────────────────────────────────────────
type Severity = 'low' | 'medium' | 'high';
type Status = 'fresh' | 'minor' | 'breaking';
type RiskClass = 'safe' | 'review' | 'block';
type Verdict = 'approve' | 'reject' | 'needs-human';

interface ProposedWarning {
  reason: string;
  source: string;
  severity: Severity;
}

interface ProposedPatch {
  oldText: string;
  newText: string;
  justification: string;
  riskClass: RiskClass;
}

interface ReviewedPatch extends ProposedPatch {
  verdict: Verdict;
  criticReasoning: string;
}

interface LessonAudit {
  lessonId: number;
  title: string;
  track: 'main' | 'freelancer';
  status: Status;
  warnings: ProposedWarning[];
  proposedPatches: ProposedPatch[];
}

interface ReviewedLessonAudit extends Omit<LessonAudit, 'proposedPatches'> {
  reviewedPatches: ReviewedPatch[];
  approvedCount: number;
  rejectedCount: number;
  needsHumanCount: number;
}

interface AuditOutput {
  auditDate: string;
  researchSource: string;
  modelExecutor: string;
  totalLessons: number;
  totalsByStatus: Record<Status, number>;
  lessons: LessonAudit[];
}

interface ReviewedOutput {
  auditDate: string;
  researchSource: string;
  modelExecutor: string;
  modelCritic: string;
  totalLessons: number;
  totalsByStatus: Record<Status, number>;
  totalsByVerdict: Record<Verdict, number>;
  throttleApplied: boolean;
  maxAutopatchesPerRun: number;
  lessons: ReviewedLessonAudit[];
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
async function findLatestAuditJson(): Promise<{ path: string; data: AuditOutput }> {
  const files = await readdir(AUDIT_OUTPUT_DIR);
  const audits = files
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort()
    .reverse();
  if (audits.length === 0) {
    throw new Error(`No freshness audits found in ${AUDIT_OUTPUT_DIR} — run audit:freshness first.`);
  }
  const latest = audits[0];
  const fullPath = join(AUDIT_OUTPUT_DIR, latest);
  const data = JSON.parse(await readFile(fullPath, 'utf-8')) as AuditOutput;
  return { path: latest, data };
}

async function loadResearchContent(path: string): Promise<string> {
  return readFile(join(RESEARCH_DIR, path), 'utf-8');
}

function buildLessonIndex(): Map<number, Lesson> {
  const map = new Map<number, Lesson>();
  for (const l of lessons) map.set(l.id, l);
  for (const l of freelancerModules) map.set(l.id, l);
  return map;
}

function lessonContentText(lesson: Lesson): string {
  return lesson.content
    .map((b) => (b.type === 'code' ? b.content : b.content))
    .join('\n\n');
}

// ──────────────────────────────────────────────────────────────
// Critic prompt
// ──────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an independent critic for proposed content patches in the Claude Code Masterkurs.

A first-pass auditor has flagged a course lesson and proposed a specific text patch. Your job is to scrutinise that patch BEFORE it gets applied.

You must verify:
1. The 'oldText' actually appears in the lesson content (literal substring).
2. The 'newText' does not introduce new errors, fabricated facts, or hallucinated APIs.
3. The 'justification' is anchored in a real claim from the research report.
4. The declared 'riskClass' is honest — a 'safe' patch should be mechanical (version bumps, renamed flags); 'review' is for meaning-altering edits; 'block' is for architectural rewrites.

Output STRICTLY this JSON:
{
  "verdict": "approve" | "reject" | "needs-human",
  "criticReasoning": "1-3 sentence explanation in German preferred"
}

Verdict rules:
- "approve"      → safe and accurate, ready for auto-apply
- "reject"       → patch is wrong, hallucinated, or makes lesson worse — drop it
- "needs-human"  → patch is plausibly correct but riskClass demands review, OR oldText doesn't match exactly`;

// ──────────────────────────────────────────────────────────────
// Anthropic client + critique
// ──────────────────────────────────────────────────────────────
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function critiquePatch(
  lesson: Lesson,
  patch: ProposedPatch,
  researchContent: string,
): Promise<ReviewedPatch> {
  const literalMatch = lessonContentText(lesson).includes(patch.oldText);

  // Short-circuit: if oldText doesn't even appear, escalate without an API call.
  if (!literalMatch) {
    return {
      ...patch,
      verdict: 'needs-human',
      criticReasoning: `Pre-check failed: 'oldText' substring nicht im Lektion-Content gefunden — kann nicht sauber auto-patched werden.`,
    };
  }

  const userMessage = `=== LESSON ${lesson.id}: "${lesson.title}" ===
${lessonContentText(lesson).slice(0, 5000)}

=== PROPOSED PATCH ===
Risk class declared: ${patch.riskClass}
Justification: ${patch.justification}

oldText:
${patch.oldText}

newText:
${patch.newText}

=== TASK ===
Apply the verification rules from the system prompt. Output strict JSON.`;

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 512,
      system: [
        { type: 'text', text: SYSTEM_PROMPT },
        {
          type: 'text',
          text: `\n\n=== WEEKLY RESEARCH (claimed source) ===\n${researchContent}`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');

    const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```\s*$/i, '').trim();
    let parsed: { verdict: Verdict; criticReasoning: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return {
        ...patch,
        verdict: 'needs-human',
        criticReasoning: `Critic JSON-Parse fehlgeschlagen; eskaliert zu menschlicher Review.`,
      };
    }

    return { ...patch, verdict: parsed.verdict, criticReasoning: parsed.criticReasoning };
  } catch (err) {
    return {
      ...patch,
      verdict: 'needs-human',
      criticReasoning: `API-Fehler im Critic-Lauf: ${(err as Error).message}. Eskaliert.`,
    };
  }
}

// ──────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set in environment');
  }

  console.log('🧪 Freshness critic starting...');
  const audit = await findLatestAuditJson();
  console.log(`   Reviewing: ${audit.path}`);

  const researchContent = await loadResearchContent(audit.data.researchSource);
  const lessonIndex = buildLessonIndex();

  // Gather every patch that wasn't already classified "block" by the executor.
  // We critique all of them in priority order: low-risk first to fill the throttle.
  const allPatchesFlat: { lessonAudit: LessonAudit; patch: ProposedPatch }[] = [];
  for (const lessonAudit of audit.data.lessons) {
    for (const patch of lessonAudit.proposedPatches) {
      allPatchesFlat.push({ lessonAudit, patch });
    }
  }
  const riskRank = { safe: 0, review: 1, block: 2 };
  allPatchesFlat.sort((a, b) => riskRank[a.patch.riskClass] - riskRank[b.patch.riskClass]);

  console.log(`   ${allPatchesFlat.length} proposed patches across ${audit.data.lessons.length} lessons.`);

  // Critique each, applying throttle to safe-class auto-approvals.
  const reviewedByLesson = new Map<number, ReviewedPatch[]>();
  let approvedSoFar = 0;
  let throttleApplied = false;

  for (let i = 0; i < allPatchesFlat.length; i++) {
    const { lessonAudit, patch } = allPatchesFlat[i];
    const lesson = lessonIndex.get(lessonAudit.lessonId);
    if (!lesson) continue;

    process.stdout.write(`   [${i + 1}/${allPatchesFlat.length}] L${lesson.id} (${patch.riskClass}) ... `);

    // Block-risk patches never reach the critic — straight to "needs-human".
    let reviewed: ReviewedPatch;
    if (patch.riskClass === 'block') {
      reviewed = {
        ...patch,
        verdict: 'needs-human',
        criticReasoning: `RiskClass 'block' — architektonische Änderung, gehört in menschliche Review.`,
      };
    } else {
      reviewed = await critiquePatch(lesson, patch, researchContent);
    }

    // Throttle: cap auto-approvals to MAX_AUTOPATCHES_PER_RUN.
    if (reviewed.verdict === 'approve' && approvedSoFar >= MAX_AUTOPATCHES_PER_RUN) {
      throttleApplied = true;
      reviewed = {
        ...reviewed,
        verdict: 'needs-human',
        criticReasoning: `${reviewed.criticReasoning} (Throttle: max ${MAX_AUTOPATCHES_PER_RUN} auto-patches pro Run erreicht.)`,
      };
    } else if (reviewed.verdict === 'approve') {
      approvedSoFar++;
    }

    process.stdout.write(`${reviewed.verdict}\n`);
    const list = reviewedByLesson.get(lessonAudit.lessonId) ?? [];
    list.push(reviewed);
    reviewedByLesson.set(lessonAudit.lessonId, list);
  }

  // Aggregate into per-lesson output rows.
  const reviewedLessons: ReviewedLessonAudit[] = audit.data.lessons.map((la) => {
    const reviewedPatches = reviewedByLesson.get(la.lessonId) ?? [];
    return {
      lessonId: la.lessonId,
      title: la.title,
      track: la.track,
      status: la.status,
      warnings: la.warnings,
      reviewedPatches,
      approvedCount: reviewedPatches.filter((p) => p.verdict === 'approve').length,
      rejectedCount: reviewedPatches.filter((p) => p.verdict === 'reject').length,
      needsHumanCount: reviewedPatches.filter((p) => p.verdict === 'needs-human').length,
    };
  });

  const totalsByVerdict: Record<Verdict, number> = { approve: 0, reject: 0, 'needs-human': 0 };
  for (const rl of reviewedLessons) {
    for (const p of rl.reviewedPatches) totalsByVerdict[p.verdict]++;
  }

  const output: ReviewedOutput = {
    auditDate: audit.data.auditDate,
    researchSource: audit.data.researchSource,
    modelExecutor: audit.data.modelExecutor,
    modelCritic: 'claude-opus-4-7',
    totalLessons: audit.data.totalLessons,
    totalsByStatus: audit.data.totalsByStatus,
    totalsByVerdict,
    throttleApplied,
    maxAutopatchesPerRun: MAX_AUTOPATCHES_PER_RUN,
    lessons: reviewedLessons,
  };

  const outPath = join(AUDIT_OUTPUT_DIR, `${audit.data.auditDate}-reviewed.json`);
  await writeFile(outPath, JSON.stringify(output, null, 2), 'utf-8');

  console.log('');
  console.log('🧪 Critic done.');
  console.log(
    `   approve: ${totalsByVerdict.approve} | reject: ${totalsByVerdict.reject} | needs-human: ${totalsByVerdict['needs-human']}${
      throttleApplied ? ' (throttle hit)' : ''
    }`,
  );
  console.log(`   Output: ${outPath}`);
}

main().catch((err) => {
  console.error('Freshness critic failed:', err);
  process.exit(1);
});
