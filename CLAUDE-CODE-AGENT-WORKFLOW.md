# 🤖 Claude Code + Agent Teams - Praktischer Workflow-Guide

**Zweck**: Schritt-für-Schritt-Anleitung, wie du die Quick Wins mit Claude Code Agent Teams umsetzt
**Wichtig**: Agents sind NICHT dasselbe wie Claude Code normal - hier erfährst du den Unterschied!

---

## 🎯 Was sind Agent Teams?

**Claude Code hat 2 Modi**:
1. **Normaler Chat** (du) ↔ Claude Code
2. **Agent Teams** (du) → Agent → selbstständige Arbeit

### Agent Teams = Task Tool

**Was ein Agent ist**:
- Separater "Sub-Claude" der selbstständig arbeitet
- Hat eigene Tools (Bash, Edit, Write, Read, etc.)
- Arbeitet autonom an einer Aufgabe
- Gibt am Ende Ergebnis zurück

**Wann Agent nutzen**:
✅ Große, mehrstufige Tasks (z.B. "Implementiere Discord-Integration")
✅ Codebase-Exploration (z.B. "Finde alle API-Endpoints")
✅ Lange Tasks, die mehrere Schritte brauchen
✅ Tasks, die du parallel laufen lassen willst

**Wann NICHT Agent nutzen**:
❌ Einfache Fragen ("Was steht in CLAUDE.md?")
❌ Schnelle Edits (ein File ändern)
❌ Code-Review (besser selbst im Chat)
❌ Planung (besser im Hauptchat diskutieren)

---

## 📋 Der Workflow: Von Dokumenten zu Agent Teams

### Schritt 1: Claude Code starten (normaler Chat)

```bash
# In deinem Projekt-Ordner
cd ~/claude-code-masterkurs

# Claude Code starten
claude code
```

**Wichtig**: Du startest IMMER im normalen Chat-Modus, nicht direkt mit Agents!

---

### Schritt 2: Kontext geben (CLAUDE.md lesen lassen)

```
Prompt im normalen Chat:

"Lies die CLAUDE.md Datei in diesem Ordner.
Das ist das Projekt-Memory für meinen Claude Code Masterkurs.
Mach dich mit Zielen und Status vertraut."
```

**Was passiert**:
- Claude liest die Datei
- Versteht dein Projekt
- Kann jetzt informierte Entscheidungen treffen

---

### Schritt 3: Feature planen (mit dir zusammen)

```
Prompt im normalen Chat:

"Ich will die 3 Quick Wins aus UMSETZUNGSPLAN-QUICK-WINS.md umsetzen:
1. Discord-Integration
2. Founder Story
3. Free Tier

Lass uns mit Discord starten. Was sind die wichtigsten Steps?"
```

**Was passiert**:
- Claude analysiert UMSETZUNGSPLAN
- Erstellt Todo-Liste
- Bespricht mit dir den Plan
- **WICHTIG**: Noch KEIN Agent gestartet!

---

### Schritt 4: Agent Team spawnen (für Implementation)

**Jetzt kommt der Agent!**

```
Prompt im normalen Chat:

"Spawne einen Agent, der die Discord-Integration implementiert.

Der Agent soll:
1. UMSETZUNGSPLAN-QUICK-WINS.md lesen (Feature 1: Discord)
2. TECH-SPECS-COMMUNITY.md lesen (alle technischen Details)
3. Discord-Server-Setup durchführen
4. OAuth-Integration implementieren (Backend-Code)
5. Website-Widget erstellen (Frontend-Code)
6. Discord-Bot erstellen (Automation)

Nutze das Task-Tool mit subagent_type: general-purpose"
```

**Was passiert**:
- Claude spawned einen Agent
- Agent arbeitet autonom
- Du siehst Fortschritt
- Agent gibt am Ende Ergebnis zurück

---

### Schritt 5: Agent-Ergebnis reviewen

**Wenn Agent fertig ist**:
- Claude zeigt dir Zusammenfassung
- Du kannst Code reviewen
- Du kannst Änderungen anfordern
- Du kannst nächsten Agent starten

---

## 🔧 Konkrete Prompts für deine Quick Wins

### Feature 1: Discord-Integration

#### Option A: Alles in einem Agent (empfohlen für Anfang)

