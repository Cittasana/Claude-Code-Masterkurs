# Track-Style: freelancer

## Track-Positionierung
Der **freelancer**-Track ist das Business-Modul des Masterkurses. Er zeigt Solo-Entwicklern, wie sie Claude Code (und Coding-Agenten allgemein) **als Service verkaufen**: Pricing-Modelle, Akquise, Discovery-Calls, Angebote, Retainer, Skalierung über Sub-Contractor.

## Lesson-ID-Range
- **Range**: `100` – `999` (existierende Konvention)
- **Aktueller Stand**: noch keine Lessons (Track-Skeleton bereits vorhanden, IDs werden vergeben sobald Phase-3-Content gestartet ist)
- **Konvention**: Erste Lesson startet bei `100`. Nächste freie ID = `MAX(existing_id) + 1` innerhalb der Range. **Achtung**: Range überschneidet sich nicht mit `claude-code` (0–99 reserviert für claude-code unter ID 100), also muss strict bei 100 begonnen werden.

## Tonalität
- **Anrede**: DE Du-Form (uniform über alle Tracks)
- **Stil**: Business-orientiert, weniger Code-Snippets, mehr Templates / Calculator-Beispiele / Akquise-Hooks
- **Ehrlich mit Zahlen**: Keine Fantasie-Stundensätze. Reale Marktpreise im DACH-Raum (Stand 2026) oder explizit als Beispielwert markieren.

## Pflicht-Sektionen (freelancer Lessons)
1. **Lernziele** – 3–5 konkrete Business-Fähigkeiten
2. **Pricing-Beispiel** – Konkrete Zahlen (Stundensatz, Festpreis, Retainer) mit Begründung
3. **Akquise-Hook** – Mindestens ein konkretes Outreach-Template oder LinkedIn-Post-Beispiel
4. **Vorlage / Template** – Angebot, E-Mail, Vertrag oder Pitch-Deck als Markdown/PDF
5. **Übung** – Reale Aufgabe (z.B. eigenes Pricing kalkulieren, ersten Discovery-Call vorbereiten)
6. **Common Mistakes** – Mindestens 2 typische Anfänger-Fehler aus der Praxis
7. **Quellen** – Bücher (z.B. Pirate Skills, Stoakley), Podcasts, Referenz-Profile

## Style-Beispiele

**Lesson-Opener**:
```markdown
# Lektion 100: Stundensatz vs. Festpreis vs. Retainer — Welches Modell wann

Der häufigste Fehler von Solo-Entwicklern, die Claude-Code-Beratung anbieten: alles wird auf Stundensatz abgerechnet. Damit verschenkst du den größten Hebel deines Geschäfts — die Tatsache, dass Claude dich 5x schneller macht als manuelle Arbeit. Hier räumen wir mit dem Stundensatz-Reflex auf.
```

**Pricing-Beispiel-Convention**:
```markdown
**Beispiel-Pricing für ein "Claude-Code-Audit-Paket"**:
- **Discovery-Call**: kostenlos, 30 Min
- **Audit-Report**: 1.500 € Festpreis (4–6 h Aufwand mit CC-Unterstützung)
- **Implementation-Sprint**: 4.500 € / Woche (Sub-Contractor-fähig)
- **Retainer**: ab 2.000 € / Monat für 4 h/Woche fortlaufende Begleitung

**Akquise-Hook (LinkedIn-DM)**:
> Hey [Name], hab gesehen ihr nutzt [Tech-Stack]. Wir haben gerade bei [Referenz] mit Claude Code in 2 Wochen die Test-Coverage von 40 → 80% gehoben. Falls du das ebenfalls evaluieren willst — buchst du dir 30 Min hier rein? [Calendly-Link]
```
