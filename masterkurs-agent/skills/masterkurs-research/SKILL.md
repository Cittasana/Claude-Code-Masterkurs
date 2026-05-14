---
name: masterkurs-research
description: |
  Wöchentliche Research für die Multi-Track-Masterkurs-Plattform via WebSearch.
  Track-aware: lauffähig für `claude-code`, `claude-desktop`, `codex`,
  `local-llm` oder `freelancer`. Default-Track ist `claude-code` (Backwards-Compat).

  Nutze diesen Skill wenn:
  - Der User fragt "Gibt es neue Claude Code Updates?"
  - Der User "research codex updates" / "weekly research for claude-desktop"
    / "research local-llm" / "freelancer research" sagt
  - Ein wöchentlicher Check für irgendeinen der 5 Tracks ansteht
  - Der User "research <track-key>" oder "check for updates" erwähnt

compatibility:
  required_tools:
    - WebSearch
    - Read
    - Write
---

# Masterkurs Research Skill (Multi-Track)

## Invocation Contract

```
masterkurs-research [--track <key>]
```

- `--track <key>`: einer von
  `claude-code` | `claude-desktop` | `codex` | `local-llm` | `freelancer`
- Default (kein `--track` übergeben): `claude-code`
- Wenn der User in natürlicher Sprache einen Track erwähnt
  (z.B. "research codex updates"), extrahiere den Track-Key automatisch.

## Workflow

### 1. Track-Kontext laden

1. Lies die CLAUDE.md im Projekt-Root für aktuelle Plattform-Struktur.
2. Lies die track-spezifische Research-Konfiguration:
   ```
   masterkurs-agent/track-configs/<track>/research-context.md
   ```
   Diese Datei enthält:
   - 1-Zeilen-Track-Beschreibung
   - Watch-List (3-5 Quellen: Blogs, Changelogs, Repos, Subreddits)
   - 5-10 Beispiel-Suchanfragen, die als Templates dienen
   - Tone-Notes (alle Tracks: Du-Form Deutsch; freelancer: business-orientierter)

   Falls die Track-Datei fehlt: brich ab und melde es dem User.

### 2. Recherche (max 8 Suchanfragen, NUR WebSearch)

Generiere Suchanfragen, indem du die Beispiele aus
`track-configs/<track>/research-context.md` als Vorlage nutzt und sie auf
das aktuelle Datum/den aktuellen Sprint anpasst.

**Beispielhafte Adaption pro Track:**
- `claude-code`: `"Claude Code" changelog release notes 2026`,
  `Anthropic Claude Code new features`,
  `"Claude Code" vs Cursor vs Copilot comparison 2026`
- `claude-desktop`: `"Claude Desktop" app updates 2026`,
  `Claude Desktop MCP integration changelog`,
  `Claude Desktop voice mode artifacts 2026`
- `codex`: `"OpenAI Codex CLI" release notes 2026`,
  `"GPT-5.5 codex" updates`, `Codex CLI multi-agent worktree`
- `local-llm`: `Ollama release notes 2026`, `LM Studio MCP support`,
  `Llama.cpp performance updates`, `local LLM coding agent comparison`
- `freelancer`: `freelance developer rates 2026 Germany`,
  `solo founder positioning AI tools`, `freelancer client acquisition LinkedIn 2026`

**STOP-REGEL:** Nach 8 Suchen ist Schluss. Ergebnisse aggregieren und Report schreiben.

### 3. Report schreiben

**Output-Pfad (track-aware):**
```
masterkurs-agent/research/<track>/YYYY-MM-DD-weekly-research-v2.md
```

**Backwards-Compat:** Wenn `track == "claude-code"`, schreibe den Report
ZUSÄTZLICH in den Legacy-Pfad (damit die bestehende Freshness-Pipeline ihn liest):
```
masterkurs-agent/research/YYYY-MM-DD-weekly-research-v2.md
```
Andere Tracks brauchen keinen Legacy-Fallback.

**Stelle sicher, dass das Zielverzeichnis existiert** (per Bash `mkdir -p`,
falls nötig — Write erstellt nur die Datei, nicht den Ordner-Pfad).

**Report-Sektionen** (Tonalität gemäß Track-Context):

```markdown
# Weekly Research Report — <Track-Name> Track

**Datum:** YYYY-MM-DD
**Track:** <track-key>

## Executive Summary
[3-5 Sätze: Was ist diese Woche im <Track>-Ökosystem passiert
und was bedeutet das für den Kurs?]

---

## Neue Features & Updates

### [Update-Name]
**Quelle:** [Link]
**Relevanz für Kurs:** X/10

[Beschreibung: Was ist neu, warum ist es wichtig?]

#### Code-Beispiel (wenn verfügbar):
[Praktisches Beispiel mit Erklärung, 80-150 Wörter]

#### Betroffene Lektionen:
- Lektion X: [Was muss aktualisiert werden]

---

## Community Best Practices & Common Mistakes
[Top Tipps und häufige Fehler aus der Community, mit Lösungen]

---

## Wettbewerber-Updates
| Tool | Neuigkeit | Relevanz |
|------|-----------|----------|

(Track-spezifische Wettbewerber — siehe research-context.md)

---

## Markt & Trends
[Funding, Nutzerzahlen, Branchentrends, Deutscher Markt;
für `freelancer`: Rates, Positionierung, Acquisition-Trends]

---

## Content-Empfehlungen für den <Track>-Track

### Priorität 1: Sofort (diese Woche)
| Content | Typ | Begründung |

### Priorität 2: Nächste Woche
| Content | Typ | Begründung |

---

## Quellen-Verzeichnis
- Official: [Links]
- Community: [Links]
- Markt: [Links]
```

### 4. Abschluss

Nach dem Report: FERTIG. Nicht endlos weitersuchen.
Wenn wenig Neues gefunden wird, ist ein kurzer Report völlig OK.
Nicht jede Sektion muss gefüllt sein — nur was tatsächlich gefunden wurde.

## Regeln

- NUR WebSearch und WebFetch als Recherche-Tools
- Keine MCP-Tools versuchen die nicht verfügbar sind
- Max 8 Suchanfragen, dann Ergebnisse zusammenfassen
- Kein Quality-Score-Gate — jeder fertige Report ist gut genug
- Lieber ein kurzer fertiger Report als ein endloser Recherche-Loop
- Code-Beispiele nur wenn in den Suchergebnissen welche gefunden wurden
- Erklärungen 80-150 Wörter pro Beispiel
- **Track-Isolation:** Jeder Track-Run schreibt nur in seinen eigenen
  `research/<track>/`-Unterordner (außer `claude-code`-Legacy-Fallback)
