"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Settings,
  Moon,
  Zap,
  Brain,
  Shield,
  Info,
} from "lucide-react";

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "w-10 h-5 rounded-full transition-colors relative",
        enabled ? "bg-primary" : "bg-white/10"
      )}
    >
      <div
        className={cn(
          "w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform",
          enabled ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [streaming, setStreaming] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [memory, setMemory] = useState(true);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
            <Settings size={20} className="text-primary" />
          </div>
          Settings
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Configure your AI experience, appearance, and security preferences.
        </p>
      </div>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain size={16} className="text-primary" />
            AI Configuration
          </CardTitle>
          <CardDescription>Tune how the AI assistant responds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Streaming Responses</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Stream words in real-time vs waiting for full response
              </p>
            </div>
            <Toggle enabled={streaming} onChange={setStreaming} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Session Memory</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Remember conversation context across messages
              </p>
            </div>
            <Toggle enabled={memory} onChange={setMemory} />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon size={16} className="text-accent" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Use dark theme (recommended)
              </p>
            </div>
            <Toggle enabled={darkMode} onChange={setDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={16} className="text-green-400" />
            Security
          </CardTitle>
          <CardDescription>Authentication and access control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground">Authentication</p>
            <Badge variant="success" dot>JWT Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground">Access Control</p>
            <Badge variant="info" dot>RBAC Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground">Token Storage</p>
            <Badge variant="default">localStorage</Badge>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={16} className="text-muted-foreground" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p><strong className="text-foreground">App:</strong> Agentic Document Intelligence Engine</p>
          <p><strong className="text-foreground">Version:</strong> 1.0.0</p>
          <p><strong className="text-foreground">Stack:</strong> Next.js · FastAPI · LangChain · Groq · FAISS</p>
        </CardContent>
      </Card>
    </div>
  );
}
