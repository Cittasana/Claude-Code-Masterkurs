# 41. MCP Server: GitHub

**Kategorie**: Git Workflow MCP Server
**Schwierigkeit**: Fortgeschritten
**Installation**: `npx @modelcontextprotocol/create-server github`
**Offizielle Docs**: [MCP GitHub Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)

---

> 🚀 **Claude Code Relevanz**: Der GitHub MCP Server macht Claude Code zum vollstaendigen GitHub-Workflow-Tool -- von automatischer PR-Erstellung ueber Issue-Management bis hin zu AI-gestuetzten Code Reviews.

## 🎯 Was ist der GitHub MCP Server?

Der **GitHub MCP Server** gibt Claude Code vollständigen Zugriff auf die GitHub API - Issues, Pull Requests, Repositories, Workflows und mehr. Claude kann PRs erstellen, Issues managen, Code Reviews durchführen und Release-Notes generieren.

### GitHub MCP vs. gh CLI vs. Git MCP

**Git MCP**: Lokale Git Operations (commit, branch, diff)
**GitHub MCP**: GitHub-spezifisch (PRs, Issues, Actions)
**gh CLI**: Manual Command-Line Interface

---

## 🔧 Berechtigung

Der GitHub MCP Server erweitert Claude Code um vollstaendige GitHub-Integration. Dieser Abschnitt erklaert die wichtigsten Einsatzszenarien.

### Warum GitHub MCP?

1. **Automated Workflows**: Claude erstellt PRs, schließt Issues
2. **Code Reviews**: Claude reviewed PRs und gibt Feedback
3. **Release Management**: Auto-generate Release Notes
4. **Issue Triage**: Claude kategorisiert und labelt Issues
5. **Repository Analysis**: Analysiere Contributors, Activity, Code Stats

### Use Cases

- **PR Creation**: Claude erstellt PRs mit Generated Descriptions
- **Issue Management**: Claude triage-t und assigned Issues
- **Code Review**: Claude reviewed Code Changes
- **Release Notes**: Auto-generated von Commits
- **Repository Insights**: Stats, Contributors, Activity

---

## 💻 Verwendung

Das Setup erfordert einen GitHub Personal Access Token und die MCP-Server-Konfiguration. Folge diesen Schritten der Reihe nach.

### Installation & Setup

#### 1. GitHub Token erstellen

