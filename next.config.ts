import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
    ],
  },
}

export default nextConfig
