#!/usr/bin/env python3
"""check-frontend.py — anti-regressie voor de 24u-learnings (2026-08-05).

Vangt structureel de drie regressies op die handmatig werden opgelost maar niet
door de bestaande gates (ruff / ds check / brain gate / build check) worden gecheckt:

  1. Fout relatief lib.js-pad per map (de ../lib.js-vs-lib.js 404-bug).
  2. Debug-overlays (.sruler/.splate/.smodeline/.scoord) weer zichtbaar.
  3. Hero die terugsluipt naar 88vh + exorbitante sectie-padding (74%-lege-pagina).

Alleen echte shell-pagina's (die een <script src=...lib.js>-tag hebben) worden op het
lib.js-pad gecontroleerd. Documentatie die lib.js als tekst noemt (docs/…) en
uitrol-templates (templates/) vallen buiten de check. Idempotent, ~ms, geen netwerk.
Exit 0 = clean, 1 = regressie gevonden.
"""
from __future__ import annotations

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {".git", "node_modules", "brain-site", "templates", "playground", "customEditor", ".commandcode"}
errors = []
warnings = []

# ---- 1) lib.js relatief-pad per map ----
# lib.js woont op components/lib.js. Elke shell-pagina moet het pad t.o.v. zijn
# eigen map hebben; anders 404 (de bug van 2026-08-05).
LIB_AT = "components/lib.js"


def lib_rel(from_dir: str) -> str:
    return os.path.relpath(LIB_AT, from_dir).replace(os.sep, "/")


html_files = []
for dirpath, dirnames, files in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for f in files:
        if f.endswith(".html"):
            html_files.append(os.path.join(dirpath, f))

checked = 0
for hp in sorted(html_files):
    rel = os.path.relpath(hp, ROOT)
    text = open(hp, encoding="utf-8").read()
    # alleen echte script-tags met lib.js tellen (doc-tekst noemt lib.js ook)
    m = re.search(r'<script[^>]*src="([^"]*lib\.js)"', text)
    if not m:
        continue  # geen shell-script-tag → niets te controleren
    checked += 1
    expected = lib_rel(os.path.dirname(hp))
    actual = m.group(1)
    if actual != expected:
        errors.append(
            f"[lib.js] {rel}: src=\"{actual}\" moet \"{expected}\" zijn "
            f"(relatief t.o.v. de eigen map, niet t.o.v. root)"
        )

# ---- 2) debug-overlays verborgen ----
tokens = open(os.path.join(ROOT, "tokens.css"), encoding="utf-8").read()
if not re.search(r"\.sruler\s*,\s*\.splate", tokens):
    errors.append("[overlays] tokens.css mist de debug-overlay verbergregel (.sruler,.splate,…)")
elif not re.search(r"display:\s*none\s*!important", tokens):
    errors.append("[overlays] debug-overlays niet display:none !important in tokens.css")
if "dev-mode" not in tokens:
    warnings.append("[overlays] geen dev-mode toggle-regel in tokens.css (backtick-toggle)")

# ---- 3) hero-hoogte + sectie-padding anti-regressie ----
index_html = os.path.join(ROOT, "index.html")
if os.path.exists(index_html):
    itext = open(index_html, encoding="utf-8").read()
    mh = re.search(r"\.hero\s*\{[^}]*min-height:\s*([0-9]+)vh", itext, re.S)
    if mh and int(mh.group(1)) > 70:
        errors.append(f"[hero] min-height {mh.group(1)}vh > 70vh → regressie van de 74%-lege-pagina; zet ≤70vh")
    sp = re.search(r"\.sec(?:\s*,\s*\.wrap\.sec)?[^{]*\{\s*padding:\s*([0-9]+)px\s+0", itext)
    if sp and int(sp.group(1)) > 72:
        errors.append(f"[sectie] verticale padding {sp.group(1)}px > 72px → terug naar het A4-blad-ritme (≈48px)")

# ---- rapport ----
print(f"check-frontend: {checked} shell-pagina's op lib.js-pad; overlays + hero/padding gecheckt")
for w in warnings:
    print(f"  ⚠ {w}")
if errors:
    for e in errors:
        print(f"  ✗ {e}")
    print(f"✗ check-frontend: {len(errors)} regressie(s)")
    sys.exit(1)
print("✓ check-frontend: clean (lib.js-paden, overlays, hero/padding)")
sys.exit(0)
