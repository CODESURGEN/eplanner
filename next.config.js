/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for static export to Firebase Hosting
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  // App Router is stable in Next.js 14, no experimental flag needed
  webpack: (config, { isServer }) => {
    // Handle undici module parsing issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig 