# Lektion 35: bandwhich - Network Bandwidth Monitor

## 📋 Metadaten
- **Kategorie**: Experten-Tools
- **Schwierigkeit**: Fortgeschritten
- **Zeitaufwand**: 20-30 Minuten
- **Voraussetzungen**: Terminal-Grundlagen, Netzwerk-Basics
- **Lernziele**: Netzwerk-Traffic per Process in Echtzeit überwachen

---

> 🚀 **Claude Code Relevanz**: bandwhich zeigt dir Netzwerk-Traffic in Echtzeit - erkenne welche Prozesse Bandbreite verbrauchen waehrend Claude Code API-Calls macht.

## 🎯 Berechtigung

### Was ist bandwhich?

**bandwhich** ist ein modernes Terminal UI (TUI) Tool, das in Rust geschrieben wurde und **Netzwerk-Bandbreite pro Prozess** in Echtzeit anzeigt. Die Philosophie: **"What process is using what bandwidth"** – Transparenz über Netzwerk-Aktivität ohne tcpdump-Komplexität.

### Hauptmerkmale

1. **Per-Process Tracking**: Zeigt welcher Prozess wie viel Bandbreite nutzt
2. **Real-time Monitoring**: Live-Updates der Netzwerk-Aktivität
3. **DNS Resolution**: Hostnamen statt nur IPs
4. **Connection Details**: Lokale und Remote-Adressen sichtbar
5. **Upload/Download getrennt**: Separate Anzeige für TX/RX
6. **TUI Interface**: Übersichtliche Terminal-Darstellung
7. **Keine Root-Pflicht**: Läuft mit sudo (einmalig)

### Installation

bandwhich kann ueber Homebrew, Cargo oder den Paketmanager installiert werden. Unter Linux muessen nach der Installation Capabilities gesetzt werden, damit das Tool ohne permanentes sudo funktioniert:

```bash
# macOS mit Homebrew
brew install bandwhich

# Ubuntu/Debian (benötigt neuere Version, oft über cargo)
cargo install bandwhich

# Arch Linux
sudo pacman -S bandwhich

# Oder von Source (Rust erforderlich)
cargo install bandwhich

# Permissions setzen (Linux - einmalig)
sudo setcap cap_net_raw,cap_net_admin=+eip $(which bandwhich)
```

### Versionscheck

Pruefe nach der Installation, ob bandwhich korrekt installiert wurde:

```bash
bandwhich --version
# Ausgabe: bandwhich 0.22.2
```

---

## 💡 Zwecke

### Wofür bandwhich verwenden?

1. **Bandwidth-Hogs identifizieren**
   - Welcher Prozess lädt/uploaded heimlich?
   - Unerwarteter Traffic-Spike analysieren
   - Background-Apps überwachen

2. **Development Debugging**
   - API-Calls eines Services tracken
   - Welche Connections eine App öffnet
   - Polling-Verhalten analysieren

3. **Security Monitoring**
   - Unerwartete ausgehende Connections
   - Data Exfiltration erkennen
   - Verdächtige Prozesse identifizieren

4. **Network Performance Analysis**
   - Bottlenecks identifizieren
   - Upload vs. Download Balance
   - Connection-Count pro Service

5. **Remote Work Optimization**
   - VPN-Traffic analysieren
   - Videokonferenz-Bandwidth tracken
   - Cloud-Sync-Traffic überwachen

### Wann NICHT bandwhich verwenden?

- **Packet-Level Analysis**: Wireshark/tcpdump bieten mehr Details
- **Historical Data**: bandwhich ist nur live, kein Logging
- **Scripting/Automation**: TUI ist interaktiv, nicht script-freundlich
- **Production Servers**: Overhead von DNS-Resolution

**Alternative**: `nethogs` (simpler), `iftop` (Interface-fokus), `vnstat` (historical)

---

## 🔨 Verwendung

Dieser Abschnitt zeigt dir die grundlegende Bedienung von bandwhich -- vom Starten ueber die Navigation bis zu den wichtigsten Kommandozeilen-Optionen.

### Basis-Nutzung

bandwhich benoetigt erhoehte Rechte, da es Netzwerk-Pakete mitlesen muss. Auf macOS nutzt du `sudo`, auf Linux kannst du alternativ Capabilities setzen:

```bash
# bandwhich starten (erfordert sudo)
sudo bandwhich

# Oder mit einmaligem Capability-Setup (Linux)
sudo setcap cap_net_raw,cap_net_admin=+eip $(which bandwhich)
bandwhich  # Jetzt ohne sudo

# Auf spezifischem Interface
sudo bandwhich -i en0  # macOS WiFi
sudo bandwhich -i eth0  # Linux Ethernet

# Alle Interfaces
sudo bandwhich -i all
```

