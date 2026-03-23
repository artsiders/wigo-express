import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  IoSearchOutline,
  IoLocationOutline,
  IoMapOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoArrowForwardOutline,
  IoShieldCheckmarkOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

export default function HeroSection() {
  const t = useTranslations("HomePage");

  return (
      <section className="relative bg-[url(/images/bg-texture.png)] min-h-screen pt-36 md:pt-40 pb-20 px-6 flex flex-col items-center justify-center">
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-10 left-10 w-[30vw] h-[30vw] bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="hero-text-elem uppercase relative text-center text-4xl font-black sm:text-5xl lg:text-7xl max-w-7xl container mx-auto justify-center leading-tight md:mt-16 mb-8">
            {t("heroTitle1")}
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-br from-primary to-primary-900">
              {t("heroTitle2")} <br />
              {t("heroTitle3")}
            </span>
          </h1>

          <p className="hero-text-elem text-lg md:text-xl opacity-80 font-medium mb-16 max-w-2xl leading-relaxed">
            {t("heroSubtitle")}
          </p>

          {/* Web Search Widget - The Core Tool */}
          <div className="flex flex-col items-start capitalize text-lg gap-2">
            <p className="ml-4 bg-white py-1 px-4 rounded-full shadow-sm border border-neutral-100 flex items-center justify-center gap-1">
              <IoSearchOutline size={16} />
              trouver un trajet
            </p>
            <div className="search-widget w-full max-w-5xl bg-white p-3 md:p-4 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.06)] border border-neutral-100 flex flex-col lg:flex-row items-center gap-3 mb-10">
              <div className="flex-1 w-full bg-light-400 rounded-3xl flex items-center px-6 py-4 border border-transparent focus-within:bg-white focus-within:border-primary-500/40 transition-colors shadow-inner group">
                <IoLocationOutline className="text-2xl text-neutral-400 group-focus-within:text-primary" />
                <div className="ml-4 w-full text-left">
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    {t("searchDeparture")}
                  </span>
                  <input
                    type="text"
                    placeholder={t("searchDeparturePlaceholder")}
                    className="w-full bg-transparent text-lg font-bold text-dark outline-none placeholder:text-neutral-300"
                  />
                </div>
              </div>
              <div className="hidden lg:flex w-12 h-12 rounded-full bg-white shadow-md border border-neutral-100 items-center justify-center shrink-0 -mx-6 z-10 text-neutral-400 font-black">
                <IoArrowForwardOutline />
              </div>
              <div className="flex-1 w-full bg-light-400 rounded-3xl flex items-center px-6 py-4 border border-transparent focus-within:bg-white focus-within:border-primary-500/40 transition-colors shadow-inner group">
                <IoMapOutline className="text-2xl text-neutral-400 group-focus-within:text-primary" />
                <div className="ml-4 w-full text-left">
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    {t("searchArrival")}
                  </span>
                  <input
                    type="text"
                    placeholder={t("searchArrivalPlaceholder")}
                    className="w-full bg-transparent text-lg font-bold text-dark outline-none placeholder:text-neutral-300"
                  />
                </div>
              </div>
              <div className="w-full lg:w-auto flex gap-3">
                <div className="flex-1 lg:w-40 bg-light-400 rounded-3xl flex items-center px-6 py-4 hover:bg-neutral-200 transition-colors cursor-pointer group">
                  <IoCalendarOutline className="text-xl text-neutral-400 group-hover:text-primary" />
                  <div className="ml-3 text-left">
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      {t("searchDate")}
                    </span>
                    <span className="block text-sm font-bold truncate">
                      {t("searchDateToday")}
                    </span>
                  </div>
                </div>
                <div className="flex-1 lg:w-32 bg-light-400 rounded-3xl flex items-center px-6 py-4 hover:bg-neutral-200 transition-colors cursor-pointer group">
                  <IoPersonOutline className="text-xl text-neutral-400 group-hover:text-primary" />
                  <div className="ml-3 text-left">
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      {t("searchSeats")}
                    </span>
                    <span className="block text-sm font-bold">1</span>
                  </div>
                </div>
              </div>
              <button className="w-full lg:w-auto btn-primary px-10 py-6.5">
                <IoSearchOutline size={18} />{" "}
                <span className="lg:hidden">{t("searchButton")}</span>
              </button>
            </div>
          </div>

          {/* Dashboard Preview & Floating UI Cards Container */}
          <div className="relative w-full max-w-7xl mt-18 z-20">
            {/* Main Web Dashboard Visual Preview */}
            <div
              className="hero-floating-img w-full h-[400px] md:h-[680px] bg-white rounded-3xl border-t border-x shadow-[0_0_80px_rgba(0,0,0,0.05)] border-neutral-100 overflow-hidden relative float-parallax z-10"
              data-speed="0.5"
            >
              <div className="relative w-full h-full">
                <Image
                  src="/images/close-up-group-friends-traveling-car-concept-speed.webp"
                  alt="Capture d'écran conceptuelle (Web UI) d'un tableau de bord de covoiturage premium WIGO EXPRESS, affichant une carte interactive claire, des listes de trajets élégantes et des profils vérifiés, tons blanc et bleu."
                  fill
                  className="object-cover object-center opacity-90"
                />
              </div>
            </div>

            {/* Floating UI Card 1: Verified Profile */}
            <div className="floating-card absolute -left-4 md:-left-12 lg:-left-20 top-[-2%] z-20 bg-white/90 backdrop-blur-xl p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-white/60 w-56 md:w-64 text-left hidden sm:block">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-md shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                    fill
                    alt="Driver"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-dark leading-tight mb-1">
                    {t("verifiedProfile")}
                  </h4>
                  <p className="text-[10px] md:text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                    <IoShieldCheckmarkOutline className="text-base text-green-600 " />{" "}
                    {t("wigoIdentity")}
                  </p>
                </div>
              </div>
              <div className="bg-light rounded-xl p-3 flex justify-between items-center border border-black/5 shadow-inner">
                <span className="text-[10px] md:text-xs text-neutral-500 font-medium">
                  {t("globalRating")}
                </span>
                <span className="text-[10px] md:text-xs font-black text-dark flex items-center gap-1">
                  4.9/5 ★
                </span>
              </div>
            </div>

            {/* Floating UI Card 2: Instant Payment */}
            <div className="floating-card absolute -right-4 md:-right-8 lg:-right-16 top-[15%] lg:top-[25%] z-30 bg-dark/95 backdrop-blur-xl p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_30px_60px_rgba(37,99,235,0.15)] border border-neutral-800/80 w-48 md:w-56 text-left hidden sm:block">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <IoWalletOutline className="text-lg md:text-xl" />
                </div>
                <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">
                  {t("wigoPayment")}
                </h4>
              </div>
              <p className="text-3xl md:text-4xl font-black text-white mb-2 leading-none">
                45
                <span className="text-xl md:text-2xl text-neutral-500">
                  .00 $
                </span>
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <p className="text-[10px] md:text-xs text-neutral-400 font-medium">
                  {t("receivedJustNow")}
                </p>
              </div>
            </div>

            {/* Floating UI Card 3: Route Match */}
            <div className="floating-card absolute left-[5%] lg:left-[8%] bottom-[5%] lg:bottom-[8%] z-30 bg-white/90 backdrop-blur-xl p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-white/60 w-56 md:w-64 text-left hidden sm:block">
              <div className="bg-primary-500/10 mb-4 text-primary-500 text-[9px] md:text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                {t("perfectMatch")}
              </div>

              <div className="space-y-4 relative ml-1">
                <div className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-0.5 bg-neutral-200"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary ring-4 ring-white shadow-sm shrink-0"></div>
                  <p className="text-sm md:text-base font-bold text-dark">
                    Montréal, QC
                  </p>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-dark ring-4 ring-white shadow-sm shrink-0"></div>
                  <p className="text-sm md:text-base font-bold text-dark">
                    Québec, QC
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  );
}
