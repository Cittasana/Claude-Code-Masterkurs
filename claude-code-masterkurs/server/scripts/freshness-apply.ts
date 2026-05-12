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

interface ReviewedPatch {
  oldText: string;
  newText: string;
  justification: string;
  riskClass: RiskClass;
  verdict: Verdict;
  criticReasoning: string;
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
      source = source.replace(patch.oldText, patch.newText);
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

/** Write freshness metadata directly to the LessonConfig table. */
async function syncFreshnessToDb(reviewed: ReviewedOutput): Promise<void> {
  const prisma = new PrismaClient();
  const today = new Date();
  try {
    for (const la of reviewed.lessons) {
      // Reject patches: not relevant for warnings. needs-human patches → become warnings.
      // Executor warnings (la.warnings) remain warnings unless lesson was "fresh".
      const isFresh = la.status === 'fresh';
      const carryWarnings: ProposedWarning[] = isFresh ? [] : la.warnings;
      const escalatedAsWarnings: ProposedWarning[] = la.reviewedPatches
        .filter((p) => p.verdict === 'needs-human')
        .map((p) => ({
          reason: p.justification,
          source: `reviewed-${reviewed.auditDate}: ${p.criticReasoning.slice(0, 120)}`,
          severity:
            p.riskClass === 'block' ? ('high' as const) :
            p.riskClass === 'review' ? ('medium' as const) :
            ('low' as const),
        }));

      const combined = [...carryWarnings, ...escalatedAsWarnings];
      const anyApproved = la.reviewedPatches.some((p) => p.verdict === 'approve');

      const freshnessWarnings = combined.map((w) => ({
        reason: w.reason,
        source: w.source,
        severity: w.severity,
        addedAt: today.toISOString(),
      }));

      try {
        await prisma.lessonConfig.update({
          where: { lessonId: la.lessonId },
          data: {
            lastVerified: isFresh ? today : undefined,
            freshnessWarnings,
            lastUpdatedByAgent: anyApproved ? today : undefined,
          },
        });
      } catch (err) {
        const code = (err as { code?: string }).code;
        if (code === 'P2025') {
          // Lesson row not in DB yet (e.g. brand-new lesson, seed hasn't run since adding it).
          console.log(`   ⚠ L${la.lessonId}: not in DB yet, skipped metadata sync.`);
          continue;
        }
        throw err;
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

function renderAppliedReport(reviewed: ReviewedOutput, appliedCount: number): string {
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
  lines.push(`## Applied to lessons.ts: **${appliedCount}** patches`);
  lines.push('');

  const interesting = reviewed.lessons.filter(
    (l) => l.approvedCount + l.needsHumanCount > 0 || l.warnings.length > 0,
  );
  if (interesting.length === 0) {
    lines.push('No actionable findings this week.');
    return lines.join('\n');
  }

  lines.push('## Details');
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
        lines.push(`- *(verdict: ${p.verdict}, risk: ${p.riskClass})* ${p.justification}`);
        lines.push(`  > Critic: ${p.criticReasoning}`);
      }
      lines.push('');
    }
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

  if (process.env.DATABASE_URL) {
    console.log('   Syncing freshness metadata to LessonConfig...');
    await syncFreshnessToDb(reviewed.data);
  } else {
    console.log('   DATABASE_URL not set — skipping DB metadata sync. (lessons.ts edits still applied.)');
  }

  const reportPath = join(AUDIT_REPORT_DIR, `${reviewed.data.auditDate}-applied.md`);
  await writeFile(reportPath, renderAppliedReport(reviewed.data, appliedCount), 'utf-8');

  console.log('');
  console.log('🔧 Freshness apply done.');
  console.log(`   Patches applied to lessons.ts: ${appliedCount}`);
  console.log(`   Report: ${reportPath}`);

  // Print GitHub-Action-friendly summary on stdout for PR body.
  if (process.env.GITHUB_ACTIONS) {
    console.log(`::set-output name=applied_count::${appliedCount}`);
    console.log(`::set-output name=report_path::${reportPath}`);
  }
}

main().catch((err) => {
  console.error('Freshness apply failed:', err);
  process.exit(1);
});
