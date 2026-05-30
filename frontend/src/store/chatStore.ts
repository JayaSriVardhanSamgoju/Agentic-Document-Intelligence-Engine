import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message, ChatSession } from "@/types";
import { generateId, truncate } from "@/lib/utils";

interface ChatStore {
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: Record<string, Message[]>;

  createNewSession: (ownerRole?: string) => string;
  setActiveSession: (id: string) => void;
  addMessage: (sessionId: string, msg: Message) => void;
  deleteSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;
  clearAllHistory: () => void;
  getActiveMessages: () => Message[];
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      messages: {},

      createNewSession: (ownerRole?: string) => {
        const id = generateId();
        const session: ChatSession = {
          id,
          title: "New Chat",
          createdAt: new Date().toISOString(),
          messageCount: 0,
          lastMessage: "",
          sessionId: id, // backend session_id
          ownerRole: ownerRole || "viewer",
        };
        set((state) => ({
          sessions: [session, ...state.sessions],
          activeSessionId: id,
          messages: { ...state.messages, [id]: [] },
        }));
        return id;
      },

      setActiveSession: (id: string) => {
        set({ activeSessionId: id });
      },

      addMessage: (sessionId: string, msg: Message) => {
        set((state) => {
          const existing = state.messages[sessionId] || [];
          const updatedMessages = [...existing, msg];
          const updatedSessions = state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messageCount: updatedMessages.length,
                  lastMessage: truncate(msg.content, 60),
                  title:
                    s.title === "New Chat" && msg.role === "user"
                      ? truncate(msg.content, 40)
                      : s.title,
                }
              : s
          );
          return {
            messages: { ...state.messages, [sessionId]: updatedMessages },
            sessions: updatedSessions,
          };
        });
      },

      deleteSession: (id: string) => {
        set((state) => {
          const { [id]: _, ...remainingMessages } = state.messages;
          const remainingSessions = state.sessions.filter((s) => s.id !== id);
          return {
            sessions: remainingSessions,
            messages: remainingMessages,
            activeSessionId:
              state.activeSessionId === id
                ? remainingSessions[0]?.id || null
                : state.activeSessionId,
          };
        });
      },

      renameSession: (id: string, title: string) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, title } : s
          ),
        }));
      },

      clearAllHistory: () => {
        set({ sessions: [], activeSessionId: null, messages: {} });
      },

      getActiveMessages: () => {
        const state = get();
        if (!state.activeSessionId) return [];
        return state.messages[state.activeSessionId] || [];
      },
    }),
    {
      name: "adie_chat_store",
    }
  )
);
