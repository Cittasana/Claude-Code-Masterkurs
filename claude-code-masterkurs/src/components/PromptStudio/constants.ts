import type {
  PromptCategory,
  PromptTemplate,
  PromptCategoryId,
  ComplexityConfig,
  ProjectComplexity,
  Phase,
  ProjectPlan,
  PlannerFields,
  AnalysisResult,
} from '../../types/promptStudio';

// ─── Category Definitions ───────────────────────────────────────────────────

export const CATEGORIES: PromptCategory[] = [
  { id: 'claude-md', label: 'CLAUDE.md', icon: '\u{1F4CB}', desc: 'Projekt-Instruktionen' },
  { id: 'build-prompts', label: 'Build Prompts', icon: '\u{1F3D7}\uFE0F', desc: 'System-Prompts' },
  { id: 'skills', label: 'Skills', icon: '\u26A1', desc: 'SKILL.md Dateien' },
  { id: 'tools', label: 'Tools', icon: '\u{1F527}', desc: 'Tool-Definitionen' },
  { id: 'hooks', label: 'Hooks', icon: '\u{1FA9D}', desc: 'Event-Hooks' },
  { id: 'mcps', label: 'MCPs', icon: '\u{1F50C}', desc: 'MCP Server Configs' },
  { id: 'agents', label: 'Agenten', icon: '\u{1F916}', desc: 'Agent-Konfiguration' },
];

// ─── Templates & Patterns per Category ──────────────────────────────────────

