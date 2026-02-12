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
Visuelles Staging statt `git add`:
```
Files → Space (Stage) → C (Commit)
```

### 2. **Branch-Management**
Branches erstellen/switchen/mergen:
```
B (Branches) → N (New) → Enter
```

### 3. **Interactive Rebase**
History umschreiben - intuitiv:
```
Commits → E (Rebase) → Squash/Fixup/Edit
```

### 4. **Merge-Conflict-Resolution**
Konflikte visuell lösen:
```
Files → Enter (Konflikt-View) → ←/→ (Choose)
```

### 5. **Stash-Management**
Änderungen parken:
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
```bash
# In ~/.gitconfig
[alias]
  lg = !lazygit

# Nutzen:
git lg  # Startet lazygit
```

### 4. **Commit-Conventions**
```
# Nutze lazygit's Commit-Template
# In Config:
git:
  commit:
    signOff: true

# Dann: C → Template wird geladen
```

### 5. **Fuzzy-Finder für Branches**
```
# In lazygit:
B → / → "feat" → Enter
# Findet alle Branches mit "feat"
```

> 💡 **Tipp**: Integriere delta als Pager in lazygit fuer noch bessere Diff-Darstellung. Fuege `pager: delta --dark --paging=never` in deine lazygit config.yml ein.

### 6. **Kombination mit gh (GitHub CLI)**
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
