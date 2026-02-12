# Lektion 26: ncdu - Disk Usage Analyzer

## Berechtigung

**ncdu** (NCurses Disk Usage) ist ein interaktiver Disk-Usage-Analyzer für das Terminal, der eine schnelle und übersichtliche Darstellung des Speicherverbrauchs in Verzeichnissen bietet. Es ist die moderne Alternative zum traditionellen `du`-Befehl mit einer benutzerfreundlichen Navigation.

### Was ncdu macht:
- **Disk-Space-Analyse**: Verzeichnisse nach Größe sortiert anzeigen
- **Interaktive Navigation**: Durch Verzeichnisbaum navigieren mit Pfeiltasten
- **Schnelles Scanning**: Effizientes Durchsuchen großer Verzeichnisbäume
- **Datei-Löschung**: Dateien/Ordner direkt aus ncdu heraus löschen
- **Export**: Scan-Ergebnisse als JSON exportieren für spätere Analyse
- **Farb-Kodierung**: Visuelle Unterscheidung von Dateien, Ordnern, Symlinks

### Typische Anwendungsfälle:
- Speicherplatz-Engpässe identifizieren
- Große Dateien und Ordner finden
- Build-Artifacts und Cache-Ordner aufräumen
- Docker-Images und Container-Daten analysieren
- Log-Dateien identifizieren die zu viel Platz verbrauchen
- Entwicklungs-Umgebungen optimieren (node_modules, .git, etc.)

---

> 🚀 **Claude Code Relevanz**: ncdu hilft dabei, Speicherplatz-Probleme zu diagnostizieren, die Claude Code Workflows blockieren koennen -- etwa wenn node_modules, Build-Artifacts oder Cache-Ordner die Festplatte fuellen.

## Zwecke

### 1. **Schnelle Disk-Space-Übersicht**
ncdu scannt Verzeichnisse und zeigt sofort:
- Größte Unterverzeichnisse zuerst
- Prozentuale Verteilung des Speicherplatzes
- Anzahl der Dateien pro Verzeichnis
- Gesamtgröße mit humanlesbaren Einheiten (GB, MB, KB)

### 2. **Interaktive Exploration**
- Mit Pfeiltasten durch Verzeichnisbaum navigieren
- In Unterverzeichnisse hinein- und herausgehen
- Dateien/Ordner direkt löschen
- Sortierung nach Größe, Name oder Anzahl Items

> 💡 **Tipp**: Exportiere ncdu-Scans als JSON (`ncdu -o scan.json ~`) und lass Claude Code die Ergebnisse automatisch analysieren -- so findest du Speicherfresser in Sekunden.

### 3. **Performance-Optimierung**
- node_modules-Ordner identifizieren
- Build-Artifacts finden (.next, dist, target, etc.)
- Docker-Images und Volumes analysieren
- Git-Repos mit großen .git-Ordnern finden
- Cache-Ordner (.cache, __pycache__, etc.)

### 4. **Export und Analyse**
- Scan-Ergebnisse als JSON exportieren
- Für spätere Vergleiche speichern
- Mit anderen Tools weiterverarbeiten
- CI/CD-Integration für Disk-Space-Monitoring

---

## Verwendung

Dieser Abschnitt fuehrt dich durch Installation, Bedienung und erweiterte Optionen von ncdu. Du lernst, wie du Verzeichnisse analysierst, Scans exportierst und gezielt grosse Dateien findest.

### Installation

Die Installation ist auf allen gaengigen Betriebssystemen unkompliziert, da ncdu in den Standard-Paketmanagern verfuegbar ist.

#### macOS (via Homebrew):
Die einfachste Installation auf macOS ist ueber Homebrew:
```bash
# ncdu installieren
brew install ncdu

# Version prüfen
ncdu --version

# ncdu starten (aktuelles Verzeichnis)
ncdu
```

#### Ubuntu/Debian:
Unter Debian-basierten Systemen ist ncdu direkt ueber apt verfuegbar:
```bash
# ncdu installieren
sudo apt update
sudo apt install -y ncdu

# Version prüfen
ncdu --version

# ncdu starten
ncdu
```

#### Arch Linux:
Arch Linux stellt ncdu ueber die offiziellen Repositories bereit:
```bash
# ncdu installieren
sudo pacman -S ncdu

# Version prüfen
ncdu --version
```

### Basis-Verwendung

ncdu scannt beim Start das angegebene Verzeichnis und zeigt dann eine interaktive Uebersicht. Die wichtigsten Aufrufvarianten mit Flags fuer Export, Exclude und Fortschrittsanzeige:

```bash
# Aktuelles Verzeichnis analysieren
ncdu

# Spezifisches Verzeichnis analysieren
ncdu /path/to/directory

# Home-Verzeichnis analysieren
ncdu ~

# Root-Verzeichnis analysieren (mit sudo)
sudo ncdu /

# Nur ein Dateisystem analysieren (keine Mounts)
ncdu -x /

# Mit Progress-Indikator (bei großen Scans)
ncdu --progress /

# Scan exportieren als JSON
ncdu -o scan.json /

# Gespeicherten Scan laden
ncdu -f scan.json

# Mit Exclude-Patterns
ncdu --exclude '/proc' --exclude '/sys' /
```

### Tastatur-Navigation in ncdu

ncdu wird vollstaendig ueber Tastenkuerzel bedient. Die folgenden Shortcuts sind nach Funktionsbereich gruppiert.

#### Haupt-Navigation:
Mit den Pfeiltasten navigierst du durch die Verzeichnisliste und gehst in Unterordner hinein oder zurueck:
```
↑/↓         Navigieren durch Liste
Enter       In Verzeichnis hinein
←/Backspace Aus Verzeichnis heraus
n           Nach Name sortieren
s           Nach Größe sortieren (default)
C           Nach Item-Anzahl sortieren
```

#### Aktionen:
Diese Tasten ermoeglichen direktes Eingreifen -- vom Loeschen bis zum Neu-Scannen:
```
d           Datei/Ordner löschen (mit Bestätigung)
t           Zwischen verschiedenen Sortierungen wechseln
g           Prozentuale Anzeige umschalten (Graph)
e           Versteckte Dateien/Ordner anzeigen
i           Datei-Info anzeigen (Permissions, Owner, etc.)
r           Neu scannen (Refresh)
b           Spawn Shell im aktuellen Verzeichnis
q           ncdu beenden
?           Hilfe anzeigen
```

#### Sortier-Optionen:
Wechsle die Sortierung, um z.B. die groessten Ordner zuerst oder alphabetisch sortiert zu sehen:
```
s   Nach Größe sortieren (größte zuerst)
S   Nach Größe sortieren (kleinste zuerst)
n   Nach Name sortieren (A-Z)
N   Nach Name sortieren (Z-A)
C   Nach Item-Anzahl sortieren
```

