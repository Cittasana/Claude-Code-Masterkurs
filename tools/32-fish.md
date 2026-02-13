# Lektion 32: fish - Freundliche Interactive Shell

## 📋 Metadaten
- **Kategorie**: Experten-Tools
- **Schwierigkeit**: Fortgeschritten
- **Zeitaufwand**: 30-45 Minuten
- **Voraussetzungen**: Grundkenntnisse Terminal, Lektion 01 (pwd, cd, ls)
- **Lernziele**: Alternative Shell mit moderner UX verstehen und effizient einsetzen

---

> 🚀 **Claude Code Relevanz**: fish bietet Auto-Suggestions und Syntax-Highlighting, die das interaktive Arbeiten mit Claude Code deutlich beschleunigen -- Befehle werden sofort validiert und History-basiert vorgeschlagen.

## 🎯 Berechtigung

### Was ist fish?

**fish** (Friendly Interactive Shell) ist eine moderne, benutzerfreundliche Shell für die Kommandozeile, die seit 2005 entwickelt wird. Im Gegensatz zu bash oder zsh verfolgt fish eine radikal andere Philosophie: **"Shell out of the box"** – maximale Funktionalität ohne Konfiguration.

### Hauptmerkmale

1. **Auto-Suggestions**: Vorschläge basierend auf History und Tab-Completions
2. **Syntax Highlighting**: Echtzeit-Feedback zu Befehlen (grün = gültig, rot = ungültig)
3. **Web-basierte Config**: GUI für Einstellungen via `fish_config`
4. **Tab Completions**: Umfangreiche Completions für 1000+ Tools out-of-the-box
5. **Keine .fishrc**: Moderne Dateistruktur in `~/.config/fish/`
6. **Smart Scripting**: Sauberere Syntax als bash (keine `$` für Variablen in Strings)

### Installation

fish kann ueber die gaengigen Paketmanager installiert werden. Optional kann es als Default-Shell gesetzt werden, aber zum Testen reicht ein einfaches Starten mit `fish`:

```bash
# macOS mit Homebrew
brew install fish

# Ubuntu/Debian
sudo apt update
sudo apt install fish

# Arch Linux
sudo pacman -S fish

# Als Default Shell setzen (optional)
chsh -s $(which fish)

# Temporär starten (zum Testen)
fish
```

### Versionscheck

Pruefe nach der Installation, ob fish korrekt installiert wurde und wo die Konfigurationsdateien liegen:

```bash
fish --version
# Ausgabe: fish, version 3.7.1

# Konfigurationsverzeichnis prüfen
echo $__fish_config_dir
# Ausgabe: /Users/username/.config/fish
```

---

## 💡 Zwecke

### Wofür fish verwenden?

1. **Interaktive Terminal-Arbeit**
   - Auto-Suggestions für schnellere Eingabe
   - Syntax-Highlighting verhindert Tippfehler
   - Tab-Completions für Befehle und Pfade

2. **Entwickler-Workflow**
   - Git-Integration mit Branches im Prompt
   - Tool-spezifische Completions (npm, cargo, pip, docker)
   - Bessere Error-Messages als bash

3. **Shell-Scripting Alternative**
   - Moderne Syntax ohne `$()` und `$(())`
   - Listen und Strings einfacher zu handhaben
   - Keine Quoting-Hölle wie in bash

4. **Onboarding neuer Entwickler**
   - Keine Konfiguration nötig
   - Selbsterklärende Syntax
   - Weniger Stolperfallen als bash/zsh

5. **System-Administration**
   - Status-Codes im Prompt
   - Farbcodierte Fehler
   - Bessere Tab-Completions für Systembefehle

> ⚠️ **Warnung**: fish ist nicht POSIX-kompatibel -- Bash-Scripts funktionieren hier nicht direkt. Verwende fish fuer interaktive Arbeit und Bash fuer Scripts und CI/CD.

### Wann NICHT fish verwenden?

- **CI/CD Pipelines**: Bash ist Standard, fish nicht POSIX-konform
- **Legacy Scripts**: Bash-Scripts müssen umgeschrieben werden
- **Minimale Umgebungen**: fish hat größere Dependencies als bash
- **Remote-Server**: Oft nicht vorinstalliert (bash ist universal)

**Lösung**: fish für lokale Entwicklung, bash für Scripts und Automation

---

## 🔨 Verwendung

In diesem Abschnitt lernst du fish einzurichten, zu konfigurieren und die wichtigsten Features im Alltag zu nutzen.

### Grundlegende Konfiguration

#### Erste Schritte nach Installation

Nach der Installation kannst du fish sofort starten und die Web-basierte Konfiguration nutzen, um Themes und Prompt-Stile visuell auszuwaehlen:

```bash
# fish starten
fish

# Web-basierte Konfiguration öffnen
fish_config

# Oder direkt Themes ansehen
fish_config theme choose

# Prompt anpassen
fish_config prompt choose
```

#### Konfigurationsdateien

fish verwendet ein Verzeichnis statt einer einzelnen Datei. Funktionen werden als separate Dateien gespeichert und automatisch geladen:

```bash
# Hauptkonfiguration
~/.config/fish/config.fish

# Funktionen (jede Funktion = eigene Datei)
~/.config/fish/functions/

# Completions (Custom Completions)
~/.config/fish/completions/

# Konfigurations-Snippets
~/.config/fish/conf.d/
```

#### Basis config.fish

Die Hauptkonfiguration setzt Umgebungsvariablen, PATH-Erweiterungen und Aliase. Der Prompt kann direkt als Funktion definiert werden, inklusive Git-Branch-Anzeige:

```fish
# ~/.config/fish/config.fish

# Umgebungsvariablen
set -gx EDITOR nvim
set -gx VISUAL nvim
set -gx LANG de_DE.UTF-8

# PATH erweitern
fish_add_path /usr/local/bin
fish_add_path $HOME/.local/bin
fish_add_path $HOME/go/bin

# Aliase (als Funktionen)
alias ll='ls -lah'
alias g='git'
alias k='kubectl'

# Greeting deaktivieren
set fish_greeting

# Vi-Mode aktivieren (optional)
fish_vi_key_bindings

# Farbschema
set fish_color_command green
set fish_color_error red
set fish_color_param cyan

# Prompt mit Git-Integration
function fish_prompt
    set_color blue
    echo -n (prompt_pwd)
    set_color normal

    # Git Branch anzeigen
    if git rev-parse --git-dir > /dev/null 2>&1
        set_color yellow
        echo -n ' ('(git branch --show-current)')'
    end

    set_color green
    echo -n ' λ '
    set_color normal
end
```

> 💡 **Tipp**: Mit `fish_config` oeffnest du eine Web-basierte GUI fuer Themes, Prompts und Farben -- kein manuelles Editieren von Config-Dateien noetig.

### Auto-Suggestions Konfiguration

Auto-Suggestions sind das Kernstueck von fish: Sie schlagen Befehle basierend auf deiner History vor. Du akzeptierst den Vorschlag mit der rechten Pfeiltaste oder ein einzelnes Wort mit Alt+Pfeil-rechts:

```fish
# Auto-Suggestions Farbe anpassen
set fish_color_autosuggestion 555

# History-basierte Suggestions
set fish_autosuggestion_enabled 1

# Suggestion akzeptieren mit →
# (Standard-Keybinding, keine Config nötig)

# Teilweise akzeptieren mit Alt+→
# (akzeptiert nur das nächste Wort)
```

### Variablen in fish

fish verwendet `set` statt `export` und unterscheidet zwischen lokalen, globalen, exportierten und universellen Variablen. Beachte: Listen sind 1-basiert (nicht 0-basiert wie in bash):

```fish
# Variable setzen (lokal)
set myvar "Wert"

# Globale Variable
set -g myvar "Wert"

# Exportierte Variable (für Child-Prozesse)
set -gx PATH /new/path $PATH

# Universal Variable (über Sessions hinweg)
set -U myvar "Wert"

# Variable löschen
set -e myvar

# Variable ausgeben
echo $myvar

# Mehrere Werte (Liste)
set mylist item1 item2 item3
echo $mylist[1]  # item1 (1-basiert!)
```

### Funktionen erstellen

In fish sind Funktionen der bevorzugte Weg fuer wiederverwendbare Logik. Mit `funcsave` wird die Funktion als eigene Datei gespeichert und ist sofort in allen Sessions verfuegbar:

```fish
# Einfache Funktion
function hello
    echo "Hello, $argv[1]!"
end

# Funktion mit Argumenten-Prüfung
function mkcd
    if test (count $argv) -ne 1
        echo "Usage: mkcd <directory>"
        return 1
    end
    mkdir -p $argv[1]
    cd $argv[1]
end

# Funktion in Datei speichern
funcsave mkcd
# Erstellt ~/.config/fish/functions/mkcd.fish
```

---

## 🎓 Best Practices

Diese Best Practices helfen dir, das Beste aus fish herauszuholen und typische Fehler beim Umstieg von bash zu vermeiden.

### 1. **Nutze Auto-Suggestions konsequent**

Auto-Suggestions sparen enorm viel Tipparbeit. Gewoehne dir an, immer zuerst auf den grauen Vorschlag zu schauen, bevor du weitertippst:

```fish
# Tippe "git st" und drücke ↑
# fish zeigt: git status
# Drücke → um zu akzeptieren

# Oder tippe ersten Buchstaben und drücke Tab
g<Tab>
# Zeigt alle Git-Befehle
```

### 2. **Web-basierte Config fuer Themes**

Die Web-basierte Konfiguration ist eines der einzigartigen Features von fish. Der Befehl `fish_config` startet einen lokalen Webserver und oeffnet deinen Browser mit einer grafischen Oberflaeche, in der du Themes, Prompts und Farbschemata visuell auswaehlen kannst. Statt muehsam Hex-Codes in Config-Dateien zu tippen, klickst du einfach auf das Theme, das dir gefaellt. Beliebte Themes sind Dracula, Nord, Solarized und Catppuccin. Die Aenderungen werden sofort uebernommen und in den fish-Konfigurationsdateien gespeichert. Alternativ kannst du ein Theme auch direkt per Kommando setzen.

```fish
# Öffne fish_config
fish_config

# Wähle Theme visuell aus:
# - Dracula
# - Nord
# - Solarized
# - Catppuccin

# Oder direkt per Kommando
fish_config theme choose "Dracula Official"
```

### 3. **Vermeide Bash-isms**

Die groessten Stolperfallen beim Umstieg: fish hat eine eigene Syntax fuer Variablen und Exports. Diese bash-Gewohnheiten muessen umgelernt werden:

```fish
# ❌ Bash-Style (funktioniert nicht in fish)
export PATH=$PATH:/new/path
VAR=value command

# ✅ Fish-Style
set -gx PATH $PATH /new/path
env VAR=value command
```

### 4. **Nutze Funktionen statt Aliase**

Aliase in fish sind eigentlich vereinfachte Funktionen. Fuer Aliase mit Argumenten musst du explizit Funktionen schreiben und mit `funcsave` persistieren:

```fish
# ❌ Alias mit Argumenten (geht nicht)
alias gco='git checkout'

# ✅ Funktion
function gco
    git checkout $argv
end
funcsave gco
```

### 5. **Universal Variables für persistente Settings**

Universal Variables (mit `-U` Flag) werden dauerhaft gespeichert und sind in allen fish-Sessions sofort verfuegbar -- ohne Neustart oder Source noetig:

```fish
# Einmalig setzen, überall verfügbar
set -U my_api_key "abc123"

# In allen fish-Sessions verfügbar
echo $my_api_key
```

### 6. **Teste Scripts mit --debug**

fish bietet eingebaute Debugging-Tools. Mit `--debug` siehst du ausfuehrliche Ausfuehrungsinformationen, mit `fish_trace` wird jede ausgefuehrte Zeile angezeigt:

```fish
# Debugging-Output
fish --debug=all myscript.fish

# Oder interaktiv
set fish_trace 1
source myscript.fish
set fish_trace 0
```

> 🚀 **Beispiel**: Mit `abbr -a gs git status` expandiert fish beim Tippen von `gs` + Leertaste automatisch zu `git status` -- du siehst den vollen Befehl bevor du Enter drueckst.

### 7. **Nutze abbr statt alias**

Abbreviations (abbr) sind in fish die bessere Alternative zu Aliassen. Der entscheidende Unterschied: Wenn du eine Abbreviation tippst und Leertaste drueckst, expandiert fish den Kurzbefehl zum vollen Befehl -- du siehst also genau, was ausgefuehrt wird, bevor du Enter drueckst. Das verhindert Ueberraschungen und hilft beim Lernen der eigentlichen Befehle. In der Shell-History wird der expandierte Befehl gespeichert, nicht die Abbreviation, was die History aussagekraeftiger macht. Abbreviations sind besonders nuetzlich fuer haeufig verwendete Git-Befehle, die du schnell tippen aber vor der Ausfuehrung noch pruefen willst.

```fish
# Abbreviation (expandiert beim Tippen)
abbr -a gs git status

# Tippe "gs" und drücke Space
# Expandiert zu: git status
# Vorteil: Sichtbar vor Enter-Drücken
```

---

## 🔥 Beispiele

### Beispiel 1: Erste Schritte mit Auto-Suggestions

```fish
# fish starten
fish

# Befehl eingeben (wird grün bei gültigen Commands)
cd /tmp

# Anfangen zu tippen, fish schlägt vor
cd /Us
# → Auto-Suggestion: cd /Users/username/
# Drücke → um zu akzeptieren

# History durchsuchen mit ↑/↓
# Dann → um Suggestion zu akzeptieren
```

**Ergebnis**: Schnellere Navigation durch History-basierte Suggestions.

---

### Beispiel 2: Git-Workflow mit fish

```fish
# config.fish mit Git-Prompt
function fish_prompt
    set_color cyan
    echo -n (prompt_pwd)

    if git rev-parse --git-dir > /dev/null 2>&1
        set_color yellow
        set branch (git branch --show-current)
        echo -n " ($branch)"

        # Status-Indicator
        if test (git status --porcelain | wc -l) -gt 0
            set_color red
            echo -n " *"
        end
    end

    set_color green
    echo -n " ❯ "
    set_color normal
end

# Im Git-Repo navigieren
cd ~/projects/myapp
git status
# Prompt zeigt: ~/p/myapp (main) *❯

# Git-Befehle mit Tab-Completion
git <Tab>
# Zeigt alle Git-Befehle mit Beschreibung
```

**Ergebnis**: Git-Status sichtbar im Prompt, bessere Git-Completions.

---

### Beispiel 3: Funktionen für häufige Tasks

```fish
# ~/.config/fish/functions/proj.fish
function proj
    set project_dir ~/projects

    if test (count $argv) -eq 0
        # Alle Projekte anzeigen
        ls $project_dir
    else
        # In Projekt wechseln
        cd $project_dir/$argv[1]
    end
end

# ~/.config/fish/functions/serve.fish
function serve
    set port 8000
    if test (count $argv) -gt 0
        set port $argv[1]
    end
    python -m http.server $port
end

# Verwendung
proj myapp
# Wechselt zu ~/projects/myapp

serve 3000
# Startet Server auf Port 3000
```

**Ergebnis**: Wiederverwendbare Funktionen für tägliche Workflows.

---

### Beispiel 4: Umgebungsvariablen-Management

```fish
# config.fish
function load_env
    if test -f .env
        while read -l line
            if not string match -qr '^\s*#' -- $line
                set -l var (string split -m1 = $line)
                if test (count $var) -eq 2
                    set -gx $var[1] $var[2]
                    echo "Loaded: $var[1]"
                end
            end
        end < .env
    else
        echo "No .env file found"
    end
end

# Im Projektverzeichnis
cd ~/projects/api
load_env
# Lädt alle Variablen aus .env
```

**Ergebnis**: Einfaches Laden von Environment-Variablen aus .env-Dateien.

---

### Beispiel 5: Docker-Workflow mit fish

```fish
# ~/.config/fish/functions/dcu.fish
function dcu
    docker compose up -d $argv
    docker compose logs -f
end

# ~/.config/fish/functions/dcd.fish
function dcd
    docker compose down $argv
end

# ~/.config/fish/functions/dcr.fish
function dcr
    docker compose restart $argv
end

# Verwendung
dcu
# docker compose up -d && logs -f

dcr web
# docker compose restart web
```

**Ergebnis**: Kürzere Commands für Docker Compose.

---

### Beispiel 6: fish mit fzf Integration

```fish
# fzf installieren
brew install fzf

# ~/.config/fish/functions/fcd.fish
function fcd
    set dir (find . -type d | fzf)
    if test -n "$dir"
        cd $dir
    end
end

# ~/.config/fish/functions/fkill.fish
function fkill
    set pid (ps aux | fzf | awk '{print $2}')
    if test -n "$pid"
        kill -9 $pid
    end
end

# Verwendung
fcd
# Fuzzy-Search für Verzeichnisse

fkill
# Fuzzy-Search für Prozesse zum Killen
```

