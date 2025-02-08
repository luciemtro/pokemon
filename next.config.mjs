/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // Garde les pages en mémoire pendant 25 secondes
    pagesBufferLength: 5, // Garde 5 pages en mémoire
  },
};

module.exports = {
  ...nextConfig,
  env: {
    NEXTAUTH_URL: "https://pokemon-lime-zeta.vercel.app", // URL de ton app en production
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET, // Assure-toi que cette variable est définie sur Vercel
  },
  async redirects() {
    return [
      {
        source: "/auth/login",
        destination: "/", // Redirige après connexion
        permanent: false,
      },
    ];
  },
};
