const { getPrisma } = require("../db/prisma");

const defaultReminderSettings = {
  enabled: true,
  daysBefore: 3,
  emailEnabled: true,
  telegramEnabled: false,
};

const reminderSettingsRepository = {
  findByUserId(userId) {
    const prisma = getPrisma();

    return prisma.reminderSettings.findUnique({
      where: { userId },
    });
  },

  upsertForUser(userId, data = {}) {
    const prisma = getPrisma();

    return prisma.reminderSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...defaultReminderSettings,
        ...data,
      },
    });
  },
};

module.exports = {
  defaultReminderSettings,
  reminderSettingsRepository,
};
