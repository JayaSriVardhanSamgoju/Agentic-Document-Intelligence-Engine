"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LogOut, Menu } from "lucide-react";

interface TopNavProps {
  onMenuClick: () => void;
}

const roleBadgeVariant = {
  admin: "danger" as const,
  researcher: "info" as const,
  viewer: "default" as const,
};

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 glass-strong border-b border-border/50 flex items-center justify-between px-4 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-muted-foreground"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            <Badge variant={roleBadgeVariant[user.role]} dot>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>

            <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary ring-1 ring-primary/20">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              icon={<LogOut size={14} />}
            >
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
