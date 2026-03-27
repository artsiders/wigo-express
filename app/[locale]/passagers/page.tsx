"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IoSearchOutline, IoShieldCheckmarkOutline, IoWalletOutline } from "react-icons/io5";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PassagersPage() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <div
      ref={container}
      className="bg-light text-dark overflow-clip transition-colors duration-1000 min-h-screen flex flex-col"
    >
      <Navbar />
      
      <main className="flex-grow pt-32 lg:pt-40 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-dark tracking-tight">
              Voyagez en toute <span className="text-primary">sérénité</span>.
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Découvrez comment trouver, réserver et profiter de vos trajets en toute simplicité avec Wigo Express. Des profils vérifiés et un paiement 100% sécurisé.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6">
                <IoSearchOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Cherchez votre trajet</h3>
              <p className="text-gray-500 leading-relaxed">
                Indiquez votre destination, votre point de départ et votre date. Nous vous montrons instantanément les meilleurs trajets disponibles au meilleur prix, proposés par des conducteurs fiables.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6">
                <IoShieldCheckmarkOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Réservez en confiance</h3>
              <p className="text-gray-500 leading-relaxed">
                Consultez le profil du conducteur, ses avis et sa voiture. Chaque membre de notre communauté est soigneusement vérifié pour garantir votre sécurité lors de chaque voyage.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6">
                <IoWalletOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Paiement sécurisé</h3>
              <p className="text-gray-500 leading-relaxed">
                Payez votre place en ligne par carte. Pas besoin d'argent liquide le jour du départ. Le montant est conversé de façon sécurisée jusqu'à la fin de votre trajet.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
