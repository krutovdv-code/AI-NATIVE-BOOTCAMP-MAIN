import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Desktop
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:4321');
await page.waitForTimeout(1500);
await page.locator('nav').screenshot({ path: 'screen-hero-desktop.png' });

// Mobile
await page.setViewportSize({ width: 375, height: 812 });
await page.goto('http://localhost:4321');
await page.waitForTimeout(1000);

const rects = await page.evaluate(() => {
  const get = sel => { const el = document.querySelector(sel); if(!el) return null; const r = el.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}; };
  return { nav: get('nav'), navLeft: get('.nav-left'), navCenter: get('.nav-center'), navCta: get('.nav-cta') };
});
console.log('Mobile rects:', JSON.stringify(rects, null, 2));

await page.screenshot({ path: 'screen-hero-mobile.png', clip: { x: 0, y: 0, width: 375, height: 80 } });

await browser.close();
console.log('Done');
