"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/contexts/AuthContext";
import { healthCheck } from "@/services/api";
import type { HealthResponse } from "@/types";
import {
  Shield,
  Users,
  Activity,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const mockUsers = [
  { username: "admin", role: "admin" },
  { username: "researcher", role: "researcher" },
  { username: "viewer", role: "viewer" },
];

const roleBadge = {
  admin: "danger" as const,
  researcher: "info" as const,
  viewer: "default" as const,
};

export default function AdminPage() {
  const { user } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(false);

  useEffect(() => {
    healthCheck()
      .then((res) => {
        setHealth(res);
        setHealthError(false);
      })
      .catch(() => setHealthError(true))
      .finally(() => setHealthLoading(false));
  }, []);

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <Shield size={48} className="mx-auto text-destructive/50" />
          <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
          <p className="text-sm text-muted-foreground">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center ring-1 ring-destructive/20">
            <Shield size={20} className="text-destructive" />
          </div>
          Admin Panel
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          System administration, user management, and health monitoring.
        </p>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity size={16} className="text-green-400" />
            System Health
          </CardTitle>
          <CardDescription>Backend API status</CardDescription>
        </CardHeader>
        <CardContent>
          {healthLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              Checking backend...
            </div>
          ) : healthError ? (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle size={16} />
              Backend unreachable
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">API Status</span>
                <Badge variant="success" dot>
                  <CheckCircle2 size={12} className="mr-1" />
                  {health?.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Application</span>
                <span className="text-sm text-muted-foreground">{health?.app_name}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            User Management
          </CardTitle>
          <CardDescription>Registered users and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockUsers.map((u) => (
              <div
                key={u.username}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary ring-1 ring-primary/20">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{u.username}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                </div>
                <Badge variant={roleBadge[u.role as keyof typeof roleBadge]} dot>
                  {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={16} className="text-accent" />
            RBAC Permissions Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Permission</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Admin</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Researcher</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Viewer</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { perm: "Query Documents", admin: true, researcher: true, viewer: true },
                  { perm: "Upload Documents", admin: true, researcher: false, viewer: false },
                  { perm: "Delete Documents", admin: true, researcher: false, viewer: false },
                  { perm: "View Citations", admin: true, researcher: true, viewer: false },
                  { perm: "Manage Users", admin: true, researcher: false, viewer: false },
                ].map((row) => (
                  <tr key={row.perm} className="border-b border-border/20">
                    <td className="py-3 px-4 text-foreground">{row.perm}</td>
                    {[row.admin, row.researcher, row.viewer].map((has, i) => (
                      <td key={i} className="text-center py-3 px-4">
                        {has ? (
                          <CheckCircle2 size={16} className="text-success mx-auto" />
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
