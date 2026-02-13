# 37. MCP Server: Git

**Kategorie**: Version Control MCP Server
**Schwierigkeit**: Fortgeschritten
**Installation**: `npx @modelcontextprotocol/create-server git`
**Offizielle Docs**: [MCP Git Server](https://github.com/modelcontextprotocol/servers/tree/main/src/git)

---

> 🚀 **Claude Code Relevanz**: Der Git MCP Server verwandelt Claude Code in einen intelligenten Version-Control-Assistenten, der Commits analysiert, Branches verwaltet und automatisch sinnvolle Commit-Messages generiert.

## 🎯 Was ist der Git MCP Server?

Der **Git MCP Server** gibt Claude Code direkten Zugriff auf Git-Operationen - ohne Shell-Commands generieren zu müssen. Statt `git status`, `git diff`, `git commit` als bash-Befehle auszuführen, nutzt Claude strukturierte MCP Tools mit typisierter In- und Output.

### Vorteile gegenüber direkten Git-Commands

Dieses Beispiel zeigt den zentralen Unterschied: Ohne MCP muss Claude Shell-Output als Text parsen, mit MCP erhaelt es strukturierte JSON-Daten zurueck.

**Ohne MCP** (klassisch):

Ohne den Git MCP Server muss Claude klassische Shell-Commands generieren und den Text-Output parsen. Das Problem dabei ist, dass `git status` und `git diff` ihren Output als unstrukturierten Text liefern, der sich je nach Git-Version und Konfiguration leicht unterscheiden kann. Stell dir vor, Claude versucht herauszufinden, welche Dateien geaendert wurden -- es muss den `git status`-Output Zeile fuer Zeile durchgehen und Patterns wie "modified:", "new file:" oder "deleted:" erkennen. Bei Merge-Konflikten wird der Output noch komplexer und fehleranfaelliger. Ausserdem fehlt Claude die Moeglichkeit, zwischen staged und unstaged Changes zu unterscheiden, ohne zusaetzliche Befehle auszufuehren.

```bash
# Claude generiert Shell-Commands
git status
git diff
git add src/App.tsx
git commit -m "Fix: Update component"

# Problem: Parse Command-Output ist fehleranfällig
```

**Mit Git MCP**:

Mit dem Git MCP Server erhaelt Claude alle Git-Informationen als strukturiertes JSON zurueck, das sofort weiterverarbeitet werden kann. Der `git_status`-Aufruf liefert ein Objekt mit klar getrennten Arrays fuer staged, modified und untracked Dateien, plus Informationen ueber den aktuellen Branch und den Abstand zum Remote. Beim `git_commit`-Aufruf kann Claude die Dateien einzeln angeben, die committed werden sollen, und erhaelt als Antwort die Commit-ID, den Autor und den Timestamp. Stell dir vor, Claude analysiert deine Aenderungen und erstellt automatisch eine sinnvolle Commit-Message -- mit dem MCP Server kann es den Diff lesen, die Art der Aenderung erkennen und dann einen Conventional-Commit erstellen. Das Ergebnis ist ein zuverlaessigerer und schnellerer Workflow als mit Shell-Commands.

```json
{
  "method": "git_status",
  "params": { "path": "." }
}
→ Strukturierte JSON-Response mit allen Changes

{
  "method": "git_commit",
  "params": {
    "message": "Fix: Update component",
    "files": ["src/App.tsx"]
  }
}
→ Commit ID, Author, Timestamp als JSON zurück
```

---

## 🔧 Berechtigung

Hier erfaehrst du, warum der Git MCP Server einen Mehrwert gegenueber der klassischen Git CLI bietet und welche Workflows er ermoeglicht.

### Warum brauchst du den Git MCP Server?

1. **Strukturierte Git-Daten**: JSON statt Text-Parsing
2. **Safety Checks**: Verhindert destructive Operations (force push, hard reset)
3. **Audit Trail**: Alle Git-Operationen werden protokolliert
4. **Error Handling**: Bessere Fehler-Messages als Git CLI
5. **Multi-Repo Support**: Manage mehrere Repos gleichzeitig

### Use Cases

- **Code Reviews**: Claude analysiert Diffs und gibt Feedback
- **Auto-Commit**: Claude committed logisch zusammenhängende Changes
- **Branch Management**: Claude erstellt Feature-Branches nach Konvention
- **Merge Conflicts**: Claude hilft beim Resolven von Conflicts
- **Git History Analysis**: Claude analysiert Commit-Patterns

---

## 🎯 Zwecke

Die fuenf Hauptbereiche decken den kompletten Git-Workflow ab -- von der Status-Abfrage bis zu Remote-Operationen.

Der Git MCP Server wird verwendet für:

### 1. **Status & Inspection**
- Repository Status checken
- Working Directory Changes sehen
- Branch Information abrufen

### 2. **History & Logs**
- Commit History durchsuchen
- Diffs zwischen Commits
- Blame für Codezeilen

### 3. **Branch Operations**
- Branches erstellen/wechseln/löschen
- Branch Comparison
- Merges durchführen

### 4. **Staging & Committing**
- Files zum Staging hinzufügen
- Commits erstellen
- Amend Commits

### 5. **Remote Operations**
- Push/Pull/Fetch
- Remote-Branch Tracking
- PR-Vorbereitung

---

## 💻 Verwendung

Von der Installation bis zur Integration in Claude Code -- dieser Abschnitt fuehrt dich durch die komplette Einrichtung des Git MCP Servers.

### Installation

Die folgenden Befehle installieren den Git MCP Server auf deinem System. Die globale Installation mit `npm install -g` macht das Paket dauerhaft verfuegbar, waehrend die npx-Variante ideal zum Ausprobieren ist, da sie keine permanente Installation erfordert. Der `create-server`-Befehl erstellt zusaetzlich eine Grundkonfiguration, die du anschliessend anpassen kannst. Der letzte Befehl erstellt das Konfigurationsverzeichnis `~/.config/mcp`, falls es noch nicht existiert -- dort werden die JSON-Konfigurationen fuer alle MCP Server gespeichert. Stelle sicher, dass Node.js und npm installiert sind, bevor du diese Befehle ausfuehrst (pruefe mit `node --version`).

```bash
# NPM Package installieren
npm install -g @modelcontextprotocol/server-git

# Oder direkt via npx
npx @modelcontextprotocol/create-server git

# MCP Config erstellen
mkdir -p ~/.config/mcp
```

### Konfiguration

Die Konfiguration bestimmt, auf welches Repository Claude zugreifen darf und welche Operationen erlaubt sind. Besonders wichtig: `push: false` und `force: false` verhindern versehentliche destructive Operationen.

**~/.config/mcp/git.json**:
```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "/Users/username/projects"
      ],
      "permissions": {
        "read": true,
        "write": true,
        "push": false,     // Kein auto-push
        "force": false     // Keine force Operations
      },
      "options": {
        "autoStage": false,        // Kein auto-stage
        "requireCommitMessage": true,
        "maxDiffSize": "1MB",
        "excludePatterns": [
          "node_modules/**",
          "*.log"
        ]
      }
    }
  }
}
```

### Claude Code Integration

**Im Chat**:

So sieht ein typischer Git-Workflow in Claude Code aus. Du stellst Fragen in natuerlicher Sprache, und Claude waehlt automatisch das passende MCP Tool. Im ersten Schritt nutzt Claude `git_status`, um zu sehen, welche Dateien geaendert wurden, und praesentiert dir eine uebersichtliche Zusammenfassung. Beim Diff-Request zeigt Claude nicht nur die geaenderten Zeilen, sondern erklaert auch, was sich inhaltlich geaendert hat. Besonders maechtig ist der Commit-Workflow: Claude analysiert alle Diffs, erkennt automatisch den Aenderungstyp (Feature, Bugfix, Refactoring) und generiert eine Conventional-Commits-konforme Message. Du musst nie wieder ueberlegen, wie du deinen Commit benennen sollst -- Claude macht das fuer dich.

```bash
Du: "Was hab ich geändert?"
Claude: [nutzt git.status MCP Tool]
→ "Du hast 3 Files geändert: App.tsx, Button.tsx, README.md"

Du: "Zeig mir den Diff von App.tsx"
Claude: [nutzt git.diff MCP Tool]
→ Zeigt colorized Diff mit Erklärung

Du: "Commit die Changes mit sinnvoller Message"
Claude: [nutzt git.commit MCP Tool]
→ Analysiert Changes, generiert Commit-Message,
   erstellt Commit mit strukturierter Message
```

### Available MCP Tools

Der Git Server stellt folgende Tools bereit:

#### 1. `git_status`

Dieses Tool zeigt den aktuellen Zustand des Repositories: welche Dateien geaendert, gestaged oder ungetrackt sind, und wie der Branch zum Remote steht. Der `path`-Parameter gibt an, welches Repository abgefragt werden soll -- bei einem einzelnen Projekt ist `.` (aktuelles Verzeichnis) die richtige Wahl. Mit `includeUntracked: true` werden auch Dateien angezeigt, die noch nie committed wurden. Claude nutzt dieses Tool typischerweise als ersten Schritt, um sich einen Ueberblick ueber den aktuellen Arbeitsstand zu verschaffen. Die Response enthaelt alle relevanten Informationen in getrennten Arrays, sodass Claude sofort weiss, welche Dateien noch gestaged werden muessen. Das `ahead`-Feld zeigt, wie viele lokale Commits noch nicht gepusht wurden, und `behind`, wie viele Remote-Commits noch nicht gemerged sind.

```json
{
  "name": "git_status",
  "description": "Get repository status",
  "parameters": {
    "path": ".",
    "includeUntracked": true
  }
}
```

**Response**:
```json
{
  "branch": "main",
  "ahead": 2,
  "behind": 0,
  "staged": ["src/App.tsx"],
  "modified": ["src/Button.tsx"],
  "untracked": ["test.js"]
}
```

#### 2. `git_diff`

Dieses Tool zeigt die konkreten Aenderungen in einer Datei als Diff an und ist der Kern der Code-Analyse mit dem Git MCP Server. Der `path`-Parameter gibt die Datei an, deren Aenderungen angezeigt werden sollen. Mit `staged: false` werden die Aenderungen im Working Directory angezeigt (die noch nicht gestaged sind), waehrend `staged: true` nur die fuer den naechsten Commit vorgemerkten Aenderungen liefert. Stell dir vor, du hast mehrere Dateien geaendert und fragst Claude "Was habe ich in App.tsx geaendert?" -- Claude ruft dieses Tool auf und erhaelt sowohl die Anzahl hinzugefuegter und geloeschter Zeilen als auch den vollstaendigen Diff-Text. Die Response im JSON-Format macht es Claude leicht, die Aenderungen zu analysieren und dir eine verstaendliche Zusammenfassung zu geben.

```json
{
  "name": "git_diff",
  "description": "Get file diffs",
  "parameters": {
    "path": "src/App.tsx",
    "staged": false
  }
}
```

**Response**:
```json
{
  "file": "src/App.tsx",
  "additions": 15,
  "deletions": 3,
  "diff": "--- a/src/App.tsx\n+++ b/src/App.tsx\n..."
}
```

#### 3. `git_commit`

Dieses Tool erstellt einen neuen Commit mit den angegebenen Dateien und einer Commit-Message. Der `files`-Parameter ist ein Array von Dateipfaden, die in den Commit aufgenommen werden sollen -- Claude staged diese Dateien automatisch vor dem Commit. Der `amend`-Parameter erlaubt es, den letzten Commit nachtraeglich zu aendern, anstatt einen neuen zu erstellen. Stell dir vor, du hast an einem Feature gearbeitet und fragst Claude "Committe meine Aenderungen" -- Claude analysiert den Diff aller geaenderten Dateien, erkennt, dass es sich um ein neues Feature handelt, und generiert eine Message im Format `feat: Add user authentication`. Das `files`-Array stellt sicher, dass nur die gewuenschten Dateien committed werden, nicht versehentlich auch temporaere oder Debug-Dateien.

```json
{
  "name": "git_commit",
  "description": "Create commit",
  "parameters": {
    "message": "feat: Add user authentication",
    "files": ["src/auth.tsx", "src/login.tsx"],
    "amend": false
  }
}
```

#### 4. `git_log`

Dieses Tool ruft die Commit-History ab, optional gefiltert nach Zeitraum und Autor, und ist ideal fuer Changelog-Generierung und Aktivitaetsanalysen. Mit dem `limit`-Parameter begrenzt du die Anzahl der zurueckgegebenen Commits, `since` filtert nach einem Startdatum und `author` zeigt nur Commits eines bestimmten Autors. Stell dir vor, du willst wissen, was im letzten Monat passiert ist -- mit `since: "2026-01-01"` bekommst du alle Commits seit Jahresbeginn. Claude kann diese Daten nutzen, um automatisch Changelogs zu generieren, Aktivitaets-Reports zu erstellen oder festzustellen, welche Teile des Codes am aktivsten entwickelt werden. Die Response enthaelt fuer jeden Commit die ID, den Autor, den Timestamp, die Message und die Liste der geaenderten Dateien.

```json
{
  "name": "git_log",
  "description": "Get commit history",
  "parameters": {
    "limit": 10,
    "since": "2026-01-01",
    "author": "cosmo"
  }
}
```

#### 5. `git_branch`

Dieses Tool verwaltet Branches und ist die zentrale Schaltstelle fuer alle Branch-Operationen: erstellen, wechseln, loeschen oder auflisten. Der `action`-Parameter bestimmt die gewuenschte Operation, waehrend `name` den Branch-Namen angibt. Mit `action: "create"` wird ein neuer Branch vom aktuellen HEAD erstellt, `switch` wechselt zu einem bestehenden Branch, `delete` loescht einen Branch und `list` zeigt alle lokalen Branches. Stell dir vor, du sagst Claude "Erstelle einen Feature-Branch fuer das neue UI" -- Claude generiert einen sinnvollen Branch-Namen nach Konvention (z.B. `feature/new-ui`) und erstellt den Branch. Das ist besonders nuetzlich in Teams, die Branch-Namenskonventionen einhalten muessen, da Claude die korrekte Benennung automatisch sicherstellt.

```json
{
  "name": "git_branch",
  "description": "Branch operations",
  "parameters": {
    "action": "create",  // create, delete, list, switch
    "name": "feature/new-ui"
  }
}
```

#### 6. `git_push`

Dieses Tool pusht lokale Commits zum Remote-Repository und macht deine Aenderungen fuer das Team sichtbar. Der `remote`-Parameter gibt den Namen des Remote-Repositories an (meistens `origin`), und `branch` den Branch, auf den gepusht werden soll. Besonders wichtig ist `force: false` -- ein Force-Push ueberschreibt die Remote-History und kann die Arbeit anderer Team-Mitglieder zerstoeren. Stell dir vor, ein Kollege hat waehrend du gearbeitet hast neue Commits gepusht -- mit `force: true` wuerden seine Aenderungen unwiderruflich ueberschrieben. In der MCP-Konfiguration solltest du `push: false` als Standard setzen und Push-Rechte nur bewusst fuer spezifische Workflows aktivieren. Claude fragt dich vor einem Push immer um Bestaetigung, bevor es dieses Tool ausfuehrt.

```json
{
  "name": "git_push",
  "description": "Push to remote",
  "parameters": {
    "remote": "origin",
    "branch": "main",
    "force": false
  }
}
```

#### 7. `git_pull`

Dieses Tool holt Aenderungen vom Remote-Repository und integriert sie in deinen lokalen Branch. Mit `rebase: false` wird ein Standard-Merge durchgefuehrt, der einen Merge-Commit erstellt, waehrend `rebase: true` deine lokalen Commits auf die Remote-Aenderungen aufsetzt, was eine lineare History erzeugt. Stell dir vor, du hast den ganzen Tag an einem Feature gearbeitet und willst vor dem Push die neuesten Aenderungen vom Team einbinden -- mit `git_pull` werden die Remote-Commits heruntergeladen und in deinen Branch integriert. Falls dabei Konflikte auftreten, meldet das Tool die betroffenen Dateien, und Claude kann dir beim Resolven helfen. Beachte, dass `rebase: true` nur verwendet werden sollte, wenn du verstehst, wie Rebase funktioniert, da es die Commit-History umschreibt.

```json
{
  "name": "git_pull",
  "description": "Pull from remote",
  "parameters": {
    "remote": "origin",
    "branch": "main",
    "rebase": false
  }
}
```

#### 8. `git_blame`

Dieses Tool zeigt fuer jede Zeile einer Datei, wer sie zuletzt geaendert hat, in welchem Commit und wann -- das ist unverzichtbar fuer Debugging und Code-Archaeologie. Mit `lineStart` und `lineEnd` kannst du den Bereich auf bestimmte Zeilen einschraenken, anstatt die gesamte Datei zu analysieren. Stell dir vor, du findest einen Bug in Zeile 45 und willst wissen, wer diese Zeile wann geaendert hat und warum -- `git_blame` liefert dir den Commit-Hash, den Autor, das Datum und die Commit-Message fuer genau diese Zeile. Claude kann diese Information nutzen, um den Kontext einer Aenderung zu verstehen und die Ursache des Bugs einzugrenzen. Besonders in Team-Projekten hilft `git_blame`, den richtigen Ansprechpartner fuer eine Code-Stelle zu finden.

```json
{
  "name": "git_blame",
  "description": "Get line authorship",
  "parameters": {
    "file": "src/App.tsx",
    "lineStart": 10,
    "lineEnd": 20
  }
}
```

---

## 🏆 Best Practices

Diese Best Practices helfen dir, den Git MCP Server sicher und produktiv einzusetzen -- von Commit-Konventionen bis zu Branch-Strategien.

### 1. **Structured Commit Messages**

Gute Commit-Messages folgen dem Conventional Commits Format, das aus einem Typ, einem optionalen Scope und einem Subject besteht. Der Typ (feat, fix, docs, etc.) gibt sofort Auskunft darueber, was fuer eine Art von Aenderung vorgenommen wurde. Der Scope in Klammern benennt den betroffenen Bereich der Anwendung, und das Subject beschreibt die Aenderung in maximal 50 Zeichen. Dieses Format ist nicht nur fuer Menschen lesbarer, sondern ermoeglicht auch die automatische Generierung von Changelogs und semantischer Versionierung. Claude kann diese Konvention automatisch einhalten, wenn es Commit-Messages generiert -- du musst dir also keine Gedanken ueber die Formatierung machen.

```javascript
// ❌ Generic Messages
await git.commit({ message: "updates" });
await git.commit({ message: "fix bug" });

// ✅ Conventional Commits
await git.commit({
  message: "feat(auth): Add JWT-based authentication\n\n- Implement token generation\n- Add refresh token logic\n- Update API endpoints",
  files: ["src/auth/jwt.ts", "src/api/auth.ts"]
});

await git.commit({
  message: "fix(ui): Resolve button alignment issue on mobile\n\nFixes #123",
  files: ["src/components/Button.tsx"]
});
```

**Format**: `<type>(<scope>): <subject>\n\n<body>\n\n<footer>`
- **Types**: feat, fix, docs, style, refactor, test, chore
- **Scope**: auth, ui, api, db, etc.
- **Subject**: Kurze Beschreibung (max 50 chars)

> ⚠️ **Warnung**: Setze in der MCP-Konfiguration `"push": false` und `"force": false`, um versehentliche Force-Pushes und direkte Pushes auf den Main-Branch zu verhindern. Aktiviere Push-Rechte nur bewusst fuer spezifische Workflows.

### 2. **Safety Checks vor Destructive Operations**

Force-Pushes und direkte Pushes auf main koennen die Arbeit des gesamten Teams zerstoeren, da sie die Remote-History unwiderruflich ueberschreiben. Diese Sicherheitschecks verhindern versehentliche destructive Operationen, indem sie vor jedem Push pruefen, ob der Ziel-Branch geschuetzt ist und wie viele Commits gepusht werden. Die Funktion gibt eine Warnung aus, wenn mehr als 10 Commits auf einmal gepusht werden sollen -- das koennte ein Zeichen dafuer sein, dass ein Rebase vergessen wurde. Pushes auf `main` oder `master` werden komplett blockiert, da diese Branches nur ueber Pull Requests aktualisiert werden sollten. Stell dir vor, du hast versehentlich `force: true` gesetzt -- diese Schutzfunktion rettet dich davor, die Arbeit deines Teams zu ueberschreiben.

```javascript
// Best Practice: Confirm vor force push
async function safePush(branch) {
  const status = await git.status();

  if (status.ahead > 10) {
    console.warn(`⚠️  You're about to push ${status.ahead} commits`);
    // Ask for confirmation
  }

  if (branch === 'main' || branch === 'master') {
    console.error('❌ Direct push to main is blocked');
    return;
  }

  await git.push({ branch, force: false });
}
```

### 3. **Atomic Commits**

Jeder Commit sollte genau eine logische Aenderung enthalten, anstatt alles in einen einzigen Mega-Commit zu packen. Das macht Code Reviews deutlich einfacher, weil der Reviewer jeden Commit einzeln nachvollziehen kann. Ausserdem erlaubt es gezieltes Revert: Wenn ein Feature-Commit einen Bug einfuehrt, kannst du genau diesen Commit zurueckrollen, ohne die Tests und Dokumentation mitzunehmen. Stell dir vor, du hast gleichzeitig ein neues Feature implementiert, Tests geschrieben und die Docs aktualisiert -- mit drei getrennten Commits bleibt die History sauber und nachvollziehbar. Claude kann dir dabei helfen, indem es die geaenderten Dateien automatisch nach logischen Einheiten gruppiert und separate Commits vorschlaegt.

```javascript
// ❌ Alle Changes in einem Commit
await git.addAll();
await git.commit({ message: "Various updates" });

