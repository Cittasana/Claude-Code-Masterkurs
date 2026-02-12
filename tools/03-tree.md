# 🌳 tree - Verzeichnisbaum-Visualisierung

**Kategorie**: 🟢 Anfänger-Tools
**Installation**: 2 Minuten
**Skill-Level**: Einfach
**Impact**: Sofortige Klarheit

---

> 🚀 **Claude Code Relevanz**: tree ist das perfekte Werkzeug, um Claude Code den Kontext deiner Projektstruktur zu geben - ein einzelner Befehl liefert den kompletten Ueberblick, den Claude fuer praezise Code-Aenderungen braucht.

## ✅ Berechtigung - Warum tree?

### Das Problem mit `ls` und `cd`
Um Projekt-Strukturen zu verstehen, musst du normalerweise:
- ❌ Mehrfach `cd` in Unterordner
- ❌ Immer wieder `ls` ausführen
- ❌ Mental Track halten, wo du bist
- ❌ ASCII-Art manuell zeichnen für Dokumentation
- ❌ Lange Zeit für Exploration

### Die Lösung: tree
`tree` ist ein klassisches Unix-Tool (seit 1996), das Verzeichnisse als Baum visualisiert:
- ✅ **Hierarchische Darstellung** auf einen Blick
- ✅ **Tiefe konfigurierbar** (-L flag)
- ✅ **Filterung** (nur Directories, nur Files, nur Pattern)
- ✅ **Export** (HTML, JSON, XML)
- ✅ **Statistiken** (File-Count, Size)
- ✅ **Schnell** selbst bei großen Projekten

**Ergebnis**: Du verstehst Projekt-Strukturen in Sekunden statt Minuten.

> 💡 **Tipp**: Erstelle einen Alias `t` fuer `tree -L 2 -I 'node_modules|dist|.git'` - du wirst ihn dutzende Male am Tag nutzen.

---

## 🎯 Zwecke - Wofür du tree einsetzt

tree ist vielseitig einsetzbar - von schneller Exploration bis zur professionellen Dokumentation. Hier die fuenf wichtigsten Anwendungsfaelle.

### 1. **Projekt-Struktur dokumentieren**
Exportiere die Verzeichnisstruktur als Text fuer READMEs oder Wikis:
Für READMEs, Docs, oder Wikis:
```bash
tree -L 2 > PROJECT_STRUCTURE.txt
```

### 2. **Neues Projekt verstehen**
Repo geklont? Sofort Überblick:
```bash
tree -L 3 -I 'node_modules|.git'
```

### 3. **Code-Review Vorbereitung**
Zeige Team-Mitgliedern Structure:
```bash
tree -d -L 2  # Nur Directories
```

### 4. **Dokumentation generieren**
HTML-Export für Browser-Anzeige:
```bash
tree -H . -o structure.html
```

### 5. **File-Count und Statistiken**
Wie groß ist das Projekt?
```bash
tree --du -h  # Mit Disk-Usage
```

---

## 💻 Verwendung - Wie du tree einsetzt

Von der Installation ueber Grundbefehle bis zu Export-Formaten - hier lernst du tree von Grund auf.

### Installation

tree ist auf allen Plattformen als Standardpaket verfuegbar und in weniger als einer Minute installiert.

**macOS (Homebrew)**:
```bash
brew install tree
```

**Ubuntu/Debian**:
```bash
sudo apt install tree
```

**Arch Linux**:
```bash
sudo pacman -S tree
```

**Windows (Chocolatey)**:
```bash
choco install tree
```

> ⚠️ **Warnung**: Ohne `-I 'node_modules'` kann `tree` in JavaScript-Projekten Tausende Dateien anzeigen und dein Terminal ueberfluten. Nutze IMMER Ignore-Patterns bei grossen Projekten.

---

### Quick Start (30 Sekunden)

Mit diesen vier Grundbefehlen deckst du die meisten Anwendungsfaelle ab.

**Basis-Usage**:
```bash
# Kompletter Tree (aller Files)
tree

# Nur 2 Ebenen tief
tree -L 2

# Nur Directories
tree -d

# Mit File-Sizes
tree -h
```

**Wichtigste Flags**:
Diese Flags steuern, wie tief und welche Dateien tree anzeigt:
```bash
# -L <level>    Maximale Tiefe
# -d            Nur Directories
# -f            Full Path anzeigen
# -h            Human-readable Sizes
# -I <pattern>  Ignore Pattern (z.B. 'node_modules')
# -P <pattern>  Nur Pattern zeigen (z.B. '*.js')
# -a            Inkl. hidden files
# --du          Disk Usage
# --dirsfirst   Directories zuerst
```

---

### Advanced Usage

Fuer groessere Projekte sind Ignore-Patterns und Export-Funktionen unverzichtbar.

**1. Ignore-Patterns (wichtig!)**:
Ohne Ignore-Patterns kann tree bei grossen Projekten den Output mit tausenden Dateien ueberfluten:
```bash
# Single Pattern
tree -I 'node_modules'

# Multiple Patterns
tree -I 'node_modules|dist|build|.git'

# Alle Hidden Files ignorieren
tree -I '.*'

# Nur Source-Code (ignore Tests)
tree -I 'test|__tests__|*.test.js'
```

**2. Nur bestimmte File-Types**:
Mit dem `-P` Flag filterst du den Output auf bestimmte Dateitypen - ideal um nur den relevanten Code zu sehen:
```bash
# Nur JavaScript-Files
tree -P '*.js'

# Nur TypeScript + TSX
tree -P '*.ts|*.tsx'

# Nur Config-Files
tree -P '*.json|*.yml|*.yaml'

# Nur Markdown
tree -P '*.md'
```

**3. Statistiken**:
```bash
# File + Directory Count
tree --dirsfirst

# Mit Disk-Usage
tree --du -h

# File-Sizes anzeigen
tree -s -h

# Permissions anzeigen
tree -p
```

**4. Output-Formate**:
tree kann die Verzeichnisstruktur in verschiedene Formate exportieren - HTML fuer Stakeholder, JSON fuer Weiterverarbeitung:
```bash
# HTML Export
tree -H . -o structure.html

# JSON Export (perfekt fuer Weiterverarbeitung mit jq)
tree -J > structure.json

# XML Export
tree -X > structure.xml

# Mit CSS (für HTML)
tree -H . -T "My Project" -o structure.html
```

**5. Sorting**:
```bash
# Alphabetisch (default)
tree

# Directories zuerst
tree --dirsfirst

# Nach Size (größte zuerst)
tree -h --du | sort -h

# Nach Modification Time
tree -D --timefmt '%Y-%m-%d %H:%M'
```

**6. Tiefere Control**:
```bash
# Nur bis Datei-Ebene 3
tree -L 3 -d

# Full Path für jedes File
tree -f

# Nur Files (keine Dirs)
tree -f | grep -v '/$'

# Mit Inodes
tree -i

# Mit Last-Modified
tree -D
```

---

## 🏆 Best Practices

Mit diesen Empfehlungen holst du das Maximum aus tree heraus und vermeidest typische Fallstricke.

### 1. **Standard-Aliases für häufige Use-Cases**
Diese Aliases sparen dir das wiederholte Eintippen von Ignore-Patterns und sind sofort einsatzbereit:
```bash
# In ~/.bashrc oder ~/.zshrc
alias t='tree -L 2 -I "node_modules|dist|build|.git"'
alias td='tree -d -L 2'  # Nur Directories
alias tf='tree -P "*.js|*.ts|*.jsx|*.tsx" -I "node_modules"'  # Nur Code
alias tg='tree -L 3 -I "node_modules|.git"'  # Größerer Überblick
```

### 2. **Project-README generieren**
Automatisiere die Dokumentation deiner Projektstruktur, damit sie immer aktuell bleibt:
```bash
# Dokumentiere Structure automatisch
tree -L 3 -I 'node_modules|dist' --dirsfirst > PROJECT_STRUCTURE.md
# → Commit in Repo
```

### 3. **Combine mit anderen Tools**
tree laesst sich gut mit grep, fzf und bat kombinieren fuer erweiterte Funktionalitaet:
```bash
# Mit grep: Finde Directories mit bestimmtem Namen
tree -d | grep 'components'

# Mit wc: Count Files
tree -f | wc -l

# Mit fzf: Interaktive Navigation
tree -fi | fzf

# Mit bat: Preview
tree -L 2 | bat
```

### 4. **Ignore-Patterns in .treeignore**
```bash
# Erstelle ~/.treeignore (wie .gitignore)
node_modules
dist
build
.git
.next
coverage
.cache
```

Dann nutze:
```bash
tree --fromfile ~/.treeignore
```

### 5. **Performance bei großen Projekten**
Bei sehr grossen Repositories kann tree mehrere Sekunden brauchen - diese Flags verhindern das:
```bash
# Level begrenzen (wichtig!)
tree -L 2

# Ignore große Ordner
tree -I 'node_modules|vendor|.git'

# Nur Directories (schneller)
tree -d -L 3

# Mit Timeout (falls stuck)
timeout 5 tree -L 4
```

