# Claude Code Masterkurs Redesign

## What This Is

A comprehensive visual redesign of the Claude Code Masterkurs educational platform, transforming it into a premium Apple-inspired experience with a grey and orange color palette. The platform teaches users how to master Claude Code through interactive lessons, quizzes, and projects.

## Core Value

**Create a visually stunning, Apple-quality learning experience** that feels premium and professional while maintaining the intuitive learning flow users expect from a modern educational platform.

## Requirements

### Validated

<!-- Shipped and confirmed valuable - inferred from existing codebase -->

- ✓ Lesson progression system with 3 difficulty levels — existing
- ✓ Interactive quiz system with multiple question types — existing
- ✓ User progress tracking with localStorage persistence — existing
- ✓ Dashboard with progress analytics and statistics — existing
- ✓ Code syntax highlighting with copy functionality — existing
- ✓ Streak tracking and points/gamification — existing
- ✓ Responsive navigation with user stats display — existing

### Active

<!-- Current scope. Building toward these. -->

- [ ] Apple-inspired design system with grey/orange palette
- [ ] Minimalist layouts with generous whitespace
- [ ] Bold SF Pro-style typography with clear hierarchy
- [ ] Subtle animations and micro-interactions
- [ ] Redesigned Dashboard with premium visual polish
- [ ] Redesigned Lesson view with improved content presentation
- [ ] Redesigned Quiz component with refined interactions
- [ ] Redesigned Navigation with Apple-style aesthetics
- [ ] Consistent component library across all pages
- [ ] Smooth page transitions and loading states

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Backend/API integration — this is a frontend redesign only
- New lesson content — focus is visual, not content creation
- Authentication system — not part of current scope
- Multi-language support — adds complexity without visual benefit

## Context

**Existing Codebase:**
- React 19.2 SPA with React Router 7.13
- Tailwind CSS 3.4 for styling (will be heavily modified)
- Zustand for state management (unchanged)
- Vite build system
- ~3,300 lines of lesson content, ~2,200 lines of quiz data

**Design Direction:**
- Apple design language: clean, minimal, confident
- Color palette: Grey tones (backgrounds, text) + Orange accents (CTAs, highlights)
- Typography: Large headlines, clear hierarchy, generous line-height
- Animations: Smooth, purposeful, not distracting

**Current State:**
- Functional but visually basic
- GitHub dark theme colors currently in use
- Components work but lack visual refinement
- See `.planning/codebase/` for detailed architecture

## Constraints

- **None specified** — Free to restructure components, change styling approach, add animation libraries as needed

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Apple design language | User preference for premium aesthetic | — Pending |
| Grey + Orange palette | Creates distinctive brand identity | — Pending |
| Full redesign scope | All pages need consistent treatment | — Pending |

---
*Last updated: 2026-02-05 after initialization*