// ✅ Logisch getrennte Commits
// Commit 1: Feature Implementation
await git.add(["src/auth/jwt.ts", "src/auth/types.ts"]);
await git.commit({
  message: "feat(auth): Implement JWT authentication"
});

// Commit 2: Tests
await git.add(["src/auth/jwt.test.ts"]);
await git.commit({
  message: "test(auth): Add JWT unit tests"
});

// Commit 3: Documentation
await git.add(["docs/authentication.md"]);
await git.commit({
  message: "docs(auth): Document JWT authentication flow"
});
```

### 4. **Branch Naming Conventions**

Einheitliche Branch-Namen machen sofort klar, ob es sich um ein Feature, einen Bugfix oder ein Refactoring handelt, und erleichtern die Zusammenarbeit im Team erheblich. Das Pattern `prefix/description` ist der De-facto-Standard in der Branche: `feature/` fuer neue Features, `fix/` fuer Bugfixes, `hotfix/` fuer dringende Production-Fixes, `refactor/` fuer Code-Umstrukturierungen und `docs/` fuer Dokumentationsaenderungen. Stell dir ein Team mit 10 Entwicklern vor, die gleichzeitig an verschiedenen Branches arbeiten -- mit einheitlichen Namenskonventionen sieht jeder sofort, woran die anderen arbeiten. Claude kann Branch-Namen automatisch generieren, wenn du ihm die Konvention mitteilst. Zusaetzlich koennen CI/CD-Pipelines anhand des Branch-Namens entscheiden, welche Workflows ausgefuehrt werden sollen.

```javascript
// Best Practice: Prefix + Description
const branchPatterns = {
  feature: "feature/add-dark-mode",
  bugfix: "fix/button-alignment",
  hotfix: "hotfix/security-patch",
  refactor: "refactor/simplify-auth-logic",
  docs: "docs/update-readme",
  test: "test/add-integration-tests"
};

