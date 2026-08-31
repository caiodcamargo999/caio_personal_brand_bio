import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://caiodcamargo.com';
  const locales = ['en', 'pt', 'es'];
  
  const routes = [
    '/bio',
    '/strategy-consultation',
    '/real-estate-opportunities',
    '/ai-solutions',
    '/about',
    '/contact'
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Add locale-specific routes
  locales.forEach(locale => {
    routes.forEach(route => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '/bio' ? 1.0 : 0.8,
      });
    });
  });

  // Add root redirect route
  sitemap.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  });

  return sitemap;
}
