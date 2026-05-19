const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const { env } = require("./config/env");
const { buildApiRateLimiter, buildHelmetMiddleware } = require("./config/security");
const { errorMiddleware, notFoundMiddleware } = require("./middleware/error.middleware");
const { apiRoutes } = require("./routes");

const app = express();

app.disable("x-powered-by");

app.use(buildHelmetMiddleware());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(buildApiRateLimiter());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.use("/api", apiRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = {
  app,
};
