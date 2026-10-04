import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { polishResumeContent } from "@/lib/resume/polishResumeContent";
import { generateResumePdfBuffer } from "@/lib/pdf/generatePdfBuffer";

export const runtime = "nodejs";

export async function POST() {
  try {
    const insforge = await createInsforgeServer();
    const { data: authData, error: authError } =
      await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: "You must be signed in to generate a resume" },
        { status: 401 }
      );
    }

    const user = authData.user;

    // Fetch existing candidate profile from database
    const { data: profile, error: profileError } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Profile not found. Please complete your profile information before generating a resume.",
        },
        { status: 400 }
      );
    }

    const fullName = profile.full_name?.trim();
    const email = user.email || profile.email;
    const hasSkills = Array.isArray(profile.skills) && profile.skills.length > 0;
    const hasExperience =
      Array.isArray(profile.work_experience) &&
      profile.work_experience.length > 0;

    // Validate minimum required profile fields (AC-2)
    if (!fullName) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Full Name is required to generate a resume. Please update your profile.",
        },
        { status: 400 }
      );
    }

    if (!hasSkills && !hasExperience) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please add at least one work experience entry or skill before generating a resume.",
        },
        { status: 400 }
      );
    }

    // Polish career copy with OpenAI GPT-4o
    const polishedData = await polishResumeContent({
      fullName,
      email,
      phone: profile.phone,
      location: profile.location,
      linkedinUrl: profile.linkedin_url,
      portfolioUrl: profile.portfolio_url,
      currentTitle: profile.current_title,
      experienceLevel: profile.experience_level,
      yearsExperience: profile.years_experience,
      skills: profile.skills,
      workExperience: profile.work_experience,
      education: profile.education,
    });

    // Render PDF buffer using @react-pdf/renderer
    const pdfBuffer = await generateResumePdfBuffer(polishedData);

    // Upload to InsForge Storage bucket 'resumes' at '{user_id}/resume.pdf'
    const storagePath = `${user.id}/resume.pdf`;
    const pdfBlob = new Blob([new Uint8Array(pdfBuffer)], {
      type: "application/pdf",
    });

    const { error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(storagePath, pdfBlob);

    if (uploadError) {
      console.error("[api/resume/generate] Storage upload failed:", uploadError);
      return NextResponse.json(
        {
          success: false,
          error: uploadError.message || "Failed to save generated resume to storage",
        },
        { status: 500 }
      );
    }

    const resumePdfUrl = `resumes/${storagePath}`;

    // Update profiles table with active resume url
    const { error: updateError } = await insforge.database
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        resume_pdf_url: resumePdfUrl,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      console.error(
        "[api/resume/generate] Failed to update profile record:",
        updateError
      );
    }

    return NextResponse.json({
      success: true,
      resumeUrl: resumePdfUrl,
    });
  } catch (error) {
    console.error("[api/resume/generate] Unexpected error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate resume";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
