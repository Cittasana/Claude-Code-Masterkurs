# Weekly Research Report — Claude Code Masterkurs

**Datum:** 2026-05-11
**Zeitraum:** ca. 7. — 11. Mai 2026 (Inkrement seit letztem Report 2026-05-07)
**Owner-Prioritaeten:** `Content Ideen.md` gelesen — alle drei Prioritaets-Sektionen sind leer. Erledigte Eintraege: Lektion 30 (Voice Mode) und Lektion 31 (1M Context Masterclass), beide 2026-03-16. Ohne explizite Prioritaeten orientiert sich der Agent an Markt-Relevanz und Anschluss an Vorwoche.

---

## Executive Summary

Vier inkrementelle Tage, vier strategische Bewegungen. **(1)** Anthropic dreht das **Advisor Tool (Beta)** scharf — mit Benchmarks: Sonnet mit Opus-Advisor +2.7pp auf SWE-bench Multilingual bei -11.9% Kosten pro Task, Haiku mit Opus-Advisor verdoppelt seinen BrowseComp-Score von 19.7% auf 41.2% bei 85% niedrigeren Kosten als Solo-Sonnet. **(2)** Claude Code spurted in drei Tagen von 2.1.131 auf 2.1.137: **`worktree.baseRef`** (fresh vs. head — wichtige Default-Aenderung), **`autoMode.hard_deny`** fuer unbedingte Sperren, Hooks bekommen **`$CLAUDE_EFFORT`** und koennen jetzt **MCP-Tools direkt aufrufen** (`type: "mcp_tool"`), **`$defaults`**-Token in autoMode-Regeln verhindert das Plattmachen der Built-in-Liste. **(3)** **Claude Security (Public Beta)** geht raus — Opus-4.7-getriebener Vulnerability-Scanner mit Scheduled Scans, CSV/Markdown-Export, Slack/Jira-Webhooks. **(4)** Konkurrenz reagiert: Cursor 3.3 bringt **"Build in Parallel"** + Auto-PR-Split, Copilot CLI 1.0.44 erlaubt **Slash-Commands mitten im Input** und `userPromptSubmitted`-Hooks koennen das LLM **komplett umgehen**, Codex CLI persistiert `/goal`-Workflows und gibt Subagents Pfad-Adressen `/root/agent_a`. **Hoechste Content-Prioritaeten:** Advisor-Tool-Lektion mit Benchmark-Tabelle, `worktree.baseRef`-Migration-Guide, **Effort-aware Hooks** als neues fortgeschrittenes Muster, und ein Claude-Security-Quickstart fuer Pro/Max-Teilnehmer (sobald GA).

---

## Neue Features & Updates

### 1. Anthropic Advisor Tool — Benchmarks veroeffentlicht, GA-Reif

**Was:**
- Beta-Header `anthropic-beta: advisor-tool-2026-03-01`, Tool-Typ `advisor_20260301`
- Server-side Tool — Sonnet/Haiku entscheiden selbst, wann sie Opus konsultieren; Web-Search und Code-Execution laufen im selben Loop
- **Neue Benchmarks (Anthropic-veroeffentlicht):**
  - Sonnet + Opus-Advisor: **+2.7 Prozentpunkte** auf SWE-bench Multilingual gegenueber Sonnet solo, **-11.9% Kosten** pro agentic Task
  - Haiku + Opus-Advisor: **41.2% auf BrowseComp** (Solo-Haiku: 19.7%) — **mehr als verdoppelt**
  - Haiku + Opus-Advisor liegt nur 29% unter Sonnet solo bei **85% niedrigeren Kosten** pro Task

