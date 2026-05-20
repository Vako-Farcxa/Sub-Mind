const { z } = require("zod");

const billingCycles = ["WEEKLY", "MONTHLY", "YEARLY", "TRIAL"];
const subscriptionStatuses = ["ACTIVE", "PAUSED", "CANCELLED", "EXPIRED", "TRIALING"];

const listDetectedSubscriptionsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    state: z.enum(["pending", "confirmed", "dismissed", "all"]).default("pending"),
    limit: z.coerce.number().int().positive().max(50).optional(),
  }),
});

const detectedSubscriptionParamsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const confirmDetectedSubscriptionSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).max(120).optional(),
      provider: z.string().trim().min(1).max(120).optional(),
      category: z.string().trim().min(1).max(80).optional(),
      amount: z.coerce.number().positive().optional(),
      billingCycle: z.enum(billingCycles).optional(),
      currency: z
        .string()
        .trim()
        .length(3)
        .transform((value) => value.toUpperCase())
        .optional(),
      renewalDate: z.string().datetime().optional(),
      status: z.enum(subscriptionStatuses).optional(),
    })
    .default({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  confirmDetectedSubscriptionSchema,
  detectedSubscriptionParamsSchema,
  listDetectedSubscriptionsSchema,
};
