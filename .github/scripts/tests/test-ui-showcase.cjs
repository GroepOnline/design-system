'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const yml = readFileSync(join(__dirname, '../../workflows/ui-showcase-reusable.yml'), 'utf8');
const block = yml.split('          script: |\n')[1];
assert.ok(block, 'github-script block exists');
const js = block.split('\n').map(l => l.startsWith('            ') ? l.slice(12) : l).join('\n');
async function check(files, body, event = true) {
  const failures = [];
  const core = {
    setFailed(message) { failures.push(message); }, info() {},
    summary: { addHeading() { return this; }, addRaw() { return this; }, async write() {} }
  };
  const context = {
    repo: { owner: 'GroepOnline', repo: 'example' },
    payload: { pull_request: event ? { number: 404, body } : undefined }
  };
  const github = {
    rest: { pulls: { listFiles() {} } },
    async paginate(_fn, args) {
      assert.equal(args.pull_number, 404);
      return files.map(filename => ({ filename }));
    }
  };
  await vm.runInNewContext('(async () => {\n' + js + '\n})()', { context, core, github }, { timeout: 2000 });
  return failures;
}
const shot = '## UI showcase\n\n![actual running screen](https://github.com/user-attachments/assets/12345678-1234-4321-8888-000000000000)';
test('non-UI PR is exempt', async () => assert.deepEqual(await check(['src/api/auth.ts'], ''), []));
test('SVG provider change requires screenshot', async () => assert.match((await check(['gui/public/provider-icons/openai.svg'], '## UI showcase\nSee gallery.html'))[0], /no embedded screenshot/));
test('SVG provider change with image passes', async () => assert.deepEqual(await check(['gui/public/provider-icons/openai.svg'], shot), []));
test('CSS change without section fails', async () => assert.match((await check(['src/theme.css'], ''))[0], /missing a/));
test('local committed screenshot passes', async () => assert.deepEqual(await check(['src/Screen.tsx','docs/screenshots/screen.png'], '## UI showcase\n![capture](docs/screenshots/screen.png)'), []));
test('uncommitted image path fails', async () => assert.match((await check(['src/Screen.tsx'], '## UI showcase\n![capture](docs/screenshots/screen.png)'))[0], /no embedded screenshot/));
test('SVG alone is not screenshot', async () => assert.match((await check(['gui/icons/test.svg'], '## UI showcase\n![logo](gui/icons/test.svg)'))[0], /no embedded screenshot/));
test('screenshot only change ignored', async () => assert.deepEqual(await check(['docs/screenshots/after.png'], ''), []));
test('SwiftUI file requires screenshot', async () => assert.ok((await check(['mobile/screens/Home.swift'], '')).length > 0));
test('missing PR event fails closed', async () => assert.match((await check(['src/App.jsx'], shot, false))[0], /pull_request event/));
test('loose icon SVG requires screenshot', async () => assert.ok((await check(['icons/logo.svg'], '')).length > 0));
test('JavaScript UI component requires screenshot', async () => assert.ok((await check(['src/components/nav.js'], '')).length > 0));
test('backend-only TypeScript unaffected', async () => assert.deepEqual(await check(['api/handler.ts'], ''), []));
