import { rateLimit } from "express-rate-limit";

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Limit each IP to 10 login requests per `window` (here, per 15 minutes)
    standardHeaders: "draft-8", // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: "error",
        message: "Too many login attempts, please try again after 15 minutes.",
    },
});

export const registrationRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5, // Limit each IP to 5 registration requests per `window` (here, per 1 hour)
    standardHeaders: "draft-8", // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: "error",
        message: "Too many registration attempts, please try again after 1 hour.",
    },
});