import { User } from "@/features/user/user.types";
import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";

export const getUserProfile = () => api.get<ApiResponse<User>>(`/user/profile`);
