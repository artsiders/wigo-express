"use client";

import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  LuUser,
  LuFileText,
  LuCar,
  LuShieldCheck,
  LuChevronRight,
  LuChevronLeft,
  LuLoader,
  LuCircleCheck,
  LuCircleAlert,
  LuPartyPopper,
} from "react-icons/lu";
import { IoCheckmarkCircle } from "react-icons/io5";

import {
  DriverApplicationSchema,
  Step1Schema,
  Step2Schema,
  Step3Schema,
  Step4Schema,
  type DriverApplicationFormData,
} from "@/schemas/driver";
import { useSubmitDriverApplication, useDriverStatus } from "@/hooks/useDriver";
import { Step1Personal } from "./Step1Personal";
import { Step2License } from "./Step2License";
import { Step3Vehicle } from "./Step3Vehicle";
import { Step4Confirm } from "./Step4Confirm";
import Alert from "@/components/ui/Alert";
import { Link } from "@/i18n/routing";

const STEPS = [
  {
    id: 1,
    label: "Informations",
    icon: LuUser,
    description: "Vos coordonnées",
    schema: Step1Schema,
  },
  {
    id: 2,
    label: "Permis",
    icon: LuFileText,
    description: "Votre document",
    schema: Step2Schema,
  },
  {
    id: 3,
    label: "Véhicule",
    icon: LuCar,
    description: "Votre transport",
    schema: Step3Schema,
  },
  {
    id: 4,
    label: "Validation",
    icon: LuShieldCheck,
    description: "Confirmation",
    schema: Step4Schema,
  },
];

interface Props {
  sessionName?: string | null;
  sessionEmail?: string | null;
}

