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
