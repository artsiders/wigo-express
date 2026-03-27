import React, { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  IoLocationOutline,
  IoMapOutline,
  IoShieldCheckmarkOutline,
  IoStar,
  IoPersonOutline,
  IoIdCardOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { Link } from "@/i18n/routing";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function HowItWorksSection() {
  const t = useTranslations("HomePage");
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // 🌟 NARRATIVE SCROLL: STACKING CARDS
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
              start: () => `top ${96 + i * 32 + card.offsetHeight}`,
              end: () => `top ${96 + (i + 1) * 32}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container as any}
      id="comment-ca-marche"
      className="steps-container relative w-full bg-light z-20 py-16 border-t border-black/5 bg-[url(/images/bg-texture.png)]"
    >
      <div className="container mx-auto px-6 mb-10 text-center z-20 relative">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight text-dark text-center">
          {t("howItWorksTitle")}
        </h2>
      </div>

      <div className="container mx-auto px-6 relative pb-20">
        {/* Card 1 : Le bon départ */}
        <div className="stack-card sticky top-28 md:top-44 z-10 w-full min-h-[50vh] xl:min-h-[60vh] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-neutral-100 p-8 lg:p-14 xl:p-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-[8vh] overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[url('/images/carte-bg.webp')] bg-cover bg-center opacity-15"></div>
          {/* Background absolute text */}
          <div className="absolute top-18 -mt-10 left-18 text-[150px] lg:text-[250px] font-black text-dark opacity-[0.05] pointer-events-none leading-none z-0 tracking-tighter select-none">
            01
          </div>

          <div className="flex-1 w-full relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-6 leading-tight text-dark">
              {t("step1Title1")} <br />
              <span className="text-primary-gradient">{t("step1Title2")}</span>
            </h2>
            <p className="text-lg text-neutral-600 font-medium max-w-lg mb-8 leading-relaxed">
              {t("step1Desc")}
            </p>
            <Link
              href="/search?searchOpen=true"
              className="btn-secondary w-fit"
            >
              {t("step1Btn")}
            </Link>
          </div>

          <div className="flex-1 w-full relative z-10 flex flex-col justify-center">
            {/* Illus 1 : Search Map UI */}
            <div className="w-full bg-light rounded-xl shadow-xl border border-black/5 overflow-hidden flex flex-col relative aspect-square lg:aspect-auto lg:h-[650px]">
              <div className="w-full h-[55%] bg-light relative overflow-hidden shrink-0">
                <Image
                  src="/images/carte-illustration.webp"
                  alt="Carte avec des marqueurs"
                  fill
                  className="object-cover opacity-80 mix-blend-multiply grayscale-20%"
                />
                {/* Decorative map pins */}
                <div className="absolute top-1/3 left-1/3 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 bg-primary rounded-full shadow-lg border-2 border-white"></div>
                </div>
                <div className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-dark/10 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-dark rounded-full shadow-lg border-2 border-white"></div>
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-center bg-white space-y-4">
                <div className="bg-light p-4 rounded-2xl flex items-center gap-4 border border-black/5">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-neutral-100 flex items-center justify-center text-primary shrink-0">
                    <IoLocationOutline className="text-2xl" />
                  </div>
                  <div className="flex-1">
                    <div className="w-24 h-2.5 bg-neutral-200 rounded-full mb-2"></div>
                    <div className="w-40 h-3.5 bg-neutral-800 rounded-full max-w-[80%]"></div>
                  </div>
                </div>
                <div className="bg-light p-4 rounded-2xl flex items-center gap-4 border border-black/5">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-neutral-100 flex items-center justify-center text-primary shrink-0">
                    <IoMapOutline className="text-2xl" />
                  </div>
                  <div className="flex-1">
                    <div className="w-24 h-2.5 bg-neutral-200 rounded-full mb-2"></div>
                    <div className="w-32 h-3.5 bg-neutral-800 rounded-full max-w-[70%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 : Communauté de confiance */}
        <div className="stack-card sticky top-28 md:top-44 z-20 w-full min-h-[50vh] xl:min-h-[60vh] bg-dark-900 text-white rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.4)] border border-neutral-800 p-8 lg:p-14 xl:p-20 flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16 mb-[8vh] overflow-hidden">
          <div className="absolute top-18 -mt-10 right-18 text-[150px] lg:text-[250px] font-black text-white opacity-[0.06] pointer-events-none leading-none z-0 tracking-tighter select-none">
            02
          </div>

          <div className="flex-1 w-full relative z-10 flex flex-col lg:items-end lg:text-right">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-6 leading-tight text-white lg:text-right">
              {t("step2Title1")} <br />
              <span className="text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                {t("step2Title2")}
              </span>
            </h2>
            <p className="text-lg text-neutral-300 font-medium max-w-lg mb-8 leading-relaxed">
              {t("step2Desc")}
            </p>
            <div className="step-badge flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-max backdrop-blur-sm">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                <IoShieldCheckmarkOutline className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-white">
                  {t("step2Badge1")}
                </h4>
                <p className="text-xs text-neutral-300 font-medium">
                  {t("step2Badge2")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative z-10 flex flex-col items-center justify-center mt-10 lg:mt-0">
            {/* 3D Canadian Premium ID Card */}
            <div className="w-full max-w-lg aspect-[1.6] bg-white rounded-3xl p-2 relative z-20 transform -rotate-1 hover:rotate-0 hover:scale-[1.02] transition-all duration-500 mx-auto">
              <Image
                src="/images/canada-flag-icon.png"
                alt="Canada"
                width={300}
                height={300}
                className="object-contain absolute bottom-0 right-0 w-48 h-48 -rotate-45 opacity-10 pointer-events-none"
              />
              <div className="border border-neutral-200/60 rounded-2xl p-5 sm:p-7 h-full relative z-10 overflow-hidden text-left flex flex-col justify-between bg-white/50 backdrop-blur-xs">
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>

                <Image
                  src="/images/canada-flag.png"
                  alt="Canada"
                  width={36}
                  height={36}
                  className="object-contain"
                />

                {/* Profile row */}
                <div className="flex gap-5 sm:gap-6 items-center relative z-10">
                  <div className="w-24 h-24 sm:w-38 sm:h-38 aspect-square rounded-2xl overflow-hidden relative shadow-md shrink-0 border border-black/5">
                    <Image
                      src="/images/profile.jpg"
                      alt="Conducteur"
                      fill
                      className="object-cover bg-neutral-100"
                    />
                  </div>
                  <div className="space-y-1.5 w-full">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xl sm:text-3xl text-neutral-800 tracking-tight leading-none mb-1 block">
                        Jean Tremblay
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-700 text-[10px] sm:text-xs font-semibold uppercase rounded-lg tracking-widest leading-none mb-1 shadow-sm border border-green-500/20 w-max">
                      <IoShieldCheckmarkOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{" "}
                      Vérifié
                    </div>
                    <div className="flex items-center gap-1.5 text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <IoStar
                          key={i}
                          className="h-4 w-4 sm:h-5 sm:w-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                        />
                      ))}
                      <span className="font-bold text-neutral-700 ml-1.5 text-xs sm:text-sm">
                        4.8
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="flex justify-between items-end relative z-10 mt-3">
                  <div className="text-xs sm:text-sm text-neutral-500 font-medium whitespace-nowrap">
                    +150 trajets
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-white/80 text-[10px] sm:text-xs text-neutral-600 tracking-widest font-mono border border-neutral-200 font-bold shadow-inner inline-flex items-center whitespace-nowrap">
                    QC-928183****
                  </div>
                </div>
              </div>
            </div>

            {/* Steps Visual - Bauhaus Style (Fixed Alignment) */}
            <div className="flex items-start justify-between w-full max-w-[320px] mx-auto mt-12 px-2">
              {/* Step 1: Permis */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-neutral-900 text-neutral-400 border border-neutral-800">
                  <IoPersonOutline className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-medium tracking-tight text-neutral-500">
                  Permis
                </span>
              </div>

              {/* Separator 1 (Aligned with icon center) */}
              <div className="flex-1 h-[2px] mt-[28px] mx-2 bg-neutral-800 overflow-hidden">
                <div className="h-full w-full bg-neutral-600 origin-left scale-x-75" />
              </div>

              {/* Step 2: Selfie */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-neutral-900 text-neutral-400 border border-neutral-800">
                  <IoIdCardOutline className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-medium tracking-tight text-neutral-500">
                  Selfie
                </span>
              </div>

              {/* Separator 2 (Aligned with icon center) */}
              <div className="flex-1 h-[2px] mt-[28px] mx-2 bg-neutral-800" />

              {/* Step 3: Sécurisé (Active) */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white text-black scale-110 shadow-[0_10px_25px_-5px_rgba(255,255,255,0.2)]">
                  <IoShieldCheckmarkOutline className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-medium tracking-tight text-white">
                  Sécurisé
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 : Paiement */}
        <div className="stack-card sticky top-28 md:top-44 z-30 w-full min-h-[50vh] xl:min-h-[60vh] bg-linear-to-br from-primary-700 to-primary text-white rounded-2xl shadow-[0_30px_80px_rgba(37,99,235,0.4)] border border-blue-400/30 p-8 lg:p-14 xl:p-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 overflow-hidden">
          <div className="absolute top-18 -mt-10 left-18 text-[150px] lg:text-[250px] font-black text-white opacity-[0.06] pointer-events-none leading-none z-0 tracking-tighter select-none">
            03
          </div>
          {/* Soft background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="flex-1 w-full relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-6 leading-tight text-white">
              {t("step3Title1")} <br />
              {t("step3Title2")}
            </h2>
            <p className="text-lg text-white/90 font-medium max-w-lg mb-8 leading-relaxed">
              {t("step3Desc")}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                <IoWalletOutline className="text-xl" />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase text-white">
                {t("step3Garanti")}
              </span>
            </div>
          </div>

          <div className="flex-1 w-full relative z-10 flex flex-col justify-center items-center mt-6 lg:mt-0">
            {/* Illus 3 : Wigo Wallet */}
            <div className="w-full max-w-md">
              <div className="text-center flex flex-col justify-center pb-8 border-b border-white/10 mb-8">
                <h3 className="text-xs font-bold opacity-100 mb-2 uppercase tracking-widest text-white/90">
                  {t("step3Available")}
                </h3>
                <h2 className="text-5xl lg:text-7xl font-black mb-1 tracking-tighter drop-shadow-md text-white">
                  244.50 $
                </h2>
                <p className="text-sm font-bold text-white/90 tracking-wider">
                  CAD
                </p>
              </div>

              <div className="space-y-4 w-full">
                <div className="bg-white/10 w-full p-5 rounded-2xl backdrop-blur-md border border-white/20 flex justify-between items-center transform transition-all shadow-xl">
                  <div className="text-left">
                    <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1.5">
                      {t("step3ReceivedYesterday")}
                    </p>
                    <p className="font-bold text-sm tracking-tight text-white">
                      {t("step3Trip1")}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-black text-xl">+ 45.00 $</p>
                  </div>
                </div>
                <div className="bg-black/10 w-full p-4 rounded-xl backdrop-blur-md border border-transparent flex justify-between items-center opacity-70">
                  <div className="text-left">
                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1 text-white">
                      {t("step33DaysAgo")}
                    </p>
                    <p className="font-semibold text-sm text-white">
                      {t("step3Trip2")}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-bold text-lg text-white">- 35.00 $</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
