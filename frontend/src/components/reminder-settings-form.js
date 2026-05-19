"use client";

import { useState } from "react";
import { useReminderSettings, useUpdateReminderSettings } from "@/hooks/use-reminders";

const defaultForm = {
  enabled: true,
  daysBefore: 3,
  emailEnabled: true,
  telegramEnabled: false,
  telegramChatId: "",
};

function buildFormState(settings) {
  return {
    enabled: settings?.enabled ?? defaultForm.enabled,
    daysBefore: settings?.daysBefore ?? defaultForm.daysBefore,
    emailEnabled: settings?.emailEnabled ?? defaultForm.emailEnabled,
    telegramEnabled: settings?.telegramEnabled ?? defaultForm.telegramEnabled,
    telegramChatId: settings?.telegramChatId || "",
  };
}

function ReminderSettingsFormFields({ settings }) {
  const updateMutation = useUpdateReminderSettings();
  const [form, setForm] = useState(() => buildFormState(settings));
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await updateMutation.mutateAsync({
        ...form,
        telegramChatId: form.telegramChatId.trim() || null,
      });
      setSuccessMessage("Reminder settings saved.");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to save reminder settings.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
    >
      <h2 className="text-xl font-semibold">Reminder settings</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Configure when renewals create reminders and which delivery channels are enabled.
      </p>

      {successMessage ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-6 space-y-5">
        <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 dark:border-white/10">
          <span>
            <span className="block text-sm font-semibold">Enable reminders</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Create notifications for upcoming renewals.
            </span>
          </span>
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(event) => updateField("enabled", event.target.checked)}
            className="size-5"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Days before renewal</span>
          <input
            type="number"
            min="1"
            max="30"
            value={form.daysBefore}
            onChange={(event) => updateField("daysBefore", Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 dark:border-white/10">
          <span>
            <span className="block text-sm font-semibold">Email notifications</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Send reminders to your account email when SMTP is configured.
            </span>
          </span>
          <input
            type="checkbox"
            checked={form.emailEnabled}
            onChange={(event) => updateField("emailEnabled", event.target.checked)}
            className="size-5"
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 dark:border-white/10">
          <span>
            <span className="block text-sm font-semibold">Telegram notifications</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Send reminders through a Telegram bot when a chat ID is provided.
            </span>
          </span>
          <input
            type="checkbox"
            checked={form.telegramEnabled}
            onChange={(event) => updateField("telegramEnabled", event.target.checked)}
            className="size-5"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Telegram chat ID</span>
          <input
            value={form.telegramChatId}
            onChange={(event) => updateField("telegramChatId", event.target.value)}
            placeholder="123456789"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={updateMutation.isPending}
        className="mt-6 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
      >
        {updateMutation.isPending ? "Saving..." : "Save reminder settings"}
      </button>
    </form>
  );
}

export function ReminderSettingsForm() {
  const { data: settings, isError, isLoading } = useReminderSettings();

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading reminder settings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[2rem] border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/60 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Unable to load settings</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Check that the backend API is running.
        </p>
      </div>
    );
  }

  return <ReminderSettingsFormFields key={settings?.id || "default"} settings={settings} />;
}
