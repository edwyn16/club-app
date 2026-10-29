import type { Request, Response, NextFunction } from "express";
import { validateSession } from "../services/session.service.js";
import { SESSION_COOKIE_NAME } from "../utils/session-cookie.js";

export type AuthenticatedUser = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
};

export interface AuthenticatedRequest extends Request {
    authenticatedUser?: AuthenticatedUser;
    sessionId?: string;
}

export const requireAuthentication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const cookieHeader = req.headers.cookie;

        const sessionCookie = cookieHeader
            ?.split(";")
            .map((cookie) => cookie.trim())
            .find((cookie) =>
                cookie.startsWith(`${SESSION_COOKIE_NAME}=`)
            );
        
            const token = sessionCookie?.slice(SESSION_COOKIE_NAME.length + 1);

        if (!token) {
            res.status(401).json({
                status: "error",
                message: "Authentication required.",
            });
            return;
        }

        const session = await validateSession(token);

        if (!session) {
            res.status(401).json({
                status: "error",
                message: "Invalid or expired session.",
            });
            return;
        }

        req.authenticatedUser = session.user;
        req.sessionId = session.sessionId;

        next();
    } catch (error) {
        next(error);
    }
}