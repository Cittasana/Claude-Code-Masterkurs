# 🌳 lazygit - Terminal UI für Git-Workflows

**Kategorie**: 🔵 Fortgeschrittene Tools
**Installation**: 5 Minuten
**Skill-Level**: Mittel
**Impact**: Massiv (Game-Changer für Git)

---

> 🚀 **Claude Code Relevanz**: lazygit ist der perfekte Begleiter fuer Claude Code -- waehrend Claude Code deinen Code generiert, kannst du mit lazygit visuell stagen, committen und Branch-Management betreiben, ohne einen einzigen git-Befehl tippen zu muessen.

## ✅ Berechtigung - Warum lazygit?

### Das Problem mit Git CLI
Git ist mächtig, aber die CLI kann überwältigend sein:
- ❌ **Commands vergessen**: Was war nochmal `git rebase -i HEAD~5`?
- ❌ **Staging-Chaos**: `git add -p` ist umständlich
- ❌ **Branch-Juggling**: Welcher Branch war nochmal wo?
- ❌ **Merge-Conflicts**: Manuelles Editing ist Error-prone
- ❌ **History verstehen**: `git log` ist unübersichtlich
- ❌ **Visuelles Feedback fehlt**: Was passiert gerade?

**Beispiel**: Interactive Rebase mit CLI = 10+ Commands, viel tippen, Fehler-anfällig.

### Die Lösung: lazygit
`lazygit` = Terminal UI für Git - visuell, intuitiv, schnell:
- ✅ **Visuell**: Alle Changes/Branches/Commits auf einen Blick
- ✅ **Keyboard-Driven**: Vim-style Navigation, keine Maus nötig
- ✅ **Interactive**: Staging, Rebasing, Cherry-Picking mit wenigen Keys
- ✅ **Smart Conflicts**: Merge-Conflicts visuell auflösen
- ✅ **Git-Historie**: Tree-View mit Branches
- ✅ **Schnell**: Weniger tippen, mehr tun

**Ergebnis**: Git-Workflows 3x schneller, weniger Fehler, mehr Übersicht.

---

## 🎯 Zwecke - Wofür du lazygit einsetzt

Die fuenf Haupteinsatzgebiete zeigen, warum lazygit die meisten Git-Workflows deutlich beschleunigt -- vom taeglichen Staging bis zur Konfliktloesung.

### 1. **Staging & Committing**

Das visuelle Staging in lazygit ersetzt den umstaendlichen `git add`-Workflow komplett. Statt Dateinamen tippen oder `git add -p` fuer Hunk-Auswahl zu nutzen, siehst du alle geaenderten Dateien in einer uebersichtlichen Liste und kannst sie einzeln mit der Leertaste stagen. Das ist besonders nuetzlich, wenn du an mehreren Features gleichzeitig gearbeitet hast und die Aenderungen in separate Commits aufteilen willst. Stell dir vor, du hast sowohl einen Bug gefixt als auch ein neues Feature angefangen -- in lazygit siehst du sofort, welche Dateien zu welcher Aenderung gehoeren, und stagst sie gezielt. Nach dem Staging genuegt ein einzelnes C, um die Commit-Message einzugeben und den Commit abzuschliessen.

```
Files → Space (Stage) → C (Commit)
```

### 2. **Branch-Management**

Branch-Management ueber die Git-CLI erfordert mehrere Befehle und genaues Tippen der Branch-Namen. lazygit vereinfacht das auf wenige Tastendruecke: Du siehst alle Branches in einer Liste, kannst neue erstellen, zwischen ihnen wechseln oder sie mergen. Stell dir vor, du willst einen neuen Feature-Branch erstellen, um eine Authentifizierung zu implementieren -- statt `git checkout -b feature/auth` zu tippen, drueckst du B fuer Branches, N fuer New und gibst den Namen ein. Das ist nicht nur schneller, sondern du siehst auch immer, auf welchem Branch du gerade bist und welche Branches es gibt. Ein versehentliches Arbeiten auf dem falschen Branch passiert damit praktisch nie mehr.

```
B (Branches) → N (New) → Enter
```

### 3. **Interactive Rebase**

