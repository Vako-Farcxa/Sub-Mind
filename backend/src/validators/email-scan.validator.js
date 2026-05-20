const { z } = require("zod");

const listEmailScansSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    limit: z.coerce.number().int().positive().max(25).optional(),
  }),
});

const getEmailScanSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const createEmailScanSchema = z.object({
  body: z
    .object({
      maxResults: z.coerce.number().int().positive().max(500).optional(),
      newerThanDays: z.coerce.number().int().positive().max(365).optional(),
    })
    .default({}),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = {
  createEmailScanSchema,
  getEmailScanSchema,
  listEmailScansSchema,
};
