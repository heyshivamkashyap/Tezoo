import z from "zod";
import { locationSchema } from "./address.validation";

// Store status enum
export const storeStatusSchema = z.enum(["pending", "active", "suspended"]);

export const createStoreSchema = z.object({
  name: z.string().trim().min(2, "Store name must be at least 2 characters"),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number is too short")
    .max(15, "Phone number is too long"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),

  geoLocation: locationSchema,

  isOpen: z.boolean().default(true).optional(),
});

// Update store schema
export const updateStoreSchema = createStoreSchema.partial();

// Types
export type CreateStoreType = z.infer<typeof createStoreSchema>;
export type UpdateStoreType = z.infer<typeof updateStoreSchema>;