1. Gehe zu [GitHub Settings → Developer settings → Personal Access Tokens](https://github.com/settings/tokens)
2. "Generate new token (classic)"
3. Select Scopes:
   - `repo` (Full control of repositories)
   - `workflow` (GitHub Actions)
   - `read:org` (Read org data)
   - `write:discussion` (Discussions)

#### 2. MCP Server installieren

Der folgende Befehl installiert den GitHub MCP Server global auf deinem System. Im Gegensatz zu manchen anderen MCP Servern benoetigt der GitHub Server zwingend einen Personal Access Token, um mit der GitHub API zu kommunizieren -- ohne Token funktioniert keine einzige Operation. Das Paket selbst ist leichtgewichtig und fungiert nur als Vermittler zwischen Claude und der GitHub REST API. Nach der Installation musst du den Token in der Konfiguration hinterlegen (siehe naechster Schritt). Beachte, dass der Server auch mit GitHub Enterprise funktioniert, wenn du die Base-URL entsprechend anpasst.

```bash
npm install -g @modelcontextprotocol/server-github
```

#### 3. Konfiguration

Die Konfiguration verbindet den MCP Server mit deinem GitHub Account. Der Token muss die noetige Berechtigung fuer Repos, Workflows und Issues haben.

**~/.config/mcp/github.json**:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      },
      "options": {
        "defaultOwner": "username",
        "defaultRepo": "my-project"
      }
    }
  }
}
```

### Available MCP Tools

#### 1. `github_create_pr`

Dieses Tool erstellt einen Pull Request mit Titel, Beschreibung und Quell-/Ziel-Branch auf GitHub. Der `head`-Parameter ist der Branch mit deinen Aenderungen, und `base` ist der Ziel-Branch (meistens `main`). Der `body`-Parameter akzeptiert Markdown-Formatierung, sodass Claude strukturierte PR-Beschreibungen mit Checklisten, Code-Snippets und Links erstellen kann. Stell dir vor, du hast ein Feature auf einem Branch implementiert und sagst Claude "Erstelle einen PR" -- Claude analysiert die Diffs, generiert eine ausfuehrliche Beschreibung mit Zusammenfassung, Aenderungsliste und Testhinweisen. Das spart dir die manuelle PR-Erstellung und sorgt fuer einheitlich formatierte Beschreibungen. Beachte, dass der Branch vorher gepusht sein muss, damit GitHub ihn kennt.

```json
{
  "name": "github_create_pr",
  "parameters": {
    "owner": "username",
    "repo": "my-project",
    "title": "feat: Add dark mode",
    "body": "## Changes\n- Implemented dark mode toggle\n- Updated theme system",
    "head": "feature/dark-mode",
    "base": "main"
  }
}
```

#### 2. `github_list_issues`

Dieses Tool listet Issues nach Status und Labels gefiltert auf und ist ideal fuer Issue-Triage, Sprint-Planung und Uebersichten. Der `state`-Parameter filtert nach offenen, geschlossenen oder allen Issues, waehrend `labels` nach spezifischen Labels filtert -- z.B. nur Issues mit `bug` und `priority-high`. Stell dir vor, du willst wissen, welche kritischen Bugs noch offen sind -- mit den richtigen Filtern bekommst du sofort eine priorisierte Liste. Claude kann die Ergebnisse automatisch zusammenfassen und nach Dringlichkeit sortieren. Die Response enthaelt fuer jedes Issue den Titel, die Beschreibung, Labels, Zuweisungen und den Zeitpunkt der letzten Aktivitaet.

```json
{
  "name": "github_list_issues",
  "parameters": {
    "owner": "username",
    "repo": "my-project",
    "state": "open",  // open, closed, all
    "labels": ["bug", "priority-high"]
  }
}
```

#### 3. `github_create_issue`

Dieses Tool erstellt ein neues Issue auf GitHub mit Titel, Beschreibung, Labels und Zuweisungen. Der `body`-Parameter unterstuetzt Markdown-Formatierung fuer strukturierte Bug-Reports oder Feature-Requests mit Checklisten und Code-Beispielen. Mit `labels` kategorisierst du das Issue sofort, und `assignees` weist es einem oder mehreren Teammitgliedern zu. Stell dir vor, Claude findet beim Code Review einen Bug -- es kann automatisch ein Issue mit allen relevanten Details erstellen, den betroffenen Code verlinken und das Issue dem zustaendigen Entwickler zuweisen. Das spart den manuellen Schritt, zwischen Code Editor und GitHub-Webinterface zu wechseln.

```json
{
  "name": "github_create_issue",
  "parameters": {
    "owner": "username",
    "repo": "my-project",
    "title": "Bug: Button not responsive",
    "body": "## Description\nButton is not responsive on mobile...",
    "labels": ["bug"],
    "assignees": ["username"]
  }
}
```

#### 4. `github_review_pr`

Dieses Tool erstellt ein Review fuer einen Pull Request, was den Kern des Code-Review-Workflows darstellt. Der `event`-Parameter bestimmt den Typ des Reviews: `COMMENT` fuer allgemeines Feedback, `APPROVE` fuer eine Genehmigung und `REQUEST_CHANGES` fuer eine Aenderungsanforderung. Claude kann den PR-Diff analysieren, potenzielle Probleme identifizieren (fehlende Fehlerbehandlung, Performance-Issues, Sicherheitsluecken) und ein detailliertes Review mit Inline-Kommentaren erstellen. Stell dir vor, du bittest Claude "Review den PR #123" -- es liest alle geaenderten Dateien, prueft Best Practices und gibt konstruktives Feedback. Das ersetzt zwar nicht das menschliche Review, beschleunigt aber den Prozess erheblich, indem offensichtliche Probleme frueh erkannt werden.

```json
{
  "name": "github_review_pr",
  "parameters": {
    "owner": "username",
    "repo": "my-project",
    "pull_number": 123,
    "event": "COMMENT",  // APPROVE, REQUEST_CHANGES, COMMENT
    "body": "LGTM! Great implementation."
  }
}
```

#### 5. `github_get_repo_stats`

Dieses Tool ruft allgemeine Repository-Statistiken wie Stars, Forks, offene Issues und Contributor-Anzahl ab. Es ist besonders nuetzlich, um einen schnellen Ueberblick ueber den Zustand und die Aktivitaet eines Projekts zu bekommen. Stell dir vor, du willst wissen, ob ein Open-Source-Projekt aktiv gepflegt wird -- die Anzahl der Stars, Commits und Contributors gibt dir schnell Aufschluss. Claude kann diese Daten nutzen, um woechentliche Reports ueber die Projektaktivitaet zu erstellen oder Trends ueber die Zeit zu verfolgen. Die Response enthaelt alle wichtigen Metriken in einem einzelnen, kompakten JSON-Objekt.

```json
{
  "name": "github_get_repo_stats",
  "parameters": {
    "owner": "username",
    "repo": "my-project"
  }
}
```

**Response**:
```json
{
  "stars": 1234,
  "forks": 89,
  "openIssues": 23,
  "contributors": 45,
  "commits": 2341,
  "branches": 12
}
```

---

## 🏆 Best Practices

### 1. **Structured PR Descriptions**

Einheitlich strukturierte PR-Beschreibungen machen Code Reviews effizienter, weil der Reviewer sofort weiss, wo er die wichtigen Informationen findet. Dieses Template enthaelt die fuenf wichtigsten Sektionen: eine kurze Zusammenfassung, die Liste der Aenderungen, den Testplan, optionale Screenshots und zugehoerige Issues. Claude kann dieses Template automatisch befuellen, indem es die Diffs analysiert und die relevanten Informationen extrahiert. Stell dir vor, jeder PR in deinem Projekt sieht gleich aus -- Reviews werden schneller, weil der Reviewer das Format kennt und nicht nach Informationen suchen muss. Definiere das Template als `.github/PULL_REQUEST_TEMPLATE.md` in deinem Repository, damit es bei jedem neuen PR automatisch vorausgefuellt wird.

```javascript
// Template für PR Descriptions
const prTemplate = {
  summary: "Brief overview of changes",
  changes: ["- Added X", "- Updated Y", "- Fixed Z"],
  testing: ["- Unit tests passing", "- Manual testing done"],
  screenshots: "![Screenshot](url)",
  breakingChanges: "None",
  relatedIssues: "Closes #123, Fixes #456"
};
```

### 2. **Auto-Labeling Issues**

Automatisches Labeling spart Zeit bei der Issue-Triage, indem Claude anhand des Titels und der Beschreibung die passenden Labels zuweist. Die Funktion prueft den Issue-Titel auf Keywords wie "bug", "feat" oder "urgent" und fuegt die entsprechenden Labels hinzu. Stell dir vor, 20 neue Issues kommen rein -- anstatt jedes einzeln zu lesen und zu labeln, kann Claude alle in Sekunden kategorisieren. Du kannst die Keyword-Erkennung beliebig erweitern, z.B. "crash" oder "error" automatisch als `bug` labeln. Claude kann auch den Issue-Body analysieren, um genauere Labels zu vergeben, z.B. `frontend` oder `backend` basierend auf den erwaenhnten Dateien.

```javascript
async function autoLabel(issue) {
  const labels = [];

  if (issue.title.includes('bug')) labels.push('bug');
  if (issue.title.includes('feat')) labels.push('enhancement');
  if (issue.body.includes('urgent')) labels.push('priority-high');

  await github.addLabels({ issue_number: issue.number, labels });
}
```

### 3. **PR Size Limits**

Grosse Pull Requests mit Hunderten von geaenderten Zeilen sind schwer zu reviewen und fuehren haeufig dazu, dass Reviewer oberlaechlich drueberschauen und Probleme uebersehen. Diese Funktion prueft die Groesse eines PRs und postet automatisch eine Warnung, wenn mehr als 500 Zeilen geaendert wurden. Stell dir vor, ein Entwickler reicht einen PR mit 2.000 geaenderten Zeilen ein -- Claude weist freundlich darauf hin, dass der PR in kleinere, leichter reviewbare Teile aufgeteilt werden sollte. Die Schwelle von 500 Zeilen ist ein gaengiger Richtwert, den du an die Praeferenzen deines Teams anpassen kannst. Studien zeigen, dass die Review-Qualitaet ab 200-400 geaenderten Zeilen deutlich abnimmt.

```javascript
async function checkPRSize(pr) {
  const files = await github.getPRFiles({ pr_number: pr.number });
  const totalChanges = files.reduce((sum, f) => sum + f.changes, 0);

  if (totalChanges > 500) {
    await github.commentPR({
      pr_number: pr.number,
      body: "⚠️  Large PR (>500 changes). Consider splitting."
    });
  }
}
```

---

## 📝 Beispiele (12+)

### Beispiel 1: Auto-PR Creator

```bash
Du: "Erstelle einen PR für meinen Feature-Branch"

