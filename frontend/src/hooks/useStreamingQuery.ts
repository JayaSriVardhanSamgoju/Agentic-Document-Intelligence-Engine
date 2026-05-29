"use client";

import { useState, useCallback } from "react";
import { queryStream } from "@/services/api";

interface UseStreamingQueryReturn {
  streamedText: string;
  isStreaming: boolean;
  error: string | null;
  startStream: (query: string, sessionId: string, token: string) => Promise<void>;
  stopStream: () => void;
  reset: () => void;
}

export function useStreamingQuery(): UseStreamingQueryReturn {
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const stopStream = useCallback(() => {
    abortController?.abort();
    setIsStreaming(false);
  }, [abortController]);

  const reset = useCallback(() => {
    setStreamedText("");
    setError(null);
    setIsStreaming(false);
  }, []);

  const startStream = useCallback(
    async (query: string, sessionId: string, token: string) => {
      const controller = new AbortController();
      setAbortController(controller);
      setStreamedText("");
      setError(null);
      setIsStreaming(true);

      try {
        const response = await queryStream(query, sessionId, token);
        const reader = response.body?.getReader();

        if (!reader) {
          throw new Error("No readable stream available");
        }

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done || controller.signal.aborted) break;

          const chunk = decoder.decode(value, { stream: true });
          setStreamedText((prev) => prev + chunk);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Streaming failed");
        }
      } finally {
        setIsStreaming(false);
      }
    },
    []
  );

  return { streamedText, isStreaming, error, startStream, stopStream, reset };
}
