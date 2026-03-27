"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { KycIdentityFormData } from "@/schemas/driver";
import { useUploadDocument } from "@/hooks/useDriver";
import CameraCapture from "@/components/kyc/CameraCapture";
import {
  LuUser,
  LuCamera,
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

export function StepIdentitySelfie() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<KycIdentityFormData>();

  const uploadMutation = useUploadDocument();
  const [showCamera, setShowCamera] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const currentUrl = watch("selfieUrl");

  const handleCapture = async (blob: Blob) => {
    setShowCamera(false);
    
    // Local preview via Blob URL
    const previewUrl = URL.createObjectURL(blob);
    setPreview(previewUrl);

    try {
      const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
      const result = await uploadMutation.mutateAsync(file);
      setValue("selfieUrl", result.url, { shouldValidate: true });
    } catch {
      setPreview(null);
    }
  };

  const clear = () => {
    setPreview(null);
    setValue("selfieUrl", "", { shouldValidate: true });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LuUser size={32} className="text-primary" />
        </div>
        <h2 className="text-3xl font-black text-dark tracking-tight">Selfie de vérification</h2>
        <p className="text-neutral-500 font-medium max-w-sm mx-auto">
          Prenez un selfie en tenant votre pièce d'identité à côté de votre visage.
        </p>
      </div>

      <div className="space-y-4">
        {currentUrl && preview ? (
          <div className="relative rounded-3xl overflow-hidden border-4 border-green-400/30 bg-neutral-50 shadow-2xl">
            <img src={preview} alt="Selfie" className="w-full aspect-square object-cover scale-x-[-1]" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <div className="flex items-center gap-3 text-white">
                <div className="bg-green-500 rounded-full p-1">
                  <LuCircleCheck size={18} className="text-white" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Selfie validé</span>
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
            onClick={() => !uploadMutation.isPending && setShowCamera(true)}
            className={`group relative aspect-square border-4 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 overflow-hidden ${
              errors.selfieUrl
                ? "border-red-400 bg-red-50/50"
                : "border-neutral-200 hover:border-primary/50 hover:bg-neutral-50 bg-neutral-50/40"
            }`}
          >
            {uploadMutation.isPending ? (
              <div className="flex flex-col items-center gap-4">
                <LuLoader size={48} className="text-primary animate-spin" />
                <p className="text-lg font-black text-neutral-600 uppercase tracking-tighter">Transfert...</p>
              </div>
            ) : (
              <>
                <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-primary/40">
                  <LuCamera size={40} />
                </div>
                <p className="text-xl font-black text-neutral-800 tracking-tight">
                  Ouvrir la caméra
                </p>
                <p className="text-sm text-neutral-400 mt-2 font-bold px-12">
                  Assurez-vous d'être dans un endroit bien éclairé.
                </p>
              </>
            )}
          </div>
        )}
        <div className="text-center">
          <FieldError message={errors.selfieUrl?.message} />
        </div>
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
