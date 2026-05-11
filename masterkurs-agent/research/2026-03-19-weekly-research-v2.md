# Weekly Research Report — Claude Code Masterkurs
**Datum:** 2026-03-19 | **KW 12** | **Erstellt von:** Masterkurs Weekly Agent v2.2
**Recherche-Typ:** Vollautomatisch (8 WebSearch-Anfragen, frische Recherche)
**Delta zum letzten Report:** 2026-03-16 (3 Tage)

---

## Executive Summary

In den drei Tagen seit dem letzten Report hat sich das Umfeld von Anthropic dramatisch veraendert: Das **US-Verteidigungsministerium (DOD) hat Anthropic als "unacceptable risk to national security" eingestuft**, was eine Tech-Industrie-weite Solidaritaetswelle ausgeloest hat und Anthropic ins Zentrum einer AI-Ethics-Debatte katapultiert. Parallel dazu zeigen **Ramp-Daten, dass Anthropic 73% aller Erstkaeufe im Enterprise-AI-Markt** gewinnt — ein starkes Signal fuer die Marktdominanz. Technisch gibt es kleinere Claude Code Updates (/color, Custom Model Picker, Token-Limit-Erhoehungen). GitHub Copilot hat **GPT-5.3-Codex als Long-Term-Support-Modell** eingefuehrt (18.03.), und Anthropic hat das **Anthropic Institute** als neue Forschungseinrichtung fuer gesellschaftliche AI-Auswirkungen gegruendet. Der Agentic-Coding-Trend beschleunigt sich: Agents fuehren jetzt **20 Aktionen autonom** aus (doppelt so viel wie vor 6 Monaten), und Gartner meldet einen **1.445% Anstieg bei Multi-Agent-Anfragen**.

---

## 1. Neue Claude Code Features & Updates (seit 16.03.)

### 1.1 /color Command (Session-Farben)
**Status:** Live | **Relevanz:** NIEDRIG

```bash
# Session-Farbe setzen fuer visuelle Unterscheidung
/color blue
/color #ff6b35

# Farbe erscheint in der Prompt-Bar
# Nuetzlich bei parallelen Sessions
```

**Erklaerung (80 Worte):** Der /color-Befehl ermoeglicht es, jeder Claude-Code-Session eine eigene Farbe in der Prompt-Bar zuzuweisen. Das klingt trivial, ist aber beim Arbeiten mit mehreren parallelen Sessions ein echter Produktivitaetsgewinn: Man erkennt sofort, in welcher Session man sich befindet. In Kombination mit dem bereits vorhandenen `/name`-Befehl (Session benennen) ergibt sich ein visuelles Organisations-System. Fuer den Kurs eher ein Quick-Tip als ein ganzes Modul, aber gut fuer eine "5 versteckte Features"-Lektion.

### 1.2 Custom Model Picker
**Status:** Live | **Relevanz:** MITTEL

```bash
# Eigenes Modell zum /model Picker hinzufuegen
export ANTHROPIC_CUSTOM_MODEL_OPTION="my-custom-model-id"
export ANTHROPIC_CUSTOM_MODEL_OPTION_NAME="My Fine-Tuned Model"
export ANTHROPIC_CUSTOM_MODEL_OPTION_DESCRIPTION="Optimized for our codebase"

# Danach in Claude Code:
/model
# → Zeigt jetzt auch "My Fine-Tuned Model" als Option
```

**Erklaerung (90 Worte):** Mit der neuen Umgebungsvariable ANTHROPIC_CUSTOM_MODEL_OPTION koennen Nutzer eigene Modell-Eintraege zum /model-Picker hinzufuegen. Das ist besonders relevant fuer Teams, die ueber Bedrock oder Vertex eigene Fine-Tuned-Modelle betreiben oder spezifische Modell-Versionen pinnen wollen. Die optionalen _NAME und _DESCRIPTION Suffixe sorgen fuer benutzerfreundliche Anzeige. Fuer den Masterkurs ist das ein fortgeschrittenes Enterprise-Feature — relevant fuer die Lektion zu Custom Configurations und Team-Setups.

