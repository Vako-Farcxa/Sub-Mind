const { z } = require("zod");

const updateReminderSettingsSchema = z.object({
  body: z.object({
    enabled: z.boolean().optional(),
    daysBefore: z.coerce.number().int().min(1).max(30).optional(),
    emailEnabled: z.boolean().optional(),
    telegramEnabled: z.boolean().optional(),
    telegramChatId: z.string().trim().max(120).nullable().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = {
  updateReminderSettingsSchema,
};
