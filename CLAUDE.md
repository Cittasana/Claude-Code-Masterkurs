# Claude Code Masterkurs - Projekt Memory

## 🎯 Projekt-Übersicht

**Produkt**: Claude Code Masterkurs
**Domain**: https://claude-code-masterkurs.de/dashboard
**Owner**: Cosmo (office@cittasana.de)
**Ziel**: Online-Kurs-Plattform für KI-gestütztes Programmieren mit Claude Code

**Repo-Layout** (in `/Users/cosmograef/Desktop/Claude Code ausbildung/`):
- `claude-code-masterkurs/` — Vite + React 19 + TS Hauptapp (vercel-deployed)
- `admin-cms/` — Next.js Admin-CMS für Lektionen/Tools/Research-Verwaltung
- `masterkurs-agent/` — Wöchentlicher Research-Auto-Pipeline (Cron-getriggert)
- `tools/` — 45+ Tool-Stub-Verzeichnisse
- `dist/`, `node_modules/` — Build-Artefakte

---

## 📊 Aktueller Stand (Stand: 2026-05-11)

### Content-Bestand:
- **47 Lektionen** (Level 1-3) in `src/data/lessons.ts` (~18.7k Zeilen)
- **43 Tools & Extensions Lektionen** in `src/data/tools/` (CLI-Anfänger, Fortgeschritten, Experten, MCP)
- **Quizzes, Live-Coding-Challenges, Capstone-Projekte, Patterns, Forum-Categories** als statische TS-Module
- **i18n**: DE / EN / FR / ES (`src/locales/`)
- **Local Video Provider**: `/videos/lektion-XX.mp4` als Standard-Quelle (YouTube/Vimeo optional)

### Lektionen aus aktuellem Sprint (Feb-Mai 2026 Highlights):
- L42: Plugin-Distribution mit `--plugin-url` & `skillOverrides` (Level 3)
- L43: Compaction-Hygiene — 60%-Regel & Pre-Compact-Brief (Level 2)
- L44: Advisor Tool — Cost-Aware Multi-Model in Production (Level 3, Mai-2026-Benchmarks)
- L45: `worktree.baseRef` — Multi-Agent-Worktrees richtig konfigurieren (Level 2)
- L46: Effort-aware Hooks — `$CLAUDE_EFFORT` in der Praxis (Level 3)

### Plattform-Features:
- ✅ Live-Playground (Editor + Terminal-Simulation)
- ✅ Live-Coding-Challenges + Quiz-Komponenten
- ✅ Suchfunktion, Leaderboard, Forum-Categories
- ✅ Discord-Login (OAuth Redirect-Handler in `App.tsx`)
- ✅ Support-Tickets + Webhook-Notifications (Discord)
- ✅ DiscordWidget + FounderSection (Landing-Page-CTA)
- ✅ Free-Tier-Mechanik (`FREE_LESSON_LIMIT = 5` in `src/lib/lessons-config.ts`)
- ✅ Spaced Repetition System (SRS) für Lektionen-Review
- ✅ Stripe-Integration (3 Abo-Modelle)
- ✅ Cittasana Ethereal Glass Design System (Mai 2026 ausgerollt)
- ✅ Admin-CMS migriert (alle 11 Content-Types verwaltbar)
- ✅ Auto-Agent-Pipeline: weekly-research-v2.md → automatische Lektions-Generierung

### Abo-Modelle (Stripe):
- Monatlich: €24
- Jährlich: €229 (20% Ersparnis)
- Lifetime: €499

---

## 🤖 Auto-Agent-Pipeline (`masterkurs-agent/`)

**Wöchentlicher Research-Run** (`research/YYYY-MM-DD-weekly-research-v2.md`):
- Recherchiert Claude Code Updates, Anthropic Releases, Wettbewerber (Cursor, Copilot CLI, Codex CLI)
- Synthetisiert Community Best Practices und Antipatterns
- Liefert Content-Empfehlungen mit Prio (Hoch / Mittel / Niedrig)
- Letzter Run: **2026-05-11** (deckt Anthropic Advisor Tool Benchmarks, Claude Code 2.1.133-137, Claude Security Beta, Cursor 3.3, Copilot CLI 1.0.44, Codex CLI 0.130)

**Pipeline-Output landet in:**
- `masterkurs-agent/lessons/` (Lektions-Drafts)
- → integriert in `claude-code-masterkurs/src/data/lessons.ts`

**Trigger:**
- Skill: `masterkurs-research` (WebSearch)
- Manuell: `masterkurs-weekly-agent` Skill
- Lesson-Creator: `masterkurs-lesson-creator` Skill (Multi-MCP)

---

## 🛠️ Tech Stack (Hauptapp)

**Frontend:**
- React 19.2 + Vite 7 + TypeScript (strict)
- React Router 7, Zustand 5, react-helmet-async
- Tailwind via PostCSS + Autoprefixer
- Tiptap 3 (Rich-Text in Admin)
- Chart.js 4 / react-chartjs-2 5
- Prism + Lowlight (Code-Highlighting)
- i18next 25 + react-i18next 16

**Backend / Services:**
- Stripe (`@stripe/stripe-js`)
- Discord OAuth (Custom Backend-Endpunkt, JWT-basiert)
- Vercel (Hosting + Edge Functions)
- Lighthouse-Audit-Pipeline (`npm run lighthouse`)

**Build:**
- `vite build` + `tsc -b` + Prerender via `scripts/prerender.ts`
- SEO-Asset-Generator (`scripts/generate-seo-assets.mjs`)
- Image-Optimization (`scripts/optimize-images.mjs`)

**Tools-Section nutzt:** modulare `src/data/tools/{toolsAnfaenger,toolsFortgeschritten,toolsExpert,toolsMcp}.ts`

---

## 🎯 Strategische Prioritäten (offene Items)

### Quick Wins
- ✅ **Free Tier**: 5 Lektionen frei (`FREE_LESSON_LIMIT`)
- ✅ **Discord-Login**: OAuth-Flow implementiert
- 🟡 **Discord-Server**: URL `discord.gg/claude-code-masterkurs` hard-coded — Server-Setup verifizieren
- ❌ **Founder-Video**: Drehbuch + Aufnahme + Schnitt offen
- ❌ **About-Page**: Erweiterte Founder-Story

### Mittel-fristig (Backlog aus Research 2026-05-11)
- L47-Vorschlag: "Multi-Agent Showdown — Claude Code vs. Cursor vs. Codex CLI" (Level 3, ~45 Min)
- L48-Vorschlag: "Skill-Antipatterns — Mega-Skill, Kitchen-Sink-Session, Day-One-Hoarding" (Level 1, ~15 Min)
- Erwähnung in bestehender Security-Lektion: Claude Security Public Beta

### Lang-fristig (3-6 Monate)
- Live-Workshops (monatliche Office Hours)
- Freelancer-Track (separates Business-Modul)
- Offline-Events (Berlin/München/Hamburg)
- Code-Review-Feature (Community-Feedback)

---

## 🏗️ Architektur-Richtlinien (lokal überschreibt global wenn anders)

### Datenmodell (`src/types/index.ts`)
- `Lesson` mit `id: number, level: 1|2|3, content: LessonContent[]`
- `LessonContent` Block-Typen: `text | code | highlight | list | yaml | heading | video`
- Quiz/Project/Challenge/Pattern/Forum-Types alle in einem Datei-Modul

### Extensibility-Pattern
- Neue Lektion = neuen Entry in `lessons.ts`-Array anhängen — keine bestehenden IDs ändern
- Neues Tool = neue Datei in `src/data/tools/` + Export in `tools/index.ts`
- Neues Quiz = neuer Entry in `quizzes.ts` mit `lessonId`-Referenz
- Free-Tier-Gate: `isFreeTierLesson(id)` zentral in `lib/lessons-config.ts`

### Convention
- **UUIDs** für User-/Result-Records, **numerische IDs** für statisches Content (Lessons 0-N)
- Lektions-Reihenfolge = `id`-Reihenfolge (keine separate `order`-Spalte)
- Video-Provider-Reihenfolge: `local` (Standard) > `youtube` > `vimeo`
- TypeScript strict-mode aktiv

---

## 🚀 Build & Run

**Hauptapp Dev-Server starten:**
```bash
cd "/Users/cosmograef/Desktop/Claude Code ausbildung/claude-code-masterkurs"
npm run dev
```

**Build + Prerender:**
```bash
npm run build
```

**Preview Production-Build:**
```bash
npm run preview  # läuft auf :4173
```

**Bundle-Analyse:**
```bash
npm run analyze
```

**Admin-CMS Dev-Server:**
```bash
cd "/Users/cosmograef/Desktop/Claude Code ausbildung/admin-cms"
npm run dev
```

**Masterkurs-Agent (Research-Run):**
```bash
cd "/Users/cosmograef/Desktop/Claude Code ausbildung/masterkurs-agent"
# Trigger über Skill: masterkurs-research
```

---

## 🌿 Git-Workflow

