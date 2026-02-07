# GO-LIVE AUDIT REPORT

**Projekt:** Claude Code Masterkurs
**Datum:** 2026-02-07
**Methode:** 4 parallele Audit-Agenten (Frontend, Backend, Deployment, Security)

---

## Ergebnis-Zusammenfassung

| Schweregrad | Anzahl |
|-------------|--------|
| KRITISCH    | 11     |
| WARNUNG     | 27     |
| INFO        | 30+    |

**Bewertung: NICHT GO-LIVE-BEREIT** - 11 kritische Probleme muessen behoben werden.

---

## KRITISCHE PROBLEME (Muessen vor Go-Live behoben werden)

### K1 - CSP blockiert Stripe und potentiell Backend-API
- **Dateien:** `vercel.json:27`
- **Problem:** Die Content-Security-Policy erlaubt `connect-src 'self' https://api.claude-code-masterkurs.de https://*.sentry.io`, aber:
  - Stripe (`https://js.stripe.com`, `https://*.stripe.com`) fehlt komplett
  - Die tatsaechliche Backend-URL ist `https://backend-production-9d7c.up.railway.app` - falls `api.claude-code-masterkurs.de` nicht als CNAME/Proxy eingerichtet ist, schlagen ALLE API-Calls fehl
- **Loesung:** CSP erweitern:
  ```
  script-src 'self' 'unsafe-inline' https://js.stripe.com;
  connect-src 'self' https://api.claude-code-masterkurs.de https://*.sentry.io https://*.stripe.com;
  frame-src https://js.stripe.com https://hooks.stripe.com;
  ```
  DNS pruefen: Zeigt `api.claude-code-masterkurs.de` auf Railway?

### K2 - Datenschutzerklaerung ist falsch / veraltet (DSGVO-Verstoss)
- **Datei:** `src/pages/DatenschutzView.tsx`
- **Problem:** Die Erklaerung behauptet: "Es werden keine personenbezogenen Daten an einen Server uebermittelt" und "Diese Website verwendet keine Cookies". Das ist falsch - die App hat:
  - Backend mit Registrierung, E-Mail, Passwort-Hashes (PostgreSQL auf Railway)
  - Stripe-Zahlungsverarbeitung
  - Sentry Error-Tracking
  - Resend E-Mail-Service
  - Cookie-Consent-Banner (Widerspruch zum Text)
- **Loesung:** Datenschutzerklaerung komplett ueberarbeiten mit Abschnitten fuer:
  - Serverseitige Datenspeicherung (Railway/PostgreSQL)
  - Zahlungsdienstleister Stripe (Art. 13 DSGVO)
  - E-Mail-Dienst Resend
  - Error-Tracking Sentry
  - Cookie-Nutzung korrigieren

### K3 - Widerrufsbelehrung fehlt
- **Problem:** Bei kostenpflichtigen Abos (24 EUR/Monat, 229 EUR/Jahr, 499 EUR Lifetime) ist eine Widerrufsbelehrung gemaess EU-Fernabsatzrecht (Richtlinie 2011/83/EU) zwingend erforderlich. Fehlt komplett.
- **Loesung:** Widerrufsbelehrung mit Muster-Widerrufsformular erstellen und verlinken.

### K4 - SEO: "kostenlos" vs. Bezahl-Abo (Google-Abstrafungsrisiko)
- **Datei:** `index.html:86, 190, 262-270`
- **Problem:** Strukturierte Daten und FAQ behaupten der Kurs sei kostenlos:
  - `"isAccessibleForFree": true`
  - FAQ: "der Kurs ist vollstaendig kostenlos"
  - `"price": "0"`
  - Gleichzeitig: Stripe-Abos mit 24/229/499 EUR
- **Loesung:** `isAccessibleForFree` auf `false`, Preise korrekt angeben, FAQ korrigieren.

### K5 - Fiktive Bewertungen in Structured Data
- **Datei:** `index.html:103-108`
- **Problem:** `aggregateRating` mit `"ratingValue": "4.8"` und `"ratingCount": "150"` ist erfunden. Google kann manuelle Strafe verhaengen.
- **Loesung:** `aggregateRating`-Block entfernen oder echte Bewertungen erfassen.

### K6 - JWT_SECRET mit unsicherem Fallback-Wert
- **Datei:** `server/src/middleware/auth.ts:23`
- **Problem:** `JWT_SECRET` faellt auf `'dev-secret-change-in-production'` zurueck. Ein Angreifer koennte damit gueltige JWTs faelschen.
- **Loesung:**
  ```typescript
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }
  ```

### K7 - Client-seitige Punktemanipulation (Score Cheating)
- **Dateien:** `server/src/routes/progress.ts:52-68, 123-129, 168-179`, `server/src/routes/challenges.ts:44-50`
- **Problem:** Client sendet `totalPoints`, `streak`, `score`, `attempts` direkt - ein Benutzer kann sich beliebige Highscores geben. Betrifft:
  - `PUT /api/progress` - totalPoints, streak, lessonsCompleted
  - `POST /api/progress/quiz` - score, attempts
  - `POST /api/progress/project` - score
  - `POST /api/challenges/results` - score, maxScore, timeUsed
