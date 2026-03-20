import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoChevronForward } from "react-icons/io5";

export default function Navbar() {
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

        {/* Right CTAs */}
        <div className="flex gap-4 items-center">
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
