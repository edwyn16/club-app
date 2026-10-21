import { Router } from "express";
import { prisma } from "../database/prisma.js";

const router = Router();

router.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Club LMS API is running!",
    });
});

router.get("/health/db", async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.status(200).json({
            status: "ok",
            database: "connected",
            message: "Neon PostgreSQL is reachable.",
        });
    } catch (error) {
        console.error("Database health check failed:", error);

        res.status(503).json({
            status: "error",
            database: "Disconnected",
            message: "Neon PostgreSQL is currently unavailable.",
        });
    }
});

export default router;