Interactive Rebase ist eine der maechtigsten Git-Funktionen, aber ueber die CLI auch eine der kompliziertesten. Mit `git rebase -i HEAD~5` musst du einen Editor oeffnen, kryptische Pick/Squash/Drop-Befehle schreiben und hoffen, dass nichts schief geht. In lazygit navigierst du einfach im Commits Panel zum gewuenschten Commit, drueckst E und waehlst die Aktion visuell aus. Stell dir vor, du hast 8 kleine WIP-Commits und willst sie vor dem PR zu 2 sauberen Commits zusammenfassen -- in lazygit siehst du jeden Commit mit seinem Diff und kannst gezielt Squash oder Fixup anwenden. Das Ergebnis ist eine saubere Git-Historie ohne die Angst, bei einem manuellen Rebase etwas kaputt zu machen.

```
Commits → E (Rebase) → Squash/Fixup/Edit
```

### 4. **Merge-Conflict-Resolution**

Merge-Konflikte manuell im Editor zu loesen ist fehleranfaellig und zeitaufwaendig -- du musst die Conflict-Marker (`<<<<<<<`, `=======`, `>>>>>>>`) finden, verstehen was "Ours" und "Theirs" bedeutet, und dann den richtigen Code behalten. lazygit zeigt Konflikte in einer uebersichtlichen 3-Wege-Ansicht: links dein Code, rechts der eingehende Code, und in der Mitte das Ergebnis. Stell dir vor, zwei Entwickler haben dieselbe Funktion unterschiedlich geaendert -- in lazygit siehst du beide Versionen nebeneinander und waehlst per Tastendruck die richtige. Mit Pfeil links nimmst du deine Version, Pfeil rechts die des Kollegen, und B behalt beide Aenderungen. Das macht Konflikte von einer gefuerchteten Aufgabe zu einer schnellen visuellen Entscheidung.

```
Files → Enter (Konflikt-View) → ←/→ (Choose)
```

### 5. **Stash-Management**

Git Stash ist eine haeufig uebersehene Funktion, die unglaublich nuetzlich ist: Du kannst deine aktuellen Aenderungen temporaer "parken", um schnell etwas anderes zu erledigen, und sie spaeter wieder anwenden. Ueber die CLI musst du dir Stash-Namen merken und mit kryptischen Befehlen wie `git stash pop stash@{2}` hantieren. In lazygit genuegt ein W, um die aktuellen Aenderungen zu stashen, und ein G, um sie spaeter wieder zu holen. Stell dir vor, du arbeitest an einem Feature und ploetzlich meldet sich jemand mit einem dringenden Bug -- mit W parkst du deine Arbeit, wechselst zum Fix-Branch, und nach dem Bugfix holst du mit G alles zurueck. Du siehst ausserdem alle Stashes in einer uebersichtlichen Liste und kannst den Inhalt jedes Stashs vor dem Anwenden inspizieren.

```
W (Stash) → später: G (Pop)
```

---

## 💻 Verwendung - Wie du lazygit einsetzt

Dieser Abschnitt deckt Installation, erste Schritte und fortgeschrittene Workflows ab -- vom ersten Start bis zur Custom-Konfiguration.

### Installation

Die Installation ist auf allen Plattformen einfach -- waehle deinen Paketmanager:

**macOS (Homebrew)**:
```bash
brew install lazygit
```

**Ubuntu/Debian**:
```bash
# Via PPA
sudo add-apt-repository ppa:lazygit-team/release
sudo apt update
sudo apt install lazygit
```

**Arch Linux**:
```bash
sudo pacman -S lazygit
```

**Go Install (Universal)**:
```bash
go install github.com/jesseduffield/lazygit@latest
```

> 💡 **Tipp**: Setze sofort den Alias `alias lg='lazygit'` in deiner Shell-Config -- du wirst lazygit so oft verwenden, dass sich die zwei gesparten Zeichen schnell summieren.

---

### Quick Start (2 Minuten)

**Starten**:

Um lazygit zu nutzen, navigierst du einfach in ein Verzeichnis mit Git-Repository und startest es. lazygit erkennt automatisch den Git-Status und zeigt alle geaenderten Dateien, Branches und Commits an. Da du lazygit mehrmals taeglich verwenden wirst, empfiehlt sich ein kurzer Alias wie `lg`. Stell dir vor, du oeffnest dein Terminal, tippst `lg` und hast sofort den kompletten Ueberblick ueber dein Repository -- geaenderte Dateien, aktiver Branch, letzte Commits. Das ist deutlich schneller als mehrere git-Befehle einzeln einzutippen.

```bash
# In Git-Repo
cd ~/projekt
lazygit

# Oder: Mit Alias
alias lg='lazygit'
lg
```

**UI-Übersicht**:
```
┌─────────────────────────────────────┐
│ Status  │ Files │ Branches │ Commits│  ← Panels
├─────────────────────────────────────┤
│ Modified: README.md                 │
│ Untracked: new-file.js              │  ← File-List
│ Deleted: old-config.json            │
├─────────────────────────────────────┤
│ 🔸 + 50 lines                       │
│ 🔸 - 12 lines                       │  ← Diff
└─────────────────────────────────────┘
```

**Wichtigste Keybindings**:
```
Navigation:
  ←/→     - Zwischen Panels wechseln
  ↑/↓     - In Listen navigieren
  J/K     - Schnelles Scrollen
  Enter   - Details öffnen

Actions:
  Space   - Stage/Unstage File
  A       - Stage alle Files
  C       - Commit
  P       - Push
  P       - Pull (Shift+P)
  B       - Branches anzeigen
  W       - Stash Changes
  G       - Pop Stash

Help:
  ?       - Keybinding-Hilfe
  X       - Command-Menu
  Q       - Quit
```

---

### Advanced Usage

Diese fortgeschrittenen Techniken decken die maechtigsten Features von lazygit ab -- vom zeilenweisen Staging bis hin zu benutzerdefinierten Befehlen.

**1. Selective Staging (Line-by-Line)**:
Statt ganze Dateien zu stagen, kannst du einzelne Hunks oder sogar einzelne Zeilen auswaehlen:
```
1. Gehe zu File
2. Enter → Diff anzeigen
3. Space auf einzelnen Hunks → Stage nur diese Lines
4. Tab → Nächster Hunk
```

**2. Interactive Rebase**:
Interactive Rebase ist eine der maechtigsten Git-Funktionen und in lazygit besonders einfach zu bedienen:
```
1. Gehe zu Commits Panel (→→)
2. Wähle Start-Commit
3. E → Rebase Menu
4. Pick/Squash/Fixup/Reword/Drop
5. Enter → Rebase ausführen
```

**3. Branch-Workflow**:

Der Branch-Workflow in lazygit deckt den gesamten Lebenszyklus eines Feature-Branches ab: Erstellen, Wechseln, Mergen und Loeschen. Alle diese Operationen erreichst du ueber das Branches Panel mit der Taste B. Stell dir vor, du startest ein neues Feature und brauchst einen Branch dafuer -- statt `git checkout -b feature/new-auth` zu tippen, drueckst du B, N, gibst den Namen ein, und der Branch ist erstellt und ausgecheckt. Wenn du fertig bist, wechselst du zu main zurueck und mergst mit M. Beachte, dass D einen Branch loescht und nicht rueckgaengig gemacht werden kann.

```
# Neuer Branch
B → N → "feature/new-auth" → Enter

# Switch Branch
B → ↑/↓ wählen → Enter

# Merge Branch
B → M → "main" auswählen → Enter

# Delete Branch
B → D
```

> ⚠️ **Warnung**: Bei Interactive Rebase mit Squash gehen die urspruenglichen Commit-Messages verloren, wenn du nicht aufpasst. Pruefe immer die finale Commit-Message nach dem Squash sorgfaeltig.

**4. Conflict-Resolution**:
lazygit zeigt Merge-Konflikte in einer uebersichtlichen 3-Wege-Ansicht und laesst dich per Tastendruck die richtige Version waehlen:
```
1. Merge führt zu Conflicts
2. Files Panel → Conflicted Files (rot)
3. Enter → 3-Way Diff
4. ← (Ours) oder → (Theirs) oder B (Both)
5. Space → Mark Resolved
6. C → Commit Merge
```

**5. Stash-Workflow**:

Der Stash-Workflow in lazygit bietet dir eine komplette visuelle Verwaltung deiner geparkten Aenderungen. Du kannst Stashes erstellen, anzeigen, anwenden und loeschen -- alles ueber das Stash Panel (Ziffer 3). Stell dir vor, du hast experimentelle Aenderungen, die du nicht committen willst, aber auch nicht verlieren moechtest. Mit W gibst du dem Stash einen beschreibenden Namen, und spaeter kannst du im Stash Panel den Diff inspizieren, bevor du dich entscheidest, ob du Apply (ohne Loeschen) oder Pop (mit Loeschen) verwendest. Achte darauf, den Unterschied zwischen Apply und Pop zu kennen: Apply behaelt den Stash in der Liste, Pop entfernt ihn nach dem Anwenden.

