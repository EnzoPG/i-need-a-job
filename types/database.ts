export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  current_title: string | null;
  experience_level: string | null;
  years_experience: number | null;
  skills: string[] | null;
  industries: string[] | null;
  work_experience: Array<{
    id?: string;
    company?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    responsibilities?: string;
  }> | null;
  education: {
    highestDegree?: string | null;
    fieldOfStudy?: string | null;
    institutionName?: string | null;
    graduationYear?: string | null;
  } | null;
  job_titles_seeking: string[] | null;
  remote_preference: string | null;
  preferred_locations: string[] | null;
  salary_expectation: string | null;
  cover_letter_tone: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  work_authorization: string | null;
  resume_pdf_url: string | null;
  is_complete: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export type AgentRunRow = {
  id: string;
  user_id: string;
  status: "running" | "completed" | "failed";
  job_title_searched: string | null;
  location_searched: string | null;
  jobs_found: number | null;
  started_at: string;
  completed_at: string | null;
};

export type JobRow = {
  id: string;
  run_id: string | null;
  user_id: string;
  source: "search" | "url";
  source_url: string;
  external_apply_url: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  job_type: string;
  about_role: string | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  nice_to_have: string[] | null;
  benefits: string[] | null;
  about_company: string | null;
  match_score: number;
  match_reason: string;
  matched_skills: string[];
  missing_skills: string[];
  company_research: Record<string, unknown> | null;
  found_at: string;
};

export type AgentLogRow = {
  id: string;
  run_id: string | null;
  user_id: string;
  message: string;
  level: "info" | "success" | "warning" | "error";
  job_id: string | null;
  created_at: string;
};
