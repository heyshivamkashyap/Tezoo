"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { DeleteCategoryDrawer } from "./delete-category-drawer";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MainCategory } from "@/services/category/category.types";

interface CategoryCardProps {
  category: MainCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [isOepn, setIsOepn] = useState(false);

  return (
    <>
      <Card className="group relative gap-0 overflow-hidden p-0">
        {/* Delete button */}
        <Button
          size="icon-lg"
          variant="destructive"
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full shadow-md"
          title="Delete category"
          onClick={() => setIsOepn(!isOepn)}
        >
          <Trash2 />
        </Button>

        {/* Image */}
        <div className="bg-muted/30 relative max-w-full p-1">
          <Image
            src={category.image.url}
            alt={category.name}
            width={200}
            height={200}
            className="aspect-10/8 h-full w-full object-contain"
            loading="eager"
          />
          <Badge
            className={cn(
              "absolute bottom-3 left-3 z-10 rounded-sm border",
              category.isActive && "bg-green-600 dark:bg-green-700",
            )}
            variant={category.isActive ? "default" : "destructive"}
          >
            {category.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <CardContent className="space-y-4 p-3">
          <div className="space-y-0.5">
            <Link
              href={`/admin/categories/${category._id}`}
              className="line-clamp-1 text-base font-medium hover:underline"
            >
              {category.name}
            </Link>

            <p className="text-muted-foreground line-clamp-1 text-sm">
              Category Slug: {category.slug}
            </p>
          </div>

          <Button asChild className="w-full">
            <Link
              href={`/admin/categories/${category._id}/edit`}
              className="flex items-center justify-center gap-2"
            >
              Edit Category
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      <DeleteCategoryDrawer
        id={category._id}
        name={category.name}
        image={category.image.url}
        open={isOepn}
        onOpenChange={setIsOepn}
      />
    </>
  );
}
