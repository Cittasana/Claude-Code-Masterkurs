# 🚀 Stripe Integration - Quick Start

## ✅ Was wurde implementiert?

Die vollständige Stripe-Integration für Abonnements mit Aktionscodes ist jetzt einsatzbereit:

### Backend (Server)
- ✅ **Prisma Schema** erweitert mit `Subscription` und `PromoCode` Modellen
- ✅ **Stripe SDK** installiert und konfiguriert
- ✅ **API Routes** (`/api/subscription/*`):
  - `POST /create-checkout-session` - Erstellt Stripe Checkout
  - `POST /validate-promo-code` - Validiert Aktionscodes
  - `GET /status` - Gibt Abo-Status zurück
  - `POST /cancel` - Kündigt Abo
  - `POST /webhook` - Empfängt Stripe Events
- ✅ **Webhook Handler** für automatische Status-Updates
- ✅ **Promo-Code Generator Script** (`scripts/create-promo-code.ts`)
- ✅ **Seed-Daten** mit 3 Test-Promo-Codes

### Frontend
- ✅ **RegisterView** angepasst mit Aktionscode-Feld
- ✅ **Promo-Code Validierung** mit Echtzeit-Feedback
- ✅ **SubscriptionSuccessView** für erfolgreiche Zahlungen
- ✅ **API Client** erweitert mit Subscription-Endpoints
- ✅ **Stripe.js** integriert

### Aktionscodes
- ✅ `WELCOME2024` - 6 Monate gratis (100 Verwendungen)
- ✅ `EARLYBIRD` - 12 Monate gratis (50 Verwendungen)
- ✅ `TEST2024` - 6 Monate gratis (unbegrenzt)

## 🎯 User-Flow

1. **Registrierung**: User erstellt Account mit Email/Passwort
2. **Aktionscode (optional)**: User gibt Code ein (z.B. `WELCOME2024`)
3. **Validierung**: Code wird geprüft → ✓ 6 Monate kostenlos angezeigt
4. **Stripe Checkout**: User wird zu Stripe weitergeleitet
5. **Zahlung**: User gibt Zahlungsdaten ein
6. **Trial-Period**: Bei Aktionscode wird Trial (6 Monate) gesetzt
7. **Erfolg**: User wird zurück zu `/subscription/success` geleitet
8. **Zugriff**: User hat vollen Zugriff auf alle Inhalte

## ⚙️ Nächste Schritte

### 1. Stripe Account einrichten (5 Minuten)

```bash
# 1. Gehe zu stripe.com und erstelle einen Test-Account
# 2. Hole deine API Keys von: Developers → API Keys
# 3. Erstelle ein Produkt mit monatlichem Preis
# 4. Kopiere die Price ID
```

### 2. Environment Variables setzen

**Backend** (`server/.env`):
```bash
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
FRONTEND_URL="http://localhost:5173"
```

**Frontend** (`.env`):
```bash
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
VITE_STRIPE_PRICE_ID="price_..."
```

### 3. Server & Frontend starten

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 4. Test durchführen

1. Öffne: `http://localhost:5173/register`
2. Fülle Formular aus
3. Gib Aktionscode ein: `WELCOME2024`
4. Klicke "Account erstellen & Abo abschließen"
5. Verwende Test-Karte: `4242 4242 4242 4242`
6. ✅ Success! Du bist jetzt im Dashboard mit aktivem Abo

## 📊 Promo-Codes verwalten

### Neuen Code erstellen
```bash
cd server
tsx scripts/create-promo-code.ts BLACKFRIDAY --months 6 --max-uses 500 --description "Black Friday Special"
```

### Code deaktivieren
```bash
cd server
npx prisma studio
# Öffne PromoCode Tabelle → setze 'active' auf false
```

### Statistiken anzeigen
```bash
cd server
npx prisma studio
# PromoCode Tabelle → Sortiere nach 'times_used'
```

## 🔧 Webhook einrichten (für Production)

### Lokal testen mit Stripe CLI
```bash
# Installiere Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/subscription/webhook

# Kopiere den Webhook Secret und füge ihn zu .env hinzu:
# STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Production Webhook
1. Gehe zu: Stripe Dashboard → Developers → Webhooks
2. **Add endpoint**: `https://deine-domain.com/api/subscription/webhook`
3. **Select events**:
   - `checkout.session.completed`
   - `customer.subscription.*`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Kopiere Signing Secret → Server Environment Variables

## 📝 Wichtige Dateien

```
server/
├── prisma/
│   ├── schema.prisma            # Subscription & PromoCode Modelle
│   └── seed.ts                  # Mit Test-Promo-Codes
├── src/
│   └── routes/
│       └── subscription.ts      # Alle Subscription-Endpoints
└── scripts/
    └── create-promo-code.ts     # CLI zum Code-Erstellen

src/
├── lib/
│   └── api.ts                   # subscriptionApi hinzugefügt
├── pages/
│   ├── RegisterView.tsx         # Mit Aktionscode-Feld
│   └── SubscriptionSuccessView.tsx
└── App.tsx                      # Route hinzugefügt

STRIPE_SETUP.md                  # Ausführliche Dokumentation
```

## 🐛 Troubleshooting

### Promo-Code wird nicht akzeptiert
```bash
# Prüfe in Prisma Studio:
cd server
npx prisma studio

# Checke PromoCode:
# - active = true?
# - expiresAt = null oder in der Zukunft?
# - timesUsed < maxUses?
```

### Webhook Events kommen nicht an
- Prüfe `STRIPE_WEBHOOK_SECRET` in server/.env
- Prüfe Webhook-Logs im Stripe Dashboard
- Für lokal: Nutze Stripe CLI forward

### Checkout-Session Fehler
- Prüfe `VITE_STRIPE_PRICE_ID` in .env
- Prüfe ob Price in Stripe existiert (Test-Modus aktiv?)
- Prüfe Server-Logs für detaillierte Fehler

## 🎓 Test-Accounts

Die Seed-Daten enthalten bereits 15 Demo-Users:
```
Email: beliebige-email@demo.local
Passwort: demo1234
```

Diese haben KEIN Abo! Erstelle einen neuen Account zum Testen der Stripe-Integration.

## 📚 Weitere Infos

- Vollständige Dokumentation: `STRIPE_SETUP.md`
- Stripe Test-Karten: https://stripe.com/docs/testing
- Stripe Dashboard: https://dashboard.stripe.com/test

---

**Happy Coding! 💳✨**

Bei Fragen schau in `STRIPE_SETUP.md` oder öffne ein Issue.
