# Weekly Research Report — Claude Code Masterkurs

**Datum:** 2026-04-27
**Zeitraum:** ca. 14.-27. April 2026
**Owner-Prioritaeten:** Keine spezifischen Themen in `Content Ideen.md` gesetzt — Agent waehlt frei nach Markt-Relevanz.

---

## Executive Summary

Die Woche war eine der dichtesten in der Claude-Code-Geschichte: Anthropic hat **Opus 4.7** (16. April) ausgeliefert, **Ultraplan** in Early Preview gebracht, **Computer Use** in den CLI gestartet und das **Monitor Tool** zum Standard fuer Background-Prozesse gemacht. Parallel hat Cursor mit **Cursor 3 + Composer 2** und **Async Subagents** (3.2 vom 24. April) nachgelegt, GitHub Copilot bringt **Inline Agent Mode** in JetBrains. Der **Claude Skills Marketplace** ist innerhalb von 3 Monaten um 900% gewachsen und bildet eine eigene Oekonomie. Hoechste Content-Prioritaeten: Ultraplan-Lektion, Opus-4.7-Migration, Monitor-Tool-Patterns, Computer-Use-Demos.

---

## Neue Features & Updates

### 1. Claude Opus 4.7 — Released 16. April 2026

**Was:** Neues Flaggschiff-Modell. +13% Lift auf Coding-Benchmarks gegenueber Opus 4.6, 3x mehr Production-Tasks geloest, 3x hoehere Vision-Aufloesung (bis 3.75 MP), neuer Tokenizer, neuer `xhigh`-Effort-Level, Task-Budgets und verbesserte Instruction-Following.

**Pricing:** Unveraendert — $5/M Input, $25/M Output.

**Verfuegbarkeit:** Claude API, Bedrock, Vertex AI, Microsoft Foundry, Claude Code (auto-default).

**Erklaerung (ca. 110 Worte):** Opus 4.7 ist die erste Iteration, die laut Anthropic schwerste Software-Engineering-Tasks ohne enge Aufsicht uebernehmen kann. Der neue `xhigh`-Effort-Level erlaubt noch tieferes Reasoning fuer komplexe Refactorings und Architektur-Entscheidungen — kostet aber spuerbar mehr Tokens. Task-Budgets sind ein neues Sicherheitsnetz: Du kannst pro Task ein Token-Limit setzen, was bei langen Agent-Loops Kostenausreisser verhindert. Die 3x hoehere Vision-Aufloesung macht Screenshot-basiertes Debugging (z.B. UI-Bugs aus Designs) deutlich praeziser. Migration ist trivial — gleicher Pricing-Tarif, drop-in Replacement. Anthropic raeumt offen ein, dass das interne Mythos-Modell noch staerker ist, aber 4.7 sicherer veroeffentlicht werden kann.

**Code-Beispiel:**
```bash
# Opus 4.7 mit xhigh-Effort fuer schwierigen Refactor
claude --model claude-opus-4-7 --effort xhigh \
  "Refactor the auth middleware to support OAuth2 PKCE"

# Task-Budget setzen
claude --model claude-opus-4-7 --task-budget 50000 \
  "Migrate the database layer to Drizzle"
```

---

### 2. Ultraplan — Cloud-basierte Plan-Phase

**Was:** Neue Slash-Command `/ultraplan` startet die Planungsphase in einem Anthropic-Cloud-Container (bis zu 30 Min Laufzeit), oeffnet ein Browser-Review-Interface mit Inline-Kommentaren, Reaktionen und Outline-Sidebar. Nach Approval: Ausfuehrung in der Cloud ODER "Teleport back to terminal" fuer lokale Ausfuehrung.

**Requirements:** Claude Code v2.1.101+, GitHub-hosted Repo, Pro/Max-Plan.

**Erklaerung (ca. 130 Worte):** Ultraplan loest das groesste Problem von /plan: lange Plan-Generierungen blockieren das Terminal und verbrauchen Tokens im Hauptchat. Indem die Planung in einen Cloud-Container ausgelagert wird, bleibt das lokale Terminal frei fuer andere Arbeit, und der Plan landet in einem dedizierten Web-Editor mit Highlighting und Comments — aehnlich wie ein Pull-Request-Review fuer Plaene. Drei Wege zum Start: `/ultraplan <prompt>`, das Wort "ultraplan" irgendwo in einem normalen Prompt, oder aus dem lokalen Plan-Dialog ueber "Refine with Ultraplan". Wichtig: Wer Remote Control nutzt, muss waehlen — beide Features konkurrieren um claude.ai/code. Die Trennung von Planung und Ausfuehrung ist konzeptionell der wichtigste Schritt seit Subagents und passt perfekt zum Pattern "Plan-First-Coding".

