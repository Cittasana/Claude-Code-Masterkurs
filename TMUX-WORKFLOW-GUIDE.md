# 🚀 TMUX + Claude Code Teams - Workflow Guide

**Zweck**: Maximiere deine Produktivität mit parallelen Claude Code Sessions
**Für**: Entwickler, die mehrere Features gleichzeitig entwickeln wollen

---

## 🎯 Was ist TMUX?

**TMUX** (Terminal Multiplexer) ist ein Tool, das dir erlaubt:
- ✅ Mehrere Terminal-Sessions parallel zu haben
- ✅ Sessions zu "detachen" (laufen weiter im Hintergrund)
- ✅ Zwischen Sessions zu wechseln
- ✅ Split-Screen-Ansichten zu erstellen
- ✅ Sessions zu speichern und später wieder aufzurufen

**Warum TMUX + Claude Code Teams?**
- **Parallele Feature-Entwicklung**: Discord-Integration in Session 1, Video-Produktion in Session 2
- **Kein Context-Loss**: Jede Session behält ihren Kontext
- **Schnelles Switching**: Zwischen Tasks wechseln ohne neu zu starten
- **Background-Arbeit**: Lange Tasks laufen weiter, während du an was anderem arbeitest

---

## 📦 TMUX Installation (falls noch nicht installiert)

```bash
# macOS
brew install tmux

# Ubuntu/Debian
sudo apt-get install tmux

# Check Installation
tmux -V
# → tmux 3.3a
```

---

## 🎓 TMUX Basics (5-Minuten-Crashkurs)

### Sessions erstellen & managen

```bash
# Neue Session starten
tmux new -s projekt-name

# Session mit Namen
tmux new -s claude-discord

# Liste aller Sessions
tmux ls

# Session "detachen" (läuft im Hintergrund weiter)
# Drücke: Ctrl+B, dann D

# Zu Session zurückkehren
tmux attach -t claude-discord

# Session umbenennen
# Drücke: Ctrl+B, dann $

# Session beenden
exit
# ODER: Ctrl+B, dann :kill-session
```

### Windows (Tabs) innerhalb einer Session

```bash
# Neues Window erstellen
# Drücke: Ctrl+B, dann C

# Zwischen Windows wechseln
# Drücke: Ctrl+B, dann N (next)
# Drücke: Ctrl+B, dann P (previous)
# Drücke: Ctrl+B, dann [Nummer] (direkt zu Window X)

# Window umbenennen
# Drücke: Ctrl+B, dann ,

# Window schließen
exit
# ODER: Ctrl+B, dann &
```

### Panes (Split-Screen)

```bash
# Horizontal splitten
# Drücke: Ctrl+B, dann "

# Vertikal splitten
# Drücke: Ctrl+B, dann %

# Zwischen Panes wechseln
# Drücke: Ctrl+B, dann Pfeiltasten

# Pane schließen
exit
# ODER: Ctrl+B, dann X
```

### Cheatsheet - Die wichtigsten Shortcuts

| Aktion | Shortcut |
|--------|----------|
| **Session detachen** | `Ctrl+B` → `D` |
| **Neues Window** | `Ctrl+B` → `C` |
| **Nächstes Window** | `Ctrl+B` → `N` |
| **Horizontal split** | `Ctrl+B` → `"` |
| **Vertikal split** | `Ctrl+B` → `%` |
| **Pane wechseln** | `Ctrl+B` → `Pfeiltasten` |
| **Kommando-Modus** | `Ctrl+B` → `:` |

---

## 🎯 TMUX + Claude Code Teams - Praktische Workflows

### Use-Case 1: Parallele Feature-Entwicklung

**Szenario**: Du willst gleichzeitig Discord-Integration UND Founder-Video-Content entwickeln.

```bash
# Setup: 2 Sessions für 2 Features

# Session 1: Discord-Feature
tmux new -s discord
claude code

# In Claude Code:
# "Lies CLAUDE.md und UMSETZUNGSPLAN-QUICK-WINS.md
#  Implementiere Discord-Community (Feature 1)"

# Session detachen (läuft weiter)
# Drücke: Ctrl+B, dann D

# Session 2: Content-Creation
tmux new -s content
claude code

# In Claude Code:
# "Nutze marketing:content-creation
#  Erstelle Founder-Video-Script aus UMSETZUNGSPLAN"

# Session detachen
# Drücke: Ctrl+B, dann D

# Zwischen Sessions wechseln
tmux attach -t discord   # Zur Discord-Session
tmux attach -t content   # Zur Content-Session
```