**Erklaerung (~145 Worte):** Letzte Woche war das Advisor Tool noch ein Architektur-Versprechen — diese Woche sind die **harten Zahlen** da. Die wichtigste Erkenntnis ist nicht "Sonnet wird besser mit Advisor", sondern **"Haiku mit Advisor schlaegt Solo-Haiku um den Faktor 2"**: Wenn Du im Kurs erklaerst, wann Haiku statt Sonnet zu nehmen ist, ist die Antwort jetzt nicht mehr "nur fuer trivialen Boilerplate", sondern "**immer mit Advisor, wenn Latenz nicht kritisch ist**". Die Solo-Modell-Tabelle in der CLAUDE.md ist effektiv obsolet — ersetzt durch eine Executor-+-Advisor-Matrix. Strategischer fuer Anthropic: der 11.9%-Kostenrueckgang ist die erste **harte oekonomische Antwort** auf Cursor/Copilot-Subscription-Pricing. Wer pay-per-token API nutzt, bekommt automatisch das beste Preis-Performance-Verhaeltnis, das je verfuegbar war — ohne Custom-Router-Code. Fuer Pro/Max-User: dank verdoppelter Rate-Limits keine Drossel mehr beim aggressiven Mischen.

**Code-Beispiel (Production-tauglich):**
```python
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-haiku-4-5",          # gunstiger Executor
    max_tokens=8192,
    extra_headers={"anthropic-beta": "advisor-tool-2026-03-01"},
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "advisor_model": "claude-opus-4-7",   # teurer Berater
            "max_advisor_spend_usd": 0.50         # Budget-Cap
        },
        # weitere normale Tools moeglich
    ],
    messages=[{"role": "user", "content": "Refactor auth/middleware.ts ..."}]
)
# Haiku faehrt die Conversation, eskaliert an Opus nur bei schwierigen
# Reasoning-Blocks (Architektur, Security-Review, Edge-Cases).
# Bei Budget-Erschoepfung fehlt der Advisor still — die Conversation laeuft weiter.
```

---

### 2. Claude Code 2.1.133 → 2.1.137 — Worktree-Defaults, Hard-Deny, MCP-Hooks

**Was (chronologisch):**

**2.1.133 (7. Mai)**
- `worktree.baseRef` Setting: `fresh` (default) branched neue Worktrees aus `origin/<default>`, `head` aus lokalem HEAD
- **Default-Aenderung:** seit 2.1.128 lief `EnterWorktree` aus lokalem HEAD — ab 2.1.133 wieder aus `origin/<default>` (Workshop-Konsistenz!)
- `sandbox.bwrapPath` und `sandbox.socatPath` (Linux/WSL) — Custom-Pfade fuer bubblewrap/socat
- `parentSettingsBehavior` admin-Key (`'first-wins' | 'merge'`) — Admins koennen SDK `managedSettings` in den Policy-Merge einbeziehen
- **Hooks bekommen Effort-Level:** `effort.level` im JSON-Input und `$CLAUDE_EFFORT` als Env-Var; Bash-Tool-Commands koennen `$CLAUDE_EFFORT` ebenfalls lesen
- Focus-Mode-Verhalten verbessert

**2.1.136 (8. Mai)** — *2.1.134 und 2.1.135 wurden nie zu npm gepushed*
- `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` re-aktiviert die Session-Quality-Survey fuer Enterprises mit OpenTelemetry-Erfassung
- `settings.autoMode.hard_deny` — unbedingte Sperren, die selbst Allow-Exceptions ueberstimmen
- Fix: MCP-Server aus `.mcp.json`, Plugins und claude.ai-Connectors verschwanden still nach `/clear` in VS-Code-Extension, JetBrains-Plugin und Agent-SDK
- Fix: rarer Login-Loop bei concurrent Credential-Write (frisch rotiertes OAuth-Token wurde ueberschrieben)
- Fix: MCP OAuth-Refresh-Tokens gingen verloren bei parallelem Refresh mehrerer Server

**2.1.137 (9. Mai)**
- **Hooks koennen MCP-Tools direkt aufrufen:** neuer Hook-Type `"mcp_tool"` — der Hook ruft einen MCP-Tool-Call ab, statt nur eine Shell-Command auszufuehren
- `$defaults`-Token in `autoMode.allow`, `autoMode.soft_deny`, `autoMode.environment` — addiert Custom-Rules zur Built-in-Liste, ersetzt sie nicht
- "Don't ask again"-Option fuer den Auto-Mode-Opt-in-Prompt

