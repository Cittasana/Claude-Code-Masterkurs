# 🔍 delta - Git Diff Beautifier mit Syntax Highlighting

**Kategorie**: 🔵 Fortgeschrittene Tools
**Installation**: 3 Minuten
**Skill-Level**: Einfach
**Impact**: Instant (Code-Review-Quality)

---

> 🚀 **Claude Code Relevanz**: delta macht die von Claude Code generierten Code-Aenderungen sofort visuell verstaendlich -- mit Syntax-Highlighting und Word-Level-Diffs erkennst du auf einen Blick, was Claude geaendert hat.

## ✅ Berechtigung - Warum delta?

### Das Problem mit Git Diffs
Standard `git diff` Output ist funktional, aber schwer lesbar:
- ❌ **Keine Syntax Highlighting** - Code in Mono-Color
- ❌ **Schwer zu scannen** - `+`/`-` Zeichen nicht prominent
- ❌ **Line Numbers fehlen** - Wo ist die Änderung?
- ❌ **Side-by-Side unmöglich** - Nur unified diff
- ❌ **Unleserlich bei großen Diffs** - Lost in Text
- ❌ **Kein Word-Level Diff** - Was genau hat sich geändert?

**Beispiel**: 200-Zeilen-Diff in Standard `git diff` = Augen-Gymnastik.

### Die Lösung: delta
`delta` = Syntax-highlighted, feature-rich Git Diff:
- ✅ **Syntax Highlighting** - Code in Farbe (wie in Editor)
- ✅ **Word-Level Diffs** - Exakte Änderungen markiert
- ✅ **Line Numbers** - Immer sichtbar
- ✅ **Side-by-Side Mode** - Optional, für große Screens
- ✅ **Git Integration** - Ersetzt default Pager
- ✅ **Themes** - Dracula, Nord, Monokai, etc.
- ✅ **File-Headers** - Deutlich sichtbar

**Ergebnis**: Code-Review 2x schneller, Änderungen sofort erkennbar.

---

## 🎯 Zwecke - Wofür du delta einsetzt

delta verbessert jeden Arbeitsschritt, bei dem du Code-Aenderungen vergleichst -- von taeglichen Diffs bis hin zur Blame-Analyse.

### 1. **Git Diffs lesbar machen**
Statt mono-color:
```bash
git diff  # Nutzt delta automatisch
```

### 2. **Code-Review beschleunigen**
Word-Level Changes sehen:
```bash
git show HEAD  # Mit delta = instant understand
```

### 3. **Side-by-Side Comparison**
Große Refactorings:
```bash
delta --side-by-side file1.js file2.js
```

### 4. **Blame mit Highlighting**
Wer hat was geändert:
```bash
git blame src/app.js | delta
```

### 5. **Log mit Diffs**
Historie mit Code-Changes:
```bash
git log -p --color=always | delta
```

---

## 💻 Verwendung - Wie du delta einsetzt

Installation, Git-Integration und Konfiguration -- in wenigen Minuten ist delta einsatzbereit und verbessert sofort alle deine Git-Diffs.

### Installation

Waehle den passenden Paketmanager fuer dein System:

**macOS (Homebrew)**:
```bash
brew install git-delta
```

**Ubuntu/Debian**:
```bash
# Via Binary
wget https://github.com/dandavison/delta/releases/download/0.16.5/git-delta_0.16.5_amd64.deb
sudo dpkg -i git-delta_0.16.5_amd64.deb

# Oder: Via cargo
cargo install git-delta
```

**Arch Linux**:
```bash
sudo pacman -S git-delta
```

> 💡 **Tipp**: Nach der Installation genuegt ein einziger Eintrag in `~/.gitconfig` (`[core] pager = delta`), und alle git-Befehle wie `git diff`, `git show` und `git log -p` nutzen automatisch delta.

---

### Quick Start (2 Minuten)

