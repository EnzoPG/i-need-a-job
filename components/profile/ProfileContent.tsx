"use client";

import { useState } from "react";
import { CompletionIndicator } from "@/components/profile/CompletionIndicator";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";
import type { ProfileData } from "@/types/profile";
import type { ExtractedProfileData } from "@/types/resume";
import {
  computeProfileCompleteness,
  createInitialProfileData,
} from "@/lib/profile-utils";

type Props = {
  initialData: Partial<ProfileData>;
  initialEmail: string;
  resumeUrl: string | null;
  initialCompleteness?: {
    completionPercentage: number;
    missingFields: string[];
  };
};

export function ProfileContent({
  initialData,
  initialEmail,
  resumeUrl,
}: Props) {
  const [formData, setFormData] = useState<ProfileData>(() =>
    createInitialProfileData(initialData, initialEmail)
  );

  const [savedData, setSavedData] = useState<ProfileData>(() => formData);
  const [activeResumeUrl, setActiveResumeUrl] = useState<string | null>(resumeUrl);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(savedData);

  const { completionPercentage, missingFields } = computeProfileCompleteness(
    formData,
    initialEmail
  );

  const handleSave = async (data: ProfileData) => {
    const { saveProfileAction } = await import("@/actions/profile");
    const result = await saveProfileAction(data);
    if (!result.success) {
      throw new Error(result.error || "Failed to save profile");
    }
    setSavedData(data);
  };

  const handleExtractComplete = (extracted: ExtractedProfileData) => {
    setFormData((prev) => ({
      ...prev,
      fullName: extracted.fullName ?? prev.fullName,
      phone: extracted.phone ?? prev.phone,
      location: extracted.location ?? prev.location,
      linkedinUrl: extracted.linkedinUrl ?? prev.linkedinUrl,
      portfolioUrl: extracted.portfolioUrl ?? prev.portfolioUrl,
      workAuthorization: extracted.workAuthorization ?? prev.workAuthorization,
      currentTitle: extracted.currentTitle ?? prev.currentTitle,
      experienceLevel: extracted.experienceLevel ?? prev.experienceLevel,
      yearsExperience:
        extracted.yearsExperience !== undefined
          ? String(extracted.yearsExperience)
          : prev.yearsExperience,
      skills:
        extracted.skills && extracted.skills.length > 0
          ? Array.from(new Set([...prev.skills, ...extracted.skills]))
          : prev.skills,
      industries:
        extracted.industries && extracted.industries.length > 0
          ? Array.from(new Set([...prev.industries, ...extracted.industries]))
          : prev.industries,
      workExperience:
        extracted.workExperience && extracted.workExperience.length > 0
          ? extracted.workExperience
          : prev.workExperience,
      highestDegree: extracted.highestDegree ?? prev.highestDegree,
      fieldOfStudy: extracted.fieldOfStudy ?? prev.fieldOfStudy,
      institutionName: extracted.institutionName ?? prev.institutionName,
      graduationYear: extracted.graduationYear ?? prev.graduationYear,
      jobTitlesSeeking: extracted.jobTitlesSeeking ?? prev.jobTitlesSeeking,
      remotePreference: extracted.remotePreference ?? prev.remotePreference,
      email: prev.email,
    }));
  };

  return (
    <>
      <CompletionIndicator
        completionPercentage={completionPercentage}
        missingFields={missingFields}
      />

      <ResumeUpload
        resumeUrl={activeResumeUrl}
        isDirty={isDirty}
        onExtractComplete={handleExtractComplete}
        onGenerateComplete={(newUrl) => setActiveResumeUrl(newUrl)}
      />

      <ProfileForm
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
      />
    </>
  );
}
