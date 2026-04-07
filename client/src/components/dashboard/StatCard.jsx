export default function StatCard({ title, value, icon : Icon }) {
  return (
    <div className="flex items-center gap-3 rounded-xl2 border border-app-border bg-app-surface p-3.5 shadow-card sm:p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-app-primarySoft text-lg text-app-primary sm:h-11 sm:w-11">
        <Icon />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-app-muted sm:text-sm">
          {title}
        </p>
        <h3 className="mt-1 truncate text-xl font-bold leading-tight text-app-text sm:text-2xl">
          {value}
        </h3>
      </div>
    </div>
  );
}