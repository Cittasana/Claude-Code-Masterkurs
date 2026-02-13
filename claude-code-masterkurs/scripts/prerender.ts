/**
 * prerender.ts – Static HTML generation for AI crawlers (GEO)
 *
 * AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do NOT execute JavaScript.
 * This script generates static HTML files for all important routes so that
 * the actual page content is visible to these crawlers.
 *
 * Run after `vite build`: tsx scripts/prerender.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { lessons } from '../src/data/lessons';
import { allTools, toolCategories } from '../src/data/tools/index';

const DIST = join(import.meta.dirname, '..', 'dist');
const BASE_URL = 'https://claude-code-masterkurs.de';

// Read the built index.html as template
const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

// ─── Helpers ──────────────────────────────────────────────────

/** Strip emoji prefixes from headings */
function stripEmoji(text: string): string {
  return text.replace(/^[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}\p{Extended_Pictographic}\s🎯🔑💡🛠️✅❌⚡🔧📋🎨🚀🏆📝🔍🎓📦🔐💻🌐⭐🧪📊🔄💾🐛📂🧩📌✨🎪🔨🏗️💥🎯🔑🛡️🔗📡🔌🗄️📁🔎🔬🌈🔥🧠📏🔢🏷️📓🖥️🔒🦇⚙️🗂️📖🏁🛑⚠️🧰🐧🍺🌍🏆🎲🤖💬🔁📈📉🧹💎🔮🌀🌿🎃🐱🐍🦀🐹🐙🎵🎶📻📺🎬🎤🗺️🧭💰📤📥🏠🏢🏗️🚢🛩️🚀🛸🌎🌍🌏]+\s*/u, '').trim();
}

/** Convert LessonContent[] to plain HTML */
function renderContent(content: Array<{ type: string; content: string; title?: string; language?: string }>): string {
  const parts: string[] = [];

  for (const item of content) {
    switch (item.type) {
      case 'heading': {
        const text = stripEmoji(item.content);
        // Determine heading level based on content patterns
        if (item.content.startsWith('###')) {
          parts.push(`<h4>${text}</h4>`);
        } else if (item.content.startsWith('##')) {
          parts.push(`<h3>${text}</h3>`);
        } else {
          parts.push(`<h2>${text}</h2>`);
        }
        break;
      }
      case 'text':
        parts.push(`<p>${escapeHtml(item.content)}</p>`);
        break;
      case 'highlight':
        parts.push(`<blockquote>${item.title ? `<strong>${escapeHtml(item.title)}</strong> ` : ''}${escapeHtml(item.content)}</blockquote>`);
        break;
      case 'list':
        parts.push(renderList(item.content));
        break;
      case 'code':
        parts.push(`<pre><code${item.language ? ` class="language-${item.language}"` : ''}>${escapeHtml(item.content)}</code></pre>`);
        break;
      case 'yaml':
        parts.push(`<pre><code class="language-yaml">${escapeHtml(item.content)}</code></pre>`);
        break;
      case 'video':
        // Don't render video embeds for crawlers, just mention it
        if (item.title) {
          parts.push(`<p><em>Video: ${escapeHtml(item.title)}</em></p>`);
        }
        break;
    }
  }

  return parts.join('\n');
}

function renderList(content: string): string {
  const lines = content.split('\n').filter(l => l.trim());
  const items = lines.map(l => {
    const text = l.replace(/^[-*]\s*/, '').trim();
    return `<li>${escapeHtml(text)}</li>`;
  });
  return `<ul>${items.join('\n')}</ul>`;
}

function escapeHtml(text: string): string {
  // Light escape - keep markdown bold/italic as-is for readability
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
}

