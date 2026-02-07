# 🚀 Stripe Go-Live - Finale Einrichtung

## ✅ Was bereits konfiguriert ist

### Frontend (claude-code-masterkurs.de)
- ✅ Backend URL: `https://backend-production-9d7c.up.railway.app`
- ✅ Stripe Live Publishable Key: `pk_live_51SKCfU...`
- ✅ Price ID Monthly: `price_1Sy8LFC6AV6eURdbiEHW8rhP`
- ✅ Price ID Yearly: `price_1Sy8W0C6AV6eURdbHYHwDUeC`
- ✅ Price ID Lifetime: `price_1Sy8X1C6AV6eURdbrULHm3rv`

### Backend (Railway)
Laut deiner Angabe bereits hinterlegt:
- ✅ `FRONTEND_URL` = `https://claude-code-masterkurs.de`
- ✅ `STRIPE_SECRET_KEY` = `sk_live_...`
- ✅ `STRIPE_WEBHOOK_SECRET` = `whsec_...`

---

## 🔧 Backend Environment Variables prüfen

Stelle sicher, dass in **Railway → Backend Service → Variables** folgendes gesetzt ist:

```bash
# Stripe (LIVE Keys!)
STRIPE_SECRET_KEY=sk_live_51SKCfUC6AV6eURdb...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL
FRONTEND_URL=https://claude-code-masterkurs.de

# CORS (wichtig für API-Zugriff!)
CORS_ORIGIN=https://claude-code-masterkurs.de

# Datenbank (automatisch von Railway)
DATABASE_URL=postgresql://...

# JWT Secret
JWT_SECRET=dein_secret_hier

# Optional: Email & Monitoring
# RESEND_API_KEY=re_...
# SENTRY_DSN=https://...
```

### ⚠️ Wichtig: CORS_ORIGIN

Wenn `CORS_ORIGIN` **nicht** gesetzt ist, füge es hinzu:
```
CORS_ORIGIN=https://claude-code-masterkurs.de
```

Ohne CORS wird das Frontend keine API-Anfragen machen können!

---

## 🔍 Verifikations-Checkliste

### 1. Backend Health Check
```bash
curl https://backend-production-9d7c.up.railway.app/health
```

**Erwartete Antwort:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "...",
  "uptime": 123
}
```

### 2. Stripe Webhook prüfen

**In Stripe Dashboard:**
1. Gehe zu: **Developers → Webhooks**
2. Finde deinen Webhook für: `https://backend-production-9d7c.up.railway.app/api/subscription/webhook`
3. Prüfe **Signing secret** und vergleiche mit Railway Variable `STRIPE_WEBHOOK_SECRET`
4. **Teste den Webhook:**
   - Klicke auf deinen Webhook
   - Klicke "Send test webhook"
   - Wähle Event: `checkout.session.completed`
   - Prüfe ob Response `200 OK` ist

### 3. Price IDs verifizieren

**In Stripe Dashboard:**
1. Gehe zu: **Products**
2. Prüfe ob diese IDs im **LIVE-Modus** existieren:
   ```
   price_1Sy8LFC6AV6eURdbiEHW8rhP (Monthly - 24 EUR)
   price_1Sy8W0C6AV6eURdbHYHwDUeC (Yearly - 229 EUR)
   price_1Sy8X1C6AV6eURdbrULHm3rv (Lifetime - 499 EUR)
   ```

### 4. CORS testen

**Im Browser:**
1. Öffne: `https://claude-code-masterkurs.de`
2. Öffne DevTools (F12) → Console
3. Führe aus:
```javascript
fetch('https://backend-production-9d7c.up.railway.app/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Erwartetes Ergebnis:** JSON mit `status: "ok"`

**Falls CORS-Fehler:**
```
Access to fetch has been blocked by CORS policy
```
→ Setze `CORS_ORIGIN` in Railway!

---

## 🧪 Test-Durchlauf (mit echter Kreditkarte!)

**⚠️ ACHTUNG:** Du bist im LIVE-Modus. Echte Zahlungen werden verarbeitet!

### Test-Scenario 1: Monatliches Abo mit Promo-Code

1. **Registrierung:**
   - Gehe zu: `https://claude-code-masterkurs.de/register`
   - Wähle "Monatlich" (24 EUR)
   - Gib Aktionscode ein: `WELCOME2024`
   - Validierung sollte anzeigen: "✓ 6 Monate kostenlos"

2. **Account erstellen:**
   - Fülle Formular aus (verwende Test-Email)
   - Klicke "Account erstellen & Abo abschließen"

3. **Stripe Checkout:**
   - Du wirst zu Stripe weitergeleitet
   - **Verwende echte Kreditkarte!**
   - Zahle 24 EUR (wird erst nach Trial fällig)

4. **Success-Seite:**
   - Du wirst zurück zu `/subscription/success` geleitet
   - Prüfe Anzeige: "🎉 Willkommen im Kurs!"

