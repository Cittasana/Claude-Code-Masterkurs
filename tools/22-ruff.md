# Lektion 22: ruff - Extremely Fast Python Linter

## 📋 Metadata
- **Kategorie**: Fortgeschrittene Tools
- **Schwierigkeit**: Mittel
- **Voraussetzungen**: Lektion 01-04 (Grundlagen), Python Kenntnisse
- **Lernzeit**: 45-60 Minuten
- **Zielgruppe**: Python-Entwickler, die schnelles Linting + Formatting suchen

---

> 🚀 **Claude Code Relevanz**: Ruff ist der ideale Begleiter fuer Claude Code Python-Workflows -- extrem schnelles Linting und Formatting in einem Tool, perfekt fuer die sofortige Validierung von AI-generiertem Python-Code.

## 🎯 Berechtigung: Warum ruff?

### Problem ohne ruff:
```bash
# Alte Python-Toolchain: Langsam und fragmentiert
flake8 src/          # ~5s für Linting
pylint src/          # ~12s für erweiterte Checks
black src/           # ~3s für Formatting
isort src/           # ~2s für Import-Sorting

# Gesamt: ~22 Sekunden + 4 verschiedene Tools zu konfigurieren
```

### Lösung mit ruff:
```bash
# Ruff: Alles in einem, 10-100x schneller
ruff check src/      # ~0.2s für Linting (alle flake8/pylint Rules!)
ruff format src/     # ~0.1s für Formatting (black-kompatibel)

# Gesamt: ~0.3 Sekunden + nur 1 Tool!
```

### Benchmark-Vergleich:
```python
# Repository: ~50k Zeilen Python-Code

# Alte Toolchain:
flake8:    5.2s
pylint:   14.8s
black:     3.1s
isort:     2.4s
Total:    25.5s

# Ruff:
ruff check:   0.18s  (142x schneller als flake8+pylint!)
ruff format:  0.09s  (34x schneller als black!)
Total:        0.27s  (94x schneller gesamt!)
```

### Kernvorteile:
✅ **10-100x schneller**: Rust-basiert, extrem performant
✅ **All-in-One**: Ersetzt flake8, pylint, black, isort, pyupgrade
✅ **700+ Rules**: Alle wichtigen Linter in einem Tool
✅ **Auto-Fixable**: >500 Rules mit automatischen Fixes
✅ **Drop-in Replacement**: Kompatibel mit black + isort
✅ **Zero-Config**: Funktioniert sofort ohne Setup

---

## 🎯 Zwecke: Wofür wird ruff verwendet?

### 1. **Schnelles Linting (flake8 + pylint Ersatz)**
- Alle PEP 8 Violations finden
- Code-Smell erkennen (komplexe Funktionen, magic numbers)
- Best Practices durchsetzen (F-strings statt %, typing hints)

### 2. **Code Formatting (black Ersatz)**
- Konsistente Code-Formatierung
- Line-Length-Management
- String-Quote-Normalisierung

### 3. **Import-Management (isort Ersatz)**
- Imports automatisch sortieren
- Ungenutzte Imports entfernen
- Import-Gruppen organisieren (stdlib, third-party, local)

### 4. **Code-Modernisierung (pyupgrade Ersatz)**
- Veraltete Syntax finden (z.B. `%` statt f-strings)
- Type-Hints modernisieren
- Alte Python-Patterns upgraden

### 5. **CI/CD Integration**
- Pre-commit Hooks (extrem schnell)
- GitHub Actions (kompletter Check in <1s)
- Monorepo-Linting ohne Performance-Issues

---

## 🚀 Verwendung

Dieser Abschnitt zeigt dir Installation, Grundbefehle und erweiterte Konfiguration von ruff -- vom ersten Check bis zur vollstaendigen CI/CD-Integration.

### Installation

Ruff kann auf verschiedenen Wegen installiert werden. Da es in Rust geschrieben ist und als einzige Binary ausgeliefert wird, ist die Installation sehr unkompliziert.

#### macOS (mit Homebrew):
```bash
# Via Homebrew (empfohlen für globale Installation)
brew install ruff

# Oder via pip (per Projekt)
pip install ruff --break-system-packages

# Oder via pipx (global, isoliert)
pipx install ruff
```

#### Ubuntu/Debian:
```bash
# Via pip
pip install ruff --break-system-packages

# Oder Binary Download
curl -LsSf https://astral.sh/ruff/install.sh | sh

# Oder via cargo (Rust)
cargo install ruff
```

#### Arch Linux:
```bash
# Via Pacman
sudo pacman -S ruff

# Oder via pip
pip install ruff --break-system-packages
```

---

### Quick Start: Erste Schritte

