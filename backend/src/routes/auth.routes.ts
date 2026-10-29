import { Router } from "express";
import { loginController, logoutController } from "../controllers/auth.controller.js";
import { requireAuthentication, type AuthenticatedRequest  } from "../middlewares/auth.middleware.js";
import { loginRateLimiter } from "../middlewares/auth-rate-limit.middleware.js";
import { ensureCsrfContext, generateCsrfToken, doubleCsrfProtection } from "../middlewares/csrf.middleware.js";
import { requireTrustedOrigin } from "../middlewares/trusted-origin.middleware.js";

const router = Router();

router.use(requireTrustedOrigin);

router.get("/csrf-token", ensureCsrfContext, (req, res) => {
    const csrfToken = generateCsrfToken(req, res);

    res.status(200).json({
        status: "success",
        data: { csrfToken },
    });
});

router.post("/register", (_req, res) => {
    res.status(403).json({
        status: "error",
        message: "Public registration is not available.",
    });
});
router.post("/login", loginRateLimiter, doubleCsrfProtection, loginController);
router.post("/logout", requireAuthentication, doubleCsrfProtection, logoutController);

router.get("/me", requireAuthentication, (req, res) => {
    const authenticatedRequest = req as AuthenticatedRequest;

    res.status(200).json({
        status: "success",
        data: {
            user: authenticatedRequest.authenticatedUser,
        },
    });
});

export { router as authRouter };