# 🔎 fzf - Fuzzy Finder für alles

**Kategorie**: 🔵 Fortgeschrittene Tools
**Installation**: 3 Minuten
**Skill-Level**: Mittel
**Impact**: Massiv (verändert deinen Workflow komplett)

---

> 🚀 **Claude Code Relevanz**: fzf ist der universelle Datei-Finder fuer Claude Code Workflows -- schnelles Auffinden von Dateien, Durchsuchen der Command-History und interaktives Auswaehlen von Git-Branches beschleunigen jeden AI-gestuetzten Entwicklungsprozess.

## ✅ Berechtigung - Warum fzf?

### Das Problem mit Suchen im Terminal
Klassisches Suchen/Auswählen ist ineffizient:
- ❌ **Tab-Completion langsam**: `cd pro<TAB>j<TAB>e<TAB>...`
- ❌ **History-Search umständlich**: `Ctrl+R` ist rudimentär
- ❌ **File-Suche**: `find` → dann copy-paste Path
- ❌ **Process-Kill**: `ps aux | grep` → dann manuell PID kopieren
- ❌ **Git-Branch-Switch**: Branch-Name auswendig kennen
- ❌ **Kein Fuzzy-Match**: Exakte Strings nötig

**Beispiel**: File öffnen in tief verschachteltem Verzeichnis = 20+ Tastenanschläge.

### Die Lösung: fzf
`fzf` (Fuzzy Finder) = Interaktiver Filter für ALLES:
- ✅ **Fuzzy-Matching**: Tippe Teil-Strings, fzf findet's
- ✅ **Interactive**: Real-time Filtering während du tippst
- ✅ **Universal**: Funktioniert mit jeder Liste (Files, Processes, Git-Branches, Commands)
- ✅ **Preview-Window**: Sieh Inhalt bevor du auswählst
- ✅ **Keyboard-Driven**: Pfeiltasten + Enter = Selection
- ✅ **Scriptable**: Nutze in Shell-Scripts & Functions

**Ergebnis**:
- File finden in 3 Tastenanschlägen statt 20
- Command-History durchsuchen wie Google
- Git-Branches switchen ohne Namen kennen
- +70% Terminal-Produktivität

---

## 🎯 Zwecke - Wofür du fzf einsetzt

fzf ist ein Universal-Werkzeug fuer interaktive Auswahl. Egal ob Dateien, Befehle oder Git-Branches -- alles, was eine Liste ist, kann fzf filtern.

### 1. **File-Finder (wie Cmd+P in VS Code)**
```bash
vim $(fzf)  # Find + Open in 3 Keys
```

### 2. **Command-History-Search (Super-Ctrl+R)**
```bash
Ctrl+R  # fzf übernimmt History-Search
```

### 3. **Directory-Jumper**
```bash
cd $(find ~ -type d | fzf)
```

### 4. **Process-Killer**
```bash
ps aux | fzf | awk '{print $2}' | xargs kill
```

### 5. **Git-Branch-Switcher**
```bash
git branch | fzf | xargs git checkout
```

---

## 💻 Verwendung - Wie du fzf einsetzt

Von der Installation ueber die Keybindings bis zu fortgeschrittenen Funktionen -- hier lernst du fzf produktiv einzusetzen.

### Installation

Wichtig: Installiere fzf UND fuehre danach das Install-Script aus, um die Shell-Keybindings zu aktivieren.

**macOS (Homebrew)**:
```bash
brew install fzf

# Key-Bindings + Completion installieren
$(brew --prefix)/opt/fzf/install
```

**Ubuntu/Debian**:
```bash
sudo apt install fzf

# Oder: Latest von GitHub
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
```

**Arch Linux**:
```bash
sudo pacman -S fzf
```

> 💡 **Tipp**: Vergiss nicht, nach der Installation `$(brew --prefix)/opt/fzf/install` auszufuehren -- erst damit werden die essentiellen Keybindings Ctrl+T, Ctrl+R und Alt+C aktiviert.

---

### Quick Start (2 Minuten)

