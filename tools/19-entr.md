# 19. entr - File Watcher & Auto-Reloader

## Berechtigung

**entr** ist ein minimalistisches Tool, das Commands automatisch ausführt, wenn Files sich ändern. Es ist der einfachste Weg, um Auto-Reload-Workflows in der Shell zu implementieren - perfekt für Test-Driven Development, Live-Previews und automatische Builds.

### Warum entr seine Berechtigung hat:

1. **Simplicity**: Ein Tool, ein Job - File-Watching done right
2. **Shell-Native**: Nutzt Standard-Unix-Tools (keine Dependencies)
3. **Performance**: Event-basiertes Watching (kein Polling)
4. **Composable**: Pipes in/out, kombinierbar mit fd, git, find
5. **Cross-Platform**: macOS, Linux, BSD, Windows (WSL)
6. **Predictable**: Keine Magie, klar definiertes Verhalten

### Statistiken:
- **Minimal**: ~1000 Lines of Code
- **Battle-Tested**: Seit 2012, mature & stable
- **Zero-Config**: Funktioniert out-of-the-box

---

> 🚀 **Claude Code Relevanz**: entr ermoeglicht automatische Test- und Lint-Laeufe bei jeder Code-Aenderung, sodass Claude Code generierte Aenderungen sofort validiert werden koennen.

## Zwecke

### Haupteinsatzgebiete:

1. **Development Workflows**
   - Auto-Run Tests bei Code-Änderung
   - Live-Reload für Webserver
   - Auto-Compile für Sass/TypeScript
   - Linting on Save

2. **Build Automation**
   - Incremental Builds
   - Asset-Pipeline
   - Documentation-Generation
   - Docker-Image Rebuild

3. **Testing**
   - TDD-Workflows (Test-Driven Development)
   - Watch-Mode für Jest/Pytest
   - Coverage-Updates
   - Integration-Tests

4. **Documentation**
   - Markdown-Preview
   - API-Doc Regeneration
   - PDF-Generation
   - Changelog-Updates

5. **Monitoring**
   - Config-File Changes
   - Log-File Updates
   - Process-Restart on Change
   - Deployment-Triggers

---

## Verwendung

Dieser Abschnitt zeigt dir Installation, grundlegende Patterns und fortgeschrittene Workflows mit entr.

### Installation

entr ist auf allen gaengigen Plattformen verfuegbar. Da es in C geschrieben ist und keine Abhaengigkeiten hat, ist die Installation unkompliziert.

#### macOS (Homebrew)

Auf macOS installierst du entr am einfachsten ueber Homebrew:

```bash
brew install entr
```

#### Ubuntu/Debian

Auf Ubuntu/Debian ist entr direkt ueber den Paketmanager verfuegbar:

```bash
apt-get install entr
```

#### Arch Linux

Unter Arch Linux findest du entr im offiziellen Repository:

```bash
pacman -S entr
```

#### From Source

Falls kein Paket verfuegbar ist, kannst du entr aus dem Quellcode kompilieren:

```bash
git clone https://github.com/eradman/entr.git
cd entr
./configure
make && sudo make install
```

### Verifizierung

Pruefe nach der Installation, ob entr korrekt installiert wurde:

```bash
entr --version
# Output: release: 5.5

which entr
# Output: /usr/local/bin/entr
```

---

### Quick Start

Das Grundprinzip von entr ist einfach: Du piped eine Liste von Dateien hinein, und entr fuehrt bei jeder Aenderung den angegebenen Befehl aus.

#### Basis-Usage

Die Syntax folgt dem Muster `<dateiliste> | entr <befehl>`. Hier sind die gaengigsten Anwendungsfaelle:

```bash
# Syntax: <list-files> | entr <command>

# Run tests when any .js file changes
fd -e js | entr npm test

# Reload server on code change
fd -e py | entr python server.py

# Compile Sass on change
fd -e scss | entr sass input.scss output.css

# Run linter on save
fd -e js src/ | entr eslint src/
```

> 💡 **Tipp**: Verwende `fd` statt `find` als Input fuer entr -- fd ist schneller, respektiert .gitignore automatisch und hat eine intuitivere Syntax.

#### Common Patterns

Diese Patterns zeigen haeufig verwendete Flags wie `-c` (Bildschirm loeschen), `-r` (Prozess neu starten) und `/_` (Platzhalter fuer die geaenderte Datei):

```bash
# Watch specific file
echo "config.yaml" | entr cat /_

# Watch directory (recursive)
fd . src/ | entr make build

# Clear screen before each run
fd -e ts | entr -c npm run build

# Restart command (kill previous)
fd -e js | entr -r node server.js

# Run only once, exit after
fd -e md | entr -n pandoc /_
```

#### Interactive Mode

Mit dem `-s` Flag kannst du Shell-Befehle ausfuehren, die Pipes und Verknuepfungen enthalten:

```bash
# Run shell command
fd -e js | entr -s 'npm test && notify-send "Tests passed"'

# Reload only on success
fd -e ts | entr sh -c 'tsc && node dist/index.js'
```

---

### Advanced Usage

Fortgeschrittene entr-Techniken umfassen die Kombination mit anderen Tools, Directory-Watching und komplexe Multi-Step-Workflows.

#### Flags & Options

Hier eine Uebersicht aller wichtigen Flags mit Erklaerung. Jedes Flag aendert das Verhalten von entr auf eine spezifische Weise:

```bash
# -c: Clear screen before running
fd -e js | entr -c npm test

# -r: Restart command (send SIGTERM to previous)
fd -e py | entr -r python app.py

# -n: Non-interactive (run once, exit)
fd -e md | entr -n make docs

# -d: Track directories (reload on add/delete)
fd -t d src/ | entr -d make build

# -p: Postpone first execution
fd -e js | entr -p npm start

# -s: Evaluate command in shell
fd -e js | entr -s 'echo "Changed: $_"'

# /_: Placeholder for changed file
fd -e md | entr -s 'pandoc /_ -o output.pdf'
```

#### Combining Tools

entr folgt der Unix-Philosophie und laesst sich nahtlos mit anderen File-Finding-Tools kombinieren:

```bash
# With git ls-files (tracked files only)
git ls-files | entr make test

# With find (Unix classic)
find . -name "*.c" | entr make

# With ripgrep (find by content)
rg -l "TODO" | entr -c cat /_

# With fd (modern, recommended)
fd -e rs | entr cargo test
```

> ⚠️ **Warnung**: entr erkennt neue Dateien nicht automatisch. Nutze das Flag `-d` mit einem umschliessenden `while true`-Loop, um auch neu erstellte Dateien zu ueberwachen.

#### Complex Workflows

Fuer mehrstufige Build-Pipelines kannst du mit `sh -c` mehrere Befehle verketten:

```bash
# Multi-Step Build
fd -e ts src/ | entr sh -c '
  tsc &&
  eslint dist/ &&
  npm test
'

# Conditional Execution
fd -e py | entr sh -c '
  if pytest; then
    echo "✓ Tests passed"
  else
    echo "✗ Tests failed"
  fi
'

# Parallel Tasks
fd -e scss | entr -s '
  sass input.scss output.css &
  autoprefixer output.css &
  wait
'
```

---

### Integration in Claude Code Workflows

#### 1. Auto-Test mit AI-Analysis

Dieser Workflow kombiniert entr mit Claude Code, um bei jeder Code-Aenderung automatisch Tests auszufuehren und fehlgeschlagene Tests von Claude analysieren zu lassen. Die Test-Ausgabe wird in eine Datei geschrieben, und nur wenn Tests fehlschlagen, wird Claude zur Analyse aufgerufen. Das spart dir die manuelle Fehlersuche, da Claude direkt Vorschlaege zur Behebung macht. Stell dir vor, du refaktorierst eine komplexe Funktion und bei jeder Aenderung schlaegt ein Test fehl -- statt die Fehlermeldung selbst zu interpretieren, bekommst du sofort eine Analyse und einen Fix-Vorschlag. Das Ergebnis ist ein vollautomatischer Feedback-Loop, der dich bei der Entwicklung unterstuetzt.

```bash
# Watch Tests, analyze failures with Claude
fd -e test.js | entr sh -c '
  npm test 2>&1 | tee test-output.txt
  if [ $? -ne 0 ]; then
    cat test-output.txt | claude "Analyze test failures and suggest fixes"
  fi
'
```

#### 2. Live Code-Review

Mit diesem Workflow erhaeltst du bei jeder Dateiaeenderung automatisch ein kurzes Code-Review von Claude. Jedes Mal, wenn du eine TypeScript-Datei speicherst, wird der Git-Diff der geaenderten Datei an Claude gesendet, das die Aenderungen bewertet. Das ist besonders nuetzlich, wenn du alleine an einem Projekt arbeitest und kein Teammitglied fuer ein schnelles Review verfuegbar ist. Stell dir vor, du implementierst eine neue API-Route und willst sicherstellen, dass du keine offensichtlichen Fehler eingebaut hast -- bei jedem Speichern bekommst du ein kurzes Feedback direkt im Terminal. Beachte, dass bei haeufigem Speichern viele API-Aufrufe generiert werden koennen.

```bash
# Auto-Review on Save
fd -e ts src/ | entr sh -c '
  git diff /_ | claude "Quick code review of changes"
'
```

#### 3. Documentation Auto-Generation

Dieser Workflow generiert bei jeder Code-Aenderung automatisch die API-Dokumentation neu und laesst Claude eine Zusammenfassung der Aenderungen erstellen. Zuerst wird jsdoc ausgefuehrt, um die HTML-Dokumentation zu aktualisieren, und dann fasst Claude die API-Aenderungen im docs-Verzeichnis in einem CHANGELOG zusammen. Das ist besonders nuetzlich bei Library-Entwicklung, wo Dokumentation staendig aktuell gehalten werden muss. Stell dir vor, du fuegst einer JavaScript-Library eine neue Funktion hinzu und aenderst die Signatur einer bestehenden -- die Dokumentation und das Changelog werden automatisch aktualisiert, ohne dass du daran denken musst. So bleibt deine Dokumentation immer synchron mit dem Code.

```bash
# Generate Docs on Code Change
fd -e js src/ | entr sh -c '
  jsdoc src/ -d docs/ &&
  claude "Summarize API changes in docs/" > CHANGELOG.md
'
```

#### 4. Smart Build Pipeline

Diese Build-Pipeline kombiniert entr mit Claude, um nicht nur automatisch zu bauen, sondern auch Compiler-Warnings zu analysieren und Optimierungsvorschlaege zu erhalten. Bei jeder Aenderung an Rust-Dateien wird `cargo build` ausgefuehrt, und wenn Warnings auftreten, werden diese von Claude analysiert. Das ist besonders nuetzlich bei Rust-Projekten, wo Compiler-Warnings oft auf potenzielle Performance-Probleme oder unsichere Patterns hinweisen. Stell dir vor, du bekommst nach einem Build 12 Warnings zu ungenutzten Variablen und unsicheren Casts -- Claude schlaegt dir konkrete Optimierungen vor, die du sofort umsetzen kannst. Die Build-Ausgabe wird in `build.log` gespeichert, sodass du sie auch spaeter noch analysieren kannst.

