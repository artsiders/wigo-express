import RideDetails from "@/components/ride/RideDetails";

export default async function RideDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  
  return (
    <main className="min-h-screen">
      <RideDetails id={id} />
    </main>
  );
}
