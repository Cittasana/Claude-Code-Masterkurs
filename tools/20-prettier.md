# Lektion 20: prettier - Opinionated Code Formatter

## 📋 Metadata
- **Kategorie**: Fortgeschrittene Tools
- **Schwierigkeit**: Mittel
- **Voraussetzungen**: Lektion 01-04 (Grundlagen), Node.js/npm Kenntnisse
- **Lernzeit**: 45-60 Minuten
- **Zielgruppe**: Entwickler, die konsistenten Code-Stil durchsetzen möchten

---

> 🚀 **Claude Code Relevanz**: Prettier formatiert von Claude Code generierten Code automatisch in einen einheitlichen Stil, sodass AI-generierter und manuell geschriebener Code nahtlos zusammenpassen.

## 🎯 Berechtigung: Warum prettier?

### Problem ohne prettier:
```javascript
// Inkonsistenter Code im Team
const user={name:"John",age:30,email:"john@example.com"}

function getData( ){
  return fetch('/api/data')
    .then(response=>response.json()).then(data=>{
      return data
    })
}

const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
```

### Lösung mit prettier:
```javascript
// Automatisch formatierter, einheitlicher Code
const user = {
  name: "John",
  age: 30,
  email: "john@example.com",
};

function getData() {
  return fetch("/api/data")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

const arr = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
];
```

### Kernvorteile:
✅ **Zero-Configuration**: Funktioniert out-of-the-box ohne Setup
✅ **Opinionated**: Keine endlosen Style-Diskussionen im Team
✅ **Multi-Language**: JS, TS, CSS, HTML, JSON, Markdown, YAML uvm.
✅ **Editor-Integration**: Plugins für alle gängigen Editoren
✅ **CI/CD-Ready**: Automatische Formatierung in Pipelines
✅ **Git-Friendly**: Reduziert Merge-Konflikte durch konsistenten Stil

---

## 🎯 Zwecke: Wofür wird prettier verwendet?

### 1. **Team-Code-Konsistenz**
- Einheitlicher Code-Stil ohne manuelle Reviews
- Eliminiert "Tabs vs. Spaces"-Diskussionen
- Automatische Formatierung bei jedem Save

### 2. **Produktivitätssteigerung**
- Keine Zeit für manuelle Formatierung
- Konzentration auf Logik statt Stil
- Schnelleres Code-Review

### 3. **Multi-Projekt-Standards**
- Gleicher Stil über alle Projekte hinweg
- Shared Config über npm-Package
- Firmenweite Style-Guides

### 4. **Legacy-Code-Refactoring**
- Alte Codebases schnell formatieren
- Vor großen Refactorings aufräumen
- Migration zu neuem Style-Guide

### 5. **Automatisierung**
- Pre-commit Hooks mit husky + lint-staged
- CI/CD-Integration
- Editor-on-save Formatierung

---

## 🚀 Verwendung

Dieser Abschnitt zeigt dir Installation, Grundbefehle und fortgeschrittene Konfiguration von prettier.

### Installation

Prettier wird ueber npm installiert. Die projektlokale Installation ist empfohlen, damit alle Teammitglieder dieselbe Version verwenden.

#### macOS (mit Homebrew):
```bash
# Global installieren (nicht empfohlen für Projekte)
npm install -g prettier

# Oder pro Projekt (empfohlen)
npm install --save-dev prettier

# Alternativ mit pnpm
pnpm add -D prettier

# Oder mit yarn
yarn add --dev prettier
```

#### Ubuntu/Debian:

Stelle zuerst sicher, dass Node.js installiert ist, und installiere dann prettier ueber npm:

```bash
# Node.js/npm installieren (falls nicht vorhanden)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# prettier installieren
npm install --save-dev prettier
```

#### Arch Linux:
```bash
# Via npm (empfohlen)
npm install --save-dev prettier

# Oder aus AUR
yay -S prettier
```

#### Standalone Binary (ohne Node.js):

Falls du kein Node.js installiert hast, kannst du prettier auch als Standalone-Binary verwenden oder per `npx` ohne Installation ausfuehren:

```bash
# Download für macOS/Linux
curl -o prettier https://unpkg.com/prettier@latest/bin-prettier.js
chmod +x prettier
sudo mv prettier /usr/local/bin/

# Oder via npx (kein Install nötig)
npx prettier --version
```

---

