import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

const trustedOrigin = new URL(env.FRONTEND_URL).origin;

const safeMethods = new Set([
    "GET",
    "HEAD",
    "OPTIONS",
]);

export const requireTrustedOrigin = (req: Request, res: Response, next: NextFunction,): void => {
    if (safeMethods.has(req.method)) {
        next();
        return;
    }

    const origin = req.headers.origin;

    if (!origin || origin !== trustedOrigin) {
        res.status(403).json({
            status: "error",
            message: "Request origin is not allowed.",
        });
        return;
    }

    next();
}