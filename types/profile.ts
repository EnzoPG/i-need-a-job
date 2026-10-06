export type WorkExperienceItem = {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
};

export type EducationItem = {
  highestDegree: string;
  fieldOfStudy: string;
  institutionName: string;
  graduationYear: string;
};

export type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  workAuthorization: string;
  currentTitle: string;
  experienceLevel: string;
  yearsExperience: string;
  skills: string[];
  industries: string[];
  workExperience: WorkExperienceItem[];
  highestDegree: string;
  fieldOfStudy: string;
  institutionName: string;
  graduationYear: string;
  jobTitlesSeeking: string;
  remotePreference: string;
  salaryExpectation: string;
  preferredLocations: string;
};

export type ProfileCompleteness = {
  completionPercentage: number;
  missingFields: string[];
  isComplete: boolean;
};

export type SaveProfileResult = {
  success: boolean;
  completionPercentage?: number;
  missingFields?: string[];
  error?: string;
};
