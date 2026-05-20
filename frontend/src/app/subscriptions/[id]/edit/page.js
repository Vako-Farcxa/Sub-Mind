"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AuthGate } from "@/components/auth-gate";
import { SubscriptionForm } from "@/components/subscription-form";
import { useSubscription } from "@/hooks/use-subscriptions";

export default function EditSubscriptionPage() {
  const params = useParams();
  const { data: subscription, isError, isLoading } = useSubscription(params.id);

  return (
    <AuthGate>
      <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-950 dark:bg-slate-950 dark:text-white">
        <section className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <Link
            href="/subscriptions"
            className="text-sm font-medium text-cyan-600 dark:text-cyan-300"
          >
            Back to subscriptions
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Edit subscription</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Update amount, renewal date, status, and billing metadata for this subscription.
          </p>

          {isLoading ? (
            <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
              Loading subscription...
            </p>
          ) : null}

          {isError ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
              Unable to load this subscription.
            </div>
          ) : null}

          {subscription ? <SubscriptionForm subscription={subscription} /> : null}
        </section>
      </main>
    </AuthGate>
  );
}
