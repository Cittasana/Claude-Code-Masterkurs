# 16. zsh - Modern Shell

## Berechtigung

**zsh** (Z Shell) ist eine leistungsstarke Unix-Shell, die als erweiterte Alternative zu bash entwickelt wurde. Seit macOS Catalina (2019) ist zsh die Standard-Shell auf macOS und hat sich zur bevorzugten Shell für Developer etabliert.

### Warum zsh seine Berechtigung hat:

1. **Feature-Rich**: Erweiterte Completion, Globbing, Spelling-Correction
2. **Plugin-Ecosystem**: Oh-My-Zsh, Prezto, Antigen für Extensions
3. **Customizable**: Themes, Prompts, Keybindings vollständig anpassbar
4. **Performance**: Optimierte Startup-Zeit, effiziente Auto-Completion
5. **Compatibility**: Weitgehend bash-kompatibel mit zusätzlichen Features
6. **Modern**: Native Support für Arrays, Hash-Tables, erweiterte Pattern-Matching

### Statistiken:
- **Adoption**: Default Shell auf macOS seit 2019
- **Oh-My-Zsh**: 170k+ GitHub Stars, 30M+ Installs
- **Community**: 1000+ Themes, 300+ Plugins

---

> 🚀 **Claude Code Relevanz**: zsh mit Oh-My-Zsh ist die optimale Shell-Umgebung fuer Claude Code -- Auto-Suggestions, Syntax-Highlighting und intelligente Completion machen die taegliche Arbeit mit AI-gesteuerten Workflows deutlich effizienter.

## Zwecke

zsh verbessert jeden Aspekt deiner Terminal-Arbeit -- von intelligenteren Completions ueber Plugin-Erweiterungen bis hin zu komplett anpassbaren Prompts.

### Haupteinsatzgebiete:

1. **Daily Terminal Work**
   - Interaktive Command-Line
   - Bessere Auto-Completion
   - History-Management
   - Alias-System

2. **Development Workflows**
   - Git-Integration (Branch in Prompt)
   - Environment-Management (nvm, pyenv)
   - Tool-Specific Completions
   - Project-Specific Config

3. **Automation**
   - Shell-Scripts (bash-compatible)
   - Complex Parameter-Expansion
   - Array-Manipulation
   - Function-Libraries

4. **Customization**
   - Prompt-Engineering
   - Theme-Installation
   - Plugin-Management
   - Keybinding-Anpassung

5. **Productivity**
   - Fuzzy-Matching für Commands
   - Directory-Stack (pushd/popd)
   - Spelling-Correction
   - Command-Prediction

---

## Verwendung

Von der Installation ueber Oh-My-Zsh bis zu fortgeschrittenen Plugins und Custom-Prompts -- alles fuer eine produktive Shell-Umgebung.

### Installation

Auf macOS ist zsh bereits vorinstalliert. Auf Linux installierst du es ueber den Paketmanager:

#### macOS
Seit macOS Catalina (2019) ist zsh die Standard-Shell. Pruefe ob es korrekt eingerichtet ist:
```bash
# Already installed as default since Catalina
# Check version
zsh --version

# Set as default shell (if not already)
chsh -s $(which zsh)
```

#### Ubuntu/Debian
```bash
apt-get install zsh

# Set as default
chsh -s $(which zsh)
```

#### Arch Linux
```bash
pacman -S zsh

# Set as default
chsh -s /bin/zsh
```

### Verifizierung
```bash
echo $SHELL
# Output: /bin/zsh

zsh --version
# Output: zsh 5.9 (x86_64-apple-darwin23.0)
```

---

### Quick Start

Die Basis-Einrichtung umfasst eine minimale `~/.zshrc` und die Installation von Oh-My-Zsh als Plugin-Framework.

