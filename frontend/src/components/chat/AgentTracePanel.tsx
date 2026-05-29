"use client";

import { Badge } from "@/components/ui/Badge";
import type { AgentTrace } from "@/types";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Brain,
  Search,
  FileText,
  CheckCircle2,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

interface AgentTracePanelProps {
  trace: AgentTrace[];
}

const agentIcons: Record<string, React.ReactNode> = {
  input_guardrails: <ShieldCheck size={14} />,
  planner: <Brain size={14} />,
  retriever: <Search size={14} />,
  synthesizer: <FileText size={14} />,
  verifier: <CheckCircle2 size={14} />,
  output_guardrails: <ShieldAlert size={14} />,
};

const statusColors: Record<string, string> = {
  completed: "text-success",
  success: "text-success",
  failed: "text-destructive",
  running: "text-warning animate-pulse",
  pending: "text-muted-foreground",
};

function getIcon(agentName: string) {
  const key = agentName.toLowerCase().replace(/\s+/g, "_");
  return agentIcons[key] || <Brain size={14} />;
}

export function AgentTracePanel({ trace }: AgentTracePanelProps) {
  if (!trace || trace.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {trace.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 }}
          className="flex items-center gap-2.5 text-xs"
        >
          {/* Connector line */}
          <div className="flex flex-col items-center w-5">
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center ring-1",
                step.status === "completed" || step.status === "success"
                  ? "bg-success/15 ring-success/30 text-success"
                  : step.status === "failed"
                  ? "bg-destructive/15 ring-destructive/30 text-destructive"
                  : "bg-warning/15 ring-warning/30 text-warning"
              )}
            >
              {getIcon(step.agent)}
            </div>
            {index < trace.length - 1 && (
              <div className="w-px h-3 bg-border/50 mt-0.5" />
            )}
          </div>

          {/* Label */}
          <span className="text-muted-foreground flex-1 truncate">
            {step.agent}
          </span>

          {/* Status */}
          <Badge
            variant={
              step.status === "completed" || step.status === "success"
                ? "success"
                : step.status === "failed"
                ? "danger"
                : "warning"
            }
          >
            {step.status}
          </Badge>

          {/* Timestamp */}
          {step.timestamp && (
            <span className="text-muted-foreground/60 flex items-center gap-1">
              <Clock size={10} />
              {step.timestamp}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
