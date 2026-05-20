"use client";

import Link from "next/link";
import { useSubscriptionSummary } from "@/hooks/use-subscriptions";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { StatCard } from "./stat-card";

const emptySummary = {
  activeCount: 0,
  monthlySpend: 0,
  yearlyProjection: 0,
  upcomingRenewalsCount: 0,
  categoryBreakdown: [],
  upcomingRenewals: [],
};

export function DashboardOverview() {
  const { data: summary = emptySummary, isError, isLoading } = useSubscriptionSummary();
  const maxCategorySpend = Math.max(
    ...summary.categoryBreakdown.map((item) => item.monthlyAmount),
    1,
  );

  if (isLoading) {
    return (
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading dashboard summary...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-8 rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/60 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Unable to load dashboard data</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Check that the backend API and database are running.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Monthly spend"
          value={formatCurrency(summary.monthlySpend)}
          helper={`Across ${summary.activeCount} active subscriptions`}
        />
        <StatCard
          label="Yearly projection"
          value={formatCurrency(summary.yearlyProjection)}
          helper="Based on active billing cycles"
        />
        <StatCard
          label="Upcoming renewals"
          value={summary.upcomingRenewalsCount.toString()}
          helper="Due in the next 30 days"
        />
        <StatCard
          label="Tracked manually"
          value={summary.activeCount.toString()}
          helper="Gmail import arrives in the next milestone"
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Category breakdown</h2>
            <Link
              href="/subscriptions"
              className="text-sm font-semibold text-cyan-600 dark:text-cyan-300"
            >
              View all
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {summary.categoryBreakdown.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add a subscription to see category spending.
              </p>
            ) : (
              summary.categoryBreakdown.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-sm">
                    <span>{item.category}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatCurrency(item.monthlyAmount)} / month
                    </span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-cyan-400"
                      style={{ width: `${(item.monthlyAmount / maxCategorySpend) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Upcoming renewals</h2>
          <div className="mt-6 space-y-4">
            {summary.upcomingRenewals.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No renewals due in the next 30 days.
              </p>
            ) : (
              summary.upcomingRenewals.map((renewal) => (
                <div
                  key={renewal.id}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"
                >
                  <div>
                    <p className="font-medium">{renewal.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(renewal.renewalDate)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(renewal.amount, renewal.currency)}
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>
      </section>
    </>
  );
}