/** Truncate text to N characters for meta description */
function truncate(text: string, max: number): string {
  const clean = text.replace(/[*`#\n]/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 3) + '...';
}

/** Write an HTML file, creating directories as needed */
function writePage(path: string, html: string): void {
  const filePath = join(DIST, path, 'index.html');
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(filePath, html, 'utf-8');
}

/** Generate a full HTML page from the template */
function generatePage(opts: {
  title: string;
  description: string;
  canonical: string;
  bodyHtml: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  showAuthor?: boolean;
  showImage?: boolean;
}): string {
  let html = template;

  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${escapeHtmlAttr(opts.title)}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content=".*?"\s*\/>/,
    `<meta name="description" content="${escapeHtmlAttr(opts.description)}" />`
  );

  // Replace canonical URL
  html = html.replace(
    /<link rel="canonical" href=".*?"\s*\/>/,
    `<link rel="canonical" href="${opts.canonical}" />`
  );

  // Replace OG tags
  html = html.replace(
    /<meta property="og:title" content=".*?"\s*\/>/,
    `<meta property="og:title" content="${escapeHtmlAttr(opts.title)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?"\s*\/>/,
    `<meta property="og:description" content="${escapeHtmlAttr(opts.description)}" />`
  );
  html = html.replace(
    /<meta property="og:url" content=".*?"\s*\/>/,
    `<meta property="og:url" content="${opts.canonical}" />`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content=".*?"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtmlAttr(opts.title)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtmlAttr(opts.description)}" />`
  );

  // Build breadcrumb nav
  const breadcrumbHtml = opts.breadcrumbs && opts.breadcrumbs.length > 0
    ? `<nav aria-label="Breadcrumb" style="font-size:14px;margin-bottom:16px;color:#94a3b8"><a href="/" style="color:#60a5fa;text-decoration:none">Startseite</a>${opts.breadcrumbs.map(b => ` › <a href="${b.url}" style="color:#60a5fa;text-decoration:none">${escapeHtmlAttr(b.name)}</a>`).join('')}</nav>`
    : '';

  // OG image visible for AI crawlers (multi-modal signal)
  const imageHtml = opts.showImage !== false
    ? `<img src="/og-image.png" alt="Claude Code Masterkurs – KI-gestuetztes Programmieren lernen mit Anthropics Coding-Agent" width="1200" height="630" loading="lazy" style="max-width:100%;height:auto;border-radius:8px;margin-bottom:24px" />`
    : '';

  // Author byline + date + sources (E-E-A-T + Authority signals)
  const authorHtml = opts.showAuthor !== false
    ? `<footer style="margin-top:32px;padding-top:16px;border-top:1px solid #334155;font-size:14px;color:#94a3b8"><p>Von <strong style="color:#e2e8f0">Cosmo Graef</strong>, Gruender &amp; Kursleiter des Claude Code Masterkurs | Zuletzt aktualisiert: 13. Februar 2026</p><p style="margin-top:8px">Quellen: <a href="https://anthropic.com" style="color:#60a5fa" rel="noopener">Anthropic</a> · <a href="https://docs.anthropic.com/en/docs/claude-code" style="color:#60a5fa" rel="noopener">Claude Code Dokumentation</a> · <a href="https://www.npmjs.com/package/@anthropic-ai/claude-code" style="color:#60a5fa" rel="noopener">npm Registry</a> · <a href="https://modelcontextprotocol.io" style="color:#60a5fa" rel="noopener">Model Context Protocol</a></p><nav style="margin-top:12px"><strong style="color:#e2e8f0">Weiterfuehrende Seiten:</strong> <a href="/was-ist-claude-code" style="color:#60a5fa">Was ist Claude Code?</a> · <a href="/vergleich" style="color:#60a5fa">Tool-Vergleich 2026</a> · <a href="/glossar" style="color:#60a5fa">Glossar</a> · <a href="/tools" style="color:#60a5fa">43 Tools &amp; Extensions</a> · <a href="/lesson/0" style="color:#60a5fa">Kurs starten</a></nav></footer>`
    : '';

  // Inject content into <div id="root">
  // The React app will hydrate on top of this
  html = html.replace(
    /<div id="root">.*?<\/div>/,
    `<div id="root">${breadcrumbHtml}${imageHtml}${opts.bodyHtml}${authorHtml}</div>`
  );

  return html;
}

