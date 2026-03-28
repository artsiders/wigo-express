"use client";

import { useRef, useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";
import OfferWizardLayout from "@/components/offer/OfferWizardLayout";
import Image from "next/image";
import gsap from "gsap";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/routing";
import { LuCar, LuShieldCheck, LuArrowRight } from "react-icons/lu";
import { useOfferStore } from "@/store/useOfferStore";
import dynamic from "next/dynamic";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OfferRideSchema, type OfferRideFormData } from "@/schemas/offer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import OfferSkeleton from "@/components/offer/OfferSkeleton";

const RouteMap = dynamic(() => import("@/components/search/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-light-400 flex items-center justify-center animate-pulse text-neutral-400 font-bold">
      Chargement de la carte...
    </div>
  ),
});

export default function OfferRidePage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const leftColRef = useRef<HTMLDivElement>(null);
  const { date: storeDate, time: storeTime } = useOfferStore();

  const methods = useForm<OfferRideFormData>({
    resolver: zodResolver(OfferRideSchema),
    defaultValues: {
      departureCity: "",
      arrivalCity: "",
      departureLat: 0,
      departureLng: 0,
      arrivalLat: 0,
      arrivalLng: 0,
      date: storeDate || "",
      time: storeTime || "08:00",
      seats: 3,
      price: 15,
      max2Back: false,
      instantBooking: true,
      petFriendly: false,
    },
    mode: "onChange",
  });

  const { watch } = methods;
  const departCoords = {
    lat: watch("departureLat"),
    lon: watch("departureLng"),
  };
  const arriveeCoords = { lat: watch("arrivalLat"), lon: watch("arrivalLng") };

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
    return <OfferSkeleton />;
  }

  const isDriver = (session?.user as any)?.isDriver;

  if (!isDriver && status === "authenticated") {
    return (
      <main className="container mx-auto px-4 mt-20 md:mt-32 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-3xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-neutral-100 flex flex-col items-center text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4D80C4]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

          <div className="w-24 h-24 rounded-3xl bg-[#4D80C4]/10 flex items-center justify-center text-[#4D80C4] mb-10 shadow-inner">
            <LuCar size={48} strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-6 text-dark tracking-tight leading-tight">
            Prêt à <span className="text-primary italic">conduire</span> ?
          </h1>

          <p className="text-xl text-neutral-500 font-medium mb-10 max-w-xl mx-auto leading-relaxed">
            Pour publier un trajet sur{" "}
            <span className="font-bold text-dark">Wigo Express</span>, vous
            devez d'abord compléter votre profil de Conducteur·rice dans votre
            espace privé.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link
              href="/profile?mode=become-driver"
              className="px-8 py-4 bg-dark text-white rounded-xl font-bold text-lg hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95 group"
            >
              Compléter mon profil Conducteur·rice
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
              <p className="text-sm font-bold text-neutral-600 leading-tight">
                Sécurité garantie pour tous
              </p>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                <LuCar size={20} />
              </div>
              <p className="text-sm font-bold text-neutral-600 leading-tight">
                Partagez vos frais de route
              </p>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <LuShieldCheck size={20} strokeWidth={3} />
              </div>
              <p className="text-sm font-bold text-neutral-600 leading-tight">
                Profil vérifié & certifié
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 mt-8 flex flex-col items-center">
      <div className="w-full mb-8">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Publier un trajet" },
          ]}
        />
        <div className="mt-6">
          <SectionHeader
            title="Publier un trajet"
            description="Partagez vos frais de route et voyagez en toute convivialité avec la communauté Wigo Express."
          />
        </div>
      </div>
      <div className="w-full container flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch">
        {/* Creative Left Column - Dynamic based on step */}
        <div
          ref={leftColRef}
          className="w-full lg:w-5/12 hidden lg:flex flex-col relative rounded-2xl overflow-hidden shadow-sm border border-neutral-100 bg-white"
        >
          {/* Top section: Media (Map or Image) */}
          <div className="relative w-full flex-1 min-h-[50%] bg-neutral-100">
            {currentStep === 3 ? (
              <RouteMap
                dLat={departCoords.lat || undefined}
                dLon={departCoords.lon || undefined}
                aLat={arriveeCoords.lat || undefined}
                aLon={arriveeCoords.lon || undefined}
              />
            ) : (
              <Image
                key={content.image}
                src={content.image}
                alt="Illustration de trajet"
                fill
                className="dynamic-image object-cover"
                priority
              />
            )}
            {/* Subtle gradient to transition into the white card smoothly */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white to-transparent pointer-events-none z-10"></div>
          </div>

          {/* Bottom section: Text card */}
          <div className="relative z-20 p-10 xl:p-12 bg-white flex flex-col shrink-0">
            <div className="dynamic-content w-12 h-1 bg-primary mb-6 rounded-full"></div>
            <h1 className="dynamic-content text-3xl xl:text-4xl font-black mb-4 leading-tight tracking-tight text-dark">
              {content.title}
            </h1>
            <p className="dynamic-content text-base xl:text-lg text-neutral-500 font-medium leading-relaxed max-w-sm">
              {content.subtitle}
            </p>
          </div>
        </div>

        {/* Wizard Form Right Column */}
        <div className="w-full lg:w-7/12 relative z-20 flex flex-col">
          <FormProvider {...methods}>
            <OfferWizardLayout currentStep={currentStep} />
          </FormProvider>
        </div>
      </div>
    </main>
  );
}