```bash
# Build + AI Optimization Suggestions
fd -e rs | entr sh -c '
  cargo build 2>&1 | tee build.log
  if grep -q "warning" build.log; then
    cat build.log | claude "Suggest optimizations for these warnings"
  fi
'
```

---

## Best Practices

Bewaeaehrte Patterns fuer den produktiven Einsatz von entr in der taeglichen Entwicklungsarbeit.

### 1. Essenzielle Aliase

Mit Aliase fuer haeufige Watch-Patterns sparst du dir das wiederholte Tippen langer Befehle:

```bash
# ~/.bashrc oder ~/.zshrc

# Watch & Test
alias wt='fd -e js -e ts | entr -c npm test'
alias wpy='fd -e py | entr -c pytest'
alias wgo='fd -e go | entr -c go test ./...'

# Watch & Build
alias wb='fd -e ts | entr -c npm run build'
alias wrs='fd -e rs | entr -c cargo build'

# Watch & Lint
alias wl='fd -e js | entr -c eslint src/'
alias wpl='fd -e py | entr -c ruff check .'
```

### 2. Project-Specific Scripts

Definiere Watch-Commands als npm-Scripts, damit jedes Teammitglied dieselben Watcher nutzen kann:

```bash
# package.json
{
  "scripts": {
    "watch": "fd -e js src/ | entr -c npm test",
    "watch:build": "fd -e ts | entr -rc npm run build",
    "watch:lint": "fd -e js | entr -c eslint ."
  }
}

# Usage: npm run watch
```

> 🚀 **Beispiel**: Ein TDD-Workflow mit `fd -e py | entr -c pytest` zeigt dir bei jeder Aenderung sofort die Testergebnisse -- perfekt fuer die iterative Entwicklung mit Claude Code.

### 3. Smart Restart-Logic

Fuer Server-Prozesse ist es wichtig, den alten Prozess sauber zu beenden, bevor ein neuer gestartet wird:

```bash
# Restart nur bei Success
fd -e js | entr sh -c '
  npm run build &&
  pkill -f "node server.js" &&
  node server.js &
'

# Mit Delay
fd -e py | entr sh -c '
  sleep 0.5  # Debounce multiple changes
  python server.py
'
```

### 4. Notification-Integration

Desktop-Benachrichtigungen informieren dich ueber Test-Ergebnisse, ohne dass du das Terminal im Blick haben musst:

```bash
# macOS Notifications
fd -e js | entr sh -c '
  if npm test; then
    osascript -e "display notification \"✓ Tests passed\" with title \"entr\""
  else
    osascript -e "display notification \"✗ Tests failed\" with title \"entr\""
  fi
'

# Linux (notify-send)
fd -e py | entr sh -c '
  pytest && notify-send "✓ Tests passed" || notify-send "✗ Tests failed"
'
```

> 💡 **Tipp**: Kombiniere entr mit dem Flag `-c` (clear screen), um bei jedem Durchlauf einen sauberen Output zu erhalten -- besonders nuetzlich bei langen Test-Ausgaben.

### 5. Logging & Debugging

```bash
# Mit Timestamps
fd -e js | entr sh -c '
  echo "[$(date +%H:%M:%S)] Running tests..."
  npm test
'

# Mit File-Tracking
fd -e py | entr sh -c '
  echo "Changed: $_"
  pytest $_
'
```

---

## Beispiele

### 1. TDD-Workflow (JavaScript)

Test-Driven Development lebt davon, dass Tests bei jeder Code-Aenderung sofort ausgefuehrt werden. Mit entr kannst du einen automatischen Watch-Modus fuer deine JavaScript-Tests einrichten, der bei jeder Aenderung an JS- oder Test-Dateien die Tests ausfuehrt. Der `-c` Flag loescht den Bildschirm vor jedem Durchlauf, sodass du immer eine saubere Ausgabe siehst. Im zweiten Beispiel wird zusaetzlich die Code-Coverage angezeigt, damit du sofort siehst, wie gut dein Code getestet ist. Stell dir vor, du implementierst eine neue Funktion mit dem Red-Green-Refactor-Zyklus: Du schreibst einen Test (rot), implementierst die Funktion (gruen), refaktorierst -- und bei jedem Schritt siehst du das Ergebnis sofort. Das dritte Beispiel zeigt, wie du nur eine bestimmte Test-Datei ueberwachst, was bei grossen Projekten deutlich schneller ist.

```bash
# Watch & Test mit Clear-Screen
fd -e js -e test.js | entr -c npm test

# Mit Coverage
fd -e js src/ test/ | entr sh -c '
  clear
  npm test -- --coverage
  echo ""
  echo "Coverage: $(cat coverage/coverage-summary.json | jq .total.lines.pct)%"
'

# Specific Test-File
echo "test/api.test.js" | entr -c npm test -- /_
```

### 2. Live Markdown-Preview

