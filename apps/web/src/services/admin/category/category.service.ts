import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { CreateCategoryType } from "@repo/utils";
import { SubCategoriesData } from "./category.types";

export const createCategory = (data: CreateCategoryType | FormData) =>
  api.post<ApiResponse>("/category/create", data);

export const deleteCategory = (id: string) =>
  api.delete<ApiResponse>(`/category/delete/${id}`);

export const getSubcategories = (id: string) =>
  api.get<ApiResponse<SubCategoriesData>>(`/category/get-sub-categories/${id}`);
