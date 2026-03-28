"use client";

import { useFormContext } from "react-hook-form";
import type { DriverApplicationFormData } from "@/schemas/driver";
import {
  LuCar,
  LuHash,
  LuPalette,
  LuUsers,
  LuCalendar,
  LuChevronDown,
} from "react-icons/lu";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 text-red-500 mt-2 p-3 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
      <p className="text-xs font-bold leading-tight">{message}</p>
    </div>
  );
}

const CAR_MAKES = [
  "Toyota",
  "Volkswagen",
  "Ford",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Peugeot",
  "Renault",
  "Citroën",
  "Honda",
  "Hyundai",
  "Kia",
  "Nissan",
  "Fiat",
  "Volvo",
  "Tesla",
  "Dacia",
  "Opel",
  "Skoda",
  "SEAT",
  "Mazda",
  "Autre",
];

const COLORS = [
  "Blanc",
  "Noir",
  "Gris",
  "Argent",
  "Bleu",
  "Rouge",
  "Vert",
  "Beige",
  "Marron",
  "Orange",
  "Jaune",
  "Violet",
  "Autre",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from(
  { length: currentYear - 1999 },
  (_, i) => currentYear - i,
);

export function Step3Vehicle() {
  const {
    register,
    formState: { errors },
  } = useFormContext<DriverApplicationFormData>();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-dark tracking-tighter">
          Votre Véhicule
        </h2>
        <p className="text-neutral-500 font-medium">
          Pour que vos passagers puissent vous reconnaître facilement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Make */}
        <div className="space-y-2">
          <label className="font-semibold tracking-widest ml-1 mb-2 block">
            Marque
          </label>
          <div className="relative group">
            <LuCar
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors"
            />
            <select
              {...register("vehicleMake")}
              className={`input pl-12 appearance-none input-select ${errors.vehicleMake ? "input-error" : ""}`}
            >
              <option value="">Sélectionnez</option>
              {CAR_MAKES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
              <LuChevronDown size={14} />
            </div>
          </div>
          <FieldError message={errors.vehicleMake?.message} />
        </div>

        {/* Model */}
        <div className="space-y-2">
          <label className="font-semibold tracking-widest ml-1 mb-2 block">
            Modèle
          </label>
          <div className="relative group">
            <LuCar
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors opacity-60"
            />
            <input
              {...register("vehicleModel")}
              type="text"
              placeholder="Ex: Model 3, 308, Golf..."
              className={`input pl-12 ${errors.vehicleModel ? "input-error" : ""}`}
            />
          </div>
          <FieldError message={errors.vehicleModel?.message} />
        </div>

        {/* Year */}
        <div className="space-y-2">
          <label className="font-semibold tracking-widest ml-1 mb-2 block">
            Année de mise en circulation
          </label>
          <div className="relative group">
            <LuCalendar
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors"
            />
            <select
              {...register("vehicleYear", { valueAsNumber: true })}
              className={`input pl-12 appearance-none input-select ${errors.vehicleYear ? "input-error" : ""}`}
            >
              <option value="">Sélectionnez</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
              <LuChevronDown size={14} />
            </div>
          </div>
          <FieldError message={errors.vehicleYear?.message} />
        </div>

        {/* License Plate */}
        <div className="space-y-2">
          <label className="font-semibold tracking-widest ml-1 mb-2 block">
            Plaque d'immatriculation
          </label>
          <div className="relative group">
            <LuHash
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors"
            />
            <input
              {...register("vehiclePlate")}
              type="text"
              placeholder="Ex: AA-123-BB"
              className={`input pl-12 uppercase font-black tracking-widest ${errors.vehiclePlate ? "input-error" : ""}`}
            />
          </div>
          <FieldError message={errors.vehiclePlate?.message} />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="font-semibold tracking-widest ml-1 mb-2 block">
            Couleur dominante
          </label>
          <div className="relative group">
            <LuPalette
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors"
            />
            <select
              {...register("vehicleColor")}
              className={`input pl-12 appearance-none input-select ${errors.vehicleColor ? "input-error" : ""}`}
            >
              <option value="">Sélectionnez</option>
              {COLORS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
              <LuChevronDown size={14} />
            </div>
          </div>
          <FieldError message={errors.vehicleColor?.message} />
        </div>

        {/* Seats */}
        <div className="space-y-2">
          <label className="font-semibold tracking-widest ml-1 mb-2 block">
            Nombre de places disponibles
          </label>
          <div className="relative group">
            <LuUsers
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors"
            />
            <select
              {...register("vehicleSeats", { valueAsNumber: true })}
              className={`input pl-12 appearance-none input-select ${errors.vehicleSeats ? "input-error" : ""}`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} place{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
              <LuChevronDown size={14} />
            </div>
          </div>
          <FieldError message={errors.vehicleSeats?.message} />
        </div>
      </div>

      {/* Info banner */}
      <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <LuCar size={20} className="text-primary" />
        </div>
        <div>
          <p className="text-sm text-dark font-black uppercase tracking-tight mb-1">
            Visibilité du véhicule
          </p>
          <p className="text-xs text-neutral-500 font-bold leading-relaxed">
            Ces informations permettent aux passagers de vous repérer.
            Assurez-vous qu'elles sont exactes avant de valider votre profil.
          </p>
        </div>
      </div>
    </div>
  );
}
