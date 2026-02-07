# 💳 Stripe 3-Preismodell Integration

## ✅ Was wurde implementiert?

Die Anwendung unterstützt jetzt **3 Preismodelle**:

1. **Monatlich** - 24 EUR/Monat (wiederkehrend)
2. **Jährlich** - 229 EUR/Jahr (wiederkehrend, spare 20%)
3. **Lifetime** - 499 EUR einmalig (lebenslanger Zugriff)

---

## 📋 Deine Stripe Price IDs

```
Monthly:  price_1Sy8LFC6AV6eURdbiEHW8rhP
Yearly:   price_1Sy8W0C6AV6eURdbHYHwDUeC
Lifetime: price_1Sy8X1C6AV6eURdbrULHm3rv
```

Diese sind bereits in der `.env.example` hinterlegt!

---

## 🚀 Setup in 3 Schritten

### Schritt 1: Environment Variables setzen

**Frontend** (`.env` im Root):
```bash
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"

# Deine Price IDs:
VITE_STRIPE_PRICE_ID_MONTHLY="price_1Sy8LFC6AV6eURdbiEHW8rhP"
VITE_STRIPE_PRICE_ID_YEARLY="price_1Sy8W0C6AV6eURdbHYHwDUeC"
VITE_STRIPE_PRICE_ID_LIFETIME="price_1Sy8X1C6AV6eURdbrULHm3rv"
```

**Backend** (`server/.env`):
```bash
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
FRONTEND_URL="http://localhost:5173"
```

### Schritt 2: Datenbank migrieren

```bash
cd server
npm run db:migrate
```

Migration `add_lifetime_support` wurde bereits erstellt! ✅

### Schritt 3: Server starten

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

---

## 🎨 User Experience

### Registrierungsflow:

1. **User öffnet `/register`**
   - Sieht 3 Preiskarten nebeneinander:
     - Monatlich (24 EUR/Monat)
     - Jährlich (229 EUR/Jahr) - Badge: "Spare 20%"
     - Lifetime (499 EUR einmalig) - Badge: "Best Value"

2. **User wählt Plan aus**
   - Klickt auf eine Karte → Radio-Button wird angezeigt
   - Füllt Registrierungsformular aus
   - Optional: Aktionscode eingeben (nur für Abos, nicht Lifetime)

3. **Account erstellen**
   - Klick auf "Account erstellen & Abo abschließen"
   - Backend erstellt User
   - Weiterleitung zu Stripe Checkout mit gewählter Price ID

4. **Stripe Checkout**
   - Bei Abo: Subscription Checkout
   - Bei Lifetime: One-time Payment Checkout
   - Test-Karte: `4242 4242 4242 4242`

5. **Erfolg**
   - Weiterleitung zu `/subscription/success`
   - Unterschiedliche Anzeige für Abo vs. Lifetime
   - Lifetime zeigt ⭐ Sparkles Icon

---

## 🔧 Technische Details

### Datenbank-Schema

**Neue Felder in `Subscription`:**
```prisma
isLifetime           Boolean   @default(false)
lifetimePurchasedAt  DateTime?
```

### Backend-Logik

**Webhook-Handler erweitert:**
- Prüft `session.mode`:
  - `payment` = Lifetime (einmalig)
  - `subscription` = Abo (wiederkehrend)
- Setzt `isLifetime = true` und `status = 'lifetime'` für Lifetime-Käufe
- Promo-Codes funktionieren nur bei Abos, nicht bei Lifetime

**Neue API-Endpoints:**
- `GET /api/subscription/has-access` - Prüft Zugriff (Abo ODER Lifetime)
- Status-Endpoint gibt auch `isLifetime` und `lifetimePurchasedAt` zurück

### Frontend-Änderungen

**RegisterView:**
- 3 Preiskarten mit Radio-Button-Auswahl
- Dynamischer Text je nach gewähltem Plan
- Promo-Code-Hinweis nur bei Abos

**SubscriptionSuccessView:**
- Unterschiedliche Anzeige für Lifetime vs. Abo
- Sparkles Icon für Lifetime
- Spezielle Badge "Lifetime Member"

---

## 🧪 Testen

### Test-Scenario 1: Monatliches Abo
1. Gehe zu `/register`
2. Wähle "Monatlich" (24 EUR)
3. Gib Aktionscode ein: `WELCOME2024`
4. Registriere dich
5. Zahle mit `4242 4242 4242 4242`
6. ✅ Ergebnis: 6 Monate Trial, dann 24 EUR/Monat

### Test-Scenario 2: Jährliches Abo
1. Gehe zu `/register`
2. Wähle "Jährlich" (229 EUR)
3. Gib Aktionscode ein: `EARLYBIRD`
4. Registriere dich
5. Zahle mit `4242 4242 4242 4242`
6. ✅ Ergebnis: 12 Monate Trial, dann 229 EUR/Jahr

