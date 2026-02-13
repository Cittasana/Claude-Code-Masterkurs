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

Wenn du ein neues Projekt oeffnest oder in ein Verzeichnis wechselst, willst du sofort verstehen welche Dateien vorhanden sind und welche Typen sie haben. eza zeigt dir mit dem `--icons` Flag farbige Icons neben jedem Dateinamen - JavaScript-Dateien bekommen ein JS-Icon, Ordner ein Ordner-Symbol, Markdown-Dateien ein Dokument-Icon. Das macht es visuell viel einfacher, die Struktur zu erfassen als bei einer reinen Textliste. Stell dir vor, du oeffnest ein Verzeichnis mit 30 Dateien - mit eza erkennst du auf einen Blick wo die Source-Dateien, Configs und Dokumentation liegen. Das `-la` Flag zeigt dabei alle Dateien (inkl. versteckte) im Detail-Format mit Berechtigungen, Groesse und Datum an.

```bash
eza -la --icons
# → Icons zeigen: JS, TS, JSON, Markdown, etc.
```

### 2. **Git-Status direkt beim Listing**

Normalerweise musst du `ls` und `git status` separat ausfuehren, um sowohl die Dateiliste als auch den Git-Status zu sehen. Mit eza's `--git` Flag bekommst du beides in einer einzigen Ansicht: Neben jedem Dateinamen erscheint ein Git-Status-Indikator wie M fuer Modified, A fuer Added oder ?? fuer Untracked. Das spart dir den staendigen Wechsel zwischen zwei Befehlen und gibt dir sofortigen Ueberblick ueber den Zustand deines Repositories. Stell dir vor, du hast an mehreren Dateien gleichzeitig gearbeitet und willst wissen, welche noch nicht committed sind - ein einziger Blick auf die eza-Ausgabe genuegt. Besonders in grossen Projekten mit vielen Dateien ist das ein enormer Zeitgewinn.

```bash
eza -la --git
# → Siehst du Modified (M), Added (A), Untracked (??)
```

### 3. **File-Groessen verstehen**

In jedem Projekt gibt es Dateien die unerwartet gross sind - sei es ein vergessener Build-Artefakt, ein hochaufloestes Bild oder ein riesiger Datenbankdump. Mit `eza -lh --sort=size` sortierst du alle Dateien nach Groesse und siehst die Werte in menschenlesbarem Format (KB, MB, GB statt Bytes). So findest du sofort die Platzfresser in deinem Projekt. Stell dir vor, dein Git-Repository ist ploetzlich 500MB gross und du weisst nicht warum - sortiere nach Groesse und du siehst sofort welche Datei das Problem ist. Das ist auch nuetzlich um zu pruefen, ob Build-Artefakte versehentlich im Repository gelandet sind.

```bash
eza -lh --sort=size
# → Sortiert nach Größe, human-readable
```

### 4. **Verzeichnis-Baeume visualisieren**

Oft willst du nicht nur die Dateien im aktuellen Verzeichnis sehen, sondern auch die Struktur der Unterordner. Statt das separate `tree`-Tool zu installieren, bietet eza eine eingebaute Tree-Ansicht mit dem `--tree` Flag. Mit `--level=2` begrenzt du die Tiefe auf zwei Ebenen, was in den meisten Faellen den besten Ueberblick gibt. Stell dir vor, du willst die Ordnerstruktur eines React-Projekts verstehen - mit eza siehst du sofort `src/components/`, `src/pages/`, `src/utils/` und deren Unterordner. Im Gegensatz zum klassischen `tree`-Tool bekommst du bei eza zusaetzlich Icons und optional Git-Status in der Baumansicht.

```bash
eza --tree --level=2
# → Zeigt 2 Ebenen tief
```

### 5. **Zeitstempel-basierte Suche**