// Create Branch mit Convention
await git.branch({
  action: "create",
  name: `feature/${taskId}-${description}`
});
```

### 5. **Pre-Commit Validation**

Automatische Validierung vor dem Commit fuer haeufige Fehler wie vergessene console.log-Statements, offene TODOs oder fehlgeschlagene Tests. Diese Funktion prueft jede Datei auf typische Probleme, die nicht in den Code gehoeren, und gibt Warnungen aus, bevor der Commit erstellt wird. Das erspart dir peinliche "remove console.log"-Follow-up-Commits und stellt sicher, dass keine Debugging-Artefakte in die Produktion gelangen. Stell dir vor, du arbeitest unter Zeitdruck und vergisst ein `console.log("DEBUG:", data)` -- ohne Pre-Commit-Validierung landet das im Production-Build. Claude kann diese Pruefungen automatisch ausfuehren und dich auf Probleme hinweisen, bevor du committest.

```javascript
// Validiere vor Commit
async function validateBeforeCommit(files) {
  // 1. Check für console.log
  const hasConsoleLog = await searchInFiles(files, /console\.log/);
  if (hasConsoleLog) {
    console.warn("⚠️  Found console.log statements");
  }

  // 2. Check für TODOs in Commit
  const hasTODO = await searchInFiles(files, /TODO|FIXME/);
  if (hasTODO) {
    console.warn("⚠️  Committing with TODO/FIXME");
  }

  // 3. Run Linter
  await runLinter(files);

  // 4. Run Tests
  await runTests();
}
```

### 6. **Interactive Staging**

Statt alle Aenderungen blind mit `git add .` zu stagen, zeigt dieser Ansatz fuer jede geaenderte Datei den Diff an und fragt einzeln, ob sie in den Commit aufgenommen werden soll. Das ist besonders nuetzlich, wenn du an mehreren Dingen gleichzeitig gearbeitet hast und die Aenderungen in logisch getrennte Commits aufteilen willst. Stell dir vor, du hast sowohl einen Bugfix als auch ein neues Feature implementiert -- mit Interactive Staging kannst du zuerst die Bugfix-Dateien stagen und committen, und dann die Feature-Dateien separat. Claude kann diesen Workflow automatisieren, indem es die Diffs analysiert und vorschlaegt, welche Dateien zusammengehoeren. So erhaeltst du eine saubere Commit-History, auch wenn du nicht von Anfang an in separaten Branches gearbeitet hast.

```javascript
// Best Practice: Zeige Diffs vor Staging
async function interactiveStage() {
  const status = await git.status();

  for (const file of status.modified) {
    // Zeige Diff
    const diff = await git.diff({ path: file });
    console.log(`\nDiff for ${file}:`);
    console.log(diff);

    // Ask: Stage this file?
    const shouldStage = await prompt(`Stage ${file}? (y/n)`);
    if (shouldStage === 'y') {
      await git.add([file]);
    }
  }
}
```

### 7. **Commit Message Templates**

Templates stellen sicher, dass Commit-Messages einheitlich formatiert sind und alle wichtigen Informationen enthalten -- unabhaengig davon, wer den Commit erstellt. Jeder Template-Typ hat eine eigene Struktur: Feature-Messages beschreiben die neue Funktionalitaet und verweisen auf Tests und Docs, Fix-Messages erklaeren die Ursache und Loesung des Problems, und Refactoring-Messages beschreiben den vorherigen und neuen Ansatz. Stell dir vor, dein Team hat 5 Entwickler, die alle unterschiedlich committen -- mit Templates sieht jede Commit-Message gleich aus und enthaelt die gleichen Informationen. Claude kann diese Templates automatisch befuellen, indem es den Diff analysiert und die relevanten Felder ausfuellt. Das Ergebnis ist eine konsistente, informative Commit-History, die auch in einem Jahr noch verstaendlich ist.

```javascript
// Template für Commits
function generateCommitMessage(type, scope, changes) {
  const templates = {
    feat: (scope, desc) =>
      `feat(${scope}): ${desc}\n\n- Implemented ${desc}\n- Added tests\n- Updated docs`,

    fix: (scope, desc) =>
      `fix(${scope}): ${desc}\n\nRoot cause: [explain]\nSolution: [explain]`,

    refactor: (scope, desc) =>
      `refactor(${scope}): ${desc}\n\nBefore: [old approach]\nAfter: [new approach]\nBenefits: [list benefits]`
  };

  return templates[type](scope, changes);
}

