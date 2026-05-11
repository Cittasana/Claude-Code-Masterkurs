# 🛠️ Claude Code Tools & Extensions - Kompletter Überblick

**Zweck**: Übersicht aller empfohlenen Tools und Extensions für Claude Code Development
**Stand**: Februar 2026
**Kategorisiert nach**: Schwierigkeitsgrad und Einsatzzweck

---

## 📖 Wie du diese Sektion nutzt

Jedes Tool hat seine eigene Lektion-Seite mit:
- ✅ **Berechtigung**: Warum du dieses Tool brauchst
- 🎯 **Zwecke**: Wofür du es einsetzt
- 💻 **Verwendung**: Wie du es benutzt
- 🏆 **Best Practices**: Profi-Tipps
- 📝 **Beispiele**: Reale Use-Cases
- 🔗 **Weiterführende Links**: Offizielle Docs

---

## 🟢 Anfänger-Tools
*Einfache Installation, sofort nutzbar, intuitive Bedienung*

| Nr. | Tool | Kurzbeschreibung | Kategorie |
|-----|------|------------------|-----------|
| 01 | **[bat](./tools/01-bat.md)** | cat mit Syntax Highlighting | File Viewing |
| 02 | **[eza](./tools/02-eza.md)** | Modernes ls mit Icons | Directory Listing |
| 03 | **[tree](./tools/03-tree.md)** | Verzeichnisbaum-Visualisierung | Project Structure |
| 04 | **[glow](./tools/04-glow.md)** | Markdown im Terminal rendern | Documentation |
| 05 | **[tldr](./tools/05-tldr.md)** | Vereinfachte Man Pages | Quick Help |
| 06 | **[httpie](./tools/06-httpie.md)** | User-Friendly HTTP Client | API Testing |
| 07 | **[jq](./tools/07-jq.md)** | JSON Processor | Data Processing |
| 08 | **[gh](./tools/08-gh.md)** | GitHub CLI | Git Workflow |

**Empfehlung**: Starte mit diesen 8 Tools! Installation dauert 5 Minuten, Produktivität steigt sofort.

---

## 🟡 Fortgeschrittene Tools
*Benötigen Konfiguration und etwas Einarbeitung*

### Terminal Enhancement
| Nr. | Tool | Kurzbeschreibung |
|-----|------|------------------|
| 09 | **[tmux](./tools/09-tmux.md)** | Terminal Multiplexer - Sessions verwalten |
| 10 | **[zsh + oh-my-zsh](./tools/10-zsh.md)** | Erweiterte Shell mit Plugins |
| 11 | **[starship](./tools/11-starship.md)** | Cross-Shell Prompt mit Git Info |

### Search & Navigation
| Nr. | Tool | Kurzbeschreibung |
|-----|------|------------------|
| 12 | **[fzf](./tools/12-fzf.md)** | Fuzzy Finder - Interaktive Suche |
| 13 | **[ripgrep](./tools/13-ripgrep.md)** | Ultra-schnelle Code-Suche (10-100x schneller als grep) |
| 14 | **[fd](./tools/14-fd.md)** | Besseres find - Files & Directories finden |

### Git Workflow
| Nr. | Tool | Kurzbeschreibung |
|-----|------|------------------|
| 15 | **[lazygit](./tools/15-lazygit.md)** | Git Terminal UI - Keine Commands merken |
| 16 | **[delta](./tools/16-delta.md)** | Syntax-highlighted Git Diffs |
| 17 | **[tig](./tools/17-tig.md)** | Text-Mode Git Interface |
| 18 | **[GSD (Git Status Dashboard)](./tools/18-gsd-dashboard.md)** | Multi-Repo Git Status Überblick |

### Data Processing
| Nr. | Tool | Kurzbeschreibung |
|-----|------|------------------|
| 19 | **[yq](./tools/19-yq.md)** | YAML/XML Processor (wie jq für YAML) |

### Development Automation
| Nr. | Tool | Kurzbeschreibung |
|-----|------|------------------|
| 20 | **[entr](./tools/20-entr.md)** | File Watcher - Auto-Reload |
| 21 | **[prettier](./tools/21-prettier.md)** | Code Formatter (JS/TS/CSS/HTML/JSON) |
| 22 | **[eslint](./tools/22-eslint.md)** | JavaScript Linter |
| 23 | **[ruff](./tools/23-ruff.md)** | Ultra-Fast Python Linter (10-100x schneller) |
| 24 | **[hadolint](./tools/24-hadolint.md)** | Dockerfile Linter - Best Practices |

### System Monitoring
| Nr. | Tool | Kurzbeschreibung |
|-----|------|------------------|
| 25 | **[htop/btop](./tools/25-htop.md)** | System Monitor - CPU/RAM/Processes |
| 26 | **[ncdu](./tools/26-ncdu.md)** | Disk Usage Analyzer - Speicherplatz-Fresser finden |

### Performance & Productivity
| Nr. | Tool | Kurzbeschreibung |
|-----|------|------------------|
| 27 | **[hyperfine](./tools/27-hyperfine.md)** | Command Benchmarking Tool |
| 28 | **[pet](./tools/28-pet.md)** | Snippet Manager - Commands speichern |

