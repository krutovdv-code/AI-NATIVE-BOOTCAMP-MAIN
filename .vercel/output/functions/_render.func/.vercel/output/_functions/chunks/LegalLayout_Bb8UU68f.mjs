import { e as createComponent, l as renderHead, r as renderTemplate, n as renderSlot, h as createAstro } from './astro/server_CnF0x3wC.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                     */
/* empty css                                     */

const $$Astro = createAstro();
const $$LegalLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LegalLayout;
  const { title, date } = Astro2.props;
  return renderTemplate`<html lang="ru" data-astro-cid-dpidqgiz> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} — AI DRIVEN РАЗРАБОТКА</title><link rel="icon" type="image/svg+xml" href="/favicon.svg">${renderHead()}</head> <body data-astro-cid-dpidqgiz> <nav data-astro-cid-dpidqgiz> <a class="nav-logo" href="/" data-astro-cid-dpidqgiz>NAITION</a> <a class="nav-back" href="/" data-astro-cid-dpidqgiz>← На главную</a> </nav> <main data-astro-cid-dpidqgiz> <div class="doc-label" data-astro-cid-dpidqgiz>[LEGAL] // ДОКУМЕНТЫ</div> <h1 data-astro-cid-dpidqgiz>${title}</h1> ${date && renderTemplate`<div class="doc-date" data-astro-cid-dpidqgiz>Редакция от ${date}</div>`} <div class="doc-body" data-astro-cid-dpidqgiz> ${renderSlot($$result, $$slots["default"])} </div> </main> <footer data-astro-cid-dpidqgiz> <div data-astro-cid-dpidqgiz>© 2026 AI DRIVEN РАЗРАБОТКА</div> <div data-astro-cid-dpidqgiz>ИП Крутов Дмитрий Валерьевич · ИНН 772973192199</div> </footer> </body></html>`;
}, "E:/Git_Repos/AI-NATIVE-BOOTCAMP-MAIN/src/layouts/LegalLayout.astro", void 0);

export { $$LegalLayout as $ };
