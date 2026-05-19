"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

export function AuthGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isError, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !user && !isError) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isError, isLoading, pathname, router, user]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Checking your secure session...
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/60 dark:bg-slate-900">
          <h1 className="text-2xl font-semibold">Unable to verify your session</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Make sure the backend is running and your environment variables are configured.
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-slate-950 dark:bg-slate-950 dark:text-white">
        <p className="text-sm text-slate-600 dark:text-slate-400">Redirecting to login...</p>
      </main>
    );
  }

  return children;
}
