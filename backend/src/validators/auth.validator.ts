import { z } from "zod";

const emailSchema = z
    .email("Enter a valid email address.")
    .trim()
    .toLowerCase()
    .max(254);

export const registerSchema = z.object({
    email: emailSchema,

    password: z
        .string()
        .min(12, "Password must contain at least 12 characters.")
        .max(128, "Password must contain at most 128 characters."),

    firstName: z
        .string()
        .trim()
        .min(1, "First name is required.")
        .max(100),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required.")
        .max(100),
});

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required."),
});

export type RegisterUserInput = z.infer<typeof registerSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;