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

Der folgende Befehl installiert den GitHub MCP Server global:
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

Erstellt einen Pull Request mit Titel, Beschreibung und Quell-/Ziel-Branch:
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

Listet Issues nach Status und Labels gefiltert auf. Ideal fuer Issue-Triage und Uebersicht:
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

Erstellt ein neues Issue mit Titel, Beschreibung, Labels und Zuweisungen:
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

Erstellt ein Review fuer einen Pull Request. Der `event`-Parameter bestimmt, ob es ein Kommentar, eine Genehmigung oder eine Aenderungsanforderung ist:
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

Ruft allgemeine Repository-Statistiken wie Stars, Forks und Contributor-Anzahl ab:
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
```bash
# "Lies Issue #42 und implementiere die beschriebene Funktion"
# Claude nutzt GitHub MCP um Issue-Details zu laden
```

### Workflow 2: MCP Konfiguration
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
```bash
# "Review den PR #15 und schlage Verbesserungen vor"
# Claude liest PR-Diffs, Kommentare und erstellt Review
```

> 💡 **Tipp**: Mit GitHub MCP kann Claude Code direkt Issues lesen, PRs erstellen und Code-Reviews durchfuehren.

---

## 🐛 Troubleshooting

### Problem 1: Invalid Token

**Symptom**: `Error: 401 Unauthorized`

**Lösung**:
```bash
# Check Token Permissions
# Benötigt: repo, workflow, read:org

# Regenerate Token:
https://github.com/settings/tokens
```

### Problem 2: Rate Limit

**Symptom**: `Error: 403 API rate limit exceeded`

**Lösung**:
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

**Lösung**:
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

```javascript
const prTemplate = await filesystem.read_file(".github/pull_request_template.md");

await github.create_pr({
  title: "...",
  body: fillTemplate(prTemplate, { changes, testing })
});
```

### 3. CI Status Checker

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
