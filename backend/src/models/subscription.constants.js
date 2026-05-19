const BILLING_CYCLES = Object.freeze({
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
  TRIAL: "TRIAL",
});

const SUBSCRIPTION_STATUSES = Object.freeze({
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  TRIALING: "TRIALING",
});

const KNOWN_PROVIDERS = Object.freeze([
  "Netflix",
  "Spotify",
  "YouTube Premium",
  "ChatGPT Plus",
  "Adobe",
  "Canva",
  "Amazon Prime",
  "Notion",
  "GitHub Copilot",
  "Apple",
  "Google One",
  "Microsoft 365",
]);

module.exports = {
  BILLING_CYCLES,
  KNOWN_PROVIDERS,
  SUBSCRIPTION_STATUSES,
};
