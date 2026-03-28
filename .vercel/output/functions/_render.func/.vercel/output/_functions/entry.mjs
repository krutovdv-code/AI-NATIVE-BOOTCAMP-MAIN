import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Nvm_Y5JP.mjs';
import { manifest } from './manifest_D6xOwrmw.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/legal/consent-marketing.astro.mjs');
const _page2 = () => import('./pages/legal/cookies.astro.mjs');
const _page3 = () => import('./pages/legal/oferta.astro.mjs');
const _page4 = () => import('./pages/legal/privacy.astro.mjs');
const _page5 = () => import('./pages/legal/terms.astro.mjs');
const _page6 = () => import('./pages/notboring.astro.mjs');
const _page7 = () => import('./pages/spasibo.astro.mjs');
const _page8 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/legal/consent-marketing.astro", _page1],
    ["src/pages/legal/cookies.astro", _page2],
    ["src/pages/legal/oferta.astro", _page3],
    ["src/pages/legal/privacy.astro", _page4],
    ["src/pages/legal/terms.astro", _page5],
    ["src/pages/notboring/index.astro", _page6],
    ["src/pages/spasibo.astro", _page7],
    ["src/pages/index.astro", _page8]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "b08c7993-f1e3-44b9-961a-5819acdd522c",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
