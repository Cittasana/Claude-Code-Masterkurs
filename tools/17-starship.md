# 17. starship - Modern Prompt Customization

## Berechtigung

**starship** ist ein minimaler, extrem schneller und hochgradig anpassbarer Prompt für jede Shell. Geschrieben in Rust, bietet es eine moderne Alternative zu traditionellen Shell-Prompts mit intelligenten Defaults und reichhaltiger Kontextinformation.

### Warum starship seine Berechtigung hat:

1. **Shell-Agnostic**: Funktioniert mit bash, zsh, fish, PowerShell, etc.
2. **Performance**: <1ms Startup durch Rust-Implementation
3. **Smart Defaults**: Zeigt nur relevante Info (Git-Branch nur in Repos)
4. **Customizable**: 100% konfigurierbar via TOML
5. **Rich Context**: Git, Docker, Node, Python, Rust, Cloud, Kubernetes uvm.
6. **Nerd Font Support**: Schöne Icons für Visual-Context

### Statistiken:
- **Performance**: Sub-millisecond Rendering
- **Popularität**: 43k+ GitHub Stars
- **Adoption**: Verwendet von VS Code, GitHub, Microsoft-Teams

---

> 🚀 **Claude Code Relevanz**: Starship zeigt Git-Branch, Projekttyp und Laufzeiten direkt im Prompt an -- essentiell, um bei Claude Code Workflows stets den Kontext zu behalten.

## Zwecke

### Haupteinsatzgebiete:

1. **Development Context**
   - Git-Branch & Status
   - Programming-Language Versionen
   - Package-Versionen
   - Environment-Indicators

2. **Cloud & DevOps**
   - Kubernetes-Context
   - AWS/GCP/Azure Profile
   - Docker-Context
   - Terraform-Workspace

3. **User-Experience**
   - Visuelles Feedback
   - Error-Indication (Exit-Codes)
   - Execution-Time für Commands
   - Battery-Level (Laptops)

4. **Productivity**
   - Directory-Path-Shortening
   - Username@Hostname (SSH)
   - Time-Stamps
   - Custom-Modules

5. **Aesthetics**
   - Consistent Cross-Shell Look
   - Theme-Support
   - Icon-Integration
   - Color-Customization

---

## Verwendung

In diesem Abschnitt lernst du die Installation, Grundkonfiguration und fortgeschrittene Nutzung von starship. Von der ersten Shell-Integration bis hin zu Custom Modules und Claude Code Workflows wird alles abgedeckt.

### Installation

Starship kann auf allen gaengigen Plattformen installiert werden. Waehle die passende Methode fuer dein Betriebssystem.

#### macOS (Homebrew)

Die einfachste Installation auf macOS laeuft ueber Homebrew:

```bash
brew install starship
```

#### Ubuntu/Debian

Auf Ubuntu und Debian wird starship ueber das offizielle Install-Script heruntergeladen:

```bash
curl -sS https://starship.rs/install.sh | sh
```

#### Arch Linux

Unter Arch Linux ist starship direkt im offiziellen Repository verfuegbar:

```bash
pacman -S starship
```

#### Rust (plattformunabhängig)

Falls du bereits eine Rust-Toolchain installiert hast, kannst du starship direkt ueber Cargo bauen:

```bash
cargo install starship --locked
```

### Verifizierung

Pruefe nach der Installation, ob starship korrekt installiert wurde und im PATH liegt:

```bash
starship --version
# Output: starship 1.17.1

which starship
# Output: /usr/local/bin/starship
```

---

> 💡 **Tipp**: Installiere zuerst eine Nerd Font (z.B. FiraCode Nerd Font), bevor du starship konfigurierst -- ohne Nerd Fonts werden die Icons nicht korrekt angezeigt.

### Quick Start

Um starship nutzen zu koennen, muss es in deiner Shell aktiviert werden. Fuege die passende Zeile am Ende deiner Shell-Konfigurationsdatei hinzu.

#### Bash Integration

Fuer Bash fuege diese Zeile am Ende deiner `~/.bashrc` hinzu:

```bash
# ~/.bashrc
eval "$(starship init bash)"
```

#### Zsh Integration

Fuer Zsh kommt die Zeile in die `~/.zshrc`:

```bash
# ~/.zshrc
eval "$(starship init zsh)"
```

#### Fish Integration

Fish nutzt eine andere Syntax, da es kein `eval` unterstuetzt:

```bash
# ~/.config/fish/config.fish
starship init fish | source
```

#### PowerShell Integration

Fuer PowerShell fuege den Befehl in dein Profil-Script ein:

```powershell
# $PROFILE
Invoke-Expression (&starship init powershell)
```

#### Test Installation

Nach der Konfiguration lade deine Shell neu, um starship zu aktivieren:

```bash
# Reload Shell
exec $SHELL

# Sollte starship-Prompt zeigen:
# user@host ~/dir
```

---

### Advanced Usage

Hier lernst du, wie du starship ueber eine TOML-Konfigurationsdatei an deine Beduerfnisse anpasst -- von individuellen Modulen bis hin zu kompletten Themes.

#### Config-File erstellen

Starship wird ueber eine TOML-Datei konfiguriert. Du kannst ein Preset als Ausgangsbasis verwenden oder eine leere Datei erstellen:

```bash
# Config-File generieren
mkdir -p ~/.config
starship preset nerd-font-symbols -o ~/.config/starship.toml

# Oder manuell erstellen
touch ~/.config/starship.toml
```

#### Basis-Configuration

Diese Grundkonfiguration definiert das Prompt-Format, das Prompt-Zeichen und die wichtigsten Module wie Directory und Git:

```toml
# ~/.config/starship.toml

# Prompt Format
format = """
[┌───────────────────](bold green)
[│](bold green)$directory$git_branch$git_status
[└─>](bold green) """

# Character Module
[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"

# Directory Module
[directory]
truncation_length = 3
truncate_to_repo = false

# Git Branch
[git_branch]
symbol = " "
format = "on [$symbol$branch]($style) "

# Git Status
[git_status]
format = '([\[$all_status$ahead_behind\]]($style) )'
```

> 🚀 **Beispiel**: Mit `starship preset nerd-font-symbols -o ~/.config/starship.toml` hast du in Sekunden einen professionellen Prompt mit allen wichtigen Symbolen -- ideal als Ausgangsbasis fuer eigene Anpassungen.

#### Presets verwenden

Starship bietet mehrere vorgefertigte Presets, die als Ausgangspunkt fuer deine eigene Konfiguration dienen:

```bash
# Verfügbare Presets anzeigen
starship preset --list

# Output:
# - nerd-font-symbols
# - no-nerd-font
# - bracketed-segments
# - plain-text-symbols
# - pastel-powerline

# Preset anwenden
starship preset nerd-font-symbols -o ~/.config/starship.toml
```

#### Module aktivieren/deaktivieren

Einzelne Module koennen gezielt ein- oder ausgeschaltet werden. Mit `disabled = false` aktivierst du ein Modul, und ueber `format` bestimmst du dessen Darstellung:

```toml
# ~/.config/starship.toml

# Node.js Version anzeigen
[nodejs]
disabled = false
format = "via [ $version](bold green) "

# Python Version
[python]
disabled = false
format = 'via [🐍 $version]($style) '

# Docker Context
[docker_context]
disabled = false
format = "via [ $context](bold blue) "

# Kubernetes
[kubernetes]
disabled = false
format = 'on [⛵ $context](bold blue) '
```

---

### Integration in Claude Code Workflows

Starship kann mit Custom Modules erweitert werden, um Claude Code Workflows direkt im Terminal-Prompt sichtbar zu machen.

#### 1. Custom Module für Claude-Context

Dieses benutzerdefinierte Modul liest eine `.claude-context`-Datei und zeigt deren Inhalt im Prompt an -- so siehst du sofort, ob ein Projekt AI-unterstuetzt ist:

```toml
# ~/.config/starship.toml

# Custom Module
[custom.claude]
command = '''
if [[ -f .claude-context ]]; then
  cat .claude-context
fi
'''
when = "test -f .claude-context"
format = "[$output]($style) "
style = "bold yellow"

# Usage: echo "AI-ENABLED" > .claude-context
```

#### 2. Project-Type Indication

Mit Custom Modules kannst du den Projekttyp automatisch erkennen und im Prompt anzeigen lassen -- nuetzlich, wenn du zwischen React-, Python- oder anderen Projekten wechselst:

```toml
# ~/.config/starship.toml

# React-Projekte
[custom.react]
detect_files = ["package.json"]
detect_extensions = ["jsx", "tsx"]
command = "echo '⚛'"
format = "[$output]($style) "
style = "cyan"
when = 'grep -q "react" package.json 2>/dev/null'

# Python ML-Projekte
[custom.ml]
detect_files = ["requirements.txt", "Pipfile"]
command = "echo '🤖'"
when = '''
  grep -E "(tensorflow|pytorch|scikit-learn)" requirements.txt 2>/dev/null ||
  grep -E "(tensorflow|pytorch|scikit-learn)" Pipfile 2>/dev/null
'''
```

#### 3. Git-Enhanced Workflow

Ein detaillierter Git-Status im Prompt zeigt dir auf einen Blick, wie viele Dateien geaendert, gestaged oder ungetrackt sind:

```toml
# ~/.config/starship.toml

# Detaillierter Git-Status
[git_status]
ahead = "⇡${count}"
diverged = "⇕⇡${ahead_count}⇣${behind_count}"
behind = "⇣${count}"
deleted = "✘${count}"
modified = "!${count}"
staged = "+${count}"
untracked = "?${count}"
stashed = "$${count}"

# Branch mit Upstream
[git_branch]
format = "on [$symbol$branch(:$remote_branch)]($style) "
```

#### 4. Execution-Time Tracking

Die Command-Duration zeigt dir, wie lange der letzte Befehl gedauert hat -- besonders nuetzlich, um langsame Build- oder Test-Laeufe sofort zu erkennen:

```toml
# ~/.config/starship.toml

# Command Duration
[cmd_duration]
min_time = 500  # Show wenn Command >500ms
format = "took [$duration]($style) "
style = "bold yellow"

# Time-Stamps
[time]
disabled = false
format = '🕙[\[ $time \]]($style) '
time_format = "%T"
```

---

## Best Practices

Diese bewaeaehrten Konfigurationsempfehlungen helfen dir, starship performant und uebersichtlich einzurichten.

### 1. Essenzielle Config (~/.config/starship.toml)

Diese umfassende Konfiguration deckt die wichtigsten Module ab -- von Git ueber Programmiersprachen bis hin zu Cloud-Kontexten. Sie eignet sich als solide Basis fuer die taegliche Entwicklungsarbeit:

```toml
# ~/.config/starship.toml - Recommended Setup

# ===== Format =====
format = """
$username\
$hostname\
$directory\
$git_branch\
$git_status\
$nodejs\
$python\
$rust\
$docker_context\
$kubernetes\
$aws\
$time\
$line_break\
$character"""

# ===== Prompt Character =====
[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"
vimcmd_symbol = "[❮](bold green)"

# ===== Directory =====
[directory]
truncation_length = 5
truncate_to_repo = true
format = "[$path]($style)[$read_only]($read_only_style) "
style = "bold cyan"
read_only = " 🔒"

# ===== Git Branch =====
[git_branch]
symbol = " "
truncation_length = 30
format = "on [$symbol$branch(:$remote_branch)]($style) "
style = "bold purple"

# ===== Git Status =====
[git_status]
format = '([\[$all_status$ahead_behind\]]($style) )'
style = "bold red"
conflicted = "🏳"
ahead = "⇡${count}"
behind = "⇣${count}"
diverged = "⇕⇡${ahead_count}⇣${behind_count}"
untracked = "?${count}"
stashed = "$${count}"
modified = "!${count}"
staged = "+${count}"
renamed = "»${count}"
deleted = "✘${count}"

# ===== Programming Languages =====
[nodejs]
symbol = " "
format = "via [$symbol($version )]($style)"
style = "bold green"

[python]
symbol = " "
format = 'via [${symbol}${pyenv_prefix}(${version} )(\($virtualenv\) )]($style)'
style = "yellow bold"

[rust]
symbol = " "
format = "via [$symbol($version )]($style)"
style = "bold red"

# ===== Cloud & DevOps =====
[docker_context]
symbol = " "
format = "via [$symbol$context]($style) "
style = "bold blue"

[kubernetes]
symbol = "☸ "
disabled = false
format = 'on [$symbol$context( \($namespace\))]($style) '
style = "cyan bold"

[aws]
symbol = "  "
format = 'on [$symbol($profile )(\($region\) )]($style)'
style = "bold yellow"

# ===== Performance =====
[cmd_duration]
min_time = 500
format = "took [$duration]($style) "
style = "bold yellow"

# ===== Time =====
[time]
disabled = false
format = '🕙[\[ $time \]]($style) '
time_format = "%T"
utc_time_offset = "local"
style = "bold white"
```

