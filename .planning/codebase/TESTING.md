# Testing Patterns

**Analysis Date:** 2026-02-05

## Test Framework

**Runner:**
- No testing framework configured
- No test files exist in the codebase

**Assertion Library:**
- Not applicable

**Run Commands:**
```bash
npm run lint          # Run ESLint (only automated check)
npm run build         # TypeScript compilation check
npm run preview       # Manual testing after build
```

## Test File Organization

**Location:**
- No test files currently exist
- Empty directories prepared: `src/hooks/` could hold test utilities

**Naming:**
- Not established (no tests)

**Recommended Structure:**
```
src/
  store/
    userProgress.ts
    userProgress.test.ts    # Co-located tests
  components/
    Quiz/
      QuizComponent.tsx
      QuizComponent.test.tsx
```

## Manual Testing Approach

**From CONTRIBUTING.md:**
```markdown
### Manuelles Testing
1. Starte Dev Server: `npm run dev`
2. Navigiere durch neue Lektion
3. Teste Quiz Funktionalität
4. Prüfe Code Copy Funktionen
5. Teste auf verschiedenen Bildschirmgrößen
```

**Build Testing:**
```bash
npm run build         # Verify TypeScript compiles
npm run preview       # Test production build locally
```

## Test Structure

**Not yet established**

Recommended pattern for future tests:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('ModuleName', () => {
  describe('functionName', () => {
    beforeEach(() => {
      // reset state
    });

    it('should handle valid input', () => {
      // arrange
      // act
      // assert
    });
  });
});
```

## Mocking

**Framework:**
- Not configured

**Recommended Approach:**
- Vitest built-in mocking (vi.mock)
- Mock localStorage for store tests
- Mock Prism.js for content tests

## Coverage

**Requirements:**
- No coverage tracking
- No enforced thresholds

**Recommended Setup:**
```bash
# Future vitest.config.ts
npm run test:coverage
```

## Test Types

**Unit Tests:**
- Not implemented
- Priority targets:
  - `src/store/userProgress.ts` (store actions)
  - Quiz scoring logic
  - Progress calculations

**Integration Tests:**
- Not implemented
- Priority targets:
  - Lesson navigation flow
  - Quiz completion flow

**E2E Tests:**
- Not implemented
- Would require Playwright or Cypress

## Quality Assurance

**Current Approach:**
- TypeScript strict mode for compile-time checks
- ESLint for code quality
- Manual browser testing

**PR Checklist (from CONTRIBUTING.md):**
- [ ] Code ist getestet (manual)
- [ ] Keine TypeScript Errors
- [ ] README aktualisiert (falls nötig)
- [ ] Content ist vollständig
- [ ] Quiz ist funktional

## Recommended Test Priorities

**High Priority (Critical Logic):**
1. `src/store/userProgress.ts` - Streak calculation, quiz scoring
2. `src/components/Quiz/QuizComponent.tsx` - Answer validation

**Medium Priority (UI Logic):**
3. `src/pages/DashboardView.tsx` - Progress calculations
4. `src/components/Lessons/LessonContent.tsx` - Content rendering

**Low Priority (Simple Components):**
5. `src/components/Navigation/Navigation.tsx`
6. `src/pages/LessonView.tsx`

## Recommended Framework Setup

**Vitest (recommended for Vite projects):**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

---

*Testing analysis: 2026-02-05*
*Update when test patterns change*