**Code-Beispiel:**
```bash
# Direkter Aufruf
/ultraplan migrate the auth service from sessions to JWTs

# Im normalen Prompt
"Use ultraplan to design the Stripe webhook handler refactor"

# Aus lokalem Plan refinen (nach /plan-Dialog "No, refine with Ultraplan")
```

---

### 3. Computer Use im CLI (Research Preview)

**Was:** Claude kann native macOS-Apps oeffnen, durch UIs klicken und gebaute Features verifizieren — direkt aus dem Terminal. Macht End-to-End-UI-Tests und Build-Verify-Loops moeglich.

**Requirements:** Claude Code v2.1.85+, macOS, Pro/Max, interaktive Session (kein `-p`-Flag).

**Erklaerung (ca. 95 Worte):** Computer Use ist der bisher staerkste Schritt von "Code-Generator" zu "echter Agent". Klassisches Beispiel aus den Docs: "Build a macOS menu bar app" — Claude schreibt Swift, kompiliert, startet die App, klickt durch jeden Control und meldet zurueck, was funktioniert. Fuer Electron- oder Web-Apps: "Test the onboarding flow" laesst Claude den Signup durchklicken und Screenshots erstellen. Permissions sind streng: Beim ersten Zugriff auf eine App fragt Claude im Terminal nach Allow/Deny, inklusive Clipboard-Zugriff und welche anderen Apps versteckt werden. Pure Killer-Feature fuer UI-Bug-Reproduktion und visuelle Regression-Tests ohne Playwright-Setup.

---

### 4. Monitor Tool — Event-driven Background-Prozesse

**Was:** Spawnt einen Background-Prozess, dessen stdout zum Event-Stream wird. Jede Zeile ist eine Notification, die Claude weckt — kein Polling mehr.

**Erklaerung (ca. 100 Worte):** Bisher musste man `BashOutput` in Schleifen pollen, um zu wissen ob ein Build fertig ist — viele Token-verbrennende Roundtrips. Das Monitor Tool dreht das um: Claude startet z.B. den Dev-Server oder eine CI-Pipeline und reagiert nur, wenn echte Events durchkommen (Errors, Status-Changes, Test-Failures). stdout-Lines innerhalb 200ms werden gebuendelt, sodass Multi-Line-Output natuerlich gruppiert. Use-Cases: Tail langer Test-Suites, Watch-Modes fuer File-Changes, Deploy-Logs, lange ML-Trainings. Kombiniert mit Hooks ergibt sich ein vollstaendig event-driven Agent-System — Claude wartet, bis etwas Relevantes passiert, statt Token-teurer Polling-Loops.

**Code-Beispiel:**
```bash
# Monitor startet Dev-Server, Claude reagiert nur auf Errors
Monitor("npm run dev", until: "Error|FAIL")

# Lange Tests im Hintergrund mit Event-Reaktion
Monitor("pytest tests/ -v", reason: "watch failures during refactor")
```

---

### 5. Skills Marketplace + Customize Section

**Was:** Neue **Customize**-Section in Claude Desktop bundelt Skills, Plugins und Connectors. Cowork ist GA auf macOS/Windows. Admins koennen User-Gruppen mit Custom-Roles versehen. Skills-Marketplace ist 900% in 3 Monaten gewachsen — mehrere Plattformen (LobeHub, SkillsMP, claudeskills.info, daymade/claude-code-skills auf GitHub).

**Relevanz fuer Kurs:** Skill-Distribution wird ein eigenes Karriere-/Geschaeftsmodell. Eine Lektion zum Erstellen + Veroeffentlichen eines Skills auf einem Marketplace ist hochrelevant.

---

## Community Best Practices & Common Mistakes

### Top 4 Context-Window-Mistakes (April 2026 Konsens)

