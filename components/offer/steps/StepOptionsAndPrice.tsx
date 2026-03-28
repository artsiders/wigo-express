"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { OfferRideFormData } from "@/schemas/offer";
import { LuUsers, LuShieldCheck, LuDog, LuZap } from "react-icons/lu";

export default function StepOptionsAndPrice({
  onNext,
}: {
  onNext: () => void;
}) {
  const { watch, setValue } = useFormContext<OfferRideFormData>();
  const seats = watch("seats");
  const price = watch("price");
  const max2Back = watch("max2Back");
  const instantBooking = watch("instantBooking");
  const petFriendly = watch("petFriendly");

  // Helper: Ensure manual entry is always a number in bounds [1, 200]
  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    let numeric = Math.max(1, Math.min(200, Number(value)));
    setValue("price", isNaN(numeric) ? 1 : numeric);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-semibold text-dark mb-2">
          Détails du voyage
        </h2>
        <p className="text-neutral-500 font-medium">
          Ajustez le nombre de places et le prix par passager.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Passagers */}
        <div className="p-6 bg-light-400 rounded-xl border border-neutral-200 flex justify-between items-center group transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary transition-colors">
              <LuUsers size={24} />
            </div>
            <div>
              <span className="block font-semibold text-dark text-lg">
                Passagers
              </span>
              <span className="text-sm font-medium text-neutral-500">
                Combien de places proposez-vous ?
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-full p-1.5 shadow-inner border border-neutral-200">
            <button
              type="button"
              onClick={() => setValue("seats", Math.max(1, seats - 1))}
              className="w-10 h-10 rounded-full bg-light-400 text-dark font-semibold hover:bg-dark hover:text-white transition-all active:scale-90"
            >
              -
            </button>
            <span className="font-semibold text-xl w-6 text-center text-dark">
              {seats}
            </span>
            <button
              type="button"
              onClick={() => setValue("seats", Math.min(8, seats + 1))}
              className="w-10 h-10 rounded-full bg-light-400 text-dark font-semibold hover:bg-dark hover:text-white transition-all active:scale-90"
            >
              +
            </button>
          </div>
        </div>

        {/* Prix */}
        <div className="p-8 bg-light-400 rounded-xl border border-neutral-200 flex flex-col items-center relative overflow-hidden">
          <span className="block mb-6 text-dark font-semibold tracking-tight">
            Prix par passager
          </span>
          <div className="flex items-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setValue("price", Math.max(1, price - 1))}
              className="w-14 h-14 rounded-full bg-white border border-neutral-200 text-dark font-semibold text-2xl hover:bg-primary hover:text-white transition-all active:scale-90"
            >
              -
            </button>
            <div className="text-6xl font-semibold flex items-baseline gap-1 text-primary">
              <input
                type="number"
                min={1}
                max={200}
                value={price}
                step={1}
                onChange={handlePriceInputChange}
                className="input text-primary font-bold text-2xl"
                style={{ MozAppearance: "textfield" }}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <button
              type="button"
              onClick={() => setValue("price", Math.min(200, price + 1))}
              className="w-14 h-14 rounded-full bg-white border border-neutral-200 text-dark font-semibold text-2xl hover:bg-primary hover:text-white transition-all active:scale-90"
            >
              +
            </button>
          </div>
          <p className="text-sm  text-neutral-500 max-w-[240px] text-center">
            Estimation conseillée pour cet itinéraire
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("max2Back", !max2Back)}
            className={`p-5 rounded-xl border transition-all flex flex-col gap-3 text-left ${max2Back ? "bg-dark text-white border-dark" : "bg-white text-dark border-neutral-200 hover:border-neutral-300"}`}
          >
            <LuShieldCheck
              size={24}
              className={max2Back ? "text-primary" : "text-neutral-400"}
            />
            <div>
              <p className="font-semibold text-base">Max. 2 à l'arrière</p>
              <p
                className={`text-xs ${max2Back ? "text-neutral-400" : "text-neutral-500"}`}
              >
                Plus de confort garanti
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setValue("instantBooking", !instantBooking)}
            className={`p-5 rounded-xl border transition-all flex flex-col gap-3 text-left ${instantBooking ? "bg-dark text-white border-dark" : "bg-white text-dark border-neutral-200 hover:border-neutral-300"}`}
          >
            <LuZap
              size={24}
              className={instantBooking ? "text-amber-400" : "text-neutral-400"}
            />
            <div>
              <p className="font-semibold text-base">Réservation instantanée</p>
              <p
                className={`text-xs ${instantBooking ? "text-neutral-400" : "text-neutral-500"}`}
              >
                Confirmation automatique
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setValue("petFriendly", !petFriendly)}
            className={`p-5 rounded-xl border transition-all flex flex-col gap-3 text-left ${petFriendly ? "bg-dark text-white border-dark" : "bg-white text-dark border-neutral-200 hover:border-neutral-300"}`}
          >
            <LuDog
              size={24}
              className={petFriendly ? "text-blue-400" : "text-neutral-400"}
            />
            <div>
              <p className="font-semibold text-base">Animaux acceptés</p>
              <p
                className={`text-xs ${petFriendly ? "text-neutral-400" : "text-neutral-500"}`}
              >
                Wouf ! C'est permis
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-10">
        <button onClick={onNext} className="btn-primary w-full">
          Continuer
        </button>
      </div>
    </div>
  );
}
