# Weekly Research Report — Claude Code Masterkurs

**Datum:** 2026-05-07
**Zeitraum:** ca. 4. — 7. Mai 2026 (Inkrement seit letztem Report 2026-05-04)
**Owner-Prioritaeten:** `Content Ideen.md` konnte erneut nicht gelesen werden (iCloud Resource-Deadlock — Datei lokal nicht synchronisiert). Priorisierung am naechsten Run nachholen, sobald iCloud-Sync abgeschlossen ist. Agent waehlt nach Markt-Relevanz und Anschluss an Vorwoche.

---

## Executive Summary

Inkrementell zur Vorwoche: Claude Code hat **2.1.127 → 2.1.128 → 2.1.129** geliefert mit zwei strategisch wichtigen Aenderungen: (a) **`--plugin-url`** holt Plugin-ZIP-Archive direkt aus einer URL fuer eine Session — ein neuer Distributionskanal fuer Skills/Plugins ohne npm/Marketplace-Zwischenschritt; (b) **`CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE`** macht Claude Code auf Homebrew/WinGet selbst-updatend. Parallel oeffnet GitHub den **Enterprise-Managed-Plugins-Public-Preview** fuer Copilot CLI (5. Mai), Cursor verfestigt das **Cursor SDK** mit Streaming/Reconnect, und Anthropic positioniert den `skillOverrides`-Setting als zentralen Hebel gegen Skill-Bloat. Hoechste Content-Prioritaeten fuer den Kurs diese Woche: **Skill-Distribution via `--plugin-url`** (10-Minuten-Quickwin-Video), **Auto-Update-Setup fuer Macs/Windows-Teilnehmer** und **Compaction-Hygiene** (60%-Regel + explizite Debug-Notes vor `/compact`).

---

## Neue Features & Updates

### 1. Claude Code 2.1.129 — `--plugin-url`, Auto-Update, `skillOverrides` aktiv

**Was:**
- `--plugin-url <url>` laedt ein Plugin-`.zip` direkt aus einer URL nur fuer die aktuelle Session
- `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE` triggert Background-Upgrade auf Homebrew/WinGet mit Restart-Prompt
- `CLAUDE_CODE_FORCE_SYNC_OUTPUT=1` zwingt synchronisierten Output (Emacs `eat`, exotische Terminals)
- `skillOverrides`-Setting funktioniert jetzt korrekt: `off` versteckt vom Modell **und** `/`, `user-invocable-only` versteckt nur vom Modell, `name-only` kollabiert die Description
- Gateway-`/v1/models`-Discovery jetzt opt-in via `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1` (war 2.1.126–2.1.128 automatisch)
- Ctrl+R Search-History sucht wieder projektuebergreifend (Pre-2.1.124-Verhalten); Ctrl+S engt auf aktuelle Session ein
- Plugin-Manifests: `themes` und `monitors` gehoeren jetzt unter `"experimental": { ... }`
- `/context` haengt nicht mehr ~1.6k Tokens ASCII-Visualisierung in die Conversation
- 1h-Prompt-Cache-TTL wird nicht mehr stillschweigend auf 5 Min downgegradet

**Erklaerung (~140 Worte):** `--plugin-url` ist die **wichtigste strategische Aenderung der Woche** — denn es macht aus Claude Code ein **echtes Plugin-Distributionssystem ausserhalb von npm und dem offiziellen Marketplace**. Du kannst jetzt einen GitHub-Release-Asset-Link in einem Slack-/Notion-Snippet teilen und Teilnehmer bekommen das Plugin mit einem Befehl in die Session — ohne Install, ohne Vertrauenskette zu npm. Fuer Kursbetrieb extrem relevant: Du kannst Lektion-spezifische Plugins als Release-ZIP hosten und im Quickstart referenzieren. Der `skillOverrides`-Fix ist der zweite grosse Gewinn — er adressiert den Klassiker "ich habe 80 Skills installiert und das Modell triggert das falsche". Mit `name-only` reduzierst Du den Token-Footprint pro Skill von ~150 auf ~10 Tokens, ohne den Skill zu deinstallieren. Auto-Update auf Brew/WinGet beendet endlich das Versionsdrift-Problem in Workshops.

