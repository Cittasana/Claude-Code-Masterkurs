# Lektion 21: eslint - Pluggable JavaScript & TypeScript Linter

## 📋 Metadata
- **Kategorie**: Fortgeschrittene Tools
- **Schwierigkeit**: Mittel bis Fortgeschritten
- **Voraussetzungen**: Lektion 01-04 (Grundlagen), Lektion 20 (prettier), Node.js Kenntnisse
- **Lernzeit**: 60-90 Minuten
- **Zielgruppe**: JavaScript/TypeScript Entwickler, die Code-Qualität sicherstellen möchten

---

> 🚀 **Claude Code Relevanz**: ESLint prueft von Claude Code generierten JavaScript/TypeScript-Code automatisch auf Bugs, Security-Luecken und Best-Practice-Verstoesse -- ein unverzichtbarer Qualitaetsfilter im AI-Workflow.

## 🎯 Berechtigung: Warum eslint?

### Problem ohne eslint:
```javascript
// Potenzielle Bugs und Code-Smell
var x = 10;  // 'var' statt 'const'
if (x = 11) { console.log("Bug!"); }  // Assignment statt Vergleich
function unused() {}  // Ungenutzte Funktion
const arr = [1,,3];  // Sparse Array

function getData() {
  const result = fetch('/api');  // Fehlendes 'await'
  return result;
}

// Keine Warnung bei fehlenden Error-Handlings
try {
  JSON.parse(data);
} catch(e) {}  // Leerer Catch-Block
```

### Lösung mit eslint:
```bash
$ eslint script.js

/path/to/script.js
  1:1   warning  Unexpected var, use let or const instead  no-var
  2:5   error    Expected a conditional expression, not assignment  no-cond-assign
  3:10  warning  'unused' is defined but never used  no-unused-vars
  4:16  error    Unexpected comma in middle of array  no-sparse-arrays
  7:18  error    Missing await in async context  require-await
  12:12 error    Empty block statement  no-empty

✖ 6 problems (4 errors, 2 warnings)
  2 errors and 1 warning potentially fixable with the `--fix` option.
```

### Kernvorteile:
✅ **Bug-Prevention**: Erkennt häufige Fehlerquellen früh
✅ **Code-Qualität**: Erzwingt Best Practices und Patterns
✅ **Auto-Fix**: 70%+ der Probleme automatisch behebbar
✅ **Pluggable**: Erweiterbar mit Custom Rules + Plugins
✅ **Framework-Support**: React, Vue, Angular, TypeScript
✅ **CI/CD-Ready**: Blockiert fehlerhafte Commits

---

## 🎯 Zwecke: Wofür wird eslint verwendet?

### 1. **Static Code Analysis**
- Syntax-Fehler finden vor Runtime
- Logische Fehler erkennen (z.B. unreachable code)
- Type-Safety (mit @typescript-eslint)

### 2. **Code-Style Enforcement**
- Konsistente Coding-Standards im Team
- Naming-Conventions durchsetzen
- Import-Order regulieren

### 3. **Security Auditing**
- Unsichere Patterns erkennen (eval, innerHTML)
- XSS-Vulnerabilities aufdecken
- Dependency-Vulnerabilities warnen

### 4. **Framework-spezifische Best Practices**
- React Hooks Rules
- Vue Reactivity Patterns
- Angular Dependency Injection

### 5. **Migration & Refactoring**
- Veraltete APIs finden
- Legacy-Code modernisieren
- Breaking Changes früh erkennen

---

## 🚀 Verwendung

Dieser Abschnitt fuehrt dich durch Installation, Konfiguration und praktische Nutzung von ESLint -- vom ersten Setup bis zur Framework-spezifischen Integration.

### Installation

ESLint wird ueber npm installiert. Die projektlokale Installation ist empfohlen, damit jedes Projekt seine eigene Version und Konfiguration haben kann.

#### macOS (mit npm):

Installiere ESLint zusammen mit den benoetigten Plugins fuer dein Projekt:

```bash
# Projekt-lokal (empfohlen)
npm install --save-dev eslint

# Mit TypeScript Support
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Mit React Support
npm install --save-dev eslint eslint-plugin-react eslint-plugin-react-hooks

# Alle zusammen
npm install --save-dev \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-config-prettier
```

