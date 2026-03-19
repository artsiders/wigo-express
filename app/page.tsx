"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { Image as ImageIcon, Layers, Zap, Mic, ArrowUpRight, Play, Star } from 'lucide-react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const SplitText = ({ text, className, wordClass }: { text: string; className?: string, wordClass?: string }) => {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-bottom pb-2">
          <span className={`inline-block split-word translate-y-full ${wordClass || ''}`}>{word}</span>
        </span>
      ))}
    </span>
  );
};

const mockHistory = [
  {
    id: 1,
    name: "Coffee Mug",
    tone: "Humoristique",
    date: "1j",
    thumbnail: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=300&h=533&fit=crop"
  },
  {
    id: 2,
    name: "Laptop Pro",
    tone: "Urgent",
    date: "3j",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=533&fit=crop"
  },
  {
    id: 3,
    name: "Watch Classic",
    tone: "Luxe",
    date: "5j",
    thumbnail: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&h=533&fit=crop"
  },
  {
    id: 4,
    name: "Skincare Serum",
    tone: "Urgent",
    date: "1 sem",
    thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=533&fit=crop"
  },
  {
    id: 5,
    name: "Gaming Headset",
    tone: "Humoristique",
    date: "1 sem",
    thumbnail: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=533&fit=crop"
  }
];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(ticker);
    };
  }, []);

  useGSAP(() => {
    // --- 1. Hero Entrance Animation ---
    const heroTl = gsap.timeline();
    heroTl.to(".split-word", {
      y: 0,
      duration: 1.2,
      stagger: 0.04,
      ease: "power4.out",
      delay: 0.2
    })
      .fromTo(".hero-element",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "power3.out" },
        "-=0.9"
      );

    // --- 2. Hero Scroll Parallax ---
    gsap.to(".hero-section", {
      yPercent: 40,
      opacity: 0,
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    // --- 2.5 Showcase Carousel Subtle Parallax ---
    gsap.fromTo(".carousel-track",
      { x: "25vw" }, // Starts offset to the right
      {
        x: "-10vw", // Moves towards the left/center
        ease: "none",
        scrollTrigger: {
          trigger: ".carousel-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      }
    );

    // --- 3. Pinned Transformation Section (Black to White) ---
    const transTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".transformation-wrapper",
        start: "top top",
        end: () => window.innerWidth < 768 ? "+=100%" : "+=150%", // Dynamic scroll depth
        pin: true,
        scrub: 1,
      }
    });

    transTl
      .fromTo(".card-static",
        { x: "0vw", scale: 1, rotation: 0 },
        { x: "-15vw", scale: 0.85, rotation: -6, duration: 1, ease: "power1.inOut" }
      )
      .fromTo(".card-reel",
        { x: "40vw", y: "20vh", scale: 0.6, rotation: 12, opacity: 0 },
        { x: "10vw", y: 0, scale: 1, rotation: 4, opacity: 1, zIndex: 20, duration: 1, ease: "power1.inOut" },
        "<"
      )
      .to(".transformation-bg-text", { x: "-10%", duration: 1 }, "<")
      .to(".card-reel", {
        x: "0vw",
        scale: 1.8,
        rotation: 0,
        y: "5vh",
        duration: 1.2,
        ease: "power2.inOut"
      }, "+=0.2");

    // --- 4. Features Section (Sidebar Pinned, Cards Scroll) ---
    ScrollTrigger.matchMedia({
      "(min-width: 768px)": function () {
        ScrollTrigger.create({
          trigger: ".features-container",
          start: "top top",
          end: "bottom bottom",
          pin: ".features-sidebar",
          pinSpacing: false
        });
      }
    });

    gsap.utils.toArray(".bento-card").forEach((card: any, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 100, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          }
        }
      );
    });

    // --- 5. Workflow Narrative (Sticky Stacked Cards) ---
    const cards = gsap.utils.toArray<HTMLElement>('.workflow-card');
    cards.forEach((card, index) => {
      // Entrance reveal for added fluidity
      gsap.fromTo(card,
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Parallax effect on the image 
      const img = card.querySelector('.card-image');
      if (img) {
        gsap.fromTo(img,
          { scale: 1.3 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "center center",
              scrub: 1,
            }
          }
        );
      }

      // Stack effect: Shrink & Blur previous card
      if (index < cards.length - 1) {
        gsap.fromTo(card,
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)"
          },
          {
            scale: 0.92,
            opacity: 0.3,
            filter: "blur(12px)",
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: cards[index + 1],
              start: "top 40%",
              end: "top 15%",
              scrub: true, // Switched to true for perfect real-time sync when scrolling up
            }
          }
        );
      }
    });

    // --- 6. Footer Curtain Reveal Parallax ---
    gsap.fromTo(".footer-content",
      { y: "-40%" },
      {
        y: "0%",
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".footer-wrapper",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        }
      }
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen font-sans selection:bg-white selection:text-black">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 p-6 md:px-12 mix-blend-difference text-white flex justify-between items-center pointer-events-none">
        <Link href="/" className="flex items-center gap-2 pointer-events-auto">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10">
            <Image src="/images/dark-logo.png" alt="SnapToAd Logo" fill className="object-contain" priority />
          </div>
          <span className="text-sm font-bold tracking-widest">SnapToAd</span>
        </Link>
        <Link
          href="/create"
          className="group relative inline-flex items-center gap-1 sm:gap-3 rounded-full bg-white p-1 pl-3 sm:pl-5 font-extrabold text-black transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:scale-[1.02] hover:bg-neutral-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95 pointer-events-auto"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] pt-px whitespace-nowrap">
            Accéder à l'App
          </span>
          <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 items-center justify-center overflow-hidden rounded-full bg-black text-white">
            <ArrowUpRight className="absolute h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" />
            <ArrowUpRight className="absolute h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 -translate-x-[150%] translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
          </div>
        </Link>
      </nav>

      {/* 
        MAIN WRAPPER FOR CONTENT 
        Crucial: Has a solid background and high z-index to block the sticky footer from showing through
      */}
      <div className="relative z-10 bg-[#060606] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

        {/* Hero Section */}
        <section className="hero-section h-svh flex flex-col justify-center items-center text-center px-4 relative pt-16 overflow-hidden">
          {/* Fallback Image tag to guarantee rendering */}
          <Image
            src="/images/landing-light.png"
            alt="Landing Background"
            fill
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none brightness-125"
            style={{ opacity: 1 }}
            priority
            sizes="100vw"
          />
          <Image
            src="/images/landing-light.png"
            alt="Landing Background"
            fill
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none brightness-125"
            style={{ opacity: 1, transform: "scaleX(-1)" }}
            priority
            sizes="100vw"
          />

          <div className="relative z-10 hero-element inline-flex items-center gap-2 px-4 py-2 border-b border-white/20 text-xs text-neutral-300 mb-10 tracking-widest uppercase">
            L'avenir de la Création
          </div>

          <h1 className="relative z-10 text-[14vw] md:text-[8vw] font-bold tracking-tighter leading-[0.85] uppercase">
            <SplitText text="Passez d'une Image" className="block text-white" />
            <SplitText text="à un Reel Viral." className="block text-neutral-400" />
          </h1>

          <p className="relative z-10 hero-element mt-12 text-lg md:text-2xl text-neutral-300 max-w-xl font-light leading-relaxed">
            Zéro compétence technique, zéro montage.
            Une simplicité absolue pour transformer vos produits en vidéos qui vendent.
          </p>

          <div className="relative z-10 hero-element mt-14">
            <Link
              href="/create"
              className="group relative inline-flex items-center gap-5 sm:gap-8 rounded-full bg-white p-2 pl-6 sm:pl-8 font-extrabold text-black transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:scale-[1.02] hover:bg-neutral-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <span className="text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] pt-px">
                Lancez-vous en 3 clics
              </span>
              <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center overflow-hidden rounded-full bg-black text-white">
                <ArrowUpRight className="absolute h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" />
                <ArrowUpRight className="absolute h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 -translate-x-[150%] translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
              </div>
            </Link>
          </div>
        </section>

        {/* Showcase Carousel */}
        <section className="carousel-section w-full pb-24 pt-12 md:pb-32 relative z-20 overflow-hidden">
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-6 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between hero-element w-full shrink-0">
              <div className="max-w-xl">
                <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  Ce que vous allez créer
                </h2>
                <p className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter text-white leading-[0.85]">
                  Ce niveau de rendu.<br />
                  <span className="text-neutral-600">Sans effort.</span>
                </p>
              </div>
            </div>

            <div className="carousel-track">
              <div
                className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-5 pb-10 pt-2 w-full"
                style={{
                  paddingLeft: 'max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem))',
                  paddingRight: 'max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem))'
                }}
              >
                {mockHistory.map((item) => (
                  <div
                    key={item.id}
                    className="hero-element shrink-0 w-[240px] md:w-[320px] lg:w-[360px] group cursor-pointer"
                  >
                    <div className="relative aspect-9/16 overflow-hidden rounded-4xl bg-[#0a0a0a] ring-1 ring-white/5 group-hover:ring-white/20 transition-all duration-700 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
                      {/* Background gradient for text legibility */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black via-black/40 to-transparent z-10 pointer-events-none opacity-80" />

                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover scale-[1.03] group-hover:scale-110 transition-all duration-[1.5s] ease-[cubic-bezier(0.2,1,0.2,1)]"
                        sizes="(max-width: 768px) 240px, (max-width: 1024px) 320px, 360px"
                      />

                      {/* Bottom Info inside the card for a premium look */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 flex flex-col justify-end">
                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          <div className="flex gap-2 mb-3 lg:mb-4">
                            <span className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white shadow-xl">
                              {item.tone}
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold uppercase text-white tracking-tight leading-none drop-shadow-lg">{item.name}</h3>
                        </div>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/10 backdrop-blur-[2px]">
                        <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 border border-white/20 backdrop-blur-lg group-hover:scale-100 scale-75 transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)]">
                          <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-2" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Style blocks for custom scrollbars */}
          <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        </section>

        {/* The Transformation (Pinned Section) */}
        <div className="transformation-wrapper relative h-screen w-full bg-[#f2f2f2] text-black overflow-hidden z-20">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden mix-blend-multiply">
            <h2 className="transformation-bg-text text-[15vw] md:text-[12vw] font-bold tracking-tighter opacity-10 whitespace-nowrap pl-[10vw]">
              100% AUTOMATISÉ
            </h2>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            {/* Static Image Card */}
            <div className="card-static absolute w-[260px] md:w-[350px] aspect-4/5 bg-white border border-neutral-200 shadow-2xl p-4 md:p-6 rounded-3xl flex flex-col justify-between z-10">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-black" />
                </div>
                <span className="text-[10px] md:text-sm font-extrabold text-black uppercase tracking-widest px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-neutral-200 bg-neutral-50 shadow-[0_2px_10px_rgba(0,0,0,0.05)] w-full text-center">Photo Produit</span>
              </div>
              <div className="flex-1 bg-neutral-100 rounded-xl overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=1600&fit=crop"
                  alt="Sneaker Source"
                  fill
                  className="w-full h-full object-cover grayscale opacity-80"
                  priority
                  sizes="(max-width: 768px) 260px, 350px"
                />
              </div>
            </div>

            {/* Reel Output Card */}
            <div className="card-reel absolute w-[280px] md:w-[320px] aspect-9/16 bg-black text-white p-2 rounded-4xl shadow-2xl border-4 border-[#111]">
              <div className="w-full h-full rounded-3xl overflow-hidden relative">
                <video
                  src="/videos/product-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-6">
                  <div className="w-1/2 h-1 bg-white/30 rounded-full mb-4">
                    <div className="w-2/3 h-full bg-white rounded-full"></div>
                  </div>
                  <p className="text-xl md:text-2xl font-bold mb-2 leading-tight">POV : Tu trouves enfin la paire de tes rêves pour cet été...</p>
                  <button className="mt-4 px-4 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded flex items-center justify-center gap-2">
                    Acheter <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="features-container relative min-h-[200vh] bg-[#060606] px-6 md:px-12 py-32 z-30">
          {/* Fallback Image tag to guarantee rendering */}
          <Image
            src="/images/landing-light.png"
            alt="Landing Background"
            fill
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none brightness-175"
            style={{ opacity: 1 }}
            priority
            sizes="100vw"
          />

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20">

            <div className="features-sidebar md:w-5/12 flex flex-col justify-start h-auto md:h-screen md:sticky top-10 pt-20">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-xs text-neutral-400 mb-6 uppercase tracking-widest w-max bg-white/5">
                Une simplicité radicale
              </div>
              <h3 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase leading-[0.85]">
                L'arsenal <br /><span className="text-neutral-600">complet.</span>
              </h3>
              <p className="mt-8 text-neutral-400 text-lg md:text-xl font-light leading-relaxed max-w-sm">
                L'application est conçue pour être utilisable par un enfant. Aucune timeline complexe, aucun logiciel à installer.
              </p>
            </div>

            <div className="md:w-7/12 flex flex-col gap-8 md:pt-[20vh] pb-[20vh]">

              <div className="bento-card bg-[#0b0b0b] overflow-hidden rounded-4xl p-10 border border-white/10 shadow-2xl flex flex-col">
                <Zap className="w-8 h-8 text-white mb-6" />
                <h4 className="text-3xl font-bold uppercase tracking-tight mb-4">Scripts IA</h4>
                <p className="text-neutral-400 font-light text-lg mb-8">Fournissez simplement l'image. L'IA rédige instantanément la phrase d'accroche (Hook) parfaite pour retenir l'attention de votre cible.</p>
                {/* Espace Réservé : Image/Illustration Feature 1 */}
                <div className="w-full aspect-video bg-[#111] rounded-xl border border-white/5 flex flex-col items-center justify-center overflow-hidden mt-auto relative">
                  <Image
                    src="/images/feature-copywriting.webp"
                    alt="IA Copywriting"
                    fill
                    className="w-full h-full object-cover absolute inset-0 opacity-80 hover:scale-105 transition-transform duration-500"
                    sizes="100vw"
                  />
                </div>
              </div>

              <div className="bento-card bg-[#0b0b0b] overflow-hidden rounded-4xl p-10 border border-white/10 shadow-2xl flex flex-col">
                <Mic className="w-8 h-8 text-white mb-6" />
                <h4 className="text-3xl font-bold uppercase tracking-tight mb-4">Voix Narratives</h4>
                <p className="text-neutral-400 font-light text-lg mb-8">L'application synchronise automatiquement des voix de synthèse ultra-réalistes qui imitent les créateurs de tendances.</p>
                {/* Espace Réservé : Image/Illustration Feature 2 */}
                <div className="w-full h-32 bg-[#111] rounded-xl border border-white/5 flex flex-col items-center justify-center overflow-hidden mt-auto relative">
                  <Image
                    src="/images/feature-audio.webp"
                    alt="Audio Features"
                    fill
                    className="w-full h-full object-cover absolute inset-0 opacity-50 hover:scale-105 transition-transform duration-500"
                    sizes="100vw"
                  />
                  {/* Animation visuelle simulant l'audio */}
                  <style>{`
                    @keyframes snapToAdAudioWave {
                      0%, 100% { transform: scaleY(0.2); }
                      50% { transform: scaleY(1); }
                    }
                  `}</style>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                    <div className="flex items-center justify-center gap-1 opacity-80 h-12">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => {
                        const heights = [20, 35, 25, 45, 30, 50, 20, 40, 30, 45, 25, 35, 15, 30, 20];
                        // Slower animation durations (between 1.2s and 1.8s)
                        const duration = (1.2 + (i % 3) * 0.3) + 's';
                        // Slightly longer delay offsets for the slower wave
                        const delay = `-${i * 0.2}s`;

                        return (
                          <div
                            key={i}
                            className="w-1.5 bg-white rounded-full shrink-0"
                            style={{
                              height: heights[i - 1] + 'px',
                              animation: `snapToAdAudioWave ${duration} ease-in-out infinite`,
                              animationDelay: delay,
                              transformOrigin: 'center'
                            }}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bento-card bg-[#0b0b0b] overflow-hidden rounded-4xl p-10 border border-white/10 shadow-2xl flex flex-col">
                <Layers className="w-8 h-8 text-white mb-6" />
                <h4 className="text-3xl font-bold uppercase tracking-tight mb-4">Rendu 9:16</h4>
                <p className="text-neutral-400 font-light text-lg mb-8">Exportez directement en vertical. Aucun redimensionnement requis. Prêt à briller sur l'algorithme TikTok et Instagram.</p>
                {/* Espace Réservé : Image/Illustration Feature 3 */}
                <div className="w-full aspect-video bg-[#111] rounded-xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden mt-auto group">
                  <Image
                    src="/images/feature-video.webp"
                    alt="Video Output"
                    fill
                    className="w-full h-full object-cover absolute inset-0 opacity-80 hover:scale-105 transition-transform duration-500"
                    sizes="100vw"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Value Proposition / Stats Section (White Background) */}
        <section className="relative bg-[#f4f4f4] text-black py-24 md:py-32 px-6 md:px-12 z-30 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 text-[10px] sm:text-xs font-bold text-neutral-500 mb-6 uppercase tracking-widest bg-white shadow-sm">
                L'Avantage Vidéo
              </div>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase leading-[0.9] mb-6">
                Le format <br /><span className="text-neutral-400">qui domine.</span>
              </h3>
              <p className="text-neutral-600 text-lg md:text-xl font-medium max-w-md">
                Les images statiques sont noyées dans la masse. Un Reel dynamique capte l'attention, raconte une histoire et décuple vos chances de viralité.
              </p>
            </div>

            <div className="md:w-1/2 flex flex-col gap-6 w-full">
              <div className="flex bg-white rounded-4xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-neutral-100 items-center gap-6 group hover:-translate-y-1 transition-transform duration-500">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black flex items-center justify-center shrink-0">
                  <span className="text-white font-extrabold text-xl sm:text-2xl">+80%</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl sm:text-2xl uppercase tracking-tight mb-1">D'engagement</h4>
                  <p className="text-neutral-500 text-sm sm:text-base">Générez des interactions massives face à un simple post photo.</p>
                </div>
              </div>

              <div className="flex bg-white rounded-4xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-neutral-100 items-center gap-6 group hover:-translate-y-1 transition-transform duration-500">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black flex items-center justify-center shrink-0">
                  <span className="text-white font-extrabold text-xl sm:text-2xl">-10h</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl sm:text-2xl uppercase tracking-tight mb-1">De Montage</h4>
                  <p className="text-neutral-500 text-sm sm:text-base">Évitez la timeline de montage. Notre IA gère la direction artistique complète.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow / Process */}
        <section className="workflow-container relative py-32 md:py-48 px-6 md:px-12 border-t border-white/5 z-30">
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="w-full h-full bg-[url(/images/landing-light.png)] bg-no-repeat bg-cover bg-position-[center_top] bg-fixed bg-[scroll] opacity-100"></div>
          </div>
          {/* Fallback Image tag to guarantee rendering */}
          {/* <Image
            src="/images/landing-light.png"
            alt="Landing Background"
            fill
            className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none brightness-175"
            style={{ opacity: .2 }}
            priority
            sizes="100vw"
          /> */}

          <div className="max-w-4xl mx-auto text-center mb-20 md:mb-32 relative z-10">
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase leading-[0.85] mb-8">
              Vous avez <br /><span className="text-neutral-600">3 tâches.</span>
            </h3>
            <p className="text-xl text-neutral-400 font-light">Littéralement. Tout le reste est géré par l'Intelligence Artificielle.</p>
          </div>

          <div className="relative max-w-6xl mx-auto pb-32">

            {[
              {
                step: "01",
                title: "Glissez, Déposez.",
                desc: "Fournissez la photo brute de votre produit. Aucune préparation n'est requise de votre côté, l'IA l'habille pour vous.",
                img: "/images/step-upload.webp"
              },
              {
                step: "02",
                title: "Indiquez l'humeur.",
                desc: "Sélectionnez le style de présentation (Luxe, Humour, Urgent). Un seul clic et l'IA rédige une histoire autour de votre image.",
                img: "/images/step-context.webp"
              },
              {
                step: "03",
                title: "Générez. Postez.",
                desc: "Récupérez instantanément votre vidéo montée. Prête à percer les plafonds de vues sur TikTok et Reels.",
                img: "/images/step-export.webp"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="workflow-card sticky w-full h-auto min-h-[50vh] bg-[#0c0c0c] border border-white/10 rounded-4xl mb-[15vh] flex flex-col md:flex-row items-stretch gap-0 origin-top last:mb-0 overflow-hidden" // items-stretch et gap-0 + overflow-hidden
                style={{ top: `calc(15vh + ${index * 30}px)` }}
              >
                {/* Section Texte */}
                <div className="md:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16">
                  <span
                    className="text-transparent font-bold text-6xl md:text-8xl mb-4 md:mb-6 leading-none"
                    style={{ WebkitTextStroke: '2px rgba(255,255,255,0.26)' }}
                  >
                    {item.step}
                  </span>
                  <h4 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4 md:mb-6">
                    {item.title}
                  </h4>
                  <p className="text-neutral-400 font-light text-lg md:text-2xl leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Section Image - Remplissage total */}
                <div className="md:w-1/2 w-full relative min-h-[300px] md:min-h-full">
                  <Image
                    src={item.img}
                    alt={`Step ${item.step}`}
                    fill
                    className="card-image object-cover opacity-80"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}

          </div>
        </section>

      </div>
      {/* END MAIN WRAPPER */}

      {/* 
        Curtain Reveal Footer
        Now correctly works because the main wrapper has bg-[#060606] and high z-index.
      */}
      <footer className="footer-wrapper bg-[#f4f4f4] text-black overflow-hidden sticky bottom-0 z-0 flex flex-col">
        <div className="footer-content w-full h-full flex flex-col justify-between px-6 pt-24 pb-6 md:px-12 md:pt-32 md:pb-12 relative">

          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full container mx-auto flex-1 py-6">
            <div className="max-w-2xl">
              <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase mb-6 leading-[0.9]">
                Prêt à briser <br /><span className="text-neutral-400">l'algorithme ?</span>
              </h3>
              <p className="text-neutral-500 text-base md:text-xl font-medium max-w-md">
                Générez votre première vidéo virale en moins de 2 minutes. Aucune compétence requise.
              </p>
            </div>
            <div className="mt-12 md:mt-0 pb-4">
              <Link
                href="/create"
                className="group relative inline-flex items-center gap-5 sm:gap-8 rounded-full bg-[#0a0a0a] border border-white/20 p-2 pl-6 sm:pl-8 font-extrabold text-white transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:scale-[1.02] hover:bg-black hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] active:scale-95"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <span className="text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] pt-px whitespace-nowrap">
                  Générer mon Reel
                </span>
                <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center overflow-hidden rounded-full bg-white text-black shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] shrink-0">
                  <ArrowUpRight className="absolute h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" />
                  <ArrowUpRight className="absolute h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 -translate-x-[150%] translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
              </Link>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col w-full container mx-auto mt-auto">
            <div className="w-full h-px bg-neutral-300 mb-6 md:mb-8 z-10 relative"></div>

            <div className="flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500 gap-6 z-10 relative">
              {/* <div className="flex gap-8">
                <a href="#" className="hover:text-black transition-colors relative group">
                  Twitter
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-black transition-colors relative group">
                  Instagram
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-black transition-colors relative group">
                  TikTok
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div> */}

              <div className="flex items-center gap-2">
                <span className="text-neutral-400 font-medium normal-case tracking-normal">
                  Powered by
                </span>
                <a href="https://altplus.dev" target="_blank" rel="noopener noreferrer" className="hover:text-black lowercase text-neutral-600 transition-colors relative group">
                  Altplus
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>

              <Link href="/legal" className="hover:text-black transition-colors relative group">
                Légal & CGU
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}