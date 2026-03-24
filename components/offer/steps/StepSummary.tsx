"use client";

import React, { useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { useOfferStore } from "@/store/useOfferStore";

export default function StepSummary({ onBack }: { onBack: () => void }) {
  const { departure, arrival, date, time, seats, price, resetOffer } = useOfferStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePublish = () => {
    setLoading(true);
    // Simulation API
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      resetOffer();
    }, 1500);
  };

  if (success) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-5xl">🎉</span>
            </div>
            <h2 className="text-3xl font-black text-dark mb-4">Trajet Publié !</h2>
            <p className="text-neutral-500 font-medium mb-8">Votre trajet est maintenant en ligne. Les passagers peuvent commencer à réserver !</p>
            <button 
                onClick={() => window.location.href = "/"}
                className="px-8 py-4 bg-dark text-white rounded-full font-bold hover:bg-primary transition-all"
            >
                Retour à l'accueil
            </button>
        </div>
    )
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-3xl font-black text-dark mb-2">Résumé</h2>
        <p className="text-neutral-500 font-medium">Vérifiez les informations avant publication.</p>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Mock Summary Data */}
        <div className="bg-light-400 p-5 rounded-2xl border border-neutral-100">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-dark"></div>
                <div className="font-bold text-dark">{departure || "Montréal, QC"}</div>
            </div>
            <div className="ml-[3px] w-0.5 h-6 bg-neutral-300"></div>
            <div className="flex items-center gap-4 mt-4">
                <div className="w-2 h-2 rounded-full bg-primary outline outline-offset-4 outline-primary/20"></div>
                <div className="font-bold text-dark">{arrival || "Québec, QC"}</div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-2 border-light-400 p-4 rounded-2xl">
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Date & Heure</span>
                <span className="font-bold text-dark">{date ? new Date(date).toLocaleDateString() : "Non définie"} à {time}</span>
            </div>
            <div className="bg-white border-2 border-light-400 p-4 rounded-2xl flex justify-between items-center">
                <div>
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Places & Prix</span>
                    <span className="font-bold text-dark">{seats} passager{seats > 1 ? "s":""} x {price} $</span>
                </div>
            </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-light-400">
        <button 
          onClick={handlePublish}
          disabled={loading}
          className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-dark transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20 flex justify-center items-center disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <LuLoaderCircle size={22} className="animate-spin mr-2" />
              Publication...
            </>
          ) : (
            "Publier mon trajet"
          )}
        </button>
      </div>
    </div>
  );
}
