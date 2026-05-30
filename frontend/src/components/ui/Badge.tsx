import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "info" | "success" | "warning" | "danger" | "violet";
  className?: string;
}

const variantStyles = {
  default: "bg-raised text-text-secondary border-subtle",
  info: "bg-accent/10 text-accent border-accent/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-danger/10 text-danger border-danger/20",
  violet: "bg-violet/10 text-violet-glow border-violet/20",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
