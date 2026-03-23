"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useTransition,
} from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import {
  IoChevronForward,
  IoGlobeOutline,
  IoChevronDownOutline,
} from "react-icons/io5";
import gsap from "gsap";

export default function Navbar() {
  const tCommon = useTranslations("common");
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef(null);

  // --- ANIMATION GSAP ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (menuOpen) {
        // Bloquer le scroll du corps
        document.body.style.overflow = "hidden";

        gsap.to(overlayRef.current, {
          clipPath: "circle(150% at 90% 5%)",
          duration: 1.2,
          ease: "expo.inOut",
        });

        // Animation des éléments du menu (Liens + Sélecteur de langue)
        gsap.fromTo(
          ".animate-item",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: "power4.out",
            delay: 0.4,
          },
        );
      } else {
        document.body.style.overflow = "";
        gsap.to(overlayRef.current, {
          clipPath: "circle(0% at 90% 5%)",
          duration: 0.8,
          ease: "expo.inOut",
        });
      }
    });
    return () => ctx.revert();
  }, [menuOpen]);

  // Fermeture du dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setLangOpen(false);
      }
    };
    if (langOpen) window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);

  const changeLanguage = (l: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: l });
    });
    setLangOpen(false);
  };

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] container z-100">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-full border border-black/5 shadow-2xl"></div>

        <div className="relative z-10 px-4 py-4 flex justify-between items-center w-full">
          {/* LOGO */}
          <Link href="/" className="shrink-0 transition-transform ml-1">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={50}
              height={50}
              priority
            />
          </Link>

          {/* ACTIONS DROITE */}
          <div className="flex gap-4 items-center">
            {/* DESKTOP NAV (Cachée sur mobile) */}
            <div className="hidden lg:flex gap-4 items-center text-sm font-bold text-dark-700">
              <Link
                href="/#comment-ca-marche"
                className="hover:text-primary text-dark transition-all flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white text-sm font-bold hover:shadow-md"
              >
                {t("howItWorks")}
              </Link>
              <Link
                href="/#voyageur"
                className="hover:text-primary text-dark transition-all flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white text-sm font-bold hover:shadow-md"
              >
                {tCommon("searchRide")}
              </Link>
              <Link
                href="/#conducteur"
                className="hover:text-primary text-dark transition-all flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white text-sm font-bold hover:shadow-md"
              >
                {tCommon("offerRide")}
              </Link>
            </div>
            {/* Langue Desktop Only */}
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white text-xs font-bold hover:shadow-md transition-all disabled:opacity-50"
              >
                <IoGlobeOutline size={18} className="text-primary" />
                <span>{locale.toUpperCase()}</span>
                <IoChevronDownOutline
                  className={`transition-transform ${langOpen ? "rotate-180" : ""}`}
                />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-3 min-w-[120px] bg-white border border-gray-50 rounded-2xl shadow-xl p-2">
                  {["fr", "en"].map((l) => (
                    <button
                      key={l}
                      onClick={() => changeLanguage(l)}
                      className={`w-full text-left px-4 py-2 text-sm rounded-xl transition-colors ${locale === l ? "bg-primary/10 text-primary font-bold" : "hover:bg-gray-50"}`}
                    >
                      {l === "fr" ? "Français" : "English"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/register"
              className="hidden sm:flex bg-primary text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-dark transition-all shadow-lg shadow-primary/20 items-center gap-2"
            >
              {tCommon("register")} <IoChevronForward />
            </Link>

            {/* BURGER (Visible UNIQUEMENT < lg) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col gap-1.5 z-110 p-2 focus:outline-none"
            >
              <span
                className={`h-0.5 w-6 bg-black rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2 bg-primary" : ""}`}
              />
              <span
                className={`h-0.5 w-6 bg-black rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-0.5 w-4 self-end bg-black rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2 w-6! bg-primary" : ""}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-white z-90 flex flex-col items-center justify-center p-8 pointer-events-none"
        style={{
          clipPath: "circle(0% at 90% 5%)",
          pointerEvents: menuOpen ? "all" : "none",
        }}
      >
        {/* Sélecteur de Langue MIS EN AVANT */}
        <div className="animate-item mb-12 w-full max-w-xs">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            {t("chooseLanguage")}
          </p>
          <div className="flex p-1 bg-gray-100 rounded-2xl border border-gray-200">
            {["fr", "en"].map((l) => (
              <button
                key={l}
                onClick={() => {
                  changeLanguage(l);
                }}
                className={`flex-1 py-4 rounded-xl text-lg font-black transition-all ${
                  locale === l
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-400"
                }`}
              >
                {l === "fr" ? "Français" : "English"}
              </button>
            ))}
          </div>
        </div>

        {/* Liens Mobile */}
        <div className="flex flex-col items-center gap-6">
          <Link
            href="/#comment-ca-marche"
            onClick={() => setMenuOpen(false)}
            className="animate-item text-2xl font-bold text-gray-900 hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white hover:shadow-md"
          >
            {t("howItWorks")}
          </Link>
          <Link
            href="/#voyageur"
            onClick={() => setMenuOpen(false)}
            className="animate-item text-2xl font-bold text-gray-900 hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white hover:shadow-md"
          >
            {tCommon("searchRide")}
          </Link>
          <Link
            href="/#conducteur"
            onClick={() => setMenuOpen(false)}
            className="animate-item text-2xl font-bold text-gray-900 hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white hover:shadow-md"
          >
            {tCommon("offerRide")}
          </Link>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="animate-item text-2xl font-bold text-gray-900 hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white hover:shadow-md"
          >
            {tCommon("login")}
          </Link>

          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            className="animate-item mt-6 bg-primary text-white text-xl font-bold px-12 py-5 rounded-full shadow-2xl shadow-primary/30"
          >
            {tCommon("registerMobile")}
          </Link>
        </div>
      </div>
    </>
  );
}