**Erklaerung (~150 Worte):** Drei Releases in drei Tagen, alle drei mit substantieller Auswirkung auf Kurs-Workflows. **`worktree.baseRef`** ist die wichtigste fuer den Kurs — der Default ist von HEAD zurueck auf `origin/<default>` gewechselt, was bedeutet: wer seit 2.1.128 erwartete, dass unpushed Commits im Worktree landen, muss jetzt explizit `worktree.baseRef: "head"` setzen. **Effort-aware Hooks** sind ein neues Pattern: Du kannst dieselbe Codebase mit `effort: low` Lint-only und mit `effort: high` Full-Type-Check + Tests fahren — ohne separate Hook-Configs. **`autoMode.hard_deny`** schliesst die letzte Auto-Mode-Luecke: bisher konnten User mit "ja immer erlauben" gefaehrliche Operationen freischalten — `hard_deny` ist die admin-seitige Notbremse, die nicht ueberstimmbar ist. **MCP-Tool-Hooks** schliesslich machen Hooks komponierbar — ein PostToolUse-Hook kann jetzt z.B. den Slack-MCP zum Posten einer Diff-Notification aufrufen, ohne dass das Modell das tun muesste.

**Code-Beispiel:**
```jsonc
// ~/.claude/settings.json — Effort-aware Hook + hard_deny + $defaults
{
  "worktree": { "baseRef": "fresh" },  // explizit setzen statt auf Default vertrauen
  "autoMode": {
    "hard_deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Bash(git reset --hard *)"
    ],
    "allow": ["$defaults", "Bash(npm test)", "Bash(pytest)"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if [ \"$CLAUDE_EFFORT\" = \"high\" ]; then npm run typecheck; fi"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "mcp_tool",                  // NEU in 2.1.137
            "server": "slack",
            "tool": "post_message",
            "args": { "channel": "#claude-diffs", "text": "Edit done" }
          }
        ]
      }
    ]
  }
}
```

---

### 3. Claude Security — Public Beta mit Opus 4.7

**Was:**
- **Vulnerability-Scanner** powered by Opus 4.7 — liest Quellcode wie ein menschlicher Security-Researcher, trackt Data-Flows, analysiert File-Cross-Interactions (kein Pattern-Matching)
- Zielgruppe: Claude Enterprise (Public Beta seit ca. 30. April 2026)
- **Scheduled Scans** und **Targeted Scans** (Directory-spezifisch)
- **Findings dismissen** mit dokumentierter Begruendung
- **Export:** CSV + Markdown
- **Integrations:** Slack, Jira, Webhooks
- **Partner-Ecosystem:** CrowdStrike, Microsoft Security, Palo Alto, SentinelOne, TrendAI, Wiz integrieren Opus 4.7

**Erklaerung (~135 Worte):** Claude Security ist die **Produktifizierung** dessen, was viele Teams seit Februar mit Custom-Workflows + Claude Code als Security-Auditor gebaut haben — jetzt als gepacktes Enterprise-Produkt. Fuer den Kurs ist das eine **wichtige strategische Erwaehnung**, weil viele Kursteilnehmer in Enterprise-Kontexten arbeiten und fragen werden, ob Claude Code das selbe macht. Antwort: **Nein** — Claude Code ist ein interaktiver Agent fuer Entwickler. Claude Security ist ein dedizierter, scheduled-running Scanner mit Triage-Workflow, Audit-Trail und Export-Pfaden fuer Security-Teams. Beide nutzen Opus 4.7, aber die Workflows sind orthogonal. Fuer Pro/Max-User: noch nicht verfuegbar, aber das Pattern (Opus-4.7-Audit auf der eigenen Codebase) laesst sich heute schon mit Claude Code nachbauen — ein Lektion-Building-Block.

---

### 4. Cursor 3.3 — Build in Parallel, Auto-PR-Split, PR Review

