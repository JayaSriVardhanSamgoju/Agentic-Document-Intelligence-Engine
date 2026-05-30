import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 rounded-lg bg-deep border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all",
          error
            ? "border-danger/50 focus:ring-danger/50"
            : "border-subtle focus:border-accent/50 focus:ring-accent/50",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