1. **Kitchen-Sink-Session:** Mehrere unzusammenhaengende Tasks in einer Session. Fix: `/clear` zwischen Tasks.
2. **Correcting-Over-and-Over:** Nach 2 Korrektur-Versuchen Context komplett pollutiert. Fix: Nach 2 Failures → `/clear` und besseren Initial-Prompt schreiben mit dem Gelernten.
3. **Over-specified CLAUDE.md:** Zu lange CLAUDE.md → Claude ignoriert die Haelfte. Fix: Ruthlessly prunen. Was Claude eh richtig macht, ist Noise.
4. **Trust-Then-Verify-Gap:** Plausibler Code ohne Edge-Cases. Fix: Hooks fuer deterministic Validation statt Hoffen auf Modell-Verstaendnis.

### Subagent + Hook Strategy (verfestigtes Pattern)

- **Skills first** — easiest Einstieg, sofortiger Nutzen.
- **Hooks** wenn deterministic Enforcement noetig (z.B. PreToolUse fuer Security).
- **Subagents** wenn Parallelitaet ODER Context-Isolation matter (3 Research-Subagents parallel = 1 Wall-Clock-Unit fuer 3 Units Arbeit).
- **One Expertise Area pro Subagent**, minimal Tool-Access, Haiku fuer Simple/Sonnet fuer Complex.

Hooks feuern an **25 Lifecycle-Points**. Wichtigste: `UserPromptSubmit` (kann Prompts blocken/modifizieren), `PreToolUse` (Security-Checkpoint vor jedem Tool-Call).

---

## Wettbewerber-Updates

### Cursor 3 + Composer 2 (April 2026)
- **Composer 2:** $0.50/M Input, $2.50/M Output — guenstiger als Opus 4.7. 200+ tok/s, 61.3 CursorBench (+39% vs 1.5).
- **Parallel Agents:** Mehrere Tasks gleichzeitig in der IDE.
- **Design Mode:** Visuelles Annotieren von UI-Aenderungen.
- **Cursor 3.2 (24. April):** Async Subagents, verbesserter Worktrees-Flow, Multi-Root-Workspaces fuer Cross-Repo-Changes.

**Vergleich:** Cursor punktet mit Geschwindigkeit + Preis, Claude Code mit Tiefe (Opus 4.7, Computer Use, Ultraplan-Cloud-Planning). Wer Multi-File-Refactors mit visueller UI-Iteration macht: Cursor. Wer komplexe Architektur-Tasks plant + ausfuehrt: Claude Code mit Ultraplan.

### GitHub Copilot (April 2026)
- **Inline Agent Mode** fuer JetBrains in Public Preview (Shift+Cmd+I).
- **Global Auto-Approve** (kontrovers — auto-approved auch destruktive Actions).
- **Copilot CLI:** Tab-Completion, bessere Sessions, Hooks, Statusline, MCP-Enhancements.
- Cloud-Agent-Fields in Usage-Metrics.

---

## Markt-Trends & Anthropic News

- **Mythos-Eingestaendnis:** Anthropic gibt offen zu, dass intern ein staerkeres Modell (Mythos) existiert, das wegen Safety-Concerns zurueckgehalten wird. Erste oeffentliche Andeutung dieser Stufung.
- **Cybersecurity-Safeguards:** Opus 4.7 blockt automatisch Prompts die als prohibited/high-risk Cybersecurity-Use erkannt werden.
- **Cowork GA:** Claude Cowork (Team-Features) jetzt GA auf macOS+Windows. Group-Roles, Department-Restrictions.
- **Skills-Oekonomie:** Marketplaces wachsen explosiv. Erste Indizien fuer kommerzielle Skill-Pakete (Bundles fuer Teams).
- **Auto-Cloud-Setup:** Erst-Run von Claude Code legt automatisch Cloud-Environment an. Vertex-AI-Setup-Wizard direkt im Login-Screen.
- **30+ Releases zwischen Maerz und April** (Versionen 2.1.69 bis 2.1.101+) — beispielloses Release-Tempo.

---

## Content-Empfehlungen fuer den Kurs

### Hohe Prioritaet (naechste 1-2 Wochen)

1. **Lektion 34 — Ultraplan: Cloud-Planning fuer komplexe Refactors**
   - Demo: Auth-Service-Migration mit `/ultraplan` von Plan zu Approval zu Teleport-back-to-terminal.
   - Vergleich: lokales `/plan` vs Ultraplan — wann lohnt sich was?
   - Beispiel-Repo + Inline-Comments-Walkthrough.

