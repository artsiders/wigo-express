import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { IoShieldCheckmarkOutline, IoWalletOutline } from "react-icons/io5";

import RideSearchWidget from "../search/RideSearchWidget";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function HeroSection() {
  const t = useTranslations("HomePage");
  const container = useRef<HTMLElement>(null);

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

      // 2.5. Floating UI Cards Entrance Timeline
      gsap.utils.toArray(".floating-card").forEach((card: any, index) => {
        const yOffset = index === 0 ? 80 : index === 1 ? -60 : 40;
        const xOffset = index === 0 ? -40 : index === 1 ? 40 : -20;

        tl.fromTo(
          card,
          { opacity: 0, y: yOffset, x: xOffset, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(1.2)",
          },
          index === 0 ? "-=0.5" : "-=0.8",
        );
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative w-full p-4 md:p-6 flex flex-col items-center justify-center bg-[url(/images/bg-texture.png)]"
    >
      <div className="relative w-full flex flex-col p-4 md:p-12 lg:p-20 hero-floating-img group z-20">
        {/* Inner Wrapper for the background */}
        <div className="absolute inset-0 rounded-xl md:rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-black/5 z-0">
          {/* Abstract shapes behind container if needed */}
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/4 z-0"></div>
          <div className="absolute bottom-10 left-10 w-[30vw] h-[30vw] bg-yellow-400/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

          {/* Background Image */}
          <div
            className="absolute inset-0 z-0 float-parallax"
            data-speed="0.15"
          >
            <Image
              src="/images/close-up-group-friends-traveling-car-concept-speed.webp"
              alt="Hero Background"
              fill
              className="object-cover object-center scale-105"
              priority
            />
          </div>

          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-linear-to-r from-dark-900/95 via-dark-900/60 to-black/20 z-0 pointer-events-none"></div>
        </div>

        {/* Content Container */}
        <div className="relative container mx-auto z-10 w-full flex flex-col h-full justify-between flex-1">
          {/* Headline, subtitle, and floating cards in flex on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-18 md:mt-14 lg:px-6">
            {/* Headline + Tag */}
            <div className="max-w-xl lg:max-w-2xl shrink-0 text-left">
              {/* Headline */}
              <h1 className="hero-text-elem text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-6 text-white leading-tight reveal-fade text-left">
                {t("heroTitle1")}{" "}
                <span className="text-primary-400 block lg:inline">
                  {t("heroTitle2")} <br className="lg:hidden" />
                  {t("heroTitle3")}
                </span>
              </h1>
              {/* Tag */}
              <div className="max-w-lg py-1 md:py-4 px-3 md:px-5 rounded-xl border border-white/10 bg-dark/20 text-white backdrop-blur-2xl text-base font-semibold tracking-widest shadow-xl hero-text-elem text-left">
                {t.rich("heroSubtitle", {
                  br: () => <br />,
                })}
              </div>
            </div>

            {/* Floating Cards */}
            <div className="flex flex-col gap-4 flex-1 items-stretch lg:mt-4 lg:ml-auto">
              {/* Floating UI Card 1: Verified Profile */}
              <div className="floating-card bg-white/95 backdrop-blur-xl p-4 md:p-5 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-white/60 w-full max-w-xs text-left hidden xl:flex flex-col mx-auto lg:mx-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden shadow-md shrink-0 border border-black/5">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                      fill
                      alt="Driver"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-dark leading-tight mb-0.5">
                      {t("verifiedProfile")}
                    </h4>
                    <p className="text-[10px] md:text-xs font-bold flex items-center gap-1 uppercase tracking-widest text-dark-600">
                      <IoShieldCheckmarkOutline className="text-sm text-green-600 " />
                      {t("wigoIdentity")}
                    </p>
                  </div>
                </div>
                <div className="bg-light rounded-xl p-3 flex justify-between items-center border border-black/5 shadow-inner mt-auto">
                  <span className="text-[10px] md:text-xs text-neutral-600 font-medium tracking-wide">
                    {t("globalRating")}
                  </span>
                  <span className="text-xs font-bold text-dark flex items-center gap-1">
                    4.9/5 ★
                  </span>
                </div>
              </div>

              {/* Floating UI Card 2: Instant Payment */}
              <div className="floating-card bg-dark/95 backdrop-blur-xl p-5 md:p-5 rounded-2xl shadow-[0_30px_60px_rgba(37,99,235,0.15)] border border-neutral-800/80 w-full max-w-xs text-left flex-col mx-auto lg:mx-0 hidden xl:flex">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <IoWalletOutline className="text-lg md:text-xl" />
                  </div>
                  <h4 className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest leading-tight">
                    {t("wigoPayment")}
                  </h4>
                </div>
                <p className="text-3xl md:text-4xl font-black text-white mb-2 flex items-baseline leading-none">
                  45
                  <span className="text-xl md:text-2xl text-neutral-500 ml-1">
                    .00 $
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-neutral-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80"></div>
                  <p className="text-[10px] md:text-xs text-neutral-300 font-medium tracking-wide">
                    {t("receivedJustNow")}
                  </p>
                </div>
              </div>

              {/* Floating UI Card 3: Route Match */}
              <div className="floating-card bg-white/95 backdrop-blur-xl p-4 md:p-5 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-white/60 w-full max-w-xs text-left flex-col mx-auto lg:mx-0 hidden lg:flex">
                <div className="bg-primary-500/10 mb-3 text-primary-700 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest w-max">
                  {t("perfectMatch")}
                </div>
                <div className="space-y-3 relative ml-1 mt-auto">
                  <div className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-0.5 bg-neutral-200"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary ring-4 ring-white shadow-sm shrink-0 mt-0.5"></div>
                    <p className="text-xs md:text-sm font-bold text-dark">
                      Montréal, QC
                    </p>
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-dark ring-4 ring-white shadow-sm shrink-0 mt-0.5"></div>
                    <p className="text-xs md:text-sm font-bold text-dark">
                      Québec, QC
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Widget Container */}
          <div className="w-full mt-auto mb-4  md:pt-12 relative z-30 search-widget container mx-auto flex flex-col items-center lg:px-6">
            <RideSearchWidget variant="horizontal" />
          </div>
        </div>
      </div>
    </section>
  );
}