**Was (7. Mai Release):**
- **"Build in Parallel"**-Button: Cursor analysiert den Plan, identifiziert unabhaengige Teile und feuert sie als async Subagents parallel ab; dependent Steps bleiben serialisiert
- **`/multitask`** (seit 3.2, jetzt im Editor): bricht groessere Tasks in Chunks auf, parallel-dispatched an ein Subagent-Fleet
- **Auto-PR-Split:** Multitask-Output kann via Quick-Action automatisch in mehrere PRs aufgeteilt werden — Cursor identifiziert logische Slices aus dem Chat-Kontext, defaultet zu unabhaengigen PRs, erstellt Backup-Snapshot, schlaegt Split-Plan zur Genehmigung vor
- **PR Review** als First-Class-Feature

**Erklaerung (~110 Worte):** Cursor positioniert sich als **"die IDE, in der Multi-Agent passiert"** — explizit als UX-Antwort auf Claude Codes Worktree-Pattern. Der entscheidende Unterschied: Bei Claude Code organisierst Du Multi-Agent **selber** ueber Worktrees + Subagent-Calls; in Cursor druecken Teilnehmer einen Button. Fuer den Kurs lohnt ein **Vergleichs-Modul** ("Multi-Agent in Cursor vs. Claude Code"): Cursor gewinnt UX-Komfort, Claude Code gewinnt Control + Headless-Tauglichkeit. Auto-PR-Split ist ein UX-Trick, den Claude Code derzeit nicht hat — aber `/karimo`-aehnliche Skills im Kurs koennten dasselbe leisten. Erwaehnung lohnt sich als "warum nicht beide?"-Argument.

---

### 5. GitHub Copilot CLI 1.0.44 — Mid-Input Slash, LLM-Bypass-Hooks

**Was (8. Mai Release):**
- **Slash-Commands mitten im Input** (nicht mehr nur am Anfang) — mehrere Skills in einer Nachricht moeglich
- **`userPromptSubmitted`-Hooks koennen direkt antworten** ohne LLM-Call (Bypass) — Response kommt aus dem Hook zurueck
- Schnellere `/user list` und `/user switch` fuer Multi-Account
- `copilot update` und `/update` akzeptieren `--prerelease`
- Shell-Commands via `!` Prefix funktionieren jetzt mit allen Shell-Configs (Aliases, rc-Files)
- Bug-Fix: Quota-Display zeigt fuer Free-User korrekte Remaining-Usage (war 100%-stuck)
- **Rubber Duck Cross-Family Critic:** Sessions mit GPT-Modell bekommen einen Claude-Critic, Sessions mit Claude-Modell einen aufgewerteten GPT-Critic — fuer Second-Opinion-Workflows

**Erklaerung (~110 Worte):** Drei Patterns klauen sich die Tools gegenseitig:
1. **Mid-Input Slash** ist eine Cursor-Feature, jetzt auch in Copilot CLI
2. **LLM-Bypass via Hook** ist konzeptionell identisch zu Claude Codes `userPromptSubmit`-Hook-Verhalten — Hooks koennen die User-Anfrage direkt beantworten, das spart bei FAQs, Status-Queries oder einfachen Templates komplette Modell-Calls und damit Kosten
3. **Cross-Family-Critic** ist das **konzeptionelle Spiegelbild** zum Anthropic Advisor Tool, nur ueber Provider-Grenzen hinweg

Fuer den Kurs: Das ist die naturalistische "Kein-Hersteller-besitzt-die-besten-Ideen"-Argumentation. Wert: zeigen, dass die **Patterns** uebertragbar sind — nicht die einzelnen Tools.

---

### 6. OpenAI Codex CLI — Persistierte Goals + Multi-Agent v2

**Was:**
- **Persistierte `/goal`-Workflows** mit App-Server-API, Model-Tools, Runtime-Continuation und TUI-Controls (create/pause/resume/clear)
- **MultiAgentV2-Konfiguration:** explizite Thread-Caps, Wait-Time-Controls, Root/Subagent-Hints, v2-spezifisches Depth-Handling
- **Sub-Agent-Adressen:** `/root/agent_a`, `/root/agent_b/sub_1` — strukturiertes Inter-Agent-Messaging und Agent-Listing
- Built-in Worktrees + Cloud-Environments fuer Multi-Project-Parallelitaet
- `/title`-Picker fuer Terminal-Titel funktioniert in beiden TUIs