- **Loesung:** Serverseitige Berechnung der Punkte. Client meldet nur Aktionen, Server berechnet Ergebnis.

### K8 - Seed-Script in Production ausfuehrbar
- **Datei:** `server/prisma/seed.ts:97, 211-233`
- **Problem:** Erstellt 15 Accounts mit Passwort `demo1234` und Promo-Code `TEST2024` mit unbegrenzten Nutzungen (6 Monate kostenloser Zugang).
- **Loesung:**
  ```typescript
  if (process.env.NODE_ENV === 'production') {
    console.error('Seeding not allowed in production');
    process.exit(1);
  }
  ```

### K9 - verify-email ohne Rate Limiting
- **Datei:** `server/src/routes/auth.ts:351`
- **Problem:** `POST /api/auth/verify-email` hat kein Rate Limiting. Token-Brute-Force moeglich.
- **Loesung:** `authRateLimit` Middleware hinzufuegen.

### K10 - Sitemap enthaelt nicht-existierende Lektionen
- **Datei:** `public/sitemap.xml:159-239`
- **Problem:** Lektionen 19-26 (Level 4: "Meister") sind gelistet, existieren aber nicht. Erzeugt 404-Fehler, schadet SEO-Ranking.
- **Loesung:** Lektionen 19-26 aus der Sitemap entfernen. Nur 0-18 listen.

### K11 - favicon.svg fehlt
- **Dateien:** `index.html:39`, `public/manifest.json:15`
- **Problem:** Verweisen auf `/favicon.svg`, die Datei existiert nicht. 404 beim Laden.
- **Loesung:** `favicon.svg` erstellen oder Referenzen auf vorhandene PNG/ICO-Formate aendern.

---

## WARNUNGEN (Sollten vor Go-Live behoben werden)

### Sicherheit

| # | Datei | Problem | Loesung |
|---|-------|---------|---------|
| W1 | `server/src/lib/email.ts:19,48` | Reset-/Verification-Token-URLs werden in Logs geschrieben | URLs nicht loggen, nur Tatsache dass kein API-Key gesetzt ist |
| W2 | `server/src/middleware/auth.ts:24` | JWT 7 Tage gueltig, kein Refresh-Token, keine serverseitige Invalidierung | JWT-Laufzeit reduzieren, Refresh-Token einfuehren |
| W3 | `server/src/routes/auth.ts:17` | Passwort nur `min(8)`, keine Komplexitaetsanforderungen | Grossbuchstabe, Ziffer, Sonderzeichen erfordern |
| W4 | `server/src/routes/auth.ts:37` | Email-Enumeration: "E-Mail ist bereits registriert" bei 409 | Gleiche Antwort fuer existierende und neue E-Mails |
| W5 | `server/src/routes/subscription.ts:10-11` | Stripe Keys mit leerem String Fallback | In Production Fehler werfen wenn Keys fehlen |
| W6 | `server/src/routes/subscription.ts:344` | Webhook gibt `err.message` an Client zurueck | Generische Fehlermeldung: `'Webhook verification failed'` |
| W7 | `src/main.tsx:26` | `document.body.innerHTML` mit unescaptem Error-String | `textContent` statt `innerHTML` verwenden |
| W8 | `server/src/routes/patterns.ts:99` | Pattern-Snippet wird nicht sanitiert (Code-Inhalt) | Sicherstellen dass Frontend nur React-escaped rendert |
| W9 | `server/src/lib/email.ts:95,180` | `displayName` wird direkt in HTML-E-Mail interpoliert | `escapeHtml(displayName)` verwenden |
| W10 | `vercel.json:27` | CSP `script-src 'unsafe-inline'` schwaecht XSS-Schutz | Nonces oder Hashes statt `unsafe-inline` |

### Fehlende Rate Limits

| # | Datei | Route | Loesung |
|---|-------|-------|---------|
| W11 | `server/src/routes/progress.ts` | PUT /api/progress, POST quiz, POST project | `writeRateLimit` hinzufuegen |
| W12 | `server/src/routes/challenges.ts:52` | POST /api/challenges/results | `writeRateLimit` hinzufuegen |
| W13 | `server/src/routes/srs.ts:81,140` | POST /api/srs/add, POST /api/srs/review | `writeRateLimit` hinzufuegen |
| W14 | `server/src/routes/analytics.ts:72,103` | POST /api/analytics/events, /events/batch | `writeRateLimit` hinzufuegen |

### Datenbank

