"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { IoArrowBack, IoCloseOutline } from "react-icons/io5";

import StepRouteAndDate from "./steps/StepRouteAndDate";
import StepOptionsAndPrice from "./steps/StepOptionsAndPrice";
import StepSummary from "./steps/StepSummary";

interface OfferWizardLayoutProps {
  currentStep: number;
}

export default function OfferWizardLayout({ currentStep }: OfferWizardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const containerRef = useRef<HTMLDivElement>(null);
  const [prevStep, setPrevStep] = useState(currentStep);

  // Animate passage inter-étapes
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Petite animation de slide/fade à chaque changement d'étape
      if (currentStep !== prevStep && containerRef.current) {
        const direction = currentStep > prevStep ? 30 : -30;
        
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, x: direction },
          { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
        );
        setPrevStep(currentStep);
      }
    });

    return () => ctx.revert();
  }, [currentStep, prevStep]);

  // Initial mount animation
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".wizard-header",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  const totalSteps = 3;

  const handleBack = () => {
    if (currentStep > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", (currentStep - 1).toString());
      router.push(`${pathname}?${params.toString()}`);
    } else {
      router.push("/");
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", (currentStep + 1).toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepRouteAndDate onNext={handleNext} />;
      case 2:
        return <StepOptionsAndPrice onNext={handleNext} />;
      case 3:
        return <StepSummary onBack={handleBack} />;
      default:
        return <StepRouteAndDate onNext={handleNext} />;
    }
  };

  return (
    <div className="w-full bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-neutral-100 overflow-hidden relative">
      {/* Header & Progression */}
      <div className="wizard-header px-8 lg:px-14 pt-8 lg:pt-10 pb-6 border-b border-light-400 bg-white z-10 sticky top-0">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-light-400 hover:bg-neutral-200 transition-colors text-dark"
          >
            <IoArrowBack size={20} />
          </button>
          <div className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
            Étape {currentStep} sur {totalSteps}
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-light-400 hover:bg-neutral-200 transition-colors text-dark"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-light-400 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div 
        ref={containerRef} 
        className="p-8 lg:p-14 min-h-[50vh]"
      >
        {renderStep()}
      </div>
    </div>
  );
}
