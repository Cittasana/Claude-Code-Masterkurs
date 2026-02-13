# 📖 tldr - Vereinfachte Man Pages

**Kategorie**: 🟢 Anfänger-Tools
**Installation**: 3 Minuten
**Skill-Level**: Einfach
**Impact**: Instant Help

---

> 🚀 **Claude Code Relevanz**: tldr ist dein Schnellnachschlagewerk waehrend Claude Code Sessions - wenn du einen Befehl brauchst, bekommst du in Sekunden praxisnahe Beispiele statt minutenlang Dokumentation zu durchsuchen.

## ✅ Berechtigung - Warum tldr?

### Das Problem mit `man`
Die klassischen Man Pages sind:
- ❌ **Zu lang** (oft 500+ Zeilen)
- ❌ **Zu detailliert** (Flags von 1980)
- ❌ **Nicht praxisorientiert** (keine Beispiele)
- ❌ **Schwer zu scannen** (keine Syntax Highlighting)
- ❌ **Überwältigend** für Anfänger

**Beispiel**: `man tar` hat 1000+ Zeilen, aber du brauchst nur "wie entpacke ich?"

### Die Lösung: tldr
`tldr` (Too Long; Didn't Read) gibt dir die wichtigsten 5-10 Beispiele:
- ✅ **Praxisbeispiele** statt Theorie
- ✅ **Syntax-highlighted** Commands
- ✅ **Kurz** (1 Bildschirm, ~20 Zeilen)
- ✅ **Community-driven** (tausende Tools)
- ✅ **Mehrsprachig** (Deutsch verfügbar!)
- ✅ **Schnell** (instant search)

**Ergebnis**: Du findest den richtigen Command in 5 Sekunden statt 5 Minuten.

> 💡 **Tipp**: Erstelle eine Shell-Funktion `h()` die zuerst `tldr` probiert und bei Fehler auf `man` zurueckfaellt - so hast du immer die schnellste Hilfe verfuegbar.

---

## 🎯 Zwecke - Wofür du tldr einsetzt

tldr deckt fuenf Hauptszenarien ab, in denen du schnell die richtige Befehlssyntax brauchst.

### 1. **Commands schnell nachschlagen**

Jeder Entwickler kennt das: Du weisst dass es einen Befehl gibt, aber die genaue Syntax ist dir entfallen. Klassische Man Pages sind hunderte Zeilen lang und ueberwaeltigend, wenn du nur eine schnelle Antwort brauchst. tldr gibt dir stattdessen die 5-10 haeufigsten Anwendungsfaelle mit konkreten Beispielen. Stell dir vor, du willst ein tar-Archiv entpacken und erinnerst dich nicht ob es `-xvf` oder `-xzf` heisst - `tldr tar` zeigt dir die richtige Syntax in Sekunden. Das Ergebnis ist ein kurzer, uebersichtlicher Output mit syntax-highlighted Befehlen, die du direkt kopieren und ausfuehren kannst.

```bash
tldr tar
# → Zeigt sofort: tar -xvf file.tar
```

### 2. **Neue Tools lernen**

Wenn du ein neues Tool installiert hast, willst du sofort wissen wie du es benutzt - nicht erst 20 Minuten Dokumentation lesen. tldr zeigt dir die wichtigsten Anwendungsfaelle mit konkreten Beispielen, sodass du in weniger als einer Minute produktiv bist. Die Beispiele sind von der Community geschrieben und spiegeln die haeufigsten realen Anwendungsfaelle wider. Stell dir vor, du hast ripgrep installiert und willst wissen wie du damit nach einem Pattern in allen JavaScript-Dateien suchst - `tldr ripgrep` gibt dir genau diese Beispiele. Das ist der schnellste Weg von "installiert" zu "produktiv".

```bash
tldr ripgrep
```

### 3. **Flags refreshen**

Selbst erfahrene Entwickler vergessen manchmal die genauen Flags eines Befehls, den sie nicht taeglich nutzen. Statt `man cp` mit 200 Zeilen durchzuscrollen, zeigt dir `tldr cp` die wichtigsten Optionen mit Erklaerung in nur wenigen Zeilen. Jedes Beispiel enthaelt den vollstaendigen Befehl mit Erklaerung, sodass du sofort siehst was jeder Flag tut. Stell dir vor, du willst einen Ordner rekursiv kopieren und weisst nicht mehr ob es `-r`, `-R` oder `--recursive` ist - tldr zeigt dir die richtige Syntax. Das spart dir den Umweg ueber Google oder StackOverflow.

```bash
tldr cp
```

### 4. **Common Use-Cases finden**

Komplexe Tools wie ffmpeg haben hunderte Optionen, aber die meisten Nutzer brauchen nur eine Handvoll davon. tldr zeigt dir genau die Anwendungsfaelle, die am haeufigsten vorkommen - kuratiert und geprueft von der Community. Das ist besonders wertvoll bei Tools mit kryptischer Syntax, wo die Man Page mehr verwirrt als hilft. Stell dir vor, du willst einfach nur ein Video von MP4 nach WebM konvertieren - statt 50 StackOverflow-Posts zu lesen, zeigt dir `tldr ffmpeg` den exakten Befehl. Die Beispiele werden staendig aktualisiert und repraesentieren aktuelle Best Practices.

```bash
tldr ffmpeg
```

### 5. **Alternative zu Google**

Wenn du bisher fuer jeden Befehl "how to use X" gegoogelt hast, ist tldr die schnellere Alternative. Statt Browser oeffnen, Suchergebnisse scannen, den richtigen StackOverflow-Post finden und die Antwort lesen, tippst du einfach `tldr` gefolgt vom Befehlsnamen und bekommst sofort die Antwort im Terminal. Das spart nicht nur Zeit, sondern unterbricht auch nicht deinen Terminal-Flow. Stell dir vor, du bist mitten in einer Coding-Session und brauchst die curl-Syntax fuer einen POST-Request - mit tldr hast du die Antwort in 3 Sekunden statt 30. Und im Gegensatz zu Google funktioniert tldr auch offline, nachdem du den Cache einmal heruntergeladen hast.

```bash
tldr curl
```

---

## 💻 Verwendung - Wie du tldr einsetzt

Installation, Grundbefehle und fortgeschrittene Optionen - alles was du fuer den produktiven Einsatz brauchst.

### Installation

tldr ist in mehreren Clients verfuegbar. Der System-Paketmanager ist der schnellste Weg.

**macOS (Homebrew)**:
Die einfachste Installation auf macOS ist ueber Homebrew. Das Paket enthaelt den Standard-tldr-Client, der in Python oder C geschrieben ist (je nach Version). Nach der Installation musst du einmalig `tldr --update` ausfuehren, um den lokalen Cache mit allen Pages herunterzuladen. Ohne diesen Schritt funktioniert kein einziger Befehl. Alternativ kannst du den schnelleren Rust-Client `tealdeer` installieren (siehe Pro-Tipps).

```bash
brew install tldr
```

**Ubuntu/Debian**:
Nach der Installation muss der lokale Cache einmalig heruntergeladen werden:
```bash
sudo apt install tldr

# Initial Cache-Update
tldr --update
```

**Arch Linux**:
Arch Linux bietet tldr ueber das Community-Repository an. Wie bei allen Arch-Paketen bekommst du die aktuellste Version. Vergiss nicht nach der Installation `tldr --update` auszufuehren, um den lokalen Cache herunterzuladen. Ohne Cache-Update bekommst du bei jedem Aufruf eine Fehlermeldung.

```bash
sudo pacman -S tldr
```

**Node.js (Universal)**:
Der Node.js-Client funktioniert auf allen Plattformen, auf denen Node.js installiert ist. Er wird global installiert und ist danach sofort im Terminal verfuegbar. Der Node.js-Client bietet farbigen Output und unterstuetzt alle Standard-Funktionen. Nach der Installation fuehre `tldr --update` aus um den Cache herunterzuladen. Beachte, dass der Node.js-Client etwas langsamer startet als der Rust-basierte tealdeer.

```bash
npm install -g tldr
```

**Python (Universal)**:
Der Python-Client ist eine weitere universelle Option, die ueberall funktioniert wo Python installiert ist. Er bietet aehnliche Funktionalitaet wie der Node.js-Client, ist aber manchmal etwas veraltet. Fuer die beste Erfahrung empfehlen wir den Homebrew-Client auf macOS oder tealdeer als Rust-Alternative. Auch hier gilt: Nach der Installation `tldr --update` ausfuehren, um den lokalen Cache herunterzuladen.

```bash
pip install tldr
```

> ⚠️ **Warnung**: Nach der Erstinstallation musst du `tldr --update` ausfuehren, um den lokalen Cache herunterzuladen. Ohne Cache-Update funktioniert kein einziger Befehl.

---

### Quick Start (30 Sekunden)

Die Nutzung ist denkbar einfach: `tldr` gefolgt vom Befehlsnamen zeigt dir die wichtigsten Beispiele.

**Basis-Usage**:
```bash
# Command nachschlagen
tldr git

# Subcommand nachschlagen
tldr git-commit

# Update Cache (neue Pages)
tldr --update

# Liste aller verfügbaren Pages
tldr --list
```

**Wichtigste Flags**:
Diese Flags steuern Sprache, Plattform und Cache-Verwaltung:
```bash
# -u, --update       Cache updaten
# -l, --list         Alle Pages auflisten
# -p, --platform     Platform auswählen (linux, osx, windows)
# -L, --language     Sprache (en, de, es, etc.)
```

---

### Advanced Usage

Fuer Cross-Platform-Entwicklung und Automatisierung bietet tldr erweiterte Optionen.

**1. Platform-spezifische Hilfe**:
Befehle unterscheiden sich zwischen Betriebssystemen - mit dem Platform-Flag bekommst du die richtige Version:
```bash
# macOS-spezifisch
tldr --platform osx open

# Linux-spezifisch
tldr --platform linux apt

# Windows-spezifisch
tldr --platform windows dir
```

**2. Sprache wechseln**:
tldr-Pages sind in ueber 30 Sprachen verfuegbar, darunter auch Deutsch. Mit dem `--language` Flag kannst du die Sprache fuer einzelne Aufrufe wechseln. Beachte, dass nicht alle Pages in allen Sprachen verfuegbar sind - bei fehlender Uebersetzung faellt tldr automatisch auf Englisch zurueck. Stell dir vor, du bist Einsteiger und verstehst die englischen Erklaerungen nicht vollstaendig - `--language de` zeigt dir deutsche Beschreibungen, wenn verfuegbar. Setze deine bevorzugte Sprache permanent mit einer Umgebungsvariable (siehe Best Practices).

```bash
# Deutsch
tldr --language de git

# Spanisch
tldr --language es docker

# Französisch
tldr --language fr npm
```

**3. Search & Filter**:
Finde alle verfuegbaren Pages zu einem bestimmten Tool-Oekosystem wie Git oder Docker:
```bash
# Alle Git-Commands
tldr --list | grep '^git-'

# Alle Docker-Commands
tldr --list | grep '^docker'

# Fuzzy-Search mit fzf
tldr --list | fzf --preview 'tldr {}'
```

**4. Offline-Usage**:
Nach einmaligem Cache-Update funktioniert tldr komplett ohne Internet:
```bash
# Cache einmal updaten
tldr --update

# Dann: Offline nutzbar
tldr curl  # (funktioniert ohne Internet)
```

**5. Custom Rendering**:
Manche Clients bieten verschiedene Ausgabeformate an. Mit `--render` bekommst du den Plain-Text-Output ohne Farben und Formatierung, was nuetzlich ist fuer die Weiterverarbeitung in Skripten. Der Markdown-Output gibt dir das Rohformat der tldr-Page, das du in eigene Dokumentationen einbinden kannst. Stell dir vor, du erstellst ein internes Cheatsheet fuer dein Team und willst die tldr-Texte dafuer verwenden - der Markdown-Export gibt dir das Ausgangsmaterial. Beachte, dass nicht alle Clients diese Optionen unterstuetzen.

```bash
# Plain-Text (kein Styling)
tldr --render git

# Oder: Als Markdown
tldr --markdown git
```

---

## 🏆 Best Practices

Diese Tipps machen tldr zu deinem staendigen Begleiter bei der Kommandozeilen-Arbeit.

### 1. **Regelmäßig Cache updaten**
Neue Tools und aktualisierte Pages werden nur nach einem Cache-Update verfuegbar:
```bash
# Wöchentlich (Cron Job)
crontab -e
# Add: 0 0 * * 0 /usr/local/bin/tldr --update

# Oder: Manuell bei Bedarf
alias tldr-update='tldr --update'
```

### 2. **Integration in Shell (Function)**
Diese Funktion versucht zuerst tldr und faellt bei unbekannten Befehlen automatisch auf man zurueck:
```bash
# In ~/.bashrc oder ~/.zshrc
h() {
  # Versuche zuerst tldr
  tldr "$1" 2>/dev/null || man "$1"
}

# Nutzen:
h git      # → tldr git
h obscure  # → man obscure (Fallback)
```

### 3. **Kombiniere mit fzf**
Mit fzf kannst du interaktiv durch alle verfuegbaren Pages browsen und die richtige mit Live-Preview finden:
```bash
# Interaktive Command-Suche
tldr-search() {
  tldr --list | fzf --preview 'tldr --color always {}' --preview-window=right:70%
}

# Oder als Alias
alias tldr-fzf='tldr --list | fzf --preview "tldr {}"'
```

### 4. **Language Preference setzen**
Setze deine bevorzugte Sprache als Umgebungsvariable, damit tldr automatisch deutsche Texte anzeigt wenn verfuegbar:
```bash
# Für deutschsprachige Docs
export TLDR_LANGUAGE=de

# Dann:
tldr git  # → Zeigt deutsche Version
```

### 5. **Combine mit Clipboard**

Eine besonders praktische Kombination ist tldr mit der Zwischenablage. Die folgende Funktion zeigt dir die tldr-Beispiele an, laesst dich mit fzf einen Befehl auswaehlen und kopiert ihn direkt in die Zwischenablage. So kannst du den Befehl sofort einfuegen und ausfuehren, ohne ihn manuell abtippen zu muessen. Stell dir vor, du suchst den richtigen git-Befehl, waehlst ihn aus der Liste aus und hast ihn sofort in der Zwischenablage. Das spart Zeit und verhindert Tippfehler bei komplexen Befehlen.

```bash
# Copy Command direkt
tldr-copy() {
  tldr "$1" | grep -E '^\s+-' | fzf | pbcopy
}

# Nutzen:
tldr-copy git
# → Wähle Command → Ist in Clipboard
```

### 6. **Für Claude Code Workflows**
Waehrend einer Claude Code Session hilft dir tldr, unbekannte Befehle schnell nachzuschlagen ohne den Flow zu unterbrechen:
```bash
# Schnelle Referenz während Development
tldr git-rebase
tldr docker-compose
tldr npm

# New Tool gelernt? Direkt nachschlagen
npm install -g some-tool
tldr some-tool
```

### 7. **Custom Pages hinzufuegen**

Du kannst eigene tldr-Pages fuer interne Tools, Custom Scripts oder haeufig verwendete Befehle erstellen. Das Format ist einfaches Markdown mit einer speziellen Struktur: Titel, Beschreibung und nummerierte Beispiele mit kurzer Erklaerung. Stell dir vor, dein Team hat ein internes Deployment-Skript mit vielen Flags - erstelle eine tldr-Page dafuer, und jeder im Team kann die Syntax schnell nachschlagen. Eigene Pages werden in einem separaten Ordner gespeichert und beim Aufruf genauso angezeigt wie die offiziellen Pages. Du kannst deine Pages auch als Pull Request zum offiziellen tldr-Repository beitragen, wenn sie fuer andere nuetzlich sind.

```bash
# Eigene Pages erstellen (in ~/tldr-custom/)
mkdir -p ~/tldr-custom/pages/common
vim ~/tldr-custom/pages/common/my-script.md

# Format:
# # my-script
# > Description
# - Example 1: `my-script --flag`
```

---

## 📝 Beispiele - Real-World Use-Cases

Sechs Praxisbeispiele zeigen, wie tldr dich in realen Situationen schneller macht.

### Beispiel 1: Git-Command schnell finden

**Szenario**: Du willst Branch erstellen, aber Syntax vergessen.

```bash
# Klassisch (schlecht)
man git-branch  # → 300 Zeilen

# Mit tldr (gut)
tldr git-branch

# Output:
# git branch
# > Main command for working with branches.
#
# List all branches:
# - git branch -a
#
# Create new branch:
# - git branch {{branch_name}}
#
# Delete branch:
# - git branch -d {{branch_name}}
#
# Rename current branch:
# - git branch -m {{new_name}}

# → Sofort gefunden: git branch my-feature
```

**Zeit gespart**: 2 Minuten vs. `man` oder Google

> 🚀 **Beispiel**: Waehrend einer Claude Code Session `tldr git-rebase` eintippen statt Google oeffnen - du bleibst im Flow und hast sofort die richtige Syntax.

---

### Beispiel 2: Neues Tool lernen

**Szenario**: Du hast `ripgrep` installiert, keine Ahnung wie nutzen.

```bash
# Installation
brew install ripgrep

# Sofort Usage lernen
tldr rg

# Output:
# rg
# > Recursively search for patterns in files.
#
# Search for pattern in current directory:
# - rg {{pattern}}
#
# Search case-insensitively:
# - rg -i {{pattern}}
#
# Search for pattern in specific directory:
# - rg {{pattern}} {{path/to/directory}}
#
# Include/exclude file types:
# - rg --type {{filetype}} {{pattern}}
# - rg --type-not {{filetype}} {{pattern}}

# → Instant Produktiv!
rg "TODO" src/
```

**Learning Curve**: 1 Minute statt 15 Minuten Docs lesen

> 💡 **Tipp**: Installiere den schnelleren Rust-Client `tealdeer` statt des Standard-Clients - er ist 10x schneller und fuehlt sich instant an.

---

### Beispiel 3: Komplexer Command (ffmpeg)

**Szenario**: Video konvertieren, `ffmpeg` ist cryptic.

```bash
# man ffmpeg → 5000 Zeilen (!!)
# Google → 50 StackOverflow-Posts

# Mit tldr (perfekt)
tldr ffmpeg

# Output (gekürzt):
# ffmpeg
# > Video conversion tool.
#
# Convert video to different format:
# - ffmpeg -i {{input.mp4}} {{output.avi}}
#
# Extract audio from video:
# - ffmpeg -i {{video.mp4}} -vn {{audio.mp3}}
#
# Resize video:
# - ffmpeg -i {{input.mp4}} -vf scale=1280:720 {{output.mp4}}
#
# Cut video (from 00:01:00 for 30 seconds):
# - ffmpeg -i {{input.mp4}} -ss 00:01:00 -t 00:00:30 {{output.mp4}}

# → Genau was ich brauchte!
ffmpeg -i video.mov output.mp4
```

**Produktivität**: Instant Solution statt 10-Minuten-Research

---

### Beispiel 4: Platform-spezifische Commands

**Szenario**: Du entwickelst auf Mac, deployst auf Linux.

```bash
# macOS: open Command
tldr --platform osx open

# Linux: xdg-open (Äquivalent)
tldr --platform linux xdg-open

# Windows: start Command
tldr --platform windows start

# Ergebnis: Du kennst alle Variants
```

**Vorteil**: Cross-Platform-Wissen in Sekunden

---

### Beispiel 5: Debugging Session

**Szenario**: Network-Issue, du brauchst `netstat` / `ss` / `tcpdump`.

```bash
# Quick Reference Stack
tldr netstat
tldr ss
tldr tcpdump
tldr curl
tldr ping

# Output von tldr netstat:
# netstat
# > Show network connections.
#
# List all listening ports:
# - netstat -tuln
#
# Find which program is using a port:
# - netstat -tulnp | grep {{:port}}

# → Sofort nutzbar!
netstat -tuln | grep :3000
```

**Zeit gespart**: 5 Minuten vs. einzeln googeln

---

### Beispiel 6: Docker-Befehle refreshen

**Szenario**: Docker lange nicht genutzt, Syntax vergessen.

```bash
# Quick Refresh
tldr docker
tldr docker-compose
tldr dockerfile

# Output (Auszug):
# docker
# > Manage containers.
#
# Run container:
# - docker run {{image}}
#
# Run container interactively:
# - docker run -it {{image}} /bin/bash
#
# List running containers:
# - docker ps
#
# Remove container:
# - docker rm {{container_id}}

# → Alles wieder fresh im Kopf!
```

**Produktivität**: Instant back to work

---

## 🤖 Claude Code Integration

tldr ergaenzt Claude Code perfekt - waehrend Claude Code den Code generiert, schlaegst du mit tldr die passenden Befehle nach.

### Workflow 1: Schnelle Command-Referenz waehrend Claude Code Session
Wenn du einen Befehl brauchst, den Claude Code vorgeschlagen hat, pruefe die Syntax schnell mit tldr:
```bash
# Claude Code Session: tldr fuer schnelle Befehlsreferenz
tldr git rebase
```

### Workflow 2: Unbekannte Commands nachschlagen
Wenn Claude Code einen Befehl vorschlaegt den du nicht kennst, hole dir schnell die Erklaerung:
```bash
tldr docker compose
```

### Workflow 3: Claude Code Vorschlaege verifizieren
Verifiziere Claude Code Vorschlaege mit tldr, um sicherzustellen dass die Flags korrekt verwendet werden:
```bash
tldr rsync
```

> 💡 **Tipp**: Wenn Claude Code einen Command vorschlaegt den du nicht kennst, nutze tldr fuer eine schnelle Erklaerung.

---

## 📺 Video-Tutorial

[tldr pages - Vereinfachte Man Pages (tldr.sh)](https://tldr.sh/)
Offizielle Website der tldr-pages mit Beispielen und Erklaerungen - lerne wie du Commands in Sekunden statt Minuten nachschlagen kannst.

---

## 🔧 Troubleshooting

Die haeufigsten Probleme mit tldr und ihre Loesungen.

### Problem: "Page not found"
Dieser Fehler erscheint, wenn der lokale Cache veraltet ist oder das Tool zu neu bzw. zu unbekannt fuer die tldr-Datenbank ist.

```bash
# Cache updaten
tldr --update

# Dann erneut probieren
tldr <command>

# Wenn immer noch nicht: Tool zu neu/obscure
# Fallback: man oder Google
```

---

### Problem: "Cache veraltet"
Neue Pages werden staendig zur tldr-Datenbank hinzugefuegt. Ohne regelmaessiges Update fehlen dir die neuesten Eintraege.

```bash
# Manuell updaten
tldr --update

# Oder: Auto-Update bei jedem Aufruf (langsam!)
# Besser: Weekly Cron (siehe Best Practices)
```

---

### Problem: "Sprache falsch (Englisch statt Deutsch)"
Standardmaessig zeigt tldr englische Texte. Fuer deutsche Ausgabe musst du die Sprache explizit setzen.

```bash
# Language Flag
tldr --language de git

# Oder: Permanent setzen
export TLDR_LANGUAGE=de
echo 'export TLDR_LANGUAGE=de' >> ~/.bashrc
```

---

### Problem: "Keine Colors (unleserlich)"
Ohne Farbunterstuetzung im Terminal wird der Output als grauer Text angezeigt und die Syntax-Beispiele sind schwer zu lesen.

```bash
# Check Terminal
echo $TERM  # Sollte 'xterm-256color' oder ähnlich sein

# Falls nicht: In ~/.bashrc
export TERM=xterm-256color

# Oder: Force Color
tldr --color always git
```

---

## 📊 tldr vs. man vs. --help - Der Vergleich

| Feature | `man` | `--help` | `tldr` |
|---------|-------|----------|--------|
| **Länge** | 📜 Sehr lang | 📄 Mittel | 📋 Kurz |
| **Beispiele** | ❌ Wenige | ⚠️ Manchmal | ✅ Viele |
| **Praxisnähe** | ⚠️ Theoretisch | ⚠️ Flags-Liste | ✅ Use-Cases |
| **Lernkurve** | 🐌 Steil | 🐌 Moderat | 🚀 Flach |
| **Availability** | ✅ Überall | ✅ Meist | ⚠️ Muss installiert |
| **Sprachen** | ❌ Meist nur EN | ❌ Meist nur EN | ✅ 30+ Sprachen |

**Fazit**:
- `tldr` für Quick Start
- `man` für Deep Dive
- `--help` als Fallback

**Workflow**: `tldr` → `--help` → `man` (steigernde Detailtiefe)

---

## 🔗 Weiterführende Links

### Offizielle Ressourcen
- **Website**: https://tldr.sh/
- **GitHub**: https://github.com/tldr-pages/tldr
- **Contribute**: https://github.com/tldr-pages/tldr/blob/main/CONTRIBUTING.md

### Community
- **Discord**: https://discord.gg/tldr
- **Gitter**: https://gitter.im/tldr-pages/tldr

### Alternative Clients
- **tealdeer**: Rust-basierter Client (schneller)
- **tldr-node-client**: Node.js Client
- **tldr-python-client**: Python Client
- **outfieldr**: Alternative mit mehr Features

### Web-Version
- https://tldr.inbrowser.app/ (kein Install nötig)

---

## 💡 Pro-Tipps

Fortgeschrittene Techniken fuer Power-User, die tldr noch effizienter einsetzen wollen.

### 1. **Schnellerer Client (tealdeer)**
Der Rust-basierte Client tealdeer ist deutlich schneller als der Standard-Client und fuehlt sich instant an:
```bash
# Rust-Version (10x schneller)
brew install tealdeer

# Alias (gleiche API)
alias tldr='tlrc'

# Cache-Update
tldr --update
```

### 2. **Integration in IDE (VS Code)**

Fuer VS Code gibt es eine tldr-Extension, die dir die Befehls-Dokumentation direkt in der IDE anzeigt. Du markierst einen Befehl im integrierten Terminal oder im Code und bekommst sofort die tldr-Page angezeigt. Das ist besonders nuetzlich wenn du Shell-Skripte schreibst und die Syntax eines Befehls pruefen willst, ohne das Terminal zu oeffnen. Stell dir vor, du siehst in einem Dockerfile einen unbekannten Befehl und willst wissen was er tut - ein Klick genuegt. Suche in den VS Code Extensions nach "tldr-pages" und installiere die Erweiterung.

```bash
# Extension: tldr-pages
# → Inline Command-Hilfe
```

### 3. **Custom Workflow Function**

Diese Shell-Funktion erstellt eine smarte Hilfe-Funktion, die zuerst tldr versucht und bei unbekannten Befehlen automatisch auf die klassische Man Page zurueckfaellt. Das ist der beste Ansatz, weil tldr die schnellere und praxisnahere Referenz bietet, aber nicht jeden obskuren Befehl abdeckt. In solchen Faellen greift die Funktion automatisch auf `man` zurueck. Stell dir vor, du suchst Hilfe zu einem seltenen System-Tool das keine tldr-Page hat - die Funktion zeigt dir dann die Man Page an statt "not found". Fuege diese Funktion in deine .zshrc ein und nutze `help befehlsname` statt tldr.

```bash
# In ~/.zshrc: Smart Help
help() {
  if command -v tldr >/dev/null; then
    tldr "$1" || man "$1" || echo "No help available for $1"
  else
    man "$1"
  fi
}
```

### 4. **Contribution (neue Pages)**

Die tldr-Datenbank ist Community-driven und lebt von Beitraegen. Wenn du bemerkst, dass ein Tool keine Page hat oder die bestehende Page unvollstaendig ist, kannst du eine neue Page erstellen und als Pull Request einreichen. Das Format ist einfaches Markdown mit einer definierten Struktur: ein Titel, eine kurze Beschreibung und konkrete Beispiele. Stell dir vor, du hast ein nuetzliches Tool entdeckt das noch keine tldr-Page hat - dein Beitrag hilft tausenden anderen Entwicklern. Folge der CONTRIBUTING.md im offiziellen Repository fuer die genauen Formatierungs-Richtlinien.

```bash
# Wenn Tool fehlt: Contribution!
# 1. Fork: https://github.com/tldr-pages/tldr
# 2. Erstelle: pages/common/<tool>.md
# 3. Format: siehe CONTRIBUTING.md
# 4. PR erstellen

# Beispiel:
# # my-tool
# > Short description.
# - Example: `my-tool --flag`
```

---

## 🎯 Zusammenfassung

**tldr ist dein Command-Line-Lexikon** - immer griffbereit.

**Quick Wins**:
- ✅ Commands in Sekunden finden
- ✅ Neue Tools schnell lernen
- ✅ Keine Zeit mit `man` verschwenden
- ✅ Praxisbeispiele statt Theorie

**Installation**: 2 Minuten
**Learning Curve**: 0 Minuten
**Produktivität**: +30% bei Command-Line-Arbeit

---

**Nächster Schritt**: Installiere `tldr` und nutze es ab jetzt statt Google für Commands! 📖

---

**Verwandte Lektionen**:
- [06 - httpie](./06-httpie.md) - HTTP Client (nutze tldr zum Lernen)
- [07 - jq](./07-jq.md) - JSON Tool (nutze tldr für Syntax)
- [08 - gh](./08-gh.md) - GitHub CLI (nutze tldr für Commands)

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0
