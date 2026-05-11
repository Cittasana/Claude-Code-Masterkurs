import type { CodingChallenge } from '../types';

export const challenges: CodingChallenge[] = [
  // ── Anfänger (Claude Code – separat von Projekten) ──────
  {
    id: 'ch-01',
    source: 'claude-code',
    title: 'Erstelle eine CLAUDE.md Datei',
    description:
      'Schreibe eine grundlegende CLAUDE.md Konfiguration für ein Node.js Projekt.',
    category: 'CLAUDE.md',
    difficulty: 'Anfänger',
    timeLimit: 300,
    points: 100,
    instruction:
      'Erstelle eine CLAUDE.md Datei für ein Node.js/TypeScript Projekt. Sie muss mindestens die Sektionen "Project Overview", "Tech Stack" und "Code Style" enthalten. Verwende Markdown-Überschriften (##) für die Sektionen.',
    starterCode: `# CLAUDE.md

## Project Overview
<!-- Beschreibe dein Projekt hier -->

`,
    language: 'markdown',
    hints: [
      'Nutze ## für Sektionen-Überschriften',
      'Tech Stack sollte die verwendeten Technologien auflisten',
      'Code Style sollte Konventionen wie Formatierung und Naming beschreiben',
    ],
    validations: [
      {
        id: 'v-01-1',
        name: 'Project Overview Sektion',
        pattern: '## Project Overview',
        isRegex: false,
        errorMessage: 'Die Sektion "## Project Overview" fehlt.',
        points: 20,
      },
      {
        id: 'v-01-2',
        name: 'Tech Stack Sektion',
        pattern: '## Tech Stack',
        isRegex: false,
        errorMessage: 'Die Sektion "## Tech Stack" fehlt.',
        points: 30,
      },
      {
        id: 'v-01-3',
        name: 'Code Style Sektion',
        pattern: '## Code Style',
        isRegex: false,
        errorMessage: 'Die Sektion "## Code Style" fehlt.',
        points: 30,
      },
      {
        id: 'v-01-4',
        name: 'Node.js / TypeScript erwähnt',
        pattern: '(Node\\.?js|TypeScript|TS)',
        isRegex: true,
        errorMessage: 'Erwähne Node.js oder TypeScript im Tech Stack.',
        points: 20,
      },
    ],
    solution: `# CLAUDE.md

## Project Overview
Ein modernes Web-API-Projekt gebaut mit Node.js und TypeScript.
Das Projekt bietet REST-Endpoints für Benutzer- und Datenverwaltung.

## Tech Stack
- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5.x (strict mode)
- **Framework**: Express.js
- **Database**: PostgreSQL mit Prisma ORM
- **Testing**: Vitest + Supertest

## Code Style
- Verwende \`camelCase\` für Variablen und Funktionen
- Verwende \`PascalCase\` für Klassen und Interfaces
- Immer explizite TypeScript-Typen verwenden (kein \`any\`)
- Prettier mit 2-Space-Indentation
- ESLint mit @typescript-eslint/recommended
`,
    relatedLessons: [4],
  },
  {
    id: 'ch-02',
    source: 'claude-code',
    title: 'CLI Befehl zusammenbauen',
    description:
      'Konstruiere den richtigen Claude Code CLI-Befehl für ein gegebenes Szenario.',
    category: 'CLI Befehle',
    difficulty: 'Anfänger',
    timeLimit: 180,
    points: 80,
    instruction:
      'Schreibe den Claude Code CLI-Befehl, der eine Datei analysiert und das Ergebnis als JSON ausgibt. Nutze den Pipe-Modus (-p) und das Flag --output-format json. Die Eingabe soll "Analysiere src/index.ts" lauten.',
    starterCode: `# Schreibe den vollständigen CLI-Befehl:
`,
    language: 'bash',
    hints: [
      'Der Pipe-Modus wird mit -p aktiviert',
      '--output-format json gibt JSON-Output aus',
      'Der Prompt kommt in Anführungszeichen nach -p',
    ],
    validations: [
      {
        id: 'v-02-1',
        name: 'Claude Befehl',
        pattern: 'claude',
        isRegex: false,
        errorMessage: 'Der Befehl muss mit "claude" beginnen.',
        points: 20,
      },
      {
        id: 'v-02-2',
        name: 'Pipe-Modus Flag',
        pattern: '-p',
        isRegex: false,
        errorMessage: 'Nutze den Pipe-Modus mit -p.',
        points: 20,
      },
      {
        id: 'v-02-3',
        name: 'Output Format JSON',
        pattern: '--output-format\\s+json',
        isRegex: true,
        errorMessage: 'Verwende --output-format json für JSON-Ausgabe.',
        points: 20,
      },
      {
        id: 'v-02-4',
        name: 'Analyse-Prompt',
        pattern: 'Analysiere src/index.ts',
        isRegex: false,
        errorMessage: 'Der Prompt muss "Analysiere src/index.ts" enthalten.',
        points: 20,
      },
    ],
    solution: `claude -p "Analysiere src/index.ts" --output-format json`,
    relatedLessons: [3],
  },
  {
    id: 'ch-03',
    source: 'claude-code',
    title: 'Einfacher Prompt mit Kontext',
    description: 'Schreibe einen effektiven Prompt für Claude Code mit Kontextangabe.',
    category: 'Prompt Engineering',
    difficulty: 'Anfänger',
    timeLimit: 240,
    points: 90,
    instruction:
      'Schreibe einen Claude Code Prompt, der:\n1. Eine klare Aufgabe definiert (z.B. "Erstelle eine Funktion...")\n2. Den Kontext mit @-Referenz angibt (z.B. @src/utils/)\n3. Einschränkungen/Regeln nennt (z.B. "Verwende keine externen Dependencies")\n\nFormatiere den Prompt als mehrzeiligen Text.',
    starterCode: `# Dein Claude Code Prompt:

`,
    language: 'markdown',
    hints: [
      'Beginne mit einer klaren Anweisung was erstellt werden soll',
      'Nutze @-Referenzen für Dateien oder Ordner',
      'Gib Constraints an wie "ohne externe Libraries"',
    ],
    validations: [
      {
        id: 'v-03-1',
        name: 'Aufgabendefinition',
        pattern: '(Erstelle|Schreibe|Implementiere|Erzeuge|Baue|Refactore)',
        isRegex: true,
        errorMessage: 'Beginne mit einer klaren Aufgabe (z.B. "Erstelle...", "Implementiere...").',
        points: 30,
      },
      {
        id: 'v-03-2',
        name: '@-Referenz vorhanden',
        pattern: '@\\S+',
        isRegex: true,
        errorMessage: 'Nutze eine @-Referenz für Kontext (z.B. @src/utils/).',
        points: 30,
      },
      {
        id: 'v-03-3',
        name: 'Einschränkungen / Regeln',
        pattern: '(Verwende|Nutze|Beachte|Keine|ohne|nicht|soll|muss)',
        isRegex: true,
        errorMessage: 'Gib Einschränkungen oder Regeln an.',
        points: 30,
      },
    ],
    solution: `Erstelle eine Hilfsfunktion validateEmail in @src/utils/validation.ts,
die eine E-Mail-Adresse mit einem Regex prüft und einen boolean zurückgibt.

Kontext: @src/types/user.ts enthält bereits das User-Interface.

Regeln:
- Verwende keine externen Dependencies
- Nutze TypeScript strict mode
- Exportiere die Funktion als named export
- Schreibe JSDoc-Kommentare für die Funktion`,
    relatedLessons: [5, 14],
  },

  // ── Fortgeschritten ───────────────────────────────────
  {
    id: 'ch-04',
    source: 'claude-code',
    title: 'MCP Server Konfiguration',
    description: 'Konfiguriere einen MCP Server für Claude Code mit korrekter JSON-Syntax.',
    category: 'MCP Konfiguration',
    difficulty: 'Fortgeschritten',
    timeLimit: 360,
    points: 150,
    instruction:
      'Erstelle eine JSON-Konfiguration für einen MCP-Server namens "filesystem". Der Server soll:\n- Das Kommando "npx" verwenden\n- Die Args: ["-y", "@anthropic/mcp-filesystem", "/Users/dev/project"] haben\n- Nur die Tools "read_file" und "write_file" erlauben (allowedTools)\n\nSchreibe die vollständige JSON-Konfiguration.',
    starterCode: `{
  "mcpServers": {

  }
}`,
    language: 'json',
    hints: [
      'Jeder MCP-Server hat "command", "args" und optional "allowedTools"',
      'allowedTools ist ein Array von Tool-Namen',
      'Die Struktur ist: mcpServers → servername → { command, args, allowedTools }',
    ],
    validations: [
      {
        id: 'v-04-1',
        name: 'Server Name "filesystem"',
        pattern: '"filesystem"',
        isRegex: false,
        errorMessage: 'Der Server muss "filesystem" heißen.',
        points: 20,
      },
      {
        id: 'v-04-2',
        name: 'Command npx',
        pattern: '"command"\\s*:\\s*"npx"',
        isRegex: true,
        errorMessage: 'Das command muss "npx" sein.',
        points: 30,
      },
      {
        id: 'v-04-3',
        name: 'Args korrekt',
        pattern: '@anthropic/mcp-filesystem',
        isRegex: false,
        errorMessage: 'Die Args müssen "@anthropic/mcp-filesystem" enthalten.',
        points: 30,
      },
      {
        id: 'v-04-4',
        name: 'allowedTools definiert',
        pattern: '"allowedTools"',
        isRegex: false,
        errorMessage: 'Definiere "allowedTools" für die erlaubten Tools.',
        points: 20,
      },
      {
        id: 'v-04-5',
        name: 'read_file und write_file',
        pattern: 'read_file.*write_file|write_file.*read_file',
        isRegex: true,
        errorMessage: 'allowedTools muss "read_file" und "write_file" enthalten.',
        points: 30,
      },
    ],
    solution: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-filesystem", "/Users/dev/project"],
      "allowedTools": ["read_file", "write_file"]
    }
  }
}`,
    relatedLessons: [6],
  },
  {
    id: 'ch-05',
    source: 'claude-code',
    title: 'Hook-Script für Pre-Commit',
    description: 'Schreibe ein Claude Code Hook-Script für automatische Code-Checks.',
    category: 'Hooks & Automation',
    difficulty: 'Fortgeschritten',
    timeLimit: 420,
    points: 160,
    instruction:
      'Erstelle eine Hook-Konfiguration in JSON für Claude Code, die:\n1. Einen "PreCommit" Hook definiert\n2. Das Script "npm run lint && npm run test" ausführt\n3. Bei Fehler den Commit blockiert (blocking: true)\n4. Eine Beschreibung hat\n\nSchreibe die vollständige Hooks-Konfiguration.',
    starterCode: `{
  "hooks": {

  }
}`,
    language: 'json',
    hints: [
      'Hooks haben einen Namen als Key und ein Objekt mit command, blocking, description',
      'blocking: true stoppt die Aktion bei Fehler',
      'Das command-Feld enthält das Shell-Script',
    ],
    validations: [
      {
        id: 'v-05-1',
        name: 'PreCommit Hook',
        pattern: 'PreCommit',
        isRegex: false,
        errorMessage: 'Definiere einen "PreCommit" Hook.',
        points: 30,
      },
      {
        id: 'v-05-2',
        name: 'Lint-Befehl',
        pattern: 'npm run lint',
        isRegex: false,
        errorMessage: 'Das Script muss "npm run lint" enthalten.',
        points: 30,
      },
      {
        id: 'v-05-3',
        name: 'Test-Befehl',
        pattern: 'npm run test',
        isRegex: false,
        errorMessage: 'Das Script muss "npm run test" enthalten.',
        points: 30,
      },
      {
        id: 'v-05-4',
        name: 'Blocking Flag',
        pattern: '"blocking"\\s*:\\s*true',
        isRegex: true,
        errorMessage: 'Setze "blocking": true um den Commit bei Fehler zu blockieren.',
        points: 30,
      },
      {
        id: 'v-05-5',
        name: 'Beschreibung vorhanden',
        pattern: '"description"',
        isRegex: false,
        errorMessage: 'Füge eine "description" für den Hook hinzu.',
        points: 20,
      },
    ],
    solution: `{
  "hooks": {
    "PreCommit": {
      "command": "npm run lint && npm run test",
      "blocking": true,
      "description": "Führt Linting und Tests vor jedem Commit aus"
    }
  }
}`,
    relatedLessons: [12],
  },
  {
    id: 'ch-06',
    source: 'claude-code',
    title: 'Prompt mit System-Kontext',
    description: 'Erstelle einen fortgeschrittenen Prompt mit System-Kontext und Chain-of-Thought.',
    category: 'Prompt Engineering',
    difficulty: 'Fortgeschritten',
    timeLimit: 360,
    points: 140,
    instruction:
      'Schreibe einen fortgeschrittenen Claude Code Prompt, der:\n1. Einen System-Kontext setzt (--system-prompt oder Beschreibung der Rolle)\n2. Chain-of-Thought erzwingt ("Denke Schritt für Schritt")\n3. Ein konkretes Output-Format verlangt (z.B. JSON, Markdown-Tabelle)\n4. Mindestens eine @-Referenz nutzt',
    starterCode: `# Fortgeschrittener Prompt:

