import { Suspense } from "react";
import { Category } from "./_components/category/category";
import { CategorySkeleton } from "./_components/category/category-skeleton";

export default function Home() {
  return (
    <main className="mx-auto h-screen max-w-7xl px-4">
      {/* category  */}
      <Suspense fallback={<CategorySkeleton />}>
        <Category />
      </Suspense>
    </main>
  );
}
