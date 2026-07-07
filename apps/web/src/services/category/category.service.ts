import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { MainCategory } from "./category.types";

export const getMainCategory = () =>
  api.get<ApiResponse<MainCategory[]>>("/category/get-categories");
