import type { PlaygroundTask } from '../types';

export const playgroundTasks: PlaygroundTask[] = [
  // ========================================
  // PROJEKT 1.1: File Manager CLI Tool
  // ========================================
  {
    id: 'pg-1-1-a',
    projectId: 'proj-1-1',
    title: 'CLI Projekt initialisieren',
    description: 'Lerne die Befehle um ein Node.js CLI-Projekt mit Claude Code zu starten.',
    mode: 'terminal',
    instruction:
      'In dieser Aufgabe erstellst du ein neues Node.js CLI-Projekt von Grund auf. Du lernst dabei den grundlegenden Workflow: Projektordner erstellen, npm initialisieren, Dependencies installieren und Claude Code starten.',
    requirements: [
      'Erstelle einen neuen Ordner "file-manager-cli" und wechsle hinein',
      'Initialisiere ein npm-Projekt mit automatischen Standardwerten (-y Flag)',
      'Installiere die drei benötigten Pakete: commander, chalk und fs-extra',
      'Starte Claude Code im Projektverzeichnis',
    ],
    language: 'bash',
    starterCode: '',
    validations: [],
    hints: [],
    scenario: {
      welcomeMessage:
        '╔══════════════════════════════════════════╗\n║  Claude Code CLI Simulator v1.0          ║\n║  Projekt: File Manager CLI — Setup       ║\n╚══════════════════════════════════════════╝\n\nErstelle ein neues Node.js CLI-Projekt Schritt für Schritt.\nTippe Befehle ein, wie du sie im echten Terminal eingeben würdest.',
      steps: [
        {
          id: 'step-mkdir',
          prompt: 'Erstelle einen neuen Projektordner "file-manager-cli" und wechsle hinein.',
          expectedCommands: [
            'mkdir file-manager-cli && cd file-manager-cli',
            'mkdir file-manager-cli; cd file-manager-cli',
          ],
          acceptPattern: /mkdir\s+file-manager[\w-]*\s*&&\s*cd\s+file-manager[\w-]*/i,
          response:
            '📁 Ordner erstellt: file-manager-cli/\n📂 Aktuelles Verzeichnis: ~/projects/file-manager-cli',
          errorResponse:
            '❌ Nutze mkdir und cd zusammen um den Ordner zu erstellen UND hineinzuwechseln.',
          hint: 'Verwende "mkdir file-manager-cli && cd file-manager-cli" — der && verknüpft beide Befehle.',
          points: 10,
        },
        {
          id: 'step-npm-init',
          prompt: 'Initialisiere ein neues npm-Projekt mit Standardwerten.',
          expectedCommands: ['npm init -y', 'npm init --yes'],
          acceptPattern: /npm\s+init\s+(-y|--yes)/i,
          response:
            '📦 package.json erstellt:\n{\n  "name": "file-manager-cli",\n  "version": "1.0.0",\n  "main": "index.js"\n}',
          errorResponse:
            '❌ Nicht ganz richtig. Verwende npm init mit einem Flag für automatische Standardwerte.',
          hint: 'npm init -y erstellt package.json mit Standardwerten (das -y Flag sagt "yes" zu allem).',
          points: 10,
        },
        {
          id: 'step-deps',
          prompt: 'Installiere die benötigten Pakete: commander, chalk und fs-extra.',
          expectedCommands: ['npm install commander chalk fs-extra'],
          acceptPattern: /npm\s+install\s+.*commander.*chalk.*fs-extra|npm\s+i\s+.*commander.*chalk.*fs-extra/i,
          response:
            '📦 Pakete installiert:\n  + commander@12.1.0\n  + chalk@5.3.0\n  + fs-extra@11.2.0\n\nadded 3 packages in 2.1s',
          errorResponse:
            '❌ Verwende "npm install" gefolgt von den drei Paketnamen.',
          hint: 'npm install commander chalk fs-extra — alle drei Pakete in einem Befehl.',
          points: 15,
        },
        {
          id: 'step-claude',
          prompt: 'Starte Claude Code in diesem Projekt.',
          expectedCommands: ['claude'],
          acceptPattern: /^claude$/i,
          response:
            '╭──────────────────────────────╮\n│  Claude Code v1.0.30         │\n│  Model: claude-sonnet-4-20250514      │\n╰──────────────────────────────╯\n\n🟢 Claude Code ist gestartet!\n   Arbeitsverzeichnis: ~/projects/file-manager-cli\n   Context geladen: package.json\n\n> Wie kann ich dir helfen?',
          errorResponse:
            '❌ Um Claude Code zu starten, tippe einfach "claude" ein.',
          hint: 'Der Befehl zum Starten von Claude Code ist einfach "claude".',
          points: 5,
        },
      ],
    },
  },
  {
    id: 'pg-1-1-b',
    projectId: 'proj-1-1',
    title: 'Datei-Kategorisierung erstellen',
    description: 'Nutze Claude Code um eine Datei-Kategorisierung für den File Manager zu generieren.',
    mode: 'terminal',
    instruction:
      'Claude Code ist bereits gestartet. Deine Aufgabe ist es, Claude durch gezielte Prompts dazu zu bringen, eine vollständige Datei-Kategorisierung zu erstellen. Du lernst dabei wie man mit /init ein Projekt initialisiert und wie man iterativ mit Claude arbeitet.',
    requirements: [
      'Initialisiere das Projekt mit dem /init Slash-Command',
      'Prompte Claude eine categories.js mit 5 Kategorien zu erstellen (images, documents, code, media, archives)',
      'Lass Claude weitere Dateiformate ergänzen (z.B. .tsx, .jsx, .webm, .7z)',
      'Sage Claude er soll module.exports hinzufügen damit die Datei importierbar ist',
    ],
    language: 'bash',
    starterCode: '',
    validations: [],
    hints: [],
    scenario: {
      welcomeMessage:
        '╔══════════════════════════════════════════╗\n║  Claude Code CLI Simulator v1.0          ║\n║  Projekt: File Manager CLI — Kategorien  ║\n╚══════════════════════════════════════════╝\n\nClaude Code ist bereits gestartet.\nDu erstellst jetzt die Dateityp-Kategorisierung.',
      steps: [
        {
          id: 'step-init',
          prompt: 'Initialisiere das Projekt mit dem /init Slash-Command.',
          expectedCommands: ['/init'],
          acceptPattern: /^\/init$/i,
          response:
            '📝 CLAUDE.md wird erstellt...\n\n✅ CLAUDE.md erstellt mit:\n   - Projektname: file-manager-cli\n   - Typ: Node.js CLI Tool\n   - Dependencies: commander, chalk, fs-extra',
          errorResponse: '❌ Verwende einen Slash-Command um das Projekt zu initialisieren.',
          hint: '/init erstellt automatisch eine CLAUDE.md Datei für dein Projekt.',
          points: 10,
        },
        {
          id: 'step-create-categories',
          prompt: 'Prompte Claude: Erstelle eine categories.js mit Dateityp-Kategorien (images, documents, code, media, archives).',
          expectedCommands: [],
          acceptPattern: /categor|kategor|dateityp|erstell.*js|images.*documents|bilder.*dokument/i,
          response:
            '🤖 Claude erstellt src/categories.js...\n\n📄 src/categories.js:\n   const FILE_CATEGORIES = {\n     images:    { name: "Bilder",    ext: [".jpg",".png",".gif",".svg",".webp"] },\n     documents: { name: "Dokumente", ext: [".pdf",".doc",".docx",".txt",".md"] },\n     code:      { name: "Code",      ext: [".js",".ts",".py",".html",".css"] },\n     media:     { name: "Media",     ext: [".mp3",".mp4",".wav",".avi"] },\n     archives:  { name: "Archive",   ext: [".zip",".tar",".gz",".rar"] }\n   };\n\n✅ Datei erstellt!',
          errorResponse: '❌ Gib Claude einen Prompt um die Kategorien-Datei zu erstellen.',
          hint: 'Schreibe z.B.: "Erstelle eine categories.js mit Kategorien für images, documents, code, media und archives"',
          points: 15,
        },
        {
          id: 'step-add-formats',
          prompt: 'Sage Claude er soll weitere Formate ergänzen (z.B. .tsx, .jsx, .webm, .mkv, .7z).',
          expectedCommands: [],
          acceptPattern: /ergänz|hinzufüg|erweit|mehr|additional|tsx|jsx|webm|mkv|format/i,
          response:
            '🤖 Claude aktualisiert src/categories.js...\n\n   images:    + .bmp, .ico, .tiff\n   documents: + .xlsx, .csv, .rtf, .odt\n   code:      + .tsx, .jsx, .java, .go, .rs, .rb, .php\n   media:     + .mkv, .mov, .flac, .ogg, .webm\n   archives:  + .7z, .bz2, .xz\n\n✅ 17 neue Formate hinzugefügt!',
          errorResponse: '❌ Sage Claude er soll weitere Dateiformate ergänzen.',
          hint: 'Sage z.B.: "Ergänze weitere Formate wie .tsx, .jsx, .mkv, .webm, .7z"',
          points: 10,
        },
        {
          id: 'step-export',
          prompt: 'Lass Claude einen module.exports hinzufügen damit andere Dateien die Kategorien nutzen können.',
          expectedCommands: [],
          acceptPattern: /export|module|require|import|verfügbar|nutz/i,
          response:
            '🤖 Claude fügt Export hinzu:\n\n   module.exports = FILE_CATEGORIES;\n\n✅ Kategorien sind jetzt importierbar:\n   const categories = require("./categories");',
          errorResponse: '❌ Sage Claude er soll einen Export hinzufügen.',
          hint: 'Sage: "Füge module.exports hinzu damit die Kategorien importiert werden können"',
          points: 5,
        },
      ],
    },
  },

  // ========================================
  // PROJEKT 1.2: CLAUDE.md Generator
  // ========================================
  {
    id: 'pg-1-2-a',
    projectId: 'proj-1-2',
    title: 'CLAUDE.md für React-Projekt erstellen',
    description: 'Erstelle eine vollständige CLAUDE.md interaktiv mit Claude Code.',
    mode: 'terminal',
    instruction:
      'Die CLAUDE.md ist das Herzstück jedes Claude Code Projekts — sie gibt Claude den nötigen Kontext. In dieser Aufgabe erstellst du Schritt für Schritt eine vollständige CLAUDE.md für ein bestehendes React-Projekt. Du lernst wie man Tech Stack, Konventionen, Befehle und Projektstruktur dokumentiert.',
    requirements: [
      'Erstelle die Basis-CLAUDE.md mit dem /init Slash-Command',
      'Dokumentiere den Tech Stack (React 18, TypeScript, Tailwind CSS)',
      'Definiere mindestens 3 Code-Konventionen (z.B. Functional Components, kein "any")',
      'Dokumentiere die wichtigen npm-Befehle (dev, build, test, lint)',
      'Füge die Projektstruktur mit src/-Ordnern hinzu',
    ],
    language: 'bash',
    starterCode: '',
    validations: [],
    hints: [],
    scenario: {
      welcomeMessage:
        '╔══════════════════════════════════════════╗\n║  Claude Code CLI Simulator v1.0          ║\n║  Projekt: CLAUDE.md für React-App        ║\n╚══════════════════════════════════════════╝\n\nDu erstellst eine CLAUDE.md für ein React-Projekt.\nClaude Code ist bereits gestartet.',
      steps: [
        {
          id: 'step-init',
          prompt: 'Erstelle eine CLAUDE.md mit dem /init Slash-Command.',
          expectedCommands: ['/init'],
          acceptPattern: /^\/init$/i,
          response:
            '📝 Projekt analysiert...\n\n   Erkannt: React + TypeScript + Tailwind CSS\n   Dateien: 47 Dateien in src/\n   Dependencies: 12 Pakete\n\n✅ CLAUDE.md erstellt mit Basis-Konfiguration!',
          errorResponse: '❌ Nutze den Slash-Command zum Initialisieren.',
          hint: '/init analysiert dein Projekt und erstellt eine passende CLAUDE.md.',
          points: 10,
        },
        {
          id: 'step-tech-stack',
          prompt: 'Sage Claude er soll den Tech Stack in der CLAUDE.md dokumentieren (React, TypeScript, Tailwind).',
          expectedCommands: [],
          acceptPattern: /tech.?stack|react.*typescript|typescript.*react|tailwind|dokumentier|ergänz.*claude\.md/i,
          response:
            '🤖 Claude aktualisiert CLAUDE.md...\n\n   ## Tech Stack\n   + - React 18 mit Functional Components\n   + - TypeScript (strict mode)\n   + - Tailwind CSS für Styling\n   + - Vite als Build Tool\n   + - React Router für Navigation\n\n✅ Tech Stack dokumentiert!',
          errorResponse: '❌ Sage Claude er soll den Tech Stack in der CLAUDE.md hinzufügen.',
          hint: 'Sage z.B.: "Dokumentiere den Tech Stack: React, TypeScript und Tailwind"',
          points: 15,
        },
        {
          id: 'step-conventions',
          prompt: 'Lass Claude mindestens 3 Code-Konventionen zur CLAUDE.md hinzufügen.',
          expectedCommands: [],
          acceptPattern: /konvention|convention|regel|rule|standard|richtlinie|functional|component/i,
          response:
            '🤖 Claude fügt Konventionen hinzu...\n\n   ## Code-Konventionen\n   + - Immer Functional Components verwenden (keine Class Components)\n   + - TypeScript strict mode: kein "any" verwenden\n   + - Error Boundaries für alle Seiten-Komponenten\n   + - Custom Hooks in src/hooks/ ablegen\n   + - Tailwind Klassen: mobile-first Ansatz\n\n✅ 5 Konventionen definiert!',
          errorResponse: '❌ Lass Claude Code-Konventionen zur CLAUDE.md hinzufügen.',
          hint: 'Sage: "Füge Code-Konventionen hinzu: Functional Components, kein any, Error Handling"',
          points: 15,
        },
        {
          id: 'step-commands',
          prompt: 'Sage Claude er soll die wichtigen npm-Befehle (dev, build, test, lint) dokumentieren.',
          expectedCommands: [],
          acceptPattern: /befehle?|command|npm|dev|build|test|lint|script/i,
          response:
            '🤖 Claude ergänzt Befehle...\n\n   ## Wichtige Befehle\n   + `npm run dev`   — Development Server starten\n   + `npm run build` — Production Build erstellen\n   + `npm run test`  — Tests ausführen\n   + `npm run lint`  — ESLint Prüfung\n\n✅ Befehle dokumentiert!',
          errorResponse: '❌ Sage Claude er soll die npm-Befehle dokumentieren.',
          hint: 'Sage: "Dokumentiere die npm-Befehle: dev, build, test, lint"',
          points: 10,
        },
        {
          id: 'step-structure',
          prompt: 'Lass Claude die Projektstruktur mit src/-Ordnern zur CLAUDE.md hinzufügen.',
          expectedCommands: [],
          acceptPattern: /struktur|structure|ordner|folder|src|verzeichnis|tree/i,
          response:
            '🤖 Claude dokumentiert die Struktur...\n\n   ## Projektstruktur\n   + src/\n   + ├── components/    → Wiederverwendbare UI-Komponenten\n   + ├── pages/         → Seiten-Komponenten (Routes)\n   + ├── hooks/         → Custom React Hooks\n   + ├── store/         → State Management (Zustand)\n   + ├── types/         → TypeScript Interfaces\n   + └── data/          → Statische Daten & Konfiguration\n\n✅ Projektstruktur dokumentiert!\n\n🎉 CLAUDE.md ist vollständig!',
          errorResponse: '❌ Lass Claude die Projektstruktur dokumentieren.',
          hint: 'Sage: "Füge die Projektstruktur mit src/ Ordnern hinzu"',
          points: 10,
        },
      ],
    },
  },

  // ========================================
  // PROJEKT 1.3: Context Analyzer
  // ========================================
  {
    id: 'pg-1-3-a',
    projectId: 'proj-1-3',
    title: 'Token-Counter mit Claude erstellen',
    description: 'Lass Claude Code eine Token-Zählfunktion implementieren und teste sie.',
    mode: 'terminal',
    instruction:
      'Context-Management ist entscheidend für effizientes Arbeiten mit Claude Code. In dieser Aufgabe lässt du Claude eine Token-Zählfunktion erstellen, Tests schreiben und den Export einrichten. Du lernst wie man iterativ Code mit Claude entwickelt und die Kosten im Blick behält.',
    requirements: [
      'Prompte Claude eine countTokens-Funktion zu erstellen (mit characters, tokens und lines)',
      'Lass Claude Unit Tests für die Funktion schreiben',
      'Sage Claude er soll module.exports für die Funktion hinzufügen',
      'Prüfe die Session-Kosten mit /cost',
    ],
    language: 'bash',
    starterCode: '',
    validations: [],
    hints: [],
    scenario: {
      welcomeMessage:
        '╔══════════════════════════════════════════╗\n║  Claude Code CLI Simulator v1.0          ║\n║  Projekt: Context Analyzer — Token Count ║\n╚══════════════════════════════════════════╝\n\nDu baust einen Token-Counter mit Claude Code.\nClaude Code ist bereits gestartet.',
      steps: [
        {
          id: 'step-create-function',
          prompt: 'Prompte Claude: Erstelle eine countTokens-Funktion die characters, tokens und lines zurückgibt.',
          expectedCommands: [],
          acceptPattern: /countTokens|token.*funk|funk.*token|zähl|count|erstell.*funktion/i,
          response:
            '🤖 Claude erstellt src/countTokens.js...\n\n   function countTokens(text) {\n     if (!text) return { characters: 0, tokens: 0, lines: 0 };\n     return {\n       characters: text.length,\n       tokens: Math.ceil(text.length / 4),\n       lines: text.split("\\n").length\n     };\n   }\n\n✅ Funktion erstellt!\n   Faustregel: ~4 Zeichen = 1 Token',
          errorResponse: '❌ Sage Claude er soll eine countTokens-Funktion erstellen.',
          hint: 'Sage: "Erstelle eine countTokens-Funktion die characters, tokens und lines zurückgibt"',
          points: 15,
        },
        {
          id: 'step-test',
          prompt: 'Lass Claude einen Test für die Funktion schreiben.',
          expectedCommands: [],
          acceptPattern: /test|prüf|verifiz|überprüf|jest|vitest/i,
          response:
            '🤖 Claude erstellt tests/countTokens.test.js...\n\n   test("counts Hello World correctly", () => {\n     const result = countTokens("Hello World");\n     expect(result.characters).toBe(11);\n     expect(result.tokens).toBe(3);\n     expect(result.lines).toBe(1);\n   });\n\n   test("handles empty string", () => {\n     const result = countTokens("");\n     expect(result).toEqual({ characters: 0, tokens: 0, lines: 0 });\n   });\n\n✅ 2 Tests erstellt!',
          errorResponse: '❌ Sage Claude er soll Tests für die Funktion schreiben.',
          hint: 'Sage: "Schreibe Tests für die countTokens-Funktion"',
          points: 10,
        },
        {
          id: 'step-export',
          prompt: 'Sage Claude er soll die Funktion exportieren (module.exports).',
          expectedCommands: [],
          acceptPattern: /export|module|require|import|verfügbar/i,
          response:
            '🤖 Claude fügt Export hinzu:\n\n   module.exports = countTokens;\n\n✅ Funktion exportiert und bereit zur Verwendung!',
          errorResponse: '❌ Sage Claude er soll den Export hinzufügen.',
          hint: 'Sage: "Füge module.exports hinzu"',
          points: 5,
        },
        {
          id: 'step-cost',
          prompt: 'Prüfe die Kosten dieser Session.',
          expectedCommands: ['/cost'],
          acceptPattern: /^\/cost$/i,
          response:
            '💰 Session-Kosten:\n   ┌──────────────────────────┐\n   │ Input Tokens:    1,523   │\n   │ Output Tokens:     892   │\n   │ Total: $0.0067          │\n   └──────────────────────────┘',
          errorResponse: '❌ Es gibt einen Slash-Command für die Kosten.',
          hint: '/cost zeigt die API-Kosten der aktuellen Session.',
          points: 5,
        },
      ],
    },
  },

  // ========================================
  // PROJEKT 2.1: Custom MCP Server
  // ========================================
  {
    id: 'pg-2-1-a',
    projectId: 'proj-2-1',
    title: 'MCP Server einrichten',
    description: 'Konfiguriere MCP Server über die Claude Code CLI.',
    mode: 'terminal',
    instruction:
      'MCP (Model Context Protocol) Server erweitern Claude Code um externe Tools. In dieser Aufgabe lernst du wie man MCP Server über die CLI hinzufügt, auflistet und zwischen Project- und User-Scope wechselt. Du richtest einen Weather-API und einen Database Server ein.',
    requirements: [
      'Füge einen MCP Server "weather-api" mit "claude mcp add" hinzu',
      'Füge einen zweiten Server "database" mit node und lokalem Pfad hinzu',
      'Liste alle konfigurierten MCP Server mit "claude mcp list" auf',
      'Setze den weather-api Server auf User-Scope (--scope user) für globale Verfügbarkeit',
      'Starte Claude Code und verifiziere dass beide Server geladen werden',
    ],
    language: 'bash',
    starterCode: '',
    validations: [],
    hints: [],
    scenario: {
      welcomeMessage:
        '╔══════════════════════════════════════════╗\n║  Claude Code CLI Simulator v1.0          ║\n║  Projekt: MCP Server Konfiguration       ║\n╚══════════════════════════════════════════╝\n\nDu konfigurierst MCP Server für Claude Code.\nDie CLI-Befehle beginnen mit "claude mcp".',
      steps: [
        {
          id: 'step-add-weather',
          prompt: 'Füge einen MCP Server namens "weather-api" hinzu (mit npx).',
          expectedCommands: ['claude mcp add weather-api'],
          acceptPattern: /claude\s+mcp\s+add\s+weather/i,
          response:
            '✅ MCP Server hinzugefügt:\n\n   Name: weather-api\n   Command: npx\n   Args: ["-y", "@my/mcp-weather"]\n   Scope: project\n\n   Server wird beim nächsten Start geladen.',
          errorResponse: '❌ Verwende "claude mcp add <name>" um einen Server hinzuzufügen.',
          hint: 'Syntax: claude mcp add weather-api',
          points: 10,
        },
        {
          id: 'step-add-database',
          prompt: 'Füge einen zweiten Server "database" hinzu mit node und lokalem Pfad.',
          expectedCommands: ['claude mcp add database'],
          acceptPattern: /claude\s+mcp\s+add\s+database/i,
          response:
            '✅ MCP Server hinzugefügt:\n\n   Name: database\n   Command: node\n   Args: ["./mcp-server/index.js"]\n   Scope: project\n\n   Tipp: Setze Umgebungsvariablen mit -e:\n   claude mcp add database -e DB_HOST=localhost -e DB_PORT=5432',
          errorResponse: '❌ Füge den "database" Server mit claude mcp add hinzu.',
          hint: 'claude mcp add database — fügt einen lokalen MCP Server hinzu.',
          points: 10,
        },
        {
          id: 'step-list',
          prompt: 'Zeige alle konfigurierten MCP Server an.',
          expectedCommands: ['claude mcp list'],
          acceptPattern: /claude\s+mcp\s+(list|ls)/i,
          response:
            '📋 Konfigurierte MCP Server:\n\n   ┌──────────────┬────────────┬──────────┐\n   │ Name         │ Scope      │ Status   │\n   ├──────────────┼────────────┼──────────┤\n   │ weather-api  │ project    │ ✅ ready  │\n   │ database     │ project    │ ✅ ready  │\n   └──────────────┴────────────┴──────────┘',
          errorResponse: '❌ Es gibt einen Befehl um alle MCP Server aufzulisten.',
          hint: '"claude mcp list" zeigt alle konfigurierten Server an.',
          points: 10,
        },
        {
          id: 'step-scope',
          prompt: 'Setze den weather-api Server auf User-Scope (global verfügbar) mit --scope user.',
          expectedCommands: ['claude mcp add weather-api --scope user'],
          acceptPattern: /claude\s+mcp\s+add.*--scope\s+user.*weather|claude\s+mcp\s+add.*weather.*--scope\s+user/i,
          response:
            '✅ MCP Server aktualisiert:\n\n   Name: weather-api\n   Scope: user (global verfügbar in ALLEN Projekten)\n\n   💡 User-Scope Server sind überall verfügbar.\n   Project-Scope Server nur im aktuellen Projekt.',
          errorResponse: '❌ Verwende --scope user um den Server global verfügbar zu machen.',
          hint: 'claude mcp add weather-api --scope user — macht den Server global.',
          points: 15,
        },
        {
          id: 'step-test',
          prompt: 'Starte Claude Code und teste ob die Server geladen werden.',
          expectedCommands: ['claude'],
          acceptPattern: /^claude$/i,
          response:
            '╭──────────────────────────────╮\n│  Claude Code v1.0.30         │\n│  MCP Server: 2 geladen       │\n╰──────────────────────────────╯\n\n🟢 weather-api: 3 Tools (get_weather, get_forecast, get_alerts)\n🟢 database: 4 Tools (query, insert, update, delete)\n\n✅ Alle MCP Server erfolgreich geladen!',
          errorResponse: '❌ Starte Claude Code um die Server zu testen.',
          hint: 'Starte Claude Code mit "claude" — die Server werden automatisch geladen.',
          points: 10,
        },
      ],
    },
  },
  {
    id: 'pg-2-1-b',
    projectId: 'proj-2-1',
    title: 'MCP Tools definieren & testen',
    description: 'Erstelle MCP Tool-Definitionen und teste sie live mit Claude Code.',
    mode: 'terminal',
    instruction:
      'Nachdem die MCP Server konfiguriert sind, erstellst du jetzt die eigentlichen Tool-Definitionen. Du lässt Claude einen Weather-API MCP Server mit 3 Tools bauen und testest sie anschließend durch natürliche Prompts — Claude erkennt automatisch welches Tool genutzt werden soll.',
    requirements: [
      'Lass Claude einen MCP Server mit 3 Tools erstellen: get_weather, get_forecast, get_alerts',
      'Teste get_weather indem du Claude nach dem Wetter in Berlin fragst',
      'Teste get_forecast mit einer 5-Tage-Vorhersage für München',
      'Prüfe die Session-Kosten inklusive MCP Tool Calls mit /cost',
    ],
    language: 'bash',
    starterCode: '',
    validations: [],
    hints: [],
    scenario: {
      welcomeMessage:
        '╔══════════════════════════════════════════╗\n║  Claude Code CLI Simulator v1.0          ║\n║  Projekt: MCP Tool Definition            ║\n╚══════════════════════════════════════════╝\n\nClaude Code ist gestartet. MCP Server "weather-api" ist verbunden.\nDu testest jetzt die Tool-Definitionen.',
      steps: [
        {
          id: 'step-create-server',
          prompt: 'Prompte Claude: Erstelle einen MCP Server mit 3 Tools (get_weather, get_forecast, get_alerts).',
          expectedCommands: [],
          acceptPattern: /erstell|create|server|tool|get_weather|weather|forecast|alert|mcp.*server/i,
          response:
            '🤖 Claude erstellt mcp-server/index.ts...\n\n   Tools definiert:\n   📌 get_weather    — Aktuelles Wetter (city: string)\n   📌 get_forecast   — 5-Tage-Vorhersage (city: string, days?: number)\n   📌 get_alerts     — Wetterwarnungen (region: string)\n\n   Jedes Tool hat:\n   ✅ name, description, inputSchema\n   ✅ required-Felder definiert\n   ✅ JSON Schema Typ-Definitionen\n\n✅ MCP Server erstellt!',
          errorResponse: '❌ Sage Claude er soll den MCP Server mit den 3 Tools erstellen.',
          hint: 'Sage: "Erstelle einen MCP Server mit get_weather, get_forecast und get_alerts"',
          points: 15,
        },
        {
          id: 'step-test-weather',
          prompt: 'Frage Claude nach dem Wetter in Berlin (testet den MCP Server).',
          expectedCommands: [],
          acceptPattern: /wetter|weather|berlin|temperatur/i,
          response:
            '🤖 Claude nutzt Tool: weather-api.get_weather\n   Parameter: { "city": "Berlin" }\n\n🌤️ Wetter in Berlin:\n   Temperatur: 18°C\n   Beschreibung: Teilweise bewölkt\n   Luftfeuchtigkeit: 65%\n   Wind: 12 km/h NW\n\n   (Daten via MCP Server)',
          errorResponse: '❌ Frage Claude nach dem Wetter — er nutzt automatisch den MCP Server.',
          hint: 'Schreibe z.B.: "Wie ist das Wetter in Berlin?"',
          points: 15,
        },
        {
          id: 'step-test-forecast',
          prompt: 'Frage nach der 5-Tage-Vorhersage für München.',
          expectedCommands: [],
          acceptPattern: /vorhersage|forecast|münchen|munich|5.?tage|prognose/i,
          response:
            '🤖 Claude nutzt Tool: weather-api.get_forecast\n   Parameter: { "city": "München", "days": 5 }\n\n📅 5-Tage-Vorhersage München:\n   Mo: 🌤️ 19°C  Di: ☀️ 22°C  Mi: 🌧️ 15°C\n   Do: ⛅ 17°C  Fr: ☀️ 21°C\n\n✅ MCP Tools funktionieren korrekt!',
          errorResponse: '❌ Frage nach der Vorhersage für eine Stadt.',
          hint: 'Sage: "Zeig mir die 5-Tage-Vorhersage für München"',
          points: 10,
        },
        {
          id: 'step-cost',
          prompt: 'Prüfe die Session-Kosten.',
          expectedCommands: ['/cost'],
          acceptPattern: /^\/cost$/i,
          response:
            '💰 Session-Kosten:\n   ┌──────────────────────────┐\n   │ Input:  3,456 Tokens     │\n   │ Output: 1,234 Tokens     │\n   │ Tools:  2 MCP Calls      │\n   │ Total:  $0.0189          │\n   └──────────────────────────┘',
          errorResponse: '❌ Nutze den Slash-Command für Kosten.',
          hint: '/cost zeigt die Session-Kosten.',
          points: 5,
        },
      ],
    },
  },

  // ========================================
  // PROJEKT 2.2: Multi-Agent Data Pipeline
  // ========================================
  {
    id: 'pg-2-2-a',
    projectId: 'proj-2-2',
    title: 'Pipeline-Architektur aufbauen',
    description: 'Erstelle eine Multi-Agent Pipeline mit 3 verketteten Agents.',
    mode: 'terminal',
    instruction:
      'Multi-Agent Pipelines sind eines der mächtigsten Konzepte in Claude Code. Du definierst 3 Agents die nacheinander Daten verarbeiten: Der Collector sammelt, der Processor bereinigt und der Aggregator fasst zusammen. Jeder Agent hat Dependencies die bestimmen wann er starten darf.',
    requirements: [
      'Initialisiere das Pipeline-Projekt mit /init',
      'Erstelle den Collector-Agent (keine Dependencies, sammelt Daten aus 3 APIs)',
      'Erstelle den Processor-Agent (Dependency: Collector, bereinigt & transformiert Daten)',
      'Erstelle den Aggregator-Agent (Dependency: Processor, aggregiert die Ergebnisse)',
    ],
    language: 'bash',
    starterCode: '',
    validations: [],
    hints: [],
    scenario: {
      welcomeMessage:
        '╔══════════════════════════════════════════╗\n║  Claude Code CLI Simulator v1.0          ║\n║  Projekt: Multi-Agent Pipeline — Setup   ║\n╚══════════════════════════════════════════╝\n\nDu definierst die Architektur einer Data Pipeline.\nClaude Code ist bereits gestartet.',
      steps: [
        {
          id: 'step-init',
          prompt: 'Initialisiere das Pipeline-Projekt.',
          expectedCommands: ['/init'],
          acceptPattern: /^\/init$/i,
          response:
            '📝 CLAUDE.md erstellt:\n\n   Projektname: Multi-Agent Data Pipeline\n   Typ: Node.js Pipeline-Orchestrator\n   Agents: (noch keine definiert)\n\n✅ Bereit für die Pipeline-Architektur!',
          errorResponse: '❌ Verwende /init um das Projekt zu initialisieren.',
          hint: '/init erstellt die Basis-CLAUDE.md.',
          points: 5,
        },
        {
          id: 'step-collector',
          prompt: 'Prompte Claude: Erstelle den Collector-Agent der Daten aus APIs sammelt.',
          expectedCommands: [],
          acceptPattern: /collector|samml|collect|daten.*samm|agent.*collect|erstell.*collect/i,
          response:
            '🤖 Claude erstellt agents/collector.js...\n\n   Agent: DataCollector\n   ┌────────────────────────────────────┐\n   │ Task: Daten aus 3 APIs sammeln    │\n   │ Dependencies: []  (startet zuerst) │\n   │ MaxRetries: 3                     │\n   │ Timeout: 30s                      │\n   └────────────────────────────────────┘\n\n✅ Collector-Agent erstellt!',
          errorResponse: '❌ Sage Claude er soll den Collector-Agent erstellen.',
          hint: 'Sage: "Erstelle einen Collector-Agent der Daten aus APIs sammelt"',
          points: 15,
        },
        {
          id: 'step-processor',
          prompt: 'Erstelle den Processor-Agent (hängt vom Collector ab).',
          expectedCommands: [],
          acceptPattern: /processor|verarbeit|process|bereinig|transform|agent.*process|erstell.*process/i,
          response:
            '🤖 Claude erstellt agents/processor.js...\n\n   Agent: DataProcessor\n   ┌────────────────────────────────────────┐\n   │ Task: Daten bereinigen & transformieren│\n   │ Dependencies: ["collector"]            │\n   │ MaxRetries: 3                         │\n   │ Timeout: 60s                          │\n   └────────────────────────────────────────┘\n\n✅ Processor-Agent erstellt!',
          errorResponse: '❌ Sage Claude er soll den Processor-Agent erstellen.',
          hint: 'Sage: "Erstelle einen Processor-Agent der vom Collector abhängt"',
          points: 15,
        },
        {
          id: 'step-aggregator',
          prompt: 'Erstelle den Aggregator-Agent (hängt vom Processor ab).',
          expectedCommands: [],
          acceptPattern: /aggregat|zusammenfass|report|agent.*aggregat|erstell.*aggregat/i,
          response:
            '🤖 Claude erstellt agents/aggregator.js...\n\n   Agent: DataAggregator\n   ┌────────────────────────────────────┐\n   │ Task: Ergebnisse aggregieren      │\n   │ Dependencies: ["processor"]        │\n   │ MaxRetries: 3                     │\n   │ Output: report.json               │\n   └────────────────────────────────────┘\n\n   Pipeline-Kette:\n   collector → processor → aggregator\n\n✅ Pipeline-Architektur komplett!',
          errorResponse: '❌ Sage Claude er soll den Aggregator-Agent erstellen.',
          hint: 'Sage: "Erstelle einen Aggregator-Agent der vom Processor abhängt"',
          points: 15,
        },
      ],
    },
  },

  // ========================================
  // PROJEKT 2.3: Custom Agent mit Personality
  // ========================================
  {
    id: 'pg-2-3-a',
    projectId: 'proj-2-3',
    title: 'Agent-Personality erstellen',
    description: 'Erstelle eine CLAUDE.md die einen autonomen Code-Review Agent definiert.',
    mode: 'terminal',
    instruction:
      'Die CLAUDE.md kann Claude eine Persönlichkeit und feste Verhaltensregeln geben. Du erstellst einen Code-Review Agent der autonom arbeitet: Er hat eine definierte Rolle, klare Review-Regeln und Beispiele für gutes und schlechtes Feedback. So entsteht ein spezialisierter Agent der konsistent hochwertige Reviews liefert.',
    requirements: [
      'Initialisiere das Projekt mit /init',
      'Definiere die Rolle "Code-Review Agent" mit Persönlichkeitsmerkmalen (gründlich, fair, lösungsorientiert)',
      'Füge mindestens 4 Review-Regeln hinzu (Type Safety, Performance, Security, Error Handling)',
      'Ergänze Beispiele für gutes und schlechtes Review-Feedback',
    ],
    language: 'bash',
    starterCode: '',
    validations: [],
    hints: [],
    scenario: {
      welcomeMessage:
        '╔══════════════════════════════════════════╗\n║  Claude Code CLI Simulator v1.0          ║\n║  Projekt: Custom Agent — Personality     ║\n╚══════════════════════════════════════════╝\n\nDu erstellst einen Code-Review Agent mit eigener Persönlichkeit.\nClaude Code ist bereits gestartet.',
      steps: [
        {
          id: 'step-init',
          prompt: 'Initialisiere das Projekt mit /init.',
          expectedCommands: ['/init'],
          acceptPattern: /^\/init$/i,
          response:
            '📝 CLAUDE.md erstellt:\n   Projektname: CodeReviewer Agent\n\n✅ Basis-CLAUDE.md erstellt!',
          errorResponse: '❌ Nutze /init.',
          hint: '/init erstellt die CLAUDE.md.',
          points: 5,
        },
        {
          id: 'step-role',
          prompt: 'Sage Claude er soll die Rolle "Code-Review Agent" mit Persönlichkeitsmerkmalen in die CLAUDE.md schreiben.',
          expectedCommands: [],
          acceptPattern: /rolle|role|persönlichkeit|personality|code.?review|merkmal|eigenschaft/i,
          response:
            '🤖 Claude aktualisiert CLAUDE.md...\n\n   # Agent: CodeReviewer\n\n   ## Rolle\n   + Autonomer Code-Review Agent der Code-Qualität sicherstellt.\n\n   ## Persönlichkeit\n   + - Gründlich: Prüft jeden geänderten Code-Pfad\n   + - Fair: Lobt gute Lösungen, kritisiert konstruktiv\n   + - Lösungsorientiert: Gibt immer konkrete Verbesserungsvorschläge\n   + - Sicherheitsbewusst: Achtet besonders auf Vulnerabilities\n\n✅ Rolle und Persönlichkeit definiert!',
          errorResponse: '❌ Sage Claude er soll Rolle und Persönlichkeit definieren.',
          hint: 'Sage: "Definiere die Rolle als Code-Review Agent mit Persönlichkeitsmerkmalen"',
          points: 15,
        },
        {
          id: 'step-rules',
          prompt: 'Lass Claude Review-Regeln hinzufügen (mindestens 4 Regeln).',
          expectedCommands: [],
          acceptPattern: /regel|rule|review.?regel|review.?rule|richtlinie|guideline|prüf/i,
          response:
            '🤖 Claude ergänzt Review-Regeln...\n\n   ## Review-Regeln\n   + 1. Prüfe Type Safety — kein "any" in TypeScript\n   + 2. Bewerte Performance — unnötige Re-Renders vermeiden\n   + 3. Prüfe Security — keine SQL-Injection, XSS, etc.\n   + 4. Prüfe Error Handling — alle async Calls mit try/catch\n   + 5. Bewerte Lesbarkeit — klare Variablennamen, Kommentare\n\n✅ 5 Review-Regeln definiert!',
          errorResponse: '❌ Sage Claude er soll Review-Regeln definieren.',
          hint: 'Sage: "Füge Review-Regeln hinzu: Type Safety, Performance, Security, Error Handling"',
          points: 15,
        },
        {
          id: 'step-examples',
          prompt: 'Lass Claude Beispiele für gutes und schlechtes Review-Feedback hinzufügen.',
          expectedCommands: [],
          acceptPattern: /beispiel|example|feedback|gut.*schlecht|good.*bad|positiv.*negativ/i,
          response:
            '🤖 Claude fügt Beispiele hinzu...\n\n   ## Gutes Feedback\n   + ✅ "Gute Nutzung von useMemo — verhindert unnötige Re-Renders"\n   + ✅ "bcrypt für Passwort-Hashing ist die richtige Wahl"\n\n   ## Schlechtes Feedback (vermeiden)\n   + ❌ "Das ist falsch" (zu vage)\n   + ❌ "Mach das anders" (ohne konkreten Vorschlag)\n\n✅ Feedback-Beispiele hinzugefügt!\n\n🎉 Agent-Personality ist vollständig!',
          errorResponse: '❌ Sage Claude er soll Feedback-Beispiele hinzufügen.',
          hint: 'Sage: "Füge Beispiele für gutes und schlechtes Review-Feedback hinzu"',
          points: 10,
        },
      ],
    },
  },

  // ========================================
  // PROJEKT 3.1: Deployment Pipeline
  // ========================================
  {
    id: 'pg-3-1-a',
    projectId: 'proj-3-1',
    title: 'Hook-System konfigurieren',
    description: 'Konfiguriere 4 verschiedene Claude Code Hooks für automatisierte CI/CD Workflows.',
    mode: 'terminal',
    instruction:
      'Hooks sind das Automatisierungs-Feature von Claude Code. Sie führen Befehle bei bestimmten Events aus: PreCommit prüft Code vor dem Commit, PostToolUse formatiert nach dem Schreiben, Notification benachrichtigt dich und Stop schreibt ein Session-Log. Du konfigurierst alle 4 Hook-Typen.',
    requirements: [
      'Richte einen PreCommit Hook ein der "npm run lint && npm test" ausführt (blocking: true)',
      'Richte einen PostToolUse Hook ein der Prettier auf geschriebene Dateien anwendet',
      'Füge einen Notification Hook für Desktop-Benachrichtigungen hinzu',
      'Füge einen Stop Hook hinzu der ein Deployment-Log schreibt',
    ],
    language: 'bash',
    starterCode: '',
    validations: [],
    hints: [],
    scenario: {
      welcomeMessage:
        '╔══════════════════════════════════════════╗\n║  Claude Code CLI Simulator v1.0          ║\n║  Projekt: Deployment Pipeline — Hooks    ║\n╚══════════════════════════════════════════╝\n\nDu richtest Claude Code Hooks für automatisierte\nWorkflows ein. Claude Code ist bereits gestartet.',
      steps: [
        {
          id: 'step-precommit',
          prompt: 'Sage Claude er soll einen PreCommit Hook einrichten der Lint & Tests ausführt (blocking).',
          expectedCommands: [],
          acceptPattern: /pre.?commit|hook.*lint|hook.*test|commit.*hook|lint.*test/i,
          response:
            '🤖 Claude konfiguriert PreCommit Hook...\n\n   .claude/settings.json:\n   "PreCommit": [{\n     "command": "npm run lint && npm test",\n     "blocking": true\n   }]\n\n   🔒 blocking: true → Commit wird abgebrochen wenn Tests fehlschlagen!\n\n✅ PreCommit Hook aktiv!',
          errorResponse: '❌ Sage Claude er soll einen PreCommit Hook einrichten.',
          hint: 'Sage: "Richte einen PreCommit Hook ein der npm run lint && npm test ausführt"',
          points: 15,
        },
        {
          id: 'step-postwrite',
          prompt: 'Richte einen PostToolUse Hook ein der Prettier nach dem Schreiben ausführt.',
          expectedCommands: [],
          acceptPattern: /post.?tool|prettier|format|nach.*schreib|after.*write/i,
          response:
            '🤖 Claude konfiguriert PostToolUse Hook...\n\n   "PostToolUse": [{\n     "matcher": "Write",\n     "command": "npx prettier --write $CLAUDE_FILE_PATH",\n     "blocking": false\n   }]\n\n   📝 Jede geschriebene Datei wird automatisch formatiert.\n   $CLAUDE_FILE_PATH = der Pfad der geänderten Datei.\n\n✅ PostToolUse Hook aktiv!',
          errorResponse: '❌ Sage Claude er soll einen PostToolUse Hook für Prettier einrichten.',
          hint: 'Sage: "Richte einen PostToolUse Hook ein der Prettier ausführt"',
          points: 15,
        },
        {
          id: 'step-notification',
          prompt: 'Füge einen Notification Hook hinzu der dich per Desktop-Benachrichtigung informiert.',
          expectedCommands: [],
          acceptPattern: /notification|benachricht|notify|alert|desktop/i,
          response:
            '🤖 Claude fügt Notification Hook hinzu...\n\n   "Notification": [{\n     "command": "osascript -e \'display notification \\\"$CLAUDE_MESSAGE\\\" with title \\\"Claude Code\\\"\'",\n     "blocking": false\n   }]\n\n   🔔 Desktop-Benachrichtigung bei jeder Claude-Antwort!\n\n✅ Notification Hook aktiv!',
          errorResponse: '❌ Sage Claude er soll einen Notification Hook hinzufügen.',
          hint: 'Sage: "Füge einen Notification Hook für Desktop-Benachrichtigungen hinzu"',
          points: 10,
        },
        {
          id: 'step-stop',
          prompt: 'Füge einen Stop Hook hinzu der ein Deployment-Log schreibt.',
          expectedCommands: [],
          acceptPattern: /stop|log|deploy|ende|abschluss|beend/i,
          response:
            '🤖 Claude fügt Stop Hook hinzu...\n\n   "Stop": [{\n     "command": "echo \\"[$(date)] Session beendet\\" >> deploy.log",\n     "blocking": false\n   }]\n\n   📋 Jede Session wird im deploy.log protokolliert.\n\n✅ Alle 4 Hooks konfiguriert!\n   PreCommit → PostToolUse → Notification → Stop',
          errorResponse: '❌ Sage Claude er soll einen Stop Hook für das Deploy-Log einrichten.',
          hint: 'Sage: "Füge einen Stop Hook hinzu der ins deploy.log schreibt"',
          points: 10,
        },
      ],
    },
  },

  // ========================================
  // PROJEKT 3.2: Code Review Agent
  // ========================================
  {
    id: 'pg-3-2-a',
    projectId: 'proj-3-2',
    title: 'Review-Agent als CI/CD-Script',
    description: 'Baue ein vollständiges CI/CD Review-Script mit Claude Code im Headless-Modus.',
    mode: 'terminal',
    instruction:
      'In der Praxis läuft Claude Code oft non-interaktiv in CI/CD Pipelines. Du lernst den Print-Modus (-p), Piping von git diff, die Einschränkung auf lesende Tools (--allowedTools) und strukturierte JSON-Ausgabe. Am Ende kombinierst du alles zu einer vollständigen Review-Pipeline.',
    requirements: [
      'Hole den aktuellen git diff für das Review',
      'Starte Claude Code im nicht-interaktiven Modus mit "claude -p" und einem Review-Prompt',
      'Schränke die verfügbaren Tools ein: nur Read, Grep, Glob (--allowedTools)',
      'Konfiguriere JSON als Output-Format für maschinelle Weiterverarbeitung',
      'Kombiniere alles zu einer vollständigen Pipeline: git diff | claude -p --allowedTools --output-format json',
    ],
    language: 'bash',
    starterCode: '',
    validations: [],
    hints: [],
    scenario: {
      welcomeMessage:
        '╔══════════════════════════════════════════╗\n║  Claude Code CLI Simulator v1.0          ║\n║  Projekt: CI/CD Review Agent — Script    ║\n╚══════════════════════════════════════════╝\n\nDu baust ein Review-Script für die CI/CD Pipeline.\nDer Agent läuft non-interaktiv (Headless).',
      steps: [
        {
          id: 'step-git-diff',
          prompt: 'Hole den aktuellen git diff für das Review.',
          expectedCommands: ['git diff', 'git diff --staged'],
          acceptPattern: /git\s+(diff|log|show)/i,
          response:
            '📊 Git Diff:\n   +47 -12 Zeilen in 3 Dateien:\n   - src/auth.ts (geändert)\n   - src/api/users.ts (geändert)\n   - tests/auth.test.ts (neu)\n\n✅ Diff bereit für Review.',
          errorResponse: '❌ Verwende "git diff" um die Änderungen zu holen.',
          hint: 'git diff zeigt die aktuellen Änderungen an.',
          points: 10,
        },
        {
          id: 'step-print-mode',
          prompt: 'Starte Claude Code im nicht-interaktiven Modus (-p) mit einem Review-Prompt.',
          expectedCommands: [],
          acceptPattern: /claude\s+(-p|--print)/i,
          response:
            '🤖 Claude Code (non-interactive mode)\n\n   $ claude -p "Reviewe die letzten Änderungen"\n\n   📝 Output:\n   3 Dateien analysiert, 2 Probleme gefunden.\n\n✅ Print-Modus funktioniert!',
          errorResponse: '❌ Verwende "claude -p" für den nicht-interaktiven Modus.',
          hint: 'claude -p "Dein Prompt" — führt Claude ohne interaktive Eingabe aus.',
          points: 15,
        },
        {
          id: 'step-allowed-tools',
          prompt: 'Starte Claude mit eingeschränkten Tools: nur Read, Grep, Glob (Sicherheit!).',
          expectedCommands: [],
          acceptPattern: /--allowedTools|allowed.?tools|eingeschränkt|nur.*read|read.*grep.*glob/i,
          response:
            '🔒 Claude Code mit eingeschränkten Tools:\n\n   Erlaubt: Read, Grep, Glob\n   Gesperrt: Write, Shell, WebFetch, ...\n\n   ✅ Review-Agent kann NUR lesen — perfekt für CI/CD!\n   Keine Schreibrechte = keine ungewollten Änderungen.',
          errorResponse: '❌ Verwende --allowedTools um die Tools einzuschränken.',
          hint: 'Syntax: --allowedTools "Read,Grep,Glob" — nur lesende Operationen.',
          points: 15,
        },
        {
          id: 'step-json-output',
          prompt: 'Setze das Output-Format auf JSON für maschinelle Weiterverarbeitung.',
          expectedCommands: [],
          acceptPattern: /--output.?format\s+json|json.*output|ausgabe.*json|format.*json/i,
          response:
            '📋 JSON Output konfiguriert:\n\n   --output-format json\n\n   Ergebnis wird als strukturiertes JSON ausgegeben:\n   { "review": { "issues": [...], "score": 8.5 } }\n\n   💡 Ideal für CI/CD Pipelines:\n   → Weiterverarbeitung mit jq, Node.js, Python etc.',
          errorResponse: '❌ Verwende --output-format json für strukturierte Ausgabe.',
          hint: 'Füge "--output-format json" zum Befehl hinzu.',
          points: 15,
        },
        {
          id: 'step-full-pipeline',
          prompt: 'Kombiniere alles: Pipe git diff an Claude mit lesenden Tools und JSON output.',
          expectedCommands: [],
          acceptPattern: /git\s+diff.*claude.*-p|claude.*-p.*--allowed.*--output.*json|pipe|kombini/i,
          response:
            '🚀 Vollständige CI/CD Pipeline:\n\n   $ git diff | claude -p \\\n       --allowedTools "Read,Grep,Glob" \\\n       --output-format json \\\n       "Reviewe diese Änderungen" \\\n       > review-result.json\n\n   ✅ Pipeline erfolgreich!\n\n   Zusammenfassung:\n   ├── Input: git diff (47 Zeilen)\n   ├── Tools: Nur lesend (sicher)\n   ├── Output: review-result.json\n   └── Kosten: $0.0089\n\n   🎉 Vollständige CI/CD Review-Pipeline gebaut!',
          errorResponse: '❌ Kombiniere git diff | claude -p --allowedTools "..." --output-format json',
          hint: 'git diff | claude -p --allowedTools "Read,Grep,Glob" --output-format json "Review"',
          points: 20,
        },
      ],
    },
  },

  // ========================================
  // PROJEKT 3.3: JARVIS-Lite
  // ========================================
  {
    id: 'pg-3-3-a',
    projectId: 'proj-3-3',
    title: 'JARVIS-Lite aufbauen',
    description: 'Erstelle deinen persönlichen AI-Entwicklungsassistenten als Meisterprojekt.',
    mode: 'terminal',
    instruction:
      'Das Meisterprojekt! Du baust JARVIS-Lite — einen persönlichen AI-Entwicklungsassistenten der alle gelernten Konzepte vereint: CLAUDE.md mit Mission & Persönlichkeit, MCP Server Integration (GitHub, Filesystem, PostgreSQL), automatisierte Workflows und Eskalationsregeln. Am Ende hast du einen autonomen Assistenten der komplexe Entwicklungsaufgaben selbstständig erledigt.',
    requirements: [
      'Erstelle das JARVIS-Lite Projekt und starte Claude Code',
      'Definiere die Mission und richte 3 MCP Server ein: GitHub, Filesystem und PostgreSQL',
      'Lass Claude automatisierte Workflows erstellen: Auto-Review, Status-Report, Docs-Updates',
      'Definiere Eskalationsregeln: Wann soll JARVIS nachfragen statt autonom zu handeln?',
    ],
    language: 'bash',
    starterCode: '',
    validations: [],
    hints: [],
    scenario: {
      welcomeMessage:
        '╔══════════════════════════════════════════╗\n║  Claude Code CLI Simulator v1.0          ║\n║  Projekt: JARVIS-Lite — Aufbau           ║\n╚══════════════════════════════════════════╝\n\nDas Meisterprojekt! Baue deinen eigenen\npersönlichen AI-Entwicklungsassistenten.',
      steps: [
        {
          id: 'step-create',
          prompt: 'Erstelle das JARVIS-Lite Projekt und starte Claude Code.',
          expectedCommands: [],
          acceptPattern: /mkdir|init|claude|jarvis|erstell|start/i,
          response:
            '📁 Projekt erstellt: jarvis-lite/\n\n╭──────────────────────────────╮\n│  Claude Code v1.0.30         │\n│  Projekt: JARVIS-Lite        │\n╰──────────────────────────────╯\n\n🤖 JARVIS-Lite initialisiert!',
          errorResponse: '❌ Erstelle das Projekt und starte Claude Code.',
          hint: 'mkdir jarvis-lite && cd jarvis-lite && claude',
          points: 5,
        },
        {
          id: 'step-mission',
          prompt: 'Sage Claude er soll die CLAUDE.md mit einer Mission und MCP Servern (GitHub, Filesystem, PostgreSQL) erstellen.',
          expectedCommands: [],
          acceptPattern: /mission|mcp|github|filesystem|postgres|server|claude\.md|persönlich/i,
          response:
            '🤖 Claude erstellt CLAUDE.md für JARVIS-Lite...\n\n   # JARVIS-Lite\n\n   ## Mission\n   + Persönlicher Entwicklungsassistent der Workflows automatisiert.\n\n   ## MCP Server Integration\n   + 🟢 GitHub Server — PRs, Issues, Repositories\n   + 🟢 Filesystem Server — Dateioperationen\n   + 🟢 PostgreSQL Server — Datenbank-Queries\n\n✅ Mission und 3 MCP Server definiert!',
          errorResponse: '❌ Sage Claude er soll Mission und MCP Server definieren.',
          hint: 'Sage: "Erstelle die CLAUDE.md mit Mission und MCP Servern: GitHub, Filesystem, PostgreSQL"',
          points: 15,
        },
        {
          id: 'step-workflows',
          prompt: 'Lass Claude automatisierte Workflows definieren (Auto-Review, Status-Report, Docs-Updates).',
          expectedCommands: [],
          acceptPattern: /workflow|auto|automatisier|review|report|docs|status/i,
          response:
            '🤖 Claude fügt Workflows hinzu...\n\n   ## Automatisierte Workflows\n   + 1. Auto-Review bei jedem PR — Code-Qualität sicherstellen\n   + 2. Täglicher Status-Report — Fortschritt per Slack\n   + 3. Automatische Docs-Updates — README bei API-Änderungen\n   + 4. Dependency-Check — Wöchentliche Security-Audits\n\n✅ 4 Workflows definiert!',
          errorResponse: '❌ Sage Claude er soll automatisierte Workflows definieren.',
          hint: 'Sage: "Definiere Workflows: Auto-Review, Status-Report, Docs-Updates"',
          points: 15,
        },
        {
          id: 'step-escalation',
          prompt: 'Lass Claude Eskalationsregeln hinzufügen (wann soll JARVIS nachfragen statt autonom handeln?).',
          expectedCommands: [],
          acceptPattern: /eskalation|escalat|nachfrag|bestätig|sicher|autonom|grenze|limit/i,
          response:
            '🤖 Claude definiert Eskalationsregeln...\n\n   ## Eskalationsregeln\n   + ⚠️ Bei Löschung von >5 Dateien: Immer bestätigen lassen\n   + ⚠️ Bei Push auf main/master: Niemals automatisch\n   + ⚠️ Bei DB-Schema-Änderungen: Review erforderlich\n   + ⚠️ Bei neuen Dependencies: Security-Check zuerst\n\n✅ Eskalationsregeln definiert!\n\n🎉 JARVIS-Lite CLAUDE.md ist vollständig!',
          errorResponse: '❌ Sage Claude er soll Eskalationsregeln definieren.',
          hint: 'Sage: "Definiere Eskalationsregeln: Wann soll JARVIS nachfragen?"',
          points: 15,
        },
      ],
    },
  },
];

// Helper: Tasks nach Projekt-ID gruppieren
export function getTasksForProject(projectId: string): PlaygroundTask[] {
  return playgroundTasks.filter((t) => t.projectId === projectId);
}

// Helper: Alle Projekte die Tasks haben
export function getProjectsWithTasks(): string[] {
  return [...new Set(playgroundTasks.map((t) => t.projectId))];
}
