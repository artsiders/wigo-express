"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { OfferRideFormData } from "@/schemas/offer";
import { LuUsers, LuDollarSign, LuShieldCheck, LuDog, LuZap } from "react-icons/lu";

export default function StepOptionsAndPrice({ onNext }: { onNext: () => void }) {
  const { watch, setValue } = useFormContext<OfferRideFormData>();
  const seats = watch("seats");
  const price = watch("price");
  const max2Back = watch("max2Back");
  const instantBooking = watch("instantBooking");
  const petFriendly = watch("petFriendly");

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-black text-dark mb-2">Détails du voyage</h2>
        <p className="text-neutral-500 font-medium">Ajustez le nombre de places et le prix par passager.</p>
      </div>

    <div className="flex-1 flex flex-col gap-6">
        {/* Passagers */}
        <div className="p-6 bg-light-400 rounded-2xl border border-neutral-100 flex justify-between items-center group transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary transition-colors">
              <LuUsers size={24} />
            </div>
            <div>
              <span className="block font-black text-dark text-lg italic">Passagers</span>
              <span className="text-sm font-medium text-neutral-500">Combien de places proposez-vous ?</span>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-full p-1.5 shadow-inner">
            <button 
              type="button"
              onClick={() => setValue("seats", Math.max(1, seats - 1))} 
              className="w-10 h-10 rounded-full bg-light-400 text-dark font-black hover:bg-dark hover:text-white transition-all active:scale-90"
            >
              -
            </button>
            <span className="font-black text-xl w-6 text-center text-dark">{seats}</span>
            <button 
              type="button"
              onClick={() => setValue("seats", Math.min(8, seats + 1))} 
              className="w-10 h-10 rounded-full bg-light-400 text-dark font-black hover:bg-dark hover:text-white transition-all active:scale-90"
            >
              +
            </button>
          </div>
        </div>

        {/* Prix */}
        <div className="p-8 bg-light-400 rounded-2xl border border-neutral-100 flex flex-col items-center relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 text-dark font-black">
              <LuDollarSign size={24} />
              <span className="block italic tracking-tight">Prix par passager</span>
            </div>
            
            <div className="flex items-center gap-8 mb-4">
                <button 
                  type="button"
                  onClick={() => setValue("price", Math.max(1, price - 1))}
                  className="w-14 h-14 rounded-full bg-white border border-neutral-100 text-dark font-black text-2xl hover:bg-primary hover:text-white transition-all active:scale-90"
                >
                  -
                </button>
                <div className="text-6xl font-black flex items-baseline gap-1 text-primary">
                    {price} <span className="text-3xl font-medium text-dark">$</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setValue("price", Math.min(200, price + 1))}
                  className="w-14 h-14 rounded-full bg-white border border-neutral-100 text-dark font-black text-2xl hover:bg-primary hover:text-white transition-all active:scale-90"
                >
                  +
                </button>
            </div>
            <p className="text-sm font-bold text-neutral-500 max-w-[240px] text-center italic">Estimation conseillée pour cet itinéraire</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("max2Back", !max2Back)}
            className={`p-5 rounded-2xl border transition-all flex flex-col gap-3 text-left ${max2Back ? "bg-dark text-white border-dark" : "bg-white text-dark border-neutral-100 hover:border-neutral-300"}`}
          >
            <LuShieldCheck size={24} className={max2Back ? "text-primary" : "text-neutral-400"} />
            <div>
              <p className="font-black italic text-base">Max. 2 à l'arrière</p>
              <p className={`text-xs ${max2Back ? "text-neutral-400" : "text-neutral-500"}`}>Plus de confort garanti</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setValue("instantBooking", !instantBooking)}
            className={`p-5 rounded-2xl border transition-all flex flex-col gap-3 text-left ${instantBooking ? "bg-dark text-white border-dark" : "bg-white text-dark border-neutral-100 hover:border-neutral-300"}`}
          >
            <LuZap size={24} className={instantBooking ? "text-amber-400" : "text-neutral-400"} />
            <div>
              <p className="font-black italic text-base">Réservation instantanée</p>
              <p className={`text-xs ${instantBooking ? "text-neutral-400" : "text-neutral-500"}`}>Confirmation automatique</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setValue("petFriendly", !petFriendly)}
            className={`p-5 rounded-2xl border transition-all flex flex-col gap-3 text-left ${petFriendly ? "bg-dark text-white border-dark" : "bg-white text-dark border-neutral-100 hover:border-neutral-300"}`}
          >
            <LuDog size={24} className={petFriendly ? "text-blue-400" : "text-neutral-400"} />
            <div>
              <p className="font-black italic text-base">Animaux acceptés</p>
              <p className={`text-xs ${petFriendly ? "text-neutral-400" : "text-neutral-500"}`}>Wouf ! C'est permis</p>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-10">
        <button 
          onClick={onNext}
          className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-dark transition-all active:scale-[0.98] shadow-xl shadow-primary/20"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
