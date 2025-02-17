import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await res.json();

        if (res.ok && data?.user) {
          const user = data.user;

          return {
            id: user.id,
            email: credentials?.email,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.id;
        token.role = user.role || "user";
      }
      console.log("🛠️ NextAuth JWT - Token reçu :", token);

      return token;
    },
    async session({ session, token }) {
      console.log("📦 Avant correction - Session NextAuth :", session);
      console.log("🛠️ Token NextAuth :", token);

      session.user = {
        id: token.id as string, // 🔥 On force l'ajout de l'ID utilisateur
        email: token.email,
        role: token.role as string,
      };

      console.log("✅ Après correction - Session NextAuth :", session);

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