Diese Eintraege in deiner Git-Konfiguration aktivieren delta als Standard-Pager fuer alle Git-Befehle. Danach nutzen `git diff`, `git show` und `git log -p` automatisch delta:

**Git Integration (automatisch)**:
```bash
# In ~/.gitconfig
[core]
    pager = delta

[interactive]
    diffFilter = delta --color-only

[delta]
    navigate = true
    light = false      # Dark theme
    line-numbers = true
    syntax-theme = Dracula

[merge]
    conflictstyle = diff3

[diff]
    colorMoved = default
```

**Dann**: Alle `git diff`, `git show`, `git log -p` nutzen delta automatisch!

---

### Advanced Usage

Von Theme-Anpassung ueber Side-by-Side-Modus bis zu Custom-Color-Schemes -- diese Optionen machen delta zu deinem persoenlichen Diff-Tool.

**1. Theme auswählen**:
delta unterstuetzt ueber 30 Syntax-Themes. Teste verschiedene Themes, um das passende fuer dein Terminal zu finden:
```bash
# Verfügbare Themes anzeigen
delta --list-syntax-themes

# Themes testen
git diff | delta --syntax-theme="Monokai Extended"

# In ~/.gitconfig setzen
[delta]
    syntax-theme = "Nord"
```

> 🚀 **Beispiel**: Nach einer Claude Code Session fuehrst du `git diff` aus und siehst dank delta sofort farblich hervorgehoben, welche Zeilen und sogar welche Woerter innerhalb einer Zeile geaendert wurden -- kein muehsames Vergleichen mehr.

**2. Side-by-Side Mode**:
Der Side-by-Side-Modus zeigt alten und neuen Code nebeneinander -- besonders nuetzlich bei grossen Refactorings:
```bash
# In ~/.gitconfig
[delta]
    side-by-side = true
    line-numbers-left-format = ""
    line-numbers-right-format = "│ "

# Oder: Per Command
git diff | delta --side-by-side
```

**3. File-Level Commands**:
delta kann auch ohne Git direkt zwei Dateien vergleichen -- ideal fuer Konfigurationsdateien oder Backups:
```bash
# Direkte File-Comparison (ohne Git)
delta file1.js file2.js

# Side-by-Side
delta --side-by-side old.js new.js

# Unified (Standard)
delta old.js new.js
```

**4. Custom Line-Number Format**:
Passe die Darstellung der Zeilennummern an, um schneller zwischen alter und neuer Version zu navigieren:
```bash
# In ~/.gitconfig
[delta]
    line-numbers = true
    line-numbers-left-format = "{nm:>4}┊"
    line-numbers-right-format = "{np:>4}│"
    line-numbers-left-style = blue
    line-numbers-right-style = blue
```

**5. Commit-Decoration**:
```bash
# In ~/.gitconfig
[delta]
    commit-decoration-style = bold yellow box ul
    file-decoration-style = none
    hunk-header-decoration-style = blue box
```

**6. Blame Integration**:
```bash
# In ~/.gitconfig
[delta]
    blame-format = "{author:<18} {commit:<8} {timestamp:<15}"

# Nutzen:
git blame src/app.js | delta
```

**7. Custom Color-Schemes**:
Definiere eigene Farbschemata als benannte Features, die du je nach Projekt aktivieren kannst:
```bash
# In ~/.gitconfig
[delta "custom-theme"]
    syntax-theme = Monokai Extended
    plus-style = "syntax #003800"
    minus-style = "syntax #3f0001"
    plus-emph-style = "syntax #006000"
    minus-emph-style = "syntax #a00009"

# Aktivieren:
[delta]
    features = custom-theme
```

---

## 🏆 Best Practices

Empfohlene Konfigurationen, die delta sofort produktiv machen -- von der globalen Git-Integration bis zur Claude Code Kombination.

