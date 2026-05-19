import Link from "next/link";

export default function Home() {
  const dashboardStats = [
    { label: "Monthly spend", value: "$143.48" },
    { label: "Renewals this week", value: "4" },
    { label: "Detected from Gmail", value: "11" },
  ];

  const roadmap = [
    "Manual subscription CRUD with billing cycle support",
    "Google OAuth and Gmail receipt scanning",
    "Confidence-scored detection engine for subscription emails",
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#1d4ed8,transparent_36%),linear-gradient(135deg,#020617_0%,#0f172a_50%,#111827_100%)] text-white">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          SubMind
        </Link>
        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <Link href="/gmail-import" className="hover:text-white">
            Gmail import
          </Link>
          <Link href="/detected-subscriptions" className="hover:text-white">
            Detections
          </Link>
          <Link href="/login" className="hover:text-white">
            Login
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1fr_480px] lg:px-8 lg:pt-24">
        <div>
          <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100">
            Portfolio-grade subscription intelligence
          </p>
          <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Detect recurring charges before they surprise you.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            SubMind helps users track manual subscriptions today and will scan Gmail receipts
            tomorrow to uncover renewals, trials, invoices, and recurring spending patterns.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-full bg-cyan-300 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/40 hover:bg-cyan-200"
            >
              View dashboard shell
            </Link>
            <Link
              href="/gmail-import"
              className="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-white/10"
            >
              Try Gmail import
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {dashboardStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm text-slate-300">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <div className="rounded-3xl bg-slate-950/80 p-6">
            <p className="text-sm font-medium text-cyan-200">Milestone roadmap</p>
            <h2 className="mt-3 text-2xl font-semibold">Built incrementally</h2>
            <ul className="mt-6 space-y-4">
              {roadmap.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-sm font-semibold text-slate-950">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-6 text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
