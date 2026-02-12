# 38. MCP Server: Brave Search

**Kategorie**: Research MCP Server
**Schwierigkeit**: Anfänger
**Installation**: `npx @modelcontextprotocol/create-server brave-search`
**Offizielle Docs**: [MCP Brave Search Server](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search)

---

> 🚀 **Claude Code Relevanz**: Der Brave Search MCP Server erweitert Claude Code um Echtzeit-Web-Recherche, sodass aktuelle Dokumentationen, Library-Versionen und Best Practices direkt in deinen Entwicklungs-Workflow einfliessen.

## 🎯 Was ist der Brave Search MCP Server?

Der **Brave Search MCP Server** gibt Claude Code die Fähigkeit, **das Web in Echtzeit zu durchsuchen** - perfekt für Research, Fact-Checking und das Abrufen aktueller Informationen. Claude kann direkt Web-Suchen durchführen, ohne dass du manuell googeln musst.

### Warum Brave Search?

**Brave** ist eine privacy-first Search Engine ohne Tracking:
- **No Tracking**: Keine User-Profile, keine Datensammlerei
- **Independent Index**: Eigener Search Index (nicht Google/Bing)
- **AI-Friendly API**: Strukturierte JSON-Responses
- **Rate Limits**: Faire Free Tier (2.000 Requests/Monat gratis)

---

## 🔧 Berechtigung

Dieser Abschnitt erklaert, warum Echtzeit-Websuche fuer Claude Code wichtig ist und welche typischen Szenarien davon profitieren.

### Warum brauchst du den Brave Search MCP Server?

1. **Real-Time Information**: Claude kennt nur Daten bis Mai 2025 → Web Search für Aktualität
2. **Fact-Checking**: Validiere Aussagen mit aktuellen Quellen
3. **Research Automation**: Claude recherchiert automatisch für dich
4. **Code Examples**: Suche nach Library-Docs, Stack Overflow Solutions
5. **Market Research**: Competitive Analysis, Trend Research

### Use Cases

- **"Was ist die aktuelle Version von React?"** → Web Search statt veraltetes Wissen
- **"Find Tutorials für Next.js App Router"** → Claude sucht und fasst zusammen
- **"Vergleiche Pricing von Stripe vs. PayPal"** → Aktuelle Pricing-Info
- **"Wer hat die letzte Weltmeisterschaft gewonnen?"** → Current Events

---

## 🎯 Zwecke

Die fuenf Hauptbereiche zeigen, wofuer du den Brave Search MCP Server einsetzen kannst -- von aktuellen News bis zur technischen Recherche.

Der Brave Search MCP Server wird verwendet für:

### 1. **Aktuelle Informationen**
- News & Current Events
- Software Versions & Releases
- Pricing & Product Info

### 2. **Research & Fact-Checking**
- Validiere Behauptungen
- Finde Quellen
- Compare Informationen

### 3. **Technical Documentation**
- Library Docs
- API References
- Code Examples

### 4. **Market Research**
- Competitor Analysis
- Trend Research
- Customer Reviews

### 5. **Problem Solving**
- Stack Overflow Search
- GitHub Issues
- Error Messages debuggen

---

## 💻 Verwendung

Von der API-Key-Erstellung bis zur fertigen Konfiguration -- dieser Abschnitt fuehrt dich Schritt fuer Schritt durch das Setup.

### Installation & Setup

#### 1. Brave API Key holen

