"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Category } from "@/types/category";

interface CategorySidebarProps {
  categorySlug: string;
  categoryId: string;
  subcategories: Category[];
}

export function CategorySidebar({
  categorySlug,
  categoryId,
  subcategories,
}: CategorySidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="bg-background w-20 shrink-0 overflow-y-auto border-r sm:w-28 md:w-52">
      {subcategories.map((subcategory) => {
        const href = `/c/${categorySlug}/${categoryId}/sc/${subcategory.slug}/${subcategory._id}`;

        const isActive = pathname === href;

        return (
          <Link
            key={subcategory._id}
            href={href}
            className={cn(
              "hover:bg-muted flex flex-col items-center border-r-2 border-transparent px-3 pb-2 transition-all md:flex-row md:gap-3 md:border-r-0 md:border-l-2 md:pb-0",
              isActive &&
                "border-primary bg-primary/10 dark:bg-secondary font-medium",
            )}
          >
            <Image
              src={subcategory.image.url}
              alt={subcategory.name}
              width={75}
              height={75}
              loading="eager"
              className="w-14 rounded-md object-contain md:w-20"
            />

            <span className="line-clamp-2 text-center text-sm md:text-left md:text-base">
              {subcategory.name}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