function escapeHtmlAttr(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Page Generators ──────────────────────────────────────────

function prerenderLessons(): void {
  for (const lesson of lessons) {
    const title = `${stripEmoji(lesson.title)} – Claude Code Masterkurs`;
    const description = truncate(lesson.description, 160);
    const canonical = `${BASE_URL}/lesson/${lesson.id}`;

    const bodyHtml = `
      <article>
        <h1>${escapeHtml(stripEmoji(lesson.title))}</h1>
        <p><strong>Level ${lesson.level}</strong> | ${escapeHtml(lesson.duration)}</p>
        <p>${escapeHtml(lesson.description)}</p>
        <h2>Lernziele</h2>
        <ul>${lesson.objectives.map(o => `<li>${escapeHtml(o)}</li>`).join('\n')}</ul>
        ${renderContent(lesson.content)}
      </article>
    `;

    const html = generatePage({
      title, description, canonical, bodyHtml,
      breadcrumbs: [
        { name: 'Lektionen', url: '/lesson/0' },
        { name: stripEmoji(lesson.title), url: `/lesson/${lesson.id}` },
      ],
    });
    writePage(`lesson/${lesson.id}`, html);
  }
  console.log(`  Lessons: ${lessons.length} pages`);
}

function prerenderTools(): void {
  for (const tool of allTools) {
    const title = `${stripEmoji(tool.title)} – Tools & Extensions – Claude Code Masterkurs`;
    const description = truncate(tool.description, 160);
    const canonical = `${BASE_URL}/tools/${tool.id}`;

    const bodyHtml = `
      <article>
        <h1>${escapeHtml(stripEmoji(tool.title))}</h1>
        <p><strong>Tool-Lektion</strong> | ${escapeHtml(tool.duration)}</p>
        <p>${escapeHtml(tool.description)}</p>
        <h2>Lernziele</h2>
        <ul>${tool.objectives.map(o => `<li>${escapeHtml(o)}</li>`).join('\n')}</ul>
        ${renderContent(tool.content)}
      </article>
    `;

    const html = generatePage({
      title, description, canonical, bodyHtml,
      breadcrumbs: [
        { name: 'Tools & Extensions', url: '/tools' },
        { name: stripEmoji(tool.title), url: `/tools/${tool.id}` },
      ],
    });
    writePage(`tools/${tool.id}`, html);
  }
  console.log(`  Tools:   ${allTools.length} pages`);
}

function prerenderToolsOverview(): void {
  const title = 'Tools & Extensions – Claude Code Masterkurs';
  const description = '43 praxisnahe Lektionen zu CLI-Tools und MCP-Servern für den Entwickler-Alltag mit Claude Code. Von bat und fzf bis PostgreSQL MCP und Slack MCP.';
  const canonical = `${BASE_URL}/tools`;

  const categoryHtml = toolCategories.map(cat => {
    const toolsList = cat.tools.map(t =>
      `<li><a href="/tools/${t.id}">${escapeHtml(stripEmoji(t.title))}</a> – ${escapeHtml(truncate(t.description, 100))}</li>`
    ).join('\n');
    return `<h2>${escapeHtml(cat.id.charAt(0).toUpperCase() + cat.id.slice(1))}</h2>\n<ul>${toolsList}</ul>`;
  }).join('\n');

  const bodyHtml = `
    <article>
      <h1>Tools &amp; Extensions</h1>
      <p>43 praxisnahe Lektionen zu CLI-Tools und MCP-Servern, die deinen Entwickler-Alltag mit Claude Code produktiver machen. Jede Lektion umfasst Installation, Konfiguration, Best Practices, 12+ Praxisbeispiele, Troubleshooting und die Integration mit Claude Code.</p>
      ${categoryHtml}
    </article>
  `;

  const html = generatePage({
    title, description, canonical, bodyHtml,
    breadcrumbs: [{ name: 'Tools & Extensions', url: '/tools' }],
  });
  writePage('tools', html);
  console.log('  Tools overview: 1 page');
}

function prerenderStaticPages(): void {
  const staticPages: Array<{ path: string; title: string; description: string; content: string }> = [
    {
      path: 'dashboard',
      title: 'Dashboard – Claude Code Masterkurs',
      description: 'Dein persoenliches Lern-Dashboard im Claude Code Masterkurs. Verfolge deinen Fortschritt durch 70 Lektionen und 43 Tools & Extensions.',
      content: '<h1>Dashboard</h1><p>Dein persoenliches Lern-Dashboard im Claude Code Masterkurs. Hier siehst du deinen Fortschritt durch alle 70 Lektionen, 43 Tools &amp; Extensions Lektionen, abgeschlossene Challenges und Quizzes.</p><p>Der Kurs umfasst drei Levels: Grundlagen (Lektionen 0-5), Fortgeschritten (Lektionen 6-11) und Experte (Lektionen 12-26). Zusaetzlich gibt es 43 praxisnahe Tool-Lektionen zu CLI-Werkzeugen und MCP-Server-Integrationen.</p>',
    },
    {
      path: 'playground',
      title: 'Live Playground – Claude Code Masterkurs',
      description: 'Interaktiver simulierter Terminal zum Ueben von Claude Code Befehlen. Teste Slash Commands, CLAUDE.md und MCP-Konfiguration risikofrei.',
      content: '<h1>Live Playground</h1><p>Der interaktive Playground simuliert eine Claude Code Terminal-Session direkt im Browser. Hier kannst du Befehle ausprobieren, Slash Commands testen und CLAUDE.md Konfigurationen ueberpruefen – alles ohne eigenen API-Key oder Installation.</p><p>Verfuegbare Aufgaben umfassen: Erste Schritte mit Claude Code, CLAUDE.md erstellen, MCP Server konfigurieren, Git-Workflows automatisieren und Custom Skills entwickeln.</p>',
    },
    {
      path: 'challenges',
      title: 'Challenges – Claude Code Masterkurs',
      description: 'Praktische Coding-Challenges mit Claude Code loesen. Von Anfaenger bis Experte – teste dein Wissen in realen Entwicklungsszenarien.',
      content: '<h1>Challenges</h1><p>Die Challenges im Claude Code Masterkurs sind praktische Aufgaben, die dein Wissen aus den Lektionen in realen Szenarien testen. Jede Challenge beschreibt ein Entwicklungsproblem, das du mit Claude Code loesen sollst.</p><p>Die Schwierigkeitsgrade reichen von Anfaenger (z.B. einfache Dateioperationen) ueber Fortgeschritten (z.B. MCP-Server einrichten) bis Experte (z.B. Multi-Agent Workflows orchestrieren).</p>',
    },
    {
      path: 'features',
      title: 'Feature-Referenz – Claude Code Masterkurs',
      description: 'Vollstaendige Feature-Referenz fuer Claude Code: Alle Befehle, Slash Commands, Konfigurationsoptionen und Integrationen auf einen Blick.',
      content: '<h1>Feature-Referenz</h1><p>Die Feature-Referenz bietet einen vollstaendigen Ueberblick ueber alle Claude Code Funktionen: Befehle und Slash Commands, Konfigurationsoptionen in claude.json und CLAUDE.md, MCP-Server-Integration, Agent-Konfiguration, Hook-System und mehr.</p>',
    },
    {
      path: 'docs',
      title: 'Dokumentation – Claude Code Masterkurs',
      description: 'Umfassende Dokumentation zum Claude Code Masterkurs: Schnellstart, API-Referenz, Konfiguration, Troubleshooting und Best Practices.',
      content: '<h1>Dokumentation</h1><p>Die Dokumentation des Claude Code Masterkurs umfasst Schnellstart-Anleitungen, API-Referenz, Konfigurationsoptionen, Troubleshooting-Guides und Best Practices fuer den produktiven Einsatz von Claude Code.</p>',
    },
    {
      path: 'freelancer',
      title: 'Freelancer-Track – Claude Code Masterkurs',
      description: 'Claude Code fuer Freelancer: Lerne wie du KI-gestuetztes Programmieren fuer Kundenprojekte, schnellere Delivery und hoehere Stundensaetze nutzt.',
      content: '<h1>Freelancer-Track: Claude Code fuer Freelancer</h1><p>Der Freelancer-Track zeigt dir, wie du Claude Code gewinnbringend in deinem Freelancing-Alltag einsetzt. Von der Projektanalyse ueber schnellere Feature-Entwicklung bis hin zu automatisierten Code Reviews – Claude Code kann deine Produktivitaet als Freelancer verdreifachen.</p><p>Module: Projekt-Akquise mit AI, Schnellere Delivery, Kosten-Nutzen fuer Kunden, Portfolio-Projekte mit Claude Code, und Preisgestaltung fuer AI-gestuetzte Services.</p>',
    },
    {
      path: 'start-kostenlos',
      title: 'Kostenlos starten – Claude Code Masterkurs',
      description: 'Starte jetzt kostenlos mit dem Claude Code Masterkurs. Zugang zu Grundlagen-Lektionen, Live Playground und Community ohne Registrierung.',
      content: '<h1>Kostenlos starten</h1><p>Der Claude Code Masterkurs bietet einen kostenlosen Einstieg mit Zugang zu den Grundlagen-Lektionen (Level 1), dem Live Playground, ausgewaehlten Challenges und Community-Features. Keine Registrierung erforderlich – starte sofort mit dem Lernen.</p><p>Fuer den vollstaendigen Zugang zu allen 70 Lektionen, 43 Tools &amp; Extensions und Premium-Features stehen drei Abo-Modelle zur Verfuegung: Monatlich (24 EUR), Jaehrlich (229 EUR) und Lifetime (499 EUR).</p>',
    },
    {
      path: 'was-ist-claude-code',
      title: 'Was ist Claude Code? – Definition, Funktionen & Anleitung',
      description: 'Was ist Claude Code? Anthropics autonomer KI-Coding-Agent fuer das Terminal. Definition, Installation, Funktionen, Vergleich mit Copilot und Cursor, MCP-Protokoll und Kosten erklaert.',
      content: '<h1>Was ist Claude Code?</h1><p>Claude Code ist ein autonomer KI-gesteuerter Coding-Agent von Anthropic, der direkt im Terminal laeuft und durch natuerliche Sprache gesteuert wird. Im Gegensatz zu Autocomplete-Tools wie GitHub Copilot arbeitet Claude Code proaktiv und eigenstaendig: Es versteht ganze Projekte, liest und schreibt Dateien, erstellt Tests, fuehrt Shell-Befehle und Git-Operationen aus und kommuniziert ueber das Model Context Protocol (MCP) mit externen Services wie Datenbanken, APIs und Issue-Trackern. Entwickler beschreiben eine Aufgabe in natuerlicher Sprache, und Claude Code plant die Umsetzung, analysiert die Codebasis, schreibt den Code, fuehrt Tests aus und erstellt Git-Commits.</p><h2>Wie funktioniert Claude Code?</h2><p>Claude Code arbeitet in einem agentic Loop: Der Entwickler beschreibt eine Aufgabe, Claude Code analysiert die relevanten Dateien, plant den Ansatz, schreibt oder aendert Code, fuehrt Tests aus und wiederholt diesen Zyklus bis die Aufgabe erledigt ist. Es hat drei Modi: Standard Mode fuer direkte Ausfuehrung, Plan Mode fuer komplexe Aufgaben mit vorheriger Planung, und Thinking Mode fuer transparente Darstellung des Denkprozesses.</p><h2>Installation</h2><p>Die Installation erfolgt ueber npm: 1) Node.js 18+ installieren, 2) npm install -g @anthropic-ai/claude-code ausfuehren, 3) claude im Terminal starten und per API-Key oder OAuth authentifizieren. Claude Code laeuft auf macOS, Linux und Windows (WSL2).</p><h2>Die wichtigsten Funktionen</h2><ul><li>Autonome Code-Generierung und Refactoring</li><li>Git-Integration mit Commits, PRs und Code Reviews</li><li>Shell-Befehlsausfuehrung direkt aus dem Chat</li><li>MCP Server Integration fuer Datenbanken, APIs und externe Services</li><li>Multi-Agent Orchestrierung mit Subagents</li><li>Custom Slash Commands und Skills</li><li>Plan und Thinking Mode</li><li>CLAUDE.md Projektgedaechtnis</li></ul><h2>Claude Code vs GitHub Copilot vs Cursor</h2><p>Claude Code ist ein autonomer Terminal-Agent mit vollem Projektzugriff, Shell-Ausfuehrung und MCP-Integration. GitHub Copilot ist ein IDE-Autocomplete-Tool fuer Inline-Vorschlaege. Cursor ist eine KI-native IDE mit Chat und Composer-Modus. Claude Code eignet sich fuer komplexe, mehrstufige Aufgaben, Copilot fuer schnelle Code-Ergaenzungen, Cursor fuer IDE-basiertes Arbeiten mit AI-Unterstuetzung.</p><h2>Was kostet Claude Code?</h2><p>Claude Code ist kostenlos als npm-Paket verfuegbar. Die Nutzung erfordert einen Anthropic API-Key mit token-basierter Abrechnung: Sonnet 4 ca. $3/$15 pro Million Input/Output Tokens, Opus 4 ca. $15/$75. Ein typischer Tag kostet $1-20. Alternativ bietet der Max Plan eine monatliche Pauschale.</p>',
    },
    {
      path: 'vergleich',
      title: 'Claude Code vs Copilot vs Cursor vs Windsurf – Vergleich 2026',
      description: 'Detaillierter Vergleich der KI-Coding-Tools 2026: Claude Code vs GitHub Copilot vs Cursor vs Windsurf. Funktionen, Preise, Staerken und Schwaechen im Ueberblick.',
      content: '<h1>Claude Code vs GitHub Copilot vs Cursor vs Windsurf – Der grosse Vergleich 2026</h1><p>Die Landschaft der KI-gestuetzten Programmiertools hat sich 2026 grundlegend gewandelt. Vier Tools dominieren den Markt: Claude Code von Anthropic, GitHub Copilot von Microsoft, Cursor von Anysphere und Windsurf von Codeium. Jedes verfolgt einen fundamental unterschiedlichen Ansatz.</p><h2>Claude Code – Der autonome Terminal-Agent</h2><p>Claude Code ist ein autonomer Agent, der im Terminal laeuft und ganze Projekte versteht. Staerken: Voller Shell-Zugriff, Git-Integration, MCP-Server fuer externe Services, Multi-Agent Orchestrierung, Plan Mode. Ideal fuer komplexe Entwicklungsaufgaben, Refactoring und Projektautomatisierung. Preis: API-basiert, $1-20 pro Tag.</p><h2>GitHub Copilot – Der Autocomplete-Standard</h2><p>Copilot ist das weitverbreitetste KI-Coding-Tool mit Fokus auf Inline-Code-Vorschlaege in VS Code und JetBrains IDEs. Staerken: Schnelle Vorschlaege beim Tippen, niedrige Lernkurve, breite IDE-Unterstuetzung. Schwaechen: Kein Shell-Zugriff, begrenzt auf einzelne Dateien, keine MCP-Integration. Preis: $10-39/Monat.</p><h2>Cursor – Die KI-native IDE</h2><p>Cursor ist ein VS Code Fork mit tief integrierter AI: Chat, Composer und Codebase-weites Verstaendnis. Staerken: Vertraute IDE-Umgebung, Multi-Datei-Editing, Agent-Modus. Schwaechen: Eigene IDE noetig, begrenzter Shell-Zugriff, kein MCP. Preis: $20/Monat (Pro).</p><h2>Windsurf – Der Herausforderer</h2><p>Windsurf (ehemals Codeium) bietet einen Cascade-Modus fuer mehrstufige Aufgaben in einer eigenen IDE. Staerken: Guenstiger Einstieg, Flows fuer automatisierte Workflows. Schwaechen: Kleinstes Oekosystem, kein MCP-Support, begrenzte Shell-Integration. Preis: $10-40/Monat.</p><h2>Welches Tool ist das richtige?</h2><ul><li>Anfaenger: GitHub Copilot – niedrige Lernkurve, IDE-integriert</li><li>Komplexe Projekte: Claude Code – volle Autonomie, Shell und MCP</li><li>IDE-Komfort: Cursor – vertraute VS Code Umgebung</li><li>Budget-bewusst: Windsurf – guenstiger Einstieg</li></ul>',
    },
    {
      path: 'glossar',
      title: 'Claude Code Glossar – Alle Begriffe von A bis Z erklaert',
      description: 'Claude Code Glossar: Alle wichtigen Begriffe erklaert – von Agentic Coding ueber CLAUDE.md und MCP bis Token. Definitionen fuer Anfaenger und Fortgeschrittene.',
      content: '<h1>Claude Code Glossar – Alle Begriffe erklaert</h1><p>Dieses Glossar erklaert alle wichtigen Begriffe rund um Claude Code, KI-gestuetztes Programmieren und das Anthropic-Oekosystem.</p><h2 id="agentic-coding">Agentic Coding</h2><p>Agentic Coding bezeichnet einen Programmieransatz, bei dem ein KI-Agent Entwicklungsaufgaben weitgehend eigenstaendig ausfuehrt. Der Agent plant die Umsetzung, schreibt Code, fuehrt Tests aus und iteriert bei Fehlern – im Gegensatz zu Autocomplete-Tools, die nur Vorschlaege machen. Claude Code ist das fuehrende Beispiel fuer Agentic Coding.</p><h2 id="claude-md">CLAUDE.md</h2><p>Die CLAUDE.md ist eine Markdown-Datei im Projektstamm, die Claude Code strukturierten Kontext ueber das Projekt gibt. Sie enthaelt Projektbeschreibung, Architektur, Tech Stack, Coding-Konventionen und spezielle Anweisungen. Es gibt drei Ebenen: projektspezifisch (im Repo-Root), persoenlich (~/.claude/CLAUDE.md) und verzeichnisspezifisch. Claude Code liest diese Datei automatisch beim Start.</p><h2 id="mcp">MCP (Model Context Protocol)</h2><p>MCP ist ein offenes Protokoll von Anthropic, das Claude Code ermoeglicht, mit externen Tools und Services zu kommunizieren. Ueber MCP-Server kann Claude Code auf Datenbanken (PostgreSQL, SQLite), APIs (GitHub, Jira, Slack), Suchmaschinen (Brave Search) und Browser-Automatisierung (Puppeteer) zugreifen. Die Konfiguration erfolgt ueber JSON-Dateien im Projekt oder global in den Claude Code Settings.</p><h2 id="context-engineering">Context Engineering</h2><p>Context Engineering ist die Kunst, einem KI-Agenten optimalen Kontext bereitzustellen. Waehrend Prompt Engineering sich auf die Formulierung einzelner Anweisungen konzentriert, umfasst Context Engineering die gesamte Informationsarchitektur: CLAUDE.md Dateien, Projektstruktur, MCP-Server Konfiguration, .claudeignore Regeln und die strategische Auswahl relevanter Dateien.</p><h2 id="token">Token</h2><p>Tokens sind die Grundeinheit der Textverarbeitung in Large Language Models. Ein Token entspricht ungefaehr 4 Zeichen oder 0,75 Woertern. Die Kosten fuer Claude Code werden pro Token berechnet, getrennt nach Input-Tokens (was Claude liest) und Output-Tokens (was Claude generiert). Claude Sonnet 4 kostet ca. $3/$15 pro Million Input/Output Tokens.</p><h2 id="plan-mode">Plan Mode</h2><p>Im Plan Mode plant Claude Code die Umsetzung einer Aufgabe, bevor Code geschrieben wird. Claude Code exploriert die Codebasis, identifiziert relevante Dateien, enthaelt einen Implementierungsplan und wartet auf Genehmigung des Nutzers. Ideal fuer komplexe, mehrteilige Aufgaben bei denen Fehlentscheidungen teuer waeren.</p><h2 id="subagents">Multi-Agent / Subagents</h2><p>Claude Code kann Kind-Agenten (Subagents) starten, die parallel an Teilaufgaben arbeiten. Jeder Subagent hat Zugriff auf Tools und kann eigenstaendig Dateien lesen, Code schreiben und Befehle ausfuehren. Der Hauptagent koordiniert die Arbeit und fuegt die Ergebnisse zusammen. Besonders nuetzlich fuer grosse Refactorings oder parallele Recherche.</p>',
    },
    {
      path: 'impressum',
      title: 'Impressum – Claude Code Masterkurs',
      description: 'Impressum und rechtliche Angaben des Claude Code Masterkurs gemaess TMG.',
      content: '<h1>Impressum</h1><p>Rechtliche Angaben gemaess Telemediengesetz (TMG) fuer den Claude Code Masterkurs.</p>',
    },
    {
      path: 'datenschutz',
      title: 'Datenschutz – Claude Code Masterkurs',
      description: 'Datenschutzerklaerung des Claude Code Masterkurs. Informationen zur Verarbeitung personenbezogener Daten gemaess DSGVO.',
      content: '<h1>Datenschutzerklaerung</h1><p>Informationen zur Verarbeitung personenbezogener Daten im Claude Code Masterkurs gemaess der Datenschutz-Grundverordnung (DSGVO).</p>',
    },
  ];

  for (const page of staticPages) {
    // Extract a readable name from the title (before the dash)
    const breadcrumbName = page.title.split(' – ')[0].trim();
    const html = generatePage({
      title: page.title,
      description: page.description,
      canonical: `${BASE_URL}/${page.path}`,
      bodyHtml: `<article>${page.content}</article>`,
      breadcrumbs: [{ name: breadcrumbName, url: `/${page.path}` }],
    });
    writePage(page.path, html);
  }
  console.log(`  Static:  ${staticPages.length} pages`);
}

function prerenderLanding(): void {
  const title = 'Claude Code Masterkurs – Lerne KI-gestuetztes Programmieren';
  const description = 'Interaktiver Masterkurs fuer Claude Code: Lerne KI-gestuetztes Programmieren mit Anthropics Coding-Agent. 70 Lektionen, 43 Tools & Extensions, Quizzes, Projekte und Live-Playground auf Deutsch.';
  const canonical = BASE_URL + '/';

  const bodyHtml = `
    <article>
      <h1>Claude Code Masterkurs: Programmieren mit AI in 70 Lektionen</h1>
      <p>Der umfassendste deutschsprachige Kurs fuer Claude Code – Anthropics KI-gesteuerten Coding-Agent. 70 Lektionen von Grundlagen bis Experte, 43 Tools &amp; Extensions, interaktiver Playground, Quizzes und Community-Features.</p>

      <h2>Was ist Claude Code?</h2>
      <p>Claude Code ist ein autonomer KI-Coding-Agent von Anthropic, der im Terminal laeuft und durch natuerliche Sprache gesteuert wird. Im Gegensatz zu Autocomplete-Tools wie GitHub Copilot arbeitet Claude Code proaktiv und eigenstaendig: Es versteht ganze Projekte, liest und schreibt Dateien, erstellt Tests, fuehrt Git-Operationen durch und kommuniziert ueber das Model Context Protocol (MCP) mit externen Services wie Datenbanken, APIs und Issue-Trackern. Entwickler beschreiben eine Aufgabe in natuerlicher Sprache, und Claude Code plant die Umsetzung, analysiert die Codebasis, schreibt den Code, fuehrt Tests aus und erstellt Git-Commits – alles automatisch.</p>

      <h2>Kursstruktur</h2>
      <h3>Level 1: Grundlagen (Lektionen 0–5)</h3>
      <ul>
        <li><a href="/lesson/0">Lektion 0: Was ist Claude Code?</a> – Einfuehrung, Kernfunktionalitaeten, Unterschiede zu Copilot/Cursor/Windsurf</li>
        <li><a href="/lesson/1">Lektion 1: Installation &amp; Setup</a> – Node.js, npm, Claude Code installieren</li>
        <li><a href="/lesson/2">Lektion 2: Authentifizierung &amp; Model-Auswahl</a> – API-Keys, OAuth, Modelle</li>
        <li><a href="/lesson/3">Lektion 3: Erste Schritte &amp; Befehle</a> – Grundbefehle, Slash Commands, Prompts</li>
        <li><a href="/lesson/4">Lektion 4: CLAUDE.md Mastery</a> – Projekt-Kontext, Best Practices</li>
        <li><a href="/lesson/5">Lektion 5: Context Management</a> – Token-Fenster, .claudeignore</li>
      </ul>

      <h3>Level 2: Fortgeschritten (Lektionen 6–11)</h3>
      <ul>
        <li><a href="/lesson/6">Lektion 6: MCP Server Integration</a> – Model Context Protocol, externe Tools</li>
        <li><a href="/lesson/7">Lektion 7: Skills &amp; Workflows</a> – Custom Skills, Automatisierung</li>
        <li><a href="/lesson/8">Lektion 8: Subagents Deep Dive</a> – Sub-Agents, Task-Delegation</li>
        <li><a href="/lesson/9">Lektion 9: Custom Agents</a> – Eigene Agents bauen</li>
        <li><a href="/lesson/10">Lektion 10: Agent Personality</a> – Tone of Voice, Konfiguration</li>
        <li><a href="/lesson/11">Lektion 11: Git-Integration Profi</a> – Commits, PRs, Code Reviews</li>
      </ul>

      <h3>Level 3: Experte (Lektionen 12–26)</h3>
      <ul>
        <li><a href="/lesson/12">Lektion 12: Hooks &amp; Automation</a></li>
        <li><a href="/lesson/13">Lektion 13: Custom Slash Commands</a></li>
        <li><a href="/lesson/14">Lektion 14: Advanced Prompting</a></li>
        <li><a href="/lesson/15">Lektion 15: Plan &amp; Thinking Mode</a></li>
        <li><a href="/lesson/16">Lektion 16: Agent Orchestration</a></li>
        <li><a href="/lesson/17">Lektion 17: Production Best Practices</a></li>
        <li><a href="/lesson/18">Lektion 18: Troubleshooting Pro</a></li>
        <li><a href="/lesson/19">Lektion 19: Context Engineering</a></li>
        <li><a href="/lesson/20">Lektion 20: IDE-Integrationen</a></li>
        <li><a href="/lesson/21">Lektion 21: Sandboxing &amp; Security</a></li>
        <li><a href="/lesson/22">Lektion 22: CI/CD &amp; Headless Mode</a></li>
        <li><a href="/lesson/23">Lektion 23: Kosten-Optimierung</a></li>
        <li><a href="/lesson/24">Lektion 24: Claude Agent SDK</a></li>
        <li><a href="/lesson/25">Lektion 25: Plugins &amp; Marketplace</a></li>
        <li><a href="/lesson/26">Lektion 26: Real-World Patterns</a></li>
      </ul>

      <h2>43 Tools &amp; Extensions</h2>
      <p>Zusaetzlich zu den 27 Haupt-Lektionen bietet der Kurs 43 praxisnahe Lektionen zu CLI-Tools und MCP-Servern: bat, eza, tree, glow, tldr, httpie, jq, GitHub CLI, tmux, lazygit, delta, fzf, ripgrep, fd, tig, Zsh, Starship, yq, entr, Prettier, ESLint, Ruff, hadolint, htop, btop, ncdu, hyperfine, pet, Zellij, screen, Fish Shell, Ranger, nnn, bandwhich, und 8 MCP Server (Filesystem, Git, Brave Search, PostgreSQL, SQLite, GitHub, Puppeteer, Slack).</p>
      <p><a href="/tools">Alle Tools &amp; Extensions ansehen</a></p>

      <h2>Features</h2>
      <ul>
        <li><a href="/playground">Live Playground</a> – Interaktiver simulierter Terminal zum Ueben</li>
        <li><a href="/challenges">Challenges</a> – Praktische Coding-Aufgaben</li>
        <li>Quizzes zur Wissensueberpruefung in jeder Lektion</li>
        <li>Spaced Repetition zum nachhaltigen Lernen</li>
        <li>Community-Features: Forum, Leaderboard, Patterns</li>
        <li>Abschlusszertifikat</li>
      </ul>

      <h2>Abo-Modelle</h2>
      <p>Kostenloser Einstieg mit Zugang zu den Grundlagen. Fuer den vollen Zugang:</p>
      <ul>
        <li><strong>Monatlich</strong>: 24 EUR/Monat (flexibel kuendbar)</li>
        <li><strong>Jaehrlich</strong>: 229 EUR/Jahr (spare 20%)</li>
        <li><strong>Lifetime</strong>: 499 EUR einmalig (lebenslanger Zugriff)</li>
      </ul>

      <h2>Haeufig gestellte Fragen</h2>
      <h3>Was ist der Unterschied zwischen Claude Code und GitHub Copilot?</h3>
      <p>Claude Code ist ein autonomer Agent, der im Terminal laeuft und ganze Projekte versteht – es analysiert die komplette Codebasis, plant Aufgaben eigenstaendig, schreibt Code ueber mehrere Dateien hinweg, fuehrt Shell-Befehle und Git-Operationen aus und kommuniziert ueber MCP-Server mit externen Services. GitHub Copilot ist ein Autocomplete-Tool, das als IDE-Plugin Code-Vorschlaege beim Tippen macht. Claude Code eignet sich fuer komplexe, mehrstufige Aufgaben, Copilot fuer schnelle Inline-Ergaenzungen.</p>

      <h3>Wie installiert man Claude Code?</h3>
      <p>Die Installation erfolgt ueber npm: Zuerst Node.js 18+ installieren, dann <code>npm install -g @anthropic-ai/claude-code</code> ausfuehren, und mit <code>claude</code> im Terminal starten. Beim ersten Start wird die Authentifizierung ueber API-Key oder OAuth eingerichtet.</p>

      <h3>Was kostet Claude Code?</h3>
      <p>Claude Code erfordert einen Anthropic API-Key mit token-basierter Abrechnung. Claude Sonnet 4 kostet ca. $3/$15 pro Million Input/Output Tokens, Opus 4 ca. $15/$75. Ein typischer Entwicklungstag kostet $1–20. Alternativ bietet der Max Plan unbegrenzte Nutzung als Pauschale.</p>

      <h3>Was sind MCP Server?</h3>
      <p>MCP (Model Context Protocol) ist ein offenes Protokoll von Anthropic, das Claude Code ermoeglicht, mit externen Tools und Services zu kommunizieren – Datenbanken (PostgreSQL, SQLite), APIs (GitHub, Jira, Slack), Suchmaschinen (Brave Search) und Browser-Automatisierung (Puppeteer). MCP erweitert Claude Code ueber das lokale Dateisystem hinaus zum vollwertigen Entwicklungs-Orchestrator.</p>
    </article>
  `;

  // Landing page overwrites the main index.html (no breadcrumbs on homepage)
  const html = generatePage({ title, description, canonical, bodyHtml });
  writeFileSync(join(DIST, 'index.html'), html, 'utf-8');
  console.log('  Landing: 1 page (index.html updated)');
}

// ─── Main ─────────────────────────────────────────────────────

console.log('\nPrerendering static HTML for AI crawlers...\n');

prerenderLanding();
prerenderLessons();
prerenderToolsOverview();
prerenderTools();
prerenderStaticPages();

const totalPages = 1 + lessons.length + 1 + allTools.length + 12;
console.log(`\nDone! ${totalPages} pages prerendered to dist/\n`);