### 1. **Git-Global aktivieren**
Dieses Setup-Script konfiguriert delta einmalig als globalen Git-Pager mit den besten Defaults:
```bash
# Setup-Script
cat > ~/setup-delta.sh << 'EOF'
#!/bin/bash
git config --global core.pager "delta"
git config --global interactive.diffFilter "delta --color-only"
git config --global delta.navigate true
git config --global delta.light false
git config --global delta.line-numbers true
git config --global delta.syntax-theme "Dracula"
EOF

chmod +x ~/setup-delta.sh
./setup-delta.sh
```

### 2. **Theme per Project**
Projekte mit hellem Hintergrund brauchen ein anderes Theme als dunkle Terminals -- nutze projekt-spezifische Git-Configs dafuer:
```bash
# In Projekt-Repo: .git/config
[delta]
    syntax-theme = "GitHub"  # Light theme für dieses Projekt
```

### 3. **Kombiniere mit lazygit**
lazygit nutzt standardmaessig den eingebauten Pager. Mit dieser Konfiguration werden Diffs stattdessen von delta gerendert:
```bash
# In ~/.config/lazygit/config.yml
git:
  paging:
    colorArg: always
    pager: delta --dark --paging=never
```

### 4. **Alias für Non-Git Files**
Mit diesem Alias ersetzt delta den Standard-diff-Befehl und bringt Syntax-Highlighting fuer alle Dateivergleiche:
```bash
# In ~/.bashrc oder ~/.zshrc
alias diff='delta'

# Nutzen:
diff file1.js file2.js  # Mit Syntax-Highlighting!
```

> ⚠️ **Warnung**: Der Side-by-Side-Modus benoetigt ein breites Terminal (mindestens 160 Spalten). Auf schmalen Bildschirmen fuehrt er zu unleserlichem Zeilenumbruch -- nutze in dem Fall den Standard-Unified-Modus.

### 5. **Navigate Mode nutzen**
Der Navigate-Modus erlaubt schnelles Springen zwischen geaenderten Dateien mit n/N -- essenziell bei Diffs mit vielen Dateien:
```bash
# In ~/.gitconfig
[delta]
    navigate = true

# Dann in diff:
# n = Next file
# N = Previous file
```

### 6. **Hyperlinks aktivieren**
In Terminals, die Hyperlinks unterstuetzen, kannst du direkt auf Dateinamen klicken, um sie im Editor zu oeffnen:
```bash
# In ~/.gitconfig
[delta]
    hyperlinks = true
    hyperlinks-file-link-format = "file://{path}"

# Dann: Klick auf Filename → öffnet Editor
```

### 7. **Claude Code Workflows**
```bash
# Nach Claude Code Session:
git diff | delta  # Review changes visuell

# Oder: In tmux mit split
# Pane 1: vim src/app.js
# Pane 2: watch -n 1 'git diff src/app.js | delta'
```

---

## 📝 Beispiele - Real-World Use-Cases

### Beispiel 1: Pre-Commit Code-Review

**Szenario**: Du willst sehen was du ändern wirst bevor du commitest.

```bash
# Standard (schlecht)
git diff  # Unleserlich

# Mit delta (gut)
git diff  # Delta automatisch aktiv

# Output:
# ─────────────────────────────────────────
# src/auth.js
# ─────────────────────────────────────────
#   42 │ export function login(username, password) {
#      │ -  return api.post('/auth', { user: username, pass: password });
#      │ +  return api.post('/auth/login', { username, password });
#   43 │ }
#
# Sichtbar:
# - Alte URL /auth → Neue /auth/login
# - Key-Name-Änderung: user→username, pass→password
# - Word-Level-Diff = exakte Changes highlighted
```

**Zeit gespart**: 30 Sekunden Verständnis vs. 2 Minuten Standard-Diff

---

### Beispiel 2: Code-Review eines PRs

**Szenario**: Kollege schickt PR, du willst schnell reviewen.

