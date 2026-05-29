"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
}

export function StreamingText({ content, isStreaming }: StreamingTextProps) {
  const [displayText, setDisplayText] = useState(content);

  useEffect(() => {
    setDisplayText(content);
  }, [content]);

  return (
    <div className="prose prose-invert prose-chat max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {displayText + (isStreaming ? " ▋" : "")}
      </ReactMarkdown>
    </div>
  );
}
