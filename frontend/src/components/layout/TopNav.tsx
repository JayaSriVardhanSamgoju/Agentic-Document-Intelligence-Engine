"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Menu, LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { getInitials } from "@/lib/utils";

interface TopNavProps {
  onMenuClick: () => void;
}

const ROLE_BADGE_VARIANT = {
  admin: "danger" as const,
  researcher: "warning" as const,
  viewer: "success" as const,
};

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="h-14 border-b border-subtle bg-deep/80 backdrop-blur-lg flex items-center justify-between px-4 shrink-0">
      {/* Left: Mobile menu + page context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-text-muted hover:text-text-primary transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-text-muted font-medium">
            System Online
          </span>
        </div>
      </div>

      {/* Right: Role badge + user + actions */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            <Badge variant={ROLE_BADGE_VARIANT[user.role]}>
              {user.role}
            </Badge>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent/10 ring-1 ring-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                {getInitials(user.username)}
              </div>
              <span className="text-xs text-text-secondary font-medium">
                {user.username}
              </span>
            </div>
            {/* Mobile-only action buttons */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => router.push("/")}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-raised/50 transition-colors"
              >
                <Home size={16} />
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/5 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
