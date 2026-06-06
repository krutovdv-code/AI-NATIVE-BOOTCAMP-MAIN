import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 375, height: 812 });
await page.goto('http://localhost:4321');
await page.waitForTimeout(1200);
await page.screenshot({ path: 'screen-mobile-top.png', clip: { x: 0, y: 0, width: 375, height: 220 } });
await browser.close();
console.log('Done');
