const { Router } = require("express");
const { authRoutes } = require("./auth.routes");
const { detectedSubscriptionRoutes } = require("./detected-subscription.routes");
const { emailScanRoutes } = require("./email-scan.routes");
const { healthRoutes } = require("./health.routes");
const { notificationRoutes } = require("./notification.routes");
const { reminderSettingsRoutes } = require("./reminder-settings.routes");
const { subscriptionRoutes } = require("./subscription.routes");

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/detected-subscriptions", detectedSubscriptionRoutes);
router.use("/email-scans", emailScanRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reminder-settings", reminderSettingsRoutes);
router.use("/subscriptions", subscriptionRoutes);

module.exports = {
  apiRoutes: router,
};
