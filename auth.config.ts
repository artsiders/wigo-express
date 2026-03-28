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
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        (session.user as any).isDriver = !!token.isDriver;
        (session.user as any).idVerified = !!token.idVerified;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.picture = user.image;
        token.isDriver = !!(user as any).isDriver;
        token.idVerified = !!(user as any).idVerified;
      }
      if (trigger === "update" && session) {
        if (session.name !== undefined) token.name = session.name;
        if (session.image !== undefined) token.picture = session.image;
        if (session.isDriver !== undefined) token.isDriver = session.isDriver;
        if (session.idVerified !== undefined) token.idVerified = session.idVerified;
      }
      return token;
    }
  },
} satisfies NextAuthConfig;