#### Erste Schritte
Erstelle als Erstes eine grundlegende Konfiguration mit History-Einstellungen und Auto-Completion:
```bash
# Starte zsh (falls nicht default)
zsh

# Config-File erstellen
touch ~/.zshrc

# Basic Config
cat >> ~/.zshrc << 'EOF'
# History
HISTFILE=~/.zsh_history
HISTSIZE=10000
SAVEHIST=10000
setopt SHARE_HISTORY

# Auto-Completion
autoload -Uz compinit && compinit

# Basic Aliases
alias ll='ls -lah'
alias g='git'
alias ..='cd ..'
EOF

# Reload Config
source ~/.zshrc
```

> 💡 **Tipp**: Erstelle als Erstes eine minimale `~/.zshrc` mit History-Settings und Auto-Completion, bevor du Oh-My-Zsh installierst -- so hast du ein Backup deiner Basis-Konfiguration.

#### Oh-My-Zsh Installation
Oh-My-Zsh ist das beliebteste Framework fuer zsh-Konfiguration. Es bringt Themes, Plugins und sinnvolle Defaults mit:
```bash
# Install Oh-My-Zsh (Framework)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Backup wird erstellt: ~/.zshrc.pre-oh-my-zsh
# Neue ~/.zshrc wird generiert
```

---

### Advanced Usage

Fortgeschrittene Konfiguration: Plugin-Management, Theme-Anpassung, erweiterte Completion und Custom Keybindings.

#### Plugin-Management (Oh-My-Zsh)
Plugins werden in der `~/.zshrc` im plugins-Array aufgelistet. Externe Plugins muessen vorher in das Custom-Verzeichnis geklont werden:
```bash
# ~/.zshrc
plugins=(
  git                    # Git-Aliases & Completion
  zsh-autosuggestions   # Fish-like Suggestions
  zsh-syntax-highlighting # Syntax-Coloring
  docker                 # Docker-Completion
  npm                    # NPM-Completion
  kubectl                # K8s-Completion
  fzf                    # Fuzzy-Finder-Integration
)

# Plugin installieren (External)
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

#### Theme-Anpassung
Das Theme bestimmt das Aussehen deines Prompts. Hunderte vorgefertigte Themes stehen zur Verfuegung:
```bash
# ~/.zshrc
ZSH_THEME="agnoster"  # Popular Theme

# Oder andere populäre Themes:
# ZSH_THEME="powerlevel10k/powerlevel10k"
# ZSH_THEME="robbyrussell"  # Default
# ZSH_THEME="spaceship"

# Custom Prompt (ohne Theme)
PROMPT='%F{blue}%~%f %F{red}❯%f '
```

> 🚀 **Beispiel**: Die drei Must-Have Plugins sind `zsh-autosuggestions` (Fish-aehnliche Vorschlaege), `zsh-syntax-highlighting` (Farbige Kommandos) und `fzf` (Fuzzy-Finder Integration) -- zusammen transformieren sie dein Terminal-Erlebnis komplett.

#### Advanced Completion
Diese Einstellungen verbessern die Tab-Completion erheblich -- Case-insensitive Suche, visuelle Markierung und Caching:
```bash
# ~/.zshrc

# Case-insensitive Completion
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'

# Highlight Selection
zstyle ':completion:*' menu select

# Completion Cache
zstyle ':completion:*' use-cache yes
zstyle ':completion:*' cache-path ~/.zsh/cache

# Group Results
zstyle ':completion:*:descriptions' format '%U%B%d%b%u'
zstyle ':completion:*:warnings' format '%BSorry, no matches for: %d%b'
```

#### Custom Keybindings
Waehle zwischen Vim-Modus (`-v`) und Emacs-Modus (`-e`) fuer die grundlegende Tastenbelegung:
```bash
# ~/.zshrc

# Vim-Mode
bindkey -v

# Oder Emacs-Mode (default)
bindkey -e

# Custom Bindings
bindkey '^R' history-incremental-search-backward
bindkey '^P' up-line-or-search
bindkey '^N' down-line-or-search
bindkey '^A' beginning-of-line
bindkey '^E' end-of-line
```

---

### Integration in Claude Code Workflows

#### 1. AI-Powered History-Search
```bash
# ~/.zshrc

