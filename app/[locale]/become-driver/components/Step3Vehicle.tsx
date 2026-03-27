"use client";

import { useFormContext } from "react-hook-form";
import type { DriverApplicationFormData } from "@/schemas/driver";
import { LuCar, LuHash, LuPalette, LuUsers, LuCalendar } from "react-icons/lu";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
      <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
      {message}
    </p>
  );
}

const CAR_MAKES = [
  "Toyota", "Volkswagen", "Ford", "BMW", "Mercedes-Benz", "Audi", "Peugeot",
  "Renault", "Citroën", "Honda", "Hyundai", "Kia", "Nissan", "Fiat", "Volvo",
  "Tesla", "Dacia", "Opel", "Skoda", "SEAT", "Mazda", "Autre",
];

const COLORS = [
  "Blanc", "Noir", "Gris", "Argent", "Bleu", "Rouge", "Vert", "Beige",
  "Marron", "Orange", "Jaune", "Violet", "Autre",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

export function Step3Vehicle() {
  const {
    register,
    formState: { errors },
  } = useFormContext<DriverApplicationFormData>();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-dark">Votre Véhicule</h2>
        <p className="text-neutral-500 font-medium">
          Pour que vos passagers puissent vous reconnaître facilement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Make */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
            Marque
          </label>
          <div className="relative">
            <LuCar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <select
              {...register("vehicleMake")}
              className={`input pl-11 appearance-none ${errors.vehicleMake ? "border-red-400 focus:ring-red-400/30" : ""}`}
            >
              <option value="">Sélectionnez une marque</option>
              {CAR_MAKES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <FieldError message={errors.vehicleMake?.message} />
        </div>

        {/* Model */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
            Modèle
          </label>
          <div className="relative">
            <LuCar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 opacity-60" />
            <input
              {...register("vehicleModel")}
              type="text"
              placeholder="Ex: Model 3, 308, Golf..."
              className={`input pl-11 ${errors.vehicleModel ? "border-red-400 focus:ring-red-400/30" : ""}`}
            />
          </div>
          <FieldError message={errors.vehicleModel?.message} />
        </div>

        {/* Year */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
            Année
          </label>
          <div className="relative">
            <LuCalendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <select
              {...register("vehicleYear", { valueAsNumber: true })}
              className={`input pl-11 appearance-none ${errors.vehicleYear ? "border-red-400 focus:ring-red-400/30" : ""}`}
            >
              <option value="">Sélectionnez l'année</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <FieldError message={errors.vehicleYear?.message} />
        </div>

        {/* License Plate */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
            Plaque d'immatriculation
          </label>
          <div className="relative">
            <LuHash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              {...register("vehiclePlate")}
              type="text"
              placeholder="Ex: AA-123-BB"
              className={`input pl-11 uppercase ${errors.vehiclePlate ? "border-red-400 focus:ring-red-400/30" : ""}`}
            />
          </div>
          <FieldError message={errors.vehiclePlate?.message} />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
            Couleur
          </label>
          <div className="relative">
            <LuPalette size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <select
              {...register("vehicleColor")}
              className={`input pl-11 appearance-none ${errors.vehicleColor ? "border-red-400 focus:ring-red-400/30" : ""}`}
            >
              <option value="">Sélectionnez une couleur</option>
              {COLORS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <FieldError message={errors.vehicleColor?.message} />
        </div>

        {/* Seats */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
            Places disponibles
          </label>
          <div className="relative">
            <LuUsers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <select
              {...register("vehicleSeats", { valueAsNumber: true })}
              className={`input pl-11 appearance-none ${errors.vehicleSeats ? "border-red-400 focus:ring-red-400/30" : ""}`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>{n} place{n > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>
          <FieldError message={errors.vehicleSeats?.message} />
        </div>
      </div>

      {/* Info banner */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 flex items-start gap-3">
        <LuCar size={18} className="text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-neutral-600 font-medium">
          Votre véhicule sera visible dans votre profil de conducteur. Assurez-vous qu'il soit conforme aux règles en vigueur.
        </p>
      </div>
    </div>
  );
}
