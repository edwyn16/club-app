import { randomBytes, createHash } from 'node:crypto';
import { prisma } from '../database/prisma.js';
import { env } from '../config/env.js';
import { sendEmail } from './email.service.js';
import { createVerificationEmail } from '../templates/verification-email.template.js';

const TOKEN_EXPIRATION_HOURS = 24; // Token expiration time in hours

const hashToken = (token: string): string => {
    return createHash('sha256').update(token).digest('hex');
};

export class EmailVerificationError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
    ) {
        super(message);
        this.name = 'EmailVerificationError';
    }
}

export const createEmailVerificationToken = async (userId: string) => {
    const token = randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);

    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000); // Set expiration time

    await prisma.$transaction(async (tx) => {
        await tx.emailVerificationToken.deleteMany({
            where: {
                userId,
                usedAt: null,
            },
        });

        await tx.emailVerificationToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
            },
        });
    });

    return { token, expiresAt };
};

export const verifyEmailToken = async (token: string,) => {
    const tokenHash = hashToken(token);

    return prisma.$transaction(async (tx) => {
        const verification = await tx.emailVerificationToken.findUnique({
            where: { tokenHash },
        });

        if (!verification || verification.usedAt !== null || verification.expiresAt <= new Date()) {
            throw new EmailVerificationError(
                "Invalid or expired verification token.",
                400,
            );
        }

        const user = await tx.user.findUnique({
            where: { id: verification.userId },
            select: {
                id: true,
                isActive: true,
                deletedAt: true,
                emailVerifiedAt: true,
            },
        });

        if (!user || !user.isActive || user.deletedAt !== null || user.emailVerifiedAt !== null) {
            throw new EmailVerificationError(
                "This account cannot be verified. Please contact support.",
                400,
            );
        }

        const verifiedAt = new Date();

        await tx.user.update({
            where: { id: user.id },
            data: { emailVerifiedAt: verifiedAt },
        });

        await tx.emailVerificationToken.update({
            where: { id: verification.id },
            data: { usedAt: verifiedAt },
        });

        return {
            userId: user.id,
            emailVerifiedAt: verifiedAt,
        };
    });
};

export const resendEmailVerification = async (email: string,): Promise<void> => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: {
            id: true,
            email: true,
            firstName: true,
            isActive: true,
            deletedAt: true,
            emailVerifiedAt: true,
        },
    });

    if (!user || !user.isActive || user.deletedAt !== null || user.emailVerifiedAt !== null) {
        return;
    }

    const { token } = await createEmailVerificationToken(user.id);
    const verificationUrl = new URL(
        "/verify-email",
        env.FRONTEND_URL,
    );
    verificationUrl.searchParams.set("token", token);

    const verificationEmail = createVerificationEmail({
        firstName: user.firstName,
        verificationUrl: verificationUrl.toString(),
    });

    await sendEmail({
        to: user.email,
        subject: verificationEmail.subject,
        html: verificationEmail.html,
        text: verificationEmail.text,
    });
};