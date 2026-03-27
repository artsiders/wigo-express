import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { VerifyIdForm } from "./components/VerifyIdForm";
import { LuLoader } from "react-icons/lu";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function VerifyIdPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/verify-id");
  }

  return (
    <main className="min-h-screen bg-neutral-50/50 selection:bg-primary/20">
      <Navbar />

      <div className="pt-42 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-top-6 duration-700">
            <h1 className="text-3xl md:text-5xl font-black text-dark tracking-tighter leading-[0.9] max-w-2xl mx-auto">
              Sécurisez votre <span className="text-primary">profil</span> Wigo.
            </h1>

            <p className="text-xl text-neutral-500 font-medium max-w-xl mx-auto leading-relaxed">
              La vérification d'identité renforce la confiance au sein de la
              communauté et protège vos trajets.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="w-full h-[600px] bg-white rounded-2xl flex flex-col items-center justify-center gap-6 shadow-2xl shadow-neutral-100 border border-neutral-100">
                <LuLoader size={48} className="text-primary animate-spin" />
                <p className="font-black text-neutral-400 uppercase tracking-widest text-sm italic">
                  Préparation du module...
                </p>
              </div>
            }
          >
            <VerifyIdForm />
          </Suspense>

          {/* FAQ / Info footer */}
          <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-10 opacity-60">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-dark text-white rounded-lg flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-black text-dark tracking-tight uppercase text-sm">
                Confidentialité
              </h3>
              <p className="text-xs font-bold text-neutral-500 leading-relaxed">
                Vos documents sont chiffrés et ne sont jamais partagés avec des
                tiers sans votre consentement explicite.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 bg-dark text-white rounded-lg flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-black text-dark tracking-tight uppercase text-sm">
                Délai d'examen
              </h3>
              <p className="text-xs font-bold text-neutral-500 leading-relaxed">
                Notre équipe de modération valide manuellement chaque document
                sous un délai de 24 heures maximum.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 bg-dark text-white rounded-lg flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-black text-dark tracking-tight uppercase text-sm">
                Conformité
              </h3>
              <p className="text-xs font-bold text-neutral-500 leading-relaxed">
                Ce processus répond aux exigences de sécurité pour le
                covoiturage professionnel et l'assurance.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
