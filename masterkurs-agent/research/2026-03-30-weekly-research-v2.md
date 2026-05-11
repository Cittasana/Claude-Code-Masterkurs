# Weekly Research Report — Claude Code Masterkurs
**Datum:** 2026-03-30 | **KW 13** | **Erstellt von:** Masterkurs Weekly Agent v2.2
**Recherche-Typ:** Vollautomatisch (8 WebSearch-Anfragen, frische Recherche)
**Delta zum letzten Report:** 2026-03-19 (11 Tage)

---

## Executive Summary

Die letzten 11 Tage waren fuer Anthropic die turbulentesten des Jahres: **Computer Use** ist am 23.03. in Claude Code und Cowork gelandet — Claude kann jetzt den Mac-Desktop steuern (Maus, Tastatur, Screenshots). Am 26.03. wurden durch einen Konfigurationsfehler interne Dokumente zu **"Claude Mythos" (Codename Capybara)** geleakt — ein neues Modell-Tier *oberhalb* von Opus mit drastisch besseren Coding-, Reasoning- und Cybersecurity-Scores. Parallel hat ein Bundesrichter in San Francisco die Pentagon-Sperre gegen Anthropic per **einstweiliger Verfuegung** blockiert und "First Amendment Retaliation" zitiert. Im Wettbewerb hat Cursor **Self-Hosted Cloud Agents** (25.03.) und **Composer 2** (19.03.) gelauncht, waehrend GitHub Copilot **Agentic Code Review** und einen **50% schnelleren Coding Agent** ausrollt. Der Markt zeigt: Gartner prognostiziert, dass **40% aller Enterprise-Apps bis Jahresende AI Agents einbetten** — hoch von <5% in 2025.

---

## 1. Neue Claude Code Features & Updates (seit 19.03.)

### 1.1 Computer Use in Claude Code & Cowork
**Status:** Research Preview (23.03.) | **Relevanz:** SEHR HOCH

```bash
# Computer Use aktivieren:
# 1. Claude Desktop App oeffnen (macOS only)
# 2. Settings → Computer Use → Enable
# 3. In Cowork oder Claude Code verfuegbar

# Was Claude jetzt kann:
# - Screenshots des Desktops/Fensters aufnehmen
# - Maus bewegen, klicken, doppelklicken, drag-and-drop
# - Tastatur-Eingaben, Key-Combinations
# - Scrollen (vertikal + horizontal)
# - Apps oeffnen, Dev-Tools nutzen, Dateien navigieren

# Workflow-Loop:
# Screenshot → Analyse → Aktion → Screenshot → ...
```

**Erklaerung (120 Worte):** Computer Use ist das groesste neue Feature seit dem 1M Context Window. Claude nimmt einen Screenshot des aktuellen Desktops auf, analysiert ihn mit seinen Vision-Faehigkeiten und entscheidet, welche Aktion als naechstes ausgefuehrt werden soll — ein kontinuierlicher Loop aus Sehen und Handeln. Dabei priorisiert Claude praezise Tools: Zuerst werden direkte Connectors (Slack, Calendar) genutzt, erst wenn keiner verfuegbar ist, greift Claude auf direkte Maus-/Tastatur-Steuerung zurueck. Aktuell nur auf macOS verfuegbar und als Research Preview fuer Pro- und Max-Subscriber. Anthropic warnt explizit: Das Feature ist noch frueh, Fehler sind moeglich, sensible Daten sollten gemieden werden. Fuer den Kurs ein absolutes Pflicht-Modul — es definiert eine neue Kategorie von AI-Assistenz.

### 1.2 Voice STT: 10 neue Sprachen
**Status:** Live | **Relevanz:** MITTEL

```bash
# Neu unterstuetzte Sprachen (20 total):
# Russisch, Polnisch, Tuerkisch, Niederlaendisch,
# Ukrainisch, Griechisch, Tschechisch, Daenisch,
# Schwedisch, Norwegisch

# Deutsch war bereits vorher unterstuetzt
# Voice-Input via /voice oder Mikrofon-Button
```

