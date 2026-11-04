#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIBRARY = ROOT / "library"
SOURCES = LIBRARY / "sources.json"
IMPORTED = LIBRARY / "imported.jsonl"
ITEM_RE = re.compile(r"^-\s+(?P<arg>@[^/\s]+/[^\s]+)\s+\((?P<type>[^)]+)\)(?:\s+—\s+(?P<desc>.*))?$")
DIRECTORY_URL = "https://ui.shadcn.com/r/registries.json"

def load_sources() -> list[dict[str, object]]:
    data=json.loads(SOURCES.read_text(encoding="utf-8"))
    return [row for row in data.get("sources",[]) if row.get("kind")=="shadcn-registry"]

def existing_rows() -> list[dict[str, object]]:
    rows=[]
    if not IMPORTED.exists(): return rows
    for line in IMPORTED.read_text(encoding="utf-8").splitlines():
        if line.strip(): rows.append(json.loads(line))
    return rows

def canonical_family(name:str, desc:str, domain:str) -> str:
    hay=f"{name} {desc}".lower()
    groups={
        "components":[("icon-button",("icon-button","icon button")),("split-button",("split-button","split button")),("button",("button",)),("card",("card",)),("textarea",("textarea",)),("input",("input",)),("select",("select",)),("checkbox",("checkbox",)),("radio",("radio",)),("switch",("switch",)),("toggle",("toggle",)),("slider",("slider",)),("tabs",("tabs",)),("accordion",("accordion",)),("tooltip",("tooltip",)),("popover",("popover",)),("dialog",("dialog","modal")),("drawer",("drawer","sheet")),("table",("table",)),("menu",("menu",)),("navigation",("navbar","navigation","nav ","sidebar")),("toast",("toast","notification")),("badge",("badge",)),("avatar",("avatar",)),("progress",("progress",)),("loader",("loader","loading")),("timeline",("timeline",)),("breadcrumb",("breadcrumb",)),("pagination",("pagination",)),("carousel",("carousel",)),("calendar",("calendar","date-picker","date picker")),("command",("command",)),("upload",("upload","dropzone")),("chart",("chart",)),("code",("code",))],
        "motion":[("cursor",("cursor",)),("scroll",("scroll",)),("spring",("spring",)),("marquee",("marquee",)),("typing",("typing",)),("morph",("morph",)),("shimmer",("shimmer",)),("reveal",("reveal",)),("hover",("hover",)),("ripple",("ripple",)),("drag",("drag",)),("tilt",("tilt",)),("parallax",("parallax",)),("text-motion",("text","number")),("animated-icon",("icon",)),("motion",("animate","animated","motion"))],
        "compositions":[("dashboard",("dashboard",)),("hero",("hero",)),("pricing",("pricing",)),("auth",("auth","login","sign-in","signup","sign-up")),("landing",("landing",)),("sidebar-layout",("sidebar","layout")),("ecommerce",("commerce","shop","product")),("settings",("settings",)),("profile",("profile",)),("docs",("docs","documentation")),("chat",("chat","conversation")),("gallery",("gallery",)),("page",("page","section","block"))],
        "3d":[("shader",("shader",)),("globe",("globe",)),("particle-field",("particle",)),("3d-card",("3d card","3d-card")),("webgl-scene",("webgl","three.js","threejs","3d"))],
        "transitions":[("morph",("morph",)),("slide",("slide",)),("fade",("fade",)),("wipe",("wipe",)),("scale",("scale",)),("transition",("transition",))],
    }
    for family,keys in groups.get(domain,[]):
        if any(k in hay for k in keys): return family
    return {"components":"misc-component","motion":"motion","compositions":"composition","3d":"webgl-scene","transitions":"transition"}[domain]

def classify(name:str, kind:str, desc:str) -> tuple[str,str,str]:
    hay=f"{name} {desc}".lower()
    if any(k in hay for k in ("three.js","threejs","webgl","shader","3d ","3d-")):
        domain="3d"
    elif any(k in hay for k in ("transition","page transition","route transition")):
        domain="transitions"
    elif kind in {"block","page"} or any(k in hay for k in ("dashboard","landing","pricing","hero","layout"," page","section")):
        domain="compositions"
    elif any(k in hay for k in ("animate","animated","motion","spring","hover","cursor","scroll","magnetic","marquee","morph","typing","shimmer","ripple")):
        domain="motion"
    else:
        domain="components"
    family=canonical_family(name,desc,domain)
    return domain,family,"animated" if domain in {"motion","transitions","3d"} else "still"

