const { Router } = require("express");
const { notificationController } = require("../controllers/notification.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  listNotificationsSchema,
  notificationParamsSchema,
} = require("../validators/notification.validator");

const router = Router();

router.use(requireAuth);

router.get("/", validate(listNotificationsSchema), asyncHandler(notificationController.list));
router.post("/run-reminders", asyncHandler(notificationController.runReminders));
router.post(
  "/:id/read",
  validate(notificationParamsSchema),
  asyncHandler(notificationController.markRead),
);

module.exports = {
  notificationRoutes: router,
};
