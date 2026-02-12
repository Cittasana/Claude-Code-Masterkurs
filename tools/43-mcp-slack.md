# 43. MCP Server: Slack

**Kategorie**: Communication MCP Server
**Schwierigkeit**: Fortgeschritten
**Installation**: `npx @modelcontextprotocol/create-server slack`
**Offizielle Docs**: [MCP Slack Server](https://github.com/modelcontextprotocol/servers/tree/main/src/slack)

---

> 🚀 **Claude Code Relevanz**: Der Slack MCP Server verbindet Claude Code mit deiner Team-Kommunikation -- automatische Benachrichtigungen, Support-Bots und CI/CD-Alerts direkt aus dem Entwicklungs-Workflow heraus.

## 🎯 Was ist der Slack MCP Server?

Der **Slack MCP Server** integriert Claude Code mit Slack - Messages senden/empfangen, Channels durchsuchen, Reactions hinzufügen und Notifications managen. Claude kann automatisch auf Slack-Messages reagieren, Support-Anfragen beantworten und Team-Updates posten.

### Warum Slack via MCP?

**Ohne MCP**:
```bash
# Claude generiert curl-Command für Slack API
curl -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer token" \
  -d "channel=C123&text=Hello"
→ Manual API-Calls, Text-Parsing nötig
```

**Mit MCP**:
```json
{
  "method": "slack_send_message",
  "params": {
    "channel": "C123456",
    "text": "Hello from Claude!"
  }
}
→ Strukturierte API-Integration, JSON-Response
```

---

## 🔧 Berechtigung

### Warum Slack MCP?

1. **Team Communication**: Claude postet Updates, Benachrichtigungen
2. **Support Automation**: Auto-Antworten auf häufige Fragen
3. **Monitoring Alerts**: Claude postet System-Alerts
4. **Daily Standups**: Automatische Standup-Posts
5. **Code Reviews**: Claude posted PR-Notifications
6. **Analytics Reports**: Claude shared wöchentliche Metriken

### Use Cases

- **Support Bot**: Claude beantwortet Support-Anfragen
- **Release Notifications**: Auto-Posts bei Deployments
- **Bug Reports**: Claude erstellt Issues aus Slack-Messages
- **Team Standups**: Claude sammelt & postet Daily Updates
- **CI/CD Alerts**: Build/Deploy-Status in Slack
- **On-Call Rotation**: Claude postet Incident-Summaries

---

## 💻 Verwendung

### Installation & Setup

#### 1. Slack App erstellen

1. Gehe zu [api.slack.com/apps](https://api.slack.com/apps)
2. "Create New App" → "From scratch"
3. App Name: "Claude Code Integration"
4. Workspace auswählen

#### 2. OAuth Scopes hinzufügen

**Bot Token Scopes**:
```
channels:read       // List public channels
channels:history    // Read messages
chat:write          // Send messages
reactions:read      // Read reactions
reactions:write     // Add reactions
users:read          // Get user info
files:write         // Upload files
```

#### 3. Install App to Workspace

1. "OAuth & Permissions" → "Install to Workspace"
2. Copy "Bot User OAuth Token" (starts with `xoxb-`)

### Konfiguration

**~/.config/mcp/slack.json**:
```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-slack"
      ],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token-here",
        "SLACK_APP_TOKEN": "xapp-your-app-token-here"
      },
      "options": {
        "defaultChannel": "C123456",
        "mentionPrefix": "@claude",
        "autoReact": true,
        "threadReplies": true
      },
      "permissions": {
        "read": true,
        "write": true,
        "delete": false,
        "admin": false
      }
    }
  }
}
```

### Available MCP Tools

#### 1. `slack_send_message`
```json
{
  "name": "slack_send_message",
  "description": "Send message to channel or user",
  "parameters": {
    "channel": "C123456",  // Channel ID or @username
    "text": "Hello from Claude!",
    "thread_ts": "1234567890.123456"  // Optional: Reply in thread
  }
}
```

**Response**:
```json
{
  "ok": true,
  "channel": "C123456",
  "ts": "1234567890.123456",
  "message": {
    "text": "Hello from Claude!",
    "user": "U123456"
  }
}
```

#### 2. `slack_list_channels`
```json
{
  "name": "slack_list_channels",
  "description": "List all channels",
  "parameters": {
    "types": "public_channel,private_channel"
  }
}
```

#### 3. `slack_read_messages`
```json
{
  "name": "slack_read_messages",
  "description": "Read messages from channel",
  "parameters": {
    "channel": "C123456",
    "limit": 100,
    "oldest": "1234567890.123456"  // Optional: Since timestamp
  }
}
```

#### 4. `slack_add_reaction`
```json
{
  "name": "slack_add_reaction",
  "description": "Add emoji reaction",
  "parameters": {
    "channel": "C123456",
    "timestamp": "1234567890.123456",
    "name": "thumbsup"  // Emoji name without :
  }
}
```

#### 5. `slack_search_messages`
```json
{
  "name": "slack_search_messages",
  "description": "Search messages",
  "parameters": {
    "query": "bug report from:@john",
    "sort": "timestamp",  // timestamp, relevance
    "sort_dir": "desc"
  }
}
```

#### 6. `slack_upload_file`
```json
{
  "name": "slack_upload_file",
  "description": "Upload file to channel",
  "parameters": {
    "channel": "C123456",
    "file_path": "/path/to/file.txt",
    "title": "Report",
    "initial_comment": "Here's the report"
  }
}
```

---

## 🏆 Best Practices

### 1. **Thread-basierte Conversations**

```javascript
// ✅ Reply in Thread, nicht in Channel
await slack_send_message({
  channel: "C123",
  text: "Answer to your question...",
  thread_ts: originalMessage.ts  // Keep conversation organized
});

// ❌ Vermeiden: Spam im Channel
await slack_send_message({
  channel: "C123",
  text: "Answer"  // No thread_ts → New message
});
```

### 2. **Rate Limiting beachten**

```javascript
// Slack Tier 3: 50+ requests/minute allowed
// But be respectful:

// ❌ Don't spam
for (let i = 0; i < 100; i++) {
  await slack_send_message({ text: "Spam" });
}

// ✅ Batch & Throttle
const messages = [...];
for (const msg of messages) {
  await slack_send_message(msg);
  await sleep(1000);  // 1 msg/second
}
```

### 3. **Rich Message Formatting**

```javascript
// ✅ Use Block Kit for rich messages
await slack_send_message({
  channel: "C123",
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Deployment Successful* :rocket:\n\nVersion: `v2.0.0`\nEnvironment: Production"
      }
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "View Logs" },
          url: "https://logs.example.com"
        }
      ]
    }
  ]
});
```

---

## 📝 Beispiele (12+)

### Beispiel 1: Support Bot

```bash
Du: "Monitor #support und beantworte häufige Fragen"

Claude Setup:
1. slack_read_messages({ channel: "support", limit: 10 })
2. For each new message:
   - Analyze question
   - Check if FAQ-Topic
   - If yes → Reply in thread

Beispiel-Flow:
User: "Wie kann ich mein Passwort zurücksetzen?"

Claude:
slack_send_message({
  channel: "C123",
  thread_ts: "1234567890.123456",
  text: "Hey! Du kannst dein Passwort hier zurücksetzen: https://app.example.com/reset\n\nFalls das nicht klappt, ping @support-team"
})
slack_add_reaction({
  channel: "C123",
  timestamp: "1234567890.123456",
  name: "white_check_mark"
})
```

### Beispiel 2: Daily Standup Automation

```bash
Du: "Sammle Daily Standup Updates"

Claude (jeden Morgen 9:00):
1. slack_send_message({
     channel: "team",
     text: "Good morning! :sun: Daily Standup Time!\n\nPlease share:\n1. ✅ What you did yesterday\n2. 📅 What you're doing today\n3. 🚧 Any blockers?"
   })
2. Wait 2 hours
3. slack_read_messages({ channel: "team", since: standupMessageTs })
4. Sammle alle Antworten
5. filesystem.write_file({ path: "standups/2026-02-12.md", content: summary })
6. slack_send_message({
     channel: "team",
     text: ":memo: Standup Summary posted to standups/2026-02-12.md"
   })
```

### Beispiel 3: CI/CD Notifications

```bash
Du: "Poste Deployment-Status nach jedem Deploy"

Claude (triggered by CI/CD):
1. Check if deployment successful
2. slack_send_message({
     channel: "deployments",
     blocks: [
       {
         type: "section",
         text: {
           type: "mrkdwn",
           text: `*Deployment to Production* :rocket:\n\n:white_check_mark: Status: Success\n:package: Version: v${version}\n:timer_clock: Duration: ${duration}s\n:bust_in_silhouette: Deployed by: ${user}`
         }
       },
       {
         type: "actions",
         elements: [
           { type: "button", text: "View Logs", url: logsUrl },
           { type: "button", text: "Rollback", url: rollbackUrl }
         ]
       }
     ]
   })
```

### Beispiel 4: Bug Report → GitHub Issue

```bash
Du: "Erstelle GitHub Issues aus #bugs Channel"

Claude:
1. slack_read_messages({ channel: "bugs" })
2. For each message with :bug: reaction:
   - Extract bug details
   - github.create_issue({
       title: "Bug from Slack: ...",
       body: message.text,
       labels: ["bug", "from-slack"]
     })
   - slack_send_message({
       thread_ts: message.ts,
       text: `:white_check_mark: Created GitHub Issue: ${issueUrl}`
     })
```

### Beispiel 5: Weekly Analytics Report

```bash
Du: "Poste wöchentlich Analytics-Report"

Claude (jeden Freitag 17:00):
1. postgres.query({ query: "SELECT ... WHERE week = current_week" })
2. Generate summary
3. slack_upload_file({
     channel: "analytics",
     file_path: "reports/week-42.pdf",
     title: "Weekly Analytics Report - Week 42",
     initial_comment: `
       :bar_chart: *Weekly Analytics Report*

       This week's highlights:
       - MAU: 12,345 (+5%)
       - Revenue: $123,456 (+12%)
       - Churn: 2.3% (-0.5%)

       Full report attached below.
     `
   })
```

### Beispiel 6: On-Call Incident Summary

```bash
Du: "Poste Incident-Summary ins #incidents Channel"

Claude:
incident = {
  title: "API Latency Spike",
  duration: "2h 15min",
  impact: "30% of API requests affected",
  root_cause: "Database connection pool exhausted",
  resolution: "Increased pool size from 10 to 50",
  oncall: "@john"
}

slack_send_message({
  channel: "incidents",
  blocks: [
    { type: "header", text: { type: "plain_text", text: ":rotating_light: Incident Resolved" }},
    { type: "section", text: { type: "mrkdwn", text: `*${incident.title}*` }},
    { type: "section", fields: [
        { type: "mrkdwn", text: `*Duration:*\n${incident.duration}` },
        { type: "mrkdwn", text: `*Impact:*\n${incident.impact}` }
      ]},
    { type: "section", text: { type: "mrkdwn", text: `*Root Cause:*\n${incident.root_cause}` }},
    { type: "section", text: { type: "mrkdwn", text: `*Resolution:*\n${incident.resolution}` }},
    { type: "context", elements: [{ type: "mrkdwn", text: `Handled by ${incident.oncall}` }]}
  ]
})
```

### Beispiel 7: Code Review Reminder

```bash
Du: "Remind Team zu offenen PRs"

Claude (täglich 15:00):
1. github.list_prs({ state: "open" })
2. For each PR older than 24h without review:
   - slack_send_message({
       channel: "engineering",
       text: `:eyes: *PR needs review*\n\n${pr.title}\nAuthor: @${pr.author}\nAge: ${pr.age} hours\n\n${pr.url}`
     })
```

### Beispiel 8: Meeting Notes Distribution

```bash
Du: "Poste Meeting-Notes nach jedem Meeting"

Claude:
1. filesystem.read_file({ path: "meetings/2026-02-12.md" })
2. Parse meeting notes
3. slack_send_message({
     channel: "team",
     text: `:memo: *Meeting Notes - 12. Feb 2026*\n\n*Attendees:* Alice, Bob, Charlie\n\n*Key Decisions:*\n- Decision 1\n- Decision 2\n\n*Action Items:*\n- [ ] @alice: Task 1\n- [ ] @bob: Task 2\n\nFull notes: https://notion.so/...`
   })