**Erklaerung (80 Worte):** Claude Code unterstuetzt jetzt 20 Sprachen fuer Voice-to-Text-Eingabe. Die Erweiterung um 10 europaeische Sprachen zeigt Anthropics Fokus auf internationale Expansion. Fuer deutschsprachige Kursteilnehmer aendert sich nichts direkt (Deutsch war bereits verfuegbar), aber die breitere Sprachunterstuetzung macht Claude Code attraktiver fuer multinationale Teams. Ein guter Punkt fuer die "Produktivitaets-Tricks"-Lektion: Wer schneller spricht als tippt, kann mit Voice-Input Prompts diktieren.

### 1.3 MCP Elicitation Support
**Status:** Live | **Relevanz:** HOCH

```jsonc
// MCP Server kann jetzt aktiv Informationen vom User anfordern
// Beispiel: Ein DB-MCP-Server fragt nach Connection-String

// Server-seitig:
{
  "method": "elicitation/request",
  "params": {
    "message": "Please provide your database connection string",
    "schema": {
      "type": "object",
      "properties": {
        "connection_string": { "type": "string" }
      }
    }
  }
}

// Claude Code zeigt dem User ein Eingabefeld
// und leitet die Antwort an den MCP Server weiter
```

**Erklaerung (90 Worte):** MCP Elicitation ist ein wichtiger Schritt fuer interaktivere MCP-Server. Bisher konnten MCP-Tools nur passiv auf Anfragen reagieren — jetzt koennen sie aktiv Informationen vom Nutzer anfordern. Das ermoeglicht komplexere Workflows: Ein Deployment-Server kann nach dem Zielumfeld fragen, ein DB-Server nach Credentials, ein CI-Tool nach der gewuenschten Pipeline. Fuer den Kurs relevant im MCP-Modul: Es zeigt, dass MCP sich von einem einfachen Tool-Interface zu einem echten Interaktionsprotokoll entwickelt.

### 1.4 Weitere Updates (Zusammenfassung)

| Feature | Details |
|---------|---------|
| **StopFailure** | Neuer Fehlertyp fuer saubereres Agent-Handling |
| **Transcript Search** | Durchsuchbare Session-Transkripte |
| **Custom Auto-Memory Directory** | Eigenes Verzeichnis fuer Memory-Dateien konfigurierbar |
| **Timestamps auf Memory-Dateien** | Memory-Dateien erhalten Zeitstempel |
| **Session Display Names** | Bessere Session-Benennung |
| **Sparse Worktree Paths** | Worktree-Support fuer Sparse-Checkouts |
| **X-Claude-Code-Session-Id Header** | API-Requests enthalten Session-ID fuer Proxy-Aggregation |
| **Hook Events erweitert** | Mehr Events fuer Custom Hooks verfuegbar |
| **/claude-api Skill** | Neuer Skill fuer Anthropic SDK/API-Entwicklung |

---

## 2. Anthropic Unternehmensnews

### 2.1 Claude Mythos / Capybara Leak (26.-27.03.)
**Status:** Bestaetigt durch Anthropic | **Relevanz:** SEHR HOCH

Durch einen Konfigurationsfehler im CMS von Anthropic wurden ca. 3.000 unveröffentlichte Assets oeffentlich zugaenglich — darunter Draft-Blogposts und interne Dokumente zu einem neuen Modell.

**Kernfakten:**
- **Modellname:** Claude Mythos (interner Codename: Capybara)
- **Tier:** Neues Tier *oberhalb* von Opus — groesser und intelligenter
- **Performance:** "Dramatically higher scores" in Coding, Reasoning und Cybersecurity vs. Opus 4.6
- **Anthropic-Statement:** "Step change in AI performance" und "most capable model we've built to date"
- **Cybersecurity-Warnung:** Interne Dokumente beschreiben das Modell als "currently far ahead of any other AI model in cyber capabilities"
- **Markt-Reaktion:** Software-Aktien und Bitcoin reagierten auf die Nachricht, CrowdStrike-Bewertung wurde diskutiert

