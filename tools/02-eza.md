# 🎨 eza - Modernes ls mit Icons und Git-Integration

**Kategorie**: 🟢 Anfänger-Tools
**Installation**: 5 Minuten
**Skill-Level**: Einfach
**Impact**: Sofort sichtbar

---

> 🚀 **Claude Code Relevanz**: eza gibt dir in Claude Code Sessions sofortigen Ueberblick ueber Projektstrukturen, Git-Status und Dateigroessen - alles in einem Befehl, ohne zwischen Tools wechseln zu muessen.

## ✅ Berechtigung - Warum eza?

### Das Problem mit `ls`
Das klassische Unix-Tool `ls` ist seit 1971 unverändert:
- ❌ Keine Icons für File-Types
- ❌ Keine Git-Status-Integration
- ❌ Schwer lesbare Permissions
- ❌ Keine Tree-View
- ❌ Unleserliche Colors (oft)
- ❌ Keine moderne Terminal-Features

### Die Lösung: eza
`eza` ist ein modernes Replacement für `ls` (Fork von `exa`, das nicht mehr maintained wird):
- ✅ **Icons** für jeden File-Type (📄, 📁, 🐍, ⚛️)
- ✅ **Git-Integration** zeigt Status inline (M, A, ??)
- ✅ **Tree-View** built-in
- ✅ **Lesbare Permissions** mit Colors
- ✅ **Grid-Layout** oder **Long-Format**
- ✅ **Schnell** (in Rust geschrieben)

**Ergebnis**: Du navigierst 3x schneller durch dein Filesystem.

> 💡 **Tipp**: Die Kombination `eza -la --git --icons` ist der wichtigste Befehl - er zeigt dir alles auf einen Blick: Permissions, Git-Status, Icons und versteckte Dateien.

---

## 🎯 Zwecke - Wofür du eza einsetzt

Hier siehst du die fuenf wichtigsten Szenarien, in denen eza dein Standard-`ls` deutlich uebertrifft.

### 1. **Projekt-Struktur auf einen Blick**
Sieh sofort, welche Files wichtig sind:
```bash
eza -la --icons
# → Icons zeigen: JS, TS, JSON, Markdown, etc.
```

### 2. **Git-Status direkt beim Listing**
Keine separaten `git status` mehr:
```bash

eza -la --git
# → Siehst du Modified (M), Added (A), Untracked (??)
```

### 3. **File-Größen verstehen**
Welche Files fressen Speicher?
```bash
eza -lh --sort=size
# → Sortiert nach Größe, human-readable
```

### 4. **Verzeichnis-Bäume visualisieren**
Statt separatem `tree`-Tool:
```bash
eza --tree --level=2
# → Zeigt 2 Ebenen tief
```

### 5. **Zeitstempel-basierte Suche**
Welche Files wurden zuletzt geändert?
```bash
eza -la --sort=modified
# → Neueste zuerst
```

---

## 💻 Verwendung - Wie du eza einsetzt

Von der Installation bis zu fortgeschrittenen Sortier- und Filter-Optionen - hier lernst du alles, um eza produktiv einzusetzen.

### Installation

eza ist auf allen gaengigen Plattformen verfuegbar. Auf neueren Systemen ist es direkt im Paketmanager enthalten.

**macOS (Homebrew)**:
Die schnellste Installation auf macOS:
```bash
brew install eza
```

**Ubuntu 24.04+ (native)**:
```bash
sudo apt install eza
```

**Ubuntu 20.04/22.04 (via cargo)**:
Auf aelteren Ubuntu-Versionen ist eza nicht in den Standard-Repos - du brauchst den Rust-Paketmanager:
```bash
cargo install eza
# Oder: Download Binary von GitHub Releases
```

**Arch Linux**:
```bash
sudo pacman -S eza
```

**Windows (Scoop)**:
```bash
scoop install eza
```

> ⚠️ **Warnung**: Fuer die Icons brauchst du einen Nerd Font in deinem Terminal. Ohne Nerd Font siehst du statt schoener Icons nur kaputte Zeichen. Installiere zuerst z.B. "Hack Nerd Font".

---

### Quick Start (30 Sekunden)

Diese vier Grundbefehle decken 90% deiner taeglichen Nutzung ab.

