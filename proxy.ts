import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  privateRoutes,
} from "@/routes";

// 1. Initialisation de NextAuth
const { auth } = NextAuth(authConfig);
const intlMiddleware = createMiddleware(routing);

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  // Extension de type pour la clarté (idéalement à mettre dans un fichier dts)
  const user = req.auth?.user as { isDriver?: boolean } | undefined;
  const isDriver = user?.isDriver === true;

  /**
   * 2. GESTION DES CHEMINS ET LOCALES
   */
  const pathname = nextUrl.pathname;
  
  // Détecter si le chemin commence par une locale supportée (ex: /fr/...)
  const hasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const currentLocale = hasLocale 
    ? pathname.split('/')[1] 
    : routing.defaultLocale;

  // Chemin sans la locale (ex: /fr/profile -> /profile)
  const pathnameWithoutLocale = hasLocale
    ? `/${pathname.split('/').slice(2).join('/')}`
    : pathname;

  /**
   * 3. FILTRES DE SÉCURITÉ IMMÉDIATS
   */
  const isApiRoute = pathname.startsWith(apiAuthPrefix) || pathname.startsWith('/api');
  if (isApiRoute) return NextResponse.next();

  const isAuthRoute = authRoutes.includes(pathnameWithoutLocale);
  const isPrivateRoute = privateRoutes.some(route => 
    pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
  );

  // Helper pour rediriger proprement avec la locale
  const createRedirect = (path: string) => {
    return Response.redirect(new URL(`/${currentLocale}${path}`, nextUrl));
  };

  /**
   * 4. LOGIQUE DE REDIRECTION (ROBUSTESSE)
   */

  // Règle 1 : Rediriger l'utilisateur connecté s'il tente d'aller sur Login/Register
  if (isAuthRoute) {
    if (isLoggedIn) {
      return createRedirect(DEFAULT_LOGIN_REDIRECT);
    }
    return intlMiddleware(req);
  }

  // Règle 2 : Protéger les routes privées
  if (!isLoggedIn && isPrivateRoute) {
    let callbackUrl = pathname;
    if (nextUrl.search) callbackUrl += nextUrl.search;
    
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/${currentLocale}/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // Règle 3 : Le Driver ne peut PAS aller sur "devenir driver"
  if (isLoggedIn && isDriver && pathnameWithoutLocale.startsWith("/become-driver")) {
    // On le renvoie vers son dashboard ou l'accueil
    return createRedirect(DEFAULT_LOGIN_REDIRECT);
  }

  // Règle 4 : Seuls les drivers accèdent à /offer
  if (isLoggedIn && pathnameWithoutLocale.startsWith("/offer") && !isDriver) {
    return createRedirect("/become-driver?mode=become-driver");
  }

  // Règle 5 : Protection de l'admin
  const isAdminRoute = pathnameWithoutLocale.startsWith("/admin");
  const userRole = (req.auth?.user as any)?.role;
  const hasAdminAccess = userRole === "ADMIN" || userRole === "MODERATOR";

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const callbackUrl = pathname;
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);
      return Response.redirect(
        new URL(`/${currentLocale}/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      );
    }
    if (!hasAdminAccess) {
      return createRedirect("/");
    }
  }

  /**
   * 6. FINALISATION
   */
  return intlMiddleware(req);
});

export const config = {
  // Matcher optimisé pour exclure les assets statiques et images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)', '/', '/(api|trpc)(.*)'],
};