**Einschaetzung fuer den Kurs:** Das ist die groesste Anthropic-Nachricht des Quartals. Wenn Mythos gelauncht wird, aendert sich das Spielfeld komplett. Kursteilnehmer sollten verstehen: (1) Was ein neues Modell-Tier bedeutet, (2) Warum Cybersecurity-Capabilities ein zweischneidiges Schwert sind, (3) Dass sie auf dem richtigen Oekosystem setzen — Anthropic baut das staerkste Modell.

### 2.2 Gerichtliche Verfuegung gegen Pentagon-Sperre (26.03.)
**Status:** Bestaetigt | **Relevanz:** HOCH (Kontext)

Ein Bundesrichter in San Francisco hat eine **einstweilige Verfuegung** gegen die Pentagon-Entscheidung erlassen, Anthropic als "supply chain risk" einzustufen. Der Richter zitierte **"First Amendment Retaliation"** — die Regierung duerfe ein Unternehmen nicht bestrafen, weil es ethische Grenzen fuer militaerische AI-Nutzung setzt.

- **Dario Amodei:** "Werde nicht erlauben, dass Claude fuer autonome Waffen oder die Ueberwachung von US-Buergern eingesetzt wird"
- **Auswirkung:** Die Sperre ist vorlaeufig aufgehoben; das Verfahren laeuft weiter

**Kurs-Relevanz:** Starke Story fuer Positionierung — "Anthropic gewinnt vor Gericht, weil Ethik zaehlt."

### 2.3 $100M Claude Partner Network (12.03.)
**Status:** Bestaetigt | **Relevanz:** MITTEL

Anthropic investiert 100 Millionen Dollar in das **Claude Partner Network** — ein Oekosystem fuer Unternehmen, die auf Claude aufbauen. Details zu Foerderkriterien und Antragsverfahren noch nicht vollstaendig bekannt.

### 2.4 Anthropics "Madcap March" (Gesamtbild)

The New Stack fasst zusammen: **14+ Launches, 5 Outages und ein versehentlicher Mythos-Leak** in einem Monat. Das zeigt sowohl das enorme Tempo als auch die Wachstumsschmerzen bei Anthropic.

---

## 3. Community Best Practices & Common Mistakes

### 3.1 Boris Cherny's Workflow (Claude Code Creator)

Eine neue Interview-Analyse (25.03.) gibt Einblick in den Workflow des Claude-Code-Erfinders:

```bash
# Boris Chernys Setup:
# - CLAUDE.md auf ~2.500 Tokens (~100 Zeilen) begrenzt
# - Laeuft 10-15 Claude Code Sessions gleichzeitig
# - Immer mit Plan Mode starten
# - Zwei-Claude-Methode: Ein Claude plant, ein zweiter reviewt als Staff Engineer

# Sein Kernprinzip:
# "Der groesste Fehler ist, Claude direkt coden zu lassen
#  ohne Plan. Immer erst Plan Mode."
```

**Erklaerung (100 Worte):** Boris Cherny, der Schoepfer von Claude Code bei Anthropic, hat seinen persoenlichen Workflow offengelegt — und er ist ueberraschend minimalistisch. Seine CLAUDE.md hat nur ~100 Zeilen (2.500 Tokens), weil ueberlange Kontextdateien die Performance verschlechtern. Er laeuft staendig 10-15 parallele Sessions und nutzt konsequent die Zwei-Claude-Methode: Ein Claude erstellt den Plan, ein zweiter reviewt als "Staff Engineer". Dieses Pattern sollte ein Kern-Modul im Kurs werden — es kommt direkt vom Macher und widerlegt den Instinkt, CLAUDE.md mit moeglichst viel Kontext vollzupacken. Qualitaet schlaegt Quantitaet.

### 3.2 Neue Community-Ressourcen (seit letztem Report)

