import { d as defineMiddleware, s as sequence } from './chunks/index_B7fdOKXs.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_1_50nFtW.mjs';
import 'piccolore';
import './chunks/astro/server_CnF0x3wC.mjs';
import 'clsx';

const onRequest$1 = defineMiddleware(async (context, next) => {
  const host = context.request.headers.get('host') || '';
  if (host === 'notboring.naition.ai' && context.url.pathname === '/') {
    return context.rewrite('/notboring/');
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
