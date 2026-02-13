# Lektion 27: hyperfine - Benchmarking Tool

## Berechtigung

**hyperfine** ist ein modernes, benutzerfreundliches Command-Line-Benchmarking-Tool, geschrieben in Rust, das statistische Performance-Analysen von Befehlen, Skripten und Programmen durchführt. Es ist die moderne Alternative zum traditionellen `time`-Befehl mit umfangreichen statistischen Auswertungen.

### Was hyperfine macht:
- **Präzise Benchmarks**: Mehrere Runs mit statistischer Auswertung (Mean, StdDev, Min, Max)
- **Warmup-Phase**: Automatische Warmup-Runs um Cache-Effekte zu minimieren
- **Vergleiche**: Mehrere Befehle gegeneinander benchmarken
- **Export**: Ergebnisse als JSON, CSV, Markdown oder AsciiDoc exportieren
- **Shell-Handling**: Unterstützung für Shell-Befehle mit Pipes, Variablen, etc.
- **Parameter-Ranges**: Benchmark-Serien mit verschiedenen Parametern

### Typische Anwendungsfälle:
- Performance von Code-Änderungen vergleichen
- Compiler-Flags optimieren (Rust, C++, Go)
- Algorithmen-Performance vergleichen
- CLI-Tools benchmarken
- Build-Scripts optimieren
- Datenbank-Query-Performance testen

---

> 🚀 **Claude Code Relevanz**: hyperfine ist das perfekte Werkzeug, um Code-Optimierungen von Claude Code objektiv zu messen -- benchmarke die Vorher/Nachher-Performance und lass Claude Code die Ergebnisse interpretieren.

## Zwecke

### 1. **Statistische Performance-Messung**
hyperfine führt mehrere Runs durch und berechnet:
- Mean (Durchschnitt)
- Standard Deviation (Standardabweichung)
- Minimum und Maximum
- Median
- Confidence Intervals

### 2. **Vergleichende Benchmarks**
- Mehrere Befehle gleichzeitig benchmarken
- Automatischer Vergleich mit relativen Speedups
- Visualisierung der Unterschiede
- Sortierung nach Performance

### 3. **Parameterisierte Benchmarks**
- Benchmark-Serien mit verschiedenen Inputs
- Range-Unterstützung für numerische Parameter
- Shell-Variable-Substitution
- Export für weitere Analyse

> 💡 **Tipp**: Nutze immer `--warmup 3` bei Benchmarks -- ohne Warmup-Phase koennen Cache-Effekte die ersten Messungen stark verfaelschen.

### 4. **Reproduzierbare Ergebnisse**
- Warmup-Phase zur Cache-Stabilisierung
- Isolation von System-Einflüssen
- Statistische Signifikanz
- Export für Versionskontrolle

---

## Verwendung

Dieser Abschnitt fuehrt dich durch Installation, grundlegende und erweiterte Nutzung von hyperfine -- von einfachen Benchmarks bis hin zu parameterisierten Testserien.

### Installation

hyperfine ist ueber gaengige Paketmanager oder direkt ueber Cargo (Rust) verfuegbar.

#### macOS (via Homebrew):
Die schnellste Installation auf macOS ist ueber Homebrew. Nach der Installation kannst du sofort Benchmarks ausfuehren:
```bash
# hyperfine installieren
brew install hyperfine

# Version prüfen
hyperfine --version

# Beispiel-Benchmark
hyperfine 'sleep 0.3'
```

#### Ubuntu/Debian:
Unter Ubuntu/Debian kann hyperfine ueber ein .deb-Paket von GitHub oder ueber Cargo installiert werden:
```bash
# Dependencies
sudo apt update
sudo apt install -y wget

# Binary herunterladen (neueste Version von GitHub)
wget https://github.com/sharkdp/hyperfine/releases/download/v1.18.0/hyperfine_1.18.0_amd64.deb
sudo dpkg -i hyperfine_1.18.0_amd64.deb

# Oder via Cargo (Rust)
cargo install hyperfine

# Version prüfen
hyperfine --version
```

#### Arch Linux:
Arch Linux stellt hyperfine direkt in den offiziellen Repositories bereit, was die Installation besonders einfach macht. Dank des Rolling-Release-Modells bekommst du immer die neueste Version. Stell dir vor, du entwickelst auf Arch Linux und willst schnell verschiedene Algorithmus-Implementierungen benchmarken -- ein einzelner pacman-Befehl genuegt fuer die Installation. Nach der Installation pruefst du mit `hyperfine --version`, ob alles korrekt eingerichtet wurde.
```bash
# hyperfine installieren
sudo pacman -S hyperfine

# Version prüfen
hyperfine --version
```

### Basis-Verwendung

Die wichtigsten Aufrufvarianten von hyperfine -- vom einfachen Benchmark ueber Vergleiche bis hin zu verschiedenen Praezisionseinstellungen:

```bash
# Einfacher Benchmark
hyperfine 'sleep 1'

# Befehl mit Arguments
hyperfine 'find . -name "*.js"'

# Mehrere Befehle vergleichen
hyperfine 'grep -r "TODO" .' 'rg "TODO" .'

# Mit Warmup-Runs
hyperfine --warmup 3 'python script.py'

# Mit mehr Runs für höhere Präzision
hyperfine --runs 50 'node app.js'

# Mit Minimum Runs (statistische Signifikanz)
hyperfine --min-runs 10 'cargo build'

# Shell-Befehle
hyperfine --shell=bash 'ls | wc -l'

# Ohne Shell (direkter Aufruf, schneller)
hyperfine --shell=none 'ls'
```

### Erweiterte Optionen

Fuer fortgeschrittene Benchmarks bietet hyperfine Setup/Cleanup-Befehle, Export-Formate, Parameter-Scanning und benannte Commands:

```bash
# Setup-Befehl vor jedem Run
hyperfine --setup 'make clean' 'make build'

# Prepare-Befehl vor jedem Timing-Run (nicht gemessen)
hyperfine --prepare 'sync; echo 3 | sudo tee /proc/sys/vm/drop_caches' 'test-command'

# Cleanup-Befehl nach jedem Run
hyperfine --cleanup 'rm -rf /tmp/test-*' 'test-command'

# Mit Export (JSON, CSV, Markdown)
hyperfine --export-json results.json 'command1' 'command2'
hyperfine --export-csv results.csv 'command1' 'command2'
hyperfine --export-markdown results.md 'command1' 'command2'

# Zeit-Limits
hyperfine --max-runs 100 --time-limit 10s 'slow-command'

# Parameterisierte Benchmarks
hyperfine --parameter-scan num 1 10 'echo {num}'
hyperfine --parameter-list size 100,1000,10000 'generate-data {size}'

# Namen für bessere Übersicht
hyperfine --command-name "Grep" 'grep -r "TODO"' \
          --command-name "Ripgrep" 'rg "TODO"'

# Ignore-Failures (weitermachen bei Exit-Code != 0)
hyperfine --ignore-failure 'flaky-command'

# Show-Output (für Debugging)
hyperfine --show-output 'echo Hello'
```

### Parameter-Scanning

Mit Parameter-Scanning fuehrst du automatisch Benchmark-Serien mit verschiedenen Eingabewerten durch -- ideal fuer Skalierungsanalysen:

```bash
# Numerische Range
hyperfine --parameter-scan threads 1 8 'run-with-threads {threads}'

# Custom Werte
hyperfine --parameter-list input 'small.txt,medium.txt,large.txt' \
  'process-file {input}'

# Mehrere Parameter (verschachtelt)
hyperfine --parameter-scan n 10 100 --parameter-scan m 1 10 \
  'benchmark {n} {m}'

# Mit Export für Analyse
hyperfine --export-json scaling.json \
  --parameter-scan threads 1 16 \
  'parallel-task --threads {threads}'
```

---

## Best Practices

Bewaehrte Methoden fuer zuverlaessige und reproduzierbare Benchmarks -- von Warmup-Strategien ueber statistische Signifikanz bis zur CI/CD-Integration.

