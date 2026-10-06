import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { validatePdfFile } from "@/lib/validation/file";
import { UnreadablePdfError } from "@/lib/pdf";
import { extractResumeData } from "@/lib/resume/extractResumeData";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    const { data: authData, error: authError } =
      await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: "You must be signed in to extract resume data" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid PDF file" },
        { status: 400 }
      );
    }

    const fileName =
      "name" in file ? (file as { name: string }).name : "resume.pdf";

    const validation = validatePdfFile({
      size: file.size,
      type: file.type,
      name: fileName,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error || "Invalid file" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      const extractedData = await extractResumeData(buffer);
      return NextResponse.json({
        success: true,
        data: extractedData,
      });
    } catch (pdfErr) {
      if (pdfErr instanceof UnreadablePdfError) {
        return NextResponse.json(
          { success: false, error: pdfErr.message },
          { status: 400 }
        );
      }
      console.error("[api/resume/extract] Extraction failure:", pdfErr);
      return NextResponse.json(
        {
          success: false,
          error:
            pdfErr instanceof Error
              ? pdfErr.message
              : "Could not extract text from this PDF file",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[api/resume/extract] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing the resume",
      },
      { status: 500 }
    );
  }
}