```bash
# PR checken
gh pr checkout 42

# Diff gegen main
git diff main...HEAD | delta

# Output:
# - Alle Files mit Syntax-Highlighting
# - Line-Numbers → Schnell zu Editor springen
# - Word-Level-Changes → Exakt sehen was geändert

# Schnelles Navigate:
# n → Nächstes File
# N → Vorheriges File

# Ergebnis: Review in 5 Min statt 15 Min
```

---

> 💡 **Tipp**: Aktiviere `navigate = true` in deiner delta-Konfiguration, um mit `n` und `N` schnell zwischen geaenderten Dateien zu springen -- besonders nuetzlich bei grossen Diffs mit vielen Dateien.

### Beispiel 3: Refactoring verstehen

**Szenario**: Großes Refactoring (500 Lines), was hat sich geändert?

```bash
# Side-by-Side-Vergleich
git diff HEAD~1 src/api.js | delta --side-by-side

# Output:
# ┌─────────────────────┬─────────────────────┐
# │ Before (HEAD~1)     │ After (HEAD)        │
# ├─────────────────────┼─────────────────────┤
# │ function getData()  │ async function      │
# │ {                   │ getData() {         │
# │   return fetch(...) │   return await      │
# │     .then(...)      │     fetch(...)      │
# │ }                   │ }                   │
# └─────────────────────┴─────────────────────┘

# Instant Verständnis: Callbacks → Async/Await
```

---

### Beispiel 4: Blame mit Context

**Szenario**: Wer hat diesen Bug eingeführt?

```bash
# Blame mit delta
git blame src/auth.js | delta

# Output:
# John Doe    a1b2c3d4  2025-01-15 │ 42 │ if (password = '123') {
#                                    ↑ Bug hier!

# Dann: Commit anschauen
git show a1b2c3d4 | delta

# Delta zeigt:
# - Full Diff des Commits
# - Syntax-Highlighted
# - Context: Was war vor/nach dieser Änderung
```

---

### Beispiel 5: Merge-Conflict-Inspektion

**Szenario**: Merge-Conflict, du willst verstehen was kollidiert.

```bash
# Nach failed merge
git diff --name-only --diff-filter=U  # Konfliktierte Files

# Diff mit 3-Way-Merge anzeigen
git diff | delta

# Output:
# ++<<<<<<< HEAD
# ++  const API_URL = 'https://api.prod.com';
# ++||||||| merged common ancestors
# ++  const API_URL = 'https://api.staging.com';
# ++=======
# ++  const API_URL = 'https://api.dev.com';
# ++>>>>>>> feature/new-api
#
# Ours:     prod.com
# Ancestor: staging.com
# Theirs:   dev.com

# Conflict reason: Beide Branches haben URL geändert
```

---

### Beispiel 6: History-Exploration

**Szenario**: Wann wurde Feature X eingeführt?

```bash
# Log mit Patches
git log -p --grep="authentication" -- src/auth.js | delta

# Output:
# commit a1b2c3d4
# Author: John Doe
# Date: 2025-01-15
#
# feat: Add JWT authentication
#
# ─────────────────────────────────
# src/auth.js
# ─────────────────────────────────
#   10 │ +import jwt from 'jsonwebtoken';
#   11 │ +
#   12 │ +export function verifyToken(token) {
#   13 │ +  return jwt.verify(token, process.env.JWT_SECRET);
#   14 │ +}

# Instant Verständnis: Feature wurde in diesem Commit hinzugefügt
```

---

## 🤖 Claude Code Integration

### Workflow 1: Claude Code Aenderungen visuell pruefen
```bash
# Claude Code Session: Nach Code-Generierung die Diffs reviewen
claude "Refactore die Auth-Logik zu async/await"
# Dann: Alle Aenderungen mit delta und Syntax-Highlighting anzeigen
git diff | delta
# Word-Level-Diffs zeigen exakt, was Claude geaendert hat
```

