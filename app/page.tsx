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

      // 4. 🌟 PINNED NARRATIVE SCROLL (How it Works & KYC)
      // Ne fonctionne que sur desktop pour l'expérience (sur mobile on stack simplement)
      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": function () {
          ScrollTrigger.create({
            trigger: ".steps-container",
            start: "top top",
            end: "bottom bottom",
            pin: ".sticky-illustrator",
            pinSpacing: false,
          });

          const steps = gsap.utils.toArray(".step-item");
          steps.forEach((step: any, i) => {
            ScrollTrigger.create({
              trigger: step,
              start: "top 50%", // Quand le texte arrive au centre
              end: "bottom 50%", // Quand il le quitte
              onEnter: () => {
                gsap.to(step, { opacity: 1, x: 20, duration: 0.5 });
                gsap.to(`.illust-step`, {
                  opacity: 0,
                  scale: 0.95,
                  duration: 0.5,
                });
                gsap.to(`.illust-step-${i}`, {
                  opacity: 1,
                  scale: 1,
                  duration: 0.5,
                  ease: "back.out(1.5)",
                });
              },
              onEnterBack: () => {
                gsap.to(step, { opacity: 1, x: 20, duration: 0.5 });
                gsap.to(`.illust-step`, {
                  opacity: 0,
                  scale: 0.95,
                  duration: 0.5,
                });
                gsap.to(`.illust-step-${i}`, {
                  opacity: 1,
                  scale: 1,
                  duration: 0.5,
                  ease: "back.out(1.5)",
                });
              },
              onLeave: () =>
                gsap.to(step, { opacity: 0.2, x: 0, duration: 0.5 }),
              onLeaveBack: () =>
                gsap.to(step, { opacity: 0.2, x: 0, duration: 0.5 }),
            });
          });
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
      className="bg-[#f8f9fa] text-[#111] overflow-hidden transition-colors duration-1000"
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
            Covoiturage, simplement, sereinement.
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-br from-primary to-[#1e3a8a]">
              Zéro compromis.
            </span>
          </h1>

          <p className="hero-text-elem text-lg md:text-2xl opacity-60 font-medium mb-16 max-w-2xl leading-relaxed">
            Trouvez ou offrez un trajet dans des véhicules vérifiés. Paiement
            instantané et profils sécurisés (KYC). Plus haut, plus loin,
            ensemble.
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

            <button className="w-full lg:w-auto bg-primary text-white font-extrabold text-lg px-10 py-6 rounded-3xl hover:bg-[#111] transition-colors shadow-xl shadow-blue-500/20 flex justify-center items-center gap-2">
              <IoSearchOutline /> <span className="lg:hidden">Rechercher</span>
            </button>
          </div>

          {/* Web Dashboard Visual Preview (Instead of purely mobile UI) */}
          <div
            className="hero-floating-img w-full max-w-7xl h-[40vh] md:h-[50vh] bg-white rounded-3xl border-t border-x shadow-[0_0_80px_rgba(0,0,0,0.05)] border-neutral-100 overflow-hidden relative float-parallax mt-18"
            data-speed="0.5"
          >
            {/* IMAGE PLACEHOLDER: Platform Dashboard / Dashboard Covoiturage */}
            <div className="relative w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                alt="Capture d'écran conceptuelle (Web UI) d'un tableau de bord de covoiturage premium WIGO EXPRESS, affichant une carte interactive claire, des listes de trajets élégantes et des profils vérifiés, tons blanc et bleu."
                fill
                className="object-cover object-top opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/*  NARRATIVE SCROLL : HOW IT WORKS / KYC (Pinned GSAP Section) */}
      <section className="steps-container relative w-full bg-[#fbfbfb] border-t border-black/5 z-20">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Text / The scrolling steps */}
          <div className="lg:py-[30vh] flex flex-col gap-[30vh]">
            <div className="step-item opacity-100 lg:opacity-20 transition-opacity duration-300 min-h-[40vh] flex flex-col justify-center">
              <span className="text-primary font-black text-xl mb-4">
                01. Recherche & Match
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-tight">
                Mise en relation intelligente
              </h2>
              <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-lg">
                Oubliez la recherche fastidieuse. Indiquez votre point de
                départ, et notre algorithme vous propose immédiatement les
                meilleurs trajets disponibles, avec la note globale de chaque
                conducteur.
              </p>
            </div>

            <div className="step-item opacity-100 lg:opacity-20 transition-opacity duration-300 min-h-[40vh] flex flex-col justify-center">
              <span className="text-green-600 font-black text-xl mb-4">
                02. Sécurité Inébranlable
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-tight">
                Trust & KYC Intégré
              </h2>
              <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-lg mb-8">
                Nous vérifions manuellement la carte d'identité, la plaque
                d'immatriculation et l'historique de conduite. Ce badge de
                vérification est notre promesse d'excellence et de tranquillité
                pour chaque passager.
              </p>
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                  <IoShieldCheckmarkOutline className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    Passager & Conducteur Vérifiés
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Badge KYC Vert obtenu
                  </p>
                </div>
              </div>
            </div>

            <div className="step-item opacity-100 lg:opacity-20 transition-opacity duration-300 min-h-[40vh] flex flex-col justify-center">
              <span className="text-primary font-black text-xl mb-4">
                03. Wigo Wallet
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-tight">
                Zéro espèce. Zéro tracas.
              </h2>
              <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-lg">
                Le trajet est payé automatiquement via la plateforme. Le
                chauffeur reçoit directement les fonds dans son portefeuille
                Wigo à l'arrivée. Transférez vers votre banque en 1 clic.
              </p>
            </div>
          </div>

          {/* Right Illustrations / Pinned during scroll */}
          <div className="sticky-illustrator hidden lg:flex h-screen items-center justify-center sticky top-0 overflow-hidden">
            <div
              className="w-full max-w-lg aspect-square relative float-parallax"
              data-speed="0.2"
            >
              {/* Illus 1 : Search Map UI */}
              <div className="illust-step illust-step-0 absolute inset-0 bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-neutral-100 p-8 flex flex-col overflow-hidden">
                <div className="w-full h-1/2 bg-[#f8f9fa] rounded-2xl relative mb-4 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop"
                    alt="Carte avec des marqueurs"
                    fill
                    className="object-cover opacity-80"
                  />
                </div>
                <div className="bg-[#f8f9fa] p-4 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg"></div>
                  <div className="flex-1">
                    <div className="w-2/3 h-4 bg-neutral-200 rounded mb-2"></div>
                    <div className="w-1/3 h-3 bg-neutral-200 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Illus 2 : KYC Trust Badge ID */}
              <div className="illust-step illust-step-1 absolute inset-0 bg-[#0a0a0a] rounded-[3rem] shadow-[0_40px_80px_rgba(34,197,94,0.1)] border border-neutral-800 p-8 flex flex-col items-center justify-center text-white opacity-0 scale-95">
                <div className="w-32 h-32 rounded-full border-4 border-green-500 mb-6 relative overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                    alt="Scan visage KYC"
                    fill
                    className="object-cover opacity-60"
                  />
                  <IoShieldCheckmarkOutline className="w-12 h-12 text-green-400 absolute z-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Identité Confirmée</h3>
                <p className="text-neutral-400 text-center">
                  Scan passeport et permis de conduire validés par Wigo
                  Security.
                </p>
              </div>

              {/* Illus 3 : Wigo Wallet */}
              <div className="illust-step illust-step-2 absolute inset-0 bg-primary rounded-[3rem] shadow-[0_40px_80px_rgba(77,128,196,0.2)] border border-[#3a659e] p-8 flex flex-col items-center justify-center text-white opacity-0 scale-95">
                <IoWalletOutline className="w-20 h-20 mb-6 opacity-80" />
                <h3 className="text-xl font-medium opacity-80 mb-2">
                  Solde Wigo
                </h3>
                <h2 className="text-6xl font-black mb-10">€ 244.50</h2>
                <div className="bg-white/10 w-full p-4 rounded-2xl backdrop-blur flex justify-between">
                  <div className="text-left">
                    <p className="text-xs font-medium opacity-70">
                      Reçu (Trajet Paris - Lyon)
                    </p>
                    <p className="font-bold">+ 45.00 €</p>
                  </div>
                  <IoShieldCheckmarkOutline className="w-6 h-6" />
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
              Publiez ou Réservez
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
              Le standard n'est <br /> plus une option.
            </h2>
            <p className="text-neutral-400 text-lg md:text-xl font-light max-w-3xl mx-auto">
              Notre communauté de conducteurs partage des trajets dans des
              berlines confortables, des véhicules électriques (EV) ou des SUV
              spacieux. Indiquez la plaque et le modèle, nous faisons le reste.
            </p>
          </div>

          {/* Web Data Grid / Showcase */}
          <div className="w-full max-w-6xl mx-auto bg-[#151515] rounded-[2.5rem] border border-white/10 p-6 md:p-10 shadow-2xl relative text-left flex flex-col lg:flex-row gap-10 items-center">
            {/* Text / Data part */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-xl">
                    Trajet : Paris → Lyon
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
                      €45
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
            <div className="w-full lg:w-1/2 relative h-[30vh] lg:h-full min-h-[300px] rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-r from-[#151515] to-transparent z-10 pointer-events-none"></div>
              <Image
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop"
                alt="Vue d'une Tesla Model 3 noire, style studio premium sombre. Véhicule typique du covoiturage haut de gamme proposé sur la plateforme."
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
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
              <Link href="/" className="mb-8 block group">
                <span className="text-[60px] md:text-[80px] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-linear-to-br from-white to-white/40 group-hover:to-primary transition-all duration-500">
                  wigo.
                </span>
              </Link>
              <p className="text-neutral-400 text-lg md:text-xl font-light mb-10 max-w-sm leading-relaxed">
                Le réseau de covoiturage Premium. Vérification stricte,
                véhicules choisis, paiements instantanés. Plus haut, plus loin.
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
                  Destinations Magiques
                </Link>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  Paris - Lyon
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