### 1.3 Erhoehte Token-Limits
**Status:** Live | **Relevanz:** HOCH

```
# Neue Default-Limits:
# Claude Opus 4.6:   64k Tokens Default-Output (vorher niedriger)
# Opus 4.6 + Sonnet 4.6: Bis zu 128k Token Output moeglich

# 1M Context Window:
# Verfuegbar auf Max, Team und Enterprise Plans
# Requests >200k Tokens funktionieren automatisch — kein Beta-Header noetig
# Media-Cap: bis zu 600 Medien-Elemente pro Request
```

**Erklaerung (100 Worte):** Die Erhoehung der Output-Token-Limits ist eine stille aber bedeutende Verbesserung. Mit 64k Default und bis zu 128k Maximum kann Claude Code jetzt deutlich laengere Code-Bloecke, umfassendere Refactorings und groessere Dateien in einem einzigen Response generieren. Vorher musste man bei langen Outputs oft "weiter" sagen. Das 1M Context Window ist jetzt GA ohne Beta-Header, mit einem erhoehten Media-Cap von 600 Elementen. Fuer den Kurs bedeutet das: Die bestehende "1M Context Masterclass"-Lektion sollte aktualisiert werden mit den neuen Output-Limits und praktischen Beispielen fuer Langform-Generierung.

### 1.4 Bug Fixes & Stabilitaet
**Status:** Live | **Relevanz:** MITTEL

Umfangreiche Fixes fuer:
- **tmux-Verhalten** — Session-Management stabiler
- **Permission-Handling** — konsistentere Berechtigungsdialoge
- **Auto-Updater** — zuverlaessigeres Update im Hintergrund
- **Memory Management** — bessere Speicherverwaltung bei langen Sessions

---

## 2. Anthropic Unternehmensnews

### 2.1 DOD-Konflikt: Anthropic als "National Security Risk"
**Status:** Breaking News (18.03.2026) | **Relevanz:** HOCH (Kontext)

Das US-Verteidigungsministerium hat Anthropic offiziell als "unacceptable risk to national security" bezeichnet. Hintergrund: Anthropic hat "Red Lines" fuer militaerische Nutzung gezogen und weigert sich, bestimmte AI-Anwendungen fuer das Pentagon bereitzustellen. Die Trump-Administration kuendigt rechtliche Schritte an. Die Tech-Industrie hat sich hinter Anthropic gestellt (Axios berichtet von breiter Solidaritaet).

**Relevanz fuer den Kurs:** Kein technisches Thema, aber extrem relevant fuer die Positionierung. Anthropic differenziert sich durch Ethik — das ist ein USP, den Kursteilnehmer verstehen sollten. Moeglicher Bonus-Content: "Warum Anthropic anders tickt — und was das fuer Claude Code bedeutet."

### 2.2 Anthropic Institute gegruendet
**Status:** Bestaetigt (11.03.2026) | **Relevanz:** MITTEL

Anthropic hat das "Anthropic Institute" als neue Forschungseinrichtung gegruendet, geleitet von Co-Founder **Jack Clark** (neuer Titel: Head of Public Benefit). Fokus:
- Gesellschaftliche Auswirkungen von AI
- Arbeitsmarkt-Transformation
- Sicherheitsforschung
- Interdisziplinaeres Team: ML-Engineers, Oekonomen, Sozialwissenschaftler

### 2.3 Enterprise-Marktdominanz: 73% Erstkaeufe
**Status:** Bestaetigt (Ramp-Daten, 18.03.2026) | **Relevanz:** HOCH

Laut Kundendaten von Ramp (Finanzplattform) gewinnt Anthropic **73% aller Erstkaeufe** bei Unternehmen, die zum ersten Mal AI-Tools kaufen. Das ist ein starkes Signal, dass Claude (inkl. Claude Code) im Enterprise-Segment die erste Wahl ist.

