import { z } from "zod";
import type { infer as ZodInfer } from "zod";

export const clubRegistrationSchema = z
    .object({
        proposedClubName: z.string().trim().min(2).max(150),
        clubType: z.enum(["PATHFINDER", "ADVENTURER"]),

        applicantName: z.string().trim().min(2).max(150),
        applicantEmail: z.email().trim().toLowerCase(),

        churchId: z.uuid().optional(),

        proposedChurchName: z.string().trim().min(2).max(150).optional(),
    })
    .superRefine((data, ctx) => {
        const hasChurchId = Boolean(data.churchId);
        const hasProposedChurch = Boolean(data.proposedChurchName);

        if (hasChurchId === hasProposedChurch) {
            ctx.addIssue({
                code: "custom",
                path: ["churchId"],
                message: "Provide either an existing church ID or a proposed church name.",
            });
        }
    });

export type ClubRegistrationInput = ZodInfer<typeof clubRegistrationSchema>;