**Code-Beispiel:**
```bash
# Plugin direkt aus GitHub-Release laden (nur fuer diese Session)
claude --plugin-url https://github.com/cittasana/cc-plugins/releases/download/v0.3.1/masterkurs-toolkit.zip

# Auto-Update in ~/.zshrc oder ~/.bashrc setzen (Mac/Brew, Windows/WinGet)
export CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE=1

# Skill-Bloat reduzieren ohne Skills zu deinstallieren
# ~/.claude/settings.json
{
  "skillOverrides": {
    "industrial-brutalist-ui": "off",          # komplett aus, auch von /
    "ads-tiktok": "user-invocable-only",       # nur via /ads-tiktok aufrufbar
    "seo-page": "name-only"                    # Description versteckt, Trigger nur per Name
  }
}
```

---

### 2. Claude Code 2.1.128 — `EnterWorktree` HEAD-Fix, MCP-Workspace reserved, OTEL-Isolation

**Was:**
- `EnterWorktree` erstellt neue Branches jetzt von **lokalem HEAD** statt `origin/<default-branch>` — unpushed Commits werden nicht mehr gedroppt
- MCP: `workspace` ist jetzt **reservierter Server-Name** — bestehende Server mit dem Namen werden mit Warnung uebersprungen
- Subprozesse (Bash, Hooks, MCP, LSP) erben **keine `OTEL_*` Env-Variablen mehr** — OTEL-instrumentierte Apps via Bash-Tool nutzen nicht mehr versehentlich den CLI-OTLP-Endpoint
- `/mcp` zeigt Tool-Count pro Server und flaggt "connected with 0 tools"
- `--plugin-dir` akzeptiert jetzt `.zip`-Archive zusaetzlich zu Verzeichnissen
- `--channels` funktioniert mit Console-API-Key-Auth (managed Settings brauchen `channelsEnabled: true`)
- 1M-Context-Sessions mit kleinerem Autocompact-Window werden nicht mehr faelschlich vor API-Limit als "Prompt is too long" geblockt
- Parallele Shell-Tool-Calls: ein failender Read-Only-Befehl killt nicht mehr die Geschwister
- Sub-Agent-Progress-Summaries cachen jetzt korrekt (~3× weniger `cache_creation`)
- VS Code/Cursor: Mausrad-Scroll-Bug (zu schnell) gefixt
- JetBrains-Terminals 2025.2: Scroll-Wheel-Chaos gefixt

**Erklaerung (~110 Worte):** Der `EnterWorktree`-Bug war ein **Daten-Risiko** — wer Worktrees fuer Parallel-Agents nutzte (Claude-Code-Dev-App-Pattern, Cosmos eigener Workflow), hat unpushed Commits verloren, sobald der neue Branch von `origin/main` statt lokalem HEAD startete. Der Fix landet rueckwirkend auf alle Worktree-basierten Multi-Agent-Setups. Die OTEL-Isolation ist fuer Teilnehmer mit OpenTelemetry-Stack relevant: Vorher hat jeder `pytest`/`npm test`-Lauf via Bash-Tool alle Spans an den Claude-Code-Endpoint geschickt, was Tracing-Backends geflutet hat. Der `workspace`-Reservierung-Hinweis ist Vorbereitung fuer ein kommendes built-in Workspace-MCP — Teilnehmer mit eigenem Server unter dem Namen muessen umbenennen.

**Code-Beispiel:**
```bash
# Worktree-Pattern (jetzt verlustfrei mit unpushed Commits)
git checkout feature/wip-arbeit       # lokale Commits noch nicht gepusht
# Im Claude Code:
/worktree feature/wip-arbeit-subagent # nutzt jetzt lokalen HEAD korrekt

# OTEL-saubere Subprozesse (default ab 2.1.128)
# Dein eigenes OTEL-Setup wird nicht mehr von Claude Codes OTLP-Endpoint ueberschrieben
export OTEL_EXPORTER_OTLP_ENDPOINT=https://my-tracing.example.com
claude   # Bash-Subprozesse erben dies NICHT mehr automatisch
```

