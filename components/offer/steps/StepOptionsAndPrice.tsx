"use client";

import React from "react";
import { useOfferStore } from "@/store/useOfferStore";

export default function StepOptionsAndPrice({ onNext }: { onNext: () => void }) {
  const { seats, price, setSeatsAndOptions, setPrice } = useOfferStore();

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-black text-dark mb-2">Détails du voyage</h2>
        <p className="text-neutral-500 font-medium">Ajustez le nombre de places et le prix par passager.</p>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        {/* Placeholder content */}
        <div className="p-6 bg-light-400 rounded-2xl border border-neutral-100 flex justify-between items-center">
          <div>
            <span className="block font-black text-dark text-lg">Passagers</span>
            <span className="text-sm font-medium text-neutral-500">Combien de places proposez-vous ?</span>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-3xl p-1 shadow-sm">
            <button 
              onClick={() => setSeatsAndOptions(Math.max(1, seats - 1), {})} 
              className="w-10 h-10 rounded-full bg-light-400 text-dark font-bold hover:bg-neutral-200 transition-colors"
            >
              -
            </button>
            <span className="font-bold text-lg w-4 text-center">{seats}</span>
            <button 
              onClick={() => setSeatsAndOptions(Math.min(8, seats + 1), {})} 
              className="w-10 h-10 rounded-full bg-light-400 text-dark font-bold hover:bg-neutral-200 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="p-6 bg-light-400 rounded-2xl border border-neutral-100 flex flex-col items-center">
            <span className="block font-black text-dark text-lg mb-2">Prix par passager</span>
            <span className="text-sm font-medium text-neutral-500 mb-6 text-center">Nous vous suggérons ce prix équitable basé sur l'itinéraire.</span>
            
            <div className="flex items-center gap-6">
                <button 
                  onClick={() => setPrice(Math.max(1, price - 1))}
                  className="w-12 h-12 rounded-full bg-white shadow-sm border border-neutral-100 text-dark font-bold text-xl hover:border-primary hover:text-primary transition-all"
                >
                  -
                </button>
                <div className="text-4xl font-black text-primary">
                    {price} <span className="text-2xl text-dark">$</span>
                </div>
                <button 
                  onClick={() => setPrice(Math.min(200, price + 1))}
                  className="w-12 h-12 rounded-full bg-white shadow-sm border border-neutral-100 text-dark font-bold text-xl hover:border-primary hover:text-primary transition-all"
                >
                  +
                </button>
            </div>
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
