import Link from "next/link";
import { AuthGate } from "@/components/auth-gate";
import { DashboardOverview } from "@/components/dashboard-overview";
import { LogoutButton } from "@/components/logout-button";

export default function DashboardPage() {
  return (
    <AuthGate>
      <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <Link href="/" className="text-sm font-medium text-cyan-600 dark:text-cyan-300">
                SubMind
              </Link>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight">Dashboard</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Protected dashboard shell for spending, renewals, and Gmail imports.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LogoutButton />
              <Link
                href="/gmail-import"
                className="rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Gmail import
              </Link>
              <Link
                href="/subscriptions"
                className="rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
              >
                View subscriptions
              </Link>
              <Link
                href="/subscriptions/new"
                className="rounded-full bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
              >
                Add subscription
              </Link>
            </div>
          </header>

          <DashboardOverview />
        </div>
      </main>
    </AuthGate>
  );
}