---

## 🔴 Experten-Tools
*Komplexe Konfiguration, benötigen tiefes Verständnis*

| Nr. | Tool | Kurzbeschreibung | Warum Expert? |
|-----|------|------------------|---------------|
| 29 | **[GSD (Get Shit Done)](./tools/29-gsd.md)** | 🔥 Meta-Prompting System für Claude Code | Context Engineering, Subagent Orchestration |
| 30 | **[zellij](./tools/30-zellij.md)** | Moderne tmux Alternative mit Layouts | Komplexe Terminal-Workflows |
| 31 | **[screen](./tools/31-screen.md)** | Klassischer Terminal Multiplexer | Legacy-Systeme, wenn tmux nicht verfügbar |
| 32 | **[fish](./tools/32-fish.md)** | Freundliche Interactive Shell | Andere Philosophie als bash/zsh |
| 33 | **[ranger](./tools/33-ranger.md)** | Terminal File Manager mit Vim-Bindings | Vim-Kenntnisse erforderlich |
| 34 | **[nnn](./tools/34-nnn.md)** | Schnellster Terminal File Manager | Minimalistisch, steile Lernkurve |
| 35 | **[bandwhich](./tools/35-bandwhich.md)** | Network Bandwidth Monitor pro Process | Network Debugging |

---

## 🔌 MCP Servers für Claude Code
*Model Context Protocol - Claude Code Extensions*

**Was sind MCP Servers?**
MCP (Model Context Protocol) ermöglicht Claude Code, mit externen Services zu interagieren. Jeder MCP Server gibt Claude neue Fähigkeiten.

| Nr. | MCP Server | Zweck | Kategorie |
|-----|------------|-------|-----------|
| 36 | **[filesystem](./tools/36-mcp-filesystem.md)** | File System Operations | Core |
| 37 | **[git](./tools/37-mcp-git.md)** | Git Commands via MCP | Version Control |
| 38 | **[brave-search](./tools/38-mcp-brave-search.md)** | Web Search Integration | Research |
| 39 | **[postgres](./tools/39-mcp-postgres.md)** | PostgreSQL Database Access | Database |
| 40 | **[sqlite](./tools/40-mcp-sqlite.md)** | SQLite Database Operations | Database |
| 41 | **[github](./tools/41-mcp-github.md)** | GitHub API Access (Issues, PRs, Repos) | Git Workflow |
| 42 | **[puppeteer](./tools/42-mcp-puppeteer.md)** | Browser Automation | Testing |
| 43 | **[slack](./tools/43-mcp-slack.md)** | Slack Integration (Messages senden/empfangen) | Communication |

**MCP Installation**:
```bash
npx @modelcontextprotocol/create-server <server-name>
```