**Vorteil**: Beide Claude Code Sessions laufen parallel, kein Context-Switch!

---

### Use-Case 2: Split-Screen für Code + Docs

**Szenario**: Du willst Code in einem Pane, Docs in anderem Pane.

```bash
# Starte Session
tmux new -s dev

# Pane 1 (links): Claude Code
claude code
# → Arbeitet an Discord-Integration

# Horizontal splitten
# Drücke: Ctrl+B, dann "

# Pane 2 (rechts): Docs lesen
cat TECH-SPECS-COMMUNITY.md | less
# ODER: vim UMSETZUNGSPLAN-QUICK-WINS.md

# Zwischen Panes wechseln mit Ctrl+B → Pfeiltasten
```

**Layout**:
```
┌─────────────────────┬─────────────────────┐
│  Claude Code        │  Tech Specs         │
│  (Discord-Bot)      │  (Referenz)         │
│                     │                     │
│  > Erstelle Bot...  │  Discord OAuth...   │
│                     │  Code-Beispiele...  │
└─────────────────────┴─────────────────────┘
```

---

### Use-Case 3: Multi-Window-Setup für Projekt

**Szenario**: Du hast ein Projekt mit mehreren Tasks.

```bash
# Starte Session
tmux new -s claude-masterkurs

# Window 1: Discord-Feature
# (du bist bereits hier)
claude code
# Drücke: Ctrl+B, dann , (umbenennen zu "Discord")

# Window 2: Content-Creation
# Drücke: Ctrl+B, dann C (neues Window)
claude code
# "Nutze marketing:content-creation für Blog-Posts"
# Drücke: Ctrl+B, dann , (umbenennen zu "Content")

# Window 3: Testing
# Drücke: Ctrl+B, dann C
npm run dev
# ODER: pytest
# Drücke: Ctrl+B, dann , (umbenennen zu "Test")

# Zwischen Windows wechseln
# Drücke: Ctrl+B, dann 0 (Discord)
# Drücke: Ctrl+B, dann 1 (Content)
# Drücke: Ctrl+B, dann 2 (Test)
```

**Status-Line** (unten in TMUX):
```
[claude-masterkurs] 0:Discord* 1:Content- 2:Test-
```
*Asterisk (*) = aktives Window*

---

### Use-Case 4: Background-Tasks mit Sessions

**Szenario**: Lange Tasks (z.B. Video-Rendering) sollen im Hintergrund laufen.

```bash
# Session 1: Lange Task
tmux new -s video-render
ffmpeg -i raw-video.mov -c:v libx264 output.mp4
# (läuft 30 Minuten)

# Session detachen
# Drücke: Ctrl+B, dann D

# Session 2: Weiterarbeiten
tmux new -s dev
claude code
# → Du kannst weiterarbeiten, während Video rendert!

# Später: Check ob fertig
tmux attach -t video-render
# → Siehst den Fortschritt
```

---

## 🎨 Empfohlene TMUX-Konfiguration für Claude Code

### ~/.tmux.conf erstellen

```bash
# TMUX Config für optimale Claude Code Experience
# Speichere in: ~/.tmux.conf

# ============================================
# BASIC SETTINGS
# ============================================

# Prefix ändern zu Ctrl+A (ergonomischer als Ctrl+B)
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# Mouse-Support aktivieren (scrollen, Panes resizen)
set -g mouse on

# Schnelleres Command-Delay
set -sg escape-time 1

# History erhöhen (mehr scrollback)
set -g history-limit 50000

# Fenster-Nummerierung bei 1 starten (nicht 0)
set -g base-index 1
setw -g pane-base-index 1

# ============================================
# VISUALS
# ============================================

# 256 Farben aktivieren
set -g default-terminal "screen-256color"

# Status Bar oben statt unten
set-option -g status-position top

# Status Bar Farben
set -g status-bg colour235
set -g status-fg colour136

# Aktives Window hervorheben
setw -g window-status-current-style fg=colour166,bg=colour235,bold

# Pane Border Farben
set -g pane-border-style fg=colour238
set -g pane-active-border-style fg=colour51

# Status Bar Links: Session-Name
set -g status-left '#[fg=colour166,bold] #S '

# Status Bar Rechts: Datum & Uhrzeit
set -g status-right '#[fg=colour233,bg=colour241,bold] %d.%m.%Y #[fg=colour233,bg=colour245,bold] %H:%M:%S '

# Status Bar auto-refresh
set -g status-interval 1

# ============================================
# KEY BINDINGS (Produktivität)
# ============================================

# Panes splitten (intuitiver)
bind | split-window -h -c "#{pane_current_path}"  # Vertikal: Ctrl+A, dann |
bind - split-window -v -c "#{pane_current_path}"  # Horizontal: Ctrl+A, dann -

# Pane-Navigation (Vim-Style)
bind h select-pane -L  # Links
bind j select-pane -D  # Unten
bind k select-pane -U  # Oben
bind l select-pane -R  # Rechts

# Pane-Resize (Vim-Style mit Shift)
bind -r H resize-pane -L 5
bind -r J resize-pane -D 5
bind -r K resize-pane -U 5
bind -r L resize-pane -R 5

# Config neu laden
bind r source-file ~/.tmux.conf \; display "Config reloaded!"

# ============================================
# COPY MODE (für Copy & Paste)
# ============================================

# Vim-style copy mode
setw -g mode-keys vi

# Copy Mode starten: Ctrl+A, dann [
bind [ copy-mode
bind ] paste-buffer

# In Copy Mode: v = start selection, y = yank (kopieren)
bind -T copy-mode-vi v send-keys -X begin-selection
bind -T copy-mode-vi y send-keys -X copy-selection-and-cancel

# ============================================
# PLUGINS (optional, für Power-User)
# ============================================

# TPM (TMUX Plugin Manager) - installiere mit:
# git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# List of plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-resurrect'  # Sessions speichern
set -g @plugin 'tmux-plugins/tmux-continuum'  # Auto-save Sessions

# Resurrect: Sessions überleben Neustarts
set -g @resurrect-strategy-vim 'session'
set -g @resurrect-capture-pane-contents 'on'

# Continuum: Auto-save alle 15 Min
set -g @continuum-restore 'on'
set -g @continuum-save-interval '15'

# Plugin Manager initialisieren (muss am Ende sein!)
run '~/.tmux/plugins/tpm/tpm'
```

### Config aktivieren

```bash
# Config laden
tmux source-file

# ODER: In laufender TMUX-Session
# Drücke: Ctrl+A (oder Ctrl+B), dann :
# Tippe: source-file ~/.tmux.conf
# Enter
```

---

## 🚀 Power-Workflows für Claude Code Masterkurs

### Workflow 1: "Quick Wins Sprint" (Alle 3 Features parallel)

```bash
# Setup: 3 Sessions für 3 Quick Wins
tmux new -s sprint

# Window 1: Discord
claude code
# Prompt: "Lies CLAUDE.md. Implementiere Discord-Community (UMSETZUNGSPLAN Feature 1)"
# Drücke: Ctrl+A, dann , → Rename zu "Discord"

# Window 2: Founder-Story
# Drücke: Ctrl+A, dann C
claude code
# Prompt: "Nutze marketing:content-creation. Erstelle Founder-Video-Script"
# Drücke: Ctrl+A, dann , → Rename zu "Story"

# Window 3: Free Tier
# Drücke: Ctrl+A, dann C
claude code
# Prompt: "Implementiere Free Tier (UMSETZUNGSPLAN Feature 3)"
# Drücke: Ctrl+A, dann , → Rename zu "FreeTier"

# Window 4: Testing
# Drücke: Ctrl+A, dann C
# Hier testest du die implementierten Features
npm run dev

# Zwischen Windows springen:
# Ctrl+A → 0,1,2,3
```

**Ergebnis**: Alle 3 Quick Wins in parallel entwickelt! 🔥

---

### Workflow 2: "Content-Creation-Maschine"

