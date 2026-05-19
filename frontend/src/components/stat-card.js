export function StatCard({ label, value, helper }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/80 p-6 shadow-sm shadow-slate-950/5 backdrop-blur dark:bg-slate-900/70">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helper}</p>
    </article>
  );
}
