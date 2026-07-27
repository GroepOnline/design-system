#!/usr/bin/env bash
# new-project.sh — scaffold een nieuw product vanuit design-system
# gebruik: ./new-project.sh <naam> [pad]
set -euo pipefail

NAAM="${1:-}"
if [[ -z "$NAAM" ]]; then
  echo "gebruik: ./new-project.sh <naam> [pad]" >&2
  exit 1
fi
BASIS="${2:-$HOME/$NAAM}"
DS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -e "$BASIS" ]]; then
  echo "fout: $BASIS bestaat al" >&2
  exit 1
fi

mkdir -p "$BASIS/components"
cp "$DS/tokens.css" "$BASIS/"
cp "$DS/components/icons.svg" "$BASIS/components/"
cp "$DS/components/lib.js" "$BASIS/components/"
INIT="${NAAM:0:1}"
sed -e "s/{{NAAM}}/$NAAM/g" -e "s/{{INITIALE}}/${INIT^^}/g" "$DS/templates/project-index.html" > "$BASIS/index.html"

cat > "$BASIS/DESIGN-PTR.md" <<EOF
# Design: design-system v2

Dit product gebruikt het design-system (gekopieerd, zoals shadcn).
Bron: $DS
- Lees eerst: $DS/taste/taste-rules.md
- Componenten: $DS/components/ (gallery: serveer en open components/index.html)
- Taal: $DS/DESIGN.md
Wijzigingen aan design lopen via de taste-loop (zie $DS/WORKFLOW.md).
EOF

echo "✓ $NAAM gescaffold in $BASIS"
echo "  kijk: python3 -m http.server 8899 --bind 127.0.0.1 --directory '$BASIS'"
