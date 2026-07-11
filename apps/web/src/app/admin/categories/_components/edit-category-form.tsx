"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCategorySchema, UpdateCategoryType } from "@repo/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Category } from "@/types/category";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { LoadingButton } from "@/components/ui/loading-btn";
import { ImageDropzone } from "@/components/image-dropzone";
import { updateCategory } from "@/services/admin/category/category.service";

export function EditCategoryForm({ category }: { category: Category }) {
  const [image, setImage] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<UpdateCategoryType>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name,
      isActive: category.isActive,
    },
  });

  const isActive = watch("isActive");

  const onSubmit = (data: UpdateCategoryType) => {
    startTransition(async () => {
      const formData = new FormData();

      if (dirtyFields.name && data.name) {
        formData.append("name", data.name);
      }

      if (dirtyFields.isActive && data.isActive !== undefined) {
        formData.append("isActive", String(data.isActive));
      }

      if (image) {
        formData.append("image", image);
      }

      try {
        await updateCategory(category._id, formData);

        toast.success("Category updated successfully");
        router.push(
          category.parentId
            ? `/admin/categories/${category.parentId}`
            : "/admin/categories",
        );
      } catch (err) {
        toast.error((err as Error).message);
      }
    });
  };

  return (
    <div className="bg-background rounded-xl p-2 md:border md:p-6">
      <h2 className="mb-6 text-2xl font-semibold">Update Category</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldGroup className="space-y-6">
            <Field>
              <FieldLabel>Category Name</FieldLabel>

              <Input placeholder="Enter category name" {...register("name")} />

              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Category Image</FieldLabel>

              <ImageDropzone
                onChange={setImage}
                defaultImage={category.image.url}
              />
            </Field>

            <Field className="flex w-full flex-row items-center justify-between rounded-lg border p-4">
              <FieldLabel className="w-fit">Active Category</FieldLabel>

              <Switch
                checked={isActive}
                onCheckedChange={(checked) =>
                  setValue("isActive", checked, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              />
            </Field>

            <LoadingButton
              loading={isPending}
              size="lg"
              type="submit"
              disabled={!isDirty && !image}
            >
              Update Category
            </LoadingButton>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
