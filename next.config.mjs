/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // Garde les pages en mémoire pendant 25 secondes
    pagesBufferLength: 5, // Garde 5 pages en mémoire
  },
};

export default nextConfig;