**Erklaerung (~95 Worte):** Codex CLI baut weiter an einem **First-Class-Multi-Agent-Framework**, das in Hierarchien denkt (`/root/agent_a/sub_1`). Das ist konzeptionell ehrgeiziger als Claude Codes Subagents und Cursors `/multitask` — aber komplexer. Fuer den Kurs lohnt eine kurze **Markt-Landkarte**: drei Vendor-Ansaetze fuer Multi-Agent (Anthropic via Worktrees + selektive Subagent-Calls, Cursor via async Dispatch, OpenAI via persistierte Goal-Trees) — und der Hinweis, dass die unterliegenden Patterns universell sind. Persistierte Goals sind das einzige Feature, das in Claude Code aktuell **fehlt** — sessionsuebergreifende Task-Continuation ohne `/resume`-Magie.

---

## Community Best Practices & Common Mistakes

**Best Practices (Synthese aus DEV/Builder.io/Mejba/Firecrawl):**
1. **Context ist die knappste Ressource** — CLAUDE.md durch die Frage "wuerde Claude ohne diese Zeile Fehler machen?" filtern; jede Zeile, die das nicht besteht, raus
2. **Hooks fuer Deterministisches** — wenn etwas zu 100% passieren muss (Formatting, Linting, Security-Checks), gehoert es in einen Hook, nicht in den Prompt
3. **Skill-Description ist King** — Claude entscheidet **nur** anhand der einen Zeile, ob ein Skill triggert. Vage = nie. Spezifisch mit Trigger-Phrasen = zuverlaessig
4. **First 30 Days Stack:** Codex-Plugin + Obsidian-Skill + Auto-Research — drei Tools tief lernen, dann erst skalieren

**Common Mistakes (immer wieder erwaehnt):**
1. **"Kitchen-Sink-Session"** — Mehrere unzusammenhaengende Tasks in einer Session; Context fuellt sich mit Irrelevantem. **Fix:** `/clear` zwischen Themen
2. **"Mega-Skill"** — Ein einziger Skill versucht Commits, PRs, Branch-Naming und Changelog gleichzeitig. **Fix:** ein Skill = eine Verantwortung
3. **"Day-One-Hoarding"** — Alle 80 Skills, 30 Plugins, 15 MCPs sofort installieren. **Fix:** drei Tools, vier Wochen, dann nachladen

**Fuer den Kurs:** Diese drei Antipatterns sind seit Monaten konstant — sie eignen sich als wiederverwendbarer Block fuer die Onboarding-Lektion und als Quiz-Material.

---

## Wettbewerber-Updates

| Tool | Release | Highlight |
|---|---|---|
| Cursor 3.3 | 7. Mai | Build in Parallel, Auto-PR-Split, PR Review |
| Copilot CLI 1.0.44 | 8. Mai | Mid-Input Slash, LLM-Bypass-Hooks, Cross-Family Rubber-Duck |
| Codex CLI 0.130 | Anfang Mai | Persistierte `/goal`, MultiAgentV2, Subagent-Pfad-Adressen |
| Claude Code 2.1.133–2.1.137 | 7–9. Mai | worktree.baseRef, hard_deny, $CLAUDE_EFFORT, MCP-Hooks, $defaults |

**Strategische Lesart:** Diese Woche zementiert das Bild von **vier Tools, die sich UX-Ideen klauen, aber unterschiedliche Architekturen verfolgen**:
- **Anthropic** setzt auf API-First (Advisor Tool) + Headless-CLI + tiefe Hook/Plugin-Extensibility
- **Cursor** setzt auf Editor-zentrische UX mit eingebauter Parallelitaet
- **Microsoft/GitHub** setzt auf Enterprise-Distribution + Cross-Family-Pragmatismus
- **OpenAI** setzt auf hierarchische Multi-Agent-Trees und persistierte Goals

