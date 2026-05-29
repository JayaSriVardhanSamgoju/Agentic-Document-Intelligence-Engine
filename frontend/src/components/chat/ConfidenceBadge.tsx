"use client";

import { cn } from "@/lib/utils";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";

interface ConfidenceBadgeProps {
  score: number;
  className?: string;
}

export function ConfidenceBadge({ score, className }: ConfidenceBadgeProps) {
  const pct = Math.round(score * 100);

  const level =
    score >= 0.85 ? "high" : score >= 0.65 ? "medium" : "low";

  const config = {
    high: {
      icon: <ShieldCheck size={12} />,
      color: "text-success bg-success/10 border-success/20",
      label: "High Confidence",
    },
    medium: {
      icon: <AlertTriangle size={12} />,
      color: "text-warning bg-warning/10 border-warning/20",
      label: "Medium Confidence",
    },
    low: {
      icon: <ShieldAlert size={12} />,
      color: "text-destructive bg-destructive/10 border-destructive/20",
      label: "Low Confidence",
    },
  };

  const { icon, color, label } = config[level];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium border",
        color,
        className
      )}
      title={label}
    >
      {icon}
      {pct}%
    </div>
  );
}
