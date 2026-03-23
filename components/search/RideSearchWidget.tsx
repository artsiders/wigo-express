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

const MOCK_CITIES = [
  "Montréal, QC",
  "Québec, QC",
  "Toronto, ON",
  "Ottawa, ON",
  "Laval, QC",
  "Gatineau, QC",
  "Sherbrooke, QC",
  "Trois-Rivières, QC",
  "Chicoutimi, QC",
];

interface RideSearchWidgetProps {
  variant?: "horizontal" | "vertical";
}

export default function RideSearchWidget({ variant = "horizontal" }: RideSearchWidgetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params if available
  const [departure, setDeparture] = useState(searchParams?.get("depart") || "");
  const [arrival, setArrival] = useState(searchParams?.get("arrivee") || "");
  
  const initialDate = searchParams?.get("date") ? new Date(searchParams.get("date") as string) : new Date();
  const [date, setDate] = useState<Date | null>(initialDate);
  
  const [seats, setSeats] = useState(parseInt(searchParams?.get("passagers") || "1", 10));

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<"depart" | "arrivee" | "date" | "seats" | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departure || !arrival) {
      if (!departure) setActiveDropdown("depart");
      else if (!arrival) setActiveDropdown("arrivee");
      return;
    }
    const params = new URLSearchParams();
    params.set("depart", departure);
    params.set("arrivee", arrival);
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    params.set("passagers", seats.toString());

    router.push(`/fr/search?${params.toString()}`);
    setActiveDropdown(null);
  };

  const filteredCities = (query: string) => {
    return MOCK_CITIES.filter((city) =>
      city.toLowerCase().includes(query.toLowerCase())
    );
  };

  const swapLocations = () => {
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
  };

  const isVert = variant === "vertical";

  return (
    <div 
      ref={containerRef} 
      className={`search-widget w-full bg-white p-3 md:p-4 shadow-[0_30px_80px_rgba(0,0,0,0.08)] border border-neutral-100 relative
        ${isVert ? "flex flex-col gap-2 rounded-3xl" : "max-w-5xl rounded-[3rem] flex flex-col lg:flex-row items-center gap-2"}
      `}
    >
      
      {/* Departure Input */}
      <div className="relative flex-1 w-full bg-light-400 rounded-full flex items-center px-6 py-4 border border-transparent focus-within:bg-white focus-within:border-primary-500/40 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all shadow-inner group">
        <IoLocationOutline className="text-2xl text-neutral-400 group-focus-within:text-primary transition-colors" />
        <div className="ml-4 w-full text-left">
          <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">
            Départ
          </span>
          <input
            type="text"
            placeholder="Saisissez un lieu"
            value={departure}
            onChange={(e) => {
              setDeparture(e.target.value);
              setActiveDropdown("depart");
            }}
            onFocus={() => setActiveDropdown("depart")}
            className="w-full bg-transparent text-base md:text-lg font-bold text-dark outline-none placeholder:text-neutral-300 placeholder:font-medium truncate"
          />
        </div>
        
        {/* Autocomplete Dropdown */}
        {activeDropdown === "depart" && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-neutral-100 overflow-hidden z-50">
            <div className="p-2">
              <span className="block px-4 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Suggestions
              </span>
              {filteredCities(departure).length > 0 ? (
                filteredCities(departure).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setDeparture(city);
                      setActiveDropdown("arrivee");
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-light-400 rounded-2xl flex items-center gap-3 transition-colors text-dark font-medium"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                      <IoLocationOutline className="text-neutral-500" />
                    </div>
                    {city}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-neutral-500">Aucun lieu trouvé</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Swap Button (Mobile) or Divider arrow (Desktop) */}
      <div 
        onClick={swapLocations}
        className={`${isVert ? 'absolute right-[15%] top-[82px] z-10 w-10 h-10' : 'lg:hidden absolute left-[15%] top-[82px] z-10 w-10 h-10'} rounded-full bg-white shadow-md border border-neutral-100 flex items-center justify-center text-primary cursor-pointer hover:bg-neutral-50 transition-colors`}
      >
         <IoSwapVerticalOutline size={20} />
      </div>
      {!isVert && (
        <div 
          onClick={swapLocations}
          className="hidden lg:flex w-12 h-12 rounded-full bg-white shadow-md border border-neutral-100 items-center justify-center shrink-0 -mx-5 z-10 text-neutral-400 hover:text-primary transition-colors cursor-pointer"
        >
          <IoArrowForwardOutline size={20} />
        </div>
      )}

      {/* Arrival Input */}
      <div className={`relative flex-1 w-full bg-light-400 rounded-full flex items-center px-6 py-4 border border-transparent focus-within:bg-white focus-within:border-primary-500/40 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all shadow-inner group ${!isVert ? 'mt-2 lg:mt-0' : 'mt-0'}`}>
        <IoMapOutline className="text-2xl text-neutral-400 group-focus-within:text-primary transition-colors" />
        <div className="ml-4 w-full text-left">
          <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">
            Arrivée
          </span>
          <input
            type="text"
            placeholder="Saisissez un lieu"
            value={arrival}
            onChange={(e) => {
              setArrival(e.target.value);
              setActiveDropdown("arrivee");
            }}
            onFocus={() => setActiveDropdown("arrivee")}
            className="w-full bg-transparent text-base md:text-lg font-bold text-dark outline-none placeholder:text-neutral-300 placeholder:font-medium truncate"
          />
        </div>

        {/* Autocomplete Dropdown */}
        {activeDropdown === "arrivee" && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-neutral-100 overflow-hidden z-50">
            <div className="p-2">
              <span className="block px-4 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Suggestions
              </span>
              {filteredCities(arrival).length > 0 ? (
                filteredCities(arrival).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setArrival(city);
                      setActiveDropdown("date");
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-light-400 rounded-2xl flex items-center gap-3 transition-colors text-dark font-medium"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                      <IoMapOutline className="text-neutral-500" />
                    </div>
                    {city}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-neutral-500">Aucun lieu trouvé</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Date & Seats */}
      <div className={`w-full flex ${isVert ? 'flex-col gap-2' : 'flex-row gap-2 mt-2 lg:mt-0 lg:w-auto'} relative`}>
        {/* Date Input */}
        <div 
          onClick={() => setActiveDropdown(activeDropdown === "date" ? null : "date")}
          className={`flex-1 ${!isVert ? 'lg:w-44' : ''} bg-light-400 rounded-[2rem] flex items-center px-5 py-4 cursor-pointer transition-all shadow-inner group border border-transparent
            ${activeDropdown === "date" ? "bg-white border-primary-500/40 ring-4 ring-primary-500/10" : "hover:bg-neutral-200"}`}
        >
          <IoCalendarOutline className={`text-xl ${activeDropdown === "date" ? "text-primary" : "text-neutral-400"}`} />
          <div className="ml-3 text-left w-full overflow-hidden">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">
              Quand ?
            </span>
            <span className="block text-sm font-bold truncate text-dark">
              {date ? format(date, "EEE d MMM", { locale: fr }) : "Aujourd'hui"}
            </span>
          </div>
        </div>

        {/* Date Calendar Popover */}
        {activeDropdown === "date" && (
          <CustomCalendar 
            selectedDate={date} 
            onSelectDate={(d) => {
              setDate(d);
              setActiveDropdown("seats");
            }} 
          />
        )}

        {/* Seats Input */}
        <div 
          onClick={() => setActiveDropdown(activeDropdown === "seats" ? null : "seats")}
          className={`flex-1 ${!isVert ? 'lg:w-32' : ''} bg-light-400 rounded-[2rem] flex items-center px-5 py-4 cursor-pointer transition-all shadow-inner group border border-transparent
            ${activeDropdown === "seats" ? "bg-white border-primary-500/40 ring-4 ring-primary-500/10" : "hover:bg-neutral-200"}`}
        >
          <IoPersonOutline className={`text-xl ${activeDropdown === "seats" ? "text-primary" : "text-neutral-400"}`} />
          <div className="ml-3 text-left">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">
              Passagers
            </span>
            <span className="block text-sm font-bold text-dark">{seats}</span>
          </div>
        </div>

        {/* Seats Popover */}
        {activeDropdown === "seats" && (
          <div className={`absolute top-full border border-neutral-100 ${isVert ? 'left-0' : 'right-0'} mt-4 bg-white p-4 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] outline-none w-[280px] z-50`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark font-bold">Passagers</span>
              <div className="flex items-center gap-4 bg-light-400 rounded-full p-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSeats(Math.max(1, seats - 1)); }}
                  disabled={seats <= 1}
                  className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl font-bold text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-primary transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-bold w-4 text-center">{seats}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSeats(Math.min(8, seats + 1)); }}
                  disabled={seats >= 8}
                  className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl font-bold text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-primary transition-colors"
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
        className={`w-full ${!isVert ? 'lg:w-auto mt-2 lg:mt-0' : 'mt-2'} btn-primary px-10 py-4.5 rounded-full flex justify-center hover:scale-105 active:scale-95 transition-transform`}
      >
        <IoSearchOutline size={22} />
        <span className={`ml-2 font-bold ${!isVert ? 'lg:hidden' : ''}`}>Rechercher</span>
      </button>

    </div>
  );
}
