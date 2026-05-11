import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Terminal,
  Key,
  FileText,
  Bot,
  Brain,
  Gauge,
  Webhook,
  Network,
  Server,
  Users,
  Map,
  MessageSquare,
  Command,
  Lightbulb,
  Coins,
  ArrowRight,
  List,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Glossar-Daten
// Jeder Eintrag: 134-167 Woerter, eigenstaendig zitierbar
// ─────────────────────────────────────────────────────────────

const GLOSSARY_TERMS = [
  {
    id: 'agentic-coding',
    term: 'Agentic Coding',
    icon: Bot,
    definition: `Agentic Coding beschreibt einen Paradigmenwechsel in der Softwareentwicklung: Statt einzelne Code-Vorschlaege zu liefern wie klassische Copilot-Tools, agieren KI-Agenten vollstaendig autonom. Sie analysieren Anforderungen, erstellen einen Plan, schreiben Code, fuehren Tests aus, beheben Fehler und koennen sogar Deployments anstossen. Claude Code von Anthropic ist das fuehrende Beispiel fuer Agentic Coding. Der entscheidende Unterschied zu Copilot-artigen Assistenten liegt im sogenannten Plan-Execute-Loop: Der Agent plant zunaechst seine Vorgehensweise, holt optional die Zustimmung des Entwicklers ein und fuehrt dann mehrere Schritte hintereinander aus, ohne dass der Nutzer jeden Schritt einzeln anstossen muss. Das umfasst das Lesen von Dateien, das Verstehen der Projektstruktur, das Schreiben von Code in mehreren Dateien gleichzeitig sowie das Ausfuehren von Terminal-Befehlen. Agentic Coding steigert die Produktivitaet um das Drei- bis Zehnfache und veraendert grundlegend, wie Software entwickelt wird.`,
  },
  {
    id: 'anthropic',
    term: 'Anthropic',
    icon: Brain,
    definition: `Anthropic ist das US-amerikanische KI-Unternehmen hinter Claude und Claude Code. Gegruendet wurde Anthropic im Jahr 2021 von Dario Amodei und seiner Schwester Daniela Amodei, die zuvor in Fuehrungspositionen bei OpenAI taetig waren. Der zentrale Fokus von Anthropic liegt auf der Entwicklung sicherer und zuverlaessiger KI-Systeme. Das Unternehmen verfolgt den Ansatz der Constitutional AI, bei dem KI-Modelle nach definierten Prinzipien trainiert werden. Die Claude-Modellfamilie umfasst verschiedene Varianten wie Claude Haiku fuer schnelle, kostenguenstige Aufgaben, Claude Sonnet als Allrounder und Claude Opus als leistungsstaerkstes Modell fuer komplexe Aufgaben. Claude Code, der autonome Coding-Agent, basiert auf diesen Modellen und nutzt deren Faehigkeiten fuer Softwareentwicklung. Anthropic hat seinen Sitz in San Francisco und gehoert mit Investitionen von Google und Amazon zu den am hoechsten bewerteten KI-Unternehmen weltweit.`,
  },
  {
    id: 'api-key',
    term: 'API-Key',
    icon: Key,
    definition: `Ein API-Key ist ein eindeutiger Authentifizierungs-Token, der den Zugriff auf die Anthropic-API ermoeglicht. Um Claude Code nutzen zu koennen, benoetigt man einen solchen Schluessel. Man erhaelt ihn ueber die Anthropic Console unter console.anthropic.com, wo man ein Konto erstellt und unter dem Menuepunkt API Keys einen neuen Schluessel generiert. Der API-Key beginnt typischerweise mit dem Praefix sk-ant- und sollte niemals oeffentlich geteilt werden. Best Practices fuer die Sicherheit umfassen: den Key in Umgebungsvariablen speichern statt im Code, niemals in Git-Repositories committen, regelmaessig rotieren und bei Verdacht auf Kompromittierung sofort widerrufen. In Claude Code wird der API-Key entweder ueber die Umgebungsvariable ANTHROPIC_API_KEY gesetzt oder beim ersten Start interaktiv eingegeben. Pro Konto koennen mehrere Keys fuer verschiedene Projekte oder Umgebungen erstellt werden, was eine granulare Zugriffskontrolle ermoeglicht.`,
  },
  {
    id: 'claude-md',
    term: 'CLAUDE.md',
    icon: FileText,
    definition: `CLAUDE.md ist eine spezielle Markdown-Datei, die Claude Code beim Start automatisch einliest, um den Projektkontext zu verstehen. Es gibt drei Ebenen: Die Projekt-CLAUDE.md liegt im Wurzelverzeichnis des Projekts und enthaelt allgemeine Informationen wie Tech-Stack, Architektur-Entscheidungen, Coding-Conventions und Projektstruktur. Die persoenliche CLAUDE.md unter ~/.claude/CLAUDE.md definiert nutzerspezifische Praeferenzen, die projektubergreifend gelten. Subdirectory-CLAUDE.md-Dateien in Unterordnern liefern kontextspezifische Anweisungen fuer bestimmte Bereiche des Projekts. In eine CLAUDE.md gehoeren typischerweise: Build- und Test-Befehle, Namenskonventionen, bevorzugte Libraries, Architektur-Patterns und haeufige Fehlerquellen. Claude Code liest diese Dateien automatisch beim Start und beruecksichtigt die Anweisungen bei allen Aktionen. Eine gut gepflegte CLAUDE.md ist der wichtigste Hebel fuer konsistente und qualitativ hochwertige Ergebnisse mit Claude Code.`,
  },
  {
    id: 'claude-code',
    term: 'Claude Code',
    icon: Terminal,
    definition: `Claude Code ist der autonome KI-Coding-Agent von Anthropic, der direkt im Terminal laeuft. Im Gegensatz zu IDE-Plugins oder Chat-Interfaces arbeitet Claude Code als vollwertiger Agent, der das gesamte Projekt versteht und autonom Aenderungen vornehmen kann. Man interagiert ueber natuerliche Sprache: Man beschreibt, was man moechte, und Claude Code analysiert die Codebasis, plant die Umsetzung und fuehrt sie durch. Dabei kann der Agent Dateien lesen und schreiben, Terminal-Befehle ausfuehren, Git-Operationen durchfuehren und mit externen Diensten ueber MCP-Server kommunizieren. Claude Code unterstuetzt verschiedene Modelle der Claude-Familie und bietet Features wie Extended Thinking fuer komplexe Aufgaben, Plan Mode fuer strukturiertes Vorgehen und Multi-Agent-Orchestrierung fuer grosse Projekte. Die Installation erfolgt ueber npm mit dem Befehl npm install -g @anthropic-ai/claude-code. Claude Code ist das zentrale Werkzeug fuer Agentic Coding und definiert eine neue Kategorie der Softwareentwicklung.`,
  },
  {
    id: 'context-engineering',
    term: 'Context Engineering',
    icon: Brain,
    definition: `Context Engineering ist die Kunst und Wissenschaft, KI-Modellen optimalen Kontext bereitzustellen, um bestmoegliche Ergebnisse zu erzielen. Waehrend Prompt Engineering sich auf die Formulierung einzelner Anweisungen konzentriert, geht Context Engineering weiter: Es umfasst die systematische Gestaltung aller Informationsquellen, auf die ein KI-Agent zugreifen kann. Dazu gehoeren die CLAUDE.md-Datei mit Projekt-Kontext, die Strukturierung von Prompts mit klaren Zielen und Einschraenkungen, gezielte Datei-Referenzen im Gespraech sowie die Konfiguration von MCP-Tools fuer externen Datenzugriff. Context Engineering bestimmt massgeblich die Qualitaet der Ergebnisse: Ein gut konfigurierter Kontext fuehrt zu Code, der den Projektkonventionen entspricht, waehrend fehlender Kontext zu generischem oder inkonsistentem Code fuehrt. Wichtige Techniken umfassen das Chunking grosser Aufgaben, das Bereitstellen von Beispielen, die Nutzung von Subdirectory-CLAUDE.md-Dateien und die strategische Auswahl, welche Informationen im Context Window Platz finden.`,
  },
  {
    id: 'context-window',
    term: 'Context Window',
    icon: Gauge,
    definition: `Das Context Window bezeichnet die maximale Menge an Text, gemessen in Tokens, die ein KI-Modell in einer einzelnen Konversation verarbeiten kann. Bei Claude-Modellen umfasst das Context Window bis zu 200.000 Tokens, was etwa 150.000 Woertern oder 500 Seiten Text entspricht. Claude Code verwaltet das Context Window intelligent: Wenn die Konversation zu lang wird, fuehrt der Agent automatisch eine sogenannte Auto-Compaction durch, bei der aeltere Teile der Konversation zusammengefasst werden, um Platz fuer neue Informationen zu schaffen. Strategien, um innerhalb des Limits zu bleiben, umfassen: grosse Aufgaben in kleinere Schritte aufteilen, regelmaessig neue Konversationen starten, die compact-Funktion manuell nutzen und nur relevante Dateien referenzieren. Das Context Window umfasst sowohl den Input als auch den Output. Eine bewusste Verwaltung des Context Windows ist essenziell fuer die effektive Nutzung von Claude Code, da ein ueberladenes Fenster zu Qualitaetsverlusten bei den Antworten fuehren kann.`,
  },
  {
    id: 'hooks',
    term: 'Hooks',
    icon: Webhook,
    definition: `Hooks in Claude Code sind Shell-Befehle, die automatisch bei bestimmten Ereignissen ausgefuehrt werden. Sie ermoeglichen es, benutzerdefinierte Automatisierungen in den Workflow von Claude Code einzubauen. Es gibt verschiedene Hook-Typen: PreToolUse-Hooks laufen vor einem Tool-Aufruf und koennen diesen genehmigen, ablehnen oder modifizieren. PostToolUse-Hooks laufen nach einem Tool-Aufruf und koennen auf das Ergebnis reagieren. Notification-Hooks werden bei bestimmten Ereignissen wie dem Warten auf Nutzer-Input ausgeloest. Hooks werden in der Claude Code Settings-Datei konfiguriert, entweder global oder projektspezifisch. Typische Anwendungsfaelle sind: automatisches Linting nach Datei-Aenderungen, das Blockieren bestimmter Befehle in Produktionsumgebungen, das Ausfuehren von Tests nach Code-Aenderungen oder das Senden von Benachrichtigungen bei Abschluss laengerer Aufgaben. Hooks erhalten den Hook-Kontext als JSON auf stdin und koennen ueber stdout und Exit-Codes mit Claude Code kommunizieren. Sie sind ein maectiges Werkzeug fuer fortgeschrittene Automatisierung.`,
  },
  {
    id: 'mcp',
    term: 'MCP (Model Context Protocol)',
    icon: Network,
    definition: `Das Model Context Protocol, kurz MCP, ist ein offenes Protokoll von Anthropic, das eine standardisierte Schnittstelle zwischen KI-Modellen und externen Datenquellen oder Werkzeugen definiert. MCP folgt einer Client-Server-Architektur: Claude Code fungiert als MCP-Client und kommuniziert mit beliebig vielen MCP-Servern, die jeweils spezifische Faehigkeiten bereitstellen. Jeder Server bietet Tools, Resources oder Prompts an, die Claude Code nutzen kann. Das Protokoll basiert auf JSON-RPC und unterstuetzt sowohl lokale als auch remote Server. MCP erweitert Claude Code erheblich, indem es den Zugriff auf Datenbanken, APIs, Dateisysteme, Versionskontrolle und externe Dienste ermoeglicht. Beliebte MCP-Server umfassen: Filesystem fuer Dateioperationen, Git fuer Versionskontrolle, GitHub fuer Issue- und Pull-Request-Verwaltung, PostgreSQL und SQLite fuer Datenbanken sowie Slack fuer Team-Kommunikation. Die Konfiguration erfolgt ueber eine JSON-Datei, und Entwickler koennen eigene MCP-Server fuer individuelle Anforderungen erstellen. MCP ist die Grundlage fuer die Erweiterbarkeit von Claude Code.`,
  },
  {
    id: 'mcp-server',
    term: 'MCP Server',
    icon: Server,
    definition: `Ein MCP Server ist eine individuelle Implementierung des Model Context Protocol, die bestimmte Funktionen als Tools fuer Claude Code bereitstellt. Jeder Server wird als eigenstaendiger Prozess gestartet und kommuniziert ueber das standardisierte MCP-Protokoll mit Claude Code. Die Konfiguration erfolgt in der Datei .claude/settings.json oder ueber den Befehl claude mcp add im Terminal. Das JSON-Konfigurationsformat definiert den Server-Namen, den Startbefehl und optionale Argumente. Beispiele fuer MCP-Server: Der Filesystem-Server ermoeglicht strukturierte Dateioperationen, der Git-Server bietet Versionskontrolle mit JSON-Responses, der GitHub-Server verwaltet Issues und Pull Requests, der PostgreSQL-Server erlaubt Datenbank-Abfragen, der SQLite-Server arbeitet mit lokalen Datenbanken und der Slack-Server integriert Team-Kommunikation. Jeder Server definiert seine eigenen Tools mit Parametern und Beschreibungen. Claude Code erkennt automatisch alle verfuegbaren Tools der konfigurierten Server und kann sie kontextbezogen einsetzen. Eigene MCP-Server lassen sich mit dem MCP SDK in TypeScript oder Python entwickeln.`,
  },
  {
    id: 'multi-agent',
    term: 'Multi-Agent / Subagents',
    icon: Users,
    definition: `Multi-Agent-Systeme in Claude Code ermoeglichen es, mehrere KI-Agenten gleichzeitig an verschiedenen Aufgaben arbeiten zu lassen. Der Hauptagent kann ueber das Task-Tool sogenannte Subagents spawnen, die eigenstaendig Teilaufgaben bearbeiten. Jeder Subagent erhaelt einen eigenen Kontext und arbeitet parallel zu anderen Agenten. Das ist besonders nuetzlich fuer grosse Projekte: Waehrend ein Agent das Frontend implementiert, kann ein anderer am Backend arbeiten und ein dritter Tests schreibt. Die Team-Orchestrierung erfolgt ueber ein Task-System mit Aufgabenlisten, Abhaengigkeiten und Status-Tracking. Agenten kommunizieren ueber Nachrichten und koennen Ergebnisse austauschen. Subagents koennen als spezialisierte Rollen konfiguriert werden, etwa als Read-Only-Agent fuer Recherche oder als vollwertiger Agent mit Schreibzugriff. Die Multi-Agent-Architektur skaliert Claude Code von einem Einzelagenten zu einem koordinierten Team und ermoeglicht die Bearbeitung komplexer Projekte, die fuer einen einzelnen Agenten zu umfangreich waeren. Dies ist eine der fortgeschrittensten Funktionen von Claude Code.`,
  },
  {
    id: 'plan-mode',
    term: 'Plan Mode',
    icon: Map,
    definition: `Der Plan Mode ist ein spezieller Modus in Claude Code, bei dem der Agent zunaechst plant und analysiert, bevor er Code schreibt oder Aenderungen vornimmt. Im Plan Mode exploriert Claude Code die Codebasis, liest relevante Dateien, versteht die Architektur und erstellt einen detaillierten Umsetzungsplan. Dieser Plan wird dem Nutzer praesentiert, der ihn pruefen, Feedback geben und erst nach Zustimmung die Ausfuehrung freigeben kann. Der Plan Mode ist besonders wertvoll fuer komplexe Aufgaben, bei denen ein falscher Ansatz viel Zeit kosten wuerde. Man aktiviert ihn entweder durch explizite Anweisung oder ueber die Einstellung plan_mode_required fuer bestimmte Agenten. Der Ablauf folgt einem klaren Muster: Zuerst wird die Aufgabe analysiert, dann werden betroffene Dateien identifiziert, anschliessend wird ein Schritt-fuer-Schritt-Plan erstellt und schliesslich wird nach Genehmigung die Implementierung durchgefuehrt. Plan Mode reduziert Fehler und gibt Entwicklern die Kontrolle ueber den Entwicklungsprozess, ohne auf die Vorteile autonomer KI-Entwicklung zu verzichten.`,
  },
  {
    id: 'prompt-engineering',
    term: 'Prompt Engineering',
    icon: MessageSquare,
    definition: `Prompt Engineering bezeichnet die Kunst, Anweisungen so zu formulieren, dass KI-Modelle optimale Ergebnisse liefern. Fuer Claude Code gelten spezifische Best Practices: Sei praezise in deinen Anforderungen und beschreibe das gewuenschte Ergebnis klar. Statt vage zu sagen, erstelle eine Funktion, formuliere besser: Erstelle eine TypeScript-Funktion, die eine E-Mail-Adresse validiert und einen boolean zurueckgibt. Stelle Kontext bereit, indem du relevante Dateien oder Patterns erwahnst. Nutze Beispiele, um das gewuenschte Format zu verdeutlichen. Teile komplexe Aufgaben in kleinere, ueberschaubare Schritte auf. Definiere Einschraenkungen explizit, etwa welche Libraries verwendet oder vermieden werden sollen. Fuer Claude Code ist es besonders effektiv, die gewuenschte Architektur zu beschreiben, Teststrategie anzugeben und auf bestehende Patterns im Projekt zu verweisen. Gute Prompts enthalten Was, Warum und Wie und fuehren zu konsistenterem, qualitativ hoeherwertgerem Code. Prompt Engineering ist die Grundlage, auf der Context Engineering aufbaut.`,
  },
  {
    id: 'slash-commands',
    term: 'Slash Commands / Skills',
    icon: Command,
    definition: `Slash Commands, auch Skills genannt, sind vordefinierte oder benutzerdefinierte Befehle in Claude Code, die mit einem Schraegstrich beginnen und haeufige Workflows automatisieren. Eingebaute Commands umfassen /help fuer Hilfe, /compact zum manuellen Komprimieren des Kontexts, /clear zum Zuruecksetzen der Konversation und /cost zur Anzeige der Kosten. Besonders maechtig sind Custom Slash Commands, die im Verzeichnis .claude/commands/ als Markdown-Dateien erstellt werden. Jede Datei definiert einen Befehl: Der Dateiname wird zum Command-Namen und der Inhalt ist der Prompt, der ausgefuehrt wird. Beispielsweise erstellt die Datei .claude/commands/review.md den Befehl /review, der automatisch eine Code-Review des aktuellen Projekts durchfuehrt. Variablen wie $ARGUMENTS ermoeglichen dynamische Eingaben. Skills koennen komplexe, mehrstufige Workflows abbilden, etwa automatische Commits mit konventionellen Commit-Messages, Pull-Request-Erstellung oder Projekt-Scaffolding. Sie sind ein zentrales Werkzeug, um wiederkehrende Aufgaben effizient und konsistent durchzufuehren und den eigenen Workflow mit Claude Code zu optimieren.`,
  },
  {
    id: 'thinking-mode',
    term: 'Thinking Mode / Extended Thinking',
    icon: Lightbulb,
    definition: `Der Thinking Mode, auch Extended Thinking genannt, ist eine Funktion von Claude-Modellen, bei der das Modell seinen internen Denkprozess sichtbar macht, bevor es eine Antwort gibt. In Claude Code kann Extended Thinking aktiviert werden, um bei komplexen Aufgaben den schrittweisen Gedankengang des Agenten nachzuvollziehen. Das Modell analysiert dabei das Problem systematisch, waegt verschiedene Loesungsansaetze ab und begruendet seine Entscheidungen transparent. Extended Thinking ist besonders nuetzlich fuer Architektur-Entscheidungen, die Analyse komplexer Bugs, das Refactoring grosser Codebasen und die Planung mehrstufiger Implementierungen. Der Denkprozess wird in einem speziellen Bereich angezeigt und verbraucht zusaetzliche Tokens, fuehrt aber zu deutlich besseren Ergebnissen bei anspruchsvollen Aufgaben. In Claude Code laesst sich Extended Thinking ueber das Modell-Flag oder die Einstellungen aktivieren. Die Kombination aus Extended Thinking und Plan Mode ergibt einen besonders gruendlichen Arbeitsablauf, bei dem der Agent zunaechst tiefgehend nachdenkt und dann einen strukturierten Plan erstellt.`,
  },
  {
    id: 'token',
    term: 'Token',
    icon: Coins,
    definition: `Ein Token ist die grundlegende Einheit, in der KI-Modelle Text verarbeiten. Tokens sind keine ganzen Woerter, sondern Teilstuecke von Text: Im Englischen entspricht ein Token durchschnittlich etwa vier Zeichen oder drei Viertel eines Wortes. Im Deutschen, mit seinen laengeren zusammengesetzten Woertern, kann das Verhaeltnis leicht abweichen. Die Preisgestaltung der Anthropic-API basiert auf Tokens und unterscheidet zwischen Input-Tokens, also dem Text den man an das Modell sendet, und Output-Tokens, dem generierten Text. Output-Tokens sind typischerweise teurer als Input-Tokens. Fuer Claude Code bedeutet das: Jede Datei die gelesen wird, jeder Prompt und jede generierte Antwort verbraucht Tokens. Die Kosten lassen sich mit dem Befehl /cost waehrend einer Sitzung ueberwachen. Strategien zur Token-Optimierung umfassen: gezielte statt vollstaendige Datei-Referenzen, praezise Prompts ohne unnoetige Wiederholungen, regelmaessiges Komprimieren mit /compact und die Wahl des passenden Modells fuer die jeweilige Aufgabe. Kleinere Modelle wie Haiku sind fuer einfache Aufgaben kosteneffizienter.`,
  },
];

