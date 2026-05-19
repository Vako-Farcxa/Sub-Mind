const { z } = require("zod");

const billingCycles = ["WEEKLY", "MONTHLY", "YEARLY", "TRIAL"];
const subscriptionStatuses = ["ACTIVE", "PAUSED", "CANCELLED", "EXPIRED", "TRIALING"];

const subscriptionBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  provider: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(80),
  amount: z.coerce.number().positive(),
  billingCycle: z.enum(billingCycles),
  currency: z
    .string()
    .trim()
    .length(3)
    .transform((value) => value.toUpperCase())
    .default("USD"),
  renewalDate: z.string().datetime(),
  trialEndsAt: z.string().datetime().nullable().optional(),
  status: z.enum(subscriptionStatuses).default("ACTIVE"),
});

const listSubscriptionsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    status: z.enum(subscriptionStatuses).optional(),
    category: z.string().trim().min(1).max(80).optional(),
  }),
});

const createSubscriptionSchema = z.object({
  body: subscriptionBodySchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateSubscriptionSchema = z.object({
  body: subscriptionBodySchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one subscription field is required",
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const deleteSubscriptionSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  createSubscriptionSchema,
  deleteSubscriptionSchema,
  listSubscriptionsSchema,
  updateSubscriptionSchema,
};