Beim Schreiben von Dokumentation oder READMEs ist eine Live-Vorschau extrem hilfreich, um das Ergebnis sofort zu sehen. Mit entr und pandoc wird bei jeder Aenderung an Markdown-Dateien automatisch eine HTML- oder PDF-Version generiert. Der erste Befehl konvertiert die geaenderte Datei nach HTML und oeffnet sie im Browser. Der zweite Befehl nutzt `glow` fuer eine farbige Markdown-Vorschau direkt im Terminal. Stell dir vor, du schreibst die Dokumentation fuer ein Open-Source-Projekt und willst sicherstellen, dass Tabellen, Code-Bloecke und Links korrekt dargestellt werden -- bei jedem Speichern aktualisiert sich die Vorschau automatisch. Der dritte Befehl erzeugt sogar eine PDF-Version, was besonders fuer technische Reports nuetzlich ist.

```bash
# Convert to HTML on Change
fd -e md | entr sh -c '
  pandoc /_ -o preview.html &&
  open preview.html
'

# Mit GitHub-Style
fd README.md | entr sh -c '
  glow /_ -p
'

# PDF-Generation
fd -e md docs/ | entr sh -c '
  pandoc /_ -o output.pdf --pdf-engine=xelatex
'
```

### 3. TypeScript Auto-Compile

TypeScript muss vor der Ausfuehrung kompiliert werden, was den Entwicklungszyklus verlangsamt. Mit entr automatisierst du den Kompilierungsschritt, sodass bei jeder Aenderung an TypeScript-Dateien automatisch `tsc` ausgefuehrt wird. Der einfache Compile-Befehl prueft nur auf Typ-Fehler, waehrend der zweite Befehl zusaetzlich die kompilierte Version ausfuehrt. Stell dir vor, du entwickelst einen Node.js-Server in TypeScript und willst bei jeder Aenderung sofort sehen, ob der Code kompiliert und korrekt laeuft -- ohne entr muesstest du bei jeder Aenderung manuell `tsc && node dist/index.js` ausfuehren. Der dritte Befehl nutzt `bat` fuer syntax-gehighlightete Fehlerausgabe, was die Lesbarkeit von TypeScript-Fehlermeldungen deutlich verbessert.

```bash
# Simple Compile
fd -e ts src/ | entr -c tsc

# Compile + Run
fd -e ts src/ | entr sh -c '
  tsc &&
  node dist/index.js
'

# Mit Error-Highlighting
fd -e ts | entr sh -c '
  tsc 2>&1 | bat --language=typescript --style=plain
'
```

### 4. Sass/CSS Workflow

Sass-Dateien muessen in CSS kompiliert werden, bevor sie im Browser verwendet werden koennen. Mit entr automatisierst du diesen Schritt, sodass bei jeder Aenderung an SCSS-Dateien das CSS automatisch neu generiert wird. Der erste Befehl kompiliert eine einzelne Sass-Datei, der zweite fuegt Autoprefixer hinzu, der automatisch Browser-Prefixe ergaenzt. Der dritte Befehl loeest zusaetzlich ein Browser-Reload aus, sodass du die Aenderungen sofort im Browser siehst. Stell dir vor, du arbeitest an einem responsiven Design und passt Abstande und Farben an -- bei jeder Aenderung kompiliert Sass automatisch, Prefixes werden gesetzt und der Browser aktualisiert sich. Das ergibt einen fluessigen Design-Workflow ohne manuelles Neuladen.

```bash
# Compile Sass
fd -e scss styles/ | entr sass styles/main.scss dist/main.css

# Mit Autoprefixer
fd -e scss | entr sh -c '
  sass styles/main.scss dist/main.css &&
  postcss dist/main.css --use autoprefixer -o dist/main.css
'

# Live-Reload Browser
fd -e scss -e html | entr sh -c '
  sass styles/main.scss dist/main.css &&
  browser-sync reload
'
```

### 5. Docker Development

Bei der Entwicklung mit Docker musst du Container nach Aenderungen am Code oder an der Konfiguration neu bauen oder neu starten. entr automatisiert diesen Prozess, sodass bei einer Aenderung am Dockerfile automatisch ein neuer Build gestartet wird. Der erste Befehl baut das Image bei Dockerfile-Aenderungen neu, der zweite startet den Web-Container bei Code-Aenderungen neu, und der dritte faehrt die gesamte Docker-Compose-Umgebung herunter und wieder hoch. Stell dir vor, du entwickelst einen Microservice und passt die Nginx-Konfiguration im Dockerfile an -- statt manuell `docker build` und `docker run` auszufuehren, erledigt entr das automatisch bei jedem Speichern. Beachte, dass volle Rebuilds bei grossen Images lange dauern koennen -- nutze Multi-Stage-Builds und Layer-Caching, um die Build-Zeiten kurz zu halten.

```bash
# Rebuild Image on Dockerfile Change
echo "Dockerfile" | entr docker build -t myapp .

# Restart Container
fd -e js src/ | entr sh -c '
  docker-compose restart web
'

# Full Rebuild
echo "docker-compose.yml" | entr sh -c '
  docker-compose down &&
  docker-compose up -d &&
  docker-compose logs -f
'
```

### 6. Python Development

Python-Entwicklung profitiert besonders von automatischen Test- und Server-Neustarts, da Python-Dateien vor der Ausfuehrung nicht kompiliert werden muessen. Der erste Befehl fuehrt pytest bei jeder Aenderung aus, der zweite zeigt zusaetzlich die Test-Coverage an. Der `-r` Flag ist besonders wichtig fuer Server-Prozesse wie Flask oder Django, da er den alten Prozess automatisch beendet, bevor ein neuer gestartet wird. Stell dir vor, du entwickelst eine Flask-API und aenderst eine Route -- der Server startet automatisch neu und du kannst sofort die Aenderung im Browser oder mit curl testen. Ohne den `-r` Flag wuerde der alte Server-Prozess den Port weiterhin blockieren und der neue koennte nicht starten. Kombiniere den Test-Watcher mit einem separaten Server-Watcher in verschiedenen tmux-Panes fuer einen optimalen Entwicklungs-Workflow.

