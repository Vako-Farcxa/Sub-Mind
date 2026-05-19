import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/5 dark:border-white/10 dark:bg-slate-900">
        <Link href="/" className="text-sm font-medium text-cyan-600 dark:text-cyan-300">
          SubMind
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Sign in to manage subscriptions
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Google OAuth will be connected in the auth milestone. This page defines the protected
          route entry point and design system direction.
        </p>

        <button
          type="button"
          className="mt-8 flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-cyan-300 dark:text-slate-950"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Secure sessions will use HttpOnly cookies issued by the Express API.
        </p>
      </section>
    </main>
  );
}
