"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import type { ProfileData } from "@/components/profile/ProfileForm";

export type SaveProfileResult = {
  success: boolean;
  completionPercentage?: number;
  missingFields?: string[];
  error?: string;
};

export type UploadResumeResult = {
  success: boolean;
  resumeUrl?: string;
  error?: string;
};

import { computeProfileCompleteness } from "@/lib/profile-utils";

export async function saveProfileAction(
  data: ProfileData
): Promise<SaveProfileResult> {
  try {
    const insforge = await createInsforgeServer();
    const { data: authData, error: authError } =
      await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return {
        success: false,
        error: "You must be signed in to save your profile",
      };
    }

    const user = authData.user;
    const email = user.email || data.email;

    const { completionPercentage, missingFields, isComplete } =
      computeProfileCompleteness(data, email);

    const jobTitlesArray =
      typeof data.jobTitlesSeeking === "string"
        ? data.jobTitlesSeeking
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(data.jobTitlesSeeking)
          ? data.jobTitlesSeeking
          : [];

    const preferredLocationsArray =
      typeof data.preferredLocations === "string"
        ? data.preferredLocations
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(data.preferredLocations)
          ? data.preferredLocations
          : [];

    const yearsExp = parseInt(data.yearsExperience, 10);

    const payload = {
      id: user.id,
      email,
      full_name: data.fullName?.trim() || null,
      phone: data.phone?.trim() || null,
      location: data.location?.trim() || null,
      current_title: data.currentTitle?.trim() || null,
      experience_level: data.experienceLevel?.toLowerCase() || "junior",
      years_experience: isNaN(yearsExp) ? 0 : yearsExp,
      skills: Array.isArray(data.skills) ? data.skills : [],
      industries: Array.isArray(data.industries) ? data.industries : [],
      work_experience: Array.isArray(data.workExperience)
        ? data.workExperience
        : [],
      education: {
        highestDegree: data.highestDegree || null,
        fieldOfStudy: data.fieldOfStudy || null,
        institutionName: data.institutionName || null,
        graduationYear: data.graduationYear || null,
      },
      job_titles_seeking: jobTitlesArray,
      remote_preference: data.remotePreference?.toLowerCase() || "any",
      preferred_locations: preferredLocationsArray,
      salary_expectation: data.salaryExpectation?.trim() || null,
      cover_letter_tone: "enthusiastic",
      linkedin_url: data.linkedinUrl?.trim() || null,
      portfolio_url: data.portfolioUrl?.trim() || null,
      work_authorization: data.workAuthorization?.toLowerCase() || "citizen",
      is_complete: isComplete,
      updated_at: new Date().toISOString(),
    };

    const { error: dbError } = await insforge.database
      .from("profiles")
      .upsert(payload);

    if (dbError) {
      console.error("[actions/profile/saveProfileAction]", dbError);
      return {
        success: false,
        error: dbError.message || "Failed to save profile to database",
      };
    }

    revalidatePath("/profile");

    return {
      success: true,
      completionPercentage,
      missingFields,
    };
  } catch (error) {
    console.error("[actions/profile/saveProfileAction]", error);
    return {
      success: false,
      error: "An unexpected error occurred while saving your profile",
    };
  }
}

export async function uploadResumeAction(
  formData: FormData
): Promise<UploadResumeResult> {
  try {
    const file = formData.get("file");

    if (!file || !(file instanceof Blob) || file.size === 0) {
      return { success: false, error: "Please select a valid file to upload" };
    }

    const fileName =
      "name" in file ? (file as { name: string }).name : "resume.pdf";
    const isPdf =
      file.type === "application/pdf" ||
      fileName.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return { success: false, error: "Only PDF files are supported" };
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        success: false,
        error: "File size exceeds the 5MB maximum limit",
      };
    }

    const insforge = await createInsforgeServer();
    const { data: authData, error: authError } =
      await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return {
        success: false,
        error: "You must be signed in to upload a resume",
      };
    }

    const user = authData.user;
    const storagePath = `${user.id}/resume.pdf`;

    const { error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(storagePath, file);

    if (uploadError) {
      console.error("[actions/profile/uploadResumeAction]", uploadError);
      return {
        success: false,
        error: uploadError.message || "Failed to upload file to storage",
      };
    }

    const resumePdfUrl = `resumes/${storagePath}`;

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
        "[actions/profile/uploadResumeAction/updateProfile]",
        updateError
      );
    }

    revalidatePath("/profile");

    return {
      success: true,
      resumeUrl: resumePdfUrl,
    };
  } catch (error) {
    console.error("[actions/profile/uploadResumeAction]", error);
    return {
      success: false,
      error: "An unexpected error occurred while uploading your resume",
    };
  }
}
