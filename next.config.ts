import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compress: true,
  outputFileTracingIncludes: {
    '/**': ['./data/**/*'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        // Relax headers on keystatic admin routes
        source: '/keystatic(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/((?!keystatic).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com",
              "frame-src https://www.google.com",
              "connect-src 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
