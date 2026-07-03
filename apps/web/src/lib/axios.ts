import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";

// Create one Axios instance for the entire app
export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Always send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Prevent multiple refresh requests at the same time
let isRefreshing = false;

// This interceptor runs AFTER EVERY API RESPONSE
api.interceptors.response.use(
  //  If request succeeds return response
  (response) => response,

  // If request fails
  async (error: AxiosError) => {
    // Get the original request that failed
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Only refresh if:
    // 1. Status is 401 (Unauthorized)
    // 2. We have the original request
    // 3. We haven't retried this request already
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // Mark this request as already retried
      originalRequest._retry = true;

      // Prevent multiple refresh requests
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // refreshToken tokens
          await api.get("/auth/refresh-token");

          isRefreshing = false;

          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;

          // Refresh failed -> user must login again
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        }
      }
    }

    // Convert backend error into a simple Error object
    const message =
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      "Something went wrong";

    return Promise.reject(new Error(message));
  },
);
