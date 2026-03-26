"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IoSearchOutline,
  IoLocationOutline,
  IoMapOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoArrowForwardOutline,
  IoSwapVerticalOutline,
} from "react-icons/io5";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import CustomCalendar from "./CustomCalendar";
import { LuLoaderCircle } from "react-icons/lu";

interface LocationSuggestion {
    name: string;
    city?: string;
    state?: string;
    country?: string;
    lat: number;
    lon: number;
}

interface RideSearchWidgetProps {
  variant?: "horizontal" | "vertical";
  onSearchSubmit?: () => void;
}

export default function RideSearchWidget({
  variant = "horizontal",
  onSearchSubmit,
}: RideSearchWidgetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params if available
  const [departure, setDeparture] = useState(searchParams?.get("depart") || "");
  const [arrival, setArrival] = useState(searchParams?.get("arrivee") || "");

  const initialDate = searchParams?.get("date")
    ? new Date(searchParams.get("date") as string)
    : new Date();
  const [date, setDate] = useState<Date | null>(initialDate);

  const [seats, setSeats] = useState(
    parseInt(searchParams?.get("passagers") || "1", 10),
  );

  // Dropos states
  const [activeDropdown, setActiveDropdown] = useState<
    "depart" | "arrivee" | "date" | "seats" | null
  >(null);

  const [dropdownPos, setDropdownPos] = useState<"top" | "bottom">("bottom");

  const defaultSuggestions: LocationSuggestion[] = [
    { name: "Montréal", state: "Québec", country: "Canada", lat: 45.5017, lon: -73.5673 },
    { name: "Québec", state: "Québec", country: "Canada", lat: 46.8139, lon: -71.2082 },
    { name: "Toronto", state: "Ontario", country: "Canada", lat: 43.6532, lon: -79.3832 },
    { name: "Gatineau", state: "Québec", country: "Canada", lat: 45.4765, lon: -75.7013 },
    { name: "Sherbrooke", state: "Québec", country: "Canada", lat: 45.4010, lon: -71.8991 },
  ];

  // Autocomplete states
  const [departSuggestions, setDepartSuggestions] = useState<LocationSuggestion[]>([]);
  const [arriveeSuggestions, setArriveeSuggestions] = useState<LocationSuggestion[]>([]);
  const [departCoords, setDepartCoords] = useState<{lat: number, lon: number} | null>(null);
  const [arriveeCoords, setArriveeCoords] = useState<{lat: number, lon: number} | null>(null);

  // Fetch suggestions
  useEffect(() => {
    if (!departure || departure.length < 2) {
      setDepartSuggestions(defaultSuggestions);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(departure)}&lat=45.5017&lon=-73.5673&limit=20`);
        const data = await res.json();
        const allowedCountries = ["Canada", "United States", "États-Unis", "USA"];
        const suggestions = data.features
          .filter((f: any) => allowedCountries.includes(f.properties.country))
          .map((f: any) => ({
            name: f.properties.name,
            city: f.properties.city,
            state: f.properties.state,
            country: f.properties.country,
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0],
          }))
          .slice(0, 5);
        setDepartSuggestions(suggestions);
      } catch (e) {
        console.error("Photon API error", e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [departure]);

  useEffect(() => {
    if (!arrival || arrival.length < 2) {
      setArriveeSuggestions(defaultSuggestions);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(arrival)}&lat=45.5017&lon=-73.5673&limit=20`);
        const data = await res.json();
        const allowedCountries = ["Canada", "United States", "États-Unis", "USA"];
        const suggestions = data.features
          .filter((f: any) => allowedCountries.includes(f.properties.country))
          .map((f: any) => ({
            name: f.properties.name,
            city: f.properties.city,
            state: f.properties.state,
            country: f.properties.country,
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0],
          }))
          .slice(0, 5);
        setArriveeSuggestions(suggestions);
      } catch (e) {
        console.error("Photon API error", e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [arrival]);

  const openDropdown = (
    type: "depart" | "arrivee" | "date" | "seats",
    e?: React.MouseEvent | React.FocusEvent | React.ChangeEvent,
  ) => {
    if (e && e.currentTarget) {
      const target = (e.currentTarget as HTMLElement).closest(".group") || (e.currentTarget as HTMLElement);
      const rect = target.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 360 && rect.top > spaceBelow) {
        setDropdownPos("top");
      } else {
        setDropdownPos("bottom");
      }
    } else {
      setDropdownPos("bottom");
    }
    setActiveDropdown(type);
  };

  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departure || !arrival) {
      if (!departure) setActiveDropdown("depart");
      else if (!arrival) setActiveDropdown("arrivee");
      return;
    }
    setLoading(true); // Démarre le loading
    const params = new URLSearchParams();
    params.set("depart", departure);
    params.set("arrivee", arrival);
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    params.set("passagers", seats.toString());
    if (departCoords) {
      params.set("dLat", departCoords.lat.toString());
      params.set("dLon", departCoords.lon.toString());
    }
    if (arriveeCoords) {
      params.set("aLat", arriveeCoords.lat.toString());
      params.set("aLon", arriveeCoords.lon.toString());
    }

    try {
      onSearchSubmit?.();
      router.push(`/fr/search?${params.toString()}`);
      setActiveDropdown(null);
    } finally {
      setTimeout(() => setLoading(false), 1200);
    }
  };

  const formatSuggestion = (s: LocationSuggestion) => {
    const parts = [s.name];
    if (s.city && s.city !== s.name) parts.push(s.city);
    else if (s.state && s.state !== s.name) parts.push(s.state);
    if (s.country) parts.push(s.country);
    return parts.join(", ");
  };

  const swapLocations = () => {
    const tempDep = departure;
    const tempArr = arrival;
    const tempDepCoords = departCoords;
    const tempArrCoords = arriveeCoords;
    setDeparture(tempArr);
    setArrival(tempDep);
    setDepartCoords(tempArrCoords);
    setArriveeCoords(tempDepCoords);
  };

  const isVert = variant === "vertical";

  return (
    <div className="flex flex-col items-start capitalize text-lg w-full max-w-6xl relative z-50 search-widget">
      <div className="ml-6 bg-white py-2 px-5 rounded-t-xl shadow-[0_-5px_15px_rgba(0,0,0,0.03)] flex items-center justify-center gap-2 text-dark font-bold text-sm relative z-10 translate-y-1">
        <IoSearchOutline size={16} />
        trouver un trajet
      </div>
      <div
        ref={containerRef}
        className={`w-full bg-white p-3 md:p-3 shadow-[0_30px_80px_rgba(0,0,0,0.08)] border border-neutral-100 relative
        ${isVert ? "flex flex-col gap-2 rounded-2xl squircle" : "rounded-2xl flex flex-col lg:flex-row items-center gap-2"}
      `}
      >
        {/* Departure Input */}
        <div className="relative flex-1 w-full bg-light-400 rounded-xl min-h-16 h-[80px] flex items-center px-6 border border-neutral-300 focus-within:bg-white focus-within:border-primary-500/40 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all shadow-inner group shrink-0">
          <IoLocationOutline className="text-xl text-neutral-700 group-focus-within:text-primary transition-colors shrink-0" />
          <div className="ml-3 w-full text-left flex flex-col justify-center h-full">
            <span className="block text-sm font-bold text-neutral-700 uppercase tracking-widest mt-0.5">
              Départ
            </span>
            <input
              type="text"
              placeholder="Saisissez un lieu"
              value={departure}
              onChange={(e) => {
                setDeparture(e.target.value);
                setDepartCoords(null);
                openDropdown("depart", e);
              }}
              onFocus={(e) => openDropdown("depart", e)}
              className="w-full bg-transparent text-sm md:text-base font-bold text-dark outline-none placeholder:text-neutral-500 placeholder:font-semibold truncate pb-0.5"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {activeDropdown === "depart" && (
            <div className={`absolute left-0 right-0 ${dropdownPos === "top" ? "bottom-full mb-2" : "top-full mt-2"} bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-neutral-200 overflow-hidden z-60`}>
              <div className="p-1 max-h-56 overflow-y-auto hide-scrollbar">
                <span className="block px-3 py-1.5 text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                  Suggestions
                </span>
                {departSuggestions.length > 0 ? (
                  departSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        setDeparture(formatSuggestion(suggestion));
                        setDepartCoords({ lat: suggestion.lat, lon: suggestion.lon });
                        openDropdown("arrivee", e);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl flex items-center gap-3 transition-colors text-dark-800 font-bold text-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-neutral-200 border border-neutral-300/50 flex items-center justify-center shrink-0">
                        <IoLocationOutline className="text-neutral-700" size={16} />
                      </div>
                      <span className="truncate">{formatSuggestion(suggestion)}</span>
                    </button>
                  ))
                ) : departure.length >= 2 ? (
                  <div className="px-3 py-2 text-sm text-neutral-600 font-medium">
                    Recherche en cours...
                  </div>
                ) : (
                  <div className="px-3 py-2 text-sm text-neutral-600 font-bold">
                    Aucun lieu trouvé
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Swap Button (Mobile) or Divider arrow (Desktop) */}
        <div
          onClick={swapLocations}
          className={`${isVert ? "absolute right-[15%] top-[84px] -translate-y-1/2 z-10 w-9 h-9" : "lg:hidden absolute left-[15%] top-[84px] -translate-y-1/2 z-10 w-9 h-9"} rounded-3xl bg-white shadow-md border border-neutral-300 flex items-center justify-center text-primary cursor-pointer hover:bg-neutral-50 transition-colors`}
        >
          <IoSwapVerticalOutline size={18} />
        </div>
        {!isVert && (
          <div
            onClick={swapLocations}
            className="hidden lg:flex w-10 h-10 rounded-3xl bg-white shadow-md border border-neutral-100 items-center justify-center shrink-0 -mx-5 z-10 text-neutral-400 hover:text-primary transition-colors cursor-pointer"
          >
            <IoArrowForwardOutline size={18} />
          </div>
        )}

        {/* Arrival Input */}
        <div
          className={`relative flex-1 w-full bg-light-400 rounded-xl min-h-16 h-[80px] flex items-center px-6 border border-neutral-300 focus-within:bg-white focus-within:border-primary-500/40 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all shadow-inner group shrink-0 ${!isVert ? "mt-2 lg:mt-0" : "mt-0"}`}
        >
          <IoMapOutline className="text-xl text-neutral-700 group-focus-within:text-primary transition-colors shrink-0" />
          <div className="ml-3 w-full text-left flex flex-col justify-center h-full">
            <span className="block text-sm font-bold text-neutral-700 uppercase tracking-widest mt-0.5">
              Arrivée
            </span>
            <input
              type="text"
              placeholder="Saisissez un lieu"
              value={arrival}
              onChange={(e) => {
                setArrival(e.target.value);
                setArriveeCoords(null);
                openDropdown("arrivee", e);
              }}
              onFocus={(e) => openDropdown("arrivee", e)}
              className="w-full bg-transparent text-sm md:text-base font-bold text-dark outline-none placeholder:text-neutral-500 placeholder:font-semibold truncate pb-0.5"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {activeDropdown === "arrivee" && (
            <div className={`absolute left-0 right-0 ${dropdownPos === "top" ? "bottom-full mb-2" : "top-full mt-2"} bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-neutral-200 overflow-hidden z-60`}>
              <div className="p-1 max-h-56 overflow-y-auto hide-scrollbar">
                <span className="block px-3 py-1.5 text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                  Suggestions
                </span>
                {arriveeSuggestions.length > 0 ? (
                  arriveeSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        setArrival(formatSuggestion(suggestion));
                        setArriveeCoords({ lat: suggestion.lat, lon: suggestion.lon });
                        openDropdown("date", e);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl flex items-center gap-3 transition-colors text-dark-800 font-bold text-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-neutral-200 border border-neutral-300/50 flex items-center justify-center shrink-0">
                        <IoMapOutline className="text-neutral-700" size={16} />
                      </div>
                      <span className="truncate">{formatSuggestion(suggestion)}</span>
                    </button>
                  ))
                ) : arrival.length >= 2 ? (
                  <div className="px-3 py-2 text-sm text-neutral-600 font-medium">
                    Recherche en cours...
                  </div>
                ) : (
                  <div className="px-3 py-2 text-sm text-neutral-600 font-bold">
                    Aucun lieu trouvé
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Date & Seats */}
        <div
          className={`w-full flex ${isVert ? "flex-col gap-2" : "flex-row gap-2 mt-2 lg:mt-0 lg:w-auto"} relative shrink-0`}
        >
          {/* Date Input */}
          <div
            onClick={(e) => {
              if (activeDropdown === "date") setActiveDropdown(null);
              else openDropdown("date", e);
            }}
            className={`flex-1 ${!isVert ? "lg:w-[150px]" : ""} bg-light-400 rounded-xl min-h-16 h-16 md:h-[80px] flex items-center px-5 cursor-pointer transition-all shadow-inner group border border-neutral-300 shrink-0
            ${activeDropdown === "date" ? "bg-white border-primary-500/40 ring-4 ring-primary-500/10" : "hover:bg-neutral-200"}`}
          >
            <IoCalendarOutline
              className={`text-xl shrink-0 ${activeDropdown === "date" ? "text-primary" : "text-neutral-700"}`}
            />
            <div className="ml-2.5 text-left w-full overflow-hidden flex flex-col justify-center h-full">
              <span className="block text-xs md:text-xs font-bold text-neutral-600 uppercase tracking-widest mt-0.5">
                Quand ?
              </span>
              <span className="block text-[13px] font-bold truncate text-dark pb-0.5">
                {date
                  ? format(date, "EEE d MMM", { locale: fr })
                  : "Aujourd'hui"}
              </span>
            </div>
          </div>

          {/* Date Calendar Popover */}
          {activeDropdown === "date" && (
            <CustomCalendar
              selectedDate={date}
              onSelectDate={(d) => {
                setDate(d);
                setActiveDropdown("seats"); // keep previous position transition
              }}
              position={dropdownPos}
            />
          )}

          {/* Seats Input */}
          <div
            onClick={(e) => {
              if (activeDropdown === "seats") setActiveDropdown(null);
              else openDropdown("seats", e);
            }}
            className={`flex-1 ${!isVert ? "h-16 lg:h-[80px]" : "h-16 lg:h-16"} bg-light-400 rounded-xl min-h-16 flex items-center px-5 cursor-pointer transition-all shadow-inner group border border-neutral-300 shrink-0
            ${activeDropdown === "seats" ? "bg-white border-primary-500/40 ring-4 ring-primary-500/10" : "hover:bg-neutral-200"}`}
          >
            <IoPersonOutline
              className={`text-xl shrink-0 ${activeDropdown === "seats" ? "text-primary" : "text-neutral-700"}`}
            />
            <div className="ml-2.5 text-left flex flex-col justify-center h-full">
              <span className="block text-xs md:text-xs font-bold text-neutral-600 uppercase tracking-widest mt-0.5">
                places
              </span>
              <span className="block text-[13px] font-bold text-dark pb-0.5">
                {seats}
              </span>
            </div>
          </div>

          {/* Seats Popover */}
          {activeDropdown === "seats" && (
            <div
              className={`absolute border border-neutral-200 ${isVert ? "left-0" : "right-0"} ${dropdownPos === "top" ? "bottom-full mb-3" : "top-full mt-3"} bg-white p-3 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] outline-none w-[170px] z-60`}
            >
              <div className="flex flex-col gap-3 items-start mb-1">
                <span className="text-dark-900 font-bold text-sm text-left px-1">
                  Passagers
                </span>
                <div className="flex items-center gap-2 bg-light-400 w-full justify-between rounded-xl p-1 border border-neutral-200/60 shadow-inner">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSeats(Math.max(1, seats - 1));
                    }}
                    disabled={seats <= 1}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm border border-neutral-200 flex items-center justify-center text-lg font-black text-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed hover:text-primary hover:border-primary-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-base font-black w-4 text-center text-dark">
                    {seats}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSeats(Math.min(8, seats + 1));
                    }}
                    disabled={seats >= 8}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm border border-neutral-200 flex items-center justify-center text-lg font-black text-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed hover:text-primary hover:border-primary-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSearch}
          className={`w-full ${
            !isVert ? "lg:w-[80px] lg:h-[80px]" : ""
          } h-16 ${!isVert ? "mt-2 lg:mt-0" : "mt-2"} btn-secondary rounded-xl flex justify-center items-center active:scale-[0.98] transition-transform shrink-0`}
          disabled={loading}
        >
          {loading ? (
            <>
              <LuLoaderCircle
                size={22}
                className="animate-spin"
                aria-label="Chargement"
                role="status"
              />
              <span className={`ml-2 font-bold ${!isVert ? "lg:hidden" : ""}`}>
                Chargement
              </span>
            </>
          ) : (
            <>
              <IoSearchOutline size={22} />
              <span className={`ml-2 font-bold ${!isVert ? "lg:hidden" : ""}`}>
                Rechercher
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
