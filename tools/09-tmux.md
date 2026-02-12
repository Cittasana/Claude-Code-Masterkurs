# 🖥️ tmux - Terminal Multiplexer für Power-User

**Kategorie**: 🔵 Fortgeschrittene Tools
**Installation**: 10 Minuten
**Skill-Level**: Mittel
**Impact**: Massiv (Game-Changer für Development)

---

> 🚀 **Claude Code Relevanz**: tmux ermoeglicht es, Claude Code in einem persistenten Terminal-Pane laufen zu lassen, waehrend parallel Server, Tests und Logs in anderen Panes sichtbar bleiben -- der ultimative Produktivitaets-Multiplikator fuer AI-gestuetzte Entwicklung.

## ✅ Berechtigung - Warum tmux?

### Das Problem mit einzelnen Terminal-Fenstern
Beim Development jonglierst du ständig mit vielen Tasks:
- ❌ **Fenster-Chaos**: 10+ Terminal-Tabs offen (Editor, Server, Logs, Tests)
- ❌ **Context Loss**: Server stirbt wenn Terminal schließt
- ❌ **Session Wechsel**: Projekt X → Projekt Y = alles neu aufsetzen
- ❌ **Remote Work**: SSH-Session getrennt = alles verloren
- ❌ **Kein Persistence**: Neustart = alle Setups weg
- ❌ **Split-View fehlt**: Nur 1 Command sichtbar pro Window

**Beispiel**: Du startest Dev-Server, öffnest Editor, läufst Tests → 4 Terminal-Tabs.
Problem: Tab wechseln nervt, Übersicht fehlt, Session nicht persistent.

### Die Lösung: tmux
`tmux` (Terminal Multiplexer) = Virtuelles Terminal-Management-System:
- ✅ **Sessions**: Mehrere Projekte parallel, persistent
- ✅ **Windows**: Tabs innerhalb Sessions
- ✅ **Panes**: Split-Screen (horizontal/vertical)
- ✅ **Detach/Attach**: Session läuft weiter im Hintergrund
- ✅ **Remote Persistent**: SSH-Trennung = kein Problem
- ✅ **Scriptable**: Projekt-Setup automatisieren

**Ergebnis**:
- 1 Terminal-Fenster statt 10
- Sessions überleben Disconnects
- Instant Context-Switching zwischen Projekten
- +50% Produktivität

---

## 🎯 Zwecke - Wofür du tmux einsetzt

Hier siehst du die fuenf haeufigsten Einsatzszenarien fuer tmux -- von paralleler Projektarbeit bis hin zum Pair Programming. Jeder Zweck zeigt dir, welches Problem tmux konkret loest.

### 1. **Multi-Projekt-Development**
Verschiedene Projekte, instant switch:
```bash
tmux new -s api     # API-Projekt
tmux new -s frontend # Frontend-Projekt
tmux attach -t api   # Zurück zu API
```

### 2. **Persistent Remote Sessions**
SSH-Trennung = kein Problem:
```bash
# Auf Server
ssh user@server
tmux new -s dev
# ... work ...
# Internet disconnects
# ... later ...
ssh user@server
tmux attach -t dev  # Alles noch da!
```

### 3. **Split-Screen Development**
Alles auf einen Blick:
```bash
# Editor oben, Server unten, Tests rechts
tmux split-window -h
tmux split-window -v
```

### 4. **Long-Running Processes**
Server/Jobs laufen lassen:
```bash
tmux new -s server
npm start  # Server läuft
# Ctrl+B D = Detach
# Server läuft weiter im Hintergrund
```

### 5. **Pair Programming**
Geteilter Screen:
```bash
# Person A
tmux new -s pair

# Person B (remote)
ssh user@server
tmux attach -t pair  # Sieht selben Screen!
```

---

## 💻 Verwendung - Wie du tmux einsetzt

Dieser Abschnitt fuehrt dich von der Installation ueber die ersten Schritte bis hin zu fortgeschrittenen Konfigurationen. Am Ende hast du ein vollstaendig eingerichtetes tmux-Setup.

### Installation

Die Installation ist auf allen gaengigen Systemen mit dem Paketmanager moeglich:

**macOS (Homebrew)**:
```bash
brew install tmux
```

**Ubuntu/Debian**:
```bash
sudo apt install tmux
```

**Arch Linux**:
```bash
sudo pacman -S tmux
```

