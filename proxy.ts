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

const { auth } = NextAuth(authConfig);

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isDriver = (req.auth?.user as any)?.isDriver === true;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  
  // Extraction du code de langue s'il y en a un pour vérifier les routes indépendamment de la locale
  const pathnameMatch = nextUrl.pathname.match(/^\/(fr|en)(\/.*)?$/);
  const pathnameWithoutLocale = pathnameMatch ? (pathnameMatch[2] || '/') : nextUrl.pathname;
  
  const currentLocale = pathnameMatch ? pathnameMatch[1] : routing.defaultLocale;

  const isPrivateRoute = privateRoutes.includes(pathnameWithoutLocale) || pathnameWithoutLocale.startsWith("/my-account") || pathnameWithoutLocale.startsWith("/profile");
  const isAuthRoute = authRoutes.includes(pathnameWithoutLocale);

  // Autoriser toutes les routes API internes
  if (isApiAuthRoute || nextUrl.pathname.startsWith('/api')) {
    return;
  }

  // Si on est sur une route liée à l'auth (login, register), rediriger si déjà connecté
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(`/${currentLocale}${DEFAULT_LOGIN_REDIRECT}`, nextUrl));
    }
    return intlMiddleware(req);
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page privée
  if (!isLoggedIn && isPrivateRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    
    return Response.redirect(
      new URL(`/${currentLocale}/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // Intercepter les non-conducteurs qui tentent d'accéder à /offer
  if (isLoggedIn && pathnameWithoutLocale.startsWith("/offer") && !isDriver) {
    return Response.redirect(new URL(`/${currentLocale}/become-driver?mode=become-driver`, nextUrl));
  }

  // Pour toutes les autres routes (non-API), applique le proxy de next-intl
  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
