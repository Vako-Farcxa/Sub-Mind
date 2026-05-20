const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1).optional(),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  CORS_ORIGINS: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(32).optional(),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).optional(),
  COOKIE_SECURE: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  REMINDER_JOB_ENABLED: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .default("true"),
  REMINDER_JOB_CRON: z.string().default("*/15 * * * *"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
});

const productionRequiredKeys = [
  "DATABASE_URL",
  "FRONTEND_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REDIRECT_URI",
];

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid environment configuration: ${issues.join(", ")}`);
}

if (parsedEnv.data.NODE_ENV === "production") {
  const missingKeys = productionRequiredKeys.filter((key) => !parsedEnv.data[key]);

  if (missingKeys.length > 0) {
    throw new Error(`Missing required production environment variables: ${missingKeys.join(", ")}`);
  }
}

const getCorsOrigins = () => {
  const configuredOrigins = parsedEnv.data.CORS_ORIGINS
    ? parsedEnv.data.CORS_ORIGINS.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];

  return [...new Set([parsedEnv.data.FRONTEND_URL, ...configuredOrigins])];
};

module.exports = {
  corsOrigins: getCorsOrigins(),
  env: parsedEnv.data,
};