> ⚠️ **Warnung**: Aktiviere nicht alle Module gleichzeitig -- Module wie `package` oder `docker_context` koennen den Prompt in grossen Repositories merklich verlangsamen. Nutze `starship timings` um Engpaesse zu finden.

### 2. Performance-Tuning

Langsame Module koennen den Prompt-Aufbau merklich verzoegern, besonders in grossen Repositories. Deaktiviere Module, die du nicht brauchst, und reduziere Scan-Timeouts:

```toml
# ~/.config/starship.toml

# Disable langsame Module
[package]
disabled = true  # Nur wenn wirklich benötigt

[docker_context]
disabled = true  # Nur in Docker-Projekten aktivieren

# Scan-Timeout reduzieren
[rust]
detect_extensions = ["rs"]
scan_timeout = 10  # milliseconds

# Caching für Git
[git_status]
disabled = false
ahead_behind = true
```

### 3. Conditional Activation

Durch gezielte Datei- und Ordner-Erkennung zeigt starship Module nur dann an, wenn sie im aktuellen Projektkontext relevant sind -- das haelt den Prompt schlank:

```toml
# ~/.config/starship.toml

# Node nur in Node-Projekten
[nodejs]
disabled = false
detect_files = ["package.json", ".node-version"]
detect_folders = ["node_modules"]

# Python nur in Python-Projekten
[python]
disabled = false
detect_extensions = ["py"]
detect_files = [".python-version", "Pipfile", "requirements.txt"]

# Kubernetes nur in K8s-Projekten
[kubernetes]
disabled = false
detect_files = ["k8s", "kubernetes"]
```

### 4. Themed-Configs

Mit Paletten kannst du ein einheitliches Farbschema definieren, das zu deinem Terminal-Theme passt:

```toml
# ~/.config/starship.toml

# Pastel Theme
palette = "pastel"

[palettes.pastel]
background = "#1e1e2e"
foreground = "#cdd6f4"
yellow = "#f9e2af"
green = "#a6e3a1"
red = "#f38ba8"
blue = "#89b4fa"
purple = "#cba6f7"
```

> 💡 **Tipp**: Nutze `STARSHIP_CONFIG` als Environment-Variable, um verschiedene Configs fuer Arbeit und persoenliche Projekte zu verwenden -- besonders praktisch bei Multi-Projekt-Setups.

### 5. Shell-Specific Tweaks

Shell-spezifische Einstellungen wie Cache-Verzeichnis und Lazy-Loading optimieren das Starship-Verhalten in deiner konkreten Shell-Umgebung:

```bash
# ~/.zshrc (für zsh)
export STARSHIP_CONFIG=~/.config/starship.toml
export STARSHIP_CACHE=~/.starship/cache
eval "$(starship init zsh)"

# Performance: Lazy-Load starship in tmux
if [[ -z $TMUX ]]; then
  eval "$(starship init zsh)"
fi
```

---

## Beispiele

In diesen Beispielen findest du fertige Konfigurationen fuer verschiedene Einsatzszenarien -- vom minimalistischen Setup bis zum vollstaendigen DevOps-Prompt.

### 1. Minimal Clean Setup

Dieses Setup zeigt nur das Noetigste: Verzeichnis, Git-Branch, Git-Status und ein Prompt-Zeichen. Ideal fuer alle, die einen aufgeraeumten Prompt bevorzugen:

```toml
# ~/.config/starship.toml - Minimal

format = """
$directory\
$git_branch\
$git_status\
$character"""

[character]
success_symbol = "[❯](green)"
error_symbol = "[❯](red)"

[directory]
truncation_length = 3
format = "[$path]($style) "
style = "cyan"

[git_branch]
format = "[$symbol$branch]($style) "
symbol = " "
style = "purple"

[git_status]
format = '([\[$all_status\]]($style) )'
style = "red"
```