### Interface-Erklärung

```
┌─────────────────────────────────────────────────┐
│ Total: ↓ 5.2 MB/s  ↑ 320 KB/s                   │
├─────────────────────────────────────────────────┤
│ Process           Remote           ↓     ↑      │
│ firefox         youtube.com      4.8M   100K    │
│ Dropbox         dropbox.com      200K   150K    │
│ Terminal        api.github.com   150K    50K    │
│ Slack           slack.com         50K    20K    │
├─────────────────────────────────────────────────┤
│ Connection Details:                             │
│ firefox (PID 1234)                              │
│   192.168.1.10:54321 → 142.250.185.46:443      │
│   Local Address    → youtube.com (HTTPS)        │
└─────────────────────────────────────────────────┘

Legende:
- Total: Gesamte Download/Upload-Rate
- Process: Name des Prozesses
- Remote: Hostname (DNS-resolved)
- ↓: Download-Rate
- ↑: Upload-Rate
- Connection Details: Detaillierte Verbindungen
```

### Keybindings

Die Navigation im TUI folgt vim-artigen Keybindings. Mit Space kannst du einzelne Prozesse expandieren, um die zugehoerigen Verbindungen im Detail zu sehen:

```bash
# Im bandwhich TUI

↑/↓ oder j/k  # Durch Prozesse navigieren
←/→ oder h/l  # Zwischen Ansichten wechseln
Tab           # Zwischen Panels wechseln
Space         # Process expandieren/kollabieren
q             # Beenden
?             # Hilfe anzeigen
```

### Kommandozeilen-Optionen

Die wichtigsten Flags: `-i` waehlt ein bestimmtes Netzwerk-Interface, `--no-resolve` deaktiviert DNS-Lookups fuer bessere Performance:

```bash
# Interface spezifizieren
bandwhich -i en0
bandwhich -i eth0

# DNS-Resolution ausschalten (schneller)
bandwhich --no-resolve

# Raw-Daten-Modus
bandwhich --raw

# Spezifisches Process-Filter (via grep nach Start)
bandwhich 2>&1 | grep firefox

# Mit Logging (über tee)
bandwhich | tee /tmp/bandwidth.log
```

---

## 🎓 Best Practices

Die folgenden Tipps helfen dir, bandwhich effizient einzusetzen und typische Performance-Probleme zu vermeiden.

### 1. **Capability Setup für sudoless Usage (Linux)**

Statt jedes Mal sudo zu verwenden, setzt du einmalig Linux Capabilities. Damit kann bandwhich Netzwerk-Pakete lesen, ohne Root-Rechte zu benoetigen:

```bash
# Einmalig Capabilities setzen
sudo setcap cap_net_raw,cap_net_admin=+eip $(which bandwhich)

# Prüfen
getcap $(which bandwhich)
# Ausgabe: /usr/bin/bandwhich = cap_net_admin,cap_net_raw+eip

# Jetzt ohne sudo:
bandwhich
```

### 2. **DNS-Resolution disablen für Performance**

DNS-Lookups koennen bandwhich verlangsamen, besonders bei vielen Verbindungen. Wenn du nur IPs brauchst, deaktiviere die Aufloesung:

```bash
# Wenn DNS-Lookups langsam sind
bandwhich --no-resolve

# Zeigt nur IPs, aber schneller:
Process           Remote           ↓     ↑
firefox         142.250.185.46   4.8M   100K
```

### 3. **Monitoring-Script für Background**

Fuer kontinuierliche Ueberwachung kann bandwhich in regelmaessigen Abstaenden Snapshots aufnehmen. Das ist nuetzlich, um Traffic-Muster ueber laengere Zeitraeume zu erkennen:

```bash
#!/bin/bash
# bandwidth-monitor.sh

# Startet bandwhich und logged Top-Prozess
while true; do
    echo "=== $(date) ===" >> /var/log/bandwidth.log
    timeout 10s sudo bandwhich --no-resolve | head -5 >> /var/log/bandwidth.log
    sleep 60
done

# Als Service laufen lassen (systemd)
# /etc/systemd/system/bandwidth-monitor.service
```

### 4. **Kombination mit anderen Tools**

bandwhich laesst sich hervorragend mit System-Monitoring-Tools wie htop kombinieren. In einem tmux-Split siehst du CPU-Last und Netzwerk-Traffic gleichzeitig:

```bash
# bandwhich + htop in tmux
tmux new-session \; \
  send-keys 'sudo bandwhich' C-m \; \
  split-window -h \; \
  send-keys 'htop' C-m

# Oder mit zellij/screen für Persistent Sessions
```

### 5. **Interface-Auto-Detection**

