import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Terminal,
  Code2,
  GitBranch,
  Brain,
  Zap,
  Server,
  Users,
  Slash,
  FileText,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  ChevronLeft,
  Plug,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// SEO / GEO Landing Page: "Was ist Claude Code?"
// Optimized for AI search engines (ChatGPT, Perplexity, Google AI Overviews)
// ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Code2,
    title: 'Code-Generierung & Refactoring',
    description:
      'Claude Code schreibt neuen Code, refaktorisiert bestehende Dateien und erstellt Tests auf Basis natuerlichsprachlicher Anweisungen. Der Agent versteht den gesamten Projektkontext und erzeugt Aenderungen, die sich nahtlos in die bestehende Codebasis einfuegen. Grosse Refactoring-Aufgaben ueber mehrere Dateien hinweg werden automatisch koordiniert.',
  },
  {
    icon: GitBranch,
    title: 'Git-Integration',
    description:
      'Automatische Git-Commits mit aussagekraeftigen Commit-Messages, Erstellung von Pull Requests, Code Reviews und Branch-Management. Claude Code versteht Git-Workflows und kann komplette Feature-Branches von der Erstellung bis zum Merge begleiten, einschliesslich Rebasing und Conflict Resolution.',
  },
  {
    icon: Terminal,
    title: 'Shell-Befehlsausfuehrung',
    description:
      'Claude Code fuehrt Terminal-Befehle direkt aus: Tests starten, Pakete installieren, Build-Prozesse anstoessen oder Deployment-Skripte ausfuehren. Dabei erkennt der Agent potentiell destruktive Befehle und fragt vor der Ausfuehrung um Erlaubnis. Das spart den staendigen Wechsel zwischen Editor und Terminal.',
  },
  {
    icon: Server,
    title: 'MCP Server Integration',
    description:
      'Ueber das Model Context Protocol verbindet sich Claude Code mit externen Diensten wie Datenbanken, APIs und Entwickler-Tools. MCP Server erweitern die Faehigkeiten des Agenten, sodass er direkt mit PostgreSQL, GitHub, Slack, dem Dateisystem und vielen weiteren Services interagieren kann.',
  },
  {
    icon: Users,
    title: 'Multi-Agent Orchestrierung',
    description:
      'Claude Code kann Subagenten starten, die parallel an verschiedenen Teilaufgaben arbeiten. Ein Haupt-Agent koordiniert die Arbeit, waehrend spezialisierte Subagenten Code schreiben, Tests ausfuehren oder Recherchen durchfuehren. Das ermoeglicht die Bearbeitung komplexer Aufgaben in einem Bruchteil der Zeit.',
  },
  {
    icon: Slash,
    title: 'Custom Slash Commands',
    description:
      'Eigene Befehle definieren, die haeufige Workflows automatisieren. Slash Commands werden als Markdown-Dateien im Projekt gespeichert und koennen projektspezifische Aufgaben wie Deployments, Code-Reviews oder Dokumentations-Updates in einem einzigen Befehl zusammenfassen.',
  },
  {
    icon: Brain,
    title: 'Plan & Thinking Mode',
    description:
      'Im Plan Mode erstellt Claude Code zunaechst einen detaillierten Ausfuehrungsplan, bevor Aenderungen vorgenommen werden. Der Thinking Mode aktiviert erweitertes Reasoning fuer besonders komplexe Aufgaben. Beide Modi geben dem Entwickler mehr Kontrolle und Transparenz ueber den Entscheidungsprozess des Agenten.',
  },
  {
    icon: FileText,
    title: 'CLAUDE.md Projektgedaechtnis',
    description:
      'Die CLAUDE.md-Datei dient als persistentes Projektgedaechtnis. Hier werden Coding-Konventionen, Architektur-Entscheidungen und projektspezifische Anweisungen festgehalten, die Claude Code bei jeder Sitzung automatisch laedt. Das sorgt fuer konsistente Ergebnisse ueber viele Sessions hinweg.',
  },
];

