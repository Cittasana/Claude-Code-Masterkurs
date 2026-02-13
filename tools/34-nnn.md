# Lektion 34: nnn - Schneller Terminal File Manager

## 📋 Metadaten
- **Kategorie**: Experten-Tools
- **Schwierigkeit**: Fortgeschritten
- **Zeitaufwand**: 25-35 Minuten
- **Voraussetzungen**: Terminal-Grundlagen, Lektion 01 (pwd, cd, ls)
- **Lernziele**: Ultraschnellen Terminal File Manager mit Plugins effizient nutzen

---

> 🚀 **Claude Code Relevanz**: nnn ist der schnellste Terminal-Dateimanager - navigiere blitzschnell durch grosse Projekte bevor du Claude Code einsetzt.

## 🎯 Berechtigung

### Was ist nnn?

**nnn** (n³) ist ein extrem schneller, minimalistischer Terminal File Manager, geschrieben in C. Die Philosophie: **"The unorthodox terminal file manager"** – maximale Performance bei minimalem Footprint (~100 KB binary, <3000 LOC).

### Hauptmerkmale

1. **Extrem schnell**: C-basiert, <1ms Startup-Zeit
2. **Minimaler Footprint**: ~100 KB Binary, ~1-2 MB RAM
3. **4-Context Mode**: Vier parallele Directory-Views
4. **Plugin-System**: Bash/Shell-Scripts als Plugins
5. **Batch-Operations**: Selections ohne Copy-Paste
6. **Desktop-Integration**: Create links, open in GUI file manager
7. **Portable**: POSIX-konform, läuft überall

### Installation

nnn kann ueber Paketmanager oder direkt aus dem Quellcode installiert werden. Das Kompilieren mit `O_NERD=1` aktiviert Nerd Font Icons fuer eine bessere visuelle Darstellung:

```bash
# macOS mit Homebrew
brew install nnn

# Ubuntu/Debian
sudo apt update
sudo apt install nnn

# Arch Linux
sudo pacman -S nnn

# Oder von Source (neueste Version)
git clone https://github.com/jarun/nnn.git
cd nnn
make O_NERD=1  # Mit Nerd Font icons
sudo make install
```

### Versionscheck

Pruefe welche Version installiert ist und welche Compile-Features aktiv sind. Die `-V` Option zeigt alle aktivierten Build-Flags:

```bash
nnn -v
# Ausgabe: nnn 4.9

# Mit Features
nnn -V
# Zeigt: O_NERD, O_GITSTATUS, O_ICONS, etc.
```

---

## 💡 Zwecke

### Wofür nnn verwenden?

1. **Performance-kritische Navigation**
   - Große Verzeichnisse (10000+ Files)
   - Network-Shares mit Latenz
   - Embedded Systems / Schwache Hardware

2. **Minimale Resource-Umgebungen**
   - Raspberry Pi, Router, NAS
   - Remote Server ohne GUI
   - Alte Hardware mit wenig RAM

3. **Plugin-basierte Workflows**
   - Custom Scripts für File-Processing
   - Integration mit externen Tools (fzf, fd, bat)
   - Automation von File-Tasks

4. **Multi-Context Arbeiten**
   - 4 Verzeichnisse gleichzeitig navigieren
   - Schneller Context-Switch
   - File-Vergleiche zwischen Directories

5. **Desktop-Integration**
   - GUI File Manager aus Terminal öffnen
   - Desktop Notifications
   - Trash-Integration (nicht rm)

### Wann NICHT nnn verwenden?

- **Umfangreiche Previews**: ranger/lf haben bessere Preview-Systeme
- **Vim-Workflows**: ranger ist vim-nativer
- **Einsteiger**: Lernkurve höher als GUI File-Manager
- **Heavy Customization**: Weniger konfigurierbar als ranger

---

## 🔨 Verwendung

Dieser Abschnitt fuehrt dich durch die Navigation, Datei-Operationen und das Plugin-System von nnn. Die Bedienung unterscheidet sich von ranger -- nnn hat eigene Keybindings.

### Erste Schritte

nnn startet sofort und zeigt das aktuelle Verzeichnis. Die Flags `-d` (Detail-View) und `-e` (Editor-Integration) sind fuer den Einstieg empfehlenswert:

```bash
# nnn starten
nnn

# In spezifischem Verzeichnis
nnn ~/projects

# Mit Optionen
nnn -d  # Detail View
nnn -e  # Text files in $EDITOR
nnn -A  # Disable Auto-NNN-CD
```

### Basis-Navigation

Die Navigation folgt dem hjkl-Schema, aber auch Pfeiltasten funktionieren. Das Besondere an nnn sind die 4 Contexts, zwischen denen du mit den Zifferntasten wechselst:

```bash
# Navigation
↑/k    # Hoch
↓/j    # Runter
→/l    # Enter directory / Open file
←/h    # Parent directory
g      # First entry
G      # Last entry
Home   # First entry
End    # Last entry
PgUp   # Page up
PgDown # Page down

# Context-Wechsel
1/2/3/4 # Zu Context 1/2/3/4 wechseln
Tab     # Nächster Context
Shift+Tab # Vorheriger Context

# Extras
~      # Home directory
/      # Start search-as-you-type
Ctrl+J # Filter
```

### File-Operationen

Dateien werden zuerst mit Space markiert (Selection), dann mit Ctrl-Shortcuts verarbeitet. Dieser Zwei-Schritt-Ansatz ermoeglicht flexible Batch-Operationen:

```bash
# Selection & Operations
Space   # Toggle Selection (einzelne Datei)
a       # Select all in directory
m/M     # Show selections / Clear selections

# Nach Selection
Ctrl+X  # Delete selected
Ctrl+P  # Copy selected
Ctrl+V  # Move selected
Ctrl+R  # Rename selected (batch)

# Single-File Operations
^       # Rename (no selection needed)
Ctrl+N  # Create new file/directory
Ctrl+D  # Show details
d       # Show disk usage
```

### Konfiguration: Environment Variables

nnn wird ausschliesslich ueber Umgebungsvariablen konfiguriert -- es gibt keine Config-Datei. Jeder Buchstabe in NNN_OPTS aktiviert eine Option, NNN_PLUG definiert die Plugin-Keybindings:

```bash
# ~/.bashrc / ~/.zshrc / ~/.config/fish/config.fish

# NNN_OPTS: Startup Options
export NNN_OPTS="dEnrx2"
# d = detail mode
# E = internal EDITOR
# n = nav-as-you-type
# r = rollover at top/bottom
# x = notis, sel to system clipboard, show xattr/icon
# 2 = 2 contexts on startup

# NNN_PLUG: Plugin Keybindings
export NNN_PLUG='f:finder;o:fzopen;p:preview-tui;d:diffs;'

# NNN_FIFO: Live Preview
export NNN_FIFO='/tmp/nnn.fifo'

# NNN_COLORS: Color Scheme
export NNN_COLORS='4321'
# Farben für: Context-1/2/3/4

# NNN_FCOLORS: File Type Colors
export NNN_FCOLORS='c1e2272e006033f7c6d6abc4'

# NNN_TRASH: Trash statt rm
export NNN_TRASH=1

# NNN_OPENER: Custom File Opener
export NNN_OPENER=~/.config/nnn/plugins/nuke
```

### 4-Context Mode

```
┌──────────┬──────────┬──────────┬──────────┐
│ Context 1│ Context 2│ Context 3│ Context 4│
│ ~/       │ /tmp/    │ ~/work/  │ (leer)   │
│          │          │          │          │
│ Projects │ download │ client_a │          │
│ > docs   │ test.txt │ reports/ │          │
│ photos/  │ data.csv │ > memo   │          │
└──────────┴──────────┴──────────┴──────────┘

Drücke '1' → Wechselt zu Context 1 (~/Projects)
Drücke '2' → Wechselt zu Context 2 (/tmp/)
```

### Plugins installieren

nnn-Plugins sind einfache Shell-Scripts, die mit dem offiziellen Installer heruntergeladen werden koennen. Plugins werden in nnn mit `;` gefolgt vom zugewiesenen Buchstaben aufgerufen:

```bash
# Plugin-Verzeichnis erstellen
mkdir -p ~/.config/nnn/plugins

# Offizielle Plugins herunterladen
cd ~/.config/nnn/plugins
curl -Ls https://raw.githubusercontent.com/jarun/nnn/master/plugins/getplugs | sh

# Wichtige Plugins:
# - preview-tui: File Preview
# - fzopen: fzf integration
# - finder: fd integration
# - imgview: Image preview
# - diffs: Diff two files
```

---

## 🎓 Best Practices

Die folgenden Best Practices helfen dir, nnn optimal einzurichten und die wichtigsten Workflows zu etablieren.

### 1. **NNN_OPTS für optimale UX**

Diese Kombination von Optionen bietet eine gute Balance aus Informationen und Bedienkomfort. Jeder Buchstabe aktiviert ein Feature:

```bash
# ~/.bashrc
export NNN_OPTS="AdenrUx2"

# A = no autoselect
# d = detail view
# e = open text in $EDITOR
# n = type-to-nav
# r = rollover navigation
# U = show user and group
# x = notis + clipboard
# 2 = 2 contexts on start
```

### 2. **Trash statt Delete**

Standardmaessig loescht nnn Dateien unwiderruflich. Mit NNN_TRASH=1 werden geloeschte Dateien stattdessen in den Papierkorb verschoben und koennen wiederhergestellt werden:

```bash
# trash-cli installieren
brew install trash  # macOS
sudo apt install trash-cli  # Linux

# nnn konfigurieren
export NNN_TRASH=1

# Jetzt: Ctrl+X → Dateien in Trash
# Wiederherstellen: trash-list, trash-restore
```

### 3. **cd-on-quit Feature**

Normalerweise aendert nnn das Arbeitsverzeichnis deiner Shell nicht. Die cd-on-quit-Funktion sorgt dafuer, dass dein Terminal nach dem Beenden von nnn im zuletzt besuchten Verzeichnis steht:

```bash
# ~/.bashrc / ~/.zshrc
n ()
{
    # Block nesting of nnn in subshells
    [ "${NNNLVL:-0}" -eq 0 ] || {
        echo "nnn is already running"
        return
    }

    export NNN_TMPFILE="${XDG_CONFIG_HOME:-$HOME/.config}/nnn/.lastd"

    nnn "$@"

    [ ! -f "$NNN_TMPFILE" ] || {
        . "$NNN_TMPFILE"
        rm -f "$NNN_TMPFILE" > /dev/null
    }
}

# ~/.config/fish/config.fish
function n
    set -l NNN_TMPFILE "$HOME/.config/nnn/.lastd"

    nnn $argv

    if test -e $NNN_TMPFILE
        source $NNN_TMPFILE
        rm $NNN_TMPFILE
    end
end

# Verwendung:
n  # nnn starten, navigieren, q drücken
pwd  # Ist jetzt nnn-Verzeichnis
```