### Quick Start: Erste Schritte

In wenigen Schritten richtest du prettier ein und formatierst deinen ersten Code.

#### 1. **Einzelne Datei formatieren**

Der Grundbefehl gibt formatierten Code auf stdout aus. Mit `--write` wird die Datei direkt ueberschrieben:

```bash
# Datei formatieren und Ausgabe anzeigen
prettier script.js

# Datei direkt überschreiben
prettier --write script.js

# Mehrere Dateien
prettier --write src/index.js src/utils.js
```

> 💡 **Tipp**: Installiere prettier immer als devDependency (`npm install --save-dev prettier`) und nie global -- so stellst du sicher, dass alle im Team exakt dieselbe Version verwenden.

#### 2. **Ganzes Projekt formatieren**
```bash
# Alle JS-Dateien
prettier --write "**/*.js"

# Mehrere Dateitypen
prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"

# Mit Ignore-Pattern
prettier --write "src/**/*.js" --ignore-path .gitignore
```

#### 3. **Check-Modus (ohne zu schreiben)**

Im Check-Modus prueft prettier, ob Dateien korrekt formatiert sind, ohne sie zu aendern -- ideal fuer CI/CD-Pipelines:

```bash
# Prüfen, ob Dateien formatiert sind
prettier --check "src/**/*.js"

# In CI/CD verwenden
prettier --check . || exit 1
```

#### 4. **Config erstellen (.prettierrc)**

Mit einer Konfigurationsdatei im Projektstamm definierst du einheitliche Formatierungsregeln fuer das gesamte Team:

```bash
# Minimal Config
cat > .prettierrc.json << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF
```

#### 5. **Ignore-File erstellen**

Die `.prettierignore`-Datei definiert, welche Dateien und Verzeichnisse von der Formatierung ausgeschlossen werden sollen:

```bash
cat > .prettierignore << 'EOF'
# Dependencies
node_modules
package-lock.json
yarn.lock

# Build outputs
dist
build
.next
out

# Cache
.cache
.parcel-cache

# Logs
*.log
EOF
```

---

### Advanced Usage

Fortgeschrittene Prettier-Techniken fuer automatisierte Workflows, IDE-Integration und programmatische Nutzung.

#### 1. **Pre-commit Hook mit husky + lint-staged**

Pre-commit Hooks stellen sicher, dass nur korrekt formatierter Code committet wird. Die Kombination aus husky und lint-staged formatiert nur die gestaged Dateien:

```bash
# Setup
npm install --save-dev husky lint-staged
npx husky init

# package.json konfigurieren
cat > package.json << 'EOF'
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
EOF

# Husky Hook erstellen
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
EOF
chmod +x .husky/pre-commit
```

#### 2. **VSCode Integration**

Mit der VSCode-Extension wird Code automatisch beim Speichern formatiert:

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": false,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

#### 3. **Erweiterte .prettierrc.json Config**

Eine ausfuehrliche Konfiguration mit allen wichtigen Optionen. Jede Option steuert einen spezifischen Aspekt der Formatierung:

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css",
  "endOfLine": "lf",
  "embeddedLanguageFormatting": "auto"
}
```

> 🚀 **Beispiel**: Mit `prettier --write --cache .` (ab v3) werden nur geaenderte Dateien formatiert, was die Ausfuehrungszeit in grossen Projekten drastisch reduziert.

#### 4. **Per-Language Overrides**

Mit Overrides kannst du fuer verschiedene Dateitypen unterschiedliche Formatierungsregeln definieren:

```json
{
  "semi": true,
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.json",
      "options": {
        "tabWidth": 4
      }
    },
    {
      "files": "*.md",
      "options": {
        "proseWrap": "always",
        "printWidth": 80
      }
    },
    {
      "files": "*.css",
      "options": {
        "singleQuote": false
      }
    }
  ]
}
```

#### 5. **API Usage (Programmatic)**
```javascript
// format.js
const prettier = require('prettier');
const fs = require('fs');

async function formatFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const options = await prettier.resolveConfig(filePath);

  const formatted = await prettier.format(content, {
    ...options,
    filepath: filePath,
  });

  fs.writeFileSync(filePath, formatted);
  console.log(`Formatted: ${filePath}`);
}