> ⚠️ **Warnung**: Verwende `ncdu -x /` um Cross-Filesystem-Scans zu verhindern -- ohne `-x` kann ncdu auch NFS-Mounts oder Docker-Volumes scannen und extrem lange dauern.

### Erweiterte Optionen

Die folgenden Flags ermoeglichen gezieltere Scans -- z.B. das Ausschliessen von Systemverzeichnissen, Farbmodi und SI-Einheiten:

```bash
# Cross-Filesystem-Scans verhindern
ncdu -x /home

# Bestimmte Verzeichnisse ausschließen
ncdu --exclude '/proc' --exclude '/sys' --exclude '/dev' /

# Versteckte Dateien standardmäßig nicht scannen
ncdu --exclude '.*' /

# Mit Farben (falls Terminal unterstützt)
ncdu --color dark /

# Ohne Farben
ncdu --color off /

# SI-Einheiten verwenden (1000-basiert statt 1024)
ncdu --si /

# Mit Fortschrittsanzeige für langsame Filesysteme
ncdu --progress /mnt/slow-drive

# Nur bestimmte Dateigrößen anzeigen (z.B. > 100MB)
# (manuelles Filtern in ncdu UI notwendig)
```

### Export und Import

ncdu kann Scan-Ergebnisse als JSON exportieren, sodass du sie spaeter erneut laden oder mit anderen Tools weiterverarbeiten kannst:

```bash
# Scan exportieren für spätere Analyse
ncdu -o ~/disk-scan-$(date +%Y%m%d).json /

# Scan importieren und anzeigen
ncdu -f ~/disk-scan-20260212.json

# Zwei Scans vergleichen (manuell)
# 1. Ersten Scan laden
ncdu -f scan1.json
# 2. In neuem Terminal zweiten Scan laden
ncdu -f scan2.json
# 3. Visuell vergleichen

# Scan mit Claude analysieren
# Siehe "Integration mit Claude Code" Sektion
```

---

## Best Practices

Bewaehrte Strategien fuer den produktiven Einsatz von ncdu -- von automatisierten Audits ueber Cleanup-Workflows bis zur CI/CD-Integration.

### 1. **Regelmäßige Disk-Space-Audits**
Automatisiere monatliche Festplatten-Audits per Cron-Job, damit Speicherprobleme nicht ueberraschend auftreten:
```bash
# Monatlichen Cron-Job für Disk-Space-Audit
# crontab -e
# 0 3 1 * * ncdu -o ~/disk-audits/scan-$(date +\%Y\%m\%d).json /home/$USER

# Alias für schnellen Audit
# ~/.bashrc oder ~/.zshrc:
alias disk-audit='ncdu ~'
alias disk-audit-full='sudo ncdu /'
```

### 2. **Entwickler-Umgebung aufräumen**
node_modules-Ordner sind oft die groessten Speicherfresser in Entwicklungsumgebungen. Mit ncdu findest du sie schnell und kannst sie direkt loeschen:
```bash
# node_modules finden
ncdu ~ | grep node_modules

# Oder direkt mit find + ncdu:
find ~ -name "node_modules" -type d -prune

# Mit ncdu interaktiv löschen:
# 1. ncdu ~ starten
# 2. Nach "node_modules" suchen
# 3. Mit 'd' löschen
```

### 3. **Docker-Cleanup mit ncdu**
Docker-Daten unter /var/lib/docker koennen schnell mehrere Gigabyte belegen. ncdu zeigt dir genau, welche Images und Volumes den meisten Platz verbrauchen:
```bash
# Docker-Daten analysieren
sudo ncdu /var/lib/docker

# Oder Docker-eigene Befehle:
docker system df  # Übersicht
docker system prune -a  # Cleanup
```

### 4. **Git-Repos optimieren**
Grosse .git-Ordner entstehen durch binare Dateien in der Git-Historie. Mit ncdu identifizierst du die betroffenen Repos und bereinigst sie:
```bash
# Große .git-Ordner finden
find ~ -name ".git" -type d -exec du -sh {} \; | sort -h

# Mit ncdu navigieren und prüfen
ncdu ~
# → In Repo navigieren → .git-Ordner anschauen

# Git-Cleanup:
# - git gc
# - git prune
# - BFG Repo-Cleaner für große Files
```

### 5. **Exclude-Patterns für schnellere Scans**
Durch das Ausschliessen von System- und Entwicklungsverzeichnissen beschleunigst du den Scan erheblich und fokussierst auf relevante Daten:
```bash
# Typische System-Ordner ausschließen
ncdu --exclude '/proc' \
     --exclude '/sys' \
     --exclude '/dev' \
     --exclude '/run' \
     --exclude '/tmp' \
     /

# Entwickler-spezifische Excludes
ncdu --exclude 'node_modules' \
     --exclude '.git' \
     --exclude 'target' \
     --exclude 'dist' \
     --exclude '.next' \
     ~
```

### 6. **ncdu in CI/CD für Disk-Space-Monitoring**
Integriere ncdu-Scans in CI/CD-Pipelines, um automatisch zu warnen, wenn die Festplattenbelegung einen Schwellenwert ueberschreitet:
```bash
# In GitLab CI oder GitHub Actions
disk-check:
  script:
    - ncdu --version
    - ncdu -o disk-scan.json /
    - |
      # Größe prüfen
      DISK_USAGE=$(du -sh / | awk '{print $1}')
      echo "Total disk usage: $DISK_USAGE"
      # Alert wenn > 80% voll
      DISK_PERCENT=$(df -h / | tail -1 | awk '{print $5}' | tr -d '%')
      if [ $DISK_PERCENT -gt 80 ]; then
        echo "WARNING: Disk usage above 80%"
        exit 1
      fi
```

### 7. **Scan-Ergebnisse versionieren**
Speichere monatliche Scan-Snapshots in einem Git-Repo, um Trends im Speicherverbrauch ueber die Zeit nachzuverfolgen:
```bash
# Monatliche Snapshots für Trend-Analyse
mkdir -p ~/disk-snapshots
ncdu -o ~/disk-snapshots/scan-$(date +%Y-%m).json ~

# Git-Repo für Disk-Snapshots
cd ~/disk-snapshots
git init
git add .
git commit -m "Disk snapshot $(date +%Y-%m)"
```

### 8. **ncdu mit xargs für Bulk-Operations**
Kombiniere find und ncdu, um gezielt bestimmte Ordnertypen (z.B. alle node_modules) zu finden und deren Groesse zu analysieren:
```bash
# Alle node_modules-Ordner finden und Größe ausgeben
find ~ -name "node_modules" -type d -print0 | \
  xargs -0 du -sh | \
  sort -h

# Oder interaktiv mit ncdu:
# Für jeden gefundenen Ordner ncdu öffnen
find ~ -name "node_modules" -type d | \
  while read dir; do
    echo "Analyzing: $dir"
    ncdu "$dir"
  done
```