// Usage
const message = generateCommitMessage(
  "feat",
  "auth",
  "Add two-factor authentication"
);
await git.commit({ message });
```

---

## 📝 Beispiele (12+)

Die folgenden Beispiele zeigen typische Git-Workflows, die Claude mit dem Git MCP Server automatisieren kann -- von intelligenten Commit-Messages bis zur Changelog-Generierung.

### Beispiel 1: Smart Commit-Message Generator

```bash
Du: "Commit meine Changes mit einer sinnvollen Message"

Claude Workflow:
1. git.status() → Sieht welche Files geändert
2. git.diff() für jeden File → Analysiert Changes
3. Erstellt Commit-Message basierend auf:
   - Welche Files geändert wurden
   - Art der Änderungen (feat, fix, refactor)
   - Scope (welcher Teil der App)
4. git.commit() mit Generated Message

Generated Message:
```
feat(ui): Improve button component accessibility

- Add ARIA labels for screen readers
- Implement keyboard navigation
- Update color contrast ratios to WCAG AA

Closes #456
```

### Beispiel 2: Auto Branch Creator

```bash
Du: "Erstelle einen Feature-Branch für Dark Mode"

Claude:
1. git.branch({ action: "list" }) → Check current branches
2. Generiert Branch-Name: "feature/dark-mode-implementation"
3. git.branch({ action: "create", name: "feature/dark-mode-implementation" })
4. git.branch({ action: "switch", name: "feature/dark-mode-implementation" })

Ausgabe: "✅ Created and switched to feature/dark-mode-implementation"
```

