"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  MessageSquare,
  Upload,
  BarChart3,
  Settings,
  Shield,
  Plus,
  Sparkles,
  X,
  Trash2,
} from "lucide-react";
import { cn, truncate } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";

interface SidebarProps {
  onClose?: () => void;
}

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Chat",
    icon: MessageSquare,
    permission: null,
  },
  {
    href: "/dashboard/upload",
    label: "Upload",
    icon: Upload,
    permission: "upload" as const,
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: BarChart3,
    permission: null,
    excludeRoles: ["viewer" as const],
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    permission: null,
  },
  {
    href: "/dashboard/admin",
    label: "Admin",
    icon: Shield,
    permission: "manage_users" as const,
  },
];

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const { sessions, activeSessionId, createNewSession, setActiveSession, deleteSession } =
    useChatStore();

  const handleNewChat = () => {
    createNewSession(user?.role);
    router.push("/dashboard");
    onClose?.();
  };

  const handleSessionClick = (sessionId: string) => {
    setActiveSession(sessionId);
    router.push("/dashboard");
    onClose?.();
  };

  return (
    <aside className="h-full w-64 bg-deep border-r border-subtle flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-subtle flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center ring-1 ring-accent/20">
            <Sparkles size={16} className="text-accent" />
          </div>
          <span className="text-sm font-bold text-text-primary tracking-tight">
            Agentic <span className="text-accent/80 font-medium">AI</span>
          </span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden text-text-muted hover:text-text-primary"
        >
          <X size={18} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-default text-sm text-text-secondary hover:text-text-primary hover:bg-raised/50 transition-all group"
        >
          <Plus
            size={16}
            className="text-accent group-hover:rotate-90 transition-transform"
          />
          New Chat
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 scrollbar-hide">
        {sessions.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-2 mb-2">
              Recent Chats
            </p>
            <div className="space-y-0.5">
              {sessions
                .filter((s) => s.ownerRole === user?.role)
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 20)
                .map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors text-sm",
                      activeSessionId === session.id
                        ? "bg-accent/10 text-accent"
                        : "text-text-secondary hover:bg-raised/50 hover:text-text-primary"
                    )}
                    onClick={() => handleSessionClick(session.id)}
                  >
                    <MessageSquare size={14} className="shrink-0 opacity-50" />
                    <span className="flex-1 truncate text-xs">
                      {truncate(session.title, 28)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-all shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-3 border-t border-subtle space-y-0.5">
        {NAV_ITEMS.filter((item) => {
          if (item.permission && !hasPermission(item.permission)) return false;
          if (
            item.excludeRoles &&
            user?.role &&
            (item.excludeRoles as string[]).includes(user.role)
          )
            return false;
          return true;
        }).map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-text-secondary hover:bg-raised/50 hover:text-text-primary"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      {user && (
        <div className="p-3 border-t border-subtle">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">
                {user.username}
              </p>
              <p className="text-[10px] text-text-muted capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
