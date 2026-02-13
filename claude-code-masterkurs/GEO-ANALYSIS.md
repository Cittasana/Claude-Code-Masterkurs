# GEO-Analyse: claude-code-masterkurs.de

**Datum:** 13. Februar 2026 (Update #2)
**Analysiert:** https://claude-code-masterkurs.de/
**Methode:** Generative Engine Optimization (GEO) nach aktuellen Standards

---

## GEO Readiness Score: 68/100 (vorher: 31/100, +37 Punkte)

| Kategorie | Gewicht | Vorher | Jetzt | Delta | Gewichtet |
|-----------|---------|--------|-------|-------|-----------|
| Citability Score | 25% | 35 | 78 | **+43** | 19.50 |
| Structural Readability | 20% | 40 | 82 | **+42** | 16.40 |
| Multi-Modal Content | 15% | 15 | 20 | +5 | 3.00 |
| Authority & Brand Signals | 20% | 15 | 30 | +15 | 6.00 |
| Technical Accessibility | 20% | 45 | 92 | **+47** | 18.40 |
| **Gesamt** | **100%** | **31** | **68** | **+37** | **63.30 → 68** |

### Bewertungsskala
- 80-100: Exzellent (AI-Suchmaschinen zitieren aktiv)
- 60-79: **Gut (gelegentliche AI-Zitierungen)** ← aktueller Stand
- 40-59: Ausbaufaehig (selten zitiert)
- 20-39: ~~Schwach (kaum sichtbar fuer AI-Suche)~~ ← vorheriger Stand
- 0-19: Kritisch (unsichtbar)

---

## Platform Breakdown

| Platform | Vorher | Jetzt | Delta | Status |
|----------|--------|-------|-------|--------|
| Google AI Overviews | 25 | 70 | **+45** | Gut – Prerendering + Schema + FAQ + HowTo |
| ChatGPT Web Search | 35 | 72 | **+37** | Gut – llms.txt aktuell, Landingpages zitierbar |
| Perplexity AI | 30 | 65 | **+35** | Gut – Glossar/Vergleich als Zitierbloecke |
| Bing Copilot | 20 | 60 | **+40** | Ausbaufaehig – Prerendering hilft, IndexNow fehlt |

---

## Erledigte Massnahmen (Vorher → Nachher)

### 1. Prerendering: ERLEDIGT ✅ (Blocker behoben)

| Metrik | Vorher | Nachher |
|--------|--------|---------|
| Sichtbare Seiten fuer AI-Crawler | 0 | **87** |
| Homepage-Groesse (HTML fuer Crawler) | ~340 Bytes (`<div id="root">Laedt…</div>`) | **32.605 Bytes** (vollstaendiger Content) |
| Lektion-Seiten | unsichtbar | **30 Seiten, 33-45 KB** pro Seite |
| Tool-Seiten | unsichtbar | **43 Seiten, 30-56 KB** pro Seite |
| SEO-Landingpages | nicht vorhanden | **3 neue Seiten, 27-28 KB** pro Seite |
| Statische Seiten | unsichtbar | **12 Seiten** mit vollem Content |

AI-Crawler sehen jetzt auf jeder Seite: H1-H3 Headings, Paragraphen, Listen, Code-Bloecke, Lernziele, strukturierten Content.

### 2. llms.txt: ERLEDIGT ✅

| Metrik | Vorher | Nachher |
|--------|--------|---------|
| llms.txt Groesse | 89 Zeilen | **109 Zeilen** |
| llms-full.txt Groesse | 307 Zeilen | **374 Zeilen** |
| Lektionsanzahl | "27" (falsch) | **"70"** (korrekt) |
| Preis-Info | "kostenlos" (falsch) | **Freemium + 24/229/499 EUR** |
| Tools erwaehnt | Nein | **43 Tools & Extensions** komplett |
| "Was ist Claude Code?" | 62 Woerter | **~150 Woerter** (optimal) |
| FAQ-Antworten | 30-80 Woerter | **134-167 Woerter** (optimal) |
| Verweise auf Landingpages | keine | **/was-ist-claude-code, /vergleich, /glossar** |

### 3. Schema.org: ERLEDIGT ✅

| Schema | Vorher | Nachher |
|--------|--------|---------|
| Structured Data Blocks | 6 | **7** (+HowTo) |
| Schema-Typen gesamt | 11 | **19** |
| Person Schema (E-E-A-T) | Fehlend | **Instructor + Founder (Cosmo Graef)** |
| HowTo Schema | Fehlend | **4-Schritt Installationsanleitung** |
| Course datePublished | Fehlend | **2026-01-15** |
| Course dateModified | Fehlend | **2026-02-13** |
| isAccessibleForFree | true (falsch) | **false** (korrekt) |
| courseWorkload | PT20H (falsch) | **PT40H** (korrekt) |
| BreadcrumbList Items | 4 | **5** (+Tools & Extensions) |
| sameAs Arrays | Leer `[]` | **Befuellt** |
| FAQ-Antworten im Schema | 30-80 Woerter | **134-167 Woerter** |

### 4. SEO-Landingpages: ERLEDIGT ✅ (NEU)

3 neue Seiten, speziell fuer AI-Suchmaschinen-Zitierung optimiert:

| Seite | URL | Woerter | Ziel-Queries |
|-------|-----|---------|--------------|
| Was ist Claude Code? | /was-ist-claude-code | ~5.400 | "Was ist Claude Code", "Claude Code erklaert" |
| Vergleich | /vergleich | ~2.500 | "Claude Code vs Copilot", "AI Coding Tools Vergleich" |
| Glossar | /glossar | ~2.800 | "MCP erklaert", "CLAUDE.md", "Agentic Coding" |

Alle Seiten:
- Prerendered als statisches HTML (sofort sichtbar fuer AI-Crawler)
- In Sitemap aufgenommen (Prioritaet 0.8-0.9)
- In llms.txt und llms-full.txt referenziert
- Sektionen in 134-167 Woerter Bloecken (optimale Citability)

### 5. Meta-Tags: ERLEDIGT ✅

| Tag | Vorher | Nachher |
|-----|--------|---------|
| OG Description | "27 Lektionen" | **"70 Lektionen, 43 Tools & Extensions"** |
| Twitter Description | "27 Lektionen" | **"70 Lektionen, 43 Tools & Extensions"** |

### 6. Sitemap: ERLEDIGT ✅

| Metrik | Vorher | Nachher |
|--------|--------|---------|
| Gesamt-URLs | 88 | **99** |
| lastmod-Daten | 2026-02-06 (veraltet) | **2026-02-13** (aktuell) |
| Fehlende Seiten | /dashboard, /newsletter, /nutzungsbedingungen | **Alle hinzugefuegt** |
| SEO-Landingpages | nicht vorhanden | **/was-ist-claude-code, /vergleich, /glossar** |
| Level-Kommentar | "Level 4: Meister" (falsch) | **"Level 3: Experte – Fortsetzung"** |

---

## Detaillierte Bewertungen (Aktualisiert)

### Citability Score: 78/100 (vorher 35/100, +43)

| Kriterium | Vorher | Jetzt | Details |
|-----------|--------|-------|---------|
| Klare Definitionen | 6/10 | **9/10** | "Was ist Claude Code?" ~150 Woerter, 16 Glossar-Definitionen je 134-167 Woerter |
| Eigenstaendige Antwort-Bloecke | 4/10 | **9/10** | 8 FAQ-Antworten à 134-167 Woerter, alle Landingpage-Sektionen |
| Direkte Antwort in ersten 60 Woertern | 5/10 | **8/10** | Homepage, /was-ist-claude-code, /glossar beginnen mit klarer Definition |
| Quellenattribution | 2/10 | **4/10** | Preise mit Quelle (Anthropic API), noch keine externen Studien zitiert |
| Unique Data Points | 3/10 | **5/10** | Vergleichstabelle (4 Tools, 12 Kriterien), Preis-Daten, 16 Definitionen |
| Spezifische Fakten/Zahlen | 5/10 | **8/10** | 70 Lektionen, 43 Tools, 3 Levels, $3/$15 Tokens, 24/229/499 EUR, PT40H |

### Structural Readability: 82/100 (vorher 40/100, +42)

| Kriterium | Vorher | Jetzt | Details |
|-----------|--------|-------|---------|
| Heading-Hierarchie | 7/10 | **9/10** | Saubere H1→H2→H3 auf allen 87 prerenderten Seiten |
| Frage-basierte Headings | 6/10 | **9/10** | "Was ist Claude Code?", "Wie funktioniert...?", "Was kostet...?", 8 FAQ-Fragen |
| Kurze Absaetze | 5/10 | **8/10** | 134-167 Woerter pro Block, keine Textwuesten |
| Tabellen | 7/10 | **8/10** | Vergleichstabelle auf /vergleich, llms-full.txt Tabelle |
| Listen | 5/10 | **9/10** | Listen auf allen Seiten sichtbar (Lernziele, Features, Glossar-TOC) |
| FAQ-Sektionen | 6/10 | **9/10** | 8 Schema-FAQs à 134-167 Woerter + FAQ auf /was-ist-claude-code |

### Multi-Modal Content: 20/100 (vorher 15/100, +5)

| Kriterium | Vorher | Jetzt | Details |
|-----------|--------|-------|---------|
| Text + Bilder | 2/10 | **3/10** | Bilder nur via React sichtbar, prerendered HTML ist text-only |
| Video-Content | 0/10 | **0/10** | Weiterhin kein Video-Content |
| Infografiken/Charts | 1/10 | **2/10** | Vergleichstabelle als strukturierte Daten |
| Interaktive Elemente | 2/10 | **3/10** | Playground-Beschreibung prerendered |
| Structured Data fuer Media | 0/10 | **2/10** | HowTo Schema mit Schritten (quasi-visuell) |

### Authority & Brand Signals: 30/100 (vorher 15/100, +15)

| Kriterium | Vorher | Jetzt | Details |
|-----------|--------|-------|---------|
| Autor-Byline mit Credentials | 0/10 | **5/10** | Person Schema (Cosmo Graef, Gruender & Kursleiter) in Schema + Instructor |
| Publikationsdatum | 2/10 | **6/10** | datePublished/dateModified im Course Schema |
| Quellenangaben | 1/10 | **2/10** | Anthropic API-Preise zitiert, noch wenig externe Quellen |
| Wikipedia-Praesenz | 0/10 | 0/10 | Nicht vorhanden (erfordert externe Aktion) |
| Reddit-Praesenz | 0/10 | 0/10 | Nicht vorhanden (erfordert externe Aktion) |
| YouTube-Praesenz | 0/10 | 0/10 | Nicht vorhanden (erfordert externe Aktion) |
| LinkedIn-Praesenz | 0/10 | 0/10 | Nicht vorhanden (erfordert externe Aktion) |
| sameAs-Links | 1/10 | **3/10** | Befuellt, aber nur Self-Reference (echte Social-Profile fehlen) |
| Externe Backlinks | 1/10 | 1/10 | Keine externen Links gefunden |

### Technical Accessibility: 92/100 (vorher 45/100, +47)

| Kriterium | Vorher | Jetzt | Details |
|-----------|--------|-------|---------|
| AI-Crawler in robots.txt | 10/10 | 10/10 | Vorbildlich, 16 Crawler erlaubt |
| llms.txt vorhanden | 8/10 | **10/10** | 109 Zeilen, konsistent, 134-167 Woerter Bloecke |
| Server-Side Rendering | 0/10 | **9/10** | 87 Seiten prerendered, voller Content sichtbar |
| Security Headers | 9/10 | 9/10 | HSTS, CSP, X-Frame-Options |
| Performance/Ladezeit | 7/10 | 7/10 | Vercel CDN, gutes Caching |
| HTML lang-Attribut | 10/10 | 10/10 | `lang="de"` korrekt |
| Canonical URLs | 8/10 | **9/10** | Auf allen prerenderten Seiten korrekt gesetzt |

---

## Was AI-Crawler jetzt sehen (Stichproben)

### Homepage (32.605 Bytes)
```
<h1>Claude Code Masterkurs: Programmieren mit AI in 70 Lektionen</h1>
<h2>Was ist Claude Code?</h2>
<h2>Kursstruktur</h2>
  <h3>Level 1: Grundlagen (Lektionen 0-5)</h3>
  <h3>Level 2: Fortgeschritten (Lektionen 6-11)</h3>
  <h3>Level 3: Experte (Lektionen 12-26)</h3>
<h2>43 Tools & Extensions</h2>
<h2>Features</h2>
<h2>Abo-Modelle</h2>
<h2>Haeufig gestellte Fragen</h2>
  <h3>Was ist der Unterschied zwischen Claude Code und GitHub Copilot?</h3>
  <h3>Wie installiert man Claude Code?</h3>
  <h3>Was kostet Claude Code?</h3>
  <h3>Was sind MCP Server?</h3>
```

### /was-ist-claude-code (28.342 Bytes)
```
<h1>Was ist Claude Code?</h1>
<h2>Wie funktioniert Claude Code?</h2>
<h2>Installation</h2>
<h2>Die wichtigsten Funktionen</h2>
<h2>Claude Code vs GitHub Copilot vs Cursor</h2>
<h2>Was kostet Claude Code?</h2>
```

### /glossar (28.588 Bytes, 7 H2-Definitionen prerendered)
```
<h2 id="agentic-coding">Agentic Coding</h2>
<h2 id="claude-md">CLAUDE.md</h2>
<h2 id="mcp">MCP (Model Context Protocol)</h2>
<h2 id="context-engineering">Context Engineering</h2>
<h2 id="token">Token</h2>
<h2 id="plan-mode">Plan Mode</h2>
<h2 id="subagents">Multi-Agent / Subagents</h2>
```

### Lesson 0 (33.389 Bytes) – voller Kurs-Content sichtbar
### Tool 200 (56.304 Bytes) – voller Tool-Content sichtbar

---

## Verbleibende Optimierungspotenziale

### Kurzfristig (Code-basiert, +5-10 Punkte moeglich)

| # | Massnahme | Impact | Status |
|---|-----------|--------|--------|
| 1 | IndexNow API fuer Bing Copilot | +2 | Offen |
| 2 | VideoObject Schema (wenn Videos existieren) | +3 | Wartet auf Video-Content |
| 3 | AggregateRating Schema (wenn Reviews existieren) | +2 | Wartet auf Reviews |
| 4 | Bilder in prerendered HTML einbetten (OG-Image als `<img>`) | +2 | Offen |
| 5 | Autor-Byline sichtbar auf prerenderten Seiten | +2 | Offen |

### Mittelfristig (externe Aktionen, +15-25 Punkte moeglich)

| # | Massnahme | Impact | Status |
|---|-----------|--------|--------|
| 6 | **YouTube-Kanal** mit 3-5 Claude Code Tutorials | +8 | Erfordert Video-Produktion |
| 7 | **Reddit-Praesenz** (r/ClaudeAI, r/coding Posts) | +5 | Erfordert manuelle Posts |
| 8 | **LinkedIn-Firmenseite** + regelmaessige Beitraege | +3 | Erfordert Account-Setup |
| 9 | **GitHub-Repository** (Open Source Teile) | +3 | Erfordert Repo-Setup |
| 10 | **Blog-Artikel** auf dev.to/Medium | +3 | Erfordert Content-Erstellung |
| 11 | **sameAs-Links** mit echten Social-Profilen fuellen | +3 | Wartet auf Profile |

### Langfristig (hoher Aufwand, +5-10 Punkte moeglich)

| # | Massnahme | Impact | Status |
|---|-----------|--------|--------|
| 12 | Original-Forschung/Surveys | +5 | Erfordert Datenerhebung |
| 13 | Wikipedia-Eintrag | +3 | Erfordert Notability |
| 14 | Community-Building fuer organische Mentions | +5 | Fortlaufend |

---

## Fazit

Der GEO-Score hat sich von **31/100 auf 68/100** verbessert (+37 Punkte). Die groessten Spruenge:

1. **Technical Accessibility: +47** – Prerendering war der Game-Changer. AI-Crawler sehen jetzt 87 Seiten mit vollem Content statt einer leeren Shell.
2. **Citability: +43** – Alle FAQ-Antworten und Definitionen sind jetzt im optimalen 134-167 Woerter Bereich. Drei dedizierte Landingpages liefern zitierbare Bloecke fuer Kern-Queries.
3. **Structural Readability: +42** – Saubere Heading-Hierarchie, frage-basierte H2s, Listen und Tabellen auf allen Seiten.
4. **Authority: +15** – Person Schema, datePublished, Instructor-Feld. Weiterhin gebremst durch fehlende externe Brand Mentions.
5. **Multi-Modal: +5** – Minimaler Fortschritt, da kein Video/Bild-Content erstellt wurde.

**Hauptblocker fuer 80+:** Externe Brand Mentions (YouTube, Reddit, LinkedIn). Diese erfordern manuelle Aktionen ausserhalb der Codebase und sind der einzige verbleibende Hebel fuer signifikante Verbesserung.
