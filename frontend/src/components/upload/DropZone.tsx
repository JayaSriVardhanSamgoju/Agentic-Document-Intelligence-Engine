"use client";

import { useState, useCallback, useRef } from "react";
import { uploadDocument, ApiError } from "@/services/api";
import { Upload, FileText, CheckCircle2, XCircle, Loader2, File, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FileEntry {
  file: File;
  status: "pending" | "uploading" | "indexed" | "error";
  chunks?: number;
  error?: string;
}

export function DropZone() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ALLOWED = [".pdf", ".docx", ".txt"];
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const entries: FileEntry[] = Array.from(newFiles)
      .filter((f) => {
        const ext = "." + f.name.split(".").pop()?.toLowerCase();
        return ALLOWED.includes(ext);
      })
      .map((file) => ({ file, status: "pending" as const }));
    setFiles((prev) => [...prev, ...entries]);
  }, []);

  const handleUpload = async (index: number) => {
    const entry = files[index];
    if (!entry || entry.status !== "pending") return;

    if (entry.file.size > MAX_SIZE) {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: "error", error: "File exceeds 50MB limit" } : f
        )
      );
      return;
    }

    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, status: "uploading" } : f))
    );

    try {
      const res = await uploadDocument(entry.file);
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: "indexed", chunks: res.chunks_created }
            : f
        )
      );
    } catch (err: any) {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: "error",
                error:
                  err instanceof ApiError
                    ? "Upload failed — check backend"
                    : "Cannot connect to backend",
              }
            : f
        )
      );
    }
  };

  const handleUploadAll = () => {
    files.forEach((_, i) => {
      if (files[i].status === "pending") handleUpload(i);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const getIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText size={16} className="text-danger" />;
    if (ext === "docx") return <FileText size={16} className="text-accent" />;
    return <File size={16} className="text-success" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300",
          isDragging
            ? "border-accent bg-accent/5 scale-[1.01]"
            : "border-subtle hover:border-default hover:bg-raised/20"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        <div
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
            isDragging ? "bg-accent/10" : "bg-raised"
          )}
        >
          <Upload
            size={28}
            className={cn(
              "transition-colors",
              isDragging ? "text-accent" : "text-text-muted"
            )}
          />
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-text-primary">
            {isDragging ? "Drop files here" : "Drop PDF, DOCX, or TXT files here"}
          </p>
          <p className="text-xs text-text-muted mt-1">or click to browse · Max 50MB per file</p>
        </div>

        <div className="flex gap-2">
          {["PDF", "DOCX", "TXT"].map((fmt) => (
            <span
              key={fmt}
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-raised text-text-muted border border-subtle"
            >
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {/* File Queue */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Files ({files.length})
            </p>
            {files.some((f) => f.status === "pending") && (
              <button
                onClick={handleUploadAll}
                className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-dim transition-colors"
              >
                Upload All
              </button>
            )}
          </div>

          <AnimatePresence>
            {files.map((entry, i) => (
              <motion.div
                key={`${entry.file.name}-${i}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl glass-card"
              >
                {getIcon(entry.file.name)}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {entry.file.name}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {formatSize(entry.file.size)}
                    {entry.chunks !== undefined && ` · ${entry.chunks} chunks`}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 shrink-0">
                  {entry.status === "pending" && (
                    <button
                      onClick={() => handleUpload(i)}
                      className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-[10px] font-bold hover:bg-accent/20 transition-colors"
                    >
                      Upload
                    </button>
                  )}
                  {entry.status === "uploading" && (
                    <div className="flex items-center gap-1.5 text-accent">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-[10px] font-medium">Uploading...</span>
                    </div>
                  )}
                  {entry.status === "indexed" && (
                    <div className="flex items-center gap-1.5 text-success">
                      <CheckCircle2 size={14} />
                      <span className="text-[10px] font-bold">Indexed</span>
                    </div>
                  )}
                  {entry.status === "error" && (
                    <div className="flex items-center gap-1.5 text-danger">
                      <XCircle size={14} />
                      <span className="text-[10px] font-medium">{entry.error}</span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(i)}
                    className="text-text-muted hover:text-danger transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