`,
    language: 'markdown',
    hints: [
      'Definiere eine klare Rolle wie "Du bist ein Senior Code Reviewer"',
      'Fordere Chain-of-Thought mit "Denke Schritt für Schritt" oder "Erkläre deine Überlegungen"',
      'Gib ein konkretes Output-Format vor (JSON-Schema, Tabelle, etc.)',
    ],
    validations: [
      {
        id: 'v-06-1',
        name: 'Rollen-Definition',
        pattern: '(Du bist|Agiere als|Rolle|Senior|Expert|Spezialist)',
        isRegex: true,
        errorMessage: 'Setze einen System-Kontext oder definiere eine Rolle.',
        points: 30,
      },
      {
        id: 'v-06-2',
        name: 'Chain-of-Thought',
        pattern: '(Schritt für Schritt|step by step|Erkläre|Begründe|Überleg)',
        isRegex: true,
        errorMessage: 'Erzwinge Chain-of-Thought Denken.',
        points: 30,
      },
      {
        id: 'v-06-3',
        name: 'Output-Format',
        pattern: '(JSON|Tabelle|Format|Markdown|Liste|Schema|Ausgabe)',
        isRegex: true,
        errorMessage: 'Verlange ein konkretes Output-Format.',
        points: 30,
      },
      {
        id: 'v-06-4',
        name: '@-Referenz',
        pattern: '@\\S+',
        isRegex: true,
        errorMessage: 'Nutze mindestens eine @-Referenz.',
        points: 30,
      },
    ],
    solution: `Du bist ein Senior TypeScript Code Reviewer mit Fokus auf Clean Code.

Analysiere @src/services/auth.ts Schritt für Schritt:

1. Prüfe die Typsicherheit aller Funktionen
2. Identifiziere potenzielle Sicherheitslücken  
3. Bewerte die Error-Handling-Strategie
4. Schlage konkrete Verbesserungen vor

Gib das Ergebnis als Markdown-Tabelle aus mit den Spalten:
| Zeile | Problem | Schwere | Vorschlag |

Erkläre deine Überlegungen zu jedem Fund.`,
    relatedLessons: [14, 15],
  },
  {
    id: 'ch-07',
    source: 'claude-code',
    title: 'CLAUDE.md für Monorepo',
    description: 'Erstelle eine CLAUDE.md Konfiguration für ein komplexes Monorepo-Projekt.',
    category: 'CLAUDE.md',
    difficulty: 'Fortgeschritten',
    timeLimit: 480,
    points: 170,
    instruction:
      'Erstelle eine CLAUDE.md für ein Monorepo mit Frontend (React) und Backend (Node.js). Sie muss enthalten:\n1. Project Overview mit Monorepo-Beschreibung\n2. Architecture (Frontend + Backend Struktur)\n3. Commands (build, test, lint für beide Packages)\n4. Conventions (TypeScript, Imports, Naming)\n5. Wichtige Dateien/Pfade',
    starterCode: `# CLAUDE.md

`,
    language: 'markdown',
    hints: [
      'Beschreibe die Monorepo-Struktur mit packages/ oder apps/',
      'Nenne spezifische Commands wie "npm run build:frontend"',
      'Definiere Import-Konventionen zwischen Packages',
    ],
    validations: [
      {
        id: 'v-07-1',
        name: 'Project Overview',
        pattern: '## Project Overview',
        isRegex: false,
        errorMessage: 'Sektion "## Project Overview" fehlt.',
        points: 20,
      },
      {
        id: 'v-07-2',
        name: 'Architecture Sektion',
        pattern: '## Architecture',
        isRegex: false,
        errorMessage: 'Sektion "## Architecture" fehlt.',
        points: 25,
      },
      {
        id: 'v-07-3',
        name: 'Commands Sektion',
        pattern: '## Commands',
        isRegex: false,
        errorMessage: 'Sektion "## Commands" fehlt.',
        points: 25,
      },
      {
        id: 'v-07-4',
        name: 'Conventions',
        pattern: '## Conventions',
        isRegex: false,
        errorMessage: 'Sektion "## Conventions" fehlt.',
        points: 25,
      },
      {
        id: 'v-07-5',
        name: 'React erwähnt',
        pattern: 'React',
        isRegex: false,
        errorMessage: 'Erwähne React im Frontend-Teil.',
        points: 15,
      },
      {
        id: 'v-07-6',
        name: 'Node.js erwähnt',
        pattern: '(Node\\.?js|Express|Fastify|NestJS)',
        isRegex: true,
        errorMessage: 'Erwähne das Backend-Framework.',
        points: 15,
      },
      {
        id: 'v-07-7',
        name: 'Monorepo-Struktur',
        pattern: '(packages|apps|workspaces|monorepo)',
        isRegex: true,
        errorMessage: 'Beschreibe die Monorepo-Struktur.',
        points: 15,
      },
    ],
    solution: `# CLAUDE.md

## Project Overview
Fullstack Monorepo mit React Frontend und Node.js Backend.
Verwaltet mit npm workspaces. Shared Types zwischen Frontend und Backend.

