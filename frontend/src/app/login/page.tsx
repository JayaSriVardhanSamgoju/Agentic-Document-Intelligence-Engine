"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Lock,
  User,
  AlertCircle,
  WifiOff,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { ApiError } from "@/services/api";

type LoginState = "idle" | "loading" | "error" | "connection_error";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoginState("loading");
    setErrorMsg("");

    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (err: any) {
      if (err instanceof ApiError) {
        setLoginState("error");
        setErrorMsg("Invalid credentials. Please try again.");
      } else if (
        err?.message?.includes("fetch") ||
        err?.message?.includes("NetworkError") ||
        err?.name === "TypeError"
      ) {
        setLoginState("connection_error");
        setErrorMsg(
          "Cannot reach server at localhost:8000. Start the backend first."
        );
      } else {
        setLoginState("error");
        setErrorMsg(err.message || "Authentication failed.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-void">
      {/* Background orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-violet/5 blur-[120px]" />
      <div className="absolute inset-0 bg-grid opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 ring-1 ring-accent/20 animate-pulse-glow">
            <Sparkles className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-text-secondary mt-1.5">
            Sign in to Agentic Document Intelligence
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-username"
                className="text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                  <User size={16} />
                </div>
                <input
                  id="login-username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-deep border border-subtle text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock size={16} />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-deep border border-subtle text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error States */}
            {loginState === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger"
              >
                <AlertCircle size={14} className="shrink-0" />
                {errorMsg}
              </motion.div>
            )}

            {loginState === "connection_error" && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 text-sm text-warning"
              >
                <WifiOff size={14} className="shrink-0" />
                {errorMsg}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loginState === "loading" ||
                !username.trim() ||
                !password.trim()
              }
              className="w-full py-3 rounded-lg bg-accent text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-accent-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
            >
              {loginState === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-6">
          Agentic Document Intelligence Engine · Enterprise AI Platform
        </p>
      </motion.div>
    </div>
  );
}
