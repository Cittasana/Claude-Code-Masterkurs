# 42. MCP Server: Puppeteer

**Kategorie**: Browser Automation MCP Server
**Schwierigkeit**: Fortgeschritten
**Installation**: `npx @modelcontextprotocol/create-server puppeteer`
**Offizielle Docs**: [MCP Puppeteer Server](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer)

---

> 🚀 **Claude Code Relevanz**: Der Puppeteer MCP Server erweitert Claude Code um Browser-Automatisierung -- ideal fuer E2E-Tests, Web Scraping, Screenshot-Dokumentation und Performance-Monitoring direkt aus der Entwicklungsumgebung.

## 🎯 Was ist der Puppeteer MCP Server?

Der **Puppeteer MCP Server** gibt Claude Code die Fähigkeit, Browser zu automatisieren - Websites besuchen, mit Elementen interagieren, Screenshots erstellen, Formulare ausfüllen und Testing durchführen. Puppeteer ist eine headless Chrome/Chromium-Steuerung von Google.

### Warum Browser Automation via MCP?

**Ohne MCP**:
```bash
# Claude generiert Puppeteer-Code
node script.js
→ Code muss geschrieben, ausgeführt, debugged werden
```

**Mit MCP**:
```json
{
  "method": "puppeteer_navigate",
  "params": {
    "url": "https://example.com",
    "waitUntil": "networkidle0"
  }
}
→ Direkte Browser-Steuerung, strukturiertes Feedback
```

---

## 🔧 Berechtigung

### Warum Puppeteer MCP?

1. **Web Scraping**: Extrahiere Daten von Websites strukturiert
2. **Testing**: Automatisierte E2E-Tests für Web-Apps
3. **Screenshots**: Dokumentation, Visual Regression Testing
4. **Form Automation**: Ausfüllen von Formularen, Login-Flows
5. **PDF Generation**: Websites zu PDFs konvertieren
6. **Monitoring**: Check Website-Verfügbarkeit & Performance

### Use Cases

- **E2E Testing**: Claude testet deine Web-App automatisch
- **Data Collection**: Scrape Produktpreise, News, Reviews
- **Screenshot Automation**: Dokumentation, Visual Testing
- **Form Submission**: Automatisches Ausfüllen von Formularen
- **SEO Audits**: Check Meta-Tags, Performance, Accessibility
- **Competitive Analysis**: Monitor Competitor-Websites

---

## 💻 Verwendung

### Installation & Setup

```bash
# Puppeteer MCP Server installieren
npm install -g @modelcontextprotocol/server-puppeteer

# Chromium wird automatisch heruntergeladen
# Alternativ: Nutze System Chrome
```

### Konfiguration

**~/.config/mcp/puppeteer.json**:
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ],
      "options": {
        "headless": true,
        "defaultTimeout": 30000,
        "defaultViewport": {
          "width": 1920,
          "height": 1080
        },
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        "screenshotPath": "/Users/username/screenshots"
      },
      "permissions": {
        "navigate": true,
        "screenshot": true,
        "evaluate": true,
        "download": false
      }
    }
  }
}
```

### Available MCP Tools

#### 1. `puppeteer_navigate`
```json
{
  "name": "puppeteer_navigate",
  "description": "Navigate to URL",
  "parameters": {
    "url": "https://example.com",
    "waitUntil": "networkidle0"  // load, domcontentloaded, networkidle0, networkidle2
  }
}
```

#### 2. `puppeteer_screenshot`
```json
{
  "name": "puppeteer_screenshot",
  "description": "Take screenshot",
  "parameters": {
    "fullPage": true,
    "type": "png",  // png, jpeg, webp
    "path": "/path/to/screenshot.png"
  }
}
```

**Response**:
```json
{
  "path": "/path/to/screenshot.png",
  "size": "1.2MB",
  "dimensions": {
    "width": 1920,
    "height": 3840
  }
}
```

#### 3. `puppeteer_click`
```json
{
  "name": "puppeteer_click",
  "description": "Click element",
  "parameters": {
    "selector": "button#submit",
    "waitForNavigation": true
  }
}
```

#### 4. `puppeteer_type`
```json
{
  "name": "puppeteer_type",
  "description": "Type text into input",
  "parameters": {
    "selector": "input[name='email']",
    "text": "user@example.com",
    "delay": 100  // Milliseconds between keystrokes
  }
}
```

#### 5. `puppeteer_evaluate`
```json
{
  "name": "puppeteer_evaluate",
  "description": "Execute JavaScript in page context",
  "parameters": {
    "script": "document.querySelectorAll('a').length"
  }
}
```

**Response**:
```json
{
  "result": 42
}
```

#### 6. `puppeteer_pdf`
```json
{
  "name": "puppeteer_pdf",
  "description": "Generate PDF from page",
  "parameters": {
    "path": "/path/to/output.pdf",
    "format": "A4",
    "printBackground": true
  }
}
```

#### 7. `puppeteer_wait`
```json
{
  "name": "puppeteer_wait",
  "description": "Wait for selector or timeout",
  "parameters": {
    "selector": ".content-loaded",
    "timeout": 5000
  }
}
```

---

## 🏆 Best Practices

### 1. **Selector Stability**

```javascript
// ❌ Fragile: IDs können sich ändern
await page.click('#user-123-button');

