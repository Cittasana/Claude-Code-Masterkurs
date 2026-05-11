# 🤖 Claude Code Masterkurs Agent

Vollautomatischer Agent für Research, Content-Erstellung und Community-Management.

## 🎯 Was macht der Agent?

### Wöchentlich (Montag 09:00):
1. **Research**: Claude Code Updates via Exa + WebSearch
2. **Content**: Lektionen, Emails, Social Media Posts erstellen
3. **Logging**: Strukturierte Reports mit Action Items

### Skills installiert:
- ✅ `masterkurs-research` - Claude Code Updates recherchieren
- ✅ `masterkurs-lesson-creator` - Vollständige Lektionen erstellen
- ✅ `masterkurs-email-sequence` - Email-Kampagnen
- ✅ `masterkurs-social-media` - 30-Tage Content-Kalender
- ✅ `masterkurs-community-mod` - Community-Management

## 📂 Ordnerstruktur

```
masterkurs-agent/
├── README.md (diese Datei)
├── skills/
│   ├── masterkurs-research/
│   ├── masterkurs-lesson-creator/
│   ├── masterkurs-email-sequence/
│   ├── masterkurs-social-media/
│   └── masterkurs-community-mod/
├── research/ (Weekly Reports)
├── lessons/ (Neue Lektionen)
├── email-campaigns/ (Email-Serien)
├── social-media/ (Posts)
├── community/ (Community-Guides)
└── logs/ (Agent-Run-Logs)
```

## 🚀 Installation & Setup

### Schritt 1: Skills zu Claude Code hinzufügen

Die Skills liegen in `./skills/`. Um sie Claude Code verfügbar zu machen:

**Option A: Symlink (Empfohlen)**
```bash
ln -s "$(pwd)/skills/masterkurs-research" "$HOME/.claude/skills/"
ln -s "$(pwd)/skills/masterkurs-lesson-creator" "$HOME/.claude/skills/"
ln -s "$(pwd)/skills/masterkurs-email-sequence" "$HOME/.claude/skills/"
ln -s "$(pwd)/skills/masterkurs-social-media" "$HOME/.claude/skills/"
ln -s "$(pwd)/skills/masterkurs-community-mod" "$HOME/.claude/skills/"
```

**Option B: Kopieren**
```bash
cp -r ./skills/* "$HOME/.claude/skills/"
```

### Schritt 2: MCP-Server verbinden

Der Agent benötigt diese MCPs:
- **Exa** (für Research) - CRITICAL
- **Slack/Discord** (für Community) - Optional
- **Email/ConvertKit** (für Kampagnen) - Optional

**Exa MCP Setup**:
```bash
# Falls noch nicht installiert
claude code install exa-mcp
```

### Schritt 3: Wöchentlichen Shortcut erstellen

**Automatisch (Cron):**
```bash
# In Claude Code ausführen:
/shortcut create masterkurs-weekly-agent
```

Dann diese Task-Description eingeben:
```
Du bist der Orchestrator-Agent für den Claude Code Masterkurs.

1. READ: /sessions/adoring-vigilant-cray/mnt/Claude Code ausbildung/CLAUDE.md
2. RESEARCH mit Exa + WebSearch
3. Erstelle Report in: ./masterkurs-agent/research/YYYY-MM-DD-weekly-research.md
4. Content erstellen basierend auf Relevanz
5. Log in: ./masterkurs-agent/logs/YYYY-MM-DD-agent-run.md

Erfolgs-Kriterien:
✅ Research-Report mit ≥5 Quellen
✅ Mindestens 1 Content-Piece
✅ Log mit Action Items

Arbeite vollautomatisch!
```

**Cron-Expression**: `0 9 * * 1` (Montag 09:00)

**Manuell ausführen**:
```bash
# In Claude Code Cowork
claude code run masterkurs-weekly-agent
```

## 📊 Output-Beispiele

### Research Report
```
masterkurs-agent/research/2026-02-17-weekly-research.md
```

Enthält:
- Neue Features & Updates
- Dokumentation
- Best Practices
- Relevanz für Masterkurs (1-10)
- Action Items

### Content
```
masterkurs-agent/lessons/28-mcp-marketplace/
├── lesson.md
├── starter-code/
├── solution/
├── quiz.json
└── video-script.md
```

### Log
```
masterkurs-agent/logs/2026-02-17-agent-run.md
```

Enthält:
- Was durchgeführt wurde
- Content erstellt
- Nächste Schritte
- Metriken (Execution Time, Relevanz-Score)

## 🎮 Manuelle Nutzung

Die Skills können auch einzeln genutzt werden:

### Research starten
```
Nutze masterkurs-research:
Recherchiere Claude Code Updates der letzten Woche
```

