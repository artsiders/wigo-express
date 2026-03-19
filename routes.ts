/**
 * Un tableau des routes privées qui nécessitent une authentification.
 * Seules ces routes redirigeront vers /login si l'utilisateur n'est pas connecté.
 * @type {string[]}
 */
export const privateRoutes = [
  "/my-account",
];

/**
 * Un tableau des routes utilisées pour l'authentification.
 * Ces routes redirigent les utilisateurs connectés vers /my-account.
 * @type {string[]}
 */
export const authRoutes = [
  "/login",
  "/register",
  "/error",
];

/**
 * Le préfixe pour les routes d'API d'authentification Next-Auth.
 * Ces routes doivent toujours être publiques car Next-Auth les gère en interne.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Le chemin de redirection par défaut après la connexion
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/my-account";
