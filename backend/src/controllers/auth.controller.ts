import type { Request, Response } from "express";
import { ZodError } from "zod";

import { authenticateUser, registerUser, AuthServiceError } from "../services/auth.service.js";
import { loginSchema, registerSchema, } from "../validators/auth.validator.js";

import { createSession, revokeSession } from "../services/session.service.js";
import { clearSessionCookie, setSessionCookie, SESSION_COOKIE_NAME } from "../utils/session-cookie.js";

const handleAuthError = (error: unknown, res: Response): void =>{
    if (error instanceof ZodError) {
        res.status(400).json({
            status: "error",
            message: "Invalid request data.",
            errors: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
        return;
    }

    if (error instanceof AuthServiceError) {
        res.status(error.statusCode).json({
            status: "error",
            message: error.message,
        });
        return;
    }

    console.error("Authentication error:", error);

    res.status(500).json({
        status: "error",
        message: "An unexpected error occurred.",
    });
}

export const registerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const input = registerSchema.parse(req.body);
        const user = await registerUser(input);

        res.status(201).json({
            status: "success",
            message: "Account created successfully.",
            data: { user },
        });
    } catch (error) {
        handleAuthError(error, res);
    }
}

export const loginController = async (req: Request, res: Response): Promise<void> => {
    try {
        const input = loginSchema.parse(req.body);
        const user = await authenticateUser(input);

        const session = await createSession(user.id);

        setSessionCookie(res, session.token, session.expiresAt);

        res.status(200).json({
            status: "success",
            message: "Login successful.",
            data: { user },
        });
    } catch (error) {
        handleAuthError(error, res);
    }
}

export const logoutController = async (req: Request, res: Response): Promise<void> => {
    try {
        const cookieHeader = req.headers.cookie;

        const sessionCookie = cookieHeader
            ?.split(";")
            .map((cookie) => cookie.trim())
            .find((cookie) =>
                cookie.startsWith(`${SESSION_COOKIE_NAME}=`)
            );

        const token = sessionCookie?.slice(SESSION_COOKIE_NAME.length + 1);

        if (token) {
            await revokeSession(token);
        }

        clearSessionCookie(res);

        res.status(200).json({
            status: "success",
            message: "Logout successful.",
        });
    } catch (error) {
        handleAuthError(error, res);
    }
}