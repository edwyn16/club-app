import type { NextFunction, Request, Response } from "express";

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    console.error(err);

    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
};