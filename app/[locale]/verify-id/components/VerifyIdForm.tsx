"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  LuChevronRight,
  LuChevronLeft,
  LuLoader,
  LuShieldCheck,
  LuFileText,
  LuUser,
} from "react-icons/lu";

import { KycIdentitySchema, type KycIdentityFormData } from "@/schemas/driver";
import { useSubmitKycIdentity } from "@/hooks/useDriver";
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

  const submitMutation = useSubmitKycIdentity();

  const methods = useForm<KycIdentityFormData>({
    resolver: zodResolver(KycIdentitySchema),
    mode: "onTouched",
    defaultValues: {
      rectoUrl: "",
      versoUrl: "",
      selfieUrl: "",
    },
  });

  const { trigger, watch } = methods;
  const formData = watch();

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof KycIdentityFormData> = [];
    if (currentStep === 1) fieldsToValidate = ["rectoUrl"];
    if (currentStep === 2) fieldsToValidate = ["versoUrl"];

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
    try {
      await submitMutation.mutateAsync(data);
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Une erreur est survenue lors de la soumission.",
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full bg-white rounded-xl p-12 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-neutral-100 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-200">
          <IoCheckmarkCircle size={48} className="text-white" />
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-dark tracking-tight">
            Documents envoyés !
          </h2>
          <p className="text-neutral-500 font-medium max-w-sm mx-auto text-lg leading-relaxed">
            Votre identité est en cours de vérification. Cela prend généralement
            moins de 24h.
          </p>
        </div>
        <button
          onClick={() => router.push("/profile")}
          className="px-12 py-5 bg-dark text-white rounded-xl font-black shadow-2xl hover:scale-105 transition-all active:scale-95"
        >
          Retour au profil
        </button>
      </div>
    );
  }

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto w-full space-y-10">
      {/* Header with Navigation Steps */}
      <div className="flex justify-between items-center px-4">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-3 relative z-10"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg ${
                  isActive
                    ? "bg-primary text-white scale-110 shadow-primary/30"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-white text-neutral-300 border border-neutral-100"
                }`}
              >
                {isCompleted ? (
                  <IoCheckmarkCircle size={24} />
                ) : (
                  <step.icon size={24} />
                )}
              </div>
              <span
                className={`text-[11px] font-black uppercase tracking-widest ${isActive ? "text-primary" : "text-neutral-400"}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
        {/* Progress Line */}
        <div className="absolute top-[48px] left-[15%] right-[15%] h-0.5 bg-neutral-100 z-0">
          <div
            className="h-full bg-primary transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(255,107,0,0.5)]"
            style={{
              width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      <FormProvider {...methods}>
        <div className="w-full bg-white rounded-xl p-8 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-neutral-100 flex flex-col min-h-[500px]">
          {/* Step Content */}
          <div className="flex-1">
            {currentStep === 1 && <StepIdentityRecto />}
            {currentStep === 2 && <StepIdentityVerso />}
            {currentStep === 3 && <StepIdentitySelfie />}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 animate-in fade-in slide-in-from-bottom-2">
              <IoAlertCircle size={24} className="shrink-0" />
              <p className="font-bold text-sm tracking-tight">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1 || submitMutation.isPending}
              className="flex items-center gap-3 px-8 py-5 rounded-xl font-black text-dark hover:bg-neutral-50 transition-all disabled:opacity-0"
            >
              <LuChevronLeft size={20} />
              Précédent
            </button>

            {currentStep === STEPS.length ? (
              <button
                type="button"
                onClick={methods.handleSubmit(onSubmit)}
                disabled={submitMutation.isPending}
                className="flex items-center gap-4 px-12 py-5 bg-primary text-white rounded-2xl font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-70"
              >
                {submitMutation.isPending ? (
                  <>
                    <LuLoader size={20} className="animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Terminer la vérification
                    <LuShieldCheck size={22} />
                  </>
                )}
              </button>
            ) : (
              <button type="button" onClick={handleNext} className="btn-dark">
                Suivant
                <LuChevronRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            )}
          </div>
        </div>
      </FormProvider>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-3 opacity-30">
        <LuShieldCheck size={16} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          Vos données sont chiffrées et sécurisées
        </span>
      </div>
    </div>
  );
}
