# Track-Style: claude-code

## Track-Positionierung
Der **claude-code**-Track ist die technische Hauptlinie des Masterkurses. Hier lernen Entwickler, wie sie Claude Code als CLI-First-Werkzeug für reale Engineering-Workflows einsetzen — von Hooks und Skills über Worktrees bis zu MCP-Servern und Plugin-Distribution.

## Lesson-ID-Range
- **Range**: `0` – `999`
- **Aktueller Stand**: 0–48 belegt (siehe `claude-code-masterkurs/src/data/lessons.ts`)
- **Konvention**: Nächste freie ID = `MAX(existing_id) + 1`. Keine Lücken füllen, keine bestehenden IDs überschreiben.

## Tonalität
- **Anrede**: DE Du-Form (uniform über alle Tracks)
- **Stil**: Technisch präzise, praxis-orientiert, leicht ironisch wenn passend
- **Code-First**: Jeder Konzept-Block schließt mit einem konkreten Befehl, JSON-Snippet oder Hook-Beispiel

## Pflicht-Sektionen (claude-code Lessons)
1. **Lernziele** – 3–5 konkrete Fähigkeiten
2. **Was ist neu** – Welche CC-Version führt das Feature ein, welcher Release-Note-Link
3. **Beispiel-Code** – Mindestens ein lauffähiges Snippet (Hook, Skill-YAML, MCP-Config)
4. **Common Mistakes** – Mindestens 2 Antipatterns aus Stack Overflow / GitHub Issues
5. **Übung** – Hands-on Aufgabe mit Lösung im Solution-Folder
6. **Quellen** – Anthropic Docs + Community-Links

## Style-Beispiele

**Lesson-Opener (Beispiel L42)**:
```markdown
# Lektion 42: Plugin-Distribution mit `--plugin-url`

Du willst dein eigenes Skill-Bundle teilen, ohne dass jeder Nutzer es manuell in `~/.claude/skills/` kopieren muss? Genau dafür gibt es seit Claude Code 2.1.115 den `--plugin-url`-Flag plus `skillOverrides`.
```

**Code-Block-Convention**:
```markdown
**Beispiel-Code**:
\`\`\`bash
claude --plugin-url https://github.com/cosmo/my-plugin
\`\`\`

**Erklärung**:
- `--plugin-url`: Lädt das Plugin direkt von GitHub, kein lokales Setup nötig
- Hash-Pinning empfohlen: `…@v1.2.3` statt `…@main`
```