```
Spawne einen general-purpose Agent für Discord-Integration:

Aufgabe:
- Lies UMSETZUNGSPLAN-QUICK-WINS.md (Feature 1)
- Lies TECH-SPECS-COMMUNITY.md (komplette Specs)
- Erstelle Discord-Server-Setup-Guide (Markdown)
- Implementiere OAuth-Flow (Backend: routes/discord-auth.js)
- Erstelle Website-Widget (Frontend: components/DiscordWidget.jsx)
- Implementiere Discord-Bot (bot/index.js)
- Erstelle .env.example mit allen benötigten Variablen
- Schreibe README.md für Discord-Setup

Am Ende: Zeige mir, welche Files erstellt wurden und next steps.
```

#### Option B: Mehrere Agents parallel (mit TMUX)

```
# TMUX Session 1: Backend
Spawne einen Agent für Discord-Backend:

Aufgabe:
- Lies TECH-SPECS-COMMUNITY.md (OAuth-Abschnitt)
- Implementiere routes/discord-auth.js
- Implementiere Helper-Functions für Role-Management
- Erstelle Webhook-Handler für Stripe → Discord

# TMUX Session 2: Frontend (parallel!)
Spawne einen Agent für Discord-Frontend:

Aufgabe:
- Lies TECH-SPECS-COMMUNITY.md (Website-Integration)
- Erstelle DiscordWidget-Component
- Erstelle Connect-Button-Component
- Integriere in Dashboard

# TMUX Session 3: Bot (parallel!)
Spawne einen Agent für Discord-Bot:

Aufgabe:
- Lies TECH-SPECS-COMMUNITY.md (Bot-Abschnitt)
- Implementiere bot/index.js
- Erstelle Event-Handler (guildMemberAdd, messageCreate)
- Implementiere Slash-Commands (/progress, /help)
```

---

### Feature 2: Founder Story & Video

```
Spawne einen general-purpose Agent für Founder-Content:

Aufgabe:
- Lies UMSETZUNGSPLAN-QUICK-WINS.md (Feature 2)
- Generiere Video-Script basierend auf Template
- Erstelle erweiterte About-Page (Markdown → HTML)
- Erstelle Hero-Section-Component mit Video-Embed
- Schreibe Produktion-Checklist (Equipment, Setup, Editing)

Wichtig:
- Video-Script soll persönlich sein
- About-Page soll authentisch wirken
- Hero-Section responsive (Mobile + Desktop)

Am Ende: Gib mir finales Video-Script zum Review.
```

---

### Feature 3: Free Tier

```
Spawne einen general-purpose Agent für Free-Tier-Implementation:

Aufgabe:
- Lies UMSETZUNGSPLAN-QUICK-WINS.md (Feature 3)
- Implementiere Backend-Freischaltungs-Logik (lessons-config.js)
- Erstelle Landing-Page für Free Tier (/start-kostenlos)
- Implementiere Signup-Flow (nur Email, kein Payment)
- Erstelle Email-Automation (Willkommen + Drip-Campaign)
- Setup Analytics-Tracking (Free Signups, Completion-Rate)

Backend-Framework: [Dein Framework - z.B. Express.js/Next.js]
Frontend-Framework: [Dein Framework - z.B. React]

Am Ende: Zeige mir Flow-Diagramm (Free Signup → Lektion 1 → ... → Upgrade)
```

---

## 🎨 Skills in Agent-Prompts nutzen

**Du kannst Skills IN Agent-Prompts referenzieren!**

### Beispiel: Content-Creation mit Skill

```
Spawne einen Agent für Marketing-Content:

Aufgabe:
- Nutze den marketing:content-creation Skill
- Erstelle 5 Blog-Posts für SEO:
  1. "Claude Code Tutorial für Anfänger"
  2. "10 Claude Code Hacks für Produktivität"
  3. "Claude Code vs. GitHub Copilot"
  4. "Freelancing mit Claude Code"
  5. "Eigene SaaS mit Claude Code bauen"

Jeder Post:
- 1500 Wörter
- SEO-optimiert
- Code-Beispiele
- CTA: Free Tier Signup

Referenz für Brand Voice: CLAUDE.md

Am Ende: Zeige mir Titel + Meta-Descriptions aller Posts.
```

---

## 🚀 Parallel-Workflow mit TMUX + Agents

