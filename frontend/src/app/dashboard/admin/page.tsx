"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/Badge";
import { healthCheck } from "@/services/api";
import {
  Users,
  Shield,
  Activity,
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const users = [
  { id: "1", username: "admin", role: "admin", status: "active", lastLogin: "2 mins ago" },
  { id: "2", username: "researcher", role: "researcher", status: "active", lastLogin: "1 hr ago" },
  { id: "3", username: "viewer", role: "viewer", status: "active", lastLogin: "5 hrs ago" },
  { id: "4", username: "jdoe", role: "researcher", status: "inactive", lastLogin: "2 days ago" },
];

const apiLogs = [
  { id: "1", time: "10:42:01", method: "POST", path: "/query", status: 200, ms: 312, user: "researcher" },
  { id: "2", time: "10:41:15", method: "GET", path: "/health", status: 200, ms: 12, user: "admin" },
  { id: "3", time: "10:39:44", method: "POST", path: "/upload", status: 200, ms: 1240, user: "admin" },
  { id: "4", time: "10:35:22", method: "POST", path: "/query", status: 403, ms: 45, user: "viewer" },
  { id: "5", time: "10:30:10", method: "POST", path: "/query", status: 200, ms: 890, user: "admin" },
];

export default function AdminPage() {
  const [health, setHealth] = useState<"checking" | "online" | "offline">("checking");
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const start = Date.now();
        await healthCheck();
        setLatency(Date.now() - start);
        setHealth("online");
      } catch {
        setHealth("offline");
      }
    };
    check();
    const interval = setInterval(check, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <ProtectedRoute requiredPermission="manage_users">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Admin Console
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage users, permissions, and monitor system health.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Users & Permissions */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* User Management */}
            <div className="glass-card flex flex-col h-fit">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-accent" />
                  <h3 className="text-sm font-bold text-text-primary">User Management</h3>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors">
                  + Add User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-subtle text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      <th className="pb-3 px-2">User</th>
                      <th className="pb-3 px-2">Role</th>
                      <th className="pb-3 px-2">Status</th>
                      <th className="pb-3 px-2">Last Login</th>
                      <th className="pb-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-subtle">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-raised/20 transition-colors">
                        <td className="py-3 px-2 font-medium text-text-primary">{u.username}</td>
                        <td className="py-3 px-2">
                          <Badge variant={u.role === "admin" ? "danger" : u.role === "researcher" ? "warning" : "success"}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1.5">
                            <div className={cn("w-1.5 h-1.5 rounded-full", u.status === "active" ? "bg-success" : "bg-text-muted")} />
                            <span className="text-text-secondary text-xs capitalize">{u.status}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-text-muted text-xs">{u.lastLogin}</td>
                        <td className="py-3 px-2 text-right">
                          <button className="p-1 rounded hover:bg-raised text-text-muted transition-colors">
                            <MoreVertical size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Permissions Matrix */}
            <div className="glass-card">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={16} className="text-violet-glow" />
                <h3 className="text-sm font-bold text-text-primary">Permissions Matrix</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-subtle text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      <th className="pb-3 text-left">Role</th>
                      <th className="pb-3 px-2">Query</th>
                      <th className="pb-3 px-2">Upload</th>
                      <th className="pb-3 px-2">Delete</th>
                      <th className="pb-3 px-2">Manage Users</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-subtle">
                    {[
                      { role: "admin", query: true, upload: true, del: true, users: true },
                      { role: "researcher", query: true, upload: false, del: false, users: false },
                      { role: "viewer", query: true, upload: false, del: false, users: false },
                    ].map((r) => (
                      <tr key={r.role} className="hover:bg-raised/20 transition-colors">
                        <td className="py-3 text-left font-medium capitalize text-text-secondary">{r.role}</td>
                        <td className="py-3"><CheckCircle2 size={14} className="mx-auto text-success" /></td>
                        <td className="py-3">{r.upload ? <CheckCircle2 size={14} className="mx-auto text-success" /> : <XCircle size={14} className="mx-auto text-danger/50" />}</td>
                        <td className="py-3">{r.del ? <CheckCircle2 size={14} className="mx-auto text-success" /> : <XCircle size={14} className="mx-auto text-danger/50" />}</td>
                        <td className="py-3">{r.users ? <CheckCircle2 size={14} className="mx-auto text-success" /> : <XCircle size={14} className="mx-auto text-danger/50" />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Health & Logs */}
          <div className="col-span-1 space-y-6">
            {/* System Health */}
            <div className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-success" />
                  <h3 className="text-sm font-bold text-text-primary">System Health</h3>
                </div>
                {health === "checking" && <div className="w-3 h-3 border-2 border-text-muted border-t-text-primary rounded-full animate-spin" />}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-raised/30 border border-subtle">
                  <div>
                    <p className="text-xs font-semibold text-text-primary">FastAPI Backend</p>
                    <p className="text-[10px] text-text-muted mt-0.5">Core API server</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant={health === "online" ? "success" : health === "offline" ? "danger" : "default"}>
                      {health.toUpperCase()}
                    </Badge>
                    {latency !== null && health === "online" && (
                      <span className="text-[10px] font-mono text-text-muted mt-1">{latency}ms ping</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-raised/30 border border-subtle">
                  <div>
                    <p className="text-xs font-semibold text-text-primary">FAISS Index</p>
                    <p className="text-[10px] text-text-muted mt-0.5">Vector database</p>
                  </div>
                  <Badge variant="success">READY</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-raised/30 border border-subtle">
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Groq LLM</p>
                    <p className="text-[10px] text-text-muted mt-0.5">llama-3.3-70b-versatile</p>
                  </div>
                  <Badge variant="success">CONNECTED</Badge>
                </div>
              </div>
            </div>

            {/* API Logs */}
            <div className="glass-card flex flex-col h-[400px]">
              <div className="flex items-center gap-2 mb-4">
                <Terminal size={16} className="text-accent" />
                <h3 className="text-sm font-bold text-text-primary">API Traffic</h3>
              </div>
              <div className="flex-1 overflow-auto bg-void rounded-lg p-3 font-mono text-[10px] space-y-2 border border-subtle">
                {apiLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 border-b border-subtle/50 pb-2 last:border-0">
                    <span className="text-text-muted shrink-0 flex items-center gap-1">
                      <Clock size={10} /> {log.time}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn("font-bold", log.method === "GET" ? "text-success" : "text-warning")}>{log.method}</span>
                        <span className="text-text-primary truncate">{log.path}</span>
                        <span className={cn(log.status === 200 ? "text-success" : "text-danger")}>{log.status}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-text-muted">
                        <span>{log.ms}ms</span>
                        <span>·</span>
                        <span className="text-accent">{log.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