**Basis-Usage**:
```bash
# Simple List filtern
ls | fzf

# Mit Command
vim $(find . -name '*.js' | fzf)

# Direkter File-Finder
fzf  # (nutzt default: find command)
```

Diese drei Keybindings sind der groesste Produktivitaetsgewinn von fzf. Sie ersetzen umstaendliches Tippen durch interaktive Auswahl:

**Default Keybindings (nach Install)**:
```bash
# Ctrl+T = File Finder
# → Gibt selected file in Prompt ein

# Ctrl+R = Command History Search
# → Gibt selected command in Prompt ein

# Alt+C = Directory Changer
# → cd zu selected directory
```

**Interactive Navigation**:
```
In fzf:
  ↑/↓         - Navigate
  Ctrl+J/K    - Vim-style Navigate
  Enter       - Select
  Tab         - Multi-Select
  Shift+Tab   - Multi-Select (reverse)
  Ctrl+C/Esc  - Cancel
  ?           - Reverse Search
```

---

### Advanced Usage

Fortgeschrittene Techniken wie Preview-Windows, Custom Functions und Docker-Integration machen fzf zum Schweizer Taschenmesser deines Terminals.

**1. Preview-Window aktivieren**:
Das Preview-Window zeigt den Inhalt der aktuell markierten Datei in Echtzeit an, waehrend du filterst:
```bash
# Mit bat als Preview
fzf --preview 'bat --color=always {}'

# Mit cat (fallback)
fzf --preview 'cat {}'

# Preview-Window Position
fzf --preview 'bat {}' --preview-window=right:60%
```

**2. Custom Commands**:
Diese Shell-Funktionen kombinieren fzf mit haeufigen Aufgaben wie Datei-Oeffnen, Verzeichnis-Wechsel und Branch-Switching:
```bash
# In ~/.bashrc oder ~/.zshrc

# File-Finder mit Preview
fvim() {
  local file
  file=$(fzf --preview 'bat --color=always {}' --preview-window=right:60%)
  [[ -n "$file" ]] && vim "$file"
}

# Directory-Finder mit Preview
fcd() {
  local dir
  dir=$(find "${1:-.}" -type d 2>/dev/null | fzf --preview 'ls -la {}')
  [[ -n "$dir" ]] && cd "$dir"
}

# Git-Branch-Switcher
fbr() {
  local branch
  branch=$(git branch -a | sed 's/^[* ]*//' | sed 's/remotes\/origin\///' | \
    sort -u | fzf)
  [[ -n "$branch" ]] && git checkout "$branch"
}
```

**3. Multi-Select Workflow**:
```bash
# Files multi-selectable
fzf --multi  # Tab = select, Shift+Tab = deselect

# Beispiel: Multiple Files löschen
rm $(fzf --multi)

# Multiple Files zu git add
git add $(git status -s | fzf --multi | awk '{print $2}')
```

> 🚀 **Beispiel**: Die Kombination `vim $(fzf --preview 'bat {}')` ersetzt den gesamten Workflow von "Datei suchen, Pfad kopieren, Editor oeffnen" durch einen einzigen interaktiven Befehl mit Live-Vorschau.

**4. Custom FZF_DEFAULT_COMMAND**:
Standardmaessig nutzt fzf den langsamen `find`-Befehl. Mit fd oder ripgrep als Backend wird die Suche deutlich schneller und respektiert .gitignore:
```bash
# In ~/.bashrc oder ~/.zshrc

# Mit fd (schneller als find)
export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'

# Oder: Mit ripgrep (nur tracked files)
export FZF_DEFAULT_COMMAND='rg --files --hidden --glob "!.git"'

# Für Ctrl+T
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"

# Für Alt+C (Directories)
export FZF_ALT_C_COMMAND='fd --type d --hidden --follow --exclude .git'
```

