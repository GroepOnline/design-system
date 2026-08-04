#!/usr/bin/env python3
"""Open devin.ai in a new Brave tab via CDP."""
import asyncio, json, urllib.request

async def main():
    # List targets
    targets = json.loads(urllib.request.urlopen('http://localhost:9222/json').read())
    # Find browser-level target (type == 'browser') for CDP
    browser_target = [t for t in targets if t.get('type') == 'browser']
    if not browser_target:
        print("No browser target"); return
    ws_url = browser_target[0]['webSocketDebuggerUrl']

    import websockets
    async with websockets.connect(ws_url) as ws:
        cid = [1]
        async def send_recv(method, params=None):
            msg = {'id': cid[0], 'method': method, 'params': params or {}}
            my_id = cid[0]; cid[0] += 1
            await ws.send(json.dumps(msg))
            while True:
                resp = json.loads(await asyncio.wait_for(ws.recv(), timeout=30))
                if resp.get('id') == my_id:
                    return resp

        # Create new tab targeting devin.ai
        result = await send_recv('Target.createTarget', {'url': 'https://app.devin.ai'})
        target_id = result['result']['targetId']
        print(f"Created target: {target_id}")

        # Get the WebSocket URL for the new target
        await asyncio.sleep(3)
        info = await send_recv('Target.getTargets')
        targets2 = info['result']['targetInfos']
        devin = [t for t in targets2 if t.get('targetId') == target_id]
        if devin:
            print(f"Target type: {devin[0].get('type')} type={devin[0].get('type')}")
            print(f"URL: {devin[0].get('url','?')}")
            print(f"Attached: {devin[0].get('attached', False)}")

asyncio.run(main())
