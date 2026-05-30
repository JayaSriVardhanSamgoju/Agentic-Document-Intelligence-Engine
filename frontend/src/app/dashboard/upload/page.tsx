"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DropZone } from "@/components/upload/DropZone";

export default function UploadPage() {
  return (
    <ProtectedRoute requiredPermission="upload">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Document Repository
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Upload enterprise documents to index them into the vector database.
          </p>
        </div>

        <DropZone />
      </div>
    </ProtectedRoute>
  );
}
