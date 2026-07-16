import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { NearbyStore } from "./store.types";
import { CreateStoreSchemaType } from "@repo/utils";

export const getNearbyStore = (latitude: number, longitude: number) =>
  api.get<ApiResponse<NearbyStore>>(
    `/store/nearby?latitude=${latitude}&longitude=${longitude}`,
  );

export const createStore = (data: CreateStoreSchemaType) =>
  api.post<ApiResponse>("/store/create", data);
