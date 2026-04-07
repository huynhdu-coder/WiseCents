import { cn } from "../../utils/cn";

export default function Card({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#16211c]",
        className
      )}
    >
      {children}
    </div>
  );
}