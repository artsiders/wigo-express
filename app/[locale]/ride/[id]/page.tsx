import { notFound } from "next/navigation";
import RideDetails from "@/components/ride/RideDetails";
import { mockRidesDetails } from "@/lib/mock-ride";

export default async function RideDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  
  const ride = mockRidesDetails[id] || mockRidesDetails["r1"]; // fallback for demo purposes
  
  if (!ride) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <RideDetails ride={ride} />
    </main>
  );
}
