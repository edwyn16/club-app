import type { Response, NextFunction } from "express";
import { prisma } from "../database/prisma.js";
import type { AuthenticatedRequest } from "./auth.middleware.js";

export const requirePlatformAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.authenticatedUser?.id;

        if (!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required."
            });
            return;
        }

        const platformAdmin = await prisma.userPlatformRole.findFirst({
            where: {
                userId,
                deletedAt: null,
                role: {
                    code: "PLATFORM_ADMIN",
                    scope: "PLATFORM",
                    isActive: true,
                    deletedAt: null,
                },
            },
            select: {
                id: true,
            },
        });

        if (!platformAdmin) {
            res.status(403).json({
                status: "error",
                message: "Platform Administrator access required.",
            });
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
};