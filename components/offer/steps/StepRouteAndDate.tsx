"use client";

import { useState, useRef, useEffect } from "react";
import {
  IoMapOutline,
  IoLocationOutline,
  IoCalendarOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { useOfferStore } from "@/store/useOfferStore";
import Alert from "@/components/ui/Alert";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import CustomCalendar from "@/components/search/CustomCalendar";
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

const defaultSuggestions: LocationSuggestion[] = [
  { name: "Montréal", state: "Québec", country: "Canada", lat: 45.5017, lon: -73.5673 },
  { name: "Québec", state: "Québec", country: "Canada", lat: 46.8139, lon: -71.2082 },
  { name: "Toronto", state: "Ontario", country: "Canada", lat: 43.6532, lon: -79.3832 },
  { name: "Gatineau", state: "Québec", country: "Canada", lat: 45.4765, lon: -75.7013 },
  { name: "Sherbrooke", state: "Québec", country: "Canada", lat: 45.401, lon: -71.8991 },
];

const fetchLocations = async (query: string): Promise<LocationSuggestion[]> => {
  if (!query || query.length < 2) return defaultSuggestions;

  const { data } = await axios.get(`https://photon.komoot.io/api/`, {
    params: { q: query, lat: 45.5017, lon: -73.5673, limit: 20 },
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

const formatSuggestion = (s: LocationSuggestion) => {
  const parts = [s.name];
  if (s.city && s.city !== s.name) parts.push(s.city);
  else if (s.state && s.state !== s.name) parts.push(s.state);
  if (s.country) parts.push(s.country);
  return parts.join(", ");
};

export default function StepRouteAndDate({ onNext }: { onNext: () => void }) {
  const { departure, arrival, departCoords, arriveeCoords, date, time, setRoute, setDateTime } =
    useOfferStore();
  const [error, setError] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<
    "depart" | "arrivee" | "date" | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const debouncedDepart = useDebounce(departure, 300);
  const debouncedArrivee = useDebounce(arrival, 300);

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

  const handleNext = () => {
    if (!departure || !arrival || !departCoords || !arriveeCoords) {
      setError("Veuillez choisir votre ville de départ et d'arrivée via les suggestions.");
      return;
    }
    if (!date || !time) {
      setError("Veuillez définir une date et une heure valides.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-black text-dark mb-2">Où allez-vous ?</h2>
        <p className="text-neutral-500 font-medium">
          Définissez l'itinéraire et l'horaire de votre trajet.
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          title="Information manquante"
          description={error}
          onClose={() => setError("")}
          className="mb-8"
        />
      )}

      <div ref={containerRef} className="flex-1 flex flex-col gap-6 relative">
        <div className="flex flex-col gap-4">
          <div className="relative w-full bg-light-400 rounded-3xl min-h-[76px] h-[76px] flex items-center px-6 border border-transparent focus-within:bg-white focus-within:border-primary-500/40 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all shadow-inner group">
            <IoLocationOutline className="text-xl text-neutral-700 group-focus-within:text-primary transition-colors shrink-0" />
            <div className="ml-3 w-full text-left flex flex-col justify-center h-full">
              <span className="block text-xs font-bold text-neutral-700 tracking-widest mt-0.5 mb-1">
                Ville de départ
              </span>
              <input
                type="text"
                placeholder="Ex. Montréal, QC"
                value={departure}
                onChange={(e) => {
                  setRoute(e.target.value, arrival, null, arriveeCoords);
                  setActiveDropdown("depart");
                }}
                onFocus={() => setActiveDropdown("depart")}
                className="w-full bg-transparent text-sm md:text-base font-bold text-dark outline-none placeholder:text-neutral-400 placeholder:font-medium truncate pb-0.5"
              />
            </div>

            {/* Depart Dropdown */}
            {activeDropdown === "depart" && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-neutral-100 overflow-hidden z-50">
                <div className="p-2 max-h-56 overflow-y-hidden">
                  <span className="block px-4 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Suggestions
                  </span>
                  {departSuggestions.length > 0 ? (
                    departSuggestions.map((city, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setRoute(formatSuggestion(city), arrival, { lat: city.lat, lon: city.lon }, arriveeCoords);
                          setActiveDropdown("arrivee");
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-light-400 rounded-2xl flex items-center gap-3 transition-colors text-dark font-medium text-sm"
                      >
                        <div className="w-8 h-8 rounded-3xl bg-neutral-100 flex items-center justify-center shrink-0">
                          <IoLocationOutline className="text-neutral-500" />
                        </div>
                        <span className="truncate">{formatSuggestion(city)}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-neutral-500 font-medium">
                      Recherche en cours...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative w-full bg-light-400 rounded-3xl min-h-[76px] h-[76px] flex items-center px-6 border border-transparent focus-within:bg-white focus-within:border-primary-500/40 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all shadow-inner group">
            <IoMapOutline className="text-xl text-neutral-700 group-focus-within:text-primary transition-colors shrink-0" />
            <div className="ml-3 w-full text-left flex flex-col justify-center h-full">
              <span className="block text-xs font-bold text-neutral-700 tracking-widest mt-0.5 mb-1">
                Ville d'arrivée
              </span>
              <input
                type="text"
                placeholder="Ex. Québec, QC"
                value={arrival}
                onChange={(e) => {
                  setRoute(departure, e.target.value, departCoords, null);
                  setActiveDropdown("arrivee");
                }}
                onFocus={() => setActiveDropdown("arrivee")}
                className="w-full bg-transparent text-sm md:text-base font-bold text-dark outline-none placeholder:text-neutral-400 placeholder:font-medium truncate pb-0.5"
              />
            </div>

            {/* Arrival Dropdown */}
            {activeDropdown === "arrivee" && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-neutral-100 overflow-hidden z-50">
                <div className="p-2 max-h-56 overflow-y-hidden">
                  <span className="block px-4 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Suggestions
                  </span>
                  {arriveeSuggestions.length > 0 ? (
                    arriveeSuggestions.map((city, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setRoute(departure, formatSuggestion(city), departCoords, { lat: city.lat, lon: city.lon });
                          setActiveDropdown("date");
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-light-400 rounded-2xl flex items-center gap-3 transition-colors text-dark font-medium text-sm"
                      >
                        <div className="w-8 h-8 rounded-3xl bg-neutral-100 flex items-center justify-center shrink-0">
                          <IoMapOutline className="text-neutral-500" />
                        </div>
                        <span className="truncate">{formatSuggestion(city)}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-neutral-500 font-medium">
                      Recherche en cours...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <div
            onClick={() =>
              setActiveDropdown(activeDropdown === "date" ? null : "date")
            }
            className={`relative flex-1 bg-light-400 rounded-3xl min-h-[76px] h-[76px] flex items-center px-6 border border-transparent transition-all shadow-inner group cursor-pointer ${activeDropdown === "date" ? "bg-white border-primary-500/40 ring-4 ring-primary-500/10" : "hover:bg-neutral-200"}`}
          >
            <IoCalendarOutline
              className={`text-xl shrink-0 ${activeDropdown === "date" ? "text-primary" : "text-neutral-700 group-focus-within:text-primary"}`}
            />
            <div className="ml-3 w-full text-left flex flex-col justify-center h-full">
              <span className="block text-xs font-bold text-neutral-700 tracking-widest mt-0.5 mb-1">
                Date
              </span>
              <span className="block text-sm md:text-base font-bold text-dark truncate pb-0.5">
                {date
                  ? format(new Date(date), "EEE d MMM yyyy", { locale: fr })
                  : "Sélectionner une date"}
              </span>
            </div>

            {/* Date Calendar Popover */}
            {activeDropdown === "date" && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-3 z-50"
              >
                <CustomCalendar
                  selectedDate={date ? new Date(date) : null}
                  onSelectDate={(d) => {
                    setDateTime(format(d, "yyyy-MM-dd"), time);
                    setActiveDropdown(null);
                  }}
                />
              </div>
            )}
          </div>

          <div className="relative flex-1 bg-light-400 rounded-3xl min-h-[76px] h-[76px] flex items-center px-6 border border-transparent focus-within:bg-white focus-within:border-primary-500/40 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all shadow-inner group">
            <IoTimeOutline className="text-xl text-neutral-700 group-focus-within:text-primary transition-colors shrink-0" />
            <div className="ml-3 w-full text-left flex flex-col justify-center h-full">
              <span className="block text-xs font-bold text-neutral-700 tracking-widest mt-0.5 mb-1">
                Heure
              </span>
              <input
                type="time"
                value={time}
                onChange={(e) => setDateTime(date, e.target.value)}
                className="w-full bg-transparent text-sm md:text-base font-bold text-dark outline-none placeholder:text-neutral-400 placeholder:font-medium truncate pb-0.5"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 lg:mt-auto pt-6">
        <button
          onClick={handleNext}
          className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-dark transition-all active:scale-[0.98] shadow-xl shadow-primary/20"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
