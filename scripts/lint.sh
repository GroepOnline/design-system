#!/bin/sh
# Run the linters that apply to this repository's source files.
# Ruff is for Python only; markdownlint is for Markdown only.

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT_DIR"

if ! command -v ruff >/dev/null 2>&1; then
    echo "lint: ruff not found; install it with 'python3 -m pip install --user ruff'" >&2
    exit 1
fi

# The extensionless ds file is the repository's Python source. The
# .commandcode helpers are tool-local scripts and are intentionally outside
# this project's lint scope. Non-Python files are never passed to Ruff.
ruff check ds

if ! command -v markdownlint >/dev/null 2>&1; then
    echo "lint: markdownlint not found; install it globally with 'npm install --global markdownlint-cli'" >&2
    exit 1
fi

# Generated Markdown is checked by ds build, not by this source linter.
find . -type f -name '*.md' \
    -not -path './.git/*' \
    -not -path './brain-site/*' \
    -not -path './docs/*' \
    -not -path './taste-site/*' \
    -not -path './.commandcode/*' \
    -not -path './node_modules/*' \
    -print0 | xargs -0 -r markdownlint

# Frontend anti-regressie check (24u-learnings): lib.js-paden, debug-overlays,
# hero-hoogte + sectie-padding. Snel (~ms), puur Python stdlib.
if ! python3 scripts/check-frontend.py >/dev/null 2>&1; then
    echo "lint: frontend-regressie gevonden — run 'python3 scripts/check-frontend.py' voor details" >&2
    exit 1
fi

printf '%s\n' 'lint: applicable linters passed'
