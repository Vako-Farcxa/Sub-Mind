const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const buildHelmetMiddleware = () =>
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  });

const buildApiRateLimiter = () =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  });

module.exports = {
  buildApiRateLimiter,
  buildHelmetMiddleware,
};
