# 🏗️ Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLAUDE CODE MASTERKURS                    │
│                     React SPA with TypeScript                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │          React Router (Navigation)        │
        └──────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
     ┌──────────┐      ┌──────────┐     ┌──────────┐
     │Dashboard │      │ Lessons  │     │Projects  │
     │   View   │      │   View   │     │   View   │
     └──────────┘      └──────────┘     └──────────┘
            │                 │                 │
            └─────────────────┼─────────────────┘
                              ▼
                    ┌──────────────────┐
                    │ Zustand Store    │
                    │ (User Progress)  │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  LocalStorage    │
                    │  (Persistence)   │
                    └──────────────────┘
```

## Component Hierarchy

```
App
├── ErrorBoundary (fehlertolerantes Rendering)
├── Router
│   ├── Navigation
│   │   ├── Logo
│   │   ├── Nav Items
│   │   └── Stats (Streak, Points)
│   │
│   └── Routes
│       ├── / → DashboardView
│       │   ├── Progress Overview
│       │   ├── Level Breakdown
│       │   ├── Quiz Stats
│       │   ├── Skill Progress
│       │   └── Certification Progress
│       │
│       ├── /lesson/:id → LessonView
│       │   ├── Lesson Header
│       │   ├── Learning Objectives
│       │   ├── LessonContent
│       │   │   ├── Heading
│       │   │   ├── Text
│       │   │   ├── List
│       │   │   ├── Code Block (+ Copy)
│       │   │   ├── Highlight Box
│       │   │   └── YAML
│       │   ├── QuizComponent
│       │   │   ├── Question Display
│       │   │   ├── Answer Input
│       │   │   ├── Hints
│       │   │   ├── Feedback
│       │   │   └── Progress Bar
│       │   └── Navigation (Prev/Next)
│       │
│       └── /project/:id → ProjectView
│           └── Coming Soon Placeholder
```

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                      USER ACTION                         │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │      React Component           │
        │  (DashboardView, LessonView)   │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │      Zustand Action            │
        │  (completeLesson, etc.)        │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │      State Update              │
        │  (lessonsCompleted, points)    │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │      LocalStorage Persist      │
        │  (Automatic via Middleware)    │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │      UI Re-render              │
        │  (Progress updates visible)    │
        └────────────────────────────────┘
```

## State Management Architecture

```typescript
// Store Structure
{
  // User Progress State
  lessonsCompleted: number[],      // [0, 1, 2]
  quizzesCompleted: QuizResult[],  // [{quizId, score, ...}]
  projectsCompleted: ProjectResult[],
  currentLesson: number,            // 2
  totalPoints: number,              // 150
  streak: number,                   // 5
  lastSessionDate: string,          // ISO String
  timeInvested: number,             // Minutes
  skillProgress: {                  // 0-100%
    installation: 100,
    claudeMd: 50,
    mcpIntegration: 30,
    customAgents: 0,
    productionReady: 0
  },

  // Actions
  completeLesson: (id) => void,
  completeQuiz: (result) => void,
  completeProject: (result) => void,
  setCurrentLesson: (id) => void,
  incrementStreak: () => void,
  addTimeInvested: (minutes) => void,
  updateSkillProgress: (skill, value) => void,
  resetProgress: () => void,

  // Getters
  getQuizResult: (quizId) => QuizResult | undefined,
  getProjectResult: (projectId) => ProjectResult | undefined
}
```

## Content Data Structure

```typescript
// Lesson Structure
{
  id: number,
  level: 1 | 2 | 3,
  title: string,
  description: string,
  duration: string,
  objectives: string[],
  content: [
    { type: 'heading', content: '...' },
    { type: 'text', content: '...' },
    { type: 'list', content: '...' },
    { type: 'code', language: 'bash', content: '...' },
    { type: 'highlight', title: '...', content: '...' },
    { type: 'yaml', content: '...' }
  ]
}

// Quiz Structure
{
  id: string,
  lessonId: number,
  title: string,
  type: 'multiple-choice' | 'checklist',
  points: number,
  passingScore: number,
  maxAttempts: number,
  questions: [
    {
      id: string,
      text: string,
      type: 'radio' | 'checkbox',
      options: [...],
      correctAnswer: string | boolean,
      explanation: string,
      hints: string[]
    }
  ]
}
```

