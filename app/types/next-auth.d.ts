// types/next-auth.d.ts

import NextAuth from "next-auth";

// Étendre les types de NextAuth
declare module "next-auth" {
  interface User {
    id: string;
    role: string; // Ajout de la propriété 'role'
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
    };
  }

  interface JWT {
    id: string;
    role: string;
  }
}
