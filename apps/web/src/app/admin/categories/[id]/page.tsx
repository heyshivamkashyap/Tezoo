import { getSubcategories } from "@/services/admin/category/category.service";
import { ArrowRightIcon, FolderOpen } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { CategoryCard } from "../_components/category-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { CategorySkeleton } from "../_components/category-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <RenderData id={id} />
    </Suspense>
  );
}

async function RenderData({ id }: { id: string }) {
  const response = await getSubcategories(id);
  const { subCategories, parentCategory } = response.data.data;

  if (!subCategories.length) {
    return (
      <EmptyState
        title="No Subcategories Found"
        description="This category doesn't have any subcategories yet. Create your first subcategory to better organize your products."
        icon={FolderOpen}
        href="/admin/categories/create"
        buttonText="Create Category"
        buttonIcon={<ArrowRightIcon />}
      />
    );
  }

  return (
    <main className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {parentCategory.name}
          </h1>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/admin/categories/create">
            Create New Category
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {subCategories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            isSubCategory={true}
          />
        ))}
      </div>
    </main>
  );
}
