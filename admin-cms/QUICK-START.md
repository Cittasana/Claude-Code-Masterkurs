# 🚀 Quick Start Guide - Admin CMS

## Übersicht

Dieses Admin CMS ist eine vollständige Verwaltungsoberfläche für deinen Claude Code Masterkurs mit:

✅ **Dashboard** - Übersicht & Metriken
✅ **Lektionen-Editor** - WYSIWYG mit Tiptap
✅ **Tools Manager** - Verwalte alle 43 Tools
✅ **Research Agent** - AI-gestützte Recherche
✅ **Analytics** - User-Statistiken
✅ **User Management** - Abo-Verwaltung

---

## 📦 Installation (5 Minuten)

### 1. Dependencies installieren

```bash
cd admin-cms
npm install
```

### 2. Umgebungsvariablen einrichten

Erstelle `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/claude_masterkurs?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dein-secret-key-hier" # Generiere mit: openssl rand -base64 32

# UploadThing (Bild-Upload)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="app_..."

# Optional: Research Agent APIs
BRAVE_SEARCH_API_KEY="..."
GITHUB_TOKEN="ghp_..."
```

### 3. Datenbank aufsetzen

```bash
# Prisma Schema initialisieren
npx prisma db push

# Prisma Client generieren
npx prisma generate

# Admin-User erstellen
npm run seed:admin
```

Das erstellt einen Admin-Account:
- **Email**: admin@claude-code-masterkurs.de
- **Passwort**: ChangeMeNow123!

### 4. Development-Server starten

```bash
npm run dev
```

Öffne: http://localhost:3000/admin/dashboard

---

## 🎨 Struktur Übersicht

```
admin-cms/
├── app/
│   ├── (auth)/          # Login & Authentifizierung
│   ├── (dashboard)/     # Admin-Seiten
│   │   ├── dashboard/   # Haupt-Dashboard
│   │   ├── lektionen/   # Lektionen verwalten
│   │   ├── tools/       # Tools & Extensions
│   │   ├── research/    # Research Agent
│   │   ├── analytics/   # Analytics Dashboard
│   │   └── users/       # User Management
│   └── api/             # API Routes
├── components/
│   ├── admin/           # Admin Layout-Komponenten
│   └── editor/          # Tiptap Rich Text Editor
├── lib/                 # Utilities & Helpers
└── prisma/              # Datenbank Schema
```

---

## 🔑 Wichtige Features

### 1. **Lektionen-Editor**

- WYSIWYG Rich Text Editor (Tiptap)
- Code-Syntax-Highlighting
- Bild/Video-Upload
- Live-Vorschau
- Entwürfe & Planung
- **Integration mit Research Agent!**

**Route**: `/admin/lektionen/[id]`

### 2. **Research Agent** ⭐ NEU

Manuell triggerbar für Content-Recherche:

1. Topic eingeben (z.B. "Python async/await")
2. Quelle wählen (Web/GitHub/Docs/Stack Overflow)
3. Research starten
4. Ergebnisse direkt in Lektion einfügen

**Route**: `/admin/research`

**API**: `POST /api/research/trigger`

```typescript
// Beispiel API Call
const response = await fetch('/api/research/trigger', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'Python async/await',
    quelle: 'web',
    userId: 'user_1'
  })
});
```

### 3. **Tools Manager**

Verwalte alle 43 Tools & Extensions:

- Kategorien: Anfänger/Fortgeschritten/Experten/MCP
- Markdown-Import
- Bulk-Operationen
- Reihenfolge ändern

**Route**: `/admin/tools`

### 4. **Analytics Dashboard**

- User-Statistiken
- Kurs-Fortschritt
- Beliebte Lektionen
- Revenue-Tracking
- Retention-Metriken

**Route**: `/admin/analytics`

---

## 🔧 Konfiguration

### Prisma Schema erweitern

Passe `prisma/schema.prisma` nach deinen Bedürfnissen an.

**Beispiel**: Quiz-Fragen hinzufügen:

```prisma
model Quiz {
  id         String   @id @default(cuid())
  lektionId  String
  lektion    Lektion  @relation(fields: [lektionId], references: [id])
  frage      String
  optionen   String[] // ["A", "B", "C", "D"]
  richtige   String   // "A"
  createdAt  DateTime @default(now())
}
```

