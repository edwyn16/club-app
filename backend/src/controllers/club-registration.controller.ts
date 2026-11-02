import type { Request, Response } from "express";
import { ZodError, z } from "zod";

import { Prisma } from "../generated/prisma/client.js";

import { clubRegistrationSchema } from "../validators/club-registration.validator.js";
import { submitClubRegistration, ClubRegistrationError, rejectClubRegistration, approveClubRegistration, getPendingClubRegistrations } from "../services/club-registration.service.js";
import { rejectClubRegistrationSchema, approveClubRegistrationSchema } from "../validators/club-registration-review.validator.js";

export const submitClubRegistrationController = async (req: Request, res: Response): Promise<void> => {
    try {
        const input = clubRegistrationSchema.parse(req.body);

        const registration = await submitClubRegistration(input);

        res.status(201).json({
            status: "Success",
            message: "Club registration request submitted successfully.",
            data: {
                registration,
            },
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                status: "error",
                message: "Invalid registration information.",
                errors: error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
            return;
        }

        if (error instanceof ClubRegistrationError) {
            res.status(error.statusCode).json({
                status: "error",
                message: error.message,
            });
            return;
        }

        console.error("Club registration error:", error);

        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred.",
        });
    }
};

export const getPendingClubRegistrationsController = async (_req: Request, res: Response,): Promise<void> => {
    try {
        const registrations = await getPendingClubRegistrations();

        res.status(200).json({
            status: "success",
            data: {
                registrations,
                total: registrations.length,
            },
        });
    } catch (error) {
        console.error("Failed to retrieve pending club registrations:", error);

        res.status(500).json({
            status: "error",
            message: "Unable to retrieve club registration requests.",
        });
    }
};

export const rejectClubRegistrationController = async (req: Request, res: Response,): Promise<void> => {
    try {
        const registrationId = z.uuid().parse(req.params.id);

        const { reviewNote } = rejectClubRegistrationSchema.parse(req.body);
        const registration = await rejectClubRegistration({
            registrationId,
            reviewNote,
        });

        res.status(200).json({
            status: "success",
            message: "Club registration request rejected successfully.",
            data: {
                registration,
            },
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                status: "error",
                message: "Invalid rejection information.",
                errors: error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
            return;
        }

        if (error instanceof ClubRegistrationError) {
            res.status(error.statusCode).json({
                status: "error",
                message: error.message,
            });
            return;
        }

        console.error("Club registration rejection error:", error);

        res.status(500).json({
            status: "error",
            message: "Unable to reject club registration request.",
        });
    }
};

export const approveClubRegistrationController = async (req: Request, res: Response,): Promise<void> => {
    try {
        const registrationId = z.uuid().parse(req.params.id);

        const { reviewNote } = approveClubRegistrationSchema.parse(req.body);
        const result = await approveClubRegistration({
            registrationId, ...(reviewNote !== undefined && { reviewNote }),
        })

        res.status(200).json({
            status: "success",
            message: "Club registration request approved successfully.",
            data: {
                registration: result,
            },
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                status: "error",
                message: "Invalid approval information.",
                errors: error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
            return;
        }

        if (error instanceof ClubRegistrationError) {
            res.status(error.statusCode).json({
                status: "error",
                message: error.message,
            });
            return;
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
            res.status(409).json({
                status: "error",
                message: "The registration is being processed by another request",
            })
        }

        console.error("Club registration approval error:", error);

        res.status(500).json({
            status: "error",
            message: "Unable tp approve club registration request.",
        });
    }
}