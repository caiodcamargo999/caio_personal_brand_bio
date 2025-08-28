import { NextRequest, NextResponse } from 'next/server';
import { getLocale } from './i18n/request';

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already has a locale
  const pathnameHasLocale = /^\/[a-z]{2}(\/|$)/.test(pathname);

  if (pathnameHasLocale) {
    // Path already has a locale, continue
    return NextResponse.next();
  }

  // Get locale based on IP address
  const locale = await getLocale(request);
  
  // Special case: redirect root to /bio with detected locale
  if (pathname === '/') {
    const newUrl = new URL(`/${locale}/bio`, request.url);
    return NextResponse.redirect(newUrl);
  }
  
  // Redirect to locale-specific route for other paths
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
};