| # | Datei | Problem | Loesung |
|---|-------|---------|---------|
| W15 | `server/prisma/schema.prisma` | QuizResult, ProjectResult, ChallengeResult, SRSItem: Kein Index auf `userId` | `@@index([userId])` hinzufuegen |
| W16 | `server/prisma/schema.prisma` | SRSItem: Kein Index auf `[userId, nextReviewAt]` fuer Due-Query | `@@index([userId, nextReviewAt])` hinzufuegen |

### Frontend

| # | Datei | Problem | Loesung |
|---|-------|---------|---------|
| W17 | `src/App.tsx` | Keine Protected Routes fuer /profile, /subscription/success | `<ProtectedRoute>` Wrapper erstellen |
| W18 | `src/lib/api.ts:5` | `localhost:3000` Fallback in Production aktiv | Fehler werfen wenn Variable fehlt |
| W19 | `src/store/authStore.ts:165` | Duplizierte API-URL statt Import aus `api.ts` | `API_BASE` aus `api.ts` importieren |
| W20 | `src/store/analyticsStore.ts` | Events wachsen unbegrenzt in LocalStorage | Max 500 Events oder 90-Tage-Bereinigung |
| W21 | `src/pages/SubscriptionSuccessView.tsx:108` | Text sagt "Alle 8 Lektionen" statt 19 | Korrigieren zu "Alle 19 Lektionen" |
| W22 | `src/pages/RegisterView.tsx:113,156` | `catch (error: any)` statt `unknown` | `catch (error: unknown)` verwenden |

### Deployment & SEO

| # | Datei | Problem | Loesung |
|---|-------|---------|---------|
| W23 | `.env.example:17` | Live Stripe Publishable Key teilweise sichtbar | Durch `pk_test_xxx` Platzhalter ersetzen |
| W24 | `.env.example:21-23` + `RegisterView.tsx:62,71,80` | Live Price IDs in .env.example und als Fallback hardcodiert | Platzhalter verwenden, Fallbacks entfernen |
| W25 | `index.html:97` | `numberOfLessons: 27` statt 19 | Auf `19` korrigieren |
| W26 | `index.html:65` | `<link rel="preload" href="/src/main.tsx">` - existiert nicht im Build | Entfernen (Vite hasht den Output) |
| W27 | `public/sitemap.xml` | `/nutzungsbedingungen` und `/docs` fehlen | Zur Sitemap hinzufuegen |

---

## INFO (Kein Handlungsbedarf - korrekt implementiert)

- TypeScript strikt konfiguriert, keine `@ts-ignore` gefunden
- Build-Pipeline korrekt (Terser, Chunks, `drop_console`, keine Sourcemaps)
- Prisma ORM verhindert SQL Injection
- bcryptjs mit Cost-Faktor 12 fuer Passwort-Hashing
- Reset-Tokens: `crypto.randomBytes(32)` (kryptografisch sicher)
- `passwordHash` wird vor Client-Antwort entfernt
- Helmet Security Headers korrekt konfiguriert
- CORS auf spezifische Origins beschraenkt
- CSRF kein Risiko (JWT ueber Authorization-Header, nicht Cookies)
- HSTS mit `includeSubDomains` und `preload`
- Globaler Error-Handler: kein Stack-Trace-Leak in Production
- Graceful Shutdown mit `prisma.$disconnect()`
- Sentry mit `sendDefaultPii: false` und PII-Filterung
- Console.logs werden durch Terser in Production entfernt
- Alle 7 Zustand-Stores korrekt persistiert
- Zod-Validierung auf allen API-Routen
- XSS-Sanitierung fuer User-Input (forum, patterns, auth)
- Impressum vollstaendig
- `.env` Dateien korrekt in `.gitignore`
- CI-Pipeline vorhanden (Lint, TypeCheck, Build)
- Webhook-Handler mit Signaturverifikation
- Asset-Caching mit Content-Hashes konfiguriert

---

## Empfohlene Fix-Reihenfolge

### Phase 1 - Rechtlich (SOFORT)
1. Datenschutzerklaerung komplett ueberarbeiten (K2)
2. Widerrufsbelehrung erstellen (K3)
3. SEO Structured Data korrigieren - "kostenlos" und fake Bewertungen (K4, K5)

### Phase 2 - Sicherheitskritisch (VOR Go-Live)
4. JWT_SECRET Production-Check (K6)
5. CSP fuer Stripe und Backend erweitern (K1)
6. verify-email Rate Limiting (K9)
7. Seed-Script Production-Guard (K8)

### Phase 3 - Funktional (VOR Go-Live)
8. Sitemap korrigieren (K10)
9. favicon.svg erstellen/Referenzen fixen (K11)
10. Client-seitige Score-Manipulation beheben (K7)

### Phase 4 - Warnungen (ZEITNAH)
11. Rate Limits fuer Write-Endpoints (W11-W14)
12. Datenbank-Indizes (W15-W16)
13. Protected Routes (W17)
14. Restliche Warnungen (W1-W10, W18-W27)

---

*Generiert durch 4 parallele Audit-Agenten am 2026-02-07*
