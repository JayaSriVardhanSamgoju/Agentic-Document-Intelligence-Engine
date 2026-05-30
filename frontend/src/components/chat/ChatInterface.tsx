"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStreamingQuery } from "@/hooks/useStreamingQuery";
import { MessageBubble } from "./MessageBubble";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { ChatInput } from "./ChatInput";
import { queryDocument } from "@/services/api";
import { useChatStore } from "@/store/chatStore";
import { generateId } from "@/lib/utils";
import type { Message } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ChevronDown } from "lucide-react";

export function ChatInterface() {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [useStreaming, setUseStreaming] = useState(true);

  const {
    sessions,
    activeSessionId,
    messages: allMessages,
    createNewSession,
    addMessage,
  } = useChatStore();

  const {
    streamedText,
    isStreaming,
    startStream,
    stopStream,
    error: streamError,
    reset: resetStream,
  } = useStreamingQuery();

  // Get messages for active session
  const messages = activeSessionId ? allMessages[activeSessionId] || [] : [];

  // Ensure there's always an active session for the current role
  useEffect(() => {
    const roleSessions = sessions.filter(s => s.ownerRole === user?.role);
    if (!activeSessionId && user?.role) {
      createNewSession(user.role);
    } else if (activeSessionId) {
      // Validate that the active session actually belongs to this user
      const currentSession = sessions.find(s => s.id === activeSessionId);
      if (currentSession && currentSession.ownerRole !== user?.role) {
        useChatStore.getState().setActiveSession("");
      }
    }
  }, [activeSessionId, user?.role, sessions, createNewSession]);

  // Scroll management
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isTyping, streamedText, scrollToBottom]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSend = async (query: string) => {
    if (!query.trim() || !user || !activeSessionId) return;

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: query,
      timestamp: new Date().toISOString(),
      sessionId: activeSessionId,
    };

    addMessage(activeSessionId, userMsg);
    setIsTyping(true);

    if (useStreaming) {
      resetStream();
      try {
        await startStream(query, activeSessionId);
      } catch {
        // Error handled by hook
      } finally {
        setIsTyping(false);
      }
    } else {
      try {
        const response = await queryDocument(query, activeSessionId);
        const aiMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: response.answer,
          timestamp: new Date().toISOString(),
          sessionId: activeSessionId,
          response,
        };
        addMessage(activeSessionId, aiMsg);
      } catch (error: any) {
        const errMsg: Message = {
          id: generateId(),
          role: "assistant",
          content:
            error?.status === 403
              ? "You don't have permission to perform this action."
              : "Sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date().toISOString(),
          sessionId: activeSessionId,
        };
        addMessage(activeSessionId, errMsg);
      } finally {
        setIsTyping(false);
      }
    }
  };

  // Sync completed stream to messages
  useEffect(() => {
    if (!isStreaming && streamedText && activeSessionId) {
      const aiMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: streamedText,
        timestamp: new Date().toISOString(),
        sessionId: activeSessionId,
      };
      addMessage(activeSessionId, aiMsg);
      resetStream();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming]);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] relative">
      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pb-40 space-y-4 scroll-smooth px-3 md:px-6 pt-4"
      >
        {messages.length === 0 && !isStreaming ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-10"
          >
            <div className="w-20 h-20 rounded-3xl bg-accent/5 flex items-center justify-center ring-1 ring-accent/10">
              <Sparkles className="w-10 h-10 text-accent/60" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-text-primary">
              Start a Conversation
            </h2>
            <p className="text-text-secondary text-sm max-w-md leading-relaxed">
              Ask questions about your documents. Every answer is verified by a
              6-agent AI pipeline with full observability.
            </p>
            <SuggestedPrompts onSelect={handleSend} />
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <MessageBubble message={message} />
              </motion.div>
            ))}

            {/* Streaming bubble */}
            {isStreaming && streamedText && (
              <motion.div
                key="streaming-bubble"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <MessageBubble
                  message={{
                    id: "streaming",
                    role: "assistant",
                    content: streamedText,
                    timestamp: new Date().toISOString(),
                    isStreaming: true,
                  }}
                />
              </motion.div>
            )}

            {/* Typing indicator */}
            {isTyping && !isStreaming && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 w-full max-w-3xl mx-auto"
              >
                <div className="w-8 h-8 shrink-0 rounded-full bg-accent/10 ring-1 ring-accent/20 flex items-center justify-center mt-1">
                  <Sparkles size={14} className="text-accent" />
                </div>
                <div className="px-4 py-3 rounded-2xl bubble-ai flex items-center gap-3">
                  <Loader2
                    size={14}
                    className="animate-spin text-accent"
                  />
                  <span className="text-xs font-medium text-text-secondary animate-pulse">
                    Agent pipeline executing...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-44 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full glass text-xs text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors"
        >
          <ChevronDown size={14} />
          New messages
        </button>
      )}

      {/* Input Area */}
      <ChatInput
        onSend={handleSend}
        isLoading={isTyping || isStreaming}
        isStreaming={isStreaming}
        onStop={stopStream}
        useStreaming={useStreaming}
        onToggleStreaming={() => setUseStreaming(!useStreaming)}
      />
    </div>
  );
}
