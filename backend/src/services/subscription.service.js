const { subscriptionRepository } = require("../repositories/subscription.repository");
const { AppError } = require("../utils/appError");
const { buildSubscriptionSummary } = require("./subscription-summary.service");

const normalizeSubscriptionInput = (input) => {
  const data = { ...input };

  if (input.amount !== undefined) {
    data.amount = input.amount.toString();
  }

  if (input.renewalDate !== undefined) {
    data.renewalDate = new Date(input.renewalDate);
  }

  if (input.trialEndsAt !== undefined) {
    data.trialEndsAt = input.trialEndsAt ? new Date(input.trialEndsAt) : null;
  }

  return data;
};

const serializeSubscription = (subscription) => ({
  ...subscription,
  amount: Number(subscription.amount),
  renewalDate: subscription.renewalDate?.toISOString?.() || subscription.renewalDate,
  trialEndsAt: subscription.trialEndsAt?.toISOString?.() || subscription.trialEndsAt || null,
  createdAt: subscription.createdAt?.toISOString?.() || subscription.createdAt,
  updatedAt: subscription.updatedAt?.toISOString?.() || subscription.updatedAt,
});

const subscriptionService = {
  async list(userId, filters) {
    const subscriptions = await subscriptionRepository.listByUser(userId, filters);

    return subscriptions.map(serializeSubscription);
  },

  async getById(userId, subscriptionId) {
    const subscription = await subscriptionRepository.findByIdForUser(subscriptionId, userId);

    if (!subscription) {
      throw new AppError("Subscription not found", 404);
    }

    return serializeSubscription(subscription);
  },

  async getSummary(userId) {
    const subscriptions = await subscriptionRepository.listByUser(userId);
    const summary = buildSubscriptionSummary(subscriptions);

    return {
      ...summary,
      upcomingRenewals: summary.upcomingRenewals.map(serializeSubscription),
    };
  },

  async create(userId, input) {
    const subscription = await subscriptionRepository.create({
      ...normalizeSubscriptionInput(input),
      userId,
      source: "manual",
    });

    return serializeSubscription(subscription);
  },

  async update(userId, subscriptionId, input) {
    const subscription = await subscriptionRepository.findByIdForUser(subscriptionId, userId);

    if (!subscription) {
      throw new AppError("Subscription not found", 404);
    }

    const updatedSubscription = await subscriptionRepository.update(
      subscriptionId,
      normalizeSubscriptionInput(input),
    );

    return serializeSubscription(updatedSubscription);
  },

  async remove(userId, subscriptionId) {
    const subscription = await subscriptionRepository.findByIdForUser(subscriptionId, userId);

    if (!subscription) {
      throw new AppError("Subscription not found", 404);
    }

    await subscriptionRepository.delete(subscriptionId);

    return { id: subscriptionId };
  },
};

module.exports = {
  subscriptionService,
};
