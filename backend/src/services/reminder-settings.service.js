const {
  defaultReminderSettings,
  reminderSettingsRepository,
} = require("../repositories/reminder-settings.repository");

const serializeReminderSettings = (settings) => ({
  ...defaultReminderSettings,
  ...settings,
  telegramChatId: settings?.telegramChatId || "",
  createdAt: settings?.createdAt?.toISOString?.() || settings?.createdAt || null,
  updatedAt: settings?.updatedAt?.toISOString?.() || settings?.updatedAt || null,
});

const reminderSettingsService = {
  async getForUser(userId) {
    const settings = await reminderSettingsRepository.findByUserId(userId);

    if (!settings) {
      const createdSettings = await reminderSettingsRepository.upsertForUser(userId);
      return serializeReminderSettings(createdSettings);
    }

    return serializeReminderSettings(settings);
  },

  async updateForUser(userId, input) {
    const settings = await reminderSettingsRepository.upsertForUser(userId, input);

    return serializeReminderSettings(settings);
  },
};

module.exports = {
  reminderSettingsService,
  serializeReminderSettings,
};
