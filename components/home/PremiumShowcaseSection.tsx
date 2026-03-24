import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function PremiumShowcaseSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ".dark-mode-section",
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () =>
          gsap.to("body", {
            backgroundColor: "var(--color-dark)",
            color: "#ffffff",
            duration: 0.8,
          }),
        onLeaveBack: () =>
          gsap.to("body", {
            backgroundColor: "var(--color-light)",
            color: "var(--color-dark)",
            duration: 0.8,
          }),
        onEnterBack: () =>
          gsap.to("body", {
            backgroundColor: "var(--color-dark)",
            color: "#ffffff",
            duration: 0.8,
          }),
        onLeave: () =>
          gsap.to("body", {
            backgroundColor: "var(--color-light)",
            color: "var(--color-dark)",
            duration: 0.8,
          }),
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container as any}
      id="voyageur"
      className="dark-mode-section bg-[url(/images/bg-texture.png)] relative py-32 px-6 flex flex-col items-center text-center overflow-hidden border-t border-white/5"
    >
      <div className="container mx-auto z-10">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
            Ça n'arrive qu'en <br />
            <span className="gradient-text lg:transition-colors lg:duration-300 text-primary-gradient">
              Wigo Express...
            </span>
          </h2>
          <p className="text-neutral-400 text-lg md:text-xl font-light max-w-3xl mx-auto">
            Voyagez dans de meilleures conditions. Sur Wigo, vous choisissez le
            véhicule qui vous convient, et vous savez exactement dans quel
            confort vous allez rouler.
          </p>
        </div>

        {/* Web Data Grid / Showcase */}
        <div className="w-full max-w-6xl mx-auto bg-dark rounded-[2.5rem] squircle border border-white/10 p-6 md:p-10 shadow-2xl relative text-left flex flex-col lg:flex-row gap-10 items-center">
          {/* Text / Data part */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-xl">
                  Trajet : Montréal → Québec
                </h3>
                <span className="bg-primary/20 text-primary font-bold text-xs px-3 py-1 rounded-full">
                  Proposé aujourd'hui
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-neutral-800 rounded-full overflow-hidden relative border-2 border-neutral-700">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                    alt="Conducteur vérifié"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">
                    Marc D.{" "}
                    <span className="text-neutral-400 font-normal">★ 4.9</span>
                  </p>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">
                    <IoShieldCheckmarkOutline className="inline mr-1" />
                    Profil vérifié
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                <div>
                  <p className="text-neutral-400 text-xs mb-1">Véhicule</p>
                  <p className="text-white font-bold px-3 py-1 bg-white/10 rounded-lg inline-block text-sm">
                    Tesla Model 3 • Noire
                  </p>
                </div>
                <div className="text-right">
                  <strong className="text-3xl font-black text-white">
                    45 $
                  </strong>
                  <p className="text-neutral-500 text-xs">/ passager</p>
                </div>
              </div>
            </div>

            <button className="bg-white text-black font-bold py-4 px-8 w-full rounded-xl shadow-lg hover:bg-neutral-200 transition-colors uppercase text-xs tracking-widest">
              Réserver 1 Siège
            </button>
          </div>

          {/* IMAGE PLACEHOLDER: Premium Car Profile aligned with Web content */}
          <div className="w-full lg:w-1/2 relative h-[30vh] lg:h-full min-h-[300px] overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-b lg:bg-linear-to-r from-dark/95 via-dark/20 to-transparent z-10 pointer-events-none"></div>
            <Image
              src="/images/wigo-express-red-card.jpg"
              alt="Vue d'une Tesla Model 3 noire, style studio premium sombre. Véhicule typique du covoiturage haut de gamme proposé sur la plateforme."
              fill
              className="object-cover transition-transform duration-1000 ease-out rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
