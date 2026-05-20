"use client";

import Link from "next/link";
import { useState } from "react";
import { useDeleteSubscription, useSubscriptions } from "@/hooks/use-subscriptions";
import { formatBillingCycle, formatCurrency, formatDate } from "@/lib/formatters";

export function SubscriptionList() {
  const [status, setStatus] = useState("");
  const {
    data: subscriptions = [],
    isError,
    isLoading,
  } = useSubscriptions(status ? { status } : {});
  const deleteMutation = useDeleteSubscription();

  const handleDelete = async (subscription) => {
    const confirmed = window.confirm(`Delete ${subscription.name}?`);

    if (!confirmed) {
      return;
    }

    await deleteMutation.mutateAsync(subscription.id);
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading subscriptions...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/60 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Unable to load subscriptions</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Check that the backend API and database are running.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold">Your subscriptions</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add, edit, pause, or remove subscriptions you track manually.
          </p>
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="TRIALING">Trialing</option>
          <option value="PAUSED">Paused</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      {subscriptions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold">No subscriptions yet</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Start with a manual subscription. Gmail import will add detected subscriptions in a
            later milestone.
          </p>
          <Link
            href="/subscriptions/new"
            className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950"
          >
            Add subscription
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400 lg:grid">
            <span>Name</span>
            <span>Category</span>
            <span>Amount</span>
            <span>Renewal</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-white/10">
            {subscriptions.map((subscription) => (
              <article
                key={subscription.id}
                className="grid gap-4 px-6 py-5 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto] lg:items-center"
              >
                <div>
                  <h3 className="font-semibold">{subscription.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {subscription.provider}
                  </p>
                </div>
                <p className="text-sm">{subscription.category}</p>
                <p className="text-sm font-medium">
                  {formatCurrency(subscription.amount, subscription.currency)} /{" "}
                  {formatBillingCycle(subscription.billingCycle)}
                </p>
                <p className="text-sm">{formatDate(subscription.renewalDate)}</p>
                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {subscription.status}
                </span>
                <div className="flex gap-3">
                  <Link
                    href={`/subscriptions/${subscription.id}/edit`}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-white/15 dark:hover:bg-white/10"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(subscription)}
                    disabled={deleteMutation.isPending}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/40"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