Beim Debugging oder nach einer laengeren Pause willst du oft wissen, welche Dateien zuletzt geaendert wurden. Mit `eza -la --sort=modified` sortierst du die Dateiliste nach dem Aenderungsdatum, sodass die zuletzt bearbeiteten Dateien oben stehen. Das ist besonders nuetzlich, wenn du nach einem automatisierten Prozess (z.B. einem Build oder einer Claude Code Session) pruefen willst, welche Dateien betroffen waren. Stell dir vor, ein Kollege hat Aenderungen gepusht und du willst schnell sehen, was sich geaendert hat - sortiere nach modified und du siehst sofort die betroffenen Dateien. Kombiniere das mit `--git` fuer eine noch aussagekraeftigere Ansicht.

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
Die schnellste Installation auf macOS ist ueber Homebrew. Der Befehl laedt das vorkompilierte eza-Binary herunter und richtet alles automatisch ein. Nach der Installation kannst du sofort `eza` im Terminal nutzen. Fuer die Icons brauchst du zusaetzlich einen Nerd Font (siehe Troubleshooting-Sektion). Pruefe mit `eza --version` ob die Installation erfolgreich war.

```bash
brew install eza
```

**Ubuntu 24.04+ (native)**:
Ab Ubuntu 24.04 ist eza in den offiziellen Paket-Repositories enthalten und laesst sich direkt ueber apt installieren. Das ist der einfachste Weg auf neueren Ubuntu-Versionen. Beachte dass aeltere Ubuntu-Versionen (20.04, 22.04) eza nicht in den Standard-Repos haben - fuer diese Versionen siehe die naechste Option. Nach der Installation steht der Befehl `eza` sofort zur Verfuegung. Auch hier brauchst du einen Nerd Font fuer die Icon-Darstellung.

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
Arch Linux bietet eza ueber das offizielle Community-Repository an. Dank Rolling Release bekommst du hier immer die aktuellste Version. Die Installation dauert nur wenige Sekunden, und eza ist danach sofort einsatzbereit. Vergiss nicht, auch einen Nerd Font zu installieren, damit die Icons korrekt angezeigt werden.

```bash
sudo pacman -S eza
```

**Windows (Scoop)**:
Auf Windows installierst du eza am besten ueber den Paketmanager Scoop. Alternativ kannst du das Binary auch manuell von der GitHub-Releases-Seite herunterladen. Beachte dass die Icon-Darstellung auf Windows vom verwendeten Terminal abhaengt - das Windows Terminal bietet die beste Kompatibilitaet. Nach der Installation funktioniert eza in PowerShell und Windows Terminal. Fuer die beste Erfahrung nutze das Windows Terminal mit einem Nerd Font.

```bash
scoop install eza
```

> ⚠️ **Warnung**: Fuer die Icons brauchst du einen Nerd Font in deinem Terminal. Ohne Nerd Font siehst du statt schoener Icons nur kaputte Zeichen. Installiere zuerst z.B. "Hack Nerd Font".

---

### Quick Start (30 Sekunden)

Diese vier Grundbefehle decken 90% deiner taeglichen Nutzung ab.

**Basis-Usage**:
Diese vier Befehle sind die Grundlage fuer den taeglichen Einsatz von eza. Der einfachste Aufruf `eza` ohne Flags zeigt die Dateien im aktuellen Verzeichnis - aehnlich wie `ls`, aber mit modernen Farben. Mit `-la --icons` bekommst du die volle Ansicht: alle Dateien inklusive versteckter, im Detail-Format mit Icons. Der `--git` Flag fuegt Git-Status-Informationen hinzu, und `--tree` zeigt die Verzeichnisstruktur als Baum. Stell dir vor, du wechselst in ein neues Projektverzeichnis und willst sofort verstehen was drin ist - `eza -la --icons --git` gibt dir in einem Befehl alle relevanten Informationen. Am besten legst du dir sofort Aliases an (siehe Best Practices), damit du diese Flags nicht jedes Mal tippen musst.

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
Das Grid-Layout ordnet Dateien in mehreren Spalten an, um den verfuegbaren Platz im Terminal optimal auszunutzen. Das ist besonders nuetzlich wenn du viele kleine Dateien in einem Verzeichnis hast und einen schnellen Ueberblick willst. Mit `eza --grid --icons` bekommst du eine kompakte Darstellung aehnlich wie `ls` in Spalten, aber mit farbigen Icons. Die Kombination `-l --grid` zeigt Details (Groesse, Datum) plus Grid-Layout - ideal fuer Verzeichnisse mit vielen Dateien. Je breiter dein Terminal ist, desto mehr Spalten werden automatisch verwendet.

