const { notificationRepository } = require("../repositories/notification.repository");
const { subscriptionRepository } = require("../repositories/subscription.repository");
const { AppError } = require("../utils/appError");
const { deliverNotification } = require("./notification-delivery.service");
const { buildReminderNotificationsForSubscription } = require("./reminder-planner.service");

const serializeNotification = (notification) => ({
  ...notification,
  scheduledFor: notification.scheduledFor?.toISOString?.() || notification.scheduledFor,
  sentAt: notification.sentAt?.toISOString?.() || notification.sentAt || null,
  createdAt: notification.createdAt?.toISOString?.() || notification.createdAt,
  updatedAt: notification.updatedAt?.toISOString?.() || notification.updatedAt,
  subscription: notification.subscription
    ? {
        ...notification.subscription,
        amount: Number(notification.subscription.amount),
        renewalDate:
          notification.subscription.renewalDate?.toISOString?.() ||
          notification.subscription.renewalDate,
      }
    : null,
});

const notificationService = {
  async listForUser(userId, { limit } = {}) {
    const notifications = await notificationRepository.listByUser(
      userId,
      Math.min(Number(limit) || 25, 50),
    );

    return notifications.map(serializeNotification);
  },

  async createReminderNotifications(now = new Date()) {
    const maxDaysBefore = 30;
    const endDate = new Date(now.getTime() + maxDaysBefore * 24 * 60 * 60 * 1000);
    const subscriptions = await subscriptionRepository.listRenewingBetween(now, endDate);
    const plannedNotifications = subscriptions.flatMap((subscription) =>
      buildReminderNotificationsForSubscription(subscription, now),
    );
    const notifications = await Promise.all(
      plannedNotifications.map((notification) => notificationRepository.upsert(notification)),
    );

    return notifications.map(serializeNotification);
  },

  async sendDueNotifications(now = new Date()) {
    const dueNotifications = await notificationRepository.listDue(now);
    const results = [];

    for (const notification of dueNotifications) {
      try {
        await deliverNotification(notification);
        const sentNotification = await notificationRepository.markSent(notification.id);
        results.push({ notification: serializeNotification(sentNotification), delivered: true });
      } catch (error) {
        const failedNotification = await notificationRepository.markFailed(
          notification.id,
          error.message || "Notification delivery failed",
        );
        results.push({
          notification: serializeNotification(failedNotification),
          delivered: false,
          error: error.message,
        });
      }
    }

    return results;
  },

  async runReminderCycle(now = new Date()) {
    const planned = await this.createReminderNotifications(now);
    const deliveryResults = await this.sendDueNotifications(now);

    return {
      plannedCount: planned.length,
      attemptedCount: deliveryResults.length,
      deliveredCount: deliveryResults.filter((result) => result.delivered).length,
      failedCount: deliveryResults.filter((result) => !result.delivered).length,
    };
  },

  async markRead(userId, notificationId) {
    const result = await notificationRepository.markReadForUser(notificationId, userId);

    if (result.count === 0) {
      throw new AppError("Notification not found", 404);
    }

    return { id: notificationId, read: true };
  },
};

module.exports = {
  notificationService,
  serializeNotification,
};
