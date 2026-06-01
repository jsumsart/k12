import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent px-4 py-2 text-sm font-semibold transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  default: "bg-white text-violet-700 hover:bg-violet-50 active:scale-[0.98]",
  ghost: "bg-transparent text-white hover:bg-white/10 active:scale-[0.98]"
};

export const Button = forwardRef(function Button(
  { className, variant = "default", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
});
