#!/bin/bash
# TMUX Auto-Setup für Claude Code Masterkurs
# Erstellt automatisch eine optimierte Session-Struktur

SESSION="claude-masterkurs"

# Check ob Session bereits existiert
tmux has-session -t $SESSION 2>/dev/null

if [ $? != 0 ]; then
  echo "🚀 Erstelle neue TMUX-Session: $SESSION"

  # Session erstellen (detached)
  tmux new-session -d -s $SESSION

  # Window 0: Discord-Integration
  tmux rename-window -t $SESSION:0 'Discord'
  tmux send-keys -t $SESSION:0 'cd ~/claude-code-masterkurs' C-m
  tmux send-keys -t $SESSION:0 'clear' C-m
  tmux send-keys -t $SESSION:0 'echo "🎯 Discord-Integration"' C-m
  tmux send-keys -t $SESSION:0 'echo "Bereit für: claude code"' C-m
  tmux send-keys -t $SESSION:0 'echo ""' C-m
  tmux send-keys -t $SESSION:0 'echo "Prompt: Lies CLAUDE.md und UMSETZUNGSPLAN-QUICK-WINS.md"' C-m
  tmux send-keys -t $SESSION:0 'echo "        Implementiere Discord-Community (Feature 1)"' C-m

  # Window 1: Founder Story
  tmux new-window -t $SESSION:1 -n 'FounderStory'
  tmux send-keys -t $SESSION:1 'cd ~/claude-code-masterkurs' C-m
  tmux send-keys -t $SESSION:1 'clear' C-m
  tmux send-keys -t $SESSION:1 'echo "🎬 Founder Story & Video"' C-m
  tmux send-keys -t $SESSION:1 'echo "Bereit für: claude code"' C-m
  tmux send-keys -t $SESSION:1 'echo ""' C-m
  tmux send-keys -t $SESSION:1 'echo "Prompt: Nutze marketing:content-creation"' C-m
  tmux send-keys -t $SESSION:1 'echo "        Erstelle Founder-Video-Script (UMSETZUNGSPLAN Feature 2)"' C-m

  # Window 2: Free Tier
  tmux new-window -t $SESSION:2 -n 'FreeTier'
  tmux send-keys -t $SESSION:2 'cd ~/claude-code-masterkurs' C-m
  tmux send-keys -t $SESSION:2 'clear' C-m
  tmux send-keys -t $SESSION:2 'echo "🎁 Free Tier Implementation"' C-m
  tmux send-keys -t $SESSION:2 'echo "Bereit für: claude code"' C-m
  tmux send-keys -t $SESSION:2 'echo ""' C-m
  tmux send-keys -t $SESSION:2 'echo "Prompt: Implementiere Free Tier"' C-m
  tmux send-keys -t $SESSION:2 'echo "        5 Lektionen kostenlos (UMSETZUNGSPLAN Feature 3)"' C-m

  # Window 3: Content-Creation
  tmux new-window -t $SESSION:3 -n 'Content'
  tmux send-keys -t $SESSION:3 'cd ~/claude-code-masterkurs' C-m
  tmux send-keys -t $SESSION:3 'clear' C-m
  tmux send-keys -t $SESSION:3 'echo "✍️  Content-Creation"' C-m
  tmux send-keys -t $SESSION:3 'echo "Bereit für: claude code"' C-m
  tmux send-keys -t $SESSION:3 'echo ""' C-m
  tmux send-keys -t $SESSION:3 'echo "Prompt: Nutze marketing:content-creation"' C-m
  tmux send-keys -t $SESSION:3 'echo "        Erstelle Blog-Posts für SEO"' C-m

  # Window 4: Testing & Monitoring
  tmux new-window -t $SESSION:4 -n 'Testing'
  tmux send-keys -t $SESSION:4 'cd ~/claude-code-masterkurs' C-m
  tmux send-keys -t $SESSION:4 'clear' C-m
  tmux send-keys -t $SESSION:4 'echo "🧪 Testing & Development Server"' C-m
  tmux send-keys -t $SESSION:4 'echo "Bereit für: npm run dev"' C-m

  # Zurück zu Window 0
  tmux select-window -t $SESSION:0

  echo "✅ Session erstellt!"
  echo ""
  echo "📋 Windows:"
  echo "   0: Discord-Integration"
  echo "   1: Founder Story"
  echo "   2: Free Tier"
  echo "   3: Content-Creation"
  echo "   4: Testing"
  echo ""
  echo "🎯 Navigation:"
  echo "   Ctrl+B → 0,1,2,3,4  (Window wechseln)"
  echo "   Ctrl+B → D          (Detach/Hintergrund)"
  echo "   tmux attach -t $SESSION  (Zurückkehren)"
  echo ""
fi

# Attach to session
echo "🔗 Verbinde mit Session: $SESSION"
tmux attach -t $SESSION