Fuer den Kurs: **Anthropic gewinnt Power-User, Cursor gewinnt UX-fokussierte Teams, Copilot gewinnt Enterprise-IT, Codex gewinnt Multi-Agent-Researcher.** Das ist eine saubere Positionierungs-Folie fuer eine Vergleichs-Lektion.

---

## Markt-Trends & Anthropic News

1. **"Cost-Aware Multi-Model"** wird das dominante Muster — Advisor Tool (Anthropic), Rubber-Duck Cross-Family (Copilot), MultiAgentV2 (Codex). Die Frage "welches Modell" wird durch "welche Modell-Hierarchie + welches Budget" abgeloest.

2. **Security-Auditing wird produktifiziert** — Claude Security in Public Beta, Partner-Integrationen mit allen grossen SecOps-Vendors. Erwartung: GA noch in 2026 Q2, Pro/Max-Tier-Variante denkbar.

3. **Hooks werden zur Plattform** — Sowohl Claude Code (MCP-Tool-Hooks, Effort-Level, hard_deny) als auch Copilot CLI (LLM-Bypass) machen Hooks zum primaeren Mechanismus fuer Determinismus + Policy-Enforcement. Wer Hooks beherrscht, baut produktionsreife Workflows; wer nicht, prompt-engineert in Endlosschleife.

4. **Worktrees sind das Default-Multi-Agent-Primitiv geworden** — alle vier Vendor nutzen Worktrees oder isolierte Workspaces als Multi-Agent-Substrat. Das ist die wichtigste verborgene Standardisierung der Quartals.

5. **Rate-Limits oeffnen sich** — Anthropic verdoppelt Pro/Max/Team/Enterprise-Limits (SpaceX-Compute), entfernt Peak-Hour-Reduktionen fuer Pro/Max. Indirekte Folge: Workshop-Throttling wird signifikant entspannter.

---

## Content-Empfehlungen mit Prioritaeten

### Hohe Prioritaet (binnen 1–2 Wochen)

1. **Lektion: Advisor Tool in Production — die neue Modell-Auswahl-Strategie** (40–60 Min)
   - Benchmarks vorstellen (Haiku +21pp BrowseComp, Sonnet -11.9% Cost)
   - Code-Beispiel: Haiku-Executor + Opus-Advisor + Budget-Cap
   - Vergleich gegen Solo-Sonnet und Solo-Opus mit Latenz/Kosten-Diagramm
   - "Wann **kein** Advisor": Streaming-UI, harte Latenz-SLOs
   - **Begruendung:** Wichtigste Architektur-Aenderung des Jahres bisher; veraltet Cosmos eigene Modell-Tabelle in der globalen CLAUDE.md

2. **Quickwin-Video: `worktree.baseRef` Migration** (8–12 Min)
   - Was hat sich zwischen 2.1.128 und 2.1.133 geaendert
   - Wie testen, ob man HEAD oder fresh braucht
   - Konkrete Settings.json-Migration
   - **Begruendung:** Default-Aenderung, die ohne Erklaerung Teilnehmer-Verwirrung produziert

3. **Lektion: Effort-aware Hooks — `$CLAUDE_EFFORT` in der Praxis** (25–40 Min)
   - Neues Pattern, das nicht offensichtlich ist
   - Beispiele: Lint-only bei `low`, Full-Suite bei `high`
   - Anti-Pattern: Effort als Boolean missbrauchen
   - **Begruendung:** Komplett neues Feature, kein Existenz-Content vorhanden; differenziert Power-User von Beginnern

### Mittlere Prioritaet (in 2–4 Wochen)

4. **Vergleichs-Lektion: Multi-Agent in Claude Code vs. Cursor vs. Codex** (45 Min)
   - Worktrees vs. /multitask vs. /root/agent_a
   - Wann welches Tool — anhand realer Szenarien
   - **Begruendung:** Wettbewerber-Updates haben diese Woche kritische Masse erreicht; Teilnehmer fragen das aktiv

