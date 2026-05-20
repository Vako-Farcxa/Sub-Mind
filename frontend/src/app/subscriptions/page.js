import Link from "next/link";
import { AuthGate } from "@/components/auth-gate";
import { SubscriptionList } from "@/components/subscription-list";

export default function SubscriptionsPage() {
  return (
    <AuthGate>
      <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-cyan-600 dark:text-cyan-300"
              >
                Back to dashboard
              </Link>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight">Subscriptions</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Manage manually tracked subscriptions before Gmail detection is enabled.
              </p>
            </div>
            <Link
              href="/subscriptions/new"
              className="rounded-full bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
            >
              Add subscription
            </Link>
          </header>

          <div className="mt-8">
            <SubscriptionList />
          </div>
        </div>
      </main>
    </AuthGate>
  );
}
