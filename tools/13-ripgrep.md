# 13. ripgrep (rg) - Blitzschnelle Code-Suche

## Berechtigung

**ripgrep** (Kommando: `rg`) ist ein modernes Such-Tool, das entwickelt wurde, um Code-Basen extrem schnell zu durchsuchen. Es kombiniert die Benutzerfreundlichkeit von `ag` (The Silver Searcher) mit der rohen Geschwindigkeit von `grep`, übertrifft aber beide deutlich.

### Warum ripgrep seine Berechtigung hat:

1. **Geschwindigkeit**: Bis zu 10x schneller als grep/ag durch intelligente Optimierungen
2. **Smart Defaults**: Respektiert `.gitignore` automatisch, ignoriert Binärdateien
3. **Unicode-Support**: Vollständige UTF-8 Unterstützung out-of-the-box
4. **Regex-Engine**: Verwendet Rust's `regex` Crate für sichere und schnelle Pattern-Matching
5. **Große Codebasen**: Durchsucht millionen von Zeilen Code in Sekunden
6. **Developer-First**: Entwickelt von einem Entwickler für Entwickler

### Statistiken:
- **Performance**: Durchsucht Linux Kernel (20M Zeilen) in <2 Sekunden
- **Popularität**: 47k+ GitHub Stars, 1M+ Downloads/Monat
- **Adoption**: Standard in VS Code, verwendet von Rust Foundation

---

> 🚀 **Claude Code Relevanz**: ripgrep ist das Rueckgrat der Code-Suche in Claude Code Workflows -- mit blitzschneller Pattern-Suche findest du alle relevanten Stellen vor einem Refactoring und kannst Claude Code gezielt auf bestimmte Code-Bereiche ansetzen.

## Zwecke

ripgrep deckt alle typischen Such-Szenarien in der Software-Entwicklung ab -- von einfacher Code-Suche bis hin zu komplexen Security-Audits.

### Haupteinsatzgebiete:

1. **Code-Suche**
   - Funktionsdefinitionen finden
   - Variable/Klassen-Referenzen
   - TODO/FIXME-Kommentare
   - Import-Statements analysieren

2. **Refactoring**
   - Alle Vorkommen eines Identifiers
   - Breaking Changes identifizieren
   - Deprecated Code finden
   - API-Verwendung auditieren

3. **Debugging**
   - Error-Messages tracken
   - Log-Statements lokalisieren
   - Konfigurationswerte suchen
   - Stack-Traces analysieren

4. **Code-Review**
   - Sicherheitsmuster (API-Keys, Secrets)
   - Code-Smells identifizieren
   - Konsistenz-Checks
   - Lizenz-Header verifizieren

5. **Dokumentation**
   - README-Files durchsuchen
   - Kommentare extrahieren
   - Beispiele finden
   - Changelog-Einträge

---

## Verwendung

Von der Installation ueber grundlegende Suchbefehle bis hin zu Regex-Patterns und Output-Formaten -- hier lernst du ripgrep effektiv einzusetzen.

### Installation

Waehle den passenden Installationsweg fuer dein System:

#### macOS (Homebrew)
Die einfachste Installation auf macOS. Homebrew laedt die vorkompilierte Binary herunter und verlinkt sie in den PATH. Nach der Installation ist der Befehl `rg` sofort verfuegbar. Homebrew kuemmert sich auch um spaetere Updates mit `brew upgrade ripgrep`. Pruefe nach der Installation die Version mit `rg --version`, um sicherzustellen, dass alles korrekt eingerichtet ist.
```bash
brew install ripgrep
```

#### Ubuntu/Debian
Auf Debian-basierten Systemen ist ripgrep in den Standard-Repositories ab Ubuntu 18.10 verfuegbar. Der apt-Paketmanager installiert alle Abhaengigkeiten automatisch. Beachte, dass die Repository-Version manchmal etwas aelter sein kann als die aktuelle GitHub-Release. Wenn du die neueste Version brauchst, installiere ueber cargo oder lade die Binary direkt von GitHub Releases herunter. Nach der Installation steht der Befehl `rg` systemweit zur Verfuegung.
```bash
apt-get install ripgrep
```

#### Arch Linux
Arch Linux liefert dank Rolling-Release in der Regel die aktuellste Version von ripgrep. Der Befehl installiert das Paket zusammen mit allen Abhaengigkeiten in einem Schritt. Bei Arch ist ripgrep besonders beliebt, da viele Arch-Nutzer Rust-basierte Tools bevorzugen. Nach der Installation ist `rg` sofort einsatzbereit und kann mit `pacman -Syu` auf dem neuesten Stand gehalten werden.
```bash
pacman -S ripgrep
```

#### Rust (plattformunabhängig)
Wenn du bereits eine Rust-Toolchain (cargo) installiert hast, ist die Installation ueber cargo der plattformunabhaengigste Weg. Cargo kompiliert ripgrep aus dem Quellcode, was auf den meisten Systemen einige Minuten dauert. Der Vorteil ist, dass du immer die allerneueste Version bekommst. Beachte, dass das Binary unter `~/.cargo/bin/` installiert wird und dieser Pfad in deiner PATH-Variable enthalten sein muss.
```bash
cargo install ripgrep
```

