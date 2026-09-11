#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
python3 scripts/a11y-audit.py
python3 scripts/validate-quality-contract.py
python3 ds check
