"use client";

import { useFormContext } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { KycIdentityFormData } from "@/schemas/driver";
import { LuUpload, LuCheck, LuX, LuInfo, LuBarcode } from "react-icons/lu";
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

export function StepIdentityVerso() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<KycIdentityFormData>();

  const currentVal = watch("versoUrl");
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setValue("versoUrl", file, { shouldValidate: true });
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const clear = () => {
    setValue("versoUrl", "", { shouldValidate: true });
    setPreview(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Visual Guide / Illustration */}
      <div className="space-y-6">
        <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

          <h3 className="text-xl font-semibold text-dark tracking-tight mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-sm font-bold">
              2
            </span>
            Guide de capture
          </h3>

          {/* SVG Illustration - ID Card Verso */}

          <div className="w-full max-w-lg aspect-[1.6] bg-white rounded-3xl relative z-20 mx-auto shadow-sm mb-4">
            {/* Même filigrane que le recto */}
            <img
              src="/images/canada-flag-icon.png"
              alt="Canada"
              className="object-contain absolute bottom-0 right-0 w-48 h-48 -rotate-45 opacity-10 pointer-events-none"
            />

            <div className="border border-neutral-200/60 rounded-2xl p-4 h-full relative z-10 overflow-hidden text-left flex flex-col justify-between bg-white/50 backdrop-blur-xs">
              {/* Header : Drapeau + Label Verso */}
              <div className="flex justify-between items-start mb-2">
                <img
                  src="/images/canada-flag.png"
                  alt="Canada"
                  width={22}
                  height={22}
                  className="object-contain"
                />
                <div className="text-[10px] font-bold text-neutral-400 tracking-[0.2em] uppercase">
                  Verso / Back
                </div>
              </div>

              {/* Corps du Verso */}
              <div className="space-y-6 relative z-10">
                {/* Bande magnétique simulée */}
                <div className="w-[110%] -ml-8 h-8 sm:h-10 bg-neutral-800/90 rounded-sm mb-2" />

                {/* Informations d'adresse ou autres données */}
                <div className="space-y-3">
                  <div>
                    <div className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Adresse / Address
                    </div>
                    <div className="h-3 w-full bg-neutral-200/60 rounded-md" />
                    <div className="h-3 w-2/3 bg-neutral-200/60 rounded-md mt-2" />
                  </div>
                </div>

                {/* Code-barres simulé avec React Icon */}
                <div className="flex flex-col items-start justify-start pt-2 opacity-40">
                  <LuBarcode className="w-fit h-8 text-neutral-800" />
                  <div className="text-[8px] font-mono tracking-[0.5em] mt-1">
                    123456789012
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ul className="space-y-3">
            {[
              "Assurez-vous que la bande magnétique est complète",
              "Le code-barres (MRZ) doit être net et lisible",
              "Utilisez un fond contrasté pour la photo",
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
            Capturez le côté pile de votre pièce d'identité officielle.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-dark tracking-tighter leading-none">
            Verso du document
          </h2>
          <p className="text-neutral-500 font-medium">
            Glissez ou prenez une photo claire du verso.
          </p>
        </div>

        {preview ? (
          <div className="relative rounded-xl overflow-hidden border-2 border-primary bg-neutral-50 shadow-2xl animate-in zoom-in-95 duration-500 group">
            <img
              src={preview}
              alt="Verso"
              className="w-full aspect-[1.6/1] object-cover"
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
                    Document prêt
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
            {...getRootProps()}
            className={`group relative aspect-[1.6/1] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 overflow-hidden ${
              isDragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : errors.versoUrl
                  ? "border-red-400 bg-red-50"
                  : "border-neutral-200 hover:border-primary/50 hover:bg-neutral-50 bg-neutral-50/20"
            }`}
          >
            <input {...getInputProps()} />

            <div className="w-18 h-18 rounded-full bg-white shadow-2xl border border-neutral-100 flex items-center justify-center mb-6">
              <LuUpload size={22} className="text-primary" />
            </div>

            <div className="space-y-1">
              <p className="text-xl font-semibold text-dark tracking-tight">
                {isDragActive ? "Lâchez pour uploader" : "Uploader le Verso"}
              </p>
              <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest text-[10px]">
                JPG, PNG — Max 5 Mo
              </p>
            </div>
          </div>
        )}

        <FieldError message={errors.versoUrl?.message as string} />
      </div>
    </div>
  );
}
