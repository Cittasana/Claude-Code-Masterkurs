# Track-Style: codex

## Track-Positionierung
Der **codex**-Track behandelt OpenAIs Codex CLI als alternativen Coding-Agenten. Ziel ist nicht "Codex statt Claude Code", sondern **bewusster Werkzeugvergleich**: Wann lohnt sich Codex, wo ist Claude Code überlegen, und wie integriert man beide in Multi-Agent-Workflows.

## Lesson-ID-Range
- **Range**: `2000` – `2999`
- **Aktueller Stand**: 0 belegt (Track ist neu)
- **Konvention**: Erste Lesson startet bei `2000`. Nächste freie ID = `MAX(existing_id) + 1` innerhalb der Range.

## Tonalität
- **Anrede**: DE Du-Form (uniform über alle Tracks)
- **Stil**: Technisch, neutral-vergleichend, keine Vendor-Bashing
- **Pricing-bewusst**: Token-Kosten und Plan-Limits (ChatGPT Plus / Pro) immer mitnennen

## Pflicht-Sektionen (codex Lessons)
1. **Lernziele** – 3–5 konkrete Fähigkeiten
2. **Codex-Version** – Aktuelle CLI-Version + Release-Datum
3. **Beispiel-Code** – Lauffähiger `codex …`-Befehl + erwartete Ausgabe
4. **Vergleich zu Claude Code** – Mindestens eine Tabelle oder Bullet-Liste: Was kann Codex hier besser/schlechter?
5. **Übung** – Hands-on Aufgabe (idealerweise dasselbe Problem in Codex und CC lösen)
6. **Common Mistakes** – Mindestens 2 Codex-spezifische Antipatterns
7. **Quellen** – OpenAI Docs + Vergleichs-Benchmarks

## Style-Beispiele

**Lesson-Opener**:
```markdown
# Lektion 2000: Codex CLI — Erster Lauf und wie es sich von Claude Code unterscheidet

Codex CLI 0.130 ist OpenAIs Antwort auf Claude Code: ein agentic Coding-Tool im Terminal. Bevor du dich entscheidest, welches Tool für welchen Task taugt, brauchst du einen ehrlichen Hands-on-Vergleich. Genau das machen wir hier.
```

**Vergleichstabellen-Convention**:
```markdown
**Codex vs. Claude Code (Sandbox-Mode)**:
| Aspekt | Codex CLI | Claude Code |
|--------|-----------|-------------|
| Default Sandbox | Workspace-write | Read-only |
| Approval-Mode | Plan / Edit / Auto | Plan / accept-edits |
| Token-Pricing | ChatGPT-Plan-gebunden | Per-Token API |
```
