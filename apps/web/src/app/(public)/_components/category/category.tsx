import { getHomeCategory } from "@/services/category/category.service";
import Image from "next/image";
import Link from "next/link";

export async function Category() {
  try {
    const { data } = await getHomeCategory();
    const categories = data.data;

    return (
      <div className="grid grid-cols-4 gap-4 py-10 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/c/${cat.slug}/${cat._id}/sc/${cat.defaultSubCategory?.slug}/${cat.defaultSubCategory?._id}`}
            className="flex h-full flex-col"
          >
            <div className="flex h-full cursor-pointer flex-col rounded-lg hover:shadow">
              <div className="dark:from-foreground/5 dark:to-foreground/5 from-primary/10 to-background flex aspect-square w-full items-center justify-center overflow-hidden rounded-md rounded-b-full bg-linear-to-b dark:rounded-b-md">
                <Image
                  src={cat.image.url}
                  alt={cat.name}
                  width={100}
                  height={100}
                  loading="eager"
                  className="h-full max-h-full w-full max-w-[90%] rounded-lg object-contain"
                />
              </div>
              <div className="flex min-h-10 items-center justify-center px-1 py-1">
                <h3
                  className="line-clamp-2 text-center text-xs leading-tight font-medium sm:text-sm"
                  title={cat.name}
                >
                  {cat.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error(error);

    return (
      <div className="text-destructive text-sm">Failed to load categories.</div>
    );
  }
}
