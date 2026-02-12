# Lektion 25: btop - Modern Process Monitor

## Berechtigung

**btop** ist ein moderner, ressourcenschonender System-Monitor mit einer interaktiven Terminal-UI, der eine umfassende Übersicht über CPU, Memory, Disk und Network in einer einzigen Ansicht bietet. Es ist der Nachfolger von `bashtop` und `bpytop`, geschrieben in C++ für maximale Performance.

### Was btop macht:
- **System-Monitoring**: CPU, RAM, Swap, Disk I/O, Network Traffic in Echtzeit
- **Process-Management**: Prozesse sortieren, filtern, beenden, Priorität ändern
- **Visuelle Darstellung**: Farbige Graphen, Bars und Trees für bessere Übersicht
- **Mouse-Support**: Vollständige Maus-Unterstützung für Navigation und Aktionen
- **Themes**: Anpassbare Farbschemata und Layouts
- **Performance**: Sehr ressourcenschonend trotz reicher UI

### Typische Anwendungsfälle:
- System-Performance in Echtzeit überwachen
- Ressourcen-Engpässe identifizieren (CPU, Memory, Disk, Network)
- Prozesse mit hohem Ressourcenverbrauch finden und beenden
- Server-Monitoring während Deployments
- Docker-Container-Performance analysieren
- Entwicklungs-Umgebungen optimieren

---

> 🚀 **Claude Code Relevanz**: btop ermoeglicht es, waehrend Claude Code laeuft, die Systemressourcen in Echtzeit zu ueberwachen und so Engpaesse bei CPU, RAM oder I/O sofort zu erkennen und Workflows zu optimieren.

## Zwecke

### 1. **Umfassende System-Übersicht**
btop zeigt alle wichtigen System-Metriken in einer übersichtlichen Ansicht:
- CPU-Auslastung pro Core mit Historie
- Memory und Swap Usage mit Details
- Disk I/O für alle Laufwerke
- Network Traffic für alle Interfaces

> 💡 **Tipp**: Starte btop in einem separaten tmux-Pane, waehrend Claude Code in einem anderen Pane arbeitet -- so hast du immer die Ressourcen im Blick.

### 2. **Interaktives Process-Management**
- Prozesse nach CPU, Memory, PID, User sortieren
- Prozesse mit Regex-Pattern filtern
- Prozess-Tree für Parent-Child-Beziehungen
- Prozesse beenden (SIGTERM, SIGKILL)
- Process-Priorität ändern (nice/renice)

### 3. **Performance-Analyse**
- Historische Graphen für Trend-Analyse
- Per-Core CPU-Monitoring für Threading-Issues
- Disk I/O Patterns erkennen
- Network Bandwidth Usage tracken
- Memory Leaks identifizieren

### 4. **Bessere User Experience als htop**
- Mouse-Support für intuitive Navigation
- Themes für bessere Lesbarkeit
- Anpassbare Layouts (CPU oben/unten, Process-Liste Größe)
- Intelligentes Resizing bei Terminal-Größenänderung
- Hotkeys für schnelle Aktionen

---

## Verwendung

Dieser Abschnitt fuehrt dich durch die Installation, Konfiguration und taegliche Nutzung von btop. Von der ersten Installation bis zu fortgeschrittenen Anpassungen findest du hier alles, was du fuer effektives System-Monitoring brauchst.

### Installation

Die Installation von btop variiert je nach Betriebssystem. Auf macOS ist Homebrew der schnellste Weg, waehrend unter Linux je nach Distribution ein Paketmanager oder das Kompilieren aus dem Quellcode noetig ist.

#### macOS (via Homebrew):
Homebrew ist der einfachste Installationsweg auf macOS. Nach der Installation kannst du btop sofort mit dem gleichnamigen Befehl starten:
```bash
# btop installieren
brew install btop

# Version prüfen
btop --version

# btop starten
btop
```

#### Ubuntu/Debian:
Unter Ubuntu/Debian empfiehlt es sich, btop aus dem Quellcode zu kompilieren, da die Paketmanager-Version oft veraltet ist. Alternativ steht Snap zur Verfuegung:
```bash
# Dependencies installieren
sudo apt update
sudo apt install -y build-essential git

# btop aus Source kompilieren (empfohlen für neueste Version)
git clone https://github.com/aristocratos/btop.git
cd btop
make
sudo make install

# Oder via Snap (falls verfügbar)
sudo snap install btop

# Version prüfen
btop --version
```

#### Arch Linux:
Arch Linux stellt btop direkt ueber die offiziellen Repositories bereit:
```bash
# btop aus AUR installieren
sudo pacman -S btop

# Version prüfen
btop --version
```

### Basis-Verwendung

btop bietet verschiedene Startoptionen, mit denen du Theme, Layout und Update-Geschwindigkeit direkt beim Aufruf festlegen kannst. Die wichtigsten Flags im Ueberblick:
```bash
# btop starten (Standard-View)
btop

# Mit spezifischem Theme starten
btop --theme gruvbox_dark

# Mit Preset-Layout starten
btop --preset 0  # Default
btop --preset 1  # CPU oben, Prozesse unten
btop --preset 2  # CPU unten, Prozesse oben

# Mit Update-Intervall (in ms)
btop --update 1000  # Update alle 1 Sekunde

# Mit Low-Color-Mode (für alte Terminals)
btop --low-color

# Mit TTY-Mode (für TTY ohne Maus-Support)
btop --tty_on

# Hilfe anzeigen
btop --help
```

> ⚠️ **Warnung**: btop verbraucht selbst Ressourcen -- auf aelteren Systemen oder in Containern solltest du das Update-Intervall auf mindestens 5000ms setzen (`btop --update 5000`).

### Tastatur-Shortcuts

btop wird hauptsaechlich ueber Tastenkuerzel bedient. Die folgenden Shortcuts sind nach Funktionsbereich gruppiert, damit du sie im Arbeitsalltag schnell findest.

#### Navigation:
Mit den Navigationstasten bewegst du dich durch die Prozessliste und oeffnest Menues fuer Einstellungen:
```
↑/↓         Prozess-Liste navigieren
PgUp/PgDn   Prozess-Liste scrollen (Seitenweise)
Home/End    Zum Anfang/Ende der Prozess-Liste
m           Menu öffnen (Einstellungen)
ESC         Menu schließen / Filter löschen
q           btop beenden
```

#### Process-Management:
Diese Shortcuts ermoeglichen direktes Eingreifen in laufende Prozesse -- vom sanften Beenden bis zur Prioritaetsaenderung:
```
k           Prozess beenden (SIGTERM)
K           Prozess erzwingen beenden (SIGKILL)
+/-         Process-Priorität erhöhen/verringern (nice)
e           Prozess-Details anzeigen (Environment Variables)
i           I/O Stats für Prozess anzeigen
```

#### Sortierung:
Mit diesen Tasten aenderst du die Sortierreihenfolge der Prozessliste, um z.B. den CPU-intensivsten Prozess schnell zu finden:
```
c           Nach CPU sortieren
m           Nach Memory sortieren
p           Nach PID sortieren
n           Nach Name sortieren
r           Sortierreihenfolge umkehren
```

#### Views:
Zwischen verschiedenen Ansichten wechseln -- z.B. Tree-View fuer Eltern-Kind-Beziehungen oder gefilterter Modus fuer gezielte Analyse:
```
t           Prozess-Tree-View umschalten
f           Filter für Prozesse setzen (Regex)
h           Hilfe-Menu anzeigen
o           Optionen-Menu öffnen
```

#### Boxes (Panels):
btop teilt die Anzeige in vier Boxen (CPU, Memory, Network, Disk). Mit den Ziffertasten fokussierst du einzelne Boxen und kannst sie ein- oder ausblenden:
```
1-4         Box-Focus ändern (CPU, Memory, Network, Disk)
z           Box ein/ausblenden (nach Focus)
```

### Konfigurations-Datei

btop speichert Einstellungen in `~/.config/btop/btop.conf`. Du kannst die Datei entweder direkt im Editor bearbeiten oder ueber das integrierte Optionsmenue anpassen:

```bash
# Config-Datei bearbeiten
vim ~/.config/btop/btop.conf

# Oder direkt in btop: Menu öffnen (m) → Options → Edit Config
```

Die wichtigsten Config-Optionen steuern Aussehen, Update-Geschwindigkeit und welche Metriken angezeigt werden. Jede Option wird einzeln erklaert:

```ini
# btop.conf

# Theme auswählen
color_theme = "gruvbox_dark"

# Update-Intervall (ms)
update_ms = 2000

# Prozess-Sortierung (Default)
proc_sorting = "cpu lazy"

# Prozess-Tree standardmäßig aktivieren
proc_tree = False

# Prozess-Filter (Regex)
proc_filter = ""

# CPU-Graph-Typ: "default", "braille", "block", "tty"
cpu_graph_upper = "default"
cpu_graph_lower = "default"

# Memory-Graph-Typ
mem_graph_upper = "default"
mem_graph_lower = "default"

# Network-Graph-Typ
net_graph_upper = "default"
net_graph_lower = "default"

# Show Disk I/O
show_disks = True

# Show Network Traffic
show_network = True

# Show CPU Temperature
show_cpu_temps = True

# Temperature Scale (celsius/fahrenheit/kelvin)
temp_scale = "celsius"

# Show Swap Usage
show_swap = True

# Show Uptime
show_uptime = True

# Mouse Support
enable_mouse = True

# Process Columns
proc_columns = ["pid", "user", "cpu", "mem", "time", "name"]
```

### Themes

btop kommt mit vielen vorinstallierten Themes, die du im laufenden Betrieb oder ueber die Config-Datei wechseln kannst. Um die verfuegbaren Themes zu sehen, schaue in das Themes-Verzeichnis:

```bash
# Verfügbare Themes ansehen
ls ~/.config/btop/themes/

# Themes in btop wechseln
# Menu öffnen (m) → Options → Theme
# Oder direkt in btop.conf:
color_theme = "gruvbox_dark"
color_theme = "nord"
color_theme = "dracula"
color_theme = "monokai"
color_theme = "solarized_dark"
```

**Eigenes Theme erstellen:**

Du kannst ein eigenes Theme erstellen, indem du eine `.theme`-Datei im Themes-Verzeichnis anlegst. Die Datei definiert Farben fuer alle UI-Elemente:

```bash
# Theme-Datei erstellen
vim ~/.config/btop/themes/my_theme.theme

# Theme-Datei-Format (Beispiel):
```

Das folgende Beispiel zeigt das Format einer Theme-Datei mit den wichtigsten Farbdefinitionen fuer Hintergrund, Text und die einzelnen Boxen:

```ini
# my_theme.theme

# Main background
theme[main_bg]="#1e1e1e"

# Main text
theme[main_fg]="#d4d4d4"

# Title color
theme[title]="#569cd6"

# Highlighted text
theme[hi_fg]="#ce9178"

# Selected item
theme[selected_bg]="#264f78"
theme[selected_fg]="#ffffff"

# CPU colors
theme[cpu_box]="#569cd6"
theme[cpu_text]="#d4d4d4"
theme[cpu_graph]="#4ec9b0"

# Memory colors
theme[mem_box]="#608b4e"
theme[mem_text]="#d4d4d4"
theme[mem_graph]="#608b4e"

# Network colors
theme[net_box]="#ce9178"
theme[net_text]="#d4d4d4"
theme[net_graph]="#ce9178"

# Process list colors
theme[proc_box]="#c586c0"
theme[proc_text]="#d4d4d4"
```

---

## Best Practices

In diesem Abschnitt findest du bewaehrte Vorgehensweisen fuer den produktiven Einsatz von btop -- von Startup-Aliasen ueber Remote-Monitoring bis hin zur CI/CD-Integration.

### 1. **Startup-Optimierung**
Wenn du btop regelmaessig mit den gleichen Optionen startest, lohnen sich Shell-Aliase. So sparst du Tipparbeit und hast konsistente Einstellungen:
```bash
# btop mit optimalen Einstellungen starten
# Alias in ~/.bashrc oder ~/.zshrc:
alias btop='btop --preset 1 --update 2000'

# Oder spezifisches Theme:
alias btop-dark='btop --theme gruvbox_dark'
alias btop-light='btop --theme gruvbox_light'
```

### 2. **Remote-Server-Monitoring**
btop laesst sich problemlos ueber SSH auf Remote-Servern ausfuehren. Mit tmux oder screen bleibt die Monitoring-Session auch nach dem Trennen der SSH-Verbindung aktiv:
```bash
# btop auf Remote-Server via SSH
ssh user@server 'btop'

# Mit tmux für persistente Session
ssh user@server 'tmux new-session -d -s btop btop && tmux attach -t btop'

# Mit screen als Alternative
ssh user@server 'screen -S btop btop'
```

### 3. **Performance-Monitoring während Deployments**
Waehrend eines Deployments ist es wichtig, die Systemressourcen im Blick zu behalten, um Engpaesse fruehzeitig zu erkennen:
```bash
# btop in separate Terminal-Session starten vor Deployment
btop

# Oder mit watch für periodische Snapshots
watch -n 5 'btop --tty_on --update 1000 --quit-after 1'
```

### 4. **Prozess-Filtering für Debugging**
Der Filter (`f`) unterstuetzt regulaere Ausdruecke, mit denen du die Prozessliste gezielt einschraenken kannst. Das ist besonders hilfreich, wenn du nur bestimmte Anwendungen ueberwachen willst:
```bash
# In btop:
# 1. 'f' drücken für Filter
# 2. Regex eingeben, z.B.:
#    - "python" für alle Python-Prozesse
#    - "node|npm" für Node.js-Prozesse
#    - "docker" für Docker-Prozesse
#    - "^my_app" für Prozesse die mit "my_app" beginnen
```

> 🚀 **Beispiel**: Wenn ein `node`-Prozess 95% CPU nutzt, kannst du ihn in btop direkt mit `k` (SIGTERM) beenden und den Befehl in Claude Code neu optimieren lassen.

### 5. **Ressourcen-Engpässe identifizieren**
btop eignet sich hervorragend zur systematischen Analyse von Engpaessen in allen vier Bereichen (CPU, Memory, Disk, Network). Die folgende Anleitung zeigt das Vorgehen fuer jeden Bereich:
```bash
# CPU-Bottlenecks:
# 1. In btop: Per-Core CPU-Auslastung ansehen
# 2. Prozesse nach CPU sortieren (c)
# 3. Prozess-Tree aktivieren (t) um Parent-Child zu sehen

# Memory-Leaks:
# 1. Prozesse nach Memory sortieren (m)
# 2. Memory-Graph über Zeit beobachten
# 3. Prozess mit stetig steigendem RAM-Verbrauch identifizieren

# Disk I/O-Issues:
# 1. Disk-Box fokussieren (3)
# 2. I/O-Heavy Prozesse identifizieren
# 3. Prozess-Details (i) für detaillierte I/O-Stats

# Network-Bottlenecks:
# 1. Network-Box fokussieren (4)
# 2. Download/Upload Graphen beobachten
# 3. Prozesse mit hohem Network-Traffic finden
```

### 6. **btop in tmux/screen integrieren**
btop in einem separaten tmux-Pane oder Screen-Session zu betreiben ist ideal fuer dauerhaftes Monitoring neben der eigentlichen Arbeit:
```bash
# tmux-Session mit btop
tmux new-session -s monitor 'btop'

# tmux-Pane mit btop
tmux split-window -h 'btop'

# screen-Session mit btop
screen -S monitor btop
```

### 7. **Config-Backup und Sync**
Deine btop-Konfiguration solltest du in einem Dotfiles-Repository sichern, damit du sie auf anderen Rechnern schnell wiederherstellen kannst:
```bash
# btop-Config in Git-Repo sichern
cp ~/.config/btop/btop.conf ~/dotfiles/btop/btop.conf
cd ~/dotfiles && git add . && git commit -m "Update btop config"

# Oder mit Symlink
ln -s ~/dotfiles/btop/btop.conf ~/.config/btop/btop.conf
```

### 8. **Prozess-Priorität optimieren**
Mit nice/renice kannst du direkt in btop die Ausfuehrungsprioritaet von Prozessen aendern. Hoehere nice-Werte bedeuten niedrigere Prioritaet -- so gibst du z.B. einem Compile-Job weniger CPU-Zeit:
```bash
# In btop:
# 1. Prozess auswählen
# 2. '+' drücken um Priorität zu erhöhen (nice -1)
# 3. '-' drücken um Priorität zu senken (nice +1)
# 4. Mehrfach drücken für größere Änderungen

# Beispiel: Compile-Job weniger Priorität geben
# → Prozess "make" finden
# → Mehrmals '-' drücken (nice +10)
```

