"use client";

import { useState } from "react";
import { CompletionIndicator } from "@/components/profile/CompletionIndicator";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import { ProfileForm, type ProfileData } from "@/components/profile/ProfileForm";
import type { ExtractedProfileData } from "@/app/api/resume/extract/route";
import { computeProfileCompleteness } from "@/lib/profile-utils";

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
  const [formData, setFormData] = useState<ProfileData>(() => ({
    fullName: initialData.fullName ?? "Faizan Ali",
    email: initialEmail,
    phone: initialData.phone ?? "+1 (555) 000-0000",
    location: initialData.location ?? "",
    linkedinUrl: initialData.linkedinUrl ?? "https://linkedin.com/in/faizan",
    portfolioUrl: initialData.portfolioUrl ?? "https://github.com/jsmastery",
    workAuthorization: initialData.workAuthorization ?? "Citizen",
    currentTitle: initialData.currentTitle ?? "Frontend Engineer",
    experienceLevel: initialData.experienceLevel ?? "Junior",
    yearsExperience:
      initialData.yearsExperience !== undefined
        ? String(initialData.yearsExperience)
        : "4",
    skills:
      initialData.skills && initialData.skills.length > 0
        ? initialData.skills
        : ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    industries: initialData.industries ?? [],
    workExperience:
      initialData.workExperience && initialData.workExperience.length > 0
        ? initialData.workExperience
        : [
            {
              id: "1",
              company: "Vercel",
              title: "Frontend Engineer",
              startDate: "January 2022",
              endDate: "--------- ----",
              current: true,
              responsibilities:
                "Built Next.js features and optimized web vitals. Led a team of 3 developers.",
            },
          ],
    highestDegree: initialData.highestDegree ?? "High School",
    fieldOfStudy: initialData.fieldOfStudy ?? "Computer Science",
    institutionName: initialData.institutionName ?? "",
    graduationYear: initialData.graduationYear ?? "",
    jobTitlesSeeking:
      initialData.jobTitlesSeeking ?? "Frontend Engineer, React Developer",
    remotePreference: initialData.remotePreference ?? "Any",
    salaryExpectation: initialData.salaryExpectation ?? "",
    preferredLocations: initialData.preferredLocations ?? "",
  }));

  const { completionPercentage, missingFields } = computeProfileCompleteness(
    formData,
    initialEmail
  );

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
        resumeUrl={resumeUrl}
        onExtractComplete={handleExtractComplete}
      />

      <ProfileForm
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
}