| Ressource | Typ | Highlights |
|-----------|-----|------------|
| **Boris Cherny Interview** (mindwiredai.com) | Workflow-Analyse | Creator's 100-Line Workflow, Zwei-Claude-Methode |
| **Builder.io: 50 Claude Code Tips** | Umfassender Guide | Praxis-Tipps fuer den Alltag, gut strukturiert |
| **eesel AI: 7 Best Practices** | Real-Project Guide | Aus echten Projekten abgeleitet, pragmatisch |
| **shanraisshan: Best Practice Repo** | GitHub Repo | "Practice made Claude perfect" — Community-curated |

### 3.3 Haeufiger Fehler: CLAUDE.md Overloading

```bash
# FALSCH ❌ — Zu viel in CLAUDE.md
# 5.000+ Tokens, jede API-Route, jedes Schema, jede Konvention

# RICHTIG ✅ — Boris Chernys Ansatz
# ~2.500 Tokens (~100 Zeilen), nur das Wesentliche:
# - Projekt-Typ und Tech-Stack
# - Kern-Konventionen (max 10)
# - Haeufige Fehler die Claude macht
# - Links zu Detail-Docs (nicht die Docs selbst)

# Warum? Claude liest CLAUDE.md bei JEDEM Request.
# Je laenger, desto mehr Token-Overhead, desto unschaerfer der Fokus.
```

**Community-Erkenntnis:** Der Creator selbst bestaetigt: Weniger ist mehr bei CLAUDE.md. Fokussiere auf die Top-10-Regeln, nicht auf ein Nachschlagewerk.

---

## 4. Wettbewerber-Updates

### 4.1 Cursor

| Update | Datum | Details |
|--------|-------|---------|
| **Self-Hosted Cloud Agents** | 25.03. | Code, Build-Output und Secrets bleiben im eigenen Netzwerk |
| **Composer 2** | 19.03. | "Frontier-level coding performance" bei schwierigen Tasks |
| **Automations (Always-On)** | 05.03. | Event-Trigger: Slack, Linear, GitHub, PagerDuty, Webhooks |
| **JetBrains via ACP** | 04.03. | IntelliJ, PyCharm, WebStorm |
| **Bugbot Autofix** | Maerz | Bugbot findet Problem → startet Cloud Agent → schlaegt Fix-PR vor |
| **30+ Plugins** | 11.03. | Atlassian, Datadog, GitLab, Glean, Hugging Face, PlanetScale |

**Einschaetzung:** Cursor bleibt der aggressivste Wettbewerber. **Self-Hosted Cloud Agents** sind ein direkter Enterprise-Play — grosse Unternehmen wollen nicht, dass Code die eigene Infrastruktur verlaesst. **Composer 2** positioniert sich als Antwort auf Claude Code's ueberlegene Coding-Qualitaet. **Bugbot Autofix** ist bemerkenswert: Es automatisiert den Loop "Bug finden → Bug fixen → PR erstellen" komplett.

### 4.2 GitHub Copilot

| Update | Datum | Details |
|--------|-------|---------|
| **Agentic Code Review** | Maerz | Sammelt Projekt-Kontext, schlaegt Fixes vor, kann Coding Agent fuer Fix-PRs triggern |
| **Coding Agent 50% schneller** | Maerz | Deutlich reduzierte Startzeit |
| **Semantic Code Search** | Maerz | Findet konzeptuell verwandten Code statt nur Keyword-Matches |
| **Coding Agent Management APIs** | Maerz | REST APIs fuer Org-Level Repository-Zugriff (Public Preview) |
| **Agent Mode GA auf JetBrains** | 11.03. | Agent Mode jetzt auch in JetBrains IDEs verfuegbar |
| **GPT-5.3-Codex LTS** | 18.03. | Neues Basis-Modell, hohe "Code Survival Rate" |

**Einschaetzung:** Copilot setzt auf **Agentic Code Review** als Differenzierung — der Loop "Review → Fix → PR" wird vollautomatisch. **Semantic Code Search** ist ein echtes Feature: Wenn man "Login-Bug" beschreibt, findet Copilot Auth-Middleware und Session-Handling, auch wenn diese Dateien nie "login" erwaehnen. Die **Management APIs** zeigen Enterprise-Fokus.

