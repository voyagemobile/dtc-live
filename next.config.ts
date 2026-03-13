import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Proxy Ghost content images — article HTML contains /content/images/
  // URLs that Ghost stored when it was the frontend. Now that Next.js
  // serves dtc.live, these requests need to be forwarded to Ghost.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/content/images/:path*',
          destination: 'https://dtc-live.ghost.io/content/images/:path*',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
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
