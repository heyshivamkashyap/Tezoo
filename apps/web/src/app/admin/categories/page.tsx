import { Metadata } from "next";
import { CategoryCard } from "./_components/category-card";
import { ArrowRightIcon, FolderOpen } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getMainCategory } from "@/services/category/category.service";
import { Suspense } from "react";
import { CategorySkeleton } from "./_components/category-skeleton";

export const metadata: Metadata = {
  title: "Categories",
};

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <RenderData />
    </Suspense>
  );
}

async function RenderData() {
  const response = await getMainCategory();
  const categories = response.data.data;

  if (!categories.length) {
    return (
      <EmptyState
        title="No Categories Found"
        description="You haven't created any categories yet. Create your first category to start organizing your products."
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
            All Main Categories
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Click a category name to view and manage its subcategories.
          </p>
        </div>

        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/admin/categories/create">
            Create New Category
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </main>
  );
}
