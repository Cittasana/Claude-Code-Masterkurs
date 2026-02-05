# Technology Stack

**Analysis Date:** 2026-02-05

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (`package.json`, `tsconfig.app.json`)

**Secondary:**
- JavaScript (ESNext) - Config files (`vite.config.ts`, `tailwind.config.js`, `eslint.config.js`)
- CSS3 with PostCSS - Styling (`src/index.css`, `postcss.config.js`)
- HTML5 - Entry point (`index.html`)

## Runtime

**Environment:**
- Node.js (implied by package.json type: "module")
- Browser (Client-side SPA rendering)
- No runtime version file detected (.nvmrc, .node-version)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.2.0 - UI framework (`src/App.tsx`, `src/main.tsx`)
- React Router DOM 7.13.0 - Client-side routing (`src/App.tsx`)

**State Management:**
- Zustand 5.0.11 - State management with persist middleware (`src/store/userProgress.ts`)

**Testing:**
- No testing framework configured

**Build/Dev:**
- Vite 7.2.4 - Build tool and dev server (`vite.config.ts`)
- @vitejs/plugin-react 5.1.1 - React support in Vite
- TypeScript 5.9.3 - Type checking and compilation

## Key Dependencies

**Critical:**
- React 19.2.0 - Core UI framework
- Zustand 5.0.11 - User progress persistence to localStorage
- React Router DOM 7.13.0 - Page navigation and routing

**UI & Display:**
- Tailwind CSS 3.4.17 - Utility-first styling (`tailwind.config.js`)
- Lucide React 0.563.0 - Icon library
- Radix UI - Accessible UI primitives (`@radix-ui/react-progress`, `@radix-ui/react-tabs`)
- PrismJS 1.30.0 - Code syntax highlighting (`src/components/Lessons/LessonContent.tsx`)
- Chart.js 4.5.1 + react-chartjs-2 5.3.1 - Dashboard charts

**Infrastructure:**
- PostCSS 8.5.6 + Autoprefixer 10.4.24 - CSS processing
- clsx 2.1.1 - Class name utility

## Configuration

**Environment:**
- No `.env` files configured
- No environment variables required
- Configuration hardcoded in files (Tailwind theme in `tailwind.config.js`)

**Build:**
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript root configuration
- `tsconfig.app.json` - App TypeScript config (target: ES2022, JSX: react-jsx, strict mode)
- `tsconfig.node.json` - Node/build tool TypeScript config (target: ES2023)
- `tailwind.config.js` - Tailwind with GitHub dark mode color theme
- `postcss.config.js` - PostCSS plugins (tailwindcss, autoprefixer)
- `eslint.config.js` - ESLint flat config format

**Data Storage:**
- LocalStorage via Zustand persist middleware (key: `claude-code-masterkurs-progress`)

## Platform Requirements

**Development:**
- Any platform with Node.js
- No external dependencies (Docker, databases)

**Production:**
- Static hosting (builds to static files)
- No server-side rendering required

---

*Stack analysis: 2026-02-05*
*Update after major dependency changes*
