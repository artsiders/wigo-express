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
  LuPartyPopper,
  LuCircleAlert,
  LuX,
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
import {
  useSubmitDriverApplication,
  useDriverStatus,
  useUploadDocument,
} from "@/hooks/useDriver";
import { Step1Personal } from "./Step1Personal";
import { Step2License } from "./Step2License";
import { Step3Vehicle } from "./Step3Vehicle";
import { Step4Confirm } from "./Step4Confirm";
import Alert from "@/components/ui/Alert";
import { Link } from "@/i18n/routing";

const STEPS = [
  {
    id: 1,
    label: "Profil",
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

  // Split name for defaults
  const nameParts = sessionName?.split(" ") ?? [];
  const initialFirstName = nameParts[0] ?? "";
  const initialLastName = nameParts.slice(1).join(" ") ?? "";

  // Upload progress logic
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { data: driverStatus, isLoading: isLoadingStatus } = useDriverStatus();
  const submitMutation = useSubmitDriverApplication();
  const uploadMutation = useUploadDocument();

  const methods = useForm<DriverApplicationFormData>({
    resolver: zodResolver(DriverApplicationSchema) as any,
    mode: "onTouched",
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      phone: "",
      licenseNumber: "",
      licenseExpiry: "",
      licenseCountry: "Canada",
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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
    setIsUploading(true);
    setUploadProgress(0);

    try {
      let finalLicenseUrl = data.licenseDocumentUrl;

      // Delayed Upload for License
      if ((data.licenseDocumentUrl as any) instanceof File) {
        setUploadProgress(50);
        const result = await uploadMutation.mutateAsync(
          data.licenseDocumentUrl as any,
        );
        finalLicenseUrl = result.url;
        setUploadProgress(100);
      }

      await submitMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        licenseExpiry: data.licenseExpiry,
        licenseCountry: data.licenseCountry,
        licenseDocumentUrl: finalLicenseUrl as string,
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
        err instanceof Error ? err.message : "Une erreur est survenue.";
      setApiError(msg);
    } finally {
      setIsUploading(false);
    }
  };

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

  // Detailed Skeleton (Avoid jumps/flashes)
  if (isLoadingStatus) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full container mx-auto px-2 md:px-0 opacity-60">
        {/* Sidebar Skeleton */}
        <aside className="w-full lg:w-1/4 bg-white rounded-xl p-8 border border-neutral-100 hidden md:block">
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-16 bg-neutral-100 animate-pulse rounded" />
                  <div className="h-2 w-24 bg-neutral-100 animate-pulse rounded opacity-50" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-8 border-t border-neutral-50 space-y-3">
            <div className="h-2 w-20 bg-neutral-100 animate-pulse rounded" />
            <div className="w-full bg-neutral-50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-neutral-200 h-full w-1/4 animate-pulse" />
            </div>
          </div>
        </aside>

        {/* Main Panel Skeleton */}
        <section className="w-full lg:w-3/4 bg-white rounded-xl p-8 md:p-14 border border-neutral-100 min-h-[600px] space-y-12">
          <div className="space-y-4">
            <div className="h-12 w-2/3 bg-neutral-100 animate-pulse rounded-2xl" />
            <div className="h-3 w-1/2 bg-neutral-100 animate-pulse rounded-full opacity-60" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="h-2.5 w-20 bg-neutral-100 animate-pulse rounded-full" />
              <div className="h-14 w-full bg-neutral-50 animate-pulse rounded-xl border border-neutral-100" />
            </div>
            <div className="space-y-3">
              <div className="h-2.5 w-20 bg-neutral-100 animate-pulse rounded-full" />
              <div className="h-14 w-full bg-neutral-50 animate-pulse rounded-xl border border-neutral-100" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-2.5 w-32 bg-neutral-100 animate-pulse rounded-full" />
            <div className="h-14 w-full bg-neutral-50 animate-pulse rounded-xl border border-neutral-100" />
          </div>

          <div className="mt-16 pt-10 border-t border-neutral-50 flex justify-between items-center">
            <div className="h-14 w-32 bg-neutral-50 animate-pulse rounded-xl" />
            <div className="h-14 w-44 bg-neutral-200 animate-pulse rounded-xl" />
          </div>
        </section>
      </div>
    );
  }

  // States: Driver, Pending, Success
  if (driverStatus?.isDriver) {
    return (
      <div className="w-full bg-white rounded-xl p-16 shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-neutral-100 flex flex-col items-center justify-center text-center gap-8 min-h-[450px] animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 rounded-full bg-green-500 text-white flex items-center justify-center shadow-2xl shadow-green-200">
          <IoCheckmarkCircle size={64} />
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-dark tracking-tighter">
            Profil Conducteur Actif
          </h2>
          <p className="text-neutral-500 font-medium max-w-sm mx-auto text-lg">
            Félicitations ! Votre profil est validé. Vous pouvez maintenant
            publier vos trajets.
          </p>
        </div>
        <button
          onClick={() => router.push("/offer-ride")}
          className="btn-primary px-12 py-5 text-lg"
        >
          Proposer un trajet
          <LuChevronRight size={20} />
        </button>
      </div>
    );
  }

  if (isLicensePending || hasLicense) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <Alert
          type="info"
          title="Demande en cours d'examen"
          description={
            <div className="space-y-6">
              <p className="text-neutral-600 font-medium leading-relaxed">
                Votre candidature pour devenir conducteur a bien été reçue. Nos
                modérateurs vérifient vos documents sous un délai de 24 à 48
                heures.
              </p>
              <div className="flex gap-4">
                <Link href="/profile" className="btn-dark px-8">
                  Retour au profil
                </Link>
                <Link href="/" className="btn-white px-8">
                  Accueil
                </Link>
              </div>
            </div>
          }
        />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full bg-white rounded-xl p-16 shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-neutral-100 flex flex-col items-center justify-center text-center gap-8 min-h-[500px] animate-in zoom-in-95 duration-700">
        <div className="w-28 h-28 rounded-full bg-primary/10 text-primary flex items-center justify-center duration-2000">
          <LuPartyPopper size={64} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-dark tracking-tighter">
            Candidature envoyée !
          </h2>
          <p className="text-neutral-500 font-medium max-w-sm mx-auto text-lg leading-relaxed">
            Merci ! Notre équipe va vérifier votre dossier. Vous recevrez une
            confirmation par email très prochainement.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push("/")}
            className="btn-white px-10 py-4"
          >
            Retour Accueil
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="btn-primary px-10 py-4"
          >
            Voir mon profil
          </button>
        </div>
      </div>
    );
  }

  const progress = (currentStep / STEPS.length) * 100;
  const isLoading = isUploading || isSubmitting || submitMutation.isPending;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full container mx-auto px-2 md:px-0">
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
                    className={`font-black text-xs uppercase tracking-widest ${isActive ? "text-primary" : "text-dark"}`}
                  >
                    {step.label}
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter opacity-70">
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
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
              Avancement
            </p>
            <p className="text-xs font-black text-primary">
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

      {/* ── Form Panel ─────────────────────────────────────────────────────── */}
      <FormProvider {...methods}>
        <section className="w-full lg:w-3/4 bg-white rounded-xl p-8 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-neutral-100 relative overflow-hidden min-h-[600px]">
          {/* Global Upload Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
              <div className="w-full max-w-sm space-y-8">
                <div className="relative w-24 h-24 mx-auto">
                  <LuLoader
                    size={96}
                    className="text-primary/10 animate-spin"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-black text-primary">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-dark tracking-tight">
                    Traitement sécurisé
                  </h3>
                  <p className="text-neutral-500 font-medium italic text-sm">
                    Transfert de vos documents vers nos serveurs...
                  </p>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step content */}
          <div
            className="animate-in fade-in slide-in-from-right-4 duration-500"
            key={currentStep}
          >
            {!isIdentityPendingOrVerified && currentStep === 1 && (
              <Alert
                type="warning"
                title="Vérification d'identité recommandée"
                className="mb-10 shadow-lg shadow-yellow-500/5 border-yellow-200"
                description={
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <p className="text-sm text-neutral-600 font-medium flex-1">
                      Votre identité doit être validée pour être visible. Vous
                      pouvez commencer ici, mais pensez à compléter votre KYC.
                    </p>
                    <Link
                      href="/verify-id"
                      className="btn-secondary px-6 whitespace-nowrap"
                    >
                      Vérifier maintenant
                    </Link>
                  </div>
                }
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

          {/* API error alert */}
          {apiError && (
            <div className="mt-10 p-5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-4 text-red-600 animate-in shake-in duration-500">
              <LuCircleAlert size={28} className="shrink-0" />
              <p className="font-bold text-sm tracking-tight">{apiError}</p>
              <button
                onClick={() => setApiError(null)}
                className="ml-auto text-red-400 hover:text-red-600 transition-colors"
              >
                <LuX size={20} />
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-16 pt-10 border-t border-neutral-50 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1 || isLoading}
              className="flex items-center gap-3 px-8 py-5 rounded-xl font-black text-dark hover:bg-neutral-50 transition-all disabled:opacity-0 active:scale-95"
            >
              <LuChevronLeft size={20} />
              Précédent
            </button>

            {currentStep === STEPS.length ? (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="btn-primary px-12 py-5 text-lg font-black"
              >
                {isLoading ? (
                  <>
                    <LuLoader size={24} className="animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    Soumettre mon profil
                    <LuShieldCheck size={24} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="btn-dark px-12 py-5 group"
              >
                Étape suivante
                <LuChevronRight
                  size={22}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            )}
          </div>
        </section>
      </FormProvider>
    </div>
  );
}
