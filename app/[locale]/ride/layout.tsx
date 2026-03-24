import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Détails du Trajet | WIGO EXPRESS",
  description:
    "Consultez les détails de ce trajet en covoiturage premium au Canada.",
};

export default function RideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-light min-h-screen text-dark flex flex-col pt-24">
      <Navbar />
      <div className="flex-1 pt-2 md:pt-8">{children}</div>
      <Footer />
    </div>
  );
}
