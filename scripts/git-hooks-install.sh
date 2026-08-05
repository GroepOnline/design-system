#!/bin/sh
# Installeer git hooks voor dit project
# Gebruik: bash scripts/git-hooks-install.sh
# Of: make hook

set -e

HOOK_DIR=".git/hooks"
SRC_DIR="scripts/git-hooks"

if [ ! -d "$HOOK_DIR" ]; then
    echo "✗ Geen .git directory gevonden — ben je in de repo root?"
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