### 9. **ncdu für Remote-Server**
Fuehre ncdu ueber SSH auf entfernten Servern aus oder exportiere den Scan und analysiere ihn lokal:
```bash
# Via SSH auf Remote-Server
ssh user@server 'ncdu /var/log'

# Scan exportieren und lokal analysieren
ssh user@server 'ncdu -o - /' > remote-scan.json
ncdu -f remote-scan.json
```

### 10. **ncdu mit watch für Live-Monitoring**
Da ncdu interaktiv ist, eignet es sich nicht direkt fuer watch. Besser sind periodische Scans per Cron-Job:
```bash
# Nicht empfohlen (ncdu ist interaktiv), aber möglich:
# watch -n 60 'ncdu -o /tmp/scan.json ~ && cat /tmp/scan.json'

# Besser: Periodische Scans mit Cron
# crontab -e:
# */30 * * * * ncdu -o ~/scans/latest.json ~
```

---

## Beispiele

Praktische Szenarien fuer den Einsatz von ncdu -- von der einfachen Home-Analyse ueber Docker-Cleanup bis hin zu automatisierten Cleanup-Skripten.

### Beispiel 1: Home-Verzeichnis analysieren

Der haeufigste Anwendungsfall: Starte ncdu im Home-Verzeichnis, um einen Ueberblick ueber deinen Speicherverbrauch zu bekommen:

```bash
# ncdu im Home-Verzeichnis starten
ncdu ~

# Oder explizit:
ncdu /home/username
```

**Erwartete Output:**
```
ncdu 1.19 ~ Use the arrow keys to navigate, press ? for help
--- /home/cosmo ---------------------------------
   28.5 GiB [##########] /node_modules
   12.3 GiB [####      ] /.cache
    8.7 GiB [###       ] /Documents
    5.2 GiB [#         ] /Downloads
    3.1 GiB [#         ] /.local
    2.5 GiB [          ] /Pictures
    1.8 GiB [          ] /.docker
    0.9 GiB [          ] /Videos
    0.5 GiB [          ] /Music
    0.3 GiB [          ] /.config
    0.1 GiB [          ] /.ssh
```

**Analyse:**
- `node_modules` verbraucht 28.5 GB (größter Posten!)
- `.cache` mit 12.3 GB auch sehr groß
- Action: node_modules aufräumen (siehe Beispiel 3)

### Beispiel 2: Große Dateien in /var/log finden

```bash
# /var/log mit sudo analysieren
sudo ncdu /var/log
```

**Output:**
```
ncdu 1.19 ~ Use the arrow keys to navigate, press ? for help
--- /var/log -------------------------------------
    2.5 GiB [##########] /nginx
    1.2 GiB [####      ] /postgresql
    0.8 GiB [###       ] /syslog.1
    0.5 GiB [##        ] /journal
    0.3 GiB [#         ] /apache2
    0.1 GiB [          ] /auth.log
```

**Action:**
```bash
# In ncdu:
# 1. Mit ↓ zu /nginx navigieren
# 2. Enter drücken um hineinzugehen
# 3. Große Log-Dateien identifizieren
# 4. Mit 'd' löschen (mit Vorsicht!)

# Oder besser: Logrotate konfigurieren
# /etc/logrotate.d/nginx:
/var/log/nginx/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
```

> 🚀 **Beispiel**: In einem typischen Entwicklungs-Setup koennen `node_modules`-Ordner leicht 20-30 GB belegen. Mit ncdu findest du sie sofort und kannst sie mit `d` direkt loeschen.

### Beispiel 3: node_modules-Ordner aufräumen

```bash
# Alle node_modules finden
find ~ -name "node_modules" -type d -prune -exec du -sh {} \; | sort -h

# Mit ncdu interaktiv analysieren
ncdu ~

# In ncdu:
# 1. Nach unten navigieren bis "node_modules"
# 2. Enter drücken
# 3. Größte Packages identifizieren
# 4. Projekt-Ordner merken
# 5. Zurück mit ←
# 6. 'd' drücken um ganzen node_modules zu löschen
```

**Automatisches Cleanup-Skript:**
```bash
#!/bin/bash
# cleanup_node_modules.sh

# Alle node_modules älter als 30 Tage finden
find ~ -name "node_modules" -type d -mtime +30 | while read dir; do
  size=$(du -sh "$dir" | cut -f1)
  echo "Found: $dir ($size)"
  read -p "Delete? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$dir"
    echo "Deleted!"
  fi
done
```

### Beispiel 4: Docker-Daten analysieren

```bash
# Docker-Verzeichnis analysieren (mit sudo)
sudo ncdu /var/lib/docker

# Oder Docker-eigene Befehle
docker system df

# Für detaillierte Analyse:
docker system df -v
```

**Output:**
```
ncdu 1.19 ~ Use the arrow keys to navigate, press ? for help
--- /var/lib/docker ------------------------------
   45.2 GiB [##########] /overlay2
   12.8 GiB [##        ] /volumes
    3.5 GiB [#         ] /containers
    1.2 GiB [          ] /image
    0.5 GiB [          ] /buildkit
```

**Action:**
```bash
# Docker-Cleanup
docker system prune -a --volumes

# Oder spezifischer:
docker image prune -a  # Ungenutzte Images
docker volume prune    # Ungenutzte Volumes
docker container prune # Gestoppte Container
```

### Beispiel 5: Git-Repos mit großen .git-Ordnern

```bash
# ncdu im Code-Verzeichnis starten
ncdu ~/code

# In ncdu:
# - Jedes Repo durchgehen
# - .git-Ordner Größe prüfen
# - Falls sehr groß (> 500MB): Git-Cleanup durchführen
```

**Git-Cleanup für große Repos:**
```bash
cd ~/code/large-repo

# Größe prüfen
du -sh .git

# Cleanup durchführen
git gc --aggressive --prune=now
git repack -Ad
git prune

# Große Files in Historie finden
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | \
  sort --numeric-sort --key=2 | \
  tail -20

# Mit BFG Repo-Cleaner große Files entfernen
# (Siehe: https://rtyley.github.io/bfg-repo-cleaner/)
bfg --strip-blobs-bigger-than 50M .git
```

### Beispiel 6: Export für spätere Analyse

```bash
# Scan exportieren mit Datum
ncdu -o ~/disk-scan-$(date +%Y%m%d).json ~

# Scan laden
ncdu -f ~/disk-scan-20260212.json

# Mit Claude analysieren lassen (siehe Integration-Sektion)
```

### Beispiel 7: Cache-Ordner identifizieren

```bash
# ncdu im Home starten
ncdu ~

# Typische Cache-Ordner:
# - ~/.cache (Linux)
# - ~/Library/Caches (macOS)
# - __pycache__ (Python)
# - node_modules/.cache (npm/yarn)
# - target/ (Rust)
# - .next/cache (Next.js)
```

