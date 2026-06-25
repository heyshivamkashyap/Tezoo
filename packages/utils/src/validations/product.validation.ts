import z from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  brand: z
    .string()
    .trim()
    .max(100, "Brand name cannot exceed 100 characters")
    .optional(),

  categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),

  tags: z
    .array(z.string().trim().min(1))
    .max(20, "Maximum 20 tags allowed")
    .optional(),

  isActive: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductType = z.infer<typeof createProductSchema>;
export type UpdateProductType = z.infer<typeof updateProductSchema>;
