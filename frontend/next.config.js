/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Export as static files if needed
  trailingSlash: true, // Add trailing slashes to URLs
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;