### 2. Powerline-Style

Ein Powerline-Look mit farbigen Segmenten, die ineinander uebergehen. Benoetigt eine Nerd Font fuer die Trennzeichen-Symbole:

```toml
# ~/.config/starship.toml - Powerline

format = """
[](fg:blue)\
$directory\
[](fg:blue bg:purple)\
$git_branch\
$git_status\
[](fg:purple bg:green)\
$nodejs\
[](fg:green)\
$character"""

[directory]
format = "[  $path ]($style)"
style = "bg:blue fg:black"
truncation_length = 3

[git_branch]
format = "[ $symbol$branch ]($style)"
symbol = " "
style = "bg:purple fg:black"

[git_status]
format = '[$all_status$ahead_behind ]($style)'
style = "bg:purple fg:black"

[nodejs]
format = "[ $symbol($version) ]($style)"
symbol = " "
style = "bg:green fg:black"

[character]
success_symbol = "[ ❯](green)"
error_symbol = "[ ❯](red)"
```

### 3. Developer-Focused (Full-Context)

Diese Konfiguration zeigt alle verfuegbaren Informationen an -- von Git ueber Cloud-Provider bis hin zu Batterie-Status. Ideal fuer Entwickler, die maximalen Kontext im Prompt wollen:

```toml
# ~/.config/starship.toml - Developer

format = """
$username\
$hostname\
$directory\
$git_branch\
$git_commit\
$git_state\
$git_status\
$docker_context\
$nodejs\
$python\
$rust\
$golang\
$java\
$php\
$terraform\
$kubernetes\
$aws\
$gcloud\
$azure\
$cmd_duration\
$line_break\
$jobs\
$battery\
$time\
$character"""

# ... (alle Module konfiguriert)
```

### 4. Cloud/DevOps Focus

Speziell fuer DevOps-Workflows zeigt dieser Prompt Kubernetes-Context, Terraform-Workspace und Cloud-Provider-Profile prominent an:

```toml
# ~/.config/starship.toml - Cloud

format = """
$directory\
$git_branch\
$git_status\
$line_break\
$kubernetes\
$docker_context\
$terraform\
$aws\
$gcloud\
$azure\
$line_break\
$character"""

[kubernetes]
disabled = false
symbol = "☸ "
format = '[$symbol$context( \($namespace\))]($style) '
style = "cyan"

[terraform]
disabled = false
format = "[🏗 $workspace]($style) "
style = "purple"

[aws]
disabled = false
symbol = "☁️  "
format = '[$symbol($profile )(\($region\))]($style) '
style = "yellow"

[gcloud]
disabled = false
format = '[$symbol$account(@$domain)(\($project\))]($style) '
symbol = "️🇬️ "
style = "blue"

[azure]
disabled = false
format = '[$symbol($subscription)]($style) '
symbol = "ﴃ "
style = "blue"
```

### 5. Vim-Mode Indicator (zsh)

```toml
# ~/.config/starship.toml

[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"
vimcmd_symbol = "[❮](bold green)"
vimcmd_visual_symbol = "[❮](bold yellow)"
vimcmd_replace_symbol = "[❮](bold purple)"
vimcmd_replace_one_symbol = "[❮](bold purple)"

# In ~/.zshrc zusätzlich:
# bindkey -v  # Vim-mode aktivieren
```

### 6. Project-Type Badges

```toml
# ~/.config/starship.toml

[custom.project_type]
command = '''
if [[ -f "package.json" ]]; then
  echo "📦 npm"
elif [[ -f "Cargo.toml" ]]; then
  echo "🦀 rust"
elif [[ -f "go.mod" ]]; then
  echo "🐹 go"
elif [[ -f "requirements.txt" ]]; then
  echo "🐍 python"
elif [[ -f "Dockerfile" ]]; then
  echo "🐳 docker"
fi
'''
when = "true"
format = "[$output]($style) "
style = "bold blue"
```

### 7. Battery-Level (Laptops)

