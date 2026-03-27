"use client";

import { useFormContext } from "react-hook-form";
import { Step1Data } from "@/schemas/driver";
import { LuUser, LuMail, LuChevronDown } from "react-icons/lu";
import { useState } from "react";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
      <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
      {message}
    </p>
  );
}

// NANP format: (XXX) XXX-XXXX
const normalizePhone = (value: string) => {
  if (!value) return value;
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

interface Props {
  sessionName?: string | null;
  sessionEmail?: string | null;
}

const COUNTRIES = [
  { code: "CA", flag: "🇨🇦", label: "Canada" },
  { code: "US", flag: "🇺🇸", label: "USA" },
];

export function Step1Personal({ sessionName, sessionEmail }: Props) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showFlags, setShowFlags] = useState(false);

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<Step1Data>();

  const nameParts = sessionName?.split(" ") ?? [];
  const defaultFirstName = nameParts[0] ?? "";
  const defaultLastName = nameParts.slice(1).join(" ") ?? "";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-dark">
          Informations Personnelles
        </h2>
        <p className="text-neutral-500 font-medium">
          Vérifiez ou complétez vos informations de base.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
            Prénom
          </label>
          <div className="relative">
            <LuUser
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              {...register("firstName")}
              type="text"
              defaultValue={defaultFirstName}
              placeholder="Ex: Alex"
              className={`input pl-11 ${errors.firstName ? "border-red-400 focus:ring-red-400/30" : ""}`}
            />
          </div>
          <FieldError message={errors.firstName?.message} />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
            Nom
          </label>
          <div className="relative">
            <LuUser
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              {...register("lastName")}
              type="text"
              defaultValue={defaultLastName}
              placeholder="Ex: Conducteur"
              className={`input pl-11 ${errors.lastName ? "border-red-400 focus:ring-red-400/30" : ""}`}
            />
          </div>
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      {/* Email (display only) */}
      {sessionEmail && (
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
            Email (compte)
          </label>
          <div className="relative">
            <LuMail
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="email"
              value={sessionEmail}
              disabled
              className="input pl-11 opacity-50 cursor-not-allowed bg-neutral-50"
            />
          </div>
          <p className="text-xs text-neutral-400 pl-1">
            Lié à votre compte - non modifiable ici
          </p>
        </div>
      )}

      {/* Phone with normalize and flag selector */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
          Téléphone
        </label>
        <div className="flex gap-2">
          {/* Flag selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFlags(!showFlags)}
              className="h-[60px] px-4 flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-2xl hover:bg-neutral-100 transition-all font-bold text-dark"
            >
              <span className="text-xl">{selectedCountry.flag}</span>
              <span className="text-[15px] opacity-70">+1</span>
              <LuChevronDown
                size={14}
                className={`opacity-40 transition-transform ${showFlags ? "rotate-180" : ""}`}
              />
            </button>

            {showFlags && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-neutral-100 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(c);
                      setShowFlags(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-all text-left ${selectedCountry.code === c.code ? "bg-primary/5 text-primary" : ""}`}
                  >
                    <span className="text-xl">{c.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{c.label}</span>
                      <span className="text-[11px] opacity-60">+1</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actual input with masks */}
          <div className="flex-1 relative">
            <input
              {...register("phone")}
              onChange={(e) => {
                const normalized = normalizePhone(e.target.value);
                setValue("phone", normalized, { shouldValidate: true });
              }}
              type="tel"
              placeholder="(555) 555-5555"
              className={`input ${errors.phone ? "border-red-400 focus:ring-red-400/30" : ""}`}
            />
          </div>
        </div>
        <FieldError message={errors.phone?.message} />
      </div>
    </div>
  );
}
