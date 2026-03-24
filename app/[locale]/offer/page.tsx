"use client";

import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OfferWizardLayout from "@/components/offer/OfferWizardLayout";
import { LuLoaderCircle } from "react-icons/lu";
import Image from "next/image";
import gsap from "gsap";

export default function OfferRidePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const leftColRef = useRef<HTMLDivElement>(null);

  // Vérification basique de l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const isAuthenticated = localStorage.getItem("auth_token") !== null;

      if (!isAuthenticated) {
        setIsCheckingAuth(false);
      } else {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const stepParam = searchParams?.get("step");
  const currentStep = stepParam ? parseInt(stepParam, 10) : 1;

  const stepContents = {
    1: {
      title: "Votre itinéraire",
      subtitle:
        "Où allez-vous ? Définissez le point de départ et d'arrivée de votre aventure communautaire.",
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop", // Road trip map feel
    },
    2: {
      title: "Vos conditions",
      subtitle:
        "Fixez un prix juste et indiquez le nombre de places disponibles pour voyager en tout confort.",
      image:
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop", // Driving
    },
    3: {
      title: "Prêt au départ",
      subtitle:
        "Revoyez les détails une dernière fois avant de publier votre trajet aux milliers d'utilisateurs.",
      image:
        "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1000&auto=format&fit=crop", // Scenic beautiful road
    },
  };
  const content = stepContents[currentStep as 1 | 2 | 3] || stepContents[1];

  // GSAP Animation lors du changement d'étape (pour l'image et le texte)
  useLayoutEffect(() => {
    if (!isCheckingAuth && leftColRef.current) {
      let ctx = gsap.context(() => {
        gsap.fromTo(
          ".dynamic-content",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 },
        );
        gsap.fromTo(
          ".dynamic-image",
          { scale: 1.05, opacity: 0.5 },
          { scale: 1, opacity: 1, duration: 1.2, ease: "expo.out" },
        );
      }, leftColRef);
      return () => ctx.revert();
    }
  }, [currentStep, isCheckingAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LuLoaderCircle size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 mt-8 md:mt-12 md:px-8 lg:px-12 flex flex-col items-center">
      <div className="w-full container flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch">
        {/* Creative Left Column - Dynamic based on step */}
        <div
          ref={leftColRef}
          className="w-full lg:w-5/12 hidden lg:flex flex-col relative rounded-4xl overflow-hidden shadow-2xl border border-white border-opacity-50"
        >
          <Image
            key={content.image} // Force re-render on change
            src={content.image}
            alt="Illustration de trajet"
            fill
            className="dynamic-image object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-dark-900 via-dark-900/40 to-transparent"></div>

          <div className="relative z-10 mt-auto p-12 text-white">
            <div className="dynamic-content w-12 h-1 bg-primary mb-6 rounded-full"></div>
            <h1 className="dynamic-content text-4xl xl:text-5xl font-black mb-4 leading-tight tracking-tight">
              {content.title}
            </h1>
            <p className="dynamic-content text-lg text-white/80 font-medium leading-relaxed max-w-sm">
              {content.subtitle}
            </p>
          </div>
        </div>

        {/* Wizard Form Right Column */}
        <div className="w-full lg:w-7/12 relative z-20 flex flex-col">
          <OfferWizardLayout currentStep={currentStep} />
        </div>
      </div>
    </main>
  );
}