**Cleanup:**
```bash
# Linux
rm -rf ~/.cache/*

# macOS
rm -rf ~/Library/Caches/*

# Python
find ~ -type d -name "__pycache__" -exec rm -rf {} +

# npm cache
npm cache clean --force
```

### Beispiel 8: Versteckte Dateien/Ordner anzeigen

```bash
# ncdu starten
ncdu ~

# In ncdu: 'e' drücken um versteckte Files zu zeigen
# z.B. .git, .cache, .config, etc.
```

**Output (mit 'e' gedrückt):**
```
ncdu 1.19 ~ Use the arrow keys to navigate, press ? for help
--- /home/cosmo ---------------------------------
   28.5 GiB [##########] /node_modules
   12.3 GiB [####      ] /.cache         ← jetzt sichtbar!
    8.7 GiB [###       ] /Documents
    5.2 GiB [#         ] /Downloads
    3.1 GiB [#         ] /.local         ← jetzt sichtbar!
    2.5 GiB [          ] /Pictures
    1.8 GiB [          ] /.docker        ← jetzt sichtbar!
    0.9 GiB [          ] /Videos
    0.5 GiB [          ] /Music
    0.3 GiB [          ] /.config        ← jetzt sichtbar!
    0.1 GiB [          ] /.ssh           ← jetzt sichtbar!
```

> 💡 **Tipp**: Nutze `ncdu --exclude 'node_modules' --exclude '.git' ~` fuer schnellere Scans, wenn du nur an den eigentlichen Projektdateien interessiert bist.

### Beispiel 9: Build-Artifacts finden

```bash
# Typische Build-Ordner:
# - dist/
# - build/
# - target/
# - .next/
# - out/
# - public/build/

# ncdu im Projekt-Verzeichnis starten
ncdu ~/projects

# In ncdu durch Projekte navigieren
# Build-Ordner identifizieren und löschen
```

**Cleanup-Skript:**
```bash
#!/bin/bash
# cleanup_build_artifacts.sh

BUILD_DIRS=("dist" "build" "target" ".next" "out")

find ~/projects -type d | while read dir; do
  for build_dir in "${BUILD_DIRS[@]}"; do
    if [[ $(basename "$dir") == "$build_dir" ]]; then
      size=$(du -sh "$dir" | cut -f1)
      echo "Found build artifact: $dir ($size)"
      read -p "Delete? (y/n) " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$dir"
        echo "Deleted!"
      fi
    fi
  done
done
```

### Beispiel 10: Root-Filesystem analysieren

```bash
# Gesamtes Root-Filesystem analysieren (mit sudo)
sudo ncdu /

# Typische große Ordner:
# - /var (Logs, Docker, APT-Cache)
# - /home (User-Daten)
# - /usr (System-Pakete)
# - /opt (Third-Party-Software)
```

**Output:**
```
ncdu 1.19 ~ Use the arrow keys to navigate, press ? for help
--- / -------------------------------------------
   85.2 GiB [##########] /var
   45.8 GiB [#####     ] /home
   28.5 GiB [###       ] /usr
   12.3 GiB [#         ] /opt
    3.5 GiB [          ] /boot
    1.2 GiB [          ] /tmp
    0.5 GiB [          ] /etc
```

**Action:**
```bash
# In ncdu:
# 1. Mit ↓ zu /var navigieren
# 2. Enter drücken
# 3. Unterordner analysieren:
#    - /var/log → Log-Files
#    - /var/lib/docker → Docker-Daten
#    - /var/cache/apt → APT-Cache
# 4. Cleanup durchführen
```

### Beispiel 11: Scan mit Progress-Bar

```bash
# Bei großen Filesystems: Progress anzeigen
ncdu --progress /mnt/large-drive

# Output während Scan:
# Calculating size... 12345 items, 150.2 GiB [####      ] 45%
```

### Beispiel 12: Exclude-Patterns für fokussierten Scan

```bash
# Nur wichtige Ordner scannen (System-Ordner ausschließen)
ncdu --exclude '/proc' \
     --exclude '/sys' \
     --exclude '/dev' \
     --exclude '/run' \
     /

# Oder im Home nur Code-Ordner scannen
ncdu --exclude '.*' ~/code

# Output: Nur sichtbare Dateien, keine Hidden Files
```

---

## Integration mit Claude Code

### Workflow 1: Automatische Disk-Space-Analyse mit Claude

```bash
# 1. ncdu-Scan exportieren
ncdu -o disk-scan.json ~

# 2. Mit Claude analysieren
# Claude Prompt:
"""
Analyze this ncdu disk scan and identify:
1. Top 5 directories consuming most space
2. Potential cleanup targets (caches, build artifacts, duplicates)
3. Recommendations for disk space optimization
4. Estimate of reclaimable space

Scan data:
$(cat disk-scan.json)
"""
```

**Claude-Analyse:**
```json
{
  "findings": {
    "top_directories": [
      {"path": "/node_modules", "size": "28.5 GB", "percent": 35},
      {"path": "/.cache", "size": "12.3 GB", "percent": 15},
      {"path": "/Documents", "size": "8.7 GB", "percent": 11}
    ],
    "cleanup_targets": [
      {
        "type": "node_modules",
        "locations": ["/projects/app1", "/projects/app2"],
        "reclaimable": "15.2 GB"
      },
      {
        "type": "cache",
        "locations": ["/.cache/pip", "/.cache/yarn"],
        "reclaimable": "8.5 GB"
      }
    ],
    "total_reclaimable": "23.7 GB",
    "recommendations": [
      "Run 'find ~ -name node_modules -type d -mtime +30 -exec rm -rf {} +' to remove old node_modules",
      "Clear cache with 'rm -rf ~/.cache/*'",
      "Use 'docker system prune -a' to clean Docker data"
    ]
  }
}
```

### Workflow 2: CI/CD Disk-Space-Monitoring

```yaml
# .github/workflows/disk-check.yml
name: Disk Space Check

on:
  schedule:
    - cron: '0 0 * * *'  # Täglich um Mitternacht
  workflow_dispatch:

jobs:
  disk-check:
    runs-on: ubuntu-latest

    steps:
      - name: Install ncdu
        run: sudo apt-get install -y ncdu

      - name: Scan disk
        run: |
          ncdu -o /tmp/disk-scan.json /
          cat /tmp/disk-scan.json

      - name: Analyze with Claude
        env:
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
        run: |
          SCAN_DATA=$(cat /tmp/disk-scan.json)
          curl -X POST https://api.anthropic.com/v1/messages \
            -H "Content-Type: application/json" \
            -H "x-api-key: $CLAUDE_API_KEY" \
            -d '{
              "model": "claude-3-5-sonnet-20241022",
              "max_tokens": 1024,
              "messages": [{
                "role": "user",
                "content": "Analyze this disk scan. Flag if any directory is critically large or if total usage > 80%. Scan: '"$SCAN_DATA"'"
              }]
            }' > analysis.json

          cat analysis.json

      - name: Check for alerts
        run: |
          # Prüfen ob Claude Alerts gefunden hat
          if grep -q "CRITICAL" analysis.json; then
            echo "::error::Critical disk space issue detected"
            exit 1
          fi

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: disk-reports
          path: |
            /tmp/disk-scan.json
            analysis.json
```

