import SearchPageContent from "@/components/search/SearchPageContent";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return <SearchPageContent params={params} />;
}
