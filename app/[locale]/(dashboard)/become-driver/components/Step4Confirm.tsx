"use client";

import { useFormContext } from "react-hook-form";
import type { DriverApplicationFormData } from "@/schemas/driver";
import {
  LuShieldCheck,
  LuUser,
  LuFileText,
  LuCar,
  LuCheck,
} from "react-icons/lu";

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center py-3 border-b border-neutral-100 last:border-0 group">
      <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest group-hover:text-neutral-500 transition-colors">
        {label}
      </span>
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center">
        <div className="w-24 h-24 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-xl shadow-green-100/50">
          <LuShieldCheck size={48} />
        </div>
        <h2 className="text-4xl font-semibold text-dark tracking-tighter">
          Récapitulatif
        </h2>
        <p className="text-neutral-500 font-medium max-w-sm mx-auto">
          Prenez une seconde pour vérifier vos informations avant la soumission.
        </p>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Personal */}
          <div className="bg-neutral-50/50 rounded-xl p-6 border border-neutral-300 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <LuUser size={16} className="text-primary" />
              </div>
              <span className="text-xs font-semibold text-dark uppercase tracking-widest">
                Profil
              </span>
            </div>
            <SummaryRow label="Prénom" value={data.firstName} />
            <SummaryRow label="Nom" value={data.lastName} />
            <SummaryRow label="Téléphone" value={data.phone} />
          </div>

          {/* License */}
          <div className="bg-neutral-50/50 rounded-xl p-6 border border-neutral-300 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <LuFileText size={16} className="text-primary" />
              </div>
              <span className="text-xs font-semibold text-dark uppercase tracking-widest">
                Permis
              </span>
            </div>
            <SummaryRow label="Numéro" value={data.licenseNumber} />
            <SummaryRow label="Expire le" value={data.licenseExpiry} />
            <SummaryRow label="Pays" value={data.licenseCountry} />
            <div className="flex justify-between items-center pt-3 mt-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                Document
              </span>
              {data.licenseDocumentUrl ? (
                <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full">
                  <span className="text-[10px] font-semibold text-green-600 uppercase tracking-tight">
                    Vérifié
                  </span>
                  <LuCheck size={12} className="text-green-600" />
                </div>
              ) : (
                <span className="text-[10px] text-red-500 font-semibold uppercase">
                  Manquant
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Vehicle */}
          <div className="bg-neutral-50/50 rounded-xl p-6 border border-neutral-300 hover:shadow-md transition-shadow h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <LuCar size={16} className="text-primary" />
              </div>
              <span className="text-xs font-semibold text-dark uppercase tracking-widest">
                Véhicule
              </span>
            </div>
            <SummaryRow label="Marque" value={data.vehicleMake} />
            <SummaryRow label="Modèle" value={data.vehicleModel} />
            <SummaryRow label="Année" value={data.vehicleYear} />
            <SummaryRow label="Plaque" value={data.vehiclePlate} />
            <SummaryRow label="Couleur" value={data.vehicleColor} />
            <SummaryRow
              label="Capacité"
              value={
                data.vehicleSeats ? `${data.vehicleSeats} places` : undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Terms checkbox */}
      <div className="pt-4">
        <label
          className={`flex items-start gap-5 p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            data.acceptTerms
              ? "bg-primary/5 border-primary/20 shadow-xl shadow-primary/5"
              : errors.acceptTerms
                ? "bg-red-50 border-red-200"
                : "bg-white border-neutral-100 hover:border-primary/20 hover:bg-neutral-50/50"
          }`}
        >
          <div className="relative shrink-0 mt-1">
            <input
              {...register("acceptTerms")}
              type="checkbox"
              className="sr-only"
            />
            <div
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                data.acceptTerms
                  ? "bg-primary border-primary rotate-360 scale-110 shadow-lg shadow-primary/30"
                  : "border-neutral-200 bg-white"
              }`}
            >
              {data.acceptTerms && <LuCheck size={16} className="text-white" />}
            </div>
          </div>
          <div>
            <p className="text-base font-semibold text-dark tracking-tight leading-none mb-2">
              Engagement et assurance
            </p>
            <p className="text-sm text-neutral-500 font-medium leading-relaxed">
              Je certifie l'exactitude des informations fournies et confirme que
              mon véhicule est en règle et correctement assuré pour le
              covoiturage.
            </p>
          </div>
        </label>

        {errors.acceptTerms && (
          <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 text-red-500 animate-in slide-in-from-top-1">
            <LuShieldCheck size={14} />
            <p className="text-xs font-bold uppercase tracking-widest">
              {errors.acceptTerms.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
