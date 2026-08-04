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
    { name: 'home-light', url: 'http://localhost:8085/?theme=&style=', w: 1440, h: 900 },
    { name: 'home-dark', url: 'http://localhost:8085/?theme=dark&style=', w: 1440, h: 900 },
    { name: 'gallery-light', url: 'http://localhost:8085/components/?theme=&style=', w: 1440, h: 900 },
    { name: 'gallery-dark', url: 'http://localhost:8085/components/?theme=dark&style=', w: 1440, h: 900 },
    { name: 'gallery-strak', url: 'http://localhost:8085/components/?style=strak', w: 1440, h: 900 },
    { name: 'gallery-strak-dark', url: 'http://localhost:8085/components/?theme=dark&style=strak', w: 1440, h: 900 },
    { name: 'components', url: 'http://localhost:8085/components/badge/index.html', w: 1440, h: 900 },
    { name: 'docs', url: 'http://localhost:8085/docs/index.html', w: 1440, h: 900 },
    { name: 'taste-site', url: 'http://localhost:8085/taste-site/index.html', w: 1440, h: 900 },
    { name: 'brain-site', url: 'http://localhost:8085/brain-site/index.html', w: 1440, h: 900 },
    { name: 'prototype', url: 'http://localhost:8085/prototype-v2.html', w: 1440, h: 900 },
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