**Branches:**
- `main` — Live-Branch (Vercel deploy-target)
- `develop` — **STALE** (steht auf Feb 5, 2026; verwendet `add agent tracking file`). Aktuell nicht aktiv genutzt. → Entweder löschen oder mit main synchronisieren.

**Commit-Style:** `typ(scope): kurze beschreibung`
- Beispiele aus History: `feat(content): add 14 lessons + local video provider`, `feat(ui): apply Cittasana Ethereal Glass design`, `fix(challenges): null-safety for optional ChallengeValidation/solution fields`

**Worktrees:** Multi-Agent-Pattern via `git worktree add` (siehe Lesson 45 für Konfiguration)

---

## 🏆 Wettbewerber-Positionierung

**vs. Pirate Skills:**
- Wir sind **100% Claude Code spezialisiert** (vs. generische AI-Tools)
- Deutscher Markt + deutsche Community
- Lifetime-Option (€499) — Pirate Skills hat das nicht
- **27 → 47 Lektionen** (deutlich tiefer)
- Hybrid-Konkurrenz: Cursor 3.3 (Build in Parallel UX), Copilot CLI 1.0.44 (Enterprise), Codex CLI (Multi-Agent-Trees) — adressiert in Lektion 47-Vorschlag

**Pirate-Skills-Lücken bei uns** (aus früherem Audit):
- ❌ Community-Chat-Features → ✅ Discord-Integration läuft
- ❌ Kostenlose Entry-Points → ✅ 5 freie Lektionen aktiv
- ❌ Founder-Persönlichkeit → 🟡 FounderSection vorhanden, Video offen
- ❌ Offline/Hybrid-Events → ❌ noch offen
- ❌ Business/Marketing-Framework → ❌ Freelancer-Track noch offen
- ❌ Schwaches Branding/Storytelling → ✅ Cittasana Ethereal Glass ausgerollt

---

## 📈 Metriken & KPIs

**Zu tracken:**
- Free → Paid Conversion Rate (jetzt messbar dank FREE_LESSON_LIMIT)
- Lektions-Completion-Rate pro Level
- Discord-Mitglieder ↔ Plattform-User
- Monatliche Churn Rate, MRR, ARR, LTV
- NPS / Weiterempfehlungsrate

**Ziele Q2 2026:**
- 100 Free-Tier Users
- 20% Conversion zu Paid
- <5% Churn
- €5k MRR

---

## 🎨 Branding

**Tonalität:** Du-Anrede, freundlich, technisch akkurat, praxis-orientiert
**Design:** Cittasana Ethereal Glass (Dark, Glassmorphism, Geist + Instrument Serif, Orange-Akzent) — Implementation siehe Commit `ace7d83`
**Skill für Glas-Komponenten:** `cittasana-ethereal-glass` (extrahiert aus webinar.cittasana.de)

---

## 📝 Nächste konkrete Action-Items

### Diese Woche:
- [ ] `develop`-Branch entscheiden: löschen (`git branch -d develop` ist safe — keine Commits ahead) oder mit main syncen
- [ ] Discord-Server-Existenz unter `discord.gg/claude-code-masterkurs` verifizieren / korrigieren
- [ ] Founder-Video aufnehmen (2-3 Min, Drehbuch + Setup-Tag)
- [ ] About-Page mit Founder-Story füllen (FounderSection-Komponente bereits vorhanden)

### Nächste Woche:
- [ ] L47 "Multi-Agent Showdown" Draft (Backlog aus Research-Mai-11)
- [ ] L48 "Skill-Antipatterns" Draft
- [ ] Newsletter-Funnel evaluieren (ConvertKit / SubscribeForm)
- [ ] Testimonial-Sektion aktivieren

### Dieser Monat:
- [ ] Live-Workshop planen (Zoom/YouTube)
- [ ] Freelancer-Track-Curriculum (Business-Modul)
- [ ] SEO-Audit + Content-Plan für Blog

---

**Letzte Aktualisierung:** 2026-05-11 (Mai-Sprint synchronisiert: 47 Lektionen, Ethereal Glass, Admin-CMS, Discord-Login, Auto-Research-Pipeline, Free-Tier aktiv)
**Major Updates seit Feb:**
- Cittasana Ethereal Glass Design (ace7d83)
- 14 neue Lektionen + Local Video Provider (15e9828)
- Admin-CMS Migration für 11 Content-Types (aa04ada)
- Discord-Login + Support-Tickets (80c589a)
- Auto-Agent-Pipeline mit weekly-research-v2 (b898c91)
- Challenge-System Null-Safety-Fix (419987f, heute)
