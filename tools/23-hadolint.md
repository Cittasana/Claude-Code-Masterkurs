# Lektion 23: hadolint - Dockerfile Linter

## 📋 Metadata
- **Kategorie**: Fortgeschrittene Tools
- **Schwierigkeit**: Mittel
- **Voraussetzungen**: Lektion 01-04 (Grundlagen), Docker Kenntnisse
- **Lernzeit**: 40-50 Minuten
- **Zielgruppe**: DevOps, Container-Entwickler, Docker-Nutzer

---

> 🚀 **Claude Code Relevanz**: Hadolint validiert von Claude Code generierte Dockerfiles automatisch gegen Best Practices -- essentiell, um sichere und effiziente Container-Images in AI-Workflows zu gewaehrleisten.

## 🎯 Berechtigung: Warum hadolint?

### Problem ohne hadolint:
```dockerfile
# Unsicheres, ineffizientes Dockerfile
FROM ubuntu
RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
COPY . /app
RUN pip install -r requirements.txt
USER root
EXPOSE 8080
CMD python3 app.py
```

**Probleme**:
❌ Kein Version-Tag (`ubuntu` → unkontrollierte Updates)
❌ Multiple RUN-Layers (ineffizient, größeres Image)
❌ Fehlende Cache-Cleaning (apt-get)
❌ `USER root` ist Sicherheitsrisiko
❌ CMD ohne exec form (kein Signal-Handling)
❌ COPY vor pip install (Cache-Invalidierung)

### Lösung mit hadolint:
```bash
$ hadolint Dockerfile

Dockerfile:1 DL3006 warning: Always tag the version of an image explicitly
Dockerfile:2 DL3008 warning: Pin versions in apt get install
Dockerfile:2 DL3009 info: Delete the apt-get lists after installing
Dockerfile:3 DL3059 info: Multiple consecutive `RUN` instructions
Dockerfile:7 DL3042 warning: Avoid use of cache directory with pip
Dockerfile:8 DL3002 warning: Last USER should not be root
Dockerfile:10 DL3025 warning: Use arguments JSON notation for CMD
```

### Optimiertes Dockerfile:
```dockerfile
# ✓ Alle hadolint-Checks bestanden
FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3=3.10.* \
        python3-pip=22.0.* && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first (besseres Caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy App (später, für besseren Cache)
COPY . .

# Non-root User
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 8080

# Exec form für proper Signal-Handling
CMD ["python3", "app.py"]
```

### Kernvorteile:
✅ **Best Practices**: Über 50 Docker-Best-Practice-Rules
✅ **Sicherheit**: Findet Security-Risiken (root user, secrets)
✅ **Performance**: Optimiert Layer-Caching + Image-Size
✅ **CI/CD-Ready**: Blockiert fehlerhafte Dockerfiles
✅ **Multi-Stage-Support**: Versteht komplexe Builds
✅ **Shell-Check Integration**: Prüft RUN-Commands auf Syntax

---

## 🎯 Zwecke: Wofür wird hadolint verwendet?

### 1. **Sicherheits-Auditing**
- Root-User Warnings
- Secret-Leakage Detection
- Unsafe Commands finden

### 2. **Image-Optimierung**
- Redundante Layers reduzieren
- Cache-Efficiency verbessern
- Image-Size minimieren

### 3. **Best-Practice-Enforcement**
- Version-Pinning durchsetzen
- Proper COPY-Order
- CMD/ENTRYPOINT-Formatting

### 4. **CI/CD-Integration**
- Pre-commit Checks
- Pull Request Validation
- Automated Security Scans

### 5. **Team-Standards**
- Konsistente Dockerfile-Patterns
- Onboarding neuer Entwickler
- Code-Review-Automation

---

## 🚀 Verwendung

Dieser Abschnitt fuehrt dich durch Installation, grundlegendes Linting und fortgeschrittene Konfiguration von hadolint.

### Installation

Hadolint ist als einzelne Binary verfuegbar und hat keine weiteren Abhaengigkeiten. Alternativ kann es auch ueber Docker ohne lokale Installation genutzt werden.

#### macOS (mit Homebrew):
```bash
# Via Homebrew (empfohlen)
brew install hadolint

# Oder Binary Download
wget -O /usr/local/bin/hadolint \
  https://github.com/hadolint/hadolint/releases/latest/download/hadolint-Darwin-x86_64
chmod +x /usr/local/bin/hadolint
```

