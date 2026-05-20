const ACTIVE_STATUSES = new Set(["ACTIVE", "TRIALING"]);
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const normalizeSettings = (settings) => ({
  enabled: settings?.enabled ?? true,
  daysBefore: settings?.daysBefore ?? 3,
  emailEnabled: settings?.emailEnabled ?? true,
  telegramEnabled: settings?.telegramEnabled ?? false,
  telegramChatId: settings?.telegramChatId ?? null,
});

const buildReminderWindow = (settings, now = new Date()) => {
  const normalizedSettings = normalizeSettings(settings);
  const windowStart = new Date(now);
  const windowEnd = new Date(now.getTime() + normalizedSettings.daysBefore * DAY_IN_MS);

  return {
    windowStart,
    windowEnd,
  };
};

const getReminderChannels = (settings) => {
  const normalizedSettings = normalizeSettings(settings);
  const channels = ["IN_APP"];

  if (normalizedSettings.emailEnabled) {
    channels.push("EMAIL");
  }

  if (normalizedSettings.telegramEnabled && normalizedSettings.telegramChatId) {
    channels.push("TELEGRAM");
  }

  return channels;
};

const buildReminderMessage = (subscription, settings) => {
  const normalizedSettings = normalizeSettings(settings);
  const renewalDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(subscription.renewalDate));

  return {
    title: `${subscription.name} renews soon`,
    message: `${subscription.name} renews on ${renewalDate}. Reminder window: ${normalizedSettings.daysBefore} day(s) before renewal.`,
  };
};

const buildReminderNotificationsForSubscription = (subscription, now = new Date()) => {
  if (!ACTIVE_STATUSES.has(subscription.status)) {
    return [];
  }

  const settings = normalizeSettings(subscription.user?.reminderSettings);

  if (!settings.enabled) {
    return [];
  }

  const renewalDate = new Date(subscription.renewalDate);
  const { windowStart, windowEnd } = buildReminderWindow(settings, now);

  if (renewalDate < windowStart || renewalDate > windowEnd) {
    return [];
  }

  const { title, message } = buildReminderMessage(subscription, settings);

  return getReminderChannels(settings).map((channel) => ({
    userId: subscription.userId,
    subscriptionId: subscription.id,
    channel,
    title,
    message,
    scheduledFor: windowStart,
    metadata: {
      renewalDate: renewalDate.toISOString(),
      provider: subscription.provider,
      amount: Number(subscription.amount ?? 0),
      currency: subscription.currency,
    },
  }));
};

module.exports = {
  buildReminderMessage,
  buildReminderNotificationsForSubscription,
  buildReminderWindow,
  getReminderChannels,
  normalizeSettings,
};
