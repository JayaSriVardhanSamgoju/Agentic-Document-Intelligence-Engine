import { Hero } from "@/components/landing/Hero";
import { AgentPipelineViz } from "@/components/landing/AgentPipelineViz";
import { Features } from "@/components/landing/Features";
import { TechStackGrid } from "@/components/landing/TechStackGrid";
import { CTASection } from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-void text-text-primary selection:bg-accent/30 selection:text-white">
      {/* 
        We use individual semantic components for the landing page 
        to keep the code modular and maintainable.
      */}
      <Hero />
      <AgentPipelineViz />
      <Features />
      <TechStackGrid />
      <CTASection />

      {/* Footer */}
      <footer className="py-8 text-center border-t border-subtle bg-deep">
        <p className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} Agentic Document Intelligence Engine.
          Built for enterprise-grade generative AI.
        </p>
      </footer>
    </main>
  );
}