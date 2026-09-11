#!/usr/bin/env bash
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ext="${SIGNAAL_EXTENSION:-base}"

# Advisory only: context discovery must never become a runtime/build dependency.
# Unknown or absent extensions deliberately fall back to base and exit 0.
if [[ -x "$ROOT/s.sh" ]]; then
  "$ROOT/s.sh" context "$ext" 2>/dev/null || true
fi
exit 0
