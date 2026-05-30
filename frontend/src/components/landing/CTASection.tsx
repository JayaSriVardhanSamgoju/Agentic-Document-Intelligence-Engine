"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 px-4 bg-void relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-text-primary mb-6 tracking-tight"
        >
          Ready to deploy <br className="hidden sm:block" />
          <span className="gradient-text">enterprise intelligence?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto"
        >
          Stop relying on generic AI wrappers. Build an observable, verifiable,
          and secure document intelligence engine today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/login"
            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-bold text-lg hover:bg-accent-dim transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
          >
            Launch Dashboard
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-subtle text-text-primary font-bold text-lg hover:bg-raised/50 transition-colors"
          >
            <Github size={20} />
            View Source
          </a>
        </motion.div>
      </div>
    </section>
  );
}