#### Ubuntu/Debian:
```bash
# Binary Download
sudo wget -O /usr/local/bin/hadolint \
  https://github.com/hadolint/hadolint/releases/latest/download/hadolint-Linux-x86_64
sudo chmod +x /usr/local/bin/hadolint

# Oder via Docker (kein Install nötig)
alias hadolint='docker run --rm -i hadolint/hadolint'
```

#### Arch Linux:
```bash
# Via yay (AUR)
yay -S hadolint-bin

# Oder via pacman (Community Repo)
sudo pacman -S hadolint
```

---

### Quick Start: Erste Schritte

Die grundlegende Nutzung von hadolint ist einfach: Du uebergibst eine Dockerfile-Datei, und hadolint prueft sie gegen ueber 50 Best-Practice-Rules.

#### 1. **Einzelnes Dockerfile linten**

Der einfachste Aufruf prueft ein einzelnes Dockerfile im aktuellen Verzeichnis:

```bash
# Dockerfile im aktuellen Verzeichnis
hadolint Dockerfile

# Spezifischen Pfad
hadolint path/to/Dockerfile

# Oder via stdin
cat Dockerfile | hadolint -
```

> 💡 **Tipp**: Fuehre hadolint immer VOR dem Docker-Build aus -- so sparst du dir lange Build-Zeiten fuer fehlerhafte oder ineffiziente Dockerfiles.

#### 2. **Alle Dockerfiles im Projekt**
```bash
# Mit find
find . -name "Dockerfile*" -exec hadolint {} \;

# Mit fd (aus Lektion 14)
fd -t f "Dockerfile" | xargs hadolint

# Oder rekursiv mit Glob
hadolint **/*Dockerfile
```

#### 3. **Output-Formate**

Hadolint bietet verschiedene Ausgabeformate fuer unterschiedliche Integrationen -- von farbiger Terminal-Ausgabe bis hin zu SARIF fuer GitHub Code Scanning:

```bash
# JSON (für CI/CD)
hadolint --format json Dockerfile

# TTY (colored output, default)
hadolint --format tty Dockerfile

# Codeclimate (für GitLab CI)
hadolint --format codeclimate Dockerfile

# Checkstyle (für Jenkins)
hadolint --format checkstyle Dockerfile

# SARIF (für GitHub Code Scanning)
hadolint --format sarif Dockerfile
```

#### 4. **Config-File erstellen (.hadolint.yaml)**

In der Konfigurationsdatei definierst du, welche Rules ignoriert werden sollen und welche Registries als vertrauenswuerdig gelten:

```bash
cat > .hadolint.yaml << 'EOF'
ignored:
  - DL3008  # Pin versions in apt-get (optional für Dev-Images)
  - DL3009  # Delete apt-get lists (optional für Debug-Images)

trustedRegistries:
  - docker.io
  - ghcr.io
  - quay.io

failure-threshold: warning  # Fail bei Warnings (nicht nur Errors)
EOF
```

#### 5. **VSCode Integration**
```bash
# Extension installieren
code --install-extension exiasr.hadolint

# .vscode/settings.json
cat > .vscode/settings.json << 'EOF'
{
  "hadolint.hadolintPath": "/usr/local/bin/hadolint",
  "hadolint.cliOptions": ["--config", ".hadolint.yaml"],
  "files.associations": {
    "Dockerfile*": "dockerfile"
  }
}
EOF
```

---

### Advanced Usage

Fortgeschrittene hadolint-Techniken fuer Multi-Stage-Builds, Security-Konfiguration und Shell-Check-Integration.

#### 1. **Nur spezifische Rules prüfen**

Du kannst den Schweregrad filtern oder einzelne Rules inline per Kommentar deaktivieren:

```bash
# Nur Security-Rules
hadolint --failure-threshold error Dockerfile

# Ignore bestimmte Rules inline
FROM ubuntu:22.04
# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y python3
```

#### 2. **Multi-Stage Build Validation**
```bash
# hadolint versteht Multi-Stage
cat > Dockerfile << 'EOF'
# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /build/node_modules ./node_modules
COPY . .
USER node
CMD ["node", "server.js"]
EOF

hadolint Dockerfile  # Prüft beide Stages
```

#### 3. **Shell-Check Integration**
```bash
# hadolint nutzt shellcheck für RUN-Commands
cat > Dockerfile << 'EOF'
FROM alpine:3.18
RUN if [ "$DEBUG" = "true" ]; \
      echo "Debug mode"; \
    fi  # ← Syntax-Error!
EOF

hadolint Dockerfile
# SC2086: Double quote to prevent globbing
```

