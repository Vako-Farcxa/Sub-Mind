const { Router } = require("express");
const { authController } = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  googleCallbackSchema,
  loginSchema,
  registerSchema,
} = require("../validators/auth.validator");

const router = Router();

router.get("/google", authController.startGoogleLogin);
router.get(
  "/google/callback",
  validate(googleCallbackSchema),
  asyncHandler(authController.googleCallback),
);
router.post("/register", validate(registerSchema), asyncHandler(authController.register));
router.post("/login", validate(loginSchema), asyncHandler(authController.login));
router.get("/me", requireAuth, asyncHandler(authController.me));
router.post("/refresh", asyncHandler(authController.refresh));
router.post("/logout", authController.logout);

module.exports = {
  authRoutes: router,
};
