"use client";

import { useFormContext } from "react-hook-form";
import type { DriverApplicationFormData } from "@/schemas/driver";
import {
  LuShieldCheck,
  LuUser,
  LuFileText,
  LuCar,
  LuCircleCheck,
} from "react-icons/lu";

function SummaryRow({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-neutral-100 last:border-0">
      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-semibold text-dark">{value}</span>
    </div>
  );
}

export function Step4Confirm() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<DriverApplicationFormData>();

  const data = watch();

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <div className="w-20 h-20 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4 border border-green-100 shadow-sm">
          <LuShieldCheck size={40} />
        </div>
        <h2 className="text-3xl font-black text-dark">Dernière Étape</h2>
        <p className="text-neutral-500 font-medium max-w-sm mx-auto">
          Vérifiez vos informations et confirmez votre candidature.
        </p>
      </div>

      {/* Summary */}
      <div className="space-y-4">
        {/* Personal */}
        <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
          <div className="flex items-center gap-2 mb-3">
            <LuUser size={15} className="text-primary" />
            <span className="text-xs font-black text-neutral-500 uppercase tracking-widest">Informations</span>
          </div>
          <SummaryRow label="Prénom" value={data.firstName} />
          <SummaryRow label="Nom" value={data.lastName} />
          <SummaryRow label="Téléphone" value={data.phone} />
        </div>

        {/* License */}
        <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
          <div className="flex items-center gap-2 mb-3">
            <LuFileText size={15} className="text-primary" />
            <span className="text-xs font-black text-neutral-500 uppercase tracking-widest">Permis</span>
          </div>
          <SummaryRow label="Numéro" value={data.licenseNumber} />
          <SummaryRow label="Expiration" value={data.licenseExpiry} />
          <SummaryRow label="Pays" value={data.licenseCountry} />
          <div className="flex justify-between items-center pt-2.5">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Document</span>
            {data.licenseDocumentUrl ? (
              <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                <LuCircleCheck size={14} />
                Uploadé
              </span>
            ) : (
              <span className="text-xs text-red-400 font-bold">Manquant</span>
            )}
          </div>
        </div>

        {/* Vehicle */}
        <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
          <div className="flex items-center gap-2 mb-3">
            <LuCar size={15} className="text-primary" />
            <span className="text-xs font-black text-neutral-500 uppercase tracking-widest">Véhicule</span>
          </div>
          <SummaryRow label="Marque" value={data.vehicleMake} />
          <SummaryRow label="Modèle" value={data.vehicleModel} />
          <SummaryRow label="Année" value={data.vehicleYear} />
          <SummaryRow label="Plaque" value={data.vehiclePlate} />
          <SummaryRow label="Couleur" value={data.vehicleColor} />
          <SummaryRow label="Places" value={data.vehicleSeats ? `${data.vehicleSeats} place(s)` : undefined} />
        </div>
      </div>

      {/* Terms checkbox */}
      <label
        className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
          data.acceptTerms
            ? "bg-primary/5 border-primary/30"
            : errors.acceptTerms
            ? "bg-red-50/40 border-red-300"
            : "bg-white border-neutral-200 hover:border-primary/30"
        }`}
      >
        <div className="relative shrink-0 mt-0.5">
          <input
            {...register("acceptTerms")}
            type="checkbox"
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              data.acceptTerms
                ? "bg-primary border-primary"
                : "border-neutral-300 bg-white"
            }`}
          >
            {data.acceptTerms && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-dark">
            Je certifie que toutes les informations sont exact et que mon véhicule est assuré.
          </p>
          <p className="text-xs text-neutral-400 font-medium mt-1">
            En soumettant, vous acceptez nos{" "}
            <span className="text-primary underline cursor-pointer">conditions générales de transporteur</span>.
          </p>
        </div>
      </label>

      {errors.acceptTerms && (
        <p className="text-red-500 text-xs font-semibold flex items-center gap-1 -mt-4">
          <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
          {errors.acceptTerms.message}
        </p>
      )}
    </div>
  );
}