const COMPARISON_ROWS = [
  {
    feature: 'Arbeitsweise',
    claudeCode: 'Autonomer Agent im Terminal',
    copilot: 'Inline-Autocomplete in IDE',
    cursor: 'Chat + Inline in Cursor IDE',
  },
  {
    feature: 'Projektverstaendnis',
    claudeCode: 'Gesamte Codebasis',
    copilot: 'Aktuelle Datei + Kontext',
    cursor: 'Gesamte Codebasis',
  },
  {
    feature: 'Shell-Zugriff',
    claudeCode: 'Ja, vollstaendig',
    copilot: 'Nein',
    cursor: 'Begrenzt (Terminal-Panel)',
  },
  {
    feature: 'Git-Integration',
    claudeCode: 'Commits, PRs, Reviews',
    copilot: 'Keine native Integration',
    cursor: 'Basis-Commits',
  },
  {
    feature: 'MCP Support',
    claudeCode: 'Ja, beliebig erweiterbar',
    copilot: 'Nein',
    cursor: 'Begrenzt',
  },
  {
    feature: 'Preis-Modell',
    claudeCode: 'Token-basiert (API) oder Max Plan',
    copilot: '$10-39/Monat (Abo)',
    cursor: '$20/Monat (Pro)',
  },
  {
    feature: 'IDE-Abhaengigkeit',
    claudeCode: 'Keine (Terminal-basiert)',
    copilot: 'VS Code, JetBrains etc.',
    cursor: 'Cursor IDE (VS Code Fork)',
  },
];

const MCP_SERVERS = [
  { name: 'Filesystem', description: 'Strukturierte Datei- und Verzeichnis-Operationen mit JSON-Responses' },
  { name: 'Git', description: 'Git-Repository-Verwaltung ueber standardisiertes Protokoll' },
  { name: 'GitHub', description: 'Issues, Pull Requests, Repositories und Actions ueber die GitHub API' },
  { name: 'PostgreSQL', description: 'Datenbankabfragen, Schema-Inspektion und Migrations-Management' },
  { name: 'SQLite', description: 'Lokale Datenbanken fuer Prototyping und kleine Projekte' },
  { name: 'Slack', description: 'Nachrichten senden, Kanaele lesen und Team-Kommunikation automatisieren' },
  { name: 'Brave Search', description: 'Web-Suche fuer aktuelle Informationen und Dokumentations-Recherche' },
  { name: 'Puppeteer', description: 'Browser-Automatisierung fuer Testing, Screenshots und Web-Scraping' },
];

