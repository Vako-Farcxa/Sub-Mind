const nodemailer = require("nodemailer");
const { env } = require("../../config/env");
const { AppError } = require("../../utils/appError");

const isEmailConfigured = () =>
  Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS && env.SMTP_FROM);

const createEmailTransporter = () => {
  if (!isEmailConfigured()) {
    throw new AppError("SMTP email is not configured", 500);
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

module.exports = {
  createEmailTransporter,
  isEmailConfigured,
};
