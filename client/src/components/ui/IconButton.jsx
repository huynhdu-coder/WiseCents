import { cn } from "../../utils/cn";

export default function IconButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}