const WasIstClaudeCodeView = () => {
  return (
    <div className="min-h-screen flex flex-col bg-apple-bg">
      <Helmet>
        <title>Was ist Claude Code? – Definition, Funktionen &amp; Anleitung</title>
        <meta
          name="description"
          content="Was ist Claude Code? Der autonome KI-Coding-Agent von Anthropic arbeitet direkt im Terminal, versteht ganze Codebasen und schreibt, testet und deployt Code. Erfahre alles ueber Installation, Funktionen, Preise und den Vergleich mit GitHub Copilot und Cursor."
        />
        <link rel="canonical" href="https://claude-code-masterkurs.de/was-ist-claude-code" />
        <meta property="og:title" content="Was ist Claude Code? – Definition, Funktionen & Anleitung" />
        <meta
          property="og:description"
          content="Claude Code ist ein autonomer KI-Coding-Agent von Anthropic. Er arbeitet im Terminal, versteht ganze Codebasen und automatisiert den Entwicklungsworkflow."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://claude-code-masterkurs.de/was-ist-claude-code" />
      </Helmet>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-apple-muted hover:text-apple-accent transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Zurueck zur Startseite
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          Section 1: H1 – Definition
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="eyebrow mb-6"><Terminal size={12} /><span>KI-Coding-Agent</span></div>

          <h1 className="text-[clamp(40px,5.6vw,76px)] font-semibold text-apple-text mb-6 tracking-[-0.038em] leading-[1.04]">
            Was ist <em className="italic-serif">Claude Code</em>?
          </h1>

          <p className="text-lg sm:text-xl text-apple-textSecondary leading-relaxed max-w-3xl">
            Claude Code ist ein autonomer KI-Coding-Agent von Anthropic, der direkt im Terminal arbeitet. Im Gegensatz
            zu herkoemmlichen Code-Assistenten, die nur einzelne Zeilen oder Funktionen vorschlagen, versteht Claude Code
            die gesamte Codebasis eines Projekts. Der Agent analysiert Dateistrukturen, liest bestehenden Code, erkennt
            Abhaengigkeiten und schreibt neue Funktionen, die sich nahtlos in das bestehende Projekt einfuegen. Entwickler
            beschreiben ihre Aufgabe in natuerlicher Sprache, und Claude Code uebernimmt die Umsetzung: vom Schreiben
            neuer Features ueber das Refactoring bestehenden Codes bis hin zum Erstellen von Tests, Git-Commits und Pull
            Requests. Claude Code basiert auf Anthropics Claude-Modellen (Sonnet 4 und Opus 4) und wird ueber die
            Kommandozeile mit dem Befehl <code className="font-mono bg-apple-card px-1.5 py-0.5 rounded text-apple-accent text-base">claude</code> gestartet.
            Er ist damit eines der leistungsfaehigsten Werkzeuge fuer KI-gestuetzte Softwareentwicklung auf dem Markt.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 2: Wie funktioniert Claude Code?
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 border-t border-apple-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-6">
            Wie funktioniert Claude Code?
          </h2>

          <div className="space-y-4 text-apple-textSecondary leading-relaxed">
            <p>
              Der Workflow von Claude Code folgt einem agentenbasierten Ansatz, der sich grundlegend von klassischen
              Autocomplete-Tools unterscheidet. Der Entwickler oeffnet ein Terminal im Projektverzeichnis und startet
              Claude Code mit dem Befehl <code className="font-mono bg-apple-card px-1.5 py-0.5 rounded text-apple-accent">claude</code>.
              Anschliessend beschreibt er die gewuenschte Aufgabe in natuerlicher Sprache, zum Beispiel: &bdquo;Erstelle
              eine REST-API fuer die Benutzerverwaltung mit Express und TypeScript.&ldquo;
            </p>

            <p>
              Claude Code durchlaeuft daraufhin mehrere Schritte automatisch. Zunaechst analysiert der Agent die
              vorhandene Codebasis, um die Projektstruktur, verwendete Frameworks und Coding-Konventionen zu verstehen.
              Dann erstellt er einen Ausfuehrungsplan, der in mehrere Teilschritte gegliedert ist. Im naechsten Schritt
              schreibt Claude Code den eigentlichen Code, erstellt oder aktualisiert Dateien und fuehrt bei Bedarf
              Terminal-Befehle aus, etwa um Abhaengigkeiten zu installieren oder Tests zu starten. Abschliessend kann
              der Agent die Aenderungen automatisch committen und einen Pull Request erstellen.
            </p>

            <p>
              Drei Modi steuern dabei das Verhalten des Agenten: Im <strong className="text-apple-text">Standard-Modus</strong> arbeitet
              Claude Code autonom und setzt Aufgaben direkt um. Der <strong className="text-apple-text">Plan Mode</strong> erstellt
              zunaechst einen ausfuehrlichen Plan zur Genehmigung, bevor Aenderungen vorgenommen werden. Der{' '}
              <strong className="text-apple-text">Thinking Mode</strong> aktiviert erweitertes Reasoning fuer besonders
              komplexe Architektur- und Designentscheidungen. Jeder Modus bietet ein anderes Mass an Kontrolle und
              Autonomie, sodass Entwickler den Agenten je nach Aufgabe feinsteuern koennen.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 3: Installation
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 border-t border-apple-border bg-apple-surface/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-6">
            Claude Code installieren – Schritt fuer Schritt
          </h2>

          <div className="space-y-4 text-apple-textSecondary leading-relaxed">
            <p>
              Die Installation von Claude Code erfordert lediglich Node.js in Version 18 oder hoeher. Entwickler, die
              bereits mit JavaScript- oder TypeScript-Projekten arbeiten, haben Node.js in der Regel bereits installiert.
              Andernfalls kann Node.js ueber die offizielle Website nodejs.org oder einen Paketmanager wie Homebrew
              (macOS), nvm oder fnm installiert werden. Claude Code laeuft auf macOS, Linux und Windows (ueber WSL2).
            </p>

            <div className="bg-apple-card rounded-2xl border border-apple-border p-6 space-y-4">
              <h3 className="text-lg font-semibold text-apple-text">Installations-Befehle</h3>

              <div>
                <p className="text-sm text-apple-muted mb-2">1. Claude Code global installieren:</p>
                <code className="block font-mono bg-apple-bg px-4 py-3 rounded-xl text-apple-accent text-sm border border-apple-border">
                  npm install -g @anthropic-ai/claude-code
                </code>
              </div>

              <div>
                <p className="text-sm text-apple-muted mb-2">2. Claude Code starten und Authentifizierung durchfuehren:</p>
                <code className="block font-mono bg-apple-bg px-4 py-3 rounded-xl text-apple-accent text-sm border border-apple-border">
                  claude
                </code>
              </div>

              <div>
                <p className="text-sm text-apple-muted mb-2">3. CLAUDE.md im Projekt-Root erstellen:</p>
                <code className="block font-mono bg-apple-bg px-4 py-3 rounded-xl text-apple-accent text-sm border border-apple-border">
                  claude &quot;Erstelle eine CLAUDE.md fuer dieses Projekt&quot;
                </code>
              </div>
            </div>

            <p>
              Bei der Authentifizierung gibt es zwei Optionen: Entweder verwendet man einen Anthropic API-Key, der ueber
              die Anthropic Console erstellt wird, oder man nutzt OAuth ueber einen Claude Max Plan. Der API-Key wird
              als Umgebungsvariable <code className="font-mono bg-apple-card px-1.5 py-0.5 rounded text-apple-accent">ANTHROPIC_API_KEY</code> gesetzt
              oder beim ersten Start interaktiv eingegeben. Die CLAUDE.md-Datei ist optional, wird aber dringend
              empfohlen, da sie Claude Code projektspezifische Anweisungen wie Coding-Konventionen, Build-Befehle und
              Architektur-Informationen mitgibt und die Qualitaet der Ergebnisse erheblich verbessert.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 4: Die wichtigsten Funktionen
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 border-t border-apple-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-8">
            Die wichtigsten Funktionen von Claude Code
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-apple-card rounded-2xl border border-apple-border p-6 hover:border-apple-accent/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-apple-accent/10">
                    <Icon className="w-5 h-5 text-apple-accent" />
                  </div>
                  <h3 className="font-semibold text-apple-text">{title}</h3>
                </div>
                <p className="text-sm text-apple-textSecondary leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 5: Vergleichstabelle
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 border-t border-apple-border bg-apple-surface/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-6">
            Claude Code vs GitHub Copilot vs Cursor
          </h2>

          <p className="text-apple-textSecondary leading-relaxed mb-8">
            Claude Code unterscheidet sich fundamental von anderen KI-Coding-Tools. Waehrend GitHub Copilot primaer
            als Autocomplete-Erweiterung in der IDE arbeitet und Cursor als Chat-basierter Code-Editor fungiert,
            ist Claude Code ein vollstaendig autonomer Agent, der im Terminal operiert und keine IDE-Abhaengigkeit
            hat. Die folgende Tabelle zeigt die wichtigsten Unterschiede im direkten Vergleich.
          </p>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-apple-border">
                  <th className="text-left py-3 px-4 font-semibold text-apple-text">Feature</th>
                  <th className="text-left py-3 px-4 font-semibold text-apple-accent">Claude Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-apple-text">GitHub Copilot</th>
                  <th className="text-left py-3 px-4 font-semibold text-apple-text">Cursor</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map(({ feature, claudeCode, copilot, cursor }) => (
                  <tr key={feature} className="border-b border-apple-border/50">
                    <td className="py-3 px-4 text-apple-text font-medium">{feature}</td>
                    <td className="py-3 px-4 text-apple-accent font-medium">{claudeCode}</td>
                    <td className="py-3 px-4 text-apple-textSecondary">{copilot}</td>
                    <td className="py-3 px-4 text-apple-textSecondary">{cursor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-apple-textSecondary leading-relaxed mt-6">
            Der groesste Vorteil von Claude Code gegenueber Copilot und Cursor liegt in der Autonomie und dem
            Shell-Zugriff. Claude Code kann eigenstaendig Tests ausfuehren, Build-Fehler debuggen und komplette
            Git-Workflows abwickeln, ohne dass der Entwickler zwischen verschiedenen Tools wechseln muss. Copilot
            eignet sich hingegen besser fuer schnelle Inline-Vorschlaege waehrend des Tippens. Cursor bietet einen
            Mittelweg mit starkem Chat-Interface, ist aber an die eigene IDE gebunden. Viele Entwickler nutzen
            Claude Code in Kombination mit einem dieser Tools, um die jeweiligen Staerken optimal zu nutzen.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 6: Model Context Protocol (MCP)
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 border-t border-apple-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-6">
            Was ist das Model Context Protocol (MCP)?
          </h2>

          <div className="space-y-4 text-apple-textSecondary leading-relaxed">
            <p>
              Das Model Context Protocol (MCP) ist ein offener Standard, der von Anthropic entwickelt wurde, um
              KI-Modelle mit externen Datenquellen und Diensten zu verbinden. MCP funktioniert nach dem
              Client-Server-Prinzip: Claude Code agiert als MCP-Client, waehrend MCP-Server den Zugriff auf
              spezifische Dienste bereitstellen. Jeder MCP-Server definiert eine Menge von Tools, die Claude Code
              aufrufen kann, aehnlich wie eine API, aber mit standardisiertem Protokoll. Das ermoeglicht es, Claude
              Code um beliebige Faehigkeiten zu erweitern, ohne den Agenten selbst veraendern zu muessen.
            </p>

            <p>
              Die Konfiguration erfolgt ueber die Datei <code className="font-mono bg-apple-card px-1.5 py-0.5 rounded text-apple-accent">.claude/settings.json</code> oder
              ueber den Befehl <code className="font-mono bg-apple-card px-1.5 py-0.5 rounded text-apple-accent">claude mcp add</code>.
              MCP-Server laufen als lokale Prozesse oder als Remote-Server und kommunizieren ueber stdin/stdout oder
              HTTP mit Server-Sent Events. Die wichtigsten MCP-Server fuer den Entwicklungsalltag sind:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {MCP_SERVERS.map(({ name, description }) => (
              <div
                key={name}
                className="bg-apple-card rounded-2xl border border-apple-border p-5 flex items-start gap-3"
              >
                <div className="p-1.5 rounded-lg bg-apple-accent/10 mt-0.5">
                  <Plug className="w-4 h-4 text-apple-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-apple-text text-sm">{name}</h3>
                  <p className="text-xs text-apple-textSecondary leading-relaxed mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 7: CLAUDE.md Datei
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 border-t border-apple-border bg-apple-surface/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-6">
            Was ist die CLAUDE.md Datei?
          </h2>

          <div className="space-y-4 text-apple-textSecondary leading-relaxed">
            <p>
              Die CLAUDE.md-Datei ist das persistente Gedaechtnis von Claude Code. Sie wird automatisch zu Beginn
              jeder Sitzung geladen und liefert dem Agenten wichtige Kontextinformationen ueber das Projekt.
              Entwickler koennen hier Coding-Konventionen, Architektur-Entscheidungen, bevorzugte Bibliotheken,
              Build- und Test-Befehle sowie projektspezifische Regeln festhalten. Je ausfuehrlicher und praeziser
              die CLAUDE.md geschrieben ist, desto besser und konsistenter sind die Ergebnisse, die Claude Code
              liefert.
            </p>

            <p>
              Es gibt drei Ebenen von CLAUDE.md-Dateien, die hierarchisch zusammenwirken. Die{' '}
              <strong className="text-apple-text">Projekt-CLAUDE.md</strong> liegt im Root-Verzeichnis des Projekts und
              wird von allen Teammitgliedern geteilt (sollte in Git eingecheckt werden). Die{' '}
              <strong className="text-apple-text">persoenliche CLAUDE.md</strong> liegt unter{' '}
              <code className="font-mono bg-apple-card px-1.5 py-0.5 rounded text-apple-accent">~/.claude/CLAUDE.md</code> und
              enthaelt individuelle Praeferenzen des Entwicklers, die fuer alle Projekte gelten. Zusaetzlich koennen{' '}
              <strong className="text-apple-text">Unterverzeichnis-CLAUDE.md-Dateien</strong> in Subfoldern platziert werden,
              um bereichsspezifische Anweisungen zu geben, etwa fuer ein separates Frontend- oder Backend-Verzeichnis.
              Claude Code kombiniert alle drei Ebenen intelligent zu einem einheitlichen Kontext.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 8: Kosten
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 border-t border-apple-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-6">
            Was kostet Claude Code?
          </h2>

          <div className="space-y-4 text-apple-textSecondary leading-relaxed">
            <p>
              Claude Code nutzt ein token-basiertes Preismodell ueber die Anthropic API. Die Kosten haengen vom
              gewaehlten Modell ab. Claude Sonnet 4 kostet 3 US-Dollar pro Million Input-Tokens und 15 US-Dollar
              pro Million Output-Tokens. Claude Opus 4 liegt bei 15 US-Dollar pro Million Input-Tokens und 75
              US-Dollar pro Million Output-Tokens. Im typischen Entwicklungsalltag liegen die Kosten zwischen
              1 und 20 US-Dollar pro Tag, abhaengig von der Komplexitaet und Haeufigkeit der Aufgaben.
            </p>

            <p>
              Als Alternative zum API-Zugang bietet Anthropic den <strong className="text-apple-text">Claude Max Plan</strong> an.
              Fuer eine monatliche Pauschale erhalten Entwickler Zugang zu Claude Code ohne separate Token-Abrechnung.
              Der Max Plan eignet sich besonders fuer Vielnutzer, die taeglich intensiv mit Claude Code arbeiten und
              eine planbare Kostenstruktur bevorzugen. Unternehmen koennen ausserdem Team- und Enterprise-Plaene nutzen,
              die zusaetzliche Verwaltungs- und Sicherheitsfunktionen bieten.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
            <div className="bg-apple-card rounded-2xl border border-apple-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-apple-accent/10">
                  <Zap className="w-5 h-5 text-apple-accent" />
                </div>
                <h3 className="font-semibold text-apple-text">Sonnet 4</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-apple-muted">Input</span>
                  <span className="font-mono text-apple-text">$3 / 1M Tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-muted">Output</span>
                  <span className="font-mono text-apple-text">$15 / 1M Tokens</span>
                </div>
                <p className="text-apple-muted text-xs pt-2">Empfohlen fuer die meisten Aufgaben. Schnell und kosteneffizient.</p>
              </div>
            </div>

            <div className="bg-apple-card rounded-2xl border border-apple-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-apple-accent/10">
                  <Brain className="w-5 h-5 text-apple-accent" />
                </div>
                <h3 className="font-semibold text-apple-text">Opus 4</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-apple-muted">Input</span>
                  <span className="font-mono text-apple-text">$15 / 1M Tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-muted">Output</span>
                  <span className="font-mono text-apple-text">$75 / 1M Tokens</span>
                </div>
                <p className="text-apple-muted text-xs pt-2">Fuer komplexe Architektur- und Reasoning-Aufgaben. Hoechste Qualitaet.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Section 9: Masterkurs CTA
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 border-t border-apple-border bg-apple-surface/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-4">
            Claude Code lernen im Masterkurs
          </h2>

          <p className="text-apple-textSecondary leading-relaxed max-w-2xl mx-auto mb-8">
            Der Claude Code Masterkurs ist der umfassendste deutschsprachige Online-Kurs fuer KI-gestuetzte
            Softwareentwicklung mit Claude Code. In ueber 70 Lektionen lernst du alle 43 Tools und Erweiterungen
            kennen, arbeitest an praxisnahen Projekten und meisterst drei Schwierigkeitsstufen vom Anfaenger bis
            zum Experten. Der Kurs wird kontinuierlich aktualisiert und um neue Inhalte ergaenzt.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-apple-textSecondary text-sm">
              <CheckCircle2 className="w-4 h-4 text-apple-accent" />
              <span>70+ Lektionen</span>
            </div>
            <div className="flex items-center gap-2 text-apple-textSecondary text-sm">
              <CheckCircle2 className="w-4 h-4 text-apple-accent" />
              <span>43 Tools & Extensions</span>
            </div>
            <div className="flex items-center gap-2 text-apple-textSecondary text-sm">
              <CheckCircle2 className="w-4 h-4 text-apple-accent" />
              <span>3 Schwierigkeitsstufen</span>
            </div>
            <div className="flex items-center gap-2 text-apple-textSecondary text-sm">
              <CheckCircle2 className="w-4 h-4 text-apple-accent" />
              <span>Praxis-Projekte</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              Zum Kurs-Dashboard
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/start-kostenlos"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl border border-apple-border text-apple-text hover:border-apple-accent/40 hover:text-apple-accent transition-colors"
            >
              Kostenlos starten
              <BookOpen size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Author / Sources Footer (GEO Optimization)
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="mt-12 pt-6 border-t border-white/10 text-sm text-gray-400">
          <p>Von <strong className="text-gray-200">Cosmo Graef</strong>, Gruender & Kursleiter des Claude Code Masterkurs | Zuletzt aktualisiert: 13. Februar 2026</p>
          <p className="mt-2">
            Quellen: <a href="https://anthropic.com" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Anthropic</a> · <a href="https://docs.anthropic.com/en/docs/claude-code" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Claude Code Dokumentation</a> · <a href="https://www.npmjs.com/package/@anthropic-ai/claude-code" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">npm Registry</a> · <a href="https://modelcontextprotocol.io" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Model Context Protocol</a>
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          Structured Data (JSON-LD) for SEO
          ═══════════════════════════════════════════════════════════ */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Was ist Claude Code? – Definition, Funktionen & Anleitung',
            description:
              'Claude Code ist ein autonomer KI-Coding-Agent von Anthropic, der im Terminal arbeitet und ganze Codebasen versteht.',
            author: {
              '@type': 'Organization',
              name: 'Claude Code Masterkurs',
              url: 'https://claude-code-masterkurs.de',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Cittasana S.R.L.',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://claude-code-masterkurs.de/was-ist-claude-code',
            },
            datePublished: '2026-02-13',
            dateModified: '2026-02-13',
          })}
        </script>
      </Helmet>
    </div>
  );
};

export default WasIstClaudeCodeView;
