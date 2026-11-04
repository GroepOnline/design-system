#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
LIB=ROOT/"library"
IMPORTED=LIB/"imported.jsonl"
SOURCES=LIB/"sources.json"
URL="https://kinetics.colorion.co/"
SOURCE_ID="kinetics-colorion"

def slug(value:str)->str:
    return re.sub(r"[^a-z0-9]+","-",value.lower()).strip("-")

def family_for(name:str,desc:str)->str:
    hay=f"{name} {desc}".lower()
    groups=[("button",("button","hold to confirm")),("card",("card",)),("input",("input",)),("slider",("slider",)),("tabs",("tab ","tabs")),("accordion",("accordion",)),("toast",("toast",)),("drag",("drag",)),("ripple",("ripple",)),("cursor",("cursor","magnetic")),("scroll",("scroll",)),("loader",("loader","loading")),("text-motion",("text","number","digit","counter")),("menu",("menu",)),("modal",("modal","dialog")),("tooltip",("tooltip",)),("progress",("progress",)),("navigation",("nav","navigation")),("image",("image","photo")),("list",("list",)),("surface",("surface","panel","sheet"))]
    for family,keys in groups:
        if any(k in hay for k in keys): return family
    return "interaction"

def physics_kind(param:str)->str:
    m=re.match(r"([a-zA-Z-]+)",param.strip())
    return m.group(1).lower() if m else "spring"

def fetch_html()->str:
    req=Request(URL,headers={"User-Agent":"Mozilla/5.0 ChefGroepDesignLibrary/1.0"})
    with urlopen(req,timeout=30) as response:
        return response.read().decode("utf-8")

def parse_items(html:str)->list[dict[str,object]]:
    soup=BeautifulSoup(html,"html.parser")
    rows=[]
    for section in soup.select("section.section"):
        heading=section.select_one(".section-head h2")
        if not heading: continue
        category=heading.get_text(" ",strip=True)
        for card in section.select(".gallery > .card"):
            name_el=card.select_one(".name")
            if not name_el: continue
            name=name_el.get_text(" ",strip=True)
            desc_el=card.select_one(".desc")
            param_el=card.select_one(".card-param")
            desc=desc_el.get_text(" ",strip=True) if desc_el else ""
            param=param_el.get_text(" ",strip=True) if param_el else ""
            physics=physics_kind(param)
            digest=hashlib.sha1(f"{category}|{name}".encode()).hexdigest()[:7]
            rows.append({
                "id":f"ref-kinetics-{slug(name)}-{digest}",
                "domain":"motion","family":family_for(name,desc),"style":physics,"motion":physics,
                "title":name,"description":f"{category} spring interaction reference",
                "tags":["kinetics",slug(category),physics,"interactive-reference"],
                "renderer":{"kind":"motion","motion":physics},
                "status":"imported","source":f"reference:{SOURCE_ID}","license_status":"review-required",
                "provenance":{"url":URL+"#library","category":category,"parameter":param,"source_id":SOURCE_ID,"description_hash":hashlib.sha256(desc.encode()).hexdigest()[:12]},
            })
    return rows

def load_existing()->list[dict[str,object]]:
    if not IMPORTED.exists(): return []
    return [json.loads(line) for line in IMPORTED.read_text(encoding="utf-8").splitlines() if line.strip()]

def update_source_count(count:int)->None:
    data=json.loads(SOURCES.read_text(encoding="utf-8"))
    for row in data.get("sources",[]):
        if row.get("id")==SOURCE_ID: row["reported_items"]=count
    SOURCES.write_text(json.dumps(data,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")

def main()->None:
    fresh=parse_items(fetch_html())
    keep=[row for row in load_existing() if row.get("source")!=f"reference:{SOURCE_ID}"]
    by_id={str(row["id"]):row for row in [*keep,*fresh]}
    merged=sorted(by_id.values(),key=lambda row:(str(row.get("source","")),str(row.get("id",""))))
    IMPORTED.write_text("".join(json.dumps(row,ensure_ascii=False)+"\n" for row in merged),encoding="utf-8")
    update_source_count(len(fresh))
    print(f"Kinetics: imported {len(fresh):,} reference effects; total imported metadata {len(merged):,}")

if __name__=="__main__":
    main()
