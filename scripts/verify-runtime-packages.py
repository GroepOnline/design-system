#!/usr/bin/env python3
"""Validate Signaal runtime package manifests and npm pack contents."""
from __future__ import annotations
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLAN = json.loads((ROOT / "packages/release.json").read_text())


def fail(msg: str) -> None:
    print(f"package-contract: {msg}", file=sys.stderr)
    raise SystemExit(1)


def exported_paths(exports: object) -> set[str]:
    out: set[str] = set()
    if isinstance(exports, str):
        if exports.startswith("./"): out.add(exports[2:])
    elif isinstance(exports, dict):
        for value in exports.values(): out |= exported_paths(value)
    return out


def main() -> None:
    version = PLAN["version"]
    names = {p["name"] for p in PLAN["packages"]}
    for spec in PLAN["packages"]:
        pkgdir = ROOT / spec["path"]
        manifest = json.loads((pkgdir / "package.json").read_text())
        if manifest.get("name") != spec["name"]: fail(f"{spec['path']}: package name drift")
        if manifest.get("version") != version: fail(f"{spec['name']}: version != release.json")
        if PLAN.get("publish") is False and manifest.get("private") is not True:
            fail(f"{spec['name']}: alpha safety requires private=true")
        for rel in set(manifest.get("files", [])) | exported_paths(manifest.get("exports", {})):
            if not (pkgdir / rel).is_file(): fail(f"{spec['name']}: missing exported/packed file {rel}")
        for dep, depver in manifest.get("dependencies", {}).items():
            if dep in names and depver != version: fail(f"{spec['name']}: internal dependency {dep} must equal {version}")
        subprocess.run(["node", "--check", "index.js"], cwd=pkgdir, check=True, stdout=subprocess.DEVNULL)
        packed = subprocess.run(["npm", "pack", "--dry-run", "--json"], cwd=pkgdir, check=True, capture_output=True, text=True)
        info = json.loads(packed.stdout)[0]
        actual = {f["path"] for f in info["files"]}
        allowed = set(manifest.get("files", [])) | {"package.json"}
        extra = actual - allowed
        missing = set(manifest.get("files", [])) - actual
        if extra: fail(f"{spec['name']}: unexpected packed files: {sorted(extra)}")
        if missing: fail(f"{spec['name']}: declared files missing from tarball: {sorted(missing)}")
        print(f"package-contract: {spec['name']} {version} ok ({len(actual)} files)")

if __name__ == "__main__":
    main()
