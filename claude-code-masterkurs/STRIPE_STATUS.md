# ✅ Stripe Integration - Status & Nächste Schritte

## 🎉 Was fertig ist

### ✅ Code-Implementierung (100%)
- [x] Prisma Schema mit Subscription & PromoCode Modellen
- [x] Backend API-Endpoints für alle Subscription-Funktionen
- [x] Webhook-Handler für Stripe Events
- [x] Frontend mit 3 Preiskarten (Monthly, Yearly, Lifetime)
- [x] Promo-Code-Validierung in Echtzeit
- [x] Success-Seite mit Lifetime-Erkennung
- [x] Datenbank-Migrationen durchgeführt
- [x] 3 Test-Promo-Codes in Datenbank geseeded

### ✅ Frontend Konfiguration (100%)
- [x] `.env` Datei aktualisiert mit:
  - Backend URL: `https://backend-production-9d7c.up.railway.app`
  - Stripe Live Publishable Key: `pk_live_51SKCfU...`
  - Price ID Monthly: `price_1Sy8LFC6AV6eURdbiEHW8rhP`
  - Price ID Yearly: `price_1Sy8W0C6AV6eURdbHYHwDUeC`
  - Price ID Lifetime: `price_1Sy8X1C6AV6eURdbrULHm3rv`

### ✅ Backend Konfiguration (von dir erledigt)
- [x] Railway Variables gesetzt:
  - `STRIPE_SECRET_KEY` (Live Key)
  - `STRIPE_WEBHOOK_SECRET`
  - `FRONTEND_URL` = `https://claude-code-masterkurs.de`

---

## ⚠️ Kritische Prüfung nötig

### 1. CORS_ORIGIN prüfen (WICHTIG!)

**Problem:** Wenn `CORS_ORIGIN` nicht gesetzt ist, kann Frontend nicht mit Backend kommunizieren!

**Lösung:**
1. Gehe zu: **Railway → Backend Service → Variables**
2. Prüfe ob Variable existiert: `CORS_ORIGIN`
3. Falls NICHT vorhanden, füge hinzu:
   ```
   CORS_ORIGIN = https://claude-code-masterkurs.de
   ```
4. Backend deployt automatisch neu (dauert 1-2 Minuten)

**Test:**
```bash
# Im Browser Console (F12):
fetch('https://backend-production-9d7c.up.railway.app/health')
  .then(r => r.json())
  .then(console.log)
```
✅ Sollte funktionieren ohne CORS-Fehler

---

### 2. Webhook-Konfiguration verifizieren

**Prüfen in Stripe Dashboard:**
1. Gehe zu: **Developers → Webhooks**
2. Finde Webhook mit URL: `https://backend-production-9d7c.up.railway.app/api/subscription/webhook`
3. Prüfe **Signing Secret** und vergleiche mit Railway Variable
4. **Test senden:**
   - Klicke auf Webhook
   - "Send test webhook" → `checkout.session.completed`
   - Prüfe Response: `200 OK`

**Falls Webhook nicht existiert:**
- Erstelle neuen Webhook
- URL: `https://backend-production-9d7c.up.railway.app/api/subscription/webhook`
- Events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`
  - `invoice.payment_failed`
- Kopiere Signing Secret → Railway `STRIPE_WEBHOOK_SECRET`

---

### 3. Price IDs im Live-Modus prüfen

**In Stripe Dashboard:**
1. Stelle sicher: **Live-Modus aktiv** (Toggle oben rechts)
2. Gehe zu: **Products**
3. Prüfe ob diese IDs existieren:
   ```
   price_1Sy8LFC6AV6eURdbiEHW8rhP → 24 EUR/Monat
   price_1Sy8W0C6AV6eURdbHYHwDUeC → 229 EUR/Jahr
   price_1Sy8X1C6AV6eURdbrULHm3rv → 499 EUR einmalig
   ```

**Falls im Test-Modus erstellt:**
- Produkte müssen im **Live-Modus** neu erstellt werden
- Kopiere neue Price IDs
- Aktualisiere Frontend `.env` und deploye neu

---

## 🧪 Empfohlene Tests (vor erstem Kunden)

### Quick Test (5 Minuten)
Siehe: `STRIPE_QUICK_TEST.md`

### Vollständiger Test (15 Minuten)
1. **Registrierung mit Promo-Code:**
   - Gehe zu: `https://claude-code-masterkurs.de/register`
   - Wähle "Monatlich"
   - Gib Code ein: `WELCOME2024`
   - Sollte anzeigen: "✓ 6 Monate kostenlos"

2. **Mit echter Karte testen:**
   - Fülle Formular aus
   - Klicke "Account erstellen & Abo abschließen"
   - Zahle mit echter Kreditkarte (wird erst nach 6 Monaten fällig)
   - Prüfe Weiterleitung zu `/subscription/success`

