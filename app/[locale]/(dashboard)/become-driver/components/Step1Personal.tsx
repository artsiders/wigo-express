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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-dark tracking-tighter">
          Informations Personnelles
        </h2>
        <p className="text-neutral-500 font-medium">
          Vérifiez ou complétez vos informations de base.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
        {/* First Name */}
        <div className="space-y-2">
          <label className="font-semibold tracking-widest ml-1 mb-2 block">
            Prénom
          </label>
          <div className="relative group">
            <LuUser
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors"
            />
            <input
              {...register("firstName")}
              type="text"
              placeholder="Ex: Alex"
              className={`input pl-12 ${errors.firstName ? "input-error" : ""}`}
            />
          </div>
          <FieldError message={errors.firstName?.message} />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="font-semibold tracking-widest ml-1 mb-2 block">
            Nom
          </label>
          <div className="relative group">
            <LuUser
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors"
            />
            <input
              {...register("lastName")}
              type="text"
              placeholder="Ex: Gagnon"
              className={`input pl-12 ${errors.lastName ? "input-error" : ""}`}
            />
          </div>
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      {/* Email (display only) */}
      {sessionEmail && (
        <div className="space-y-2">
          <label className="font-semibold tracking-widest ml-1 mb-2 block">
            Email de votre compte
          </label>
          <div className="relative group">
            <LuMail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="email"
              value={sessionEmail}
              disabled
              className="input pl-12 opacity-50 cursor-not-allowed bg-neutral-50 border-neutral-200"
            />
          </div>
          <p className="text-[10px] font-bold text-neutral-400 ml-1 uppercase tracking-widest">
            Non modifiable — lié à votre identité Wigo
          </p>
        </div>
      )}

      {/* Phone with normalize and flag selector */}
      <div className="space-y-2">
        <label className="font-semibold tracking-widest ml-1 mb-2 block">
          Numéro de téléphone
        </label>
        <div className="flex gap-1">
          {/* Flag selector using btn-white structure */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFlags(!showFlags)}
              className="h-[58px] px-4 flex items-center gap-3 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all font-bold text-dark group"
            >
              <span className="text-2xl">{selectedCountry.flag}</span>
              <span className="font-bold text-neutral-400">+1</span>
              <LuChevronDown
                size={16}
                className={`text-neutral-300 transition-transform duration-300 ${showFlags ? "rotate-180" : ""}`}
              />
            </button>

            {showFlags && (
              <div className="absolute top-full left-0 mt-3 w-56 bg-white border border-neutral-100 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(c);
                      setShowFlags(false);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg hover:bg-neutral-50 transition-all text-left ${selectedCountry.code === c.code ? "bg-primary/5 text-primary" : "text-dark"}`}
                  >
                    <span className="text-2xl leading-none">{c.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold tracking-tight">
                        {c.label}
                      </span>
                      <span className="font-semibold text-neutral-500">+1</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actual input with masks */}
          <div className="flex-1 relative group">
            <input
              {...register("phone")}
              onChange={(e) => {
                const normalized = normalizePhone(e.target.value);
                setValue("phone", normalized, { shouldValidate: true });
              }}
              type="tel"
              placeholder="(555) 555-5555"
              className={`input font-semibold ${errors.phone ? "input-error" : ""}`}
            />
          </div>
        </div>
        <FieldError message={errors.phone?.message} />
      </div>
    </div>
  );
}
