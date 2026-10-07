import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { searchAdzunaJobs, AdzunaConfigError, AdzunaApiError } from "@/lib/services/adzuna";
import { scoreJobAgainstProfile } from "@/lib/services/job-scorer";
import { trackServerEvent } from "@/lib/telemetry";
import type { ProfileRow } from "@/types/database";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    const { data: authData, error: authError } = await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = authData.user;

    let body: { jobTitle?: string; location?: string } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const jobTitle = body.jobTitle?.trim();
    const location = body.location?.trim() || "";

    if (!jobTitle) {
      return NextResponse.json(
        { success: false, error: "Job title is required" },
        { status: 400 }
      );
    }

    const isLiveConfigured = Boolean(
      process.env.ADZUNA_APP_ID?.trim() && process.env.ADZUNA_APP_KEY?.trim()
    );

    // Fetch candidate profile for AI match scoring
    const { data: profile } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle<ProfileRow>();

    // Create active agent_runs record
    const { data: run, error: runError } = await insforge.database
      .from("agent_runs")
      .insert({
        user_id: user.id,
        status: "running",
        job_title_searched: jobTitle,
        location_searched: location || null,
        jobs_found: 0,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (runError || !run) {
      console.error("[api/agent/find] Failed to create agent_run record:", runError);
      return NextResponse.json(
        { success: false, error: "Failed to initialize search run in database" },
        { status: 500 }
      );
    }

    // Record starting milestone in agent_logs
    await insforge.database.from("agent_logs").insert({
      run_id: run.id,
      user_id: user.id,
      message: `Started search for "${jobTitle}" in "${location || "Any"}"`,
      level: "info",
    });

    // Track search initiation in PostHog
    void trackServerEvent({
      distinctId: user.id,
      event: "job_search_started",
      properties: {
        job_title: jobTitle,
        location: location || "Any",
        run_id: run.id,
      },
    });

    // Execute Adzuna external job search
    let adzunaJobs;
    try {
      adzunaJobs = await searchAdzunaJobs({
        jobTitle,
        location: location || undefined,
        resultsPerPage: 10,
      });
    } catch (adzunaErr) {
      console.error("[api/agent/find] Adzuna discovery failed:", adzunaErr);

      await insforge.database
        .from("agent_runs")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", run.id);

      await insforge.database.from("agent_logs").insert({
        run_id: run.id,
        user_id: user.id,
        message: `Search failed: ${adzunaErr instanceof Error ? adzunaErr.message : "Adzuna error"}`,
        level: "error",
      });

      if (adzunaErr instanceof AdzunaConfigError) {
        return NextResponse.json({ success: false, error: adzunaErr.message }, { status: 503 });
      }

      if (adzunaErr instanceof AdzunaApiError) {
        return NextResponse.json(
          { success: false, error: adzunaErr.message },
          { status: adzunaErr.status }
        );
      }

      return NextResponse.json(
        { success: false, error: "Failed to fetch job listings from external search provider." },
        { status: 502 }
      );
    }

    // Handle empty discovery outcome gracefully
    if (adzunaJobs.length === 0) {
      await insforge.database
        .from("agent_runs")
        .update({
          status: "completed",
          jobs_found: 0,
          completed_at: new Date().toISOString(),
        })
        .eq("id", run.id);

      await insforge.database.from("agent_logs").insert({
        run_id: run.id,
        user_id: user.id,
        message: "Search completed with 0 listings found.",
        level: "info",
      });

      return NextResponse.json({
        success: true,
        runId: run.id,
        status: "completed",
        jobsFound: 0,
        strongMatches: 0,
        message: "No jobs found matching your criteria. Try broader keywords or locations.",
        jobs: [],
      });
    }

    // Evaluate each job concurrently against candidate profile
    const scoringResults = await Promise.allSettled(
      adzunaJobs.map((job) => scoreJobAgainstProfile(job, profile))
    );

    const nowIso = new Date().toISOString();
    const jobsToUpsert = adzunaJobs.map((job, idx) => {
      const settled = scoringResults[idx];
      const score =
        settled.status === "fulfilled"
          ? settled.value
          : {
              match_score: 50,
              match_reason: "AI scoring was temporarily unavailable for this opportunity.",
              matched_skills: [],
              missing_skills: [],
            };

      return {
        run_id: run.id,
        user_id: user.id,
        source: "search",
        source_url: job.redirectUrl,
        external_apply_url: job.redirectUrl,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        job_type: job.jobType,
        about_role: job.description,
        match_score: score.match_score,
        match_reason: score.match_reason,
        matched_skills: score.matched_skills,
        missing_skills: score.missing_skills,
        found_at: nowIso,
      };
    });

    // Upsert into jobs table respecting unique(user_id, source_url)
    const { data: savedJobs, error: jobsError } = await insforge.database
      .from("jobs")
      .upsert(jobsToUpsert, { onConflict: "user_id,source_url" })
      .select();

    if (jobsError) {
      console.error("[api/agent/find] Error upserting discovered jobs:", jobsError);
    }

    const resultJobs = savedJobs && savedJobs.length > 0 ? savedJobs : jobsToUpsert;
    const strongMatches = resultJobs.filter((j) => j.match_score >= 70).length;

    // Complete agent_runs record
    await insforge.database
      .from("agent_runs")
      .update({
        status: "completed",
        jobs_found: resultJobs.length,
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);

    // Record completion in agent_logs
    await insforge.database.from("agent_logs").insert({
      run_id: run.id,
      user_id: user.id,
      message: `Successfully found ${resultJobs.length} jobs with ${strongMatches} strong matches.`,
      level: "success",
    });

    // Emit PostHog job_found event for each opportunity
    for (const job of resultJobs) {
      void trackServerEvent({
        distinctId: user.id,
        event: "job_found",
        properties: {
          job_id: "id" in job ? job.id : undefined,
          title: job.title,
          company: job.company,
          match_score: job.match_score,
          run_id: run.id,
        },
      });
    }

    const bannerMessage = isLiveConfigured
      ? `Found ${resultJobs.length} jobs and saved ${strongMatches} strong matches.`
      : `Found ${resultJobs.length} jobs and saved ${strongMatches} strong matches (Demo mode: set ADZUNA_APP_ID for live API).`;

    return NextResponse.json({
      success: true,
      runId: run.id,
      status: "completed",
      jobsFound: resultJobs.length,
      strongMatches,
      message: bannerMessage,
      jobs: resultJobs,
    });
  } catch (fatalErr) {
    console.error("[api/agent/find] Fatal unhandled error:", fatalErr);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during job discovery." },
      { status: 500 }
    );
  }
}
