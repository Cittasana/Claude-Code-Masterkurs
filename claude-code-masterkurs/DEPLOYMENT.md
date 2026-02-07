# Deployment Guide - Claude Code Masterkurs

Dieses Dokument beschreibt das komplette CI/CD-Setup mit **GitHub Actions** (Quality Gate), **Vercel** (Frontend) und **Railway** (Backend).

---

## Architektur-Übersicht

```
GitHub Repository
    │
    ├── Push auf main / Pull Request
    │       │
    │       ▼
    │   GitHub Actions CI
    │   ├── Frontend: Lint → TypeCheck → Build
    │   ├── Backend:  Lint → TypeCheck → Build
    │   └── Security Audit
    │
    ├── Push auf main (nach CI-Erfolg)
    │       │
    │       ├──▶ Vercel (Frontend)
    │       │    Auto-Deploy → Preview URL → Production
    │       │
    │       └──▶ Railway (Backend)
    │            Auto-Deploy → Docker Build → Health Check
    │
    └── Pull Request
            │
            └──▶ Vercel Preview Deployment (automatisch)
```

---

## 1. GitHub Actions - Quality Gate

### Was passiert automatisch?

Bei jedem **Push auf `main`** und jedem **Pull Request**:

| Job | Schritte | Dauer |
|-----|----------|-------|
| **Frontend** | `npm ci` → `lint` → `tsc --noEmit` → `vite build` | ~2 Min |
| **Backend** | `npm ci` → `prisma generate` → `lint` → `tsc --noEmit` → `tsc` | ~1.5 Min |
| **Security** | `npm audit` für Frontend + Backend | ~30 Sek |

### Workflow-Datei

```
.github/workflows/ci.yml
```

### Konfiguration

Keine zusätzliche Konfiguration nötig — der Workflow funktioniert sofort nach dem Push.

---

## 2. Vercel - Frontend Deployment

### Ersteinrichtung (einmalig, ~10 Minuten)

