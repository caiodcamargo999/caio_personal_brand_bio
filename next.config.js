/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, must-revalidate' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
  ],
};

module.exports = nextConfig;


