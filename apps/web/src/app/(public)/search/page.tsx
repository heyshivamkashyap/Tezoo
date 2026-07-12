type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;

  return (
    <div className="mx-auto min-h-screen max-w-6xl">
      <h1>Search</h1>
      <p>Query: {q}</p>
    </div>
  );
}
