const { reminderSettingsService } = require("../services/reminder-settings.service");
const { sendSuccess } = require("../utils/apiResponse");

const reminderSettingsController = {
  async get(req, res) {
    const settings = await reminderSettingsService.getForUser(req.user.id);

    return sendSuccess(res, settings);
  },

  async update(req, res) {
    const settings = await reminderSettingsService.updateForUser(req.user.id, req.validated.body);

    return sendSuccess(res, settings);
  },
};

module.exports = {
  reminderSettingsController,
};
