import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
	// A list of all locales that are supported
	locales: ['en', 'pt', 'es'],

	// Used when no locale matches
	defaultLocale: 'en',

	// Always show the locale in the URL
	localePrefix: 'always'
});

export const config = {
	// Match only internationalized pathnames
	matcher: ['/', '/(pt|es|en)/:path*']
};
