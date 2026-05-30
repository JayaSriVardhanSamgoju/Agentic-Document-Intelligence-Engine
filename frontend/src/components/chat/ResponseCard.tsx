"use client";

import { useState } from "react";
import type { QueryResponse } from "@/types";
import { AgentTracePanel } from "./AgentTracePanel";
import { CitationViewer } from "./CitationViewer";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { EvaluationPanel } from "./EvaluationPanel";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { cn, formatMs } from "@/lib/utils";

interface ResponseCardProps {
  response: QueryResponse;
}

export function ResponseCard({ response }: ResponseCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    answer,
    confidence_score,
    citations,
    agent_trace,
    evaluation,
    observability,
  } = response;

  const riskLevel =
    confidence_score >= 0.85 ? "low" : confidence_score >= 0.65 ? "medium" : "high";

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl rounded-tl-md bubble-ai overflow-hidden">
      {/* Header badges */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-1 flex-wrap">
        <ConfidenceBadge score={confidence_score} />
        {riskLevel === "low" && (
          <Badge variant="success">
            <CheckCircle2 size={10} /> Verified
          </Badge>
        )}
        {riskLevel === "medium" && (
          <Badge variant="warning">
            <AlertTriangle size={10} /> Medium Risk
          </Badge>
        )}
        {riskLevel === "high" && (
          <Badge variant="danger">
            <AlertTriangle size={10} /> High Risk
          </Badge>
        )}
        {observability?.latency_ms && (
          <Badge variant="default">
            <Clock size={10} /> {formatMs(observability.latency_ms)}
          </Badge>
        )}
      </div>

      {/* Answer */}
      <div className="px-4 py-3 prose-chat text-text-primary text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
      </div>

      {/* Low confidence warning */}
      {riskLevel === "high" && (
        <div className="mx-4 mb-3 p-2.5 rounded-lg bg-warning/5 border border-warning/10 text-xs text-warning flex items-start gap-2">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>
            Low confidence answer. High hallucination risk. Verify with source
            documents.
          </span>
        </div>
      )}

      {/* Expandable details */}
      <div className="border-t border-subtle">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <span className="font-semibold uppercase tracking-wider">
            {showDetails ? "Hide Details" : "Show Details"}
            {citations.length > 0 && ` · ${citations.length} Sources`}
          </span>
          {showDetails ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </button>

        {showDetails && (
          <div className="px-4 pb-4 space-y-4 animate-fade-in">
            {/* Evaluation metrics */}
            {evaluation && <EvaluationPanel evaluation={evaluation} />}

            {/* Citations */}
            {citations.length > 0 && (
              <CitationViewer citations={citations} />
            )}

            {/* Agent trace */}
            {agent_trace.length > 0 && (
              <AgentTracePanel trace={agent_trace} />
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 px-4 py-2.5 border-t border-subtle">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] text-text-muted hover:text-text-primary hover:bg-raised/50 transition-colors"
        >
          <Copy size={12} />
          {copied ? "Copied!" : "Copy"}
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] text-text-muted hover:text-success hover:bg-success/5 transition-colors">
          <ThumbsUp size={12} />
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] text-text-muted hover:text-danger hover:bg-danger/5 transition-colors">
          <ThumbsDown size={12} />
        </button>
      </div>
    </div>
  );
}
