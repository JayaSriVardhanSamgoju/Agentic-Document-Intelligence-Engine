import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-muted-foreground",
  success: "bg-success/15 text-success border-success/20",
  warning: "bg-warning/15 text-warning border-warning/20",
  danger: "bg-destructive/15 text-destructive border-destructive/20",
  info: "bg-primary/15 text-blue-400 border-primary/20",
  outline: "bg-transparent border-border text-muted-foreground",
};

export function Badge({ variant = "default", children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full", {
            "bg-muted-foreground": variant === "default",
            "bg-success": variant === "success",
            "bg-warning": variant === "warning",
            "bg-destructive": variant === "danger",
            "bg-primary": variant === "info",
          })}
        />
      )}
      {children}
    </span>
  );
}
