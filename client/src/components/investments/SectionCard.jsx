import { cn } from "../../utils/investmentFormatters";

export default function SectionCard({ title, right, children, className = "" }) {
  return (
    <div className={cn("rounded-3xl border border-slate-200 bg-white shadow-sm", className)}>
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}