> ⚠️ **Warnung**: Nutze niemals `FROM ubuntu` ohne Version-Tag in Production-Dockerfiles. Ein ungepinntes Base-Image kann bei Updates unerwartetes Verhalten verursachen. Hadolint meldet dies als DL3006.

#### 4. **Trusted Registries (Security)**
```yaml
# .hadolint.yaml
trustedRegistries:
  - docker.io/library  # Official images only
  - ghcr.io/mycompany  # Company registry

# Warnt bei FROM ubuntu:latest (nicht in trustedRegistries)
# OK: FROM docker.io/library/ubuntu:22.04
```

#### 5. **Custom Rules via Config**
```yaml
# .hadolint.yaml
override:
  error:
    - DL3008  # Upgrade Warning → Error
  warning:
    - DL3009
  info:
    - DL3059
  style:
    - DL3060

label-schema:
  author: required
  version: required
```

#### 6. **Integration in Pre-commit**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/hadolint/hadolint
    rev: v2.12.0
    hooks:
      - id: hadolint-docker
        args: ['--config', '.hadolint.yaml']
```

---

## 💡 Best Practices

### 1. **Security-First Config**
```yaml
# .hadolint.yaml
failure-threshold: warning

ignored: []  # Keine Rules deaktivieren

trustedRegistries:
  - docker.io/library
  - ghcr.io/company

strict-labels: true

# Labels erzwingen
label-schema:
  maintainer: required
  version: required
  security-contact: required
```

> 🚀 **Beispiel**: Die beste Docker-Security-Pipeline kombiniert drei Tools: `hadolint Dockerfile && docker build -t app . && trivy image app` -- Pre-Build-Linting, Build und Post-Build-Vulnerability-Scan.

### 2. **CI/CD-Integration (GitHub Actions)**
```yaml
# .github/workflows/docker-lint.yml
name: Hadolint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run hadolint
        uses: hadolint/hadolint-action@v3.1.0
        with:
          dockerfile: ./Dockerfile
          config: .hadolint.yaml
          failure-threshold: warning

      - name: Hadolint (all Dockerfiles)
        run: |
          find . -name "Dockerfile*" -exec hadolint {} \;
```

### 3. **Progressive Rollout**
```yaml
# Phase 1: Nur Errors (.hadolint.yaml)
failure-threshold: error

# Phase 2: Errors + Warnings
failure-threshold: warning

# Phase 3: Alles (strict mode)
failure-threshold: info
strict-labels: true
```

### 4. **Monorepo mit mehreren Configs**
```bash
# Root .hadolint.yaml (global)
cat > .hadolint.yaml << 'EOF'
failure-threshold: warning
trustedRegistries:
  - docker.io
EOF

# services/api/.hadolint.yaml (override)
cat > services/api/.hadolint.yaml << 'EOF'
extends: ../../.hadolint.yaml
ignored:
  - DL3008  # Dev-Images erlauben unpinned versions
EOF

# Lint mit lokaler Config
hadolint --config services/api/.hadolint.yaml services/api/Dockerfile
```

### 5. **Auto-Fix-Script (teilweise)**
```bash
# auto-fix-dockerfile.sh
cat > auto-fix-dockerfile.sh << 'EOF'
#!/bin/bash
# Automatisches Fixing von häufigen Issues

FILE="$1"

# DL3006: Add version tags
sed -i 's/FROM ubuntu$/FROM ubuntu:22.04/g' "$FILE"
sed -i 's/FROM node$/FROM node:18-alpine/g' "$FILE"

# DL3025: Use JSON notation for CMD
sed -i 's/CMD python app.py/CMD ["python", "app.py"]/g' "$FILE"

echo "✓ Auto-fixed $FILE"
echo "⚠️  Run 'hadolint $FILE' to check remaining issues"
EOF
chmod +x auto-fix-dockerfile.sh
```

---

## 📚 Beispiele

### Beispiel 1: Version-Pinning durchsetzen
```dockerfile
# Vorher: DL3006
FROM ubuntu
FROM node

# hadolint
$ hadolint Dockerfile
DL3006: Always tag the version of an image explicitly

# Nachher: Fixed
FROM ubuntu:22.04
FROM node:18-alpine
```

### Beispiel 2: Layer-Optimierung
```dockerfile
# Vorher: DL3059 (Multiple consecutive RUNs)
FROM ubuntu:22.04
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y wget
RUN apt-get install -y git

