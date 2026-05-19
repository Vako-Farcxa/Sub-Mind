const { google } = require("googleapis");
const { env } = require("../../config/env");
const { AppError } = require("../../utils/appError");

const createGoogleOAuthClient = () => {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REDIRECT_URI) {
    throw new AppError("Google OAuth is not configured", 500);
  }

  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI,
  );
};

module.exports = {
  createGoogleOAuthClient,
};
