# Lektion 24: htop - Interactive Process Viewer

## 📋 Metadata
- **Kategorie**: Fortgeschrittene Tools
- **Schwierigkeit**: Anfänger bis Mittel
- **Voraussetzungen**: Lektion 01-04 (Grundlagen), Basis-Terminal-Kenntnisse
- **Lernzeit**: 30-40 Minuten
- **Zielgruppe**: Alle Entwickler, DevOps, System-Administratoren

---

> 🚀 **Claude Code Relevanz**: htop hilft dabei, Ressourcenverbrauch von Claude Code Prozessen, laufenden Build-Pipelines und Entwicklungsservern in Echtzeit zu ueberwachen und Engpaesse sofort zu erkennen.

## 🎯 Berechtigung: Warum htop?

### Problem mit klassischem `top`:
```bash
# Klassisches top: Schwer lesbar, unintuitiv
$ top
top - 14:23:45 up 5 days, 3:21, 2 users, load average: 0.52, 0.58, 0.59
Tasks: 247 total, 1 running, 246 sleeping, 0 stopped, 0 zombie
%Cpu(s): 3.2 us, 1.5 sy, 0.0 ni, 95.1 id, 0.2 wa, 0.0 hi, 0.0 si, 0.0 st
KiB Mem : 16384000 total, 2345678 free, 8765432 used, 5272890 buff/cache
KiB Swap: 4194304 total, 4194304 free, 0 used. 6543210 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
 1234 user      20   0 4567890 345678  12345 S   5.6  2.1   0:12.34 node
```

**Probleme**:
❌ Keine visuelle CPU-Bars (schwer zu erfassen)
❌ Keine Mouse-Support
❌ Prozesse können nicht einfach gekillt werden
❌ Sortierung umständlich zu ändern
❌ Keine Baum-Ansicht für Parent-Child Prozesse

### Lösung mit htop:
```
  1[||||||||||||||||||||||||||||50.0%]   Tasks: 89, 134 thr; 2 running
  2[||||||||||||||||||||||        32.1%]   Load average: 1.24 0.87 0.56
  3[|||||||||||||||                25.4%]   Uptime: 05:23:45
  4[|||||||||||||                  22.0%]
  Mem[|||||||||||||||||||||||10.2G/16.0G]
  Swp[                          0K/4.00G]

  PID USER      PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command
 1234 user       20   0 4456M  337M 12.1M S 55.6  2.1  0:12.34 node server.js
 5678 user       20   0  892M  234M 45.3M R 12.3  1.4  0:45.12 ├─ npm start
 9012 user       20   0 1.2G   456M 78.9M S  8.9  2.8  1:23.45 └─ webpack
```

**Vorteile**:
✅ **Visuelle Bars**: CPU/Memory auf einen Blick
✅ **Mouse-Support**: Click to select, scroll, kill
✅ **Tree-View**: Parent-Child Beziehungen sehen (F5)
✅ **Intuitive Shortcuts**: F9=Kill, F6=Sort, F4=Filter
✅ **Color-Coded**: Prozess-Typen farblich markiert

---

## 🎯 Zwecke: Wofür wird htop verwendet?

### 1. **System-Monitoring**
- CPU-Auslastung pro Core sehen
- Memory-Usage überwachen
- Swap-Nutzung beobachten
- Load-Average verstehen

### 2. **Performance-Debugging**
- Ressourcen-Fresser finden
- Memory-Leaks identifizieren
- CPU-Hogs aufspüren
- Zombie-Prozesse erkennen

### 3. **Prozess-Management**
- Prozesse killen (SIGTERM, SIGKILL)
- Nice-Level ändern (Priorität)
- CPU-Affinity setzen
- Prozess-Details inspizieren

### 4. **Development-Workflows**
- Node.js/Python App-Monitoring
- Docker-Container Resource-Check
- CI/CD-Pipeline Debugging
- Build-Process-Analyse

### 5. **DevOps-Tasks**
- Server-Health-Checks
- Incident-Response
- Capacity-Planning
- Production-Debugging

---

## 🚀 Verwendung

### Installation

#### macOS (mit Homebrew):
```bash
brew install htop
```

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install htop
```

#### Arch Linux:
```bash
sudo pacman -S htop
```

---

### Quick Start: Erste Schritte

#### 1. **htop starten**
```bash
# Standard-Modus
htop

# Mit Filter (nur User-Prozesse)
htop -u $(whoami)

# Tree-View direkt
htop -t

# Sortiert nach Memory
htop --sort-key PERCENT_MEM
```

#### 2. **Wichtigste Shortcuts**
```
F1 oder ?   : Hilfe
F2          : Setup (Anpassungen)
F3 oder /   : Suchen
F4 oder \   : Filter
F5 oder t   : Tree-View
F6 oder >   : Sortierung wählen
F7 oder ]   : Nice erhöhen (weniger Priorität)
F8 oder [   : Nice senken (mehr Priorität)
F9 oder k   : Prozess killen
F10 oder q  : Beenden

Space       : Prozess markieren
U           : Markierung aufheben
c           : Tag Command-Line anzeigen
M           : Nach Memory sortieren
P           : Nach CPU sortieren
T           : Nach Time sortieren
```

#### 3. **Navigation**
```
↑↓          : Durch Prozesse bewegen
PgUp/PgDn   : Seitenweise scrollen
Home/End    : Zum Anfang/Ende springen
Mouse       : Click & Scroll (falls aktiviert)
```

#### 4. **Prozesse filtern**
```bash
# Nur eigene Prozesse
htop -u $USER

# Nur bestimmter User
htop -u postgres

# Filtern während htop läuft: F4, dann Begriff eingeben
# z.B. "node" zeigt nur Node.js-Prozesse
```

#### 5. **Config-File**
```bash
# htop speichert Settings in
~/.config/htop/htoprc

# Backup erstellen
cp ~/.config/htop/htoprc ~/.config/htop/htoprc.backup
```

---

### Advanced Usage

#### 1. **Custom Columns konfigurieren**
```
F2 → Setup → Columns

Verfügbare Columns:
- PID: Process ID
- USER: Owner
- PRIORITY: Scheduling priority
- NICE: Nice value
- M_SIZE: Total program size
- M_RESIDENT: Resident memory
- M_SHARE: Shared memory
- STATE: Process state (R, S, D, Z)
- PERCENT_CPU: CPU percentage
- PERCENT_MEM: Memory percentage
- TIME: CPU time
- COMMAND: Command line
- ... viele mehr
```

#### 2. **Color-Schemes anpassen**
```
F2 → Display options → Colors

Themes:
- Default
- Monochrome
- Black on White
- Light Terminal
- MC (Midnight Commander)
- Black Night
- Broken Gray
```

#### 3. **Process-Tree mit Folding**
```bash
# Tree-View aktivieren
F5 oder t

# Im Tree-View:
+ oder Space  : Subtree auf/zuklappen
- oder Space  : Subtree zuklappen
```

#### 4. **Multiple Prozesse auf einmal killen**
```
# Prozesse markieren
Space auf Prozess 1
Space auf Prozess 2
Space auf Prozess 3

# Alle markierten killen
F9 → Select Signal → SIGTERM oder SIGKILL
```

#### 5. **CPU-Affinity setzen**
```
# Prozess auswählen
a → CPU-Affinity Dialog

# Bestimmte CPU-Cores an/abwählen
# Nützlich für Performance-Testing
```

#### 6. **strace-Integration**
```
# Prozess auswählen
s → strace starten

# Zeigt alle System-Calls des Prozesses
# Nützlich für Debugging
```

---

## 💡 Best Practices

### 1. **Persistente Config**
```bash
# .config/htop/htoprc anpassen
cat > ~/.config/htop/htoprc << 'EOF'
# Fields: PID USER PRIORITY NICE M_SIZE M_RESIDENT M_SHARE STATE PERCENT_CPU PERCENT_MEM TIME COMM
fields=0 48 17 18 38 39 40 2 46 47 49 1
# Sort by CPU (field 46)
sort_key=46
sort_direction=-1
tree_view=1
hide_kernel_threads=1
hide_userland_threads=0
shadow_other_users=0
show_thread_names=1
show_program_path=0
highlight_base_name=1
highlight_megabytes=1
highlight_threads=1
tree_view_always_by_pid=0
header_margin=1
detailed_cpu_time=1
cpu_count_from_one=1
show_cpu_usage=1
show_cpu_frequency=0
update_process_names=0
account_guest_in_cpu_meter=0
color_scheme=0
enable_mouse=1
delay=15
left_meters=AllCPUs Memory Swap
left_meter_modes=1 1 1
right_meters=Tasks LoadAverage Uptime
right_meter_modes=2 2 2
EOF
```

### 2. **Alias für häufige Tasks**
```bash
# .bashrc oder .zshrc
alias h='htop'
alias ht='htop -t'              # Tree-View
alias hm='htop --sort-key PERCENT_MEM'  # Nach Memory sortiert
alias hc='htop --sort-key PERCENT_CPU'  # Nach CPU sortiert
alias hu='htop -u $USER'        # Nur eigene Prozesse
```

### 3. **Batch-Mode für Scripting**
```bash
# htop-Snapshot für Logging
htop --no-mouse --no-color > system-snapshot.txt

# Oder mit top-Kompatibilität
htop -d 10 > htop.log  # 10 = 1 second delay
```

### 4. **Monitoring-Script**
```bash
# high-cpu-alert.sh
cat > high-cpu-alert.sh << 'EOF'
#!/bin/bash
# Alert wenn CPU > 80%
while true; do
  CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
  if (( $(echo "$CPU > 80" | bc -l) )); then
    echo "⚠️  HIGH CPU: ${CPU}%"
    htop -d 10 --no-mouse > high-cpu-$(date +%s).log
    sleep 60
  fi
  sleep 5
done
EOF
chmod +x high-cpu-alert.sh
```

### 5. **Docker-Container-Monitoring**
```bash
# htop innerhalb Container
docker run -it --pid=host ubuntu htop

# Oder mit nsenter
sudo nsenter -t $(docker inspect -f '{{.State.Pid}}' container_name) -p -n htop
```

---

## 📚 Beispiele

### Beispiel 1: Memory-Leak finden
```bash
# htop starten, nach Memory sortieren
htop --sort-key PERCENT_MEM

# Prozess mit stetig steigendem Memory-Verbrauch identifizieren
# z.B. Node.js App bei 2GB → 4GB → 6GB in 10 Minuten
# → Memory-Leak wahrscheinlich

# Details ansehen: Enter auf Prozess
# → Command-Line, Environment-Vars, Open Files sehen
```

### Beispiel 2: CPU-Hog killen
```bash
# htop starten
htop

# Nach CPU sortieren: Shift+P oder F6 → PERCENT_CPU
# Prozess auswählen (z.B. runaway script bei 100% CPU)
# F9 → SIGTERM (15) → Enter
# Warten 5 Sekunden
# Falls noch läuft: F9 → SIGKILL (9) → Enter
```

### Beispiel 3: Zombie-Prozesse finden
```bash
# htop starten
htop

# Im Header steht: "Tasks: 247 total, 1 running, 244 sleeping, 2 zombie"
# Filter aktivieren: F4
# Eingeben: "Z" (Zombie-State)
# Zombies anzeigen

# Zombies killen:
# Parent-Process finden (PPID)
# Parent killen → Zombies werden aufgeräumt
```

### Beispiel 4: Docker-Container Resource-Check
```bash
# htop mit Docker-Container-Namen
htop

# Filter: F4 → "docker" oder "containerd"
# Tree-View: F5
# Sieht aus wie:
# 1234 root    docker-containerd
# ├─ 5678 root    docker-proxy
# ├─ 9012 user    node (Container 1)
# └─ 3456 user    python (Container 2)
```

### Beispiel 5: Build-Process überwachen
```bash
# Terminal 1: Build starten
npm run build

# Terminal 2: htop starten, nach CPU sortieren
htop --sort-key PERCENT_CPU

# Beobachten welche Build-Steps CPU-intensiv sind
# z.B.:
# webpack: 400% CPU (4 Cores)
# babel: 200% CPU (2 Cores)
# uglifyjs: 100% CPU (1 Core)
```

### Beispiel 6: Nice-Level anpassen
```bash
# htop starten
htop

# Prozess auswählen (z.B. background-job)
# F7 mehrmals drücken → Nice erhöhen (niedrigere Priorität)
# Nice von 0 → 10 → 19 (niedrigste Priorität)

# Oder F8 für höhere Priorität (erfordert oft root)
```

### Beispiel 7: Multi-User System überwachen
```bash
# Als Admin: Alle User-Prozesse sehen
sudo htop

# Nach User gruppiert sortieren
F6 → USER

# Sieht aus wie:
# alice: 12 Prozesse, 2.3GB Memory
# bob:   8 Prozesse, 1.5GB Memory
# charlie: 45 Prozesse, 8.7GB Memory ← Resource-Hog!
```

### Beispiel 8: Load-Average verstehen
```bash
# htop Header zeigt:
# Load average: 1.24 0.87 0.56
#               ^1min ^5min ^15min

# Interpretation (4-Core-System):
# < 4.0  : OK
# 4.0-8.0: Hoch, aber manageable
# > 8.0  : Overloaded!

# Im htop: Rechte Spalte → LoadAverage Meter zeigt Grafik
```

### Beispiel 9: Prozess-Details inspizieren
```bash
# htop starten
htop

# Prozess auswählen
# Enter drücken → Detail-View

# Zeigt:
# - Command-Line mit allen Args
# - Environment-Variables
# - Open Files (lsof-Integration)
# - Thread-Count
# - CPU-Affinity
```

### Beispiel 10: Python-Script-Debugging
```bash
# Python-Script läuft langsam
# htop starten
htop

# Nach CPU sortieren: P
# Filter: F4 → "python"

# Tree-View: F5
# Sieht aus wie:
# 1234 python main.py
# ├─ 5678 python (thread 1) - 95% CPU
# ├─ 9012 python (thread 2) - 5% CPU
# └─ 3456 python (thread 3) - 2% CPU

# → Thread 1 ist Bottleneck!
```

---

## 🔧 Integration in Claude Code Workflows

### 1. **Performance-Report mit htop + Claude**
```bash
# htop-Snapshot erstellen
htop -d 30 --no-mouse > system-report.txt

# Von Claude analysieren lassen
cat system-report.txt | claude "Analyze this system state and identify performance bottlenecks"
```

### 2. **Automated Performance-Monitoring**
```bash
# Script: performance-check.sh
cat > performance-check.sh << 'EOF'
#!/bin/bash
# Snapshot erstellen
htop --no-mouse -d 10 > htop-snapshot-$(date +%s).txt

# Top 10 CPU-Prozesse loggen
ps aux --sort=-%cpu | head -10 > top-cpu.txt

# Claude-Analyse
claude "Analyze these system metrics and suggest optimizations" < htop-snapshot-*.txt
EOF
```

### 3. **Memory-Leak-Detection**
```bash
# Monitoring-Script mit Claude-Alert
while true; do
  MEM=$(free | grep Mem | awk '{print ($3/$2) * 100.0}')
  if (( $(echo "$MEM > 85" | bc -l) )); then
    htop -d 10 > mem-alert-$(date +%s).txt
    cat mem-alert-*.txt | claude "Identify memory leak suspects in this system snapshot"
  fi
  sleep 60
done
```

### 4. **CI/CD Performance-Profiling**
```bash
# In GitHub Actions / GitLab CI
jobs:
  performance-check:
    runs-on: ubuntu-latest
    steps:
      - name: Monitor Build Performance
        run: |
          htop -d 30 > build-perf.txt &
          HTOP_PID=$!
          npm run build
          kill $HTOP_PID

      - name: Analyze with Claude
        run: |
          claude "Analyze build performance from this htop log" < build-perf.txt
```

---

## 🤖 Claude Code Integration

### Workflow 1: Ressourcen waehrend Claude Code Session monitoren
```bash
# In separatem Terminal-Pane
htop -p $(pgrep -f "node.*claude")
```

### Workflow 2: Speicherfresser identifizieren
```bash
htop --sort-key=PERCENT_MEM
```

### Workflow 3: Build-Prozesse ueberwachen
```bash
htop --filter="node\|npm\|tsc"
```

> 💡 **Tipp**: Nutze htop in einem separaten tmux-Pane um die Systemlast waehrend Claude Code Sessions im Blick zu behalten.

---

## 🐛 Troubleshooting

### Problem 1: htop zeigt falsche CPU-Werte
```bash
# Problem: CPU-% > 100% bei Single-Core-Prozess
# Grund: htop zeigt Gesamt-CPU (alle Cores)

# Lösung: Pro-Core-Prozent sehen
F2 → Display options → Detailed CPU time → Enable

# Oder: Spalten-Ansicht ändern
F2 → Columns → CPU% hinzufügen
```

### Problem 2: Mouse-Support funktioniert nicht
```bash
# Terminal-Emulator muss Mouse-Events unterstützen
# Test:
echo $TERM  # sollte xterm-256color oder ähnlich sein

# Lösung: In htop aktivieren
F2 → Display options → Enable mouse → Enable

# Oder in Config
echo "enable_mouse=1" >> ~/.config/htop/htoprc
```

### Problem 3: Tree-View zeigt nur PIDs
```bash
# Problem: Keine Command-Names im Tree
# Lösung:
F2 → Display options → Show program path: tree → Enable
```

### Problem 4: htop-Fehlermeldung "Permission denied"
```bash
# Problem: Kann andere User-Prozesse nicht sehen
# Lösung: Mit sudo
sudo htop

# Oder: Nur eigene Prozesse
htop -u $USER
```

### Problem 5: htop ist sehr langsam
```bash
# Problem: Update-Delay zu kurz
# Lösung: Delay erhöhen
htop -d 50  # 50 = 5 Sekunden (Einheit: 0.1s)

# Oder in Config
F2 → Display options → Update process names: Disable
```

---

## 📊 Vergleich: htop vs. Alternativen

| Feature | **htop** | top | btop | glances | bottom |
|---------|---------|-----|------|---------|--------|
| **Interaktiv** | ✅ Ja | ⚠️ Basic | ✅ Ja | ✅ Ja | ✅ Ja |
| **Mouse-Support** | ✅ Ja | ❌ Nein | ✅ Ja | ✅ Ja | ✅ Ja |
| **Tree-View** | ✅ Ja | ❌ Nein | ✅ Ja | ⚠️ Basic | ✅ Ja |
| **Visuals** | 🟢 Gut | 🔴 Basic | 🏆 Exzellent | 🟡 Gut | 🟡 Gut |
| **Performance** | ⚡ Schnell | ⚡ Schnell | Mittel | Mittel | Schnell |
| **Config** | 🟢 Einfach | ❌ Keine | 🟡 Mittel | 🟢 Einfach | 🟢 Einfach |
| **Cross-Platform** | ✅ Linux/Mac | ✅ Überall | ✅ Linux/Mac/Win | ✅ Linux/Mac/Win | ✅ Linux/Mac/Win |
| **Dependencies** | 🟢 Wenige | ✅ Keine | 🟡 C++ | 🔴 Python | 🟡 Rust |
| **Install-Size** | 🟢 Klein | ✅ Pre-installed | 🟡 Mittel | 🔴 Groß | 🟡 Mittel |

### Wann welches Tool?

**Verwende htop wenn:**
- ✅ Interaktive Process-Verwaltung benötigt
- ✅ Tree-View wichtig ist
- ✅ Standardtool für tägliche Arbeit
- ✅ Einfache Installation gewünscht

**Verwende btop wenn:**
- ✅ Moderne, schöne UI wichtig ist
- ✅ Mehr Grafiken/Visualisierungen gewünscht
- ✅ Disk I/O, Network Stats wichtig

**Verwende top wenn:**
- ✅ Minimale Dependencies erforderlich
- ✅ Auf jedem System verfügbar sein muss
- ✅ Scripting mit bekanntem Output

**Verwende glances wenn:**
- ✅ Web-UI für Remote-Monitoring
- ✅ Docker/Container-Statistiken wichtig
- ✅ Plugin-System benötigt

---

## 🔗 Weiterführende Links

### Offizielle Ressourcen:
- **htop GitHub**: https://github.com/htop-dev/htop
- **htop Homepage**: https://htop.dev/
- **Man-Page**: `man htop`

### Tutorials & Guides:
- **htop Explained**: https://www.howtogeek.com/451462/htop-explained/
- **Linux Performance**: https://www.brendangregg.com/linuxperf.html

### Alternativen:
- **btop**: https://github.com/aristocratos/btop
- **glances**: https://github.com/nicolargo/glances
- **bottom**: https://github.com/ClementTsang/bottom

---

## 💎 Pro-Tipps

### Tipp 1: Quick-Filter mit F4
```bash
# htop starten
htop

# F4 drücken, dann Begriff eingeben
# z.B. "docker" → zeigt nur Docker-Prozesse
# z.B. "python" → zeigt nur Python-Prozesse
# Escape zum Zurücksetzen
```

### Tipp 2: Follow-Mode
```bash
# Prozess auswählen
# F (Follow) drücken
# htop scrollt automatisch zum Prozess, auch wenn er Position ändert
# Nützlich bei dynamischen Prozess-Listen
```

### Tipp 3: Space-Bar für Multi-Selection
```bash
# Mehrere Prozesse markieren mit Space
# Dann F9 → Alle auf einmal killen
# Oder: Nice-Level aller ändern (F7/F8)
```

### Tipp 4: Custom-Setup per User
```bash
# Verschiedene Configs für verschiedene Tasks
cp ~/.config/htop/htoprc ~/.config/htop/htoprc-dev
cp ~/.config/htop/htoprc ~/.config/htop/htoprc-ops

# Aliases
alias htop-dev='htop --config ~/.config/htop/htoprc-dev'
alias htop-ops='htop --config ~/.config/htop/htoprc-ops'
```

### Tipp 5: SSH + htop für Remote-Monitoring
```bash
# Remote-Server monitoren
ssh user@server htop

# Oder mit tmux für persistentes Monitoring
ssh user@server -t 'tmux new-session -A -s monitor htop'
```

---

## 📝 Zusammenfassung

**htop** ist der moderne, interaktive Process-Viewer:

### ✅ Hauptvorteile:
- **Visuell**: CPU/Memory-Bars auf einen Blick
- **Interaktiv**: Mouse-Support, intuitive Shortcuts
- **Tree-View**: Parent-Child-Beziehungen sehen
- **Einfach**: Kill, Nice, Filter mit F-Keys
- **Standard**: Auf fast allen Linux/Mac-Systemen verfügbar

### 🎯 Kern-Use-Cases:
1. **System-Monitoring**: CPU, Memory, Load überwachen
2. **Performance-Debugging**: Resource-Hogs finden
3. **Prozess-Management**: Kill, Nice, Affinity
4. **Development**: App-Performance überwachen
5. **DevOps**: Server-Health-Checks

### 🚀 Wichtigste Shortcuts:
```
F3: Suchen       F4: Filter      F5: Tree
F6: Sortieren    F9: Kill        F10: Quit
P: CPU-Sort      M: Mem-Sort     T: Time-Sort
```

### 💡 Best Practice:
```bash
# Alias in .bashrc/.zshrc
alias h='htop'
alias ht='htop -t'  # Tree-View
alias hu='htop -u $USER'  # Nur eigene

# Tree-View + Nach CPU sortiert
htop -t --sort-key PERCENT_CPU
```

### ⚠️ Wichtig:
- htop ist **Monitor**, nicht **Profiler** (nutze perf/flamegraph für detailliertes Profiling)
- Für Container: nutze `docker stats` zusätzlich
- Für Disk I/O: nutze `iotop` zusätzlich
- Für Network: nutze `iftop` zusätzlich

### 🔗 Integration:
Perfekt kombinierbar mit **btop** (Lektion 25, modernere Alternative), **tmux** (Session-Monitoring), **Docker** (Container-Überwachung), und **Claude Code** für AI-gestützte Performance-Analyse.

**Nächste Lektion**: [25-btop.md](./25-btop.md) - Modern Process Monitor mit besseren Visuals

---

**🎓 Claude Code Masterkurs** | © 2026 | [Zurück zur Übersicht](../README.md)
