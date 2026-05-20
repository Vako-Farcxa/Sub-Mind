const SUBSCRIPTION_EMAIL_TERMS = [
  "subscription",
  "renewal",
  "invoice",
  "receipt",
  "membership",
  "payment received",
  "subscription renewed",
  "trial",
];

const DEFAULT_SCAN_DAYS = 90;
const DEFAULT_MAX_RESULTS = 10;
const MAX_SCAN_RESULTS = 500;

const normalizeScanOptions = ({ maxResults, newerThanDays } = {}) => ({
  maxResults: Math.min(Math.max(Number(maxResults) || DEFAULT_MAX_RESULTS, 1), MAX_SCAN_RESULTS),
  newerThanDays: Math.min(Math.max(Number(newerThanDays) || DEFAULT_SCAN_DAYS, 1), 365),
});

const buildSubscriptionSearchQuery = (options = {}) => {
  const { newerThanDays } = normalizeScanOptions(options);
  const terms = SUBSCRIPTION_EMAIL_TERMS.map((term) => `"${term}"`).join(" OR ");

  return `newer_than:${newerThanDays}d (${terms})`;
};

const getHeader = (headers = [], name) =>
  headers.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value || "";

const extractMessagePreview = (message) => {
  const headers = message.payload?.headers || [];

  return {
    id: message.id,
    threadId: message.threadId,
    snippet: message.snippet || "",
    sender: getHeader(headers, "From"),
    subject: getHeader(headers, "Subject"),
    date: getHeader(headers, "Date"),
  };
};

module.exports = {
  buildSubscriptionSearchQuery,
  extractMessagePreview,
  normalizeScanOptions,
};
