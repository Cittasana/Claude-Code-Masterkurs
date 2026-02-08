# Railway Manual Deploy - Anleitung

**Problem:** Auto-Deploy funktioniert nicht nach Git Push
**Lösung:** Manuelles Redeploy im Railway Dashboard

---

## 🚀 Sofortiger Fix (Manuelles Redeploy)

### Option 1: Railway Dashboard (Web)

1. Gehe zu: https://railway.app
2. Login mit deinem Account
3. Wähle Projekt: `claude-code-masterkurs-backend` (oder ähnlich)
4. Klicke auf **backend Service** (nicht Postgres!)
5. Oben rechts: Klicke auf **"..."** (3 Punkte)
6. Wähle **"Redeploy"**
7. Warte 1-2 Minuten

### Option 2: Railway CLI

```bash
# Falls Railway CLI installiert ist:
railway login
railway link
railway up --service backend

# Oder direkt redeploy triggern:
railway redeploy --service backend
```

---

## ⚙️ Auto-Deploy konfigurieren (Dauerhaft)

### Schritt 1: Service Settings prüfen

1. Railway Dashboard → Projekt → **backend Service**
2. Klicke auf **Settings** (linke Sidebar)
3. Scrolle zu **Service Settings**

### Schritt 2: GitHub Integration prüfen

Unter "Source" sollte stehen:
```
Repository: Cittasana/Claude-Code-Masterkurs
Branch: main
```

Wenn nicht:
1. Klicke "Disconnect" (falls verbunden)
2. Klicke "Connect to GitHub"
3. Wähle Repository: `Cittasana/Claude-Code-Masterkurs`
4. Branch: `main`

### Schritt 3: Root Directory setzen

**WICHTIG für Monorepo-Struktur!**

In Service Settings → **Root Directory**:
```
claude-code-masterkurs/server
```

**Ohne** führenden Slash!

### Schritt 4: Watch Paths setzen (Optional)

Falls vorhanden, unter **Watch Paths**:
```
claude-code-masterkurs/server/**
```

Dies stellt sicher dass nur bei Änderungen im `server/` Verzeichnis neu deployed wird.

### Schritt 5: Build Settings

- **Build Command:** (leer lassen, Dockerfile wird verwendet)
- **Start Command:** (leer lassen, Dockerfile CMD wird verwendet)

### Schritt 6: Migrations in Dockerfile

Prüfe ob das Dockerfile Migrationen ausführt. In `/server/Dockerfile` sollte stehen:

```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
```

Wenn nicht, ändere die CMD-Zeile entsprechend.

---

## ✅ Verifikation nach Redeploy

### 1. Health Check
```bash
curl -s https://api.claude-code-masterkurs.de/health | jq

# Erwartung: uptime < 120 Sekunden (frisches Deployment)
```

### 2. Promo Code Validation (OHNE Auth!)
```bash
curl -s -X POST https://api.claude-code-masterkurs.de/api/subscription/validate-promo-code \
  -H "Content-Type: application/json" \
  -d '{"code":"WELCOME2024"}' | jq

# Erwartung:
# {
#   "valid": true,
#   "code": "WELCOME2024",
#   "description": "Willkommensbonus - 6 Monate kostenlos",
#   "durationMonths": 6
# }
```

### 3. Registrierung
```bash
TIMESTAMP=$(date +%s)
curl -s -X POST https://api.claude-code-masterkurs.de/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test${TIMESTAMP}@example.com\",
    \"password\": \"Test1234!\",
    \"displayName\": \"TestUser\"
  }" | jq

# Erwartung:
# {
#   "user": { ... },
#   "token": "eyJhbGciOi..."
# }
```

### 4. Logs prüfen
```bash
# Im Railway Dashboard:
1. backend Service → Deployments
2. Neuestes Deployment anklicken
3. "View Logs" anklicken

# Oder mit CLI:
railway logs --service backend --tail 50
```

**Suche nach:**
- ✅ "Prisma schema loaded"
- ✅ "✓ Generated Prisma Client"
- ✅ "Server listening on port 3000"
- ❌ Keine Errors in den Logs

---

## 🔍 Troubleshooting

### Problem: "Internal server error" bei Registrierung

**Ursache:** Migrationen nicht deployed

**Fix:**
```bash
# Option A: In Railway Dashboard
1. backend Service → Settings → Variables
2. Prüfe ob DATABASE_URL gesetzt ist
3. backend Service → Settings → Deploy
4. Ändere Start Command zu:
   npx prisma migrate deploy && node dist/index.js

# Option B: Mit Railway CLI
railway run --service backend npx prisma migrate deploy
```

### Problem: "Not found" bei Promo Code

**Ursache:** Neue Route noch nicht deployed

**Fix:** Manuelles Redeploy (siehe oben)

### Problem: Auto-Deploy funktioniert immer noch nicht

**Mögliche Ursachen:**
1. **GitHub Webhook fehlt:**
   - GitHub Repo → Settings → Webhooks
   - Sollte Railway Webhook enthalten
   - Wenn nicht: In Railway Service trennen und neu verbinden

2. **Root Directory falsch:**
   - Muss exakt sein: `claude-code-masterkurs/server`
   - OHNE führenden `/`

3. **Railway Plan-Limit:**
   - Hobby Plan hat Build-Limits
   - Prüfe im Dashboard ob Builds fehlschlagen

---

## 📋 Post-Deploy Checklist

- [ ] Health Check uptime < 2 min (frisches Deployment)
- [ ] Promo Code Validation funktioniert (ohne Auth)
- [ ] Registrierung funktioniert
- [ ] Keine Errors in Railway Logs
- [ ] Auto-Deploy für nächsten Push konfiguriert

---

## 🚨 Wenn nichts hilft

**Nuclear Option: Service neu erstellen**

1. Railway Dashboard → Projekt
2. Erstelle NEUEN Service: **"New Service"**
3. Source: **GitHub Repo**
4. Wähle: `Cittasana/Claude-Code-Masterkurs`
5. Root Directory: `claude-code-masterkurs/server`
6. Environment Variables übertragen:
   - `DATABASE_URL` (von Postgres Service)
   - `JWT_SECRET`
   - `CORS_ORIGIN`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_ID_LIFETIME`
   - `RESEND_API_KEY`
   - `SENTRY_DSN` (optional)
   - `FRONTEND_URL`
7. Deploy starten
8. Custom Domain neu zuweisen: `api.claude-code-masterkurs.de`
9. Alten Service löschen

---

**Nach manuellem Redeploy sollten beide Bugs gefixt sein!**
