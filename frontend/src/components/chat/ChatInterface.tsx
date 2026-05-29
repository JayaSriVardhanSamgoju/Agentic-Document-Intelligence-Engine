"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStreamingQuery } from "@/hooks/useStreamingQuery";
import { MessageBubble } from "./MessageBubble";
import { Button } from "@/components/ui/Button";
import { queryDocument } from "@/services/api";
import type { Message } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Settings toggle for streaming vs blocking
  const [useStreaming, setUseStreaming] = useState(true);

  const {
    streamedText,
    isStreaming,
    startStream,
    stopStream,
    error: streamError
  } = useStreamingQuery();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, streamedText]);

  const handleSend = async () => {
    if (!query.trim() || !user) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsTyping(true);

    const sessionId = "default_session"; // Should come from a selected session state

    if (useStreaming) {
      try {
        await startStream(userMsg.content, sessionId, user.token);
      } catch (err) {
        console.error("Stream failed", err);
      } finally {
        setIsTyping(false);
        // Once stream ends, we should ideally fetch the full message metadata from the backend
        // or the backend stream should send it at the end. 
        // For now, we just add the finalized text as a normal message.
      }
    } else {
      try {
        const response = await queryDocument(userMsg.content, sessionId, user.token);
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.answer,
          timestamp: new Date(),
          citations: response.citations,
          confidence: response.confidence_score,
          reasoning: response.reasoning,
          agentTrace: response.agent_trace,
          evaluation: response.evaluation,
          observability: response.observability,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (error) {
        const errMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered an error while processing your request.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  // Sync completed stream to messages
  useEffect(() => {
    if (!isStreaming && streamedText) {
       const aiMsg: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: streamedText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
    }
  }, [isStreaming, streamedText]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] relative">
      <div className="flex-1 overflow-y-auto pb-32 space-y-6 scroll-smooth px-2 md:px-6">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-10"
          >
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-2 shadow-inner ring-1 ring-white/5">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Agentic <span className="gradient-text">Intelligence</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
              Enterprise-grade AI copilot. Ask questions, analyze documents, and view deep observability traces.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-2xl">
              {[
                "What is the system architecture?",
                "Analyze the latest financial report",
                "Summarize the key findings",
                "Explain the guardrails setup",
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(suggestion)}
                  className="px-4 py-2.5 rounded-full glass-card hover:bg-white/10 text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                <MessageBubble message={message} />
              </motion.div>
            ))}

            {isStreaming && streamedText && (
               <motion.div
                key="streaming-bubble"
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                <MessageBubble message={{
                  id: "streaming",
                  role: "assistant",
                  content: streamedText,
                  timestamp: new Date(),
                  isStreaming: true
                }} />
              </motion.div>
            )}

            {isTyping && !isStreaming && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-4 w-full max-w-4xl mx-auto"
              >
                <div className="w-8 h-8 shrink-0 rounded-full bg-primary text-white flex items-center justify-center mt-1 shadow-md ring-1 ring-black/5">
                  <Sparkles size={16} strokeWidth={2.5} />
                </div>
                <div className="px-5 py-4 rounded-2xl bubble-ai flex items-center gap-3 w-fit">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span className="text-sm font-medium text-muted-foreground animate-pulse">
                    Agentic workflow executing...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 w-full pt-8 pb-6 bg-gradient-to-t from-background via-background to-transparent px-4">
        <div className="max-w-4xl mx-auto w-full relative">
          <div className="glass p-2 rounded-2xl flex items-end gap-2 focus-within:ring-2 focus-within:ring-primary/50 focus-within:bg-white/[0.08] transition-all shadow-2xl">
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
              className="flex-1 max-h-48 min-h-[56px] bg-transparent border-0 focus:ring-0 resize-none px-4 py-4 text-[15px] text-white placeholder:text-muted-foreground outline-none scrollbar-hide leading-relaxed"
              rows={1}
            />
            
            {isStreaming ? (
              <Button
                variant="danger"
                size="lg"
                onClick={stopStream}
                className="h-[56px] w-[56px] shrink-0 p-0 rounded-xl"
                icon={<StopCircle size={20} />}
              />
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleSend}
                disabled={!query.trim() || isTyping}
                className={cn(
                  "h-[56px] w-[56px] shrink-0 p-0 rounded-xl",
                  query.trim() && !isTyping && "translate-x-0.5 -translate-y-0.5"
                )}
                icon={<Send size={20} strokeWidth={2.5} />}
              />
            )}
          </div>
          
          <div className="flex items-center justify-between mt-3 px-2">
            <p className="text-[11px] text-muted-foreground/80 font-medium tracking-wide">
              AI CAN MAKE MISTAKES. VERIFY IMPORTANT INFORMATION.
            </p>
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-muted-foreground">Streaming</span>
               <button 
                  onClick={() => setUseStreaming(!useStreaming)}
                  className={cn("w-8 h-4 rounded-full transition-colors relative", useStreaming ? "bg-primary" : "bg-white/10")}
               >
                 <div className={cn("w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform", useStreaming ? "translate-x-4" : "translate-x-1")} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
