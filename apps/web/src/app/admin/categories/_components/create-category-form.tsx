"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema, CreateCategoryType } from "@repo/utils";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError,
} from "@/components/ui/field";
import { LoadingButton } from "@/components/ui/loading-btn";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createCategory } from "@/services/admin/category/category.service";
import { MainCategory } from "@/services/category/category.types";
import { useState, useTransition } from "react";
import { ImageDropzone } from "@/components/image-dropzone";

export function CreateCategoryForm({
  categories,
}: {
  categories: MainCategory[];
}) {
  const [image, setImage] = useState<File | null>(null);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryType>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      parentId: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  const onSubmit = (data: CreateCategoryType) => {
    startTransition(async () => {
      const formData = new FormData();

      formData.append("name", data.name);

      if (data.parentId && data.parentId !== "none") {
        formData.append("parentId", data.parentId);
      }

      formData.append("isActive", String(data.isActive));

      if (image) {
        formData.append("image", image);
      }

      try {
        const res = await createCategory(formData);

        if (!res.data.success) {
          toast.error(res.data.message);
          return;
        }

        toast.success(res.data.message);
        router.push("/admin/categories");
      } catch (err) {
        toast.error((err as Error).message);
      }
    });
  };

  return (
    <div className="bg-background rounded-xl p-2 md:border md:p-6">
      <h2 className="mb-6 text-2xl font-semibold">Create Category</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldGroup className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel>Category Name</FieldLabel>

                <Input
                  placeholder="Enter category name"
                  {...register("name")}
                />

                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Parent Category</FieldLabel>

                <Select onValueChange={(value) => setValue("parentId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>

                  <SelectContent className="p-1">
                    <SelectItem value="none" className="px-2">
                      None
                    </SelectItem>

                    {categories.map((category) => (
                      <SelectItem
                        key={category._id}
                        value={category._id}
                        className="px-2"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Category Image</FieldLabel>
              <ImageDropzone onChange={setImage} />
            </Field>

            <Field className="flex w-full flex-row items-center justify-between rounded-lg border p-4">
              <FieldLabel className="w-fit">Active Category</FieldLabel>

              <Switch
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
            </Field>

            <LoadingButton size="lg" loading={isPending} type="submit">
              Create Category
            </LoadingButton>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
