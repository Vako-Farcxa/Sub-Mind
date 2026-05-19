import Link from "next/link";
import { AuthGate } from "@/components/auth-gate";
import { NotificationHistory } from "@/components/notification-history";
import { ReminderSettingsForm } from "@/components/reminder-settings-form";

export default function SettingsPage() {
  return (
    <AuthGate>
      <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <Link href="/dashboard" className="text-sm font-medium text-cyan-600 dark:text-cyan-300">
                Back to dashboard
              </Link>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight">Settings</h1>
              <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
                Configure renewal reminders, email delivery, and Telegram bot notifications.
              </p>
            </div>
          </header>

          <div className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
            <ReminderSettingsForm />
            <NotificationHistory />
          </div>
        </div>
      </main>
    </AuthGate>
  );
}
