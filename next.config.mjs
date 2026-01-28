/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["src"]
  },
  experimental: {
    appDir: true
  }
};

export default nextConfig;