```

### Beispiel 9: Customer Feedback Aggregation

```bash
Du: "Sammle Feedback aus #customer-feedback"

Claude:
1. slack_search_messages({
     query: "in:#customer-feedback has::star:",
     sort: "timestamp",
     count: 50
   })
2. Kategorisiere Feedback (Feature Request, Bug, Praise)
3. Generate Summary
4. slack_send_message({
     channel: "product",
     text: `:bulb: *Weekly Customer Feedback Summary*\n\n*Feature Requests (12):*\n- Dark mode (mentioned 5x)\n- Export to PDF (mentioned 3x)\n\n*Bugs (4):*\n- Login timeout issue (mentioned 2x)\n\n*Praise (8):*\n- Fast support response times :heart:`
   })
```

### Beispiel 10: Team Birthday Reminders

```bash
Du: "Post Birthday-Wishes für Team-Members"

Claude (check daily):
1. filesystem.read_file({ path: "team-birthdays.json" })
2. Check if today is someone's birthday
3. slack_send_message({
     channel: "team",
     text: `:birthday: :tada: Happy Birthday @${name}! :tada: :birthday:\n\nWishing you an awesome day! :gift:`
   })
```

### Beispiel 11: Document Search Bot

```bash
Du: "Help Team find documents"

User in Slack: "@claude where is the API documentation?"

