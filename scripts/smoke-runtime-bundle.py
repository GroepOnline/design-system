#!/usr/bin/env python3
"""Import the actual packed tarballs in an isolated, network-free consumer."""

from __future__ import annotations

import argparse
import json
import subprocess
import tarfile
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLAN = json.loads((ROOT / "packages/release.json").read_text())


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("bundle", nargs="?", default="dist/runtime-packages")
    args = ap.parse_args()
    bundle = (ROOT / args.bundle).resolve()
    manifest = json.loads((bundle / "release-manifest.json").read_text())
    with tempfile.TemporaryDirectory(prefix="signaal-consumer-") as td:
        consumer = Path(td)
        nm = consumer / "node_modules"
        nm.mkdir()
        for art in manifest["artifacts"]:
            dest = nm / Path(art["name"])
            dest.mkdir(parents=True)
            with tarfile.open(bundle / art["file"], "r:gz") as tf:
                for member in tf.getmembers():
                    if member.name.startswith("package/"):
                        member.name = member.name[len("package/") :]
                        if member.name:
                            tf.extract(member, dest, filter="data")
        react = nm / "react"
        react.mkdir()
        (react / "package.json").write_text(
            '{"name":"react","version":"19.0.0","type":"module","exports":"./index.js"}\n'
        )
        (react / "index.js").write_text(
            "const React={forwardRef:(f)=>f,createElement:(...args)=>({args})}; export default React;\n"
        )
        smoke = consumer / "smoke.mjs"
        smoke.write_text(
            """import {themes} from "@signaal/tokens";\nimport {attachCommandAck} from "@signaal/interactions";\nimport {Button,DataGrid} from "@signaal/react";\nif (!themes.light || !themes.dark) throw new Error("tokens missing");\nif (typeof attachCommandAck !== "function") throw new Error("interactions missing");\nif (typeof Button !== "function" || typeof DataGrid !== "function") throw new Error("react exports missing");\nconsole.log("consumer-smoke: ok");\n"""
        )
        subprocess.run(["node", str(smoke)], cwd=consumer, check=True)
    print(
        f"consumer-smoke: {len(manifest['artifacts'])} packed packages import cleanly"
    )


if __name__ == "__main__":
    main()