```bash
# Multi-Column Grid
eza --grid --icons

# Long Grid (Details + Grid)
eza -l --grid --icons
```

**4. File-Type Filtering**:
Manchmal willst du nur bestimmte Dateitypen sehen - zum Beispiel nur Ordner fuer einen Strukturueberblick oder nur JavaScript-Dateien fuer ein Code-Review. Mit `-D` zeigt eza ausschliesslich Verzeichnisse an, mit `-f` nur Dateien. Fuer spezifischere Filter kombinierst du eza mit grep. Stell dir vor, du willst in einem Monorepo nur die Package-Ordner sehen ohne die ganzen Config-Dateien - `eza -D` gibt dir genau das. Das ist schneller als die Ausgabe manuell zu ueberfliegen und relevante Eintraege zu suchen.

```bash
# Nur Directories
eza -D

# Nur Files
eza -f

# Nur bestimmte Extensions
eza | grep '.js$'
```

**5. Sortierung**:
eza bietet flexible Sortieroptionen, mit denen du Dateien nach verschiedenen Kriterien ordnen kannst. Die Sortierung nach Groesse ist ideal um Platzfresser zu finden, die Sortierung nach Aenderungsdatum zeigt dir die zuletzt bearbeiteten Dateien, und die Sortierung nach Extension gruppiert gleichartige Dateien zusammen. Mit dem `--reverse` Flag drehst du die Reihenfolge um, sodass zum Beispiel die groessten Dateien zuerst erscheinen. Stell dir vor, du willst in einem Build-Ordner die groessten generierten Dateien finden - `eza -lh --sort=size --reverse` zeigt sie dir sofort. Die Standard-Sortierung ist alphabetisch nach Name.

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

Der `--header` Flag fuegt eine Kopfzeile ueber der Dateiliste hinzu, die die Spaltennamen anzeigt (Permissions, Size, User, Date Modified, Name). Das macht die Ausgabe lesbarer, besonders fuer Einsteiger die noch nicht wissen welche Spalte was bedeutet. In Kombination mit `-la --icons` bekommst du eine vollstaendige, selbsterklaerende Dateiuebersicht. Stell dir vor, du zeigst einem Kollegen dein Terminal und er soll die Ausgabe verstehen koennen - mit Header ist sofort klar was jede Spalte bedeutet. Besonders bei der Arbeit mit Permissions und Dateigroessen ist der Header hilfreich.

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

Wenn du zsh mit dem Plugin zsh-autosuggestions nutzt, funktioniert die Tab-Completion bei eza genauso wie bei ls. Du tippst `eza -l` und drueckst Tab, und die Shell zeigt dir alle verfuegbaren Flags und Optionen an. Das beschleunigt deinen Workflow erheblich, weil du die Flags nicht auswendig kennen musst. Stell dir vor, du weisst dass es einen Sort-Flag gibt, aber nicht genau wie er heisst - Tab-Completion zeigt dir alle Optionen. Installiere das Completion-Skript fuer eza ueber deinen Plugin-Manager, falls es nicht automatisch verfuegbar ist.

```bash
# eza nutzt Completion
# Autocomplete funktioniert wie bei ls
eza -l <TAB>
```

### 4. **Custom Grid-Width**

Die Grid-Breite von eza passt sich normalerweise automatisch an die Terminalbreite an. Mit dem `--grid-rows` Parameter kannst du die Anzahl der Zeilen im Grid manuell steuern, was bei unterschiedlichen Terminalgroessen hilfreich ist. Bei einem kleinen Terminal-Pane in tmux oder einem Split-Screen willst du weniger Zeilen, bei einem Vollbild-Terminal mehr. Stell dir vor, du arbeitest mit tmux und hast ein schmales Seitenpanel fuer Dateiuebersichten - mit angepasster Grid-Width bekommst du trotzdem eine uebersichtliche Darstellung. Experimentiere mit den Werten, um die optimale Einstellung fuer dein Setup zu finden.

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
