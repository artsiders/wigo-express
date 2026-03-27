"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IoShieldCheckmarkOutline, IoLockClosedOutline, IoIdCardOutline } from "react-icons/io5";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SecurityPage() {
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
      
      <main className="grow pt-32 lg:pt-40 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-dark tracking-tight">
              Votre sécurité avant <span className="text-primary">tout</span>.
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Nous faisons de la sécurité de nos membres notre priorité absolue. Chaque trajet est protégé pour votre entière tranquillité.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <IoIdCardOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Profils Vérifiés</h3>
              <p className="text-gray-500 leading-relaxed">
                Pièces d'identité, numéros de téléphone et adresses e-mail de chaque membre sont contrôlés méthodiquement pour bâtir une communauté de confiance.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <IoShieldCheckmarkOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Avis Fiables</h3>
              <p className="text-gray-500 leading-relaxed">
                Les évaluations ne sont déposées qu'à la suite d'un voyage bel et bien réalisé. Vous savez toujours avec qui vous prenez la route.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <IoLockClosedOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Paiements Sécurisés</h3>
              <p className="text-gray-500 leading-relaxed">
                Notre plateforme protège toutes vos transactions. Les données bancaires sont cryptées pour éviter tout risque de fraude.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
