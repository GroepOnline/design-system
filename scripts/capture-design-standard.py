#!/usr/bin/env python3
"""Render local design artifacts with the existing lightweight headless browser.

A bounded test server/browser exists only for this command and closes on exit.
Auth preview uses an explicitly anonymous fixture; this is visual, not OAuth proof.
"""
import argparse
import hashlib
import html
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import re
import subprocess
import threading
from urllib.parse import urlsplit

ROOT=Path(__file__).resolve().parents[1]
PROBE='''setTimeout(async()=>{await document.fonts.ready;document.body.dataset.capture=JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth,fonts:document.fonts.status,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,animations:document.getAnimations().map(a=>({state:a.playState,iterations:a.effect.getTiming().iterations})),heading:document.querySelector('h1')?.textContent,images:[...document.images].map(i=>({loaded:i.complete&&i.naturalWidth>0,alt:i.alt}))});},1800);'''

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--out',type=Path,required=True);p.add_argument('--auth-dist',type=Path);args=p.parse_args()
    candidates=sorted((Path.home()/'.cache/ms-playwright').glob('chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell'))
    if not candidates:raise SystemExit('Existing lightweight headless renderer unavailable')
    browser=candidates[-1];args.out.mkdir(parents=True,exist_ok=True)
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
        def log_message(self,*a):pass
        def do_GET(self):
            route=urlsplit(self.path).path
            if route=='/__capture_probe.js':
                raw=PROBE.encode();self.send_response(200);self.send_header('Content-Type','application/javascript');self.end_headers();self.wfile.write(raw);return
            if args.auth_dist and route=='/v1/context':
                self.send_response(200);self.send_header('Content-Type','application/json');self.end_headers();self.wfile.write(b'{"kind":"anonymous","plane":"internal","environment":"development","signInAvailable":true}');return
            if args.auth_dist and (route.startswith('/assets/') or route in ('/', '/sign-in')):
                file=args.auth_dist/route.lstrip('/') if route.startswith('/assets/') else args.auth_dist/'index.html'
            else:file=ROOT/route.lstrip('/')
            if file.is_dir():file=file/'index.html'
            if file.is_file() and file.suffix=='.html':
                raw=file.read_text().replace('</body>','<script src="/__capture_probe.js"></script></body>')
                if '/__capture_probe.js' not in raw:raw+='<script src="/__capture_probe.js"></script>'
                self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.end_headers();self.wfile.write(raw.encode());return
            if args.auth_dist and route.startswith('/assets/') and file.is_file():
                self.send_response(200);self.send_header('Content-Type',self.guess_type(str(file)));self.end_headers();self.wfile.write(file.read_bytes());return
            super().do_GET()
    server=ThreadingHTTPServer(('127.0.0.1',0),Handler);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    cases=[('report','/reports/chefgroep-auth-2026-09-12/'),('template','/templates/identity-spatial/')]
    if args.auth_dist:cases.extend([('auth','/'),('auth-signin','/sign-in')])
    evidence=[]
    try:
        for name,path in cases:
            for label,w,h,reduced in [('desktop',1440,1000,False),('phone',390,844,False),('reduced',390,844,True)]:
                dest=args.out/f'{name}-{label}.png'
                cmd=[str(browser),'--no-sandbox','--disable-gpu',f'--window-size={w},{h}','--virtual-time-budget=2600','--run-all-compositor-stages-before-draw',f'--screenshot={dest}','--dump-dom']
                if reduced:cmd.append('--force-prefers-reduced-motion')
                cmd.append(f'http://127.0.0.1:{server.server_port}{path}')
                result=subprocess.run(cmd,capture_output=True,text=True,timeout=35,check=True)
                match=re.search(r'data-capture="([^"]+)"',result.stdout)
                if not match:raise RuntimeError('Missing rendered DOM evidence: '+name)
                facts=json.loads(html.unescape(match[1]));facts.update(case=name,viewport=label,file=dest.name,sha256=hashlib.sha256(dest.read_bytes()).hexdigest())
                evidence.append(facts)
                if facts['overflow'] or any(not i['loaded'] for i in facts['images']):raise RuntimeError('Render overflow or missing image: '+name+' '+label)
                if reduced and facts['animations']:raise RuntimeError('Reduced motion still animated: '+name)
                if not reduced and any(item['iterations'] is None or item['iterations'] > 1 for item in facts['animations']):
                    raise RuntimeError('Unbounded motion in rendered artifact: '+name)
        output=args.out/'chefgroep-design-report.pdf'
        subprocess.run([str(browser),'--no-sandbox','--disable-gpu','--no-pdf-header-footer','--virtual-time-budget=2600',f'--print-to-pdf={output}',f'http://127.0.0.1:{server.server_port}/reports/chefgroep-auth-2026-09-12/'],check=True,capture_output=True,timeout=35)
    finally:server.shutdown();server.server_close();thread.join(timeout=3)
    manifest={'scope':'local artifact rendering; anonymous auth fixture only; no live account/OAuth proof','cases':evidence,'pdf_sha256':hashlib.sha256(output.read_bytes()).hexdigest()}
    (args.out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print(json.dumps(manifest,indent=2))
if __name__=='__main__':main()
