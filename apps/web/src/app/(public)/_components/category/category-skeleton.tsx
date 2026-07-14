import { Skeleton } from "@/components/ui/skeleton";

export function CategorySkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4 py-5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8">
      {Array.from({ length: 16 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="aspect-square w-full rounded-sm rounded-t-lg" />
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-3/4 rounded" />
        </div>
      ))}
    </div>
  );
}
