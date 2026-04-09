import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const host = context.request.headers.get('host') || '';
  if (host.includes('notboring.naition.ai')) {
    const pathname = context.url.pathname;
    const isStatic =
      pathname.startsWith('/_astro') ||
      pathname.startsWith('/favicon') ||
      /\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|css|js|webp|avif)$/i.test(pathname);

    if (!isStatic && !pathname.startsWith('/notboring')) {
      return context.rewrite('/notboring' + (pathname === '/' ? '/' : pathname));
    }
  }
  return next();
});
