# Claude Code Masterkurs - Admin CMS

## 🎯 Übersicht

Vollständiges Content Management System für die Verwaltung des Claude Code Masterkurses.

## 🏗️ Architektur

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS
- **UI-Komponenten**: shadcn/ui
- **Rich Text Editor**: Tiptap
- **Datenbank**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js
- **Analytics**: Vercel Analytics + Custom Tracking
- **File Upload**: UploadThing
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod

## 📁 Struktur

```
admin-cms/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── setup/
│   ├── (dashboard)/
│   │   ├── dashboard/          # Haupt-Dashboard
│   │   ├── lektionen/          # Lektionen-Verwaltung
│   │   │   ├── [id]/           # Lektion bearbeiten
│   │   │   └── new/            # Neue Lektion
│   │   ├── patterns/           # Code-Patterns
│   │   ├── tools/              # Tools & Extensions
│   │   ├── research/           # Research Agent
│   │   ├── analytics/          # Analytics Dashboard
│   │   └── users/              # User Management
│   ├── api/
│   │   ├── lektionen/
│   │   ├── patterns/
│   │   ├── tools/
│   │   ├── research/
│   │   ├── analytics/
│   │   └── users/
│   └── layout.tsx
├── components/
│   ├── admin/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── layout.tsx
│   ├── editor/
│   │   ├── tiptap-editor.tsx
│   │   ├── toolbar.tsx
│   │   └── extensions/
│   ├── patterns/
│   ├── tools/
│   ├── research/
│   ├── analytics/
│   └── users/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── research-agent.ts
│   └── analytics.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

## 🚀 Features

### 1. Dashboard
- Übersicht über alle Kursinhalte
- Quick Actions
- Neueste Aktivitäten
- Wichtige Metriken

### 2. Lektionen-Editor
- WYSIWYG Rich Text Editor (Tiptap)
- Markdown-Support
- Code-Syntax-Highlighting
- Bild-Upload
- Video-Einbettung
- Live-Vorschau
- Versionierung
- Entwürfe speichern
- Publikation planen

### 3. Patterns-Manager
- Code-Patterns erstellen/bearbeiten
- Kategorie-Verwaltung
- Tags & Suchfunktion
- Code-Beispiele mit Syntax-Highlighting
- Best Practices definieren

### 4. Tools & Extensions Manager
- 43 Tools verwalten
- Kategorien: Anfänger/Fortgeschritten/Experten/MCP
- Markdown-Import
- Bulk-Operationen
- Reihenfolge ändern

### 5. Research Agent Interface
- Manueller Trigger für Web-Research
- Topic-Eingabe
- Quelle auswählen (Web/GitHub/Stack Overflow)
- Ergebnisse anzeigen
- Direkt in Lektion einfügen
- History der Recherchen

### 6. Analytics Dashboard
- User-Statistiken
- Kurs-Fortschritt
- Beliebte Lektionen
- Conversion-Tracking
- Retention-Metriken
- Revenue-Übersicht

### 7. User Management
- User-Liste
- Filter & Suche
- Abo-Status
- Fortschritt pro User
- Email-Kommunikation
- Rollen-Verwaltung

## 🔐 Authentifizierung

- Admin-Login mit NextAuth.js
- Role-Based Access Control (RBAC)
- Rollen: Admin, Editor, Viewer
- Session-Management
- 2FA optional

## 📊 Datenbank Schema

```prisma
model Lektion {
  id          String   @id @default(cuid())
  titel       String
  slug        String   @unique
  beschreibung String?
  content     String   @db.Text
  kategorie   String
  reihenfolge Int
  status      String   // draft, published, scheduled
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  autorId     String
  autor       User     @relation(fields: [autorId], references: [id])
  quiz        Quiz[]
  challenges  Challenge[]
}