---

### 3. Claude Code 2.1.127 — `CLAUDE_CODE_SESSION_ID`, Disable-Alt-Screen, SIGINT-Hygiene

**Was:**
- `CLAUDE_CODE_SESSION_ID` Env-Var im Bash-Tool-Subprozess (matcht `session_id` aus Hooks)
- `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` haelt Conversation in Terminal-Scrollback statt Fullscreen
- Externe SIGINT (IDE-Stop-Button, `kill -INT`) macht jetzt graceful Shutdown — Terminal-Modes restored, `--resume`-Hint gedruckt
- `--permission-mode`-Flag wird jetzt korrekt beim Resumen einer Plan-Mode-Session befolgt
- Fullscreen-Mode zeigt nicht mehr Blank Screen nach Sleep/Wake oder Ctrl+Z/`fg`
- Pasted Text mit fuehrendem `/` wird nicht mehr stillschweigend als Slash-Command interpretiert

**Erklaerung (~95 Worte):** `CLAUDE_CODE_SESSION_ID` ist ein **stiller, aber starker Build-Block** fuer Hooks-/Tools-Pipelines: Du kannst jetzt aus jedem Bash-Subprozess die aktuelle Session referenzieren — Logs, Audit-Trails, External-Tooling-Tagging, Analytics. Vorher war das nur in Hook-Bodies verfuegbar. Praktisches Pattern: Ein PostToolUse-Hook schreibt `{session_id, tool, args}` in eine SQLite-DB, ein separates Tool im Bash kann dieselbe Session-ID nutzen, um seine eigenen Events zu korrelieren. `DISABLE_ALTERNATE_SCREEN` ist die Antwort auf User-Beschwerden ueber "wo ist meine Conversation hin?" auf Tmux/Screen-Setups.

**Code-Beispiel:**
```bash
# Hook + Tool teilen Session-ID (PostToolUse-Hook in settings.json)
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "echo \"$CLAUDE_CODE_SESSION_ID:$TOOL_NAME\" >> ~/.claude/audit.log"
      }]
    }]
  }
}

# Eigenes Tool referenziert dieselbe Session
sqlite3 ~/.claude/events.db "INSERT INTO events VALUES('$CLAUDE_CODE_SESSION_ID', 'custom_check', datetime('now'))"

# Tmux/Screen-User: Conversation bleibt im Scrollback
export CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1
claude
```

---

## Community Best Practices & Common Mistakes

### Compaction-Hygiene (Top-Thema diese Woche)

- **60%-Regel statt 95%**: Erfahrene Nutzer rufen `/compact` proaktiv bei ~60% Context-Fuelle, nicht erst bei 95% — Qualitaetsverlust ist deutlich geringer
- **Pre-Compact Brief**: Vor `/compact` explizit schreiben "Wir debuggen 500-Error auf POST /api/orders, vermutet ist Stripe-Webhook-Race". Ohne diesen Brief vergisst der Modell-State nach Compaction den offenen Fehler komplett
- **Kitchen-Sink-Sessions vermeiden**: `/clear` zwischen unrelated Tasks ist guenstiger als Compact — Compaction kostet Context-Buffer und Tokens
- **2-Correction-Regel**: Nach 2x Korrektur des Modells fuer denselben Fehler → `/clear`, neuer Prompt mit dem gelernten Detail. Weiter korrigieren pollutiert den Context mit Failed-Approaches

### CLAUDE.md Pruning

- Ueberspezifizierte CLAUDE.md ist ein groesserer Performance-Killer als zu wenig Kontext
- Regel: "Wenn Claude die Sache schon richtig macht ohne die Instruktion → loeschen oder zu Hook konvertieren"
- Lange CLAUDE.mds zerfallen in Skills (progressive disclosure) statt monolithisch

### Skill-Authoring

- Skill-Description = Trigger-Text fuer das Modell. Banal-Beschreibungen ("hilft beim Coden") werden ignoriert. Spezifisch sein: konkrete Trigger-Phrasen, konkrete Datei-Patterns, konkrete Output-Formate
- Skills mit Subdirectories und Scripts (Progressive Disclosure) > Skills als Single-File-Markdown
- Gotchas-Section im Skill ist Pflicht — Failure-Patterns dokumentieren