formatFile('./src/index.js');
```

#### 6. **Custom Plugin für neue Sprachen**
```javascript
// .prettierrc.js
module.exports = {
  plugins: [
    'prettier-plugin-svelte',
    'prettier-plugin-tailwindcss',
  ],
  pluginSearchDirs: false,
  overrides: [
    {
      files: '*.svelte',
      options: { parser: 'svelte' },
    },
  ],
};
```

---

## 💡 Best Practices

Bewaeaehrte Vorgehensweisen fuer den professionellen Einsatz von Prettier in Teams und CI/CD-Pipelines.

### 1. **Projekt-Setup**

Eine `.editorconfig`-Datei stellt sicher, dass grundlegende Formatierungsregeln auch in Editoren ohne Prettier-Plugin eingehalten werden:

```bash
# .editorconfig für Basis-Settings
cat > .editorconfig << 'EOF'
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx,json}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
EOF
```

### 2. **Team-Onboarding**
```bash
# README.md Documentation
cat >> README.md << 'EOF'
## Code Style

This project uses Prettier for code formatting.

### Setup
```bash
npm install
npm run format        # Format all files
npm run format:check  # Check formatting
```

### Editor Setup
- **VSCode**: Install "Prettier - Code formatter" extension
- **WebStorm**: Enable Prettier in Settings → Languages → Prettier
- **Vim**: Use `:Prettier` command (with plugin)

Pre-commit hooks will auto-format staged files.
EOF
```

> ⚠️ **Warnung**: Pinne die Prettier-Version in deiner package.json exakt (z.B. `"prettier": "3.2.4"` statt `"^3.2.4"`), um unterschiedliche Formatierung zwischen lokaler Entwicklung und CI zu vermeiden.

### 3. **CI/CD Integration**
```yaml
# .github/workflows/prettier.yml
name: Code Style Check

on: [push, pull_request]

jobs:
  prettier:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check formatting
        run: npm run format:check
```

### 4. **Schrittweise Migration (Legacy-Projekte)**

Bei grossen bestehenden Projekten empfiehlt sich ein schrittweises Vorgehen, um die Git-Historie nicht mit einem riesigen Formatting-Commit zu ueberladen:

```bash
# Phase 1: Nur neue Dateien formatieren
prettier --write $(git diff --name-only --diff-filter=A HEAD | grep -E '\.(js|ts)$')

# Phase 2: Pro Verzeichnis
prettier --write src/components/**/*.js
prettier --write src/utils/**/*.js

# Phase 3: Full-Migration mit Commit
git checkout -b prettier-migration
prettier --write "**/*.{js,jsx,ts,tsx}"
git add .
git commit -m "chore: apply prettier formatting"
```

### 5. **Ignore-Patterns optimieren**
```bash
# .prettierignore
# Build outputs
dist/
build/
*.min.js
*.bundle.js

# Generated files
*.generated.js
schema.graphql

# Third-party
vendor/
public/libs/

# Large files
*.sql
*.csv

# Specific problematic files
src/legacy/old-vendor-lib.js
```

---

## 📚 Beispiele

### Beispiel 1: Basic Formatierung
```bash
# Vorher: script.js
const x={a:1,b:2};function foo(){return x;}

# Formatieren
prettier --write script.js

# Nachher:
const x = { a: 1, b: 2 };
function foo() {
  return x;
}
```

### Beispiel 2: React-Komponente formatieren
```bash
# Vorher: Button.jsx
import React from 'react';export default function Button({onClick,children,disabled=false}){return <button onClick={onClick} disabled={disabled} className="btn btn-primary">{children}</button>}

# Formatieren
prettier --write Button.jsx

# Nachher:
import React from "react";

export default function Button({ onClick, children, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn btn-primary">
      {children}
    </button>
  );
}
```

### Beispiel 3: JSON formatieren
```bash
# Vorher: config.json
{"name":"my-app","version":"1.0.0","scripts":{"start":"node index.js","test":"jest"},"dependencies":{"express":"^4.18.0"}}

# Formatieren
prettier --write config.json

# Nachher:
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

### Beispiel 4: Markdown-Dateien formatieren
```bash
# Vorher: README.md (unformatted)
# My Project
This is a long line that exceeds the print width and should be wrapped according to prettier settings but currently isn't.

-Item 1
-Item 2
-   Item 3

# Formatieren mit prose-wrap
prettier --write --prose-wrap always --print-width 80 README.md

# Nachher:
# My Project

This is a long line that exceeds the print width and should be wrapped
according to prettier settings but currently isn't.

- Item 1
- Item 2
- Item 3
```

