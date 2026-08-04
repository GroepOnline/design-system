#!/usr/bin/env python3
"""Navigate Devin to a URL, wait, measure, screenshot."""
import asyncio, json, urllib.request, sys, os

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
      fs_em: c.fontSize,
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
    avatar: info(g('img[alt*="avatar" i]') || g('.avatar') || g('img[src*="avatar"]')),
    badge: info(g('.badge, [class*="pill"], [class*="chip"], [class*="status"]')),
    btns: Array.from(btns).slice(0, 12).map(function(el) {
      return {text: (el.textContent || '').substring(0, 20), h: Math.round(el.getBoundingClientRect().height), w: Math.round(el.getBoundingClientRect().width), bg: getComputedStyle(el).backgroundColor, radius: getComputedStyle(el).borderRadius};
    }),
    navitems: Array.from(document.querySelectorAll('nav a, nav button')).map(function(el) {
      return {text: (el.textContent || '').substring(0, 25), h: Math.round(el.getBoundingClientRect().height), fs: getComputedStyle(el).fontSize};
    })
  };
})();
"""

async def measure(url, label):
    tabs = json.loads(urllib.request.urlopen('http://localhost:9222/json').read())
    devin_tabs = [t for t in tabs if 'devin.ai' in t.get('url', '') and 'login' not in t.get('url', '')]
    if not devin_tabs:
        print("No devin.ai tab found")
        return
    ws_url = devin_tabs[0]['webSocketDebuggerUrl']
    import websockets
    async with websockets.connect(ws_url) as ws:
        counter = [1]
        async def send_recv(method, params=None):
            msg = {'id': counter[0], 'method': method, 'params': params or {}}
            cid = counter[0]
            counter[0] += 1
            await ws.send(json.dumps(msg))
            while True:
                resp = json.loads(await ws.recv())
                if resp.get('id') == cid:
                    return resp

        if url:
            await send_recv('Page.navigate', {'url': url})
            await asyncio.sleep(3)
            await send_recv('Page.stopLoading')

        await asyncio.sleep(2)
        result = await send_recv('Runtime.evaluate', {'expression': JS_MEASURE, 'returnByValue': True})
        val = result['result']['result']['value']

        await send_recv('Page.captureScreenshot', {'format': 'png', 'captureBeyondViewport': True})
        # Full page screenshot
        ss = await send_recv('Page.captureSnapshot', {'format': 'png'})

        out = {'url': val['url'], 'title': val['title'], 'data': val}
        with open(f'.commandcode/devin-{label}.json', 'w') as f:
            json.dump(out, f, indent=2)

        # Save full-page screenshot as PNG via CDP
        ss_resp = await send_recv('Page.captureScreenshot', {
            'format': 'png',
            'captureBeyondViewport': True,
            'fromSurface': True
        })
        if 'base64' in ss_resp.get('result', {}):
            import base64
            png = base64.b64decode(ss_resp['result']['base64'])
            with open(f'references/devin-{label}.png', 'wb') as f:
                f.write(png)
            print(f"Screenshot: references/devin-{label}.png ({len(png)} bytes)")

        print(f"Saved: .commandcode/devin-{label}.json")
        print(json.dumps(val, indent=2)[:2000])

if __name__ == '__main__':
    url = sys.argv[1] if len(sys.argv) > 1 else None
    label = sys.argv[2] if len(sys.argv) > 2 else 'page'
    asyncio.run(measure(url, label))
