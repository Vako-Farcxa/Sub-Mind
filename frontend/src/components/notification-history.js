"use client";

import {
  useMarkNotificationRead,
  useNotifications,
  useRunReminderCycle,
} from "@/hooks/use-reminders";
import { formatDate } from "@/lib/formatters";

export function NotificationHistory() {
  const { data: notifications = [], isError, isLoading } = useNotifications();
  const runReminderMutation = useRunReminderCycle();
  const markReadMutation = useMarkNotificationRead();

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-semibold">Notification history</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Review generated reminders and manually trigger a reminder cycle in development.
          </p>
        </div>
        <button
          type="button"
          onClick={() => runReminderMutation.mutate()}
          disabled={runReminderMutation.isPending}
          className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
        >
          {runReminderMutation.isPending ? "Running..." : "Run reminders now"}
        </button>
      </div>

      {runReminderMutation.data ? (
        <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-200">
          Planned {runReminderMutation.data.plannedCount}, attempted{" "}
          {runReminderMutation.data.attemptedCount}, delivered{" "}
          {runReminderMutation.data.deliveredCount}, failed {runReminderMutation.data.failedCount}.
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading notifications...</p>
        ) : null}

        {isError ? (
          <p className="text-sm text-red-600 dark:text-red-300">Unable to load notifications.</p>
        ) : null}

        {!isLoading && !isError && notifications.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No notifications have been created yet.
          </p>
        ) : null}

        {notifications.map((notification) => (
          <article
            key={notification.id}
            className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {notification.channel}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {notification.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {notification.message}
                </p>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Scheduled {formatDate(notification.scheduledFor)}
                </p>
                {notification.failureReason ? (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                    {notification.failureReason}
                  </p>
                ) : null}
              </div>

              {notification.status !== "READ" ? (
                <button
                  type="button"
                  onClick={() => markReadMutation.mutate(notification.id)}
                  disabled={markReadMutation.isPending}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/10"
                >
                  Mark read
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