# hadolint
$ hadolint Dockerfile
DL3059: Multiple consecutive RUN instructions. Consider consolidation.

# Nachher: Fixed (1 Layer statt 4)
FROM ubuntu:22.04
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        wget \
        git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### Beispiel 3: apt-get Best Practices
```dockerfile
# Vorher: DL3008, DL3009, DL3015
FROM ubuntu:22.04
RUN apt-get install -y python3

# hadolint
$ hadolint Dockerfile
DL3008: Pin versions in apt-get install
DL3009: Delete the apt-get lists after installing
DL3015: Avoid additional packages by specifying --no-install-recommends

# Nachher: Fixed
FROM ubuntu:22.04
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3=3.10.* && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### Beispiel 4: Root-User Sicherheitsrisiko
```dockerfile
# Vorher: DL3002
FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/
USER root
CMD ["nginx", "-g", "daemon off;"]

# hadolint
$ hadolint Dockerfile
DL3002: Last USER should not be root

# Nachher: Fixed
FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/
# Create non-root user
RUN adduser -D -u 1000 nginxuser && \
    chown -R nginxuser:nginxuser /var/cache/nginx /var/run
USER nginxuser
CMD ["nginx", "-g", "daemon off;"]
```

### Beispiel 5: CMD/ENTRYPOINT Exec Form
```dockerfile
# Vorher: DL3025
FROM python:3.11-alpine
CMD python app.py

# hadolint
$ hadolint Dockerfile
DL3025: Use arguments JSON notation for CMD and ENTRYPOINT

# Problem: Shell-Form kann Signals nicht handhaben (SIGTERM)

# Nachher: Fixed (Exec Form)
FROM python:3.11-alpine
CMD ["python", "app.py"]

# Oder mit ENTRYPOINT + CMD
ENTRYPOINT ["python"]
CMD ["app.py"]
```

### Beispiel 6: pip/npm Cache Optimization
```dockerfile
# Vorher: DL3042 (pip), DL3059 (npm)
FROM python:3.11-alpine
COPY . /app
RUN pip install -r requirements.txt

# hadolint
$ hadolint Dockerfile
DL3042: Avoid use of cache directory with pip install

# Nachher: Fixed
FROM python:3.11-alpine
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
```

> 💡 **Tipp**: Hadolint integriert ShellCheck automatisch -- dadurch werden auch Bash-Syntaxfehler innerhalb von RUN-Befehlen erkannt, was besonders bei komplexen Multi-Line-Commands hilfreich ist.

### Beispiel 7: COPY Order für Caching
```dockerfile
# Vorher: Schlechtes Caching
FROM node:18-alpine
COPY . /app
WORKDIR /app
RUN npm install

# Problem: Jede Code-Änderung invalidiert npm install Cache!

# Nachher: Optimiert
FROM node:18-alpine
WORKDIR /app
# Copy nur package files zuerst
COPY package*.json ./
RUN npm ci --only=production
# Copy Code danach (besseres Caching)
COPY . .
```

### Beispiel 8: Multi-Stage Build
```dockerfile
# Vorher: Fetter Container mit Build-Tools
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    gcc
COPY . /app
RUN cd /app && make build
CMD ["/app/myapp"]

# hadolint → OK, aber Image zu groß (800MB)

# Nachher: Multi-Stage (optimiert)
# Stage 1: Builder
FROM ubuntu:22.04 AS builder
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential=12.9* \
    python3-dev=3.10.* \
    gcc=4:11.* && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
COPY . /build
WORKDIR /build
RUN make build

# Stage 2: Runtime (nur Binary)
FROM ubuntu:22.04 AS runtime
RUN useradd -m -u 1000 appuser
COPY --from=builder /build/myapp /app/
USER appuser
CMD ["/app/myapp"]

# Resultat: 150MB statt 800MB!
```

### Beispiel 9: Shell-Check Integration
```dockerfile
# Vorher: Bash-Syntax-Fehler
FROM alpine:3.18
RUN if [ "$DEBUG" = "true" ]
      then echo "Debug"
    fi  # ← Missing "then" on same line

# hadolint (mit shellcheck)
$ hadolint Dockerfile
SC1050: Expected 'then' on line 2

# Nachher: Fixed
FROM alpine:3.18
RUN if [ "$DEBUG" = "true" ]; then \
      echo "Debug"; \
    fi