### Neue Lektion erstellen
```
Nutze masterkurs-lesson-creator:
Erstelle Lektion "React Hooks mit Claude Code"
- Level: Intermediate
- Dauer: 30 Min
```

### Email-Sequenz
```
Nutze masterkurs-email-sequence:
Erstelle Onboarding-Serie für Free Users
- 5 Emails über 14 Tage
- Ziel: 10% Free→Paid Conversion
```

### Social Media
```
Nutze masterkurs-social-media:
Erstelle LinkedIn-Content für nächste Woche
- Mix: 60% Educational, 40% Promotional
```

### Community
```
Nutze masterkurs-community-mod:
Setup Discord-Community für 50-200 Members
- Fokus: High-Quality Diskussionen
```

## 🔧 Konfiguration

### Autonomie-Level ändern

In `CLAUDE.md` anpassen:
```markdown
## Agent-Konfiguration

**Autonomie**: VOLLAUTOMATISCH
**User-Bestätigung nur bei**:
- Breaking Changes
- Budget >€100
- Content-Löschung
```

### Research-Frequenz ändern

Shortcut-Cron anpassen:
- `0 9 * * 1` = Montag 09:00 (Standard)
- `0 9 * * 1,4` = Montag + Donnerstag 09:00
- `0 9 * * 1-5` = Täglich Mo-Fr 09:00

### Content-Priorisierung

In `skills/masterkurs-research/SKILL.md` anpassen:
```markdown
**HOHE PRIORITÄT** (Relevanz 8-10):
→ Neue Lektion erstellen

**MITTLERE PRIORITÄT** (Relevanz 5-7):
→ Nur Social Media Post

**NIEDRIGE PRIORITÄT** (Relevanz 1-4):
→ Nur zur Kenntnis
```

## 📈 Success Metrics

Der Agent trackt automatisch:
- **Research**: Anzahl Quellen, Relevanz-Score
- **Content**: Anzahl Pieces, Typen
- **Execution**: Time, Errors
- **Action Items**: Offen, Completed

Siehe: `./logs/` für alle Metriken.

## 🐛 Troubleshooting

### "Skill not found"
```bash
# Prüfe Installation
ls ~/.claude/skills/ | grep masterkurs

# Falls leer, re-install
ln -s "$(pwd)/skills/"* "$HOME/.claude/skills/"
```

### "Exa API error"
```bash
# Prüfe Exa MCP
claude code list-mcps | grep exa

# Falls nicht da
claude code install exa-mcp
```

### "No research results"
- Prüfe Internet-Verbindung
- Prüfe Anthropic.com erreichbar
- Fallback: Nutze nur WebSearch (ohne Exa)

## 🎯 Nächste Schritte

1. ✅ Skills installiert
2. ✅ MCP-Server verbunden
3. ✅ Shortcut erstellt
4. ⏰ Warte auf Montag 09:00 (oder run manually)
5. 📊 Check `./logs/` für Ergebnisse

## 📞 Support

Bei Problemen:
1. Check `./logs/latest-agent-run.md`
2. Review Research-Report Quality
3. Adjust Relevanz-Thresholds in Skills
4. Contact: office@cittasana.de

---

## 🏗️ Architecture & Workflow

### Agent-Flow (Wöchentlich)

```
┌─────────────────────────────────────────────────────────────┐
│                    MONTAG 09:00 TRIGGER                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │  ORCHESTRATOR  │  (liest CLAUDE.md)
              └────────┬───────┘
                       │
           ┌───────────┼───────────┐
           │           │           │
           ▼           ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │   EXA    │ │ WebSearch│ │ Anthropic│
    │   MCP    │ │   MCP    │ │   Docs   │
    └────┬─────┘ └────┬─────┘ └────┬─────┘
         │            │            │
         └────────────┼────────────┘
                      │
                      ▼
              ┌──────────────┐
              │   RESEARCH   │  → research/YYYY-MM-DD.md
              │    SKILL     │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   RELEVANZ   │  (1-10 Score)
              │   SCORING    │
              └──────┬───────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    [8-10]       [5-7]       [1-4]
         │           │           │
         ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │ LESSON │  │ SOCIAL │  │  LOG   │
    │ CREATOR│  │ MEDIA  │  │  ONLY  │
    └────┬───┘  └───┬────┘  └───┬────┘
         │          │           │
         ▼          ▼           ▼
    ┌─────────────────────────────┐
    │     EMAIL SEQUENCE          │
    │   (bei Major Updates)        │
    └─────────────┬───────────────┘
                  │
                  ▼
           ┌──────────────┐
           │   COMMUNITY  │ (Discord-Post)
           │   BROADCAST  │
           └──────┬───────┘
                  │
                  ▼
           ┌──────────────┐
           │   LOGGING    │ → logs/YYYY-MM-DD.md
           └──────────────┘
```