```
# Stash erstellen
W → "WIP: experimental feature" → Enter

# Stash anzeigen
3 (Stash Panel)

# Stash apply
Enter → A (Apply)

# Stash pop
Enter → G (Pop)

# Stash drop
Enter → D (Drop)
```

**6. Cherry-Pick**:

Cherry-Pick ermoeglicht es dir, einzelne Commits von einem Branch auf einen anderen zu uebertragen, ohne den gesamten Branch zu mergen. Das ist besonders nuetzlich, wenn ein Bugfix auf einem Feature-Branch erstellt wurde, aber auch auf dem main-Branch benoetigt wird. In lazygit ist Cherry-Pick visuell und erfordert kein Kopieren von Commit-Hashes. Du markierst den gewuenschten Commit mit C (Copy), wechselst zum Ziel-Branch und fuegst ihn mit V (Paste) ein. Stell dir vor, ein Kollege hat einen wichtigen Sicherheits-Fix auf seinem Feature-Branch, den du dringend auf main brauchst -- mit Cherry-Pick holst du genau diesen einen Commit, ohne das gesamte Feature mitzunehmen.

```
1. Gehe zu Commits Panel
2. Wähle Commit
3. C → Cherry-Pick
4. Gehe zu Target-Branch
5. V → Paste (Cherry-Pick ausführen)
```

**7. Custom Commands**:
Du kannst eigene Befehle definieren und per Tastendruck ausfuehren -- ideal fuer wiederkehrende Workflows:
```bash
# Config: ~/.config/lazygit/config.yml
customCommands:
  - key: 'R'
    command: 'git reset --hard origin/{{.CheckedOutBranch.Name}}'
    context: 'global'
    description: 'Reset to origin'

  - key: 'F'
    command: 'git fetch --all --prune'
    context: 'global'
    description: 'Fetch all & prune'
```

---

## 🏆 Best Practices

Bewaehrte Konfigurationen und Workflows, die lazygit noch produktiver machen.

### 1. **Alias setzen**
Da du lazygit mehrmals taeglich nutzen wirst, spart ein kurzer Alias wie `lg` viel Tipparbeit:
```bash
# In ~/.bashrc oder ~/.zshrc
alias lg='lazygit'
alias lgs='lazygit --use-config-file ~/.config/lazygit/config-simple.yml'
```

### 2. **Custom Config erstellen**
Diese Konfiguration verbessert das Farbschema, aktiviert den Dateibaum und integriert delta als Diff-Pager:
```bash
# ~/.config/lazygit/config.yml
gui:
  theme:
    activeBorderColor:
      - green
      - bold
    inactiveBorderColor:
      - white
  showFileTree: true
  showBranchCommitHash: true

git:
  paging:
    colorArg: always
    pager: delta --dark --paging=never

keybinding:
  universal:
    quit: 'Q'
    return: 'q'
```

> 🚀 **Beispiel**: Der typische Claude Code + lazygit Workflow: Claude Code generiert Code in Pane 1, du wechselst zu Pane 2, tippst `lg`, siehst alle Aenderungen visuell, stagst gezielt einzelne Hunks mit Space, und committst mit C -- alles in unter 30 Sekunden.

### 3. **Integration mit git aliases**

Wenn du lazygit als Teil deines regulaeren Git-Workflows nutzen willst, kannst du es als Git-Alias registrieren. Das bedeutet, du kannst `git lg` statt `lazygit` tippen, was sich natuerlicher anfuehlt und konsistent mit anderen Git-Befehlen ist. Diese Integration ist besonders praktisch fuer Teams, die noch nicht alle mit lazygit vertraut sind -- sie koennen weiterhin Git-Befehle nutzen, und `git lg` bietet den Einstieg in die visuelle Variante. Der Alias wird global gesetzt und funktioniert in jedem Repository. Das Ausrufezeichen vor `lazygit` weist Git an, dass es sich um einen externen Befehl handelt.

```bash
# In ~/.gitconfig
[alias]
  lg = !lazygit

# Nutzen:
git lg  # Startet lazygit
```

### 4. **Commit-Conventions**

