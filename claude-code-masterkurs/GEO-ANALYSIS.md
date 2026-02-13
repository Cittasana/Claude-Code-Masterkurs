# GEO-Analyse: claude-code-masterkurs.de

**Datum:** 13. Februar 2026
**Analysiert:** https://claude-code-masterkurs.de/
**Methode:** Generative Engine Optimization (GEO) nach aktuellen Standards

---

## GEO Readiness Score: 31/100

| Kategorie | Gewicht | Score | Gewichtet |
|-----------|---------|-------|-----------|
| Citability Score | 25% | 35/100 | 8.75 |
| Structural Readability | 20% | 40/100 | 8.00 |
| Multi-Modal Content | 15% | 15/100 | 2.25 |
| Authority & Brand Signals | 20% | 15/100 | 3.00 |
| Technical Accessibility | 20% | 45/100 | 9.00 |
| **Gesamt** | **100%** | | **31/100** |

### Bewertungsskala
- 80-100: Exzellent (AI-Suchmaschinen zitieren aktiv)
- 60-79: Gut (gelegentliche AI-Zitierungen)
- 40-59: Ausbaufaehig (selten zitiert)
- 20-39: Schwach (kaum sichtbar fuer AI-Suche)
- 0-19: Kritisch (unsichtbar)

---

## Platform Breakdown

| Platform | Score | Status |
|----------|-------|--------|
| Google AI Overviews | 25/100 | Schwach - SPA-Content unsichtbar, Schema.org vorhanden |
| ChatGPT Web Search | 35/100 | Schwach - llms.txt hilft, aber keine Wikipedia/Reddit-Praesenz |
| Perplexity AI | 30/100 | Schwach - Keine Reddit-Diskussionen, kein User-Generated Content |
| Bing Copilot | 20/100 | Sehr schwach - Kein SSR, keine Bing-spezifische Optimierung |

---

## 1. AI Crawler Access Status

### robots.txt: EXZELLENT (10/10)

14 AI-Crawler explizit erlaubt:

| Crawler | Owner | Status |
|---------|-------|--------|
| GPTBot | OpenAI | Erlaubt |
| ChatGPT-User | OpenAI | Erlaubt |
| OAI-SearchBot | OpenAI | Erlaubt |
| Google-Extended | Google AI | Erlaubt |
| ClaudeBot | Anthropic | Erlaubt |
| anthropic-ai | Anthropic | Erlaubt |
| PerplexityBot | Perplexity | Erlaubt |
| Meta-ExternalAgent | Meta | Erlaubt |
| FacebookBot | Meta | Erlaubt |
| Applebot-Extended | Apple | Erlaubt |
| CCBot | Common Crawl | Erlaubt |
| cohere-ai | Cohere | Erlaubt |
| AI2Bot | AI21 | Erlaubt |
| Amazonbot | Amazon | Erlaubt |
| Bytespider | ByteDance | Erlaubt |
| Diffbot | Diffbot | Erlaubt |

**Bewertung:** Vorbildlich. Alle relevanten AI-Crawler haben Zugang. Private Seiten (/login, /register, /api/) korrekt ausgeschlossen.

---

## 2. llms.txt Status

### llms.txt: GUT (7/10)

**Vorhanden:** Ja, unter `/llms.txt`
**Groesse:** 89 Zeilen, gut strukturiert
**Inhalt:**
- Kursueberblick mit Eckdaten
- "Was ist Claude Code?" Definition
- Komplette Kursstruktur (3 Levels, 27 Lektionen)
- Zusaetzliche Features (Playground, Challenges, Forum)
- FAQ-Bereich (4 Fragen)
- Link zu llms-full.txt

**Verbesserungspotenzial:**
- Anzahl Lektionen inkonsistent: llms.txt sagt "27", index.html sagt "70"
- Kein Preis-Update: llms.txt sagt "kostenlos", Seite hat Abo-Modelle (24/229/499 EUR)
- Fehlende Statistiken/Zahlen (z.B. Nutzerzahlen, Completion Rate)

