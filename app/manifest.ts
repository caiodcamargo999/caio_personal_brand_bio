import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Caio de Camargo - AI Strategy Expert',
    short_name: 'Caio de Camargo',
    description: 'AI Strategy Expert & Real Estate Investment Opportunities',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#8b5cf6',
    orientation: 'portrait',
    icons: [
      {
        src: '/caio-profile-2026.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/caio-profile-2026.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
    categories: ['business', 'productivity', 'finance'],
    lang: 'en',
    dir: 'ltr',
  };
}
