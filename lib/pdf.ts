import { extractText } from "unpdf";

export class UnreadablePdfError extends Error {
  constructor(
    message = "Could not extract text from this PDF. The document may be empty or a scanned image."
  ) {
    super(message);
    this.name = "UnreadablePdfError";
  }
}

/**
 * Extracts plain text from a PDF Buffer using unpdf (worker-free PDF.js).
 * Throws an UnreadablePdfError if text is empty or fewer than 50 characters.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const uint8 = new Uint8Array(buffer);
    const { text } = await extractText(uint8, { mergePages: true });
    const cleanText = typeof text === "string" ? text.trim() : "";

    if (!cleanText || cleanText.length < 50) {
      throw new UnreadablePdfError(
        "Could not extract text from this PDF. The document may be empty or a scanned image."
      );
    }

    return cleanText;
  } catch (error) {
    if (error instanceof UnreadablePdfError) {
      throw error;
    }
    console.error("[lib/pdf/extractTextFromPdf]", error);
    throw new UnreadablePdfError(
      "Could not parse this PDF file. Please ensure it is a valid, readable PDF document."
    );
  }
}