1. Gehe zu [Brave Search API](https://brave.com/search/api/)
2. Registriere dich (Free Tier: 2.000 Requests/Monat)
3. Erstelle API Key

#### 2. MCP Server installieren

Die folgenden Befehle installieren den Brave Search MCP Server:
```bash
# NPM Package installieren
npm install -g @modelcontextprotocol/server-brave-search

# Oder via npx
npx @modelcontextprotocol/create-server brave-search
```

#### 3. Konfiguration

Die Konfiguration setzt den API Key und optionale Sucheinstellungen wie Sprache und Land. Fuer deutsche Ergebnisse sind `country` und `language` besonders wichtig.

**~/.config/mcp/brave-search.json**:
```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-brave-search"
      ],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      },
      "options": {
        "maxResults": 10,
        "safeSearch": "moderate",
        "country": "DE",       // Für deutsche Ergebnisse
        "language": "de"
      }
    }
  }
}
```

> ⚠️ **Warnung**: Speichere deinen Brave API Key niemals direkt in der MCP-Konfigurationsdatei, wenn diese in einem Git-Repository liegt. Nutze stattdessen Umgebungsvariablen oder eine `.env`-Datei, die in `.gitignore` eingetragen ist.

**Oder in `.env` File**:
```bash
# .env
BRAVE_API_KEY=your_brave_api_key_here
```

### Claude Code Integration

**Im Chat**:
```bash
Du: "Was ist die aktuelle Version von TypeScript?"

Claude:
[nutzt brave_search.search MCP Tool]
→ "TypeScript 5.3 ist die aktuelle Version (Released: November 2023)"

Du: "Find mir Tutorials für Supabase Auth"

Claude:
[brave_search.search("Supabase authentication tutorial")]
→ Findet Top-5 Tutorials, fasst zusammen:
   "Hier sind die besten Tutorials:
   1. Official Docs: supabase.com/docs/auth
   2. YouTube: 'Supabase Auth in 10 Minutes'
   3. Blog: 'Complete Supabase Auth Guide'"
```

### Available MCP Tools

Der Brave Search Server stellt folgende Tools bereit:

#### 1. `brave_search`

Die Standard-Websuche gibt eine Liste von Ergebnissen mit Titel, URL, Beschreibung und Alter zurueck:
```json
{
  "name": "brave_search",
  "description": "Search the web",
  "parameters": {
    "query": "Next.js App Router tutorial",
    "count": 10,
    "offset": 0
  }
}
```

**Response**:
```json
{
  "results": [
    {
      "title": "Next.js App Router Documentation",
      "url": "https://nextjs.org/docs/app",
      "description": "Complete guide to Next.js App Router...",
      "age": "2 days ago"
    }
  ],
  "query": "Next.js App Router tutorial",
  "totalResults": 1250000
}
```

#### 2. `brave_search_news`

Spezialisierte News-Suche mit Freshness-Filter, um nur Ergebnisse aus einem bestimmten Zeitraum zu erhalten:
```json
{
  "name": "brave_search_news",
  "description": "Search news articles",
  "parameters": {
    "query": "AI developments 2026",
    "freshness": "day"  // day, week, month
  }
}
```

#### 3. `brave_search_images`

Bildersuche fuer Design-Inspiration, UI-Referenzen oder visuelle Recherche:
```json
{
  "name": "brave_search_images",
  "description": "Search images",
  "parameters": {
    "query": "UI design inspiration",
    "count": 20
  }
}
```

---

## 🏆 Best Practices

Effiziente Suchstrategien sparen API-Requests und liefern bessere Ergebnisse. Die folgenden Tipps helfen dir, das Free-Tier-Kontingent optimal zu nutzen.

### 1. **Präzise Queries**

Je spezifischer deine Suchanfrage, desto relevanter die Ergebnisse. Fuege Technologie-Namen, Versionsnummern und das aktuelle Jahr hinzu:
```javascript
// ❌ Vage Queries
await brave.search({ query: "authentication" });

// ✅ Spezifische Queries
await brave.search({
  query: "Supabase JWT authentication Next.js 14 tutorial"
});

await brave.search({
  query: "TypeScript 5.3 new features release notes"
});
```

### 2. **Freshness für zeitkritische Infos**

Nutze den Freshness-Filter fuer News und aktuelle Entwicklungen, lasse ihn aber bei zeitlosen Dokumentationen weg:
```javascript
// News & Current Events
await brave.searchNews({
  query: "Claude Code new features",
  freshness: "week"  // Nur Ergebnisse der letzten Woche
});

// Technical Docs (Freshness weniger wichtig)
await brave.search({
  query: "React useState documentation"
  // Keine Freshness-Filter nötig
});
```

### 3. **Country & Language für lokale Ergebnisse**

Setze Land und Sprache in der Konfiguration, um standardmaessig deutsche Suchergebnisse zu erhalten:
```json
{
  "options": {
    "country": "DE",      // Deutsche Ergebnisse
    "language": "de",     // Deutsche Sprache
    "safeSearch": "strict"
  }
}
```

> 💡 **Tipp**: Setze `country` auf `"DE"` und `language` auf `"de"` in der Konfiguration, um standardmaessig deutsche Suchergebnisse zu erhalten -- besonders nuetzlich fuer lokale Marktrecherche und deutschsprachige Dokumentation.

### 4. **Result Limit beachten (Rate Limits)**

Fordere nur so viele Ergebnisse an wie noetig, um dein monatliches Kontingent zu schonen. Fuer die meisten Anfragen reichen 5 Ergebnisse:
```javascript
// ❌ Alle Requests mit maxResults
await brave.search({ query: "...", count: 100 });  // 100 Results

// ✅ Nur soviel wie nötig
await brave.search({ query: "...", count: 5 });    // 5 Results ausreichend
```

**Free Tier**: 2.000 Requests/Monat → ~65 Requests/Tag

### 5. **Cache für Repeated Queries**

Identische Suchanfragen innerhalb einer Session muessen nicht doppelt abgefragt werden. Ein einfacher In-Memory-Cache spart API-Requests:
```javascript
const cache = new Map();

async function cachedSearch(query) {
  if (cache.has(query)) {
    return cache.get(query);
  }

  const results = await brave.search({ query });
  cache.set(query, results);
  return results;
}
```

### 6. **Fallback bei Rate Limit**

Wenn das monatliche Kontingent erschoepft ist, kann ein alternativer Suchdienst als Fallback einspringen:
```javascript
async function searchWithFallback(query) {
  try {
    return await brave.search({ query });
  } catch (error) {
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      console.log("⚠️  Brave API Limit reached, using DuckDuckGo fallback");
      return await duckduckgoSearch(query);
    }
    throw error;
  }
}
```

---

## 📝 Beispiele (12+)

### Beispiel 1: Current Software Version Checker

```bash
Du: "Was ist die aktuelle Version von Node.js?"

Claude:
brave_search({ query: "Node.js current version" })

→ "Node.js v21.5.0 ist die aktuelle Version (Released: Dezember 2023)"
```

### Beispiel 2: Tutorial Finder

```bash
Du: "Find mir die besten Supabase Tutorials"

Claude:
brave_search({
  query: "best Supabase authentication tutorial 2026",
  count: 10
})

→ Findet und ranked Top-10 Tutorials:
  1. Official Docs (⭐⭐⭐⭐⭐)
  2. YouTube Tutorial (⭐⭐⭐⭐)
  3. Blog Post (⭐⭐⭐⭐)
```

### Beispiel 3: Error Message Solver

```bash
Du: "Ich bekomme 'Cannot read property of undefined' - was tun?"

Claude:
brave_search({
  query: "TypeError: Cannot read property of undefined JavaScript fix",
  count: 5
})

→ Findet Stack Overflow Solutions:
  "Häufige Ursachen:
  1. Object ist null/undefined
  2. Async/await nicht richtig gehandelt
  3. Optional chaining vergessen (obj?.prop)"
```

### Beispiel 4: Pricing Comparison

```bash
Du: "Vergleiche Pricing von Stripe vs. PayPal für SaaS"

Claude:
1. brave_search({ query: "Stripe pricing 2026" })
2. brave_search({ query: "PayPal pricing 2026" })
3. Erstellt Comparison Table

Ausgabe:
```
| Feature | Stripe | PayPal |
|---------|--------|--------|
| Transaction Fee | 2.9% + €0.30 | 3.4% + €0.35 |
| Monthly Fee | €0 | €0 |
| Setup Fee | €0 | €0 |
| Payout Time | 2-7 days | 1-3 days |

Recommendation: Stripe für SaaS (bessere Developer Experience)
```

> 🚀 **Beispiel**: Nutze Brave Search, um vor der Code-Generierung die aktuelle API-Dokumentation einer Library abzurufen. So arbeitet Claude immer mit den neuesten Best Practices statt mit veraltetem Wissen.

### Beispiel 5: Competitor Research

```bash
Du: "Analysiere die Wettbewerber von Vercel"

Claude:
1. brave_search({ query: "Vercel competitors 2026" })
2. brave_search({ query: "Netlify vs Vercel comparison" })
3. brave_search({ query: "Railway vs Vercel" })

Ausgabe:
```
Top Competitors:

1. Netlify
   - Strengths: Generous free tier, simple UI
   - Weaknesses: Slower build times

2. Railway
   - Strengths: Full-stack hosting, databases included
   - Weaknesses: Newer, smaller community

3. Cloudflare Pages
   - Strengths: Global CDN, unlimited bandwidth
   - Weaknesses: Limited backend support
```

### Beispiel 6: Library Recommendation

```bash
Du: "Was ist die beste React State Management Library?"

Claude:
brave_search({
  query: "best React state management 2026 zustand redux jotai"
})

Ausgabe:
```
Top Recommendations (2026):

1. Zustand (Most Popular)
   - Simple API, minimal boilerplate
   - Great TypeScript support
   - 35k+ GitHub stars

2. Jotai (Rising Star)
   - Atomic state management
   - Perfect for large apps
   - 15k+ stars

3. Redux Toolkit (Enterprise)
   - Battle-tested, mature
   - Best for complex apps
   - DevTools integration
```

### Beispiel 7: Migration Guide Finder

```bash
Du: "Wie migriere ich von Vue 2 zu Vue 3?"

Claude:
brave_search({
  query: "Vue 2 to Vue 3 migration guide official",
  count: 5
})

→ Findet Official Migration Guide:
  "Official Guide: https://v3-migration.vuejs.org/
   Key Changes:
   - Composition API
   - Teleport instead of Portal
   - Breaking changes in v-model"
```

### Beispiel 8: Security Vulnerability Check

```bash
Du: "Hat React 18.2.0 bekannte Security Issues?"

Claude:
brave_search({
  query: "React 18.2.0 security vulnerabilities CVE"
})

→ "Keine kritischen Vulnerabilities in React 18.2.0 bekannt.
   Latest Security Advisory: React 18.2.0 ist safe."
```

### Beispiel 9: API Documentation Finder

```bash
Du: "Wo finde ich die Stripe API Docs für Subscriptions?"

Claude:
brave_search({
  query: "Stripe API subscriptions documentation"
})

→ "Official API Docs:
   https://stripe.com/docs/api/subscriptions

   Quickstart:
   https://stripe.com/docs/billing/subscriptions/quickstart"
```

### Beispiel 10: Code Example Search

```bash
Du: "Zeig mir ein Beispiel für Next.js Server Actions"

Claude:
brave_search({
  query: "Next.js Server Actions example code GitHub"
})

→ Findet Code Examples:
```typescript
// Server Action Example
'use server'

export async function createUser(formData: FormData) {
  const name = formData.get('name')
  await db.user.create({ data: { name } })
}
```

### Beispiel 11: Design Inspiration

```bash
Du: "Find moderne Dashboard-Designs"

Claude:
brave_search_images({
  query: "modern dashboard UI design 2026",
  count: 20
})

→ "Gefunden: 20 Dashboard-Designs
   Top Trends:
   - Neumorphism
   - Dark Mode
   - Glassmorphism
   - Minimal Cards"
```

### Beispiel 12: Job Market Research

```bash
Du: "Wie viel verdient ein Senior React Developer in Berlin?"

Claude:
brave_search({
  query: "Senior React Developer salary Berlin 2026"
})

Ausgabe:
```
Salary Range (Berlin, 2026):

Junior React Dev: €45k - €60k
Mid-Level: €60k - €80k
Senior: €80k - €110k
Lead/Staff: €110k - €140k

Source: Glassdoor, Salary.com, StepStone
```

---

## 🔗 Integration mit Claude Code

### 1. **Automatic Research**

```bash
# Claude researcht automatisch wenn nötig
Du: "Erstelle eine Next.js 14 App mit Supabase Auth"

Claude:
1. brave_search("Next.js 14 Supabase authentication setup")
2. Liest Official Docs
3. Generiert Code basierend auf aktuellen Best Practices
```

### 2. **Fact-Checking**

```bash
Du: "Ist TypeScript 5.3 stabiler als 5.2?"

Claude:
1. brave_search("TypeScript 5.3 vs 5.2 stability comparison")
2. Findet Release Notes & Community Feedback
3. "Ja, TypeScript 5.3 hat mehrere Bug-Fixes..."
```

### 3. **Multi-Source Research**

```bash
Du: "Was sagen Experten über Bun vs. Node.js?"

Claude:
1. brave_search("Bun vs Node.js performance benchmark 2026")
2. brave_search_news("Bun adoption rate 2026")
3. Kombiniert Findings aus mehreren Quellen
```

---

## 🐛 Troubleshooting

Die haeufigsten Probleme betreffen den API Key, Rate Limits und unerwartete Suchergebnisse. Hier findest du die Ursachen und Loesungen.

### Problem 1: "API Key Invalid"

**Symptom**:
```
Error: 401 Unauthorized - Invalid API Key
```

**Ursache**: Der API Key ist falsch, abgelaufen oder nicht korrekt in der Konfiguration hinterlegt. Pruefe ob Leerzeichen oder Zeilenumbrueche im Key enthalten sind.

**Lösung**:

Ueberprüfe den Key und generiere bei Bedarf einen neuen auf der Brave-Website:
```bash
# Check API Key
echo $BRAVE_API_KEY

# Neu generieren auf brave.com/search/api/
# Update in ~/.config/mcp/brave-search.json
{
  "env": {
    "BRAVE_API_KEY": "NEW_KEY_HERE"
  }
}
```

### Problem 2: Rate Limit Exceeded

**Symptom**:
```
Error: 429 Too Many Requests
```

**Ursache**: Das monatliche Kontingent von 2.000 Requests (Free Tier) ist aufgebraucht, oder du sendest zu viele Anfragen in kurzer Zeit.

**Lösung**:

Implementiere Caching fuer wiederholte Anfragen oder upgrade auf den Paid Plan:
```javascript
// Implement Caching
const resultCache = new Map();

// Oder: Upgrade Plan auf brave.com
// Paid Plan: 50.000 Requests/Monat ($5/month)
```

### Problem 3: Keine Ergebnisse

**Symptom**: `results: []`

**Ursache**: Die Suchanfrage ist zu spezifisch oder der Freshness-Filter schliesst relevante Ergebnisse aus.

**Lösung**:

Verallgemeinere die Suchanfrage und entferne restriktive Filter:
```javascript
// Query zu spezifisch → Broaden
"React TypeScript ESLint Config 2026"  // ❌ Zu spezifisch
"React TypeScript setup"                // ✅ Breiter

// Oder: Remove Freshness Filter
brave_search({ query: "...", freshness: "month" })  // ❌
brave_search({ query: "..." })                      // ✅
```

### Problem 4: Falsche Country Results

**Symptom**: US-Ergebnisse statt deutsche

**Ursache**: Die Sprach- und Laendereinstellungen sind nicht gesetzt, sodass Brave den Standard (US/EN) verwendet.

**Lösung**:

Setze Country und Language explizit in der Konfiguration:
```json
{
  "options": {
    "country": "DE",  // ISO Country Code
    "language": "de"   // Language Code
  }
}
```

---

## 🆚 Vergleich mit Alternativen

| Feature | Brave Search | Google API | DuckDuckGo API | Bing API |
|---------|-------------|------------|----------------|----------|
| **Privacy** | ✅ No Tracking | ❌ Tracks Users | ✅ Privacy-First | ❌ Tracks Users |
| **Free Tier** | ✅ 2k/month | ❌ Paid Only | ✅ Limited | ✅ 3k/month |
| **MCP Integration** | ✅ Official Server | ❌ DIY | ❌ DIY | ❌ DIY |
| **Result Quality** | ✅ Good | ✅ Best | ❌ Average | ✅ Good |
| **AI-Friendly API** | ✅ JSON Structured | ✅ Yes | ❌ Limited | ✅ Yes |
| **Rate Limits** | ✅ Fair | ❌ Expensive | ✅ Generous | ✅ Fair |
| **Country Targeting** | ✅ Yes | ✅ Yes | ✅ Limited | ✅ Yes |
| **News Search** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Image Search** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

### Empfehlung

**Brave Search**: Beste Wahl für Claude Code (Privacy + MCP Support + Fair Pricing)

---

## 🔗 Nützliche Links

### Offizielle Ressourcen
- [Brave Search API](https://brave.com/search/api/)
- [Brave API Docs](https://api.search.brave.com/app/documentation)
- [MCP Brave Server](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search)

### Alternativen
- [DuckDuckGo API](https://duckduckgo.com/api)
- [SerpAPI](https://serpapi.com/) - Google Search API Wrapper

---

## 💎 Pro-Tipps

Fortgeschrittene Techniken fuer effizientere Suchanfragen und bessere Ergebnisverarbeitung.

> 💡 **Tipp**: Implementiere ein einfaches Caching fuer wiederholte Suchanfragen, um dein monatliches Free-Tier-Kontingent von 2.000 Requests optimal zu nutzen. Identische Queries innerhalb einer Session muessen nicht doppelt abgefragt werden.

### 1. Query Templates für häufige Searches

Vordefinierte Templates fuer wiederkehrende Suchtypen sparen Zeit und liefern konsistente Ergebnisse:
```javascript
const queryTemplates = {
  docs: (library) => `${library} official documentation API reference`,
  version: (software) => `${software} latest version release notes`,
  tutorial: (topic) => `${topic} tutorial beginner 2026`,
  compare: (a, b) => `${a} vs ${b} comparison 2026 pros cons`
};

// Usage
await brave.search({
  query: queryTemplates.compare("Next.js", "Remix")
});
```

### 2. Result Scoring

Bewerte Suchergebnisse nach Relevanz, indem du offizielle Dokumentationen und GitHub-Links hoeher gewichtest:
```javascript
function scoreResults(results) {
  return results.map(r => ({
    ...r,
    score: calculateScore(r)
  })).sort((a, b) => b.score - a.score);
}

function calculateScore(result) {
  let score = 0;
  if (result.url.includes('github.com')) score += 10;
  if (result.url.includes('docs.')) score += 15;
  if (result.age === 'today') score += 5;
  return score;
}
```

### 3. Multi-Query Research

Fuehre mehrere Suchanfragen parallel aus, um ein Thema aus verschiedenen Perspektiven zu beleuchten:
```javascript
async function comprehensiveResearch(topic) {
  const [docs, tutorials, discussions] = await Promise.all([
    brave.search({ query: `${topic} official documentation` }),
    brave.search({ query: `${topic} tutorial 2026` }),
    brave.search({ query: `${topic} reddit discussion` })
  ]);

  return { docs, tutorials, discussions };
}
```

---

## 📚 Zusammenfassung

✅ **Brave Search MCP** gibt Claude Zugriff auf Real-Time Web Information
✅ **Privacy-First** - No Tracking, kein Google/Bing
✅ **Free Tier** - 2.000 Requests/Monat ausreichend für die meisten Use Cases
✅ **Structured API** - JSON Responses, perfekt für LLM Integration
✅ **News, Images, Web** - Alle Search-Typen supported

### Wann nutzen?

- Aktuelle Informationen benötigt
- Claude's Knowledge Cutoff überschritten
- Research & Fact-Checking
- Tutorial/Docs suchen

### Nächste Schritte

1. **API Key** holen auf [brave.com/search/api](https://brave.com/search/api/)
2. **MCP Server** konfigurieren
3. **Teste** einfache Queries
4. **Kombiniere** mit anderen MCP Servers

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0

**Next**: [Lektion 39 - PostgreSQL MCP Server](./39-mcp-postgres.md) →