### 1. **Warmup für Cache-Stabilisierung**
Ohne Warmup-Phase koennen die ersten Runs durch kalte Caches verzerrt sein. Warmup-Runs fuellen Dateisystem- und CPU-Caches, bevor die eigentliche Messung beginnt:
```bash
# Immer Warmup-Runs nutzen (3-5 Runs)
hyperfine --warmup 3 'command'

# Bei I/O-lastigen Operations mehr Warmup
hyperfine --warmup 10 'find / -name "test"'

# Für sehr schnelle Operations (<10ms) viele Runs
hyperfine --warmup 5 --runs 100 'echo "Hello"'
```

### 2. **Vergleiche mit relativen Speedups**
hyperfine berechnet automatisch, wie viel schneller ein Befehl im Vergleich zu anderen ist. Benannte Commands machen die Ausgabe lesbarer:
```bash
# Mehrere Implementierungen vergleichen
hyperfine \
  --command-name "Python" 'python3 script.py' \
  --command-name "PyPy" 'pypy3 script.py' \
  --command-name "Rust" './target/release/program'

# Output zeigt automatisch relative Speedups:
# Benchmark 1: Python
#   Time (mean ± σ):      1.234 s ±  0.045 s    [User: 1.2 s, System: 0.0 s]
#   Range (min … max):    1.180 s …  1.298 s    10 runs
#
# Benchmark 2: PyPy
#   Time (mean ± σ):      0.567 s ±  0.023 s    [User: 0.5 s, System: 0.0 s]
#   Range (min … max):    0.540 s …  0.595 s    10 runs
#
# Benchmark 3: Rust
#   Time (mean ± σ):      0.123 s ±  0.005 s    [User: 0.1 s, System: 0.0 s]
#   Range (min … max):    0.118 s …  0.130 s    10 runs
#
# Summary
#   'Rust' ran
#     4.61 ± 0.25 times faster than 'PyPy'
#    10.03 ± 0.52 times faster than 'Python'
```

### 3. **Export für Versionskontrolle**
Speichere Benchmark-Ergebnisse als JSON im Git-Repo, um Performance-Regressionen ueber die Zeit zu tracken:
```bash
# Benchmark-Ergebnisse in Git-Repo speichern
mkdir -p benchmarks/$(git rev-parse --short HEAD)

hyperfine --export-json benchmarks/$(git rev-parse --short HEAD)/results.json \
  'cargo build --release'

git add benchmarks/
git commit -m "Add benchmarks for commit $(git rev-parse --short HEAD)"
```

### 4. **CI/CD-Integration**
Integriere Benchmarks in CI-Pipelines, um automatisch bei Performance-Regressionen zu warnen:
```bash
# In GitLab CI oder GitHub Actions
performance-test:
  script:
    - hyperfine --export-json benchmark-results.json 'npm test'
    - |
      # Prüfen ob Performance-Regression
      MEAN=$(jq '.results[0].mean' benchmark-results.json)
      if (( $(echo "$MEAN > 2.0" | bc -l) )); then
        echo "Performance regression detected!"
        exit 1
      fi
```

### 5. **Parameter-Scanning für Optimization**
Nutze Parameter-Listen, um systematisch verschiedene Compiler-Flags oder Konfigurationen zu testen:
```bash
# Compiler-Flags optimieren
hyperfine --export-csv compiler-flags.csv \
  --parameter-list opt "0,1,2,3,s" \
  'gcc -O{opt} program.c -o program && ./program'

# Dann mit Claude oder Python analysieren
python analyze-compiler-flags.py compiler-flags.csv
```

### 6. **Prepare-Commands für saubere Messungen**
Prepare-Commands laufen vor jedem Timing-Run, werden aber nicht mitgemessen. Nutze sie z.B. zum Leeren des Dateisystem-Caches fuer reproduzierbare I/O-Benchmarks:
```bash
# Cache droppen vor jedem Run (Linux)
hyperfine --prepare 'sync; echo 3 | sudo tee /proc/sys/vm/drop_caches' \
  'find / -name "test.txt"'

# macOS: purge statt drop_caches
hyperfine --prepare 'purge' 'find / -name "test.txt"'

# Oder Temporäre Dateien löschen
hyperfine --prepare 'rm -rf /tmp/benchmark-*' \
  'generate-output > /tmp/benchmark-out.txt'
```

### 7. **Statistische Signifikanz sicherstellen**
Zu wenige Runs fuehren zu unzuverlaessigen Ergebnissen. Mindestens 10 Runs sind empfehlenswert, bei hoher Varianz deutlich mehr:
```bash
# Minimum 10 Runs für statistische Signifikanz
hyperfine --min-runs 10 'command'

# Oder feste Anzahl Runs
hyperfine --runs 50 'command'

# Bei großer Varianz: Mehr Runs
hyperfine --runs 100 'flaky-command'
```

### 8. **Shell vs. No-Shell**
Standardmaessig fuehrt hyperfine Befehle in einer Shell aus, was Overhead hinzufuegt. Fuer praezisere Messungen bei einfachen Befehlen nutze `--shell=none`:
```bash
# Mit Shell (langsamer, aber flexible)
hyperfine --shell=bash 'ls | wc -l'

# Ohne Shell (schneller, aber keine Pipes/Variables)
hyperfine --shell=none 'ls'

# Vergleich:
hyperfine --warmup 5 --runs 100 \
  --command-name "With Shell" --shell=bash 'echo "Hello"' \
  --command-name "No Shell" --shell=none 'echo' 'Hello'
```

### 9. **Benchmark-Driven Development**
Miss die Performance vor und nach einer Optimierung, um die Verbesserung objektiv zu quantifizieren:
```bash
# Vor Optimierung: Baseline messen
hyperfine --export-json baseline.json 'python slow-script.py'

# Nach Optimierung: Vergleichen
hyperfine --export-json optimized.json 'python fast-script.py'

# Beide vergleichen
hyperfine \
  --command-name "Baseline" 'python slow-script.py' \
  --command-name "Optimized" 'python fast-script.py'
```

### 10. **Debugging mit --show-output**
Wenn ein Benchmark unerwartet langsam ist, zeigt `--show-output` die Programmausgabe an, die normalerweise unterdrueckt wird:
```bash
# Wenn Benchmark unerwartet langsam ist:
hyperfine --show-output 'command'

# Output wird angezeigt (normalerweise unterdrückt)
# Hilft bei Debugging von Performance-Problemen
```

---

## Beispiele

Praxisnahe Benchmark-Szenarien -- von einfachen Messungen ueber Compiler-Optimierungen bis hin zu Build-System-Vergleichen.

### Beispiel 1: Einfacher Benchmark

Der einfachste Anwendungsfall: Ein einzelnes Programm mehrfach ausfuehren und statistische Kennzahlen erhalten:

```bash
# Python-Script benchmarken
hyperfine 'python3 data-processor.py'
```

**Output:**
```
Benchmark 1: python3 data-processor.py
  Time (mean ± σ):      1.234 s ±  0.045 s    [User: 1.200 s, System: 0.034 s]
  Range (min … max):    1.180 s …  1.298 s    10 runs
```

**Interpretation:**
- Mean: 1.234s (Durchschnitt)
- σ (Sigma): 0.045s (Standardabweichung - niedriger ist besser)
- Range: 1.180s - 1.298s (alle Runs innerhalb ~10% Varianz, gut!)

> 🚀 **Beispiel**: Vergleiche die Performance deines alten Python-Scripts mit der von Claude Code optimierten Version: `hyperfine --warmup 3 'python old.py' 'python new.py'`

### Beispiel 2: Grep vs. Ripgrep Vergleich

Einer der klassischen Benchmarks ist der Vergleich zwischen dem traditionellen grep und modernen Alternativen wie ripgrep (rg). Dieser Benchmark misst, wie schnell jedes Tool ein Muster rekursiv in einem Verzeichnis findet. Das Flag --warmup 3 fuehrt 3 Vorlaeufe durch, um den Dateisystem-Cache zu fuellen, damit die Messung nicht durch kalte Caches verzerrt wird. Stell dir vor, du ueberlegst, ob es sich lohnt, in deinem Team von grep auf ripgrep umzusteigen -- dieser Benchmark gibt dir harte Zahlen statt Bauchgefuehl. Die benannten Commands (--command-name) machen die Ausgabe lesbarer und den Vergleich eindeutiger. hyperfine berechnet am Ende automatisch den relativen Speedup.

