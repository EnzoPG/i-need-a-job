import type { ProfileRow } from "./database";
import type { AdzunaJob } from "./adzuna";

export type JobScoreResult = {
  match_score: number;
  match_reason: string;
  matched_skills: string[];
  missing_skills: string[];
};

export interface IJobScoringService {
  scoreJob(job: AdzunaJob, profile: ProfileRow | null): Promise<JobScoreResult>;
}
