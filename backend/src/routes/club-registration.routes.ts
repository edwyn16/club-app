import { Router } from "express";

import { submitClubRegistrationController } from "../controllers/club-registration.controller.js";
import { doubleCsrfProtection } from "../middlewares/csrf.middleware.js";
import { requireTrustedOrigin } from "../middlewares/trusted-origin.middleware.js";
import { loginRateLimiter } from "../middlewares/auth-rate-limit.middleware.js";

import { getPendingClubRegistrationsController } from "../controllers/club-registration.controller.js";
import { requireAuthentication } from "../middlewares/auth.middleware.js";
import { requirePlatformAdmin } from "../middlewares/platform-admin.middleware.js";

import { rejectClubRegistrationController } from "../controllers/club-registration.controller.js";
import { approveClubRegistrationController } from "../controllers/club-registration.controller.js";

const router = Router();

router.use(requireTrustedOrigin);

router.post("/", loginRateLimiter, doubleCsrfProtection, submitClubRegistrationController,);

router.get("/pending", requireAuthentication, requirePlatformAdmin, getPendingClubRegistrationsController,);

router.patch("/:id/reject", requireAuthentication, requirePlatformAdmin, doubleCsrfProtection, rejectClubRegistrationController);
router.patch("/:id/approve", requireAuthentication, requirePlatformAdmin, doubleCsrfProtection, approveClubRegistrationController);

export { router as clubRegistrationRouter };