import "dotenv/config"
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().positive().default(5001),
    FRONTEND_URL: z.url().default("http://localhost:5173"),
    DATABASE_URL: z.url(),
    CSRF_SECRET: z.string().min(64),
    RESEND_API_KEY: z.string().trim().startsWith("re").min(4),
    RESEND_FROM_EMAIL: z.string().trim().min(1),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environment configuration:");
    console.error(z.treeifyError(parsedEnv.error));

    process.exit(1);
}

export const env = parsedEnv.data;