export interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  estimatedHours: number;
  techStack: string[];
  features: string[];
  claudeMd: string;
  fileStructure: string;
  steps: ProjectTemplateStep[];
  githubUrl?: string;
}

export interface ProjectTemplateStep {
  title: string;
  description: string;
  claudePrompt: string;
}

export const projectTemplates: ProjectTemplate[] = [
  // ── Template 1: Todo-App ──────────────────────────────────
  {
    id: 'tpl-todo',
    title: 'Todo-App',
    description:
      'Eine moderne Todo-App mit React und TypeScript. Perfekt fuer Einsteiger, die ihre ersten Schritte mit Claude Code machen wollen.',
    difficulty: 1,
    estimatedHours: 4,
    techStack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'LocalStorage'],
    features: [
      'Todos erstellen, bearbeiten, loeschen',
      'Filter: Alle, Aktive, Erledigte',
      'LocalStorage Persistenz',
      'Responsive Design mit Tailwind',
      'Drag & Drop Sortierung',
    ],
    claudeMd: `# CLAUDE.md

## Project Overview
Eine moderne Todo-App gebaut mit React und TypeScript.
Single-Page-Application mit LocalStorage-Persistenz.

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: React useState + useReducer
- **Persistenz**: LocalStorage

## Architecture
\`\`\`
src/
├── components/     # UI-Komponenten (TodoItem, TodoList, FilterBar)
├── hooks/          # Custom Hooks (useTodos, useLocalStorage)
├── types/          # TypeScript Interfaces
└── utils/          # Hilfsfunktionen
\`\`\`

## Code Style
- Functional Components mit TypeScript
- camelCase fuer Variablen, PascalCase fuer Komponenten
- Tailwind fuer alle Styles (kein CSS)
- Prettier mit 2-Space-Indentation

## Commands
- \`npm run dev\` – Entwicklungsserver starten
- \`npm run build\` – Produktion-Build
- \`npm run lint\` – ESLint ausfuehren`,
    fileStructure: `todo-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── TodoItem.tsx
│   │   ├── TodoList.tsx
│   │   ├── TodoInput.tsx
│   │   └── FilterBar.tsx
│   ├── hooks/
│   │   ├── useTodos.ts
│   │   └── useLocalStorage.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── CLAUDE.md`,
    steps: [
      {
        title: 'Projekt initialisieren',
        description: 'Erstelle das React+TypeScript-Projekt mit Vite und installiere Tailwind CSS.',
        claudePrompt:
          'Erstelle ein neues React-Projekt mit Vite und TypeScript. Installiere und konfiguriere Tailwind CSS. Erstelle die CLAUDE.md Datei mit der Projektbeschreibung. Nutze npm als Package Manager.',
      },
      {
        title: 'TypeScript Types definieren',
        description: 'Definiere das Todo-Interface und die Filter-Types.',
        claudePrompt:
          'Erstelle src/types/index.ts mit einem Todo-Interface (id: string, text: string, completed: boolean, createdAt: Date) und einem FilterType ("all" | "active" | "completed").',
      },
      {
        title: 'Custom Hooks erstellen',
        description: 'Erstelle useLocalStorage und useTodos Hooks fuer State Management.',
        claudePrompt:
          'Erstelle zwei Custom Hooks: 1) useLocalStorage<T>(key, initialValue) fuer persistenten State, 2) useTodos() der useLocalStorage nutzt und Funktionen bereitstellt: addTodo, toggleTodo, deleteTodo, editTodo, filterTodos. Verwende useReducer intern.',
      },
      {
        title: 'UI-Komponenten bauen',
        description: 'Erstelle TodoInput, TodoItem, TodoList und FilterBar.',
        claudePrompt:
          'Erstelle die UI-Komponenten mit Tailwind CSS: 1) TodoInput mit Eingabefeld und Hinzufuegen-Button, 2) TodoItem mit Checkbox, Text, Edit- und Delete-Button, 3) TodoList die alle Todos rendert, 4) FilterBar mit den drei Filtern. Design: clean, minimal, dark mode.',
      },
      {
        title: 'App zusammenbauen und testen',
        description: 'Verbinde alle Komponenten in App.tsx und teste die Funktionalitaet.',
        claudePrompt:
          'Baue alle Komponenten in App.tsx zusammen. Nutze den useTodos-Hook. Fuege einen Header hinzu mit Titel und Todo-Zaehler. Stelle sicher, dass alles funktioniert: Erstellen, Loeschen, Bearbeiten, Filtern, LocalStorage-Persistenz.',
      },
    ],
    githubUrl: 'https://github.com/topics/react-todo-app',
  },

  // ── Template 2: Portfolio-Website ──────────────────────────
  {
    id: 'tpl-portfolio',
    title: 'Portfolio-Website',
    description:
      'Eine elegante Portfolio-Website mit HTML, CSS und Tailwind. Ideal fuer den Einstieg in Webdesign mit Claude Code.',
    difficulty: 1,
    estimatedHours: 3,
    techStack: ['HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'Vite'],
    features: [
      'Responsive Hero-Section',
      'Projekt-Galerie mit Cards',
      'Ueber-mich-Bereich',
      'Kontakt-Formular',
      'Dark/Light Mode Toggle',
      'Smooth Scroll Navigation',
    ],
    claudeMd: `# CLAUDE.md

## Project Overview
Persoenliche Portfolio-Website – responsive, modern, minimalistisch.
Statische Seite mit Tailwind CSS, gehostet auf Vercel/Netlify.

## Tech Stack
- **Markup**: HTML5
- **Styling**: Tailwind CSS (via CDN oder Vite-Plugin)
- **Interaktivitaet**: Vanilla JavaScript (kein Framework)
- **Build**: Vite (optional)
- **Deployment**: Vercel / Netlify / GitHub Pages

## Sections
1. Hero mit Name, Tagline, CTA
2. Projekte (Grid mit Cards)
3. Ueber mich (Text + Bild)
4. Skills (Badges)
5. Kontakt (Formular)
6. Footer

## Code Style
- Semantisches HTML (header, main, section, footer)
- BEM-Naming fuer custom CSS (falls noetig)
- Mobile-first Tailwind-Klassen
- Barrierefreie Labels und ARIA-Attribute`,
    fileStructure: `portfolio/
├── public/
│   ├── images/
│   │   ├── hero-bg.jpg
│   │   └── projects/
│   └── favicon.svg
├── src/
│   ├── index.html
│   ├── style.css
│   └── main.js
├── package.json
├── tailwind.config.js
├── vite.config.js
└── CLAUDE.md`,
    steps: [
      {
        title: 'Projekt aufsetzen',
        description: 'Erstelle das Projekt mit Vite und konfiguriere Tailwind CSS.',
        claudePrompt:
          'Erstelle ein Vanilla-Vite-Projekt (npm create vite@latest portfolio -- --template vanilla). Installiere und konfiguriere Tailwind CSS. Erstelle die CLAUDE.md.',
      },
      {
        title: 'Hero-Section erstellen',
        description: 'Baue eine beeindruckende Hero-Section mit Name, Tagline und CTA-Button.',
        claudePrompt:
          'Erstelle eine Hero-Section in index.html mit: Grossem Namen, einer Tagline, einem CTA-Button ("Projekte ansehen"), und einem dezenten animierten Hintergrund mit Gradient. Nutze Tailwind CSS. Mobile-first, responsive.',
      },
      {
        title: 'Projekte-Grid erstellen',
        description: 'Erstelle eine Projekt-Galerie mit Card-Komponenten.',
        claudePrompt:
          'Erstelle eine Projekte-Section mit einem responsiven Grid (1 Spalte mobil, 2 Spalten Tablet, 3 Spalten Desktop). Jede Card hat: Bild/Placeholder, Titel, Beschreibung, Tech-Tags, und einen Link. Mindestens 4 Beispiel-Projekte. Tailwind CSS.',
      },
      {
        title: 'Ueber-mich und Skills',
        description: 'Fuege einen Ueber-mich-Bereich und Skills-Badges hinzu.',
        claudePrompt:
          'Erstelle eine "Ueber mich"-Section mit Text und einem Foto-Placeholder daneben (Side-by-side Layout). Darunter eine Skills-Section mit Badges/Tags fuer Technologien (z.B. React, TypeScript, Node.js, etc.). Tailwind CSS, responsive.',
      },
      {
        title: 'Kontakt und Dark Mode',
        description: 'Erstelle ein Kontaktformular und implementiere den Dark Mode Toggle.',
        claudePrompt:
          'Erstelle: 1) Kontakt-Section mit Formular (Name, Email, Nachricht, Senden-Button) – nur Frontend, kein Backend. 2) Dark/Light Mode Toggle im Header mit JavaScript und Tailwind dark: Klassen. 3) Smooth Scroll fuer die Navigation. 4) Footer mit Social Links.',
      },
    ],
  },

  // ── Template 3: REST API ──────────────────────────────────
  {
    id: 'tpl-rest-api',
    title: 'REST API',
    description:
      'Eine vollstaendige REST API mit Express und Prisma. Lerne Backend-Entwicklung mit Claude Code.',
    difficulty: 2,
    estimatedHours: 8,
    techStack: ['Node.js', 'Express', 'TypeScript', 'Prisma', 'PostgreSQL', 'JWT', 'Zod'],
    features: [
      'CRUD-Endpoints fuer Ressourcen',
      'JWT-Authentication',
      'Input-Validierung mit Zod',
      'Prisma ORM mit PostgreSQL',
      'Error Handling Middleware',
      'API-Dokumentation mit Swagger',
      'Rate Limiting',
    ],
    claudeMd: `# CLAUDE.md

## Project Overview
RESTful API fuer eine Blog-Plattform. Authentication, CRUD, Validierung.
Gebaut mit Express + TypeScript + Prisma ORM.

## Tech Stack
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4
- **Language**: TypeScript 5 (strict mode)
- **ORM**: Prisma mit PostgreSQL
- **Auth**: JWT (jsonwebtoken + bcrypt)
- **Validation**: Zod
- **Testing**: Vitest + Supertest

## Architecture
\`\`\`
src/
├── controllers/    # Route-Handler
├── middleware/      # Auth, Error, Validation
├── routes/         # Express Router
├── services/       # Business-Logik
├── schemas/        # Zod-Validierungs-Schemas
├── prisma/         # Schema + Migrations
└── utils/          # Hilfsfunktionen (jwt, hash)
\`\`\`

## API Endpoints
- POST /api/auth/register – Registrierung
- POST /api/auth/login – Login (JWT)
- GET /api/posts – Alle Posts (paginiert)
- GET /api/posts/:id – Einzelner Post
- POST /api/posts – Post erstellen (auth)
- PUT /api/posts/:id – Post aktualisieren (auth)
- DELETE /api/posts/:id – Post loeschen (auth)

## Code Style
- Controller → Service → Repository Pattern
- Async/Await mit try/catch
- Zod fuer alle Request-Bodies
- HTTP Status Codes korrekt verwenden
- Environment Variables via .env

## Commands
- \`npm run dev\` – Entwicklungsserver (tsx watch)
- \`npm run build\` – TypeScript kompilieren
- \`npx prisma migrate dev\` – Migration erstellen
- \`npx prisma studio\` – Datenbank-GUI
- \`npm test\` – Tests ausfuehren`,
    fileStructure: `rest-api/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── postController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── postRoutes.ts
│   ├── services/
│   │   ├── authService.ts
│   │   └── postService.ts
│   ├── schemas/
│   │   ├── authSchemas.ts
│   │   └── postSchemas.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── hash.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── auth.test.ts
│   └── posts.test.ts
├── .env.example
├── package.json
├── tsconfig.json
└── CLAUDE.md`,
    steps: [
      {
        title: 'Projekt und Prisma Setup',
        description: 'Initialisiere das Node.js-Projekt mit TypeScript und konfiguriere Prisma.',
        claudePrompt:
          'Erstelle ein Node.js-Projekt mit TypeScript und Express. Installiere: express, prisma, @prisma/client, zod, jsonwebtoken, bcryptjs, cors, dotenv. Konfiguriere tsconfig.json mit strict mode. Initialisiere Prisma mit PostgreSQL. Erstelle die CLAUDE.md.',
      },
      {
        title: 'Datenbank-Schema definieren',
        description: 'Erstelle das Prisma-Schema mit User und Post Modellen.',
        claudePrompt:
          'Erstelle das Prisma-Schema mit zwei Modellen: 1) User (id, email unique, password, name, createdAt) und 2) Post (id, title, content, published, createdAt, updatedAt, authorId als FK zu User). Fuege die richtigen Relationen hinzu. Erstelle eine Migration.',
      },
      {
        title: 'Authentication implementieren',
        description: 'Erstelle Register und Login mit JWT.',
        claudePrompt:
          'Implementiere Authentication: 1) utils/hash.ts mit hashPassword und comparePassword (bcryptjs), 2) utils/jwt.ts mit generateToken und verifyToken, 3) schemas/authSchemas.ts mit Zod (registerSchema, loginSchema), 4) services/authService.ts, 5) controllers/authController.ts, 6) routes/authRoutes.ts, 7) middleware/auth.ts fuer JWT-Verifizierung.',
      },
      {
        title: 'CRUD-Endpoints fuer Posts',
        description: 'Erstelle alle Post-Endpoints mit Validierung.',
        claudePrompt:
          'Implementiere Post-CRUD: 1) schemas/postSchemas.ts mit Zod (createPostSchema, updatePostSchema), 2) services/postService.ts mit Prisma-Queries (getAll paginiert, getById, create, update, delete), 3) controllers/postController.ts, 4) routes/postRoutes.ts. POST/PUT/DELETE brauchen Auth-Middleware.',
      },
      {
        title: 'Error Handling und App-Setup',
        description: 'Erstelle globales Error Handling und verbinde alles.',
        claudePrompt:
          'Erstelle: 1) middleware/errorHandler.ts mit globalem Error Handler und custom ApiError-Klasse, 2) middleware/validate.ts als Zod-Validation-Middleware, 3) app.ts mit Express-Setup (cors, json, routes, errorHandler), 4) server.ts mit Port und Listen. Erstelle .env.example mit DATABASE_URL und JWT_SECRET.',
      },
    ],
  },

  // ── Template 4: Fullstack Blog ─────────────────────────────
  {
    id: 'tpl-fullstack-blog',
    title: 'Fullstack Blog',
    description:
      'Ein kompletter Blog mit React-Frontend und Express-Backend. Fullstack-Entwicklung mit Claude Code.',
    difficulty: 2,
    estimatedHours: 12,
    techStack: [
      'React',
      'TypeScript',
      'Express',
      'Prisma',
      'PostgreSQL',
      'Tailwind CSS',
      'React Router',
      'TanStack Query',
    ],
    features: [
      'Markdown-Editor fuer Posts',
      'User-Authentication (Register/Login)',
      'Post-Verwaltung (CRUD)',
      'Kommentar-System',
      'Tag-basierte Suche',
      'Responsive Design',
      'Server-Side Pagination',
      'Image Upload',
    ],
    claudeMd: `# CLAUDE.md

## Project Overview
Fullstack Blog-Plattform mit React Frontend und Express Backend.
Monorepo-Struktur mit shared Types.

## Tech Stack
### Frontend
- React 19 + TypeScript + Vite
- Tailwind CSS
- React Router v7
- TanStack Query (React Query)
- React Markdown

### Backend
- Node.js 20 + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT Authentication
- Zod Validation
- Multer (File Upload)

## Architecture
\`\`\`
fullstack-blog/
├── client/         # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types/
├── server/         # Express Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── prisma/
└── shared/         # Shared Types
    └── types.ts
\`\`\`

## Code Style
- TypeScript strict mode ueberall
- Functional Components + Hooks
- Controller → Service Pattern im Backend
- TanStack Query fuer Server State
- Tailwind fuer alle Styles

## Commands
- \`npm run dev\` – Client + Server starten (concurrently)
- \`npm run dev:client\` – Nur Frontend
- \`npm run dev:server\` – Nur Backend
- \`npm run build\` – Beides bauen
- \`npm run db:migrate\` – Prisma Migration`,
    fileStructure: `fullstack-blog/
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts
│   │   ├── components/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostEditor.tsx
│   │   │   ├── CommentSection.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── AuthForm.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── PostDetail.tsx
│   │   │   ├── CreatePost.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── hooks/
│   │   │   ├── usePosts.ts
│   │   │   └── useAuth.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.ts
│   └── package.json
├── shared/
│   └── types.ts
├── package.json
└── CLAUDE.md`,
    steps: [
      {
        title: 'Monorepo-Struktur aufsetzen',
        description: 'Erstelle die Monorepo-Struktur mit Client, Server und Shared.',
        claudePrompt:
          'Erstelle eine Monorepo-Struktur: 1) Root package.json mit Workspaces und concurrently-Scripts, 2) client/ als Vite+React+TypeScript-Projekt mit Tailwind, 3) server/ als Express+TypeScript-Projekt mit Prisma, 4) shared/types.ts mit gemeinsamen Types (User, Post, Comment). Erstelle die CLAUDE.md.',
      },
      {
        title: 'Backend: Datenbank und Auth',
        description: 'Erstelle das Prisma-Schema und implementiere Authentication.',
        claudePrompt:
          'Implementiere das Backend: 1) Prisma-Schema mit User, Post (title, content, excerpt, tags[], published, imageUrl), Comment (text, authorId, postId). 2) Auth-Routes (register, login) mit JWT. 3) Auth-Middleware. 4) Zod-Schemas fuer Validierung. 5) Error-Handler Middleware.',
      },
      {
        title: 'Backend: Post und Comment API',
        description: 'Erstelle alle CRUD-Endpoints fuer Posts und Comments.',
        claudePrompt:
          'Erstelle die REST-Endpoints: 1) GET /api/posts (paginiert, filter by tag, search), 2) GET /api/posts/:slug, 3) POST /api/posts (auth), 4) PUT /api/posts/:id (auth, nur Author), 5) DELETE /api/posts/:id (auth, nur Author), 6) POST /api/posts/:id/comments (auth), 7) GET /api/posts/:id/comments.',
      },
      {
        title: 'Frontend: Routing und Auth',
        description: 'Erstelle das React-Routing und die Auth-Komponenten.',
        claudePrompt:
          'Erstelle das Frontend: 1) api/client.ts mit Axios-Instance und Auth-Interceptor, 2) hooks/useAuth.ts mit Login/Register/Logout, 3) Navbar-Komponente mit Navigation und Auth-Status, 4) Login und Register-Pages, 5) React Router Setup mit allen Routes in App.tsx. TanStack Query fuer Server State.',
      },
      {
        title: 'Frontend: Posts und Comments',
        description: 'Erstelle die Post-Seiten mit Markdown-Editor und Kommentare.',
        claudePrompt:
          'Erstelle: 1) Home-Page mit Post-Liste (Cards mit Bild, Titel, Excerpt, Tags), Pagination und Suche, 2) PostDetail-Page mit Markdown-Rendering und CommentSection, 3) CreatePost-Page mit Markdown-Editor (Textarea + Preview), Tag-Input, 4) PostCard-Komponente. Alles mit Tailwind CSS, responsive.',
      },
    ],
  },

  // ── Template 5: SaaS Starter ──────────────────────────────
  {
    id: 'tpl-saas-starter',
    title: 'SaaS Starter',
    description:
      'Ein vollstaendiges SaaS-Boilerplate mit Next.js, Stripe und Authentication. Fuer ambitionierte Projekte.',
    difficulty: 3,
    estimatedHours: 20,
    techStack: [
      'Next.js 15',
      'TypeScript',
      'Tailwind CSS',
      'Prisma',
      'PostgreSQL',
      'NextAuth.js',
      'Stripe',
      'Resend',
    ],
    features: [
      'Authentication (Email, Google, GitHub)',
      'Stripe Subscriptions (3 Plaene)',
      'Dashboard mit Nutzungsstatistiken',
      'User-Profil und Einstellungen',
      'Email-Benachrichtigungen (Resend)',
      'Admin-Panel',
      'Landing Page mit Pricing',
      'Webhook-Integration',
      'Rate Limiting',
      'SEO-Optimierung',
    ],
    claudeMd: `# CLAUDE.md

## Project Overview
SaaS Starter Kit mit Next.js 15 (App Router), Stripe Subscriptions,
NextAuth.js Authentication und Prisma ORM.

## Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components)
- **Language**: TypeScript 5 (strict)
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: NextAuth.js v5 (Email, Google, GitHub)
- **Payments**: Stripe (Subscriptions, Webhooks)
- **ORM**: Prisma + PostgreSQL
- **Email**: Resend
- **Deployment**: Vercel

## Architecture
\`\`\`
src/
├── app/
│   ├── (auth)/         # Login, Register
│   ├── (dashboard)/    # Protected Dashboard
│   ├── (marketing)/    # Landing, Pricing
│   ├── api/
│   │   ├── auth/       # NextAuth
│   │   ├── stripe/     # Webhooks
│   │   └── user/       # User API
│   └── layout.tsx
├── components/
│   ├── ui/             # shadcn/ui
│   ├── dashboard/
│   ├── marketing/
│   └── auth/
├── lib/
│   ├── auth.ts         # NextAuth Config
│   ├── stripe.ts       # Stripe Client
│   ├── prisma.ts       # Prisma Client
│   └── resend.ts       # Email Client
└── prisma/
    └── schema.prisma
\`\`\`

## Environment Variables
\`\`\`
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_BASIC=
STRIPE_PRICE_PRO=
STRIPE_PRICE_ENTERPRISE=
RESEND_API_KEY=
\`\`\`

## Code Style
- Server Components als Default
- "use client" nur wenn noetig
- Server Actions fuer Mutations
- Zod fuer Validierung
- Keine any-Types

## Commands
- \`npm run dev\` – Entwicklungsserver
- \`npm run build\` – Produktion-Build
- \`npx prisma migrate dev\` – DB Migration
- \`npx prisma studio\` – DB GUI
- \`stripe listen --forward-to localhost:3000/api/stripe/webhook\``,
    fileStructure: `saas-starter/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── billing/page.tsx
│   │   ├── (marketing)/
│   │   │   ├── page.tsx
│   │   │   └── pricing/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── stripe/webhook/route.ts
│   │   │   └── user/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatsCards.tsx
│   │   │   └── UsageChart.tsx
│   │   ├── marketing/
│   │   │   ├── Hero.tsx
│   │   │   ├── PricingCards.tsx
│   │   │   └── Features.tsx
│   │   └── auth/
│   │       └── AuthForm.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── stripe.ts
│   │   ├── prisma.ts
│   │   └── resend.ts
│   └── middleware.ts
├── .env.example
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── CLAUDE.md`,
    steps: [
      {
        title: 'Next.js Projekt aufsetzen',
        description: 'Erstelle das Next.js-Projekt mit App Router, Tailwind und Prisma.',
        claudePrompt:
          'Erstelle ein Next.js 15 Projekt mit: App Router, TypeScript, Tailwind CSS, Prisma (PostgreSQL). Installiere: next-auth@beta, stripe, @stripe/stripe-js, resend, zod. Konfiguriere das Prisma-Schema mit User, Account, Session, Subscription (planId, status, stripeCustomerId, stripeSubscriptionId, currentPeriodEnd). Erstelle die CLAUDE.md und .env.example.',
      },
      {
        title: 'Authentication mit NextAuth.js',
        description: 'Konfiguriere NextAuth.js mit Email, Google und GitHub Providern.',
        claudePrompt:
          'Implementiere NextAuth.js v5: 1) lib/auth.ts mit PrismaAdapter, Google und GitHub Provider, 2) api/auth/[...nextauth]/route.ts, 3) middleware.ts fuer Protected Routes, 4) Login-Page mit Social-Login-Buttons und Email-Login, 5) Register-Page, 6) AuthForm-Komponente mit Tailwind.',
      },
      {
        title: 'Stripe Subscriptions',
        description: 'Implementiere Stripe Checkout und Subscription-Management.',
        claudePrompt:
          'Implementiere Stripe: 1) lib/stripe.ts mit Stripe-Client, 2) 3 Subscription-Plaene (Basic, Pro, Enterprise), 3) API-Route fuer Checkout-Session erstellen, 4) Webhook-Handler fuer: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, 5) Billing-Page mit aktuellem Plan und Upgrade-Option.',
      },
      {
        title: 'Dashboard und Landing Page',
        description: 'Erstelle das Dashboard und die Marketing-Seiten.',
        claudePrompt:
          'Erstelle: 1) Landing Page mit Hero, Features-Grid, Pricing-Cards (3 Plaene) und CTA, 2) Dashboard mit Sidebar-Navigation, Stats-Cards, Nutzungsdiagramm, 3) Settings-Page fuer Profil-Bearbeitung, 4) Billing-Page mit Subscription-Status. Alles mit Tailwind CSS, responsive, Server Components wo moeglich.',
      },
      {
        title: 'Email und Feinschliff',
        description: 'Fuege Email-Benachrichtigungen hinzu und optimiere SEO.',
        claudePrompt:
          'Implementiere: 1) lib/resend.ts fuer transaktionale Emails, 2) Welcome-Email nach Registrierung, 3) Subscription-Bestaetigung per Email, 4) SEO-Metadata in layout.tsx und allen Pages, 5) Loading- und Error-States, 6) Rate Limiting fuer API-Routes mit einer einfachen In-Memory-Loesung.',
      },
    ],
    githubUrl: 'https://github.com/topics/saas-boilerplate',
  },

  // ── Template 6: Real-time Chat App ────────────────────────
  {
    id: 'tpl-realtime-chat',
    title: 'Real-time Chat App',
    description:
      'Eine Echtzeit-Chat-Anwendung mit WebSockets, Raeumen und Typing-Indikatoren. Lerne bidirektionale Kommunikation mit Claude Code.',
    difficulty: 2,
    estimatedHours: 10,
    techStack: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'Express', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
    features: [
      'Echtzeit-Nachrichten mit WebSockets',
      'Chat-Raeume erstellen und beitreten',
      'Typing-Indikator ("User tippt...")',
      'Online/Offline-Status',
      'Nachrichtenhistorie aus der Datenbank',
      'Emoji-Picker',
      'Datei-Upload (Bilder)',
      'Ungelesene-Nachrichten-Zaehler',
    ],
    claudeMd: `# CLAUDE.md

## Project Overview
Echtzeit-Chat-Anwendung mit Socket.io fuer bidirektionale Kommunikation.
React-Frontend mit Express-Backend und persistenter Nachrichtenhistorie.

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express + Socket.io + TypeScript
- **ORM**: Prisma + PostgreSQL
- **Real-time**: Socket.io (WebSocket mit Fallback)
- **Auth**: JWT (einfach, Cookie-basiert)

## Architecture
\`\`\`
src/
├── client/
│   ├── components/     # ChatRoom, MessageList, MessageInput, Sidebar
│   ├── hooks/          # useSocket, useChat, useAuth
│   ├── context/        # SocketContext
│   └── types/
├── server/
│   ├── socket/         # Event-Handler (message, typing, join, leave)
│   ├── routes/         # REST (auth, rooms, messages)
│   ├── services/       # Business-Logik
│   └── prisma/
\`\`\`

## Socket Events
- \`message:send\` / \`message:receive\` – Nachrichten
- \`typing:start\` / \`typing:stop\` – Typing-Indikator
- \`room:join\` / \`room:leave\` – Raeume
- \`user:online\` / \`user:offline\` – Praesenz

## Code Style
- Functional Components + Custom Hooks
- Socket.io Rooms fuer Channel-Isolation
- Optimistic UI Updates
- Debounced Typing-Events`,
    fileStructure: `realtime-chat/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatRoom.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── RoomList.tsx
│   │   │   ├── UserList.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── hooks/
│   │   │   ├── useSocket.ts
│   │   │   ├── useChat.ts
│   │   │   └── useAuth.ts
│   │   ├── context/
│   │   │   └── SocketContext.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── socket/
│   │   │   ├── handlers.ts
│   │   │   └── index.ts
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.ts
│   └── package.json
├── package.json
└── CLAUDE.md`,
    steps: [
      {
        title: 'Projekt-Setup mit Socket.io',
        description: 'Erstelle das Monorepo mit React-Client und Express-Server inkl. Socket.io.',
        claudePrompt:
          'Erstelle ein Monorepo mit: 1) client/ als Vite+React+TypeScript+Tailwind Projekt, installiere socket.io-client. 2) server/ als Express+TypeScript Projekt, installiere socket.io, prisma, @prisma/client, jsonwebtoken, bcryptjs. 3) Root package.json mit concurrently-Scripts. 4) Prisma-Schema mit User (id, email, password, displayName, avatarUrl, isOnline), Room (id, name, createdBy), Message (id, content, userId, roomId, createdAt), RoomMember (userId, roomId, joinedAt). Erstelle CLAUDE.md.',
      },
      {
        title: 'Authentication und REST-API',
        description: 'Implementiere User-Auth und Room-Management via REST.',
        claudePrompt:
          'Implementiere: 1) POST /api/auth/register und POST /api/auth/login mit JWT, 2) GET /api/rooms – Alle Raeume listen, 3) POST /api/rooms – Raum erstellen (auth), 4) GET /api/rooms/:id/messages – Nachrichtenhistorie paginiert laden (auth), 5) Auth-Middleware die JWT aus Cookie oder Authorization-Header liest. Zod-Validierung fuer alle Inputs.',
      },
      {
        title: 'Socket.io Server-Events',
        description: 'Implementiere die WebSocket Event-Handler auf dem Server.',
        claudePrompt:
          'Implementiere Socket.io auf dem Server: 1) JWT-Auth in der Socket-Middleware (socket.handshake.auth.token), 2) Event-Handler: connection (User online setzen), disconnect (User offline), room:join (Socket.io Room beitreten + DB), room:leave, message:send (in DB speichern + an Room broadcasten), typing:start / typing:stop (an Room broadcasten, nicht an Sender). 3) Namespace /chat fuer Chat-Events.',
      },
      {
        title: 'Frontend: Socket-Integration und Chat-UI',
        description: 'Erstelle die Chat-Oberflaeche mit Echtzeit-Updates.',
        claudePrompt:
          'Erstelle das Frontend: 1) SocketContext mit connect/disconnect, automatischer Reconnect-Logik, 2) useSocket-Hook fuer Event-Listener, 3) useChat-Hook fuer Nachrichten-State und Room-Logik, 4) Sidebar mit RoomList (aktiver Room hervorgehoben) und UserList (Online-Status-Punkt), 5) ChatRoom mit MessageList (auto-scroll, Datum-Separator), MessageInput (Enter zum Senden, Shift+Enter fuer Newline), TypingIndicator. Dark Theme mit Tailwind.',
      },
      {
        title: 'Feinschliff: Emoji, Ungelesen, Benachrichtigungen',
        description: 'Fuege Emoji-Picker, ungelesene Nachrichten und Notifications hinzu.',
        claudePrompt:
          'Erweitere die App: 1) Emoji-Picker Komponente (einfaches Grid mit haeufigen Emojis, Toggle-Button im MessageInput), 2) Ungelesene-Nachrichten-Badge in der RoomList (zaehle Nachrichten seit letztem Besuch), 3) Browser-Notification API wenn Tab nicht fokussiert (mit Permission-Request), 4) Responsive Layout (Mobile: Sidebar als Drawer, Desktop: Side-by-side). 5) Lade-Skeleton fuer Nachrichtenhistorie.',
      },
    ],
  },

  // ── Template 7: CLI Tool mit Claude API ───────────────────
  {
    id: 'tpl-cli-tool',
    title: 'AI CLI Tool',
    description:
      'Ein intelligentes Kommandozeilen-Tool das die Claude API nutzt. Baue dein eigenes AI-powered Developer-Tool.',
    difficulty: 2,
    estimatedHours: 8,
    techStack: ['Node.js', 'TypeScript', 'Commander.js', 'Anthropic SDK', 'Ink', 'chalk', 'ora'],
    features: [
      'Interaktiver Chat-Modus im Terminal',
      'Code-Review per CLI-Befehl',
      'Commit-Message-Generator',
      'Datei-Analyse und Erklaerung',
      'Konversations-Historie (SQLite)',
      'Streaming-Responses',
      'Konfigurierbare System-Prompts',
      'Pipe-Support (stdin)',
    ],
    claudeMd: `# CLAUDE.md

## Project Overview
AI-powered CLI Tool das die Claude API (Anthropic SDK) nutzt.
Bietet Code-Review, Chat, Commit-Messages und Datei-Analyse.

## Tech Stack
- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5 (strict)
- **CLI Framework**: Commander.js
- **AI**: @anthropic-ai/sdk (Claude API)
- **UI**: Ink (React fuer Terminal), chalk, ora
- **Storage**: better-sqlite3 (Konversationshistorie)
- **Build**: tsup (bundling)

## Architecture
\`\`\`
src/
├── commands/       # CLI-Befehle (chat, review, commit, explain)
├── lib/
│   ├── claude.ts   # Anthropic SDK Client + Streaming
│   ├── config.ts   # ~/.config/ai-cli/ Konfiguration
│   ├── db.ts       # SQLite fuer Historie
│   └── git.ts      # Git-Operationen (diff, log, status)
├── ui/             # Ink-Komponenten (ChatView, Spinner, Markdown)
└── index.ts        # Commander Setup + Entry Point
\`\`\`

## Commands
- \`ai chat\` – Interaktiver Chat mit Claude
- \`ai review [file]\` – Code-Review einer Datei
- \`ai commit\` – Commit-Message aus staged changes generieren
- \`ai explain [file]\` – Datei erklaeren lassen
- \`ai config\` – API-Key und Einstellungen verwalten
- \`cat file.ts | ai explain\` – Pipe-Support

## Code Style
- Commander.js fuer Befehlsstruktur
- Streaming mit for-await-of
- XDG-konforme Config-Pfade
- Graceful Error Handling (kein Stack-Trace fuer User)`,
    fileStructure: `ai-cli/
├── src/
│   ├── commands/
│   │   ├── chat.ts
│   │   ├── review.ts
│   │   ├── commit.ts
│   │   ├── explain.ts
│   │   └── config.ts
│   ├── lib/
│   │   ├── claude.ts
│   │   ├── config.ts
│   │   ├── db.ts
│   │   ├── git.ts
│   │   └── utils.ts
│   ├── ui/
│   │   ├── ChatView.tsx
│   │   ├── Spinner.tsx
│   │   └── MarkdownRenderer.tsx
│   └── index.ts
├── .env.example
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── CLAUDE.md`,
    steps: [
      {
        title: 'CLI-Projekt aufsetzen',
        description: 'Erstelle das Node.js CLI-Projekt mit Commander.js und TypeScript.',
        claudePrompt:
          'Erstelle ein Node.js CLI-Projekt: 1) package.json mit "bin": { "ai": "./dist/index.js" }, type: "module", 2) Installiere: commander, @anthropic-ai/sdk, chalk, ora, better-sqlite3, ink, ink-text-input, react. Dev-Dependencies: typescript, tsup, @types/better-sqlite3, @types/react, 3) tsup.config.ts fuer Build (entry: src/index.ts, format: esm, shims: true), 4) tsconfig.json mit strict, ESNext, NodeNext, 5) src/index.ts mit Commander-Setup und Shebang (#!/usr/bin/env node). Erstelle CLAUDE.md.',
      },
      {
        title: 'Claude API Client und Config',
        description: 'Implementiere den Anthropic SDK Client mit Streaming und die Konfigurationsverwaltung.',
        claudePrompt:
          'Implementiere: 1) lib/config.ts – Konfiguration in ~/.config/ai-cli/config.json speichern/laden (apiKey, model, maxTokens, systemPrompt), XDG-konform. 2) lib/claude.ts – Anthropic Client mit: sendMessage(messages, options) und streamMessage(messages, options) die ein AsyncIterable<string> zurueckgibt. 3) lib/db.ts – SQLite-DB in ~/.config/ai-cli/history.db, Tabelle conversations (id, title, createdAt) und messages (id, conversationId, role, content, createdAt). 4) commands/config.ts – "ai config set-key", "ai config set-model", "ai config show".',
      },
      {
        title: 'Chat-Befehl mit Streaming',
        description: 'Erstelle den interaktiven Chat-Modus mit Streaming-Antworten.',
        claudePrompt:
          'Implementiere commands/chat.ts: 1) Interaktiver Modus mit Ink: ChatView-Komponente mit Nachrichtenliste (User + Assistant Messages, farblich unterschieden mit chalk), Text-Input unten, Streaming-Antwort wird zeichenweise angezeigt. 2) Option --continue um letzte Konversation fortzusetzen (aus DB laden). 3) Option --system "prompt" fuer Custom System-Prompt. 4) /exit zum Beenden, /clear zum Leeren, /history zum Anzeigen alter Konversationen. 5) Speichere jede Konversation in SQLite.',
      },
      {
        title: 'Review und Commit-Befehle',
        description: 'Implementiere Code-Review und Commit-Message-Generator.',
        claudePrompt:
          'Implementiere: 1) commands/review.ts – "ai review [datei]": Liest Datei-Inhalt, sendet an Claude mit System-Prompt fuer Code-Review (Bugs, Verbesserungen, Security). Streaming-Output mit Syntax-Highlighting. Unterstuetzt auch Pipe: "cat file.ts | ai review". 2) commands/commit.ts – "ai commit": Liest git diff --staged, generiert Commit-Message im Conventional-Commits-Format. Option --auto fuehrt den Commit direkt aus (mit Bestaetigung). 3) lib/git.ts – Hilfsfunktionen: getStagedDiff(), getRecentCommits(), getStatus().',
      },
      {
        title: 'Explain-Befehl und Feinschliff',
        description: 'Fuege Datei-Erklaerung hinzu und optimiere die UX.',
        claudePrompt:
          'Implementiere: 1) commands/explain.ts – "ai explain [datei]": Liest Datei, sendet an Claude mit Prompt fuer verstaendliche Erklaerung (Zweck, Architektur, wichtige Funktionen). Unterstuetzt Pipe. 2) Globale Fehlerbehandlung: kein Stack-Trace fuer User, freundliche Fehlermeldungen (z.B. "API-Key nicht konfiguriert, nutze: ai config set-key"). 3) ora-Spinner waehrend API-Calls. 4) --help Text fuer alle Befehle. 5) npm link zum lokalen Testen. 6) README.md mit Installationsanleitung und Beispielen.',
      },
    ],
    githubUrl: 'https://github.com/topics/cli-ai-tool',
  },

  // ── Template 8: E-Commerce Platform ───────────────────────
  {
    id: 'tpl-ecommerce',
    title: 'E-Commerce Platform',
    description:
      'Ein vollstaendiger Online-Shop mit Produktkatalog, Warenkorb, Stripe-Checkout und Admin-Panel. Experten-Projekt.',
    difficulty: 3,
    estimatedHours: 25,
    techStack: ['Next.js 15', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'Tailwind CSS', 'Zustand', 'Uploadthing'],
    features: [
      'Produktkatalog mit Kategorien und Filtern',
      'Warenkorb mit LocalStorage-Persistenz',
      'Stripe Checkout und Webhooks',
      'Admin-Panel: Produkte, Bestellungen, Kunden',
      'Produktbilder-Upload',
      'Suchfunktion mit Debouncing',
      'Bestellstatus-Tracking',
      'Responsive Design (Mobile-first)',
      'SEO-optimierte Produktseiten',
      'Wunschliste',
    ],
    claudeMd: `# CLAUDE.md

## Project Overview
Vollstaendige E-Commerce-Plattform mit Next.js 15 (App Router).
Produktkatalog, Warenkorb, Stripe-Payments und Admin-Dashboard.

## Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components, Server Actions)
- **Language**: TypeScript 5 (strict)
- **Styling**: Tailwind CSS + shadcn/ui
- **ORM**: Prisma + PostgreSQL
- **Payments**: Stripe (Checkout Sessions, Webhooks)
- **State**: Zustand (Warenkorb)
- **Upload**: Uploadthing (Produktbilder)
- **Auth**: NextAuth.js v5

## Architecture
\`\`\`
src/
├── app/
│   ├── (shop)/           # Oeffentlicher Shop
│   │   ├── products/     # Katalog + Detailseiten
│   │   ├── cart/         # Warenkorb
│   │   ├── checkout/     # Stripe Checkout
│   │   └── orders/       # Bestellhistorie (auth)
│   ├── admin/            # Admin-Panel (auth + role)
│   │   ├── products/     # CRUD
│   │   ├── orders/       # Verwaltung
│   │   └── dashboard/    # Statistiken
│   └── api/
│       ├── stripe/       # Webhooks
│       └── upload/       # Bild-Upload
├── components/
│   ├── shop/             # ProductCard, CartDrawer, FilterSidebar
│   └── admin/            # DataTable, StatsCard, OrderTimeline
├── lib/
│   ├── stripe.ts
│   ├── prisma.ts
│   └── utils.ts
├── store/
│   └── cartStore.ts      # Zustand
└── prisma/
    └── schema.prisma
\`\`\`

## Prisma Models
- Product (name, description, price, images[], category, stock, slug)
- Category (name, slug, parentId)
- Order (userId, status, total, shippingAddress)
- OrderItem (orderId, productId, quantity, price)
- User (role: CUSTOMER | ADMIN)

## Code Style
- Server Components als Default, "use client" nur fuer Interaktivitaet
- Server Actions fuer Mutations (Admin CRUD)
- Zustand fuer Client-Side-State (Cart)
- Optimistic Updates
- Zod fuer Validierung`,
    fileStructure: `ecommerce/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (shop)/
│   │   │   ├── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx
│   │   │   │   └── success/page.tsx
│   │   │   └── orders/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   └── orders/
│   │   │       ├── page.tsx
│   │   │       └── [id]/page.tsx
│   │   ├── api/
│   │   │   ├── stripe/webhook/route.ts
│   │   │   └── uploadthing/route.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── FilterSidebar.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── WishlistButton.tsx
│   │   ├── admin/
│   │   │   ├── DataTable.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── OrderTimeline.tsx
│   │   └── ui/
│   ├── store/
│   │   └── cartStore.ts
│   ├── lib/
│   │   ├── stripe.ts
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── middleware.ts
├── .env.example
├── package.json
├── next.config.ts
└── CLAUDE.md`,
    steps: [
      {
        title: 'Projekt und Datenbank aufsetzen',
        description: 'Erstelle das Next.js-Projekt mit Prisma-Schema und Seed-Daten.',
        claudePrompt:
          'Erstelle ein Next.js 15 Projekt mit App Router, TypeScript, Tailwind CSS. Installiere: prisma, @prisma/client, stripe, @stripe/stripe-js, next-auth@beta, zustand, uploadthing, zod. Erstelle das Prisma-Schema mit: User (id, email, name, role CUSTOMER/ADMIN), Product (id, name, slug unique, description, price Decimal, images String[], categoryId, stock Int, featured Boolean), Category (id, name, slug unique, parentId self-relation), Order (id, userId, status PENDING/PAID/SHIPPED/DELIVERED/CANCELLED, total, stripePaymentId, shippingAddress Json), OrderItem (orderId, productId, quantity, priceAtPurchase), Wishlist (userId, productId). Erstelle prisma/seed.ts mit 3 Kategorien und 12 Beispielprodukten. CLAUDE.md anlegen.',
      },
      {
        title: 'Produktkatalog und Shop-Frontend',
        description: 'Erstelle den oeffentlichen Shop mit Produktliste und Detailseiten.',
        claudePrompt:
          'Erstelle das Shop-Frontend: 1) Shop-Homepage mit Featured Products Carousel und Kategorie-Grid. 2) /products Page: ProductGrid mit ProductCards (Bild, Name, Preis, Warenkorb-Button), FilterSidebar (Kategorien, Preis-Range, Sortierung), Suchleiste mit Debouncing, Pagination. 3) /products/[slug] Detailseite: Bildergalerie, Beschreibung, Preis, Lagerbestand, In-den-Warenkorb-Button, aehnliche Produkte. 4) SEO: generateMetadata fuer jedes Produkt. Server Components fuer Datenladung. Tailwind CSS.',
      },
      {
        title: 'Warenkorb und Stripe Checkout',
        description: 'Implementiere Warenkorb mit Zustand und Stripe Payment.',
        claudePrompt:
          'Implementiere: 1) store/cartStore.ts mit Zustand + persist (localStorage): items, addItem, removeItem, updateQuantity, clearCart, getTotal. 2) CartDrawer-Komponente: Slide-in Panel, Artikelliste mit +/- Buttons, Zwischensumme, Checkout-Button. 3) /cart Page mit vollstaendiger Warenkorbansicht. 4) Stripe Checkout: Server Action die Stripe Checkout Session erstellt (line_items aus Cart, success_url, cancel_url). 5) /checkout/success Page. 6) Stripe Webhook: checkout.session.completed -> Order in DB erstellen, Stock reduzieren.',
      },
      {
        title: 'Admin-Panel',
        description: 'Erstelle das Admin-Dashboard fuer Produkt- und Bestellverwaltung.',
        claudePrompt:
          'Erstelle das Admin-Panel (nur fuer role=ADMIN, geprueft in middleware.ts): 1) /admin/dashboard mit StatsCards (Umsatz, Bestellungen, Kunden, Produkte), Umsatz-Chart der letzten 30 Tage, letzte Bestellungen. 2) /admin/products mit DataTable (sortierbar, Suche), Bearbeiten/Loeschen-Buttons. 3) /admin/products/new und /admin/products/[id]/edit mit ProductForm (Server Action fuer Create/Update, Bildupload via Uploadthing). 4) /admin/orders mit Bestellliste und Statusfilter. 5) /admin/orders/[id] mit OrderTimeline und Status-Update-Buttons.',
      },
      {
        title: 'Auth, Wunschliste und Feinschliff',
        description: 'Fuege Authentication, Wunschliste und letzte Optimierungen hinzu.',
        claudePrompt:
          'Implementiere: 1) NextAuth.js mit Email + Google Login, PrismaAdapter, Role-basiertes Routing in middleware.ts (/admin nur fuer ADMIN). 2) Wunschliste: WishlistButton (Herz-Icon, Toggle), /wishlist Page mit gespeicherten Produkten. 3) /orders Page: Bestellhistorie des eingeloggten Users mit Status-Badges. 4) Responsive Navigation: Shop-Header mit Logo, Suche, Warenkorb-Icon mit Badge, User-Menu. Mobile: Hamburger-Menu. 5) Loading-Skeletons fuer ProductGrid und Admin-Tabellen.',
      },
    ],
    githubUrl: 'https://github.com/topics/nextjs-ecommerce',
  },

  // ── Template 9: DevOps Monitoring Dashboard ───────────────
  {
    id: 'tpl-devops-dashboard',
    title: 'DevOps Monitoring Dashboard',
    description:
      'Ein Echtzeit-Monitoring-Dashboard fuer Server, Container und Deployments. Visualisiere Metriken mit Live-Charts.',
    difficulty: 3,
    estimatedHours: 18,
    techStack: ['React', 'TypeScript', 'Node.js', 'WebSocket', 'Recharts', 'Docker API', 'Tailwind CSS', 'Express'],
    features: [
      'Echtzeit-Server-Metriken (CPU, RAM, Disk)',
      'Docker Container Management',
      'Live-Charts mit Auto-Refresh',
      'Alerting-System mit Schwellenwerten',
      'Log-Viewer mit Filterung',
      'Deployment-Historie',
      'Multi-Server-Support',
      'Dark Mode Dashboard',
    ],
    claudeMd: `# CLAUDE.md

## Project Overview
DevOps Monitoring Dashboard fuer Server- und Container-Ueberwachung.
Echtzeit-Metriken via WebSocket, Docker-Integration, Alert-System.

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Charts**: Recharts (Line, Area, Bar, Pie)
- **Real-time**: WebSocket (native, kein Socket.io)
- **Backend**: Express + TypeScript
- **Docker**: dockerode (Docker Engine API)
- **Metrics**: systeminformation (CPU, RAM, Disk, Network)
- **Storage**: SQLite (Metriken-Historie, Alerts)

## Architecture
\`\`\`
src/
├── client/
│   ├── components/
│   │   ├── charts/       # MetricChart, CPUGauge, MemoryBar
│   │   ├── containers/   # ContainerList, ContainerDetail
│   │   ├── alerts/       # AlertList, AlertConfig
│   │   ├── logs/         # LogViewer, LogFilter
│   │   └── layout/       # Sidebar, Header, StatusBar
│   ├── hooks/            # useWebSocket, useMetrics, useAlerts
│   └── stores/           # metricsStore, alertStore
├── server/
│   ├── collectors/       # cpu.ts, memory.ts, disk.ts, network.ts
│   ├── docker/           # containerManager.ts, imageManager.ts
│   ├── alerts/           # alertEngine.ts, rules.ts
│   ├── ws/               # WebSocket-Server
│   └── routes/           # REST (history, config, containers)
\`\`\`

## WebSocket Messages
- \`metrics:system\` – CPU, RAM, Disk, Network (alle 2s)
- \`metrics:containers\` – Container-Stats (alle 5s)
- \`alert:triggered\` – Schwellenwert ueberschritten
- \`log:new\` – Neue Log-Zeile

## Code Style
- Recharts fuer alle Visualisierungen
- WebSocket mit reconnect-Logik
- Ring-Buffer fuer Metriken-Historie (letzte 1h im Speicher)
- Zustand fuer Dashboard-State`,
    fileStructure: `devops-dashboard/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   ├── MetricChart.tsx
│   │   │   │   ├── CPUGauge.tsx
│   │   │   │   ├── MemoryBar.tsx
│   │   │   │   └── NetworkGraph.tsx
│   │   │   ├── containers/
│   │   │   │   ├── ContainerList.tsx
│   │   │   │   ├── ContainerDetail.tsx
│   │   │   │   └── ContainerActions.tsx
│   │   │   ├── alerts/
│   │   │   │   ├── AlertList.tsx
│   │   │   │   └── AlertRuleForm.tsx
│   │   │   ├── logs/
│   │   │   │   ├── LogViewer.tsx
│   │   │   │   └── LogFilter.tsx
│   │   │   └── layout/
│   │   │       ├── Sidebar.tsx
│   │   │       ├── Header.tsx
│   │   │       └── StatusBar.tsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts
│   │   │   ├── useMetrics.ts
│   │   │   └── useAlerts.ts
│   │   ├── stores/
│   │   │   ├── metricsStore.ts
│   │   │   └── alertStore.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── collectors/
│   │   │   ├── system.ts
│   │   │   └── docker.ts
│   │   ├── alerts/
│   │   │   ├── engine.ts
│   │   │   └── rules.ts
│   │   ├── ws/
│   │   │   └── server.ts
│   │   ├── routes/
│   │   │   ├── metrics.ts
│   │   │   ├── containers.ts
│   │   │   └── alerts.ts
│   │   ├── db.ts
│   │   └── app.ts
│   └── package.json
├── package.json
└── CLAUDE.md`,
    steps: [
      {
        title: 'Projekt-Setup und Metriken-Collector',
        description: 'Erstelle das Projekt und implementiere die System-Metriken-Sammlung.',
        claudePrompt:
          'Erstelle ein Monorepo: 1) client/ mit Vite+React+TypeScript+Tailwind, installiere recharts und zustand. 2) server/ mit Express+TypeScript, installiere systeminformation, dockerode, ws, better-sqlite3. 3) Server: collectors/system.ts mit Funktionen: getCPUUsage(), getMemoryUsage(), getDiskUsage(), getNetworkStats() (nutze systeminformation-Paket). Sammle Metriken alle 2 Sekunden und speichere in Ring-Buffer (Array mit max 1800 Eintraegen = 1h). 4) SQLite-DB fuer historische Metriken (Tabelle: metrics mit timestamp, type, value). CLAUDE.md erstellen.',
      },
      {
        title: 'WebSocket-Server und Echtzeit-Stream',
        description: 'Implementiere den WebSocket-Server fuer Echtzeit-Metriken.',
        claudePrompt:
          'Implementiere: 1) ws/server.ts: Native WebSocket-Server (ws-Paket) integriert in Express. 2) Sende metrics:system alle 2 Sekunden an alle verbundenen Clients (CPU%, RAM%, Disk%, Network RX/TX). 3) REST-Endpoints: GET /api/metrics/history?type=cpu&range=1h fuer historische Daten aus SQLite. GET /api/metrics/current fuer aktuelle Snapshot-Werte. 4) Client: hooks/useWebSocket.ts mit auto-reconnect (exponential backoff), Connection-Status-Tracking. 5) stores/metricsStore.ts mit Zustand: aktuelle Werte + letzte 60 Datenpunkte fuer Charts.',
      },
      {
        title: 'Dashboard-UI mit Live-Charts',
        description: 'Erstelle die Dashboard-Oberflaeche mit Recharts-Visualisierungen.',
        claudePrompt:
          'Erstelle das Dashboard-UI: 1) Layout: Sidebar (Navigation: Overview, Containers, Alerts, Logs), Header (Servername, Connection-Status-Punkt, Dark Mode Toggle), StatusBar (Uptime, Last Update). 2) Overview-Page: 4 StatsCards oben (CPU, RAM, Disk, Network mit Sparkline), darunter: CPUGauge (Kreis-Gauge 0-100%), MemoryBar (horizontaler Balken used/total), 2 MetricCharts (Area-Charts fuer CPU und RAM ueber letzte 30min, auto-scroll). 3) NetworkGraph (Line-Chart mit RX/TX). Dark Theme als Default. Responsive Grid (2 Spalten Desktop, 1 Spalte Mobile). Alle Charts mit Recharts, smooth Animations.',
      },
      {
        title: 'Docker Container Management',
        description: 'Implementiere Docker-Container-Uebersicht und Steuerung.',
        claudePrompt:
          'Implementiere Docker-Integration: 1) Server: collectors/docker.ts mit dockerode: listContainers(), getContainerStats(), startContainer(), stopContainer(), restartContainer(), getContainerLogs(). 2) WebSocket: metrics:containers alle 5 Sekunden (Name, Status, CPU%, Memory, Network). 3) REST: GET /api/containers, POST /api/containers/:id/start|stop|restart, GET /api/containers/:id/logs?tail=100. 4) Frontend: ContainerList (Tabelle mit Status-Badge gruen/rot/gelb, CPU/RAM-Bars, Action-Buttons), ContainerDetail (Logs, Stats-Charts, Environment-Vars, Port-Mapping). Falls Docker nicht verfuegbar: Zeige Demo-Daten.',
      },
      {
        title: 'Alerting-System und Log-Viewer',
        description: 'Fuege Schwellenwert-Alerts und einen Log-Viewer hinzu.',
        claudePrompt:
          'Implementiere: 1) Server: alerts/engine.ts – Pruefe Metriken gegen konfigurierbare Regeln (z.B. CPU > 90% fuer 30s). Regeln in SQLite (alert_rules: id, metric, operator, threshold, duration, enabled). Bei Trigger: WebSocket alert:triggered senden + in DB loggen. 2) REST: CRUD fuer Alert-Rules, GET /api/alerts/history. 3) Frontend: AlertList (aktive Alerts mit Severity-Badge, Timestamp, Acknowledge-Button), AlertRuleForm (Metric-Dropdown, Operator, Threshold-Slider, Duration). 4) LogViewer: Virtualisierte Liste (nur sichtbare Zeilen rendern), Filter nach Level (info/warn/error), Echtzeit-Stream via WebSocket, Auto-Scroll mit Pause-Button. 5) Browser-Notifications bei Critical Alerts.',
      },
    ],
  },

  // ── Template 10: Multi-Tenant SaaS Platform ───────────────
  {
    id: 'tpl-multi-tenant',
    title: 'Multi-Tenant SaaS Platform',
    description:
      'Eine mandantenfaehige SaaS-Plattform mit Team-Management, RBAC, Row-Level-Security und Billing. Das Experten-Projekt.',
    difficulty: 3,
    estimatedHours: 30,
    techStack: ['Next.js 15', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'NextAuth.js', 'Tailwind CSS', 'tRPC'],
    features: [
      'Multi-Tenant-Architektur (Shared DB, Row-Level-Security)',
      'Team-Management mit Einladungen per Email',
      'Role-Based Access Control (Owner, Admin, Member)',
      'Stripe Billing pro Organisation',
      'tRPC fuer typsichere API',
      'Audit-Log fuer alle Aktionen',
      'API-Key-Management fuer Integrationen',
      'Onboarding-Wizard fuer neue Organisationen',
      'Globales Admin-Panel (Super-Admin)',
      'Rate Limiting pro Tenant',
    ],
    claudeMd: `# CLAUDE.md

## Project Overview
Multi-Tenant SaaS Platform mit Next.js 15. Organisationen als Mandanten,
Team-Management, RBAC, Stripe Billing und Audit-Logging.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **API**: tRPC v11 (End-to-End Type Safety)
- **Auth**: NextAuth.js v5 + Custom Session mit Org-Context
- **ORM**: Prisma + PostgreSQL (Row-Level Isolation)
- **Payments**: Stripe (per-org Subscriptions)
- **Styling**: Tailwind CSS + shadcn/ui
- **Email**: Resend (Einladungen, Benachrichtigungen)
- **Validation**: Zod (shared zwischen Client und Server)

## Architecture
\`\`\`
src/
├── app/
│   ├── (auth)/              # Login, Register
│   ├── (app)/               # Tenant-Kontext (/[orgSlug]/...)
│   │   ├── [orgSlug]/
│   │   │   ├── dashboard/
│   │   │   ├── settings/
│   │   │   ├── members/
│   │   │   ├── billing/
│   │   │   └── api-keys/
│   ├── onboarding/          # Org erstellen
│   ├── admin/               # Super-Admin Panel
│   └── api/
│       └── trpc/[trpc]/
├── server/
│   ├── trpc/
│   │   ├── router/          # org, member, billing, apiKey, audit
│   │   ├── context.ts       # Org-Kontext aus URL
│   │   └── middleware/       # auth, rbac, rateLimit, audit
│   └── services/
├── lib/
│   ├── auth.ts
│   ├── stripe.ts
│   └── permissions.ts       # RBAC-Definitionen
└── prisma/
    └── schema.prisma
\`\`\`

## Multi-Tenant Pattern
- **Shared Database** mit organizationId als FK auf allen Tabellen
- **Prisma Middleware** injiziert automatisch organizationId in Queries
- **URL-basierter Kontext**: /acme-inc/dashboard -> Org "acme-inc"
- **Session** enthaelt aktive Org + Role des Users in dieser Org

## RBAC Roles
- **OWNER**: Volle Kontrolle, kann Org loeschen, Billing verwalten
- **ADMIN**: Mitglieder verwalten, Einstellungen aendern
- **MEMBER**: Lesen und Schreiben innerhalb der Org

## Code Style
- tRPC Procedures mit Zod-Input-Schemas
- RBAC-Middleware auf Router-Ebene
- Audit-Log-Middleware protokolliert alle Mutations
- Org-Kontext in allen Server-Calls`,
    fileStructure: `multi-tenant-saas/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (app)/
│   │   │   └── [orgSlug]/
│   │   │       ├── layout.tsx
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── settings/page.tsx
│   │   │       ├── members/
│   │   │       │   ├── page.tsx
│   │   │       │   └── invite/page.tsx
│   │   │       ├── billing/page.tsx
│   │   │       └── api-keys/page.tsx
│   │   ├── onboarding/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── orgs/page.tsx
│   │   │   └── users/page.tsx
│   │   ├── api/
│   │   │   ├── trpc/[trpc]/route.ts
│   │   │   └── stripe/webhook/route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── server/
│   │   ├── trpc/
│   │   │   ├── index.ts
│   │   │   ├── context.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── rbac.ts
│   │   │   │   ├── orgContext.ts
│   │   │   │   ├── rateLimit.ts
│   │   │   │   └── audit.ts
│   │   │   └── router/
│   │   │       ├── org.ts
│   │   │       ├── member.ts
│   │   │       ├── billing.ts
│   │   │       ├── apiKey.ts
│   │   │       └── audit.ts
│   │   └── services/
│   │       ├── orgService.ts
│   │       ├── memberService.ts
│   │       └── billingService.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── stripe.ts
│   │   ├── prisma.ts
│   │   ├── permissions.ts
│   │   └── resend.ts
│   ├── components/
│   │   ├── app/
│   │   │   ├── OrgSwitcher.tsx
│   │   │   ├── MemberTable.tsx
│   │   │   ├── InviteForm.tsx
│   │   │   ├── AuditLog.tsx
│   │   │   └── ApiKeyManager.tsx
│   │   ├── onboarding/
│   │   │   └── OnboardingWizard.tsx
│   │   └── ui/
│   └── middleware.ts
├── .env.example
├── package.json
├── next.config.ts
└── CLAUDE.md`,
    steps: [
      {
        title: 'Projekt und Multi-Tenant-Schema',
        description: 'Erstelle das Next.js-Projekt mit dem Multi-Tenant Prisma-Schema.',
        claudePrompt:
          'Erstelle ein Next.js 15 Projekt mit App Router, TypeScript, Tailwind CSS. Installiere: @trpc/server, @trpc/client, @trpc/next, @tanstack/react-query, next-auth@beta, stripe, resend, zod, superjson. Prisma-Schema mit: Organization (id, name, slug unique, plan FREE/PRO/ENTERPRISE, stripeCustomerId, createdAt), User (id, email, name, image), Membership (userId, orgId, role OWNER/ADMIN/MEMBER, invitedBy, joinedAt) mit @@unique([userId, orgId]), AuditLog (id, orgId, userId, action, entityType, entityId, metadata Json, createdAt), ApiKey (id, orgId, name, key unique, lastUsedAt, expiresAt). Alle Business-Tabellen haben organizationId FK. Erstelle seed.ts mit Demo-Org und Users. CLAUDE.md anlegen.',
      },
      {
        title: 'tRPC Setup und Auth mit Org-Kontext',
        description: 'Konfiguriere tRPC mit Auth-Middleware und Organisation-Kontext.',
        claudePrompt:
          'Implementiere: 1) NextAuth.js mit PrismaAdapter, Google Provider. Session-Callback erweitert Session um activeOrgId und activeOrgRole. 2) tRPC Setup: context.ts liest Session + orgSlug aus Header/URL und laedt Membership. 3) Middleware-Stack: auth (User muss eingeloggt sein), orgContext (orgSlug -> Organization laden, Membership pruefen), rbac(minimumRole) (prüfe ob User-Role >= minimumRole). 4) server/trpc/router/org.ts mit Procedures: list (alle Orgs des Users), getBySlug, create, update (ADMIN+), delete (OWNER). 5) API-Route: app/api/trpc/[trpc]/route.ts. 6) Client-Setup mit TanStack Query Provider.',
      },
      {
        title: 'Team-Management und Einladungen',
        description: 'Implementiere Mitgliederverwaltung mit Email-Einladungen.',
        claudePrompt:
          'Implementiere: 1) server/trpc/router/member.ts: list (alle Mitglieder der Org), invite (Email senden via Resend, erzeugt Invitation-Record mit Token), remove (ADMIN+, Owner kann nicht entfernt werden), updateRole (OWNER only). 2) Invitation-Flow: POST invite erzeugt Token, sendet Email mit Link /invite/[token], Accept-Page laedt Token, erstellt Membership. 3) Frontend: /[orgSlug]/members Page mit MemberTable (Avatar, Name, Email, Role-Badge, Actions-Dropdown), InviteForm (Email + Role-Select). 4) OrgSwitcher-Komponente im Header: Dropdown mit allen Orgs des Users, "Neue Organisation" Link.',
      },
      {
        title: 'Stripe Billing pro Organisation',
        description: 'Implementiere Stripe Subscriptions auf Organisations-Ebene.',
        claudePrompt:
          'Implementiere Billing: 1) lib/stripe.ts mit Stripe-Client und Hilfsfunktionen. 2) server/trpc/router/billing.ts: getStatus (aktueller Plan, Renewal-Datum, Seats), createCheckoutSession (Pro/Enterprise, orgId in metadata), createPortalSession (Stripe Customer Portal), cancel. 3) Stripe Webhook-Handler: checkout.session.completed (Plan updaten), customer.subscription.updated, customer.subscription.deleted. 4) Frontend: /[orgSlug]/billing Page: aktueller Plan-Badge, Upgrade-Cards (Free/Pro/Enterprise mit Features-Vergleich), Subscription-Details, Portal-Link. 5) middleware.ts: Plan-basierte Feature-Gates (z.B. API-Keys nur in Pro+).',
      },
      {
        title: 'Audit-Log, API-Keys und Onboarding',
        description: 'Fuege Audit-Logging, API-Key-Management und den Onboarding-Wizard hinzu.',
        claudePrompt:
          'Implementiere: 1) Audit-Middleware: Automatisch bei jeder tRPC-Mutation einen AuditLog-Eintrag erstellen (userId, orgId, action, entityType, entityId, metadata). 2) server/trpc/router/audit.ts: list (paginiert, filterbar nach action/user/entity), export als CSV. 3) Frontend: AuditLog-Komponente mit Timeline-Design, Filter-Dropdowns. 4) API-Key-Management: router/apiKey.ts (create mit random Key, list, revoke), Frontend: ApiKeyManager mit Tabelle (Name, Created, Last Used, Revoke-Button), Create-Dialog (Key nur einmal angezeigt). 5) Onboarding-Wizard: 3-Step Form (Org-Name + Slug, Team einladen optional, Plan waehlen). Redirect nach /[orgSlug]/dashboard. 6) Super-Admin Panel /admin: Alle Orgs listen, User-Suche, Org-Details einsehen.',
      },
    ],
    githubUrl: 'https://github.com/topics/multi-tenant-saas',
  },
];

/** Difficulty labels */
export const difficultyLabels: Record<number, string> = {
  1: 'Anfaenger',
  2: 'Fortgeschritten',
  3: 'Experte',
};

/** Get template by ID */
export function getTemplateById(id: string): ProjectTemplate | undefined {
  return projectTemplates.find((t) => t.id === id);
}
