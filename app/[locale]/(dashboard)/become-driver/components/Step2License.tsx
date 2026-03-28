"use client";

import { useFormContext } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import type { DriverApplicationFormData } from "@/schemas/driver";
import {
  LuFileText,
  LuCalendar,
  LuGlobe,
  LuUpload,
  LuCheck,
  LuX,
  LuInfo,
} from "react-icons/lu";
import { IoAlert } from "react-icons/io5";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 text-red-500 mt-2 p-3 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
      <IoAlert size={16} className="shrink-0" />
      <p className="text-xs font-bold leading-tight">{message}</p>
    </div>
  );
}

const COUNTRIES = ["Canada", "États-Unis"];

export function Step2License() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DriverApplicationFormData>();

  const [preview, setPreview] = useState<string | null>(null);
  const currentVal = watch("licenseDocumentUrl");

  useEffect(() => {
    if (typeof currentVal === "string" && currentVal.startsWith("http")) {
      setPreview(currentVal);
    } else if ((currentVal as any) instanceof File) {
      const url = URL.createObjectURL(currentVal as any);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [currentVal]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setValue("licenseDocumentUrl", file, { shouldValidate: true });
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const clearDocument = () => {
    setValue("licenseDocumentUrl", "", { shouldValidate: true });
    setPreview(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-dark tracking-tighter">
          Votre Permis de Conduire
        </h2>
        <p className="text-neutral-500 font-medium">
          Nous avons besoin d'une preuve de votre aptitude à conduire.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Form Fields */}
        <div className="space-y-6">
          {/* License Number */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700 tracking-widest ml-1">
              Numéro du permis
            </label>
            <div className="relative group">
              <LuFileText
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors"
              />
              <input
                {...register("licenseNumber")}
                type="text"
                placeholder="Ex: ABC-123456"
                className={`input pl-12 ${errors.licenseNumber ? "input-error" : ""}`}
              />
            </div>
            <FieldError message={errors.licenseNumber?.message as string} />
          </div>

          {/* Expiry + Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 tracking-widest ml-1">
                Date d'expiration
              </label>
              <div className="relative group">
                <LuCalendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors"
                />
                <input
                  {...register("licenseExpiry")}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className={`input pl-12 ${errors.licenseExpiry ? "input-error" : ""}`}
                />
              </div>
              <FieldError message={errors.licenseExpiry?.message as string} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 tracking-widest ml-1">
                Pays d'émission
              </label>
              <div className="relative group">
                <LuGlobe
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors"
                />
                <select
                  {...register("licenseCountry")}
                  className={`input pl-12 appearance-none input-select ${errors.licenseCountry ? "input-error" : ""}`}
                >
                  <option value="">Sélectionnez</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                  <LuChevronDown size={14} />
                </div>
              </div>
              <FieldError message={errors.licenseCountry?.message as string} />
            </div>
          </div>

          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
            <LuInfo size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-primary/80 leading-relaxed uppercase tracking-widest">
              Votre permis doit être valide et lisible pour être approuvé.
            </p>
          </div>
        </div>

        {/* Right: Document Upload & Illustration */}
        <div className="space-y-6">
          <label className="text-sm font-semibold text-neutral-700 tracking-widest ml-1">
            Photo du document
          </label>

          {preview ? (
            <div className="relative rounded-xl overflow-hidden border-2 border-primary bg-neutral-50 shadow-2xl animate-in zoom-in-95 duration-500 group">
              <img
                src={preview}
                alt="Permis uploadé"
                className="w-full aspect-[1.6/1] object-cover"
              />
              <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={clearDocument}
                  className="btn-white text-red-500 border-red-100 hover:bg-red-50 scale-90 group-hover:scale-100 transition-transform"
                >
                  <LuX size={18} />
                  Supprimer
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white/40 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30">
                    <LuCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-dark uppercase tracking-widest">
                      Fichier prêt
                    </p>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase">
                      Envoi lors de la validation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`group relative aspect-[1.6/1] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 overflow-hidden ${
                isDragActive
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : errors.licenseDocumentUrl
                    ? "border-red-400 bg-red-50"
                    : "border-neutral-200 hover:border-primary/50 hover:bg-neutral-50/50 bg-neutral-50/20"
              }`}
            >
              <input {...getInputProps()} />

              <div className="w-18 h-18 rounded-full bg-white shadow-xl border border-neutral-100 flex items-center justify-center mb-6">
                <LuUpload size={22} className="text-primary" />
              </div>

              <div className="space-y-1">
                <p className="text-lg font-black text-dark tracking-tight">
                  {isDragActive ? "Déposez ici !" : "Uploader votre permis"}
                </p>
                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">
                  JPG, PNG ou WebP — Max. 5 Mo
                </p>
              </div>
              {/* Fake license illustration in background */}
              <div className="absolute inset-x-8 bottom-[-20%] h-1/2 bg-neutral-100/50 rounded-t-xl border border-neutral-200 -z-10 group-hover:translate-y-[-10%] transition-transform duration-700" />
            </div>
          )}

          <FieldError message={errors.licenseDocumentUrl?.message as string} />
        </div>
      </div>
    </div>
  );
}

// Add simple LuChevronDown for the select
function LuChevronDown({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
