import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Category } from "@/types/category";
import { HomeCategory } from "./category.types";

export const getMainCategory = () =>
  api.get<ApiResponse<Category[]>>("/category/get-categories");

export const getHomeCategory = () =>
  api.get<ApiResponse<HomeCategory[]>>("/category/get-home-categories");
