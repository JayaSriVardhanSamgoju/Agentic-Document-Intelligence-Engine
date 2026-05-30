"use client";

import type { AgentTrace } from "@/types";
import { CheckCircle2, XCircle, Loader2, Shield, Brain, Search, PenTool, ShieldCheck, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentTracePanelProps {
  trace: AgentTrace[];
}

const AGENT_CONFIG: Record<string, { icon: any; label: string }> = {
  input_guardrails: { icon: Shield, label: "Input Guardrails" },
  planner: { icon: Brain, label: "Planner Agent" },
  retriever: { icon: Search, label: "Retriever Agent" },
  synthesizer: { icon: PenTool, label: "Synthesizer Agent" },
  output_guardrails: { icon: ShieldCheck, label: "Output Guardrails" },
  verifier: { icon: BadgeCheck, label: "Verifier Agent" },
};

export function AgentTracePanel({ trace }: AgentTracePanelProps) {
  return (
    <div>
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">
        Agent Pipeline Trace
      </p>
      <div className="space-y-0.5">
        {trace.map((step, i) => {
          const config = AGENT_CONFIG[step.agent] || {
            icon: Brain,
            label: step.agent,
          };
          const Icon = config.icon;
          const isBlocked = step.status === "blocked";
          const isActive = step.status === "active";
          const isDone =
            step.status === "passed" || step.status === "completed";

          return (
            <div
              key={i}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all",
                isBlocked
                  ? "bg-danger/5 border border-danger/10"
                  : "hover:bg-raised/30"
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Status icon */}
              <div className="shrink-0">
                {isBlocked ? (
                  <XCircle size={14} className="text-danger" />
                ) : isActive ? (
                  <Loader2 size={14} className="text-accent animate-spin" />
                ) : isDone ? (
                  <CheckCircle2 size={14} className="text-success" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-text-muted" />
                )}
              </div>

              {/* Agent icon & name */}
              <Icon
                size={13}
                className={cn(
                  "shrink-0",
                  isBlocked
                    ? "text-danger"
                    : isDone
                    ? "text-text-secondary"
                    : "text-text-muted"
                )}
              />
              <span
                className={cn(
                  "flex-1 font-medium",
                  isBlocked
                    ? "text-danger"
                    : isDone
                    ? "text-text-primary"
                    : "text-text-muted"
                )}
              >
                {config.label}
              </span>

              {/* Detail */}
              {step.detail && (
                <span className="text-text-muted text-[10px] hidden sm:block">
                  {step.detail}
                </span>
              )}

              {/* Duration */}
              {step.duration_ms !== undefined && (
                <span className="font-mono text-[10px] text-text-muted tabular-nums">
                  {step.duration_ms}ms
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
