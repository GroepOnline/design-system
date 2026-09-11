#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(msg):
    print(f"quality: {msg}", file=sys.stderr)
    raise SystemExit(1)


def main():
    rubric = json.loads((ROOT / "quality/taste-rubric.json").read_text())
    ids = [x["id"] for x in rubric.get("criteria", [])]
    if len(ids) != len(set(ids)) or len(ids) < 6:
        fail("taste rubric criteria must be unique and substantive")
    if not rubric.get("hard_bans"):
        fail("taste rubric requires hard bans")
    vc = json.loads((ROOT / "quality/visual-contracts.json").read_text())
    if set(vc.get("viewports", {})) != {"phone", "desktop"}:
        fail("visual contracts require phone + desktop viewports")
    if set(vc.get("themes", [])) != {"light", "dark"}:
        fail("visual contracts require light + dark themes")
    cases = vc.get("cases", [])
    case_ids = [x["id"] for x in cases]
    if len(case_ids) != len(set(case_ids)):
        fail("visual case ids must be unique")
    for case in cases:
        if not (ROOT / case["path"]).is_file():
            fail(f"missing visual case path {case['path']}")
    idx = json.loads((ROOT / "catalog-index.json").read_text())
    canonical_categories = {
        x["category"] for x in idx["components"] if x["category"] != "systeem"
    }
    covered_categories = {x.get("category") for x in cases if x.get("category")}
    missing = canonical_categories - covered_categories
    if missing:
        fail(f"missing category coverage: {sorted(missing)}")
    pattern_ids = {x["id"] for x in idx["patterns"]}
    covered_patterns = {x.get("pattern") for x in cases if x.get("pattern")}
    if pattern_ids - covered_patterns:
        fail(f"missing pattern coverage: {sorted(pattern_ids - covered_patterns)}")
    print(
        f"quality: {len(ids)} taste criteria, {len(cases)} visual cases, all categories/patterns covered"
    )


if __name__ == "__main__":
    main()