#### Ubuntu/Debian:
```bash
# Node.js/npm installieren (falls nicht vorhanden)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# ESLint installieren
npm install --save-dev eslint
```

#### Arch Linux:
```bash
# Via npm (empfohlen)
npm install --save-dev eslint

# Oder global (AUR)
yay -S eslint
```

---

### Quick Start: Erste Schritte

Der schnellste Weg zu einem funktionierenden ESLint-Setup fuehrt ueber den interaktiven Wizard.

#### 1. **ESLint initialisieren (interaktiv)**

Der Init-Wizard fragt nach deinem Projekttyp und erstellt automatisch die passende Konfiguration:

```bash
# ESLint Config Wizard
npx eslint --init

# Fragen:
# ✔ How would you like to use ESLint? › To check syntax, find problems, and enforce code style
# ✔ What type of modules does your project use? › JavaScript modules (import/export)
# ✔ Which framework does your project use? › React
# ✔ Does your project use TypeScript? › Yes
# ✔ Where does your code run? › Browser, Node
# ✔ How would you like to define a style for your project? › Use a popular style guide
# ✔ Which style guide do you want to follow? › Airbnb
# ✔ What format do you want your config file to be in? › JavaScript
```

#### 2. **Einzelne Datei prüfen**
```bash
# Datei linten
eslint script.js

# Mit Auto-Fix
eslint --fix script.js

# Mehrere Dateien
eslint src/*.js
```

#### 3. **Ganzes Projekt linten**
```bash
# Alle JS/TS Dateien
eslint "src/**/*.{js,jsx,ts,tsx}"

# Mit Cache (schneller bei wiederholten Runs)
eslint --cache "src/**/*.{js,jsx,ts,tsx}"

# Nur Fehler, keine Warnings
eslint --quiet src/
```

> 💡 **Tipp**: Aktiviere den Cache mit `eslint --cache`, um wiederholte Laeufe drastisch zu beschleunigen. In grossen Projekten kann das die Laufzeit von 30+ Sekunden auf unter 2 Sekunden reduzieren.

#### 4. **Basis-Config erstellen (.eslintrc.json)**
```bash
cat > .eslintrc.json << 'EOF'
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off",
    "prefer-const": "warn"
  }
}
EOF
```

#### 5. **ESLint Ignore-File**
```bash
cat > .eslintignore << 'EOF'
# Dependencies
node_modules/
package-lock.json

# Build outputs
dist/
build/
*.min.js
*.bundle.js

# Generated
coverage/
.next/
out/

# Config
*.config.js
EOF
```

---

### Advanced Usage

Fortgeschrittene ESLint-Konfigurationen fuer TypeScript, React, Custom Rules und das neue Flat Config Format.

#### 1. **TypeScript-Projekt Setup**

Fuer TypeScript-Projekte wird ein spezieller Parser benoetigt, der die TypeScript-Syntax versteht und typenbasierte Rules ermoeglicht:

```json
// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-floating-promises": "error"
  }
}
```

#### 2. **React-Projekt mit Hooks**

React-Projekte profitieren von speziellen Plugins, die Hook-Regeln und Accessibility-Checks erzwingen:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "plugins": ["react", "react-hooks", "jsx-a11y"],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

#### 3. **Custom Rule erstellen**

Fuer projektspezifische Anforderungen kannst du eigene ESLint-Rules entwickeln. Diese Rule verbietet direkte DOM-Manipulation in React-Komponenten:

```javascript
// eslint-plugin-custom/rules/no-direct-dom.js
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow direct DOM manipulation",
      category: "Best Practices",
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        const methods = ['getElementById', 'querySelector', 'querySelectorAll'];
        if (
          node.callee.object &&
          node.callee.object.name === 'document' &&
          methods.includes(node.callee.property.name)
        ) {
          context.report({
            node,
            message: "Avoid direct DOM manipulation. Use ref or state instead.",
          });
        }
      },
    };
  },
};

// .eslintrc.json
{
  "plugins": ["./eslint-plugin-custom"],
  "rules": {
    "custom/no-direct-dom": "error"
  }
}
```

#### 4. **Multi-Environment Config**
```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended'],

  // Override für Tests
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true,
      },
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    // Override für Node-Scripts
    {
      files: ['scripts/**/*.js'],
      env: {
        node: true,
      },
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
```