### Workflow 3: Automated Cleanup Script mit Claude

```python
# smart_cleanup.py
import subprocess
import json
import anthropic

def run_ncdu_scan(path):
    """ncdu-Scan durchführen und JSON zurückgeben"""
    result = subprocess.run(
        ['ncdu', '-o', '-', path],
        capture_output=True,
        text=True,
        timeout=300
    )
    return json.loads(result.stdout)

def analyze_with_claude(scan_data):
    """Scan mit Claude analysieren"""
    client = anthropic.Anthropic(api_key="your-api-key")

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"""
            Analyze this ncdu disk scan and provide cleanup recommendations.

            Output as JSON:
            {{
              "safe_to_delete": [
                {{"path": "/path/to/dir", "size_gb": 12.5, "reason": "Old node_modules"}}
              ],
              "review_before_delete": [
                {{"path": "/path/to/dir", "size_gb": 5.2, "reason": "Large .git folder"}}
              ],
              "keep": [
                {{"path": "/path/to/dir", "size_gb": 8.7, "reason": "Active project"}}
              ]
            }}

            Scan data:
            {json.dumps(scan_data)}
            """
        }]
    )

    return json.loads(message.content[0].text)

def execute_cleanup(recommendations, dry_run=True):
    """Cleanup basierend auf Claude-Empfehlungen"""
    print("=== Cleanup Plan ===\n")

    # Safe to delete
    print("Safe to delete:")
    for item in recommendations.get('safe_to_delete', []):
        print(f"  - {item['path']} ({item['size_gb']} GB): {item['reason']}")
        if not dry_run:
            subprocess.run(['rm', '-rf', item['path']])
            print(f"    ✓ Deleted")

    # Review before delete
    print("\nReview before delete:")
    for item in recommendations.get('review_before_delete', []):
        print(f"  - {item['path']} ({item['size_gb']} GB): {item['reason']}")
        if not dry_run:
            response = input("    Delete? (y/n): ")
            if response.lower() == 'y':
                subprocess.run(['rm', '-rf', item['path']])
                print(f"    ✓ Deleted")

    # Keep
    print("\nKeep:")
    for item in recommendations.get('keep', []):
        print(f"  - {item['path']} ({item['size_gb']} GB): {item['reason']}")

if __name__ == '__main__':
    import sys

    path = sys.argv[1] if len(sys.argv) > 1 else '~'
    dry_run = '--dry-run' in sys.argv

    print(f"Scanning {path}...")
    scan_data = run_ncdu_scan(path)

    print("Analyzing with Claude...")
    recommendations = analyze_with_claude(scan_data)

    execute_cleanup(recommendations, dry_run=dry_run)

    if dry_run:
        print("\n[DRY RUN] No files were actually deleted.")
        print("Run without --dry-run to execute cleanup.")
```

**Usage:**
```bash
# Dry-run (empfohlen zuerst)
python smart_cleanup.py ~ --dry-run

# Tatsächliches Cleanup
python smart_cleanup.py ~
```

### Workflow 4: Disk-Space-Trend-Analysis

```python
# disk_trend_analyzer.py
import subprocess
import json
from datetime import datetime
import anthropic

def compare_scans(scan1_path, scan2_path):
    """Zwei ncdu-Scans vergleichen"""
    with open(scan1_path) as f:
        scan1 = json.load(f)
    with open(scan2_path) as f:
        scan2 = json.load(f)

    # Mit Claude analysieren
    client = anthropic.Anthropic(api_key="your-api-key")

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""
            Compare these two disk scans (taken at different times) and identify:
            1. Directories with significant growth
            2. Directories that were cleaned up
            3. Overall disk usage trend
            4. Predictions for future disk usage

            Scan 1 (older):
            {json.dumps(scan1)}

            Scan 2 (newer):
            {json.dumps(scan2)}
            """
        }]
    )

    return message.content[0].text

if __name__ == '__main__':
    import sys

    if len(sys.argv) < 3:
        print("Usage: python disk_trend_analyzer.py scan1.json scan2.json")
        sys.exit(1)

    analysis = compare_scans(sys.argv[1], sys.argv[2])
    print(analysis)
```

**Usage:**
```bash
# Monatliche Scans erstellen
ncdu -o ~/scans/scan-2026-01.json ~
# ... 1 Monat später:
ncdu -o ~/scans/scan-2026-02.json ~

# Vergleichen
python disk_trend_analyzer.py ~/scans/scan-2026-01.json ~/scans/scan-2026-02.json

# Output:
# Analysis:
# 1. Significant growth in:
#    - /node_modules: +8.5 GB (40% increase)
#    - /.cache: +3.2 GB (35% increase)
# 2. Cleaned up:
#    - /Downloads: -2.1 GB (cleaned old files)
# 3. Overall trend: +9.6 GB growth per month
# 4. Prediction: Disk will be 90% full in 3 months if trend continues
```

### Workflow 5: Pre-Deployment Disk-Check

```bash
#!/bin/bash
# pre_deploy_disk_check.sh

echo "Running pre-deployment disk check..."

# ncdu-Scan
ncdu -o /tmp/disk-scan.json /

# Mit Claude analysieren
claude_response=$(curl -X POST https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $CLAUDE_API_KEY" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 512,
    "messages": [{
      "role": "user",
      "content": "Is there enough disk space for deployment? Check if any partition is > 80% full. Answer YES or NO with brief reason. Scan: '"$(cat /tmp/disk-scan.json)"'"
    }]
  }' | jq -r '.content[0].text')

echo "Claude Analysis: $claude_response"

if echo "$claude_response" | grep -q "YES"; then
  echo "✓ Sufficient disk space for deployment"
  exit 0
else
  echo "✗ Insufficient disk space"
  echo "$claude_response"
  exit 1
fi
```

**Usage in CI/CD:**
```yaml
# .gitlab-ci.yml
deploy:
  stage: deploy
  script:
    - bash pre_deploy_disk_check.sh
    - |
      if [ $? -eq 0 ]; then
        echo "Deploying..."
        ./deploy.sh
      else
        echo "Deployment aborted due to disk space issues"
        exit 1
      fi
```

---

## 🤖 Claude Code Integration

