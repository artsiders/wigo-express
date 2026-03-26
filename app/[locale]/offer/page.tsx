"use client";

import React, { useRef, useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";
import OfferWizardLayout from "@/components/offer/OfferWizardLayout";
import Image from "next/image";
import gsap from "gsap";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/routing";
import { LuCar, LuShieldCheck, LuArrowRight } from "react-icons/lu";

export default function OfferRidePage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const leftColRef = useRef<HTMLDivElement>(null);

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
    if (leftColRef.current) {
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
  }, [currentStep]);



  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-light-300">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  const isDriver = (session?.user as any)?.isDriver;

  if (!isDriver && status === "authenticated") {
    return (
      <main className="container mx-auto px-4 mt-20 md:mt-32 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-3xl w-full bg-white rounded-[2.5rem] p-10 md:p-16 shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-neutral-100 flex flex-col items-center text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4D80C4]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

          <div className="w-24 h-24 rounded-3xl bg-[#4D80C4]/10 flex items-center justify-center text-[#4D80C4] mb-10 shadow-inner">
            <LuCar size={48} strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-6 text-dark tracking-tight leading-tight">
            Prêt à <span className="text-primary italic">conduire</span> ?
          </h1>

          <p className="text-xl text-neutral-500 font-medium mb-12 max-w-xl mx-auto leading-relaxed">
            Pour publier un trajet sur <span className="font-bold text-dark">Wigo Express</span>, vous devez d'abord compléter votre profil de conducteur dans votre espace privé.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link 
              href="/profile?mode=become-driver"
              className="px-10 py-5 bg-dark text-white rounded-2xl font-black text-lg shadow-2xl shadow-dark/20 hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95 group"
            >
              Compléter mon profil conducteur
              <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/"
              className="px-10 py-5 bg-neutral-100 text-dark rounded-2xl font-bold text-lg hover:bg-neutral-200 transition-all flex items-center justify-center"
            >
              Retour à l'accueil
            </Link>
          </div>

          <div className="mt-16 pt-10 border-t border-neutral-100 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                <LuShieldCheck size={20} />
              </div>
              <p className="text-sm font-bold text-neutral-600 leading-tight">Sécurité garantie pour tous</p>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                <LuCar size={20} />
              </div>
              <p className="text-sm font-bold text-neutral-600 leading-tight">Partagez vos frais de route</p>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <LuShieldCheck size={20} strokeWidth={3} />
              </div>
              <p className="text-sm font-bold text-neutral-600 leading-tight">Profil vérifié & certifié</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 mt-8 md:mt-12 md:px-8 lg:px-12 flex flex-col items-center">
      <div className="w-full container flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch">
        {/* Creative Left Column - Dynamic based on step */}
        <div
          ref={leftColRef}
          className="w-full lg:w-5/12 hidden lg:flex flex-col relative rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl border border-white border-opacity-50"
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