Claude:
1. slack_read_messages({ channel: "general" })
2. Detect mention "@claude"
3. Parse query: "API documentation"
4. Search:
   - filesystem.search_content({ pattern: "API documentation" })
   - Or: brave_search.search({ query: "site:docs.example.com API" })
5. slack_send_message({
     thread_ts: originalMessage.ts,
     text: `Found it! :mag:\n\nAPI Documentation: https://docs.example.com/api\n\nRelated:\n- Getting Started: https://docs.example.com/start\n- Authentication: https://docs.example.com/auth`
   })
```

### Beispiel 12: Team Activity Digest

```bash
Du: "Wöchentlicher Activity-Digest"

Claude (jeden Montag):
1. slack_read_messages({ channel: "general", since: lastWeek })
2. Analyze:
   - Most active members
   - Top emojis used
   - Most discussed topics
   - Shared links
3. slack_send_message({
     channel: "general",
     text: `:bar_chart: *Weekly Activity Digest*\n\n*Most Active Members:*\n1. @alice (127 messages)\n2. @bob (89 messages)\n\n*Top Emojis:*\n:rocket: 45x | :fire: 32x | :+1: 28x\n\n*Hot Topics:*\n- New feature launch (23 messages)\n- Q1 planning (18 messages)\n\n*Most Shared:*\nhttps://article.example.com (5x shared)`
   })
