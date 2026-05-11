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
  // ---------- Neueste Updates (in Workflows, lastUpdate bis zum nächsten Release) ----------
  {
    id: 'n-fast-mode',
    title: 'Fast Mode für Opus 4.6 nutzen',
    description: 'Schnellere Token-Ausgabe mit /fast – nur bei Opus 4.6, höhere Kosten.',
    category: 'Workflows',
    author: 'CCM · code.claude.com',
    snippet: `# Fast Mode (Opus 4.6)
- In der Sitzung: /model opus  (falls noch nicht Opus)
- Dann: /fast  → schaltet schnellere Ausgabe an/aus
- Bis zu 2,5x schneller, Premium-Preise
- Ideal bei langen Code-Generierungen oder vielen kleinen Runden
# Referenz: https://code.claude.com/docs/en/fast-mode`,
    tags: ['fast-mode', 'opus', 'performance', '2026'],
    useCase: 'Schnellere Antworten bei Opus 4.6',
    lastUpdate: true,
    bannerLabel: 'Fast Mode',
  },
  {
    id: 'n-agent-teams',
    title: 'Agent Teams aktivieren (experimentell)',
    description: 'Mehrere Claude-Code-Sessions als Team mit Lead und Teammates koordinieren.',
    category: 'Workflows',
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
    lastUpdate: true,
    bannerLabel: 'Agent Teams',
  },
  {
    id: 'n-checkpointing',
    title: 'Checkpointing & Rewind',
    description: 'Konversation und Code-Änderungen auf einen früheren Stand zurückspulen.',
    category: 'Workflows',
    author: 'CCM · code.claude.com',
    snippet: `# Checkpointing
- Checkpoints speichern Konversation + Dateizustand
- /rewind  → spult auf früheren Checkpoint zurück (auch Code-Änderungen)
- Vor großen Refactorings: Checkpoint setzen oder auf automatischen achten
# Docs: https://code.claude.com/docs/en/checkpointing`,
    tags: ['checkpointing', 'rewind', 'undo', '2026'],
    useCase: 'Sicherer Rollback bei falschem Ansatz',
    lastUpdate: true,
    bannerLabel: 'Checkpointing',
  },
  {
    id: 'n-claude-everywhere',
    title: 'Claude Code überall nutzen',
    description: 'Terminal, Web, Desktop, Chrome, VS Code, JetBrains, Slack, CI/CD.',
    category: 'Workflows',
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
    lastUpdate: true,
    bannerLabel: 'Claude Code überall',
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
  {
    id: 'n-context-management',
    title: 'Context Management Best Practices',
    description: 'Community-Konsens: Die 5 wichtigsten Regeln für effektives Context Management.',
    category: 'Workflows',
    author: 'CCM · Community-Konsens März 2026',
    snippet: `# Context Management — Die Top 5 Regeln
# (Community-Konsens, bestätigt durch offizielle Best Practices)

# 1. Nach jeder abgeschlossenen Aufgabe:
/clear

# 2. Proaktiv bei ~70% Context-Nutzung:
/compact

# 3. Regelmäßig auditieren was Claude "sieht":
/context

# 4. Planen vor Coden (Shift+Tab 2x oder):
/plan fix the auth bug

# 5. Explorative Aufgaben an Subagents delegieren:
# → "Nutze einen Subagent um alle TODO-Kommentare zu finden"

# Faustregel: Wenn du Claude 2x zum selben Thema
# korrigiert hast → /clear und neu starten

# CLAUDE.md: Max 50-100 Zeilen Root-Datei
# Details in @imports auslagern (Progressive Disclosure)`,
    language: 'bash',
    tags: ['context', 'management', 'best-practice', 'performance', '2026'],
    useCase: 'Performance-Optimierung in jeder Claude Code Session',
    lastUpdate: true,
    bannerLabel: 'Context Management',
  },
  {
    id: 'n-hooks-autoformat',
    title: 'Hooks: Auto-Format + Sicherheit (Copy-Paste)',
    description: 'Produktionsreife Hook-Konfiguration für automatisches Formatting und Security-Schutz.',
    category: 'Workflows',
    author: 'CCM · Community Best Practice',
    snippet: `// .claude/settings.json — Copy-Paste-fertig
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "matcher": "Bash",
        "command": "echo '$CLAUDE_TOOL_INPUT' | grep -q 'rm -rf' && exit 1 || exit 0"
      }
    ],
    "PostToolUse": [
      {
        "type": "command",
        "matcher": "Write",
        "command": "npx prettier --write $CLAUDE_FILE_PATH"
      }
    ],
    "PostCompact": [
      {
        "type": "command",
        "command": "echo 'Context compacted at $(date)' >> ~/.claude/compact.log"
      }
    ]
  }
}
// PreToolUse: Blockiert gefährliche rm -rf Befehle
// PostToolUse: Formatiert jede geschriebene Datei automatisch
// PostCompact: Loggt wann Context komprimiert wurde (NEU)`,
    language: 'jsonc',
    tags: ['hooks', 'auto-format', 'sicherheit', 'postcompact', '2026'],
    useCase: 'Deterministische Code-Qualität und Sicherheit',
    lastUpdate: true,
    bannerLabel: 'Hooks Setup',
  },
  {
    id: 'n-official-docs',
    title: 'Offizielle Dokumentation (code.claude.com)',
    description: 'Zentrale Referenz: CLI, Settings, MCP, Plugins, Changelog.',
    category: 'Sonstige',
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
    lastUpdate: true,
    bannerLabel: 'Offizielle Docs',
  },
  // ========== Neue Best Practices (KW12/2026) ==========
  {
    id: 'p-plan-first',
    title: 'Plan-First Development (4-Schritt-Prozess)',
    description: 'Community #1 Best Practice: Erst planen lassen, dann reviewen, dann implementieren. Reduziert Iterations-Schleifen um 40-60%.',
    category: 'Workflows',
    author: 'Claude Code Community',
    snippet: `# Plan-First Development (Community Best Practice #1)

# Schritt 1: Plan anfordern — KEIN Code
"Analysiere die Anforderung und erstelle einen Plan.
 Schreibe KEINEN Code."

# Schritt 2: Plan reviewen und verfeinern
"Aendere Schritt 3: Statt eines Monolithen,
 nutze drei separate Funktionen."

# Schritt 3: Gruenes Licht geben
"Plan sieht gut aus. Implementiere jetzt."

# Schritt 4: Review mit /plan oder Shift+Tab 2x
/plan  # Startet Plan Mode
# Oder: Shift+Tab, Shift+Tab (Toggle Plan Mode)

# Warum? Reduziert Fehler um 40-60%, weil das richtige
# Problem in der richtigen Reihenfolge geloest wird.`,
    language: 'bash',
    tags: ['plan-first', 'best-practice', 'workflow', '2026'],
    useCase: 'Jede nicht-triviale Aufgabe — besonders Refactorings und neue Features',
    lastUpdate: true,
    bannerLabel: 'Plan-First Development',
  },
  {
    id: 'p-error-reporting',
    title: 'Vollständige Fehlermeldungen liefern',
    description: 'Komplette Stack-Traces und Reproduzier-Schritte verbessern die diagnostische Genauigkeit um ~75%.',
    category: 'Prompts',
    author: 'Claude Code Community',
    snippet: `# FALSCH ❌
"Der Login funktioniert nicht"

# RICHTIG ✅
"Hier ist der komplette Error:
TypeError: Cannot read properties of undefined (reading 'token')
    at AuthService.validateSession (src/auth/service.ts:47:23)
    at async LoginHandler.handle (src/handlers/login.ts:12:5)

Reproduzier-Schritte:
1. User klickt Login
2. Email/Passwort eingeben
3. Submit → Fehler"

# Warum? Vollstaendige Stack-Traces verbessern die
# diagnostische Genauigkeit um ~75%. Ein Summary reicht nicht.`,
    language: 'bash',
    tags: ['debugging', 'fehler', 'stack-trace', 'best-practice', '2026'],
    useCase: 'Jeden Bug-Report an Claude — immer den kompletten Error mitgeben',
    lastUpdate: true,
    bannerLabel: 'Error Reporting',
  },
  {
    id: 'p-session-organisation',
    title: 'Session-Organisation mit /color + /name',
    description: 'Nutze /color und /name zusammen um parallele Sessions visuell zu unterscheiden.',
    category: 'Workflows',
    author: 'Claude Code Community',
    snippet: `# Session 1: Frontend
/name "Frontend Auth"
/color blue

# Session 2: Backend
/name "Backend API"
/color green

# Session 3: Tests
/name "E2E Tests"
/color red

# Sessions auflisten und fortsetzen:
claude --resume
# → Zeigt benannte Sessions mit Farben

# Tipp: Kombiniere mit /resume fuer nahtloses
# Wechseln zwischen Aufgaben`,
    language: 'bash',
    tags: ['session', 'color', 'name', 'organisation', '2026'],
    useCase: 'Bei paralleler Arbeit an mehreren Features oder Projekten',
    lastUpdate: true,
    bannerLabel: 'Session-Organisation',
  },
  // ========== Neue Best Practices (KW13/2026 — Boris Cherny) ==========
  {
    id: 'p-boris-cherny-claudemd',
    title: 'Boris Chernys 100-Zeilen CLAUDE.md',
    description: 'Der Creator von Claude Code hält seine CLAUDE.md auf ~2.500 Tokens (~100 Zeilen). Weniger ist mehr — Qualität schlägt Quantität.',
    category: 'CLAUDE.md',
    author: 'Boris Cherny (Claude Code Creator)',
    snippet: `# Boris Chernys CLAUDE.md Philosophie (Quelle: mindwiredai.com, 25.03.2026)
# Sein Kernprinzip: ~100 Zeilen, ~2.500 Tokens — nicht mehr.

# WARUM weniger besser ist:
# 1. CLAUDE.md wird bei JEDER Nachricht geladen
# 2. Je laenger → desto mehr Token-Overhead
# 3. Je laenger → desto unschaerfer der Fokus

# WAS reingehoert (Boris' Top 5):
# ✅ Projekt-Typ und Tech-Stack (5-10 Zeilen)
# ✅ Kern-Konventionen — max 10 Regeln (20-30 Zeilen)
# ✅ Haeufige Fehler die Claude macht (10-15 Zeilen)
# ✅ Links zu Detail-Docs (nicht die Docs selbst!)
# ✅ Build/Test/Lint Befehle (5-10 Zeilen)

# WAS NICHT reingehoert:
# ❌ Jede API-Route und jedes Schema
# ❌ Ausfuehrliche Architektur-Beschreibungen
# ❌ Copy-Paste aus README oder Docs
# ❌ Alles was >3x pro Woche aendert`,
    language: 'bash',
    tags: ['claude-md', 'best-practice', 'boris-cherny', 'creator', '2026'],
    useCase: 'Jedes Projekt — halte deine CLAUDE.md schlank und fokussiert',
    lastUpdate: true,
    bannerLabel: 'Creator Best Practice',
  },
  {
    id: 'p-zwei-claude-methode',
    title: 'Zwei-Claude-Methode (Creator Workflow)',
    description: 'Boris Chernys Profi-Workflow: Ein Claude plant, ein zweiter reviewt als Staff Engineer. Reduziert Fehler signifikant.',
    category: 'Workflows',
    author: 'Boris Cherny (Claude Code Creator)',
    snippet: `# Die Zwei-Claude-Methode (Boris Cherny, 25.03.2026)
# Der Creator von Claude Code nutzt diesen Workflow taeglich.

# SESSION 1: Der Planer
# Aufgabe: "Erstelle einen Plan fuer [Feature]. Kein Code."
# → Claude erstellt detaillierten Implementierungs-Plan
# → Du reviewst und verfeinerst den Plan
# → Erst nach Freigabe: "Implementiere jetzt."

# SESSION 2: Der Staff Engineer (parallel)
# Aufgabe: "Reviewe diesen Code als Staff Engineer.
#           Fokus: Architektur, Edge Cases, Sicherheit."
# → Claude reviewt den Output von Session 1
# → Findet Fehler die Session 1 uebersehen hat

# WARUM das funktioniert:
# - Planer und Reviewer haben verschiedene "Perspektiven"
# - Der Reviewer hat frischen Kontext (kein Bias vom Planen)
# - Simuliert echtes Pair-Programming mit Code Review

# Boris' Setup: 10-15 parallele Sessions gleichzeitig
# Tipp: Nutze /name und /color fuer Organisation`,
    language: 'bash',
    tags: ['zwei-claude', 'pair-programming', 'workflow', 'boris-cherny', '2026'],
    useCase: 'Komplexe Features und Refactorings — wenn Qualität wichtiger als Geschwindigkeit ist',
    lastUpdate: true,
    bannerLabel: 'Creator Workflow',
  },
  {
    id: 'p-verification-first',
    title: 'Verification-First Prompting (Boris Cherny Method)',
    description: 'Gib Claude Verifikationskriterien mit — laut Boris Cherny (Claude Code Creator) der grösste einzelne Qualitäts-Hebel. Liefert 2-3x bessere Ergebnisse.',
    category: 'Prompts',
    author: 'Boris Cherny (Claude Code Creator)',
    snippet: `# Verification-First Prompting
# Laut Boris Cherny (Creator of Claude Code):
# "Giving Claude verification criteria is the single
#  highest-leverage practice. 2-3x quality improvement."

# SCHLECHT (kein Verifikationskriterium):
"Implement user authentication"

# GUT (mit Verifikationskriterien):
"Implement user authentication.

Verification:
- npm test passes (all 42 tests green)
- Login with test@example.com + password123 works
- Invalid credentials return 401 with error JSON
- /dashboard route redirects to /login when unauthenticated
- Password reset email is sent within 5 seconds"

# Warum das funktioniert:
# - Claude hat ein konkretes Ziel statt einer vagen Aufgabe
# - Verifikation zwingt Claude zur Vollstaendigkeit
# - Testbare Kriterien verhindern "fast fertig"-Outputs
# - Kombinierbar mit Hooks fuer automatische Validation

# Faustregel: Wenn du es selbst nicht testen kannst,
# kann Claude es auch nicht korrekt implementieren.`,
    language: 'bash',
    tags: ['verification', 'prompting', 'qualitaet', 'boris-cherny', '2026'],
    useCase: 'Alle komplexen Implementierungsaufgaben — besonders wenn Korrektheit wichtig ist',
    lastUpdate: true,
    bannerLabel: '2-3x Qualität',
  },
  {
    id: 'p-multi-level-claudemd',
    title: 'Multi-Level CLAUDE.md (Subfolder-Strategie)',
    description: 'CLAUDE.md nicht nur im Root, sondern in jedem Subfolder — Claude merged diese automatisch. Community-Konsens 2026: "Genauso wichtig wie .gitignore".',
    category: 'CLAUDE.md',
    author: 'Claude Code Masterkurs',
    snippet: `# Multi-Level CLAUDE.md (Community Best Practice 2026)
# CLAUDE.md ist genauso wichtig wie .gitignore.
# Claude Code merged Root + Subfolder-CLAUDE.md automatisch.

projekt/
├── CLAUDE.md           # Root: Projekt-Overview, Tech-Stack, globale Regeln
├── frontend/
│   └── CLAUDE.md       # Frontend-spezifisch: React-Patterns, Tailwind-Conventions
├── backend/
│   └── CLAUDE.md       # Backend-spezifisch: API-Design, DB-Conventions, Auth-Patterns
└── .github/
    └── CLAUDE.md       # CI/CD-spezifische Anweisungen, Deploy-Checklisten

# Root CLAUDE.md (kurz halten, max 100 Zeilen):
## Tech Stack
- Frontend: React 19, TypeScript, Tailwind
- Backend: Node.js, Prisma, PostgreSQL
- Deploy: Vercel (Frontend), Railway (Backend)

# frontend/CLAUDE.md (spezifisch):
## React Conventions
- Immer React.memo fuer Listen-Items
- State mit Zustand (nicht Redux)
- Komponenten in features/ nicht components/

# Warum Sub-CLAUDE.md?
# - Claude bekommt kontext-relevante Regeln je nach Arbeitsbereich
# - Weniger Kontext-Noise als alles in Root
# - Team kann Sub-CLAUDEs separat reviewen`,
    language: 'bash',
    tags: ['claudemd', 'subfolder', 'kontext', 'team', '2026'],
    useCase: 'Alle Projekte mit mehr als einem Verzeichnis — besonders Monorepos und Full-Stack-Projekte',
    lastUpdate: true,
    bannerLabel: 'Community Best Practice 2026',
  },
  {
    id: 'p-hooks-defer',
    title: 'Hooks Defer Pattern (Human-in-the-Loop)',
    description: 'Exit 3 pausiert headless Agents bei kritischen Operationen und wartet auf manuelle Freigabe via --resume. Das sicherste Pattern für autonome Agents.',
    category: 'Workflows',
    author: 'Claude Code Masterkurs',
    snippet: `#!/bin/bash
# PreToolUse Hook: Defer-Pattern fuer headless Agents
# Pausiert Session bei gefaehrlichen Operationen (Exit 3)
# und wartet auf manuelle Freigabe via --resume

# Exit-Codes im Ueberblick:
# Exit 0 = Aktion erlauben
# Exit 2 = Aktion blockieren (Claude bekommt Fehlermeldung)
# Exit 3 = Defer: Session pausiert, wartet auf --resume (NEU)

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Kritische Operationen → defer statt block
CRITICAL_OPS=("rm -rf" "DROP TABLE" "kubectl delete" "terraform destroy" "git push --force")

for op in "\${CRITICAL_OPS[@]}"; do
  if [[ "$COMMAND" == *"$op"* ]]; then
    # Optional: Benachrichtigung an Operator senden
    # curl -s -X POST "$SLACK_WEBHOOK" -d '{"text":"Agent wartet auf Freigabe"}'
    echo "DEFER: Kritische Operation erkannt: $op — wartet auf --resume"
    exit 3  # Session pausiert
  fi
done

exit 0

# ─────────────────────────────────
# SESSION FORTSETZEN nach Pruefung:
# claude -p --resume SESSION_ID
# ─────────────────────────────────

# In settings.json registrieren:
# { "hooks": { "PreToolUse": [{ "matcher": "Bash",
#   "hooks": [{"type": "command", "command": ".claude/hooks/defer-critical.sh"}]}]}}`,
    language: 'bash',
    tags: ['hooks', 'defer', 'sicherheit', 'headless', 'human-in-the-loop', '2026'],
    useCase: 'Autonome headless Agents die kritische Operationen (Deploy, DB-Änderungen) durchführen',
    lastUpdate: false,
    bannerLabel: 'Safety Pattern',
  },
  {
    id: 'p-monitor-event-driven',
    title: 'Event-Driven Background Monitoring (statt Polling)',
    description: 'Nutzt das Monitor Tool um Build-, Test- oder Dev-Server-Output als Event-Stream zu konsumieren — Claude reagiert nur auf echte Events statt teurer Polling-Loops.',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `# Anti-Pattern: Polling mit BashOutput
# while true; do BashOutput; sleep 5; done
# → Verbrennt Tokens bei jedem Roundtrip

# Pattern: Event-Driven mit Monitor
Monitor("npm run dev",
  reason: "Watch dev server for compile errors during refactor",
  until: "Error|FAIL|compiled successfully")

# Multi-Stream Pattern für CI-Pipeline
Monitor("pytest tests/ -v --tb=short",
  reason: "Catch first failing test during migration",
  until: "FAILED|ERROR|passed")

# Hook-Kombination für auto-Reaktion:
# In settings.json:
# {
#   "hooks": {
#     "PostToolUse": [{
#       "matcher": "Monitor",
#       "hooks": [{"type": "command",
#         "command": ".claude/hooks/notify-on-fail.sh"}]
#     }]
#   }
# }`,
    language: 'bash',
    tags: ['monitor', 'event-driven', 'background', 'polling', 'token-saving', '2026'],
    useCase: 'Lange Build/Test/Dev-Server-Prozesse beobachten ohne Token-teures Polling',
    lastUpdate: true,
    bannerLabel: 'Neu: April 2026',
  },
  {
    id: 'p-ultraplan-flow',
    title: 'Ultraplan-First für komplexe Refactors',
    description: 'Nutzt /ultraplan um Plan-Phase in Cloud-Container auszulagern, reviewt im Browser-Editor und teleportiert dann zurück ins Terminal für Ausführung.',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `# Schritt 1: Ultraplan starten — Hauptkontext bleibt frei
/ultraplan migrate the auth service from session-based to JWT-based authentication

# Schritt 2: Im Browser-Editor (claude.ai/code)
# - Outline-Sidebar nutzen für Navigation
# - Inline-Comments wie bei PR-Review
# - Reaktionen für quick-Approval einzelner Steps
# - Bei Bedarf: Refinement-Prompt im Editor

# Schritt 3: Approval — zwei Optionen
# A) Cloud-Execution: Claude führt Plan komplett in der Cloud aus
# B) "Teleport back to terminal": Plan landet lokal,
#    Ausführung mit normalem claude im Terminal

# Pattern für Plan-Refinement aus lokalem /plan:
/plan implement Stripe webhook signature verification
# Im Plan-Dialog: "No, refine with Ultraplan"
# → Plan wandert in die Cloud, du bekommst Web-Editor

# Decision-Tree:
# Plan < 5 Min Schreibzeit? → lokales /plan
# Plan > 10 Min oder mehrere Stakeholder? → /ultraplan
# Architektur-Entscheidung mit Review-Bedarf? → /ultraplan`,
    language: 'bash',
    tags: ['ultraplan', 'planning', 'cloud', 'review', 'workflow', '2026'],
    useCase: 'Komplexe Refactors oder Architektur-Migrationen mit Review-Bedarf',
    lastUpdate: true,
    bannerLabel: 'Neu: April 2026',
  },
  {
    id: 'p-task-budget-loop',
    title: 'Task-Budget für autonome Agent-Loops',
    description: 'Setzt mit Opus 4.7 Token-Budgets pro Task — verhindert Runaway-Kosten in headless Pipelines und nächtlichen Agent-Jobs.',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `#!/bin/bash
# Nightly autonomous refactor — mit Sicherheitsnetz

# Anti-Pattern: kein Budget — Agent kann mehrere $$ verbrennen
# claude -p "Migrate all class components to hooks"

# Pattern: Task-Budget setzt harte Token-Grenze
claude --model claude-opus-4-7 \\
  --task-budget 100000 \\
  --effort high \\
  -p "Migrate all class components to hooks. Stop at first 5 components, commit, then continue."

# Maximum-Damage-Berechnung:
# 100K Output Tokens × $25/M = $2.50 max
# 100K Input Tokens × $5/M = $0.50 max
# → Garantierter Cap: ~$3 pro Run

# Für CI/CD-Pipelines: IMMER Budget setzen
# .github/workflows/nightly-refactor.yml:
# - run: |
#     claude --task-budget 50000 \\
#       --model claude-opus-4-7 \\
#       -p "Run weekly cleanup tasks per CLAUDE.md"

# Budget-Faustregeln:
# Quick Fix:           5,000 Tokens
# Single-File Refactor: 20,000 Tokens
# Multi-File Refactor:  50,000-100,000 Tokens
# Architecture Design:  150,000-200,000 Tokens (mit xhigh)`,
    language: 'bash',
    tags: ['task-budget', 'opus-4-7', 'cost-control', 'autonomous', 'ci-cd', '2026'],
    useCase: 'Headless/nächtliche Agent-Jobs mit garantierter Kosten-Obergrenze',
    lastUpdate: true,
    bannerLabel: 'Neu: April 2026',
  },
  {
    id: 'p-ultrareview-ci-gate',
    title: 'Ultrareview als CI-Gate',
    description: 'GitHub-Action-Template, das `claude ultrareview` als PR-Gate einsetzt — paralleler Multi-Agent-Review mit Skill-Kombination.',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `# .github/workflows/claude-review.yml
name: Claude Ultrareview
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run Ultrareview
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude ultrareview \${{ github.event.pull_request.html_url }} \\
            --task-budget 80000 \\
            --skill security-review \\
            --skill code-review > review.md

      - name: Comment on PR
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          path: review.md

# Tipp: Mit --task-budget verhinderst du Runaway-Kosten,
# wenn ein Agent in einer Schleife haengt.`,
    language: 'yaml',
    tags: ['ultrareview', 'ci-cd', 'github-actions', 'review', '2026'],
    useCase: 'Automatische PR-Reviews mit Multi-Agent-Perspektive',
    lastUpdate: true,
    bannerLabel: 'Neu: April 2026',
  },
  {
    id: 'p-managed-agents-bg',
    title: 'Managed Agents für Background-Tasks',
    description: 'Cloud-gehosteter Agent mit Memory-Beta — laeuft Tage durch, persistiert Fakten ueber Sessions, kein eigenes Hosting.',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `# Python — Background-Agent fuer Inbox-Triage
import anthropic
import os

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

# Session einmalig erstellen — Memory-Namespace persistiert
session = client.agents.sessions.create(
    name="inbox-triage",
    model="claude-opus-4-7",
    tools=[
        {"type": "code_execution"},
        {"type": "web_search"},
    ],
    memory={"enabled": True, "namespace": "user-cosmo-inbox"},
)
print(f"Session: {session.id}")

# Daily-Run — Agent erinnert sich an Praeferenzen
result = client.agents.sessions.run(
    session.id,
    input=(
        "Pruefe meine Gmail-Inbox. Markiere wichtige "
        "Mails (Kunden, Auftraege) als 'urgent'. "
        "Beruecksichtige meine Triage-Praeferenzen aus "
        "vorherigen Sessions."
    ),
)
print(result.output)

# TypeScript-Aequivalent:
# const session = await client.agents.sessions.create({
#   name: 'inbox-triage',
#   model: 'claude-opus-4-7',
#   memory: { enabled: true, namespace: 'user-cosmo-inbox' }
# });`,
    language: 'python',
    tags: ['managed-agents', 'memory', 'background', 'python', '2026'],
    useCase: 'Wiederkehrende Tasks (Triage, Recap, Recherche) ohne eigenes Hosting',
    lastUpdate: true,
    bannerLabel: 'Beta: April 2026',
  },
  {
    id: 'p-rewind-vs-correct',
    title: 'Kontext-Pollution vermeiden mit /rewind',
    description: 'Wenn Claude in falsche Richtung laeuft, /rewind statt weiter zu prompten — Korrektur-Prompts machen den Context-Window-Schaden schlimmer.',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `# Anti-Pattern (haeufig in Reddit-Postmortems):
# Du: "Bau eine Pagination fuer /orders"
# Claude: <baut etwas Falsches mit Cursor-Pagination>
# Du: "Nein, ich wollte Offset-Pagination"
# Claude: <baut Hybrid, der noch schlechter ist>
# Du: "Nein, KEIN Cursor, NUR Offset"
# Claude: <verwirrt, mischt beides>
#
# Problem: Jeder Korrektur-Prompt fuegt dem Context Window
# widerspruechliche Anweisungen hinzu. Claude versucht, alles
# zu reconcilen — Ergebnis: Pollution.

# Pattern (seit 2.1.108 mit Alias /undo):
/rewind            # Springt zum letzten User-Prompt vor dem Fehler
# Dann sauber neu formulieren:
"Bau Offset-basierte Pagination fuer /orders.
 KEINE Cursor-Pagination.
 page + pageSize Query-Params, max 100 Items."

# Decision-Tree:
# - Claude geht falschen Weg ueber 1-2 Schritte? → /rewind
# - Claude hat 80% richtig, nur Detail falsch? → korrigieren
# - Claude versteht den Kontext grundsaetzlich falsch? → /rewind
# - Mehrere Topics in einer Session vermischt? → /clear
#
# Faustregel: /rewind ist guenstiger als die Token, die fuer
# das Aufraeumen verschmutzten Kontextes draufgehen.`,
    language: 'bash',
    tags: ['rewind', 'undo', 'context-management', 'antipattern', '2026'],
    useCase: 'Wenn Claude in falsche Richtung laeuft — sauberer Reset statt Korrektur-Spirale',
    lastUpdate: true,
    bannerLabel: 'Neu: April 2026',
  },
  {
    id: 'p-compaction-60-rule',
    title: 'Compaction-Hygiene: 60%-Regel + Pre-Compact-Brief',
    description: 'Erfahrene Nutzer rufen /compact bei ~60% Context-Fuelle, nicht erst bei 95%. Vor jedem /compact ein expliziter Status-Brief.',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `# Compaction-Hygiene 2026 — proaktiv statt reaktiv

# 1. /context regelmaessig pruefen (alle 10-15 Nachrichten)
/context

# 2. Bei ~60% Auslastung: vor /compact einen expliziten Brief schreiben:
"Wir debuggen 500-Error auf POST /api/orders.
 Vermutung: Stripe-Webhook-Race zwischen payment_intent.succeeded und
 unsere idempotency_key-Pruefung. Bisherige Versuche:
 - Webhook-Logs gepruefty (timing inconsistent)
 - DB-Locks ausgeschlossen
 - Naechster Schritt: Idempotency-Key-Reuse-Window pruefen."

# 3. JETZT erst /compact ausfuehren
/compact

# Warum: Ohne Brief vergisst der Modell-State nach Compaction
# den offenen Fehler. Mit Brief bleibt der Debug-Kontext erhalten.

# Anti-Patterns:
# - Warten bis 95%: Auto-Compact loescht zu aggressiv
# - Kein Brief: Modell weiss nach Compact nicht mehr, was offen ist
# - Kitchen-Sink-Sessions: /clear ist guenstiger als Compact bei Topic-Wechsel
# - 2-Correction-Regel: Nach 2x Korrektur fuer denselben Fehler → /clear`,
    language: 'bash',
    tags: ['compact', 'context-management', 'hygiene', '2026'],
    useCase: 'Lange Debug-Sessions, Multi-Step-Implementierungen, alle Daily-Workflows',
    lastUpdate: true,
    bannerLabel: 'Neu: Mai 2026',
  },
  {
    id: 'p-plugin-url-distribution',
    title: 'Skill-Distribution via --plugin-url',
    description: 'Plugins als GitHub-Release-ZIP veroeffentlichen — Teilnehmer aktivieren mit einem Befehl, ohne npm-Install.',
    category: 'Skills',
    author: 'CCM Community',
    snippet: `# Plugin-Distribution ohne npm/Marketplace
# Voraussetzung: Claude Code 2.1.129+

# 1. Plugin-Verzeichnis als ZIP packen
cd ~/code/cc-plugins/masterkurs-toolkit
zip -r ../masterkurs-toolkit-v0.3.1.zip .

# 2. Als GitHub-Release veroeffentlichen
gh release create v0.3.1 ../masterkurs-toolkit-v0.3.1.zip \\
  --title "Masterkurs Toolkit v0.3.1" \\
  --notes "Enthaelt: lesson-runner, quiz-validator, slide-builder"

# 3. URL teilen (Slack/Notion/Email)
# https://github.com/cittasana/cc-plugins/releases/download/v0.3.1/masterkurs-toolkit-v0.3.1.zip

# 4. Teilnehmer aktivieren mit einem Befehl (nur fuer diese Session!)
claude --plugin-url https://github.com/cittasana/cc-plugins/releases/download/v0.3.1/masterkurs-toolkit-v0.3.1.zip

# Warum stark: kein npm-Publish, keine Vertrauenskette,
# keine globale Installation — perfekt fuer Workshops und experimentelle Plugins.

# Sicherheits-Hinweis: nur URLs verwenden, denen du auch vertraust.
# Plugin-ZIPs koennen Hooks und Bash-Scripts enthalten.`,
    language: 'bash',
    tags: ['plugins', 'distribution', 'workshop', 'plugin-url', '2026'],
    useCase: 'Workshop-Setups, Kurs-eigene Toolkits, experimentelle Plugins ohne npm-Publish',
    lastUpdate: true,
    bannerLabel: 'Neu: Mai 2026',
  },
  {
    id: 'p-session-id-audit',
    title: 'Audit-Trail mit CLAUDE_CODE_SESSION_ID',
    description: 'Hook + Bash-Tool teilen sich die Session-ID — Compliance-fertige SQLite-Audit-DB in 20 Zeilen.',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `# Vollstaendiger Audit-Trail fuer Compliance-bewusste Teams
# Voraussetzung: Claude Code 2.1.127+

# 1. SQLite-DB einmalig anlegen
sqlite3 ~/.claude/events.db <<SQL
CREATE TABLE IF NOT EXISTS events (
  session_id TEXT NOT NULL,
  tool TEXT NOT NULL,
  details TEXT,
  ts DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_session ON events(session_id);
SQL

# 2. PostToolUse-Hook in ~/.claude/settings.json
# Hook nutzt $CLAUDE_CODE_SESSION_ID (seit 2.1.127 in Bash-Subprozessen)
# {
#   "hooks": {
#     "PostToolUse": [{
#       "matcher": "Bash",
#       "hooks": [{
#         "type": "command",
#         "command": "sqlite3 ~/.claude/events.db \\"INSERT INTO events(session_id, tool, details) VALUES('$CLAUDE_CODE_SESSION_ID', 'Bash', 'tool_call')\\""
#       }]
#     }]
#   }
# }

# 3. Audit-Query fuer Compliance-Reports
sqlite3 ~/.claude/events.db \\
  "SELECT session_id, COUNT(*) FROM events GROUP BY session_id ORDER BY MIN(ts) DESC LIMIT 10;"`,
    language: 'bash',
    tags: ['hooks', 'audit', 'compliance', 'session-id', 'sqlite', '2026'],
    useCase: 'Compliance-bewusste Teams, regulierte Branchen (Finanz/Health), interne Audit-Logs',
    lastUpdate: true,
    bannerLabel: 'Neu: Mai 2026',
  },
  {
    id: 'p-effort-aware-hooks',
    title: 'Effort-aware PreToolUse-Hook',
    description: 'Skaliert Lint/Type-Check/Tests basierend auf $CLAUDE_EFFORT — leichte Sessions bleiben schnell, schwere Sessions bekommen volle Qualitäts-Gates.',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `// ~/.claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "case \\"$CLAUDE_EFFORT\\" in low) npm run lint --silent ;; medium) npm run lint && npm run typecheck ;; high|xhigh) npm run lint && npm run typecheck && npm test ;; esac"
          }
        ]
      }
    ]
  }
}`,
    language: 'json',
    tags: ['hooks', 'effort', 'pre-tool-use', 'quality-gates', '2026'],
    useCase: 'Multi-Effort-Workflows: schnelle Iteration bei low, harte Quality-Gates bei high/xhigh',
    lastUpdate: true,
    bannerLabel: 'Neu: 2.1.133',
  },
  {
    id: 'p-mcp-tool-hook-slack',
    title: 'PostToolUse → Slack via MCP-Tool-Hook',
    description: 'Sendet bei jedem Edit/Write eine Diff-Notification in Slack — komplett ohne LLM-Roundtrip, deterministisch über MCP-Tool-Hook (2.1.137+).',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `// ~/.claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "mcp_tool",
            "server": "slack",
            "tool": "post_message",
            "args": {
              "channel": "#claude-diffs",
              "text": "Claude bearbeitete \${file_path} (session \${session_id})"
            }
          }
        ]
      }
    ]
  }
}`,
    language: 'json',
    tags: ['hooks', 'mcp', 'slack', 'integration', 'audit', '2026'],
    useCase: 'Teams, die Edit-Aktivität in Slack mitlesen wollen, ohne dass Claude im Prompt darüber nachdenken muss',
    lastUpdate: true,
    bannerLabel: 'Neu: 2.1.137',
  },
  {
    id: 'p-advisor-haiku-opus',
    title: 'Haiku-Executor + Opus-Advisor mit Budget-Cap',
    description: 'Production-Pattern für Cost-Aware Multi-Model: Haiku 4.5 fährt die Conversation, Opus 4.7 wird nur bei schweren Reasoning-Blocks konsultiert — bis zu 85% Kostenersparnis.',
    category: 'Workflows',
    author: 'CCM Community',
    snippet: `import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-haiku-4-5",   # guenstiger Executor
    max_tokens=8192,
    extra_headers={"anthropic-beta": "advisor-tool-2026-03-01"},
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "advisor_model": "claude-opus-4-7",   # teurer Berater
            "max_advisor_spend_usd": 0.50         # harter Budget-Cap
        }
    ],
    messages=[{
        "role": "user",
        "content": "Refactor auth/middleware.ts und plane Migration"
    }]
)
# Haiku faehrt 80%+ der Conversation
# Opus wird nur bei Architektur/Security/Edge-Cases konsultiert
# Bei Budget-Erschoepfung laeuft Haiku solo weiter`,
    language: 'python',
    tags: ['api', 'advisor', 'multi-model', 'cost-optimization', 'agent-sdk', '2026'],
    useCase: 'Pay-per-Token-Agents, in denen Latenz nicht kritisch ist, aber Qualität+Kosten optimiert werden müssen',
    lastUpdate: true,
    bannerLabel: 'Neu: 2026-05',
  },
];

/** Kategorien in fester Reihenfolge; nur solche, die mindestens ein Pattern haben. Bei neuem Update: neue Patterns in bestehende Kategorien mit lastUpdate: true. */
const CATEGORY_ORDER = ['Prompts', 'CLAUDE.md', 'Workflows', 'MCP', 'Skills', 'Sonstige'] as const;
export const patternCategories = CATEGORY_ORDER.filter((c) =>
  patterns.some((p) => p.category === c)
);
