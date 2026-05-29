"use client";

import { motion } from "framer-motion";
import {
  Brain,
  ShieldCheck,
  Zap,
  Database,
  Eye,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Multi-Agent Orchestration",
    description:
      "Planner, Retriever, Synthesizer, and Verifier agents work in concert to deliver highly accurate, grounded responses.",
    color: "text-blue-400 bg-blue-500/10 ring-blue-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Strict Guardrails",
    description:
      "Input and output guardrails enforce safety policies, blocking harmful content and preventing information leakage.",
    color: "text-green-400 bg-green-500/10 ring-green-500/20",
  },
  {
    icon: Database,
    title: "Hybrid Retrieval",
    description:
      "BM25 sparse search combined with FAISS dense vector retrieval, with cross-encoder reranking for maximum precision.",
    color: "text-purple-400 bg-purple-500/10 ring-purple-500/20",
  },
  {
    icon: MessageSquare,
    title: "Memory-Aware Chat",
    description:
      "Session-based conversation memory enables multi-turn reasoning that remembers context across interactions.",
    color: "text-orange-400 bg-orange-500/10 ring-orange-500/20",
  },
  {
    icon: Eye,
    title: "Deep Observability",
    description:
      "Real-time pipeline monitoring with per-agent latency tracking, risk assessment, and comprehensive evaluation metrics.",
    color: "text-cyan-400 bg-cyan-500/10 ring-cyan-500/20",
  },
  {
    icon: Zap,
    title: "Streaming Responses",
    description:
      "Word-by-word streaming delivers answers in real-time, with confidence scoring and citation tracking built in.",
    color: "text-yellow-400 bg-yellow-500/10 ring-yellow-500/20",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Enterprise AI, <span className="gradient-text">Reimagined</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            Every component is production-hardened with evaluation, guardrails, and observability baked in from day one.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="glass-card-hover p-6 space-y-4"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ring-1 ${feature.color}`}
              >
                <feature.icon size={22} />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
