const { subscriptionRepository } = require("../repositories/subscription.repository");
const { AppError } = require("../utils/appError");

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

const subscriptionService = {
  list(userId, filters) {
    return subscriptionRepository.listByUser(userId, filters);
  },

  async create(userId, input) {
    return subscriptionRepository.create({
      ...normalizeSubscriptionInput(input),
      userId,
      source: "manual",
    });
  },

  async update(userId, subscriptionId, input) {
    const subscription = await subscriptionRepository.findByIdForUser(subscriptionId, userId);

    if (!subscription) {
      throw new AppError("Subscription not found", 404);
    }

    return subscriptionRepository.update(subscriptionId, normalizeSubscriptionInput(input));
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
