"use client";

import { motion } from "framer-motion";

const steps = [
  { label: "User Query", sublabel: "Natural language input" },
  { label: "Input Guardrails", sublabel: "Safety & policy check" },
  { label: "Planner Agent", sublabel: "Strategy selection" },
  { label: "Hybrid Retriever", sublabel: "BM25 + FAISS + Reranker" },
  { label: "Synthesizer Agent", sublabel: "Answer generation" },
  { label: "Verifier Agent", sublabel: "Fact checking" },
  { label: "Output Guardrails", sublabel: "Final safety filter" },
  { label: "Evaluated Response", sublabel: "Confidence + Citations" },
];

export function Architecture() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.04] blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Agentic <span className="gradient-text">Pipeline</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            Every query flows through a multi-agent orchestration pipeline with strict guardrails at every boundary.
          </p>
        </div>

        {/* Pipeline Visual */}
        <div className="flex flex-col items-center gap-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="w-full max-w-md"
            >
              <div className="glass-card-hover flex items-center gap-4 py-3 px-5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary ring-1 ring-primary/20 shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.sublabel}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-px h-4 bg-border/50" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">
            Built With
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {["Next.js", "FastAPI", "LangChain", "Groq", "FAISS", "JWT", "TypeScript", "TailwindCSS"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full glass text-xs font-medium text-muted-foreground ring-1 ring-white/5"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
