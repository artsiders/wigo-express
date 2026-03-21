import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoChevronForward, IoGlobe, IoGlobeOutline } from "react-icons/io5";
import { IoChevronDownOutline } from "react-icons/io5";

export default function Navbar() {
  const [locale, setLocale] = useState<"fr" | "en">("fr");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLocaleSelect = (selected: "fr" | "en") => {
    setLocale(selected);
    setOpen(false);
    // Rajoutez ici la logique de changement de langue si besoin
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] container z-50 transition-all">
      <div className="nav-bg absolute inset-0 bg-white rounded-full border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-colors duration-1000"></div>
      <div className="relative z-10 px-6 py-3 md:py-4 flex justify-between items-center w-full">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Wigo Express Logo"
            width={70}
            height={70}
            className="object-contain transition-transform"
            priority
          />
        </Link>

        {/* Right CTAs */}
        <div className="flex gap-4 items-center">
          {/* Center Links */}
          <div className="hidden lg:flex gap-10 items-center text-sm font-semibold text-current opacity-80">
            <Link
              href="#comment-ca-marche"
              className="hover:text-primary hover:opacity-100 transition-all"
            >
              Comment ça marche
            </Link>
            <Link
              href="#voyageur"
              className="hover:text-primary hover:opacity-100 transition-all"
            >
              Côté Voyageur
            </Link>
            <Link
              href="#conducteur"
              className="hover:text-primary hover:opacity-100 transition-all"
            >
              Côté Conducteur
            </Link>
          </div>
          {/* Custom Language Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-1 px-3 py-1 rounded-md border border-gray-200 text-sm font-bold bg-white hover:border-primary focus:outline-none transition"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label="Sélection de la langue"
              type="button"
            >
              <IoGlobeOutline className="opacity-50" />
              <span>{locale.toUpperCase()}</span>
              <IoChevronDownOutline
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open && (
              <div
                className="absolute right-0 mt-2 min-w-[80px] bg-white border border-gray-200 rounded-md shadow-lg z-50 p-1"
                role="listbox"
              >
                <button
                  className={`w-full text-left px-2 py-1 text-sm hover:bg-primary/10 rounded-md ${
                    locale === "fr"
                      ? "font-extrabold text-primary"
                      : "font-semibold"
                  }`}
                  onClick={() => handleLocaleSelect("fr")}
                  role="option"
                  aria-selected={locale === "fr"}
                >
                  Français
                </button>
                <button
                  className={`w-full text-left px-2 py-1 text-sm hover:bg-primary/10 rounded-md ${
                    locale === "en"
                      ? "font-extrabold text-primary"
                      : "font-semibold"
                  }`}
                  onClick={() => handleLocaleSelect("en")}
                  role="option"
                  aria-selected={locale === "en"}
                >
                  Anglais
                </button>
              </div>
            )}
          </div>

          <Link
            href="/login"
            className="hidden md:flex font-bold text-sm text-current opacity-80 hover:opacity-100 hover:text-primary transition-all"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-primary text-white font-bold text-xs md:text-sm px-6 py-3 rounded-full hover:bg-dark transition-colors shadow-lg shadow-primary-500/20 flex items-center gap-2"
          >
            Nous rejoindre <IoChevronForward />
          </Link>
        </div>
      </div>
    </nav>
  );
}
