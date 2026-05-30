"use client";

import { motion } from "framer-motion";

const TECH_STACK = [
  { category: "Backend", name: "FastAPI", desc: "High-performance async Python framework" },
  { category: "Orchestration", name: "LangGraph", desc: "Cyclical multi-agent pipelines" },
  { category: "LLM Engine", name: "Groq", desc: "Ultra-low latency LPU inference" },
  { category: "Vector DB", name: "FAISS", desc: "Facebook AI Similarity Search" },
  { category: "Frontend", name: "Next.js 14", desc: "React App Router framework" },
  { category: "Styling", name: "Tailwind CSS", desc: "Utility-first dark cyberpunk design" },
  { category: "State", name: "Zustand", desc: "Lightweight frontend state management" },
  { category: "Retrieval", name: "BM25 + CrossEncoder", desc: "Sparse search + dense reranking" },
];

export function TechStackGrid() {
  return (
    <section className="py-24 px-4 bg-deep relative border-t border-subtle">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-text-primary tracking-tight">
              Powered by the Best
            </h2>
            <p className="text-text-secondary mt-2">
              A modern, uncompromising technology stack.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TECH_STACK.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-4 rounded-xl bg-raised/30 border border-subtle hover:border-accent/50 hover:bg-raised/50 transition-colors group"
            >
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">
                {tech.category}
              </p>
              <h3 className="text-sm font-bold text-text-primary mb-1 group-hover:text-accent-glow transition-colors">
                {tech.name}
              </h3>
              <p className="text-xs text-text-muted">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