### 4. **Plugin-Keybindings sinnvoll belegen**

Lege die am haeufigsten genutzten Plugins auf leicht erreichbare Tasten. In nnn rufst du Plugins mit `;` gefolgt vom Buchstaben auf:

```bash
# ~/.bashrc
export NNN_PLUG='f:finder;o:fzopen;p:preview-tui;v:imgview;d:diffs;t:treeview;'

# f = Find files with fd
# o = Open with fzf
# p = Preview files
# v = View images
# d = Diff files
# t = Tree view

# In nnn: ; drücken, dann Buchstaben
;f  # Öffnet finder-Plugin
;p  # Öffnet preview
```

### 5. **Smart Filtering**

Mit Ctrl+J aktivierst du den Filter-Modus, der nur Dateien anzeigt die dem Pattern entsprechen. Regex wird unterstuetzt:

```bash
# In nnn
Ctrl+J  # Filter Mode aktivieren
*.py    # Zeigt nur Python-Files
Enter   # Filter aktiv

# Filter löschen
Ctrl+J
Backspace
Enter

# Regex möglich
^test_  # Files die mit test_ starten
\.md$   # Files die mit .md enden
```

### 6. **Batch-Operations effizient**

Der Selection-Workflow in nnn: Zuerst Dateien mit Space markieren, dann die gewuenschte Operation mit Ctrl-Shortcuts ausfuehren. Die Ziel-Verzeichnisse werden ueber Contexts (1-4) gewaehlt:

```bash
# Mehrere Files markieren
Space Space Space  # 3x einzeln

# Oder: Alle markieren
a  # Select all

# Operations
Ctrl+X  # Delete all selected
Ctrl+P  # Copy selected to current dir
Ctrl+V  # Move selected to current dir

# Selektion ansehen
m  # Show selected paths

# Selektion löschen
M  # Clear all selections
```

### 7. **Desktop-Integration**

nnn kann Dateien auch mit GUI-Anwendungen oeffnen, indem du den NNN_OPENER setzt. Auf macOS verwendest du `open`, das die Standard-Anwendung fuer den Dateityp oeffnet (z.B. Preview fuer PDFs, Finder fuer Ordner). Auf Linux nutzt du `xdg-open`, das die in den Desktop-Einstellungen konfigurierte Anwendung startet. In nnn drueckst du einfach `o` auf einer markierten Datei, und sie wird in der zugehoerigen GUI-Anwendung geoeffnet. Das ist besonders nuetzlich fuer Dateitypen, die im Terminal nicht gut darstellbar sind, wie Bilder, Videos oder Office-Dokumente.

```bash
# nnn mit GUI File Manager verbinden

# macOS
export NNN_OPENER=open

# Linux (Nautilus/Thunar/etc.)
export NNN_OPENER=xdg-open

# In nnn: o drücken
# Öffnet Current-File in Default-App
```

---

## 🔥 Beispiele

Die folgenden Beispiele zeigen nnn in typischen Alltagssituationen -- von der einfachen Navigation bis zum Plugin-basierten Workflow.

### Beispiel 1: Erste Schritte

Ein einfacher Einstieg: nnn starten, navigieren und die Detail-Ansicht nutzen. Mit `/` kannst du direkt zum gewuenschten Eintrag springen:

```bash
# nnn starten
nnn

# Navigation
j j j  # 3x runter
l      # In Verzeichnis oder File öffnen
h      # Zurück

# Detail-View aktivieren
d  # Toggle Details (Größe, Datum, Permissions)

# Type-to-Navigate
/pro  # Springt zu erstem "pro*" Entry

# Home
~  # Zu Home-Directory
```

**Ergebnis**: Schnelle Navigation ohne Maus, minimale Keystrokes.

---

### Beispiel 2: 4-Context Workflow

```bash
# nnn mit 4 Contexts starten
export NNN_OPTS="Adenrx4"  # 4 = vier Contexts
nnn

# Context-Setup
1  # Context 1 → ~/projects
2  # Context 2 → ~/Downloads
3  # Context 3 → /tmp
4  # Context 4 → ~/Documents

# Zwischen Contexts wechseln
Tab      # Nächster Context
Shift+Tab # Vorheriger Context

# Files zwischen Contexts kopieren
1        # Zu Context 1
Space    # File markieren
2        # Zu Context 2
Ctrl+P   # Paste (Copy)
```

**Ergebnis**: Vier Verzeichnisse gleichzeitig offen, schneller File-Transfer.

---

### Beispiel 3: Plugin-System nutzen

```bash
# Plugins installieren
mkdir -p ~/.config/nnn/plugins
cd ~/.config/nnn/plugins
curl -Ls https://raw.githubusercontent.com/jarun/nnn/master/plugins/getplugs | sh

# ~/.bashrc
export NNN_PLUG='f:finder;o:fzopen;p:preview-tui;'

# In nnn
;f  # finder-Plugin (fd-basiert)
# Tippe Pattern: main.py
# Enter → Springt zu File

;o  # fzopen-Plugin (fzf-basiert)
# Fuzzy-Search durch Files
# Enter → Öffnet File

;p  # preview-tui-Plugin
# Zeigt Preview im Terminal
```

**Ergebnis**: Fuzzy-Search und Preview direkt in nnn.

