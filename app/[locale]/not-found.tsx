"use client";

import React, { useRef } from "react";
import { Link } from "@/i18n/routing";
import {
  IoCompassOutline,
  IoHomeOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const container = useRef<HTMLDivElement>(null);
  const t = useTranslations("NotFound");

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".not-found-text",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
        "-=0.6",
      ).fromTo(
        ".not-found-btn",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.2)",
        },
        "-=0.4",
      );

      // Subtle floating animation for the compass icon
      gsap.to(".not-found-icon-inner", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="min-h-screen bg-[url(/images/bg-texture.png)] flex flex-col items-center justify-center p-6 relative overflow-hidden pt-20"
    >
      {/* Decorative blurry gradients equivalent to the core premium design */}
      <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        <h1 className="not-found-text text-[140px] md:text-[200px] font-black tracking-tighter leading-none text-primary-gradient select-none drop-shadow-xs mb-2 -mt-12 sm:-mt-16">
          404
        </h1>

        <h2 className="not-found-text text-3xl md:text-5xl font-bold tracking-tighter mb-4 sm:mb-6 text-dark leading-tight">
          {t("title1")} <br className="sm:hidden" />
          <span className="text-primary-gradient">{t("title2")}</span>
        </h2>

        <p className="not-found-text text-base md:text-xl text-neutral-500 font-medium mb-10 sm:mb-12 leading-relaxed max-w-lg mx-auto">
          {t("desc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/" className="btn-primary">
            <IoHomeOutline className="text-xl" /> {t("backHome")}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="not-found-btn px-8 py-4 text-sm font-bold text-dark bg-white border border-neutral-200 rounded-3xl shadow-sm hover:bg-neutral-50 hover:shadow-md transition-all duration-300 inline-flex items-center justify-center gap-2 group w-full sm:w-auto"
          >
            <IoArrowBackOutline className="text-xl group-hover:-translate-x-1 transition-transform duration-300" />{" "}
            {t("goBack")}
          </button>
        </div>
      </div>
    </div>
  );
}
