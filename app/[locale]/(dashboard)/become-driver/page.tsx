import { Suspense } from "react";
import { auth } from "@/auth";
import Alert from "@/components/ui/Alert";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import { BecomeDriverForm } from "./components/BecomeDriverForm";

// Force dynamic rendering - requires session
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ mode?: string }>;
}

export default async function BecomeDriverPage({ searchParams }: Props) {
  const session = await auth();
  const params = await searchParams;
  const showRedirectAlert = params?.mode === "become-driver";

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Devenir Conducteur·rice" },
        ]}
      />

      <SectionHeader
        title={<>Devenir Conducteur·rice</>}
        description="Rejoignez la communauté des conducteurs Wigo Express et commencez à partager vos frais de route dès aujourd'hui."
      />

      {/* Redirect alert */}
      {showRedirectAlert && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <Alert
            type="warning"
            title="Action requise avant de publier"
            description="Pour proposer un trajet, vous devez d'abord compléter votre profil de Conducteur·rice. C'est rapide et sécurisé !"
          />
        </div>
      )}

      {/* Form - wrapped in Suspense for useSearchParams used inside */}
      <Suspense fallback={<FormSkeleton />}>
        <BecomeDriverForm
          sessionName={session?.user?.name}
          sessionEmail={session?.user?.email}
        />
      </Suspense>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full animate-pulse">
      <div className="hidden md:block w-full lg:w-1/3 h-96 bg-white rounded-2xl border border-neutral-100" />
      <div className="w-full lg:w-2/3 h-[600px] bg-white rounded-2xl border border-neutral-100" />
    </div>
  );
}
