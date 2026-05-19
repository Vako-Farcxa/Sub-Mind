"use client";

import { useState } from "react";
import { useEmailScans, useStartEmailScan } from "@/hooks/use-email-scans";
import { formatDate } from "@/lib/formatters";

const scanDefaults = {
  maxResults: 10,
  newerThanDays: 90,
};

export function GmailImportPanel() {
  const [form, setForm] = useState(scanDefaults);
  const [latestMessages, setLatestMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: scans = [], isError, isLoading } = useEmailScans();
  const startScanMutation = useStartEmailScan();

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: Number(value) }));
  };

  const handleStartScan = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const result = await startScanMutation.mutateAsync(form);
      setLatestMessages(result.messages || []);

      if (result.scan.status === "FAILED") {
        setErrorMessage(result.scan.errorMessage || "Gmail scan failed.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to start Gmail scan. Confirm Google is connected with Gmail access.",
      );
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Start Gmail scan</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          This scans Gmail metadata for subscription-related messages. Detection and confirmation
          are intentionally handled in the next milestone.
        </p>

        <form onSubmit={handleStartScan} className="mt-6 space-y-5">
          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
              {errorMessage}
            </div>
          ) : null}

          <label className="block space-y-2">
            <span className="text-sm font-medium">Max emails</span>
            <input
              type="number"
              min="1"
              max="50"
              value={form.maxResults}
              onChange={(event) => updateField("maxResults", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Look back days</span>
            <input
              type="number"
              min="1"
              max="365"
              value={form.newerThanDays}
              onChange={(event) => updateField("newerThanDays", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
            />
          </label>

          <button
            type="submit"
            disabled={startScanMutation.isPending}
            className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
          >
            {startScanMutation.isPending ? "Scanning Gmail..." : "Scan Gmail"}
          </button>
        </form>
      </section>

      <section className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Latest message previews</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            These previews are returned from the scan response and are not persisted yet.
          </p>

          <div className="mt-6 space-y-4">
            {latestMessages.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Run a scan to preview matching emails.
              </p>
            ) : (
              latestMessages.map((message) => (
                <article
                  key={message.id}
                  className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"
                >
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                    <div>
                      <h3 className="font-semibold">{message.subject || "No subject"}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {message.sender || "Unknown sender"}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {message.date || "No date"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {message.snippet}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Scan history</h2>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading scan history...</p>
            ) : null}

            {isError ? (
              <p className="text-sm text-red-600 dark:text-red-300">
                Unable to load scan history.
              </p>
            ) : null}

            {!isLoading && !isError && scans.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No Gmail scans have been run yet.
              </p>
            ) : null}

            {scans.map((scan) => (
              <article
                key={scan.id}
                className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <p className="font-semibold">{scan.status}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{scan.query}</p>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {scan.scannedCount} scanned · {scan.detectedCount} detected
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Created {formatDate(scan.createdAt)}
                </p>
                {scan.errorMessage ? (
                  <p className="mt-3 text-sm text-red-600 dark:text-red-300">{scan.errorMessage}</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