**Mehr MCP Servers**: [50+ Best MCP Servers for Claude Code](https://claudefa.st/blog/tools/mcp-extensions/best-addons)

---

## 🚀 Empfohlener Einstieg

### Level 1: Die ersten 30 Minuten
```bash
# macOS
brew install bat eza tree glow tldr httpie jq gh

# Ubuntu/Debian
sudo apt install bat exa tree glow tldr httpie jq gh
```

**Sofort testen**:
```bash
bat README.md          # Syntax-highlighted File anzeigen
eza -la --icons        # Directory mit Icons
tree -L 2              # Projekt-Struktur
tldr git               # Schnelle Git-Hilfe
```

---

### Level 2: Produktivitäts-Boost (2-3 Stunden Setup)
```bash
# macOS
brew install tmux fzf ripgrep fd lazygit

# Ubuntu/Debian
sudo apt install tmux fzf ripgrep fd-find lazygit
```

**Game Changers**:
- `fzf` + `ripgrep` = Codebase durchsuchen in Sekunden
- `lazygit` = Nie wieder Git Commands merken
- `tmux` = Parallel an 10 Projekten arbeiten

---

### Level 3: Expert Setup (1 Tag Konfiguration)
```bash
# GSD (Get Shit Done) für Claude Code
npx get-shit-done-cc --claude --global

# zsh + oh-my-zsh + starship
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
brew install starship
```

---

## 🎯 Use-Case basierte Tool-Auswahl

### "Ich will schneller coden"
→ **bat**, **eza**, **fzf**, **ripgrep**, **GSD**

### "Ich will besser Git nutzen"
→ **gh**, **lazygit**, **delta**, **tig**, **GSD Dashboard**

### "Ich arbeite an vielen Projekten gleichzeitig"
→ **tmux**, **zellij**, **GSD (Get Shit Done)**

### "Ich will APIs testen"
→ **httpie**, **jq**, **MCP puppeteer**

### "Ich will Code-Quality verbessern"
→ **prettier**, **eslint**, **ruff**, **hadolint**

### "Ich will System-Performance verstehen"
→ **htop/btop**, **ncdu**, **hyperfine**, **bandwhich**

---

## 📊 Tool-Kombination Matrix

| Workflow | Tools | Warum? |
|----------|-------|--------|
| **Fast Codebase Search** | `ripgrep` + `fzf` + `bat` | rg findet, fzf filtert, bat zeigt Preview |
| **Git Workflow** | `gh` + `lazygit` + `delta` | CLI für PRs, UI für Commits, Diffs visualisiert |
| **Claude Code Workflow** | `GSD` + `tmux` + `gh` | GSD orchestriert, tmux managed Sessions, gh connected zu GitHub |
| **API Development** | `httpie` + `jq` + `entr` | HTTP Requests, JSON parsing, Auto-reload |
| **Docker Workflow** | `hadolint` + `lazygit` + `gh` | Dockerfile linting, Git UI, PR creation |

---

## 🔥 Das Special: GSD (Get Shit Done)

**Status**: 🚀 Viral im Januar 2026, Game-Changer für Claude Code

**Was macht es besonders?**
- Meta-Prompting System - Claude erstellt bessere Prompts
- Context Engineering - Verhindert "Context Rot"
- Subagent Orchestration - Parallelisiert Tasks
- Spec-Driven Development - Strukturierter Workflow

**Warum NICHT in der anderen Kategorie?**
GSD ist kein normales Terminal-Tool, sondern ein komplettes Framework, das speziell für Claude Code gebaut wurde.

**Lektion**: [GSD - Get Shit Done (Detailliert)](./tools/29-gsd.md)

---

## 🧪 Beta & Experimental (Optional)

Tools, die noch in Entwicklung sind, aber vielversprechend:

- **claude-mem**: Automatische Session Memory (GitHub: thedotmack/claude-mem)
- **claudekit**: Guardrails & Checkpoints für Claude Code
- **claude-flow**: ruflo Commands via MCP

---

## 📚 Weiterführende Ressourcen

### Offizielle Quellen
- [Claude Code Docs](https://code.claude.com/docs) - Offizielle Dokumentation
- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) - Kuratierte Liste
- [Claude Marketplaces](https://claudemarketplaces.com/) - Plugin Marketplace

### Community
- [Claude Code Discord](https://discord.gg/claude-code) - Community Support
- [r/ClaudeCode](https://reddit.com/r/ClaudeCode) - Reddit Community

### Artikel & Tutorials
- [CLI++ Guide](https://www.kdab.com/cli-upgrade-your-command-line-with-a-new-generation-of-everyday-tools/) - Modern CLI Tools
- [Best Terminal Tools 2024/2025](https://debugg.ai/resources/best-terminal-tools-developers-2024)
- [7 Amazing CLI Tools](https://www.josean.com/posts/7-amazing-cli-tools)
- [GSD in Action](https://medium.com/@joe.njenga/i-tested-gsd-claude-code-meta-prompting-that-ships-faster-no-agile-bs-ca62aff18c04)
- [Beating Context Rot with GSD](https://thenewstack.io/beating-the-rot-and-getting-stuff-done/)

---

## ⚙️ Quick Install Scripts

### All-in-One Script (macOS)
```bash
# Anfänger-Tools (5 Min)
brew install bat eza tree glow tldr httpie jq gh

# Fortgeschrittene Tools (10 Min)
brew install tmux fzf ripgrep fd lazygit git-delta tig yq entr prettier \
             eslint ruff hadolint htop ncdu hyperfine pet

# Experten-Tools (15 Min)
brew install zellij screen fish ranger nnn bandwhich

# GSD (Get Shit Done)
npx get-shit-done-cc --claude --global
```

### All-in-One Script (Ubuntu/Debian)
```bash
# Anfänger-Tools
sudo apt install bat exa tree glow tldr httpie jq gh

# Fortgeschrittene Tools
sudo apt install tmux fzf ripgrep fd-find lazygit git-delta tig \
                 entr htop ncdu hyperfine

# Python/Node Tools
pip install ruff
npm install -g prettier eslint

# GSD
npx get-shit-done-cc --claude --global
```

---

## 🎓 Lernpfad

### Woche 1: Basics
- **Tag 1-2**: Anfänger-Tools (bat, eza, tree, glow, tldr)
- **Tag 3-4**: API & Data Tools (httpie, jq, gh)
- **Tag 5**: Erste Workflows kombinieren

### Woche 2: Produktivität
- **Tag 1-2**: tmux & Terminal Management
- **Tag 3-4**: fzf + ripgrep (Search Workflow)
- **Tag 5**: lazygit & Git Workflow

### Woche 3: Advanced
- **Tag 1-2**: zsh + oh-my-zsh + starship (Shell pimpen)
- **Tag 3-4**: Code Quality Tools (prettier, eslint, ruff)
- **Tag 5**: System Monitoring (htop, ncdu)

### Woche 4: Expert
- **Tag 1-3**: GSD (Get Shit Done) - Deep Dive
- **Tag 4-5**: MCP Servers integrieren

---

## 💬 Feedback & Support

Hast du Fragen zu einem Tool? Nutze:
- **Discord-Community**: [Join Claude Code Discord](#)
- **Email**: office@cittasana.de
- **GitHub Issues**: Für Bug-Reports & Feature-Requests

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0

**Next Steps**: Wähle ein Tool aus der Liste und starte mit der Lektion! 🚀
