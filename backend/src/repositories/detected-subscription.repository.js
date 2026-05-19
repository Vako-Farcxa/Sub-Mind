const { getPrisma } = require("../db/prisma");

const detectedSubscriptionRepository = {
  listByUser(userId, filters = {}) {
    const prisma = getPrisma();
    const stateFilter =
      filters.state === "confirmed"
        ? { confirmedAt: { not: null } }
        : filters.state === "dismissed"
          ? { dismissedAt: { not: null } }
          : filters.state === "all"
            ? {}
            : { confirmedAt: null, dismissedAt: null };

    return prisma.detectedSubscription.findMany({
      where: {
        userId,
        ...stateFilter,
      },
      orderBy: [{ confidenceScore: "desc" }, { createdAt: "desc" }],
      take: filters.limit || 25,
    });
  },

  findByIdForUser(id, userId) {
    const prisma = getPrisma();

    return prisma.detectedSubscription.findFirst({
      where: { id, userId },
    });
  },

  upsertDetection(data) {
    const prisma = getPrisma();

    return prisma.detectedSubscription.upsert({
      where: {
        userId_rawEmailId: {
          userId: data.userId,
          rawEmailId: data.rawEmailId,
        },
      },
      update: {
        emailScanId: data.emailScanId,
        provider: data.provider,
        name: data.name,
        category: data.category,
        amount: data.amount,
        billingCycle: data.billingCycle,
        currency: data.currency,
        renewalDate: data.renewalDate,
        sender: data.sender,
        subject: data.subject,
        confidenceScore: data.confidenceScore,
        dismissedAt: null,
      },
      create: data,
    });
  },

  markConfirmed(id) {
    const prisma = getPrisma();

    return prisma.detectedSubscription.update({
      where: { id },
      data: { confirmedAt: new Date() },
    });
  },

  markDismissed(id) {
    const prisma = getPrisma();

    return prisma.detectedSubscription.update({
      where: { id },
      data: { dismissedAt: new Date() },
    });
  },
};

module.exports = {
  detectedSubscriptionRepository,
};