## Routing Architecture

```typescript
// Route Configuration
<Routes>
  <Route path="/" element={<DashboardView />} />
  <Route path="/lesson/:id" element={<LessonView />} />
  <Route path="/project/:id" element={<ProjectView />} />
  <Route path="/dashboard" element={<DashboardView />} />
</Routes>

// Navigation Flow
Home (/) → Dashboard
         → Lesson 0 → Lesson 1 → Lesson 2 → ... → Dashboard
         → Projects → Coming Soon
```

## File Organization

```
src/
├── components/              # Reusable UI Components
│   ├── Navigation/          # Header & Nav
│   ├── Lessons/             # Lesson-specific
│   ├── Quiz/                # Quiz System
│   ├── Dashboard/           # Dashboard widgets (Reserved)
│   ├── Projects/            # Project components (Reserved)
│   ├── CodeEditor/          # Code playground (Reserved)
│   └── UI/                  # Generic UI (Reserved)
│
├── pages/                   # Route Pages
│   ├── DashboardView.tsx    # Main dashboard
│   ├── LessonView.tsx       # Lesson detail
│   └── ProjectView.tsx      # Project detail
│
├── store/                   # State Management
│   └── userProgress.ts      # Zustand store
│
├── data/                    # Static Content
│   ├── lessons.ts           # Lesson content
│   └── quizzes.ts           # Quiz definitions
│
├── types/                   # TypeScript Types
│   └── index.ts             # All interfaces
│
├── hooks/                   # Custom Hooks (Reserved)
│
├── App.tsx                  # Main App
├── main.tsx                 # Entry Point
└── index.css                # Global Styles
```

## Type System

```typescript
// Core Types
Lesson                      // Lesson data structure
LessonContent              // Content block types
Quiz                       // Quiz structure
QuizType                   // Quiz type enum
Question                   // Question structure
QuizOption                 // Answer option
Project                    // Project structure
ProjectValidation          // Validation tests
UserProgress               // User state
QuizResult                 // Quiz completion data
ProjectResult              // Project completion data
SkillProgress              // Skill tracking
DashboardStats             // Dashboard metrics
Feature                    // Feature reference
```

## Build Architecture

```
Source (src/)
    ↓ TypeScript Compilation
Transpiled JavaScript
    ↓ Vite Bundling
Optimized Bundle
    ↓ Code Splitting
Chunked Assets
    ↓ Minification
Production Build (dist/)
```

## Build Output

```
dist/
├── index.html                    # Entry HTML
├── assets/
│   ├── index-[hash].js          # Main JS bundle (~380KB)
│   ├── index-[hash].css         # Styles (~12KB)
│   └── react-[hash].js          # React vendor chunk
└── vite.svg                     # Logo

Total: ~400KB (gzipped: ~125KB)
```

## Performance Optimizations

```
1. Code Splitting
   ├── Route-based splitting (React Router)
   ├── Component lazy loading
   └── Vendor chunk separation

2. Asset Optimization
   ├── CSS minification
   ├── JS minification
   ├── Tree shaking
   └── Gzip compression

3. Runtime Optimization
   ├── React.memo for components
   ├── useMemo for expensive computations
   ├── useCallback for event handlers
   └── Virtual scrolling (wenn nötig)

4. State Management
   ├── Selective re-renders
   ├── LocalStorage batching
   └── Debounced updates
```

## Security Considerations