### Beispiel 3: Merge Conflict Resolver

```bash
Du: "Hilf mir beim Merge-Conflict in App.tsx"

Claude:
1. git.status() → Findet Conflict-Files
2. filesystem.read_file("src/App.tsx") → Liest Conflict-Markers
3. Analysiert <<<<<<, ======, >>>>>> Sections
4. Schlägt Resolution vor
5. filesystem.write_file() mit Resolved Version
6. git.add(["src/App.tsx"])
7. git.commit({ message: "resolve: Merge conflict in App.tsx" })
```

> 🚀 **Beispiel**: Lass Claude automatisch Commit-Messages generieren: Claude analysiert den Diff, erkennt den Aenderungstyp (feat, fix, refactor) und erstellt Conventional-Commits-konforme Messages -- spart Zeit und verbessert die Commit-Qualitaet.

### Beispiel 4: Commit History Analyzer

```bash
Du: "Analysiere die Commits vom letzten Monat"

Claude:
1. git.log({ since: "2026-01-01", limit: 100 })
2. Gruppiert Commits nach:
   - Type (feat, fix, etc.)
   - Author
   - Files touched
3. Erstellt Statistics

Ausgabe:
```
Commit Analysis (Jan 2026)

Total Commits: 89

By Type:
  - feat: 45 (50%)
  - fix: 28 (31%)
  - refactor: 12 (13%)
  - docs: 4 (4%)

