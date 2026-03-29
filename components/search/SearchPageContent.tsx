"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import RideSearchWidget from "@/components/search/RideSearchWidget";
import RideCard from "@/components/search/RideCard";
import { IoFilterOutline, IoChevronDown, IoChevronUp } from "react-icons/io5";
import Alert from "../ui/Alert";
import { useSearchTrips } from "@/hooks/useTrips";
import { mapToRideData } from "@/lib/ride-mapper";
import RideCardSkeleton from "@/components/ui/RideCardSkeleton";
import RideSuggestions from "@/components/search/RideSuggestions";
import { Link } from "@/i18n/routing";
import { LuCar } from "react-icons/lu";

type SearchPageContentProps = {
  params: {
    [key: string]: string | string[] | undefined;
  };
};

type SortOption = "earliest" | "cheapest";

interface FilterState {
  sortBy: SortOption;
  instantBooking: boolean;
  petsAllowed: boolean;
  luggageAllowed: boolean;
  minPrice: number;
  maxPrice: number;
}

const DEFAULT_FILTERS: FilterState = {
  sortBy: "earliest",
  instantBooking: false,
  petsAllowed: false,
  luggageAllowed: false,
  minPrice: 0,
  maxPrice: 500,
};

// --- Composant Contenu des Filtres ---
interface FiltersContentProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function FiltersContent({ filters, onChange }: FiltersContentProps) {
  const isDefault = JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);

  const toggleSort = (option: SortOption) => {
    onChange({ ...filters, sortBy: option });
  };

  const toggleFilter = (
    key: keyof Omit<FilterState, "sortBy" | "minPrice" | "maxPrice">,
  ) => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    const value = Math.min(val, (filters.maxPrice || 500) - 10);
    onChange({ ...filters, minPrice: value });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    const value = Math.max(val, (filters.minPrice || 0) + 10);
    onChange({ ...filters, maxPrice: value });
  };

  const handleReset = () => {
    onChange(DEFAULT_FILTERS);
  };

  // Safety values
  const minP = filters.minPrice ?? 0;
  const maxP = filters.maxPrice ?? 500;

  return (
    <div className="space-y-8">
      {/* Header with Reset */}
      <div className="flex items-center justify-between h-4">
        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
          Trier par
        </h4>
        {!isDefault && (
          <button
            onClick={handleReset}
            className="text-[10px] font-bold text-primary hover:underline transition-all"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Trier par logic remains same but remove the double header */}
      <div className="space-y-4">
        <label
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => toggleSort("earliest")}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center bg-dark shrink-0 transition-colors ${filters.sortBy === "earliest" ? "border-primary" : "border-neutral-600 group-hover:border-neutral-400"}`}
          >
            {filters.sortBy === "earliest" && (
              <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
            )}
          </div>
          <span
            className={`text-sm font-bold transition-colors ${filters.sortBy === "earliest" ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"}`}
          >
            Départ le plus tôt
          </span>
        </label>
        <label
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => toggleSort("cheapest")}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center bg-dark shrink-0 transition-colors ${filters.sortBy === "cheapest" ? "border-primary" : "border-neutral-600 group-hover:border-neutral-400"}`}
          >
            {filters.sortBy === "cheapest" && (
              <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
            )}
          </div>
          <span
            className={`text-sm font-bold transition-colors ${filters.sortBy === "cheapest" ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"}`}
          >
            Prix le plus bas
          </span>
        </label>
      </div>

      <div className="h-px bg-neutral-800 w-full"></div>

      {/* Tranche de Prix */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
            Tranche de prix
          </h4>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
            {minP} - {maxP} $ CAD
          </span>
        </div>

        <div className="relative h-1 mb-8 bg-neutral-800 rounded-full flex items-center">
          {/* Track highlighted between thumbs */}
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${(minP / 500) * 100}%`,
              right: `${100 - (maxP / 500) * 100}%`,
            }}
          ></div>

          <input
            type="range"
            min="0"
            max="500"
            value={minP}
            onChange={handleMinPriceChange}
            className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer z-20 slider-thumb-only"
          />
          <input
            type="range"
            min="0"
            max="500"
            value={maxP}
            onChange={handleMaxPriceChange}
            className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer z-20 slider-thumb-only"
          />

          <style jsx>{`
            .slider-thumb-only {
              top: 50%;
              transform: translateY(-50%);
            }
            .slider-thumb-only::-webkit-slider-thumb {
              appearance: none;
              pointer-events: auto;
              width: 18px;
              height: 18px;
              background: #fff;
              border: 2px solid #3b82f6;
              border-radius: 50%;
              cursor: pointer;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              transition: all 0.2s;
            }
            .slider-thumb-only::-webkit-slider-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            }
            .slider-thumb-only::-moz-range-thumb {
              pointer-events: auto;
              width: 16px;
              height: 16px;
              background: #fff;
              border: 2px solid #3b82f6;
              border-radius: 50%;
              cursor: pointer;
            }
          `}</style>
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-[10px] font-bold text-neutral-600">
            0 $ CAD
          </span>
          <span className="text-[10px] font-bold text-neutral-600">
            500 $ CAD
          </span>
        </div>
      </div>

      <div className="h-px bg-neutral-800 w-full"></div>

      {/* Options de confort */}
      <div>
        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
          Options & Préférences
        </h4>
        <div className="space-y-4">
          {[
            { id: "instantBooking", label: "Réservation immédiate" },
            { id: "petsAllowed", label: "Animaux acceptés" },
            { id: "luggageAllowed", label: "Bagages inclus" },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => toggleFilter(item.id as any)}
            >
              <span
                className={`text-sm font-bold transition-colors ${filters[item.id as keyof FilterState] ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"}`}
              >
                {item.label}
              </span>
              <div
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 shadow-inner shrink-0 ${filters[item.id as keyof FilterState] ? "bg-primary" : "bg-neutral-800"}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${filters[item.id as keyof FilterState] ? "right-1" : "left-1"}`}
                ></div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Composant Dropdown (Mobile) ---
interface FiltersDropdownProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function FiltersDropdown({ filters, onChange }: FiltersDropdownProps) {
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
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const activeFiltersCount =
    (filters.instantBooking ? 1 : 0) +
    (filters.petsAllowed ? 1 : 0) +
    (filters.luggageAllowed ? 1 : 0) +
    ((filters.minPrice || 0) > 0 || (filters.maxPrice || 500) < 500 ? 1 : 0);

  return (
    <div className="relative mx-2 mb-4" ref={dropdownRef}>
      <button
        className="w-full flex items-center justify-between p-5 rounded-full bg-dark-900 text-white shadow border border-neutral-800 font-bold text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-colors select-none"
        type="button"
        aria-expanded={open}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2">
          <IoFilterOutline size={22} className="text-primary" />
          <span>Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
              {activeFiltersCount}
            </span>
          )}
        </div>
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
            ? "max-h-[1200px] opacity-100 scale-100"
            : "max-h-0 opacity-0 scale-95"
        }`}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <div className="bg-dark rounded-4xl p-6 shadow-xl border border-neutral-800 text-white">
          <FiltersContent filters={filters} onChange={onChange} />
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

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Requête API pour les trajets
  const {
    data: fetchTrips,
    isLoading,
    isError,
  } = useSearchTrips({ depart, arrivee, date: dateStr });

  // Filtrage et Tri côté client
  const displayRides = useMemo(() => {
    if (!fetchTrips) return [];

    let filtered = [...fetchTrips];

    // 1. Filtrer par prix (Range)
    const minP = filters.minPrice ?? 0;
    const maxP = filters.maxPrice ?? 500;
    filtered = filtered.filter(
      (trip) => trip.price >= minP && trip.price <= maxP,
    );

    // 2. Appliquer les toggles (Options/Préférences)
    if (filters.instantBooking) {
      filtered = filtered.filter((trip) => trip.instantBooking);
    }
    if (filters.petsAllowed) {
      filtered = filtered.filter((trip) => trip.pet);
    }
    if (filters.luggageAllowed) {
      filtered = filtered.filter((trip) => trip.luggage);
    }

    // 3. Appliquer le tri
    filtered.sort((a, b) => {
      if (filters.sortBy === "earliest") {
        return (
          new Date(a.departureDate).getTime() -
          new Date(b.departureDate).getTime()
        );
      } else if (filters.sortBy === "cheapest") {
        return a.price - b.price;
      }
      return 0;
    });

    return filtered.map(mapToRideData);
  }, [fetchTrips, filters]);

  const hasResults = displayRides.length > 0;

  return (
    <>
      <div className="w-full border-b border-neutral-100 z-40 pb-6 pt-4 px-4 lg:hidden">
        <div className="mt-4">
          <FiltersDropdown filters={filters} onChange={setFilters} />
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
            <FiltersContent filters={filters} onChange={setFilters} />
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

            {/* Empty state alert */}
            {!hasResults && !isLoading && !isError && (
              <div className="mt-8 mb-4">
                <Alert
                  type={fetchTrips?.length ? "info" : "warning"}
                  title={
                    fetchTrips?.length
                      ? "Aucun trajet ne correspond à vos filtres"
                      : "Aucun trajet trouvé"
                  }
                  description={
                    <div>
                      <div>
                        {fetchTrips?.length
                          ? "Nous n'avons trouvé aucun trajet correspondant à vos filtres. Essayez de les assouplir pour voir plus d'options."
                          : "Aucun trajet n'est planifié pour cette route le jour sélectionné. Soyez le premier à proposer ce voyage ou consultez nos suggestions."}
                      </div>
                      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link href="/offer" className="btn-dark py-2 px-4">
                          <LuCar size={20} />
                          Proposer ce trajet
                        </Link>
                        <button
                          onClick={() => setFilters(DEFAULT_FILTERS)}
                          className="btn-white py-2 px-4"
                        >
                          Réinitialiser les filtres
                        </button>
                      </div>
                    </div>
                  }
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

          {/* Always show suggestions at the bottom for better discovery */}
          {!isLoading && (
            <RideSuggestions depart={depart} arrivee={arrivee} date={dateStr} />
          )}
        </div>
      </main>
    </>
  );
}