### llms-full.txt: GUT (7/10)

**Vorhanden:** Ja, unter `/llms-full.txt`
**Groesse:** 307 Zeilen, sehr detailliert
**Staerken:**
- Vergleichstabelle Claude Code vs. Copilot vs. Cursor vs. Windsurf (exzellent fuer AI-Zitierung)
- Detaillierte Lektionsbeschreibungen mit URLs
- Schluesselkonzepte erklaert (CLAUDE.md, MCP, Agentic Coding, Context Engineering)
- Umfangreicher FAQ-Bereich
- Technische Details zum Tech Stack

**Verbesserungspotenzial:**
- Gleiche Inkonsistenz bei Lektionsanzahl (27 vs. 70)
- Preis-Inkonsistenz (kostenlos vs. Abo-Modelle)
- Keine Erwaehnung der 43 Tools & Extensions Lektionen
- Kein Gruender/Autor mit Credentials genannt

### HTML-Integration: GUT

```html
<link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM-optimierte Kursbeschreibung" />
<link rel="alternate" type="text/markdown" href="/llms-full.txt" title="LLM-optimierte Kursbeschreibung (vollständig)" />
```

Korrekt im `<head>` referenziert.

---

## 3. Brand Mention Analysis: KRITISCH (2/10)

**Kernerkenntnis:** Brand Mentions korrelieren 3x staerker mit AI-Sichtbarkeit als Backlinks (Ahrefs Studie, Dez 2025). Der Claude Code Masterkurs hat praktisch KEINE externen Brand Mentions.

| Plattform | Korrelation mit AI-Zitierungen | Status | Praesenz |
|-----------|-------------------------------|--------|----------|
| YouTube | ~0.737 (staerkste) | Nicht vorhanden | Kein Kanal, keine Videos |
| Reddit | Hoch | Nicht vorhanden | Keine Erwaehnung in Subreddits |
| Wikipedia | Hoch | Nicht vorhanden | Kein Artikel |
| LinkedIn | Moderat | Nicht vorhanden | Kein Firmenprofil |
| GitHub | Moderat | Nicht vorhanden | Kein oeffentliches Repo |
| Trustpilot/ProvenExpert | Moderat | Nicht vorhanden | Keine Reviews |
| Externe Backlinks | ~0.266 (schwach) | Nicht vorhanden | Keine externen Verlinkungen gefunden |

### Wettbewerber-Kontext

Mehrere englischsprachige Claude Code Kurse existieren bereits:
- masterclaudecode.com (Ray Amjad)
- claudecodemasterclass.com (Medium Creator, 400K+ Audience)
- ccforpms.com (Carl Vellotti)
- ccforeveryone.com

**Differenzierung:** Einziger deutschsprachiger Claude Code Kurs. Diese Nische muss aktiv kommuniziert werden.

---

## 4. Passage-Level Citability Analysis

### KRITISCHES PROBLEM: SPA ohne Server-Side Rendering

**Was AI-Crawler auf JEDER Seite sehen:**

```html
<body>
  <div id="root">Lädt…</div>
</body>
```

AI-Crawler fuehren KEIN JavaScript aus. Das bedeutet:
- **0% des Seiteninhalts** ist fuer GPTBot, ClaudeBot, PerplexityBot sichtbar
- Alle 70+ Lektionen, 43 Tool-Seiten, FAQ, Playground: **komplett unsichtbar**
- Nur der `<head>` Bereich (Meta-Tags, Schema.org JSON-LD) wird gelesen
- Die llms.txt/llms-full.txt Dateien sind die EINZIGE inhaltliche Quelle fuer AI-Crawler

### Citability in llms.txt/llms-full.txt

**Gute zitierbare Passagen (134-167 Woerter, optimal):**

1. **"Was ist Claude Code?"** - 62 Woerter, klar und definitionsartig
   - Gut, aber zu kurz fuer optimale Zitierung. Auf ~150 Woerter erweitern.