---

### Beispiel 4: Bulk-File-Rename

```bash
# Im Verzeichnis mit Bildern
nnn ~/Photos/vacation

# Alle JPGs markieren
Ctrl+J   # Filter
*.jpg
Enter

a        # Select all (gefilterte)

# Bulk-Rename
Ctrl+R   # Batch Rename
# Öffnet Editor mit File-Liste

# Im Editor (vim/nano/etc.):
IMG_001.jpg → vacation_001.jpg
IMG_002.jpg → vacation_002.jpg
# ...

# Speichern und schließen
:wq  # In vim

# nnn führt Umbenennung aus
```

**Ergebnis**: Bulk-Rename mit vollem Editor-Power.

---

### Beispiel 5: Git-Repository-Navigation mit Plugin

```bash
# gitstatus-Plugin aktivieren
# (Erfordert nnn mit O_GITSTATUS compiled)

# Oder manuelles Plugin:
# ~/.config/nnn/plugins/git-status (selbst erstellen)
#!/bin/sh
git -C "$1" status
read -r _

# ~/.bashrc
export NNN_PLUG='g:git-status'

# In Git-Repo navigieren
nnn ~/projects/myapp

# Git-Status ansehen
;g  # Führt git status aus

# Modified Files finden
Ctrl+J
^M  # Regex: Files starting with M (Modified)
```

**Ergebnis**: Git-Workflow integriert in File-Navigation.

---

### Beispiel 6: Image Preview mit imgview

```bash
# Abhängigkeiten
brew install viu  # Terminal Image Viewer
# Oder
sudo apt install w3m w3m-img

# Plugin konfigurieren
export NNN_PLUG='v:imgview'

# In Bild-Verzeichnis
nnn ~/Pictures

# Zu Bild navigieren
j j j  # Zum .jpg

# Image Preview
;v  # Zeigt Bild im Terminal

# Oder: Live Preview mit FIFO
export NNN_FIFO=/tmp/nnn.fifo
nnn &  # Im Hintergrund
# In anderem Terminal:
cat /tmp/nnn.fifo  # Zeigt aktuelle Selektion
```

**Ergebnis**: Bild-Preview ohne GUI-Tool.

---

### Beispiel 7: Diff zwischen zwei Files

```bash
# diffs-Plugin verwenden
export NNN_PLUG='d:diffs'

# Zwei Files zum Vergleichen
nnn ~/projects/app

# Erste Datei markieren
Space  # config_old.json

# Zweite Datei markieren
j Space  # config_new.json

# Diff ausführen
;d  # Öffnet diff in pager

# Oder mit vimdiff
# diffs-Plugin bearbeiten:
#!/bin/sh
vimdiff "$1" "$2"
```

**Ergebnis**: Schneller File-Vergleich ohne separate Tools.

---

### Beispiel 8: Archive-Handling

```bash
# archivemount installieren
brew install archivemount  # macOS
sudo apt install archivemount  # Linux

# Plugin erstellen: ~/.config/nnn/plugins/archive
#!/bin/sh
if [ -f "$1" ]; then
    mkdir -p /tmp/archive_mount
    archivemount "$1" /tmp/archive_mount
    nnn /tmp/archive_mount
    umount /tmp/archive_mount
fi

chmod +x ~/.config/nnn/plugins/archive

# ~/.bashrc
export NNN_PLUG='a:archive'

# .zip Datei markieren
;a  # Mountet und öffnet Archive
```

**Ergebnis**: In Archives navigieren wie in Verzeichnissen.

---

### Beispiel 9: Disk Usage Analysis

```bash
# In nnn
d  # Detail View aktivieren

# Disk Usage berechnen
s  # Sort by size

# Oder mit ncdu-Plugin:
# ~/.config/nnn/plugins/ncdu
#!/bin/sh
ncdu "$1"

export NNN_PLUG='u:ncdu'

# Im Verzeichnis
;u  # Startet ncdu für detailed analysis
```

**Ergebnis**: Platzverschwendung schnell identifizieren.

---

### Beispiel 10: fzf Integration für File-Search

```bash
# fzf installieren
brew install fzf

# fzopen-Plugin (sollte bereits installiert sein)
export NNN_PLUG='o:fzopen'

# In großem Projekt
nnn ~/projects/large-repo

# Fuzzy-Search
;o  # Öffnet fzf
# Tippe: main
# Enter → Springt zu main.py oder main.js
```

**Ergebnis**: Sofortige File-Suche in tiefen Hierarchien.

---

### Beispiel 11: Trash-System Setup

```bash
# trash-cli installieren
brew install trash  # macOS
sudo apt install trash-cli  # Linux

# nnn konfigurieren
export NNN_TRASH=1

# In nnn
Space Space Space  # 3 Files markieren
Ctrl+X            # Delete (geht in Trash)

# Wiederherstellen im Terminal
trash-list        # Zeigt gelöschte Files
trash-restore     # Interactive Restore

# Oder endgültig leeren
trash-empty
```

**Ergebnis**: Sichere Löschungen mit Undo-Option.

---

### Beispiel 12: Custom Opener für verschiedene File-Types