```bash
# Traditionelles grep vs. moderne Alternative ripgrep
hyperfine --warmup 3 \
  --command-name "grep" 'grep -r "TODO" .' \
  --command-name "ripgrep" 'rg "TODO" .'
```

**Output:**
```
Benchmark 1: grep
  Time (mean ± σ):      2.845 s ±  0.123 s    [User: 1.8 s, System: 1.0 s]
  Range (min … max):    2.701 s …  3.012 s    10 runs

Benchmark 2: ripgrep
  Time (mean ± σ):      0.234 s ±  0.012 s    [User: 0.2 s, System: 0.0 s]
  Range (min … max):    0.220 s …  0.250 s    12 runs

Summary
  'ripgrep' ran
   12.16 ± 0.68 times faster than 'grep'
```

**Ergebnis**: ripgrep ist ~12x schneller als grep!

### Beispiel 3: Compiler-Optimierungs-Flags

Dieser Benchmark vergleicht verschiedene GCC-Optimierungslevel (-O0 bis -O3 und -Os) und zeigt, wie stark Compiler-Optimierungen die Laufzeit eines Programms beeinflussen. Der parameter-list-Parameter automatisiert die Benchmark-Serie -- hyperfine fuehrt den Befehl fuer jeden Optimierungslevel separat aus. Stell dir vor, du entwickelst ein rechenintensives C-Programm und willst wissen, ob sich der Unterschied zwischen -O2 und -O3 lohnt -- dieser Benchmark gibt dir die Antwort mit statistischer Praezision. Die Ergebnisse werden als CSV exportiert, damit du sie spaeter visualisieren oder mit anderen Tools weiterverarbeiten kannst. Beachte, dass der Befehl sowohl die Kompilierung als auch die Ausfuehrung misst.

```bash
# Verschiedene GCC-Optimierungs-Levels vergleichen
hyperfine --export-csv opt-levels.csv \
  --parameter-list opt "0,1,2,3,s" \
  'gcc -O{opt} program.c -o program && ./program'
```

**Output:**
```
Benchmark 1: gcc -O0 program.c -o program && ./program
  Time (mean ± σ):      5.234 s ±  0.145 s

Benchmark 2: gcc -O1 program.c -o program && ./program
  Time (mean ± σ):      2.845 s ±  0.098 s

Benchmark 3: gcc -O2 program.c -o program && ./program
  Time (mean ± σ):      1.456 s ±  0.067 s

Benchmark 4: gcc -O3 program.c -o program && ./program
  Time (mean ± σ):      1.123 s ±  0.045 s

Benchmark 5: gcc -Os program.c -o program && ./program
  Time (mean ± σ):      1.789 s ±  0.081 s

Summary
  'gcc -O3 program.c -o program && ./program' ran
    1.30 ± 0.07 times faster than 'gcc -O2 program.c -o program && ./program'
    1.59 ± 0.09 times faster than 'gcc -Os program.c -o program && ./program'
    2.53 ± 0.13 times faster than 'gcc -O1 program.c -o program && ./program'
    4.66 ± 0.23 times faster than 'gcc -O0 program.c -o program && ./program'
```

**Ergebnis**: -O3 ist am schnellsten (wie erwartet)

### Beispiel 4: Thread-Scaling-Analyse

Eine Thread-Scaling-Analyse zeigt dir, wie gut ein Programm mit zunehmender Thread-Anzahl skaliert. Ideal waere eine lineare Skalierung: doppelt so viele Threads bedeuten halbe Laufzeit. In der Praxis erreichen Programme diese ideale Skalierung selten, da Synchronisierungskosten und gemeinsame Ressourcen (z.B. Memory-Bus, Locks) bremsen. Stell dir vor, du hast ein parallelisiertes Bildverarbeitungsprogramm und fragst dich, ob es sich lohnt, von 4 auf 8 Threads zu erhoehen -- dieser Benchmark zeigt dir genau den Punkt, ab dem mehr Threads keinen spuerbaren Vorteil mehr bringen. Die JSON-Ausgabe laesst sich anschliessend mit dem Python-Skript unten als Skalierungsgraph visualisieren.

```bash
# Wie gut skaliert ein Programm mit mehr Threads?
hyperfine --export-json scaling.json \
  --parameter-scan threads 1 8 \
  'parallel-program --threads {threads}'
```

**Output:**
```
Benchmark 1: parallel-program --threads 1
  Time (mean ± σ):      8.234 s ±  0.234 s

Benchmark 2: parallel-program --threads 2
  Time (mean ± σ):      4.567 s ±  0.145 s

Benchmark 3: parallel-program --threads 4
  Time (mean ± σ):      2.456 s ±  0.089 s

Benchmark 4: parallel-program --threads 8
  Time (mean ± σ):      1.567 s ±  0.067 s

Summary
  'parallel-program --threads 8' ran
    1.57 ± 0.08 times faster than 'parallel-program --threads 4'
    2.91 ± 0.15 times faster than 'parallel-program --threads 2'
    5.25 ± 0.26 times faster than 'parallel-program --threads 1'
```

**Analyse mit Python:**
```python
import json
import matplotlib.pyplot as plt

with open('scaling.json') as f:
    data = json.load(f)

threads = []
times = []

for result in data['results']:
    # Parameter extrahieren
    cmd = result['command']
    thread_count = int(cmd.split('--threads')[1].strip())
    threads.append(thread_count)
    times.append(result['mean'])

# Ideal scaling (linear)
ideal = [times[0] / t for t in threads]

plt.plot(threads, times, 'o-', label='Actual')
plt.plot(threads, ideal, '--', label='Ideal (linear scaling)')
plt.xlabel('Threads')
plt.ylabel('Time (s)')
plt.title('Thread Scaling Performance')
plt.legend()
plt.savefig('scaling.png')
```

### Beispiel 5: Python vs. PyPy vs. Rust

Dieser Benchmark vergleicht die gleiche Algorithmus-Implementierung in drei verschiedenen Ausfuehrungsumgebungen: CPython (Standardinterpreter), PyPy (JIT-kompilierter Python-Interpreter) und Rust (nativer Maschinencode). Das ist ein typischer Anwendungsfall, wenn du entscheiden musst, ob eine Performance-kritische Komponente in einer schnelleren Sprache neu implementiert werden sollte. Stell dir vor, du hast eine Fibonacci-Berechnung in Python, die zu langsam ist -- der Benchmark zeigt dir objektiv, welchen Speedup du durch PyPy (ohne Code-Aenderung) oder durch Rust (mit Neuentwicklung) erwarten kannst. Die 5 Warmup-Runs sind hier besonders wichtig, da PyPy eine JIT-Aufwaermphase benoetigt. Das Ergebnis hilft dir, eine informierte Entscheidung ueber den Refactoring-Aufwand zu treffen.

```bash
# Verschiedene Implementierungen vergleichen
hyperfine --warmup 5 \
  --command-name "Python 3.11" 'python3.11 fibonacci.py' \
  --command-name "PyPy 3.10" 'pypy3 fibonacci.py' \
  --command-name "Rust" './target/release/fibonacci'
```

**Output:**
```
Benchmark 1: Python 3.11
  Time (mean ± σ):      2.345 s ±  0.089 s

Benchmark 2: PyPy 3.10
  Time (mean ± σ):      0.567 s ±  0.034 s

Benchmark 3: Rust
  Time (mean ± σ):      0.012 s ±  0.001 s

Summary
  'Rust' ran
   47.25 ± 4.12 times faster than 'PyPy 3.10'
  195.42 ± 16.23 times faster than 'Python 3.11'
```

**Ergebnis**: Rust ist ~200x schneller als Python, ~50x schneller als PyPy

> ⚠️ **Warnung**: Bei sehr schnellen Befehlen (<5ms) kann der Shell-Overhead die Messung verfaelschen. Nutze `--shell=none` fuer praezisere Ergebnisse bei kurzen Ausfuehrungszeiten.

### Beispiel 6: Build-System-Vergleich

