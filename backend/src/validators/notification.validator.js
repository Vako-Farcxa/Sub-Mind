const { z } = require("zod");

const listNotificationsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    limit: z.coerce.number().int().positive().max(50).optional(),
  }),
});

const notificationParamsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  listNotificationsSchema,
  notificationParamsSchema,
};
