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

  name: z.string().min(1).max(80),

  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

  addressLine1: z.string().min(1).max(200),
  addressLine2: z.string().max(200).optional(),
  landmark: z.string().max(100).optional(),

  city: z.string().min(1),
  state: z.string().min(1),

  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),

  deliveryInstructions: z.string().optional(),

  location: locationSchema,
});

export type AddressSchemaType = z.infer<typeof addressSchema>;