2. **Vergleichstabelle** (llms-full.txt) - Exzellent fuer AI-Zitierung
   - Strukturierte Daten werden von AI-Suchmaschinen bevorzugt

3. **MCP-Erklaerung** - 54 Woerter
   - Zu kurz. Auf 134-167 Woerter erweitern mit konkreten Beispielen.

4. **FAQ-Antworten** - 30-80 Woerter pro Antwort
   - Alle zu kurz fuer optimale AI-Zitierung. Mindestens 134 Woerter pro Antwort.

### Schema.org JSON-LD: GUT (8/10)

6 Structured Data Blocks im `<head>`:
- Course (inkl. teaches-Array, numberOfLessons, CourseInstance)
- WebSite (mit SearchAction)
- BreadcrumbList (4 Items)
- FAQPage (8 Fragen mit Antworten)
- EducationalOrganization (mit knowsAbout)
- SoftwareApplication (Claude Code als Tool)

**Staerken:**
- FAQPage Schema wird von Google AI Overviews stark bevorzugt
- Course Schema mit detaillierten teaches-Feldern
- Breite Abdeckung verschiedener Entity-Typen

**Fehlend:**
- Person Schema (Gruender/Autor) - kritisch fuer E-E-A-T
- Review/AggregateRating Schema
- HowTo Schema (Installationsanleitung)
- VideoObject Schema

---

## 5. Server-Side Rendering Check: KRITISCH (Blocker)

### Aktuelle Architektur

```
Vite + React 19 SPA → Vercel Static Hosting
```

### Was verschiedene Crawler sehen

| Crawler-Typ | Sieht Content? | Details |
|-------------|---------------|---------|
| Googlebot (JS) | Ja (teilweise) | Google rendert JS, aber mit Verzoegerung |
| GPTBot (kein JS) | Nein | Sieht nur `<div id="root">Lädt…</div>` |
| ClaudeBot (kein JS) | Nein | Sieht nur leeres Root-Element |
| PerplexityBot (kein JS) | Nein | Sieht nur Meta-Tags und Schema |
| OAI-SearchBot (kein JS) | Nein | Sieht nur Head-Bereich |
| Bingbot (begrenzt JS) | Teilweise | Deutlich eingeschraenkt |

### Impact

- **92% der AI Overview Zitierungen** kommen von Seiten mit sichtbarem Content
- Ohne SSR/Prerendering sind alle dynamischen Seiten fuer AI-Suche unsichtbar
- Die llms.txt Dateien kompensieren teilweise, aber nur fuer die Startseite
- Individuelle Lektionen, Tools, Challenges: **vollstaendig unsichtbar**

---

## 6. Content Reformatting Suggestions

### A) llms.txt Inkonsistenzen beheben (SOFORT)

**Problem:** Mehrere Daten-Inkonsistenzen zwischen llms.txt, llms-full.txt und der tatsaechlichen Website.

| Feld | llms.txt | llms-full.txt | Website (index.html) | Korrekt |
|------|----------|---------------|---------------------|---------|
| Lektionen | 27 | 27 | 70 | 70 |
| Preis | Kostenlos | Kostenlos | 24/229/499 EUR | Freemium |
| Tools & Extensions | Nicht erwaehnt | Nicht erwaehnt | 43 Lektionen | 43 |

### B) Zitierbare Passagen optimieren (134-167 Woerter)

**Aktuelle "Was ist Claude Code?" Definition (62 Woerter):**
> Claude Code ist ein autonomer KI-Coding-Agent von Anthropic, der im Terminal laeuft. Im Gegensatz zu Autocomplete-Tools wie GitHub Copilot arbeitet Claude Code proaktiv: Es versteht ganze Projekte, liest Dateien, schreibt Code, erstellt Tests, fuehrt Git-Operationen durch und kommuniziert ueber MCP-Server mit externen Services. Es wird durch natuerliche Sprache gesteuert und kann komplexe Entwicklungsaufgaben eigenstaendig loesen.