### Decision-Making Logic

```yaml
IF relevanz_score >= 8:
  - CREATE: Neue Lektion
  - CREATE: Email-Announcement
  - CREATE: 3 Social-Media-Posts
  - POST: Discord #announcements

ELIF relevanz_score >= 5:
  - CREATE: Social-Media-Post (LinkedIn)
  - POST: Discord #updates
  - LOG: "Mittlere Priorität"

ELSE:
  - LOG: "Zur Kenntnis"
  - OPTIONAL: Newsletter-Erwähnung
```

## 🔗 Integration in bestehende Workflows

### 1. Notion-Integration (Content-Pipeline)

**Setup**:
```bash
# Notion MCP installieren
claude code install notion-mcp
```

**Workflow**:
```markdown
AGENT ERSTELLT CONTENT
  ↓
1. Lektion → Notion DB "Lektionen"
2. Email → Notion DB "Email-Kampagnen"
3. Social → Notion DB "Content-Kalender"
  ↓
TEAM REVIEWED IN NOTION
  ↓
PUBLISH VIA NOTION → WEBSITE
```

**Automation-Script** (`scripts/sync-to-notion.js`):
```javascript
// Pseudo-Code
const newLessons = readDirectory('./lessons/');

for (const lesson of newLessons) {
  if (!existsInNotion(lesson.id)) {
    createNotionPage({
      database: 'Lektionen',
      properties: {
        Title: lesson.title,
        Level: lesson.level,
        Status: 'Draft - Review needed',
        Created: lesson.createdAt
      },
      content: lesson.markdown
    });
  }
}
```

### 2. ConvertKit-Integration (Email-Automation)

**Setup**:
```bash
# ConvertKit MCP installieren
claude code install convertkit-mcp
```

**Workflow**:
```markdown
AGENT ERSTELLT EMAIL-SEQUENCE
  ↓
1. 5 Emails in ./email-campaigns/
  ↓
2. Auto-Import zu ConvertKit
  ↓
3. Assign to Segment: "Free Users"
  ↓
4. Schedule: Tag 0, 3, 7, 10, 14
  ↓
LIVE & TRACKING
```

### 3. Discord-Bot-Integration

**Setup**:
```bash
# Discord MCP installieren
claude code install discord-mcp
```

**Auto-Posting**:
```javascript
// In skills/masterkurs-community-mod/scripts/auto-post.js

const announcements = readDirectory('./research/');
const latestResearch = announcements.sort()[0];

if (latestResearch.relevanz >= 8) {
  discordPost({
    channel: '#announcements',
    message: `
🚀 **Claude Code Update!**

${latestResearch.headline}

📚 Neue Lektion: ${latestResearch.lesson_title}

🔗 [Jetzt lernen](${COURSE_URL})
    `
  });
}
```

### 4. Zapier/Make.com Webhooks

**Trigger bei neuem Content**:
```yaml
# In scripts/webhook-trigger.sh

NEW_LESSON_HOOK="https://hooks.zapier.com/hooks/catch/xxx/yyy/"

curl -X POST $NEW_LESSON_HOOK \
  -H "Content-Type: application/json" \
  -d '{
    "event": "new_lesson_created",
    "lesson_id": "28",
    "title": "MCP Marketplace",
    "level": "advanced",
    "url": "https://claude-code-masterkurs.de/lessons/28"
  }'
```

**Zapier Actions**:
- → Slack-Notification an #marketing-team
- → Airtable-Entry erstellen
- → Google Calendar-Event für Review
- → Asana-Task: "Review Lektion 28"

## 📚 Skill Deep-Dives

### Skill 1: `masterkurs-research`

**Input-Beispiele**:
```bash
# Automatisch (via Shortcut)
"Recherchiere Claude Code Updates der letzten Woche"

# Manuell mit Fokus
"Recherchiere speziell MCP-Server Updates"

# Mit Custom Timeframe
"Recherchiere Claude Code Updates seit 2026-01-15"
```

**Output-Struktur**:
```markdown
# Weekly Research Report - 2026-02-17

## Zusammenfassung
3 Major Updates, 5 Minor Updates, 2 Dokumentations-Änderungen

## MAJOR UPDATES (Relevanz: 9/10)

### 1. MCP Marketplace Launch
**Quelle**: [Anthropic Blog](https://anthropic.com/mcp-marketplace)
**Datum**: 2026-02-15
**Impact**: HOCH - Game-Changer für Kurs

**Was ist neu**:
- Zentraler Marketplace für MCP-Server
- 100+ vorgefertigte Integrationen
- 1-Click-Install für Students

**Relevanz für Masterkurs**: 9/10
**Recommended Action**:
→ NEUE LEKTION: "MCP Marketplace Masterclass"
→ EMAIL: Announcement an alle Students
→ SOCIAL: LinkedIn + Twitter Posts

---

## Action Items
- [ ] Lektion 28 erstellen (MCP Marketplace)
- [ ] Email-Kampagne drafts
- [ ] Social-Media-Content planen
```

