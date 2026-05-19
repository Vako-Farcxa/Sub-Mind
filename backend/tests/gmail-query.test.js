const {
  buildSubscriptionSearchQuery,
  extractMessagePreview,
  normalizeScanOptions,
} = require("../src/services/gmail-query.service");

describe("gmail query helpers", () => {
  it("normalizes scan options into safe Gmail API limits", () => {
    expect(normalizeScanOptions({ maxResults: 500, newerThanDays: 999 })).toEqual({
      maxResults: 50,
      newerThanDays: 365,
    });
    expect(normalizeScanOptions({ maxResults: -1, newerThanDays: 0 })).toEqual({
      maxResults: 1,
      newerThanDays: 90,
    });
  });

  it("builds a subscription-oriented Gmail search query", () => {
    const query = buildSubscriptionSearchQuery({ newerThanDays: 30 });

    expect(query).toContain("newer_than:30d");
    expect(query).toContain('"subscription"');
    expect(query).toContain('"payment received"');
  });

  it("extracts stable preview fields from Gmail metadata", () => {
    const preview = extractMessagePreview({
      id: "message-1",
      threadId: "thread-1",
      snippet: "Your subscription renewed",
      payload: {
        headers: [
          { name: "From", value: "Netflix <billing@netflix.com>" },
          { name: "Subject", value: "Your receipt" },
          { name: "Date", value: "Tue, 19 May 2026 12:00:00 +0000" },
        ],
      },
    });

    expect(preview).toEqual({
      id: "message-1",
      threadId: "thread-1",
      snippet: "Your subscription renewed",
      sender: "Netflix <billing@netflix.com>",
      subject: "Your receipt",
      date: "Tue, 19 May 2026 12:00:00 +0000",
    });
  });
});
