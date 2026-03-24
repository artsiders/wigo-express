"use client";

import React, { useState } from "react";
import { IoMapOutline, IoLocationOutline, IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
import { useOfferStore } from "@/store/useOfferStore";
import Alert from "@/components/ui/Alert";

export default function StepRouteAndDate({ onNext }: { onNext: () => void }) {
  const { departure, arrival, date, time, setRoute, setDateTime } = useOfferStore();
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!departure || !arrival) {
      setError("Veuillez renseigner votre ville de départ et d'arrivée.");
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
        <p className="text-neutral-500 font-medium">Définissez l'itinéraire et l'horaire de votre trajet.</p>
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

      <div className="flex-1 flex flex-col gap-6">
        {/* Placeholder pour les inputs */}
        <div className="relative flex flex-col gap-4">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-light-400 flex items-center justify-center group-focus-within:bg-primary/10 transition-colors">
              <IoLocationOutline className="text-neutral-500 group-focus-within:text-primary" />
            </div>
            <input 
              type="text" 
              placeholder="Ville de départ"
              value={departure}
              onChange={(e) => setRoute(e.target.value, arrival)}
              className="w-full h-16 bg-white border-2 border-light-400 rounded-2xl pl-16 pr-4 font-bold text-dark placeholder:font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-light-400 flex items-center justify-center group-focus-within:bg-primary/10 transition-colors">
               <IoMapOutline className="text-neutral-500 group-focus-within:text-primary" />
            </div>
             <input 
              type="text" 
              placeholder="Ville d'arrivée"
              value={arrival}
              onChange={(e) => setRoute(departure, e.target.value)}
              className="w-full h-16 bg-white border-2 border-light-400 rounded-2xl pl-16 pr-4 font-bold text-dark placeholder:font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          <div className="flex gap-4 mt-2">
            <div className="relative group flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-light-400 flex items-center justify-center group-focus-within:bg-primary/10 transition-colors">
                <IoCalendarOutline className="text-neutral-500 group-focus-within:text-primary" />
              </div>
              <input 
                type="date" 
                value={date || ""}
                onChange={(e) => setDateTime(e.target.value, time)}
                className="w-full h-16 bg-white border-2 border-light-400 rounded-2xl pl-16 pr-4 font-bold text-dark placeholder:font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="relative group flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-light-400 flex items-center justify-center group-focus-within:bg-primary/10 transition-colors">
                <IoTimeOutline className="text-neutral-500 group-focus-within:text-primary" />
              </div>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setDateTime(date, e.target.value)}
                className="w-full h-16 bg-white border-2 border-light-400 rounded-2xl pl-16 pr-4 font-bold text-dark placeholder:font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button 
          onClick={handleNext}
          className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
