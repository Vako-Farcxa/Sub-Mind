const DETECTION_KEYWORDS = [
  "subscription",
  "renewal",
  "renewed",
  "invoice",
  "receipt",
  "membership",
  "payment received",
  "trial",
  "billed",
  "charged",
];

const MIN_CONFIDENCE_SCORE = 50;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseSenderDomain = (sender = "") => {
  const emailMatch = sender.match(/@([a-z0-9.-]+\.[a-z]{2,})/i);

  if (emailMatch) {
    return emailMatch[1].toLowerCase();
  }

  const domainMatch = sender.match(/\b([a-z0-9.-]+\.[a-z]{2,})\b/i);
  return domainMatch?.[1]?.toLowerCase() || "";
};

const toCatalogValues = (values = [], key = "value") =>
  values.map((item) => (typeof item === "string" ? item : item[key])).filter(Boolean);

const inferProvider = ({ sender = "", subject = "", snippet = "" }, providerCatalog = []) => {
  const senderDomain = parseSenderDomain(sender);
  const content = `${sender} ${subject} ${snippet}`.toLowerCase();

  return providerCatalog.find((provider) => {
    const domains = toCatalogValues(provider.domains, "domain").map((domain) =>
      domain.toLowerCase(),
    );
    const aliases = toCatalogValues(provider.aliases, "value").map((alias) => alias.toLowerCase());

    return (
      domains.some((domain) => senderDomain.endsWith(domain)) ||
      aliases.some((alias) => content.includes(alias))
    );
  });
};

const inferMarketplaceProviderName = ({ sender = "", subject = "" }) => {
  const senderDomain = parseSenderDomain(sender);
  const isGooglePlayReceipt = senderDomain === "google.com" && /google play/i.test(sender);

  if (!isGooglePlayReceipt) {
    return null;
  }

  const match = subject.match(/^Your\s+(.+?)\s+subscription\b/i);
  const providerName = match?.[1]?.replace(/\s*:\s*.+$/, "").trim();

  return providerName || null;
};

const inferFallbackProviderName = ({ sender = "", subject = "" }) => {
  const marketplaceProvider = inferMarketplaceProviderName({ sender, subject });

  if (marketplaceProvider) {
    return marketplaceProvider;
  }

  const domain = parseSenderDomain(sender);

  if (!domain) {
    return "Unknown provider";
  }

  const [name] = domain.split(".");
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const extractPrice = (content) => {
  const currencySymbols = {
    $: "USD",
    "€": "EUR",
    "£": "GBP",
  };
  const symbolPattern = new RegExp(
    `([${Object.keys(currencySymbols).map(escapeRegex).join("")}])\\s?(\\d+(?:[.,]\\d{2})?)`,
  );
  const symbolMatch = content.match(symbolPattern);

  if (symbolMatch) {
    return {
      amount: Number(symbolMatch[2].replace(",", ".")),
      currency: currencySymbols[symbolMatch[1]],
    };
  }

  const codeMatch = content.match(/\b(USD|EUR|GBP|CAD|AUD)\s?(\d+(?:[.,]\d{2})?)\b/i);

  if (codeMatch) {
    return {
      amount: Number(codeMatch[2].replace(",", ".")),
      currency: codeMatch[1].toUpperCase(),
    };
  }

  return {
    amount: null,
    currency: null,
  };
};

const inferBillingCycle = (content) => {
  if (/\b(trial|free trial)\b/i.test(content)) {
    return "TRIAL";
  }

  if (/\b(weekly|per week|\/week|week)\b/i.test(content)) {
    return "WEEKLY";
  }

  if (/\b(annual|annually|yearly|per year|\/year|year)\b/i.test(content)) {
    return "YEARLY";
  }

  if (/\b(monthly|per month|\/month|month)\b/i.test(content)) {
    return "MONTHLY";
  }

  if (/\b(subscription|renewal|renewed|membership|billed|charged)\b/i.test(content)) {
    return "MONTHLY";
  }

  return null;
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const inferRenewalDate = (messageDate, billingCycle) => {
  const baseDate = messageDate ? new Date(messageDate) : new Date();

  if (Number.isNaN(baseDate.getTime()) || !billingCycle) {
    return null;
  }

  switch (billingCycle) {
    case "WEEKLY":
      return addDays(baseDate, 7);
    case "MONTHLY":
      return addDays(baseDate, 30);
    case "YEARLY":
      return addDays(baseDate, 365);
    case "TRIAL":
      return addDays(baseDate, 7);
    default:
      return null;
  }
};

const getMatchedKeywords = (content) =>
  DETECTION_KEYWORDS.filter((keyword) => content.includes(keyword));

const scoreDetection = ({
  provider,
  amount,
  billingCycle,
  renewalDate,
  senderDomain,
  matchedKeywords,
}) => {
  let score = 0;

  if (provider) score += provider.confidenceWeight || 30;
  if (senderDomain) score += 10;
  if (matchedKeywords.length > 0) score += Math.min(25, matchedKeywords.length * 8);
  if (amount) score += 15;
  if (billingCycle) score += 10;
  if (renewalDate) score += 10;

  return Math.min(score, 99);
};

const detectSubscriptionFromMessage = (message, providerCatalog = []) => {
  const content =
    `${message.sender || ""} ${message.subject || ""} ${message.snippet || ""}`.toLowerCase();
  const provider = inferProvider(message, providerCatalog);
  const marketplaceProviderName = inferMarketplaceProviderName(message);
  const senderDomain = parseSenderDomain(message.sender);
  const matchedKeywords = getMatchedKeywords(content);

  if (!provider && matchedKeywords.length === 0) {
    return null;
  }

  const { amount, currency } = extractPrice(content);
  const billingCycle = inferBillingCycle(content);
  const renewalDate = inferRenewalDate(message.date, billingCycle);
  const confidenceScore = scoreDetection({
    provider: provider || marketplaceProviderName,
    amount,
    billingCycle,
    renewalDate,
    senderDomain,
    matchedKeywords,
  });

  if (confidenceScore < MIN_CONFIDENCE_SCORE) {
    return null;
  }
  const fallbackProviderName = marketplaceProviderName || inferFallbackProviderName(message);

  return {
    provider: provider?.name || fallbackProviderName,
    name: provider?.name || fallbackProviderName,
    category: provider?.category || "Other",
    amount,
    billingCycle,
    currency: currency || "USD",
    renewalDate,
    sender: message.sender || "",
    subject: message.subject || "",
    confidenceScore,
    rawEmailId: message.id,
  };
};

const detectSubscriptionsFromMessages = (messages, providerCatalog = []) =>
  messages
    .map((message) => detectSubscriptionFromMessage(message, providerCatalog))
    .filter(Boolean);

module.exports = {
  detectSubscriptionFromMessage,
  detectSubscriptionsFromMessages,
  extractPrice,
  inferBillingCycle,
  inferRenewalDate,
  inferMarketplaceProviderName,
  parseSenderDomain,
};
