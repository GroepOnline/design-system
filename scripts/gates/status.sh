#!/bin/bash
# scripts/gates/status.sh - toon live status van een async verificatie-run
# Gebruik: status.sh [run-id]   (zonder id: de actieve)
set -uo pipefail
STATE_DIR="${GATE_STATE_DIR:-.git/push-state}"

if [ -n "${1:-}" ]; then RUN_ID="$1"; elif [ -f "$STATE_DIR/current" ]; then RUN_ID="$(cat "$STATE_DIR/current")"; else echo "geen actieve run"; exit 1; fi
RES_DIR="$STATE_DIR/$RUN_ID"
[ -d "$RES_DIR" ] || { echo "run $RUN_ID bestaat niet"; exit 1; }

echo "run $RUN_ID"
for rc_file in "$RES_DIR"/results/*.rc; do
    [ -e "$rc_file" ] || continue
    name="$(basename "$rc_file" .rc)"
    rc="$(cat "$rc_file")"
    rc="${rc#rc=}"                    # strip 'rc=' prefix → '0' / '1' / '9'
    [ "$rc" = "0" ] && mark="✓" || mark="✗"
    echo "  $mark $name (exit $rc)"
done

if [ -f "$RES_DIR/results/aggregate.status" ] 2>/dev/null; then :; fi
# tellen afgerond?
total="$(ls "$RES_DIR"/results/*.rc 2>/dev/null | wc -l | tr -d ' ')"
nlanes=5
if [ "$total" -ge "$nlanes" ]; then
    fails="$(grep -h '^rc=' "$RES_DIR"/results/*.rc | grep -v 'rc=0' | wc -l | tr -d ' ')"
    if [ "$fails" = "0" ]; then echo "ball: ✅ ALLE LANES GROEN"; else echo "ball: ✗ $fails lane(s) rood"; fi
else
    echo "ball: nog $((nlanes-total))/${nlanes} bezig…"
fi