```toml
# ~/.config/starship.toml

[battery]
full_symbol = "🔋"
charging_symbol = "⚡"
discharging_symbol = "💀"

[[battery.display]]
threshold = 10
style = "bold red"

[[battery.display]]
threshold = 30
style = "bold yellow"

[[battery.display]]
threshold = 100
style = "bold green"
```

### 8. Custom Git-Workflow

```toml
# ~/.config/starship.toml

[git_branch]
format = "on [$symbol$branch(:$remote_branch)]($style) "
symbol = " "
style = "purple"
truncation_symbol = "…"

[git_commit]
commit_hash_length = 7
format = '[\($hash$tag\)]($style) '
tag_symbol = " 🏷 "

[git_state]
format = '[\($state( $progress_current of $progress_total)\)]($style) '
cherry_pick = "[🍒 PICKING](bold red)"
rebase = "rebasing"
merge = "merging"
revert = "reverting"
```

### 9. Execution-Time mit Threshold

```toml
# ~/.config/starship.toml

[cmd_duration]
min_time = 500
format = "took [$duration]($style) "
style = "bold yellow"
show_milliseconds = false

# Notifications für lange Commands (via Hooks)
# In ~/.zshrc:
# autoload -U add-zsh-hook
# slow_command_notify() {
#   if [[ $cmd_duration -gt 10000 ]]; then
#     osascript -e 'display notification "Command finished" with title "Terminal"'
#   fi
# }
# add-zsh-hook precmd slow_command_notify
```

### 10. Directory-Substitution

```toml
# ~/.config/starship.toml

[directory]
truncation_length = 5
truncate_to_repo = true
format = "[$path]($style)[$read_only]($read_only_style) "
style = "cyan"
read_only = " 🔒"

[directory.substitutions]
"~/Development" = "💻"
"~/Projects" = "📁"
"~/Documents" = "📄"
"~/Desktop" = "🖥️"
```

---

## 🤖 Claude Code Integration

### Workflow 1: Git-Branch-Info in Prompt
```bash
# Starship zeigt automatisch den Branch, ideal wenn Claude Code Branches erstellt
# In starship.toml:
[git_branch]
format = "[$symbol$branch]($style) "
```

### Workflow 2: Node.js Version im Prompt
```bash
# Sofort sehen welche Node-Version aktiv ist
[nodejs]
format = "[$symbol($version)]($style) "
```

### Workflow 3: Command-Dauer anzeigen
```bash
# Sehen wie lange Claude Code Commands dauern
[cmd_duration]
min_time = 2_000
format = "took [$duration]($style) "
```

> 💡 **Tipp**: Starship zeigt dir automatisch den Git-Status und Branch, sodass du immer weisst in welchem Kontext Claude Code arbeitet.

---

## Troubleshooting

Hier findest du Loesungen fuer die haeufigsten Probleme bei der Nutzung von starship.

### Problem: Icons werden nicht angezeigt

**Symptom**: Zeigt �� statt schöner Icons
```bash
# Prompt zeigt: �� master
```

**Ursache**: Dein Terminal verwendet eine Schriftart, die die benoetigten Nerd-Font-Symbole nicht enthaelt. Starship nutzt spezielle Unicode-Zeichen, die nur in Nerd Fonts verfuegbar sind.

**Lösung**: Nerd Font installieren
```bash
# macOS
brew tap homebrew/cask-fonts
brew install --cask font-fira-code-nerd-font

# Terminal Font ändern zu "FiraCode Nerd Font"

# Test
echo " "  # Sollte Branch-Icon zeigen
```

---

### Problem: starship sehr langsam

**Symptom**: Prompt braucht >200ms zum Rendern
```bash
time starship prompt
# Output: 0.25s
```

**Ursache**: Bestimmte Module wie `package` oder `docker_context` fuehren bei jedem Prompt-Render externe Befehle aus, was in grossen Repositories oder bei langsamen Dateisystemen spuerbar wird.

**Lösung**: Module deaktivieren & Profile
```bash
# Debug-Mode
STARSHIP_LOG=trace starship prompt

# Langsame Module identifizieren und deaktivieren
# ~/.config/starship.toml
[package]
disabled = true

[docker_context]
disabled = true

# Scan-Timeout reduzieren
scan_timeout = 10
```

---

### Problem: Config wird nicht geladen

