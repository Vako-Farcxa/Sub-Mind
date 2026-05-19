const { getPrisma } = require("../db/prisma");

const notificationRepository = {
  listByUser(userId, limit = 25) {
    const prisma = getPrisma();

    return prisma.notification.findMany({
      where: { userId },
      orderBy: [{ scheduledFor: "desc" }, { createdAt: "desc" }],
      take: limit,
      include: {
        subscription: true,
      },
    });
  },

  listDue(now = new Date(), limit = 50) {
    const prisma = getPrisma();

    return prisma.notification.findMany({
      where: {
        status: "PENDING",
        scheduledFor: {
          lte: now,
        },
      },
      orderBy: [{ scheduledFor: "asc" }],
      take: limit,
      include: {
        user: {
          include: {
            reminderSettings: true,
          },
        },
        subscription: true,
      },
    });
  },

  upsert(data) {
    const prisma = getPrisma();

    return prisma.notification.upsert({
      where: {
        userId_subscriptionId_channel_scheduledFor: {
          userId: data.userId,
          subscriptionId: data.subscriptionId,
          channel: data.channel,
          scheduledFor: data.scheduledFor,
        },
      },
      update: {
        title: data.title,
        message: data.message,
        metadata: data.metadata,
      },
      create: data,
    });
  },

  markSent(id) {
    const prisma = getPrisma();

    return prisma.notification.update({
      where: { id },
      data: {
        status: "SENT",
        sentAt: new Date(),
        failureReason: null,
      },
    });
  },

  markFailed(id, failureReason) {
    const prisma = getPrisma();

    return prisma.notification.update({
      where: { id },
      data: {
        status: "FAILED",
        failureReason,
      },
    });
  },

  markReadForUser(id, userId) {
    const prisma = getPrisma();

    return prisma.notification.updateMany({
      where: { id, userId },
      data: {
        status: "READ",
      },
    });
  },
};

module.exports = {
  notificationRepository,
};
