"use client";

import { useFormContext } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { KycIdentityFormData } from "@/schemas/driver";
import { LuUpload, LuCheck, LuX, LuInfo, LuUser } from "react-icons/lu";
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

export function StepIdentityRecto() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<KycIdentityFormData>();

  const currentVal = watch("rectoUrl");
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
      setValue("rectoUrl", file, { shouldValidate: true });
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
    setValue("rectoUrl", "", { shouldValidate: true });
    setPreview(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Visual Guide / Illustration */}
      <div className="space-y-6">
        <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
          <h3 className="text-xl font-black text-dark tracking-tight mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center text-sm font-bold">
              1
            </span>
            Guide de capture
          </h3>

          {/* SVG Illustration - ID Card Recto */}
          <div className="w-full max-w-lg aspect-[1.6] bg-white rounded-3xl relative z-20 mx-auto shadow-sm mb-4">
            <img
              src="/images/canada-flag-icon.png"
              alt="Canada"
              className="object-contain absolute bottom-0 right-0 w-48 h-48 -rotate-45 opacity-10 pointer-events-none"
            />

            <div className="border border-neutral-200/60 rounded-2xl p-5 sm:p-7 h-full relative z-10 overflow-hidden text-left flex flex-col justify-between bg-white/50 backdrop-blur-xs">
              {/* Header Simple */}
              <div className="flex justify-between items-start mb-2">
                <img
                  src="/images/canada-flag.png"
                  alt="Canada"
                  width={22}
                  height={22}
                  className="object-contain"
                />
                <div className="text-[10px] font-bold text-neutral-400 tracking-[0.2em] uppercase">
                  Recto / Front
                </div>
              </div>

              {/* Profile row */}
              <div className="flex gap-5 sm:gap-6 items-center relative z-10">
                {/* Cadre photo avec Icône React */}
                <div className="w-18 h-18 sm:w-24 sm:h-24 aspect-square rounded-2xl shrink-0 border border-neutral-200 bg-neutral-50 flex items-center justify-center shadow-inner">
                  <LuUser className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-300" />
                </div>

                <div className="space-y-3 w-full">
                  <div>
                    <div className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Nom / Name
                    </div>
                    <div className="h-4 w-3/4 bg-neutral-200/60 rounded-md" />
                  </div>
                  <div>
                    <div className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Prénom / Given Name
                    </div>
                    <div className="h-4 w-1/2 bg-neutral-200/60 rounded-md" />
                  </div>
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex justify-between items-end relative z-10 mt-3">
                <div className="h-1.5 w-32 bg-neutral-100 rounded-full" />
                <div className="px-4 py-2 rounded-lg bg-neutral-50 text-[10px] text-neutral-400 font-mono border border-neutral-100 font-bold shadow-sm inline-flex items-center">
                  ID-00000000
                </div>
              </div>
            </div>
          </div>
          <ul className="space-y-3">
            {[
              "Assurez-vous que les 4 coins sont visibles",
              "Évitez les reflets de lumière sur la carte",
              "Le texte doit être parfaitement lisible",
            ].map((text, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm font-bold text-neutral-500"
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
            Capturez le côté face de votre pièce d'identité officielle.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-dark tracking-tighter leading-none">
            Recto du document
          </h2>
          <p className="text-neutral-500 font-medium">
            Glissez ou prenez une photo claire du recto.
          </p>
        </div>

        {preview ? (
          <div className="relative rounded-xl overflow-hidden border-2 border-primary bg-neutral-50 shadow-2xl animate-in zoom-in-95 duration-500 group">
            <img
              src={preview}
              alt="Recto"
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
                : errors.rectoUrl
                  ? "border-red-400 bg-red-50"
                  : "border-neutral-200 hover:border-primary/50 hover:bg-neutral-50 bg-neutral-50/20"
            }`}
          >
            <input {...getInputProps()} />

            <div className="w-18 h-18 rounded-full bg-white shadow-2xl border border-neutral-100 flex items-center justify-center mb-6">
              <LuUpload size={22} className="text-primary" />
            </div>

            <div className="space-y-1">
              <p className="text-xl font-black text-dark tracking-tight">
                {isDragActive ? "Lâchez pour uploader" : "Uploader le Recto"}
              </p>
              <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest text-[10px]">
                JPG, PNG — Max 5 Mo
              </p>
            </div>
          </div>
        )}

        <FieldError message={errors.rectoUrl?.message as string} />
      </div>
    </div>
  );
}
