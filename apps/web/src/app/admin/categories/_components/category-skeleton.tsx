import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CategorySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="relative gap-0 overflow-hidden p-0">
          {/* Delete button */}
          <Skeleton className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full" />

          {/* Image */}
          <div className="bg-muted/30 flex items-center justify-center p-2">
            <Skeleton className="h-48 w-full rounded-md" />
          </div>

          {/* Content */}
          <CardContent className="space-y-4 p-2">
            <div className="space-y-2 px-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>

            <Skeleton className="h-11 w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
