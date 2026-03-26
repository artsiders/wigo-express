"use client";

import React, { useRef } from "react";
import RideSearchWidget from "@/components/search/RideSearchWidget";
import RideCard, { RideData } from "@/components/search/RideCard";
import { IoFilterOutline, IoChevronDown, IoChevronUp } from "react-icons/io5";
import Alert from "../ui/Alert";
import RideSearchPopup from "@/components/search/RideSearchPopup";

// Extremely premium random mocked data
const MOCK_RIDES: RideData[] = [
  {
    id: "r1",
    driver: {
      name: "Alexandre Tremblay",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      rating: 4.9,
      reviewsCount: 124,
      isVerified: true,
    },
    departure: {
      city: "Montréal, QC",
      time: "08:00",
      place: "Station Berri-UQAM",
    },
    arrival: {
      city: "Québec, QC",
      time: "11:15",
      place: "Gare du Palais",
    },
    price: 45.0,
    currency: "$",
    seatsAvailable: 3,
    duration: "3h 15m",
    features: ["instant_booking", "max_2_back"],
  },
  {
    id: "r2",
    driver: {
      name: "Sophie Laurent",
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      rating: 5.0,
      reviewsCount: 89,
      isVerified: true,
    },
    departure: {
      city: "Montréal, QC",
      time: "10:30",
      place: "Université de Montréal",
    },
    arrival: {
      city: "Québec, QC",
      time: "13:45",
      place: "Université Laval",
    },
    price: 38.5,
    currency: "$",
    seatsAvailable: 1,
    duration: "3h 15m",
    features: ["max_2_back"],
  },
  {
    id: "r3",
    driver: {
      name: "Jean-Michel Côté",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      rating: 4.7,
      reviewsCount: 32,
      isVerified: false,
    },
    departure: {
      city: "Montréal, QC",
      time: "14:00",
      place: "Station Namur",
    },
    arrival: {
      city: "Laval, QC",
      time: "14:45",
      place: "Carrefour Laval",
    },
    price: 15.0,
    currency: "$",
    seatsAvailable: 4,
    duration: "45m",
    features: ["instant_booking"],
  },
];

type SearchPageContentProps = {
  params: {
    [key: string]: string | string[] | undefined;
  };
};

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

function FiltersDropdown() {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        open &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
    if (e.key === " " || e.key === "Enter") setOpen((v) => !v);
  }

  return (
    <div className="relative mx-2 mb-4" ref={dropdownRef}>
      <button
        className="w-full flex items-center justify-between p-5 rounded-full bg-dark-900 text-white shadow border border-neutral-800 font-bold text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-colors list-none select-none"
        type="button"
        aria-expanded={open}
        aria-controls="filters-dropdown-content"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
      >
        <span className="flex items-center gap-2">
          <IoFilterOutline size={22} className="text-primary" />
          Filtres
        </span>
        <span className="flex items-center ml-2">
          <IoChevronDown
            size={22}
            className={`text-white transition-transform duration-300${open ? " rotate-180 opacity-0 pointer-events-none" : ""}`}
            aria-hidden={open}
          />
          <IoChevronUp
            size={22}
            className={`text-white transition-transform duration-300 absolute${open ? " opacity-100 static" : " opacity-0 pointer-events-none"}`}
            style={{
              marginLeft: open ? 0 : -22,
              position: open ? "static" : "absolute",
            }}
            aria-hidden={!open}
          />
        </span>
      </button>
      <div
        id="filters-dropdown-content"
        aria-hidden={!open}
        style={{
          pointerEvents: open ? "auto" : "none",
          height: open ? "auto" : 0,
        }}
        className={`overflow-hidden transition-all duration-400 ease-in-out mt-3 ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="bg-dark rounded-4xl squircle p-6 shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-neutral-800 text-white">
          <FiltersContent />
        </div>
      </div>
    </div>
  );
}

export default function SearchPageContent({ params }: SearchPageContentProps) {
  const depart = typeof params.depart === "string" ? params.depart : "";
  const arrivee = typeof params.arrivee === "string" ? params.arrivee : "";
  const dateStr = typeof params.date === "string" ? params.date : "";

  const initialSearchOpen = params.searchOpen === "true";

  // Filter mocked rides (naive implementation for demo)
  let filteredRides = MOCK_RIDES;

  // Actually filter the mock data if query params match some of our cities.
  if (depart) {
    filteredRides = filteredRides.filter((r) =>
      r.departure.city.toLowerCase().includes(depart.toLowerCase()),
    );
  }
  if (arrivee) {
    filteredRides = filteredRides.filter((r) =>
      r.arrival.city.toLowerCase().includes(arrivee.toLowerCase()),
    );
  }

  // If filtered is empty, we just show all of them with a message for the demo
  const hasResults = filteredRides.length > 0;
  const displayRides = hasResults ? filteredRides : MOCK_RIDES;
  return (
    <>
      <RideSearchPopup initialOpen={initialSearchOpen} />
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
          <div className="bg-dark rounded-xl squircle p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-neutral-800 hidden lg:block text-white">
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
            {depart && arrivee ? (
              <p className="text-neutral-500 font-medium mt-2 text-lg">
                De <span className="text-dark font-bold">{depart}</span> vers{" "}
                <span className="text-dark font-bold">{arrivee}</span>{" "}
                {dateStr && (
                  <span>
                    le <span className="text-dark font-bold">{dateStr}</span>
                  </span>
                )}
              </p>
            ) : (
              <p className="text-neutral-500 font-medium mt-2 text-lg">
                Découvrez tous nos trajets premium.
              </p>
            )}

            {!hasResults && (
              <div className="mt-8">
                <Alert
                  type="warning"
                  title="Aucun trajet ne correspond"
                  description={
                    <>
                      Nous n&apos;avons pas trouvé de trajet exact. Voici
                      quelques suggestions populaires que vous pourriez aimer à
                      la place.
                    </>
                  }
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 w-full">
            {displayRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <button className="px-10 py-4 bg-white border-2 border-neutral-100 rounded-full shadow-sm text-sm font-bold text-dark hover:border-primary hover:text-primary transition-colors hover:shadow-md">
              Charger plus de trajets
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
