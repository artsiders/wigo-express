"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { 
  IoSearchOutline, 
  IoWalletOutline, 
  IoMapOutline, 
  IoLocationOutline, 
  IoChevronForward, 
  IoStar, 
  IoShieldCheckmarkOutline,
  IoPulseOutline,
  IoCarSportOutline,
  IoCalendarOutline,
  IoPersonOutline
} from "react-icons/io5";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function WigoExpress() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  useGSAP(() => {
    // 1. Hero Animations
    const tl = gsap.timeline();
    tl.fromTo(".hero-text-elem", 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.1 }
    )
    .fromTo(".search-widget", 
      { opacity: 0, y: 50, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "expo.out" },
      "-=0.6"
    )
    .fromTo(".hero-floating-img", 
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "expo.out" },
      "-=0.8"
    );

    // 2. Parallax Floating Elements on Scroll
    gsap.utils.toArray(".float-parallax").forEach((el: any) => {
      const speed = el.dataset.speed || 1;
      gsap.to(el, {
        yPercent: -15 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });
    });

    // 3. Staggered Sections Fade-in
    gsap.utils.toArray(".reveal-section").forEach((section: any) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play reverse play reverse"
          }
        }
      );
    });

    // 4. Dark Mode Transition (Car Details / Web View)
    ScrollTrigger.create({
      trigger: ".dark-mode-section",
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => gsap.to("body", { backgroundColor: "#0a0a0a", color: "#ffffff", duration: 0.8 }),
      onLeaveBack: () => gsap.to("body", { backgroundColor: "#f8f9fa", color: "#111111", duration: 0.8 }),
      onEnterBack: () => gsap.to("body", { backgroundColor: "#0a0a0a", color: "#ffffff", duration: 0.8 }),
      onLeave: () => gsap.to("body", { backgroundColor: "#f8f9fa", color: "#111111", duration: 0.8 }),
    });

  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen font-sans selection:bg-[#4D80C4] selection:text-white bg-[#f8f9fa] text-[#111] transition-colors duration-1000">
      
      {/* 🔴 NAVIGATION (Web Focus) */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-center backdrop-blur-xl bg-white/70 border-b border-black/5 shadow-sm transition-all">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-[#4D80C4]">
              wigo<span className="font-light text-black">express</span>
            </span>
          </Link>
          <div className="hidden lg:flex gap-8 items-center text-sm font-medium text-neutral-600">
            <Link href="/search" className="hover:text-[#4D80C4] transition-colors">Rechercher un trajet</Link>
            <Link href="/publish" className="hover:text-[#4D80C4] transition-colors">Publier un trajet</Link>
            <Link href="/safety" className="hover:text-[#4D80C4] transition-colors">Confiance & Sécurité</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="hidden md:block font-bold text-sm text-[#111] hover:text-[#4D80C4] transition-colors">
              Se connecter
            </Link>
            <Link href="/register" className="bg-[#4D80C4] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-black transition-colors shadow-lg shadow-blue-500/20">
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* 🔴 HERO SECTION : Web Carpooling Search */}
      <section className="relative min-h-[90vh] pt-32 pb-20 px-6 flex flex-col items-center justify-center overflow-hidden">
        {/* Background Ambient Decor */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#4D80C4]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/3 translate-x-1/4"></div>

        <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
          
          <div className="hero-text-elem inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-bold text-[#4D80C4] uppercase tracking-widest shadow-sm mb-6 border border-black/5">
            <IoStar className="text-yellow-400" /> Le Covoiturage Premium
          </div>
          
          <h1 className="hero-text-elem text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-[#111] mb-6 max-w-5xl">
            Partagez la route en<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#4D80C4] to-[#1e3a8a]">Classe Affaires.</span>
          </h1>
          
          <p className="hero-text-elem text-lg md:text-2xl text-neutral-500 font-light mb-12 max-w-2xl leading-relaxed">
            Rejoignez une communauté de membres vérifiés. Réservez votre siège dans des véhicules d'exception et participez aux frais en toute simplicité.
          </p>

          {/* Web Search Widget (Core Carpooling Feature) */}
          <div className="search-widget w-full max-w-4xl bg-white p-2 md:p-3 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-neutral-100 flex flex-col md:flex-row items-center gap-2 mb-16 relative z-30">
            
            <div className="flex-1 flex w-full md:w-auto items-center gap-3 px-4 py-3 md:py-4 bg-[#f8f9fa] rounded-2xl hover:bg-[#f0f2f5] transition-colors cursor-text group border border-transparent focus-within:border-[#4D80C4]/30 focus-within:bg-white">
              <IoLocationOutline className="text-neutral-400 text-xl group-focus-within:text-[#4D80C4]" />
              <div className="flex flex-col text-left w-full">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Départ</span>
                <input type="text" placeholder="Ville de départ" className="bg-transparent text-[#111] font-bold outline-none placeholder:text-neutral-800 placeholder:font-medium w-full" />
              </div>
            </div>

            <div className="hidden md:flex w-8 h-8 rounded-full bg-white border border-neutral-200 items-center justify-center shrink-0 z-10 -mx-4 shadow-sm text-neutral-400">
              <IoChevronForward />
            </div>

            <div className="flex-1 flex w-full md:w-auto items-center gap-3 px-4 py-3 md:py-4 bg-[#f8f9fa] rounded-2xl hover:bg-[#f0f2f5] transition-colors cursor-text group border border-transparent focus-within:border-[#4D80C4]/30 focus-within:bg-white">
              <IoMapOutline className="text-neutral-400 text-xl group-focus-within:text-[#4D80C4]" />
              <div className="flex flex-col text-left w-full">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Arrivée</span>
                <input type="text" placeholder="Ville d'arrivée" className="bg-transparent text-[#111] font-bold outline-none placeholder:text-neutral-800 placeholder:font-medium w-full" />
              </div>
            </div>

            <div className="flex w-full md:w-auto gap-2">
              <div className="flex-1 md:w-40 flex items-center gap-3 px-4 py-3 md:py-4 bg-[#f8f9fa] rounded-2xl hover:bg-[#f0f2f5] transition-colors cursor-pointer group">
                <IoCalendarOutline className="text-neutral-400 text-xl group-hover:text-[#4D80C4]" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Date</span>
                  <span className="text-[#111] font-bold truncate">Aujourd'hui</span>
                </div>
              </div>

              <div className="flex-1 md:w-32 flex items-center gap-3 px-4 py-3 md:py-4 bg-[#f8f9fa] rounded-2xl hover:bg-[#f0f2f5] transition-colors cursor-pointer group">
                <IoPersonOutline className="text-neutral-400 text-xl group-hover:text-[#4D80C4]" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Passagers</span>
                  <span className="text-[#111] font-bold">1</span>
                </div>
              </div>
            </div>

            <button className="w-full md:w-auto bg-[#4D80C4] text-white font-bold text-sm px-8 py-5 rounded-xl hover:bg-[#3a659e] transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 h-full mt-2 md:mt-0">
              <IoSearchOutline className="text-lg" />
              <span>Rechercher</span>
            </button>
          </div>

          {/* Web Dashboard Visual Preview (Instead of purely mobile UI) */}
          <div className="hero-floating-img w-full max-w-5xl h-[40vh] md:h-[50vh] bg-white rounded-t-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.05)] border-t border-x border-neutral-100 overflow-hidden relative float-parallax" data-speed="0.5">
            {/* Fake Web Wrapper for visual impact */}
            <div className="h-10 border-b border-neutral-100 flex items-center px-6 gap-2 bg-[#fafafa]">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {/* IMAGE PLACEHOLDER: Platform Dashboard / Dashboard Covoiturage */}
            <div className="relative w-full h-full">
              <Image 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop" 
                alt="Capture d'écran conceptuelle (Web UI) d'un tableau de bord de covoiturage premium WIGO EXPRESS, affichant une carte interactive claire, des listes de trajets élégantes et des profils vérifiés, tons blanc et bleu."
                fill
                className="object-cover object-top opacity-90"
              />
              {/* Fade out to white at the bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 🔴 FEATURES / TRUST Grid */}
      <section className="reveal-section relative py-24 px-6 bg-white z-20">
        <div className="container mx-auto">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-[#4D80C4] mb-4">La Différence Wigo</h2>
              <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] text-[#111]">
                Un réseau de confiance, <br/><span className="text-neutral-400">sans compromis.</span>
              </h3>
            </div>
            <p className="max-w-md text-neutral-500 text-lg font-light">
              Le covoiturage a évolué. Finies les mauvaises surprises, les retards inexpliqués ou les annulations de dernière minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Security/KYC */}
            <div className="bg-[#f8f9fa] rounded-[2rem] border border-neutral-100 p-10 overflow-hidden relative group hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <IoShieldCheckmarkOutline className="w-7 h-7 text-[#4D80C4]" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-[#111]">KYC & Profils Vérifiés</h4>
              <p className="text-neutral-500 font-light text-base leading-relaxed">
                Conducteurs et passagers passent par une vérification d'identité stricte. Montez à bord avec une totale tranquillité d'esprit.
              </p>
            </div>

            {/* Card 2: Premium Cars */}
            <div className="bg-[#f8f9fa] rounded-[2rem] border border-neutral-100 p-10 overflow-hidden relative group hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <IoCarSportOutline className="w-7 h-7 text-neutral-800" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-[#111]">Flotte Privilège</h4>
              <p className="text-neutral-500 font-light text-base leading-relaxed">
                Notre algorithme privilégie les véhicules récents, spacieux et confortables. Pour que la route redevienne un plaisir.
              </p>
            </div>

            {/* Card 3: Exact Location */}
            <div className="bg-[#f8f9fa] rounded-[2rem] border border-neutral-100 p-10 overflow-hidden relative group hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <IoMapOutline className="w-7 h-7 text-[#4D80C4]" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-[#111]">Suivi GPS Exact</h4>
              <p className="text-neutral-500 font-light text-base leading-relaxed">
                Suivez votre conducteur sur la carte en temps réel jusqu'au point de rendez-vous. Ne cherchez plus votre véhicule.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 🔴 THE DIGITAL POCKET (Web Carpooling logic) */}
      <section className="reveal-section relative py-32 px-6 bg-[#f4f5f7] border-t border-black/5 overflow-hidden">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          
          <div className="w-full lg:w-1/2 relative">
            {/* "Your Digital Pocket" Web/Card Component */}
            <div className="w-full max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-neutral-100 p-8 relative overflow-hidden float-parallax" data-speed="0.8">
               <h3 className="text-2xl font-extrabold mb-6">Le Wigo Wallet</h3>
               
               {/* Dark Card Inside */}
               <div className="bg-[#111] p-6 rounded-3xl text-white mb-8 relative shadow-xl overflow-hidden">
                 <div className="absolute right-[-20%] top-[-20%] w-40 h-40 bg-[#4D80C4] rounded-full blur-[40px] opacity-40"></div>
                 <p className="text-sm font-bold mb-1 relative z-10 text-neutral-400">Solde Disponible</p>
                 <h4 className="text-4xl font-black mb-6 relative z-10">€ 142.50</h4>
                 
                 <div className="flex gap-4 relative z-10">
                   <button className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl text-xs font-bold text-white flex-1 hover:bg-white/20 transition-colors">Participer aux frais</button>
                   <button className="bg-[#4D80C4] px-4 py-3 rounded-xl text-xs font-bold text-white hover:bg-[#3a659e] transition-colors flex items-center justify-center"><IoWalletOutline className="text-lg" /></button>
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="bg-[#f8f9fa] p-4 rounded-2xl flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4D80C4] shadow-sm"><IoPersonOutline /></div>
                   <div className="flex-1">
                     <p className="text-sm font-bold text-neutral-800">Paiement au Conducteur</p>
                     <p className="text-xs text-neutral-400">Validation automatique à l'arrivée</p>
                   </div>
                   <IoShieldCheckmarkOutline className="text-green-500 text-lg" />
                 </div>
               </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-wigo-blue/30 text-xs font-bold text-[#4D80C4] mb-6 uppercase tracking-widest bg-[#4D80C4]/10">
              <IoWalletOutline className="w-4 h-4" /> Transactions sans friction
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6">
              Votre participation.<br/>
              <span className="text-[#4D80C4]">Hautement sécurisée.</span>
            </h2>
            <p className="text-neutral-500 text-lg md:text-xl font-light mb-8 max-w-lg">
              Terminé les passages au distributeur avant le départ ou la monnaie exacte à prévoir. Votre portefeuille intégré sécurise la transaction : vous payez à la réservation, le conducteur est payé à l'arrivée.
            </p>
            <div className="flex gap-4">
               <button className="bg-[#111] text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                  Comment ça marche ?
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🔴 DARK MODE SECTION : Vehicles Focus Web Layout */}
      <section className="dark-mode-section relative py-32 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="container mx-auto z-10">
          <div className="mb-16">
            <span className="text-[#4D80C4] font-bold tracking-widest uppercase text-xs mb-4 block">Publiez ou Réservez</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
              Le standard n'est <br/> plus une option.
            </h2>
            <p className="text-neutral-400 text-lg md:text-xl font-light max-w-3xl mx-auto">
               Notre communauté de conducteurs partage des trajets dans des berlines confortables, des véhicules électriques (EV) ou des SUV spacieux. Indiquez la plaque et le modèle, nous faisons le reste.
            </p>
          </div>

          {/* Web Data Grid / Showcase */}
          <div className="w-full max-w-6xl mx-auto bg-[#151515] rounded-[2.5rem] border border-white/10 p-6 md:p-10 shadow-2xl relative text-left flex flex-col lg:flex-row gap-10 items-center">
             
            {/* Text / Data part */}
             <div className="w-full lg:w-1/2">
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-white font-bold text-xl">Trajet : Paris → Lyon</h3>
                   <span className="bg-[#4D80C4]/20 text-[#4D80C4] font-bold text-xs px-3 py-1 rounded-full">Proposé aujourd'hui</span>
                 </div>
                 
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 bg-neutral-800 rounded-full overflow-hidden relative border-2 border-neutral-700">
                     <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Conducteur vérifié" fill className="object-cover" />
                   </div>
                   <div>
                     <p className="text-white font-bold text-sm">Marc D. <span className="text-neutral-400 font-normal">★ 4.9</span></p>
                     <p className="text-[#4D80C4] text-xs font-bold uppercase tracking-widest mt-1"><IoShieldCheckmarkOutline className="inline mr-1" />Profil vérifié</p>
                   </div>
                 </div>

                 <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                    <div>
                      <p className="text-neutral-400 text-xs mb-1">Véhicule</p>
                      <p className="text-white font-bold px-3 py-1 bg-white/10 rounded-lg inline-block text-sm">Tesla Model 3 • Noire</p>
                    </div>
                    <div className="text-right">
                      <strong className="text-3xl font-black text-white">€45</strong>
                      <p className="text-neutral-500 text-xs">/ passager</p>
                    </div>
                 </div>
               </div>
               
               <button className="bg-white text-black font-bold py-4 px-8 w-full rounded-xl shadow-lg hover:bg-neutral-200 transition-colors uppercase text-xs tracking-widest">
                 Réserver 1 Siège
               </button>
             </div>

             {/* IMAGE PLACEHOLDER: Premium Car Profile aligned with Web content */}
             <div className="w-full lg:w-1/2 relative h-[30vh] lg:h-[100%] min-h-[300px] rounded-2xl overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-[#151515] to-transparent z-10 pointer-events-none"></div>
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

      {/* 🔴 FOOTER (Web Layout) */}
      <footer className="bg-white text-black border-t border-black/5 py-20 px-6 mt-10 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.03)] relative z-20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            
            <div className="w-full md:w-1/3">
              <span className="text-2xl font-extrabold tracking-tight text-[#4D80C4] block mb-6">
                wigo<span className="font-light text-black">express</span>
              </span>
              <p className="text-neutral-500 font-medium text-sm leading-relaxed max-w-sm">
                L'alternative de covoiturage moderne, sécurisée et haut de gamme. Transformez vos déplacements quotidiens.
              </p>
            </div>

            <div className="w-full md:w-2/3 flex flex-col sm:flex-row gap-12 sm:gap-24 justify-end">
              <div>
                <h4 className="font-bold mb-4">Covoiturage</h4>
                <ul className="space-y-3 text-neutral-500 text-sm font-medium">
                  <li><Link href="/search" className="hover:text-[#4D80C4] transition-colors">Rechercher un trajet</Link></li>
                  <li><Link href="/publish" className="hover:text-[#4D80C4] transition-colors">Proposer un trajet</Link></li>
                  <li><Link href="/destinations" className="hover:text-[#4D80C4] transition-colors">Trajets populaires</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">À Propos</h4>
                <ul className="space-y-3 text-neutral-500 text-sm font-medium">
                  <li><Link href="/how-it-works" className="hover:text-[#4D80C4] transition-colors">Fonctionnement</Link></li>
                  <li><Link href="/wallet" className="hover:text-[#4D80C4] transition-colors">Le Portefeuille Wigo</Link></li>
                  <li><Link href="/contact" className="hover:text-[#4D80C4] transition-colors">Contactez-nous</Link></li>
                </ul>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-bold text-neutral-400 uppercase tracking-widest gap-4">
            <span>© {new Date().getFullYear()} Wigo Express. Tous droits réservés.</span>
            <div className="flex gap-6">
              <Link href="/legal" className="hover:text-[#4D80C4] transition-colors">Mentions Légales</Link>
              <Link href="/privacy" className="hover:text-[#4D80C4] transition-colors">Confidentialité</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}