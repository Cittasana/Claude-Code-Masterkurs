// ────────────────────────────────────────────────────────────────
// Re-export shim — Phase 0c of the Multi-Track Plattform plan.
//
// The real Claude-Code-track lesson content moved to
// `src/data/lessons-claude-code.ts`. This shim keeps the legacy
// `from './data/lessons'` (and `from '../data/lessons.js'`) imports
// working for one release cycle while consumers migrate to the
// track-aware `lessonsLoader` pattern from `src/data/tracks.ts`.
//
// Deprecation timeline:
//   • Phase 0c (this commit): re-export only
//   • Phase 1: codemod existing imports to use `tracks.ts`
//   • Phase 2: this file becomes empty; warning emitted on import
//   • Phase 3: file deleted
//
// Do NOT add new content to this file. Add lessons to
// `lessons-claude-code.ts` (or the appropriate per-track file).
// ────────────────────────────────────────────────────────────────

export { lessons } from './lessons-claude-code';
