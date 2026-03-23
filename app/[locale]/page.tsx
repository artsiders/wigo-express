"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import DriverPitchSection from "@/components/home/DriverPitchSection";
import PremiumShowcaseSection from "@/components/home/PremiumShowcaseSection";
import Footer from "@/components/Footer";

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
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <DriverPitchSection />
      <PremiumShowcaseSection />
      <Footer />
    </div>
  );
}