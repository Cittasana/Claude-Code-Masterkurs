#!/usr/bin/env -S npx tsx
/**
 * Phase C/D — Applies approved patches and writes freshness metadata.
 *
 * Reads masterkurs-agent/freshness-output/<latest>-reviewed.json and:
 *   1. Edits src/data/lessons.ts in place for every "approve" patch
 *      (literal find-and-replace on the content string in the matching block).
 *   2. Writes lastVerified, freshnessWarnings, lastUpdatedByAgent directly to
 *      the LessonConfig table for every audited lesson:
 *        - status === 'fresh'                            → lastVerified = today, warnings = []
 *        - reviewedPatches has any approve               → lastUpdatedByAgent = today
 *        - reviewedPatches has reject / needs-human OR   → freshnessWarnings += [...]
 *          executor-warnings still relevant
 *
 * Output: a markdown summary at masterkurs-agent/freshness-reports/<date>-applied.md
 * and direct stdout that the GitHub Action consumes for the PR body.
 */
import { PrismaClient } from '@prisma/client';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { lessons } from '../../src/data/lessons.js';
import { freelancerModules } from '../../src/data/freelancerTrack.js';
import type { Lesson } from '../../src/types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const FRONTEND_LESSONS_TS = join(REPO_ROOT, 'src', 'data', 'lessons.ts');
const AGENT_ROOT = resolve(REPO_ROOT, '..', 'masterkurs-agent');
const AUDIT_OUTPUT_DIR = join(AGENT_ROOT, 'freshness-output');
const AUDIT_REPORT_DIR = join(AGENT_ROOT, 'freshness-reports');

// ──────────────────────────────────────────────────────────────
// Mirror types from freshness-critic.ts
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

type ToneCheck = 'pass' | 'drift' | 'n/a';

interface ReviewedPatch {
  oldText: string;
  newText: string;
  justification: string;
  riskClass: RiskClass;
  verdict: Verdict;
  criticReasoning: string;
  toneCheck?: ToneCheck;
}

interface ReviewedLessonAudit {
  lessonId: number;
  title: string;
  track: 'main' | 'freelancer';
  status: Status;
  warnings: ProposedWarning[];
  reviewedPatches: ReviewedPatch[];
  approvedCount: number;
  rejectedCount: number;
  needsHumanCount: number;
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
async function findLatestReviewedJson(): Promise<{ path: string; data: ReviewedOutput }> {
  const files = await readdir(AUDIT_OUTPUT_DIR);
  const reviewed = files
    .filter((f) => /^\d{4}-\d{2}-\d{2}-reviewed\.json$/.test(f))
    .sort()
    .reverse();
  if (reviewed.length === 0) {
    throw new Error(`No reviewed audits found in ${AUDIT_OUTPUT_DIR} — run audit:critic first.`);
  }
  const latest = reviewed[0];
  const fullPath = join(AUDIT_OUTPUT_DIR, latest);
  const data = JSON.parse(await readFile(fullPath, 'utf-8')) as ReviewedOutput;
  return { path: latest, data };
}

/**
 * Escape `newText` so it survives injection into a TypeScript template
 * literal in lessons.ts. The critic emits Markdown content that often
 * contains inline-code spans (`...`) and occasionally `${...}` — both
 * would terminate the surrounding template literal if left raw and
 * cascade into a parse-error storm (see freshness/2026-05-12, fixed in
 * commit 96b5087). Already-escaped sequences are left alone so re-runs
 * stay idempotent.
 */
function escapeForTemplateLiteral(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const prevEscaped = i > 0 && text[i - 1] === '\\';
    if (ch === '`' && !prevEscaped) {
      out += '\\`';
    } else if (ch === '$' && text[i + 1] === '{' && !prevEscaped) {
      out += '\\$';
    } else {
      out += ch;
    }
  }
  return out;
}

/**
 * Apply approved patches to lessons.ts via literal find-and-replace.
 * Conservative: only first match per patch, only if oldText is unique enough.
 * Returns the number of patches actually written.
 */
async function applyApprovedPatches(reviewed: ReviewedOutput): Promise<number> {
  let source = await readFile(FRONTEND_LESSONS_TS, 'utf-8');
  let applied = 0;
  const skipped: string[] = [];

  for (const lessonAudit of reviewed.lessons) {
    for (const patch of lessonAudit.reviewedPatches) {
      if (patch.verdict !== 'approve') continue;

      const matches = source.split(patch.oldText).length - 1;
      if (matches === 0) {
        skipped.push(`L${lessonAudit.lessonId}: oldText not found verbatim — skipped.`);
        continue;
      }
      if (matches > 1) {
        skipped.push(`L${lessonAudit.lessonId}: oldText ambiguous (${matches} matches) — skipped to avoid collateral edits.`);
        continue;
      }
      source = source.replace(patch.oldText, escapeForTemplateLiteral(patch.newText));
      applied++;
      console.log(`   ✓ L${lessonAudit.lessonId}: applied patch — ${patch.justification.slice(0, 80)}`);
    }
  }

  if (applied > 0) {
    await writeFile(FRONTEND_LESSONS_TS, source, 'utf-8');
    console.log(`   Wrote ${applied} patches to ${FRONTEND_LESSONS_TS}`);
  }
  if (skipped.length > 0) {
    console.log('   Skipped (will be reported in PR body):');
    for (const s of skipped) console.log(`     - ${s}`);
  }
  return applied;
}

