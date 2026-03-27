"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import {
  IoCarOutline,
  IoPeopleOutline,
  IoCashOutline,
  IoChevronForward,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function ConducteursPage() {
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
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      const stackCards = gsap.utils.toArray(".stack-card") as HTMLElement[];
      stackCards.forEach((card, i) => {
        if (i !== stackCards.length - 1) {
          const nextCard = stackCards[i + 1];
          gsap.to(card, {
            scale: 0.95,
            opacity: 0.5,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: () => `top ${120 + i * 40 + card.offsetHeight}`,
              end: () => `top ${120 + (i + 1) * 40}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
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

      {/* HERO SECTION */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('/images/bg-texture.png')] opacity-30"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[70%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-6">
            <div className="text-left text-dark">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-tight hero-elem text-dark">
                Rentabilisez{" "}
                <span className="text-primary-gradient">vos trajets</span> sans
                effort.
              </h1>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed font-medium hero-elem">
                Divisez vos frais de route en partageant vos sièges libres. Wigo
                Express vous connecte avec des passagers certifiés. Votre
                véhicule, vos règles.
              </p>
              <div className="hero-elem">
                <Link
                  href="/become-driver"
                  className="btn-primary shadow-xl shadow-primary/30 flex w-fit items-center gap-2 text-lg px-8 py-4"
                >
                  Devenir Conducteur <IoChevronForward />
                </Link>
              </div>
            </div>

            <div className="relative hero-elem lg:h-full min-h-[400px]">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl transform rotate-3 scale-105" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/images/close-up-group-friends-traveling-car-concept-speed.webp"
                  alt="Conducteur au volant"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating element */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <IoCashOutline size={24} />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-bold uppercase">
                    Potentiel de revenus
                  </p>
                  <p className="text-xl font-black text-dark">
                    Jusqu'à 850&nbsp;$ / mois
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    selon le nombre de trajets et de passagers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NARRATIVE STEPS */}
      <section className="relative w-full bg-light z-20 pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* STEP 1 */}
          <div className="stack-card sticky top-28 z-10 w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral-100 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 mb-[10vh] overflow-hidden">
            <div className="flex-1">
              <div className="w-16 h-16 bg-blue-50 text-primary flex items-center justify-center rounded-xl mb-8 border border-blue-100 shadow-inner">
                <IoCarOutline size={32} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">
                Créez votre
                <br />
                <span className="text-primary">trajet en 1 minute.</span>
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                C'est simple et rapide. Fixez votre point de départ, votre
                destination, le prix par passager, et les options de voyage
                (bagages, musique, acceptation automatique ou manuelle).
              </p>
            </div>
            <div className="flex-1 w-full bg-light rounded-xl p-6 relative border border-black/5 shadow-inner min-h-[300px] flex items-center justify-center">
              <div className="bg-white p-6 rounded-xl shadow-xl border border-neutral-100 w-full max-w-sm relative z-10">
                <div className="mb-4">
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    Départ
                  </div>
                  <div className="text-lg font-black text-dark border-b border-light pb-2">
                    Montréal, QC
                  </div>
                </div>
                <div className="mb-6">
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    Arrivée
                  </div>
                  <div className="text-lg font-black text-dark">Québec, QC</div>
                </div>
                <div className="flex justify-between items-center bg-light p-3 rounded-xl border border-neutral-100">
                  <span className="font-bold text-neutral-600">
                    Prix par place
                  </span>
                  <span className="font-black text-xl text-primary">
                    25.00 $
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="stack-card sticky top-36 z-20 w-full bg-dark-900 text-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-neutral-800 p-8 lg:p-16 flex flex-col lg:flex-row-reverse items-center gap-12 mb-[10vh] overflow-hidden">
            <div className="flex-1 relative z-10 lg:pl-10">
              <div className="w-16 h-16 bg-white/10 text-white flex items-center justify-center rounded-xl mb-8 backdrop-blur-md border border-white/20">
                <IoPeopleOutline size={32} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">
                Choisissez <br />
                vos{" "}
                <span className="text-blue-300 drop-shadow-[0_0_15px_rgba(147,197,253,0.3)]">
                  passagers.
                </span>
              </h2>
              <p className="text-lg text-neutral-300 leading-relaxed mb-8">
                Partez l'esprit libre. Vous avez le contrôle total sur qui monte
                à bord. Tous les passagers Wigo ont un profil vérifié, vous
                assurant des compagnons de route fiables.
              </p>
            </div>

            <div className="flex-1 w-full relative z-10 flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/10 transform transition-transform hover:translate-x-2 ${i === 2 ? "ml-4" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/30">
                      <Image
                        src={`/images/avatar-${i}.webp`}
                        width={48}
                        height={48}
                        alt="Passager"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-white leading-tight">
                        Passager {i}
                      </p>
                      <p className="text-xs text-green-400 font-bold uppercase mt-1 flex items-center gap-1">
                        <IoShieldCheckmarkOutline /> Vérifié
                      </p>
                    </div>
                  </div>
                  <button className="bg-white text-dark font-bold text-xs px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors">
                    Accepter
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3 */}
          <div className="stack-card sticky top-44 z-30 w-full bg-linear-to-br from-secondary-600 to-secondary-800 text-white rounded-3xl shadow-[0_30px_80px_rgba(16,185,129,0.4)] border border-green-400/30 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-[60%] h-full bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex-1 relative z-10">
              <div className="w-16 h-16 bg-white/10 text-white flex items-center justify-center rounded-xl mb-8 backdrop-blur-md border border-white/20">
                <IoCashOutline size={32} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6 text-white">
                Recevez votre <br />
                <span className="text-green-200">argent sans tracas.</span>
              </h2>
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                Fini les annulations de dernière minute non payées ou la petite
                monnaie manquante. L'argent de chaque place est réservé en
                avance et atterrit directement sur votre solde après le trajet.
              </p>
              <Link
                href="/become-driver"
                className="btn-secondary w-max bg-white text-green-800 border-none hover:bg-neutral-100 shadow-xl"
              >
                Ajouter un véhicule
              </Link>
            </div>

            <div className="flex-1 w-full flex justify-center relative z-10">
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white rounded-xl p-8 shadow-2xl w-full max-w-sm">
                <div className="text-center mb-6 border-b border-white/20 pb-6">
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">
                    Solde Wigo
                  </p>
                  <h3 className="text-5xl lg:text-6xl font-black tracking-tighter">
                    150.00 $
                  </h3>
                </div>
                <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
                  <div className="text-sm font-bold opacity-80">
                    Trajet MTL-QBC
                  </div>
                  <div className="font-black text-xl text-green-300">
                    + 75.00 $
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
