/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    optimizeCss: false, // Empêche Next.js de supprimer des classes Tailwind
  },
  images: {
    domains: ["images.pokemontcg.io"],
  },
};

export default nextConfig;
