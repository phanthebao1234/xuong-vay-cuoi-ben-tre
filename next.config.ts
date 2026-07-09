import type { NextConfig } from 'next'

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    '[Xuong Vay Cuoi] NEXT_PUBLIC_API_URL is required for production builds. Set it in the Vercel dashboard.',
  )
}

const nextConfig: NextConfig = {
  async rewrites() {
    // Proxy /media/* to the shared Django backend in development.
    // In production, media files live on Cloudflare R2 with absolute CDN URLs.
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/media/:path*',
          destination: 'http://localhost:8000/media/:path*',
        },
      ]
    }
    return []
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        // Development placeholders only — remove before content launch
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        // Production: shared Cloudflare R2 public CDN (same bucket as FOXIE)
        protocol: 'https',
        hostname: 'pub-4b45369859cb496d95edad074d1b5110.r2.dev',
        pathname: '/**',
      },
      {
        // Development: shared Django backend local
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