---

## Wettbewerber-Updates

### GitHub Copilot CLI (5. Mai 2026)

- **Enterprise-Managed Plugins**: Public Preview gestartet — Admins koennen Plugins org-weit konfigurieren und ausrollen, Baseline-Standards in jedem User-Client erzwingen
- **VS Code Apr/Mai-Drop**: Search-by-Meaning workspace-weit + grep-style ueber GitHub-Repos/Orgs
- Custom Agents/Skills/Instructions per Natural-Language-Description generierbar
- Browser-Tabs als Context: Agent kann Tab-Inhalte lesen, Pages bedienen, Aenderungen real-time validieren
- Copilot Business/Enterprise: BYO-API-Keys fuer OpenRouter, Microsoft Foundry, Google, Anthropic, OpenAI direkt im VS-Code-Chat

**Bewertung fuer Kurs:** Browser-Tab-Context und cross-repo Search sind das, was der Cursor-User bereits hat — Copilot holt strukturell auf. Enterprise-Managed-Plugins sind ein direkter Konter zu Claude Code's Plugin-Marketplace, aber zentralisierter (Admin-driven statt Self-Service).

### Cursor

- **Cursor SDK** (29. Apr): Same Runtime/Harness/Models wie Cursor Desktop in TypeScript — `npm install @cursor/sdk`, billed token-based, Public Beta
- API rework: durable Agents, per-prompt Runs, SSE-Streaming, Reconnect via `Last-Event-ID`, explizite Lifecycle (archive/unarchive/permanent delete)
- **Composer 2 Model**: Frontier-Coding-Performance zu deutlich niedrigeren Kosten als General-Purpose
- Sample-Repo: Quickstart, Prototyping-Tool, Kanban-Board, Coding-Agent-CLI als Forks-fuer-eigene-Use-Cases

**Bewertung fuer Kurs:** Cursor SDK ist die direkte Antwort auf Claude Code's Headless-/SDK-Modus. Strategischer Punkt: Cursor verkauft das Runtime, nicht nur die UI — Anthropic hat das mit Claude Agent SDK schon laenger, aber Cursor zielt auf TypeScript-First-Teams.

---

## Markt-Trends und Anthropic News

### Skill-Spezifikation als Standard

Die im Dezember 2025 von Anthropic veroeffentlichte **Agent-Skills-Spec** wurde von OpenAI fuer Codex CLI und ChatGPT uebernommen. Bedeutung: Skills, die fuer Claude Code geschrieben sind, sind teilweise auf andere Coding-Agents portierbar. Das ist die erste echte **plattformuebergreifende Konvergenz** in der Coding-Agent-Welt.

### Plugin-Marketplace-Wachstum

- 4.200+ Skills, 770+ MCP-Server, 2.500+ Marketplaces (Stand 6. Mai)
- Curation-Signale: Install-Count, GitHub-Stars, Community-Votes
- Trend: Code-Execution-Patterns mit lokalem Python erreichen 90–99% Token-Reduktion bei Bulk-Ops

### Opus 4.7 Cost-Realitaet

- Headline-Pricing unveraendert ($5 Input / $25 Output)
- **Aber**: Neuer Tokenizer produziert bis zu **35% mehr Tokens** fuer denselben Input-Text
- Real-World-Kosten koennen also trotz unveraenderter Rate-Card steigen
- Empfehlung fuer Kurs-Teilnehmer: Token-Budget pro Task neu kalibrieren, Auto-Mode auf Max-Plan oder Sonnet-4.6-Default

---

## Content-Empfehlungen mit Prioritaeten

> Owner-Prioritaeten aus `Content Ideen.md` waren nicht lesbar — Reihenfolge nach Markt-Relevanz und Continuity zur Vorwoche.

### P0 (sofort produzieren)

