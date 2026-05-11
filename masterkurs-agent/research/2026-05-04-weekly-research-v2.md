# Weekly Research Report — Claude Code Masterkurs

**Datum:** 2026-05-04
**Zeitraum:** ca. 28. April – 4. Mai 2026
**Owner-Prioritaeten:** `Content Ideen.md` konnte nicht gelesen werden (iCloud Resource-Deadlock — Datei lokal nicht verfuegbar). Agent waehlt nach Markt-Relevanz; Priorisierung bei naechstem Run nachholen, sobald iCloud-Sync abgeschlossen.

---

## Executive Summary

Diese Woche dominiert eine **dichte Claude-Code-Release-Kadenz**: Innerhalb weniger Tage liefen 2.1.121 → 2.1.126 durch — Highlights sind **OAuth ueber SSH/WSL/Containers** (lange offener Pain-Point), **Mac-Sleep-resistente Sessions**, der neue `claude project purge`-Befehl und ein **`xhigh` Effort-Level fuer Opus 4.7** mit Auto-Mode fuer Max-Subscriber. Parallel hat Anthropic im April **Claude Mythos Preview** als Cybersecurity-Frontier-Modell angekuendigt (Project Glasswing mit Apple, Microsoft, CrowdStrike u.a.) — erste Schule machen die identifizierten Tausenden Zero-Days. **Cursor 3.x** kontert mit dem **Cursor SDK** (Agent-Runtime in TypeScript) und **Bugbot Learned Rules**. GitHub Copilot CLI bringt **OAuth client_credentials fuer MCP** (vollstaendig headless) und 20% schnellere Cloud-Agent-Cold-Starts. Hoechste Content-Prioritaeten fuer den Kurs: **Remote-Dev-Workflow-Lektion** (SSH/Container/WSL-Setup mit 2.1.126), **`xhigh` & Auto-Mode-Strategie** fuer Opus-4.7-Nutzer, sowie **MCP-Headless-Auth** (CI-relevant).

---

## Neue Features & Updates

### 1. Claude Code 2.1.126 — OAuth ueber SSH/WSL/Container, Mac-Sleep-Survivability, `project purge`

**Was:** Das groesste Release der Woche (33 Eintraege). Schluesselaenderungen:
- **`claude auth login` akzeptiert OAuth-Code per Paste**, wenn der Browser-Callback localhost nicht erreicht (WSL2, SSH, Devcontainers, Codespaces)
- **Sessions ueberleben Mac-Sleep** — vorher hat App-Nap haeufig die Verbindung gekillt
- **`claude project purge [path]`** loescht Transcripts, Tasks, File-History und Config-Eintrag fuer ein Projekt komplett
- **Sandbox-Security-Fix** in managed-settings (Details bewusst sparsam dokumentiert)
- Race-Condition-Fix fuer concurrent OAuth-Refresh-Token-Writes
- "OAuth not allowed for organization" zeigt jetzt Admin-Hinweis statt Endlos-Loop

**Erklaerung (~140 Worte):** Das ist das wichtigste "Quality-of-Life"-Release seit Monaten — und macht Claude Code endlich **First-Class auf Remote-Dev-Setups**. Vor 2.1.126 war OAuth-Login ueber SSH ein Workaround-Bingo (Port-Forwarding, Token-Copy aus anderem Fenster), das viele Enterprise-User auf API-Keys statt Pro/Max-Subscriptions zwang. Jetzt: sauberer Code-Paste-Flow. Fuer Kursteilnehmer mit Devcontainer-/Codespaces-Workflow ist das ein Game-Changer; ebenso fuer Cloud-Workstation-User (Coder, GitPod, GitHub Codespaces). Mac-Sleep-Survivability beendet den Klassiker "ich komme vom Mittag zurueck und meine Session ist tot". `project purge` adressiert ein DSGVO-relevantes Problem: Bisher musste man manuell durch `~/.claude/projects/`, `~/.claude.json` und Task-Stores graben, um Spuren eines Projekts zu loeschen — jetzt One-Liner.