Konsistente Commit-Messages sind entscheidend fuer eine lesbare Git-Historie, besonders in Teams. lazygit kann so konfiguriert werden, dass es automatisch Sign-Off-Zeilen hinzufuegt oder ein Commit-Template laedt. Das Sign-Off-Flag fuegt eine "Signed-off-by"-Zeile mit deinem Namen und E-Mail hinzu, was bei vielen Open-Source-Projekten und Unternehmen Pflicht ist. Stell dir vor, dein Team nutzt Conventional Commits (feat:, fix:, docs:) -- mit der richtigen Konfiguration wirst du beim Committen automatisch daran erinnert. Diese Einstellung sorgt dafuer, dass jeder Commit den Team-Standards entspricht, ohne dass du daran denken musst.

```
# Nutze lazygit's Commit-Template
# In Config:
git:
  commit:
    signOff: true

# Dann: C → Template wird geladen
```

### 5. **Fuzzy-Finder für Branches**

In grossen Projekten mit dutzenden Branches wird das manuelle Scrollen durch die Branch-Liste schnell unuebersichtlich. lazygit hat einen eingebauten Fuzzy-Finder, den du im Branches Panel mit / aktivierst. Damit filterst du Branches in Echtzeit, aehnlich wie fzf. Stell dir vor, dein Team hat 50+ Feature-Branches und du suchst den Branch fuer das Login-Feature -- statt durch die gesamte Liste zu scrollen, tippst du einfach "login" und siehst sofort alle passenden Branches. Der Filter funktioniert als Substring-Match, sodass du nicht den exakten Anfang des Branch-Namens kennen musst. Das spart bei haeufigem Branch-Wechsel erheblich Zeit.

```
# In lazygit:
B → / → "feat" → Enter
# Findet alle Branches mit "feat"
```

> 💡 **Tipp**: Integriere delta als Pager in lazygit fuer noch bessere Diff-Darstellung. Fuege `pager: delta --dark --paging=never` in deine lazygit config.yml ein.

### 6. **Kombination mit gh (GitHub CLI)**

Der typische Feature-Workflow endet nicht beim Commit und Push -- du willst auch einen Pull Request erstellen. Durch die Kombination von lazygit mit der GitHub CLI (gh) kannst du den gesamten Workflow vom Staging bis zum PR in wenigen Sekunden abwickeln. Alternativ kannst du gh direkt als Custom Command in lazygit integrieren, sodass du den PR aus lazygit heraus erstellen kannst, ohne in ein anderes Terminal zu wechseln. Stell dir vor, du hast gerade ein Feature fertig, staged und committed alles in lazygit, pushst mit P, und erstellst dann den PR direkt mit dem Custom Command. Das spart den Kontextwechsel zum Terminal und haelt dich im Flow.

```bash
# Nach Commit in lazygit:
# Wechsel zu Terminal
gh pr create --fill

# Oder: Custom Command in lazygit
customCommands:
  - key: 'P'
    command: 'gh pr create --fill'
    context: 'global'
    description: 'Create PR'
```

### 7. **Claude Code Workflows**

Der ideale Workflow mit Claude Code und lazygit besteht aus vier Schritten: Claude Code generiert den Code, lazygit zeigt dir visuell alle Aenderungen, du stagst gezielt die gewuenschten Aenderungen und committst sie, und schliesslich erstellst du einen PR. Dieses Zusammenspiel ist deshalb so wichtig, weil Claude Code manchmal mehr Dateien aendert als gewuenscht -- mit lazygit kannst du die Aenderungen einzeln pruefen und nur die relevanten committen. Stell dir vor, Claude hat eine API-Route erstellt, aber auch unerwuenschte Aenderungen an der Konfiguration vorgenommen. In lazygit siehst du den Diff jeder Datei und entscheidest, welche Aenderungen in den Commit kommen. Nutze dazu einen tmux-Split: Links Claude Code, rechts lazygit fuer das Staging.

```bash
# Workflow:
# 1. Code in Claude Code entwickeln
# 2. lg (lazygit) → Staging + Commit
# 3. Push
# 4. gh pr create (im Terminal)

# Instant Visual Feedback:
watch -n 1 'git status'  # In tmux Pane
# + lazygit in anderem Pane
```

---

## 📝 Beispiele - Real-World Use-Cases

### Beispiel 1: Feature-Branch → Main (Clean History)

**Szenario**: Du hast 10 messy Commits, willst 1 sauberen Commit.

```
# In lazygit:

1. Commits Panel (→→)
2. Wähle ältesten Commit (↓↓↓)
3. E → Rebase Interactive
4. Markiere Commits:
   - First: Pick
   - Rest: S (Squash)
5. Enter → Rebase läuft
6. Commit-Message editieren → :wq
7. P → Push --force-with-lease

Ergebnis: 1 sauberer Commit statt 10 messy
```

