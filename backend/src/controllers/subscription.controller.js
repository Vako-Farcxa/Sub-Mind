const { subscriptionService } = require("../services/subscription.service");
const { sendSuccess } = require("../utils/apiResponse");

const subscriptionController = {
  async list(req, res) {
    const subscriptions = await subscriptionService.list(req.user.id, req.validated.query);

    return sendSuccess(res, subscriptions);
  },

  async summary(req, res) {
    const summary = await subscriptionService.getSummary(req.user.id);

    return sendSuccess(res, summary);
  },

  async getById(req, res) {
    const subscription = await subscriptionService.getById(req.user.id, req.validated.params.id);

    return sendSuccess(res, subscription);
  },

  async create(req, res) {
    const subscription = await subscriptionService.create(req.user.id, req.validated.body);

    return sendSuccess(res, subscription, 201);
  },

  async update(req, res) {
    const subscription = await subscriptionService.update(
      req.user.id,
      req.validated.params.id,
      req.validated.body,
    );

    return sendSuccess(res, subscription);
  },

  async remove(req, res) {
    const result = await subscriptionService.remove(req.user.id, req.validated.params.id);

    return sendSuccess(res, result);
  },
};

module.exports = {
  subscriptionController,
};
