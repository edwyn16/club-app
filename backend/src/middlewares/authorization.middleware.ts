import type { Request, Response, NextFunction } from "express";
import { prisma } from "../database/prisma.js";
import type { AuthenticatedRequest } from "./auth.middleware.js";

interface AuthorizationOptions {
    permission: string;
    getClubId?: (req: Request) => string | undefined;
    allowedScopes: readonly string[];
}

export const requirePermission = (options: AuthorizationOptions) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.authenticatedUser?.id;

            if (!userId) {
                res.status(401).json({
                    status: "error",
                    message: "Authentication required.",
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
                select: { id: true },
            });

            if (platformAdmin) {
                next();
                return;
            }

            const clubId = options.getClubId?.(req);

            if (!clubId) {
                res.status(403).json({
                    status: "error",
                    message: "Club context is required",
                });
                return;
            }

            const assignment = await prisma.userClubRole.findFirst({
                where: {
                    userId,
                    clubId,
                    deletedAt: null,
                    role: {
                        scope: "CLUB",
                        isActive: true,
                        deletedAt: null,
                        rolePermissions: {
                            some: {
                                accessScope: {
                                    in: [...options.allowedScopes].filter(
                                        (scope) => scope !== "UNASSIGNED" && scope !== "No",
                                    ),
                                },
                                permission: {
                                    code: options.permission,
                                    deletedAt: null,
                                },
                            },
                        },
                    },
                },
                select: { id: true },
            });

            if (!assignment) {
                res.status(403).json({
                    status: "error",
                    message: "Insufficient permissions to access this resource.",
                });
                return;
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}