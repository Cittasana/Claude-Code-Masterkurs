# 🌐 httpie - User-Friendly HTTP Client

**Kategorie**: 🟢 Anfänger-Tools
**Installation**: 3 Minuten
**Skill-Level**: Einfach
**Impact**: API-Testing sofort produktiv

---

> 🚀 **Claude Code Relevanz**: httpie ist der ideale Begleiter fuer Claude Code Backend-Entwicklung - du kannst API-Endpoints sofort testen, waehrend Claude den Code generiert, und siehst farbig formatierte JSON-Responses direkt im Terminal.

## ✅ Berechtigung - Warum httpie?

### Das Problem mit `curl`
`curl` ist mächtig, aber:
- ❌ **Cryptic Syntax** (`-X POST -H "Content-Type: application/json" -d '{"key":"value"}'`)
- ❌ **Unleserlicher Output** (ein Block Text)
- ❌ **Keine Syntax Highlighting**
- ❌ **Schwer zu debuggen**
- ❌ **JSON manual escapen**

**Beispiel**: Simpler POST-Request mit `curl`:
```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token123" \
  -d '{"name":"John","email":"john@example.com"}'
```

### Die Lösung: httpie
`httpie` ist ein moderner HTTP-Client mit:
- ✅ **Intuitive Syntax** (`http POST url name=John email=john@example.com`)
- ✅ **Farbiger Output** (JSON syntax-highlighted)
- ✅ **Session Support** (Cookies/Headers persistent)
- ✅ **JSON by default** (kein manuelles Escaping)
- ✅ **Lesbares Request/Response-Format**
- ✅ **File-Upload simple**

**Gleicher Request mit `httpie`**:
```bash
http POST api.example.com/users \
  Authorization:"Bearer token123" \
  name=John email=john@example.com
```

**Ergebnis**: API-Testing ist 5x schneller und macht Spaß!

---

## 🎯 Zwecke - Wofür du httpie einsetzt

httpie deckt alle gaengigen HTTP-Szenarien ab - von einfachen GET-Requests bis zu authentifizierten File-Uploads.

### 1. **REST API Testing**

Waehrend der Backend-Entwicklung musst du staendig API-Endpoints testen - neue Routen pruefen, Request-Bodies validieren und Response-Formate verifizieren. httpie macht das trivial: Du tippst einfach die HTTP-Methode, die URL und die Daten, und bekommst eine farbig formatierte Response zurueck. Im Gegensatz zu curl musst du keine Header manuell setzen oder JSON escapen - httpie erkennt automatisch dass du JSON senden willst. Stell dir vor, du entwickelst eine User-API und willst testen ob der POST-Endpoint korrekt funktioniert - mit httpie reicht ein einziger Befehl. Das Ergebnis ist ein farbig hervorgehobener JSON-Output mit Status-Code, Headern und Body.

```bash
http GET api.example.com/users
http POST api.example.com/users name=Alice
```

### 2. **API Documentation Verification**

API-Dokumentation stimmt nicht immer mit der Realitaet ueberein - Felder koennen sich aendern, neue Required-Parameter hinzukommen oder Response-Formate sich unterscheiden. Mit httpie kannst du schnell ueberpruefen, ob die dokumentierten Endpoints tatsaechlich so funktionieren wie beschrieben. Du siehst sofort den Status-Code, die Response-Header und den Body in farbig formatiertem JSON. Stell dir vor, du integrierst die GitHub API und die Docs sagen "GET /users/:username gibt ein User-Objekt zurueck" - mit httpie pruefst du das in Sekunden. Das hilft dir auch, die genaue Struktur der Response zu verstehen bevor du deinen Code schreibst.

```bash
http GET api.github.com/users/octocat
```

### 3. **Debugging von API-Calls**

Wenn ein API-Call fehlschlaegt, musst du oft sowohl den gesendeten Request als auch die erhaltene Response im Detail sehen, um das Problem zu finden. Mit dem `-v` (verbose) Flag zeigt dir httpie den vollstaendigen Request inklusive aller Header und des Bodies, gefolgt von der vollstaendigen Response. Das ist deutlich informativer als nur den Status-Code zu sehen. Stell dir vor, ein Login-Endpoint gibt 401 zurueck und du willst pruefen ob der Authorization-Header korrekt gesendet wurde - mit `-v` siehst du genau welche Header httpie gesendet hat. Das Ergebnis ist ein vollstaendiges Protokoll des HTTP-Austauschs, farbig formatiert und leicht lesbar.

