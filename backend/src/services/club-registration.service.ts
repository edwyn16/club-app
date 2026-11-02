import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../database/prisma.js"
import type { ClubRegistrationInput } from "../validators/club-registration.validator.js";

export class ClubRegistrationError extends Error {
    constructor(message: string, public readonly statusCode: number,) {
        super(message);
        this.name = "ClubRegistrationError";
    }
}

export const submitClubRegistration = async (input: ClubRegistrationInput) => {
    if (input.churchId) {
        const church = await prisma.church.findFirst({
            where: {
                id: input.churchId,
                deletedAt: null,
            },
            select: { id: true },
        });

        if (!church) {
            throw new ClubRegistrationError(
                "The selected church does not exist.", 404,
            );
        }
    }

    return prisma.clubRegistrationRequest.create({
        data: {
            proposedClubName: input.proposedClubName,
            clubType: input.clubType,
            applicantName: input.applicantName,
            applicantEmail: input.applicantEmail,
            churchId: input.churchId ?? null,
            proposedChurchName: input.proposedChurchName ?? null,
            status: "PENDING",
        },
        select: {
            id: true,
            proposedClubName: true,
            clubType: true,
            status: true,
            createdAt: true,
        },
    });
};

export const getPendingClubRegistrations = async () => {
    return prisma.clubRegistrationRequest.findMany({
        where: {
            status: "PENDING",
            deletedAt: null,
        },
        select: {
            id: true,
            proposedClubName: true,
            clubType: true,
            applicantName: true,
            applicantEmail: true,
            churchId: true,
            proposedChurchName: true,
            status: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};

export interface RejectClubRegistrationInput {
    registrationId: string;
    reviewNote: string;
}

export const rejectClubRegistration = async (input: RejectClubRegistrationInput) => {
    const reviewNote = input.reviewNote.trim();

    if (!reviewNote) {
        throw new ClubRegistrationError(
            "A rejection reason is required.", 400,
        );
    }

    const result = await prisma.clubRegistrationRequest.updateMany({
        where: {
            id: input.registrationId,
            status: "PENDING",
            deletedAt: null,
        },
        data: {
            status: "REJECTED",
            reviewedAt: new Date(),
            reviewNote,
        },
    });

    if (result.count === 0) {
        throw new ClubRegistrationError(
            "Registration request not found or already reveiwed.", 409,
        );
    }

    return prisma.clubRegistrationRequest.findUniqueOrThrow({
        where: {
            id: input.registrationId,
        },
        select: {
            id: true,
            proposedClubName: true,
            clubType: true,
            status: true,
            reviewedAt: true,
            reviewNote: true,
        },
    });
};

export interface ApprovedClubRegistrationInput {
    registrationId: string;
    reviewNote?: string;
}

export const approveClubRegistration = async (input: ApprovedClubRegistrationInput,) => {
    return prisma.$transaction(async (tx) => {
        const claim = await tx.clubRegistrationRequest.updateMany({
            where: {
                id: input.registrationId,
                status: "PENDING",
                deletedAt: null,
            },
            data: {
                status: "APPROVED",
                reviewedAt: new Date(),
                reviewNote: input.reviewNote?.trim() || null,
            },
        });

        if (claim.count !== 1) {
            throw new ClubRegistrationError(
                "Registration request is not found or already reviewed.", 409,
            );
        }

        const registration = await tx.clubRegistrationRequest.findUniqueOrThrow({
            where: {
                id: input.registrationId,
            },
        });

        let churchId = registration.churchId;

        if (churchId) {
            const church = await tx.church.findFirst({
                where: {
                    id: churchId,
                    deletedAt: null,
                },
                select: {
                    id: true,
                },
            });

            if (!church) {
                throw new ClubRegistrationError(
                    "The selected church is no longer available.", 409,
                );
            }
        } else {
            const propossedChurchName = registration.proposedChurchName?.trim();

            if (!propossedChurchName) {
                throw new ClubRegistrationError(
                    "The registration does not contain a valid church.", 409,
                );
            }

            const church = await tx.church.create({
                data: {
                    name: propossedChurchName,
                },
                select: {
                    id: true,
                },
            });

            churchId = church.id;
        }

        const club = await tx.club.create({
            data: {
                name: registration.proposedClubName,
                type: registration.clubType,
                churchId,
                settings: {
                    create: {
                        contactEmail: registration.applicantEmail,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                type: true,
                churchId: true,
            },
        });

        return {
            registrationId: registration.id,
            status: "APPROVED" as const,
            club,
        };
    }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
};