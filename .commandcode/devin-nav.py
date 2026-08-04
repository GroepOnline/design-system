#!/usr/bin/env python3
import asyncio, json, urllib.request, sys, base64, traceback

JS = """
(function() {
  function g(s) { return document.querySelector(s); }
  function info(el) {
    if (!el) return null;
    var r = el.getBoundingClientRect();
    var c = getComputedStyle(el);
    return {w: Math.round(r.width), h: Math.round(r.height), bg: c.backgroundColor, color: c.color, fs: c.fontSize, fw: c.fontWeight, radius: c.borderRadius, p: c.paddingTop+'/'+c.paddingRight+'/'+c.paddingBottom+'/'+c.paddingLeft};
  }
  var btns = document.querySelectorAll('button');
  var inputs = document.querySelectorAll('input, textarea');
  return {
    url: location.href, title: document.title,
    viewport: {w: window.innerWidth, h: window.innerHeight},
    body: info(document.body), nav: info(g('nav')), main: info(g('main')),
    btn0: info(btns[0]), btn1: btns.length > 1 ? info(btns[1]) : null,
    input0: info(inputs[0]),
    avatar: info(g('img[alt*="avatar" i]') || g('.avatar') || g('img[src*="avatar"]')),
    badge: info(g('.badge')),
    btns: Array.from(btns).slice(0, 12).map(function(e) {return {text: (e.textContent||'').substring(0,20), h: Math.round(e.getBoundingClientRect().height), w: Math.round(e.getBoundingClientRect().width), bg: getComputedStyle(e).backgroundColor, radius: getComputedStyle(e).borderRadius};}),
    headings: Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(function(e) {return {tag: e.tagName, text: (e.textContent||'').substring(0,40), fs: getComputedStyle(e).fontSize, fw: getComputedStyle(e).fontWeight};})
  };
})();
"""

async def measure(url, label):
    try:
        tabs = json.loads(urllib.request.urlopen('http://localhost:9222/json').read())
        devin = [t for t in tabs if 'devin.ai' in t.get('url','') and 'login' not in t.get('url','')]
        if not devin:
            print("No devin.ai tab"); return
        ws_url = devin[0]['webSocketDebuggerUrl']
        import websockets
        async with websockets.connect(ws_url) as ws:
            cid = [1]
            async def send_recv(method, params=None):
                msg = {'id': cid[0], 'method': method, 'params': params or {}}
                my_id = cid[0]; cid[0] += 1
                await ws.send(json.dumps(msg))
                while True:
                    resp = json.loads(await asyncio.wait_for(ws.recv(), timeout=30))
                    if resp.get('id') == my_id: return resp

            if url and url != 'stay':
                await send_recv('Page.navigate', {'url': url})
                await asyncio.sleep(5)

            result = await send_recv('Runtime.evaluate', {'expression': JS, 'returnByValue': True})
            val = result['result']['result']['value']

            vp = val['viewport']
            ss = await send_recv('Page.captureScreenshot', {
                'format': 'png', 'fromSurface': True,
                'clip': {'x': 0, 'y': 0, 'width': vp['w'], 'height': vp['h'], 'scale': 1}
            })
            if 'base64' in ss.get('result', {}):
                png = base64.b64decode(ss['result']['base64'])
                with open(f'references/devin-{label}.png', 'wb') as f:
                    f.write(png)
                print(f"Screenshot: references/devin-{label}.png ({len(png)} bytes)")

            out = {'url': val['url'], 'title': val['title'], 'viewport': val['viewport'], 'measurements': val}
            with open(f'.commandcode/devin-{label}.json', 'w') as f:
                json.dump(out, f, indent=2)

            print(f"== {val['title']} @ {val['url']}")
            print(f"  viewport: {vp['w']}x{vp['h']}")
            print(f"  body: bg={val['body']['bg']} text={val['body']['color']} fs={val['body']['fs']}")
            print(f"  nav: w={val['nav']['w']} h={val['nav']['h']}")
            print(f"  main: w={val['main']['w']} h={val['main']['h']}")
            b0 = val.get('btn0')
            if b0:
                print(f"  btn0: h={b0.get('h')} w={b0.get('w')} r={b0.get('radius')}")
            i0 = val.get('input0')
            if i0:
                print(f"  input0: fs={i0.get('fs')} h={i0.get('h')}")
            print(f"  avatar: {val.get('avatar')}")
            print(f"  badge: {val.get('badge')}")
            headings = val.get('headings') or []
            for h in headings[:3]:
                print(f"  {h['tag']}: {h['text']} | fs={h['fs']} fw={h['fw']}")
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()

asyncio.run(measure(
    sys.argv[1] if len(sys.argv) > 1 else 'stay',
    sys.argv[2] if len(sys.argv) > 2 else 'page'))
