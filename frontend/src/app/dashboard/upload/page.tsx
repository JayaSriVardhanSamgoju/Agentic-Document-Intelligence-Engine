"use client";

import { DropZone } from "@/components/upload/DropZone";
import { Upload } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
            <Upload size={20} className="text-primary" />
          </div>
          Upload Documents
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Upload PDF, DOCX, or TXT files. They will be automatically chunked, embedded, and indexed for intelligent retrieval.
        </p>
      </div>

      <DropZone />
    </div>
  );
}