// ✅ Robust: Data-Attributes nutzen
await page.click('[data-testid="submit-button"]');

// ✅ Best: Kombiniere mehrere Selektoren
await page.click('button[type="submit"][aria-label="Submit Form"]');
```

### 2. **Wait Strategies**

```javascript
// ❌ Hard Timeouts vermeiden
await page.waitForTimeout(3000);

// ✅ Wait for specific conditions
await page.waitForSelector('.data-loaded');
await page.waitForNavigation({ waitUntil: 'networkidle0' });
await page.waitForFunction(() => document.querySelectorAll('.item').length > 0);
```

### 3. **Error Handling**

```javascript
try {
  await page.goto(url, { timeout: 10000 });
} catch (error) {
  if (error.name === 'TimeoutError') {
    // Handle timeout specifically
  } else if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
    // Handle DNS errors
  }
}
```

---

## 📝 Beispiele (12+)

### Beispiel 1: E2E Test Login-Flow

```bash
Du: "Teste den Login-Flow auf meiner Website"

Claude:
1. puppeteer_navigate({ url: "https://myapp.com/login" })
2. puppeteer_type({ selector: "#email", text: "test@example.com" })
3. puppeteer_type({ selector: "#password", text: "testpass123" })
4. puppeteer_click({ selector: "button[type='submit']" })
5. puppeteer_wait({ selector: ".dashboard-header" })
6. puppeteer_screenshot({ path: "login-success.png" })

→ "✅ Login erfolgreich. Dashboard lädt in 2.3s"
```

### Beispiel 2: Price Monitoring

```bash
Du: "Check alle Preise auf competitor.com"

Claude:
puppeteer_navigate({ url: "https://competitor.com/products" })
puppeteer_evaluate({
  script: `
    Array.from(document.querySelectorAll('.product-card')).map(card => ({
      name: card.querySelector('.product-name').textContent,
      price: card.querySelector('.product-price').textContent,
      inStock: !card.querySelector('.out-of-stock')
    }))
  `
})

Ergebnis:
```json
[
  { "name": "Product A", "price": "€99.99", "inStock": true },
  { "name": "Product B", "price": "€149.99", "inStock": false }
]
```

### Beispiel 3: Screenshot Generator

```bash
Du: "Erstelle Screenshots aller Seiten meiner Docs"

Claude:
pages = ["/docs/intro", "/docs/setup", "/docs/api"]

For each page:
  1. puppeteer_navigate({ url: baseUrl + page })
  2. puppeteer_screenshot({
       path: `screenshots/${page}.png`,
       fullPage: true
     })

→ "Screenshots erstellt für 3 Seiten"
```

### Beispiel 4: Form Automation

```bash
Du: "Fülle das Kontaktformular auf example.com aus"

Claude:
1. puppeteer_navigate({ url: "https://example.com/contact" })
2. puppeteer_type({ selector: "#name", text: "Max Mustermann" })
3. puppeteer_type({ selector: "#email", text: "max@example.com" })
4. puppeteer_type({ selector: "#message", text: "Test message..." })
5. puppeteer_click({ selector: "#privacy-checkbox" })
6. puppeteer_screenshot({ path: "form-filled.png" })
7. User-Confirm: Submit?
8. puppeteer_click({ selector: "button[type='submit']" })

→ "Formular ausgefüllt. Warte auf deine Bestätigung zum Absenden."
```

### Beispiel 5: PDF Export

```bash
Du: "Exportiere die Homepage als PDF"

Claude:
1. puppeteer_navigate({ url: "https://example.com" })
2. puppeteer_pdf({
     path: "/path/to/homepage.pdf",
     format: "A4",
     printBackground: true,
     margin: { top: "1cm", bottom: "1cm" }
   })

→ "PDF erstellt: homepage.pdf (2.4 MB)"
```

### Beispiel 6: Visual Regression Testing

```bash
Du: "Check ob die Homepage sich visuell geändert hat"

Claude:
1. puppeteer_navigate({ url: "https://myapp.com" })
2. puppeteer_screenshot({ path: "current.png" })
3. filesystem.read_file({ path: "baseline.png" })
4. Compare images (pixel diff)

Result:
```
Diff: 0.02% pixels changed
Changes detected in:
  - Header navigation (color change)
  - Footer layout (minor shift)

