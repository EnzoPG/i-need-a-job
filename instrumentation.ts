import { SeverityNumber } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const missingVariable = !projectToken
  ? "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN"
  : !host
    ? "NEXT_PUBLIC_POSTHOG_HOST"
    : null;

const loggerProvider =
  !missingVariable && host && projectToken
    ? new LoggerProvider({
        resource: resourceFromAttributes({ "service.name": "ineedajob-web" }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${host.replace(/\/$/, "")}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${projectToken}`,
                "Content-Type": "application/json",
              },
            }),
          }),
        ],
      })
    : null;

const posthogLogger = loggerProvider?.getLogger("ineedajob-posthog-exporter");

export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  if (missingVariable) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    return;
  }
}

export function logOAuthCallbackOutcome(
  body: string,
  severityNumber: SeverityNumber
) {
  posthogLogger?.emit({
    body,
    severityNumber,
    attributes: { route: "/api/auth/callback" },
  });
}

export async function flushPostHogLogs() {
  await loggerProvider?.forceFlush();
}