```bash
http -v POST api.example.com/login email=test@example.com
```

### 4. **Session Management**

In vielen APIs musst du dich zuerst authentifizieren und dann das erhaltene Token oder Cookie bei jedem folgenden Request mitsenden. Ohne Sessions muestest du das Token manuell kopieren und bei jedem Aufruf einfuegen. httpie's Session-Feature speichert Cookies und Auth-Header automatisch in einer JSON-Datei und sendet sie bei jedem folgenden Request mit. Stell dir vor, du testest einen geschuetzten Dashboard-Endpoint - statt bei jedem Aufruf das Token manuell einzufuegen, loggst du dich einmal ein und alle folgenden Requests sind automatisch authentifiziert. Das macht das Testen von authentifizierten APIs deutlich angenehmer.

```bash
http --session=./session.json POST api.example.com/login
http --session=./session.json GET api.example.com/dashboard
```

### 5. **File-Uploads testen**

File-Upload-Endpoints sind mit curl besonders muehsam zu testen, weil du den Content-Type-Header manuell auf multipart/form-data setzen musst. httpie macht das mit dem `-f` (form) Flag und der `@`-Syntax fuer Dateien trivial einfach. Du gibst einfach `file@pfad/zur/datei` an, und httpie kuemmert sich um den Rest. Stell dir vor, du implementierst ein Avatar-Upload-Feature und willst testen ob der Endpoint verschiedene Bildformate akzeptiert - mit httpie dauert jeder Test nur eine Zeile. Das Ergebnis zeigt dir die Response mit der URL des hochgeladenen Files.

```bash
http -f POST api.example.com/upload file@~/image.png
```

---

## 💻 Verwendung - Wie du httpie einsetzt

Von der Installation ueber JSON-Handling bis zu Session-Management - hier lernst du alle wichtigen httpie-Features.

### Installation

httpie ist auf allen Plattformen ueber den jeweiligen Paketmanager verfuegbar.

**macOS (Homebrew)**:
Die einfachste Installation auf macOS ist ueber Homebrew. httpie wird als Python-Paket installiert, aber Homebrew kuemmert sich um alle Abhaengigkeiten. Nach der Installation steht der Befehl `http` (und optional `https`) im Terminal zur Verfuegung. Pruefe mit `http --version` ob die Installation erfolgreich war. Beachte, dass der Befehl `http` heisst, nicht `httpie`.

```bash
brew install httpie
```

**Ubuntu/Debian**:
Auf Debian-basierten Systemen ist httpie in den Standard-Repositories verfuegbar. Die apt-Version kann manchmal etwas aelter sein als die neueste Release-Version. Fuer die aktuellste Version nutze alternativ `pip install httpie`. Nach der Installation steht der `http`-Befehl sofort zur Verfuegung. Teste mit `http httpbin.org/get` ob alles funktioniert.

```bash
sudo apt install httpie
```

**Arch Linux**:
Auf Arch Linux ist httpie im offiziellen Repository verfuegbar und wird ueber pacman installiert. Dank Rolling Release bekommst du immer die aktuellste Version. httpie hat Python als Abhaengigkeit, das auf Arch standardmaessig installiert ist. Nach der Installation ist der `http`-Befehl sofort einsatzbereit.

```bash
sudo pacman -S httpie
```

**Python (Universal)**:
Die universelle Installation ueber pip funktioniert auf allen Plattformen mit Python 3. Das ist besonders nuetzlich auf Systemen ohne Paketmanager oder wenn du die allerneuste Version haben willst. pip installiert httpie und alle Abhaengigkeiten automatisch. Stelle sicher, dass du pip3 verwendest und nicht pip2. Nach der Installation steht der `http`-Befehl zur Verfuegung.

```bash
pip install httpie
```

---

### Quick Start (30 Sekunden)

httpie verwendet eine intuitive Syntax: HTTP-Methode, URL, dann Header und Daten.

