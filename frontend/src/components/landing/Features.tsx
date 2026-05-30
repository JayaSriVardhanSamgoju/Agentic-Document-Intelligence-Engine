"use client";

import { motion } from "framer-motion";
import { Lock, FileSearch, Activity, FileCheck, Zap, Database } from "lucide-react";

const FEATURES = [
  {
    icon: FileSearch,
    title: "Hybrid Retrieval",
    desc: "Combines dense embeddings (FAISS) with sparse keyword search (BM25) and CrossEncoder reranking for pinpoint accuracy.",
  },
  {
    icon: FileCheck,
    title: "Verifiable Citations",
    desc: "Every claim is backed by exact chunk-level citations. No black-box answers. Always trace back to the source document.",
  },
  {
    icon: Activity,
    title: "Full Observability",
    desc: "Monitor agent latencies, token usage, confidence scores, and hallucination risks in real-time via the analytics dashboard.",
  },
  {
    icon: Lock,
    title: "Enterprise RBAC",
    desc: "JWT-based authentication with strict Role-Based Access Control. Granular permissions for Admins, Researchers, and Viewers.",
  },
  {
    icon: Database,
    title: "Session Memory",
    desc: "Stateful conversations backed by LangChain memory. The AI understands context and follow-up questions seamlessly.",
  },
  {
    icon: Zap,
    title: "Streaming Responses",
    desc: "Low-latency streaming architecture. See the AI's reasoning and answer generation in real-time as it processes.",
  },
];

export function Features() {
  return (
    <section className="py-24 px-4 bg-void relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
            Enterprise-Grade Features
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Built from the ground up to solve the hardest problems in generative AI: hallucination, access control, and verifiability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 ring-1 ring-accent/20">
                <feat.icon size={24} className="text-accent" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">{feat.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