**Basis-Usage**:
```bash
# Simple Listing (wie ls)
eza

# Long Format mit Icons
eza -la --icons

# Mit Git-Status
eza -la --git

# Tree-View
eza --tree
```

**Wichtigste Flags**:
Diese Flags funktionieren aehnlich wie bei `ls`, bieten aber mehr Kontrolle:
```bash
# -l = Long format (Details)
# -a = All files (inkl. hidden)
# -h = Human-readable sizes (KB, MB, GB)
# -s = Sort by (modified, size, name, etc.)
# -r = Reverse sort
# -d = Directories only
# -f = Files only
```

---

### Advanced Usage

Fuer den fortgeschrittenen Einsatz lohnt es sich, eza als permanenten ls-Ersatz einzurichten und die erweiterten Funktionen zu nutzen.

**1. Als `ls`-Replacement konfigurieren**:
Ersetze `ls` komplett durch eza-Aliases, damit du automatisch immer von Icons und Git-Status profitierst:
```bash
# In ~/.bashrc oder ~/.zshrc:
alias ls='eza --icons'
alias ll='eza -la --icons --git'
alias la='eza -a --icons'
alias lt='eza --tree --level=2 --icons'
```

> 🚀 **Beispiel**: Ersetze `ls` komplett durch eza-Aliases in deiner `.zshrc` - nach einer Woche wirst du nie wieder zum alten `ls` zurueckwollen.

**2. Custom Colors**:
eza nutzt die gleiche Umgebungsvariable wie `ls` fuer Farben, bietet aber zusaetzlich eigene Farboptionen:
```bash
# eza nutzt LS_COLORS Environment Variable
# Oder: Custom Color-Theme
export EZA_COLORS="da=1;34:gm=1;33"
```

**3. Grid-Layout**:
```bash
# Multi-Column Grid
eza --grid --icons

# Long Grid (Details + Grid)
eza -l --grid --icons
```

**4. File-Type Filtering**:
```bash
# Nur Directories
eza -D

# Nur Files
eza -f

# Nur bestimmte Extensions
eza | grep '.js$'
```

**5. Sortierung**:
```bash
# Nach Größe (größte zuerst)
eza -lh --sort=size --reverse

# Nach Änderungsdatum (neueste zuerst)
eza -lh --sort=modified --reverse

# Nach Extension
eza -lh --sort=extension

# Nach Name (default)
eza -lh --sort=name
```

**6. Tree-Mode (Advanced)**:
Der eingebaute Tree-Modus ersetzt das separate `tree`-Tool und bietet zusaetzlich Git-Integration:
```bash
# 3 Ebenen tief
eza --tree --level=3

# Mit Git-Status
eza --tree --git --level=2

# Ignore node_modules
eza --tree --ignore-glob='node_modules'

# Nur Directories im Tree
eza --tree -D --level=2
```

---

## 🏆 Best Practices

Diese Empfehlungen helfen dir, eza optimal in deinen taeglichen Workflow zu integrieren.

### 1. **Standard-Aliases setzen**
Aliases sind der wichtigste Schritt, weil du dann automatisch immer eza statt ls nutzt:
```bash
# In ~/.bashrc oder ~/.zshrc
alias ls='eza --icons'
alias ll='eza -la --icons --git'
alias la='eza -a --icons'
alias lt='eza --tree --level=2 --icons'
alias lS='eza -lh --sort=size --reverse --icons'  # Größte Files
alias lM='eza -lh --sort=modified --reverse --icons'  # Neueste Files
```

### 2. **Git-Status immer anzeigen**
Der groesste Vorteil gegenueber `ls` ist die Git-Integration - so siehst du Modified/Added/Untracked direkt neben dem Dateinamen:
```bash
# In Git-Repos immer mit --git
cd ~/projekt
ll  # (mit alias ll='eza -la --icons --git')
# → Siehst du sofort Modified/Added/Untracked Files
```

### 3. **Tree statt find für Exploration**
Fuer die schnelle Verzeichnis-Exploration ist eza's Tree-Modus lesbarer und schneller als `find`:
```bash
# Statt:
find . -type d -maxdepth 2

# Nutze:
eza --tree --level=2 -D
```

### 4. **Ignore-Patterns für große Projekte**
In JavaScript-Projekten kann `node_modules` die Ausgabe ueberfluten - Ignore-Patterns halten den Output sauber:
```bash
# In ~/.zshrc als Function:
ezat() {
  eza --tree --ignore-glob='node_modules|.git|dist|build' "$@"
}

# Nutzen:
ezat --level=3
```