Die wichtigsten ruff-Befehle sind `ruff check` (Linting) und `ruff format` (Formatierung). Beide arbeiten extrem schnell dank der Rust-Implementation.

#### 1. **Projekt linten**

Mit `ruff check` pruefst du Python-Code auf Fehler, Style-Verstoesse und Best-Practice-Verletzungen:

```bash
# Alle Python-Dateien linten
ruff check .

# Nur bestimmtes Verzeichnis
ruff check src/

# Mit Auto-Fix
ruff check --fix src/

# Bestimmte Datei
ruff check script.py
```

> 💡 **Tipp**: Nutze `ruff check --fix .` und `ruff format .` als Kombination -- erst Linting mit Auto-Fix, dann Formatting. So erhaeltst du in unter einer Sekunde perfekt formatierten und gelinteten Code.

#### 2. **Code formatieren**

`ruff format` ist ein Drop-in-Replacement fuer black und formatiert Python-Code konsistent:

```bash
# Alle Dateien formatieren
ruff format .

# Nur src/ Verzeichnis
ruff format src/

# Check-Mode (ohne zu schreiben)
ruff format --check .

# Diff anzeigen
ruff format --diff script.py
```

#### 3. **Config erstellen (ruff.toml)**

Die ruff.toml-Datei steuert, welche Rules aktiv sind und wie die Formatierung aussehen soll:

```bash
cat > ruff.toml << 'EOF'
# Ruff Config
line-length = 100

[lint]
select = ["E", "F", "I"]  # pycodestyle, Pyflakes, isort
ignore = ["E501"]  # Line too long

[format]
quote-style = "double"
indent-style = "space"
EOF
```

#### 4. **Pre-commit Hook Setup**
```bash
# .pre-commit-config.yaml
cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.15
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
EOF

# Pre-commit installieren
pre-commit install
```

#### 5. **VSCode Integration**
```bash
# Extension installieren
code --install-extension charliermarsh.ruff

# .vscode/settings.json
cat > .vscode/settings.json << 'EOF'
{
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true,
      "source.fixAll": true
    }
  }
}
EOF
```

---

### Advanced Usage

Fortgeschrittene ruff-Konfiguration mit detaillierter Rule-Auswahl, Complexity-Checks und Format-Optionen.

#### 1. **Rule-Selection (alle wichtigen Linter)**

Ruff bringt ueber 700 Rules mit, organisiert nach Prefixen. Jeder Prefix steht fuer einen bestimmten Linter oder Check-Bereich:

```toml
# ruff.toml
[lint]
select = [
  "E",   # pycodestyle errors
  "F",   # Pyflakes
  "W",   # pycodestyle warnings
  "I",   # isort
  "N",   # pep8-naming
  "D",   # pydocstyle
  "UP",  # pyupgrade
  "B",   # flake8-bugbear
  "C90", # mccabe (complexity)
  "S",   # flake8-bandit (security)
  "T20", # flake8-print
  "PT",  # flake8-pytest-style
  "RUF", # Ruff-specific rules
]

ignore = [
  "D100", # Missing docstring in public module
  "D104", # Missing docstring in public package
]

# Per-File Ignores
[lint.per-file-ignores]
"tests/*" = ["S101"]  # Allow assert in tests
"__init__.py" = ["F401"]  # Allow unused imports
```

> ⚠️ **Warnung**: Verwende `--unsafe-fixes` nur mit Vorsicht -- diese Fixes koennen das Verhalten des Codes aendern. Nutze im Zweifel `--diff` um die Aenderungen vorher zu pruefen.

#### 2. **Auto-Fix Everything**
```bash
# Alle fixbaren Issues automatisch fixen
ruff check --fix --unsafe-fixes src/

# Nur safe fixes (default)
ruff check --fix src/

# Diff preview vor Fix
ruff check --fix --diff src/
```

#### 3. **Complexity Checks (McCabe)**
```toml
# ruff.toml
[lint]
select = ["C90"]

[lint.mccabe]
max-complexity = 10  # Warnung bei Cyclomatic Complexity > 10
```

#### 4. **Type-Checking Integration (mypy-style)**
```toml
[lint]
select = ["ANN"]  # flake8-annotations

[lint.flake8-annotations]
allow-star-arg-any = true
suppress-none-returning = true
```

#### 5. **Custom Ignore-Patterns**
```toml
# ruff.toml
extend-exclude = [
  "migrations/",
  "venv/",
  "build/",
  "dist/",
  ".venv/",
  "*.egg-info/",
]

# File-specific ignores
[lint.per-file-ignores]
"settings.py" = ["E501"]  # Lange Zeilen in Settings OK
"tests/**/*.py" = ["S101", "D"]  # Assert + keine Docstrings in Tests
```

