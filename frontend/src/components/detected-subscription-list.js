"use client";

import { useState } from "react";
import {
  useConfirmDetectedSubscription,
  useDetectedSubscriptions,
  useDismissDetectedSubscription,
} from "@/hooks/use-detected-subscriptions";

const billingCycleOptions = ["WEEKLY", "MONTHLY", "YEARLY", "TRIAL"];
const statusOptions = ["ACTIVE", "TRIALING", "PAUSED", "CANCELLED", "EXPIRED"];

function toDateTimeLocal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function buildInitialForm(detection) {
  return {
    name: detection.name || "",
    provider: detection.provider || "",
    category: detection.category || "Other",
    amount: detection.amount?.toString() || "",
    billingCycle: detection.billingCycle || "MONTHLY",
    currency: detection.currency || "USD",
    renewalDate: toDateTimeLocal(detection.renewalDate),
    status: "ACTIVE",
  };
}

function buildConfirmPayload(form) {
  return {
    name: form.name,
    provider: form.provider,
    category: form.category,
    amount: Number(form.amount),
    billingCycle: form.billingCycle,
    currency: form.currency,
    renewalDate: new Date(form.renewalDate).toISOString(),
    status: form.status,
  };
}

function DetectionReviewCard({ detection, isMutating, onConfirm, onDismiss }) {
  const [form, setForm] = useState(() => buildInitialForm(detection));

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm(detection, buildConfirmPayload(form));
  };

  const needsReview = !detection.amount || !detection.billingCycle || !detection.renewalDate;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
    >
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold">{detection.name}</h2>
            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200">
              {detection.confidenceScore}% confidence
            </span>
            {needsReview ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                Needs review
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {detection.subject || "No subject"} · {detection.sender || "Unknown sender"}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isMutating}
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => onDismiss(detection)}
            disabled={isMutating}
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Dismiss
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Name
          </span>
          <input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Provider
          </span>
          <input
            required
            value={form.provider}
            onChange={(event) => updateField("provider", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Category
          </span>
          <input
            required
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Amount
          </span>
          <input
            required
            min="0.01"
            step="0.01"
            type="number"
            value={form.amount}
            onChange={(event) => updateField("amount", event.target.value)}
            placeholder="15.49"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Billing cycle
          </span>
          <select
            required
            value={form.billingCycle}
            onChange={(event) => updateField("billingCycle", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          >
            {billingCycleOptions.map((cycle) => (
              <option key={cycle} value={cycle}>
                {cycle}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Currency
          </span>
          <input
            required
            maxLength={3}
            value={form.currency}
            onChange={(event) => updateField("currency", event.target.value.toUpperCase())}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Renewal date
          </span>
          <input
            required
            type="datetime-local"
            value={form.renewalDate}
            onChange={(event) => updateField("renewalDate", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Status
          </span>
          <select
            required
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>
    </form>
  );
}

export function DetectedSubscriptionList() {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    data: detections = [],
    isError,
    isLoading,
  } = useDetectedSubscriptions({
    state: "pending",
    limit: 50,
  });
  const confirmMutation = useConfirmDetectedSubscription();
  const dismissMutation = useDismissDetectedSubscription();
  const isMutating = confirmMutation.isPending || dismissMutation.isPending;

  const handleConfirm = async (detection, payload) => {
    setErrorMessage("");

    try {
      await confirmMutation.mutateAsync({ id: detection.id, payload });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to confirm detection. Some billing fields may be missing.",
      );
    }
  };

  const handleDismiss = async (detection) => {
    setErrorMessage("");
    await dismissMutation.mutateAsync(detection.id);
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading detections...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/60 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Unable to load detections</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Check that the backend API and database are running.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
          {errorMessage}
        </div>
      ) : null}

      {detections.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold">No pending detections</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Run a Gmail import scan to create confidence-scored subscription detections.
          </p>
        </div>
      ) : (
        detections.map((detection) => (
          <DetectionReviewCard
            key={detection.id}
            detection={detection}
            isMutating={isMutating}
            onConfirm={handleConfirm}
            onDismiss={handleDismiss}
          />
        ))
      )}
    </section>
  );
}
