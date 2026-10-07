#!/usr/bin/env python3
"""Install only the requested design skill adapters, with backups and source hashes."""

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NAMES = (
    "design-system",
    "chef-frontend-meta",
    "web-design-guidelines",
    "artifact-template-design-report",
    "communicate-clearly",
    "locked-taste-design-run",
)


def generated_mirror(source, name):
    """Return a self-contained generated mirror without a worktree dependency."""
    content = source.read_text()
    marker = (
        "\n> Generated mirror of "
        f"`GroepOnline/design-system/.agents/skills/{name}/SKILL.md`. "
        "Regenerate with `scripts/install-design-skills.py`; do not maintain "
        "separate rules here.\n"
    )
    if not content.startswith("---\n"):
        raise SystemExit("Skill has no YAML frontmatter: " + str(source))
    boundary = content.find("\n---\n", 4)
    if boundary < 0:
        raise SystemExit("Skill has incomplete YAML frontmatter: " + str(source))
    return content[: boundary + 5] + marker + content[boundary + 5 :]


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--destination", type=Path, required=True)
    p.add_argument("--backup", type=Path, required=True)
    p.add_argument("--apply", action="store_true")
    p.add_argument("--vendor-report-entry", type=Path)
    args = p.parse_args()
    changes = []
    for name in NAMES:
        source = ROOT / ".agents/skills" / name / "SKILL.md"
        target = args.destination / name / "SKILL.md"
        adapter = generated_mirror(source, name)
        changes.append((source, target, adapter))
    if args.vendor_report_entry:
        source = ROOT / ".agents/skills/artifact-template-design-report/SKILL.md"
        adapter = generated_mirror(source, "artifact-template-design-report")
        changes.append((source, args.vendor_report_entry, adapter))
    receipt = []
    for index, (source, target, content) in enumerate(changes):
        if target.is_symlink():
            raise SystemExit("Refusing to replace symlink adapter: " + str(target))
        item = {
            "source": str(source),
            "target": str(target),
            "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
            "installed_sha256": hashlib.sha256(content.encode()).hexdigest(),
        }
        if args.apply:
            args.backup.mkdir(parents=True, exist_ok=True)
            if target.exists():
                backup = args.backup / f"{index}-{target.parent.name}-SKILL.md"
                if backup.exists():
                    raise SystemExit("Backup already exists: " + str(backup))
                backup.write_bytes(target.read_bytes())
                item["backup"] = str(backup)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content)
        receipt.append(item)
    result = {
        "applied": args.apply,
        "at": datetime.now(timezone.utc).isoformat(),
        "entries": receipt,
    }
    if args.apply:
        (args.backup / "receipt.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
