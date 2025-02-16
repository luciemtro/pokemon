import NextAuth from "next-auth";
import { authOptions } from "@/api/auth/authOptions"; // Import de la configuration

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
