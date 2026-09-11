#!/usr/bin/env python3
"""Build reproducible Signaal npm tarballs and checksums without publishing."""
from __future__ import annotations
import argparse, hashlib, json, os, shutil, subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLAN = json.loads((ROOT / "packages/release.json").read_text())

def main() -> None:
    ap=argparse.ArgumentParser(); ap.add_argument('--out', default='dist/runtime-packages'); args=ap.parse_args()
    out=(ROOT/args.out).resolve(); shutil.rmtree(out, ignore_errors=True); out.mkdir(parents=True)
    if os.environ.get('GITHUB_REF_TYPE') == 'tag':
        expected=f"signaal-v{PLAN['version']}"
        actual=os.environ.get('GITHUB_REF_NAME','')
        if actual != expected: raise SystemExit(f'tag/version mismatch: expected {expected}, got {actual}')
    subprocess.run(['python3','scripts/build-runtime-packages.py'], cwd=ROOT, check=True)
    subprocess.run(['python3','scripts/verify-runtime-packages.py'], cwd=ROOT, check=True)
    artifacts=[]
    for spec in PLAN['packages']:
        r=subprocess.run(['npm','pack','--pack-destination',str(out),'--json'],cwd=ROOT/spec['path'],check=True,capture_output=True,text=True)
        info=json.loads(r.stdout)[0]; tgz=out/info['filename']; digest=hashlib.sha256(tgz.read_bytes()).hexdigest()
        artifacts.append({'name':spec['name'],'version':PLAN['version'],'file':tgz.name,'sha256':digest})
    (out/'SHA256SUMS').write_text(''.join(f"{a['sha256']}  {a['file']}\n" for a in artifacts))
    sha=subprocess.run(['git','rev-parse','HEAD'],cwd=ROOT,check=True,capture_output=True,text=True).stdout.strip()
    manifest={'schema':1,'version':PLAN['version'],'channel':PLAN['channel'],'publish':False,'git_sha':sha,'built_at':datetime.now(timezone.utc).isoformat(),'artifacts':artifacts}
    (out/'release-manifest.json').write_text(json.dumps(manifest,indent=2)+"\n")
    print(f"release-bundle: {len(artifacts)} packages -> {out}")

if __name__ == '__main__': main()