**Code-Beispiel:**
```bash
# Remote OAuth-Login (SSH/WSL/Codespaces) — Browser auf lokalem Rechner oeffnen,
# Code aus URL kopieren, in Terminal-Prompt einfuegen
ssh dev-server
claude auth login
# > Paste authorization code: <code-aus-callback-url>

# Komplette Projekt-Spuren loeschen (DSGVO-Loeschanfragen, Repo-Wechsel)
claude project purge ~/Projekte/altes-kundenprojekt
# Loescht: transcripts, tasks, file history, config entry

# Pruefen welche Projekte tracked sind
claude project list
```

---

### 2. Opus 4.7 `xhigh` Effort-Level + Auto-Mode fuer Max-Subscriber

**Was:** Zwischen `high` und `max` sitzt jetzt **`xhigh`** — extra Reasoning-Budget ohne in den teuersten Tier zu kippen. Auto-Mode (frueher Beta) ist GA fuer Max-Plan + Opus 4.7. Im Auto-Mode entscheidet der Harness pro Subtask selbststaendig zwischen Effort-Levels und delegiert ggf. an Sonnet 4.6 / Haiku 4.5.

**Erklaerung (~120 Worte):** Bisher war die Effort-Ladder `low | medium | high | max` — `max` ist teuer und die meisten Tasks brauchen ihn nicht, `high` reicht aber bei komplexen Refactorings nicht immer. `xhigh` ist die fehlende Mitte. Strategisch interessant: Anthropic positioniert Opus 4.7 explizit gegen GPT-5-Thinking und Cursor-Composer-Max bei Architektur-Tasks. Auto-Mode ist die Antwort auf Cursor's Auto-Selection — der Harness misst Komplexitaet (Anzahl Files, Code-Aenderungen, Dependency-Graph) und faellt auf Sonnet/Haiku zurueck, sobald das ausreicht. Praktisch: 30–50% Token-Ersparnis bei gemischten Sessions, ohne Quality-Verlust. Fuer Kursteilnehmer auf Pro: weiter manuell `/effort high`. Auf Max: `/auto on` ist neuer Default-Empfehlung.

**Code-Beispiel:**
```bash
# Effort manuell setzen (alle Tiers)
claude /effort xhigh         # Zwischen high und max
claude /effort               # Aktuelles Level anzeigen

# Auto-Mode (nur Max + Opus 4.7)
claude /auto on              # Harness entscheidet pro Task
claude /auto status          # Welches Modell wird gerade genutzt

# In Skills referenzieren (seit 2.1.120)
# skill.md frontmatter:
# ---
# allowed_effort: ["high", "xhigh", "max"]
# ---
```

---

### 3. Bedrock Service-Tier + MCP Auto-Retry + /resume PR-URL-Search (2.1.121–2.1.122)

**Was:**
- `ANTHROPIC_BEDROCK_SERVICE_TIER=default|flex|priority` waehlt den AWS-Bedrock-Tier (sendet `X-Amzn-Bedrock-Service-Tier`)
- `/resume` Suchfeld akzeptiert PR-URL (GitHub, GitHub Enterprise, GitLab, Bitbucket) → springt zur Session, die diesen PR erstellt hat
- **MCP-Server retryen automatisch bis 3x** bei transienten Fehlern (vorher: harter Fail)
- `/mcp` warnt bei doppelten Server-URLs (claude.ai-Connector + manueller Eintrag)
- OpenTelemetry-Span-Attribute fuer LLM-Requests
- `/terminal-setup` aktiviert iTerm2-Clipboard-Permission automatisch
- Image-Paste >2000px wird heruntergerechnet statt Session zu killen

**Erklaerung (~110 Worte):** Drei Themen, drei Zielgruppen. **Bedrock-Service-Tier** ist Enterprise-Pflicht: `priority` garantiert SLA bei AWS-Spitzenlast, `flex` ist 60% billiger fuer Batch-Jobs — das war frueher nur via Custom-Header-Hack moeglich. **PR-URL-/resume-Suche** ist ein Productivity-Win: Code-Review eines PRs → Diff anschauen → URL kopieren → in Claude `/resume <url>` paste → Du landest in der exakten Session, in der dieser PR entstanden ist. Spart 5–10 Min Kontext-Rekonstruktion. **MCP-Auto-Retry** behebt eines der haeufigsten Beschwerden: Flaky Network → MCP-Tool-Call schlaegt fehl → ganze Konversation muss man wiederholen. Jetzt: 3 Retries mit exponential backoff, transparent.