> ⚠️ **Warnung**: Ab ESLint v9 ist das neue Flat Config Format (eslint.config.js) Standard. Die alte .eslintrc-Konfiguration wird in v10 komplett entfernt. Migriere fruehzeitig, um Kompatibilitaetsprobleme zu vermeiden.

#### 5. **Flat Config (ESLint v9+)**

Das neue Flat Config Format ersetzt die verschachtelte .eslintrc-Konfiguration durch ein einfacheres, JavaScript-basiertes System:

```javascript
// eslint.config.js (neuer Flat Config)
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
```

> 🚀 **Beispiel**: Nutze `TIMING=1 eslint src/` um herauszufinden, welche Rules am meisten Zeit benoetigen. So kannst du gezielt langsame Rules deaktivieren oder durch schnellere Alternativen ersetzen.

#### 6. **ESLint mit Prettier kombinieren**
```bash
# Prettier-Integration installieren
npm install --save-dev eslint-config-prettier eslint-plugin-prettier

# .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"  // ← MUSS am Ende stehen!
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

---

## 💡 Best Practices

Bewaeaehrte Strategien fuer den effektiven Einsatz von ESLint in Projekten unterschiedlicher Groesse.

### 1. **Strict Config für neue Projekte**

Bei neuen Projekten kannst du von Anfang an strenge Regeln setzen. Die folgenden Rules erzwingen moderne JavaScript-Patterns und begrenzen die Code-Komplexitaet:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict"
  ],
  "rules": {
    "no-var": "error",
    "prefer-const": "error",
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "max-lines-per-function": ["warn", { "max": 50 }],
    "complexity": ["warn", 10]
  }
}
```

> 💡 **Tipp**: Bei der Kombination mit Prettier muss `"prettier"` immer als letztes Element in der `extends`-Liste stehen, da es alle Style-Rules der vorherigen Konfigurationen deaktiviert.

### 2. **Security-focused Config**

Das Security-Plugin erkennt potenzielle Sicherheitsluecken wie eval()-Aufrufe, unsichere regulaere Ausdruecke und Object-Injection-Angriffsvektoren:

```bash
# Security Plugin installieren
npm install --save-dev eslint-plugin-security

# .eslintrc.json
{
  "plugins": ["security"],
  "extends": ["plugin:security/recommended"],
  "rules": {
    "security/detect-eval-with-expression": "error",
    "security/detect-non-literal-regexp": "warn",
    "security/detect-unsafe-regex": "error",
    "security/detect-object-injection": "warn"
  }
}
```

### 3. **Pre-commit Hook Integration**

Pre-commit Hooks verhindern, dass fehlerhafter Code ueberhaupt committet wird. In Kombination mit lint-staged werden nur die geaenderten Dateien geprueft:

```bash
# Husky + lint-staged Setup
npm install --save-dev husky lint-staged
npx husky init

# package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}

# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### 4. **CI/CD Integration**
```yaml
# .github/workflows/lint.yml
name: ESLint

on: [push, pull_request]

jobs:
  lint:
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

      - name: Run ESLint
        run: npm run lint

      - name: Annotate code linting results
        uses: ataylorme/eslint-annotate-action@v2
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
          report-json: "eslint_report.json"
```

### 5. **Monorepo mit mehreren Configs**
```javascript
// root .eslintrc.js
module.exports = {
  root: true,
  extends: ['./packages/eslint-config-base'],
};

// packages/web/.eslintrc.js
module.exports = {
  extends: ['../../.eslintrc.js', 'plugin:react/recommended'],
  env: {
    browser: true,
  },
};

// packages/api/.eslintrc.js
module.exports = {
  extends: ['../../.eslintrc.js'],
  env: {
    node: true,
  },
  rules: {
    'no-console': 'off',
  },
};
```

---

## 📚 Beispiele

### Beispiel 1: Bugs früh erkennen
```javascript
// Vorher: script.js (bugs versteckt)
function calculate(x, y) {
  if (x = 10) {  // Assignment statt Vergleich!
    return x + y;
  }
  return x * y;
}

const result = calculate(5, 3);

// ESLint
$ eslint script.js
2:7  error  Expected a conditional expression, not assignment  no-cond-assign