**Advanced: Custom Research-Queries**:
```yaml
# In skills/masterkurs-research/config.yaml

custom_sources:
  - https://anthropic.com/blog
  - https://github.com/modelcontextprotocol
  - https://reddit.com/r/ClaudeAI
  - https://twitter.com/AnthropicAI

keywords_priority:
  high: ["MCP", "Claude Code", "Agent", "API"]
  medium: ["SDK", "Integration", "Tutorial"]
  low: ["General AI", "News"]

relevanz_weights:
  documentation_quality: 0.3
  practical_applicability: 0.4
  student_demand: 0.2
  trend_score: 0.1
```

### Skill 2: `masterkurs-lesson-creator`

**Full Example-Run**:

**Prompt**:
```
Erstelle Lektion: "React State Management mit Claude Code"
- Level: Intermediate
- Dauer: 45 Min
- Fokus: useState, useEffect, Custom Hooks
```

**Generated-Output**:
```
lessons/29-react-state-management/
├── lesson.md (5000 Wörter, strukturiert)
├── starter-code/
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx (Basis-Setup)
│   │   ├── components/
│   │   └── utils/
├── solution/
│   ├── src/
│   │   ├── App.jsx (Komplett)
│   │   ├── components/
│   │   │   ├── Counter.jsx (useState Example)
│   │   │   ├── DataFetcher.jsx (useEffect Example)
│   │   │   └── useLocalStorage.jsx (Custom Hook)
├── quiz.json (5 Fragen, Multiple-Choice + Code)
├── video-script.md (Szenen-Breakdown)
└── README.md (Setup-Instructions)
```

**lesson.md Structure**:
```markdown
# Lektion 29: React State Management mit Claude Code

**Level**: Intermediate | **Dauer**: 45 Min | **Prerequisites**: React Basics

## Lernziele
Nach dieser Lektion kannst du:
- ✅ useState für lokales State-Management nutzen
- ✅ useEffect für Side-Effects einsetzen
- ✅ Custom Hooks erstellen für wiederverwendbare Logik
- ✅ Claude Code optimal für React-Development nutzen

## Theorie (10 Min)

### Was ist State Management?
[Erklärung mit Diagrammen...]

## Praxis (25 Min)

### Schritt 1: Counter mit useState
[Code + Erklärung...]

### Schritt 2: Data-Fetching mit useEffect
[Code + Erklärung...]

### Schritt 3: Custom Hook für LocalStorage
[Code + Erklärung...]

## Challenge (8 Min)
Baue einen Todo-App mit:
- Add/Remove/Toggle Todos
- LocalStorage-Persistence
- Loading-States

**Hints**: [3 schrittweise Tipps...]

## Recap (2 Min)
[Zusammenfassung + Nächste Schritte...]
```

### Skill 3: `masterkurs-email-sequence`

**Campaign-Beispiel**: "Onboarding Free Users"

**Input**:
```
Erstelle Onboarding-Email-Serie für Free Users
- Ziel: 10% Free→Paid Conversion
- 5 Emails über 14 Tage
- Ton: Freundlich, nicht pushy
```

**Generated Output**:
```
email-campaigns/free-user-onboarding/
├── campaign-strategy.md
├── emails/
│   ├── 01-welcome-day0.md
│   ├── 02-first-win-day3.md
│   ├── 03-value-day7.md
│   ├── 04-social-proof-day10.md
│   └── 05-final-offer-day14.md
├── subject-line-tests.json (A/B-Varianten)
├── analytics-setup.md
└── convertkit-import.json
```

**Email 1 (welcome-day0.md)**:
```markdown
---
subject_line_a: "Willkommen! Deine ersten Schritte mit Claude Code 🚀"
subject_line_b: "{{first_name}}, ready für KI-Programmierung?"
send_delay: 0 hours
segment: free_users_new
---

Hi {{first_name}}! 👋

Willkommen beim Claude Code Masterkurs!

Du hast gerade Zugriff auf die ersten 5 Lektionen bekommen.
Hier ist dein Quick-Start:

**Lektion 1**: Claude Code Basics (15 Min)
→ [Jetzt starten]({{lesson_1_url}})

**Pro-Tipp**: 80% der erfolgreichen Students starten innerhalb der ersten 24h.

**Was kommt als nächstes?**
- Tag 3: Dein erster Praxis-Win
- Tag 7: Warum 500+ Students zahlen
- Tag 10: Exclusive Community-Access

Fragen? Antworte einfach auf diese Email!

Viel Erfolg,
Cosmo

P.S. Folge mir auf [LinkedIn]({{linkedin}}) für Daily Tips!

---
[Abmelden]({{unsubscribe_url}})
```