### Workflow 2: Side-by-Side Review grosser Claude-Refactorings
```bash
# Grosses Refactoring von Claude Code im Side-by-Side-Modus vergleichen
git diff HEAD~1 src/ | delta --side-by-side
# Links: alter Code, Rechts: neuer Code von Claude
# n/N zum Navigieren zwischen Dateien
```

### Workflow 3: Claude Code Commit-History mit delta inspizieren
```bash
# Die letzten Claude-generierten Commits mit vollen Diffs anzeigen
git log -p --since="1 hour ago" | delta
# Jeder Commit mit Syntax-Highlighting und Word-Level-Diffs
# Perfekt fuer Code-Review der AI-generierten Aenderungen
```

> 💡 **Tipp**: Claude Code kann delta automatisch in Code-Review-Workflows einsetzen -- konfiguriere delta einmal in `~/.gitconfig` und jeder `git diff`-Befehl profitiert sofort davon.

---

## 📺 Video-Tutorial

[delta - Better Git Diffs (dandavison/delta)](https://github.com/dandavison/delta)
Die offizielle Dokumentation mit interaktiven Beispielen und Screenshots zeigt anschaulich, wie delta Git-Diffs transformiert -- inklusive Konfigurationsanleitungen und Theme-Galerie.

---

## 🔧 Troubleshooting

Typische Probleme bei der delta-Einrichtung und deren Loesungen.

### Problem: "delta: command not found"

Das Binary ist entweder nicht installiert oder der Installationspfad (z.B. ~/.cargo/bin bei cargo-Installation) fehlt in der PATH-Variable.

**Lösung**: Installation + Path
```bash
# Check
which delta

# Installieren
brew install git-delta  # macOS
cargo install git-delta  # Universal

# Path checken
echo $PATH | grep cargo/bin
# Falls fehlt:
export PATH=$PATH:~/.cargo/bin
```

---

### Problem: "Git benutzt delta nicht"

Obwohl delta installiert ist, muss es explizit als Git-Pager konfiguriert werden -- die Installation allein reicht nicht.

**Lösung**: Git-Config checken
```bash
# Status
git config --global core.pager

# Sollte sein: delta
# Falls nicht:
git config --global core.pager "delta"
```

---

### Problem: "Colors falsch (zu dunkel/hell)"

Das gewaehlte Theme passt nicht zum Hintergrund deines Terminals (dunkles Theme auf hellem Hintergrund oder umgekehrt).

**Lösung**: Theme wechseln
```bash
# Dark Terminal
git config --global delta.light false
git config --global delta.syntax-theme "Dracula"

# Light Terminal
git config --global delta.light true
git config --global delta.syntax-theme "GitHub"
```

---

### Problem: "Side-by-Side zu breit (wrapping)"

Im Side-by-Side-Modus muessen zwei Code-Spalten nebeneinander passen. Bei schmalen Terminals werden Zeilen umgebrochen und unleserlich.

**Lösung**: Width konfigurieren
```bash
# In ~/.gitconfig
[delta]
    side-by-side = true
    width = 200  # Max width
    wrap-max-lines = 2

# Oder: Auf kleinen Screens deaktivieren
[delta]
    side-by-side = false  # Zurück zu Unified
```

---

### Problem: "Navigate-Keys (n/N) funktionieren nicht"

Die Navigate-Funktion ist standardmaessig deaktiviert und muss explizit in der Konfiguration eingeschaltet werden.

**Lösung**: Navigate-Mode aktivieren
```bash
# In ~/.gitconfig
[delta]
    navigate = true

# Reload:
source ~/.gitconfig
```

---

## 📊 delta vs. diff vs. diff-so-fancy - Der Vergleich

| Feature | `diff` | `diff-so-fancy` | `delta` |
|---------|--------|-----------------|---------|
| **Syntax Highlighting** | ❌ | ⚠️ Partial | ✅ Full |
| **Word-Level Diffs** | ❌ | ✅ | ✅ |
| **Line Numbers** | ⚠️ Manual | ⚠️ Manual | ✅ Built-in |
| **Side-by-Side** | ⚠️ -y flag | ❌ | ✅ Built-in |
| **Themes** | ❌ | ❌ | ✅ 30+ |
| **Git Integration** | ✅ | ✅ | ✅ |
| **Performance** | 🚀 | ⚠️ | 🚀 |
| **Maintained** | ✅ | ⚠️ Stale | ✅ Active |

**Fazit**:
- **diff**: Für Scripts, wenn Performance critical
- **diff-so-fancy**: Legacy, nutze delta stattdessen
- **delta**: Best-in-Class, modern, maintained

**Empfehlung**: delta für alles außer Scripts

---

## 🔗 Weiterführende Links

### Offizielle Ressourcen
- **GitHub**: https://github.com/dandavison/delta
- **Manual**: https://dandavison.github.io/delta/
- **Changelog**: https://github.com/dandavison/delta/releases

### Community
- **Discussions**: https://github.com/dandavison/delta/discussions
- **Issues**: https://github.com/dandavison/delta/issues

### Tutorials
- [delta Quickstart](https://dandavison.github.io/delta/introduction.html)
- [Full Config Example](https://dandavison.github.io/delta/configuration.html)

### Themes
- [Theme Gallery](https://dandavison.github.io/delta/syntax-highlighting-themes.html)
- [Custom Themes](https://dandavison.github.io/delta/custom-themes.html)

---

## 💡 Pro-Tipps

### 1. **Best-Theme-Kombination (Dark)**
```bash
# In ~/.gitconfig
[delta]
    syntax-theme = Dracula
    line-numbers = true
    navigate = true
    side-by-side = false
    plus-style = "syntax #003800"
    plus-emph-style = "syntax #006000"
    minus-style = "syntax #3f0001"
    minus-emph-style = "syntax #a00009"
```

### 2. **Diff-Highlight-Wrapper**
```bash
# In ~/.bashrc
diff-hl() {
  delta "$@" | less -R
}

# Nutzen:
diff-hl file1.js file2.js
```

### 3. **Integration mit bat**
```bash
# Combo: bat für Files, delta für Diffs
# In ~/.bashrc
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  cat() { bat "$@" }
else
  cat() { /bin/cat "$@" }
fi
```

### 4. **Commit-Template mit delta**
```bash
# In ~/.gitmessage
# feat: Short description
#
# What changed:
# - Item 1
# - Item 2
#
# Why:
# Reason here

# Dann: Commit-Message editieren
git config --global commit.template ~/.gitmessage
git commit  # Delta zeigt Diff im Editor!
```

### 5. **Fish Shell Integration**
```fish
# In ~/.config/fish/config.fish
set -gx DELTA_PAGER "less -R"
```

---

## 🎯 Zusammenfassung

**delta macht Git Diffs lesbar** - Syntax-Highlighting wie im Editor.

**Quick Wins**:
- ✅ Code-Review 2x schneller
- ✅ Word-Level-Diffs = exakte Changes
- ✅ Syntax-Highlighting automatisch
- ✅ Side-by-Side-Mode für große Diffs
- ✅ 30+ Themes (Dracula, Nord, Monokai)

**Installation**: 3 Minuten
**Learning Curve**: 0 Minuten (works out of the box)
**Produktivität**: +100% bei Code-Review

---

**Nächster Schritt**: Installiere delta, setze Git-Config, mach nächstes `git diff` - du wirst begeistert sein! 🔍

---

**Verwandte Lektionen**:
- [10 - lazygit](./10-lazygit.md) - Integriere delta in lazygit
- [08 - gh](./08-gh.md) - PR-Diffs mit delta anzeigen
- [01 - bat](./01-bat.md) - File-Viewer mit Syntax (ergänzt delta)

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0