**Basis-Usage**:
Die grundlegende Syntax ist `http METHODE url key=value` - Daten werden automatisch als JSON gesendet:
```bash
# GET Request
http GET httpbin.org/get

# POST Request (JSON)
http POST httpbin.org/post name=John age:=30

# Custom Headers
http GET api.example.com Authorization:"Bearer token123"

# Query Parameters
http GET httpbin.org/get search==python sort==desc
```

**HTTP-Methoden**:
httpie unterstuetzt alle Standard-HTTP-Methoden - die Methode steht immer vor der URL:
```bash
http GET url       # Read
http POST url      # Create
http PUT url       # Update (full)
http PATCH url     # Update (partial)
http DELETE url    # Delete
http HEAD url      # Headers only
```

---

### Advanced Usage

Fuer komplexere API-Interaktionen bietet httpie Sessions, File-Uploads und verschiedene Authentifizierungsmethoden.

**1. Request Headers**:
Header werden mit einem Doppelpunkt (`:`) vom Wert getrennt - nicht verwechseln mit `=` fuer Daten:
```bash
# Single Header
http GET api.example.com Authorization:"Bearer abc123"

# Multiple Headers
http GET api.example.com \
  Authorization:"Bearer abc123" \
  Accept:application/json \
  User-Agent:MyApp/1.0
```

**2. JSON Data**:
`=` sendet Strings, `:=` sendet rohe JSON-Werte (Zahlen, Booleans, Arrays) - das ist der wichtigste Unterschied:
```bash
# Simple JSON
http POST api.example.com name=John email=john@example.com

# Nested JSON
http POST api.example.com user[name]=John user[email]=john@example.com

# Nummer (nicht String)
http POST api.example.com age:=30 active:=true

# Array
http POST api.example.com tags:='["python","api"]'

# From File
http POST api.example.com < data.json
```

**3. Form-Data**:
Standardmaessig sendet httpie Daten als JSON. Mit dem `--form` Flag wechselst du auf URL-encoded Form-Data oder Multipart-Encoding fuer File-Uploads. Das ist wichtig wenn du APIs testest die klassische HTML-Form-Daten erwarten statt JSON. Fuer File-Uploads nutze die `@`-Syntax um eine lokale Datei als Upload-Feld anzugeben. Stell dir vor, du testest ein Formular-Backend das Profildaten und ein Profilbild gleichzeitig erwartet - mit httpie kombinierst du Textfelder und Datei-Upload in einem Befehl.

```bash
# URL-Encoded Form
http --form POST api.example.com name=John email=john@example.com

# Multipart Form (File-Upload)
http --form POST api.example.com \
  file@~/document.pdf \
  description="Important doc"
```

**4. Output Control**:
httpie bietet verschiedene Output-Modi, mit denen du steuern kannst welche Teile der HTTP-Kommunikation angezeigt werden. Mit `-v` siehst du alles (Request-Header, Request-Body, Response-Header, Response-Body). Mit `--headers` nur die Response-Header, und mit `--body` nur den Response-Body. Das `--print` Flag gibt dir noch feinere Kontrolle: `H` fuer Request-Headers, `h` fuer Response-Headers, `B` fuer Request-Body und `b` fuer Response-Body. Stell dir vor, du debuggst ein CORS-Problem und willst nur die Response-Header sehen - `--headers` zeigt dir genau das ohne den Body.

```bash
# Verbose (Headers + Body)
http -v GET api.example.com

# Headers-Only
http --headers GET api.example.com

# Body-Only
http --body GET api.example.com

# Print Request (no send)
http --print=HhBb --offline GET api.example.com
```

**5. Sessions (Cookies + Auth persistent)**:
Sessions speichern Cookies und Auth-Header zwischen Requests, sodass du dich nicht bei jedem Aufruf neu authentifizieren musst:
```bash
# Named Session
http --session=myapp POST api.example.com/login email=test@example.com

# Zweiter Request (automatisch mit Cookies)
http --session=myapp GET api.example.com/dashboard

# Session-File Location: ~/.config/httpie/sessions/
```