Status: ✅ Within acceptable threshold (<1%)
```

### Beispiel 7: SEO Audit

```bash
Du: "SEO-Check für meine Landing Page"

Claude:
puppeteer_navigate({ url: "https://myapp.com" })
puppeteer_evaluate({
  script: `({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    h1Count: document.querySelectorAll('h1').length,
    imagesMissingAlt: Array.from(document.querySelectorAll('img')).filter(img => !img.alt).length,
    internalLinks: document.querySelectorAll('a[href^="/"]').length,
    externalLinks: document.querySelectorAll('a[href^="http"]').length
  })`
})

SEO Report:
```
✅ Title: "MyApp - Best AI Tool" (53 chars)
✅ Meta Description: Present (142 chars)
⚠️  Multiple H1 tags: 2 (should be 1)
❌ 5 images missing alt text
✅ Internal links: 23
✅ External links: 7
```

### Beispiel 8: Performance Monitoring

```bash
Du: "Miss die Performance meiner Website"

Claude:
puppeteer_navigate({ url: "https://myapp.com" })
puppeteer_evaluate({
  script: `JSON.stringify(performance.timing)`
})

Performance Metrics:
```
⏱️  DNS Lookup: 12ms
⏱️  Connection: 45ms
⏱️  First Byte: 234ms
⏱️  DOM Content Loaded: 1,234ms
⏱️  Page Load: 2,456ms

Overall: ✅ Good (< 3s)
```

### Beispiel 9: Data Scraping mit Pagination

```bash
Du: "Scrape alle Artikel von blog.example.com"

Claude:
articles = []
page = 1

While true:
  1. puppeteer_navigate({ url: `https://blog.example.com?page=${page}` })
  2. puppeteer_evaluate({
       script: `
         Array.from(document.querySelectorAll('.article')).map(a => ({
           title: a.querySelector('h2').textContent,
           author: a.querySelector('.author').textContent,
           date: a.querySelector('.date').textContent
         }))
       `
     })
  3. Add to articles array
  4. Check if "Next Page" button exists
  5. If not → break
  6. page++

→ "Collected 156 articles from 8 pages"
```

### Beispiel 10: Authentication Testing

```bash
Du: "Teste ob Login-Token korrekt gespeichert wird"

Claude:
1. puppeteer_navigate({ url: "https://myapp.com/login" })
2. Login with credentials
3. puppeteer_evaluate({
     script: `localStorage.getItem('authToken')`
   })
4. Check token format (JWT?)
5. puppeteer_navigate({ url: "https://myapp.com/dashboard" })
6. Verify dashboard accessible

Result:
```
✅ Token stored: eyJhbGciOiJIUzI1NiIs...
✅ Token format: Valid JWT
✅ Dashboard accessible after login
⚠️  Token expires in: 24h (consider refresh mechanism)
```

### Beispiel 11: A/B Test Verification

```bash
Du: "Check ob A/B Test beide Varianten zeigt"

Claude:
For each iteration (10x):
  1. Clear cookies
  2. puppeteer_navigate({ url: "https://myapp.com" })
  3. puppeteer_screenshot({ path: `variant-${i}.png` })
  4. puppeteer_evaluate({
       script: `document.body.getAttribute('data-ab-variant')`
     })

Results:
```
Variant A: 5 appearances (50%)
Variant B: 5 appearances (50%)

Distribution: ✅ Balanced
Both variants rendered correctly
```

### Beispiel 12: Broken Link Checker

```bash
Du: "Check alle Links auf meiner Website"

Claude:
1. puppeteer_navigate({ url: "https://myapp.com" })
2. puppeteer_evaluate({
     script: `
       Array.from(document.querySelectorAll('a[href]')).map(a => a.href)
     `
   })
3. For each link:
     - Try navigate
     - Check status code
     - Record if 404/500

Broken Links Found:
```
❌ /old-page → 404 Not Found
❌ /api/docs → 500 Internal Server Error
❌ https://external-site.com/removed → 404

Total Links: 156
Broken: 3 (1.9%)
```

---

## 🤖 Claude Code Integration

### Workflow 1: E2E-Tests automatisieren
```bash
# "Teste die Login-Page: gehe zu /login, gib Credentials ein und pruefe den Redirect"
# Claude nutzt Puppeteer MCP fuer Browser-Automation
```

### Workflow 2: MCP Konfiguration
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

### Workflow 3: Screenshots fuer Debugging
```bash
# "Mache einen Screenshot von der /dashboard Seite und analysiere das Layout"
# Claude navigiert im Browser und erstellt Screenshots
```