Dieses Script erkennt automatisch das primaere Netzwerk-Interface und startet bandwhich darauf, sodass du den Interface-Namen nicht jedes Mal manuell angeben musst:

```bash
# Script für primäres Interface
#!/bin/bash
PRIMARY_IF=$(ip route | grep default | awk '{print $5}' | head -1)
sudo bandwhich -i $PRIMARY_IF
```

### 6. **Alias für schnellen Start**

Kurze Aliase fuer haeufig genutzte bandwhich-Konfigurationen sparen Tipparbeit und machen den Start schneller:

```bash
# ~/.bashrc / ~/.zshrc
alias bw='sudo bandwhich'
alias bwn='sudo bandwhich --no-resolve'  # No DNS
alias bww='sudo bandwhich -i en0'        # WiFi (macOS)
alias bwe='sudo bandwhich -i eth0'       # Ethernet (Linux)
```

### 7. **Fokussiertes Monitoring mit tmux**

Um den Traffic eines bestimmten Prozesses zu beobachten, kannst du die Ausgabe von bandwhich mit grep filtern oder in einem tmux-Pane isolieren:

```bash
# Watch-Mode für spezifischen Prozess
watch -n 1 'sudo bandwhich --no-resolve 2>&1 | grep -i docker'

# Oder in tmux-Pane
tmux split-window 'sudo bandwhich'
```

---

## 🔥 Beispiele

Die folgenden Beispiele decken typische Szenarien ab -- von der Basis-Analyse bis zur Sicherheitsueberwachung und VPN-Performance-Messung.

### Beispiel 1: Basis-Monitoring

Ein einfacher Einstieg: Starte bandwhich und verschaffe dir einen Ueberblick ueber die aktive Netzwerk-Aktivitaet aller Prozesse:

```bash
# bandwhich starten
sudo bandwhich

# Ausgabe analysieren:
# - Welche Prozesse nutzen viel Bandwidth?
# - Unerwartete Connections?
# - Download vs. Upload Balance

# Navigation
↓↓↓  # Zu firefox
Space  # Expandieren → Zeigt alle Connections

# Details ansehen:
# Local: 192.168.1.10:54321
# Remote: youtube.com (142.250.185.46:443)
# Protocol: HTTPS

q  # Beenden
```

**Ergebnis**: Überblick über aktive Netzwerk-Aktivität.

---

### Beispiel 2: Bandwidth-Hog identifizieren

Das haeufigste Szenario: Das Internet ist langsam und du willst wissen, welcher Prozess die Bandbreite verbraucht:

```bash
# Szenario: Internet ist langsam

sudo bandwhich

# Analyse:
# Total: ↓ 10 MB/s  ↑ 50 KB/s
#
# Process           Remote           ↓      ↑
# Dropbox         dropbox.com      9.8M    40K
# Chrome          google.com       150K     5K
# Terminal        github.com        50K     5K

# → Dropbox synchronisiert massiv
# Action: Dropbox pausieren oder Bandwidth limitieren

# Dropbox pausieren
# Dann erneut prüfen:
# Total: ↓ 200 KB/s  ↑ 10 KB/s
```

**Ergebnis**: Bandwidth-Problem identifiziert und gelöst.

---

### Beispiel 3: Development-Debugging (API-Calls)

```bash
# Development-Server läuft, aber API-Calls scheinen langsam

sudo bandwhich

# Filter nach Development-Prozess
# In separatem Terminal:
ps aux | grep "node server.js"
# PID: 12345

# In bandwhich: Nach PID oder Name suchen
# Prozess: node (PID 12345)
#   Connections:
#   127.0.0.1:3000 → api.external.com:443  ↓ 2 MB/s
#   127.0.0.1:3000 → db.internal.com:5432  ↓ 50 KB/s

# → API-Call zu api.external.com ist Bottleneck
# → Caching implementieren oder API optimieren
```

**Ergebnis**: API-Performance-Problem lokalisiert.

---

### Beispiel 4: Security-Check (unerwartete Connections)

bandwhich eignet sich auch zur Sicherheitsueberwachung: Unerwartete ausgehende Verbindungen, besonders mit hohem Upload, koennen auf Malware oder Datenabfluss hindeuten:

```bash
# Regelmäßiger Security-Check

sudo bandwhich

# Suspicious Activity:
# Process           Remote           ↓      ↑
# python3         unknown-server   10K    5M
#                 (45.33.32.156)

# → Python-Script uploaded viel Daten zu unbekanntem Server

# Prozess identifizieren
ps aux | grep python3
# Zeigt: /tmp/suspicious-script.py

# Action:
kill -9 <PID>
# Oder genauer analysieren mit:
sudo lsof -p <PID>
```

**Ergebnis**: Verdächtiger Prozess erkannt und gestoppt.

---

### Beispiel 5: VPN-Traffic-Analyse

