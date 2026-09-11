#!/usr/bin/env bash
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXT_ROOT="$ROOT/extensions"
PROFILE_ROOT="$ROOT/profiles"
PATTERN_ROOT="$ROOT/patterns"
cmd="${1:-context}"
ext="${2:-${SIGNAAL_EXTENSION:-base}}"
profile="${3:-${SIGNAAL_PROFILE:-base}}"

list_dirs() { local root="$1"; printf 'base\n'; find "$root" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' 2>/dev/null | sort; }

case "$cmd" in
  list|extensions) list_dirs "$EXT_ROOT" ;;
  profiles) list_dirs "$PROFILE_ROOT" ;;
  patterns) find "$PATTERN_ROOT" -mindepth 2 -maxdepth 2 -name pattern.json -printf '%h\n' 2>/dev/null | xargs -r -n1 basename | sort ;;
  pattern)
    id="${2:-}"
    file="$PATTERN_ROOT/$id/pattern.json"
    [[ -f "$file" ]] || { printf 'unknown pattern: %s\n' "$id" >&2; exit 2; }
    cat "$file"
    ;;
  quality)
    mode="${2:-gate}"
    if [[ "$mode" == "visual" ]]; then
      shift 2 || true
      exec python3 "$ROOT/scripts/capture-visual-contracts.py" "$@"
    fi
    exec "$ROOT/.agents/hooks/signaal-quality.sh"
    ;;
  context)
    printf 'base_design=%s\nbase_taste=%s\n' "$ROOT/DESIGN.md" "$ROOT/taste/taste-rules.md"
    if [[ "$profile" != "base" ]]; then
      pdir="$PROFILE_ROOT/$profile"
      if [[ -f "$pdir/profile.json" ]]; then
        printf 'profile=%s\nprofile_design=%s\nprofile_taste=%s\n' "$profile" "$pdir/DESIGN.md" "$pdir/TASTE.md"
      else
        printf 'profile=%s\nwarning_profile=unknown profile; using base\n' "$profile"
      fi
    else printf 'profile=base\n'; fi
    if [[ "$ext" != "base" ]]; then
      edir="$EXT_ROOT/$ext"
      if [[ -f "$edir/extension.json" ]]; then
        printf 'extension=%s\nextension_design=%s\nextension_taste=%s\n' "$ext" "$edir/DESIGN.md" "$edir/TASTE.md"
      else
        printf 'extension=%s\nwarning_extension=unknown extension; using base\n' "$ext"
      fi
    else printf 'extension=base\n'; fi
    ;;
  *) printf 'usage: ./s.sh [extensions|profiles|patterns|pattern|context|quality] [extension|pattern|gate|visual] [profile]\n' >&2; exit 2 ;;
esac