// Nachher: Fixed
function calculate(x, y) {
  if (x === 10) {  // ✓ Korrekter Vergleich
    return x + y;
  }
  return x * y;
}
```

### Beispiel 2: React Hooks Rules
```javascript
// Vorher: Component.jsx (Hook-Fehler)
function UserProfile({ userId }) {
  if (!userId) {
    return null;
  }

  // ❌ Hooks dürfen nicht conditional sein!
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  });  // ❌ Fehlende Dependencies!

  return <div>{user?.name}</div>;
}

// ESLint
$ eslint Component.jsx
7:9   error  React Hook "useState" is called conditionally  react-hooks/rules-of-hooks
12:5  warn   React Hook useEffect has a missing dependency  react-hooks/exhaustive-deps

// Nachher: Fixed
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);  // ✓ Dependencies hinzugefügt

  if (!userId) return null;
  return <div>{user?.name}</div>;
}
```

### Beispiel 3: TypeScript Type-Safety
```typescript
// Vorher: api.ts (Type-Issues)
async function fetchData(id: number) {
  const response = await fetch(`/api/data/${id}`);
  const data = response.json();  // ❌ Fehlendes 'await'
  return data;
}

function process(value: any) {  // ❌ 'any' Type
  return value.toUpperCase();  // ❌ Potentieller Runtime-Error
}

// ESLint (@typescript-eslint)
$ eslint api.ts
3:16  error  Promises must be awaited  @typescript-eslint/no-floating-promises
6:20  warn   Unexpected any  @typescript-eslint/no-explicit-any
7:17  error  Unsafe member access  @typescript-eslint/no-unsafe-member-access

// Nachher: Fixed
async function fetchData(id: number): Promise<unknown> {
  const response = await fetch(`/api/data/${id}`);
  const data = await response.json();  // ✓ Await hinzugefügt
  return data;
}

function process(value: string): string {  // ✓ Expliziter Type
  if (typeof value !== 'string') {
    throw new Error('Expected string');
  }
  return value.toUpperCase();
}
```

### Beispiel 4: Security-Vulnerabilities finden
```javascript
// Vorher: unsafe.js
function renderHTML(userInput) {
  document.getElementById('output').innerHTML = userInput;  // ❌ XSS!
}

function evaluateCode(code) {
  eval(code);  // ❌ Code Injection!
}

const apiKey = 'sk-1234567890abcdef';  // ❌ Hardcoded Secret

// ESLint (mit security plugin)
$ eslint unsafe.js
2:47  error  Unsafe assignment to innerHTML  security/detect-non-literal-innerHTML
6:3   error  eval can be harmful  no-eval
9:7   warn   Possible hardcoded secret  security/detect-possible-secrets

// Nachher: Fixed
function renderHTML(userInput) {
  const sanitized = DOMPurify.sanitize(userInput);  // ✓ Sanitized
  document.getElementById('output').textContent = sanitized;
}

function evaluateCode(code) {
  // Use Function() with validation or AST parsing
  // eval() entfernt
}

const apiKey = process.env.API_KEY;  // ✓ Aus Environment
```

### Beispiel 5: Import-Order durchsetzen
```javascript
// Vorher: messy-imports.js
import { Button } from './components/Button';
import React from 'react';
import fs from 'fs';
import _ from 'lodash';
import './styles.css';

// ESLint (mit eslint-plugin-import)
$ eslint messy-imports.js
1:1  error  'react' import should occur before './components/Button'  import/order

// Nachher: Fixed (auto-fixable)
// 1. Node builtins
import fs from 'fs';
// 2. External packages
import React from 'react';
import _ from 'lodash';
// 3. Internal modules
import { Button } from './components/Button';
// 4. Styles
import './styles.css';
```

### Beispiel 6: Accessibility (a11y) Checks
```jsx
// Vorher: Form.jsx
function LoginForm() {
  return (
    <div>
      <input type="text" placeholder="Username" />  {/* ❌ Fehlendes Label */}
      <img src="logo.png" />  {/* ❌ Fehlendes alt */}
      <div onClick={handleClick}>Click me</div>  {/* ❌ Kein button */}
    </div>
  );
}

