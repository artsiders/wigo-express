import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-light-400 font-sans">
      <Navbar />
      <div className="flex-1 pt-32 pb-16">
        {children}
      </div>
      <Footer />
    </div>
  );
}
