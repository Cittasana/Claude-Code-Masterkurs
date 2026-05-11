#!/bin/bash
# Masterkurs Agent - Test Script
# Tests all skills and validates setup

set -e

echo "🧪 Masterkurs Agent - Test Suite"
echo "================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"

    echo -n "Testing: $test_name... "

    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "📋 Phase 1: Prerequisites"
echo "-------------------------"

run_test "Claude Code installed" "command -v claude"
run_test "Skills directory exists" "test -d $HOME/.claude/skills"
run_test ".env file exists" "test -f .env"

echo ""
echo "🔌 Phase 2: Skills Installed"
echo "----------------------------"

run_test "masterkurs-research skill" "test -d $HOME/.claude/skills/masterkurs-research"
run_test "masterkurs-lesson-creator skill" "test -d $HOME/.claude/skills/masterkurs-lesson-creator"
run_test "masterkurs-email-sequence skill" "test -d $HOME/.claude/skills/masterkurs-email-sequence"
run_test "masterkurs-social-media skill" "test -d $HOME/.claude/skills/masterkurs-social-media"
run_test "masterkurs-community-mod skill" "test -d $HOME/.claude/skills/masterkurs-community-mod"

echo ""
echo "📁 Phase 3: Directory Structure"
echo "-------------------------------"

mkdir -p research lessons email-campaigns social-media community logs

run_test "research/ directory" "test -d research"
run_test "lessons/ directory" "test -d lessons"
run_test "email-campaigns/ directory" "test -d email-campaigns"
run_test "social-media/ directory" "test -d social-media"
run_test "community/ directory" "test -d community"
run_test "logs/ directory" "test -d logs"

echo ""
echo "📄 Phase 4: Skill Files"
echo "----------------------"

run_test "research SKILL.md" "test -f $HOME/.claude/skills/masterkurs-research/SKILL.md"
run_test "lesson-creator SKILL.md" "test -f $HOME/.claude/skills/masterkurs-lesson-creator/SKILL.md"
run_test "email-sequence SKILL.md" "test -f $HOME/.claude/skills/masterkurs-email-sequence/SKILL.md"
run_test "social-media SKILL.md" "test -f $HOME/.claude/skills/masterkurs-social-media/SKILL.md"
run_test "community-mod SKILL.md" "test -f $HOME/.claude/skills/masterkurs-community-mod/SKILL.md"

echo ""
echo "⚙️  Phase 5: Configuration"
echo "-------------------------"

if [ -f .env ]; then
    # Check if API keys are set (not empty)
    if grep -q "EXA_API_KEY=exa_" .env 2>/dev/null; then
        echo -e "Exa API Key... ${GREEN}✅ PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "Exa API Key... ${YELLOW}⚠️  NOT SET${NC}"
        echo "  → Fülle EXA_API_KEY in .env aus"
    fi

    if grep -q "AGENT_AUTONOMY_LEVEL=" .env; then
        echo -e "Agent autonomy config... ${GREEN}✅ PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "Agent autonomy config... ${RED}❌ FAIL${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${RED}❌ .env file not found${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "🎯 Phase 6: Integration Points"
echo "------------------------------"

# Check if CLAUDE.md exists (project memory)
if [ -f "../CLAUDE.md" ]; then
    echo -e "CLAUDE.md (project memory)... ${GREEN}✅ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "CLAUDE.md... ${YELLOW}⚠️  NOT FOUND${NC}"
    echo "  → Empfohlen für bessere Agent-Performance"
fi

# Check README
if [ -f "README.md" ]; then
    if [ $(wc -l < README.md) -gt 100 ]; then
        echo -e "README.md (comprehensive)... ${GREEN}✅ PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "README.md... ${YELLOW}⚠️  TOO SHORT${NC}"
    fi
else
    echo -e "README.md... ${RED}❌ NOT FOUND${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "📊 Test Results"
echo "==============="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"

if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $TESTS_FAILED${NC}"
    echo ""
    echo "❌ Some tests failed. Review setup and re-run."
    exit 1
else
    echo -e "${GREEN}Failed: 0${NC}"
    echo ""
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    echo "🎉 Agent is ready to use!"
    echo ""
    echo "Next steps:"
    echo "  1. Fill API keys in .env"
    echo "  2. Create weekly shortcut"
    echo "  3. Run: claude code run masterkurs-weekly-agent"
    echo ""
    exit 0
fi