**Einschaetzung:** Diese Zahl ist ein Killer-Argument fuer den Kurs: "Lerne das Tool, das 73% der Unternehmen als Erstes waehlen."

---

## 3. Community Best Practices & Common Mistakes

### Neue Community-Ressourcen (seit letztem Report)

| Ressource | Typ | Highlights |
|-----------|-----|------------|
| **claude-code-ultimate-guide** (GitHub, FlorianBruniaux) | Umfassender Guide | Beginner bis Power-User, Quiz, Cheatsheet |
| **SFEIR Institute Advanced Best Practices** | Online-Kurs | Fokus auf fortgeschrittene Techniken |
| **DataCamp: Planning, Context, TDD** | Tutorial | Plan-First + TDD als Kern-Workflow |
| **f22labs: 10 Productivity Workflows** | Blog | Praxisorientierte Workflows |

### Community-Konsens Update: Plan-First Development

Der staerkste Community-Trend ist **Plan-First Development** als Standard-Workflow:

```bash
# Vier-Schritt-Prozess (Community Best Practice):

# 1. Plan anfordern — KEIN Code
"Analysiere die Anforderung und erstelle einen Plan.
 Schreibe KEINEN Code."

# 2. Plan reviewen und verfeinern
"Aendere Schritt 3: Statt eines Monolithen,
 nutze drei separate Funktionen."

# 3. Grünes Licht geben
"Plan sieht gut aus. Implementiere jetzt."

# 4. Review mit /plan oder Shift+Tab 2x
/plan  # Startet Plan Mode
# Oder: Shift+Tab, Shift+Tab (Toggle Plan Mode)
```

**Erklaerung (100 Worte):** Plan-First Development hat sich als #1 Best Practice in der Community etabliert. Der haeufigste Fehler bei AI-gestuetzter Entwicklung ist, das falsche Problem zu loesen oder das richtige Problem in falscher Reihenfolge. Indem man Claude zuerst einen Plan erstellen laesst — explizit ohne Code — erhaelt man eine reviewbare Strategie. Erst nach Genehmigung wird implementiert. Dieser vier-Schritt-Prozess (Plan → Review → Approve → Implement) reduziert Iterations-Schleifen um geschaetzt 40-60%. Fuer den Masterkurs ist das ein absolutes Pflicht-Modul: Es aendert fundamental, wie man mit Claude Code arbeitet.

### Haeufiger Fehler: Vollstaendige Fehlermeldungen

```bash
# FALSCH ❌
"Der Login funktioniert nicht"

# RICHTIG ✅
"Hier ist der komplette Error:
TypeError: Cannot read properties of undefined (reading 'token')
    at AuthService.validateSession (src/auth/service.ts:47:23)
    at async LoginHandler.handle (src/handlers/login.ts:12:5)

Reproduzier-Schritte:
1. User klickt Login
2. Email/Passwort eingeben
3. Submit → Fehler"
```

**Community-Erkenntnis:** Vollstaendige Stack-Traces verbessern die diagnostische Genauigkeit um ~75%. Ein Summary reicht nicht.

---

## 4. Wettbewerber-Updates

### 4.1 GitHub Copilot

| Update | Datum | Details |
|--------|-------|---------|
| **GPT-5.3-Codex LTS** | 18.03. | Neues Basis-Modell, ersetzt GPT-4.1, hohe "Code Survival Rate" bei Enterprise-Kunden |
| **Student Plan eingeschraenkt** | 13.03. | Kein GPT-5.4, kein Claude Opus/Sonnet — nur Auto-Mode |
| **JetBrains Agentic GA** | 11.03. | Custom Agents, Sub-Agents, Plan Agent jetzt GA; Agent Hooks in Preview |
| **CLI Usage Metrics** | 17.03. | Org-Level CLI-Aktivitaets-Reports verfuegbar |
| **Copilot CLI 1.0 GA** | Maerz | Major Version, Stabilitaets-Fokus |