```bash
# VPN läuft, Performance checken

# Vor VPN
sudo bandwhich -i en0  # WiFi Interface

# VPN starten (z.B. WireGuard)
wg-quick up wg0

# Während VPN
sudo bandwhich -i wg0  # VPN Interface

# Vergleich:
# wg0:
# Total: ↓ 2 MB/s  ↑ 200 KB/s
#
# Process           Remote           ↓      ↑
# Chrome          google.com       1.8M    150K
# (via VPN-Tunnel)

# → Alle Traffic geht durch VPN
# → Overhead sichtbar (weniger Bandbreite)
```

**Ergebnis**: VPN-Performance-Impact quantifiziert.

---

### Beispiel 6: Docker-Container-Monitoring

```bash
# Docker-Container laufen, welcher nutzt viel Bandwidth?

sudo bandwhich

# Ausgabe:
# Process           Remote           ↓      ↑
# docker-proxy    docker.io        5 MB   100K
# containerd      registry.io      2 MB    50K

# Details ansehen (Space auf docker-proxy)
# Connections:
#   Container: myapp_web_1
#   Image: nginx:latest
#   Remote: 104.18.121.25:443 (docker.io)

# → Container "myapp_web_1" pulled Image

# Oder: Traffic eines spezifischen Containers
docker exec <container-id> bandwhich  # (falls installiert)
```

**Ergebnis**: Docker-Network-Activity transparent gemacht.

---

### Beispiel 7: Videokonferenz-Bandwidth

```bash
# Zoom-Call Bandwidth-Analyse

# Vor Call
sudo bandwhich
# Baseline: ↓ 500 KB/s  ↑ 50 KB/s

# Während Call
sudo bandwhich

# Ausgabe:
# Total: ↓ 2.5 MB/s  ↑ 1.8 MB/s
#
# Process           Remote           ↓      ↑
# zoom.us         zoom.us          2 MB   1.6M
# Chrome          google.com       400K    150K

# → Zoom nutzt ~2 MB/s Down, ~1.6 MB/s Up
# → Für 1080p Video + Audio normal
# → Wenn Probleme: Auf 720p reduzieren
```

**Ergebnis**: Videokonferenz-Bandwidth gemessen, Optimierung möglich.

---

### Beispiel 8: Cloud-Sync-Monitoring (Dropbox/iCloud)

```bash
# Großer Upload zu Cloud-Storage

sudo bandwhich

# Ausgabe:
# Total: ↓ 100 KB/s  ↑ 8 MB/s
#
# Process           Remote           ↓      ↑
# Dropbox         dropbox.com      50K    7.5M
# iCloud          icloud.com       50K    500K

# Space auf Dropbox
# Files being uploaded:
#   ~/Photos/vacation/IMG_001.jpg → IMG_500.jpg
#   Total: 2.5 GB remaining

# Action:
# - Dropbox pausieren wenn Bandwidth gebraucht wird
# - Oder Bandwidth-Limit in Dropbox-Settings setzen
```

**Ergebnis**: Cloud-Upload transparent, kann gemanaged werden.

---

### Beispiel 9: Gaming-Traffic-Analyse

```bash
# Online-Game spielt, Ping ist hoch

sudo bandwhich

# Ausgabe:
# Total: ↓ 5 MB/s  ↑ 200 KB/s
#
# Process           Remote           ↓      ↑
# Steam           steampowered.com 4.8M    50K
# GameProcess     game-server.com  150K   120K

# → Steam downloaded Update im Hintergrund
# → Belastet Download-Bandwidth

# Action:
# Steam pausieren während Gaming
# Oder in Steam-Settings: "Only update between 2-8 AM"
```

**Ergebnis**: Gaming-Performance-Problem gelöst.

---

### Beispiel 10: Bandwidth-Monitoring Script

```bash
#!/bin/bash
# bandwidth-alert.sh

# Alert wenn Gesamtbandwidth > Threshold

THRESHOLD_MB=10  # 10 MB/s

while true; do
    # bandwhich kurz laufen lassen, parsen
    BANDWIDTH=$(sudo timeout 5s bandwhich --no-resolve 2>&1 | \
                head -1 | \
                grep -oP 'Total: ↓ \K[0-9.]+' | \
                awk '{print int($1)}')

    if [ "$BANDWIDTH" -gt "$THRESHOLD_MB" ]; then
        # Alert senden
        echo "⚠️  High bandwidth usage: ${BANDWIDTH} MB/s" | \
            osascript -e 'display notification "High bandwidth" with title "bandwhich alert"'

        # Log top processes
        sudo timeout 5s bandwhich --no-resolve | head -10 >> /tmp/bandwidth-alerts.log
    fi

    sleep 30
done
```

