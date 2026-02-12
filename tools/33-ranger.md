# Lektion 33: ranger - Terminal File Manager (vim-like)

## 📋 Metadaten
- **Kategorie**: Experten-Tools
- **Schwierigkeit**: Fortgeschritten
- **Zeitaufwand**: 30-45 Minuten
- **Voraussetzungen**: Terminal-Grundlagen, vim-Basics (hjkl), Lektion 01 (ls, cd)
- **Lernziele**: Effizienten Terminal File Manager mit vim-Keybindings nutzen

---

> 🚀 **Claude Code Relevanz**: ranger gibt dir visuelle Datei-Navigation im Terminal - ideal um vor Claude Code Sessions die Projektstruktur zu erkunden.

## 🎯 Berechtigung

### Was ist ranger?

**ranger** ist ein vim-inspirierter Terminal File Manager, der seit 2009 in Python entwickelt wird. Die Philosophie: **"Minimalistic file manager with vim-like keybindings"** – maximale Effizienz durch Tastatur-Navigation.

### Hauptmerkmale

1. **Vim-Keybindings**: hjkl für Navigation, dd für Delete, yy für Copy
2. **Drei-Spalten-Layout**: Parent-Dir | Current-Dir | Preview
3. **File Previews**: Text, Code, Bilder, Videos, PDFs, Archive
4. **Bulk Operations**: Markieren und Batch-Operationen
5. **Customizable**: rc.conf, rifle.conf, scope.sh für Anpassungen
6. **Image Preview**: Terminal-Unterstützung für Bilder (mit w3m, kitty, iterm2)

### Installation

ranger wird ueber die gaengigen Paketmanager installiert. Fuer Bildvorschau im Terminal ist zusaetzlich w3m noetig:

```bash
# macOS mit Homebrew
brew install ranger

# Ubuntu/Debian
sudo apt update
sudo apt install ranger

# Arch Linux
sudo pacman -S ranger

# Mit Image-Preview Support
brew install w3m  # macOS
sudo apt install w3m-img  # Ubuntu
```

### Versionscheck und Konfiguration

Beim ersten Start generierst du mit `--copy-config=all` die Konfigurationsdateien, die du anschliessend anpassen kannst:

```bash
ranger --version
# Ausgabe: ranger 1.9.3

# Erstelle Config-Dateien
ranger --copy-config=all

# Konfigurationsverzeichnis
ls ~/.config/ranger/
# commands.py  rc.conf  rifle.conf  scope.sh
```

---

## 💡 Zwecke

### Wofür ranger verwenden?

1. **Schnelle File-Navigation**
   - Vim-Keybindings für Power-User
   - Keine Maus nötig
   - Schneller als `cd` und `ls`

2. **Bulk-File-Operations**
   - Mehrere Dateien markieren (Space)
   - Batch-Delete, Batch-Copy, Batch-Move
   - Regex-basierte Selections

3. **File-Preview**
   - Syntax-Highlighting für Code
   - Bildvorschau im Terminal
   - PDF-Text-Extraktion
   - Archive-Inhalte anzeigen

4. **Projekt-Navigation**
   - Repository-Struktur überblicken
   - Schnell zwischen Dateien springen
   - Preview-Fenster für Code-Review

5. **System-Administration**
   - Log-Dateien durchsuchen
   - Config-Dateien bearbeiten
   - System-Verzeichnisse navigieren

### Wann NICHT ranger verwenden?

- **GUI-Workflows**: Drag & Drop, visuelle Vorschau besser in Finder/Nautilus
- **Große Bulk-Operations**: `find` + `xargs` oft performanter
- **Komplexe Pfad-Operationen**: Shell-Scripts bieten mehr Flexibilität
- **Team-Onboarding**: Höhere Lernkurve als GUI File Manager

---

## 🔨 Verwendung

Dieser Abschnitt fuehrt dich durch die Navigation, Datei-Operationen und Konfiguration von ranger. Wenn du vim-Keybindings kennst, wirst du dich sofort zurechtfinden.

### Basis-Navigation (Vim-Style)

Die Navigation funktioniert genau wie in vim: h/j/k/l fuer links/runter/hoch/rechts. In ranger bedeutet links "Verzeichnis hoch" und rechts "Verzeichnis rein" oder "Datei oeffnen":

```bash
# ranger starten
ranger

# Im aktuellen Verzeichnis
ranger .

# In spezifischem Verzeichnis
ranger ~/projects

# Navigation
h     # Verzeichnis hoch (links)
j     # Datei/Ordner runter
k     # Datei/Ordner hoch
l     # Verzeichnis rein (rechts) / Datei öffnen
gg    # Zum Anfang
G     # Zum Ende
```

### Drei-Spalten-Layout verstehen

