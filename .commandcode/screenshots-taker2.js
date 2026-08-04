const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outDir = '/home/joep/design-system/.scratchshots';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const pages = [
    { name: 'settings-light', url: 'http://localhost:8085/components/settings/index.html', w: 1440, h: 900 },
    { name: 'table-light', url: 'http://localhost:8085/components/table/index.html', w: 1440, h: 900 },
    { name: 'nav-light', url: 'http://localhost:8085/components/nav/index.html', w: 1440, h: 900 },
    { name: 'button-light', url: 'http://localhost:8085/components/button/index.html', w: 1440, h: 900 },
    { name: 'taste-site', url: 'http://localhost:8085/taste-site/index.html', w: 1440, h: 900 },
    { name: 'taste-site-dark', url: 'http://localhost:8085/taste-site/index.html?theme=dark', w: 1440, h: 900 },
    { name: 'brain-site', url: 'http://localhost:8085/brain-site/index.html', w: 1440, h: 900 },
    { name: 'brain-site-dark', url: 'http://localhost:8085/brain-site/index.html?theme=dark', w: 1440, h: 900 },
    { name: 'docs-light', url: 'http://localhost:8085/docs/index.html', w: 1440, h: 900 },
    { name: 'docs-dark', url: 'http://localhost:8085/docs/index.html?theme=dark', w: 1440, h: 900 },
  ];

  for (const p of pages) {
    try {
      const page = await browser.newPage({ viewport: { width: p.w, height: p.h } });
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(outDir, p.name + '.png'), fullPage: true });
      console.log('✓ ' + p.name);
      await page.close();
    } catch(e) {
      console.log('✗ ' + p.name + ': ' + e.message);
    }
  }

  await browser.close();
  console.log('Done');
})();
