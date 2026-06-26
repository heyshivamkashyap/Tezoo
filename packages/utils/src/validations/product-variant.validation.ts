import z from "zod";

export const createProductVariantSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(100, "SKU cannot exceed 100 characters")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "SKU can only contain letters, numbers, and hyphens (-)",
    ),

  unit: z.string().trim().min(1, "Unit is required"),
  mrp: z.number().min(0, "MRP cannot be negative"),
  weight: z.number().positive("Weight must be greater than 0"),

  barcode: z.string().trim().optional(),

  isActive: z.boolean().optional(),
});

export const updateProductVariantSchema = createProductVariantSchema.partial();

export type CreateProductVariantType = z.infer<
  typeof createProductVariantSchema
>;

export type UpdateProductVariantType = z.infer<
  typeof updateProductVariantSchema
>;
