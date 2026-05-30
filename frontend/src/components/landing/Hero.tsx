"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { ParticleField } from "./ParticleField";
import { StatsCounter } from "./StatsCounter";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-4 overflow-hidden bg-void">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-40 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] opacity-50 z-0 pointer-events-none" />
      
      <ParticleField />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
        >
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
            Powered by LangGraph · FAISS · Groq
          </span>
        </motion.div>

        {/* Headlines */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-text-primary mb-6 leading-[1.1]"
        >
          Agentic <br className="hidden md:block" />
          <span className="gradient-text-hero">Document Intelligence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed"
        >
          Upload your documents. Ask anything. Get verified, grounded answers
          with full source citations — powered by a 6-agent AI pipeline.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <Link
            href="/login"
            className="group relative flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-bold text-lg hover:bg-accent-glow transition-all hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            Try the Demo
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#architecture"
            className="flex items-center gap-2 px-8 py-4 rounded-xl border border-accent/40 text-text-primary font-bold text-lg hover:bg-accent/10 transition-colors"
          >
            <LayoutDashboard className="text-accent" />
            View Architecture
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-8 border-t border-subtle w-full max-w-4xl"
        >
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-3xl font-black text-text-primary mb-1">
              <StatsCounter end={1247} suffix="+" />
            </div>
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">
              Queries Processed
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-3xl font-black text-text-primary mb-1 text-success">
              <StatsCounter end={94} suffix="%" />
            </div>
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">
              Avg Confidence
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-3xl font-black text-text-primary mb-1">
              <StatsCounter end={312} suffix="ms" />
            </div>
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">
              Avg Latency
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-3xl font-black text-text-primary mb-1 text-violet-glow">
              <StatsCounter end={6} />
            </div>
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">
              AI Agents
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted animate-bounce-subtle"
      >
        <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll to explore</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
}