By Author:
  - cosmo: 65 commits
  - claude: 24 commits

Most Active Files:
  - src/App.tsx (23 changes)
  - src/components/Button.tsx (15 changes)

Commit Frequency:
  - Weekdays: 78 commits
  - Weekends: 11 commits
```

### Beispiel 5: Pre-Push Validation

```bash
Du: "Push meinen Branch, aber check vorher alles"

Claude:
1. git.status() → Check für unstaged changes
2. git.log({ limit: 10 }) → Check Commit-Quality
3. Run Tests via bash
4. Check Commit-Messages Format
5. Wenn OK: git.push()

Checks:
```
Pre-Push Validation:

✅ No unstaged changes
✅ All commits follow conventional format
✅ Tests passing (127/127)
✅ No console.log statements
✅ No merge conflicts

Ready to push? (y/n)
```

### Beispiel 6: Interactive Rebase Assistant

```bash
Du: "Squash meine letzten 3 Commits"

Claude:
1. git.log({ limit: 3 }) → Holt letzte 3 Commits
2. Zeigt Commit-Messages
3. Fragt nach neuer Combined Message
4. git.rebase({ interactive: true, count: 3, action: "squash" })
5. git.commit({ message: newMessage, amend: true })

Vorher:
  - fix: typo in button
  - fix: another typo
  - feat: add button component

Nachher:
  - feat: Add button component with proper styling
```

### Beispiel 7: Find Who Broke It

```bash
Du: "Wer hat Zeile 45 in App.tsx kaputt gemacht?"

Claude:
1. git.blame({ file: "src/App.tsx", lineStart: 45, lineEnd: 45 })
2. git.log({ commits: [blameCommitId] }) → Holt Full Commit
3. git.diff({ commit: blameCommitId }) → Zeigt was geändert wurde

Ausgabe:
```
Line 45 in src/App.tsx was last changed by:

Commit: abc123
Author: cosmo
Date: 2026-02-10 14:30
Message: "refactor: Simplify state management"

Diff:
-  const [data, setData] = useState([]);
+  const data = useData();  // ← This line (45)
```

> 💡 **Tipp**: Kombiniere Git MCP mit GitHub MCP fuer einen vollstaendigen Workflow: Lokale Commits mit Git MCP, dann automatische PR-Erstellung mit GitHub MCP -- alles in einer Claude Code Session.

### Beispiel 8: Changelog Generator

```bash
Du: "Generiere ein Changelog seit dem letzten Release"

Claude:
1. git.log({ since: "v1.0.0" }) → Commits seit Tag
2. Filtert nach Type (feat, fix)
3. Gruppiert nach Scope
4. Generiert Markdown

Ausgabe (CHANGELOG.md):
```markdown
# Changelog

## [Unreleased]

### Features
- **auth**: Add JWT-based authentication (#123)
- **ui**: Implement dark mode (#145)
- **api**: Add rate limiting (#167)

### Bug Fixes
- **ui**: Fix button alignment on mobile (#134)
- **auth**: Resolve token refresh race condition (#156)

### Breaking Changes
- **api**: Changed auth endpoint from /login to /auth/login
```

### Beispiel 9: Stale Branch Finder

```bash
Du: "Welche Branches kann ich löschen?"

Claude:
1. git.branch({ action: "list", includeRemote: true })
2. Für jeden Branch:
   - git.log({ branch: branchName, limit: 1 }) → Letzter Commit
   - Check Alter
   - Check ob merged
3. Erstellt Report

Ausgabe:
```
Stale Branches (no commits in 30+ days):

Can be safely deleted (merged):
  - feature/old-ui-experiment (merged 45 days ago)
  - fix/button-bug (merged 60 days ago)

Needs review (not merged):
  ⚠️  feature/payment-integration (75 days old)
  ⚠️  refactor/api-cleanup (90 days old)
```

### Beispiel 10: Git Bisect Helper

```bash
Du: "Find den Commit, der den Bug eingeführt hat"

Claude (interaktiv):
1. git.bisect({ action: "start" })
2. git.bisect({ action: "bad", commit: "HEAD" })
3. git.bisect({ action: "good", commit: "v1.0.0" })
4. Für jeden Bisect-Step:
   - Run Tests
   - git.bisect({ action: tests.passed ? "good" : "bad" })
5. Findet problematischen Commit

Ausgabe:
```
Found problematic commit:

Commit: def456
Author: cosmo
Date: 2026-01-15
Message: "refactor: Update API client"

This commit introduced the bug.
Run git show def456 to see changes.
```

