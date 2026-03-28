"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/routing";
import {
  LuChevronRight,
  LuChevronLeft,
  LuLoader,
  LuShieldCheck,
  LuFileText,
  LuUser,
  LuX,
} from "react-icons/lu";

import { KycIdentitySchema, type KycIdentityFormData } from "@/schemas/driver";
import { useSubmitKycIdentity, useUploadDocument } from "@/hooks/useDriver";
import { StepIdentityRecto } from "./StepIdentityRecto";
import { StepIdentityVerso } from "./StepIdentityVerso";
import { StepIdentitySelfie } from "./StepIdentitySelfie";
import { IoAlertCircle, IoCheckmarkCircle } from "react-icons/io5";

const STEPS = [
  { id: 1, label: "Recto", icon: LuFileText, description: "Avant de la carte" },
  {
    id: 2,
    label: "Verso",
    icon: LuFileText,
    description: "Arrière de la carte",
  },
  { id: 3, label: "Selfie", icon: LuUser, description: "Photo de contrôle" },
];

export function VerifyIdForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Progress for global upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const submitMutation = useSubmitKycIdentity();
  const uploadMutation = useUploadDocument();

  const methods = useForm<KycIdentityFormData>({
    resolver: zodResolver(KycIdentitySchema),
    mode: "onTouched",
    defaultValues: {
      rectoUrl: "",
      versoUrl: "",
      selfieUrl: "",
    },
  });

  const { trigger, handleSubmit } = methods;

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof KycIdentityFormData> = [];
    if (currentStep === 1) fieldsToValidate = ["rectoUrl"];
    if (currentStep === 2) fieldsToValidate = ["versoUrl"];
    if (currentStep === 3) fieldsToValidate = ["selfieUrl"];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: KycIdentityFormData) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const urls: Record<string, string> = {
        rectoUrl: "",
        versoUrl: "",
        selfieUrl: "",
      };

      const keys = ["rectoUrl", "versoUrl", "selfieUrl"] as const;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const val = data[key];

        if (val instanceof File) {
          // Upload to Cloudinary
          const result = await uploadMutation.mutateAsync(val);
          urls[key] = result.url;
        } else if (typeof val === "string") {
          urls[key] = val;
        }

        setUploadProgress(((i + 1) / keys.length) * 100);
      }

      // Final submission to our API
      await submitMutation.mutateAsync({
        rectoUrl: urls.rectoUrl,
        versoUrl: urls.versoUrl,
        selfieUrl: urls.selfieUrl,
      });

      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Une erreur est survenue lors de la soumission. Veuillez réessayer.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full bg-white rounded-xl p-12 md:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-neutral-100 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-200">
          <IoCheckmarkCircle size={64} />
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-bold text-dark tracking-tight">
            Documents envoyés !
          </h2>
          <p className="text-neutral-500 font-medium max-w-sm mx-auto text-lg leading-relaxed">
            Votre identité est en cours de vérification. Vous recevrez une
            notification sous 24h.
          </p>
        </div>
        <button
          onClick={() => router.push("/profile")}
          className="btn-dark px-12 py-5"
        >
          Retour au profil
        </button>
      </div>
    );
  }

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      {/* ── Sidebar Navigation ─────────────────────────────────────────────── */}
      <aside className="w-full lg:w-1/4 bg-white rounded-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-neutral-100 hidden md:block sticky top-32">
        <div className="space-y-1">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                  isActive
                    ? "bg-primary/5 scale-[1.02] border border-primary/10"
                    : "opacity-50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 ${
                    isActive
                      ? "bg-primary text-white"
                      : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {isCompleted ? (
                    <IoCheckmarkCircle size={20} />
                  ) : (
                    <Icon size={18} />
                  )}
                </div>
                <div>
                  <h3
                    className={`font-bold text-xs uppercase tracking-widest ${isActive ? "text-primary" : "text-dark"}`}
                  >
                    {step.label}
                  </h3>
                  <p className="text-sm text-neutral-500 tracking-tighter opacity-70">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vertical Progress Mini-bar */}
        <div className="mt-10 pt-8 border-t border-neutral-50">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Avancement
            </p>
            <p className="text-xs font-bold text-primary">
              {Math.round(progress)}%
            </p>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </aside>

      <FormProvider {...methods}>
        <div className="w-full lg:w-3/4 bg-white rounded-xl p-8 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-neutral-100 flex flex-col min-h-[500px] relative overflow-hidden">
          {/* Global Upload Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
              <div className="w-full max-w-md space-y-8">
                <div className="relative w-32 h-32 mx-auto">
                  <LuLoader
                    size={128}
                    className="text-primary/20 animate-spin"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-dark tracking-tight">
                    Sécurisation de vos documents
                  </h3>
                  <p className="text-neutral-500 font-medium italic">
                    Traitement chiffré et transfert vers nos serveurs
                    sécurisés...
                  </p>
                </div>
                <div className="w-full bg-neutral-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step Content */}
          <div
            className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500"
            key={currentStep}
          >
            {currentStep === 1 && <StepIdentityRecto />}
            {currentStep === 2 && <StepIdentityVerso />}
            {currentStep === 3 && <StepIdentitySelfie />}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-12 p-5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-4 text-red-600 animate-in shake-in duration-500">
              <IoAlertCircle size={28} className="shrink-0" />
              <p className="font-bold text-sm tracking-tight">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600 transition-colors"
              >
                <LuX size={20} />
              </button>
            </div>
          )}

          {/* Navigation Buttons footer */}
          <div className="mt-16 pt-10 border-t border-neutral-50 flex flex-row gap-2 items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1 || isUploading}
              className="btn-outlined"
            >
              <LuChevronLeft size={20} />
              <span className="hidden sm:inline">Précédent</span>
            </button>

            {currentStep === STEPS.length ? (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isUploading}
                className="btn-primary px-12 py-5 text-lg font-bold"
              >
                {isUploading ? (
                  <>
                    <LuLoader size={24} className="animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    Terminer la vérification
                    <LuShieldCheck size={24} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="btn-dark group"
              >
                Suivant
                <LuChevronRight
                  size={22}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            )}
          </div>
        </div>
      </FormProvider>

      {/* Trust Footer - moved outside main loop or kept at bottom */}
      <div className="lg:hidden flex flex-col items-center justify-center gap-8 opacity-40 mt-12 w-full">
        <div className="flex items-center gap-3">
          <LuShieldCheck size={18} className="text-green-600" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark">
            Données Chiffrées AES-256
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LuShieldCheck size={18} className="text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark">
            Conforme aux normes RGPD
          </span>
        </div>
      </div>
    </div>
  );
}
