#!/usr/bin/env python3
"""Verify product components using the existing lightweight headless renderer."""

import argparse
import importlib.util
import subprocess
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "capture", ROOT / "scripts/capture-design-standard.py"
)
capture = importlib.util.module_from_spec(spec)
spec.loader.exec_module(capture)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *args):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument(
        "--template",
        choices=["identity-spatial", "operator-evidence"],
        default="identity-spatial",
    )
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        subprocess.run(
            [
                "node",
                str(
                    ROOT
                    / "scripts"
                    / (
                        "verify-operator-browser.mjs"
                        if args.template == "operator-evidence"
                        else "verify-identity-browser.mjs"
                    )
                ),
                str(capture.find_browser()),
                f"http://127.0.0.1:{server.server_port}",
                str(args.out.resolve()),
            ],
            check=True,
            timeout=60,
        )
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=3)


if __name__ == "__main__":
    main()