**6. Download Files**:
httpie kann Dateien direkt herunterladen, aehnlich wie wget oder curl. Mit dem `--download` Flag speichert httpie den Response-Body in eine lokale Datei statt ihn im Terminal anzuzeigen. Der Dateiname wird automatisch aus der URL oder dem Content-Disposition-Header abgeleitet. Stell dir vor, du willst eine ZIP-Datei von einem API-Endpoint herunterladen - mit `--download` wird sie direkt gespeichert. Mit `--output` kannst du einen eigenen Dateinamen angeben. Ein Fortschrittsbalken zeigt dir den Download-Status an.

```bash
# Download mit automatischem Filename
http --download GET example.com/file.zip

# Custom Filename
http --download --output=myfile.zip GET example.com/file.zip
```

**7. Authentication**:
httpie unterstuetzt verschiedene Auth-Methoden direkt ueber Flags und Header:
```bash
# Basic Auth
http -a username:password GET api.example.com

# Bearer Token
http GET api.example.com Authorization:"Bearer abc123"

# Digest Auth
http --auth-type=digest -a username:password GET api.example.com
```

---

## 🏆 Best Practices

Diese Empfehlungen machen dein API-Testing schneller und reproduzierbarer.

### 1. **Standard-Aliases für API-Testing**
Aliases verkuerzen haeufige httpie-Aufrufe auf ein Minimum:
```bash
# In ~/.bashrc oder ~/.zshrc
alias api='http --pretty=all --print=HhBb'
alias api-post='http POST'
alias api-get='http GET'
alias api-verbose='http -v'

# Nutzen:
api GET api.example.com/users
```

### 2. **Environment-Variables für Domains**
Speichere API-URLs und Tokens als Umgebungsvariablen, damit du sie nicht bei jedem Request eintippen musst:
```bash
# In ~/.bashrc
export API_BASE="https://api.myapp.com"
export API_TOKEN="Bearer abc123"

# Nutzen:
http GET $API_BASE/users Authorization:$API_TOKEN
```

### 3. **Sessions für Entwicklung**
Logge dich einmal ein und nutze die Session fuer alle folgenden Requests - keine wiederholte Authentifizierung noetig:
```bash
# Login einmal
http --session=dev POST $API_BASE/login email=dev@example.com password=secret

# Danach: Alle Requests authenticated
http --session=dev GET $API_BASE/admin/users
http --session=dev POST $API_BASE/admin/settings debug:=true
```

### 4. **JSON-Files als Input**
Bei komplexen Request-Bodies ist es uebersichtlicher, die Daten in einer JSON-Datei vorzubereiten:
```bash
# Erstelle test-data.json
{
  "user": {
    "name": "Alice",
    "email": "alice@example.com",
    "roles": ["admin", "user"]
  }
}

# Nutze in Request
http POST api.example.com/users < test-data.json
```

### 5. **Output in Files fuer Debugging**

Fuer spaetere Analyse oder zum Teilen mit Kollegen kannst du den httpie-Output in Dateien speichern. Mit der Shell-Umleitung `>` speicherst du die Response in eine Datei, und mit `2>&1` faengst du auch den verbose Output ein. Besonders nuetzlich ist die Kombination mit jq fuer prettified JSON-Output. Stell dir vor, ein API-Call funktioniert bei dir aber nicht bei einem Kollegen - speichere den vollstaendigen Request und Response in eine Datei und teile sie fuer gemeinsames Debugging. Das hilft auch bei der Dokumentation von API-Verhalten.

```bash
# Request + Response speichern
http -v POST api.example.com/users name=John > debug.log 2>&1

# Nur Response Body
http --body GET api.example.com/data > response.json

# Pretty-print + Save
http GET api.example.com/data | jq '.' > formatted.json
```

### 6. **Testing-Scripts mit httpie**
Erstelle wiederverwendbare Test-Skripte fuer deine API-Endpoints:
```bash
#!/bin/bash
# test-api.sh

API_BASE="https://api.example.com"
TOKEN="Bearer abc123"

echo "Testing GET /users"
http GET $API_BASE/users Authorization:$TOKEN

echo "Testing POST /users"
http POST $API_BASE/users \
  Authorization:$TOKEN \
  name=TestUser \
  email=test@example.com

echo "Testing DELETE /users/123"
http DELETE $API_BASE/users/123 Authorization:$TOKEN
```

### 7. **Claude Code Workflows**

