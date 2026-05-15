# Missing Quizzes — Tracking File

> Auto-maintained by `masterkurs-lesson-creator` skill (Phase 2+).
> Whenever a lesson is created without a quiz stub, the lesson ID lands here so the gap stays visible.

## Pre-existing gaps (audit 2026-05-13)

The bug-hunter audit on the `claude-code` track surfaced **7 lessons without any quiz coverage** in `claude-code-masterkurs/src/data/quizzes.ts`. Phase 2 of the multi-track plan introduces a quiz-stub gate so this can no longer happen silently going forward, but these legacy lessons still need backfill:

| Lesson ID | Track | Reason | Status |
|-----------|-------|--------|--------|
| _(none currently open — all 7 pre-existing gaps backfilled on 2026-05-15)_ | | | |

## How entries land here

The `masterkurs-lesson-creator` skill writes a row to this file whenever:
1. A new lesson is created and the user explicitly opts out of generating a quiz stub, or
2. The skill aborts the quiz-stub-write step due to an error (e.g., `quizzes.ts` parse failure)

## Closing entries

When a quiz is later added for a tracked lesson:
1. Verify the quiz exists in `claude-code-masterkurs/src/data/quizzes.ts`
2. Move the row from "Open" → "Closed (YYYY-MM-DD)"
3. Keep the row for audit history; do not delete

## Closed entries

### Closed (2026-05-15)

Backfilled in one batch via `feat(quizzes): backfill 7 missing quizzes for IDs 30/31/44-48`.
TypeScript build (`tsc -b --noEmit`) passes clean. Total quiz count: 42 → 49.

| Lesson ID | Track | Reason | Status | Quiz Entry |
|-----------|-------|--------|--------|------------|
| 30 | claude-code | Imported pre-quiz-gate | Closed (2026-05-15) | `quiz-30` — Voice Mode & Code Review Tool (6 Fragen) |
| 31 | claude-code | Imported pre-quiz-gate | Closed (2026-05-15) | `quiz-31` — 1M Context Window & Context Management (6 Fragen) |
| 44 | claude-code | Imported pre-quiz-gate | Closed (2026-05-15) | `quiz-44` — Advisor Tool — Cost-Aware Multi-Model (6 Fragen) |
| 45 | claude-code | Imported pre-quiz-gate | Closed (2026-05-15) | `quiz-45` — worktree.baseRef — Multi-Agent-Worktrees (5 Fragen) |
| 46 | claude-code | Imported pre-quiz-gate | Closed (2026-05-15) | `quiz-46` — Effort-aware Hooks (5 Fragen) |
| 47 | claude-code | Imported pre-quiz-gate | Closed (2026-05-15) | `quiz-47` — Multi-Agent Showdown (6 Fragen) |
| 48 | claude-code | Imported pre-quiz-gate | Closed (2026-05-15) | `quiz-48` — Skill-Antipatterns (5 Fragen) |