### Workflow 1: Speicherplatz-Analyse mit Claude Code automatisieren
```bash
# ncdu-Scan exportieren und Claude Code analysieren lassen
ncdu -o /tmp/disk-scan.json ~
claude "Analysiere diesen Disk-Scan und schlage Cleanup-Massnahmen vor: $(cat /tmp/disk-scan.json | head -500)"
```

### Workflow 2: Projekt-Cleanup vor grossem Build
```bash
# Vor einem grossen Build: Speicherplatz pruefen
ncdu --exclude '.git' --exclude 'node_modules' .
# Dann Claude Code den Build optimieren lassen:
claude "Raeume Build-Artifacts auf und starte einen sauberen Build"
```

### Workflow 3: Automatisierte Disk-Space-Warnung in CI/CD
```bash
# In Claude Code generiertem CI-Script:
DISK_PERCENT=$(df -h / | tail -1 | awk '{print $5}' | tr -d '%')
if [ $DISK_PERCENT -gt 80 ]; then
  ncdu -o /tmp/disk-alert.json /
  echo "WARNUNG: Festplatte zu $DISK_PERCENT% voll!"
fi
```

> 💡 **Tipp**: Claude Code kann ncdu automatisch in Cleanup-Workflows einsetzen, etwa um vor einem Deployment sicherzustellen, dass genuegend Speicherplatz vorhanden ist.

## 📺 Video-Tutorial