2. **Lektion 35 — Migration auf Opus 4.7 + xhigh-Effort + Task-Budgets**
   - Welcher Effort-Level wann? (low/medium/high/xhigh-Decision-Tree).
   - Task-Budgets fuer Cost-Control bei Agent-Loops.
   - Vision-Use-Cases (UI-Bug-Reproduction aus Screenshots).

3. **Lektion 36 — Monitor Tool & Event-Driven Agent-Patterns**
   - Polling vs Event-Streams.
   - 3 Real-World-Patterns: Dev-Server-Watch, CI-Pipeline-Monitoring, Long-Running-Test-Reaktion.
   - Kombi mit Hooks fuer auto-Reaktion.

### Mittlere Prioritaet (in 2-4 Wochen)

4. **Lektion 37 — Computer Use im CLI: Visuelle Verification ohne Playwright**
   - Beispiel: Electron-App-Onboarding-Test.
   - Permission-Modell + Sicherheit.
   - Wann besser Playwright/MCP, wann Computer Use.

5. **Lektion 38 — Skills publizieren: Vom eigenen Skill zum Marketplace**
   - Skill schreiben, testen, packagen.
   - Marketplace-Vergleich (LobeHub vs SkillsMP vs claudeskills.info).
   - Monetarisierung & Bundles.

### Niedrige Prioritaet / Wenn Zeit ist

6. **Comparative Lecture — Claude Code 2.1 vs Cursor 3 vs Copilot Agent Mode**
   - Wann welches Tool? Decision-Matrix nach Use-Case.

7. **Mini-Update — Cowork GA + Team-Roles**
   - Nur fuer Kurs-Teilnehmer in Teams relevant.

---

## Quellen-Verzeichnis

### Anthropic / Claude Code (offiziell)
- [Claude Code What's New](https://code.claude.com/docs/en/whats-new)
- [Introducing Claude Opus 4.7 — Anthropic](https://www.anthropic.com/news/claude-opus-4-7)
- [What's new in Claude Opus 4.7 — API Docs](https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7)
- [Plan in the cloud with ultraplan — Claude Code Docs](https://code.claude.com/docs/en/ultraplan)
- [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [Claude Help Center Release Notes](https://support.claude.com/en/articles/12138966-release-notes)

### Community / Tutorials
- [Claude Code Changelog 2026 — claudefa.st](https://claudefa.st/blog/guide/changelog)
- [Decoding the April 2026 Changelog (2.1.69 → 2.1.101) — Apiyi](https://help.apiyi.com/en/claude-code-changelog-2026-april-updates-en.html)
- [Claude Code Hooks, Subagents, Skills Complete Guide — ofox.ai](https://ofox.ai/blog/claude-code-hooks-subagents-skills-complete-guide-2026/)
- [Claude Code Advanced Best Practices — SmartScope](https://smartscope.blog/en/generative-ai/claude/claude-code-best-practices-advanced-2026/)
- [Monitor Tool Guide — claudefa.st](https://claudefa.st/blog/guide/mechanics/monitor)
- [Ultraplan Walkthrough — Better Stack](https://betterstack.com/community/guides/ai/claude-code-ultraplan/)
- [Computer Use in Claude Code — DevOps.com](https://devops.com/claude-code-can-now-run-your-desktop/)
- [7 Token-Mistakes in Claude Code — Pillitteri](https://pasqualepillitteri.it/en/news/871/claude-code-token-7-mistakes-burning-quota)

### Wettbewerber
- [Cursor Composer 2 — Cursor Blog](https://cursor.com/blog/composer-2)
- [Cursor 3 + Composer 2 Review — TokenMix](https://tokenmix.ai/blog/cursor-composer-2-review-benchmark-2026)
- [Cursor 3 Async Subagents — DataCamp](https://www.datacamp.com/blog/cursor-3)
- [Inline Agent Mode in JetBrains — GitHub Changelog](https://github.blog/changelog/2026-04-24-inline-agent-mode-in-preview-and-more-in-github-copilot-for-jetbrains-ides/)

### Marketplace / Skills
- [Claude Skills Marketplace Guide — KissMySkills](https://kissmyskills.com/blogs/news/claude-skills-marketplace-complete-guide)
- [Agent Skills Marketplace — LobeHub](https://lobehub.com/skills)
- [Awesome Claude Code — GitHub](https://github.com/hesreallyhim/awesome-claude-code)

---

*Report generiert vom masterkurs-weekly-agent am 2026-04-27. 8 Web-Suchen, 0 WebFetch-Calls.*