Build-System-Vergleiche sind einer der praktischsten Einsatzfaelle von hyperfine, da die Wahl des Package Managers die taegliche Entwicklererfahrung stark beeinflusst. Dieser Benchmark vergleicht npm, pnpm, yarn und bun bei der Installation von Abhaengigkeiten. Der prepare-Befehl `rm -rf node_modules` stellt sicher, dass vor jedem Run der node_modules-Ordner geloescht wird, sodass jeder Run eine frische Installation misst. Stell dir vor, dein Team diskutiert, ob ein Wechsel von npm zu pnpm oder bun lohnt -- dieser Benchmark liefert objektive Zahlen fuer eure konkrete package.json. Beachte, dass die Ergebnisse stark vom Projekt, der Netzwerkgeschwindigkeit und dem vorhandenen Cache abhaengen. Die 2 Warmup-Runs fuellen den lokalen Cache der Package Manager.

```bash
# npm vs. pnpm vs. yarn vs. bun
hyperfine --warmup 2 --prepare 'rm -rf node_modules' \
  --command-name "npm" 'npm install' \
  --command-name "pnpm" 'pnpm install' \
  --command-name "yarn" 'yarn install' \
  --command-name "bun" 'bun install'
```

**Output:**
```
Benchmark 1: npm
  Time (mean ± σ):     45.234 s ±  2.345 s

Benchmark 2: pnpm
  Time (mean ± σ):     15.678 s ±  1.234 s

Benchmark 3: yarn
  Time (mean ± σ):     28.456 s ±  1.789 s

Benchmark 4: bun
  Time (mean ± σ):      8.123 s ±  0.567 s

Summary
  'bun' ran
    1.93 ± 0.18 times faster than 'pnpm'
    3.50 ± 0.31 times faster than 'yarn'
    5.57 ± 0.45 times faster than 'npm'
```

**Ergebnis**: bun ist am schnellsten, npm am langsamsten

### Beispiel 7: Algorithmen-Vergleich

Algorithmen-Benchmarks sind der klassische Anwendungsfall fuer hyperfine in der Informatikausbildung und der Softwareentwicklung. Dieser Benchmark vergleicht drei Sortieralgorithmen mit 1 Million Elementen und exportiert die Ergebnisse direkt als Markdown-Tabelle. Stell dir vor, du schreibst eine Bachelorarbeit und brauchst einen objektiven Vergleich verschiedener Sortieralgorithmen -- hyperfine liefert dir eine sauber formatierte Tabelle mit statistischen Kennzahlen, die du direkt in deine Arbeit einfuegen kannst. Der Markdown-Export erzeugt eine Tabelle mit Mean, Min, Max und relativer Performance. Beachte, dass die Ergebnisse stark von der Datenverteilung abhaengen -- zufaellige Daten beguentigen Quicksort, waehrend fast sortierte Daten Mergesort bevorzugen.

```bash
# Quicksort vs. Mergesort vs. Heapsort
hyperfine --export-markdown sorting-algorithms.md \
  --command-name "Quicksort" './quicksort 1000000' \
  --command-name "Mergesort" './mergesort 1000000' \
  --command-name "Heapsort" './heapsort 1000000'
```

**Output (sorting-algorithms.md):**
```markdown
| Command | Mean [s] | Min [s] | Max [s] | Relative |
|:---|---:|---:|---:|---:|
| `Quicksort` | 0.234 ± 0.012 | 0.220 | 0.250 | 1.00 |
| `Mergesort` | 0.345 ± 0.023 | 0.320 | 0.380 | 1.47 ± 0.11 |
| `Heapsort` | 0.456 ± 0.034 | 0.420 | 0.510 | 1.95 ± 0.15 |
```

**Ergebnis**: Quicksort ist am schnellsten für diesen Use-Case

### Beispiel 8: Input-Size-Scaling

Input-Size-Scaling-Benchmarks messen, wie sich die Laufzeit eines Programms mit zunehmender Eingabegroesse veraendert. Das hilft dir, die algorithmische Komplexitaet (Big-O-Notation) empirisch zu verifizieren. In diesem Beispiel wird die Eingabegroesse logarithmisch von 100 bis 1.000.000 skaliert. Stell dir vor, du hast einen Datenverarbeitungsalgorithmus geschrieben und willst pruefen, ob er tatsaechlich in O(n) laeuft wie erwartet -- wenn die Laufzeit proportional zur Eingabegroesse waechst, bestaetigt das die lineare Komplexitaet. Falls die Laufzeit dagegen quadratisch waechst, hast du ein Performance-Problem, das bei grossen Datensaetzen zum Showstopper wird. Der JSON-Export ermoeglicht die Visualisierung als Skalierungsgraph.

```bash
# Wie skaliert Performance mit Input-Größe?
hyperfine --export-json input-scaling.json \
  --parameter-list size '100,1000,10000,100000,1000000' \
  'process-data --size {size}'
```

**Output:**
```
Benchmark 1: process-data --size 100
  Time (mean ± σ):       5.2 ms ±   0.3 ms

Benchmark 2: process-data --size 1000
  Time (mean ± σ):      45.3 ms ±   2.1 ms

Benchmark 3: process-data --size 10000
  Time (mean ± σ):     423.5 ms ±  15.6 ms

Benchmark 4: process-data --size 100000
  Time (mean ± σ):       4.2 s ±   0.2 s

Benchmark 5: process-data --size 1000000
  Time (mean ± σ):      42.3 s ±   1.8 s
```

**Analyse**: Sieht nach O(n) Komplexität aus (linear scaling)

### Beispiel 9: Database-Query-Optimization

Datenbank-Queries lassen sich hervorragend mit hyperfine benchmarken, besonders wenn du den Effekt von Indizes oder Query-Optimierungen messen willst. In diesem Beispiel vergleichst du die gleiche SELECT-Abfrage mit und ohne Index auf der email-Spalte. Der prepare-Befehl erstellt den Index vor jedem Run, und die Warmup-Phase fuellt den Datenbank-Cache. Stell dir vor, du betreust eine Anwendung mit langsamen Login-Zeiten und vermutest einen fehlenden Index -- dieser Benchmark zeigt dir objektiv, wie viel ein Index bringt. Beachte, dass du psql auf der Kommandozeile aufrufst, was den Verbindungsaufbau mitmisst. Fuer praezisere In-Database-Benchmarks nutze EXPLAIN ANALYZE direkt in SQL.

```bash
# Verschiedene SQL-Queries vergleichen
hyperfine --warmup 3 \
  --command-name "Without Index" "psql -c 'SELECT * FROM users WHERE email = \"test@example.com\"'" \
  --command-name "With Index" "psql -c 'SELECT * FROM users WHERE email = \"test@example.com\"'" \
  --prepare "psql -c 'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);'"
```

### Beispiel 10: Rust Cargo Build-Modes

Rust bietet verschiedene Build-Profile, die sich erheblich auf die Laufzeit-Performance auswirken. Der Debug-Build ist schnell zu kompilieren, aber die resultierende Binary ist langsam wegen fehlender Optimierungen. Der Release-Build aktiviert Optimierungen (-O3 equivalent), und LTO (Link-Time Optimization) ermoeglicht zusaetzliche Optimierungen ueber Modul-Grenzen hinweg. Stell dir vor, du entwickelst einen Rust-Webserver und fragst dich, ob LTO die laengere Kompilierzeit wert ist -- dieser Benchmark zeigt dir den exakten Performance-Unterschied. Beachte, dass der Benchmark sowohl die Build- als auch die Ausfuehrungszeit misst, was fuer CI/CD-Entscheidungen relevant ist.

```bash
# Debug vs. Release vs. Profile-Optimized
hyperfine --warmup 1 \
  --command-name "Debug" 'cargo build && ./target/debug/program' \
  --command-name "Release" 'cargo build --release && ./target/release/program' \
  --command-name "Release + LTO" 'cargo build --release --config profile.release.lto=true && ./target/release/program'
```

**Output:**
```
Benchmark 1: Debug
  Time (mean ± σ):      5.234 s ±  0.234 s

Benchmark 2: Release
  Time (mean ± σ):      0.567 s ±  0.034 s

Benchmark 3: Release + LTO
  Time (mean ± σ):      0.423 s ±  0.023 s

Summary
  'Release + LTO' ran
    1.34 ± 0.09 times faster than 'Release'
   12.38 ± 0.78 times faster than 'Debug'
```

