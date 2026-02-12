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

**Herkömmlicher Workflow**:
```
Du: "Implementiere Feature X"
Claude: "Okay, erstellt Code..."
Du: "Jetzt Feature Y"
Claude: "Okay... warte, was war nochmal die Architektur von X?"
Du: *frustriert* "Du hast das doch gerade erst gemacht!"
```

### GSD's Lösung

**Spec-Driven Development** mit **Context Engineering**:
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
```bash
npx get-shit-done-cc --claude --global
```

#### Variante 2: Global Install
```bash
npm install -g get-shit-done-cc
```

#### Variante 3: Als MCP Server
```bash
git clone https://github.com/glittercowboy/get-shit-done
cd get-shit-done
npm install
```

---

### Quick Start

#### 1. **Projekt initialisieren**
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

```bash
# Eigenes Spec-Template erstellen
gsd template create "api-endpoint"

# Template editieren
# .gsd/templates/api-endpoint.md
```

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