```bash
# Watch & Test (pytest)
fd -e py | entr -c pytest

# Mit Coverage
fd -e py | entr sh -c '
  pytest --cov=src/ --cov-report=term-missing
'

# Flask Auto-Reload
fd -e py | entr -r python app.py

# Django Runserver
fd -e py | entr -r python manage.py runserver
```

### 7. Rust Development

Rust-Projekte profitieren enorm von automatischen Watch-Workflows, da die Kompilierung je nach Projektgroesse einige Sekunden dauern kann. Der erste Befehl fuehrt bei jeder Aenderung die Tests aus, der zweite kompiliert und fuehrt das Programm mit Neustart aus, und der dritte nutzt `cargo check` fuer eine schnelle Syntaxpruefung ohne vollstaendige Kompilierung. Die "Full Pipeline" im letzten Beispiel durchlaeuft Formatierung, Linting und Tests in einem Schritt. Stell dir vor, du arbeitest an einem Rust-CLI-Tool und willst bei jeder Aenderung sicherstellen, dass der Code kompiliert, keine Clippy-Warnings hat und alle Tests bestehen -- diese Pipeline gibt dir sofort Feedback zu allen drei Aspekten. `cargo check` ist dabei deutlich schneller als `cargo build`, da es nur die Syntax prueft, ohne Maschinencode zu erzeugen.

```bash
# Watch & Test
fd -e rs | entr -c cargo test

# Watch & Run
fd -e rs src/ | entr -rc cargo run

# Watch & Check
fd -e rs | entr cargo check

# Full Pipeline
fd -e rs | entr sh -c '
  cargo fmt &&
  cargo clippy &&
  cargo test
'
```

### 8. Documentation-Generation

Automatische Dokumentationsgenerierung stellt sicher, dass deine Docs immer synchron mit dem Code sind. Jeder Befehl ueberwacht die relevanten Quelldateien und regeneriert die Dokumentation bei jeder Aenderung. JSDoc generiert HTML-Dokumentation fuer JavaScript, `cargo doc` fuer Rust, Sphinx fuer Python und `redoc-cli` fuer OpenAPI-Spezifikationen. Stell dir vor, du dokumentierst eine REST-API und aenderst die OpenAPI-Spezifikation -- die HTML-Dokumentation wird automatisch neu generiert und du kannst sofort pruefen, ob alles korrekt dargestellt wird. Der `--open`-Flag bei `cargo doc` oeffnet die Dokumentation sogar automatisch im Browser. Das ist deutlich effizienter als manuelle Dokumentations-Builds, besonders in der fruehen Entwicklungsphase, wenn sich die API haeufig aendert.

```bash
# JSDoc on Change
fd -e js src/ | entr jsdoc src/ -d docs/

# Rust Docs
fd -e rs src/ | entr cargo doc --open

# Sphinx (Python)
fd -e py -e rst docs/ | entr make -C docs/ html

# API Docs with OpenAPI
echo "openapi.yaml" | entr sh -c '
  redoc-cli bundle /_ -o api-docs.html
'
```

### 9. Linting Pipeline

Automatisches Linting bei jeder Dateiaeenderung stellt sicher, dass Code-Qualitaetsstandards staendig eingehalten werden. Der erste Befehl nutzt ESLint mit `--fix`, um einfache Probleme automatisch zu beheben. Der zweite Befehl kombiniert mehrere Linter (ESLint, Prettier, JSHint), um eine umfassende Pruefung durchzufuehren. Der dritte Befehl zeigt dieselbe Kombination fuer Python mit ruff, black und mypy. Stell dir vor, du tippst schnell Code und vergisst gelegentlich Semicolons oder verwendest `var` statt `const` -- ESLint mit `--fix` korrigiert diese Probleme automatisch bei jedem Speichern. Bei Python deckt ruff Linting-Violations ab, black formatiert den Code, und mypy prueft die Type-Hints. So erhaeltst du bei jeder Aenderung sofort Feedback zur Code-Qualitaet.

```bash
# ESLint Auto-Fix
fd -e js src/ | entr eslint --fix /_

# Multiple Linters
fd -e js | entr sh -c '
  eslint /_ &&
  prettier --check /_ &&
  jshint /_
'

# Python Linting
fd -e py | entr sh -c '
  ruff check /_ &&
  black --check /_ &&
  mypy /_
'
```

### 10. Multi-Tool Development-Server

Bei Full-Stack-Projekten muessen oft mehrere Prozesse gleichzeitig laufen: Frontend-Server, Backend-Server und Datenbank-Migrationen. Dieses Beispiel startet drei separate entr-Instanzen als Hintergrundprozesse, die jeweils einen Teil des Stacks ueberwachen. Das Frontend wird bei TypeScript-Aenderungen neu gebaut, der Python-Backend-Server bei Code-Aenderungen neu gestartet, und Datenbank-Migrationen werden bei SQL-Aenderungen automatisch ausgefuehrt. Stell dir vor, du arbeitest an einem Feature, das sowohl Frontend- als auch Backend-Aenderungen erfordert -- beide Server reagieren automatisch auf deine Aenderungen, und du kannst dich voll auf den Code konzentrieren. Der `trap`-Befehl am Ende stellt sicher, dass beim Druecken von Ctrl+C alle drei Hintergrundprozesse sauber beendet werden.

```bash
# Full-Stack Watch
{
  fd -e ts frontend/ | entr -r npm run dev:frontend &
  fd -e py backend/ | entr -r python backend/app.py &
  fd -e sql migrations/ | entr -r alembic upgrade head &
  wait
}

# Kill mit Ctrl+C
trap "kill 0" EXIT
```

---

## 🤖 Claude Code Integration

### Workflow 1: Auto-Test bei Code-Aenderungen

Waehrend Claude Code Aenderungen an deinen TypeScript- und React-Dateien vornimmt, laufen in einem separaten Terminal-Pane automatisch die Tests. So siehst du sofort, ob eine von Claude vorgenommene Aenderung bestehende Tests bricht. Der `-c` Flag loescht den Bildschirm vor jedem Durchlauf, damit du eine saubere Uebersicht hast. Stell dir vor, Claude refaktoriert eine Utility-Funktion und vergisst dabei einen Edge-Case -- der automatische Test-Run zeigt dir den Fehler innerhalb von Sekunden, bevor du die Aenderung uebernimmst. Das gibt dir ein Sicherheitsnetz bei der Arbeit mit AI-generiertem Code.

```bash
fd -e ts -e tsx src/ | entr -c npm test
```

### Workflow 2: Auto-Build waehrend Claude Code Session

Wenn Claude Code TypeScript-Dateien generiert oder aendert, prueft dieser Watcher automatisch, ob der Code kompiliert. Build-Fehler wie fehlende Imports, Typ-Inkompatibilitaeten oder Syntaxfehler werden sofort sichtbar. Das ist besonders nuetzlich, weil du so Fehler noch waehrend der Claude-Session erkennen und Claude sofort um eine Korrektur bitten kannst. Stell dir vor, Claude generiert eine neue Komponente mit einem falschen Type -- der Build-Fehler erscheint sofort im anderen Pane, und du kannst Claude darauf hinweisen. Ohne diesen Watcher wuerdest du den Fehler erst bemerken, wenn du manuell einen Build startest.

```bash
fd -e ts src/ | entr -c npm run build
```

### Workflow 3: Lint bei Datei-Aenderung

Dieser Befehl ueberwacht eine spezifische Datei und fuehrt ESLint bei jeder Aenderung aus. Das ist besonders praktisch, wenn Claude Code an einer bestimmten Komponente arbeitet und du sicherstellen willst, dass der generierte Code den Linting-Standards entspricht. Der `/_` Platzhalter wird durch den Namen der geaenderten Datei ersetzt. Stell dir vor, Claude arbeitet an der `App.tsx`-Datei und fuegt neuen Code hinzu -- ESLint prueft sofort, ob der Code den Projekt-Standards entspricht, und zeigt Warnings oder Errors an. So kannst du Code-Qualitaetsprobleme frueh erkennen und beheben lassen.

```bash
echo src/components/App.tsx | entr -c npx eslint /_
```

> 💡 **Tipp**: Starte entr in einem separaten Terminal-Pane waehrend Claude Code arbeitet - so siehst du sofort ob Aenderungen Tests brechen.

---

## Troubleshooting

Loesungen fuer die haeufigsten Probleme beim Einsatz von entr.

### Problem: entr startet nicht

**Symptom**: Pipe in entr zeigt nichts
```bash
fd -e js | entr npm test
# Keine Reaktion
```

**Ursache**: entr benoetigt mindestens eine Datei als Input. Wenn `fd` keine passenden Dateien findet (z.B. leeres Verzeichnis oder falsches Pattern), bleibt entr ohne Reaktion.

**Lösung**: Check Input
```bash
# Verifiziere dass Files gefunden werden
fd -e js
# Sollte Liste zeigen

# Oder mit Debug
fd -e js | tee /dev/tty | entr npm test

# Mindestens 1 File benötigt
echo "dummy.js" | entr echo "Working"
```

---

### Problem: Command wird mehrfach ausgeführt

**Symptom**: Bei einer Änderung läuft Command 3x
```bash
fd -e js | entr npm test
# Test runs 3 times per save
```

**Ursache**: Manche Editoren speichern Dateien in mehreren Schritten (Write → Rename → Delete temporaere Datei), was entr als mehrere Aenderungen erkennt.

**Lösung**: Debounce & Deduplicate
```bash
# Mit Sleep (Debounce)
fd -e js | entr sh -c 'sleep 0.5; npm test'

# Oder nur tracked files (git)
git ls-files '*.js' | entr npm test

# Exclude temp files
fd -e js -E "*.tmp" -E "*.swp" | entr npm test
```

---

### Problem: Restart-Flag (-r) funktioniert nicht

**Symptom**: Server wird nicht neu gestartet
```bash
fd -e py | entr -r python server.py
# Old process bleibt
```

**Ursache**: Der `-r` Flag sendet SIGTERM an den Kindprozess. Wenn der Server SIGTERM ignoriert oder als Hintergrundprozess laeuft, wird er nicht beendet.

**Lösung**: Process-Management
```bash
# Explizit kill
fd -e py | entr sh -c '
  pkill -f "python server.py"
  sleep 1
  python server.py
'

# Oder mit PID-File
fd -e py | entr sh -c '
  if [ -f server.pid ]; then
    kill $(cat server.pid)
  fi
  python server.py & echo $! > server.pid
'
```

---

### Problem: entr findet neue Files nicht

**Symptom**: Neu erstellte Files werden nicht überwacht
```bash
fd -e js | entr npm test
# New file created, but not watched
```

