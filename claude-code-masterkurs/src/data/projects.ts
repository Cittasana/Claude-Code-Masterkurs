import type { Project } from '../types';

export const projects: Project[] = [
  // ========================================
  // LEVEL 1: GRUNDLAGEN (Projekte 1.1 - 1.3)
  // ========================================
  {
    id: 'proj-1-1',
    level: 1,
    title: 'File Manager CLI Tool',
    description:
      'Erstelle ein CLI-Tool mit Claude Code, das Dateien organisieren, umbenennen und kategorisieren kann. Lerne dabei die grundlegenden Befehle und Workflows.',
    difficulty: 'Anfänger',
    duration: '2-3 Stunden',
    requirements: [
      'Claude Code installiert und konfiguriert',
      'Grundlegendes Terminal-Wissen',
      'Lektion 0-3 abgeschlossen',
    ],
    starterCode: `# File Manager CLI Tool
# Erstelle dieses Projekt mit Claude Code

# Schritt 1: Projekt initialisieren
mkdir file-manager-cli && cd file-manager-cli

# Schritt 2: Claude Code starten
claude

# Schritt 3: Prompte Claude Code
# "Erstelle ein Node.js CLI Tool das Dateien in einem
#  Verzeichnis nach Typ sortiert (Bilder, Dokumente, Code, etc.)"`,
    hints: [
      'Nutze den /init Befehl um das Projekt zu starten',
      'Verwende fs und path Module für Dateioperationen',
      'Lass Claude Code die Ordnerstruktur automatisch erstellen',
      'Teste mit verschiedenen Dateitypen in einem Test-Ordner',
    ],
    solution: `// Die Lösung variiert je nach Implementierung.
// Kernpunkte:
// 1. CLI mit commander.js oder yargs
// 2. Datei-Kategorisierung nach Extension
// 3. Batch-Rename Funktionalität
// 4. Dry-Run Modus für Vorschau`,
    validation: {
      tests: [
        {
          name: 'Projekt erstellt',
          description: 'Das Projekt wurde mit Claude Code initialisiert',
          check: () => true,
          points: 10,
        },
        {
          name: 'CLI Funktionalität',
          description: 'Das Tool kann über die Kommandozeile gestartet werden',
          check: () => true,
          points: 15,
        },
        {
          name: 'Datei-Sortierung',
          description: 'Dateien werden korrekt nach Typ kategorisiert',
          check: () => true,
          points: 20,
        },
        {
          name: 'Fehlerbehandlung',
          description: 'Ungültige Pfade und Berechtigungen werden behandelt',
          check: () => true,
          points: 15,
        },
        {
          name: 'README vorhanden',
          description: 'Dokumentation mit Nutzungsanleitung erstellt',
          check: () => true,
          points: 10,
        },
      ],
      minScore: 50,
    },
    resources: [
      'Lektion 0: Was ist Claude Code?',
      'Lektion 1: Installation & Setup',
      'Lektion 3: Erste Schritte & Befehle',
    ],
  },
  {
    id: 'proj-1-2',
    level: 1,
    title: 'CLAUDE.md Generator',
    description:
      'Baue ein Tool das automatisch CLAUDE.md Dateien für bestehende Projekte generiert. Analysiere Codebasen und erstelle optimalen Context.',
    difficulty: 'Anfänger',
    duration: '2-4 Stunden',
    requirements: [
      'Claude Code installiert und konfiguriert',
      'Lektion 4 (CLAUDE.md Mastery) abgeschlossen',
      'Ein bestehendes Projekt zum Testen',
    ],
    starterCode: `# CLAUDE.md Generator
# Ziel: Automatische Generierung von CLAUDE.md Dateien

# Schritt 1: Projekt starten
claude

# Schritt 2: Prompt
# "Erstelle ein Tool das eine Codebasis analysiert und
#  automatisch eine optimale CLAUDE.md generiert.
#  Es soll package.json, Ordnerstruktur, und
#  Code-Patterns erkennen."`,
    hints: [
      'Nutze CLAUDE.md Best Practices aus Lektion 4',
      'Analysiere package.json für Dependencies',
      'Erkenne Projekt-Typ (React, Node, Python, etc.)',
      'Generiere Abschnitte: Kontext, Regeln, Patterns',
    ],
    validation: {
      tests: [
        {
          name: 'Projekt-Erkennung',
          description: 'Erkennt den Projekt-Typ korrekt',
          check: () => true,
          points: 15,
        },
        {
          name: 'CLAUDE.md Generierung',
          description: 'Generiert eine valide CLAUDE.md Datei',
          check: () => true,
          points: 20,
        },
        {
          name: 'Context-Qualität',
          description: 'Die generierte CLAUDE.md enthält relevanten Context',
          check: () => true,
          points: 20,
        },
        {
          name: 'Template-System',
          description: 'Verschiedene Templates für verschiedene Projekttypen',
          check: () => true,
          points: 15,
        },
      ],
      minScore: 50,
    },
    resources: [
      'Lektion 4: CLAUDE.md Mastery',
      'Lektion 5: Context Management',
    ],
  },
  {
    id: 'proj-1-3',
    level: 1,
    title: 'Context Analyzer',
    description:
      'Entwickle ein Analyse-Tool das Claude Code Context-Verbrauch visualisiert und Optimierungsvorschläge gibt.',
    difficulty: 'Anfänger',
    duration: '3-4 Stunden',
    requirements: [
      'Claude Code installiert und konfiguriert',
      'Lektion 5 (Context Management) abgeschlossen',
      'Grundkenntnisse in HTML/CSS für Visualisierung',
    ],
    starterCode: `# Context Analyzer
# Visualisiere und optimiere den Context-Verbrauch

claude

# Prompt:
# "Erstelle ein Tool das analysiert wie viel Context
#  verschiedene Dateien und Ordner in einem Projekt
#  verbrauchen. Zeige Ergebnisse als HTML-Report."`,
    hints: [
      'Zähle Tokens pro Datei (ca. 4 Zeichen = 1 Token)',
      'Erstelle ein .claudeignore wenn keines existiert',
      'Visualisiere mit Chart.js oder einfachem HTML',
      'Gib Optimierungsvorschläge basierend auf Dateigröße',
    ],
    validation: {
      tests: [
        {
          name: 'Datei-Analyse',
          description: 'Alle Dateien im Projekt werden analysiert',
          check: () => true,
          points: 15,
        },
        {
          name: 'Token-Zählung',
          description: 'Korrekte Berechnung des Token-Verbrauchs',
          check: () => true,
          points: 20,
        },
        {
          name: 'Visualisierung',
          description: 'Ergebnisse werden visuell dargestellt',
          check: () => true,
          points: 20,
        },
        {
          name: 'Optimierungsvorschläge',
          description: 'Tool gibt konkrete Verbesserungsvorschläge',
          check: () => true,
          points: 15,
        },
      ],
      minScore: 50,
    },
    resources: [
      'Lektion 5: Context Management',
      'Lektion 3: Erste Schritte & Befehle',
    ],
  },

  // ========================================
  // LEVEL 2: FORTGESCHRITTEN (Projekte 2.1 - 2.3)
  // ========================================
  {
    id: 'proj-2-1',
    level: 2,
    title: 'Custom MCP Server erstellen',
    description:
      'Erstelle einen eigenen MCP Server der Claude Code mit externen APIs oder Datenbanken verbindet. Lerne das MCP-Protokoll von Grund auf.',
    difficulty: 'Fortgeschritten',
    duration: '4-6 Stunden',
    requirements: [
      'Lektion 6 (MCP Server Integration) abgeschlossen',
      'Node.js Kenntnisse',
      'Grundverständnis von APIs und JSON-RPC',
    ],
    starterCode: `# Custom MCP Server
# Erstelle einen eigenen MCP Server

# Schritt 1: MCP Server Projekt
mkdir my-mcp-server && cd my-mcp-server
npm init -y

# Schritt 2: MCP SDK installieren
npm install @modelcontextprotocol/sdk

# Schritt 3: Mit Claude Code den Server bauen
claude
# "Erstelle einen MCP Server der eine REST API anbindet
#  und Tools für CRUD-Operationen bereitstellt"`,
    hints: [
      'Starte mit dem offiziellen MCP SDK Template',
      'Implementiere zuerst ein einfaches Tool (z.B. Wetter-API)',
      'Teste den Server mit dem MCP Inspector',
      'Füge Fehlerbehandlung und Logging hinzu',
    ],
    validation: {
      tests: [
        {
          name: 'MCP Server läuft',
          description: 'Server startet und akzeptiert Verbindungen',
          check: () => true,
          points: 15,
        },
        {
          name: 'Tool Registration',
          description: 'Mindestens 3 Tools sind registriert',
          check: () => true,
          points: 20,
        },
        {
          name: 'API Integration',
          description: 'Externe API wird korrekt angebunden',
          check: () => true,
          points: 20,
        },
        {
          name: 'Error Handling',
          description: 'Fehler werden sauber behandelt und geloggt',
          check: () => true,
          points: 15,
        },
        {
          name: 'Claude Code Integration',
          description: 'Server funktioniert als MCP in Claude Code',
          check: () => true,
          points: 20,
        },
      ],
      minScore: 60,
    },
    resources: [
      'Lektion 6: MCP Server Integration',
      'Lektion 7: Skills & Workflows',
    ],
  },
  {
    id: 'proj-2-2',
    level: 2,
    title: 'Multi-Agent Data Pipeline',
    description:
      'Baue eine Daten-Pipeline mit mehreren Claude Code Subagents die parallel Daten sammeln, verarbeiten und zusammenführen.',
    difficulty: 'Fortgeschritten',
    duration: '5-7 Stunden',
    requirements: [
      'Lektion 8 (Subagents Deep Dive) abgeschlossen',
      'Lektion 16 (Agent Orchestration) abgeschlossen',
      'Verständnis von async/await und Promises',
    ],
    starterCode: `# Multi-Agent Data Pipeline
# Mehrere Agents arbeiten parallel

claude

# "Erstelle eine Data Pipeline mit 3 Subagents:
#  1. Data Collector - sammelt Daten aus APIs
#  2. Data Processor - bereinigt und transformiert
#  3. Data Aggregator - führt Ergebnisse zusammen
#  Nutze Claude Code Subagents für Parallelisierung"`,
    hints: [
      'Definiere klare Schnittstellen zwischen Agents',
      'Nutze Claude Code Subagent-Spawning',
      'Implementiere Retry-Logic für Fehlertoleranz',
      'Logge den Fortschritt jedes Agents separat',
    ],
    validation: {
      tests: [
        {
          name: 'Pipeline-Architektur',
          description: 'Klar definierte Pipeline-Stufen',
          check: () => true,
          points: 15,
        },
        {
          name: 'Subagent Orchestration',
          description: 'Mindestens 3 Subagents arbeiten koordiniert',
          check: () => true,
          points: 25,
        },
        {
          name: 'Parallele Verarbeitung',
          description: 'Agents laufen parallel wo möglich',
          check: () => true,
          points: 20,
        },
        {
          name: 'Fehlertoleranz',
          description: 'Pipeline handelt Fehler einzelner Agents',
          check: () => true,
          points: 15,
        },
        {
          name: 'Ergebnis-Aggregation',
          description: 'Daten werden korrekt zusammengeführt',
          check: () => true,
          points: 15,
        },
      ],
      minScore: 60,
    },
    resources: [
      'Lektion 8: Subagents Deep Dive',
      'Lektion 16: Agent Orchestration',
    ],
  },
  {
    id: 'proj-2-3',
    level: 2,
    title: 'Custom Agent mit Personality',
    description:
      'Erstelle einen Claude Code Agent mit eigener Persönlichkeit, Spezialisierung und benutzerdefinierten Verhaltensregeln.',
    difficulty: 'Fortgeschritten',
    duration: '4-5 Stunden',
    requirements: [
      'Lektion 9 (Custom Agents erstellen) abgeschlossen',
      'Lektion 10 (Agent Personality & Configuration) abgeschlossen',
      'Kreativität und Experimentierfreude',
    ],
    starterCode: `# Custom Agent mit Personality
# Erstelle deinen eigenen spezialisierten Agent

claude

# "Erstelle einen Custom Agent namens 'CodeReviewer'
#  der folgende Personality hat:
#  - Streng aber fair bei Code Reviews
#  - Fokussiert auf Clean Code und Best Practices
#  - Gibt konstruktives Feedback mit Beispielen
#  Erstelle CLAUDE.md und alle nötigen Configs"`,
    hints: [
      'Definiere die Personality in CLAUDE.md',
      'Erstelle Custom Commands für häufige Tasks',
      'Nutze System Prompts für konsistentes Verhalten',
      'Teste mit verschiedenen Code-Beispielen',
    ],
    validation: {
      tests: [
        {
          name: 'Agent-Definition',
          description: 'CLAUDE.md mit klarer Personality definiert',
          check: () => true,
          points: 20,
        },
        {
          name: 'Custom Commands',
          description: 'Mindestens 3 Custom Commands erstellt',
          check: () => true,
          points: 20,
        },
        {
          name: 'Konsistentes Verhalten',
          description: 'Agent verhält sich konsistent über Sessions',
          check: () => true,
          points: 20,
        },
        {
          name: 'Spezialisierung',
          description: 'Agent hat klare Expertise in seinem Bereich',
          check: () => true,
          points: 15,
        },
        {
          name: 'Dokumentation',
          description: 'README mit Nutzungsanleitung',
          check: () => true,
          points: 10,
        },
      ],
      minScore: 60,
    },
    resources: [
      'Lektion 9: Custom Agents erstellen',
      'Lektion 10: Agent Personality & Configuration',
    ],
  },

  // ========================================
  // LEVEL 3: EXPERT (Projekte 3.1 - 3.3)
  // ========================================
  {
    id: 'proj-3-1',
    level: 3,
    title: 'Fully Automated Deployment Pipeline',
    description:
      'Erstelle eine vollautomatische CI/CD Pipeline die mit Claude Code Hooks und Git-Integration Code testet, reviewed und deployed.',
    difficulty: 'Expert',
    duration: '6-8 Stunden',
    requirements: [
      'Lektion 11 (Git-Integration Profi) abgeschlossen',
      'Lektion 12 (Hooks & Automation) abgeschlossen',
      'Lektion 17 (Production Best Practices) abgeschlossen',
      'Git & CI/CD Grundkenntnisse',
    ],
    starterCode: `# Automated Deployment Pipeline
# Vollautomatische CI/CD mit Claude Code

claude

# "Erstelle eine Deployment Pipeline die:
#  1. Pre-commit: Code Qualität prüft (Hooks)
#  2. Pre-push: Tests automatisch ausführt
#  3. On merge: Automatisches Deployment triggert
#  4. Post-deploy: Health-Checks ausführt
#  Nutze Claude Code Hooks für jeden Schritt"`,
    hints: [
      'Definiere Hooks in .claude/hooks/',
      'Nutze GitHub Actions oder GitLab CI',
      'Implementiere Rollback-Strategie',
      'Füge Slack/Discord Notifications hinzu',
    ],
    validation: {
      tests: [
        {
          name: 'Hook-System',
          description: 'Pre-commit und Pre-push Hooks konfiguriert',
          check: () => true,
          points: 20,
        },
        {
          name: 'Automatische Tests',
          description: 'Tests laufen automatisch bei jedem Push',
          check: () => true,
          points: 20,
        },
        {
          name: 'Deployment Automation',
          description: 'Code wird automatisch deployed',
          check: () => true,
          points: 25,
        },
        {
          name: 'Rollback',
          description: 'Automatischer Rollback bei Fehlern',
          check: () => true,
          points: 15,
        },
        {
          name: 'Monitoring',
          description: 'Health-Checks und Notifications eingerichtet',
          check: () => true,
          points: 15,
        },
      ],
      minScore: 70,
    },
    resources: [
      'Lektion 11: Git-Integration Profi',
      'Lektion 12: Hooks & Automation',
      'Lektion 17: Production Best Practices',
    ],
  },
  {
    id: 'proj-3-2',
    level: 3,
    title: 'Autonomous Code Review Agent',
    description:
      'Baue einen autonomen Agent der Pull Requests automatisch reviewed, Verbesserungen vorschlägt und sogar automatisch Fixes erstellt.',
    difficulty: 'Expert',
    duration: '7-10 Stunden',
    requirements: [
      'Lektion 14 (Advanced Prompting) abgeschlossen',
      'Lektion 16 (Agent Orchestration) abgeschlossen',
      'Lektion 17 (Production Best Practices) abgeschlossen',
      'GitHub API Kenntnisse hilfreich',
    ],
    starterCode: `# Autonomous Code Review Agent
# Ein Agent der PRs automatisch reviewed

claude

# "Erstelle einen Code Review Agent der:
#  1. Neue PRs auf GitHub erkennt
#  2. Code-Qualität analysiert (Patterns, Bugs, Style)
#  3. Inline-Kommentare mit Verbesserungen schreibt
#  4. Auto-Fix PRs für einfache Probleme erstellt
#  Nutze Claude Code mit GitHub MCP Server"`,
    hints: [
      'Nutze den GitHub MCP Server für API-Zugriff',
      'Implementiere verschiedene Review-Kategorien',
      'Verwende Scoring für Review-Schweregrad',
      'Erstelle Auto-Fix nur für sichere Änderungen',
    ],
    validation: {
      tests: [
        {
          name: 'PR Detection',
          description: 'Neue PRs werden automatisch erkannt',
          check: () => true,
          points: 15,
        },
        {
          name: 'Code Analyse',
          description: 'Mehrdimensionale Code-Analyse (Bugs, Style, Performance)',
          check: () => true,
          points: 25,
        },
        {
          name: 'Review Comments',
          description: 'Inline-Kommentare werden erstellt',
          check: () => true,
          points: 20,
        },
        {
          name: 'Auto-Fix',
          description: 'Automatische Fix-PRs für einfache Probleme',
          check: () => true,
          points: 25,
        },
        {
          name: 'Konfigurierbar',
          description: 'Review-Regeln sind konfigurierbar',
          check: () => true,
          points: 10,
        },
      ],
      minScore: 70,
    },
    resources: [
      'Lektion 14: Advanced Prompting Techniques',
      'Lektion 16: Agent Orchestration',
      'Lektion 17: Production Best Practices',
    ],
  },
  {
    id: 'proj-3-3',
    level: 3,
    title: 'JARVIS-Lite',
    description:
      'Erstelle deinen persönlichen AI-Entwicklungsassistenten der mehrere MCP Server orchestriert, proaktiv Vorschläge macht und aus deinem Coding-Stil lernt.',
    difficulty: 'Expert',
    duration: '10-15 Stunden',
    requirements: [
      'Alle vorherigen Lektionen abgeschlossen',
      'Erfahrung mit MCP Servern',
      'Verständnis von Agent Orchestration',
      'Fortgeschrittene TypeScript/Node.js Kenntnisse',
    ],
    starterCode: `# JARVIS-Lite
# Dein persönlicher AI-Entwicklungsassistent

claude

# "Erstelle JARVIS-Lite, einen persönlichen
#  Entwicklungsassistenten der:
#  1. Mehrere MCP Server orchestriert (GitHub, DB, APIs)
#  2. Proaktiv Code-Verbesserungen vorschlägt
#  3. Aus meinem Coding-Stil lernt (via CLAUDE.md)
#  4. Automatisch Dokumentation aktualisiert
#  5. Sprint-Planning und Task-Management unterstützt
#  Das ist das Meisterprojekt - nimm dir Zeit!"`,
    hints: [
      'Starte mit einem Core-Agent und erweitere schrittweise',
      'Nutze CLAUDE.md für Personality und Stil-Preferences',
      'Implementiere ein Plugin-System für MCP Server',
      'Erstelle ein Dashboard für Agent-Aktivitäten',
    ],
    validation: {
      tests: [
        {
          name: 'Multi-MCP Orchestration',
          description: 'Mindestens 3 MCP Server werden koordiniert',
          check: () => true,
          points: 25,
        },
        {
          name: 'Proaktive Vorschläge',
          description: 'Agent macht eigenständig Verbesserungsvorschläge',
          check: () => true,
          points: 20,
        },
        {
          name: 'Stil-Adaption',
          description: 'Agent lernt und adaptiert Coding-Stil',
          check: () => true,
          points: 20,
        },
        {
          name: 'Automatisierung',
          description: 'Mindestens 5 automatisierte Workflows',
          check: () => true,
          points: 20,
        },
        {
          name: 'Dokumentation & Dashboard',
          description: 'Vollständige Docs und Aktivitäts-Dashboard',
          check: () => true,
          points: 15,
        },
      ],
      minScore: 70,
    },
    resources: [
      'Alle Lektionen (0-18)',
      'MCP SDK Dokumentation',
      'Claude Code Documentation',
    ],
  },
];
