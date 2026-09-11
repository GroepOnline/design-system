#!/usr/bin/env python3
"""Capture the representative visual-review matrix with system Chromium/Chrome."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def browser():
    for name in (
        "chromium",
        "chromium-browser",
        "google-chrome",
        "google-chrome-stable",
    ):
        p = shutil.which(name)
        if p:
            return p
    cache = Path.home() / ".cache/ms-playwright"
    candidates = sorted(
        cache.glob(
            "chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"
        )
    ) + sorted(cache.glob("chromium-*/chrome-linux64/chrome"))
    for p in reversed(candidates):
        if p.is_file():
            return str(p)
    raise SystemExit("visual-capture: no Chromium/Chrome executable found")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="dist/visual-review")
    args = ap.parse_args()
    cfg = json.loads((ROOT / "quality/visual-contracts.json").read_text())
    out = (ROOT / args.out).resolve()
    shutil.rmtree(out, ignore_errors=True)
    out.mkdir(parents=True)
    exe = browser()
    artifacts = []
    with tempfile.TemporaryDirectory(prefix="signaal-visual-") as td:
        td = Path(td)
        for case in cfg["cases"]:
            target = (ROOT / case["path"]).resolve().as_uri()
            for vp, (w, h) in cfg["viewports"].items():
                for theme in cfg["themes"]:
                    wrapper = td / "frame.html"
                    wrapper.write_text(
                        f'''<!doctype html><meta charset="utf-8"><style>html,body,iframe{{margin:0;width:100%;height:100%;border:0;background:#fff}}</style><iframe id="f" src="{target}"></iframe><script>f.onload=()=>{{try{{f.contentDocument.documentElement.dataset.theme="{theme}"}}catch(e){{}}}}</script>'''
                    )
                    dest = out / f"{case['id']}--{vp}--{theme}.png"
                    subprocess.run(
                        [
                            exe,
                            "--headless=new",
                            "--no-sandbox",
                            "--disable-gpu",
                            f"--window-size={w},{h}",
                            "--virtual-time-budget=900",
                            f"--screenshot={dest}",
                            wrapper.resolve().as_uri(),
                        ],
                        check=True,
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                    )
                    artifacts.append(
                        {
                            "case": case["id"],
                            "viewport": vp,
                            "theme": theme,
                            "file": dest.name,
                            "sha256": hashlib.sha256(dest.read_bytes()).hexdigest(),
                        }
                    )
    (out / "manifest.json").write_text(
        json.dumps({"schema": 1, "artifacts": artifacts}, indent=2) + "\n"
    )
    print(f"visual-capture: {len(artifacts)} screenshots -> {out}")


if __name__ == "__main__":
    main()
