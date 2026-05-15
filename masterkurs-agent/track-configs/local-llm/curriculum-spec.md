# Local-LLM Track — Curriculum-Spezifikation

**Status:** Phase 4 Draft (2026-05-15)
**Track key:** `local-llm`
**Total Lektionen:** 40 (12 Beginner / 14 Intermediate / 14 Advanced inkl. 3 Capstones)
**Primärsprache:** Deutsch (DE-native per Locked Decision #5)
**Geschätzte Gesamt-Laufzeit:** ~ 9.5 Stunden aktiver Inhalt (~570 Min Kern-Content, ohne Übungen)
**Launch-Welle:** Phase 4b (per Locked Decision #1: Codex → Local-LLM → Claude-Desktop)
**Reviewer:** Cosmo (solo)

## Authoring-Hinweise
- Diese Spec treibt `masterkurs-lesson-creator --track local-llm`. Jede Lektion hier wird zu einem Lesson-Modul in `claude-code-masterkurs/src/data/lessons-local-llm.ts` nach der Lesson-Creator + Linter Pipeline.
- Versionierung: alle Tool-Referenzen (Ollama, Continue, Aider, Zed, Cline, llama.cpp, MLX) müssen aktuell sein zum Drafting-Zeitpunkt — `tool-version-pins.json` (von B1-Linter) hält diese.
- EU-AI-Act-Belege: nur primary sources (offizieller EU-AI-Act-Text, BfDI-Guidance), keine Sekundärliteratur ohne Verifikation.
- **Cloud-Framing**: Per Locked Decision #4 ist der Tutor-Chat in diesem Track lokal-only. Cloud-Setups dürfen nur als optionaler "Fallback bei guter Verbindung" erscheinen, niemals als Default-Empfehlung.
- **Hardware-Realismus**: Jede Lektion mit Hardware-Bezug muss konkret RAM/VRAM-Floors nennen (siehe `local-llm-tier-catalog.ts`, Tier S/M/L).
- **IDs**: Track-scoped 0–39. In `src/data/lessons-local-llm.ts` werden diese auf `3000–3039` gemappt (gemäß `lesson-style.md` Range).
- **Voraussetzungs-Logik**: Voraussetzungen sind innerhalb dieses Tracks zu lesen ("L3" = Lesson `id: 3` in dieser Spec). Cross-Track-Voraussetzungen werden mit Track-Präfix notiert (z. B. `[claude-code:L0]`).

---

## Level 1 — Beginner (Lessons 0–11)

Ziel: Hardware-Realität verstehen, erste lokale Inferenz hinbekommen, Coding-Agent mit Ollama/Continue auf eigener Maschine zum Laufen bringen. Datenschutz-Vorteile begreifen, Capability-Gaps ehrlich einschätzen.

---

### Lesson 0 — Hardware-Check: RAM, GPU, Apple Silicon vs. x86

- **ID**: 0
- **Level**: 1
- **Title**: Hardware-Check — Was packt deine Maschine wirklich?
- **Lernziele**:
  - Eigene Hardware (RAM, VRAM, Unified Memory, CPU-Cores) korrekt auslesen
  - Apple Silicon (M1–M4) vs. x86+NVIDIA-GPU-Setup einordnen
  - Tier-S/M/L-Klassifikation des Tracks auf eigene Maschine anwenden
  - Realistisch entscheiden, ob lokale Inferenz für dich Sinn ergibt
- **Voraussetzungen**: keine
- **Length target**: 15 min
- **Inhalt im Kern**: Hands-on Hardware-Audit (`system_profiler` auf macOS, `nvidia-smi` + `free -h` auf Linux, `dxdiag` auf Windows). Tier-Tabelle (S=16GB / M=24GB+GPU / L=32GB+12GB-VRAM) auf eigene Werte mappen.
- **Code-/Demo-Anteil**: mixed (Shell-Befehle + Tier-Decision-Tree)
- **SRS-Card-Themes**:
  - Wie liest du Unified Memory auf Apple Silicon aus?
  - Was bedeutet Tier-M konkret (RAM + GPU + tok/s)?
  - Welcher Befehl zeigt verfügbares VRAM auf Linux?
  - Warum ist RAM-Bandbreite oft wichtiger als reine Größe?
  - x86-System ohne dedizierte GPU — welches Tier?

---

### Lesson 1 — Erste Schritte mit Ollama

- **ID**: 1
- **Level**: 1
- **Title**: Ollama installieren und das erste Modell ziehen
- **Lernziele**:
  - Ollama auf macOS, Linux und Windows installieren
  - `ollama pull`, `ollama run`, `ollama list`, `ollama rm` flüssig anwenden
  - `~/.ollama/models/` als Storage-Pfad verstehen und auf externe SSD verschieben
  - Erste REPL-Konversation mit `qwen2.5-coder:3b` führen
- **Voraussetzungen**: L0
- **Length target**: 10 min
- **Inhalt im Kern**: Install-Pfade pro OS, Daemon vs. CLI, Modell-Storage. Ein erstes „Hello World" mit qwen2.5-coder:3b im Terminal.
- **Code-/Demo-Anteil**: heavy code (Shell-Befehle)
- **SRS-Card-Themes**:
  - Wo speichert Ollama Modelle by default?
  - Welcher Befehl startet den Ollama-Daemon manuell?
  - Wie verschiebst du den Modell-Cache auf eine externe SSD?
  - `ollama run` vs. `ollama serve` — Unterschied?
  - Wie löschst du ein Modell sauber?

---

### Lesson 2 — Modell-Auswahl: qwen2.5-coder vs llama vs mistral

- **ID**: 2
- **Level**: 1
- **Title**: Modell-Zoo verstehen — Coder-Spezialisten vs. General-Purpose
- **Lernziele**:
  - Unterschied Coder-spezialisiertes Modell (qwen2.5-coder, deepseek-coder) vs. general (llama3.x, mistral) erkennen
  - Modell-Größen 3B / 7B / 14B / 32B den RAM-/VRAM-Anforderungen zuordnen
  - Quantisierungs-Suffixe (Q4_K_M, Q8_0) als ersten Daumenwert lesen
  - Eine begründete Erst-Wahl für die eigene Hardware treffen
- **Voraussetzungen**: L0, L1
- **Length target**: 15 min
- **Inhalt im Kern**: Vergleichstabelle qwen2.5-coder:7b vs. llama3.2:8b vs. mistral:7b — On-Disk-Größe, RAM-Bedarf, Stärken bei Coding-Tasks. Klare Empfehlung pro Tier.
- **Code-/Demo-Anteil**: mixed (Pull-Befehle + Vergleichstabelle)
- **SRS-Card-Themes**:
  - Welches Modell ist für Tier-S (16 GB RAM) die sinnvolle Erst-Wahl?
  - Warum schlägt ein 7B-Coder-Modell oft ein 8B-General-Purpose-Modell bei Code-Tasks?
  - Was sagt das `Q4_K_M`-Suffix grob aus?
  - Welche Modell-Familie wird in diesem Track als Default genutzt?
  - Wann lohnt sich ein 14B-Modell vs. 7B?

---

### Lesson 3 — LM Studio als GUI-Alternative

- **ID**: 3
- **Level**: 1
- **Title**: LM Studio — GUI-First für Modell-Discovery und Chat
- **Lernziele**:
  - LM Studio installieren und einen ersten Coder-Workflow im GUI fahren
  - Built-in HF-Browser nutzen, um Modelle nach Größe/Quantisierung zu filtern
  - LM-Studio-Server-Mode (OpenAI-kompatibel) auf Port 1234 starten
  - Wann GUI (LM Studio) vs. CLI (Ollama) — pragmatische Entscheidung
- **Voraussetzungen**: L1, L2
- **Length target**: 10 min
- **Inhalt im Kern**: GUI-Tour, Modell-Download via Built-in-Browser, OpenAI-kompatibler Server. Ehrlicher Vergleich zu Ollama (LM Studio: GUI-Komfort + besseres Discovery; Ollama: scriptbar + leichter).
- **Code-/Demo-Anteil**: mixed (GUI-Screenshots + curl-Beispiel gegen LM-Studio-Server)
- **SRS-Card-Themes**:
  - Auf welchem Port läuft der LM-Studio-Server standardmäßig?
  - Welches API-Format spricht der LM-Studio-Server?
  - Welcher Vorteil von LM Studio gegenüber Ollama-CLI für Einsteiger?
  - Wo findest du im GUI die Quantisierungs-Optionen?

---

### Lesson 4 — Erste Code-Completion mit Continue

- **ID**: 4
- **Level**: 1
- **Title**: Continue.dev in VS Code — lokaler Copilot in 10 Minuten
- **Lernziele**:
  - Continue-Extension in VS Code installieren und mit Ollama verbinden
  - `config.json` korrekt füllen (model, apiBase, contextLength)
  - Tab-Autocomplete und Chat-Panel im Editor benutzen
  - Tab vs. Chat-Modus situativ wählen
- **Voraussetzungen**: L1, L2
- **Length target**: 15 min
- **Inhalt im Kern**: Continue-Setup mit qwen2.5-coder:7b als Chat-Modell und qwen2.5-coder:1.5b als Autocomplete-Modell. Erste Live-Completion in einer JS-Datei.
- **Code-/Demo-Anteil**: heavy code (config.json + Demo-Snippets)
- **SRS-Card-Themes**:
  - Welchen Pfad hat Continues `config.json`?
  - Welches Modell empfiehlt sich für Tab-Autocomplete vs. Chat?
  - Was bedeutet `apiBase: http://localhost:11434` in der Config?
  - Welcher Shortcut öffnet das Continue-Chat-Panel?
  - Warum trennt Continue Autocomplete und Chat in zwei Models?

---

### Lesson 5 — Aider Basics: Repo-Map, /add, /diff

- **ID**: 5
- **Level**: 1
- **Title**: Aider — der CLI-Coding-Agent mit Repo-Bewusstsein
- **Lernziele**:
  - Aider installieren und mit Ollama-Backend starten (`aider --model ollama/qwen2.5-coder:7b`)
  - `/add`, `/drop`, `/diff`, `/undo`, `/run` flüssig benutzen
  - Repo-Map verstehen — wie Aider Kontext priorisiert
  - Ersten Single-File-Edit erfolgreich committen
- **Voraussetzungen**: L1, L2
- **Length target**: 15 min
- **Inhalt im Kern**: Aider als Git-zentrierter Agent. Repo-Map automatisch generiert, manuelle Datei-Kontrolle über `/add`. Live-Demo: kleine Bug-Fix-Aufgabe in einem Beispiel-Repo.
- **Code-/Demo-Anteil**: heavy code (CLI-Session-Transcript)
- **SRS-Card-Themes**:
  - Wie startest du Aider mit einem lokalen Ollama-Modell?
  - Was macht `/add path/to/file.ts`?
  - Wie nimmst du den letzten Aider-Commit zurück?
  - Was ist die Repo-Map und wozu dient sie?
  - Warum erzeugt Aider automatisch Git-Commits?

---

### Lesson 6 — Zed Setup für lokale LLMs

- **ID**: 6
- **Level**: 1
- **Title**: Zed Editor mit Ollama — Assistant Panel offline
- **Lernziele**:
  - Zed installieren und Assistant Panel mit Ollama als Provider konfigurieren
  - `settings.json` von Zed (`language_models.ollama`) korrekt befüllen
  - Inline-Assist (`cmd-enter`) und Assistant Panel (`cmd-?`) unterscheiden
  - Workflow für kurze Refactors im Editor etablieren
- **Voraussetzungen**: L1, L2
- **Length target**: 10 min
- **Inhalt im Kern**: Zed als Alternative zu VS Code, mit nativem Multi-Provider-Support inkl. Ollama. Setup, erste Inline-Edits.
- **Code-/Demo-Anteil**: mixed (settings.json + Demo)
- **SRS-Card-Themes**:
  - Wo trägst du in Zed das Ollama-Default-Modell ein?
  - Was macht `cmd-enter` im Zed-Editor?
  - Wie zeigt Zed an, dass das Modell lokal antwortet?
  - Welche Vorteile hat Zed gegenüber VS Code + Continue?

---

### Lesson 7 — Cline (vormals Claude Dev) im Local-LLM-Modus

- **ID**: 7
- **Level**: 1
- **Title**: Cline mit Ollama — Agentic Workflow ohne Cloud
- **Lernziele**:
  - Cline-Extension in VS Code installieren und auf Ollama umstellen
  - Approval-Flow für File-Edits und Bash-Befehle verstehen
  - Erste agentische Multi-Step-Task lokal laufen lassen
  - Wann Cline (agentisch) statt Continue (assistiv)?
- **Voraussetzungen**: L1, L2, L4
- **Length target**: 15 min
- **Inhalt im Kern**: Cline ist ein Agentic-Workflow-Tool. Mit qwen2.5-coder:14b lokal nutzbar. Demo: kleine Feature-Implementierung mit Approval-Loop.
- **Code-/Demo-Anteil**: heavy code (Live-Session-Mitschnitt)
- **SRS-Card-Themes**:
  - Welches Modell-Minimum empfiehlt sich für Cline lokal?
  - Was ist der Approval-Flow und warum ist er bei lokalen Modellen wichtig?
  - Wie unterscheidet sich Cline pragmatisch von Continue?
  - Welche Tools hat Cline by default (Bash, Edit, Browser)?

---

### Lesson 8 — Datei-Operationen: Lesen + kleine Edits via lokalem Modell

- **ID**: 8
- **Level**: 1
- **Title**: Praxis-Pattern: kleines Refactor in einer einzigen Datei
- **Lernziele**:
  - Mit Aider oder Continue eine konkrete Datei lesen, eine Funktion umbenennen, Tests anpassen
  - Diff vor Commit prüfen
  - Token-Budget bei einem einzelnen File-Edit grob abschätzen
  - Halluzinationen erkennen und mit `/undo` korrigieren
- **Voraussetzungen**: L4 oder L5
- **Length target**: 15 min
- **Inhalt im Kern**: End-to-End-Mini-Übung: nimm ein Demo-Repo, refactor eine Funktion, lass Tests laufen, commit. Fokus auf den Loop, nicht auf das spezifische Tool.
- **Code-/Demo-Anteil**: heavy code (Schritt-für-Schritt Transcript)
- **SRS-Card-Themes**:
  - Welche Reihenfolge bei einem sicheren lokalen Refactor?
  - Wann ist ein File zu groß für ein 7B-Modell mit 8k-Context?
  - Wie erkennst du eine Halluzination in einem Diff?
  - Warum ist `git status` vor jedem Agent-Run wichtig?

---

### Lesson 9 — Token-Budget bei lokaler Inferenz (Context-Window-Limits)

- **ID**: 9
- **Level**: 1
- **Title**: Context-Window-Limits — warum 8k schnell zu wenig ist
- **Lernziele**:
  - Default-Context-Window von qwen2.5-coder, llama3.x, mistral kennen
  - Den Trade-off „großer Context vs. RAM-Verbrauch" verstehen
  - Ollama `num_ctx` in Modelfile/Param erhöhen (und Kosten verstehen)
  - Strategien für lange Codebases (Repo-Map, RAG, manuelle File-Auswahl)
- **Voraussetzungen**: L1, L2
- **Length target**: 15 min
- **Inhalt im Kern**: Tokenization Demo, Context-Window-Default vs. -Max, Speicher-Mehrverbrauch bei `num_ctx=32k`. Vorgeschmack auf RAG (kommt in L12).
- **Code-/Demo-Anteil**: mixed (Tokenizer-Demo + Modelfile-Snippet)
- **SRS-Card-Themes**:
  - Was ist der Default `num_ctx` in Ollama?
  - Wie viel zusätzlichen RAM kostet eine Verdoppelung des Contexts grob?
  - Was passiert, wenn der Prompt das Context-Window überschreitet?
  - Welche Strategie bei einer 50k-Token-Codebase?

---

### Lesson 10 — Datenschutz-Vorteile: kein Token-Stream nach OpenAI/Anthropic

- **ID**: 10
- **Level**: 1
- **Title**: Was bleibt lokal — und was eben doch nicht
- **Lernziele**:
  - Datenfluss bei lokaler Inferenz verstehen (Prompt → Daemon → Modell → Response, alles auf eigener Maschine)
  - Telemetrie-Punkte erkennen (Modell-Downloads von HF-Hub, IDE-Telemetrie, Auto-Updates)
  - Privacy-Setup-Checkliste: Telemetrie aus, Auto-Update aus, HF-Cache prüfen
  - Argumentation gegenüber Mandant/Vorgesetztem vorbereiten
- **Voraussetzungen**: L1
- **Length target**: 10 min
- **Inhalt im Kern**: Privacy-Realität ohne Hype. Was läuft wirklich lokal, was nicht. Aufbauen einer ehrlichen Privacy-Story.
- **Code-/Demo-Anteil**: konzeptuell (mit kleinen Config-Snippets)
- **SRS-Card-Themes**:
  - Wo lädt Ollama Modelle herunter und wann?
  - Welche Telemetrie sendet VS Code by default?
  - Was bedeutet „Inferenz lokal" konkret für den Daten-Flow?
  - Welche 3 Schritte gehören in eine Local-LLM-Privacy-Checkliste?

---

### Lesson 11 — Wann lokal NICHT reicht (ehrliche Capability-Gaps)

- **ID**: 11
- **Level**: 1
- **Title**: Capability-Gaps — wann ein 7B-Modell an die Wand fährt
- **Lernziele**:
  - Klassen von Tasks erkennen, bei denen lokale 7B/14B-Modelle scheitern (komplexe Architektur-Planung, Multi-File-Refactors über >10 Dateien, lange Reasoning-Ketten)
  - Diese Gaps ehrlich an Mandant/Team kommunizieren
  - Wissen, wo „kleines Modell + gute Pipeline" trotzdem reicht
  - Vorbereitung auf Hybrid-Setups in Level 2 (L25)
- **Voraussetzungen**: L0–L10
- **Length target**: 10 min
- **Inhalt im Kern**: Anti-Hype-Lektion. Drei reale Case-Studies, in denen lokale Modelle scheitern. Übergang zu „wir bauen ein realistisches Setup, nicht ein Magie-Setup".
- **Code-/Demo-Anteil**: konzeptuell
- **SRS-Card-Themes**:
  - Drei Task-Klassen, bei denen ein 7B lokal scheitert
  - Wann ist Cloud trotz Compliance unausweichlich?
  - Wie kommunizierst du Capability-Gaps an einen Mandanten?
  - Wo ist ein 14B lokal bereits „good enough"?

---

## Level 2 — Intermediate (Lessons 12–25)

Ziel: Lokales RAG, MCP-Setups, ehrliches Hybrid-Verständnis, Performance-Tuning. Vergleichsblick auf gleiche Tasks lokal vs. Cloud. Anbindung an den Masterkurs-Tutor-Layer.

---

### Lesson 12 — RAG-Pipeline lokal: Embeddings + Chroma/LanceDB

- **ID**: 12
- **Level**: 2
- **Title**: Lokales RAG — Embeddings, Vektor-Store, Retrieval ohne Cloud
- **Lernziele**:
  - Local-Embedding-Modelle (`nomic-embed-text`, `bge-small-en`) via Ollama nutzen
  - Chroma oder LanceDB lokal aufsetzen und ein kleines Repo indexieren
  - End-to-End-Query: Embed → Top-K-Retrieve → Prompt-Augmentation
  - Embedding-Storage-Kosten und -Latenzen einschätzen
- **Voraussetzungen**: L1, L9
- **Length target**: 20 min
- **Inhalt im Kern**: Vollständiger lokaler RAG-Loop für ein eigenes Doku-Repo. Python-Code, Chroma als Default (LanceDB als Alternative für TS-Stack).
- **Code-/Demo-Anteil**: heavy code (Python + Chroma + Ollama)
- **SRS-Card-Themes**:
  - Welches Ollama-Embedding-Modell ist der Default?
  - Was speichert Chroma genau (Vector + Metadata + Source)?
  - Wie viel Storage kostet 1000 Markdown-Dateien grob?
  - Was ist Top-K-Retrieve und welche Werte sind typisch?
  - Wie validierst du die Retrieval-Qualität ohne Eval-Framework?

---

### Lesson 13 — MCP-Server lokal hosten

- **ID**: 13
- **Level**: 2
- **Title**: MCP lokal — Filesystem-MCP + Memory-MCP via Stdio
- **Lernziele**:
  - MCP-Konzept verstehen (Server stellt Tools, Client ruft sie auf)
  - Offizielle Reference-MCP-Server installieren (filesystem, memory, sqlite)
  - MCP-Server-Config in Continue/Cline einbinden
  - Erste agentische Tool-Calls (z. B. „liste Files in src/")
- **Voraussetzungen**: L4 oder L7
- **Length target**: 15 min
- **Inhalt im Kern**: MCP-Reference-Server (`@modelcontextprotocol/servers`) lokal. Stdio-Transport. Tool-Call-Demo. Hinweis: nicht jedes lokale Modell ist gut im Tool-Calling — qwen2.5-coder ist solide ab 7B.
- **Code-/Demo-Anteil**: heavy code (npx + JSON-Config)
- **SRS-Card-Themes**:
  - Was ist der Unterschied zwischen MCP-Server und MCP-Client?
  - Welcher Transport ist der Default für lokale MCP-Server?
  - Welches Modell-Minimum für brauchbares Tool-Calling lokal?
  - Wie debuggst du, wenn das Modell den Tool-Call nicht erzeugt?

---

### Lesson 14 — Continue Advanced: Slash-Commands, Custom-Models

- **ID**: 14
- **Level**: 2
- **Title**: Continue Power-User — Slash-Commands und Multi-Model-Config
- **Lernziele**:
  - Eigene Slash-Commands in `~/.continue/config.json` definieren
  - Multi-Model-Setup (Chat + Autocomplete + Edit unterschiedlich)
  - `customCommands` mit Prompt-Templates schreiben
  - Continue-Telemetrie deaktivieren
- **Voraussetzungen**: L4
- **Length target**: 15 min
- **Inhalt im Kern**: Continue über das Basis-Setup hinaus. Eigene `/test`, `/explain`, `/review`-Commands; Edit-Modell separat konfigurieren.
- **Code-/Demo-Anteil**: heavy code (config.json-Beispiele)
- **SRS-Card-Themes**:
  - Wo lebt die globale Continue-Config?
  - Wie definierst du einen Custom-Slash-Command?
  - Welche drei Model-Rollen kennt Continue?
  - Wie deaktivierst du Telemetrie sauber?

---

### Lesson 15 — Aider Multi-File-Refactors

- **ID**: 15
- **Level**: 2
- **Title**: Aider für mehrteilige Refactors — `/add` Strategien
- **Lernziele**:
  - Mehrere Files koordiniert via `/add` in den Kontext bringen
  - `--map-tokens` und `--map-refresh` situativ nutzen
  - Tests-Driven-Workflow mit Aider (`/run pytest`)
  - Failure-Modes: zu viel Kontext, falsche Datei-Auswahl
- **Voraussetzungen**: L5
- **Length target**: 15 min
- **Inhalt im Kern**: Realistisches Refactor über 4–6 Dateien. Wie Aider die Repo-Map nutzt, wann sie sabotiert, wann manuelle `/add` schlägt.
- **Code-/Demo-Anteil**: heavy code (Session-Transcript + Diff-Snippets)
- **SRS-Card-Themes**:
  - Wann manuelles `/add` vs. Repo-Map vertrauen?
  - Was bedeutet `--map-tokens 1024`?
  - Wie führst du Tests innerhalb der Aider-Session aus?
  - Wann ist ein Refactor zu groß für ein lokales Modell?

---

### Lesson 16 — Zed Workspaces für Mehr-Repo-Setups

- **ID**: 16
- **Level**: 2
- **Title**: Zed Workspaces — mehrere Repos im selben Assistant-Kontext
- **Lernziele**:
  - Zed-Workspaces mit mehreren Root-Foldern aufsetzen
  - Per-Worktree LLM-Konfiguration (verschiedene Modelle pro Repo)
  - Channels-Feature für lokale Live-Sharing-Szenarien
  - Workspace-Settings vs. Global-Settings sauber trennen
- **Voraussetzungen**: L6
- **Length target**: 10 min
- **Inhalt im Kern**: Zeds Workspaces im Real-Setup. Mehrere Repos, projekt-spezifische Models. Beispiel: Frontend-Repo nutzt 7B, Backend-Repo nutzt 14B.
- **Code-/Demo-Anteil**: mixed (settings.json + Screenshots)
- **SRS-Card-Themes**:
  - Wo trägst du workspace-spezifische LLM-Settings ein?
  - Was ist der Unterschied zwischen Project- und User-Settings in Zed?
  - Wann lohnt sich ein Multi-Root-Workspace?

---

### Lesson 17 — Cline mit lokalen Tools (Bash, Edit)

- **ID**: 17
- **Level**: 2
- **Title**: Cline + lokale Bash/Edit-Tools — Approval-Discipline
- **Lernziele**:
  - Cline-Tool-Liste verstehen (Bash, Edit, Read, Browser)
  - Approval-Strategie für riskante Bash-Befehle entwickeln
  - Auto-Approve-Liste pflegen (nur was wirklich safe ist)
  - Failure-Recovery: was tun, wenn der Agent eine Datei kaputt-edited
- **Voraussetzungen**: L7
- **Length target**: 15 min
- **Inhalt im Kern**: Risk-Aware Agentic-Workflow. Cline ist mächtig, aber lokale Modelle sind weniger zuverlässig im Tool-Calling als Cloud-Modelle — Approval-Discipline wichtiger.
- **Code-/Demo-Anteil**: mixed (Cline-Settings + Live-Approval-Beispiele)
- **SRS-Card-Themes**:
  - Welche Cline-Tools sollten NIE auto-approved sein?
  - Was ist die sicherste Auto-Approve-Liste für Read-Only-Workflows?
  - Wie machst du einen Cline-Edit rückgängig?
  - Warum ist Approval-Discipline bei lokalen Modellen besonders wichtig?

---

### Lesson 18 — Modell-Routing nach Task-Typ

- **ID**: 18
- **Level**: 2
- **Title**: Routing-Pattern — klein für Autocomplete, groß für Planning
- **Lernziele**:
  - Drei-Tier-Routing mental modellieren (Autocomplete < Edit < Planning)
  - Per Tool/Per Slash-Command unterschiedliche Modelle ansprechen
  - Trade-off Latenz vs. Qualität bewusst einsetzen
  - Erste eigene Routing-Heuristiken aufschreiben
- **Voraussetzungen**: L4, L14
- **Length target**: 15 min
- **Inhalt im Kern**: Routing-Konzept ohne Service-Architektur (das kommt in L31). Hier nur: pro Aktion das richtige Modell. Praxisbeispiele.
- **Code-/Demo-Anteil**: mixed (Config + Decision-Tree)
- **SRS-Card-Themes**:
  - Welche drei Routing-Tiers ergeben Sinn?
  - Warum nicht alles vom größten Modell machen lassen?
  - Welches Modell für Autocomplete (Latenz-kritisch)?
  - Wie sieht eine Routing-Heuristik in 3 Zeilen aus?

---

### Lesson 19 — Performance-Tuning: GGUF-Quants Q4 vs Q6 vs Q8

- **ID**: 19
- **Level**: 2
- **Title**: Quantisierung verstehen — Q4_K_M, Q5_K_M, Q6_K, Q8_0 im Vergleich
- **Lernziele**:
  - Quantisierungs-Schema lesen (Bits per Weight, K-Quants)
  - Trade-off Qualität vs. Speed vs. RAM auf eigener Hardware messen
  - Q4_K_M als Standard-Tradeoff begründen
  - Wann lohnt sich Q8_0 (selten: nur wenn RAM da ist und Qualität kritisch)
- **Voraussetzungen**: L1, L2
- **Length target**: 15 min
- **Inhalt im Kern**: Klein-Benchmark auf eigener Maschine: dasselbe qwen2.5-coder:7b in Q4_K_M, Q5_K_M, Q8_0. tok/s + Output-Qualität vergleichen.
- **Code-/Demo-Anteil**: heavy code (Benchmark-Skript + Tabelle)
- **SRS-Card-Themes**:
  - Was bedeutet das `K_M`-Suffix bei Quantisierungen?
  - RAM-Bedarf Q4 vs. Q8 — wie viel Unterschied?
  - Warum ist Q4_K_M der Standard-Sweet-Spot?
  - Wann fällst du auf Q3 oder Q2 zurück?

---

### Lesson 20 — Inferenz-Backends: llama.cpp vs Ollama vs LM Studio vs MLX

- **ID**: 20
- **Level**: 2
- **Title**: Backend-Vergleich — vier Engines, vier Sweet-Spots
- **Lernziele**:
  - Architektur-Unterschiede llama.cpp / Ollama / LM Studio / MLX verstehen
  - Performance-Unterschiede auf Apple Silicon (MLX) vs. CUDA (llama.cpp + CUDA-Build)
  - Welches Backend für welchen Use-Case
  - Ehrliche Empfehlung: Ollama als Default, MLX/llama.cpp wenn du tunen willst
- **Voraussetzungen**: L1, L3, L19
- **Length target**: 15 min
- **Inhalt im Kern**: Backend-Landschafts-Tour mit Performance-Tabellen aus Community-Benchmarks. Klare Defaults für Einsteiger und klare Upgrade-Pfade.
- **Code-/Demo-Anteil**: mixed (Befehle pro Backend + Benchmark-Tabelle)
- **SRS-Card-Themes**:
  - Auf welchem Backend basiert Ollama intern?
  - Warum ist MLX auf Apple Silicon oft schneller als Ollama?
  - Welches Backend für persistenten Server-Use?
  - Wann llama.cpp direkt nutzen vs. Ollama?

---

### Lesson 21 — VS Code mit Continue: Custom-Workflows

- **ID**: 21
- **Level**: 2
- **Title**: Eigener Workflow — Continue + lokales RAG + Custom-Slash-Commands
- **Lernziele**:
  - Eigenen `/refactor`-Slash-Command schreiben, der Context aus RAG nachzieht
  - `contextProviders` in Continue verstehen (open files, codebase, terminal)
  - Workflow für „Bug-Hunt in unbekanntem Repo" zusammenbauen
  - Eigenen kleinen Continue-Workflow committen und teilen
- **Voraussetzungen**: L12, L14
- **Length target**: 20 min
- **Inhalt im Kern**: Continue + lokales Chroma. End-to-End-Workflow: `/refactor` zieht Top-5 ähnliche Funktionen aus dem Repo nach.
- **Code-/Demo-Anteil**: heavy code (config + Demo)
- **SRS-Card-Themes**:
  - Was sind contextProviders in Continue?
  - Wie schließt du RAG-Retrieval in einen Slash-Command ein?
  - Welche Provider-Auswahl ist für Code-Refactors sinnvoll?

---

### Lesson 22 — Logging + Telemetrie lokal (Debugging, nicht Vendor)

- **ID**: 22
- **Level**: 2
- **Title**: Debug-Logs schreiben — lokal, ohne Datenleck
- **Lernziele**:
  - Ollama-Daemon-Logs lesen (`journalctl`, `~/.ollama/logs/`, macOS-Konsole)
  - Latenz-Messung pro Request einbauen (eigenes kleines Python-Skript)
  - Logging vom Modell-Output trennen (Prompt darf nicht in jedes Log)
  - Privacy-Boundary: was darf geloggt werden, was nicht
- **Voraussetzungen**: L1
- **Length target**: 10 min
- **Inhalt im Kern**: Debugging ohne Vendor-Telemetrie. Eigene Latency-Counters bauen. Klare Privacy-Boundary (z. B. Hash statt Prompt, Token-Count statt Content).
- **Code-/Demo-Anteil**: heavy code (Logger + Demo)
- **SRS-Card-Themes**:
  - Wo liegen Ollama-Logs auf macOS?
  - Was darf NIE in einem lokalen Log stehen (auch nicht zum Debuggen)?
  - Wie misst du time-to-first-token sauber?
  - Welche drei Metriken sind genug, um eine lokale Inferenz zu debuggen?

---

### Lesson 23 — Vergleich: gleicher Task lokal vs. Cloud (ehrlich)

- **ID**: 23
- **Level**: 2
- **Title**: Side-by-Side — qwen2.5-coder:14b vs. Sonnet 4.6 am gleichen Task
- **Lernziele**:
  - Identischen Coding-Task in lokal + Cloud durchführen
  - Output-Unterschiede objektiv dokumentieren (richtig/falsch, Latenz, Token-Count)
  - Ehrliche Aussage formulieren: wo schlägt lokal, wo Cloud
  - Vorbereiten der Hybrid-Entscheidung in L24
- **Voraussetzungen**: L11, L19
- **Length target**: 20 min
- **Inhalt im Kern**: Kein „lokal gewinnt immer"-Märchen. Drei reale Tasks (Bug-Fix, Multi-File-Refactor, Architektur-Review). Side-by-Side dokumentiert.
- **Code-/Demo-Anteil**: heavy code (Task-Transcripts + Auswertungstabelle)
- **SRS-Card-Themes**:
  - Bei welchem Task-Typ ist lokal heute (2026) Cloud-equivalent?
  - Wo ist Cloud (Sonnet 4.6) klar überlegen?
  - Wie misst du „qualitativen Vorsprung" objektiv?
  - Welche Latenz erwartest du lokal vs. Cloud auf Tier-M?

---

### Lesson 24 — Hybrid-Setups: Plan-first lokal, Execute mit Cloud-LLM

- **ID**: 24
- **Level**: 2
- **Title**: Hybrid-Pattern — Plan lokal, Execute via Cloud (oder umgekehrt)
- **Lernziele**:
  - Zwei Hybrid-Patterns kennen: „Plan lokal, Execute Cloud" und „Execute lokal, Critic Cloud"
  - Wann welches Pattern (Compliance-Constraint vs. Speed vs. Cost)
  - Cloud als optionalen Fallback einbauen, ohne Defaults zu kippen
  - Privacy-Implikationen pro Pattern dokumentieren
- **Voraussetzungen**: L23
- **Length target**: 15 min
- **Inhalt im Kern**: Hybrid ist ok, aber bewusst. Lokale Seite bleibt Default; Cloud nur, wenn Compliance es zulässt und der Task es rechtfertigt. Klare Pattern-Defs.
- **Code-/Demo-Anteil**: konzeptuell (mit kleinen Routing-Configs)
- **SRS-Card-Themes**:
  - Welche zwei Hybrid-Patterns gibt es?
  - Welche Daten dürfen bei „Plan lokal, Execute Cloud" das Gerät verlassen?
  - Wann ist Hybrid raus (NDA-Projekt)?
  - Wie dokumentierst du die Datenflüsse für deinen Mandanten?

---

### Lesson 25 — Lokaler Tutor-Layer (Masterkurs-Tutor-Chat Anbindung)

- **ID**: 25
- **Level**: 2
- **Title**: Eigener Tutor-Chat — den Masterkurs-Tutor-Layer lokal anbinden
- **Lernziele**:
  - Browser-Side-Bridge-Pattern verstehen, das der Masterkurs für Local-LLM nutzt
  - Eigenen Ollama-Daemon CORS-tauglich machen (`OLLAMA_ORIGINS`)
  - Onboarding-Wizard nachbauen (Pre-Session-Probe: Hardware + Modell-Pull + Benchmark)
  - Den Pattern auf eigene App übertragen (z. B. interne Doku-KI)
- **Voraussetzungen**: L1, L13, L18
- **Length target**: 20 min
- **Inhalt im Kern**: Meta-Lektion. Der Masterkurs-Tutor-Chat selbst läuft auf der lokalen User-Hardware via Browser-Bridge. Diese Lektion zeigt, wie das implementiert ist und wie du dasselbe Pattern für eigene Apps nutzt.
- **Code-/Demo-Anteil**: heavy code (CORS-Setup + Client-Snippet)
- **SRS-Card-Themes**:
  - Was macht `OLLAMA_ORIGINS` konkret?
  - Warum braucht der Tutor-Chat eine Browser-Bridge statt Server-Call?
  - Welche drei Probes laufen im Onboarding-Wizard?
  - Wie persistierst du `OLLAMA_ORIGINS` auf macOS dauerhaft?

---

## Level 3 — Advanced (Lessons 26–39, inkl. 3 Capstones)

Ziel: MLX-direct, Fine-Tuning, Eval, Production-Setups, EU-AI-Act + DSGVO-Compliance, drei Capstones, die alles bündeln.

---

### Lesson 26 — MLX-direct auf Apple Silicon

- **ID**: 26
- **Level**: 3
- **Title**: MLX-direct — Apple-Silicon-Inferenz ohne Ollama-Overhead
- **Lernziele**:
  - `mlx-lm` installieren und ein 7B-Modell direkt laden
  - Performance-Unterschied zu Ollama auf eigener Maschine messen
  - `mlx_lm.server` als OpenAI-kompatibles Backend für Continue/Aider
  - Quantisierungs-Optionen unter MLX (4-bit, 8-bit) verstehen
- **Voraussetzungen**: L20
- **Length target**: 20 min
- **Inhalt im Kern**: MLX-Setup, Modell-Load, Server-Mode, Performance-Comparison. Realistische Erwartung: 20–40% mehr tok/s als Ollama auf Apple Silicon (community benchmarks).
- **Code-/Demo-Anteil**: heavy code (Install + Benchmark)
- **SRS-Card-Themes**:
  - Wie installierst du `mlx-lm`?
  - Welcher Befehl startet den MLX-OpenAI-kompatiblen Server?
  - Welche tok/s-Bandbreite ist auf M3 Max realistisch für qwen2.5-coder:14b?
  - Wann lohnt sich MLX vs. Ollama in der Praxis?

---

### Lesson 27 — Fine-Tuning Basics: LoRA-Adapter für Code-Style

- **ID**: 27
- **Level**: 3
- **Title**: LoRA-Adapter — Code-Style angleichen ohne Full-Fine-Tune
- **Lernziele**:
  - LoRA-Konzept verstehen (Low-Rank-Adapter statt voller Re-Train)
  - `unsloth` oder `mlx-lm.lora` als Trainings-Stack lokal nutzen
  - Mini-Dataset (50–200 Beispiele) im richtigen Format erstellen
  - Adapter laden + entladen ohne das Base-Modell zu touchen
- **Voraussetzungen**: L26 oder L20
- **Length target**: 20 min
- **Inhalt im Kern**: LoRA-Theorie minimal, Praxis-Tutorial maximal. Adapter trainiert auf 100 Code-Style-Pairs, Eval vor/nach. RAM-Bedarf realistisch nennen.
- **Code-/Demo-Anteil**: heavy code (Trainings-Skript)
- **SRS-Card-Themes**:
  - Warum LoRA statt Full-Fine-Tune?
  - Welche Dataset-Mindestgröße macht überhaupt Sinn?
  - Welches Format erwartet `unsloth`?
  - Wie groß ist ein typischer LoRA-Adapter auf der Festplatte?

---

### Lesson 28 — Fine-Tuning auf eigenem Repo-Corpus

- **ID**: 28
- **Level**: 3
- **Title**: Domain-Adaption — eigenes Repo als Trainings-Corpus
- **Lernziele**:
  - Repo-Corpus extrahieren und in Instruction-Format transformieren
  - Train/Eval-Split sauber machen (per-Feature, nicht random)
  - Overfitting erkennen (Eval-Loss vs. Train-Loss)
  - Adapter-Versioning + Roll-Back-Strategie
- **Voraussetzungen**: L27
- **Length target**: 20 min
- **Inhalt im Kern**: Praktisches Domain-Adaption-Setup. Die häufigste echte Local-LLM-Anwendung außerhalb von Hobby-Setups: Code-Style einer firmeneigenen Codebase angleichen.
- **Code-/Demo-Anteil**: heavy code (Dataset-Builder + Training-Run)
- **SRS-Card-Themes**:
  - Wie verhinderst du Test-Set-Contamination beim Repo-Split?
  - Welche Signal-Linien zeigen Overfitting?
  - Wie versionierst du Adapter sauber?
  - Wann lohnt sich Fine-Tuning überhaupt vs. RAG?

---

### Lesson 29 — Eval-Frameworks lokal

- **ID**: 29
- **Level**: 3
- **Title**: HumanEval, MBPP + eigene Benchmarks lokal
- **Lernziele**:
  - HumanEval und MBPP lokal laufen lassen
  - Eigene kleine Eval-Suite bauen (10–20 Tasks aus eigenem Workflow)
  - Eval-Score-Drift über Modell-Versionen tracken
  - Eval als Voraussetzung für jeden Modell-Wechsel etablieren
- **Voraussetzungen**: L19, L20
- **Length target**: 20 min
- **Inhalt im Kern**: Eval ist die Disziplin, die zwischen Hobbyist und Profi trennt. Praxis: HumanEval auf qwen2.5-coder:7b laufen lassen, dann eigene 10-Task-Suite bauen.
- **Code-/Demo-Anteil**: heavy code (Eval-Runner)
- **SRS-Card-Themes**:
  - Was misst HumanEval und was nicht?
  - Warum reicht HumanEval nicht als alleiniger Benchmark?
  - Wie baust du eine eigene 10-Task-Suite?
  - Wie trackst du Score-Drift sauber?

---

### Lesson 30 — Re-Ranking + Hybrid Retrieval (BM25 + Vektor)

- **ID**: 30
- **Level**: 3
- **Title**: RAG advanced — Hybrid Retrieval + lokales Re-Ranking
- **Lernziele**:
  - BM25 + Vektor parallel retrieven und mergen (RRF, Weighted)
  - Cross-Encoder lokal als Re-Ranker einsetzen (`bge-reranker-base`)
  - Retrieval-Qualität messen (Recall@K, MRR)
  - Hybrid vs. Vektor-Only — wann lohnt sich der Mehraufwand
- **Voraussetzungen**: L12
- **Length target**: 20 min
- **Inhalt im Kern**: RAG-V2. Hybrid Retrieval mit Reranker. Praxis-Recall-Verbesserung dokumentieren.
- **Code-/Demo-Anteil**: heavy code (BM25 + Vektor + Reranker-Pipeline)
- **SRS-Card-Themes**:
  - Was macht ein Cross-Encoder-Reranker konkret?
  - Was ist RRF (Reciprocal Rank Fusion)?
  - Wie misst du Recall@10 auf eigenen Queries?
  - Wann ist BM25 lokal stark genug ohne Vektor?

---

### Lesson 31 — Modell-Routing als Service (Gateway-Pattern lokal)

- **ID**: 31
- **Level**: 3
- **Title**: Gateway-Pattern — lokaler Inferenz-Router als Service
- **Lernziele**:
  - Eigenes kleines Gateway in Python/Node bauen, das OpenAI-API-kompatibel routet
  - Regeln: nach Token-Count, nach Task-Typ, nach User
  - Fallback-Chains (Modell A → B bei Timeout) implementieren
  - Logging + Latenz-Metriken ohne Daten-Leak
- **Voraussetzungen**: L18, L22
- **Length target**: 20 min
- **Inhalt im Kern**: Production-Pattern. Ein Gateway pro Team, das Continue/Aider/Cline auf das richtige Modell schickt. ~150 Zeilen Code als Vorlage.
- **Code-/Demo-Anteil**: heavy code (FastAPI oder Hono Gateway)
- **SRS-Card-Themes**:
  - Welche drei Routing-Inputs sind die häufigsten?
  - Wie implementierst du eine Fallback-Chain ohne Doppel-Cost?
  - Wo liegt die Gateway-Konfiguration sauber (nicht im Code)?
  - Wie machst du das Gateway OpenAI-API-kompatibel?

---

### Lesson 32 — llama.cpp-Server für persistenten Inferenz-Daemon

- **ID**: 32
- **Level**: 3
- **Title**: `llama-server` — persistenter Inferenz-Daemon mit CUDA/Metal
- **Lernziele**:
  - `llama-server` direkt starten (GGUF-Modell, Port, CORS)
  - Build-Optionen (CUDA, Metal, Vulkan) verstehen und korrekt linken
  - Systemd-/Launchd-Service definieren für 24/7-Betrieb
  - Per `--parallel N` mehrere parallele Requests bedienen
- **Voraussetzungen**: L20
- **Length target**: 20 min
- **Inhalt im Kern**: Direkt llama.cpp ohne Ollama-Wrapper. Mehr Control, mehr Parameter, weniger Magie. Für Team-Setups die saubere Basis.
- **Code-/Demo-Anteil**: heavy code (Build-Flags + Systemd-Unit)
- **SRS-Card-Themes**:
  - Welcher Build-Flag aktiviert CUDA?
  - Was macht `--parallel 4` konkret?
  - Wie startest du `llama-server` als Systemd-Service?
  - Welche Endpoints stellt der Server bereit (OpenAI-kompatibel)?

---

### Lesson 33 — vLLM auf eigener GPU

- **ID**: 33
- **Level**: 3
- **Title**: vLLM — High-Throughput-Inferenz für Team-GPU-Setups
- **Lernziele**:
  - vLLM installieren (CUDA-Vorraussetzungen, Python-Env)
  - PagedAttention-Vorteil ggü. llama.cpp verstehen
  - Continuous-Batching für Team-Workloads nutzen
  - Hardware-Empfehlung: ab welcher GPU lohnt sich vLLM (üblich: ≥24 GB VRAM)
- **Voraussetzungen**: L32
- **Length target**: 20 min
- **Inhalt im Kern**: vLLM ist die Throughput-Krone, aber NVIDIA-only und nicht für Single-User. Wann ist es die richtige Wahl?
- **Code-/Demo-Anteil**: heavy code (Install + Server-Start + Bench)
- **SRS-Card-Themes**:
  - Was ist PagedAttention?
  - Welches Hardware-Minimum für vLLM lohnt sich praktisch?
  - vLLM vs. llama.cpp — wo ist welcher Stärker?
  - Welche Modell-Formate akzeptiert vLLM (HF-Format vs. GGUF)?

---

### Lesson 34 — MCP eigene Server bauen

- **ID**: 34
- **Level**: 3
- **Title**: Custom MCP-Server — eigenes DB-Schema als Tool exponieren
- **Lernziele**:
  - MCP-Spec lesen (Tools, Resources, Prompts)
  - Eigenen MCP-Server in Python/Node bauen (z. B. `query_internal_schema`)
  - Stdio- vs. SSE-Transport bewusst wählen
  - Security-Konsiderationen für lokale Tools (Pfad-Whitelisting, Read-Only-Default)
- **Voraussetzungen**: L13
- **Length target**: 20 min
- **Inhalt im Kern**: Echter eigener MCP-Server, der etwas Sinnvolles tut — z. B. internes DB-Schema browsen. Wird in Capstone 3 (L37) wiederverwendet.
- **Code-/Demo-Anteil**: heavy code (Server-Code + Client-Config)
- **SRS-Card-Themes**:
  - Welche drei Capability-Typen kennt MCP?
  - Wie sieht der minimal-funktionale Stdio-Server in Python aus?
  - Welches Security-Default (Read-Only) ist Pflicht?
  - Wie testest du deinen MCP-Server ohne Client?

---

### Lesson 35 — EU AI Act: Risiko-Klassen für Code-Generation

- **ID**: 35
- **Level**: 3
- **Title**: EU AI Act für lokale Coding-LLMs — was wirklich gilt
- **Lernziele**:
  - Risiko-Kategorien des EU AI Act korrekt benennen
  - Status-Quo für Coding-LLMs einordnen (in der Regel: Minimal-/Limited-Risk, je nach Use-Case)
  - GPAI-Pflichten (General-Purpose-AI) für Modell-Anbieter vs. Deployer trennen
  - Eigene Doku-Pflichten als Deployer im KMU-Setting
  - **Wichtig**: nur primary sources zitieren, bei jeder Aussage Quelle nennen
- **Voraussetzungen**: keine (aber L10 hilft kontextuell)
- **Length target**: 20 min
- **Inhalt im Kern**: Faktisch fundierte Übersicht über den EU AI Act. Was ein Solo-Dev oder KMU wirklich beachten muss, wenn er ein lokales Coding-LLM einsetzt. Sekundärliteratur tabu. Bei Unklarheit explizit als „offene Frage" markieren.
- **Code-/Demo-Anteil**: konzeptuell (mit Compliance-Checkliste)
- **SRS-Card-Themes**:
  - Welche 4 Risiko-Klassen kennt der EU AI Act?
  - Bist du als Deployer eines lokalen LLM unter GPAI-Pflichten?
  - Welche Doku-Pflichten triffst du als KMU-Deployer (faktisch belegt)?
  - Wann wird ein lokaler Code-Assistent „High-Risk" (Hypothesen)?

---

### Lesson 36 — DSGVO: lokaler RAG mit PII-Daten

- **ID**: 36
- **Level**: 3
- **Title**: DSGVO + lokales RAG — wenn PII im Corpus liegt
- **Lernziele**:
  - Rechtsgrundlagen für PII-Verarbeitung im RAG-Setup einordnen (Art. 6 DSGVO)
  - Auftragsverarbeitungs-Frage stellen: lokal = keine ADV nötig (BfDI-Guidance prüfen)
  - Retention + Löschpflicht im Vektor-Store implementieren
  - Audit-Trail für RAG-Queries (was/wann/durch wen retrieved)
- **Voraussetzungen**: L12, L30
- **Length target**: 20 min
- **Inhalt im Kern**: DSGVO-realistisch, nicht „Anwalts-Cosplay". Was Deployer mit lokalem RAG auf PII-Daten wirklich tun müssen — und wo der Solo-Dev / das KMU es selbst regeln kann.
- **Code-/Demo-Anteil**: mixed (Lösch-Skript + Audit-Logger)
- **SRS-Card-Themes**:
  - Auf welche Art. 6 DSGVO-Grundlage stützt sich PII-Verarbeitung im internen RAG meist?
  - Wie implementierst du Löschpflicht (Art. 17) in einem Vektor-Store?
  - Welche Audit-Felder solltest du minimal loggen?
  - Wann brauchst du eine DSFA (Art. 35)?

---

### Lesson 37 — Production-Setup: 24/7 Inferenz-Server für Team-Use

- **ID**: 37
- **Level**: 3
- **Title**: Team-Inferenz — `llama-server` oder vLLM als Daily-Driver
- **Lernziele**:
  - Hardware-Auswahl für Team-Inferenz (2–8 User parallel)
  - OS-Service-Setup (systemd, launchd) mit Auto-Restart und Health-Check
  - Monitoring (Prometheus-Exporter, einfaches Dashboard)
  - Backup-/Disaster-Strategie (Modell-Cache, Adapter-Versionen)
- **Voraussetzungen**: L31, L32 oder L33
- **Length target**: 20 min
- **Inhalt im Kern**: Wenn lokales LLM zum Daily-Driver wird. 24/7-Setup, Monitoring, das Routine-Zeug, das Team-Setups unterscheidet von Solo-Setups.
- **Code-/Demo-Anteil**: heavy code (Service-Units + Monitoring-Config)
- **SRS-Card-Themes**:
  - Welche zwei Service-Manager (per OS) sind relevant?
  - Welche drei Health-Check-Endpoints sollte dein Inferenz-Server haben?
  - Was monitort man minimal (4 Metriken)?
  - Welcher Restart-Trigger ist sinnvoll bei OOM?

---

### Lesson 38 — Capstone 1: Lokaler Coding-Tutor

- **ID**: 38
- **Level**: 3
- **Title**: 🏗️ Capstone 1 — Eigener lokaler Coding-Tutor (RAG + Continue)
- **Lernziele**:
  - RAG-Pipeline über persönliche Notes/Doku aufsetzen (L12, L30)
  - Continue mit custom contextProvider für RAG verbinden (L21)
  - End-to-End-Test: Frage stellen → relevante Notes retrieved → augmentierte Antwort
  - Performance + Privacy dokumentieren
- **Voraussetzungen**: L12, L21, L30
- **Length target**: 20 min (+ 1–2h Hands-on, separat)
- **Inhalt im Kern**: Capstone-Übung. Lernende bauen den persönlichen Tutor, der aus ihrer eigenen Doku/Notes lebt. Konsolidiert RAG + Continue + Privacy-Setup.
- **Code-/Demo-Anteil**: heavy code (Capstone-Repo-Vorlage)
- **SRS-Card-Themes**:
  - Welche drei Hauptbausteine hat Capstone 1?
  - Welche Eval-Metrik nutzt du zur Bewertung deines Tutors?
  - Wie messbar wird Privacy in diesem Setup?
  - Welcher häufigste Fehler beim ersten Build?

---

### Lesson 39 — Capstone 2 + 3: Code-Review-Bot & Multi-Agent-Setup

- **ID**: 39
- **Level**: 3
- **Title**: 🏗️ Capstone 2 + 3 — Code-Review-Bot in CI & lokaler Multi-Agent-Stack
- **Lernziele**:
  - **Capstone 2**: lokales Modell als Reviewer in CI einbinden (GitHub Action mit `runs-on: self-hosted`, oder Pre-Commit-Hook), Output strukturiert (Findings + Severity), False-Positive-Rate dokumentieren
  - **Capstone 3**: lokalen Multi-Agent-Setup bauen — Plan-Agent (z. B. via Aider's plan mode oder eigene Orchestration) + Code-Agent + Review-Agent, alle drei lokal, alle drei mit unterschiedlichen Modell-Größen je Tier
  - Beide Capstones in einer Lektion gebündelt, weil sie die gleichen Infra-Bausteine (Routing, MCP, llama-server) konsolidieren
  - Limits ehrlich dokumentieren: was schafft das Setup, was nicht
- **Voraussetzungen**: L31, L32, L34, L37
- **Length target**: 20 min (Spec-Walk) + 3–5h Hands-on per Capstone, separat
- **Inhalt im Kern**: Zwei Capstones, eine Anchor-Lektion. Spec + Architektur-Diagramm + Acceptance-Criteria, dann selbstständige Umsetzung. Capstone 2 = CI-Pattern. Capstone 3 = Multi-Agent-Pattern. Beide bündeln Routing (L31), llama-server (L32), MCP (L34), Production-Setup (L37).
- **Code-/Demo-Anteil**: mixed (Spec + Stub-Code + Acceptance-Tests)
- **SRS-Card-Themes**:
  - Welcher CI-Runner ist Pflicht für Capstone 2 (self-hosted)?
  - Welche drei Agent-Rollen verteilt Capstone 3?
  - Wie verteilst du Modell-Größen sinnvoll im Multi-Agent-Setup?
  - Welche Acceptance-Test-Klassen gehören in jeden Capstone?
  - Wo wird Capstone 3 realistisch an Capability-Limits stoßen?

---

## Curriculum-Risiken + offene Fragen für Cosmo

### Risiken

1. **EU-AI-Act Belegbarkeit (Lesson 35)** — primary sources sind dünn auf Deutsch, der konsolidierte Final-Text ist Englisch-zentriert. Risiko: Aussagen, die im Drafting nur durch Sekundärliteratur gestützt werden, müssen im Cosmo-Review-Pass (Authoring-Pipeline-Schritt 4) hart auf Quellen geprüft werden. Empfehlung: Lesson 35 bekommt einen extra-Review-Slot.
2. **Hardware-Bandbreite** — Tier-S-Nutzer (16 GB MacBook Air) können viele Lektionen praktisch nicht durchspielen (Fine-Tuning, vLLM, 14B-Modelle). Vorschlag: pro Lesson ein „Mindest-Tier"-Badge in der Frontmatter (siehe Open Question 1).
3. **Tool-Volatilität** — Continue, Aider, Cline, Zed haben monatliche Major-Updates. Spec-Bindung an exakte Versionen ist nötig (`tool-version-pins.json` per B1-Linter). Risiko: in 3 Monaten ist eine Hand voll Snippets veraltet — Drafting-Pipeline muss versionssensitiv sein.
4. **Capstone-Größe** — die drei Capstones in zwei Lektionen-Slots (L38 + L39) sind eng. L39 bündelt zwei Capstones in einem Spec-Walk; Hands-on-Zeit liegt komplett beim Lerner. Risiko: Lerner ohne Production-Erfahrung scheitern an L39, wenn nicht klar als „mehrere Tage Hands-on" gerahmt.
5. **MCP-Tool-Calling-Qualität lokal** — qwen2.5-coder ist solide ab 7B, aber kleinere Modelle (3B) sind schwach im Tool-Calling. Lessons L13, L17, L34 müssen Modell-Mindestanforderungen klar nennen.
6. **DSGVO-Lesson (L36) Scope** — Risiko, dass die Lektion ins Anwalts-Sprech driftet. Spec-Vorgabe: bleib in konkreten Implementierungs-Patterns (Lösch-Skript, Audit-Logger). Rechtsberatung gehört nicht in die Lektion.

### Offene Fragen für Cosmo

1. **Mindest-Tier-Badge pro Lektion?** — Sollen wir in der Frontmatter `minTier: 'S' | 'M' | 'L'` setzen, damit das Frontend in `LessonHeader` eine Hardware-Warnung anzeigen kann? Würde Onboarding-Honesty verstärken. Brauchen wir das aber als Phase-4-Scope oder reicht Phase 4b dafür ein nachträglicher Pass?
2. **Capstone-Slot-Verteilung** — Aktuell sind die drei Capstones in zwei Slots gepresst (L38 = Capstone 1; L39 = Capstone 2 + 3). Alternative: Capstone 3 als 41. Lesson ranhängen und Total auf 41 schieben? Spec sagt 40, also habe ich zusammengelegt — bitte bestätigen, dass das Bündeln in L39 ok ist.
3. **Tool-Auswahl-Doppelung** — Aider (L5, L15), Continue (L4, L14, L21), Cline (L7, L17), Zed (L6, L16). Vier Tools × zwei Tiefen = acht Lektionen. Ist die Tiefe pro Tool angemessen, oder sollen wir z. B. Zed auf eine Lesson reduzieren und Platz für eine andere Hardware-Realismus-Lesson freimachen?
4. **Plan-Topic „Modell-Routing"** — passt aktuell L18 (Konzept) + L31 (Service-Pattern). Beim Tutor-Routing im Masterkurs (`server/lib/tutor-router.ts`) gibt es einen weiteren Hook, den wir in L25 nutzen. Reicht das, oder soll Routing einen 3. Slot bekommen?
5. **vLLM + Distributed Inference** — Plan-Liste erwähnt „Distributed Inference (2+ Maschinen)" als Topic. Ich habe das nicht in eine eigene Lektion gehoben, weil die Zielgruppe (Solo-Dev / KMU) das selten braucht. Soll das doch als 14. Advanced-Lektion rein, dann müsste Capstone 3 als eigener Slot raus?
6. **Cloud-Fallback-Framing in L24** — Locked Decision #4 sagt kein Cloud-Fallback im Tutor. L24 lehrt Hybrid-Patterns als legitimes Werkzeug für eigene Projekte. Die Grenze ist sauber, aber wir sollten im Drafting darauf achten, dass L24 nicht so liest, als wäre Cloud-Hybrid auch im Tutor-Kontext ok.
7. **DE-only oder DE+EN-Tutorial-Snippets?** — Code-Kommentare in den Snippets: DE oder EN? Convention im Repo-bestand ist gemischt. Ich würde vorschlagen: Snippets EN-kommentiert (international portable), Prosa DE. Bitte freigeben.

### Topics aus Plan, die ich nicht 1:1 fitten konnte

- **„Distributed Inference (2+ Maschinen)"** — als Risiko in Open Question 5 dokumentiert; nicht als eigene Lesson aufgenommen. Bei Bedarf nachschieben.
- **„Cline mit lokalen Tools" + „Cline im Local-LLM-Modus"** — Plan listet zwei Cline-Items in zwei Tiers; habe sie als L7 (Beginner) + L17 (Intermediate) umgesetzt. Falls Cosmo nur einen wollte: L17 ist die wertvollere.
- **„Hybrid-Setups: Plan-first lokal, Execute mit Cloud-LLM"** — als L24 umgesetzt, aber mit hartem Framing-Caveat (siehe Open Question 6).

---

**Spec-Owner:** Cosmo + masterkurs-lesson-creator
**Nächster Schritt:** Cosmo-Review dieser Spec → Freigabe → Drafting-Batches à 5 Lessons (Authoring-Pipeline-Schritt 2)
