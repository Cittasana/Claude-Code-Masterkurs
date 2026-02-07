# ⚡ Stripe Quick Test - 5 Minuten Verifikation

## 🎯 Schnelltest vor Go-Live

### Test 1: Backend erreichbar (30 Sekunden)

```bash
curl https://backend-production-9d7c.up.railway.app/health
```

**✅ Erwarte:** `{"status":"ok","database":"connected",...}`  
**❌ Falls Fehler:** Backend ist offline → Prüfe Railway

---

### Test 2: CORS funktioniert (1 Minute)

**Im Browser:**
1. Öffne: `https://claude-code-masterkurs.de`
2. Drücke F12 (DevTools) → Console Tab
3. Füge ein:

```javascript
fetch('https://backend-production-9d7c.up.railway.app/health')
  .then(r => r.json())
  .then(d => console.log('✅ CORS OK:', d))
  .catch(e => console.error('❌ CORS Error:', e))
```

**✅ Erwarte:** `✅ CORS OK: {status: "ok"...}`  
**❌ Falls CORS Error:** Setze `CORS_ORIGIN` in Railway!

---

### Test 3: Stripe Webhook (2 Minuten)

1. Öffne: **Stripe Dashboard → Developers → Webhooks**
2. Klicke auf deinen Webhook
3. Klicke **"Send test webhook"**
4. Wähle: `checkout.session.completed`
5. Klicke **Send**

**✅ Erwarte:** Response `200` mit Häkchen ✓  
**❌ Falls Fehler:** Prüfe Railway Logs & `STRIPE_WEBHOOK_SECRET`

---

### Test 4: Registrierung öffnet Stripe (1 Minute)

1. Gehe zu: `https://claude-code-masterkurs.de/register`
2. Wähle einen Plan (z.B. Monatlich)
3. Fülle Formular OHNE zu registrieren
4. Prüfe ob 3 Preiskarten sichtbar sind

**✅ Erwarte:** 3 Preiskarten mit Radio-Buttons  
**❌ Falls nicht sichtbar:** Frontend-Build fehlt oder .env falsch

---

### Test 5: Price IDs existieren (1 Minute)

1. Öffne: **Stripe Dashboard → Products**
2. Stelle sicher: **Live-Modus** (Toggle oben rechts)
3. Suche nach deinen Produkten

**Prüfe diese IDs existieren:**
```
price_1Sy8LFC6AV6eURdbiEHW8rhP (24 EUR/Monat)
price_1Sy8W0C6AV6eURdbHYHwDUeC (229 EUR/Jahr)
price_1Sy8X1C6AV6eURdbrULHm3rv (499 EUR einmalig)
```

**✅ Erwarte:** Alle 3 Produkte vorhanden  
**❌ Falls nicht:** Erstelle sie neu im Live-Modus

---

## 🚀 Wenn alle 5 Tests ✅ sind:

**Du bist bereit für den ersten echten Test mit Kreditkarte!**

**Nächster Schritt:**
1. Registriere einen Test-Account mit echter Kreditkarte
2. Wähle "Monatlich" + Aktionscode `WELCOME2024`
3. Zahle (erst nach 6 Monaten fällig)
4. Prüfe ob Abo in Datenbank landet
5. Kündige sofort (keine Kosten)

---

## ❌ Falls ein Test fehlschlägt:

### CORS Error → Railway Variables prüfen
```bash
# Setze in Railway:
CORS_ORIGIN=https://claude-code-masterkurs.de
```

### Webhook Error → Secret prüfen
```bash
# Stripe Dashboard → Webhooks → Dein Endpoint → Signing secret
# Vergleiche mit Railway Variable: STRIPE_WEBHOOK_SECRET
```

### Backend offline → Railway Status
```bash
# Gehe zu: Railway Dashboard
# Prüfe: Backend Service → Deployments
# Falls "Failed" → Klicke auf Log und lese Fehler
```

### Price IDs fehlen → Live-Modus prüfen
```bash
# Stripe Dashboard oben rechts: Test → Live
# Produkte müssen im Live-Modus existieren!
```

---

**Geschätzte Zeit: 5 Minuten**  
**Bei Problemen:** Siehe `STRIPE_GO_LIVE.md` für Details
