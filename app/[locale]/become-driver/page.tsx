"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LuUser,
  LuCar,
  LuFileText,
  LuChevronRight,
  LuChevronLeft,
  LuShieldCheck,
  LuUpload,
} from "react-icons/lu";
import Alert from "@/components/ui/Alert";
import Navbar from "@/components/Navbar";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function BecomeDriverPage() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const showRedirectAlert = searchParams?.get("mode") === "become-driver";

  const steps = [
    {
      id: 1,
      label: "Informations",
      icon: LuUser,
      description: "Vos coordonnées de base",
    },
    {
      id: 2,
      label: "Permis",
      icon: LuFileText,
      description: "Détails du document",
    },
    {
      id: 3,
      label: "Véhicule",
      icon: LuCar,
      description: "Votre moyen de transport",
    },
    {
      id: 4,
      label: "Vérification",
      icon: LuShieldCheck,
      description: "Validation finale",
    },
  ];

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-light-300 flex flex-col pt-24 md:pt-32 pb-20">
      <Navbar />

      <main className="container mx-auto px-4 md:px-8 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-dark tracking-tight mb-4">
            Devenir <span className="text-primary">Conducteur</span>
          </h1>
          <p className="text-lg text-neutral-500 font-medium max-w-2xl">
            Rejoignez la communauté des conducteurs Wigo Express et commencez à
            partager vos frais de route dès aujourd'hui.
          </p>
        </div>

        {/* Dynamic Alert for Redirection */}
        {showRedirectAlert && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <Alert
              type="warning"
              title="Action requise avant de publier"
              description="Pour proposer un trajet, vous devez d'abord compléter votre profil de conducteur. C'est rapide et sécurisé !"
              onClose={() => {}} // Optional: handle close if needed
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Step Navigation */}
          <aside className="w-full lg:w-1/3 bg-white rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-neutral-100 hidden md:block sticky top-32">
            <div className="space-y-2">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                      isActive ? "bg-primary/10 scale-[1.02]" : "opacity-60"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-colors ${
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
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 p-6 bg-neutral-50 rounded-xl border border-neutral-100">
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">
                Progression
              </p>
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </aside>

          {/* Right Column: Form View */}
          <section className="w-full lg:w-2/3 bg-white rounded-2xl p-10 md:p-14 shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-neutral-100 min-h-[500px] flex flex-col relative overflow-hidden">
            {/* Form Step Content (Mock Rendering) */}
            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-dark">
                      Informations Personnelles
                    </h2>
                    <p className="text-neutral-500 font-medium">
                      Vérifions d'abord la base pour votre sécurité.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Alex"
                        className="input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Conducteur"
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
                      Email de contact
                    </label>
                    <input
                      type="email"
                      placeholder="driver@wigo.com"
                      className="input"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-dark">
                      Votre Permis de Conduire
                    </h2>
                    <p className="text-neutral-500 font-medium">
                      Nous avons besoin d'une preuve de votre aptitude à
                      conduire.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
                        Numéro du permis
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: ABC-123456"
                        className="input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
                          Expiration
                        </label>
                        <input type="date" className="input" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
                          Pays d'émission
                        </label>
                        <select className="input appearance-none">
                          <option>États-Unis</option>
                          <option>Canada</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-10 border-2 border-dashed border-neutral-400 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-primary transition-all cursor-pointer bg-neutral-50/50">
                      <LuUpload
                        size={32}
                        className="text-neutral-400 group-hover:text-primary transition-all mb-4"
                      />
                      <p className="text-[15px] font-bold text-neutral-600">
                        Cliquez pour uploader une photo du permis
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 font-medium">
                        Formats acceptés : JPG, PNG (Max 5Mo)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-dark">
                      Votre Véhicule
                    </h2>
                    <p className="text-neutral-500 font-medium">
                      Pour que vos passagers puissent vous reconnaître.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-left">
                      <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
                        Marque
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Tesla"
                        className="input"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
                        Modèle
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Model 3"
                        className="input"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
                        Plaque d'immatriculation
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: AA-123-BB"
                        className="input"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[13px] font-bold text-neutral-600 uppercase tracking-widest pl-1">
                        Places disponibles
                      </label>
                      <select className="input appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTA5MDkwIj48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-no-repeat bg-position-[right_1.5rem_center] bg-size-[1.2rem]">
                        <option>1 place</option>
                        <option>2 places</option>
                        <option selected>3 places</option>
                        <option>4 places</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8 flex flex-col items-center justify-center py-10">
                  <div className="w-24 h-24 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-6 shadow-sm border border-green-100">
                    <LuShieldCheck size={48} />
                  </div>
                  <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-black text-dark">
                      Dernière Étape
                    </h2>
                    <p className="text-neutral-500 font-medium max-w-sm mx-auto">
                      En soumettant votre profil, vous acceptez nos conditions
                      générales de transporteur.
                    </p>
                  </div>
                  <div className="w-full p-6 bg-neutral-50 rounded-3xl border border-neutral-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-neutral-700 underline decoration-blue-500 decoration-2 cursor-pointer">
                        Consulter les règles de sécurité
                      </p>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-neutral-300 text-primary focus:ring-primary"
                      />
                      <p className="text-sm text-neutral-500 font-medium italic">
                        Je certifie que toutes les informations fournies sont
                        exactes et que mon véhicule est assuré.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center justify-between gap-4 pt-10 border-t border-neutral-100">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-dark hover:bg-neutral-100 transition-all disabled:opacity-20 active:scale-95"
              >
                <LuChevronLeft size={20} />
                Précédent
              </button>

              {currentStep < steps.length ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-3 px-10 py-5 bg-dark text-white rounded-2xl font-black shadow-2xl shadow-dark/20 hover:bg-primary transition-all active:scale-95 group"
                >
                  Continuer
                  <LuChevronRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              ) : (
                <button className="flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all active:scale-95">
                  Soumettre mon profil
                  <IoCheckmarkCircle size={20} />
                </button>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Decorative Floating Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-blue-400/10 rounded-full blur-[150px]"></div>
      </div>
    </div>
  );
}
