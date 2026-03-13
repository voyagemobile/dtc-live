import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Redirect old Ghost /tag/ URLs to /category/ (Ghost used /tag/ natively)
  async redirects() {
    return [
      {
        source: '/tag/:slug',
        destination: '/category/:slug',
        permanent: true,
      },
    ]
  },
  // Edge-level proxy for Ghost media — faster than serverless route handlers.
  // Handles any /content/images/ or /content/media/ URLs that weren't rewritten
  // at the API layer. Vercel caches these at the edge.
  async rewrites() {
    return [
      {
        source: '/content/images/:path*',
        destination: 'https://dtc-live.ghost.io/content/images/:path*',
      },
      {
        source: '/content/media/:path*',
        destination: 'https://dtc-live.ghost.io/content/media/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      // Self-hosted Ghost instances on *.ghost.io
      {
        protocol: 'https',
        hostname: '**.ghost.io',
      },
      // Ghost default static asset host
      {
        protocol: 'https',
        hostname: 'static.ghost.org',
      },
      // Unsplash — Ghost's default stock-image integration
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Ghost content images served from dtc.live domain
      {
        protocol: 'https',
        hostname: 'dtc.live',
      },
      // Ghost storage (video thumbnails)
      {
        protocol: 'https',
        hostname: 'storage.ghost.io',
      },
    ],
  },
}

export default nextConfig
