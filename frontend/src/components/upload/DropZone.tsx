"use client";

import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadDocument } from "@/services/api";
import type { UploadResponse } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  CloudUpload,
  File,
  Layers,
} from "lucide-react";

interface UploadEntry {
  id: string;
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  result?: UploadResponse;
  error?: string;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"];

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FileText size={20} className="text-red-400" />;
  if (ext === "docx") return <File size={20} className="text-blue-400" />;
  return <FileText size={20} className="text-gray-400" />;
}

export function DropZone() {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<UploadEntry[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Unsupported file type: ${ext}. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`;
    }
    if (file.size > 50 * 1024 * 1024) {
      return "File too large. Maximum size is 50MB.";
    }
    return null;
  };

  const handleUpload = useCallback(
    async (entry: UploadEntry) => {
      if (!user) return;

      setUploads((prev) =>
        prev.map((u) =>
          u.id === entry.id ? { ...u, status: "uploading", progress: 30 } : u
        )
      );

      try {
        // Simulate progress
        setUploads((prev) =>
          prev.map((u) => (u.id === entry.id ? { ...u, progress: 60 } : u))
        );

        const result = await uploadDocument(entry.file, user.token);

        setUploads((prev) =>
          prev.map((u) =>
            u.id === entry.id
              ? { ...u, status: "success", progress: 100, result }
              : u
          )
        );
      } catch (err: any) {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === entry.id
              ? { ...u, status: "error", progress: 0, error: err.message || "Upload failed" }
              : u
          )
        );
      }
    },
    [user]
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newEntries: UploadEntry[] = [];

      Array.from(files).forEach((file) => {
        const validationError = validateFile(file);
        const entry: UploadEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          status: validationError ? "error" : "pending",
          progress: 0,
          error: validationError || undefined,
        };
        newEntries.push(entry);
      });

      setUploads((prev) => [...prev, ...newEntries]);

      // Auto-start valid uploads
      newEntries
        .filter((e) => e.status === "pending")
        .forEach((e) => handleUpload(e));
    },
    [handleUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const removeEntry = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border/50 hover:border-primary/40 hover:bg-white/[0.02]"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
              isDragOver
                ? "bg-primary/20 text-primary"
                : "bg-white/5 text-muted-foreground"
            )}
          >
            <CloudUpload size={32} />
          </div>
          <div>
            <p className="text-base font-medium text-foreground">
              {isDragOver ? "Drop files here" : "Drag & drop your documents"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse · PDF, DOCX, TXT · Max 50MB
            </p>
          </div>
        </div>
      </div>

      {/* Upload List */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Layers size={16} className="text-primary" />
              Uploaded Documents ({uploads.length})
            </h3>
            <div className="space-y-2">
              {uploads.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="glass-card flex items-center gap-4"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    {getFileIcon(entry.file.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {entry.file.name}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {(entry.file.size / 1024).toFixed(0)} KB
                      </span>
                      {entry.result && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Layers size={10} />
                          {entry.result.chunks_created} chunks
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    {entry.status === "uploading" && (
                      <div className="w-full h-1 rounded-full bg-white/5 mt-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${entry.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    )}

                    {entry.error && (
                      <p className="text-xs text-destructive mt-1">{entry.error}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 shrink-0">
                    {entry.status === "uploading" && (
                      <Badge variant="info" dot>
                        Uploading
                      </Badge>
                    )}
                    {entry.status === "success" && (
                      <Badge variant="success" dot>
                        <CheckCircle2 size={12} className="mr-1" />
                        Indexed
                      </Badge>
                    )}
                    {entry.status === "error" && (
                      <Badge variant="danger" dot>
                        <AlertCircle size={12} className="mr-1" />
                        Failed
                      </Badge>
                    )}
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="p-1 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
