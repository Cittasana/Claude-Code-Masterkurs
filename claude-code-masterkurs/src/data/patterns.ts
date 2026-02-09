import type { CommunityPattern } from '../types';

export const patterns: CommunityPattern[] = [
  // ========== Prompts ==========
  {
    id: 'p-code-review',
    title: 'Strukturiertes Code-Review',
    description: 'Bittet Claude um ein systematisches Review mit Kategorien (Bugs, Style, Performance, Sicherheit).',
    category: 'Prompts',
    author: 'CCM Community',
    snippet: `Führe ein strukturiertes Code-Review durch. Gehe alle geänderten Dateien durch und gib Feedback in diesen Kategorien:
1. **Bugs & Logik**: Potenzielle Fehler oder Edge Cases
2. **Code-Style**: Lesbarkeit, Namensgebung, Konsistenz
3. **Performance**: Verbesserungspotenzial
4. **Sicherheit**: Sensible Daten, Injection-Risiken
Pro Datei max. 3 Punkte pro Kategorie. Am Ende eine kurze Prioritäten-Liste.`,
    tags: ['review', 'qualität', 'feedback'],
    useCase: 'Nach größeren Änderungen oder vor PR',
  },
  {
    id: 'p-refactor-safe',
    title: 'Sicherer Refactor mit Tests',
    description: 'Refactoring-Anfrage mit Fokus auf bestehende Tests und schrittweise Änderungen.',
    category: 'Prompts',
    author: 'CCM Community',
    snippet: `Refaktoriere [Funktion/Modul] so, dass:
1. Die bestehenden Tests weiterhin grün bleiben (führe sie aus)
2. Du maximal 3 kleine, atomare Schritte vorschlägst
3. Jeder Schritt einzeln umsetzbar und rückgängig machbar ist
Zeige mir zuerst den Plan, dann setze wir Schritt für Schritt um.`,
    tags: ['refactor', 'tests', 'sicher'],
    useCase: 'Legacy-Code verbessern ohne Regression',
  },
  {
    id: 'p-explain-context',
    title: 'Code erklären mit Kontext',
    description: 'Erklärung von Code inkl. Abhängigkeiten und Projektkontext.',
    category: 'Prompts',
    author: 'CCM Community',
    snippet: `Erkläre diesen Code so, dass ein neuer Teammitglied ihn versteht:
- Was macht er (Zweck)?
- Welche Abhängigkeiten/Imports spielen eine Rolle?
- Wo wird er im Projekt verwendet (Referenzen)?
- Gibt es Fallstricke oder Besonderheiten?
Halte es auf 1–2 Absätze pro größerem Block.`,
    tags: ['erklärung', 'onboarding', 'dokumentation'],
  },
  {
    id: 'p-fix-from-error',
    title: 'Fix aus Fehlermeldung',
    description: 'Klassischer Workflow: Fehlerausgabe einfügen und Fix anfordern.',
    category: 'Prompts',
    author: 'CCM Community',
    snippet: `Ich bekomme folgenden Fehler (siehe unten). Analysiere die Ursache, schlage einen minimalen Fix vor und erkläre in 1–2 Sätzen, warum der Fix korrekt ist. Wenn mehrere Ursachen möglich sind, nenne die wahrscheinlichste zuerst.

[Hier Fehlerausgabe einfügen]`,
    tags: ['debugging', 'fehler', 'fix'],
    useCase: 'Runtime- oder Build-Fehler beheben',
  },
  {
    id: 'p-generate-tests',
    title: 'Tests aus Anforderungen generieren',
    description: 'Unit-/Integrationstests basierend auf Spezifikation oder bestehendem Code.',
    category: 'Prompts',
    author: 'CCM Community',
    snippet: `Generiere [Unit/Integration]-Tests für [Modul/Funktion]. Berücksichtige:
- Happy Path
- Edge Cases (leere Eingabe, null, Grenzwerte)
- Fehlerfälle (ungültige Eingabe, Fehlermeldungen)
Nutze [Jest/Vitest/Mocha] und das gleiche Styling wie die bestehenden Tests in diesem Projekt.`,
    tags: ['tests', 'tdd', 'qualität'],
  },
  // ========== CLAUDE.md ==========
  {
    id: 'c-node-api',
    title: 'CLAUDE.md für Node/API-Projekt',
    description: 'Projektkontext für REST- oder GraphQL-APIs mit Node/Express/Fastify.',
    category: 'CLAUDE.md',
    author: 'CCM Community',
    snippet: `# Projekt: [Name]
## Tech-Stack
- Runtime: Node.js [Version]
- Framework: [Express/Fastify]
- DB: [Postgres/Mongo/...]
- Tests: [Jest/Vitest]

## Konventionen
- API-Routen unter \`src/routes/\`, Controller unter \`src/controllers/\`
- Fehler über zentrale Middleware, immer HTTP-Status setzen
- Neue Endpoints: zuerst Route + Controller-Skelett, dann Logik

## Wichtige Dateien
- \`src/app.ts\` – Einstieg, Middleware
- \`src/config/\` – Umgebungsvariablen, DB
- \`*.test.ts\` – Tests neben Modul`,
    language: 'markdown',
    tags: ['claude-md', 'node', 'api', 'konventionen'],
  },
  {
    id: 'c-react-app',
    title: 'CLAUDE.md für React-App',
    description: 'Struktur und Regeln für eine React/TypeScript Frontend-App.',
    category: 'CLAUDE.md',
    author: 'CCM Community',
    snippet: `# Projekt: [App-Name]
## Stack
- React 18+, TypeScript, [Vite/CRA]
- State: [Zustand/Redux/Context]
- Styling: [Tailwind/CSS Modules]

## Struktur
- \`src/components/\` – wiederverwendbar, nur Props, kein direkter API-Call
- \`src/pages/\` – Seiten, dürfen Hooks/API nutzen
- \`src/hooks/\` – Custom Hooks
- \`src/types/\` – gemeinsame Typen

## Regeln
- Neue Komponenten: zuerst Typen/Interface, dann Implementierung
- Kein \`any\`; unbekannte Typen in \`types/\` definieren
- API-Calls nur in Hooks oder Services, nicht in UI-Komponenten`,
    language: 'markdown',
    tags: ['claude-md', 'react', 'typescript', 'struktur'],
  },
  {
    id: 'c-python-cli',
    title: 'CLAUDE.md für Python-CLI',
    description: 'Kontext für Kommandozeilen-Tools mit Python.',
    category: 'CLAUDE.md',
    author: 'CCM Community',
    snippet: `# Projekt: [CLI-Name]
## Umgebung
- Python [3.10+]
- CLI: \`click\` / \`typer\` / \`argparse\`
- Tests: \`pytest\`

## Struktur
- \`src/cli.py\` – Entrypoint, Subcommands
- \`src/core/\` – Business-Logik (ohne I/O wo möglich)
- \`tests/\` – Spiegel der \`src/\`-Struktur

## Konventionen
- Keine \`print()\` in Core; Logging oder Rückgabe
- Exit-Codes: 0 Erfolg, 1 Fehler, 2 Invalid Args
- Neue Befehle: zuerst Test (TDD), dann Implementierung`,
    language: 'markdown',
    tags: ['claude-md', 'python', 'cli', 'tdd'],
  },
  {
    id: 'c-rules-brief',
    title: 'Kurze CLAUDE.md Basis-Regeln',
    description: 'Minimaler Satz von Regeln für jedes Projekt.',
    category: 'CLAUDE.md',
    author: 'CCM Community',
    snippet: `# Projekt-Kontext
- **Sprache**: Antworten auf Deutsch, Code-Kommentare auf Englisch
- **Änderungen**: Immer nur die nötigsten Stellen anfassen; keine großen Refactors ohne explizite Anfrage
- **Tests**: Vor neuen Features zuerst Tests nennen oder schreiben; bestehende Tests nicht brechen
- **Commits**: Kleine, logische Commits mit aussagekräftiger Message`,
    language: 'markdown',
    tags: ['claude-md', 'regeln', 'minimal'],
  },
  // ========== Workflows ==========
  {
    id: 'w-pr-checklist',
    title: 'PR-Checkliste vor dem Merge',
    description: 'Workflow für konsistente PR-Qualität.',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `Gehe die geänderten Dateien durch und prüfe:
1. Laufen alle Tests? (führe Test-Befehl aus)
2. Gibt es TODO/FIXME die vor Merge erledigt werden sollten?
3. Sind neue Abhängigkeiten nötig und in package.json/pyproject.toml?
4. Sind Umgebungsvariablen dokumentiert (README oder .env.example)?
5. Gibt es sensible Daten oder Secrets im Diff?
Gib eine kurze Checkliste (✓/✗) und ggf. konkrete Hinweise.`,
    tags: ['pr', 'merge', 'qualität', 'checkliste'],
  },
  {
    id: 'w-migration-plan',
    title: 'Migrations-Plan für Breaking Change',
    description: 'Schrittplan für API- oder DB-Migrationen.',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `Wir wollen [Altes X] durch [Neues Y] ersetzen (Breaking Change). Erstelle einen Migrations-Plan:
1. **Kompatibilität**: Kann Y parallel zu X laufen? (Feature-Flag / Dual-Write?)
2. **Schritte**: Nummerierte Reihenfolge (z.B. DB-Migration → Code → Cleanup)
3. **Rollback**: Pro Schritt: wie Rollback durchführen?
4. **Tests**: Welche Tests müssen angepasst werden, welche prüfen die Migration?
Halte jeden Schritt klein und deploybar.`,
    tags: ['migration', 'breaking-change', 'planung'],
  },
  {
    id: 'w-doc-from-code',
    title: 'Dokumentation aus Code ableiten',
    description: 'README oder API-Docs aus bestehendem Code erzeugen.',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `Analysiere das Projekt (Struktur, Einstiegspunkte, Konfiguration) und erstelle/aktualisiere:
1. **README.md**: Kurzbeschreibung, Voraussetzungen, Install, Start, wichtige Skripte, ggf. Umgebungsvariablen
2. Keine erfundenen Infos – nur was aus Code und Config hervorgeht
Halte die README kurz; Verweise auf ausführliche Docs, falls vorhanden.`,
    tags: ['dokumentation', 'readme', 'onboarding'],
  },
  // ========== MCP ==========
  {
    id: 'm-filesystem-rules',
    title: 'MCP-Server: Sichere Datei-Operationen',
    description: 'Regeln für MCP-Tools die Dateien lesen/schreiben.',
    category: 'MCP',
    author: 'CCM Community',
    snippet: `# MCP File-Tool Regeln (für CLAUDE.md oder Agent)
- Lese nur unter \`./\`, \`src/\`, \`docs/\` – nie \`.env\`, \`.git/\`, \`node_modules/\` ohne explizite Anfrage
- Schreib-Operationen: immer zuerst "trocken" beschreiben (welche Datei, welche Änderung), dann auf Bestätigung ausführen
- Keine Löschung von ganzen Verzeichnissen ohne explizite Bestätigung
- Bei Unsicherheit: Vorschlag zeigen, Nutzer entscheidet`,
    language: 'markdown',
    tags: ['mcp', 'dateien', 'sicherheit'],
  },
  {
    id: 'm-custom-tool-doc',
    title: 'Dokumentation für Custom MCP-Tool',
    description: 'Vorlage für die Beschreibung eines eigenen MCP-Tools.',
    category: 'MCP',
    author: 'CCM Community',
    snippet: `## MCP-Tool: [Tool-Name]
**Zweck**: [Ein Satz]
**Eingaben**: [Parameter mit Typen, z.B. \`path: string\`, \`options?: { recursive: boolean }\`]
**Ausgaben**: [Was wird zurückgegeben – Typ/Struktur]
**Beispiel-Aufruf**: [Kurzes Beispiel]
**Fehler**: [Wann schlägt es fehl, z.B. Datei nicht gefunden → Fehlercode X]
**Einschränkungen**: [Rate-Limits, erlaubte Pfade, etc.]`,
    language: 'markdown',
    tags: ['mcp', 'tool', 'dokumentation'],
  },
  // ========== Skills ==========
  {
    id: 's-skill-rules',
    title: 'Skill: Projekt-Regeln durchsetzen',
    description: 'Skill-Beschreibung für konsistente Code- und Commit-Regeln.',
    category: 'Skills',
    author: 'CCM Community',
    snippet: `# Skill: Projekt-Regeln
## Wann aktiv
Wenn der Nutzer Code ändert, neue Dateien anlegt oder Commits vorschlägt.

## Aktionen
1. Prüfe Änderungen auf Einhaltung der in CLAUDE.md genannten Konventionen (Sprache, Struktur, Tests).
2. Erinnere an fehlende Tests für neue Funktionen.
3. Schlage eine Commit-Message vor (Conventional Commits: type(scope): message), wenn der Nutzer keinen Vorschlag macht.

## Nicht
- Keine Änderungen ohne Zustimmung durchführen; nur vorschlagen und begründen.`,
    language: 'markdown',
    tags: ['skill', 'regeln', 'commits', 'qualität'],
  },
  {
    id: 's-skill-security',
    title: 'Skill: Security-Check vor Commit',
    description: 'Kurzer Check auf typische Sicherheitsprobleme.',
    category: 'Skills',
    author: 'CCM Community',
    snippet: `# Skill: Security-Check
## Wann aktiv
Vor dem ersten Commit nach Änderungen an Auth, API, DB oder Konfiguration.

## Prüfpunkte
- Keine Secrets/Keys im Code (nur Verweise auf Env)
- Keine hart kodierten Passwörter oder Tokens
- User-Input wird escaped/validiert (SQL, XSS, Commands)
- Neue Abhängigkeiten: bekannte CVEs prüfen (npm audit / pip check)

Wenn etwas auffällt: Hinweis geben und Fix vorschlagen, nicht selbst ändern.`,
    language: 'markdown',
    tags: ['skill', 'sicherheit', 'secrets', 'audit'],
  },
  // ========== Sonstige ==========
  {
    id: 'o-git-message',
    title: 'Conventional Commits – Beispiele',
    description: 'Kurzreferenz für Commit-Messages im Conventional-Commits-Format.',
    category: 'Sonstige',
    author: 'CCM Community',
    snippet: `feat(api): add GET /users endpoint
fix(auth): correct token expiry check
docs(readme): add env vars section
chore(deps): bump react to 18.2
refactor(store): simplify user state
test(auth): add login failure cases
ci(github): add lint job

# Regeln: type(scope): Kurzbeschreibung
# type: feat|fix|docs|chore|refactor|test|ci
# scope: optional, Modul/ Bereich`,
    language: 'text',
    tags: ['git', 'commits', 'conventional'],
  },
  {
    id: 'o-prompt-template',
    title: 'Prompt-Template: Aufgabe + Kontext + Format',
    description: 'Wiederverwendbares Schema für präzise Prompts.',
    category: 'Sonstige',
    author: 'CCM Community',
    snippet: `**Aufgabe**: [Was soll Claude tun? – ein Satz]
**Kontext**: [Relevante Dateien/Stellen oder "siehe geöffnete Dateien"]
**Einschränkungen**: [z.B. keine neuen Dependencies, nur TypeScript, etc.]
**Gewünschtes Format**: [z.B. Liste, Code-Block, Schritt-für-Schritt]
**Sprache**: [Deutsch/Englisch]`,
    tags: ['prompt', 'template', 'best-practice'],
  },

  // ========== Neueste Updates (2026) ==========
  {
    id: 'n-fast-mode',
    title: 'Fast Mode für Opus 4.6 nutzen',
    description: 'Schnellere Token-Ausgabe mit /fast – nur bei Opus 4.6, höhere Kosten.',
    category: 'Neueste Updates',
    author: 'CCM · code.claude.com',
    snippet: `# Fast Mode (Opus 4.6)
- In der Sitzung: /model opus  (falls noch nicht Opus)
- Dann: /fast  → schaltet schnellere Ausgabe an/aus
- Bis zu 2,5x schneller, Premium-Preise
- Ideal bei langen Code-Generierungen oder vielen kleinen Runden
# Referenz: https://code.claude.com/docs/en/fast-mode`,
    tags: ['fast-mode', 'opus', 'performance', '2026'],
    useCase: 'Schnellere Antworten bei Opus 4.6',
  },
  {
    id: 'n-agent-teams',
    title: 'Agent Teams aktivieren (experimentell)',
    description: 'Mehrere Claude-Code-Sessions als Team mit Lead und Teammates koordinieren.',
    category: 'Neueste Updates',
    author: 'CCM · code.claude.com',
    snippet: `# Agent Teams (experimentell)
# Aktivierung (vor dem Start):
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
claude

# Konzepte: Team Lead, Teammates, geteilte Task-Listen
# Nützlich für parallele Stränge (z.B. Frontend + Backend)
# Docs: https://code.claude.com/docs/en/agent-teams`,
    language: 'bash',
    tags: ['agent-teams', 'multi-agent', 'experimentell', '2026'],
    useCase: 'Parallele Features mit mehreren Agents',
  },
  {
    id: 'n-checkpointing',
    title: 'Checkpointing & Rewind',
    description: 'Konversation und Code-Änderungen auf einen früheren Stand zurückspulen.',
    category: 'Neueste Updates',
    author: 'CCM · code.claude.com',
    snippet: `# Checkpointing
- Checkpoints speichern Konversation + Dateizustand
- /rewind  → spult auf früheren Checkpoint zurück (auch Code-Änderungen)
- Vor großen Refactorings: Checkpoint setzen oder auf automatischen achten
# Docs: https://code.claude.com/docs/en/checkpointing`,
    tags: ['checkpointing', 'rewind', 'undo', '2026'],
    useCase: 'Sicherer Rollback bei falschem Ansatz',
  },
  {
    id: 'n-claude-everywhere',
    title: 'Claude Code überall nutzen',
    description: 'Terminal, Web, Desktop, Chrome, VS Code, JetBrains, Slack, CI/CD.',
    category: 'Neueste Updates',
    author: 'CCM · code.claude.com',
    snippet: `# Nutzungsorte
- Terminal: claude  (Kern-Erlebnis)
- Web: claude.ai/code  (keine lokale Installation)
- Desktop-App: Diffs, parallele Sessions, Cloud
- Chrome (Beta): Web-Apps testen, Console, Formulare
- VS Code / JetBrains: Extension / Plugin
- CI/CD: GitHub Actions, GitLab – @claude in PRs
- Slack: Tasks an Claude Code delegieren
# Übersicht: https://code.claude.com/docs/de/overview`,
    tags: ['web', 'desktop', 'ide', 'slack', 'cicd', '2026'],
    useCase: 'Passenden Einstieg für deinen Workflow wählen',
  },
  {
    id: 'n-official-docs',
    title: 'Offizielle Dokumentation (code.claude.com)',
    description: 'Zentrale Referenz: CLI, Settings, MCP, Plugins, Changelog.',
    category: 'Neueste Updates',
    author: 'CCM · Anthropic',
    snippet: `# Offizielle Claude-Code-Docs
- Übersicht (DE): https://code.claude.com/docs/de/overview
- Changelog: https://code.claude.com/docs/en/changelog
- CLI-Referenz: https://code.claude.com/docs/en/cli-reference
- MCP: https://code.claude.com/docs/en/mcp
- Extend (Skills, Hooks, Plugins): https://code.claude.com/docs/en/features-overview
- Vollständiger Index (z.B. für Skripte): https://code.claude.com/docs/llms.txt`,
    language: 'markdown',
    tags: ['docs', 'reference', 'code.claude.com', '2026'],
    useCase: 'Aktuelle Syntax, Flags und Features nachschlagen',
  },
];

export const patternCategories = [
  'Neueste Updates',
  'Prompts',
  'CLAUDE.md',
  'Workflows',
  'MCP',
  'Skills',
  'Sonstige',
] as const;
