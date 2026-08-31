import { NextRequest, NextResponse } from 'next/server';
import { getLocale } from './i18n/request';

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  console.log('🚀 Middleware called for pathname:', pathname);

  // Check if the pathname already has a locale
  const pathnameHasLocale = /^\/[a-z]{2}(\/|$)/.test(pathname);

  if (pathnameHasLocale) {
    console.log('✅ Path already has locale with path, continuing...');
    return NextResponse.next();
  }

  // Get locale based on IP address
  const locale = await getLocale(request);
  console.log('Detected locale:', locale);
  
  // Redirect to locale-specific route for paths without locale
  const newPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  console.log(`Redirecting ${pathname} to ${newPath}`);
  const newUrl = new URL(newPath, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and APIs
    '/((?!_next|api|favicon.ico|images|logos|manifest.webmanifest).*)',
  ],
};
