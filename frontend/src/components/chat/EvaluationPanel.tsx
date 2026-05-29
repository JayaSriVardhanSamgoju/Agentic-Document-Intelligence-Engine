"use client";

import type { EvaluationMetrics } from "@/types";
import { cn } from "@/lib/utils";

interface EvaluationPanelProps {
  evaluation: EvaluationMetrics;
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  const pct = Math.min(Math.round(value * 100), 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground font-mono w-8 text-right">
        {pct}%
      </span>
    </div>
  );
}

const riskColors: Record<string, string> = {
  low: "text-success",
  medium: "text-warning",
  high: "text-destructive",
};

export function EvaluationPanel({ evaluation }: EvaluationPanelProps) {
  if (!evaluation) return null;

  return (
    <div className="grid grid-cols-2 gap-3 text-xs">
      <div className="space-y-1">
        <span className="text-muted-foreground">Groundedness</span>
        <ProgressBar value={evaluation.groundedness} color="bg-success" />
      </div>
      <div className="space-y-1">
        <span className="text-muted-foreground">Retrieval Quality</span>
        <ProgressBar value={evaluation.retrieval_quality} color="bg-primary" />
      </div>
      <div className="space-y-1">
        <span className="text-muted-foreground">Completeness</span>
        <ProgressBar value={evaluation.answer_completeness} color="bg-accent" />
      </div>
      <div className="space-y-1">
        <span className="text-muted-foreground">Hallucination Risk</span>
        <span
          className={cn(
            "font-medium capitalize",
            riskColors[evaluation.hallucination_risk] || "text-muted-foreground"
          )}
        >
          {evaluation.hallucination_risk}
        </span>
      </div>
    </div>
  );
}