export function BecomeDriverForm({ sessionName, sessionEmail }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { data: driverStatus } = useDriverStatus();
  const submitMutation = useSubmitDriverApplication();

  const methods = useForm<DriverApplicationFormData>({
    resolver: zodResolver(DriverApplicationSchema) as any,
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      licenseNumber: "",
      licenseExpiry: "",
      licenseCountry: "",
      licenseDocumentUrl: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: new Date().getFullYear(),
      vehiclePlate: "",
      vehicleColor: "",
      vehicleSeats: 3,
      acceptTerms: false,
    },
  });

  const {
    trigger,
    formState: { isSubmitting },
  } = methods;

  // Validate only the current step's fields before going next
  const handleNext = async () => {
    const stepSchema = STEPS[currentStep - 1].schema;
    const fields = Object.keys(
      stepSchema.shape,
    ) as (keyof DriverApplicationFormData)[];
    const valid = await trigger(fields);
    if (valid) setCurrentStep((p) => Math.min(p + 1, STEPS.length));
  };

  const handlePrev = () => {
    setApiError(null);
    setCurrentStep((p) => Math.max(p - 1, 1));
  };

  const onSubmit: SubmitHandler<DriverApplicationFormData> = async (data) => {
    setApiError(null);
    try {
      await submitMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        licenseExpiry: data.licenseExpiry,
        licenseCountry: data.licenseCountry,
        licenseDocumentUrl: data.licenseDocumentUrl,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        vehicleYear: Number(data.vehicleYear),
        vehiclePlate: data.vehiclePlate,
        vehicleColor: data.vehicleColor,
        vehicleSeats: Number(data.vehicleSeats),
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Réessayez.";
      setApiError(msg);
    }
  };

  // ── Logic: Block if application already pending ─────────────────────────────
  const isLicensePending = driverStatus?.kycVerifications?.some(
    (k) => k.type === "LICENSE" && k.status === "PENDING",
  );

  const hasLicense = !!driverStatus?.license;

  const isIdentityPendingOrVerified =
    driverStatus?.idVerified ||
    driverStatus?.kycVerifications?.some(
      (k) =>
        ["IDENTITY_RECTO", "IDENTITY_VERSO", "SELFIE"].includes(k.type) &&
        k.status === "PENDING",
    );

  // 1. Already a driver
  if (driverStatus?.isDriver) {
    return (
      <div className="w-full bg-white rounded-[40px] p-16 shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-neutral-100 flex flex-col items-center justify-center text-center gap-8 min-h-[450px] animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 rounded-3xl bg-green-500 text-white flex items-center justify-center shadow-2xl shadow-green-100">
          <IoCheckmarkCircle size={48} />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-dark tracking-tight">
            Profil Conducteur Actif
          </h2>
          <p className="text-neutral-500 font-medium max-w-sm mx-auto text-lg leading-relaxed">
            Félicitations ! Votre profil est validé. Vous pouvez maintenant
            publier vos trajets.
          </p>
        </div>
        <button
          onClick={() => router.push("/offer-ride")}
          className="flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-xl font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-all active:scale-95"
        >
          Proposer un trajet
          <LuChevronRight size={20} />
        </button>
      </div>
    );
  }

  // 2. Application pending
  if (isLicensePending || hasLicense) {
    return (
      <>
        <Alert
          type="info"
          title="Examen en cours"
          description={
            <>
              <div>
                Votre demande pour devenir conducteur a bien été reçue. Nos
                modérateurs vérifient vos documents (permis et véhicule).
              </div>
              <div className="mt-4 ">
                <Link href="/profile" className="btn-primary w-fit">
                  Retour au profil
                </Link>
              </div>
            </>
          }
        />
      </>
    );
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="w-full bg-white rounded-xl p-14 shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-neutral-100 flex flex-col items-center justify-center text-center gap-6 min-h-[500px]">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-in zoom-in-50 duration-500">
          <LuPartyPopper size={48} className="text-primary" />
        </div>
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-black text-dark">
            Candidature envoyée !
          </h2>
          <p className="text-neutral-500 font-medium max-w-sm mx-auto">
            Notre équipe va vérifier votre dossier sous 24–48h. Vous recevrez
            une confirmation par email.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in duration-700 delay-200">
          <button
            onClick={() => router.push("/")}
            className="px-8 py-4 rounded-xl border border-neutral-200 font-bold text-dark hover:bg-neutral-50 transition-all"
          >
            Retour à l'accueil
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all"
          >
            Voir mon profil
            <LuChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const progress = (currentStep / STEPS.length) * 100;
  const isLastStep = currentStep === STEPS.length;
  const isLoading = isSubmitting || submitMutation.isPending;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      {/* ── Sidebar Navigation ─────────────────────────────────────────────── */}
      <aside className="w-full lg:w-1/3 bg-white rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-neutral-100 hidden md:block sticky top-32">
        <div className="space-y-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary/10 scale-[1.02]"
                    : isCompleted
                      ? "opacity-80"
                      : "opacity-40"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
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
                    <Icon size={20} />
                  )}
                </div>
                <div>
                  <h3
                    className={`font-semibold text-sm uppercase tracking-wider ${isActive ? "text-primary" : "text-dark"}`}
                  >
                    {step.label}
                  </h3>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-tighter opacity-70">
                    {step.description}
                  </p>
                </div>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-10 p-6 bg-neutral-50 rounded-xl border border-neutral-100">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-neutral-500 uppercase tracking-widest">
              Progression
            </p>
            <p className="text-xs font-black text-primary">
              {Math.round(progress)}%
            </p>
          </div>
          <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </aside>

      {/* ── Form Panel ─────────────────────────────────────────────────────── */}
      <FormProvider {...methods}>
        <section className="w-full lg:w-2/3 bg-white rounded-xl p-10 md:p-14 shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-neutral-100 flex flex-col relative overflow-hidden">
          {/* Mobile progress */}
          <div className="md:hidden mb-8">
            <div className="flex justify-between text-xs font-bold text-neutral-500 mb-2">
              <span>
                Étape {currentStep} sur {STEPS.length}
              </span>
              <span className="text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step content */}
          <div
            className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300"
            key={currentStep}
          >
            {!isIdentityPendingOrVerified && currentStep === 1 && (
              <Alert
                type="warning"
                title="Vérification d'identité recommandée"
                description={
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 text-center md:text-left space-y-1">
                      <p className="text-sm text-neutral-500 font-medium">
                        Pour devenir conducteur, votre identité doit être
                        validée. Vous pouvez commencer votre demande ici, mais
                        n'oubliez pas de compléter votre KYC.
                      </p>
                    </div>
                    <Link
                      type="button"
                      href={"/verify-id"}
                      className="btn-secondary"
                    >
                      Vérifier maintenant
                    </Link>
                  </div>
                }
                className="mb-8 animate-in slide-in-from-top-4 duration-500"
              />
            )}

            {currentStep === 1 && (
              <Step1Personal
                sessionName={sessionName}
                sessionEmail={sessionEmail}
              />
            )}
            {currentStep === 2 && <Step2License />}
            {currentStep === 3 && <Step3Vehicle />}
            {currentStep === 4 && <Step4Confirm />}
          </div>

          {/* API error */}
          {apiError && (
            <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in duration-300">
              <LuCircleAlert
                size={18}
                className="text-red-500 shrink-0 mt-0.5"
              />
              <p className="text-sm font-semibold text-red-700">{apiError}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between gap-4 pt-8 border-t border-neutral-100">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1 || isLoading}
              className="flex items-center gap-3 px-8 py-5 rounded-xl font-black text-dark hover:bg-neutral-100 transition-all disabled:opacity-20 active:scale-95"
            >
              <LuChevronLeft size={20} />
              Précédent
            </button>

            {isLastStep ? (
              <button
                type="button"
                onClick={methods.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="relative flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-xl font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <LuLoader size={20} className="animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Soumettre mon profil
                    <IoCheckmarkCircle size={20} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-3 px-10 py-5 bg-dark text-white rounded-xl font-black shadow-2xl shadow-dark/20 hover:bg-primary hover:shadow-primary/30 transition-all active:scale-95 group"
              >
                Continuer
                <LuChevronRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            )}
          </div>
        </section>
      </FormProvider>

      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-blue-400/10 rounded-full blur-[150px]" />
      </div>
    </div>
  );
}
