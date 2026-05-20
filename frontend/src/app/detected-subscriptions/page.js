import Link from "next/link";
import { AuthGate } from "@/components/auth-gate";
import { DetectedSubscriptionList } from "@/components/detected-subscription-list";

export default function DetectedSubscriptionsPage() {
  return (
    <AuthGate>
      <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <Link
                href="/gmail-import"
                className="text-sm font-medium text-cyan-600 dark:text-cyan-300"
              >
                Back to Gmail import
              </Link>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight">Detected subscriptions</h1>
              <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
                Review confidence-scored subscriptions from Gmail scans. Nothing is added to your
                active subscription list until you confirm it.
              </p>
            </div>
            <Link
              href="/subscriptions"
              className="rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
            >
              View subscriptions
            </Link>
          </header>

          <div className="mt-8">
            <DetectedSubscriptionList />
          </div>
        </div>
      </main>
    </AuthGate>
  );
}
