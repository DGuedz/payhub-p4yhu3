import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: { unoptimized: true, formats: ['image/avif', 'image/webp'] },

  modularizeImports: {
    'lucide-react': { transform: 'lucide-react/dist/esm/icons/{{member}}' },
  },

  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/documentation/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' }],
      },
      {
        source: '/payment',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=3600' }],
      },
      {
        source: '/demo',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=3600' }],
      },
      {
        source: '/xrpl-tools',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=3600' }],
      },
    ]
  },

  outputFileTracingRoot: path.join(__dirname, '..'),
  staticPageGenerationTimeout: 120,
}

export default nextConfig
