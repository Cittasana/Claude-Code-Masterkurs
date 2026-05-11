#!/bin/bash
# Masterkurs Agent Installation Script

set -e

echo "🤖 Installing Claude Code Masterkurs Agent..."
echo ""

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code not found. Please install first:"
    echo "   curl -fsSL https://install.claude.ai | sh"
    exit 1
fi

echo "✅ Claude Code found"

# Get base directory
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "📂 Base directory: $BASE_DIR"

# Create skill symlinks
echo ""
echo "📦 Installing skills..."

CLAUDE_SKILLS_DIR="$HOME/.claude/skills"
mkdir -p "$CLAUDE_SKILLS_DIR"

for skill in masterkurs-research masterkurs-lesson-creator masterkurs-email-sequence masterkurs-social-media masterkurs-community-mod; do
    SOURCE="$BASE_DIR/skills/$skill"
    TARGET="$CLAUDE_SKILLS_DIR/$skill"
    
    if [ -L "$TARGET" ]; then
        echo "   ⚠️  $skill already symlinked, skipping"
    elif [ -d "$TARGET" ]; then
        echo "   ⚠️  $skill exists, skipping"
    else
        ln -s "$SOURCE" "$TARGET"
        echo "   ✅ $skill installed"
    fi
done

# Create output directories
echo ""
echo "📁 Creating output directories..."
mkdir -p "$BASE_DIR/research"
mkdir -p "$BASE_DIR/lessons"
mkdir -p "$BASE_DIR/email-campaigns"
mkdir -p "$BASE_DIR/social-media"
mkdir -p "$BASE_DIR/community"
mkdir -p "$BASE_DIR/logs"
echo "   ✅ Directories created"

# Check MCPs
echo ""
echo "🔌 Checking MCP connections..."

if claude code list-mcps 2>/dev/null | grep -q "exa"; then
    echo "   ✅ Exa MCP connected"
else
    echo "   ⚠️  Exa MCP not found"
    echo "   Install with: claude code install exa-mcp"
fi

if claude code list-mcps 2>/dev/null | grep -q "slack"; then
    echo "   ✅ Slack MCP connected"
else
    echo "   ℹ️  Slack MCP not connected (optional)"
fi

# Print summary
echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Create shortcut: /shortcut create masterkurs-weekly-agent"
echo "   2. Set cron: 0 9 * * 1 (Monday 09:00)"
echo "   3. Manual test: claude code run masterkurs-weekly-agent"
echo ""
echo "📚 Documentation: $BASE_DIR/README.md"
echo ""
