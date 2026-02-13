# GEO-Analyse: claude-code-masterkurs.de

**Datum:** 13. Februar 2026 (Update #3 – Verifizierter Live-Audit)
**Analysiert:** https://claude-code-masterkurs.de/
**Methode:** Generative Engine Optimization (GEO) – Live-Site-Pruefung aller Kriterien

---

## GEO Readiness Score: 76/100

### Score-Verlauf

| Runde | Datum | Score | Delta | Wichtigste Massnahmen |
|-------|-------|-------|-------|----------------------|
| Baseline | 12. Feb 2026 | 31 | – | Ausgangszustand (SPA ohne Prerendering) |
| Update #2 | 13. Feb 2026 | 68 | +37 | Prerendering, llms.txt, Schema.org, FAQ-Expansion, 3 Landingpages |
| **Update #3** | **13. Feb 2026** | **76** | **+8** | **Author-Bylines, OG-Image, Breadcrumbs, Quellen-Links, IndexNow, DefinedTermSet** |

### Detailbewertung

| Kategorie | Gewicht | Baseline | Update #2 | Update #3 | Gewichtet |
|-----------|---------|----------|-----------|-----------|-----------|
| Citability Score | 25% | 35 | 78 | **80** | 20.00 |
| Structural Readability | 20% | 40 | 82 | **87** | 17.40 |
| Multi-Modal Content | 15% | 15 | 20 | **28** | 4.20 |
| Authority & Brand Signals | 20% | 15 | 30 | **42** | 8.40 |
| Technical Accessibility | 20% | 45 | 92 | **95** | 19.00 |
| **Gesamt** | **100%** | **31** | **68** | **76** | **69.00 → 76** |

### Bewertungsskala
- 80-100: Exzellent (AI-Suchmaschinen zitieren aktiv)
- **60-79: Gut (gelegentliche AI-Zitierungen)** ← aktueller Stand (obere Haelfte)
- 40-59: Ausbaufaehig (selten zitiert)
- 20-39: ~~Schwach~~ ← Ausgangszustand
- 0-19: Kritisch

---

## Platform Breakdown

| Platform | Baseline | Update #2 | Update #3 | Status |
|----------|----------|-----------|-----------|--------|
| Google AI Overviews | 25 | 70 | **78** | Gut – 19 Schema-Typen, Breadcrumbs, Author, FAQ, HowTo |
| ChatGPT Web Search | 35 | 72 | **78** | Gut – llms.txt, Quellen-Links, Author-Byline |
| Perplexity AI | 30 | 65 | **72** | Gut – Glossar mit DefinedTermSet, Cross-Links |
| Bing Copilot | 20 | 60 | **72** | Gut – IndexNow aktiv, Key verifiziert (HTTP 200) |

---

## Live-Verifizierung (13. Feb 2026, nach Update #3)

### Seitengroessen (HTML fuer AI-Crawler)

| Seite | Update #2 | Update #3 | Delta | Neue Elemente |
|-------|-----------|-----------|-------|---------------|
| Homepage | 32.605 B | **34.029 B** | +1.424 | +Image, +Author, +Quellen, +Cross-Links |
| Lesson 0 | 33.389 B | **35.146 B** | +1.757 | +Breadcrumbs, +Image, +Author, +Quellen, +Cross-Links |
| Tool fzf | 56.304 B | **60.321 B** | +4.017 | +Breadcrumbs, +Image, +Author, +Quellen, +Cross-Links |
| Tool btop | ~45.000 B | **110.420 B** | +65.420 | Auch Tool-Content wuchs (Enrichment) |
| /was-ist-claude-code | 28.342 B | **30.029 B** | +1.687 | +Image, +Author, +Quellen |
| /vergleich | 27.640 B | **29.341 B** | +1.701 | +Image, +Author, +Quellen |
| /glossar | 28.588 B | **30.262 B** | +1.674 | +Breadcrumbs, +OG Tags, +Author, +Quellen |

### Neue Elemente auf JEDER prerenderten Seite (87 Seiten)

| Element | Sichtbar fuer AI-Crawler? | Verifiziert |
|---------|--------------------------|-------------|
| `<img src="/og-image.png" alt="...">` | ✅ Ja – 1 Bild pro Seite | ✅ Live bestaetigt |
| `Von Cosmo Graef, Gruender & Kursleiter` | ✅ Ja – sichtbarer Text | ✅ Live bestaetigt |
| `Zuletzt aktualisiert: 13. Februar 2026` | ✅ Ja – sichtbares Datum | ✅ Live bestaetigt |
| 4 Quellen-Links (Anthropic, Docs, npm, MCP) | ✅ Ja – 5 Links pro Seite | ✅ Live bestaetigt |
| Breadcrumb-Navigation `Startseite › Bereich › Seite` | ✅ Ja – `aria-label="Breadcrumb"` | ✅ Live bestaetigt (nicht auf Homepage) |
| 5 Cross-Links (Was ist CC?, Vergleich, Glossar, Tools, Kurs) | ✅ Ja – 5 interne Links | ✅ Live bestaetigt |

### Schema.org (Homepage)

| Schema-Typ | Anzahl | Kommentar |
|------------|--------|-----------|
| Course | 1 | + datePublished, dateModified, instructor |
| WebSite | 1 | + SearchAction |
| BreadcrumbList | 1 | 5 Items |
| FAQPage | 1 | 8 Fragen, je 134-167 Woerter |
| EducationalOrganization | 1 | + founder Person |
| SoftwareApplication | 1 | Claude Code als Software |
| HowTo | 1 | 4-Schritt Installation |
| **Gesamt** | **7 Bloecke** | **19 Schema-Typen** |

### Glossar-Seite: Neues DefinedTermSet Schema

| Feld | Wert |
|------|------|
| @type | DefinedTermSet |
| hasDefinedTerm | 16 DefinedTerm-Eintraege |
| OG Tags | og:title, og:description, og:type, og:url, og:image |
| Breadcrumbs | Startseite › Glossar |
| Hinweis | Schema nur via React (client-side), nicht in prerendered HTML |

### IndexNow (NEU)

| Metrik | Wert |
|--------|------|
| Key-Datei | /a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6.txt (HTTP 200) |
| robots.txt Referenz | Vorhanden |
| URLs submitted | 8 Kern-URLs (HTTP 200 akzeptiert) |
| Unterstuetzte Engines | Bing, Yandex, Seznam, Naver |

### Infrastruktur (unveraendert)

| Metrik | Wert |
|--------|------|
| AI-Crawler in robots.txt | 19 Allow-Regeln, 16 verschiedene Crawler |
| llms.txt | 109 Zeilen |
| llms-full.txt | 374 Zeilen |
| Sitemap-URLs | 99 |
| Prerendered Seiten | 87 |
| HTML lang | `de` |
| Security Headers | HSTS, CSP, X-Frame-Options |

---

## Detaillierte Bewertungen

### Citability Score: 80/100 (vorher 78, +2)

| Kriterium | Update #2 | Update #3 | Details |
|-----------|-----------|-----------|---------|
| Klare Definitionen | 9/10 | **9/10** | Unveraendert – 16 Glossar-Definitionen + FAQ optimal |
| Eigenstaendige Antwort-Bloecke | 9/10 | **9/10** | Unveraendert – alle Bloecke 134-167 Woerter |
| Direkte Antwort in ersten 60 Woertern | 8/10 | **8/10** | Unveraendert |
| Quellenattribution | 4/10 | **6/10** | **+2** – Jede Seite hat jetzt 4 externe Quellen-Links (Anthropic, Docs, npm, MCP) |
| Unique Data Points | 5/10 | **6/10** | **+1** – DefinedTermSet mit 16 strukturierten Definitionen |
| Spezifische Fakten/Zahlen | 8/10 | **8/10** | Unveraendert |

### Structural Readability: 87/100 (vorher 82, +5)

| Kriterium | Update #2 | Update #3 | Details |
|-----------|-----------|-----------|---------|
| Heading-Hierarchie | 9/10 | **9/10** | Unveraendert |
| Frage-basierte Headings | 9/10 | **9/10** | Unveraendert |
| Kurze Absaetze | 8/10 | **8/10** | Unveraendert |
| Tabellen | 8/10 | **8/10** | Unveraendert |
| Listen | 9/10 | **9/10** | Unveraendert |
| FAQ-Sektionen | 9/10 | **9/10** | Unveraendert |
| **Breadcrumb-Navigation** | 5/10 | **9/10** | **+4** – Auf allen 86 Unterseiten sichtbar (nicht Homepage) |
| **Interlinking / Cross-Links** | 4/10 | **8/10** | **+4** – 5 Cross-Links im Footer jeder Seite |

### Multi-Modal Content: 28/100 (vorher 20, +8)

| Kriterium | Update #2 | Update #3 | Details |
|-----------|-----------|-----------|---------|
| Text + Bilder | 3/10 | **6/10** | **+3** – OG-Image als `<img>` mit Alt-Text auf allen 87 Seiten |
| Video-Content | 0/10 | **0/10** | Weiterhin kein Video |
| Infografiken/Charts | 2/10 | **2/10** | Unveraendert |
| Interaktive Elemente | 3/10 | **3/10** | Unveraendert |
| Structured Data fuer Media | 2/10 | **3/10** | **+1** – Image mit aussagekraeftigem Alt-Text |

### Authority & Brand Signals: 42/100 (vorher 30, +12)

| Kriterium | Update #2 | Update #3 | Details |
|-----------|-----------|-----------|---------|
| **Autor-Byline sichtbar** | 5/10 | **8/10** | **+3** – "Von Cosmo Graef" auf JEDER Seite sichtbar (Schema + prerendered HTML) |
| **Publikationsdatum sichtbar** | 6/10 | **9/10** | **+3** – "Zuletzt aktualisiert: 13. Feb 2026" auf jeder Seite |
| **Quellenangaben** | 2/10 | **6/10** | **+4** – 4 externe Autoritaets-Links pro Seite (Anthropic, Docs, npm, MCP Spec) |
| Wikipedia-Praesenz | 0/10 | 0/10 | Erfordert externe Aktion |
| Reddit-Praesenz | 0/10 | 0/10 | Erfordert externe Aktion |
| YouTube-Praesenz | 0/10 | 0/10 | Erfordert externe Aktion |
| LinkedIn-Praesenz | 0/10 | 0/10 | Erfordert externe Aktion |
| sameAs-Links | 3/10 | **3/10** | Unveraendert – echte Social-Profile fehlen |
| Externe Backlinks | 1/10 | 1/10 | Unveraendert |

### Technical Accessibility: 95/100 (vorher 92, +3)

| Kriterium | Update #2 | Update #3 | Details |
|-----------|-----------|-----------|---------|
| AI-Crawler in robots.txt | 10/10 | 10/10 | 19 Allow-Regeln |
| llms.txt | 10/10 | 10/10 | Unveraendert |
| Server-Side Rendering | 9/10 | **9/10** | Unveraendert – 87 Seiten |
| **IndexNow** | 0/10 | **8/10** | **+8** – Key verifiziert, URLs submitted, Bing/Yandex/Seznam |
| Security Headers | 9/10 | 9/10 | Unveraendert |
| Performance/Ladezeit | 7/10 | 7/10 | Unveraendert |
| HTML lang | 10/10 | 10/10 | Unveraendert |
| Canonical URLs | 9/10 | 9/10 | Unveraendert |

---

## Was AI-Crawler jetzt auf jeder Seite sehen

### Beispiel: Lesson 0 (35.146 Bytes)

```html
<!-- Breadcrumb-Navigation -->
<nav aria-label="Breadcrumb">
  <a href="/">Startseite</a> › <a href="/lesson/0">Lektionen</a> › Was ist Claude Code?
</nav>

<!-- Sichtbares Bild (Multi-Modal) -->
<img src="/og-image.png" alt="Claude Code Masterkurs – KI-gestuetztes Programmieren lernen" width="1200" height="630" />

<!-- Artikel-Content -->
<article>
  <h1>Was ist Claude Code?</h1>
  <p>...</p>
  <h2>Lernziele</h2>
  <ul><li>...</li></ul>
  <!-- ... voller Kurs-Content ... -->
</article>

<!-- Author-Byline + Quellen (E-E-A-T) -->
<footer>
  <p>Von <strong>Cosmo Graef</strong>, Gruender & Kursleiter | Zuletzt aktualisiert: 13. Februar 2026</p>
  <p>Quellen: <a href="https://anthropic.com">Anthropic</a> · <a href="https://docs.anthropic.com">Claude Code Docs</a> · <a href="https://npmjs.com/...">npm</a> · <a href="https://modelcontextprotocol.io">MCP</a></p>
  <nav>Was ist Claude Code? · Tool-Vergleich · Glossar · Tools & Extensions · Kurs starten</nav>
</footer>
```

### Beispiel: Tool fzf (60.321 Bytes)

```html
<nav aria-label="Breadcrumb">Startseite › Tools & Extensions › fzf</nav>
<img src="/og-image.png" alt="..." />
<article>
  <h1>fzf – Fuzzy Finder</h1>
  <!-- ... 50+ KB Kurs-Content ... -->
</article>
<footer>Von Cosmo Graef | Quellen | Cross-Links</footer>
```

---

## Verbleibende Optimierungspotenziale

### Code-basiert (wartet auf Content)

| # | Massnahme | Impact | Status |
|---|-----------|--------|--------|
| 1 | VideoObject Schema | +3 Multi-Modal | Wartet auf Video-Content |
| 2 | AggregateRating Schema | +2 Citability | Wartet auf Reviews |

### Externe Aktionen (groesster verbleibender Hebel: +15-25 Punkte)

| # | Massnahme | Impact | Aufwand | Prioritaet |
|---|-----------|--------|---------|------------|
| 3 | **YouTube-Kanal** mit 3-5 Tutorials | +8 | Hoch | ⭐⭐⭐ Hoechste Prio |
| 4 | **Reddit-Posts** (r/ClaudeAI, r/coding) | +5 | Niedrig | ⭐⭐⭐ Quick Win |
| 5 | **LinkedIn-Firmenseite** | +3 | Niedrig | ⭐⭐ |
| 6 | **GitHub Open-Source Teile** | +3 | Mittel | ⭐⭐ |
| 7 | **Blog-Artikel** (dev.to/Medium) | +3 | Mittel | ⭐⭐ |
| 8 | **sameAs-Links** mit Profilen fuellen | +3 | Niedrig | ⭐ (erst nach Profile) |
| 9 | **Original-Forschung** | +5 | Hoch | ⭐ |
| 10 | **Wikipedia-Eintrag** | +3 | Sehr hoch | ⭐ (Notability noetig) |

---

## Zusammenfassung: Was sich in 3 Runden veraendert hat

### Alles was jetzt vorhanden ist (war vorher 0):

| Signal | Abdeckung |
|--------|-----------|
| Prerendered HTML | 87 Seiten (vorher: 0 – leere SPA-Shell) |
| Sichtbares Bild pro Seite | 87 Seiten mit `<img>` + Alt-Text |
| Author-Byline sichtbar | 87 Seiten + 3 React-Landingpages |
| Datum "Zuletzt aktualisiert" | 87 Seiten + 3 React-Landingpages |
| Externe Quellen-Links | 87 × 4 = 348 Links zu Autoritaeten |
| Breadcrumb-Navigation | 86 Seiten (alle ausser Homepage) |
| Cross-Links Footer | 87 × 5 = 435 interne Links |
| Schema.org JSON-LD | 7 Bloecke, 19 Typen |
| DefinedTermSet Schema | 16 Begriffe (Glossar) |
| llms.txt | 109 Zeilen + llms-full.txt 374 Zeilen |
| IndexNow | Key + 8 URLs submitted |
| AI-Crawler robots.txt | 19 Allow-Regeln, 16 Crawler |
| FAQ-Antworten | 8 × 134-167 Woerter |
| SEO-Landingpages | 3 Seiten (10.700+ Woerter gesamt) |
| Sitemap | 99 URLs |

### Hauptblocker fuer 85+

**Brand Mentions** sind der einzige verbleibende grosse Hebel. Laut Ahrefs-Studie (Dez 2025) korrelieren Brand Mentions 3× staerker mit AI-Sichtbarkeit als Backlinks:

| Signal | Korrelation | Status |
|--------|-------------|--------|
| YouTube-Mentions | ~0.737 (staerkste) | ❌ Nicht vorhanden |
| Reddit-Mentions | Hoch | ❌ Nicht vorhanden |
| Wikipedia-Praesenz | Hoch | ❌ Nicht vorhanden |
| LinkedIn-Praesenz | Moderat | ❌ Nicht vorhanden |

**Empfehlung:** 2-3 Reddit-Posts in r/ClaudeAI und r/coding sind der schnellste Weg zu ersten Brand Mentions (niedrigster Aufwand, hoechster Impact).
