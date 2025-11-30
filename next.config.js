/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ['pages', 'components', 'lib', 'prisma']
  }
};

module.exports = nextConfig;
