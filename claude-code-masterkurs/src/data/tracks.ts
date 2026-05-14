// ────────────────────────────────────────────────────────────────
// Multi-Track Registry (Phase 0b of the Multi-Track Plattform plan)
// See ~/.claude/plans/abstract-moseying-sutton.md §"Phase 0".
//
// Single source of truth for the 4 learning tracks: their slug, color,
// label, marketing hook, lesson loader, and tutor-persona path.
//
// Adding a new track:
//   1. Add it to TrackKey in src/types/index.ts
//   2. Add an entry below
//   3. Register a Stripe product in server/lib/stripe.ts
//   4. Add a placeholder Lessons-Loader (returns []) until content lands
//   5. Phase-1 UI components consume `TRACKS` directly — no other wiring
//      should be necessary.
// ────────────────────────────────────────────────────────────────

import type { Lesson, TrackKey } from '../types';
import { lessons as claudeCodeLessons } from './lessons';

export interface TrackDef {
  /** Stable URL slug (e.g. /tracks/claude-code) — never change after launch. */
  slug: string;
  /** Display label in current UI locale. */
  label: string;
  /** Short marketing hook for landing-page track-card. */
  marketingHook: string;
  /** Brand color for accents (Cittasana Ethereal Glass palette). */
  color: string;
  /** Lessons available in this track. */
  lessonsLoader: () => Lesson[];
  /**
   * Path to the tutor's persona MD file inside masterkurs-agent/track-configs/.
   * The tutor-chat API loads this at session-start to set the system prompt.
   */
  tutorPersonaPath: string;
  /**
   * Whether the track is publicly visible. Pre-launch tracks should be
   * `false` (hides from track-switcher and landing track-cards) until
   * Phase 4 content seeding is complete and the track is ready to sell.
   */
  isPublic: boolean;
}

/**
 * Track registry. Order = display order on landing page.
 *
 * `lessonsLoader` is intentionally a function, not direct array access:
 *   - Avoids loading non-active tracks' lesson modules in the SPA bundle
 *   - Allows track-specific data files (lessons-codex.ts etc.) to be
 *     code-split per track route in Phase 1.
 */
export const TRACKS: Record<TrackKey, TrackDef> = {
  'claude-code': {
    slug: 'claude-code',
    label: 'Claude Code',
    marketingHook: 'Anthropics CLI-Agent meistern: Skills, Hooks, MCP, Multi-Agent.',
    color: '#FF6B1A', // cittasana orange
    lessonsLoader: () => claudeCodeLessons,
    tutorPersonaPath: 'track-configs/claude-code/tutor-persona.md',
    isPublic: true,
  },
  'claude-desktop': {
    slug: 'claude-desktop',
    label: 'Claude Desktop',
    marketingHook: 'claude.ai-App, Projects, Artifacts, Computer Use, Voice — der Cloud-Kompanion.',
    color: '#D4A574',
    lessonsLoader: () => [],
    tutorPersonaPath: 'track-configs/claude-desktop/tutor-persona.md',
    isPublic: false,
  },
  codex: {
    slug: 'codex',
    label: 'OpenAI Codex',
    marketingHook: 'Codex CLI, Cloud, JetBrains, ChatGPT-Integration — GPT-5.5-Klasse für Profis.',
    color: '#10A37F', // openai green
    lessonsLoader: () => [],
    tutorPersonaPath: 'track-configs/codex/tutor-persona.md',
    isPublic: false,
  },
  'local-llm': {
    slug: 'local-llm',
    label: 'Lokale LLMs',
    marketingHook: 'Ollama · LM Studio · MLX mit Qwen3-Coder · Devstral · GLM-4.7 — EU-AI-Act-konform.',
    color: '#7C3AED', // purple
    lessonsLoader: () => [],
    tutorPersonaPath: 'track-configs/local-llm/tutor-persona.md',
    isPublic: false,
  },
};

/** All track keys, in display order. */
export const TRACK_KEYS: TrackKey[] = Object.keys(TRACKS) as TrackKey[];

/** Public-only track keys for landing/marketing surfaces. */
export const PUBLIC_TRACK_KEYS: TrackKey[] = TRACK_KEYS.filter((k) => TRACKS[k].isPublic);

/**
 * Resolve a track key from a slug. Returns null for unknown slugs so
 * route handlers can 404 cleanly.
 */
export function trackKeyFromSlug(slug: string): TrackKey | null {
  for (const key of TRACK_KEYS) {
    if (TRACKS[key].slug === slug) return key;
  }
  return null;
}

/**
 * The default track for legacy contexts that don't carry an explicit
 * track yet (Lesson.track undefined, single-track URL paths, etc.).
 * Matches the Prisma migration default — keep these in sync.
 */
export const DEFAULT_TRACK: TrackKey = 'claude-code';