Claude:
1. git.diff({ base: "main", head: "feature/dark-mode" })
2. Analysiert Changes
3. github.create_pr({
     title: "feat(ui): Implement dark mode toggle",
     body: "Generated Description with Changes, Testing, Screenshots"
   })

→ "✅ PR #123 created: https://github.com/user/repo/pull/123"
```

### Beispiel 2: Issue Triage Bot

```bash
Du: "Triage alle neuen Issues"

Claude:
1. github.list_issues({ state: "open", labels: ["untriaged"] })
2. Für jedes Issue:
   - Analysiert Content
   - Assigned Labels (bug, enhancement, question)
   - Assigned to Team Member
   - Adds Comment mit Details

→ "Triaged 15 Issues: 8 bugs, 5 enhancements, 2 questions"
```

### Beispiel 3: Code Review Assistant

```bash
Du: "Review PR #123"

Claude:
1. github.get_pr({ pr_number: 123 })
2. github.get_pr_diff({ pr_number: 123 })
3. Analysiert Code:
   - Security Issues?
   - Performance Problems?
   - Best Practices?
4. github.review_pr({
     pr_number: 123,
     event: "COMMENT",
     comments: [/* inline comments */]
   })

Review:
```
✅ Code Quality: Good
⚠️  Suggestions:
  - Add error handling in line 45
  - Consider memoizing expensive calculation
  - Missing unit tests for new function

Overall: LGTM with minor suggestions
```

