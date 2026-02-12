# 15. tig - Terminal Git Browser

## Berechtigung

**tig** ist ein ncurses-basierter Text-Interface Git-Browser, der eine elegante Alternative zur Kommandozeile für Git-Exploration bietet. Es kombiniert die Effizienz von Terminal-Workflows mit der Übersichtlichkeit einer GUI.

### Warum tig seine Berechtigung hat:

1. **Visual Git-Historie**: Übersichtliche Darstellung von Commits, Branches, Tags
2. **Interaktiv**: Navigation mit Vim-like Keybindings
3. **Schnell**: Instant Startup, keine GUI-Overhead
4. **Feature-Rich**: Blame-View, Diff-View, Stage-View, Reflog
5. **SSH-Friendly**: Funktioniert über Remote-Connections
6. **Scriptable**: Integration in Workflows möglich

### Statistiken:
- **Popularität**: 12k+ GitHub Stars
- **Alter**: Seit 2006 aktiv entwickelt
- **Maintenance**: Aktive Community, regelmäßige Updates

---

> 🚀 **Claude Code Relevanz**: tig gibt dir den visuellen Ueberblick ueber deine Git-Historie, bevor du Claude Code fuer Refactoring oder Code-Analyse einsetzt -- so erkennst du Patterns, Blame-Informationen und Commit-Zusammenhaenge auf einen Blick.

## Zwecke

tig ist primaer ein Betrachtungs-Tool -- es glaenzt beim Inspizieren von Git-Historie, Blame-Informationen und Branch-Strukturen, waehrend interaktive Operationen eher lazygit vorbehalten sind.

### Haupteinsatzgebiete:

1. **Git-Historie Browse**
   - Commit-History visualisieren
   - Branch-Struktur verstehen
   - Tag-Übersicht
   - Merge-Visualisierung

2. **Code-Review**
   - Diff-Ansicht für Commits
   - Blame-Analyse
   - File-History tracken
   - Reflog durchsuchen

3. **Interaktive Git-Ops**
   - Commits stagen/unstagen
   - Cherry-Pick interaktiv
   - Branch-Checkout
   - Ref-Navigation

4. **Debugging**
   - Wann wurde Bug introduced?
   - Wer hat Code geschrieben?
   - Change-Tracking
   - Bisect-Support

5. **Learning**
   - Git-Konzepte visualisieren
   - Branch-Strategien verstehen
   - Merge vs. Rebase sehen
   - Reflog-Operationen

---

## Verwendung

Von der Installation ueber die ersten Schritte bis zu Custom-Konfigurationen und fortgeschrittenen Workflows.

### Installation

tig ist in allen gaengigen Paketmanagern verfuegbar oder kann aus dem Quellcode kompiliert werden:

#### macOS (Homebrew)
Die schnellste Installation auf macOS:
```bash
brew install tig
```

#### Ubuntu/Debian
```bash
apt-get install tig
```

#### Arch Linux
```bash
pacman -S tig
```

#### From Source
```bash
git clone https://github.com/jonas/tig.git
cd tig
make
sudo make install
```

> 💡 **Tipp**: Erstelle direkt nach der Installation eine `~/.tigrc` mit Vim-like Keybindings (g/G fuer Anfang/Ende) -- das macht die Navigation deutlich intuitiver.

### Verifizierung
```bash
tig --version
# Output: tig version 2.5.8

which tig
# Output: /usr/local/bin/tig
```

---

### Quick Start

Die Grundbefehle oeffnen verschiedene Ansichten -- vom Commit-Log ueber Blame bis zum Stash.

#### Basis-Usage
tig kann mit verschiedenen Argumenten gestartet werden, um direkt die gewuenschte Ansicht zu oeffnen:
```bash
# Öffne tig im aktuellen Repo
tig

# Specific File-History
tig src/app.js

# Blame-View für File
tig blame src/app.js

# Commit-Details anzeigen
tig show HEAD

# Stash-View
tig stash
```

Die Navigation in tig orientiert sich an Vim. Diese Keybindings funktionieren in allen Views:

#### Navigation (Standard-Keybindings)
```
q         - Quit/Close View
h         - Help anzeigen
k/j       - Auf/Ab navigieren
Enter     - Details öffnen
<         - Previous View
Tab       - Next View
R         - Refresh
/         - Search
n/N       - Next/Previous Search-Result
```

