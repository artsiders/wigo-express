import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WIGO EXPRESS | Premium Carpooling",
  description: "L'élégance et la technologie au service de votre trajet. Plateforme haut de gamme, sécurisée et ultra-rapide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased font-sans bg-black text-white`}
      >
        <NextTopLoader showSpinner={false} color="#4D80C4" />
        {children}
      </body>
    </html>
  );
}
