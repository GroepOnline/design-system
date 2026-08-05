#!/bin/bash
# scripts/gates/push.sh - push met async verificatie in lanes.
#
# In plaats van dat de pre-push hook je terminal blokkeert met 4 sequentiële
# checks (~1s), draait deze wrapper de checks als PARALLEL async lanes in de
# achtergrond. Je kunt ondertussen gewoon doorwerken. Zodra alle lanes groen
# zijn wordt de echte `git push` uitgevoerd; bij een rode lane (of cancel)
# wordt de push NIET uitgevoerd en krijg je een duidelijke melding.
#
# Gebruik:
#   ./scripts/gates/push.sh                 # async lanes, push pas als groen
#   GATE_WAIT=1 ./scripts/gates/push.sh     # wacht blocking tot klaar (default)
#   ./scripts/gates/push.sh --background    # start lanes, keer direct terug
#   ./scripts/gates/push.sh --cancel        # annuleer de actieve run
#   ./scripts/gates/push.sh --status        # toon status van actieve run
#   ./scripts/gates/push.sh --watch         # wacht op actieve run, rapporteer
#
# Om in een normale editor/terminal te gebruiken met `git push`, zie de
# pre-push hook: die roept deze wrapper aan zodat je nooit dubbel verifieert.
set -uo pipefail
cd "$(dirname "$0")/../.." || exit 1
STATE_DIR="${GATE_STATE_DIR:-.git/push-state}"
mkdir -p "$STATE_DIR"

RUN_SCRIPT="scripts/gates/run-verify.sh"
STATUS_SCRIPT="scripts/gates/status.sh"
WATCH_SCRIPT="scripts/gates/watch.sh"
CANCEL_SCRIPT="scripts/gates/cancel.sh"

ARG="${1:-}"

case "${ARG}" in
  --cancel)
    exec "$CANCEL_SCRIPT"
    ;;
  --status)
    exec "$STATUS_SCRIPT"
    ;;
  --watch)
    exec "$WATCH_SCRIPT" --notify
    ;;
  --background)
    # Start lanes async en keer direct terug.
    "$RUN_SCRIPT" >/dev/null 2>&1
    RUN_ID="$(cat "$STATE_DIR/current" 2>/dev/null || echo '?')"
    echo "🚀 run $RUN_ID gestart — lanes draaien async door."
    echo "   • status: ./scripts/gates/push.sh --status"
    echo "   • wacht:  ./scripts/gates/push.sh --watch"
    echo "   • cancel: ./scripts/gates/push.sh --cancel"
    exit 0
    ;;
  ""|-w|--wait)
    # Default: start lanes async en wacht blocking tot klaar.
    GATE_NOTIFY=1 "$RUN_SCRIPT" >/dev/null 2>&1
    RUN_ID="$(cat "$STATE_DIR/current" 2>/dev/null || echo '?')"
    if "$WATCH_SCRIPT" "$RUN_ID" --notify; then
        echo ""
        echo "✅ Alle lanes groen — voer nu de echte push uit:"
        echo "   git push origin $(git branch --show-current)"
        exit 0
    else
        echo ""
        echo "✗ Verificatie rood — push en 'vervolgens het resultaat' worden geblokkeerd."
        echo "  Fix de rode lane(s) of annuleer met: ./scripts/gates/push.sh --cancel"
        exit 1
    fi
    ;;
  *)
    echo "onbekend argument: $ARG"
    echo "gebruik: push.sh [--background|--watch|--status|--cancel|--wait]"
    exit 2
    ;;
esac