tig bietet verschiedene Views fuer unterschiedliche Git-Informationen. Jeder View wird durch einen eigenen Befehl gestartet:

#### Views
```bash
# Main View (Commit-Log)
tig

# Refs View (Branches/Tags)
tig refs

# Status View (git status)
tig status

# Grep View (git grep)
tig grep <pattern>

# Blame View
tig blame <file>

# Tree View (git ls-tree)
tig tree
```

---

### Advanced Usage

Erweiterte Konfiguration mit Custom Keybindings, Filtern und interaktiven Git-Operationen direkt aus tig heraus.

#### Custom Commands
In der `~/.tigrc` definierst du eigene Keybindings und Befehle, die tig deutlich maechtige machen:
```bash
# ~/.tigrc Configuration

# Keybindings
bind generic g move-first-line      # g = go to top
bind generic G move-last-line       # G = go to bottom
bind generic <Ctrl-f> scroll-page-down
bind generic <Ctrl-b> scroll-page-up

# Custom Commands
bind main C !git cherry-pick %(commit)
bind status P !git push origin %(repo:head)

# Colors
color cursor black green bold
color title-focus black blue bold
```

#### Filtering & Searching
Filtere die Commit-Historie nach Autor, Datum, Pfad oder Commit-Message -- so findest du schnell den gesuchten Commit:
```bash
# Log mit Path-Filter
tig -- src/

# Nur Commits von Author
tig --author="John Doe"

# Seit bestimmtem Datum
tig --since="2 weeks ago"

# Grep in Commit-Messages
tig --grep="fix"

# Kombiniert
tig --author="Jane" --since="1 month" -- src/
```

> 🚀 **Beispiel**: Mit `tig blame src/app.js` siehst du sofort, wer welche Zeile wann geschrieben hat. Durch Enter auf einer Zeile springst du direkt zum zugehoerigen Commit -- perfekt fuer Bug-Hunting.

Diese Operationen fuehrst du direkt innerhalb von tig aus, ohne in die Kommandozeile wechseln zu muessen:

#### Interactive Operations
```
# In Status-View
u         - Stage/Unstage File
!         - Run Git Command
C         - Commit (öffnet Editor)
M         - Amend Last Commit
R         - Revert Changes

# In Main-View (Log)
C         - Cherry-Pick Commit
H         - Create Branch at Commit
T         - Create Tag at Commit

# In Refs-View
C         - Checkout Branch/Tag
D         - Delete Branch
```

#### Split-Screen Usage
```
# In Main-View
d         - Toggle Diff-View
b         - Toggle Blame-View
f         - Toggle File-View
t         - Toggle Tree-View

# Result: Split-Screen mit Log + Diff
```

---

### Integration in Claude Code Workflows

#### 1. Code-Review mit AI-Assistance
```bash
# Browse Commits, kopiere Commit-Hash
tig

# Dann mit Claude analysieren
git show <commit-hash> | \
  claude "Review this commit for potential issues"

# Oder direkt aus tig heraus:
# Bind custom command in ~/.tigrc
bind main A !git show %(commit) | claude "Analyze commit"
```

#### 2. Blame-Analysis für Bug-Tracking
```bash
# Öffne tig blame
tig blame src/buggy-file.js

# Identifiziere problematische Zeilen und Commits
# Kopiere Commit-Hash, dann:
git show <hash> | \
  claude "Explain what this commit was trying to achieve"
```

#### 3. Refactoring-History
```bash
# File-History anzeigen
tig src/component.tsx

# Mit Claude analysieren
git log --follow -p -- src/component.tsx | \
  head -500 | \
  claude "Summarize evolution of this component"
```

#### 4. Pre-Merge Review
```bash
# Feature-Branch in tig
tig feature/new-api

# Commits zwischen main und feature
tig main..feature/new-api

# Kompletten Diff
git diff main...feature/new-api | \
  claude "Review feature branch changes"
```

---

## Best Practices

Empfohlene Konfigurationen und Workflows fuer den produktiven Einsatz von tig.

### 1. Essenzielle ~/.tigrc Config

Diese Konfiguration verbessert die Darstellung, fuegt Vim-aehnliche Navigation hinzu und definiert Quick-Actions fuer haeufige Operationen:

```bash
# ~/.tigrc

# ===== Display =====
set main-view = id date author commit-title:graph=yes,refs=yes
set line-graphics = utf-8
set tab-size = 4
set ignore-case = true
set refresh-mode = auto

# ===== Keybindings =====
# Vim-like Navigation
bind generic g move-first-line
bind generic G move-last-line
bind generic <Ctrl-u> scroll-half-page-up
bind generic <Ctrl-d> scroll-half-page-down

# Quick Actions
bind main C !git cherry-pick %(commit)
bind main ! !git revert %(commit)
bind status A !git add -A
bind status R !git reset HEAD %(file)

# ===== Colors =====
color cursor black green bold
color title-focus black blue
color diff-add green default
color diff-del red default
```

### 2. Aliase für häufige Tasks

Kurze Aliase fuer die verschiedenen tig-Views sparen Tipparbeit im Alltag:

```bash
# ~/.bashrc oder ~/.zshrc
alias tigs='tig status'
alias tigr='tig refs'
alias tigg='tig grep'
alias tigb='tig blame'
alias tigt='tig stash'
```

> ⚠️ **Warnung**: tig ist primaer ein Browser/Viewer -- fuer interaktive Git-Operationen wie Rebase oder komplexes Staging ist lazygit besser geeignet. Nutze tig zum Inspizieren und lazygit zum Ausfuehren.

### 3. Integration mit lazygit

Der beste Workflow: tig zum Inspizieren der Historie, lazygit zum Ausfuehren von Aktionen:

```bash
# Nutze tig für History-Browse, lazygit für Ops
alias t='tig'
alias lg='lazygit'

# Als Workflow:
# 1. tig: Commits inspizieren
# 2. lazygit: Interaktive Ops (rebase, etc.)
```

### 4. Custom Views erstellen

```bash
# ~/.tigrc

# View: Recent Changes (last 50 commits)
bind generic R !sh -c "tig --max-count=50"

# View: My Commits
bind generic M !sh -c "tig --author=$(git config user.name)"

# View: Today's Work
bind generic T !sh -c "tig --since=today"
```

### 5. Performance für große Repos

```bash
# Limit Commit-Count
tig --max-count=500

# Disable Graph für Speed
set main-view = id date author commit-title:graph=no

# Shallow Clone für Testing
git clone --depth 100 <repo>
tig
```

---

## Beispiele

### 1. Feature-Branch Review

```bash
# Check out Feature Branch
git checkout feature/new-auth

# Öffne tig
tig

# Navigation:
# - j/k zum Navigieren durch Commits
# - Enter auf Commit → Diff-View
# - Tab → Cycle durch Views
# - d → Toggle Diff unten

# Workflow:
# 1. Scrolle durch alle Commits
# 2. Enter auf verdächtigen Commit
# 3. Prüfe Diff im Detail
# 4. b für Blame falls unklar
# 5. q zurück zu Main-View
```

### 2. Bug-Hunt mit Blame

```bash
# File mit Bug öffnen
tig blame src/auth/login.js

# Navigation durch Zeilen
# - j/k um Zeilen zu durchsuchen
# - Zeile mit Bug identifizieren
# - Enter auf Zeile → Commit-Details
# - Prüfe Message: "Why was this changed?"

# Wenn Commit unklar:
# - Kopiere Commit-Hash (markieren & Ctrl+Shift+C)
# - Exit tig (q)
# - git show <hash> | claude "Explain this commit"
```

### 3. Merge-Conflict Resolution History

```bash
# Alle Merges anzeigen
tig --merges

# Oder mit grep
tig --grep="Merge"

# Workflow:
# 1. Identifiziere problematischen Merge
# 2. Enter → Details
# 3. Prüfe Parents (shows "Merge: abc def")
# 4. Exit mit q
# 5. git show <merge-hash> --stat
```

### 4. Reflog-Browse nach Force-Push

```bash
# Reflog öffnen
tig reflog

# oder
tig -g

# Navigation:
# - Scrolle durch reflog-Einträge
# - Identifiziere "old" State vor force-push
# - Enter → Details
# - Kopiere Commit-Hash

# Recovery:
git reset --hard <hash>
# oder
git cherry-pick <hash>
```

### 5. Stash-Management