# Function: Search history with Claude
hs() {
  history | tail -100 | \
    claude "Find commands related to: $1" | \
    fzf --preview 'echo {}' --preview-window down:3:wrap
}

# Usage: hs "docker"
```

#### 2. Smart Git-Aliases mit Kontext
```bash
# ~/.zshrc

# Git Commit mit AI-Generated Message
gcai() {
  git diff --staged | \
    claude "Generate commit message" | \
    xargs -I {} git commit -m "{}"
}

# Git Status + AI Summary
gsai() {
  git status | \
    claude "Summarize git status and suggest next actions"
}
```

#### 3. Project-Aware Prompt
```bash
# ~/.zshrc

# Show Project-Type in Prompt
project_type() {
  if [[ -f "package.json" ]]; then
    echo "node"
  elif [[ -f "requirements.txt" ]]; then
    echo "python"
  elif [[ -f "Cargo.toml" ]]; then
    echo "rust"
  fi
}

PROMPT='$(project_type) %F{blue}%~%f %F{red}❯%f '
```

#### 4. Context-Aware Completions
```bash
# ~/.zshrc

# Auto-load project-specific commands
if [[ -f "./.zshrc.local" ]]; then
  source ./.zshrc.local
fi

# Example .zshrc.local in project:
# alias start='npm run dev'
# alias test='npm test'
# alias build='npm run build'
```

---

## Best Practices

Bewaehrte Konfigurationsmuster fuer eine schnelle, produktive und sichere zsh-Umgebung.

### 1. Essenzielle ~/.zshrc Config

Diese umfassende Basis-Konfiguration deckt Oh-My-Zsh, History-Einstellungen, Completion, Navigation und nuetzliche Aliase ab:

```bash
# ~/.zshrc - Empfohlene Basis-Config

# ===== Oh-My-Zsh =====
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="agnoster"

plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
  docker
  kubectl
  npm
  fzf
)

source $ZSH/oh-my-zsh.sh

# ===== History =====
HISTFILE=~/.zsh_history
HISTSIZE=50000
SAVEHIST=50000
setopt EXTENDED_HISTORY          # Timestamps
setopt HIST_EXPIRE_DUPS_FIRST   # Expire duplicates first
setopt HIST_IGNORE_DUPS          # Don't record duplicates
setopt HIST_IGNORE_SPACE         # Don't record commands with leading space
setopt HIST_VERIFY               # Show command before executing
setopt SHARE_HISTORY             # Share history between sessions

# ===== Completion =====
autoload -Uz compinit && compinit
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'
zstyle ':completion:*' menu select

# ===== Navigation =====
setopt AUTO_CD                   # cd by just typing directory name
setopt AUTO_PUSHD               # Push old directory to stack
setopt PUSHD_IGNORE_DUPS        # Don't duplicate directories

# ===== Correction =====
setopt CORRECT                   # Spelling correction for commands
setopt CORRECT_ALL              # Spelling correction for arguments

# ===== Aliases =====
alias ll='ls -lah'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'

# Git Aliases
alias g='git'
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'
alias gd='git diff'
alias gco='git checkout'

# ===== Functions =====
mkcd() { mkdir -p "$1" && cd "$1"; }
```

> ⚠️ **Warnung**: Zu viele Oh-My-Zsh Plugins verlangsamen den Shell-Start erheblich. Nutze `time zsh -i -c exit` um die Startzeit zu messen -- alles ueber 0.5 Sekunden ist ein Zeichen fuer zu viele Plugins. Nutze Lazy-Loading fuer schwere Tools wie nvm.

### 2. Performance-Optimierung

Langsamer Shell-Start ist das haeufigste Problem bei zsh. Lazy-Loading von schweren Tools wie nvm kann die Startzeit drastisch reduzieren:

```bash
# ~/.zshrc