// ─────────────────────────────────────────────────────────────
// Komponente
// ─────────────────────────────────────────────────────────────

const GlossarView = () => {
  return (
    <div className="min-h-screen animate-fade-in-up">
      <Helmet>
        <title>Claude Code Glossar – Alle Begriffe von A bis Z erklaert</title>
        <meta
          name="description"
          content="Umfassendes Glossar zu Claude Code, Agentic Coding, MCP, CLAUDE.md, Context Engineering und allen wichtigen Begriffen der KI-gestuetzten Softwareentwicklung. Jeder Begriff ausfuehrlich erklaert."
        />
        <link rel="canonical" href="https://claude-code-masterkurs.de/glossar" />
        <meta property="og:title" content="Claude Code Glossar – Alle Begriffe von A bis Z erklaert" />
        <meta property="og:description" content="Umfassendes Glossar zu Claude Code: 16 Begriffe von Agentic Coding ueber CLAUDE.md und MCP bis Token. Jeder Begriff mit ausfuehrlicher Definition." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://claude-code-masterkurs.de/glossar" />
        <meta property="og:image" content="https://claude-code-masterkurs.de/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          "name": "Claude Code Glossar",
          "description": "Umfassendes Glossar zu Claude Code, Agentic Coding, MCP, CLAUDE.md, Context Engineering und weiteren Begriffen der KI-gestuetzten Softwareentwicklung.",
          "url": "https://claude-code-masterkurs.de/glossar",
          "inLanguage": "de",
          "hasDefinedTerm": [
            {"@type": "DefinedTerm", "name": "Agentic Coding", "description": "Programmieransatz bei dem ein KI-Agent Entwicklungsaufgaben eigenstaendig ausfuehrt"},
            {"@type": "DefinedTerm", "name": "Anthropic", "description": "US-amerikanisches KI-Unternehmen und Entwickler von Claude Code"},
            {"@type": "DefinedTerm", "name": "API-Key", "description": "Authentifizierungsschluessel fuer die Anthropic API"},
            {"@type": "DefinedTerm", "name": "CLAUDE.md", "description": "Markdown-Datei die Claude Code Projektkontext gibt"},
            {"@type": "DefinedTerm", "name": "Claude Code", "description": "Autonomer KI-Coding-Agent von Anthropic fuer das Terminal"},
            {"@type": "DefinedTerm", "name": "Context Engineering", "description": "Disziplin der optimalen Kontext-Bereitstellung fuer KI-Systeme"},
            {"@type": "DefinedTerm", "name": "Context Window", "description": "Maximale Textmenge die ein KI-Modell gleichzeitig verarbeiten kann"},
            {"@type": "DefinedTerm", "name": "Hooks", "description": "Automatische Aktionen die bei bestimmten Events in Claude Code ausgefuehrt werden"},
            {"@type": "DefinedTerm", "name": "MCP", "description": "Model Context Protocol – offenes Protokoll fuer die Kommunikation mit externen Services"},
            {"@type": "DefinedTerm", "name": "MCP Server", "description": "Server-Implementierung die externe Tools ueber MCP bereitstellt"},
            {"@type": "DefinedTerm", "name": "Multi-Agent / Subagents", "description": "System bei dem mehrere spezialisierte KI-Agents parallel arbeiten"},
            {"@type": "DefinedTerm", "name": "Plan Mode", "description": "Modus in dem Claude Code Aufgaben vor der Ausfuehrung plant"},
            {"@type": "DefinedTerm", "name": "Prompt Engineering", "description": "Technik zur Formulierung effektiver Anweisungen an KI-Modelle"},
            {"@type": "DefinedTerm", "name": "Slash Commands", "description": "Befehle die mit Schraegstrich beginnen und Aktionen in Claude Code ausloesen"},
            {"@type": "DefinedTerm", "name": "Thinking Mode", "description": "Modus der den Denkprozess von Claude Code sichtbar macht"},
            {"@type": "DefinedTerm", "name": "Token", "description": "Grundeinheit der Textverarbeitung in Large Language Models"}
          ]
        })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <nav className="flex items-center space-x-2 text-sm text-apple-muted mb-6 font-mono">
          <Link to="/" className="hover:text-apple-accent transition-colors">
            Startseite
          </Link>
          <span className="text-apple-border">&rsaquo;</span>
          <span className="text-apple-text">Glossar</span>
        </nav>
      </div>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="text-center pt-8 pb-12 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,107,26,0.10) 0%, transparent 70%)',
          }}
        />
        <div className="relative text-center">
          <div className="eyebrow center mb-6"><span className="pulse" />Glossar</div>
          <h1 className="text-[clamp(36px,5.2vw,68px)] font-semibold text-apple-text tracking-[-0.038em] leading-[1.04] mb-6">
            Claude Code <em className="italic-serif">Glossar</em>
          </h1>
          <p className="text-apple-textSecondary text-lg max-w-3xl mx-auto leading-relaxed">
            Von Agentic Coding bis Token: Dieses Glossar erklaert alle
            wichtigen Begriffe rund um Claude Code, das Model Context Protocol
            und KI-gestuetzte Softwareentwicklung. Jeder Eintrag ist so
            verfasst, dass er als eigenstaendige, zitierfaehige Definition
            funktioniert.
          </p>
        </div>
      </section>

      {/* ── Inhaltsverzeichnis ──────────────────────────── */}
      <section className="mb-12">
        <div className="bg-apple-card rounded-2xl border border-apple-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-apple-accent/10">
              <List size={18} className="text-apple-accent" />
            </div>
            <h2 className="text-lg font-bold text-apple-text">
              Inhaltsverzeichnis
            </h2>
            <span className="text-xs text-apple-muted font-mono">
              ({GLOSSARY_TERMS.length} Begriffe)
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {GLOSSARY_TERMS.map((entry) => {
              const Icon = entry.icon;
              return (
                <a
                  key={entry.id}
                  href={`#${entry.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-apple-bg/50 hover:bg-apple-accent/10 hover:border-apple-accent/30 border border-transparent transition-all text-sm group"
                >
                  <Icon
                    size={14}
                    className="text-apple-muted group-hover:text-apple-accent transition-colors shrink-0"
                  />
                  <span className="text-apple-textSecondary group-hover:text-apple-accent transition-colors truncate">
                    {entry.term}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Glossar-Eintraege ──────────────────────────── */}
      <section className="space-y-6 mb-16">
        {GLOSSARY_TERMS.map((entry) => {
          const Icon = entry.icon;
          return (
            <article
              key={entry.id}
              id={entry.id}
              className="bg-apple-card rounded-2xl border border-apple-border p-6 mb-6 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-apple-accent/10 border border-apple-accent/20">
                  <Icon size={20} className="text-apple-accent" />
                </div>
                <h2 className="text-apple-accent font-mono text-xl sm:text-2xl font-bold">
                  {entry.term}
                </h2>
              </div>
              <p className="text-apple-textSecondary text-sm sm:text-base leading-relaxed">
                {entry.definition}
              </p>
            </article>
          );
        })}
      </section>

      {/* ── Weiterfuehrende Ressourcen ─────────────────── */}
      <section className="mb-16">
        <div className="bg-apple-card rounded-2xl border border-apple-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-apple-accent/10 border border-apple-accent/20">
              <BookOpen size={20} className="text-apple-accent" />
            </div>
            <h2 className="text-2xl font-bold text-apple-text">
              Weiterfuehrende Ressourcen
            </h2>
          </div>
          <p className="text-apple-textSecondary text-sm mb-6 leading-relaxed">
            Vertiefe dein Wissen mit unseren ausfuehrlichen Anleitungen,
            Vergleichen und dem strukturierten Lernpfad des Claude Code
            Masterkurses.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/docs"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-apple-bg/50 border border-apple-border hover:border-apple-accent/40 transition-all group"
            >
              <span className="text-apple-textSecondary group-hover:text-apple-accent transition-colors text-sm font-medium">
                Dokumentation
              </span>
              <ArrowRight
                size={16}
                className="text-apple-muted group-hover:text-apple-accent transition-colors"
              />
            </Link>
            <Link
              to="/was-ist-claude-code"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-apple-bg/50 border border-apple-border hover:border-apple-accent/40 transition-all group"
            >
              <span className="text-apple-textSecondary group-hover:text-apple-accent transition-colors text-sm font-medium">
                Was ist Claude Code?
              </span>
              <ArrowRight
                size={16}
                className="text-apple-muted group-hover:text-apple-accent transition-colors"
              />
            </Link>
            <Link
              to="/vergleich"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-apple-bg/50 border border-apple-border hover:border-apple-accent/40 transition-all group"
            >
              <span className="text-apple-textSecondary group-hover:text-apple-accent transition-colors text-sm font-medium">
                Tool-Vergleich
              </span>
              <ArrowRight
                size={16}
                className="text-apple-muted group-hover:text-apple-accent transition-colors"
              />
            </Link>
            <Link
              to="/lesson/0"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-apple-bg/50 border border-apple-border hover:border-apple-accent/40 transition-all group"
            >
              <span className="text-apple-textSecondary group-hover:text-apple-accent transition-colors text-sm font-medium">
                Erste Lektion starten
              </span>
              <ArrowRight
                size={16}
                className="text-apple-muted group-hover:text-apple-accent transition-colors"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Autor & Quellen ────────────────────────────── */}
      <div className="mt-12 pt-6 border-t border-white/10 text-sm text-gray-400">
        <p>Von <strong className="text-gray-200">Cosmo Graef</strong>, Gruender &amp; Kursleiter des Claude Code Masterkurs | Zuletzt aktualisiert: 13. Februar 2026</p>
        <p className="mt-2">
          Quellen: <a href="https://anthropic.com" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Anthropic</a> · <a href="https://docs.anthropic.com/en/docs/claude-code" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Claude Code Docs</a> · <a href="https://modelcontextprotocol.io" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">MCP Spezifikation</a>
        </p>
      </div>
    </div>
  );
};

export default GlossarView;
