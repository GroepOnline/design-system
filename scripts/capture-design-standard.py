"""Render local design artifacts with the existing lightweight headless browser.

A bounded test server/browser exists only for this command and closes on exit.
Auth preview uses an explicitly anonymous fixture; this is visual, not OAuth proof.
"""

import argparse
import hashlib
import html
import json
import re
import subprocess
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PROBE = """setTimeout(async()=>{await document.fonts.ready;document.body.dataset.capture=JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth,fonts:document.fonts.status,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,animations:document.getAnimations().map(a=>({state:a.playState,iterations:a.effect.getTiming().iterations})),heading:document.querySelector('h1')?.textContent,images:[...document.images].map(i=>({loaded:i.complete&&i.naturalWidth>0,alt:i.alt}))});},1800);"""


def find_browser():
    candidates = sorted(
        (Path.home() / ".cache/ms-playwright").glob(
            "chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"
        )
    )
    if not candidates:
        raise SystemExit("Existing lightweight headless renderer unavailable")
    return candidates[-1]


class CaptureHandler(SimpleHTTPRequestHandler):
    auth_dist = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *args):
        pass

    def send_bytes(self, payload, content_type):
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.end_headers()
        self.wfile.write(payload)

    def resolve_file(self, route):
        if self.auth_dist and route.startswith("/assets/"):
            return self.auth_dist / route.lstrip("/")
        if self.auth_dist and route in ("/", "/sign-in"):
            return self.auth_dist / "index.html"
        return ROOT / route.lstrip("/")

    def serve_file(self, file, route):
        if file.is_file() and file.suffix == ".html":
            raw = file.read_text().replace(
                "</body>", '<script src="/__capture_probe.js"></script></body>'
            )
            if "/__capture_probe.js" not in raw:
                raw += '<script src="/__capture_probe.js"></script>'
            self.send_bytes(raw.encode(), "text/html; charset=utf-8")
            return True
        if self.auth_dist and route.startswith("/assets/") and file.is_file():
            self.send_bytes(file.read_bytes(), self.guess_type(str(file)))
            return True
        return False

    def do_GET(self):
        route = urlsplit(self.path).path
        if route == "/__capture_probe.js":
            self.send_bytes(PROBE.encode(), "application/javascript")
            return
        if self.auth_dist and route == "/v1/context":
            self.send_bytes(
                b'{"kind":"anonymous","plane":"internal","environment":"development","signInAvailable":true}',
                "application/json",
            )
            return
        file = self.resolve_file(route)
        if file.is_dir():
            file = file / "index.html"
        if self.serve_file(file, route):
            return
        super().do_GET()


def capture_routes(auth_dist):
    routes = [
        ("report", "/reports/chefgroep-auth-2026-09-12/"),
        ("template", "/templates/identity-spatial/"),
    ]
    if auth_dist:
        routes.extend([("auth", "/"), ("auth-signin", "/sign-in")])
    viewports = [
        ("desktop", 1440, 1000, False),
        ("phone", 390, 844, False),
        ("reduced", 390, 844, True),
    ]
    return [(*route, *viewport) for route in routes for viewport in viewports]


def capture_case(browser, port, out, case):
    name, path, label, width, height, reduced = case
    dest = out / f"{name}-{label}.png"
    command = [
        str(browser),
        "--no-sandbox",
        "--disable-gpu",
        f"--window-size={width},{height}",
        "--virtual-time-budget=2600",
        "--run-all-compositor-stages-before-draw",
        f"--screenshot={dest}",
        "--dump-dom",
    ]
    if reduced:
        command.append("--force-prefers-reduced-motion")
    command.append(f"http://127.0.0.1:{port}{path}")
    result = subprocess.run(
        command, capture_output=True, text=True, timeout=35, check=True
    )
    match = re.search(r'data-capture="([^"]+)"', result.stdout)
    if not match:
        raise RuntimeError("Missing rendered DOM evidence: " + name)
    facts = json.loads(html.unescape(match[1]))
    facts.update(
        case=name,
        viewport=label,
        file=dest.name,
        sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),
    )
    if facts["overflow"] or any(not image["loaded"] for image in facts["images"]):
        raise RuntimeError("Render overflow or missing image: " + name + " " + label)
    if reduced and facts["animations"]:
        raise RuntimeError("Reduced motion still animated: " + name)
    if not reduced and any(
        item["iterations"] is None or item["iterations"] > 1
        for item in facts["animations"]
    ):
        raise RuntimeError("Unbounded motion in rendered artifact: " + name)
    return facts


def render_pdf(browser, port, output):
    subprocess.run(
        [
            str(browser),
            "--no-sandbox",
            "--disable-gpu",
            "--no-pdf-header-footer",
            "--virtual-time-budget=2600",
            f"--print-to-pdf={output}",
            f"http://127.0.0.1:{port}/reports/chefgroep-auth-2026-09-12/",
        ],
        check=True,
        capture_output=True,
        timeout=35,
    )


def capture_all(browser, out, auth_dist):
    CaptureHandler.auth_dist = auth_dist
    server = ThreadingHTTPServer(("127.0.0.1", 0), CaptureHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        evidence = [
            capture_case(browser, server.server_port, out, case)
            for case in capture_routes(auth_dist)
        ]
        output = out / "chefgroep-design-report.pdf"
        render_pdf(browser, server.server_port, output)
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=3)
    return {
        "scope": "local artifact rendering; anonymous auth fixture only; no live account/OAuth proof",
        "cases": evidence,
        "pdf_sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--auth-dist", type=Path)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    manifest = capture_all(find_browser(), args.out, args.auth_dist)
    (args.out / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
