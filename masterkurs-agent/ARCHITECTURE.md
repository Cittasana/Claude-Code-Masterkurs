# 🏗️ Agent-Architektur

## System-Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   CLAUDE CODE MASTERKURS AGENT                   │
│                     (Vollautomatischer Orchestrator)             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─── Wöchentlicher Trigger (Cron)
                              │    └─ Montag 09:00
                              │
                              ├─── Manual Trigger
                              │    └─ /run masterkurs-weekly-agent
                              │
                              └─── On-Demand Skills
                                   └─ Einzelne Skills nutzen

┌─────────────────────────────────────────────────────────────────┐
│                          WORKFLOW PIPELINE                       │
└─────────────────────────────────────────────────────────────────┘

  1. READ CONTEXT          2. RESEARCH           3. PRIORISIERUNG
  ┌─────────────┐         ┌─────────────┐       ┌─────────────┐
  │  CLAUDE.md  │────────▶│  Exa + Web  │──────▶│  Relevanz   │
  │  (Memory)   │         │  Search     │       │  Scoring    │
  └─────────────┘         └─────────────┘       └─────────────┘
                                                        │
                                                        ▼
  4. CONTENT CREATION                     5. LOGGING
  ┌───────────────────────────────┐      ┌─────────────┐
  │  Skills parallel ausführen:   │      │  Agent Run  │
  │  - Lessons                    │─────▶│  Log        │
  │  - Emails                     │      │  erstellen  │
  │  - Social Media               │      └─────────────┘
  │  - Community                  │
  └───────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         SKILLS LAYER                             │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│ masterkurs-        │  │ masterkurs-        │  │ masterkurs-        │
│ research           │  │ lesson-creator     │  │ email-sequence     │
│                    │  │                    │  │                    │
│ • Exa Integration  │  │ • Script erstellen │  │ • Onboarding       │
│ • WebSearch        │  │ • Code-Beispiele   │  │ • Engagement       │
│ • Relevanz-Scoring │  │ • Quiz generieren  │  │ • Winback          │
│ • Action Items     │  │ • Video-Script     │  │ • A/B Testing      │
└────────────────────┘  └────────────────────┘  └────────────────────┘

