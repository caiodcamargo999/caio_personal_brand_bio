import { NextRequest, NextResponse } from 'next/server';
import { getLocale } from './i18n/request';

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  console.log('🚀 Middleware called for pathname:', pathname);
  console.log('🔍 URL:', request.url);

  // Check if the pathname already has a locale
  const pathnameHasLocale = /^\/[a-z]{2}(\/|$)/.test(pathname);
  console.log('📍 Has locale?', pathnameHasLocale);

  if (pathnameHasLocale) {
    // Check if it's just the locale without a path (e.g., /pt, /es, /en)
    if (/^\/[a-z]{2}$/.test(pathname)) {
      console.log(`🔄 Redirecting /${pathname.slice(1)} to /${pathname.slice(1)}/bio`);
      const newUrl = new URL(`${pathname}/bio`, request.url);
      return NextResponse.redirect(newUrl);
    }
    
    console.log('✅ Path already has locale with path, continuing...');
    return NextResponse.next();
  }

  // Get locale based on IP address
  const locale = await getLocale(request);
  console.log('Detected locale:', locale);
  
  // Special case 1: redirect root to /bio
  if (pathname === '/') {
    console.log('Redirecting root to /bio');
    const newUrl = new URL('/bio', request.url);
    return NextResponse.redirect(newUrl);
  }
  
  // Special case 2: redirect /bio to locale-specific /bio
  if (pathname === '/bio') {
    console.log(`Redirecting /bio to /${locale}/bio`);
    const newUrl = new URL(`/${locale}/bio`, request.url);
    return NextResponse.redirect(newUrl);
  }
  
  // Redirect to locale-specific route for other paths
  console.log(`Redirecting ${pathname} to /${locale}${pathname}`);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
};
