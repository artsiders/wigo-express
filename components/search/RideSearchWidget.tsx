"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IoSearchOutline,
  IoLocationOutline,
  IoMapOutline,
  IoCalendarOutline,
  IoArrowForwardOutline,
  IoSwapVerticalOutline,
} from "react-icons/io5";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import CustomCalendar from "./CustomCalendar";
import { LargeInput, LargeClickableInput } from "@/components/ui/LargeInput";
import { LuLoaderCircle } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

const defaultSuggestions: LocationSuggestion[] = [
  {
    name: "Montréal",
    state: "Québec",
    country: "Canada",
    lat: 45.5017,
    lon: -73.5673,
  },
  {
    name: "Québec",
    state: "Québec",
    country: "Canada",
    lat: 46.8139,
    lon: -71.2082,
  },
  {
    name: "Toronto",
    state: "Ontario",
    country: "Canada",
    lat: 43.6532,
    lon: -79.3832,
  },
  {
    name: "Gatineau",
    state: "Québec",
    country: "Canada",
    lat: 45.4765,
    lon: -75.7013,
  },
  {
    name: "Sherbrooke",
    state: "Québec",
    country: "Canada",
    lat: 45.401,
    lon: -71.8991,
  },
];

const fetchLocations = async (query: string): Promise<LocationSuggestion[]> => {
  if (!query || query.length < 2) return defaultSuggestions;

  const { data } = await axios.get(`https://photon.komoot.io/api/`, {
    params: {
      q: query,
      lat: 45.5017,
      lon: -73.5673,
      limit: 20,
    },
  });

  const allowedCountries = ["Canada", "United States", "États-Unis", "USA"];
  return data.features
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
};

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function RideSearchWidget({
  variant = "horizontal",
  onSearchSubmit,
}: RideSearchWidgetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [departure, setDeparture] = useState(searchParams?.get("depart") || "");
  const [arrival, setArrival] = useState(searchParams?.get("arrivee") || "");
  const [departCoords, setDepartCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [arriveeCoords, setArriveeCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const debouncedDepart = useDebounce(departure, 300);
  const debouncedArrivee = useDebounce(arrival, 300);

  const initialDate = searchParams?.get("date")
    ? new Date(searchParams.get("date") as string)
    : new Date();
  const [date, setDate] = useState<Date | null>(initialDate);

  const [activeDropdown, setActiveDropdown] = useState<
    "depart" | "arrivee" | "date" | null
  >(null);
  const [dropdownPos, setDropdownPos] = useState<"top" | "bottom">("bottom");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // React Query for suggestions
  const { data: departSuggestions = [] } = useQuery({
    queryKey: ["locations", debouncedDepart],
    queryFn: () => fetchLocations(debouncedDepart),
    enabled: activeDropdown === "depart",
  });

  const { data: arriveeSuggestions = [] } = useQuery({
    queryKey: ["locations", debouncedArrivee],
    queryFn: () => fetchLocations(debouncedArrivee),
    enabled: activeDropdown === "arrivee",
  });

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openDropdown = (
    type: "depart" | "arrivee" | "date",
    e?: React.MouseEvent | React.FocusEvent | React.ChangeEvent,
    customHeight?: number,
  ) => {
    if (e?.currentTarget) {
      const target =
        (e.currentTarget as HTMLElement).closest(".group") ||
        (e.currentTarget as HTMLElement);
      const rect = target.getBoundingClientRect();

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Le calendrier fait environ 420px, les suggestions 320px
      const estimatedHeight = customHeight || 320;

      if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
        setDropdownPos("top");
      } else {
        setDropdownPos("bottom");
      }
    }
    setActiveDropdown(type);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departure || !arrival) {
      setActiveDropdown(!departure ? "depart" : "arrivee");
      return;
    }
    setLoading(true);
    const params = new URLSearchParams();
    params.set("depart", departure);
    params.set("arrivee", arrival);
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    if (departCoords) {
      params.set("dLat", departCoords.lat.toString());
      params.set("dLon", departCoords.lon.toString());
    }
    if (arriveeCoords) {
      params.set("aLat", arriveeCoords.lat.toString());
      params.set("aLon", arriveeCoords.lon.toString());
    }

    onSearchSubmit?.();
    router.push(`/fr/search?${params.toString()}`);
    setTimeout(() => {
      setLoading(false);
      setActiveDropdown(null);
    }, 1200);
  };

  const formatSuggestion = (s: LocationSuggestion) => {
    const parts = [s.name];
    if (s.city && s.city !== s.name) parts.push(s.city);
    else if (s.state && s.state !== s.name) parts.push(s.state);
    if (s.country) parts.push(s.country);
    return parts.join(", ");
  };

  const swapLocations = () => {
    setDeparture(arrival);
    setArrival(departure);
    setDepartCoords(arriveeCoords);
    setArriveeCoords(departCoords);
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
        ${isVert ? "flex flex-col gap-2 rounded-2xl" : "rounded-2xl flex flex-col lg:flex-row items-center gap-2"}
      `}
      >
        {/* Departure */}
        <LargeInput
          label="Départ"
          icon={<IoLocationOutline />}
          placeholder="Saisissez un lieu"
          value={departure}
          onChange={(e) => {
            setDeparture(e.target.value);
            setDepartCoords(null);
            openDropdown("depart", e);
          }}
          onFocus={(e) => openDropdown("depart", e)}
        >
          {activeDropdown === "depart" && (
            <div
              className={`absolute left-0 right-0 ${dropdownPos === "top" ? "bottom-full mb-2" : "top-full mt-2"} bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-60`}
            >
              <div className="p-1 max-h-56 overflow-y-auto">
                {departSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDeparture(formatSuggestion(s));
                      setDepartCoords({ lat: s.lat, lon: s.lon });
                      setActiveDropdown("arrivee");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl flex items-center gap-3 text-dark font-bold text-sm"
                  >
                    <IoLocationOutline
                      className="text-neutral-700 shrink-0"
                      size={16}
                    />
                    <span className="truncate">{formatSuggestion(s)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </LargeInput>

        <div
          onClick={swapLocations}
          className={`${isVert ? "absolute right-[15%] top-[84px] -translate-y-1/2 z-10 w-9 h-9" : "lg:hidden absolute left-[15%] top-[84px] -translate-y-1/2 z-10 w-9 h-9"} rounded-3xl bg-white shadow-md border border-neutral-300 flex items-center justify-center text-primary cursor-pointer hover:bg-neutral-50 transition-colors`}
        >
          <IoSwapVerticalOutline size={18} />
        </div>
        {!isVert && (
          <div
            onClick={swapLocations}
            className="hidden lg:flex w-10 h-10 rounded-3xl bg-white shadow-md border border-neutral-100 items-center justify-center shrink-0 -mx-5 z-10 text-neutral-400 hover:text-primary cursor-pointer"
          >
            <IoArrowForwardOutline size={18} />
          </div>
        )}

        {/* Arrival */}
        <LargeInput
          label="Arrivée"
          icon={<IoMapOutline />}
          containerClassName={!isVert ? "mt-2 lg:mt-0" : ""}
          placeholder="Saisissez un lieu"
          value={arrival}
          onChange={(e) => {
            setArrival(e.target.value);
            setArriveeCoords(null);
            openDropdown("arrivee", e);
          }}
          onFocus={(e) => openDropdown("arrivee", e)}
        >
          {activeDropdown === "arrivee" && (
            <div
              className={`absolute left-0 right-0 ${dropdownPos === "top" ? "bottom-full mb-2" : "top-full mt-2"} bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-60`}
            >
              <div className="p-1 max-h-56 overflow-y-auto">
                {arriveeSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setArrival(formatSuggestion(s));
                      setArriveeCoords({ lat: s.lat, lon: s.lon });
                      setActiveDropdown("date");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl flex items-center gap-3 text-dark font-bold text-sm"
                  >
                    <IoMapOutline
                      className="text-neutral-700 shrink-0"
                      size={16}
                    />
                    <span className="truncate">{formatSuggestion(s)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </LargeInput>

        {/* Date Input */}
        <div
          className={`w-full ${isVert ? "flex-col" : "lg:w-[180px]"} relative shrink-0`}
        >
          <LargeClickableInput
            label="Quand ?"
            icon={<IoCalendarOutline />}
            valueDisplay={
              date
                ? format(date, "EEE d MMM", { locale: fr })
                : "Aujourd'hui"
            }
            isActive={activeDropdown === "date"}
            onClick={(e) => {
              if (activeDropdown === "date") setActiveDropdown(null);
              else openDropdown("date", e as any, 420);
            }}
          />

          {/* Date Calendar Popover */}
          {activeDropdown === "date" && (
            <CustomCalendar
              selectedDate={date}
              onSelectDate={(d) => {
                setDate(d);
                setActiveDropdown(null);
              }}
              position={dropdownPos} // Assure-toi que CustomCalendar utilise bien ce prop
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSearch}
          className={`w-full ${!isVert ? "lg:w-[80px] lg:h-[80px]" : "h-16"} h-16 btn-secondary rounded-xl flex justify-center items-center active:scale-[0.98] transition-transform shrink-0`}
          disabled={loading}
        >
          {loading ? (
            <LuLoaderCircle size={22} className="animate-spin" />
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