**Ergebnis**: Interaktive Auswahl mit fzf.

---

### Beispiel 7: Abbreviations für häufige Befehle

```fish
# config.fish
abbr -a g git
abbr -a gs git status
abbr -a gc git commit
abbr -a gp git push
abbr -a gl git pull
abbr -a gco git checkout
abbr -a gcb git checkout -b

abbr -a dc docker compose
abbr -a dcu docker compose up -d
abbr -a dcd docker compose down

abbr -a k kubectl
abbr -a kgp kubectl get pods
abbr -a kgs kubectl get services

# Verwendung
gs<Space>
# Expandiert zu: git status

dcu<Space>
# Expandiert zu: docker compose up -d
```

**Ergebnis**: Sichtbare Shortcuts die vor Ausführung expandiert werden.

---

> 💡 **Tipp**: Verwende `fish_add_path` statt manueller PATH-Manipulation -- diese Funktion ist idempotent und fuegt den Pfad nur hinzu, wenn er noch nicht vorhanden ist.

### Beispiel 8: Multi-Language Development Setup

```fish
# config.fish

# Node.js mit nvm
if test -d ~/.nvm
    set -gx NVM_DIR ~/.nvm
    bass source $NVM_DIR/nvm.sh
end

# Python mit pyenv
if command -v pyenv > /dev/null
    pyenv init - | source
end

# Ruby mit rbenv
if command -v rbenv > /dev/null
    rbenv init - | source
end

# Go
set -gx GOPATH $HOME/go
fish_add_path $GOPATH/bin

# Rust
fish_add_path $HOME/.cargo/bin

# Projekt-spezifische Funktion
function dev
    switch (basename (pwd))
        case '*-node'
            nvm use
        case '*-python'
            source venv/bin/activate.fish
        case '*-ruby'
            rbenv local
    end
end
```

**Ergebnis**: Automatisches Setup für verschiedene Sprach-Umgebungen.

---

### Beispiel 9: fish Scripting Beispiel

```fish
#!/usr/bin/env fish

# backup_projects.fish
set backup_dir ~/Backups/(date +%Y-%m-%d)
set source_dirs ~/projects ~/Documents/work

# Backup-Verzeichnis erstellen
mkdir -p $backup_dir

# Projekte durchgehen
for dir in $source_dirs
    if test -d $dir
        echo "Backing up $dir..."
        set dest $backup_dir/(basename $dir)
        rsync -av --progress $dir/ $dest/

        if test $status -eq 0
            echo "✓ $dir backed up successfully"
        else
            echo "✗ Failed to backup $dir"
        end
    end
end

echo "Backup completed: $backup_dir"
```

**Ergebnis**: Lesbares Backup-Script in fish-Syntax.

---

### Beispiel 10: Conditional Prompt mit Status

```fish
# config.fish
function fish_prompt
    # Exit Status der letzten Command
    set last_status $status

    # Username@Host (nur bei SSH)
    if set -q SSH_CONNECTION
        set_color yellow
        echo -n (whoami)@(hostname)' '
    end

    # Working Directory
    set_color blue
    echo -n (prompt_pwd)

    # Git Branch
    if git rev-parse --git-dir > /dev/null 2>&1
        set_color magenta
        echo -n ' '(git branch --show-current)

        # Dirty/Clean Indicator
        if test (git status --porcelain | wc -l) -gt 0
            set_color red
            echo -n ' ✗'
        else
            set_color green
            echo -n ' ✓'
        end
    end

    # Exit Status
    if test $last_status -ne 0
        set_color red
        echo -n " [$last_status]"
    end

    # Prompt Symbol
    set_color normal
    echo -n ' → '
end
```

**Ergebnis**: Informativer Prompt mit Git- und Status-Informationen.

---

### Beispiel 11: fish mit Starship Prompt

```fish
# Starship installieren
brew install starship

# config.fish
starship init fish | source

# ~/.config/starship.toml erstellen
# Konfiguration für Prompt
[character]
success_symbol = "[➜](bold green)"
error_symbol = "[✗](bold red)"

[git_branch]
symbol = "🌱 "

[nodejs]
symbol = "⬢ "

[python]
symbol = "🐍 "

[rust]
symbol = "🦀 "
```

**Ergebnis**: Modernes, schnelles Prompt mit vielen Features.

---

### Beispiel 12: Custom Completions erstellen

```fish
# ~/.config/fish/completions/myapp.fish

# Basic Completion
complete -c myapp -a start -d 'Start the application'
complete -c myapp -a stop -d 'Stop the application'
complete -c myapp -a restart -d 'Restart the application'

# Mit Optionen
complete -c myapp -l port -s p -d 'Port number'
complete -c myapp -l host -s h -d 'Host address'
complete -c myapp -l verbose -s v -d 'Verbose output'

# Dynamische Completions
complete -c myapp -a '(ls ~/.myapp/configs/)' -d 'Config files'

# Nutzung
myapp <Tab>
# Zeigt: start, stop, restart mit Beschreibungen

myapp --<Tab>
# Zeigt: --port, --host, --verbose
```

**Ergebnis**: Custom Tab-Completions für eigene Tools.

---

## 🔗 Integration mit Claude Code

### fish für AI-unterstützte Entwicklung

#### Setup fuer optimale Integration

Dieses Setup optimiert fish fuer die Zusammenarbeit mit Claude Code. Ein einfacher, kopierbarer Prompt stellt sicher, dass Claude Code die Prompt-Ausgabe korrekt parsen kann -- verzichte auf zu viele Sonderzeichen und Unicode im Prompt. Die History-Groesse wird auf 10000 Eintraege erhoehrt, damit Claude Code einen umfangreichen Kontext deiner bisherigen Befehle analysieren kann. Die Funktionen `explain_last` und `suggest_fix` bilden die Grundlage fuer eine AI-Integration, die den letzten Befehl automatisch zur Analyse bereitstellt. Passe die Funktionen an dein spezifisches AI-Tool an.