> 💡 **Tipp**: Nach der Installation starte tmux sofort mit `tmux new -s dev` -- benenne deine Sessions immer, damit du sie spaeter leicht wiederfindest.

---

### Quick Start (5 Minuten)

Die folgenden Befehle decken 90% deiner taeglichen tmux-Nutzung ab -- Sessions erstellen, auflisten, wieder verbinden und beenden:

**Basis-Commands**:
```bash
# Session starten
tmux

# Named Session
tmux new -s project

# Sessions listen
tmux ls

# Attach zu Session
tmux attach -t project

# Kill Session
tmux kill-session -t project
```

Alle Keybindings in tmux beginnen mit dem Prefix (Standard: Ctrl+B). Du drueckst zuerst den Prefix und dann die Taste fuer die gewuenschte Aktion:

**Wichtigste Keybindings**:
```
Prefix: Ctrl+B (dann Command)

Sessions:
  Ctrl+B D    - Detach (Session läuft weiter)
  Ctrl+B $    - Session umbenennen
  Ctrl+B S    - Session-Liste (wechseln)

Windows (Tabs):
  Ctrl+B C    - Neues Window erstellen
  Ctrl+B N    - Nächstes Window
  Ctrl+B P    - Vorheriges Window
  Ctrl+B 0-9  - Zu Window 0-9 springen
  Ctrl+B ,    - Window umbenennen
  Ctrl+B &    - Window schließen

Panes (Split-Screen):
  Ctrl+B %    - Vertical Split
  Ctrl+B "    - Horizontal Split
  Ctrl+B O    - Zum nächsten Pane
  Ctrl+B →    - Pane rechts auswählen
  Ctrl+B X    - Pane schließen
  Ctrl+B Z    - Pane Zoom (Fullscreen Toggle)
```

---

### Advanced Usage

Fortgeschrittene Techniken wie automatisierte Projekt-Setups, benutzerdefinierte Konfigurationen und Plugin-Management heben dein tmux-Setup auf das naechste Level.

**1. Project Session Setup**:
Dieses Script erstellt automatisch eine komplette Entwicklungsumgebung mit Editor, Server und Tests in separaten Windows:
```bash
# Script für Dev-Setup
cat > ~/bin/dev-setup << 'EOF'
#!/bin/bash
SESSION="myproject"

# Session erstellen
tmux new-session -d -s $SESSION -n editor

# Window 1: Editor
tmux send-keys -t $SESSION:editor "cd ~/projekt && vim" C-m

# Window 2: Server
tmux new-window -t $SESSION -n server
tmux send-keys -t $SESSION:server "cd ~/projekt && npm start" C-m

# Window 3: Tests
tmux new-window -t $SESSION -n tests
tmux send-keys -t $SESSION:tests "cd ~/projekt && npm test -- --watch" C-m

# Attach
tmux attach -t $SESSION
EOF

chmod +x ~/bin/dev-setup

# Nutzen:
dev-setup  # → Instant Dev-Environment!
```

**2. Split-Screen Layouts**:
Mit diesen Keybindings teilst du dein Terminal in mehrere Bereiche auf und passt deren Groesse an:
```bash
# Horizontal Split (2 Panes übereinander)
Ctrl+B "

# Vertical Split (2 Panes nebeneinander)
Ctrl+B %

# Pane-Größe ändern
Ctrl+B : resize-pane -D 5  # Down 5 Zeilen
Ctrl+B : resize-pane -U 5  # Up 5 Zeilen
Ctrl+B : resize-pane -L 5  # Left 5 Spalten
Ctrl+B : resize-pane -R 5  # Right 5 Spalten

# Pane-Layout vordefiniert wechseln
Ctrl+B Alt+1  # Even Horizontal
Ctrl+B Alt+2  # Even Vertical
Ctrl+B Alt+3  # Main Horizontal
Ctrl+B Alt+4  # Main Vertical
Ctrl+B Alt+5  # Tiled
```

**3. Copy Mode (Scrollen & Kopieren)**:
Im Copy Mode kannst du durch den Terminal-Output scrollen, Text markieren und kopieren -- unverzichtbar, da normales Scrollen in tmux nicht funktioniert:
```bash
# Copy Mode aktivieren
Ctrl+B [

# Dann (Vim-Mode):
  ↑↓←→     - Navigieren
  Ctrl+U/D - Page Up/Down
  /text    - Suchen
  Space    - Selection starten
  Enter    - Kopieren
  q        - Exit Copy Mode

# Paste
Ctrl+B ]
```