**5. Custom Options (Colors, Layout)**:
Diese Umgebungsvariable definiert das Standard-Aussehen von fzf -- hier mit Dracula-Farbschema und Reverse-Layout:
```bash
# In ~/.bashrc oder ~/.zshrc
export FZF_DEFAULT_OPTS='
  --height 40%
  --layout=reverse
  --border
  --inline-info
  --color=fg:#f8f8f2,bg:#282a36,hl:#bd93f9
  --color=fg+:#f8f8f2,bg+:#44475a,hl+:#bd93f9
  --color=info:#ffb86c,prompt:#50fa7b,pointer:#ff79c6
  --color=marker:#ff79c6,spinner:#ffb86c,header:#6272a4
'
```

**6. Kill-Process Interactive**:
Statt manuell PIDs zu suchen, waehle Prozesse interaktiv aus und beende sie mit einem Tastendruck:
```bash
# Function
fkill() {
  local pid
  pid=$(ps -ef | sed 1d | fzf -m | awk '{print $2}')
  if [[ -n "$pid" ]]; then
    echo "$pid" | xargs kill -${1:-9}
  fi
}

# Nutzen:
fkill      # Kill -9
fkill 15   # Kill -15 (SIGTERM)
```

**7. Docker-Integration**:
```bash
# Container auswählen + exec
fdocker() {
  local container
  container=$(docker ps --format '{{.ID}} {{.Names}}' | fzf | awk '{print $1}')
  [[ -n "$container" ]] && docker exec -it "$container" /bin/bash
}

# Image auswählen + run
fdrun() {
  local image
  image=$(docker images --format '{{.Repository}}:{{.Tag}}' | fzf)
  [[ -n "$image" ]] && docker run -it "$image" /bin/bash
}
```

---

## 🏆 Best Practices

Diese Konfigurationen und Integrationen holen das Maximum aus fzf heraus und machen es zu einem zentralen Bestandteil deines Workflows.

### 1. **Defaults setzen (Must-Have)**
Diese Umgebungsvariablen sind die Basis fuer ein schnelles und visuell ansprechendes fzf-Setup:
```bash
# In ~/.bashrc oder ~/.zshrc

# fd als Default (schneller)
export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"

# Preview für Ctrl+T
export FZF_CTRL_T_OPTS="--preview 'bat --color=always {}' --preview-window=right:60%"

# Preview für Alt+C
export FZF_ALT_C_OPTS="--preview 'tree -C {} | head -100'"

# Colors
export FZF_DEFAULT_OPTS='--height 40% --layout=reverse --border'
```

### 2. **Vim-Integration**
Mit dem fzf.vim Plugin bekommt Vim eine Cmd+P-aehnliche Dateisuche und durchsuchbare Buffers:
```vim
" In ~/.vimrc
" fzf.vim Plugin
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'junegunn/fzf.vim'

" Keybindings
nnoremap <C-p> :Files<CR>
nnoremap <C-g> :Rg<CR>
nnoremap <C-b> :Buffers<CR>
```

### 3. **Tmux-Integration**
In tmux kann fzf in einem schwebenden Popup-Fenster angezeigt werden:
```bash
# In ~/.tmux.conf
# fzf in Popup
bind-key f run-shell "tmux popup -E 'fzf --preview \"bat {}\"'"
```

> ⚠️ **Warnung**: Ohne `fd` als FZF_DEFAULT_COMMAND kann fzf bei grossen Verzeichnissen langsam sein, da es standardmaessig `find` verwendet. Installiere `fd` und setze es als Default fuer deutlich bessere Performance.

### 4. **Git-Workflow-Integration**
```bash
# In ~/.bashrc

# Git commit with fuzzy file select
fcm() {
  git status -s | fzf --multi | awk '{print $2}' | xargs git add
  git commit -m "$1"
}

# Git checkout file (discard changes)
fco() {
  git status -s | fzf --multi | awk '{print $2}' | xargs git checkout --
}

# Git show commit
fshow() {
  git log --oneline | fzf --preview 'git show --color=always {1}' | \
    awk '{print $1}' | xargs git show
}
```