**Ergebnis**: Automatische Bandwidth-Überwachung mit Alerts.

---

### Beispiel 11: Remote-Server-Monitoring (SSH)

```bash
# Auf Remote-Server bandwhich nutzen

ssh user@remote-server

# bandwhich installieren (falls nicht vorhanden)
cargo install bandwhich

# Capabilities setzen
sudo setcap cap_net_raw,cap_net_admin=+eip ~/.cargo/bin/bandwhich

# Monitoring starten
bandwhich

# Analyse:
# Total: ↓ 50 MB/s  ↑ 100 MB/s
#
# Process           Remote           ↓      ↑
# nginx           (multiple)       10M     50M
# postgresql      (local)           5M     10M
# docker          docker.io        35M     40M

# → nginx serviert Traffic
# → postgresql DB-Traffic
# → docker pulling Images
```

**Ergebnis**: Server-Network-Activity transparent gemacht.

---

### Beispiel 12: Bandwidth-Comparison (WiFi vs Ethernet)

```bash
# Performance-Vergleich verschiedener Interfaces

# WiFi-Test
sudo bandwhich -i en0  # macOS WiFi

# Speedtest in zweitem Terminal
curl -o /dev/null https://speed.cloudflare.com/__down?bytes=100000000

# bandwhich zeigt:
# Total: ↓ 8 MB/s  ↑ 100 KB/s

# Ethernet-Test
sudo bandwhich -i en1  # Ethernet

# Speedtest wiederholen
curl -o /dev/null https://speed.cloudflare.com/__down?bytes=100000000

# bandwhich zeigt:
# Total: ↓ 25 MB/s  ↑ 100 KB/s

# → Ethernet ~3x schneller als WiFi
```

**Ergebnis**: Interface-Performance quantifiziert.

---

## 🔗 Integration mit Claude Code

### bandwhich für Network-Debugging in AI-Workflows

#### Monitoring-Setup für Development

```bash
# Workflow: AI-App entwickeln, API-Calls analysieren

# Terminal 1: bandwhich
sudo bandwhich

# Terminal 2: Development Server
npm run dev

# Terminal 3: AI-Tests
# Claude Code requests analysieren

# bandwhich zeigt:
# node (dev server)
#   → api.anthropic.com    ↓ 50 KB/s  ↑ 10 KB/s
#   → api.openai.com       ↓ 100 KB/s ↑ 5 KB/s

# Erkenntnisse für Claude Code:
# - Welche AI-APIs werden genutzt?
# - Wie viel Bandwidth pro Request?
# - Retry-Verhalten bei Failures?
```

#### Context-Export für AI-Analyse

```bash
# Script: bandwidth-context-export.sh
#!/bin/bash

OUTPUT="/tmp/network_context.txt"

echo "=== Network Activity at $(date) ===" > $OUTPUT
echo "" >> $OUTPUT

# bandwhich Snapshot
sudo timeout 10s bandwhich --no-resolve 2>&1 | head -20 >> $OUTPUT

echo "" >> $OUTPUT
echo "=== Active Connections ===" >> $OUTPUT
netstat -an | grep ESTABLISHED >> $OUTPUT

# Für Claude Code verwendbar:
cat $OUTPUT | pbcopy  # macOS
# Oder
cat $OUTPUT | xclip -selection clipboard  # Linux

# → In Claude Code: "Hier ist mein aktueller Network-Traffic, analysiere..."
```

---

## 🤖 Claude Code Integration

### Workflow 1: API-Traffic waehrend Claude Code monitoren
```bash
sudo bandwhich
# Zeigt welche Prozesse Netzwerk-Traffic generieren
```

### Workflow 2: Netzwerk-Debugging bei langsamen Responses
```bash
# Bandwhich in separatem Terminal-Pane
sudo bandwhich --raw | grep -i "anthropic\|claude"
```

### Workflow 3: Traffic-Analyse nach Interface
```bash
sudo bandwhich -i en0
```

> 💡 **Tipp**: Wenn Claude Code langsam antwortet, nutze bandwhich um zu pruefen ob Netzwerk-Engpaesse die Ursache sind.

---

## 🐛 Troubleshooting

Hier findest du Loesungen fuer die haeufigsten bandwhich-Probleme. Die meisten haengen mit Berechtigungen oder Netzwerk-Konfiguration zusammen.

### Problem 1: Permission Denied

**Symptom**: `Error: Permission denied (os error 13)`

**Ursache**: bandwhich benötigt root/capabilities für packet capture

**Lösung**:

bandwhich braucht Zugriff auf Netzwerk-Pakete, was Root-Rechte erfordert. Die sauberste Loesung unter Linux ist das Setzen von Capabilities:

```bash
# Option 1: Mit sudo laufen lassen
sudo bandwhich

# Option 2: Capabilities setzen (Linux - empfohlen)
sudo setcap cap_net_raw,cap_net_admin=+eip $(which bandwhich)

# Prüfen
getcap $(which bandwhich)

# Option 3: bandwhich in sudoers (nicht empfohlen)
sudo visudo
# Hinzufügen:
# username ALL=(ALL) NOPASSWD: /usr/local/bin/bandwhich
```

---

### Problem 2: Keine Prozess-Namen sichtbar

**Symptom**: Alle Processes zeigen nur "<unknown>"

**Ursache**: Fehlende Permissions für `/proc` Access

**Lösung**:

Bandwhich muss die Zuordnung von Netzwerk-Sockets zu Prozessen lesen koennen. Unter Linux braucht es dafuer Zugriff auf `/proc`:

```bash
# Linux: Prüfen ob procfs mounted
mount | grep proc

# Capabilities umfangreicher setzen
sudo setcap cap_net_raw,cap_net_admin,cap_dac_read_search=+eip $(which bandwhich)

# Oder mit sudo laufen lassen
sudo bandwhich
```

---

### Problem 3: DNS-Resolution sehr langsam

**Symptom**: bandwhich braucht lange zum Starten/Updaten

**Ursache**: DNS-Lookups für alle IPs

**Lösung**:

Jede aktive Verbindung loest einen DNS-Lookup aus, was bei vielen Connections die Darstellung verzoegert. Deaktiviere die Aufloesung oder nutze einen schnelleren DNS-Server:

```bash
# Option 1: DNS-Resolution disablen
bandwhich --no-resolve

# Option 2: Schnelleren DNS-Server verwenden
# /etc/resolv.conf
nameserver 1.1.1.1  # Cloudflare
nameserver 8.8.8.8  # Google

# Option 3: Local DNS-Cache
# Ubuntu/Debian
sudo apt install dnsmasq
```

---

### Problem 4: Interface nicht gefunden

**Symptom**: `Error: Interface not found`

**Ursache**: Falsche Interface-Bezeichnung

**Lösung**:

Interface-Namen unterscheiden sich zwischen macOS und Linux. Liste zuerst die verfuegbaren Interfaces auf, um den richtigen Namen zu finden:

```bash
# Verfügbare Interfaces listen
ip link show  # Linux
ifconfig  # macOS/BSD

# Oder
networksetup -listallhardwareports  # macOS

# Typische Namen:
# macOS: en0 (WiFi), en1 (Ethernet)
# Linux: wlan0 (WiFi), eth0 (Ethernet), wg0 (WireGuard)

# Alle Interfaces monitoren
bandwhich -i all
```

---

### Problem 5: Hohe CPU-Last

**Symptom**: bandwhich verbraucht viel CPU

**Ursache**: Viele Connections oder DNS-Lookups

**Lösung**:

Reduziere den Aufwand, indem du DNS-Resolution deaktivierst und nur ein bestimmtes Interface statt aller ueberwachst:

```bash
# DNS-Resolution ausschalten
bandwhich --no-resolve

# Refresh-Rate reduzieren (falls Option vorhanden)
# Oder: Spezifisches Interface statt "all"
bandwhich -i en0

# Alternative: nethogs (weniger Features, weniger CPU)
sudo nethogs
```

---

## 📊 Vergleich mit Alternativen

| Feature | bandwhich | nethogs | iftop | vnstat | Wireshark |
|---------|-----------|---------|-------|--------|-----------|
| **Per-Process** | ✅ Ja | ✅ Ja | ❌ Interface | ❌ Interface | ⚠️ Komplex |
| **Real-time** | ✅ TUI | ✅ TUI | ✅ TUI | ❌ Stats | ✅ Live |
| **DNS Resolution** | ✅ Ja | ⚠️ Basic | ✅ Ja | ❌ Nein | ✅ Ja |
| **Connection Details** | ✅ Ja | ⚠️ Basic | ✅ Ja | ❌ Nein | ✅ Umfangreich |
| **Historical Data** | ❌ Nein | ❌ Nein | ❌ Nein | ✅ Ja | ✅ Capture |
| **Ease of Use** | ✅ Einfach | ✅ Einfach | ✅ Einfach | ✅ Einfach | ⚠️ Komplex |
| **Resource Usage** | ⚠️ Mittel | ✅ Niedrig | ✅ Niedrig | ✅ Niedrig | ⚠️ Hoch |
| **Installation** | ✅ Cargo/Brew | ✅ apt/brew | ✅ apt/brew | ✅ apt/brew | ✅ apt/brew |
| **Root Required** | ✅ Ja | ✅ Ja | ✅ Ja | ❌ Nein | ✅ Ja |

