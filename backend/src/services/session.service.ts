import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../database/prisma.js";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const hashSessionToken = (token: string): string => {
    return createHash("sha256").update(token).digest("hex");
};

export const createSession = async (userId: string) => {
    const token = randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    await prisma.authSession.create({
        data: {
            userId,
            tokenHash: hashSessionToken(token),
            expiresAt,
        },
    });

    return { token, expiresAt, };
}

export const validateSession = async (token: string) => {
    if (!/^[a-f0-9]{64}$/i.test(token)) {
        return null;
    }

    const session = await prisma.authSession.findUnique({
        where: { tokenHash: hashSessionToken(token), },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    isActive: true,
                    deletedAt: true,
                },
            },
        },
    });

    if (!session || session.revokedAt !== null || session.expiresAt <= new Date() || !session.user.isActive || session.user.deletedAt !== null) {
        return null;
    }

    return {
        sessionId: session.id,
        user: {
            id: session.user.id,
            email: session.user.email,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
        },
    };
}

export const revokeSession = async (token: string) => {
    if (!/^[a-f0-9]{64}$/i.test(token)) {
        return;
    }

    await prisma.authSession.updateMany({
        where: {
            tokenHash: hashSessionToken(token),
            revokedAt: null,
        },
        data: {
            revokedAt: new Date(),
        },
    });
}

export const revokeAllUserSessions = async (userId: string) => {
    await prisma.authSession.updateMany({
        where: {
            userId,
            revokedAt: null,
        },
        data: {
            revokedAt: new Date(),
        },
    });
}