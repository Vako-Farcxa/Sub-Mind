const { notificationService } = require("../services/notification.service");
const { sendSuccess } = require("../utils/apiResponse");

const notificationController = {
  async list(req, res) {
    const notifications = await notificationService.listForUser(req.user.id, req.validated.query);

    return sendSuccess(res, notifications);
  },

  async markRead(req, res) {
    const result = await notificationService.markRead(req.user.id, req.validated.params.id);

    return sendSuccess(res, result);
  },

  async runReminders(req, res) {
    const result = await notificationService.runReminderCycle();

    return sendSuccess(res, result);
  },
};

module.exports = {
  notificationController,
};