**Ursache**: entr ueberwacht nur die Dateien, die ihm beim Start uebergeben wurden. Neue Dateien werden nicht automatisch erkannt.

**Lösung**: Directory-Watch mit -d
```bash
# Watch Directories (detects new files)
fd -t d src/ | entr -d npm test

# Oder re-scan
while true; do
  fd -e js | entr -n npm test
  sleep 1
done
```

---

### Problem: Performance bei großen Repos

**Symptom**: entr langsam bei >10k Files
```bash
fd | entr npm test
# Dauert lange zum Starten
```

**Ursache**: entr registriert fuer jede uebergebene Datei einen File-System-Watcher. Bei zehntausenden Dateien dauert die Initialisierung entsprechend lange.

**Lösung**: Limitiere Scope
```bash
# Nur relevante Directories
fd -e js src/ test/ | entr npm test

# Exclude node_modules explizit
fd -e js -E node_modules | entr npm test

# Oder git-tracked only
git ls-files '*.js' | entr npm test
```

---

## Vergleich: entr vs. Alternativen

| Feature | entr | nodemon | watchexec | chokidar |
|---------|------|---------|-----------|----------|
| **Language** | C | Node.js | Rust | Node.js |
| **Dependencies** | None | Node | None | Node |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Shell-Native** | ✅ | ❌ | ⚠️ | ❌ |
| **Restart-Mode** | ✅ -r | ✅ Default | ✅ | ⚠️ |
| **Cross-Platform** | ✅ | ✅ | ✅ | ✅ |
| **Config-File** | ❌ | ✅ | ⚠️ | ✅ |
| **Glob-Patterns** | ⚠️ via fd | ✅ | ✅ | ✅ |
| **Debouncing** | ❌ | ✅ | ✅ | ✅ |
| **Philosophy** | Unix | JavaScript | Modern | JavaScript |

### Wann welches Tool?

**entr**:
- Shell-Scripting & Unix-Workflows
- Minimal Dependencies gewünscht
- Composability mit anderen Tools
- Performance-kritisch

**nodemon**:
- Node.js-spezifische Projekte
- Config-File gewünscht
- JavaScript-Ecosystem
- Established Workflows

**watchexec**:
- Moderne Alternative zu entr
- Glob-Patterns benötigt
- Cross-Platform-Consistency
- Rust-Ecosystem

**chokidar**:
- Programmatische Integration
- JavaScript-Library benötigt
- Custom-Watch-Logic
- npm-Package

---

## Links & Ressourcen

### Offizielle Dokumentation
- **Website**: http://eradman.com/entrproject/
- **Man Page**: `man entr`
- **GitHub**: https://github.com/eradman/entr

### Tutorials & Guides
- **entr Cookbook**: http://eradman.com/entrproject/cookbook.html
- **Advanced Usage**: https://jvns.ca/blog/2020/06/28/entr/

### Alternatives
- **nodemon**: https://nodemon.io/
- **watchexec**: https://github.com/watchexec/watchexec
- **chokidar**: https://github.com/paulmillr/chokidar

### Integration
- **fd**: https://github.com/sharkdp/fd
- **ripgrep**: https://github.com/BurntSushi/ripgrep

---

## Pro-Tipps

### 1. Universal Watch-Script

Dieses Script erstellt einen universellen File-Watcher, den du fuer jede Dateiendung und jeden Befehl verwenden kannst. Statt bei jedem Projekt den kompletten entr-Befehl neu zu tippen, gibst du einfach die Dateiendung und den gewuenschten Befehl an. Das Script nutzt `fd` zum Finden der Dateien und den `-c` Flag zum Loeschen des Bildschirms vor jedem Durchlauf. Stell dir vor, du wechselst mehrmals am Tag zwischen JavaScript-, Python- und Rust-Projekten -- statt den entr-Befehl jedes Mal anzupassen, tippst du einfach `watch js "npm test"` oder `watch py "pytest"`. Speichere das Script in `~/bin/watch` und mache es mit `chmod +x` ausfuehrbar, dann ist es in jedem Verzeichnis verfuegbar.

```bash
# ~/bin/watch
#!/bin/bash

# Usage: watch <extension> <command>
# Example: watch js "npm test"

EXT=$1
shift
CMD=$@

fd -e "$EXT" | entr -c sh -c "$CMD"

# Usage: watch js "npm test"
```

### 2. Project-Aware Watcher

Diese Funktion erkennt automatisch den Projekttyp anhand charakteristischer Dateien und startet den passenden Watcher. Bei einem Node.js-Projekt (package.json vorhanden) werden JS/TS-Dateien ueberwacht und npm test ausgefuehrt, bei Rust (Cargo.toml) wird cargo test gestartet, und bei Python (requirements.txt) laeuft pytest. Das spart dir das Nachdenken ueber den richtigen Befehl, wenn du zwischen Projekten wechselst. Stell dir vor, du hast zehn verschiedene Projekte in unterschiedlichen Sprachen -- du tippst einfach `autowatch` und die Funktion erkennt selbststaendig, welcher Watcher gebraucht wird. Fuege die Funktion in deine `.bashrc` oder `.zshrc` ein, damit sie ueberall verfuegbar ist.

```bash
# Auto-detect project type
autowatch() {
  if [[ -f "package.json" ]]; then
    fd -e js -e ts | entr -c npm test
  elif [[ -f "Cargo.toml" ]]; then
    fd -e rs | entr -c cargo test
  elif [[ -f "requirements.txt" ]]; then
    fd -e py | entr -c pytest
  fi
}
```

### 3. Smart Notifications

