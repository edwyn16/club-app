import { z } from "zod";

export const rejectClubRegistrationSchema = z.object({
    reviewNote: z
        .string()
        .trim()
        .min(1, "A rejection reason is required.")
        .max(2000, "Rejection reason must not exceed 2000 characters."),
});

export const approveClubRegistrationSchema = z.object({
    reviewNote: z
        .string()
        .trim()
        .max(2000, "Review note must not exceed 2000 characters.")
        .optional(),
});