## Architecture
\`\`\`
packages/
├── frontend/    # React 18 + Vite + TypeScript
├── backend/     # Node.js + Express + Prisma
└── shared/      # Gemeinsame Types & Utilities
\`\`\`

## Commands
- \`npm run build\` – Alle Packages bauen
- \`npm run build:frontend\` – Nur Frontend
- \`npm run build:backend\` – Nur Backend
- \`npm run test\` – Alle Tests ausführen
- \`npm run lint\` – ESLint über alle Packages

## Conventions
- **TypeScript**: strict mode in allen Packages
- **Imports**: Nutze @shared/ Alias für gemeinsame Types
- **Naming**: camelCase für Variablen, PascalCase für Komponenten
- **Keine relativen Imports** zwischen Packages – immer über den Package-Namen

## Wichtige Dateien
- \`packages/shared/src/types.ts\` – Zentrale Type-Definitionen
- \`packages/backend/prisma/schema.prisma\` – Datenbank-Schema
- \`packages/frontend/src/api/client.ts\` – API-Client
`,
    relatedLessons: [4, 5],
  },

  // ── Expert ────────────────────────────────────────────
  {
    id: 'ch-08',
    source: 'claude-code',
    title: 'Custom Agent Personality',
    description: 'Entwirf eine vollständige Agent-Personality-Konfiguration.',
    category: 'Agent Design',
    difficulty: 'Expert',
    timeLimit: 600,
    points: 200,
    instruction:
      'Erstelle eine CLAUDE.md Sektion die eine Custom Agent Personality definiert. Der Agent soll:\n1. Einen Namen und eine Rolle haben (z.B. "CodeGuardian - Security Reviewer")\n2. Persönlichkeitsmerkmale definieren (Ton, Stil, Verhalten)\n3. Spezifische Regeln/Constraints haben (was er tut/nicht tut)\n4. Output-Templates für seine Antworten definieren\n5. Eskalationsregeln bei kritischen Findings haben',
    starterCode: `# Agent Personality Configuration

## Agent Identity

`,
    language: 'markdown',
    hints: [
      'Gib dem Agent einen einprägsamen Namen und klare Rolle',
      'Definiere DO / DO NOT Regeln',
      'Erstelle ein Template wie der Agent antworten soll',
      'Beschreibe wann der Agent eskaliert',
    ],
    validations: [
      {
        id: 'v-08-1',
        name: 'Agent Name/Rolle',
        pattern: '(Name|Rolle|Identity|Agent).*:',
        isRegex: true,
        errorMessage: 'Definiere den Agent-Namen und seine Rolle.',
        points: 30,
      },
      {
        id: 'v-08-2',
        name: 'Persönlichkeit definiert',
        pattern: '(Persönlichkeit|Personality|Ton|Stil|Verhalten|Traits)',
        isRegex: true,
        errorMessage: 'Definiere die Persönlichkeit des Agents.',
        points: 30,
      },
      {
        id: 'v-08-3',
        name: 'Regeln / Constraints',
        pattern: '(DO NOT|Nicht|Regeln|Rules|Constraints|Verboten)',
        isRegex: true,
        errorMessage: 'Definiere Regeln/Constraints für den Agent.',
        points: 30,
      },
      {
        id: 'v-08-4',
        name: 'Output Template',
        pattern: '(Template|Format|Ausgabe|Response|Antwort)',
        isRegex: true,
        errorMessage: 'Definiere ein Output-Template für Antworten.',
        points: 30,
      },
      {
        id: 'v-08-5',
        name: 'Eskalation',
        pattern: '(Eskalation|Escalat|kritisch|Critical|Warnung|Alert)',
        isRegex: true,
        errorMessage: 'Definiere Eskalationsregeln.',
        points: 30,
      },
    ],
    solution: `# Agent Personality Configuration

## Agent Identity
- **Name**: CodeGuardian
- **Rolle**: Security-fokussierter Code Reviewer
- **Spezialisierung**: OWASP Top 10, Dependency Audits, Secrets Detection

## Persönlichkeit
- **Ton**: Professionell, direkt, aber konstruktiv
- **Stil**: Technisch präzise mit konkreten Codebeispielen
- **Verhalten**: Proaktiv – weist auf potenzielle Probleme hin bevor sie auftreten

## Regeln
### DO:
- Immer OWASP-Referenzen bei Security-Findings angeben
- Konkrete Fix-Vorschläge mit Code liefern
- Severity-Level (Critical/High/Medium/Low) vergeben

### DO NOT:
- Keine Style-Kommentare (nur Security-relevant)
- Keine Änderungen an Business-Logik vorschlagen
- Keine Dependencies ohne Security-Audit empfehlen

## Antwort-Template
\`\`\`
## Security Review: [Dateiname]

### Findings
| # | Severity | Finding | OWASP | Fix |
|---|----------|---------|-------|-----|
| 1 | Critical | ...     | A01   | ... |

### Zusammenfassung
- Kritische Issues: X
- Empfohlene Maßnahmen: ...
\`\`\`

## Eskalation
- **Critical**: Sofort melden, Block-Empfehlung für Merge
- **High**: In Review-Kommentar hervorheben
- **Medium/Low**: Als Verbesserungsvorschlag listen
`,
    relatedLessons: [9, 10],
  },
  {
    id: 'ch-09',
    source: 'claude-code',
    title: 'Multi-Agent Orchestration',
    description: 'Entwirf eine Subagent-Strategie für ein komplexes Coding-Projekt.',
    category: 'Agent Design',
    difficulty: 'Expert',
    timeLimit: 600,
    points: 220,
    instruction:
      'Erstelle einen Orchestrierungs-Plan für ein Multi-Agent-System in Claude Code. Das System soll ein Feature implementieren:\n\n1. Definiere mindestens 3 Subagents mit klaren Rollen\n2. Beschreibe den Workflow (welcher Agent wann aktiv wird)\n3. Definiere die Übergabepunkte zwischen Agents\n4. Gib jedem Agent spezifische Prompt-Instruktionen\n5. Definiere Qualitätsgates zwischen den Schritten',
    starterCode: `# Multi-Agent Orchestration Plan

## Feature: [Dein Feature]

## Agents

`,
    language: 'markdown',
    hints: [
      'Typische Rollen: Architekt, Implementierer, Tester, Reviewer',
      'Definiere klare Input/Output für jeden Agent',
      'Qualitätsgates prüfen ob der Output des vorherigen Agents korrekt ist',
      'Nutze --allowedTools um Agents auf bestimmte Tools einzuschränken',
    ],
    validations: [
      {
        id: 'v-09-1',
        name: 'Mindestens 3 Agents',
        pattern: '(Agent 1|### Agent|## Agent|Subagent).*(Agent 2|### Agent|## Agent|Subagent).*(Agent 3|### Agent|## Agent|Subagent)',
        isRegex: true,
        errorMessage: 'Definiere mindestens 3 verschiedene Agents.',
        points: 40,
      },
      {
        id: 'v-09-2',
        name: 'Workflow definiert',
        pattern: '(Workflow|Ablauf|Reihenfolge|Pipeline|Schritt)',
        isRegex: true,
        errorMessage: 'Beschreibe den Workflow/Ablauf.',
        points: 30,
      },
      {
        id: 'v-09-3',
        name: 'Übergabepunkte',
        pattern: '(Übergabe|Handoff|Output|Input|liefert|erhält)',
        isRegex: true,
        errorMessage: 'Definiere Übergabepunkte zwischen Agents.',
        points: 30,
      },
      {
        id: 'v-09-4',
        name: 'Prompt-Instruktionen',
        pattern: '(Prompt|Instruktion|Anweisung|Aufgabe)',
        isRegex: true,
        errorMessage: 'Gib jedem Agent spezifische Prompt-Instruktionen.',
        points: 30,
      },
      {
        id: 'v-09-5',
        name: 'Qualitätsgates',
        pattern: '(Qualität|Quality|Gate|Prüfung|Validierung|Check)',
        isRegex: true,
        errorMessage: 'Definiere Qualitätsgates zwischen den Schritten.',
        points: 30,
      },
    ],
    solution: `# Multi-Agent Orchestration Plan

## Feature: User Authentication mit OAuth2

## Agents

### Agent 1: Architekt ("PlannerBot")
- **Rolle**: Analysiert Anforderungen und erstellt technisches Design
- **Prompt**: "Analysiere @src/ und erstelle ein technisches Design für OAuth2-Authentication. Definiere die benötigten Dateien, Interfaces und den Ablauf."
- **Output**: Technisches Design-Dokument mit Datei-Liste und Interface-Definitionen
- **allowedTools**: Read, Search, Glob

### Agent 2: Implementierer ("BuilderBot")
- **Rolle**: Setzt das Design in Code um
- **Prompt**: "Implementiere die OAuth2-Authentication basierend auf dem Design. Erstelle alle definierten Dateien und Interfaces."
- **Input**: Erhält das Design-Dokument von Agent 1
- **Output**: Implementierter Code in allen definierten Dateien
- **allowedTools**: Read, Write, Search

### Agent 3: Tester ("TestBot")
- **Rolle**: Schreibt und führt Tests aus
- **Prompt**: "Schreibe umfassende Tests für @src/auth/. Teste jeden Endpoint, Edge Cases und Fehlerbehandlung."
- **Input**: Erhält die implementierten Dateien von Agent 2
- **Output**: Test-Suite mit Coverage-Bericht
- **allowedTools**: Read, Write, Shell

### Agent 4: Reviewer ("GuardBot")
- **Rolle**: Security & Code Review
- **Prompt**: "Prüfe @src/auth/ auf Sicherheitslücken (OWASP Top 10), Code-Qualität und Best Practices."
- **Input**: Erhält Code + Tests von Agent 2 & 3
- **Output**: Review-Bericht mit Findings und Fix-Vorschlägen

## Workflow
1. Architekt erstellt Design → **Quality Gate 1**: Design-Validierung
2. Implementierer setzt um → **Quality Gate 2**: Kompiliert ohne Fehler
3. Tester schreibt Tests → **Quality Gate 3**: Alle Tests grün, Coverage > 80%
4. Reviewer prüft alles → **Quality Gate 4**: Keine Critical/High Findings

## Qualitätsgates
- **Gate 1**: Design enthält alle definierten Endpoints und Interfaces
- **Gate 2**: TypeScript kompiliert fehlerfrei, kein \`any\`
- **Gate 3**: Test-Coverage > 80%, alle Tests bestanden
- **Gate 4**: Kein OWASP-Finding mit Severity Critical oder High
`,
    relatedLessons: [8, 16],
  },
  {
    id: 'ch-10',
    source: 'claude-code',
    title: 'CI/CD Pipeline mit Claude Code',
    description: 'Erstelle eine GitHub Actions Pipeline, die Claude Code für automatische Reviews nutzt.',
    category: 'Hooks & Automation',
    difficulty: 'Expert',
    timeLimit: 540,
    points: 200,
    instruction:
      'Erstelle eine GitHub Actions Workflow-Datei (YAML), die:\n1. Bei Pull Requests ausgelöst wird\n2. Claude Code im Pipe-Modus für einen Code Review nutzt\n3. Das Review-Ergebnis als PR-Kommentar postet\n4. Bei kritischen Findings den PR blockiert\n5. Umgebungsvariablen für den API-Key verwendet',
    starterCode: `name: Claude Code Review

`,
    language: 'yaml',
    hints: [
      'Nutze "on: pull_request" als Trigger',
      'claude -p für den Pipe-Modus und --output-format json',
      'GitHub Actions können PR-Kommentare via gh pr comment posten',
      'Secrets werden über ${{ secrets.VARIABLE }} eingebunden',
    ],
    validations: [
      {
        id: 'v-10-1',
        name: 'PR Trigger',
        pattern: 'pull_request',
        isRegex: false,
        errorMessage: 'Der Workflow muss bei Pull Requests ausgelöst werden.',
        points: 30,
      },
      {
        id: 'v-10-2',
        name: 'Claude Code Befehl',
        pattern: 'claude.*-p',
        isRegex: true,
        errorMessage: 'Nutze Claude Code im Pipe-Modus (claude -p).',
        points: 30,
      },
      {
        id: 'v-10-3',
        name: 'PR Kommentar',
        pattern: '(comment|Comment|kommentar|gh pr)',
        isRegex: true,
        errorMessage: 'Poste das Ergebnis als PR-Kommentar.',
        points: 30,
      },
      {
        id: 'v-10-4',
        name: 'API Key Secret',
        pattern: 'secrets\\.',
        isRegex: true,
        errorMessage: 'Verwende GitHub Secrets für den API-Key.',
        points: 30,
      },
      {
        id: 'v-10-5',
        name: 'Steps definiert',
        pattern: 'steps:',
        isRegex: false,
        errorMessage: 'Definiere Workflow-Steps.',
        points: 20,
      },
    ],
    solution: `name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  code-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run Claude Code Review
        id: review
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          REVIEW=$(claude -p "Review the changes in this PR. Focus on security, performance, and code quality. Flag critical issues." --output-format json)
          echo "result=$REVIEW" >> $GITHUB_OUTPUT

      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            const review = \${{ steps.review.outputs.result }};
            await github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '## Claude Code Review\\n' + review
            });

      - name: Block on Critical Findings
        if: contains(steps.review.outputs.result, 'critical')
        run: exit 1
`,
    relatedLessons: [12, 17],
  },
  {
    id: 'ch-11',
    source: 'claude-code',
    title: 'Custom Slash Command',
    description: 'Erstelle einen Custom Slash Command für Claude Code.',
    category: 'CLI Befehle',
    difficulty: 'Fortgeschritten',
    timeLimit: 300,
    points: 130,
    instruction:
      'Erstelle den Inhalt einer Markdown-Datei für einen Custom Slash Command "/review-security".\nDer Command soll:\n1. Claude anweisen, den aktuellen Code auf Sicherheitslücken zu prüfen\n2. OWASP Top 10 als Referenz nutzen\n3. Das Ergebnis als strukturierte Liste ausgeben\n4. Mindestens den Datei-Kontext mit $ARGUMENTS referenzieren',
    starterCode: `# /review-security

`,
    language: 'markdown',
    hints: [
      'Custom Commands sind Markdown-Dateien in .claude/commands/',
      '$ARGUMENTS wird durch die Benutzer-Eingabe ersetzt',
      'Strukturiere den Prompt klar mit Aufgabe, Kontext, Format',
    ],
    validations: [
      {
        id: 'v-11-1',
        name: 'Security Review Anweisung',
        pattern: '(Sicherheit|Security|sicher|vulnerab)',
        isRegex: true,
        errorMessage: 'Der Command muss eine Security-Review-Anweisung enthalten.',
        points: 30,
      },
      {
        id: 'v-11-2',
        name: 'OWASP Referenz',
        pattern: 'OWASP',
        isRegex: false,
        errorMessage: 'Referenziere OWASP als Prüfgrundlage.',
        points: 25,
      },
      {
        id: 'v-11-3',
        name: '$ARGUMENTS Variable',
        pattern: '\\$ARGUMENTS',
        isRegex: true,
        errorMessage: 'Nutze $ARGUMENTS für den Datei-Kontext.',
        points: 25,
      },
      {
        id: 'v-11-4',
        name: 'Strukturiertes Format',
        pattern: '(Liste|Tabelle|Format|Ausgabe|Output)',
        isRegex: true,
        errorMessage: 'Definiere ein strukturiertes Ausgabeformat.',
        points: 25,
      },
    ],
    solution: `# /review-security

Führe ein umfassendes Security Review der folgenden Dateien durch:

$ARGUMENTS

## Prüfkriterien
Analysiere den Code auf Basis der OWASP Top 10:
- A01: Broken Access Control
- A02: Cryptographic Failures
- A03: Injection
- A07: Authentication Failures

## Ausgabe-Format
Gib das Ergebnis als strukturierte Liste aus:

1. **Finding**: [Beschreibung]
   - **Datei**: [Dateipfad]
   - **Zeile**: [Zeilennummer]
   - **Severity**: Critical / High / Medium / Low
   - **OWASP**: [Referenz-ID]
   - **Fix**: [Konkreter Vorschlag]

Abschließend eine Zusammenfassung mit Gesamtbewertung.
`,
    relatedLessons: [13],
  },
  {
    id: 'ch-12',
    source: 'claude-code',
    title: 'Debugging-Strategie Prompt',
    description: 'Schreibe einen systematischen Debugging-Prompt für Claude Code.',
    category: 'Prompt Engineering',
    difficulty: 'Anfänger',
    timeLimit: 240,
    points: 90,
    instruction:
      'Erstelle einen Prompt, der Claude Code systematisch bei der Fehlersuche hilft:\n1. Beschreibe das Problem (z.B. "TypeError: Cannot read property...")\n2. Gib den Kontext an (betroffene Datei mit @-Referenz)\n3. Beschreibe das erwartete vs. tatsächliche Verhalten\n4. Bitte um schrittweise Analyse',
    starterCode: `# Debugging Prompt:

`,
    language: 'markdown',
    hints: [
      'Nenne die genaue Fehlermeldung',
      'Nutze @-Referenzen für relevante Dateien',
      'Unterscheide klar zwischen "Erwartet" und "Tatsächlich"',
    ],
    validations: [
      {
        id: 'v-12-1',
        name: 'Fehlerbeschreibung',
        pattern: '(Error|Fehler|TypeError|Bug|Problem|Issue|Crash)',
        isRegex: true,
        errorMessage: 'Beschreibe das Problem / den Fehler.',
        points: 25,
      },
      {
        id: 'v-12-2',
        name: '@-Referenz',
        pattern: '@\\S+',
        isRegex: true,
        errorMessage: 'Gib den Kontext mit einer @-Referenz an.',
        points: 25,
      },
      {
        id: 'v-12-3',
        name: 'Erwartetes vs. Tatsächliches Verhalten',
        pattern: '(erwartet|erwartete|tatsächlich|stattdessen|Expected|Actual)',
        isRegex: true,
        errorMessage: 'Beschreibe erwartetes vs. tatsächliches Verhalten.',
        points: 25,
      },
      {
        id: 'v-12-4',
        name: 'Schrittweise Analyse',
        pattern: '(Schritt|schrittweise|analysiere|untersuche|prüfe|systematisch)',
        isRegex: true,
        errorMessage: 'Bitte um eine schrittweise Analyse.',
        points: 15,
      },
    ],
    solution: `# Debugging Prompt:

Ich habe einen TypeError in @src/components/UserList.tsx:

**Fehler**: "TypeError: Cannot read property 'map' of undefined" (Zeile 42)

**Erwartetes Verhalten**: Die Komponente soll eine Liste von Benutzern rendern, 
die vom API-Endpoint /api/users geladen werden.

**Tatsächliches Verhalten**: Die Seite crasht beim Laden mit dem oben genannten TypeError.

Bitte analysiere schrittweise:
1. Prüfe den Daten-Flow von der API bis zur Komponente
2. Untersuche den State und die useEffect-Abhängigkeiten
3. Prüfe ob ein Loading-State oder Fallback fehlt
4. Schlage einen konkreten Fix vor mit Code-Beispiel
`,
    relatedLessons: [18],
  },
  // ── Neue Challenges (KW12/2026 Update) ──────
  {
    id: 'ch-13',
    source: 'claude-code',
    title: 'Session-Organisation mit /color und /name',
    description:
      'Konfiguriere drei parallele Claude Code Sessions mit eigenen Farben und Namen.',
    category: 'CLI Befehle',
    difficulty: 'Anfänger',
    timeLimit: 300,
    points: 80,
    instruction:
      'Erstelle ein Bash-Skript das drei Claude Code Sessions startet: eine für "Frontend" (blau), eine für "Backend" (grün) und eine für "Tests" (rot). Nutze /name und /color in den Kommentaren um den Workflow zu dokumentieren.',
    starterCode: `#!/bin/bash
# Session-Organisation fuer paralleles Arbeiten
# Dokumentiere die drei Sessions mit /name und /color

`,
    language: 'bash',
    hints: [
      '/name setzt den Session-Namen, /color die Farbe',
      'Farben können Farbnamen (blue) oder Hex-Codes (#ff6b35) sein',
      'Kombiniere /name und /color fuer maximale Übersicht',
    ],
    validations: [
      {
        id: 'v-13-1',
        name: '/color Befehl',
        pattern: '/color',
        isRegex: false,
        errorMessage: 'Nutze den /color Befehl fuer Session-Farben.',
        points: 30,
      },
      {
        id: 'v-13-2',
        name: '/name Befehl',
        pattern: '/name',
        isRegex: false,
        errorMessage: 'Nutze den /name Befehl fuer Session-Namen.',
        points: 30,
      },
      {
        id: 'v-13-3',
        name: 'Drei Sessions',
        pattern: '(Frontend|Backend|Test)',
        isRegex: true,
        errorMessage: 'Dokumentiere drei Sessions: Frontend, Backend, Tests.',
        points: 20,
      },
    ],
    solution: `#!/bin/bash
# Session-Organisation fuer paralleles Arbeiten

# Session 1: Frontend-Arbeit
# In Terminal 1:
# claude
# /name "Frontend Auth"
# /color blue

# Session 2: Backend-API
# In Terminal 2:
# claude
# /name "Backend API"
# /color green

# Session 3: E2E-Tests
# In Terminal 3:
# claude
# /name "E2E Tests"
# /color red

# Sessions auflisten und fortsetzen:
# claude --resume
# → Zeigt alle benannten Sessions mit Farben
`,
    relatedLessons: [3, 32],
  },
  {
    id: 'ch-14',
    source: 'claude-code',
    title: 'Plan-First Development Workflow',
    description:
      'Wende den 4-Schritt Plan-First Workflow an: Plan anfordern, reviewen, genehmigen, implementieren.',
    category: 'Prompt Engineering',
    difficulty: 'Fortgeschritten',
    timeLimit: 600,
    points: 120,
    instruction:
      'Schreibe einen Claude Code Prompt der den Plan-First Development Workflow für ein User-Authentication-Feature demonstriert. Der Prompt muss explizit sagen "Schreibe KEINEN Code" und einen Plan anfordern. Beschreibe dann die Review-Schritte.',
    starterCode: `# Plan-First Development: User Authentication
# Schritt 1: Plan anfordern

`,
    language: 'bash',
    hints: [
      'Schritt 1: Explizit "Schreibe KEINEN Code" sagen',
      'Der Plan sollte Anforderungen, Architektur und Teststrategie enthalten',
      'Shift+Tab aktiviert den Plan Mode',
    ],
    validations: [
      {
        id: 'v-14-1',
        name: 'Kein Code Anweisung',
        pattern: '(KEIN|keinen|nicht).*[Cc]ode',
        isRegex: true,
        errorMessage: 'Sage explizit dass KEIN Code geschrieben werden soll.',
        points: 30,
      },
      {
        id: 'v-14-2',
        name: 'Plan anfordern',
        pattern: '(Plan|plan|Strategie|Analyse)',
        isRegex: true,
        errorMessage: 'Fordere einen Plan oder eine Analyse an.',
        points: 30,
      },
      {
        id: 'v-14-3',
        name: 'Review-Schritt',
        pattern: '(review|Review|prüf|Prüf|feedback|Feedback)',
        isRegex: true,
        errorMessage: 'Beschreibe den Review-Schritt.',
        points: 30,
      },
      {
        id: 'v-14-4',
        name: 'Implementierungs-Freigabe',
        pattern: '(implementier|Implementier|umsetzen|Umsetzen|grünes Licht)',
        isRegex: true,
        errorMessage: 'Gib die Freigabe zur Implementierung.',
        points: 30,
      },
    ],
    solution: `# Plan-First Development: User Authentication

# Schritt 1: Plan anfordern (KEIN Code!)
"Analysiere unsere bestehende Auth-Logik in src/auth/ und
 erstelle einen detaillierten Plan fuer die Erweiterung um
 OAuth2-Support mit Google und GitHub als Provider.

 Anforderungen:
 - Bestehende Email/Passwort-Auth muss weiterhin funktionieren
 - Session-Management aktualisieren
 - Datenbank-Migration planen
 - Tests definieren

 Schreibe KEINEN Code. Nur den Plan."

# Schritt 2: Plan reviewen
# → Claude liefert einen strukturierten Plan
# → Du prüfst: Fehlen Edge Cases? Stimmt die Reihenfolge?
# → Feedback geben: "Fuege einen Rollback-Plan hinzu"

# Schritt 3: Freigabe geben
"Plan sieht gut aus. Implementiere jetzt Schritt 1 (DB-Migration)."

# Schritt 4: Review + Tests
# → Code reviewen, Tests prüfen, nächsten Schritt freigeben
`,
    relatedLessons: [15, 32],
  },
  {
    id: 'ch-15',
    source: 'claude-code',
    title: 'Custom Model Picker konfigurieren',
    description:
      'Konfiguriere einen Custom Model Picker mit Umgebungsvariablen fuer ein Team-Setup.',
    category: 'CLI Befehle',
    difficulty: 'Fortgeschritten',
    timeLimit: 300,
    points: 100,
    instruction:
      'Erstelle ein Shell-Skript das die Umgebungsvariablen fuer einen Custom Model Picker setzt. Setze ANTHROPIC_CUSTOM_MODEL_OPTION, _NAME und _DESCRIPTION. Das Modell soll "team-optimized-v2" heissen und als "Team-Optimiertes Modell" angezeigt werden.',
    starterCode: `#!/bin/bash
# Custom Model Picker Setup fuer Team-Nutzung

`,
    language: 'bash',
    hints: [
      'ANTHROPIC_CUSTOM_MODEL_OPTION setzt die Modell-ID',
      '_NAME und _DESCRIPTION sind optionale Suffixe fuer die Anzeige',
      'Nach dem Setzen wird das Modell im /model Picker angezeigt',
    ],
    validations: [
      {
        id: 'v-15-1',
        name: 'Model Option gesetzt',
        pattern: 'ANTHROPIC_CUSTOM_MODEL_OPTION',
        isRegex: false,
        errorMessage: 'Setze die ANTHROPIC_CUSTOM_MODEL_OPTION Variable.',
        points: 40,
      },
      {
        id: 'v-15-2',
        name: 'Model Name gesetzt',
        pattern: 'ANTHROPIC_CUSTOM_MODEL_OPTION_NAME',
        isRegex: false,
        errorMessage: 'Setze auch den _NAME fuer die Anzeige.',
        points: 30,
      },
      {
        id: 'v-15-3',
        name: 'Model Description gesetzt',
        pattern: 'ANTHROPIC_CUSTOM_MODEL_OPTION_DESCRIPTION',
        isRegex: false,
        errorMessage: 'Setze auch die _DESCRIPTION fuer den Picker.',
        points: 30,
      },
    ],
    solution: `#!/bin/bash
# Custom Model Picker Setup fuer Team-Nutzung

# Modell-ID setzen (pflicht)
export ANTHROPIC_CUSTOM_MODEL_OPTION="team-optimized-v2"

# Anzeigename im /model Picker (optional)
export ANTHROPIC_CUSTOM_MODEL_OPTION_NAME="Team-Optimiertes Modell"

# Beschreibung im Picker (optional)
export ANTHROPIC_CUSTOM_MODEL_OPTION_DESCRIPTION="Fine-tuned fuer unsere Codebase, optimiert fuer TypeScript und React"

# Claude Code starten — /model zeigt jetzt auch das Custom Model
claude

# In der Session:
# /model
# → zeigt u.a. "Team-Optimiertes Modell" als Option
`,
    relatedLessons: [2, 32],
  },
  {
    id: 'ch-16',
    source: 'claude-code',
    title: 'Agentic Coding: Autonome Task-Kette',
    description:
      'Formuliere einen Prompt der eine autonome Kette von 10+ Aktionen auslöst.',
    category: 'Agent Design',
    difficulty: 'Expert',
    timeLimit: 600,
    points: 150,
    instruction:
      'Schreibe einen detaillierten Claude Code Prompt der ein komplettes Feature implementiert: CSV-Import mit Validierung, Error-Handling, Tests und API-Route. Der Prompt soll so formuliert sein, dass Claude mindestens 10 autonome Aktionen ausführen kann ohne nachzufragen.',
    starterCode: `# Agentic Task-Kette: CSV-Import Feature
# Ziel: 10+ autonome Aktionen in einer Kette

`,
    language: 'bash',
    hints: [
      'Je detaillierter die Anforderungen, desto autonomer kann Claude arbeiten',
      'Nenne die betroffenen Dateien/Verzeichnisse explizit',
      'Fordere Tests und Error-Handling im gleichen Prompt',
    ],
    validations: [
      {
        id: 'v-16-1',
        name: 'CSV/Import Erwähnung',
        pattern: '(CSV|csv|Import|import)',
        isRegex: true,
        errorMessage: 'Der Prompt soll einen CSV-Import beschreiben.',
        points: 20,
      },
      {
        id: 'v-16-2',
        name: 'Validierung erwähnt',
        pattern: '(Validier|validier|pruef|Pruef|check)',
        isRegex: true,
        errorMessage: 'Fordere Validierung der Daten.',
        points: 20,
      },
      {
        id: 'v-16-3',
        name: 'Error-Handling erwähnt',
        pattern: '(Error|Fehler|fehler|error|Exception)',
        isRegex: true,
        errorMessage: 'Fordere Error-Handling.',
        points: 20,
      },
      {
        id: 'v-16-4',
        name: 'Tests erwähnt',
        pattern: '(Test|test|Unit|unit|Edge)',
        isRegex: true,
        errorMessage: 'Fordere Tests fuer das Feature.',
        points: 20,
      },
      {
        id: 'v-16-5',
        name: 'Detaillierte Anforderungen',
        pattern: '(Anforder|anforder|Schritt|Route|API|api)',
        isRegex: true,
        errorMessage: 'Gib detaillierte Anforderungen an.',
        points: 20,
      },
    ],
    solution: `# Agentic Task-Kette: CSV-Import Feature
# Ziel: 10+ autonome Aktionen in einer Kette

"Implementiere einen vollstaendigen CSV-Import fuer Kundendaten.

Anforderungen:
1. Lese die bestehende Datenstruktur aus src/types/client.ts
2. Erstelle einen CSV-Parser in src/lib/csv-parser.ts:
   - Unterstuetze: Name, Email, Firma, Telefon
   - Trenne Felder per Semikolon (deutsches Format)
   - Trimme Whitespace aus allen Feldern
3. Erstelle Validierung in src/lib/csv-validator.ts:
   - Email-Format pruefen
   - Pflichtfelder: Name und Email
   - Ungueltige Zeilen loggen (nicht abbrechen)
4. Fehlerbehandlung:
   - Leere Dateien abfangen
   - Falsches Encoding erkennen (UTF-8 erzwingen)
   - Duplikate per Email erkennen und warnen
5. API-Route in src/routes/import.ts erstellen oder erweitern
6. Unit-Tests in tests/csv-parser.test.ts:
   - Happy Path (gueltige CSV)
   - Edge Cases: leere Datei, fehlende Pflichtfelder
   - Ungueltige Emails
   - Duplikate
7. Fuehre alle Tests aus und fixe eventuelle Fehler.
8. Aktualisiere die README mit Import-Anleitung."
`,
    relatedLessons: [10, 32],
  },
  // ── Neue Challenges KW13/2026 ──────────────────────────
  {
    id: 'ch-17',
    source: 'claude-code',
    title: 'CLAUDE.md nach Boris Cherny optimieren',
    description:
      'Erstelle eine optimierte CLAUDE.md nach dem Vorbild des Claude Code Creators: Maximal 100 Zeilen, fokussiert auf die Top-10-Regeln.',
    category: 'CLAUDE.md',
    difficulty: 'Fortgeschritten',
    timeLimit: 480,
    points: 150,
    instruction:
      'Erstelle eine CLAUDE.md nach Boris Chernys Prinzip (max. 100 Zeilen, ~2.500 Tokens).\n\nDie Datei muss enthalten:\n1. Projekt-Typ und Tech-Stack (max 10 Zeilen)\n2. Kern-Konventionen (max 10 Regeln)\n3. Häufige Fehler die Claude macht (3-5 Punkte)\n4. Links zu Detail-Docs (nicht die Docs selbst)\n5. Build/Test/Lint Befehle\n\nWichtig: KEINE API-Routen, KEINE Schema-Details, KEINE Copy-Paste aus README.\nZähle die Zeilen — es dürfen maximal 100 sein.',
    starterCode: `# CLAUDE.md — Optimiert nach Boris Cherny\n\n`,
    language: 'markdown',
    hints: [
      'Boris Cherny hält seine CLAUDE.md auf ~100 Zeilen (~2.500 Tokens)',
      'Fokussiere auf die Top-10-Regeln, nicht auf ein Nachschlagewerk',
      'Verweise auf Detail-Docs statt sie einzubetten',
      'Je kürzer, desto schärfer der Fokus von Claude',
    ],
    validations: [
      {
        id: 'v-17-1',
        name: 'Tech Stack vorhanden',
        pattern: '(Tech.?Stack|Stack|Runtime|Framework)',
        isRegex: true,
        errorMessage: 'Beschreibe den Tech-Stack deines Projekts.',
        points: 30,
      },
      {
        id: 'v-17-2',
        name: 'Konventionen definiert',
        pattern: '(Konvention|Regel|Convention|Style)',
        isRegex: true,
        errorMessage: 'Definiere Coding-Konventionen.',
        points: 30,
      },
      {
        id: 'v-17-3',
        name: 'Häufige Fehler',
        pattern: '(Fehler|Mistake|Avoid|Vermeide|Achtung)',
        isRegex: true,
        errorMessage: 'Nenne häufige Fehler die Claude vermeiden soll.',
        points: 30,
      },
      {
        id: 'v-17-4',
        name: 'Build/Test Befehle',
        pattern: '(npm|yarn|pnpm|build|test|lint)',
        isRegex: true,
        errorMessage: 'Füge Build/Test/Lint Befehle hinzu.',
        points: 30,
      },
      {
        id: 'v-17-5',
        name: 'Links zu Docs',
        pattern: '(http|@|docs/|README)',
        isRegex: true,
        errorMessage: 'Verweise auf Detail-Docs statt sie einzubetten.',
        points: 30,
      },
    ],
    solution: `# CLAUDE.md — Optimiert nach Boris Cherny

## Projekt
E-Commerce REST API — Node.js 20 LTS, TypeScript 5.x strict, Express, PostgreSQL + Prisma.

## Konventionen
1. TypeScript strict mode — kein \`any\`
2. camelCase für Variablen, PascalCase für Interfaces
3. Fehler über zentrale ErrorHandler-Middleware
4. API-Responses: \`{ data, error, meta }\` Schema
5. Neue Endpoints: Route → Controller → Service → Repository
6. DB-Queries nur in Repository-Layer
7. Env-Variablen über \`src/config/env.ts\`, nie direkt \`process.env\`
8. Imports: absolute Pfade (\`@/services/...\`)
9. Tests neben Quellcode (\`*.test.ts\`)
10. Commits: Conventional Commits (\`feat/fix/docs/chore\`)

## Häufige Fehler
- ❌ \`any\` statt korrekter Typen
- ❌ Business-Logik in Controllern statt Services
- ❌ Fehlende Error-Handler bei async/await
- ❌ \`console.log\` statt Logger

## Befehle
\`\`\`
npm run dev          # Starten
npm run build        # TypeScript kompilieren
npm run test         # Vitest
npm run lint         # ESLint
npm run db:migrate   # Prisma migrate
\`\`\`

## Detail-Docs
- Architektur: @docs/architecture.md
- API-Schema: @docs/api-schema.md
- Deployment: @docs/deployment.md
`,
    relatedLessons: [4, 19],
  },
  {
    id: 'ch-18',
    source: 'claude-code',
    title: 'Computer Use Workflow beschreiben',
    description:
      'Beschreibe den Computer Use Vision-Loop und erkläre wann Computer Use vs. MCP vs. Bash eingesetzt wird.',
    category: 'Prompt Engineering',
    difficulty: 'Fortgeschritten',
    timeLimit: 300,
    points: 120,
    instruction:
      'Beantworte diese Fragen zu Computer Use in Claude Code:\n\n1. Beschreibe den Vision-Loop in 3-4 Schritten\n2. Nenne die Prioritäts-Reihenfolge: Wann nutzt Claude Computer Use vs. MCP vs. Bash?\n3. Nenne 3 praktische Use Cases für Computer Use\n4. Nenne 3 Einschränkungen oder Vorsichtsmaßnahmen\n\nFormatiere deine Antwort mit Markdown-Überschriften (##).',
    starterCode: `## Der Vision-Loop\n\n## Prioritäts-Reihenfolge\n\n## Use Cases\n\n## Einschränkungen\n\n`,
    language: 'markdown',
    hints: [
      'Der Loop besteht aus: Screenshot → Analyse → Aktion → Screenshot',
      'Claude priorisiert: Connectors > MCP > Computer Use',
      'Computer Use ist aktuell macOS only und Research Preview',
      'Sensible Daten vermeiden — Claude sieht den Desktop',
    ],
    validations: [
      {
        id: 'v-18-1',
        name: 'Vision-Loop beschrieben',
        pattern: '(Screenshot|Vision|Loop|Analyse|Aktion)',
        isRegex: true,
        errorMessage: 'Beschreibe den Vision-Loop (Screenshot → Analyse → Aktion).',
        points: 30,
      },
      {
        id: 'v-18-2',
        name: 'Prioritäten erklärt',
        pattern: '(Priorit|MCP|Connector|Bash)',
        isRegex: true,
        errorMessage: 'Erkläre die Prioritäts-Reihenfolge (Connectors > MCP > Computer Use).',
        points: 30,
      },
      {
        id: 'v-18-3',
        name: 'Use Cases genannt',
        pattern: '(Use Case|Anwendung|Browser|App|Debug)',
        isRegex: true,
        errorMessage: 'Nenne mindestens 3 praktische Use Cases.',
        points: 30,
      },
      {
        id: 'v-18-4',
        name: 'Einschränkungen genannt',
        pattern: '(macOS|Research|Preview|sensib|Grenze|Einschränk|Vorsicht)',
        isRegex: true,
        errorMessage: 'Nenne Einschränkungen und Vorsichtsmaßnahmen.',
        points: 30,
      },
    ],
    solution: `## Der Vision-Loop

1. **Screenshot aufnehmen** — Claude macht einen Screenshot des aktuellen Desktops oder Fensters
2. **Analyse** — Claude analysiert den Screenshot mit seinen Vision-Fähigkeiten und versteht den aktuellen Zustand
3. **Aktion ausführen** — Claude führt die nächste Aktion aus (Mausklick, Tastatureingabe, Scrollen)
4. **Neuer Screenshot** — Der Loop beginnt von vorne um das Ergebnis zu überprüfen

## Prioritäts-Reihenfolge

Claude priorisiert immer die präziseste Methode:
1. **Direkte Connectors** (Slack, Calendar) — wenn verfügbar, immer bevorzugt
2. **MCP-Server** — für strukturierte Tool-Aufrufe (Datenbank, API)
3. **Bash-Befehle** — für Terminal-Operationen
4. **Computer Use** — nur wenn kein anderer Weg verfügbar ist

## Use Cases

1. **Browser-Testing** — UI visuell prüfen, Screenshots von Ergebnissen
2. **Dev-Tools debuggen** — Network Tab analysieren, Console Errors lesen
3. **App-Automatisierung** — Dateien in Finder organisieren, Einstellungen ändern

## Einschränkungen

1. **macOS only** — aktuell keine Windows/Linux-Unterstützung
2. **Research Preview** — Fehler sind möglich, kein Production-Einsatz
3. **Sensible Daten** — Claude sieht alles auf dem Desktop, Passwörter und private Daten vermeiden
`,
    relatedLessons: [33],
  },
  {
    id: 'ch-19',
    source: 'claude-code',
    title: 'Zwei-Claude-Methode anwenden',
    description:
      'Implementiere Boris Chernys Zwei-Claude-Methode: Session 1 plant, Session 2 reviewt.',
    category: 'Prompt Engineering',
    difficulty: 'Fortgeschritten',
    timeLimit: 360,
    points: 130,
    instruction:
      'Beschreibe den Workflow für die Zwei-Claude-Methode:\n\n1. Schreibe den Prompt für Session 1 (der Planer) — Claude soll einen Plan erstellen, KEINEN Code\n2. Schreibe den Prompt für Session 2 (der Staff Engineer) — Claude soll den Output reviewen\n3. Erkläre in 2-3 Sätzen warum diese Methode besser funktioniert als eine einzelne Session\n4. Füge die passenden /name und /color Befehle hinzu',
    starterCode: `# Session 1: Der Planer\n\n# Session 2: Der Staff Engineer\n\n# Warum funktioniert das?\n\n`,
    language: 'markdown',
    hints: [
      'Session 1 darf KEINEN Code schreiben — nur planen',
      'Session 2 hat frischen Kontext und keinen Bias vom Planen',
      'Nutze /name und /color für Organisation',
      'Boris Cherny nutzt 10-15 parallele Sessions',
    ],
    validations: [
      {
        id: 'v-19-1',
        name: 'Planer-Prompt',
        pattern: '(Plan|plan|KEIN.*Code|kein.*Code)',
        isRegex: true,
        errorMessage: 'Session 1 muss einen Plan anfordern und Code verbieten.',
        points: 30,
      },
      {
        id: 'v-19-2',
        name: 'Reviewer-Prompt',
        pattern: '(Review|review|Staff|Architektur|Edge)',
        isRegex: true,
        errorMessage: 'Session 2 muss als Reviewer/Staff Engineer agieren.',
        points: 30,
      },
      {
        id: 'v-19-3',
        name: 'Begründung',
        pattern: '(Perspektive|Bias|frisch|Kontext|Pair)',
        isRegex: true,
        errorMessage: 'Erkläre warum zwei Sessions besser sind als eine.',
        points: 30,
      },
      {
        id: 'v-19-4',
        name: 'Session-Organisation',
        pattern: '(/name|/color)',
        isRegex: true,
        errorMessage: 'Nutze /name und /color für die Session-Organisation.',
        points: 30,
      },
    ],
    solution: `# Session 1: Der Planer
/name "Feature Planer"
/color blue

"Analysiere die Anforderung und erstelle einen detaillierten Implementierungsplan
für ein User-Authentifizierungs-System mit JWT.

Schreibe KEINEN Code. Nur den Plan mit:
- Architektur-Entscheidungen
- Dateien die erstellt/geändert werden
- Reihenfolge der Schritte
- Potenzielle Risiken und Edge Cases"

# Session 2: Der Staff Engineer
/name "Code Reviewer"
/color red

"Reviewe diesen Implementierungsplan als Staff Engineer.
Fokus auf:
- Architektur: Sind die Abstraktionen richtig?
- Edge Cases: Was wurde übersehen?
- Sicherheit: Gibt es Risiken?
- Performance: Gibt es Bottlenecks?

Gib konkretes Feedback mit Verbesserungsvorschlägen."

# Warum funktioniert das?
Die Zwei-Claude-Methode funktioniert, weil Planer und Reviewer
verschiedene Perspektiven haben. Der Reviewer hat frischen Kontext
ohne den Bias des Planungsprozesses und findet dadurch Fehler,
die Session 1 übersehen hat. Es simuliert echtes Pair-Programming
mit Code Review — der Workflow von Boris Cherny, dem Creator von Claude Code.
`,
    relatedLessons: [32],
  },
  {
    id: 'ch-20',
    source: 'claude-code',
    title: '/powerup erkunden — Level 1 & 2',
    description: 'Starte das offizielle Claude Code Tutorial-System und arbeite die ersten beiden Levels durch. Lerne was /powerup zeigt und was du im Masterkurs tiefer erfährst.',
    category: 'Grundlagen',
    difficulty: 'Anfänger',
    timeLimit: 15,
    points: 75,
    instruction: `Deine Aufgabe: Erkunde /powerup und dokumentiere deine Erkenntnisse.

SCHRITT 1: /powerup starten
Öffne Claude Code und starte das Tutorial:
/powerup

SCHRITT 2: Level 1 durcharbeiten (6 Lektionen)
Arbeite alle 6 Beginner-Lektionen durch. Achte besonders auf:
- Context Management (Lektion 1)
- CLAUDE.md Basics (Lektion 2)
- Wann /clear verwenden (Lektion 3)

SCHRITT 3: Level 2 starten (mindestens Lektionen 7-9)
Schaue dir die Advanced-Lektionen zu Hooks, MCP und Sub-Agents an.

SCHRITT 4: Reflexion
Notiere in einer Datei 'powerup-learnings.md':
- 3 Features die du durch /powerup neu kennengelernt hast
- 2 Fragen die /powerup aufgeworfen hat aber nicht beantwortet hat
- 1 Feature das du als nächstes tiefer verstehen willst`,
    starterCode: '',
    language: 'bash',
    hints: [
      '/powerup ist ein Slash Command — einfach in der Claude Code Session eingeben',
      'Navigiere mit Enter (weiter) und b (zurück)',
      'q beendet /powerup und kehrt zur normalen Session zurück',
      'Du kannst direkt zu einem Level springen: /powerup --level 2',
    ],
    validations: [
      {
        testName: 'powerup-learnings.md existiert',
        pattern: 'powerup-learnings.md',
        points: 25,
      },
      {
        testName: 'Datei enthält Erkenntnisse',
        pattern: '(Features|Fragen|verstehen)',
        isRegex: true,
        points: 50,
      },
    ],
    relatedLessons: [34],
  },
  {
    id: 'ch-21',
    source: 'claude-code',
    title: 'Hooks Defer-Pattern aufbauen',
    description: 'Baue einen PreToolUse Hook der bei kritischen Befehlen die Session pausiert (Exit 3 = Defer) statt sie zu blockieren. Das Safety-Pattern für autonome headless Agents.',
    category: 'Hooks',
    difficulty: 'Fortgeschritten',
    timeLimit: 20,
    points: 125,
    instruction: `Deine Aufgabe: Implementiere einen Production-ready Defer-Hook für headless Agents.

SCHRITT 1: Hook-Script erstellen
Erstelle .claude/hooks/defer-critical.sh mit folgendem Verhalten:
- Liest den COMMAND aus dem STDIN-JSON (jq -r '.tool_input.command')
- Prüft auf kritische Operationen: "rm -rf", "DROP TABLE", "git push --force"
- Bei kritischer Operation: Gibt eine Meldung aus und beendet mit Exit 3 (Defer)
- Bei normalen Befehlen: Beendet mit Exit 0 (Allow)

SCHRITT 2: Hook in settings.json registrieren
Füge den Hook in .claude/settings.json ein:
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{"type": "command", "command": ".claude/hooks/defer-critical.sh"}]
    }]
  }
}

SCHRITT 3: Hook ausführbar machen
chmod +x .claude/hooks/defer-critical.sh

SCHRITT 4: Exit-Codes dokumentieren
Erstelle hooks-docs.md mit einer Erklärung der drei Exit-Codes:
- Exit 0: Erlauben
- Exit 2: Blockieren (Hard Stop)
- Exit 3: Defer (Pause, wartet auf --resume)`,
    starterCode: `#!/bin/bash
# .claude/hooks/defer-critical.sh
# Defer-Pattern für gefährliche Befehle (Exit 3)

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Hier: Kritische Operationen definieren und auf Defer setzen
# TODO: Array mit gefährlichen Patterns
# TODO: Loop durch Patterns, bei Match exit 3
# TODO: Am Ende exit 0

exit 0`,
    language: 'bash',
    hints: [
      'Exit 3 ist der neue Defer-Exit-Code (neu seit April 2026)',
      'DANGEROUS_PATTERNS=("rm -rf" "DROP TABLE" "git push --force")',
      'Loop: for pattern in "${DANGEROUS_PATTERNS[@]}"; do if [[ "$COMMAND" == *"$pattern"* ]]; then exit 3; fi; done',
      'Teste den Hook mit: echo \'{"tool_input":{"command":"rm -rf /tmp/test"}}\' | .claude/hooks/defer-critical.sh',
    ],
    validations: [
      {
        testName: 'Hook-Datei existiert',
        pattern: '.claude/hooks/defer-critical.sh',
        points: 25,
      },
      {
        testName: 'Exit 3 für kritische Befehle',
        pattern: 'exit 3',
        points: 50,
      },
      {
        testName: 'Hook in settings.json registriert',
        pattern: 'PreToolUse',
        points: 25,
      },
      {
        testName: 'Dokumentation erstellt',
        pattern: 'hooks-docs.md',
        points: 25,
      },
    ],
    relatedLessons: [12],
  },
  {
    id: 'ch-22',
    source: 'claude-code',
    title: 'MCP 500K Result — Schema vollständig laden',
    description: 'Konfiguriere einen MCP-Server mit dem 500K-Result-Hint und verifiziere dass große Schemas vollständig ohne Truncation ankommen.',
    category: 'MCP',
    difficulty: 'Fortgeschritten',
    timeLimit: 15,
    points: 100,
    instruction: `Deine Aufgabe: Implementiere den 500K-Result-Hint für einen MCP-Server.

SCHRITT 1: Verstehe das Problem
Ohne den _meta Hint werden große MCP-Results stillschweigend gekürzt.
Das führt zu abgeschnittenen Schemas, falschen Queries, schwer debuggbaren Fehlern.

SCHRITT 2: Erstelle eine Test-Datei
Erstelle test-schema.json mit mindestens 50 Feldern/Tabellen um ein großes DB-Schema zu simulieren.

SCHRITT 3: Implementiere einen einfachen MCP-Server-Response
Erstelle mcp-response-example.json die zeigt wie ein MCP Server Result mit dem 500K-Hint aussieht:
{
  "content": [{"type": "text", "text": "..."}],
  "_meta": {"anthropic/maxResultSizeChars": 500000}
}

SCHRITT 4: Erstelle mcp-best-practices.md
Dokumentiere:
- Was das Problem ohne den Hint war (stille Kürzung)
- Wie der _meta Hint das Problem löst
- Wann der Hint gesetzt werden sollte (große Schemas, OpenAPI-Specs, Code-Indizes)
- Welche MCP-Server-Typen besonders davon profitieren`,
    starterCode: `// mcp-response-example.json
// Zeige hier wie ein MCP Tool Result mit 500K-Hint aussieht
{
  "content": [
    {
      "type": "text",
      "text": "TODO: Großes Schema hier"
    }
  ]
  // TODO: _meta Hint hinzufügen
}`,
    language: 'json',
    hints: [
      'Der _meta Key ist ein Top-Level-Key im Response-Objekt (neben "content")',
      'Der Hint-Key lautet: "anthropic/maxResultSizeChars"',
      'Der Wert ist eine Zahl: 500000 (nicht als String)',
      'Der Hint ist optional aber Best Practice für große Results',
    ],
    validations: [
      {
        testName: '500K-Hint korrekt eingesetzt',
        pattern: '"anthropic/maxResultSizeChars"',
        points: 50,
      },
      {
        testName: 'Best Practices dokumentiert',
        pattern: 'mcp-best-practices.md',
        points: 30,
      },
      {
        testName: 'Test-Schema erstellt',
        pattern: 'test-schema.json',
        points: 20,
      },
    ],
    relatedLessons: [6],
  },
  {
    id: 'ch-23',
    source: 'claude-code',
    title: 'Managed Agent konfigurieren',
    description: 'Erstelle eine vollständige agent.json Konfiguration für einen konkreten Use-Case und berechne die monatlichen Kosten.',
    category: 'Agents',
    difficulty: 'Fortgeschritten',
    timeLimit: 20,
    points: 125,
    instruction: `Deine Aufgabe: Konfiguriere einen Claude Managed Agent für einen realen Use-Case.

SCHRITT 1: Use-Case wählen
Wähle einen dieser Use-Cases (oder deinen eigenen):
A) PR-Review-Agent: Reviewt alle neuen Pull Requests
B) Daily Standup Summarizer: Sendet täglich 9 Uhr einen Team-Report
C) Issue-Triage-Agent: Kategorisiert neue GitHub Issues automatisch

SCHRITT 2: agent.json erstellen
Erstelle eine vollständige agent.json mit:
- name und description
- model (claude-sonnet-4-6 empfohlen)
- tools (nur was wirklich nötig ist — Principle of Least Privilege)
- schedule (cron oder trigger)
- permissions (read + write + deny für nicht benötigte Aktionen)
- context (system prompt auf Deutsch)
- monitoring (Slack-Alert bei Fehlern)

SCHRITT 3: Kosten-Kalkulation
Erstelle costs.md mit Berechnung:
- Infra-Kosten: Laufzeit-Stunden × $0.08
- Geschätzte Token-Kosten pro Run
- Vergleich: Was würde es kosten das manuell zu machen?

SCHRITT 4: Security-Review
Ergänze security-notes.md:
- Welche Permissions hat der Agent?
- Welche wurden bewusst in deny gesetzt?
- Gibt es Human-in-the-Loop Anforderungen?`,
    starterCode: `// agent.json — Claude Managed Agent Konfiguration
{
  "name": "TODO: agent-name",
  "description": "TODO: Was macht dieser Agent?",
  "model": "claude-sonnet-4-6",
  "tools": [
    // TODO: Nur die wirklich nötigen Tools
  ],
  "schedule": {
    // TODO: trigger oder cron?
  },
  "permissions": {
    "read": [],
    "write": [],
    "deny": []
  },
  "context": {
    "system": "TODO: System-Prompt auf Deutsch"
  }
}`,
    language: 'json',
    hints: [
      'Principle of Least Privilege: Füge Tools nur hinzu wenn wirklich nötig',
      'On-Demand Trigger ist günstiger als cron bei seltenen Events',
      'Kosten: Infra = Laufzeit × $0.08, Token ≈ $0.01-0.05 pro komplexem Run',
      'claude-sonnet-4-6 ist für die meisten Agent-Aufgaben das beste Preis-Leistungs-Verhältnis',
    ],
    validations: [
      {
        testName: 'agent.json vollständig',
        pattern: '"model"',
        points: 40,
      },
      {
        testName: 'Permissions definiert',
        pattern: '"permissions"',
        points: 30,
      },
      {
        testName: 'Kosten-Kalkulation erstellt',
        pattern: 'costs.md',
        points: 30,
      },
      {
        testName: 'Security-Review dokumentiert',
        pattern: 'security-notes.md',
        points: 25,
      },
    ],
    relatedLessons: [28, 35],
  },
  {
    id: 'ch-24',
    source: 'claude-code',
    title: 'Verification-First Prompting üben',
    description: 'Schreibe 5 Aufgaben-Prompts mit konkreten Verifikationskriterien nach der Boris Cherny Methode. Das ist laut Claude Code Creator der größte einzelne Qualitätshebel.',
    category: 'Prompts & Patterns',
    difficulty: 'Anfänger',
    timeLimit: 15,
    points: 75,
    instruction: `Deine Aufgabe: Transformiere vage Prompts in Verification-First Prompts.

HINTERGRUND:
Boris Cherny (Creator von Claude Code) sagt: "Giving Claude verification criteria is the
single highest-leverage practice. This alone gives a 2-3x quality improvement."

Das Prinzip: Jeder Prompt enthält nicht nur die Aufgabe, sondern auch konkrete,
testbare Kriterien die zeigen wann die Aufgabe erfolgreich abgeschlossen ist.

SCHRITT 1: Erstelle verification-prompts.md

SCHRITT 2: Transformiere diese 5 vagen Prompts:

Prompt 1 (Vage):
"Implement user authentication"

Prompt 2 (Vage):
"Fix the performance issue"

Prompt 3 (Vage):
"Add form validation"

Prompt 4 (Vage):
"Refactor the database module"

Prompt 5 (Vage):
"Write tests for the API"

SCHRITT 3: Für jeden Prompt — schreibe eine verbesserte Version mit:
- Klarer Aufgabenbeschreibung
- 3-5 konkrete Verifikationskriterien (testbar, messbar)
- Mindestens 1 Kriterium das automatisch testbar ist (npm test, curl, etc.)

FORMAT:
## Prompt 1: User Authentication
**Aufgabe:** Implementiere User Authentication mit JWT...
**Verification:**
- [ ] npm test passes (42 tests green)
- [ ] Login mit test@example.com + password123 funktioniert
- [ ] Invalid credentials geben 401 zurück
- [ ] /dashboard ist nur für eingeloggte User zugänglich`,
    starterCode: `# verification-prompts.md

## Prompt 1: User Authentication

**Vage Version (schlecht):**
"Implement user authentication"

**Verification-First Version (gut):**
Implementiere User Authentication mit JWT.

Verification:
- [ ] TODO: Testbares Kriterium 1
- [ ] TODO: Testbares Kriterium 2
- [ ] TODO: Testbares Kriterium 3

## Prompt 2: Performance Fix
...`,
    language: 'bash',
    hints: [
      'Gute Verifikationskriterien sind messbar: "npm test green", nicht "Code ist korrekt"',
      'Mindestens 1 automatisch testbares Kriterium pro Prompt (Shell-Command, URL-Test)',
      'Denke aus der Perspektive des Testers: Wie würdest du beweisen dass die Aufgabe erledigt ist?',
      'Boris Cherny Formel: Aufgabe + "Verification:" + Liste testbarer Kriterien',
    ],
    validations: [
      {
        testName: 'Alle 5 Prompts transformiert',
        pattern: '(Prompt 1|Prompt 2|Prompt 3|Prompt 4|Prompt 5)',
        isRegex: true,
        points: 25,
      },
      {
        testName: 'Verifikationskriterien vorhanden',
        pattern: 'Verification',
        points: 25,
      },
      {
        testName: 'Testbare Kriterien (Checkboxen)',
        pattern: '- \\[ \\]',
        isRegex: true,
        points: 25,
      },
    ],
    relatedLessons: [14, 17],
  },
  // ─── Neue Challenges für April-2026-Features ───
  {
    id: 'ch-opus47-migration',
    source: 'claude-code',
    title: 'Migrations-Befehl auf Opus 4.7 mit xhigh',
    description:
      'Schreibe den Claude Code CLI-Befehl, der einen komplexen Refactor mit Opus 4.7, xhigh-Effort und Task-Budget startet.',
    category: 'CLI Befehle',
    difficulty: 'Fortgeschritten',
    timeLimit: 300,
    points: 100,
    instruction:
      'Erstelle einen CLI-Befehl, der den neuen Opus 4.7 nutzt, mit xhigh-Effort-Level läuft und ein Task-Budget von 50000 Tokens setzt. Der Prompt soll lauten: "Refactor the auth middleware to support OAuth2 PKCE".',
    starterCode: `# Schreibe den vollständigen CLI-Befehl:
`,
    language: 'bash',
    hints: [
      'Das neue Modell heißt claude-opus-4-7',
      'Der neue Effort-Level für tiefstes Reasoning ist xhigh',
      'Task-Budget wird mit --task-budget gesetzt',
    ],
    validations: [
      {
        id: 'v-opus47-1',
        name: 'Claude Befehl',
        pattern: 'claude',
        isRegex: false,
        errorMessage: 'Der Befehl muss mit "claude" beginnen.',
        points: 20,
      },
      {
        id: 'v-opus47-2',
        name: 'Opus 4.7 Modell',
        pattern: '--model\\s+claude-opus-4-7',
        isRegex: true,
        errorMessage: 'Setze --model claude-opus-4-7.',
        points: 25,
      },
      {
        id: 'v-opus47-3',
        name: 'xhigh-Effort',
        pattern: '--effort\\s+xhigh',
        isRegex: true,
        errorMessage: 'Setze --effort xhigh für tiefstes Reasoning.',
        points: 25,
      },
      {
        id: 'v-opus47-4',
        name: 'Task-Budget 50000',
        pattern: '--task-budget\\s+50000',
        isRegex: true,
        errorMessage: 'Setze --task-budget 50000.',
        points: 20,
      },
      {
        id: 'v-opus47-5',
        name: 'OAuth2-Prompt',
        pattern: 'OAuth2 PKCE',
        isRegex: false,
        errorMessage: 'Der Prompt muss "OAuth2 PKCE" enthalten.',
        points: 10,
      },
    ],
    solution: `claude --model claude-opus-4-7 --effort xhigh --task-budget 50000 "Refactor the auth middleware to support OAuth2 PKCE"`,
    relatedLessons: [37],
  },
  {
    id: 'ch-ultraplan-trigger',
    source: 'claude-code',
    title: 'Ultraplan für Auth-Migration starten',
    description:
      'Trigger Ultraplan korrekt für eine komplexe Migration. Welcher Slash-Command und welcher Prompt sind nötig?',
    category: 'CLI Befehle',
    difficulty: 'Fortgeschritten',
    timeLimit: 240,
    points: 80,
    instruction:
      'Schreibe den Slash-Command, der Ultraplan startet, um eine Migration des Auth-Service von Sessions zu JWTs zu planen. Der Prompt muss "migrate the auth service from sessions to JWTs" enthalten.',
    starterCode: `# Schreibe den Ultraplan-Befehl:
`,
    language: 'bash',
    hints: [
      'Ultraplan wird mit /ultraplan gestartet',
      'Der Prompt folgt direkt nach dem Slash-Command',
      'Vergiss nicht den genauen Migrations-Text',
    ],
    validations: [
      {
        id: 'v-ultraplan-1',
        name: 'Slash-Command /ultraplan',
        pattern: '/ultraplan',
        isRegex: false,
        errorMessage: 'Nutze den Slash-Command /ultraplan.',
        points: 40,
      },
      {
        id: 'v-ultraplan-2',
        name: 'Migrations-Prompt',
        pattern: 'migrate the auth service from sessions to JWTs',
        isRegex: false,
        errorMessage: 'Der Prompt muss exakt "migrate the auth service from sessions to JWTs" enthalten.',
        points: 40,
      },
    ],
    solution: `/ultraplan migrate the auth service from sessions to JWTs`,
    relatedLessons: [36],
  },
  {
    id: 'ch-monitor-devserver',
    source: 'claude-code',
    title: 'Monitor Tool für Dev-Server',
    description:
      'Setze Monitor Tool ein um den Dev-Server zu beobachten und Claude nur bei Errors zu wecken.',
    category: 'Hooks & Automation',
    difficulty: 'Fortgeschritten',
    timeLimit: 360,
    points: 120,
    instruction:
      'Schreibe einen Monitor-Aufruf, der "npm run dev" als Background-Prozess startet. Setze ein until-Pattern, das auf "Error" oder "FAIL" reagiert. Die reason-Beschreibung soll "Watch dev server during refactor" lauten.',
    starterCode: `# Monitor-Aufruf für Dev-Server:
`,
    language: 'bash',
    hints: [
      'Monitor wird mit Monitor("command", ...) aufgerufen',
      'until-Pattern verwendet Regex mit | für ODER',
      'reason-Feld dokumentiert was beobachtet wird',
    ],
    validations: [
      {
        id: 'v-monitor-1',
        name: 'Monitor-Aufruf',
        pattern: 'Monitor\\(',
        isRegex: true,
        errorMessage: 'Nutze Monitor(...) als Aufruf.',
        points: 30,
      },
      {
        id: 'v-monitor-2',
        name: 'npm run dev Befehl',
        pattern: 'npm run dev',
        isRegex: false,
        errorMessage: 'Der überwachte Befehl muss "npm run dev" sein.',
        points: 30,
      },
      {
        id: 'v-monitor-3',
        name: 'until-Pattern mit Error/FAIL',
        pattern: 'until[^,]*Error.*FAIL|until[^,]*FAIL.*Error',
        isRegex: true,
        errorMessage: 'until-Pattern muss "Error" und "FAIL" enthalten (mit |).',
        points: 30,
      },
      {
        id: 'v-monitor-4',
        name: 'reason-Feld',
        pattern: 'Watch dev server during refactor',
        isRegex: false,
        errorMessage: 'reason muss "Watch dev server during refactor" lauten.',
        points: 30,
      },
    ],
    solution: `Monitor("npm run dev",
  reason: "Watch dev server during refactor",
  until: "Error|FAIL")`,
    relatedLessons: [38],
  },
  {
    id: 'ch-monitor-tests',
    source: 'claude-code',
    title: 'Monitor für Test-Suite mit Early-Exit',
    description:
      'Nutze Monitor um eine pytest-Suite zu beobachten und beim ersten FAILED zu reagieren.',
    category: 'Hooks & Automation',
    difficulty: 'Expert',
    timeLimit: 300,
    points: 150,
    instruction:
      'Erstelle einen Monitor-Aufruf für "pytest tests/ -v --tb=short". Das until-Pattern soll auf "FAILED", "ERROR" oder "passed" reagieren. reason: "Catch first failing test during migration".',
    starterCode: `# Monitor für pytest mit Early-Exit:
`,
    language: 'bash',
    hints: [
      'pytest-Befehl mit Flags genau übernehmen',
      'until-Pattern: drei Optionen mit | trennen',
      'reason hilft beim Debugging später',
    ],
    validations: [
      {
        id: 'v-mt-1',
        name: 'Monitor-Aufruf',
        pattern: 'Monitor\\(',
        isRegex: true,
        errorMessage: 'Nutze Monitor(...) als Aufruf.',
        points: 30,
      },
      {
        id: 'v-mt-2',
        name: 'pytest-Befehl',
        pattern: 'pytest tests/ -v --tb=short',
        isRegex: false,
        errorMessage: 'Der pytest-Befehl muss exakt übernommen werden.',
        points: 40,
      },
      {
        id: 'v-mt-3',
        name: 'until: FAILED|ERROR|passed',
        pattern: 'FAILED.*ERROR.*passed|FAILED.*passed.*ERROR|ERROR.*FAILED.*passed|ERROR.*passed.*FAILED|passed.*FAILED.*ERROR|passed.*ERROR.*FAILED',
        isRegex: true,
        errorMessage: 'until muss FAILED, ERROR und passed enthalten.',
        points: 50,
      },
      {
        id: 'v-mt-4',
        name: 'reason-Text',
        pattern: 'Catch first failing test during migration',
        isRegex: false,
        errorMessage: 'reason muss "Catch first failing test during migration" lauten.',
        points: 30,
      },
    ],
    solution: `Monitor("pytest tests/ -v --tb=short",
  reason: "Catch first failing test during migration",
  until: "FAILED|ERROR|passed")`,
    relatedLessons: [38],
  },
  {
    id: 'ch-task-budget-ci',
    source: 'claude-code',
    title: 'Task-Budget für CI-Pipeline',
    description:
      'Schreibe einen autonomen Claude-Befehl mit Task-Budget für eine nächtliche CI-Pipeline.',
    category: 'CLI Befehle',
    difficulty: 'Fortgeschritten',
    timeLimit: 300,
    points: 100,
    instruction:
      'Schreibe einen headless Claude-Befehl (mit -p), der Opus 4.7 nutzt, ein Task-Budget von 100000 Tokens setzt und folgenden Prompt ausführt: "Run weekly cleanup tasks per CLAUDE.md".',
    starterCode: `# Headless Claude-Befehl mit Task-Budget:
`,
    language: 'bash',
    hints: [
      'Headless-Modus = -p Flag',
      '--task-budget für Token-Limit pro Task',
      'Modell-Flag --model nutzen',
    ],
    validations: [
      {
        id: 'v-tbci-1',
        name: 'Headless -p',
        pattern: '-p\\s',
        isRegex: true,
        errorMessage: 'Nutze -p für headless-Modus.',
        points: 25,
      },
      {
        id: 'v-tbci-2',
        name: 'Opus 4.7 Modell',
        pattern: '--model\\s+claude-opus-4-7',
        isRegex: true,
        errorMessage: 'Setze --model claude-opus-4-7.',
        points: 25,
      },
      {
        id: 'v-tbci-3',
        name: 'Task-Budget 100000',
        pattern: '--task-budget\\s+100000',
        isRegex: true,
        errorMessage: 'Setze --task-budget 100000.',
        points: 30,
      },
      {
        id: 'v-tbci-4',
        name: 'Cleanup-Prompt',
        pattern: 'Run weekly cleanup tasks per CLAUDE.md',
        isRegex: false,
        errorMessage: 'Der Prompt muss exakt übernommen werden.',
        points: 20,
      },
    ],
    solution: `claude --model claude-opus-4-7 --task-budget 100000 -p "Run weekly cleanup tasks per CLAUDE.md"`,
    relatedLessons: [37],
  },
  {
    id: 'ch-ultrareview-ci',
    source: 'claude-code',
    title: '/ultrareview als CI-Gate einrichten',
    description: 'Schreibe einen GitHub-Actions-Step, der `claude ultrareview` headless auf den PR-Link ausführt.',
    category: 'CI/CD',
    difficulty: 'Fortgeschritten',
    timeLimit: 300,
    points: 120,
    instruction:
      'Schreibe einen GitHub-Actions-Step (YAML) der den Step-Namen "Claude Ultrareview" trägt, claude ultrareview mit ${{ github.event.pull_request.html_url }} aufruft und ANTHROPIC_API_KEY aus Secrets setzt.',
    starterCode: `# .github/workflows/review.yml — Step ergänzen:
- name: Claude Ultrareview
`,
    language: 'yaml',
    hints: [
      'Step-Name: "Claude Ultrareview"',
      'run: claude ultrareview <PR-URL>',
      'env: ANTHROPIC_API_KEY aus secrets lesen',
    ],
    validations: [
      {
        id: 'v-ucr-1',
        name: 'Step-Name',
        pattern: 'name: Claude Ultrareview',
        isRegex: false,
        errorMessage: 'Step muss "name: Claude Ultrareview" enthalten.',
        points: 30,
      },
      {
        id: 'v-ucr-2',
        name: 'ultrareview-Aufruf',
        pattern: 'claude ultrareview',
        isRegex: false,
        errorMessage: 'run muss claude ultrareview aufrufen.',
        points: 30,
      },
      {
        id: 'v-ucr-3',
        name: 'PR-URL Variable',
        pattern: 'github\\.event\\.pull_request\\.html_url',
        isRegex: true,
        errorMessage: 'Nutze ${{ github.event.pull_request.html_url }}.',
        points: 20,
      },
      {
        id: 'v-ucr-4',
        name: 'API-Key aus Secrets',
        pattern: 'secrets\\.ANTHROPIC_API_KEY',
        isRegex: true,
        errorMessage: 'ANTHROPIC_API_KEY muss aus secrets kommen.',
        points: 20,
      },
    ],
    solution: `- name: Claude Ultrareview
  run: claude ultrareview \${{ github.event.pull_request.html_url }}
  env:
    ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}`,
    relatedLessons: [41],
  },
  {
    id: 'ch-managed-agents-session',
    source: 'claude-code',
    title: 'Managed-Agents-Session mit Memory erstellen',
    description: 'Erstelle in Python eine Managed-Agents-Session mit aktivierter Memory-Beta und namespace "masterkurs".',
    category: 'Agents',
    difficulty: 'Fortgeschritten',
    timeLimit: 300,
    points: 130,
    instruction:
      'Schreibe Python-Code, der mit anthropic.Anthropic() einen Client erzeugt und client.agents.sessions.create(...) aufruft. Setze name="weekly-content-agent", model="claude-opus-4-7", aktiviere Memory mit namespace "masterkurs".',
    starterCode: `import anthropic

client = anthropic.Anthropic()
# Session mit Memory-Beta erstellen:
`,
    language: 'python',
    hints: [
      'client.agents.sessions.create(...)',
      'memory={"enabled": True, "namespace": "..."}',
      'model="claude-opus-4-7"',
    ],
    validations: [
      {
        id: 'v-mas-1',
        name: 'sessions.create-Aufruf',
        pattern: 'client\\.agents\\.sessions\\.create',
        isRegex: true,
        errorMessage: 'Rufe client.agents.sessions.create(...) auf.',
        points: 25,
      },
      {
        id: 'v-mas-2',
        name: 'Session-Name',
        pattern: 'name="weekly-content-agent"|name=\'weekly-content-agent\'',
        isRegex: true,
        errorMessage: 'name muss "weekly-content-agent" sein.',
        points: 25,
      },
      {
        id: 'v-mas-3',
        name: 'Opus 4.7 Modell',
        pattern: 'model="claude-opus-4-7"|model=\'claude-opus-4-7\'',
        isRegex: true,
        errorMessage: 'Setze model="claude-opus-4-7".',
        points: 25,
      },
      {
        id: 'v-mas-4',
        name: 'Memory mit Namespace',
        pattern: '"enabled":\\s*True[\\s\\S]*"namespace":\\s*"masterkurs"',
        isRegex: true,
        errorMessage: 'memory muss enabled=True und namespace="masterkurs" enthalten.',
        points: 25,
      },
    ],
    solution: `import anthropic

client = anthropic.Anthropic()
session = client.agents.sessions.create(
    name="weekly-content-agent",
    model="claude-opus-4-7",
    tools=[{"type": "code_execution"}, {"type": "web_search"}],
    memory={"enabled": True, "namespace": "masterkurs"},
)`,
    relatedLessons: [40],
  },
  {
    id: 'ch-effort-command',
    source: 'claude-code',
    title: '/effort-Command nutzen',
    description: 'Setze den Effort-Level explizit auf high für eine komplexe Refactor-Aufgabe.',
    category: 'CLI Befehle',
    difficulty: 'Anfänger',
    timeLimit: 180,
    points: 80,
    instruction:
      'Schreibe einen Claude-Befehl, der --effort high explizit setzt und folgenden Prompt ausführt: "Migrate the user model to soft-delete pattern".',
    starterCode: `# Befehl mit explizitem Effort:
`,
    language: 'bash',
    hints: [
      '--effort high als Flag',
      'Default ist seit 07.04.2026 wieder high — explizit setzen ist trotzdem gut',
      'Prompt in Anführungszeichen',
    ],
    validations: [
      {
        id: 'v-eff-1',
        name: 'claude-Befehl',
        pattern: '^\\s*claude\\s',
        isRegex: true,
        errorMessage: 'Beginne mit claude.',
        points: 20,
      },
      {
        id: 'v-eff-2',
        name: '--effort high',
        pattern: '--effort\\s+high',
        isRegex: true,
        errorMessage: 'Setze --effort high.',
        points: 40,
      },
      {
        id: 'v-eff-3',
        name: 'Prompt-Text',
        pattern: 'Migrate the user model to soft-delete pattern',
        isRegex: false,
        errorMessage: 'Der Prompt muss exakt übernommen werden.',
        points: 40,
      },
    ],
    solution: `claude --effort high "Migrate the user model to soft-delete pattern"`,
    relatedLessons: [39],
  },
  {
    id: 'ch-rewind-instead-correct',
    source: 'claude-code',
    title: '/rewind statt Korrektur-Prompt',
    description: 'Du hast festgestellt, dass Claude in die falsche Richtung gelaufen ist. Wähle den richtigen Befehl.',
    category: 'Slash Commands',
    difficulty: 'Anfänger',
    timeLimit: 120,
    points: 60,
    instruction:
      'Schreibe den Slash-Command, der die letzte Konversation und die zugehörigen Code-Änderungen rückgängig macht (statt mit weiteren Korrektur-Prompts den Context zu verschmutzen).',
    starterCode: ``,
    language: 'bash',
    hints: [
      'Es ist ein Slash-Command',
      'Alias seit 2.1.108: /undo',
      'Macht auch File-Changes rückgängig',
    ],
    validations: [
      {
        id: 'v-rw-1',
        name: 'rewind oder undo',
        pattern: '^\\s*/(rewind|undo)\\s*$',
        isRegex: true,
        errorMessage: 'Tippe /rewind (oder /undo).',
        points: 100,
      },
    ],
    solution: `/rewind`,
    relatedLessons: [39],
  },
  {
    id: 'ch-prompt-caching-1h',
    source: 'claude-code',
    title: '1h-Prompt-Caching aktivieren',
    description: 'Aktiviere die 1-Stunden-TTL für Prompt-Caching für die aktuelle Claude-Session.',
    category: 'CLI Befehle',
    difficulty: 'Anfänger',
    timeLimit: 120,
    points: 70,
    instruction:
      'Schreibe einen Bash-Befehl, der ENABLE_PROMPT_CACHING_1H=1 als Environment-Variable inline setzt und claude startet.',
    starterCode: ``,
    language: 'bash',
    hints: [
      'Inline-Env-Var: VAR=wert command',
      'Wert ist 1 (nicht "true")',
      'Danach claude aufrufen',
    ],
    validations: [
      {
        id: 'v-pc1-1',
        name: 'Env-Var korrekt',
        pattern: 'ENABLE_PROMPT_CACHING_1H=1',
        isRegex: false,
        errorMessage: 'Setze ENABLE_PROMPT_CACHING_1H=1.',
        points: 60,
      },
      {
        id: 'v-pc1-2',
        name: 'claude-Befehl',
        pattern: '\\bclaude\\b',
        isRegex: true,
        errorMessage: 'Starte claude im selben Befehl.',
        points: 40,
      },
    ],
    solution: `ENABLE_PROMPT_CACHING_1H=1 claude`,
    relatedLessons: [39],
  },
  {
    id: 'ch-plugin-url-session',
    source: 'claude-code',
    title: 'Plugin via --plugin-url aus URL aktivieren',
    description: 'Aktiviere ein Plugin-ZIP aus einer URL für die aktuelle Session — ohne globalen Install.',
    category: 'Plugins',
    difficulty: 'Fortgeschritten',
    timeLimit: 600,
    points: 100,
    instruction:
      'Schreibe den Befehl, mit dem du Claude Code mit dem Plugin-ZIP von https://github.com/cittasana/cc-plugins/releases/download/v0.3.1/masterkurs-toolkit.zip startest. Das Plugin soll nur für diese Session aktiv sein — kein globaler Install.',
    starterCode: '',
    language: 'bash',
    hints: [
      'Das Flag heißt --plugin-url',
      'URL wird als Argument direkt nach dem Flag übergeben',
      'Funktioniert seit Claude Code 2.1.129',
    ],
    validations: [
      {
        id: 'v-pu-1',
        name: '--plugin-url Flag',
        pattern: '--plugin-url',
        isRegex: false,
        errorMessage: 'Nutze das --plugin-url Flag.',
        points: 50,
      },
      {
        id: 'v-pu-2',
        name: 'claude-Befehl mit URL',
        pattern: 'claude\\s+--plugin-url\\s+https://',
        isRegex: true,
        errorMessage: 'claude muss vor --plugin-url stehen, gefolgt von einer https-URL.',
        points: 50,
      },
    ],
    solution: 'claude --plugin-url https://github.com/cittasana/cc-plugins/releases/download/v0.3.1/masterkurs-toolkit.zip',
    relatedLessons: [42],
  },
  {
    id: 'ch-skill-overrides',
    source: 'claude-code',
    title: 'Skill-Bloat mit skillOverrides reduzieren',
    description: 'Konfiguriere drei Skills mit unterschiedlichen Override-Modi in settings.json.',
    category: 'Skills',
    difficulty: 'Fortgeschritten',
    timeLimit: 600,
    points: 150,
    instruction:
      'Schreibe einen JSON-Block für ~/.claude/settings.json mit einem skillOverrides-Objekt. Setze "ads-tiktok" auf "off", "seo-page" auf "name-only" und "industrial-brutalist-ui" auf "user-invocable-only".',
    starterCode: `{
  "skillOverrides": {

  }
}`,
    language: 'json',
    hints: [
      'Das Top-Level-Key heißt "skillOverrides"',
      'Werte sind Strings: "off" | "user-invocable-only" | "name-only"',
      'Achte auf gültiges JSON (Anführungszeichen, Kommas)',
    ],
    validations: [
      {
        id: 'v-so-1',
        name: 'skillOverrides Key',
        pattern: '"skillOverrides"',
        isRegex: false,
        errorMessage: 'Top-Level-Key "skillOverrides" fehlt.',
        points: 30,
      },
      {
        id: 'v-so-2',
        name: 'ads-tiktok off',
        pattern: '"ads-tiktok"\\s*:\\s*"off"',
        isRegex: true,
        errorMessage: '"ads-tiktok" muss auf "off" stehen.',
        points: 40,
      },
      {
        id: 'v-so-3',
        name: 'seo-page name-only',
        pattern: '"seo-page"\\s*:\\s*"name-only"',
        isRegex: true,
        errorMessage: '"seo-page" muss auf "name-only" stehen.',
        points: 40,
      },
      {
        id: 'v-so-4',
        name: 'industrial-brutalist-ui user-invocable-only',
        pattern: '"industrial-brutalist-ui"\\s*:\\s*"user-invocable-only"',
        isRegex: true,
        errorMessage: '"industrial-brutalist-ui" muss auf "user-invocable-only" stehen.',
        points: 40,
      },
    ],
    solution: `{
  "skillOverrides": {
    "ads-tiktok": "off",
    "seo-page": "name-only",
    "industrial-brutalist-ui": "user-invocable-only"
  }
}`,
    relatedLessons: [42],
  },
  {
    id: 'ch-package-auto-update',
    source: 'claude-code',
    title: 'Auto-Update für Workshop-Maschinen aktivieren',
    description: 'Setze die Env-Variable, damit Claude Code sich auf Brew/WinGet selbst aktualisiert.',
    category: 'Konfiguration',
    difficulty: 'Anfänger',
    timeLimit: 300,
    points: 50,
    instruction:
      'Schreibe die Zeile, die du in ~/.zshrc oder ~/.bashrc ergänzt, damit Claude Code Auto-Update auf Homebrew/WinGet aktiviert wird (Env-Variable mit Wert 1).',
    starterCode: '',
    language: 'bash',
    hints: [
      'Die Env-Variable heißt CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE',
      'Wert: 1',
      'Nutze export, damit es in allen Subshells gilt',
    ],
    validations: [
      {
        id: 'v-au-1',
        name: 'export Statement',
        pattern: 'export\\s+CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE=1',
        isRegex: true,
        errorMessage: 'Erwartet: export CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE=1',
        points: 100,
      },
    ],
    solution: 'export CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE=1',
    relatedLessons: [42],
  },
  {
    id: 'ch-pre-compact-brief',
    source: 'claude-code',
    title: 'Pre-Compact-Brief schreiben',
    description: 'Übe das Schreiben eines Status-Briefs vor /compact — der Schlüssel zur Compaction-Hygiene.',
    category: 'Context Management',
    difficulty: 'Anfänger',
    timeLimit: 600,
    points: 100,
    instruction:
      'Schreibe einen Pre-Compact-Brief für folgenden Debug-Stand: 500-Error auf POST /api/orders, Vermutung Stripe-Webhook-Race, bisher Logs geprüft, nächster Schritt Idempotency-Key. Der Brief muss die Strings "debuggen", "Vermutung" und "Naechster Schritt" enthalten und mit /compact enden.',
    starterCode: '',
    language: 'markdown',
    hints: [
      'Drei Anker: Was machen wir? Was wissen wir? Was kommt als nächstes?',
      'Der letzte Befehl muss /compact sein',
      'Spezifisch sein — Endpoint, Vermutung, nächster Schritt',
    ],
    validations: [
      {
        id: 'v-pcb-1',
        name: 'Was-Anker (debuggen)',
        pattern: 'debuggen',
        isRegex: false,
        errorMessage: 'Brief muss "debuggen" enthalten (Was machen wir).',
        points: 25,
      },
      {
        id: 'v-pcb-2',
        name: 'Vermutung',
        pattern: 'Vermutung',
        isRegex: false,
        errorMessage: 'Brief muss "Vermutung" enthalten (Was wissen wir).',
        points: 25,
      },
      {
        id: 'v-pcb-3',
        name: 'Naechster Schritt',
        pattern: 'Naechster Schritt|Nächster Schritt',
        isRegex: true,
        errorMessage: 'Brief muss "Naechster Schritt" enthalten (Was kommt als nächstes).',
        points: 25,
      },
      {
        id: 'v-pcb-4',
        name: '/compact am Ende',
        pattern: '/compact\\s*$',
        isRegex: true,
        errorMessage: 'Letzte Zeile muss /compact sein.',
        points: 25,
      },
    ],
    solution: `Wir debuggen 500-Error auf POST /api/orders.
Vermutung: Stripe-Webhook-Race zwischen payment_intent.succeeded
und unsere idempotency_key-Pruefung.
Bisher: Webhook-Logs gepruefty (timing inconsistent), DB-Locks ausgeschlossen.
Naechster Schritt: Idempotency-Key-Reuse-Window pruefen.
/compact`,
    relatedLessons: [43],
  },
  {
    id: 'ch-session-id-hook',
    source: 'claude-code',
    title: 'Audit-Trail mit CLAUDE_CODE_SESSION_ID',
    description: 'Schreibe einen Bash-Befehl, der die Session-ID in eine SQLite-DB einfügt.',
    category: 'Hooks',
    difficulty: 'Fortgeschritten',
    timeLimit: 600,
    points: 100,
    instruction:
      'Schreibe einen sqlite3-Befehl, der eine Zeile in die Tabelle "events" einfügt, mit der aktuellen Session-ID aus $CLAUDE_CODE_SESSION_ID, dem festen Wert "Bash" als tool und datetime("now") als Timestamp. DB-Pfad: ~/.claude/events.db.',
    starterCode: '',
    language: 'bash',
    hints: [
      'Die Env-Variable heißt $CLAUDE_CODE_SESSION_ID',
      'sqlite3 ~/.claude/events.db "INSERT INTO events ..."',
      'datetime("now") gibt den aktuellen Timestamp',
    ],
    validations: [
      {
        id: 'v-sid-1',
        name: 'sqlite3 Command',
        pattern: 'sqlite3\\s+~/.claude/events\\.db',
        isRegex: true,
        errorMessage: 'Nutze sqlite3 ~/.claude/events.db.',
        points: 30,
      },
      {
        id: 'v-sid-2',
        name: 'Session-ID Env-Var',
        pattern: '\\$CLAUDE_CODE_SESSION_ID',
        isRegex: true,
        errorMessage: 'Referenziere $CLAUDE_CODE_SESSION_ID.',
        points: 35,
      },
      {
        id: 'v-sid-3',
        name: 'INSERT INTO events',
        pattern: 'INSERT\\s+INTO\\s+events',
        isRegex: true,
        errorMessage: 'INSERT INTO events fehlt.',
        points: 35,
      },
    ],
    solution: `sqlite3 ~/.claude/events.db "INSERT INTO events(session_id, tool, ts) VALUES('$CLAUDE_CODE_SESSION_ID', 'Bash', datetime('now'))"`,
    relatedLessons: [42, 43],
  },
];

/** Alle Kategorien extrahieren */
export const challengeCategories: string[] = [
  ...new Set(challenges.map((c) => c.category)),
];

/** Alle Schwierigkeitsgrade */
export const challengeDifficulties: string[] = ['Anfänger', 'Fortgeschritten', 'Expert'];

/** Challenges nach Schwierigkeit filtern */
export function getChallengesByDifficulty(difficulty: string): CodingChallenge[] {
  return challenges.filter((c) => c.difficulty === difficulty);
}

/** Challenges nach Kategorie filtern */
export function getChallengesByCategory(category: string): CodingChallenge[] {
  return challenges.filter((c) => c.category === category);
}