```bash
# ~/.config/nnn/plugins/nuke (Custom Opener)
#!/bin/sh

case "$1" in
    *.md)
        glow "$1" | less -R
        ;;
    *.json)
        jq '.' "$1" | less -R
        ;;
    *.pdf)
        open "$1"  # macOS
        ;;
    *.log)
        tail -f "$1"
        ;;
    *)
        $EDITOR "$1"
        ;;
esac

chmod +x ~/.config/nnn/plugins/nuke

# ~/.bashrc
export NNN_OPENER=~/.config/nnn/plugins/nuke

# In nnn: Enter drücken
# Öffnet Files mit Custom-Logic
```

**Ergebnis**: File-Type-spezifische Opener ohne manuelle Auswahl.

---

## 🔗 Integration mit Claude Code

### nnn für AI-unterstützte Workflows

#### Setup für AI-Kontext-Export

```bash
# Plugin für Context-Export
# ~/.config/nnn/plugins/export-context
#!/bin/sh

output="/tmp/ai_context.txt"

# Current Directory Structure
tree -L 3 "$1" > "$output"

echo "" >> "$output"
echo "=== SELECTED FILES ===" >> "$output"

# Selected Files Content
while read -r file; do
    if [ -f "$file" ]; then
        echo "\n--- $file ---" >> "$output"
        head -50 "$file" >> "$output"
    fi
done < "$NNN_SEL"

echo "Context exported to $output"
read -r _

chmod +x ~/.config/nnn/plugins/export-context

# ~/.bashrc
export NNN_PLUG='e:export-context;'

# In nnn
Space Space Space  # Files markieren
;e                 # Export für AI
```

#### Workflow-Pattern

```bash
# Schritt 1: Projekt-Übersicht
nnn ~/projects/new-feature

# Schritt 2: Wichtige Files markieren
/\.py$  # Python-Files finden
a       # Alle markieren

# Schritt 3: Context exportieren
;e      # Export-Plugin

# Schritt 4: In Claude Code verwenden
# cat /tmp/ai_context.txt | pbcopy
# → In AI-Chat einfügen
```

---

## 🤖 Claude Code Integration

### Workflow 1: Schnelle Projekt-Navigation

nnn ist der schnellste Weg, eine Projektstruktur zu erkunden, bevor du Claude Code einsetzt. Mit dem `-d`-Flag (Detail View) siehst du sofort Dateigroessen, Berechtigungen und Aenderungsdaten. Navigiere durch das src/-Verzeichnis, um die Code-Struktur zu verstehen und identifiziere die Dateien, die Claude Code bearbeiten soll. Die Startzeit von unter einer Millisekunde macht nnn zur perfekten Wahl fuer schnelle Checks zwischendurch. Druecke q, um nnn zu verlassen, und starte Claude Code mit den gewonnenen Erkenntnissen.

```bash
nnn -d src/
```

### Workflow 2: Dateien mit Plugins oeffnen

Mit dem preview-tabbed Plugin bekommst du eine Datei-Vorschau, die den Inhalt der aktuell ausgewaehlten Datei in einem separaten Bereich anzeigt. Du startest nnn mit der NNN_PLUG-Variable, die das Preview-Plugin auf die Taste p legt. In nnn drueckst du dann `;p`, um das Preview-Pane zu aktivieren. Das ist besonders nuetzlich, wenn du schnell den Inhalt mehrerer Dateien inspizieren willst, bevor du entscheidest, welche Claude Code bearbeiten soll. Die Preview aktualisiert sich automatisch, wenn du zu einer anderen Datei navigierst.

```bash
# In nnn: ; fuer Plugin-Menu
# Nutze preview-tabbed fuer Datei-Vorschau
NNN_PLUG='p:preview-tabbed' nnn
```

### Workflow 3: Dateien zwischen Verzeichnissen organisieren

Vor einem Refactoring musst du oft Dateien zwischen Verzeichnissen verschieben oder reorganisieren. Mit nnn markierst du die gewuenschten Dateien mit Space, wechselst zum Ziel-Context und fuegst sie mit Ctrl+V (Move) oder Ctrl+P (Copy) ein. Das `-a`-Flag deaktiviert die automatische Selektion, was bei Batch-Operationen weniger verwirrend ist. Nutze die 4 Contexts, um Quell- und Zielverzeichnisse gleichzeitig offen zu haben. Nach der Reorganisation kann Claude Code auf die neue Struktur angesetzt werden.

```bash
# Selection-Mode: Space zum Markieren, p zum Kopieren
nnn -a
```

> 💡 **Tipp**: nnn ist extrem leichtgewichtig und startet sofort - perfekt fuer schnelle Navigation waehrend Claude Code Sessions.

---

## 🐛 Troubleshooting

Hier findest du Loesungen fuer die haeufigsten nnn-Probleme -- von fehlenden Icons bis zu Performance-Fragen.

### Problem 1: Icons nicht sichtbar

**Symptom**: Komische Zeichen statt Icons

**Ursache**: Kein Nerd Font installiert

**Lösung**:

```bash
# 1. Nerd Font installieren
brew tap homebrew/cask-fonts
brew install --cask font-hack-nerd-font

# 2. Terminal-Font ändern
# iTerm2: Preferences → Profiles → Text → Font: "Hack Nerd Font"
# kitty: ~/.config/kitty/kitty.conf
font_family Hack Nerd Font Mono

# 3. nnn mit Icons neu kompilieren
git clone https://github.com/jarun/nnn.git
cd nnn
make O_NERD=1
sudo make install

# 4. Prüfen
nnn -V | grep O_NERD
```

---

### Problem 2: Plugins funktionieren nicht

**Symptom**: `;` + Buchstabe macht nichts