**Analytics-Setup** (ConvertKit):
```javascript
// Auto-Track
trackEvent('email_opened', {
  campaign: 'free-onboarding',
  email_number: 1,
  user_id: {{subscriber.id}}
});

// Goal-Tracking
if (clicked('lesson_1_url')) {
  addTag('activated');
  removeFromSequence('free-onboarding');
  addToSequence('engaged-learner');
}
```

### Skill 4: `masterkurs-social-media`

**30-Day LinkedIn-Calendar Example**:

**Input**:
```
Erstelle LinkedIn-Content für März 2026
- Mix: 60% Educational, 30% Inspirational, 10% Promotional
- Posting-Frequenz: 3x/Woche (Mo, Mi, Fr)
- Fokus: Claude Code + MCP-Servers
```

**Generated Output**:
```
social-media/2026-03-linkedin/
├── calendar.md (Übersicht)
├── posts/
│   ├── week-1/
│   │   ├── 03-03-monday-educational.md
│   │   ├── 03-05-wednesday-inspirational.md
│   │   └── 03-07-friday-educational.md
│   ├── week-2/ ... week-4/
├── images/ (generierte Grafiken)
├── analytics-tracking.md
└── scheduling-instructions.md
```

**Post-Beispiel** (03-03-monday-educational.md):
```markdown
---
date: 2026-03-03 09:00 CET
platform: LinkedIn
type: Educational
hashtags: ["ClaudeCode", "AIProgramming", "MCP"]
cta: "Kommentiere dein aktuelles Projekt 👇"
---

🚀 MCP-Server in 5 Minuten verstehen

Model Context Protocol = Game-Changer für Claude Code.

Hier ist das Konzept in einfach:

1️⃣ **Problem**: Claude kann nicht direkt auf deine Tools zugreifen
(Notion, GitHub, Slack, etc.)

2️⃣ **Lösung**: MCP-Server = "Adapter"
→ Claude ↔ MCP-Server ↔ Dein Tool

3️⃣ **Praxis**: 1-Click-Install aus Marketplace
→ Instant-Integration

**Real-World Example**:
"Claude, erstelle ein GitHub-Issue für diesen Bug"
→ MCP macht's möglich ✅

**Dein erster MCP?**
→ [Kostenloser Quickstart]({{link}})

Was baust du gerade mit Claude Code?
Kommentiere unten! 👇

#ClaudeCode #AIProgramming #MCP #DeveloperTools

---
IMAGE: mcp-diagram.png (simple Flowchart)
LINKEDIN-ALGORITHM-TIP: Post zwischen 8-10 Uhr, Frage am Ende
```

**Scheduling via Buffer/Hootsuite**:
```csv
Date,Time,Platform,Content,Image,Link,Hashtags
2026-03-03,09:00,LinkedIn,"🚀 MCP-Server in 5 Minuten...",mcp-diagram.png,https://...,#ClaudeCode #AIProgramming
```

### Skill 5: `masterkurs-community-mod`

**Discord-Setup Complete-Example**:

**Input**:
```
Setup Discord-Community für 50-200 Members
- Fokus: High-Quality Diskussionen
- Auto-Moderation
- Weekly Challenges
```

**Generated Output**:
```
community/discord-setup/
├── community-rules.md
├── moderation-guide.md
├── engagement-strategy.md
├── bot-configs/
│   ├── mee6-config.yaml
│   ├── dyno-commands.json
│   └── welcome-bot.js
├── templates/
│   ├── welcome-message.md
│   ├── weekly-challenge.md
│   └── showcase-template.md
└── analytics/
    ├── monthly-health-check.md
    └── sentiment-tracker.py
```

**Auto-Moderation-Config** (mee6-config.yaml):
```yaml
auto_moderation:
  enabled: true
  rules:
    - name: "Link-Spam von New-Users"
      trigger:
        type: "message_contains_url"
        condition: "user_age < 7_days"
      action:
        type: "delete_and_warn"

    - name: "Mass-Mentions"
      trigger:
        type: "mentions_count > 5"
      action:
        type: "delete_and_timeout"
        duration: "30min"

    - name: "Caps-Lock-Spam"
      trigger:
        type: "caps_percentage > 70"
        min_length: 50
      action:
        type: "delete_and_warn"

leveling:
  enabled: true
  roles:
    - level: 0
      role: "Newbie"
    - level: 5
      role: "Coder"
    - level: 15
      role: "Active Coder"
    - level: 30
      role: "Expert"

welcome_message:
  channel: "#welcome"
  dm: true
  content: |
    Hey {{username}}! 👋

    Willkommen im Claude Code Masterkurs!

    **Quick Start**:
    1. Check #rules
    2. Intro in #introductions
    3. Frag in #questions

    Viel Erfolg! 🚀
```

