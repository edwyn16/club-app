
import { prisma } from "../src/database/prisma.js";
import { hashPassword } from "../src/utils/password.js";
import { z } from "zod";

const inputSchema = z.object({
    email: z.email().trim().toLowerCase().max(254),
    password: z.string().min(12).max(128),
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
});

const main = async () => {
    const input = inputSchema.parse({
        email: process.env.BOOTSTRAP_ADMIN_EMAIL,
        password: process.env.BOOTSTRAP_ADMIN_PASSWORD,
        firstName: process.env.BOOTSTRAP_ADMIN_FIRST_NAME,
        lastName: process.env.BOOTSTRAP_ADMIN_LAST_NAME,
    });

    await prisma.$transaction(async (tx) => {
        const existingAdmin = await tx.userPlatformRole.findFirst({
            where: {
                deletedAt: null,
                user: {
                    isActive: true,
                    deletedAt: null,
                },
                role: {
                    code: "PLATFORM_ADMIN",
                    scope: "PLATFORM",
                    isActive: true,
                    deletedAt: null,
                },
            },
            select: { id: true },
        });

        if (existingAdmin) {
            throw new Error(
                "An active Platform Admin already exists. Bootstrap cancelled.",
            );
        }

        const existingUser = await tx.user.findUnique({
            where: { email: input.email },
            select: { id: true },
        });

        if (existingUser) {
            throw new Error(
                "This email address is already registered. Bootstrap cancelled.",
            );
        }

        const role = await tx.role.findUnique({
            where: { code: "PLATFORM_ADMIN" },
        });

        if (!role || role.scope !== "PLATFORM" || !role.isActive || role.deletedAt !== null) {
            throw new Error(
                "The active PLATFORM_ADMIN role must be seeded first.",
            );
        }

        const passwordHash = await hashPassword(input.password);

        const user = await tx.user.create({
            data: {
                email: input.email,
                passwordHash,
                firstName: input.firstName,
                lastName: input.lastName,
                emailVerifiedAt: new Date(),
            },
        });

        await tx.userPlatformRole.create({
            data: {
                userId: user.id,
                roleId: role.id,
            },
        });

        console.log(
            "Initial Platform Admin provisioned successfully.",
        );
    });
};

main()
    .catch((error: unknown) => {
        console.error("Platform Admin bootstrap failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });