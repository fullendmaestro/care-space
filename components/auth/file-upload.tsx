"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { uploadFile } from "@/lib/api-utils";

interface FileUploadProps {
  label: string;
  accept?: string;
  required?: boolean;
  onUploadComplete: (res: string) => void;
}

export function FileUpload({
  label,
  accept,
  required,
  onUploadComplete,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(false);
  console.log(label);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(false);
    setUploadComplete(false);

    try {
      console.log("intial files", file);
      const response = await uploadFile(file);

      // Extract the URL from the response
      // If response returns JSON
      const data = await response.json();
      const url = data.url || data.fileUrl || data; // Use appropriate property name

      // If the response is directly a text URL, use this instead:
      // const url = await response.text();

      setUploadComplete(true);
      onUploadComplete(url);
    } catch (error) {
      console.error("Upload error:", error);
      setError(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <Input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        required={required}
        disabled={uploading}
        className={`${
          uploadComplete ? "border-green-500" : error ? "border-red-500" : ""
        }`}
      />
      {uploading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
      {uploadComplete && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </div>
      )}
      {error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <XCircle className="h-4 w-4 text-red-500" />
        </div>
      )}
    </div>
  );
}
