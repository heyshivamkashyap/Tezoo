import { env } from "@/config/env";
import { ApiResponse } from "@/types/api-response";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Handle API errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    const res = error.response?.data as ApiResponse | undefined;

    if (
      res?.message === "ACCESS_TOKEN_EXPIRED" &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await api.get("/auth/refresh-token");

        return api(originalRequest);
      } catch {
        toast.error("Your session has expired. Please log in again.");
        return Promise.reject(new Error("Session expired"));
      }
    }

    const message = res?.message ?? "Something went wrong";

    return Promise.reject(new Error(message));
  },
);
