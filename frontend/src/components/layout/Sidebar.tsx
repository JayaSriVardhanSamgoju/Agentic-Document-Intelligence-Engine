"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Upload,
  BarChart3,
  Settings,
  Shield,
  Sparkles,
  X,
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Chat", icon: MessageSquare, permission: null },
  { href: "/dashboard/upload", label: "Upload Documents", icon: Upload, permission: "upload" as const },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, permission: null },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, permission: null },
  { href: "/dashboard/admin", label: "Admin Panel", icon: Shield, permission: "manage_users" as const },
];

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { hasPermission } = useAuth();

  const filteredItems = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <aside className="h-full w-64 glass-strong flex flex-col border-r border-border/50">
      {/* Logo */}
      <div className="p-5 flex items-center justify-between border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center ring-1 ring-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-foreground leading-none">
              Agentic
            </h2>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
              Document Intelligence
            </p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon
                size={18}
                className={cn(
                  "transition-colors shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground/60 text-center">
          v1.0.0 • Enterprise AI
        </p>
      </div>
    </aside>
  );
}
