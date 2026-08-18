#!/bin/bash
# scripts/gates/cancel.sh - annuleer een draaiende async verificatie-run.
# Killt de lane-processen van de run en markeert de run als gecanceld,
# zodat een eventuele wachtende push-verificatie niet als groen doorgaat.
#
# Gebruik: cancel.sh [run-id]   (zonder id: de actieve run)
set -uo pipefail
STATE_DIR="${GATE_STATE_DIR:-.git/push-state}"

if [ -n "${1:-}" ]; then RUN_ID="$1"; elif [ -f "$STATE_DIR/current" ]; then RUN_ID="$(cat "$STATE_DIR/current")"; else echo "geen actieve run om te annuleren"; exit 0; fi
RES_DIR="$STATE_DIR/$RUN_ID"
[ -d "$RES_DIR" ] || { echo "run $RUN_ID bestaat niet"; exit 1; }

echo "🛑 cancel run $RUN_ID …"

# Kill de lane.sh processen die ik voor deze run heb gestart. elk lane-proces
# draait met RUN_ID als eerste argument.
pids="$(pgrep -f "gates/lane.sh $RUN_ID " || true)"
if [ -n "$pids" ]; then
    # shellcheck disable=SC2086
    kill $pids 2>/dev/null || true
    echo "  → lane-processen gestopt: $pids"
else
    echo "  → geen draaiende lane-processen gevonden (al klaar?)"
fi

# Markeer elke lane die nog niet afgerond is als gecanceld, zodat een
# wachtende watch.sh / push.sh niet tot een vals groen komt.
mkdir -p "$RES_DIR/results"
for lane in ruff ds-check frontend brain-gate build-check; do
    if [ ! -e "$RES_DIR/results/$lane.rc" ]; then
        echo "rc=9" > "$RES_DIR/results/$lane.rc"          # 9 = gecanceld
        echo "exit=9" > "$RES_DIR/results/$lane.status"
        echo "cancelled" > "$RES_DIR/results/$lane.cancel"
        echo "  → lane $lane gemarkeerd als gecanceld"
    fi
done
echo "status=CANCELLED" > "$RES_DIR/aggregate.status"
[ -f "$STATE_DIR/notify.record" ] && rm -f "$STATE_DIR/notify.record"
echo "✅ run $RUN_ID gecancelled. Een wachtende verificatie gaat nu NIET door."
exit 0
