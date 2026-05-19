import Link from "next/link";
import { AuthGate } from "@/components/auth-gate";
import { LogoutButton } from "@/components/logout-button";
import { StatCard } from "@/components/stat-card";

const upcomingRenewals = [
  { name: "Netflix", date: "May 24", amount: "$15.49" },
  { name: "GitHub Copilot", date: "May 27", amount: "$10.00" },
  { name: "Adobe Creative Cloud", date: "Jun 02", amount: "$54.99" },
];

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
                href="/subscriptions/new"
                className="rounded-full bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
              >
                Add subscription
              </Link>
            </div>
          </header>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Monthly spend" value="$143.48" helper="Across 9 active subscriptions" />
          <StatCard
            label="Yearly projection"
            value="$1,721"
            helper="Based on active billing cycles"
          />
          <StatCard label="Upcoming renewals" value="4" helper="Due in the next 7 days" />
          <StatCard
            label="Potential savings"
            value="$32"
            helper="Trials and duplicates to review"
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-semibold">Category breakdown</h2>
            <div className="mt-6 space-y-4">
              {["Entertainment", "Productivity", "Cloud storage", "AI tools"].map((category) => (
                <div key={category}>
                  <div className="flex justify-between text-sm">
                    <span>{category}</span>
                    <span className="text-slate-500 dark:text-slate-400">Foundation data</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-3 w-2/3 rounded-full bg-cyan-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-semibold">Upcoming renewals</h2>
            <div className="mt-6 space-y-4">
              {upcomingRenewals.map((renewal) => (
                <div
                  key={renewal.name}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"
                >
                  <div>
                    <p className="font-medium">{renewal.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{renewal.date}</p>
                  </div>
                  <p className="font-semibold">{renewal.amount}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
        </div>
      </main>
    </AuthGate>
  );
}
