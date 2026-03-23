"use client";
import React from "react";
import BaseNotFound from "./[locale]/not-found";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";

// This acts as a global 404 wrapper without layout when accessing unknown urls outside locales
export default function NotFound() {
  return (
    <html lang="fr">
      <body className="antialiased font-sans bg-black text-white">
        <NextIntlClientProvider messages={{
          NotFound: {
            title1: "Vous avez fait",
            title2: "fausse route.",
            desc: "La destination que vous cherchez n'existe pas ou a été déplacée. Pas de panique, le prochain point de départ n'est pas très loin.",
            backHome: "Retour à l'accueil",
            goBack: "Revenir en arrière"
          }
        }} locale="fr">
          <BaseNotFound />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
