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

  // GSAP Animations extracted to specific functional components

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