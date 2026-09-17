#!/bin/sh
# Installeer git hooks voor dit project
# Gebruik: bash scripts/git-hooks-install.sh
# Of: make hook

set -e

HOOK_DIR="$(git rev-parse --git-path hooks 2>/dev/null || true)"
SRC_DIR="scripts/git-hooks"

if [ -z "$HOOK_DIR" ]; then
    echo "✗ Geen geldige git-omgeving gevonden — ben je in de repo root/worktree?"
    exit 1
fi

echo "🔧 Git hooks installeren..."

# Maak hooks directory aan als die niet bestaat
mkdir -p "$HOOK_DIR"

# Installeer pre-push hook
if [ -f "$SRC_DIR/pre-push" ]; then
    cp "$SRC_DIR/pre-push" "$HOOK_DIR/pre-push"
    chmod +x "$HOOK_DIR/pre-push"
    echo "  ✓ pre-push hook geïnstalleerd"
else
    echo "  ⚠ $SRC_DIR/pre-push niet gevonden — sla over"
fi

echo "✅ Klaar. Hook is actief voor deze clone."
echo "   Teamleden: run dit script na elke clone/pull."
