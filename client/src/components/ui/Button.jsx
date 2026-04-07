import { cn } from "../../utils/cn";

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}) {
  const variants = {
    primary:
      "bg-[#155740] text-white hover:bg-[#124735] dark:bg-[#63c08c] dark:text-[#102018] dark:hover:bg-[#57b57f]",
    secondary:
      "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}