```fish
# ~/.config/fish/config.fish

# Claude-freundliche Prompt (kopierbar)
function fish_prompt
    echo -n (prompt_pwd)" ❯ "
end

# History-Format für AI-Kontext
set fish_history_max_size 10000

# Funktionen für häufige AI-Workflows
function explain_last
    set cmd (history | head -1)
    echo "Last command: $cmd"
    echo "Asking AI for explanation..."
    # Hier Integration mit AI-Tool
end

function suggest_fix
    set error (history | head -1)
    echo "Error: $error"
    echo "Asking AI for fix..."
    # Hier Integration mit AI-Tool
end
```

#### Workflow-Pattern

Dieser Workflow zeigt das typische Zusammenspiel von fish und Claude Code bei explorativem Development. Du startest fish fuer die besseren Auto-Suggestions, navigierst im Projekt und nutzt die Tab-Completions, um Git-Befehle und Build-Tools schneller einzugeben. Bei Fehlern zeigt der Prompt sofort den Exit-Code an, und du kannst die History als Kontext fuer Claude Code exportieren. Die Kombination aus fish-Suggestions und Claude-Code-Analyse beschleunigt den Entwicklungsprozess erheblich.

```fish
# Schritt 1: Exploratives Development
cd ~/projects/new-feature
fish  # fish starten für bessere Suggestions

# Schritt 2: Auto-Suggestions nutzen
git <Tab>  # Alle Git-Befehle sehen
git commit<Tab>  # Optionen sehen

# Schritt 3: Error Handling
npm run build
# Bei Fehler: fish zeigt Exit-Code im Prompt

# Schritt 4: History für AI-Kontext
history | head -20 > /tmp/context.txt
# Kontext für Claude Code bereitstellen
```

---

## 🤖 Claude Code Integration

### Workflow 1: fish-Funktionen fuer Claude Code Shortcuts

Diese fish-Funktion erstellt einen Shortcut, der Claude Code direkt im richtigen Projekt-Verzeichnis startet. Statt jedes Mal `cd ~/projects/myapp && claude` zu tippen, rufst du einfach `cc myapp` auf. Die Funktion wechselt ins Projektverzeichnis und startet Claude Code, sodass es sofort den richtigen Kontext hat. Speichere die Funktion mit `funcsave cc`, damit sie in allen Sessions verfuegbar ist. Das spart besonders viel Zeit, wenn du haeufig zwischen Projekten wechselst.

```fish
# ~/.config/fish/functions/cc.fish
function cc
    # Claude Code mit Projekt-Kontext starten
    cd ~/projects/$argv[1]
    claude
end
# Verwendung: cc myapp
```

### Workflow 2: History-Export fuer Claude Code Kontext

Diese Funktion exportiert deine letzten 50 Shell-Befehle als Kontext fuer Claude Code. Das ist nuetzlich, wenn du ein Problem hast und Claude Code zeigen willst, was du bereits versucht hast. Die History wird in eine temporaere Datei geschrieben und dann als Argument an Claude Code uebergeben. So kann Claude Code deine bisherigen Schritte analysieren und gezielte Vorschlaege machen, anstatt bei Null anzufangen. Das spart Zeit und fuehrt zu praeziseren Empfehlungen.

```fish
# Letzte 50 Befehle als Kontext fuer Claude Code exportieren
function cc_context
    history | head -50 > /tmp/shell_context.txt
    echo "Kontext exportiert nach /tmp/shell_context.txt"
    claude "Analysiere meine letzten Shell-Befehle: $(cat /tmp/shell_context.txt)"
end
```

### Workflow 3: Automatische Fehleranalyse mit Claude Code

Dieses Setup nutzt das Event-System von fish, um bei fehlgeschlagenen Befehlen automatisch einen Hinweis anzuzeigen. Die `fish_postexec`-Funktion wird nach jedem Befehl aufgerufen und prueft den Exit-Status. Bei einem Fehler schlaegt sie vor, `cc_fix` aufzurufen. Die `cc_fix`-Funktion liest den letzten Befehl aus der History und uebergibt ihn an Claude Code zur Analyse. So bekommst du sofort Hilfe, wenn ein Befehl fehlschlaegt, ohne den fehlgeschlagenen Befehl manuell kopieren zu muessen. Besonders nuetzlich bei kryptischen Fehlermeldungen von Build-Tools oder Paketmanagern.

```fish
# Bei fehlgeschlagenem Befehl automatisch Claude Code fragen
function fish_postexec --on-event fish_postexec
    if test $status -ne 0
        echo "Befehl fehlgeschlagen. Nutze 'cc_fix' fuer AI-Hilfe."
    end
end

function cc_fix
    set last_cmd (history | head -1)
    claude "Der folgende Befehl ist fehlgeschlagen: $last_cmd -- Was ist das Problem?"
end
```

> 💡 **Tipp**: Claude Code kann fish-Funktionen automatisch in `~/.config/fish/functions/` erstellen, die sofort ohne Neustart verfuegbar sind.

## 📺 Video-Tutorial

[Fish Shell - Why You Should Try It](https://www.youtube.com/watch?v=C2a7jJTh3kU)
Kompakte Einfuehrung in die fish Shell mit Auto-Suggestions, Syntax-Highlighting und den wichtigsten Unterschieden zu bash/zsh.

---

## 🐛 Troubleshooting

Hier findest du Loesungen fuer die haeufigsten fish-Probleme. Viele entstehen durch Inkompatibilitaeten mit bash oder durch falsche Konfiguration.

### Problem 1: fish startet langsam

**Symptom**: fish braucht mehrere Sekunden zum Starten

**Ursachen**:
- Zu viele Plugins/Funktionen in config.fish
- Langsame Network-Calls im Prompt
- Viele Autoload-Funktionen

**Lösung**:

Mit Profiling identifizierst du die langsamen Teile deiner Konfiguration. Lazy Loading verlagert teure Initialisierungen auf den Zeitpunkt, an dem sie tatsaechlich gebraucht werden:

```fish
# 1. Profiling aktivieren
fish --profile /tmp/fish-profile.log

# 2. Langsame Teile identifizieren
cat /tmp/fish-profile.log | sort -k2 -n

# 3. Lazy Loading für teure Operations
function load_nvm --on-event fish_prompt
    bass source ~/.nvm/nvm.sh
end

# 4. Prompt-Caching
function fish_prompt
    if not set -q __fish_prompt_cache
        set -g __fish_prompt_cache (expensive_operation)
    end
    echo $__fish_prompt_cache
end
```

---

### Problem 2: Bash-Script funktioniert nicht

**Symptom**: `./script.sh: line 5: syntax error`

**Ursache**: fish ist nicht POSIX-kompatibel

**Lösung**:

```fish
# Option 1: Script mit bash ausführen
bash script.sh

# Option 2: bass-Plugin verwenden
fisher install edc/bass
bass source script.sh

# Option 3: Script nach fish portieren
# Bash:
export VAR=value
if [ -f file ]; then

# Fish:
set -gx VAR value
if test -f file
```

---

### Problem 3: $PATH-Variablen verschwinden

**Symptom**: Commands nicht gefunden nach fish-Neustart

**Ursache**: Falsche Syntax für PATH-Manipulation

**Lösung**:

```fish
# ❌ Falsch (überschreibt PATH)
set PATH /new/path

# ✅ Richtig (erweitert PATH)
set -gx PATH /new/path $PATH

# ✅ Noch besser (fish-native)
fish_add_path /new/path

# Universal Variable für Persistenz
set -U fish_user_paths /new/path $fish_user_paths
```

---

### Problem 4: Completions funktionieren nicht

**Symptom**: Tab-Completions für Tool nicht verfügbar

**Ursache**: Completion-Datei fehlt oder fehlerhaft

**Lösung**:

```fish
# 1. Prüfen ob Completion existiert
complete -C'mycommand '

# 2. Completion-Pfade prüfen
echo $fish_complete_path

# 3. Manuelle Completions laden
source ~/.config/fish/completions/mycommand.fish

# 4. Completions generieren (falls Tool argparse nutzt)
mycommand --help | fish_indent --write-completions
```

---

### Problem 5: fish in CI/CD verwenden

**Symptom**: Pipeline-Script schlägt fehl

**Ursache**: fish meist nicht auf CI-Server installiert

**Lösung**:

```yaml
# GitHub Actions
steps:
  - name: Install fish
    run: |
      sudo apt-add-repository ppa:fish-shell/release-3
      sudo apt update
      sudo apt install fish

  - name: Run fish script
    shell: fish {0}
    run: |
      fish myscript.fish

# Oder: Scripts in bash schreiben für CI
# fish nur lokal für Development nutzen
```

---

## 📊 Vergleich mit Alternativen

| Feature | fish | zsh | bash | nushell |
|---------|------|-----|------|---------|
| **Auto-Suggestions** | ✅ Out-of-box | ⚠️ Plugin | ❌ Nein | ✅ Native |
| **Syntax Highlighting** | ✅ Native | ⚠️ Plugin | ❌ Nein | ✅ Native |
| **Tab Completions** | ✅ 1000+ Tools | ⚠️ Gut | ⚠️ Basic | ✅ Gut |
| **POSIX-Konform** | ❌ Nein | ✅ Ja | ✅ Ja | ❌ Nein |
| **Script-Kompatibilität** | ❌ Eigene Syntax | ✅ sh/bash | ✅ Standard | ❌ Eigene |
| **Konfiguration** | ✅ Web GUI | ⚠️ .zshrc | ⚠️ .bashrc | ⚠️ TOML |
| **Lernkurve** | ✅ Niedrig | ⚠️ Mittel | ⚠️ Mittel | ⚠️ Hoch |
| **Performance** | ✅ Schnell | ✅ Schnell | ✅ Sehr schnell | ✅ Rust-basiert |
| **Verfügbarkeit** | ⚠️ Extra Install | ⚠️ macOS pre | ✅ Universal | ⚠️ Extra Install |
| **Plugin-System** | ✅ Fisher | ✅ Oh My Zsh | ⚠️ Begrenzt | ⚠️ Begrenzt |

### Wann fish?
- ✅ Lokale Development-Umgebung
- ✅ Interaktive Shell-Nutzung
- ✅ Moderne User Experience erwünscht
- ✅ Onboarding neuer Entwickler

### Wann zsh?
- ✅ POSIX-Kompatibilität wichtig
- ✅ Umfangreiches Plugin-Ökosystem (Oh My Zsh)
- ✅ Bash-Script-Kompatibilität nötig
- ✅ macOS Standard-Shell seit Catalina

### Wann bash?
- ✅ Maximale Portabilität
- ✅ CI/CD Pipelines
- ✅ Server-Scripting
- ✅ Keine Konfiguration erwünscht

### Wann nushell?
- ✅ Strukturierte Daten-Pipelines
- ✅ Moderne Sprach-Features
- ✅ Cross-Platform (Windows, macOS, Linux)
- ✅ Experimentierfreudige Entwickler

---

## 🔗 Nützliche Links

### Offizielle Ressourcen
- **Website**: https://fishshell.com/
- **Dokumentation**: https://fishshell.com/docs/current/
- **Tutorial**: https://fishshell.com/docs/current/tutorial.html
- **GitHub**: https://github.com/fish-shell/fish-shell

### Erweiterungen & Plugins
- **Fisher** (Plugin Manager): https://github.com/jorgebucaran/fisher
- **Oh My Fish**: https://github.com/oh-my-fish/oh-my-fish
- **Awesome Fish**: https://github.com/jorgebucaran/awsm.fish

### Themes & Prompts
- **Starship**: https://starship.rs/
- **Tide**: https://github.com/IlanCosman/tide
- **Hydro**: https://github.com/jorgebucaran/hydro

### Tools & Integrations
- **bass** (bash utilities): https://github.com/edc/bass
- **fzf.fish**: https://github.com/PatrickF1/fzf.fish
- **z** (directory jumper): https://github.com/jethrokuan/z

### Learning
- **The fish Cookbook**: https://github.com/jorgebucaran/cookbook.fish
- **fish vs bash**: https://github.com/fish-shell/fish-shell/blob/master/doc_src/fish_for_bash_users.rst
- **Reddit**: https://reddit.com/r/fishshell

---

## 💎 Pro-Tipps

### 1. **Universal Variables fuer Team-Settings**

Universal Variables sind persistente Variablen, die einmal gesetzt werden und in allen fish-Sessions sofort verfuegbar sind -- ohne Neustart, ohne Source, ohne Konfigurationsdatei. Sie eignen sich hervorragend fuer team-weite Einstellungen wie interne Server-Adressen oder Default-Regionen. In diesem Beispiel setzt du einmalig den Git-Server und die AWS-Region als Universal Variables, und jede fish-Session kennt diese Werte automatisch. Das ist besonders praktisch beim Onboarding neuer Teammitglieder: Statt eine lange Konfiguration zu erklaeren, setzt du ein paar Universal Variables und alles funktioniert.

```fish
# Team-weite Einstellungen
set -U company_git_server git.company.com
set -U default_region eu-west-1

# In Funktionen verwenden
function deploy
    aws --region $default_region deploy
end
```

### 2. **Event-basiertes Loading**

Fish unterstuetzt Event-basiertes Loading, bei dem Konfigurationen erst geladen werden, wenn sie tatsaechlich benoetigt werden. In diesem Beispiel wird die Docker-Umgebungsvariable nur gesetzt, wenn ein Befehl ausgefuehrt wird, der mit "docker" beginnt. Das beschleunigt den Shell-Start erheblich, da teure Initialisierungen nicht bei jedem Terminal-Start ausgefuehrt werden, sondern nur on-demand. Der `--on-event fish_preexec` Trigger wird vor jeder Befehlsausfuehrung aufgerufen und prueft den Befehlsinhalt. Nutze dieses Pattern fuer alle Umgebungen, die du nicht in jeder Session brauchst.

```fish
# Lade nur wenn gebraucht
function load_docker --on-event fish_preexec
    if string match -r '^docker' -- $argv[1]
        # Docker-spezifische Env laden
        set -gx DOCKER_HOST unix:///var/run/docker.sock
    end
end
```

### 3. **Private Functions**

Funktionen, die mit zwei Unterstrichen beginnen (__), werden von fish als privat behandelt und erscheinen nicht in der Auto-Completion. Das ist nuetzlich fuer Hilfsfunktionen, die von oeffentlichen Funktionen intern verwendet werden, aber fuer den Benutzer nicht direkt relevant sind. In diesem Beispiel ruft `public_func` die private `__helper`-Funktion auf, aber beim Tippen und Tab-Vervollstaendigen taucht `__helper` nicht in der Vorschlagsliste auf. Das haelt deine Completion-Liste sauber und uebersichtlich.

```fish
# Funktionen mit __ prefix sind private
function __helper
    echo "Internal helper"
end

function public_func
    __helper
end
```

### 4. **Conditional Config basierend auf OS**

Wenn du fish auf mehreren Betriebssystemen verwendest (z.B. macOS zu Hause und Linux auf dem Server), kannst du die Konfiguration automatisch anpassen. Der `switch`-Befehl prueft das Ergebnis von `uname` und setzt betriebssystem-spezifische Variablen und Aliase. Auf macOS verwendest du `open` als Browser und `ls -G` fuer farbige Ausgabe, waehrend Linux `xdg-open` und `ls --color=auto` nutzt. Diese Konfiguration stellst du einmal ein, und sie funktioniert auf allen deinen Rechnern. Committe die config.fish in dein Dotfiles-Repository, um sie ueberall verfuegbar zu haben.

```fish
# config.fish
switch (uname)
    case Darwin  # macOS
        set -gx BROWSER "open"
        alias ls='ls -G'
    case Linux
        set -gx BROWSER "xdg-open"
        alias ls='ls --color=auto'
end
```

### 5. **fish als Default Shell mit Fallback**

Wenn du fish nutzen willst, aber es nicht als System-Default-Shell setzen moechtest (z.B. weil Scripts bash erwarten), kannst du diesen Trick verwenden. Du fuegst den Code in deine bashrc oder zshrc ein, und er prueft ob fish installiert ist. Falls ja, startet er fish mit `exec`, was die aktuelle Shell ersetzt. So startest du immer in fish, aber dein System bleibt offiziell bei bash. Das ist sicherer als `chsh`, weil du bei Problemen einfach die Zeile entfernen kannst, ohne dein Login-System zu beeintraechtigen.

```fish
# In .bashrc oder .zshrc
if command -v fish > /dev/null 2>&1; then
    exec fish
fi
```

### 6. **Debugging mit breakpoint**

fish hat einen eingebauten `breakpoint`-Befehl, der die Ausfuehrung einer Funktion unterbricht und eine interaktive Shell oeffnet. Das ist extrem nuetzlich zum Debugging: Du setzt den Breakpoint an die Stelle, wo du den Zustand inspizieren willst, und kannst dann alle Variablen pruefen, Befehle ausfuehren und das Problem analysieren. Wenn du die interaktive Shell verlaesst (mit exit oder Ctrl+D), setzt die Funktion ihre Ausfuehrung fort. Das ist aehnlich wie ein Debugger in einer Programmiersprache, aber direkt in deiner Shell. Verwende Breakpoints temporaer und entferne sie, wenn du das Problem geloest hast.

```fish
function debug_script
    set -l result (complex_operation)
    breakpoint  # Öffnet interaktive Shell
    echo $result
end
```

### 7. **Persistente Aliases ueber abbr**

Abbreviations mit dem `-g` Flag (global) sind in der aktuellen Session verfuegbar und bleiben ueber Shell-Neustarts bestehen, wenn sie in der config.fish definiert sind. Mit `abbr --show` kannst du alle definierten Abbreviations anzeigen und pruefen, welche aktiv sind. Der Vorteil gegenueber klassischen Aliassen ist die Transparenz: Du siehst immer den vollstaendigen Befehl, bevor du ihn ausfuehrst, und die Shell-History enthaelt den expandierten Befehl. Das erleichtert das Debugging erheblich, da du genau weisst, was tatsaechlich ausgefuehrt wurde.

```fish
# Einmalig setzen
abbr -a -g ll 'ls -lah'
abbr -a -g gst 'git status'

# abbr --show zum Anzeigen aller
abbr --show
```

### 8. **fish_update_completions**

Nach der Installation neuer Tools fehlen oft die Tab-Completions in fish. Der Befehl `fish_update_completions` scannt alle Programme in deinem PATH, liest deren `--help`-Output und generiert automatisch Completion-Dateien. Das funktioniert fuer die meisten CLI-Tools, die eine standardmaessige Hilfe-Ausgabe haben. Fuehre diesen Befehl nach der Installation neuer Tools aus, um sofort von Tab-Completions zu profitieren. Die generierten Completion-Dateien werden in einem System-Verzeichnis gespeichert und sind sofort in allen fish-Sessions verfuegbar.

```fish
# Nach Installation neuer Tools
fish_update_completions

# Scannt $PATH und generiert Completions
# Basierend auf --help Output
```

---

## 📝 Zusammenfassung

### Das Wichtigste zu fish

**fish (Friendly Interactive Shell)** ist eine moderne Shell, die **User Experience über POSIX-Kompatibilität** stellt:

**Kern-Features:**
- ✅ Auto-Suggestions aus History (→ zum Akzeptieren)
- ✅ Syntax Highlighting in Echtzeit (grün = gültig, rot = ungültig)
- ✅ Tab-Completions für 1000+ Tools ohne Konfiguration
- ✅ Web-basierte Config via `fish_config`
- ✅ Moderne Scripting-Syntax ohne `$` in Strings

**Typische Anwendungsfälle:**
1. **Lokale Development**: Schnellere Navigation durch Auto-Suggestions
2. **Onboarding**: Selbsterklärende Syntax für neue Entwickler
3. **Git-Workflows**: Native Git-Integration im Prompt
4. **Docker/Kubernetes**: Bessere Tab-Completions für Container-Tools

**Vorteile gegenüber bash/zsh:**
- Keine Konfiguration nötig für gute UX
- Bessere Error-Messages
- Moderne Syntax (Listen, Strings, Conditionals)
- Web-GUI für Theme-Auswahl

**Nachteile:**
- Nicht POSIX-kompatibel (bash-Scripts müssen portiert werden)
- Nicht standard auf Servern installiert
- Kleineres Ökosystem als zsh (Oh My Zsh)

**Best Practices:**
1. Nutze `abbr` statt `alias` für sichtbare Expansions
2. Speichere Funktionen mit `funcsave` für Persistenz
3. Verwende `fish_add_path` für PATH-Manipulation
4. Universal Variables (`-U`) für persistente Settings
5. fish lokal, bash für CI/CD und Scripts

**Workflow-Muster:**
```fish
# 1. fish als interaktive Shell
fish

# 2. Auto-Suggestions nutzen
cd /Us→  # Akzeptiert Suggestion

# 3. Tab für Completions
git <Tab>  # Zeigt alle Git-Befehle

# 4. Funktionen für Workflows
function dev
    cd ~/projects/$argv[1]
    code .
end
```

**Integration mit Claude Code:**
- Kopierfreundliche Prompts für AI-Kontext
- History-Export für Workflow-Analyse
- Strukturierte Error-Messages für Debugging
- Funktionen als Templates für Code-Gen

**Nächste Schritte:**
1. `brew install fish` und testen
2. `fish_config` für Theme-Auswahl
3. Eigene Funktionen in `~/.config/fish/functions/` erstellen
4. `abbr` für häufige Befehle definieren
5. Fisher installieren für Plugin-Management

**Entscheidungshilfe:**
- **fish verwenden** → Lokale Entwicklung, interaktive Nutzung
- **bash verwenden** → CI/CD, Server-Scripts, maximale Portabilität
- **zsh verwenden** → POSIX + moderne Features, große Plugin-Community

fish ist die richtige Wahl für Entwickler, die eine **moderne, benutzerfreundliche Shell** ohne Konfigurations-Overhead wollen und bereit sind, auf POSIX-Kompatibilität zu verzichten.

---

**Letzte Aktualisierung**: Februar 2026
**Schwierigkeitsgrad**: Fortgeschritten
**Geschätzte Lernzeit**: 30-45 Minuten
**Voraussetzungen**: Terminal-Grundlagen, bash-Kenntnisse hilfreich
