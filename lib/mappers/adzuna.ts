import type { AdzunaRawJob, AdzunaJob } from "@/types/adzuna";

/**
 * Strips HTML tags and decodes common entities from raw text.
 */
export function cleanHtml(input?: string): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Formats numeric salary bounds into a clean presentation string.
 */
export function formatAdzunaSalary(salaryMin?: number, salaryMax?: number): string {
  if (typeof salaryMin === "number" && typeof salaryMax === "number") {
    const min = Math.round(salaryMin).toLocaleString("en-US");
    const max = Math.round(salaryMax).toLocaleString("en-US");
    return `$${min} - $${max} / yr`;
  }
  if (typeof salaryMin === "number") {
    return `From $${Math.round(salaryMin).toLocaleString("en-US")} / yr`;
  }
  if (typeof salaryMax === "number") {
    return `Up to $${Math.round(salaryMax).toLocaleString("en-US")} / yr`;
  }
  return "Competitive";
}

/**
 * Normalizes Adzuna contract metadata into standard job types.
 */
export function mapJobType(contractTime?: string, contractType?: string): string {
  if (contractType === "contract") return "contract";
  if (contractTime === "part_time") return "parttime";
  return "fulltime";
}

/**
 * Maps a raw Adzuna API payload item to the clean domain AdzunaJob entity.
 */
export function adzunaRawToDomain(
  raw: AdzunaRawJob,
  fallbackQuery?: { jobTitle?: string; location?: string }
): AdzunaJob {
  const title = cleanHtml(raw.title) || fallbackQuery?.jobTitle || "Untitled Role";
  const company = cleanHtml(raw.company?.display_name) || "Confidential";
  const location = cleanHtml(raw.location?.display_name) || fallbackQuery?.location || "Remote";
  const description = cleanHtml(raw.description);
  const salary = formatAdzunaSalary(raw.salary_min, raw.salary_max);
  const jobType = mapJobType(raw.contract_time, raw.contract_type);

  return {
    externalId: String(raw.id),
    title,
    company,
    location,
    salary,
    salaryMin: raw.salary_min,
    salaryMax: raw.salary_max,
    jobType,
    description,
    redirectUrl: raw.redirect_url,
    created: raw.created,
  };
}