### Beispiel 5: Git-Integration (nur geänderte Dateien)
```bash
# Nur staged Dateien formatieren
git diff --cached --name-only --diff-filter=ACM | \
  grep -E '\.(js|jsx|ts|tsx|json|css|md)$' | \
  xargs prettier --write

# Dateien re-stagen
git add -u
```

### Beispiel 6: CSS/SCSS formatieren
```bash
# Vorher: styles.css
.btn{background-color:#007bff;color:#fff;padding:10px 20px;border:none;border-radius:4px;}
.btn:hover{background-color:#0056b3;}

# Formatieren
prettier --write styles.css

# Nachher:
.btn {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.btn:hover {
  background-color: #0056b3;
}
```

### Beispiel 7: TypeScript mit komplexen Types
```bash
# Vorher: types.ts
type User={id:number;name:string;email:string;roles:Array<'admin'|'user'|'guest'>;metadata:{createdAt:Date;updatedAt:Date;lastLogin?:Date}}

# Formatieren
prettier --write types.ts

# Nachher:
type User = {
  id: number;
  name: string;
  email: string;
  roles: Array<"admin" | "user" | "guest">;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
  };
};
```

### Beispiel 8: Multi-File Batch Processing
```bash
# Alle JS-Dateien im Projekt
find . -name "*.js" -not -path "./node_modules/*" | \
  xargs prettier --write

# Mit Fortschrittsanzeige
find . -name "*.js" -not -path "./node_modules/*" | \
  while read file; do
    prettier --write "$file" && echo "✓ $file"
  done
```

### Beispiel 9: Pre-commit Hook (manuell)
```bash
# .git/hooks/pre-commit
#!/bin/bash

# Get staged JS files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$')

if [ -n "$STAGED_FILES" ]; then
  echo "Running Prettier on staged files..."

  # Format files
  echo "$STAGED_FILES" | xargs prettier --write

  # Check if formatting changed files
  if ! git diff --quiet; then
    echo "❌ Prettier made changes. Please review and re-stage."
    git diff --name-only
    exit 1
  fi

  echo "✓ All files properly formatted"
fi
```

> 💡 **Tipp**: Prettier ist ein reiner Formatter und kein Linter. Kombiniere ihn immer mit ESLint (Lektion 21) und nutze `eslint-config-prettier`, um Konflikte zwischen beiden Tools zu vermeiden.

### Beispiel 10: Watch-Mode für Development
```bash
# Mit entr (aus Lektion 19)
fd -e js -e jsx -e ts -e tsx src/ | entr -c prettier --write /_

# Mit nodemon
nodemon --watch src/ --ext js,jsx,ts,tsx --exec 'prettier --write src/**/*.{js,jsx,ts,tsx}'

# Mit chokidar-cli
npm install -g chokidar-cli
chokidar "src/**/*.js" -c "prettier --write {path}"
```

### Beispiel 11: Prettier in package.json Scripts
```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "format:staged": "lint-staged",
    "format:js": "prettier --write '**/*.{js,jsx}'",
    "format:css": "prettier --write '**/*.{css,scss}'",
    "format:md": "prettier --write '**/*.md'"
  }
}
```

### Beispiel 12: Integration mit ESLint
```bash
# Install Prettier + ESLint Integration
npm install --save-dev eslint-config-prettier eslint-plugin-prettier

# .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
EOF

# Beide zusammen ausführen
eslint --fix src/**/*.js && prettier --write src/**/*.js
```

---

## 🔧 Integration in Claude Code Workflows

### 1. **AI-unterstützte Format-Analyse**
```bash
# Prettier-Report generieren mit Claude-Analyse
prettier --check src/ 2>&1 | tee format-report.txt
cat format-report.txt | claude "Analyze these formatting issues and suggest fixes"

# Komplexe Config-Optimierung
cat .prettierrc.json | claude "Review this prettier config for best practices"
```

### 2. **Automatisches Refactoring mit prettier**
```bash
# Workflow: Code umstrukturieren → prettifyen → committen
cat > refactor-and-format.sh << 'EOF'
#!/bin/bash
echo "📝 Refactoring code..."
# Dein Refactoring-Logik (z.B. mit Claude)

echo "🎨 Running Prettier..."
prettier --write src/

echo "✅ Committing changes..."
git add -A
git commit -m "refactor: automated refactoring + prettier formatting"
EOF
chmod +x refactor-and-format.sh
```

