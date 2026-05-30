"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useChatStore } from "@/store/chatStore";
import { Badge } from "@/components/ui/Badge";
import { decodeJWT } from "@/lib/utils";
import {
  BrainCircuit,
  MessageSquare,
  Moon,
  ShieldAlert,
  Download,
  Trash2,
  LogOut,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { clearAllHistory, sessions } = useChatStore();

  // Local state for UI toggles (could be persisted to localStorage in a real app)
  const [streaming, setStreaming] = useState(true);
  const [showTrace, setShowTrace] = useState(true);
  const [showEval, setShowEval] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [sessionMemory, setSessionMemory] = useState(true);
  const [expiryMins, setExpiryMins] = useState<number | null>(null);

  useEffect(() => {
    if (user?.token) {
      const decoded = decodeJWT(user.token);
      if (decoded?.exp) {
        const updateExpiry = () => {
          const mins = Math.max(0, Math.floor((decoded.exp * 1000 - Date.now()) / 60000));
          setExpiryMins(mins);
        };
        updateExpiry();
        const int = setInterval(updateExpiry, 60000);
        return () => clearInterval(int);
      }
    }
  }, [user]);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const node = document.createElement('a');
    node.setAttribute("href", dataStr);
    node.setAttribute("download", "adie_chat_export.json");
    document.body.appendChild(node);
    node.click();
    node.remove();
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all chat history? This cannot be undone.")) {
      clearAllHistory();
    }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={cn(
        "w-10 h-5 rounded-full transition-colors relative shrink-0",
        checked ? "bg-accent" : "bg-raised"
      )}
    >
      <div
        className={cn(
          "w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Preferences
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Manage your account settings and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* AI Settings */}
          <div className="glass-card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-subtle">
              <BrainCircuit size={16} className="text-accent" />
              <h3 className="text-sm font-bold text-text-primary">AI Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Default Model</p>
                  <p className="text-xs text-text-muted">Currently active LLM model</p>
                </div>
                <Badge variant="default">llama-3.3-70b-versatile</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Stream Responses</p>
                  <p className="text-xs text-text-muted">Show words as they are generated</p>
                </div>
                <Toggle checked={streaming} onChange={() => setStreaming(!streaming)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Show Agent Trace</p>
                  <p className="text-xs text-text-muted">Display pipeline execution steps</p>
                </div>
                <Toggle checked={showTrace} onChange={() => setShowTrace(!showTrace)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Show Evaluation</p>
                  <p className="text-xs text-text-muted">Display confidence metrics</p>
                </div>
                <Toggle checked={showEval} onChange={() => setShowEval(!showEval)} />
              </div>
            </div>
          </div>

          {/* Memory Settings */}
          <div className="glass-card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-subtle">
              <MessageSquare size={16} className="text-violet-glow" />
              <h3 className="text-sm font-bold text-text-primary">Session Memory</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Context Aware</p>
                  <p className="text-xs text-text-muted">AI remembers previous messages in chat</p>
                </div>
                <Toggle checked={sessionMemory} onChange={() => setSessionMemory(!sessionMemory)} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Appearance */}
          <div className="glass-card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-subtle">
              <Settings2 size={16} className="text-success" />
              <h3 className="text-sm font-bold text-text-primary">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Theme</p>
                  <p className="text-xs text-text-muted">Color mode</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-raised border border-subtle">
                  <Moon size={14} className="text-accent" />
                  <span className="text-xs font-semibold">Dark Cyberpunk</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Compact UI</p>
                  <p className="text-xs text-text-muted">Reduce padding in chat interface</p>
                </div>
                <Toggle checked={compactMode} onChange={() => setCompactMode(!compactMode)} />
              </div>
            </div>
          </div>

          {/* Data & Security */}
          <div className="glass-card border-danger/20 space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-danger/5" />
            <div className="relative">
              <div className="flex items-center gap-2 pb-2 border-b border-danger/20 mb-4">
                <ShieldAlert size={16} className="text-danger" />
                <h3 className="text-sm font-bold text-danger">Data & Security</h3>
              </div>
              
              <div className="space-y-5">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Current Session</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-primary">Logged in as: <span className="font-bold">{user?.username}</span></p>
                    <Badge variant="warning">{user?.role}</Badge>
                  </div>
                  {expiryMins !== null && (
                    <p className="text-xs text-text-muted">Token expires in approx. {expiryMins} minutes</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleExportJSON}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-subtle bg-raised/50 hover:bg-raised transition-colors group"
                  >
                    <Download size={18} className="text-text-muted group-hover:text-accent transition-colors" />
                    <span className="text-xs font-medium text-text-primary">Export JSON</span>
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-danger/20 bg-danger/5 hover:bg-danger/10 transition-colors group"
                  >
                    <Trash2 size={18} className="text-danger/70 group-hover:text-danger transition-colors" />
                    <span className="text-xs font-medium text-danger">Clear History</span>
                  </button>
                </div>

                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-danger/30 text-danger text-sm font-semibold hover:bg-danger/10 transition-colors mt-2"
                >
                  <LogOut size={16} />
                  Force Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