### Wann bandwhich?
- ✅ Per-Process Bandwidth-Monitoring
- ✅ Moderne TUI gewünscht
- ✅ DNS-Resolution wichtig
- ✅ Rust-Ökosystem bevorzugt

### Wann nethogs?
- ✅ Minimaler Resource-Footprint
- ✅ Einfache Übersicht genug
- ✅ Ältere Systeme
- ✅ Schnelle Installation

### Wann iftop?
- ✅ Interface-Level Monitoring
- ✅ Fokus auf Connections nicht Processes
- ✅ Seit Jahren etabliert
- ✅ Überall verfügbar

### Wann vnstat?
- ✅ Historical Data wichtig
- ✅ Langzeit-Statistiken
- ✅ Kein Root für Viewing
- ✅ Cron-Job-basiert

### Wann Wireshark?
- ✅ Packet-Level Analysis
- ✅ Protocol Debugging
- ✅ Forensics
- ✅ GUI bevorzugt

---

## 🔗 Nützliche Links

### Offizielle Ressourcen
- **GitHub**: https://github.com/imsnif/bandwhich
- **Crates.io**: https://crates.io/crates/bandwhich
- **Docs**: https://github.com/imsnif/bandwhich/blob/main/README.md

### Alternativen
- **nethogs**: https://github.com/raboof/nethogs
- **iftop**: http://www.ex-parrot.com/pdw/iftop/
- **vnstat**: https://humdi.net/vnstat/
- **nload**: https://github.com/rolandriegel/nload

### Verwandte Tools
- **tcpdump**: https://www.tcpdump.org/
- **Wireshark**: https://www.wireshark.org/
- **bmon**: https://github.com/tgraf/bmon

### Tutorials
- **Arch Wiki (Network)**: https://wiki.archlinux.org/title/Network_configuration
- **Linux Network Monitoring**: https://www.cyberciti.biz/tips/linux-investigate-bandwidth-usage.html

---

## 💎 Pro-Tipps

### 1. **Alias mit Interface-Detection**

```bash
# ~/.bashrc
function bw() {
    # Detect primary interface
    if command -v ip &> /dev/null; then
        IFACE=$(ip route | grep default | awk '{print $5}' | head -1)
    else
        IFACE="en0"  # macOS default
    fi

    sudo bandwhich -i $IFACE "$@"
}
```

### 2. **Monitoring-Dashboard mit tmux**

```bash
# ~/.tmux-bandwidth.conf
new-session -s bandwidth \; \
  send-keys 'sudo bandwhich' C-m \; \
  split-window -v \; \
  send-keys 'htop -s PERCENT_CPU' C-m \; \
  split-window -h \; \
  send-keys 'watch -n 1 "ping -c 1 8.8.8.8 | tail -1"' C-m \; \
  select-pane -t 0

# Start mit: tmux attach -t bandwidth
```

### 3. **Bandwidth-Budget Tracking**

```bash
#!/bin/bash
# monthly-bandwidth-tracker.sh

# Kombiniert vnstat (historical) mit bandwhich (current)

echo "=== Current Usage ==="
sudo timeout 10s bandwhich --no-resolve 2>&1 | head -10

echo ""
echo "=== Monthly Total ==="
vnstat -m

echo ""
echo "=== Top Talkers Today ==="
vnstat -d | tail -5
```

### 4. **Process-Whitelist für Alerts**

```bash
#!/bin/bash
# bandwidth-whitelist-alert.sh

WHITELIST=("Chrome" "Firefox" "Dropbox" "Slack")

bandwhich_output=$(sudo timeout 5s bandwhich --no-resolve 2>&1)

# Parse und prüfe gegen Whitelist
while read -r line; do
    process=$(echo "$line" | awk '{print $1}')

    if [[ ! " ${WHITELIST[@]} " =~ " ${process} " ]]; then
        bandwidth=$(echo "$line" | awk '{print $3}')

        if [[ "$bandwidth" =~ M ]]; then
            echo "⚠️  Unexpected high bandwidth: $line"
            # Send alert
        fi
    fi
done <<< "$bandwhich_output"
```

### 5. **Connection-Logger für Forensics**

```bash
#!/bin/bash
# connection-logger.sh

LOGFILE="/var/log/connections-$(date +%Y%m%d).log"

while true; do
    echo "=== $(date) ===" >> "$LOGFILE"
    sudo timeout 10s bandwhich --no-resolve 2>&1 >> "$LOGFILE"
    echo "" >> "$LOGFILE"
    sleep 300  # Alle 5 Minuten
done
```

### 6. **VPN-Performance-Tracker**