### 6. **Für Dokumentation: HTML Export**
Der HTML-Export erstellt eine klickbare, interaktive Baumansicht die auch nicht-technische Stakeholder nutzen koennen:
```bash
# Professional HTML Tree
tree -H . -T "MyApp Structure" \
     -I 'node_modules|dist' \
     -L 3 \
     --charset utf-8 \
     -o docs/structure.html

# → Commit in docs/
# → GitHub Pages zeigt es schön an
```

### 7. **Claude Code Workflows**
tree-Output als Kontext fuer Claude Code ist besonders wertvoll, weil Claude damit die Projektstruktur versteht:
```bash
# Vor Feature: Structure verstehen
tree -L 3 -I 'node_modules'

# Dokumentation: Export für README
tree -L 2 --dirsfirst -I 'node_modules|.git' > docs/STRUCTURE.md

# Code-Review: Welche Dirs betroffen?
tree -d -L 2 | grep -E '(src|tests)'
```

---

## 📝 Beispiele - Real-World Use-Cases

Diese Beispiele zeigen typische Szenarien, in denen tree deine Produktivitaet spuerbar steigert.

### Beispiel 1: Neues Projekt Onboarding

**Szenario**: Du joinst Team, musst Codebase verstehen.

```bash
# 1. High-Level Überblick (3 Levels)
cd ~/projekte/new-company-app
tree -L 3 -I 'node_modules|dist|.git'

# Output:
# .
# ├── src
# │   ├── api
# │   │   ├── auth.js
# │   │   └── users.js
# │   ├── components
# │   │   ├── Header.jsx
# │   │   └── Footer.jsx
# │   └── pages
# │       ├── Home.jsx
# │       └── Login.jsx
# ├── public
# ├── tests
# └── package.json

# 2. Nur Code-Structure (ignore Config)
tree -P '*.js|*.jsx|*.ts|*.tsx' -I 'node_modules' --prune

# 3. Export für spätere Referenz
tree -L 3 -I 'node_modules|dist' > ~/ONBOARDING_STRUCTURE.txt
```

**Zeit gespart**: 10 Minuten vs. manuelles Explorieren

> 🚀 **Beispiel**: Kopiere den tree-Output direkt in deine Claude Code Session als Kontext - so versteht Claude die Projektstruktur sofort und kann praezisere Aenderungen vorschlagen.

---

### Beispiel 2: README Dokumentation

**Szenario**: Du willst Project-Structure in README dokumentieren.

```bash
# 1. Generiere Tree
tree -L 2 -I 'node_modules|dist|.git' --dirsfirst

# 2. Copy Output und füge in README.md ein:
# ```
# project/
# ├── src/
# │   ├── components/
# │   ├── pages/
# │   └── utils/
# ├── public/
# ├── tests/
# └── package.json
# ```

# Oder: Automatisch generieren
echo '## Project Structure' > STRUCTURE.md
echo '```' >> STRUCTURE.md
tree -L 2 -I 'node_modules|dist' --dirsfirst >> STRUCTURE.md
echo '```' >> STRUCTURE.md

# → Commit STRUCTURE.md
```

**Ergebnis**: Professional Dokumentation in 30 Sekunden

> 💡 **Tipp**: Nutze `tree -L 2 --dirsfirst` fuer README-Dokumentation - Ordner zuerst macht die Struktur viel lesbarer.

---

### Beispiel 3: Code-Review Prep

**Szenario**: PR mit vielen Files, du willst Structure visualisieren.

```bash
# 1. Welche Directories betroffen?
git diff --name-only main | sed 's|/[^/]*$||' | sort -u

# 2. Tree für diese Directories
tree src/components -L 2
tree src/api -L 2

# 3. Nur geänderte Files zeigen (mit tree)
git diff --name-only main | tree --fromfile

# Ergebnis: Du siehst:
# - Welche Directories betroffen
# - Wie Files related sind
# - Ob Structure sinnvoll
```

**Zeit gespart**: 5 Minuten vs. GitHub File-Tree clicken

---

### Beispiel 4: Monorepo Exploration

**Szenario**: Großes Monorepo, du brauchst Überblick.

```bash
# 1. Top-Level (Packages)
tree -L 1 -d packages/

# Output:
# packages/
# ├── api
# ├── frontend
# ├── mobile
# └── shared

# 2. Jedes Package detaillierter
tree -L 2 packages/api

# 3. Nur Source-Code (ignore alles andere)
tree -L 3 -P '*.ts|*.tsx' -I 'node_modules|dist|build' --prune

