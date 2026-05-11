# 🚀 Quick Start Guide - Masterkurs Agent

**Zeitaufwand**: 5-10 Minuten

Dieser Guide hilft dir, den Masterkurs Agent in unter 10 Minuten einsatzbereit zu machen.

---

## Schritt 1: Prerequisites (1 Min) ✅

**Benötigt**:
- ✅ Claude Code installiert ([Download](https://claude.ai/download))
- ✅ Exa MCP installiert (für Research)

**Check**:
```bash
# Claude Code installiert?
claude --version

# Exa MCP installiert?
claude mcp list | grep exa
```

**Falls Exa fehlt**:
```bash
claude mcp install exa
```

---

## Schritt 2: Installation (2 Min) 🔧

### Option A: Automatisch (Empfohlen)

```bash
cd /pfad/zu/masterkurs-agent/
./scripts/setup.sh
```

Das Setup-Script:
- ✅ Installiert alle 5 Skills
- ✅ Erstellt `.env`-Template
- ✅ Validiert Installation

### Option B: Manuell

```bash
# Skills installieren
ln -s "$(pwd)/skills/masterkurs-research" "$HOME/.claude/skills/"
ln -s "$(pwd)/skills/masterkurs-lesson-creator" "$HOME/.claude/skills/"
ln -s "$(pwd)/skills/masterkurs-email-sequence" "$HOME/.claude/skills/"
ln -s "$(pwd)/skills/masterkurs-social-media" "$HOME/.claude/skills/"
ln -s "$(pwd)/skills/masterkurs-community-mod" "$HOME/.claude/skills/"

# Directories erstellen
mkdir -p research lessons email-campaigns social-media community logs
```

---

## Schritt 3: Konfiguration (3 Min) ⚙️

### API-Keys eintragen

Öffne `.env` und fülle aus:

```bash
# MINIMAL-KONFIGURATION (nur Research)
EXA_API_KEY=exa_xxx           # Von https://exa.ai
ANTHROPIC_API_KEY=sk-ant-xxx  # Falls direkt genutzt

# OPTIONAL (für Integrationen)
NOTION_API_KEY=secret_xxx
CONVERTKIT_API_KEY=ck_xxx
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx
```

**Wo bekomme ich die Keys?**
- **Exa**: [exa.ai](https://exa.ai) → Sign up → API Key
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com)
- **Notion**: [notion.so/my-integrations](https://notion.so/my-integrations)
- **ConvertKit**: Settings → Advanced → API Key
- **Discord**: Server Settings → Integrations → Webhooks

---

## Schritt 4: Validation (1 Min) ✔️

```bash
./scripts/test-agent.sh
```

**Expected**: Alle Tests ✅ PASS

---

## Schritt 5: Ersten Run (2 Min) 🎯

### Manual-Test

In Claude Code:
```
Nutze masterkurs-research:
Recherchiere Claude Code Updates der letzten 3 Tage
```

**Expected**: Research-Report in `./research/`

### Automatic (Weekly)

```bash
# In Claude Code
/shortcut create masterkurs-weekly-agent
```

Cron: `0 9 * * 1` (Montag 09:00)

---

## Quick Commands 📝

```bash
./scripts/setup.sh                    # Setup
./scripts/test-agent.sh               # Test
node scripts/sync-to-notion.js        # Notion-Sync
node scripts/discord-auto-post.js     # Discord-Post
claude code run masterkurs-weekly-agent  # Manual-Run
```

---

## Troubleshooting 🔧

### "Skills not found"
```bash
ls -la ~/.claude/skills/ | grep masterkurs
# Falls leer → ./scripts/setup.sh
```

### "Exa API error"
```bash
# Check
grep "EXA_API_KEY" .env

# Fallback zu WebSearch aktivieren
# Siehe README.md
```

### "Research findet nichts"
```bash
ping anthropic.com  # Internet OK?
claude mcp list | grep exa  # Exa installiert?
```

---

## Support 💬

1. **Logs**: `cat logs/latest-agent-run.md`
2. **README**: Comprehensive Guide (1500+ Zeilen)
3. **Email**: office@cittasana.de

---

✅ **Setup Complete! Agent läuft automatisch.** 🎉