```
1. XSS Prevention
   ├── React's built-in escaping
   ├── No dangerouslySetInnerHTML (except Prism)
   └── Sanitized user input

2. Data Storage
   ├── LocalStorage (client-side only)
   ├── No sensitive data stored
   └── No API keys in frontend

3. Dependencies
   ├── Regular npm audit
   ├── Updated dependencies
   └── No known vulnerabilities

4. Content Security
   ├── No inline scripts
   ├── CSP-ready architecture
   └── HTTPS for production
```

## Extensibility Points

```
1. New Content Types
   ├── Add to LessonContent type
   ├── Implement renderer in LessonContent.tsx
   └── Update lessons.ts format

2. New Quiz Types
   ├── Add to QuizType enum
   ├── Implement in QuizComponent.tsx
   └── Update validation logic

3. New Pages
   ├── Create in pages/
   ├── Add route in App.tsx
   └── Update navigation

4. New State
   ├── Extend UserProgress interface
   ├── Add actions to store
   └── Update persistence

5. New Components
   ├── Create in components/
   ├── Follow naming convention
   └── Export from index
```

## Testing Strategy (Future)

```
1. Unit Tests
   ├── Components (React Testing Library)
   ├── Store (Zustand tests)
   ├── Utils (Jest)
   └── Types (TypeScript)

2. Integration Tests
   ├── User flows (Cypress/Playwright)
   ├── Navigation (React Router)
   └── State persistence (LocalStorage)

3. E2E Tests
   ├── Complete lesson flow
   ├── Quiz completion
   └── Progress tracking

4. Performance Tests
   ├── Lighthouse CI
   ├── Bundle size monitoring
   └── Load time tracking
```

## Deployment Architecture

```
Development
    ├── Local Dev Server (Vite)
    ├── Hot Module Replacement
    └── Source Maps

Staging (Optional)
    ├── Preview Deploy (Vercel/Netlify)
    ├── Branch Deploys
    └── PR Previews

Production
    ├── Optimized Build
    ├── CDN Distribution
    ├── HTTPS
    └── Monitoring
```

## Scaling Considerations

```
Current (MVP)
├── LocalStorage (< 5MB)
├── Client-side only
└── Static hosting

Future (Phase 2+)
├── Backend API (optional)
│   ├── User authentication
│   ├── Cloud sync
│   └── Analytics
├── Database
│   ├── User profiles
│   ├── Progress data
│   └── Community content
└── CDN
    ├── Static assets
    ├── Video content
    └── Images
```

## Design Patterns Used

```
1. Component Patterns
   ├── Functional Components
   ├── Custom Hooks
   ├── Render Props (Quiz)
   └── Compound Components (Navigation)

2. State Patterns
   ├── Global State (Zustand)
   ├── Local State (useState)
   ├── Derived State (useMemo)
   └── Persistent State (LocalStorage)

3. Routing Patterns
   ├── Route-based code splitting
   ├── Dynamic routing (:id)
   └── Programmatic navigation

4. Data Patterns
   ├── Static data (lessons.ts)
   ├── Type-safe data (TypeScript)
   └── Immutable updates (Zustand)
```

## Key Architectural Decisions

```
1. Why React?
   ✓ Component-based
   ✓ Large ecosystem
   ✓ TypeScript support
   ✓ Fast development

2. Why Zustand over Redux?
   ✓ Simpler API
   ✓ Less boilerplate
   ✓ Sufficient for MVP
   ✓ Easy to learn

3. Why Tailwind CSS?
   ✓ Utility-first
   ✓ Fast styling
   ✓ Consistent design
   ✓ Small bundle

4. Why Vite over CRA?
   ✓ Faster builds
   ✓ Better DX
   ✓ ES Modules
   ✓ Modern tooling

5. Why LocalStorage?
   ✓ Simple
   ✓ No backend needed
   ✓ Instant persistence
   ✓ Good for MVP
```

---

**Architecture Version**: 1.0.0 (MVP)
**Last Updated**: 2026-02-05
**Status**: ✅ Stable & Production Ready