```
┌────────────┬────────────┬────────────┐
│ Parent     │ Current    │ Preview    │
│            │            │            │
│ /home/user │ projects/  │ [Code]     │
│            │            │            │
│ Documents  │ myapp/     │ import x   │
│ Downloads  │ > README   │ def main   │
│ projects   │   src/     │ ...        │
│            │   tests/   │            │
└────────────┴────────────┴────────────┘

Linke Spalte:   Übergeordnetes Verzeichnis
Mittlere Spalte: Aktuelles Verzeichnis (Fokus)
Rechte Spalte:   Preview des markierten Items
```

### Grundlegende Operationen

Die Operationen folgen dem vim-Muster: yy zum Kopieren, dd zum Ausschneiden, pp zum Einfuegen. Mit Space markierst du einzelne Dateien fuer Batch-Operationen:

```bash
# File/Folder Operations
yy    # Yank (Copy) - markierte Dateien kopieren
dd    # Cut (Delete prep) - markierte Dateien ausschneiden
pp    # Paste - einfügen
dD    # Delete - endgültig löschen (mit Bestätigung)

# Markieren
Space # Datei markieren/unmarkieren
v     # Alle Dateien markieren
uv    # Alle Markierungen aufheben
V     # Visual Mode (wie in vim)

# Suchen
/     # Suchen (vorwärts)
?     # Suchen (rückwärts)
n     # Nächstes Suchergebnis
N     # Vorheriges Suchergebnis
f     # Quick find (tippe Buchstaben)

# Ordner erstellen/umbenennen
:mkdir neuer_ordner
cw    # Rename (change word)
A     # Rename am Ende
I     # Rename am Anfang
```

### Konfiguration: ~/.config/ranger/rc.conf

Die rc.conf ist die zentrale Konfigurationsdatei. Hier aktivierst du Previews, Git-Integration und passt das Layout an. Die wichtigsten Optionen im Ueberblick:

```bash
# ~/.config/ranger/rc.conf

# Preview aktivieren
set preview_images true
set preview_images_method kitty  # oder: w3m, iterm2, ueberzug

# VCS (Git) Integration
set vcs_aware true
set vcs_backend_git enabled

# Line Numbers
set line_numbers relative

# Versteckte Dateien anzeigen
set show_hidden true

# Sorting
set sort natural
set sort_case_insensitive true

# Columns
set column_ratios 1,3,4  # Parent:Current:Preview = 1:3:4

# Border
set draw_borders both

# Tabs
set tab_size 4

# Bestätigung bei Delete
set confirm_on_delete always
```

### Custom Keybindings: rc.conf

Eigene Keybindings beschleunigen haeufige Aktionen. Das `g`-Prefix wird typischerweise fuer schnelle Verzeichniswechsel genutzt, waehrend andere Bindings Git-Operationen oder Editor-Integration abbilden:

```bash
# ~/.config/ranger/rc.conf (Keybindings-Sektion)

# Git Operations
map gc shell git commit
map gp shell git push
map gl shell git pull
map gs shell git status

# Quick Navigation
map gh cd ~
map gd cd ~/Downloads
map gp cd ~/projects
map gc cd ~/.config

# Terminal öffnen
map <C-t> shell $SHELL

# Editor mit aktueller Datei
map E shell $EDITOR %s

# Bulk Operations
map bg shell nvim %s  # Alle markierten in vim öffnen
map cw eval fm.execute_console("bulkrename")  # Bulk Rename

# Image Viewer
map i shell open %s  # macOS
map i shell xdg-open %s  # Linux

# Extract Archive
map ex shell aunpack %s
```

### rifle.conf - File Associations

Die rifle.conf definiert, mit welchem Programm Dateien geoeffnet werden. Die Reihenfolge ist entscheidend -- die erste passende Regel wird verwendet:

```bash
# ~/.config/ranger/rifle.conf

# Text Files
ext txt|md|markdown = $EDITOR -- "$@"
mime ^text = $EDITOR -- "$@"

# Code Files
ext py|js|ts|go|rs|c|cpp|java = $EDITOR -- "$@"

# PDFs
ext pdf = open "$@"  # macOS
ext pdf = zathura "$@"  # Linux

# Images
mime ^image = open "$@"  # macOS
mime ^image = feh "$@"  # Linux

# Videos
mime ^video = mpv "$@"
mime ^video = vlc "$@"

# Archives
ext zip|tar|gz|bz2|xz = aunpack "$@"

# Office Documents
ext docx?|xlsx?|pptx? = libreoffice "$@"
```

---

## 🎓 Best Practices

Diese Tipps helfen dir, ranger effizienter einzusetzen und den vim-artigen Workflow optimal zu nutzen.

### 1. **Nutze Marks für schnelle Navigation**

Marks sind Lesezeichen fuer haeufig besuchte Verzeichnisse. Mit `m` setzt du eine Markierung, mit `'` springst du zurueck -- genau wie in vim:

```bash
# Mark setzen
m<letter>  # z.B. mp für ~/projects

# Zu Mark springen
'<letter>  # z.B. 'p springt zu ~/projects

# Nützliche Marks in rc.conf
map gh cd ~
map gp cd ~/projects
map gd cd ~/Downloads
map gc cd ~/.config
```

### 2. **Bulk Rename mit bulkrename**

Bulk Rename oeffnet eine Liste der markierten Dateien in deinem Editor. Du bearbeitest die Namen mit der vollen Power deines Editors (z.B. vim-Makros fuer Patterns):

```bash
# Dateien markieren (Space)
# Dann Bulk Rename starten
:bulkrename

# Öffnet Editor mit Dateiliste
# Bearbeite Namen im Editor
# Speichern und schließen = Umbenennen
```

### 3. **Filter für schnelle Suchen**

Filter blenden Dateien aus, die nicht dem Pattern entsprechen. So siehst du in einem grossen Verzeichnis nur die relevanten Dateitypen:

```bash
# Filter aktivieren
zf

# Tippe Pattern
*.py<Enter>  # Zeigt nur Python-Dateien

# Filter zurücksetzen
zf<Enter>
```

### 4. **Tabs für parallele Navigation**

Tabs erlauben dir, mehrere Verzeichnisse gleichzeitig offen zu haben und schnell zwischen ihnen zu wechseln -- nuetzlich beim Kopieren zwischen verschiedenen Orten:

```bash
# Neuen Tab öffnen
gn

# Zwischen Tabs wechseln
gt  # Next tab
gT  # Previous tab

# Tab schließen
q   # Im Tab-Modus

# Tab mit Verzeichnis öffnen
:tab_new ~/projects
```

### 5. **Command Palette für komplexe Befehle**

Mit `:` oeffnest du die Command-Palette, ueber die du Shell-Befehle ausfuehren und ranger-interne Commands nutzen kannst:

```bash
# Command Palette öffnen
:

# Nützliche Commands
:chmod +x %s          # Datei ausführbar machen
:!du -sh *            # Größe aller Dateien
:shell -w htop        # htop in ranger
:flat 1               # Flatten directory (Tiefe 1)
```

### 6. **Preview Customization in scope.sh**

Die scope.sh steuert, wie verschiedene Dateitypen in der Preview-Spalte dargestellt werden. Du kannst eigene Handler fuer bestimmte Formate hinzufuegen:

```bash
# ~/.config/ranger/scope.sh anpassen

# Für JSON mit jq
handle_extension() {
    case "${FILE_EXTENSION_LOWER}" in
        json)
            jq '.' "${FILE_PATH}" && exit 5
            ;;
    esac
}

# Für Markdown mit glow
handle_mime() {
    case "${MIMETYPE}" in
        text/markdown)
            glow -s dark "${FILE_PATH}" && exit 5
            ;;
    esac
}
```

### 7. **Image Preview Setup**

Bildvorschau erfordert ein kompatibles Terminal und das passende Backend. Kitty bietet die beste Unterstuetzung, w3m ist die universellere Alternative:

```bash
# Für kitty terminal (beste Option)
set preview_images_method kitty

# Für iTerm2 (macOS)
set preview_images_method iterm2

# Für w3m (universal aber langsam)
sudo apt install w3m-img  # Linux
brew install w3m  # macOS
set preview_images_method w3m
```

---

## 🔥 Beispiele

Die folgenden Beispiele zeigen ranger in typischen Entwickler-Workflows -- von der einfachen Navigation bis zur Git-Integration und fzf-Anbindung.

### Beispiel 1: Basis-Navigation Workflow

Ein einfacher Navigations-Workflow: Starte ranger, springe mit Suche zur gewuenschten Datei und oeffne sie:

```bash
# ranger starten
ranger ~/projects

# Navigation
j j j  # 3x runter
l      # In Ordner rein
h      # Zurück

# Zur Datei springen
/README<Enter>  # Suchen
n               # Nächstes Vorkommen

# Datei öffnen
l  # Mit Default-Programm

# Zurück zu ranger
q  # In ranger
```

**Ergebnis**: Schnelle Navigation ohne Maus, vim-Muscle-Memory nutzend.

---

### Beispiel 2: Bulk-File-Operations

```bash
# Im Download-Ordner
ranger ~/Downloads

# PDFs markieren
/pdf<Enter>  # Suche PDFs
Space        # Erste markieren
j Space      # Nächste markieren
j Space      # Nächste markieren

# Oder: Alle PDFs markieren mit Filter
zf
*.pdf<Enter>
v  # Alle markieren

# In Zielordner navigieren
yy           # Kopieren
gh           # Home
l            # In Documents
:mkdir PDFs  # Neuer Ordner
l            # Rein
pp           # Einfügen
```