### Beispiel 11: Code Review Prep

```bash
Du: "Bereite meinen Branch für Code Review vor"

Claude:
1. git.diff({ base: "main", head: currentBranch })
2. Analysiert alle Changes
3. Erstellt Review-Checklist
4. Generiert PR-Description

PR Description:
```markdown
## Summary
Implements user authentication with JWT tokens

## Changes
- Add JWT token generation and validation
- Implement login/logout endpoints
- Add auth middleware for protected routes
- Update API documentation

## Testing
- [ ] Unit tests pass (auth.test.ts)
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
[Upload screenshots of login flow]

## Breaking Changes
None

## Related Issues
Closes #123
```

### Beispiel 12: Dependency Update Commit

```bash
Du: "Update Dependencies und commit sinnvoll"

Claude:
1. Liest package.json changes
2. Erstellt strukturierten Commit mit Allen Updates
3. git.commit()

Commit Message:
```
chore(deps): Update dependencies

Updated packages:
- react: 18.2.0 → 18.3.0
- typescript: 5.0.0 → 5.1.0
- vite: 4.3.0 → 4.4.0

Breaking changes:
- None

Migration notes:
- No code changes required
- All tests passing
```

---

## 🔗 Integration mit Claude Code

Diese Workflows zeigen, wie Claude den Git MCP Server automatisch in typischen Entwicklungssituationen einsetzt -- von Commit-Vorschlaegen bis zur Team-Kollaboration.

### 1. **Automatic Commit Suggestions**

Claude erkennt automatisch, wenn du Dateien geaendert hast, und bietet dir an, diese mit einer sinnvollen Commit-Message zu committen. Dabei analysiert es den Diff jeder geaenderten Datei, erkennt den Aenderungstyp und generiert eine Conventional-Commits-konforme Message. Stell dir vor, du hast drei React-Komponenten aktualisiert -- Claude erkennt, dass es sich um UI-Verbesserungen handelt, und schlaegt `feat(ui): Improve button accessibility` vor. Du kannst die Message annehmen, anpassen oder ablehnen. Das spart Zeit und sorgt fuer eine konsistente Commit-History.

```bash
# Nach File-Änderungen
Du: "Ich hab ein paar Changes gemacht"

Claude:
1. git.status() → Sieht Changes
2. git.diff() → Analysiert was geändert wurde
3. "Soll ich das commiten? Ich würde vorschlagen:
   'feat(ui): Improve button accessibility'"
```

### 2. **Smart Branch Workflows**

Claude automatisiert den kompletten Branch-Workflow: Vom Erstellen eines Feature-Branches mit korrektem Namen ueber das Committing bis hin zur PR-Erstellung. Wenn du Claude sagst, dass du an einem Feature arbeiten willst, erstellt es einen Branch nach deiner Namenskonvention, wechselt dorthin und kann sogar gleich einen Draft-PR auf GitHub erstellen. Das verbindet Git MCP und GitHub MCP zu einem nahtlosen Workflow. Stell dir vor, du startest jeden Morgen mit "Ich will an Feature X arbeiten" und Claude hat in Sekunden alles vorbereitet.

```bash
Du: "Ich will an Feature X arbeiten"

Claude:
1. git.branch({ action: "create", name: "feature/x" })
2. "Branch erstellt. Soll ich auch einen Draft-PR auf GitHub erstellen?"
3. Nutzt GitHub MCP Server für PR-Creation
```

### 3. **Collaboration Helper**

Claude kann die Team-Aktivitaet ueberwachen und dir zusammenfassen, was deine Kollegen heute oder in der letzten Woche committed haben. Der `git_log`-Aufruf mit dem `author`-Filter `"!me"` zeigt alle Commits ausser deinen eigenen. Das ist besonders nuetzlich, um morgens schnell zu erfassen, was sich ueber Nacht geaendert hat, ohne jeden Commit einzeln durchlesen zu muessen. Claude fasst die Aenderungen nach Autor und Bereich zusammen und hebt besonders wichtige Commits hervor. So bleibst du immer auf dem neuesten Stand, ohne den Ueberblick zu verlieren.

```bash
Du: "Was hat mein Team heute committed?"

Claude:
1. git.log({ since: "today", author: "!me" })
2. Zeigt Team-Commits mit Summaries
3. "Sarah hat am Auth-Feature gearbeitet, Tom hat Tests hinzugefügt"
```

---

## 🐛 Troubleshooting

Die haeufigsten Probleme mit dem Git MCP Server betreffen falsche Pfade, Authentication und grosse Diffs. Hier findest du die Ursachen und Loesungen.

### Problem 1: "Not a Git Repository"

**Symptom**:
```
Error: fatal: not a git repository
```

**Ursache**: Der konfigurierte Pfad zeigt nicht auf ein Git-Repository, oder das Repository wurde noch nicht initialisiert.

**Lösung**:

Pruefe ob ein `.git`-Verzeichnis existiert und passe den Pfad in der MCP-Konfiguration an:
```bash
# Check Repository
git rev-parse --git-dir

# Falls kein Repo: Initialize
git init

# MCP Config anpassen
{
  "args": ["/path/to/actual/repo"]  // Correct path
}
```

### Problem 2: Merge Conflicts nicht erkannt

**Symptom**: MCP zeigt keinen Conflict

**Ursache**: Der Status-Aufruf prueft nicht immer automatisch auf Merge-Konflikte. Eine explizite Pruefung auf das `conflicts`-Feld ist noetig.

**Lösung**:
```javascript
// Explicit Conflict Check
const status = await git.status();
if (status.conflicts && status.conflicts.length > 0) {
  console.log("Merge conflicts detected:", status.conflicts);
}
```

### Problem 3: Push fails mit Authentication

**Symptom**:
```
Error: Authentication failed
```

**Ursache**: Keine SSH-Keys konfiguriert oder HTTPS-Credentials abgelaufen. GitHub erfordert seit 2021 Token statt Passwoerter fuer HTTPS.