**Symptom**: Änderungen in starship.toml haben keine Wirkung
```bash
# Config geändert, aber Prompt gleich
```

**Ursache**: Starship sucht die Config-Datei standardmaessig unter `~/.config/starship.toml`. Liegt die Datei an einem anderen Ort oder enthaelt sie Syntaxfehler, werden die Aenderungen ignoriert.

**Lösung**: Config-Path & Reload
```bash
# Check Config-Location
starship config

# Should be: ~/.config/starship.toml

# Verify Config Syntax
starship config check

# Reload Shell
exec $SHELL

# Oder Environment-Variable
export STARSHIP_CONFIG=~/.config/starship.toml
```

---

### Problem: Git-Status langsam in großen Repos

**Symptom**: Prompt-Delay in großen Git-Repos
```bash
cd large-repo
# Prompt rendering dauert Sekunden
```

**Ursache**: Das `git_status`-Modul fuehrt `git diff` und `git status` im Hintergrund aus. In Repos mit vielen Dateien oder grossen Historien kann das mehrere Sekunden dauern.

**Lösung**: Git-Status Timeout setzen
```toml
# ~/.config/starship.toml

[git_status]
disabled = false
ahead_behind = false  # Disable if slow
scan_timeout = 10     # Milliseconds
```

---

### Problem: Colors sehen falsch aus

**Symptom**: Farben nicht wie erwartet
```bash
# Blue sieht aus wie Green
```

**Ursache**: Dein Terminal ist nicht fuer 256 Farben konfiguriert, oder die TERM-Variable ist falsch gesetzt. Starship benoetigt mindestens 256-Color-Unterstuetzung.

**Lösung**: Terminal-Color-Support prüfen
```bash
# Check TERM
echo $TERM
# Should be: xterm-256color

# Set in ~/.bashrc / ~/.zshrc
export TERM=xterm-256color

# Test 256-colors
for i in {0..255}; do
  printf "\x1b[38;5;${i}mcolour${i}\x1b[0m\n"
done
```

---

## Vergleich: starship vs. Alternativen

| Feature | starship | Powerlevel10k | Pure | Agnoster |
|---------|----------|---------------|------|----------|
| **Shell-Support** | All | zsh | zsh/bash | zsh |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Setup-Zeit** | 2 min | 5 min | 2 min | 2 min |
| **Customization** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Config-Format** | TOML | zsh | zsh | zsh |
| **Nerd-Fonts** | ✅ | ✅ | ⚠️ | ⚠️ |
| **Git-Integration** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Cloud-Context** | ✅ | ✅ | ❌ | ❌ |
| **Maintenance** | ✅ Active | ✅ Active | ✅ Active | ⚠️ Less |

### Wann welches Tool?

**starship**:
- Cross-Shell Consistency gewünscht
- Wenn TOML-Config bevorzugt
- Maximum Customization benötigt
- Rust-Ecosystem-Fan

**Powerlevel10k**:
- Nur zsh verwenden
- Maximum Performance kritisch
- Wizard-Config bevorzugt
- Umfangreiches Feature-Set benötigt

**Pure**:
- Minimalistisches Design gewünscht
- Einfaches Setup bevorzugt
- Wenig Dependencies
- Subtile Aesthetics

**Agnoster**:
- Klassisches Powerline-Design
- Bereits Erfahrung damit
- Teil von Oh-My-Zsh
- Keine große Customization benötigt

---

## Links & Ressourcen

### Offizielle Dokumentation
- **Website**: https://starship.rs
- **GitHub**: https://github.com/starship/starship
- **Configuration Docs**: https://starship.rs/config/
- **Presets**: https://starship.rs/presets/

### Installation & Setup
- **Install Script**: https://starship.rs/guide/#-installation
- **Getting Started**: https://starship.rs/guide/
- **FAQ**: https://starship.rs/faq/

### Community
- **Discussions**: https://github.com/starship/starship/discussions
- **Discord**: https://discord.gg/starship

### Nerd Fonts
- **Nerd Fonts Website**: https://www.nerdfonts.com/
- **Font-Downloads**: https://github.com/ryanoasis/nerd-fonts/releases

### Config Examples
- **Community Configs**: https://starship.rs/presets/
- **Dotfiles Examples**: https://github.com/search?q=starship.toml

