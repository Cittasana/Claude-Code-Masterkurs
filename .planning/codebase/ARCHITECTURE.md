# Architecture

**Analysis Date:** 2026-02-05

## Pattern Overview

**Overall:** Single Page Application (SPA) - Layered with Component-Based Architecture

**Key Characteristics:**
- Client-side SPA with no backend API
- React Router for client-side routing
- Zustand for centralized state management with localStorage persistence
- Static data files for content (lessons, quizzes)
- Full TypeScript with shared type definitions

## Layers

**Entry Point & Initialization:**
- Purpose: Bootstrap React application
- Contains: HTML host, React initialization, error boundary setup
- Location: `index.html`, `src/main.tsx`
- Depends on: React, ErrorBoundary component

**Application Shell:**
- Purpose: Root component with routing configuration
- Contains: Route definitions, session tracking
- Location: `src/App.tsx`
- Depends on: React Router, pages, store

**Presentation Layer (Pages):**
- Purpose: Full-page view components
- Contains: DashboardView, LessonView, ProjectView
- Location: `src/pages/*.tsx`
- Depends on: Components, store, data, types

**Component Layer:**
- Purpose: Reusable UI components
- Contains: Navigation, LessonContent, QuizComponent
- Location: `src/components/*/`
- Depends on: Types, store, UI libraries (Lucide, Prism)

**State Management Layer:**
- Purpose: Global user progress state with persistence
- Contains: Zustand store with actions
- Location: `src/store/userProgress.ts`
- Depends on: Zustand, types

**Data Layer:**
- Purpose: Static content definitions
- Contains: Lesson content, quiz questions
- Location: `src/data/lessons.ts`, `src/data/quizzes.ts`
- Depends on: Types only

**Type System:**
- Purpose: Centralized TypeScript interfaces
- Contains: Lesson, Quiz, Project, UserProgress types
- Location: `src/types/index.ts`
- Depends on: Nothing (core)

## Data Flow

**App Initialization Flow:**

1. Browser loads `index.html`
2. `main.tsx` initializes React with async loading
3. App component mounts with ErrorBoundary wrapper
4. `useUserProgress` hook loads persisted store from localStorage
5. `incrementStreak` action fires on app load
6. React Router renders active page

**Lesson Learning Flow:**

1. User clicks lesson link
2. LessonView page mounts with lesson ID parameter
3. Lesson data fetched from lessons array
4. LessonContent renders content blocks with syntax highlighting
5. User completes lesson (button click)
6. `completeLesson` action updates store
7. Store persists to localStorage
8. Navigate to next lesson or dashboard

**Quiz Interaction Flow:**

1. Quiz loaded alongside lesson
2. QuizComponent displays questions sequentially
3. User selects answer, sees immediate feedback
4. Attempt counter increments on wrong answers
5. After all questions answered, final score calculated
6. `completeQuiz` action saves result to store
7. Points added to totalPoints
8. Store persisted to localStorage

**State Management:**
- File-based: All state lives in localStorage via Zustand persist
- No persistent server state
- Each page load restores state from localStorage

## Key Abstractions

**Store Pattern (Zustand):**
- Purpose: Type-safe global state access
- Examples: `useUserProgress` hook
- Pattern: State + Actions combined in single hook with persist middleware
- Location: `src/store/userProgress.ts`

**Page Components:**
- Purpose: Full-page views with data fetching
- Examples: `DashboardView`, `LessonView`, `ProjectView`
- Pattern: Route-matched components with store access
- Location: `src/pages/*.tsx`

**Feature Components:**
- Purpose: Reusable UI for specific features
- Examples: `Navigation`, `LessonContent`, `QuizComponent`
- Pattern: Props-driven functional components
- Location: `src/components/*/`

**Content Types:**
- Purpose: Polymorphic content rendering
- Examples: text, code, highlight, list, yaml, heading blocks
- Pattern: Type-based conditional rendering in LessonContent
- Location: `src/types/index.ts`, `src/components/Lessons/LessonContent.tsx`

## Entry Points

**Main Application Entry:**
- Location: `src/main.tsx`
- Triggers: Browser loads application
- Responsibilities: Mount React app, handle async loading errors

**Router Entry:**
- Location: `src/App.tsx`
- Triggers: Application mount
- Responsibilities: Define routes, track session, render pages

**HTML Root:**
- Location: `index.html`
- Triggers: Initial page load
- Responsibilities: Provide root div, load module script

## Error Handling

**Strategy:** Component-level error boundaries with fallback UI

**Patterns:**
- ErrorBoundary wraps entire app (`src/ErrorBoundary.tsx`)
- Try/catch in main.tsx for initialization errors
- Fallback error display with stack trace in development

## Cross-Cutting Concerns

**Logging:**
- Console.log for development debugging
- No structured logging

**Validation:**
- TypeScript compile-time validation
- No runtime validation library

**Styling:**
- Tailwind CSS utility classes
- Custom CSS components in `src/index.css`
- GitHub dark theme colors via Tailwind config

---

*Architecture analysis: 2026-02-05*
*Update when major patterns change*
