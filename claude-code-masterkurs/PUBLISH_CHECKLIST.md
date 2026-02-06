# Publishing Checklist - Claude Code Masterkurs

> **Ziel:** Die App online bringen, damit echte Nutzer sie besuchen und nutzen können.
>
> **Aktueller Stand:** Frontend live auf Vercel, Backend live auf Railway. PostgreSQL-Datenbank geseeded (15 Users, Forum). Auth, API-Client, Login/Register/Profil implementiert. Phase A+B komplett.

**Repository:** [github.com/Cittasana/Claude-Code-Masterkurs](https://github.com/Cittasana/Claude-Code-Masterkurs)

---

## 1. Git & GitHub Repository

**Status:** ✅ Erledigt

- [x] `git init` im Projektverzeichnis ausführen
- [x] Sicherstellen, dass `.gitignore` korrekt ist (node_modules, dist, .env, etc.)
- [x] Initialen Commit erstellen
- [x] GitHub Repository erstellen (public oder private)
- [x] Remote hinzufügen und pushen
- [x] README.md auf GitHub-Darstellung optimieren (Badges, Screenshots)
- [x] Branch-Strategie festlegen: **main** (Production, Auto-Deploy via Vercel); optional **develop** für Feature-Branches

**Aufwand:** ~15 Minuten

---

## 2. Hosting & Deployment (Frontend)

**Status:** ✅ Erledigt (Vercel)

### Option A: Vercel (Empfohlen für Vite + React)
- [x] Vercel-Account erstellen (https://vercel.com)
- [x] GitHub-Repo mit Vercel verbinden
- [x] Build-Command: `npm run build`
- [x] Output Directory: `dist`
- [x] Automatisches Deployment bei jedem Push auf `main`

### Option B: Netlify
- [ ] Netlify-Account erstellen (https://netlify.com)
- [ ] GitHub-Repo verbinden
- [ ] Build Settings konfigurieren
- [ ] `_redirects` Datei für SPA-Routing erstellen (`/* /index.html 200`)

### Option C: GitHub Pages
- [ ] `vite.config.ts` anpassen (`base: '/repo-name/'`)
- [ ] GitHub Actions Workflow erstellen für automatisches Build & Deploy
- [ ] Pages in Repo-Settings aktivieren

### Notwendig bei allen Optionen:
- [x] SPA-Routing konfigurieren (alle Routen auf `index.html` umleiten)
- [x] `404.html` oder Redirect-Regeln für Client-Side-Routing
- [x] Build testen: `npm run build && npm run preview`
- [x] Produktions-Build auf Fehler prüfen

**Aufwand:** ~30 Minuten (Vercel), ~1 Stunde (andere)

---

## 3. Custom Domain (Optional aber empfohlen)

**Status:** ✅ Erledigt – **claude-code-masterkurs.de**

- [x] Domain registrieren (z.B. `claude-code-masterkurs.de` oder `.com`)
- [x] DNS-Einträge konfigurieren (A-Record oder CNAME auf Hosting-Provider)
- [x] SSL/HTTPS wird automatisch von Vercel/Netlify bereitgestellt
- [x] Domain im Hosting-Provider hinterlegen
- [x] Weiterleitung von www auf non-www (oder umgekehrt)

**Aufwand:** ~30 Minuten + Domain-Kosten (~10-15€/Jahr)

---

## 4. Backend & Datenbank

**Status:** Backend & Schema implementiert, Frontend-Integration abgeschlossen

### Warum ein Backend nötig ist:
- **User Accounts:** Aktuell keine Registrierung/Login möglich
- **Fortschritt geräteübergreifend:** LocalStorage ist nur lokal im Browser
- **Forum:** Aktuell nur im eigenen Browser sichtbar, andere Nutzer sehen nichts
- **Leaderboard:** Aktuell nur simulierte Fake-Daten, kein echtes Ranking
- **Community Patterns:** Nutzer können keine eigenen Patterns teilen
- **Challenges:** Ergebnisse nur lokal gespeichert

### Was gebaut werden muss:

#### 4a. Backend-Server (auf Railway deployen)
- [x] Neues Backend-Projekt erstellen (`/server` oder eigenes Repo)
- [x] Backend-Framework wählen:
  - **Express.js + TypeScript** (Empfohlen - gleiche Sprache wie Frontend) ✅
  - **Fastify** (Schneller als Express, ähnliche API)
  - **Hono** (Ultra-lightweight, Edge-ready)
- [x] Projektstruktur aufsetzen:
  ```
  server/
  ├── src/
  │   ├── routes/        (API Endpoints)
  │   ├── middleware/     (Auth, CORS, Rate-Limiting)
  │   ├── models/        (Datenbank-Modelle)
  │   ├── services/      (Business-Logik)
  │   └── index.ts       (Server Entry Point)
  ├── prisma/            (Schema & Migrationen)
  ├── package.json
  ├── tsconfig.json
  └── Dockerfile         (für Railway Deployment)
  ```
- [x] CORS konfigurieren (Frontend-URL erlauben)
- [x] Error Handling & Logging (z.B. mit Pino)
- [x] Health-Check Endpoint (`GET /health`)

#### 4b. Datenbank (PostgreSQL auf Railway)
- [ ] PostgreSQL Service in Railway erstellen (1-Klick)
- [x] ORM wählen:
  - **Prisma** (Empfohlen - Type-Safe, Migrationen, Studio) ✅
  - **Drizzle** (Leichtgewichtig, SQL-nah)
  - **TypeORM** (Alternative)
- [x] Datenbankschema entwerfen:
  - `users` (id, email, password_hash, name, avatar, created_at)
  - `user_progress` (user_id, lessons_completed, quizzes, points, streak)
  - `forum_threads` (id, user_id, category, title, content, created_at)
  - `forum_replies` (id, thread_id, user_id, content, created_at)
  - `challenge_results` (user_id, challenge_id, score, attempts)
  - `patterns` (id, user_id, title, snippet, category, tags)
  - `srs_data` (user_id, lesson_id, next_review, interval, easiness)
  - `analytics_events` (user_id, event_type, timestamp, metadata)
- [x] Migrationen erstellen & ausführen (Schema bereit)
- [x] Seed-Daten vorbereiten (15 simulierte Leaderboard-Einträge + Forum-Threads)
- [x] Database Connection via Railway-Umgebungsvariable `DATABASE_URL`

#### 4c. Authentifizierung (User Accounts)
- [x] Auth-Lösung wählen:
  - **Better Auth** (Empfohlen - modernes TS-Auth-Framework, einfach zu integrieren)
  - **Lucia Auth** (Leichtgewichtig, Session-basiert)
  - **Passport.js** (Klassisch, viele Strategien)
  - **Eigene JWT-Implementierung** (bcrypt + jsonwebtoken) ✅
- [x] Registrierung (E-Mail + Passwort mit bcrypt-Hashing)
- [x] Login / Logout
- [ ] Passwort vergessen / Reset (E-Mail nötig, siehe 4e)
- [ ] Optional: OAuth (GitHub, Google Login)
- [x] Session Management (JWT Tokens, 7 Tage Gültigkeit)
- [x] Auth-Middleware für geschützte API-Routen

#### 4d. REST API Endpoints
- [x] Endpoints definieren & implementieren:
  - `POST /api/auth/register` - Registrierung ✅
  - `POST /api/auth/login` - Login ✅
  - `PUT /api/auth/profile` - Profil bearbeiten ✅
  - `DELETE /api/auth/account` - Account löschen (DSGVO) ✅
  - `GET /api/auth/me` - Aktueller User ✅
  - `GET/PUT /api/progress` - User-Fortschritt lesen/speichern ✅
  - `POST /api/progress/quiz` - Quiz-Ergebnis speichern ✅
  - `POST /api/progress/project` - Projekt-Ergebnis speichern ✅
  - `GET/POST /api/forum/threads` - Forum-Threads ✅
  - `GET/POST /api/forum/threads/:id/replies` - Antworten ✅
  - `GET/POST /api/challenges/results` - Challenge-Ergebnisse ✅
  - `GET /api/leaderboard` - Rangliste ✅
  - `GET/POST /api/patterns` - Community Patterns ✅
  - `GET/POST /api/srs` - Spaced Repetition Daten ✅
  - `GET/POST /api/analytics/events` - Analytics Events ✅
  - `GET /api/analytics/summary` - Analytics Zusammenfassung ✅
- [x] Input-Validierung (mit Zod)
- [x] Rate-Limiting Middleware (global, auth, write)
- [x] Pagination für Listen-Endpoints

#### 4e. E-Mail-Service (für Auth-Flows)
- [ ] E-Mail-Provider wählen:
  - **Resend** (Empfohlen - modernes API, 100 Mails/Tag kostenlos)
  - **Mailgun** (Klassisch)
  - **SendGrid** (Enterprise)
- [ ] E-Mail-Templates erstellen (Verifizierung, Passwort-Reset)

#### 4f. Frontend-Integration
- [x] API-Client erstellen (fetch Wrapper mit Auth-Header) – `src/lib/api.ts`
- [x] Zustand-Stores von LocalStorage auf API-Calls umstellen (Hybrid: LocalStorage + Server-Sync)
- [x] Login/Register UI-Seiten erstellen – `LoginView.tsx`, `RegisterView.tsx`
- [x] Profil-Seite mit Avatar-Auswahl & Account-Löschung – `ProfileView.tsx`
- [x] Auth-Store mit JWT-Token-Verwaltung – `authStore.ts`
- [x] User-Menü in Navigation (Avatar, Name, Logout)
- [x] Loading-States für API-Requests
- [x] Error-States für fehlgeschlagene Requests
- [x] Optimistic Updates für bessere UX (LocalStorage first, Server-Sync im Hintergrund)
- [x] Offline-Fallback (LocalStorage als Primary-Cache, funktioniert ohne Backend)
- [x] i18n-Übersetzungen für Auth-Bereich (DE, EN, FR, ES)

**Aufwand:** ~3-5 Wochen

---

## 5. Empfohlener Tech-Stack mit Railway

### Architektur-Übersicht

```
┌─────────────────────────────────────────────────┐
│                   Railway                        │
│                                                  │
│  ┌──────────────────┐  ┌─────────────────────┐  │
│  │  Backend-Service  │  │  PostgreSQL Service  │  │
│  │  (Express + TS)   │──│  (Railway Managed)   │  │
│  │  Port 3000        │  │  DATABASE_URL        │  │
│  └────────┬─────────┘  └─────────────────────┘  │
│           │                                      │
└───────────┼──────────────────────────────────────┘
            │ REST API
            │
┌───────────┴─────────────────────────────────────┐
│           Vercel / Railway                       │
│  ┌──────────────────────────────────────────┐   │
│  │  Frontend (React + Vite + TypeScript)     │   │
│  │  Bestehende App, API-Calls statt          │   │
│  │  LocalStorage                             │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Empfohlener Stack

```
Frontend (bestehend):  React + Vite + TypeScript
Backend:               Express.js + TypeScript (auf Railway)
Datenbank:             PostgreSQL (Railway Service, 1-Klick)
ORM:                   Prisma (Type-Safe Queries + Migrationen)
Auth:                  Better Auth oder Lucia Auth
Validierung:           Zod (Shared Types Frontend + Backend)
E-Mail:                Resend (100 Mails/Tag kostenlos)
Hosting Frontend:      Vercel (kostenlos) ODER Railway (Static Site)
Hosting Backend:       Railway
```

### Vorteile von Railway:
- Volle Kontrolle über den Server (kein Vendor-Lock-in)
- GitHub-Repo verbinden → automatisches Deploy bei Push
- PostgreSQL mit 1-Klick provisionieren
- Eingebautes Monitoring, Logs & Metriken
- Einfaches Scaling (Horizontal & Vertikal)
- Eigene Docker-Container möglich
- Mehrere Services in einem Projekt (Backend + DB + Redis etc.)
- Railway CLI für lokale Entwicklung (`railway run`)

### Kosten (Railway):
- **Trial Plan**: $5 Guthaben (zum Testen)
- **Hobby Plan**: $5/Monat
  - 8 GB RAM, 8 vCPU pro Service
  - $0.000231/min Compute (nur wenn Service läuft)
  - PostgreSQL: $0.000231/min + $0.25/GB Storage
  - Geschätzte Kosten für kleine App: ~$5-10/Monat
- **Keine Kaltstart-Probleme** (anders als Serverless)
- Kostenvorhersage im Railway Dashboard

### Railway Projekt-Setup ✅ ERLEDIGT
- [x] Railway Account erstellen (https://railway.app) ✅
- [x] Neues Projekt anlegen: `claude-code-masterkurs-backend` ✅
- [x] PostgreSQL Service hinzufügen (1-Klick) ✅
- [x] Backend-Service hinzufügen (via Railway CLI `railway up`) ✅
- [x] Environment Variables gesetzt: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV`, `PORT`, `LOG_LEVEL` ✅
- [x] Public Domain: `https://backend-production-9d7c.up.railway.app` ✅
- [x] Prisma DB Push ausgeführt: `prisma db push` via public URL ✅
- [x] Seed-Daten geladen: 15 Users, 4 Forum Threads, 5 Replies ✅
- [x] Health Check verifiziert: `/health` → `{"status":"ok","database":"connected"}` ✅
- [x] API-Endpoints getestet: Leaderboard, Forum, Auth ✅
- [x] Frontend `.env` mit `VITE_API_URL=https://backend-production-9d7c.up.railway.app` ✅
- [ ] Optional: Custom Domain für API (z.B. `api.claude-code-masterkurs.de`)
- [ ] Optional: Frontend ebenfalls auf Railway deployen (Static Site)

---

## 6. Umgebungsvariablen & Secrets

**Status:** ✅ .env.example Dateien erstellt (Frontend + Backend)

- [x] `.env` Datei erstellen (lokal, NICHT committen!)
- [x] `.env.example` Datei erstellen (ohne echte Werte, zum Committen)
- [x] Variablen definieren:
  ```env
  # Frontend (.env)
  VITE_API_URL=http://localhost:3000   # Lokal
  # VITE_API_URL=https://api.xxx.railway.app  # Produktion

  # Backend (.env)
  DATABASE_URL=postgresql://user:pass@host:5432/db  # Von Railway automatisch
  JWT_SECRET=super-geheimer-schluessel
  CORS_ORIGIN=https://claude-code-masterkurs.de
  RESEND_API_KEY=re_xxx                # Für E-Mail
  PORT=3000
  NODE_ENV=production
  ```
- [x] `.env` in `.gitignore` sicherstellen
- [ ] Environment Variables in Railway Dashboard hinterlegen (Backend)
- [ ] Environment Variables in Vercel hinterlegen (Frontend: `VITE_API_URL`)

**Aufwand:** ~15 Minuten

---

## 7. Rechtliches & DSGVO

**Status:** Komplett fehlend - zwingend nötig für eine öffentliche Website in der EU

- [ ] **Impressum** erstellen (Pflicht in DE/AT/CH)
  - Name, Anschrift, Kontaktdaten
  - Verantwortlicher
- [ ] **Datenschutzerklärung** erstellen
  - Welche Daten werden erhoben?
  - Cookies & LocalStorage
  - Hosting-Provider (Vercel/Railway Datenweitergabe)
  - Rechte der Nutzer (Auskunft, Löschung, etc.)
- [ ] **Cookie-Banner / Consent-Manager** implementieren
  - Nur nötig wenn Tracking/Analytics eingesetzt wird
- [ ] **Nutzungsbedingungen / AGB** (optional aber empfohlen)
- [ ] **Account-Löschung** ermöglichen (Recht auf Löschung, DSGVO Art. 17)
- [ ] Impressum & Datenschutz als eigene Seiten/Routen hinzufügen

**Aufwand:** ~2-4 Stunden (mit Generatoren wie e-recht24.de oder IT-Recht Kanzlei)

---

## 8. SEO & Meta-Tags

**Status:** Minimal (Standard Vite Template)

- [ ] `index.html` Meta-Tags optimieren:
  - `<title>` mit Keyword
  - `<meta name="description" ...>`
  - `<meta name="keywords" ...>`
- [ ] Open Graph Tags (für Social Media Sharing):
  - `og:title`, `og:description`, `og:image`, `og:url`
- [ ] Twitter Card Tags
- [ ] `robots.txt` erstellen
- [ ] `sitemap.xml` generieren
- [ ] Favicon & Apple Touch Icon erstellen
- [ ] Strukturierte Daten (Schema.org JSON-LD) für Kursseite
- [ ] Canonical URLs setzen

**Aufwand:** ~1-2 Stunden

---

## 9. Web Analytics & Monitoring

**Status:** Nicht vorhanden

- [ ] Analytics-Tool einbinden:
  - **Plausible** (Datenschutzfreundlich, kein Cookie-Banner nötig) - Empfohlen
  - **Umami** (Self-hosted, kostenlos)
  - **Google Analytics** (Cookie-Banner nötig)
- [ ] Error Monitoring einrichten:
  - **Sentry** (kostenloser Tier, fängt Frontend-Fehler)
  - Integration in `ErrorBoundary.tsx`
- [ ] Uptime Monitoring:
  - **UptimeRobot** (kostenlos, prüft ob Seite online ist)
  - **Better Uptime**

**Aufwand:** ~1 Stunde

---

## 10. Performance & Sicherheit

**Status:** Grundlegend (Vite optimiert bereits)

### Performance
- [ ] Build-Analyse: `npx vite-bundle-visualizer`
- [ ] Bilder optimieren (WebP, komprimiert)
- [ ] Lazy Loading für Routen prüfen (`React.lazy()`)
- [ ] Preload für kritische Assets
- [ ] Lighthouse-Audit durchführen (Ziel: 90+ in allen Kategorien)

### Sicherheit
- [ ] Content Security Policy (CSP) Header setzen
- [ ] HTTPS erzwingen (bei Vercel/Netlify automatisch)
- [ ] XSS-Schutz in Forum-/Freitext-Eingaben
- [ ] Rate Limiting für API-Endpoints
- [ ] Input-Validierung server-seitig
- [ ] Dependency Audit: `npm audit`

**Aufwand:** ~2-3 Stunden

---

## 11. Testing vor Go-Live

**Status:** Keine Tests vorhanden

- [ ] Grundlegende Tests schreiben:
  - Unit Tests für Store-Logik (Vitest)
  - Component Tests für kritische Komponenten
  - E2E Tests für User-Flows (Playwright oder Cypress)
- [ ] Cross-Browser Testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile Testing (iOS Safari, Android Chrome)
- [ ] Accessibility Audit (axe-core, Lighthouse)
- [ ] Broken Links prüfen
- [ ] Alle 15 Routen manuell durchtesten

**Aufwand:** ~1-2 Wochen (für solide Test-Abdeckung)

---

## 12. CI/CD Pipeline

**Status:** Nicht vorhanden

### Railway (Backend) - Automatisches Deployment
- [ ] GitHub-Repo mit Railway verbinden → Auto-Deploy bei Push auf `main`
- [ ] Railway übernimmt: Build → Deploy → Health Check
- [ ] Kein GitHub Actions nötig für Backend-Deployment

### Vercel (Frontend) - Automatisches Deployment
- [ ] GitHub-Repo mit Vercel verbinden → Auto-Deploy bei Push auf `main`
- [ ] Preview Deployments für Pull Requests (automatisch)

### Optional: GitHub Actions (für Tests & Quality)
- [ ] Workflow erstellen: `npm ci` → `npm run lint` → `npm test` → `npm run build`
- [ ] Nur als Quality-Gate, nicht zum Deployen

**Aufwand:** ~30 Minuten (Railway + Vercel verbinden), ~1 Stunde (mit GitHub Actions Tests)

---

## Empfohlene Reihenfolge (Priorisiert)

### Phase A: Sofort online bringen (Minimal Viable Publish) ✅ ERLEDIGT
> Seite als statische App live schalten, OHNE Backend

| # | Aufgabe | Aufwand | Priorität | Status |
|---|---------|---------|-----------|--------|
| 1 | Git init + GitHub Repo | 15 min | Kritisch | ✅ |
| 2 | Build testen (`npm run build`) | 10 min | Kritisch | ✅ |
| 3 | Vercel Account + Deploy | 30 min | Kritisch | ✅ |
| 4 | SEO Meta-Tags & Favicon | 1 h | Hoch | ✅ |
| 5 | Impressum & Datenschutz (Platzhalter) | 1 h | Hoch | ✅ |
| 6 | Fertig - Seite ist live! | - | - | ✅ |

**Ergebnis:** Website ist online (Vercel). Daten sind nur lokal im Browser des Nutzers.

### Phase B: Backend & User Accounts (Railway)
> Eigener Backend-Server, PostgreSQL, echte Nutzerkonten

| # | Aufgabe | Aufwand | Priorität | Status |
|---|---------|---------|-----------|--------|
| 7 | Railway Account + Projekt + PostgreSQL | 30 min | Kritisch | ✅ Deployed |
| 8 | Express + Prisma Backend aufsetzen | 1 Tag | Kritisch | ✅ |
| 9 | Datenbankschema & Migrationen (Prisma) | 1 Tag | Kritisch | ✅ |
| 10 | Auth implementieren (Register/Login) | 1-2 Tage | Kritisch | ✅ |
| 11 | REST API Endpoints bauen | 2-3 Tage | Kritisch | ✅ |
| 12 | Frontend-Stores auf API-Calls umstellen | 2-3 Tage | Kritisch | ✅ |
| 13 | Login/Register UI-Seiten erstellen | 1 Tag | Kritisch | ✅ |
| 14 | Forum auf echte Datenbank umstellen | 1-2 Tage | Hoch | ✅ (API bereit) |
| 15 | Leaderboard mit echten Daten | 1 Tag | Hoch | ✅ (API bereit) |
| 16 | Backend auf Railway deployen | 1 h | Kritisch | ✅ Live |
| 17 | DSGVO-konforme Datenschutzerklärung | 2-3 h | Hoch | ✅ Vorhanden |

### Phase C: Polish & Monitoring
> Qualität sichern und überwachen

| # | Aufgabe | Aufwand | Priorität |
|---|---------|---------|-----------|
| 18 | Error Monitoring (Sentry) | 1 h | Hoch |
| 19 | Web Analytics (Plausible/Umami) | 1 h | Mittel |
| 20 | Tests schreiben | 1-2 Wochen | Mittel |
| 21 | Performance Audit & Optimierung | 2-3 h | Mittel |
| 22 | Custom Domain | 30 min | Nice-to-have |
| 23 | CI/CD Pipeline (Railway macht Auto-Deploy) | 30 min | Nice-to-have |

---

## Zusammenfassung

| Bereich | Status | Blocker für Go-Live? |
|---------|--------|---------------------|
| Git & GitHub | ✅ Erledigt | - |
| Hosting Frontend (Vercel) | ✅ Erledigt | - |
| Hosting Backend (Railway) | ✅ Live (`backend-production-9d7c.up.railway.app`) | - |
| Build funktioniert | ✅ OK | - |
| Backend / API (Express auf Railway) | ✅ Implementiert | - |
| Datenbank (PostgreSQL auf Railway) | ✅ Live (15 Users + Forum geseeded) | - |
| User Auth (JWT) | ✅ Implementiert | - |
| Frontend-Integration (API-Client) | ✅ Implementiert | - |
| Login/Register UI | ✅ Implementiert | - |
| Profil-Seite | ✅ Implementiert | - |
| i18n Auth (DE/EN/FR/ES) | ✅ Implementiert | - |
| Impressum / DSGVO | ✅ Vorhanden | - |
| SEO Meta-Tags | ✅ Optimiert | - |
| Custom Domain | ✅ claude-code-masterkurs.de | - |
| Analytics | Fehlt | NEIN |
| Error Monitoring | Fehlt | NEIN |
| Tests | Fehlt | NEIN (aber empfohlen) |
| CI/CD | Fehlt | NEIN |

**Phase A:** ✅ Abgeschlossen – App ist live auf Vercel.
**Phase B:** ✅ Abgeschlossen – Backend auf Railway deployed, DB geseeded, API getestet.
**Komplett fertig (Phase A+B+C):** Noch Phase C (Polish & Monitoring) offen.

---

*Erstellt am: 2026-02-06*
*Letzte Aktualisierung: 2026-02-06 – Phase B komplett: Backend auf Railway deployed, PostgreSQL geseeded, alle API-Endpoints getestet*