**Empfohlene Erweiterung (~150 Woerter):**
> Claude Code ist ein autonomer KI-Coding-Agent von Anthropic, der im Terminal laeuft und durch natuerliche Sprache gesteuert wird. Im Gegensatz zu Autocomplete-Tools wie GitHub Copilot arbeitet Claude Code proaktiv und eigenstaendig: Es versteht ganze Projekte, liest und schreibt Dateien, erstellt Tests, fuehrt Git-Operationen durch und kommuniziert ueber das Model Context Protocol (MCP) mit externen Services wie Datenbanken, APIs und Issue-Trackern. Entwickler beschreiben eine Aufgabe in natuerlicher Sprache, und Claude Code plant die Umsetzung, analysiert die Codebasis, schreibt den Code, fuehrt Tests aus und erstellt Git-Commits – alles automatisch. Die Installation erfolgt ueber npm mit dem Befehl `npm install -g @anthropic-ai/claude-code` und erfordert Node.js 18 oder hoeher. Claude Code unterstuetzt alle gaengigen Programmiersprachen (Python, JavaScript, TypeScript, Rust, Go, Java, C++) und laeuft auf macOS, Linux und Windows (WSL2). Im Februar 2026 nutzen Tausende Entwickler weltweit Claude Code fuer taeglich Aufgaben von Bug-Fixes bis hin zu komplexen Feature-Implementierungen.

### C) FAQ-Antworten auf 134+ Woerter erweitern

Jede FAQ-Antwort sollte ein eigenstaendiger, zitierbarer Block sein. Aktuell sind alle Antworten 30-80 Woerter lang – deutlich unter dem Optimum.

---

## 7. Top 5 Highest-Impact Changes

### 1. KRITISCH: Server-Side Rendering / Prerendering implementieren
**Impact:** +40 Punkte potenzielle GEO-Score-Verbesserung
**Effort:** Hoch (2-5 Tage)
**Optionen:**
- **vite-plugin-prerender** (einfachste Option): Statische HTML-Generierung fuer alle Routes zur Build-Zeit
- **@remix-run/react** oder **Next.js Migration**: Full SSR Framework (hoechster Aufwand, bester Langzeit-Effekt)
- **Vercel Prerender** API: Serverless Prerendering bei Vercel

**Empfehlung:** `vite-plugin-prerender` fuer schnelle Umsetzung. Generiert statische HTML mit vollem Content fuer die ~100 wichtigsten Routes (Startseite, Lektionen, Tools, FAQ).

### 2. HOCH: Brand Mentions aufbauen
**Impact:** +15 Punkte potenzielle GEO-Score-Verbesserung
**Effort:** Mittel-Hoch (fortlaufend)
**Massnahmen:**
- YouTube-Kanal erstellen mit 5-10 Min Tutorials zu Claude Code
- Reddit-Praesenz in r/ClaudeAI, r/ArtificialIntelligence, r/coding
- LinkedIn-Firmenseite + regelmaessige Beitraege
- GitHub-Repository mit Open-Source Teilen des Kurses
- Blog-Artikel auf Medium/dev.to die auf den Kurs verlinken

### 3. HOCH: llms.txt und llms-full.txt aktualisieren
**Impact:** +10 Punkte potenzielle GEO-Score-Verbesserung
**Effort:** Niedrig (1-2 Stunden)
**Massnahmen:**
- Lektionsanzahl auf 70 korrigieren
- 43 Tools & Extensions Lektionen hinzufuegen
- Preismodell korrekt darstellen (Freemium: kostenlose Basis + Abo)
- Passagen auf 134-167 Woerter optimieren
- Gruender/Autor mit Credentials hinzufuegen
- Aktuelle Statistiken einbauen