### 5. **npm/yarn Script-Runner**
```bash
# Function
fnpm() {
  local script
  script=$(cat package.json | jq -r '.scripts | keys[]' | fzf)
  [[ -n "$script" ]] && npm run "$script"
}
```

### 6. **SSH-Host-Selector**
```bash
# Function
fssh() {
  local host
  host=$(grep "^Host " ~/.ssh/config | awk '{print $2}' | fzf)
  [[ -n "$host" ]] && ssh "$host"
}
```

### 7. **Claude Code Integration**
```bash
# Open File in Editor (fuzzy)
alias e='vim $(fzf --preview "bat {}")'

# Search in Files + Open
falias rge='rg --line-number . | fzf --delimiter : \
  --preview "bat --color=always {1} --highlight-line {2}" | \
  cut -d: -f1,2 | xargs -I {} sh -c "vim +{2} {1}"'
```

---

## 📝 Beispiele - Real-World Use-Cases

### Beispiel 1: File öffnen (3 Tastenanschläge)

**Szenario**: Du willst `src/components/Auth/LoginForm.tsx` öffnen.

```bash
# Klassisch (schlecht)
cd src
cd components
cd Auth
vim LoginForm.tsx
# = 4 Commands, 50+ Zeichen

# Mit fzf (gut)
vim $(fzf)
# → Tippe: "logfo"
# → fzf matched: LoginForm.tsx
# → Enter
# = 1 Command, 5 Zeichen!

# Oder mit Alias:
e  # (alias e='vim $(fzf)')
# → "logfo" → Enter
```

**Zeit gespart**: 5 Sekunden vs. 30 Sekunden

---

### Beispiel 2: Git-Branch wechseln ohne Namen

**Szenario**: Du willst zu Branch wechseln, vergisst Namen.

```bash
# Klassisch
git branch  # → Sehe Liste
# feature/add-authentication
# feature/fix-login-bug
# feature/new-design
git checkout feature/add-authentication
# = viel Tippen

# Mit fzf-Function
fbr  # (siehe Advanced Usage)
# → Tippe: "auth"
# → Matched: feature/add-authentication
# → Enter
# ✓ Branch gewechselt!
```

**Produktivität**: Keine Branch-Namen merken nötig

---

### Beispiel 3: Process killen (interactive)

**Szenario**: Node-Server hängt, du willst killen.

```bash
# Klassisch
ps aux | grep node
# → PID finden: 12345
kill -9 12345

# Mit fzf
fkill  # (siehe Advanced Usage)
# → Tippe: "node"
# → Sehe: "12345 node server.js"
# → Enter
# ✓ Process killed!
```

**Zeit gespart**: 10 Sekunden vs. 30 Sekunden

---

> 💡 **Tipp**: Nutze `Tab` in fzf fuer Multi-Select -- damit kannst du mehrere Dateien gleichzeitig auswaehlen und z.B. per `git add` in einem Rutsch stagen.

### Beispiel 4: Command-History-Search

**Szenario**: Du hast komplexen Docker-Command vor 2 Tagen genutzt.

```bash
# Klassisch
Ctrl+R
# → Tippe: "docker run"
# → Sehe nur letzten docker run Command
# → Nicht der richtige, musst weiter Ctrl+R drücken

# Mit fzf (Ctrl+R)
Ctrl+R
# → Tippe: "docker mysql"
# → fzf zeigt ALLE Commands mit "docker" UND "mysql"
# → Pfeiltasten navigieren
# → Enter = Command in Prompt
```

**Vorteil**: Alle Matches auf einmal, nicht sequentiell

---

### Beispiel 5: Multi-File-Operations

**Szenario**: Du willst 5 Test-Files zu Git adden.

```bash
# Klassisch
git add tests/auth.test.js
git add tests/api.test.js
# ... 3 more ...

# Mit fzf + Multi-Select
git status -s | fzf --multi | awk '{print $2}' | xargs git add
# → Tab auf auth.test.js
# → Tab auf api.test.js
# → ... 3 more ...
# → Enter
# ✓ Alle 5 Files staged!
```

**Produktivität**: 1 Command statt 5

