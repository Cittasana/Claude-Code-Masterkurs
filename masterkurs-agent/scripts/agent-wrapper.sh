#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Agent Wrapper Script
# Wraps the Claude Code agent run with API reporting
# Usage: ./agent-wrapper.sh [runId]
# ─────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$AGENT_DIR/logs"
mkdir -p "$LOG_DIR"

# Configuration
API_BASE="${AGENT_API_BASE:-http://localhost:3000}"
API_KEY="${AGENT_API_KEY:-mk-agent-2026-a7f3c9e1b4d8}"
TRIGGER="${AGENT_TRIGGER:-cron}"
RUN_ID="${1:-${AGENT_RUN_ID:-}}"

LOG_FILE="$LOG_DIR/agent-run-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "=== Agent Wrapper gestartet: $(date) ==="
echo "Trigger: $TRIGGER"
echo "API Base: $API_BASE"

# ── Helper: POST to API ──────────────────────────────────────
report() {
  local payload="$1"
  curl -s -X POST \
    "$API_BASE/api/admin/agent/report" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "$payload" 2>/dev/null || echo '{"error":"API nicht erreichbar"}'
}

# ── Step 1: Register run (if no runId provided) ─────────────
if [ -z "$RUN_ID" ]; then
  echo "Registriere neuen Agent Run..."
  RESPONSE=$(report "{\"status\":\"running\",\"trigger\":\"$TRIGGER\"}")
  RUN_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('data',{}).get('id',''))" 2>/dev/null || echo "")

  if [ -z "$RUN_ID" ]; then
    echo "WARNUNG: Konnte Run nicht registrieren. Fahre trotzdem fort."
    echo "API Response: $RESPONSE"
  else
    echo "Run registriert: $RUN_ID"
  fi
else
  echo "Verwende existierende Run-ID: $RUN_ID"
fi

# ── Step 2: Run the agent ────────────────────────────────────
echo "=== Agent wird gestartet ==="
START_TIME=$(date +%s)
AGENT_EXIT_CODE=0
AGENT_OUTPUT=""

AGENT_OUTPUT=$(cd "$AGENT_DIR" && timeout 600 /Users/cosmograef/.local/bin/claude \
  -p "Führe /masterkurs-weekly-agent aus. Arbeite vollautomatisch, erstelle Research-Report und Content." \
  --allowedTools "Edit,Write,Bash,Read,Glob,Grep,WebSearch,WebFetch,Task" \
  --output-format text \
  --max-turns 15 2>&1) || AGENT_EXIT_CODE=$?

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "=== Agent beendet (Exit: $AGENT_EXIT_CODE, Dauer: ${DURATION}s) ==="

# ── Step 3: Parse output for metrics ────────────────────────
QUALITY_SCORE=0
SOURCES_TOTAL=0
SOURCES_T1=0
SOURCES_T2=0
SOURCES_T3=0
LESSONS=0
EMAILS=0
SOCIAL=0
TOPICS="[]"
SUMMARY=""

# Extract quality score (look for patterns like "Quality Score: 85" or "Qualität: 8.5/10")
if echo "$AGENT_OUTPUT" | grep -qiE '(quality|qualit).*(score|wert).*[0-9]'; then
  QUALITY_SCORE=$(echo "$AGENT_OUTPUT" | grep -oiE '(quality|qualit).*(score|wert)[^0-9]*([0-9]+\.?[0-9]*)' | grep -oE '[0-9]+\.?[0-9]*' | tail -1 || echo "0")
fi

# Count sources by tier
SOURCES_T1=$(echo "$AGENT_OUTPUT" | grep -ciE 'tier.?1|official|docs\.anthropic|docs\.microsoft' || echo "0")
SOURCES_T2=$(echo "$AGENT_OUTPUT" | grep -ciE 'tier.?2|github\.com|stackoverflow' || echo "0")
SOURCES_T3=$(echo "$AGENT_OUTPUT" | grep -ciE 'tier.?3|blog|medium|dev\.to' || echo "0")
SOURCES_TOTAL=$((SOURCES_T1 + SOURCES_T2 + SOURCES_T3))

# Count created content
LESSONS=$(echo "$AGENT_OUTPUT" | grep -ciE '(lektion|lesson).*(erstellt|created|geschrieben)' || echo "0")
EMAILS=$(echo "$AGENT_OUTPUT" | grep -ciE '(email|newsletter).*(erstellt|created|geschrieben)' || echo "0")
SOCIAL=$(echo "$AGENT_OUTPUT" | grep -ciE '(social|post|tweet).*(erstellt|created|geschrieben)' || echo "0")

# Extract topics (look for research topics)
TOPICS_RAW=$(echo "$AGENT_OUTPUT" | grep -oiE '(topic|thema|recherche)[^:]*:\s*(.+)' | head -5 | sed 's/.*:\s*//' || echo "")
if [ -n "$TOPICS_RAW" ]; then
  TOPICS=$(echo "$TOPICS_RAW" | python3 -c "
import sys, json
topics = [line.strip() for line in sys.stdin if line.strip()]
print(json.dumps(topics[:10]))
" 2>/dev/null || echo "[]")
fi

# Generate summary (first 500 chars of meaningful output)
SUMMARY=$(echo "$AGENT_OUTPUT" | head -50 | tr '\n' ' ' | cut -c1-2000 || echo "Agent-Run abgeschlossen")

# ── Step 4: Report results ──────────────────────────────────
if [ -n "$RUN_ID" ]; then
  if [ "$AGENT_EXIT_CODE" -eq 0 ]; then
    STATUS="completed"
    ERROR_LOG=""
  else
    STATUS="failed"
    ERROR_LOG=$(echo "$AGENT_OUTPUT" | tail -100 | tr '\n' ' ' | cut -c1-5000)
  fi

  # Escape JSON strings
  SUMMARY_ESCAPED=$(echo "$SUMMARY" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().strip()))" 2>/dev/null || echo '""')
  ERROR_ESCAPED=$(echo "$ERROR_LOG" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().strip()))" 2>/dev/null || echo '""')
  RAW_ESCAPED=$(echo "$AGENT_OUTPUT" | tail -500 | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().strip()))" 2>/dev/null || echo '""')

  PAYLOAD=$(cat <<ENDJSON
{
  "runId": "$RUN_ID",
  "status": "$STATUS",
  "qualityScore": $QUALITY_SCORE,
  "sourcesTotal": $SOURCES_TOTAL,
  "sourcesTier1": $SOURCES_T1,
  "sourcesTier2": $SOURCES_T2,
  "sourcesTier3": $SOURCES_T3,
  "lessonsCreated": $LESSONS,
  "emailsCreated": $EMAILS,
  "socialPostsCreated": $SOCIAL,
  "researchTopics": $TOPICS,
  "summary": $SUMMARY_ESCAPED,
  "errorLog": $ERROR_ESCAPED,
  "rawOutput": $RAW_ESCAPED
}
ENDJSON
  )

  echo "=== Sende Report an API ==="
  REPORT_RESPONSE=$(report "$PAYLOAD")
  echo "API Response: $REPORT_RESPONSE"
fi

echo "=== Agent Wrapper beendet: $(date) ==="
exit $AGENT_EXIT_CODE
