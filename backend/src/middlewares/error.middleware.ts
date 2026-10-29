import type { NextFunction, Request, Response } from "express";

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof Error && "code" in err && err.code === "EBADCSRFTOKEN") {
        res.status(403).json({
            status: "error",
            message: "Invlaid or missing CSRF token.",
        });
        return
    }

    console.error(err);

    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
};