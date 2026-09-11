#!/usr/bin/env bash
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXT_ROOT="$ROOT/extensions"
cmd="${1:-context}"
ext="${2:-${SIGNAAL_EXTENSION:-base}}"

case "$cmd" in
  list)
    printf 'base\n'
    find "$EXT_ROOT" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' 2>/dev/null | sort
    ;;
  context)
    if [[ "$ext" == "base" ]]; then
      printf 'extension=base\ndesign=%s\ntaste=%s\n' "$ROOT/DESIGN.md" "$ROOT/taste/taste-rules.md"
      exit 0
    fi
    dir="$EXT_ROOT/$ext"
    if [[ ! -f "$dir/extension.json" ]]; then
      printf 'extension=%s\nwarning=unknown extension; using base\ndesign=%s\ntaste=%s\n' "$ext" "$ROOT/DESIGN.md" "$ROOT/taste/taste-rules.md"
      exit 0
    fi
    printf 'extension=%s\nbase_design=%s\nbase_taste=%s\ndesign=%s\ntaste=%s\n' "$ext" "$ROOT/DESIGN.md" "$ROOT/taste/taste-rules.md" "$dir/DESIGN.md" "$dir/TASTE.md"
    ;;
  *) printf 'usage: ./s.sh [list|context] [extension]\n' >&2; exit 2 ;;
esac
