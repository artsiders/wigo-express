import type { NextAuthConfig } from "next-auth";

// Exporte uniquement la base de la configuration compatible avec l'Edge Runtime (Vercel Edge, Middleware)
export default {
  providers: [],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        (session.user as any).isDriver = !!token.isDriver;
        (session.user as any).idVerified = !!token.idVerified;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.isDriver = !!(user as any).isDriver;
        token.idVerified = !!(user as any).idVerified;
      }
      if (trigger === "update" && session) {
        if (session.isDriver !== undefined) token.isDriver = session.isDriver;
        if (session.idVerified !== undefined) token.idVerified = session.idVerified;
      }
      return token;
    }
  },
} satisfies NextAuthConfig;