```bash
# Öffne Stash-View
tig stash

# Navigation:
# - Liste aller Stashes
# - Enter → Stash-Details & Diff
# - ! → Run command

# Custom Command in tig:
# Enter → dann in Command-Zeile:
!git stash apply stash@{0}

# Oder bind in ~/.tigrc:
bind stash A !git stash apply %(stash)
bind stash P !git stash pop %(stash)
bind stash D !git stash drop %(stash)
```

> 💡 **Tipp**: Nutze `tig --author=$(git config user.name) --since=yesterday` als schnellen Standup-Report -- du siehst sofort alle deine Commits seit gestern in einer uebersichtlichen Darstellung.

### 6. Cross-Branch Comparison

```bash
# Vergleiche zwei Branches
tig main..feature

# Zeigt nur Commits in feature, nicht in main

# Reverse
tig feature..main

# Oder Combined (beidseitige Diff)
tig main...feature

# Workflow:
# - Enter auf Commits
# - Prüfe was unterschiedlich ist
# - Identifiziere Conflicts
```

### 7. Git Grep mit tig

```bash
# Suche nach Pattern im gesamten Repo
tig grep "API_KEY"

# Mit Context
tig grep -C 3 "TODO"

# Case-insensitive
tig grep -i "password"

# Workflow:
# - Liste aller Matches
# - Enter → File an Position
# - / → Search weiter im File
```

### 8. Tag & Release Management

```bash
# Alle Tags anzeigen
tig refs

# Oder
tig show-ref --tags

# Navigiere zu Tag:
# - j/k durch Liste
# - Enter → Tag-Details & Commit
# - t → Create Tag at Commit

# Workflow für Release-Notes:
# 1. tig v1.0.0..v2.0.0
# 2. Scrolle durch alle Changes
# 3. Kopiere relevante Commits
# 4. Generiere Notes mit Claude
```

### 9. Author-Contribution Analysis

```bash
# Alle Commits von Author
tig --author="Jane Doe"

# Combined mit Time-Range
tig --author="Jane" --since="1 month ago"

# Count Commits (außerhalb tig)
git log --author="Jane" --since="1 month" --oneline | wc -l

# Mit tig für Details:
tig --author="Jane" --since="1 month" --stat
```

### 10. Interactive Rebase Planning

```bash
# Letzte 10 Commits anzeigen
tig HEAD~10..HEAD

# Workflow:
# 1. Identifiziere Commits für Squash
# 2. Notiere Hashes
# 3. Exit tig
# 4. git rebase -i HEAD~10
# 5. Squash die identifizierten Commits

# Oder mit lazygit:
# tig → Identifiziere
# lazygit → Rebase durchführen
```

---

## 🤖 Claude Code Integration

### Workflow 1: Claude Code Commits reviewen
```bash
# Alle Commits mit Claude Co-Author anzeigen
tig --grep="Co-Authored-By: Claude"
```

### Workflow 2: Branch-Vergleich vor Merge
```bash
tig main..feature-branch
```

### Workflow 3: File-History nach Claude Code Aenderungen
```bash
tig -- src/components/Header.tsx
```

> 💡 **Tipp**: Nutze tig um die von Claude Code erstellten Commits visuell zu reviewen bevor du sie pushst.

---

## Troubleshooting

Die meisten tig-Probleme betreffen fehlende Git-Repos, Darstellungsprobleme oder Performance bei grossen Historien.

### Problem: tig startet nicht

tig benoetigt ein Git-Repository im aktuellen oder einem uebergeordneten Verzeichnis. Ohne Git-Repo verweigert es den Start.

**Symptom**: Fehlermeldung beim Start
```bash
tig
# Error: Not a git repository
```

**Lösung**: In Git-Repo navigieren
```bash
# Check ob Git-Repo
git status

# Oder init
git init

# Oder in Repo navigieren
cd /path/to/repo
tig
```

---

### Problem: Keybindings funktionieren nicht

Die Standard-Keybindings von tig sind nicht Vim-aehnlich. g/G zum Springen an Anfang/Ende muss erst in der ~/.tigrc konfiguriert werden.

**Symptom**: Vim-Keys (g, G) funktionieren nicht
```bash
# In tig: g drücken → nichts passiert
```

**Lösung**: ~/.tigrc konfigurieren
```bash
# ~/.tigrc erstellen
cat > ~/.tigrc << 'EOF'
bind generic g move-first-line
bind generic G move-last-line
EOF

# tig neustarten
```