// ESLint (mit jsx-a11y)
$ eslint Form.jsx
4:7   error  Form elements must have labels  jsx-a11y/label-has-associated-control
5:7   error  img elements must have alt prop  jsx-a11y/alt-text
6:7   warn   Visible, non-interactive elements should not have click handlers  jsx-a11y/click-events-have-key-events

// Nachher: Fixed
function LoginForm() {
  return (
    <div>
      <label htmlFor="username">Username</label>
      <input id="username" type="text" />

      <img src="logo.png" alt="Company Logo" />

      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
```

### Beispiel 7: Code-Complexity Warnung
```javascript
// Vorher: complex.js
function processOrder(order) {
  if (order.type === 'premium') {
    if (order.amount > 100) {
      if (order.customer.vip) {
        if (order.shipping === 'express') {
          // ... deep nesting (Cyclomatic Complexity: 8)
        }
      }
    }
  }
}

// ESLint
$ eslint complex.js
1:10  warn  Function 'processOrder' has complexity 8  complexity

// Nachher: Refactored
function processOrder(order) {
  const isPremium = order.type === 'premium';
  const isHighValue = order.amount > 100;
  const isVIP = order.customer.vip;
  const isExpress = order.shipping === 'express';

  if (isPremium && isHighValue && isVIP && isExpress) {
    // ... (Complexity: 2)
  }
}
```

### Beispiel 8: Async/Await Best Practices
```javascript
// Vorher: async-bugs.js
async function getData() {
  try {
    const response = fetch('/api/data');  // ❌ Fehlendes await
    return response.json();  // ❌ Fehlendes await
  } catch (error) {
    console.log(error);  // ❌ Error nicht gehandled
  }
}

// ESLint
$ eslint async-bugs.js
3:20  error  Promise not awaited  @typescript-eslint/no-floating-promises
4:12  error  Promise not awaited  @typescript-eslint/no-floating-promises

// Nachher: Fixed
async function getData(): Promise<Data> {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;  // ✓ Re-throw für Caller
  }
}
```

### Beispiel 9: Batch-Fixing mit --fix
```bash
# Alle Dateien automatisch fixen
eslint --fix "src/**/*.{js,jsx,ts,tsx}"

# Nur bestimmte Rules fixen
eslint --fix --fix-type problem,suggestion src/

# Report generieren
eslint -f json -o eslint-report.json src/

# HTML-Report für bessere Lesbarkeit
eslint -f html -o report.html src/
```

### Beispiel 10: ESLint + Jest Integration
```javascript
// .eslintrc.json
{
  "overrides": [
    {
      "files": ["**/*.test.js", "**/*.spec.js"],
      "extends": ["plugin:jest/recommended"],
      "plugins": ["jest"],
      "env": {
        "jest/globals": true
      },
      "rules": {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error"
      }
    }
  ]
}

// Test mit ESLint-Check
$ eslint src/**/*.test.js
tests/user.test.js
  12:3  error  Focused tests are not allowed  jest/no-focused-tests
  18:5  warn   Use toHaveLength() matcher  jest/prefer-to-have-length
```

---

## 🔧 Integration in Claude Code Workflows

### 1. **AI-gestützte ESLint-Config-Optimierung**
```bash
# ESLint-Report generieren und von Claude analysieren lassen
eslint src/ -f json > eslint-report.json
cat eslint-report.json | claude "Analyze eslint violations and suggest config improvements"

# Custom Rule mit Claude entwickeln
cat > rule-prompt.txt << 'EOF'
Create an ESLint rule that:
- Detects usage of deprecated API functions
- Suggests modern alternatives
- Is auto-fixable where possible
EOF
cat rule-prompt.txt | claude "Generate ESLint custom rule code"
```

### 2. **Automatisches Refactoring mit ESLint + Claude**
```bash
# Workflow: ESLint findet Issues → Claude schlägt Fixes vor
cat > auto-refactor.sh << 'EOF'
#!/bin/bash
# ESLint-Report erstellen
eslint src/ -f json > report.json

# Claude analysiert und schlägt Fixes vor
cat report.json | claude "Analyze these ESLint violations and generate fix suggestions with code examples" > fixes.md

# Developer reviewed fixes manuell
cat fixes.md
EOF
chmod +x auto-refactor.sh
```

### 3. **Code-Review mit ESLint-Annotations**
```bash
# Pre-Review ESLint-Check
git diff main...HEAD --name-only | \
  grep -E '\.(js|jsx|ts|tsx)$' | \
  xargs eslint --format codeframe

# Mit Claude für Kontext-Analysis
git diff main...HEAD | \
  claude "Review this diff and identify potential issues beyond ESLint"
```

### 4. **Migration Assistant**
```bash
# ESLint findet veraltete Patterns
eslint --rule 'no-deprecated-api: error' src/

# Claude generiert Migration-Guide
eslint src/ -f json | \
  claude "Generate migration guide for these deprecated API usages"
```

---

## 🤖 Claude Code Integration

### Workflow 1: Claude Code Output pruefen
```bash
npx eslint src/ --ext .ts,.tsx --fix
```

### Workflow 2: Nur geaenderte Files linten
```bash
git diff --name-only --diff-filter=ACMR | grep -E '\.(ts|tsx)$' | xargs npx eslint
```

### Workflow 3: Spezifische Regeln checken
```bash
npx eslint src/ --rule '{"no-unused-vars": "error"}' --no-eslintrc
```

> 💡 **Tipp**: Nutze ESLint als Qualitaets-Gate nach Claude Code Sessions um sicherzustellen, dass der generierte Code deinen Standards entspricht.

---

## 🐛 Troubleshooting

Loesungen fuer die haeufigsten Probleme beim Einsatz von ESLint.

### Problem 1: "Parsing error: Unexpected token"

**Ursache**: ESLint verwendet standardmaessig den Espree-Parser, der JSX und TypeScript-Syntax nicht versteht. Du musst den passenden Parser konfigurieren.

```bash
# Fehler
Parsing error: Unexpected token <

# Ursache: Parser versteht JSX nicht
# Lösung: Korrekten Parser konfigurieren
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true  // ← JSX Support aktivieren
    }
  }
}
```

### Problem 2: ESLint ist sehr langsam

**Ursache**: Ohne Cache wird jede Datei bei jedem Lauf neu analysiert. Typenbasierte Rules (`@typescript-eslint/recommended-requiring-type-checking`) sind besonders langsam, da sie das gesamte TypeScript-Projekt laden.

```bash
# Problem: ESLint dauert >30 Sekunden
# Lösung 1: Cache aktivieren
eslint --cache --cache-location .eslintcache src/

