import type { Quiz } from '../types';

export const quizzes: Quiz[] = [
  // ========================================
  // LEKTION 0 QUIZ
  // ========================================
  {
    id: 'l0-quiz-1',
    lessonId: 0,
    title: 'Claude Code Grundlagen',
    type: 'multiple-choice',
    points: 5,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        id: 'l0-q1',
        text: 'Welches ist KEINE Kernfunktionalität von Claude Code?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'CLAUDE.md Kontextmanagement',
            value: 'claudemd',
          },
          {
            id: 'b',
            label: 'MCP Server Integration',
            value: 'mcp',
          },
          {
            id: 'c',
            label: 'Graphische UI für Code-Editing',
            value: 'gui',
            isCorrect: true,
          },
          {
            id: 'd',
            label: 'Agentic Workflows',
            value: 'workflows',
          },
        ],
        correctAnswer: 'c',
        explanation:
          'Claude Code ist ein CLI-Tool ohne graphische UI. Es arbeitet vollständig im Terminal und fokussiert sich auf Automatisierung durch Befehle und AI-Agents.',
        hints: [
          'Denke an die Haupt-Interface von Claude Code',
          'CLI steht für Command Line Interface',
          'Claude Code läuft im Terminal',
        ],
      },
      {
        id: 'l0-q2',
        text: 'Was unterscheidet Claude Code von GitHub Copilot?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Code-Completion Features',
            value: 'completion',
          },
          {
            id: 'b',
            label: 'Gesamtes Projekt-Verständnis und autonome Task-Ausführung',
            value: 'project',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Integration in VS Code',
            value: 'vscode',
          },
          {
            id: 'd',
            label: 'Preis',
            value: 'price',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Claude Code versteht dein gesamtes Projekt und kann komplette Tasks autonom ausführen, während Copilot hauptsächlich Code-Completion anbietet.',
        hints: [
          'Überlege was "agentic" bedeutet',
          'Schaue auf die Vergleichstabelle in der Lektion',
        ],
      },
      {
        id: 'l0-q3',
        text: 'Wie viele Dateien kann Claude Code gleichzeitig im Context halten?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: '10-20 Dateien',
            value: '10',
          },
          {
            id: 'b',
            label: '50-100 Dateien',
            value: '50',
          },
          {
            id: 'c',
            label: '200+ Dateien',
            value: '200',
            isCorrect: true,
          },
          {
            id: 'd',
            label: 'Nur 5 Dateien',
            value: '5',
          },
        ],
        correctAnswer: 'c',
        explanation:
          'Claude Code kann 200+ Dateien gleichzeitig verstehen dank des großen Context Windows von Claude.',
        hints: ['Denke an die "Statistiken & Fakten" Sektion'],
      },
      {
        id: 'l0-q4',
        text: 'Was ist ein typischer Use Case für Claude Code?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Bildbearbeitung',
            value: 'images',
          },
          {
            id: 'b',
            label: 'Feature Development mit automatischen Tests',
            value: 'features',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Video Editing',
            value: 'video',
          },
          {
            id: 'd',
            label: '3D Modeling',
            value: '3d',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Claude Code ist spezialisiert auf Software-Entwicklung, inklusive Feature Development, Testing, Refactoring und Deployment.',
        hints: [
          'Claude Code ist ein Entwicklungs-Tool',
          'Schaue dir die Use Cases in der Lektion an',
        ],
      },
      {
        id: 'l0-q5',
        text: 'Welche durchschnittliche Geschwindigkeitssteigerung bietet Claude Code?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: '2x schneller',
            value: '2x',
          },
          {
            id: 'b',
            label: '5-10x schneller',
            value: '5-10x',
            isCorrect: true,
          },
          {
            id: 'c',
            label: '20x schneller',
            value: '20x',
          },
          {
            id: 'd',
            label: 'Keine messbare Steigerung',
            value: 'none',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Laut Statistiken bietet Claude Code eine durchschnittliche 5-10x Geschwindigkeitssteigerung bei strukturierten Development-Tasks.',
        hints: ['Finde die Antwort in der "Statistiken & Fakten" Sektion'],
      },
    ],
  },

  // ========================================
  // LEKTION 1 QUIZ
  // ========================================
  {
    id: 'l1-quiz-1',
    lessonId: 1,
    title: 'Installation Verification',
    type: 'checklist',
    points: 8,
    passingScore: 75,
    maxAttempts: 3,
    questions: [
      {
        id: 'l1-q1',
        text: 'Hast du Node.js Version 16 oder höher installiert?',
        type: 'checkbox',
        explanation: 'Node.js v16+ ist erforderlich für Claude Code. Prüfe mit: node --version',
        hints: ['Führe "node --version" im Terminal aus', 'Die Version muss >= 16 sein'],
      },
      {
        id: 'l1-q2',
        text: 'Ist npm verfügbar in deinem Terminal?',
        type: 'checkbox',
        explanation: 'npm wird für die Installation von Claude Code benötigt. Prüfe mit: npm --version',
        hints: ['Führe "npm --version" aus', 'npm wird mit Node.js mitinstalliert'],
      },
      {
        id: 'l1-q3',
        text: 'Hast du einen Anthropic API Token?',
        type: 'checkbox',
        explanation:
          'Du benötigst einen API Key von console.anthropic.com um Claude Code zu nutzen.',
        hints: [
          'Besuche https://console.anthropic.com',
          'Erstelle einen Account falls nötig',
          'Navigiere zu "API Keys"',
        ],
      },
      {
        id: 'l1-q4',
        text: 'Ist Claude Code via npm installiert?',
        type: 'checkbox',
        explanation: 'Installiere mit: npm install -g @anthropic-ai/claude-code',
        hints: [
          'Nutze npm install mit -g Flag für globale Installation',
          'Prüfe mit "claude --version"',
        ],
      },
      {
        id: 'l1-q5',
        text: 'Zeigt "claude --version" eine gültige Version an?',
        type: 'checkbox',
        explanation: 'Dies verifiziert, dass Claude Code korrekt installiert und im PATH verfügbar ist.',
        hints: ['Führe "claude --version" aus', 'Du solltest etwas wie "claude-code v1.2.3" sehen'],
      },
      {
        id: 'l1-q6',
        text: 'Ist dein API Key konfiguriert (ANTHROPIC_API_KEY environment variable oder claude config)?',
        type: 'checkbox',
        explanation:
          'Der API Key muss entweder als Environment Variable gesetzt sein oder via "claude config set api-key" konfiguriert werden.',
        hints: [
          'Setze mit: export ANTHROPIC_API_KEY="sk-ant-..."',
          'Oder nutze: claude config set api-key sk-ant-...',
          'Prüfe mit: claude status',
        ],
      },
    ],
  },

  // ========================================
  // LEKTION 2 QUIZ
  // ========================================
  {
    id: 'l2-quiz-1',
    lessonId: 2,
    title: 'API Keys & Model Selection',
    type: 'code-selection',
    points: 5,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'l2-q1',
        text: 'Welcher Befehl setzt den API Key korrekt?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'claude set-key sk-ant-...',
            value: 'wrong1',
          },
          {
            id: 'b',
            label: 'claude config set api-key sk-ant-...',
            value: 'correct',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'claude api sk-ant-...',
            value: 'wrong2',
          },
          {
            id: 'd',
            label: 'claude auth sk-ant-...',
            value: 'wrong3',
          },
        ],
        correctAnswer: 'b',
        explanation: 'Der korrekte Befehl ist: claude config set api-key YOUR_KEY',
        hints: ['Schau dir die API-Key Setup Sektion an', 'Es ist ein "config" Befehl'],
      },
      {
        id: 'l2-q2',
        text: 'Welches Modell ist am günstigsten?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Opus 4.5',
            value: 'opus',
          },
          {
            id: 'b',
            label: 'Sonnet 4.5',
            value: 'sonnet',
          },
          {
            id: 'c',
            label: 'Haiku 4.5',
            value: 'haiku',
            isCorrect: true,
          },
        ],
        correctAnswer: 'c',
        explanation:
          'Haiku 4.5 ist das günstigste Modell mit $0.25 / 1M input tokens und $1.25 / 1M output tokens.',
        hints: ['Schaue dir die Modell-Vergleichstabelle an', 'Es ist das schnellste Modell'],
      },
      {
        id: 'l2-q3',
        text: 'Wann solltest du Opus 4.5 verwenden?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Für alle Tasks',
            value: 'all',
          },
          {
            id: 'b',
            label: 'Nur für komplexe Architecture & Design Tasks',
            value: 'complex',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Für Quick Fixes',
            value: 'fixes',
          },
          {
            id: 'd',
            label: 'Nie',
            value: 'never',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Opus 4.5 sollte nur für komplexe Tasks genutzt werden, da es am teuersten ist. Für die meisten Tasks reicht Sonnet.',
        hints: ['Opus ist das intelligenteste aber auch teuerste Modell', 'Schaue dir die Use Cases an'],
      },
      {
        id: 'l2-q4',
        text: 'Wie nutzt du Haiku explizit für einen Command?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'claude --fast "task"',
            value: 'wrong1',
          },
          {
            id: 'b',
            label: 'claude --model haiku "task"',
            value: 'correct',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'claude -h "task"',
            value: 'wrong2',
          },
          {
            id: 'd',
            label: 'claude haiku "task"',
            value: 'wrong3',
          },
        ],
        correctAnswer: 'b',
        explanation: 'Nutze: claude --model haiku "deine aufgabe"',
        hints: ['Es ist ein --model Flag', 'Der Modellname ist "haiku"'],
      },
      {
        id: 'l2-q5',
        text: 'Welches ist das Standard-Modell wenn kein --model Flag gesetzt ist?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Haiku',
            value: 'haiku',
          },
          {
            id: 'b',
            label: 'Sonnet',
            value: 'sonnet',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Opus',
            value: 'opus',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Sonnet 4.5 ist das Standard-Modell, da es die beste Balance zwischen Intelligenz, Geschwindigkeit und Kosten bietet.',
        hints: ['Es ist das "Best Balance" Modell', 'Schaue dir die Model Selection Guide an'],
      },
    ],
  },

  // ========================================
  // LEKTION 3 QUIZ
  // ========================================
  {
    id: 'l3-quiz-1',
    lessonId: 3,
    title: 'Erste Schritte & Befehle',
    type: 'multiple-choice',
    points: 6,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l3-q1',
        text: 'Welcher Befehl beendet Claude Code NICHT?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: '/exit',
            value: 'exit',
          },
          {
            id: 'b',
            label: '/quit',
            value: 'quit',
          },
          {
            id: 'c',
            label: '/stop',
            value: 'stop',
            isCorrect: true,
          },
          {
            id: 'd',
            label: 'Ctrl+D',
            value: 'ctrld',
          },
        ],
        correctAnswer: 'c',
        explanation:
          '/stop ist kein gültiger Claude Code Befehl. Zum Beenden nutzt du /exit, /quit oder Ctrl+D.',
        hints: ['Schaue dir die Slash-Commands Sektion an', 'Es gibt drei gültige Wege Claude zu beenden'],
      },
      {
        id: 'l3-q2',
        text: 'Was macht der /compact Befehl?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Löscht alle Dateien im Projekt',
            value: 'delete',
          },
          {
            id: 'b',
            label: 'Komprimiert den Kontext um Tokens zu sparen',
            value: 'compress',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Minimiert das Terminal-Fenster',
            value: 'minimize',
          },
          {
            id: 'd',
            label: 'Formatiert den Code kompakter',
            value: 'format',
          },
        ],
        correctAnswer: 'b',
        explanation:
          '/compact komprimiert den bisherigen Konversationsverlauf, um Token-Limits einzuhalten und Kosten zu sparen.',
        hints: ['Es geht um Token-Management', 'Der Name deutet auf Platzsparung hin'],
      },
      {
        id: 'l3-q3',
        text: 'Welches ist eine gute Prompt-Praxis?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: '"Mach den Code besser"',
            value: 'vague',
          },
          {
            id: 'b',
            label: '"Fix die Bugs"',
            value: 'generic',
          },
          {
            id: 'c',
            label: '"Refaktoriere getUserById in src/services/user.ts zu async/await"',
            value: 'specific',
            isCorrect: true,
          },
          {
            id: 'd',
            label: '"Ändere alles"',
            value: 'everything',
          },
        ],
        correctAnswer: 'c',
        explanation:
          'Gute Prompts sind spezifisch: Sie nennen die genaue Datei, Funktion und gewünschte Änderung.',
        hints: ['Spezifität ist der Schlüssel', 'Welche Option nennt Datei und Funktion?'],
      },
      {
        id: 'l3-q4',
        text: 'Welche Taste unterbricht Claude während einer Antwort?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Enter',
            value: 'enter',
          },
          {
            id: 'b',
            label: 'Tab',
            value: 'tab',
          },
          {
            id: 'c',
            label: 'Escape',
            value: 'escape',
            isCorrect: true,
          },
          {
            id: 'd',
            label: 'Space',
            value: 'space',
          },
        ],
        correctAnswer: 'c',
        explanation:
          'Die Escape-Taste unterbricht Claude während einer laufenden Antwort oder bricht die aktuelle Eingabe ab.',
        hints: ['Diese Taste wird oft zum Abbrechen verwendet', 'Schaue in die Keyboard Shortcuts Sektion'],
      },
      {
        id: 'l3-q5',
        text: 'Wie startest du Claude mit einem bestimmten Modell?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'claude opus "task"',
            value: 'wrong1',
          },
          {
            id: 'b',
            label: 'claude --model opus "task"',
            value: 'correct',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'claude -o "task"',
            value: 'wrong2',
          },
          {
            id: 'd',
            label: 'claude set-model opus "task"',
            value: 'wrong3',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Das --model Flag erlaubt die Auswahl eines spezifischen Modells: claude --model opus/sonnet/haiku',
        hints: ['Es ist ein Flag mit doppeltem Bindestrich', 'Schaue in die CLI-Flags Sektion'],
      },
      {
        id: 'l3-q6',
        text: 'Was ist ein häufiger Anfänger-Fehler beim Start von Claude?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Claude im Projekt-Root starten',
            value: 'root',
          },
          {
            id: 'b',
            label: 'Spezifische Dateien referenzieren',
            value: 'specific',
          },
          {
            id: 'c',
            label: 'In einem Unterordner statt im Projekt-Root starten',
            value: 'subfolder',
            isCorrect: true,
          },
          {
            id: 'd',
            label: '/help zum Nachschlagen nutzen',
            value: 'help',
          },
        ],
        correctAnswer: 'c',
        explanation:
          'Wenn du Claude in einem Unterordner startest (z.B. cd src && claude), wird CLAUDE.md nicht automatisch geladen.',
        hints: ['Es geht um den Startort', 'Wo sollte sich CLAUDE.md befinden?'],
      },
    ],
  },

  // ========================================
  // LEKTION 4 QUIZ
  // ========================================
  {
    id: 'l4-quiz-1',
    lessonId: 4,
    title: 'CLAUDE.md Mastery',
    type: 'multiple-choice',
    points: 6,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l4-q1',
        text: 'Was ist CLAUDE.md?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Eine Dokumentation für Benutzer',
            value: 'docs',
          },
          {
            id: 'b',
            label: 'Die zentrale Projekt-Konfigurationsdatei für Claude Code',
            value: 'config',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Ein Build-Script',
            value: 'build',
          },
          {
            id: 'd',
            label: 'Eine Test-Datei',
            value: 'test',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'CLAUDE.md gibt Claude wichtigen Kontext über dein Projekt: Tech Stack, Coding-Standards und spezifische Anforderungen.',
        hints: ['Es geht um Projekt-Konfiguration', 'Diese Datei hilft Claude dein Projekt zu verstehen'],
      },
      {
        id: 'l4-q2',
        text: 'Wie erstellst du automatisch eine CLAUDE.md?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'claude create',
            value: 'create',
          },
          {
            id: 'b',
            label: 'claude init',
            value: 'init',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'claude setup',
            value: 'setup',
          },
          {
            id: 'd',
            label: 'claude new',
            value: 'new',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Der Befehl "claude init" erstellt automatisch eine CLAUDE.md im aktuellen Verzeichnis.',
        hints: ['Es ist ein Initialisierungs-Befehl', 'Ähnlich wie git init oder npm init'],
      },
      {
        id: 'l4-q3',
        text: 'Welche Context-Ebene hat die HÖCHSTE Priorität?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Global CLAUDE.md (~/.claude/CLAUDE.md)',
            value: 'global',
          },
          {
            id: 'b',
            label: 'Projekt CLAUDE.md (/projekt/CLAUDE.md)',
            value: 'project',
          },
          {
            id: 'c',
            label: 'Ordner CLAUDE.md (src/components/CLAUDE.md)',
            value: 'folder',
            isCorrect: true,
          },
        ],
        correctAnswer: 'c',
        explanation:
          'Die Ordner-spezifische CLAUDE.md hat die höchste Priorität und überschreibt Projekt- und Global-Einstellungen.',
        hints: ['Je spezifischer, desto höher die Priorität', 'Ordner > Projekt > Global'],
      },
      {
        id: 'l4-q4',
        text: 'Was sollte NICHT in CLAUDE.md stehen?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Tech Stack und verwendete Frameworks',
            value: 'tech',
          },
          {
            id: 'b',
            label: 'API-Keys und Secrets',
            value: 'secrets',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Coding Standards und Konventionen',
            value: 'standards',
          },
          {
            id: 'd',
            label: 'Projekt-Struktur',
            value: 'structure',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'API-Keys und Secrets gehören NIEMALS in CLAUDE.md (oder andere Dateien im Repository). Nutze stattdessen .env Dateien.',
        hints: ['Sicherheit ist wichtig', 'Was sollte nicht in Git committed werden?'],
      },
      {
        id: 'l4-q5',
        text: 'Was ist der Hauptvorteil einer gut gepflegten CLAUDE.md?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Claude läuft schneller',
            value: 'speed',
          },
          {
            id: 'b',
            label: 'Claude generiert konsistent besseren Code ohne ständige Korrekturen',
            value: 'quality',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Das Projekt wird automatisch dokumentiert',
            value: 'docs',
          },
          {
            id: 'd',
            label: 'Tests werden automatisch generiert',
            value: 'tests',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Mit CLAUDE.md kennt Claude sofort deine Standards und Conventions, was zu konsistent besserem Code mit weniger Korrekturen führt.',
        hints: ['Es geht um Konsistenz und Qualität', 'Claude muss weniger raten'],
      },
      {
        id: 'l4-q6',
        text: 'Welcher Befehl zeigt den geladenen CLAUDE.md Kontext?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: '/show',
            value: 'show',
          },
          {
            id: 'b',
            label: '/context',
            value: 'context',
            isCorrect: true,
          },
          {
            id: 'c',
            label: '/display',
            value: 'display',
          },
          {
            id: 'd',
            label: '/read',
            value: 'read',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Der /context Befehl zeigt den aktuell geladenen Kontext an, inklusive CLAUDE.md Inhalt.',
        hints: ['Der Name ist sehr direkt', 'Es geht um "Kontext"'],
      },
    ],
  },

  // ========================================
  // LEKTION 5 QUIZ
  // ========================================
  {
    id: 'l5-quiz-1',
    lessonId: 5,
    title: 'Context Management',
    type: 'multiple-choice',
    points: 6,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l5-q1',
        text: 'Was ist das Context Window Token-Limit bei Claude 4.5?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: '50K Tokens',
            value: '50k',
          },
          {
            id: 'b',
            label: '100K Tokens',
            value: '100k',
          },
          {
            id: 'c',
            label: '200K Tokens',
            value: '200k',
            isCorrect: true,
          },
          {
            id: 'd',
            label: '500K Tokens',
            value: '500k',
          },
        ],
        correctAnswer: 'c',
        explanation:
          'Claude 4.5 Modelle haben ein Context Window von 200K Tokens für Input.',
        hints: ['Es ist eine der größeren Zahlen', 'Steht in der Token-Limits Sektion'],
      },
      {
        id: 'l5-q2',
        text: 'Was macht die .claudeignore Datei?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Ignoriert bestimmte Claude-Befehle',
            value: 'commands',
          },
          {
            id: 'b',
            label: 'Definiert Dateien, die Claude niemals lesen soll',
            value: 'files',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Blockiert bestimmte Nutzer',
            value: 'users',
          },
          {
            id: 'd',
            label: 'Deaktiviert Claude für bestimmte Projekte',
            value: 'projects',
          },
        ],
        correctAnswer: 'b',
        explanation:
          '.claudeignore funktioniert wie .gitignore und definiert Dateien/Ordner, die Claude ignorieren soll (z.B. node_modules).',
        hints: ['Ähnlich wie .gitignore', 'Es geht um Dateien die nicht gelesen werden sollen'],
      },
      {
        id: 'l5-q3',
        text: 'Wann solltest du /compact verwenden?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Am Anfang jeder Session',
            value: 'start',
          },
          {
            id: 'b',
            label: 'Nach jeder einzelnen Nachricht',
            value: 'every',
          },
          {
            id: 'c',
            label: 'Wenn der Context sich füllt (alle 10-15 Nachrichten)',
            value: 'periodically',
            isCorrect: true,
          },
          {
            id: 'd',
            label: 'Niemals',
            value: 'never',
          },
        ],
        correctAnswer: 'c',
        explanation:
          '/compact sollte regelmäßig verwendet werden wenn sich der Context füllt, etwa alle 10-15 Nachrichten oder wenn "Context too long" Fehler erscheinen.',
        hints: ['Es geht um Balance', 'Nicht zu oft, nicht zu selten'],
      },
      {
        id: 'l5-q4',
        text: 'Wie fokussierst du Claude nur auf bestimmte Dateien?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'claude --only "src/*.ts"',
            value: 'only',
          },
          {
            id: 'b',
            label: 'claude --include "src/**/*.ts"',
            value: 'include',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'claude --files "src/*.ts"',
            value: 'files',
          },
          {
            id: 'd',
            label: 'claude --select "src/*.ts"',
            value: 'select',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Das --include Flag erlaubt das gezielte Einschließen von Dateien mit Glob-Patterns.',
        hints: ['Der Name deutet auf "einschließen" hin', 'Es ist in der Context-Steuerung Sektion'],
      },
      {
        id: 'l5-q5',
        text: 'Welcher Befehl zeigt den Token-Verbrauch der aktuellen Session?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: '/tokens',
            value: 'tokens',
          },
          {
            id: 'b',
            label: '/usage',
            value: 'usage',
          },
          {
            id: 'c',
            label: '/cost',
            value: 'cost',
            isCorrect: true,
          },
          {
            id: 'd',
            label: '/stats',
            value: 'stats',
          },
        ],
        correctAnswer: 'c',
        explanation:
          '/cost zeigt den Token-Verbrauch und die geschätzten Kosten der aktuellen Session an.',
        hints: ['Es geht um Kosten/Verbrauch', 'Steht in der Context Monitoring Sektion'],
      },
      {
        id: 'l5-q6',
        text: 'Was ist eine gute Praxis bei großen Projekten?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Das gesamte Projekt in einer Session bearbeiten',
            value: 'all',
          },
          {
            id: 'b',
            label: 'Fokussierte Sessions mit /clear zwischen verschiedenen Features',
            value: 'focused',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'node_modules immer inkludieren',
            value: 'node_modules',
          },
          {
            id: 'd',
            label: 'Nie .claudeignore verwenden',
            value: 'no_ignore',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Bei großen Projekten ist es best practice, fokussierte Sessions zu haben und /clear zwischen verschiedenen Features zu nutzen.',
        hints: ['Es geht um Fokus und Modularität', 'Eine Task pro Session'],
      },
    ],
  },

