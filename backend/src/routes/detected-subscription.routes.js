const { Router } = require("express");
const {
  detectedSubscriptionController,
} = require("../controllers/detected-subscription.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  confirmDetectedSubscriptionSchema,
  detectedSubscriptionParamsSchema,
  listDetectedSubscriptionsSchema,
} = require("../validators/detected-subscription.validator");

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  validate(listDetectedSubscriptionsSchema),
  asyncHandler(detectedSubscriptionController.list),
);
router.post(
  "/:id/confirm",
  validate(confirmDetectedSubscriptionSchema),
  asyncHandler(detectedSubscriptionController.confirm),
);
router.post(
  "/:id/dismiss",
  validate(detectedSubscriptionParamsSchema),
  asyncHandler(detectedSubscriptionController.dismiss),
);

module.exports = {
  detectedSubscriptionRoutes: router,
};
