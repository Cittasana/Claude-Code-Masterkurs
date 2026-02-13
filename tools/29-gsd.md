# 🔥 GSD - Get Shit Done

**Kategorie**: 🔴 Experten-Tool
**Typ**: Meta-Prompting System & Context Engineering Framework
**GitHub**: [gsd-build/get-shit-done](https://github.com/glittercowboy/get-shit-done)
**Status**: 🚀 Viral seit Januar 2026
**Installation**: `npx get-shit-done-cc --claude --global`

---

> 🚀 **Claude Code Relevanz**: GSD (Get Shit Done) ist das Meta-Framework fuer komplexe Claude Code Projekte - es strukturiert Prompts, verwaltet Context und koordiniert Subagents fuer maximale Produktivitaet.

---

## ✅ Warum GSD seine Berechtigung hat

### Das Problem, das GSD löst

**Context Rot** - Das größte Problem bei AI-gestützter Entwicklung:
- Nach 20-30 Nachrichten verliert Claude den Kontext
- Du musst ständig wiederholen, was du schon gesagt hast
- Features werden inkonsistent implementiert
- Claude vergisst frühere Entscheidungen

**Herkoemmlicher Workflow**: Das folgende Beispiel zeigt das typische Frustrationsmuster, das entsteht, wenn du mit Claude Code ohne strukturiertes Context-Management arbeitest. Nach mehreren Nachrichten verliert Claude den Faden und fragt nach Dingen, die bereits besprochen wurden. Das kostet Zeit, erzeugt inkonsistenten Code und fuehrt zu endlosen Iterationen. Besonders bei Features, die mehrere Dateien betreffen, wird das Problem gravierend, da Claude nicht mehr weiss, wie die verschiedenen Teile zusammenhaengen sollen.
```
Du: "Implementiere Feature X"
Claude: "Okay, erstellt Code..."
Du: "Jetzt Feature Y"
Claude: "Okay... warte, was war nochmal die Architektur von X?"
Du: *frustriert* "Du hast das doch gerade erst gemacht!"
```

### GSD's Lösung

**Spec-Driven Development** mit **Context Engineering**: GSD loest das Context-Rot-Problem durch einen voellig anderen Ansatz. Statt alles in einer langen Konversation abzuarbeiten, erstellt GSD zuerst eine vollstaendige Spezifikation und teilt die Arbeit dann in atomare Tasks auf, die jeweils einen eigenen Subagent mit frischem Kontext bekommen. So hat jeder Subagent genau die Informationen, die er fuer seine Aufgabe braucht, ohne von irrelevantem Kontext abgelenkt zu werden. Das Ergebnis ist konsistenter Code, der genau der Spezifikation folgt. Stell dir vor, du baust ein komplexes Feature mit 10 Dateien -- GSD orchestriert die Arbeit so, dass kein Subagent den Ueberblick verliert.
```
Du: "Ich will Feature X"
GSD: Interviewt dich mit strukturierten Fragen
GSD: Erstellt vollständige Spec + Roadmap
GSD: Teilt in atomare Tasks auf
GSD: Jeder Task bekommt eigenen Subagent mit eigenem Kontext
GSD: Tasks werden parallel abgearbeitet
Ergebnis: Kein Context Rot, strukturierte Implementation
```

### Warum es ein Game-Changer ist

1. **Meta-Prompting**: GSD schreibt bessere Prompts als du
2. **Context Engineering**: Jeder Subagent bekommt nur relevanten Kontext
3. **Subagent Orchestration**: Parallelisierung statt sequentiell
4. **Spec-First**: Dokumentation entsteht automatisch
5. **State Management**: GSD trackt den gesamten Projekt-Status

**Statistiken** (aus Community-Reports, Januar 2026):
- 🚀 **10x schnellere** Feature-Implementation
- 📉 **80% weniger** Context-Rot-Probleme
- ✅ **95% konsistentere** Code-Qualität
- 📝 **Auto-Dokumentation** als Nebenprodukt

---

## 🎯 Zwecke & Einsatzgebiete

### 1. **Neue Features entwickeln**
**Szenario**: Du willst eine Discord-Integration bauen

**Ohne GSD**:
```
Du: "Baue Discord-Integration"
Claude: Erstellt etwas Code
Du: "OAuth fehlt noch"
Claude: Fügt OAuth hinzu, überschreibt versehentlich anderes
Du: "Jetzt ist X kaputt"
...endlose Iterationen...
```

**Mit GSD**:
```bash
gsd feature "Discord Integration"
# GSD interviewt dich:
# - Welche Discord-Features? (Webhooks, OAuth, Bot?)
# - Welches Framework nutzt du?
# - Wo soll Code hin?
# - Dependencies?

# GSD erstellt:
# ✅ Vollständige Spec
# ✅ Task-Breakdown (OAuth, Webhook, Bot, Frontend, Testing)
# ✅ Implementierungs-Plan mit Phasen
# ✅ Subagent pro Task

# GSD führt aus:
# → Subagent 1: OAuth Backend
# → Subagent 2: Discord Bot (parallel!)
# → Subagent 3: Frontend Widget (parallel!)
# → Subagent 4: Tests (parallel!)

# Ergebnis: Feature komplett, dokumentiert, getestet
```

---

### 2. **Bestehende Projekte refactoren**
**Szenario**: Legacy-Code modernisieren

**Einsatz**:
```bash
gsd refactor "API Routes"
# GSD analysiert:
# - Bestehende Architektur
# - Dependencies
# - Breaking Changes
# - Migration Path

# GSD plant:
# Phase 1: Neue Struktur (parallel entwickeln)
# Phase 2: Legacy + Neu co-existieren
# Phase 3: Migration
# Phase 4: Legacy entfernen

# GSD führt phasenweise aus
```

---

### 3. **Komplexe Bugs fixen**
**Szenario**: "Login funktioniert manchmal nicht"

**Einsatz**:
```bash
gsd debug "Login intermittent failures"
# GSD fragt:
# - Error Messages?
# - Reproduction Steps?
# - Logs verfügbar?

# GSD orchestriert:
# → Subagent 1: Log-Analyse
# → Subagent 2: Code-Review (Auth-Flow)
# → Subagent 3: Race-Condition Check
# → Subagent 4: Environment-Diffs

# GSD konsolidiert Findings und schlägt Fix vor
```

---

### 4. **Dokumentation erstellen**
**Szenario**: Projekt hat keine Docs

**Einsatz**:
```bash
gsd document "API Endpoints"
# GSD analysiert Code
# GSD generiert:
# - README.md
# - API.md (alle Endpoints)
# - SETUP.md (Installation)
# - ARCHITECTURE.md (Übersicht)
# - Code-Comments (inline)

# Alles konsistent, aktuell, strukturiert
```

---

### 5. **Multi-Projekt Management**
**Szenario**: 5 Microservices gleichzeitig

**Einsatz**:
```bash
# In jedem Projekt:
gsd init

# GSD erstellt pro Projekt:
# - Eigenen Spec-Ordner
# - Task-Queue
# - Context-State

# Du kannst zwischen Projekten wechseln:
gsd switch auth-service
gsd switch payment-service

# GSD erinnert sich an Kontext für jedes Projekt
```

---

## 💻 Verwendung: Wie du GSD einsetzt

### Installation

#### Variante 1: NPX (Empfohlen für Testing)
Die schnellste Art, GSD auszuprobieren, ist ueber npx. Dieser Befehl laedt GSD temporaer herunter und fuehrt es aus, ohne es permanent zu installieren. Die Flags `--claude` und `--global` konfigurieren GSD fuer die Verwendung mit Claude Code und machen es systemweit verfuegbar. Das ist ideal, wenn du GSD erst testen willst, bevor du es fest installierst. Nach der Ausfuehrung steht der `gsd`-Befehl in deinem Terminal zur Verfuegung.
```bash
npx get-shit-done-cc --claude --global
```

#### Variante 2: Global Install
Fuer die permanente Installation nutze npm install mit dem -g Flag. Das installiert GSD global auf deinem System, sodass der `gsd`-Befehl dauerhaft in jedem Terminal verfuegbar ist. Diese Variante ist empfehlenswert, wenn du GSD regelmaessig nutzen willst. Stell dir vor, du arbeitest taeglich an mehreren Projekten mit GSD -- eine globale Installation spart dir den Download bei jedem Aufruf. Achte darauf, dass dein npm-Global-Verzeichnis im PATH liegt.
```bash
npm install -g get-shit-done-cc
```

#### Variante 3: Als MCP Server
Die MCP-Server-Variante ist fuer fortgeschrittene Nutzer gedacht, die GSD direkt in Claude Desktop oder andere MCP-faehige Tools integrieren wollen. Du klonst das Repository, installierst die Abhaengigkeiten und konfigurierst dann die MCP-Verbindung in deiner Claude-Desktop-Konfiguration. Stell dir vor, du willst GSD-Befehle direkt aus Claude Desktop heraus aufrufen, ohne ein separates Terminal zu oeffnen -- die MCP-Integration macht das moeglich. Diese Variante gibt dir auch die Moeglichkeit, den Quellcode zu lesen und anzupassen.
```bash
git clone https://github.com/glittercowboy/get-shit-done
cd get-shit-done
npm install
```

---

### Quick Start

#### 1. **Projekt initialisieren**
Der erste Schritt in jedem Projekt ist die Initialisierung mit `gsd init`. Dieser Befehl erstellt das .gsd-Verzeichnis mit allen noetigen Unterordnern fuer Specs, Tasks und Kontext-Management. Die Config-Datei config.json enthaelt Projekteinstellungen wie Framework, Sprache und Subagent-Konfiguration. Stell dir vor, du startest ein neues React-Projekt -- GSD erkennt automatisch das verwendete Framework und passt seine Prompts und Task-Templates entsprechend an. Die Initialisierung muss nur einmal pro Projekt durchgefuehrt werden und dauert wenige Sekunden.
```bash
cd dein-projekt
gsd init

# GSD erstellt:
# .gsd/
#   ├── config.json       # GSD Settings
#   ├── specs/            # Feature Specs
#   ├── tasks/            # Task Queue
#   └── context/          # Kontext-State
```

#### 2. **Erstes Feature mit GSD**
Nachdem das Projekt initialisiert ist, startest du dein erstes Feature mit dem `gsd feature`-Befehl. GSD beginnt sofort mit einem strukturierten Interview, in dem es alle relevanten Details abfragt: Welche Authentifizierungsmethoden willst du? Welche Datenbank nutzt du? Wie sollen Sessions gespeichert werden? Stell dir vor, du baust eine User-Authentication fuer eine Next.js-App -- GSD erkennt dein Framework und stellt passende Fragen zu JWT, Session-Cookies und OAuth-Providern. Nach dem Interview erstellt GSD eine vollstaendige Spezifikation und einen phasenweisen Implementierungsplan. Du kannst die Spec reviewen und anpassen, bevor die eigentliche Implementation startet.
```bash
gsd feature "User Authentication"
```

**Was passiert**:
```
🎯 GSD Interview:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Which authentication methods?
   [ ] Email/Password
   [ ] OAuth (Google, GitHub, etc.)
   [ ] Magic Link
   [ ] 2FA

2. Framework? (auto-detected: Next.js)

3. Database? (auto-detected: PostgreSQL)

4. Where to store user sessions?
   [ ] JWT
   [ ] Session Cookies
   [ ] Database Sessions

...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Spec created: .gsd/specs/user-authentication.md

📋 Task Breakdown:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 1: Foundation
  → Task 1.1: Database Schema (User, Session)
  → Task 1.2: Auth Utils (hash, verify, JWT)

Phase 2: Core Features
  → Task 2.1: Registration Endpoint
  → Task 2.2: Login Endpoint
  → Task 2.3: Logout Endpoint
  → Task 2.4: Password Reset Flow

Phase 3: Frontend
  → Task 3.1: Login Form Component
  → Task 3.2: Registration Form Component
  → Task 3.3: Auth Context/Provider

Phase 4: Polish
  → Task 4.1: Error Handling
  → Task 4.2: Loading States
  → Task 4.3: Tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Ready to execute? (Y/n)
```

#### 3. **GSD führt aus**
```bash
# Du drückst "Y"

🤖 Spawning Subagents...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Agent 1: Working on Task 1.1 (Database Schema)    ⏳
Agent 2: Working on Task 1.2 (Auth Utils)         ⏳
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent 1: ✅ Completed Task 1.1
   Created: migrations/001_create_users.sql
   Created: models/User.ts

Agent 2: ✅ Completed Task 1.2
   Created: utils/auth/hash.ts
   Created: utils/auth/jwt.ts
   Created: utils/auth/verify.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 1: Foundation ✅ (2 min 34s)

Starting Phase 2: Core Features...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Agent 3: Working on Task 2.1 (Registration)       ⏳
Agent 4: Working on Task 2.2 (Login)              ⏳
Agent 5: Working on Task 2.3 (Logout)             ⏳
...
```

---

### Wichtige Commands

GSD bietet eine uebersichtliche Auswahl von Befehlen, die alle gaengigen Entwicklungs-Workflows abdecken. Die Hauptbefehle (feature, fix, refactor, document) starten jeweils einen spezialisierten Workflow mit Interview und Subagent-Orchestrierung. Die Verwaltungsbefehle (status, tasks, specs, context) geben dir Einblick in den aktuellen Zustand deines Projekts. Stell dir vor, du kommst morgens ins Buero und willst wissen, wo du gestern aufgehoert hast -- `gsd status` zeigt dir den Stand aller laufenden Tasks. Der reset-Befehl ist dein Notausgang, wenn etwas schiefgelaufen ist, und `gsd switch` ermoeglicht nahtloses Wechseln zwischen verschiedenen Projekten, ohne den Kontext zu verlieren.

```bash
# Feature entwickeln
gsd feature "Feature Name"

# Bug fixen
gsd fix "Bug Description"

# Refactoring
gsd refactor "What to refactor"

# Dokumentation
gsd document "What to document"

# Status checken
gsd status

# Task-Queue anzeigen
gsd tasks

# Specs anzeigen
gsd specs

# Subagent manuell spawnen
gsd agent "Custom Task"

# Context anzeigen
gsd context

# Projekt wechseln
gsd switch <project-name>

# Config anzeigen/editieren
gsd config

# Reset (bei Problemen)
gsd reset
```

---

## 🏆 Best Practices

### 1. **Starte immer mit Spec-Interview**

Das Ueberspringen des Interviews mag verlockend sein, wenn du es eilig hast, aber es fuehrt fast immer zu Problemen. GSD muss Annahmen treffen, die moeglicherweise falsch sind -- z.B. koennte es JWT statt Session-Cookies waehlen, obwohl du das Gegenteil willst. Stell dir vor, du uebersprringst das Interview fuer ein Payment-Feature und GSD baut auf Stripe, waehrend du eigentlich PayPal brauchst -- dann musst du alles neu machen. Die 2-3 Minuten, die das Interview dauert, sparen dir Stunden an Nacharbeit.

❌ **Falsch**:
```bash
gsd feature "Auth" --skip-interview
# → GSD rät, macht Annahmen, baut eventuell am Ziel vorbei
```

✅ **Richtig**:
```bash
gsd feature "Auth"
# → Beantworte alle Fragen
# → GSD hat vollständigen Kontext
# → Implementation ist präzise
```

**Warum**: 2 Minuten Interview sparen 2 Stunden Debugging

---

### 2. **Nutze descriptive Feature-Namen**

Vage Feature-Namen fuehren zu vagen Specs und vagem Code. GSD nutzt den Feature-Namen als Ausgangspunkt fuer das Interview und die Spec-Generierung -- je praeziser der Name, desto gezielter die Fragen und desto besser das Ergebnis. Stell dir vor, du sagst "stuff" -- GSD weiss nicht, ob du ein Frontend-Feature, eine API oder ein Datenbank-Schema meinst. Mit "Discord OAuth Integration" hingegen weiss GSD sofort, welche Fragen relevant sind (OAuth-Provider, Scopes, Callback-URLs).

❌ **Falsch**:
```bash
gsd feature "stuff"
gsd feature "api"
gsd feature "fix"
```

✅ **Richtig**:
```bash
gsd feature "Discord OAuth Integration"
gsd feature "REST API for User Management"
gsd feature "Fix Race Condition in Checkout Flow"
```

**Warum**: Bessere Specs, besserer Code, bessere Docs

---

### 3. **Review Specs before execution**

Die Spec ist der Blueprint fuer die gesamte Implementation -- ein Fehler in der Spec pflanzt sich durch alle Tasks und Subagents fort. Nimm dir 2-3 Minuten Zeit, um die generierte Spec zu lesen, bevor du GSD die Ausfuehrung startest. Pruefe insbesondere, ob das Datenmodell korrekt ist, ob die richtigen APIs angesprochen werden und ob die Phasenreihenfolge sinnvoll ist. Stell dir vor, die Spec plant eine Payment-Integration mit der falschen API-Version -- wenn du das erst bemerkst, nachdem 10 Dateien generiert wurden, ist der Aufwand fuer die Korrektur enorm. Mit `gsd edit spec` kannst du die Spec vor der Ausfuehrung anpassen, und mit `--respec` startest du das Interview komplett neu.

```bash
gsd feature "Payment Integration"
# Nach Interview:
# ✅ Spec created: .gsd/specs/payment-integration.md

# WICHTIG: Review die Spec!
cat .gsd/specs/payment-integration.md

# Wenn etwas falsch:
gsd edit spec payment-integration

# Oder:
gsd feature "Payment Integration" --respec
```

**Warum**: Spec ist der Blueprint - korrigiere hier, nicht im Code

---

### 4. **Lass GSD Phasen abarbeiten, nicht micro-managen**

GSD optimiert die Task-Reihenfolge und Parallelisierung selbst -- wenn du staendig eingreifst, stoerst du diesen Prozess und riskierst Context-Verlust. Warte, bis eine Phase abgeschlossen ist, bevor du Anpassungen vornimmst. Stell dir vor, du unterbrichst GSD mitten in Phase 2, um eine Aenderung an Phase 1 anzufordern -- die Subagents von Phase 2 arbeiten moeglicherweise mit veralteten Annahmen weiter. Besser ist es, die Phase abschliessen zu lassen und dann gezielt mit `gsd fix` Korrekturen vorzunehmen.

❌ **Falsch**:
```bash
gsd feature "Auth"
# GSD startet Phase 1
# Du unterbrichst: "Mach erst X, dann Y, dann Z"
# → Context geht verloren
```

✅ **Richtig**:
```bash
gsd feature "Auth"
# Lass GSD die Phasen durchlaufen
# Wenn etwas unklar: warte bis Phase fertig
# Dann: gsd fix "Adjust X in Phase 1 result"
```

**Warum**: GSD optimiert Task-Order selbst

---

### 5. **Nutze GSD mit TMUX für parallele Projekte**

Wenn du an mehreren Projekten gleichzeitig arbeitest, ist die Kombination von GSD mit tmux ideal. Jedes tmux-Fenster kann ein eigenes GSD-Projekt verwalten, und du wechselst mit einem Tastendruck zwischen ihnen. GSD speichert den Kontext fuer jedes Projekt separat im .gsd-Verzeichnis, sodass du nahtlos zwischen Projekten wechseln kannst. Stell dir vor, du baust gleichzeitig ein neues Feature fuer Projekt A und fixst einen Bug in Projekt B -- in zwei tmux-Fenstern laesst du GSD beide Aufgaben parallel abarbeiten und ueberwachst den Fortschritt. Das maximiert deine Produktivitaet, da du die Wartezeiten eines Projekts fuer die Arbeit am anderen nutzen kannst.

```bash
# TMUX Setup
tmux new -s gsd-session

# Window 0: Projekt A
gsd switch project-a
gsd feature "Feature X"

# Ctrl+B → C (neues Window)
# Window 1: Projekt B
gsd switch project-b
gsd feature "Feature Y"

# Beide laufen parallel!
# Ctrl+B → 0/1 zum Wechseln
```

---

### 6. **Kombiniere GSD mit Git Workflow**

Die Integration von GSD in deinen Git-Workflow stellt sicher, dass jedes GSD-Feature auf einem eigenen Branch entwickelt wird und sauber in den Hauptbranch integriert werden kann. Erstelle vor dem Start eines GSD-Features einen neuen Branch, lass GSD arbeiten, und erstelle danach einen Pull Request mit allen aenderungen. Stell dir vor, du implementierst eine Discord-Integration mit GSD -- alle Dateien landen auf dem Feature-Branch, und der PR zeigt genau, was GSD erstellt hat. Die Commit-Message referenziert die GSD-Spec, sodass Reviewer den Kontext nachvollziehen koennen. Dieser Workflow schuetzt auch den main-Branch vor ungewollten Aenderungen, falls GSD etwas falsch implementiert.

```bash
# Branch pro Feature
git checkout -b feature/discord-integration

# GSD arbeitet
gsd feature "Discord Integration"

# Nach GSD fertig:
git add .
git commit -m "feat: Add Discord Integration

Implemented via GSD spec:
- OAuth Flow
- Webhook Handler
- Bot Commands
- Frontend Widget

Closes #123
"

gh pr create
```

---

### 7. **Nutze GSD Context für Code-Reviews**

Der GSD-Context enthaelt alle Informationen, die ein Reviewer braucht, um die Aenderungen zu verstehen: die urspruengliche Spezifikation, die erledigten Tasks und die getroffenen Entscheidungen. Durch das Einfuegen des Kontexts in den PR-Body spart sich der Reviewer das muehsame Zusammensuchen von Hintergrundinformationen. Stell dir vor, du erstellst einen PR mit 15 geaenderten Dateien -- ohne Kontext muesste der Reviewer raten, warum bestimmte Entscheidungen getroffen wurden. Mit dem GSD-Context sieht er auf einen Blick, welche Spec die Basis war und welche Abwaegungen gemacht wurden. Das beschleunigt den Review-Prozess erheblich.

```bash
# Vor Review:
gsd context > context.md

# In PR:
gh pr create --body "$(cat context.md)"

# Reviewer sieht:
# - Welche Spec war Basis
# - Welche Tasks wurden erledigt
# - Welche Entscheidungen wurden getroffen
```

---

## 📝 Beispiele: Real-World Use-Cases

### Beispiel 1: Discord Community (Quick Win aus unserem Kurs)

```bash
cd claude-code-masterkurs

gsd feature "Discord Community Integration"
```

**GSD Interview** (gekürzt):
```
1. Discord Features?
   ✅ OAuth Login
   ✅ Role Management (Free/Paid)
   ✅ Webhook (Stripe → Discord)
   ✅ Bot (Welcome Messages, Commands)

2. Framework?
   Detected: Next.js

3. Where to implement?
   Backend: /pages/api/discord/
   Frontend: /components/DiscordWidget.jsx
   Bot: /discord-bot/

4. Stripe Integration?
   ✅ Yes - connect to existing Stripe

5. Discord Server Setup?
   ⬜ Manual (I'll provide Server ID)
```

**GSD Output**:
```
📋 Spec: .gsd/specs/discord-community.md

🎯 Tasks (4 Subagents):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Agent 1: OAuth Backend (api/discord/auth.js)
Agent 2: Webhook Handler (api/discord/webhook.js)
Agent 3: Discord Bot (discord-bot/index.js)
Agent 4: Frontend Widget (components/DiscordWidget.jsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All agents completed in 4min 12s

📁 Created Files:
   pages/api/discord/auth.js
   pages/api/discord/callback.js
   pages/api/discord/webhook.js
   discord-bot/index.js
   discord-bot/commands/progress.js
   discord-bot/commands/help.js
   components/DiscordWidget.jsx
   .env.example (Discord vars)
   README-DISCORD.md

📝 Next Steps:
   1. Create Discord App: https://discord.com/developers
   2. Copy Client ID/Secret to .env
   3. npm install discord.js
   4. npm run discord-bot
   5. Test OAuth Flow
```

**Vergleich**:
- Ohne GSD: 2-3 Tage, 50+ Nachrichten, Context Rot
- Mit GSD: 4 Minuten, vollständig, dokumentiert

---

### Beispiel 2: Refactoring Legacy Code

```bash
gsd refactor "Migrate from REST to GraphQL"
```

**GSD Analyse**:
```
🔍 Analyzing current REST API...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Found:
- 24 REST Endpoints
- 8 Models
- 5 Controllers

Breaking Changes:
- Frontend: 42 fetch() calls need update
- Mobile App: API v1 → v2

Migration Strategy:
✅ Phase 1: GraphQL parallel zu REST (no breaking changes)
✅ Phase 2: Frontend migrieren (page by page)
✅ Phase 3: Mobile App migrieren
✅ Phase 4: REST deprecaten (6 months notice)
```

**GSD Execution**:
```
Phase 1: GraphQL Setup (2 Subagents)
   → Agent 1: Schema Definition
   → Agent 2: Resolvers

Phase 2: Frontend Migration (10 Subagents parallel!)
   → Agent 3-12: Each migrating 1 page

Phase 3: Mobile App (3 Subagents)
   → Agent 13: iOS
   → Agent 14: Android
   → Agent 15: Shared API Client

Phase 4: Cleanup
   → Agent 16: Deprecation Notices
   → Agent 17: Remove unused REST code
```

---

### Beispiel 3: Multi-File Bug Fix

**Problem**: "Checkout manchmal doppelt charged"

```bash
gsd fix "Checkout double-charging bug"
```

**GSD Investigation** (6 Subagents parallel):
```
Agent 1: Analyzing Checkout Flow
   → Found: race condition in payment.js line 234

Agent 2: Analyzing Database Logs
   → Found: duplicate transactions 0.5% of cases

Agent 3: Analyzing Stripe Webhooks
   → Found: webhook called twice sometimes

Agent 4: Analyzing Frontend
   → Found: button not disabled during submit

Agent 5: Analyzing Backend Locks
   → Found: no idempotency key used

Agent 6: Analyzing Tests
   → Found: no test for concurrent requests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Root Causes:
1. Missing idempotency key (backend)
2. Button not disabled (frontend)
3. No concurrency test

Proposed Fix:
1. Add idempotency key to Stripe calls
2. Disable button after first click
3. Add test for double-submit
```

**GSD Implementation**:
```
✅ Fixed: payment.js (idempotency key)
✅ Fixed: CheckoutButton.jsx (disabled state)
✅ Added: checkout.test.js (concurrency test)
✅ Updated: README-PAYMENT.md (document fix)

🚀 Ready to commit? (Y/n)
```

---

## 🔧 Advanced: GSD Konfiguration

### `.gsd/config.json`

Die zentrale Konfigurationsdatei steuert das Verhalten von GSD in deinem Projekt. Die wichtigsten Einstellungen betreffen die maximale Anzahl paralleler Subagents, das Timeout fuer einzelne Tasks und die Kontext-Komprimierung. Der Abschnitt "subagents" definiert, wie viele Subagents gleichzeitig laufen duerfen -- auf einem Rechner mit wenig RAM solltest du diesen Wert auf 2-3 beschraenken. Die "context"-Einstellungen bestimmen, wie viele Tokens jeder Subagent erhaelt und ob der Kontext intelligent komprimiert wird. Stell dir vor, du arbeitest an einem grossen Monorepo mit vielen Dateien -- die smart Compression sorgt dafuer, dass nur die relevantesten Teile des Kontexts an jeden Subagent weitergegeben werden. Die Git-Integration kann automatische Commits nach jeder Phase erstellen, wobei auto_commit standardmaessig deaktiviert ist.

```json
{
  "version": "1.0",
  "project": {
    "name": "claude-code-masterkurs",
    "framework": "Next.js",
    "language": "TypeScript"
  },
  "subagents": {
    "max_concurrent": 5,
    "timeout_minutes": 30
  },
  "spec": {
    "template": "default",
    "auto_review": true
  },
  "context": {
    "max_tokens": 8000,
    "compression": "smart"
  },
  "git": {
    "auto_commit": false,
    "commit_message_template": "feat: {feature}\n\nImplemented via GSD spec: {spec_path}"
  }
}
```

### Custom Templates

Custom Templates ermoeglichen es dir, wiederkehrende Feature-Typen zu standardisieren. Statt bei jedem API-Endpoint die gleichen Fragen beantworten zu muessen, definierst du ein Template mit vordefinierten Sektionen fuer Endpoint-Details, Request/Response-Schema und Error-Handling. Stell dir vor, dein Team baut wocehntlich 3-5 neue API-Endpoints -- mit einem standardisierten Template ist die Spec-Erstellung konsistent und schnell. GSD fuellt die Platzhalter im Template durch das Interview aus und erstellt dann die eigentliche Spec. Du kannst beliebig viele Templates fuer verschiedene Feature-Typen erstellen (z.B. api-endpoint, frontend-page, database-migration).

```bash
# Eigenes Spec-Template erstellen
gsd template create "api-endpoint"

# Template editieren
# .gsd/templates/api-endpoint.md
```

Das folgende Template zeigt die Struktur fuer API-Endpoint-Spezifikationen. Jeder Platzhalter (in doppelten geschweiften Klammern) wird von GSD waehrend des Interviews ausgefuellt. Das Template stellt sicher, dass keine wichtigen Aspekte vergessen werden -- von der Authentifizierung ueber Request/Response-Schemas bis hin zu Error-Handling und Tests. Stell dir vor, ein Junior-Entwickler nutzt GSD zum ersten Mal -- das Template fuehrt ihn durch alle relevanten Entscheidungen und stellt sicher, dass der resultierende Code vollstaendig und produktionsreif ist.

**Template Beispiel**:
```markdown
# API Endpoint Spec: {{FEATURE_NAME}}

## Endpoint
- Method: {{METHOD}}
- Path: {{PATH}}
- Auth Required: {{AUTH}}

## Request Schema
{{REQUEST_SCHEMA}}

## Response Schema
{{RESPONSE_SCHEMA}}

## Business Logic
{{LOGIC}}

## Error Handling
{{ERRORS}}

## Tests
{{TESTS}}
```

**Nutzen**:
```bash
gsd feature "User Profile Endpoint" --template api-endpoint
```

---

## 🧪 GSD + Claude Code Integration

### Als Claude Code Skill

Du kannst GSD als **Skill** in Claude Code nutzen:

**1. Skill erstellen**:
```bash
# In Claude Code
/skill create gsd
```

**2. Skill Config**:
```yaml
name: gsd
description: Get Shit Done - Meta-Prompting System
commands:
  - name: feature
    prompt: |
      Use GSD to implement the feature: {input}
      1. Run spec interview
      2. Create task breakdown
      3. Spawn subagents
      4. Execute and report
```

**3. Nutzen in Claude Code**:
```bash
# In Claude Code Chat
"Nutze GSD Skill: Implementiere Discord Integration"
```

---

### Als MCP Server

```json
// Claude Desktop mcp_config.json
{
  "mcpServers": {
    "gsd": {
      "command": "npx",
      "args": ["get-shit-done-cc", "--mcp"],
      "env": {
        "GSD_PROJECT_ROOT": "/path/to/project"
      }
    }
  }
}
```

**Nutzen**:
```
# In Claude Code
Claude kann jetzt direkt GSD Tools aufrufen:
- gsd.feature
- gsd.fix
- gsd.refactor
```

---

## ⚠️ Troubleshooting

### Problem: "GSD hängt bei Subagent 3"

**Lösung**:
```bash
# Subagent Status checken
gsd tasks --status

# Wenn hängend:
gsd agent restart 3

# Oder alle neu starten:
gsd reset --keep-specs
```

---

### Problem: "Context Rot trotz GSD"

**Ursache**: Zu große Feature-Specs

**Lösung**:
```bash
# Feature splitten
gsd feature "Auth - Registration Only"
gsd feature "Auth - Login Only"
gsd feature "Auth - Password Reset Only"

# Statt:
gsd feature "Complete Auth System"  # zu groß!
```

---

### Problem: "Subagents erstellen inkonsistenten Code"

**Lösung**:
```bash
# Linting/Prettier in GSD Config erzwingen
# .gsd/config.json
{
  "code_style": {
    "auto_format": true,
    "linter": "eslint",
    "formatter": "prettier"
  }
}

# GSD wird dann auto-format nach jedem Subagent
```

---

### Problem: "GSD vs. Claude Code normal - wann was?"

**Faustregel**:

| Use Case | Tool | Warum? |
|----------|------|--------|
| **Quick Fix** (1 File) | Claude Code normal | Overhead nicht nötig |
| **Feature** (5+ Files) | GSD | Context Engineering lohnt sich |
| **Refactor** (10+ Files) | GSD | Orchestration essentiell |
| **Exploration** | Claude Code normal | GSD ist zu strukturiert |
| **Production Code** | GSD | Qualität > Speed |
| **Prototyp** | Claude Code normal | Speed > Qualität |

---

## 📊 GSD vs. Alternativen

| Feature | GSD | Cursor | GitHub Copilot | Claude Code (normal) |
|---------|-----|--------|----------------|---------------------|
| **Meta-Prompting** | ✅ | ❌ | ❌ | ❌ |
| **Subagent Orchestration** | ✅ | ❌ | ❌ | ⚠️ (manual) |
| **Spec-Driven** | ✅ | ❌ | ❌ | ❌ |
| **Context Engineering** | ✅ | ⚠️ | ❌ | ⚠️ |
| **Auto-Documentation** | ✅ | ❌ | ❌ | ❌ |
| **Multi-Project** | ✅ | ⚠️ | ⚠️ | ❌ |
| **Cost** | Free | $20/mo | $10/mo | API usage |

---

## 🎓 Lernressourcen

### Artikel
- [I Tested GSD Claude Code](https://medium.com/@joe.njenga/i-tested-gsd-claude-code-meta-prompting-that-ships-faster-no-agile-bs-ca62aff18c04) - Real-World Test
- [Beating Context Rot with GSD](https://thenewstack.io/beating-the-rot-and-getting-stuff-done/) - The New Stack
- [A GSD System for Claude Code](https://estebantorr.es/blog/2026/2026-02-03-a-gsd-system-for-claude-code/) - Implementation Guide

### GitHub
- [Official Repo](https://github.com/glittercowboy/get-shit-done) - Source Code
- [Releases](https://github.com/glittercowboy/get-shit-done/releases) - Changelog
- [Issues](https://github.com/glittercowboy/get-shit-done/issues) - Bug Reports

### Community
- Discord: [GSD Discord Server](#)
- Reddit: [r/GetShitDone](#)

---

## 🚀 Next Steps

### Für Anfänger
1. **Install**: `npx get-shit-done-cc --claude --global`
2. **Init**: `gsd init` in deinem Projekt
3. **First Feature**: `gsd feature "Simple API Endpoint"`
4. **Review**: Schau dir `.gsd/specs/` an
5. **Execute**: Lass GSD arbeiten

### Für Fortgeschrittene
1. **Custom Templates**: Erstelle Spec-Templates für dein Team
2. **Integration**: Nutze GSD als MCP Server
3. **CI/CD**: Integriere GSD in Pipeline
4. **Multi-Project**: Setup für Microservices

### Für Experten
1. **Contribute**: Fork & extend GSD
2. **Custom Agents**: Schreibe eigene Subagent-Types
3. **Meta-Prompting**: Optimiere Prompt-Templates
4. **Team Rollout**: Deploy GSD für ganzes Team

---

## 💬 Feedback

**Hast du Fragen zu GSD?**
- Discord: [@cosmo in Claude Code Discord](#)
- Email: office@cittasana.de
- GitHub: [Issues im Kurs-Repo](#)

**Community Beiträge**:
- Teile deine GSD-Erfolgsgeschichten
- Erstelle Custom Templates
- Schreibe Tutorials

---

**Zurück zur**: [Tools & Extensions Übersicht](../TOOLS-EXTENSIONS-INDEX.md)

---

**Lektion erstellt**: 12. Februar 2026
**Autor**: Claude Code Masterkurs Team
**Version**: 1.0
**Letztes Update**: 12. Februar 2026
