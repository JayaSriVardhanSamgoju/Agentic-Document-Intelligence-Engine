"use client";

import type { EvaluationMetrics } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface EvaluationPanelProps {
  evaluation: EvaluationMetrics;
}

export function EvaluationPanel({ evaluation }: EvaluationPanelProps) {
  const {
    groundedness,
    hallucination_risk,
    retrieval_quality,
    answer_completeness,
  } = evaluation;

  // hallucination_risk may come as string from backend, normalize to number
  const hallucinationNum =
    typeof hallucination_risk === "string"
      ? parseFloat(hallucination_risk) || 0
      : hallucination_risk;

  return (
    <div>
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">
        Evaluation Metrics
      </p>
      <div className="space-y-2.5">
        <ProgressBar
          value={groundedness}
          label="Groundedness"
          color={groundedness >= 0.8 ? "success" : groundedness >= 0.5 ? "warning" : "danger"}
        />
        <ProgressBar
          value={hallucinationNum}
          label="Hallucination Risk"
          color={hallucinationNum <= 0.15 ? "success" : hallucinationNum <= 0.35 ? "warning" : "danger"}
        />
        <ProgressBar
          value={retrieval_quality}
          label="Retrieval Quality"
          color={retrieval_quality >= 0.8 ? "success" : retrieval_quality >= 0.5 ? "warning" : "danger"}
        />
        <ProgressBar
          value={answer_completeness}
          label="Answer Completeness"
          color={answer_completeness >= 0.8 ? "success" : answer_completeness >= 0.5 ? "warning" : "danger"}
        />
      </div>
    </div>
  );
}
