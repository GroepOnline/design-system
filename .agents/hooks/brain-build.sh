#!/usr/bin/env bash
# afterFileEdit: houd brain-site/ synchroon met de vault.
# Draait alleen voor brain/**/*.md. Faalt altijd open.
set -uo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)

input=$(cat 2>/dev/null || true)
[ -z "$input" ] && exit 0

path=$(printf '%s' "$input" | jq -r '
  .file_path // .path // .tool_input.path // .tool_input.file_path // empty' 2>/dev/null || true)
[ -z "$path" ] && exit 0

rel=${path#"$repo_root"/}
rel=${rel#./}

case "$rel" in
  brain/*.md|brain/*/*.md) ;;
  *) exit 0 ;;
esac

cd "$repo_root" || exit 0
./ds brain build >/dev/null 2>&1 || exit 0
./ds brain check 2>&1 | grep -E '^\s+!' >&2 || true
exit 0