### 3. **Code-Review mit Prettier-Check**
```bash
# Pre-Review Formatierungs-Check
git diff main...HEAD --name-only | \
  grep -E '\.(js|jsx|ts|tsx)$' | \
  xargs prettier --check || {
    echo "⚠️  Some files are not formatted. Running prettier..."
    git diff main...HEAD --name-only | \
      grep -E '\.(js|jsx|ts|tsx)$' | \
      xargs prettier --write
  }
```

### 4. **Prettier + AI Code Generation**
```bash
# Workflow: AI generiert Code → Prettier formatiert
generate_and_format() {
  local prompt="$1"
  local output="$2"

  echo "$prompt" | claude "Generate TypeScript code" > "$output"
  prettier --write "$output"
  echo "✓ Generated and formatted: $output"
}

generate_and_format "Create a React form component" src/components/Form.tsx
```

---

## 🤖 Claude Code Integration

### Workflow 1: Claude Code Output formatieren
```bash
npx prettier --write "src/**/*.{ts,tsx,js,jsx}"
```

### Workflow 2: Nur geaenderte Files formatieren
```bash
git diff --name-only | xargs npx prettier --write
```

### Workflow 3: Format-Check in CI
```bash
npx prettier --check "src/**/*.{ts,tsx}"
```

> 💡 **Tipp**: Konfiguriere prettier als Git-Hook, damit Claude Code generierter Code automatisch formatiert wird.

---

## 🐛 Troubleshooting

Loesungen fuer die haeufigsten Probleme beim Einsatz von prettier.

### Problem 1: "No parser could be inferred"

**Ursache**: Prettier erkennt den Dateityp anhand der Dateiendung. Ohne Endung oder bei unbekannten Endungen kann kein passender Parser zugeordnet werden.

```bash
# Fehler
Error: No parser could be inferred for file: unknown-file

# Lösung 1: Parser explizit angeben
prettier --write unknown-file --parser babel

# Lösung 2: Dateiendung hinzufügen
mv unknown-file unknown-file.js
prettier --write unknown-file.js
```

### Problem 2: Prettier überschreibt ESLint-Regeln

**Ursache**: Prettier und ESLint haben ueberlappende Regeln fuer Code-Stil. Ohne `eslint-config-prettier` koennen sie sich gegenseitig widersprechen.

```bash
# Problem: Konflikt zwischen ESLint und Prettier
# Lösung: eslint-config-prettier installieren
npm install --save-dev eslint-config-prettier

# .eslintrc.json anpassen (prettier MUSS LETZTES sein!)
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier"  // ← MUSS am Ende stehen!
  ]
}
```

### Problem 3: Prettier ignoriert .prettierignore

**Ursache**: Die `.prettierignore`-Datei muss im selben Verzeichnis liegen, aus dem prettier aufgerufen wird. Bei Aufruf aus einem Unterverzeichnis wird sie nicht gefunden.

```bash
# Debug: Prüfen welche Dateien prettier sieht
prettier --debug-check src/

# Sicherstellen dass .prettierignore gelesen wird
prettier --ignore-path .prettierignore --write .

# Alternative: .gitignore verwenden
prettier --write . --ignore-path .gitignore
```

### Problem 4: Slow Performance bei großen Projekten

**Ursache**: Prettier parst jede Datei komplett, was bei tausenden Dateien Zeit kostet. Der Cache (ab v3) und gezielte Dateiauswahl beschleunigen den Prozess erheblich.

```bash
# Problem: prettier dauert zu lange
# Lösung 1: Nur geänderte Dateien formatieren (mit Git)
git diff --name-only --diff-filter=ACM | \
  grep -E '\.(js|jsx|ts|tsx)$' | \
  xargs prettier --write

# Lösung 2: Parallele Verarbeitung (GNU Parallel)
find src -name "*.js" | parallel -j 8 prettier --write {}

# Lösung 3: Cache nutzen (Prettier v3+)
prettier --write --cache src/
```

### Problem 5: Editor formatiert nicht automatisch

**Ursache**: Die VSCode-Extension muss als Standard-Formatter konfiguriert sein, und `formatOnSave` muss aktiviert werden.