#### 6. **Format-Optionen**
```toml
# ruff.toml
line-length = 100

[format]
quote-style = "double"
indent-style = "space"
skip-magic-trailing-comma = false
line-ending = "lf"

# Docstring-Formatting
docstring-code-format = true
docstring-code-line-length = 80
```

---

## 💡 Best Practices

Bewaeaehrte Strategien fuer die Einfuehrung und den effektiven Einsatz von ruff in Projekten.

### 1. **Stufenweises Rollout für Legacy-Projekte**

Bei einem bestehenden Projekt solltest du ruff schrittweise einfuehren, um nicht von hunderten Violations ueberwaeltigt zu werden:

```bash
# Phase 1: Nur Errors (nicht Warnings)
cat > ruff.toml << 'EOF'
[lint]
select = ["E", "F"]  # Nur pycodestyle-errors + Pyflakes
EOF
ruff check --fix src/

# Phase 2: isort + pyupgrade
cat > ruff.toml << 'EOF'
[lint]
select = ["E", "F", "I", "UP"]
EOF
ruff check --fix src/

# Phase 3: Security + Bugbear
cat > ruff.toml << 'EOF'
[lint]
select = ["E", "F", "I", "UP", "S", "B"]
EOF

# Phase 4: Alles aktivieren
cat > ruff.toml << 'EOF'
[lint]
select = ["ALL"]
ignore = [
  "D",  # Docstrings später
]
EOF
```

> 🚀 **Beispiel**: Mit `ruff check --statistics .` erhaeltst du eine Uebersicht aller Violations nach Typ sortiert -- ideal, um die groessten Problembereiche in einem Legacy-Projekt schnell zu identifizieren.

### 2. **CI/CD Integration (GitHub Actions)**
```yaml
# .github/workflows/lint.yml
name: Ruff

on: [push, pull_request]

jobs:
  ruff:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Ruff
        run: pip install ruff

      - name: Run Ruff Linter
        run: ruff check --output-format=github .

      - name: Run Ruff Formatter
        run: ruff format --check .
```

### 3. **Monorepo mit mehreren Configs**
```toml
# root/ruff.toml (global config)
line-length = 100

[lint]
select = ["E", "F"]

# services/api/ruff.toml (override)
extend = "../../ruff.toml"

[lint]
select = ["E", "F", "S"]  # + Security für API

# scripts/ruff.toml (override)
extend = "../ruff.toml"

[lint]
ignore = ["T20"]  # Prints erlaubt in Scripts
```

### 4. **IDE-Integration (alle gängigen Editoren)**
```bash
# VSCode: charliermarsh.ruff
# PyCharm: Ruff Plugin
# Vim: ALE + ruff
# Emacs: flycheck-ruff

# VSCode settings.json
{
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.ruff": true,
      "source.organizeImports.ruff": true
    }
  },
  "ruff.lint.args": ["--config=ruff.toml"]
}
```

> 💡 **Tipp**: Ruff ersetzt flake8, pylint, black, isort und pyupgrade in einem einzigen Tool. Bei der Migration kannst du deine bestehende flake8/black-Konfiguration fast 1:1 in ruff.toml uebertragen.

### 5. **Watch-Mode für Development**
```bash
# Mit entr (aus Lektion 19)
fd -e py | entr -c ruff check --fix /_

# Oder mit nodemon
nodemon --watch src/ --ext py --exec 'ruff check --fix src/ && ruff format src/'
```

---

## 📚 Beispiele

### Beispiel 1: Unused Imports finden + fixen
```python
# Vorher: messy.py
import os
import sys  # ❌ Unused
from typing import List, Dict, Optional  # ❌ Dict unused
import json

def get_env():
    return os.getenv("API_KEY")

# Ruff
$ ruff check messy.py
messy.py:2:8: F401 [*] `sys` imported but unused
messy.py:3:24: F401 [*] `typing.Dict` imported but unused

# Auto-Fix
$ ruff check --fix messy.py

# Nachher:
import os
from typing import List, Optional

import json

def get_env():
    return os.getenv("API_KEY")
```

### Beispiel 2: F-String Modernisierung
```python
# Vorher: old-style.py
name = "Alice"
age = 30

# ❌ Old-style string formatting
msg1 = "Hello, %s!" % name
msg2 = "You are {} years old".format(age)
msg3 = "Name: {}, Age: {}".format(name, age)

# Ruff (mit UP rule)
$ ruff check old-style.py
old-style.py:5:8: UP031 [*] Use format specifiers instead of percent format
old-style.py:6:8: UP032 [*] Use f-string instead of `format` call

# Auto-Fix
$ ruff check --fix old-style.py

# Nachher:
name = "Alice"
age = 30

msg1 = f"Hello, {name}!"
msg2 = f"You are {age} years old"
msg3 = f"Name: {name}, Age: {age}"
```

