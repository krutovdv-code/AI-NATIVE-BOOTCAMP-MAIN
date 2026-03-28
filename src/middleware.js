import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const host = context.request.headers.get('host') || '';
  if (host.includes('notboring.naition.ai')) {
    const pathname = context.url.pathname;
    if (!pathname.startsWith('/notboring')) {
      const newPath = '/notboring' + (pathname === '/' ? '/' : pathname);
      return context.rewrite(newPath);
    }
  }
  return next();
});
