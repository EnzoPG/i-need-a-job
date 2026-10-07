import type { ProfileData, WorkExperienceItem } from "@/types/profile";
import type { ProfileRow } from "@/types/database";

export function profileRowToDomain(
  profile: Partial<ProfileRow> | null | undefined,
  fallback: { email: string; fullName?: string }
): Partial<ProfileData> {
  if (!profile) {
    return {
      email: fallback.email,
      ...(fallback.fullName ? { fullName: fallback.fullName } : {}),
    };
  }

  const capitalize = (val: string | null | undefined, def: string) =>
    val ? val.charAt(0).toUpperCase() + val.slice(1) : def;

  const workExperience: WorkExperienceItem[] = Array.isArray(profile.work_experience)
    ? profile.work_experience.map((item, index) => ({
        id: item.id || String(index + 1),
        company: item.company || "",
        title: item.title || "",
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        current: Boolean(item.current),
        responsibilities: item.responsibilities || "",
      }))
    : [];

  return {
    fullName: profile.full_name || fallback.fullName || "",
    email: fallback.email,
    phone: profile.phone || "",
    location: profile.location || "",
    linkedinUrl: profile.linkedin_url || "",
    portfolioUrl: profile.portfolio_url || "",
    workAuthorization: capitalize(profile.work_authorization, "Citizen"),
    currentTitle: profile.current_title || "",
    experienceLevel: capitalize(profile.experience_level, "Junior"),
    yearsExperience:
      profile.years_experience !== null && profile.years_experience !== undefined
        ? String(profile.years_experience)
        : "",
    skills: Array.isArray(profile.skills) ? profile.skills : [],
    industries: Array.isArray(profile.industries) ? profile.industries : [],
    workExperience,
    highestDegree: profile.education?.highestDegree || "High School",
    fieldOfStudy: profile.education?.fieldOfStudy || "",
    institutionName: profile.education?.institutionName || "",
    graduationYear: profile.education?.graduationYear || "",
    jobTitlesSeeking: Array.isArray(profile.job_titles_seeking)
      ? profile.job_titles_seeking.join(", ")
      : "",
    remotePreference: capitalize(profile.remote_preference, "Any"),
    salaryExpectation: profile.salary_expectation || "",
    preferredLocations: Array.isArray(profile.preferred_locations)
      ? profile.preferred_locations.join(", ")
      : "",
  };
}

export function profileDomainToRow(
  data: ProfileData,
  userId: string,
  email: string,
  isComplete: boolean
): ProfileRow {
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

  return {
    id: userId,
    email,
    full_name: data.fullName?.trim() || null,
    phone: data.phone?.trim() || null,
    location: data.location?.trim() || null,
    current_title: data.currentTitle?.trim() || null,
    experience_level: data.experienceLevel?.toLowerCase() || "junior",
    years_experience: isNaN(yearsExp) ? 0 : yearsExp,
    skills: Array.isArray(data.skills) ? data.skills : [],
    industries: Array.isArray(data.industries) ? data.industries : [],
    work_experience: Array.isArray(data.workExperience) ? data.workExperience : [],
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
    resume_pdf_url: null,
    is_complete: isComplete,
    updated_at: new Date().toISOString(),
  };
}
