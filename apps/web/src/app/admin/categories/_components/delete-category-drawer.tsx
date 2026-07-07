"use client";

import Image from "next/image";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-btn";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCategory } from "@/services/admin/category/category.service";
import { useRouter } from "next/navigation";

interface DeleteCategoryDrawerProps {
  id: string;
  image: string;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryDrawer({
  id,
  image,
  name,
  open,
  onOpenChange,
}: DeleteCategoryDrawerProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDeleteCategory(id: string) {
    startTransition(async () => {
      try {
        const res = await deleteCategory(id);

        if (!res.data.success) {
          toast.error(res.data.message);
          return;
        }

        router.refresh();
        onOpenChange(false);
      } catch (err) {
        toast.error((err as Error).message);
      }
    });
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-md border">
        <DrawerHeader className="items-center text-center">
          <div className="bg-muted mb-4 overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={name}
              width={160}
              height={160}
              className="h-40 w-40 object-contain p-3"
            />
          </div>

          <DrawerTitle>Delete Category?</DrawerTitle>

          <DrawerDescription className="max-w-sm">
            Are you sure you want to delete{" "}
            <span className="text-foreground font-medium">{name}</span>?
            <br />
            This action cannot be undone.
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button disabled={isPending} variant="outline">
              Cancel
            </Button>
          </DrawerClose>
          <LoadingButton
            size="lg"
            loading={isPending}
            variant="destructive"
            onClick={() => handleDeleteCategory(id)}
          >
            Delete Category
          </LoadingButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
