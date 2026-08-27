// Layout regression check for the MINIMAL STEEL reskin.
// Encodes two Phase C acceptance criteria that are otherwise invisible,
// because body{overflow-x:clip} hides both failures instead of scrolling them:
//
//   1. nothing is clipped horizontally at any width
//   2. every display-type element can fit its own longest WORD in its column
//      (Russian compounds are the binding constraint, not line length)
//
//   npm run dev            # in another terminal
//   node scripts/check-layout.mjs                    # defaults to /demo
//   node scripts/check-layout.mjs / /teams /special  # any set of paths
//
// Exits non-zero on failure so it can gate a commit.

import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const PATHS = process.argv.slice(2).length ? process.argv.slice(2) : ['/demo'];
const WIDTHS = [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920];

// Elements whose type is large enough that a single long word can overflow.
const DISPLAY = [
  '.hero__title', '.section__title', '.lesson__title', '.card__title',
  '.fact__num', '.pricing__amount', '.faq__q', '.footer__col-title',
];

const browser = await chromium.launch();
let failures = 0;

for (const path of PATHS) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const consoleErrors = [];
    const failedRequests = [];
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
    page.on('requestfailed', (r) => failedRequests.push(r.url()));

    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const result = await page.evaluate((displaySelectors) => {
      const clipped = [];
      const wordOverflow = [];

      // 1. anything whose content is wider than its own box, where the overflow
      //    is not scrollable (so the user simply never sees the cut-off part)
      for (const el of document.querySelectorAll('*')) {
        if (el.clientWidth === 0) continue;
        if (el.scrollWidth - el.clientWidth <= 1) continue;
        const ox = getComputedStyle(el).overflowX;
        if (ox === 'visible' || ox === 'clip') {
          clipped.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} ${el.clientWidth}->${el.scrollWidth}`);
        }
      }

      // 2. longest word vs available column, measured in the element's own type
      const probe = document.createElement('span');
      probe.style.cssText = 'position:absolute;white-space:nowrap;visibility:hidden;top:-9999px';
      document.body.appendChild(probe);

      for (const sel of displaySelectors) {
        for (const el of document.querySelectorAll(sel)) {
          if (!el.clientWidth) continue;
          const cs = getComputedStyle(el);
          probe.style.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily}`;
          probe.style.letterSpacing = cs.letterSpacing;
          probe.style.textTransform = cs.textTransform;

          // Measure the longest UNBREAKABLE run, the way the browser breaks:
          // whitespace and <br> are boundaries, and so is a hyphen (a line may
          // break after it). Anything inside .nowrap is one run by definition.
          const runs = [];
          const walk = (node) => {
            for (const child of node.childNodes) {
              if (child.nodeType === 3) {
                for (const t of child.textContent.split(/\s+/).filter(Boolean)) {
                  runs.push({ text: t, unbreakable: false });
                }
              } else if (child.nodeName === 'BR') {
                // <br> is a break opportunity, not a joiner — emit nothing
              } else if (child.nodeType === 1) {
                if (getComputedStyle(child).whiteSpace.startsWith('nowrap')) {
                  runs.push({ text: (child.textContent || '').trim(), unbreakable: true });
                } else {
                  walk(child);
                }
              }
            }
          };
          walk(el);

          let longest = '';
          let longestW = 0;
          for (const run of runs) {
            // a hyphen in a normally-wrapping run is a break opportunity;
            // inside .nowrap it is not
            const pieces = run.unbreakable ? [run.text] : run.text.split(/(?<=-)/);
            for (const piece of pieces) {
              if (!piece) continue;
              probe.textContent = piece;
              const w = probe.getBoundingClientRect().width;
              if (w > longestW) { longestW = w; longest = piece; }
            }
          }
          // padding shrinks the usable column
          const inner = el.clientWidth
            - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0);
          if (longestW > inner + 0.5) {
            wordOverflow.push(`${sel} "${longest}" ${Math.round(longestW)}px > ${Math.round(inner)}px`);
          }
        }
      }
      probe.remove();

      return {
        doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        clipped: [...new Set(clipped)].slice(0, 8),
        wordOverflow: [...new Set(wordOverflow)].slice(0, 8),
      };
    }, DISPLAY);

    const problems = [];
    if (result.doc > 0) problems.push(`page scrolls horizontally by ${result.doc}px`);
    if (result.clipped.length) problems.push(`clipped: ${result.clipped.join(' | ')}`);
    if (result.wordOverflow.length) problems.push(`word too wide: ${result.wordOverflow.join(' | ')}`);
    if (consoleErrors.length) problems.push(`console: ${consoleErrors.slice(0, 3).join(' | ')}`);
    if (failedRequests.length) problems.push(`failed requests: ${failedRequests.slice(0, 3).join(' | ')}`);

    if (problems.length) {
      failures++;
      console.log(`FAIL ${path} @ ${width}px`);
      for (const p of problems) console.log(`     ${p}`);
    } else {
      console.log(`ok   ${path} @ ${width}px`);
    }
    await page.close();
  }
}

await browser.close();
console.log(failures ? `\n${failures} failing width(s)` : '\nall clean');
process.exit(failures ? 1 : 0);
