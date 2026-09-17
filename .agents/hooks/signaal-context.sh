#!/usr/bin/env bash
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ext="${SIGNAAL_EXTENSION:-base}"
profile="${SIGNAAL_PROFILE:-base}"

# Advisory/fail-open only. Context discovery may influence design work,
# but it must never become a runtime or build dependency.
if [[ -x "$ROOT/s.sh" ]]; then
  "$ROOT/s.sh" context "$ext" "$profile" 2>/dev/null || true
fi
exit 0
