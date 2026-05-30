"use client";

import { useState } from "react";
import { Send, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (query: string) => void;
  isLoading: boolean;
  isStreaming: boolean;
  onStop: () => void;
  useStreaming: boolean;
  onToggleStreaming: () => void;
}

export function ChatInput({
  onSend,
  isLoading,
  isStreaming,
  onStop,
  useStreaming,
  onToggleStreaming,
}: ChatInputProps) {
  const [query, setQuery] = useState("");

  const handleSend = () => {
    if (!query.trim() || isLoading) return;
    onSend(query.trim());
    setQuery("");
  };

  return (
    <div className="absolute bottom-0 left-0 w-full pt-6 pb-4 bg-gradient-to-t from-void via-void to-transparent px-3 md:px-6">
      <div className="max-w-3xl mx-auto w-full relative">
        <div className="glass p-2 rounded-2xl flex items-end gap-2 focus-within:ring-1 focus-within:ring-accent/30 transition-all shadow-2xl shadow-black/40">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about your documents..."
            className="flex-1 max-h-40 min-h-[48px] bg-transparent border-0 focus:ring-0 resize-none px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none scrollbar-hide leading-relaxed"
            rows={1}
          />

          {isStreaming ? (
            <button
              onClick={onStop}
              className="h-11 w-11 shrink-0 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 flex items-center justify-center transition-colors"
            >
              <StopCircle size={18} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!query.trim() || isLoading}
              className={cn(
                "h-11 w-11 shrink-0 rounded-xl flex items-center justify-center transition-all",
                query.trim() && !isLoading
                  ? "bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-dim"
                  : "bg-raised text-text-muted cursor-not-allowed"
              )}
            >
              <Send size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 px-2">
          <p className="text-[10px] text-text-muted/60 font-medium tracking-wide uppercase">
            AI can make mistakes. Verify important information.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-muted">Streaming</span>
            <button
              onClick={onToggleStreaming}
              className={cn(
                "w-7 h-3.5 rounded-full transition-colors relative",
                useStreaming ? "bg-accent" : "bg-raised"
              )}
            >
              <div
                className={cn(
                  "w-2.5 h-2.5 bg-white rounded-full absolute top-0.5 transition-transform",
                  useStreaming ? "translate-x-3.5" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