```

### Beispiel 10: Batch-Linting mit Report
```bash
# Alle Dockerfiles linten und Report erstellen
fd -t f "Dockerfile" -x hadolint --format json {} | \
  jq -s '.' > hadolint-report.json

# Human-readable Summary
cat hadolint-report.json | jq -r '.[] | "\(.file): \(.level) - \(.message)"'

# Output:
# ./Dockerfile: error - DL3006: Always tag version
# ./api/Dockerfile: warning - DL3008: Pin versions
# ./web/Dockerfile: info - DL3059: Multiple RUNs
```

---

## 🔧 Integration in Claude Code Workflows

### 1. **AI-gestützte Dockerfile-Optimierung**
```bash
# Hadolint-Report generieren
hadolint --format json Dockerfile > hadolint-report.json

# Claude analysiert und schlägt Fixes vor
cat hadolint-report.json | claude "Analyze these Dockerfile issues and suggest optimized version"

# Oder direkt Dockerfile-Review
cat Dockerfile | claude "Review this Dockerfile and suggest improvements based on hadolint best practices"
```

### 2. **Automatisches Dockerfile-Refactoring**
```bash
# Workflow: hadolint findet Issues → Claude generiert Fixed Version
cat > auto-optimize-dockerfile.sh << 'EOF'
#!/bin/bash
DOCKERFILE="$1"

# hadolint-Report
hadolint --format json "$DOCKERFILE" > issues.json

# Claude generiert optimiertes Dockerfile
cat "$DOCKERFILE" | claude "Fix this Dockerfile based on these hadolint issues: $(cat issues.json)" > "${DOCKERFILE}.optimized"

echo "✓ Optimized version: ${DOCKERFILE}.optimized"
diff -u "$DOCKERFILE" "${DOCKERFILE}.optimized"
EOF
chmod +x auto-optimize-dockerfile.sh
```

### 3. **Pre-Review Dockerfile-Check**
```bash
# Vor Code-Review: Alle Dockerfiles prüfen
git diff main...HEAD --name-only | \
  grep -i "dockerfile" | \
  xargs hadolint

# Mit Claude für Security-Analyse
cat Dockerfile | claude "Security audit for this Dockerfile"
```

### 4. **Migration Assistant**
```bash
# Legacy-Dockerfiles modernisieren
cat old-dockerfile | claude "Modernize this Dockerfile to pass hadolint checks and use multi-stage builds"
```

---

## 🤖 Claude Code Integration

### Workflow 1: Dockerfile nach Claude Code pruefen

Nachdem Claude Code ein Dockerfile generiert oder modifiziert hat, prueft dieser Befehl es sofort gegen ueber 50 Best-Practice-Regeln. AI-generierte Dockerfiles sind oft funktional korrekt, aber nicht immer optimal in Bezug auf Sicherheit, Image-Groesse und Layer-Caching. Hadolint findet Probleme wie ungepinnte Base-Images, fehlende Cache-Bereinigung und unsichere User-Konfigurationen. Stell dir vor, Claude generiert ein Dockerfile fuer eine Python-App und verwendet `FROM python` ohne Version-Tag -- hadolint meldet sofort DL3006 und du kannst Claude bitten, die Version zu pinnen. Das gibt dir ein automatisches Qualitaetsgate fuer Container-Konfigurationen.

```bash
hadolint Dockerfile
```

### Workflow 2: Alle Dockerfiles im Projekt linten

In Microservice-Architekturen hat jeder Service sein eigenes Dockerfile, und es ist wichtig, dass alle den gleichen Best-Practice-Standards folgen. Dieser Befehl findet mit `fd` alle Dockerfiles im Projekt und prueft sie einzeln mit hadolint. Das ist besonders nuetzlich vor einem Release oder als Teil einer CI/CD-Pipeline, um sicherzustellen, dass kein Dockerfile uebersehen wird. Stell dir vor, du hast 8 Microservices mit je einem Dockerfile -- statt jeden einzeln zu pruefen, findet dieser Befehl alle automatisch und zeigt eine konsolidierte Ausgabe. So stellst du sicher, dass alle Container-Images den Sicherheits- und Performance-Standards entsprechen.

```bash
fd Dockerfile | xargs hadolint
```

### Workflow 3: Bestimmte Regeln ignorieren

In manchen Situationen sind bestimmte hadolint-Regeln nicht relevant, z.B. wenn du ein Development-Image baust, bei dem Version-Pinning nicht kritisch ist. Mit `--ignore` kannst du einzelne Regeln fuer einen bestimmten Aufruf deaktivieren, ohne die globale Konfiguration zu aendern. DL3008 (Pin versions in apt-get) und DL3015 (Use --no-install-recommends) sind typische Kandidaten fuer Development-Images. Stell dir vor, du baust ein Debug-Image, das moeglichst viele Tools enthalten soll -- in diesem Fall ist Version-Pinning kontraproduktiv, und du ignorierst die Regel gezielt. Fuer dauerhafte Ausnahmen empfiehlt sich eine `.hadolint.yaml`-Datei statt Kommandozeilen-Flags.

```bash
hadolint --ignore DL3008 --ignore DL3015 Dockerfile
```

> 💡 **Tipp**: Lasse Claude Code Dockerfiles generieren und pruefe sie sofort mit hadolint auf Best Practices.

---

## 🐛 Troubleshooting

### Problem 1: Zu viele Warnings in Legacy-Dockerfiles
```yaml
# .hadolint.yaml - Graduelles Rollout
# Phase 1: Nur critical errors
ignored:
  - DL3008  # Pin versions (later)
  - DL3009  # Delete lists (later)
  - DL3015  # No recommends (later)

