import type { CookieOptions, Response } from "express";
import { env } from "../config/index.js"

export const SESSION_COOKIE_NAME = 'club_session';

const SESSION_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api",
};

export const setSessionCookie = (res: Response, token: string, expiresAt: Date): void => {
    res.cookie(SESSION_COOKIE_NAME, token, {
        ...SESSION_COOKIE_OPTIONS,
        expires: expiresAt,
    });
}

export const clearSessionCookie = (res: Response): void => {
    res.clearCookie(SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS);
}