**Das ist die Power-Combo!**

### Setup: 3 Features parallel entwickeln

```bash
# TMUX Setup (mit unserem Script)
./tmux-setup.sh

# Window 0: Discord-Agent
# Im normalen Claude Code Chat:
Spawne Agent für Discord (siehe Option B oben)

# Window 1: Founder-Story-Agent
# Ctrl+B → 1
# Starte neue Claude Code Session
Spawne Agent für Founder-Content (siehe oben)

# Window 2: Free-Tier-Agent
# Ctrl+B → 2
# Starte neue Claude Code Session
Spawne Agent für Free Tier (siehe oben)

# Zwischen Windows wechseln: Ctrl+B → 0,1,2
# Alle 3 Agents arbeiten parallel!
```

**Ergebnis**: Alle 3 Quick Wins in parallel entwickelt! 🔥

---

## 📊 Agent-Management Best Practices

### 1. **Ein Agent = Eine klare Aufgabe**

✅ GUT:
```
"Implementiere Discord OAuth-Flow
 Nutze TECH-SPECS-COMMUNITY.md als Referenz"
```

❌ SCHLECHT:
```
"Mach alles mit Discord und auch das Frontend
 und schreib mir noch einen Blog-Post darüber"
```

**Regel**: Ein Agent sollte in 30-60 Min fertig sein

---

### 2. **Agents mit klarem Kontext füttern**

**Immer angeben**:
- Welche Docs lesen? (z.B. "TECH-SPECS-COMMUNITY.md")
- Welches Framework? (z.B. "Next.js + Tailwind")
- Welcher Output? (z.B. "Erstelle 3 Files: X, Y, Z")

**Beispiel**:
```
Spawne Agent für Discord-Widget:

Input-Docs:
- TECH-SPECS-COMMUNITY.md (Website-Integration-Abschnitt)
- CLAUDE.md (Brand Colors)

Framework: React + Tailwind CSS

Output:
- components/DiscordWidget.jsx (Component)
- styles/discord.css (Styles)
- README-discord-widget.md (Integration-Guide)
```

---

### 3. **Agent-Ergebnisse reviewen (nicht blind vertrauen)**

**Workflow**:
1. Agent gibt Ergebnis zurück
2. **Du reviewst Code**
3. Testen (funktioniert es?)
4. Änderungen anfordern (falls nötig)
5. Nächsten Agent starten

**Prompt für Review**:
```
Zeige mir die wichtigsten Änderungen, die der Agent gemacht hat.
Gibt es potenzielle Bugs oder Security-Issues?
```

---

### 4. **Agents parallel nutzen (aber organisiert)**

**Mit TMUX**:
```
Window 0: Backend-Agent (Discord OAuth)
Window 1: Frontend-Agent (Widget)
Window 2: Bot-Agent (Automation)
Window 3: Testing (manuell)
```

**Ohne TMUX**:
```
# Agent 1 starten
Spawne Agent für Backend...

# Während Agent 1 läuft: Neue Terminal-Session
claude code

# Agent 2 starten (parallel!)
Spawne Agent für Frontend...
```

---

## 💡 Fortgeschrittene Techniken

### 1. **Agent-Ketten (Agent A → Agent B → Agent C)**

```
# Agent 1: Research
Spawne Agent für Competitive-Research:
- Analysiere Pirate Skills Discord-Setup
- Extrahiere Best Practices
- Erstelle Recommendations.md

# Wenn Agent 1 fertig:

# Agent 2: Implementation
Spawne Agent für Discord-Implementation:
- Lies Recommendations.md (von Agent 1)
- Implementiere basierend auf Best Practices
```

---

### 2. **Agent + Skill Kombination**

```
Spawne Agent mit Skill-Nutzung:

Nutze marketing:campaign-planning Skill für Free-Tier-Launch:
- Ziel: 100 Free Signups in 30 Tagen
- Channels: LinkedIn, Twitter, Reddit
- Budget: €500

Basierend auf Campaign-Plan:
- Erstelle Landing-Page-Copy
- Schreibe Email-Sequence (Tag 0, 3, 7, 14)
- Generiere Social-Media-Posts (30 Tage)

Am Ende: Kompletter Campaign-Folder mit allen Assets.
```

---

### 3. **Agent für Testing & Debugging**

