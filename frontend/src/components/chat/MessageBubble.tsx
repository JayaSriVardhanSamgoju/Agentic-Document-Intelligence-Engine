"use client";

import type { Message } from "@/types";
import { Sparkles, User } from "lucide-react";
import { ResponseCard } from "./ResponseCard";
import { StreamingText } from "./StreamingText";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex gap-3 justify-end w-full max-w-3xl mx-auto">
        <div className="max-w-[80%]">
          <div className="px-4 py-3 rounded-2xl rounded-tr-md bubble-user text-sm text-white leading-relaxed">
            {message.content}
          </div>
          <p className="text-[10px] text-text-muted mt-1 text-right font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="w-8 h-8 shrink-0 rounded-full bg-accent/20 flex items-center justify-center mt-1">
          <User size={14} className="text-accent" />
        </div>
      </div>
    );
  }

  // AI message
  return (
    <div className="flex gap-3 w-full max-w-3xl mx-auto">
      <div className="w-8 h-8 shrink-0 rounded-full bg-accent/10 ring-1 ring-accent/20 flex items-center justify-center mt-1">
        <Sparkles size={14} className="text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        {message.isStreaming ? (
          <div className="px-4 py-3 rounded-2xl rounded-tl-md bubble-ai">
            <StreamingText text={message.content} />
          </div>
        ) : message.response ? (
          <ResponseCard response={message.response} />
        ) : (
          <div className="px-4 py-3 rounded-2xl rounded-tl-md bubble-ai">
            <div className="prose-chat text-text-primary text-sm">
              {message.content}
            </div>
          </div>
        )}
        <p className="text-[10px] text-text-muted mt-1 font-mono">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
