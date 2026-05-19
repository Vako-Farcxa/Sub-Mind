const { Router } = require("express");
const { reminderSettingsController } = require("../controllers/reminder-settings.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { asyncHandler } = require("../utils/asyncHandler");
const { updateReminderSettingsSchema } = require("../validators/reminder-settings.validator");

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(reminderSettingsController.get));
router.patch(
  "/",
  validate(updateReminderSettingsSchema),
  asyncHandler(reminderSettingsController.update),
);

module.exports = {
  reminderSettingsRoutes: router,
};
