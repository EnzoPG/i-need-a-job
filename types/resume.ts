import type { WorkExperienceItem } from "./profile";

export type ExtractedProfileData = {
  fullName?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  workAuthorization?: string;
  currentTitle?: string;
  experienceLevel?: string;
  yearsExperience?: string;
  skills?: string[];
  industries?: string[];
  workExperience?: WorkExperienceItem[];
  highestDegree?: string;
  fieldOfStudy?: string;
  institutionName?: string;
  graduationYear?: string;
  jobTitlesSeeking?: string;
  remotePreference?: string;
};

export type PolishedExperienceItem = {
  company: string;
  title: string;
  period: string;
  bullets: string[];
};

export type PolishedEducationItem = {
  degree: string;
  institution: string;
  year?: string | null;
};

export type PolishedResumeData = {
  fullName: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  currentTitle?: string | null;
  summary: string;
  experience: PolishedExperienceItem[];
  skills: string[];
  education: PolishedEducationItem[];
};

export type UploadResumeResult = {
  success: boolean;
  resumeUrl?: string;
  error?: string;
};

export type GenerateResumeResult = {
  success: boolean;
  resumeUrl?: string;
  error?: string;
};
