import type {
  AdzunaJob,
  AdzunaRawJob,
  AdzunaSearchParams,
  IJobDiscoveryService,
} from "@/types/adzuna";
import { AdzunaApiError, AdzunaConfigError } from "@/lib/errors/adzuna";
import { detectCountryCode } from "@/lib/utils/country";
import { adzunaRawToDomain } from "@/lib/mappers/adzuna";

// Re-export types and errors for consumer convenience
export type { AdzunaJob, AdzunaRawJob, AdzunaSearchParams, IJobDiscoveryService };
export { AdzunaApiError, AdzunaConfigError };

/**
 * Generates realistic fallback job opportunities when Adzuna API credentials
 * are not yet configured in local development.
 */
function getSimulatedAdzunaJobs(params: AdzunaSearchParams): AdzunaJob[] {
  const query = params.jobTitle.trim() || "Software Engineer";
  const loc = params.location?.trim() || "Remote";

  const templates = [
    {
      titlePrefix: "Senior",
      company: "Stripe",
      salary: "$140,000 - $180,000 / yr",
      desc: `We are looking for a Senior ${query} to join our core engineering team in ${loc}. You will design, build, and maintain high-scale distributed systems and APIs.`,
    },
    {
      titlePrefix: "Lead",
      company: "Spotify",
      salary: "$160,000 - $210,000 / yr",
      desc: `Spotify is seeking an experienced Lead ${query} in ${loc} to guide architecture, mentor team members, and deliver high quality platform services.`,
    },
    {
      titlePrefix: "",
      company: "Vercel",
      salary: "$130,000 - $165,000 / yr",
      desc: `Join Vercel as a ${query} working on developer experience and cloud infrastructure. Experience with modern web standards and high availability is a plus.`,
    },
    {
      titlePrefix: "Staff",
      company: "Datadog",
      salary: "$175,000 - $225,000 / yr",
      desc: `Datadog is hiring a Staff ${query} in ${loc} to own cross-functional technical initiatives and observability pipelines at massive scale.`,
    },
    {
      titlePrefix: "Senior",
      company: "Airbnb",
      salary: "$150,000 - $190,000 / yr",
      desc: `Airbnb seeks a Senior ${query} to build intuitive travel experiences and robust backend microservices supporting global community demand.`,
    },
    {
      titlePrefix: "",
      company: "Linear",
      salary: "$135,000 - $170,000 / yr",
      desc: `We are hiring a ${query} to craft lightning-fast product features and reliable services with high craftsmanship and attention to detail.`,
    },
    {
      titlePrefix: "Full Stack",
      company: "GitHub",
      salary: "$145,000 - $185,000 / yr",
      desc: `GitHub is looking for a ${query} to enhance developer tooling, code collaboration workflows, and enterprise platform security.`,
    },
    {
      titlePrefix: "Principal",
      company: "Figma",
      salary: "$180,000 - $240,000 / yr",
      desc: `Shape the future of design and collaboration software as a Principal ${query} at Figma, driving technical excellence and team scale.`,
    },
  ];

  const nowIso = new Date().toISOString();

  return templates.map((t, idx) => ({
    externalId: `sim-${idx + 1}-${Date.now()}`,
    title: t.titlePrefix ? `${t.titlePrefix} ${query}` : query,
    company: t.company,
    location: loc,
    salary: t.salary,
    jobType: "fulltime",
    description: t.desc,
    redirectUrl: `https://adzuna.com/jobs/simulated-${encodeURIComponent(
      t.company.toLowerCase()
    )}-${idx + 1}`,
    created: nowIso,
  }));
}

/**
 * Service implementing job vacancy search via the external Adzuna API.
 * Adheres to SRP by delegating mapping and country resolution to dedicated modules.
 * Seamlessly falls back to simulated catalog when API credentials are omitted.
 */
export class AdzunaDiscoveryService implements IJobDiscoveryService {
  private readonly baseUrl = "https://api.adzuna.com/v1/api/jobs";
  private readonly defaultTimeoutMs = 12000;

  public async searchJobs(params: AdzunaSearchParams): Promise<AdzunaJob[]> {
    const appId = process.env.ADZUNA_APP_ID?.trim();
    const appKey = process.env.ADZUNA_APP_KEY?.trim();

    // Fall back to simulated discovery catalog if credentials are not configured
    if (!appId || !appKey) {
      return getSimulatedAdzunaJobs(params);
    }

    const country = detectCountryCode(params.location);
    const page = params.page || 1;
    const resultsPerPage = params.resultsPerPage || 10;

    const url = new URL(`${this.baseUrl}/${country}/search/${page}`);
    url.searchParams.set("app_id", appId);
    url.searchParams.set("app_key", appKey);
    url.searchParams.set("what", params.jobTitle.trim());
    url.searchParams.set("results_per_page", String(resultsPerPage));
    url.searchParams.set("content-type", "application/json");

    if (params.location && params.location.trim()) {
      url.searchParams.set("where", params.location.trim());
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeoutMs);

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        throw new AdzunaApiError("Adzuna API request timed out", 504);
      }
      throw new AdzunaApiError(
        err instanceof Error ? err.message : "Failed to connect to Adzuna API",
        502
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new AdzunaApiError(
        `Adzuna API error (${response.status}): ${errorText || response.statusText}`,
        response.status
      );
    }

    const data = (await response.json()) as { results?: AdzunaRawJob[] };
    const rawResults = Array.isArray(data.results) ? data.results : [];

    return rawResults.map((raw) =>
      adzunaRawToDomain(raw, {
        jobTitle: params.jobTitle,
        location: params.location,
      })
    );
  }
}

/**
 * Default singleton instance of AdzunaDiscoveryService.
 */
export const adzunaDiscoveryService = new AdzunaDiscoveryService();

/**
 * Functional convenience wrapper maintaining compatibility with route callers.
 */
export async function searchAdzunaJobs(params: AdzunaSearchParams): Promise<AdzunaJob[]> {
  return adzunaDiscoveryService.searchJobs(params);
}
