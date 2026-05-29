"use client";

import type { Message } from "@/types";
import { cn } from "@/lib/utils";
import { User, Bot, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AgentTracePanel } from "./AgentTracePanel";
import { CitationViewer } from "./CitationViewer";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { EvaluationPanel } from "./EvaluationPanel";
import { StreamingText } from "./StreamingText";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "flex w-full gap-4 max-w-4xl mx-auto",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 shadow-sm ring-1 ring-black/5",
          isUser ? "bg-white text-blue-600" : "bg-primary text-white"
        )}
      >
        {isUser ? <User size={16} strokeWidth={2.5} /> : <Bot size={16} strokeWidth={2.5} />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "px-5 py-4 rounded-2xl max-w-[85%] shadow-sm",
          isUser
            ? "bubble-user text-white rounded-tr-sm"
            : "bubble-ai text-foreground rounded-tl-sm ring-1 ring-white/5"
        )}
      >
        {/* Content */}
        <div className="text-[15px] leading-relaxed">
          {message.isStreaming ? (
            <StreamingText content={message.content} isStreaming={true} />
          ) : isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-chat max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* AI Metadata (Citations, Confidence, Trace) */}
        {!isUser && !message.isStreaming && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
            {/* Header: Confidence & Toggle */}
            <div className="flex items-center justify-between">
              {message.confidence !== undefined && (
                <ConfidenceBadge score={message.confidence} />
              )}
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md"
              >
                {isExpanded ? "Hide Details" : "View Details"}
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Citations */}
            {message.citations && message.citations.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Sources
                </span>
                <CitationViewer citations={message.citations} />
              </div>
            )}

            {/* Expanded Details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-5">
                    {/* Agent Trace */}
                    {message.agentTrace && message.agentTrace.length > 0 && (
                      <div className="bg-black/20 rounded-xl p-4 ring-1 ring-white/5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 block">
                          Agent Pipeline
                        </span>
                        <AgentTracePanel trace={message.agentTrace} />
                      </div>
                    )}

                    {/* Evaluation */}
                    {message.evaluation && (
                      <div className="bg-black/20 rounded-xl p-4 ring-1 ring-white/5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 block">
                          Quality Evaluation
                        </span>
                        <EvaluationPanel evaluation={message.evaluation} />
                      </div>
                    )}

                    {/* Reasoning */}
                    {message.reasoning && (
                      <div className="bg-black/20 rounded-xl p-4 ring-1 ring-white/5">
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 block">
                          Internal Reasoning
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                          {message.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