┌────────────────────┐  ┌────────────────────┐
│ masterkurs-        │  │ masterkurs-        │
│ social-media       │  │ community-mod      │
│                    │  │                    │
│ • 30-Tage Kalender │  │ • Moderation       │
│ • LinkedIn         │  │ • Engagement       │
│ • Twitter/X        │  │ • Gamification     │
│ • Instagram        │  │ • Analytics        │
└────────────────────┘  └────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       INTEGRATION LAYER                          │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│ MCP: Exa           │  │ MCP: Slack/Discord │  │ MCP: Email         │
│                    │  │                    │  │                    │
│ • Code Context     │  │ • Community        │  │ • ConvertKit       │
│ • Deep Research    │  │ • Moderation       │  │ • Newsletter       │
└────────────────────┘  └────────────────────┘  └────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        OUTPUT LAYER                              │
└─────────────────────────────────────────────────────────────────┘

  ./masterkurs-agent/
  │
  ├── research/          # Weekly Reports
  │   └── YYYY-MM-DD-weekly-research.md
  │
  ├── lessons/           # Neue Lektionen
  │   └── [nummer]-[slug]/
  │       ├── lesson.md
  │       ├── starter-code/
  │       ├── solution/
  │       ├── quiz.json
  │       └── video-script.md
  │
  ├── email-campaigns/   # Email-Serien
  │   └── [segment]-[ziel]/
  │       ├── sequence.json
  │       └── email-*.md
  │
  ├── social-media/      # Posts
  │   └── [platform]-[monat]/
  │       ├── content-calendar.json
  │       └── posts/*.md
  │
  ├── community/         # Community-Guides
  │   ├── community-rules.md
  │   ├── moderation-guide.md
  │   └── templates/
  │
  └── logs/              # Agent-Run-Logs
      └── YYYY-MM-DD-agent-run.md
```

## Data Flow

```
┌──────────────┐
│   User       │
│   Request    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│  Orchestrator (Shortcut: masterkurs-weekly-agent) │
└──────────────────────────────────────────────────┘
       │
       ├─────────────────────────────────────────┐
       │                                         │
       ▼                                         ▼
┌─────────────┐                          ┌─────────────┐
│  CLAUDE.md  │                          │    MCP      │
│  (Context)  │                          │  Servers    │
└──────┬──────┘                          └──────┬──────┘
       │                                         │
       └─────────────┬───────────────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Skills Layer   │
            │  (5 Skills)     │
            └────────┬────────┘
                     │
       ┌─────────────┼─────────────┐
       │             │             │
       ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Research │  │ Content  │  │  Logging │
│ Report   │  │ Creation │  │          │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
     └─────────────┼─────────────┘
                   │
                   ▼
            ┌─────────────┐
            │   Outputs   │
            │   (Files)   │
            └─────────────┘
```

## Skills Dependencies

```
masterkurs-research
├── Requires: Exa MCP, WebSearch
├── Produces: research/*.md
└── Triggers: lesson-creator, social-media (conditional)

masterkurs-lesson-creator
├── Requires: Write, pptx, docx
├── Consumes: research/*.md (for topic ideas)
├── Produces: lessons/[N]-[slug]/
└── Independent: Can run standalone

masterkurs-email-sequence
├── Requires: Write
├── Produces: email-campaigns/[segment]-[goal]/
└── Independent: Can run standalone

masterkurs-social-media
├── Requires: Write
├── Consumes: research/*.md (for content ideas)
├── Produces: social-media/[platform]-[month]/
└── Independent: Can run standalone

masterkurs-community-mod
├── Requires: Write, Slack MCP (optional)
├── Produces: community/*.md
└── Independent: Can run standalone
```

## Execution Modes

### 1. Automated Weekly (Cron)

```
Trigger: Montag 09:00
├── READ CLAUDE.md
├── masterkurs-research
│   ├── Exa: 3 Queries
│   ├── WebSearch: 5 Queries
│   └── Report: research/YYYY-MM-DD.md
├── Relevanz-Check
│   ├── ≥8: NEW Lesson
│   ├── ≥5: Social Media
│   └── <5: Log only
├── Content-Erstellung (parallel wenn möglich)
│   ├── masterkurs-lesson-creator (conditional)
│   ├── masterkurs-social-media (immer)
│   └── masterkurs-email-sequence (conditional)
└── LOG: logs/YYYY-MM-DD.md

Duration: 10-15 Min
```

### 2. Manual On-Demand

```
User: "Nutze masterkurs-research: Check updates"
├── Single Skill Execution
├── Immediate Response
└── Output in entsprechendem Ordner

Duration: 2-5 Min
```

### 3. Batch Processing

```
User: "Erstelle Content-Paket für neue Features"
├── research → lessons → emails → social
├── Alle Skills sequenziell
└── Komplettes Content-Set

Duration: 20-30 Min
```

## Error Handling & Fallbacks

```
Research Phase
├── Exa API Error → Fallback: Nur WebSearch
├── WebSearch Error → Fallback: Cached Docs
└── No Results → Create "No Updates" Report

Content Creation
├── Skill Not Found → Error + Skip
├── Invalid Input → Log + Continue mit anderen Skills
└── Output Error → Retry 1x, dann Log

Logging
├── Filesystem Error → Print to stdout
├── Permission Error → Alternative Location
└── Always Complete: Kein kritischer Fehler
```

## Performance Optimization

```
Parallel Execution (wenn möglich):
├── Research: Exa + WebSearch gleichzeitig
├── Content: Unabhängige Skills parallel
└── Logging: Asynchron nach Content-Erstellung

Caching:
├── CLAUDE.md: 1x pro Run laden
├── Research Results: Für Content-Skills verfügbar
└── Templates: Im Skill cached

Rate Limiting:
├── Exa: Max 10 Queries/Run
├── WebSearch: Max 15 Queries/Run
└── File Writes: Unbegrenzt (lokal)
```

## Security & Privacy

```
No Sensitive Data:
├── Keine API Keys in Logs
├── Keine User-Daten in Research
└── Keine Credentials in Templates

File Permissions:
├── Outputs: 644 (read/write owner)
├── Scripts: 755 (executable)
└── Logs: 644 (read/write owner)

MCP Isolation:
├── Jeder MCP-Server eigener Scope
├── Keine Cross-MCP Data-Leaks
└── User muss MCPs explizit connecten
```

## Monitoring & Metrics

```
Pro Run:
├── Execution Time
├── Anzahl Quellen geprüft
├── Relevanz-Score (Durchschnitt)
├── Content-Pieces erstellt
└── Errors/Warnings

Pro Monat:
├── Total Runs
├── Success Rate
├── Durchschnittliche Quality (1-10)
└── ROI (Zeit gespart)

Alerts:
├── 0 Updates gefunden → Warning
├── Execution Time >20 Min → Warning
├── 3x Errors → Critical
└── Breaking Changes → Immediate Notification
```

---

**Architecture Version**: 1.0.0
**Last Updated**: 2026-02-11
**Scalability**: Designed für 100+ Skills
**Performance**: <15 Min pro Weekly Run