**Ergebnis**: Alle PDFs in einen Ordner kopiert, ohne einzelne `cp`-Befehle.

---

### Beispiel 3: Git-Repository Navigation

```bash
# ~/.config/ranger/rc.conf
set vcs_aware true
set vcs_backend_git enabled

map gs shell git status
map gd shell git diff %s
map gc console shell git commit -m%space

# Im Repo navigieren
ranger ~/projects/myapp

# Git-Status sichtbar (markierte Files = staged)
# Modified files in orange
# Untracked in grey

# File ansehen
j j j  # Zu geänderter Datei
gd     # Git diff anzeigen

# File stagen
Space  # Markieren
:shell git add %s

# Commit
gc "Fix bug in login"
```

**Ergebnis**: Git-Workflow direkt in ranger, kein Terminal-Wechsel nötig.

---

### Beispiel 4: Projekt-Struktur Analyse

```bash
# ranger mit Preview
ranger ~/projects/new-codebase

# Spalten anpassen für mehr Preview
:set column_ratios 1,2,5

# Durch Dateien navigieren
j  # Nächste Datei
   # Preview zeigt Code automatisch

# Quick Find
f main  # Springt zu Datei mit "main"

# In src/ Verzeichnis
l  # Rein

# Syntax Highlighting in Preview
# Automatisch aktiv für bekannte Extensions
```

**Ergebnis**: Schneller Überblick über Code-Struktur ohne Files einzeln zu öffnen.

---

### Beispiel 5: Bulk Rename mit Pattern

```bash
# Dateien umbenennen: IMG_001.jpg → vacation_001.jpg

# Im Foto-Ordner
ranger ~/Photos/vacation

# Alle JPGs markieren
zf
*.jpg<Enter>
v  # Alle markieren

# Bulk Rename
:bulkrename

# Im Editor:
IMG_001.jpg → vacation_001.jpg
IMG_002.jpg → vacation_002.jpg
IMG_003.jpg → vacation_003.jpg

# Oder mit vim-Makros:
:%s/IMG_/vacation_/g

# Speichern und schließen
:wq

# ranger führt Umbenennung aus
```

**Ergebnis**: 100 Dateien in Sekunden umbenannt mit Editor-Power.

---

### Beispiel 6: Image-Preview-Setup (kitty)

```bash
# kitty terminal installieren
brew install --cask kitty  # macOS

# ~/.config/ranger/rc.conf
set preview_images true
set preview_images_method kitty
set preview_max_size 10  # MB

# ranger in kitty starten
ranger ~/Photos

# Navigation durch Bilder
j  # Nächstes Bild
   # Preview zeigt Thumbnail
k  # Vorheriges Bild

# Bild in voller Größe
l  # Öffnet Preview-App / feh / sxiv
```

**Ergebnis**: Bildvorschau direkt im Terminal, kein GUI-Tool nötig.

---

### Beispiel 7: Archive-Management

```bash
# ranger mit atool/aunpack
brew install atool  # macOS
sudo apt install atool  # Linux

# ~/.config/ranger/rifle.conf
ext zip|tar|gz|bz2|xz|rar = aunpack -- "$@"

# Im Downloads-Ordner
ranger ~/Downloads

# Zu .zip navigieren
/archive.zip<Enter>

# Preview zeigt Inhalt
l  # In Archive "reingehen" (mounten)

# Oder extrahieren
:shell aunpack %s

# Oder manuell extrahieren in Ordner
:mkdir extracted
:shell aunpack %s -X extracted/
```

**Ergebnis**: Archive-Inhalte preview und extrahieren ohne separate Tools.

---

### Beispiel 8: Custom Commands für Development

```bash
# ~/.config/ranger/commands.py

from ranger.api.commands import Command

class run_tests(Command):
    """
    :run_tests
    Führt Tests im aktuellen Projekt aus
    """
    def execute(self):
        if os.path.exists('package.json'):
            self.fm.execute_console('shell npm test')
        elif os.path.exists('Cargo.toml'):
            self.fm.execute_console('shell cargo test')
        elif os.path.exists('go.mod'):
            self.fm.execute_console('shell go test ./...')
        else:
            self.fm.notify('No test runner found', bad=True)

class open_pr(Command):
    """
    :open_pr
    Öffnet Pull Request Seite im Browser
    """
    def execute(self):
        self.fm.execute_console('shell gh pr view --web')

# In ranger verwenden
:run_tests
:open_pr
```

**Ergebnis**: Project-spezifische Commands direkt in ranger.

---

### Beispiel 9: Integration mit fzf für Fuzzy-Search

