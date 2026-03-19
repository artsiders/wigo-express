import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapToAd | Transformez vos images en Reels viraux",
  description: "Passez d'une simple image à une vidéo promotionnelle virale en quelques clics. Zéro compétence technique, zéro montage. Parfait pour TikTok et Instagram Reels.",
  icons: [
    {
      media: "(prefers-color-scheme: light)",
      url: "/light-favicon.ico",
      href: "/light-favicon.ico",
    },
    {
      media: "(prefers-color-scheme: dark)",
      url: "/dark-favicon.ico",
      href: "/dark-favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader showSpinner={false} color="#C3131C" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
