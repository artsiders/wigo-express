import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";

export default function MyTrajetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-light-300">
      <Navbar />
      <div className="flex-1 pt-32 pb-12">
        {children}
      </div>
      <Footer />
    </div>
  );
}