// ──────────────────────────────────────────────────────────────
// Cross-Lesson Coherence Pass
// ──────────────────────────────────────────────────────────────
/**
 * Extract "fact-anchor" tokens from a patch's oldText — the kinds of
 * substrings that would appear identically across multiple lessons if
 * the underlying topic is the same.
 *
 * Heuristic patterns (intentionally conservative):
 *   - Version numbers:        2.1.137, v3.15.0
 *   - Slash commands:         /clear, /compact, /fast, /powerup
 *   - CLI flags:              --plan-mode, --plugin-url, -p
 *   - Settings keys:          autoMode.hard_deny, worktree.baseRef
 *   - Identifier files:       CLAUDE.md, .mcp.json, settings.json
 *   - Model IDs:              claude-haiku-4-5, claude-opus-4-7
 *   - Beta headers:           advisor-tool-2026-03-01
 */
function extractFactAnchors(text: string): string[] {
  const anchors = new Set<string>();
  const patterns: RegExp[] = [
    /\b\d+\.\d+\.\d+\b/g,                                    // 2.1.137
    /\bv\d+\.\d+(\.\d+)?\b/g,                                // v3.15.0
    /(?<![A-Za-z])\/[a-z][a-z0-9-]+/g,                       // /clear, /compact
    /(?<![A-Za-z])--[a-z][a-z0-9-]+/g,                       // --plan-mode
    /\b[a-zA-Z]+\.[a-z_][a-zA-Z_]+\b/g,                      // autoMode.hard_deny, worktree.baseRef
    /\bCLAUDE\.md\b|\b\.mcp\.json\b|\bsettings\.json\b/g,    // identifier files
    /\bclaude-(?:haiku|sonnet|opus)-\d+(?:-\d+)?\b/g,        // model IDs
    /\b[a-z][a-z-]+-tool-\d{4}-\d{2}-\d{2}\b/g,              // beta headers like advisor-tool-2026-03-01
  ];
  for (const re of patterns) {
    const matches = text.match(re);
    if (matches) {
      for (const m of matches) {
        // Filter out trivial noise.
        if (m.length < 3) continue;
        anchors.add(m);
      }
    }
  }
  return Array.from(anchors);
}

interface CoherenceFinding {
  lessonId: number;
  matchedAnchor: string;
  sourceLessonId: number;
  sourceJustification: string;
}

/**
 * After patches have been applied, scan all OTHER lessons for fact-anchor
 * tokens that appear in any approved patch. The lessons containing those
 * tokens get a coherence warning so the author knows they may need a
 * sync-update even though they were not directly flagged by the audit.
 */
function findCoherenceWarnings(
  reviewed: ReviewedOutput,
): Map<number, CoherenceFinding[]> {
  const findings = new Map<number, CoherenceFinding[]>();
  const allLessons: Lesson[] = [...lessons, ...freelancerModules];

  for (const la of reviewed.lessons) {
    for (const patch of la.reviewedPatches) {
      if (patch.verdict !== 'approve') continue;
      const anchors = extractFactAnchors(patch.oldText);
      if (anchors.length === 0) continue;

      for (const otherLesson of allLessons) {
        if (otherLesson.id === la.lessonId) continue;
        const text = otherLesson.content
          .map((b) => b.content)
          .join('\n');
        for (const anchor of anchors) {
          if (text.includes(anchor)) {
            const list = findings.get(otherLesson.id) ?? [];
            list.push({
              lessonId: otherLesson.id,
              matchedAnchor: anchor,
              sourceLessonId: la.lessonId,
              sourceJustification: patch.justification,
            });
            findings.set(otherLesson.id, list);
          }
        }
      }
    }
  }

  return findings;
}

