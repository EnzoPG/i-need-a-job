import type { ProfileData } from "@/components/profile/ProfileForm";

export type CompletenessResult = {
  completionPercentage: number;
  missingFields: string[];
  isComplete: boolean;
};

export function computeProfileCompleteness(
  data: Partial<ProfileData>,
  email: string
): CompletenessResult {
  const missing: string[] = [];

  if (!data.fullName?.trim()) {
    missing.push("FULL NAME");
  }
  if (!email?.trim()) {
    missing.push("EMAIL");
  }
  if (!data.phone?.trim()) {
    missing.push("PHONE");
  }
  if (!data.location?.trim()) {
    missing.push("LOCATION");
  }
  if (!data.currentTitle?.trim()) {
    missing.push("CURRENT TITLE");
  }
  if (!data.experienceLevel?.trim()) {
    missing.push("EXPERIENCE");
  }
  if (!data.skills || data.skills.length === 0) {
    missing.push("SKILLS");
  }
  if (
    !data.workExperience ||
    data.workExperience.length === 0 ||
    !data.workExperience[0]?.company?.trim() ||
    !data.workExperience[0]?.title?.trim()
  ) {
    missing.push("WORK EXPERIENCE");
  }
  if (!data.highestDegree?.trim() && !data.institutionName?.trim()) {
    missing.push("EDUCATION");
  }
  if (!data.jobTitlesSeeking?.trim()) {
    missing.push("JOB TITLES");
  }

  const totalCriteria = 10;
  const completedCount = totalCriteria - missing.length;
  const percentage = Math.round((completedCount / totalCriteria) * 100);

  return {
    completionPercentage: percentage,
    missingFields: missing,
    isComplete: missing.length === 0,
  };
}
