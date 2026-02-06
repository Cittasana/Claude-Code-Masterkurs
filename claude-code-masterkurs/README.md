# 🎓 Claude Code Masterkurs

> Von Anfänger zum Profi - Der ultimative interaktive Kurs für Claude Code

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/Cittasana/Claude-Code-Masterkurs)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**Repository:** [github.com/Cittasana/Claude-Code-Masterkurs](https://github.com/Cittasana/Claude-Code-Masterkurs) · **Live:** [claude-code-masterkurs.de](https://claude-code-masterkurs.de)

## 🌟 Features

### ✅ **Phase 1 - IMPLEMENTIERT**
- ✅ **27 Lektionen** in 3 Levels (Grundlagen, Fortgeschritten, Expert/Mastery)
- ✅ **Interaktives Quiz-System** mit Live-Feedback
- ✅ **Progress Tracking** mit LocalStorage Persistenz
- ✅ **Dashboard Analytics** mit Visualisierungen
- ✅ **Dark Mode GitHub-Style Design**
- ✅ **50+ Code-Beispiele** mit Syntax Highlighting
- ✅ **Copy-to-Clipboard** Funktionalität
- ✅ **Responsive Design** für Mobile & Desktop
- ✅ **Streak Tracker** für Motivation
- ✅ **Skill Progress** System

### 🚧 **Phase 2 - GEPLANT** (Nächste Iteration)
- 🔜 6 Real-Life Projekte mit Auto-Validierung
- 🔜 Erweiterte Quiz-Typen (Code Completion, Matching, etc.)
- ✅ Alle 27 Lektionen vollständig ausgearbeitet
- 🔜 Certificate System
- 🔜 Code Playground mit Live Preview
- 🔜 Feature Reference (100+ Features)
- 🔜 Community Patterns

## 📚 Kurs-Inhalt

### Level 1: Grundlagen (Lektionen 0-5)
- **L0**: Was ist Claude Code? ✅
- **L1**: Installation & Setup ✅
- **L2**: Authentifizierung & Model-Auswahl ✅
- **L3**: Erste Schritte & Befehle (Coming Soon)
- **L4**: CLAUDE.md Mastery (Coming Soon)
- **L5**: Context Management (Coming Soon)

### Level 2: Fortgeschritten (Lektionen 6-11)
- **L6-L11**: Coming in Phase 2

### Level 3: Expert (Lektionen 12-18)
- **L12-L18**: Coming in Phase 2

## 🚀 Quick Start

### Voraussetzungen
- Node.js 16+
- npm 7+

### Installation

\`\`\`bash
# 1. Navigate to project
cd claude-code-masterkurs

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Visit http://localhost:5173
\`\`\`

### Build für Production

\`\`\`bash
# Production Build erstellen
npm run build

# Build lokal testen
npm run preview
\`\`\`

## 🏗️ Projekt-Struktur

\`\`\`
claude-code-masterkurs/
├── src/
│   ├── components/
│   │   ├── Navigation/
│   │   ├── Lessons/
│   │   ├── Quiz/
│   │   └── UI/
│   ├── pages/
│   │   ├── DashboardView.tsx
│   │   ├── LessonView.tsx
│   │   └── ProjectView.tsx
│   ├── store/
│   │   └── userProgress.ts
│   ├── data/
│   │   ├── lessons.ts
│   │   └── quizzes.ts
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
├── tailwind.config.js
├── vite.config.ts
└── package.json
\`\`\`

## 🎨 Tech Stack

- **React 19** + **TypeScript**
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **Prism.js** - Code Highlighting
- **Vite** - Build Tool

## 📖 Verwendung

### Dashboard
Das Dashboard zeigt deinen Gesamtfortschritt:
- Overall Progress über alle Lektionen
- Level Breakdown (1-3)
- Quiz Performance Statistiken
- Streak Tracker
- Skill Progress
- Certification Progress

### Lektionen
- Navigiere durch Lektionen
- Markiere als abgeschlossen
- Copy Code-Beispiele
- Quiz nach jeder Lektion

### Quiz System
- Multiple Choice & Checklist Fragen
- Live Feedback
- Hints System
- Max 3 Versuche pro Quiz
- Automatische Punktevergabe

## 🎯 Lernziele

Nach Abschluss dieses Kurses kannst du:
- ✅ Claude Code professionell installieren
- ✅ CLAUDE.md optimal nutzen
- ✅ MCP Server integrieren
- ✅ Custom Skills entwickeln
- ✅ Multi-Agent Systeme orchestrieren
- ✅ 5-10x produktiver entwickeln

## 📱 Responsive Design

Vollständig responsive für:
- Desktop (optimiert)
- Tablet
- Mobile (touch-optimiert)

## 🚢 Deployment

Das Projekt ist mit **Vercel** verbunden: Jeder Push auf `main` deployt automatisch.

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Live-URL:** https://claude-code-masterkurs.de
- **Branches:** `main` = Production (Auto-Deploy), `develop` = optional für Features (siehe [CONTRIBUTING.md](CONTRIBUTING.md))

### Manuell (Vercel CLI)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

## 📝 Roadmap

### Version 4.0 (Aktuell)
- [x] Alle 27 Lektionen vollständig
- [x] 27 interaktive Quizzes
- [x] 9 Real-Life Projekte mit Validierung
- [x] Erweiterte Quiz-Typen (Code Completion, Matching, Free Text)
- [x] Certificate Generator
- [x] Multi-Language Support (DE, EN, FR, ES)
- [x] Video Integration
- [x] Community Forum, Leaderboard, Analytics
- [x] 8 neue Mastery-Lektionen (Context Engineering, IDE-Integrationen, Sandboxing, CI/CD, Kosten-Optimierung, Agent SDK, Plugins, Workflows)

## 📄 License

MIT License

## 👨‍💻 Author

Erstellt für die Claude Code Community

---

**Status**: ✅ Phase 4 Complete – 27 Lektionen, 27 Quizzes, 9 Projekte

**Version**: 4.0.0

**Last Updated**: 2026-02-06
