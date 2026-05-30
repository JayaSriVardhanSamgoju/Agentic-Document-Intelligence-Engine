"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Brain, 
  Search, 
  Globe, 
  PenTool, 
  ShieldCheck, 
  BadgeCheck, 
  Activity 
} from "lucide-react";

const AGENTS = [
  { 
    id: "guard-in", 
    name: "Input Guard", 
    icon: Shield, 
    desc: "Intercepts prompt injection and validates topic boundaries.", 
    detail: "Before hitting the LLM, the Input Guard checks against semantic blocklists and prompt injection patterns. It guarantees safe execution.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/30"
  },
  { 
    id: "planner", 
    name: "Planner (Router)", 
    icon: Brain, 
    desc: "Classifies intent & extracts search terms.", 
    detail: "Analyzes user intent to route to private Documents, public Web Search, or a Hybrid blend. Breaks complex questions into sub-queries.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/30"
  },
  { 
    id: "retrieval-layer", 
    name: "Hybrid Retrieval", 
    icon: Activity, 
    desc: "Fetches context from vectors or the web.", 
    detail: "Executes Dense Vector + BM25 search for private docs, and/or Tavily API search for real-time web knowledge.",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    isSplit: true 
  },
  { 
    id: "synthesizer", 
    name: "Synthesizer", 
    icon: PenTool, 
    desc: "Fuses context into a grounded response.", 
    detail: "Takes the raw context from documents and the web, and perfectly blends them into an accurate, highly-readable streaming response.",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30"
  },
  { 
    id: "guard-out", 
    name: "Output Guard", 
    icon: ShieldCheck, 
    desc: "Prevents PII and toxic outputs.", 
    detail: "The final safety net. It intercepts the synthesized response to ensure no sensitive enterprise data or toxic language is leaked.",
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30"
  },
  { 
    id: "verifier", 
    name: "AI Verifier", 
    icon: BadgeCheck, 
    desc: "Calculates confidence & hallucination risk.", 
    detail: "Acts as an LLM-as-a-judge to mathematically score the final answer against the retrieved context, returning a 0.0 to 1.0 confidence score.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/30"
  }
];

export function AgentPipelineViz() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % AGENTS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <div id="architecture" className="py-24 px-4 bg-deep relative overflow-hidden border-y border-subtle">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
        <motion.div 
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`w-[600px] h-[600px] rounded-full blur-[120px] ${AGENTS[activeIndex].bg}`}
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
            Dynamic LangGraph Architecture
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Interact with the nodes below to see how our Copilot routes, retrieves, and synthesizes intelligence in real-time.
          </p>
        </div>

        <div 
          className="hidden lg:flex flex-col items-center gap-12"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="flex items-center justify-between w-full relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-subtle -translate-y-1/2 z-0 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-accent via-violet-500 to-success"
                initial={{ width: "0%" }}
                animate={{ width: `${(activeIndex / (AGENTS.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            {AGENTS.map((agent, i) => {
              const isActive = i === activeIndex;
              const isPast = i < activeIndex;
              const IconComponent = agent.icon;
              
              return (
                <div key={agent.id} className="relative z-10 flex flex-col items-center cursor-pointer" onClick={() => setActiveIndex(i)}>
                  <motion.div
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      borderColor: isActive || isPast ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                    }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 backdrop-blur-xl transition-all duration-300 ${isActive ? agent.bg + " shadow-[0_0_30px_-5px] shadow-current " + agent.color : "bg-raised border-subtle"}`}
                  >
                    {agent.isSplit ? (
                      <div className="flex gap-1">
                        <Search size={20} className={isActive ? agent.color : "text-text-muted"} />
                        <Globe size={20} className={isActive ? "text-violet-400" : "text-text-muted"} />
                      </div>
                    ) : (
                      <IconComponent size={28} className={isActive || isPast ? agent.color : "text-text-muted"} />
                    )}
                  </motion.div>
                  
                  <div className="absolute top-20 w-32 text-center">
                    <p className={`text-sm font-semibold transition-colors duration-300 ${isActive ? "text-text-primary" : "text-text-muted"}`}>
                      {agent.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full max-w-3xl mt-16 h-48">
            <AnimatePresence mode="wait">
              {(() => {
                const ActiveIcon = AGENTS[activeIndex].icon;
                return (
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`glass-card border ${AGENTS[activeIndex].border} ${AGENTS[activeIndex].bg} p-8 rounded-2xl text-center shadow-2xl relative overflow-hidden`}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-50" style={{ color: "inherit" }} />
                    <div className={`inline-flex items-center justify-center p-3 rounded-full mb-4 bg-background ${AGENTS[activeIndex].border} border`}>
                      {AGENTS[activeIndex].isSplit ? (
                        <div className="flex gap-2">
                          <Search size={24} className={AGENTS[activeIndex].color} />
                          <Globe size={24} className="text-violet-400" />
                        </div>
                      ) : (
                        <ActiveIcon size={24} className={AGENTS[activeIndex].color} />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary mb-2">{AGENTS[activeIndex].name}</h3>
                    <p className="text-text-secondary text-lg">{AGENTS[activeIndex].detail}</p>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col lg:hidden gap-4 relative mt-12">
          <div className="absolute left-[31px] top-8 bottom-8 w-0.5 bg-subtle z-0" />
          
          {AGENTS.map((agent, i) => {
            const MobileIcon = agent.icon;
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`glass-card p-4 flex items-start gap-4 relative z-10 border ${agent.border} ${agent.bg}`}
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-background flex items-center justify-center border border-subtle shadow-lg">
                  <MobileIcon size={24} className={agent.color} />
                </div>
                <div>
                  <h3 className="text-md font-bold text-text-primary">{agent.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">{agent.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
