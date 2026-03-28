import { auth } from "@/auth";
import { redirect } from "@/i18n/routing";
import { Suspense } from "react";
import { VerifyIdForm } from "./components/VerifyIdForm";
import { LuLoader } from "react-icons/lu";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";

export const dynamic = "force-dynamic";

export default async function VerifyIdPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect({ href: `/login?callbackUrl=/verify-id`, locale });
  }

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Mon Profil", href: "/profile" },
          { label: "Vérification d'identité" },
        ]}
      />

      <SectionHeader
        title={<>Sécurisez votre profil Wigo</>}
        description="La vérification d'identité renforce la confiance au sein de la communauté et protège vos trajets."
      />

      <div className="space-y-12">
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
        <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-10 opacity-60">
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
              Ce processus répond aux exigences de sécurité pour le covoiturage
              professionnel et l'assurance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
