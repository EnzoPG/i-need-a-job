export const MAX_RESUME_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export type FileValidationResult = {
  valid: boolean;
  error?: string;
};

export function isPdfMimeOrExtension(fileType?: string, fileName?: string): boolean {
  if (fileType === "application/pdf") return true;
  if (fileName && fileName.toLowerCase().endsWith(".pdf")) return true;
  return false;
}

export function validatePdfFile(file: {
  size: number;
  type?: string;
  name?: string;
}): FileValidationResult {
  if (!file || file.size === 0) {
    return {
      valid: false,
      error: "Please select a valid file to upload",
    };
  }

  if (!isPdfMimeOrExtension(file.type, file.name)) {
    return {
      valid: false,
      error: "Only PDF files are supported",
    };
  }

  if (file.size > MAX_RESUME_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: "File size exceeds the 5MB maximum limit",
    };
  }

  return { valid: true };
}
