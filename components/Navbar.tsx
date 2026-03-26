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
  IoPersonOutline,
  IoLogOutOutline,
  IoListOutline,
} from "react-icons/io5";
import gsap from "gsap";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const tCommon = useTranslations("common");
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { data: session, status } = useSession();

  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
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

  // Fermeture des dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setLangOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    if (langOpen || userMenuOpen)
      window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen, userMenuOpen]);

  const changeLanguage = (l: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: l });
    });
    setLangOpen(false);
  };

  return (
    <>
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[96%] container mx-auto z-100 flex items-center pointer-events-none">
        {/* UNIFIED NAVBAR */}
        <div className="pointer-events-auto relative w-full z-10 px-3  h-20 flex items-center justify-between bg-white rounded-xl md:rounded-2xl border border-black/5 shadow-xl transition-all">
          {/* LEFT SECTION (Logo + Nav + Lang) */}
          <div className="flex items-center gap-6 lg:gap-8 h-full">
            {/* LOGO */}
            <Link
              href="/"
              className="shrink-0 transition-transform flex items-center"
            >
              <Image
                src="/images/logo.webp"
                alt="Logo"
                width={140}
                height={50}
                priority
                className="lg:w-[160px] w-[130px] h-auto object-contain md:ml-2"
              />
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex gap-2 xl:gap-3 items-center text-sm font-bold text-dark-800">
              <Link
                href="/#comment-ca-marche"
                className="hover:text-primary text-dark font-bold transition-all px-4 py-2 rounded-xl hover:border-primary/50 hover:bg-primary/5 bg-white/50"
              >
                {t("howItWorks")}
              </Link>
              <Link
                href="/search?searchOpen=true"
                className="hover:text-primary text-dark font-bold transition-all px-4 py-2 rounded-xl hover:border-primary/50 hover:bg-primary/5 bg-white/50"
              >
                {tCommon("searchRide")}
              </Link>
              <Link
                href={
                  (session?.user as any)?.isDriver
                    ? "/offer"
                    : pathname === "/become-driver"
                      ? "#"
                      : "/become-driver?mode=become-driver"
                }
                className="hover:text-primary text-dark font-bold transition-all px-4 py-2 rounded-xl hover:border-primary/50 hover:bg-primary/5 bg-white/50 flex items-center gap-2 group"
              >
                {tCommon("offerRide")}
              </Link>
            </div>
          </div>

          {/* RIGHT SECTION (Auth/Profile + Burger) */}
          <div className="flex items-center h-full gap-2 md:gap-3">
            {/* LANGUE */}
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                disabled={isPending}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-300 hover:border-primary/50 hover:bg-primary/5 text-dark text-xs font-bold uppercase transition-all disabled:opacity-50 bg-white/50"
              >
                <IoGlobeOutline size={18} className="text-primary" />
                <span>{locale}</span>
                <IoChevronDownOutline
                  className={`transition-transform opacity-50 ${langOpen ? "rotate-180" : ""}`}
                />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-3 min-w-[120px] bg-white border border-neutral-200 rounded-lg shadow-xl p-2 z-50">
                  {["fr", "en"].map((l) => (
                    <button
                      key={l}
                      onClick={() => changeLanguage(l)}
                      className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${locale === l ? "bg-primary/10 text-primary font-bold" : "hover:bg-gray-50"}`}
                    >
                      {l === "fr" ? "Français" : "English"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {status === "loading" ? (
              <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse hidden sm:block mx-2"></div>
            ) : status === "authenticated" && session.user ? (
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-primary/10 py-1.5 pl-2 pr-3 rounded-lg hover:border-primary/50 hover:bg-primary/20 font-semibold text-sm transition-all"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden shadow-sm">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <span>
                        {session.user.name?.[0]?.toUpperCase() || (
                          <IoPersonOutline />
                        )}
                      </span>
                    )}
                  </div>
                  <span className="max-w-[100px] truncate">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <IoChevronDownOutline
                    className={`transition-transform text-neutral-600 ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-neutral-200 rounded-lg shadow-xl p-2 flex flex-col z-50">
                    <Link
                      href="/my-trajets"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-dark hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <IoListOutline size={18} className="text-primary" />
                      Mes trajets
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-dark hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <IoPersonOutline size={18} className="text-primary" />
                      Mon compte
                    </Link>
                    <div className="h-px bg-gray-100 my-1 mx-2"></div>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-md transition-colors text-left"
                    >
                      <IoLogOutOutline size={18} />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 px-1.5">
                <Link
                  href="/login"
                  className="text-dark font-bold text-sm px-4 py-2 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  {tCommon("login")}
                </Link>
                <Link href="/register" className="btn-secondary">
                  {tCommon("register")} <IoChevronForward />
                </Link>
              </div>
            )}

            {/* BURGER (Visible UNIQUEMENT < lg) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col items-center justify-center gap-1.5 p-2 px-3 focus:outline-none w-12 h-10"
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
          <div className="flex p-1 bg-gray-100 rounded-2xl border border-gray-300">
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
            className="animate-item text-2xl font-bold text-gray-900 hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 bg-white hover:shadow-md"
          >
            {t("howItWorks")}
          </Link>
          <Link
            href="/search?searchOpen=true"
            onClick={() => setMenuOpen(false)}
            className="animate-item text-2xl font-bold text-gray-900 hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 bg-white hover:shadow-md"
          >
            {tCommon("searchRide")}
          </Link>
          <Link
            href="/profile"
            onClick={() => setMenuOpen(false)}
            className="animate-item text-2xl font-bold text-gray-900 hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 bg-white hover:shadow-md"
          >
            Mon Profil
          </Link>
          <Link
            href={
              (session?.user as any)?.isDriver
                ? "/offer"
                : "/become-driver?mode=become-driver"
            }
            onClick={() => setMenuOpen(false)}
            className="animate-item text-2xl font-bold text-gray-900 hover:text-primary transition-colors flex items-center justify-between gap-4 px-6 py-3 rounded-xl border border-gray-100 bg-white hover:shadow-md w-full"
          >
            <span>{tCommon("offerRide")}</span>
          </Link>
          {status === "authenticated" && session?.user ? (
            <>
              <Link
                href="/my-trajets"
                onClick={() => setMenuOpen(false)}
                className="animate-item text-xl font-bold text-gray-900 hover:text-primary transition-colors flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-100 bg-white hover:shadow-md"
              >
                <IoListOutline /> Mes trajets
              </Link>
              <button
                onClick={() => signOut()}
                className="animate-item mt-6 bg-rose-600 text-white text-lg font-bold px-12 py-4 rounded-xl shadow-2xl shadow-red-500/30 flex items-center gap-2"
              >
                <IoLogOutOutline /> Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="animate-item text-2xl font-bold text-gray-900 hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 bg-white hover:shadow-md"
              >
                {tCommon("login")}
              </Link>

              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="animate-item mt-6 bg-primary text-white text-xl font-bold px-12 py-5 rounded-xl shadow-2xl shadow-primary/30"
              >
                {tCommon("registerMobile")}
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