model Pattern {
  id          String   @id @default(cuid())
  titel       String
  beschreibung String
  code        String   @db.Text
  sprache     String
  kategorie   String
  tags        String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Tool {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  kategorie   String   // anfaenger, fortgeschritten, experten, mcp
  beschreibung String
  content     String   @db.Text
  reihenfolge Int
  icon        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  rolle       String   @default("user") // user, editor, admin
  aboTyp      String?  // monatlich, jaehrlich, lifetime
  aboStatus   String   @default("active")
  aboStart    DateTime?
  aboEnde     DateTime?
  fortschritt Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lektionen   Lektion[]
}

model ResearchHistory {
  id        String   @id @default(cuid())
  topic     String
  quelle    String
  ergebnis  Json
  createdAt DateTime @default(now())
  userId    String
}

model Analytics {
  id        String   @id @default(cuid())
  eventType String
  eventData Json
  userId    String?
  createdAt DateTime @default(now())
}
```

## 🎨 Design-System

### Farben (aus bestehendem Kurs-Design)
```css
:root {
  --primary: #3b82f6;      /* Blau */
  --secondary: #8b5cf6;    /* Lila */
  --success: #10b981;      /* Grün */
  --warning: #f59e0b;      /* Orange */
  --danger: #ef4444;       /* Rot */
  --background: #ffffff;
  --foreground: #0f172a;
  --muted: #f1f5f9;
}
```

### Komponenten
- Buttons: Primary, Secondary, Outline, Ghost
- Cards: Standard, Hover, Selected
- Forms: Input, Select, Textarea, Checkbox
- Modals: Confirmation, Form, Alert
- Notifications: Toast-Messages
- Tables: Sortable, Filterable, Paginated

## 📝 API-Endpunkte

### Lektionen
- `GET /api/lektionen` - Alle Lektionen
- `GET /api/lektionen/[id]` - Einzelne Lektion
- `POST /api/lektionen` - Neue Lektion erstellen
- `PATCH /api/lektionen/[id]` - Lektion aktualisieren
- `DELETE /api/lektionen/[id]` - Lektion löschen
- `POST /api/lektionen/[id]/publish` - Lektion veröffentlichen

### Patterns
- `GET /api/patterns` - Alle Patterns
- `POST /api/patterns` - Pattern erstellen
- `PATCH /api/patterns/[id]` - Pattern aktualisieren
- `DELETE /api/patterns/[id]` - Pattern löschen

### Tools
- `GET /api/tools` - Alle Tools
- `POST /api/tools` - Tool erstellen
- `PATCH /api/tools/[id]` - Tool aktualisieren
- `POST /api/tools/import` - Markdown importieren

### Research Agent
- `POST /api/research/trigger` - Research starten
- `GET /api/research/history` - Recherche-Historie
- `GET /api/research/[id]` - Einzelne Recherche

### Analytics
- `GET /api/analytics/overview` - Dashboard-Übersicht
- `GET /api/analytics/users` - User-Statistiken
- `GET /api/analytics/revenue` - Umsatz-Daten
- `GET /api/analytics/retention` - Retention-Metriken

### Users
- `GET /api/users` - Alle Users
- `GET /api/users/[id]` - Einzelner User
- `PATCH /api/users/[id]` - User aktualisieren
- `DELETE /api/users/[id]` - User löschen

## 🔧 Installation

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Umgebungsvariablen setzen
cp .env.example .env.local

# 3. Datenbank initialisieren
npx prisma db push
npx prisma generate

# 4. Admin-User erstellen
npm run seed:admin

# 5. Development-Server starten
npm run dev
```

## 🌐 Deployment

```bash
# Production Build
npm run build

# Deployment auf Vercel
vercel --prod
```

## 📚 Dokumentation

Weitere Dokumentation:
- [Lektionen-Editor Guide](./docs/editor-guide.md)
- [Research Agent API](./docs/research-agent.md)
- [Analytics Setup](./docs/analytics-setup.md)
- [User Roles & Permissions](./docs/permissions.md)

## 🎯 Roadmap

### Phase 1 (Woche 1-2)
- ✅ Basis-Setup
- ✅ Authentifizierung
- ✅ Dashboard Layout
- ✅ Lektionen CRUD

### Phase 2 (Woche 3-4)
- ✅ Rich Text Editor
- ✅ Patterns Manager
- ✅ Tools Manager
- ✅ Research Agent

### Phase 3 (Woche 5-6)
- ✅ Analytics Dashboard
- ✅ User Management
- ✅ Bulk-Operationen
- ✅ Export/Import

### Phase 4 (Woche 7-8)
- [ ] A/B Testing
- [ ] Email-Integration
- [ ] Webhook-System
- [ ] Mobile Admin App
