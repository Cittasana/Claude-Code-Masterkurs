// ─────────────────────────────────────────────────────────────
// Capstone Projects – Projekt-Hub Daten
// Separate from the existing lesson-based projects in projects.ts
// ─────────────────────────────────────────────────────────────

export interface CapstoneProject {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  estimatedHours: number;
  techStack: string[];
  requirements: string[];
  steps: CapstoneStep[];
  thumbnailEmoji: string;
}

export interface CapstoneStep {
  id: string;
  title: string;
  description: string;
}

export const capstoneProjects: CapstoneProject[] = [
  {
    id: 'cap-01',
    title: 'Todo-App',
    description:
      'Baue eine vollstaendige Todo-App mit CRUD-Operationen, LocalStorage-Persistenz und einer modernen UI mit Tailwind CSS.',
    difficulty: 1,
    estimatedHours: 4,
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'LocalStorage'],
    requirements: [
      'Node.js 18+ installiert',
      'Grundkenntnisse in HTML/CSS',
      'Claude Code CLI eingerichtet',
    ],
    steps: [
      {
        id: 'cap-01-s1',
        title: 'Projekt-Setup',
        description:
          'Erstelle ein neues Vite-Projekt mit React und TypeScript. Richte Tailwind CSS ein und erstelle die Grundstruktur.',
      },
      {
        id: 'cap-01-s2',
        title: 'Todo-Komponente',
        description:
          'Erstelle die TodoItem-Komponente mit Checkbox, Text und Loeschen-Button. Nutze Claude Code fuer das UI-Design.',
      },
      {
        id: 'cap-01-s3',
        title: 'State Management',
        description:
          'Implementiere den State mit useState oder useReducer. Fuege Hinzufuegen, Bearbeiten, Loeschen und Toggle hinzu.',
      },
      {
        id: 'cap-01-s4',
        title: 'LocalStorage',
        description:
          'Persistiere die Todos in LocalStorage, damit sie auch nach einem Browser-Refresh erhalten bleiben.',
      },
      {
        id: 'cap-01-s5',
        title: 'Filter & Styling',
        description:
          'Fuege Filter hinzu (Alle, Aktiv, Erledigt) und poliere das Design mit Animationen und Responsive-Layout.',
      },
    ],
    thumbnailEmoji: '\u2705',
  },
  {
    id: 'cap-02',
    title: 'Wetter-Dashboard',
    description:
      'Erstelle ein Wetter-Dashboard, das aktuelle Wetterdaten von einer API abruft und uebersichtlich darstellt.',
    difficulty: 1,
    estimatedHours: 6,
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'OpenWeatherMap API', 'Axios'],
    requirements: [
      'Node.js 18+ installiert',
      'OpenWeatherMap API Key (kostenlos)',
      'Grundkenntnisse in REST APIs',
    ],
    steps: [
      {
        id: 'cap-02-s1',
        title: 'API-Key & Setup',
        description:
          'Registriere dich bei OpenWeatherMap fuer einen kostenlosen API-Key. Erstelle das Projekt mit Vite + React.',
      },
      {
        id: 'cap-02-s2',
        title: 'API-Integration',
        description:
          'Erstelle einen API-Service mit Axios/fetch, der Wetterdaten fuer eine Stadt abruft. Nutze Claude Code fuer die Typisierung.',
      },
      {
        id: 'cap-02-s3',
        title: 'Such-Komponente',
        description:
          'Baue eine Suchleiste mit Autocomplete/Debounce, die Staedte sucht und die Wetterdaten laedt.',
      },
      {
        id: 'cap-02-s4',
        title: 'Wetter-Anzeige',
        description:
          'Zeige Temperatur, Luftfeuchtigkeit, Wind und Wetter-Icons an. Erstelle Cards fuer die 5-Tage-Vorhersage.',
      },
      {
        id: 'cap-02-s5',
        title: 'Favoriten & Themes',
        description:
          'Implementiere eine Favoritenliste fuer Staedte und ein Dark/Light-Theme basierend auf der Tageszeit.',
      },
    ],
    thumbnailEmoji: '\u26C5',
  },
  {
    id: 'cap-03',
    title: 'Blog mit CMS',
    description:
      'Baue einen vollwertigen Blog mit Markdown-Editor, Kategorien, Tags und einem einfachen Admin-Panel.',
    difficulty: 2,
    estimatedHours: 12,
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Markdown'],
    requirements: [
      'Node.js 18+ und PostgreSQL installiert',
      'Grundkenntnisse in Backend-Entwicklung',
      'Claude Code CLI mit MCP-Kenntnissen',
    ],
    steps: [
      {
        id: 'cap-03-s1',
        title: 'Backend-Setup',
        description:
          'Erstelle den Express-Server mit Prisma. Definiere das Schema fuer Posts, Kategorien und Tags.',
      },
      {
        id: 'cap-03-s2',
        title: 'CRUD-API',
        description:
          'Implementiere REST-Endpunkte fuer Posts (Create, Read, Update, Delete) mit Validierung und Error-Handling.',
      },
      {
        id: 'cap-03-s3',
        title: 'Markdown-Editor',
        description:
          'Integriere einen Markdown-Editor im Frontend mit Live-Preview. Nutze Claude Code fuer die Komponenten-Struktur.',
      },
      {
        id: 'cap-03-s4',
        title: 'Kategorien & Tags',
        description:
          'Fuege Kategorie-Filter und Tag-System hinzu. Implementiere die Suche ueber Posts.',
      },
      {
        id: 'cap-03-s5',
        title: 'Admin-Panel',
        description:
          'Erstelle ein einfaches Admin-Panel zum Verwalten von Posts, Kategorien und Draft/Publish-Status.',
      },
      {
        id: 'cap-03-s6',
        title: 'SEO & Performance',
        description:
          'Optimiere Meta-Tags, Open Graph und implementiere Lazy-Loading fuer Bilder.',
      },
    ],
    thumbnailEmoji: '\uD83D\uDCDD',
  },
  {
    id: 'cap-04',
    title: 'E-Commerce Shop',
    description:
      'Entwickle einen funktionalen Online-Shop mit Produktkatalog, Warenkorb, Checkout und Stripe-Integration.',
    difficulty: 2,
    estimatedHours: 16,
    techStack: [
      'React',
      'TypeScript',
      'Node.js',
      'Express',
      'Prisma',
      'PostgreSQL',
      'Stripe',
      'Zustand',
    ],
    requirements: [
      'Node.js 18+ und PostgreSQL installiert',
      'Stripe-Testkonto (kostenlos)',
      'Erfahrung mit State Management',
    ],
    steps: [
      {
        id: 'cap-04-s1',
        title: 'Datenbankschema',
        description:
          'Definiere Prisma-Modelle fuer Products, Categories, Orders und OrderItems. Erstelle Seed-Daten.',
      },
      {
        id: 'cap-04-s2',
        title: 'Produktkatalog',
        description:
          'Baue die Produkt-Uebersicht mit Filter, Sortierung und Detailseiten. Nutze Claude Code fuer responsive Grid-Layouts.',
      },
      {
        id: 'cap-04-s3',
        title: 'Warenkorb',
        description:
          'Implementiere den Warenkorb mit Zustand (Add, Remove, Update Quantity). Persistiere im LocalStorage.',
      },
      {
        id: 'cap-04-s4',
        title: 'Checkout & Stripe',
        description:
          'Integriere Stripe Checkout fuer sichere Zahlungen. Erstelle den Bestellprozess mit Adresseingabe.',
      },
      {
        id: 'cap-04-s5',
        title: 'Order-Management',
        description:
          'Erstelle Bestelluebersicht und -details. Implementiere Bestellstatus-Updates via Webhooks.',
      },
      {
        id: 'cap-04-s6',
        title: 'Testing & Deploy',
        description:
          'Schreibe Tests fuer kritische Flows (Warenkorb, Checkout). Deploye Frontend und Backend.',
      },
    ],
    thumbnailEmoji: '\uD83D\uDED2',
  },
  {
    id: 'cap-05',
    title: 'SaaS Dashboard',
    description:
      'Baue ein professionelles SaaS-Dashboard mit Auth, Team-Management, Analytics-Charts und rollenbasiertem Zugriff.',
    difficulty: 3,
    estimatedHours: 24,
    techStack: [
      'React',
      'TypeScript',
      'Node.js',
      'Express',
      'Prisma',
      'PostgreSQL',
      'JWT',
      'Recharts',
      'Zustand',
    ],
    requirements: [
      'Erfahrung mit Full-Stack-Entwicklung',
      'Kenntnisse in Authentication & Authorization',
      'Claude Code CLI mit Agent-Erfahrung',
    ],
    steps: [
      {
        id: 'cap-05-s1',
        title: 'Auth-System',
        description:
          'Implementiere Registration, Login, JWT-Tokens und Password-Reset. Nutze Claude Code fuer sichere Implementierung.',
      },
      {
        id: 'cap-05-s2',
        title: 'Team-Management',
        description:
          'Erstelle Organisationen und Teams. Implementiere Invite-System und Rollen (Admin, Member, Viewer).',
      },
      {
        id: 'cap-05-s3',
        title: 'Dashboard-Layout',
        description:
          'Baue das Dashboard-Layout mit Sidebar, Header und Content-Area. Implementiere responsive Navigation.',
      },
      {
        id: 'cap-05-s4',
        title: 'Analytics-Charts',
        description:
          'Integriere Recharts fuer Linien-, Balken- und Donut-Charts. Erstelle Mock-Daten fuer die Visualisierung.',
      },
      {
        id: 'cap-05-s5',
        title: 'RBAC & Permissions',
        description:
          'Implementiere rollenbasierten Zugriff (RBAC). Schuetze API-Endpunkte und UI-Elemente basierend auf Rollen.',
      },
      {
        id: 'cap-05-s6',
        title: 'Settings & Profile',
        description:
          'Erstelle Einstellungsseiten fuer Organisation, Team und Benutzer. Implementiere Profilbild-Upload.',
      },
      {
        id: 'cap-05-s7',
        title: 'Deployment',
        description:
          'Deploye die Anwendung mit CI/CD-Pipeline. Richte Monitoring und Error-Tracking ein.',
      },
    ],
    thumbnailEmoji: '\uD83D\uDCCA',
  },
  {
    id: 'cap-06',
    title: 'AI Chatbot',
    description:
      'Entwickle einen AI-Chatbot mit Streaming-Antworten, Conversation-History und Custom-Prompts auf Basis der Anthropic API.',
    difficulty: 3,
    estimatedHours: 20,
    techStack: [
      'React',
      'TypeScript',
      'Node.js',
      'Express',
      'Anthropic API',
      'Server-Sent Events',
      'Prisma',
      'PostgreSQL',
    ],
    requirements: [
      'Anthropic API Key',
      'Erfahrung mit Streaming-APIs',
      'Claude Code CLI mit fortgeschrittenen Prompt-Kenntnissen',
    ],
    steps: [
      {
        id: 'cap-06-s1',
        title: 'API-Setup',
        description:
          'Richte den Express-Server ein und integriere die Anthropic API. Erstelle den Chat-Endpunkt mit Streaming.',
      },
      {
        id: 'cap-06-s2',
        title: 'Chat-UI',
        description:
          'Baue die Chat-Oberflaeche mit Nachrichtenliste, Eingabefeld und Streaming-Anzeige. Nutze Claude Code fuer die UX.',
      },
      {
        id: 'cap-06-s3',
        title: 'Conversation-History',
        description:
          'Speichere Konversationen in der Datenbank. Implementiere Laden, Fortsetzen und Loeschen von Chats.',
      },
      {
        id: 'cap-06-s4',
        title: 'System-Prompts',
        description:
          'Erstelle vordefinierte Personas/System-Prompts, die der User auswaehlen kann (z.B. Code-Reviewer, Tutor).',
      },
      {
        id: 'cap-06-s5',
        title: 'Markdown-Rendering',
        description:
          'Rendere Bot-Antworten als Markdown mit Syntax-Highlighting fuer Code-Bloecke.',
      },
      {
        id: 'cap-06-s6',
        title: 'Rate-Limiting & Auth',
        description:
          'Implementiere Rate-Limiting fuer API-Aufrufe und optionale User-Authentifizierung.',
      },
    ],
    thumbnailEmoji: '\uD83E\uDD16',
  },
];

/** Alle Schwierigkeitsgrade */
export const capstoneProjectDifficulties = [1, 2, 3] as const;

/** i18n-Key fuer Schwierigkeitsgrad */
export function getCapstoneProjectDifficultyKey(d: 1 | 2 | 3): string {
  const keys: Record<number, string> = {
    1: 'projects.difficultyBeginner',
    2: 'projects.difficultyIntermediate',
    3: 'projects.difficultyExpert',
  };
  return keys[d];
}

/** Projekte nach Schwierigkeit filtern */
export function getCapstoneProjectsByDifficulty(difficulty: number): CapstoneProject[] {
  return capstoneProjects.filter((p) => p.difficulty === difficulty);
}