```bash
# Setup: 1 Session, 4 Windows für verschiedene Content-Typen
tmux new -s content-machine

# Window 1: Blog-Posts
claude code
# "Nutze marketing:content-creation: 5 Blog-Posts für SEO"

# Window 2: Social Media
# Ctrl+A → C
claude code
# "Nutze masterkurs:social-media-pack: 30 Tage LinkedIn-Content"

# Window 3: Email-Kampagnen
# Ctrl+A → C
claude code
# "Nutze masterkurs:email-sequence: Onboarding für Free Users"

# Window 4: Video-Scripts
# Ctrl+A → C
claude code
# "Erstelle 10 YouTube-Tutorial-Scripts"

# Split-Screen für Review
# Im Window 1: Ctrl+A → %
# Links: Claude generiert Content
# Rechts: Du reviewst & editierst
```

---

### Workflow 3: "Development + Documentation"

```bash
# Setup: Side-by-Side Development
tmux new -s dev-docs

# Vertikal splitten
# Drücke: Ctrl+A, dann |

# Linker Pane: Claude Code (Implementation)
claude code
# "Implementiere Discord OAuth Flow (TECH-SPECS-COMMUNITY.md)"

# Rechter Pane: Docs lesen (Referenz)
# Drücke: Ctrl+A → Rechts-Pfeil
less TECH-SPECS-COMMUNITY.md

# ODER: Live-Preview bei HTML/CSS
python -m http.server 8000
# Öffne localhost:8000 im Browser
```

---

### Workflow 4: "Testing & Debugging"

```bash
# Setup: 3-Pane-Layout
tmux new -s debug

# Horizontal split (oben/unten)
# Drücke: Ctrl+A, dann -

# Oberer Pane vertikal splitten
# Drücke: Ctrl+A → |

# Layout:
# ┌──────────────┬──────────────┐
# │  Code        │  Logs        │
# ├──────────────┴──────────────┤
# │  Tests                      │
# └─────────────────────────────┘

# Pane 1 (oben links): Claude Code
claude code
# "Fixe Discord-Bot-Bug"

# Pane 2 (oben rechts): Logs
tail -f logs/discord-bot.log

# Pane 3 (unten): Tests
npm test --watch
```

---

## 💡 Pro-Tipps für TMUX + Claude Code

### 1. Session-Templates erstellen

**Erstelle Script für schnelles Setup**:

```bash
#!/bin/bash
# ~/scripts/tmux-claude-sprint.sh

# Session erstellen
tmux new-session -d -s sprint

# Window 1: Discord
tmux rename-window 'Discord'
tmux send-keys 'cd ~/projects/claude-masterkurs' C-m
tmux send-keys 'claude code' C-m

# Window 2: Content
tmux new-window -t sprint -n 'Content'
tmux send-keys 'cd ~/projects/claude-masterkurs' C-m
tmux send-keys 'claude code' C-m

# Window 3: Free Tier
tmux new-window -t sprint -n 'FreeTier'
tmux send-keys 'cd ~/projects/claude-masterkurs' C-m
tmux send-keys 'claude code' C-m

# Attach
tmux attach -t sprint
```

**Nutzen**:
```bash
# Einmal Setup
chmod +x ~/scripts/tmux-claude-sprint.sh

# Danach: 1 Command = komplettes Setup!
~/scripts/tmux-claude-sprint.sh
```

---

### 2. Session-Namen organisieren

**Namenskonvention**:
- `proj-feature` → z.B. `claude-discord`, `claude-video`
- `task-type` → z.B. `dev`, `content`, `debug`, `test`
- `sprint-date` → z.B. `sprint-0211`, `sprint-w07`

```bash
# Sessions auflisten mit Kontext
tmux ls
# → claude-discord: 2 windows (created Mon Feb 11 10:30:00 2026)
# → claude-content: 4 windows (created Mon Feb 11 11:15:00 2026)
# → sprint-0211: 3 windows (created Mon Feb 11 09:00:00 2026)
```

---

### 3. Session speichern & wiederherstellen (mit Resurrect)

```bash
# Installation (falls noch nicht in .tmux.conf)
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# In .tmux.conf:
# set -g @plugin 'tmux-plugins/tmux-resurrect'

# Session manuell speichern
# Drücke: Ctrl+A → Ctrl+S

# Session wiederherstellen (nach Neustart)
# Drücke: Ctrl+A → Ctrl+R
```

**Use-Case**: Computer-Neustart → alle TMUX-Sessions + Claude Code Contexts sind wieder da!

---

