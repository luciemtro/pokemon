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

        const text = await res.text(); // Log de la réponse brute
        console.log("Response text from login API:", text);

        let data;
        try {
          data = JSON.parse(text); // Essaie de la convertir en JSON
        } catch (err) {
          console.error("Error parsing JSON:", err);
          return null; // Retourne null si la réponse n'est pas un JSON valide
        }

        if (res.ok && data?.user) {
          const user = data.user;

          return {
            id: user.id,
            email: credentials?.email,
            role: user.role,
          };
        }

        return null; // Si les credentials ne sont pas valides, retourne null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.id;
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
  secret: process.env.NEXTAUTH_SECRET, // Utilisation de NEXTAUTH_SECRET
};
