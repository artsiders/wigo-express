"use client";

import React, { useRef, useState, useEffect } from "react";
import RideSearchWidget from "@/components/search/RideSearchWidget";
import RideCard from "@/components/search/RideCard";
import { IoFilterOutline, IoChevronDown, IoChevronUp } from "react-icons/io5";
import Alert from "../ui/Alert";
import { useSearchTrips } from "@/hooks/useTrips";
import { mapToRideData } from "@/lib/ride-mapper";
import RideCardSkeleton from "@/components/ui/RideCardSkeleton";

type SearchPageContentProps = {
  params: {
    [key: string]: string | string[] | undefined;
  };
};

// --- Sous-composant Contenu des Filtres ---
function FiltersContent() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
          Trier par
        </h4>
        <div className="space-y-4">
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center bg-dark shrink-0">
              <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
            </div>
            <span className="text-sm font-bold text-white transition-colors">
              Départ le plus tôt
            </span>
          </label>
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="w-5 h-5 rounded-full border-2 border-neutral-600 group-hover:border-primary transition-colors flex items-center justify-center bg-dark shrink-0"></div>
            <span className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors">
              Prix le plus bas
            </span>
          </label>
        </div>
      </div>

      <div className="h-px bg-neutral-800 w-full"></div>

      <div>
        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
          Confort
        </h4>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors">
              Max. 2 à l&apos;arrière
            </span>
            <div className="w-11 h-6 bg-primary rounded-full relative shadow-inner shrink-0">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors">
              Réservation immédiate
            </span>
            <div className="w-11 h-6 bg-neutral-700 rounded-full relative shadow-inner shrink-0">
              <div className="absolute left-1 top-1 w-4 h-4 bg-neutral-400 rounded-full shadow-sm"></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

// --- Composant Dropdown (Mobile) ---
function FiltersDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        open &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // CRUCIAL : empêche le document de recevoir le clic
    setOpen((prev) => !prev);
  };

  return (
    <div className="relative mx-2 mb-4" ref={dropdownRef}>
      <button
        className="w-full flex items-center justify-between p-5 rounded-full bg-dark-900 text-white shadow border border-neutral-800 font-bold text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-colors select-none"
        type="button"
        aria-expanded={open}
        onClick={handleToggle}
      >
        <span className="flex items-center gap-2">
          <IoFilterOutline size={22} className="text-primary" />
          Filtres
        </span>
        <span className="flex items-center ml-2 relative w-6 h-6">
          <IoChevronDown
            size={22}
            className={`text-white transition-all duration-300 absolute ${open ? "rotate-180 opacity-0 invisible" : "rotate-0 opacity-100 visible"}`}
          />
          <IoChevronUp
            size={22}
            className={`text-white transition-all duration-300 absolute ${open ? "rotate-0 opacity-100 visible" : "rotate-180 opacity-0 invisible"}`}
          />
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out mt-3 ${
          open
            ? "max-h-[1000px] opacity-100 scale-100"
            : "max-h-0 opacity-0 scale-95"
        }`}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <div className="bg-dark rounded-4xl p-6 shadow-xl border border-neutral-800 text-white">
          <FiltersContent />
        </div>
      </div>
    </div>
  );
}

// --- Composant Principal de la Page ---
export default function SearchPageContent({ params }: SearchPageContentProps) {
  const depart = typeof params.depart === "string" ? params.depart : "";
  const arrivee = typeof params.arrivee === "string" ? params.arrivee : "";
  const dateStr = typeof params.date === "string" ? params.date : "";

  // Requête API pour les trajets
  const {
    data: fetchTrips,
    isLoading,
    isError,
  } = useSearchTrips({ depart, arrivee, date: dateStr });

  const displayRides = fetchTrips ? fetchTrips.map(mapToRideData) : [];
  const hasResults = displayRides.length > 0;

  return (
    <>
      <div className="w-full border-b border-neutral-100 z-40 pb-6 pt-4 px-4 lg:hidden">
        <div className="mt-4">
          <FiltersDropdown />
        </div>
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <RideSearchWidget variant="horizontal" />
        </div>
      </div>

      <main className="flex-1 container mx-auto w-full px-4 pt-0 sm:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6 self-start sticky top-28 z-30">
          <div className="hidden lg:block z-40">
            <RideSearchWidget variant="vertical" />
          </div>
          <div className="bg-dark rounded-xl p-6 md:p-8 shadow-xl border border-neutral-800 hidden lg:block text-white">
            <div className="flex items-center gap-3 mb-8 font-black text-white text-lg">
              <IoFilterOutline size={24} className="text-primary" />
              Trier & Filtrer
            </div>
            <FiltersContent />
          </div>
        </aside>

        <div className="flex-1 flex flex-col z-10 w-full">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-dark leading-tight flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              Trajets disponibles
              <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full self-start sm:self-auto">
                {displayRides.length} trajets
              </span>
            </h1>

            <p className="text-neutral-500 font-medium mt-2 text-lg">
              {depart && arrivee ? (
                <>
                  De <span className="text-dark font-bold">{depart}</span> vers{" "}
                  <span className="text-dark font-bold">{arrivee}</span>{" "}
                  {dateStr && (
                    <span>
                      le <span className="text-dark font-bold">{dateStr}</span>
                    </span>
                  )}
                </>
              ) : (
                "Découvrez tous nos trajets premium."
              )}
            </p>

            {!hasResults && !isLoading && (
              <div className="mt-8">
                <Alert
                  type="warning"
                  title="Aucun trajet ne correspond"
                  description="Explorez d'autres dates ou d'autres villes de départ."
                  className="w-full"
                />
              </div>
            )}
            {isError && (
              <div className="mt-8">
                <Alert
                  type="error"
                  title="Erreur de chargement"
                  description="Impossible de charger les trajets pour le moment."
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 w-full">
            {isLoading && (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <RideCardSkeleton key={i} />
                ))}
              </div>
            )}
            {!isLoading &&
              displayRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
          </div>

          <div className="mt-14 text-center">
            <button className="px-10 py-4 bg-white border-2 border-neutral-100 rounded-full shadow-sm text-sm font-bold text-dark hover:border-primary hover:text-primary transition-colors">
              Charger plus de trajets
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