### 5. **Kombiniere mit anderen Tools**
eza laesst sich hervorragend mit fzf fuer interaktive Auswahl und bat fuer File-Preview kombinieren:
```bash
# Mit fzf (Fuzzy Finder)
eza -a | fzf

# Mit bat (File Preview)
eza -a | fzf --preview 'bat --color=always {}'

# Mit ripgrep
eza | rg 'component'
```

### 6. **Header mit Context**
```bash
# Zeige File-Count
eza -la --icons --header
# → "Showing 42 entries"
```

### 7. **Claude Code Workflows**
In Claude Code Sessions nutzt du eza um die Projektstruktur zu verstehen und Aenderungen im Blick zu behalten:
```bash
# Vor Feature-Development: Projekt-Struktur verstehen
eza --tree --level=3 --icons

# Während Development: Git-Status monitoren
watch -n 2 'eza -la --git --icons'

# Nach Changes: Welche Files geändert?
eza -la --git --sort=modified --icons
```

---

## 📝 Beispiele - Real-World Use-Cases

Diese Praxisbeispiele zeigen eza im taeglichen Einsatz - von der Projektexploration bis zum Dotfiles-Management.

### Beispiel 1: Neues Projekt Exploration

**Szenario**: Du klonst ein Repo, willst Struktur verstehen.

```bash
# 1. Überblick verschaffen
cd ~/projekte/new-saas-app
eza --tree --level=2 --icons

# Output:
# .
# ├── 📁 src
# │   ├── 📁 components
# │   ├── 📁 pages
# │   └── 📄 index.js
# ├── 📁 public
# ├── 📄 package.json
# └── 📄 README.md

# 2. Wichtigste Files identifizieren
eza -lh --sort=size --reverse --icons

# 3. Git-Status checken
eza -la --git --icons
```

**Zeit gespart**: 2 Minuten vs. mehrfache `cd` + `ls` Commands

> 💡 **Tipp**: Nutze `eza --tree --ignore-glob='node_modules|.git' --level=3` als Standard-Befehl, um grosse Projekte ohne Ballast zu ueberblicken.

---

### Beispiel 2: Große Files finden (Disk Space Cleanup)

**Szenario**: Dein Projekt ist 5GB groß, du brauchst Platz.

```bash
# 1. Top-Level: Welche Ordner groß?
eza -lh --sort=size --reverse

# 2. In größten Ordner reingehen
cd node_modules
eza -lh --sort=size --reverse | head -20

# 3. Tree mit Sizes
eza --tree --level=2 -lh --sort=size

# Ergebnis: Du findest:
# - node_modules/webpack: 500MB
# - dist/old-builds: 800MB
# → Kann gelöscht werden
```

**Zeit gespart**: 5 Minuten vs. `du` + `find` Commands

---

### Beispiel 3: Git-Workflow beschleunigen

**Szenario**: Du arbeitest an Feature, viele Files geändert.

```bash
# Klassisch (schlecht):
git status
ls -la

# Mit eza (gut):
eza -la --git --icons

# Output:
# .rw-r--r-- 1.2k user  2 Feb 12:30 M  package.json
# .rw-r--r--  340 user  2 Feb 12:31 M  src/App.jsx
# .rw-r--r--  120 user  2 Feb 12:31 ?? src/NewComponent.jsx
#                                    ^^
#                                    Modified / Untracked

# Sofort sichtbar:
# - M = Modified (git tracked)
# - ?? = Untracked (noch nicht staged)
```

**Produktivität**: +30%, weil du nicht zwischen `ls` und `git status` wechselst

---

### Beispiel 4: Code-Review Vorbereitung

**Szenario**: PR-Review, du willst wissen welche Files betroffen sind.

```bash
# 1. Geänderte Files anzeigen (mit Git-Status)
eza -la --git --sort=modified --reverse --icons

# 2. Tree mit Git-Status (sieh Structure + Changes)
eza --tree --git --level=2 --icons

# 3. Nur Modified Files
eza -a --git | grep '^M'

# Ergebnis: Du siehst:
# - Welche Files geändert
# - In welchen Directories
# - Ob neue Files dabei (Untracked)
```