[Linux Essentials: ncdu - Disk Usage Analyzer (TecMint)](https://www.tecmint.com/ncdu-a-ncurses-based-disk-usage-analyzer-and-tracker/)
Ausfuehrliches Tutorial mit Schritt-fuer-Schritt-Anleitung zur Installation, Navigation und den wichtigsten Tastenkuerzeln von ncdu auf Linux-Systemen.

---

## Troubleshooting

Loesungen fuer die haeufigsten Probleme mit ncdu, jeweils mit Symptomen, Ursache und konkreter Loesung.

### Problem 1: ncdu startet nicht

**Symptome:**
```bash
$ ncdu
ncdu: command not found
```

**Lösung:**
```bash
# Prüfen ob ncdu installiert ist
which ncdu

# Wenn nicht gefunden, installieren
# macOS:
brew install ncdu

# Ubuntu/Debian:
sudo apt-get install -y ncdu

# Arch:
sudo pacman -S ncdu

# PATH prüfen
echo $PATH
```

### Problem 2: Permission Denied

Tritt auf, wenn ncdu auf Verzeichnisse zugreifen will, fuer die der aktuelle Benutzer keine Leserechte hat:

**Symptome:**
```bash
$ ncdu /var
ncdu: cannot open /var/some-dir: Permission denied
```

**Lösung:**
```bash
# Mit sudo ausführen
sudo ncdu /var

# Oder nur User-Verzeichnis scannen (kein sudo nötig)
ncdu ~
```

### Problem 3: Scan dauert sehr lange

Langsame Scans werden oft durch NFS-Mounts, sehr grosse Verzeichnisbaeume oder das Scannen von Pseudo-Dateisystemen wie /proc verursacht:

**Symptome:**
```
ncdu scannt seit 10 Minuten ohne Fortschritt
```

**Lösung:**
```bash
# Progress-Bar aktivieren
ncdu --progress /large-dir

# System-Ordner ausschließen
ncdu --exclude '/proc' --exclude '/sys' /

# Cross-Filesystem-Scans verhindern
ncdu -x /

# Oder nur spezifische Unterordner scannen
ncdu ~/specific-folder
```

### Problem 4: ncdu zeigt falsche Größen

Groessenunterschiede zwischen ncdu und `du` entstehen durch unterschiedliche Einheitensysteme (1024-basiert vs. 1000-basiert):

**Symptome:**
```
Größen in ncdu stimmen nicht mit 'du -sh' überein
```

**Lösung:**
```bash
# ncdu verwendet 1024-basierte Einheiten (KiB, MiB, GiB)
# Zum Vergleich mit SI-Einheiten (1000-basiert):
ncdu --si /

# Oder du mit gleichen Einheiten:
du -sh --block-size=1024 /path

# Refresh in ncdu falls Dateien sich geändert haben:
# In ncdu: 'r' drücken
```

### Problem 5: Datei lässt sich nicht löschen

**Symptome:**
```
'd' in ncdu drücken, aber Datei wird nicht gelöscht
```

**Lösung:**
```bash
# Prüfen ob Schreibrechte vorhanden
ls -la /path/to/file

# Mit sudo ncdu starten falls nötig
sudo ncdu /

# Oder von außerhalb ncdu löschen
rm -rf /path/to/file

# Falls immer noch nicht löschbar:
# - Datei ist immutable: sudo chattr -i /path/to/file
# - Datei wird von Prozess genutzt: lsof /path/to/file
```

### Problem 6: JSON-Export ist korrupt

**Symptome:**
```bash
$ ncdu -f scan.json
ncdu: error loading scan.json: Invalid JSON
```

**Lösung:**
```bash
# JSON-Datei validieren
python3 -m json.tool scan.json

# Neu scannen und exportieren
ncdu -o scan-new.json /

# Prüfen ob Disk voll war beim Export
df -h
```

### Problem 7: ncdu zeigt leere Liste

**Symptome:**
```
ncdu zeigt "Total disk usage: 0 bytes"
```

**Lösung:**
```bash
# Prüfen ob Verzeichnis existiert
ls -la /path/to/dir

# Prüfen ob Leseberechtigung vorhanden
cd /path/to/dir

# Falls NFS/Netzwerk-Mount: Timeout erhöhen
# (ncdu hat keinen direkten Timeout-Parameter)
# Workaround: Mit timeout-Command:
timeout 300 ncdu /mnt/nfs

# Versteckte Dateien anzeigen
# In ncdu: 'e' drücken
```

### Problem 8: Farben funktionieren nicht

**Symptome:**
```
ncdu zeigt keine Farben oder falsche Farben
```

**Lösung:**
```bash
# Terminal-Support prüfen
echo $TERM
# Sollte "xterm-256color" oder ähnlich sein

# Farb-Modus explizit setzen
ncdu --color dark /
# Oder:
ncdu --color off /

# In ~/.bashrc oder ~/.zshrc:
export TERM=xterm-256color
```

### Problem 9: ncdu crasht bei großen Verzeichnissen

**Symptome:**
```bash
$ ncdu /
Segmentation fault (core dumped)
```

**Lösung:**
```bash
# Neueste Version installieren
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install --only-upgrade ncdu

# Oder aus Source kompilieren
git clone https://code.blicky.net/yorhel/ncdu.git
cd ncdu
./configure
make
sudo make install

# Memory-Limit erhöhen (Linux)
ulimit -v unlimited
ncdu /

# System-Ordner ausschließen
ncdu --exclude '/proc' --exclude '/sys' /
```

### Problem 10: Scan-Ergebnisse sind veraltet

**Symptome:**
```
Dateien wurden gelöscht, aber ncdu zeigt sie noch
```

**Lösung:**
```bash
# In ncdu: 'r' drücken für Refresh

# Oder ncdu neu starten
# Ctrl+C zum Beenden
ncdu /path

# Falls ncdu-Scan aus Datei geladen wurde:
# Neuen Scan erstellen
ncdu -o scan-new.json /path
ncdu -f scan-new.json
```

---

## Vergleich mit Alternativen

### ncdu vs. du (Standard)

| Feature                | ncdu                          | du                           |
|------------------------|-------------------------------|------------------------------|
| **Benutzerfreundlichkeit** | ✓✓✓ Interaktiv, visuell  | ✓ Text-only                  |
| **Navigation**         | ✓✓✓ Arrow-Keys, interaktiv   | ✗ Keine Navigation           |
| **Sortierung**         | ✓✓✓ Nach Größe, Name, Count  | ✓ Nur mit sort-Pipe          |
| **Visualisierung**     | ✓✓✓ Balken, Prozente         | ✗ Nur Zahlen                 |
| **Performance**        | ✓✓✓ Schnell                  | ✓✓✓ Sehr schnell             |
| **Export**             | ✓✓✓ JSON-Format              | ✗ Nur Text                   |
| **Interaktive Löschung** | ✓✓✓ Ja ('d' Taste)         | ✗ Nein                       |
| **Verfügbarkeit**      | ✓✓ Muss installiert werden   | ✓✓✓ Überall vorinstalliert   |

**Empfehlung:**
- **ncdu**: Für interaktive Disk-Space-Analyse und Cleanup
- **du**: Für Skripte und automatische Analysen

### ncdu vs. Dust (du + rust)

| Feature                | ncdu                          | dust                         |
|------------------------|-------------------------------|------------------------------|
| **Sprache**            | C                             | Rust                         |
| **Performance**        | ✓✓✓ Schnell                  | ✓✓✓ Sehr schnell             |
| **UI-Stil**            | ✓✓✓ Interaktiv (ncurses)     | ✓✓ Tree-View (nicht interaktiv)|
| **Navigation**         | ✓✓✓ Vollständig              | ✗ Nur Output-Scrolling       |
| **Export**             | ✓✓✓ JSON                     | ✗ Nein                       |
| **Datei-Löschung**     | ✓✓✓ Ja                       | ✗ Nein                       |
| **Farben**             | ✓✓ Basis-Farben              | ✓✓✓ Viele Farben             |
| **Verfügbarkeit**      | ✓✓✓ macOS, Linux, BSD        | ✓✓ macOS, Linux, Windows     |

**Empfehlung:**
- **ncdu**: Für interaktive Analyse und Cleanup
- **dust**: Für schnelle Übersicht ohne Interaktion

### ncdu vs. duf (Disk Usage/Free)

| Feature                | ncdu                          | duf                          |
|------------------------|-------------------------------|------------------------------|
| **Fokus**              | Verzeichnis-Analyse           | Filesystem-Übersicht         |
| **Anwendungsfall**     | Große Dateien/Ordner finden   | Disk-Usage-Übersicht         |
| **Interaktivität**     | ✓✓✓ Vollständig              | ✗ Nur Output                 |
| **Navigation**         | ✓✓✓ Durch Verzeichnisse      | ✗ Keine Navigation           |
| **Visualisierung**     | ✓✓✓ Detailliert pro Dir      | ✓✓✓ Übersicht pro Filesystem|
| **Farbschema**         | ✓✓ Basis                     | ✓✓✓ Modern                   |

**Empfehlung:**
- **ncdu**: Für Verzeichnis-interne Analyse
- **duf**: Für Filesystem-Übersicht (Ersatz für `df -h`)

### ncdu vs. GDU (Go DiskUsage)

| Feature                | ncdu                          | gdu                          |
|------------------------|-------------------------------|------------------------------|
| **Sprache**            | C                             | Go                           |
| **Performance**        | ✓✓✓ Schnell                  | ✓✓✓ Sehr schnell             |
| **Parallel-Scanning**  | ✗ Nein                       | ✓✓✓ Ja                       |
| **UI**                 | ✓✓✓ NCurses                  | ✓✓✓ NCurses + Modern         |
| **Features**           | ✓✓ Basis-Features            | ✓✓✓ Erweiterte Features      |
| **Verfügbarkeit**      | ✓✓✓ macOS, Linux, BSD        | ✓✓ macOS, Linux, Windows     |
| **Reife**              | ✓✓✓ Sehr stabil (seit 2007) | ✓✓ Neueres Projekt (seit 2019)|

**Empfehlung:**
- **ncdu**: Für Stabilität und Einfachheit
- **gdu**: Für maximale Performance (parallel scanning)

---

## Nützliche Links

### Offizielle Ressourcen:
- **ncdu Homepage**: https://dev.yorhel.nl/ncdu
- **GitHub Mirror**: https://github.com/rofl0r/ncdu
- **Man Page**: `man ncdu` oder https://linux.die.net/man/1/ncdu
- **Changelog**: https://dev.yorhel.nl/ncdu/changes

### Alternative Tools:
- **dust**: https://github.com/bootandy/dust
- **duf**: https://github.com/muesli/duf
- **gdu**: https://github.com/dundee/gdu
- **duc**: https://duc.zevv.nl/

### Tutorials:
- **DigitalOcean Guide**: https://www.digitalocean.com/community/tutorials/how-to-use-ncdu
- **LinuxConfig ncdu Tutorial**: https://linuxconfig.org/how-to-use-ncdu-on-linux
- **ncdu Cheat Sheet**: https://devhints.io/ncdu

### Verwandte Themen:
- **Disk Space Management**: https://wiki.archlinux.org/title/Core_utilities#Disk_usage
- **du Command**: https://www.gnu.org/software/coreutils/manual/html_node/du-invocation.html
- **Filesystem Analysis**: https://www.kernel.org/doc/html/latest/filesystems/index.html

---

## Pro-Tipps

Fortgeschrittene Techniken fuer den Power-User-Einsatz von ncdu -- von Shell-Aliasen ueber automatisierte Cleanups bis zur fzf-Integration.

### 1. **Alias für häufige Scans**
Definiere Aliase fuer die am haeufigsten genutzten Scan-Ziele, um mit einem kurzen Befehl loszulegen:
```bash
# ~/.bashrc oder ~/.zshrc
alias ncdu-home='ncdu ~'
alias ncdu-root='sudo ncdu /'
alias ncdu-docker='sudo ncdu /var/lib/docker'
alias ncdu-logs='sudo ncdu /var/log'
alias ncdu-export='ncdu -o ~/disk-scan-$(date +%Y%m%d).json ~'
```

### 2. **Monatliche Disk-Audits automatisieren**
Richte einen Cron-Job ein, der automatisch monatliche Scans erstellt und alte Scan-Dateien aufraumt:
```bash
# crontab -e
# Jeden 1. des Monats um 3 Uhr morgens
0 3 1 * * ncdu -o ~/disk-audits/scan-$(date +\%Y\%m).json ~

# Alte Scans aufräumen (älter als 6 Monate)
0 4 1 * * find ~/disk-audits -name "scan-*.json" -mtime +180 -delete
```

### 3. **Schnell-Cleanup-Funktion**
Eine Shell-Funktion, die die gaengigsten Cache-Verzeichnisse auf einmal bereinigt:
```bash
# ~/.bashrc oder ~/.zshrc
function quick-cleanup() {
  echo "=== Quick Cleanup ==="
  echo "1. Clearing npm cache..."
  npm cache clean --force
  echo "2. Clearing pip cache..."
  pip cache purge
  echo "3. Clearing system cache..."
  sudo rm -rf /tmp/*
  echo "4. Docker cleanup..."
  docker system prune -a -f
  echo "Done! Run ncdu to see results."
}
```

### 4. **ncdu mit fzf für interaktive Verzeichnis-Auswahl**
Kombiniere fzf mit ncdu, um zuerst ein Verzeichnis auszuwaehlen und es dann direkt zu analysieren:
```bash
# Verzeichnis mit fzf auswählen und mit ncdu analysieren
function ncdu-fzf() {
  local dir=$(find ~ -type d -maxdepth 3 | fzf --preview 'du -sh {}')
  if [ -n "$dir" ]; then
    ncdu "$dir"
  fi
}
```

### 5. **Größte N Dateien finden (ohne ncdu)**
```bash
# Alternative: Mit find und sort
find ~ -type f -exec du -h {} \; | sort -rh | head -20

# Oder mit Python-Skript für besseres Format
```

```python
#!/usr/bin/env python3
# largest_files.py
import os
import sys

def get_largest_files(path, n=20):
    files = []
    for root, dirs, filenames in os.walk(path):
        for f in filenames:
            fp = os.path.join(root, f)
            try:
                size = os.path.getsize(fp)
                files.append((size, fp))
            except OSError:
                pass

    files.sort(reverse=True)
    for size, fp in files[:n]:
        print(f"{size/1024/1024/1024:.2f} GB - {fp}")

if __name__ == '__main__':
    path = sys.argv[1] if len(sys.argv) > 1 else '.'
    get_largest_files(path)
```

### 6. **Snapshot-Vergleich mit diff**
```bash
# Zwei Scans vergleichen
# 1. Ersten Scan erstellen
ncdu -o scan1.json ~

# ... Zeit vergeht, Dateien werden hinzugefügt/gelöscht ...

# 2. Zweiten Scan erstellen
ncdu -o scan2.json ~

# 3. Mit jq vergleichen (JSON-Diff)
diff <(jq -S . scan1.json) <(jq -S . scan2.json)

# Oder mit Claude analysieren (siehe Integration-Sektion)
```

### 7. **ncdu-Output für Reporting**
```bash
# ncdu hat keinen direkten Report-Mode, aber:
# JSON exportieren und mit jq formatieren

ncdu -o - ~ | jq '.[] | select(.asize > 1000000000) | {name, size_gb: (.asize / 1073741824)}'

# Output:
# {
#   "name": "node_modules",
#   "size_gb": 28.5
# }
```

### 8. **Remote-Server-Scans sammeln**
```bash
#!/bin/bash
# collect_server_scans.sh

SERVERS=("server1" "server2" "server3")

for server in "${SERVERS[@]}"; do
  echo "Scanning $server..."
  ssh $server 'ncdu -o - /' > "scan-$server.json"
done

echo "All scans collected. Analyze with Claude or ncdu -f scan-*.json"
```

### 9. **Disk-Space-Watcher mit inotify**
```bash
# Automatisch ncdu starten wenn Disk-Usage > 80%
#!/bin/bash
# disk_watcher.sh

THRESHOLD=80

while true; do
  USAGE=$(df -h / | tail -1 | awk '{print $5}' | tr -d '%')
  if [ $USAGE -gt $THRESHOLD ]; then
    echo "ALERT: Disk usage at ${USAGE}%"
    ncdu /
    break
  fi
  sleep 300  # Check alle 5 Minuten
done
```

### 10. **ncdu mit tmux für Multi-Panel-Monitoring**
```bash
# ~/.tmux.conf
# Keyboard-Shortcut für ncdu in neuem Pane
bind-key N split-window -h "ncdu ~"

# Usage in tmux:
# Prefix + N (z.B. Ctrl+B, dann N)
# → ncdu öffnet sich in neuem Pane
```

---

## Zusammenfassung

**ncdu** ist ein interaktiver Disk-Usage-Analyzer für das Terminal, der eine schnelle und übersichtliche Darstellung des Speicherverbrauchs bietet und die moderne Alternative zum traditionellen `du`-Befehl darstellt.

### Key-Takeaways:

1. **Interaktive Navigation**: Mit Pfeiltasten durch Verzeichnisbaum navigieren
2. **Schnell**: Effizientes Scanning auch großer Verzeichnisse
3. **Visuelle Darstellung**: Balken, Prozente, Farben für bessere Übersicht
4. **Datei-Verwaltung**: Dateien/Ordner direkt aus ncdu löschen
5. **Export**: JSON-Format für Analysen mit anderen Tools

### Wann ncdu nutzen:

- ✓ **Speicherplatz-Engpässe**: Schnell große Dateien/Ordner finden
- ✓ **Cleanup**: node_modules, .cache, Build-Artifacts identifizieren
- ✓ **Docker-Analyse**: Docker-Daten und Images analysieren
- ✓ **Server-Monitoring**: Disk-Space auf Servern überwachen
- ✓ **Entwicklung**: Git-Repos, Caches, Build-Ordner optimieren

### Vorteile gegenüber `du`:

- **Interaktiv**: Navigation statt endlose Text-Ausgabe
- **Visuell**: Balken und Prozente für besseres Verständnis
- **Schneller**: Direktes Löschen aus UI möglich
- **Export**: JSON für automatisierte Analysen

### Best Practice:

1. **Installation**: Via Package-Manager installieren
2. **Regelmäßig nutzen**: Monatliche Disk-Audits mit Cron
3. **Export**: JSON-Scans für Trend-Analyse speichern
4. **Integration**: Mit Claude Code für intelligente Cleanup-Empfehlungen
5. **Excludes**: System-Ordner ausschließen für schnellere Scans
6. **Remote**: Via SSH auf Remote-Servern nutzen
7. **Automation**: In CI/CD für Disk-Space-Checks integrieren

**Next Steps**: Probiere ncdu aus, erstelle ein Cleanup-Skript mit Claude-Integration, und automatisiere monatliche Disk-Audits!
