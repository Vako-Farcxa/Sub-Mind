import Link from "next/link";
import { AuthGate } from "@/components/auth-gate";
import { SubscriptionForm } from "@/components/subscription-form";

export default function NewSubscriptionPage() {
  return (
    <AuthGate>
      <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-950 dark:bg-slate-950 dark:text-white">
        <section className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <Link href="/dashboard" className="text-sm font-medium text-cyan-600 dark:text-cyan-300">
            Back to dashboard
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Add subscription</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Track a recurring charge manually. Gmail-detected subscriptions will use the same data
            model after user confirmation.
          </p>
          <SubscriptionForm />
        </section>
      </main>
    </AuthGate>
  );
}
