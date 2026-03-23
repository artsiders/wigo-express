"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";
import {
  IoSearchOutline,
  IoWalletOutline,
  IoMapOutline,
  IoLocationOutline,
  IoShieldCheckmarkOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoArrowForwardOutline,
  IoStar,
  IoIdCardOutline,
} from "react-icons/io5";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function WigoExpress() {
  const container = useRef<HTMLDivElement>(null);
  const t = useTranslations("HomePage");
  const tFooter = useTranslations("Footer");

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08, // un scroll encore plus onctueux
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
        // Organic random-like offsets based on index
        const yOffset = index === 0 ? 120 : index === 1 ? -100 : 80;
        const xOffset = index === 0 ? -60 : index === 1 ? 60 : -40;
        const rotation = index === 0 ? -8 : index === 1 ? 10 : -6;

        gsap.fromTo(
          card,
          {
            y: yOffset,
            x: xOffset,
            rotation: rotation * 2,
            scale: 0.8,
          },
          {
            y: 0,
            x: 0,
            rotation: rotation,
            scale: 1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: ".hero-floating-img",
              start: "top 85%", // Starts a bit before the image enters fully
              end: "bottom 30%",
              scrub: 1.5, // Smooth scrubbing parallax effect
            },
          },
        );
      });

      // 3. Staggered Simple Reveals
      gsap.utils.toArray(".reveal-fade").forEach((elem: any) => {
        gsap.fromTo(
          elem,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 85%",
              once: true,
            },
          },
        );
      });

      // 4. 🌟 NARRATIVE SCROLL: STACKING CARDS
      const stackCards = gsap.utils.toArray(".stack-card") as HTMLElement[];
      stackCards.forEach((card, i) => {
        if (i !== stackCards.length - 1) {
          // Don't scale the last card
          const nextCard = stackCards[i + 1];
          gsap.to(card, {
            scale: 0.92,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              // Starts exactly when the next card's top touches the bottom of the sticky card
              start: () => `top ${96 + i * 32 + card.offsetHeight}`,
              // Ends when the next card reaches its own sticky point
              end: () => `top ${96 + (i + 1) * 32}`,
              scrub: true,
              invalidateOnRefresh: true, // Recalculates smoothly if window resizes
            },
          });
        }
      });

      // 5. Dark Mode Transition
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

      // 6. Footer Parallax Reveal
      gsap.fromTo(
        ".footer-content",
        { y: "-30%" },
        {
          y: "0%",
          ease: "none",
          scrollTrigger: {
            trigger: ".footer-wrapper",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="bg-light text-dark overflow-clip transition-colors duration-1000"
    >
      {/* PREMIUM MULTI-LAYERED NAVBAR (Extracted to component) */}
      <Navbar />

      {/*  EPIC HERO SECTION */}
      <section className="relative bg-[url(/images/bg-texture.png)] min-h-screen pt-36 md:pt-40 pb-20 px-6 flex flex-col items-center justify-center">
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

          <p className="hero-text-elem text-lg md:text-xl opacity-80 font-medium mb-16 max-w-2xl leading-relaxed">
            {t("heroSubtitle")}
          </p>

          {/* Web Search Widget - The Core Tool */}
          <div className="search-widget w-full max-w-5xl bg-white p-3 md:p-4 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.06)] border border-neutral-100 flex flex-col lg:flex-row items-center gap-3 mb-10">
            <div className="flex-1 w-full bg-light-400 rounded-3xl flex items-center px-6 py-4 border border-transparent focus-within:bg-white focus-within:border-primary-500/40 transition-colors shadow-inner group">
              <IoLocationOutline className="text-2xl text-neutral-400 group-focus-within:text-primary" />
              <div className="ml-4 w-full text-left">
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  {t("searchDeparture")}
                </span>
                <input
                  type="text"
                  placeholder={t("searchDeparturePlaceholder")}
                  className="w-full bg-transparent text-lg font-bold text-dark outline-none placeholder:text-neutral-300"
                />
              </div>
            </div>

            <div className="hidden lg:flex w-12 h-12 rounded-full bg-white shadow-md border border-neutral-100 items-center justify-center shrink-0 -mx-6 z-10 text-neutral-400 font-black">
              <IoArrowForwardOutline />
            </div>

            <div className="flex-1 w-full bg-light-400 rounded-3xl flex items-center px-6 py-4 border border-transparent focus-within:bg-white focus-within:border-primary-500/40 transition-colors shadow-inner group">
              <IoMapOutline className="text-2xl text-neutral-400 group-focus-within:text-primary" />
              <div className="ml-4 w-full text-left">
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  {t("searchArrival")}
                </span>
                <input
                  type="text"
                  placeholder={t("searchArrivalPlaceholder")}
                  className="w-full bg-transparent text-lg font-bold text-dark outline-none placeholder:text-neutral-300"
                />
              </div>
            </div>

            <div className="w-full lg:w-auto flex gap-3">
              <div className="flex-1 lg:w-40 bg-light-400 rounded-3xl flex items-center px-6 py-4 hover:bg-neutral-200 transition-colors cursor-pointer group">
                <IoCalendarOutline className="text-xl text-neutral-400 group-hover:text-primary" />
                <div className="ml-3 text-left">
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    {t("searchDate")}
                  </span>
                  <span className="block text-sm font-bold truncate">
                    {t("searchDateToday")}
                  </span>
                </div>
              </div>
              <div className="flex-1 lg:w-32 bg-light-400 rounded-3xl flex items-center px-6 py-4 hover:bg-neutral-200 transition-colors cursor-pointer group">
                <IoPersonOutline className="text-xl text-neutral-400 group-hover:text-primary" />
                <div className="ml-3 text-left">
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    {t("searchSeats")}
                  </span>
                  <span className="block text-sm font-bold">1</span>
                </div>
              </div>
            </div>

            <button className="w-full lg:w-auto btn-primary px-10 py-7">
              <IoSearchOutline />{" "}
              <span className="lg:hidden">{t("searchButton")}</span>
            </button>
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

      {/*  NARRATIVE SCROLL : HOW IT WORKS (Stacking Cards) */}
      <section
        id="comment-ca-marche"
        className="steps-container relative w-full bg-light z-20 py-20 lg:py-32 border-t border-black/5"
      >
        <div className="container mx-auto px-6 mb-16 lg:mb-24 text-center z-20 relative">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-tight text-dark text-center">
            {t("howItWorksTitle")}
          </h2>
        </div>

        <div className="container mx-auto px-6 relative pb-20">
          {/* Card 1 : Le bon départ */}
          <div className="stack-card sticky top-28 md:top-44 z-10 w-full min-h-[50vh] xl:min-h-[60vh] bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-neutral-100 p-8 lg:p-14 xl:p-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-[8vh] overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[url('/images/carte-bg.webp')] bg-cover bg-center opacity-15"></div>
            {/* Background absolute text */}
            <div className="absolute top-18 -mt-10 left-18 text-[150px] lg:text-[250px] font-black text-dark opacity-[0.05] pointer-events-none leading-none z-0 tracking-tighter select-none">
              01
            </div>

            <div className="flex-1 w-full relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-6 leading-tight text-dark">
                {t("step1Title1")} <br />
                <span className="text-transparent bg-clip-text bg-linear-to-br from-primary to-primary-900">
                  {t("step1Title2")}
                </span>
              </h2>
              <p className="text-lg text-neutral-600 font-medium max-w-lg mb-8 leading-relaxed">
                {t("step1Desc")}
              </p>
              <button className="btn-primary px-8 py-4 text-sm shadow-xl shadow-primary/20">
                {t("step1Btn")}
              </button>
            </div>

            <div className="flex-1 w-full relative z-10 flex flex-col justify-center">
              {/* Illus 1 : Search Map UI */}
              <div className="w-full bg-light rounded-4xl shadow-xl border border-black/5 overflow-hidden flex flex-col relative aspect-square lg:aspect-auto lg:h-[650px]">
                <div className="w-full h-[55%] bg-light relative overflow-hidden shrink-0">
                  <Image
                    src="/images/carte-illustration.webp"
                    alt="Carte avec des marqueurs"
                    fill
                    className="object-cover opacity-80 mix-blend-multiply grayscale-20%"
                  />
                  {/* Decorative map pins */}
                  <div className="absolute top-1/3 left-1/3 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-4 h-4 bg-primary rounded-full shadow-lg border-2 border-white"></div>
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-dark/10 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-dark rounded-full shadow-lg border-2 border-white"></div>
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-center bg-white space-y-4">
                  <div className="bg-light p-4 rounded-2xl flex items-center gap-4 border border-black/5">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-neutral-100 flex items-center justify-center text-primary shrink-0">
                      <IoLocationOutline className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="w-24 h-2.5 bg-neutral-200 rounded-full mb-2"></div>
                      <div className="w-40 h-3.5 bg-neutral-800 rounded-full max-w-[80%]"></div>
                    </div>
                  </div>
                  <div className="bg-light p-4 rounded-2xl flex items-center gap-4 border border-black/5">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-neutral-100 flex items-center justify-center text-primary shrink-0">
                      <IoMapOutline className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="w-24 h-2.5 bg-neutral-200 rounded-full mb-2"></div>
                      <div className="w-32 h-3.5 bg-neutral-800 rounded-full max-w-[70%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 : Communauté de confiance */}
          <div className="stack-card sticky top-28 md:top-44 z-20 w-full min-h-[50vh] xl:min-h-[60vh] bg-dark-900 text-white rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_30px_80px_rgba(0,0,0,0.4)] border border-neutral-800 p-8 lg:p-14 xl:p-20 flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16 mb-[8vh] overflow-hidden">
            <div className="absolute top-18 -mt-10 right-18 text-[150px] lg:text-[250px] font-black text-white opacity-[0.06] pointer-events-none leading-none z-0 tracking-tighter select-none">
              02
            </div>

            <div className="flex-1 w-full relative z-10 flex flex-col lg:items-end lg:text-right">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-6 leading-tight text-white lg:text-right">
                {t("step2Title1")} <br />
                <span className="text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                  {t("step2Title2")}
                </span>
              </h2>
              <p className="text-lg text-neutral-400 font-medium max-w-lg mb-8 leading-relaxed">
                {t("step2Desc")}
              </p>
              <div className="step-badge flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-max backdrop-blur-sm">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                  <IoShieldCheckmarkOutline className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-white">
                    {t("step2Badge1")}
                  </h4>
                  <p className="text-xs text-neutral-400 font-medium">
                    {t("step2Badge2")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full relative z-10 flex flex-col items-center justify-center mt-10 lg:mt-0">
              {/* 3D Canadian Premium ID Card */}
              <div className="w-full max-w-lg aspect-[1.6] bg-white rounded-3xl p-2 relative z-20 transform -rotate-1 hover:rotate-0 hover:scale-[1.02] transition-all duration-500 mx-auto">
                <Image
                  src="/images/canada-flag-icon.png"
                  alt="Canada"
                  width={300}
                  height={300}
                  className="object-contain absolute bottom-0 right-0 w-48 h-48 -rotate-45 opacity-10 pointer-events-none"
                />
                <div className="border border-neutral-200/60 rounded-2xl p-5 sm:p-7 h-full relative z-10 overflow-hidden text-left flex flex-col justify-between bg-white/50 backdrop-blur-xs">
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>

                  <Image
                    src="/images/canada-flag.png"
                    alt="Canada"
                    width={36}
                    height={36}
                    className="object-contain"
                  />

                  {/* Profile row */}
                  <div className="flex gap-5 sm:gap-6 items-center relative z-10">
                    <div className="w-24 h-24 sm:w-38 sm:h-38 aspect-square rounded-2xl overflow-hidden relative shadow-md shrink-0 border border-black/5">
                      <Image
                        src="/images/profile.jpg"
                        alt="Conducteur"
                        fill
                        className="object-cover bg-neutral-100"
                      />
                    </div>
                    <div className="space-y-1.5 w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xl sm:text-3xl text-neutral-800 tracking-tight leading-none mb-1 block">
                          Jean Tremblay
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-700 text-[10px] sm:text-xs font-semibold uppercase rounded-lg tracking-widest leading-none mb-1 shadow-sm border border-green-500/20 w-max">
                        <IoShieldCheckmarkOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{" "}
                        Vérifié
                      </div>
                      <div className="flex items-center gap-1.5 text-yellow-500 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <IoStar
                            key={i}
                            className="h-4 w-4 sm:h-5 sm:w-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                          />
                        ))}
                        <span className="font-bold text-neutral-700 ml-1.5 text-xs sm:text-sm">
                          4.8
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="flex justify-between items-end relative z-10 mt-3">
                    <div className="text-xs sm:text-sm text-neutral-500 font-medium whitespace-nowrap">
                      +150 trajets
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-white/80 text-[10px] sm:text-xs text-neutral-600 tracking-widest font-mono border border-neutral-200 font-bold shadow-inner inline-flex items-center whitespace-nowrap">
                      QC-928183****
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps Visual - Bauhaus Style (Fixed Alignment) */}
              <div className="flex items-start justify-between w-full max-w-[320px] mx-auto mt-12 px-2">
                {/* Step 1: Permis */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-neutral-900 text-neutral-400 border border-neutral-800">
                    <IoPersonOutline className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium tracking-tight text-neutral-500">
                    Permis
                  </span>
                </div>

                {/* Separator 1 (Aligned with icon center) */}
                <div className="flex-1 h-[2px] mt-[28px] mx-2 bg-neutral-800 overflow-hidden">
                  <div className="h-full w-full bg-neutral-600 origin-left scale-x-75" />
                </div>

                {/* Step 2: Selfie */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-neutral-900 text-neutral-400 border border-neutral-800">
                    <IoIdCardOutline className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium tracking-tight text-neutral-500">
                    Selfie
                  </span>
                </div>

                {/* Separator 2 (Aligned with icon center) */}
                <div className="flex-1 h-[2px] mt-[28px] mx-2 bg-neutral-800" />

                {/* Step 3: Sécurisé (Active) */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white text-black scale-110 shadow-[0_10px_25px_-5px_rgba(255,255,255,0.2)]">
                    <IoShieldCheckmarkOutline className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium tracking-tight text-white">
                    Sécurisé
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 : Paiement */}
          <div className="stack-card sticky top-28 md:top-44 z-30 w-full min-h-[50vh] xl:min-h-[60vh] bg-linear-to-br from-primary to-primary-800 text-white rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_30px_80px_rgba(37,99,235,0.4)] border border-blue-400/30 p-8 lg:p-14 xl:p-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 overflow-hidden">
            <div className="absolute top-18 -mt-10 left-18 text-[150px] lg:text-[250px] font-black text-white opacity-[0.06] pointer-events-none leading-none z-0 tracking-tighter select-none">
              03
            </div>
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex-1 w-full relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-6 leading-tight text-white">
                {t("step3Title1")} <br />
                {t("step3Title2")}
              </h2>
              <p className="text-lg text-blue-100/80 font-medium max-w-lg mb-8 leading-relaxed">
                {t("step3Desc")}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                  <IoWalletOutline className="text-xl" />
                </div>
                <span className="text-sm font-bold tracking-widest uppercase text-white">
                  {t("step3Garanti")}
                </span>
              </div>
            </div>

            <div className="flex-1 w-full relative z-10 flex flex-col justify-center items-center mt-6 lg:mt-0">
              {/* Illus 3 : Wigo Wallet */}
              <div className="w-full max-w-md">
                <div className="text-center flex flex-col justify-center pb-8 border-b border-white/10 mb-8">
                  <h3 className="text-xs font-bold opacity-80 mb-2 uppercase tracking-widest text-blue-100">
                    {t("step3Available")}
                  </h3>
                  <h2 className="text-5xl lg:text-7xl font-black mb-1 tracking-tighter drop-shadow-md text-white">
                    244.50 $
                  </h2>
                  <p className="text-xs font-bold text-blue-200 tracking-wider">
                    CAD
                  </p>
                </div>

                <div className="space-y-4 w-full">
                  <div className="bg-white/10 w-full p-5 rounded-2xl backdrop-blur-md border border-white/20 flex justify-between items-center transform transition-all shadow-xl">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1.5">
                        {t("step3ReceivedYesterday")}
                      </p>
                      <p className="font-bold text-sm tracking-tight text-white">
                        {t("step3Trip1")}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="font-black text-xl text-green-400">
                        + 45.00 $
                      </p>
                    </div>
                  </div>
                  <div className="bg-black/10 w-full p-4 rounded-xl backdrop-blur-md border border-transparent flex justify-between items-center opacity-70">
                    <div className="text-left">
                      <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1 text-white">
                        {t("step33DaysAgo")}
                      </p>
                      <p className="font-semibold text-sm text-white">
                        {t("step3Trip2")}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="font-bold text-lg text-white">- 35.00 $</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  NEW SECTION : CÔTÉ CONDUCTEUR (Drivers Pitch) */}
      <section
        id="conducteur"
        className="relative w-full bg-light-400 z-20 overflow-hidden py-32 border-t border-black/5"
      >
        <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[50vw] h-[20vw] bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-6 text-dark leading-tight reveal-fade">
              {t("driverTitle1")} <br />
              <span className="text-transparent bg-clip-text bg-linear-to-br from-primary to-primary-900">
                {t("driverTitle2")}
              </span>
            </h2>
            <p className="text-neutral-500 text-lg md:text-xl font-medium max-w-2xl mx-auto reveal-fade">
              {t("driverDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 w-full max-w-7xl">
            {/* Card 1 */}
            <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-500 reveal-fade relative overflow-hidden group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-10 border border-primary/40">
                <IoWalletOutline className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-dark mb-4 tracking-tight">
                  {t("driverCard1Title")}
                </h3>
                <p className="text-neutral-500 font-medium leading-relaxed">
                  {t("driverCard1Desc")}
                </p>
              </div>
            </div>

            {/* Card 2 : Highlighted Digital Experience */}
            <div className="bg-dark-900 text-white rounded-[2.5rem] squircle p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.2)] md:-translate-y-6 hover:-translate-y-8 transition-transform duration-500 reveal-fade relative overflow-hidden border border-white/10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-10 border border-white/20 relative z-10">
                <IoShieldCheckmarkOutline className="w-7 h-7" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                  {t("driverCard2Title")}
                </h3>
                <p className="text-neutral-400 font-medium leading-relaxed mb-6">
                  {t("driverCard2Desc")}
                </p>
                <div className="w-full flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 bg-neutral-800 overflow-hidden relative shadow-lg"
                    >
                      <Image
                        src={`/images/avatar-${i}.webp`}
                        alt="Passager"
                        height={40}
                        width={40}
                        className="object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 z-20 bg-dark text-xs font-bold flex items-center justify-center">
                    +2k
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-500 reveal-fade relative overflow-hidden group">
              <div className="w-14 h-14 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-600 mb-10 border border-yellow-700/40">
                <IoCalendarOutline className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-dark mb-4 tracking-tight">
                  {t("driverCard3Title")}
                </h3>
                <p className="text-neutral-500 font-medium leading-relaxed">
                  {t("driverCard3Desc")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center reveal-fade">
            <button className="btn-primary uppercase">{t("driverBtn")}</button>
          </div>
        </div>
      </section>

      {/*  DARK MODE SECTION : Vehicles Focus Web Layout (VOYAGEUR) */}
      <section
        id="voyageur"
        className="dark-mode-section bg-[url(/images/bg-texture.png)] relative py-32 px-6 flex flex-col items-center text-center overflow-hidden border-t border-white/5"
      >
        <div className="container mx-auto z-10">
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
              Ça n'arrive qu'en <br />
              <span className="gradient-text lg:transition-colors lg:duration-300 text-transparent bg-clip-text bg-linear-to-br from-primary to-primary-900">
                Wigo Express...
              </span>
            </h2>
            <p className="text-neutral-400 text-lg md:text-xl font-light max-w-3xl mx-auto">
              Voyagez dans de meilleures conditions. Sur Wigo, vous choisissez
              le véhicule qui vous convient, et vous savez exactement dans quel
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
                      <span className="text-neutral-400 font-normal">
                        ★ 4.9
                      </span>
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

      {/*  FOOTER  */}
      <footer className="footer-wrapper relative z-0 bg-dark text-white overflow-hidden rounded-t-[3rem] squircle">
        {/* Subtle top glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-primary/20 rounded-full blur-[150px] pointer-events-none opacity-50"></div>

        <div className="footer-content container mx-auto px-6 pt-20 md:pt-28 pb-8 flex flex-col h-full relative z-10">
          <div className="flex flex-col xl:flex-row justify-between items-start gap-16 flex-1 border-b border-white/15 pb-20">
            {/* Brand & Mission */}
            <div className="xl:w-5/12 flex flex-col items-start pr-0 md:pr-10">
              {/* Logo */}
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="Wigo Express Logo"
                  width={200}
                  height={200}
                  className="object-contain transition-transform"
                  priority
                />
              </Link>
              <p className="text-neutral-400 text-lg md:text-xl font-light mb-10 max-w-sm leading-relaxed mt-6">
                {tFooter("mission")}
              </p>
            </div>

            {/* Liens essentiels seulement + Contact/Connex */}
            <div className="xl:w-7/12 w-full flex flex-col md:flex-row gap-12 justify-center">
              <div className="flex flex-col gap-3 flex-1">
                <h4 className="font-extrabold uppercase tracking-widest text-primary mb-2">
                  {tFooter("usefulLinks")}
                </h4>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  {tFooter("searchRide")}
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  {tFooter("offerRide")}
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  {tFooter("about")}
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  {tFooter("terms")}
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  {tFooter("privacy")}
                </Link>
              </div>
              
              <div className="flex-1 min-w-[280px] max-w-md">
                <h4 className="font-extrabold uppercase tracking-widest text-primary mb-4">
                  {tFooter("contact")}
                </h4>
                <div className="flex flex-col gap-3">
                  <a href="mailto:contact@wigo.express" className="text-neutral-400 hover:text-white transition-all">
                    {tFooter("email")}
                  </a>
                  <a href="tel:+18001234567" className="text-neutral-400 hover:text-white transition-all">
                    {tFooter("phone")}
                  </a>
                </div>

                <h4 className="font-extrabold uppercase tracking-widest text-primary mt-8 mb-4">
                  {tFooter("login")}
                </h4>
                <div className="flex flex-col gap-3">
                  <Link href="/login" className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all">
                    {tFooter("login")}
                  </Link>
                  <Link href="/register" className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all">
                    {tFooter("register")}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-xs font-bold text-neutral-600 uppercase tracking-widest gap-6 mt-8">
            <span>
              © {new Date().getFullYear()} Wigo Express Inc. {tFooter("rights")}
            </span>
            <a
              href="https://altplus.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors hidden"
            >
              créé par altplus
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
