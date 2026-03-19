import type { NextAuthConfig } from "next-auth";

// Exporte uniquement la base de la configuration compatible avec l'Edge Runtime (Vercel Edge, Middleware)
export default {
  providers: [],
} satisfies NextAuthConfig;