> 💡 **Tipp**: Exportiere Benchmark-Ergebnisse als JSON (`--export-json results.json`) und committe sie ins Repo -- so kannst du Performance-Regressionen ueber die Zeit tracken.

### Beispiel 11: Export für CI/CD

In CI/CD-Pipelines ist es wichtig, Performance-Regressionen automatisch zu erkennen. Dieser Workflow exportiert Benchmark-Ergebnisse in drei Formaten gleichzeitig: JSON fuer maschinelle Verarbeitung, CSV fuer Tabellenkalkulationen und Markdown fuer Pull-Request-Kommentare. Anschliessend prueft ein Shell-Skript mit jq, ob die durchschnittliche Laufzeit einen Schwellenwert ueberschreitet. Stell dir vor, ein Entwickler commitet Code, der die Testlaufzeit von 3 auf 6 Sekunden verdoppelt -- dieser Check wuerde automatisch fehlschlagen und den Entwickler warnen. Passe den Schwellenwert (hier 5.0 Sekunden) an die normalen Laufzeiten deines Projekts an.

```bash
# In CI-Pipeline mit Export
hyperfine --export-json benchmark-results.json \
  --export-csv benchmark-results.csv \
  --export-markdown benchmark-results.md \
  'npm test'

# Dann in CI prüfen
MEAN=$(jq '.results[0].mean' benchmark-results.json)
if (( $(echo "$MEAN > 5.0" | bc -l) )); then
  echo "Performance regression: Tests take > 5 seconds"
  exit 1
fi
```

### Beispiel 12: Shell-Command mit Pipes

Wenn du Shell-Befehle mit Pipes, Variablen oder anderen Shell-Features benchmarken willst, musst du explizit `--shell=bash` angeben. Ohne diese Option versucht hyperfine, den Befehl direkt auszufuehren, was bei Pipes zu einem Fehler fuehrt. Dieser Benchmark vergleicht zwei Ansaetze, um Zeilen in JavaScript-Dateien zu zaehlen: find mit xargs (parallelisierbar) versus find mit -exec (sequenziell). Stell dir vor, du optimierst ein Build-Skript und willst wissen, welcher Ansatz schneller ist -- dieser Benchmark gibt dir eine klare Antwort. Bei grossen Codebases kann der Unterschied zwischen den beiden Ansaetzen erheblich sein, besonders wenn xargs die Arbeit parallelisiert.

```bash
# Komplexe Shell-Befehle benchmarken
hyperfine --shell=bash \
  'find . -name "*.js" | xargs wc -l | tail -1'

# Oder verschiedene Ansätze vergleichen
hyperfine --shell=bash \
  --command-name "find + xargs" 'find . -name "*.js" | xargs wc -l' \
  --command-name "find -exec" 'find . -name "*.js" -exec wc -l {} + | tail -1'
```

---

## Integration mit Claude Code

### Workflow 1: Automatische Performance-Analyse

```bash
# 1. Benchmark durchführen und exportieren
hyperfine --export-json benchmark.json \
  --command-name "Old" './old-implementation' \
  --command-name "New" './new-implementation'

# 2. Mit Claude analysieren
# Claude Prompt:
"""
Analyze these benchmark results and provide:
1. Performance improvements (% faster/slower)
2. Statistical significance
3. Recommendations for further optimization
4. Potential bottlenecks

Benchmark data:
$(cat benchmark.json)
"""
```

**Claude-Analyse:**
```
Performance Analysis:

1. Performance Improvements:
   - New implementation is 3.45x faster (mean: 0.567s vs. 1.956s)
   - Reduction in standard deviation (0.023s vs. 0.089s) indicates more stable performance
   - Min/max range is tighter (0.540-0.595s vs. 1.850-2.080s)

2. Statistical Significance:
   - Large difference (>3x) with low standard deviations suggests highly significant improvement
   - No overlap in min/max ranges confirms statistical significance

3. Recommendations:
   - Profile new implementation to identify remaining bottlenecks
   - Consider parallel processing for further speedup
   - Monitor memory usage (not captured in benchmark)

4. Potential Bottlenecks:
   - Standard deviation of 0.023s still indicates some variability
   - Consider I/O operations or GC pauses as potential causes
```

### Workflow 2: CI/CD Performance-Regression-Detection

```yaml
# .github/workflows/performance.yml
name: Performance Regression Check

on: [push, pull_request]

jobs:
  benchmark:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Install hyperfine
        run: |
          wget https://github.com/sharkdp/hyperfine/releases/download/v1.18.0/hyperfine_1.18.0_amd64.deb
          sudo dpkg -i hyperfine_1.18.0_amd64.deb

      - name: Build
        run: cargo build --release

      - name: Benchmark
        run: |
          hyperfine --export-json benchmark-new.json './target/release/program'

      - name: Download baseline
        run: |
          # Baseline aus main-Branch holen
          git fetch origin main
          git show origin/main:benchmark-baseline.json > benchmark-baseline.json

      - name: Compare with Claude
        env:
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
        run: |
          NEW=$(cat benchmark-new.json)
          BASELINE=$(cat benchmark-baseline.json)

          RESPONSE=$(curl -X POST https://api.anthropic.com/v1/messages \
            -H "Content-Type: application/json" \
            -H "x-api-key: $CLAUDE_API_KEY" \
            -d '{
              "model": "claude-3-5-sonnet-20241022",
              "max_tokens": 512,
              "messages": [{
                "role": "user",
                "content": "Compare these benchmarks. Is there a performance regression (>10% slower)? Answer YES or NO with brief explanation. New: '"$NEW"' Baseline: '"$BASELINE"'"
              }]
            }' | jq -r '.content[0].text')

          echo "$RESPONSE"

          if echo "$RESPONSE" | grep -q "YES"; then
            echo "::error::Performance regression detected!"
            exit 1
          fi

      - name: Update baseline (on main)
        if: github.ref == 'refs/heads/main'
        run: |
          cp benchmark-new.json benchmark-baseline.json
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add benchmark-baseline.json
          git commit -m "Update performance baseline"
          git push
```

### Workflow 3: Automated Optimization with Claude

```python
# auto_optimize.py
import subprocess
import json
import anthropic

def run_benchmark(command):
    """Run hyperfine benchmark"""
    result = subprocess.run(
        ['hyperfine', '--export-json', '-', command],
        capture_output=True,
        text=True
    )
    return json.loads(result.stdout)

def suggest_optimizations(code, benchmark_results):
    """Get optimization suggestions from Claude"""
    client = anthropic.Anthropic(api_key="your-api-key")

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"""
            This code has the following performance characteristics:
            {json.dumps(benchmark_results, indent=2)}

            Suggest 3-5 specific optimizations:

            Code:
            ```python
            {code}
            ```

            Output as JSON:
            {{
              "optimizations": [
                {{"description": "...", "code_change": "..."}}
              ]
            }}
            """
        }]
    )

    return json.loads(message.content[0].text)

if __name__ == '__main__':
    # Beispiel
    with open('slow_script.py') as f:
        code = f.read()

    baseline = run_benchmark('python slow_script.py')
    suggestions = suggest_optimizations(code, baseline)

    print("Optimization Suggestions:")
    for i, opt in enumerate(suggestions['optimizations'], 1):
        print(f"\n{i}. {opt['description']}")
        print(f"   Code change: {opt['code_change']}")
```

### Workflow 4: Parameter-Tuning mit Claude

```python
# parameter_tuning.py
import subprocess
import json
import anthropic

def benchmark_parameters(param_values):
    """Benchmark verschiedene Parameter-Werte"""
    cmd = ['hyperfine', '--export-json', '-']

    for val in param_values:
        cmd.append(f'./program --threads {val}')

    result = subprocess.run(cmd, capture_output=True, text=True)
    return json.loads(result.stdout)

def find_optimal_params(benchmark_results):
    """Claude findet optimale Parameter"""
    client = anthropic.Anthropic(api_key="your-api-key")

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""
            Based on these benchmark results, what is the optimal thread count?
            Consider performance, resource usage, and diminishing returns.

            Results:
            {json.dumps(benchmark_results, indent=2)}

            Output:
            {{
              "optimal_threads": <number>,
              "reasoning": "<explanation>"
            }}
            """
        }]
    )

    return json.loads(message.content[0].text)

if __name__ == '__main__':
    # Test threads from 1 to 16
    results = benchmark_parameters(range(1, 17))
    optimal = find_optimal_params(results)

    print(f"Optimal thread count: {optimal['optimal_threads']}")
    print(f"Reasoning: {optimal['reasoning']}")
```