### 4. Schnelle Navigation (Fuzzy-Finder)

```bash
# Installation
brew install fzf

# In .bashrc oder .zshrc:
alias ts='tmux attach -t $(tmux ls | fzf | cut -d: -f1)'

# Nutzen:
ts
# → Fuzzy-Search für Sessions
# → Wähle mit Pfeiltasten + Enter
```

---

## 📊 Beispiel-Projekt-Setup: Claude Code Masterkurs

### Tag 1: Quick Wins Sprint

```bash
# Morgens, 9:00 Uhr
tmux new -s day1-sprint

# Window 0: Discord (Priorität 1)
claude code
# Prompt: "Lies CLAUDE.md und TECH-SPECS. Implementiere Discord-Integration"
# Ctrl+A → , → "Discord"

# Window 1: Free Tier (Priorität 2)
# Ctrl+A → C
claude code
# Prompt: "Implementiere Free Tier (UMSETZUNGSPLAN Feature 3)"
# Ctrl+A → , → "FreeTier"

# Window 2: Content (parallel)
# Ctrl+A → C
claude code
# Prompt: "Nutze marketing:content-creation: Blog-Post für Launch"
# Ctrl+A → , → "Content"

# Window 3: Testing
# Ctrl+A → C
npm run dev
# → Server läuft, du kannst testen

# Detach für Mittagspause
# Ctrl+A → D

# Nach Pause: Zurück zur Arbeit
tmux attach -t day1-sprint
```

### Tag 2: Content-Creation-Tag

```bash
# Neue Session für Content
tmux new -s day2-content

# 4 Windows für 4 Content-Typen (siehe Workflow 2)
# → Am Ende des Tages: 50+ Content-Pieces erstellt!
```

### Tag 3: Testing & Polish

```bash
# Debugging-Session
tmux new -s day3-debug

# 3-Pane-Layout (siehe Workflow 4)
# → Code, Logs, Tests parallel
```

---

## 🎯 Cheatsheet: TMUX + Claude Code Kombos

| Task | Command |
|------|---------|
| **Neues Feature starten** | `tmux new -s feature-name` → `claude code` |
| **Parallel arbeiten** | `Ctrl+A → C` (neues Window) |
| **Pause machen** | `Ctrl+A → D` (detach, läuft weiter) |
| **Zurückkommen** | `tmux attach -t feature-name` |
| **Quick Switch** | `tmux attach -t $(tmux ls \| fzf \| cut -d: -f1)` |
| **Split für Docs** | `Ctrl+A → \|` oder `Ctrl+A → -` |
| **Session speichern** | `Ctrl+A → Ctrl+S` (mit Resurrect) |
| **Alle Sessions zeigen** | `tmux ls` |
| **Session killen** | `tmux kill-session -t name` |

---

## 🚀 Quick Start: Dein erstes TMUX-Setup (5 Min)

```bash
# 1. Starte TMUX
tmux new -s mein-erstes-projekt

# 2. Starte Claude Code
claude code

# 3. Gib einen Prompt
# "Lies CLAUDE.md und erkläre mir die Quick Wins"

# 4. Neues Window für zweiten Task
# Drücke: Ctrl+B, dann C

# 5. Starte zweite Claude Code Instanz
claude code

# 6. Zweiter Prompt
# "Nutze marketing:content-creation: Erstelle Blog-Post"

# 7. Zwischen Windows wechseln
# Drücke: Ctrl+B, dann 0 (zurück zu Window 1)
# Drücke: Ctrl+B, dann 1 (zu Window 2)

# 8. Session detachen (Hintergrund)
# Drücke: Ctrl+B, dann D

# 9. Später: Session zurückholen
tmux attach -t mein-erstes-projekt

# 10. Session beenden (wenn fertig)
exit
```

**Glückwunsch! Du nutzt jetzt TMUX + Claude Code! 🎉**

---

## 📚 Weitere Ressourcen

- **TMUX Cheatsheet**: https://tmuxcheatsheet.com/
- **Video-Tutorial**: https://www.youtube.com/watch?v=Yl7NFenTgIo
- **TMUX Book**: "tmux 2: Productive Mouse-Free Development"

---

**Letzte Aktualisierung**: 11. Februar 2026
**Nächstes Topic**: Wie du mit Claude Code Plugins arbeitest
