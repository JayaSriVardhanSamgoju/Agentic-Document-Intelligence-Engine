"use client";

import type { Citation } from "@/types";
import { FileText, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface CitationViewerProps {
  citations: Citation[];
}

export function CitationViewer({ citations }: CitationViewerProps) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {citations.map((citation, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-blue-300 hover:text-blue-200 transition-all cursor-default group"
        >
          <FileText size={12} className="text-primary/60 group-hover:text-primary shrink-0" />
          <span className="truncate max-w-[140px]">{citation.source}</span>
          {citation.chunk_id !== null && (
            <>
              <ChevronRight size={10} className="text-muted-foreground/40" />
              <span className="text-muted-foreground font-mono">
                #{citation.chunk_id}
              </span>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
}
