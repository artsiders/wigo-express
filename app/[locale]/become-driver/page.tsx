import { Suspense } from "react";
import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import Alert from "@/components/ui/Alert";
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
    <div className="min-h-screen bg-light-300 flex flex-col pt-24 md:pt-32 pb-20">
      <Navbar />

      <main className="container mx-auto px-4 md:px-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-dark tracking-tight mb-4">
            Devenir <span className="text-primary">Conducteur</span>
          </h1>
          <p className="text-lg text-neutral-500 font-medium max-w-2xl">
            Rejoignez la communauté des conducteurs Wigo Express et commencez à
            partager vos frais de route dès aujourd&apos;hui.
          </p>
        </div>

        {/* Redirect alert */}
        {showRedirectAlert && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <Alert
              type="warning"
              title="Action requise avant de publier"
              description="Pour proposer un trajet, vous devez d'abord compléter votre profil de conducteur. C'est rapide et sécurisé !"
              onClose={() => {}}
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
      </main>
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