3. **Datenbank prüfen:**
   ```sql
   SELECT u.email, s.status, s.is_lifetime, pc.code
   FROM subscriptions s
   JOIN users u ON u.id = s.user_id
   LEFT JOIN promo_codes pc ON pc.id = s.promo_code_id
   ORDER BY s.created_at DESC
   LIMIT 1;
   ```
   ✅ Status sollte `active` oder `trialing` sein

4. **Sofort kündigen:**
   - Stripe Dashboard → Customers
   - Finde dein Test-Abo
   - "Cancel subscription"
   - Keine Kosten, da noch im Trial!

---

## 📋 Finale Checkliste vor Go-Live

### Backend (Railway)
- [ ] `CORS_ORIGIN` gesetzt auf `https://claude-code-masterkurs.de`
- [ ] `STRIPE_SECRET_KEY` gesetzt (Live Key `sk_live_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` gesetzt (`whsec_...`)
- [ ] `FRONTEND_URL` gesetzt auf `https://claude-code-masterkurs.de`
- [ ] Health Check funktioniert: `/health` → `200 OK`

### Frontend
- [x] Publishable Key korrekt (`pk_live_...`)
- [x] Price IDs korrekt
- [x] API URL zeigt auf Railway
- [x] Build deployt auf Vercel/Domain

### Stripe
- [ ] Im **Live-Modus** (nicht Test!)
- [ ] Produkte existieren (Monthly, Yearly, Lifetime)
- [ ] Webhook eingerichtet und funktioniert
- [ ] Bank-Konto für Auszahlungen hinzugefügt
- [ ] E-Mail-Benachrichtigungen aktiviert

### Tests
- [ ] CORS funktioniert (Browser-Test)
- [ ] Webhook empfängt Events (Test-Event senden)
- [ ] Registrierung öffnet Stripe Checkout
- [ ] Zahlung landet in Datenbank
- [ ] Promo-Codes funktionieren

### Rechtliches
- [ ] Impressum online
- [ ] Datenschutzerklärung mit Stripe-Hinweis
- [ ] AGB/Nutzungsbedingungen
- [ ] Widerrufsbelehrung (14 Tage)
- [ ] Cookie-Hinweis

---

## 🎯 Nächste Schritte (in dieser Reihenfolge)

### 1. CORS prüfen & setzen (5 Minuten)
```bash
Railway → Backend → Variables → CORS_ORIGIN hinzufügen
```

### 2. Quick Test durchführen (5 Minuten)
Siehe: `STRIPE_QUICK_TEST.md`

### 3. Webhook testen (2 Minuten)
```bash
Stripe Dashboard → Webhooks → Send test webhook
```

### 4. Mit echter Karte testen (10 Minuten)
```bash
Registrierung → Zahlung → Datenbank prüfen → Kündigen
```

### 5. Bank-Konto hinzufügen (5 Minuten)
```bash
Stripe Dashboard → Balance → Add bank account
```

### 6. Go Live! 🚀
```bash
Posten, Teilen, Überwachen
```

---

## 📚 Dokumentation

Erstellt für dich:
- ✅ `STRIPE_GO_LIVE.md` - Vollständige Anleitung
- ✅ `STRIPE_QUICK_TEST.md` - 5-Minuten-Verifikation
- ✅ `STRIPE_3_PLANS.md` - Technische Details
- ✅ `STRIPE_SETUP.md` - Setup-Anleitung

---

## 💡 Hilfreiche Commands

### Promo-Code erstellen
```bash
cd server
tsx scripts/create-promo-code.ts NEWYEAR2025 --months 6 --max-uses 200
```

### Subscriptions anzeigen
```sql
SELECT 
  u.email,
  s.status,
  s.is_lifetime,
  s.created_at,
  pc.code as promo
FROM subscriptions s
JOIN users u ON u.id = s.user_id
LEFT JOIN promo_codes pc ON pc.id = s.promo_code_id
ORDER BY s.created_at DESC;
```

### Webhook-Events in Railway Logs
```bash
Railway → Backend → Deployments → View logs
# Suche nach: "Webhook" oder "subscription"
```

---

## 🚨 Support

**Bei Problemen:**
1. **CORS Error:** Setze `CORS_ORIGIN` in Railway
2. **Webhook Error:** Prüfe `STRIPE_WEBHOOK_SECRET` und Railway Logs
3. **Zahlung kommt nicht an:** Stripe Dashboard → Events checken
4. **Price ID nicht gefunden:** Prüfe ob im Live-Modus erstellt

**Externe Hilfe:**
- Stripe Support: support@stripe.com (sehr gut!)
- Railway Discord: discord.gg/railway
- Dokumentation: `STRIPE_GO_LIVE.md`

---

**Status: 🟡 Bereit für finale Tests, dann Go-Live!**

**Geschätzte Zeit bis Go-Live: 20-30 Minuten**
- 5 Min: CORS prüfen
- 5 Min: Quick Tests
- 10 Min: Echter Test mit Karte
- 5 Min: Bank-Konto
- 5 Min: Finale Checks

**Du bist fast da! 🚀**