---

### Beispiel 6: Search in Files + Open at Line

**Szenario**: Du suchst Funktion `getUserData` in Codebase.

```bash
# Mit rg + fzf Combo
rg --line-number getUserData | fzf --preview 'bat {1}' | \
  cut -d: -f1,2 | xargs -I {} sh -c 'vim "+$(echo {} | cut -d: -f2)" "$(echo {} | cut -d: -f1)"'

# → Tippe: "user"
# → Sehe: alle Files mit getUserData
# → Enter
# ✓ Vim öffnet File an exakter Zeile!

# Oder als Alias:
alias rge='...'  # (siehe Best Practices)
rge
# → "user" → Enter
```

**Zeit gespart**: Instant Jump to Code

---

## 🤖 Claude Code Integration

### Workflow 1: Dateien fuer Claude Code interaktiv auswaehlen
```bash
# Claude Code Session: Datei mit fzf auswaehlen und an Claude uebergeben
claude "Review $(fzf --preview 'bat --color=always {}')"
# fzf oeffnet interaktive Auswahl mit Live-Vorschau
# Ausgewaehlte Datei wird direkt an Claude Code uebergeben
```

### Workflow 2: Git-Branches fuer Claude Code Feature-Arbeit switchen
```bash
# Branch-Wechsel mit fzf fuer Claude Code Projekte
git branch -a | sed 's/^[* ]*//' | fzf --preview 'git log --oneline -10 {}' | xargs git checkout
# Vorschau zeigt die letzten 10 Commits pro Branch
# Dann: claude "Setze die Arbeit an diesem Feature fort"
```

### Workflow 3: Code-Stellen mit rg+fzf finden und Claude analysieren lassen
```bash
# Kombination: ripgrep sucht, fzf filtert, Claude analysiert
rg --line-number "TODO|FIXME" | fzf --preview 'bat --color=always $(echo {} | cut -d: -f1) --highlight-line $(echo {} | cut -d: -f2)'
# Gefundene Stelle an Claude Code zur Bearbeitung uebergeben
```

> 💡 **Tipp**: Claude Code kann fzf automatisch in Shell-Funktionen einsetzen, um interaktive Auswahlmenues fuer Dateien, Branches und Prozesse zu erstellen.

---

## 📺 Video-Tutorial

