import { doubleCsrf } from "csrf-csrf";
import { randomBytes } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

import { env } from "../config/env.js";

const CSRF_CONTEXT_COOKIE =
    env.NODE_ENV === "production"
        ? "__Host-club_csrf_context"
        : "club_csrf_context";

const readCookie = (req: Request, name: string): string | undefined => {
    return req.headers.cookie
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`))
        ?.slice(name.length + 1);
}

const getCsrfIdentifier = (req: Request): string => {
    const context: unknown = req.cookies?.[CSRF_CONTEXT_COOKIE];

    if (typeof context !== "string" || !/^[0-9a-f]{64}$/.test(context)) {
        throw new Error("CSRF context is missing.");
    }

    return context;
}

export const ensureCsrfContext = (req: Request, res: Response, next: NextFunction,): void => {
    const existingContext = readCookie(req, CSRF_CONTEXT_COOKIE);

    if (!existingContext || !/^[0-9a-f]{64}$/.test(existingContext)) {
        const context = randomBytes(32).toString("hex");

        res.cookie(CSRF_CONTEXT_COOKIE, context, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        // Synchronize the newly generated cookie with cookie-parser.
        req.cookies = {
            ...(req.cookies ?? {}),
            [CSRF_CONTEXT_COOKIE]: context,
        };

        // Make the newly created context available to this request
        req.headers.cookie = [
            req.headers.cookie
                ?.split(";")
                .filter(
                    (part) =>
                        !part.trim().startsWith(`${CSRF_CONTEXT_COOKIE}=`)
                )
                .join("; "),
                `${CSRF_CONTEXT_COOKIE}=${context}`,
        ]
            .filter(Boolean)
            .join("; ");
    }

    next();
}

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => env.CSRF_SECRET,

    getSessionIdentifier: getCsrfIdentifier,

    cookieName:
        env.NODE_ENV === "production"
            ? "__Host-club_csrf"
            : "club_csrf",

    cookieOptions: {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    },

    getCsrfTokenFromRequest: (req) => {
        const token = req.headers["x-csrf-token"];
        return typeof token === "string" ? token : undefined;
    },
});

export { generateCsrfToken, doubleCsrfProtection };