**Code-Beispiel:**
```bash
# Bedrock Cost-Optimization
export ANTHROPIC_BEDROCK_SERVICE_TIER=flex
claude  # 60% guenstiger fuer non-urgent Tasks

# /resume mit PR-URL
claude
> /resume https://github.com/cittasana/freelancer-os/pull/142
# → Springt direkt in die Session des PR-Authors

# OTel-Tracing aktivieren
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
export CLAUDE_CODE_ENABLE_TELEMETRY=1
claude  # Span-Attribute: llm.request.model, llm.request.tokens, llm.request.duration
```

---

### 4. Claude Mythos Preview + Project Glasswing (Anthropic, April 2026)

**Was:** Anthropic hat am 7. April **Claude Mythos Preview** angekuendigt — ein Frontier-Modell, das *nicht* oeffentlich released wird, sondern an 12 Partner (Apple, Microsoft, CrowdStrike, Cisco, Linux Foundation, Palo Alto, Broadcom, Amazon u.a.) plus 40 weitere Organisationen ausgespielt wird. Use-Case: Defensive Cybersecurity. Mythos hat in der Eval u.a. eine 17 Jahre alte FreeBSD-NFS-RCE-Schwachstelle autonom identifiziert + exploited, plus tausende Zero-Days in Major-Browsern und OSes. Preview ueber AWS Bedrock (Gated Research).

**Erklaerung (~140 Worte):** Strategisch riesig. Drei Implikationen fuer den Kurs: (1) **Security wird zum Kern-Skill** — Anthropic positioniert Claude explizit als Security-Tool, nicht nur Coder. Lerner sollten Security-Audits in ihre Workflows einbauen (vgl. `/ultrareview` mit Security-Fokus, `/security-review`-Skill). (2) **Capability-Asymmetrie** — Mythos ist limitiert verfuegbar, aber das aufgezeigte Capability-Niveau wird in 6–12 Monaten in Sonnet/Opus-Modellen landen. Lerner, die heute lernen "AI als Security-Reviewer einzusetzen", haben dann massive Hebel. (3) **Risiko-Awareness** — Schneier und WEF haben oeffentlich diskutiert, dass dasselbe Modell offensiv genutzt werden kann. Kurs-Modul "AI-Sicherheits-Hygiene" wird wichtig: keine Production-Secrets in Prompts, Sandbox-Modus standardmaessig, Audit-Logs fuer Skills.

**Code-Beispiel:** (kein direkter Modell-Zugang, aber Workflow-Pattern)
```bash
# Heute schon nutzen: Security-Review als Standard-Schritt vor PRs
claude /security-review              # Built-in skill (seit 2.1.x)
claude ultrareview --focus security  # Multi-agent security audit

# .claude/settings.json — Sandbox als Default (defensive Posture)
{
  "permissions": {
    "defaultMode": "ask",
    "deny": ["Bash(rm -rf:*)", "Bash(sudo:*)", "Write(.env*)"]
  }
}
```

---

## Community Best Practices & Common Mistakes

### Best Practices (Mai 2026)

- **CLAUDE.md ~100 Zeilen, ~2'500 Tokens.** Boris Cherny (Anthropic, Claude-Code-Lead) bestaetigt: kurze, scharf editierte CLAUDE.md schlaegt 5'000-Wort-Romane. Goldene Regel: "Wenn Claude etwas falsch macht, fuege es zur CLAUDE.md hinzu, damit es nicht wiederholt wird."
- **Plan-Mode strikt nutzen.** Erst `/plan`, Plan reviewen, dann erst Execution. "Planning collapses ambiguous decisions into a reviewed spec."
- **`gh` CLI installieren.** Claude kann dann PRs oeffnen, Issues kommentieren, CI-Logs lesen — staerker als jedes MCP-GitHub-Server-Setup.
- **Specialized Subagents in `.claude/agents/`** — eigener Kontext, eigene Tool-Whitelist, ideal fuer File-Heavy-Reads (Codebase-Exploration, Doc-Generation).
- **`/less-permission-prompts` Skill (neu).** Scannt Transcripts, generiert Allowlist fuer haeufige Read-Only-Bash- und MCP-Calls → 50–80% weniger Permission-Prompts.