**Weekly Challenge Auto-Post** (via Zapier/Webhook):
```javascript
// Every Wednesday 10:00
const challenge = generateChallenge({
  week: getCurrentWeekNumber(),
  difficulty: 'intermediate',
  topic: getRandomTopic(['MCP', 'React', 'API', 'Automation'])
});

discordWebhook({
  channel: '#weekly-challenge',
  content: `
🏆 **Challenge #${challenge.number}: ${challenge.title}**

**Aufgabe**: ${challenge.description}

**Requirements**:
${challenge.requirements.map(r => `- ${r}`).join('\n')}

**Deadline**: Freitag 18:00
**Prize**: Feature in Newsletter + Custom Role

📋 Details im Thread 👇
  `
});
```

## 🎛️ Advanced Configuration

### Environment-Variables

**`.env`-Setup**:
```bash
# Agent-Config
AGENT_AUTONOMY_LEVEL=full          # full | semi | manual
AGENT_SCHEDULE_CRON="0 9 * * 1"    # Montag 09:00

# Research-Config
RESEARCH_LOOKBACK_DAYS=7
RESEARCH_MIN_SOURCES=5
RESEARCH_RELEVANZ_THRESHOLD=5

# Content-Creation-Thresholds
CREATE_LESSON_IF_RELEVANZ_GTE=8
CREATE_EMAIL_IF_RELEVANZ_GTE=9
CREATE_SOCIAL_IF_RELEVANZ_GTE=5

# API-Keys (MCP-Server)
EXA_API_KEY=exa_xxx
ANTHROPIC_API_KEY=sk-ant-xxx
CONVERTKIT_API_KEY=ck_xxx
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx

# Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
EMAIL_NOTIFICATION=office@cittasana.de
```

### Custom-Relevanz-Scoring

**Override in `skills/masterkurs-research/config.yaml`**:
```yaml
relevanz_formula:
  weights:
    documentation_quality: 0.25    # Ist es gut dokumentiert?
    practical_applicability: 0.35  # Sofort nutzbar?
    student_demand: 0.20           # Nachfrage da?
    trend_score: 0.10              # Hype-Faktor?
    competitive_advantage: 0.10    # Differenzierung?

modifiers:
  - if_breaking_change: +2         # Breaking = wichtiger
  - if_new_feature: +1
  - if_bug_fix: -1
  - if_documentation_only: -2
```

### Budget-Controls

**Cost-Limits setzen**:
```yaml
# In CLAUDE.md oder agent-config.yaml

budget_controls:
  daily_max_usd: 10
  monthly_max_usd: 200

  cost_per_task:
    research: ~2          # Exa + WebSearch
    lesson_creation: ~5   # Content-Generierung
    email_sequence: ~3
    social_media: ~1

  alert_at_percentage: 80  # Email bei 80% Budget

  pause_if_exceeded: true  # Agent stoppt bei Limit
```

## 🔐 Security Best Practices

### API-Key-Management

**NIEMALS committen**:
```bash
# .gitignore
.env
*.key
secrets/
*_credentials.json
```

**Secrets-Management** (mit 1Password CLI):
```bash
# Store
op item create \
  --category=password \
  --title="Masterkurs Agent Keys" \
  --vault="Development"

# Retrieve in Script
export EXA_API_KEY=$(op read "op://Development/Masterkurs Agent Keys/EXA_API_KEY")
```

### Rate-Limiting

**Exa API** (100 requests/day Free):
```yaml
rate_limits:
  exa:
    max_requests_per_day: 90  # Safety-Margin
    cache_ttl: 86400          # 24h Cache

  anthropic:
    max_tokens_per_day: 100000

  convertkit:
    max_emails_per_hour: 100
```

### Data-Privacy

**GDPR-Compliance**:
```yaml
data_retention:
  research_reports: 90_days
  logs: 30_days
  email_analytics: 365_days

pii_handling:
  anonymize_user_data: true
  never_log_email_content: true
  gdpr_export_available: true
```

## 🚀 Performance-Tuning

### Caching-Strategie

```yaml
# In agent-config.yaml

caching:
  research_results:
    enabled: true
    ttl: 86400              # 24h
    invalidate_on: "new_anthropic_release"

  mcp_metadata:
    enabled: true
    ttl: 604800             # 7 Tage

  lesson_templates:
    enabled: true
    ttl: 2592000            # 30 Tage
```

