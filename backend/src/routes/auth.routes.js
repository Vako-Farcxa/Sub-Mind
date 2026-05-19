const { Router } = require("express");
const { authController } = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { asyncHandler } = require("../utils/asyncHandler");
const { loginSchema, registerSchema } = require("../validators/auth.validator");

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(authController.register));
router.post("/login", validate(loginSchema), asyncHandler(authController.login));
router.get("/me", requireAuth, asyncHandler(authController.me));
router.post("/logout", authController.logout);

module.exports = {
  authRoutes: router,
};
