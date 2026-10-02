"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText } from "lucide-react";

type Props = {
  resumeUrl?: string | null;
  onFileSelect?: (file: File) => void;
  className?: string;
};

export function ResumeUpload({
  resumeUrl,
  onFileSelect,
  className = "",
}: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFileName(file.name);
        onFileSelect?.(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      onFileSelect?.(file);
    }
  };

  return (
    <div className={`bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs ${className}`}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-text-primary">Resume</h2>
        <p className="mt-1 text-xs text-text-secondary">
          Upload an existing resume to auto-fill the profile, or generate a new
          tailored one from your details below.
        </p>
      </div>

      {/* Dashed Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? "border-accent bg-accent-muted/40"
            : "border-border-muted bg-surface-secondary/20 hover:bg-surface-secondary/40"
        }`}
      >
        <div className="w-10 h-10 bg-accent-light text-accent rounded-full flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-5 h-5 text-accent" />
        </div>

        <p className="text-sm font-semibold text-text-primary">
          {selectedFileName ? selectedFileName : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-text-muted mt-1 mb-4">
          PDF formatting only. Maximum file size 5MB.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
          id="resume-upload-input"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-surface hover:bg-surface-secondary border border-border text-text-primary text-xs font-medium px-4 py-2 rounded-md shadow-xs cursor-pointer transition-colors"
        >
          Select Resume
        </button>
      </div>

      {/* Action Row below dropzone */}
      <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="text-xs text-text-secondary">
          Need a fresh document based on the fields below?
        </span>

        <button
          type="button"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-accent-foreground text-xs font-medium px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Resume from Profile</span>
        </button>
      </div>
    </div>
  );
}
