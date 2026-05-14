# Missing Quizzes — Tracking File

> Auto-maintained by `masterkurs-lesson-creator` skill (Phase 2+).
> Whenever a lesson is created without a quiz stub, the lesson ID lands here so the gap stays visible.

## Pre-existing gaps (audit 2026-05-13)

The bug-hunter audit on the `claude-code` track surfaced **7 lessons without any quiz coverage** in `claude-code-masterkurs/src/data/quizzes.ts`. Phase 2 of the multi-track plan introduces a quiz-stub gate so this can no longer happen silently going forward, but these legacy lessons still need backfill:

| Lesson ID | Track | Reason | Status |
|-----------|-------|--------|--------|
| 30 | claude-code | Imported pre-quiz-gate | Open |
| 31 | claude-code | Imported pre-quiz-gate | Open |
| 44 | claude-code | Imported pre-quiz-gate | Open |
| 45 | claude-code | Imported pre-quiz-gate | Open |
| 46 | claude-code | Imported pre-quiz-gate | Open |
| 47 | claude-code | Imported pre-quiz-gate | Open |
| 48 | claude-code | Imported pre-quiz-gate | Open |

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

_(none yet — will populate as quizzes are backfilled)_
