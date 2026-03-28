import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const host = context.request.headers.get('host') || '';
  if (host === 'notboring.naition.ai' && context.url.pathname === '/') {
    return context.rewrite('/notboring/');
  }
  return next();
});
