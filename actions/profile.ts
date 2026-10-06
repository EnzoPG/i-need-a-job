"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import type { ProfileData, SaveProfileResult } from "@/types/profile";
import type { UploadResumeResult } from "@/types/resume";
import { computeProfileCompleteness } from "@/lib/profile-utils";
import { profileDomainToRow } from "@/lib/mappers/profile";
import { validatePdfFile } from "@/lib/validation/file";

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

    const payload = profileDomainToRow(data, user.id, email, isComplete);

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

    if (!file || !(file instanceof Blob)) {
      return { success: false, error: "Please select a valid file to upload" };
    }

    const fileName =
      "name" in file ? (file as { name: string }).name : "resume.pdf";

    const validation = validatePdfFile({
      size: file.size,
      type: file.type,
      name: fileName,
    });

    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || "Invalid file format or size",
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
