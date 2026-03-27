"use client";

import { useFormContext } from "react-hook-form";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { KycIdentityFormData } from "@/schemas/driver";
import { useUploadDocument } from "@/hooks/useDriver";
import {
  LuCreditCard,
  LuUpload,
  LuCircleCheck,
  LuLoader,
  LuX,
} from "react-icons/lu";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
      <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
      {message}
    </p>
  );
}

export function StepIdentityRecto() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<KycIdentityFormData>();

  const uploadMutation = useUploadDocument();
  const [preview, setPreview] = useState<string | null>(null);
  const currentUrl = watch("rectoUrl");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      try {
        const result = await uploadMutation.mutateAsync(file);
        setValue("rectoUrl", result.url, { shouldValidate: true });
      } catch {
        setPreview(null);
      }
    },
    [uploadMutation, setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const clear = () => {
    setPreview(null);
    setValue("rectoUrl", "", { shouldValidate: true });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LuCreditCard size={32} className="text-primary" />
        </div>
        <h2 className="text-3xl font-black text-dark tracking-tight">
          Recto de la pièce d'identité
        </h2>
        <p className="text-neutral-500 font-medium max-w-sm mx-auto">
          Prenez en photo le devant de votre carte d'identité ou de votre
          passeport.
        </p>
      </div>

      <div className="space-y-4">
        {currentUrl && preview ? (
          <div className="relative rounded-3xl overflow-hidden border-4 border-green-400/30 bg-neutral-50 shadow-2xl">
            <img
              src={preview}
              alt="Recto"
              className="w-full aspect-[1.6/1] object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <div className="flex items-center gap-3 text-white">
                <div className="bg-green-500 rounded-full p-1">
                  <LuCircleCheck size={18} className="text-white" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">
                  Document prêt
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={clear}
              className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-red-50 rounded-2xl shadow-xl transition-all"
            >
              <LuX size={18} className="text-neutral-600" />
            </button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`group relative aspect-[1.6/1] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 overflow-hidden ${
              isDragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : errors.rectoUrl
                  ? "border-red-400 bg-red-50/50"
                  : "border-neutral-200 hover:border-primary/50 hover:bg-neutral-50 bg-neutral-50/40"
            }`}
          >
            <input {...getInputProps()} />

            {uploadMutation.isPending ? (
              <div className="flex flex-col items-center gap-4">
                <LuLoader size={48} className="text-primary animate-spin" />
                <p className="text-lg font-black text-neutral-600 uppercase tracking-tighter">
                  Transfert...
                </p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 bg-white shadow-xl border border-neutral-100">
                  <LuUpload size={32} className="text-primary" />
                </div>
                <p className="text-lg font-black text-neutral-800 tracking-tight">
                  {isDragActive ? "Lâchez ici !" : "Uploader le Recto"}
                </p>
                <p className="text-sm text-neutral-400 mt-2 font-bold px-8">
                  JPG, PNG ou WebP — Max. 5 Mo
                </p>
              </>
            )}
          </div>
        )}
        <div className="text-center">
          <FieldError message={errors.rectoUrl?.message} />
        </div>
      </div>
    </div>
  );
}