### 9. **Docker-Container-Monitoring**
Docker-Prozesse erscheinen automatisch in btop. Mit dem Filter kannst du gezielt nur Container-bezogene Prozesse anzeigen oder btop direkt innerhalb eines Containers starten:
```bash
# btop zeigt Docker-Prozesse automatisch an
# Um nur Docker-Prozesse zu sehen:
# 1. Filter aktivieren (f)
# 2. Regex eingeben: "docker|containerd"

# Oder besser: In Docker-Container selbst
docker exec -it container_name btop
```

### 10. **CI/CD Integration für Performance-Tests**
btop kann im TTY-Modus Snapshots erstellen, die in CI/CD-Pipelines fuer automatisierte Performance-Checks verwendet werden koennen:
```bash
# btop-Snapshot in CI-Pipeline
# .gitlab-ci.yml oder .github/workflows/test.yml:
performance-test:
  script:
    - btop --tty_on --update 1000 --quit-after 10 > btop_snapshot.txt
    - cat btop_snapshot.txt
    # Oder mit parsing für Alerts:
    - |
      if grep -q "95\..*% CPU" btop_snapshot.txt; then
        echo "WARNING: High CPU usage detected"
        exit 1
      fi
```

---

## Beispiele

Dieser Abschnitt zeigt btop in typischen Praxisszenarien -- von der einfachen System-Uebersicht ueber gezieltes Debugging bis hin zum Remote-Monitoring.

### Beispiel 1: Standard-Monitoring Setup

So sieht ein typischer btop-Start mit optimalen Einstellungen aus. Das Preset-Layout und ein 2-Sekunden-Intervall bieten eine gute Balance zwischen Uebersicht und Ressourcenschonung:

```bash
# btop mit optimalen Einstellungen starten
btop

# Oder mit Preset:
btop --preset 1 --update 2000

# Erwartetes Verhalten:
# - CPU-Box zeigt alle Cores mit Historie
# - Memory-Box zeigt RAM + Swap Usage
# - Network-Box zeigt Download/Upload
# - Disk-Box zeigt I/O für alle Laufwerke
# - Prozess-Liste zeigt top Prozesse nach CPU
```

**Output:**
```
┌─ CPU ───────────────────────────────────────────────────┐
│ [▁▂▃▅▆▇█████████████▇▆▅▃▂▁] 85% │ Uptime: 3 days      │
│ Core 1  [█████████████████████] 95%                     │
│ Core 2  [████████████████] 80%                          │
│ Core 3  [██████████████] 70%                            │
│ Core 4  [████████████] 60%                              │
└──────────────────────────────────────────────────────────┘

┌─ Memory ────────────────────────────────────────────────┐
│ RAM  [████████████████████] 16.2G/32.0G (51%)          │
│ Swap [█] 512M/8.0G (6%)                                 │
└──────────────────────────────────────────────────────────┘

┌─ Network ───────────────────────────────────────────────┐
│ Download [▃▅▆▇█▇▆▅▃▁] 125 MB/s                          │
│ Upload   [▁▂▃▅▆▇████] 45 MB/s                           │
└──────────────────────────────────────────────────────────┘

┌─ Processes ─────────────────────────────────────────────┐
│ PID   User    CPU%  MEM%   Time  Command                │
│ 1234  cosmo   95.2  12.5   05:23 node app.js           │
│ 5678  cosmo   45.1   8.2   02:15 python train.py       │
│ 9012  cosmo   12.3   2.1   00:45 docker-compose        │
└──────────────────────────────────────────────────────────┘
```

### Beispiel 2: Prozess-Filtering für Node.js-Apps

Wenn du nur Node.js-Prozesse ueberwachen willst, nutze den Regex-Filter. So siehst du auf einen Blick, welche Node-Prozesse laufen und wie viel Ressourcen sie verbrauchen:

```bash
# btop starten
btop

# In btop:
# 1. 'f' drücken für Filter
# 2. Eingeben: "node|npm"
# 3. Enter drücken

# Oder direkt mit Command-Line:
# (nicht unterstützt, muss manuell im UI gemacht werden)
```

**Output:**
```
┌─ Processes (Filtered: "node|npm") ──────────────────────┐
│ PID   User    CPU%  MEM%   Time  Command                │
│ 1234  cosmo   95.2  12.5   05:23 node app.js           │
│ 2345  cosmo   25.1   5.2   01:30 node server.js        │
│ 3456  cosmo   15.3   3.1   00:45 npm run dev           │
│ 4567  cosmo    5.2   1.5   00:12 node build.js         │
└──────────────────────────────────────────────────────────┘
```

### Beispiel 3: CPU-Bottleneck identifizieren

Ein typisches Szenario: Ein Core ist zu 99% ausgelastet, waehrend die anderen fast idle sind. Das deutet auf einen Single-Threaded-Prozess hin, der einen Flaschenhals verursacht:

```bash
# btop starten
btop

# In btop:
# 1. 'c' drücken um nach CPU zu sortieren
# 2. Per-Core CPU-Auslastung beobachten
# 3. Prozess mit höchster CPU auswählen
# 4. 'e' drücken für Details
```

**Analyse:**
```
┌─ CPU ───────────────────────────────────────────────────┐
│ Core 1  [████████████████████] 99%  ← Bottleneck!      │
│ Core 2  [████] 20%                                      │
│ Core 3  [███] 15%                                       │
│ Core 4  [██] 10%                                        │
└──────────────────────────────────────────────────────────┘

Problem: Single-threaded Prozess "train.py" nutzt nur 1 Core
Lösung: Multi-Processing in Python-Script aktivieren
```

### Beispiel 4: Memory-Leak finden

Memory-Leaks erkennst du an stetig steigendem RAM-Verbrauch eines Prozesses ueber die Zeit. Sortiere nach Memory und beobachte den Graph-Trend:

```bash
# btop starten und Memory über Zeit beobachten
btop

# In btop:
# 1. 'm' drücken um nach Memory zu sortieren
# 2. Memory-Graph-Trend beobachten (steigend?)
# 3. Prozess mit steigendem RAM-Verbrauch identifizieren
```

**Analyse:**
```
┌─ Memory ────────────────────────────────────────────────┐
│ RAM  [████████████████████▁▂▃▅▆▇█] 28.5G/32.0G (89%)  │
│      ↑ Stetig steigend! Memory Leak verdächtig         │
└──────────────────────────────────────────────────────────┘

┌─ Processes ─────────────────────────────────────────────┐
│ PID   User    CPU%  MEM%   Time  Command                │
│ 1234  cosmo   25.2  45.5   12:23 python data_proc.py   │
│       ↑ Memory steigt von 2GB → 14GB in 12 Minuten     │
└──────────────────────────────────────────────────────────┘

Action: Prozess beenden (k) und Code auf Memory-Leaks prüfen
```

> 💡 **Tipp**: Nutze den Prozess-Filter (`f`) mit Regex wie `claude|node|python`, um gezielt die Prozesse zu beobachten, die Claude Code spawnt.

### Beispiel 5: Disk I/O-Analyse

Wenn das System traege reagiert, koennen Disk-I/O-Engpaesse die Ursache sein. Fokussiere die Disk-Box, um Lese- und Schreibraten pro Laufwerk zu sehen:

```bash
# btop starten
btop

# In btop:
# 1. '3' drücken um Disk-Box zu fokussieren
# 2. Disk I/O pro Laufwerk ansehen
# 3. Prozess mit hohem I/O identifizieren
```

**Output:**
```
┌─ Disks ─────────────────────────────────────────────────┐
│ /dev/sda1   Read:  [████████] 500 MB/s                  │
│             Write: [██] 50 MB/s                          │
│ /dev/sdb1   Read:  [▁] 5 MB/s                           │
│             Write: [▁] 2 MB/s                            │
└──────────────────────────────────────────────────────────┘

┌─ Processes ─────────────────────────────────────────────┐
│ PID   User    I/O    Command                            │
│ 5678  cosmo   480MB  dd if=/dev/zero of=test.dat       │
└──────────────────────────────────────────────────────────┘
```

### Beispiel 6: Network-Traffic-Monitoring

Die Network-Box zeigt Download- und Upload-Raten in Echtzeit. Damit identifizierst du schnell, ob ein Prozess ungewoehnlich viel Bandbreite verbraucht:

