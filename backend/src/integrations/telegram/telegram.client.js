const { env } = require("../../config/env");
const { AppError } = require("../../utils/appError");

const isTelegramConfigured = () => Boolean(env.TELEGRAM_BOT_TOKEN);

const sendTelegramMessage = async ({ chatId, text }) => {
  if (!isTelegramConfigured()) {
    throw new AppError("Telegram bot token is not configured", 500);
  }

  if (!chatId) {
    throw new AppError("Telegram chat id is not configured", 422);
  }

  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new AppError(`Telegram send failed: ${body}`, 502);
  }

  return response.json();
};

module.exports = {
  isTelegramConfigured,
  sendTelegramMessage,
};