### Beispiel 3: Import-Sorting (isort-kompatibel)
```python
# Vorher: imports.py (durcheinander)
from app.models import User
import sys
from typing import List
import os
from app.utils import helper

# Ruff
$ ruff check --select I imports.py
imports.py:1:1: I001 [*] Import block is un-sorted or un-formatted

# Auto-Fix
$ ruff check --fix --select I imports.py

# Nachher: (stdlib → third-party → local)
import os
import sys
from typing import List

from app.models import User
from app.utils import helper
```

### Beispiel 4: Security-Issues finden
```python
# Vorher: unsafe.py
import pickle  # ❌ Unsicher
import subprocess

def load_data(filename):
    with open(filename, 'rb') as f:
        return pickle.load(f)  # ❌ pickle.load ist unsicher

def run_command(cmd):
    subprocess.call(cmd, shell=True)  # ❌ shell=True ist gefährlich

# Ruff (mit Security rules)
$ ruff check --select S unsafe.py
unsafe.py:1:8: S403 `pickle` is not secure; prefer `json`
unsafe.py:6:12: S301 `pickle.load` is unsafe
unsafe.py:9:5: S602 `shell=True` is dangerous

# Empfohlene Fixes (manuell):
import json

def load_data(filename):
    with open(filename, 'r') as f:
        return json.load(f)  # ✓ Sicher

def run_command(cmd):
    subprocess.run(cmd, shell=False, check=True)  # ✓ Sicher
```

### Beispiel 5: Code-Complexity Warnung
```python
# Vorher: complex.py
def process_order(order):
    if order['type'] == 'premium':
        if order['amount'] > 100:
            if order['customer']['vip']:
                if order['shipping'] == 'express':
                    # ... deep nesting
                    pass

# Ruff (McCabe Complexity)
$ ruff check --select C90 complex.py
complex.py:1:1: C901 `process_order` is too complex (8 > 5)

# Refactoring-Empfehlung:
def process_order(order):
    is_premium = order['type'] == 'premium'
    is_high_value = order['amount'] > 100
    is_vip = order['customer']['vip']
    is_express = order['shipping'] == 'express'

    if is_premium and is_high_value and is_vip and is_express:
        # ... (Complexity: 2)
        pass
```

### Beispiel 6: Formatting (black-kompatibel)
```python
# Vorher: unformatted.py
def foo(x,y,z):return x+y+z
result=foo(1,2,3)
my_list=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

# Ruff Format
$ ruff format unformatted.py

# Nachher:
def foo(x, y, z):
    return x + y + z


result = foo(1, 2, 3)
my_list = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
]
```

### Beispiel 7: Type-Annotations prüfen
```python
# Vorher: no-types.py
def calculate(x, y):  # ❌ Keine Type-Hints
    return x + y

# Ruff (flake8-annotations)
$ ruff check --select ANN no-types.py
no-types.py:1:1: ANN201 Missing return type annotation for public function
no-types.py:1:15: ANN001 Missing type annotation for function argument `x`
no-types.py:1:18: ANN001 Missing type annotation for function argument `y`

# Fixed:
def calculate(x: int, y: int) -> int:
    return x + y
```

### Beispiel 8: Print-Statement-Warnung (Production-Code)
```python
# Vorher: debug.py
def process_data(data):
    print("Processing:", data)  # ❌ Print in Production
    result = transform(data)
    print("Result:", result)  # ❌ Print in Production
    return result

# Ruff (flake8-print)
$ ruff check --select T20 debug.py
debug.py:2:5: T201 `print` found

# Empfehlung: Logging verwenden
import logging

logger = logging.getLogger(__name__)

def process_data(data):
    logger.info("Processing: %s", data)  # ✓ Proper logging
    result = transform(data)
    logger.debug("Result: %s", result)
    return result
```

### Beispiel 9: Pytest-Style Best Practices
```python
# Vorher: test_api.py
import pytest

def test_user_creation():
    user = create_user()
    assert user.name == "Alice"  # OK
    assert user.email == "alice@example.com"  # OK
    assert user != None  # ❌ Should use 'is not None'

# Ruff (pytest-style)
$ ruff check --select PT test_api.py
test_api.py:6:12: PT018 Assertion should be `assert x is not None`

# Auto-Fix:
assert user is not None  # ✓ Correct
```

### Beispiel 10: Batch-Processing großer Projekte
```bash
# Alle Dateien linten und formatieren
ruff check --fix . && ruff format .

# Mit Statistiken
ruff check . --statistics

# Output:
# 143 F401  [*] imported but unused
#  82 E501  Line too long
#  34 UP031 [*] Use f-string
#  18 S101  Use of assert detected

# Nur fixbare Issues fixen
ruff check --fix --select F,UP .

# Report in JSON für Weiterverarbeitung
ruff check --output-format=json . > ruff-report.json
```

