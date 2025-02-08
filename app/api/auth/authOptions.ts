import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt"; // Utilisation du type JWT de NextAuth

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Appel à l'API pour vérifier les credentials
          const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );

          const text = await res.text();
          console.log("Response text from login API:", text);

          let data;
          try {
            data = JSON.parse(text); // Tentative de parse
          } catch (err) {
            console.error("Error parsing JSON:", err);
            return null; // Retourne null si la réponse n'est pas un JSON valide
          }

          if (res.ok && data?.user) {
            // Si l'utilisateur est valide, retourne l'objet utilisateur
            return {
              id: data.user.id,
              email: credentials?.email,
              role: data.user.role, // Assure-toi que 'role' est dans la réponse
            };
          }

          return null; // Retourne null si les credentials sont incorrects
        } catch (error) {
          console.error("API Error:", error);
          return null; // En cas d'erreur de l'API
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Utilisation de JWT pour la gestion de session
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      // Ajout des données utilisateur dans le token
      if (user) {
        token.id = user.id;
        token.role = user.role || "user"; // Définit "user" comme valeur par défaut si aucun rôle
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // Ajout des informations du token dans la session
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Assure-toi que cette clé est définie dans ton .env
};