Dieses Script erweitert den Watch-Workflow um Desktop-Benachrichtigungen mit Zeitmessung. Nach jedem Test-Durchlauf wird nicht nur angezeigt, ob die Tests bestanden haben, sondern auch wie lange sie gedauert haben. Die macOS-Notification (`osascript`) erscheint auch dann, wenn das Terminal im Hintergrund ist, sodass du benachrichtigt wirst, waehrend du im Browser oder in einem anderen Programm arbeitest. Stell dir vor, du startest die Tests und wechselst dann in den Browser, um etwas zu recherchieren -- nach 12 Sekunden poppt eine Benachrichtigung auf: "Passed in 12s". Auf Linux kannst du statt `osascript` den Befehl `notify-send` verwenden. Speichere das Script in `~/bin/watch-notify` und mache es ausfuehrbar.

```bash
# ~/bin/watch-notify
#!/bin/bash

fd -e js | entr sh -c '
  START=$(date +%s)
  if npm test; then
    END=$(date +%s)
    DURATION=$((END - START))
    osascript -e "display notification \"✓ Passed in ${DURATION}s\" with title \"Tests\""
  else
    osascript -e "display notification \"✗ Failed\" with title \"Tests\""
  fi
'
```

### 4. Multi-Window tmux Setup

Dieses Script richtet eine vollstaendige Entwicklungsumgebung in tmux ein, mit separaten Panes fuer Editor, Tests und Linter. Pane 0 oeffnet vim als Editor, Pane 1 ueberwacht JavaScript-Dateien und fuehrt Tests aus, und Pane 2 ueberwacht dieselben Dateien und fuehrt den Linter aus. So hast du alle drei Ansichten gleichzeitig im Blick und siehst sofort, wenn eine Aenderung Tests bricht oder Linting-Fehler erzeugt. Stell dir vor, du oeffnest ein neues Terminal-Fenster und gibst `dev-watch` ein -- sofort hast du eine dreifach geteilte Ansicht mit Editor links und Tests/Linter rechts. Der letzte Befehl setzt den Fokus zurueck auf den Editor-Pane, damit du sofort mit dem Schreiben beginnen kannst. Speichere das Script in `~/bin/dev-watch` und passe die Befehle an dein Projekt an.

```bash
# ~/bin/dev-watch

# Split tmux windows
tmux split-window -h
tmux select-pane -t 0
tmux split-window -v

# Pane 0: Editor
tmux send-keys -t 0 "vim" C-m

# Pane 1: Watch Tests
tmux send-keys -t 1 "fd -e js | entr -c npm test" C-m

# Pane 2: Watch Linter
tmux send-keys -t 2 "fd -e js | entr -c eslint ." C-m

# Select Editor
tmux select-pane -t 0
```

### 5. Git-Integration

Die Kombination von entr mit Git-Befehlen ermoeglicht es, Tests nur fuer tatsaechlich geaenderte Dateien auszufuehren. Der erste Befehl ueberwacht nur gestaged Dateien, der zweite alle Dateien mit uncommitted Changes, und der dritte vergleicht die Dateien des aktuellen Branches mit main. Das ist deutlich effizienter als alle Dateien zu ueberwachen, besonders in grossen Repositories mit tausenden Dateien. Stell dir vor, du hast 5 Dateien geaendert und willst vor dem Commit sicherstellen, dass die Tests fuer genau diese Dateien bestehen -- der erste Befehl ueberwacht nur diese 5 Dateien statt das gesamte Projekt. Der dritte Befehl ist besonders nuetzlich vor dem Erstellen eines Pull Requests, um sicherzustellen, dass alle geaenderten Dateien im aktuellen Branch korrekt funktionieren.

```bash
# Watch nur staged files
git diff --cached --name-only | entr npm test

# Watch files mit uncommitted changes
git status --short | cut -c4- | entr npm test

# Watch files in current branch (vs main)
git diff --name-only main | entr npm test
```

---

## Zusammenfassung

**entr** ist der minimalistische Standard für File-Watching in der Shell:

### Kern-Vorteile:
✅ **Simple**: Eine Aufgabe, perfekt gelöst
✅ **Fast**: Event-based, kein Polling
✅ **Composable**: Pipes mit fd, git, ripgrep
✅ **Reliable**: Battle-tested seit 2012
✅ **Zero-Deps**: Keine Runtime-Dependencies

### Typische Use Cases:
- 🧪 TDD-Workflows (Auto-Test)
- 🔄 Live-Reload Development
- 🏗️ Auto-Build Pipelines
- 📝 Documentation-Generation
- 🔍 Continuous Linting

### Ergänzt perfekt:
- **fd**: Modern File-Finding
- **tmux**: Multi-Pane Development
- **Claude Code**: AI-enhanced Workflows
- **ripgrep**: Content-based Watching

### Nächste Schritte:
1. Installiere entr: `brew install entr`
2. Teste Basic-Watch: `fd -e js | entr npm test`
3. Erstelle Project-Aliases für häufige Patterns
4. Integriere in tmux für Multi-Tool Setup
5. Kombiniere mit Claude Code für AI-Workflows

**Bottom Line**: `entr` ist unverzichtbar für moderne Development-Workflows. Simple, fast, composable - Unix-Philosophy at its best.

---

**Weiter zu**: [20. prettier - Code Formatter](./20-prettier.md)
**Zurück zu**: [18. yq - YAML Processor](./18-yq.md)
**Übersicht**: [Tools & Extensions](../TOOLS-EXTENSIONS-INDEX.md)
