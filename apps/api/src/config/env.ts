import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.string().transform((val) => Number(val)),

  CORS_ORIGIN: z.string().min(1),

  MONGODB_URI: z.string().min(1),

  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables");
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
