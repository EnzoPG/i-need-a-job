type PosthogEventPayload = {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
};

/**
 * Sends a server-side analytics event to PostHog via the HTTP ingest API.
 * Fails silently to ensure user requests are never blocked by telemetry.
 */
export async function trackServerEvent({
  distinctId,
  event,
  properties = {},
}: PosthogEventPayload): Promise<void> {
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

  if (!host || !projectToken) {
    return;
  }

  try {
    const url = `${host.replace(/\/$/, "")}/capture/`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: projectToken,
        event,
        distinct_id: distinctId,
        properties: {
          $lib: "ineedajob-server",
          ...properties,
        },
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    // Non-blocking telemetry failure
    console.warn(`[telemetry/trackServerEvent] Failed to send ${event}:`, err);
  }
}