```
Spawne Agent für Discord-Integration-Testing:

Aufgabe:
- Erstelle Test-Suite für OAuth-Flow
- Teste Webhook-Handler (Stripe → Discord)
- Teste Bot-Commands (/progress, /help)
- Erstelle Test-Report mit Pass/Fail

Framework: Jest + Supertest

Am Ende: Zeige mir Test-Coverage und Failed Tests.
```

---

## 🎯 Dein Quick-Start-Plan (konkret)

### Tag 1 (Heute): Discord-Integration

```bash
# Terminal 1: Normal Claude Code starten
cd ~/claude-code-masterkurs
claude code

# Schritt 1: Kontext geben
"Lies CLAUDE.md und UMSETZUNGSPLAN-QUICK-WINS.md"

# Schritt 2: Diskutieren
"Lass uns Discord-Integration planen (Feature 1)"

# Schritt 3: Agent spawnen
"Spawne Agent für Discord-Backend (siehe Prompt oben)"

# Schritt 4: Während Agent läuft - neue Session
# Terminal 2 (oder TMUX Window 1)
claude code

# Parallel: Frontend-Agent
"Spawne Agent für Discord-Frontend (siehe Prompt oben)"

# Schritt 5: Review wenn fertig
"Zeige mir Zusammenfassung der Änderungen"

# Schritt 6: Testen
npm run dev
# → Teste Discord OAuth Flow
```

---

### Tag 2: Founder Story + Free Tier

```bash
# Morgens: Founder-Content
Spawne Agent für Founder-Story (siehe Prompt oben)

# Mittags: Free Tier
Spawne Agent für Free-Tier (siehe Prompt oben)

# Nachmittags: Testing
# Teste manuell, sammle Feedback

# Abends: Polish
# Kleine Änderungen selbst machen (kein Agent nötig)
```

---

## 🛠️ Troubleshooting

### Problem: "Agent macht nicht, was ich will"

**Lösung**:
- Prompt präziser machen
- Docs explizit nennen
- Gewünschten Output beschreiben
- Framework/Tech-Stack angeben

### Problem: "Agent dauert zu lange"

**Lösung**:
- Task kleiner machen
- Agent in Sub-Tasks aufteilen
- Timeout erhöhen (wenn komplex)

### Problem: "Agent findet Docs nicht"

**Lösung**:
- Absolute Pfade nutzen
- Oder: Docs im Prompt selbst zitieren
- Oder: "Nutze Read-Tool für /pfad/zu/TECH-SPECS.md"

---

## 📝 Cheatsheet: Normal Chat vs. Agent

| Aufgabe | Tool | Prompt-Beispiel |
|---------|------|-----------------|
| **Planen** | Normal Chat | "Lass uns Discord planen" |
| **Diskutieren** | Normal Chat | "Was hältst du von Ansatz X?" |
| **Implementieren (groß)** | Agent | "Spawne Agent für Discord-Backend" |
| **Implementieren (klein)** | Normal Chat | "Erstelle DiscordWidget.jsx mit..." |
| **Review** | Normal Chat | "Review den Code von Agent" |
| **Testing** | Agent oder Normal | "Teste OAuth-Flow" |
| **Debugging** | Normal Chat | "Dieser Fehler tritt auf..." |
| **Content erstellen** | Agent + Skill | "Nutze marketing:content-creation..." |

---

## 🎉 Zusammenfassung

**So arbeitest du mit Claude Code + Agents**:

1. ✅ **Starte normal Claude Code** (nicht direkt Agent)
2. ✅ **Gib Kontext** (CLAUDE.md lesen lassen)
3. ✅ **Plane zusammen** (was soll gemacht werden?)
4. ✅ **Spawne Agent** für große Tasks
5. ✅ **Parallele Agents** mit TMUX (optional)
6. ✅ **Review Ergebnisse** (nicht blind vertrauen)
7. ✅ **Iteriere** (Änderungen anfordern)

**Wichtigste Regel**:
> Agents sind für große, selbstständige Tasks.
> Normaler Chat ist für Planung, Review, Diskussion.

---

**Du bist ready! 🚀 Starte mit Discord-Agent und lass es mich wissen, wenn du Fragen hast!**

---

**Letzte Aktualisierung**: 11. Februar 2026
