import { prisma } from "../database/prisma.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

export interface RegisterUserInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginUserInput {
    email: string;
    password: string;
}

export class AuthServiceError extends Error {
    constructor(message: string, public readonly statusCode: number,) {
        super(message);
        this.name = "AuthServiceError";
    }
}

const publicUserSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    emailVerifiedAt: true,
    isActive: true,
    createdAt: true,
} as const;

export const registerUser = async (input: RegisterUserInput) => {
    const email = input.email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });

    if (existingUser) {
        throw new AuthServiceError("An account with this email already exists.", 409);
    }

    const passwordHash = await hashPassword(input.password);

    try {
        return await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName: input.firstName.trim(),
                lastName: input.lastName.trim(),
            },
            select: publicUserSelect,
        });
    } catch (error) {
        // Handle any concurrent registration using the same email.
        if (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            throw new AuthServiceError("An account with this email already exists.", 409);
        }
        throw error;
    }
}

export const authenticateUser = async (input: LoginUserInput) => {
    const email = input.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || !user.isActive || user.deletedAt !== null) {
        throw new AuthServiceError("Invalid email or password.", 401,);
    }

    const passwordValid = await verifyPassword(input.password, user.passwordHash,);

    if (!passwordValid) {
        throw new AuthServiceError("Invalid email or password.", 401,);
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
}