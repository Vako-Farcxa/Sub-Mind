"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCreateSubscription, useUpdateSubscription } from "@/hooks/use-subscriptions";

const billingCycleOptions = ["WEEKLY", "MONTHLY", "YEARLY", "TRIAL"];
const statusOptions = ["ACTIVE", "TRIALING", "PAUSED", "CANCELLED", "EXPIRED"];
const categoryOptions = [
  "Entertainment",
  "Productivity",
  "AI tools",
  "Cloud storage",
  "Education",
  "Health",
  "Finance",
  "Other",
];

const emptyForm = {
  name: "",
  provider: "",
  category: "Entertainment",
  amount: "",
  billingCycle: "MONTHLY",
  currency: "USD",
  renewalDate: "",
  trialEndsAt: "",
  status: "ACTIVE",
};

function toDateTimeLocal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function buildInitialForm(subscription) {
  if (!subscription) {
    return emptyForm;
  }

  return {
    name: subscription.name || "",
    provider: subscription.provider || "",
    category: subscription.category || "Entertainment",
    amount: subscription.amount?.toString() || "",
    billingCycle: subscription.billingCycle || "MONTHLY",
    currency: subscription.currency || "USD",
    renewalDate: toDateTimeLocal(subscription.renewalDate),
    trialEndsAt: toDateTimeLocal(subscription.trialEndsAt),
    status: subscription.status || "ACTIVE",
  };
}

function toApiPayload(form) {
  return {
    name: form.name,
    provider: form.provider,
    category: form.category,
    amount: Number(form.amount),
    billingCycle: form.billingCycle,
    currency: form.currency,
    renewalDate: new Date(form.renewalDate).toISOString(),
    trialEndsAt: form.trialEndsAt ? new Date(form.trialEndsAt).toISOString() : null,
    status: form.status,
  };
}

export function SubscriptionForm({ subscription }) {
  const router = useRouter();
  const initialForm = useMemo(() => buildInitialForm(subscription), [subscription]);
  const [form, setForm] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const createMutation = useCreateSubscription();
  const updateMutation = useUpdateSubscription();
  const isEditing = Boolean(subscription?.id);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const payload = toApiPayload(form);

      if (isEditing) {
        await updateMutation.mutateAsync({ id: subscription.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }

      router.push("/subscriptions");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to save subscription. Check the fields and retry.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">Subscription name</span>
          <input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Netflix Premium"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Provider</span>
          <input
            required
            value={form.provider}
            onChange={(event) => updateField("provider", event.target.value)}
            placeholder="Netflix"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Category</span>
          <select
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Amount</span>
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
          <span className="text-sm font-medium">Billing cycle</span>
          <select
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
          <span className="text-sm font-medium">Currency</span>
          <input
            required
            maxLength={3}
            value={form.currency}
            onChange={(event) => updateField("currency", event.target.value.toUpperCase())}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Next renewal</span>
          <input
            required
            type="datetime-local"
            value={form.renewalDate}
            onChange={(event) => updateField("renewalDate", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Trial ends at</span>
          <input
            type="datetime-local"
            value={form.trialEndsAt}
            onChange={(event) => updateField("trialEndsAt", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium">Status</span>
          <select
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
        >
          {isPending ? "Saving..." : isEditing ? "Save changes" : "Create subscription"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
