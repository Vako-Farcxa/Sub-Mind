const { escapeHtml } = require("../src/services/notification-delivery.service");

describe("notification delivery helpers", () => {
  it("escapes Telegram and email HTML content", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });
});