---

## 🔧 Integration in Claude Code Workflows

### 1. **AI-gestützte Ruff-Config-Optimierung**
```bash
# Ruff-Report generieren
ruff check --output-format=json src/ > ruff-report.json

# Von Claude analysieren lassen
cat ruff-report.json | claude "Analyze these Ruff violations and suggest config improvements"

# Custom Rule-Sets vorschlagen lassen
cat ruff.toml | claude "Optimize this Ruff config for a FastAPI project"
```

### 2. **Automated Refactoring**
```bash
# Workflow: Ruff findet Issues → Claude schlägt Refactorings vor
cat > auto-refactor.sh << 'EOF'
#!/bin/bash
# Ruff-Violations sammeln
ruff check --output-format=json src/ > violations.json

# Claude analysiert und schlägt Fixes vor
cat violations.json | claude "Generate refactoring suggestions for these code issues" > suggestions.md

echo "Review suggestions.md for refactoring ideas"
EOF
chmod +x auto-refactor.sh
```

### 3. **Pre-Review Ruff-Check**
```bash
# Vor Code-Review: Alle Issues finden
git diff main...HEAD --name-only | \
  grep '\.py$' | \
  xargs ruff check

# Mit Claude für kontextuelle Analyse
git diff main...HEAD | \
  claude "Review this Python diff, identify issues beyond Ruff"
```

### 4. **Migration von alten Lintern**
```bash
# Von flake8 + black + isort zu Ruff migrieren
cat .flake8 | claude "Convert this flake8 config to ruff.toml format"

# pyproject.toml Migration
cat pyproject.toml | claude "Migrate black/isort config to ruff.toml"
```

---

## 🤖 Claude Code Integration

### Workflow 1: Python-Code nach Claude Code pruefen

Nachdem Claude Code Python-Dateien generiert oder geaendert hat, prueft dieser Befehl den Code auf PEP-8-Violations, ungenutzte Imports, Sicherheitsprobleme und andere Best-Practice-Verstoesse. Der `--fix`-Flag behebt automatisch alle sicher fixbaren Probleme, wie z.B. das Entfernen ungenutzter Imports oder die Modernisierung alter String-Formatierung zu F-Strings. Stell dir vor, Claude hat ein neues Python-Modul mit 10 Funktionen erstellt -- ruff prueft in unter einer Sekunde, ob der Code den Projektstandards entspricht, und fixt einfache Probleme automatisch. Das ist deutlich schneller als flake8 oder pylint und gibt dir sofortiges Feedback zur Code-Qualitaet.

```bash
ruff check src/ --fix
```

### Workflow 2: Formatierung korrigieren

Ruff format ist ein Drop-in-Replacement fuer black und formatiert Python-Code in einen einheitlichen, gut lesbaren Stil. Nach einer Claude Code Session kann der generierte Code leicht von deinem Projektstil abweichen, z.B. bei der Zeilenlaenge oder dem String-Quoting. Dieser Befehl bringt alle Dateien im src-Verzeichnis auf den gleichen Stand, sodass AI-generierter und manuell geschriebener Code nicht mehr unterscheidbar sind. Stell dir vor, Claude hat eine Funktion mit 120 Zeichen langen Zeilen generiert, waehrend dein Projekt eine Grenze von 100 Zeichen hat -- ruff format bricht die Zeilen automatisch um. Die Formatierung dauert selbst bei tausenden Dateien nur Bruchteile einer Sekunde.

```bash
ruff format src/
```

### Workflow 3: Spezifische Regeln erzwingen

Mit der `--select`-Option kannst du gezielt bestimmte Rule-Kategorien pruefen, ohne die gesamte Konfiguration zu laden. E steht fuer pycodestyle-Errors, W fuer Warnings und F fuer Pyflakes-Checks wie ungenutzte Variablen und undefinierte Namen. Das ist nuetzlich, wenn du einen schnellen Basis-Check machen willst, ohne von hunderten Warnings ueberwaeltigt zu werden. Stell dir vor, du hast Claude Code gebeten, eine groessere Refaktorierung durchzufuehren, und willst nur die grundlegendsten Fehler pruefen -- dieser Befehl konzentriert sich auf die wichtigsten Checks und ignoriert stilistische Regeln. Der `--fix`-Flag behebt gefundene Probleme automatisch, wo moeglich.

```bash
ruff check --select E,W,F --fix .
```

> 💡 **Tipp**: Ruff ist 10-100x schneller als flake8 - ideal fuer schnelle Feedback-Loops waehrend Claude Code Python-Code generiert.

---

## 🐛 Troubleshooting