**Ursache**: NNN_PLUG nicht richtig gesetzt

**Lösung**:

```bash
# 1. NNN_PLUG prüfen
echo $NNN_PLUG

# 2. Plugins existieren?
ls ~/.config/nnn/plugins/

# 3. Plugins ausführbar?
chmod +x ~/.config/nnn/plugins/*

# 4. Test einzelnes Plugin
export NNN_PLUG='f:finder'
nnn
;f  # Sollte jetzt funktionieren

# 5. Debug
# In Plugin-Script am Anfang:
#!/bin/sh
echo "Plugin started with: $1" > /tmp/plugin_debug.log
```

---

### Problem 3: cd-on-quit funktioniert nicht

**Symptom**: Nach `q` bleibt PWD unverändert

**Ursache**: Funktion nicht richtig definiert oder sourced

**Lösung**:

```bash
# 1. Funktion in ~/.bashrc prüfen
type n  # Sollte Funktion zeigen

# 2. ~/.bashrc neu laden
source ~/.bashrc

# 3. NNN_TMPFILE existiert?
echo $NNN_TMPFILE
ls -la ~/.config/nnn/.lastd

# 4. Test
n  # nnn starten
~  # Zu Home
q  # Beenden
pwd  # Sollte Home sein
```

---

### Problem 4: Langsame Performance in großen Dirs

**Symptom**: nnn hängt bei 10000+ Files

**Ursache**: Detail-View oder Git-Status-Checks

**Lösung**:

```bash
# 1. Detail-View ausschalten
d  # In nnn toggled Details

# 2. Git-Status disablen (wenn O_GITSTATUS aktiv)
# nnn ohne O_GITSTATUS neu kompilieren

# 3. LANG=C für Speedup
LANG=C nnn

# 4. Oder: NNN_OPTS anpassen
export NNN_OPTS="Aenrx"  # Kein 'd' für Detail
```

---

### Problem 5: Trash-System schlägt fehl

**Symptom**: Ctrl+X löscht sofort statt Trash

**Ursache**: trash-cli nicht installiert oder NNN_TRASH=0

**Lösung**:

```bash
# 1. trash-cli installieren
which trash-put  # Sollte vorhanden sein
# Falls nicht:
brew install trash  # macOS
sudo apt install trash-cli  # Linux

# 2. NNN_TRASH setzen
export NNN_TRASH=1

# 3. nnn neu starten
n

# 4. Test
Ctrl+X  # Sollte jetzt in Trash verschieben

# 5. Prüfen
trash-list
```

---

## 📊 Vergleich mit Alternativen

| Feature | nnn | ranger | lf | Midnight Commander |
|---------|-----|--------|----|--------------------|
| **Performance** | ✅ C (sehr schnell) | ⚠️ Python (langsam) | ✅ Go (schnell) | ✅ C (schnell) |
| **Binary Size** | ✅ ~100 KB | ⚠️ ~10 MB | ✅ ~4 MB | ⚠️ ~2 MB |
| **RAM Usage** | ✅ 1-2 MB | ⚠️ 15-30 MB | ✅ 5-10 MB | ✅ 3-5 MB |
| **Startup Zeit** | ✅ <1ms | ⚠️ ~200ms | ✅ ~50ms | ✅ ~100ms |
| **Plugin System** | ✅ Shell Scripts | ✅ Python | ✅ Go | ⚠️ Begrenzt |
| **Preview** | ⚠️ Via Plugins | ✅ Native | ✅ Native | ⚠️ Text only |
| **Keybindings** | ⚠️ Custom | ✅ Vim-like | ✅ Vim-like | ⚠️ F-Keys |
| **Contexts** | ✅ 4-Context | ❌ Tabs | ✅ Tabs | ✅ 2-Panel |
| **Learning Curve** | ⚠️ Mittel | ⚠️ Mittel (vim) | ⚠️ Mittel | ✅ Niedrig |
| **Customization** | ⚠️ Env Vars | ✅ Umfangreich | ✅ Gut | ⚠️ INI |

### Wann nnn?
- ✅ Performance absolut kritisch
- ✅ Minimale Resources (Embedded, Server)
- ✅ 4-Context Workflow
- ✅ Plugin-basierte Workflows

### Wann ranger?
- ✅ Umfangreiche Previews nötig
- ✅ Vim-Keybindings bevorzugt
- ✅ Python-Customization erwünscht
- ✅ Image-Preview wichtig

### Wann lf?
- ✅ Balance zwischen Speed und Features
- ✅ Go-basiert bevorzugt
- ✅ Moderne Alternative zu ranger
- ✅ Gute Performance + Previews

### Wann Midnight Commander?
- ✅ F-Key-Workflows
- ✅ Zwei-Panel-Layout
- ✅ FTP/SFTP Built-in
- ✅ Klassische Norton Commander UX

---

## 🔗 Nützliche Links

### Offizielle Ressourcen
- **GitHub**: https://github.com/jarun/nnn
- **Wiki**: https://github.com/jarun/nnn/wiki
- **Plugins**: https://github.com/jarun/nnn/tree/master/plugins

### Tutorials
- **Arch Wiki**: https://wiki.archlinux.org/title/Nnn
- **Video Tutorial**: https://www.youtube.com/watch?v=U2n5aGqou9E
- **Blog Post**: https://www.youtube.com/watch?v=qCe4K_L6TtE