> ⚠️ **Warnung**: Der Copy Mode (Ctrl+B [) ist essenziell zum Scrollen in tmux. Ohne ihn kannst du vorherige Ausgaben nicht einsehen -- aktiviere ausserdem Mouse Support fuer einfacheres Scrollen.

**4. Custom Config (~/.tmux.conf)**:
Diese Konfiguration aendert den Prefix zu Ctrl+A, aktiviert Maus-Support, fuegt Vim-aehnliche Navigation hinzu und verbessert die visuelle Darstellung:
```bash
cat > ~/.tmux.conf << 'EOF'
# Prefix auf Ctrl+A ändern (einfacher als Ctrl+B)
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# Mouse Support
set -g mouse on

# Vim-Style Pane Navigation
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# Pane Splitting (intuitive Keys)
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"

# Start Windows/Panes at 1 (nicht 0)
set -g base-index 1
set -g pane-base-index 1

# Status Bar
set -g status-bg black
set -g status-fg white
set -g status-left "#[fg=green]#S "
set -g status-right "#[fg=yellow]%H:%M "

# 256 Colors
set -g default-terminal "screen-256color"

# Longer History
set -g history-limit 10000

# No Delay for Escape Key
set -sg escape-time 0

# Reload Config
bind r source-file ~/.tmux.conf \; display "Config Reloaded!"
EOF

# Config aktivieren
tmux source-file ~/.tmux.conf
```

**5. Session Management (Script)**:
Diese Shell-Funktionen nutzen fzf fuer interaktives Session-Management -- Wechseln, Erstellen und Beenden von Sessions wird damit zum Einzeiler:
```bash
# Alle Sessions anzeigen + Switchen
tmux-switch() {
  local session=$(tmux ls | fzf | cut -d: -f1)
  [[ -n "$session" ]] && tmux switch-client -t "$session"
}

# Neue Session (fragt nach Name)
tmux-new() {
  read -p "Session Name: " name
  tmux new -s "$name"
}

# Kill Session (interaktiv)
tmux-kill() {
  local session=$(tmux ls | fzf | cut -d: -f1)
  [[ -n "$session" ]] && tmux kill-session -t "$session"
}
```

**6. Window/Pane Synchronization**:
Der Sync-Modus sendet jeden Tastendruck gleichzeitig an alle Panes -- ideal fuer parallele Server-Administration:
```bash
# Commands an alle Panes schicken (Sync Mode)
Ctrl+B : setw synchronize-panes on

# Nutzen: Mehrere Server parallel steuern
# z.B. auf 4 Servern gleichzeitig "apt update"

# Wieder ausschalten
Ctrl+B : setw synchronize-panes off
```

> 💡 **Tipp**: Nutze `tmux-resurrect` und `tmux-continuum` zusammen -- so werden deine Sessions automatisch gespeichert und nach einem Neustart wiederhergestellt, ohne dass du manuell speichern musst.

**7. Tmux Plugin Manager (TPM)**:
TPM verwaltet tmux-Plugins automatisch -- einmal konfiguriert, genuegt ein Tastendruck zum Installieren neuer Plugins:
```bash
# Installation
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# In ~/.tmux.conf:
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-resurrect'  # Sessions speichern
set -g @plugin 'tmux-plugins/tmux-continuum'  # Auto-Save

# Init TPM
run '~/.tmux/plugins/tpm/tpm'

# Plugins installieren
Ctrl+B I  # (Großes I)
```

---

## 🏆 Best Practices

Diese bewaehrten Konfigurationen und Arbeitsweisen machen tmux deutlich ergonomischer und produktiver.

### 1. **Prefix ändern (Ctrl+A statt Ctrl+B)**
Ctrl+A liegt direkt neben dem kleinen Finger und ist dadurch viel schneller erreichbar als Ctrl+B:
```bash
# In ~/.tmux.conf
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# Reason: Ctrl+A ist einfacher zu erreichen
```

### 2. **Mouse Support aktivieren**
Mouse Support erlaubt Klicken zum Pane-Wechsel und Scrollen mit dem Mausrad -- ideal fuer Einsteiger, die sich noch nicht alle Keybindings gemerkt haben:
```bash
# In ~/.tmux.conf
set -g mouse on

# Dann: Klicken um Panes/Windows zu wechseln
# Scrollen mit Mausrad
```

### 3. **Projekt-basierte Sessions**
Benenne Sessions nach Projekten, um sofort zu wissen, wohin du wechselst -- das vermeidet Verwechslungen bei vielen parallelen Sessions:
```bash
# Eine Session pro Projekt
tmux new -s api-backend
tmux new -s react-frontend
tmux new -s devops-scripts

# Schnelles Switching
tmux ls  # Übersicht
tmux attach -t api-backend
```

### 4. **Split-Screen Standard-Layout**
```bash
# Für Web-Dev:
# ┌─────────────┬──────┐
# │             │ Logs │
# │   Editor    ├──────┤
# │             │ Test │
# └─────────────┴──────┘

# Setup-Script:
tmux split-window -h -p 30  # 30% rechts
tmux split-window -v         # Split rechts vertical
tmux select-pane -t 0        # Zurück zu Main
```

> 🚀 **Beispiel**: Ein typisches Claude Code Setup besteht aus 3 Panes: Links Claude Code, rechts oben der Dev-Server, rechts unten die Test-Ausgabe. Mit einem einzigen tmux-Script laesst sich dieses Layout in Sekunden aufbauen.

### 5. **Resurrect Plugin für Persistence**
Ohne dieses Plugin gehen alle Sessions bei einem System-Neustart verloren. Resurrect speichert und stellt den kompletten Zustand wieder her:
```bash
# Mit tmux-resurrect:
Ctrl+B Ctrl+S  # Save Session
Ctrl+B Ctrl+R  # Restore Session

# Überlebt: Neustart, Logout, etc.
```

### 6. **Naming Convention**
Eine konsistente Benennung hilft dir, auch bei vielen Sessions den Ueberblick zu behalten:
```bash
# Sessions: Projekt-Name
tmux new -s myapp-backend

# Windows: Task-Type
Ctrl+B , → "editor"
Ctrl+B , → "server"
Ctrl+B , → "tests"
```

### 7. **Claude Code Integration**
Das optimale Claude Code Setup verteilt alle Werkzeuge auf separate Windows -- so hast du Claude, Tests, Server und Logs gleichzeitig im Blick:
```bash
# Window 1: Claude Code
claude-code

# Window 2: File-Watcher (entr)
echo src/**/*.js | entr npm test

# Window 3: Dev-Server
npm start

# Window 4: Logs
tail -f logs/app.log

# Instant Context-Switching mit Ctrl+B 0-3
```

---

## 📝 Beispiele - Real-World Use-Cases

### Beispiel 1: Full-Stack Development Setup

**Szenario**: Next.js App mit Backend API.

```bash
# Script: dev-fullstack.sh
#!/bin/bash
SESSION="fullstack"

tmux new-session -d -s $SESSION -n main

# Window 1: Frontend
tmux send-keys -t $SESSION:main "cd ~/projekt/frontend && npm run dev" C-m

# Window 2: Backend
tmux new-window -t $SESSION -n backend
tmux send-keys -t $SESSION:backend "cd ~/projekt/backend && npm start" C-m

# Window 3: Database
tmux new-window -t $SESSION -n db
tmux send-keys -t $SESSION:db "docker-compose up postgres" C-m

# Window 4: Editor (Split)
tmux new-window -t $SESSION -n editor
tmux send-keys -t $SESSION:editor "cd ~/projekt && vim" C-m
tmux split-window -h -t $SESSION:editor
tmux send-keys -t $SESSION:editor.right "cd ~/projekt && git status" C-m

# Attach
tmux attach -t $SESSION
```

**Ergebnis**:
- 1 Command → komplettes Dev-Environment
- Instant Switch zwischen Frontend/Backend/DB
- Alles persistent (detach/attach)

---

### Beispiel 2: Remote-Server-Monitoring

**Szenario**: Production-Server, du willst Logs + Metrics monitoren.

```bash
# Auf Remote-Server
ssh prod-server
tmux new -s monitor

# Split in 4 Panes
Ctrl+B %  # Vertical Split
Ctrl+B "  # Horizontal Split (links)
# Select right pane
Ctrl+B →
Ctrl+B "  # Horizontal Split (rechts)

# Pane 1 (Top-Left): Application Logs
tail -f /var/log/app.log

# Pane 2 (Bottom-Left): Error Logs
tail -f /var/log/error.log

# Pane 3 (Top-Right): System Metrics
htop

# Pane 4 (Bottom-Right): Network
watch -n 1 'ss -tuln | grep LISTEN'

# Detach (Session läuft weiter)
Ctrl+B D

# ... später / anderen Computer ...
ssh prod-server
tmux attach -t monitor  # Alles noch da!
```

**Zeit gespart**: Kein Re-Setup nach Disconnect

---

### Beispiel 3: Pair Programming Session

**Szenario**: Du und Kollege arbeiten remote zusammen.

```bash
# Setup (Person A - Host)
ssh shared-server
tmux -S /tmp/pair new -s pair
chmod 777 /tmp/pair  # Socket permissions

# Join (Person B - Guest)
ssh shared-server
tmux -S /tmp/pair attach -t pair

# Beide sehen den GLEICHEN Screen!
# Commands von A werden live bei B angezeigt
# Perfect für Code-Review, Debugging, Learning
```

**Vorteil**: Echter shared terminal, kein Screen-Sharing nötig

---

### Beispiel 4: Multi-Server-Deployment

**Szenario**: Deploy auf 5 Servern parallel.

```bash
# Session erstellen
tmux new -s deploy

# 5 Panes erstellen (Tiled Layout)
Ctrl+B %    # Split 1
Ctrl+B →    # Select right
Ctrl+B "    # Split 2
# ... repeat ...

# In jedem Pane: SSH zu Server
# Pane 1
ssh server1
# Pane 2
ssh server2
# ... etc ...

# Synchronize Panes aktivieren
Ctrl+B : setw synchronize-panes on

# Jetzt: Commands gehen an ALLE Panes
sudo apt update
sudo apt upgrade -y
systemctl restart app

# Sync OFF
Ctrl+B : setw synchronize-panes off
```

**Produktivität**: 5 Server in gleicher Zeit wie 1

---

### Beispiel 5: Long-Running Job (Data Processing)

**Szenario**: ML-Training läuft 8 Stunden.

```bash
# Session starten
tmux new -s training

# Training starten
python train.py --epochs 1000

# Detach (läuft weiter)
Ctrl+B D

# ... 8 Stunden später ...
tmux attach -t training

# Check: Output von letzten 8 Stunden
Ctrl+B [  # Copy Mode
Ctrl+U    # Scroll up
# ... review ...
q         # Exit
```

**Vorteil**: Kein nohup/screen nötig, volle Kontrolle

---

### Beispiel 6: Context-Switching zwischen Projekten

**Szenario**: Du arbeitest an 3 Projekten parallel.

```bash
# Morning:
tmux new -s client-a
# ... work on client A ...
Ctrl+B D  # Detach

tmux new -s client-b
# ... work on client B ...
Ctrl+B D

tmux new -s internal-tool
# ... work on internal tool ...
Ctrl+B D

# Afternoon: Client A ruft an
tmux attach -t client-a
# → INSTANT: Alles noch offen (Editor, Server, etc.)

# 30 Min später: Zurück zu Client B
Ctrl+B D
tmux attach -t client-b
# → INSTANT: Genau wo du warst
```

**Zeit gespart**: 10 Minuten Setup-Zeit pro Context-Switch

---

## 🤖 Claude Code Integration

### Workflow 1: Persistentes Claude Code Development-Setup
```bash
# Claude Code Session: tmux fuer Multi-Pane Entwicklung
tmux new-session -d -s claude -n code
tmux send-keys -t claude:code "claude" C-m
tmux split-window -h -t claude:code -p 40
tmux send-keys -t claude:code.1 "npm run dev" C-m
tmux split-window -v -t claude:code.1
tmux send-keys -t claude:code.2 "npm test -- --watch" C-m
tmux attach -t claude
```

### Workflow 2: Claude Code mit Live-Log-Monitoring
```bash
# Pane 1: Claude Code laeuft und generiert Code
# Pane 2: Echtzeit-Logs des Servers verfolgen
tmux new-session -d -s dev -n main
tmux send-keys -t dev:main "claude" C-m
tmux split-window -v -t dev:main -p 30
tmux send-keys -t dev:main.1 "tail -f logs/app.log | bat --paging=never -l log" C-m
tmux attach -t dev
```

### Workflow 3: Projekt-Context-Switching mit Claude Code
```bash
# Separate tmux Sessions pro Projekt, jede mit Claude Code
tmux new-session -d -s projekt-a -n claude
tmux send-keys -t projekt-a:claude "cd ~/projekte/projekt-a && claude" C-m
tmux new-session -d -s projekt-b -n claude
tmux send-keys -t projekt-b:claude "cd ~/projekte/projekt-b && claude" C-m
# Schnelles Wechseln: Ctrl+B s -> Session auswaehlen
```

> 💡 **Tipp**: Claude Code kann in tmux-Sessions persistent laufen, sodass du bei Projekt-Wechseln sofort zum vorherigen Kontext zurueckkehren kannst, ohne Claude Code neu starten zu muessen.

---

## 📺 Video-Tutorial

[Learn Linux TV - tmux Tutorial Series](https://www.learnlinux.tv/tag/tmux-tutorial/)
Umfassende Video-Serie, die tmux von den Grundlagen bis zu fortgeschrittenen Techniken erklaert -- ideal fuer Einsteiger, die den Terminal-Multiplexer Schritt fuer Schritt lernen moechten.

---

## 🔧 Troubleshooting

Die haeufigsten Probleme mit tmux betreffen den Prefix-Key, Scrolling und Session-Persistence. Hier findest du Ursachen und Loesungen.

### Problem: "Prefix Ctrl+B nervt (zu weit)"

Die Standard-Tastenkombination Ctrl+B ist ergonomisch ungluecklich, da beide Tasten weit auseinander liegen und bei haeufiger Nutzung die Hand belastet.

**Lösung**: Ändere zu Ctrl+A
```bash
# In ~/.tmux.conf
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# Reload:
tmux source-file ~/.tmux.conf
```

---

### Problem: "Kann nicht scrollen"

tmux faengt die Standard-Scroll-Eingaben ab. Ohne den Copy Mode oder Mouse Support kannst du vorherige Ausgaben nicht einsehen.

**Lösung**: Copy Mode aktivieren
```bash
# Scrollen:
Ctrl+B [  # Dann: Pfeiltasten oder Page Up/Down

# Oder: Mouse Support
# In ~/.tmux.conf:
set -g mouse on
```

---

### Problem: "Sessions verschwinden nach Reboot"

tmux-Sessions leben nur im RAM und ueberleben daher keinen System-Neustart. Das ist beabsichtigt, kann aber mit Plugins geloest werden.

**Lösung**: tmux-resurrect Plugin
```bash
# Installation (siehe Advanced Usage)
# Dann:
Ctrl+B Ctrl+S  # Save vor Shutdown
Ctrl+B Ctrl+R  # Restore nach Reboot
```

---

### Problem: "Colors falsch (kein True Color)"

Wenn tmux den Terminal-Typ nicht korrekt erkennt, werden Farben falsch dargestellt oder auf 16 Farben reduziert.

**Lösung**: Terminal + tmux Config
```bash
# In ~/.tmux.conf
set -g default-terminal "screen-256color"
set -ga terminal-overrides ",xterm-256color:Tc"

# In ~/.bashrc or ~/.zshrc
export TERM=xterm-256color
```

---

### Problem: "Clipboard copy funktioniert nicht (macOS)"

Auf macOS hat tmux keinen Zugriff auf die System-Zwischenablage, da es in einem separaten User-Namespace laeuft.

**Lösung**: reattach-to-user-namespace
```bash
# Installation
brew install reattach-to-user-namespace

# In ~/.tmux.conf
set -g default-command "reattach-to-user-namespace -l $SHELL"
```

---

## 📊 tmux vs. screen vs. zellij - Der Vergleich

| Feature | `screen` | `tmux` | `zellij` |
|---------|----------|--------|----------|
| **Year** | 1987 | 2007 | 2020 |
| **Aktiv maintained** | ⚠️ | ✅ | ✅ |
| **Split Panes** | ⚠️ Limited | ✅ Full | ✅ Full |
| **Config** | ❌ Cryptic | ✅ Klar | ✅ YAML |
| **Plugin System** | ❌ | ✅ TPM | ✅ Built-in |
| **Mouse Support** | ❌ | ✅ | ✅ |
| **Learning Curve** | 🐌 Steil | 🐌 Mittel | 🚀 Flach |
| **Performance** | ✅ | ✅ | ✅ |
| **Community** | ⚠️ Klein | ✅ Groß | ⚠️ Wachsend |

**Fazit**:
- **screen**: Legacy, nur wenn du müssen (alte Server)
- **tmux**: Industry-Standard, mature, best choice
- **zellij**: Modern, user-friendly, für Einsteiger

**Empfehlung**: Lerne tmux - es ist überall verfügbar und Standard.

---

## 🔗 Weiterführende Links

### Offizielle Ressourcen
- **GitHub**: https://github.com/tmux/tmux
- **Wiki**: https://github.com/tmux/tmux/wiki
- **Man Page**: `man tmux`

### Community
- **Reddit**: r/tmux
- **Stack Overflow**: [tmux] Tag

### Tutorials
- [tmux Cheat Sheet](https://tmuxcheatsheet.com/)
- [Thoughtbot tmux Guide](https://thoughtbot.com/blog/a-tmux-crash-course)
- [The Tao of tmux](https://leanpub.com/the-tao-of-tmux/read)

### Plugins
- **TPM**: https://github.com/tmux-plugins/tpm
- **tmux-resurrect**: Persist sessions
- **tmux-continuum**: Auto-save/restore
- **tmux-yank**: Better clipboard
- **tmux-pain-control**: Better keybindings

---

## 💡 Pro-Tipps

### 1. **tmuxinator - Project Manager**
tmuxinator definiert Projekt-Setups als YAML-Dateien -- statt manuell Panes und Windows einzurichten, startest du dein gesamtes Setup mit einem Befehl:
```bash
# Installation
gem install tmuxinator

# Projekt erstellen
tmuxinator new myproject

# Config (yaml):
# name: myproject
# root: ~/projekt
# windows:
#   - editor: vim
#   - server: npm start
#   - tests: npm test

# Starten:
tmuxinator start myproject
```

### 2. **Powerline Status Bar**
Powerline verwandelt die tmux-Statusleiste in eine informative Anzeige mit Git-Branch, Hostname und mehr:
```bash
# Installation
pip install powerline-status

# In ~/.tmux.conf
set -g status-right '#(powerline tmux right)'
```

### 3. **Quick Session Switcher (fzf)**
Kombiniere tmux mit fzf fuer einen interaktiven Session-Switcher, der alle Sessions fuzzy-durchsuchbar macht:
```bash
# In ~/.bashrc or ~/.zshrc
ta() {
  local session=$(tmux ls 2>/dev/null | fzf | cut -d: -f1)
  [[ -n "$session" ]] && tmux attach -t "$session"
}
```

### 4. **Kill All Sessions (Cleanup)**
Dieser Alias beendet alle laufenden tmux-Sessions auf einmal -- nuetzlich zum Aufraeumen nach einem Arbeitstag:
```bash
# Alias
alias tmux-kill-all='tmux ls | cut -d: -f1 | xargs -I {} tmux kill-session -t {}'
```

### 5. **Nested tmux (Outer + Inner Prefix)**
Bei verschachtelten tmux-Sessions (z.B. lokal + remote) brauchst du unterschiedliche Prefix-Keys, damit du beide Sessions getrennt steuern kannst:
```bash
# In ~/.tmux.conf
# Inner tmux: Ctrl+A
# Outer tmux: Ctrl+B
bind -n C-a send-prefix
```

---

## 🎯 Zusammenfassung

**tmux ist dein Terminal-Workflow-Multiplier** - unverzichtbar für ernsthafte Development.

**Quick Wins**:
- ✅ Sessions überleben Disconnects
- ✅ Multi-Projekt Context-Switching in Sekunden
- ✅ Split-Screen für Editor + Server + Tests
- ✅ Scriptable Project-Setups
- ✅ Pair-Programming ohne Screen-Sharing

**Installation**: 10 Minuten
**Learning Curve**: 1-2 Tage
**Produktivität**: +50% (kein Übertreibung)

---

**Nächster Schritt**: Installiere tmux, erstelle Config (~/.tmux.conf), nutze es für 1 Woche - du wirst süchtig! 🖥️

---

**Verwandte Lektionen**:
- [04 - glow](./04-glow.md) - Perfekt für tmux Panes (Docs anzeigen)
- [10 - lazygit](./10-lazygit.md) - Git TUI (läuft perfekt in tmux)
- [25 - htop](./25-htop.md) - Process Monitor (in tmux Pane)

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0
