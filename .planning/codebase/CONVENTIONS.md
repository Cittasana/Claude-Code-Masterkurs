# Coding Conventions

**Analysis Date:** 2026-02-05

## Naming Patterns

**Files:**
- PascalCase for React components: `Navigation.tsx`, `QuizComponent.tsx`, `LessonContent.tsx`
- camelCase for data files: `lessons.ts`, `quizzes.ts`
- camelCase for stores: `userProgress.ts`
- `*View.tsx` suffix for page components: `DashboardView.tsx`, `LessonView.tsx`

**Functions:**
- camelCase for all functions: `completeLesson()`, `handleAnswer()`, `checkAnswer()`
- `handle` prefix for event handlers: `handleAnswer()`, `handleNext()`, `handleCopy()`
- Action names in stores: `completeLesson`, `completeQuiz`, `incrementStreak`

**Variables:**
- camelCase for variables: `currentQuestion`, `isCorrect`, `totalPoints`
- `is` prefix for booleans: `isCorrect`, `isActive`, `isLastQuestion`
- Destructured props: `const { quiz } = props` or `({ quiz }: Props)`

**Types:**
- PascalCase for interfaces: `UserProgress`, `Quiz`, `Question`, `Props`
- PascalCase for type aliases: `QuizType`, `LessonContent`
- No `I` prefix for interfaces

## Code Style

**Formatting:**
- 2-space indentation
- Single quotes for strings in TypeScript/JavaScript
- Double quotes in JSX attributes
- Semicolons required
- ESLint configuration in `eslint.config.js` (Flat Config format)

**Linting:**
- ESLint with TypeScript support (`typescript-eslint`)
- React Hooks rules (`eslint-plugin-react-hooks`)
- React Refresh rules (`eslint-plugin-react-refresh`)
- Run: `npm run lint`

**TypeScript:**
- Strict mode enabled (`"strict": true`)
- `noUnusedLocals` and `noUnusedParameters` enabled
- Target: ES2022
- JSX: `react-jsx` (modern automatic transform)
- Config: `tsconfig.app.json`

## Import Organization

**Order:**
1. React and React-related packages (`react`, `react-router-dom`)
2. External packages (`zustand`, `lucide-react`, `prismjs`)
3. Internal modules (`../store/userProgress`, `../types`)
4. Relative imports (`./LessonContent`)

**Grouping:**
- No strict blank line between groups (convention varies)
- Type imports mixed with regular imports

**Path Aliases:**
- None configured (relative imports used)

## Error Handling

**Patterns:**
- ErrorBoundary at app root (`src/ErrorBoundary.tsx`)
- Try/catch in initialization (`src/main.tsx`)
- Optional chaining for potentially undefined values

**Error Types:**
- Generic Error objects
- No custom error classes

## Logging

**Framework:**
- Console methods only (console.log, console.error)
- No structured logging library

**Patterns:**
- Minimal logging in production code
- Error logging in catch blocks

## Comments

**When to Comment:**
- Section dividers in large files: `// ========================================`
- Section headers for type grouping: `// Lesson Types`, `// Quiz Types`
- Inline explanations for non-obvious logic

**JSDoc/TSDoc:**
- Not used
- Type safety relies on TypeScript interfaces

**TODO Comments:**
- Standard format: `// TODO: description`
- No tracking convention

## Function Design

**Size:**
- No strict limit
- Some larger functions exist (quiz scoring ~30 lines)

**Parameters:**
- Destructured objects common: `({ quiz }: Props)`
- Single object param for complex inputs

**Return Values:**
- Explicit return statements
- Implicit returns for simple arrow functions

## Module Design

**Exports:**
- Named exports for components and functions
- Default export not used consistently
- Single export per file typical

**Component Pattern:**
- Functional components only (except ErrorBoundary class)
- Hooks for state and side effects
- Props interface defined per component

```typescript
// Standard component pattern
interface Props {
  quiz: Quiz;
}

const QuizComponent = ({ quiz }: Props) => {
  const [state, setState] = useState<Type>(initial);
  // ...
  return <div>...</div>;
};
```

**Store Pattern (Zustand):**
```typescript
// From src/store/userProgress.ts
export const useUserProgress = create<UserProgressStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      actionName: (param) => set((state) => ({ ...updates })),
    }),
    { name: 'storage-key' }
  )
);
```

---

*Convention analysis: 2026-02-05*
*Update when patterns change*