### Integration
- **fzf**: https://github.com/junegunn/fzf
- **fd**: https://github.com/sharkdp/fd
- **bat**: https://github.com/sharkdp/bat
- **trash-cli**: https://github.com/andreafrancia/trash-cli

### Community
- **Reddit**: https://reddit.com/r/nnn
- **Discord**: Siehe GitHub README

---

## 💎 Pro-Tipps

### 1. **Auto-CD Setup perfektionieren**

Die erweiterte cd-on-quit-Funktion ist eines der wichtigsten Setups fuer nnn. Ohne sie aendert nnn dein Arbeitsverzeichnis nicht -- du landest nach dem Beenden wieder dort, wo du gestartet hast. Die Funktion prueft zuerst, ob nnn bereits in einer verschachtelten Instanz laeuft (NNNLVL), um Probleme zu vermeiden. Nach dem Beenden liest sie den zuletzt besuchten Pfad aus einer temporaeren Datei und wechselt dorthin. Die Aliases `nf` und `nd` starten nnn direkt in haeufig besuchten Verzeichnissen und sparen weiteres Tippen.

```bash
# ~/.bashrc - Enhanced Version
n() {
    [ "${NNNLVL:-0}" -eq 0 ] || {
        echo "nnn is already running"
        return
    }

    export NNN_TMPFILE="${XDG_CONFIG_HOME:-$HOME/.config}/nnn/.lastd"

    # Mit zusätzlichen Optionen
    nnn -d "$@"

    if [ -f "$NNN_TMPFILE" ]; then
        . "$NNN_TMPFILE"
        rm -f "$NNN_TMPFILE"
    fi
}

# Alias für schnelleren Start
alias nf='n ~/projects'  # Files-Shortcut
alias nd='n ~/Downloads'  # Downloads-Shortcut
```

### 2. **Plugin-Keybindings nach Haeufigkeit**

Die Belegung der Plugin-Tasten sollte nach Nutzungshaeufigkeit erfolgen. Lege die am meisten genutzten Plugins (finder, fzopen, preview) auf einfach erreichbare Einzelbuchstaben. Weniger haeufig genutzte Plugins koennen auf Shift-Kombinationen gelegt werden. In nnn rufst du Plugins mit `;` gefolgt vom zugewiesenen Buchstaben auf. Nach einiger Zeit wird das Muskelgedaechtnis die wichtigsten Plugin-Aufrufe automatisieren. Passe die Belegung an, sobald du merkst, welche Plugins du am haeufigsten verwendest.

```bash
# Meistgenutzte Plugins auf einfache Keys
export NNN_PLUG='f:finder;o:fzopen;p:preview-tui;v:imgview;d:diffs;t:treeview;'

# f/o/p = High-Frequency (ein Finger)
# v/d/t = Medium-Frequency (ein Finger)

# Weniger genutzte auf Shift-Keys
export NNN_PLUG='f:finder;F:bulkrename;'
```

### 3. **Smart Trash-Workflow**

Ein durchdachter Trash-Workflow schuetzt vor versehentlichem Datenverlust und haelt gleichzeitig den Speicherplatz sauber. Die Aliase `tl` (list mit fzf fuer Fuzzy-Suche), `tr` (restore) und `te` (empty) machen das Trash-Management schnell und komfortabel. Der Cronjob leert automatisch alle Dateien, die aelter als 30 Tage sind, sodass der Papierkorb nicht endlos waechst. Mit NNN_TRASH=1 geht jede Loeschung in nnn automatisch in den Trash statt direkt auf die Festplatte. Das gibt dir ein Zeitfenster, um versehentlich geloeschte Dateien wiederherzustellen.

```bash
# ~/.bashrc
export NNN_TRASH=1

# Alias für Trash-Management
alias tl='trash-list | fzf'
alias tr='trash-restore'
alias te='trash-empty'

# Auto-Trash-Cleanup (30 Tage)
# Cron-Job:
# 0 2 * * * trash-empty 30
```

### 4. **Context-Hotkeys fuer Projekte**

Mit Shell-Aliases kannst du nnn direkt in haeufig besuchten Verzeichnissen starten, ohne jedes Mal den Pfad eingeben zu muessen. Das Plugin-Script im Beispiel setzt alle 4 Contexts beim Start auf vordefinierte Verzeichnisse, sodass du sofort zwischen Projekten, Downloads, temporaeren Dateien und Dokumenten wechseln kannst. Die einfachere Alternative sind Shell-Aliases wie `np` fuer das Projekt-Verzeichnis und `nd` fuer Downloads. Waehle die Methode, die zu deinem Workflow passt.

```bash
# Plugin: project-contexts
# ~/.config/nnn/plugins/projects
#!/bin/sh

# Setze Contexts für Projekt-Workflow
nnn -C 1:"$HOME/projects" \
    -C 2:"$HOME/Downloads" \
    -C 3:"/tmp" \
    -C 4:"$HOME/Documents"

# Oder als Shell-Alias
alias np='nnn "$HOME/projects"'
alias nd='nnn "$HOME/Downloads"'
```

### 5. **Batch-Operations mit External Editor**

Dieses Setup erlaubt es dir, die Liste der markierten Dateien in deinem Editor zu bearbeiten. Die NNN_SEL-Variable zeigt auf die Datei, die die Pfade aller markierten Dateien enthaelt. Ein Plugin oeffnet diese Datei in vim, wo du die Pfade bearbeiten, umbenennen oder loeschen kannst. Das ist maechtig fuer komplexe Batch-Operationen, die ueber einfaches Kopieren und Verschieben hinausgehen. Stell dir vor, du musst 50 Dateien nach einem bestimmten Pattern umbenennen: Du markierst sie, oeffnest die Liste in vim und nutzt vim-Makros fuer die Umbenennung.