**Einschaetzung:** Copilot setzt aggressiv auf GPT-5.3-Codex als Differenzierungsmerkmal. Die Student-Plan-Einschraenkungen zeigen Kostendruck. JetBrains-Support ist jetzt vollstaendig agentic — ein ernstzunehmender Schritt. Interessant: Copilot bietet jetzt auch Claude-Modelle an (via Auto-Mode), was Anthropic indirekt hilft.

### 4.2 Cursor

| Update | Datum | Details |
|--------|-------|---------|
| **Automations** | 05.03. | Always-on Agents mit Triggern: Slack, Linear, GitHub, PagerDuty, Webhooks |
| **JetBrains via ACP** | 04.03. | IntelliJ, PyCharm, WebStorm ueber Agent Client Protocol |
| **v2.6 Release** | 03.03. | Interactive UIs in Agent-Chats (Charts, Diagramme, Whiteboards) |
| **30+ Plugins** | 11.03. | Atlassian, Datadog, GitLab, Glean, Hugging Face, monday.com, PlanetScale |

**Einschaetzung:** Cursor ist der aggressivste Wettbewerber mit der breitesten Feature-Pipeline. Die **Cloud Automations** sind ein direkter Angriff auf Claude Code's /loop-Feature, aber maechtiger (Event-Trigger, Cloud-Sandbox, Memory-Tool). Die **Interactive UIs** in Agent-Chats sind ein echtes Differenzierungsmerkmal — Claude Code hat nichts Vergleichbares im Terminal.

### 4.3 Windsurf (Cognition AI, ehemals Codeium)

| Update | Details |
|--------|---------|
| **Akquisition** | Gehoert jetzt Cognition AI (~$250M Deal, Dez 2025) |
| **Gemini 3 Pro** | Preview fuer zahlende Nutzer (Low + High) |
| **GPT-5.2** | 0x Credits fuer zahlende Nutzer (limitiert) |
| **Max Plan** | Neuer Power-User-Plan eingefuehrt |
| **Cascade** | Terminal-Snippets + Workflows als wiederverwendbare Markdown-Commands |

**Einschaetzung:** Windsurf positioniert sich als "Model-agnostisch" mit breiter Modell-Unterstuetzung. Die Uebernahme durch Cognition AI (Devin-Macher) deutet auf eine Fusion von IDE + autonomem Agent hin. Zu beobachten.

### 4.4 Marktueberblick (aktualisiert)

| Tool | Staerke | Aktueller Fokus |
|------|---------|-----------------|
| **Claude Code** | 46% Most Loved, autonome Agents | Terminal-native, Agent Teams, 1M Context |
| **Cursor** | IDE-Integration, Automations | Cloud-Agents, JetBrains, Plugin-Oekosystem |
| **Copilot** | Distribution, GPT-5.3-Codex | Enterprise LTS, JetBrains Agentic GA |
| **Windsurf** | Speed, Model-Agnostik | Cognition-Integration, Multi-Model |

---

## 5. Markt-Trends & Anthropic Agentic Coding Report

### Anthropic 2026 Agentic Coding Trends Report (8 Trends)

Anthropic hat einen umfassenden Trends-Report veroeffentlicht. Die 8 Kerntrends:

| # | Trend | Kerndaten |
|---|-------|-----------|
| 1 | **Engineering wird Agent-Supervision** | Rollen verschieben sich von Implementation zu Direction + Review |
| 2 | **Autonomie-Explosion** | 20 autonome Aktionen pro Session (2x mehr als vor 6 Monaten) |
| 3 | **Multi-Agent als Standard** | 1.445% Anstieg bei Multi-Agent-Anfragen (Gartner Q1/24 → Q2/25) |
| 4 | **Demokratisierung** | AI-Coding expandiert in Security, Ops, Design, Data — nicht nur Devs |
| 5 | **Reale Performance-Gains** | Rakuten: 79% schnellere Time-to-Market (24 Tage → 5 Tage) |
| 6 | **Legacy-Code-Support** | Agent-Support fuer COBOL, Fortran, Nischen-Sprachen |
| 7 | **Kosten-Effizienz** | Fokus auf besseres Context-Management, weniger Retries |
| 8 | **85% Adoption** | 85% aller Entwickler nutzen AI-Tools, 51% taeglich |

