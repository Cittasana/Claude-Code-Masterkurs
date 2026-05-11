import { useState, useCallback, useRef } from "react";

// ─── Category Definitions ───────────────────────────────────────────────────
const CATEGORIES = [
  { id: "claude-md", label: "CLAUDE.md", icon: "📋", desc: "Projekt-Instruktionen" },
  { id: "build-prompts", label: "Build Prompts", icon: "🏗️", desc: "System-Prompts" },
  { id: "skills", label: "Skills", icon: "⚡", desc: "SKILL.md Dateien" },
  { id: "tools", label: "Tools", icon: "🔧", desc: "Tool-Definitionen" },
  { id: "hooks", label: "Hooks", icon: "🪝", desc: "Event-Hooks" },
  { id: "mcps", label: "MCPs", icon: "🔌", desc: "MCP Server Configs" },
  { id: "agents", label: "Agenten", icon: "🤖", desc: "Agent-Konfiguration" },
];

// ─── Templates & Patterns per Category ──────────────────────────────────────
const TEMPLATES = {
  "claude-md": {
    fields: [
      { key: "projectName", label: "Projektname", type: "text", placeholder: "z.B. E-Commerce Dashboard" },
      { key: "techStack", label: "Tech Stack", type: "text", placeholder: "z.B. Next.js, TypeScript, Prisma, PostgreSQL" },
      { key: "description", label: "Projekt-Beschreibung", type: "textarea", placeholder: "Was macht das Projekt? Wer ist die Zielgruppe?" },
      { key: "conventions", label: "Code-Konventionen", type: "textarea", placeholder: "z.B. Naming, Ordnerstruktur, Patterns..." },
      { key: "rules", label: "Besondere Regeln", type: "textarea", placeholder: "Was soll Claude beachten/vermeiden?" },
      { key: "context", label: "Wichtiger Kontext", type: "textarea", placeholder: "APIs, Datenbank-Schema, externe Services..." },
    ],
    tips: [
      "Schreibe Instruktionen in der Befehlsform: 'Verwende TypeScript strict mode'",
      "Definiere klare Ordnerstrukturen und Naming-Konventionen",
      "Füge Beispiele für gewünschte Code-Patterns hinzu",
      "Nutze Sektionen mit ## Headern für Übersichtlichkeit",
      "Halte die Datei unter 2000 Zeilen für optimale Performance",
    ],
    analyzeChecks: [
      { label: "Projektname & Beschreibung vorhanden", check: t => /^#\s/.test(t) },
      { label: "Tech Stack definiert", check: t => /tech|stack|framework|library/i.test(t) },
      { label: "Code-Konventionen spezifiziert", check: t => /convention|naming|style|format/i.test(t) },
      { label: "Klare Instruktionen (Imperativ)", check: t => /verwende|nutze|erstelle|beachte|vermeide|always|never|must/i.test(t) },
      { label: "Sektionen mit Headern strukturiert", check: t => (t.match(/^##\s/gm) || []).length >= 3 },
      { label: "Beispiele enthalten", check: t => /beispiel|example|```/i.test(t) },
      { label: "Keine zu langen Absätze (< 10 Zeilen)", check: t => !t.split('\n\n').some(p => p.split('\n').length > 10) },
    ],
  },
  "build-prompts": {
    fields: [
      { key: "role", label: "Rolle / Persona", type: "text", placeholder: "z.B. Senior Full-Stack Developer" },
      { key: "task", label: "Hauptaufgabe", type: "textarea", placeholder: "Was soll der Agent tun?" },
      { key: "context", label: "Kontext", type: "textarea", placeholder: "Hintergrundinformationen, Einschränkungen..." },
      { key: "outputFormat", label: "Output-Format", type: "textarea", placeholder: "Wie soll die Ausgabe aussehen?" },
      { key: "constraints", label: "Einschränkungen / Regeln", type: "textarea", placeholder: "Was soll vermieden werden? Limits?" },
      { key: "examples", label: "Beispiele (optional)", type: "textarea", placeholder: "Input → Output Beispiele" },
    ],
    tips: [
      "Beginne mit einer klaren Rollendefinition",
      "Nutze XML-Tags für strukturierte Sektionen: <context>, <rules>, <examples>",
      "Definiere Edge Cases und wie damit umgegangen werden soll",
      "Gib positive UND negative Beispiele",
      "Halte den Prompt fokussiert - ein Prompt pro Aufgabe",
      "Verwende Chain-of-Thought: 'Denke Schritt für Schritt'",
    ],
    analyzeChecks: [
      { label: "Klare Rollendefinition", check: t => /du bist|you are|role|persona|als/i.test(t) },
      { label: "Aufgabe definiert", check: t => /aufgabe|task|goal|ziel|soll/i.test(t) },
      { label: "XML-Tags für Struktur", check: t => /<\w+>/.test(t) },
      { label: "Output-Format spezifiziert", check: t => /format|output|ausgabe|respond|antwort/i.test(t) },
      { label: "Beispiele vorhanden", check: t => /beispiel|example|input.*output|```/i.test(t) },
      { label: "Einschränkungen definiert", check: t => /nicht|never|avoid|vermeide|don't|constraint/i.test(t) },
      { label: "Keine vagen Formulierungen", check: t => !/vielleicht|maybe|could|eventuell|irgendwie/i.test(t) },
    ],
  },
  "skills": {
    fields: [
      { key: "skillName", label: "Skill-Name", type: "text", placeholder: "z.B. data-analyzer" },
      { key: "description", label: "Beschreibung", type: "textarea", placeholder: "Was macht der Skill? Wann wird er ausgelöst?" },
      { key: "triggers", label: "Trigger-Wörter", type: "text", placeholder: "z.B. analyze, data, CSV, chart" },
      { key: "workflow", label: "Workflow-Schritte", type: "textarea", placeholder: "Schritt 1: ...\nSchritt 2: ..." },
      { key: "tools", label: "Benötigte Tools", type: "text", placeholder: "z.B. Bash, Read, Write, WebSearch" },
      { key: "outputType", label: "Output-Typ", type: "text", placeholder: "z.B. .html, .md, .xlsx, .pdf" },
    ],
    tips: [
      "Name im kebab-case: 'my-cool-skill'",
      "Beschreibung sollte klar sagen WANN der Skill genutzt wird",
      "Definiere Trigger-Wörter für automatische Erkennung",
      "Workflow sollte deterministisch und reproduzierbar sein",
      "Inkludiere Error-Handling und Fallback-Strategien",
      "Teste mit Edge Cases: leere Inputs, große Dateien, etc.",
    ],
    analyzeChecks: [
      { label: "Name im richtigen Format", check: t => /name:\s*[\w-]+/i.test(t) || /^#\s+[\w-]+/m.test(t) },
      { label: "Beschreibung vorhanden", check: t => /description|beschreibung/i.test(t) },
      { label: "Trigger definiert", check: t => /trigger|MANDATORY|when|wann/i.test(t) },
      { label: "Workflow-Schritte klar", check: t => /step|schritt|1\.|2\.|3\./i.test(t) },
      { label: "Tools spezifiziert", check: t => /bash|read|write|tool/i.test(t) },
      { label: "Error-Handling beschrieben", check: t => /error|fehler|fallback|edge case/i.test(t) },
    ],
  },
  "tools": {
    fields: [
      { key: "toolName", label: "Tool-Name", type: "text", placeholder: "z.B. search_database" },
      { key: "description", label: "Beschreibung", type: "textarea", placeholder: "Was macht das Tool?" },
      { key: "parameters", label: "Parameter (JSON-Schema)", type: "textarea", placeholder: '{\n  "query": { "type": "string", "description": "..." },\n  "limit": { "type": "number", "default": 10 }\n}' },
      { key: "required", label: "Pflicht-Parameter", type: "text", placeholder: "z.B. query" },
      { key: "returns", label: "Rückgabe-Format", type: "textarea", placeholder: "Was gibt das Tool zurück?" },
      { key: "examples", label: "Nutzungsbeispiele", type: "textarea", placeholder: "Beispiel-Aufrufe mit erwarteter Ausgabe" },
    ],
    tips: [
      "Tool-Namen in snake_case: 'search_database'",
      "Beschreibung: Erkläre WANN und WARUM das Tool genutzt wird",
      "Parameter-Beschreibungen sind entscheidend für die AI",
      "Definiere sinnvolle Defaults für optionale Parameter",
      "Halte Parameter-Anzahl niedrig (max 5-7)",
      "Inkludiere Beispiel-Aufrufe in der Beschreibung",
    ],
    analyzeChecks: [
      { label: "Tool-Name in snake_case", check: t => /[a-z]+_[a-z]+/.test(t) },
      { label: "Beschreibung vorhanden", check: t => /description|beschreibung/i.test(t) && t.length > 50 },
      { label: "Parameter definiert", check: t => /param|parameter|properties|input/i.test(t) },
      { label: "Typen spezifiziert", check: t => /string|number|boolean|array|object/i.test(t) },
      { label: "Pflichtfelder markiert", check: t => /required|pflicht|mandatory/i.test(t) },
      { label: "Beispiele vorhanden", check: t => /example|beispiel|usage/i.test(t) },
    ],
  },
  "hooks": {
    fields: [
      { key: "event", label: "Event-Typ", type: "select", options: ["PreToolUse", "PostToolUse", "Notification", "Stop", "SubagentStop"] },
      { key: "matcher", label: "Matcher (Tool/Pattern)", type: "text", placeholder: "z.B. Bash, Write, *.test.*" },
      { key: "hookType", label: "Hook-Typ", type: "select", options: ["command (Bash)", "intercept (Block/Modify)"] },
      { key: "command", label: "Command / Script", type: "textarea", placeholder: "z.B. eslint --fix $FILE oder Custom Script" },
      { key: "purpose", label: "Zweck", type: "textarea", placeholder: "Warum dieser Hook? Was wird sichergestellt?" },
    ],
    tips: [
      "PreToolUse: Validierung VOR der Tool-Ausführung",
      "PostToolUse: Aktionen NACH der Tool-Ausführung (z.B. Linting)",
      "Hooks können Bash-Commands oder JSON-Responses sein",
      "Nutze Matcher-Patterns um spezifische Tools zu targeten",
      "Halte Hooks schnell - lange Hooks verlangsamen den Workflow",
      "Teste Hooks isoliert bevor du sie in die Config einbaust",
    ],
    analyzeChecks: [
      { label: "Event-Typ definiert", check: t => /PreToolUse|PostToolUse|Notification|Stop/i.test(t) },
      { label: "Matcher spezifiziert", check: t => /matcher|pattern|tool_name/i.test(t) },
      { label: "Command/Action definiert", check: t => /command|script|action/i.test(t) },
      { label: "Kein Performance-Risiko", check: t => !/sleep|wait|timeout [3-9]\d/i.test(t) },
      { label: "Error-Handling bedacht", check: t => /error|fail|exit|catch/i.test(t) },
    ],
  },
  "mcps": {
    fields: [
      { key: "serverName", label: "MCP Server Name", type: "text", placeholder: "z.B. postgres-mcp" },
      { key: "transport", label: "Transport", type: "select", options: ["stdio", "sse", "streamable-http"] },
      { key: "command", label: "Command", type: "text", placeholder: "z.B. npx -y @modelcontextprotocol/server-postgres" },
      { key: "args", label: "Argumente", type: "textarea", placeholder: "z.B. postgresql://localhost/mydb" },
      { key: "env", label: "Environment Variables", type: "textarea", placeholder: "z.B. DATABASE_URL=...\nAPI_KEY=..." },
      { key: "tools", label: "Bereitgestellte Tools", type: "textarea", placeholder: "Welche Tools stellt der MCP Server bereit?" },
    ],
    tips: [
      "Verwende npx für einfache Installation ohne globale Deps",
      "Sensitive Daten gehören in Environment Variables, nicht in Args",
      "Teste den MCP Server standalone bevor du ihn integrierst",
      "Definiere klar welche Tools der Server bereitstellt",
      "Nutze stdio für lokale Server, SSE für remote",
      "Dokumentiere die benötigten Permissions",
    ],
    analyzeChecks: [
      { label: "Server-Name definiert", check: t => /"[^"]+"\s*:/.test(t) || /name|server/i.test(t) },
      { label: "Command spezifiziert", check: t => /command|npx|node|python/i.test(t) },
      { label: "Transport-Typ gesetzt", check: t => /stdio|sse|http/i.test(t) },
      { label: "Keine Secrets in Args (use ENV)", check: t => !/password=\w|token=\w|key=sk-/i.test(t) },
      { label: "Tools dokumentiert", check: t => /tool|function|capability/i.test(t) },
    ],
  },
  "agents": {
    fields: [
      { key: "agentName", label: "Agent-Name", type: "text", placeholder: "z.B. code-reviewer" },
      { key: "model", label: "Modell", type: "select", options: ["claude-sonnet-4-5-20250929", "claude-opus-4-5-20251101", "claude-haiku-4-5-20251001"] },
      { key: "systemPrompt", label: "System Prompt", type: "textarea", placeholder: "Instruktionen für den Agenten..." },
      { key: "tools", label: "Verfügbare Tools", type: "textarea", placeholder: "Welche Tools darf der Agent nutzen?" },
      { key: "maxTurns", label: "Max Turns", type: "text", placeholder: "z.B. 10" },
      { key: "permissions", label: "Berechtigungen", type: "textarea", placeholder: "z.B. Dateisystem lesen/schreiben, Web-Zugriff..." },
    ],
    tips: [
      "Wähle das kleinste Modell das die Aufgabe erfüllt (Kosten!)",
      "Definiere klare Grenzen: Was darf der Agent, was nicht?",
      "Setze max_turns um Endlosschleifen zu vermeiden",
      "Gib dem Agent nur die Tools die er wirklich braucht",
      "Nutze Sub-Agenten für komplexe Multi-Step-Workflows",
      "Teste mit Edge Cases und unerwarteten Inputs",
    ],
    analyzeChecks: [
      { label: "Modell spezifiziert", check: t => /claude|model|sonnet|opus|haiku/i.test(t) },
      { label: "System Prompt vorhanden", check: t => /system|prompt|instruction|role/i.test(t) },
      { label: "Tools definiert", check: t => /tool|function|capability/i.test(t) },
      { label: "Limits gesetzt (max_turns)", check: t => /max|limit|turn|timeout/i.test(t) },
      { label: "Berechtigungen definiert", check: t => /permission|allow|deny|restrict/i.test(t) },
      { label: "Error-Handling spezifiziert", check: t => /error|fail|fallback|retry/i.test(t) },
    ],
  },
};

// ─── Generator Functions ────────────────────────────────────────────────────
function generateClaudeMd(fields) {
  const { projectName, techStack, description, conventions, rules, context } = fields;
  return `# ${projectName || "Mein Projekt"}

## Projekt-Übersicht

${description || "Beschreibung des Projekts hier einfügen."}

## Tech Stack

${techStack ? techStack.split(",").map(t => `- ${t.trim()}`).join("\n") : "- Noch nicht definiert"}

## Code-Konventionen

${conventions || `- TypeScript strict mode verwenden
- Funktionale Komponenten mit Hooks bevorzugen
- Alle Dateien in kebab-case benennen
- Maximale Dateigröße: 300 Zeilen`}

## Regeln & Instruktionen

${rules || `- Immer TypeScript-Typen explizit definieren
- Keine \`any\` Types verwenden
- Error Handling in allen async Funktionen
- Tests für neue Features schreiben`}

${context ? `## Wichtiger Kontext

${context}` : ""}

## Ordnerstruktur

\`\`\`
src/
├── components/    # UI-Komponenten
├── hooks/         # Custom React Hooks
├── lib/           # Utilities & Helpers
├── types/         # TypeScript Typen
├── api/           # API Routes / Server
└── styles/        # Globale Styles
\`\`\`

## Workflow

1. Vor Code-Änderungen: Bestehenden Code lesen und verstehen
2. Kleine, fokussierte Commits erstellen
3. TypeScript-Fehler sofort beheben
4. Nach Änderungen: Tests ausführen

---
*Generiert mit dem Claude Code Masterkurs Prompt Optimizer*`;
}

function generateBuildPrompt(fields) {
  const { role, task, context, outputFormat, constraints, examples } = fields;
  return `<system>
Du bist ${role || "ein erfahrener Software-Entwickler"}.

<task>
${task || "Beschreibe hier die Hauptaufgabe."}
</task>

${context ? `<context>
${context}
</context>` : ""}

<rules>
${constraints || `- Antworte präzise und strukturiert
- Erkläre dein Vorgehen Schritt für Schritt
- Frage nach wenn etwas unklar ist`}
</rules>

${outputFormat ? `<output_format>
${outputFormat}
</output_format>` : ""}

${examples ? `<examples>
${examples}
</examples>` : ""}
</system>`;
}

function generateSkill(fields) {
  const { skillName, description, triggers, workflow, tools, outputType } = fields;
  return `---
name: ${skillName || "my-skill"}
description: |
  ${description || "Beschreibung des Skills."}
  - MANDATORY TRIGGERS: ${triggers || "keyword1, keyword2"}
---

# ${skillName || "My Skill"}

## Wann verwenden

Dieser Skill wird aktiviert wenn der User nach ${triggers || "bestimmten Keywords"} fragt.

## Voraussetzungen

- Benötigte Tools: ${tools || "Bash, Read, Write"}
- Output-Format: ${outputType || ".md"}

## Workflow

${workflow || `1. User-Input analysieren
2. Relevante Dateien lesen
3. Verarbeitung durchführen
4. Ergebnis generieren und speichern`}

## Qualitätschecks

- [ ] Output ist vollständig und korrekt
- [ ] Keine Fehler oder Warnings
- [ ] Format entspricht den Erwartungen
- [ ] Edge Cases behandelt

## Error Handling

- Bei fehlenden Inputs: User nach Details fragen
- Bei Dateizugriffsfehler: Alternative Pfade prüfen
- Bei Timeout: Teilresultat speichern und informieren

---
*Generiert mit dem Claude Code Masterkurs Prompt Optimizer*`;
}

function generateTool(fields) {
  const { toolName, description, parameters, required, returns, examples } = fields;
  let parsedParams = {};
  try { parsedParams = JSON.parse(parameters || "{}"); } catch(e) { parsedParams = { note: "Parameter hier als JSON-Schema einfügen" }; }

  return `{
  "name": "${toolName || "my_tool"}",
  "description": "${(description || "Beschreibung des Tools").replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
  "input_schema": {
    "type": "object",
    "properties": ${JSON.stringify(parsedParams, null, 6).split('\n').map((l,i) => i === 0 ? l : '    ' + l).join('\n')},
    "required": [${(required || "").split(",").filter(Boolean).map(r => `"${r.trim()}"`).join(", ")}]
  }
}

// Beispiel-Nutzung:
${examples || `// <tool_use>
// <tool_name>${toolName || "my_tool"}</tool_name>
// <input>{ "query": "example" }</input>
// </tool_use>`}

// Erwartete Rückgabe:
${returns || "// JSON-Objekt mit den Ergebnissen"}`;
}

function generateHook(fields) {
  const { event, matcher, hookType, command, purpose } = fields;
  const isIntercept = hookType === "intercept (Block/Modify)";
  return `// Hook: ${purpose || "Beschreibung"}
// Event: ${event || "PostToolUse"}

{
  "hooks": {
    "${(event || "PostToolUse").charAt(0).toLowerCase() + (event || "PostToolUse").slice(1)}": [
      {
        "matcher": "${matcher || "*"}",
        "hooks": [
          {
            "type": "${isIntercept ? "intercept" : "command"}",
            ${isIntercept
              ? `"response": {
              "decision": "block",
              "reason": "Blocked by hook policy"
            }`
              : `"command": "${(command || "echo 'Hook executed'").replace(/"/g, '\\"')}"`
            }
          }
        ]
      }
    ]
  }
}

// ─── Erklärung ───
// Event: ${event || "PostToolUse"} → Wird ${(event || "").startsWith("Pre") ? "VOR" : "NACH"} der Tool-Ausführung getriggert
// Matcher: "${matcher || "*"}" → Matched ${matcher ? `auf "${matcher}"` : "alle Tools"}
// Typ: ${isIntercept ? "Intercept → Kann die Ausführung blockieren/modifizieren" : "Command → Führt ein Bash-Command aus"}
${purpose ? `// Zweck: ${purpose}` : ""}`;
}

function generateMcp(fields) {
  const { serverName, transport, command, args, env, tools } = fields;
  const envObj = {};
  (env || "").split("\n").filter(Boolean).forEach(line => {
    const [k, ...v] = line.split("=");
    if (k) envObj[k.trim()] = v.join("=").trim() || "YOUR_VALUE_HERE";
  });

  return `// .claude/settings.json - MCP Server Konfiguration

{
  "mcpServers": {
    "${serverName || "my-server"}": {
      "command": "${command || "npx"}",
      "args": ${JSON.stringify((args || "").split("\n").filter(Boolean), null, 8)},
      ${Object.keys(envObj).length > 0 ? `"env": ${JSON.stringify(envObj, null, 8)},` : ""}
      "transport": "${transport || "stdio"}"
    }
  }
}

// ─── Bereitgestellte Tools ───
${tools ? tools.split("\n").map(t => `// • ${t}`).join("\n") : "// • Tool-Liste hier dokumentieren"}

// ─── Setup-Anleitung ───
// 1. Obige Config in .claude/settings.json einfügen
// 2. ${env ? "Environment Variables setzen" : "Keine ENV-Variablen nötig"}
// 3. Claude Code neu starten
// 4. Mit /mcp prüfen ob der Server läuft`;
}

function generateAgent(fields) {
  const { agentName, model, systemPrompt, tools, maxTurns, permissions } = fields;
  return `// Agent-Konfiguration: ${agentName || "my-agent"}

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const agentConfig = {
  name: "${agentName || "my-agent"}",
  model: "${model || "claude-sonnet-4-5-20250929"}",
  max_turns: ${maxTurns || 10},

  system: \`${systemPrompt || "Du bist ein hilfreicher Agent."}\`,

  tools: [
    ${(tools || "").split("\n").filter(Boolean).map(t => `// ${t.trim()}`).join("\n    ")}
  ],

  // Berechtigungen
  permissions: {
    ${(permissions || "filesystem: read\nweb: none").split("\n").filter(Boolean).map(p => {
      const [k, v] = p.split(":").map(s => s.trim());
      return `${k || "default"}: "${v || "read"}"`;
    }).join(",\n    ")}
  }
};

// ─── Agent Loop ───
async function runAgent(userMessage) {
  const messages = [{ role: "user", content: userMessage }];
  let turns = 0;

  while (turns < agentConfig.max_turns) {
    const response = await client.messages.create({
      model: agentConfig.model,
      max_tokens: 4096,
      system: agentConfig.system,
      messages,
    });

    // Check for tool use
    const toolUse = response.content.find(c => c.type === "tool_use");
    if (!toolUse) break; // Agent ist fertig

    // Tool ausführen und Ergebnis zurückgeben
    const result = await executeTool(toolUse.name, toolUse.input);
    messages.push(
      { role: "assistant", content: response.content },
      { role: "user", content: [{ type: "tool_result", tool_use_id: toolUse.id, content: result }] }
    );
    turns++;
  }
}

// Generiert mit dem Claude Code Masterkurs Prompt Optimizer`;
}

const GENERATORS = {
  "claude-md": generateClaudeMd,
  "build-prompts": generateBuildPrompt,
  "skills": generateSkill,
  "tools": generateTool,
  "hooks": generateHook,
  "mcps": generateMcp,
  "agents": generateAgent,
};

// ─── Analysis Function ─────────────────────────────────────────────────────
function analyzePrompt(categoryId, text) {
  const template = TEMPLATES[categoryId];
  if (!template?.analyzeChecks) return null;

  const results = template.analyzeChecks.map(c => ({
    label: c.label,
    passed: c.check(text),
  }));

  const score = Math.round((results.filter(r => r.passed).length / results.length) * 100);

  const suggestions = [];
  results.filter(r => !r.passed).forEach(r => {
    suggestions.push(`⚠️ Fehlt: ${r.label}`);
  });

  // Length analysis
  const lines = text.split("\n").length;
  if (lines < 10) suggestions.push("💡 Dein Prompt ist sehr kurz. Mehr Kontext verbessert die Ergebnisse.");
  if (lines > 500) suggestions.push("💡 Dein Prompt ist sehr lang. Überlege ob du ihn aufteilen kannst.");

  // Common anti-patterns
  if (/bitte|please/i.test(text)) suggestions.push("💡 Verwende Imperative statt Bitten: 'Erstelle...' statt 'Bitte erstelle...'");
  if (/etc\.|usw\.|und so weiter/i.test(text)) suggestions.push("💡 Sei spezifisch statt 'etc.' - liste konkrete Beispiele auf.");
  if (text.split("\n\n").some(p => p.length > 800)) suggestions.push("💡 Teile lange Absätze in kürzere, fokussierte Sektionen auf.");

  return { results, score, suggestions, lines };
}

// ─── Optimize Function ──────────────────────────────────────────────────────
function optimizePrompt(categoryId, text) {
  let optimized = text;

  // Remove "bitte" / politeness
  optimized = optimized.replace(/\bbitte\b\s*/gi, "");
  optimized = optimized.replace(/\bplease\b\s*/gi, "");

  // Replace vague terms
  optimized = optimized.replace(/\betc\.?\b/gi, "");
  optimized = optimized.replace(/\busw\.?\b/gi, "");
  optimized = optimized.replace(/\bund so weiter\b/gi, "");

  // Add structure if missing
  if (categoryId === "build-prompts" && !/<\w+>/.test(optimized)) {
    const lines = optimized.split("\n");
    if (lines.length > 5) {
      optimized = `<system>\n${optimized}\n</system>`;
    }
  }

  // Ensure CLAUDE.md has proper header
  if (categoryId === "claude-md" && !/^#\s/.test(optimized)) {
    optimized = "# Projekt-Instruktionen\n\n" + optimized;
  }

  // Clean up multiple blank lines
  optimized = optimized.replace(/\n{4,}/g, "\n\n\n");

  return optimized;
}

// ─── Project Planner Logic ──────────────────────────────────────────────────

const PROJECT_COMPLEXITY = {
  small: { maxPhases: 2, label: "Klein", desc: "Landing Page, Script, einfache API", promptLimit: 1 },
  medium: { maxPhases: 5, label: "Mittel", desc: "Full-Stack App, Dashboard, SaaS MVP", promptLimit: 3 },
  large: { maxPhases: 10, label: "Groß", desc: "Komplexe Plattform, Multi-Service, Enterprise", promptLimit: 999 },
};

// Feature detection patterns for smart phase generation
const FEATURE_PATTERNS = [
  { pattern: /auth|login|registr|anmeld|sign.?up|passwor|jwt|oauth|session/i, category: "auth", label: "Authentifizierung & User-Management", priority: 1 },
  { pattern: /datenbank|database|db|schema|model|prisma|drizzle|sql|mongo|supabase|firebase/i, category: "database", label: "Datenbank & Datenmodell", priority: 1 },
  { pattern: /api|endpoint|route|rest|graphql|trpc|server|backend/i, category: "api", label: "API & Backend-Logik", priority: 2 },
  { pattern: /ui|frontend|component|layout|design|seite|page|dashboard|navigation|sidebar|header/i, category: "frontend", label: "Frontend & UI-Komponenten", priority: 2 },
  { pattern: /deploy|hosting|vercel|netlify|docker|ci.?cd|pipeline|github.?action/i, category: "deploy", label: "Deployment & CI/CD", priority: 5 },
  { pattern: /test|jest|vitest|cypress|playwright|e2e|unit|integration/i, category: "testing", label: "Testing & Qualitätssicherung", priority: 4 },
  { pattern: /zahlung|payment|stripe|checkout|billing|subscription|abo/i, category: "payments", label: "Zahlungen & Abonnements", priority: 3 },
  { pattern: /email|mail|newsletter|notification|benachrichtig|smtp|resend|sendgrid/i, category: "notifications", label: "E-Mail & Benachrichtigungen", priority: 3 },
  { pattern: /upload|datei|file|bild|image|media|storage|s3|blob|cdn/i, category: "media", label: "Datei-Upload & Media-Handling", priority: 3 },
  { pattern: /such|search|filter|sort|pagination|infinite.?scroll/i, category: "search", label: "Suche, Filter & Pagination", priority: 3 },
  { pattern: /chat|realtime|websocket|echtzeit|live|stream|sse/i, category: "realtime", label: "Realtime & Chat-Features", priority: 3 },
  { pattern: /admin|verwaltung|management|dashboard|analytics|statistik|report/i, category: "admin", label: "Admin-Panel & Analytics", priority: 4 },
  { pattern: /seo|meta|sitemap|robot|lighthouse|performance|caching|cache/i, category: "seo", label: "SEO & Performance-Optimierung", priority: 5 },
  { pattern: /i18n|sprach|language|übersetz|translat|locale|mehrsprach/i, category: "i18n", label: "Internationalisierung (i18n)", priority: 4 },
  { pattern: /security|sicherheit|rate.?limit|cors|csrf|xss|sanitiz|validier/i, category: "security", label: "Sicherheit & Validierung", priority: 4 },
];

function analyzeProject(projectFields) {
  const { name, description, techStack, features, complexity, targetAudience } = projectFields;
  const fullText = `${name} ${description} ${features} ${techStack}`.toLowerCase();

  // Detect features from description
  const detectedFeatures = FEATURE_PATTERNS
    .filter(fp => fp.pattern.test(fullText))
    .sort((a, b) => a.priority - b.priority);

  const complexityConfig = PROJECT_COMPLEXITY[complexity || "medium"];

  // Always start with setup phase
  const phases = [
    {
      id: "phase-0",
      number: 0,
      title: "Projekt-Setup & Grundstruktur",
      category: "setup",
      description: `Projektinitialisierung mit ${techStack || "dem gewählten Tech Stack"}. Ordnerstruktur anlegen, Dependencies installieren, Basis-Konfiguration.`,
      tasks: [
        `Projekt mit ${techStack?.split(",")[0]?.trim() || "dem Framework"} initialisieren`,
        "Ordnerstruktur nach Best Practices anlegen",
        "TypeScript/Linter/Formatter konfigurieren",
        "CLAUDE.md mit Projekt-Konventionen erstellen",
        "Git Repository initialisieren",
      ],
      estimatedPrompts: 1,
      dependencies: [],
    },
  ];

  // Generate phases from detected features
  detectedFeatures.forEach((feat, idx) => {
    if (idx >= complexityConfig.maxPhases - 1) return; // Respect complexity limit
    const deps = [];
    if (feat.category === "api" || feat.category === "frontend") deps.push("phase-0");
    if (feat.category === "auth") deps.push("phase-0");
    if (feat.category === "payments") deps.push("phase-0");
    if (feat.category === "admin") {
      const authPhase = phases.find(p => p.category === "auth");
      if (authPhase) deps.push(authPhase.id);
    }
    if (feat.category === "testing") {
      deps.push(...phases.filter(p => p.category !== "setup" && p.category !== "deploy").map(p => p.id));
    }
    if (feat.category === "deploy" || feat.category === "seo") {
      deps.push(...phases.slice(0, -1).map(p => p.id));
    }

    const taskExamples = generatePhaseTasks(feat.category, fullText, techStack);

    phases.push({
      id: `phase-${idx + 1}`,
      number: idx + 1,
      title: feat.label,
      category: feat.category,
      description: `${feat.label} implementieren für ${name || "das Projekt"}.`,
      tasks: taskExamples,
      estimatedPrompts: feat.priority <= 2 ? 2 : 1,
      dependencies: [...new Set(deps)],
    });
  });

  // If no features detected, add generic phases
  if (detectedFeatures.length === 0) {
    phases.push(
      { id: "phase-1", number: 1, title: "Backend & Datenmodell", category: "api", description: "API-Routen und Datenbank-Schema erstellen.", tasks: ["Datenbank-Schema definieren", "API-Endpunkte implementieren", "Validierung hinzufügen"], estimatedPrompts: 2, dependencies: ["phase-0"] },
      { id: "phase-2", number: 2, title: "Frontend & UI", category: "frontend", description: "User Interface und Komponenten bauen.", tasks: ["Layout-Komponenten erstellen", "Seiten implementieren", "API anbinden"], estimatedPrompts: 2, dependencies: ["phase-0"] },
      { id: "phase-3", number: 3, title: "Testing & Deployment", category: "deploy", description: "Tests schreiben und deployen.", tasks: ["Unit Tests schreiben", "E2E Tests hinzufügen", "Deploy-Pipeline konfigurieren"], estimatedPrompts: 1, dependencies: ["phase-1", "phase-2"] },
    );
  }

  const totalPrompts = phases.reduce((sum, p) => sum + p.estimatedPrompts, 0);
  const needsMultipleFiles = totalPrompts > complexityConfig.promptLimit;

  return {
    projectName: name || "Mein Projekt",
    techStack: techStack || "",
    description: description || "",
    features: features || "",
    targetAudience: targetAudience || "",
    complexity: complexity || "medium",
    phases,
    totalPrompts,
    needsMultipleFiles,
    detectedFeatureCount: detectedFeatures.length,
  };
}

function generatePhaseTasks(category, fullText, techStack) {
  const taskMap = {
    auth: [
      "User-Model mit Rollen (admin, user) definieren",
      "Registration-Endpoint mit E-Mail-Validierung",
      "Login mit JWT/Session-Token",
      "Password-Reset-Flow implementieren",
      "Auth-Middleware für geschützte Routen",
      "Login/Register UI-Komponenten",
    ],
    database: [
      "Datenbank-Schema mit allen Relationen definieren",
      "Migration-Dateien erstellen",
      "Seed-Daten für Entwicklung anlegen",
      "Datenbank-Verbindung konfigurieren",
      "CRUD-Operationen als Utility-Funktionen",
    ],
    api: [
      "RESTful API-Routen strukturieren",
      "Request-Validierung mit Zod/Joi",
      "Error-Handling Middleware",
      "Rate Limiting konfigurieren",
      "API-Dokumentation generieren",
    ],
    frontend: [
      "Layout-System (Header, Sidebar, Footer) erstellen",
      "Wiederverwendbare UI-Komponenten bauen",
      "Routing und Navigation einrichten",
      "Formulare mit Validierung implementieren",
      "Responsive Design für Mobile/Tablet/Desktop",
      "Loading States und Error Boundaries",
    ],
    deploy: [
      "Build-Konfiguration optimieren",
      "Environment Variables dokumentieren",
      "CI/CD Pipeline (GitHub Actions) aufsetzen",
      "Staging und Production Environment trennen",
      "Monitoring und Error-Tracking einrichten",
    ],
    testing: [
      "Test-Framework konfigurieren",
      "Unit Tests für Business-Logik",
      "Integration Tests für API-Endpunkte",
      "E2E Tests für kritische User-Flows",
      "Test-Coverage Reports einrichten",
    ],
    payments: [
      "Stripe/Payment-Provider SDK integrieren",
      "Checkout-Flow implementieren",
      "Webhook-Handler für Payment-Events",
      "Subscription-Management UI",
      "Rechnungen und Zahlungshistorie",
    ],
    notifications: [
      "E-Mail-Service konfigurieren (Resend/SendGrid)",
      "E-Mail-Templates erstellen",
      "Transaktionale E-Mails (Welcome, Reset, etc.)",
      "Newsletter-Subscription implementieren",
      "In-App Benachrichtigungen",
    ],
    media: [
      "Upload-Endpoint mit Größen-/Typ-Validierung",
      "Cloud Storage (S3/Cloudflare R2) anbinden",
      "Bild-Optimierung und Thumbnail-Generierung",
      "Upload-UI mit Drag & Drop und Progress",
      "Media-Library und Verwaltung",
    ],
    search: [
      "Such-Endpoint mit Full-Text-Search",
      "Filter-System mit mehreren Kriterien",
      "Sortierung nach verschiedenen Feldern",
      "Cursor-basierte Pagination",
      "Such-UI mit Autocomplete",
    ],
    realtime: [
      "WebSocket/SSE Server aufsetzen",
      "Realtime-Events definieren und publishen",
      "Client-seitige Subscription-Logik",
      "Reconnection und Error-Handling",
      "Chat/Live-Update UI-Komponenten",
    ],
    admin: [
      "Admin-Dashboard mit Übersichts-Metriken",
      "User-Verwaltung (CRUD, Rollen, Status)",
      "Content-Management Interface",
      "System-Logs und Activity-Tracking",
      "Export-Funktionen (CSV, PDF)",
    ],
    seo: [
      "Meta-Tags und OpenGraph-Tags dynamisch setzen",
      "Sitemap.xml und Robots.txt generieren",
      "Structured Data (JSON-LD) hinzufügen",
      "Performance-Optimierung (Core Web Vitals)",
      "Image-Optimierung und Lazy Loading",
    ],
    i18n: [
      "i18n-Library einrichten",
      "Übersetzungsdateien strukturieren",
      "Language-Switcher UI",
      "Datums-/Zahlenformatierung pro Locale",
      "SEO-freundliche Sprach-URLs",
    ],
    security: [
      "Input-Validierung und Sanitization",
      "CORS-Konfiguration",
      "Rate Limiting pro Endpoint",
      "CSRF-Schutz implementieren",
      "Security Headers konfigurieren",
    ],
  };
  return taskMap[category] || ["Feature implementieren", "Tests schreiben", "Dokumentation erstellen"];
}

function generatePhasePrompt(phase, projectPlan) {
  const { projectName, techStack, description } = projectPlan;
  const depsList = phase.dependencies.length > 0
    ? `\n\nVORAUSSETZUNGEN: Die folgenden Phasen müssen abgeschlossen sein: ${phase.dependencies.map(d => {
        const dep = projectPlan.phases.find(p => p.id === d);
        return dep ? `Phase ${dep.number} (${dep.title})` : d;
      }).join(", ")}`
    : "";

  return `# Phase ${phase.number}: ${phase.title}
# Projekt: ${projectName}

<context>
Projekt: ${projectName}
Tech Stack: ${techStack}
Beschreibung: ${description}
Aktuelle Phase: ${phase.number} von ${projectPlan.phases.length - 1}
</context>${depsList}

<task>
Implementiere "${phase.title}" für das Projekt "${projectName}".

${phase.description}

## Konkrete Aufgaben:

${phase.tasks.map((t, i) => `${i + 1}. ${t}`).join("\n")}
</task>

<rules>
- Verwende den Tech Stack: ${techStack}
- Schreibe sauberen, typisierten Code
- Erstelle für jede Datei einen klaren Kommentar-Header
- Halte dich an die bestehende Ordnerstruktur
- Implementiere Error-Handling für alle Operationen
- Schreibe mindestens Basis-Tests für neue Funktionen
- Committe nach jedem abgeschlossenen Aufgaben-Block
</rules>

<output_format>
1. Erstelle alle nötigen Dateien
2. Zeige die Ordnerstruktur nach den Änderungen
3. Führe Tests aus und zeige Ergebnisse
4. Liste offene TODOs für die nächste Phase
</output_format>

---
*Generiert mit dem Claude Code Masterkurs Prompt Studio*
*Phase ${phase.number}/${projectPlan.phases.length - 1} — ${phase.title}*`;
}

function generateClaudeMdForProject(projectPlan) {
  const { projectName, techStack, description, phases } = projectPlan;
  return `# ${projectName}

## Projekt-Übersicht

${description}

## Tech Stack

${techStack ? techStack.split(",").map(t => `- ${t.trim()}`).join("\n") : "- Noch nicht definiert"}

## Ordnerstruktur

\`\`\`
${projectName.toLowerCase().replace(/\s+/g, "-")}/
├── src/
│   ├── components/    # Wiederverwendbare UI-Komponenten
│   ├── pages/         # Seiten / Routes
│   ├── lib/           # Utilities, Helpers, Konfiguration
│   ├── hooks/         # Custom React Hooks
│   ├── types/         # TypeScript Type-Definitionen
│   ├── api/           # API-Routen / Server-Logik
│   └── styles/        # Globale Styles
├── tests/             # Test-Dateien
├── public/            # Statische Assets
└── docs/              # Projekt-Dokumentation
\`\`\`

## Implementierungs-Phasen

${phases.map(p => `### Phase ${p.number}: ${p.title}\n${p.tasks.map(t => `- [ ] ${t}`).join("\n")}`).join("\n\n")}

## Code-Konventionen

- TypeScript strict mode verwenden
- Funktionale Komponenten mit Hooks
- Dateien in kebab-case benennen
- Maximale Dateigröße: 300 Zeilen
- Alle Funktionen typisieren (keine \`any\` Types)
- Error Handling in allen async Funktionen
- Aussagekräftige Variablennamen (deutsch oder englisch, aber konsistent)

## Workflow

1. Bestehenden Code lesen und verstehen bevor Änderungen gemacht werden
2. Pro Phase: Alle Aufgaben implementieren, dann testen
3. Kleine, fokussierte Commits mit klaren Messages
4. Nach jeder Phase: Code Review und Refactoring

---
*Generiert mit dem Claude Code Masterkurs Prompt Studio*`;
}

function generateProjectOverview(projectPlan) {
  const { projectName, techStack, description, phases, totalPrompts, targetAudience } = projectPlan;
  return `# ${projectName} — Implementierungsplan

## Projekt-Überblick

**Beschreibung**: ${description}
**Tech Stack**: ${techStack}
${targetAudience ? `**Zielgruppe**: ${targetAudience}` : ""}
**Geschätzte Prompts**: ${totalPrompts}
**Phasen**: ${phases.length}

## Phasen-Übersicht

${phases.map(p => {
  const deps = p.dependencies.length > 0
    ? ` (nach: ${p.dependencies.map(d => { const dep = phases.find(pp => pp.id === d); return dep ? `Phase ${dep.number}` : ""; }).filter(Boolean).join(", ")})`
    : "";
  return `### Phase ${p.number}: ${p.title}${deps}
${p.description}
${p.tasks.map(t => `- ${t}`).join("\n")}
`;
}).join("\n")}

## Reihenfolge der Umsetzung

${phases.map(p => `${p.number}. **${p.title}** → Nutze \`phase-${p.number}.md\``).join("\n")}

## Anleitung

1. Lade alle Phase-Dateien herunter
2. Beginne mit \`phase-0.md\` (Projekt-Setup)
3. Öffne Claude Code in deinem Projektordner
4. Kopiere den Inhalt der Phase-Datei als Prompt
5. Nach Abschluss einer Phase: Nächste Phase starten
6. Die \`CLAUDE.md\` kannst du direkt in dein Projekt-Root legen

---
*Generiert mit dem Claude Code Masterkurs Prompt Studio*`;
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function PromptOptimizerTool() {
  const [activeCategory, setActiveCategory] = useState("claude-md");
  const [mode, setMode] = useState("generate"); // "generate" | "optimize"
  const [fields, setFields] = useState({});
  const [optimizeInput, setOptimizeInput] = useState("");
  const [output, setOutput] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const outputRef = useRef(null);

  // Planner state
  const [plannerFields, setPlannerFields] = useState({});
  const [projectPlan, setProjectPlan] = useState(null);
  const [activePhaseTab, setActivePhaseTab] = useState(null);
  const [plannerStep, setPlannerStep] = useState("input"); // "input" | "plan" | "prompts"
  const plannerRef = useRef(null);

  const template = TEMPLATES[activeCategory];
  const category = CATEGORIES.find(c => c.id === activeCategory);

  const handleFieldChange = useCallback((key, value) => {
    setFields(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleGenerate = useCallback(() => {
    const gen = GENERATORS[activeCategory];
    if (gen) {
      const result = gen(fields);
      setOutput(result);
      setAnalysis(analyzePrompt(activeCategory, result));
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [activeCategory, fields]);

  const handleOptimize = useCallback(() => {
    if (!optimizeInput.trim()) return;
    const result = analyzePrompt(activeCategory, optimizeInput);
    setAnalysis(result);
    const optimized = optimizePrompt(activeCategory, optimizeInput);
    setOutput(optimized);
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [activeCategory, optimizeInput]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleCategoryChange = useCallback((id) => {
    setActiveCategory(id);
    setFields({});
    setOutput("");
    setAnalysis(null);
    setOptimizeInput("");
  }, []);

  const handlePlannerFieldChange = useCallback((key, value) => {
    setPlannerFields(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleAnalyzeProject = useCallback(() => {
    const plan = analyzeProject(plannerFields);
    setProjectPlan(plan);
    setActivePhaseTab(plan.phases[0]?.id || null);
    setPlannerStep("plan");
    setTimeout(() => plannerRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [plannerFields]);

  const handleDownloadPhase = useCallback((phase) => {
    if (!projectPlan) return;
    const content = generatePhasePrompt(phase, projectPlan);
    downloadTextFile(`phase-${phase.number}-${phase.category}.md`, content);
  }, [projectPlan]);

  const handleDownloadAll = useCallback(() => {
    if (!projectPlan) return;
    // Download overview
    downloadTextFile(`00-uebersicht-${projectPlan.projectName.toLowerCase().replace(/\s+/g, "-")}.md`, generateProjectOverview(projectPlan));
    // Download CLAUDE.md
    setTimeout(() => downloadTextFile("CLAUDE.md", generateClaudeMdForProject(projectPlan)), 200);
    // Download each phase
    projectPlan.phases.forEach((phase, i) => {
      setTimeout(() => {
        downloadTextFile(`phase-${phase.number}-${phase.category}.md`, generatePhasePrompt(phase, projectPlan));
      }, 400 + i * 200);
    });
  }, [projectPlan]);

  const handleBackToInput = useCallback(() => {
    setPlannerStep("input");
    setProjectPlan(null);
  }, []);

  // Styles
  const colors = {
    bg: "#0f1117",
    surface: "#1a1d27",
    surfaceHover: "#242836",
    border: "#2a2e3a",
    accent: "#3b82f6",
    accentHover: "#2563eb",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    textDim: "#64748b",
    success: "#22c55e",
    warning: "#eab308",
    error: "#ef4444",
    green: "#10b981",
    greenBg: "rgba(16,185,129,0.1)",
    redBg: "rgba(239,68,68,0.1)",
    yellowBg: "rgba(234,179,8,0.1)",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: colors.bg, color: colors.text, fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace" }}>

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 260 : 56,
        background: colors.surface,
        borderRight: `1px solid ${colors.border}`,
        transition: "width 0.2s ease",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
      }}>
        <div style={{
          padding: sidebarOpen ? "20px 16px 12px" : "20px 8px 12px",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>⚡ Prompt Studio</div>
              <div style={{ fontSize: 11, color: colors.textDim, marginTop: 2 }}>Claude Code Masterkurs</div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: "none", border: "none", color: colors.textMuted, cursor: "pointer",
            padding: 4, fontSize: 16, lineHeight: 1,
          }}>{sidebarOpen ? "◀" : "▶"}</button>
        </div>

        <nav style={{ flex: 1, padding: "8px", overflowY: "auto" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: sidebarOpen ? "10px 12px" : "10px 8px",
                marginBottom: 2,
                background: activeCategory === cat.id ? `${colors.accent}18` : "transparent",
                border: activeCategory === cat.id ? `1px solid ${colors.accent}40` : "1px solid transparent",
                borderRadius: 8,
                color: activeCategory === cat.id ? colors.accent : colors.textMuted,
                cursor: "pointer",
                textAlign: "left",
                fontSize: 13,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{cat.icon}</span>
              {sidebarOpen && (
                <div>
                  <div style={{ fontWeight: activeCategory === cat.id ? 600 : 400 }}>{cat.label}</div>
                  <div style={{ fontSize: 11, color: colors.textDim, marginTop: 1 }}>{cat.desc}</div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${colors.border}`, fontSize: 11, color: colors.textDim }}>
            v1.0 — claude-code-masterkurs.de
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <header style={{
          padding: "16px 28px",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: colors.surface,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>{mode === "planner" ? "📐" : category.icon}</span>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
                {mode === "planner" ? "Projekt-Planer" : category.label}
              </h1>
              <p style={{ fontSize: 12, color: colors.textDim, margin: 0 }}>
                {mode === "planner" ? "Projekt beschreiben → Struktur analysieren → Prompts generieren" : category.desc}
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div style={{
            display: "flex",
            background: colors.bg,
            borderRadius: 10,
            padding: 3,
            border: `1px solid ${colors.border}`,
          }}>
            {[
              { id: "generate", label: "🏗️ Generieren" },
              { id: "optimize", label: "🔍 Optimieren" },
              { id: "planner", label: "📐 Projekt-Planer" },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setOutput(""); setAnalysis(null); }}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: mode === m.id ? (m.id === "planner" ? "#8b5cf6" : colors.accent) : "transparent",
                  color: mode === m.id ? "#fff" : colors.textMuted,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: mode === m.id ? 600 : 400,
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >{m.label}</button>
            ))}
          </div>
        </header>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>

            {/* GENERATE MODE */}
            {mode === "generate" && (
              <div>
                <div style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  padding: 24,
                  marginBottom: 20,
                }}>
                  <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Konfiguration
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {template.fields.map(field => (
                      <div key={field.key}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: colors.text }}>
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <select
                            value={fields[field.key] || field.options[0]}
                            onChange={e => handleFieldChange(field.key, e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              background: colors.bg,
                              border: `1px solid ${colors.border}`,
                              borderRadius: 8,
                              color: colors.text,
                              fontSize: 13,
                              fontFamily: "inherit",
                              outline: "none",
                            }}
                          >
                            {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : field.type === "textarea" ? (
                          <textarea
                            value={fields[field.key] || ""}
                            onChange={e => handleFieldChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            rows={4}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              background: colors.bg,
                              border: `1px solid ${colors.border}`,
                              borderRadius: 8,
                              color: colors.text,
                              fontSize: 13,
                              fontFamily: "inherit",
                              resize: "vertical",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                        ) : (
                          <input
                            type="text"
                            value={fields[field.key] || ""}
                            onChange={e => handleFieldChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              background: colors.bg,
                              border: `1px solid ${colors.border}`,
                              borderRadius: 8,
                              color: colors.text,
                              fontSize: 13,
                              fontFamily: "inherit",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <button onClick={handleGenerate} style={{
                    marginTop: 20,
                    padding: "12px 28px",
                    background: colors.accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    transition: "background 0.15s",
                    width: "100%",
                  }}>
                    ⚡ Generieren
                  </button>
                </div>

                {/* Tips */}
                <div style={{
                  background: `${colors.accent}08`,
                  border: `1px solid ${colors.accent}25`,
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 20,
                }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px", color: colors.accent }}>
                    💡 Best Practices für {category.label}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {template.tips.map((tip, i) => (
                      <div key={i} style={{ fontSize: 12, color: colors.textMuted, paddingLeft: 12, borderLeft: `2px solid ${colors.accent}30` }}>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* OPTIMIZE MODE */}
            {mode === "optimize" && (
              <div>
                <div style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  padding: 24,
                  marginBottom: 20,
                }}>
                  <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Bestehenden Prompt einfügen
                  </h2>
                  <textarea
                    value={optimizeInput}
                    onChange={e => setOptimizeInput(e.target.value)}
                    placeholder={`Füge hier deinen bestehenden ${category.label} Prompt/Config ein...`}
                    rows={12}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 8,
                      color: colors.text,
                      fontSize: 13,
                      fontFamily: "inherit",
                      resize: "vertical",
                      outline: "none",
                      boxSizing: "border-box",
                      lineHeight: 1.6,
                    }}
                  />
                  <button onClick={handleOptimize} style={{
                    marginTop: 16,
                    padding: "12px 28px",
                    background: colors.accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    width: "100%",
                  }}>
                    🔍 Analysieren & Optimieren
                  </button>
                </div>
              </div>
            )}

            {/* PLANNER MODE */}
            {mode === "planner" && plannerStep === "input" && (
              <div>
                <div style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  padding: 24,
                  marginBottom: 20,
                }}>
                  <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Projekt beschreiben
                  </h2>
                  <p style={{ fontSize: 12, color: colors.textDim, margin: "0 0 20px" }}>
                    Beschreibe dein Projekt so detailliert wie möglich. Die KI erkennt automatisch Features und erstellt einen Implementierungsplan.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                      { key: "name", label: "Projektname", type: "text", placeholder: "z.B. TaskFlow - Projekt-Management App" },
                      { key: "description", label: "Projekt-Beschreibung", type: "textarea", placeholder: "Beschreibe was dein Projekt tut, welches Problem es löst, und wer die Zielgruppe ist.\n\nZ.B.: Eine Projekt-Management App für kleine Teams. User können Projekte anlegen, Aufgaben erstellen und zuweisen, Deadlines setzen und den Fortschritt tracken. Es gibt ein Dashboard mit Übersicht, Kanban-Board und Kalender-Ansicht.", rows: 6 },
                      { key: "techStack", label: "Gewünschter Tech Stack", type: "text", placeholder: "z.B. Next.js, TypeScript, Prisma, PostgreSQL, Tailwind CSS" },
                      { key: "features", label: "Gewünschte Features (detailliert)", type: "textarea", placeholder: "Liste alle Features auf die dein Projekt haben soll:\n\n- User-Authentifizierung mit E-Mail und Google OAuth\n- Dashboard mit Statistiken\n- Kanban-Board mit Drag & Drop\n- Echtzeit-Updates via WebSockets\n- E-Mail-Benachrichtigungen\n- Admin-Panel\n- Stripe-Zahlungen für Pro-Plan\n- ...", rows: 8 },
                      { key: "targetAudience", label: "Zielgruppe (optional)", type: "text", placeholder: "z.B. Freelancer und kleine Teams (2-10 Personen)" },
                    ].map(field => (
                      <div key={field.key}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: colors.text }}>
                          {field.label}
                        </label>
                        {field.type === "textarea" ? (
                          <textarea
                            value={plannerFields[field.key] || ""}
                            onChange={e => handlePlannerFieldChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            rows={field.rows || 4}
                            style={{
                              width: "100%", padding: "10px 12px", background: colors.bg,
                              border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text,
                              fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none",
                              boxSizing: "border-box", lineHeight: 1.6,
                            }}
                          />
                        ) : (
                          <input
                            type="text"
                            value={plannerFields[field.key] || ""}
                            onChange={e => handlePlannerFieldChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            style={{
                              width: "100%", padding: "10px 12px", background: colors.bg,
                              border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text,
                              fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                            }}
                          />
                        )}
                      </div>
                    ))}

                    {/* Complexity Selector */}
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8, color: colors.text }}>
                        Projekt-Komplexität
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        {Object.entries(PROJECT_COMPLEXITY).map(([key, val]) => (
                          <button
                            key={key}
                            onClick={() => handlePlannerFieldChange("complexity", key)}
                            style={{
                              padding: "12px",
                              background: (plannerFields.complexity || "medium") === key ? "#8b5cf620" : colors.bg,
                              border: `1px solid ${(plannerFields.complexity || "medium") === key ? "#8b5cf6" : colors.border}`,
                              borderRadius: 8, cursor: "pointer", textAlign: "left",
                              color: (plannerFields.complexity || "medium") === key ? "#8b5cf6" : colors.textMuted,
                              fontFamily: "inherit",
                            }}
                          >
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{val.label}</div>
                            <div style={{ fontSize: 11, marginTop: 4, color: colors.textDim }}>{val.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button onClick={handleAnalyzeProject} disabled={!plannerFields.description} style={{
                    marginTop: 20, padding: "14px 28px", width: "100%",
                    background: plannerFields.description ? "#8b5cf6" : colors.border,
                    color: plannerFields.description ? "#fff" : colors.textDim,
                    border: "none", borderRadius: 8, cursor: plannerFields.description ? "pointer" : "not-allowed",
                    fontSize: 15, fontWeight: 600, fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}>
                    📐 Projekt analysieren & Plan erstellen
                  </button>
                </div>

                {/* Planner Tips */}
                <div style={{
                  background: "rgba(139,92,246,0.05)",
                  border: "1px solid rgba(139,92,246,0.15)",
                  borderRadius: 12, padding: 20,
                }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px", color: "#8b5cf6" }}>
                    💡 Tipps für bessere Ergebnisse
                  </h3>
                  {[
                    "Je detaillierter die Feature-Beschreibung, desto besser die Prompts",
                    "Nenne konkrete Tools/Libraries die du verwenden willst",
                    "Beschreibe auch nicht-funktionale Anforderungen (Performance, SEO, etc.)",
                    "Erwähne externe Services (Stripe, SendGrid, S3, etc.)",
                    "Bei großen Projekten: 'Groß' wählen für mehr Phasen und granulare Prompts",
                  ].map((tip, i) => (
                    <div key={i} style={{ fontSize: 12, color: colors.textMuted, paddingLeft: 12, borderLeft: "2px solid rgba(139,92,246,0.3)", marginBottom: 8 }}>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PLANNER: Plan View */}
            {mode === "planner" && plannerStep === "plan" && projectPlan && (
              <div ref={plannerRef}>
                {/* Plan Overview Card */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.05) 100%)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  borderRadius: 12, padding: 24, marginBottom: 20,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: colors.text }}>
                        {projectPlan.projectName}
                      </h2>
                      <p style={{ fontSize: 13, color: colors.textMuted, margin: "4px 0 0" }}>
                        {projectPlan.description.slice(0, 120)}{projectPlan.description.length > 120 ? "..." : ""}
                      </p>
                    </div>
                    <button onClick={handleBackToInput} style={{
                      padding: "6px 12px", background: colors.bg, border: `1px solid ${colors.border}`,
                      borderRadius: 6, color: colors.textMuted, cursor: "pointer", fontSize: 12, fontFamily: "inherit",
                    }}>
                      ← Zurück
                    </button>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                    {[
                      { label: "Phasen", value: projectPlan.phases.length, color: "#8b5cf6" },
                      { label: "Prompts gesamt", value: projectPlan.totalPrompts, color: colors.accent },
                      { label: "Features erkannt", value: projectPlan.detectedFeatureCount, color: colors.green },
                      { label: "Dateien", value: projectPlan.needsMultipleFiles ? `${projectPlan.phases.length + 2} .md` : "1 Prompt", color: colors.warning },
                    ].map((stat, i) => (
                      <div key={i} style={{
                        background: colors.surface, borderRadius: 8, padding: "12px 14px",
                        border: `1px solid ${colors.border}`,
                      }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: 11, color: colors.textDim, marginTop: 2 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download All Button */}
                <div style={{
                  background: colors.surface, border: `1px solid ${colors.border}`,
                  borderRadius: 12, padding: 16, marginBottom: 20,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                      Alle Dateien herunterladen
                    </div>
                    <div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>
                      Übersicht + CLAUDE.md + {projectPlan.phases.length} Phase-Prompts als .md Dateien
                    </div>
                  </div>
                  <button onClick={handleDownloadAll} style={{
                    padding: "10px 24px", background: "#8b5cf6", color: "#fff",
                    border: "none", borderRadius: 8, cursor: "pointer",
                    fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    📦 Alle herunterladen ({projectPlan.phases.length + 2} Dateien)
                  </button>
                </div>

                {/* Phase Tabs */}
                <div style={{
                  display: "flex", gap: 4, overflowX: "auto", marginBottom: 4,
                  padding: "0 0 8px",
                }}>
                  {projectPlan.phases.map(phase => (
                    <button
                      key={phase.id}
                      onClick={() => setActivePhaseTab(phase.id)}
                      style={{
                        padding: "8px 14px",
                        background: activePhaseTab === phase.id ? colors.surface : "transparent",
                        border: `1px solid ${activePhaseTab === phase.id ? colors.border : "transparent"}`,
                        borderBottom: activePhaseTab === phase.id ? `2px solid #8b5cf6` : "2px solid transparent",
                        borderRadius: "8px 8px 0 0",
                        color: activePhaseTab === phase.id ? "#8b5cf6" : colors.textDim,
                        cursor: "pointer", fontSize: 12, fontFamily: "inherit",
                        whiteSpace: "nowrap", flexShrink: 0,
                        fontWeight: activePhaseTab === phase.id ? 600 : 400,
                      }}
                    >
                      Phase {phase.number}
                    </button>
                  ))}
                </div>

                {/* Active Phase Detail */}
                {projectPlan.phases.filter(p => p.id === activePhaseTab).map(phase => (
                  <div key={phase.id} style={{
                    background: colors.surface, border: `1px solid ${colors.border}`,
                    borderRadius: "0 12px 12px 12px", overflow: "hidden",
                  }}>
                    {/* Phase Header */}
                    <div style={{
                      padding: "16px 20px",
                      borderBottom: `1px solid ${colors.border}`,
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: colors.text }}>
                          Phase {phase.number}: {phase.title}
                        </h3>
                        <p style={{ fontSize: 12, color: colors.textDim, margin: "4px 0 0" }}>
                          {phase.description}
                          {phase.dependencies.length > 0 && (
                            <span style={{ color: colors.warning, marginLeft: 8 }}>
                              → Abhängig von: {phase.dependencies.map(d => {
                                const dep = projectPlan.phases.find(p => p.id === d);
                                return dep ? `Phase ${dep.number}` : "";
                              }).filter(Boolean).join(", ")}
                            </span>
                          )}
                        </p>
                      </div>
                      <button onClick={() => handleDownloadPhase(phase)} style={{
                        padding: "8px 16px", background: "#8b5cf620", color: "#8b5cf6",
                        border: "1px solid #8b5cf640", borderRadius: 6, cursor: "pointer",
                        fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        ⬇ phase-{phase.number}.md
                      </button>
                    </div>

                    {/* Tasks */}
                    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${colors.border}` }}>
                      <h4 style={{ fontSize: 12, fontWeight: 600, margin: "0 0 10px", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Aufgaben in dieser Phase
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {phase.tasks.map((task, i) => (
                          <div key={i} style={{
                            display: "flex", alignItems: "flex-start", gap: 8,
                            padding: "8px 10px", borderRadius: 6,
                            background: colors.bg, fontSize: 13,
                          }}>
                            <span style={{ color: "#8b5cf6", fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>
                            <span style={{ color: colors.text }}>{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prompt Preview */}
                    <div style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <h4 style={{ fontSize: 12, fontWeight: 600, margin: 0, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Prompt-Vorschau
                        </h4>
                        <button onClick={() => {
                          navigator.clipboard.writeText(generatePhasePrompt(phase, projectPlan));
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }} style={{
                          padding: "4px 10px",
                          background: copied ? colors.green : colors.bg,
                          border: `1px solid ${copied ? colors.green : colors.border}`,
                          borderRadius: 6, color: copied ? "#fff" : colors.textMuted,
                          cursor: "pointer", fontSize: 11, fontFamily: "inherit",
                        }}>
                          {copied ? "✓ Kopiert!" : "📋 Kopieren"}
                        </button>
                      </div>
                      <pre style={{
                        margin: 0, padding: 16, background: colors.bg,
                        borderRadius: 8, border: `1px solid ${colors.border}`,
                        fontSize: 12, lineHeight: 1.6, color: colors.text,
                        overflow: "auto", maxHeight: 400, whiteSpace: "pre-wrap", wordBreak: "break-word",
                      }}>
                        {generatePhasePrompt(phase, projectPlan)}
                      </pre>
                    </div>
                  </div>
                ))}

                {/* Dependency Graph (Visual) */}
                <div style={{
                  background: colors.surface, border: `1px solid ${colors.border}`,
                  borderRadius: 12, padding: 20, marginTop: 20,
                }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 16px", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Implementierungs-Reihenfolge
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {projectPlan.phases.map((phase, idx) => (
                      <div key={phase.id} style={{
                        display: "flex", alignItems: "center", gap: 12,
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: activePhaseTab === phase.id ? "#8b5cf6" : colors.bg,
                          border: `2px solid ${activePhaseTab === phase.id ? "#8b5cf6" : colors.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 13, fontWeight: 700, flexShrink: 0,
                          color: activePhaseTab === phase.id ? "#fff" : colors.textDim,
                          cursor: "pointer",
                        }} onClick={() => setActivePhaseTab(phase.id)}>
                          {phase.number}
                        </div>
                        {idx < projectPlan.phases.length - 1 && (
                          <div style={{ position: "absolute", left: 23, top: 32, width: 2, height: 8, background: colors.border }} />
                        )}
                        <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setActivePhaseTab(phase.id)}>
                          <div style={{
                            fontSize: 13, fontWeight: activePhaseTab === phase.id ? 600 : 400,
                            color: activePhaseTab === phase.id ? "#8b5cf6" : colors.text,
                          }}>
                            {phase.title}
                          </div>
                          <div style={{ fontSize: 11, color: colors.textDim }}>
                            {phase.tasks.length} Aufgaben · ~{phase.estimatedPrompts} Prompt{phase.estimatedPrompts !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <button onClick={() => handleDownloadPhase(phase)} style={{
                          padding: "4px 10px", background: "none",
                          border: `1px solid ${colors.border}`, borderRadius: 4,
                          color: colors.textDim, cursor: "pointer", fontSize: 11, fontFamily: "inherit",
                        }}>
                          ⬇ .md
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {analysis && mode !== "planner" && (
              <div ref={mode === "optimize" ? outputRef : null} style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: 24,
                marginBottom: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Analyse
                  </h2>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    background: analysis.score >= 80 ? colors.greenBg : analysis.score >= 50 ? colors.yellowBg : colors.redBg,
                    color: analysis.score >= 80 ? colors.green : analysis.score >= 50 ? colors.warning : colors.error,
                    border: `1px solid ${analysis.score >= 80 ? colors.green : analysis.score >= 50 ? colors.warning : colors.error}30`,
                  }}>
                    Score: {analysis.score}%
                  </div>
                </div>

                {/* Score Bar */}
                <div style={{
                  height: 6,
                  background: colors.bg,
                  borderRadius: 3,
                  marginBottom: 20,
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${analysis.score}%`,
                    background: analysis.score >= 80 ? colors.green : analysis.score >= 50 ? colors.warning : colors.error,
                    borderRadius: 3,
                    transition: "width 0.5s ease",
                  }} />
                </div>

                {/* Checklist */}
                <div style={{ display: "grid", gap: 6, marginBottom: 16 }}>
                  {analysis.results.map((r, i) => (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      borderRadius: 6,
                      background: r.passed ? colors.greenBg : colors.redBg,
                      fontSize: 13,
                    }}>
                      <span style={{ fontSize: 14 }}>{r.passed ? "✅" : "❌"}</span>
                      <span style={{ color: r.passed ? colors.green : colors.error }}>{r.label}</span>
                    </div>
                  ))}
                </div>

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 16 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 10px", color: colors.warning }}>Verbesserungsvorschläge</h3>
                    {analysis.suggestions.map((s, i) => (
                      <div key={i} style={{
                        fontSize: 12,
                        color: colors.textMuted,
                        padding: "6px 0",
                        borderBottom: i < analysis.suggestions.length - 1 ? `1px solid ${colors.border}` : "none",
                      }}>{s}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Output */}
            {output && mode !== "planner" && (
              <div ref={mode === "generate" ? outputRef : null} style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                overflow: "hidden",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 20px",
                  borderBottom: `1px solid ${colors.border}`,
                  background: `${colors.accent}08`,
                }}>
                  <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {mode === "generate" ? "Generierter Output" : "Optimierter Output"}
                  </h2>
                  <button onClick={handleCopy} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    background: copied ? colors.green : colors.bg,
                    border: `1px solid ${copied ? colors.green : colors.border}`,
                    borderRadius: 6,
                    color: copied ? "#fff" : colors.textMuted,
                    cursor: "pointer",
                    fontSize: 12,
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}>
                    {copied ? "✓ Kopiert!" : "📋 Kopieren"}
                  </button>
                </div>
                <pre style={{
                  margin: 0,
                  padding: 20,
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: colors.text,
                  overflow: "auto",
                  maxHeight: 600,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>{output}</pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}