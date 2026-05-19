const { env } = require("../config/env");
const { createEmailTransporter, isEmailConfigured } = require("../integrations/email/email.client");
const {
  isTelegramConfigured,
  sendTelegramMessage,
} = require("../integrations/telegram/telegram.client");
const { AppError } = require("../utils/appError");

const escapeHtml = (value = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const sendEmailNotification = async (notification) => {
  if (!isEmailConfigured()) {
    throw new AppError("SMTP email is not configured", 500);
  }

  const transporter = createEmailTransporter();

  return transporter.sendMail({
    from: env.SMTP_FROM,
    to: notification.user.email,
    subject: notification.title,
    text: notification.message,
    html: `<p>${escapeHtml(notification.message)}</p>`,
  });
};

const sendTelegramNotification = async (notification) => {
  if (!isTelegramConfigured()) {
    throw new AppError("Telegram bot token is not configured", 500);
  }

  return sendTelegramMessage({
    chatId: notification.user.reminderSettings?.telegramChatId,
    text: `<b>${escapeHtml(notification.title)}</b>\n${escapeHtml(notification.message)}`,
  });
};

const deliverNotification = async (notification) => {
  switch (notification.channel) {
    case "IN_APP":
      return { skippedExternalDelivery: true };
    case "EMAIL":
      return sendEmailNotification(notification);
    case "TELEGRAM":
      return sendTelegramNotification(notification);
    default:
      throw new AppError(`Unsupported notification channel: ${notification.channel}`, 500);
  }
};

module.exports = {
  deliverNotification,
  escapeHtml,
};
