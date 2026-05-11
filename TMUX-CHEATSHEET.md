# 🎯 TMUX Cheatsheet - Quick Reference

**Prefix**: `Ctrl+B` (Standard) oder `Ctrl+A` (mit Config)

---

## 🔧 Sessions

| Aktion | Befehl |
|--------|--------|
| Neue Session | `tmux new -s name` |
| Session auflisten | `tmux ls` |
| Zu Session verbinden | `tmux attach -t name` |
| Session detachen | `Ctrl+B → D` |
| Session killen | `tmux kill-session -t name` |
| Session umbenennen | `Ctrl+B → $` |

---

## 📂 Windows (Tabs)

| Aktion | Befehl |
|--------|--------|
| Neues Window | `Ctrl+B → C` |
| Nächstes Window | `Ctrl+B → N` |
| Vorheriges Window | `Ctrl+B → P` |
| Window auswählen | `Ctrl+B → 0-9` |
| Window umbenennen | `Ctrl+B → ,` |
| Window schließen | `Ctrl+B → &` |
| Window-Liste | `Ctrl+B → W` |

---

## ⬛ Panes (Split-Screen)

| Aktion | Befehl |
|--------|--------|
| Horizontal split | `Ctrl+B → "` |
| Vertikal split | `Ctrl+B → %` |
| Pane wechseln | `Ctrl+B → Pfeiltasten` |
| Nächster Pane | `Ctrl+B → O` |
| Pane schließen | `Ctrl+B → X` |
| Pane vergrößern | `Ctrl+B → Z` (toggle) |
| Panes neu ordnen | `Ctrl+B → Space` |

---

## ⌨️  Mit Custom Config (~/.tmux.conf)

| Aktion | Befehl |
|--------|--------|
| Prefix ändern | `Ctrl+A` statt `Ctrl+B` |
| Vertikal split | `Ctrl+A → \|` |
| Horizontal split | `Ctrl+A → -` |
| Pane links | `Ctrl+A → H` |
| Pane unten | `Ctrl+A → J` |
| Pane oben | `Ctrl+A → K` |
| Pane rechts | `Ctrl+A → L` |
| Config reload | `Ctrl+A → R` |

---

## 📋 Copy Mode (Scrollen & Kopieren)

| Aktion | Befehl |
|--------|--------|
| Copy Mode starten | `Ctrl+B → [` |
| Navigieren | `Pfeiltasten` oder `Vim: h,j,k,l` |
| Suchen | `/` (vorwärts) oder `?` (rückwärts) |
| Selection starten | `Space` oder `V` (Vim-Mode) |
| Kopieren | `Enter` oder `Y` (Vim-Mode) |
| Einfügen | `Ctrl+B → ]` |
| Copy Mode beenden | `Q` oder `Esc` |

---

## 🚀 Claude Code Masterkurs - Spezial-Workflows

### Quick-Start Script
```bash
./tmux-setup.sh
```
**→ Erstellt 5 Windows (Discord, Founder, FreeTier, Content, Testing)**

### Parallel Development
```bash
# Session 1: Feature A
tmux new -s discord
claude code
# Ctrl+B → D (detach)

# Session 2: Feature B
tmux new -s content
claude code
```

### Split-Screen (Code + Docs)
```bash
# Vertikal splitten
Ctrl+B → %

# Links: Claude Code
claude code

# Rechts: Docs
less TECH-SPECS-COMMUNITY.md
```

---

## 💡 Pro-Tipps

### Sessions speichern (mit Resurrect Plugin)
```bash
# Speichern
Ctrl+B → Ctrl+S

# Wiederherstellen
Ctrl+B → Ctrl+R
```

### Fuzzy-Finder für Sessions
```bash
# In .bashrc oder .zshrc:
alias ts='tmux attach -t $(tmux ls | fzf | cut -d: -f1)'

# Nutzen:
ts
```

### Mouse-Support aktivieren
```bash
# In ~/.tmux.conf:
set -g mouse on

# Dann: Scrollen mit Maus-Rad
# Panes resizen mit Maus
```

---

## 🆘 Hilfe & Troubleshooting

| Problem | Lösung |
|---------|--------|
| **Hängt fest** | `Ctrl+B → :kill-session` |
| **Falsche Keys** | Check Prefix: `Ctrl+B → ?` (zeigt Bindings) |
| **Config lädt nicht** | `tmux source-file ~/.tmux.conf` |
| **Session nicht gefunden** | `tmux ls` (check Name) |
| **Colors falsch** | `set -g default-terminal "screen-256color"` |

---

## 📚 Weitere Infos

- **Vollständiger Guide**: `TMUX-WORKFLOW-GUIDE.md`
- **Setup-Script**: `./tmux-setup.sh`
- **Online Cheatsheet**: https://tmuxcheatsheet.com/

---

**Druck mich aus und kleb mich an deinen Monitor! 📌**