### Schluesselzahl: 12.5 Mio. Zeilen in 7 Stunden

Claude Code hat **Activation Vector Extraction in einer 12,5-Millionen-Zeilen-Codebase** in sieben Stunden mit 99,9% numerischer Genauigkeit implementiert. Das ist die staerkste Referenz-Story fuer den Kurs.

### Markt-Zahlen Update

| Metrik | Wert | Trend |
|--------|------|-------|
| AI Coding Market 2026 | $8.5 Mrd. | ↑ von $6.8 Mrd. (2025) |
| Prognose 2032 | $127 Mrd. | CAGR 48.1% |
| AI Agents Market 2030 | $52.62 Mrd. | CAGR 46.3% |
| Developer Adoption | 85%+ | 51% taeglich |
| AI-Anteil an Arbeit | ~60% | Bei erfahrenen Devs |
| Anthropic Enterprise-Erstkaeufe | 73% | Ramp-Daten |

---

## 6. Agent SDK & Multi-Agent Update

### Agent Teams (Experimentell)

```jsonc
// Agent Teams aktivieren in settings.json:
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "true"
  }
}

// Team-Lead koordiniert mehrere Claude-Sessions:
// - Weist Tasks zu
// - Synthetisiert Ergebnisse
// - Jedes Team-Mitglied hat eigenen Context + Tools
```

**Erklaerung (90 Worte):** Agent Teams sind das neueste experimentelle Feature in Claude Code. Ein Lead-Agent koordiniert mehrere Worker-Agents, die jeweils in eigenen Sessions mit eigenem Kontext arbeiten. Der Lead weist Aufgaben zu, sammelt Ergebnisse und synthetisiert das Gesamtergebnis. Das ist die natuerliche Evolution von Subagents: Statt eines Hauptthreads mit Helfer-Calls gibt es jetzt ein echtes Team. Noch experimentell (muss explizit aktiviert werden), aber bereits nutzbar. Fuer den Kurs: Ein perfektes "Advanced Module" — zeigt die Zukunft des AI-gestuetzten Developments.

### SDK-Versionen (aktuell)

| SDK | Version | Aenderungen |
|-----|---------|-------------|
| Python | v0.1.48 | Stabil, Production-Ready |
| TypeScript | v0.2.71 | Stabil, Production-Ready |

### Community Multi-Agent Projekte

- **ruflo** (GitHub) — Agent-Orchestration-Platform fuer Claude, Swarm Intelligence
- **claude-code-ultimate-guide** — Umfassender Guide inkl. Multi-Agent-Patterns
- **Shipyard Blog** — Production-Guide fuer Multi-Agent mit Claude Code

---

## 7. Content-Empfehlungen fuer den Kurs

> **Hinweis:** Die Content-Ideen-Datei (Obsidian) hatte keine neuen Prioritaeten gesetzt.
> Empfehlungen basieren auf Marktdaten, Community-Trends und Feature-Neuheiten.

### PRIORITAET HOCH (Diese Woche umsetzen)

| # | Thema | Format | Begruendung |
|---|-------|--------|-------------|
| 1 | **Plan-First Development Masterclass** | Video + Workshop | Community #1 Best Practice, reduziert Fehler um 40-60%, fundamentaler Workflow-Shift |
| 2 | **Anthropic Marktposition Briefing** | Short-Form Content / Newsletter | 73% Erstkaeufe, DOD-Ethik-Story, Institute — starke Narrative fuer Kurs-Marketing |
| 3 | **Token-Limits & Output-Maximierung** | Lektion-Update (bestehende 1M-Lektion) | 64k/128k Output-Limits aendern wie man mit langen Code-Bloecken arbeitet |
| 4 | **Agentic Coding Trends 2026** | Infografik + Zusammenfassung | Anthropic-Report hat 8 Trends, perfekt als "State of the Industry"-Modul |

