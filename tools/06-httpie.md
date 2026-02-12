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
Schnelles Testen von Endpoints während Development:
```bash
http GET api.example.com/users
http POST api.example.com/users name=Alice
```

### 2. **API Documentation Verification**
Checken ob Docs stimmen:
```bash
http GET api.github.com/users/octocat
```

### 3. **Debugging von API-Calls**
Sieh Request + Response Details:
```bash
http -v POST api.example.com/login email=test@example.com
```

### 4. **Session Management**
Persistente Sessions (Cookies, Auth):
```bash
http --session=./session.json POST api.example.com/login
http --session=./session.json GET api.example.com/dashboard
```

### 5. **File-Uploads testen**
Multipart Form-Data:
```bash
http -f POST api.example.com/upload file@~/image.png
```

---

## 💻 Verwendung - Wie du httpie einsetzt

Von der Installation ueber JSON-Handling bis zu Session-Management - hier lernst du alle wichtigen httpie-Features.

### Installation

httpie ist auf allen Plattformen ueber den jeweiligen Paketmanager verfuegbar.

**macOS (Homebrew)**:
```bash
brew install httpie
```

**Ubuntu/Debian**:
```bash
sudo apt install httpie
```

**Arch Linux**:
```bash
sudo pacman -S httpie
```

**Python (Universal)**:
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
```bash
# URL-Encoded Form
http --form POST api.example.com name=John email=john@example.com

# Multipart Form (File-Upload)
http --form POST api.example.com \
  file@~/document.pdf \
  description="Important doc"
```

**4. Output Control**:
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

### 5. **Output in Files für Debugging**
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
```bash
# Claude Code Session: httpie fuer API-Testing
http GET localhost:3000/api/users
```

### Workflow 2: POST-Requests debuggen
```bash
http POST localhost:3000/api/users name="Test" email="test@example.com"
```

### Workflow 3: API-Response als JSON speichern
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

```bash
# JSON (default)
http POST api.example.com name=John

# Form-Data (--form Flag)
http --form POST api.example.com name=John
```

---

### Problem: "Headers nicht erkannt"

```bash
# FALSCH (= statt :)
http GET api.example.com Authorization="Bearer token"

# RICHTIG (: für Headers)
http GET api.example.com Authorization:"Bearer token"
```

---

### Problem: "Session nicht funktioniert"

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
```bash
# Extract Fields
http GET api.example.com/users | jq '.[].name'

# Filter
http GET api.example.com/users | jq '.[] | select(.active == true)'
```

### 3. **Dotenv-Integration**
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
