# 💳 Stripe Integration - Setup Guide

Diese Anleitung erklärt, wie du die Stripe-Integration für Abonnements mit Aktionscodes einrichtest.

## 📋 Übersicht

Die Implementierung umfasst:
- ✅ **Stripe Checkout** für sichere Zahlungsabwicklung
- ✅ **Subscription Management** mit automatischer Verlängerung
- ✅ **Aktionscodes** für kostenlose Testzeiträume (z.B. 6 Monate gratis)
- ✅ **Webhook-Integration** für automatische Status-Updates
- ✅ **Promo-Code-Validierung** vor dem Checkout

## 🚀 1. Stripe Account einrichten

### 1.1 Account erstellen
1. Gehe zu [stripe.com](https://stripe.com) und erstelle einen Account
2. Aktiviere den **Test-Modus** (oben rechts im Dashboard)

### 1.2 API Keys holen
1. Navigiere zu: **Developers → API Keys**
2. Kopiere den **Publishable Key** (beginnt mit `pk_test_...`)
3. Kopiere den **Secret Key** (beginnt mit `sk_test_...`)

### 1.3 Produkt und Preise erstellen
1. Gehe zu: **Products → Add Product**
2. Erstelle ein Produkt:
   - **Name**: "Claude Code Masterkurs"
   - **Beschreibung**: "Vollständiger Kurs für AI-gestütztes Programmieren"
3. Füge **3 Preismodelle** hinzu:

**Price 1 - Monatlich:**
   - **Pricing Model**: Recurring
   - **Billing Period**: Monthly
   - **Price**: 24,00 EUR
   - **Description**: "Monatliches Abo"

**Price 2 - Jährlich:**
   - **Pricing Model**: Recurring
   - **Billing Period**: Yearly
   - **Price**: 229,00 EUR
   - **Description**: "Jahresabo"

**Price 3 - Lifetime:**
   - **Pricing Model**: One time (NICHT Recurring!)
   - **Price**: 499,00 EUR
   - **Description**: "Lifetime Access"

4. Klicke auf **Save** und kopiere alle **3 Price IDs** (beginnen mit `price_...`)

### 1.4 Webhook einrichten
1. Gehe zu: **Developers → Webhooks → Add endpoint**
2. **Endpoint URL**: `https://deine-domain.com/api/subscription/webhook`
3. **Events auswählen**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Klicke auf **Add endpoint**
5. Kopiere den **Signing Secret** (beginnt mit `whsec_...`)

## ⚙️ 2. Backend konfigurieren

### 2.1 Environment Variables setzen
Erstelle eine `.env` Datei im `server/` Verzeichnis:

```bash
# Stripe
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Frontend URL für Redirects
FRONTEND_URL="http://localhost:5173"
```

### 2.2 Datenbank migrieren
```bash
cd server
npm run db:migrate
```

### 2.3 Test Promo-Code erstellen
```bash
cd server
tsx scripts/create-promo-code.ts WELCOME2024 --months 6 --max-uses 100 --description "Willkommensangebot"
```

## 🎨 3. Frontend konfigurieren

### 3.1 Environment Variables setzen
Erstelle eine `.env` Datei im Root-Verzeichnis:

```bash
# Backend API
VITE_API_URL=http://localhost:3000

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"

# Die 3 Price IDs von Stripe
VITE_STRIPE_PRICE_ID_MONTHLY="price_1Sy8LFC6AV6eURdbiEHW8rhP"
VITE_STRIPE_PRICE_ID_YEARLY="price_1Sy8W0C6AV6eURdbHYHwDUeC"
VITE_STRIPE_PRICE_ID_LIFETIME="price_1Sy8X1C6AV6eURdbrULHm3rv"
```

### 3.2 Abhängigkeiten installieren
```bash
npm install
cd server && npm install
```

## 🧪 4. Testen

### 4.1 Server starten
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 4.2 Test-Flow durchlaufen

1. **Registrierung mit Aktionscode**:
   - Gehe zu `/register`
   - Fülle Formular aus
   - Gib Aktionscode ein: `WELCOME2024`
   - Klicke auf "Account erstellen & Abo abschließen"

2. **Preisauswahl**:
   - Wähle eines der 3 Modelle: Monatlich (24 EUR), Jährlich (229 EUR) oder Lifetime (499 EUR)
   
3. **Stripe Test-Checkout**:
   - Du wirst zu Stripe Checkout weitergeleitet
   - Verwende Test-Kreditkarte: `4242 4242 4242 4242`
   - CVC: `123`, Datum: beliebig in der Zukunft
   - Klicke auf "Subscribe" (bei Abo) oder "Pay" (bei Lifetime)

4. **Success-Seite**:
   - Du wirst zurück zur App weitergeleitet: `/subscription/success`
   - Bei Abo: Aktiv mit 6 Monaten Trial (dank Aktionscode)
   - Bei Lifetime: Lebenslanger Zugriff aktiviert

### 4.3 Webhook testen (lokal)
Für lokale Entwicklung mit Webhooks:

```bash
# Stripe CLI installieren: https://stripe.com/docs/stripe-cli
stripe login

# Webhooks zu localhost forwarden
stripe listen --forward-to localhost:3000/api/subscription/webhook

# Der CLI gibt dir einen Signing Secret - füge ihn zur .env hinzu
```

## 📊 5. Promo-Codes verwalten

### Promo-Code erstellen
```bash
cd server
tsx scripts/create-promo-code.ts <CODE> [optionen]

# Beispiele:
tsx scripts/create-promo-code.ts EARLYBIRD --months 12 --max-uses 50
tsx scripts/create-promo-code.ts SUMMER2024 --months 6 --description "Sommeraktion" --expires 2024-09-30
```

### Promo-Code deaktivieren
```sql
-- In Prisma Studio oder direkt in der DB:
UPDATE promo_codes SET active = false WHERE code = 'CODE123';
```

### Promo-Code Statistiken
```sql
-- Verwendete Codes anzeigen
SELECT code, times_used, max_uses, description 
FROM promo_codes 
WHERE active = true 
ORDER BY times_used DESC;
```

## 🔐 6. Produktions-Setup

### 6.1 Live-Modus aktivieren
1. Schalte im Stripe Dashboard in den **Live-Modus** (oben rechts)
2. Erstelle neue API Keys für Production
3. Erstelle neue Webhooks für Production-URL
4. Setze die Production Environment Variables

### 6.2 Environment Variables (Production)
```bash
# Backend (Railway/Server)
STRIPE_SECRET_KEY="sk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
FRONTEND_URL="https://deine-domain.com"

# Frontend (Vercel/Netlify)
VITE_STRIPE_PUBLISHABLE_KEY="pk_live_xxx"
VITE_STRIPE_PRICE_ID="price_live_xxx"
```

### 6.3 Sicherheits-Checkliste
- [ ] Test-Keys durch Live-Keys ersetzt
- [ ] Webhook-Signatur wird verifiziert
- [ ] HTTPS auf allen Endpoints aktiv
- [ ] Rate-Limiting auf Checkout-Endpoints aktiv
- [ ] Promo-Codes haben sinnvolle Limits (max_uses)
- [ ] Error-Tracking (Sentry) eingerichtet

## 🐛 7. Troubleshooting

### Webhook Events kommen nicht an
- Prüfe die Webhook-URL im Stripe Dashboard
- Prüfe die Webhook-Logs: **Developers → Webhooks → [Dein Endpoint] → Logs**
- Prüfe `STRIPE_WEBHOOK_SECRET` in der .env

### Checkout Session wird nicht erstellt
- Prüfe `STRIPE_SECRET_KEY` und `VITE_STRIPE_PRICE_ID`
- Prüfe Server-Logs für detaillierte Fehlermeldungen
- Prüfe ob User authentifiziert ist (JWT Token)

### Promo-Code wird nicht akzeptiert
- Prüfe ob Code aktiv ist: `active = true`
- Prüfe ob Code nicht abgelaufen: `expires_at > NOW()`
- Prüfe ob max_uses nicht erreicht: `times_used < max_uses`

### Subscription-Status nicht aktualisiert
- Prüfe ob Webhooks korrekt konfiguriert sind
- Prüfe ob `metadata.userId` in Stripe Subscription gesetzt ist
- Manuell Status prüfen: `GET /api/subscription/status`

## 📚 Weitere Ressourcen

- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Docs](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Billing Best Practices](https://stripe.com/docs/billing/subscriptions/overview)

## 🎯 Features für die Zukunft

Mögliche Erweiterungen:
- 📊 **Subscription-Verwaltung im User-Profil** (Kündigen, Plan ändern)
- 📈 **Analytics-Dashboard** für Conversion-Tracking
- 💰 **Mehrere Preispläne** (Basic, Pro, Enterprise)
- 🎁 **Referral-System** mit Promo-Codes
- 📧 **E-Mail-Benachrichtigungen** bei Zahlungsfehlern
- 🔄 **Upgrade/Downgrade-Flow**

---

**Viel Erfolg mit deiner Stripe-Integration! 🚀**

Bei Fragen oder Problemen öffne ein Issue auf GitHub oder frage im Forum.
