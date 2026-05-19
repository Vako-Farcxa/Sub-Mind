const {
  buildReminderNotificationsForSubscription,
  getReminderChannels,
  normalizeSettings,
} = require("../src/services/reminder-planner.service");

const baseSubscription = {
  id: "subscription-id",
  userId: "user-id",
  name: "Netflix",
  provider: "Netflix",
  amount: 15.49,
  currency: "USD",
  status: "ACTIVE",
  renewalDate: new Date("2026-05-22T00:00:00.000Z"),
  user: {
    reminderSettings: {
      enabled: true,
      daysBefore: 3,
      emailEnabled: true,
      telegramEnabled: true,
      telegramChatId: "12345",
    },
  },
};

describe("reminder planner", () => {
  it("normalizes missing settings to safe defaults", () => {
    expect(normalizeSettings(null)).toEqual({
      enabled: true,
      daysBefore: 3,
      emailEnabled: true,
      telegramEnabled: false,
      telegramChatId: null,
    });
  });

  it("builds channels based on settings", () => {
    expect(getReminderChannels(baseSubscription.user.reminderSettings)).toEqual([
      "IN_APP",
      "EMAIL",
      "TELEGRAM",
    ]);
  });

  it("creates reminder notifications for renewals inside the configured window", () => {
    const notifications = buildReminderNotificationsForSubscription(
      baseSubscription,
      new Date("2026-05-19T00:00:00.000Z"),
    );

    expect(notifications).toHaveLength(3);
    expect(notifications[0]).toMatchObject({
      userId: "user-id",
      subscriptionId: "subscription-id",
      channel: "IN_APP",
      title: "Netflix renews soon",
    });
  });

  it("skips disabled settings and out-of-window renewals", () => {
    expect(
      buildReminderNotificationsForSubscription({
        ...baseSubscription,
        user: { reminderSettings: { enabled: false } },
      }),
    ).toEqual([]);
    expect(
      buildReminderNotificationsForSubscription(
        { ...baseSubscription, renewalDate: new Date("2026-06-30T00:00:00.000Z") },
        new Date("2026-05-19T00:00:00.000Z"),
      ),
    ).toEqual([]);
  });
});