```bash
# ~/.config/ranger/commands.py

from ranger.api.commands import Command
import subprocess

class fzf_select(Command):
    """
    :fzf_select
    Nutze fzf um Datei zu finden und zu öffnen
    """
    def execute(self):
        command = "find . -type f | fzf"
        fzf = subprocess.Popen(command, stdout=subprocess.PIPE, shell=True)
        stdout, _ = fzf.communicate()

        if fzf.returncode == 0:
            selected = stdout.decode('utf-8').strip()
            self.fm.execute_console(f'select {selected}')

# rc.conf Keybinding
map <C-f> fzf_select

# Verwendung
Ctrl+f  # Öffnet fzf
# Tippe Pattern
# Enter zum Öffnen
```

**Ergebnis**: Fuzzy-File-Search kombiniert mit ranger-Navigation.

---

### Beispiel 10: Quick Editor mit Context

```bash
# ~/.config/ranger/rc.conf

# Code-Datei in vim mit Project-Context
map ev shell cd %d && vim %s

# README im Preview-Modus
map er shell glow %s

# Markdown-Datei direkt bearbeiten
map em shell $EDITOR %s

# Alle markierten Dateien in vim-Tabs
map ea shell vim -p %s

# Verwendung
# Navigiere zu Python-Datei
/main.py<Enter>
ev  # Öffnet in vim mit richtigem PWD

# Zurück zu ranger
:q  # In vim
# ranger noch offen
```

**Ergebnis**: Nahtloser Wechsel zwischen ranger und Editor.

---

### Beispiel 11: Backup-Workflow mit ranger

```bash
# Backup-Funktion in commands.py

class backup_selected(Command):
    """
    :backup_selected
    Erstellt Backup der markierten Dateien
    """
    def execute(self):
        from datetime import datetime

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_dir = os.path.expanduser(f'~/Backups/{timestamp}')

        os.makedirs(backup_dir, exist_ok=True)

        for f in self.fm.thistab.get_selection():
            self.fm.copy(f, backup_dir)

        self.fm.notify(f'Backed up to {backup_dir}')

# rc.conf
map yb backup_selected

# Workflow
# Wichtige Dateien markieren
Space Space Space  # 3 Dateien
yb                 # Backup erstellen
```

**Ergebnis**: Schnelles Backup wichtiger Files mit Timestamp.

---

### Beispiel 12: Log-File Analysis

```bash
# Im /var/log Verzeichnis
ranger /var/log

# Log-File mit Tail-Follow
:shell tail -f %s

# Oder mit Highlight
:shell tail -f %s | ccze -A

# Oder nach Errors filtern
:shell grep ERROR %s | less

# Mehrere Logs parallel
Space Space Space  # 3 Logs markieren
:shell multitail %s

# Keybinding in rc.conf
map <C-l> shell tail -f %s
map <C-e> shell grep -i error %s | less
```

**Ergebnis**: Effiziente Log-Analyse direkt in ranger.

---

## 🔗 Integration mit Claude Code

### ranger für AI-unterstützte File-Navigation

#### Setup für optimale Integration

```bash
# ~/.config/ranger/rc.conf

# Export file list für AI-Kontext
map ex shell ls -1 %d > /tmp/ranger_context.txt

# Copy filepath zum Clipboard für AI-Prompts
map yp shell echo -n %f | pbcopy  # macOS
map yp shell echo -n %f | xclip -selection clipboard  # Linux

# Preview-Content für AI-Analyse exportieren
map ea shell cat %s > /tmp/current_file.txt
```

#### Workflow-Pattern mit AI

```bash
# Schritt 1: Projekt-Struktur für AI vorbereiten
ranger ~/projects/new-feature

# Dateien in Preview ansehen
j j j  # Durch Dateien

# Schritt 2: Context für Claude Code sammeln
ex  # Exportiert Dateiliste

# Schritt 3: Wichtige Files kopieren
Space Space Space  # 3 Files markieren
yp                 # Paths kopieren

# Schritt 4: In Claude Code verwenden
# "Hier sind die Dateien:
#  /path/to/file1.py
#  /path/to/file2.js
#  Analysiere die Struktur..."
```

#### Custom Command für AI-Context Export

```python
# ~/.config/ranger/commands.py

class export_context(Command):
    """
    :export_context
    Exportiert File-Tree und Content für AI
    """
    def execute(self):
        import subprocess

        output_file = '/tmp/ai_context.txt'

        with open(output_file, 'w') as f:
            # File tree
            f.write("=== PROJECT STRUCTURE ===\n\n")
            tree = subprocess.run(['tree', '-L', '3'],
                                capture_output=True, text=True)
            f.write(tree.stdout)

            # Selected files content
            f.write("\n\n=== SELECTED FILES ===\n\n")
            for file in self.fm.thistab.get_selection():
                if os.path.isfile(file):
                    f.write(f"\n--- {file} ---\n")
                    with open(file, 'r') as content:
                        f.write(content.read()[:1000])  # Erste 1000 Zeichen

        self.fm.notify(f'Context exported to {output_file}')

# rc.conf
map ec export_context
```