> 💡 **Tipp**: Puppeteer MCP ermoeglicht Claude Code visuelle Tests - es kann Screenshots machen und UI-Elemente verifizieren.

---

## 🐛 Troubleshooting

### Problem 1: Chromium Download Failed

**Symptom**: `Error: Chromium revision is not downloaded`

**Lösung**:
```bash
# Manual Chromium Download
npx puppeteer browsers install chrome

# Oder: Nutze System Chrome
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install puppeteer
PUPPETEER_EXECUTABLE_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
```

### Problem 2: Selector Not Found

**Symptom**: `Error: waiting for selector failed: timeout 30000ms exceeded`

**Lösung**:
```javascript
// 1. Check if selector exists
await page.evaluate(() => document.querySelector('.my-selector'));

// 2. Wait longer
await page.waitForSelector('.my-selector', { timeout: 60000 });

// 3. Use multiple fallback selectors
const selectors = ['.btn-submit', '#submit', 'button[type="submit"]'];
for (const selector of selectors) {
  if (await page.$(selector)) {
    await page.click(selector);
    break;
  }
}
```

### Problem 3: Page Crashes

**Symptom**: `Error: Page crashed!`

**Lösung**:
```json
{
  "options": {
    "args": [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu"
    ]
  }
}
```

### Problem 4: Memory Leaks

**Symptom**: MCP Server memory usage grows over time

**Lösung**:
```javascript
// Close pages after use
await page.close();

// Reuse browser instance
const browser = await puppeteer.launch();
const page = await browser.newPage();
// ... work ...
await page.close();  // Not browser.close()

// Limit concurrent pages
const MAX_PAGES = 5;
```

---

## 🆚 Vergleich

| Feature | Puppeteer MCP | Playwright MCP | Selenium | Manual Testing |
|---------|--------------|----------------|----------|----------------|
| **Claude Integration** | ✅ Native | ✅ Native | ❌ Code-Gen | ❌ Manual |
| **Browser Support** | Chrome/Chromium | Chrome, Firefox, Safari | All major | All |
| **Speed** | ✅ Fast | ✅ Fast | ❌ Slower | ❌ Slowest |
| **Headless** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **API Simplicity** | ✅ Simple | ✅ Simple | ❌ Complex | N/A |
| **Screenshots** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ Manual |
| **PDF Generation** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Network Interception** | ✅ Yes | ✅ Yes | ❌ Limited | ❌ No |

### Wann Puppeteer MCP?

- ✅ Chrome/Chromium-only is OK
- ✅ Need PDF generation
- ✅ Google-maintained stability
- ✅ Large ecosystem & community
- ❌ Need Firefox/Safari support → Use Playwright
- ❌ Need cross-browser testing → Use Playwright or Selenium

---

## 🔗 Nützliche Links

- [Puppeteer Docs](https://pptr.dev/)
- [MCP Puppeteer Server](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer)
- [Puppeteer Examples](https://github.com/puppeteer/puppeteer/tree/main/examples)

---

## 💎 Pro-Tipps

### 1. Stealth Mode für Anti-Bot Protection

```json
{
  "options": {
    "args": [
      "--disable-blink-features=AutomationControlled"
    ],
    "ignoreDefaultArgs": ["--enable-automation"]
  }
}
```

### 2. Network Interception für Testing

```javascript
// Block unnecessary resources
await page.setRequestInterception(true);
page.on('request', (req) => {
  if (req.resourceType() === 'image' || req.resourceType() === 'font') {
    req.abort();
  } else {
    req.continue();
  }
});
```

### 3. Mobile Device Emulation

```javascript
await page.setViewport({
  width: 375,
  height: 667,
  deviceScaleFactor: 2,
  isMobile: true
});

await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
```

### 4. Automatic Retry Pattern

```javascript
async function retryNavigate(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await puppeteer_navigate({ url, timeout: 10000 });
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(1000 * (i + 1));  // Exponential backoff
    }
  }
}
```

---

## 📚 Zusammenfassung

✅ **Puppeteer MCP** ermöglicht Browser-Automatisierung durch Claude
✅ **E2E Testing** - Automatisierte Tests für Web-Apps
✅ **Web Scraping** - Strukturierte Datenextraktion
✅ **Screenshots & PDFs** - Dokumentation & Reporting
✅ **Form Automation** - Login-Flows, Submissions
✅ **Performance Monitoring** - Real-world Performance-Tests

### Nächste Schritte

1. **Setup** Puppeteer MCP Server
2. **Test** einfache Navigation & Screenshot
3. **Erstelle** E2E-Test für deine App
4. **Kombiniere** mit [Filesystem MCP](./36-mcp-filesystem.md) für Reporting

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0

**Next**: [Lektion 43 - Slack MCP Server](./43-mcp-slack.md) →
