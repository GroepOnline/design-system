#!/bin/bash
# scripts/gates/watch.sh - wacht op een actieve verificatie-run en rapporteer.
# Stopt niet met timeout; wacht tot alle lanes gereed zijn. Bij FAIL wordt een
# notifier-record geschreven en een non-zero exit gegeven (zodat een caller die
# als een contextual update / session-injectie kan opvangen).
#
# Gebruik: watch.sh [run-id] [--notify]
set -uo pipefail
STATE_DIR="${GATE_STATE_DIR:-.git/push-state}"

if [ -n "${1:-}" ] && [ "${1#--}" = "$1" ]; then RUN_ID="$1"; else RUN_ID="$(cat "$STATE_DIR/current" 2>/dev/null)"; fi
NOTIFY=0
for a in "$@"; do [ "$a" = "--notify" ] && NOTIFY=1; done
[ -n "$RUN_ID" ] || { echo "geen actieve run"; exit 1; }
RES_DIR="$STATE_DIR/$RUN_ID"

NLANES=4
echo "👀 watch run $RUN_ID — wacht op $NLANES lanes (geen timeout)…"
while [ "$(ls "$RES_DIR"/results/*.rc 2>/dev/null | wc -l | tr -d ' ')" -lt "$NLANES" ]; do
    sleep 2
done

fails="$(grep -h '^rc=' "$RES_DIR"/results/*.rc | grep -v 'rc=0' | wc -l | tr -d ' ')"
if [ "$fails" = "0" ]; then
    echo "✅ run $RUN_ID: ALLE LANES GROEN"
    exit 0
fi

echo "✗ run $RUN_ID: $fails lane(s) rood"
if [ "$NOTIFY" = "1" ]; then
    {
        echo "run=$RUN_ID"
        echo "status=FAIL"
        echo "fails=$fails"
        echo "time=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
        echo "actie=cancel-push $RUN_ID of fix + re-push"
    } > "$STATE_DIR/notify.record"
    echo "→ notifier-record: $STATE_DIR/notify.record"
fi
exit 1
