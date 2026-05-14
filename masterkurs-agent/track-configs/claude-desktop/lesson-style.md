# Track-Style: claude-desktop

## Track-Positionierung
Der **claude-desktop**-Track richtet sich an Nutzer, die Claude über die Desktop-App (macOS/Windows) produktiv einsetzen wollen — Computer-Use, MCP-Konfiguration in `claude_desktop_config.json`, Voice-Mode, Projekte und Artifacts. Weniger CLI, mehr GUI-Workflow.

## Lesson-ID-Range
- **Range**: `1000` – `1999`
- **Aktueller Stand**: 0 belegt (Track ist neu)
- **Konvention**: Erste Lesson startet bei `1000`. Nächste freie ID = `MAX(existing_id) + 1` innerhalb der Range.

## Tonalität
- **Anrede**: DE Du-Form (uniform über alle Tracks)
- **Stil**: Technisch, aber GUI-nah; weniger Terminal-Output, mehr Screenshots/Settings-Pfade
- **Plattform-bewusst**: Klare Trennung zwischen macOS- und Windows-Pfaden bei Config-Dateien

## Pflicht-Sektionen (claude-desktop Lessons)
1. **Lernziele** – 3–5 konkrete Fähigkeiten
2. **Plattform-Hinweis** – macOS / Windows / beide
3. **Setup-Schritte** – Nummerierte GUI-Klick-Anleitung mit Settings-Pfad
4. **Beispiel-Konfiguration** – `claude_desktop_config.json`-Snippet oder MCP-Eintrag
5. **Übung** – Hands-on Aufgabe (z.B. einen MCP-Server lokal anbinden)
6. **Troubleshooting** – Mindestens 2 typische Fehler + Fix
7. **Quellen** – Anthropic Desktop-Docs + Community

## Style-Beispiele

**Lesson-Opener**:
```markdown
# Lektion 1000: claude_desktop_config.json — MCP-Server lokal anbinden

Die Desktop-App liest beim Start eine einzige JSON-Datei, um zu wissen, welche MCP-Server sie starten soll. Wenn du den Pfad nicht kennst, suchst du sie ewig — also klären wir zuerst, wo sie liegt und wie ihr Schema aussieht.
```

**Settings-Pfad-Convention**:
```markdown
**Config-Datei finden**:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Falls die Datei noch nicht existiert: einmal Settings → Developer → Edit Config klicken, dann erzeugt die App sie automatisch.
```