---

### Problem: Zu viele Commits (Performance)

Bei Repositories mit Hunderttausenden Commits muss tig die gesamte Historie laden, was entsprechend lange dauert.

**Symptom**: tig lädt ewig bei riesigem Repo
```bash
tig  # Dauert >10 Sekunden
```

**Lösung**: Limit setzen
```bash
# Max Commits limitieren
tig --max-count=200

# Oder in ~/.tigrc
set main-view-commit-limit = 200

# Shallow Clone verwenden
git clone --depth 500 <repo>
```

---

### Problem: UTF-8 Encoding Issues

Falsche Locale-Einstellungen fuehren dazu, dass Umlaute und Sonderzeichen als Fragezeichen oder Kauderwelsch angezeigt werden.

**Symptom**: Weird characters in tig
```bash
tig  # Zeigt � statt Umlaute
```

**Lösung**: Locale korrekt setzen
```bash
# Check Locale
locale

# In ~/.bashrc
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# In ~/.tigrc
set line-graphics = utf-8
```

---

### Problem: Colors sehen falsch aus

Das Standard-Farbschema von tig kann je nach Terminal-Hintergrund schlecht lesbar sein, z.B. dunkler Text auf dunklem Hintergrund.

**Symptom**: Unlesbare Farben im Terminal
```bash
tig  # Schwarzer Text auf schwarzem Hintergrund
```

**Lösung**: Color-Scheme anpassen
```bash
# ~/.tigrc
color cursor black green bold
color title-focus white blue bold
color diff-add green default
color diff-del red default
color author yellow default bold

# Oder Terminal-Colors prüfen
echo $TERM
# Sollte: xterm-256color oder screen-256color
```

---

### Problem: Remote-Branches nicht sichtbar

tig zeigt nur die lokal bekannten Referenzen. Ohne vorheriges `git fetch` fehlen neue Remote-Branches.

**Symptom**: Nur lokale Branches in tig refs
```bash
tig refs  # Fehlen origin/* Branches
```

**Lösung**: Fetch und View-Config
```bash
# Remote-Branches fetchen
git fetch --all

# In ~/.tigrc - Remote Refs anzeigen
set main-view = date author commit-title:graph=yes,refs=yes

# Oder in refs-View
# Drücke R für Refresh
```

---

## Vergleich: tig vs. Alternativen

| Feature | tig | lazygit | gitk | GitKraken |
|---------|-----|---------|------|-----------|
| **Interface** | ncurses | ncurses | Tk GUI | Electron GUI |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **SSH-Friendly** | ✅ | ✅ | ❌ | ❌ |
| **Interactive Ops** | ⚠️ Limited | ✅ Full | ❌ | ✅ Full |
| **History-Browse** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Blame-View** | ✅ | ✅ | ✅ | ✅ |
| **Diff-View** | ✅ | ✅ Delta | ⚠️ Basic | ✅ |
| **Resource-Usage** | Minimal | Low | Medium | High |
| **Learning Curve** | Medium | Low | Low | Very Low |
| **Customizable** | ✅ tigrc | ⚠️ Limited | ❌ | ⚠️ |

### Wann welches Tool?

**tig**:
- Git-Historie browsen
- Code-Review & Blame
- Remote-SSH Sessions
- Scriptable Workflows
- Wenn GUI nicht möglich

**lazygit**:
- Interaktive Git-Ops (Stage, Commit, Rebase)
- Modern TUI mit vielen Features
- Wenn primär Ops, nicht Browse

**gitk**:
- Wenn Tk-GUI verfügbar
- Simple Visualisierung
- Legacy-Systeme

**GitKraken**:
- Für Git-Anfänger
- Wenn volle GUI benötigt
- Team-Collaboration-Features
- Commercial Use-Cases

---

## Links & Ressourcen

### Offizielle Dokumentation
- **GitHub Repository**: https://github.com/jonas/tig
- **Manual**: `man tig` oder https://jonas.github.io/tig/doc/manual.html
- **tigrc Man Page**: `man tigrc`

### Tutorials & Guides
- **tig Tutorial**: https://www.atlassian.com/git/tutorials/git-log
- **Advanced tig**: https://devhints.io/tig
- **Video Tutorial**: https://www.youtube.com/results?search_query=tig+git