5. **Sofort kündigen:**
   - Gehe zu: Stripe Dashboard → Customers
   - Finde deine Test-Zahlung
   - Klicke auf Subscription → "Cancel subscription"
   - **Wichtig:** Keine Kosten, da Trial noch läuft!

### Test-Scenario 2: Jährliches Abo

Gleicher Ablauf, aber:
- Wähle "Jährlich" (229 EUR)
- Aktionscode: `EARLYBIRD` (12 Monate gratis)
- Nach Test sofort kündigen!

### Test-Scenario 3: Lifetime (Vorsicht!)

**⚠️ NUR wenn du bereit bist 499 EUR zu zahlen!**
- Wähle "Lifetime" (499 EUR)
- Keine Aktionscodes verfügbar
- Einmalige Zahlung

**Alternative:** Erstelle einen Test-Lifetime-Preis für 1 EUR zum Testen!

---

## 🔄 Webhook-Events überwachen

**Während des Tests:**

1. Öffne: **Stripe Dashboard → Developers → Events**
2. Du solltest sehen:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `invoice.paid`

3. Klicke auf Event → "View logs"
4. Prüfe ob Webhook erfolgreich war:
   ```
   Response: 200 OK
   ```

**Falls Fehler (4xx/5xx):**
- Prüfe Railway Logs: Railway Dashboard → Backend → Deployments → View logs
- Suche nach "Webhook" oder "subscription"
- Behebe Fehler und teste erneut

---

## 📊 Datenbank prüfen

**Nach erfolgreicher Zahlung:**

1. Gehe zu Railway: Backend Service → Data → PostgreSQL
2. Öffne eine Query:
```sql
-- Subscription prüfen
SELECT 
  u.email,
  s.status,
  s.is_lifetime,
  s.current_period_start,
  s.current_period_end,
  pc.code as promo_code
FROM subscriptions s
JOIN users u ON u.id = s.user_id
LEFT JOIN promo_codes pc ON pc.id = s.promo_code_id
ORDER BY s.created_at DESC
LIMIT 5;
```

**Erwartetes Ergebnis:**
- Status: `active` oder `trialing`
- Promo-Code: `WELCOME2024` oder `EARLYBIRD` (falls verwendet)
- Period-Daten gefüllt

---

## 🎯 Promo-Codes Management

### Bestehende Codes prüfen

```sql
SELECT 
  code,
  description,
  duration_months,
  times_used,
  max_uses,
  active,
  expires_at
FROM promo_codes
WHERE active = true
ORDER BY times_used DESC;
```

### Neuen Promo-Code erstellen

**Via CLI (auf deinem lokalen Rechner):**

```bash
cd server
tsx scripts/create-promo-code.ts BLACKFRIDAY \
  --months 6 \
  --max-uses 100 \
  --description "Black Friday Special"
```

**Oder direkt in der Datenbank:**
```sql
INSERT INTO promo_codes (
  id, code, description, duration_months, 
  max_uses, active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'BLACKFRIDAY',
  'Black Friday Special',
  6,
  100,
  true,
  NOW(),
  NOW()
);
```

---

## 💰 Auszahlungen einrichten

**Wichtig:** Stripe zahlt nicht automatisch aus!

1. Gehe zu: **Stripe Dashboard → Balance**
2. Klicke "Add bank account"
3. Füge deine Bank-Details hinzu:
   - IBAN
   - Name des Kontoinhabers
   - BIC (optional für Deutschland)
4. Verifizierung dauert 1-2 Werktage
5. Stelle Auszahlungs-Rhythmus ein: **Settings → Payouts**
   - Standard: Täglich (Rolling)
   - Alternativ: Wöchentlich, Monatlich

**Gebühren:**
- Stripe behält: **2,9% + 0,25 EUR** pro Transaktion
- Automatische Auszahlung nach 7 Tagen (Standard)

---

## 📧 E-Mail-Benachrichtigungen

**In Stripe aktivieren:**

1. Gehe zu: **Settings → Email notifications**
2. Aktiviere:
   - ✅ Successful payments
   - ✅ Failed payments
   - ✅ Refunds
   - ✅ Disputed payments
   - ✅ Subscription cancellations
   - ✅ Weekly summary

---

## 🔐 Sicherheits-Checkliste (Final)

### Frontend
- [x] HTTPS aktiv (claude-code-masterkurs.de)
- [x] Publishable Key korrekt
- [x] Price IDs korrekt
- [x] API URL zeigt auf Railway

### Backend
- [ ] CORS_ORIGIN gesetzt auf `https://claude-code-masterkurs.de`
- [ ] STRIPE_SECRET_KEY gesetzt (Live Key)
- [ ] STRIPE_WEBHOOK_SECRET gesetzt
- [ ] FRONTEND_URL gesetzt auf `https://claude-code-masterkurs.de`
- [ ] DATABASE_URL verbunden
- [ ] JWT_SECRET gesetzt