```bash
# btop starten
btop

# In btop:
# 1. '4' drücken um Network-Box zu fokussieren
# 2. Download/Upload Graphen beobachten
# 3. Prozesse mit hohem Network-Traffic finden
```

**Output:**
```
┌─ Network ───────────────────────────────────────────────┐
│ eth0                                                     │
│ Download [▃▅▆▇████████▇▆▅▃▁] 850 MB/s                  │
│ Upload   [▁▂▃▅▆▇████████▇▆] 120 MB/s                   │
│ Total: 125 GB ↓  |  18 GB ↑                            │
└──────────────────────────────────────────────────────────┘

Prozess mit hohem Traffic:
PID: 9012  Command: docker pull nginx:latest
```

### Beispiel 7: Prozess-Tree für Parent-Child-Analyse

Der Tree-View zeigt die Eltern-Kind-Beziehungen zwischen Prozessen. Das ist besonders nuetzlich bei Docker-Compose oder Microservice-Setups, um zu sehen, welche Unterprozesse von welchem Hauptprozess gestartet wurden:

```bash
# btop starten
btop

# In btop:
# 1. 't' drücken um Tree-View zu aktivieren
# 2. Parent-Child-Beziehungen analysieren
```

**Output:**
```
┌─ Processes (Tree View) ─────────────────────────────────┐
│ PID   User    CPU%  MEM%   Command                      │
│ 1234  cosmo   55.2  12.5   ├─ docker-compose           │
│ 2345  cosmo   25.1   5.2   │  ├─ nginx                 │
│ 3456  cosmo   15.3   3.1   │  ├─ node app.js           │
│ 4567  cosmo    5.2   1.5   │  └─ postgres              │
│ 5678  cosmo   10.5   2.8   └─ python worker.py         │
└──────────────────────────────────────────────────────────┘
```

### Beispiel 8: Prozess beenden (mit Grace-Period)

Ein sauberer Shutdown beginnt mit SIGTERM (k), das dem Prozess die Chance gibt, sich ordentlich zu beenden. Erst wenn das nicht hilft, nutze SIGKILL (K) als letzte Option:

```bash
# btop starten und Prozess auswählen
btop

# In btop:
# 1. Prozess mit ↑/↓ auswählen
# 2. 'k' drücken für SIGTERM (graceful shutdown)
# 3. Warten (5 Sekunden)
# 4. Falls Prozess nicht beendet: 'K' für SIGKILL

# Oder direkt mit Maus:
# - Rechtsklick auf Prozess
# - "Kill" auswählen
```

### Beispiel 9: Prozess-Priorität ändern (nice/renice)

Wenn ein Hintergrund-Job wie ein Compile-Prozess die CPU dominiert, kannst du seine Prioritaet senken, damit wichtigere Prozesse mehr Rechenzeit bekommen:

```bash
# btop starten
btop

# Szenario: Compile-Job läuft, aber System ist langsam

# In btop:
# 1. "make" Prozess finden (mit Filter 'f' → "make")
# 2. Prozess auswählen
# 3. '-' mehrmals drücken (nice +10)
# 4. CPU-Auslastung beobachten

# Oder umgekehrt: Wichtigen Prozess priorisieren
# 1. "my_critical_app" Prozess finden
# 2. '+' mehrmals drücken (nice -5)
```

**Vorher:**
```
PID   User   Nice  CPU%  Command
1234  cosmo    0   95.2  make -j8
5678  cosmo    0    2.1  my_critical_app
```

**Nachher:**
```
PID   User   Nice  CPU%  Command
1234  cosmo   +10  45.2  make -j8
5678  cosmo    -5  48.1  my_critical_app
```

### Beispiel 10: Remote-Server-Monitoring mit SSH

Um einen entfernten Server zu ueberwachen, verbinde dich per SSH und starte btop dort. Mit tmux bleibt die Session auch nach dem Trennen der SSH-Verbindung aktiv:

```bash
# SSH in Remote-Server mit btop
ssh user@production-server

# btop starten
btop

# Oder direkt in einer Zeile:
ssh user@production-server -t 'btop'

# Mit tmux für persistente Session:
ssh user@production-server
tmux new-session -s monitor 'btop'
# Detach mit Ctrl+B, dann D
# Später wieder attachen:
tmux attach -t monitor
```

### Beispiel 11: btop-Config für Dark-Theme

Diese vollstaendige Beispiel-Konfiguration zeigt ein optimiertes Setup mit Gruvbox-Dark-Theme, sinnvollen Defaults und aktiviertem Mouse-Support:

```bash
# Config-Datei bearbeiten
vim ~/.config/btop/btop.conf

# Oder direkt in btop: m → Options → Edit Config
```

**Optimale Dark-Theme-Config:**
```ini
# ~/.config/btop/btop.conf

# Gruvbox Dark Theme
color_theme = "gruvbox_dark"

# Update alle 2 Sekunden (Balance zwischen Responsiveness und Performance)
update_ms = 2000

# CPU-Graph-Typ
cpu_graph_upper = "default"
cpu_graph_lower = "block"

# Memory-Graph-Typ
mem_graph_upper = "default"
mem_graph_lower = "default"

# Prozess-Sortierung
proc_sorting = "cpu lazy"

# Prozess-Tree standardmäßig aus (für bessere Performance)
proc_tree = False

# Show Disks
show_disks = True

# Show Network
show_network = True

# Show CPU Temperature (nur wenn verfügbar)
show_cpu_temps = True

# Temperature in Celsius
temp_scale = "celsius"

# Show Swap
show_swap = True

# Show Uptime
show_uptime = True

# Mouse Support aktivieren
enable_mouse = True

# Prozess-Spalten
proc_columns = ["pid", "user", "cpu", "mem", "time", "cmd"]

# Show detailed stats
show_detailed = True

# Preset Layout (1 = CPU oben, Prozesse unten)
preset = 1
```

### Beispiel 12: Docker-Container-Performance analysieren

Um die Performance einzelner Docker-Container zu analysieren, nutze den Filter auf docker-bezogene Prozesse oder starte btop direkt im Container selbst:

```bash
# Docker-Container starten
docker run -d --name test-nginx nginx:latest

# btop starten
btop

# In btop:
# 1. Filter aktivieren (f)
# 2. Eingeben: "docker|containerd|nginx"
# 3. CPU und Memory für Container-Prozesse beobachten

# Oder direkt in Container:
docker exec -it test-nginx btop
```

**Output:**
```
┌─ Processes (Filtered: "docker|nginx") ──────────────────┐
│ PID   User    CPU%  MEM%   Time  Command                │
│ 1234  root     5.2   2.5   00:45 dockerd               │
│ 2345  root     2.1   1.2   00:30 containerd            │
│ 3456  root     1.5   0.8   00:15 nginx: master         │
│ 4567  nginx    0.5   0.5   00:10 nginx: worker         │
└──────────────────────────────────────────────────────────┘
```

---

## Integration mit Claude Code

btop laesst sich mit Claude Code kombinieren, um System-Performance automatisiert zu analysieren, Engpaesse zu erkennen und Optimierungen vorzuschlagen. Die folgenden Workflows zeigen, wie du btop-Snapshots fuer intelligente Analysen nutzen kannst.

### Workflow 1: System-Performance-Analyse mit Claude

Erstelle einen btop-Snapshot im TTY-Modus und lasse Claude die Ergebnisse automatisch interpretieren und Handlungsempfehlungen geben:

```bash
# 1. btop-Snapshot erstellen
btop --tty_on --update 1000 --quit-after 10 > btop_snapshot.txt

# 2. Mit Claude analysieren
# Claude Prompt:
"""
Analyze this btop snapshot and identify:
1. CPU bottlenecks (processes using >80% CPU)
2. Memory issues (high RAM usage, potential leaks)
3. Disk I/O problems
4. Network bandwidth issues
5. Recommendations for optimization

Snapshot:
$(cat btop_snapshot.txt)
"""
```

**Claude-Analyse:**
```
Findings:
1. CPU Bottleneck: Process "node app.js" using 95% CPU on single core
   → Recommendation: Implement worker threads or clustering

2. Memory Issue: Process "python train.py" RAM usage 14.5GB (45%)
   → Recommendation: Check for memory leaks, use memory profiling

3. Disk I/O: "dd" process writing 480 MB/s
   → Recommendation: This is expected for backup, but consider rate limiting

4. Network: Docker pull consuming 850 MB/s bandwidth
   → Recommendation: Schedule large downloads during off-peak hours
```