### Test-Scenario 3: Lifetime
1. Gehe zu `/register`
2. Wähle "Lifetime" (499 EUR)
3. Registriere dich (kein Aktionscode möglich)
4. Zahle mit `4242 4242 4242 4242`
5. ✅ Ergebnis: Lebenslanger Zugriff, einmalige Zahlung

---

## 📊 Datenbank-Abfragen

### Alle Lifetime-Käufer anzeigen:
```sql
SELECT u.email, s.lifetime_purchased_at 
FROM subscriptions s
JOIN users u ON u.id = s.user_id
WHERE s.is_lifetime = true
ORDER BY s.lifetime_purchased_at DESC;
```

### Alle aktiven Abonnenten:
```sql
SELECT u.email, s.status, s.current_period_end
FROM subscriptions s
JOIN users u ON u.id = s.user_id
WHERE s.status = 'active' AND s.is_lifetime = false
ORDER BY s.created_at DESC;
```

### Lifetime vs. Abo Statistik:
```sql
SELECT 
  s.is_lifetime,
  COUNT(*) as count,
  CASE 
    WHEN s.is_lifetime THEN 'Lifetime'
    ELSE s.status
  END as type
FROM subscriptions s
GROUP BY s.is_lifetime, s.status
ORDER BY count DESC;
```

---

## 🎯 Zugriffskontrolle

**User hat Zugriff wenn:**
```typescript
subscription.isLifetime === true
OR
subscription.status === 'active'
OR
subscription.status === 'trialing'
```

**Im Backend nutzen:**
```typescript
const access = await subscriptionApi.hasAccess();
if (!access.hasAccess) {
  // Kein Zugriff
}
```

---

## 💡 Best Practices

### Promo-Codes
- ❌ **Nicht** für Lifetime verfügbar (ergibt keinen Sinn)
- ✅ Nur für monatliche und jährliche Abos
- ✅ Setzen Trial-Period statt Rabatt

### Lifetime-Käufer
- Werden **nicht** in Stripe Subscriptions angezeigt
- Nur in Stripe Payments (einmalige Zahlungen)
- Status in DB: `status = 'lifetime'`, `isLifetime = true`

### Migration von Abo zu Lifetime
```typescript
// Wenn User von Abo auf Lifetime upgraden möchte:
// 1. Stripe Subscription kündigen
// 2. Lifetime-Payment durchführen
// 3. isLifetime = true setzen
// 4. Subscription-ID kann bleiben (für Historik)
```

---

## 🐛 Troubleshooting

### Lifetime wird nicht erkannt
```bash
# Prüfe in DB:
cd server
npx prisma studio

# Checke subscription Tabelle:
# - is_lifetime = true?
# - status = 'lifetime'?
# - lifetime_purchased_at gesetzt?
```

### Promo-Code bei Lifetime angezeigt
- Das ist ein Bug! Promo-Codes sollten bei Lifetime ausgeblendet sein
- Check: `selectedPlan !== 'lifetime'` in RegisterView

### Webhook kommt nicht an für Lifetime
- Lifetime nutzt `checkout.session.completed` Event
- NICHT `customer.subscription.created`
- Check Webhook-Logs in Stripe Dashboard

---

## 📚 Code-Referenz

**Wichtige Dateien:**
```
Frontend:
├── src/pages/RegisterView.tsx           (Preisauswahl)
├── src/pages/SubscriptionSuccessView.tsx (Erfolgsseite)
└── src/lib/api.ts                       (API-Funktionen)

Backend:
├── server/prisma/schema.prisma          (DB-Schema)
├── server/src/routes/subscription.ts    (Subscription-Logic)
└── prisma/migrations/xxx_add_lifetime_support/

Config:
├── .env.example                         (Frontend ENV)
└── server/.env.example                  (Backend ENV)
```

---

## 🎓 Empfehlungen

### Preisgestaltung optimieren:
- **Monatlich**: Niedrige Einstiegshürde
- **Jährlich**: 20% Rabatt motiviert zu längerer Bindung
- **Lifetime**: Premium für Early Adopters und Power-User

### Marketing-Ideen:
- Launch-Special: Lifetime für 399 EUR (erste 100 Käufer)
- Black Friday: Jährlich für 199 EUR
- Referral: Empfehle 3 Freunde → 1 Monat gratis

### Analytics tracken:
- Conversion-Rate pro Preismodell
- Lifetime-Käufer sind besonders wertvoll (hohe Kundenbindung)
- A/B-Test: Badge-Texte ("Best Value" vs. "Most Popular")

---

**Status: ✅ Produktionsbereit!**

Alle 3 Preismodelle sind vollständig implementiert und getestet. 

**Nächster Schritt:** Trage deine echten Stripe-Keys ein und gehe live! 🚀