```bash
#!/bin/bash
# vpn-performance.sh

# Vor VPN
echo "=== Without VPN ==="
sudo timeout 10s bandwhich -i en0 2>&1 | head -5
speedtest-cli --simple

# VPN aktivieren
wg-quick up wg0

# Mit VPN
echo "=== With VPN (wg0) ==="
sudo timeout 10s bandwhich -i wg0 2>&1 | head -5
speedtest-cli --simple

# Vergleich loggen
```

### 7. **Container-Network-Debugging**

```bash
# Docker-Container mit bandwhich-Access

# Dockerfile
FROM rust:latest
RUN cargo install bandwhich
RUN setcap cap_net_raw,cap_net_admin=+eip /usr/local/cargo/bin/bandwhich

# Container starten mit Capabilities
docker run --cap-add=NET_RAW --cap-add=NET_ADMIN myimage bandwhich
```

### 8. **Systemd-Service für Continuous Monitoring**

```bash
# /etc/systemd/system/bandwidth-monitor.service
[Unit]
Description=Bandwidth Monitoring Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/bandwidth-logger.sh
Restart=always
User=root

[Install]
WantedBy=multi-user.target

# Enable
sudo systemctl enable bandwidth-monitor
sudo systemctl start bandwidth-monitor
```

---

## 📝 Zusammenfassung

### Das Wichtigste zu bandwhich

**bandwhich** ist ein modernes **Terminal UI Tool** für **Per-Process Network Bandwidth Monitoring** in Echtzeit:

**Kern-Features:**
- ✅ Per-Process Bandwidth-Tracking
- ✅ Real-time TUI mit Live-Updates
- ✅ DNS-Resolution für lesbare Hostnamen
- ✅ Connection Details (Local/Remote)
- ✅ Upload/Download getrennt
- ✅ Rust-basiert (modern, performant)

**Typische Anwendungsfälle:**
1. **Bandwidth-Hogs identifizieren**: Welcher Prozess nutzt viel Traffic?
2. **Development-Debugging**: API-Calls und Connections analysieren
3. **Security-Monitoring**: Unerwartete Connections erkennen
4. **Performance-Analysis**: Bottlenecks identifizieren

**Vorteile:**
- Prozess-genaues Tracking
- Übersichtliche TUI
- DNS-Resolution built-in
- Moderne Rust-Implementation

**Nachteile:**
- Benötigt root/capabilities
- Keine Historical Data
- DNS-Lookups können langsam sein
- TUI nicht scriptable

**Essential Usage:**
```bash
sudo bandwhich              # Starten
sudo bandwhich -i en0       # Spezifisches Interface
bandwhich --no-resolve      # Ohne DNS (schneller)

# Im TUI:
↑/↓          # Navigate
Space        # Expand process
q            # Quit
```

**Setup-Empfehlung:**
```bash
# Linux: Capabilities setzen (sudoless)
sudo setcap cap_net_raw,cap_net_admin=+eip $(which bandwhich)

# Alias
alias bw='bandwhich'
alias bwn='bandwhich --no-resolve'
```

**Best Practices:**
1. Capabilities setzen statt sudo (Linux)
2. `--no-resolve` für bessere Performance
3. Kombinieren mit htop/nethogs für Gesamtbild
4. Regelmäßig für Security-Checks nutzen
5. In tmux/zellij für Persistent Monitoring

**Workflow-Muster:**
```bash
# Problem: Internet langsam
sudo bandwhich
# → Dropbox nutzt 10 MB/s
# → Pausieren → Problem gelöst

# Problem: API-Calls langsam
sudo bandwhich
# → node → api.external.com: 2 MB/s
# → Caching implementieren
```

**Integration mit Claude Code:**
- Network-Activity für AI-App-Debugging
- API-Usage-Pattern analysieren
- Performance-Probleme identifizieren
- Context-Export für AI-Analyse

**Alternativen:**
- **nethogs**: Einfacher, weniger Features
- **iftop**: Interface-Level, nicht per-process
- **vnstat**: Historical Data, nicht Real-time
- **Wireshark**: Packet-Level, GUI, komplex

**Entscheidungshilfe:**
- **bandwhich verwenden** → Per-Process-Monitoring, moderne TUI, DNS-Resolution
- **nethogs verwenden** → Minimaler Footprint, einfache Übersicht
- **iftop verwenden** → Interface-Fokus, etabliert
- **vnstat verwenden** → Historical Data, Statistiken

bandwhich ist die richtige Wahl für Entwickler und Admins, die **schnell identifizieren wollen welcher Prozess wie viel Bandwidth nutzt**, mit einer modernen TUI und ohne tcpdump-Komplexität.

---

**Letzte Aktualisierung**: Februar 2026
**Schwierigkeitsgrad**: Fortgeschritten
**Geschätzte Lernzeit**: 20-30 Minuten
**Voraussetzungen**: Netzwerk-Grundlagen, Terminal-Erfahrung, sudo-Access