### Workflow 5: Continuous Performance Tracking

```python
# performance_tracker.py
import subprocess
import json
from datetime import datetime
import anthropic

def track_performance():
    """Daily performance tracking"""
    # Benchmark durchführen
    result = subprocess.run(
        ['hyperfine', '--export-json', '-', 'cargo test'],
        capture_output=True,
        text=True
    )
    benchmark = json.loads(result.stdout)

    # Mit Timestamp speichern
    timestamp = datetime.now().isoformat()
    with open(f'performance-history/{timestamp}.json', 'w') as f:
        json.dump(benchmark, f)

    # Trend-Analyse mit Claude
    client = anthropic.Anthropic(api_key="your-api-key")

    # Letzte 7 Tage laden
    import glob
    history_files = sorted(glob.glob('performance-history/*.json'))[-7:]
    history = [json.load(open(f)) for f in history_files]

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=512,
        messages=[{
            "role": "user",
            "content": f"""
            Analyze this 7-day performance history.
            Is there a trend (improving/degrading)?
            Any anomalies?

            History:
            {json.dumps(history, indent=2)}
            """
        }]
    )

    print(message.content[0].text)

if __name__ == '__main__':
    track_performance()
```

---

## 🤖 Claude Code Integration

### Workflow 1: Claude Code Optimierung messen
Dieser Workflow zeigt den idealen Ablauf fuer Benchmark-Driven Development mit Claude Code. Zuerst erstellst du eine Baseline-Messung des unoptimierten Codes, dann laesst du Claude Code die Optimierung durchfuehren, und anschliessend misst du die optimierte Version. Der abschliessende direkte Vergleich zeigt den exakten Speedup. Stell dir vor, du hast ein Python-Skript, das 5 Sekunden braucht, und willst es von Claude Code optimieren lassen -- mit diesem Workflow siehst du schwarz auf weiss, ob die Optimierung tatsaechlich etwas gebracht hat. Die JSON-Exports ermoeglichen es, die Ergebnisse spaeter zu vergleichen oder in Dokumentationen einzufuegen.
```bash
# Vorher: Baseline erstellen
hyperfine --warmup 3 --export-json baseline.json 'python script.py'
# Claude Code optimieren lassen:
claude "Optimiere script.py fuer bessere Performance"
# Nachher: Optimierung messen
hyperfine --warmup 3 --export-json optimized.json 'python script.py'
# Vergleich:
hyperfine --warmup 3 'python script_old.py' 'python script.py'
```

### Workflow 2: Build-Zeiten mit Claude Code optimieren
Lange Build-Zeiten sind einer der groessten Produktivitaetskiller im Entwicklungsalltag. Dieser Workflow misst zuerst die aktuelle Build-Zeit, extrahiert den Durchschnittswert mit jq und uebergibt ihn als Kontext an Claude Code. So weiss Claude genau, wie langsam der aktuelle Build ist, und kann gezielt Optimierungen vorschlagen -- z.B. Caching, parallele Builds oder das Entfernen unnoetig importierter Module. Stell dir vor, dein npm-Build dauert 45 Sekunden und Claude schlaegt vor, auf esbuild umzusteigen -- nach der Aenderung misst du erneut und siehst, dass der Build nur noch 8 Sekunden dauert.
```bash
# Build-Zeit messen und Claude Code fragen
hyperfine --warmup 1 --export-json build-bench.json 'npm run build'
claude "Die Build-Zeit betraegt $(jq '.results[0].mean' build-bench.json)s. Optimiere die Build-Konfiguration."
```

### Workflow 3: Performance-Regression in CI/CD erkennen
In professionellen Softwareprojekten ist es wichtig, Performance-Regressionen fruehzeitig zu erkennen, bevor sie in die Produktion gelangen. Dieser Workflow benchmarkt die kompilierte Anwendung nach jedem Push und vergleicht die Ergebnisse mit der Baseline. Claude Code kann den gesamten GitHub Actions Workflow automatisch generieren, inklusive Schwellenwert-Pruefung und Benachrichtigung bei Regressionen. Stell dir vor, ein neuer Commit fuegt einen ineffizienten Algorithmus ein, der die Laufzeit um 20% erhoeht -- der automatische Check wuerde das sofort erkennen und den Entwickler warnen. Passe den Schwellenwert (hier 10%) an die Anforderungen deines Projekts an.
```bash
# In GitHub Actions: Benchmark nach jedem Push
hyperfine --export-json bench-current.json './target/release/app'
MEAN=$(jq '.results[0].mean' bench-current.json)
# Claude Code kann diesen Check automatisch generieren:
claude "Erstelle einen GitHub Actions Workflow, der bei Performance-Regression >10% warnt"
```

> 💡 **Tipp**: Claude Code kann hyperfine automatisch in Performance-Optimierungs-Workflows einsetzen, um die Wirksamkeit von Code-Aenderungen objektiv zu quantifizieren.

## 📺 Video-Tutorial

