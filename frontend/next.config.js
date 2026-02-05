/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed static export to enable SSR for authentication middleware
  reactStrictMode: true,
  swcMinify: true,

  // Proxy API requests to the backend server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;