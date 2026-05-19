const { Router } = require("express");
const { authRoutes } = require("./auth.routes");
const { healthRoutes } = require("./health.routes");
const { subscriptionRoutes } = require("./subscription.routes");

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/subscriptions", subscriptionRoutes);

module.exports = {
  apiRoutes: router,
};