---

## Pro-Tipps

Fortgeschrittene Techniken fuer Power-User, die das Maximum aus starship herausholen wollen.

### 1. Presets als Basis nutzen

Statt von Null anzufangen, lade ein Preset herunter und passe es dann an deine Beduerfnisse an:

```bash
# Verschiedene Presets testen
starship preset nerd-font-symbols > ~/.config/starship.toml
starship preset pastel-powerline > ~/.config/starship.toml
starship preset bracketed-segments > ~/.config/starship.toml

# Dann customizen
vim ~/.config/starship.toml
```

### 2. Config-Validierung

Starship bietet mehrere Diagnose-Befehle, um Konfigurationsfehler und Performance-Engpaesse zu finden:

```bash
# Syntax-Check
starship config check

# Print Rendered Prompt
starship print-config

# Explain Module
starship explain

# Timings anzeigen
starship timings
```

### 3. Multi-Config Setup

Ueber die Environment-Variable `STARSHIP_CONFIG` kannst du verschiedene Konfigurationen je nach Kontext laden -- etwa fuer Arbeit und persoenliche Projekte:

```bash
# Work-Config
export STARSHIP_CONFIG=~/.config/starship-work.toml

# Personal-Config
export STARSHIP_CONFIG=~/.config/starship-personal.toml

# In ~/.zshrc mit Condition:
if [[ $(pwd) == /work/* ]]; then
  export STARSHIP_CONFIG=~/.config/starship-work.toml
else
  export STARSHIP_CONFIG=~/.config/starship.toml
fi
```

### 4. Custom Module für jeden Use-Case

```toml
# ~/.config/starship.toml

# Claude Code Context
[custom.claude_context]
command = "cat .claude-context 2>/dev/null || echo ''"
when = "test -f .claude-context"
format = "[🤖 $output]($style) "
style = "bold yellow"

# Project Deadline
[custom.deadline]
command = "cat .deadline 2>/dev/null || echo ''"
when = "test -f .deadline"
format = "[⏰ $output]($style) "
style = "bold red"
```

### 5. Integration mit tmux

Starship-Module koennen auch in der tmux-Statusleiste angezeigt werden, sodass du wichtige Informationen auch ohne Prompt sehen kannst:

```bash
# ~/.tmux.conf
set -g status-right '#(starship module directory)#(starship module git_branch) %H:%M'

# Oder vollständig
set -g status-right '#(starship prompt --no-cursor)'
```

---

## Zusammenfassung

**starship** ist der moderne Standard für cross-shell Prompt-Customization:

### Kern-Vorteile:
✅ **Performance**: Sub-millisecond Rendering (Rust)
✅ **Cross-Shell**: Works everywhere (bash, zsh, fish, etc.)
✅ **Smart Context**: Zeigt nur relevante Info
✅ **Customizable**: 100% konfigurierbar via TOML
✅ **Rich Features**: Git, Cloud, Languages, Docker, K8s

### Typische Use Cases:
- 🎨 Beautiful Terminal Aesthetics
- 💻 Development-Context (Git, Languages)
- ☁️ Cloud/DevOps-Context (K8s, AWS, etc.)
- ⚡ Performance-Focused Prompt
- 🔄 Cross-Shell Consistency

### Ergänzt perfekt:
- **zsh**: Modern Shell + Modern Prompt
- **tmux**: Terminal-Multiplexer mit starship-Integration
- **Nerd Fonts**: Icons für Visual-Context
- **Claude Code**: AI-Context in Prompt

### Nächste Schritte:
1. Installiere starship: `brew install starship`
2. Aktiviere in Shell: `eval "$(starship init zsh)"`
3. Wähle Preset: `starship preset nerd-font-symbols`
4. Customize ~/.config/starship.toml
5. Installiere Nerd Font für Icons

**Bottom Line**: `starship` ist unverzichtbar für moderne Terminal-UX. Schnell, schön, informativ, customizable - funktioniert überall.

---

**Weiter zu**: [18. yq - YAML Processor](./18-yq.md)
**Zurück zu**: [16. zsh - Modern Shell](./16-zsh.md)
**Übersicht**: [Tools & Extensions](../TOOLS-EXTENSIONS-INDEX.md)
