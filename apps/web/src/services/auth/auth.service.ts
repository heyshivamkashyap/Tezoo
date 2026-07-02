import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { LoginSchemaType, RegisterSchemaType } from "@repo/utils";
import { AuthData } from "./auth.type";

export const loginUser = (data: LoginSchemaType) =>
  api.post<ApiResponse<AuthData>>("/auth/login", data);
export const registerUser = (data: RegisterSchemaType) =>
  api.post<ApiResponse<AuthData>>("/auth/register", data);

export const logoutUser = () => api.get<ApiResponse>("/auth/logout");
