import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Category } from "@/types/category";

export const getMainCategory = () =>
  api.get<ApiResponse<Category[]>>("/category/get-categories");