```bash
# Selections in vim bearbeiten
# ~/.bashrc
export NNN_SEL='/tmp/.nnnsel'

# Plugin: edit-selection
#!/bin/sh
$EDITOR "$NNN_SEL"

# In nnn
Space Space Space  # Markieren
;e                 # Edit in vim
# Pfade bearbeiten, speichern
# nnn verwendet neue Liste
```

### 6. **Live Preview mit Second Terminal**

```bash
# Terminal 1
export NNN_FIFO=/tmp/nnn.fifo
mkfifo /tmp/nnn.fifo
nnn

# Terminal 2
# ~/.config/nnn/plugins/preview-tabbed
#!/bin/sh
FIFO="$1"

# Watch FIFO and preview
while read -r selection < "$FIFO"; do
    clear
    bat --color=always "$selection"
done

# Oder mit tmux:
tmux split-window -h 'cat /tmp/nnn.fifo | bat'
```

### 7. **Bookmarks via Environment**

```bash
# ~/.bashrc
export p="$HOME/projects"
export d="$HOME/Downloads"
export c="$HOME/.config"

# In nnn
# Ctrl+G (oder custom key) um bookmark-Liste zu zeigen
# Oder direkt starten:
nnn $p  # Öffnet projects
```

### 8. **Performance Tuning für Huge Directories**

```bash
# LANG=C für Speed
export LANG=C

# NNN_OPTS ohne teure Features
export NNN_OPTS="Aenrx"  # Kein 'd' (detail), kein git

# Bei riesigen Dirs (>100k files):
LANG=C nnn -S  # -S = du (disk usage) caching
```

---

## 📝 Zusammenfassung

### Das Wichtigste zu nnn

**nnn (n³)** ist ein **ultra-schneller, minimalistischer Terminal File Manager**, optimiert für **Performance und Low-Resource-Umgebungen**:

**Kern-Features:**
- ✅ Extrem schnell (C-basiert, <1ms Startup)
- ✅ Minimal Footprint (~100 KB Binary, 1-2 MB RAM)
- ✅ 4-Context Mode für parallele Navigation
- ✅ Plugin-System (Shell-Scripts)
- ✅ Trash-Integration (kein rm)
- ✅ Desktop-Integration (GUI-Opener)

**Typische Anwendungsfälle:**
1. **Performance-kritische Navigation**: Große Verzeichnisse, Network-Shares
2. **Embedded Systems**: Raspberry Pi, Router, NAS
3. **Multi-Context Workflows**: Vier Directories gleichzeitig
4. **Plugin-basierte Automation**: Custom Scripts für File-Tasks

**Vorteile:**
- Schnellster Terminal File Manager
- Läuft überall (POSIX-konform)
- Minimale Dependencies
- Flexible durch Plugins

**Nachteile:**
- Weniger Previews als ranger/lf
- Custom Keybindings (nicht vim-native)
- Plugins müssen selbst geschrieben werden
- Steilere Lernkurve

**Essential Operations:**
```bash
hjkl       # Navigation
Space      # Select file
a          # Select all
Ctrl+X/P/V # Delete/Copy/Move
1/2/3/4    # Switch contexts
d          # Detail view toggle
;          # Plugin-Prefix
```

**Essential Config:**
```bash
export NNN_OPTS="Adenrx2"  # Startup options
export NNN_PLUG='f:finder;o:fzopen;p:preview-tui;'
export NNN_TRASH=1  # Trash statt rm
export NNN_FIFO=/tmp/nnn.fifo  # Live Preview
```

**Best Practices:**
1. cd-on-quit Function einrichten
2. Trash-System aktivieren (NNN_TRASH=1)
3. fzf/fd Plugins für Fuzzy-Search
4. 4-Context für parallele Workflows
5. Custom Plugins für repetitive Tasks

**Workflow-Muster:**
```bash
n  # nnn mit cd-on-quit starten
1  # Context 1
j j j  # Navigate
Space  # Mark files
2  # Context 2
Ctrl+P # Paste
q  # Quit (PWD ändert sich)
```

**Integration mit Claude Code:**
- Context-Export Plugins für AI
- Selection-Export für Prompt-Engineering
- Tree-View für Codebase-Overview
- Custom-Plugins für AI-Workflows

**Alternativen:**
- **ranger**: Umfangreichere Previews, vim-Keybindings
- **lf**: Balance Speed/Features, Go-basiert
- **Midnight Commander**: F-Keys, klassische UX

**Entscheidungshilfe:**
- **nnn verwenden** → Performance kritisch, minimale Resources, 4-Context-Workflow
- **ranger verwenden** → Umfangreiche Previews, vim-Workflows, Python-Customization
- **lf verwenden** → Gute Balance, moderne Features, Go-Ökosystem

nnn ist die richtige Wahl für **Performance-bewusste Entwickler**, die einen **blitzschnellen File Manager** mit **minimalem Footprint** und **Plugin-Flexibilität** suchen.

---

**Letzte Aktualisierung**: Februar 2026
**Schwierigkeitsgrad**: Fortgeschritten
**Geschätzte Lernzeit**: 25-35 Minuten
**Voraussetzungen**: Terminal-Grundlagen, File-Management-Konzepte