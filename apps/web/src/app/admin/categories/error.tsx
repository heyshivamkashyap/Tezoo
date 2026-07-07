"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">{error.message}</h2>

      <p className="text-muted-foreground">
        Something went wrong while fetching categories.
      </p>
    </div>
  );
}
