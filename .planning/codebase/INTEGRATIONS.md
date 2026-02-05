# External Integrations

**Analysis Date:** 2026-02-05

## APIs & External Services

**No Active External API Integrations**

This is a standalone frontend SPA with no configured external API calls, REST endpoints, or third-party services.

## Data Storage

**Databases:**
- None - No backend database

**File Storage:**
- None - No external file storage

**Caching:**
- LocalStorage (Browser) - User progress stored via Zustand persist middleware
  - Key: `claude-code-masterkurs-progress`
  - Data: Lesson completion, quiz results, skill progress, points, streaks, time invested

## Authentication & Identity

**Auth Provider:**
- None - No authentication system

**OAuth Integrations:**
- None

## Monitoring & Observability

**Error Tracking:**
- None - Client-side ErrorBoundary only (`src/ErrorBoundary.tsx`)

**Analytics:**
- None

**Logs:**
- Console only (browser console)

## CI/CD & Deployment

**Hosting:**
- Not configured (static files, any static host compatible)

**CI Pipeline:**
- Not configured

## Environment Configuration

**Development:**
- No environment variables required
- All configuration in source files
- Run: `npm run dev`

**Production:**
- Static build: `npm run build`
- Output: `dist/` directory
- Preview: `npm run preview`

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Educational Content References

The following integrations are **mentioned in lesson content** (`src/data/lessons.ts`) as educational material, not implemented:

**MCP (Model Context Protocol) Integrations:**
- GitHub MCP
- PostgreSQL MCP
- Filesystem MCP
- Slack MCP
- Figma MCP
- Sentry MCP
- Linear MCP
- Notion MCP
- Puppeteer MCP
- Memory MCP

These are code examples teaching users about Claude Code integrations.

---

*Integration audit: 2026-02-05*
*Update when adding/removing external services*
