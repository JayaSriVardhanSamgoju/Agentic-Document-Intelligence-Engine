"use client";

import { FileSearch, Shield, Brain, BarChart3, MessageSquare, Zap } from "lucide-react";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const PROMPTS = [
  { icon: FileSearch, title: "Summarize the document", desc: "Get a high-level overview" },
  { icon: Brain, title: "What are the key findings?", desc: "Extract main insights" },
  { icon: Shield, title: "Explain the guardrails setup", desc: "Security architecture" },
  { icon: BarChart3, title: "Analyze financial metrics", desc: "Numbers and trends" },
  { icon: MessageSquare, title: "What are the main topics?", desc: "Topic extraction" },
  { icon: Zap, title: "Compare sections A and B", desc: "Cross-reference analysis" },
];

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-w-2xl w-full mt-4">
      {PROMPTS.map((p, i) => (
        <button
          key={i}
          onClick={() => onSelect(p.title)}
          className="flex items-start gap-3 p-3 rounded-xl glass-card-hover text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-accent/5 flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
            <p.icon size={14} className="text-accent/60 group-hover:text-accent transition-colors" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-primary truncate">{p.title}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{p.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