# Lazy-Load nvm (schnellerer Startup)
nvm() {
  unset -f nvm
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm "$@"
}

# Async Git-Status (für schnelleren Prompt)
# Nutze Powerlevel10k mit instant prompt

# Skip compinit check (schnellerer Start)
# compinit -C  # Vorsicht: Nur wenn du weißt was du tust
```

### 3. Plugin-Management Best Practices

Fuer bessere Performance und flexibleres Plugin-Management empfiehlt sich zinit als Alternative zu Oh-My-Zsh:

```bash
# Nutze zplug oder zinit für besseres Plugin-Management

# zinit Installation
sh -c "$(curl -fsSL https://git.io/zinit-install)"

# ~/.zshrc mit zinit
zinit light zsh-users/zsh-autosuggestions
zinit light zsh-users/zsh-syntax-highlighting
zinit light zsh-users/zsh-completions

# Lazy-Loading für Performance
zinit ice wait lucid
zinit light zdharma/fast-syntax-highlighting
```

### 4. Project-Specific Config

```bash
# Global ~/.zshrc
# Auto-load .zshrc.local in project dirs
[[ -f ./.zshrc.local ]] && source ./.zshrc.local

# Example: ~/projects/myapp/.zshrc.local
export DATABASE_URL="postgresql://localhost/myapp"
export API_KEY="dev-key-123"
alias start='npm run dev'
alias test='npm test'
```

### 5. Sichere Secrets-Verwaltung

API-Keys und Passwoerter gehoeren NICHT in die ~/.zshrc, da diese oft in Dotfile-Repos versioniert wird. Lagere sie in eine separate, geschuetzte Datei aus:

```bash
# ~/.zshrc

# Lade Secrets aus separatem File
if [[ -f ~/.zsh_secrets ]]; then
  source ~/.zsh_secrets
fi

# ~/.zsh_secrets (git-ignored!)
export OPENAI_API_KEY="sk-..."
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."

# Permissions
chmod 600 ~/.zsh_secrets
```

---

## Beispiele

### 1. Powerlevel10k Setup (Beliebtes Theme)

```bash
# Installation
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# ~/.zshrc
ZSH_THEME="powerlevel10k/powerlevel10k"

# Configuration Wizard starten
p10k configure

# Oder Manual Config
cat >> ~/.p10k.zsh << 'EOF'
# Instant Prompt
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi
EOF
```

### 2. Auto-Suggestions konfigurieren

```bash
# Installation
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# ~/.zshrc
plugins=(zsh-autosuggestions)

# Config
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=#666666"
ZSH_AUTOSUGGEST_STRATEGY=(history completion)
ZSH_AUTOSUGGEST_BUFFER_MAX_SIZE=20

# Keybinding für Accept
bindkey '^ ' autosuggest-accept  # Ctrl+Space
```

### 3. fzf-Integration für Fuzzy-Completion

```bash
# Installation (mit fzf)
brew install fzf
$(brew --prefix)/opt/fzf/install

# ~/.zshrc Auto-generated von fzf
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# Custom fzf-Config
export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_ALT_C_COMMAND='fd --type d --hidden --follow --exclude .git'

# Preview mit bat
export FZF_CTRL_T_OPTS="--preview 'bat --color=always --line-range :500 {}'"

# Custom Functions
fh() {
  print -z $(history | fzf --tac | sed 's/ *[0-9]* *//')
}
```

### 4. Docker-Workflow mit zsh

```bash
# ~/.zshrc

# Docker-Aliases
alias d='docker'
alias dc='docker-compose'
alias dps='docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
alias dimg='docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"'

# Functions
dexec() {
  container=$(docker ps --format '{{.Names}}' | fzf)
  [[ -n "$container" ]] && docker exec -it "$container" /bin/bash
}

dlogs() {
  container=$(docker ps --format '{{.Names}}' | fzf)
  [[ -n "$container" ]] && docker logs -f "$container"
}