---

## 🤖 Claude Code Integration

### Workflow 1: Projektstruktur vor Claude Code erkunden
```bash
ranger src/
```

### Workflow 2: Files mit Preview durchsuchen
```bash
# In ranger: / zum Suchen, dann Enter zum Oeffnen
# Preview zeigt Dateiinhalt mit Syntax Highlighting
ranger --cmd="set preview_images true"
```

### Workflow 3: Bulk-Operationen vor Refactoring
```bash
# In ranger: Space zum Markieren, :rename fuer Batch-Rename
ranger --cmd="cd src/components"
```

> 💡 **Tipp**: Nutze ranger um Dateien visuell zu explorieren und dann Claude Code gezielt auf bestimmte Files anzusetzen.

---

## 🐛 Troubleshooting

Hier findest du Loesungen fuer die haeufigsten ranger-Probleme -- von Preview-Problemen bis zu Keybinding-Konflikten.

### Problem 1: Preview zeigt keine Bilder

**Symptom**: `set preview_images true` funktioniert nicht

**Ursachen**:
- Kein Image-Backend installiert
- Terminal unterstützt keine Bilder
- Falsche `preview_images_method` Einstellung

**Lösung**:

```bash
# 1. Backend installieren
brew install kitty  # Bestes Backend
# Oder
brew install w3m   # Fallback

# 2. rc.conf anpassen
set preview_images_method kitty
# Oder
set preview_images_method w3m

# 3. In kitty terminal starten
kitty ranger

# 4. Test mit Bild-Datei
ranger ~/Pictures
# Navigiere zu .jpg/.png
```

---

### Problem 2: Keybindings funktionieren nicht

**Symptom**: Custom Keybindings reagieren nicht

**Ursache**: Konflikt mit Default-Bindings oder Syntax-Fehler

**Lösung**:

```bash
# 1. rc.conf Syntax prüfen
ranger --clean  # Ohne Custom Config starten

# 2. Keybinding-Konflikte finden
:map  # In ranger, zeigt alle Bindings

# 3. Explizit unmap vor remap
# rc.conf
unmap gh  # Default entfernen
map gh cd ~  # Neu definieren

# 4. Debug-Output
ranger --debug
```

---

### Problem 3: Langsames Preview

**Symptom**: Preview verzögert, hohe CPU-Last

**Ursache**: Große Dateien oder ineffizientes scope.sh

**Lösung**:

```bash
# 1. Preview für große Files disablen
# ~/.config/ranger/scope.sh

# Am Anfang der Funktion
if [ "$FILE_SIZE_KIB" -gt 10240 ]; then
    exit 1  # Kein Preview für Files >10MB
fi

# 2. Timeout setzen
set preview_max_size 5  # MB

# 3. Delays anpassen
set preview_delay 100  # ms

# 4. Preview temporär ausschalten
zp  # Toggle Preview
```

---

### Problem 4: rifle öffnet falsche App

**Symptom**: PDF öffnet sich in Browser statt PDF-Reader

**Ursache**: Falsche Order in rifle.conf

**Lösung**:

```bash
# rifle.conf - Order matters!

# ~/.config/ranger/rifle.conf

# Spezifischere Rules ZUERST
ext pdf, has zathura, X, flag f = zathura -- "$@"
ext pdf, has evince, X, flag f = evince -- "$@"
ext pdf, has okular, X, flag f = okular -- "$@"

# Fallback DANACH
ext pdf = open -- "$@"

# Test welche Rule matched
# In ranger:
:rifle -p file.pdf
# Zeigt welche Command ausgeführt würde
```

---

### Problem 5: Bulk Rename schlägt fehl

**Symptom**: `bulkrename` funktioniert nicht

**Ursache**: Editor nicht korrekt konfiguriert

**Lösung**:

```bash
# 1. EDITOR setzen
export EDITOR=nvim  # In .bashrc/.zshrc/config.fish

# 2. In ranger testen
:bulkrename

# 3. Falls Editor nicht öffnet:
# rc.conf
set use_preview_script false  # Temporär

# 4. Manueller Fallback
:shell vim /tmp/ranger-bulkrename.*
```

---

## 📊 Vergleich mit Alternativen