Loesungen fuer die haeufigsten Probleme bei der Arbeit mit ruff.

### Problem 1: Konflikte mit black/isort

**Ursache**: Ruff ist black-kompatibel, kann aber bei bestimmten Edge-Cases minimal abweichende Formatierung produzieren.

```bash
# Problem: Formatting-Unterschiede zu black
# Lösung: Ruff ist black-kompatibel, aber prüfen:
ruff format --check .
black --check .

# Bei Abweichungen: ruff.toml anpassen
[format]
quote-style = "double"  # black-default
line-ending = "lf"
```

### Problem 2: Zu viele Violations am Anfang

**Ursache**: Bei einem Legacy-Projekt ohne bisheriges Linting zeigt ruff erwartungsgemaess viele Violations. Das ist normal und kein Zeichen fuer schlechten Code.

```bash
# Problem: 1000+ Violations in Legacy-Projekt
# Lösung 1: Nur Errors, keine Warnings
ruff check --select E,F .

# Lösung 2: Per-File Ignores für Legacy-Code
[lint.per-file-ignores]
"legacy/**/*.py" = ["ALL"]

# Lösung 3: Graduelles Rollout (siehe Best Practices)
```

### Problem 3: VSCode Extension funktioniert nicht

**Ursache**: Die Extension sucht die ruff.toml-Datei im Workspace-Root. Liegt sie an einem anderen Ort, muss der Pfad explizit konfiguriert werden.

```bash
# Problem: Ruff-Extension erkennt Config nicht
# Lösung: Expliziter Config-Path
{
  "ruff.lint.args": ["--config=/path/to/ruff.toml"]
}

# Oder: pyproject.toml statt ruff.toml
[tool.ruff]
line-length = 100
```

### Problem 4: Import-Sorting verhält sich anders als isort

**Ursache**: Ruff hat eigene Standardeinstellungen fuer Import-Sortierung. Ohne explizite Konfiguration der known-first-party Pakete und Sektionsreihenfolge kann das Ergebnis von isort abweichen.

```bash
# Problem: Ruff sortiert anders als isort
# Lösung: isort-Kompatibilitäts-Modus
[lint.isort]
known-first-party = ["myapp"]
section-order = ["future", "standard-library", "third-party", "first-party", "local-folder"]

# Oder: isort profile verwenden
[lint.isort]
profile = "black"
```

### Problem 5: Performance-Issues bei riesigen Files

**Ursache**: Obwohl ruff extrem schnell ist, koennen bestimmte Rules wie McCabe-Complexity bei sehr langen Dateien (10k+ Zeilen) mehr Zeit benoetigen.

```bash
# Problem: Ruff langsam bei 10k+ Zeilen Files
# (Normalerweise kein Problem, da Ruff sehr schnell ist)

# Lösung: Bestimmte Rules deaktivieren
[lint]
ignore = ["C901"]  # McCabe-Complexity (teuer bei großen Files)

# Oder: File excluden
extend-exclude = ["generated_file.py"]
```

---

## 📊 Vergleich: ruff vs. Alternativen

| Feature | **ruff** | flake8 | pylint | black | isort |
|---------|---------|--------|--------|-------|-------|
| **Speed** | ⚡ 10-100x schneller | Baseline (1x) | Langsam (0.3x) | Schnell (3x) | Schnell (4x) |
| **Linting** | ✅ 700+ Rules | ✅ Basic | ✅ Advanced | ❌ Nein | ❌ Nein |
| **Formatting** | ✅ Ja | ❌ Nein | ❌ Nein | ✅ Ja | ⚠️ Nur Imports |
| **Auto-Fix** | ✅ 500+ Rules | ⚠️ Limitiert | ⚠️ Limitiert | ✅ Ja | ✅ Ja |
| **Config** | 🟢 Einfach | 🟡 Mittel | 🔴 Komplex | 🟢 Einfach | 🟡 Mittel |
| **Plugin-System** | ❌ Nein (built-in) | ✅ Ja | ✅ Ja | ❌ Nein | ❌ Nein |
| **IDE-Support** | ✅ VSCode, PyCharm | ✅ Alle | ✅ Alle | ✅ Alle | ✅ Alle |
| **Adoption** | 🚀 Wächst schnell | 🏆 Sehr hoch | Hoch | 🏆 Sehr hoch | Hoch |
| **Language** | Rust | Python | Python | Python | Python |

### Wann welches Tool?

**Verwende ruff wenn:**
- ✅ Performance wichtig ist (CI/CD, Monorepos)
- ✅ All-in-One Lösung gewünscht
- ✅ Moderne Python-Projekte (Python 3.7+)
- ✅ black + isort + flake8 ersetzen möchtest

