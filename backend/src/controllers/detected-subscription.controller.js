const { detectedSubscriptionService } = require("../services/detected-subscription.service");
const { sendSuccess } = require("../utils/apiResponse");

const detectedSubscriptionController = {
  async list(req, res) {
    const detections = await detectedSubscriptionService.list(req.user.id, req.validated.query);

    return sendSuccess(res, detections);
  },

  async confirm(req, res) {
    const result = await detectedSubscriptionService.confirm(
      req.user.id,
      req.validated.params.id,
      req.validated.body,
    );

    return sendSuccess(res, result, 201);
  },

  async dismiss(req, res) {
    const detection = await detectedSubscriptionService.dismiss(req.user.id, req.validated.params.id);

    return sendSuccess(res, detection);
  },
};

module.exports = {
  detectedSubscriptionController,
};
