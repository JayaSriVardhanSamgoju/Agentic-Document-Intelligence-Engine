import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-1
  max?: number;
  color?: "accent" | "success" | "warning" | "danger";
  label?: string;
  showPercent?: boolean;
  className?: string;
}

const barColors = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function ProgressBar({
  value,
  max = 1,
  color = "accent",
  label,
  showPercent = true,
  className,
}: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={cn("space-y-1", className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <span className="text-text-secondary font-medium">{label}</span>
          )}
          {showPercent && (
            <span className="text-text-muted font-mono">{percent}%</span>
          )}
        </div>
      )}
      <div className="h-1.5 rounded-full bg-raised overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            barColors[color]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
