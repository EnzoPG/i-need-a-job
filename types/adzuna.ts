export type AdzunaSearchParams = {
  jobTitle: string;
  location?: string;
  resultsPerPage?: number;
  page?: number;
};

export type AdzunaRawJob = {
  id: string | number;
  title?: string;
  company?: { display_name?: string };
  location?: { display_name?: string; area?: string[] };
  description?: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: string | number;
  contract_time?: string;
  contract_type?: string;
  redirect_url: string;
  created?: string;
};

export type AdzunaJob = {
  externalId: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType: string;
  description: string;
  redirectUrl: string;
  created?: string;
};

export interface IJobDiscoveryService {
  searchJobs(params: AdzunaSearchParams): Promise<AdzunaJob[]>;
}
