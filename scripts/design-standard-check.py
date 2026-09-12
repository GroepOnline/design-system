#!/usr/bin/env python3
"""Structural design-standard checks, deliberately not an aesthetic score."""

import hashlib
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / "scripts" / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main():
    load("design-run").graph()
    source = ROOT / "templates/design-report"
    provenance = json.loads((source / "provenance.json").read_text())
    for filename, key in [
        ("reference.docx", "reference_sha256"),
        ("preview.png", "preview_sha256"),
    ]:
        if (
            hashlib.sha256((source / "external" / filename).read_bytes()).hexdigest()
            != provenance[key]
        ):
            raise ValueError("Vendor reference changed: " + filename)
    for name in [
        "design-system",
        "chef-frontend-meta",
        "web-design-guidelines",
        "artifact-template-design-report",
        "communicate-clearly",
        "locked-taste-design-run",
    ]:
        path = ROOT / ".agents/skills" / name / "SKILL.md"
        content = path.read_text()
        if f"name: {name}\n" not in content or "description:" not in content:
            raise ValueError("Invalid skill metadata: " + name)
    renderer = load("render-design-report")
    for path in (ROOT / "reports").glob("*/report.json"):
        generated = path.with_name("index.html")
        packaged = renderer.package_figures(
            json.loads(path.read_text()), path.parent, generated.parent
        )
        if generated.read_text() != renderer.render(packaged):
            raise ValueError("Report render drift: " + str(path))
        for figure in packaged.get("figures", []):
            if not figure["src"].startswith("https://") and not (
                generated.parent / figure["src"]
            ).is_file():
                raise ValueError("Missing packaged report figure: " + figure["src"])
    for path in [
        "extensions/chefgroep/assets/identity-mark.svg",
        "templates/identity-spatial/index.html",
        "templates/identity-spatial/tokens.css",
        "templates/operator-evidence/index.html",
        "templates/operator-evidence/tokens.css",
        "templates/operator-evidence/component-contracts.json",
        "templates/operator-evidence/identity-mark.svg",
        "surfaces/operator-evidence.md",
        ".agents/meta/chefgroep-design.md",
    ]:
        if not (ROOT / path).is_file():
            raise ValueError("Missing standard source: " + path)
    print(
        "design-standard: graph, skills, retained reference hashes, templates and report renders passed; taste requires visual review"
    )


if __name__ == "__main__":
    main()
