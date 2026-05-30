"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface ConfidenceBadgeProps {
  score: number;
}

export function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  const percent = Math.round(score * 100);
  const variant =
    score >= 0.85 ? "success" : score >= 0.65 ? "warning" : "danger";
  const label =
    score >= 0.85 ? "High" : score >= 0.65 ? "Medium" : "Low";

  return (
    <Badge variant={variant}>
      {label} · {percent}%
    </Badge>
  );
}
