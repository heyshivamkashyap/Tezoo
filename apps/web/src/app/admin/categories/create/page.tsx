import { getMainCategory } from "@/services/category/category.service";
import { CreateCategoryForm } from "../_components/create-category-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Category",
};

export default async function Page() {
  const res = await getMainCategory();
  const categories = res.data.data;

  return <CreateCategoryForm categories={categories} />;
}
