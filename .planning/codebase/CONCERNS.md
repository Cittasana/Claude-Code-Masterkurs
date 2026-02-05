# Codebase Concerns

**Analysis Date:** 2026-02-05

## Tech Debt

**Database queries pattern (inefficient filtering):**
- Issue: O(n*m) nested filtering runs on every render
- Files: `claude-code-masterkurs/src/pages/DashboardView.tsx` (lines 26-34)
- Why: Quick implementation during development
- Impact: Performance degrades with more lessons; calculations run repeatedly
- Fix approach: Create lookup map or memoize with useMemo

**Repeated array filtering:**
- Issue: Filters lessons array 3 times separately to count by level
- Files: `claude-code-masterkurs/src/pages/DashboardView.tsx` (lines 22-24)
- Why: Simple implementation
- Impact: Unnecessary iterations; minor performance cost
- Fix approach: Single pass to count by level

**Large data files:**
- Issue: Entire lesson/quiz datasets imported into bundle
- Files: `claude-code-masterkurs/src/data/lessons.ts` (3,294 lines), `claude-code-masterkurs/src/data/quizzes.ts` (2,244 lines)
- Why: Simple static data approach
- Impact: Larger initial bundle; no lazy-loading
- Fix approach: Code-split by lesson or implement dynamic imports

## Known Bugs

**Duplicate quiz/project scoring:**
- Symptoms: Points accumulate incorrectly when retaking quizzes
- Trigger: Complete quiz, retake with lower score, points still increase
- Files: `claude-code-masterkurs/src/store/userProgress.ts` (lines 52-72, 90)
- Root cause: `totalPoints` always adds new score without subtracting old
- Fix: Check for existing result and subtract old score before adding new

## Security Considerations

**XSS via dangerouslySetInnerHTML:**
- Risk: Prism-highlighted code inserted via dangerouslySetInnerHTML
- Files: `claude-code-masterkurs/src/components/Lessons/LessonContent.tsx` (line 103)
- Current mitigation: Prism.js escapes output safely
- Recommendations: Consider React-based syntax highlighter or sanitization layer

**Error display with innerHTML:**
- Risk: Stack traces rendered via document.body.innerHTML
- Files: `claude-code-masterkurs/src/main.tsx` (lines 12, 24)
- Current mitigation: Error content is application-generated, not user input
- Recommendations: Use React rendering for error display

**Missing clipboard API error handling:**
- Risk: Silent failure if clipboard access denied
- Files: `claude-code-masterkurs/src/components/Lessons/LessonContent.tsx` (line 31)
- Current mitigation: None
- Recommendations: Add try/catch and user feedback for failures

## Performance Bottlenecks

**Dashboard calculations on every render:**
- Problem: Progress statistics recalculated on each render
- Files: `claude-code-masterkurs/src/pages/DashboardView.tsx` (lines 22-34)
- Measurement: Not profiled, but O(n*m) complexity visible
- Cause: No memoization of derived values
- Improvement path: Use useMemo for expensive calculations

## Fragile Areas

**Quiz scoring logic:**
- Files: `claude-code-masterkurs/src/components/Quiz/QuizComponent.tsx` (lines 63-73)
- Why fragile: Multiple question types with different validation logic
- Common failures: Optional chaining returns undefined without error
- Safe modification: Add comprehensive null checks
- Test coverage: No automated tests

**Streak calculation:**
- Files: `claude-code-masterkurs/src/store/userProgress.ts` (lines 99-118)
- Why fragile: Date math with edge cases (timezones, day boundaries)
- Common failures: Incorrect streak reset/increment
- Safe modification: Add unit tests before changes
- Test coverage: No automated tests

## Dependencies at Risk

**Minor outdated packages:**
- `@types/node`: 24.10.11 (latest 25.x)
- `tailwindcss`: 3.4.19 (latest 4.x - major version)
- Risk: Low - no security vulnerabilities
- Migration plan: Run `npm update` for minor versions; evaluate Tailwind 4 migration separately

**No vulnerabilities:**
- `npm audit` returns 0 vulnerabilities

## Missing Critical Features

**ProjectView placeholder:**
- Problem: Projects page shows "Coming soon" with no functionality
- Files: `claude-code-masterkurs/src/pages/ProjectView.tsx`
- Current workaround: Users cannot access project features
- Blocks: Project-based learning completion
- Implementation complexity: Medium (need project data structure and UI)

## Test Coverage Gaps

**Store logic untested:**
- What's not tested: `useUserProgress` actions, streak calculation, scoring
- Files: `claude-code-masterkurs/src/store/userProgress.ts`
- Risk: Scoring bugs, streak logic errors go undetected
- Priority: High
- Difficulty to test: Low - pure functions, mockable localStorage

**Quiz component untested:**
- What's not tested: Answer validation, score calculation, question navigation
- Files: `claude-code-masterkurs/src/components/Quiz/QuizComponent.tsx`
- Risk: Quiz logic bugs affect user experience
- Priority: High
- Difficulty to test: Medium - requires component rendering

**Dashboard calculations untested:**
- What's not tested: Progress percentage calculations, level completion counts
- Files: `claude-code-masterkurs/src/pages/DashboardView.tsx`
- Risk: Incorrect progress display
- Priority: Medium
- Difficulty to test: Low - extractable pure functions

## Type Safety Issues

**Use of `any` type:**
- Files: `claude-code-masterkurs/src/main.tsx` (line 22: `err: any`)
- Files: `claude-code-masterkurs/src/components/Quiz/QuizComponent.tsx` (lines 15, 25: `Record<string, any>`)
- Risk: TypeScript benefits defeated; runtime errors possible
- Fix: Use proper Error type and specific answer types

---

## Summary

| Category | Severity | Count |
|----------|----------|-------|
| Security | Medium | 3 |
| Performance | Medium | 2 |
| Logic Bugs | Medium | 1 |
| Missing Tests | High | 5 areas |
| Type Safety | Low | 2 |
| Dependencies | Low | Minor updates |

## Recommended Priority Order

1. **Fix quiz scoring duplicate issue** - `userProgress.ts`
2. **Add tests for store and quiz** - Create test files
3. **Optimize dashboard calculations** - Add useMemo
4. **Add clipboard error handling** - `LessonContent.tsx`
5. **Replace `any` types** - Improve type safety
6. **Implement ProjectView** - Complete feature

---

*Concerns audit: 2026-02-05*
*Update as issues are fixed or new ones discovered*