/** Write freshness metadata directly to the LessonConfig table. */
async function syncFreshnessToDb(
  reviewed: ReviewedOutput,
  coherenceFindings: Map<number, CoherenceFinding[]>,
): Promise<{ written: number; coherenceTouched: number }> {
  const prisma = new PrismaClient();
  const today = new Date();
  let written = 0;
  let coherenceTouched = 0;

  // Union of all lesson IDs we may need to write: direct audits + coherence-flagged.
  const allLessonIds = new Set<number>();
  for (const la of reviewed.lessons) allLessonIds.add(la.lessonId);
  for (const id of coherenceFindings.keys()) allLessonIds.add(id);

  try {
    for (const lessonId of allLessonIds) {
      const la = reviewed.lessons.find((l) => l.lessonId === lessonId);
      const coherence = coherenceFindings.get(lessonId) ?? [];
      const isFresh = la?.status === 'fresh';

      // Direct audit warnings (carry forward unless lesson is fresh).
      const carryWarnings: ProposedWarning[] = isFresh ? [] : (la?.warnings ?? []);

      // Patches that need human review → annotate as warning.
      const escalatedAsWarnings: ProposedWarning[] =
        la?.reviewedPatches
          .filter((p) => p.verdict === 'needs-human')
          .map((p) => ({
            reason: p.justification,
            source: `reviewed-${reviewed.auditDate}: ${p.criticReasoning.slice(0, 120)}`,
            severity:
              p.riskClass === 'block' ? ('high' as const)
              : p.riskClass === 'review' ? ('medium' as const)
              : ('low' as const),
          })) ?? [];

      // Cross-lesson coherence warnings — low-severity by default, group by source lesson.
      const coherenceWarnings: ProposedWarning[] = coherence.length > 0
        ? [
            {
              reason: `Sync-Update prüfen: ${coherence.length} Konzept-Anker wurden in anderer Lektion gepatcht (${[...new Set(coherence.map((c) => `L${c.sourceLessonId}`))].join(', ')}). Betroffene Tokens: ${[...new Set(coherence.map((c) => c.matchedAnchor))].slice(0, 5).join(', ')}.`,
              source: `coherence-${reviewed.auditDate}`,
              severity: 'low' as const,
            },
          ]
        : [];

      const combined = [...carryWarnings, ...escalatedAsWarnings, ...coherenceWarnings];
      const anyApproved = la?.reviewedPatches.some((p) => p.verdict === 'approve') ?? false;

      const freshnessWarnings = combined.map((w) => ({
        reason: w.reason,
        source: w.source,
        severity: w.severity,
        addedAt: today.toISOString(),
      }));

      try {
        await prisma.lessonConfig.update({
          where: { lessonId },
          data: {
            // Only mark fresh when (a) directly audited AND (b) no coherence findings.
            lastVerified: isFresh && coherence.length === 0 ? today : undefined,
            freshnessWarnings,
            lastUpdatedByAgent: anyApproved ? today : undefined,
          },
        });
        written++;
        if (coherence.length > 0) coherenceTouched++;
      } catch (err) {
        const code = (err as { code?: string }).code;
        if (code === 'P2025') {
          console.log(`   ⚠ L${lessonId}: not in DB yet, skipped metadata sync.`);
          continue;
        }
        throw err;
      }
    }
  } finally {
    await prisma.$disconnect();
  }

  return { written, coherenceTouched };
}

interface ReportExtras {
  coherenceFindings: Map<number, CoherenceFinding[]>;
  totalCoherenceWarnings: number;
  toneDriftCount: number;
  dbSync: { written: number; coherenceTouched: number };
}

