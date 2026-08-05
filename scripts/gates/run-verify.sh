#!/bin/bash
# scripts/gates/run-verify.sh - draait alle verificatielanes PARALLEL (async)
# en schrijft het resultaat naar de push-state. Bij een fout-exit wordt een
# notifier-record klaargezet dat de sessie/context kan injecteren.
#
# Gebruik: run-verify.sh [run-id]
#   zonder run-id: genereert er een (of hergebruikt de actieve)
#   GATE_WAIT=1  : wacht tot alle lanes klaar zijn (blocking variant)
#   GATE_NOTIFY=1: schrijf een notifier-record bij FAIL (voor context/sessie/tasklist injectie)
set -uo pipefail

cd "$(dirname "$0")/../.." || exit 1
STATE_DIR="${GATE_STATE_DIR:-.git/push-state}"
mkdir -p "$STATE_DIR"

# Lanes: naam + commando. Elke lane draait onafhankelijk (async).
LANES=(
  "ruff|ruff check ds"
  "ds-check|./ds check"
  "brain-gate|./ds brain gate"
  "build-check|./ds build --check"
)

# Run-id bepalen
if [ -n "${1:-}" ]; then
    RUN_ID="$1"
elif [ -f "$STATE_DIR/current" ]; then
    RUN_ID="$(cat "$STATE_DIR/current")"
else
    RUN_ID="$(date +%s)"
    echo "$RUN_ID" > "$STATE_DIR/current"
fi
RES_DIR="$STATE_DIR/$RUN_ID"
mkdir -p "$RES_DIR"

echo "🚦 run $RUN_ID — ${#LANES[@]} lanes async gestart"

# Start alle lanes parallel in de achtergrond.
PIDS=()
NAMES=()
for lane in "${LANES[@]}"; do
    name="${lane%%|*}"
    cmd="${lane#*|}"
    # shellcheck disable=SC2086
    bash scripts/gates/lane.sh "$RUN_ID" "$name" $cmd &
    PIDS+=("$!")
    NAMES+=("$name")
done

if [ "${GATE_WAIT:-0}" = "1" ]; then
    # Blocking variant: wacht tot alle lanes klaar zijn en aggregeer.
    for p in "${PIDS[@]}"; do wait "$p"; done
    echo ""
    echo "── aggregaat ──"
    FAILS=0
    for name in "${NAMES[@]}"; do
        if [ -f "$RES_DIR/results/$name.rc" ]; then
            rc="$(cat "$RES_DIR/results/$name.rc")"
        else
            rc=1
        fi
        if [ "$rc" = "0" ]; then
            echo "  ✓ $name"
        else
            echo "  ✗ $name (exit $rc)"
            FAILS=$((FAILS+1))
        fi
    done
    echo "$FAILS" > "$RES_DIR/fails"
    echo "exit=$FAILS" > "$RES_DIR/aggregate.status"

    if [ "$FAILS" -gt 0 ]; then
        echo ""
        echo "✗ VERIFICATIE GEFAALD — $FAILS lane(s) rood"
        # Notifier-record voor context/sessie/tasklist injectie bij verkeerde exit.
        if [ "${GATE_NOTIFY:-0}" = "1" ]; then
            {
                echo "run=$RUN_ID"
                echo "status=FAIL"
                echo "fails=$FAILS"
                echo "lanes=$(IFS=,; echo "${NAMES[*]}")"
                echo "time=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
                echo "actie=cancel-push $RUN_ID of fix + re-push"
            } > "$STATE_DIR/notify.record"
            cp "$STATE_DIR/notify.record" "$RES_DIR/notify.record"
            echo "→ notifier-record geschreven: $STATE_DIR/notify.record"
        fi
        exit 1
    fi
    echo ""
    echo "✅ VERIFICATIE GESLAAGD — alle lanes groen"
    echo "status=PASS" > "$RES_DIR/aggregate.status"
    [ -f "$STATE_DIR/notify.record" ] && rm -f "$STATE_DIR/notify.record"
    exit 0
fi

# Non-blocking: terugkeren, lanes draaien door; check via status.sh of watch.sh
echo "ℹ️  lanes draaien async door. Bekijk: ./scripts/gates/status.sh $RUN_ID"
echo "ℹ️  of wacht blocking: GATE_WAIT=1 $0 $RUN_ID"
exit 0