In einem typischen Claude Code Backend-Workflow generiert Claude den API-Code und du testest die Endpoints sofort mit httpie. Das ist der schnellste Feedback-Loop: Code aendern, testen, iterieren. Fuer lokale Endpoints nutzt du `localhost:3000` (oder den Port deines Dev-Servers), fuer externe APIs die jeweilige URL mit Authentifizierung. Stell dir vor, Claude hat eine Stripe-Integration implementiert und du willst pruefen ob die Customer-Erstellung funktioniert - mit httpie testest du den Endpoint in einer Zeile. Nutze den `-h` Flag um nur die Response-Header zu sehen, wenn du CORS-Probleme debuggst.

```bash
# Backend entwickeln: API testen
http GET localhost:3000/api/users
http POST localhost:3000/api/users name=Test

# Integration testen: External API
http GET api.stripe.com/v1/customers \
  Authorization:"Bearer sk_test_..."

# Debugging: Headers checken
http -h POST localhost:3000/api/auth token=xyz
```

---

## 📝 Beispiele - Real-World Use-Cases

### Beispiel 1: REST API Testing während Development

**Szenario**: Du entwickelst User-API, musst Endpoints testen.

```bash
# 1. GET alle Users
http GET localhost:3000/api/users

# Output (colored JSON):
# HTTP/1.1 200 OK
# Content-Type: application/json
#
# [
#   {
#     "id": 1,
#     "name": "Alice",
#     "email": "alice@example.com"
#   },
#   {
#     "id": 2,
#     "name": "Bob",
#     "email": "bob@example.com"
#   }
# ]

# 2. POST neuer User
http POST localhost:3000/api/users \
  name="Charlie" \
  email="charlie@example.com" \
  age:=25

# 3. PUT Update
http PUT localhost:3000/api/users/3 \
  name="Charles" \
  email="charles@example.com"

# 4. DELETE
http DELETE localhost:3000/api/users/3
```

**Zeit gespart**: 10 Minuten vs. Postman öffnen + konfigurieren

---

### Beispiel 2: OAuth-Flow testen

**Szenario**: Du implementierst OAuth, musst Token-Flow testen.

```bash
# 1. Login (get Token)
http POST api.example.com/auth/login \
  email=test@example.com \
  password=secret123

# Response:
# {
#   "token": "eyJhbGciOiJIUzI1NiIs...",
#   "expires_in": 3600
# }

# 2. Token extrahieren (mit jq)
TOKEN=$(http POST api.example.com/auth/login \
  email=test@example.com \
  password=secret123 \
  | jq -r '.token')

# 3. Authenticated Request
http GET api.example.com/user/profile \
  Authorization:"Bearer $TOKEN"

# 4. Refresh Token
http POST api.example.com/auth/refresh \
  Authorization:"Bearer $TOKEN"
```

**Produktivität**: Schneller als manuelles Testing

---

### Beispiel 3: File-Upload testen

**Szenario**: Avatar-Upload-Feature implementieren.

```bash
# 1. Simple File-Upload
http --form POST api.example.com/upload \
  file@~/avatar.png

# 2. Mit zusätzlichen Fields
http --form POST api.example.com/upload \
  file@~/avatar.png \
  userId=123 \
  description="Profile picture"

# 3. Multiple Files
http --form POST api.example.com/upload \
  file1@~/image1.png \
  file2@~/image2.png

# Response:
# {
#   "files": [
#     {
#       "url": "https://cdn.example.com/abc123.png",
#       "size": 45678
#     }
#   ]
# }
```

**Vorteil**: Kein Postman, kein GUI, instant testing

---

### Beispiel 4: API-Dokumentation verifizieren

**Szenario**: Docs sagen "POST /users with name + email".

```bash
# Test gemäß Docs
http POST api.example.com/users \
  name="Test User" \
  email="test@example.com"

# Wenn Fehler:
# HTTP/1.1 400 Bad Request
# {
#   "error": "Missing field: phone"
# }

# → Docs sind falsch! Phone ist required
# → Fix Docs oder API
```

**Resultat**: Docs und API in Sync

---

### Beispiel 5: Webhook-Testing

**Szenario**: Du entwickelst Webhook-Receiver, musst Payload testen.

