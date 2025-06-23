/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,
  },
  webpack: (config: any) => {
    return config;
  },
};

module.exports = nextConfig;