export default function PageHeader({
  title,
  subtitle,
  right,
}) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-app-border bg-app-bg/90 px-4 py-3 backdrop-blur-sm sm:-mx-5 sm:px-5 lg:-mx-6 lg:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-app-text sm:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-app-muted">{subtitle}</p>
          ) : null}
        </div>

        {right ? (
          <div className="flex flex-wrap items-center gap-2">
            {right}
          </div>
        ) : null}
      </div>
    </div>
  );
}