### Beispiel 4: Release Notes Generator

```bash
Du: "Generiere Release Notes für v2.0"

Claude:
1. github.list_pr({ state: "closed", base: "main" })
   → Alle PRs seit letztem Release
2. Gruppiert nach Type (feat, fix, docs)
3. github.create_release({
     tag: "v2.0.0",
     name: "Version 2.0.0",
     body: generatedReleaseNotes
   })

Release Notes:
```markdown
# Version 2.0.0

## 🎉 Features
- feat(auth): Add OAuth integration (#145)
- feat(ui): Dark mode support (#167)
- feat(api): Rate limiting (#189)

## 🐛 Bug Fixes
- fix(ui): Button alignment on mobile (#134)
- fix(auth): Token refresh race condition (#156)

## 📚 Documentation
- docs: Update API documentation (#178)
```

### Beispiel 5: Stale Issue Closer

```bash
Du: "Close stale issues (>30 days ohne Activity)"

Claude:
1. github.list_issues({ state: "open" })
2. Filter nach last_updated > 30 days
3. Für jedes stale Issue:
   - github.comment({ body: "Closing due to inactivity..." })
   - github.close_issue({ issue_number: X })

→ "Closed 12 stale issues"
```

### Beispiel 6: Contributor Stats

```bash
Du: "Wer sind die Top Contributors?"

Claude:
github.get_contributors({ owner: "user", repo: "project" })

Ausgabe:
```
Top Contributors (Last 30 Days):

1. Alice (45 commits, 2,341 additions, 892 deletions)
2. Bob (32 commits, 1,567 additions, 234 deletions)
3. Charlie (28 commits, 987 additions, 456 deletions)

Most Active Files:
- src/App.tsx (23 commits)
- src/api/client.ts (15 commits)
```

### Beispiel 7: Dependency Update PRs

```bash
Du: "Erstelle PRs für Dependency Updates"

Claude:
1. Liest package.json
2. Checkt npm für Updates
3. Für jede Major Update:
   - Create Branch
   - Update package.json
   - github.create_pr({
       title: "chore(deps): Update react to v19",
       body: "Breaking changes: ..."
     })

→ "Created 5 PRs for dependency updates"
```

### Beispiel 8: Security Audit

```bash
Du: "Check for Security Issues in recent PRs"

Claude:
1. github.list_pr({ state: "open" })
2. Für jeden PR:
   - Analysiert Diff
   - Sucht nach: hardcoded secrets, SQL injection, XSS
3. github.comment mit Findings

Findings:
```
⚠️  Security Issues Found:

PR #123:
  - Hardcoded API Key in line 45 (src/config.ts)
  - SQL Query without parameterization (line 89)

PR #145:
  - User Input not sanitized (XSS risk)
```

### Beispiel 9: PR Merge Queue Manager

```bash
Du: "Manage PR Merge Queue"

Claude:
1. github.list_pr({ state: "open", labels: ["ready-to-merge"] })
2. Sortiert nach:
   - Priority Label
   - CI Status
   - Review Status
3. Merged PRs in Order

Merge Queue:
```
1. PR #145 (priority-high, ✅ CI passed, ✅ 2 approvals)
   → Merging...
2. PR #134 (normal, ✅ CI passed, ⚠️  1 approval needed)
   → Waiting for review
```

### Beispiel 10: Issue Template Generator

```bash
Du: "Erstelle Issue Templates"

Claude generiert:
```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: Bug Report
description: File a bug report
labels: ["bug"]
body:
  - type: textarea
    attributes:
      label: Description
      description: Describe the bug
    validations:
      required: true
  - type: input
    attributes:
      label: Version
      placeholder: v1.0.0
```

### Beispiel 11: Automated Changelog

```bash
Du: "Update CHANGELOG.md"

Claude:
1. github.list_commits({ since: lastRelease })
2. Gruppiert nach Conventional Commits
3. filesystem.write_file("CHANGELOG.md", generated)

CHANGELOG:
```markdown
## [1.5.0] - 2026-02-12

### Added
- User authentication with JWT
- Dark mode support

### Fixed
- Button alignment on mobile
- Memory leak in data fetcher
```

### Beispiel 12: Branch Protection Setup

```bash
Du: "Setup Branch Protection für main"

Claude:
github.update_branch_protection({
  owner: "user",
  repo: "project",
  branch: "main",
  protection: {
    required_status_checks: {
      strict: true,
      contexts: ["ci/build", "ci/test"]
    },
    required_pull_request_reviews: {
      required_approving_review_count: 2
    },
    enforce_admins: true
  }
})

→ "✅ Branch protection enabled for main"
```

---

## 🤖 Claude Code Integration

### Workflow 1: Issues als Context laden

In diesem maechtigsten Workflow nutzt Claude GitHub Issues als Aufgabenbeschreibung und implementiert die gewuenschte Funktion direkt. Claude liest zuerst das Issue mit allen Details, Kommentaren und verlinkten Diskussionen, versteht dann die Anforderung und generiert den passenden Code. Stell dir vor, du hast ein Issue "Implementiere Dark Mode" -- Claude liest die Beschreibung, sieht die Akzeptanzkriterien und die Design-Referenzen, und erstellt dann den kompletten Code inklusive Tests. Das verbindet Issue-Tracking nahtlos mit der Code-Generierung, ohne dass du die Anforderungen nochmal separat beschreiben musst.

```bash
# "Lies Issue #42 und implementiere die beschriebene Funktion"
# Claude nutzt GitHub MCP um Issue-Details zu laden
```

### Workflow 2: MCP Konfiguration

Diese Konfiguration verbindet den GitHub MCP Server mit deinem GitHub Account ueber einen Personal Access Token. Der Token wird als Umgebungsvariable `GITHUB_PERSONAL_ACCESS_TOKEN` uebergeben und muss die Berechtigungen `repo`, `workflow` und `read:org` haben. Ersetze `ghp_xxxx` durch deinen tatsaechlichen Token, den du unter GitHub Settings > Developer settings > Personal Access Tokens erstellen kannst. Beachte, dass der Token im Klartext in der Konfigurationsdatei steht -- speichere die Datei deshalb nicht in einem Git-Repository, oder nutze stattdessen eine Umgebungsvariable aus deiner Shell-Konfiguration. Fuer Teams empfiehlt sich ein GitHub App Token statt eines persoenlichen Tokens, da dieser feinere Berechtigungen erlaubt.

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxx"
      }
    }
  }
}
```

### Workflow 3: PR-Review Workflow

Claude kann Pull Requests umfassend reviewen, indem es den Diff liest, den Code analysiert und ein strukturiertes Review mit Inline-Kommentaren erstellt. Claude prueft dabei typische Probleme wie fehlende Fehlerbehandlung, potenzielle Performance-Issues, Sicherheitsluecken und Abweichungen von Best Practices. Stell dir vor, du bittest Claude "Review PR #15" -- es liest alle geaenderten Dateien, versteht den Kontext anhand der PR-Beschreibung und gibt konstruktives, spezifisches Feedback zu jeder problematischen Stelle. Das Review wird direkt auf GitHub gepostet, sodass der PR-Autor die Kommentare inline sehen kann. Claude kann auch vorherige Review-Kommentare lesen und pruefen, ob sie adressiert wurden.

```bash
# "Review den PR #15 und schlage Verbesserungen vor"
# Claude liest PR-Diffs, Kommentare und erstellt Review
```

> 💡 **Tipp**: Mit GitHub MCP kann Claude Code direkt Issues lesen, PRs erstellen und Code-Reviews durchfuehren.

---

## 🐛 Troubleshooting

### Problem 1: Invalid Token

**Symptom**: `Error: 401 Unauthorized`

**Ursache**: Der Personal Access Token ist ungueltig, abgelaufen oder hat nicht die benoetigten Berechtigungen. GitHub Tokens koennen ein Ablaufdatum haben, das du beim Erstellen festlegst.

**Loesung**:

Pruefe zuerst, ob der Token die benoetigten Scopes hat: `repo` fuer Repository-Zugriff, `workflow` fuer GitHub Actions und `read:org` fuer Organisations-Daten. Falls der Token abgelaufen ist, musst du auf der GitHub-Website einen neuen generieren und ihn in der MCP-Konfiguration aktualisieren. Stelle sicher, dass keine zusaetzlichen Leerzeichen oder Zeilenumbrueche im Token-Wert enthalten sind. Teste den Token mit `curl -H "Authorization: token ghp_xxxx" https://api.github.com/user`, um zu pruefen, ob er funktioniert.

```bash
# Check Token Permissions
# Benötigt: repo, workflow, read:org

# Regenerate Token:
https://github.com/settings/tokens
```

### Problem 2: Rate Limit

**Symptom**: `Error: 403 API rate limit exceeded`

**Ursache**: Du hast die GitHub API Rate Limits ueberschritten. Authentifizierte Anfragen erlauben 5.000 Requests pro Stunde, nicht-authentifizierte nur 60. Bei intensiver Nutzung (z.B. Issue-Triage mit vielen API-Aufrufen) kann das Limit schnell erreicht werden.

**Loesung**:

Pruefe den aktuellen Rate-Limit-Status und warte, bis das Limit zurueckgesetzt wird. Die Reset-Zeit wird im Response-Header mitgeteilt. Du kannst auch die Anzahl der API-Aufrufe reduzieren, indem du Batch-Anfragen nutzt und Ergebnisse cachest.

```javascript
// Check Rate Limit
const rateLimit = await github.getRateLimit();
console.log(`Remaining: ${rateLimit.remaining}/${rateLimit.limit}`);

// Wait & Retry
if (rateLimit.remaining < 10) {
  await sleep(rateLimit.reset - Date.now());
}
```

### Problem 3: PR Creation Fails

**Symptom**: Can't create PR

**Ursache**: Der Quell-Branch existiert nicht auf dem Remote, es gibt bereits einen PR fuer diesen Branch, oder der Ziel-Branch (base) ist falsch konfiguriert. Haeufig wird vergessen, den lokalen Branch vor der PR-Erstellung zu pushen.

**Loesung**:

Pruefe zuerst, ob der Branch auf dem Remote existiert, und ob bereits ein PR fuer diesen Branch offen ist. Falls der Branch noch nicht gepusht wurde, fuehre `git push -u origin feature-name` aus. Wenn bereits ein PR existiert, musst du den bestehenden PR aktualisieren statt einen neuen zu erstellen.

```bash
# Check if Branch exists
git branch -r | grep feature-name

# Check if PR already exists
gh pr list --head feature-name
```

---

## 🆚 Vergleich

| Feature | GitHub MCP | gh CLI | Git MCP | GitHub API Direct |
|---------|------------|--------|---------|-------------------|
| **Claude Integration** | ✅ Native | ❌ Shell | ❌ Git Only | ❌ Code |
| **PR Management** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Issues** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Local Git Ops** | ❌ Use Git MCP | ✅ Yes | ✅ Yes | ❌ No |
| **Structured Output** | ✅ JSON | ❌ Text | ✅ JSON | ✅ JSON |
| **Rate Limiting** | ✅ Handled | ✅ Handled | ❌ N/A | ❌ Manual |

---

## 🔗 Nützliche Links

- [GitHub API Docs](https://docs.github.com/rest)
- [MCP GitHub Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [gh CLI](https://cli.github.com/)

---

## 💎 Pro-Tipps

### 1. Combine Git + GitHub MCP

Die Kombination von Git MCP (fuer lokale Operationen) und GitHub MCP (fuer Remote-Operationen) ergibt einen vollstaendigen End-to-End-Workflow. Claude kann lokal committen, pushen und dann automatisch einen PR auf GitHub erstellen -- alles in einer einzigen Interaktion. Stell dir vor, du sagst Claude "Committe meine Aenderungen und erstelle einen PR" -- es fuehrt den lokalen Commit mit einer generierten Message durch, pusht den Branch und erstellt den PR mit einer ausfuehrlichen Beschreibung. Dieser kombinierte Workflow spart mehrere manuelle Schritte und stellt sicher, dass PR-Beschreibung und Commit-Messages konsistent sind.

```javascript
// Local: Git MCP
await git.commit({ message: "feat: Add feature" });
await git.push();

// Remote: GitHub MCP
await github.create_pr({
  title: "feat: Add feature",
  head: currentBranch
});
```

### 2. Automated PR Templates

Claude kann bestehende PR-Templates aus deinem Repository automatisch lesen und befuellen, sodass jeder PR deinem Team-Standard entspricht. Das Template wird aus `.github/pull_request_template.md` gelesen, und Claude fuellt die Platzhalter basierend auf den tatsaechlichen Code-Aenderungen aus. Stell dir vor, dein Template hat Sektionen fuer "Changes", "Testing" und "Breaking Changes" -- Claude analysiert den Diff und befuellt jede Sektion mit den relevanten Informationen. Das stellt sicher, dass keine wichtige Information vergessen wird und jeder PR die gleiche Struktur hat. Du musst nur einmal das Template definieren, und Claude kuemmert sich um den Rest.

```javascript
const prTemplate = await filesystem.read_file(".github/pull_request_template.md");

await github.create_pr({
  title: "...",
  body: fillTemplate(prTemplate, { changes, testing })
});
```

### 3. CI Status Checker

Diese Funktion wartet darauf, dass alle CI-Checks fuer einen PR abgeschlossen sind, und gibt das Ergebnis zurueck. Das ist nuetzlich in automatisierten Workflows, in denen Claude nach dem Erstellen eines PRs warten soll, bis die Tests durchgelaufen sind, bevor es weitere Aktionen ausfuehrt. Die Funktion pollt alle 30 Sekunden den Check-Status, bis er `completed` ist. Stell dir vor, Claude erstellt einen PR und wartet automatisch auf die CI-Ergebnisse -- bei Erfolg merged es den PR, bei Fehlschlag analysiert es die Logs und schlaegt Fixes vor. Beachte, dass das Polling-Intervall von 30 Sekunden an die typische CI-Laufzeit angepasst werden sollte.

```javascript
async function waitForCI(pr_number) {
  let checks;
  do {
    checks = await github.get_pr_checks({ pr_number });
    await sleep(30000);  // Check every 30s
  } while (checks.status !== 'completed');

  return checks.conclusion;  // success, failure
}
```

---

## 📚 Zusammenfassung

✅ **GitHub MCP** - Full GitHub API Integration für Claude
✅ **PR Management** - Create, Review, Merge
✅ **Issue Triage** - Auto-Label, Assign, Close
✅ **Release Automation** - Generated Release Notes
✅ **Code Review** - AI-Powered PR Reviews

### Nächste Schritte

1. **GitHub Token** erstellen
2. **MCP Server** konfigurieren
3. **Test** PR Creation
4. **Kombiniere** mit [Git MCP](./37-mcp-git.md)

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0

**Next**: [Lektion 42 - Puppeteer MCP Server](./42-mcp-puppeteer.md) →