### Parallel-Execution

```yaml
parallelization:
  research:
    sources: 5              # 5 Quellen parallel

  content_creation:
    enabled: true
    max_concurrent: 3       # Max 3 Content-Pieces gleichzeitig

  social_media:
    batch_size: 10          # 10 Posts parallel generieren
```

### Optimization-Metrics

**Track in logs/**:
```markdown
# Performance-Report - 2026-02-17

## Execution-Times
- Research: 45s
- Lesson-Creation: 3m 12s
- Email-Sequence: 1m 30s
- Social-Media: 58s
- **TOTAL**: 6m 25s

## API-Calls
- Exa: 15 calls
- WebSearch: 8 calls
- Anthropic: 42 calls (32k tokens)

## Bottlenecks
- ⚠️ Lesson-Creation: 50% der Zeit
  → Optimization: Template-Caching

## Recommendations
- Enable Parallel-Content-Creation
- Increase Exa-Cache-TTL
```

## 🧪 Testing & Validation

### Manual-Testing-Checklist

```markdown
# Pre-Deploy-Checklist

✅ RESEARCH-SKILL:
- [ ] Testet mit "letzte 7 Tage"
- [ ] Minimum 5 Quellen gefunden
- [ ] Relevanz-Scoring macht Sinn
- [ ] Report ist gut strukturiert

✅ LESSON-CREATOR:
- [ ] Starter-Code kompiliert
- [ ] Solution-Code kompiliert
- [ ] Quiz hat 5 Fragen
- [ ] Video-Script ist logisch

✅ EMAIL-SEQUENCE:
- [ ] Subject-Lines A/B-tauglich
- [ ] CTAs sind klar
- [ ] Unsubscribe-Link vorhanden
- [ ] GDPR-Footer da

✅ SOCIAL-MEDIA:
- [ ] 30 Posts generiert
- [ ] Hashtags relevant
- [ ] Mix passt (60/30/10)
- [ ] Scheduling-CSV exportiert

✅ COMMUNITY-MOD:
- [ ] Bot-Configs valid
- [ ] Auto-Mod-Rules getestet
- [ ] Templates renderable
```

### Automated-Testing

**Unit-Tests** (`tests/test-research.js`):
```javascript
describe('Research-Skill', () => {
  it('should find min 5 sources', async () => {
    const result = await runSkill('masterkurs-research', {
      query: 'Claude Code updates',
      days: 7
    });

    expect(result.sources.length).toBeGreaterThanOrEqual(5);
  });

  it('should score relevanz 1-10', async () => {
    const result = await runSkill('masterkurs-research');

    result.updates.forEach(update => {
      expect(update.relevanz).toBeGreaterThanOrEqual(1);
      expect(update.relevanz).toBeLessThanOrEqual(10);
    });
  });
});
```

**Integration-Tests** (`tests/test-full-workflow.js`):
```javascript
describe('Full-Agent-Workflow', () => {
  it('should complete weekly run', async () => {
    const result = await runAgent('masterkurs-weekly');

    expect(result.research_report).toExist();
    expect(result.content_created.length).toBeGreaterThan(0);
    expect(result.log).toExist();
  });
});
```

## 📊 Monitoring & Alerting

### Slack-Alerts

**Setup** (via Incoming-Webhooks):
```javascript
// In scripts/alert.js

function sendSlackAlert(level, message) {
  const emoji = {
    'success': '✅',
    'warning': '⚠️',
    'error': '🚨'
  }[level];

  slackWebhook({
    channel: '#masterkurs-agent-logs',
    username: 'Masterkurs Agent',
    icon_emoji: emoji,
    text: `${emoji} ${message}`,
    attachments: [{
      color: level === 'error' ? 'danger' : 'good',
      fields: [
        {title: 'Timestamp', value: new Date().toISOString()},
        {title: 'Environment', value: process.env.NODE_ENV}
      ]
    }]
  });
}

// Usage
sendSlackAlert('success', 'Weekly research completed: 8 relevant updates found');
sendSlackAlert('error', 'Exa API rate-limit exceeded');
```

### Email-Digests

**Weekly Summary** (jeden Montag 18:00):
```markdown
Subject: 📊 Masterkurs Agent - Weekly Summary

Hi Cosmo,

Dein Agent war diese Woche fleißig! 🤖

**Content erstellt**:
- ✅ 1 Neue Lektion (MCP Marketplace)
- ✅ 5-Email-Sequence (Onboarding Free Users)
- ✅ 12 Social-Media-Posts
- ✅ 1 Discord-Announcement

**Performance**:
- Execution-Time: 6m 25s (↓15% vs letzte Woche)
- API-Cost: $4.20 (Budget: $10/day)
- Research-Quellen: 18 gefunden

**Top-Update**:
🚀 MCP Marketplace (Relevanz: 9/10)
→ Lektion 28 erstellt + veröffentlicht

**Action Items für dich**:
- [ ] Review Lektion 28 (Quality-Check)
- [ ] Approve Email-Sequence (ConvertKit)
- [ ] Schedule Social-Posts (Buffer)

**Nächster Run**: Montag, 24. Feb 09:00

Alle Details: [Agent-Dashboard]({{dashboard_url}})

Cheers,
Dein Agent 🤖
```

## 🛠️ Troubleshooting Deep-Dive

### Problem: "Research findet nichts"

**Diagnose**:
```bash
# 1. Check Internet
ping anthropic.com

# 2. Check Exa-MCP
claude code list-mcps | grep exa

# 3. Manual-Test
claude code run --skill masterkurs-research --debug
```

**Lösungen**:
```yaml
# A) Exa-API-Problem → Fallback zu WebSearch
fallback_research:
  enabled: true
  sources: ["websearch", "anthropic_docs"]

# B) Rate-Limit → Caching
research_cache:
  enabled: true
  ttl: 86400  # 24h

# C) Query zu spezifisch → Broaden
research_queries:
  - "Claude Code updates"           # Breit
  - "MCP new releases"               # Spezifischer
  - "Anthropic SDK changelog"        # Sehr spezifisch
```

### Problem: "Lesson-Code kompiliert nicht"

**Diagnose**:
```bash
# In lesson/XX-title/starter-code/
npm install
npm run build  # Error?
```

**Quality-Gate einbauen**:
```yaml
# In skills/masterkurs-lesson-creator/config.yaml

quality_checks:
  compile_test:
    enabled: true
    fail_on_error: true

  lint_test:
    enabled: true
    fail_on_error: false  # Nur Warnings

  dependency_check:
    enabled: true
    allow_deprecated: false
```

### Problem: "Agent läuft nicht scheduled"

**Diagnose**:
```bash
# Check Cron
crontab -l | grep masterkurs

# Check Shortcut
claude code list-shortcuts

# Manual-Run zum Testen
claude code run masterkurs-weekly-agent
```

**Fix**:
```bash
# Re-create Shortcut
claude code delete-shortcut masterkurs-weekly-agent
claude code create-shortcut masterkurs-weekly-agent \
  --cron "0 9 * * 1" \
  --task "Orchestrate weekly research + content"
```

## 📞 Support & Community

### Wo bekomme ich Hilfe?

1. **Dokumentation**: Diese README + Skill-Docs
2. **Logs**: `./logs/latest-agent-run.md`
3. **Discord**: [Community-Channel](https://discord.gg/xxx)
4. **Email**: office@cittasana.de

### Common-Issues FAQ

**Q: Agent erstellt zu viel Content?**
```yaml
# Erhöhe Thresholds in .env
CREATE_LESSON_IF_RELEVANZ_GTE=9  # statt 8
CREATE_SOCIAL_IF_RELEVANZ_GTE=7  # statt 5
```

**Q: Research-Reports sind zu lang?**
```yaml
# In skills/masterkurs-research/config.yaml
output_format:
  max_words: 2000  # statt unlimited
  summary_only: true  # Keine Full-Texts
```

**Q: Kosten zu hoch?**
```yaml
# Budget-Controls setzen
budget_controls:
  daily_max_usd: 5  # statt 10
  pause_if_exceeded: true
```

**Q: Skills nicht gefunden?**
```bash
# Symlinks prüfen
ls -la ~/.claude/skills/ | grep masterkurs

# Falls leer
ln -s "$(pwd)/skills/"* "$HOME/.claude/skills/"
```

---

## 📈 Roadmap & Future Features

### v1.1 (Q2 2026)
- [ ] YouTube-Integration (Auto-Upload von Video-Scripts)
- [ ] Figma-Integration (Auto-Generate Lesson-Grafiken)
- [ ] Multi-Language-Support (EN, DE, ES)

### v1.2 (Q3 2026)
- [ ] Student-Analytics-Integration (Welche Lektionen brauchen Update?)
- [ ] A/B-Testing-Automation (für Emails + Social)
- [ ] Voice-Synthesis (Audio-Versionen von Lektionen)

### v2.0 (Q4 2026)
- [ ] Full-Autopilot-Mode (Zero-Human-Intervention)
- [ ] Predictive-Content (ML-basiert: "Was brauchen Students als nächstes?")
- [ ] Multi-Platform-Expansion (Udemy, Skillshare Auto-Sync)

---

**Version**: 1.1.0 (Production + Integration-Ready)
**Created**: 2026-02-11
**Last Update**: 2026-02-11
**Maintainer**: Cosmo (office@cittasana.de)
