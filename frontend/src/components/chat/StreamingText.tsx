"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface StreamingTextProps {
  text: string;
}

export function StreamingText({ text }: StreamingTextProps) {
  return (
    <div className="prose-chat text-text-primary text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      <span className="inline-block w-0.5 h-4 bg-accent ml-0.5 animate-blink align-middle" />
    </div>
  );
}