```

---

## 🤖 Claude Code Integration

### Workflow 1: Team ueber Deployment informieren
```bash
# In Claude Code Session:
# "Sende eine Nachricht in #deployments: 'v2.1.0 deployed to production'"
# → Claude nutzt Slack MCP um die Nachricht zu senden
```

### Workflow 2: MCP Konfiguration
```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token"
      }
    }
  }
}
```

### Workflow 3: Channel-Kontext fuer Aufgaben nutzen
```bash
# "Lies die letzten 10 Nachrichten aus #feature-requests und erstelle Issues dafuer"
# Claude liest Slack-Nachrichten und erstellt basierend darauf Aufgaben
```

> ⚠️ **Warnung**: Verwende einen dedizierten Bot-Token mit minimalen Berechtigungen - gib dem MCP Server nur Zugriff auf die Channels, die Claude braucht.

> 💡 **Tipp**: Kombiniere Slack MCP mit GitHub MCP, damit Claude Code automatisch ueber PR-Status und Deployments im Team-Channel berichten kann.

---

## 🐛 Troubleshooting

### Problem 1: Invalid Token

**Symptom**: `Error: invalid_auth`

**Lösung**:
```bash
# Check Token Format
echo $SLACK_BOT_TOKEN
# Should start with xoxb-

# Regenerate Token:
# 1. Go to api.slack.com/apps
# 2. Your App → OAuth & Permissions
# 3. Revoke & Reinstall
```

### Problem 2: Missing Permissions

**Symptom**: `Error: missing_scope`

**Lösung**:
```json
// Add Missing Scopes in Slack App Settings:
{
  "scopes": [
    "channels:read",
    "channels:history",
    "chat:write",
    "reactions:write",
    "users:read"
  ]
}