# Lösung 2: Nur geänderte Dateien (mit Git)
eslint $(git diff --name-only --diff-filter=ACM | grep -E '\.(js|ts)x?$')

# Lösung 3: Parallele Verarbeitung (nicht offiziell supported)
find src -name "*.js" | xargs -P 4 -I {} eslint {}

# Lösung 4: Flat Config nutzen (ESLint v9+)
# Flat Config ist ~2x schneller als legacy config
```

### Problem 3: ESLint und Prettier streiten sich

**Ursache**: Beide Tools haben ueberlappende Formatting-Rules. ESLint korrigiert den Stil, Prettier formatiert ihn zurueck -- ein Endlos-Kreislauf.

```bash
# Problem: Formatter-Konflikte
# Lösung: eslint-config-prettier installieren
npm install --save-dev eslint-config-prettier

# .eslintrc.json (prettier MUSS am Ende!)
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier"  // ← Deaktiviert Style-Rules
  ]
}

# Verifizieren dass keine Konflikte bestehen
npx eslint-config-prettier 'src/**/*.js'
```

### Problem 4: "Definition for rule not found"

**Ursache**: Die referenzierte Rule gehoert zu einem Plugin, das entweder nicht installiert oder nicht in der Konfiguration registriert ist.

```bash
# Fehler
Error: Definition for rule '@typescript-eslint/no-unused-vars' was not found

# Ursache: Plugin nicht installiert oder falsch referenziert
# Lösung 1: Plugin installieren
npm install --save-dev @typescript-eslint/eslint-plugin