```bash
# VSCode: Extension neu installieren
code --uninstall-extension esbenp.prettier-vscode
code --install-extension esbenp.prettier-vscode

# Settings prüfen (.vscode/settings.json)
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}

# Prettier-Binary prüfen
npx prettier --version
```

### Problem 6: Different Formatting in CI vs. Local

**Ursache**: Unterschiedliche Prettier-Versionen zwischen lokaler Entwicklung und CI koennen zu abweichender Formatierung fuehren. Eine ungepinnte Version (`^3.2.4`) laedt moeglicherweise verschiedene Patch-Versionen.

```bash
# Problem: Unterschiedliche Prettier-Versionen
# Lösung: Version pinnen in package.json
{
  "devDependencies": {
    "prettier": "3.2.4"  // ← Exakte Version, nicht ^3.2.4
  }
}

# Lock-File committen
git add package-lock.json
git commit -m "chore: pin prettier version"
```

---

## 📊 Vergleich: prettier vs. Alternativen

| Feature | **prettier** | ESLint (--fix) | Biome | dprint |
|---------|-------------|----------------|-------|--------|
| **Geschwindigkeit** | Mittel | Langsam | ⚡ Sehr schnell (Rust) | ⚡ Sehr schnell (Rust) |
| **Opinionated** | ✅ Sehr | ⚠️ Konfigurierbar | ✅ Sehr | ⚠️ Konfigurierbar |
| **Multi-Language** | ✅ 10+ Sprachen | ❌ Nur JS/TS | ⚠️ JS/TS/JSON | ✅ 10+ Sprachen |
| **Zero-Config** | ✅ Ja | ❌ Nein | ✅ Ja | ⚠️ Partial |
| **Plugin-System** | ✅ Ja | ✅ Ja | ❌ Nein | ✅ Ja |
| **Editor-Support** | ✅ Alle | ✅ Alle | ⚠️ Wenige | ⚠️ Wenige |
| **Adoption** | 🏆 Sehr hoch | Hoch | Neu | Niedrig |
| **Config-Komplexität** | 🟢 Niedrig | 🔴 Hoch | 🟢 Niedrig | 🟡 Mittel |
| **Linting** | ❌ Nein | ✅ Ja | ✅ Ja | ❌ Nein |

### Wann welches Tool?

**Verwende prettier wenn:**
- ✅ Du einen etablierten, bewährten Formatter willst
- ✅ Zero-Config/Opinionated Ansatz bevorzugt wird
- ✅ Maximale Editor/Plugin-Unterstützung benötigt wird
- ✅ Multi-Language-Support wichtig ist (CSS, HTML, Markdown)

**Verwende Biome wenn:**
- ✅ Performance kritisch ist (große Monorepos)
- ✅ Du Formatter + Linter kombinieren willst
- ✅ Nur JS/TS/JSON Fokus
- ⚠️ Neuere, weniger etablierte Tools OK sind

**Verwende ESLint --fix wenn:**
- ✅ Du bereits ESLint für Linting nutzt
- ✅ Sehr spezifische Style-Rules benötigt werden
- ⚠️ Langsamere Performance akzeptabel ist

**Verwende dprint wenn:**
- ✅ Extreme Performance benötigt wird
- ✅ Konfigurierbarkeit wichtig ist
- ⚠️ Community/Plugin-Support weniger wichtig ist

---

## 🔗 Weiterführende Links

### Offizielle Ressourcen:
- **Prettier Docs**: https://prettier.io/docs/en/
- **Playground**: https://prettier.io/playground/
- **GitHub**: https://github.com/prettier/prettier
- **Config Options**: https://prettier.io/docs/en/options.html

### Plugins & Extensions:
- **VSCode Extension**: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
- **Plugin-Svelte**: https://github.com/sveltejs/prettier-plugin-svelte
- **Plugin-Tailwind**: https://github.com/tailwindlabs/prettier-plugin-tailwindcss
- **Plugin-Pug**: https://github.com/prettier/plugin-pug

### Tools & Integrations:
- **lint-staged**: https://github.com/okonet/lint-staged
- **husky**: https://github.com/typicode/husky
- **eslint-config-prettier**: https://github.com/prettier/eslint-config-prettier
- **prettier-eslint**: https://github.com/prettier/prettier-eslint