### PRIORITAET MITTEL (Naechste 2 Wochen)

| # | Thema | Format | Begruendung |
|---|-------|--------|-------------|
| 5 | **Agent Teams Workshop** | Hands-On Lab | Experimentelles Feature, aber der Multi-Agent-Trend ist unaufhaltsam (1.445% Gartner) |
| 6 | **Wettbewerber Deep Dive: Cursor Automations** | Vergleichs-Analyse | Cursor's Cloud Automations vs Claude Code's /loop — was kann was? |
| 7 | **Session-Organisation** | Quick-Tip-Video | /color + /name + /resume — produktiver mit mehreren Sessions |
| 8 | **Custom Model Picker** | Enterprise-Modul | ANTHROPIC_CUSTOM_MODEL_OPTION fuer Teams mit eigenen Modellen |

### PRIORITAET NIEDRIG (Backlog)

| # | Thema | Format | Begruendung |
|---|-------|--------|-------------|
| 9 | **Anthropic Institute & AI Ethics** | Bonus-Content | Kontext-Modul fuer Kursteilnehmer die "Warum Anthropic?" verstehen wollen |
| 10 | **Legacy Code mit Claude Code** | Case Study | COBOL/Fortran-Support als Trend — Nische aber wachsend |
| 11 | **Community-Ressourcen-Guide** | Curated List | claude-code-ultimate-guide, SFEIR, DataCamp — beste externe Ressourcen |

---

## 8. Quellen-Verzeichnis

