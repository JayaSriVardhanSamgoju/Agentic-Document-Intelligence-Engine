"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { Permission } from "@/types";
import { ShieldX } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
}

function AccessDenied({ permission }: { permission: string }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center">
        <ShieldX className="w-8 h-8 text-danger" />
      </div>
      <h2 className="text-xl font-bold text-text-primary">Access Restricted</h2>
      <p className="text-text-secondary text-sm max-w-md">
        You don&apos;t have the <span className="text-accent font-mono">{permission}</span> permission
        required to access this page. Contact your administrator for access.
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-2 px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
      >
        ← Back to Chat
      </button>
    </div>
  );
}

export function ProtectedRoute({
  children,
  requiredPermission,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <AccessDenied permission={requiredPermission} />;
  }

  return <>{children}</>;
}