[Hyperfine: A Command-Line Benchmarking Tool (sharkdp)](https://github.com/sharkdp/hyperfine)
Die offizielle GitHub-Seite mit ausfuehrlicher Dokumentation, animierten Demos und Beispielen fuer alle wichtigen Features wie Warmup, Vergleiche und Export-Formate.

---

## Troubleshooting

Loesungen fuer haeufige Probleme mit hyperfine -- von Installationsfehlern ueber hohe Varianz bis zu Shell-Kompatibilitaet.

### Problem 1: hyperfine startet nicht

**Symptome:**
```bash
$ hyperfine 'ls'
hyperfine: command not found
```

**Lösung:**
```bash
# Prüfen ob hyperfine installiert ist
which hyperfine

# Installieren (macOS)
brew install hyperfine

# Oder via Cargo
cargo install hyperfine

# PATH prüfen
echo $PATH
```

### Problem 2: Benchmark zeigt hohe Varianz

Hohe Varianz (grosses Sigma) bedeutet, dass die Messwerte stark schwanken. Ursachen sind oft kalte Caches, Hintergrundprozesse oder I/O-Schwankungen:

**Symptome:**
```
Time (mean ± σ):      1.234 s ±  0.456 s
```
→ σ (Sigma) ist sehr hoch (~37% vom Mean)

**Lösung:**
```bash
# Mehr Warmup-Runs
hyperfine --warmup 10 'command'

# Mehr Runs für statistische Stabilität
hyperfine --runs 50 'command'

# Prepare-Command um Cache zu droppen
hyperfine --prepare 'sync' 'command'

# System-Load prüfen
# Andere Prozesse können Benchmark beeinflussen
htop  # Oder btop
```

### Problem 3: Command Exit-Code != 0

**Symptome:**
```bash
$ hyperfine 'false'
Error: Command terminated with non-zero exit code. Use the '-i'/'--ignore-failure' option if you want to ignore this.
```

**Lösung:**
```bash
# Mit --ignore-failure weitermachen
hyperfine --ignore-failure 'flaky-command'

# Oder Command fixen
hyperfine 'true'  # Sollte funktionieren
```

### Problem 4: Shell-Commands funktionieren nicht

Pipes, Variablen und andere Shell-Features funktionieren nur, wenn eine Shell explizit aktiviert ist. Ohne `--shell` versucht hyperfine, den Befehl direkt auszufuehren:

**Symptome:**
```bash
$ hyperfine 'ls | wc -l'
Error: No such file or directory (os error 2)
```

**Lösung:**
```bash
# Shell explizit aktivieren
hyperfine --shell=bash 'ls | wc -l'

# Oder für Zsh
hyperfine --shell=zsh 'ls | wc -l'
```

### Problem 5: Parameter-Substitution fehlschlägt

**Symptome:**
```bash
$ hyperfine --parameter-scan n 1 10 'echo {n}'
Error: Parameter 'n' not found in command
```

**Lösung:**
```bash
# Shell aktivieren für Variable-Substitution
hyperfine --shell=bash --parameter-scan n 1 10 'echo {n}'

# Oder mit --shell=none: Escaping nutzen
hyperfine --parameter-scan n 1 10 'echo' '{n}'
```

### Problem 6: Export schlägt fehl

**Symptome:**
```bash
$ hyperfine --export-json results.json 'ls'
Error: Permission denied (os error 13)
```

**Lösung:**
```bash
# Schreibrechte prüfen
ls -la results.json

# In anderes Verzeichnis exportieren
hyperfine --export-json ~/results.json 'ls'

# Oder mit sudo (nicht empfohlen)
sudo hyperfine --export-json /root/results.json 'ls'
```

### Problem 7: hyperfine ist zu langsam

**Symptome:**
```
hyperfine braucht 5 Minuten für einen Benchmark
```

**Lösung:**
```bash
# Weniger Runs
hyperfine --runs 5 'slow-command'

# Oder Time-Limit setzen
hyperfine --max-runs 100 --time-limit 30s 'command'

# Warmup reduzieren
hyperfine --warmup 1 'command'
```

### Problem 8: Benchmark-Ergebnisse inkonsistent

**Symptome:**
```
Wiederholte Benchmarks zeigen sehr unterschiedliche Ergebnisse
```

**Lösung:**
```bash
# System-Load prüfen
uptime  # Load average sollte niedrig sein

# Andere Prozesse stoppen
# CPU-intensive Prozesse beenden

# Prepare-Command für saubere Umgebung
hyperfine --prepare 'sync; sleep 1' 'command'

# Mehr Runs für statistische Sicherheit
hyperfine --runs 50 'command'
```

### Problem 9: JSON-Export ist korrupt

**Symptome:**
```bash
$ cat results.json
{
  "results": [
```
→ JSON unvollständig

**Lösung:**
```bash
# Disk-Space prüfen
df -h

# hyperfine neu ausführen
hyperfine --export-json results-new.json 'command'

# JSON validieren
python3 -m json.tool results-new.json
```

### Problem 10: Benchmark läuft ewig

**Symptome:**
```
hyperfine startet aber zeigt keine Fortschritte
```

**Lösung:**
```bash
# Time-Limit setzen
hyperfine --time-limit 60s 'command'

# Oder Max-Runs begrenzen
hyperfine --max-runs 10 'command'

# Mit --show-output debuggen
hyperfine --show-output 'command'
# → Zeigt ob Command überhaupt Output produziert
```

---

## Vergleich mit Alternativen

### hyperfine vs. time (Standard)

| Feature                | hyperfine                     | time                         |
|------------------------|-------------------------------|------------------------------|
| **Statistische Auswertung** | ✓✓✓ Mean, StdDev, Min/Max | ✗ Nur ein Run                |
| **Warmup**             | ✓✓✓ Konfigurierbar           | ✗ Nein                       |
| **Vergleiche**         | ✓✓✓ Mehrere Befehle parallel | ✗ Manuell                    |
| **Export**             | ✓✓✓ JSON, CSV, Markdown      | ✗ Nur stdout                 |
| **Parametrisierung**   | ✓✓✓ Range-Support            | ✗ Nein                       |
| **Benutzerfreundlichkeit** | ✓✓✓ Sehr intuitiv        | ✓✓ Basic                     |
| **Verfügbarkeit**      | ✓✓ Muss installiert werden   | ✓✓✓ Überall vorinstalliert   |

**Empfehlung:**
- **hyperfine**: Für alle seriösen Performance-Analysen
- **time**: Nur für Quick-Checks wenn hyperfine nicht verfügbar

### hyperfine vs. criterion (Rust)

| Feature                | hyperfine                     | criterion                    |
|------------------------|-------------------------------|------------------------------|
| **Use-Case**           | Command-Line-Tools            | Rust-Micro-Benchmarks        |
| **Granularität**       | ✓✓ Ganze Programme           | ✓✓✓ Einzelne Funktionen      |
| **Statistik**          | ✓✓✓ Umfangreich              | ✓✓✓ Sehr umfangreich         |
| **Visualisierung**     | ✓✓ Export + externe Tools    | ✓✓✓ HTML-Reports eingebaut   |
| **Integration**        | ✓✓✓ Jede Sprache             | ✓✓ Nur Rust                  |
| **Overhead**           | ✓✓ Prozess-Spawning          | ✓✓✓ In-Process               |

**Empfehlung:**
- **hyperfine**: Für Benchmarks von CLI-Tools jeder Sprache
- **criterion**: Für Rust-interne Micro-Benchmarks

### hyperfine vs. pytest-benchmark (Python)

| Feature                | hyperfine                     | pytest-benchmark             |
|------------------------|-------------------------------|------------------------------|
| **Scope**              | ✓✓✓ Ganze Programme          | ✓✓ Python-Funktionen         |
| **Sprach-Support**     | ✓✓✓ Jede Sprache             | ✗ Nur Python                 |
| **Test-Integration**   | ✗ Separate Tools             | ✓✓✓ In pytest integriert     |
| **Warmup**             | ✓✓✓ Konfigurierbar           | ✓✓✓ Konfigurierbar           |
| **Export**             | ✓✓✓ JSON, CSV, Markdown      | ✓✓✓ JSON, HTML               |
| **Visualisierung**     | ✓✓ Externe Tools             | ✓✓✓ HTML-Reports             |

**Empfehlung:**
- **hyperfine**: Für CLI-Tools oder sprachenübergreifende Vergleiche
- **pytest-benchmark**: Für Python-interne Performance-Tests

---

## Nützliche Links

### Offizielle Ressourcen:
- **GitHub Repo**: https://github.com/sharkdp/hyperfine
- **Releases**: https://github.com/sharkdp/hyperfine/releases
- **Documentation**: https://github.com/sharkdp/hyperfine/blob/master/doc/README.md

### Alternative Tools:
- **criterion**: https://github.com/bheisler/criterion.rs (Rust micro-benchmarks)
- **pytest-benchmark**: https://pytest-benchmark.readthedocs.io/ (Python)
- **JMH**: https://github.com/openjdk/jmh (Java)
- **Google Benchmark**: https://github.com/google/benchmark (C++)

### Tutorials:
- **Sharkdp Blog**: https://david-peter.de/articles/hyperfine
- **Rust Berlin Talk**: https://www.youtube.com/watch?v=xxxxx (hyperfine demo)

### Verwandte Themen:
- **Statistical Benchmarking**: https://en.wikipedia.org/wiki/Benchmark_(computing)
- **Performance Analysis**: https://www.brendangregg.com/blog/

---

## Pro-Tipps

Fortgeschrittene Techniken fuer den Power-User-Einsatz von hyperfine -- von Shell-Aliasen ueber Git-Hooks bis zu Visualisierung mit Python.

### 1. **Alias für häufige Benchmarks**
Definiere Aliase mit sinnvollen Defaults wie Warmup und automatischem Export:
```bash
# ~/.bashrc oder ~/.zshrc
alias bench='hyperfine --warmup 3'
alias bench-export='hyperfine --export-json benchmark-$(date +%Y%m%d-%H%M%S).json'
```

### 2. **Git-Hook für automatische Benchmarks**
Ein Pre-Commit-Hook kann automatisch Benchmarks ausfuehren und die Ergebnisse speichern, um Performance-Regressionen frueh zu erkennen:
```bash
# .git/hooks/pre-commit
#!/bin/bash

echo "Running performance benchmarks..."
hyperfine --export-json .benchmarks/pre-commit.json 'cargo test'

# Optional: Vergleich mit Baseline
# (siehe CI/CD-Integration)
```

### 3. **Benchmark-Template-Funktion**
Eine wiederverwendbare Shell-Funktion zum schnellen Vergleich von alter und neuer Implementation mit automatischem Export:
```bash
# ~/.bashrc
function benchmark-compare() {
  local old="$1"
  local new="$2"
  hyperfine --warmup 3 \
    --command-name "Old" "$old" \
    --command-name "New" "$new" \
    --export-json "benchmark-$(date +%Y%m%d).json"
}

# Usage:
# benchmark-compare 'python old.py' 'python new.py'
```

### 4. **Visualisierung mit Python**
Nutze matplotlib, um Benchmark-Ergebnisse als Balkendiagramm mit Fehlerbalken darzustellen:
```python
# visualize_benchmark.py
import json
import matplotlib.pyplot as plt
import sys

with open(sys.argv[1]) as f:
    data = json.load(f)

names = [r['command'] for r in data['results']]
means = [r['mean'] for r in data['results']]
stds = [r['stddev'] for r in data['results']]

plt.bar(names, means, yerr=stds, capsize=5)
plt.ylabel('Time (s)')
plt.title('Benchmark Results')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.savefig('benchmark.png', dpi=150)
print("Saved to benchmark.png")
```

**Usage:**
```bash
hyperfine --export-json results.json 'cmd1' 'cmd2' 'cmd3'
python visualize_benchmark.py results.json
```

### 5. **Regression-Testing im Makefile**
```makefile
# Makefile
.PHONY: bench bench-baseline bench-compare

bench:
\t@hyperfine --warmup 3 --export-json benchmark-current.json './program'

bench-baseline:
\t@git stash
\t@git checkout main
\t@make build
\t@hyperfine --warmup 3 --export-json benchmark-baseline.json './program'
\t@git checkout -
\t@git stash pop

bench-compare: bench-baseline bench
\t@python compare-benchmarks.py benchmark-baseline.json benchmark-current.json
```

### 6. **Adaptive Benchmarking (weniger Runs bei stabilen Results)**
```bash
# Nicht direkt mit hyperfine möglich, aber Wrapper:
#!/bin/bash
# adaptive_benchmark.sh

MIN_RUNS=5
MAX_RUNS=50
STABILITY_THRESHOLD=0.05  # 5% StdDev

runs=$MIN_RUNS
while [ $runs -le $MAX_RUNS ]; do
  hyperfine --runs $runs --export-json tmp.json "$@"

  mean=$(jq '.results[0].mean' tmp.json)
  stddev=$(jq '.results[0].stddev' tmp.json)
  cv=$(echo "$stddev / $mean" | bc -l)

  if (( $(echo "$cv < $STABILITY_THRESHOLD" | bc -l) )); then
    echo "Stable after $runs runs (CV: $cv)"
    break
  fi

  runs=$((runs + 5))
done

mv tmp.json final-benchmark.json
```

### 7. **Benchmark-Report-Generator**
```python
# generate_report.py
import json
import sys
from datetime import datetime

with open(sys.argv[1]) as f:
    data = json.load(f)

print(f"# Benchmark Report - {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
print("## Summary\n")

for i, result in enumerate(data['results'], 1):
    print(f"### {i}. {result['command']}\n")
    print(f"- **Mean**: {result['mean']:.3f}s ± {result['stddev']:.3f}s")
    print(f"- **Range**: {result['min']:.3f}s - {result['max']:.3f}s")
    print(f"- **Runs**: {len(result['times'])}")
    print()

# Relative Vergleiche
if len(data['results']) > 1:
    print("## Relative Performance\n")
    fastest = min(data['results'], key=lambda r: r['mean'])
    for result in sorted(data['results'], key=lambda r: r['mean']):
        if result == fastest:
            print(f"- {result['command']}: **Baseline** (fastest)")
        else:
            ratio = result['mean'] / fastest['mean']
            print(f"- {result['command']}: {ratio:.2f}x slower")
```

### 8. **Parallel Benchmark-Suites**
```bash
# Nicht direkt parallel, aber sequenziell organisieren:
# benchmark_suite.sh

echo "=== Compiler Benchmarks ==="
hyperfine --export-json compiler.json \
  'gcc -O0 program.c -o program && ./program' \
  'gcc -O3 program.c -o program && ./program' \
  'clang -O3 program.c -o program && ./program'

echo "=== Runtime Benchmarks ==="
hyperfine --export-json runtime.json \
  'python3 script.py' \
  'pypy3 script.py' \
  './rust-binary'

echo "=== I/O Benchmarks ==="
hyperfine --export-json io.json \
  'cat large-file | wc -l' \
  'wc -l < large-file'

# Merge all results
jq -s '.[0] * .[1] * .[2]' compiler.json runtime.json io.json > full-suite.json
```

### 9. **Docker-Benchmarks**
```bash
# Docker-Build-Zeiten vergleichen
hyperfine --warmup 1 --prepare 'docker system prune -af' \
  --command-name "Dockerfile.old" 'docker build -f Dockerfile.old -t test:old .' \
  --command-name "Dockerfile.new" 'docker build -f Dockerfile.new -t test:new .'
```

### 10. **Heatmap für Parameter-Tuning (mit Python)**
```python
# heatmap_tuning.py
import json
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Benchmark mit 2 Parametern durchführen
# hyperfine --export-json results.json \
#   --parameter-scan threads 1 8 \
#   --parameter-scan batch 100 1000 \
#   'program --threads {threads} --batch {batch}'

with open('results.json') as f:
    data = json.load(f)

# Extract params
threads_vals = sorted(set([r['parameters']['threads'] for r in data['results']]))
batch_vals = sorted(set([r['parameters']['batch'] for r in data['results']]))

# Build matrix
matrix = np.zeros((len(threads_vals), len(batch_vals)))
for result in data['results']:
    i = threads_vals.index(result['parameters']['threads'])
    j = batch_vals.index(result['parameters']['batch'])
    matrix[i, j] = result['mean']

# Plot heatmap
plt.figure(figsize=(10, 8))
sns.heatmap(matrix, annot=True, fmt='.3f',
            xticklabels=batch_vals, yticklabels=threads_vals,
            cmap='YlOrRd_r')  # Reversed: lower is better
plt.xlabel('Batch Size')
plt.ylabel('Threads')
plt.title('Performance Heatmap (seconds)')
plt.savefig('tuning-heatmap.png', dpi=150)
```

---

## Zusammenfassung

**hyperfine** ist ein modernes Command-Line-Benchmarking-Tool, geschrieben in Rust, das statistische Performance-Analysen von Befehlen, Skripten und Programmen mit präzisen Messungen und umfangreichen Export-Optionen durchführt.

### Key-Takeaways:

1. **Statistische Präzision**: Automatische Mehrfach-Runs mit Mean, StdDev, Min, Max
2. **Warmup-Phase**: Cache-Effekte minimieren für reproduzierbare Ergebnisse
3. **Vergleichende Benchmarks**: Mehrere Befehle gleichzeitig mit relativen Speedups
4. **Parametrisierung**: Benchmark-Serien mit verschiedenen Inputs
5. **Export**: JSON, CSV, Markdown für weitere Analysen

### Wann hyperfine nutzen:

- ✓ **Performance-Vergleiche**: Code-Optimierungen quantifizieren
- ✓ **Algorithmen-Benchmarks**: Verschiedene Ansätze vergleichen
- ✓ **Compiler-Optimierung**: Flags und Optionen testen
- ✓ **CLI-Tool-Vergleiche**: Alternative Tools objektiv bewerten
- ✓ **CI/CD**: Performance-Regressionen automatisch erkennen

### Vorteile gegenüber `time`:

- **Statistisch**: Mehrere Runs mit Durchschnitt und Streuung
- **Warmup**: Cache-stabile Messungen
- **Vergleiche**: Automatische relative Speedups
- **Export**: JSON/CSV/Markdown für Automatisierung

### Best Practice:

1. **Installation**: Via Package-Manager oder Cargo
2. **Warmup**: Immer 3-5 Warmup-Runs nutzen
3. **Runs**: Minimum 10 Runs für Signifikanz
4. **Export**: JSON für Versionskontrolle und CI/CD
5. **Integration**: Mit Claude Code für intelligente Analysen
6. **Vergleiche**: Command-Names für bessere Übersicht
7. **Parameter-Scanning**: Für Optimization und Tuning

**Next Steps**: Probiere hyperfine aus, benchmarke deine Tools, integriere es in CI/CD, und nutze Claude für intelligente Performance-Analysen!
