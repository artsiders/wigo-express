"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IoCarOutline, IoPeopleOutline, IoCashOutline } from "react-icons/io5";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ConducteursPage() {
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
              Rentabilisez vos <span className="text-primary">trajets</span>.
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Rejoignez Wigo Express et partagez vos frais de route facilement. Vous conduisez, on se charge de remplir votre véhicule avec des passagers vérifiés.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6">
                <IoCarOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Proposez votre trajet</h3>
              <p className="text-gray-500 leading-relaxed">
                Indiquez votre itinéraire, la date, l'heure et le prix par place. C'est vous qui décidez de vos conditions de voyage : accepte automatique ou manuelle, nombre de bagages, etc.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6">
                <IoPeopleOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Acceptez les passagers</h3>
              <p className="text-gray-500 leading-relaxed">
                Vous recevez des demandes de réservation de la part de passagers dont le profil a été rigoureusement vérifié (identité, coordonnées). Vous avez le dernier mot sur qui monte à bord.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6">
                <IoCashOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Recevez votre paiement</h3>
              <p className="text-gray-500 leading-relaxed">
                Fini les annulations de dernière minute sans compensation. L'argent de chaque place réservée est sécurisé par avance et vous est automatiquement reversé après le trajet.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