# Lösung 2: Plugin in Config aktivieren
{
  "plugins": ["@typescript-eslint"],  // ← Plugin registrieren
  "rules": {
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### Problem 5: Import-Resolution-Fehler

**Ursache**: ESLint kann Imports nicht aufloesen, wenn der Import-Resolver nicht fuer TypeScript-Pfade oder Alias-Konfigurationen eingerichtet ist.

```bash
# Fehler
Unable to resolve path to module './utils'  import/no-unresolved

# Lösung: Import-Resolver konfigurieren
npm install --save-dev eslint-import-resolver-typescript

# .eslintrc.json
{
  "settings": {
    "import/resolver": {
      "typescript": {
        "project": "./tsconfig.json"
      },
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
}
```

### Problem 6: Memory Leaks bei großen Projekten

**Ursache**: Bei sehr grossen Projekten mit vielen Dateien und komplexen Rules kann der Standard-Speicher von Node.js (ca. 1.7 GB) nicht ausreichen.

```bash
# Problem: ESLint crashed mit "JavaScript heap out of memory"
# Lösung: Node Memory erhöhen
NODE_OPTIONS="--max-old-space-size=4096" npm run lint

# Oder in package.json
{
  "scripts": {
    "lint": "NODE_OPTIONS='--max-old-space-size=4096' eslint src/"
  }
}
```

---

## 📊 Vergleich: eslint vs. Alternativen

| Feature | **ESLint** | Biome | Rome (deprecated) | TSLint (deprecated) |
|---------|-----------|-------|----------|----------|
| **Performance** | Mittel | ⚡ Sehr schnell | ⚡ Sehr schnell | Langsam |
| **Language Support** | JS/TS/JSX | JS/TS/JSON | JS/TS/JSX/JSON | Nur TS |
| **Plugin-Ökosystem** | 🏆 Riesig | ❌ Keins | ❌ Keins | ⚠️ Legacy |
| **Auto-Fix** | ✅ 70%+ | ✅ Ja | ✅ Ja | ⚠️ Limitiert |
| **Custom Rules** | ✅ Einfach | ❌ Nein | ❌ Nein | ⚠️ Komplex |
| **React-Support** | ✅ Exzellent | ⚠️ Basic | ⚠️ Basic | ❌ Nein |
| **TypeScript** | ✅ Via Plugin | ✅ Native | ✅ Native | ✅ Native |
| **Adoption** | 🏆 Sehr hoch | Neu | Tot | Deprecated |
| **Formatter** | ❌ Nein | ✅ Ja | ✅ Ja | ❌ Nein |
| **Security-Rules** | ✅ Via Plugins | ❌ Wenige | ❌ Keine | ❌ Keine |

### Wann welches Tool?

**Verwende ESLint wenn:**
- ✅ Etabliertes Ökosystem wichtig ist
- ✅ Custom Rules benötigt werden
- ✅ Framework-spezifische Rules (React, Vue, Angular)
- ✅ Maximale Plugin-Unterstützung

**Verwende Biome wenn:**
- ✅ Performance kritisch ist (Monorepos)
- ✅ All-in-One Formatter + Linter gewünscht
- ✅ Nur JS/TS ohne Framework-spezifische Rules
- ⚠️ Neuere Tools akzeptabel sind

**Migrationstipp**: ESLint ist aktuell der Industriestandard. Biome ist vielversprechend für die Zukunft, aber ESLint hat das größte Ökosystem.

---

## 🔗 Weiterführende Links

### Offizielle Ressourcen:
- **ESLint Docs**: https://eslint.org/docs/latest/
- **Rule Reference**: https://eslint.org/docs/latest/rules/
- **Playground**: https://eslint.org/play/
- **GitHub**: https://github.com/eslint/eslint

### Plugins (Top 10):
- **TypeScript**: https://typescript-eslint.io/
- **React**: https://github.com/jsx-eslint/eslint-plugin-react
- **React Hooks**: https://www.npmjs.com/package/eslint-plugin-react-hooks
- **Import**: https://github.com/import-js/eslint-plugin-import
- **JSX a11y**: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y
- **Security**: https://github.com/eslint-community/eslint-plugin-security
- **Jest**: https://github.com/jest-community/eslint-plugin-jest
- **Prettier**: https://github.com/prettier/eslint-plugin-prettier
- **Node**: https://github.com/eslint-community/eslint-plugin-n
- **Promise**: https://github.com/eslint-community/eslint-plugin-promise

### Config-Presets:
- **Airbnb**: https://github.com/airbnb/javascript
- **Standard**: https://standardjs.com/
- **Google**: https://github.com/google/eslint-config-google
- **XO**: https://github.com/xojs/xo

### Tools & Integrations:
- **VSCode Extension**: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
- **eslint-config-prettier**: https://github.com/prettier/eslint-config-prettier
- **lint-staged**: https://github.com/okonet/lint-staged

---

## 💎 Pro-Tipps

### Tipp 1: Rule-Severity-Strategie
```json
// Graduelles Rollout für Legacy-Projekte
{
  "rules": {
    // Phase 1: Nur Errors (Breaking)
    "no-undef": "error",
    "no-unreachable": "error",

    // Phase 2: Warnings (Non-Breaking)
    "no-console": "warn",
    "no-unused-vars": "warn",

    // Phase 3: Später auf Error upgraden
    "prefer-const": "warn",  // → später "error"
    "eqeqeq": "warn"  // → später "error"
  }
}
```

### Tipp 2: Rule-Performance-Profiling
```bash
# Welche Rules sind langsam?
TIMING=1 eslint src/

# Output:
# Rule                               | Time (ms) | Relative
# :----------------------------------|----------:|--------:
# @typescript-eslint/no-unsafe-call |  1234.56  |    45.2%
# import/no-unresolved              |   789.12  |    28.9%
```

### Tipp 3: Inline-Config für Edge-Cases
```javascript
// Einzelne Zeile deaktivieren
const data = eval(userInput);  // eslint-disable-line no-eval

// Ganzer Block
/* eslint-disable no-console */
console.log('Debug:', data);
console.log('State:', state);
/* eslint-enable no-console */

// Ganzes File
/* eslint-disable @typescript-eslint/no-explicit-any */

// Nur specific Rule für File
/* eslint react/prop-types: "off" */
```

### Tipp 4: Environment-spezifische Configs
```javascript
// .eslintrc.js
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  rules: {
    // Console in Dev OK, in Prod Error
    'no-console': isDev ? 'warn' : 'error',
    // Debugger nur in Dev erlaubt
    'no-debugger': isDev ? 'off' : 'error',
  },
};
```

### Tipp 5: ESLint als Pre-push Hook (strenger als pre-commit)
```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Voller ESLint-Check (kein --fix!)
npm run lint || {
  echo "❌ ESLint failed. Fix errors before pushing."
  exit 1
}
```

---

## 📝 Zusammenfassung

**ESLint** ist das führende Linting-Tool für JavaScript/TypeScript:

### ✅ Hauptvorteile:
- **Bug-Prevention**: Findet Fehler vor der Runtime
- **Code-Qualität**: Erzwingt Best Practices
- **Auto-Fixable**: 70%+ der Issues automatisch behebbar
- **Pluggable**: Riesiges Plugin-Ökosystem
- **Framework-Support**: React, Vue, Angular, TypeScript

### 🎯 Kern-Use-Cases:
1. **Static Analysis**: Syntax- und Logik-Fehler früh finden
2. **Style-Enforcement**: Konsistente Standards durchsetzen
3. **Security**: Unsichere Patterns erkennen
4. **Framework-Rules**: React Hooks, Vue Reactivity
5. **Type-Safety**: Mit @typescript-eslint

### 🚀 Wichtigste Befehle:
```bash
eslint --init                        # Setup Wizard
eslint --fix src/                    # Auto-fix
eslint --cache src/                  # Mit Cache
TIMING=1 eslint src/                 # Performance-Profiling
```

### 💡 Best Practice:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"  // ← Am Ende!
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### ⚠️ Wichtig:
- ESLint ist **Linter**, nicht **Formatter** (nutze prettier dafür)
- Installiere `eslint-config-prettier` um Konflikte zu vermeiden
- Aktiviere Cache mit `--cache` für bessere Performance
- Nutze Pre-commit Hooks um schlechten Code zu blockieren

### 🔗 Integration:
Perfekt kombinierbar mit **prettier** (Lektion 20), **TypeScript**, **React**, **CI/CD**, und **Claude Code** für AI-gestützte Code-Qualitätsanalyse.

**Nächste Lektion**: [22-ruff.md](./22-ruff.md) - Schneller Python Linter in Rust

---

**🎓 Claude Code Masterkurs** | © 2026 | [Zurück zur Übersicht](../README.md)