**Zeit gespart**: 2 Minuten vs. 10 Minuten mit CLI

---

### Beispiel 2: Hotfix während Feature-Development

**Szenario**: Du arbeitest an Feature, Produktions-Bug kommt rein.

```
# In lazygit:

1. W → Stash Changes ("WIP: feature X")
2. B → Switch to "main"
3. B → N → "hotfix/login-bug"
4. ... fix bug in Editor ...
5. lg → A (Stage All) → C (Commit) → P (Push)
6. B → Switch to "main"
7. M → Merge "hotfix/login-bug"
8. P → Push
9. B → Switch to "feature/x"
10. Stash Panel → G (Pop Stash)

Fertig! Bug gefixt, Feature-Work intact
```

**Produktivität**: Kein Context-Loss, sauberer Workflow

---

### Beispiel 3: Merge-Conflict Auflösen

**Szenario**: `git merge` → 5 Conflicts.

```
# In lazygit:

1. Files Panel → 5x 🔴 Conflicted
2. Enter auf ersten Conflict
3. 3-Way Diff:
   ┌──────────┬──────────┬──────────┐
   │  Ours    │  Merged  │  Theirs  │
   └──────────┴──────────┴──────────┘
4. Navigation (↑/↓)
5. Choices:
   ← = Ours
   → = Theirs
   B = Both
   X = Manual Edit
6. Space → Resolved
7. Nächster Conflict (↓)
8. Alle Conflicts gelöst → C (Commit Merge)

Fertig in 3 Minuten!
```

**Zeit gespart**: 10 Minuten vs. Manual Editing

---

### Beispiel 4: Cherry-Pick einzelne Commits

**Szenario**: Commit von Branch A nach Branch B übernehmen.

```
# In lazygit:

1. B → Switch to "branch-a"
2. Commits Panel → Wähle Commit
3. C → Copy (Cherry-Pick)
4. B → Switch to "branch-b"
5. V → Paste (Apply Cherry-Pick)
6. Resolve Conflicts (falls nötig)
7. P → Push

Ergebnis: Commit in beiden Branches
```

**Vorteil**: Visuell, kein Commit-Hash kopieren nötig

---

### Beispiel 5: Amend Last Commit

**Szenario**: Commit gemacht, aber Typo vergessen zu fixen.

```
# In lazygit:

1. Fix Typo in Editor
2. lg → File stagen (Space)
3. Commits Panel (→→)
4. A → Amend (auf letztem Commit)
5. Optional: Commit-Message editieren
6. P → Force Push (mit --force-with-lease)

Fertig! History bleibt clean
```

**Zeit gespart**: 30 Sekunden vs. CLI

---

### Beispiel 6: Revert Last N Commits

**Szenario**: Letzten 3 Commits rückgängig machen.

```
# In lazygit:

1. Commits Panel
2. Wähle Commit (vor den 3 zu revertenden)
3. G → Reset to here
4. Wähle Typ:
   - Soft: Keeps changes in staging
   - Mixed: Keeps changes, unstages
   - Hard: DELETES all changes
5. Enter

Ergebnis: Commits weg, Optional: Changes behalten
```

**Wichtig**: Hard Reset = Datenverlust!

---

## 🤖 Claude Code Integration

### Workflow 1: Claude Code generiert, lazygit committet
```bash
# Claude Code Session: Code generieren und visuell committen
# Terminal 1: Claude Code ausfuehren
claude "Erstelle eine REST-API mit Express und TypeScript"
# Terminal 2: lazygit oeffnen und Aenderungen pruefen
lg  # Alle generierten Dateien visuell inspizieren
# Space -> einzelne Dateien/Hunks stagen -> C -> Commit-Message -> Enter
```

### Workflow 2: Interaktive Code-Review nach Claude-Aenderungen
```bash
# Nach Claude Code Session: Aenderungen mit lazygit reviewen
lazygit
# 1. Files Panel: Alle geaenderten Dateien sehen
# 2. Enter auf jeder Datei: Diff im Detail pruefen
# 3. Space: Nur gewuenschte Aenderungen stagen
# 4. Unerwuenschte Aenderungen verwerfen: d auf File
```

