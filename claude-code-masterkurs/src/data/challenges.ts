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
