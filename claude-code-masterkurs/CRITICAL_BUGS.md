# Kritische Bugs - Sofort fixen

**Datum:** 2026-02-07 15:50 UTC
**Status:** 2 kritische Bugs gefunden

---

## 🔴 Bug 1: Registrierung schlägt fehl

**Problem:**
```bash
curl -X POST https://api.claude-code-masterkurs.de/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"Test1234!","displayName":"TestUser"}'

# Response: {"error":"Internal server error"}
```

**Mögliche Ursachen:**
1. `EmailVerification` Table existiert nicht in Production-DB
2. `UserProgress` Relation funktioniert nicht
3. Migration nicht deployed

**Logs prüfen:**
```bash
# Railway CLI
railway logs --service backend

# Oder im Railway Dashboard:
https://railway.app → Projekt → backend → Logs
```

**Fix:**
1. Prüfe ob Migrationen in Railway deployed wurden:
   ```bash
   railway run prisma migrate status
   ```

2. Falls Migrationen fehlen, deploye sie:
   ```bash
   railway run prisma migrate deploy
   ```

3. **Alternative:** Führe Migrationen direkt in Railway aus:
   - Railway Dashboard → backend Service → Variables
   - Füge hinzu: `DATABASE_URL` (sollte schon da sein)
   - Railway Dashboard → backend Service → Settings → Deploy Trigger
   - Klicke "Deploy"

---

## 🔴 Bug 2: Promo-Code Validierung erfordert Login

**Problem:**
- Promo-Code Validierung hat `requireAuth` Middleware
- User können sich nicht registrieren, weil sie sich erst einloggen müssten
- Henne-Ei-Problem

**Gefixte Datei:** `server/src/routes/subscription.ts` (Zeile 170)

**Commit:** `71b782a` - "Fix: Remove requireAuth from promo code validation"

**Status:** ✅ Gefixt im Code, aber **Railway hat nicht auto-deployed!**

**Manual Redeploy:**
1. Railway Dashboard → backend Service
2. Klicke oben rechts "..." → "Redeploy"
3. Warte 1-2 Minuten

**Verifikation:**
```bash
# Nach Redeploy testen:
curl -X POST https://api.claude-code-masterkurs.de/api/subscription/validate-promo-code \
  -H "Content-Type: application/json" \
  -d '{"code":"WELCOME2024"}'

# Erwartung: {"valid":true,"code":"WELCOME2024",...}
# Aktuell: {"error":"Not found"} ← Route existiert noch nicht
```

---

## 🔧 Sofort-Maßnahmen

### 1. Railway Auto-Deploy aktivieren

**Problem:** Railway deployed nicht automatisch bei Git Push

**Lösung:**
1. Railway Dashboard → backend Service
2. Settings → Service Settings
3. "Watch Paths" sollte gesetzt sein auf: `claude-code-masterkurs/server/**`
4. "Root Directory" sollte sein: `claude-code-masterkurs/server`
5. "Build Command" sollte sein: `npm run build` oder leer (default)
6. "Start Command" sollte sein: `npm start`

### 2. Manuelles Redeploy

Da Auto-Deploy nicht funktioniert, manuell triggern:

**Option A: Railway Dashboard**
1. https://railway.app → Projekt auswählen
2. backend Service → "..." → "Redeploy"

**Option B: Railway CLI**
```bash
railway up --service backend
```

**Option C: Empty Commit mit Railway Trigger**
```bash
git commit --allow-empty -m "trigger: railway redeploy"
git push origin main
```

### 3. Logs prüfen nach Redeploy

```bash
# Check uptime (sollte < 60 Sekunden sein nach Redeploy)
curl -s https://api.claude-code-masterkurs.de/health | jq .uptime

# Test Promo-Code
curl -X POST https://api.claude-code-masterkurs.de/api/subscription/validate-promo-code \
  -H "Content-Type: application/json" \
  -d '{"code":"WELCOME2024"}' | jq

# Test Registrierung
curl -X POST https://api.claude-code-masterkurs.de/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test'"$(date +%s)"'@example.com","password":"Test1234!","displayName":"TestUser"}' | jq
```

---

## 📋 Deployment Checklist

- [ ] Railway Auto-Deploy konfiguriert
- [ ] Backend manuell redeployed
- [ ] Migrations deployed (`prisma migrate deploy`)
- [ ] Promo-Code Validierung funktioniert (ohne Auth)
- [ ] Registrierung funktioniert
- [ ] Logs geprüft (keine Errors)

---

## 🔍 Root Cause

**Warum ist das Problem entstanden?**

1. **Promo-Code Bug:** `requireAuth` wurde bei der initialen Implementation gesetzt, ohne zu bedenken dass nicht-eingeloggte User Codes validieren müssen.

2. **Registrierungs-Bug:** Wahrscheinlich fehlen Migrationen in Production. Die Migrationen wurden zwar commitet, aber Railway hat sie möglicherweise nicht ausgeführt.

3. **Auto-Deploy:** Railway Watch Paths sind möglicherweise nicht korrekt konfiguriert für Monorepo-Struktur.

---

## 💡 Lessons Learned

1. **Immer testen mit echtem nicht-eingeloggtem User** - nicht nur mit bereits existierenden Test-Accounts
2. **Railway Watch Paths für Monorepos** explizit setzen
3. **Migrations explizit deployen** mit `prisma migrate deploy` im Build-Command oder als separater Step
4. **Health-Check sollte Migration-Status enthalten** - zeigt ob Schema up-to-date ist

---

**Status:** Fixes committed, warten auf Railway Redeploy.
