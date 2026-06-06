import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 800, height: 600 });
await page.goto('http://localhost:4321');
await page.waitForTimeout(1000);
await page.screenshot({ path: 'screen-tablet-nav.png', clip: { x: 0, y: 0, width: 800, height: 80 } });
await browser.close();
console.log('Done');