| Feature | ranger | lf | nnn | midnight commander |
|---------|--------|----|----|-------------------|
| **Keybindings** | ✅ Vim | ✅ Vim | ⚠️ Custom | ⚠️ F-Keys |
| **Preview** | ✅ Umfangreich | ✅ Gut | ⚠️ Basic | ⚠️ Text only |
| **Image Preview** | ✅ Mehrere Backends | ✅ Ja | ❌ Nein | ❌ Nein |
| **Customization** | ✅ Python | ✅ Go | ⚠️ Shell | ⚠️ INI |
| **Performance** | ⚠️ Python (langsam) | ✅ Go (schnell) | ✅ C (sehr schnell) | ✅ Gut |
| **Layout** | ✅ 3-Column | ✅ Flexibel | ✅ 4-Column | ✅ 2-Panel |
| **File Associations** | ✅ rifle.conf | ✅ Ja | ⚠️ Begrenzt | ✅ Ja |
| **VCS Integration** | ✅ Git/SVN/HG | ✅ Git | ⚠️ Plugin | ❌ Nein |
| **Bulk Operations** | ✅ Ja | ✅ Ja | ✅ Ja | ✅ Ja |
| **Learning Curve** | ⚠️ Mittel (vim) | ⚠️ Mittel | ✅ Niedrig | ⚠️ Mittel |

### Wann ranger?
- ✅ Vim-User mit Muscle-Memory
- ✅ Umfangreiche Preview-Anforderungen
- ✅ Python-Scripting für Customization
- ✅ Git-Repository-Navigation

### Wann lf?
- ✅ Performance kritisch (große Dirs)
- ✅ Go-Scripting bevorzugt
- ✅ Minimalistischer als ranger
- ✅ Moderne Alternative zu ranger

### Wann nnn?
- ✅ Maximale Performance (C-basiert)
- ✅ Minimaler Footprint
- ✅ Plugin-System erwünscht
- ✅ 4-Column Layout

### Wann Midnight Commander?
- ✅ F-Key-Bindings bevorzugt
- ✅ Zwei-Panel Workflow
- ✅ Klassische Norton Commander UX
- ✅ FTP/SFTP Built-in

---

## 🔗 Nützliche Links

### Offizielle Ressourcen
- **Website**: https://ranger.github.io/
- **GitHub**: https://github.com/ranger/ranger
- **Wiki**: https://github.com/ranger/ranger/wiki
- **Manpage**: `man ranger`

### Konfiguration & Themes
- **Sample Configs**: https://github.com/ranger/ranger/tree/master/doc/config
- **Plugins**: https://github.com/ranger/ranger/wiki/Plugins
- **Colorschemes**: https://github.com/ranger/ranger/wiki/Colorschemes

### Alternativen & Tools
- **lf** (Go-basiert): https://github.com/gokcehan/lf
- **nnn** (C-basiert): https://github.com/jarun/nnn
- **rifle** (File-Opener): https://github.com/ranger/ranger/blob/master/ranger/ext/rifle.py

### Integration
- **w3m** (Image-Preview): http://w3m.sourceforge.net/
- **kitty** (Terminal): https://sw.kovidgoyal.net/kitty/
- **atool** (Archive-Handling): https://www.nongnu.org/atool/

### Tutorials
- **Arch Wiki**: https://wiki.archlinux.org/title/Ranger
- **Video Tutorial**: https://www.youtube.com/watch?v=L6Vu7WPkoJo
- **Cheat Sheet**: https://gist.github.com/heroheman/aba73e47443340c35526755ef79647eb

---

## 💎 Pro-Tipps

### 1. **Bookmark häufige Verzeichnisse**

```bash
# rc.conf
map gp cd ~/projects
map gd cd ~/Downloads
map gc cd ~/.config
map gl cd /var/log
map gt cd /tmp

# Im laufenden ranger
m<key>  # Bookmark setzen
'<key>  # Zu Bookmark springen
```

### 2. **Macro-Recording für repetitive Tasks**

```bash
# In ranger (ähnlich wie vim)
q<letter>  # Recording starten (z.B. qa)
# ... Aktionen ausführen ...
q          # Recording stoppen

@<letter>  # Macro abspielen (z.B. @a)
@@         # Letztes Macro wiederholen
```

### 3. **Trash statt Delete**

```bash
# rc.conf - sicheres Löschen
map DD shell trash-put %s  # Benötigt trash-cli

# Installation
brew install trash  # macOS
sudo apt install trash-cli  # Linux

# Wiederherstellen
:shell trash-list
:shell trash-restore
```

### 4. **Shell-Escape für Complex Commands**

```bash
# Aus ranger heraus Shell-Commands
:shell-fg <command>  # Foreground (ranger pausiert)
:shell-bg <command>  # Background

# Beispiele
:shell-fg htop
:shell-bg find . -name "*.log" -delete
```

### 5. **Selection-Basierte Operations**

```bash
# Alle Markdown-Files markieren
/\.md$<Enter>  # Regex-Suche
v              # Alle Treffer markieren

# Mit Markierung arbeiten
yy  # Alle markierten kopieren
:shell wc -l %s  # Word count auf alle

# Markierung als File-List
:shell vim %s  # Öffnet alle in vim
```

### 6. **Quick View (Q) für Code-Review**

```bash
# Quick View aktivieren
Q

# Navigation mit vim-Bindings IN Preview
j/k  # Scrollen in Preview
gg/G # Top/Bottom in Preview

# Zurück zu File-List
Q
```

