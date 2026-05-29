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
import { login as loginApi } from "@/services/api";
import type { User, UserRole, Permission, ROLE_PERMISSIONS } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_PERMS: Record<UserRole, Permission[]> = {
  admin: ["upload", "query", "delete", "manage_users"],
  researcher: ["query", "view_citations"],
  viewer: ["query"],
};

function decodeJwtExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

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
        const expiry = decodeJwtExpiry(parsed.token);
        if (expiry && Date.now() > expiry) {
          // Token expired
          localStorage.removeItem("auth_user");
        } else {
          setUser(parsed);
          // Auto-logout timer
          if (expiry) {
            const timeout = expiry - Date.now();
            const timer = setTimeout(logout, timeout);
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
    const newUser: User = {
      username,
      role: response.role,
      token: response.access_token,
    };
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setUser(newUser);

    // Set auto-logout timer
    const expiry = decodeJwtExpiry(response.access_token);
    if (expiry) {
      const timeout = expiry - Date.now();
      setTimeout(logout, timeout);
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
