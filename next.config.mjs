/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone", // ✅ Permet à Vercel de bien gérer les API routes
};

export default nextConfig;
