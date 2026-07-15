import { getSubcategories } from "@/services/admin/category/category.service";
import { CategorySidebar } from "@/app/(public)/_components/category/category-sidebar";

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    categorySlug: string;
    categoryId: string;
  }>;
}

export default async function CategoryLayout({
  children,
  params,
}: CategoryLayoutProps) {
  const { categorySlug, categoryId } = await params;
  const { data } = await getSubcategories(categoryId);
  const subcategories = data.data.subCategories.filter((cat) => cat.isActive);

  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl flex-1 overflow-hidden">
        <CategorySidebar
          categorySlug={categorySlug}
          categoryId={categoryId}
          subcategories={subcategories}
        />

        {/* Products */}
        <main className="bg-background flex-1">{children}</main>
      </div>
    </>
  );
}
