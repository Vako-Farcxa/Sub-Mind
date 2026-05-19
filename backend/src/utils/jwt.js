const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { AppError } = require("./appError");

const getSecret = (secret, name) => {
  if (!secret) {
    throw new AppError(`${name} is not configured`, 500);
  }

  return secret;
};

const signAccessToken = (payload) =>
  jwt.sign(payload, getSecret(env.JWT_ACCESS_SECRET, "JWT_ACCESS_SECRET"), {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

const signRefreshToken = (payload) =>
  jwt.sign(payload, getSecret(env.JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET"), {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

const verifyAccessToken = (token) =>
  jwt.verify(token, getSecret(env.JWT_ACCESS_SECRET, "JWT_ACCESS_SECRET"));

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
};