**Verwende pylint wenn:**
- ✅ Sehr detaillierte Code-Qualität-Checks benötigt
- ✅ Custom Plugins erforderlich
- ⚠️ Performance nicht kritisch

**Kombiniere ruff + mypy wenn:**
- ✅ Type-Checking wichtig ist
- ✅ ruff für Linting/Formatting, mypy für Types
- ✅ Beste Kombination für Production-Code

---

## 🔗 Weiterführende Links

### Offizielle Ressourcen:
- **Ruff Docs**: https://docs.astral.sh/ruff/
- **GitHub**: https://github.com/astral-sh/ruff
- **Rules Reference**: https://docs.astral.sh/ruff/rules/
- **Settings**: https://docs.astral.sh/ruff/settings/

### Integration & Tools:
- **VSCode Extension**: https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff
- **PyCharm Plugin**: https://plugins.jetbrains.com/plugin/20574-ruff
- **pre-commit Hook**: https://github.com/astral-sh/ruff-pre-commit
- **GitHub Action**: https://github.com/chartboost/ruff-action

### Migration-Guides:
- **From black**: https://docs.astral.sh/ruff/formatter/#black-compatibility
- **From flake8**: https://docs.astral.sh/ruff/faq/#how-does-ruff-compare-to-flake8
- **From pylint**: https://docs.astral.sh/ruff/faq/#how-does-ruff-compare-to-pylint

### Community:
- **Discord**: https://discord.gg/astral-sh
- **Twitter**: https://twitter.com/astral_sh

---

## 💎 Pro-Tipps

### Tipp 1: Ruff im Watch-Mode (Development)

Im Entwicklungsalltag willst du bei jeder Dateiaeenderung sofort Feedback zu Linting und Formatierung bekommen. Dieser Watch-Mode nutzt entr (aus Lektion 19), um bei jeder Aenderung an Python-Dateien automatisch Linting und Formatting auszufuehren. Der erste Befehl fixt die geaenderte Datei und formatiert sie, der zweite nutzt nodemon fuer dasselbe Ergebnis. Stell dir vor, du arbeitest an einer FastAPI-Anwendung und speicherst eine Datei -- innerhalb von Millisekunden werden ungenutzte Imports entfernt, Strings zu F-Strings modernisiert und der Code formatiert. Das macht manuelle `ruff check` und `ruff format`-Aufrufe ueberfluessig und beschleunigt deinen Entwicklungs-Workflow erheblich.

```bash
# Auto-format bei jedem Save (mit entr)
fd -e py | entr -c sh -c 'ruff check --fix /_ && ruff format /_'

# Oder als npm-Script
{
  "scripts": {
    "lint:watch": "nodemon --watch src/ --ext py --exec 'ruff check --fix src/'"
  }
}
```

### Tipp 2: Ruff + mypy = Perfect Combo

Ruff deckt Linting und Formatting ab, aber fuer vollstaendiges Type-Checking brauchst du mypy. Die Kombination beider Tools gibt dir den umfassendsten Python-Qualitaetscheck, der verfuegbar ist. Der erste Befehl fuehrt alle drei Schritte sequenziell aus: Linting mit Auto-Fix, Formatierung und Type-Checking. Die Pre-Commit-Konfiguration stellt sicher, dass alle drei Checks bei jedem Commit automatisch laufen. Stell dir vor, du hast eine Funktion, die einen String zurueckgibt, aber der Caller erwartet einen Integer -- ruff wuerde das nicht finden, aber mypy erkennt den Type-Mismatch sofort. Zusammen decken die beiden Tools Syntax, Style, Best Practices und Type-Safety ab, was die meisten Bugs schon vor der Ausfuehrung auffaengt.

```bash
# ruff für Linting/Formatting, mypy für Types
ruff check --fix . && ruff format . && mypy .

# In pre-commit
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.15
    hooks:
      - id: ruff
      - id: ruff-format
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
```

### Tipp 3: Inline-Config für Edge-Cases

Manchmal gibt es berechtigte Gruende, eine bestimmte Ruff-Regel fuer eine einzelne Zeile oder eine ganze Datei zu deaktivieren. Der `# noqa`-Kommentar mit Regel-ID ist die praeziseste Methode und dokumentiert gleichzeitig, warum die Regel ignoriert wird. Du kannst eine einzelne Zeile, einen bestimmten Regelbereich oder eine komplette Datei von der Pruefung ausschliessen. Stell dir vor, du musst in einem Legacy-System tatsaechlich `eval()` verwenden, weil es keine Alternative gibt -- statt die Regel global zu deaktivieren, markierst du nur diese eine Zeile mit `# noqa: S307`. Verwende `noqa`-Kommentare sparsam und immer mit der spezifischen Regel-ID, damit klar ist, welche Regel deaktiviert wird und warum.