**Zeit gespart**: 3 Minuten vs. `git diff --name-only` + manuelles nachschauen

---

### Beispiel 5: Dotfiles Management

**Szenario**: Du verwaltest Dotfiles (hidden files) in Home-Directory.

```bash
# Problem: ls -la zeigt zu viel
ls -la ~

# Lösung: eza mit Filter
cd ~
eza -a | grep '^\.'

# Oder: Nur Dotfiles anzeigen
eza -la --icons | grep '^\.'

# Oder: Tree nur für .config
eza --tree --level=2 ~/.config
```

**Resultat**: Du siehst deine Dotfiles übersichtlich mit Icons.

---

### Beispiel 6: Claude Code Session-Logs

**Szenario**: Du hast viele Claude Code Sessions, suchst bestimmtes Log.

```bash
# Logs sortiert nach Datum
eza -lh --sort=modified --reverse ~/claude-code-logs/

# Mit Tree (Sessions → Logs)
eza --tree --level=2 ~/claude-code-logs/

# Neuestes Log direkt öffnen
bat $(eza -1 --sort=modified --reverse ~/claude-code-logs/ | head -1)
```

**Zeit gespart**: 1 Minute vs. manuelles Suchen

---

## 🤖 Claude Code Integration

So nutzt du eza in Kombination mit Claude Code fuer einen effizienten Entwicklungs-Workflow.

### Workflow 1: Projektstruktur analysieren
Vor einer Claude Code Session verschaffst du dir mit eza einen Ueberblick ueber die Projektstruktur:
```bash
# Claude Code Session: eza fuer Projektstruktur-Analyse
eza --tree --level=3 --icons --git-ignore src/
```

### Workflow 2: Geaenderte Files nach Claude Code Edit finden
Nach einem Claude Code Edit sortierst du nach Aenderungsdatum, um sofort zu sehen welche Dateien betroffen sind:
```bash
eza -la --git --sort=modified --reverse src/
```

### Workflow 3: Verzeichnisgroessen fuer Cleanup checken
Um Platzfresser wie node_modules zu identifizieren, zeigst du Verzeichnisse sortiert nach Gesamtgroesse an:
```bash
eza -la --total-size --sort=size node_modules/
```

> 💡 **Tipp**: Claude Code nutzt eza um Projektstrukturen zu verstehen bevor es Code generiert.

---

## 📺 Video-Tutorial

