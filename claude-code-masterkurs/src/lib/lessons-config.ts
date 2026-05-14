// ─────────────────────────────────────────────────────────────
// Shared Lessons Config – Free Tier Constants (Frontend)
// ─────────────────────────────────────────────────────────────

import type { TrackKey } from '../types';

/**
 * Number of `claude-code` lessons accessible without any subscription
 * (0-indexed IDs: 0..4). Kept exported for backwards compatibility —
 * existing callers (PaywallOverlay, StartKostenlosView) import this
 * constant directly.
 *
 * Phase 1 of the multi-track plan generalises this into a per-track
 * map (`FREE_TIER_LIMITS` below). The constant remains the canonical
 * source of truth for the `claude-code` track and the map references it.
 */
export const FREE_LESSON_LIMIT = 5;

/**
 * Phase 1 of multi-track plan: per-track free-tier limits.
 *
 * Different tracks expose a different number of free lessons as their
 * teaser. Keys are kept loose (`string`) so a track can be pre-seeded
 * here before it lands in the `TrackKey` union (e.g. `freelancer` is
 * declared on `feature/multi-track-freelancer` and not yet in the
 * union on this branch — pre-seeding the value avoids a follow-up edit
 * once that branch merges).
 *
 * Phase 1 starting values (revisit when track content lands):
 *   - claude-code:    5  (live, references FREE_LESSON_LIMIT)
 *   - freelancer:     2  (teaser per locked plan decision)
 *   - claude-desktop: 0  (pre-launch, no free content yet)
 *   - codex:          0  (pre-launch, no free content yet)
 *   - local-llm:      0  (pre-launch, no free content yet)
 */
export const FREE_TIER_LIMITS: Record<string, number> = {
  'claude-code': FREE_LESSON_LIMIT,
  freelancer: 2,
  'claude-desktop': 0,
  codex: 0,
  'local-llm': 0,
};

/**
 * Default track used when callers don't pass an explicit `track` arg.
 * Matches `DEFAULT_TRACK` in src/data/tracks.ts — kept in sync so the
 * legacy single-track behaviour (treat everything as `claude-code`)
 * continues to work for un-migrated call sites.
 */
const DEFAULT_TRACK_KEY: TrackKey = 'claude-code';

/**
 * Get the free-tier lesson limit for a given track. Useful for UI
 * badges like "5 kostenlose Lektionen". Falls back to the
 * `claude-code` limit when called without a track (legacy callers)
 * and to `0` for an unknown track key (defensive — should never
 * happen in practice once all tracks are registered in the map).
 *
 * Phase 1 of multi-track plan — see plan doc for per-track decisions.
 */
export function getFreeTierLimit(track?: TrackKey): number {
  const key = track ?? DEFAULT_TRACK_KEY;
  return FREE_TIER_LIMITS[key] ?? 0;
}

/**
 * Check if a lesson is in the free tier (client-side, for UI display).
 *
 * Phase 1 of multi-track plan: signature extended with optional
 * `track` arg. Defaults to `'claude-code'` so existing callers
 * (`isFreeTierLesson(7)`) continue to work unchanged. New per-track
 * call sites should pass the lesson's track explicitly.
 */
export function isFreeTierLesson(lessonId: number, track?: TrackKey): boolean {
  return lessonId < getFreeTierLimit(track);
}