```python
# Einzelne Zeile deaktivieren
result = eval(user_input)  # noqa: S307

# Ganzer Block
# ruff: noqa: E501
very_long_line = "This line is very long but I need it exactly like this for some reason"

# File-wide
# ruff: noqa

# Specific rule für File
# ruff: noqa: F401
```

### Tipp 4: Ruff als Git Pre-push Hook (strenger)

Waehrend Pre-Commit-Hooks mit `--fix` automatisch Probleme beheben, laeuft dieser Pre-Push-Hook ohne Fix und blockiert den Push bei Fehlern. Das stellt sicher, dass der Code nicht nur formatiert, sondern auch manuell von Lint-Violations befreit wurde. Der Hook prueft sowohl Linting als auch Formatting -- beides muss bestehen, damit der Push durchgeht. Stell dir vor, ein Entwickler hat mit `git commit --no-verify` den Pre-Commit-Hook umgangen -- der Pre-Push-Hook faengt die Probleme trotzdem ab, bevor sie ins Remote-Repository gelangen. Die separaten Fehlermeldungen fuer Linting und Formatting machen klar, welcher Schritt fehlgeschlagen ist und wie das Problem behoben werden kann.

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Voller Ruff-Check ohne --fix
ruff check . || {
  echo "❌ Ruff check failed. Fix issues before pushing."
  exit 1
}

ruff format --check . || {
  echo "❌ Code not formatted. Run 'ruff format .'"
  exit 1
}
```

### Tipp 5: Ruff für Jupyter Notebooks

Ruff kann nicht nur Python-Dateien, sondern auch Jupyter Notebooks (.ipynb) linten und formatieren. Das ist besonders fuer Data Scientists und ML-Engineers nuetzlich, die viel in Notebooks arbeiten und oft weniger auf Code-Qualitaet achten als bei regulaeren Python-Dateien. Mit der `extend-include`-Konfiguration werden Notebooks automatisch in den Ruff-Workflow eingebunden. Stell dir vor, du hast ein Data-Science-Team, das dutzende Notebooks mit ungenutzten Imports, Print-Statements und unsortiertem Code produziert -- Ruff bringt auch diese Notebooks in einen sauberen Zustand. Die Linting-Regeln werden auf jede Code-Zelle einzeln angewendet, und Formatierung normalisiert den Code-Stil ueber alle Zellen hinweg.

```bash
# Ruff kann auch .ipynb Dateien linten!
ruff check notebook.ipynb

# Formatieren
ruff format notebook.ipynb

# In Config aktivieren
# ruff.toml
extend-include = ["*.ipynb"]
```

---

## 📝 Zusammenfassung

**ruff** ist der moderne, extrem schnelle Python-Linter der Zukunft:

### ✅ Hauptvorteile:
- **10-100x schneller**: Rust-basiert, sub-second Linting
- **All-in-One**: Ersetzt flake8, pylint, black, isort, pyupgrade
- **700+ Rules**: Alle wichtigen Python-Checks in einem Tool
- **Auto-Fixable**: 500+ Rules mit automatischen Fixes
- **Drop-in Replacement**: Kompatibel mit black, isort

### 🎯 Kern-Use-Cases:
1. **Linting**: Alle PEP 8 + flake8 + pylint Rules
2. **Formatting**: black-kompatibles Formatting
3. **Import-Sorting**: isort-Ersatz
4. **Code-Modernisierung**: pyupgrade-Features
5. **CI/CD**: Extrem schnell für große Projekte

### 🚀 Wichtigste Befehle:
```bash
ruff check --fix .                # Linting + Auto-fix
ruff format .                     # Formatting
ruff check --select E,F,I .       # Spezifische Rules
ruff check --output-format=json . # JSON-Report
```

### 💡 Best Practice:
```toml
# ruff.toml
line-length = 100

[lint]
select = ["E", "F", "I", "UP", "B", "S"]
ignore = ["E501"]

[format]
quote-style = "double"
indent-style = "space"
```

### ⚠️ Wichtig:
- Ruff ist **Linter + Formatter**, aber kein Type-Checker (nutze mypy dafür)
- Migration von black/flake8 ist trivial (drop-in replacement)
- Extrem schnell für Monorepos und CI/CD
- Kombiniere mit mypy für vollständige Code-Qualität

### 🔗 Integration:
Perfekt kombinierbar mit **mypy** (Type-Checking), **pre-commit**, **VSCode**, **GitHub Actions**, und **Claude Code** für AI-gestützte Code-Analyse.

**Nächste Lektion**: [23-hadolint.md](./23-hadolint.md) - Dockerfile Linter für Container-Best-Practices

---

**🎓 Claude Code Masterkurs** | © 2026 | [Zurück zur Übersicht](../README.md)
