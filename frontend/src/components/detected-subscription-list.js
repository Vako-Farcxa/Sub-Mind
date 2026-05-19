"use client";

import { useState } from "react";
import {
  useConfirmDetectedSubscription,
  useDetectedSubscriptions,
  useDismissDetectedSubscription,
} from "@/hooks/use-detected-subscriptions";
import { formatBillingCycle, formatCurrency, formatDate } from "@/lib/formatters";

function FieldValue({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{children}</p>
    </div>
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

  const handleConfirm = async (detection) => {
    setErrorMessage("");

    try {
      await confirmMutation.mutateAsync({ id: detection.id });
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
          <article
            key={detection.id}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold">{detection.name}</h2>
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200">
                    {detection.confidenceScore}% confidence
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {detection.subject || "No subject"} · {detection.sender || "Unknown sender"}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleConfirm(detection)}
                  disabled={isMutating}
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => handleDismiss(detection)}
                  disabled={isMutating}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  Dismiss
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <FieldValue label="Provider">{detection.provider}</FieldValue>
              <FieldValue label="Category">{detection.category || "Other"}</FieldValue>
              <FieldValue label="Amount">
                {detection.amount
                  ? formatCurrency(detection.amount, detection.currency)
                  : "Needs review"}
              </FieldValue>
              <FieldValue label="Billing cycle">
                {detection.billingCycle
                  ? formatBillingCycle(detection.billingCycle)
                  : "Needs review"}
              </FieldValue>
              <FieldValue label="Predicted renewal">
                {detection.renewalDate ? formatDate(detection.renewalDate) : "Needs review"}
              </FieldValue>
            </div>
          </article>
        ))
      )}
    </section>
  );
}
