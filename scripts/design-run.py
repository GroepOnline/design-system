#!/usr/bin/env python3
"""Prepare and advance a dependency-checked design run with file evidence."""

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def graph():
    data = json.loads((ROOT / "chains/chefgroep-design.json").read_text())
    known = set()
    for node in data["nodes"]:
        if node["id"] in known or not set(node["dependsOn"]) <= known:
            raise ValueError("Chain has duplicate, cyclic or forward dependencies")
        known.add(node["id"])
    return data


def prepare(destination, product, profile):
    if (
        not (ROOT / "profiles" / profile / "profile.json").is_file()
        or Path(profile).name != profile
    ):
        raise ValueError("Unknown profile")
    destination.mkdir(parents=True, exist_ok=False)
    nodes = graph()["nodes"]
    run = {
        "schema": 1,
        "product": product,
        "owner": "GroepOnline/design-system",
        "extension": "chefgroep",
        "profile": profile,
        "nodes": {n["id"]: {"status": "pending", "evidence": []} for n in nodes},
    }
    (destination / "run.json").write_text(json.dumps(run, indent=2) + "\n")
    (destination / "BRIEF.md").write_text(
        f"# {product}\n\nUsers and job:\n\nReal states and constraints:\n\nPrimary decision:\n\nOne domain-derived signature and reason:\n\nToken/runtime owner:\n\nRoutes and verification:\n\nContext: {ROOT}/.agents/meta/chefgroep-design.md\n"
    )
    return run


def advance(destination, node_id, evidence, note):
    path = destination / "run.json"
    run = json.loads(path.read_text())
    nodes = {n["id"]: n for n in graph()["nodes"]}
    if node_id not in nodes:
        raise ValueError("Unknown chain node")
    for dep in nodes[node_id]["dependsOn"]:
        state = run["nodes"][dep]
        if state["status"] != "complete":
            raise ValueError("Unfinished dependency: " + dep)
        for item in state["evidence"]:
            source = Path(item["path"])
            if (
                not source.is_file()
                or hashlib.sha256(source.read_bytes()).hexdigest() != item["sha256"]
            ):
                raise ValueError("Dependency evidence changed: " + dep)
    if not evidence or not note.strip():
        raise ValueError("Evidence and a review note are required")
    files = []
    for item in evidence:
        source = item.resolve(strict=True)
        if not source.is_file():
            raise ValueError("Evidence must be a file")
        if source == path.resolve():
            raise ValueError("Run state cannot prove itself")
        files.append(
            {
                "path": str(source),
                "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
            }
        )
    # Reopening an upstream node invalidates downstream completion rather than
    # leaving a stale green chain after its supporting evidence changes.
    invalid = {node_id}
    for node in nodes.values():
        if set(node["dependsOn"]) & invalid:
            invalid.add(node["id"])
            run["nodes"][node["id"]] = {"status": "pending", "evidence": []}
    run["nodes"][node_id] = {
        "status": "complete",
        "evidence": files,
        "note": note,
        "at": datetime.now(timezone.utc).isoformat(),
    }
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(run, indent=2) + "\n")
    temporary.replace(path)
    return run


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("prepare")
    p.add_argument("destination", type=Path)
    p.add_argument("--product", required=True)
    p.add_argument("--profile", default="identity-spatial")
    p = sub.add_parser("advance")
    p.add_argument("destination", type=Path)
    p.add_argument("node")
    p.add_argument("--evidence", type=Path, nargs="+", required=True)
    p.add_argument("--note", required=True)
    args = parser.parse_args()
    try:
        result = (
            prepare(args.destination, args.product, args.profile)
            if args.command == "prepare"
            else advance(args.destination, args.node, args.evidence, args.note)
        )
    except (ValueError, OSError, KeyError) as error:
        parser.error(str(error))
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