// Then: Reinstall App to Workspace
```

### Problem 3: Channel Not Found

**Symptom**: `Error: channel_not_found`

**Lösung**:
```bash
# Get Channel ID:
1. Open Slack
2. Right-click Channel → Copy Link
3. Extract ID from URL: slack.com/archives/C123456

# Or: List Channels via MCP
slack_list_channels()
```

### Problem 4: Rate Limit

**Symptom**: `Error: rate_limited`

**Lösung**:
```javascript
// Respect Retry-After Header
if (error.code === 'rate_limited') {
  const retryAfter = error.headers['Retry-After'] || 60;
  await sleep(retryAfter * 1000);
  // Retry
}

// Or: Implement Exponential Backoff
```

---

## 🆚 Vergleich

| Feature | Slack MCP | Discord MCP | Email MCP | Teams MCP |
|---------|-----------|-------------|-----------|-----------|
| **Claude Integration** | ✅ Native | ✅ Native | ✅ Native | ✅ Native |
| **Real-time** | ✅ Yes | ✅ Yes | ❌ Polling | ✅ Yes |
| **Rich Formatting** | ✅ Block Kit | ✅ Embeds | ❌ HTML/Text | ✅ Cards |
| **Reactions** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Thread Support** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **File Upload** | ✅ Yes | ✅ Yes | ✅ Attachments | ✅ Yes |
| **Search** | ✅ Powerful | ❌ Limited | ✅ Yes | ❌ Limited |

### Wann Slack MCP?

- ✅ Team nutzt Slack
- ✅ Need Rich Formatting (Block Kit)
- ✅ Need Reactions & Threads
- ✅ Need Powerful Search
- ❌ Team nutzt Discord → Use Discord MCP
- ❌ Need Email Integration → Use Email MCP

---

## 🔗 Nützliche Links

- [Slack API Docs](https://api.slack.com/)
- [Block Kit Builder](https://app.slack.com/block-kit-builder)
- [MCP Slack Server](https://github.com/modelcontextprotocol/servers/tree/main/src/slack)

---

## 💎 Pro-Tipps

### 1. Custom Emoji für Bot-Feedback

```javascript
// Add Custom Reactions
await slack_add_reaction({
  channel: "C123",
  timestamp: "1234567890.123456",
  name: "claude_thinking"  // Custom emoji
});
```

### 2. Interactive Buttons mit Actions

```javascript
// Button Click → Trigger Action
await slack_send_message({
  channel: "C123",
  blocks: [
    {
      type: "actions",
      block_id: "approve_pr",
      elements: [{
        type: "button",
        text: { type: "plain_text", text: "Approve PR" },
        value: "pr_123",
        action_id: "approve_pr_action"
      }]
    }
  ]
});

// Handle Button Click (Webhook)
// Claude receives: { action_id: "approve_pr_action", value: "pr_123" }
// → github.review_pr({ pr_number: 123, event: "APPROVE" })
```

### 3. Scheduled Messages

```javascript
// Post at specific time
await slack_send_message({
  channel: "C123",
  text: "Good morning team!",
  post_at: Math.floor(Date.now() / 1000) + 3600  // 1 hour from now
});
```

### 4. Private Ephemeral Messages

```javascript
// Only visible to specific user
await slack_send_ephemeral({
  channel: "C123",
  user: "U123",  // Only this user sees it
  text: "This is a private message only you can see"
});
```

---

## 📚 Zusammenfassung

✅ **Slack MCP** integriert Claude mit Slack für Team-Communication
✅ **Automation** - Support Bot, Standups, Notifications
✅ **Rich Formatting** - Block Kit für schöne Messages
✅ **Reactions & Threads** - Organize Conversations
✅ **File Upload** - Share Reports, Screenshots
✅ **Search** - Find Messages, Users, Files

### Nächste Schritte

1. **Setup** Slack App & Token
2. **Test** einfache Message senden
3. **Erstelle** Support-Bot für dein Team
4. **Kombiniere** mit [GitHub MCP](./41-mcp-github.md) für CI/CD-Notifications

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0

**Next**: [Zurück zur Tools-Übersicht](./TOOLS-EXTENSIONS-INDEX.md) ←