def fetch_registry(handle:str, limit:int) -> tuple[int,list[dict[str,str]]]:
    env={**os.environ,"NO_COLOR":"1","FORCE_COLOR":"0"}
    cmd=["npx","-y","shadcn@latest","list",handle,"--limit",str(limit)]
    total=0
    merged={}
    last_error=""
    for _attempt in range(3):
        with tempfile.NamedTemporaryFile(mode="w+", encoding="utf-8") as stdout_file:
            proc=subprocess.run(cmd,cwd=ROOT,text=True,stdout=stdout_file,stderr=subprocess.PIPE,env=env,timeout=180,check=False)
            stdout_file.seek(0)
            stdout=stdout_file.read()
        if proc.returncode:
            last_error=proc.stderr.strip() or stdout.strip()
            continue
        m=re.search(r"Found ([\d,]+) items in",stdout)
        if m: total=max(total,int(m.group(1).replace(",","")))
        for line in stdout.splitlines():
            match=ITEM_RE.match(line.strip())
            if match:
                item=match.groupdict(default="")
                merged[item["arg"]]=item
        if total and len(merged)>=total:
            break
    if not merged and last_error:
        raise RuntimeError(f"{handle}: {last_error}")
    return total,list(merged.values())


def update_source_counts(counts:dict[str,int]) -> None:
    payload=json.loads(SOURCES.read_text(encoding="utf-8"))
    for row in payload.get("sources",[]):
        handle=str(row.get("directory_handle", ""))
        if handle in counts:
            row["reported_items"]=counts[handle]
    SOURCES.write_text(json.dumps(payload,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")

def make_rows(source:dict[str,object], remote:list[dict[str,str]], total:int) -> list[dict[str,object]]:
    source_id=str(source["id"]); handle=str(source["directory_handle"])
    rows=[]
    unique={item["arg"]:item for item in remote}
    for item in unique.values():
        arg=item["arg"]; name=arg.split("/",1)[1]; kind=item["type"]; desc=item["desc"]
        domain,family,motion=classify(name,kind,desc)
        stem=re.sub(r"[^a-z0-9-]+","-",f"ext-{source_id}-{name}".lower()).strip("-")
        sid=f"{stem}-{hashlib.sha1(arg.encode()).hexdigest()[:7]}"
        rows.append({
            "id":sid,"domain":domain,"family":family,"style":"external","motion":motion,
            "title":name.replace("-"," ").title(),"description":f"{domain} item from {source.get('name', source_id)}",
            "tags":[source_id,kind,"imported",domain],
            "renderer":{"kind":"component","family":family,"style":"external","motion":motion},
            "status":"imported","source":f"shadcn:{source_id}","license_status":"review-required",
            "provenance":{"registry":handle,"argument":arg,"registry_type":kind,"directory":DIRECTORY_URL,"remote_total":total,"description_hash":hashlib.sha256(desc.encode()).hexdigest()[:12]},
        })
    return rows

def main() -> None:
    ap=argparse.ArgumentParser()
    ap.add_argument("--source",action="append",default=[],help="source id or @handle; repeatable")
    ap.add_argument("--priority",choices=["high","medium"],default=None)
    ap.add_argument("--limit",type=int,default=5000)
    ap.add_argument("--dry-run",action="store_true")
    args=ap.parse_args()
    sources=load_sources()
    if args.source:
        wanted=set(args.source); sources=[s for s in sources if str(s.get("id")) in wanted or str(s.get("directory_handle")) in wanted]
    elif args.priority:
        sources=[s for s in sources if s.get("priority")==args.priority]
    else:
        sources=[s for s in sources if s.get("priority")=="high"]
    if not sources: raise SystemExit("no matching shadcn registry sources")
    old=existing_rows(); selected_ids={str(s["id"]) for s in sources}
    keep=[r for r in old if str(r.get("source","")).removeprefix("shadcn:") not in selected_ids]
    fresh=[]
    live_counts={}
    for source in sources:
        handle=str(source["directory_handle"]); total,remote=fetch_registry(handle,args.limit)
        live_counts[handle]=total
        rows=make_rows(source,remote,total); fresh.extend(rows)
        print(f"{handle}: parsed {len(rows):,}/{total:,}")
    merged=keep+fresh
    seen=set(); dedup=[]
    for row in merged:
        key=str(row["id"])
        if key in seen: continue
        seen.add(key); dedup.append(row)
    if args.dry_run:
        print(f"dry-run: would write {len(dedup):,} imported items ({len(fresh):,} refreshed)"); return
    IMPORTED.write_text("".join(json.dumps(r,ensure_ascii=False)+"\n" for r in dedup),encoding="utf-8")
    update_source_counts(live_counts)
    print(f"wrote {len(dedup):,} imported items; refreshed {len(fresh):,}")

if __name__=="__main__":
    main()