### Workflow 3: Branch-Workflow fuer Claude Code Features
```bash
# Feature-Branch erstellen und nach Claude-Arbeit mergen
lazygit
# B -> N -> "feature/claude-auth-system" -> Enter
# ... Claude Code generiert Feature ...
# lg -> A (Stage All) -> C (Commit) -> P (Push)
# Zurueck zu main: B -> main -> Enter
# M -> feature/claude-auth-system -> Merge
```

> 💡 **Tipp**: Claude Code kann Code generieren, aber lazygit gibt dir die volle visuelle Kontrolle ueber das Staging -- so stellst du sicher, dass nur gewuenschte Aenderungen committet werden.

---

## 📺 Video-Tutorial

[Lazygit: 15 Features in 15 Minutes](https://youtu.be/VDXvbHZYeKY)
Kompaktes Video vom lazygit-Autor selbst, das die 15 wichtigsten Features in unter 15 Minuten demonstriert -- perfekter Einstieg fuer alle, die lazygit schnell produktiv einsetzen wollen.

---

## 🔧 Troubleshooting

Hier findest du Loesungen fuer die haeufigsten Probleme mit lazygit -- von Installationsfehlern bis zu visuellen Darstellungsproblemen.

### Problem: "lazygit: command not found"

Die Shell findet das lazygit-Binary nicht, weil es entweder nicht installiert ist oder der Installationspfad nicht in der PATH-Variable enthalten ist.

**Lösung**: Installation + Path
```bash
# Check
which lazygit

# Falls nicht gefunden: Installieren
# macOS
brew install lazygit

# Oder: Go Install
go install github.com/jesseduffield/lazygit@latest

# Path checken
echo $PATH | grep go/bin
# Falls fehlt: In ~/.bashrc
export PATH=$PATH:~/go/bin
```

---

### Problem: "Colors falsch (unleserlich)"

Das Standard-Farbschema harmoniert nicht mit deinem Terminal-Theme, was zu schlecht lesbarem Text fuehrt.

**Lösung**: Config anpassen
```bash
# ~/.config/lazygit/config.yml
gui:
  theme:
    activeBorderColor:
      - cyan
      - bold
    inactiveBorderColor:
      - default
    selectedLineBgColor:
      - blue

# Oder: Anderes Theme probieren
gui:
  theme:
    lightTheme: true  # Für helle Terminals
```

---

### Problem: "Diff zu klein (unlesbar)"

Das Standard-Layout gibt der Diff-Ansicht zu wenig Platz, sodass Aenderungen schwer erkennbar sind.

**Lösung**: Pane-Größe ändern
```bash
# In lazygit:
+ / - → Pane größer/kleiner

# Oder: In Config permanent
gui:
  sidePanelWidth: 0.3333  # 33% Breite
```

---

### Problem: "Keybindings vergessen"

Am Anfang ist es normal, sich nicht alle Tastenkuerzel zu merken. lazygit bietet eingebaute Hilfe.

**Lösung**: Help anzeigen
```bash
# In lazygit:
? → Zeigt alle Keybindings für aktuelles Panel
X → Command-Menu (alles verfügbar)
```

---

### Problem: "Push fails (authentication)"

lazygit nutzt die gleiche Git-Authentifizierung wie die CLI. Wenn SSH-Keys nicht eingerichtet oder HTTPS-Credentials nicht gespeichert sind, schlaegt der Push fehl.

**Lösung**: SSH-Key oder Credential Helper
```bash
# Check SSH
ssh -T git@github.com

# Oder: HTTPS mit Credential Helper
git config --global credential.helper store

# In lazygit dann: P → Fragt nach Credentials
```

---

## 📊 lazygit vs. git CLI vs. GitKraken - Der Vergleich

| Feature | `git CLI` | `lazygit` | GitKraken |
|---------|-----------|-----------|-----------|
| **Interface** | Text | TUI | GUI |
| **Speed** | 🚀 Fastest | 🚀 Fast | 🐌 Slow |
| **Learning Curve** | 🐌 Steil | 🚀 Flach | 🚀 Flach |
| **Keyboard-Driven** | ✅ | ✅ | ⚠️ Mouse |
| **Visual Feedback** | ❌ | ✅ | ✅ |
| **Workflow Efficiency** | ⚠️ Mittel | ✅ Hoch | ⚠️ Mittel |
| **Remote-Friendly** | ✅ | ✅ | ❌ |
| **Free** | ✅ | ✅ | ⚠️ Freemium |
| **Resource Usage** | ✅ Minimal | ✅ Minimal | ❌ Heavy |

**Fazit**:
- **git CLI**: Für Git-Pros, Scripting
- **lazygit**: Best of both worlds (TUI + Visual)
- **GitKraken**: Für Absolute Beginners (GUI)

**Empfehlung**: lazygit = perfekter Mittelweg

---

## 🔗 Weiterführende Links

### Offizielle Ressourcen
- **GitHub**: https://github.com/jesseduffield/lazygit
- **Docs**: https://github.com/jesseduffield/lazygit/blob/master/docs/Config.md
- **Keybindings**: https://github.com/jesseduffield/lazygit/blob/master/docs/keybindings/Keybindings_en.md

### Community
- **Reddit**: r/lazygit
- **Discussions**: https://github.com/jesseduffield/lazygit/discussions

### Tutorials
- [lazygit Tutorial](https://youtu.be/CPLdltN7wgE)
- [Awesome lazygit](https://github.com/jesseduffield/lazygit#cool-features)

### Themes
- [Catppuccin](https://github.com/catppuccin/lazygit)
- [Nord](https://github.com/arcticicestudio/nord-lazygit)
- [Dracula](https://github.com/dracula/lazygit)

---

## 💡 Pro-Tipps

### 1. **Integriere mit delta (Better Diffs)**
Delta als Pager aktiviert Syntax-Highlighting und Word-Level-Diffs direkt in lazygit:
```bash
# Install delta
brew install git-delta

# In ~/.config/lazygit/config.yml
git:
  paging:
    colorArg: always
    pager: delta --dark --paging=never
```

### 2. **Custom Command für Conventional Commits**
Integriere commitizen direkt in lazygit fuer standardisierte Commit-Messages:
```yaml
# In config.yml
customCommands:
  - key: 'c'
    command: 'cz commit'
    context: 'files'
    description: 'Commit with commitizen'
```

### 3. **Auto-Fetch Background**
Mit Auto-Fetch siehst du immer den aktuellen Remote-Stand, ohne manuell fetchen zu muessen:
```yaml
git:
  autoFetch: true
  autoRefresh: true
refresher:
  refreshInterval: 10  # Sekunden
```

### 4. **Branch-Name-Patterns**
Ein automatisches Prefix spart Tipparbeit und erzwingt konsistente Branch-Namen:
```yaml
git:
  branchPrefix: 'feature/'

# Dann: N → Auto-completes "feature/"
```

### 5. **File Ignores in UI**

Diese GUI-Einstellungen verbessern den taeglichen Umgang mit lazygit, indem sie Warnungen unterdruecken und den Fuzzy-Filter-Modus aktivieren. Der filterMode 'fuzzy' erlaubt unscharfe Suche in allen Listen, aehnlich wie fzf. Die Skip-Warnungen sind nuetzlich, wenn du erfahren genug bist, um zu wissen, was du tust -- ansonsten bestaetigt lazygit jeden Reword- und Stash-Vorgang mit einem Dialog. Stell dir vor, du machst taeglich dutzende Commits und Stash-Operationen -- diese Bestaetigungs-Dialoge kosten dich ueber den Tag verteilt mehrere Minuten. Deaktiviere sie erst, wenn du dich mit den Operationen sicher fuehlst.

```yaml
gui:
  filterMode: 'fuzzy'
  skipRewordInEditorWarning: true
  skipStashWarning: true
```

---

## 🎯 Zusammenfassung

**lazygit ist dein visuelles Git-Interface** - schnell, intuitiv, mächtig.

**Quick Wins**:
- ✅ Git-Workflows 3x schneller
- ✅ Visuelles Staging (line-by-line)
- ✅ Interactive Rebase ohne Kopfschmerzen
- ✅ Merge-Conflicts visuell lösen
- ✅ Keyboard-Driven, keine Maus nötig

**Installation**: 5 Minuten
**Learning Curve**: 30 Minuten
**Produktivität**: +200% bei Git-Arbeit

---

**Nächster Schritt**: Installiere lazygit, nutze es für 3 Tage - du wirst nie wieder zu `git add -p` zurückkehren! 🌳

---

**Verwandte Lektionen**:
- [08 - gh](./08-gh.md) - GitHub CLI (kombiniere für PR-Workflow)
- [11 - delta](./11-delta.md) - Better Diffs (integriere in lazygit)
- [09 - tmux](./09-tmux.md) - Perfect für lazygit in Pane

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0
