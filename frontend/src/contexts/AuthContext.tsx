"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { login as loginApi, ApiError } from "@/services/api";
import type { User, UserRole, Permission } from "@/types";
import { decodeJWT } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";

// --- Types ---
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

// --- Permissions Map ---
const ROLE_PERMS: Record<UserRole, Permission[]> = {
  admin: ["upload", "query", "delete", "manage_users", "view_citations"],
  researcher: ["query", "view_citations"],
  viewer: ["query"],
};

// --- Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem("auth_user");
    setUser(null);
    router.push("/login");
  }, [router]);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        const parsed: User = JSON.parse(stored);
        const decoded = decodeJWT(parsed.token);

        if (decoded?.exp && Date.now() > decoded.exp * 1000) {
          // Token expired
          localStorage.removeItem("auth_user");
        } else {
          setUser(parsed);

          // Auto-logout timer
          if (decoded?.exp) {
            const msUntilExpiry = decoded.exp * 1000 - Date.now();
            const timer = setTimeout(logout, msUntilExpiry);
            return () => clearTimeout(timer);
          }
        }
      }
    } catch {
      localStorage.removeItem("auth_user");
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const login = async (username: string, password: string) => {
    const response = await loginApi(username, password);

    // Decode role from JWT if not in response
    const decoded = decodeJWT(response.access_token);
    const role: UserRole = response.role || decoded?.role || "viewer";

    const newUser: User = {
      username,
      role,
      token: response.access_token,
    };

    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setUser(newUser);

    // Clear active session to enforce a new chat on login
    useChatStore.getState().setActiveSession("");

    // Set auto-logout timer
    if (decoded?.exp) {
      const msUntilExpiry = decoded.exp * 1000 - Date.now();
      setTimeout(logout, msUntilExpiry);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMS[user.role]?.includes(permission) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