### Stripe
- [ ] Im LIVE-Modus (nicht Test!)
- [ ] Produkte existieren (Monthly, Yearly, Lifetime)
- [ ] Webhook aktiv und funktioniert
- [ ] Bank-Konto für Auszahlungen hinzugefügt
- [ ] E-Mail-Benachrichtigungen aktiv

### Rechtliches
- [ ] Impressum online
- [ ] Datenschutzerklärung (mit Stripe-Hinweis)
- [ ] AGB/Nutzungsbedingungen
- [ ] Widerrufsbelehrung (14 Tage)
- [ ] Cookie-Hinweis

---

## 🚨 Troubleshooting

### Problem: CORS-Fehler im Browser

**Symptom:**
```
Access to fetch has been blocked by CORS policy
```

**Lösung:**
1. Railway → Backend → Variables
2. Füge hinzu: `CORS_ORIGIN=https://claude-code-masterkurs.de`
3. Backend neu deployen (automatisch)
4. 2 Minuten warten
5. Browser-Cache leeren (Ctrl+Shift+R)

### Problem: Webhook kommt nicht an

**Symptom:**
- Zahlung erfolgreich in Stripe
- Aber kein Abo in Datenbank

**Lösung:**
1. Stripe Dashboard → Webhooks → Dein Endpoint
2. Prüfe "Recent deliveries"
3. Falls Fehler → Railway Logs checken
4. Prüfe `STRIPE_WEBHOOK_SECRET` in Railway
5. Teste mit "Send test webhook"

### Problem: Price ID nicht gefunden

**Symptom:**
```
No such price: 'price_...'
```

**Lösung:**
1. Stripe Dashboard → Products
2. Toggle: **Test → Live** (oben rechts)
3. Prüfe ob Produkte im Live-Modus existieren
4. Falls nein: Erstelle Produkte neu im Live-Modus
5. Kopiere neue Price IDs
6. Aktualisiere Frontend `.env`

### Problem: User kann nicht zahlen

**Checkliste:**
1. HTTPS aktiv? (Stripe erfordert HTTPS)
2. Publishable Key korrekt? (Live Key, nicht Test)
3. Price IDs existieren im Live-Modus?
4. Browser Console Fehler?
5. Stripe Dashboard → Payments für Details

---

## 📈 Nach dem Go-Live

### Monitoring

**Täglich prüfen:**
- Stripe Dashboard → Home (Überblick)
- Railway → Backend → Logs (Fehler?)
- Neue Subscriptions in Datenbank

**Wöchentlich:**
- Promo-Code-Nutzung
- Conversion-Rate (Registrierungen → Zahlungen)
- Failed Payments
- Customer Support Anfragen

### Analytics einrichten

**Optional aber empfohlen:**

1. **Plausible Analytics** (DSGVO-konform):
   ```bash
   # Frontend .env
   VITE_PLAUSIBLE_DOMAIN=claude-code-masterkurs.de
   ```

2. **Sentry Error Tracking**:
   ```bash
   # Backend Railway Variables
   SENTRY_DSN=https://...@sentry.io/...
   ```

3. **Stripe Reports**:
   - Dashboard → Reports → Balance
   - Wöchentliche Zusammenfassungen
   - MRR (Monthly Recurring Revenue) tracken

---

## ✅ Finale Go-Live Checkliste

**Vor dem ersten Kunden:**

1. [ ] Alle Tests durchgeführt (mit echter Karte)
2. [ ] Test-Subscription gekündigt (keine Kosten)
3. [ ] CORS funktioniert (Frontend kann API erreichen)
4. [ ] Webhook funktioniert (Zahlung → Datenbank)
5. [ ] Promo-Codes funktionieren (`WELCOME2024`, `EARLYBIRD`)
6. [ ] Bank-Konto verifiziert
7. [ ] Impressum/Datenschutz/AGB online
8. [ ] Error-Tracking aktiv (Logs überwachen)
9. [ ] Backup-Strategie für Datenbank
10. [ ] Support-E-Mail eingerichtet

---

## 🎉 Du bist bereit!

**Status: 🟢 Live & Production-Ready!**

**Erste Schritte nach Go-Live:**
1. Poste auf Social Media / Newsletter
2. Überwache Stripe Dashboard für erste Zahlungen
3. Prüfe Railway Logs auf Fehler
4. Beantworte erste Kunden-Anfragen schnell
5. Tracke Conversion-Rate
6. Sammle Feedback

**Bei Problemen:**
- Stripe Support: support@stripe.com (sehr gut & schnell!)
- Railway Discord: discord.gg/railway
- Eigene Logs: Railway → Backend → Deployments

---

**Viel Erfolg mit deinem Launch! 🚀💰**

Bei Fragen oder Problemen: Prüfe die Logs und Stripe Dashboard zuerst!
