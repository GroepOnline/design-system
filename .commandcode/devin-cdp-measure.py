#!/usr/bin/env python3
"""CDP-based Devin UI measurements via Brave browser on port 9222."""
import asyncio, json, urllib.request

JS_MEASURE = """
(function() {
  function g(s) { return document.querySelector(s); }
  function info(el) {
    if (!el) return null;
    var r = el.getBoundingClientRect();
    var c = getComputedStyle(el);
    return {
      w: Math.round(r.width), h: Math.round(r.height),
      bg: c.backgroundColor, color: c.color,
      fs: c.fontSize, fw: c.fontWeight,
      radius: c.borderRadius,
      p: c.paddingTop + '/' + c.paddingRight + '/' + c.paddingBottom + '/' + c.paddingLeft
    };
  }
  var btns = document.querySelectorAll('button');
  var inputs = document.querySelectorAll('input, textarea');
  var links = document.querySelectorAll('a');
  return {
    url: location.href,
    title: document.title,
    viewport: {w: window.innerWidth, h: window.innerHeight},
    body: info(document.body),
    nav: info(g('nav')),
    main: info(g('main')),
    btn0: info(btns[0]),
    btn1: btns.length > 1 ? info(btns[1]) : null,
    input0: info(inputs[0]),
    link0: info(links[0]),
    avatar: info(g('img[alt*="avatar" i]') || g('.avatar') || g('[class*="Avatar"]')),
    badge: info(g('.badge')),
    btns: Array.from(btns).slice(0, 8).map(function(el) {
      return {text: (el.textContent || '').substring(0, 20), h: Math.round(el.getBoundingClientRect().height), bg: getComputedStyle(el).backgroundColor, radius: getComputedStyle(el).borderRadius};
    }),
    navitems: Array.from(document.querySelectorAll('nav a, nav button')).map(function(el) {
      return {h: Math.round(el.getBoundingClientRect().height), fs: getComputedStyle(el).fontSize};
    })
  };
})();
"""

async def measure():
    tabs = json.loads(urllib.request.urlopen('http://localhost:9222/json').read())
    devin_tabs = [t for t in tabs if 'devin.ai' in t.get('url', '') and 'login' not in t.get('url', '')]
    if not devin_tabs:
        print("No devin.ai tab found")
        return
    ws_url = devin_tabs[0]['webSocketDebuggerUrl']
    import websockets
    async with websockets.connect(ws_url) as ws:
        counter = [1]
        async def send_recv(msg):
            msg['id'] = counter[0]
            cid = counter[0]
            counter[0] += 1
            await ws.send(json.dumps(msg))
            while True:
                resp = json.loads(await ws.recv())
                if resp.get('id') == cid:
                    return resp
        msg = {'method': 'Runtime.evaluate', 'params': {'expression': JS_MEASURE, 'returnByValue': True}}
        result = await send_recv(msg)
        print(json.dumps(result, indent=2))

asyncio.run(measure())
