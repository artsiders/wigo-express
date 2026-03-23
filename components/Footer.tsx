"use client";
import { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Footer() {
  const tFooter = useTranslations("Footer");
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Footer Parallax Reveal
      gsap.fromTo(
        ".footer-content",
        { y: "-30%" },
        {
          y: "0%",
          ease: "none",
          scrollTrigger: {
            trigger: ".footer-wrapper",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    },
    { scope: container },
  );

  return (
    <footer
      ref={container as any}
      className="footer-wrapper relative z-0 bg-dark-900 text-white overflow-hidden rounded-t-[3rem] squircle"
    >
      {/* Subtle top glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-primary/20 rounded-full blur-[150px] pointer-events-none opacity-50"></div>

      <div className="footer-content container mx-auto px-6 pt-20 md:pt-28 pb-8 flex flex-col h-full relative z-10">
        <div className="flex flex-col xl:flex-row justify-between items-start gap-16 flex-1 border-b border-white/15 pb-20">
          {/* Brand & Mission */}
          <div className="xl:w-5/12 flex flex-col items-start pr-0 md:pr-10">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Wigo Express Logo"
                width={200}
                height={200}
                className="object-contain transition-transform"
                priority
              />
            </Link>
            <p className="text-neutral-400 text-lg md:text-xl font-light mb-10 max-w-sm leading-relaxed mt-6">
              {tFooter("mission")}
            </p>
          </div>

          {/* Liens essentiels seulement + Contact/Connex */}
          <div className="xl:w-7/12 w-full flex flex-col md:flex-row gap-12 justify-center">
            <div className="flex flex-col gap-3 flex-1">
              <h4 className="font-extrabold uppercase tracking-widest text-primary mb-2">
                {tFooter("usefulLinks")}
              </h4>
              <Link
                href="#"
                className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
              >
                {tFooter("searchRide")}
              </Link>
              <Link
                href="#"
                className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
              >
                {tFooter("offerRide")}
              </Link>
              <Link
                href="#"
                className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
              >
                {tFooter("about")}
              </Link>
              <Link
                href="#"
                className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
              >
                {tFooter("terms")}
              </Link>
              <Link
                href="#"
                className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
              >
                {tFooter("privacy")}
              </Link>
            </div>

            <div className="flex-1 min-w-[280px] max-w-md">
              <h4 className="font-extrabold uppercase tracking-widest text-primary mb-4">
                {tFooter("contact")}
              </h4>
              <div className="flex flex-col gap-3">
                <a
                  href="tel:+18001234567"
                  className="text-neutral-400 hover:text-white transition-all"
                >
                  {tFooter("phone")}
                </a>
              </div>

              <h4 className="font-extrabold uppercase tracking-widest text-primary mt-8 mb-4">
                {tFooter("login")}
              </h4>
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  {tFooter("login")}
                </Link>
                <Link
                  href="/register"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all"
                >
                  {tFooter("register")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs font-bold text-neutral-600 uppercase tracking-widest gap-6 mt-8">
          <span>
            © {new Date().getFullYear()} Wigo Express Inc. {tFooter("rights")}
          </span>
          <a
            href="https://altplus.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hidden"
          >
            créé par altplus
          </a>
        </div>
      </div>
    </footer>
  );
}
