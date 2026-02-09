/**
 * Offizielle Claude-Code-Dokumentation (code.claude.com).
 * Quelle: https://code.claude.com/docs/llms.txt – Stand Februar 2026.
 */

export interface OfficialDocLink {
  title: string;
  description: string;
  url: string;
  lang?: 'de' | 'en';
}

export const officialDocsOverview: OfficialDocLink[] = [
  {
    title: 'Übersicht (DE)',
    description: 'Einstieg, Installation, Nutzungsorte',
    url: 'https://code.claude.com/docs/de/overview',
    lang: 'de',
  },
  {
    title: 'Overview (EN)',
    description: 'Claude Code overview, get started in 30 seconds',
    url: 'https://code.claude.com/docs/en/overview',
    lang: 'en',
  },
  {
    title: 'Quickstart',
    description: 'Erste Schritte in wenigen Minuten',
    url: 'https://code.claude.com/docs/en/quickstart',
  },
  {
    title: 'Changelog',
    description: 'Neueste Features, Fixes und Breaking Changes',
    url: 'https://code.claude.com/docs/en/changelog',
  },
];

export const officialDocsCore: OfficialDocLink[] = [
  {
    title: 'CLI reference',
    description: 'Befehle, Flags, Agent-Format, System-Prompt',
    url: 'https://code.claude.com/docs/en/cli-reference',
  },
  {
    title: 'Settings',
    description: 'Konfiguration, Berechtigungen, Scopes, Plugins',
    url: 'https://code.claude.com/docs/en/settings',
  },
  {
    title: 'How Claude Code works',
    description: 'Agentic Loop, Built-in Tools',
    url: 'https://code.claude.com/docs/en/how-claude-code-works',
  },
  {
    title: 'Extend Claude Code',
    description: 'CLAUDE.md, Skills, Subagents, Hooks, MCP, Plugins',
    url: 'https://code.claude.com/docs/en/features-overview',
  },
  {
    title: 'Common workflows',
    description: 'Codebase erkunden, Bugs fixen, Refactoring, Tests',
    url: 'https://code.claude.com/docs/en/common-workflows',
  },
  {
    title: 'Best practices',
    description: 'Tipps für Konfiguration und parallele Sessions',
    url: 'https://code.claude.com/docs/en/best-practices',
  },
];

export const officialDocsExtend: OfficialDocLink[] = [
  {
    title: 'MCP (Model Context Protocol)',
    description: 'Tools verbinden – HTTP/SSE/stdio, OAuth',
    url: 'https://code.claude.com/docs/en/mcp',
  },
  {
    title: 'Skills',
    description: 'Skills erstellen, Frontmatter, Slash-Commands',
    url: 'https://code.claude.com/docs/en/skills',
  },
  {
    title: 'Subagents',
    description: 'Custom Subagents erstellen und nutzen',
    url: 'https://code.claude.com/docs/en/sub-agents',
  },
  {
    title: 'Agent teams',
    description: 'Mehrere Claude-Code-Sessions als Team koordinieren',
    url: 'https://code.claude.com/docs/en/agent-teams',
  },
  {
    title: 'Plugins',
    description: 'Plugins erstellen (Skills, Agents, Hooks, MCP)',
    url: 'https://code.claude.com/docs/en/plugins',
  },
  {
    title: 'Discover plugins',
    description: 'Plugins aus Marketplaces installieren',
    url: 'https://code.claude.com/docs/en/discover-plugins',
  },
  {
    title: 'Hooks',
    description: 'Lifecycle-Hooks, Automatisierung',
    url: 'https://code.claude.com/docs/en/hooks-guide',
  },
  {
    title: 'Fast mode',
    description: 'Schnellere Opus-4.6-Antworten',
    url: 'https://code.claude.com/docs/en/fast-mode',
  },
  {
    title: 'Checkpointing',
    description: 'Änderungen verfolgen und zurückspulen',
    url: 'https://code.claude.com/docs/en/checkpointing',
  },
];

export const officialDocsOutsideTerminal: OfficialDocLink[] = [
  { title: 'Claude Code on the web', description: 'claude.ai/code, keine lokale Installation', url: 'https://code.claude.com/docs/en/claude-code-on-the-web' },
  { title: 'Desktop app', description: 'Eigenständige App, Diffs, Cloud-Sessions', url: 'https://code.claude.com/docs/en/desktop' },
  { title: 'Chrome (Beta)', description: 'Browser-Anbindung, Web-Apps testen', url: 'https://code.claude.com/docs/en/chrome' },
  { title: 'VS Code', description: 'Extension, Inline-Diffs, Plan-Review', url: 'https://code.claude.com/docs/en/vs-code' },
  { title: 'JetBrains IDEs', description: 'IntelliJ, PyCharm, WebStorm', url: 'https://code.claude.com/docs/en/jetbrains' },
  { title: 'GitHub Actions', description: 'Claude Code in CI/CD', url: 'https://code.claude.com/docs/en/github-actions' },
  { title: 'GitLab CI/CD', description: 'GitLab-Integration', url: 'https://code.claude.com/docs/en/gitlab-ci-cd' },
  { title: 'Slack', description: 'Tasks aus Slack an Claude delegieren', url: 'https://code.claude.com/docs/en/slack' },
];

export const officialDocsIndexUrl = 'https://code.claude.com/docs/llms.txt';
