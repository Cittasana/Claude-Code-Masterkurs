# Claude-Desktop Track — Curriculum-Spezifikation

**Status:** Phase 4 Draft (2026-05-15)
**Track key:** `claude-desktop`
**Total Lektionen:** 30 (themen-gemischt, einzeln geleveled)
**Primärsprache:** Deutsch (DE-native)
**Geschätzte Gesamt-Laufzeit:** ~6,3 Stunden aktiver Inhalt (~378 Min)
**Launch-Welle:** Phase 4c (per Locked Decision #1: Codex → Local-LLM → Claude-Desktop)
**Ziel-Audience:** Knowledge-Worker, Solo-Founders, Non-Coders, Power-User
**Reviewer:** Cosmo (solo)

## Authoring-Hinweise

- Diese Spec treibt `masterkurs-lesson-creator --track claude-desktop`. Jede Lektion hier wird zu einem Lesson-Modul in `claude-code-masterkurs/src/data/lessons-claude-desktop.ts`.
- **ID-Range:** `1000`–`1999` (per `track-configs/claude-desktop/lesson-style.md`). Erste Lesson ist `1000`, durchnummeriert bis `1029`.
- **Themen-gemischte Struktur:** Lessons sind nicht in einen Einsteiger-/Fortgeschritten-/Profi-Block gegossen, sondern jeder Lesson-Eintrag hat ein individuelles Level. Reihenfolge folgt einer didaktischen Setup-→-Workflow-→-Showcase-Klammer.
- **Code-/Demo-Anteil:** Track-weit niedrig — es geht um Claude-Desktop-Nutzung, nicht um Programmieren. Ausnahme: MCP-Lessons (JSON-Snippets aus `claude_desktop_config.json`) und die Skills-Lesson (YAML-Frontmatter).
- **EU-Caveat:** Computer-Use-Verfügbarkeit ist regional limitiert. Jede betroffene Lesson nennt das in den Lernzielen UND in einer Open-Questions-Sektion am Ende. Wir verkaufen es nicht zu viel.
- **Cross-Track-Verweis:** Skills-Lessons dürfen offen sagen "tiefer im claude-code Track" wenn jemand Code-Tiefe sucht. Wir spielen das ehrlich.
- **AIOS-Showcase (L1029):** bezieht sich auf Cosmos eigenes `~/Desktop/Agentic os/` Projekt — Referenz zur Live-Demo, kein Code-Reverse-Engineering.
- **Pflicht-Sektionen pro Lektion (aus `lesson-style.md`):** Lernziele, Plattform-Hinweis (macOS / Windows / beide), Setup-Schritte, Beispiel-Konfiguration (wo sinnvoll), Übung, Troubleshooting (≥2 Fehler+Fix), Quellen.
- **SRS-Card-Themes:** 3–5 Karten pro Lesson, Q-A-Format, fokussiert auf Settings-Pfade, JSON-Schema-Felder und Use-Case-Mapping.

---

## Themen-Sections (Lesson-Cluster)

1. Setup + Foundation (5 Lessons, IDs 1000–1004)
2. Projects + Files (4 Lessons, IDs 1005–1008)
3. Artifacts + Canvas (3 Lessons, IDs 1009–1011)
4. MCP-Servers (4 Lessons, IDs 1012–1015)
5. Voice + STT (2 Lessons, IDs 1016–1017)
6. Computer Use — EU-Caveat (2 Lessons, IDs 1018–1019)
7. Skills + Plugins (3 Lessons, IDs 1020–1022)
8. Knowledge-Worker-Prompts (3 Lessons, IDs 1023–1025)
9. Workflows ohne Code (2 Lessons, IDs 1026–1027)
10. Notion / Linear Integrationen (1 Lesson, ID 1028)
11. Memory-Management (1 Lesson, ID — verschoben, siehe Hinweis unten)
12. AIOS-Showcase Capstone (1 Lesson, ID 1029)

> **Hinweis:** Um auf exakt 30 Lessons zu landen, ist "Memory-Management" als zweite Lesson im Workflows-Cluster (ID 1027) integriert — sie behandelt `/clear`, neuer-Projekt-Kontext und Compaction-Hygiene und passt thematisch sehr eng an "Konversationen als Workflow" (1026). Der Showcase-Capstone schließt mit AIOS (1029) ab.

---

## 1. Setup + Foundation

### Lesson 1000 — Claude Desktop installieren (macOS, Windows, Linux)

- **Schwierigkeit:** Einsteiger
- **Titel:** Claude Desktop installieren — macOS, Windows, Linux
- **Lernziele:**
  - Claude Desktop auf der eigenen Plattform installieren
  - Anthropic-Account anbinden + Plan-Status checken
  - Erste Permissions (Mikrofon, Bildschirm) bewusst setzen
  - System-Voraussetzungen verstehen (Apple Silicon vs. Intel, Windows 10/11, Linux-Status)
- **Voraussetzungen:** keine
- **Length target:** 10 min
- **Inhalt im Kern:** Schritt-für-Schritt-Installation pro OS inkl. Auto-Updater, Anmeldung am Pro/Max-Plan, erste Permission-Dialoge. Kein Code, viel "wo klicke ich?".
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Wo liegt `claude_desktop_config.json` auf macOS vs. Windows?
  - Wie aktualisiert sich Claude Desktop (Auto-Update vs. manuell)?
  - Welche Permissions fragt Claude Desktop initial an?

### Lesson 1001 — Pro/Max-Plan-Unterschiede + erste Konversation

- **Schwierigkeit:** Einsteiger
- **Titel:** Pro vs. Max — welcher Plan, welcher Workflow
- **Lernziele:**
  - Pro- und Max-Plan-Limits einordnen
  - Erste produktive Konversation starten (statt Spielzeug-Prompts)
  - Modell-Auswahl im Desktop (Sonnet vs. Opus vs. Haiku) verstehen
  - Token/Message-Limits in der Praxis lesen
- **Voraussetzungen:** Lesson 1000
- **Length target:** 10 min
- **Inhalt im Kern:** Plan-Vergleich, wann brauche ich Max, wie wechsle ich Modelle pro Konversation, was passiert bei Limit-Hit.
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Welcher Plan deckt Max-200x ab und ab wann lohnt das?
  - Wie wechsle ich mitten in einer Konversation das Modell?
  - Was zeigt der Usage-Indicator unten links an?

### Lesson 1002 — Claude Desktop vs. claude.ai im Browser

- **Schwierigkeit:** Einsteiger
- **Titel:** Desktop vs. Browser — was kann die App, was nicht?
- **Lernziele:**
  - Feature-Unterschiede Desktop ↔ Browser klar trennen
  - MCP, Computer Use, Voice und File-Pickers als Desktop-only erkennen
  - Wann lohnt der Browser (kollab. Sharing) vs. App (lokale Files, MCP)
  - Cross-Device-Konversations-Sync nutzen
- **Voraussetzungen:** Lesson 1001
- **Length target:** 5 min
- **Inhalt im Kern:** Vergleichstabelle Browser ↔ App, drei Beispiel-Szenarien, "warum die App auf jeden Fall installieren".
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Welche 3 Features fehlen in claude.ai-Browser komplett?
  - Wann ist der Browser besser als die App?
  - Wo synchronisieren sich Konversationen?

### Lesson 1003 — Subscriptions, Limits, Verbrauch im Blick

- **Schwierigkeit:** Einsteiger
- **Titel:** Verbrauch & Limits — niemals mehr "Rate Limited" überrascht werden
- **Lernziele:**
  - Usage-Page in Anthropic Console lesen
  - Soft- und Hard-Limits unterscheiden
  - Reset-Cycles (5h / monatlich) korrekt timen
  - Warning-Signale im Desktop-UI früh erkennen
- **Voraussetzungen:** Lesson 1001
- **Length target:** 5 min
- **Inhalt im Kern:** Tour durch console.anthropic.com Usage-Tab, Kombination Desktop-Indicator + Web-Stats, Strategien um Limits zu strecken (kurze Konversationen, gezielte Modellwahl).
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Wie lang ist das 5-Stunden-Limit-Fenster?
  - Wo sehe ich Token-Verbrauch der aktuellen Session?
  - Welche zwei Strategien strecken den Verbrauch am meisten?

### Lesson 1004 — Erste Custom-Settings (Theme, Shortcuts, Sidebar)

- **Schwierigkeit:** Einsteiger
- **Titel:** Settings durchräumen — die 7 Defaults die du heute änderst
- **Lernziele:**
  - Theme (Dark/Light/Auto), Sprache und Schriftgröße einstellen
  - Tastatur-Shortcuts kennenlernen (Cmd+K, Cmd+L, Cmd+Shift+M)
  - Sidebar-Organisation: Projects pinnen, alte Conversations archivieren
  - Telemetrie- und Privacy-Settings bewusst setzen
- **Voraussetzungen:** Lesson 1000
- **Length target:** 5 min
- **Inhalt im Kern:** Walkthrough durch Settings → General / Appearance / Privacy / Shortcuts. Welche 7 Defaults sind suboptimal und warum.
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Welcher Shortcut öffnet neue Konversation?
  - Wo schalte ich Trainings-Opt-out an?
  - Wie pinne ich ein Project in der Sidebar?

---

## 2. Projects + Files

### Lesson 1005 — Projects: was sie sind, wann nutzen

- **Schwierigkeit:** Einsteiger
- **Titel:** Projects — dein zweites Gehirn pro Thema
- **Lernziele:**
  - Konzept Projects vs. Konversation verstehen
  - Wann ein Project sich lohnt (≥3 Wiederbesuche) vs. wann nicht
  - 3 Project-Archetypen kennenlernen: Klient:in, Research-Thema, persönliches Vorhaben
  - Project erstellen + initial-strukturieren
- **Voraussetzungen:** Lesson 1001
- **Length target:** 10 min
- **Inhalt im Kern:** Project-Modell-Mental erklärt (persistenter Kontext-Container), 3 Beispiele aus Knowledge-Worker-Alltag, erste Project-Anlage Step-by-Step.
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Was unterscheidet ein Project von einer langen Konversation?
  - Welche 3 Archetypen passen am besten als Project?
  - Wo finde ich die "New Project"-Aktion?

### Lesson 1006 — Project-Files hochladen + organisieren

- **Schwierigkeit:** Einsteiger
- **Titel:** Files in Projects — was hochladen, was nicht
- **Lernziele:**
  - Unterstützte Formate kennen (PDF, DOCX, MD, TXT, CSV, Bilder)
  - Limits (Token-Budget pro Project) verstehen
  - "Was gehört rein, was nicht" — Heuristiken
  - Files updaten / ersetzen / löschen ohne Project zu verlieren
- **Voraussetzungen:** Lesson 1005
- **Length target:** 10 min
- **Inhalt im Kern:** Upload-Mechanik, Token-Budget-Awareness, häufiger Fehler: zu viele PDFs reingeworfen → Kontextverdünnung. 3-File-Regel als Faustformel.
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Wie groß darf eine einzelne PDF im Project sein?
  - Was passiert wenn das Project-Token-Limit gerissen wird?
  - Welche Datei-Typen werden nicht unterstützt?

### Lesson 1007 — Project-Instructions schreiben (Voice + Kontext-Setup)

- **Schwierigkeit:** Fortgeschritten
- **Titel:** Project-Instructions — die wichtigsten 200 Wörter deines Workflows
- **Lernziele:**
  - Struktur einer guten Project-Instruction (Rolle / Kontext / Tonalität / Verbote)
  - Voice-of-Customer in Instructions abbilden
  - "Persona-Drift" früh erkennen und nachjustieren
  - Instructions versionieren (im Project, nicht in Konversationen)
- **Voraussetzungen:** Lesson 1006
- **Length target:** 15 min
- **Inhalt im Kern:** Vorlage als Skeleton mit 4 Sections, Beispiel "Klient:innen-Briefing Project", typische Fallen (zu viele Verbote, fehlende Tonalitäts-Beispiele).
- **Code-/Demo-Anteil:** keiner (aber 1 strukturiertes Markdown-Template als Highlight-Block)
- **SRS-Card-Themes:**
  - Welche 4 Sections gehören in jede Project-Instruction?
  - Wie erkenne ich Persona-Drift in den ersten Antworten?
  - Wo speichere ich die alte Instruction-Version?

### Lesson 1008 — Mehrere Projects parallel verwalten

- **Schwierigkeit:** Fortgeschritten
- **Titel:** Project-Hygiene — mit 10+ Projects nicht den Überblick verlieren
- **Lernziele:**
  - Naming-Convention pro Archetyp
  - Pinning, Archive, Search nutzen
  - Wann ein Project teilen (Pro-Team-Plan) vs. wann nicht
  - Routine: monatliches Project-Aufräumen
- **Voraussetzungen:** Lesson 1005, 1007
- **Length target:** 10 min
- **Inhalt im Kern:** Cosmos eigene Projects-Liste als Anekdote, 3 Naming-Patterns ("KUNDE — Thema", "RESEARCH — Bereich", "PERSO — Vorhaben"), Sharing-Caveat.
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Welche Naming-Convention nutzt Cosmo für Klient:innen-Projects?
  - Wie oft sollte man archivieren?
  - Was geht beim Project-Sharing schief, wenn der Empfänger keinen Team-Plan hat?

---

## 3. Artifacts + Canvas

### Lesson 1009 — Artifacts: was wird zu einem Artifact?

- **Schwierigkeit:** Einsteiger
- **Titel:** Artifacts — wann Claude einen aus deinem Output macht (und wann nicht)
- **Lernziele:**
  - Definition Artifact vs. Inline-Antwort
  - Auslöser-Trigger (Länge, Code, Document, HTML, SVG, Mermaid)
  - Artifact in Konversation editieren / iterieren
  - Artifact downloaden + extern weiter-verwenden
- **Voraussetzungen:** Lesson 1001
- **Length target:** 10 min
- **Inhalt im Kern:** Erklärung des Auto-Trigger-Verhaltens, Beispiele für Document-, Code- und Mermaid-Artifacts, Iterations-Workflow.
- **Code-/Demo-Anteil:** niedrig (Beispiel-Mermaid + Beispiel-HTML in Highlight-Blocks)
- **SRS-Card-Themes:**
  - Bei welcher Längen-Heuristik macht Claude einen Artifact?
  - Welche 5 Artifact-Typen gibt es?
  - Wie exportiere ich einen Artifact als File?

### Lesson 1010 — Canvas-Mode: Editorial-Workflows mit Iteration

- **Schwierigkeit:** Fortgeschritten
- **Titel:** Canvas-Mode — Text & Code Seite-an-Seite redigieren
- **Lernziele:**
  - Canvas-Mode aktivieren + Unterschied zum normalen Chat
  - Inline-Edits (Markieren → "Verbessere diesen Absatz") nutzen
  - Multi-Section-Iteration ohne Kontext-Verlust
  - Wann Canvas → wann normaler Chat
- **Voraussetzungen:** Lesson 1009
- **Length target:** 10 min
- **Inhalt im Kern:** Schritt-für-Schritt Editorial-Workflow (Erstentwurf → Markieren → Refine), Tasten-Shortcuts, Limitationen (Files-Upload im Canvas).
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Wie aktiviere ich Canvas-Mode?
  - Welcher Shortcut markiert eine Section?
  - Wann sollte ich NICHT Canvas-Mode nutzen?

### Lesson 1011 — Artifacts weitergeben + iterieren über Konversationen

- **Schwierigkeit:** Fortgeschritten
- **Titel:** Artifacts iterieren — aus 5 Drafts wird ein veröffentlichungs-reifer Output
- **Lernziele:**
  - Artifact zwischen Konversationen wiederverwenden (via Project)
  - Versionierung mental tracken (Claude tut es nicht für dich)
  - "Reset auf Version 2" — wie zurückrollen
  - Output extern weiter-pflegen (Notion, Word, Markdown-Editor)
- **Voraussetzungen:** Lesson 1009, 1010
- **Length target:** 10 min
- **Inhalt im Kern:** Iterations-Anti-Patterns (jede Iteration überschreibt den Artifact), Workaround mit benannten Versionen im Project, Export-Workflow.
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Was passiert mit Artifact-Version 1 wenn ich Version 2 anfordere?
  - Wie tracke ich Versionen über Konversationen hinweg?
  - In welches Format exportiere ich für Notion?

---

## 4. MCP-Servers

### Lesson 1012 — Was sind MCP-Server (für Nicht-Coder erklärt)

- **Schwierigkeit:** Fortgeschritten
- **Titel:** MCP-Server — die Superpower, die Claude Desktop von claude.ai trennt
- **Lernziele:**
  - MCP (Model Context Protocol) in einem Satz erklären können
  - Verstehen wie ein MCP-Server Claude mit externen Tools verbindet (Filesystem, APIs, Apps)
  - Sicherheits-Awareness: ein MCP-Server bekommt Zugriff auf das, was ihm zugewiesen ist
  - 3 erste sinnvolle MCP-Server für Knowledge-Worker benennen
- **Voraussetzungen:** Lesson 1004
- **Length target:** 10 min
- **Inhalt im Kern:** Analogie "MCP = USB-Stecker für Claude", visuelles Schema (Claude ↔ MCP-Server ↔ Tool), Sicherheits-Grundsatz "trust the server", 3-Server-Empfehlung als Teaser für 1014.
- **Code-/Demo-Anteil:** keiner (1 Mermaid-Diagramm in Highlight-Block)
- **SRS-Card-Themes:**
  - Was steht das Akronym MCP für?
  - Was ist der Unterschied zwischen MCP-Client und MCP-Server?
  - Welche 3 Risiken birgt ein unbekannter MCP-Server?

### Lesson 1013 — MCP-Servers aktivieren in Desktop (Settings → Developer)

- **Schwierigkeit:** Fortgeschritten
- **Titel:** `claude_desktop_config.json` — 5-Minuten-Setup, das deinen Workflow verzehnfacht
- **Lernziele:**
  - Settings → Developer → Edit Config finden
  - JSON-Schema von `mcpServers` lesen
  - Filesystem-MCP-Server für ein Verzeichnis konfigurieren
  - Restart-Trigger nach Config-Änderung verstehen
- **Voraussetzungen:** Lesson 1012
- **Length target:** 15 min
- **Inhalt im Kern:** Live-Walkthrough vom leeren Config bis zum funktionierenden Filesystem-Server. macOS- und Windows-Pfade. Plug-Icon-Verification unten links.
- **Code-/Demo-Anteil:** mittel — JSON-Snippet `claude_desktop_config.json` mit `mcpServers.filesystem`-Eintrag (Pflicht-Format laut `lesson-style.md`)
- **SRS-Card-Themes:**
  - Wo liegt die Config-Datei auf macOS vs. Windows?
  - Welches Top-Level-Key heißt der MCP-Block?
  - Was zeigt das Plug-Icon unten links nach erfolgreicher Verbindung?

### Lesson 1014 — Top-10 nützliche MCP-Servers für Knowledge-Worker

- **Schwierigkeit:** Fortgeschritten
- **Titel:** Die 10 MCP-Server, die wirklich kleben — Filesystem, Notion, Linear, Gmail, Calendar, Drive, Slack, GitHub, Web-Fetch, Memory
- **Lernziele:**
  - 10 MCP-Server pro Use-Case einordnen
  - Pro Server: Aufwand (5/15/60 min Setup) + Risiko (lokal vs. OAuth) abschätzen
  - "Welcher zuerst, welcher später" für eigenen Workflow priorisieren
  - Awesome-MCP-Servers-Liste als Discovery-Quelle kennen
- **Voraussetzungen:** Lesson 1013
- **Length target:** 15 min
- **Inhalt im Kern:** Tabelle mit 10 Servern + Use-Case + Setup-Aufwand + Risiko-Score. 3 Server als Empfehlung "starte mit diesen".
- **Code-/Demo-Anteil:** niedrig (2–3 JSON-Snippets als Beispiele für die Top-3-Server)
- **SRS-Card-Themes:**
  - Welcher MCP-Server eignet sich für Mail-Triage?
  - Welcher Server braucht OAuth statt nur Filesystem-Path?
  - Wo findet man neue MCP-Server (Discovery-URL)?

### Lesson 1015 — Eigener MCP-Server in 30 Min (Low-Code-Pfad mit Templates)

- **Schwierigkeit:** Profi
- **Titel:** Dein erster eigener MCP-Server — ohne JavaScript-Vollexpertise
- **Lernziele:**
  - Template-Repo klonen und adaptieren
  - Eine Custom-Funktion (z.B. "lese mein Tagesjournal") als MCP-Tool exposen
  - Lokales Testen + In-Desktop-Anbindung
  - Wann lohnt sich Eigenbau vs. Off-the-shelf
- **Voraussetzungen:** Lesson 1013, 1014
- **Length target:** 20 min
- **Inhalt im Kern:** TypeScript-Template (`@modelcontextprotocol/sdk`) als Starting-Point, eine Tool-Function als Demo, `npx tsx` lokal, Config-Eintrag, Quick-Test.
- **Code-/Demo-Anteil:** mittel — ein kompaktes TS-Snippet (~25 Zeilen) für das Tool-Handler, plus Config-JSON für die Anbindung. Cross-Track-Hinweis: "wer hier tiefer rein will, der claude-code Track behandelt MCP-Server-Authoring in L21-L24".
- **SRS-Card-Themes:**
  - Welches SDK-Paket nutzt man fürs Authoring?
  - Wie startet man den lokalen MCP-Server zum Testen?
  - Wann lohnt sich Eigenbau vs. Off-the-shelf?

---

## 5. Voice + STT

### Lesson 1016 — Voice-Mode in Desktop aktivieren

- **Schwierigkeit:** Einsteiger
- **Titel:** Voice-Mode — Mikrofon-Setup und erste Konversation
- **Lernziele:**
  - Mikrofon-Permissions im OS gewähren (macOS-Systemeinstellungen / Windows-Privacy)
  - Voice-Mode in Settings einschalten
  - Voice-Shortcut nutzen (Push-to-Talk vs. Continuous)
  - Audio-Qualität optimieren (Headset > eingebautes Mic)
- **Voraussetzungen:** Lesson 1000, 1004
- **Length target:** 5 min
- **Inhalt im Kern:** Permissions-Walkthrough, Settings-Pfad, Tasten-Shortcut, drei Erst-Konversations-Ideen.
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Wo gewähre ich Mikrofon-Zugriff auf macOS?
  - Welcher Shortcut startet Voice-Input?
  - Was tun bei "no audio detected"?

### Lesson 1017 — Diktier-Workflows: lange Texte, E-Mails, Notizen

- **Schwierigkeit:** Fortgeschritten
- **Titel:** Voice-Diktat — von 4 Meetings/Woche zu 0 Minuten Mitschrift
- **Lernziele:**
  - 3 Diktier-Patterns lernen: Stream-of-Consciousness, Strukturiertes Brief, Q&A-Interview
  - Voice-Output zu Artifact-Output kombinieren (Diktieren → Refine → Polish)
  - Mit-Meeting-Diktat (eigene Notizen, nicht Gegenüber) DSGVO-konform
  - Background-Noise-Workarounds
- **Voraussetzungen:** Lesson 1016
- **Length target:** 10 min
- **Inhalt im Kern:** Cosmos eigener "4-Meetings-pro-Woche"-Workflow als Case-Study, 3 Diktier-Patterns mit Beispiel-Prompts, DSGVO-Caveat für Meeting-Aufzeichnungen.
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Welche 3 Diktier-Patterns lernst du in der Lesson?
  - Was ist DSGVO-kritisch bei Meeting-Diktat?
  - Wie kombiniere ich Voice-Input mit Canvas-Mode?

---

## 6. Computer Use — EU-Caveat

### Lesson 1018 — Computer Use Basics (mit EU-Caveat)

- **Schwierigkeit:** Profi
- **Titel:** Computer Use Basics — was, wann, wo verfügbar (Spoiler: in der EU eingeschränkt)
- **Lernziele:**
  - **EU-Caveat:** Verstehen, dass Computer Use in der EU nicht durchgehend verfügbar ist und welche Plan-/Regions-Voraussetzungen aktuell gelten
  - Konzept-Grundlagen: Claude steuert Maus, Tastatur, sieht den Screen
  - Erste sichere Sandbox-Demos (in einer abgegrenzten VM oder einem isolierten Browser)
  - Risiko-Awareness: nichts produktives ohne Aufsicht, nie sensitive Apps
- **Voraussetzungen:** Lesson 1001
- **Length target:** 15 min
- **Inhalt im Kern:** Anthropic-Doc-Stand zu Computer Use, Plattform-Matrix (welcher Plan, welche Region, Beta-Status), Sandbox-Setup-Vorschlag. Die Lesson ist ehrlich: "vielleicht nutzt du das nie operativ, aber du solltest wissen was es ist."
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Was bedeutet "EU-Caveat" für Computer Use konkret?
  - Welche Plan-Stufe braucht Computer Use mindestens?
  - Welche 3 Apps sollten niemals von Computer Use gesteuert werden?
- **Open Questions / Caveats am Ende der Lesson:**
  - Computer Use Verfügbarkeit ändert sich oft — diese Lesson zeigt den Stand 2026-05. Vor Setup auf anthropic.com/news nachschauen.

### Lesson 1019 — Computer Use Workarounds für EU-User

- **Schwierigkeit:** Profi
- **Titel:** EU-Workarounds — VPN-Caveat, US-Account-Caveat, Alternativen
- **Lernziele:**
  - **EU-Caveat zentral:** Ehrliche Bewertung von VPN-Routing (was geht ToS-konform, was nicht)
  - US-Anthropic-Account anlegen — was geht, was bricht
  - Alternativen: native macOS-Automation (Shortcuts.app + MCP), Playwright-MCP-Server, lokale Tools
  - Entscheidungshilfe: "soll ich überhaupt warten, oder eine Alternative bauen"
- **Voraussetzungen:** Lesson 1018
- **Length target:** 15 min
- **Inhalt im Kern:** Pro-/Contra-Tabelle Workaround-Optionen, ToS-Awareness (VPN gegen Anthropic-Terms wäre problematisch), Playwright-MCP als ehrlichste Alternative für browser-basierte Automation, Shortcuts.app + Filesystem-MCP für macOS-native Workflows.
- **Code-/Demo-Anteil:** niedrig (1 JSON-Snippet für Playwright-MCP-Server)
- **SRS-Card-Themes:**
  - Welche 3 Workarounds existieren für EU-User?
  - Welche Risiken hat ein US-Account aus EU heraus operativ?
  - Welcher MCP-Server ist die beste browser-Automation-Alternative?
- **Open Questions / Caveats am Ende der Lesson:**
  - VPN-Routing kann gegen Anthropic-ToS verstoßen — wir empfehlen es nicht, wir erklären es nur. Eigenverantwortung beim User.
  - EU-AI-Act-Konformität bei Computer-Use-Workflows: separate Beratung nötig, kein Pauschalrat möglich.

---

## 7. Skills + Plugins

### Lesson 1020 — Skills im Desktop: was sie sind + wie aktivieren

- **Schwierigkeit:** Fortgeschritten
- **Titel:** Skills — Claudes "wenn-du-das-machst-mach-es-so"-Anweisungen
- **Lernziele:**
  - Skills-Konzept verstehen (modulare Instructions die bei Trigger aktiv werden)
  - Skill-Marketplace im Desktop finden + browsen
  - Erste Skill aktivieren + testen
  - Aktive Skills überprüfen (welche sind eingeschaltet?)
- **Voraussetzungen:** Lesson 1005, 1007
- **Length target:** 10 min
- **Inhalt im Kern:** Skills-Definition als "Triggered Instructions", Settings → Features → Skills, Beispiel-Skill aktivieren (z.B. content-atomizer oder market-skills), Trigger-Test.
- **Code-/Demo-Anteil:** keiner (YAML-Frontmatter eines Skills nur als Highlight-Block)
- **SRS-Card-Themes:**
  - Wie unterscheidet sich eine Skill von einer Project-Instruction?
  - Wo aktiviere ich Skills in Claude Desktop?
  - Wie erkenne ich, dass eine Skill gerade aktiv ist?

### Lesson 1021 — Top-Skills für Knowledge-Worker

- **Schwierigkeit:** Fortgeschritten
- **Titel:** Die 7 Skills, die jeden Knowledge-Worker schneller machen
- **Lernziele:**
  - 7 kuratierte Skills pro Use-Case (Research, Content, Marketing, Email, Meeting-Prep, SEO, Slides)
  - Wann eine Skill helfen vs. wann sie nervt (False-Trigger)
  - Skills aus dem Cittasana-Skill-Pack vs. Anthropic-First-Party
  - Skills temporär deaktivieren ohne sie zu löschen
- **Voraussetzungen:** Lesson 1020
- **Length target:** 15 min
- **Inhalt im Kern:** Tabellen-Format mit 7 Skills + Use-Case + Trigger-Beispiel + "kombinier-bar mit Skill X". Drei Empfehlungen als Quickstart.
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Welche Skill nutze ich für 30-Tage-Social-Content?
  - Wie deaktiviere ich eine Skill für eine Konversation?
  - Welche 2 Skills lassen sich kombinieren (Content + Email)?

### Lesson 1022 — Eigene Skills schreiben — wann Desktop, wann tiefer

- **Schwierigkeit:** Profi
- **Titel:** Eigene Skills — die Grundlagen + wann der claude-code Track tiefer geht
- **Lernziele:**
  - Skill-File-Struktur verstehen (YAML-Frontmatter + Markdown-Body)
  - Erste eigene Skill schreiben (Beispiel: "Meeting-Vorbereitungs-Routine")
  - Skill in Desktop importieren + testen
  - Cross-Track-Verweis: code-tiefe Skills (mit Bash, ToolSearch, Hooks) → claude-code Track
- **Voraussetzungen:** Lesson 1020, 1021
- **Length target:** 15 min
- **Inhalt im Kern:** YAML-Header (`name`, `description`, `tools`, `model`), Markdown-Body als Trigger-Aktion. Beispiel-Skill als File komplett. Ehrlich: "Wenn du Skills mit Bash-Tool-Calls und Sub-Agents bauen willst, der claude-code Track widmet dem 4 Lektionen."
- **Code-/Demo-Anteil:** mittel — eine vollständige Skill-Datei als YAML+Markdown-Block
- **SRS-Card-Themes:**
  - Welche 4 YAML-Felder sind Pflicht im Frontmatter?
  - Wie importiere ich eine Skill in Desktop?
  - Wann ist eine Skill ein Skill und wann ein MCP-Server-Tool?

---

## 8. Knowledge-Worker-Prompts

### Lesson 1023 — Recherche-Prompts: long-form Investigations

- **Schwierigkeit:** Fortgeschritten
- **Titel:** Recherche-Prompts — von "Was ist X?" zu "Vergleiche X, Y, Z mit Quellen und Konfidenz"
- **Lernziele:**
  - 3 Recherche-Prompt-Patterns: Synthese, Vergleich, Konfidenz-Bewertung
  - Sources-Forderung in den Prompt einbauen (Claude markiert Unsicherheit)
  - Web-Fetch-MCP für Live-Sources hinzuziehen
  - Output als Artifact / Project-File ablegen
- **Voraussetzungen:** Lesson 1005, 1009
- **Length target:** 15 min
- **Inhalt im Kern:** 3 Prompt-Templates als Highlight-Blocks. Anti-Patterns ("schreib mir die Wahrheit über X" funktioniert nicht). Wann Web-Fetch hinzuziehen.
- **Code-/Demo-Anteil:** keiner (Prompts in Markdown-Blocks)
- **SRS-Card-Themes:**
  - Welche 3 Sektionen sollte ein Recherche-Prompt minimal haben?
  - Wie zwinge ich Claude zur Konfidenz-Aussage?
  - Welcher MCP-Server liefert Live-Web-Quellen?

### Lesson 1024 — Schreib-Prompts: E-Mails, Reports, Briefe

- **Schwierigkeit:** Einsteiger
- **Titel:** Schreib-Prompts — Tonalität, Länge, Verbote in 3 Zeilen einstellen
- **Lernziele:**
  - 4-Element-Prompt: Empfänger:in, Anlass, Ton, Länge
  - Ton-of-Voice-Beispiele anhängen (Few-Shot)
  - Eigene E-Mails als Stil-Referenz nutzen
  - Quick-Iteration ("kürzer", "wärmer", "ohne Floskeln")
- **Voraussetzungen:** Lesson 1005
- **Length target:** 10 min
- **Inhalt im Kern:** 4-Element-Skelett, 3 Beispiel-Prompts (Kundenmail / Bewerber:innen-Absage / Status-Report), Iterations-Wortschatz für Refinement.
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Welche 4 Elemente gehören in jeden Schreib-Prompt?
  - Wie hänge ich eine Stil-Referenz als Few-Shot an?
  - Welche 3 Refinement-Wörter funktionieren am besten?

### Lesson 1025 — Analyse-Prompts: PDFs, Excel, Screenshots

- **Schwierigkeit:** Fortgeschritten
- **Titel:** Analyse-Prompts — Daten aus PDFs, Spreadsheets, Screenshots ziehen
- **Lernziele:**
  - PDF-Upload + Extraction-Prompt-Pattern
  - Excel/CSV-Pattern: "wandle in Markdown-Tabelle, dann analysiere"
  - Screenshot-Analyse: Vision-Prompts für UI/Charts/Dashboards
  - Output-Format vorschreiben (Tabelle, Bullet, JSON)
- **Voraussetzungen:** Lesson 1006, 1024
- **Length target:** 15 min
- **Inhalt im Kern:** 3 Beispiel-Files in einem Beispiel-Project (Rechnung-PDF, Sales-CSV, Dashboard-Screenshot), je 1 Prompt-Template pro Quell-Typ. Häufige Fallen (PDF mit OCR-Müll, Spreadsheets >1000 Zeilen).
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Bei welchem File-Typ braucht es ein "wandle erst in Markdown" als Zwischen-Schritt?
  - Wie zwinge ich Claude zu strikt-strukturiertem JSON-Output?
  - Was tun bei PDF mit schlechtem OCR?

---

## 9. Workflows ohne Code

### Lesson 1026 — Konversationen als Workflow: Iteration über Tage / Wochen

- **Schwierigkeit:** Fortgeschritten
- **Titel:** Lange Konversationen — wann sie helfen, wann sie wehtun
- **Lernziele:**
  - Konversation als wiederkehrender Workflow (z.B. tägliche Stand-up-Notizen)
  - Wann eine Konversation zu lang wird (Token-Bloat, Persona-Drift)
  - Hand-Off-Pattern: alte Konversation zusammenfassen, neue starten
  - Recurring-Workflows in Projects parken
- **Voraussetzungen:** Lesson 1005, 1023
- **Length target:** 10 min
- **Inhalt im Kern:** Beispiel "tägliches Stand-up" als Recurring-Konversation, Anti-Pattern "1.000-Message-Konversation", Hand-Off-Template.
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Bei welcher Anzahl Nachrichten lohnt sich ein Hand-Off?
  - Welche 3 Signale zeigen Persona-Drift in einer langen Konversation?
  - Wo speichere ich eine Hand-Off-Zusammenfassung?

### Lesson 1027 — Memory-Management: `/clear`, neuer Projekt-Kontext, Compaction-Hygiene

- **Schwierigkeit:** Fortgeschritten
- **Titel:** Memory-Hygiene — wann `/clear`, wann neuer Projekt-Kontext, wann gar nichts
- **Lernziele:**
  - Konversations-Memory in Claude Desktop verstehen (keine echte Cross-Konversations-Memory standardmäßig)
  - `/clear`-Befehl + Effekt
  - Project-Files als langzeitiges Memory nutzen
  - Compaction-Strategien für Knowledge-Worker (Cosmos 60%-Regel als Beispiel-Heuristik)
- **Voraussetzungen:** Lesson 1005, 1026
- **Length target:** 10 min
- **Inhalt im Kern:** Kurze Theorie zu Kontext-Fenstern, `/clear` vs. neue Konversation vs. neues Project, Cosmos eigene Heuristik ("bei 60% Kontext-Last → zusammenfassen + neu starten").
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Was macht `/clear` im Vergleich zu "neue Konversation"?
  - Bei welcher Kontext-Auslastung lohnt sich ein Reset?
  - Wo speicher ich Memory das über Konversationen halten soll?

---

## 10. Notion / Linear Integrationen

### Lesson 1028 — Notion + Linear MCP-Setup + Use-Cases

- **Schwierigkeit:** Fortgeschritten
- **Titel:** Notion & Linear via MCP — von Chat zu deinem Projekt-Backbone
- **Lernziele:**
  - Notion-MCP-Server konfigurieren (OAuth-Flow)
  - Linear-MCP-Server konfigurieren (API-Token)
  - 3 Use-Cases: Notion-Daily-Update, Linear-Triage, Cross-Tool-Briefing
  - Permission-Scope eng halten (read-only vs. write)
- **Voraussetzungen:** Lesson 1013, 1014
- **Length target:** 15 min
- **Inhalt im Kern:** Zwei MCP-Setup-Anleitungen Side-by-Side, OAuth- vs. Token-Mechanik, 3 konkrete Workflow-Beispiele inkl. Beispiel-Prompts.
- **Code-/Demo-Anteil:** niedrig (2 JSON-Config-Blocks, einer für Notion, einer für Linear)
- **SRS-Card-Themes:**
  - Welche Auth-Methode nutzt Notion-MCP?
  - Welcher Linear-Scope sollte minimal gesetzt sein für reine Triage?
  - Welchen Prompt nutzt man für ein tägliches Notion-Briefing?

---

## 11. AIOS-Showcase (Capstone)

### Lesson 1029 — AIOS-Showcase: was sich mit Desktop-only-Tooling nachbauen lässt

- **Schwierigkeit:** Profi
- **Titel:** Capstone — von Claude Desktop zum eigenen mini-AIOS (ohne Code)
- **Lernziele:**
  - Cosmos AIOS (`~/Desktop/Agentic os/`) als Inspirations-Showcase verstehen — kein Reverse-Engineering
  - Welche 4 AIOS-Building-Blocks lassen sich rein mit Desktop-Tools (Projects + MCP + Skills + Voice) nachbilden
  - Persönlicher 1-Wochen-Plan: 4 Projects + 3 MCP-Servers + 5 Skills als eigenes mini-AIOS
  - Wo hört Desktop-Only auf und wo beginnt der claude-code Track / das Coden
- **Voraussetzungen:** Lessons 1005, 1014, 1021, 1024, 1026
- **Length target:** 20 min
- **Inhalt im Kern:** Cosmos AIOS-Story als Frame, dann eine 4-Building-Blocks-Analyse: (1) Morning Brief = MCP-Workflow, (2) Triage = Skill + MCP, (3) Capture = Voice + Project, (4) Recall = Project-Files. Aktions-Checkliste am Ende: "diese 7 Schritte machen aus deinem Desktop ein produktives mini-AIOS."
- **Code-/Demo-Anteil:** keiner
- **SRS-Card-Themes:**
  - Welche 4 Building-Blocks bilden ein mini-AIOS?
  - Welcher MCP-Server liefert den Morning-Brief-Pull?
  - Wann verlasse ich Desktop-Only und gehe in Code (claude-code Track)?

---

## Lesson-Verteilung — Schwierigkeits-Mix

| Schwierigkeit | Anzahl Lessons | IDs |
|---|---|---|
| Einsteiger | 10 | 1000, 1001, 1002, 1003, 1004, 1005, 1006, 1009, 1016, 1024 |
| Fortgeschritten | 15 | 1007, 1008, 1010, 1011, 1012, 1013, 1014, 1017, 1020, 1021, 1023, 1025, 1026, 1027, 1028 |
| Profi | 5 | 1015, 1018, 1019, 1022, 1029 |

> **Verteilung gesamt:** 10 Einsteiger / 15 Fortgeschritten / 5 Profi = 30 Lessons.

## Length-Target-Aggregat

| Length | Anzahl Lessons | Summe Min |
|---|---|---|
| 5 min | 4 | 20 |
| 10 min | 12 | 120 |
| 15 min | 11 | 165 |
| 20 min | 3 | 60 |
| **Gesamt** | **30** | **365 min ≈ 6,1 h** |

> Mini-Drift von der Header-Angabe (~378) auf 365 Min — Header runden wir konservativ. Real-Time-Effort inkl. Übungen liegt bei ~6,3 h.

---

## Curriculum-Risiken + offene Fragen für Cosmo

### 1. EU-Caveat-Handling für Computer-Use-Lessons (1018, 1019)

- **Status:** zwei Lessons reserviert (1018 Basics + EU-Caveat / 1019 reine EU-Workarounds).
- **Frage 1:** Sollen wir die Computer-Use-Lessons hinter eine `betaContent: true`-Flag schalten, sodass sie nur sichtbar werden, wenn der User explizit "Beta-Content anzeigen" in Settings aktiviert? Vorteil: keine Frustration bei EU-Usern; Nachteil: Discoverability sinkt, und Computer-Use ist ein USP-Marketing-Hook für den Track.
- **Frage 2:** Wenn Anthropic die EU-Verfügbarkeit kurzfristig öffnet (kann Q3-2026 passieren), wer triggert das Update der beiden Lessons? Vorschlag: `masterkurs-research --track claude-desktop` flaggt EU-Computer-Use-Changes automatisch.
- **Frage 3:** Lesson 1019 erwähnt VPN-Workaround als "wir erklären, wir empfehlen nicht". Riskieren wir damit eine Anthropic-Beziehungs-Belastung (wir sind kein offizieller Partner, aber empfehlen indirekt ToS-Grenzen)? Alternative: Lesson 1019 komplett ohne VPN-Sektion und nur native Alternativen (Playwright-MCP, Shortcuts.app).

### 2. Code-/Demo-Anteil-Diskrepanz mit `lesson-style.md`

- `lesson-style.md` schreibt **Pflicht-Sektion "Beispiel-Konfiguration"** vor (also mindestens ein `claude_desktop_config.json`-Snippet pro Lesson).
- Real ist das nur für die MCP-/Skills-/Notion-Lessons (1012–1015, 1019, 1022, 1028) wirklich relevant. Für reine Workflow-Lessons (1024 "Schreib-Prompts" oder 1016 "Voice-Mode aktivieren") wäre eine `claude_desktop_config.json` erzwungen seltsam.
- **Frage:** Pflicht-Sektion **"Beispiel-Konfiguration"** weichspülen zu "Beispiel-Konfiguration ODER Beispiel-Prompt", damit die Workflow-Lessons nicht künstlich JSON anhängen müssen? Vorschlag: Ja — `lesson-style.md` Update als Phase-4-Begleit-Patch.

### 3. Themen-gemischte Struktur vs. claude-code-Track-Block-Struktur

- Der claude-code Track ist klassisch in Level-1/2/3-Blöcken organisiert (Lessons 0-5 Level 1, dann Level 2 usw.). Hier ist es themen-gemischt, einzeln geleveled.
- **Frage:** UI-Frage — zeigt die Dashboard-Lesson-Liste pro Track Schwierigkeit als Filter, oder als Block-Header? Vermutung: pro Track filterbar; aber wenn das nicht so ist, müssen wir die Reihenfolge nochmal überdenken.

### 4. Cross-Track-Verweise (Skills 1022, MCP 1015)

- Lessons 1015 und 1022 verweisen offen auf den claude-code Track für tiefere Skill-/MCP-Authoring-Inhalte.
- **Frage:** Sollten wir das im UI als "Tiefer im claude-code Track →"-Link rendern (deeplink in das andere Track-Inhaltsverzeichnis)? Würde Cross-Track-Conversion fördern, braucht aber Routing-Logic.

### 5. Voice + DSGVO (Lesson 1017)

- Wir touchen DSGVO bei Meeting-Diktat (eigene Notizen vs. Gegenüber-Aufzeichnung).
- **Frage:** Reicht ein 3-Zeilen-Caveat oder bekommt das eine eigene Open-Questions-Sektion am Lesson-Ende? Tendenz: ausführlicher Caveat, aber keine eigene Lesson — wir sind kein DSGVO-Anwalt-Track.

### 6. AIOS-Showcase-Lesson (1029) — Tiefe vs. Marketing

- Die Lesson positioniert Cosmos AIOS als Inspirations-Showcase. Sie soll **nicht** wie ein Sales-Pitch für ein zukünftiges Cittasana-Produkt wirken, aber sie soll Lust auf den Cross-Track-Capstone "CC + Desktop" machen (Phase 6 Marketing-Plan).
- **Frage:** Wie tief darf "Cosmos eigenes AIOS" als Beispiel rein? Vorschlag: Screenshot + 1 Anekdote + 4 Building-Blocks-Analyse — keine Live-Demo, kein Repo-Link auf das private `~/Desktop/Agentic os/`-Repo.

### 7. Plan vs. Tools — Plan §Phase-4 nennt "Skills+Plugins" als Cluster, aber "Plugins" sind im claude-code Track das stärkere Konzept

- "Plugins" im Desktop sind aktuell nicht klar von Skills getrennt — beide werden als modulare Erweiterungen wahrgenommen.
- **Entscheidung in dieser Spec:** Cluster heißt "Skills + Plugins" im Header, aber alle 3 Lessons (1020, 1021, 1022) reden konsequent von Skills, weil das in Desktop das primäre Konzept ist. Plugin-Distribution (mit `--plugin-url`) bleibt im claude-code Track (siehe L42 dort).
- **Frage an Cosmo:** Reicht es, das so zu trennen, oder soll eine 31. Lesson "Plugin-Distribution im Desktop-Kontext" rein (würde die Lesson-Anzahl auf 31 anheben, im Budget 28–33).

### 8. Topics merged/dropped vs. Plan §Phase-4

- **Merged:** "Memory-Mgmt" wurde in den Workflows-ohne-Code-Cluster integriert (Lesson 1027 statt eigenes Cluster). Begründung: Memory-Hygiene hängt enge an Konversations-Workflow.
- **Dropped:** Keine Topics aus der Plan-Liste komplett gestrichen. Aber: "Plugins" wurde zu einem Sub-Aspekt von "Skills" zusammengeführt (siehe Punkt 7).
- **Added:** Subscriptions/Limits-Lesson (1003) ist nicht explizit im Plan, aber zentral für Knowledge-Worker (= Plan-Awareness ist Cashflow für die Nutzer:innen).
- **Frage:** Soll "Lesson 1003 Subscriptions/Limits" raus, falls Cosmo den Lesson-Count bei harten 30 halten will und stattdessen eine Plugins-Lesson rein soll? Vorschlag: nein, 1003 bleibt — Plan-Awareness ist Reibungs-Reduktion-Lesson Nr. 1.

---

## Authoring-Checkliste vor `masterkurs-lesson-creator --track claude-desktop`-Run

- [ ] Cosmo Review der 8 Open-Questions oben — vor Drafting
- [ ] Bestätigen: 30 Lessons (oder Anpassung auf 31, siehe Punkt 7)
- [ ] EU-Caveat-Politik finalisieren (Punkt 1 & 3)
- [ ] `lesson-style.md`-Update zu "Beispiel-Konfiguration ODER Beispiel-Prompt" (Punkt 2)
- [ ] Drafting in Batches á 5 Lessons (Plan-Vorschrift, Phase 4 Pipeline-Schritt 2)
- [ ] Erste Batch: 1000–1004 (Setup + Foundation) — niedriges Risiko, gutes Tonalitäts-Kalibrieren
- [ ] Letzte Batch: 1029 (Capstone) — höchstes Risiko, am Schluss schreiben

---

**Letzte Aktualisierung:** 2026-05-15 (Phase 4 Spec-Draft, Pre-Drafting)