### 4. HOCH: Person Schema + Autor-Sichtbarkeit
**Impact:** +8 Punkte potenzielle GEO-Score-Verbesserung
**Effort:** Niedrig-Mittel (1 Tag)
**Massnahmen:**
- Person Schema fuer den Gruender im JSON-LD hinzufuegen
- Autor-Byline auf allen Seiten
- "Ueber den Autor" Seite mit Credentials
- sameAs-Links zu LinkedIn, GitHub, Twitter

### 5. MITTEL: Vergleichs- und Definitionsseiten erstellen
**Impact:** +7 Punkte potenzielle GEO-Score-Verbesserung
**Effort:** Mittel (3-5 Tage)
**Massnahmen:**
- Eigenstaendige Vergleichsseite: "Claude Code vs GitHub Copilot vs Cursor"
- Glossar-Seite: Definitionen fuer MCP, CLAUDE.md, Agentic Coding, etc.
- "Was ist Claude Code?" Landingpage mit 2000+ Woertern
- Diese Seiten MUESSEN per SSR/Prerendering verfuegbar sein

---

## 8. Schema Recommendations

### Fehlende Schemas (nach Prioritaet)

#### 1. Person Schema (Gruender) - HOCH
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "[Gruender-Name]",
  "jobTitle": "Founder & Creator",
  "worksFor": {
    "@type": "Organization",
    "name": "Claude Code Masterkurs"
  },
  "sameAs": [
    "https://linkedin.com/in/[profil]",
    "https://github.com/[profil]"
  ],
  "knowsAbout": ["Claude Code", "AI-gestütztes Programmieren", "Anthropic"]
}
```

#### 2. HowTo Schema (Installation) - MITTEL
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Claude Code installieren",
  "description": "Schritt-fuer-Schritt Anleitung zur Installation von Claude Code",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Node.js installieren",
      "text": "Installiere Node.js Version 18 oder hoeher von nodejs.org"
    },
    {
      "@type": "HowToStep",
      "name": "Claude Code installieren",
      "text": "Fuehre 'npm install -g @anthropic-ai/claude-code' im Terminal aus"
    },
    {
      "@type": "HowToStep",
      "name": "Claude Code starten",
      "text": "Starte Claude Code mit dem Befehl 'claude' und authentifiziere dich"
    }
  ]
}
```

