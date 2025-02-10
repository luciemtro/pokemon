/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    optimizeCss: false, // Empêche Next.js de supprimer des classes Tailwind
  },
};

export default nextConfig;
