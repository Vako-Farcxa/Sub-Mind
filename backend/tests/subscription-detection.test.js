const {
  detectSubscriptionFromMessage,
  detectSubscriptionsFromMessages,
  extractPrice,
  inferBillingCycle,
} = require("../src/services/subscription-detection.service");

const providerCatalog = [
  {
    name: "Netflix",
    category: "Entertainment",
    confidenceWeight: 30,
    aliases: [{ value: "netflix" }],
    domains: [{ domain: "netflix.com" }],
  },
  {
    name: "YouTube Premium",
    category: "Entertainment",
    confidenceWeight: 30,
    aliases: [{ value: "youtube premium" }, { value: "youtube" }, { value: "google youtube" }],
    domains: [{ domain: "youtube.com" }],
  },
];

describe("subscription detection engine", () => {
  it("extracts common currency amounts", () => {
    expect(extractPrice("Your plan renewed for $19.99")).toEqual({
      amount: 19.99,
      currency: "USD",
    });
    expect(extractPrice("Invoice total USD 12.00")).toEqual({
      amount: 12,
      currency: "USD",
    });
  });

  it("infers billing cycles from email language", () => {
    expect(inferBillingCycle("Your annual subscription renewed")).toBe("YEARLY");
    expect(inferBillingCycle("You will be billed monthly")).toBe("MONTHLY");
    expect(inferBillingCycle("Your free trial started")).toBe("TRIAL");
  });

  it("detects known providers with confidence scoring", () => {
    const detection = detectSubscriptionFromMessage(
      {
        id: "gmail-message-1",
        sender: "Netflix <billing@netflix.com>",
        subject: "Your Netflix subscription renewed",
        snippet: "Your monthly membership payment received for $15.49.",
        date: "Tue, 19 May 2026 12:00:00 +0000",
      },
      providerCatalog,
    );

    expect(detection).toMatchObject({
      provider: "Netflix",
      name: "Netflix",
      category: "Entertainment",
      amount: 15.49,
      billingCycle: "MONTHLY",
      currency: "USD",
      rawEmailId: "gmail-message-1",
    });
    expect(detection.confidenceScore).toBeGreaterThanOrEqual(80);
    expect(detection.renewalDate).toBeInstanceOf(Date);
  });

  it("does not classify third-party Google Play subscriptions as YouTube Premium", () => {
    const detection = detectSubscriptionFromMessage(
      {
        id: "gmail-message-google-play-setanta",
        sender: "Google Play <googleplay-noreply@google.com>",
        subject: "Your Setanta Sports: Sports TV App subscription will be canceled",
        snippet:
          "Your subscription will be canceled. You can resubscribe to Setanta Sports: Sports TV App on Google Play.",
        date: "Tue, 19 May 2026 12:00:00 +0000",
      },
      providerCatalog,
    );

    expect(detection).toMatchObject({
      provider: "Setanta Sports",
      name: "Setanta Sports",
      category: "Other",
      billingCycle: "MONTHLY",
      rawEmailId: "gmail-message-google-play-setanta",
    });
    expect(detection.provider).not.toBe("YouTube Premium");
  });

  it("uses catalog aliases without requiring code-level provider constants", () => {
    const detection = detectSubscriptionFromMessage(
      {
        id: "message-custom-provider",
        sender: "Billing <billing@example-subscription.test>",
        subject: "Your Example Stream subscription renewed",
        snippet: "Your monthly subscription renewed for $8.99.",
        date: "Tue, 19 May 2026 12:00:00 +0000",
      },
      [
        {
          name: "Example Stream",
          category: "Entertainment",
          confidenceWeight: 35,
          aliases: [{ value: "example stream" }],
          domains: [],
        },
      ],
    );

    expect(detection).toMatchObject({
      provider: "Example Stream",
      category: "Entertainment",
      amount: 8.99,
    });
  });

  it("filters messages that do not meet the confidence threshold", () => {
    const detections = detectSubscriptionsFromMessages(
      [
        {
          id: "message-1",
          sender: "Friend <friend@example.com>",
          subject: "Lunch tomorrow",
          snippet: "See you then",
        },
      ],
      providerCatalog,
    );

    expect(detections).toEqual([]);
  });
});
