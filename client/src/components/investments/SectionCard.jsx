import { cn } from "../../utils/investmentFormatters";

export default function SectionCard({
  title,
  right,
  children,
  className = "",
}) {
  return (
    <section
      className={cn(
        "rounded-xl2 border border-app-border bg-app-surface shadow-card",
        className
      )}
    >
      <div className="flex flex-col gap-2 border-b border-app-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <h2 className="text-base font-bold text-app-text sm:text-lg">
          {title}
        </h2>

        {right && (
          <div className="flex flex-wrap items-center gap-2">
            {right}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}