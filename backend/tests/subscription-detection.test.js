const {
  detectSubscriptionFromMessage,
  detectSubscriptionsFromMessages,
  extractPrice,
  inferBillingCycle,
} = require("../src/services/subscription-detection.service");

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
    const detection = detectSubscriptionFromMessage({
      id: "gmail-message-1",
      sender: "Netflix <billing@netflix.com>",
      subject: "Your Netflix subscription renewed",
      snippet: "Your monthly membership payment received for $15.49.",
      date: "Tue, 19 May 2026 12:00:00 +0000",
    });

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
    const detection = detectSubscriptionFromMessage({
      id: "gmail-message-google-play-setanta",
      sender: "Google Play <googleplay-noreply@google.com>",
      subject: "Your Setanta Sports: Sports TV App subscription will be canceled",
      snippet:
        "Your subscription will be canceled. You can resubscribe to Setanta Sports: Sports TV App on Google Play.",
      date: "Tue, 19 May 2026 12:00:00 +0000",
    });

    expect(detection).toMatchObject({
      provider: "Setanta Sports",
      name: "Setanta Sports",
      category: "Other",
      billingCycle: "MONTHLY",
      rawEmailId: "gmail-message-google-play-setanta",
    });
    expect(detection.provider).not.toBe("YouTube Premium");
  });

  it("filters messages that do not meet the confidence threshold", () => {
    const detections = detectSubscriptionsFromMessages([
      {
        id: "message-1",
        sender: "Friend <friend@example.com>",
        subject: "Lunch tomorrow",
        snippet: "See you then",
      },
    ]);

    expect(detections).toEqual([]);
  });
});
