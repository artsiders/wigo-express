"use client";

import { useFormContext } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { KycIdentityFormData } from "@/schemas/driver";
import { LuUpload, LuCheck, LuX, LuInfo } from "react-icons/lu";
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
          <div className="w-full h-full rounded-lg mb-4 bg-neutral-50 border border-neutral-100 relative p-4 flex flex-col justify-between shadow-inner">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-200 animate-pulse" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-2 w-2/3 bg-neutral-200 rounded-full" />
                <div className="h-2 w-1/2 bg-neutral-200 rounded-full" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-8 w-full border-2 border-primary/20 bg-primary/5 rounded-md flex items-center px-2">
                <div className="h-1.5 w-1/2 bg-primary/20 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 bg-neutral-100 rounded-md" />
                <div className="h-12 bg-neutral-100 rounded-md" />
              </div>
            </div>
            {/* Overlay focus marks */}
            <div className="absolute inset-0 border-2 border-primary rounded-lg opacity-20 scale-[1.02]" />
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-primary/40" />
              <div className="w-2 h-2 rounded-full bg-primary/20" />
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
