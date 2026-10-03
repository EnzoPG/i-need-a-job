"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadResumeAction } from "@/actions/profile";
import { useToast } from "@/components/ui/Toast";

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
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [currentResumeUrl, setCurrentResumeUrl] = useState<string | null>(
    resumeUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      const err = "Only PDF files are supported";
      setUploadError(err);
      toast({
        type: "error",
        title: "Invalid file format",
        message: err,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const err = "File size exceeds 5MB limit";
      setUploadError(err);
      toast({
        type: "error",
        title: "File too large",
        message: err,
      });
      return;
    }

    setSelectedFileName(file.name);
    setUploadError(null);
    setUploadSuccess(false);

    toast({
      type: "info",
      title: "Uploading resume",
      message: "Sending your PDF to secure storage...",
      duration: 2500,
    });

    if (onFileSelect) {
      onFileSelect(file);
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadResumeAction(formData);

      if (!result.success) {
        const err = result.error || "Failed to upload resume";
        setUploadError(err);
        toast({
          type: "error",
          title: "Upload failed",
          message: err,
        });
      } else {
        setUploadSuccess(true);
        if (result.resumeUrl) {
          setCurrentResumeUrl(result.resumeUrl);
        }
        toast({
          type: "success",
          title: "Resume uploaded",
          message: "Your resume is now stored and active on your profile.",
        });
        setTimeout(() => setUploadSuccess(false), 4000);
      }
    } catch (err) {
      console.error("[ResumeUpload/processFile]", err);
      const fallbackError = "An unexpected error occurred during upload";
      setUploadError(fallbackError);
      toast({
        type: "error",
        title: "Upload error",
        message: fallbackError,
      });
    } finally {
      setIsUploading(false);
    }
  };

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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
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

      {uploadSuccess && (
        <div className="mb-4 p-3 rounded-lg border border-success/30 bg-success-lightest text-success-foreground text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          <span>Resume uploaded and saved to your profile successfully!</span>
        </div>
      )}

      {uploadError && (
        <div className="mb-4 p-3 rounded-lg border border-error/30 bg-error/10 text-error text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-error shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {currentResumeUrl && (
        <div className="mb-4 p-3 rounded-xl border border-border bg-surface-secondary/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">
                {selectedFileName || "Current Active Resume"}
              </p>
              <p className="text-[11px] text-text-secondary truncate">
                Stored securely in private cloud storage
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
            Active
          </span>
        </div>
      )}

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
        } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <div className="w-10 h-10 bg-accent-light text-accent rounded-full flex items-center justify-center mx-auto mb-3">
          {isUploading ? (
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
          ) : (
            <UploadCloud className="w-5 h-5 text-accent" />
          )}
        </div>

        <p className="text-sm font-semibold text-text-primary">
          {isUploading
            ? "Uploading and saving resume..."
            : selectedFileName
              ? selectedFileName
              : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-text-muted mt-1 mb-4">
          PDF formatting only. Maximum file size 5MB.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          disabled={isUploading}
          onChange={handleChange}
          className="hidden"
          id="resume-upload-input"
        />

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="bg-surface hover:bg-surface-secondary border border-border text-text-primary text-xs font-medium px-4 py-2 rounded-md shadow-xs cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Select Resume"}
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
