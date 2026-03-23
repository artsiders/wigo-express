import React, { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  IoSearchOutline,
  IoLocationOutline,
  IoMapOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoArrowForwardOutline,
  IoShieldCheckmarkOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import RideSearchWidget from "../search/RideSearchWidget";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function HeroSection() {
  const t = useTranslations("HomePage");
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // 1. Initial Hero Stagger
      const tl = gsap.timeline();
      tl.fromTo(
        ".hero-text-elem",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        },
      ).fromTo(
        ".search-widget",
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out" },
        "-=0.8",
      );

      // 2. Parallax Basics
      gsap.utils.toArray(".float-parallax").forEach((el: any) => {
        const speed = el.dataset.speed || 1;
        gsap.to(el, {
          yPercent: -20 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section"),
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // 2.5. Floating UI Cards Parallax & Entrance
      gsap.utils.toArray(".floating-card").forEach((card: any, index) => {
        const yOffset = index === 0 ? 120 : index === 1 ? -100 : 80;
        const xOffset = index === 0 ? -60 : index === 1 ? 60 : -40;
        const rotation = index === 0 ? -8 : index === 1 ? 10 : -6;

        gsap.fromTo(
          card,
          { y: yOffset, x: xOffset, rotation: rotation * 2, scale: 0.8 },
          {
            y: 0,
            x: 0,
            rotation: rotation,
            scale: 1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: ".hero-floating-img",
              start: "top 85%",
              end: "bottom 30%",
              scrub: 1.5,
            },
          },
        );
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative bg-[url(/images/bg-texture.png)] min-h-screen pt-36 md:pt-40 pb-20 px-6 flex flex-col items-center justify-center"
    >
      {/* Abstract shapes for premium feel */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-10 left-10 w-[30vw] h-[30vw] bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="hero-text-elem uppercase relative text-center text-4xl font-black sm:text-5xl lg:text-7xl max-w-7xl container mx-auto justify-center leading-tight md:mt-16 mb-8">
          {t("heroTitle1")}
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-br from-primary to-primary-900">
            {t("heroTitle2")} <br />
            {t("heroTitle3")}
          </span>
        </h1>

        <p className="hero-text-elem text-lg md:text-xl opacity-80 font-medium mb-8 max-w-2xl leading-relaxed">
          {t("heroSubtitle")}
        </p>

        {/* Web Search Widget - The Core Tool */}
        <div className="flex flex-col items-start capitalize text-lg gap-2 mb-10 w-full max-w-5xl relative z-50">
          <p className="ml-4 bg-white py-1.5 px-5 rounded-full shadow-sm border border-neutral-100 flex items-center justify-center gap-2 text-dark font-bold text-sm">
            <IoSearchOutline size={16} />
            trouver un trajet
          </p>
          <RideSearchWidget />
        </div>

        {/* Dashboard Preview & Floating UI Cards Container */}
        <div className="relative w-full max-w-7xl mt-18 z-20">
          {/* Main Web Dashboard Visual Preview */}
          <div
            className="hero-floating-img w-full h-[400px] md:h-[680px] bg-white rounded-3xl border-t border-x shadow-[0_0_80px_rgba(0,0,0,0.05)] border-neutral-100 overflow-hidden relative float-parallax z-10"
            data-speed="0.5"
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/close-up-group-friends-traveling-car-concept-speed.webp"
                alt="Capture d'écran conceptuelle (Web UI) d'un tableau de bord de covoiturage premium WIGO EXPRESS, affichant une carte interactive claire, des listes de trajets élégantes et des profils vérifiés, tons blanc et bleu."
                fill
                className="object-cover object-center opacity-90"
              />
            </div>
          </div>

          {/* Floating UI Card 1: Verified Profile */}
          <div className="floating-card absolute -left-4 md:-left-12 lg:-left-20 top-[-2%] z-20 bg-white/90 backdrop-blur-xl p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-white/60 w-56 md:w-64 text-left hidden sm:block">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-md shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                  fill
                  alt="Driver"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm md:text-base font-bold text-dark leading-tight mb-1">
                  {t("verifiedProfile")}
                </h4>
                <p className="text-[10px] md:text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                  <IoShieldCheckmarkOutline className="text-base text-green-600 " />{" "}
                  {t("wigoIdentity")}
                </p>
              </div>
            </div>
            <div className="bg-light rounded-xl p-3 flex justify-between items-center border border-black/5 shadow-inner">
              <span className="text-[10px] md:text-xs text-neutral-500 font-medium">
                {t("globalRating")}
              </span>
              <span className="text-[10px] md:text-xs font-black text-dark flex items-center gap-1">
                4.9/5 ★
              </span>
            </div>
          </div>

          {/* Floating UI Card 2: Instant Payment */}
          <div className="floating-card absolute -right-4 md:-right-8 lg:-right-16 top-[15%] lg:top-[25%] z-30 bg-dark/95 backdrop-blur-xl p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_30px_60px_rgba(37,99,235,0.15)] border border-neutral-800/80 w-48 md:w-56 text-left hidden sm:block">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <IoWalletOutline className="text-lg md:text-xl" />
              </div>
              <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">
                {t("wigoPayment")}
              </h4>
            </div>
            <p className="text-3xl md:text-4xl font-black text-white mb-2 leading-none">
              45
              <span className="text-xl md:text-2xl text-neutral-500">
                .00 $
              </span>
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <p className="text-[10px] md:text-xs text-neutral-400 font-medium">
                {t("receivedJustNow")}
              </p>
            </div>
          </div>

          {/* Floating UI Card 3: Route Match */}
          <div className="floating-card absolute left-[5%] lg:left-[8%] bottom-[5%] lg:bottom-[8%] z-30 bg-white/90 backdrop-blur-xl p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-white/60 w-56 md:w-64 text-left hidden sm:block">
            <div className="bg-primary-500/10 mb-4 text-primary-500 text-[9px] md:text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
              {t("perfectMatch")}
            </div>

            <div className="space-y-4 relative ml-1">
              <div className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-0.5 bg-neutral-200"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary ring-4 ring-white shadow-sm shrink-0"></div>
                <p className="text-sm md:text-base font-bold text-dark">
                  Montréal, QC
                </p>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-dark ring-4 ring-white shadow-sm shrink-0"></div>
                <p className="text-sm md:text-base font-bold text-dark">
                  Québec, QC
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