### Configuration Examples
- **tigrc Examples**: https://github.com/jonas/tig/wiki/Bindings
- **Color Schemes**: https://github.com/jonas/tig/wiki/Color-schemes

### Integration
- **Vim Integration**: https://github.com/iberianpig/tig-explorer.vim
- **tmux Integration**: Use with splits for multi-view workflows

---

## Pro-Tipps

### 1. Nutze tig als git-log Replacement

```bash
# In ~/.bashrc
alias gl='tig'
alias gla='tig --all'
alias gls='tig status'
alias glr='tig refs'

# Oder als Git-Alias
git config --global alias.t '!tig'
# Usage: git t
```

### 2. Custom View für Daily-Standup

```bash
# ~/.tigrc
bind generic S !sh -c "tig --author=$(git config user.name) --since=yesterday"

# In tig: Drücke Shift+S
# → Zeigt alle eigenen Commits seit gestern
```

### 3. Kombiniere mit tmux für Power-Workflow

```bash
# Setup tmux-Split
tmux split-window -h

# Links: tig
# Rechts: Editor

# Workflow:
# 1. tig: Browse & identifiziere File
# 2. Copy filename (visual mode in tmux)
# 3. Rechts: vim <filename>
```

### 4. Quick-Diff Funktion

```bash
# ~/.tigrc
bind main D !sh -c "git diff %(commit)~ %(commit) | delta"

# Bindet 'D' in main-view
# → Zeigt Diff mit delta-coloring
```

### 5. Blame + Claude Integration

```bash
# Function in ~/.bashrc
tigblame_ai() {
  local file=$1
  tig blame "$file" > /tmp/blame.txt
  cat /tmp/blame.txt | claude "Analyze git blame, identify patterns"
}

# Usage: tigblame_ai src/app.js
```

### 6. Export Historie für Dokumentation

```bash
# Function: Generate Changelog
changelog() {
  local from=${1:-v1.0.0}
  local to=${2:-HEAD}

  git log $from..$to \
    --pretty=format:"* %s (%an, %ar)" \
    --reverse | \
    claude "Format as structured changelog"
}
```

### 7. Interaktive Cherry-Pick

```bash
# ~/.tigrc
bind main C !git cherry-pick -x %(commit)
bind main X !sh -c "git show %(commit) | pbcopy"

# Workflow:
# 1. tig in source-branch
# 2. Navigate to commit
# 3. Drücke C → cherry-pick
# Oder X → copy to clipboard
```

---

## Zusammenfassung

**tig** ist ein essentielles Tool für Git-Power-Users, die Effizienz und Übersichtlichkeit schätzen:

### Kern-Vorteile:
✅ **Visual**: Git-Historie übersichtlich dargestellt
✅ **Interaktiv**: Vim-like Navigation, schnell & effizient
✅ **SSH-Friendly**: Funktioniert remote ohne GUI
✅ **Feature-Rich**: Blame, Diff, Refs, Status, Grep
✅ **Customizable**: Powerful ~/.tigrc Configuration

### Typische Use Cases:
- 🔍 Git-Historie browsing & exploration
- 🐛 Bug-Tracking mit Blame
- 👀 Code-Review vor Merge
- 🔄 Reflog-Recovery
- 📊 Author-Contribution Analysis

### Ergänzt perfekt:
- **lazygit**: Für interaktive Ops (tig browse, lazygit modify)
- **delta**: Für schönere Diffs
- **fzf**: Für Branch-Selection
- **Claude Code**: AI-Analysis von Historie

### Nächste Schritte:
1. Installiere tig: `brew install tig`
2. Erstelle ~/.tigrc mit Custom Keys
3. Lerne essenzielle Keybindings (hjkl, Enter, q)
4. Integriere in Daily Workflow (alias gl='tig')
5. Kombiniere mit tmux für Split-Screen

**Bottom Line**: `tig` ist unverzichtbar für Git-Workflows im Terminal. Schneller als GUI, mächtiger als `git log`, perfekt für Remote-Work.

---

**Weiter zu**: [16. zsh - Modern Shell](./16-zsh.md)
**Zurück zu**: [14. fd - File-Finding](./14-fd.md)
**Übersicht**: [Tools & Extensions](../TOOLS-EXTENSIONS-INDEX.md)
