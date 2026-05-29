import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Architecture } from "@/components/landing/Architecture";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Sticky Nav */}
      <header className="fixed top-0 w-full z-50 glass-strong border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center ring-1 ring-primary/20">
              <Sparkles size={16} className="text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground tracking-tight">
              Agentic <span className="text-primary/80 font-medium">Intelligence</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Features
            </Link>
            <Link
              href="/login"
              className="text-sm px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Sections */}
      <Hero />
      <Features />
      <Architecture />

      {/* Footer */}
      <footer className="border-t border-border/30 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2025 Agentic Document Intelligence Engine. Built for enterprise AI.</p>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              GitHub
            </a>
            <span>FastAPI + Next.js + LangChain</span>
          </div>
        </div>
      </footer>
    </div>
  );
}