---
name: masterkurs-research
description: |
  Wöchentliche Research zu Claude Code Updates mit WebSearch.

  Nutze diesen Skill wenn:
  - Der User fragt "Gibt es neue Claude Code Updates?"
  - Ein wöchentlicher Check ansteht
  - Der User "research Claude Code" oder "check for updates" erwähnt

compatibility:
  required_tools:
    - WebSearch
    - Write
---

# Claude Code Research Skill

## Workflow

### 1. Kontext laden
Lies die CLAUDE.md im Projekt-Root fuer aktuelle Kurs-Struktur.

### 2. Recherche (max 8 Suchanfragen, NUR WebSearch)

Fuehre diese Suchen durch:
1. `"Claude Code" changelog release notes 2026`
2. `Anthropic Claude Code new features`
3. `"Claude Code" best practices tips community`
4. `"Claude Code" vs Cursor vs Copilot comparison 2026`
5. `Anthropic funding news Claude 2026`

Optional bei relevanten Treffern:
6. `Claude Code MCP server updates`
7. `Anthropic API SDK updates 2026`
8. `"Vibe Coding" AI programming trends 2026`

STOP-REGEL: Nach 8 Suchen ist SCHLUSS. Ergebnisse aggregieren und Report schreiben.

### 3. Report schreiben

Speichere in: `./masterkurs-agent/research/YYYY-MM-DD-weekly-research-v2.md`

Der Report soll folgende Sektionen enthalten:

```markdown
# Weekly Research Report - DATUM

## Executive Summary
[3-5 Saetze: Was ist diese Woche passiert und was bedeutet das fuer den Kurs?]

---

## Neue Features & Updates

### [Update-Name]
**Quelle**: [Link]
**Relevanz fuer Kurs**: X/10

[Beschreibung: Was ist neu, warum ist es wichtig?]

#### Code-Beispiel (wenn verfuegbar):
[Praktisches Beispiel mit Erklaerung, 80-150 Woerter]

#### Betroffene Lektionen:
- Lektion X: [Was muss aktualisiert werden]

---

## Community Best Practices & Common Mistakes
[Top Tipps und haeufige Fehler aus der Community, mit Loesungen]

---

## Wettbewerber-Updates
| Tool | Neuigkeit | Relevanz |
|------|-----------|----------|
| Cursor | ... | ... |
| Copilot | ... | ... |
| [Andere] | ... | ... |

---

## Markt & Trends
[Funding-News, Nutzerzahlen, Branchentrends, Deutscher Markt]

---

## Content-Empfehlungen fuer den Masterkurs

### Prioritaet 1: Sofort (diese Woche)
| Content | Typ | Begruendung |

### Prioritaet 2: Naechste Woche
| Content | Typ | Begruendung |

---

## Quellen-Verzeichnis
- Official: [Links]
- Community: [Links]
- Markt: [Links]
```

### 4. Abschluss

Nach dem Report: FERTIG. Nicht endlos weitersuchen.
Wenn wenig Neues gefunden wird, ist ein kurzer Report voellig OK.
Nicht jede Sektion muss gefuellt sein - nur was tatsaechlich gefunden wurde.

## Regeln

- NUR WebSearch und WebFetch als Recherche-Tools
- Keine MCP-Tools versuchen die nicht verfuegbar sind
- Max 8 Suchanfragen, dann Ergebnisse zusammenfassen
- Kein Quality-Score-Gate - jeder fertige Report ist gut genug
- Lieber ein kurzer fertiger Report als ein endloser Recherche-Loop
- Code-Beispiele nur wenn in den Suchergebnissen welche gefunden wurden
- Erklaerungen 80-150 Woerter pro Beispiel