5. **Skill-Refresh: Antipatterns "Mega-Skill", "Kitchen-Sink-Session", "Day-One-Hoarding"** (15 Min)
   - Drei Antipatterns aus Community-Konsens als Quiz-Material
   - **Begruendung:** Wiederverwendbar fuer Onboarding + Quiz; sehr ROI-effizient

6. **Erwaehnung in einem bestehenden Sicherheits-Modul: Claude Security Public Beta**
   - Was es ist, was es nicht ist, wann fuer Pro/Max
   - **Begruendung:** Wichtig fuer Enterprise-Teilnehmer; aber noch kein dedizierter Lektions-Aufwand wert solange Pro/Max-Variante fehlt

### Niedrige Prioritaet (Backlog)

7. **MCP-Tool-Hooks Tutorial** (sobald 1–2 reale Use-Cases im eigenen Setup laufen)
8. **`autoMode.hard_deny` + `$defaults` Cheatsheet** als Social-Post + Cheat-PDF — eher fuer Lead-Gen als als Lektion

---

## Quellen-Verzeichnis

**Anthropic / Claude Code:**
- Claude Code Changelog: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
- Claude Code Releases: https://github.com/anthropics/claude-code/releases
- Claude Code Docs Changelog: https://code.claude.com/docs/en/changelog
- Anthropic Release-Notes Aggregator: https://releasebot.io/updates/anthropic
- Advisor Tool Beta: https://platform.claude.com/docs/en/release-notes/overview
- Threads-Hinweis zur Advisor-Strategie: https://www.threads.com/@testingcatalog/post/DW7AWkDDTNf
- Claude Security Public Beta:
  - https://www.helpnetsecurity.com/2026/05/04/anthropic-claude-security-public-beta/
  - https://www.itpro.com/security/anthropic-targets-vulnerability-detection-gains-with-claude-security-public-beta-heres-what-users-can-expect
  - https://siliconangle.com/2026/04/30/anthropic-announces-claude-security-public-beta-find-fix-software-vulnerabilities/
- Opus 4.7 in Bedrock: https://aws.amazon.com/blogs/aws/introducing-anthropics-claude-opus-4-7-model-in-amazon-bedrock/

**Wettbewerber:**
- Cursor Changelog: https://cursor.com/changelog
- Cursor 3.3 PR-Split/Build-in-Parallel: https://cursor.com/changelog/05-07-26
- Cursor /multitask Erklaerer: https://www.agentpatterns.ai/tools/cursor/multitask-subagents/
- GitHub Copilot CLI Releases: https://github.com/github/copilot-cli/releases
- Copilot CLI Changelog: https://github.com/github/copilot-cli/blob/main/changelog.md
- Copilot Enterprise-Plugins (Preview): https://github.blog/changelog/2026-05-06-enterprise-managed-plugins-in-github-copilot-cli-are-now-in-public-preview/
- Copilot Rubber Duck Cross-Family: https://github.blog/changelog/2026-05-07-rubber-duck-in-github-copilot-cli-now-supports-more-models/
- Codex CLI Changelog: https://developers.openai.com/codex/changelog
- gh-aw Issue mit Versionsuebersicht: https://github.com/github/gh-aw/issues/31172

**Community / Best Practices:**
- Claude Code Best Practices (offiziell): https://code.claude.com/docs/en/best-practices
- Best Practices Sammlung (DEV): https://dev.to/muhammad_moeed/claude-code-skills-a-practical-guide-for-2026-3f6p
- Builder.io 50 Tips: https://www.builder.io/blog/claude-code-tips-best-practices
- Top-10 Skills/Plugins/CLIs 2026: https://www.mejba.me/blog/top-10-claude-code-skills-plugins-clis-2026
- Best Skills 2026: https://www.firecrawl.dev/blog/best-claude-code-skills
- Claudefa.st 9 best Skills: https://claudefa.st/blog/tools/skills/best-claude-code-skills
- Best Practices vibe-to-agentic: https://github.com/shanraisshan/claude-code-best-practice

---

**Report erstellt:** 2026-05-11 — Naechster Run geplant: Montag, 2026-05-18.
