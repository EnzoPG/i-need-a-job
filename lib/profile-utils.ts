import type { ProfileData, ProfileCompleteness } from "@/types/profile";

export const DEFAULT_PROFILE_DATA: ProfileData = {
  fullName: "Faizan Ali",
  email: "",
  phone: "+1 (555) 000-0000",
  location: "",
  linkedinUrl: "https://linkedin.com/in/faizan",
  portfolioUrl: "https://github.com/jsmastery",
  workAuthorization: "Citizen",
  currentTitle: "Frontend Engineer",
  experienceLevel: "Junior",
  yearsExperience: "4",
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  industries: [],
  workExperience: [
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
  highestDegree: "High School",
  fieldOfStudy: "Computer Science",
  institutionName: "",
  graduationYear: "",
  jobTitlesSeeking: "Frontend Engineer, React Developer",
  remotePreference: "Any",
  salaryExpectation: "",
  preferredLocations: "",
};

export function createInitialProfileData(
  initialData: Partial<ProfileData> = {},
  fallbackEmail: string = ""
): ProfileData {
  return {
    fullName: initialData.fullName ?? DEFAULT_PROFILE_DATA.fullName,
    email: fallbackEmail || initialData.email || "",
    phone: initialData.phone ?? DEFAULT_PROFILE_DATA.phone,
    location: initialData.location ?? "",
    linkedinUrl: initialData.linkedinUrl ?? DEFAULT_PROFILE_DATA.linkedinUrl,
    portfolioUrl: initialData.portfolioUrl ?? DEFAULT_PROFILE_DATA.portfolioUrl,
    workAuthorization:
      initialData.workAuthorization ?? DEFAULT_PROFILE_DATA.workAuthorization,
    currentTitle: initialData.currentTitle ?? DEFAULT_PROFILE_DATA.currentTitle,
    experienceLevel:
      initialData.experienceLevel ?? DEFAULT_PROFILE_DATA.experienceLevel,
    yearsExperience:
      initialData.yearsExperience !== undefined
        ? String(initialData.yearsExperience)
        : DEFAULT_PROFILE_DATA.yearsExperience,
    skills:
      initialData.skills && initialData.skills.length > 0
        ? initialData.skills
        : DEFAULT_PROFILE_DATA.skills,
    industries: initialData.industries ?? [],
    workExperience:
      initialData.workExperience && initialData.workExperience.length > 0
        ? initialData.workExperience
        : DEFAULT_PROFILE_DATA.workExperience,
    highestDegree:
      initialData.highestDegree ?? DEFAULT_PROFILE_DATA.highestDegree,
    fieldOfStudy: initialData.fieldOfStudy ?? DEFAULT_PROFILE_DATA.fieldOfStudy,
    institutionName: initialData.institutionName ?? "",
    graduationYear: initialData.graduationYear ?? "",
    jobTitlesSeeking:
      initialData.jobTitlesSeeking ?? DEFAULT_PROFILE_DATA.jobTitlesSeeking,
    remotePreference:
      initialData.remotePreference ?? DEFAULT_PROFILE_DATA.remotePreference,
    salaryExpectation: initialData.salaryExpectation ?? "",
    preferredLocations: initialData.preferredLocations ?? "",
  };
}

export function computeProfileCompleteness(
  data: Partial<ProfileData>,
  email: string
): ProfileCompleteness {
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
