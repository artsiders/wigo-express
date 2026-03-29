"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  IoShieldCheckmarkOutline,
  IoLockClosedOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function SecurityPage() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  useGSAP(
    () => {
      gsap.from(".hero-elem", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
      });

      gsap.utils.toArray(".feat-card").forEach((card: any, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        });
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="bg-light text-dark overflow-clip transition-colors duration-1000 min-h-screen"
    >
      <Navbar />

      {/* HERO SECTION - Dark Theme for Security */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden bg-dark-900 border-b border-neutral-800">
        <div className="absolute inset-0 z-0 bg-[url('/images/bg-texture.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-dark-900 to-transparent z-0"></div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-8 hero-elem">
            <IoShieldCheckmarkOutline className="text-sm" /> Tolérance Zéro
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight hero-elem text-white">
            Votre sécurité n'est pas <br />
            <span className="text-primary">une option.</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium hero-elem">
            Chaque identité est contrôlée. Chaque paiement est sécurisé. Chaque
            véhicule est évalué. Wigo Express déploie des standards de confiance
            dignes des plus grandes institutions.
          </p>
        </div>
      </section>

      {/* Trust Elements */}
      <section className="relative w-full bg-light z-20 py-24 px-6 -mt-10">
        <div className="container mx-auto max-w-6xl">
          {/* Main Visual ID Card */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center mb-24">
            <div className="flex-1 feat-card w-full">
              <div className="bg-white rounded-3xl p-2 shadow-2xl border border-black/5 transform -rotate-2 hover:rotate-0 transition-all duration-500 max-w-md mx-auto">
                <div className="bg-light rounded-2xl p-6 md:p-8 h-full relative overflow-hidden text-left flex flex-col justify-between border border-neutral-200/60">
                  <Image
                    src="/images/canada-flag.png"
                    alt="Canada"
                    width={36}
                    height={36}
                    className="object-contain mb-6"
                  />
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden relative shadow-lg">
                      <Image
                        src="/images/profile.jpg"
                        alt="ID"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-neutral-200 rounded-full w-full"></div>
                      <div className="h-4 bg-neutral-200 rounded-full w-3/4"></div>
                      <div className="flex items-center gap-1 mt-3 text-green-600 font-bold text-xs uppercase bg-green-100 px-2 py-1 rounded w-max">
                        <IoCheckmarkCircle size={14} /> ID Contrôlée
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 feat-card">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-dark mb-6 leading-tight">
                Nous savons <br />
                <span className="text-primary">qui prend le volant.</span>
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                Pour publier ou réserver un trajet, nous exigeons de nos membres
                une vérification approfondie à 3 niveaux :{" "}
                <b>Validation du numéro cellulaire</b>,{" "}
                <b>vérification de la pièce d'identité officielle</b> avec
                technologie anti-fraude, et <b>détection de visage</b> en
                direct.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <IoCheckmarkCircle className="text-green-500 w-6 h-6 shrink-0 mt-0.5" />
                  <span className="text-dark font-medium">
                    Contrôle biométrique des conducteurs
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <IoCheckmarkCircle className="text-green-500 w-6 h-6 shrink-0 mt-0.5" />
                  <span className="text-dark font-medium">
                    Bannissement immédiat et définitif des profils frauduleux
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {/* Feat 2 */}
            <div className="feat-card bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-neutral-100 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <IoLockClosedOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Paiements 100% Blindés
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Toutes nos transactions sont cryptées et gérées par Stripe, la
                référence mondiale en paiement en ligne. Pas de liquide, pas
                d'arnaques. Votre argent est conservé en lieu sûr jusqu'à la fin
                du voyage.
              </p>
            </div>

            {/* Feat 3 */}
            <div className="feat-card bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-neutral-100 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <IoAlertCircleOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Système d'avis incontestable
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Les membres ne peuvent s'évaluer qu'après avoir voyagé ensemble.
                Cela empêche les faux avis et garantit que vous lisez la
                véritable expérience d'autres membres authentiques.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
