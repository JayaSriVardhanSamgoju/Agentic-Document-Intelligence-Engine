"use client";

import type { Citation } from "@/types";
import { FileText, ExternalLink } from "lucide-react";

interface CitationViewerProps {
  citations: Citation[];
}

export function CitationViewer({ citations }: CitationViewerProps) {
  return (
    <div>
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">
        Sources ({citations.length})
      </p>
      <div className="grid gap-1.5">
        {citations.map((citation, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-raised/30 border border-subtle hover:border-default transition-colors group cursor-default"
          >
            {/* Number badge */}
            <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-accent">
                {i + 1}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <FileText size={12} className="text-text-muted shrink-0" />
                <span className="text-xs font-semibold text-text-primary truncate">
                  {citation.source}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {citation.chunk_id !== null && (
                  <span className="text-[10px] font-mono text-text-muted">
                    Chunk #{citation.chunk_id}
                  </span>
                )}
                {citation.section && (
                  <>
                    <span className="text-text-muted">·</span>
                    <span className="text-[10px] text-text-muted truncate">
                      {citation.section}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Link indicator */}
            <ExternalLink
              size={12}
              className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