### 4.3 Marktueberblick (aktualisiert KW 13)

| Tool | Staerke | Aktueller Fokus | Neustes Feature |
|------|---------|-----------------|-----------------|
| **Claude Code** | 46% Most Loved, Computer Use | Desktop-Steuerung, Mythos-Modell | Computer Use (23.03.) |
| **Cursor** | IDE + Cloud Agents | Self-Hosted, Enterprise-Security | Self-Hosted Agents (25.03.) |
| **Copilot** | Distribution, Agentic Review | Vollautom. Review-Fix-Loop | Agentic Code Review (03/26) |
| **Windsurf** | Speed, Multi-Model | Cognition-Integration | Cascade Workflows |

---

## 5. Markt-Trends

### 5.1 Gartner: 40% Enterprise-Apps mit AI Agents bis Jahresende

Gartner prognostiziert, dass **40% aller Enterprise-Anwendungen bis Ende 2026 AI Agents einbetten** — hoch von weniger als 5% in 2025. Das ist ein 8x-Sprung in einem Jahr.

### 5.2 Agentic AI dominiert mit 55% Attention Share

In 2026 beansprucht Agentic AI **55% der Aufmerksamkeit** im AI-Entwicklungsmarkt — autonome Systeme, die planen, ausfuehren, testen und iterieren mit minimalem menschlichem Eingriff.

### 5.3 Job-Markt-Shift: +340% AI-Coding-Stellenanzeigen

Laut Hired.com sind Stellenanzeigen mit AI-Coding-Tool-Erfahrung zwischen Januar 2025 und Januar 2026 um **340%** gestiegen. Gleichzeitig sind reine Implementations-Rollen um **17% gesunken**. Der Markt signalisiert: Gefragt sind Entwickler, die AI-generierten Code evaluieren und Workflows orchestrieren koennen.

### 5.4 "Vibe Coding" bei 40% Enterprise-Software

Bis 2026 werden geschaetzt **40% der Enterprise-Software** mit Natural-Language-gesteuertem "Vibe Coding" erstellt. Business-User, nicht nur Engineers, bauen jetzt Agents.

### 5.5 "Agent Washing" — Warnung

Industrie-Analysten schaetzen, dass nur **~130 von Tausenden** selbsternannten "AI Agent"-Anbietern tatsaechlich agentic-faehige Systeme bauen. Der Rest ist umgelabeltes Automation-Marketing.

### 5.6 Aktualisierte Marktzahlen

| Metrik | Wert | Aenderung vs. letzter Report |
|--------|------|------------------------------|
| AI Agents Market 2030 | $52.62 Mrd. | Unveraendert |
| AI Code Assistant Market 2033 | $14.6 Mrd. | NEU (heute: $4.7 Mrd.) |
| Enterprise AI Agent Adoption 2026 | 40% | NEU (Gartner) |
| AI-Coding Job Postings YoY | +340% | NEU (Hired.com) |
| Developer Adoption | 85%+ | Unveraendert |
| Multi-Agent Inquiries (Gartner) | +1.445% | Unveraendert |
| Anthropic Enterprise-Erstkaeufe | 73% | Unveraendert (Ramp-Daten) |

---

## 6. Content-Empfehlungen fuer den Kurs

> **Hinweis:** Die Content-Ideen-Datei (Obsidian CittasanaBrain) war durch einen iCloud-Lock nicht lesbar.
> Empfehlungen basieren auf Marktdaten, Community-Trends, Feature-Neuheiten und dem letzten Report.

### PRIORITAET HOCH (Diese Woche umsetzen)