Dann:

```bash
npx prisma db push
npx prisma generate
```

### Research Agent Quellen erweitern

In `app/api/research/trigger/route.ts`:

```typescript
// Neue Quelle hinzufügen
async function searchCustomSource(topic: string) {
  const response = await fetch(`https://api.example.com/search?q=${topic}`);
  const data = await response.json();
  return data.results;
}
```

---

## 📊 API-Endpunkte

### Lektionen

```
GET    /api/lektionen          # Alle Lektionen
GET    /api/lektionen/[id]     # Einzelne Lektion
POST   /api/lektionen          # Neue Lektion
PATCH  /api/lektionen/[id]     # Lektion aktualisieren
DELETE /api/lektionen/[id]     # Lektion löschen
POST   /api/lektionen/[id]/publish  # Veröffentlichen
```

### Research Agent

```
POST   /api/research/trigger   # Research starten
GET    /api/research/history   # History abrufen
GET    /api/research/[id]      # Einzelne Recherche
```

### Analytics

```
GET    /api/analytics/overview # Dashboard-Daten
GET    /api/analytics/users    # User-Statistiken
GET    /api/analytics/revenue  # Revenue-Daten
```

---

## 🎯 Nächste Schritte

### Sofort produktiv

1. **Login**: http://localhost:3000/admin/dashboard
2. **Erste Lektion erstellen**: `/admin/lektionen/new`
3. **Research Agent testen**: `/admin/research`
4. **Tools importieren**: `/admin/tools` → "Import MD"

### Integration in bestehendes System

Das CMS ist **standalone** - du kannst es:

1. **Separat hosten**: Eigene Subdomain (admin.claude-code-masterkurs.de)
2. **In bestehendes Next.js integrieren**: Kopiere `/admin`-Ordner
3. **Als Service nutzen**: API-only, Frontend woanders

### Deployment

#### Vercel (empfohlen)

```bash
# 1. Vercel CLI installieren
npm i -g vercel

# 2. Projekt deployen
vercel

# 3. Environment Variables setzen (Vercel Dashboard)
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - UPLOADTHING_SECRET
# - etc.

# 4. Production Deploy
vercel --prod
```

#### Andere Plattformen

- **Railway**: PostgreSQL + Next.js hosting
- **Render**: Free tier mit PostgreSQL
- **Netlify**: Mit Supabase für DB

---

## 🛠️ Development-Workflow

### Lokales Testing

```bash
# Development
npm run dev

# Datenbank UI öffnen
npm run db:studio

# Type-Check
npm run lint

# Production Build testen
npm run build
npm run start
```

### Neue Komponente hinzufügen

```bash
# 1. Komponente erstellen
touch components/admin/my-component.tsx

# 2. In Seite importieren
# app/(dashboard)/my-page/page.tsx

# 3. Testen
npm run dev
```

---

## 📚 Wichtige Links

- **Tiptap Docs**: https://tiptap.dev/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth Docs**: https://next-auth.js.org
- **shadcn/ui**: https://ui.shadcn.com

---

## ❓ FAQ

**Q: Wie importiere ich die 43 Tools-Lektionen?**

A: In `/admin/tools` → "Import MD" Button → Wähle alle .md Dateien aus `/tools/` Ordner.

**Q: Kann ich das Design anpassen?**

A: Ja! Alle Farben in `tailwind.config.ts` ändern, Komponenten in `/components/admin/` anpassen.

**Q: Research Agent funktioniert nicht?**

A: Stelle sicher, dass API Keys in `.env.local` gesetzt sind (Brave Search, GitHub Token, etc.).

**Q: Wie füge ich neue Admin-User hinzu?**

A: Über `/admin/users` → "Neuer User" oder via Prisma Studio.

---

## 🆘 Support

Bei Problemen:

1. Logs checken: `npm run dev` Terminal-Output
2. Prisma Studio öffnen: `npm run db:studio`
3. Database Connection testen: `npx prisma db push`

---

**Viel Erfolg mit deinem Admin CMS! 🚀**

*Erstellt für den Claude Code Masterkurs*