**Lösung**:

Richte SSH-Keys ein oder nutze die GitHub CLI fuer automatische Token-Verwaltung:
```bash
# Setup SSH Keys
ssh-keygen -t ed25519 -C "your_email@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Or use GitHub CLI for HTTPS
gh auth login
```

### Problem 4: Large Diffs Timeout

**Symptom**: Diff-Request timeout bei großen Files

**Ursache**: Grosse Dateien oder viele Aenderungen ueberschreiten das Standard-Timeout. Besonders bei generierten Dateien wie Lockfiles oder Minified Code.

**Lösung**:

Erhoehe die Limits in der Konfiguration:
```json
{
  "options": {
    "maxDiffSize": "5MB",  // Erhöhe Limit
    "diffTimeout": 30000   // 30 seconds
  }
}
```

### Problem 5: Detached HEAD State

**Symptom**: `git.status()` zeigt "HEAD detached"

**Ursache**: HEAD zeigt auf einen bestimmten Commit statt auf einen Branch. Das passiert haeufig nach einem `git checkout` auf einen Commit-Hash oder Tag.

**Lösung**:

Erstelle einen neuen Branch vom aktuellen Zustand aus, um die Arbeit zu sichern:
```javascript
// Check HEAD state
const status = await git.status();
if (status.detached) {
  console.warn("⚠️  HEAD is detached");

  // Create Branch from current state
  await git.branch({
    action: "create",
    name: "recover-detached-head"
  });
}
```

---

## 🆚 Vergleich mit Alternativen

| Feature | Git MCP | Git CLI | lazygit | GitHub MCP |
|---------|---------|---------|---------|------------|
| **Structured Output** | ✅ JSON | ❌ Text | ✅ TUI | ✅ JSON |
| **Claude Integration** | ✅ Native | ❌ Shell | ❌ No | ✅ Native |
| **Safety Checks** | ✅ Built-in | ❌ Manual | ✅ Yes | ❌ API-Level |
| **Auto Commit Messages** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Multi-Repo** | ✅ Yes | ❌ Manual | ❌ No | ✅ Yes |
| **Merge Conflict Help** | ✅ Yes | ❌ No | ✅ Yes | ❌ No |
| **PR Integration** | ❌ Use GitHub MCP | ❌ No | ❌ No | ✅ Yes |
| **Performance** | ✅ Fast | ✅ Fastest | ✅ Fast | ❌ API Latency |
| **Offline** | ✅ Local Ops | ✅ Yes | ✅ Yes | ❌ Requires Internet |

### Wann was nutzen?

**Git MCP**: Claude Code Integration, Structured Operations
**Git CLI**: Performance-kritisch, Scripts, Advanced Features
**lazygit**: Interactive Terminal UI, Visual Diffs
**GitHub MCP**: PR/Issue Management, GitHub-spezifisch

---

## 🔗 Nützliche Links

### Offizielle Ressourcen
- [MCP Git Server](https://github.com/modelcontextprotocol/servers/tree/main/src/git)
- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Tools & Extensions
- [GitHub MCP](./41-mcp-github.md) - GitHub Integration
- [lazygit](./15-lazygit.md) - Terminal UI für Git
- [delta](./16-delta.md) - Syntax-highlighted Diffs

### Best Practices
- [Git Best Practices](https://sethrobertson.github.io/GitBestPractices/)
- [Commit Message Guidelines](https://chris.beams.io/posts/git-commit/)

---

## 💎 Pro-Tipps

Fortgeschrittene Techniken fuer automatisiertes Release-Management, Pre-Commit-Hooks und Commit-Validierung.

> 💡 **Tipp**: Nutze `excludePatterns` in der MCP-Konfiguration, um grosse generierte Dateien (z.B. `node_modules`, `*.log`) vom Diff auszuschliessen. Das beschleunigt die Analyse und reduziert Token-Verbrauch.

### 1. Commit-Message Lint Integration

Diese Regex validiert, ob eine Commit-Message dem Conventional Commits Format entspricht. So werden uneinheitliche Messages automatisch abgefangen:
```javascript
// Validiere Commit-Messages
const commitMsgPattern = /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}/;

async function validateCommitMessage(message) {
  if (!commitMsgPattern.test(message)) {
    throw new Error("Commit message doesn't follow conventional format");
  }
}
```

### 2. Auto-Tagging für Releases

Automatische Tag-Erstellung bei Releases spart manuelle Arbeit und stellt sicher, dass jeder Release korrekt getaggt wird:
```javascript
// Auto-create Release Tags
async function createReleaseTag(version) {
  const message = `Release v${version}\n\n${await generateChangelog()}`;

  await git.tag({
    name: `v${version}`,
    message,
    annotated: true
  });

  await git.push({ tags: true });
}
```

### 3. Git Hooks via MCP

Pre-Commit-Hooks blockieren Commits, die Linter-Fehler haben oder fehlschlagende Tests enthalten:
```javascript
// Pre-Commit Hook
git.onBeforeCommit(async (files) => {
  // Run Linter
  await runLinter(files);

  // Run Tests
  const testsPassed = await runTests();
  if (!testsPassed) {
    throw new Error("Tests failed - commit blocked");
  }
});
```

---

## 📚 Zusammenfassung

✅ **Git MCP** ermöglicht strukturierte Git-Operationen für Claude Code
✅ **JSON Responses** statt Text-Parsing
✅ **Safety Features** verhindern destructive Operations
✅ **Auto-Generated** Commit-Messages basierend auf Changes
✅ **Kombiniere** mit GitHub MCP für Full Workflow

### Nächste Schritte

1. **Installiere** Git MCP Server
2. **Teste** mit `git.status()` und `git.diff()`
3. **Nutze** Auto-Commit-Messages
4. **Kombiniere** mit [GitHub MCP](./41-mcp-github.md) für PRs

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0

**Next**: [Lektion 38 - Brave Search MCP Server](./38-mcp-brave-search.md) →
