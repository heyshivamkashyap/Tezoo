import { Category } from "@/types/category";

export interface ParentCategory {
  _id: string;
  name: string;
}

export interface SubCategoriesData {
  parentCategory: ParentCategory;
  subCategories: Category[];
}