### 7. **cd-on-quit Feature**

```bash
# In .bashrc / .zshrc / config.fish
function ranger-cd {
    tempfile="$(mktemp -t tmp.XXXXXX)"
    ranger --choosedir="$tempfile" "${@:-$(pwd)}"
    test -f "$tempfile" &&
    if [ "$(cat -- "$tempfile")" != "$(echo -n `pwd`)" ]; then
        cd -- "$(cat "$tempfile")"
    fi
    rm -f -- "$tempfile"
}

# Alias
alias rcd='ranger-cd'

# Verwendung
rcd
# Navigiere in ranger
# q zum Beenden
# → PWD ist jetzt das ranger-Verzeichnis
```

### 8. **Git-Status im File-List**

```bash
# rc.conf
set vcs_aware true
set vcs_backend_git enabled

# Färbung:
# Grün:   Staged
# Rot:    Modified
# Grau:   Untracked
# Normal: Committed

# Quick-Staging
Space  # File markieren
:shell git add %s
```

---

## 📝 Zusammenfassung

### Das Wichtigste zu ranger

**ranger** ist ein vim-inspirierter Terminal File Manager mit **drei-spaltigem Layout** und umfangreichen **Preview-Funktionen**:

**Kern-Features:**
- ✅ Vim-Keybindings (hjkl, yy, dd, pp)
- ✅ 3-Spalten-Layout (Parent | Current | Preview)
- ✅ File-Preview (Code, Bilder, PDFs, Archive)
- ✅ Bulk-Operations (markieren, kopieren, umbenennen)
- ✅ Vollständig customizable (Python, rc.conf, rifle.conf)

**Typische Anwendungsfälle:**
1. **Projekt-Navigation**: Schnell durch Codebases bewegen
2. **File-Preview**: Code-Review ohne Editor-Wechsel
3. **Bulk-Operations**: Viele Dateien gleichzeitig verarbeiten
4. **Git-Workflow**: Repository-Status visuell erfassen

**Vorteile:**
- Vim-Muscle-Memory direkt nutzbar
- Kein Context-Switch (Terminal → GUI)
- Umfangreiche Preview (besser als ls)
- Python-Scripting für Custom-Workflows

**Nachteile:**
- Höhere Lernkurve (vim-Kenntnisse nötig)
- Langsamer als lf/nnn (Python-basiert)
- Image-Preview benötigt spezielle Terminals
- Bulk-Operations komplexer als GUI Drag & Drop

**Essential Keybindings:**
```bash
hjkl    # Navigation (vim-style)
gg/G    # Anfang/Ende
Space   # Markieren
yy/dd/pp # Kopieren/Ausschneiden/Einfügen
:       # Command-Palette
/       # Suchen
f       # Quick-Find
cw      # Rename
```

**Konfigurationsdateien:**
```bash
~/.config/ranger/
  rc.conf         # Hauptconfig + Keybindings
  rifle.conf      # File-Associations
  scope.sh        # Preview-Scripts
  commands.py     # Custom-Commands (Python)
```

**Best Practices:**
1. Nutze Marks (`m<letter>`) für häufige Verzeichnisse
2. Bulk-Rename (`:bulkrename`) für Batch-Operationen
3. Filter (`zf`) für schnelle File-Type-Selektion
4. Tabs (`gn`) für parallele Navigation
5. Export-Functions für AI-Context-Sharing

**Workflow-Muster:**
```bash
ranger ~/projects/myapp  # Starten
/main.py<Enter>          # File finden
l                        # Preview ansehen
E                        # In Editor öffnen
# ... bearbeiten ...
q                        # Zurück zu ranger
```

**Integration mit Claude Code:**
- File-Listen exportieren für AI-Kontext
- Paths kopieren für Prompt-Engineering
- Preview-Content für Code-Analyse
- Custom-Commands für AI-Workflows

**Alternativen:**
- **lf**: Schneller (Go), ähnliche UX
- **nnn**: Noch schneller (C), 4-Spalten
- **Midnight Commander**: F-Keys, 2-Panel-Layout

**Entscheidungshilfe:**
- **ranger verwenden** → Vim-User, umfangreiche Previews, Python-Customization
- **lf verwenden** → Performance wichtiger, Go-Scripting bevorzugt
- **nnn verwenden** → Maximale Geschwindigkeit, minimaler Footprint

ranger ist die richtige Wahl für **vim-affine Entwickler**, die einen **mächtigen Terminal File Manager** mit **umfangreichen Preview- und Customization-Möglichkeiten** suchen.

---

**Letzte Aktualisierung**: Februar 2026
**Schwierigkeitsgrad**: Fortgeschritten
**Geschätzte Lernzeit**: 30-45 Minuten
**Voraussetzungen**: vim-Grundlagen (hjkl, yy, dd, pp)