#### Binaries
Lade von [GitHub Releases](https://github.com/BurntSushi/ripgrep/releases)

> 💡 **Tipp**: Nach der Installation setze `export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"` und erstelle eine Config-Datei mit Smart Defaults wie `--smart-case` und `--hidden` fuer sofortige Produktivitaetssteigerung.

### Verifizierung
Pruefe nach der Installation, ob ripgrep korrekt installiert wurde:
```bash
rg --version
# Output: ripgrep 14.1.0

which rg
# Output: /usr/local/bin/rg
```

---

### Quick Start

Die Grundbefehle decken die meisten taeglichen Such-Szenarien ab -- von einfacher Textsuche bis hin zu File-Type-Filtern.

#### Basis-Suche
ripgrep durchsucht standardmaessig alle Dateien rekursiv, respektiert .gitignore und zeigt Treffer mit Zeilennummern an:
```bash
# Einfache Suche im aktuellen Verzeichnis
rg "function"

# Case-insensitive Suche
rg -i "TODO"

# Nur Dateinamen anzeigen (wie grep -l)
rg -l "import React"

# Mit Zeilennummern (Standard)
rg "class Component"

# Ohne Zeilennummern
rg -N "const API_KEY"
```

#### File-Type Filtering
Mit dem `-t` Flag beschraenkst du die Suche auf bestimmte Dateitypen -- viel schneller als manuelles Filtern:
```bash
# Nur JavaScript/TypeScript
rg "useState" -t js -t ts

# Alle verfügbaren Typen anzeigen
rg --type-list

# Nur Python-Files
rg "def calculate" -t py

# Mehrere File-Types
rg "API" -t js -t json -t yaml
```

#### Context Lines
Context-Zeilen zeigen den umgebenden Code eines Treffers an, was das Verstaendnis der Fundstelle deutlich verbessert:
```bash
# 3 Zeilen Context vor/nach Match
rg -C 3 "error"

# 2 Zeilen vor Match
rg -B 2 "import"

# 5 Zeilen nach Match
rg -A 5 "function handle"
```

---

### Advanced Usage

Fortgeschrittene Techniken wie Regex-Patterns, Exclusions und Performance-Tuning fuer grosse Codebasen.

#### Regex Patterns
ripgrep unterstuetzt die volle Rust-Regex-Syntax -- von Word-Boundaries ueber Capture Groups bis zu Lookaheads:
```bash
# Word-Boundary für exakte Matches
rg "\buser\b"

# Mehrere Patterns (OR)
rg "TODO|FIXME|HACK"

# Negatives Lookahead (nicht gefolgt von)
rg "console\.log(?!.*//.*debug)"

# Capture Groups
rg "import\s+(\w+)\s+from" --replace '$1'

# Case-insensitive Regex Flag
rg "(?i)error"
```

> 🚀 **Beispiel**: Vor einem Refactoring mit Claude Code kannst du mit `rg "\bgetUserData\b" -t js -t ts --count` sofort sehen, in wie vielen Dateien eine Funktion verwendet wird -- so weisst du genau, welchen Scope die Aenderung hat.

#### Exclusions & Filtering
Mit Glob-Patterns kontrollierst du praezise, welche Dateien und Verzeichnisse durchsucht werden:
```bash
# Bestimmte Files ignorieren
rg "function" -g '!*.test.js'

# Bestimmte Directories ignorieren
rg "API_KEY" -g '!node_modules/*' -g '!dist/*'

# Nur in spezifischen Files
rg "import" -g '*.tsx'

# .gitignore respektieren (Standard)
rg "secret"

# .gitignore NICHT respektieren
rg "secret" --no-ignore

# Hidden Files durchsuchen
rg "config" --hidden
```

#### Output-Formate
Verschiedene Ausgabeformate fuer unterschiedliche Anwendungsfaelle -- von kompakten Dateilisten bis zu maschinenlesbarem JSON:
```bash
# Nur Matches, keine File-Namen
rg "error" --no-filename

# Nur File-Namen mit Matches
rg "TODO" --files-with-matches

# Count Matches pro File
rg "function" --count

# JSON Output für Scripting
rg "import" --json

# Null-separated Output
rg "test" --null
```

#### Replace (Dry-Run)
ripgrep kann Ersetzungen als Vorschau anzeigen, ohne Dateien tatsaechlich zu aendern -- perfekt fuer Refactoring-Planung:
```bash
# Replace Preview
rg "old_function" --replace "new_function"

# Mit Capture Groups
rg "v(\d+)\.(\d+)" --replace 'Version $1.$2'

# Case-preserving Replace
rg "(?i)(todo)" --replace 'DONE'
```

#### Performance Tuning

Bei sehr grossen Codebasen mit Hunderttausenden von Dateien kann auch ripgrep merklich langsamer werden. Diese Optionen helfen, die Suche zu optimieren, indem du die Suchtiefe begrenzt, das Threading anpasst und Memory-Mapping fuer grosse Dateien steuerst. Stell dir vor, du durchsuchst ein Monorepo mit 50 Unterprojekten, brauchst aber nur Ergebnisse aus den ersten drei Verzeichnisebenen. Mit `--max-depth 3` wird die Suche deutlich schneller, weil tief verschachtelte node_modules und Build-Verzeichnisse uebersprungen werden. Der `--threads`-Parameter ist nuetzlich, wenn du die CPU-Last auf CI-Servern kontrollieren musst.

```bash
# Max-Depth limitieren
rg "import" --max-depth 3

# Max-Columns (für sehr lange Zeilen)
rg "config" --max-columns 500

# Threading kontrollieren
rg "function" --threads 4

# Memory-Map deaktivieren (für große Files)
rg "data" --no-mmap
```

---

### Integration in Claude Code Workflows

#### 1. Code-Analyse vor Änderungen

Bevor du Claude Code mit einem Refactoring beauftragst, solltest du wissen, wie weit die Aenderung reicht. Dieser Befehl findet alle Dateien, die eine bestimmte Funktion referenzieren, und zaehlt die Vorkommen pro Datei. Das gibt dir ein klares Bild vom Scope der Aenderung. Stell dir vor, du willst die Funktion `getUserData` umbenennen -- mit diesem Befehl siehst du sofort, ob 3 oder 30 Dateien betroffen sind. Basierend auf dieser Information kannst du Claude Code gezielt anweisen, alle Vorkommen zu aktualisieren. Das Ergebnis ist ein sicheres Refactoring ohne vergessene Referenzen.

```bash
# Alle Verwendungen einer Funktion finden
echo "Suche alle Referenzen zu 'getUserData':"
rg "\bgetUserData\b" -t js -t ts --count

# Dann mit Claude Code refactoren
# claude "Refactor getUserData to use async/await pattern"
```

#### 2. Security Audit

Hardcodierte Secrets wie API-Keys, Passwoerter und Tokens sind eines der haeufigsten Sicherheitsrisiken in Codebases. Dieser Befehl durchsucht dein gesamtes Projekt nach verdaechtigen Patterns und schliesst dabei Dokumentations- und Beispieldateien aus, die False Positives erzeugen wuerden. Stell dir vor, du uebernimmst ein neues Projekt und willst sicherstellen, dass keine Secrets im Code stecken -- dieser Befehl findet sie in Sekunden. Die Ergebnisse kannst du direkt an Claude Code weiterleiten, der die gefundenen Stellen analysiert und Loesungen vorschlaegt (z.B. Umstellung auf Umgebungsvariablen). Fuehre diesen Check regelmaessig aus, idealerweise als Pre-Commit-Hook.

```bash
# Potenzielle Secrets finden
rg -i "api[_-]?key|secret|password|token" \
   --type-not md \
   --type-not txt \
   -g '!*.example.*'

# Output an Claude zur Analyse
rg "TODO.*security" --json | claude "Analyse security TODOs"
```

#### 3. Dependency Audit

Wenn du eine Abhaengigkeit upgraden oder ersetzen willst, musst du zuerst wissen, wo und wie sie verwendet wird. Dieser Befehl findet alle Import-Statements einer bestimmten Library und zaehlt die Vorkommen pro Datei. Stell dir vor, du willst von der alten `ReactDOM.render`-API auf React 18 migrieren -- mit ripgrep findest du alle betroffenen Stellen und kannst Claude Code gezielt mit der Migration beauftragen. Der zweite Befehl mit `-C 2` zeigt den Kontext um jeden Treffer, sodass Claude Code den Code im Zusammenhang verstehen kann. Das Ergebnis ist eine vollstaendige Migrationsstrategie basierend auf tatsaechlicher Code-Nutzung.

```bash
# Alle Imports eines Packages finden
rg "from ['\"]react['\"]" -t js -t tsx --count

# Deprecated API-Calls finden
rg "ReactDOM\.render" -C 2 | claude "Suggest React 18 migration"
```

#### 4. Documentation Generator

ripgrep kann JSDoc-Kommentare und README-Headings extrahieren und als Eingabe fuer Claude Code nutzen, um automatisch Dokumentation zu generieren. Der erste Befehl findet alle JSDoc-Bloecke (erkennbar an `/**`) und zeigt die naechsten 10 Zeilen nach jedem Treffer. Der zweite Befehl extrahiert alle Markdown-Headings aus der README. Stell dir vor, du hast ein Projekt mit 50 Funktionen, die zwar JSDoc-Kommentare haben, aber keine zusammenhaengende API-Dokumentation -- Claude Code kann aus den extrahierten Kommentaren eine vollstaendige Dokumentation erstellen. Das spart Stunden manueller Dokumentationsarbeit.

```bash
# Alle JSDoc-Kommentare extrahieren
rg "/\*\*" -A 10 -t js | claude "Generate API documentation"

# README-Sections finden
rg "^## " README.md | claude "Create table of contents"
```

---

## Best Practices

Bewaehrte Konfigurationen und Integrationen fuer maximale Produktivitaet mit ripgrep.

### 1. Aliase einrichten

Diese Aliase decken die haeufigsten Suchmuster ab und sparen dir das wiederholte Tippen von Flags:

```bash
# ~/.bashrc oder ~/.zshrc
alias rg='rg --smart-case --sort path'
alias rgf='rg --files-with-matches'
alias rgc='rg --count --sort count'
alias rgi='rg --no-ignore --hidden'
alias rgt='rg --type-list'
```

### 2. Ripgreprc Config

Eine Config-Datei setzt intelligente Defaults, die bei jedem Aufruf automatisch geladen werden -- `--smart-case` allein spart enorm viel Tipparbeit:

```bash
# ~/.ripgreprc oder $RIPGREP_CONFIG_PATH
--max-columns=500
--max-columns-preview
--smart-case
--colors=path:fg:green
--colors=line:fg:yellow
--colors=match:fg:red
--colors=match:style:bold
```

Aktivierung:
```bash
export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"
```

> ⚠️ **Warnung**: Achte bei Security-Audits mit ripgrep darauf, dass du `--no-ignore` verwendest, wenn du auch in `.gitignore`-ignorierten Dateien nach Secrets suchen willst -- standardmaessig respektiert rg die .gitignore.

### 3. Kombiniere mit anderen Tools

ripgrep entfaltet seine volle Staerke in Kombination mit fzf, xargs und jq:

```bash
# Mit fzf für interaktive Suche
rg --files | fzf --preview 'rg --color=always --context 10 "function" {}'

# Mit xargs für Batch-Operations
rg -l "old_api" | xargs sed -i 's/old_api/new_api/g'

# Mit jq für JSON-Parsing
rg "error" --json | jq -r '.data.lines.text'
```

### 4. Performance-Optimierungen

Bei sehr grossen Repositories mit ueber 10.000 Dateien kannst du mit diesen Einstellungen die Suchgeschwindigkeit deutlich verbessern. Die Tiefenbegrenzung verhindert das Durchsuchen tief verschachtelter Verzeichnisse wie node_modules. Memory-Mapping kann bei einzelnen sehr grossen Dateien (z.B. Logfiles) die Performance verbessern, da der Kernel das Lesen optimiert. Die Thread-Anzahl sollte der Anzahl deiner CPU-Kerne entsprechen. Stell dir vor, du durchsuchst ein Monorepo mit 100k Dateien -- mit `--max-depth 5` und korrektem Threading kann die Suche von 10 auf 2 Sekunden sinken.

```bash
# Große Codebasen: Limitiere Depth
rg "import" --max-depth 5

# Sehr große Files: Nutze --mmap
rg "data" --mmap

# Parallelisierung maximieren
rg "function" --threads $(nproc)
```

### 5. Sicherheit

Security-Scans mit ripgrep sind ein schneller erster Schritt, um potenzielle Secrets in deiner Codebase zu finden. Der Befehl sucht nach typischen Patterns wie "password", "secret" und "key", schliesst aber Markdown-Dokumentation und Beispieldateien aus, die viele False Positives erzeugen wuerden. Stell dir vor, ein neuer Entwickler hat versehentlich einen API-Key hardcodiert -- dieser Scan findet es, bevor der Code committed wird. Der zweite Befehl filtert zusaetzlich Test- und Docs-Verzeichnisse heraus, da dort oft Platzhalter-Secrets stehen. Integriere diesen Check als Pre-Commit-Hook, um Secrets automatisch vor dem Commit abzufangen.

```bash
# Secrets finden (aber nie committen!)
rg -i "password|secret|key" \
   --type-not md \
   --glob '!*.example' \
   --glob '!*.sample'

# False Positives filtern
rg "API_KEY" --glob '!test/*' --glob '!docs/*'
```

---

## Beispiele

### 1. React Codebase: Hook-Usage analysieren

In React-Projekten ist es wichtig zu wissen, welche Komponenten wie viele State-Hooks verwenden -- zu viele useState-Aufrufe in einer Komponente deuten darauf hin, dass useReducer besser geeignet waere. Dieser Befehl findet alle useState-Aufrufe mit generischem Typ-Parameter in TSX-Dateien, zaehlt sie pro Datei und sortiert nach Haeufigkeit. Stell dir vor, du willst die State-Management-Strategie deines Projekts verbessern -- die Dateien mit den meisten useState-Aufrufen sind die besten Kandidaten fuer ein Refactoring zu useReducer oder zustand. Der letzte Befehl uebergibt die Ergebnisse direkt an Claude Code fuer eine automatisierte Analyse. So bekommst du konkrete Optimierungsvorschlaege basierend auf deinem tatsaechlichen Code.

```bash
# Alle useState Calls finden
rg "useState\s*<" -t tsx --count --sort count

# Beispiel Output:
# src/components/Dashboard.tsx:12
# src/pages/Profile.tsx:8
# src/hooks/useAuth.tsx:5

# Mit Context für Details
rg "useState" -t tsx -C 1 | head -20

# An Claude für Optimization-Vorschläge
rg "useState" -t tsx -A 3 | \
  claude "Identify useState patterns that could be useReducer"
```

### 2. Node.js: Deprecated Dependencies finden

Veraltete Dependencies sind ein haeufiges Sicherheitsrisiko und koennen zu Kompatibilitaetsproblemen fuehren. Dieser Befehl sucht nach dem veralteten `request`-Paket, das seit 2020 nicht mehr gewartet wird und durch axios oder node-fetch ersetzt werden sollte. Der erste Befehl findet alle Dateien, die `request` importieren, der zweite listet nur die Dateinamen, und der dritte erstellt einen strukturierten Migrationsreport. Stell dir vor, du uebernimmst ein aelteres Node.js-Projekt und willst wissen, welche veralteten Pakete noch verwendet werden -- mit ripgrep hast du in Sekunden eine vollstaendige Liste. Der JSON-Output und jq erzeugen eine sortierte, deduplizierte TODO-Liste fuer die Migration.

```bash
# Suche nach veralteten Packages
rg "request\(" -t js -g '!node_modules/*'

# Mit File-Namen und Counts
rg "require\(['\"]request['\"]\)" -t js --files-with-matches

# Erstelle Migration-Report
rg "require\(['\"]request['\"]\)" --json | \
  jq -r '.data.path.text' | \
  sort -u | \
  xargs -I {} echo "TODO: Migrate {} to axios"
```

### 3. Python: Type-Hint Coverage

Type Hints verbessern die Code-Qualitaet und ermoglichen bessere IDE-Unterstuetzung, sind in aelteren Python-Codebases aber oft nicht vorhanden. Diese Befehle analysieren, wie viele Funktionen Type Hints haben und wie viele noch fehlen. Der erste Befehl zaehlt Funktionsdefinitionen ohne Parameter-Typ-Annotationen, der zweite findet Funktionen ohne Return-Type, und der dritte generiert eine TODO-Liste. Stell dir vor, dein Team hat beschlossen, schrittweise Type Hints einzufuehren -- mit diesen Befehlen siehst du sofort den aktuellen Status und kannst den Fortschritt ueber die Zeit verfolgen. Der Replace-Befehl erzeugt eine Datei mit konkreten TODO-Eintraegen fuer jede Funktion.

```bash
# Funktionen ohne Type-Hints finden
rg "def \w+\([^)]*\):" -t py | \
  rg -v "def \w+\([^)]*:\s*\w+" | \
  wc -l

# Beispiel für fehlende Return-Types
rg "def \w+\([^)]*\):" -t py -C 1 | \
  rg -v "->" | \
  head -20

# Generiere Type-Hint TODOs
rg "def (\w+)\(" -t py --replace 'TODO: Add types to $1' > type_todos.txt
```

### 4. Configuration Audit

Ein Configuration Audit deckt potenzielle Probleme in Konfigurationsdateien auf: Hardcodierte Produktions-URLs, umgebungsspezifische Einstellungen und fehlende Abstraktionen. Der erste Befehl findet alle Config-Dateien, die das Wort "production" enthalten, der zweite analysiert umgebungsspezifischen Code, und der dritte extrahiert alle hardcodierten URLs. Stell dir vor, du willst sicherstellen, dass keine Produktions-Credentials in der Development-Konfiguration stecken -- dieser Audit zeigt dir alle verdaechtigen Stellen. Besonders der dritte Befehl mit `-o` (only matching) extrahiert ausschliesslich die URLs, sortiert und dedupliziert sie fuer einen schnellen Ueberblick.

```bash
# Alle Config-Files mit "production" Setting
rg "production" -g '*.{json,yaml,yml,toml,ini,env}'

# Environment-spezifische Configs
rg "NODE_ENV" -t js -C 2 | \
  claude "List all environment-specific code paths"

# Finde hardcoded URLs
rg "https?://[a-zA-Z0-9.-]+" \
   --type-not md \
   --type-not txt \
   -o | sort -u
```

> 💡 **Tipp**: Nutze `rg "TODO|FIXME|HACK" --json | jq` fuer maschinenlesbare Ausgabe -- perfekt fuer die Integration in CI/CD-Pipelines oder automatisierte Code-Quality-Reports.

### 5. Code Quality: TODO/FIXME Tracking

Technische Schulden in Form von TODO-, FIXME- und HACK-Kommentaren sammeln sich in jedem Projekt an und sollten regelmaessig aufgeraeumt werden. Diese Befehle geben dir einen strukturierten Ueberblick: der erste zeigt alle Kommentare mit Kontext, der zweite zaehlt nach Typ, und der dritte ordnet jedem TODO den verantwortlichen Autor zu per git blame. Stell dir vor, du bereitest einen Sprint vor und willst die angesammelten TODOs priorisieren -- die Kombination aus ripgrep und git blame zeigt dir nicht nur was zu tun ist, sondern auch wer den TODO geschrieben hat. Der letzte Befehl generiert eine Issue-Liste im Markdown-Format, die du direkt in dein Tracking-Tool importieren kannst.

```bash
# Alle TODOs mit Context
rg "TODO|FIXME|HACK|XXX" -C 1 --no-heading

# Group by Type
rg "TODO" --count --sort count
rg "FIXME" --count --sort count

# Mit Autoren (wenn Git vorhanden)
rg -l "TODO" | while read file; do
  echo "=== $file ==="
  git blame -L $(rg -n "TODO" "$file" | cut -d: -f1),+1 "$file"
done

# Generiere Issue-Liste
rg "TODO: (.+)" --replace 'GitHub Issue: $1' > todos.md
```

### 6. Security: Secrets Scanning

```bash
# Multi-Pattern für Secrets
rg -e "api[_-]?key" \
   -e "secret" \
   -e "password\s*=" \
   -e "token\s*:" \
   -e "Bearer\s+" \
   --type-not md \
   -i

# Nur in Non-Test Files
rg "SECRET|PASSWORD" \
   --glob '!*test*' \
   --glob '!*spec*' \
   --glob '!*.example' \
   --iglob '*.{js,py,go,java}'

# Mit Line Numbers für Quick-Fix
rg "password\s*=\s*['\"][^'\"]+['\"]" -n
```

### 7. Dokumentations-Extraktion

```bash
# Alle Markdown-Headings extrahieren
rg "^#{1,6}\s+" -t md --no-filename | sort

# JSDoc-Kommentare sammeln
rg "/\*\*" -A 20 -t js | \
  rg "^\s*\*\s*@\w+" | \
  sort | uniq -c

# README-Strukturen vergleichen
for readme in **/README.md; do
  echo "=== $readme ==="
  rg "^## " "$readme" --no-line-number
done
```

### 8. Refactoring: Rename Preview

```bash
# Trockenlauf für Umbenennung
OLD="UserService"
NEW="UserRepository"

echo "Preview: $OLD -> $NEW"
rg "\b$OLD\b" --count --sort path

# Zeige alle Änderungen
rg "\b$OLD\b" --replace "$NEW" -C 1

# Mit sed ausführen (VORSICHT!)
# rg -l "\b$OLD\b" | xargs sed -i '' "s/\b$OLD\b/$NEW/g"
```

### 9. Performance: Large File Handling

```bash
# Große JSON-Files durchsuchen
rg "\"error\":" large-logs.json --mmap

# Nur erste 1000 Matches
rg "function" --max-count 1000

# Mit Stats
rg "import" --stats

# Output:
# 1523 matches
# 243 matched lines
# 89 files contained matches
# 1234 files searched
# 0.12s elapsed
```

### 10. CI/CD Integration

```bash
#!/bin/bash
# check-secrets.sh - Pre-commit Hook

SECRETS=$(rg -i "api[_-]?key|secret|password" \
             --type-not md \
             --glob '!*.example' \
             --files-with-matches)

if [ -n "$SECRETS" ]; then
  echo "❌ ERROR: Potential secrets found:"
  echo "$SECRETS"
  echo ""
  echo "Run: rg -i 'api[_-]?key|secret|password' to see details"
  exit 1
fi

echo "✅ No secrets detected"
exit 0
```

---

## 🤖 Claude Code Integration

### Workflow 1: Codebase durchsuchen vor Refactoring

Bevor du Claude Code eine Funktion umbenennen oder refactoren laesst, zeigt dir dieser Befehl alle Dateien, die die Funktion verwenden. Das `-l` Flag listet nur Dateinamen ohne die Treffer selbst, was dir einen schnellen Ueberblick ueber den Scope gibt. Stell dir vor, du willst `getUserById` durch `fetchUserById` ersetzen -- zuerst siehst du mit diesem Befehl, welche 12 Dateien betroffen sind, dann beauftragst du Claude Code mit dem Rename. So vermeidest du vergessene Referenzen und kaputte Imports.

```bash
# Alle Verwendungen einer Funktion finden
rg "getUserById" --type ts -l
```

### Workflow 2: TODO-Kommentare sammeln

Dieser Befehl findet alle TODO-, FIXME- und HACK-Kommentare in deinen Source-Dateien und zeigt Statistiken dazu an. Das `--type-add` Flag definiert einen benutzerdefinierten Dateityp "src", der alle gaengigen JavaScript/TypeScript-Dateien umfasst. Stell dir vor, du willst am Ende eines Sprints alle offenen TODOs aufarbeiten -- dieser Befehl gibt dir eine sofortige Uebersicht mit Gesamtzahl und betroffenen Dateien. Die Ergebnisse kannst du an Claude Code weiterleiten, der die TODOs priorisiert und Loesungsvorschlaege macht.

```bash
rg "TODO|FIXME|HACK" --type-add 'src:*.{ts,tsx,js,jsx}' -t src --stats
```

### Workflow 3: Import-Analyse

Dieser Befehl analysiert die internen Import-Strukturen deines TypeScript-Projekts, indem er alle relativen Imports zaehlt und nach Haeufigkeit sortiert. Die Dateien mit den meisten Imports sind oft zentrale Module, die bei Refactorings besondere Aufmerksamkeit benoetigen. Stell dir vor, du willst herausfinden, welche Dateien am staerksten vernetzt sind -- die Top-20-Liste zeigt dir die "Hub"-Dateien deines Projekts. Diese Information hilft Claude Code, die Projektstruktur zu verstehen und bei Refactorings die richtigen Prioritaeten zu setzen.

```bash
rg "from ['\"]\./" --type ts -c | sort -t: -k2 -rn | head -20
```

> 💡 **Tipp**: Claude Code nutzt ripgrep intern fuer Codebase-Suchen - kenne die Syntax, um gezielte Anfragen zu stellen.

---

## Troubleshooting

Typische Probleme bei der Nutzung von ripgrep und deren Loesungen -- von zu vielen Treffern bis zu Performance-Problemen.

### Problem: ripgrep findet zu viel

Generische Suchbegriffe ohne Word-Boundaries oder File-Type-Filter erzeugen eine Flut von irrelevanten Treffern.

**Symptom**: Tausende von irrelevanten Matches
```bash
rg "data"  # 10000+ results
```

**Lösung**: Smart Filtering
```bash
# Word-Boundary für exakte Matches
rg "\bdata\b"

# Kombiniere mit File-Types
rg "\bdata\b" -t js -t py

# Exclude node_modules explizit
rg "data" -g '!node_modules/*' -g '!dist/*'
```

---

### Problem: .gitignore wird ignoriert

Wenn du dich nicht in einem Git-Repository befindest oder die .gitignore fehlt, wendet ripgrep keine Ignore-Regeln an.

**Symptom**: ripgrep durchsucht ignorierte Directories
```bash
rg "function" # durchsucht node_modules
```

**Lösung**: Respektiere .gitignore (sollte Standard sein)
```bash
# Check ob .gitignore existiert
ls -la .gitignore

# Explizit .gitignore beachten
rg "function" --no-ignore=false

# Oder Global Gitignore
rg "function" --ignore-file ~/.gitignore_global
```

---

### Problem: Binary Files werden durchsucht

In seltenen Faellen erkennt ripgrep bestimmte Binaerdateien nicht automatisch als solche und gibt deren Inhalt aus.

**Symptom**: Unleserliche Output von Binärdateien
```bash
rg "test" # zeigt Binary-Gibberish
```

**Lösung**: Binaries ausschließen (sollte automatisch sein)
```bash
# Explizit Text-Only
rg "test" --text=false

# Oder File-Types spezifizieren
rg "test" -t js -t py -t md

# Check welche Files matched haben
rg "test" --files-with-matches | file -
```

---

### Problem: Regex funktioniert nicht

ripgrep nutzt Rusts Regex-Engine, die sich leicht von PCRE unterscheidet. Bestimmte Konstrukte funktionieren anders als erwartet.

**Symptom**: Pattern matched nicht wie erwartet
```bash
rg "user\d+"  # findet nichts
```

**Lösung**: Escape und Syntax
```bash
# Stelle sicher dass Regex-Engine aktiviert ist (Standard)
rg "user\d+" --engine=auto

# Oder Fixed-Strings für Literale
rg -F "user\d+"

# Test Regex separat
echo "user123" | rg "user\d+"

# Debug-Mode
rg "user\d+" --debug
```

---

### Problem: Performance bei sehr großen Repos

Bei sehr grossen Codebases kann ripgrep langsam werden, wenn es jede Datei in jedem Unterverzeichnis durchsuchen muss.

**Symptom**: ripgrep langsam bei >1GB Codebase
```bash
rg "function"  # dauert >10 Sekunden
```

**Lösung**: Optimierungen
```bash
# Limitiere Search-Depth
rg "function" --max-depth 4

# Nutze --mmap für große Files
rg "function" --mmap

# Parallelisierung erhöhen
rg "function" --threads 8

# Nur relevante Directories
rg "function" src/ app/ lib/
```

---

### Problem: Unicode/Encoding Issues

Dateien, die nicht in UTF-8 kodiert sind (z.B. ISO-8859-1 oder Windows-1252), werden von ripgrep falsch dargestellt.

**Symptom**: Weird characters in Output
```bash
rg "función"  # zeigt falsch an
```

**Lösung**: Encoding korrekt setzen
```bash
# Check File-Encoding
file -i src/app.js

# Force UTF-8
rg "función" --encoding utf8

# Oder disable Unicode
rg "funcion" --no-unicode

# iconv zur Konvertierung
iconv -f ISO-8859-1 -t UTF-8 file.txt | rg "função"
```

---

## Vergleich: ripgrep vs. Alternativen

| Feature | ripgrep | grep | ag (Silver Searcher) | ack |
|---------|---------|------|----------------------|-----|
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Smart Defaults** | ✅ .gitignore | ❌ | ✅ .gitignore | ✅ .ackrc |
| **Unicode** | ✅ Full Support | ⚠️ Partial | ✅ Full Support | ✅ |
| **Regex Engine** | Rust `regex` | PCRE/Basic | PCRE | Perl |
| **Multi-Threading** | ✅ Auto | ❌ | ✅ | ❌ |
| **Memory Usage** | Niedrig | Sehr Niedrig | Mittel | Mittel |
| **Color Output** | ✅ Auto | ⚠️ --color | ✅ Auto | ✅ Auto |
| **JSON Output** | ✅ | ❌ | ❌ | ❌ |
| **Windows Support** | ✅ | ⚠️ via Git Bash | ✅ | ✅ |
| **Maintenance** | ✅ Aktiv | ✅ Standard | ⚠️ Weniger | ⚠️ Weniger |

### Wann welches Tool?

**Ripgrep (rg)**:
- Default für moderne Entwicklung
- Große Codebasen (>10k Files)
- CI/CD Pipelines
- Scriptable Workflows (JSON Output)

**grep**:
- System-Administration (immer verfügbar)
- Simple One-Liner
- POSIX-Compliance erforderlich
- Embedded Systems

**ag**:
- Legacy-Projekte die ag bereits nutzen
- Wenn ripgrep nicht verfügbar
- Ähnliche Feature-Set zu rg

**ack**:
- Perl-basierte Workflows
- Wenn nur Perl verfügbar
- Legacy-Compat

---

## Links & Ressourcen

### Offizielle Dokumentation
- **GitHub Repository**: https://github.com/BurntSushi/ripgrep
- **User Guide**: https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md
- **FAQ**: https://github.com/BurntSushi/ripgrep/blob/master/FAQ.md
- **Regex Syntax**: https://docs.rs/regex/latest/regex/#syntax

### Tutorials & Guides
- **ripgrep Quickstart**: https://blog.burntsushi.net/ripgrep/
- **Advanced ripgrep**: https://mariusschulz.com/blog/fast-searching-with-ripgrep
- **ripgrep vs grep**: https://beyondgrep.com/feature-comparison/

### Integration
- **VS Code Integration**: ripgrep ist default search engine
- **Vim/Neovim**: https://github.com/jremmen/vim-ripgrep
- **Emacs**: https://github.com/dajva/rg.el
- **Sublime Text**: Built-in via "Find in Files"

### Cheat Sheets
- **tldr ripgrep**: `tldr rg`
- **Cheat.sh**: `curl cheat.sh/rg`
- **DevHints**: https://devhints.io/ripgrep

---

## Pro-Tipps

### 1. ripgrep als Standard-Search

ripgrep kann als Standard-Suche fuer mehrere Tools gleichzeitig eingesetzt werden: als FZF_DEFAULT_COMMAND fuer schnelle Datei-Auflistung, als Suchmaschine in VS Code und als grepprg in Neovim. Diese Konfigurationen sorgen dafuer, dass du ueberall dieselbe schnelle, .gitignore-respektierende Suche nutzt. Stell dir vor, du nutzt `Ctrl+T` in fzf, suchst in VS Code und greifst in Neovim -- ueberall arbeitet ripgrep im Hintergrund. Fuer Neovim ist besonders das `--vimgrep` Format wichtig, das Datei, Zeile, Spalte und Treffer in einem von Vim verstandenen Format ausgibt.

```bash
# In ~/.bashrc oder ~/.zshrc
export FZF_DEFAULT_COMMAND='rg --files --hidden --follow --glob "!.git/*"'

# Für VS Code (settings.json)
{
  "search.ripgrep.enable": true,
  "search.useRipgrep": true
}

# Für Neovim (init.lua)
vim.o.grepprg = 'rg --vimgrep --smart-case --follow'
vim.o.grepformat = '%f:%l:%c:%m'
```

### 2. Custom File-Types definieren

ripgrep erlaubt dir, eigene Dateityp-Gruppen zu definieren, die du dann mit dem `-t` Flag verwenden kannst. Statt jedes Mal `-e html -e css -e js -e jsx -e ts -e tsx` zu tippen, definierst du einmal den Typ "web" und nutzt dann einfach `rg "api" -t web`. Stell dir vor, du arbeitest an einem Full-Stack-Projekt und willst nur in Frontend-Dateien suchen -- der benutzerdefinierte Typ "web" deckt alle relevanten Dateitypen ab. Speichere diese Definitionen in deiner `~/.ripgreprc`, damit sie in jedem Projekt verfuegbar sind. Du kannst so viele Custom-Types definieren, wie du brauchst.

```bash
# In ~/.ripgreprc
--type-add=web:*.{html,css,js,jsx,ts,tsx,vue,svelte}
--type-add=config:*.{json,yaml,yml,toml,ini,env}
--type-add=docs:*.{md,txt,rst,adoc}

# Verwenden
rg "api" -t web
rg "port" -t config
```

### 3. Smart Case + Ignore für Produktivität

```bash
# ~/.ripgreprc
--smart-case          # Case-insensitive wenn Lowercase
--follow              # Folge Symlinks
--hidden              # Durchsuche Hidden Files
--glob=!.git/         # Aber ignoriere .git
--glob=!node_modules/
--glob=!dist/
--glob=!build/
```

### 4. Kombiniere mit Watchman für Live-Search

Dieses Script kombiniert Facebooks Watchman (ein File-Watching-Tool) mit ripgrep fuer Echtzeit-Suche. Jedes Mal, wenn sich eine JavaScript- oder TypeScript-Datei aendert, wird automatisch die ripgrep-Suche erneut ausgefuehrt. Stell dir vor, du refactorst eine Funktion und willst in Echtzeit sehen, wie viele Referenzen noch uebrig sind -- jede gespeicherte Aenderung loest eine neue Suche aus. Das ist besonders nuetzlich fuer grosse Umbenennungen, bei denen du den Fortschritt verfolgen willst. Beachte, dass Watchman separat installiert werden muss (`brew install watchman` auf macOS).

```bash
#!/bin/bash
# live-search.sh - Real-time Code-Suche

watchman-make -p '**/*.js' '**/*.ts' --run "rg $1 -t js -t ts"

# Usage: ./live-search.sh "useState"
```

### 5. JSON Output für Automatisierung

ripgreps JSON-Output-Modus erzeugt maschinenlesbaren Output, der sich perfekt fuer automatisierte Pipelines und Reporting eignet. Jede Zeile ist ein JSON-Objekt mit Typ, Dateipfad, Zeilennummer und Treffer-Text. Durch Piping in jq kannst du die Ergebnisse filtern, transformieren und in strukturierte Reports umwandeln. Stell dir vor, du willst ein automatisiertes TODO-Tracking-System bauen, das alle TODOs im Projekt als JSON-Datei exportiert und in ein Issue-Tracking-Tool importiert. Der folgende Befehl extrahiert alle Matches, erstellt ein JSON-Array und speichert es als Datei.

```bash
# Generiere Structured Report
rg "TODO" --json | \
  jq -r 'select(.type=="match") |
    {file: .data.path.text,
     line: .data.line_number,
     text: .data.lines.text}' | \
  jq -s '.' > todos.json

# Import in DB/Tool
cat todos.json | jq -r '.[] | "\(.file):\(.line):\(.text)"'
```

### 6. Regex-Tester Funktion

Diese Shell-Funktion ist ein schneller Regex-Tester direkt im Terminal. Statt dein Regex-Pattern direkt auf die gesamte Codebase loszulassen und tausende Treffer zu bekommen, testest du es zuerst gegen einen Sample-String. Stell dir vor, du bist dir nicht sicher, ob `v\d+\.\d+` sowohl `v1.2` als auch `v12.345` matcht -- mit `rgtest` pruefst du das in Sekundenbruchteilen. Das spart frustrierende Iterationen, bei denen du den Befehl immer wieder anpassen musst. Die Funktion gibt den Match farblich hervorgehoben aus, sodass du sofort siehst, was getroffen wird.

```bash
# ~/.bashrc
rgtest() {
  echo "Testing regex: $1"
  echo "Against sample: $2"
  echo "$2" | rg "$1" --color=always
}

# Usage
rgtest "v\d+\.\d+" "v1.2.3 and v2.0"
```

### 7. Code-Statistiken generieren

Diese Funktionen nutzen ripgrep, um statistische Analysen ueber deine Codebase zu erstellen. Die Funktion `count_functions` zaehlt Funktionsdefinitionen pro Datei und zeigt die Top 10 -- Dateien mit vielen Funktionen sind Kandidaten fuer Aufspaltung. Die `todo_ratio` Funktion berechnet das Verhaeltnis von TODOs zu Funktionen als Qualitaetsindikator. Stell dir vor, du willst deinem Team zeigen, welche Dateien die meiste technische Schuld tragen -- ein hoher TODO-Ratio zeigt genau das. Diese Metriken koennen auch in CI/CD-Pipelines integriert werden, um die Code-Qualitaet ueber die Zeit zu verfolgen.

```bash
# Function-Count pro File
count_functions() {
  rg "function\s+\w+|const\s+\w+\s*=\s*\(" -t js --count |
    sort -t: -k2 -rn |
    head -10
}

# TODO-Ratio
todo_ratio() {
  TOTAL=$(rg "function|class" -t js --count-matches |
    awk -F: '{sum+=$2} END {print sum}')
  TODOS=$(rg "TODO|FIXME" -t js --count-matches |
    awk -F: '{sum+=$2} END {print sum}')
  echo "TODO/Function Ratio: $(bc <<< "scale=2; $TODOS/$TOTAL")"
}
```

---

## Zusammenfassung

**ripgrep** ist das moderne Standard-Tool für Code-Suche und hat die Entwickler-Workflows revolutioniert:

### Kern-Vorteile:
✅ **Geschwindigkeit**: 2-10x schneller als Alternativen
✅ **Smart Defaults**: `.gitignore`, Auto-Exclude Binaries
✅ **Developer-UX**: Colored Output, Intuitive Flags
✅ **Scriptable**: JSON Output, Predictable Behavior
✅ **Skalierbar**: Millionen Zeilen in Sekunden

### Typische Use Cases:
- 🔍 Code-Suche in großen Repositories
- 🔄 Refactoring-Preview vor Änderungen
- 🔒 Security-Audits (Secret-Scanning)
- 📊 Code-Metriken & Statistiken
- 🐛 Debugging & Log-Analyse

### Ergänzt perfekt:
- **fzf**: Interaktive Search-Results
- **bat**: Syntax-Highlighted Previews
- **delta**: Diff-Visualisierung
- **Claude Code**: AI-powered Code-Analysis

### Nächste Schritte:
1. Installiere ripgrep: `brew install ripgrep`
2. Setze Config: `~/.ripgreprc` mit Smart Defaults
3. Erstelle Aliase für häufige Patterns
4. Integriere in Editor (VS Code, Vim, etc.)
5. Nutze mit Claude Code für AI-assisted Refactoring

**Bottom Line**: `rg` ist unverzichtbar für moderne Softwareentwicklung. Schneller Setup, sofortige Produktivitätssteigerung, keine Lernkurve für `grep`-User.

---

**Weiter zu**: [14. fd - Moderne File-Finding](./14-fd.md)
**Zurück zu**: [12. fzf - Fuzzy Finder](./12-fzf.md)
**Übersicht**: [Tools & Extensions](../TOOLS-EXTENSIONS-INDEX.md)
