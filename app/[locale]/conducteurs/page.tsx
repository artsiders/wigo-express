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
              <div className="relative w-full h-full min-h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/images/close-up-group-friends-traveling-car-concept-speed.webp"
                  alt="Conducteur au volant"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating element */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center">
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
      <section className="relative w-full bg-light z-20 pb-32 px-4 lg:px-6">
        <div className="container mx-auto max-w-7xl space-y-12">
          {/* STEP 1: Créez votre trajet */}
          <div className="w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-neutral-300 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden transition-transform duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)]">
            <div className="flex-1 w-full text-left order-2 lg:order-1 pt-6 lg:pt-0">
              <div className="w-14 h-14 bg-blue-50 text-primary flex items-center justify-center rounded-2xl mb-8 border border-blue-100">
                <IoCarOutline size={28} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">
                Créez votre
                <br />
                <span className="text-primary">trajet en 1 minute.</span>
              </h2>
              <p className="text-lg text-neutral-500 leading-relaxed mb-6 max-w-md">
                C'est simple et rapide. Fixez votre point de départ, votre
                destination, le prix par passager, et les options de voyage
                (bagages, musique, acceptation automatique ou manuelle).
              </p>
            </div>
            <div className="flex-1 w-full order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="bg-white p-6 lg:p-8 rounded-xl shadow-[0_15px_60px_rgba(0,0,0,0.06)] border border-neutral-200 w-full max-w-md flex flex-col">
                <div className="flex items-stretch mb-8 lg:mb-10 pt-2 lg:pt-4 px-2 lg:px-4">
                  <div className="relative flex flex-col items-center mr-6 lg:mr-8 shrink-0">
                    <div className="absolute top-3.5 bottom-3.5 w-[2px] bg-neutral-100"></div>
                    <div className="w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)] z-10 mb-10 lg:mb-12 mt-1.5"></div>
                    <div className="w-3.5 h-3.5 bg-dark rounded-full z-10 mt-auto mb-1.5"></div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-8 lg:gap-10">
                    <div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                        Départ
                      </div>
                      <div className="text-xl font-bold text-dark">
                        Montréal, QC
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                        Arrivée
                      </div>
                      <div className="text-xl font-bold text-dark">
                        Québec, QC
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-[#f8f9fa] p-5 rounded-2xl border border-neutral-100/50 mt-auto">
                  <span className="font-bold text-neutral-500 text-sm">
                    Prix par place
                  </span>
                  <span className="font-black text-xl text-primary">
                    25.00 $
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Choisissez vos passagers */}
          <div className="w-full bg-[#1c1c1c] text-white rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-neutral-800 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden transition-transform duration-500 hover:shadow-[0_35px_70px_rgba(0,0,0,0.5)]">
            <div className="flex-1 w-full flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`bg-[#2c2c2c] rounded-2xl p-4 flex items-center justify-between border border-[#3c3c3c] shadow-md transform transition-transform hover:translate-x-2 w-full max-w-md ${i === 2 ? "ml-0 lg:ml-6" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-neutral-600">
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
                      <p className="text-[10px] text-green-400 font-bold uppercase mt-1 flex items-center gap-1">
                        <IoShieldCheckmarkOutline className="w-3.5 h-3.5" />{" "}
                        Vérifié
                      </p>
                    </div>
                  </div>
                  <button className="bg-white text-dark font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-neutral-200 transition-colors shadow-sm">
                    Accepter
                  </button>
                </div>
              ))}
            </div>
            <div className="flex-1 w-full lg:pl-10 pb-6 lg:pb-0">
              <div className="w-14 h-14 bg-[#2c2c2c] text-white flex items-center justify-center rounded-2xl mb-8 border border-[#3c3c3c]">
                <IoPeopleOutline size={28} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">
                Choisissez <br />
                vos <span className="text-blue-400">passagers.</span>
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-8 max-w-md">
                Partez l'esprit libre. Vous avez le contrôle total sur qui monte
                à bord. Tous les passagers Wigo ont un profil vérifié, vous
                assurant des compagnons de route fiables.
              </p>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="w-full bg-linear-to-br from-green-50 to-white rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.05)] border border-green-100 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden transition-transform duration-500 hover:shadow-[0_25px_60px_rgba(16,185,129,0.1)]">
            <div className="flex-1 w-full text-left order-2 lg:order-1 pt-6 lg:pt-0">
              <div className="w-14 h-14 bg-green-100 text-green-600 flex items-center justify-center rounded-2xl mb-8 border border-green-200">
                <IoCashOutline size={28} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6 text-dark">
                Recevez votre <br />
                <span className="text-green-600">argent sans tracas.</span>
              </h2>
              <p className="text-lg text-neutral-500 leading-relaxed mb-8 max-w-md">
                Fini les annulations de dernière minute non payées ou la petite
                monnaie manquante. L'argent de chaque place est réservé en
                avance et atterrit directement sur votre solde après le trajet.
              </p>
              <Link
                href="/become-driver"
                className="btn-secondary w-max bg-white text-dark border-neutral-200 shadow-sm hover:border-neutral-300"
              >
                Ajouter un véhicule
              </Link>
            </div>
            <div className="flex-1 w-full flex justify-center lg:justify-end order-1 lg:order-2 relative z-10">
              <div className="bg-dark text-white rounded-2xl p-10 shadow-2xl w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-[30px] -mr-10 -mt-10"></div>
                <div className="text-left mb-10 border-b border-neutral-800 pb-8 relative z-10">
                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-3">
                    Solde Wigo
                  </p>
                  <h3 className="text-5xl font-black tracking-tighter">
                    150.00 $
                  </h3>
                </div>
                <div className="flex justify-between items-center bg-[#2c2c2c] p-5 rounded-2xl relative z-10 border border-[#3c3c3c]">
                  <div className="text-sm font-bold text-neutral-300">
                    Trajet MTL-QBC
                  </div>
                  <div className="font-black text-xl text-green-400">
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