```bash
# 1. Simuliere Stripe Webhook
http POST localhost:3000/webhooks/stripe \
  type=payment_intent.succeeded \
  data:='{"id":"pi_123","amount":1000}'

# 2. Simuliere GitHub Webhook
http POST localhost:3000/webhooks/github \
  X-GitHub-Event:push \
  @github-push-payload.json

# 3. Check Response
http -v POST localhost:3000/webhooks/stripe < test-payload.json
```

**Zeit gespart**: 5 Minuten vs. echten Webhook triggern

---

### Beispiel 6: External API Integration

**Szenario**: Du integrierst Stripe-API, musst Calls testen.

```bash
# Stripe: Create Customer
http POST api.stripe.com/v1/customers \
  Authorization:"Bearer sk_test_..." \
  email=customer@example.com \
  name="John Doe"

# Stripe: List Customers
http GET api.stripe.com/v1/customers \
  Authorization:"Bearer sk_test_..." \
  limit==10

# GitHub API: User Info
http GET api.github.com/users/octocat

# OpenAI API: Chat Completion
http POST api.openai.com/v1/chat/completions \
  Authorization:"Bearer sk-..." \
  model=gpt-4 \
  messages:='[{"role":"user","content":"Hello"}]'
```

**Produktivität**: Schnelle Integration-Tests

---

## 🤖 Claude Code Integration

### Workflow 1: API-Endpunkte testen nach Claude Code Aenderungen

Wenn Claude Code eine neue API-Route oder einen neuen Controller erstellt hat, willst du sofort testen ob der Endpoint funktioniert. Starte deinen Development-Server und nutze httpie um den neuen Endpoint aufzurufen. Du siehst sofort den Status-Code, die Response-Header und den Body in farbig formatiertem JSON. Stell dir vor, Claude hat einen neuen `/api/users` Endpoint implementiert und du willst pruefen ob er korrekt alle User zurueckgibt. Mit httpie bekommst du die Antwort in Sekunden, ohne Postman oeffnen zu muessen.

```bash
# Claude Code Session: httpie fuer API-Testing
http GET localhost:3000/api/users
```

### Workflow 2: POST-Requests debuggen

Nach einer Claude Code Aenderung an einem POST-Endpoint willst du pruefen ob die Datenvalidierung korrekt funktioniert und ob neue Records korrekt angelegt werden. httpie sendet die Daten automatisch als JSON und zeigt dir die vollstaendige Response inklusive eventueller Validation-Errors. Stell dir vor, Claude hat die User-Registrierung implementiert und du testest ob fehlende Pflichtfelder korrekt abgefangen werden. Teste sowohl erfolgreiche als auch fehlerhafte Requests um die Robustheit zu pruefen.

```bash
http POST localhost:3000/api/users name="Test" email="test@example.com"
```

### Workflow 3: API-Response als JSON speichern

Manchmal willst du die API-Response speichern, um sie spaeter zu analysieren oder als Testdaten zu verwenden. Mit der Shell-Umleitung `>` speicherst du den Response-Body direkt in eine JSON-Datei. Das ist nuetzlich um Fixtures fuer Unit-Tests zu erstellen oder um Response-Formate zu dokumentieren. Stell dir vor, du willst die aktuelle API-Response als Referenz sichern bevor Claude Code Aenderungen vornimmt. Die gespeicherte Datei kannst du auch mit jq weiterverarbeiten.

```bash
http GET api.example.com/data > response.json
```

> 💡 **Tipp**: Nutze httpie um die von Claude Code generierten API-Endpunkte sofort zu testen.

---

## 📺 Video-Tutorial

