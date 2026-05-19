const { Router } = require("express");
const { subscriptionController } = require("../controllers/subscription.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  createSubscriptionSchema,
  deleteSubscriptionSchema,
  getSubscriptionSchema,
  listSubscriptionsSchema,
  updateSubscriptionSchema,
} = require("../validators/subscription.validator");

const router = Router();

router.use(requireAuth);

router.get("/", validate(listSubscriptionsSchema), asyncHandler(subscriptionController.list));
router.get("/summary", asyncHandler(subscriptionController.summary));
router.get("/:id", validate(getSubscriptionSchema), asyncHandler(subscriptionController.getById));
router.post("/", validate(createSubscriptionSchema), asyncHandler(subscriptionController.create));
router.patch(
  "/:id",
  validate(updateSubscriptionSchema),
  asyncHandler(subscriptionController.update),
);
router.delete(
  "/:id",
  validate(deleteSubscriptionSchema),
  asyncHandler(subscriptionController.remove),
);

module.exports = {
  subscriptionRoutes: router,
};