failure-threshold: error

# Phase 2: Schrittweise aktivieren
# - DL3008 entfernen
# - DL3009 entfernen
```

### Problem 2: False Positives bei Custom Base-Images
```yaml
# .hadolint.yaml
ignored:
  - DL3006  # Ignore version tag for internal base images

trustedRegistries:
  - company-registry.io/base-images
```

### Problem 3: hadolint findet keine Config
```bash
# Expliziter Config-Path
hadolint --config /path/to/.hadolint.yaml Dockerfile

# Oder Environment Variable
export HADOLINT_CONFIG=.hadolint.yaml
hadolint Dockerfile
```

### Problem 4: Shell-Check Rules zu streng
```yaml
# .hadolint.yaml
# Shell-Check Rules deaktivieren
shellcheck:
  external-sources: true  # Erlaubt 'source' von externen Files

ignored:
  - SC2086  # Double quote to prevent globbing (manchmal OK)
  - SC2046  # Quote to prevent word splitting (manchmal OK)
```

### Problem 5: Multi-Stage Builds mit shared Base
```dockerfile
# Problem: hadolint warnt bei FROM ohne Tag in Stage 2
FROM ubuntu:22.04 AS base
RUN apt-get update

FROM base AS builder  # ← DL3006 warning: missing version
RUN make build

# Lösung: Inline-Ignore
FROM ubuntu:22.04 AS base
RUN apt-get update