1. **Vercel-Account erstellen** auf [vercel.com](https://vercel.com)

2. **GitHub-Repo verbinden:**
   - Vercel Dashboard → "Add New Project"
   - GitHub-Repo auswählen: `claude-code-masterkurs`
   - **Framework Preset:** Vite (wird automatisch erkannt)
   - **Root Directory:** `.` (Standard)
   - **Build Command:** `npm run build` (automatisch aus `vercel.json`)
   - **Output Directory:** `dist` (automatisch aus `vercel.json`)

3. **Environment Variables setzen:**
   ```
   VITE_API_URL = https://<dein-backend>.up.railway.app
   ```

4. **Deploy klicken** → Erste Deployment läuft

### Was passiert danach automatisch?

- **Push auf `main`** → Production Deployment
- **Pull Request** → Preview Deployment mit eigener URL
- **Rollback** → Ein-Klick im Vercel Dashboard

### Vorhandene Konfiguration

Die `vercel.json` ist bereits konfiguriert mit:
- SPA-Rewrites (alle Routen → `index.html`)
- Cache-Header für Assets (1 Jahr, immutable)
- Security-Header (X-Frame-Options, CSP, etc.)

### Custom Domain (optional)

1. Vercel Dashboard → Project Settings → Domains
2. Domain hinzufügen (z.B. `claude-code-masterkurs.de`)
3. DNS-Einträge beim Provider setzen (Vercel zeigt die Werte an)

---

## 3. Railway - Backend Deployment

### Ersteinrichtung (einmalig, ~20 Minuten)

1. **Railway-Account erstellen** auf [railway.app](https://railway.app)

2. **Neues Projekt erstellen:**
   - Railway Dashboard → "New Project"
   - "Deploy from GitHub repo" wählen
   - Repository auswählen: `claude-code-masterkurs`

3. **Root Directory konfigurieren:**
   - Service Settings → **Root Directory:** `server`
   - Railway erkennt automatisch das `Dockerfile`

4. **PostgreSQL-Datenbank hinzufügen:**
   - Im Projekt: "+ New" → "Database" → "PostgreSQL"
   - Railway setzt `DATABASE_URL` automatisch als Variable

5. **Environment Variables setzen:**
   ```
   JWT_SECRET        = <zufälliger String, mind. 32 Zeichen>
   CORS_ORIGIN       = https://<dein-frontend>.vercel.app
   NODE_ENV          = production
   LOG_LEVEL         = info
   PORT              = 3000
   ```

   JWT Secret generieren:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

6. **Deploy starten** → Railway baut das Docker-Image und deployt

### Was passiert danach automatisch?

- **Push auf `main`** → Railway baut neues Docker-Image → Deploy → Health Check
- **Health Check:** Railway prüft `/health` Endpoint (Timeout: 60s)
- **Rollback:** Ein-Klick im Railway Dashboard
- **Auto-Restart:** Bei Fehler bis zu 5 Neuversuche

### Vorhandene Konfiguration

**`railway.toml`:**
- Docker-basierter Build
- Health Check auf `/health` (60s Timeout)
- 1 Replica, Auto-Restart bei Fehler

**`Dockerfile`:**
- Multi-Stage Build (Builder → Production)
- Node 22 Alpine (minimales Image)
- Nur Production Dependencies im finalen Image
- Prisma Client wird generiert

### Datenbank-Migration (nach erstem Deploy)

```bash
# Einmalig: Migration auf Railway ausführen
railway run npx prisma migrate deploy

# Optional: Seed-Daten einspielen
railway run npx tsx prisma/seed.ts
```

---

## 4. Zusammenspiel der Services

### Deployment-Flow bei einem Push auf `main`

```
1. Push auf main
       │
       ▼
2. GitHub Actions startet CI
   ├── Frontend-Check ✓
   ├── Backend-Check  ✓
   └── Security-Check ✓
       │
       ▼ (parallel, unabhängig von CI)
3a. Vercel deployt Frontend
    └── Build → Deploy → Live ✓
       │
3b. Railway deployt Backend
    └── Docker Build → Deploy → Health Check ✓
       │
       ▼
4. Alles live! 🎉
```

> **Hinweis:** Vercel und Railway deployen unabhängig von GitHub Actions.
> Die CI-Checks dienen als Quality Gate — sie blockieren nicht das Deployment,
> können aber als "Required Check" für Pull Requests konfiguriert werden.

### Pull Request Workflow

```
1. PR erstellen
       │
       ▼
2. GitHub Actions: CI läuft
   └── Status-Check im PR sichtbar
       │
       ▼
3. Vercel: Preview Deployment
   └── Preview-URL im PR-Kommentar
       │
       ▼
4. Review → Merge → Production Deploy
```

---

## 5. Branch Protection (empfohlen)

Auf GitHub unter Settings → Branches → Branch Protection Rules:

1. **Branch:** `main`
2. **Require status checks:**
   - `Frontend - Lint & Build`
   - `Backend - Lint & Build`
3. **Require pull request reviews:** 1 Reviewer (optional)
4. **Dismiss stale reviews:** Aktivieren

So wird verhindert, dass fehlerhafter Code auf `main` gemerged wird.

---

## 6. Monitoring & Debugging

### Vercel
- **Logs:** Dashboard → Deployments → Functions Tab
- **Analytics:** Dashboard → Analytics (Web Vitals)
- **Errors:** Dashboard → Deployments → Error Tab

### Railway
- **Logs:** Dashboard → Service → Logs Tab
- **Metriken:** Dashboard → Service → Metrics (CPU, RAM, Network)
- **Datenbank:** Dashboard → PostgreSQL → Query Tab

### GitHub Actions
- **Workflow-Runs:** Repository → Actions Tab
- **Fehler-Details:** Klick auf fehlgeschlagenen Job → Logs

---

## Checkliste für Go-Live

- [ ] GitHub-Repo erstellt und Code gepusht
- [ ] Vercel mit GitHub-Repo verbunden
- [ ] Vercel Environment Variables gesetzt (`VITE_API_URL`)
- [ ] Railway mit GitHub-Repo verbunden
- [ ] Railway Root Directory auf `server` gesetzt
- [ ] Railway PostgreSQL-Datenbank hinzugefügt
- [ ] Railway Environment Variables gesetzt (JWT_SECRET, CORS_ORIGIN, etc.)
- [ ] Datenbank-Migration auf Railway ausgeführt
- [ ] Health Check auf Railway erfolgreich
- [ ] Frontend kann mit Backend kommunizieren (CORS korrekt)
- [ ] Branch Protection auf `main` aktiviert (optional)
- [ ] Custom Domain konfiguriert (optional)