# Auto-Completion
plugins=(docker docker-compose)
```

### 5. Git-Workflow-Enhancement

```bash
# ~/.zshrc

# Git-Funktionen
gst() {
  git status -sb | \
    bat --language=yaml --plain
}

glog() {
  git log --graph --abbrev-commit --decorate \
    --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(auto)%d%C(reset)' \
    --all | \
    head -20
}

# Branch-Switch mit fzf
gco() {
  branch=$(git branch -a | sed 's/^[* ]*//' | fzf)
  [[ -n "$branch" ]] && git checkout "$branch"
}

# Commit mit AI-Message
gcai() {
  git diff --staged | \
    claude "Generate concise commit message" | \
    read msg && git commit -m "$msg"
}
```

### 6. Entwicklungs-Environment Management

```bash
# ~/.zshrc

# Node.js Version Management
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Python Version Management
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"

# Ruby Version Management
eval "$(rbenv init -)"

# Auto-Switch auf .nvmrc
autoload -U add-zsh-hook
load-nvmrc() {
  if [[ -f .nvmrc && -r .nvmrc ]]; then
    nvm use
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

### 7. Claude Code Integration

```bash
# ~/.zshrc

# Claude-Wrapper Functions
c() {
  claude "$@"
}

# Code-Review mit Claude
review() {
  git diff "$@" | claude "Review this code diff for potential issues"
}

# Commit-Message Generator
gmsg() {
  git diff --staged | \
    claude "Generate commit message following conventional commits" | \
    tee /dev/tty | \
    pbcopy
  echo "\nMessage copied to clipboard. Use: git commit -m '...'"
}

# Explain-Command mit Claude
explain() {
  history | tail -1 | \
    cut -d' ' -f4- | \
    xargs -I {} claude "Explain this command: {}"
}
```

> 💡 **Tipp**: Nutze Powerlevel10k als Theme mit Instant-Prompt fuer eine blitzschnelle Shell, die sofort reagiert. Mit `p10k configure` laesst sich das Theme interaktiv an deine Vorlieben anpassen.

### 8. Productivity-Shortcuts

```bash
# ~/.zshrc

# Quick Navigation
alias dt='cd ~/Desktop'
alias dl='cd ~/Downloads'
alias dev='cd ~/Development'
alias proj='cd ~/Projects'

# Quick-Edit
alias zshrc='vim ~/.zshrc'
alias reload='source ~/.zshrc'

# Quick-Servers
alias serve='python3 -m http.server 8000'
alias phpserve='php -S localhost:8000'

# System Monitoring
alias cpu='top -o cpu'
alias mem='top -o mem'

# Network
alias myip='curl ifconfig.me'
alias ports='lsof -i -P -n | grep LISTEN'
```

### 9. Error-Correction & Suggestions

```bash
# ~/.zshrc

# Spelling Correction
setopt CORRECT
setopt CORRECT_ALL

# Aber exclude bestimmte Commands
CORRECT_IGNORE='_*'
CORRECT_IGNORE_FILE='.*'

# Alias für häufige Typos
alias gti='git'
alias got='git'
alias gut='git'
alias cim='vim'
alias bim='vim'
alias dc='cd'
alias sl='ls'
```

### 10. Custom Prompt mit Git-Info

```bash
# ~/.zshrc (ohne Oh-My-Zsh)

autoload -Uz vcs_info
precmd() { vcs_info }

zstyle ':vcs_info:git:*' formats '%b '
setopt PROMPT_SUBST

PROMPT='%F{blue}%~%f %F{red}${vcs_info_msg_0_}%f%F{yellow}❯%f '

# Mit Icons (benötigt Nerd Font)
PROMPT='%F{blue}%~%f %F{red} ${vcs_info_msg_0_}%f%F{yellow}❯%f '
```

---

## 🤖 Claude Code Integration

### Workflow 1: Claude Code Aliases fuer schnellen Zugriff
```bash
# In ~/.zshrc:
alias cc="claude"
alias ccr="claude 'Review den letzten Commit und schlage Verbesserungen vor'"
alias cct="claude 'Schreibe Tests fuer die zuletzt geaenderten Dateien'"
```

### Workflow 2: Zsh-Funktionen fuer Claude Code Workflows
```bash
# In ~/.zshrc:
ccfix() {
  claude "Analysiere und fixe den Fehler: $(cat /tmp/last-error.log)"
}
ccpr() {
  claude "Erstelle einen PR mit Titel '$1' fuer die aktuellen Aenderungen"
}
```

### Workflow 3: Auto-Completion fuer Claude Code
```bash
# Zsh bietet Completions fuer Claude Code Befehle
# Pruefe ob Claude Code Completions installiert sind:
claude --help
# Zsh Auto-Suggestions zeigt vorherige Claude Code Befehle
```

> 💡 **Tipp**: Konfiguriere zsh-Aliases und Funktionen fuer deine haeufigsten Claude Code Workflows, um noch schneller zu arbeiten.

---

## Troubleshooting

Die haeufigsten zsh-Probleme betreffen langsamen Start, fehlende Completions und PATH-Konfiguration.

### Problem: zsh startet langsam

Zu viele Plugins, nicht-lazy-geladene Tools wie nvm oder eine ueberladene compinit-Phase verlangsamen den Shell-Start.

**Symptom**: Neue Terminal-Fenster brauchen >2 Sekunden
```bash
time zsh -i -c exit
# Output: 2.5s
```

**Lösung**: Profile und Optimiere
```bash
# Profile Startup
zsh -xv 2>&1 | ts -i '%.s' > /tmp/zsh-profile.log

# Oder mit zprof
# ~/.zshrc (am Anfang)
zmodload zsh/zprof

# Am Ende
zprof

# Typische Bottlenecks:
# - nvm ohne lazy-loading
# - zu viele Plugins
# - Compinit bei jedem Start
```

---

### Problem: Plugins funktionieren nicht

Das Plugin ist entweder nicht im richtigen Verzeichnis installiert, nicht in der plugins-Liste eingetragen oder die Shell wurde nicht neu geladen.

**Symptom**: zsh-autosuggestions zeigt keine Suggestions
```bash
# Plugin installiert aber keine Vorschläge
```

**Lösung**: Check Installation & Config
```bash
# Verify Installation
ls ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/

# Check ~/.zshrc
grep "zsh-autosuggestions" ~/.zshrc

# Reload
source ~/.zshrc

# Manual Test
source ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
```

---

### Problem: Completion funktioniert nicht

Der Completion-Cache kann veraltet oder korrupt sein, besonders nach Plugin-Aenderungen oder System-Updates.

**Symptom**: Tab-Completion zeigt keine Vorschläge
```bash
git <TAB>  # Keine Completion
```

**Lösung**: Compinit neu initialisieren
```bash
# Remove Cache
rm ~/.zcompdump*

# Rebuild
autoload -Uz compinit && compinit

# In ~/.zshrc
autoload -Uz compinit
compinit -i  # Ignore insecure directories
```

---

### Problem: PATH is wrong after zsh

Beim Wechsel von bash zu zsh werden die PATH-Eintraege aus ~/.bashrc nicht uebernommen, da zsh eine eigene Konfigurationsdatei nutzt.

**Symptom**: Commands nicht gefunden nach Shell-Wechsel
```bash
python3: command not found
```

**Lösung**: PATH in ~/.zshrc setzen
```bash
# ~/.zshrc

# System Paths
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# Homebrew (macOS)
export PATH="/opt/homebrew/bin:$PATH"

# User Binaries
export PATH="$HOME/bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"

# Source ~/.zshrc
source ~/.zshrc
```

---

### Problem: Unicode/Emoji nicht dargestellt

Viele Themes und Prompts nutzen spezielle Icons (Nerd Font Symbole), die nur mit kompatiblen Schriftarten korrekt angezeigt werden.

**Symptom**: Prompt zeigt � statt Icons
```bash
PROMPT='  %~'  # Zeigt ��
```

**Lösung**: Nerd Font installieren
```bash
# Install Nerd Font (macOS)
brew tap homebrew/cask-fonts
brew install --cask font-fira-code-nerd-font

# Terminal-Einstellungen → Font → Fira Code Nerd Font

# Test
echo " "  # Sollte Git-Branch-Icon zeigen
```

---

## Vergleich: zsh vs. Alternativen

| Feature | zsh | bash | fish | nu |
|---------|-----|------|------|-----|
| **Completion** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Syntax** | POSIX + Extensions | POSIX | Unique | Unique |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Compatibility** | Mostly bash | Standard | ❌ | ❌ |
| **Plugin-System** | ✅ Oh-My-Zsh | ⚠️ Limited | ✅ Fisher | ✅ Built-in |
| **Auto-Suggestions** | ✅ Plugin | ❌ | ✅ Native | ✅ Native |
| **Customization** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Scripting** | ✅ Production | ✅ Standard | ⚠️ Non-POSIX | ⚠️ Different |
| **macOS Default** | ✅ Since 2019 | ❌ | ❌ | ❌ |

### Wann welche Shell?

**zsh**:
- Default für macOS Users
- Wenn bash-Compatibility benötigt
- Wenn großes Plugin-Ecosystem gewünscht
- Für Production-Scripts (meist kompatibel)

**bash**:
- Für Maximum Compatibility
- In CI/CD Environments
- Wenn POSIX-strict erforderlich
- Legacy-Systems

**fish**:
- Beste Out-of-Box Experience
- Wenn bash-Compat unwichtig
- Moderne Features ohne Config
- Learning-Friendly

**nu (nushell)**:
- Strukturierte Data-Pipelines
- Wenn Shell = Programming-Language
- Modern workflows
- Experimental/Cutting-Edge

---

## Links & Ressourcen

### Offizielle Dokumentation
- **zsh Website**: https://www.zsh.org/
- **zsh Manual**: `man zsh` oder https://zsh.sourceforge.io/Doc/
- **FAQ**: https://zsh.sourceforge.io/FAQ/

### Oh-My-Zsh
- **GitHub**: https://github.com/ohmyzsh/ohmyzsh
- **Themes**: https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
- **Plugins**: https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins

### Popular Frameworks
- **Powerlevel10k**: https://github.com/romkatv/powerlevel10k
- **Prezto**: https://github.com/sorin-ionescu/prezto
- **zinit**: https://github.com/zdharma-continuum/zinit

### Essential Plugins
- **zsh-autosuggestions**: https://github.com/zsh-users/zsh-autosuggestions
- **zsh-syntax-highlighting**: https://github.com/zsh-users/zsh-syntax-highlighting
- **zsh-completions**: https://github.com/zsh-users/zsh-completions

### Learning Resources
- **zsh Guide**: https://github.com/hmml/awesome-zsh
- **Video Tutorials**: https://www.youtube.com/results?search_query=zsh+setup
- **Dotfiles Examples**: https://github.com/search?q=zshrc

---

## Pro-Tipps

### 1. Startup-Time Profiling

Diese Funktion misst die durchschnittliche Startzeit deiner Shell ueber 10 Durchlaeufe -- so erkennst du, ob Optimierung noetig ist:

```bash
# Function in ~/.zshrc
benchmark_zsh() {
  for i in $(seq 1 10); do
    /usr/bin/time zsh -i -c exit 2>&1 | grep total
  done | \
    awk '{sum+=$1; count++} END {print "Average: " sum/count "s"}'
}
```

### 2. Context-Aware Aliases

Aliase, die nur aktiv sind, wenn das passende Projekt-Setup vorhanden ist (z.B. `start` nur bei Node.js-Projekten):

```bash
# ~/.zshrc

# Directory-specific aliases
[[ -d node_modules ]] && alias start='npm start'
[[ -f Makefile ]] && alias build='make'
[[ -f docker-compose.yml ]] && alias up='docker-compose up'
```

### 3. Smart History-Search

Binde die Pfeiltasten an History-Search, sodass begonnene Befehle automatisch aus der History vervollstaendigt werden:

```bash
# ~/.zshrc

# Bind Up/Down to history-search
bindkey '^[[A' history-beginning-search-backward
bindkey '^[[B' history-beginning-search-forward

# Mit fzf
fh() {
  print -z $( ([ -n "$ZSH_NAME" ] && fc -l 1 || history) | \
    fzf +s --tac | \
    sed 's/ *[0-9]* *//')
}
```

### 4. Project-Switcher

```bash
# ~/.zshrc

# Quick Project-Jump
pj() {
  project=$(fd -t d -d 3 . ~/Development | fzf)
  [[ -n "$project" ]] && cd "$project"
}

# Mit Auto-Activation
autoload -U add-zsh-hook
project_enter() {
  if [[ -f .envrc ]]; then
    source .envrc
  fi
}
add-zsh-hook chpwd project_enter
```

### 5. Universal Extract Function

Eine einzige Funktion fuer alle Archivformate -- nie wieder ueberlegen, ob es `tar xzf` oder `unzip` sein muss:

```bash
# ~/.zshrc

extract() {
  if [ -f "$1" ] ; then
    case "$1" in
      *.tar.bz2)   tar xjf "$1"     ;;
      *.tar.gz)    tar xzf "$1"     ;;
      *.bz2)       bunzip2 "$1"     ;;
      *.rar)       unrar x "$1"     ;;
      *.gz)        gunzip "$1"      ;;
      *.tar)       tar xf "$1"      ;;
      *.tbz2)      tar xjf "$1"     ;;
      *.tgz)       tar xzf "$1"     ;;
      *.zip)       unzip "$1"       ;;
      *.Z)         uncompress "$1"  ;;
      *.7z)        7z x "$1"        ;;
      *)     echo "'$1' cannot be extracted" ;;
    esac
  else
    echo "'$1' is not a valid file"
  fi
}
```

---

## Zusammenfassung

**zsh** ist die moderne Standard-Shell für Entwickler und Power-Users:

### Kern-Vorteile:
✅ **Feature-Rich**: Überlegene Completion, History, Globbing
✅ **Customizable**: Themes, Plugins, vollständige Kontrolle
✅ **Productive**: Auto-Suggestions, Spelling-Correction
✅ **Compatible**: Bash-Scripts laufen meist ohne Änderung
✅ **Community**: Riesiges Plugin-Ecosystem (Oh-My-Zsh)

### Typische Use Cases:
- 🖥️ Daily Terminal-Arbeit
- 💻 Development Workflows
- 🔧 Automation & Scripting
- 🎨 Customized User-Experience
- 🚀 Productivity-Enhancement

### Ergänzt perfekt:
- **Starship**: Modern Cross-Shell Prompt
- **fzf**: Fuzzy-Finding Integration
- **tmux**: Terminal-Multiplexing
- **Claude Code**: AI-Enhanced Commands

### Nächste Schritte:
1. Installiere Oh-My-Zsh
2. Wähle Theme (Powerlevel10k empfohlen)
3. Installiere Essential Plugins (autosuggestions, syntax-highlighting)
4. Customize ~/.zshrc mit eigenen Aliases & Functions
5. Integriere fzf für Fuzzy-Finding

**Bottom Line**: `zsh` ist unverzichtbar für moderne Terminal-Workflows. Bessere UX als bash, riesiges Ecosystem, Standard auf macOS.

---

**Weiter zu**: [17. starship - Modern Prompt](./17-starship.md)
**Zurück zu**: [15. tig - Git Browser](./15-tig.md)
**Übersicht**: [Tools & Extensions](../TOOLS-EXTENSIONS-INDEX.md)