[fzf - The Fuzzy Finder (GitHub Official)](https://github.com/junegunn/fzf)
Das offizielle Repository mit ausfuehrlichen Beispielen, GIF-Demos und Konfigurationsanleitungen -- die beste Ressource, um fzf von Grund auf zu verstehen und produktiv einzusetzen.

---

## 🔧 Troubleshooting

Die meisten fzf-Probleme betreffen fehlende Keybindings, langsame Performance oder Darstellungsprobleme.

### Problem: "Ctrl+R funktioniert nicht"

Die fzf-Keybindings werden nicht automatisch bei der Installation aktiviert -- das separate Install-Script muss ausgefuehrt werden.

**Lösung**: Keybindings installieren
```bash
# macOS
$(brew --prefix)/opt/fzf/install

# Linux
~/.fzf/install

# Dann: Shell neu laden
source ~/.bashrc  # oder ~/.zshrc
```

---

### Problem: "Preview zeigt nichts"

Das Preview-Window braucht ein externes Tool zur Darstellung. Ohne `bat` (oder mindestens `cat`) bleibt die Vorschau leer.

**Lösung**: bat installieren
```bash
brew install bat  # macOS
sudo apt install bat  # Ubuntu

# Dann:
fzf --preview 'bat --color=always {}'
```

---

### Problem: "fzf zu langsam (große Directories)"

fzf nutzt standardmaessig `find`, das bei grossen Verzeichnissen mit vielen Dateien (besonders mit node_modules) sehr langsam sein kann.

**Lösung**: fd statt find nutzen
```bash
# fd installieren
brew install fd

# Als Default setzen
export FZF_DEFAULT_COMMAND='fd --type f'
```

---

### Problem: "Colors unleserlich"

Das Standard-Farbschema von fzf harmoniert nicht mit allen Terminal-Themes und kann zu schlechter Lesbarkeit fuehren.

**Lösung**: Theme anpassen
```bash
# Light Terminal
export FZF_DEFAULT_OPTS='--color=light'

# Dark Terminal (Custom)
export FZF_DEFAULT_OPTS='--color=dark,fg:white,bg:black'
```

---

## 📊 fzf vs. Ctrl+R vs. find - Der Vergleich

| Feature | `Ctrl+R` | `find` | `fzf` |
|---------|----------|--------|-------|
| **Fuzzy-Match** | ❌ | ❌ | ✅ |
| **Interactive** | ⚠️ Limited | ❌ | ✅ |
| **Preview** | ❌ | ❌ | ✅ |
| **Multi-Select** | ❌ | ❌ | ✅ |
| **Speed** | ✅ | ⚠️ | 🚀 |
| **Universal** | ❌ History only | ❌ Files only | ✅ Anything |
| **Scriptable** | ❌ | ✅ | ✅ |

**Fazit**: fzf ist Universal-Tool für alle interaktiven Selections.

---

## 🔗 Weiterführende Links

### Offizielle Ressourcen
- **GitHub**: https://github.com/junegunn/fzf
- **Wiki**: https://github.com/junegunn/fzf/wiki
- **Examples**: https://github.com/junegunn/fzf/wiki/examples

### Community
- **Reddit**: r/fzf
- **Awesome fzf**: https://github.com/junegunn/fzf#fuzzy-completion-for-bash-and-zsh

### Plugins
- **fzf.vim**: Vim integration
- **fzf-tab**: Zsh tab-completion
- **fzf-tmux**: Tmux popup

---

## 💡 Pro-Tipps

### 1. **Best Function Collection**
```bash
# In ~/.bashrc - Ultimate fzf Functions

# File Opener with Preview
e() {
  fzf --preview 'bat --color=always {}' --preview-window=right:60% | xargs -r vim
}

# Git Branch Switcher
fbr() {
  git branch -a | grep -v HEAD | sed 's/remotes\/origin\///' | sort -u | \
    fzf | xargs git checkout
}

# Process Killer
fkill() {
  ps aux | fzf --multi | awk '{print $2}' | xargs -r kill -9
}

# Directory Jumper
fcd() {
  fd --type d | fzf --preview 'tree -C {} | head -100' | xargs -r cd
}
```

### 2. **Integration everywhere**
```bash
# All* commands mit fzf
alias kill='fkill'
alias cd='fcd'
alias vim='fvim'
```

### 3. **Zsh fzf-tab (Game-Changer)**
```bash
# Install
git clone https://github.com/Aloxaf/fzf-tab ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/fzf-tab

# In ~/.zshrc
plugins=(... fzf-tab)

# Dann: Tab-Completion wird zu fzf!
cd <TAB> → fzf directory selector
kill <TAB> → fzf process selector
```

---

## 🎯 Zusammenfassung

**fzf ist dein Universal-Fuzzy-Finder** - für Files, Commands, Processes, Git, alles.

**Quick Wins**:
- ✅ File öffnen in 3 Tastenanschlägen
- ✅ Command-History wie Google durchsuchen
- ✅ Git-Branches ohne Namen merken
- ✅ Processes killen ohne PID suchen
- ✅ Multi-Select für Batch-Operations

**Installation**: 3 Minuten
**Learning Curve**: 5 Minuten
**Produktivität**: +70% (kein Scherz)

---

**Nächster Schritt**: Installiere fzf + Keybindings, nutze Ctrl+T/Ctrl+R für 1 Tag - du wirst süchtig! 🔎

---

**Verwandte Lektionen**:
- [13 - ripgrep](./13-ripgrep.md) - Kombiniere: rg | fzf
- [14 - fd](./14-fd.md) - Nutze als FZF_DEFAULT_COMMAND
- [01 - bat](./01-bat.md) - Nutze als Preview-Tool

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0
