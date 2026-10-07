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
 * Service implementing job vacancy search via the external Adzuna API.
 * Adheres to SRP by delegating mapping and country resolution to dedicated modules.
 */
export class AdzunaDiscoveryService implements IJobDiscoveryService {
  private readonly baseUrl = "https://api.adzuna.com/v1/api/jobs";
  private readonly defaultTimeoutMs = 12000;

  private getCredentials(): { appId: string; appKey: string } {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      throw new AdzunaConfigError(
        "Adzuna API credentials (ADZUNA_APP_ID, ADZUNA_APP_KEY) are not configured."
      );
    }

    return { appId, appKey };
  }

  public async searchJobs(params: AdzunaSearchParams): Promise<AdzunaJob[]> {
    const { appId, appKey } = this.getCredentials();
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