# 4. File-Count pro Package
for pkg in packages/*; do
  echo "$pkg: $(tree -fi $pkg -I 'node_modules' | wc -l) files"
done
```

**Resultat**: Du verstehst Monorepo-Structure in 2 Minuten

---

### Beispiel 5: HTML-Export für Stakeholder

**Szenario**: PM will Project-Structure sehen (nicht-technical).

```bash
# 1. Professional HTML generieren
tree -H . \
     -T "MyApp - Project Structure" \
     -I 'node_modules|dist|.git|coverage' \
     -L 3 \
     --charset utf-8 \
     --dirsfirst \
     -o project-structure.html

# 2. Open in Browser
open project-structure.html

# 3. Share via Email oder Deploy
# → Interaktive, klickbare Tree-View
```

**Vorteil**: Non-Techies können Structure explorieren

---

### Beispiel 6: Disk-Usage Analyse

**Szenario**: Projekt zu groß, du suchst Space-Fresser.

```bash
# 1. Tree mit Sizes
tree --du -h -L 2

# Output:
# [4.5G]  .
# ├── [3.2G]  node_modules
# ├── [1.1G]  dist
# ├── [150M]  src
# └── [  50M]  public

# 2. Sortiert nach Size
tree --du -h -L 2 | sort -h

# 3. Nur große Directories (> 100MB)
tree --du -h | awk '$1 ~ /[0-9]+M/ || $1 ~ /[0-9]+G/'

# Ergebnis: node_modules + dist sind Platz-Fresser
# → npm prune && rm -rf dist
```

**Zeit gespart**: 3 Minuten vs. `du` + `find`

---

## 🤖 Claude Code Integration

Claude Code arbeitet praeziser, wenn es den Projektkontext kennt. tree liefert diesen Kontext in einem einzigen Befehl.

### Workflow 1: Projektstruktur fuer Claude Code Context
Gib Claude Code den vollen Ueberblick ueber dein Projekt, damit es Dateien korrekt zuordnen kann:
```bash
# Claude Code Session: tree fuer Projekt-Kontext
tree -I 'node_modules|.git|dist' --dirsfirst -L 3
```

### Workflow 2: Nur Source-Files anzeigen
Filtere den Output auf relevante Code-Dateien, damit Claude Code nicht durch Config-Files abgelenkt wird:
```bash
tree -P '*.ts|*.tsx' --prune src/
```

### Workflow 3: JSON-Output fuer Automatisierung
Der JSON-Export laesst sich mit jq weiterverarbeiten oder in Skripte einbinden:
```bash
tree -J -I 'node_modules' > project-structure.json
```

> 💡 **Tipp**: Nutze tree-Output als Context fuer Claude Code, damit es die Projektstruktur versteht.

---

## 📺 Video-Tutorial

[Linux tree Command - Tutorial mit Beispielen (TecMint)](https://www.tecmint.com/linux-tree-command-examples/)
Umfassende Anleitung zum tree-Befehl unter Linux mit praktischen Beispielen fuer Anfaenger - von der Installation bis zu fortgeschrittenen Optionen.

---

## 🔧 Troubleshooting

Typische Probleme mit tree und wie du sie schnell loest.

### Problem: "Tree zu lang (scrollt aus Screen)"
Bei grossen Projekten kann der tree-Output hunderte Zeilen lang sein und aus dem sichtbaren Bereich scrollen. Begrenze die Tiefe oder nutze einen Pager.

```bash
# Lösung 1: Tiefe begrenzen
tree -L 2

# Lösung 2: Mit Pager
tree | less

# Lösung 3: In File speichern
tree > structure.txt && less structure.txt
```

---

### Problem: "node_modules überflutet Output"
JavaScript-Projekte haben oft tausende Dateien in node_modules. Ohne Ignore-Pattern dauert tree ewig und der Output ist unbrauchbar.

```bash
# Immer ignore!
tree -I 'node_modules'

# Oder: Mehrere Patterns
tree -I 'node_modules|dist|build|.git|coverage'

# Oder: Alias setzen
alias tree='tree -I "node_modules|dist|.git"'
```

---

### Problem: "Zu viele Files (Performance)"
tree scannt standardmaessig alle Dateien rekursiv. Bei sehr grossen Repositories kann das mehrere Sekunden dauern oder sogar haengen bleiben.

```bash
# Level stark begrenzen
tree -L 1

# Nur Directories
tree -d -L 3

# Mit Timeout
timeout 5 tree -L 3

# Ignore große Ordner
tree -I 'node_modules|vendor|.venv'
```

---

### Problem: "Hidden Files nicht sichtbar"
Standardmaessig blendet tree versteckte Dateien (die mit einem Punkt beginnen) aus. Das `-a` Flag macht sie sichtbar.

```bash
# -a Flag nutzen
tree -a -L 2

# Oder: Nur hidden Files
tree -a -L 1 | grep '^\.'
```

---

## 📊 tree vs. ls -R vs. eza --tree - Der Vergleich

| Feature | `ls -R` | `tree` | `eza --tree` |
|---------|---------|--------|--------------|
| **Hierarchie** | ❌ Flat | ✅ Baum | ✅ Baum |
| **Visuell** | ❌ Unleserlich | ✅ ASCII-Art | ✅ Modern + Icons |
| **Tiefe-Control** | ❌ | ✅ (-L flag) | ✅ (--level) |
| **Ignore-Pattern** | ❌ | ✅ (-I flag) | ✅ (--ignore-glob) |
| **Git-Integration** | ❌ | ❌ | ✅ |
| **Export** | ❌ | ✅ (HTML, JSON, XML) | ❌ |
| **Performance** | 🐌 Langsam | 🚀 Schnell | 🚀 Schnell |
| **Portabilität** | ✅ Überall | ✅ Weit verbreitet | ⚠️ Neueres Tool |

**Fazit**:
- `tree` für Dokumentation und Export
- `eza --tree` für tägliche Arbeit (Git-Integration)
- `ls -R` nur als Fallback

---

## 🔗 Weiterführende Links

### Offizielle Ressourcen
- **Man Page**: `man tree`
- **GitHub Mirror**: https://github.com/Old-Man-Programmer/tree
- **Website**: http://mama.indstate.edu/users/ice/tree/

### Tutorials
- [tree Command Examples](https://www.cyberciti.biz/faq/linux-show-directory-structure-command-line/)
- [tree Cheatsheet](https://devhints.io/tree)

### Verwandte Tools
- **eza**: Modernes tree + ls (kombiniere beides)
- **broot**: Interaktiver Tree-Navigator
- **ncdu**: Disk Usage Analyzer mit Tree

---

## 💡 Pro-Tipps

Fortgeschrittene Techniken fuer Power-User, die tree in ihren Workflow integrieren wollen.

### 1. **Function für Smart-Tree**
Diese Funktion akzeptiert die Tiefe als Parameter und hat sinnvolle Defaults eingebaut:
```bash
# In ~/.zshrc
t() {
  local level=${1:-2}
  tree -L $level -I 'node_modules|dist|build|.git|coverage' --dirsfirst
}

# Nutzen:
t      # Level 2 (default)
t 3    # Level 3
t 5    # Level 5
```

### 2. **Automatically update README**
Als Git-Hook sorgt tree dafuer, dass die Projektstruktur-Dokumentation bei jedem Commit automatisch aktualisiert wird:
```bash
# Als Git Hook (pre-commit)
#!/bin/bash
tree -L 2 -I 'node_modules|dist' > docs/STRUCTURE.md
git add docs/STRUCTURE.md
```

### 3. **Tree in Clipboard kopieren**
Kopiere den tree-Output direkt in die Zwischenablage, um ihn in Docs, Slack oder Claude Code einzufuegen:
```bash
# macOS
tree -L 2 | pbcopy

# Linux (mit xclip)
tree -L 2 | xclip -selection clipboard
```

### 4. **JSON Output für Scripting**
Der JSON-Output laesst sich mit jq parsen und in Automatisierungs-Skripte einbinden:
```bash
# Generiere JSON
tree -J -L 2 > structure.json

# Parse mit jq
cat structure.json | jq '.[] | .name'
```

---

## 🎯 Zusammenfassung

**tree ist unverzichtbar für Project-Exploration** - simpel, aber mächtig.

**Quick Wins**:
- ✅ Projekt-Structure auf einen Blick
- ✅ Dokumentation automatisch generieren
- ✅ HTML-Export für Stakeholder
- ✅ Schnelle Disk-Usage-Analyse

**Installation**: 1 Minute
**Learning Curve**: 2 Minuten
**Produktivität**: +20% bei Projekt-Onboarding

---

**Nächster Schritt**: Nutze `tree -L 2 -I 'node_modules'` bei jedem neuen Projekt-Clone! 🌳

---

**Verwandte Lektionen**:
- [02 - eza](./02-eza.md) - Modernes ls mit Tree-Mode
- [01 - bat](./01-bat.md) - File-Preview (kombiniere mit tree)
- [12 - fzf](./12-fzf.md) - Interaktive Navigation

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0
