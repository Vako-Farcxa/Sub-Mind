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

const KNOWN_PROVIDER_PATTERNS = Object.freeze([
  {
    name: "Netflix",
    category: "Entertainment",
    aliases: ["netflix"],
    domains: ["netflix.com"],
  },
  {
    name: "Spotify",
    category: "Entertainment",
    aliases: ["spotify"],
    domains: ["spotify.com"],
  },
  {
    name: "YouTube Premium",
    category: "Entertainment",
    aliases: ["youtube premium", "youtube", "google youtube"],
    domains: ["youtube.com"],
  },
  {
    name: "ChatGPT Plus",
    category: "AI tools",
    aliases: ["chatgpt", "openai", "chatgpt plus"],
    domains: ["openai.com"],
  },
  {
    name: "Adobe",
    category: "Productivity",
    aliases: ["adobe", "creative cloud"],
    domains: ["adobe.com"],
  },
  {
    name: "Canva",
    category: "Productivity",
    aliases: ["canva"],
    domains: ["canva.com"],
  },
  {
    name: "Amazon Prime",
    category: "Entertainment",
    aliases: ["amazon prime", "prime membership"],
    domains: ["amazon.com"],
  },
  {
    name: "Notion",
    category: "Productivity",
    aliases: ["notion"],
    domains: ["notion.so"],
  },
  {
    name: "GitHub Copilot",
    category: "AI tools",
    aliases: ["github copilot", "copilot", "github"],
    domains: ["github.com"],
  },
  {
    name: "Apple",
    category: "Entertainment",
    aliases: ["apple", "icloud", "apple one"],
    domains: ["apple.com"],
  },
  {
    name: "Google One",
    category: "Cloud storage",
    aliases: ["google one", "google storage"],
    domains: [],
  },
  {
    name: "Microsoft 365",
    category: "Productivity",
    aliases: ["microsoft 365", "office 365", "microsoft"],
    domains: ["microsoft.com"],
  },
]);

module.exports = {
  BILLING_CYCLES,
  KNOWN_PROVIDERS,
  KNOWN_PROVIDER_PATTERNS,
  SUBSCRIPTION_STATUSES,
};
