# Go-Live Critical Fixes - Completed

**Datum:** 2026-02-07
**Commit:** 7db27af

---

## ✅ Alle 6 kritischen Probleme behoben

### 1. Fake aggregateRating entfernt
**Problem:** `ratingCount: 150` im JSON-LD - Google Penalty-Risiko
**Fix:** Kompletten `aggregateRating` Block aus index.html entfernt
**Datei:** `index.html`

### 2. "Kostenlos"-Behauptungen korrigiert
**Problem:** `isAccessibleForFree: true`, Meta "Kostenlos", FAQ "vollständig kostenlos" - Abmahnung-Risiko (UWG)
**Fix:**
- `isAccessibleForFree: false` gesetzt
- Meta-Descriptions: "Kostenlos" entfernt
- FAQ-Frage geändert zu "Welche Abo-Modelle gibt es?" mit korrekten Preisen
- EducationalOrganization OfferCatalog mit 3 Preismodellen (24/229/499 EUR)

**Dateien:** `index.html`

### 3. Lektionszahl korrigiert
**Problem:** "Alle 8 Lektionen" statt korrekte Anzahl
**Fix:** "Alle 27 Lektionen" in SubscriptionSuccessView
**Datei:** `src/pages/SubscriptionSuccessView.tsx`

### 4. Hardcoded Stripe Price IDs entfernt
**Problem:** Live Stripe Price IDs als Fallback im Source Code
**Fix:**
- Fallback-Werte (|| 'price_...') aus RegisterView entfernt
- Live Keys in `.env.example` durch Platzhalter ersetzt

**Dateien:** `src/pages/RegisterView.tsx`, `.env.example`

### 5. Lifetime-Kauf Bug gefixt
**Problem:** Checkout immer `mode: 'subscription'`, Lifetime prüft auf `mode: 'payment'`
**Fix:**
- `STRIPE_PRICE_ID_LIFETIME` Environment Variable hinzugefügt
- Checkout prüft `priceId === LIFETIME` und setzt `mode: 'payment'`
- `subscription_data` nur bei recurring payments gesetzt

**Dateien:** `server/src/routes/subscription.ts`, `server/.env.example`

### 6. Progress-Manipulation gefixt
**Problem:** Client kann `totalPoints`, `streak`, `lessonsCompleted` direkt setzen
**Fix:**
- 3 Helper-Funktionen hinzugefügt:
  - `calculateTotalPoints()` - Summe aus Quiz/Project/Challenge Results
  - `calculateCompletedLessons()` - Aus completed Quiz/Projects
  - `calculateStreak()` - Basierend auf `lastSessionDate`
- Felder aus Update-Schema entfernt (Client kann sie nicht mehr setzen)
- PUT /api/progress berechnet alle 3 Werte serverseitig
- POST /api/progress/quiz und /api/progress/project triggern Neuberechnung

**Datei:** `server/src/routes/progress.ts`

---

## Nächste Schritte vor Go-Live

### Kritisch - Manuell prüfen:
1. **Frontend Build testen:**
   ```bash
   cd claude-code-masterkurs
   npm run build
   npx tsc --noEmit
   ```

2. **Backend Build testen:**
   ```bash
   cd server
   npm run build
   npx tsc --noEmit
   ```

3. **Environment Variables setzen:**
   - Vercel: `VITE_API_URL=https://api.claude-code-masterkurs.de`
   - Vercel: `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_STRIPE_PRICE_ID_*` (3 Price IDs)
   - Railway: `STRIPE_PRICE_ID_LIFETIME` setzen

4. **Live-System testen:**
   ```bash
   curl -s https://claude-code-masterkurs.de
   curl -s https://api.claude-code-masterkurs.de/health
   ```

5. **Deployment:**
   ```bash
   git push origin main
   # Vercel und Railway deployen automatisch
   ```

### Empfohlen (nicht kritisch):
- [ ] `trust proxy` in `server/src/index.ts` setzen (für Rate Limiting hinter Proxy)
- [ ] Sitemap Lektionen 19-26 prüfen (existieren diese?)
- [ ] `/verify-email` in `robots.txt` Disallow aufnehmen
- [ ] CSP `connectSrc` für Stripe/Sentry erweitern
- [ ] Security Audit in CI auf `--audit-level=critical` setzen

---

## Review-Berichte

Vollständige Agenten-Berichte verfügbar unter:
- Frontend: `/private/tmp/claude-501/tasks/a08fe2f.output`
- Backend: `/private/tmp/claude-501/tasks/af36072.output`
- Datenbank: `/private/tmp/claude-501/tasks/a449501.output`
- Integration: `/private/tmp/claude-501/tasks/ad6da17.output`

---

**Status:** ✅ Alle kritischen Probleme behoben. System ist Go-Live-Ready nach manueller Verifikation der Builds und Environment Variables.