function renderAppliedReport(
  reviewed: ReviewedOutput,
  appliedCount: number,
  extras: ReportExtras,
): string {
  const lines: string[] = [];
  lines.push(`# Freshness Apply — ${reviewed.auditDate}`);
  lines.push('');
  lines.push(`Source: \`${reviewed.researchSource}\``);
  lines.push(`Executor: \`${reviewed.modelExecutor}\` · Critic: \`${reviewed.modelCritic}\``);
  if (reviewed.throttleApplied) {
    lines.push(`> Throttle hit: max ${reviewed.maxAutopatchesPerRun} auto-applies pro Run.`);
  }
  lines.push('');
  lines.push('## Verdict totals');
  lines.push('');
  lines.push(`- approve: **${reviewed.totalsByVerdict.approve}**`);
  lines.push(`- reject: **${reviewed.totalsByVerdict.reject}**`);
  lines.push(`- needs-human: **${reviewed.totalsByVerdict['needs-human']}**`);
  lines.push('');
  lines.push(`## Quality gates`);
  lines.push('');
  lines.push(`- Patches applied to lessons.ts: **${appliedCount}**`);
  lines.push(`- Tone-drift demotions: **${extras.toneDriftCount}** (auto-demoted to needs-human despite factual correctness)`);
  lines.push(`- Cross-lesson coherence warnings: **${extras.totalCoherenceWarnings}** across **${extras.coherenceFindings.size}** lessons`);
  lines.push(`- LessonConfig rows touched: **${extras.dbSync.written}**`);
  lines.push('');

  const interesting = reviewed.lessons.filter(
    (l) => l.approvedCount + l.needsHumanCount > 0 || l.warnings.length > 0,
  );
  if (interesting.length === 0 && extras.coherenceFindings.size === 0) {
    lines.push('No actionable findings this week.');
    return lines.join('\n');
  }

  if (interesting.length > 0) {
    lines.push('## Direct audit details');
    lines.push('');
    for (const l of interesting) {
      lines.push(`### L${l.lessonId} — ${l.title} *(${l.track})*`);
      lines.push(`status: \`${l.status}\` · approved: ${l.approvedCount} · needs-human: ${l.needsHumanCount} · rejected: ${l.rejectedCount}`);
      lines.push('');
      if (l.warnings.length > 0) {
        lines.push('Warnings:');
        for (const w of l.warnings) {
          lines.push(`- [\`${w.severity}\`] ${w.reason} · source: ${w.source}`);
        }
        lines.push('');
      }
      if (l.reviewedPatches.length > 0) {
        lines.push('Patches:');
        for (const p of l.reviewedPatches) {
          const tone = p.toneCheck ? ` · tone: ${p.toneCheck}` : '';
          lines.push(`- *(verdict: ${p.verdict}, risk: ${p.riskClass}${tone})* ${p.justification}`);
          lines.push(`  > Critic: ${p.criticReasoning}`);
        }
        lines.push('');
      }
    }
  }

  if (extras.coherenceFindings.size > 0) {
    lines.push('## Cross-lesson coherence findings');
    lines.push('');
    lines.push('Lektionen, in denen fact-anchor-Tokens (Versionsnummern, Slash-Commands, Settings-Keys etc.) eines gepatchten Konzepts noch unverändert vorkommen. Banner in der UI markiert die Lektionen automatisch.');
    lines.push('');
    for (const [lessonId, findings] of extras.coherenceFindings) {
      const sources = [...new Set(findings.map((f) => f.sourceLessonId))].map((id) => `L${id}`);
      const tokens = [...new Set(findings.map((f) => f.matchedAnchor))];
      lines.push(`- **L${lessonId}** ← Tokens: \`${tokens.slice(0, 6).join('`, `')}\` (von ${sources.join(', ')})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ──────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────
async function main() {
  console.log('🔧 Freshness apply starting...');
  const reviewed = await findLatestReviewedJson();
  console.log(`   Source: ${reviewed.path}`);

  const appliedCount = await applyApprovedPatches(reviewed.data);

  // Cross-lesson coherence pass — fact-anchor tokens from approved patches
  // surface as low-severity warnings on every other lesson that contains them.
  console.log('   Cross-lesson coherence pass...');
  const coherenceFindings = findCoherenceWarnings(reviewed.data);
  const totalCoherenceWarnings = Array.from(coherenceFindings.values()).reduce((a, b) => a + b.length, 0);
  console.log(`   Coherence findings: ${totalCoherenceWarnings} (across ${coherenceFindings.size} other lessons)`);

  let dbSync = { written: 0, coherenceTouched: 0 };
  if (process.env.DATABASE_URL) {
    console.log('   Syncing freshness metadata to LessonConfig...');
    dbSync = await syncFreshnessToDb(reviewed.data, coherenceFindings);
  } else {
    console.log('   DATABASE_URL not set — skipping DB metadata sync. (lessons.ts edits still applied.)');
  }

  // Tone-drift telemetry — these would have been auto-approved but were demoted by the gate.
  const toneDriftCount = reviewed.data.lessons.reduce(
    (acc, l) => acc + l.reviewedPatches.filter((p) => p.toneCheck === 'drift').length,
    0,
  );

  const reportPath = join(AUDIT_REPORT_DIR, `${reviewed.data.auditDate}-applied.md`);
  await writeFile(reportPath, renderAppliedReport(reviewed.data, appliedCount, {
    coherenceFindings,
    totalCoherenceWarnings,
    toneDriftCount,
    dbSync,
  }), 'utf-8');

  console.log('');
  console.log('🔧 Freshness apply done.');
  console.log(`   Patches applied to lessons.ts: ${appliedCount}`);
  console.log(`   Coherence warnings written: ${totalCoherenceWarnings}`);
  console.log(`   Tone-drift demotions: ${toneDriftCount}`);
  console.log(`   Lessons touched in DB: ${dbSync.written}`);
  console.log(`   Report: ${reportPath}`);

  // Print GitHub-Action-friendly summary on stdout for PR body.
  if (process.env.GITHUB_ACTIONS) {
    console.log(`applied_count=${appliedCount}`);
    console.log(`report_path=${reportPath}`);
  }
}

main().catch((err) => {
  console.error('Freshness apply failed:', err);
  process.exit(1);
});
