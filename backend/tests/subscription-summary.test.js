const {
  buildSubscriptionSummary,
  getMonthlyEquivalent,
  isUpcomingRenewal,
} = require("../src/services/subscription-summary.service");

const baseSubscription = {
  id: "subscription-id",
  name: "Netflix",
  provider: "Netflix",
  category: "Entertainment",
  amount: 12,
  billingCycle: "MONTHLY",
  currency: "USD",
  renewalDate: new Date("2026-06-01T00:00:00.000Z"),
  status: "ACTIVE",
};

describe("subscription summary calculations", () => {
  it("normalizes billing cycles into monthly equivalents", () => {
    expect(getMonthlyEquivalent({ ...baseSubscription, amount: 12, billingCycle: "MONTHLY" })).toBe(
      12,
    );
    expect(getMonthlyEquivalent({ ...baseSubscription, amount: 120, billingCycle: "YEARLY" })).toBe(
      10,
    );
    expect(getMonthlyEquivalent({ ...baseSubscription, amount: 6, billingCycle: "WEEKLY" })).toBe(
      26,
    );
    expect(getMonthlyEquivalent({ ...baseSubscription, amount: 30, billingCycle: "TRIAL" })).toBe(
      0,
    );
  });

  it("detects renewals due in the next 30 days", () => {
    const now = new Date("2026-05-19T00:00:00.000Z");

    expect(isUpcomingRenewal(baseSubscription, now)).toBe(true);
    expect(
      isUpcomingRenewal(
        { ...baseSubscription, renewalDate: new Date("2026-07-01T00:00:00.000Z") },
        now,
      ),
    ).toBe(false);
  });

  it("builds dashboard summary values from active subscriptions", () => {
    const now = new Date("2026-05-19T00:00:00.000Z");
    const summary = buildSubscriptionSummary(
      [
        baseSubscription,
        {
          ...baseSubscription,
          id: "yearly-id",
          name: "GitHub Copilot",
          provider: "GitHub",
          category: "Productivity",
          amount: 120,
          billingCycle: "YEARLY",
        },
        {
          ...baseSubscription,
          id: "cancelled-id",
          name: "Old tool",
          status: "CANCELLED",
          amount: 99,
        },
      ],
      now,
    );

    expect(summary).toMatchObject({
      activeCount: 2,
      monthlySpend: 22,
      yearlyProjection: 264,
      upcomingRenewalsCount: 2,
    });
    expect(summary.categoryBreakdown).toEqual([
      { category: "Entertainment", monthlyAmount: 12 },
      { category: "Productivity", monthlyAmount: 10 },
    ]);
  });
});
