import React, { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  IoWalletOutline,
  IoShieldCheckmarkOutline,
  IoCalendarOutline,
} from "react-icons/io5";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function DriverPitchSection() {
  const t = useTranslations("HomePage");
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Staggered Simple Reveals
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
    },
    { scope: container },
  );

  return (
    <section
      ref={container as any}
      id="conducteur"
      className="relative w-full bg-light-400 z-20 overflow-hidden py-32 border-t border-black/5"
    >
      <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[50vw] h-[20vw] bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-6 text-dark leading-tight reveal-fade">
            {t("driverTitle1")} <br />
            <span className="text-primary-gradient">{t("driverTitle2")}</span>
          </h2>
          <p className="text-neutral-600 text-lg md:text-xl font-semibold max-w-2xl mx-auto reveal-fade">
            {t("driverDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 w-full max-w-7xl">
          {/* Card 1 */}
          <div className="glass-panel rounded-2xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-500 reveal-fade relative overflow-hidden group">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-10 border border-primary/40">
              <IoWalletOutline className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dark mb-4 tracking-tight">
                {t("driverCard1Title")}
              </h3>
              <p className="text-neutral-600 font-medium leading-relaxed">
                {t("driverCard1Desc")}
              </p>
            </div>
          </div>

          {/* Card 2 : Highlighted Digital Experience */}
          <div className="bg-dark-900 text-white rounded-3xl squircle p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.2)] md:-translate-y-6 hover:-translate-y-8 transition-transform duration-500 reveal-fade relative overflow-hidden border border-white/10">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-10 border border-white/20 relative z-10">
              <IoShieldCheckmarkOutline className="w-7 h-7" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                {t("driverCard2Title")}
              </h3>
              <p className="text-neutral-300 font-medium leading-relaxed mb-6">
                {t("driverCard2Desc")}
              </p>
              <div className="w-full flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 bg-neutral-800 overflow-hidden relative shadow-lg"
                  >
                    <Image
                      src={`/images/avatar-${i}.webp`}
                      alt="Passager"
                      height={40}
                      width={40}
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 z-20 bg-dark text-xs font-bold flex items-center justify-center">
                  +2k
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel rounded-2xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-500 reveal-fade relative overflow-hidden group">
            <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-600 mb-10 border border-yellow-700/40">
              <IoCalendarOutline className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dark mb-4 tracking-tight">
                {t("driverCard3Title")}
              </h3>
              <p className="text-neutral-600 font-medium leading-relaxed">
                {t("driverCard3Desc")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center reveal-fade">
          <button className="btn-primary uppercase">{t("driverBtn")}</button>
        </div>
      </div>
    </section>
  );
}
