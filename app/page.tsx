"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
} from "react-icons/io5";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function WigoExpress() {
  const container = useRef<HTMLDivElement>(null);

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
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });

      // 4. 🌟 NARRATIVE SCROLL (How it Works & KYC) - SIMPLE & CLEAR
      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": function () {
          const steps = gsap.utils.toArray(".step-item") as HTMLElement[];
          const illustrations = gsap.utils.toArray(".illust-step") as HTMLElement[];

          // Base state for illustrations: simple crossfade + subtle vertical slide
          gsap.set(illustrations, { 
             opacity: 0, 
             y: 20, 
             zIndex: 0
          });
          gsap.set(illustrations[0] as HTMLElement, { 
             opacity: 1, 
             y: 0, 
             zIndex: 10
          });

          // Inside text base states
          steps.forEach(step => {
             const title = step.querySelector('h2');
             const desc = step.querySelector('p');
             const badge = step.querySelector('.step-badge');
             if(title) gsap.set(title, { color: "#d4d4d4" }); // neutral-300
             if(desc) gsap.set(desc, { color: "#a3a3a3" }); // neutral-400
             if(badge) gsap.set(badge, { opacity: 0.4, filter: "grayscale(100%)" });
          });
          
          const firstTitle = steps[0].querySelector('h2');
          const firstDesc = steps[0].querySelector('p');
          const firstBadge = steps[0].querySelector('.step-badge');
          if(firstTitle) gsap.set(firstTitle, { color: "#111111" });
          if(firstDesc) gsap.set(firstDesc, { color: "#525252" });
          if(firstBadge) gsap.set(firstBadge, { opacity: 1, filter: "grayscale(0%)" });

          steps.forEach((step: any, i) => {
            ScrollTrigger.create({
              trigger: step,
              start: "top 50%", 
              end: "bottom 50%",
              onEnter: () => activateStep(i),
              onEnterBack: () => activateStep(i),
            });
          });

          function activateStep(index: number) {
            // Text Anims
            steps.forEach((s) => {
               const t = s.querySelector('h2');
               const d = s.querySelector('p');
               const b = s.querySelector('.step-badge');
               if(t) gsap.to(t, { color: "#d4d4d4", duration: 0.3 });
               if(d) gsap.to(d, { color: "#a3a3a3", duration: 0.3 });
               if(b) gsap.to(b, { opacity: 0.4, filter: "grayscale(100%)", duration: 0.3 });
            });

            const stepElem = steps[index];
            const currentTitle = stepElem.querySelector('h2');
            const currentDesc = stepElem.querySelector('p');
            const currentBadge = stepElem.querySelector('.step-badge');
            if(currentTitle) gsap.to(currentTitle, { color: "#111111", duration: 0.3 });
            if(currentDesc) gsap.to(currentDesc, { color: "#525252", duration: 0.3 });
            if(currentBadge) gsap.to(currentBadge, { opacity: 1, filter: "grayscale(0%)", duration: 0.3 });

            // Illustrations Anims
            illustrations.forEach((illus: any, i) => {
              if (i === index) {
                gsap.to(illus, { 
                   opacity: 1, 
                   y: 0, 
                   duration: 0.5, 
                   ease: "power2.out",
                   zIndex: 10
                });
              } else {
                gsap.to(illus, { 
                   opacity: 0, 
                   y: i < index ? -20 : 20, 
                   duration: 0.4, 
                   ease: "power2.inOut",
                   zIndex: i
                });
              }
            });
          }
        },
      });

      // 5. Dark Mode Transition
      ScrollTrigger.create({
        trigger: ".dark-mode-section",
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () =>
          gsap.to("body", {
            backgroundColor: "#050505",
            color: "#ffffff",
            duration: 0.8,
          }),
        onLeaveBack: () =>
          gsap.to("body", {
            backgroundColor: "#f8f9fa",
            color: "#111111",
            duration: 0.8,
          }),
        onEnterBack: () =>
          gsap.to("body", {
            backgroundColor: "#050505",
            color: "#ffffff",
            duration: 0.8,
          }),
        onLeave: () =>
          gsap.to("body", {
            backgroundColor: "#f8f9fa",
            color: "#111111",
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
      className="bg-[#f8f9fa] text-[#111] overflow-clip transition-colors duration-1000"
    >
      {/* PREMIUM MULTI-LAYERED NAVBAR (Extracted to component) */}
      <Navbar />

      {/*  EPIC HERO SECTION */}
      <section className="relative min-h-screen pt-40 pb-20 px-6 flex flex-col items-center justify-center">
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-10 left-10 w-[30vw] h-[30vw] bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="hero-text-elem text-[12vw] md:text-[3vw] max-w-5xl font-black tracking-tighter leading-tight mt-16 mb-8">
            Le covoiturage, enfin
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-br from-primary to-[#1e3a8a]">
              sûr, simple et fiable.
            </span>
          </h1>

          <p className="hero-text-elem text-lg md:text-xl opacity-80 font-medium mb-16 max-w-2xl leading-relaxed">
            Trouvez ou offrez un trajet l'esprit tranquille, profils 100%
            vérifiés et paiement automatisé. La nouvelle norme pour vos
            déplacements interurbains.
          </p>

          {/* Web Search Widget - The Core Tool */}
          <div className="search-widget w-full max-w-5xl bg-white p-3 md:p-4 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.06)] border border-neutral-100 flex flex-col lg:flex-row items-center gap-3 mb-10">
            <div className="flex-1 w-full bg-[#f4f5f7] rounded-3xl flex items-center px-6 py-4 border border-transparent focus-within:bg-white focus-within:border-primary/40 transition-colors shadow-inner group">
              <IoLocationOutline className="text-2xl text-neutral-400 group-focus-within:text-primary" />
              <div className="ml-4 w-full text-left">
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Départ
                </span>
                <input
                  type="text"
                  placeholder="D'où partez-vous ?"
                  className="w-full bg-transparent text-lg font-bold text-[#111] outline-none placeholder:text-neutral-300"
                />
              </div>
            </div>

            <div className="hidden lg:flex w-12 h-12 rounded-full bg-white shadow-md border border-neutral-100 items-center justify-center shrink-0 -mx-6 z-10 text-neutral-400 font-black">
              <IoArrowForwardOutline />
            </div>

            <div className="flex-1 w-full bg-[#f4f5f7] rounded-3xl flex items-center px-6 py-4 border border-transparent focus-within:bg-white focus-within:border-primary/40 transition-colors shadow-inner group">
              <IoMapOutline className="text-2xl text-neutral-400 group-focus-within:text-primary" />
              <div className="ml-4 w-full text-left">
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Arrivée
                </span>
                <input
                  type="text"
                  placeholder="Où allez-vous ?"
                  className="w-full bg-transparent text-lg font-bold text-[#111] outline-none placeholder:text-neutral-300"
                />
              </div>
            </div>

            <div className="w-full lg:w-auto flex gap-3">
              <div className="flex-1 lg:w-40 bg-[#f4f5f7] rounded-3xl flex items-center px-6 py-4 hover:bg-neutral-200 transition-colors cursor-pointer group">
                <IoCalendarOutline className="text-xl text-neutral-400 group-hover:text-primary" />
                <div className="ml-3 text-left">
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Date
                  </span>
                  <span className="block text-sm font-bold truncate">
                    Aujourd'hui
                  </span>
                </div>
              </div>
              <div className="flex-1 lg:w-32 bg-[#f4f5f7] rounded-3xl flex items-center px-6 py-4 hover:bg-neutral-200 transition-colors cursor-pointer group">
                <IoPersonOutline className="text-xl text-neutral-400 group-hover:text-primary" />
                <div className="ml-3 text-left">
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Places
                  </span>
                  <span className="block text-sm font-bold">1</span>
                </div>
              </div>
            </div>

            <button className="w-full lg:w-auto bg-primary text-white font-extrabold text-lg px-10 py-7 rounded-3xl hover:bg-[#111] transition-colors shadow-xl shadow-blue-500/20 flex justify-center items-center gap-2">
              <IoSearchOutline /> <span className="lg:hidden">Rechercher</span>
            </button>
          </div>

          {/* Dashboard Preview & Floating UI Cards Container */}
          <div className="relative w-full max-w-7xl mt-18 z-20">
            {/* Main Web Dashboard Visual Preview */}
            <div
              className="hero-floating-img w-full h-[40vh] md:h-[50vh] bg-white rounded-3xl border-t border-x shadow-[0_0_80px_rgba(0,0,0,0.05)] border-neutral-100 overflow-hidden relative float-parallax z-10"
              data-speed="0.5"
            >
              <div className="relative w-full h-full">
                <Image
                  src="/images/hero-image.webp"
                  alt="Capture d'écran conceptuelle (Web UI) d'un tableau de bord de covoiturage premium WIGO EXPRESS, affichant une carte interactive claire, des listes de trajets élégantes et des profils vérifiés, tons blanc et bleu."
                  fill
                  className="object-cover object-top opacity-90"
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
                  <h4 className="text-sm md:text-base font-bold text-[#111] leading-tight mb-1">
                    Profil Vérifié
                  </h4>
                  <p className="text-[10px] md:text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                    <IoShieldCheckmarkOutline className="text-base text-green-600 " />{" "}
                    Identité Wigo
                  </p>
                </div>
              </div>
              <div className="bg-[#f8f9fa] rounded-xl p-3 flex justify-between items-center border border-black/5 shadow-inner">
                <span className="text-[10px] md:text-xs text-neutral-500 font-medium">
                  Note globale
                </span>
                <span className="text-[10px] md:text-xs font-black text-[#111] flex items-center gap-1">
                  4.9/5 ★
                </span>
              </div>
            </div>

            {/* Floating UI Card 2: Instant Payment */}
            <div className="floating-card absolute -right-4 md:-right-8 lg:-right-16 top-[15%] lg:top-[25%] z-30 bg-[#050505]/95 backdrop-blur-xl p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_30px_60px_rgba(37,99,235,0.15)] border border-neutral-800/80 w-48 md:w-56 text-left hidden sm:block">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <IoWalletOutline className="text-lg md:text-xl" />
                </div>
                <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">
                  Paiement Wigo
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
                  Reçu à l'instant (CAD)
                </p>
              </div>
            </div>

            {/* Floating UI Card 3: Route Match */}
            <div className="floating-card absolute left-[5%] lg:left-[8%] bottom-[5%] lg:bottom-[8%] z-30 bg-white/90 backdrop-blur-xl p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-white/60 w-56 md:w-64 text-left hidden sm:block">
              <div className="bg-primary/10 mb-4 text-primary text-[9px] md:text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                Match Parfait
              </div>

              <div className="space-y-4 relative ml-1">
                <div className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-0.5 bg-neutral-200"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary ring-4 ring-white shadow-sm shrink-0"></div>
                  <p className="text-sm md:text-base font-bold text-[#111]">
                    Montréal, QC
                  </p>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#111] ring-4 ring-white shadow-sm shrink-0"></div>
                  <p className="text-sm md:text-base font-bold text-[#111]">
                    Québec, QC
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  NARRATIVE SCROLL : HOW IT WORKS / KYC (Pinned GSAP Section) */}
      <section className="steps-container relative w-full bg-white z-20 py-20 lg:py-0 border-t border-black/5">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
          {/* Left Text / The scrolling steps */}
          <div className="lg:py-[30vh] flex flex-col gap-16 lg:gap-[15vh] relative z-10 w-full max-w-xl mx-auto lg:mx-0">
            {/* Step 1 */}
            <div className="step-item relative min-h-auto lg:min-h-[40vh] flex flex-col justify-center py-6 transition-colors">
              <div className="absolute top-10 -translate-y-1/2 left-0 text-[180px] lg:text-[250px] font-black text-[#111] opacity-5 pointer-events-none leading-none z-0 tracking-tighter select-none">
                01
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-tight text-[#111]">
                  Le bon départ, <br />
                  <span className="text-neutral-500 lg:text-current">au bon moment.</span>
                </h2>
                <p className="text-lg md:text-xl text-neutral-600 font-medium pt-2 max-w-lg">
                  Indiquez votre destination et découvrez instantanément les trajets disponibles. Nous mettons en avant les conducteurs les mieux notés pour vous garantir un voyage agréable et serein.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="step-item relative min-h-auto lg:min-h-[40vh] flex flex-col justify-center py-6 transition-colors">
              <div className="absolute top-10 -translate-y-1/2 left-0 text-[180px] lg:text-[250px] font-black text-[#111] opacity-5 pointer-events-none leading-none z-0 tracking-tighter select-none">
                02
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-tight text-[#111]">
                  Une communauté <br />
                  <span className="text-neutral-500 lg:text-current">de confiance.</span>
                </h2>
                <p className="text-lg md:text-xl text-neutral-600 font-medium mb-8 pt-2 max-w-lg">
                  Pièce d'identité, permis de conduire et historique : chaque membre est contrôlé avant de pouvoir réserver ou prendre le volant. Vous voyagez toujours avec des personnes fiables.
                </p>
                <div className="step-badge flex items-center gap-4 bg-[#f8f9fa] p-4 rounded-2xl border border-black/5 w-max">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-600">
                    <IoShieldCheckmarkOutline className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#111]">Identité Contrôlée</h4>
                    <p className="text-xs text-neutral-500 font-medium">Badge de confiance validé</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="step-item relative min-h-auto lg:min-h-[40vh] flex flex-col justify-center py-6 transition-colors">
              <div className="absolute top-10 -translate-y-1/2 left-0 text-[180px] lg:text-[250px] font-black text-[#111] opacity-5 pointer-events-none leading-none z-0 tracking-tighter select-none">
                03
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-tight text-[#111]">
                  Réglez sans <br />
                  <span className="text-neutral-500 lg:text-current">y penser.</span>
                </h2>
                <p className="text-lg md:text-xl text-neutral-600 font-medium pt-2 max-w-lg">
                  Pas besoin de monnaie en voiture. Votre place est payée en ligne lors de la réservation et transférée automatiquement au conducteur à l'arrivée. Le paiement est 100% sécurisé.
                </p>
              </div>
            </div>
          </div>

          {/* Right Illustrations / Pinned during scroll */}
          <div className="sticky-illustrator hidden lg:flex h-screen items-center justify-center overflow-visible w-full sticky top-0">
            <div className="w-full max-w-[500px] aspect-[4/5] relative">
              
              {/* Illus 1 : Search Map UI */}
              <div className="illust-step absolute inset-0 bg-white rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden flex flex-col">
                <div className="w-full h-[55%] bg-[#f8f9fa] relative overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop"
                    alt="Carte avec des marqueurs"
                    fill
                    className="object-cover opacity-80 mix-blend-multiply grayscale-[20%]"
                  />
                  {/* Decorative map pins */}
                  <div className="absolute top-1/3 left-1/3 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-4 h-4 bg-primary rounded-full shadow-lg border-2 border-white"></div>
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-[#111]/10 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#111] rounded-full shadow-lg border-2 border-white"></div>
                  </div>
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center bg-white">
                  <div className="bg-[#f8f9fa] p-4 rounded-2xl flex items-center gap-4 mb-4 border border-black/5">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-neutral-100 flex items-center justify-center text-primary">
                      <IoLocationOutline className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="w-24 h-2.5 bg-neutral-200 rounded-full mb-2"></div>
                      <div className="w-40 h-3.5 bg-neutral-800 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-[#f8f9fa] p-4 rounded-2xl flex items-center gap-4 border border-black/5">
                     <div className="w-12 h-12 bg-white rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-neutral-100 flex items-center justify-center text-primary">
                      <IoMapOutline className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="w-24 h-2.5 bg-neutral-200 rounded-full mb-2"></div>
                      <div className="w-32 h-3.5 bg-neutral-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Illus 2 : KYC Trust Badge ID */}
              <div className="illust-step absolute inset-0 bg-[#050505] rounded-[2.5rem] shadow-[0_30px_100px_rgba(22,163,74,0.15)] border border-neutral-800 p-10 flex flex-col items-center justify-center text-white origin-bottom">
                
                {/* ID Card abstract representation */}
                <div className="w-[120%] h-40 absolute top-[10%] -rotate-6 bg-white/5 rounded-3xl border border-white/10 blur-[2px] pointer-events-none"></div>
                <div className="w-full max-w-sm bg-linear-to-br from-white/10 to-transparent backdrop-blur-xl rounded-2xl border border-white/20 p-6 relative z-10 shadow-2xl mb-8 transform -rotate-2">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500 relative">
                        <Image
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                          alt="Conducteur"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <IoShieldCheckmarkOutline className="w-8 h-8 text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                   </div>
                   <div className="space-y-3">
                     <div className="w-1/2 h-2.5 bg-white/20 rounded-full"></div>
                     <div className="w-3/4 h-2.5 bg-white/20 rounded-full"></div>
                     <div className="w-1/3 h-2.5 bg-white/20 rounded-full"></div>
                   </div>
                </div>

                <div className="text-center relative z-10 mt-4">
                  <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-xs font-black tracking-widest mb-4 border border-green-500/20">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    VERIFICATION WIGO
                  </div>
                  <h3 className="text-3xl font-bold mb-3 tracking-tight">Identité Confirmée</h3>
                  <p className="text-neutral-400 text-sm max-w-[250px] mx-auto leading-relaxed">
                    Scan passeport et permis de conduire validés avec succès.
                  </p>
                </div>
              </div>

              {/* Illus 3 : Wigo Wallet */}
              <div className="illust-step absolute inset-0 bg-primary rounded-[2.5rem] shadow-[0_30px_100px_rgba(37,99,235,0.3)] border border-blue-500/30 p-10 flex flex-col justify-between text-white overflow-hidden origin-bottom">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 text-center mt-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20 shadow-inner">
                    <IoWalletOutline className="w-8 h-8" />
                  </div>
                  <h3 className="text-xs font-bold opacity-80 mb-2 uppercase tracking-widest">
                    Solde Disponible
                  </h3>
                  <h2 className="text-6xl font-black mb-1 tracking-tighter drop-shadow-md">244.50 $</h2>
                  <p className="text-xs font-bold text-blue-200 tracking-wider">CAD</p>
                </div>

                <div className="relative z-10 space-y-4 mt-10">
                  <div className="bg-white/10 w-full p-5 rounded-2xl backdrop-blur-md border border-white/20 flex justify-between items-center transform transition-all hover:scale-[1.02] cursor-pointer shadow-lg">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1.5">
                        Reçu hier
                      </p>
                      <p className="font-bold text-sm tracking-tight">Trajet Montréal - Québec</p>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-xl text-green-300 drop-shadow-[0_0_10px_rgba(134,239,172,0.3)]">+ 45.00 $</p>
                    </div>
                  </div>
                  <div className="bg-black/10 w-full p-4 rounded-xl backdrop-blur-md border border-transparent flex justify-between items-center opacity-70">
                    <div className="text-left">
                      <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">
                        Il y a 3 jours
                      </p>
                      <p className="font-semibold text-sm">Paiement trajet</p>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-lg text-white">- 35.00 $</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/*  DARK MODE SECTION : Vehicles Focus Web Layout */}
      <section className="dark-mode-section relative py-32 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="container mx-auto z-10">
          <div className="mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">
              Confort et Qualité
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
              Voyagez dans de <br /> meilleures conditions.
            </h2>
            <p className="text-neutral-400 text-lg md:text-xl font-light max-w-3xl mx-auto">
              Fini les mauvaises surprises. Sur Wigo, vous choisissez le modèle
              qui vous convient : berlines, véhicules électriques ou SUV. Vous
              savez exactement dans quel véhicule vous allez monter.
            </p>
          </div>

          {/* Web Data Grid / Showcase */}
          <div className="w-full max-w-6xl mx-auto bg-[#151515] rounded-[2.5rem] border border-white/10 p-6 md:p-10 shadow-2xl relative text-left flex flex-col lg:flex-row gap-10 items-center">
            {/* Text / Data part */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
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
              <div className="absolute inset-0 bg-linear-to-b lg:bg-linear-to-r from-[#151515]/95 via-[#151515]/50 to-transparent z-10 pointer-events-none"></div>
              <Image
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop"
                alt="Vue d'une Tesla Model 3 noire, style studio premium sombre. Véhicule typique du covoiturage haut de gamme proposé sur la plateforme."
                fill
                className="object-cover transition-transform duration-1000 ease-out rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/*  PREMIUM INTERACTIVE FOOTER  */}
      <footer className="footer-wrapper relative z-0 bg-[#050505] text-white overflow-hidden rounded-t-[2.5rem] border-t border-white/5">
        {/* Subtle top glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-primary/20 rounded-full blur-[150px] pointer-events-none opacity-50"></div>

        <div className="footer-content container mx-auto px-6 py-20 md:py-28 flex flex-col h-full relative z-10">
          <div className="flex flex-col xl:flex-row justify-between items-start gap-16 flex-1 border-b border-white/10 pb-20 mb-10">
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
                La plateforme de covoiturage nouvelle génération. Trajets
                sécurisés, profils vérifiés et paiement garanti.
              </p>
            </div>

            {/* Links Grid */}
            <div className="xl:w-7/12 w-full grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-8 lg:justify-end text-sm">
              <div className="flex flex-col gap-4">
                <h4 className="font-extrabold uppercase tracking-widest text-primary mb-2">
                  Roulez
                </h4>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  Rechercher un trajet
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  Proposer un départ
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  Destinations Populaires
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  Montréal - Québec
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  Toronto - Ottawa
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-extrabold uppercase tracking-widest text-primary mb-2">
                  Découvrez
                </h4>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  La sécurité (KYC)
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  Portefeuille Digital
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  Assurances
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  Engagement carbone
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-extrabold uppercase tracking-widest text-primary mb-2">
                  Société
                </h4>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  À Propos
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  Carrières
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  Presse
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  Partenaires
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-xs font-bold text-neutral-600 uppercase tracking-widest gap-6">
            <span>
              © {new Date().getFullYear()} Wigo Express Inc. Tous droits
              réservés.
            </span>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-white transition-colors">
                CGU
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Politique de Confidentialité
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
