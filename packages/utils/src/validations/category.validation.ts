import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters"),

  parentId: z.string().optional().nullable(),

  isActive: z.boolean().optional(),
});

// Update store schema
export const updateCategorySchema = createCategorySchema.partial();

// Types
export type CreateCategoryType = z.infer<typeof createCategorySchema>;
export type UpdateCategoryType = z.infer<typeof updateCategorySchema>;
