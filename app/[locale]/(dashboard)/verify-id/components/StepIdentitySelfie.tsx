"use client";

import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { KycIdentityFormData } from "@/schemas/driver";
import CameraCapture from "@/components/kyc/CameraCapture";
import { LuCamera, LuCheck, LuX, LuInfo } from "react-icons/lu";
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

export function StepIdentitySelfie() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<KycIdentityFormData>();

  const [showCamera, setShowCamera] = useState(false);
  const currentVal = watch("selfieUrl");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof currentVal === "string" && currentVal.startsWith("http")) {
      setPreview(currentVal);
    } else if ((currentVal as any) instanceof File) {
      const url = URL.createObjectURL(currentVal as any);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [currentVal]);

  const handleCapture = (blob: Blob) => {
    setShowCamera(false);
    const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
    setValue("selfieUrl", file, { shouldValidate: true });
  };

  const clear = () => {
    setValue("selfieUrl", "", { shouldValidate: true });
    setPreview(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Visual Guide / Illustration */}
      <div className="space-y-6">
        <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

          <h3 className="text-xl font-semibold text-dark tracking-tight mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-sm font-bold">
              3
            </span>
            Guide du Selfie
          </h3>

          {/* SVG Illustration - Selfie with Card */}
          <div className="relative aspect-square bg-white rounded-xl border-2 border-dashed border-neutral-200 flex items-center justify-center p-6 shadow-sm mb-6 overflow-hidden max-w-[280px] mx-auto">
            <div className="w-full h-full rounded-full bg-neutral-100 border border-neutral-200 relative overflow-hidden">
              {/* Person Silhouette */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-neutral-300 rounded-full" />
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-24 bg-neutral-300 rounded-[30px]" />

              {/* Hand holding card */}
              <div className="absolute bottom-10 right-4 w-16 h-20 bg-primary/20 border-2 border-primary/40 rounded-lg rotate-12 flex flex-col p-2 gap-1">
                <div className="w-4 h-4 rounded-full bg-primary/30" />
                <div className="h-1 w-full bg-primary/20 rounded-full" />
                <div className="h-1 w-2/3 bg-primary/20 rounded-full" />
              </div>

              {/* Camera Flash effect */}
              <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            </div>
            {/* Overlay Focus */}
            <div className="absolute inset-4 border-2 border-primary/40 rounded-full border-dashed animate-spin-slow" />
          </div>

          <ul className="space-y-3">
            {[
              "Tenez votre carte à côté de votre visage",
              "Votre visage doit être entièrement découvert",
              "La photo doit être nette et sans flou",
            ].map((text, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm font-semibold text-neutral-500"
              >
                <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                  <LuCheck size={12} />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-primary/5 rounded-xl border border-primary-100/50 flex items-start gap-3">
          <LuInfo size={18} className="text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold text-primary/70 leading-relaxed uppercase tracking-widest">
            Le selfie permet de confirmer que vous êtes bien le titulaire du
            document.
          </p>
        </div>
      </div>

      {/* Action Zone */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-dark tracking-tighter leading-none">
            Selfie de contrôle
          </h2>
          <p className="text-neutral-500 font-medium">
            Prenez un selfie avec votre document en main.
          </p>
        </div>

        {preview ? (
          <div className="relative rounded-xl overflow-hidden border-2 border-primary bg-neutral-50 shadow-2xl animate-in zoom-in-95 duration-500 group">
            <img
              src={preview}
              alt="Selfie"
              className="w-full aspect-square object-cover scale-x-[-1]"
            />
            <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
              <button
                type="button"
                onClick={clear}
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
                    Selfie validé
                  </p>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase">
                    Sera envoyé à la fin
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setShowCamera(true)}
            className={`group relative aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 overflow-hidden ${
              errors.selfieUrl
                ? "border-red-400 bg-red-50"
                : "border-neutral-200 hover:border-primary/50 hover:bg-neutral-50 bg-neutral-50/20"
            }`}
          >
            <div className="w-24 h-24 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center mb-6 relative">
              <LuCamera size={22} />
            </div>

            <div className="space-y-1">
              <p className="text-xl font-semibold text-dark tracking-tight">
                Ouvrir la caméra
              </p>
              <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest text-[10px]">
                Prise de vue sécurisée en direct
              </p>
            </div>

            {/* Scanning effect decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 animate-scan pointer-events-none" />
          </div>
        )}

        <FieldError message={errors.selfieUrl?.message as string} />
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}
