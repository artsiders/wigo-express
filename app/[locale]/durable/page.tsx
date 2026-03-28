"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import {
  IoEarthOutline,
  IoLeafOutline,
  IoCarSportOutline,
  IoChevronForward,
} from "react-icons/io5";

import { useSession } from "next-auth/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function EcoPage() {
  const container = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

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
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      const cards = gsap.utils.toArray(".eco-card");
      cards.forEach((card: any, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "back.out(1.1)",
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
      className="bg-[#f2fcf7] text-dark overflow-clip transition-colors duration-1000 min-h-screen"
    >
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 bg-[url('/images/bg-texture.png')] mix-blend-overlay"></div>

        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-widest rounded-full mb-6 hero-elem">
            <IoLeafOutline className="text-lg" /> Notre impact
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-dark leading-tight hero-elem">
            Un siège vide est une{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-emerald-800">
              opportunité manquée.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium hero-elem">
            Nos routes sont pleines de voitures à moitié vides. Ensemble,
            réduisons les embouteillages, la pollution, et donnons un sens à
            chaque kilomètre parcouru.
          </p>
        </div>
      </section>

      {/* CARDS SECTION */}
      <section className="relative w-full z-20 py-22 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="eco-card bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.05)] border border-green-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <IoCarSportOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4">
                Moins de véhicules
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                Le covoiturage massif permet de retirer littéralement des
                milliers de voitures individuelles de nos autoroutes chaque
                mois. Résultat : Moins de bouchons pour tout le monde.
              </p>
            </div>

            {/* Card 2 */}
            <div className="eco-card bg-secondary-800 text-white p-10 rounded-3xl border border-green-500/50 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-[20px]"></div>
              <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <IoEarthOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Réduction du CO2</h3>
              <p className="text-green-50 leading-relaxed mb-6">
                En optimisant l'occupation d'un véhicule, on divise par trois ou
                quatre l'empreinte carbone par passager comparativement à des
                trajets solitaires.
              </p>
              <div className="bg-black/20 p-4 rounded-xl flex items-center justify-between backdrop-blur-sm">
                <span className="font-bold text-sm">Objectif 2030</span>
                <span className="font-black text-xl">- 5 000 Tonnes</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="eco-card bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.05)] border border-green-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <IoLeafOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4">
                Un monde plus vert
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                Rejoignez le mouvement de la mobilité responsable. Que vous
                soyez conducteur ou passager, vous posez chaque jour un acte
                fort pour l'avenir de l'environnement.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center eco-card">
            <h2 className="text-3xl lg:text-4xl font-black text-dark tracking-tighter mb-8">
              Faites partie du{" "}
              <span className="text-emerald-700">changement.</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {!session && (
                <Link href="/register" className="btn-secondary">
                  S'inscrire maintenant <IoChevronForward />
                </Link>
              )}
              <Link href="/search?searchOpen=true" className="btn-outlined">
                Trouver un trajet
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
