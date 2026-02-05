# Codebase Structure

**Analysis Date:** 2026-02-05

## Directory Layout

```
claude-code-masterkurs/
├── src/                          # Main source directory
│   ├── main.tsx                  # React app initialization
│   ├── App.tsx                   # Root component with routing
│   ├── ErrorBoundary.tsx         # Error boundary component
│   ├── index.css                 # Global Tailwind + custom styles
│   ├── App.css                   # App-specific styles
│   │
│   ├── pages/                    # Page-level components
│   │   ├── DashboardView.tsx     # Dashboard with progress analytics
│   │   ├── LessonView.tsx        # Lesson display view
│   │   └── ProjectView.tsx       # Project showcase (placeholder)
│   │
│   ├── components/               # Reusable UI components
│   │   ├── Navigation/
│   │   │   └── Navigation.tsx    # Header with nav and stats
│   │   ├── Lessons/
│   │   │   └── LessonContent.tsx # Content block renderer
│   │   ├── Quiz/
│   │   │   └── QuizComponent.tsx # Interactive quiz
│   │   ├── CodeEditor/           # (Empty - future)
│   │   ├── Dashboard/            # (Empty - future)
│   │   ├── Projects/             # (Empty - future)
│   │   └── UI/                   # (Empty - future)
│   │
│   ├── store/                    # Zustand state management
│   │   └── userProgress.ts       # User progress store
│   │
│   ├── types/                    # TypeScript definitions
│   │   └── index.ts              # All shared types
│   │
│   ├── data/                     # Static data files
│   │   ├── lessons.ts            # Lesson content (3,294 lines)
│   │   └── quizzes.ts            # Quiz definitions (2,244 lines)
│   │
│   ├── hooks/                    # (Empty - future)
│   │
│   └── assets/
│       └── react.svg
│
├── public/                       # Static assets
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Dependency lockfile
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
├── postcss.config.js             # PostCSS config
├── tsconfig.json                 # TypeScript root config
├── tsconfig.app.json             # App TypeScript config
├── tsconfig.node.json            # Node TypeScript config
├── eslint.config.js              # ESLint configuration
├── README.md                     # Project documentation
├── CONTRIBUTING.md               # Contribution guide
├── ARCHITECTURE.md               # Architecture docs
├── STATUS.md                     # Project status
└── CHANGELOG.md                  # Change history
```

## Directory Purposes

**src/pages/**
- Purpose: Full-page view components (route targets)
- Contains: `*View.tsx` components
- Key files: `DashboardView.tsx`, `LessonView.tsx`, `ProjectView.tsx`

**src/components/**
- Purpose: Reusable UI components organized by feature
- Contains: Feature directories with component files
- Key files: `Navigation/Navigation.tsx`, `Lessons/LessonContent.tsx`, `Quiz/QuizComponent.tsx`
- Subdirectories: Feature-based (Navigation, Lessons, Quiz) + empty future directories

**src/store/**
- Purpose: Zustand state management
- Contains: Store definitions with actions
- Key files: `userProgress.ts` (user progress with localStorage persistence)

**src/types/**
- Purpose: Centralized TypeScript type definitions
- Contains: Interface and type exports
- Key files: `index.ts` (Lesson, Quiz, Project, UserProgress types)

**src/data/**
- Purpose: Static content data
- Contains: Large TypeScript arrays with lesson/quiz content
- Key files: `lessons.ts` (3,294 lines), `quizzes.ts` (2,244 lines)

## Key File Locations

**Entry Points:**
- `index.html` - HTML host with root div
- `src/main.tsx` - React app bootstrap with error handling
- `src/App.tsx` - Root component with route definitions

**Configuration:**
- `vite.config.ts` - Vite dev server and build config
- `tsconfig.app.json` - App TypeScript settings (strict mode)
- `tailwind.config.js` - Tailwind with GitHub theme colors
- `eslint.config.js` - ESLint with TypeScript and React rules

**Core Logic:**
- `src/store/userProgress.ts` - State management and persistence
- `src/components/Quiz/QuizComponent.tsx` - Quiz interaction logic
- `src/pages/DashboardView.tsx` - Progress calculations

**Testing:**
- No test files currently exist

**Documentation:**
- `README.md` - User-facing project docs
- `CONTRIBUTING.md` - Developer contribution guide
- `ARCHITECTURE.md` - System architecture docs

## Naming Conventions

**Files:**
- PascalCase for React components: `Navigation.tsx`, `LessonContent.tsx`
- camelCase for utilities and data: `userProgress.ts`, `lessons.ts`
- `*View.tsx` suffix for page components: `DashboardView.tsx`

**Directories:**
- PascalCase for component directories: `Navigation/`, `Lessons/`
- lowercase for utility directories: `store/`, `types/`, `data/`
- Plural names for collections: `pages/`, `components/`

**Special Patterns:**
- Single component per directory with same name: `Navigation/Navigation.tsx`
- `index.ts` for type exports: `types/index.ts`

## Where to Add New Code

**New Page:**
- Primary code: `src/pages/[Name]View.tsx`
- Route: Add to `src/App.tsx` routes
- Types: Add to `src/types/index.ts` if needed

**New Component:**
- Implementation: `src/components/[Feature]/[Name].tsx`
- Types: Props interface in component file or `src/types/index.ts`

**New Data/Content:**
- Lessons: Add to `src/data/lessons.ts`
- Quizzes: Add to `src/data/quizzes.ts`
- Types: Update `src/types/index.ts`

**New Store:**
- Implementation: `src/store/[name].ts`
- Pattern: Follow `userProgress.ts` structure

**Utilities:**
- Shared helpers: `src/hooks/` (currently empty)
- Type definitions: `src/types/index.ts`

## Special Directories

**src/data/**
- Purpose: Static lesson and quiz content
- Source: Hand-authored content
- Committed: Yes
- Note: Large files (3,000+ lines each)

**Empty Future Directories:**
- `src/components/CodeEditor/` - Interactive code editor
- `src/components/Dashboard/` - Dashboard subcomponents
- `src/components/Projects/` - Project components
- `src/components/UI/` - Reusable UI primitives
- `src/hooks/` - Custom React hooks

---

*Structure analysis: 2026-02-05*
*Update when directory structure changes*