// ========================================
  // LEKTION 6 QUIZ
  // ========================================
  {
    id: 'l6-quiz-1',
    lessonId: 6,
    title: 'MCP Server Integration',
    type: 'multiple-choice',
    points: 6,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l6-q1',
        text: 'Wofür steht MCP?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Model Context Protocol',
            value: 'mcp',
            isCorrect: true,
          },
          {
            id: 'b',
            label: 'Multiple Connection Protocol',
            value: 'multi',
          },
          {
            id: 'c',
            label: 'Machine Code Protocol',
            value: 'machine',
          },
          {
            id: 'd',
            label: 'Managed Cloud Platform',
            value: 'cloud',
          },
        ],
        correctAnswer: 'a',
        explanation:
          'MCP steht für Model Context Protocol - ein offener Standard für AI-Tool-Integrationen.',
        hints: ['Es geht um Kontext für AI-Modelle', 'Es ist ein Protokoll-Standard'],
      },
      {
        id: 'l6-q2',
        text: 'Welcher Befehl fügt einen MCP Server hinzu?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'claude install mcp <name>',
            value: 'install',
          },
          {
            id: 'b',
            label: 'claude mcp add <name> <command>',
            value: 'add',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'claude server add <name>',
            value: 'server',
          },
          {
            id: 'd',
            label: 'claude connect <name>',
            value: 'connect',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Der Befehl "claude mcp add <name> <command>" fügt einen neuen MCP Server hinzu.',
        hints: ['Es ist ein MCP-spezifischer Befehl', 'add ist das Schlüsselwort'],
      },
      {
        id: 'l6-q3',
        text: 'Welcher Transport-Typ ist für Remote/Cloud-Server empfohlen?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'STDIO',
            value: 'stdio',
          },
          {
            id: 'b',
            label: 'HTTP/SSE',
            value: 'sse',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'TCP',
            value: 'tcp',
          },
          {
            id: 'd',
            label: 'UDP',
            value: 'udp',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'HTTP/SSE (Server-Sent Events) ist der empfohlene Transport für Remote/Cloud-basierte MCP Server.',
        hints: ['SSE steht für Server-Sent Events', 'Es ist ein HTTP-basierter Ansatz'],
      },
      {
        id: 'l6-q4',
        text: 'Wo werden MCP Server konfiguriert?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'CLAUDE.md',
            value: 'claudemd',
          },
          {
            id: 'b',
            label: 'package.json',
            value: 'package',
          },
          {
            id: 'c',
            label: '~/.claude/mcp_servers.json',
            value: 'mcpjson',
            isCorrect: true,
          },
          {
            id: 'd',
            label: '.env',
            value: 'env',
          },
        ],
        correctAnswer: 'c',
        explanation:
          'MCP Server werden in der Datei ~/.claude/mcp_servers.json konfiguriert.',
        hints: ['Es ist eine JSON-Datei', 'Sie liegt im .claude Verzeichnis'],
      },
      {
        id: 'l6-q5',
        text: 'Welcher MCP Server ermöglicht direkten Datenbankzugriff?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'mcp-github',
            value: 'github',
          },
          {
            id: 'b',
            label: 'mcp-postgres',
            value: 'postgres',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'mcp-slack',
            value: 'slack',
          },
          {
            id: 'd',
            label: 'mcp-filesystem',
            value: 'filesystem',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Der mcp-postgres Server ermöglicht direkten Zugriff auf PostgreSQL-Datenbanken.',
        hints: ['PostgreSQL ist eine Datenbank', 'Der Name enthält den Datenbank-Typ'],
      },
      {
        id: 'l6-q6',
        text: 'Was ist eine wichtige Security Best Practice für MCP?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Alle MCP Server global aktivieren',
            value: 'global',
          },
          {
            id: 'b',
            label: 'Environment Variables für Secrets nutzen',
            value: 'env',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'API Keys direkt in der Config speichern',
            value: 'direct',
          },
          {
            id: 'd',
            label: 'MCP Logging deaktivieren',
            value: 'nolog',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Secrets sollten immer über Environment Variables bereitgestellt werden, nie direkt in Config-Dateien.',
        hints: ['Es geht um Sicherheit von Credentials', 'Secrets sollten nicht im Code stehen'],
      },
    ],
  },

  // ========================================
  // LEKTION 7 QUIZ
  // ========================================
  {
    id: 'l7-quiz-1',
    lessonId: 7,
    title: 'Skills & Workflows',
    type: 'multiple-choice',
    points: 6,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l7-q1',
        text: 'Welche Datei definiert einen Skill?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'skill.json',
            value: 'json',
          },
          {
            id: 'b',
            label: 'SKILL.md',
            value: 'md',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'config.yaml',
            value: 'yaml',
          },
          {
            id: 'd',
            label: 'index.ts',
            value: 'ts',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Jeder Skill wird durch eine SKILL.md Datei mit YAML Frontmatter und Markdown Anweisungen definiert.',
        hints: ['Es ist eine Markdown-Datei', 'Der Name ist in Großbuchstaben'],
      },
      {
        id: 'l7-q2',
        text: 'Was ist der Unterschied zwischen Skills und Slash Commands?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Es gibt keinen Unterschied',
            value: 'none',
          },
          {
            id: 'b',
            label: 'Slash Commands sind manuell, Skills können automatisch aktiviert werden',
            value: 'auto',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Skills sind nur für Tests',
            value: 'tests',
          },
          {
            id: 'd',
            label: 'Slash Commands sind neuer',
            value: 'newer',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Slash Commands werden manuell vom User aufgerufen, während Skills auch automatisch von Claude aktiviert werden können wenn sie relevant sind.',
        hints: ['Skills haben einen "invocation" Parameter', 'Auto-invocation ist ein Feature'],
      },
      {
        id: 'l7-q3',
        text: 'Welcher invocation-Wert macht einen Skill automatisch?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'invocation: manual',
            value: 'manual',
          },
          {
            id: 'b',
            label: 'invocation: user',
            value: 'user',
          },
          {
            id: 'c',
            label: 'invocation: auto',
            value: 'auto',
            isCorrect: true,
          },
          {
            id: 'd',
            label: 'invocation: always',
            value: 'always',
          },
        ],
        correctAnswer: 'c',
        explanation:
          'Mit "invocation: auto" wird der Skill automatisch von Claude aktiviert wenn die Trigger-Wörter erkannt werden.',
        hints: ['Es geht um automatische Aktivierung', 'Auto ist das Schlüsselwort'],
      },
      {
        id: 'l7-q4',
        text: 'Wo werden Skills gespeichert?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: '.claude/skills/',
            value: 'skills',
            isCorrect: true,
          },
          {
            id: 'b',
            label: '.claude/commands/',
            value: 'commands',
          },
          {
            id: 'c',
            label: 'src/skills/',
            value: 'src',
          },
          {
            id: 'd',
            label: 'node_modules/skills/',
            value: 'node',
          },
        ],
        correctAnswer: 'a',
        explanation:
          'Skills werden im Verzeichnis .claude/skills/ gespeichert, jeder Skill in seinem eigenen Unterordner.',
        hints: ['Es ist im .claude Verzeichnis', 'Der Ordnername ist "skills"'],
      },
      {
        id: 'l7-q5',
        text: 'Was macht die "triggers" Konfiguration im YAML Frontmatter?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Definiert Tastaturkürzel',
            value: 'keyboard',
          },
          {
            id: 'b',
            label: 'Definiert Wörter die den Skill aktivieren',
            value: 'words',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Definiert Git Hooks',
            value: 'hooks',
          },
          {
            id: 'd',
            label: 'Definiert Fehlermeldungen',
            value: 'errors',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Die "triggers" Liste definiert Wörter oder Phrasen, die den Skill automatisch aktivieren.',
        hints: ['Es geht um Aktivierung', 'Trigger sind Auslöser'],
      },
      {
        id: 'l7-q6',
        text: 'Was ist ein Workflow in Claude Code?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Ein einfacher Bash-Befehl',
            value: 'bash',
          },
          {
            id: 'b',
            label: 'Ein komplexer Skill der mehrere Agents koordiniert',
            value: 'orchestration',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Ein Git Branch',
            value: 'branch',
          },
          {
            id: 'd',
            label: 'Ein Test-Framework',
            value: 'test',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Workflows sind komplexe Skills die Multi-Agent Orchestration für cross-domain Tasks implementieren.',
        hints: ['Es geht um Koordination', 'Mehrere Agents arbeiten zusammen'],
      },
    ],
  },

  // ========================================
  // LEKTION 8 QUIZ
  // ========================================
  {
    id: 'l8-quiz-1',
    lessonId: 8,
    title: 'Subagents Deep Dive',
    type: 'multiple-choice',
    points: 6,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l8-q1',
        text: 'Was sind Subagents?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Externe Plugins',
            value: 'plugins',
          },
          {
            id: 'b',
            label: 'Spezialisierte Claude-Instanzen für bestimmte Aufgaben',
            value: 'specialized',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Backup-Server',
            value: 'backup',
          },
          {
            id: 'd',
            label: 'User-Accounts',
            value: 'accounts',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Subagents sind spezialisierte Claude-Instanzen die für bestimmte Aufgaben optimiert sind und vom Main Agent koordiniert werden.',
        hints: ['Es sind Claude-Instanzen', 'Sie sind spezialisiert'],
      },
      {
        id: 'l8-q2',
        text: 'Was erben Subagents vom Parent Agent?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Nichts',
            value: 'nothing',
          },
          {
            id: 'b',
            label: 'Nur das Modell',
            value: 'model',
          },
          {
            id: 'c',
            label: 'Permissions (mit möglichen Einschränkungen)',
            value: 'permissions',
            isCorrect: true,
          },
          {
            id: 'd',
            label: 'Den gesamten Code',
            value: 'code',
          },
        ],
        correctAnswer: 'c',
        explanation:
          'Subagents erben die Permissions des Parent-Agents, können aber zusätzliche Tool-Einschränkungen haben.',
        hints: ['Es geht um Berechtigungen', 'Einschränkungen sind möglich'],
      },
      {
        id: 'l8-q3',
        text: 'Welches Multi-Agent Pattern führt Tasks gleichzeitig aus?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Pipeline',
            value: 'pipeline',
          },
          {
            id: 'b',
            label: 'Parallel Execution',
            value: 'parallel',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Supervisor',
            value: 'supervisor',
          },
          {
            id: 'd',
            label: 'Sequential',
            value: 'sequential',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Parallel Execution führt mehrere Agents gleichzeitig aus und merged die Ergebnisse am Ende.',
        hints: ['Parallel bedeutet gleichzeitig', 'Es ist das Gegenteil von sequentiell'],
      },
      {
        id: 'l8-q4',
        text: 'Was ist Dynamic Model Selection?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Zufällige Modellauswahl',
            value: 'random',
          },
          {
            id: 'b',
            label: 'Automatische Wahl des Modells basierend auf Task-Komplexität',
            value: 'dynamic',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Manuelle Modellkonfiguration',
            value: 'manual',
          },
          {
            id: 'd',
            label: 'Modell-Updates',
            value: 'updates',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Dynamic Model Selection ermöglicht Claude, automatisch das passende Modell (Haiku, Sonnet, Opus) basierend auf der Task-Komplexität zu wählen.',
        hints: ['Es ist automatisch', 'Basiert auf Komplexität'],
      },
      {
        id: 'l8-q5',
        text: 'Welcher Built-in Subagent navigiert durch die Codebase?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Code Analyzer',
            value: 'analyzer',
          },
          {
            id: 'b',
            label: 'File Explorer',
            value: 'explorer',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Test Runner',
            value: 'runner',
          },
          {
            id: 'd',
            label: 'Refactorer',
            value: 'refactorer',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Der File Explorer Subagent navigiert durch die Codebase und findet relevante Dateien mit Read-only Zugriff.',
        hints: ['Explorer bedeutet Erkunden', 'Es geht um Navigation'],
      },
      {
        id: 'l8-q6',
        text: 'Welches CLI-Flag zeigt Subagent-Aktivitäten?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: '--debug',
            value: 'debug',
          },
          {
            id: 'b',
            label: '--verbose',
            value: 'verbose',
            isCorrect: true,
          },
          {
            id: 'c',
            label: '--trace',
            value: 'trace',
          },
          {
            id: 'd',
            label: '--log',
            value: 'log',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Mit --verbose werden detaillierte Logs angezeigt, inklusive Subagent-Spawning, Tasks und Status.',
        hints: ['Verbose bedeutet ausführlich', 'Es ist ein Standard-Logging-Flag'],
      },
    ],
  },

  // ========================================
  // LEKTION 9 QUIZ
  // ========================================
  {
    id: 'l9-quiz-1',
    lessonId: 9,
    title: 'Custom Agents erstellen',
    type: 'multiple-choice',
    points: 6,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l9-q1',
        text: 'Welche Datei definiert einen Custom Agent?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'agent.json',
            value: 'json',
          },
          {
            id: 'b',
            label: 'AGENT.md',
            value: 'md',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'config.yaml',
            value: 'yaml',
          },
          {
            id: 'd',
            label: 'agent.ts',
            value: 'ts',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Custom Agents werden durch eine AGENT.md Datei mit YAML Frontmatter und Markdown Anweisungen definiert.',
        hints: ['Ähnlich wie SKILL.md', 'Es ist eine Markdown-Datei'],
      },
      {
        id: 'l9-q2',
        text: 'Was bedeutet "Least Privilege" bei Agent-Permissions?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Alle Permissions geben',
            value: 'all',
          },
          {
            id: 'b',
            label: 'Nur die minimal nötigen Permissions geben',
            value: 'minimal',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Keine Permissions geben',
            value: 'none',
          },
          {
            id: 'd',
            label: 'Nur Admin-Permissions',
            value: 'admin',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Least Privilege bedeutet, einem Agent nur die minimal notwendigen Berechtigungen zu geben - ein wichtiges Sicherheitsprinzip.',
        hints: ['Es ist ein Sicherheitsprinzip', 'Weniger ist mehr'],
      },
      {
        id: 'l9-q3',
        text: 'Welcher Hook wird bei einem Fehler ausgeführt?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'on_start',
            value: 'start',
          },
          {
            id: 'b',
            label: 'on_complete',
            value: 'complete',
          },
          {
            id: 'c',
            label: 'on_error',
            value: 'error',
            isCorrect: true,
          },
          {
            id: 'd',
            label: 'on_fail',
            value: 'fail',
          },
        ],
        correctAnswer: 'c',
        explanation:
          'Der on_error Hook wird ausgeführt wenn der Agent einen Fehler hat und kann für Error Handling und Rollback genutzt werden.',
        hints: ['Error bedeutet Fehler', 'Es ist ein Lifecycle Hook'],
      },
      {
        id: 'l9-q4',
        text: 'Welche Permission erlaubt nur sichere Bash-Commands?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'execute_bash',
            value: 'bash',
          },
          {
            id: 'b',
            label: 'execute_safe_bash',
            value: 'safe',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'bash_read',
            value: 'read',
          },
          {
            id: 'd',
            label: 'bash_limited',
            value: 'limited',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'execute_safe_bash erlaubt nur sichere Commands wie ls, cat, etc. im Gegensatz zu execute_bash welches beliebige Commands erlaubt.',
        hints: ['Safe bedeutet sicher', 'Es ist eingeschränkter als execute_bash'],
      },
      {
        id: 'l9-q5',
        text: 'Wo werden Custom Agents gespeichert?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: '.claude/skills/',
            value: 'skills',
          },
          {
            id: 'b',
            label: '.claude/agents/',
            value: 'agents',
            isCorrect: true,
          },
          {
            id: 'c',
            label: '.claude/custom/',
            value: 'custom',
          },
          {
            id: 'd',
            label: 'src/agents/',
            value: 'src',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Custom Agents werden im Verzeichnis .claude/agents/ gespeichert, jeder Agent in seinem eigenen Unterordner.',
        hints: ['Es ist im .claude Verzeichnis', 'Der Name ist logisch'],
      },
      {
        id: 'l9-q6',
        text: 'Was macht der "context_files" Parameter im Agent YAML?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Definiert Output-Dateien',
            value: 'output',
          },
          {
            id: 'b',
            label: 'Lädt automatisch bestimmte Dateien in den Kontext',
            value: 'context',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Ignoriert bestimmte Dateien',
            value: 'ignore',
          },
          {
            id: 'd',
            label: 'Erstellt neue Dateien',
            value: 'create',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'context_files definiert Dateien die automatisch in den Kontext des Agents geladen werden wenn er startet.',
        hints: ['Context bedeutet Kontext', 'Es geht um automatisches Laden'],
      },
    ],
  },

  // ========================================
  // LEKTION 10 QUIZ
  // ========================================
  {
    id: 'l10-quiz-1',
    lessonId: 10,
    title: 'Agent Personality & Configuration',
    type: 'multiple-choice',
    points: 5,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'l10-q1',
        text: 'Welcher Parameter beeinflusst die Kreativität eines Agents?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'model',
            value: 'model',
          },
          {
            id: 'b',
            label: 'temperature',
            value: 'temperature',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'max_tokens',
            value: 'tokens',
          },
          {
            id: 'd',
            label: 'timeout',
            value: 'timeout',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Temperature steuert wie kreativ/zufällig die Antworten sind. Niedrig (0.2) = präziser, Hoch (0.7+) = kreativer.',
        hints: ['Es geht um Kreativität vs Präzision', 'Ein Wert zwischen 0 und 1'],
      },
      {
        id: 'l10-q2',
        text: 'Welcher Agent-Archetyp fokussiert auf langfristige Perspektive?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Der Pragmatiker',
            value: 'pragmatist',
          },
          {
            id: 'b',
            label: 'Der Architekt',
            value: 'architect',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Der Detektiv',
            value: 'detective',
          },
          {
            id: 'd',
            label: 'Der Optimizer',
            value: 'optimizer',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Der Architekt-Archetyp denkt in Systemen und Patterns mit einer langfristigen Perspektive.',
        hints: ['Architekten planen Gebäude für die Zukunft', 'Es geht um System-Design'],
      },
      {
        id: 'l10-q3',
        text: 'Was ist wichtig für eine gute Agent-Persönlichkeit?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'So komplex wie möglich',
            value: 'complex',
          },
          {
            id: 'b',
            label: 'Konsistentes Verhalten',
            value: 'consistent',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Ständig wechselnd',
            value: 'changing',
          },
          {
            id: 'd',
            label: 'Maximale Kreativität',
            value: 'creative',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Eine gute Agent-Persönlichkeit ist konsistent - der Agent sollte sich immer gleich verhalten.',
        hints: ['Vorhersehbarkeit ist wichtig', 'User sollten wissen was sie erwartet'],
      },
      {
        id: 'l10-q4',
        text: 'Welches Modell sollte ein "Quick Fixer" Agent nutzen?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Opus (langsam, teuer)',
            value: 'opus',
          },
          {
            id: 'b',
            label: 'Sonnet (balanced)',
            value: 'sonnet',
          },
          {
            id: 'c',
            label: 'Haiku (schnell, günstig)',
            value: 'haiku',
            isCorrect: true,
          },
        ],
        correctAnswer: 'c',
        explanation:
          'Ein Quick Fixer Agent sollte Haiku nutzen da Geschwindigkeit wichtiger ist als tiefe Analyse.',
        hints: ['Quick bedeutet schnell', 'Haiku ist das schnellste Modell'],
      },
      {
        id: 'l10-q5',
        text: 'Wofür ist die "verbosity" Einstellung?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Für die Ausführlichkeit der Agent-Antworten',
            value: 'verbosity',
            isCorrect: true,
          },
          {
            id: 'b',
            label: 'Für die Geschwindigkeit',
            value: 'speed',
          },
          {
            id: 'c',
            label: 'Für die Fehlertoleranz',
            value: 'errors',
          },
          {
            id: 'd',
            label: 'Für die Dateigröße',
            value: 'size',
          },
        ],
        correctAnswer: 'a',
        explanation:
          'Verbosity steuert wie ausführlich die Antworten des Agents sind (low, medium, high).',
        hints: ['Verbose bedeutet ausführlich', 'Es geht um die Länge der Antworten'],
      },
    ],
  },

  // ========================================
  // LEKTION 11 QUIZ
  // ========================================
  {
    id: 'l11-quiz-1',
    lessonId: 11,
    title: 'Git-Integration Profi',
    type: 'multiple-choice',
    points: 6,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l11-q1',
        text: 'Welches Format nutzt Claude für Commit Messages?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Beliebiges Format',
            value: 'any',
          },
          {
            id: 'b',
            label: 'Conventional Commits (feat:, fix:, etc.)',
            value: 'conventional',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Nur Ticket-Nummern',
            value: 'tickets',
          },
          {
            id: 'd',
            label: 'Datum + Autor',
            value: 'date',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Claude Code nutzt standardmäßig Conventional Commits Format (feat:, fix:, docs:, etc.) für strukturierte Commit Messages.',
        hints: ['Es ist ein weit verbreiteter Standard', 'Die Messages haben ein Prefix'],
      },
      {
        id: 'l11-q2',
        text: 'Wie triggert man ein Claude Code Review in einem PR?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: '/review im Terminal',
            value: 'terminal',
          },
          {
            id: 'b',
            label: '@claude im PR-Kommentar',
            value: 'mention',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Automatisch bei jedem PR',
            value: 'auto',
          },
          {
            id: 'd',
            label: 'Via Email',
            value: 'email',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'In einem PR-Kommentar kann man @claude mention um ein Review oder andere Aktionen zu triggern.',
        hints: ['Es ist ein GitHub-Kommentar', 'Man "erwähnt" Claude'],
      },
      {
        id: 'l11-q3',
        text: 'Was macht Claude Code bei einem Force Push zu main?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Führt es sofort aus',
            value: 'execute',
          },
          {
            id: 'b',
            label: 'Blockiert es ohne Bestätigung',
            value: 'block',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Fragt nach dem Password',
            value: 'password',
          },
          {
            id: 'd',
            label: 'Erstellt ein Backup',
            value: 'backup',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Claude Code blockiert automatisch gefährliche Git-Operationen wie Force Push zu main/master ohne explizite Bestätigung.',
        hints: ['Es ist eine Sicherheitsmaßnahme', 'Force Push ist gefährlich'],
      },
      {
        id: 'l11-q4',
        text: 'Welche GitHub Action ermöglicht Claude Code Integration?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'actions/claude@v1',
            value: 'actions',
          },
          {
            id: 'b',
            label: 'anthropics/claude-code-action@v1',
            value: 'anthropics',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'github/claude@v1',
            value: 'github',
          },
          {
            id: 'd',
            label: 'ai/claude-action@v1',
            value: 'ai',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Die offizielle GitHub Action ist anthropics/claude-code-action für CI/CD Integration.',
        hints: ['Anthropic ist der Hersteller', 'Es ist die offizielle Action'],
      },
      {
        id: 'l11-q5',
        text: 'Was passiert vor jedem Claude Code Commit?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Automatischer Push',
            value: 'push',
          },
          {
            id: 'b',
            label: 'User-Bestätigung (y/n/e)',
            value: 'confirm',
            isCorrect: true,
          },
          {
            id: 'c',
            label: 'Automatischer Test-Run',
            value: 'test',
          },
          {
            id: 'd',
            label: 'Email-Notification',
            value: 'email',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Vor jedem Commit zeigt Claude die geplante Message und wartet auf Bestätigung (y=ja, n=nein, e=edit).',
        hints: ['Es ist ein Sicherheitsschritt', 'Der User hat Kontrolle'],
      },
      {
        id: 'l11-q6',
        text: 'Welcher @claude Befehl behebt automatisch Lint-Fehler?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: '@claude review',
            value: 'review',
          },
          {
            id: 'b',
            label: '@claude fix lint errors',
            value: 'lint',
            isCorrect: true,
          },
          {
            id: 'c',
            label: '@claude explain',
            value: 'explain',
          },
          {
            id: 'd',
            label: '@claude check',
            value: 'check',
          },
        ],
        correctAnswer: 'b',
        explanation:
          'Mit "@claude fix lint errors" behebt Claude automatisch Lint-Fehler im Code.',
        hints: ['Es geht um automatische Fixes', 'Lint-Fehler sind Style-Probleme'],
      },
    ],
  },

  // ========================================
  // LEKTION 12 QUIZ — Hooks & Automation
  // ========================================
  {
    id: 'l12-quiz-1',
    lessonId: 12,
    title: 'Hooks & Automation',
    type: 'multiple-choice',
    points: 7,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l12-q1',
        text: 'Welcher Exit Code blockiert eine Aktion in einem PreToolUse Hook?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Exit Code 0', value: '0' },
          { id: 'b', label: 'Exit Code 1', value: '1' },
          { id: 'c', label: 'Exit Code 2', value: '2', isCorrect: true },
          { id: 'd', label: 'Exit Code 3', value: '3' },
        ],
        correctAnswer: 'c',
        explanation:
          'Exit Code 2 blockiert die Aktion. Exit 0 bedeutet "bestanden/weiter", Exit 1 gibt Feedback/Warnung.',
        hints: ['Es ist nicht 0 (das bedeutet OK)', 'Es ist ein spezieller Code zum Blockieren'],
      },
      {
        id: 'l12-q2',
        text: 'Welcher Hook-Event feuert VOR der Ausführung eines Tools?',
        type: 'radio',
        options: [
          { id: 'a', label: 'PostToolUse', value: 'post' },
          { id: 'b', label: 'PreToolUse', value: 'pre', isCorrect: true },
          { id: 'c', label: 'SessionStart', value: 'session' },
          { id: 'd', label: 'Notification', value: 'notification' },
        ],
        correctAnswer: 'b',
        explanation:
          'PreToolUse feuert VOR der Tool-Ausführung und kann die Aktion blockieren. PostToolUse feuert danach.',
        hints: ['Pre = Vor', 'Dieser Hook kann Aktionen verhindern'],
      },
      {
        id: 'l12-q3',
        text: 'Wo werden Hooks konfiguriert?',
        type: 'radio',
        options: [
          { id: 'a', label: 'In CLAUDE.md', value: 'claudemd' },
          { id: 'b', label: 'In .claude/settings.json', value: 'settings', isCorrect: true },
          { id: 'c', label: 'In package.json', value: 'package' },
          { id: 'd', label: 'In .gitconfig', value: 'gitconfig' },
        ],
        correctAnswer: 'b',
        explanation:
          'Hooks werden in .claude/settings.json (Projekt) oder ~/.claude/settings.json (User) konfiguriert.',
        hints: ['Es ist eine JSON-Datei', 'Sie liegt im .claude/ Verzeichnis'],
      },
      {
        id: 'l12-q4',
        text: 'Wofür ist der "matcher" in der Hook-Konfiguration zuständig?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Bestimmt das Modell für den Hook', value: 'model' },
          {
            id: 'b',
            label: 'Filtert welche Tools den Hook triggern',
            value: 'filter',
            isCorrect: true,
          },
          { id: 'c', label: 'Setzt den Timeout des Hooks', value: 'timeout' },
          { id: 'd', label: 'Definiert die Priorität', value: 'priority' },
        ],
        correctAnswer: 'b',
        explanation:
          'Der Matcher filtert, welche Tools den Hook triggern. Z.B. "Edit|Write" triggert nur bei Edit oder Write.',
        hints: ['Es geht um Filterung', 'Beispiel: "Bash" oder "Edit|Write"'],
      },
      {
        id: 'l12-q5',
        text: 'Welcher Hook eignet sich am besten für Auto-Formatting nach Code-Änderungen?',
        type: 'radio',
        options: [
          { id: 'a', label: 'PreToolUse', value: 'pre' },
          {
            id: 'b',
            label: 'PostToolUse mit Matcher "Edit|Write"',
            value: 'post',
            isCorrect: true,
          },
          { id: 'c', label: 'SessionStart', value: 'session' },
          { id: 'd', label: 'Stop', value: 'stop' },
        ],
        correctAnswer: 'b',
        explanation:
          'PostToolUse mit Matcher "Edit|Write" feuert nach jeder Datei-Änderung — perfekt für Prettier/ESLint.',
        hints: ['Formatting passiert NACH der Änderung', 'Es betrifft Edit und Write Tools'],
      },
      {
        id: 'l12-q6',
        text: 'Kosten Hooks Token?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Ja, wie normale API-Calls', value: 'yes' },
          {
            id: 'b',
            label: 'Nein, sie laufen lokal auf deinem System',
            value: 'no',
            isCorrect: true,
          },
          { id: 'c', label: 'Nur PreToolUse Hooks kosten Token', value: 'partial' },
          { id: 'd', label: 'Nur bei aktivem Debug-Modus', value: 'debug' },
        ],
        correctAnswer: 'b',
        explanation:
          'Hooks laufen lokal als Shell-Commands und verbrauchen keine API-Token. Sie sind kostenlos!',
        hints: ['Hooks sind Shell-Befehle', 'Sie laufen auf deinem Computer, nicht in der Cloud'],
      },
    ],
  },

  // ========================================
  // LEKTION 13 QUIZ — Custom Slash Commands
  // ========================================
  {
    id: 'l13-quiz-1',
    lessonId: 13,
    title: 'Custom Slash Commands',
    type: 'multiple-choice',
    points: 6,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l13-q1',
        text: 'Wo werden Projekt-weite Custom Commands gespeichert?',
        type: 'radio',
        options: [
          { id: 'a', label: '~/.claude/commands/', value: 'user' },
          { id: 'b', label: '.claude/commands/', value: 'project', isCorrect: true },
          { id: 'c', label: '.claude/skills/', value: 'skills' },
          { id: 'd', label: 'src/commands/', value: 'src' },
        ],
        correctAnswer: 'b',
        explanation:
          'Projekt-Commands liegen in .claude/commands/ und können via Git mit dem Team geteilt werden.',
        hints: ['Es ist im .claude/ Ordner', 'Persönliche Commands sind woanders (~/)'],
      },
      {
        id: 'l13-q2',
        text: 'Wie referenziert man das erste Argument in einem Custom Command?',
        type: 'radio',
        options: [
          { id: 'a', label: '$ARG1', value: 'arg1' },
          { id: 'b', label: '$1', value: 'dollar1', isCorrect: true },
          { id: 'c', label: '{arg:1}', value: 'brace' },
          { id: 'd', label: '%1', value: 'percent' },
        ],
        correctAnswer: 'b',
        explanation:
          '$1 ist das erste Argument, $2 das zweite, $ARGUMENTS enthält alle Argumente als String.',
        hints: ['Ähnlich wie in Shell-Scripts', 'Beginnt mit Dollar-Zeichen'],
      },
      {
        id: 'l13-q3',
        text: 'Was bewirkt die "allowed-tools" Option im Frontmatter?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Installiert neue Tools', value: 'install' },
          {
            id: 'b',
            label: 'Beschränkt welche Tools der Command nutzen darf',
            value: 'restrict',
            isCorrect: true,
          },
          { id: 'c', label: 'Empfiehlt Tools dem User', value: 'recommend' },
          { id: 'd', label: 'Deinstalliert ungenutzte Tools', value: 'uninstall' },
        ],
        correctAnswer: 'b',
        explanation:
          'allowed-tools im Frontmatter beschränkt die verfügbaren Tools, z.B. nur Read und Grep für Analyse-Commands.',
        hints: ['Es ist eine Sicherheits-Einstellung', 'Es limitiert den Zugriff'],
      },
      {
        id: 'l13-q4',
        text: 'Wie wird ein Command in einem Unterordner aufgerufen?',
        type: 'radio',
        options: [
          { id: 'a', label: '/project/frontend/component', value: 'slash' },
          {
            id: 'b',
            label: '/project:frontend:component',
            value: 'colon',
            isCorrect: true,
          },
          { id: 'c', label: '/frontend.component', value: 'dot' },
          { id: 'd', label: '/run frontend/component', value: 'run' },
        ],
        correctAnswer: 'b',
        explanation:
          'Unterordner werden zu Namespaces mit Doppelpunkt: .claude/commands/frontend/component.md → /project:frontend:component',
        hints: ['Es nutzt Doppelpunkte', 'project: ist das Prefix für Projekt-Commands'],
      },
      {
        id: 'l13-q5',
        text: 'Welches Dateiformat haben Custom Commands?',
        type: 'radio',
        options: [
          { id: 'a', label: 'JSON (.json)', value: 'json' },
          { id: 'b', label: 'YAML (.yml)', value: 'yaml' },
          { id: 'c', label: 'Markdown (.md)', value: 'md', isCorrect: true },
          { id: 'd', label: 'TypeScript (.ts)', value: 'ts' },
        ],
        correctAnswer: 'c',
        explanation:
          'Custom Commands sind Markdown-Dateien (.md) mit optionalem YAML-Frontmatter für Konfiguration.',
        hints: ['Es ist ein einfaches Textformat', 'Der Prompt wird in natürlicher Sprache geschrieben'],
      },
    ],
  },

  // ========================================
  // LEKTION 14 QUIZ — Advanced Prompting
  // ========================================
  {
    id: 'l14-quiz-1',
    lessonId: 14,
    title: 'Advanced Prompting Techniques',
    type: 'multiple-choice',
    points: 6,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l14-q1',
        text: 'Welches Keyword aktiviert die maximale Analyse-Tiefe in Claude Code?',
        type: 'radio',
        options: [
          { id: 'a', label: 'think', value: 'think' },
          { id: 'b', label: 'analyze deep', value: 'analyze' },
          { id: 'c', label: 'ultrathink', value: 'ultra', isCorrect: true },
          { id: 'd', label: 'maximum reasoning', value: 'max' },
        ],
        correctAnswer: 'c',
        explanation:
          '"ultrathink" aktiviert die maximale Reasoning-Tiefe. Die Stufen sind: think → think hard → ultrathink.',
        hints: ['Es ist ein spezielles Keyword', 'Es ist die höchste Stufe'],
      },
      {
        id: 'l14-q2',
        text: 'Was ist die "Goldene Regel" des Promptings?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Immer ultrathink verwenden', value: 'ultra' },
          {
            id: 'b',
            label: 'Kontext schlägt Cleverness',
            value: 'context',
            isCorrect: true,
          },
          { id: 'c', label: 'Kürzere Prompts sind besser', value: 'short' },
          { id: 'd', label: 'Immer Plan Mode nutzen', value: 'plan' },
        ],
        correctAnswer: 'b',
        explanation:
          'Statt einen "schlauen" Prompt zu schreiben, liefere alle nötigen Informationen. Claude braucht Kontext, keine Tricks.',
        hints: ['Es geht um Information vs. Formulierung', 'Liefere WAS du brauchst statt WIE du fragst'],
      },
      {
        id: 'l14-q3',
        text: 'Was ist das "Persona Pattern"?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Claude gibt sich einen Namen', value: 'name' },
          {
            id: 'b',
            label: 'Spezifische Expertise aktivieren ("As a security expert...")',
            value: 'expertise',
            isCorrect: true,
          },
          { id: 'c', label: 'Mehrere Claude-Instanzen starten', value: 'instances' },
          { id: 'd', label: 'Das Modell wechseln', value: 'model' },
        ],
        correctAnswer: 'b',
        explanation:
          'Das Persona Pattern aktiviert spezifische Expertise: "As a database expert, analyze..."',
        hints: ['Es geht um Rollen', 'Man weist Claude eine bestimmte Perspektive zu'],
      },
      {
        id: 'l14-q4',
        text: 'Was solltest du tun wenn Claude sich wiederholt oder Dateien erneut liest?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Mehr Details geben', value: 'more' },
          { id: 'b', label: 'Abwarten', value: 'wait' },
          {
            id: 'c',
            label: '/clear nutzen und frisch starten',
            value: 'clear',
            isCorrect: true,
          },
          { id: 'd', label: 'Das Modell wechseln', value: 'model' },
        ],
        correctAnswer: 'c',
        explanation:
          'Wenn Claude sich wiederholt, ist der Context degradiert. /clear und frisch starten ist die beste Lösung.',
        hints: ['Es ist ein Zeichen für Context-Probleme', 'Ein Neustart hilft'],
      },
      {
        id: 'l14-q5',
        text: 'Was ist der Vorteil des "Iterative Refinement" Patterns?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Es ist schneller als ein einzelner Prompt', value: 'fast' },
          { id: 'b', label: 'Es kostet weniger Token', value: 'cheap' },
          {
            id: 'c',
            label: 'Claude kritisiert und verbessert seine eigene Lösung',
            value: 'critique',
            isCorrect: true,
          },
          { id: 'd', label: 'Es nutzt automatisch ultrathink', value: 'auto' },
        ],
        correctAnswer: 'c',
        explanation:
          'Implement → Critique → Fix: Claude implementiert, kritisiert sich selbst und behebt gefundene Probleme.',
        hints: ['Es sind mehrere Durchgänge', 'Claude prüft sein eigenes Ergebnis'],
      },
    ],
  },

  // ========================================
  // LEKTION 15 QUIZ — Plan & Thinking Mode
  // ========================================
  {
    id: 'l15-quiz-1',
    lessonId: 15,
    title: 'Plan & Thinking Mode',
    type: 'multiple-choice',
    points: 6,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l15-q1',
        text: 'Was ist Extended Thinking?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Ein anderes, größeres Modell', value: 'model' },
          {
            id: 'b',
            label: 'Dasselbe Modell mit dediziertem Denkraum vor der Antwort',
            value: 'thinking',
            isCorrect: true,
          },
          { id: 'c', label: 'Ein Plugin für Claude Code', value: 'plugin' },
          { id: 'd', label: 'Ein separater Analysedienst', value: 'service' },
        ],
        correctAnswer: 'b',
        explanation:
          'Extended Thinking ist KEIN anderes Modell. Es ist dasselbe Modell, das sich mehr Zeit zum Nachdenken nimmt.',
        hints: ['Es ist kein Modell-Wechsel', 'Claude bekommt einen "Denkraum"'],
      },
      {
        id: 'l15-q2',
        text: 'Wie aktiviert man den Plan Mode im Claude Code CLI?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Mit /plan Befehl', value: 'command' },
          { id: 'b', label: 'Mit Shift+Tab (2x)', value: 'shift', isCorrect: true },
          { id: 'c', label: 'Mit --plan Flag', value: 'flag' },
          { id: 'd', label: 'Automatisch bei komplexen Fragen', value: 'auto' },
        ],
        correctAnswer: 'b',
        explanation:
          'Shift+Tab (2x drücken) wechselt in den Plan Mode. Claude analysiert dann bevor es implementiert.',
        hints: ['Es ist ein Tastatur-Shortcut', 'Man muss 2x drücken'],
      },
      {
        id: 'l15-q3',
        text: 'Was ist das OpusPlan Pattern?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Nur Opus verwenden', value: 'opus' },
          {
            id: 'b',
            label: 'Opus für Planung (~20%), Sonnet für Implementierung (~80%)',
            value: 'hybrid',
            isCorrect: true,
          },
          { id: 'c', label: 'Opus und Haiku abwechselnd', value: 'alternate' },
          { id: 'd', label: 'Zwei Opus-Instanzen parallel', value: 'parallel' },
        ],
        correctAnswer: 'b',
        explanation:
          'OpusPlan nutzt Opus (teurer, besser) nur für Planung und Sonnet (günstiger) für die Implementierung — 60-70% Ersparnis.',
        hints: ['Es kombiniert zwei Modelle', 'Eines plant, das andere implementiert'],
      },
      {
        id: 'l15-q4',
        text: 'In welcher Reihenfolge arbeitet der Plan Mode?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Plan → Execute → Review', value: 'per' },
          { id: 'b', label: 'Execute → Plan → Review', value: 'epr' },
          {
            id: 'c',
            label: 'Explore → Plan → Review → Execute',
            value: 'epre',
            isCorrect: true,
          },
          { id: 'd', label: 'Think → Execute → Test', value: 'tet' },
        ],
        correctAnswer: 'c',
        explanation:
          'Plan Mode folgt dem Workflow: Explore (Codebase analysieren) → Plan (Architektur) → Review (User prüft) → Execute.',
        hints: ['Erst wird die Codebase erkundet', 'Der User prüft den Plan vor der Umsetzung'],
      },
      {
        id: 'l15-q5',
        text: 'Wie viel teurer sind unsichtbare Thinking Tokens typischerweise?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Gleich teuer wie Output', value: '1x' },
          { id: 'b', label: '2x teurer', value: '2x' },
          {
            id: 'c',
            label: 'Bis zu 10x mehr Tokens als die finale Antwort',
            value: '10x',
            isCorrect: true,
          },
          { id: 'd', label: 'Thinking Tokens sind kostenlos', value: 'free' },
        ],
        correctAnswer: 'c',
        explanation:
          'Ein "think hard" Call kann bis zu 10x mehr Token verbrauchen als die sichtbare Antwort. Mit /cost kannst du den Verbrauch tracken.',
        hints: ['Thinking Tokens sind unsichtbar aber kosten', 'Es ist deutlich mehr als die Antwort'],
      },
    ],
  },

  // ========================================
  // LEKTION 16 QUIZ — Agent Orchestration
  // ========================================
  {
    id: 'l16-quiz-1',
    lessonId: 16,
    title: 'Agent Orchestration',
    type: 'multiple-choice',
    points: 7,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l16-q1',
        text: 'Was ist ein Subagent in Claude Code?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Ein externes Plugin', value: 'plugin' },
          {
            id: 'b',
            label: 'Eine isolierte Claude-Instanz mit eigenem Context Window',
            value: 'isolated',
            isCorrect: true,
          },
          { id: 'c', label: 'Ein anderer User auf dem gleichen Account', value: 'user' },
          { id: 'd', label: 'Ein lokales LLM', value: 'local' },
        ],
        correctAnswer: 'b',
        explanation:
          'Ein Subagent ist eine isolierte Claude-Instanz mit eigenem Context Window, eigenen Tool-Berechtigungen und spezifischem Fokus.',
        hints: ['Es ist eine separate Instanz', 'Context wird NICHT geteilt'],
      },
      {
        id: 'l16-q2',
        text: 'Wann sollten Subagents PARALLEL laufen?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Immer, das ist schneller', value: 'always' },
          {
            id: 'b',
            label: 'Bei 3+ unabhängigen Tasks ohne geteilten State',
            value: 'independent',
            isCorrect: true,
          },
          { id: 'c', label: 'Nur bei Haiku-Modell', value: 'haiku' },
          { id: 'd', label: 'Nur wenn der User es explizit anfragt', value: 'explicit' },
        ],
        correctAnswer: 'b',
        explanation:
          'Parallel nur bei unabhängigen Tasks ohne geteilten State. Sonst drohen Merge-Konflikte und inkonsistenter State.',
        hints: ['Es kommt auf Abhängigkeiten an', 'Geteilte Dateien = Problem bei Parallel'],
      },
      {
        id: 'l16-q3',
        text: 'Wo werden Custom Agent-Definitionen gespeichert?',
        type: 'radio',
        options: [
          { id: 'a', label: '.claude/commands/', value: 'commands' },
          { id: 'b', label: '.claude/agents/', value: 'agents', isCorrect: true },
          { id: 'c', label: '.claude/skills/', value: 'skills' },
          { id: 'd', label: 'node_modules/', value: 'node' },
        ],
        correctAnswer: 'b',
        explanation:
          'Custom Agents werden als Markdown-Dateien mit YAML-Frontmatter in .claude/agents/ definiert.',
        hints: ['Es ist ein spezieller Ordner in .claude/', 'Der Name beschreibt genau was drin ist'],
      },
      {
        id: 'l16-q4',
        text: 'Was macht Ctrl+B bei einem laufenden Subagent?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Bricht den Subagent ab', value: 'cancel' },
          {
            id: 'b',
            label: 'Schickt ihn in den Hintergrund',
            value: 'background',
            isCorrect: true,
          },
          { id: 'c', label: 'Wechselt zum nächsten Subagent', value: 'switch' },
          { id: 'd', label: 'Startet den Subagent neu', value: 'restart' },
        ],
        correctAnswer: 'b',
        explanation:
          'Ctrl+B schickt den Subagent in den Hintergrund. Du kannst weiterarbeiten und mit /tasks den Status prüfen.',
        hints: ['B steht für "Background"', 'Du kannst danach weiterarbeiten'],
      },
      {
        id: 'l16-q5',
        text: 'Was ermöglicht die Umgebungsvariable CLAUDE_CODE_TASK_LIST_ID?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Einen neuen Task erstellen', value: 'create' },
          {
            id: 'b',
            label: 'Mehrere Claude-Sessions teilen dieselbe Task-Liste',
            value: 'shared',
            isCorrect: true,
          },
          { id: 'c', label: 'Tasks automatisch löschen', value: 'delete' },
          { id: 'd', label: 'Die Task-Priorität setzen', value: 'priority' },
        ],
        correctAnswer: 'b',
        explanation:
          'CLAUDE_CODE_TASK_LIST_ID ermöglicht es mehreren Sessions, dieselbe Task-Liste zu teilen — für echte Multi-Session Koordination.',
        hints: ['Es geht um geteilten State', 'Mehrere Sessions können zusammenarbeiten'],
      },
      {
        id: 'l16-q6',
        text: 'Welcher Built-in Agent-Typ eignet sich am besten für schnelle Codebase-Erforschung?',
        type: 'radio',
        options: [
          { id: 'a', label: 'general-purpose', value: 'general' },
          { id: 'b', label: 'Bash', value: 'bash' },
          { id: 'c', label: 'Explore', value: 'explore', isCorrect: true },
          { id: 'd', label: 'Plan', value: 'plan' },
        ],
        correctAnswer: 'c',
        explanation:
          'Der "Explore" Agent-Typ ist speziell für schnelle Codebase-Erforschung optimiert.',
        hints: ['Der Name sagt es schon', 'Es geht um "erkunden"'],
      },
    ],
  },

  // ========================================
  // LEKTION 17 QUIZ — Production Best Practices
  // ========================================
  {
    id: 'l17-quiz-1',
    lessonId: 17,
    title: 'Production Best Practices',
    type: 'multiple-choice',
    points: 6,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l17-q1',
        text: 'Welches Flag aktiviert den Headless Mode von Claude Code?',
        type: 'radio',
        options: [
          { id: 'a', label: '--headless', value: 'headless' },
          { id: 'b', label: '-p oder --print', value: 'print', isCorrect: true },
          { id: 'c', label: '--no-ui', value: 'noui' },
          { id: 'd', label: '--ci', value: 'ci' },
        ],
        correctAnswer: 'b',
        explanation:
          'Das -p (oder --print) Flag startet Claude Code im Headless Mode — ohne Interaktion, Ergebnis auf stdout.',
        hints: ['Es ist ein kurzes Flag', 'p steht für "print"'],
      },
      {
        id: 'l17-q2',
        text: 'Was haben Deny-Regeln gegenüber Allow-Regeln für eine Priorität?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Gleiche Priorität', value: 'equal' },
          {
            id: 'b',
            label: 'Deny hat IMMER Vorrang',
            value: 'deny',
            isCorrect: true,
          },
          { id: 'c', label: 'Allow hat Vorrang', value: 'allow' },
          { id: 'd', label: 'Kommt auf die Reihenfolge an', value: 'order' },
        ],
        correctAnswer: 'b',
        explanation:
          'Deny-Regeln haben IMMER Vorrang. Wenn etwas in deny steht, kann es nicht durch allow überschrieben werden.',
        hints: ['Es ist ein Sicherheits-Prinzip', 'Blockierungen sind stärker als Erlaubnisse'],
      },
      {
        id: 'l17-q3',
        text: 'Wann darf --dangerously-skip-permissions verwendet werden?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Immer in der Entwicklung', value: 'always' },
          { id: 'b', label: 'Auf dem Laptop des Entwicklers', value: 'laptop' },
          {
            id: 'c',
            label: 'Nur in isolierten Umgebungen (CI Container)',
            value: 'ci',
            isCorrect: true,
          },
          { id: 'd', label: 'Wenn man schnell arbeiten will', value: 'fast' },
        ],
        correctAnswer: 'c',
        explanation:
          '--dangerously-skip-permissions umgeht ALLE Sicherheitschecks und darf NUR in isolierten CI-Containern verwendet werden.',
        hints: ['Der Name sagt "dangerously"', 'Es braucht eine isolierte Umgebung'],
      },
      {
        id: 'l17-q4',
        text: 'Welcher Befehl zeigt den aktuellen Token-Verbrauch?',
        type: 'radio',
        options: [
          { id: 'a', label: '/tokens', value: 'tokens' },
          { id: 'b', label: '/cost', value: 'cost', isCorrect: true },
          { id: 'c', label: '/usage', value: 'usage' },
          { id: 'd', label: '/stats', value: 'stats' },
        ],
        correctAnswer: 'b',
        explanation:
          '/cost zeigt den Token-Verbrauch und die geschätzten Kosten der aktuellen Session.',
        hints: ['Es geht um Kosten', 'Es ist ein eingebauter Befehl'],
      },
      {
        id: 'l17-q5',
        text: 'Was ist die empfohlene Strategie für Enterprise-Deployment?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Direkte API-Keys für jeden Entwickler', value: 'keys' },
          {
            id: 'b',
            label: 'Cloud-Provider (Bedrock/Vertex) mit SSO und IAM',
            value: 'cloud',
            isCorrect: true,
          },
          { id: 'c', label: 'Einen geteilten Account für alle', value: 'shared' },
          { id: 'd', label: 'Lokale Modelle auf eigenen Servern', value: 'local' },
        ],
        correctAnswer: 'b',
        explanation:
          'Enterprise-Deployment über Cloud-Provider (AWS Bedrock, Google Vertex) bietet SSO, IAM, Audit Logs und Compliance.',
        hints: ['Es geht um Enterprise-Features', 'SSO und IAM sind wichtig'],
      },
    ],
  },

  // ========================================
  // LEKTION 18 QUIZ — Troubleshooting Pro
  // ========================================
  {
    id: 'l18-quiz-1',
    lessonId: 18,
    title: 'Troubleshooting Pro',
    type: 'multiple-choice',
    points: 6,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'l18-q1',
        text: 'Welcher Befehl führt eine umfassende automatische Diagnose durch?',
        type: 'radio',
        options: [
          { id: 'a', label: '/status', value: 'status' },
          { id: 'b', label: '/doctor', value: 'doctor', isCorrect: true },
          { id: 'c', label: '/debug', value: 'debug' },
          { id: 'd', label: '/check', value: 'check' },
        ],
        correctAnswer: 'b',
        explanation:
          '/doctor prüft Installation, Version, MCP-Server, Settings-Validierung, Keybindings und Context-Warnungen.',
        hints: ['Wie ein "Arzt" für Claude Code', 'Prüft alles automatisch'],
      },
      {
        id: 'l18-q2',
        text: 'Was ist das häufigste Warnsignal für Context-Degradation?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Claude antwortet schneller als üblich', value: 'fast' },
          {
            id: 'b',
            label: 'Claude liest Dateien die es gerade gelesen hat',
            value: 'reread',
            isCorrect: true,
          },
          { id: 'c', label: 'Claude schlägt neue Features vor', value: 'features' },
          { id: 'd', label: 'Die Antworten werden kürzer', value: 'short' },
        ],
        correctAnswer: 'b',
        explanation:
          'Wenn Claude Dateien erneut liest oder sich wiederholt, ist der Context degradiert. Zeit für /clear!',
        hints: ['Es geht um Wiederholung', 'Claude "vergisst" was es schon gemacht hat'],
      },
      {
        id: 'l18-q3',
        text: 'Um wie viel Prozent kann .claudeignore den Context-Verbrauch reduzieren?',
        type: 'radio',
        options: [
          { id: 'a', label: '5-10%', value: '5' },
          { id: 'b', label: '15-20%', value: '15' },
          { id: 'c', label: '40-60%', value: '40', isCorrect: true },
          { id: 'd', label: '90-100%', value: '90' },
        ],
        correctAnswer: 'c',
        explanation:
          '.claudeignore kann den Context-Verbrauch um 40-60% reduzieren, indem unnötige Dateien (node_modules, dist, etc.) ignoriert werden.',
        hints: ['Es ist eine signifikante Reduktion', 'Ungefähr die Hälfte'],
      },
      {
        id: 'l18-q4',
        text: 'Welche Umgebungsvariable aktiviert den Debug-Modus?',
        type: 'radio',
        options: [
          { id: 'a', label: 'DEBUG=true', value: 'debug' },
          {
            id: 'b',
            label: 'CLAUDE_CODE_DEBUG=1',
            value: 'claude_debug',
            isCorrect: true,
          },
          { id: 'c', label: 'VERBOSE=1', value: 'verbose' },
          { id: 'd', label: 'LOG_LEVEL=debug', value: 'loglevel' },
        ],
        correctAnswer: 'b',
        explanation:
          'CLAUDE_CODE_DEBUG=1 claude aktiviert detaillierte Debug-Logs für die Fehlersuche.',
        hints: ['Es beginnt mit CLAUDE_CODE', 'Es wird auf 1 gesetzt'],
      },
      {
        id: 'l18-q5',
        text: 'Was ist die beste Strategie bei persistenten Context-Problemen?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Mehr Token kaufen', value: 'tokens' },
          {
            id: 'b',
            label: 'Ein Feature pro Conversation, Plan in externe Datei schreiben',
            value: 'scope',
            isCorrect: true,
          },
          { id: 'c', label: 'Immer das größte Modell verwenden', value: 'biggest' },
          { id: 'd', label: 'Alle Dateien auf einmal referenzieren', value: 'all' },
        ],
        correctAnswer: 'b',
        explanation:
          'Ein Feature pro Conversation begrenzt den Context. Pläne in externe Dateien (SCRATCHPAD.md) schreiben überlebt /clear.',
        hints: ['Weniger ist mehr beim Context', 'Externe Dateien als Gedächtnis nutzen'],
      },
      {
        id: 'l18-q6',
        text: 'Was sollte man bei "Rate limit exceeded" tun?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Claude Code neu installieren', value: 'reinstall' },
          { id: 'b', label: 'Den API Key wechseln', value: 'key' },
          {
            id: 'c',
            label: 'Warten und Anfrage-Frequenz reduzieren',
            value: 'wait',
            isCorrect: true,
          },
          { id: 'd', label: 'Den Debug-Modus aktivieren', value: 'debug' },
        ],
        correctAnswer: 'c',
        explanation:
          'Rate Limits bedeuten zu viele Anfragen. Warten, Frequenz reduzieren, oder einen höheren Plan upgraden.',
        hints: ['Es ist ein Limit-Problem', 'Weniger Anfragen oder warten'],
      },
    ],
  },

  // ========================================
  // LEKTION 19 QUIZ: Context Engineering
  // ========================================
  {
    id: 'l19-quiz-1',
    lessonId: 19,
    title: 'Context Engineering Masterclass',
    type: 'multiple-choice',
    points: 5,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        id: 'l19-q1',
        text: 'Was ist der Hauptunterschied zwischen Prompt Engineering und Context Engineering?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Prompt Engineering ist neuer als Context Engineering', value: 'newer' },
          {
            id: 'b',
            label: 'Context Engineering optimiert den gesamten Token-Pool, nicht nur einen einzelnen Prompt',
            value: 'token-pool',
            isCorrect: true,
          },
          { id: 'c', label: 'Es gibt keinen Unterschied', value: 'same' },
          { id: 'd', label: 'Context Engineering ist nur für Teams relevant', value: 'teams' },
        ],
        correctAnswer: 'b',
        explanation:
          'Context Engineering geht über einzelne Prompts hinaus und optimiert den gesamten Zustand (System + CLAUDE.md + Files + Konversation + Tools), der dem Modell zur Verfügung steht.',
        hints: ['Denke an den gesamten Token-Pool', 'Es geht um mehr als nur die Formulierung'],
      },
      {
        id: 'l19-q2',
        text: 'In welcher Phase der Context Rot sollte man SOFORT /clear verwenden?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Phase 1: Frisch (0-25%)', value: 'phase1' },
          { id: 'b', label: 'Phase 2: Produktiv (25-50%)', value: 'phase2' },
          {
            id: 'c',
            label: 'Phase 4: Kritisch (75-90%)',
            value: 'phase4',
            isCorrect: true,
          },
          { id: 'd', label: 'Man sollte nie /clear verwenden', value: 'never' },
        ],
        correctAnswer: 'c',
        explanation:
          'In Phase 4 (Kritisch) vergisst Claude Entscheidungen und führt behobene Bugs wieder ein. /clear oder eine neue Session ist die einzige Lösung.',
        hints: ['Ab welcher Phase vergisst Claude Dinge?', 'Es ist in den späteren Phasen'],
      },
      {
        id: 'l19-q3',
        text: 'Welche der 4 Säulen des Context Engineering beschreibt die Nutzung von Subagents?',
        type: 'radio',
        options: [
          { id: 'a', label: 'WRITE', value: 'write' },
          { id: 'b', label: 'SELECT', value: 'select' },
          { id: 'c', label: 'COMPRESS', value: 'compress' },
          { id: 'd', label: 'ISOLATE', value: 'isolate', isCorrect: true },
        ],
        correctAnswer: 'd',
        explanation:
          'ISOLATE bedeutet, Kontext zu separieren. Subagents haben eigene Contexts und verhindern Context Rot im Hauptbereich.',
        hints: ['Subagents haben eigenen Kontext', 'Es geht um Trennung'],
      },
      {
        id: 'l19-q4',
        text: 'Warum sollte CLAUDE.md auf unter 2000 Tokens gehalten werden?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Weil Claude keine größeren Dateien lesen kann', value: 'cant-read' },
          {
            id: 'b',
            label: 'Weil CLAUDE.md bei JEDER Nachricht geladen wird und so den Token-Verbrauch multipliziert',
            value: 'multiply',
            isCorrect: true,
          },
          { id: 'c', label: 'Weil es eine technische Beschränkung gibt', value: 'limit' },
          { id: 'd', label: 'Weil kürzere Dateien schneller geladen werden', value: 'speed' },
        ],
        correctAnswer: 'b',
        explanation:
          '5000 Token CLAUDE.md × 50 Nachrichten = 250.000 Tokens allein für CLAUDE.md! Seltene Informationen sollten in Skills ausgelagert werden.',
        hints: ['CLAUDE.md wird bei jeder Nachricht geladen', 'Denke an Multiplikation'],
      },
      {
        id: 'l19-q5',
        text: 'Was ist der Unterschied zwischen /memory und CLAUDE.md?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: '/memory ist für persönliche, globale Präferenzen; CLAUDE.md ist projekt-spezifisch und team-weit',
            value: 'correct',
            isCorrect: true,
          },
          { id: 'b', label: '/memory ersetzt CLAUDE.md in neueren Versionen', value: 'replaces' },
          { id: 'c', label: 'Es gibt keinen Unterschied', value: 'same' },
          { id: 'd', label: '/memory funktioniert nur im Enterprise Plan', value: 'enterprise' },
        ],
        correctAnswer: 'a',
        explanation:
          '/memory speichert persönliche Präferenzen lokal (~/.claude), während CLAUDE.md im Repository liegt und team-weit geteilt wird.',
        hints: ['Wo werden die Daten gespeichert?', 'Wer kann darauf zugreifen?'],
      },
    ],
  },

  // ========================================
  // LEKTION 20 QUIZ: IDE-Integrationen
  // ========================================
  {
    id: 'l20-quiz-1',
    lessonId: 20,
    title: 'IDE-Integrationen',
    type: 'multiple-choice',
    points: 5,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        id: 'l20-q1',
        text: 'Welches Feature bietet die VS Code Extension, das die CLI NICHT hat?',
        type: 'radio',
        options: [
          { id: 'a', label: 'MCP Server Support', value: 'mcp' },
          {
            id: 'b',
            label: 'Inline Diffs mit Accept/Reject Buttons und Checkpoints/Rewind',
            value: 'diffs',
            isCorrect: true,
          },
          { id: 'c', label: 'Subagents', value: 'subagents' },
          { id: 'd', label: 'Slash Commands', value: 'commands' },
        ],
        correctAnswer: 'b',
        explanation:
          'Die VS Code Extension zeigt Änderungen als visuelle Inline-Diffs mit Accept/Reject und bietet Checkpoints zum Zurückspulen – Features die im Terminal nicht möglich sind.',
        hints: ['Denke an visuelle Features', 'Was kann ein Terminal nicht anzeigen?'],
      },
      {
        id: 'l20-q2',
        text: 'Wofür ist die Chrome Extension besonders nützlich?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Für Backend-Entwicklung', value: 'backend' },
          { id: 'b', label: 'Für Datenbank-Verwaltung', value: 'database' },
          {
            id: 'c',
            label: 'Für visuelles Frontend-Debugging und Browser-Automation',
            value: 'frontend',
            isCorrect: true,
          },
          { id: 'd', label: 'Für Git-Operationen', value: 'git' },
        ],
        correctAnswer: 'c',
        explanation:
          'Die Chrome Extension ermöglicht Claude, Webseiten zu sehen, Screenshots zu machen und Browser-Aktionen auszuführen – ideal für Frontend-Debugging.',
        hints: ['Was kann man in einem Browser besonders gut?', 'Denke an visuelle Überprüfung'],
      },
      {
        id: 'l20-q3',
        text: 'Was sind Git Worktrees und warum sind sie für Claude Code nützlich?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Eine Alternative zu Git Branches', value: 'alternative' },
          {
            id: 'b',
            label: 'Mehrere Branch-Checkouts gleichzeitig – ermöglicht parallele Claude Code Sessions ohne Context-Konflikte',
            value: 'parallel',
            isCorrect: true,
          },
          { id: 'c', label: 'Ein Visualisierungstool für Git-History', value: 'visual' },
          { id: 'd', label: 'Ein Feature der VS Code Extension', value: 'vscode' },
        ],
        correctAnswer: 'b',
        explanation:
          'Git Worktrees erlauben mehrere Branch-Checkouts in separaten Verzeichnissen. So kannst du zwei Claude Code Sessions parallel laufen lassen.',
        hints: ['Es geht um paralleles Arbeiten', 'Separate Verzeichnisse für verschiedene Branches'],
      },
      {
        id: 'l20-q4',
        text: 'Welche Plattform sollte man für CI/CD Automation nutzen?',
        type: 'radio',
        options: [
          { id: 'a', label: 'VS Code Extension', value: 'vscode' },
          { id: 'b', label: 'JetBrains Plugin', value: 'jetbrains' },
          {
            id: 'c',
            label: 'Terminal CLI mit -p Flag (Headless Mode)',
            value: 'cli',
            isCorrect: true,
          },
          { id: 'd', label: 'Chrome Extension', value: 'chrome' },
        ],
        correctAnswer: 'c',
        explanation:
          'Für CI/CD und Automation ist die CLI mit dem -p Flag (Headless Mode) die einzig sinnvolle Option, da sie ohne interaktives Terminal funktioniert.',
        hints: ['CI/CD braucht keine GUI', 'Welche Variante funktioniert ohne Bildschirm?'],
      },
    ],
  },

  // ========================================
  // LEKTION 21 QUIZ: Sandboxing & Security
  // ========================================
  {
    id: 'l21-quiz-1',
    lessonId: 21,
    title: 'Sandboxing & Security',
    type: 'multiple-choice',
    points: 5,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        id: 'l21-q1',
        text: 'Um wie viel Prozent reduziert Sandboxing laut Anthropic die Permission-Prompts?',
        type: 'radio',
        options: [
          { id: 'a', label: '25%', value: '25' },
          { id: 'b', label: '50%', value: '50' },
          { id: 'c', label: '84%', value: '84', isCorrect: true },
          { id: 'd', label: '100%', value: '100' },
        ],
        correctAnswer: 'c',
        explanation:
          'Anthropic berichtet, dass Sandboxing Permission-Prompts um 84% reduziert – Claude arbeitet frei innerhalb sicherer OS-Level Grenzen.',
        hints: ['Es ist mehr als die Hälfte', 'Anthropic nennt eine spezifische Zahl'],
      },
      {
        id: 'l21-q2',
        text: 'Was ist "Approval Fatigue" und warum ist es gefährlich?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Wenn der API Key abläuft', value: 'expired' },
          {
            id: 'b',
            label: 'Wenn man nach zu vielen Permission-Prompts aufhört zu lesen was man genehmigt',
            value: 'fatigue',
            isCorrect: true,
          },
          { id: 'c', label: 'Wenn Claude müde wird', value: 'claude-tired' },
          { id: 'd', label: 'Wenn der Sandbox-Modus deaktiviert ist', value: 'sandbox-off' },
        ],
        correctAnswer: 'b',
        explanation:
          'Approval Fatigue entsteht wenn man so oft "Approve" klickt, dass man nicht mehr liest was genehmigt wird. Das ist gefährlicher als kein Permission-System!',
        hints: ['Es geht um menschliches Verhalten', 'Zu viele Klicks führen zu...'],
      },
      {
        id: 'l21-q3',
        text: 'Welche OS-Level Technologie nutzt Claude Code für Sandboxing auf macOS?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Docker Container', value: 'docker' },
          { id: 'b', label: 'Seatbelt/sandbox-exec', value: 'seatbelt', isCorrect: true },
          { id: 'c', label: 'SELinux', value: 'selinux' },
          { id: 'd', label: 'chroot', value: 'chroot' },
        ],
        correctAnswer: 'b',
        explanation:
          'Auf macOS nutzt Claude Code Seatbelt/sandbox-exec, auf Linux Landlock LSM für OS-Level Filesystem- und Netzwerk-Isolation.',
        hints: ['Es ist ein macOS-spezifisches Feature', 'Apple\'s Sandbox-Technologie'],
      },
      {
        id: 'l21-q4',
        text: 'Was passiert wenn Claude im Sandbox-Modus versucht ~/.ssh/id_rsa zu lesen?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Claude liest die Datei normal', value: 'reads' },
          { id: 'b', label: 'Claude Code stürzt ab', value: 'crash' },
          {
            id: 'c',
            label: 'Der Befehl wird still blockiert und Claude erhält eine Fehlermeldung',
            value: 'blocked',
            isCorrect: true,
          },
          { id: 'd', label: 'Der Nutzer wird um Erlaubnis gefragt', value: 'permission' },
        ],
        correctAnswer: 'c',
        explanation:
          'Im Sandbox-Modus wird der Zugriff auf Dateien außerhalb des Projekts still blockiert. Claude erhält eine Fehlermeldung und versucht einen alternativen Ansatz.',
        hints: ['Es ist kein Crash', 'Die Sandbox greift ein'],
      },
      {
        id: 'l21-q5',
        text: 'Wann ist --dangerously-skip-permissions akzeptabel?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Im Produktiv-Betrieb für Geschwindigkeit', value: 'production' },
          { id: 'b', label: 'Auf Shared-Maschinen im Team', value: 'shared' },
          {
            id: 'c',
            label: 'Nur in VMs/Containern für Wegwerf-Prototypen ohne sensible Daten',
            value: 'vm-only',
            isCorrect: true,
          },
          { id: 'd', label: 'Es ist immer sicher zu verwenden', value: 'always' },
        ],
        correctAnswer: 'c',
        explanation:
          '--dangerously-skip-permissions sollte NIEMALS auf Maschinen mit .env, SSH Keys oder sensiblen Daten verwendet werden. Nur in isolierten VMs/Containern für Prototypen!',
        hints: ['Der Name enthält "dangerously"', 'Nur in sicherer, isolierter Umgebung'],
      },
    ],
  },

  // ========================================
  // LEKTION 22 QUIZ: CI/CD & Headless Mode
  // ========================================
  {
    id: 'l22-quiz-1',
    lessonId: 22,
    title: 'CI/CD & Headless Mode',
    type: 'multiple-choice',
    points: 5,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        id: 'l22-q1',
        text: 'Welcher Flag aktiviert den Headless Mode von Claude Code?',
        type: 'radio',
        options: [
          { id: 'a', label: '--headless', value: 'headless' },
          { id: 'b', label: '-p oder --print', value: 'print', isCorrect: true },
          { id: 'c', label: '--ci', value: 'ci' },
          { id: 'd', label: '--non-interactive', value: 'non-interactive' },
        ],
        correctAnswer: 'b',
        explanation:
          'Der -p (oder --print) Flag aktiviert den Headless Mode: Claude liest den Prompt, führt die Aufgabe aus und gibt das Ergebnis auf stdout aus.',
        hints: ['Es ist ein kurzer Flag', 'Denke an "print"'],
      },
      {
        id: 'l22-q2',
        text: 'Warum ist --max-turns in CI/CD Pipelines wichtig?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Es macht Claude schneller', value: 'faster' },
          {
            id: 'b',
            label: 'Es verhindert Endlosschleifen und unkontrollierte Kosten',
            value: 'limits',
            isCorrect: true,
          },
          { id: 'c', label: 'Es ist eine Pflicht-Einstellung', value: 'required' },
          { id: 'd', label: 'Es verbessert die Code-Qualität', value: 'quality' },
        ],
        correctAnswer: 'b',
        explanation:
          '--max-turns begrenzt die Anzahl der Aktionsschritte und verhindert so Endlosschleifen und Kostenexplosionen in automatisierten Pipelines.',
        hints: ['Denke an Sicherheit und Budget', 'Was passiert ohne Begrenzung?'],
      },
      {
        id: 'l22-q3',
        text: 'Welches Output-Format ist am besten für die maschinelle Verarbeitung in Scripts?',
        type: 'radio',
        options: [
          { id: 'a', label: '--output-format text', value: 'text' },
          { id: 'b', label: '--output-format json', value: 'json', isCorrect: true },
          { id: 'c', label: '--output-format markdown', value: 'markdown' },
          { id: 'd', label: '--output-format xml', value: 'xml' },
        ],
        correctAnswer: 'b',
        explanation:
          'JSON Output (--output-format json) kann mit Tools wie jq strukturiert verarbeitet werden und enthält neben dem Ergebnis auch Kosten- und Metadaten.',
        hints: ['Welches Format ist am einfachsten maschinell zu parsen?', 'Denke an jq'],
      },
      {
        id: 'l22-q4',
        text: 'Was ist die wichtigste Sicherheitsregel für API Keys in CI/CD?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Den Key in der YAML-Datei speichern', value: 'yaml' },
          { id: 'b', label: 'Den Key in CLAUDE.md schreiben', value: 'claudemd' },
          {
            id: 'c',
            label: 'Den Key als Environment Secret (z.B. GitHub Secrets) speichern',
            value: 'secret',
            isCorrect: true,
          },
          { id: 'd', label: 'Den Key als Base64-encodiert im Code speichern', value: 'base64' },
        ],
        correctAnswer: 'c',
        explanation:
          'API Keys dürfen NIE im Code oder in Konfigurationsdateien stehen. Immer als Environment Secrets (GitHub Secrets, GitLab CI Variables) speichern!',
        hints: ['Nie im Code', 'Die Plattform bietet dafür eigene Mechanismen'],
      },
      {
        id: 'l22-q5',
        text: 'Welches Modell sollte man für einfache Lint-Fixes in der CI/CD Pipeline wählen?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Opus (das beste Modell)', value: 'opus' },
          { id: 'b', label: 'Sonnet (Standard)', value: 'sonnet' },
          { id: 'c', label: 'Haiku (günstigstes Modell)', value: 'haiku', isCorrect: true },
          { id: 'd', label: 'Das Modell spielt keine Rolle', value: 'any' },
        ],
        correctAnswer: 'c',
        explanation:
          'Für einfache Tasks wie Lint-Fixes ist Haiku ($0.80/1M Input) die kosteneffizienteste Wahl. Opus sollte nur für komplexe Architektur-Tasks verwendet werden.',
        hints: ['Einfache Tasks brauchen kein teures Modell', 'Kosten-Effizienz zählt in CI/CD'],
      },
    ],
  },

  // ========================================
  // LEKTION 23 QUIZ: Kosten-Optimierung
  // ========================================
  {
    id: 'l23-quiz-1',
    lessonId: 23,
    title: 'Kosten-Optimierung Profi',
    type: 'multiple-choice',
    points: 5,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        id: 'l23-q1',
        text: 'Wie viel kann Prompt Caching bei den Input-Kosten einsparen?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Bis zu 10%', value: '10' },
          { id: 'b', label: 'Bis zu 50%', value: '50' },
          { id: 'c', label: 'Bis zu 90%', value: '90', isCorrect: true },
          { id: 'd', label: 'Prompt Caching spart keine Kosten', value: '0' },
        ],
        correctAnswer: 'c',
        explanation:
          'Prompt Caching kann Input-Kosten um bis zu 90% reduzieren: Sonnet cached kostet nur $0.30/1M statt $3.00/1M Input Tokens.',
        hints: ['Es ist eine massive Ersparnis', 'Denke an zweistellige Prozente'],
      },
      {
        id: 'l23-q2',
        text: 'Was ist der größte versteckte Kostentreiber bei Claude Code?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Eine zu große CLAUDE.md die bei JEDER Nachricht geladen wird',
            value: 'claudemd',
            isCorrect: true,
          },
          { id: 'b', label: 'Die Anzahl der Dateien im Projekt', value: 'files' },
          { id: 'c', label: 'Die Programmiersprache', value: 'language' },
          { id: 'd', label: 'Die Tageszeit der Nutzung', value: 'time' },
        ],
        correctAnswer: 'a',
        explanation:
          'Eine 5000-Token CLAUDE.md × 50 Nachrichten = 250.000 Tokens allein für CLAUDE.md! Seltene Infos sollten in Skills ausgelagert werden.',
        hints: ['Was wird bei JEDER Nachricht geladen?', 'Multiplikationseffekt beachten'],
      },
      {
        id: 'l23-q3',
        text: 'Welche Strategie spart am meisten Kosten bei Subagents?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Alle Subagents mit Opus laufen lassen', value: 'opus' },
          {
            id: 'b',
            label: 'Hauptsession mit Sonnet, Subagents mit Haiku für Routine-Tasks',
            value: 'mixed',
            isCorrect: true,
          },
          { id: 'c', label: 'Keine Subagents verwenden', value: 'none' },
          { id: 'd', label: 'Alle Subagents mit dem gleichen Modell', value: 'same' },
        ],
        correctAnswer: 'b',
        explanation:
          'Die gemischte Strategie (Sonnet für Planung, Haiku für Ausführung) kann bis zu 63% Kosten sparen verglichen mit einer reinen Sonnet-Session.',
        hints: ['Verschiedene Tasks brauchen verschiedene Modelle', 'Routine-Tasks sind einfacher'],
      },
      {
        id: 'l23-q4',
        text: 'Welcher Befehl zeigt die aktuellen Session-Kosten an?',
        type: 'radio',
        options: [
          { id: 'a', label: '/price', value: 'price' },
          { id: 'b', label: '/cost', value: 'cost', isCorrect: true },
          { id: 'c', label: '/budget', value: 'budget' },
          { id: 'd', label: '/tokens', value: 'tokens' },
        ],
        correctAnswer: 'b',
        explanation:
          '/cost zeigt Input-Tokens, Output-Tokens, Cache-Statistiken, Gesamtkosten und Context-Usage der aktuellen Session.',
        hints: ['Einfacher, direkter Befehl', 'Englisches Wort für "Kosten"'],
      },
      {
        id: 'l23-q5',
        text: 'Warum können Hooks Kosten sparen?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Hooks sind komplett kostenlos', value: 'free' },
          {
            id: 'b',
            label: 'Hooks führen Shell-Befehle OHNE Claude Token-Verbrauch aus',
            value: 'no-tokens',
            isCorrect: true,
          },
          { id: 'c', label: 'Hooks nutzen automatisch Haiku', value: 'haiku' },
          { id: 'd', label: 'Hooks komprimieren den Context', value: 'compress' },
        ],
        correctAnswer: 'b',
        explanation:
          'Hooks sind Shell-Befehle die bei Events ausgelöst werden – sie laufen lokal ohne Claude API Aufrufe und verbrauchen daher keine Tokens.',
        hints: ['Hooks sind Shell-Befehle', 'Was kostet lokal ausgeführter Code?'],
      },
    ],
  },

  // ========================================
  // LEKTION 24 QUIZ: Claude Agent SDK
  // ========================================
  {
    id: 'l24-quiz-1',
    lessonId: 24,
    title: 'Claude Agent SDK',
    type: 'multiple-choice',
    points: 5,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        id: 'l24-q1',
        text: 'Was ist das Verhältnis zwischen Claude Code und dem Agent SDK?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Es sind zwei komplett verschiedene Produkte', value: 'different' },
          {
            id: 'b',
            label: 'Das Agent SDK ist die Engine hinter Claude Code – jetzt als Library verfügbar',
            value: 'engine',
            isCorrect: true,
          },
          { id: 'c', label: 'Claude Code ist nur ein Wrapper um das SDK', value: 'wrapper' },
          { id: 'd', label: 'Das SDK ist veraltet, Claude Code ersetzt es', value: 'deprecated' },
        ],
        correctAnswer: 'b',
        explanation:
          'Das Agent SDK ist die gleiche Engine die Claude Code antreibt, jetzt als Python/TypeScript Library für eigene Agent-Entwicklung verfügbar.',
        hints: ['Denke an Auto und Motor', 'Gleiche Technologie, verschiedene Verpackung'],
      },
      {
        id: 'l24-q2',
        text: 'In welchen Programmiersprachen ist das Agent SDK verfügbar?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Nur Python', value: 'python-only' },
          { id: 'b', label: 'Python und TypeScript', value: 'both', isCorrect: true },
          { id: 'c', label: 'Nur JavaScript', value: 'js-only' },
          { id: 'd', label: 'Java und C#', value: 'java-csharp' },
        ],
        correctAnswer: 'b',
        explanation:
          'Das Claude Agent SDK ist offiziell als Python-Paket (claude-agent-sdk) und TypeScript-Paket (@anthropic-ai/agent-sdk) verfügbar.',
        hints: ['Zwei der populärsten Sprachen', 'Für Backend und Frontend Entwickler'],
      },
      {
        id: 'l24-q3',
        text: 'Welche IDE integrierte im Februar 2026 das Claude Agent SDK nativ?',
        type: 'radio',
        options: [
          { id: 'a', label: 'VS Code', value: 'vscode' },
          { id: 'b', label: 'IntelliJ IDEA', value: 'intellij' },
          { id: 'c', label: 'Apple Xcode 26.3', value: 'xcode', isCorrect: true },
          { id: 'd', label: 'Android Studio', value: 'android-studio' },
        ],
        correctAnswer: 'c',
        explanation:
          'Apple integrierte das Claude Agent SDK nativ in Xcode 26.3, inklusive Subagents, Background Tasks und visueller Vorschau-Iteration.',
        hints: ['Es ist eine Apple IDE', 'Angekündigt im Februar 2026'],
      },
      {
        id: 'l24-q4',
        text: 'Was ist der Vorteil von Subagents im Agent SDK?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Sie sind billiger als der Hauptagent', value: 'cheaper' },
          {
            id: 'b',
            label: 'Sie laufen parallel mit eigenen Contexts und können verschiedene Modelle nutzen',
            value: 'parallel',
            isCorrect: true,
          },
          { id: 'c', label: 'Sie brauchen keine API Keys', value: 'no-keys' },
          { id: 'd', label: 'Sie ersetzen MCP Server', value: 'replace-mcp' },
        ],
        correctAnswer: 'b',
        explanation:
          'Subagents im SDK laufen parallel mit isolierten Contexts. Ein Security-Reviewer kann Sonnet nutzen während ein Test-Writer mit günstigerem Haiku läuft.',
        hints: ['Parallele Ausführung ist ein Schlüssel-Feature', 'Verschiedene Modelle möglich'],
      },
    ],
  },

  // ========================================
  // LEKTION 25 QUIZ: Plugins & Marketplace
  // ========================================
  {
    id: 'l25-quiz-1',
    lessonId: 25,
    title: 'Plugins & Marketplace',
    type: 'multiple-choice',
    points: 5,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        id: 'l25-q1',
        text: 'Was unterscheidet Plugins von Skills?',
        type: 'radio',
        options: [
          {
            id: 'a',
            label: 'Plugins greifen tief in Claude Code\'s Processing ein, Skills sind nur Markdown-Anweisungen',
            value: 'deep',
            isCorrect: true,
          },
          { id: 'b', label: 'Es gibt keinen Unterschied', value: 'same' },
          { id: 'c', label: 'Skills sind neuer als Plugins', value: 'newer' },
          { id: 'd', label: 'Plugins funktionieren nur in VS Code', value: 'vscode-only' },
        ],
        correctAnswer: 'a',
        explanation:
          'Plugins sind erweiterbare Module die in Claude Code\'s Verarbeitung eingreifen können (z.B. Code Intelligence). Skills sind Markdown-Anweisungen die Claude liest.',
        hints: ['Denke an die Tiefe der Integration', 'Eins ist Code, das andere Text'],
      },
      {
        id: 'l25-q2',
        text: 'Wie installiert man ein Plugin aus dem Marketplace?',
        type: 'radio',
        options: [
          { id: 'a', label: 'npm install plugin-name', value: 'npm' },
          { id: 'b', label: 'claude plugin install @author/name', value: 'claude-plugin', isCorrect: true },
          { id: 'c', label: 'Man kopiert es in .claude/plugins/', value: 'copy' },
          { id: 'd', label: 'Über die Webseite claude.ai', value: 'website' },
        ],
        correctAnswer: 'b',
        explanation:
          'Plugins werden mit dem Befehl "claude plugin install @author/name" aus dem Marketplace installiert und verwaltet.',
        hints: ['Es ist ein Claude CLI Befehl', 'Ähnlich wie npm aber für Claude Plugins'],
      },
      {
        id: 'l25-q3',
        text: 'Warum können Code Intelligence Plugins Token-Kosten reduzieren?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Sie komprimieren den Code automatisch', value: 'compress' },
          {
            id: 'b',
            label: 'Sie geben Claude besseres Sprachverständnis, sodass weniger Exploration nötig ist',
            value: 'understanding',
            isCorrect: true,
          },
          { id: 'c', label: 'Sie nutzen ein günstigeres Modell', value: 'cheaper-model' },
          { id: 'd', label: 'Sie cachen die Antworten lokal', value: 'cache' },
        ],
        correctAnswer: 'b',
        explanation:
          'Code Intelligence Plugins verbessern Claude\'s Verständnis der Sprache (z.B. TypeScript Typen), sodass weniger Dateien gelesen und weniger Tokens verbraucht werden.',
        hints: ['Besseres Verständnis = weniger Exploration', 'Weniger Fragen = weniger Tokens'],
      },
      {
        id: 'l25-q4',
        text: 'Was braucht man um ein Plugin im Marketplace zu veröffentlichen?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Nur den Code hochladen', value: 'code-only' },
          {
            id: 'b',
            label: 'Anthropic Developer Account, README, LICENSE und Tests – plus Review durch Anthropic',
            value: 'full-review',
            isCorrect: true,
          },
          { id: 'c', label: 'Eine Email an Anthropic', value: 'email' },
          { id: 'd', label: 'Enterprise Plan', value: 'enterprise' },
        ],
        correctAnswer: 'b',
        explanation:
          'Plugins durchlaufen einen Review-Prozess. Man braucht einen Developer Account, Dokumentation (README, LICENSE), Tests und Anthropic reviewt vor der Veröffentlichung.',
        hints: ['Es gibt einen Review-Prozess', 'Ähnlich wie bei App Stores'],
      },
    ],
  },

  // ========================================
  // LEKTION 26 QUIZ: Real-World Workflows
  // ========================================
  {
    id: 'l26-quiz-1',
    lessonId: 26,
    title: 'Real-World Workflow Patterns',
    type: 'multiple-choice',
    points: 5,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        id: 'l26-q1',
        text: 'Was ist der wichtigste Grundsatz beim Spec-Driven Development?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Möglichst schnell anfangen zu coden', value: 'fast' },
          {
            id: 'b',
            label: 'Erst eine detaillierte Spezifikation schreiben, BEVOR Claude implementiert',
            value: 'spec-first',
            isCorrect: true,
          },
          { id: 'c', label: 'Claude die Spec schreiben lassen', value: 'claude-spec' },
          { id: 'd', label: 'Tests sind optional', value: 'no-tests' },
        ],
        correctAnswer: 'b',
        explanation:
          'Bei Spec-Driven Development schreibst DU zuerst die Spezifikation. Claude\'s Output ist nur so gut wie dein Input – deshalb Spec ZUERST.',
        hints: ['Wer schreibt die Spec?', '"Output ist nur so gut wie der Input"'],
      },
      {
        id: 'l26-q2',
        text: 'Was ist die korrekte Reihenfolge bei Anthropic\'s empfohlenem Workflow?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Code → Plan → Explore', value: 'code-first' },
          { id: 'b', label: 'Plan → Code → Explore', value: 'plan-first' },
          { id: 'c', label: 'Explore → Plan → Code', value: 'explore-first', isCorrect: true },
          { id: 'd', label: 'Code → Explore → Plan', value: 'mixed' },
        ],
        correctAnswer: 'c',
        explanation:
          'Anthropics offiziell empfohlener Workflow: Erst Explore (verstehen), dann Plan (planen), dann Code (umsetzen). Nie direkt drauflos coden!',
        hints: ['Erst verstehen, dann handeln', 'Die logische Reihenfolge'],
      },
      {
        id: 'l26-q3',
        text: 'Wann ist Vibe Coding eine gute Wahl?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Für Produktiv-Code in Teams', value: 'production' },
          { id: 'b', label: 'Für sicherheitskritische Features', value: 'security' },
          {
            id: 'c',
            label: 'Für Prototypen, Hackathons und persönliche Tools',
            value: 'prototypes',
            isCorrect: true,
          },
          { id: 'd', label: 'Für langlebige Enterprise-Projekte', value: 'enterprise' },
        ],
        correctAnswer: 'c',
        explanation:
          'Vibe Coding ist der schnellste Weg zum Ergebnis, aber die Code-Qualität leidet. Daher nur für Prototypen, Demos, Hackathons und persönliche Tools.',
        hints: ['Schnelligkeit hat einen Preis', 'Wo ist Code-Qualität weniger wichtig?'],
      },
      {
        id: 'l26-q4',
        text: 'Was ist die "Ask User Question" Methode?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Wenn der User Claude Fragen stellt', value: 'user-asks' },
          {
            id: 'b',
            label: 'Claude soll DICH zuerst nach Präferenzen fragen, BEVOR es implementiert',
            value: 'claude-asks',
            isCorrect: true,
          },
          { id: 'c', label: 'Ein Quiz-Format für Lernzwecke', value: 'quiz' },
          { id: 'd', label: 'Eine Feedback-Methode nach der Implementierung', value: 'feedback' },
        ],
        correctAnswer: 'b',
        explanation:
          'Bei der "Ask User Question" Methode weist du Claude an, dich erst nach Präferenzen (UI, Farben, Libraries, etc.) zu fragen, bevor es mit der Implementierung beginnt.',
        hints: ['Claude fragt, du antwortest', 'Es geht um Klarheit vor der Implementierung'],
      },
      {
        id: 'l26-q5',
        text: 'Welcher Workflow hat die höchste Code-Qualität laut dem Vergleich?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Vibe Coding (5 Sterne)', value: 'vibe' },
          { id: 'b', label: 'Spec-Driven Development (5 Sterne)', value: 'spec', isCorrect: true },
          { id: 'c', label: 'Explore → Plan → Code (5 Sterne)', value: 'explore' },
          { id: 'd', label: 'Alle sind gleich gut', value: 'equal' },
        ],
        correctAnswer: 'b',
        explanation:
          'Spec-Driven Development erreicht die höchste Code-Qualität (5 Sterne) weil die Anforderungen vor der Implementierung klar definiert sind. Explore-Plan-Code kommt mit 4 Sternen danach.',
        hints: ['Klare Anforderungen = Besserer Code', 'Upfront-Aufwand zahlt sich aus'],
      },
    ],
  },

  // ========================================
  // LEKTION 27: Fast Mode & Opus 4.6
  // ========================================
  {
    id: 'l27-quiz-1',
    lessonId: 27,
    title: 'Fast Mode & Opus 4.6',
    type: 'multiple-choice',
    points: 5,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        id: 'l27-q1',
        text: 'Mit welchem Modell ist Fast Mode verfügbar?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Claude Sonnet 4', value: 'sonnet' },
          { id: 'b', label: 'Claude Haiku', value: 'haiku' },
          { id: 'c', label: 'Claude Opus 4.6', value: 'opus46', isCorrect: true },
          { id: 'd', label: 'Allen Modellen', value: 'all' },
        ],
        correctAnswer: 'c',
        explanation: 'Fast Mode ist nur für Claude Opus 4.6 verfügbar und ermöglicht bis zu 2,5x schnellere Token-Generierung.',
        hints: ['Es ist das neueste Top-Modell', 'Opus 4.6'],
      },
      {
        id: 'l27-q2',
        text: 'Wie aktivierst du Fast Mode in einer laufenden Sitzung?',
        type: 'radio',
        options: [
          { id: 'a', label: '/speed', value: 'speed' },
          { id: 'b', label: '/fast', value: 'fast', isCorrect: true },
          { id: 'c', label: '--fast beim Start', value: 'flag' },
          { id: 'd', label: 'In den Einstellungen unter "Performance"', value: 'settings' },
        ],
        correctAnswer: 'b',
        explanation: 'In der Sitzung schaltest du Fast Mode mit dem Slash-Command /fast ein bzw. aus.',
        hints: ['Slash-Command', 'Englisch für "schnell"'],
      },
      {
        id: 'l27-q3',
        text: 'Was gilt für Fast Mode in Bezug auf Kosten?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Kosten sind niedriger als im Standard-Modus', value: 'cheaper' },
          { id: 'b', label: 'Kosten sind höher (Premium-Preise) bei schnellerer Ausgabe', value: 'premium', isCorrect: true },
          { id: 'c', label: 'Kosten sind identisch', value: 'same' },
          { id: 'd', label: 'Fast Mode ist kostenlos', value: 'free' },
        ],
        correctAnswer: 'b',
        explanation: 'Fast Mode bietet schnellere Ausgabe, wird aber zu Premium-Preisen abgerechnet.',
        hints: ['Premium', 'Geschwindigkeit hat einen Preis'],
      },
    ],
  },

  // ========================================
  // LEKTION 28: Agent Teams & Checkpointing
  // ========================================
  {
    id: 'l28-quiz-1',
    lessonId: 28,
    title: 'Agent Teams & Checkpointing',
    type: 'multiple-choice',
    points: 5,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        id: 'l28-q1',
        text: 'Wie aktivierst du Agent Teams (experimentell)?',
        type: 'radio',
        options: [
          { id: 'a', label: '/agent-teams in der Sitzung', value: 'slash' },
          { id: 'b', label: 'Umgebungsvariable CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1', value: 'env', isCorrect: true },
          { id: 'c', label: 'In settings.json unter "teams"', value: 'settings' },
          { id: 'd', label: 'Agent Teams sind bereits standardmäßig aktiv', value: 'default' },
        ],
        correctAnswer: 'b',
        explanation: 'Agent Teams werden über die Umgebungsvariable CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 aktiviert.',
        hints: ['Experimentell', 'Umgebungsvariable'],
      },
      {
        id: 'l28-q2',
        text: 'Was ermöglicht Checkpointing?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Nur die Konversation zu speichern', value: 'chat-only' },
          { id: 'b', label: 'Konversation und Datei-Änderungen zu einem früheren Stand zurückzusetzen', value: 'both', isCorrect: true },
          { id: 'c', label: 'Nur Dateien zu sichern', value: 'files-only' },
          { id: 'd', label: 'Automatische Backups in die Cloud', value: 'cloud' },
        ],
        correctAnswer: 'b',
        explanation: 'Checkpointing speichert Konversations- und Dateizustand; mit /rewind kannst du beides auf einen früheren Punkt zurücksetzen.',
        hints: ['Konversation UND Code', 'Zurückspulen'],
      },
      {
        id: 'l28-q3',
        text: 'Welcher Befehl hilft, zu einem früheren Zustand (Konversation + Änderungen) zurückzugehen?',
        type: 'radio',
        options: [
          { id: 'a', label: '/clear', value: 'clear' },
          { id: 'b', label: '/rewind', value: 'rewind', isCorrect: true },
          { id: 'c', label: '/undo', value: 'undo' },
          { id: 'd', label: '/reset', value: 'reset' },
        ],
        correctAnswer: 'b',
        explanation: '/rewind spult Konversation und zugehörige Code-Änderungen auf einen früheren Checkpoint zurück.',
        hints: ['Zurückspulen', 'Checkpoints'],
      },
    ],
  },

  // ========================================
  // LEKTION 29: Claude Code überall & Ressourcen
  // ========================================
  {
    id: 'l29-quiz-1',
    lessonId: 29,
    title: 'Claude Code überall & offizielle Ressourcen',
    type: 'multiple-choice',
    points: 5,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        id: 'l29-q1',
        text: 'Wo ist die offizielle, zentrale Dokumentation für Claude Code?',
        type: 'radio',
        options: [
          { id: 'a', label: 'docs.anthropic.com', value: 'anthropic' },
          { id: 'b', label: 'code.claude.com', value: 'codeclaude', isCorrect: true },
          { id: 'c', label: 'claude.ai/docs', value: 'claudeai' },
          { id: 'd', label: 'github.com/anthropics/claude-code', value: 'github' },
        ],
        correctAnswer: 'b',
        explanation: 'Die offizielle Claude-Code-Dokumentation liegt unter code.claude.com (inkl. DE-Übersicht unter docs/de/overview).',
        hints: ['code.claude.com', 'Offizielle Docs'],
      },
      {
        id: 'l29-q2',
        text: 'Welche Nutzungsorte für Claude Code gibt es?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Nur Terminal', value: 'terminal-only' },
          { id: 'b', label: 'Terminal, Web (claude.ai/code), Desktop, Chrome, VS Code, JetBrains, Slack, CI/CD', value: 'all', isCorrect: true },
          { id: 'c', label: 'Nur Terminal und VS Code', value: 'two' },
          { id: 'd', label: 'Nur im Browser', value: 'browser-only' },
        ],
        correctAnswer: 'b',
        explanation: 'Claude Code ist an vielen Stellen nutzbar: Terminal, Web, Desktop-App, Chrome-Extension, VS Code, JetBrains, GitHub Actions, GitLab CI/CD, Slack.',
        hints: ['Überall', 'CLI, Web, IDE, Slack'],
      },
      {
        id: 'l29-q3',
        text: 'Wo findest du den vollständigen Index aller Dokumentationsseiten (z.B. für Automatisierung)?',
        type: 'radio',
        options: [
          { id: 'a', label: 'In der README auf GitHub', value: 'readme' },
          { id: 'b', label: 'https://code.claude.com/docs/llms.txt', value: 'llms', isCorrect: true },
          { id: 'c', label: 'Nur in der Web-UI unter "Docs"', value: 'webui' },
          { id: 'd', label: 'Es gibt keinen zentralen Index', value: 'none' },
        ],
        correctAnswer: 'b',
        explanation: 'Der Dokumentations-Index für alle Seiten ist unter https://code.claude.com/docs/llms.txt abrufbar.',
        hints: ['llms.txt', 'Index aller Docs'],
      },
    ],
  },
  // ========================================
  // LEKTION 32 QUIZ: Agentic Coding Trends 2026
  // ========================================
  {
    id: 'l32-quiz-1',
    lessonId: 32,
    title: 'Agentic Coding Trends 2026',
    type: 'multiple-choice',
    points: 5,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'l32-q1',
        text: 'Wie viele autonome Aktionen führen AI-Coding-Agents laut Anthropic Report 2026 durchschnittlich pro Session aus?',
        type: 'radio',
        options: [
          { id: 'a', label: '5 Aktionen', value: '5' },
          { id: 'b', label: '10 Aktionen', value: '10' },
          { id: 'c', label: '20 Aktionen', value: '20', isCorrect: true },
          { id: 'd', label: '50 Aktionen', value: '50' },
        ],
        correctAnswer: 'c',
        explanation: 'AI-Coding-Agents führen jetzt durchschnittlich 20 autonome Aktionen pro Session aus — doppelt so viel wie vor 6 Monaten.',
        hints: ['Der Report sagt "doppelt so viel wie vor 6 Monaten"', 'Es ist eine mittlere zweistellige Zahl'],
      },
      {
        id: 'l32-q2',
        text: 'Wie hoch ist der Anstieg bei Multi-Agent-Anfragen laut Gartner (Q1/2024 bis Q2/2025)?',
        type: 'radio',
        options: [
          { id: 'a', label: '145%', value: '145' },
          { id: 'b', label: '445%', value: '445' },
          { id: 'c', label: '1.445%', value: '1445', isCorrect: true },
          { id: 'd', label: '14.450%', value: '14450' },
        ],
        correctAnswer: 'c',
        explanation: 'Gartner meldet einen 1.445% Anstieg bei Multi-Agent-Anfragen von Q1/2024 bis Q2/2025 — ein klares Signal dass Multi-Agent zum Standard wird.',
        hints: ['Es ist eine vierstellige Prozentzahl', 'Multi-Agent ist der am schnellsten wachsende Trend'],
      },
      {
        id: 'l32-q3',
        text: 'Welche neue Output-Limit hat Claude Opus 4.6 als Default seit März 2026?',
        type: 'radio',
        options: [
          { id: 'a', label: '16K Tokens', value: '16k' },
          { id: 'b', label: '32K Tokens', value: '32k' },
          { id: 'c', label: '64K Tokens', value: '64k', isCorrect: true },
          { id: 'd', label: '128K Tokens', value: '128k' },
        ],
        correctAnswer: 'c',
        explanation: 'Opus 4.6 hat jetzt 64K Tokens als Default-Output (vorher niedriger). Bis zu 128K sind möglich — sowohl für Opus als auch für Sonnet.',
        hints: ['128K ist das Maximum, nicht der Default', 'Es wurde von einem niedrigeren Wert erhöht'],
      },
      {
        id: 'l32-q4',
        text: 'Welchen Anteil der Enterprise-AI-Erstkaeufe gewinnt Anthropic laut Ramp-Daten (März 2026)?',
        type: 'radio',
        options: [
          { id: 'a', label: '46%', value: '46' },
          { id: 'b', label: '58%', value: '58' },
          { id: 'c', label: '73%', value: '73', isCorrect: true },
          { id: 'd', label: '85%', value: '85' },
        ],
        correctAnswer: 'c',
        explanation: 'Laut Ramp-Daten gewinnt Anthropic 73% aller Erstkaeufe bei Unternehmen, die zum ersten Mal AI-Tools kaufen.',
        hints: ['46% ist der "Most Loved" Wert', '85% ist die allgemeine Developer Adoption'],
      },
      {
        id: 'l32-q5',
        text: 'Was ist der erste Schritt im Plan-First Development Workflow?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Tests schreiben', value: 'tests' },
          { id: 'b', label: 'Einen Plan anfordern — explizit KEINEN Code', value: 'plan', isCorrect: true },
          { id: 'c', label: 'Die CLAUDE.md aktualisieren', value: 'claudemd' },
          { id: 'd', label: 'Das Modell auf Opus wechseln', value: 'model' },
        ],
        correctAnswer: 'b',
        explanation: 'Der erste Schritt ist: Einen Plan anfordern und explizit sagen "Schreibe KEINEN Code". Erst nach Review und Genehmigung des Plans wird implementiert.',
        hints: ['Plan-First bedeutet: Erst planen, dann implementieren', 'Explizit Code-Generierung verbieten im ersten Schritt'],
      },
    ],
  },
  // ========================================
  // LEKTION 33 QUIZ — Computer Use
  // ========================================
  {
    id: 'l33-quiz-1',
    lessonId: 33,
    title: 'Computer Use Grundlagen',
    type: 'multiple-choice',
    points: 100,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'l33-q1',
        text: 'Wie funktioniert der Computer Use Vision-Loop?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Claude liest den Quellcode der App direkt aus', value: 'source' },
          { id: 'b', label: 'Screenshot → Analyse → Aktion → Screenshot (Loop)', value: 'loop', isCorrect: true },
          { id: 'c', label: 'Claude nutzt eine API um Apps zu steuern', value: 'api' },
          { id: 'd', label: 'Der User beschreibt den Bildschirminhalt manuell', value: 'manual' },
        ],
        correctAnswer: 'b',
        explanation: 'Computer Use funktioniert über einen kontinuierlichen Loop: Claude macht einen Screenshot, analysiert ihn mit Vision, führt eine Aktion aus (Maus/Tastatur) und macht dann einen neuen Screenshot um das Ergebnis zu prüfen.',
        hints: ['Denke an den Zyklus aus Sehen und Handeln', 'Claude nutzt seine Vision-Fähigkeiten'],
      },
      {
        id: 'l33-q2',
        text: 'Welche Prioritäts-Reihenfolge nutzt Claude bei Tool-Auswahl?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Computer Use → MCP → Connectors', value: 'cu-first' },
          { id: 'b', label: 'Bash → Computer Use → MCP', value: 'bash-first' },
          { id: 'c', label: 'Connectors → MCP → Computer Use', value: 'connectors-first', isCorrect: true },
          { id: 'd', label: 'Alle gleichzeitig', value: 'all' },
        ],
        correctAnswer: 'c',
        explanation: 'Claude priorisiert immer die präziseste Methode: Direkte Connectors (z.B. Slack, Calendar) zuerst, dann MCP-Server für strukturierte Aufrufe, und Computer Use nur als Fallback wenn kein anderer Weg verfügbar ist.',
        hints: ['Claude nutzt Computer Use nur wenn nötig', 'Präzisere Tools werden bevorzugt'],
      },
      {
        id: 'l33-q3',
        text: 'Auf welchem Betriebssystem ist Computer Use aktuell verfügbar?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Windows und macOS', value: 'win-mac' },
          { id: 'b', label: 'Alle Betriebssysteme', value: 'all' },
          { id: 'c', label: 'Nur Linux', value: 'linux' },
          { id: 'd', label: 'Nur macOS', value: 'macos', isCorrect: true },
        ],
        correctAnswer: 'd',
        explanation: 'Computer Use ist aktuell nur auf macOS verfügbar als Research Preview für Pro- und Max-Subscriber. Windows und Linux werden möglicherweise in zukünftigen Releases unterstützt.',
        hints: ['Es ist eine Research Preview', 'Nur ein Desktop-Betriebssystem wird unterstützt'],
      },
      {
        id: 'l33-q4',
        text: 'Was solltest du bei der Nutzung von Computer Use vermeiden?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Browser öffnen', value: 'browser' },
          { id: 'b', label: 'Dev-Tools nutzen', value: 'devtools' },
          { id: 'c', label: 'Sensible Daten auf dem Desktop anzeigen', value: 'sensitive', isCorrect: true },
          { id: 'd', label: 'Mehrere Apps gleichzeitig nutzen', value: 'multi' },
        ],
        correctAnswer: 'c',
        explanation: 'Da Claude Screenshots deines Desktops aufnimmt, solltest du vermeiden, sensible Daten (Passwörter, private Dokumente, Finanzinformationen) sichtbar zu haben. Anthropic warnt explizit davor.',
        hints: ['Claude sieht alles was auf dem Desktop angezeigt wird', 'Datenschutz ist wichtig'],
      },
      {
        id: 'l33-q5',
        text: 'Wo aktivierst du Computer Use?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Im Terminal mit --computer-use Flag', value: 'terminal' },
          { id: 'b', label: 'In der Claude Desktop App unter Settings → Computer Use', value: 'desktop', isCorrect: true },
          { id: 'c', label: 'In der CLAUDE.md mit einer Direktive', value: 'claudemd' },
          { id: 'd', label: 'Automatisch wenn Claude eine GUI-App erkennt', value: 'auto' },
        ],
        correctAnswer: 'b',
        explanation: 'Computer Use wird in der Claude Desktop App aktiviert: Settings → Computer Use → Enable. Es ist nicht über das Terminal oder CLAUDE.md konfigurierbar.',
        hints: ['Die Aktivierung erfolgt über die Desktop-Anwendung', 'Es gibt einen dedizierten Settings-Bereich'],
      },
    ],
  },
  {
    id: 'l34-quiz-1',
    lessonId: 34,
    title: '/powerup — Das offizielle Tutorial-System',
    type: 'multiple-choice',
    points: 100,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'l34-q1',
        text: 'Was ist /powerup in Claude Code?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Ein Befehl um Claude Code auf die neueste Version upzudaten', value: 'update' },
          { id: 'b', label: 'Das erste offizielle interaktive Tutorial direkt im Terminal mit 18 Lektionen in 3 Levels', value: 'tutorial', isCorrect: true },
          { id: 'c', label: 'Ein Power-User-Modus der mehr Tokens verbraucht', value: 'powermode' },
          { id: 'd', label: 'Ein Plugin-System für externe Tools', value: 'plugin' },
        ],
        correctAnswer: 'b',
        explanation: '/powerup ist das erste offizielle, first-party Lernsystem für Claude Code — direkt im Terminal, mit animierten Feature-Demos. 18 Lektionen in 3 Levels (Beginner, Advanced, Expert). Verfügbar seit Claude Code v2.1.90.',
        hints: ['Es ist ein Slash Command', 'Es läuft direkt im Terminal ohne Browser'],
      },
      {
        id: 'l34-q2',
        text: 'Welche Inhalte hat Level 3 (Expert) in /powerup?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Context Management, CLAUDE.md, /clear', value: 'basics' },
          { id: 'b', label: 'Hooks, MCP, Sub-Agents', value: 'advanced' },
          { id: 'c', label: '/loop, headless Mode, agentic Workflows', value: 'expert', isCorrect: true },
          { id: 'd', label: 'Git Integration, Debugging, Performance', value: 'other' },
        ],
        correctAnswer: 'c',
        explanation: 'Level 3 (Expert) deckt die fortgeschrittenen agentic Features ab: /loop für wiederkehrende Tasks, headless Mode für CI/CD und Scripts, und agentic Workflows die ohne menschliche Intervention laufen.',
        hints: ['Level 1 = Basics, Level 2 = Advanced, Level 3 = ?', 'Es geht um autonome Workflows'],
      },
      {
        id: 'l34-q3',
        text: 'Was ist der Hauptunterschied zwischen /powerup und dem Masterkurs?',
        type: 'radio',
        options: [
          { id: 'a', label: '/powerup ist kostenpflichtig, der Masterkurs ist kostenlos', value: 'price' },
          { id: 'b', label: '/powerup zeigt alle Features im Überblick (Feature-Discovery), der Masterkurs geht tiefer mit Enterprise-Patterns und Real-World-Beispielen', value: 'depth', isCorrect: true },
          { id: 'c', label: '/powerup ist für Experten, der Masterkurs für Anfänger', value: 'level' },
          { id: 'd', label: 'Es gibt keinen Unterschied — beide haben die gleichen Inhalte', value: 'same' },
        ],
        correctAnswer: 'b',
        explanation: '/powerup ist Feature-Discovery: In 30-60 Minuten siehst du alle Features. Der Masterkurs geht tiefer: Warum bestimmte Patterns funktionieren, Enterprise-grade Hooks, MCP-Server bauen, Managed Agents deployen — das was /powerup überfliegt.',
        hints: ['Feature-Discovery vs. tiefes Verständnis', 'Beide ergänzen sich — nicht konkurrieren'],
      },
      {
        id: 'l34-q4',
        text: 'Welches Feature zeigt der Masterkurs das /powerup NICHT abdeckt?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Was /clear macht', value: 'clear' },
          { id: 'b', label: 'Wie man CLAUDE.md erstellt', value: 'claudemd' },
          { id: 'c', label: 'Wie man Sessions startet und beendet', value: 'sessions' },
          { id: 'd', label: 'Claude Managed Agents ($0.08/Stunde Enterprise-Plattform)', value: 'managed', isCorrect: true },
        ],
        correctAnswer: 'd',
        explanation: 'Claude Managed Agents wird von /powerup nicht behandelt. Der Masterkurs erklärt die Enterprise-Plattform für produktionsreife 24/7-Agenten, Kosten-Kalkulation, Deployment-Optionen und Security-Patterns.',
        hints: ['Denke an die Enterprise-Features', 'Was kostet $0.08 pro Stunde?'],
      },
      {
        id: 'l34-q5',
        text: 'Ab welcher Claude Code Version ist /powerup verfügbar?',
        type: 'radio',
        options: [
          { id: 'a', label: 'v2.0.0', value: 'v200' },
          { id: 'b', label: 'v2.1.88', value: 'v2188' },
          { id: 'c', label: 'v2.1.90', value: 'v2190', isCorrect: true },
          { id: 'd', label: 'v3.0.0', value: 'v300' },
        ],
        correctAnswer: 'c',
        explanation: '/powerup wurde mit Claude Code v2.1.90 eingeführt (1. April 2026). Es ist Teil der April 2026 Feature-Welle zusammen mit MCP 500K Result Storage (v2.1.91) und anderen Updates.',
        hints: ['Es kam im April 2026', 'Die Version ist v2.1.XX'],
      },
    ],
  },
  {
    id: 'l35-quiz-1',
    lessonId: 35,
    title: 'Claude Managed Agents — Enterprise Plattform',
    type: 'multiple-choice',
    points: 100,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'l35-q1',
        text: 'Was kostet Claude Managed Agents an Infrastruktur-Kosten?',
        type: 'radio',
        options: [
          { id: 'a', label: '$0.008/Stunde', value: '0008' },
          { id: 'b', label: '$0.08/Stunde', value: '008', isCorrect: true },
          { id: 'c', label: '$0.80/Stunde', value: '080' },
          { id: 'd', label: '$8.00/Stunde', value: '800' },
        ],
        correctAnswer: 'b',
        explanation: 'Claude Managed Agents kostet $0.08 pro Stunde Infrastruktur plus die normalen Claude API Token-Kosten. Ein 24/7-Agent kostet damit ca. $1.92/Tag in Infrastruktur.',
        hints: ['Es sind 8 Cent pro Stunde', 'Plus kommen noch Token-Kosten dazu'],
      },
      {
        id: 'l35-q2',
        text: 'Welches Feature von Claude Managed Agents ermöglicht es einem Agent zu pausieren und auf manuelle Freigabe zu warten?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Sandboxed Execution', value: 'sandbox' },
          { id: 'b', label: 'Persistent Sessions', value: 'persistent' },
          { id: 'c', label: 'Checkpointing kombiniert mit Defer-Hooks (Exit 3)', value: 'checkpoint', isCorrect: true },
          { id: 'd', label: 'Scoped Permissions', value: 'permissions' },
        ],
        correctAnswer: 'c',
        explanation: 'Checkpointing speichert den Agent-State wenn der Agent pausiert. Kombiniert mit dem Defer-Hook (Exit 3) kann ein Agent bei kritischen Operationen pausieren, einen Operator benachrichtigen, und nach manueller Freigabe (--resume) weiterlaufen. Das ist das Human-in-the-Loop Pattern.',
        hints: ['Zwei Features arbeiten zusammen', 'Exit 3 ist der neue Defer-Exit-Code'],
      },
      {
        id: 'l35-q3',
        text: 'Für welchen Anwendungsfall ist Claude Managed Agents NICHT die beste Wahl?',
        type: 'radio',
        options: [
          { id: 'a', label: 'PR-Review-Agent der bei jedem neuen PR feuert (On-Demand)', value: 'pr' },
          { id: 'b', label: 'Täglicher Standup-Summarizer der 1h/Tag läuft', value: 'standup' },
          { id: 'c', label: 'Ein 24/7-Monitoring-Agent der permanent läuft (720h/Monat)', value: 'monitoring', isCorrect: true },
          { id: 'd', label: 'Issue-Triage-Agent der neue GitHub Issues kategorisiert', value: 'triage' },
        ],
        correctAnswer: 'c',
        explanation: 'Für einen 24/7-Agent der permanent läuft (720h × $0.08 = $57.60/Monat Infrastruktur) kann ein eigener VPS ($10-20/Monat) günstiger sein. Managed Agents ist ideal für On-Demand-Trigger-Agents und kurze tägliche Batch-Jobs — nicht für permanente Monitoring-Workflows.',
        hints: ['Rechne die monatlichen Infra-Kosten aus', 'Wann wird ein VPS günstiger?'],
      },
      {
        id: 'l35-q4',
        text: 'Wie lautet das Sicherheitsprinzip für Managed Agent Permissions?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Maximum Permissions — damit der Agent immer alles tun kann was nötig ist', value: 'max' },
          { id: 'b', label: 'Principle of Least Privilege — nur die Permissions die wirklich nötig sind', value: 'least', isCorrect: true },
          { id: 'c', label: 'Read-Only — Managed Agents dürfen nie schreiben', value: 'readonly' },
          { id: 'd', label: 'Permissions spielen bei Managed Agents keine Rolle', value: 'none' },
        ],
        correctAnswer: 'b',
        explanation: 'Das Principle of Least Privilege ist der Kern der Managed Agent Security: Gib dem Agent nur die Permissions die er wirklich braucht. Ein PR-Review-Agent braucht github:comments:write, aber auf keinen Fall github:pushes oder github:merges. Nutze die deny-Liste für explizite Ausschlüsse.',
        hints: ['Weniger ist mehr bei Permissions', 'Das ist ein allgemeines Security-Prinzip'],
      },
      {
        id: 'l35-q5',
        text: 'Wann wurde Claude Managed Agents offiziell gelauncht und mit wieviel Views auf das Announcement?',
        type: 'radio',
        options: [
          { id: 'a', label: '1. April 2026, 1 Million Views', value: 'april1' },
          { id: 'b', label: '8. April 2026, 2 Millionen Views in 2 Stunden', value: 'april8', isCorrect: true },
          { id: 'c', label: '15. April 2026, 500K Views', value: 'april15' },
          { id: 'd', label: '1. Januar 2026, 5 Millionen Views', value: 'jan1' },
        ],
        correctAnswer: 'b',
        explanation: 'Claude Managed Agents wurde am 8. April 2026 gelauncht. Das Announcement-Tweet bekam 2 Millionen Views in 2 Stunden — das größte Anthropic-Release des Quartals. SiliconANGLE nannte es "Anthropics biggest enterprise bet yet."',
        hints: ['Es war im April 2026', 'Die Zahl ist 2 Millionen in 2 Stunden'],
      },
    ],
  },
  // ========================================
  // LEKTION 36 QUIZ — Ultraplan
  // ========================================
  {
    id: 'quiz-36',
    lessonId: 36,
    title: 'Ultraplan — Cloud Planning',
    type: 'multiple-choice',
    points: 100,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'q36-1',
        text: 'Was ist der Hauptvorteil von /ultraplan gegenüber lokalem /plan?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Es ist immer schneller', value: 'speed' },
          { id: 'b', label: 'Plan-Generierung läuft in Cloud-Container — Terminal bleibt frei und Hauptkontext wird nicht mit langem Plan polluiert', value: 'cloud', isCorrect: true },
          { id: 'c', label: 'Es kostet keine Tokens', value: 'free' },
          { id: 'd', label: 'Es funktioniert ohne GitHub-Repo', value: 'nogit' },
        ],
        correctAnswer: 'b',
        explanation: 'Ultraplan lagert die Plan-Phase in einen Cloud-Container aus. Dein Terminal bleibt frei für andere Arbeit, und der Plan polluiert nicht mehr deinen Hauptkontext mit 30-50K Tokens. Das ist der wichtigste Unterschied zu lokalem /plan.',
        hints: ['Es geht um Token-Verbrauch im Hauptchat', 'Denk an Parallelität'],
      },
      {
        id: 'q36-2',
        text: 'Welche Requirements gelten für Ultraplan?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Kostenloser Plan reicht', value: 'free' },
          { id: 'b', label: 'Claude Code v2.1.101+, GitHub-hosted Repo, Pro/Max-Plan', value: 'all', isCorrect: true },
          { id: 'c', label: 'Nur Linux-Systeme', value: 'linux' },
          { id: 'd', label: 'Selbst gehostete Container', value: 'self' },
        ],
        correctAnswer: 'b',
        explanation: 'Ultraplan benötigt Claude Code v2.1.101+, ein GitHub-hosted Repo und einen Pro- oder Max-Plan. Lokale Repos ohne GitHub-Origin werden nicht unterstützt.',
        hints: ['GitHub ist Pflicht', 'Nicht im Free-Plan verfügbar'],
      },
      {
        id: 'q36-3',
        text: 'Was bedeutet "Teleport back to terminal" nach Plan-Approval?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Plan wird verworfen und neu gestartet', value: 'discard' },
          { id: 'b', label: 'Plan wird zurück ans lokale Terminal übergeben und mit normalem claude ausgeführt', value: 'local', isCorrect: true },
          { id: 'c', label: 'Container wird gelöscht', value: 'delete' },
          { id: 'd', label: 'Plan wird in Slack gepostet', value: 'slack' },
        ],
        correctAnswer: 'b',
        explanation: 'Teleport back to terminal übergibt den approved Plan ans lokale Terminal. Du führst dann mit normalem claude aus — alle deine lokalen Hooks und Skills greifen, was bei Cloud-Execution nicht der Fall wäre.',
        hints: ['Es geht um lokale Ausführung', 'Lokale Hooks brauchen lokale Ausführung'],
      },
      {
        id: 'q36-4',
        text: 'Welches Feature konkurriert mit Ultraplan um claude.ai/code?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Subagents', value: 'sub' },
          { id: 'b', label: 'Hooks', value: 'hooks' },
          { id: 'c', label: 'Remote Control', value: 'remote', isCorrect: true },
          { id: 'd', label: 'Skills Marketplace', value: 'market' },
        ],
        correctAnswer: 'c',
        explanation: 'Remote Control und Ultraplan nutzen beide claude.ai/code als Web-Interface. Du musst dich für eines entscheiden — wer Remote Control aktiv nutzt, hat keinen Ultraplan-Zugang.',
        hints: ['Beide nutzen den gleichen Web-Endpunkt', 'Es ist ein anderes Cloud-Feature'],
      },
      {
        id: 'q36-5',
        text: 'Welche 3 Wege gibt es um Ultraplan zu starten?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Direkter /ultraplan, Wort "ultraplan" im Prompt, Refine aus lokalem /plan', value: 'all', isCorrect: true },
          { id: 'b', label: 'Nur per CLI-Flag --ultraplan', value: 'flag' },
          { id: 'c', label: 'Nur über die Web-UI', value: 'web' },
          { id: 'd', label: 'Per API-Aufruf, Slack-Bot, Email', value: 'odd' },
        ],
        correctAnswer: 'a',
        explanation: 'Drei Wege: 1) Direkter /ultraplan-Slash-Command, 2) das Wort "ultraplan" irgendwo in einem normalen Prompt, 3) aus dem lokalen /plan-Dialog ueber "Refine with Ultraplan".',
        hints: ['Es ist mehr als nur ein CLI-Aufruf', 'Auch der Eskalationspfad ist dabei'],
      },
    ],
  },
  // ========================================
  // LEKTION 37 QUIZ — Opus 4.7 Migration
  // ========================================
  {
    id: 'quiz-37',
    lessonId: 37,
    title: 'Opus 4.7 — Migration & xhigh-Effort',
    type: 'multiple-choice',
    points: 100,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'q37-1',
        text: 'Wann wurde Opus 4.7 veröffentlicht und wie hat sich das Pricing geändert?',
        type: 'radio',
        options: [
          { id: 'a', label: '16. April 2026, günstiger: $5/M Input + $25/M Output', value: 'apr16', isCorrect: true },
          { id: 'b', label: '1. April 2026, teurer: $20/M Input + $100/M Output', value: 'apr1' },
          { id: 'c', label: '8. April 2026, gleich teuer wie Opus 4.6', value: 'apr8' },
          { id: 'd', label: 'Mai 2026, doppelt so teuer', value: 'may' },
        ],
        correctAnswer: 'a',
        explanation: 'Opus 4.7 wurde am 16. April 2026 veröffentlicht. Pricing ist sogar günstiger geworden: $5/M Input und $25/M Output (vs $15/$75 bei Opus 4.6).',
        hints: ['April-Mitte', 'Günstiger als Vorgänger'],
      },
      {
        id: 'q37-2',
        text: 'Wofür ist der neue --effort xhigh gedacht?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Standard-Tasks im Alltag', value: 'standard' },
          { id: 'b', label: 'Schnelle Quick-Fixes', value: 'quick' },
          { id: 'c', label: 'Die schwersten 5-10% der Tasks: Architektur, Algorithmen, Multi-File-Refactors mit tiefem Reasoning', value: 'hard', isCorrect: true },
          { id: 'd', label: 'Boilerplate-Generierung', value: 'boiler' },
        ],
        correctAnswer: 'c',
        explanation: 'xhigh ist für die schwersten 5-10% der Tasks. Architektur-Entscheidungen, Algorithmen-Design, schwer reproduzierbare Bugs. Trade-off: 2-3x höhere Token-Kosten und längere Antwortzeiten.',
        hints: ['Es ist der teuerste Effort-Level', 'Nur für richtig harte Probleme'],
      },
      {
        id: 'q37-3',
        text: 'Was bewirkt --task-budget 50000?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Setzt das monatliche Budget auf $50000', value: 'monthly' },
          { id: 'b', label: 'Hartes Token-Limit pro Task — bei Überschreitung kontrollierter Abbruch', value: 'hard', isCorrect: true },
          { id: 'c', label: 'Erhöht die Token-Geschwindigkeit', value: 'speed' },
          { id: 'd', label: 'Nichts — das Flag existiert nicht', value: 'none' },
        ],
        correctAnswer: 'b',
        explanation: 'Task-Budget setzt ein hartes Token-Limit pro Task. Bei Überschreitung bricht die Ausführung kontrolliert ab. Wichtiges Sicherheitsnetz für autonome Loops und CI-Pipelines.',
        hints: ['Es geht um Sicherheit', 'Schützt vor Runaway-Kosten'],
      },
      {
        id: 'q37-4',
        text: 'Wie hat sich die Vision-Auflösung gegenüber Opus 4.6 verändert?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Halbiert für mehr Speed', value: 'half' },
          { id: 'b', label: 'Unverändert', value: 'same' },
          { id: 'c', label: '3x höher (bis 3.75 Megapixel) — präzises UI-Bug-Debugging aus Screenshots', value: 'triple', isCorrect: true },
          { id: 'd', label: 'Nur noch Schwarz-Weiß-Bilder', value: 'bw' },
        ],
        correctAnswer: 'c',
        explanation: 'Opus 4.7 hat 3x höhere Vision-Auflösung — bis zu 3.75 Megapixel. Das macht Screenshot-basiertes Debugging deutlich präziser, z.B. für off-by-1px UI-Bugs aus Designs.',
        hints: ['Vision wurde verbessert', 'Faktor 3'],
      },
      {
        id: 'q37-5',
        text: 'Welche Migration-Schritte sind beim Wechsel auf Opus 4.7 wichtig?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Komplettes Neuschreiben aller Skills nötig', value: 'rewrite' },
          { id: 'b', label: 'CLAUDE.md aktualisieren, CI/CD-Pipelines auf neues Modell umstellen, --task-budget einführen, xhigh-Whitelist führen', value: 'list', isCorrect: true },
          { id: 'c', label: 'Migration ist nicht möglich, alte Modelle bleiben', value: 'no' },
          { id: 'd', label: 'Bezahlpflichtige Migration über Anthropic-Support', value: 'paid' },
        ],
        correctAnswer: 'b',
        explanation: 'Migration ist drop-in. Wichtigste Schritte: hardcoded Model-IDs in CLAUDE.md, Hooks und CI-Pipelines updaten, Task-Budgets für autonome Runs einführen, eine xhigh-Whitelist führen damit nicht jeder Task xhigh-Kosten produziert.',
        hints: ['Drop-in Replacement', 'Task-Budgets sind neu wichtig'],
      },
    ],
  },
  // ========================================
  // LEKTION 38 QUIZ — Monitor Tool
  // ========================================
  {
    id: 'quiz-38',
    lessonId: 38,
    title: 'Monitor Tool & Event-Driven Patterns',
    type: 'multiple-choice',
    points: 100,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'q38-1',
        text: 'Was ist der Hauptvorteil von Monitor gegenüber BashOutput-Polling?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Es ist schneller', value: 'speed' },
          { id: 'b', label: 'Claude wird nur bei echten Events geweckt — massiv weniger Token-Verbrauch (oft 100-1000x)', value: 'tokens', isCorrect: true },
          { id: 'c', label: 'Keine Unterschiede, nur andere Syntax', value: 'none' },
          { id: 'd', label: 'Funktioniert nur mit npm', value: 'npm' },
        ],
        correctAnswer: 'b',
        explanation: 'Monitor invertiert das Polling-Pattern: Statt regelmäßig zu fragen "ist schon was passiert", wird Claude passiv informiert wenn etwas Relevantes passiert. Das spart oft 100-1000x Tokens bei langen Background-Prozessen.',
        hints: ['Es geht um Token-Verbrauch', 'Polling vs Events'],
      },
      {
        id: 'q38-2',
        text: 'Wozu dient das until-Pattern in einem Monitor-Aufruf?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Setzt eine Zeit-Begrenzung', value: 'time' },
          { id: 'b', label: 'Definiert per Regex wann das Monitoring beendet werden soll', value: 'regex', isCorrect: true },
          { id: 'c', label: 'Filtert die Output-Lines', value: 'filter' },
          { id: 'd', label: 'Ist optional ohne Funktion', value: 'optional' },
        ],
        correctAnswer: 'b',
        explanation: 'until ist ein Regex-Pattern, das festlegt wann Monitor beendet wird — z.B. until: "Error|FAIL|completed" stoppt sobald eines dieser Wörter im Output erscheint.',
        hints: ['Es ist eine Regex', 'Es geht ums Beenden'],
      },
      {
        id: 'q38-3',
        text: 'Wann lohnt sich Monitor laut Faustregel?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Bei jedem Befehl', value: 'always' },
          { id: 'b', label: 'Nie, BashOutput ist immer besser', value: 'never' },
          { id: 'c', label: 'Sobald ein Background-Prozess > 30 Sekunden läuft UND nicht jede Output-Zeile relevant ist', value: 'rule', isCorrect: true },
          { id: 'd', label: 'Nur bei npm-Befehlen', value: 'npm' },
        ],
        correctAnswer: 'c',
        explanation: 'Faustregel: Sobald ein Background-Prozess länger als 30 Sekunden läuft und nicht jede Output-Zeile relevant ist, ist Monitor günstiger. Bei < 30 Sek einfach blocking laufen lassen.',
        hints: ['30 Sekunden Schwellwert', 'Es geht um Relevanz der Lines'],
      },
      {
        id: 'q38-4',
        text: 'Wie kombiniert man Monitor mit Hooks für vollautomatische Reaktionen?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Gar nicht, Monitor und Hooks sind inkompatibel', value: 'no' },
          { id: 'b', label: 'Mit PostToolUse-Hooks, matcher: "Monitor" — feuert bei jedem Event', value: 'hook', isCorrect: true },
          { id: 'c', label: 'Nur über manuelle CLI-Aufrufe', value: 'manual' },
          { id: 'd', label: 'Über separates Polling-System', value: 'poll' },
        ],
        correctAnswer: 'b',
        explanation: 'In settings.json kannst du PostToolUse-Hooks mit matcher: "Monitor" definieren. Sie feuern bei jedem Monitor-Event und können z.B. Slack-Notifications schicken oder weitere Aktionen triggern.',
        hints: ['Es ist ein Standard-Hook-Lifecycle', 'PostToolUse'],
      },
      {
        id: 'q38-5',
        text: 'Wann sollte man Monitor NICHT verwenden?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Bei langen Test-Suites', value: 'tests' },
          { id: 'b', label: 'Bei Dev-Servern', value: 'dev' },
          { id: 'c', label: 'Wenn jede einzelne Output-Zeile wirklich relevant ist (z.B. Live-Debugging eines spezifischen Issues)', value: 'all', isCorrect: true },
          { id: 'd', label: 'Bei CI-Pipelines', value: 'ci' },
        ],
        correctAnswer: 'c',
        explanation: 'Monitor ist für "wecke mich bei was Relevantem". Wenn du jede Output-Line wirklich brauchst (z.B. Live-Debugging), bleib bei BashOutput. Monitor verwirft uninteressante Lines vom Wake-up-Mechanismus.',
        hints: ['Monitor filtert Wake-ups', 'Wenn alles wichtig ist, hilft Filtern nicht'],
      },
    ],
  },
  // ========================================
  // LEKTION 39 QUIZ — Quality-Postmortem
  // ========================================
  {
    id: 'quiz-39',
    lessonId: 39,
    title: 'Quality-Postmortem April 2026',
    type: 'multiple-choice',
    points: 100,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'q39-1',
        text: 'Was ist seit dem 07.04.2026 wieder der Default-Reasoning-Effort in Claude Code?',
        type: 'radio',
        options: [
          { id: 'a', label: 'low', value: 'low' },
          { id: 'b', label: 'medium', value: 'medium' },
          { id: 'c', label: 'high', value: 'high', isCorrect: true },
          { id: 'd', label: 'xhigh', value: 'xhigh' },
        ],
        correctAnswer: 'c',
        explanation: 'Am 07.04.2026 hat Anthropic den Default von medium zurück auf high gesetzt. Die zwischenzeitliche Reduktion war ein Quality-Bug und wurde revertiert.',
        hints: ['Es war ein Revert eines Bugs', 'Der höchste reguläre Level (xhigh nur für Opus 4.7)'],
      },
      {
        id: 'q39-2',
        text: 'Wie hat sich der Caching-Bug (26.03.→10.04.) ausgewirkt?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Längere Antwortzeiten', value: 'latency' },
          { id: 'b', label: 'Thinking-History wurde mid-session verworfen — Claude vergaß Begründungen', value: 'history', isCorrect: true },
          { id: 'c', label: 'Tool-Calls schlugen fehl', value: 'tools' },
          { id: 'd', label: 'API-Keys wurden geleakt', value: 'leak' },
        ],
        correctAnswer: 'b',
        explanation: 'Der Caching-Bug verwarf die Thinking-History. Claude erinnerte sich an Entscheidungen, aber nicht an die Begründung — das fühlte sich wie plötzliche Vergesslichkeit an.',
        hints: ['Es ging um Thinking', 'Subtile Vergesslichkeit'],
      },
      {
        id: 'q39-3',
        text: 'Welcher Slash-Command hilft dir, deinen aktuellen Plan-Verbrauch zu prüfen?',
        type: 'radio',
        options: [
          { id: 'a', label: '/limits', value: 'limits' },
          { id: 'b', label: '/usage', value: 'usage', isCorrect: true },
          { id: 'c', label: '/quota', value: 'quota' },
          { id: 'd', label: '/billing', value: 'billing' },
        ],
        correctAnswer: 'b',
        explanation: '/usage zeigt den Verbrauch im aktuellen Abrechnungs-Zeitraum und aktive Rate-Limits. Anthropic hat nach dem Postmortem alle Limits zurückgesetzt.',
        hints: ['Es ist ein 6-Buchstaben-Command', 'Englisch für "Nutzung"'],
      },
      {
        id: 'q39-4',
        text: 'Wie aktivierst du 1-Stunden-Prompt-Caching für eine lange Session?',
        type: 'radio',
        options: [
          { id: 'a', label: '--cache-1h Flag', value: 'flag' },
          { id: 'b', label: 'ENABLE_PROMPT_CACHING_1H=1 als Env-Var', value: 'env', isCorrect: true },
          { id: 'c', label: '/cache 1h Slash-Command', value: 'slash' },
          { id: 'd', label: 'Per Klick in der GUI', value: 'gui' },
        ],
        correctAnswer: 'b',
        explanation: 'ENABLE_PROMPT_CACHING_1H=1 als Environment-Variable verlängert die Cache-TTL auf 60 Minuten — ideal für Sessions > 30 Min Dauer.',
        hints: ['Es ist eine Env-Var', 'Wert ist 1, kein "true"'],
      },
      {
        id: 'q39-5',
        text: 'Welche alte Heuristik ist seit den Bug-Fixes obsolet geworden?',
        type: 'radio',
        options: [
          { id: 'a', label: 'CLAUDE.md im Projekt-Root anlegen', value: 'claudemd' },
          { id: 'b', label: 'Kritische Entscheidungen alle 5-10 Nachrichten wiederholen', value: 'repeat', isCorrect: true },
          { id: 'c', label: 'Subagents für parallele Recherche', value: 'subagents' },
          { id: 'd', label: 'git worktrees für isolierte Branches', value: 'worktrees' },
        ],
        correctAnswer: 'b',
        explanation: 'Die "Wiederhol-Pattern" war ein Workaround für den Caching-Bug. Seit 10.04.2026 ist das nicht mehr nötig und kostet nur Tokens.',
        hints: ['Workaround für den Caching-Bug', 'Kostete Tokens'],
      },
    ],
  },
  // ========================================
  // LEKTION 40 QUIZ — Managed Agents
  // ========================================
  {
    id: 'quiz-40',
    lessonId: 40,
    title: 'Managed Agents API in der Praxis',
    type: 'multiple-choice',
    points: 100,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'q40-1',
        text: 'Wann sind Managed Agents besser geeignet als ein lokaler Claude-Prozess?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Beim Pair-Programming am eigenen Code', value: 'pair' },
          { id: 'b', label: 'Für Background-Tasks die ohne dich laufen sollen (Triage, Daily-Recap, Recherche)', value: 'bg', isCorrect: true },
          { id: 'c', label: 'Für lokale Refactors', value: 'refactor' },
          { id: 'd', label: 'Nie, lokal ist immer besser', value: 'never' },
        ],
        correctAnswer: 'b',
        explanation: 'Managed Agents sind die Brücke vom lokalen Pair-Programmer zum Background-Worker. Wenn du "set it and forget it" willst, ist die Cloud-Runtime mit Memory-Beta der richtige Ort.',
        hints: ['Background-Tasks', 'Ohne menschlichen Begleiter'],
      },
      {
        id: 'q40-2',
        text: 'Wie baut sich Memory in einer Managed-Agents-Session korrekt auf?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Bei jedem Run eine neue Session erstellen', value: 'new' },
          { id: 'b', label: 'sessions.create() einmal — sessions.run() mit derselben ID wiederholt', value: 'reuse', isCorrect: true },
          { id: 'c', label: 'Memory ist global, kein Setup nötig', value: 'global' },
          { id: 'd', label: 'Memory muss manuell in eine Datei geschrieben werden', value: 'manual' },
        ],
        correctAnswer: 'b',
        explanation: 'Die Session-ID ist der Memory-Anker. Wenn du jede Woche eine neue Session erstellst, verlierst du den Memory-Vorteil komplett. Persistiere die ID in Datei/DB/Secret.',
        hints: ['Session-ID ist der Anker', 'Wiederverwenden statt neu erstellen'],
      },
      {
        id: 'q40-3',
        text: 'Wie strukturierst du Memory-Namespaces sinnvoll?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Ein "global"-Namespace für alles', value: 'global' },
          { id: 'b', label: 'Pro Projekt + User getrennt (z.B. masterkurs-cosmo, crm-cosmo)', value: 'split', isCorrect: true },
          { id: 'c', label: 'Pro Tag einen neuen Namespace', value: 'daily' },
          { id: 'd', label: 'Namespaces machen keinen Unterschied', value: 'none' },
        ],
        correctAnswer: 'b',
        explanation: 'Ein global-Namespace verwässert Erinnerungen und macht Debugging schwer. Pro Projekt + User trennen sorgt für klare Memory-Bereiche.',
        hints: ['Trennung wichtig', 'Pro Projekt'],
      },
      {
        id: 'q40-4',
        text: 'Was kostet ein Managed Agent grob?',
        type: 'radio',
        options: [
          { id: 'a', label: '$0.08/h Runtime + Token-Kosten — idle kostet nichts', value: 'hourly', isCorrect: true },
          { id: 'b', label: 'Pauschal $50/Monat pro Session', value: 'flat' },
          { id: 'c', label: 'Komplett kostenlos in der Beta', value: 'free' },
          { id: 'd', label: 'Nur in Enterprise-Plänen verfügbar', value: 'enterprise' },
        ],
        correctAnswer: 'a',
        explanation: 'Runtime kostet $0.08/h aktiv (idle ist gratis), dazu kommen die normalen Claude-API-Token-Kosten. Für einen Weekly-Recherche-Agent oft <$5/Monat insgesamt.',
        hints: ['Stündlich', 'Plus Token-Kosten'],
      },
      {
        id: 'q40-5',
        text: 'Was ist beim Memory-Beta-Status wichtig zu beachten?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Memory ist GA und Production-ready', value: 'ga' },
          { id: 'b', label: 'API kann sich vor GA noch ändern — produktionskritische Workflows zurückhaltend integrieren', value: 'beta', isCorrect: true },
          { id: 'c', label: 'Memory wird nach 24h gelöscht', value: '24h' },
          { id: 'd', label: 'Memory funktioniert nur mit Sonnet, nicht Opus', value: 'sonnet' },
        ],
        correctAnswer: 'b',
        explanation: 'Memory ist Public Beta seit 09.04.2026. Sandboxing und Permission-System sind robust, aber das Memory-Schema kann sich vor GA noch ändern.',
        hints: ['Beta', 'Schema kann sich ändern'],
      },
    ],
  },
  // ========================================
  // LEKTION 41 QUIZ — Ultrareview in CI/CD
  // ========================================
  {
    id: 'quiz-41',
    lessonId: 41,
    title: 'Ultrareview in CI/CD',
    type: 'multiple-choice',
    points: 100,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'q41-1',
        text: 'Was hat sich mit Claude Code 2.1.120 für Ultrareview geändert?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Es wurde abgeschafft', value: 'gone' },
          { id: 'b', label: 'Es ist jetzt ein Standalone-CLI-Command (claude ultrareview), CI-tauglich', value: 'cli', isCorrect: true },
          { id: 'c', label: 'Es ist nur noch in Cowork verfügbar', value: 'cowork' },
          { id: 'd', label: 'Es kostet jetzt extra', value: 'paid' },
        ],
        correctAnswer: 'b',
        explanation: 'Bis 2.1.111 war /ultrareview nur interaktiv. Mit 2.1.120 ist `claude ultrareview` ein Top-Level-CLI-Command — perfekt für GitHub Actions und Pre-Push-Hooks.',
        hints: ['CLI-Command', 'Headless'],
      },
      {
        id: 'q41-2',
        text: 'Was passiert intern bei einem Ultrareview-Lauf?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Ein einzelner Reviewer-Agent prüft sequenziell', value: 'single' },
          { id: 'b', label: 'Mehrere Reviewer-Subagents laufen parallel mit unterschiedlichem Fokus (Security, Style, Performance)', value: 'multi', isCorrect: true },
          { id: 'c', label: 'Nur ein Lint-Check', value: 'lint' },
          { id: 'd', label: 'Keine Subagents — direkter Review', value: 'direct' },
        ],
        correctAnswer: 'b',
        explanation: 'Ultrareview spawnt mehrere Reviewer-Subagents parallel. Jeder hat einen Fokus (z.B. Security, Code-Style). Die Ergebnisse werden aggregiert.',
        hints: ['Parallel', 'Multi-Agent'],
      },
      {
        id: 'q41-3',
        text: 'Warum solltest du --task-budget in CI immer setzen?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Macht den Review schneller', value: 'speed' },
          { id: 'b', label: 'Verhindert Runaway-Kosten falls ein Agent in eine Schleife gerät', value: 'cost', isCorrect: true },
          { id: 'c', label: 'Ist Pflicht-Flag', value: 'required' },
          { id: 'd', label: 'Verbessert Review-Qualität', value: 'quality' },
        ],
        correctAnswer: 'b',
        explanation: 'In CI bist du nicht dabei. Ohne Budget kann eine Endlosschleife mehrere Dollar pro Run kosten. Mit --task-budget 80000 ist der Cap garantiert.',
        hints: ['Cost-Control', 'Endlosschleifen'],
      },
      {
        id: 'q41-4',
        text: 'Wie kombinierst du Ultrareview mit Skills wie security-review?',
        type: 'radio',
        options: [
          { id: 'a', label: '--skill security-review (mehrfach erlaubt)', value: 'flag', isCorrect: true },
          { id: 'b', label: 'Skills sind nicht kompatibel', value: 'incompatible' },
          { id: 'c', label: 'Nur über CLAUDE.md', value: 'claudemd' },
          { id: 'd', label: 'Per ENV-Var', value: 'env' },
        ],
        correctAnswer: 'a',
        explanation: 'Mit --skill aktivierst du fokussierte Reviewer. Du kannst mehrere Skills kombinieren (security-review + code-review + react-best-practices), jeder wird zu einem zusätzlichen Reviewer-Subagent.',
        hints: ['CLI-Flag', 'Mehrfach erlaubt'],
      },
      {
        id: 'q41-5',
        text: 'Welches Setup wird für ein durchschnittliches Team empfohlen?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Nur lokale Pre-Push-Hooks', value: 'local' },
          { id: 'b', label: 'Drei Stufen: Pre-Push (lokal) + PR-CI + Daily-on-Main', value: 'three', isCorrect: true },
          { id: 'c', label: 'Nur einmal pro Quartal manuell', value: 'quarterly' },
          { id: 'd', label: 'Nur in Production-Releases', value: 'release' },
        ],
        correctAnswer: 'b',
        explanation: 'Drei Stufen decken alle Reibungs-Punkte ab: Pre-Push für schnelles lokales Feedback, PR-CI für Multi-Skill-Review, Daily-on-Main für kontinuierliche Quality-Checks.',
        hints: ['Drei Stufen', 'Lokal + PR + Main'],
      },
    ],
  },
  // ========================================
  // LEKTION 42 QUIZ — --plugin-url & skillOverrides
  // ========================================
  {
    id: 'quiz-42',
    lessonId: 42,
    title: 'Plugin-Distribution & skillOverrides',
    type: 'multiple-choice',
    points: 100,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'q42-1',
        text: 'Was macht --plugin-url seit Claude Code 2.1.129?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Installiert ein Plugin permanent global', value: 'global' },
          { id: 'b', label: 'Lädt ein Plugin-ZIP aus einer URL nur für die aktuelle Session', value: 'session', isCorrect: true },
          { id: 'c', label: 'Veröffentlicht ein Plugin auf npm', value: 'npm' },
          { id: 'd', label: 'Ersetzt den Marketplace komplett', value: 'replace' },
        ],
        correctAnswer: 'b',
        explanation: '--plugin-url lädt ein Plugin-ZIP aus einer URL nur für die aktuelle Session. Nach Beenden ist das Plugin wieder weg — kein globaler Install.',
        hints: ['Session-Scope', 'Kein globaler Install'],
      },
      {
        id: 'q42-2',
        text: 'Welcher skillOverrides-Modus versteckt einen Skill auch von /?',
        type: 'radio',
        options: [
          { id: 'a', label: 'name-only', value: 'name-only' },
          { id: 'b', label: 'user-invocable-only', value: 'user-inv' },
          { id: 'c', label: 'off', value: 'off', isCorrect: true },
          { id: 'd', label: 'hidden', value: 'hidden' },
        ],
        correctAnswer: 'c',
        explanation: '"off" versteckt den Skill komplett — auch von /. Wie deinstalliert, aber wiederherstellbar.',
        hints: ['Komplett versteckt', 'Drei Modi insgesamt'],
      },
      {
        id: 'q42-3',
        text: 'Welcher skillOverrides-Modus reduziert den Token-Footprint pro Skill auf ~10 statt ~150?',
        type: 'radio',
        options: [
          { id: 'a', label: 'off', value: 'off' },
          { id: 'b', label: 'name-only', value: 'name-only', isCorrect: true },
          { id: 'c', label: 'user-invocable-only', value: 'user-inv' },
          { id: 'd', label: 'compact', value: 'compact' },
        ],
        correctAnswer: 'b',
        explanation: '"name-only" versteckt die Description — Trigger nur über exakten Namen, ~10 statt ~150 Tokens pro Skill.',
        hints: ['Description versteckt', 'Trigger nur per Name'],
      },
      {
        id: 'q42-4',
        text: 'Welche Env-Variable aktiviert Auto-Update auf Brew/WinGet?',
        type: 'radio',
        options: [
          { id: 'a', label: 'CLAUDE_CODE_AUTO_UPDATE', value: 'short' },
          { id: 'b', label: 'CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE', value: 'pkg', isCorrect: true },
          { id: 'c', label: 'CLAUDE_AUTO_UPGRADE', value: 'upgrade' },
          { id: 'd', label: 'BREW_AUTO_UPDATE', value: 'brew' },
        ],
        correctAnswer: 'b',
        explanation: 'CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE=1 aktiviert Auto-Update via Homebrew (Mac) oder WinGet (Windows).',
        hints: ['Lange Variable', 'Package Manager'],
      },
      {
        id: 'q42-5',
        text: 'Wo müssen seit 2.1.129 themes und monitors im Plugin-Manifest stehen?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Auf Top-Level wie früher', value: 'top' },
          { id: 'b', label: 'Unter "experimental": { ... }', value: 'exp', isCorrect: true },
          { id: 'c', label: 'In einer separaten manifest.theme.json', value: 'separate' },
          { id: 'd', label: 'Werden nicht mehr unterstützt', value: 'gone' },
        ],
        correctAnswer: 'b',
        explanation: 'Seit 2.1.129 müssen themes und monitors im Manifest unter "experimental": { ... } stehen — sonst lädt das Plugin nicht.',
        hints: ['Experimental-Block', 'Breaking Change in 2.1.129'],
      },
    ],
  },
  // ========================================
  // LEKTION 43 QUIZ — Compaction-Hygiene
  // ========================================
  {
    id: 'quiz-43',
    lessonId: 43,
    title: 'Compaction-Hygiene',
    type: 'multiple-choice',
    points: 100,
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 'q43-1',
        text: 'Bei welcher Context-Auslastung empfiehlt die 60%-Regel proaktiv /compact?',
        type: 'radio',
        options: [
          { id: 'a', label: '~30%', value: '30' },
          { id: 'b', label: '~60%', value: '60', isCorrect: true },
          { id: 'c', label: '~90%', value: '90' },
          { id: 'd', label: 'Erst wenn die Auto-Compact-Warnung erscheint', value: 'auto' },
        ],
        correctAnswer: 'b',
        explanation: 'Erfahrene Nutzer kompaktieren bei ~60% Auslastung. Bei 90%+ wird die Compaction zu verlustbehaftet — Details fallen weg.',
        hints: ['Zwischen 50 und 70', 'Proaktiv, nicht reaktiv'],
      },
      {
        id: 'q43-2',
        text: 'Was gehört in einen Pre-Compact-Brief?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Nur "bitte komprimiere"', value: 'short' },
          { id: 'b', label: 'Was machen wir, was wissen wir, was kommt als nächstes', value: 'three', isCorrect: true },
          { id: 'c', label: 'Eine Liste aller Dateien im Projekt', value: 'files' },
          { id: 'd', label: 'Nichts — /compact reicht allein', value: 'nothing' },
        ],
        correctAnswer: 'b',
        explanation: 'Drei Anker: Was machen wir (Task), Was wissen wir (Vermutungen, bisherige Versuche), Was kommt als nächstes. So überlebt der Debug-Kontext die Compaction.',
        hints: ['Drei Anker', 'Status-Update'],
      },
      {
        id: 'q43-3',
        text: 'Wann ist /clear besser als /compact?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Innerhalb desselben Tasks bei wachsendem Kontext', value: 'same' },
          { id: 'b', label: 'Bei einem komplett neuen Topic (anderer Bug, anderes Feature)', value: 'topic', isCorrect: true },
          { id: 'c', label: 'Niemals', value: 'never' },
          { id: 'd', label: 'Nur wenn der Kontext über 95% liegt', value: 'high' },
        ],
        correctAnswer: 'b',
        explanation: '/clear wirft alles weg — ideal bei Topic-Wechsel. /compact behält die Essenz desselben Tasks. Faustregel: Ist das, was im Kontext steht, noch relevant?',
        hints: ['Topic-Wechsel', 'Kein Kontext-Bezug mehr nötig'],
      },
      {
        id: 'q43-4',
        text: 'Was sagt die 2-Correction-Regel?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Korrigiere immer mindestens 2 Mal', value: 'always' },
          { id: 'b', label: 'Nach 2x Korrektur für denselben Fehler → /clear, neuer Prompt mit gelerntem Detail', value: 'clear', isCorrect: true },
          { id: 'c', label: 'Akzeptiere maximal 2 Korrekturen pro Tag', value: 'daily' },
          { id: 'd', label: '2 Korrekturen entsprechen einer /compact', value: 'compact' },
        ],
        correctAnswer: 'b',
        explanation: 'Wer dreimal denselben Fehler korrigieren muss, hat den Kontext mit Failed-Approaches verschmutzt. /clear + neuer Prompt mit dem gelernten Detail ist effizienter.',
        hints: ['Reset statt Endlos-Korrektur', 'Failed-Approaches im Kontext'],
      },
      {
        id: 'q43-5',
        text: 'Was hat sich an /context seit 2.1.129 geändert?',
        type: 'radio',
        options: [
          { id: 'a', label: 'Es zeigt jetzt ASCII-Art im Terminal-Output', value: 'ascii' },
          { id: 'b', label: 'Es hängt keine ~1.6K-Token-ASCII-Visualisierung mehr in die Conversation', value: 'free', isCorrect: true },
          { id: 'c', label: 'Es ist abgeschafft', value: 'gone' },
          { id: 'd', label: 'Es triggert /compact automatisch', value: 'trigger' },
        ],
        correctAnswer: 'b',
        explanation: 'Seit 2.1.129 hängt /context die ASCII-Vis nicht mehr in die Conversation — ~1.6K Tokens gespart pro Aufruf. Der Befehl ist jetzt token-frei nutzbar.',
        hints: ['Stealth-Fix', 'Token-Ersparnis'],
      },
    ],
  },
];