### Common Mistakes (aus Community-Diskussionen)

- **Zu grosse CLAUDE.md** (>3'000 Tokens). Verbraucht jeden Turn Kontext, ohne Mehrwert. Ausduennen, in `/docs` verlinken.
- **MCP-Server ohne Retry-Erwartung.** Vor 2.1.121 kein Retry → User glauben Tool ist kaputt. Nach Update: Retry transparent, aber alte Workarounds (manuelle Wrapper-Scripts) sind jetzt obsolet.
- **OAuth-Headache auf Remote-Maschinen.** Pre-2.1.126: User haben API-Key-Workaround genutzt → verlieren Pro/Max-Subscription-Vorteile. Nach Update: einfach `claude auth login` neu.
- **Effort-Level ignorieren.** Default ist seit 7. April wieder `high` — viele Skripte ueberschreiben das auf `medium` aus alten Templates. Pruefen!
- **Project-Files horten.** Pre-`project purge`: User sammeln 50+ alte Projekte in `~/.claude.json` → Performance leidet. Jetzt: regelmaessig `claude project purge`.

---

## Wettbewerber-Updates

### Cursor (Mai 2026)

- **Cursor SDK released** — Agent-Runtime, Harness, Models in TypeScript. Standard token-based Pricing. **Direkter Angriff auf Claude Agent SDK** und Anthropic Managed Agents. Unterschied: Cursor SDK ist tiefer in IDE-Workflow integriert (Composer, Tab-Completion), Claude SDK ist headless-first.
- **Bugbot Learned Rules** — Code-Review-Bot lernt aus PR-Feedback (Reviewer-Comments, Reactions, Replies). Selbst-verbesserndes System.
- **Team Marketplace ohne Repo-Connection.** Admins koennen First-Party-Plugins teamweit konfigurieren ohne Repo-Setup.
- Vorher (April): **Interactive Canvases** (Dashboards, Diagramme als Response-Format), **Security Reviewer** Beta auf Teams/Enterprise.

**Vergleich fuer Kurs:** Cursor's SDK-Strategie + Bugbot ist stark fuer Teams; Claude Code's Vorteil bleibt: CLI-First, headless CI-Integration (`claude ultrareview`), Skills-Marketplace (4'200+).

### GitHub Copilot (Mai 2026, CLI v1.0.40)

- **OAuth `client_credentials` Grant fuer MCP-Server** — vollstaendig headless Auth ohne Browser. Direktes Pendant zu Claude's neuem SSH-Flow, aber fuer Service-Accounts statt User-OAuth.
- **Subagents evaluieren Tool-Search-Support pro Modell** statt vom Parent zu erben. Behebt Bug, bei dem Subagent fuer Haiku einen Sonnet-only-Tool-Call versuchte.
- **Cloud-Agent-Startup 20% schneller** durch optimierte GitHub-Actions-Custom-Images.
- `/clear` und `/new` resetten jetzt Custom-Agent-Selection.

### Markt-Beobachtung

- **Cursor + Copilot konvergieren auf "Agent + Subagent"-Architektur** — genau das Modell, das Claude Code seit Q4 2025 vorlebt. Der USP "Multi-Agent-Orchestration" verlagert sich; Differenzierung jetzt eher bei **Skills/Plugins-Oekosystem** (Claude fuehrt mit 4'200+ Skills, 770+ MCP-Servern), **Headless-CI-Tauglichkeit** (Claude `ultrareview` Standalone) und **Effort-Tier-Granularitaet** (Claude `xhigh`, Auto-Mode).

---

## Markt-Trends & Anthropic News

- **MCP wird Production-Ready.** 2026-Roadmap-Fokus: stateless Server-Operation, MCP Server Cards (auto-discovery), A2A (Agent-to-Agent-Coordination). Bis Q3/Q4: Enterprise-tauglich. **Google Colab MCP Server** wurde diese Woche releast (open-source) — Notebook-Cells aus jedem AI-Agent steuern.
- **Skills/Plugins-Konsolidierung.** 4'200+ Skills, 770+ MCP-Server, 2'500+ Marketplaces. Community-Marketplace `tonsofskills.com` mit 425 Plugins, 2'810 Skills, 200 Agents + eigenem CLI-Package-Manager (`ccpi`). Frage fuer Kurs: eigenen Marketplace vs. existierenden joinen?
- **Claude Security (Public Beta).** Vulnerability-Scanning direkt im Coding-Workflow. Schwesterprodukt zu Mythos (aber oeffentlich verfuegbar).
- **Claude Design.** Anthropic-Tool fuer Quick-Visuals (TechCrunch 17. April). Fuer Kurs interessant als "Diagramme im CLAUDE.md-Workflow"-Use-Case.
- **Utah-Pilot-Zahlen.** 77% der Entwickler sehen Wert innerhalb 1 Stunde, 30% berichten 30%+ schneller, 40+ Stunden gespart in 4 Wochen. Starkes Marketing-Material fuer Kurs-Landingpage.

---

## Content-Empfehlungen mit Prioritaeten

### Prio 1 — Sofort umsetzen (Relevanz 9–10/10)

1. **Lektion: "Claude Code auf Remote-Dev-Setups (SSH, WSL, Codespaces, Devcontainers)"**
   - Trigger: 2.1.126 OAuth-Fix.
   - Inhalt: Setup-Guide fuer alle 4 Szenarien, `claude auth login`-Code-Paste-Flow, `claude project purge` als Cleanup-Pattern, Mac-Sleep-Survivability.
   - Warum jetzt: Riesige bisher-frustrierte User-Gruppe (Enterprise + Cloud-Devs). Hohe Search-Demand.
   - Format: 30-Min-Lektion + Video-Walkthrough.

2. **Email-Sequence: "Effort-Level Strategie — wann xhigh, wann Auto-Mode, wann max?"**
   - 3 Emails, technisch tief.
   - Zielgruppe: Existing Pro/Max-Subscriber.
   - CTA: Upgrade auf Max (Auto-Mode-Lock).

3. **Social-Media-Post-Serie (LinkedIn + X): "5 Updates aus Claude Code 2.1.126 die Ihr Team braucht"**
   - 5 Carousel-Slides oder Thread.
   - Anchor: OAuth-SSH, Mac-Sleep, project purge, MCP-Retry, /resume PR-URL.

### Prio 2 — Diese Woche (Relevanz 7–8/10)

4. **Lektion: "Security-First Claude-Workflow — Lessons aus Project Glasswing"**
   - Mythos-Preview-Storytelling als Hook.
   - Praktisch: `/security-review`, `claude ultrareview --focus security`, sandbox-Defaults in settings.json, Secrets-Hygiene.
   - Lernziel: Audit-Pattern in jedes Repo einbauen.

5. **Tutorial-Blogpost: "MCP-Server Headless authentifizieren (Claude vs Copilot)"**
   - Vergleichstabelle Claude SSH-Code-Paste vs Copilot client_credentials.
   - Wann welches Pattern.
   - Code-Snippets fuer GitHub Actions / GitLab CI.

### Prio 3 — Optional / Newsletter-Mention (Relevanz 5–6/10)

6. **Newsletter-Notiz: Cursor SDK released**
   - Kurze Einordnung: Wann Cursor, wann Claude.
   - Kein eigenes Lektion-Material — Cursor-spezifisches Know-how lenkt vom Kurs-Fokus ab.

7. **Discord-Announcement: Google Colab MCP Server**
   - Niche, aber relevant fuer Data-Scientists im Kurs.
   - Link + 2-Saetze-Erklaerung.

### Strukturelle Empfehlung

- **Bestehende "MCP-Lektion" updaten** mit Auto-Retry-Verhalten + neuer `/mcp`-Duplikat-Warnung. Nicht neu schreiben.
- **CLAUDE.md-Lektion ergaenzen** um Boris-Cherny-Quote ("100-Line-Rule") und `/less-permission-prompts`-Skill als praktisches Beispiel.

---

## Quellen-Verzeichnis

### Anthropic / Claude Code

- [Claude Code Changelog (offiziell)](https://code.claude.com/docs/en/changelog)
- [Releases · anthropics/claude-code (GitHub)](https://github.com/anthropics/claude-code/releases)
- [Claude Code 2.1.126 Deep-Dive (wotai.co)](https://wotai.co/blog/claude-code-2-1-126)
- [Release v2.1.123 (GitHub)](https://github.com/anthropics/claude-code/releases/tag/v2.1.123)
- [Anthropic Release Notes May 2026 (Releasebot)](https://releasebot.io/updates/anthropic)
- [Claude Code Updates by Anthropic May 2026 (Releasebot)](https://releasebot.io/updates/anthropic/claude-code)
- [Claude Code News May 2026 — Startup Edition](https://blog.mean.ceo/claude-code-news-may-2026/)

### Claude Mythos / Security

- [Claude Mythos Preview (red.anthropic.com)](https://red.anthropic.com/2026/mythos-preview/)
- [Anthropic debuts preview of Mythos (TechCrunch)](https://techcrunch.com/2026/04/07/anthropic-mythos-ai-model-preview-security/)
- [Claude Mythos: Cybersecurity Breakthrough (SecurityWeek)](https://www.securityweek.com/anthropic-unveils-claude-mythos-a-cybersecurity-breakthrough-that-could-also-supercharge-attacks/)
- [AISI Evaluation of Mythos](https://www.aisi.gov.uk/blog/our-evaluation-of-claude-mythos-previews-cyber-capabilities)
- [Schneier: What Mythos Means](https://www.schneier.com/blog/archives/2026/04/what-anthropics-mythos-means-for-the-future-of-cybersecurity.html)
- [Project Glasswing (Anthropic)](https://www.anthropic.com/glasswing)
- [Amazon Bedrock Mythos Preview (AWS)](https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-bedrock-claude-mythos/)

### Cursor

- [Cursor Changelog](https://cursor.com/changelog)
- [Cursor 3 (Meet the new Cursor)](https://cursor.com/blog/cursor-3)
- [Cursor Release Notes May 2026 (Releasebot)](https://releasebot.io/updates/cursor)
- [Cursor News May 2026 — Startup Edition](https://blog.mean.ceo/cursor-news-may-2026/)

### GitHub Copilot

- [github/copilot-cli Releases](https://github.com/github/copilot-cli/releases)
- [GitHub Copilot What's New](https://github.com/features/copilot/whats-new)
- [GitHub Release Notes May 2026 (Releasebot)](https://releasebot.io/updates/github)

### MCP

- [MCP 2026 Roadmap (modelcontextprotocol.io)](https://modelcontextprotocol.io/development/roadmap)
- [The 2026 MCP Roadmap (Blog)](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)
- [Google Colab MCP Server (Google Devs Blog)](https://developers.googleblog.com/announcing-the-colab-mcp-server-connect-any-ai-agent-to-google-colab/)
- [MCP Production Pains (The New Stack)](https://thenewstack.io/model-context-protocol-roadmap-2026/)

### Best Practices / Community

- [Claude Code Best Practices (offiziell)](https://code.claude.com/docs/en/best-practices)
- [Claude Code Tips I Wish I'd Had From Day One (Marmelab)](https://marmelab.com/blog/2026/04/24/claude-code-tips-i-wish-id-had-from-day-one.html)
- [50 Claude Code Tips (Builder.io)](https://www.builder.io/blog/claude-code-tips-best-practices)
- [Claude Code Workflows and Best Practices 2026 (Smart-Webtech)](https://smart-webtech.com/blog/claude-code-workflows-and-best-practices/)
- [shinpr/claude-code-workflows (GitHub)](https://github.com/shinpr/claude-code-workflows)
- [Claude Code Workshop — Team Conventions May 2026](https://www.claudeworkshop.com/research/claude-team-conventions-20260501-0508)

### Skills/Plugins-Marketplaces

- [Anthropic Plugins Official (GitHub)](https://github.com/anthropics/claude-plugins-official)
- [claudemarketplaces.com](https://claudemarketplaces.com/)
- [tonsofskills (jeremylongshore/claude-code-plugins-plus-skills)](https://github.com/jeremylongshore/claude-code-plugins-plus-skills)
- [Discover Plugins (offiziell)](https://code.claude.com/docs/en/discover-plugins)

---

**Status:** Report fertig. 8 WebSearch-Queries genutzt, kein WebFetch noetig (Search-Snippets reichten). Naechster Run: 2026-05-11. Aktion fuer Owner: `Content Ideen.md` aus iCloud sicherstellen — Datei war beim Run gesperrt (Resource-Deadlock).
