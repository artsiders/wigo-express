"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OfferWizardLayout from "@/components/offer/OfferWizardLayout";
import { LuLoaderCircle } from "react-icons/lu";

export default function OfferRidePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Vérification basique de l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const isAuthenticated = localStorage.getItem("auth_token") !== null; 
      
      if (!isAuthenticated) {
        // Redirection vers le login si non connecté (bypassed for testing)
        setIsCheckingAuth(false);
      } else {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const stepParam = searchParams?.get("step");
  const currentStep = stepParam ? parseInt(stepParam, 10) : 1;

  if (isCheckingAuth) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LuLoaderCircle size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto mt-2 md:mt-12 px-4 md:px-8 lg:px-12 flex flex-col items-center">
      <div className="w-full max-w-4xl relative z-20">
         <OfferWizardLayout currentStep={currentStep} />
      </div>
    </main>
  );
}
