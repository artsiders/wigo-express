import RideDetails from "@/components/ride/RideDetails";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";

export default async function RideDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  
  return (
    <main className="min-h-screen container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Rechercher", href: "/search" },
          { label: "Détails du trajet" },
        ]}
      />
      <div className="mt-6 mb-10">
        <SectionHeader
          title="Consulter le trajet"
          description="Retrouvez toutes les informations sur ce trajet et réservez votre place en quelques clics."
        />
      </div>
      <RideDetails id={id} />
    </main>
  );
}
