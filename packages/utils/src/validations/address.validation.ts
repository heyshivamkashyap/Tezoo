import z from "zod";
// location schema
const locationSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.array(z.number()).length(2, "Coordinates must be [lng, lat]"),
});

// create address schema
export const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .max(50, "Label cannot exceed 50 characters")
    .optional(),

  type: z.enum(["home", "work", "other"]),

  fullName: z.string().min(1).max(80),

  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  landmark: z.string().max(100).optional(),

  deliveryInstructions: z.string().optional(),

  geoLocation: locationSchema,
});

export type AddressSchemaType = z.infer<typeof addressSchema>;
