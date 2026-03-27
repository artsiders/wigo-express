"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IoEarthOutline, IoLeafOutline, IoCarSportOutline } from "react-icons/io5";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EcoPage() {
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
              Voyager pour la <span className="text-green-500">planète</span>.
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Chaque trajet partagé est un pas de plus vers un avenir plus vert. Rejoignez le mouvement vers la mobilité durable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                <IoCarSportOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Moins de trafic</h3>
              <p className="text-gray-500 leading-relaxed">
                Plus nous sommes à partager le même véhicule, moins il y a de voitures sur nos routes. C'est du temps de gagné pour tout le monde.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                <IoEarthOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Moins d'émissions</h3>
              <p className="text-gray-500 leading-relaxed">
                Le covoiturage permet de réaliser des millions de kilomètres sans polluer d'avantage, luttant ainsi contre le réchauffement climatique.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                <IoLeafOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Un monde plus vert</h3>
              <p className="text-gray-500 leading-relaxed">
                Contribuez à hauteur de vos déplacements en rendant la mobilité responsable, plus propre et plus respectueuse de l'environnement au quotidien.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
