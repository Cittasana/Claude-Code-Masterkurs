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
```bash
# Auto-Review on Save
fd -e ts src/ | entr sh -c '
  git diff /_ | claude "Quick code review of changes"
'
```

#### 3. Documentation Auto-Generation
```bash
# Generate Docs on Code Change
fd -e js src/ | entr sh -c '
  jsdoc src/ -d docs/ &&
  claude "Summarize API changes in docs/" > CHANGELOG.md
'
```

#### 4. Smart Build Pipeline
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
```bash
fd -e ts -e tsx src/ | entr -c npm test
```

### Workflow 2: Auto-Build waehrend Claude Code Session
```bash
fd -e ts src/ | entr -c npm run build
```

### Workflow 3: Lint bei Datei-Aenderung
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