#### 3. VideoObject Schema (wenn Videos erstellt werden) - NIEDRIG
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Claude Code Tutorial: Erste Schritte",
  "description": "...",
  "thumbnailUrl": "...",
  "uploadDate": "2026-02-13",
  "duration": "PT10M",
  "embedUrl": "..."
}
```

---

## 9. Detaillierte Bewertungen

### Citability Score: 35/100

| Kriterium | Score | Details |
|-----------|-------|---------|
| Klare Definitionen | 6/10 | Gute "Was ist...?" Patterns in llms.txt, aber zu kurz |
| Eigenstaendige Antwort-Bloecke | 4/10 | FAQ vorhanden, aber Antworten < 134 Woerter |
| Direkte Antwort in ersten 60 Woertern | 5/10 | llms.txt beginnt gut, Webseite unsichtbar |
| Quellenattribution | 2/10 | Keine Statistiken, keine Quellenangaben |
| Unique Data Points | 3/10 | Keine eigene Forschung, keine exklusiven Daten |
| Spezifische Fakten/Zahlen | 5/10 | Preise und Lektionsanzahl vorhanden, mehr noetig |

### Structural Readability: 40/100

| Kriterium | Score | Details |
|-----------|-------|---------|
| Heading-Hierarchie | 7/10 | Sauber in llms.txt, unsichtbar auf Webseite |
| Frage-basierte Headings | 6/10 | FAQ vorhanden, koennten mehr sein |
| Kurze Absaetze | 5/10 | Akzeptabel in llms.txt |
| Tabellen | 7/10 | Vergleichstabelle in llms-full.txt (exzellent) |
| Listen | 5/10 | Vorhanden, aber nicht auf Webseiten sichtbar |
| FAQ-Sektionen | 6/10 | Schema + llms.txt, Antworten zu kurz |

### Multi-Modal Content: 15/100

| Kriterium | Score | Details |
|-----------|-------|---------|
| Text + Bilder | 2/10 | Bilder nur via JS sichtbar |
| Video-Content | 0/10 | Kein Video-Content vorhanden |
| Infografiken/Charts | 1/10 | Nur JS-gerenderte Charts |
| Interaktive Elemente | 2/10 | Playground existiert, aber unsichtbar fuer Crawler |
| Structured Data fuer Media | 0/10 | Kein VideoObject/ImageObject Schema |

### Authority & Brand Signals: 15/100

| Kriterium | Score | Details |
|-----------|-------|---------|
| Autor-Byline mit Credentials | 0/10 | Kein Autor sichtbar |
| Publikationsdatum | 2/10 | Nur in Sitemap, nicht auf Seiten |
| Quellenangaben | 1/10 | Keine externen Quellen zitiert |
| Wikipedia-Praesenz | 0/10 | Nicht vorhanden |
| Reddit-Praesenz | 0/10 | Nicht vorhanden |
| YouTube-Praesenz | 0/10 | Nicht vorhanden |
| LinkedIn-Praesenz | 0/10 | Nicht vorhanden |
| sameAs-Links | 1/10 | Leeres Array in Schema |
| Externe Backlinks | 1/10 | Keine externen Links gefunden |

### Technical Accessibility: 45/100

| Kriterium | Score | Details |
|-----------|-------|---------|
| AI-Crawler in robots.txt | 10/10 | Vorbildlich, 14+ Crawler erlaubt |
| llms.txt vorhanden | 8/10 | Gut, mit Verbesserungspotenzial |
| Server-Side Rendering | 0/10 | KRITISCH - Reines SPA, kein SSR |
| Security Headers | 9/10 | HSTS, CSP, X-Frame-Options, etc. |
| Performance/Ladezeit | 7/10 | Vercel CDN, gutes Caching |
| HTML lang-Attribut | 10/10 | `lang="de"` korrekt gesetzt |
| Canonical URLs | 8/10 | Vorhanden auf Startseite |

---

## 10. Zusammenfassung & Roadmap

### Sofort (Impact: KRITISCH, Effort: NIEDRIG)
1. llms.txt und llms-full.txt aktualisieren (Lektionsanzahl, Preise, Tools)
2. FAQ-Antworten auf 134-167 Woerter erweitern
3. Person Schema fuer Gruender hinzufuegen
4. sameAs-Array in Schema mit echten Profil-Links fuellen

### Kurzfristig (Impact: KRITISCH, Effort: MITTEL-HOCH)
5. **Prerendering implementieren** (vite-plugin-prerender) fuer alle statischen Routes
6. YouTube-Kanal starten mit 3-5 Einfuehrungs-Videos
7. Reddit-Praesenz aufbauen (r/ClaudeAI Posts)

### Mittelfristig (Impact: HOCH, Effort: HOCH)
8. Eigenstaendige SEO-Landingpages mit SSR: "Was ist Claude Code?", "Claude Code vs Copilot"
9. LinkedIn-Firmenseite + Content-Strategie
10. Blog/Artikel auf externen Plattformen (dev.to, Medium)

### Langfristig (Impact: HOCH, Effort: SEHR HOCH)
11. Full SSR Migration (Remix/Next.js) oder Vercel Prerendering
12. Wikipedia-Eintrag fuer Brand (erfordert Notability)
13. Original-Forschung/Surveys fuer unique Citability
14. Community-Building fuer organische Brand Mentions

---

**Fazit:** Die technische Grundlage (robots.txt, llms.txt, Schema.org) ist solide. Der Hauptblocker ist das fehlende SSR/Prerendering – AI-Crawler sehen auf keiner Seite tatsaechlichen Content. Zweitens fehlen externe Brand Mentions komplett. Die Kombination aus Prerendering + Brand-Aufbau koennte den GEO-Score von 31 auf 65+ steigern.
