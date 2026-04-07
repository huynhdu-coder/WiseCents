export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}) {
  return (
    <div className="rounded-xl2 border border-app-border bg-app-surface p-4 shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-app-muted sm:text-sm">
            {title}
          </p>

          <h3 className="mt-1 truncate text-xl font-bold leading-tight text-app-text sm:text-2xl">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-1 text-xs text-app-muted">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-app-primarySoft text-app-primary sm:h-11 sm:w-11">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        )}
      </div>
    </div>
  );
}