# hadolint ignore=DL3006
FROM base AS builder
RUN make build
```

---

## 📊 Vergleich: hadolint vs. Alternativen

| Feature | **hadolint** | dockle | trivy | dive |
|---------|-------------|--------|-------|------|
| **Dockerfile Linting** | ✅ 50+ Rules | ⚠️ Basic | ❌ Nein | ❌ Nein |
| **Security-Checks** | ✅ Best Practices | ✅ CIS Benchmark | 🏆 Vulnerability Scan | ❌ Nein |
| **Shell-Check** | ✅ Integrated | ❌ Nein | ❌ Nein | ❌ Nein |
| **Layer-Analysis** | ⚠️ Basic | ✅ Ja | ❌ Nein | 🏆 Visuell |
| **CI/CD-Ready** | ✅ Ja | ✅ Ja | ✅ Ja | ⚠️ Limitiert |
| **Speed** | ⚡ Instant | Schnell | Mittel | Schnell |
| **Config-File** | ✅ YAML | ✅ YAML | ✅ YAML | ❌ Nein |
| **IDE-Support** | ✅ VSCode | ❌ Nein | ❌ Nein | ❌ Nein |
| **Focus** | Best Practices | Security | Vulnerabilities | Image Size |

### Wann welches Tool?

**Verwende hadolint wenn:**
- ✅ Dockerfile-Best-Practices durchsetzen
- ✅ Shell-Syntax in RUN-Commands prüfen
- ✅ CI/CD-Linting vor Build

**Verwende trivy wenn:**
- ✅ Security-Vulnerabilities in Dependencies scannen
- ✅ Image-Scanning nach CVEs
- ✅ Secrets-Detection

**Verwende dive wenn:**
- ✅ Image-Size analysieren und optimieren
- ✅ Layer-Waste finden
- ✅ Visuelles Exploration

**Best Combo**: hadolint (Pre-Build) + trivy (Post-Build) + dive (Optimization)

---

## 🔗 Weiterführende Links

### Offizielle Ressourcen:
- **Hadolint Docs**: https://github.com/hadolint/hadolint
- **Rules Reference**: https://github.com/hadolint/hadolint#rules
- **Config**: https://github.com/hadolint/hadolint#configure

### Integration:
- **VSCode Extension**: https://marketplace.visualstudio.com/items?itemName=exiasr.hadolint
- **Pre-commit Hook**: https://github.com/hadolint/hadolint/blob/master/.pre-commit-hooks.yaml
- **GitHub Action**: https://github.com/hadolint/hadolint-action

### Best Practices:
- **Dockerfile Best Practices**: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- **CIS Docker Benchmark**: https://www.cisecurity.org/benchmark/docker

---

## 💎 Pro-Tipps

### Tipp 1: hadolint in Watch-Mode

Beim iterativen Entwickeln eines Dockerfiles willst du sofort sehen, ob deine Aenderungen den Best-Practice-Checks entsprechen. Dieser Watch-Mode nutzt entr, um bei jeder Aenderung am Dockerfile automatisch hadolint auszufuehren. Der `-c`-Flag loescht den Bildschirm vor jedem Durchlauf, sodass du immer eine saubere Ausgabe siehst. Stell dir vor, du optimierst ein Dockerfile Schritt fuer Schritt -- du fuegest die Cache-Bereinigung hinzu, speicherst, und siehst sofort, dass DL3009 verschwindet. Der `|| true` am Ende verhindert, dass entr beendet wird, wenn hadolint Warnings meldet. Das ist besonders nuetzlich, wenn du ein neues Dockerfile von Grund auf schreibst und es iterativ verbessern willst.

```bash
# Auto-lint bei jedem Dockerfile-Save
fd -e dockerfile -e Dockerfile | entr -c hadolint /_

# Mit Color-Output
fd Dockerfile | entr -c sh -c 'hadolint --format tty /_ || true'
```

### Tipp 2: hadolint + trivy Pipeline

Die beste Docker-Security-Pipeline kombiniert drei Tools fuer verschiedene Pruefungsphasen. Hadolint prueft das Dockerfile vor dem Build auf Best-Practice-Verstoesse, trivy scannt das gebaute Image auf bekannte Sicherheitsluecken (CVEs) in den installierten Paketen, und dive analysiert die Layer-Struktur auf verschwendeten Speicherplatz. Stell dir vor, hadolint findet keine Probleme im Dockerfile, aber trivy entdeckt, dass das Base-Image eine kritische OpenSSL-Vulnerability hat -- ohne trivy wuerde diese Luecke unbemerkt in Production landen. Die sequenzielle Ausfuehrung mit `&&` stellt sicher, dass bei einem Fehler in einem Schritt die nachfolgenden Schritte nicht ausgefuehrt werden. Diese Pipeline sollte in jeder CI/CD-Konfiguration fuer Docker-basierte Anwendungen Standard sein.

```bash
# Complete Docker-Security-Pipeline
hadolint Dockerfile && \
  docker build -t myapp:test . && \
  trivy image myapp:test && \
  dive myapp:test
```

### Tipp 3: Custom-hadolint-Rules (via Config)

Firmmenspezifische Regeln stellen sicher, dass alle Docker-Images bestimmte Anforderungen erfuellen, die ueber die Standard-Regeln hinausgehen. Mit `label-schema` kannst du erzwingen, dass jedes Dockerfile bestimmte Labels enthaelt, z.B. Kostenstelle, Team-Zuordnung und Umgebung. `strict-labels: true` sorgt dafuer, dass hadolint fehlschlaegt, wenn eines der geforderten Labels fehlt. Stell dir vor, euer Operations-Team braucht fuer jedes Image die Information, welches Team dafuer verantwortlich ist und zu welchem Cost Center es gehoert -- diese Konfiguration erzwingt das automatisch bei jedem Build. Die `trustedRegistries`-Liste beschraenkt zusaetzlich, welche Container-Registries verwendet werden duerfen, was verhindert, dass Entwickler Images aus unvertrauenswuerdigen Quellen verwenden.

```yaml
# .hadolint.yaml
# Firm-specific Rules
label-schema:
  cost-center: required
  team: required
  env: required

strict-labels: true

# Nur spezifische Registries
trustedRegistries:
  - company.azurecr.io
```

### Tipp 4: Ignore-Pattern für generated Dockerfiles

Automatisch generierte Dockerfiles folgen oft nicht den gleichen Best Practices wie manuell geschriebene. Wenn ein Build-System oder ein Code-Generator Dockerfiles erzeugt, kann es sinnvoll sein, bestimmte Regeln wie DL3059 (Multiple consecutive RUNs) zu ignorieren, da der Generator moeglicherweise separate RUN-Befehle fuer bessere Lesbarkeit oder Caching verwendet. Der Inline-Kommentar `# hadolint ignore=DL3059` deaktiviert die Regel fuer den naechsten Befehl, waehrend die YAML-Config sie global deaktiviert. Stell dir vor, ein CI/CD-System generiert dynamisch Dockerfiles basierend auf der Projektkonfiguration -- diese Dockerfiles haben oft eine andere Struktur als manuell geschriebene, und bestimmte Regeln sind nicht anwendbar. Verwende Inline-Ignores praezise und dokumentiere den Grund.

```yaml
# .hadolint.yaml
ignored:
  - DL3059  # Multiple RUNs OK in auto-generated Files

# Or inline
# hadolint ignore=DL3059
RUN command1
RUN command2
```

### Tipp 5: hadolint in Docker-Compose Validation

Dieser Befehl kombiniert yq und hadolint, um automatisch alle Dockerfiles zu linten, die in einer Docker-Compose-Datei referenziert werden. yq extrahiert die Dockerfile-Pfade aus der `build.dockerfile`-Konfiguration jedes Services, und hadolint prueft sie einzeln. Das ist besonders nuetzlich in Projekten mit vielen Services, wo die Dockerfiles in verschiedenen Verzeichnissen liegen. Stell dir vor, du hast eine Docker-Compose-Datei mit 6 Services, die jeweils ein eigenes Dockerfile in verschiedenen Unterverzeichnissen haben -- statt jeden Pfad manuell einzugeben, extrahiert yq alle Pfade automatisch. So stellst du sicher, dass vor einem `docker-compose up` alle Dockerfiles den Best Practices entsprechen.

```bash
# Lint all Dockerfiles referenced in docker-compose.yml
cat docker-compose.yml | \
  yq '.services[].build.dockerfile' | \
  xargs hadolint
```

---

## 📝 Zusammenfassung

**hadolint** ist der Standard-Linter für Dockerfiles:

### ✅ Hauptvorteile:
- **50+ Rules**: Docker-Best-Practices automatisch durchsetzen
- **Security**: Findet Sicherheitsrisiken (root user, secrets)
- **Performance**: Optimiert Layer-Caching und Image-Size
- **Shell-Check**: Prüft RUN-Commands auf Syntax-Fehler
- **CI/CD-Ready**: Blockiert fehlerhafte Dockerfiles

### 🎯 Kern-Use-Cases:
1. **Best Practices**: Version-Pinning, Layer-Optimierung
2. **Security**: Root-User, Trusted-Registries
3. **Performance**: Cache-Optimization, Multi-Stage
4. **Team-Standards**: Konsistente Dockerfile-Patterns
5. **CI/CD**: Pre-Build Validation

### 🚀 Wichtigste Befehle:
```bash
hadolint Dockerfile                  # Basic Lint
hadolint --format json Dockerfile    # JSON-Report
hadolint --config .hadolint.yaml .   # Mit Config
fd Dockerfile | xargs hadolint       # Alle Dockerfiles
```

### 💡 Best Practice:
```yaml
# .hadolint.yaml
failure-threshold: warning
trustedRegistries:
  - docker.io/library
ignored: []  # Keine Rules deaktivieren

label-schema:
  maintainer: required
  version: required
```

### ⚠️ Wichtig:
- hadolint prüft **nur Dockerfile**, nicht das gebaute Image (nutze trivy dafür)
- Kombiniere mit trivy für Vulnerability-Scanning
- Nutze dive für Image-Size-Analyse
- Integriere in Pre-commit Hooks und CI/CD

### 🔗 Integration:
Perfekt kombinierbar mit **trivy** (Vulnerability-Scan), **dive** (Image-Analyse), **Docker**, **CI/CD**, und **Claude Code** für AI-gestützte Dockerfile-Optimierung.

**Nächste Lektion**: [24-htop.md](./24-htop.md) - Interaktiver Process Monitor

---

**🎓 Claude Code Masterkurs** | © 2026 | [Zurück zur Übersicht](../README.md)
