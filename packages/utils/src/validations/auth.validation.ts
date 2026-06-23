import z from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .refine(
      (value) => {
        const email = z.email().safeParse(value).success;
        const isPhone = /^[0-9]{10}$/.test(value);

        return email || isPhone;
      },
      { message: "Please enter a valid email or phone number" },
    ),
  password: z.string().min(8),
});
