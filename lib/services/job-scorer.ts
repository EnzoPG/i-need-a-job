import OpenAI from "openai";
import type { ProfileRow } from "@/types/database";
import type { AdzunaJob } from "@/types/adzuna";
import type { JobScoreResult, IJobScoringService } from "@/types/scoring";

export type { JobScoreResult, IJobScoringService };

const DEFAULT_FALLBACK_SCORE: JobScoreResult = {
  match_score: 50,
  match_reason:
    "Profile information is minimal. Complete your skills and experience to receive tailored scoring.",
  matched_skills: [],
  missing_skills: [],
};

const ERROR_FALLBACK_SCORE: JobScoreResult = {
  match_score: 50,
  match_reason: "AI match scoring was temporarily unavailable for this opportunity.",
  matched_skills: [],
  missing_skills: [],
};

/**
 * Service implementing job candidate alignment scoring via OpenAI GPT-4o.
 * Adheres to DIP and SRP.
 */
export class OpenAiJobScoringService implements IJobScoringService {
  private readonly model = "gpt-4o";

  public async scoreJob(
    job: AdzunaJob,
    profile: ProfileRow | null
  ): Promise<JobScoreResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return ERROR_FALLBACK_SCORE;
    }

    // Check if profile is populated enough for personalized scoring
    const skills = Array.isArray(profile?.skills) ? profile.skills : [];
    const workExperience = Array.isArray(profile?.work_experience) ? profile.work_experience : [];
    const currentTitle = profile?.current_title?.trim() || "";

    if (skills.length === 0 && workExperience.length === 0 && !currentTitle) {
      return DEFAULT_FALLBACK_SCORE;
    }

    const experienceSummary = workExperience
      .slice(0, 3)
      .map(
        (exp) =>
          `- ${exp.title || "Role"} at ${exp.company || "Company"} (${exp.startDate || ""} - ${
            exp.endDate || (exp.current ? "Present" : "")
          }): ${exp.responsibilities || ""}`
      )
      .join("\n");

    const candidateProfileText = `
Candidate Profile:
- Current Title: ${currentTitle || "Not specified"}
- Experience Level: ${profile?.experience_level || "Not specified"}
- Years of Experience: ${profile?.years_experience ?? "Not specified"}
- Skills: ${skills.length > 0 ? skills.join(", ") : "None specified"}
- Industries: ${profile?.industries?.join(", ") || "None specified"}
- Target Job Titles: ${profile?.job_titles_seeking?.join(", ") || "None specified"}
- Work Experience Summary:
${experienceSummary || "No work experience provided"}
`.trim();

    const jobDetailsText = `
Job Opening:
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}
- Salary: ${job.salary}
- Job Type: ${job.jobType}
- Description Snippet:
${job.description || "No description provided"}
`.trim();

    try {
      const openai = new OpenAI({ apiKey });

      const response = await openai.chat.completions.create({
        model: this.model,
        response_format: { type: "json_object" },
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: `You are an expert technical recruiter and talent evaluation specialist.
Evaluate how well the candidate profile matches the provided job opportunity.
Return a valid JSON object strictly matching this schema:
{
  "matchScore": number (integer between 0 and 100),
  "matchReason": string (2-3 concise sentences explaining the fit and primary gaps),
  "matchedSkills": string[] (array of relevant skills candidate possesses that match this role),
  "missingSkills": string[] (array of required skills or qualifications candidate appears to lack)
}

Evaluation guidelines:
- 80-100: Strong match with direct skill and seniority alignment.
- 60-79: Moderate match with transferable skills or minor experience gaps.
- 0-59: Weak match with significant domain or seniority divergence.
- Keep matchedSkills and missingSkills focused on concise skill keywords.`,
          },
          {
            role: "user",
            content: `${candidateProfileText}\n\n${jobDetailsText}`,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return ERROR_FALLBACK_SCORE;
      }

      const parsed = JSON.parse(content) as {
        matchScore?: number;
        matchReason?: string;
        matchedSkills?: string[];
        missingSkills?: string[];
      };

      const rawScore = typeof parsed.matchScore === "number" ? parsed.matchScore : 50;
      const matchScore = Math.max(0, Math.min(100, Math.round(rawScore)));

      return {
        match_score: matchScore,
        match_reason:
          parsed.matchReason?.trim() ||
          "Candidate skills and experience partially match role requirements.",
        matched_skills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills.slice(0, 10) : [],
        missing_skills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills.slice(0, 10) : [],
      };
    } catch (err) {
      console.error("[job-scorer/OpenAiJobScoringService] Error scoring job:", err);
      return ERROR_FALLBACK_SCORE;
    }
  }
}

/**
 * Default singleton instance of OpenAiJobScoringService.
 */
export const openAiJobScoringService = new OpenAiJobScoringService();

/**
 * Functional convenience wrapper maintaining compatibility with route callers.
 */
export async function scoreJobAgainstProfile(
  job: AdzunaJob,
  profile: ProfileRow | null
): Promise<JobScoreResult> {
  return openAiJobScoringService.scoreJob(job, profile);
}
