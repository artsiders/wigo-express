import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Trajets Disponibles | WIGO EXPRESS",
  description:
    "Trouvez et réservez votre prochain trajet en covoiturage premium au Canada.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-light min-h-screen text-dark flex flex-col pt-24">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