[eza - A Modern ls Replacement (Better Stack Guide)](https://betterstack.com/community/guides/linux/eza-explained/)
Ausfuehrliche Anleitung zu eza mit Installation, Konfiguration und praktischen Beispielen fuer den taeglichen Einsatz im Terminal.

---

## 🔧 Troubleshooting

Hier findest du Loesungen fuer die haeufigsten Probleme bei der Nutzung von eza.

### Problem: "Icons nicht sichtbar (statt Datei-Icons nur kaputte Zeichen)"
Die Icons von eza benoetigen einen sogenannten Nerd Font - das ist ein Font der zusaetzliche Icon-Glyphen enthaelt. Ohne diesen Font kann dein Terminal die Zeichen nicht darstellen.

**Lösung**: Installiere Nerd Font
```bash
# macOS
brew tap homebrew/cask-fonts
brew install font-hack-nerd-font

# Ubuntu
mkdir -p ~/.fonts
cd ~/.fonts
wget https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.0/Hack.zip
unzip Hack.zip
fc-cache -fv

# Terminal-Einstellung: Font auf "Hack Nerd Font" setzen
```

---

### Problem: "eza command not found"
Auf aelteren Ubuntu-Versionen ist eza nicht in den Standard-Repositories enthalten. Du musst es manuell installieren.

**Ubuntu 20.04/22.04**:
```bash
# eza ist nicht in Default-Repos
# Option 1: Via cargo
cargo install eza

# Option 2: Binary von GitHub
wget https://github.com/eza-community/eza/releases/latest/download/eza_x86_64-unknown-linux-gnu.tar.gz
tar -xf eza_x86_64-unknown-linux-gnu.tar.gz
sudo mv eza /usr/local/bin/
```

---

### Problem: "Git-Status zeigt nichts"
Der `--git` Flag funktioniert nur innerhalb eines initialisierten Git-Repositories. Ausserhalb eines Repos wird kein Status angezeigt.

```bash
# Check: Bist du in einem Git-Repo?
git status

# Wenn ja: Nutze --git Flag
eza -la --git

# Wenn nein: Initialisiere Repo
git init
```

---

### Problem: "Tree zu groß (node_modules)"
In JavaScript-Projekten kann der Tree-Output durch node_modules tausende Zeilen lang werden. Mit Ignore-Patterns und Level-Begrenzung behebst du das.

```bash
# Ignore-Patterns nutzen
eza --tree --ignore-glob='node_modules|.git|dist' --level=3

# Oder: Nur Directories
eza --tree -D --level=3

# Oder: Level begrenzen
eza --tree --level=2
```

---

## 📊 eza vs. ls vs. tree - Der Vergleich

| Feature | `ls` | `eza` | `tree` |
|---------|------|-------|--------|
| **Icons** | ❌ | ✅ | ❌ |
| **Git-Status** | ❌ | ✅ | ❌ |
| **Tree-View** | ❌ | ✅ | ✅ |
| **Colors** | ⚠️ Basic | ✅ Modern | ⚠️ Basic |
| **Performance** | 🚀 Fast | 🚀 Fast | 🐌 Slow (große Dirs) |
| **Human-Readable** | ⚠️ -h Flag | ✅ Default | ❌ |
| **Sortierung** | ⚠️ Limited | ✅ Flexibel | ❌ |

**Fazit**: `eza` vereint das Beste aus `ls` und `tree` in einem Tool.

---

## 🔗 Weiterführende Links

### Offizielle Ressourcen
- **GitHub**: https://github.com/eza-community/eza
- **Docs**: https://eza.rocks/
- **Migration von exa**: https://github.com/eza-community/eza/blob/main/INSTALL.md

### Community
- **Discussions**: https://github.com/eza-community/eza/discussions
- **Discord**: https://discord.gg/eza

### Tutorials
- [eza Examples](https://github.com/eza-community/eza/wiki/Examples)
- [Modern Unix Tools](https://github.com/ibraheemdev/modern-unix)

### Verwandte Tools
- **bat**: Syntax Highlighting (kombiniere für File-Preview)
- **fzf**: Fuzzy Finder (nutze eza als Input)
- **tree**: Classic Tree-Tool (eza ist moderner)

---

## 💡 Pro-Tipps

Fortgeschrittene Techniken, um eza noch produktiver einzusetzen.

### 1. **Function für Smart-Listing**
Diese Funktion erkennt automatisch ob du in einem Git-Repo bist und zeigt entsprechend den Git-Status an:
```bash
# In ~/.zshrc
l() {
  if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    # In Git-Repo: Mit Git-Status
    eza -la --icons --git "$@"
  else
    # Nicht in Git-Repo: Nur Icons
    eza -la --icons "$@"
  fi
}
```

### 2. **One-Liner für Project-Overview**
Dieser Befehl kombiniert alle wichtigen Informationen in einer einzigen Ansicht:
```bash
# Zeige Structure + Git + Sizes
eza --tree --git -lh --level=2 --icons
```

### 3. **Integration mit zsh-autosuggestions**
```bash
# eza nutzt Completion
# Autocomplete funktioniert wie bei ls
eza -l <TAB>
```

### 4. **Custom Grid-Width**
```bash
# Für kleine Terminals
eza --grid --grid-rows=10

# Für große Terminals
eza --grid --grid-rows=30
```

---

## 🎯 Zusammenfassung

**eza ist dein neues `ls`** - visueller, schneller, smarter.

**Quick Wins**:
- ✅ Icons für jeden File-Type
- ✅ Git-Status inline
- ✅ Tree-View built-in
- ✅ Bessere Sortierung

**Installation**: 2 Minuten
**Learning Curve**: 5 Minuten
**Produktivität**: +25% beim Navigieren

---

**Nächster Schritt**: Setze die Aliases (siehe Best Practices) und nutze `eza` für die nächsten 7 Tage. Du wirst `ls` vergessen! 🎨

---

**Verwandte Lektionen**:
- [01 - bat](./01-bat.md) - File-Preview (kombiniere mit eza)
- [03 - tree](./03-tree.md) - Dediziertes Tree-Tool
- [12 - fzf](./12-fzf.md) - Fuzzy Finder (nutze eza als Input)

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0
