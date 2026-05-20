const { Router } = require("express");
const { emailScanController } = require("../controllers/email-scan.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  createEmailScanSchema,
  getEmailScanSchema,
  listEmailScansSchema,
} = require("../validators/email-scan.validator");

const router = Router();

router.use(requireAuth);

router.get("/", validate(listEmailScansSchema), asyncHandler(emailScanController.list));
router.post("/", validate(createEmailScanSchema), asyncHandler(emailScanController.create));
router.get("/:id", validate(getEmailScanSchema), asyncHandler(emailScanController.getById));

module.exports = {
  emailScanRoutes: router,
};
