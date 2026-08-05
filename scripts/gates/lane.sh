#!/bin/bash
# scripts/gates/lane.sh - gemene lane-runner voor async verificatie
# Gebruik: lane.sh <run-id> <lane-naam> <command...>
# Schrijft status + uitvoer naar de push-state map, draait non-blocking.
set -uo pipefail

RUN_ID="${1:?run-id}"
LANE="${2:?lane-naam}"
shift 2

STATE_DIR="${GATE_STATE_DIR:-.git/push-state}"
RES_DIR="$STATE_DIR/$RUN_ID/results"
LOG="$RES_DIR/$LANE.log"

mkdir -p "$RES_DIR"

{
    echo "⚡ lane $LANE gestart $(date -u +%H:%M:%S)"
    if "$@" 2>&1; then
        RC=0
        echo "✓ lane $LANE: PASS"
    else
        RC=$?
        echo "✗ lane $LANE: FAIL (exit $RC)"
    fi
    echo "exit=$RC" > "$RES_DIR/$LANE.status"
    echo "rc=$RC" > "$RES_DIR/$LANE.rc"
} > "$LOG" 2>&1
exit 0
