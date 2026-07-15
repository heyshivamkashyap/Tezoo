interface PageProps {
  params: Promise<{
    categorySlug: string;
    categoryId: string;
    subCategorySlug: string;
    subCategoryId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { subCategoryId, subCategorySlug } = await params;
  return (
    <div className="p-2 md:p-4">
      {subCategorySlug} __ {subCategoryId}
    </div>
  );
}