### Workflow 2: CI/CD Performance-Monitoring

Dieser GitHub Actions Workflow installiert btop in der CI-Pipeline, laesst die Anwendung laufen und ueberwacht gleichzeitig die Systemressourcen. Die Ergebnisse werden automatisch mit Claude analysiert:

```yaml
# .github/workflows/performance-test.yml
name: Performance Test

on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Install btop
        run: |
          git clone https://github.com/aristocratos/btop.git
          cd btop && make && sudo make install

      - name: Run Application
        run: |
          npm install
          npm start &
          APP_PID=$!
          echo "APP_PID=$APP_PID" >> $GITHUB_ENV

      - name: Monitor Performance with btop
        run: |
          # btop für 30 Sekunden laufen lassen
          timeout 30 btop --tty_on --update 1000 > btop_output.txt || true
          cat btop_output.txt

      - name: Analyze Performance with Claude
        run: |
          # Claude API aufrufen für Analyse
          curl -X POST https://api.anthropic.com/v1/messages \
            -H "Content-Type: application/json" \
            -H "x-api-key: $CLAUDE_API_KEY" \
            -d '{
              "model": "claude-3-5-sonnet-20241022",
              "max_tokens": 1024,
              "messages": [{
                "role": "user",
                "content": "Analyze this btop output and flag any performance issues: '"$(cat btop_output.txt)"'"
              }]
            }' > analysis.json

          cat analysis.json

      - name: Upload Performance Report
        uses: actions/upload-artifact@v3
        with:
          name: performance-report
          path: |
            btop_output.txt
            analysis.json
```

### Workflow 3: Automatische Prozess-Optimierung

Dieses Python-Skript kombiniert btop-Snapshots mit der Claude API, um automatisch Prozesse zu identifizieren, die beendet oder in ihrer Prioritaet angepasst werden sollten:

```python
# auto_optimize.py
import subprocess
import json
import anthropic

def get_btop_snapshot():
    """btop-Snapshot erstellen"""
    result = subprocess.run(
        ['btop', '--tty_on', '--update', '1000', '--quit-after', '5'],
        capture_output=True,
        text=True
    )
    return result.stdout

def analyze_with_claude(snapshot):
    """Snapshot mit Claude analysieren"""
    client = anthropic.Anthropic(api_key="your-api-key")

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""
            Analyze this btop snapshot and provide:
            1. List of processes to kill (if CPU > 95% for non-critical processes)
            2. List of processes to renice (if eating too many resources)
            3. Memory optimization recommendations

            Output as JSON:
            {{
              "kill": [{{pid, reason}}],
              "renice": [{{pid, nice_value, reason}}],
              "recommendations": ["..."]
            }}

            Snapshot:
            {snapshot}
            """
        }]
    )

    return json.loads(message.content[0].text)

def apply_optimizations(optimizations):
    """Optimierungen anwenden"""
    # Prozesse beenden
    for process in optimizations.get('kill', []):
        print(f"Killing PID {process['pid']}: {process['reason']}")
        subprocess.run(['kill', '-9', str(process['pid'])])

    # Prozess-Prioritäten ändern
    for process in optimizations.get('renice', []):
        print(f"Renicing PID {process['pid']} to {process['nice_value']}: {process['reason']}")
        subprocess.run(['renice', str(process['nice_value']), str(process['pid'])])

    # Recommendations ausgeben
    print("\nRecommendations:")
    for rec in optimizations.get('recommendations', []):
        print(f"- {rec}")

if __name__ == '__main__':
    print("Getting btop snapshot...")
    snapshot = get_btop_snapshot()

    print("Analyzing with Claude...")
    optimizations = analyze_with_claude(snapshot)

    print("Applying optimizations...")
    apply_optimizations(optimizations)
```

Fuehre das Skript aus, um den gesamten Analyse- und Optimierungsprozess automatisch zu starten:
```bash
# Skript ausführen
python auto_optimize.py

# Output:
# Getting btop snapshot...
# Analyzing with Claude...
# Killing PID 1234: Non-critical process using 95% CPU
# Renicing PID 5678 to 10: Background backup job
#
# Recommendations:
# - Consider implementing worker threads for node app
# - Memory usage is high (89%), consider restarting services
# - Disk I/O is normal, no action needed
```

### Workflow 4: Live-Performance-Dashboard

Dieses Skript erstellt ein kontinuierliches Monitoring, das alle 30 Sekunden einen btop-Snapshot nimmt und Claude um eine schnelle Bewertung bittet. Bei Problemen wird ein Alert ausgeloest:

```python
# performance_dashboard.py
import subprocess
import time
from anthropic import Anthropic

def monitor_continuously():
    """Kontinuierliches Monitoring mit Claude-Analyse"""
    client = Anthropic(api_key="your-api-key")

    while True:
        # btop-Snapshot
        snapshot = subprocess.run(
            ['btop', '--tty_on', '--update', '1000', '--quit-after', '2'],
            capture_output=True,
            text=True
        ).stdout

        # Quick-Analyse mit Claude
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=512,
            messages=[{
                "role": "user",
                "content": f"""
                Quick analysis: Is there any critical performance issue?
                Answer with "OK" or describe the issue briefly.

                Snapshot:
                {snapshot}
                """
            }]
        )

        status = message.content[0].text.strip()

        if status != "OK":
            print(f"⚠️  ALERT: {status}")
            # Notification senden (Email, Slack, etc.)
        else:
            print("✓ System OK")

        # Alle 30 Sekunden prüfen
        time.sleep(30)

if __name__ == '__main__':
    monitor_continuously()
```

### Workflow 5: Pre-Deployment Performance-Check

Dieses Shell-Skript prueft vor einem Deployment, ob das System genuegend Ressourcen frei hat. Claude entscheidet anhand des btop-Snapshots, ob das Deployment sicher ist:

```bash
#!/bin/bash
# pre_deploy_check.sh

echo "Running pre-deployment performance check..."

# btop-Snapshot vor Deployment
btop --tty_on --update 1000 --quit-after 10 > pre_deploy_btop.txt

# Mit Claude analysieren
claude_response=$(curl -X POST https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $CLAUDE_API_KEY" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 512,
    "messages": [{
      "role": "user",
      "content": "Is the system ready for deployment? Check CPU, Memory, Disk. Answer YES or NO with brief reason. Snapshot: '"$(cat pre_deploy_btop.txt)"'"
    }]
  }' | jq -r '.content[0].text')

echo "Claude Analysis: $claude_response"

if echo "$claude_response" | grep -q "YES"; then
  echo "✓ System ready for deployment"
  exit 0
else
  echo "✗ System NOT ready for deployment"
  echo "$claude_response"
  exit 1
fi
```

Die folgende GitLab-CI-Konfiguration zeigt, wie du den Pre-Deployment-Check in eine Pipeline integrierst:
```yaml
# .gitlab-ci.yml
deploy:
  stage: deploy
  script:
    - bash pre_deploy_check.sh
    - |
      if [ $? -eq 0 ]; then
        echo "Deploying..."
        kubectl apply -f deployment.yml
      else
        echo "Deployment aborted due to performance issues"
        exit 1
      fi
```

---

## 🤖 Claude Code Integration

### Workflow 1: System-Ressourcen vor Claude Code Session pruefen
Bevor du eine ressourcenintensive Claude Code Session startest, pruefe kurz die verfuegbaren Systemressourcen mit einem btop-Snapshot:
```bash
# btop kurz starten, um freie Ressourcen zu pruefen
btop --tty_on --update 1000 --quit-after 5
# Dann Claude Code mit Kontext starten:
claude "Analysiere dieses Projekt -- ich habe 16GB RAM frei und 4 Cores verfuegbar"
```

### Workflow 2: Claude Code Prozesse in Echtzeit ueberwachen
Starte btop in einem separaten tmux-Pane und filtere auf Claude-relevante Prozesse, um den Ressourcenverbrauch waehrend der Arbeit im Blick zu behalten:
```bash
# In tmux: btop in einem Pane, Claude Code im anderen
tmux split-window -h 'btop'
# Im btop-Pane: Filter auf Claude-relevante Prozesse
# Druecke 'f' und gib ein: "claude|node|python|npm"
```