1. **"Skill-Distribution mit `--plugin-url` — von Notion zum Plugin in 30 Sekunden"** (10-Min-Video)
   - Demo: GitHub-Release-Asset, Slack-Snippet, Workshop-Setup
   - Warum P0: Direkt monetisierbar (Kurs-eigenes Toolkit als ZIP-Download fuer Studenten)

2. **"Compaction-Hygiene: 60%-Regel & Pre-Compact-Brief"** (Lektion + 1 Cheatsheet-PDF)
   - Vorher/Nachher-Demo mit `/context` Token-Counts
   - Warum P0: #1 Frustrations-Punkt in Community-Threads diese Woche

### P1 (diese Woche)

3. **"Auto-Update + Multi-Maschinen-Setup fuer Workshops"** (Kurzartikel)
   - `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE` + Brew/WinGet-Pre-Install-Script
   - Beendet Versionsdrift-Probleme in Live-Sessions

4. **"`skillOverrides` deep dive — vom 80-Skill-Bloat zur sauberen Aufmerksamkeit"** (Lektion)
   - Drei Modes (`off` / `user-invocable-only` / `name-only`) mit Token-Footprint-Messung

### P2 (Backlog)

5. **"`CLAUDE_CODE_SESSION_ID` als Audit-Trail-Backbone"** — Hook + SQLite-Pattern fuer Compliance-bewusste Teams
6. **"Worktree-Pattern: HEAD-Fix in 2.1.128 erklaert"** — fuer Cosmos eigenen Multi-Agent-Workflow
7. **"Cursor SDK vs. Claude Agent SDK — wann welches"** (Vergleichsartikel, eher Backlog wegen Tiefe)

---

## Quellen-Verzeichnis

- [Anthropic — Claude Code Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Claude Code Docs — Changelog](https://code.claude.com/docs/en/changelog)
- [Releasebot — Claude Code Updates Mai 2026](https://releasebot.io/updates/anthropic/claude-code)
- [GitHub — Copilot CLI Releases](https://github.com/github/copilot-cli/releases)
- [GitHub Changelog — Enterprise-Managed Plugins fuer Copilot CLI (Public Preview, 6. Mai 2026)](https://github.blog/changelog/2026-05-06-enterprise-managed-plugins-in-github-copilot-cli-are-now-in-public-preview/)
- [GitHub Changelog — Copilot in VS Code April Releases (6. Mai 2026)](https://github.blog/changelog/2026-05-06-github-copilot-in-visual-studio-code-april-releases/)
- [Cursor — What's New / Changelog](https://cursor.com/changelog)
- [Cursor — Cursor 2.0 / Composer Blog](https://cursor.com/blog/2-0)
- [Anthropic — Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [Finout — Opus 4.7 Pricing Cost Story](https://www.finout.io/blog/claude-opus-4.7-pricing-the-real-cost-story-behind-the-unchanged-price-tag)
- [ofox.ai — Hooks/Subagents/Skills Complete Guide 2026](https://ofox.ai/blog/claude-code-hooks-subagents-skills-complete-guide-2026/)
- [SmartScope — Advanced Best Practices 2026](https://smartscope.blog/en/generative-ai/claude/claude-code-best-practices-advanced-2026/)
- [MindStudio — `/compact` Context-Rot Guide](https://www.mindstudio.ai/blog/claude-code-compact-command-context-management)
- [claudefa.st — Context-Buffer 33K-45K Problem](https://claudefa.st/blog/guide/mechanics/context-buffer-management)
- [orchestrator.dev — Agent Memory Best Practices 2026](https://orchestrator.dev/blog/2026-04-06--claude-code-agent-memory-2026/)
- [Anthropic Cookbook — Context Engineering](https://platform.claude.com/cookbook/tool-use-context-engineering-context-engineering-tools)
- [claudemarketplaces.com — Plugin/Skill/MCP Directory](https://claudemarketplaces.com/)
- [Anthropic — Official Plugin Directory](https://github.com/anthropics/claude-plugins-official)

---

*Report-Status: vollautomatisch generiert, 8 Suchanfragen + 1 WebFetch. Naechster Run: bei Verfuegbarkeit von `Content Ideen.md` Owner-Prioritaeten nachziehen.*
