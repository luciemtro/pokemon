import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Configuration de NextAuth.js
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Implémentation de la logique d'autorisation
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await res.json();
        if (res.ok && data?.user) {
          return {
            id: data.user.id,
            email: credentials?.email,
            role: data.user.role,
          };
        }
        return null;
      },
    }),
  ],

  // Configuration des cookies pour NextAuth.js
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax", // Vous pouvez aussi essayer "strict" si cela ne fonctionne pas
        secure: process.env.NODE_ENV === "production", // En production, utilisez "secure"
      },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production", // Assurez-vous que "secure" est défini sur true en production
      },
    },
  },

  // Autres options (si nécessaire)
  session: {
    strategy: "jwt", // Utilisez JWT pour gérer les sessions
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // Assurez-vous que cette clé est définie dans votre fichier .env
};