### Workflow 3: Performance-Snapshot fuer Claude Code Analyse erstellen
Erstelle einen Snapshot und uebergib ihn direkt an Claude Code zur automatischen Analyse von Engpaessen:
```bash
# Snapshot erstellen und von Claude Code analysieren lassen
btop --tty_on --update 1000 --quit-after 10 > /tmp/system-snapshot.txt
claude "Analysiere diesen System-Snapshot und identifiziere Engpaesse: $(cat /tmp/system-snapshot.txt)"
```

> 💡 **Tipp**: Claude Code kann btop automatisch in Debugging-Workflows einsetzen, z.B. wenn ein Build langsam ist oder ein Prozess nicht reagiert.

## 📺 Video-Tutorial

[btop - The Best Terminal Resource Monitor (DistroTube)](https://www.youtube.com/watch?v=nIBH3X4KH1M)
Umfassender Ueberblick ueber btop mit Installation, Konfiguration und praktischer Demo aller wichtigen Features wie CPU-Monitoring, Prozess-Management und Themes.

---

## Troubleshooting

Hier findest du Loesungen fuer die haeufigsten Probleme mit btop. Jedes Problem ist mit Symptomen, Ursache und konkreter Loesung beschrieben.

### Problem 1: btop startet nicht

Das passiert typischerweise, wenn btop nicht installiert ist oder nicht im PATH liegt.

**Symptome:**
```bash
$ btop
btop: command not found
```

Pruefe zuerst, ob btop installiert und im PATH verfuegbar ist. Falls nicht, installiere es ueber den passenden Paketmanager:

**Lösung:**
```bash
# Prüfen ob btop installiert ist
which btop

# Wenn nicht gefunden, installieren (macOS)
brew install btop

# Oder kompilieren (Linux)
git clone https://github.com/aristocratos/btop.git
cd btop && make && sudo make install

# PATH prüfen
echo $PATH
# btop sollte in /usr/local/bin sein
```

### Problem 2: Keine Farben / Kaputte UI

Dieses Problem entsteht meist durch eine falsche TERM-Variable oder fehlende Nerd-Fonts, die btop fuer die Darstellung von Sonderzeichen benoetigt.

**Symptome:**
- btop zeigt keine Farben
- UI-Elemente überlappen sich
- Sonderzeichen werden als '?' angezeigt

Stelle sicher, dass dein Terminal 256 Farben unterstuetzt und eine kompatible Schriftart installiert ist:

**Lösung:**
```bash
# Terminal-Support prüfen
echo $TERM
# Sollte "xterm-256color" oder ähnlich sein

# Wenn falsch, in ~/.bashrc oder ~/.zshrc setzen:
export TERM=xterm-256color

# Oder btop mit Low-Color-Mode starten
btop --low-color

# Font prüfen (sollte Nerd Font oder ähnlich sein)
# Empfohlene Fonts:
# - MesloLGS NF
# - FiraCode Nerd Font
# - JetBrainsMono Nerd Font
```

### Problem 3: Hohe CPU-Auslastung durch btop selbst

Wenn btop zu viel CPU verbraucht, liegt das meist an einem zu niedrigen Update-Intervall oder zu vielen aktiven Graphen. Reduziere die Aktualisierungsrate und blende unnoetige Panels aus:

**Symptome:**
```
btop verbraucht selbst 10-20% CPU
```

**Lösung:**
```bash
# Update-Intervall erhöhen (weniger Updates = weniger CPU)
btop --update 5000  # 5 Sekunden statt 2

# Oder in ~/.config/btop/btop.conf:
update_ms = 5000

# Weniger Graphen anzeigen
# In btop: 'z' drücken um Boxes auszublenden
# Oder in Config:
show_disks = False
show_network = False

# Low-Color-Mode nutzen (weniger Rendering)
btop --low-color
```

### Problem 4: Mouse-Support funktioniert nicht

Mouse-Support haengt sowohl von der btop-Konfiguration als auch vom Terminal-Emulator und ggf. tmux ab. Alle drei muessen Maus-Events unterstuetzen:

**Symptome:**
- Klicks in btop werden nicht erkannt
- Maus-Navigation funktioniert nicht

**Lösung:**
```bash
# Mouse-Support in Config aktivieren
# ~/.config/btop/btop.conf:
enable_mouse = True

# Terminal-Emulator prüfen
# Manche Terminals (z.B. alte xterm) unterstützen keine Maus
# Empfohlene Terminals:
# - iTerm2 (macOS)
# - Alacritty
# - Kitty
# - GNOME Terminal
# - Windows Terminal

# Tmux-Kompatibilität
# Wenn in tmux: Mouse-Support in tmux aktivieren
# ~/.tmux.conf:
set -g mouse on
```

### Problem 5: btop zeigt falsche CPU-Temperatur

Falsche Temperaturwerte deuten darauf hin, dass die Sensor-Treiber nicht korrekt installiert oder konfiguriert sind. Unter Linux muessen `lm-sensors` installiert und erkannt werden:

**Symptome:**
```
CPU-Temperatur zeigt 0°C oder unrealistische Werte
```

**Lösung:**
```bash
# Sensor-Support prüfen (Linux)
sudo apt install lm-sensors
sudo sensors-detect
sensors

# Falls Sensoren nicht gefunden:
# In btop Config deaktivieren
# ~/.config/btop/btop.conf:
show_cpu_temps = False

# Oder externe Sensor-Tools nutzen
# macOS: iStats Menus, TG Pro
# Linux: psensor, lm-sensors
```

### Problem 6: btop zeigt nicht alle Prozesse

btop filtert standardmaessig Kernel-Threads heraus und zeigt nur Prozesse, fuer die der aktuelle Benutzer Leserechte hat. Fuer eine vollstaendige Uebersicht muss btop als root gestartet werden:

**Symptome:**
- Manche Prozesse fehlen in der Liste
- Prozess-Anzahl stimmt nicht mit `ps aux` überein

**Lösung:**
```bash
# btop filtert standardmäßig Kernel-Threads
# Um alle Prozesse zu sehen (inkl. Kernel):
# In btop: 'o' → Options → "Show kernel processes"

# Oder alle User-Prozesse anzeigen
# Filter (f) entfernen falls aktiv

# Falls immer noch Prozesse fehlen:
# Als root starten für volle Sicht
sudo btop

# Oder mit erweiterten Berechtigungen:
sudo setcap cap_sys_nice,cap_net_admin+eip $(which btop)
```

### Problem 7: Config-Änderungen werden nicht gespeichert

Wenn Einstellungen nicht persistent sind, fehlt entweder die Config-Datei, oder btop hat keine Schreibrechte darauf (z.B. wenn die Datei als root erstellt wurde):

**Symptome:**
```
Änderungen in btop gehen beim nächsten Start verloren
```

**Lösung:**
```bash
# Config-Datei-Pfad prüfen
ls -la ~/.config/btop/btop.conf

# Falls Datei fehlt:
mkdir -p ~/.config/btop
btop  # Config wird automatisch erstellt

# Schreibrechte prüfen
ls -la ~/.config/btop/
# Sollte User-owned sein, nicht root

# Falls root-owned:
sudo chown -R $USER:$USER ~/.config/btop

# Änderungen manuell in Config-Datei machen
vim ~/.config/btop/btop.conf
# Dann btop neu starten
```

### Problem 8: btop crasht mit Segmentation Fault

Segfaults treten meist bei aelteren btop-Versionen auf. Aktualisiere auf mindestens Version 1.2.13 oder kompiliere aus dem neuesten Quellcode:

**Symptome:**
```bash
$ btop
Segmentation fault (core dumped)
```

**Lösung:**
```bash
# Neueste Version installieren
# Alte Versionen hatten Bugs

# Via Source kompilieren
git clone https://github.com/aristocratos/btop.git
cd btop
git pull  # Neueste Version
make clean
make
sudo make install

# Version prüfen
btop --version
# Sollte >= 1.2.13 sein

# Falls weiterhin Crashes:
# Debug-Mode starten
btop --debug

# Log-Datei prüfen
cat ~/.config/btop/btop.log
```

### Problem 9: Prozesse lassen sich nicht beenden

Manche Prozesse reagieren nicht auf SIGTERM, weil sie entweder das Signal blockieren oder sich im "uninterruptible sleep" (D-State) befinden. SIGKILL (K) ist die naechste Eskalationsstufe:

**Symptome:**
```
'k' in btop drücken hat keine Wirkung
Prozess bleibt nach SIGTERM aktiv
```

**Lösung:**
```bash
# In btop:
# 1. Prozess auswählen
# 2. 'K' drücken (Großbuchstabe!) für SIGKILL statt SIGTERM

# Falls immer noch nicht beendet:
# Prozess ist wahrscheinlich im "uninterruptible sleep" (D-State)
# Kann nicht gekillt werden, nur durch Reboot oder Warten

# In btop prüfen:
# State-Spalte sollte 'D' zeigen

# Workaround:
# Parent-Prozess beenden (falls vorhanden)
# In Tree-View (t) Parent finden und beenden
```

### Problem 10: Network-Stats zeigen 0

Null-Werte bei Network-Stats bedeuten meist, dass btop das falsche Netzwerk-Interface ueberwacht oder nicht genuegend Berechtigungen hat, um auf Netzwerkstatistiken zuzugreifen:

**Symptome:**
```
Network-Box zeigt konstant 0 MB/s
Keine Download/Upload-Aktivität sichtbar
```

**Lösung:**
```bash
# Network-Interface prüfen
ip link show
# Oder (macOS):
ifconfig

# Richtiges Interface in btop Config setzen
# ~/.config/btop/btop.conf:
net_iface = "eth0"  # Linux
net_iface = "en0"   # macOS

# Oder "auto" für automatische Erkennung:
net_iface = "auto"

# Falls weiterhin 0:
# Permissions prüfen
# btop braucht Zugriff auf /proc/net (Linux)
# Oder mit sudo starten:
sudo btop
```

---

## Vergleich mit Alternativen

### btop vs. htop

| Feature                | btop                          | htop                         |
|------------------------|-------------------------------|------------------------------|
| **Performance**        | ✓✓✓ Sehr schnell (C++)       | ✓✓ Schnell (C)              |
| **UI**                 | ✓✓✓ Modern, farbenfroh       | ✓✓ Funktional, einfach      |
| **Mouse-Support**      | ✓✓✓ Vollständig              | ✓✓ Basis-Support            |
| **Themes**             | ✓✓✓ 10+ eingebaut + Custom   | ✗ Keine Themes              |
| **CPU-View**           | ✓✓✓ Per-Core + Graphen       | ✓✓ Per-Core Bars            |
| **Memory-View**        | ✓✓✓ Detailliert + Graphen    | ✓✓ Basis-Info               |
| **Network**            | ✓✓✓ Eingebaut + Graphen      | ✗ Nicht vorhanden           |
| **Disk I/O**           | ✓✓✓ Eingebaut + Graphen      | ✗ Nicht vorhanden           |
| **Konfigurierbar**     | ✓✓✓ Sehr umfangreich         | ✓✓ Begrenzt                 |
| **Resource-Usage**     | ✓✓ Niedrig                   | ✓✓✓ Sehr niedrig            |
| **Verfügbarkeit**      | ✓✓ macOS, Linux              | ✓✓✓ macOS, Linux, BSD       |
| **Installation**       | ✓✓ Kompilieren oft nötig     | ✓✓✓ In allen Repos          |

**Empfehlung:**
- **btop**: Für moderne Entwickler, die eine schöne UI, Mouse-Support und umfassende System-Übersicht wollen
- **htop**: Für Minimalisten, alte Server oder wenn btop nicht verfügbar ist

### btop vs. top (Standard)

| Feature                | btop                          | top                          |
|------------------------|-------------------------------|------------------------------|
| **Benutzerfreundlichkeit** | ✓✓✓ Sehr intuitiv        | ✓ Kompliziert                |
| **UI**                 | ✓✓✓ Modern, farbenfroh       | ✗ Text-only, kein Color      |
| **Mouse-Support**      | ✓✓✓ Ja                       | ✗ Nein                       |
| **Interaktivität**     | ✓✓✓ Hoch                     | ✓ Begrenzt                   |
| **Verfügbarkeit**      | ✓✓ Muss installiert werden   | ✓✓✓ Überall vorinstalliert   |
| **Features**           | ✓✓✓ CPU, RAM, Network, Disk  | ✓ Nur CPU, RAM               |
| **Lernkurve**          | ✓✓✓ Niedrig                  | ✓ Hoch (komplexe Shortcuts) |

**Empfehlung:**
- **btop**: Für alle modernen Use-Cases
- **top**: Nur wenn btop/htop nicht verfügbar (z.B. auf alten Servern)

### btop vs. glances

| Feature                | btop                          | glances                      |
|------------------------|-------------------------------|------------------------------|
| **Performance**        | ✓✓✓ Sehr schnell             | ✓ Langsamer (Python)         |
| **Features**           | ✓✓✓ CPU, RAM, Network, Disk  | ✓✓✓ + Docker, RAID, Sensors  |
| **Web-UI**             | ✗ Nein                       | ✓✓✓ Ja (glances -w)          |
| **API**                | ✗ Nein                       | ✓✓✓ REST API                 |
| **Plugins**            | ✗ Nein                       | ✓✓✓ Viele Plugins            |
| **UI-Design**          | ✓✓✓ Modern, schön            | ✓✓ Funktional                |
| **Resource-Usage**     | ✓✓✓ Niedrig                  | ✓ Höher (Python-Overhead)    |
| **Alerts**             | ✗ Nein                       | ✓✓✓ Thresholds + Notifications |

**Empfehlung:**
- **btop**: Für lokales Monitoring, schnelle Performance, schöne UI
- **glances**: Für Remote-Monitoring, Web-UI, Alerting, Plugins

### btop vs. bottom (btm)

| Feature                | btop                          | bottom                       |
|------------------------|-------------------------------|------------------------------|
| **Sprache**            | C++                           | Rust                         |
| **Performance**        | ✓✓✓ Sehr schnell             | ✓✓✓ Sehr schnell             |
| **UI-Stil**            | ✓✓✓ Farbenfroh               | ✓✓ Minimalistisch            |
| **Mouse-Support**      | ✓✓✓ Vollständig              | ✓✓ Vollständig               |
| **Themes**             | ✓✓✓ Viele eingebaut          | ✓ Wenige                     |
| **Features**           | ✓✓✓ Komplett                 | ✓✓✓ Komplett                 |
| **Cross-Platform**     | ✓✓ macOS, Linux              | ✓✓✓ macOS, Linux, Windows    |
| **Config-Format**      | INI-Style                     | TOML                         |

**Empfehlung:**
- **btop**: Für Linux/macOS-Benutzer, die viele Themes und schöne UI wollen
- **bottom**: Für Windows-Benutzer oder Rust-Fans

---

## Nützliche Links

### Offizielle Ressourcen:
- **GitHub Repo**: https://github.com/aristocratos/btop
- **Releases**: https://github.com/aristocratos/btop/releases
- **Installation Guide**: https://github.com/aristocratos/btop#installation
- **Themes**: https://github.com/aristocratos/btop/tree/main/themes

### Community & Support:
- **Discussions**: https://github.com/aristocratos/btop/discussions
- **Issues**: https://github.com/aristocratos/btop/issues
- **Reddit**: https://www.reddit.com/r/btop

### Alternative Tools:
- **htop**: https://github.com/htop-dev/htop
- **glances**: https://github.com/nicolargo/glances
- **bottom**: https://github.com/ClementTsang/bottom
- **ytop**: https://github.com/cjbassi/ytop (deprecated)

### Tutorials & Guides:
- **DistroTube btop Review**: https://www.youtube.com/watch?v=nIBH3X4KH1M
- **Chris Titus Tech btop Setup**: https://christitus.com/btop
- **btop Config Examples**: https://github.com/search?q=btop.conf

### Theme Collections:
- **Catppuccin Theme**: https://github.com/catppuccin/btop
- **Nord Theme**: https://github.com/arcticicestudio/nord-btop
- **Dracula Theme**: https://draculatheme.com/btop

---

## Pro-Tipps

Fortgeschrittene Techniken und Automatisierungen fuer den Power-User-Einsatz von btop.

### 1. **Alias für schnellen Start**
Definiere kurze Aliase in deiner Shell-Konfiguration, um btop mit verschiedenen Voreinstellungen schnell zu starten:
```bash
# ~/.bashrc oder ~/.zshrc
alias b='btop'
alias btop-dark='btop --theme gruvbox_dark'
alias btop-light='btop --theme gruvbox_light'
alias btop-simple='btop --preset 1 --update 5000'
```

### 2. **btop mit tmux für Monitoring-Dashboard**
Binde btop an eine tmux-Tastenkombination, damit du jederzeit mit einem Shortcut ein Monitoring-Pane oeffnen kannst:
```bash
# ~/.tmux.conf
# Automatisch btop in Pane starten
bind-key M split-window -h "btop"
```

Nachdem du die tmux-Konfiguration neu geladen hast, oeffnest du mit dem folgenden Shortcut ein btop-Pane:
```bash
# In tmux: Prefix + M (z.B. Ctrl+B, dann M)
# → btop öffnet sich in neuem Pane
```

### 3. **Custom Theme für bessere Lesbarkeit**

Eigenes Theme erstellen fuer hohen Kontrast -- besonders nuetzlich bei Beamer-Praesentationen oder bei Sehbeeintraechtigungen:

```bash
# ~/.config/btop/themes/high_contrast.theme
vim ~/.config/btop/themes/high_contrast.theme
```

```ini
# high_contrast.theme
theme[main_bg]="#000000"
theme[main_fg]="#ffffff"
theme[title]="#00ff00"
theme[hi_fg]="#ffff00"
theme[selected_bg]="#0000ff"
theme[selected_fg]="#ffffff"

theme[cpu_box]="#00ff00"
theme[cpu_text]="#ffffff"
theme[cpu_graph]="#00ff00"

theme[mem_box]="#00ffff"
theme[mem_text]="#ffffff"
theme[mem_graph]="#00ffff"

theme[net_box]="#ff00ff"
theme[net_text]="#ffffff"
theme[net_graph]="#ff00ff"

theme[proc_box]="#ffff00"
theme[proc_text]="#ffffff"
```

### 4. **btop für Server-Monitoring via SSH-Jump-Host**
Wenn dein Produktionsserver nur ueber einen Jump-Host erreichbar ist, kannst du btop trotzdem direkt starten. Die SSH-Config vereinfacht den Zugriff dauerhaft:
```bash
# Via SSH Jump Host monitoren
ssh -J jumphost user@production-server -t 'btop'

# Mit SSH-Config (~/.ssh/config):
Host production
    HostName production-server
    ProxyJump jumphost
    User admin

# Dann einfach:
ssh production -t 'btop'
```

### 5. **Performance-Baseline mit btop erstellen**
Erstelle eine Baseline waehrend des normalen Betriebs, um spaeter nach Deployments Abweichungen erkennen zu koennen:
```bash
# Baseline-Snapshot erstellen (normaler Betrieb)
btop --tty_on --update 1000 --quit-after 30 > baseline_btop.txt

# Vor wichtigen Deployments:
# 1. Baseline ansehen
# 2. Deployment durchführen
# 3. Neuen Snapshot erstellen
# 4. Vergleichen (mit diff oder Claude)
```

### 6. **Automatisches Alerting bei hoher CPU-Last**
Dieses Skript prueft regelmaessig die CPU-Auslastung und sendet bei Ueberschreitung eines Schwellenwerts automatisch eine E-Mail-Benachrichtigung:
```bash
#!/bin/bash
# cpu_alert.sh

while true; do
  # btop-Snapshot
  btop --tty_on --update 1000 --quit-after 2 > /tmp/btop_snapshot.txt

  # CPU-Auslastung extrahieren (grep + awk)
  cpu_usage=$(grep "CPU" /tmp/btop_snapshot.txt | head -1 | awk '{print $2}' | tr -d '%')

  if [ "$cpu_usage" -gt 90 ]; then
    # Alert senden
    echo "HIGH CPU ALERT: ${cpu_usage}%" | mail -s "Server Alert" admin@example.com
  fi

  sleep 60
done
```

### 7. **btop-Snapshots mit Datum/Zeit speichern**
Speichere Snapshots mit Zeitstempel fuer spaetere Vergleiche. Per Cron-Job laesst sich das automatisieren:
```bash
# Snapshot mit Timestamp
btop --tty_on --update 1000 --quit-after 10 > "btop_$(date +%Y%m%d_%H%M%S).txt"

# Oder automatisiert alle 5 Minuten (Cron):
# */5 * * * * btop --tty_on --update 1000 --quit-after 10 > ~/btop_logs/btop_$(date +\%Y\%m\%d_\%H\%M\%S).txt
```

### 8. **Docker-spezifisches Monitoring**
Fuer Docker-Umgebungen kannst du den btop-Filter auf Container-Prozesse beschraenken oder ein Skript schreiben, das btop nacheinander in jedem Container ausfuehrt:
```bash
# Nur Docker-Prozesse anzeigen
# In btop: Filter (f) → "docker|containerd"

# Oder Custom-Skript für Docker-Monitoring:
docker ps --format "{{.Names}}" | while read container; do
  echo "=== $container ==="
  docker exec $container btop --tty_on --update 1000 --quit-after 2
done
```

### 9. **btop für Kubernetes-Node-Monitoring**
Verbinde dich per SSH auf einen Kubernetes-Node oder nutze kubectl exec, um btop direkt in einem Pod auszufuehren:
```bash
# Auf K8s-Node per SSH
kubectl get nodes
ssh user@node-1 -t 'btop'

# Oder mit kubectl exec (falls btop im Container):
kubectl exec -it pod-name -- btop
```

### 10. **btop-Config-Preset für verschiedene Szenarien**

Erstelle mehrere Config-Dateien fuer unterschiedliche Situationen (z.B. minimal fuer ressourcenarme Systeme, verbose fuer detaillierte Analysen) und wechsle per Bash-Funktion:

```bash
# ~/.config/btop/btop.conf         → Standard
# ~/.config/btop/btop_minimal.conf → Minimale Resource-Usage
# ~/.config/btop/btop_verbose.conf → Alle Metriken

# Bash-Funktionen in ~/.bashrc:
function btop-minimal() {
  btop --config ~/.config/btop/btop_minimal.conf
}

function btop-verbose() {
  btop --config ~/.config/btop/btop_verbose.conf
}
```

**btop_minimal.conf:**
```ini
update_ms = 5000
show_disks = False
show_network = False
show_cpu_temps = False
proc_tree = False
```

**btop_verbose.conf:**
```ini
update_ms = 1000
show_disks = True
show_network = True
show_cpu_temps = True
show_swap = True
proc_tree = True
show_detailed = True
```

---

## Zusammenfassung

**btop** ist ein moderner, ressourcenschonender System-Monitor mit interaktiver Terminal-UI, der eine umfassende Übersicht über CPU, Memory, Disk und Network in einer einzigen, schön gestalteten Ansicht bietet.

### Key-Takeaways:

1. **Umfassende System-Übersicht**: CPU (per-Core), Memory, Disk I/O, Network Traffic in einem View
2. **Moderne UI**: Farben, Graphen, Mouse-Support, anpassbare Themes
3. **Performance**: Sehr ressourcenschonend (C++), trotz reicher UI
4. **Interaktiv**: Prozesse sortieren, filtern, beenden, Priorität ändern
5. **Anpassbar**: 10+ Themes, Layouts, detaillierte Config-Optionen

### Wann btop nutzen:

- ✓ **System-Monitoring**: Echtzeit-Übersicht über alle Ressourcen
- ✓ **Performance-Debugging**: CPU/Memory/Disk/Network-Bottlenecks finden
- ✓ **Server-Monitoring**: Remote-Server via SSH überwachen
- ✓ **Docker-Monitoring**: Container-Performance analysieren
- ✓ **CI/CD**: Pre/Post-Deployment Performance-Checks

### Vorteile gegenüber htop:

- **Moderne UI**: Farbenfrohe Graphen, anpassbare Themes
- **Mehr Metriken**: Network, Disk I/O eingebaut (htop braucht Plugins)
- **Mouse-Support**: Vollständige Maus-Navigation
- **Besser konfigurierbar**: Umfangreiche Config-Optionen

### Best Practice:

1. **Installation**: Via Package-Manager oder Source kompilieren
2. **Config**: Preset-Layout wählen (CPU oben/unten)
3. **Theme**: Dark-Theme für bessere Lesbarkeit
4. **Update-Intervall**: 2-5 Sekunden (Balance zwischen Responsiveness und Performance)
5. **Integration**: Mit Claude Code für automatische Performance-Analyse
6. **Remote**: Via SSH + tmux für persistentes Monitoring
7. **Alerting**: Mit Skripten für automatische Benachrichtigungen bei Problemen

**Next Steps**: Probiere btop aus, erstelle ein Custom-Theme, und integriere es in deine Development- oder Monitoring-Workflows!
