const ACTIVE_STATUSES = new Set(["ACTIVE", "TRIALING"]);
const UPCOMING_RENEWAL_DAYS = 30;

const toAmountNumber = (amount) => Number(amount ?? 0);

const roundCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const getMonthlyEquivalent = (subscription) => {
  if (!ACTIVE_STATUSES.has(subscription.status)) {
    return 0;
  }

  const amount = toAmountNumber(subscription.amount);

  switch (subscription.billingCycle) {
    case "WEEKLY":
      return amount * (52 / 12);
    case "MONTHLY":
      return amount;
    case "YEARLY":
      return amount / 12;
    case "TRIAL":
      return 0;
    default:
      return 0;
  }
};

const isUpcomingRenewal = (subscription, now = new Date()) => {
  if (!ACTIVE_STATUSES.has(subscription.status)) {
    return false;
  }

  const renewalDate = new Date(subscription.renewalDate);
  const renewalWindowEnd = new Date(now);
  renewalWindowEnd.setDate(renewalWindowEnd.getDate() + UPCOMING_RENEWAL_DAYS);

  return renewalDate >= now && renewalDate <= renewalWindowEnd;
};

const buildCategoryBreakdown = (subscriptions) => {
  const categoryTotals = subscriptions.reduce((totals, subscription) => {
    const monthlyAmount = getMonthlyEquivalent(subscription);

    if (monthlyAmount === 0) {
      return totals;
    }

    const category = subscription.category || "Uncategorized";
    totals.set(category, roundCurrency((totals.get(category) || 0) + monthlyAmount));
    return totals;
  }, new Map());

  return [...categoryTotals.entries()]
    .map(([category, monthlyAmount]) => ({ category, monthlyAmount }))
    .sort((a, b) => b.monthlyAmount - a.monthlyAmount);
};

const buildSubscriptionSummary = (subscriptions, now = new Date()) => {
  const activeSubscriptions = subscriptions.filter((subscription) =>
    ACTIVE_STATUSES.has(subscription.status),
  );
  const monthlySpend = roundCurrency(
    subscriptions.reduce((total, subscription) => total + getMonthlyEquivalent(subscription), 0),
  );
  const allUpcomingRenewals = subscriptions.filter((subscription) =>
    isUpcomingRenewal(subscription, now),
  );
  const upcomingRenewals = allUpcomingRenewals
    .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))
    .slice(0, 5);

  return {
    activeCount: activeSubscriptions.length,
    monthlySpend,
    yearlyProjection: roundCurrency(monthlySpend * 12),
    upcomingRenewalsCount: allUpcomingRenewals.length,
    categoryBreakdown: buildCategoryBreakdown(subscriptions),
    upcomingRenewals,
  };
};

module.exports = {
  buildSubscriptionSummary,
  getMonthlyEquivalent,
  isUpcomingRenewal,
};
