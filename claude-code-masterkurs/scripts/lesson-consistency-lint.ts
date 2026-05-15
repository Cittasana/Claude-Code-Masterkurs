/**
 * lesson-consistency-lint.ts — Phase-4-prerequisite content lint.
 *
 * Lints each track's lesson file (`src/data/lessons-<track>.ts`) for:
 *   1. Frontmatter schema (id/level/title/description/content)
 *   2. Code-block language tags
 *   3. Markdown-syntax sanity (balanced backticks, fenced blocks, stray JSX)
 *   4. Heading-hierarchy (no skipped levels, valid range 1-6)
 *   5. Internal `/lesson/N` link validity within the same track
 *   6. Persona-voice bleed (per-track DO-NOT-USE phrases)
 *
 * Missing per-track files are skipped with INFO so this works
 * before AND after Phase-4 content-seeding adds the other tracks.
 *
 * Usage:   tsx scripts/lesson-consistency-lint.ts
 * Exit 0 → no errors. Exit 1 → at least one error. Warnings are advisory.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

// ── Types — kept local to avoid cross-package imports ────────────
type BlockType =
  | 'text'
  | 'code'
  | 'highlight'
  | 'list'
  | 'yaml'
  | 'heading'
  | 'video';

interface LessonContent {
  type: BlockType;
  content: string;
  language?: string;
  title?: string;
  provider?: 'youtube' | 'vimeo' | 'local';
  videoId?: string;
}

interface Lesson {
  id: number;
  level: 1 | 2 | 3;
  title: string;
  description: string;
  duration?: string;
  objectives?: string[];
  content: LessonContent[];
  category?: string;
  videoUrl?: string;
  track?: string;
}

type Severity = 'INFO' | 'WARN' | 'ERROR';

interface Finding {
  severity: Severity;
  track: string;
  lessonId: number | null;
  message: string;
}

// ── Track registry (mirror of src/data/tracks.ts minimal subset) ──
// We intentionally do not import tracks.ts at runtime to avoid pulling
// the React app's transitive deps into the lint process.
const TRACK_FILES: Record<string, string> = {
  'claude-code': 'lessons-claude-code.ts',
  codex: 'lessons-codex.ts',
  'local-llm': 'lessons-local-llm.ts',
  'claude-desktop': 'lessons-claude-desktop.ts',
};

// ── Persona-voice defaults (used when no DO-NOT-USE section found) ─
const PERSONA_BLEED_DEFAULTS: Record<string, RegExp[]> = {
  'claude-code': [],
  codex: [
    // "Claude Code" as a subject — allowed in comparison sections.
    /\bClaude\s+Code\b/i,
  ],
  'local-llm': [
    // "Claude" used to describe the tutor without a "local"-style prefix.
    // Matches "Claude" not directly preceded by "local " (case-insensitive).
    /(?<!local\s)\bClaude\b/i,
  ],
  'claude-desktop': [/\bclaude\s+code\s+cli\b/i, /\bthe\s+cli\b/i],
};

// Persona-bleed false-positive filter: a section explicitly framed as a
// compare/contrast block is allowed to mention other tracks. We accept
// any heading that contains these markers earlier in the lesson.
const COMPARE_CONTRAST_HINTS = /vergleich|compare|contrast|vs\.?\b/i;

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = dirname(__filename);
const REPO_ROOT = resolve(SCRIPT_DIR, '..');
const DATA_DIR = join(REPO_ROOT, 'src', 'data');
const AGENT_DIR = resolve(REPO_ROOT, '..', 'masterkurs-agent');

// ── Persona blacklist loader ─────────────────────────────────────
function loadPersonaBlacklist(track: string): RegExp[] {
  const personaPath = join(
    AGENT_DIR,
    'track-configs',
    track,
    'tutor-persona.md',
  );
  if (!existsSync(personaPath)) {
    return PERSONA_BLEED_DEFAULTS[track] ?? [];
  }
  const raw = readFileSync(personaPath, 'utf-8');
  // Look for a section "## DO-NOT-USE phrases" (or English variants),
  // pull bullet points until the next heading.
  const sectionMatch = raw.match(
    /##+\s*(?:DO-NOT-USE\s+phrases|Verbotene\s+Phrasen)[^\n]*\n([\s\S]*?)(?=\n##+\s|\n*$)/i,
  );
  if (!sectionMatch) {
    return PERSONA_BLEED_DEFAULTS[track] ?? [];
  }
  const phrases: RegExp[] = [];
  for (const line of sectionMatch[1].split('\n')) {
    const m = line.match(/^\s*[-*]\s+`?([^`]+?)`?\s*$/);
    if (m && m[1].trim()) {
      // Escape regex metas, treat as case-insensitive word-ish match.
      const escaped = m[1].trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      phrases.push(new RegExp(`\\b${escaped}\\b`, 'i'));
    }
  }
  return phrases.length > 0 ? phrases : PERSONA_BLEED_DEFAULTS[track] ?? [];
}

// ── Frontmatter schema check ─────────────────────────────────────
function checkFrontmatter(lesson: unknown, track: string): Finding[] {
  const findings: Finding[] = [];
  if (typeof lesson !== 'object' || lesson === null) {
    findings.push({
      severity: 'ERROR',
      track,
      lessonId: null,
      message: 'lesson is not an object',
    });
    return findings;
  }
  const l = lesson as Record<string, unknown>;
  const id = typeof l.id === 'number' ? (l.id as number) : null;

  if (typeof l.id !== 'number' || !Number.isFinite(l.id)) {
    findings.push({
      severity: 'ERROR',
      track,
      lessonId: id,
      message: 'missing or non-numeric `id`',
    });
  }
  if (l.level !== 1 && l.level !== 2 && l.level !== 3) {
    findings.push({
      severity: 'ERROR',
      track,
      lessonId: id,
      message: `invalid \`level\` (expected 1|2|3, got ${JSON.stringify(l.level)})`,
    });
  }
  if (typeof l.title !== 'string' || l.title.trim().length === 0) {
    findings.push({
      severity: 'ERROR',
      track,
      lessonId: id,
      message: 'missing or empty `title`',
    });
  }
  if (typeof l.description !== 'string' || l.description.trim().length === 0) {
    findings.push({
      severity: 'ERROR',
      track,
      lessonId: id,
      message: 'missing or empty `description`',
    });
  }
  if (!Array.isArray(l.content)) {
    findings.push({
      severity: 'ERROR',
      track,
      lessonId: id,
      message: '`content` is not an array',
    });
  }
  return findings;
}

// ── Code-block language tag check ────────────────────────────────
function checkCodeLanguage(lesson: Lesson, track: string): Finding[] {
  const findings: Finding[] = [];
  lesson.content.forEach((block, idx) => {
    if (block.type !== 'code') return;
    if (typeof block.language !== 'string' || block.language.trim() === '') {
      findings.push({
        severity: 'ERROR',
        track,
        lessonId: lesson.id,
        message: `code block missing language at content[${idx}]`,
      });
    }
  });
  return findings;
}

// ── Markdown-syntax sanity ───────────────────────────────────────
// Regex-level only — no AST. Catches the common foot-guns:
//   • unbalanced backticks (count of unescaped backticks not even-ish)
//   • fenced ``` blocks that open without closing
//   • a bare `<` followed by capital letter without a matching `>` later
function checkMarkdownSanity(lesson: Lesson, track: string): Finding[] {
  const findings: Finding[] = [];
  lesson.content.forEach((block, idx) => {
    if (block.type !== 'text') return;
    const text = block.content;

    // Fenced ``` count must be even.
    const fenceMatches = text.match(/```/g);
    if (fenceMatches && fenceMatches.length % 2 !== 0) {
      findings.push({
        severity: 'ERROR',
        track,
        lessonId: lesson.id,
        message: `unbalanced fenced code block (\`\`\`) in text block at content[${idx}]`,
      });
    }

    // Total backticks should be even (treating triple as triple ticks
    // already balanced by the fence check). Strip fenced regions first.
    const stripped = text.replace(/```[\s\S]*?```/g, '');
    const inlineTicks = (stripped.match(/`/g) ?? []).length;
    if (inlineTicks % 2 !== 0) {
      findings.push({
        severity: 'WARN',
        track,
        lessonId: lesson.id,
        message: `unbalanced inline backticks in text block at content[${idx}]`,
      });
    }

    // Bare `<Capital...` with no closing `>` in the same block.
    // Skip when the `<` is inside an inline backtick span — those are
    // examples, not stray JSX.
    const noInlineCode = stripped.replace(/`[^`\n]*`/g, '');
    const jsxOpenRe = /<([A-Z][A-Za-z0-9]*)\b/g;
    let m: RegExpExecArray | null;
    while ((m = jsxOpenRe.exec(noInlineCode)) !== null) {
      const after = noInlineCode.slice(m.index);
      // Require a `>` within the next 200 chars to be considered closed.
      if (!/^[^>]{0,200}>/.test(after)) {
        findings.push({
          severity: 'WARN',
          track,
          lessonId: lesson.id,
          message: `possible stray JSX/HTML \`<${m[1]}\` without closing \`>\` at content[${idx}]`,
        });
        break; // one finding per block is plenty.
      }
    }
  });
  return findings;
}

// ── Heading-hierarchy check ──────────────────────────────────────
// We treat `heading` blocks' content as Markdown-like: leading `#`s
// indicate level. Default level is 2 (h2) if no `#` prefix — the
// renderer's behavior in prerender.ts.
function getHeadingLevel(content: string): number {
  const m = content.match(/^(#{1,6})\s/);
  if (m) return m[1].length;
  // prerender.ts defaults: '###' → h4, '##' → h3, else h2. But to keep
  // the check straightforward and detect real skips, treat plain headings
  // as level 2 by convention.
  if (content.startsWith('###')) return 3;
  if (content.startsWith('##')) return 2;
  return 2;
}

function checkHeadingHierarchy(lesson: Lesson, track: string): Finding[] {
  const findings: Finding[] = [];
  let prevLevel = 0;
  lesson.content.forEach((block, idx) => {
    if (block.type !== 'heading') return;
    const level = getHeadingLevel(block.content);
    if (level < 1 || level > 6) {
      findings.push({
        severity: 'ERROR',
        track,
        lessonId: lesson.id,
        message: `invalid heading level ${level} at content[${idx}] (must be 1-6)`,
      });
      return;
    }
    if (prevLevel > 0 && level > prevLevel + 1) {
      findings.push({
        severity: 'WARN',
        track,
        lessonId: lesson.id,
        message: `heading skipped level h${prevLevel} → h${level} at content[${idx}]`,
      });
    }
    prevLevel = level;
  });
  return findings;
}

// ── Internal link validity ───────────────────────────────────────
function checkInternalLinks(
  lesson: Lesson,
  validIds: Set<number>,
  track: string,
): Finding[] {
  const findings: Finding[] = [];
  const linkRe = /\/lesson\/(\d+)/g;
  lesson.content.forEach((block, idx) => {
    if (
      block.type !== 'text' &&
      block.type !== 'code' &&
      block.type !== 'list'
    ) {
      return;
    }
    const text = block.content;
    let m: RegExpExecArray | null;
    while ((m = linkRe.exec(text)) !== null) {
      const target = Number(m[1]);
      if (!validIds.has(target)) {
        findings.push({
          severity: 'ERROR',
          track,
          lessonId: lesson.id,
          message: `link /lesson/${target} at content[${idx}] does not resolve to a ${track} lesson`,
        });
      }
    }
  });
  return findings;
}

// ── Persona-voice bleed ──────────────────────────────────────────
function checkPersonaBleed(
  lesson: Lesson,
  blacklist: RegExp[],
  track: string,
): Finding[] {
  if (blacklist.length === 0) return [];
  const findings: Finding[] = [];
  let inCompareSection = false;
  lesson.content.forEach((block, idx) => {
    if (block.type === 'heading') {
      inCompareSection = COMPARE_CONTRAST_HINTS.test(block.content);
      return;
    }
    if (inCompareSection) return;
    if (
      block.type !== 'text' &&
      block.type !== 'list' &&
      block.type !== 'highlight'
    ) {
      return;
    }
    for (const re of blacklist) {
      if (re.test(block.content)) {
        findings.push({
          severity: 'WARN',
          track,
          lessonId: lesson.id,
          message: `persona-voice bleed: blacklisted phrase matched /${re.source}/${re.flags} at content[${idx}]`,
        });
        break; // one finding per block.
      }
    }
  });
  return findings;
}

// ── Track loader ────────────────────────────────────────────────
async function loadTrackLessons(
  track: string,
  fileName: string,
): Promise<Lesson[] | null> {
  const fullPath = join(DATA_DIR, fileName);
  if (!existsSync(fullPath)) return null;
  const mod: unknown = await import(pathToFileURL(fullPath).href);
  if (
    typeof mod !== 'object' ||
    mod === null ||
    !('lessons' in mod) ||
    !Array.isArray((mod as { lessons: unknown }).lessons)
  ) {
    throw new Error(
      `[${track}] module ${fileName} does not export an array \`lessons\``,
    );
  }
  return (mod as { lessons: Lesson[] }).lessons;
}

// ── Main ────────────────────────────────────────────────────────
async function main(): Promise<number> {
  const findings: Finding[] = [];
  let tracksLinted = 0;
  let lessonsLinted = 0;

  for (const [track, fileName] of Object.entries(TRACK_FILES)) {
    let lessons: Lesson[] | null;
    try {
      lessons = await loadTrackLessons(track, fileName);
    } catch (err) {
      findings.push({
        severity: 'ERROR',
        track,
        lessonId: null,
        message: `failed to load lessons: ${(err as Error).message}`,
      });
      continue;
    }
    if (lessons === null) {
      findings.push({
        severity: 'INFO',
        track,
        lessonId: null,
        message: `no lesson file at src/data/${fileName} — skipping (expected pre-Phase-4)`,
      });
      continue;
    }

    tracksLinted++;
    lessonsLinted += lessons.length;
    const blacklist = loadPersonaBlacklist(track);
    const validIds = new Set<number>(
      lessons
        .map((l) => (typeof l.id === 'number' ? l.id : NaN))
        .filter((n) => Number.isFinite(n)),
    );

    for (const lesson of lessons) {
      const schemaFindings = checkFrontmatter(lesson, track);
      findings.push(...schemaFindings);
      // Bail per-lesson if the basic shape is broken (no content array).
      if (!Array.isArray((lesson as Lesson).content)) continue;

      findings.push(...checkCodeLanguage(lesson, track));
      findings.push(...checkMarkdownSanity(lesson, track));
      findings.push(...checkHeadingHierarchy(lesson, track));
      findings.push(...checkInternalLinks(lesson, validIds, track));
      findings.push(...checkPersonaBleed(lesson, blacklist, track));
    }
  }

  // Sort: track first, then lesson id, then severity weight, then message.
  const severityRank: Record<Severity, number> = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
  };
  findings.sort((a, b) => {
    if (a.track !== b.track) return a.track.localeCompare(b.track);
    const aId = a.lessonId ?? -1;
    const bId = b.lessonId ?? -1;
    if (aId !== bId) return aId - bId;
    if (severityRank[a.severity] !== severityRank[b.severity]) {
      return severityRank[a.severity] - severityRank[b.severity];
    }
    return a.message.localeCompare(b.message);
  });

  // Emit each finding.
  let errorCount = 0;
  let warnCount = 0;
  for (const f of findings) {
    const idPart = f.lessonId === null ? '--' : `L${f.lessonId}`;
    const line = `[${idPart} ${f.track}] ${f.severity}: ${f.message}`;
    if (f.severity === 'ERROR') {
      errorCount++;
      console.error(line);
    } else if (f.severity === 'WARN') {
      warnCount++;
      console.warn(line);
    } else {
      console.log(line);
    }
  }

  console.log(
    `\nLinted ${lessonsLinted} lessons across ${tracksLinted} tracks: ${errorCount} errors, ${warnCount} warnings`,
  );
  return errorCount > 0 ? 1 : 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error('Lint script crashed:', err);
    process.exit(2);
  });
