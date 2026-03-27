"use client";

import { useFormContext } from "react-hook-form";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import type { DriverApplicationFormData } from "@/schemas/driver";
import { useUploadDocument } from "@/hooks/useDriver";
import {
  LuFileText,
  LuCalendar,
  LuGlobe,
  LuUpload,
  LuCircleCheck,
  LuLoader,
  LuX,
  LuImageOff,
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

const COUNTRIES = ["Canada", "États-Unis"];

export function Step2License() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DriverApplicationFormData>();

  const uploadMutation = useUploadDocument();
  const [preview, setPreview] = useState<string | null>(null);
  const currentDocUrl = watch("licenseDocumentUrl");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Local preview
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      // Upload to Cloudinary via our API
      try {
        const result = await uploadMutation.mutateAsync(file);
        setValue("licenseDocumentUrl", result.url, { shouldValidate: true });
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

  const clearDocument = () => {
    setPreview(null);
    setValue("licenseDocumentUrl", "", { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-dark">
          Votre Permis de Conduire
        </h2>
        <p className="text-neutral-500 font-medium">
          Nous avons besoin d'une preuve de votre aptitude à conduire.
        </p>
      </div>

      <div className="space-y-6">
        {/* License Number */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
            Numéro du permis
          </label>
          <div className="relative">
            <LuFileText
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              {...register("licenseNumber")}
              type="text"
              placeholder="Ex: ABC-123456"
              className={`input pl-11 ${errors.licenseNumber ? "border-red-400 focus:ring-red-400/30" : ""}`}
            />
          </div>
          <FieldError message={errors.licenseNumber?.message} />
        </div>

        {/* Expiry + Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
              Date d'expiration
            </label>
            <div className="relative">
              <LuCalendar
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                {...register("licenseExpiry")}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className={`input pl-11 ${errors.licenseExpiry ? "border-red-400 focus:ring-red-400/30" : ""}`}
              />
            </div>
            <FieldError message={errors.licenseExpiry?.message} />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
              Pays d'émission
            </label>
            <div className="relative">
              <LuGlobe
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <select
                {...register("licenseCountry")}
                className={`input pl-11 appearance-none ${errors.licenseCountry ? "border-red-400 focus:ring-red-400/30" : ""}`}
              >
                <option value="">Sélectionnez un pays</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <FieldError message={errors.licenseCountry?.message} />
          </div>
        </div>

        {/* Document Upload */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
            Photo du permis
          </label>

          {/* Success state - show preview */}
          {currentDocUrl && preview ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-green-400 bg-neutral-50">
              <img
                src={preview}
                alt="Permis uploadé"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-4">
                <div className="flex items-center gap-2 text-white">
                  <LuCircleCheck
                    size={18}
                    className="text-green-400 shrink-0"
                  />
                  <span className="text-sm font-bold">
                    Document uploadé avec succès
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={clearDocument}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-red-50 transition-colors"
              >
                <LuX size={14} className="text-neutral-600" />
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`relative p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : errors.licenseDocumentUrl
                    ? "border-red-400 bg-red-50/30"
                    : "border-neutral-300 hover:border-primary hover:bg-neutral-50 bg-neutral-50/30"
              }`}
            >
              <input {...getInputProps()} />

              {uploadMutation.isPending ? (
                <>
                  <LuLoader
                    size={36}
                    className="text-primary mb-4 animate-spin"
                  />
                  <p className="text-[15px] font-bold text-neutral-600">
                    Upload en cours...
                  </p>
                  <div className="mt-3 w-32 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse w-2/3" />
                  </div>
                </>
              ) : uploadMutation.isError ? (
                <>
                  <LuImageOff size={36} className="text-red-400 mb-4" />
                  <p className="text-[15px] font-bold text-red-500">
                    Échec de l'upload
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {uploadMutation.error?.message ?? "Cliquez pour réessayer"}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <LuUpload size={28} className="text-primary" />
                  </div>
                  <p className="text-[15px] font-bold text-neutral-700">
                    {isDragActive
                      ? "Déposez votre fichier ici"
                      : "Glissez ou cliquez pour uploader"}
                  </p>
                  <p className="text-xs text-neutral-400 mt-2 font-medium">
                    JPG, PNG, WebP - Max 5 Mo
                  </p>
                </>
              )}
            </div>
          )}

          <FieldError message={errors.licenseDocumentUrl?.message} />
        </div>
      </div>
    </div>
  );
}