[HTTPie - Offizielle Dokumentation und Beispiele (httpie.io)](https://httpie.io/docs/cli/examples)
Praxisnahe Beispiele und ausfuehrliche Dokumentation zum modernen HTTP-Client - von einfachen GET-Requests bis zu komplexen API-Tests mit Authentifizierung.

---

## 🔧 Troubleshooting

### Problem: "JSON nicht korrekt escaped"

Der haeufigste Fehler bei httpie ist die Verwechslung von `=` und `:=`. Mit `=` sendest du einen String-Wert, mit `:=` sendest du einen rohen JSON-Wert (Zahlen, Booleans, Arrays, Objekte). Wenn du `age=30` schreibst, sendet httpie `"age": "30"` (String), nicht `"age": 30` (Number). Das kann dazu fuehren, dass die API den Wert ablehnt oder falsch verarbeitet. Stell dir vor, du sendest `active="true"` und die API erwartet einen Boolean statt eines Strings - der Request schlaegt fehl oder das Verhalten ist unerwartet. Merke dir: `=` fuer Strings, `:=` fuer alles andere.

```bash
# FALSCH (String statt Number)
http POST api.example.com age=30

# RICHTIG (Number)
http POST api.example.com age:=30

# FALSCH (Bool als String)
http POST api.example.com active="true"

# RICHTIG (Bool)
http POST api.example.com active:=true
```

---

### Problem: "Form-Data statt JSON"

Standardmaessig sendet httpie alle Daten als JSON mit dem Content-Type `application/json`. Manche APIs erwarten aber klassische Form-Data (Content-Type `application/x-www-form-urlencoded`), wie sie von HTML-Formularen gesendet werden. Wenn du JSON an eine Form-Data-API sendest, bekommst du einen 400 Bad Request oder die Daten werden nicht erkannt. Umgekehrt lehnen JSON-APIs Form-Data ab. Stell dir vor, du testest ein Login-Formular das Form-Data erwartet - ohne `--form` sendet httpie JSON und der Server versteht die Daten nicht. Nutze `--form` explizit wenn du weisst, dass die API Form-Data erwartet.

```bash
# JSON (default)
http POST api.example.com name=John

# Form-Data (--form Flag)
http --form POST api.example.com name=John
```

---

### Problem: "Headers nicht erkannt"

Ein haeufiger Syntaxfehler ist die Verwechslung der Trennzeichen fuer Header und Daten. In httpie werden Header mit einem Doppelpunkt (`:`) vom Wert getrennt, waehrend Daten mit einem Gleichheitszeichen (`=`) zugewiesen werden. Wenn du `Authorization="Bearer token"` statt `Authorization:"Bearer token"` schreibst, behandelt httpie das als Daten-Feld statt als Header. Das fuehrt dazu, dass der Authorization-Header nicht gesendet wird und die API einen 401 Unauthorized zurueckgibt. Stell dir vor, du testest eine geschuetzte Route und der Server meldet immer "nicht authentifiziert" obwohl du den Token angibst - pruefe ob du `:` statt `=` fuer Header verwendest.

```bash
# FALSCH (= statt :)
http GET api.example.com Authorization="Bearer token"

# RICHTIG (: für Headers)
http GET api.example.com Authorization:"Bearer token"
```

---

### Problem: "Session nicht funktioniert"

Wenn Sessions nicht wie erwartet funktionieren, liegt das meistens daran, dass die Session-Datei korrupt ist oder die Cookies abgelaufen sind. httpie speichert Sessions standardmaessig unter `~/.config/httpie/sessions/` in JSON-Dateien. Du kannst die Session-Datei mit cat oder jq inspizieren, um zu pruefen ob die richtigen Cookies und Header gespeichert sind. Stell dir vor, dein Login-Token ist nach einer Stunde abgelaufen und die Session gibt immer 401 zurueck - loesche die Session-Datei und logge dich erneut ein. Das Zuruecksetzen der Session loest die meisten Probleme.

```bash
# Check Session-File
cat ~/.config/httpie/sessions/api.example.com/default.json

# Reset Session
rm ~/.config/httpie/sessions/api.example.com/default.json
http --session=default POST api.example.com/login ...
```

---

## 📊 httpie vs. curl vs. Postman - Der Vergleich

| Feature | `curl` | `httpie` | Postman |
|---------|--------|----------|---------|
| **Syntax** | ❌ Cryptic | ✅ Intuitiv | ✅ GUI |
| **Output** | ❌ Raw | ✅ Colored | ✅ Pretty |
| **JSON** | ⚠️ Manual | ✅ Automatic | ✅ Automatic |
| **Sessions** | ❌ Manual | ✅ Built-in | ✅ Built-in |
| **Speed** | 🚀 Instant | 🚀 Instant | 🐌 App-Start |
| **Scriptable** | ✅ | ✅ | ⚠️ Newman |
| **Learning Curve** | 🐌 Steil | 🚀 Flach | 🚀 Flach |

**Fazit**:
- `httpie` für CLI-Workflows (schnell + lesbar)
- `curl` für Scripts (portabel)
- Postman für GUI-Lovers

---

## 🔗 Weiterführende Links

### Offizielle Ressourcen
- **Website**: https://httpie.io/
- **GitHub**: https://github.com/httpie/cli
- **Docs**: https://httpie.io/docs/cli

### Tutorials
- [httpie Cheatsheet](https://devhints.io/httpie)
- [httpie vs curl](https://httpie.io/docs/cli/curl-mappings)

### Related Projects
- **httpie Desktop**: GUI-Version (https://httpie.io/app)
- **http-prompt**: Interactive Shell (https://github.com/httpie/http-prompt)

---

## 💡 Pro-Tipps

### 1. **http-prompt (Interaktiver Modus)**

http-prompt ist ein interaktiver HTTP-Client der auf httpie aufbaut. Statt fuer jeden Request einen neuen Befehl einzutippen, oeffnest du eine Session gegen einen API-Server und kannst dann interaktiv Header setzen und Requests senden. Das ist besonders nuetzlich wenn du viele Requests gegen denselben Server sendest und immer die gleichen Header brauchst. Stell dir vor, du testest 20 verschiedene Endpoints einer API und willst nicht bei jedem den Authorization-Header eintippen - in http-prompt setzt du ihn einmal und er gilt fuer alle folgenden Requests. Die Syntax ist die gleiche wie bei httpie.

```bash
# Installation
pip install http-prompt

# Starten
http-prompt api.example.com

# Dann interaktiv:
> Authorization:Bearer abc123
> GET /users
> POST /users name=Alice
```

### 2. **Combine mit jq**

Die Kombination von httpie und jq ist unschlagbar fuer API-Arbeit: httpie holt die Daten, jq filtert und transformiert sie. So extrahierst du genau die Felder die du brauchst, ohne den gesamten Response-Body lesen zu muessen. Stell dir vor, eine API gibt dir 50 User-Objekte mit jeweils 20 Feldern zurueck, aber du brauchst nur die Namen - pipe den Output durch jq und bekomme eine saubere Liste. Diese Kombination ist auch ideal fuer Shell-Skripte, die API-Daten verarbeiten muessen.

```bash
# Extract Fields
http GET api.example.com/users | jq '.[].name'

# Filter
http GET api.example.com/users | jq '.[] | select(.active == true)'
```

### 3. **Dotenv-Integration**

Hardcodierte API-URLs und Tokens in der Kommandozeile sind unsicher und unflexibel. Speichere sie stattdessen in einer .env-Datei und lade sie mit `source .env` in deine Shell. So kannst du die gleichen httpie-Befehle fuer verschiedene Umgebungen (Development, Staging, Production) nutzen, indem du einfach eine andere .env-Datei ladest. Stell dir vor, du wechselst zwischen der Staging- und Production-API - statt die URLs manuell zu aendern, ladest du einfach die passende .env-Datei. Achte darauf, .env-Dateien niemals ins Git-Repository zu committen.

```bash
# .env File
API_BASE=https://api.example.com
API_TOKEN=abc123

# Load + Use
source .env
http GET $API_BASE/users Authorization:"Bearer $API_TOKEN"
```

---

## 🎯 Zusammenfassung

**httpie macht API-Testing zum Vergnügen** - intuitiv und produktiv.

**Quick Wins**:
- ✅ Intuitive Syntax (kein curl-Raten)
- ✅ Lesbare Outputs (colored JSON)
- ✅ Sessions für Auth
- ✅ Perfekt für REST APIs

**Installation**: 2 Minuten
**Learning Curve**: 5 Minuten
**Produktivität**: +50% bei API-Development

---

**Nächster Schritt**: Installiere `httpie` und teste deine nächste API damit! 🌐

---

**Verwandte Lektionen**:
- [07 - jq](./07-jq.md) - JSON Processing (kombiniere mit httpie)
- [05 - tldr](./05-tldr.md) - Quick Help (für httpie-Syntax)
- [08 - gh](./08-gh.md) - GitHub CLI (ähnliche User-Experience)

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0