export const TEMPLATES: Record<PromptCategoryId, PromptTemplate> = {
  'claude-md': {
    fields: [
      { key: 'projectName', label: 'Projektname', type: 'text', placeholder: 'z.B. E-Commerce Dashboard' },
      { key: 'techStack', label: 'Tech Stack', type: 'text', placeholder: 'z.B. Next.js, TypeScript, Prisma, PostgreSQL' },
      { key: 'description', label: 'Projekt-Beschreibung', type: 'textarea', placeholder: 'Was macht das Projekt? Wer ist die Zielgruppe?' },
      { key: 'conventions', label: 'Code-Konventionen', type: 'textarea', placeholder: 'z.B. Naming, Ordnerstruktur, Patterns...' },
      { key: 'rules', label: 'Besondere Regeln', type: 'textarea', placeholder: 'Was soll Claude beachten/vermeiden?' },
      { key: 'context', label: 'Wichtiger Kontext', type: 'textarea', placeholder: 'APIs, Datenbank-Schema, externe Services...' },
    ],
    tips: [
      "Schreibe Instruktionen in der Befehlsform: 'Verwende TypeScript strict mode'",
      'Definiere klare Ordnerstrukturen und Naming-Konventionen',
      'Fuege Beispiele fuer gewuenschte Code-Patterns hinzu',
      'Nutze Sektionen mit ## Headern fuer Uebersichtlichkeit',
      'Halte die Datei unter 2000 Zeilen fuer optimale Performance',
    ],
    analyzeChecks: [
      { label: 'Projektname & Beschreibung vorhanden', check: (t) => /^#\s/.test(t) },
      { label: 'Tech Stack definiert', check: (t) => /tech|stack|framework|library/i.test(t) },
      { label: 'Code-Konventionen spezifiziert', check: (t) => /convention|naming|style|format/i.test(t) },
      { label: 'Klare Instruktionen (Imperativ)', check: (t) => /verwende|nutze|erstelle|beachte|vermeide|always|never|must/i.test(t) },
      { label: 'Sektionen mit Headern strukturiert', check: (t) => (t.match(/^##\s/gm) || []).length >= 3 },
      { label: 'Beispiele enthalten', check: (t) => /beispiel|example|```/i.test(t) },
      { label: 'Keine zu langen Absaetze (< 10 Zeilen)', check: (t) => !t.split('\n\n').some((p) => p.split('\n').length > 10) },
    ],
  },
  'build-prompts': {
    fields: [
      { key: 'role', label: 'Rolle / Persona', type: 'text', placeholder: 'z.B. Senior Full-Stack Developer' },
      { key: 'task', label: 'Hauptaufgabe', type: 'textarea', placeholder: 'Was soll der Agent tun?' },
      { key: 'context', label: 'Kontext', type: 'textarea', placeholder: 'Hintergrundinformationen, Einschraenkungen...' },
      { key: 'outputFormat', label: 'Output-Format', type: 'textarea', placeholder: 'Wie soll die Ausgabe aussehen?' },
      { key: 'constraints', label: 'Einschraenkungen / Regeln', type: 'textarea', placeholder: 'Was soll vermieden werden? Limits?' },
      { key: 'examples', label: 'Beispiele (optional)', type: 'textarea', placeholder: 'Input -> Output Beispiele' },
    ],
    tips: [
      'Beginne mit einer klaren Rollendefinition',
      'Nutze XML-Tags fuer strukturierte Sektionen: <context>, <rules>, <examples>',
      'Definiere Edge Cases und wie damit umgegangen werden soll',
      'Gib positive UND negative Beispiele',
      'Halte den Prompt fokussiert - ein Prompt pro Aufgabe',
      "Verwende Chain-of-Thought: 'Denke Schritt fuer Schritt'",
    ],
    analyzeChecks: [
      { label: 'Klare Rollendefinition', check: (t) => /du bist|you are|role|persona|als/i.test(t) },
      { label: 'Aufgabe definiert', check: (t) => /aufgabe|task|goal|ziel|soll/i.test(t) },
      { label: 'XML-Tags fuer Struktur', check: (t) => /<\w+>/.test(t) },
      { label: 'Output-Format spezifiziert', check: (t) => /format|output|ausgabe|respond|antwort/i.test(t) },
      { label: 'Beispiele vorhanden', check: (t) => /beispiel|example|input.*output|```/i.test(t) },
      { label: 'Einschraenkungen definiert', check: (t) => /nicht|never|avoid|vermeide|don't|constraint/i.test(t) },
      { label: 'Keine vagen Formulierungen', check: (t) => !/vielleicht|maybe|could|eventuell|irgendwie/i.test(t) },
    ],
  },
  skills: {
    fields: [
      { key: 'skillName', label: 'Skill-Name', type: 'text', placeholder: 'z.B. data-analyzer' },
      { key: 'description', label: 'Beschreibung', type: 'textarea', placeholder: 'Was macht der Skill? Wann wird er ausgeloest?' },
      { key: 'triggers', label: 'Trigger-Woerter', type: 'text', placeholder: 'z.B. analyze, data, CSV, chart' },
      { key: 'workflow', label: 'Workflow-Schritte', type: 'textarea', placeholder: 'Schritt 1: ...\nSchritt 2: ...' },
      { key: 'tools', label: 'Benoetigte Tools', type: 'text', placeholder: 'z.B. Bash, Read, Write, WebSearch' },
      { key: 'outputType', label: 'Output-Typ', type: 'text', placeholder: 'z.B. .html, .md, .xlsx, .pdf' },
    ],
    tips: [
      "Name im kebab-case: 'my-cool-skill'",
      'Beschreibung sollte klar sagen WANN der Skill genutzt wird',
      'Definiere Trigger-Woerter fuer automatische Erkennung',
      'Workflow sollte deterministisch und reproduzierbar sein',
      'Inkludiere Error-Handling und Fallback-Strategien',
      'Teste mit Edge Cases: leere Inputs, grosse Dateien, etc.',
    ],
    analyzeChecks: [
      { label: 'Name im richtigen Format', check: (t) => /name:\s*[\w-]+/i.test(t) || /^#\s+[\w-]+/m.test(t) },
      { label: 'Beschreibung vorhanden', check: (t) => /description|beschreibung/i.test(t) },
      { label: 'Trigger definiert', check: (t) => /trigger|MANDATORY|when|wann/i.test(t) },
      { label: 'Workflow-Schritte klar', check: (t) => /step|schritt|1\.|2\.|3\./i.test(t) },
      { label: 'Tools spezifiziert', check: (t) => /bash|read|write|tool/i.test(t) },
      { label: 'Error-Handling beschrieben', check: (t) => /error|fehler|fallback|edge case/i.test(t) },
    ],
  },
  tools: {
    fields: [
      { key: 'toolName', label: 'Tool-Name', type: 'text', placeholder: 'z.B. search_database' },
      { key: 'description', label: 'Beschreibung', type: 'textarea', placeholder: 'Was macht das Tool?' },
      { key: 'parameters', label: 'Parameter (JSON-Schema)', type: 'textarea', placeholder: '{\n  "query": { "type": "string", "description": "..." },\n  "limit": { "type": "number", "default": 10 }\n}' },
      { key: 'required', label: 'Pflicht-Parameter', type: 'text', placeholder: 'z.B. query' },
      { key: 'returns', label: 'Rueckgabe-Format', type: 'textarea', placeholder: 'Was gibt das Tool zurueck?' },
      { key: 'examples', label: 'Nutzungsbeispiele', type: 'textarea', placeholder: 'Beispiel-Aufrufe mit erwarteter Ausgabe' },
    ],
    tips: [
      "Tool-Namen in snake_case: 'search_database'",
      'Beschreibung: Erklaere WANN und WARUM das Tool genutzt wird',
      'Parameter-Beschreibungen sind entscheidend fuer die AI',
      'Definiere sinnvolle Defaults fuer optionale Parameter',
      'Halte Parameter-Anzahl niedrig (max 5-7)',
      'Inkludiere Beispiel-Aufrufe in der Beschreibung',
    ],
    analyzeChecks: [
      { label: 'Tool-Name in snake_case', check: (t) => /[a-z]+_[a-z]+/.test(t) },
      { label: 'Beschreibung vorhanden', check: (t) => /description|beschreibung/i.test(t) && t.length > 50 },
      { label: 'Parameter definiert', check: (t) => /param|parameter|properties|input/i.test(t) },
      { label: 'Typen spezifiziert', check: (t) => /string|number|boolean|array|object/i.test(t) },
      { label: 'Pflichtfelder markiert', check: (t) => /required|pflicht|mandatory/i.test(t) },
      { label: 'Beispiele vorhanden', check: (t) => /example|beispiel|usage/i.test(t) },
    ],
  },
  hooks: {
    fields: [
      { key: 'event', label: 'Event-Typ', type: 'select', options: ['PreToolUse', 'PostToolUse', 'Notification', 'Stop', 'SubagentStop'] },
      { key: 'matcher', label: 'Matcher (Tool/Pattern)', type: 'text', placeholder: 'z.B. Bash, Write, *.test.*' },
      { key: 'hookType', label: 'Hook-Typ', type: 'select', options: ['command (Bash)', 'intercept (Block/Modify)'] },
      { key: 'command', label: 'Command / Script', type: 'textarea', placeholder: 'z.B. eslint --fix $FILE oder Custom Script' },
      { key: 'purpose', label: 'Zweck', type: 'textarea', placeholder: 'Warum dieser Hook? Was wird sichergestellt?' },
    ],
    tips: [
      'PreToolUse: Validierung VOR der Tool-Ausfuehrung',
      'PostToolUse: Aktionen NACH der Tool-Ausfuehrung (z.B. Linting)',
      'Hooks koennen Bash-Commands oder JSON-Responses sein',
      'Nutze Matcher-Patterns um spezifische Tools zu targeten',
      'Halte Hooks schnell - lange Hooks verlangsamen den Workflow',
      'Teste Hooks isoliert bevor du sie in die Config einbaust',
    ],
    analyzeChecks: [
      { label: 'Event-Typ definiert', check: (t) => /PreToolUse|PostToolUse|Notification|Stop/i.test(t) },
      { label: 'Matcher spezifiziert', check: (t) => /matcher|pattern|tool_name/i.test(t) },
      { label: 'Command/Action definiert', check: (t) => /command|script|action/i.test(t) },
      { label: 'Kein Performance-Risiko', check: (t) => !/sleep|wait|timeout [3-9]\d/i.test(t) },
      { label: 'Error-Handling bedacht', check: (t) => /error|fail|exit|catch/i.test(t) },
    ],
  },
  mcps: {
    fields: [
      { key: 'serverName', label: 'MCP Server Name', type: 'text', placeholder: 'z.B. postgres-mcp' },
      { key: 'transport', label: 'Transport', type: 'select', options: ['stdio', 'sse', 'streamable-http'] },
      { key: 'command', label: 'Command', type: 'text', placeholder: 'z.B. npx -y @modelcontextprotocol/server-postgres' },
      { key: 'args', label: 'Argumente', type: 'textarea', placeholder: 'z.B. postgresql://localhost/mydb' },
      { key: 'env', label: 'Environment Variables', type: 'textarea', placeholder: 'z.B. DATABASE_URL=...\nAPI_KEY=...' },
      { key: 'tools', label: 'Bereitgestellte Tools', type: 'textarea', placeholder: 'Welche Tools stellt der MCP Server bereit?' },
    ],
    tips: [
      'Verwende npx fuer einfache Installation ohne globale Deps',
      'Sensitive Daten gehoeren in Environment Variables, nicht in Args',
      'Teste den MCP Server standalone bevor du ihn integrierst',
      'Definiere klar welche Tools der Server bereitstellt',
      'Nutze stdio fuer lokale Server, SSE fuer remote',
      'Dokumentiere die benoetigten Permissions',
    ],
    analyzeChecks: [
      { label: 'Server-Name definiert', check: (t) => /"[^"]+"\s*:/.test(t) || /name|server/i.test(t) },
      { label: 'Command spezifiziert', check: (t) => /command|npx|node|python/i.test(t) },
      { label: 'Transport-Typ gesetzt', check: (t) => /stdio|sse|http/i.test(t) },
      { label: 'Keine Secrets in Args (use ENV)', check: (t) => !/password=\w|token=\w|key=sk-/i.test(t) },
      { label: 'Tools dokumentiert', check: (t) => /tool|function|capability/i.test(t) },
    ],
  },
  agents: {
    fields: [
      { key: 'agentName', label: 'Agent-Name', type: 'text', placeholder: 'z.B. code-reviewer' },
      { key: 'model', label: 'Modell', type: 'select', options: ['claude-sonnet-4-5-20250929', 'claude-opus-4-5-20251101', 'claude-haiku-4-5-20251001'] },
      { key: 'systemPrompt', label: 'System Prompt', type: 'textarea', placeholder: 'Instruktionen fuer den Agenten...' },
      { key: 'tools', label: 'Verfuegbare Tools', type: 'textarea', placeholder: 'Welche Tools darf der Agent nutzen?' },
      { key: 'maxTurns', label: 'Max Turns', type: 'text', placeholder: 'z.B. 10' },
      { key: 'permissions', label: 'Berechtigungen', type: 'textarea', placeholder: 'z.B. Dateisystem lesen/schreiben, Web-Zugriff...' },
    ],
    tips: [
      'Waehle das kleinste Modell das die Aufgabe erfuellt (Kosten!)',
      'Definiere klare Grenzen: Was darf der Agent, was nicht?',
      'Setze max_turns um Endlosschleifen zu vermeiden',
      'Gib dem Agent nur die Tools die er wirklich braucht',
      'Nutze Sub-Agenten fuer komplexe Multi-Step-Workflows',
      'Teste mit Edge Cases und unerwarteten Inputs',
    ],
    analyzeChecks: [
      { label: 'Modell spezifiziert', check: (t) => /claude|model|sonnet|opus|haiku/i.test(t) },
      { label: 'System Prompt vorhanden', check: (t) => /system|prompt|instruction|role/i.test(t) },
      { label: 'Tools definiert', check: (t) => /tool|function|capability/i.test(t) },
      { label: 'Limits gesetzt (max_turns)', check: (t) => /max|limit|turn|timeout/i.test(t) },
      { label: 'Berechtigungen definiert', check: (t) => /permission|allow|deny|restrict/i.test(t) },
      { label: 'Error-Handling spezifiziert', check: (t) => /error|fail|fallback|retry/i.test(t) },
    ],
  },
};

// ─── Smart Field Detection ──────────────────────────────────────────────────
// Detects empty fields or "I don't know" type inputs so the generator
// can infer missing data from the remaining context.

const UNKNOWN_PATTERNS = /^\s*$|^[\s\-?!.]*$|ich\s*wei(ss|ß)\s*(es\s*)?(nicht|net)|keine?\s*ahnung|no\s*idea|k\.?\s*a\.?$|weiss\s*nicht|weiß\s*nicht|kein\s*plan|egal|auto|automatisch|bitte\s*(er)?stell|mach\s*(du|mal)|entscheide|standard|default/i;

/** Returns true when the field is empty or the user defers to the system. */
function isUnknown(value: string | undefined): boolean {
  if (!value) return true;
  return UNKNOWN_PATTERNS.test(value.trim());
}

/** Collects all non-empty, meaningful values into one context string. */
function contextFrom(fields: Record<string, string>): string {
  return Object.values(fields).filter((v) => v && !isUnknown(v)).join(' | ');
}

/** Tries to detect a tech stack from free-text context. */
function inferStack(ctx: string): string {
  const hits: string[] = [];
  if (/next\.?js/i.test(ctx)) hits.push('Next.js');
  else if (/react/i.test(ctx)) hits.push('React');
  else if (/vue/i.test(ctx)) hits.push('Vue 3');
  else if (/svelte/i.test(ctx)) hits.push('SvelteKit');
  else if (/angular/i.test(ctx)) hits.push('Angular');
  if (/typescript|\.tsx?/i.test(ctx)) hits.push('TypeScript');
  else hits.push('TypeScript');
  if (/tailwind/i.test(ctx)) hits.push('Tailwind CSS');
  if (/prisma/i.test(ctx)) hits.push('Prisma');
  if (/drizzle/i.test(ctx)) hits.push('Drizzle ORM');
  if (/postgres/i.test(ctx)) hits.push('PostgreSQL');
  if (/mongo/i.test(ctx)) hits.push('MongoDB');
  if (/supabase/i.test(ctx)) hits.push('Supabase');
  if (/firebase/i.test(ctx)) hits.push('Firebase');
  if (/node|express/i.test(ctx)) hits.push('Node.js');
  if (/python|django|flask|fastapi/i.test(ctx)) hits.push('Python');
  if (hits.length <= 1) return 'React, TypeScript, Tailwind CSS, Vite';
  return [...new Set(hits)].join(', ');
}

/** Derive a project name from description or other context. */
function inferProjectName(fields: Record<string, string>): string {
  const desc = fields.description || fields.task || fields.context || '';
  // Try to grab the first noun-phrase
  const m = desc.match(/(?:eine?[nm]?\s+)?([A-Z\u00C4\u00D6\u00DC][a-z\u00E4\u00F6\u00FC\u00DF-]+(?:\s+[A-Z\u00C4\u00D6\u00DC]?[a-z\u00E4\u00F6\u00FC\u00DF-]+){0,2})/);
  if (m) return m[1];
  if (desc.length > 3) return desc.slice(0, 40).replace(/[^\w\s\u00C4\u00D6\u00DC\u00E4\u00F6\u00FC\u00DF-]/g, '').trim() || 'Mein Projekt';
  return 'Mein Projekt';
}

// ─── Generator Functions (Smart One-Shot) ───────────────────────────────────
// Each generator inspects every field. If the user left it blank or wrote
// something like "ich weiss es nicht", the generator infers a sensible value
// from the remaining fields and produces a COMPLETE one-shot prompt that is
// ready to paste into Claude Code.

function generateClaudeMd(fields: Record<string, string>): string {
  const ctx = contextFrom(fields);
  const projectName = isUnknown(fields.projectName) ? inferProjectName(fields) : fields.projectName;
  const techStack = isUnknown(fields.techStack) ? inferStack(ctx) : fields.techStack;
  const stackList = techStack.split(',').map((t) => t.trim()).filter(Boolean);

  const description = isUnknown(fields.description)
    ? `${projectName} \u2013 Ein modernes Web-Projekt gebaut mit ${stackList.slice(0, 3).join(', ')}.`
    : fields.description;

  const isReact = /react|next|remix|gatsby/i.test(techStack);
  const isVue = /vue|nuxt/i.test(techStack);
  const isPython = /python|django|flask|fastapi/i.test(techStack);
  const hasDb = /prisma|drizzle|sql|mongo|supabase|firebase/i.test(ctx);

  const conventions = isUnknown(fields.conventions)
    ? [
        isReact || isVue ? '- Funktionale Komponenten mit Composition-Pattern verwenden' : null,
        /typescript/i.test(techStack) ? '- TypeScript strict mode aktivieren' : null,
        '- Dateien und Ordner in kebab-case benennen',
        '- Maximale Dateilaenge: 300 Zeilen \u2013 bei Ueberschreitung in Sub-Module splitten',
        '- Imports sortieren: externe Packages \u2192 interne Module \u2192 relative Pfade',
        isPython ? '- PEP 8 Style Guide befolgen, Black als Formatter' : null,
        /tailwind/i.test(techStack) ? '- Tailwind-Klassen statt Inline-Styles \u2013 keine CSS-Module' : null,
        hasDb ? '- Datenbank-Queries nur ueber Repository/Service-Layer \u2013 nie direkt in Routen/Komponenten' : null,
      ].filter(Boolean).join('\n')
    : fields.conventions;

  const rules = isUnknown(fields.rules)
    ? [
        '- Immer explizite TypeScript-Typen definieren \u2013 kein `any`, kein `as unknown`',
        '- Error Handling in ALLEN async Funktionen mit try/catch',
        '- Neue Features IMMER mit Tests abdecken (min. Unit-Tests)',
        '- Keine Magic Numbers \u2013 Konstanten mit sprechenden Namen extrahieren',
        '- Keine console.log in Production-Code \u2013 stattdessen Logger-Utility nutzen',
        '- Sensible Daten (API Keys, Tokens) NIEMALS hardcoden \u2013 Environment Variables nutzen',
        '- Commits in Conventional-Commit-Format: feat:, fix:, refactor:, docs:, test:',
        '- Vor jeder Aenderung bestehenden Code LESEN und VERSTEHEN',
      ].join('\n')
    : fields.rules;

  const context = isUnknown(fields.context)
    ? ''
    : fields.context;

  // Build folder structure based on stack
  let folderStructure: string;
  if (isPython) {
    folderStructure = `\`\`\`
${projectName.toLowerCase().replace(/\s+/g, '-')}/
\u251C\u2500\u2500 app/
\u2502   \u251C\u2500\u2500 api/           # API Routen / Endpoints
\u2502   \u251C\u2500\u2500 models/        # Datenbank-Modelle
\u2502   \u251C\u2500\u2500 services/      # Business-Logik
\u2502   \u251C\u2500\u2500 schemas/       # Pydantic Schemas / Validierung
\u2502   \u2514\u2500\u2500 utils/         # Helpers & Utilities
\u251C\u2500\u2500 tests/             # Test-Dateien
\u251C\u2500\u2500 alembic/           # DB Migrations
\u2514\u2500\u2500 scripts/           # Dev- & Deploy-Skripte
\`\`\``;
  } else {
    folderStructure = `\`\`\`
${projectName.toLowerCase().replace(/\s+/g, '-')}/
\u251C\u2500\u2500 src/
\u2502   \u251C\u2500\u2500 components/    # Wiederverwendbare UI-Komponenten
\u2502   \u251C\u2500\u2500 ${isReact ? 'pages/' : isVue ? 'views/' : 'routes/'}          # Seiten / Route-Komponenten
\u2502   \u251C\u2500\u2500 hooks/         # Custom ${isVue ? 'Composables' : 'Hooks'}
\u2502   \u251C\u2500\u2500 lib/           # Utilities, API-Client, Konfiguration
\u2502   \u251C\u2500\u2500 types/         # TypeScript Type-Definitionen
\u2502   ${hasDb ? '\u251C\u2500\u2500 server/        # Backend / API-Routen\n\u2502   ' : ''}\u2514\u2500\u2500 styles/        # Globale Styles
\u251C\u2500\u2500 tests/             # Unit- & Integration-Tests
\u251C\u2500\u2500 public/            # Statische Assets
\u2514\u2500\u2500 docs/              # Projekt-Dokumentation
\`\`\``;
  }

  return `# ${projectName}

## Projekt-Uebersicht

${description}

## Tech Stack

${stackList.map((t) => `- ${t}`).join('\n')}

## Code-Konventionen

${conventions}

## Regeln & Instruktionen

${rules}

${context ? `## Wichtiger Kontext\n\n${context}\n` : ''}
## Ordnerstruktur

${folderStructure}

## Workflow

1. Vor Code-Aenderungen: Bestehenden Code lesen und verstehen
2. Feature-Branch erstellen: \`git checkout -b feat/feature-name\`
3. Kleine, fokussierte Aenderungen \u2013 ein Commit pro logischer Einheit
4. TypeScript-Fehler und Linting SOFORT beheben
5. Tests schreiben und ausfuehren: \`npm test\` / \`pytest\`
6. Code Review: Diff pruefen bevor committed wird
7. Merge nur nach gruenen Tests

## Verbotene Aktionen

- NIEMALS \`--force\` pushen auf main/master
- NIEMALS Dateien mit Secrets committen (.env, credentials.json)
- NIEMALS \`any\` als Typ verwenden
- NIEMALS die Build-Pipeline ueberspringen

---
*Generiert mit dem Claude Code Masterkurs Prompt Studio*`;
}

function generateBuildPrompt(fields: Record<string, string>): string {
  const ctx = contextFrom(fields);

  const role = isUnknown(fields.role)
    ? ((/design|ui|css|figma/i.test(ctx))
        ? 'ein Senior Frontend-Entwickler und UI/UX-Experte mit 10+ Jahren Erfahrung'
        : (/api|backend|server|datenbank|database/i.test(ctx))
        ? 'ein Senior Backend-Architekt mit Expertise in API-Design und Datenbank-Optimierung'
        : (/devops|deploy|docker|ci|pipeline/i.test(ctx))
        ? 'ein DevOps-Engineer mit Expertise in CI/CD, Containerisierung und Cloud-Infrastruktur'
        : 'ein Senior Full-Stack Developer mit 10+ Jahren Erfahrung in modernen Web-Technologien')
    : fields.role;

  const task = isUnknown(fields.task)
    ? `Analysiere die Anforderungen und implementiere die geforderte Loesung vollstaendig.\nDenke Schritt fuer Schritt. Erstelle zuerst einen Plan, dann implementiere.`
    : fields.task;

  const constraints = isUnknown(fields.constraints)
    ? [
        '- Antworte IMMER mit funktionsfaehigem, getesteten Code',
        '- Erklaere dein Vorgehen Schritt fuer Schritt BEVOR du Code schreibst',
        '- Nutze aktuelle Best Practices und sichere Patterns',
        '- Vermeide Over-Engineering \u2013 die einfachste Loesung die funktioniert',
        '- Schreibe selbst-dokumentierenden Code mit klaren Variablennamen',
        '- Behandle ALLE Edge Cases und Fehlerfaelle',
        '- Keine veralteten oder deprecated APIs verwenden',
        '- Security First: Input-Validierung, keine SQL-Injection, kein XSS',
      ].join('\n')
    : fields.constraints;

  const outputFormat = isUnknown(fields.outputFormat)
    ? [
        '1. Kurze Analyse des Problems (2-3 Saetze)',
        '2. Schritt-fuer-Schritt Plan als nummerierte Liste',
        '3. Vollstaendiger, lauffaehiger Code mit Kommentaren',
        '4. Erklaerung der Schluessel-Entscheidungen',
        '5. Moegliche Verbesserungen / naechste Schritte',
      ].join('\n')
    : fields.outputFormat;

  const context = isUnknown(fields.context) ? '' : fields.context;
  const examples = isUnknown(fields.examples) ? '' : fields.examples;

  return `<system>
Du bist ${role}.

<task>
${task}
</task>

${context ? `<context>\n${context}\n</context>\n` : ''}
<rules>
${constraints}
</rules>

<output_format>
${outputFormat}
</output_format>

${examples ? `<examples>\n${examples}\n</examples>\n` : ''}
<chain_of_thought>
Gehe bei jeder Aufgabe wie folgt vor:
1. VERSTEHE: Was genau wird gefragt? Was sind die Randbedingungen?
2. PLANE: Welche Schritte sind noetig? Welche Abhaengigkeiten gibt es?
3. IMPLEMENTIERE: Schreibe den Code / die Loesung
4. VALIDIERE: Pruefe auf Fehler, Edge Cases, Security
5. DOKUMENTIERE: Erklaere die Schluessel-Entscheidungen
</chain_of_thought>
</system>`;
}

function generateSkill(fields: Record<string, string>): string {
  const ctx = contextFrom(fields);
  const skillName = isUnknown(fields.skillName)
    ? (ctx.match(/[a-z]+-[a-z]+/)?.[0] || 'custom-skill')
    : fields.skillName;

  const description = isUnknown(fields.description)
    ? `Ein Claude Code Skill der automatisch ausgeloest wird und strukturierte Ergebnisse liefert.`
    : fields.description;

  const triggers = isUnknown(fields.triggers)
    ? skillName.split('-').join(', ')
    : fields.triggers;

  const triggerList = triggers.split(',').map((t) => t.trim()).filter(Boolean);

  const tools = isUnknown(fields.tools) ? 'Bash, Read, Write, Glob, Grep' : fields.tools;
  const outputType = isUnknown(fields.outputType) ? '.md' : fields.outputType;

  const workflow = isUnknown(fields.workflow)
    ? [
        `1. User-Input parsen und Parameter extrahieren`,
        `2. Mit Glob/Grep relevante Dateien im Projekt finden`,
        `3. Dateien lesen und Kontext aufbauen`,
        `4. Ergebnis strukturiert aufbereiten`,
        `5. Output als ${outputType}-Datei schreiben`,
        `6. Zusammenfassung an den User ausgeben`,
      ].join('\n')
    : fields.workflow;

  return `---
name: ${skillName}
description: |
  ${description}
  Wird automatisch aktiviert bei bestimmten Schluesselwoertern.
  - MANDATORY TRIGGERS: Use this skill when the user says "${triggerList.join('", "')}"
---

# ${skillName}

## Wann verwenden

Dieser Skill wird aktiviert wenn der User nach folgenden Begriffen fragt:
${triggerList.map((t) => `- "${t}"`).join('\n')}

## Voraussetzungen

- Benoetigte Tools: ${tools}
- Output-Format: ${outputType}
- Erwartete Laufzeit: < 30 Sekunden

## Workflow

${workflow}

## Detaillierte Anweisungen

### Schritt 1: Input-Analyse
- Parse die User-Anfrage nach Schluesselwoertern und Parametern
- Wenn Parameter fehlen: Sinnvolle Defaults verwenden (NICHT nachfragen)
- Validiere, dass mindestens ein verwertbarer Input vorhanden ist

### Schritt 2: Kontext sammeln
- Lies die CLAUDE.md (falls vorhanden) fuer Projekt-Konventionen
- Scanne die Ordnerstruktur mit \`ls\` und \`Glob\`
- Identifiziere relevante Dateien mit \`Grep\`

### Schritt 3: Verarbeitung
- Analysiere die gesammelten Daten
- Wende die Projekt-Konventionen an
- Generiere das Ergebnis nach Best Practices

### Schritt 4: Output
- Schreibe das Ergebnis als ${outputType}-Datei
- Gib eine kurze Zusammenfassung im Chat aus
- Liste offene TODOs wenn vorhanden

## Qualitaetschecks

- [ ] Output ist vollstaendig und sofort nutzbar
- [ ] Projekt-Konventionen aus CLAUDE.md werden beachtet
- [ ] Keine Platzhalter oder TODO-Kommentare im Output
- [ ] Edge Cases sind behandelt
- [ ] Output-Format ist korrekt (${outputType})

## Error Handling

- Bei fehlenden Inputs: Intelligente Defaults verwenden, NICHT den User fragen
- Bei Dateizugriffsfehler: Alternativen Pfad pruefen, dann Warnung ausgeben
- Bei Timeout: Teilresultat speichern und User informieren
- Bei unerwartetem Format: Bestes Ergebnis liefern + Hinweis was manuell geprueft werden sollte

---
*Generiert mit dem Claude Code Masterkurs Prompt Studio*`;
}

function generateTool(fields: Record<string, string>): string {
  const ctx = contextFrom(fields);
  const toolName = isUnknown(fields.toolName)
    ? (ctx.match(/[a-z]+_[a-z]+/)?.[0] || 'custom_tool')
    : fields.toolName;

  const description = isUnknown(fields.description)
    ? `Fuehrt eine spezialisierte Operation aus und gibt strukturierte Ergebnisse zurueck. Verwende dieses Tool wenn der User nach ${toolName.replace(/_/g, ' ')} fragt.`
    : fields.description;

  // Build intelligent parameter schema
  let parsedParams: Record<string, unknown>;
  if (isUnknown(fields.parameters)) {
    // Infer from tool name
    const nameParts = toolName.split('_');
    const params: Record<string, unknown> = {};
    if (/search|find|query|get/.test(nameParts[0])) {
      params.query = { type: 'string', description: 'Suchbegriff oder Filter-Kriterium' };
      params.limit = { type: 'number', description: 'Maximale Anzahl Ergebnisse', default: 10 };
    } else if (/create|add|insert/.test(nameParts[0])) {
      params.data = { type: 'object', description: 'Die zu erstellenden Daten' };
    } else if (/update|modify|edit/.test(nameParts[0])) {
      params.id = { type: 'string', description: 'ID des zu aendernden Eintrags' };
      params.data = { type: 'object', description: 'Die neuen Daten' };
    } else if (/delete|remove/.test(nameParts[0])) {
      params.id = { type: 'string', description: 'ID des zu loeschenden Eintrags' };
    } else {
      params.input = { type: 'string', description: 'Eingabe fuer die Verarbeitung' };
      params.options = { type: 'object', description: 'Optionale Konfiguration', default: {} };
    }
    parsedParams = params;
  } else {
    try { parsedParams = JSON.parse(fields.parameters); }
    catch { parsedParams = { input: { type: 'string', description: 'Eingabe-Parameter' } }; }
  }

  const requiredFields = isUnknown(fields.required)
    ? Object.keys(parsedParams).slice(0, 1)
    : fields.required.split(',').map((r) => r.trim()).filter(Boolean);

  const returns = isUnknown(fields.returns)
    ? `{
  "success": true,
  "data": { /* Ergebnis-Daten */ },
  "metadata": {
    "executionTime": "120ms",
    "resultCount": 5
  }
}`
    : fields.returns;

  const examples = isUnknown(fields.examples)
    ? `// Beispiel 1: Standard-Aufruf
// <tool_use>
// <tool_name>${toolName}</tool_name>
// <input>${JSON.stringify(Object.fromEntries(requiredFields.map((k) => [k, 'beispiel-wert'])), null, 2)}</input>
// </tool_use>
//
// Erwartete Antwort:
// ${returns.split('\n').map((l) => '// ' + l).join('\n')}`
    : fields.examples;

  return `{
  "name": "${toolName}",
  "description": "${description.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
  "input_schema": {
    "type": "object",
    "properties": ${JSON.stringify(parsedParams, null, 6).split('\n').map((l, i) => (i === 0 ? l : '    ' + l)).join('\n')},
    "required": [${requiredFields.map((r) => `"${r}"`).join(', ')}]
  }
}

${examples}

// Erwartete Rueckgabe:
${returns}

// --- Hinweise fuer die Implementierung ---
// - Input immer validieren bevor er verarbeitet wird
// - Bei Fehlern ein strukturiertes Error-Objekt zurueckgeben: { "error": true, "message": "..." }
// - Timeouts beachten: max. 30 Sekunden Ausfuehrungszeit
// - Sensible Daten NICHT in Logs oder Rueckgaben exposen`;
}

function generateHook(fields: Record<string, string>): string {
  const event = isUnknown(fields.event) ? 'PostToolUse' : fields.event;
  const hookType = isUnknown(fields.hookType) ? 'command (Bash)' : fields.hookType;
  const isIntercept = hookType === 'intercept (Block/Modify)';

  const matcher = isUnknown(fields.matcher)
    ? (isIntercept ? 'Bash' : '*')
    : fields.matcher;

  const purpose = isUnknown(fields.purpose)
    ? (isIntercept
        ? `Gefaehrliche Befehle blockieren bevor sie ausgefuehrt werden`
        : event === 'PostToolUse'
        ? `Automatische Qualitaets-Checks nach jeder Tool-Ausfuehrung`
        : `Automatisierte Aktion bei ${event}`)
    : fields.purpose;

  const command = isUnknown(fields.command)
    ? (event === 'PostToolUse' && /write|edit/i.test(matcher)
        ? 'npx eslint --fix "$CLAUDE_FILE" 2>/dev/null || true'
        : event === 'PostToolUse' && /bash/i.test(matcher)
        ? 'echo "[Hook] Command ausgefuehrt: $CLAUDE_TOOL_INPUT" >> .claude/hook-log.txt'
        : 'echo "[Hook] Triggered: ${CLAUDE_TOOL_NAME}" >> .claude/hook-log.txt')
    : fields.command;

  // Generate a complete hook config with explanation
  const eventKey = event.charAt(0).toLowerCase() + event.slice(1);

  let hookBody: string;
  if (isIntercept) {
    hookBody = `{
  "hooks": {
    "${eventKey}": [
      {
        "matcher": "${matcher}",
        "hooks": [
          {
            "type": "intercept",
            "response": {
              "decision": "block",
              "reason": "${purpose}"
            }
          }
        ]
      }
    ]
  }
}`;
  } else {
    hookBody = `{
  "hooks": {
    "${eventKey}": [
      {
        "matcher": "${matcher}",
        "hooks": [
          {
            "type": "command",
            "command": "${command.replace(/"/g, '\\"')}"
          }
        ]
      }
    ]
  }
}`;
  }

  return `// ================================================================
// Hook: ${purpose}
// Event: ${event} | Matcher: ${matcher} | Typ: ${isIntercept ? 'Intercept' : 'Command'}
// ================================================================

${hookBody}

// --- Erklaerung ---
// Event:   ${event}
//          \u2192 Wird ${event.startsWith('Pre') ? 'VOR' : 'NACH'} der Tool-Ausfuehrung getriggert
// Matcher: "${matcher}"
//          \u2192 ${matcher === '*' ? 'Matched auf ALLE Tools' : `Matched nur auf "${matcher}"`}
// Typ:     ${isIntercept ? 'Intercept \u2192 Blockiert/modifiziert die Ausfuehrung' : 'Command \u2192 Fuehrt ein Shell-Command aus'}
//
// Zweck:   ${purpose}
//
// --- Installation ---
// 1. Fuege obige JSON-Config in .claude/settings.json ein
// 2. Starte Claude Code neu (oder /hooks reload)
// 3. Teste den Hook mit einem passenden Command
//
// --- Wichtig ---
// - Hooks sollten SCHNELL sein (< 2s) um den Workflow nicht zu blockieren
// - Verwende "2>/dev/null || true" um zu verhindern dass Hook-Fehler Claude stoppen
// - Teste Hooks ISOLIERT bevor du sie produktiv einsetzt`;
}

function generateMcp(fields: Record<string, string>): string {
  const ctx = contextFrom(fields);

  // Intelligent server detection
  let serverName = isUnknown(fields.serverName) ? '' : fields.serverName;
  let transport = isUnknown(fields.transport) ? 'stdio' : fields.transport;
  let command = isUnknown(fields.command) ? '' : fields.command;
  let args = isUnknown(fields.args) ? '' : fields.args;
  let env = isUnknown(fields.env) ? '' : fields.env;
  let tools = isUnknown(fields.tools) ? '' : fields.tools;

  // Auto-detect well-known MCP servers
  if (/postgres|pg|sql.*datenbank/i.test(ctx) && !serverName) {
    serverName = 'postgres';
    if (!command) command = 'npx';
    if (!args) args = '-y\n@modelcontextprotocol/server-postgres\npostgresql://localhost:5432/mydb';
    if (!tools) tools = 'query \u2013 SQL Queries ausfuehren\nlist_tables \u2013 Tabellen auflisten\ndescribe_table \u2013 Schema anzeigen';
    if (!env) env = 'DATABASE_URL=postgresql://user:password@localhost:5432/mydb';
  } else if (/github|git.*api|issues|pull/i.test(ctx) && !serverName) {
    serverName = 'github';
    if (!command) command = 'npx';
    if (!args) args = '-y\n@modelcontextprotocol/server-github';
    if (!tools) tools = 'search_repositories \u2013 Repos suchen\nget_file_contents \u2013 Dateien lesen\ncreate_issue \u2013 Issues erstellen\ncreate_pull_request \u2013 PRs erstellen';
    if (!env) env = 'GITHUB_PERSONAL_ACCESS_TOKEN=ghp_YOUR_TOKEN_HERE';
  } else if (/filesystem|datei|file|ordner|folder/i.test(ctx) && !serverName) {
    serverName = 'filesystem';
    if (!command) command = 'npx';
    if (!args) args = '-y\n@modelcontextprotocol/server-filesystem\n/Users/you/projects';
    if (!tools) tools = 'read_file \u2013 Dateien lesen\nwrite_file \u2013 Dateien schreiben\nlist_directory \u2013 Ordner auflisten\nsearch_files \u2013 Dateien suchen';
  } else if (/brave|such|search|web/i.test(ctx) && !serverName) {
    serverName = 'brave-search';
    if (!command) command = 'npx';
    if (!args) args = '-y\n@modelcontextprotocol/server-brave-search';
    if (!tools) tools = 'brave_web_search \u2013 Web-Suche\nbrave_local_search \u2013 Lokale Suche';
    if (!env) env = 'BRAVE_API_KEY=YOUR_BRAVE_API_KEY';
  } else if (/slack|chat|team|nachricht/i.test(ctx) && !serverName) {
    serverName = 'slack';
    if (!command) command = 'npx';
    if (!args) args = '-y\n@modelcontextprotocol/server-slack';
    if (!tools) tools = 'send_message \u2013 Nachrichten senden\nread_channel \u2013 Channels lesen\nsearch_messages \u2013 Nachrichten suchen';
    if (!env) env = 'SLACK_BOT_TOKEN=xoxb-YOUR_TOKEN\nSLACK_TEAM_ID=T_YOUR_TEAM';
  } else if (/puppet|browser|screenshot|crawl|scrape/i.test(ctx) && !serverName) {
    serverName = 'puppeteer';
    if (!command) command = 'npx';
    if (!args) args = '-y\n@modelcontextprotocol/server-puppeteer';
    if (!tools) tools = 'navigate \u2013 URL oeffnen\nscreenshot \u2013 Screenshots erstellen\nclick \u2013 Elemente klicken\nevaluate \u2013 JavaScript ausfuehren';
  } else {
    if (!serverName) serverName = 'my-mcp-server';
    if (!command) command = 'npx';
    if (!args) args = '-y\n@your-org/your-mcp-server';
    if (!tools) tools = 'Dokumentiere hier die bereitgestellten Tools';
  }

  const envObj: Record<string, string> = {};
  env.split('\n').filter(Boolean).forEach((line) => {
    const [k, ...v] = line.split('=');
    if (k) envObj[k.trim()] = v.join('=').trim() || 'YOUR_VALUE_HERE';
  });
  const argsList = args.split('\n').filter(Boolean);

  return `// ================================================================
// MCP Server: ${serverName}
// Transport: ${transport} | Command: ${command}
// ================================================================

// Fuer .claude/settings.json:

{
  "mcpServers": {
    "${serverName}": {
      "command": "${command}",
      "args": ${JSON.stringify(argsList, null, 8)},${
  Object.keys(envObj).length > 0 ? `\n      "env": ${JSON.stringify(envObj, null, 8).split('\n').map((l, i) => i === 0 ? l : '      ' + l).join('\n')},` : ''}
      "transport": "${transport}"
    }
  }
}

// --- Bereitgestellte Tools ---
${tools.split('\n').filter(Boolean).map((t) => `// \u2022 ${t}`).join('\n')}

// --- Setup-Anleitung ---
// 1. Obige JSON-Config in .claude/settings.json einfuegen (oder ~/.claude/settings.json fuer global)
${Object.keys(envObj).length > 0 ? `// 2. Environment Variables setzen:\n${Object.entries(envObj).map(([k, v]) => `//    export ${k}="${v}"`).join('\n')}` : '// 2. Keine Environment Variables noetig'}
// 3. Claude Code komplett neu starten (nicht nur Reload)
// 4. Pruefen ob der Server laeuft: \`/mcp\` im Chat eingeben
// 5. Testen: Einen der oben gelisteten Tools aufrufen
//
// --- Troubleshooting ---
// - Server startet nicht? \u2192 \`${command} ${argsList[0] || ''}\` manuell im Terminal testen
// - "Connection refused"? \u2192 Pruefen ob Port/Socket frei ist
// - Tools nicht sichtbar? \u2192 Claude Code komplett neu starten (nicht nur /mcp reload)`;
}

function generateAgent(fields: Record<string, string>): string {
  const ctx = contextFrom(fields);
  const agentName = isUnknown(fields.agentName)
    ? ((/review|code.*check|lint/i.test(ctx)) ? 'code-reviewer'
       : (/test|qa|quality/i.test(ctx)) ? 'test-runner'
       : (/doc|readme|comment/i.test(ctx)) ? 'doc-writer'
       : (/refactor|clean|optimize/i.test(ctx)) ? 'refactorer'
       : 'custom-agent')
    : fields.agentName;

  const model = isUnknown(fields.model) ? 'claude-sonnet-4-5-20250929' : fields.model;
  const maxTurns = isUnknown(fields.maxTurns) ? '15' : fields.maxTurns;

  const systemPrompt = isUnknown(fields.systemPrompt)
    ? (() => {
        if (/review|check/i.test(agentName)) {
          return `Du bist ein erfahrener Code-Reviewer.

Deine Aufgaben:
1. Lies den Code sorgfaeltig und verstehe den Kontext
2. Pruefe auf: Bugs, Security-Probleme, Performance, Best Practices
3. Gib konstruktives Feedback mit konkreten Verbesserungsvorschlaegen
4. Bewerte die Code-Qualitaet auf einer Skala von 1-10

Regeln:
- Sei konstruktiv, nicht destruktiv
- Nenne IMMER die Datei und Zeile bei Findings
- Priorisiere: Critical > Warning > Info
- Maximal 10 Findings pro Review`;
        }
        if (/test/i.test(agentName)) {
          return `Du bist ein Test-Automation-Experte.

Deine Aufgaben:
1. Analysiere den zu testenden Code
2. Schreibe umfassende Unit-Tests
3. Decke Edge Cases und Error-Szenarien ab
4. Fuehre die Tests aus und reporte Ergebnisse

Regeln:
- AAA-Pattern: Arrange, Act, Assert
- Jeder Test testet genau EINE Sache
- Sprechende Test-Namen: "should_return_error_when_input_is_empty"
- Mocks nur wo unbedingt noetig`;
        }
        return `Du bist ein spezialisierter KI-Agent fuer Software-Entwicklung.

Deine Aufgaben:
1. Verstehe die Anforderung vollstaendig
2. Erstelle einen Plan bevor du implementierst
3. Implementiere sauber und vollstaendig
4. Validiere das Ergebnis

Regeln:
- Immer TypeScript mit strikten Typen
- Error Handling in allen Funktionen
- Code muss sofort lauffaehig sein
- Keine Platzhalter oder TODOs`;
      })()
    : fields.systemPrompt;

  const tools = isUnknown(fields.tools)
    ? [
        'Read \u2013 Dateien lesen',
        'Write \u2013 Dateien schreiben',
        'Edit \u2013 Dateien bearbeiten',
        'Bash \u2013 Shell-Befehle ausfuehren',
        'Glob \u2013 Dateien suchen',
        'Grep \u2013 In Dateien suchen',
      ].join('\n')
    : fields.tools;

  const permissions = isUnknown(fields.permissions)
    ? 'filesystem: read-write\nweb: none\nbash: restricted'
    : fields.permissions;

  const permEntries = permissions.split('\n').filter(Boolean).map((p) => {
    const [k, ...v] = p.split(':').map((s) => s.trim());
    return `    ${k || 'default'}: "${v.join(':') || 'read'}"`;
  });

  return `// ================================================================
// Agent: ${agentName}
// Model: ${model} | Max Turns: ${maxTurns}
// ================================================================

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const agentConfig = {
  name: "${agentName}",
  model: "${model}",
  max_turns: ${maxTurns},

  system: \`${systemPrompt}\`,

  tools: [
${tools.split('\n').filter(Boolean).map((t) => `    // ${t.trim()}`).join('\n')}
  ],

  permissions: {
${permEntries.join(',\n')}
  }
};

// --- Agent Loop ---
async function runAgent(userMessage: string) {
  console.log(\`[${agentName}] Starting with: \${userMessage.slice(0, 100)}...\`);
  const messages: Anthropic.Messages.MessageParam[] = [
    { role: "user", content: userMessage }
  ];
  let turns = 0;

  while (turns < agentConfig.max_turns) {
    const response = await client.messages.create({
      model: agentConfig.model,
      max_tokens: 8192,
      system: agentConfig.system,
      messages,
    });

    // Check if agent wants to use a tool
    const toolUse = response.content.find(
      (block): block is Anthropic.Messages.ToolUseBlock => block.type === "tool_use"
    );

    if (!toolUse) {
      // Agent is done \u2013 extract final text response
      const textBlock = response.content.find(
        (block): block is Anthropic.Messages.TextBlock => block.type === "text"
      );
      console.log(\`[${agentName}] Completed in \${turns} turns\`);
      return textBlock?.text || "Agent completed without output.";
    }

    // Execute tool and feed result back
    console.log(\`[${agentName}] Turn \${turns + 1}: Using tool \${toolUse.name}\`);
    const result = await executeTool(toolUse.name, toolUse.input);

    messages.push(
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: [{
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: typeof result === "string" ? result : JSON.stringify(result),
        }],
      }
    );
    turns++;
  }

  console.warn(\`[${agentName}] Max turns (\${agentConfig.max_turns}) reached\`);
  return "Agent reached maximum turns without completing.";
}

// --- Usage ---
// const result = await runAgent("Analysiere die Code-Qualitaet in src/");
// console.log(result);

// Generiert mit dem Claude Code Masterkurs Prompt Studio`;
}

export const GENERATORS: Record<PromptCategoryId, (fields: Record<string, string>) => string> = {
  'claude-md': generateClaudeMd,
  'build-prompts': generateBuildPrompt,
  skills: generateSkill,
  tools: generateTool,
  hooks: generateHook,
  mcps: generateMcp,
  agents: generateAgent,
};

// ─── Analysis Function ─────────────────────────────────────────────────────

export function analyzePrompt(categoryId: PromptCategoryId, text: string): AnalysisResult | null {
  const template = TEMPLATES[categoryId];
  if (!template?.analyzeChecks) return null;

  const results = template.analyzeChecks.map((c) => ({
    label: c.label,
    passed: c.check(text),
  }));

  const score = Math.round((results.filter((r) => r.passed).length / results.length) * 100);

  const suggestions: string[] = [];
  results.filter((r) => !r.passed).forEach((r) => {
    suggestions.push(`Fehlt: ${r.label}`);
  });

  const lines = text.split('\n').length;
  if (lines < 10) suggestions.push('Dein Prompt ist sehr kurz. Mehr Kontext verbessert die Ergebnisse.');
  if (lines > 500) suggestions.push('Dein Prompt ist sehr lang. Ueberlege ob du ihn aufteilen kannst.');

  if (/bitte|please/i.test(text)) suggestions.push("Verwende Imperative statt Bitten: 'Erstelle...' statt 'Bitte erstelle...'");
  if (/etc\.|usw\.|und so weiter/i.test(text)) suggestions.push("Sei spezifisch statt 'etc.' - liste konkrete Beispiele auf.");
  if (text.split('\n\n').some((p) => p.length > 800)) suggestions.push('Teile lange Absaetze in kuerzere, fokussierte Sektionen auf.');

  return { results, score, suggestions, lines };
}

// ─── Optimize Function ──────────────────────────────────────────────────────

export function optimizePrompt(categoryId: PromptCategoryId, text: string): string {
  let optimized = text;

  optimized = optimized.replace(/\bbitte\b\s*/gi, '');
  optimized = optimized.replace(/\bplease\b\s*/gi, '');

  optimized = optimized.replace(/\betc\.?\b/gi, '');
  optimized = optimized.replace(/\busw\.?\b/gi, '');
  optimized = optimized.replace(/\bund so weiter\b/gi, '');

  if (categoryId === 'build-prompts' && !/<\w+>/.test(optimized)) {
    const lines = optimized.split('\n');
    if (lines.length > 5) {
      optimized = `<system>\n${optimized}\n</system>`;
    }
  }

  if (categoryId === 'claude-md' && !/^#\s/.test(optimized)) {
    optimized = '# Projekt-Instruktionen\n\n' + optimized;
  }

  optimized = optimized.replace(/\n{4,}/g, '\n\n\n');

  return optimized;
}

// ─── Project Planner Logic ──────────────────────────────────────────────────

export const PROJECT_COMPLEXITY: Record<ProjectComplexity, ComplexityConfig> = {
  small: { maxPhases: 2, label: 'Klein', desc: 'Landing Page, Script, einfache API', promptLimit: 1 },
  medium: { maxPhases: 5, label: 'Mittel', desc: 'Full-Stack App, Dashboard, SaaS MVP', promptLimit: 3 },
  large: { maxPhases: 10, label: 'Gross', desc: 'Komplexe Plattform, Multi-Service, Enterprise', promptLimit: 999 },
};

const FEATURE_PATTERNS = [
  { pattern: /auth|login|registr|anmeld|sign.?up|passwor|jwt|oauth|session/i, category: 'auth', label: 'Authentifizierung & User-Management', priority: 1 },
  { pattern: /datenbank|database|db|schema|model|prisma|drizzle|sql|mongo|supabase|firebase/i, category: 'database', label: 'Datenbank & Datenmodell', priority: 1 },
  { pattern: /api|endpoint|route|rest|graphql|trpc|server|backend/i, category: 'api', label: 'API & Backend-Logik', priority: 2 },
  { pattern: /ui|frontend|component|layout|design|seite|page|dashboard|navigation|sidebar|header/i, category: 'frontend', label: 'Frontend & UI-Komponenten', priority: 2 },
  { pattern: /deploy|hosting|vercel|netlify|docker|ci.?cd|pipeline|github.?action/i, category: 'deploy', label: 'Deployment & CI/CD', priority: 5 },
  { pattern: /test|jest|vitest|cypress|playwright|e2e|unit|integration/i, category: 'testing', label: 'Testing & Qualitaetssicherung', priority: 4 },
  { pattern: /zahlung|payment|stripe|checkout|billing|subscription|abo/i, category: 'payments', label: 'Zahlungen & Abonnements', priority: 3 },
  { pattern: /email|mail|newsletter|notification|benachrichtig|smtp|resend|sendgrid/i, category: 'notifications', label: 'E-Mail & Benachrichtigungen', priority: 3 },
  { pattern: /upload|datei|file|bild|image|media|storage|s3|blob|cdn/i, category: 'media', label: 'Datei-Upload & Media-Handling', priority: 3 },
  { pattern: /such|search|filter|sort|pagination|infinite.?scroll/i, category: 'search', label: 'Suche, Filter & Pagination', priority: 3 },
  { pattern: /chat|realtime|websocket|echtzeit|live|stream|sse/i, category: 'realtime', label: 'Realtime & Chat-Features', priority: 3 },
  { pattern: /admin|verwaltung|management|dashboard|analytics|statistik|report/i, category: 'admin', label: 'Admin-Panel & Analytics', priority: 4 },
  { pattern: /seo|meta|sitemap|robot|lighthouse|performance|caching|cache/i, category: 'seo', label: 'SEO & Performance-Optimierung', priority: 5 },
  { pattern: /i18n|sprach|language|uebersetz|translat|locale|mehrsprach/i, category: 'i18n', label: 'Internationalisierung (i18n)', priority: 4 },
  { pattern: /security|sicherheit|rate.?limit|cors|csrf|xss|sanitiz|validier/i, category: 'security', label: 'Sicherheit & Validierung', priority: 4 },
];

function generatePhaseTasks(category: string): string[] {
  const taskMap: Record<string, string[]> = {
    auth: [
      'User-Model mit Rollen (admin, user) definieren',
      'Registration-Endpoint mit E-Mail-Validierung',
      'Login mit JWT/Session-Token',
      'Password-Reset-Flow implementieren',
      'Auth-Middleware fuer geschuetzte Routen',
      'Login/Register UI-Komponenten',
    ],
    database: [
      'Datenbank-Schema mit allen Relationen definieren',
      'Migration-Dateien erstellen',
      'Seed-Daten fuer Entwicklung anlegen',
      'Datenbank-Verbindung konfigurieren',
      'CRUD-Operationen als Utility-Funktionen',
    ],
    api: [
      'RESTful API-Routen strukturieren',
      'Request-Validierung mit Zod/Joi',
      'Error-Handling Middleware',
      'Rate Limiting konfigurieren',
      'API-Dokumentation generieren',
    ],
    frontend: [
      'Layout-System (Header, Sidebar, Footer) erstellen',
      'Wiederverwendbare UI-Komponenten bauen',
      'Routing und Navigation einrichten',
      'Formulare mit Validierung implementieren',
      'Responsive Design fuer Mobile/Tablet/Desktop',
      'Loading States und Error Boundaries',
    ],
    deploy: [
      'Build-Konfiguration optimieren',
      'Environment Variables dokumentieren',
      'CI/CD Pipeline (GitHub Actions) aufsetzen',
      'Staging und Production Environment trennen',
      'Monitoring und Error-Tracking einrichten',
    ],
    testing: [
      'Test-Framework konfigurieren',
      'Unit Tests fuer Business-Logik',
      'Integration Tests fuer API-Endpunkte',
      'E2E Tests fuer kritische User-Flows',
      'Test-Coverage Reports einrichten',
    ],
    payments: [
      'Stripe/Payment-Provider SDK integrieren',
      'Checkout-Flow implementieren',
      'Webhook-Handler fuer Payment-Events',
      'Subscription-Management UI',
      'Rechnungen und Zahlungshistorie',
    ],
    notifications: [
      'E-Mail-Service konfigurieren (Resend/SendGrid)',
      'E-Mail-Templates erstellen',
      'Transaktionale E-Mails (Welcome, Reset, etc.)',
      'Newsletter-Subscription implementieren',
      'In-App Benachrichtigungen',
    ],
    media: [
      'Upload-Endpoint mit Groessen-/Typ-Validierung',
      'Cloud Storage (S3/Cloudflare R2) anbinden',
      'Bild-Optimierung und Thumbnail-Generierung',
      'Upload-UI mit Drag & Drop und Progress',
      'Media-Library und Verwaltung',
    ],
    search: [
      'Such-Endpoint mit Full-Text-Search',
      'Filter-System mit mehreren Kriterien',
      'Sortierung nach verschiedenen Feldern',
      'Cursor-basierte Pagination',
      'Such-UI mit Autocomplete',
    ],
    realtime: [
      'WebSocket/SSE Server aufsetzen',
      'Realtime-Events definieren und publishen',
      'Client-seitige Subscription-Logik',
      'Reconnection und Error-Handling',
      'Chat/Live-Update UI-Komponenten',
    ],
    admin: [
      'Admin-Dashboard mit Uebersichts-Metriken',
      'User-Verwaltung (CRUD, Rollen, Status)',
      'Content-Management Interface',
      'System-Logs und Activity-Tracking',
      'Export-Funktionen (CSV, PDF)',
    ],
    seo: [
      'Meta-Tags und OpenGraph-Tags dynamisch setzen',
      'Sitemap.xml und Robots.txt generieren',
      'Structured Data (JSON-LD) hinzufuegen',
      'Performance-Optimierung (Core Web Vitals)',
      'Image-Optimierung und Lazy Loading',
    ],
    i18n: [
      'i18n-Library einrichten',
      'Uebersetzungsdateien strukturieren',
      'Language-Switcher UI',
      'Datums-/Zahlenformatierung pro Locale',
      'SEO-freundliche Sprach-URLs',
    ],
    security: [
      'Input-Validierung und Sanitization',
      'CORS-Konfiguration',
      'Rate Limiting pro Endpoint',
      'CSRF-Schutz implementieren',
      'Security Headers konfigurieren',
    ],
  };
  return taskMap[category] || ['Feature implementieren', 'Tests schreiben', 'Dokumentation erstellen'];
}

export function analyzeProject(projectFields: PlannerFields): ProjectPlan {
  const { name, description, techStack, features, complexity, targetAudience } = projectFields;
  const fullText = `${name || ''} ${description || ''} ${features || ''} ${techStack || ''}`.toLowerCase();

  const detectedFeatures = FEATURE_PATTERNS
    .filter((fp) => fp.pattern.test(fullText))
    .sort((a, b) => a.priority - b.priority);

  const complexityConfig = PROJECT_COMPLEXITY[complexity || 'medium'];

  const phases: Phase[] = [
    {
      id: 'phase-0',
      number: 0,
      title: 'Projekt-Setup & Grundstruktur',
      category: 'setup',
      description: `Projektinitialisierung mit ${techStack || 'dem gewaehlten Tech Stack'}. Ordnerstruktur anlegen, Dependencies installieren, Basis-Konfiguration.`,
      tasks: [
        `Projekt mit ${techStack?.split(',')[0]?.trim() || 'dem Framework'} initialisieren`,
        'Ordnerstruktur nach Best Practices anlegen',
        'TypeScript/Linter/Formatter konfigurieren',
        'CLAUDE.md mit Projekt-Konventionen erstellen',
        'Git Repository initialisieren',
      ],
      estimatedPrompts: 1,
      dependencies: [],
    },
  ];

  detectedFeatures.forEach((feat, idx) => {
    if (idx >= complexityConfig.maxPhases - 1) return;
    const deps: string[] = [];
    if (feat.category === 'api' || feat.category === 'frontend') deps.push('phase-0');
    if (feat.category === 'auth') deps.push('phase-0');
    if (feat.category === 'payments') deps.push('phase-0');
    if (feat.category === 'admin') {
      const authPhase = phases.find((p) => p.category === 'auth');
      if (authPhase) deps.push(authPhase.id);
    }
    if (feat.category === 'testing') {
      deps.push(...phases.filter((p) => p.category !== 'setup' && p.category !== 'deploy').map((p) => p.id));
    }
    if (feat.category === 'deploy' || feat.category === 'seo') {
      deps.push(...phases.slice(0, -1).map((p) => p.id));
    }

    phases.push({
      id: `phase-${idx + 1}`,
      number: idx + 1,
      title: feat.label,
      category: feat.category,
      description: `${feat.label} implementieren fuer ${name || 'das Projekt'}.`,
      tasks: generatePhaseTasks(feat.category),
      estimatedPrompts: feat.priority <= 2 ? 2 : 1,
      dependencies: [...new Set(deps)],
    });
  });

  if (detectedFeatures.length === 0) {
    phases.push(
      { id: 'phase-1', number: 1, title: 'Backend & Datenmodell', category: 'api', description: 'API-Routen und Datenbank-Schema erstellen.', tasks: ['Datenbank-Schema definieren', 'API-Endpunkte implementieren', 'Validierung hinzufuegen'], estimatedPrompts: 2, dependencies: ['phase-0'] },
      { id: 'phase-2', number: 2, title: 'Frontend & UI', category: 'frontend', description: 'User Interface und Komponenten bauen.', tasks: ['Layout-Komponenten erstellen', 'Seiten implementieren', 'API anbinden'], estimatedPrompts: 2, dependencies: ['phase-0'] },
      { id: 'phase-3', number: 3, title: 'Testing & Deployment', category: 'deploy', description: 'Tests schreiben und deployen.', tasks: ['Unit Tests schreiben', 'E2E Tests hinzufuegen', 'Deploy-Pipeline konfigurieren'], estimatedPrompts: 1, dependencies: ['phase-1', 'phase-2'] },
    );
  }

  const totalPrompts = phases.reduce((sum, p) => sum + p.estimatedPrompts, 0);
  const needsMultipleFiles = totalPrompts > complexityConfig.promptLimit;

  return {
    projectName: name || 'Mein Projekt',
    techStack: techStack || '',
    description: description || '',
    features: features || '',
    targetAudience: targetAudience || '',
    complexity: complexity || 'medium',
    phases,
    totalPrompts,
    needsMultipleFiles,
    detectedFeatureCount: detectedFeatures.length,
  };
}

export function generatePhasePrompt(phase: Phase, projectPlan: ProjectPlan): string {
  const { projectName, techStack, description } = projectPlan;
  const depsList = phase.dependencies.length > 0
    ? `\n\nVORAUSSETZUNGEN: Die folgenden Phasen muessen abgeschlossen sein: ${phase.dependencies.map((d) => {
        const dep = projectPlan.phases.find((p) => p.id === d);
        return dep ? `Phase ${dep.number} (${dep.title})` : d;
      }).join(', ')}`
    : '';

  return `# Phase ${phase.number}: ${phase.title}
# Projekt: ${projectName}

<context>
Projekt: ${projectName}
Tech Stack: ${techStack}
Beschreibung: ${description}
Aktuelle Phase: ${phase.number} von ${projectPlan.phases.length - 1}
</context>${depsList}

<task>
Implementiere "${phase.title}" fuer das Projekt "${projectName}".

${phase.description}

## Konkrete Aufgaben:

${phase.tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}
</task>

<rules>
- Verwende den Tech Stack: ${techStack}
- Schreibe sauberen, typisierten Code
- Erstelle fuer jede Datei einen klaren Kommentar-Header
- Halte dich an die bestehende Ordnerstruktur
- Implementiere Error-Handling fuer alle Operationen
- Schreibe mindestens Basis-Tests fuer neue Funktionen
- Committe nach jedem abgeschlossenen Aufgaben-Block
</rules>

<output_format>
1. Erstelle alle noetigen Dateien
2. Zeige die Ordnerstruktur nach den Aenderungen
3. Fuehre Tests aus und zeige Ergebnisse
4. Liste offene TODOs fuer die naechste Phase
</output_format>

---
*Generiert mit dem Claude Code Masterkurs Prompt Studio*
*Phase ${phase.number}/${projectPlan.phases.length - 1} \u2014 ${phase.title}*`;
}

export function generateClaudeMdForProject(projectPlan: ProjectPlan): string {
  const { projectName, techStack, description, phases } = projectPlan;
  return `# ${projectName}

## Projekt-Uebersicht

${description}

## Tech Stack

${techStack ? techStack.split(',').map((t) => `- ${t.trim()}`).join('\n') : '- Noch nicht definiert'}

## Ordnerstruktur

\`\`\`
${projectName.toLowerCase().replace(/\s+/g, '-')}/
\u251C\u2500\u2500 src/
\u2502   \u251C\u2500\u2500 components/    # Wiederverwendbare UI-Komponenten
\u2502   \u251C\u2500\u2500 pages/         # Seiten / Routes
\u2502   \u251C\u2500\u2500 lib/           # Utilities, Helpers, Konfiguration
\u2502   \u251C\u2500\u2500 hooks/         # Custom React Hooks
\u2502   \u251C\u2500\u2500 types/         # TypeScript Type-Definitionen
\u2502   \u251C\u2500\u2500 api/           # API-Routen / Server-Logik
\u2502   \u2514\u2500\u2500 styles/        # Globale Styles
\u251C\u2500\u2500 tests/             # Test-Dateien
\u251C\u2500\u2500 public/            # Statische Assets
\u2514\u2500\u2500 docs/              # Projekt-Dokumentation
\`\`\`

## Implementierungs-Phasen

${phases.map((p) => `### Phase ${p.number}: ${p.title}\n${p.tasks.map((t) => `- [ ] ${t}`).join('\n')}`).join('\n\n')}

## Code-Konventionen

- TypeScript strict mode verwenden
- Funktionale Komponenten mit Hooks
- Dateien in kebab-case benennen
- Maximale Dateigroesse: 300 Zeilen
- Alle Funktionen typisieren (keine \`any\` Types)
- Error Handling in allen async Funktionen
- Aussagekraeftige Variablennamen (deutsch oder englisch, aber konsistent)

## Workflow

1. Bestehenden Code lesen und verstehen bevor Aenderungen gemacht werden
2. Pro Phase: Alle Aufgaben implementieren, dann testen
3. Kleine, fokussierte Commits mit klaren Messages
4. Nach jeder Phase: Code Review und Refactoring

---
*Generiert mit dem Claude Code Masterkurs Prompt Studio*`;
}

export function generateProjectOverview(projectPlan: ProjectPlan): string {
  const { projectName, techStack, description, phases, totalPrompts, targetAudience } = projectPlan;
  return `# ${projectName} \u2014 Implementierungsplan

## Projekt-Ueberblick

**Beschreibung**: ${description}
**Tech Stack**: ${techStack}
${targetAudience ? `**Zielgruppe**: ${targetAudience}` : ''}
**Geschaetzte Prompts**: ${totalPrompts}
**Phasen**: ${phases.length}

## Phasen-Uebersicht

${phases.map((p) => {
  const deps = p.dependencies.length > 0
    ? ` (nach: ${p.dependencies.map((d) => { const dep = phases.find((pp) => pp.id === d); return dep ? `Phase ${dep.number}` : ''; }).filter(Boolean).join(', ')})`
    : '';
  return `### Phase ${p.number}: ${p.title}${deps}
${p.description}
${p.tasks.map((t) => `- ${t}`).join('\n')}
`;
}).join('\n')}

## Reihenfolge der Umsetzung

${phases.map((p) => `${p.number}. **${p.title}** \u2192 Nutze \`phase-${p.number}.md\``).join('\n')}

## Anleitung

1. Lade alle Phase-Dateien herunter
2. Beginne mit \`phase-0.md\` (Projekt-Setup)
3. Oeffne Claude Code in deinem Projektordner
4. Kopiere den Inhalt der Phase-Datei als Prompt
5. Nach Abschluss einer Phase: Naechste Phase starten
6. Die \`CLAUDE.md\` kannst du direkt in dein Projekt-Root legen

---
*Generiert mit dem Claude Code Masterkurs Prompt Studio*`;
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