### Offizielle Anthropic-Quellen
- [Claude Code Changelog — Releasebot](https://releasebot.io/updates/anthropic/claude-code)
- [Claude Code CHANGELOG.md — GitHub](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Claude Code Releases — GitHub](https://github.com/anthropics/claude-code/releases)
- [Claude Code Changelog — Offizielle Docs](https://code.claude.com/docs/en/changelog)
- [ClaudeLog Changelog](https://claudelog.com/claude-code-changelog/)
- [Anthropic News](https://www.anthropic.com/news)
- [Claude Code Common Workflows — Docs](https://code.claude.com/docs/en/common-workflows)
- [Agent Teams — Claude Code Docs](https://code.claude.com/docs/en/agent-teams)
- [2026 Agentic Coding Trends Report — Anthropic](https://resources.anthropic.com/2026-agentic-coding-trends-report)

### Anthropic Unternehmensnews
- [DOD Labels Anthropic "Unacceptable Risk" — TechCrunch (18.03.)](https://techcrunch.com/2026/03/18/dod-says-anthropics-red-lines-make-it-an-unacceptable-risk-to-national-security/)
- [Tech Industry Rallies Behind Anthropic — Axios (16.03.)](https://www.axios.com/2026/03/16/tech-industry-rallies-anthropic-pentagon-fight)
- [Trump Officials vs Anthropic — Bloomberg (18.03.)](https://www.bloomberg.com/news/articles/2026-03-18/trump-administration-vows-legal-fight-on-anthropic-ai-tool-ban)
- [Anthropic Enterprise Revenue Dominance — Axios (18.03.)](https://www.axios.com/2026/03/18/ai-enterprise-revenue-anthropic-openai)
- [Anthropic Institute Launch — eWeek](https://www.eweek.com/news/anthropic-institute-launch-march-2026/)
- [Pentagon CTO on Anthropic — Breaking Defense (03/2026)](https://breakingdefense.com/2026/03/pentagon-cto-pretty-confident-about-life-after-anthropic/)

### Wettbewerber
- [Cursor Automations — TechCrunch (05.03.)](https://techcrunch.com/2026/03/05/cursor-is-rolling-out-a-new-system-for-agentic-coding/)
- [Cursor March 2026 Updates — Agency Journal](https://theagencyjournal.com/cursors-march-2026-updates-jetbrains-integration-and-smarter-agents/)
- [Cursor Changelog](https://cursor.com/changelog)
- [GPT-5.3-Codex LTS in Copilot — GitHub Blog (18.03.)](https://github.blog/changelog/2026-03-18-gpt-5-3-codex-long-term-support-in-github-copilot/)
- [Copilot Student Plan Changes — GitHub Blog (13.03.)](https://github.blog/changelog/2026-03-13-updates-to-github-copilot-for-students/)
- [Copilot JetBrains Agentic GA — GitHub Blog (11.03.)](https://github.blog/changelog/2026-03-11-major-agentic-capabilities-improvements-in-github-copilot-for-jetbrains-ides/)
- [Windsurf Changelog](https://windsurf.com/changelog)
- [Windsurf Review 2026 — Vibecoding](https://vibecoding.app/blog/windsurf-review)

### Markt-Trends & Analysen
- [5 Key Trends Agentic Development — The New Stack](https://thenewstack.io/5-key-trends-shaping-agentic-development-in-2026/)
- [Anthropic 8 Agentic Trends — tessl.io](https://tessl.io/blog/8-trends-shaping-software-engineering-in-2026-according-to-anthropics-agentic-coding-report/)
- [8 Trends Reshaping Software Dev — adwaitx](https://www.adwaitx.com/anthropic-2026-agentic-coding-trends-ai-agents/)
- [7 Agentic AI Trends 2026 — MachineLearningMastery](https://machinelearningmastery.com/7-agentic-ai-trends-to-watch-in-2026/)
- [Best AI Coding Agents 2026 — Faros AI](https://www.faros.ai/blog/best-ai-coding-agents-2026)
- [Agentic Coding Reshaping Dev — Sola Fide](https://solafide.ca/blog/anthropic-2026-agentic-coding-trends-reshaping-software-development)

### Community & Best Practices
- [Claude Code Ultimate Guide — GitHub (FlorianBruniaux)](https://github.com/FlorianBruniaux/claude-code-ultimate-guide)
- [SFEIR Institute Advanced Best Practices](https://institute.sfeir.com/en/claude-code/claude-code-advanced-best-practices/tips/)
- [DataCamp: Planning, Context, TDD](https://www.datacamp.com/tutorial/claude-code-best-practices)
- [10 Productivity Workflows — f22labs](https://www.f22labs.com/blogs/10-claude-code-productivity-tips-for-every-developer/)
- [50 Tips & Tricks — Geeky Gadgets](https://www.geeky-gadgets.com/claude-code-tips-2/)
- [Claude Code March Updates — Pasquale Pillitteri](https://pasqualepillitteri.it/en/news/381/claude-code-march-2026-updates)

### Multi-Agent & SDK
- [Multi-Agent Orchestration — Shipyard](https://shipyard.build/blog/claude-code-multi-agent/)
- [Claude Code Hidden Swarm — paddo.dev](https://paddo.dev/blog/claude-code-hidden-swarm/)
- [Swarm Orchestration Skill — GitHub Gist](https://gist.github.com/kieranklaassen/4f2aba89594a4aea4ad64d753984b2ea)
- [Agent Teams Guide — Claudio Novaglio](https://www.claudio-novaglio.com/en/papers/agent-teams-claude-code-multi-agent-orchestration)
- [Claude Agent SDK Tutorial — LetsDatasience](https://letsdatascience.com/blog/claude-agent-sdk-tutorial)
- [ruflo: Agent Orchestration — GitHub](https://github.com/ruvnet/ruflo)

---

*Report generiert am 2026-03-19 durch den Masterkurs Weekly Agent v2.2*
*8 WebSearch-Anfragen, Delta-Report zum 2026-03-16*
*Naechster Report: 2026-03-26*