| # | Thema | Format | Begruendung |
|---|-------|--------|-------------|
| 1 | **Computer Use Masterclass** | Video + Live-Demo | Groesstes neues Feature. Zeige: Setup, erster Use Case, Grenzen. "Claude steuert deinen Mac" ist ein viraler Hook. |
| 2 | **Claude Mythos Briefing: Was kommt nach Opus?** | Short-Form / Newsletter | Leak-Story erklaeren, was Capybara-Tier bedeutet, warum Cybersecurity-Warnung wichtig ist. Positionierung: "Du lernst das Oekosystem, das gerade das staerkste Modell baut." |
| 3 | **Boris Chernys Workflow: Vom Creator lernen** | Lektion + Template | CLAUDE.md auf 100 Zeilen, 10-15 parallele Sessions, Zwei-Claude-Methode. Direkt vom Macher — unschlagbare Glaubwuerdigkeit. |
| 4 | **Job-Markt-Briefing: +340% AI-Coding-Jobs** | Infografik + Newsletter | Hired.com-Daten zeigen: Wer Claude Code beherrscht, ist gefragt. Starkes Marketing-Argument fuer den Kurs. |

### PRIORITAET MITTEL (Naechste 2 Wochen)

| # | Thema | Format | Begruendung |
|---|-------|--------|-------------|
| 5 | **MCP Elicitation: Interaktive Tools bauen** | Hands-On Lab | MCP wird zum echten Interaktionsprotokoll — Elicitation zeigt die Richtung |
| 6 | **Wettbewerber-Vergleich Update: Cursor Self-Hosted vs Claude Code** | Analyse-Artikel | Cursor's Self-Hosted Cloud Agents vs Claude Code's Agent Teams — Enterprise-Perspektive |
| 7 | **Agentic Code Review: Copilot vs Claude Code** | Vergleichs-Video | Copilot automatisiert Review→Fix→PR. Wie macht man das mit Claude Code? |
| 8 | **Semantic Search Patterns** | Quick-Tip | Copilot's Semantic Search zeigt eine Richtung — wie nutzt man Claude Code fuer aehnliche Muster? |

### PRIORITAET NIEDRIG (Backlog)

| # | Thema | Format | Begruendung |
|---|-------|--------|-------------|
| 9 | **"Agent Washing" erkennen** | Bonus-Content | Nur ~130 echte Agent-Anbieter — wie unterscheidet man echt von Marketing? |
| 10 | **Voice Input Produktivitaet** | Quick-Tip | 20 Sprachen, Deutsch bereits drin — fuer Viel-Tipper ein Produktivitaetsgewinn |
| 11 | **Anthropic Institute & Ethik-USP** | Kontext-Modul | Gerichtsentscheidung + Ethik-Positionierung als Kurs-Narrativ |

---

## 7. Quellen-Verzeichnis

