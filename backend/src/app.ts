import cors from "cors";
import express from "express";

import { env } from "./config/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import apiRouter from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;