### Guides & Best Practices:
- **Why Prettier?**: https://prettier.io/docs/en/why-prettier.html
- **Integrating with Linters**: https://prettier.io/docs/en/integrating-with-linters.html
- **Pre-commit Hook**: https://prettier.io/docs/en/precommit.html

---

## 💎 Pro-Tipps

### Tipp 1: Shared Config über npm
```bash
# Eigenes Prettier-Config-Package erstellen
mkdir prettier-config-company
cd prettier-config-company

cat > package.json << 'EOF'
{
  "name": "@company/prettier-config",
  "version": "1.0.0",
  "main": "index.json"
}
EOF

cat > index.json << 'EOF'
{
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5"
}
EOF

npm publish

# In Projekten verwenden
npm install --save-dev @company/prettier-config

# package.json
{
  "prettier": "@company/prettier-config"
}
```

### Tipp 2: Range-Formatting (nur Selektion)
```bash
# Nur Zeilen 10-20 formatieren (nützlich für große Dateien)
prettier --write script.js --range-start 200 --range-end 500

# In VSCode: Text selektieren → Shift+Alt+F
```

### Tipp 3: Prettier als Git-Diff-Filter
```bash
# .git/config
[diff "prettier"]
  textconv = prettier --stdin-filepath

# .gitattributes
*.js diff=prettier
*.jsx diff=prettier

# Git diff zeigt jetzt formatierte Diffs
git diff
```

### Tipp 4: Prettier + Renovate für Auto-Updates
```json
// renovate.json
{
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchPackageNames": ["prettier"],
      "automerge": true,
      "groupName": "prettier",
      "postUpgradeTasks": {
        "commands": ["npm run format:check"],
        "fileFilters": ["**"]
      }
    }
  ]
}
```

### Tipp 5: Debugging mit --loglevel
```bash
# Detaillierte Logs für Troubleshooting
prettier --write src/ --loglevel debug

# Nur Warnings anzeigen
prettier --check . --loglevel warn
```

---

## 📝 Zusammenfassung

**prettier** ist der de-facto Standard für Code-Formatierung im JavaScript/TypeScript-Ökosystem:

### ✅ Hauptvorteile:
- **Zero-Config**: Funktioniert sofort ohne Setup
- **Opinionated**: Keine Style-Diskussionen mehr im Team
- **Multi-Language**: JS, TS, CSS, HTML, JSON, Markdown, YAML
- **Editor-Integration**: Plugins für alle gängigen Editoren
- **Git-Friendly**: Reduziert Merge-Konflikte durch konsistenten Stil

### 🎯 Kern-Use-Cases:
1. **Team-Konsistenz**: Einheitlicher Code-Stil automatisch durchsetzen
2. **Pre-commit Hooks**: Nur formatierte Dateien committen
3. **CI/CD**: Formatierungs-Checks in Pipelines
4. **Legacy-Migration**: Alte Codebases schnell aufräumen
5. **Multi-Projekt**: Gleicher Stil über alle Projekte

### 🚀 Wichtigste Befehle:
```bash
prettier --write .                    # Alles formatieren
prettier --check .                    # Nur prüfen (CI)
prettier --write "**/*.{js,json}"    # Spezifische Dateitypen
npx prettier --write . --cache        # Mit Cache (v3+)
```

### 💡 Best Practice:
```bash
# 1. Pre-commit Hook aufsetzen
npx husky init
npm install -D lint-staged

# 2. package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,md}": "prettier --write"
  }
}

# 3. Editor on-save aktivieren
# 4. CI/CD Check hinzufügen
```

### ⚠️ Wichtig:
- Prettier ist **formatter**, kein **linter** (keine Code-Qualität-Checks)
- Kombiniere mit ESLint für vollständige Code-Qualität
- Installiere `eslint-config-prettier` um Konflikte zu vermeiden
- Nutze `.prettierignore` für generated/vendor Code

### 🔗 Integration:
Perfekt kombinierbar mit **ESLint** (Lektion 21), **Git-Hooks** (husky), **VSCode**, **CI/CD-Pipelines**, und natürlich **Claude Code** für AI-gestützte Format-Analyse.

**Nächste Lektion**: [21-eslint.md](./21-eslint.md) - JavaScript/TypeScript Linting für Code-Qualität

---

**🎓 Claude Code Masterkurs** | © 2026 | [Zurück zur Übersicht](../README.md)
