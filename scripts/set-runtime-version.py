#!/usr/bin/env python3
"""Update the Signaal runtime package set to one semver without publishing."""
from __future__ import annotations
import argparse, json, re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PLAN_PATH=ROOT/'packages/release.json'
SEMVER=re.compile(r'^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?$')

def main() -> None:
    ap=argparse.ArgumentParser(); ap.add_argument('version'); args=ap.parse_args()
    if not SEMVER.fullmatch(args.version): raise SystemExit(f'invalid semver: {args.version}')
    plan=json.loads(PLAN_PATH.read_text()); plan['version']=args.version
    PLAN_PATH.write_text(json.dumps(plan,indent=2)+'\n')
    names={p['name'] for p in plan['packages']}
    for spec in plan['packages']:
        path=ROOT/spec['path']/'package.json'; data=json.loads(path.read_text()); data['version']=args.version
        for field in ('dependencies','peerDependencies','optionalDependencies'):
            deps=data.get(field,{})
            for name in names:
                if name in deps: deps[name]=args.version
        path.write_text(json.dumps(data,indent=2)+'\n')
        print(f"version: {spec['name']} -> {args.version}")

if __name__ == '__main__': main()