### Offizielle Anthropic-Quellen
- [Claude Code CHANGELOG.md — GitHub](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Claude Code Changelog — Offizielle Docs](https://code.claude.com/docs/en/changelog)
- [Claude Code Releases — GitHub](https://github.com/anthropics/claude-code/releases)
- [Releasebot: Claude Code Updates](https://releasebot.io/updates/anthropic/claude-code)
- [ClaudeLog Changelog](https://claudelog.com/claude-code-changelog/)
- [Anthropic News](https://www.anthropic.com/news)
- [Claude Blog: Dispatch & Computer Use](https://claude.com/blog/dispatch-and-computer-use)
- [Claude Help: Computer Use in Cowork](https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork)

### Claude Mythos / Capybara Leak
- [Exclusive: Anthropic 'Mythos' AI model — Fortune (26.03.)](https://fortune.com/2026/03/26/anthropic-says-testing-mythos-powerful-new-ai-model-after-data-leak-reveals-its-existence-step-change-in-capabilities/)
- [Claude Mythos Leak & Cybersecurity — Fortune (27.03.)](https://fortune.com/2026/03/27/anthropic-leaked-ai-mythos-cybersecurity-risk/)
- [Claude Mythos Leak & Market Impact — CoinDesk (27.03.)](https://www.coindesk.com/markets/2026/03/27/anthropic-s-massive-claude-mythos-leak-reveals-a-new-ai-model-that-could-be-a-cybersecurity-nightmare)
- [Details Leak on Mythos — Techzine](https://www.techzine.eu/news/applications/140017/details-leak-on-anthropics-step-change-mythos-model/)
- [Anthropic's Madcap March — The New Stack](https://thenewstack.io/anthropic-march-2026-roundup/)

### Anthropic Legal / Pentagon
- [Judge Blocks Anthropic Ban — NPR (26.03.)](https://www.npr.org/2026/03/26/nx-s1-5762971/judge-temporarily-blocks-anthropic-ban)
- [Anthropic Wins Preliminary Injunction — CNBC (26.03.)](https://www.cnbc.com/2026/03/26/anthropic-pentagon-dod-claude-court-ruling.html)
- [Tech Industry Rallies Behind Anthropic — Axios (16.03.)](https://www.axios.com/2026/03/16/tech-industry-rallies-anthropic-pentagon-fight)

### Computer Use
- [Claude Code & Cowork Can Now Use Your Computer — Engadget](https://www.engadget.com/ai/claude-code-and-cowork-can-now-use-your-computer-210000126.html)
- [Claude AI Can Now Use Your Mac — MacRumors (24.03.)](https://www.macrumors.com/2026/03/24/claude-use-mac-remotely-iphone/)
- [Computer Use Explained — RenovateQR](https://renovateqr.com/blog/claude-computer-use-2026)
- [What Is Claude Code Computer Use — MindStudio](https://www.mindstudio.ai/blog/what-is-claude-code-computer-use)
- [Full Capability Interpretation — Apiyi.com](https://help.apiyi.com/en/claude-code-2026-new-features-loop-computer-use-remote-control-guide-en.html)

### Wettbewerber
- [Cursor Changelog](https://cursor.com/changelog)
- [Cursor March 2026 Updates — Agency Journal](https://theagencyjournal.com/cursors-march-2026-updates-jetbrains-integration-and-smarter-agents/)
- [Cursor Beta Features 2026 — Markaicode](https://markaicode.com/cursor-beta-features-2026/)
- [GitHub Copilot What's New](https://github.com/features/copilot/whats-new)
- [GitHub Changelog — Copilot](https://github.blog/changelog/label/copilot/)
- [Copilot for Students Changes — eplus.dev](https://eplus.dev/github-copilot-for-students-what-changed-in-march-2026)

### Markt-Trends & Analysen
- [Anthropic 2026 Agentic Coding Trends Report (PDF)](https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf)
- [5 Key Trends Agentic Development — The New Stack](https://thenewstack.io/5-key-trends-shaping-agentic-development-in-2026/)
- [AI Agent Adoption 2026: Gartner, IDC — Joget](https://joget.com/ai-agent-adoption-in-2026-what-the-analysts-data-shows/)
- [150+ AI Agent Statistics 2026 — Master of Code](https://masterofcode.com/blog/ai-agent-statistics)
- [AI Coding Tools 2026 Ranked — Tech Insider](https://tech-insider.org/ai-coding-tools-2026-transforming-software-development/)
- [Google Cloud: AI Agent Trends 2026](https://cloud.google.com/resources/content/ai-agent-trends-2026)

### Community & Best Practices
- [Boris Cherny's 100-Line Workflow — MindWired AI (25.03.)](https://mindwiredai.com/2026/03/25/claude-code-creator-workflow-claudemd/)
- [50 Claude Code Tips — Builder.io](https://www.builder.io/blog/claude-code-tips-best-practices)
- [7 Best Practices from Real Projects — eesel AI](https://www.eesel.ai/blog/claude-code-best-practices)
- [Best Practices — Offizielle Docs](https://code.claude.com/docs/en/best-practices)
- [Claude Code Ultimate Guide — GitHub (FlorianBruniaux)](https://github.com/FlorianBruniaux/claude-code-ultimate-guide)
- [Every Claude Code Update March 2026 — Builder.io](https://www.builder.io/blog/claude-code-updates)

---

*Report generiert am 2026-03-30 durch den Masterkurs Weekly Agent v2.2*
*8 WebSearch-Anfragen, Delta-Report zum 2026-03-19*
*Naechster Report: 2026-04-06*
