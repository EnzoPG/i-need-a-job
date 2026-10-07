import OpenAI from "openai";
import { extractTextFromPdf } from "@/lib/pdf";
import type { ExtractedProfileData } from "@/types/resume";

export async function extractResumeData(
  buffer: Buffer
): Promise<ExtractedProfileData> {
  const rawText = await extractTextFromPdf(buffer);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY environment variable is not configured on the server"
    );
  }

  const openai = new OpenAI({ apiKey });

  const systemPrompt = `You are an expert career data extraction specialist.
Your task is to analyze the provided resume text and extract candidate profile information.
Return ONLY valid JSON matching this schema:
{
  "fullName": string (candidate full name),
  "phone": string (phone number, e.g. +1 555-0199),
  "location": string (city, state/country, e.g. San Francisco, CA),
  "linkedinUrl": string (full URL if found, else empty string),
  "portfolioUrl": string (GitHub, portfolio, or website URL if found, else empty string),
  "workAuthorization": string (MUST be one of: "Citizen", "Permanent Resident", "Visa Required"),
  "currentTitle": string (most recent or current job title),
  "experienceLevel": string (MUST be one of: "Junior", "Mid", "Senior", "Lead"),
  "yearsExperience": string (numeric string representing estimated total years of relevant experience, e.g. "4"),
  "skills": string[] (array of technical and professional skills, e.g. ["React", "TypeScript", "Node.js"]),
  "industries": string[] (array of industries candidate has worked in or targets, e.g. ["Fintech", "SaaS"]),
  "workExperience": array of up to 4 most recent roles [
    {
      "company": string,
      "title": string,
      "startDate": string (e.g. "January 2021" or "01/2021"),
      "endDate": string (e.g. "Present" or "December 2023"),
      "current": boolean,
      "responsibilities": string (concise 1-3 sentence summary of accomplishments and duties)
    }
  ],
  "highestDegree": string (MUST be one of: "High School", "Associate", "Bachelor's", "Master's", "Doctorate", "Other"),
  "fieldOfStudy": string (major or field, e.g. "Computer Science"),
  "institutionName": string (university or school name),
  "graduationYear": string (4-digit graduation year, e.g. "2020"),
  "jobTitlesSeeking": string (comma separated roles candidate is likely seeking, e.g. "Frontend Engineer, Full Stack Developer"),
  "remotePreference": string (MUST be one of: "Any", "Remote", "Hybrid", "Onsite")
}

Important rules:
- Extract facts accurately from the resume text. Do not invent employment history.
- Never include or extract email address; email is handled separately.
- For experienceLevel, infer based on total years and seniority (0-2 years = Junior, 3-5 = Mid, 6-9 = Senior, 10+ = Lead).
- For workAuthorization, if not mentioned, default to "Citizen".
- For remotePreference, if not mentioned, default to "Remote".
- Return ONLY the JSON object.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: 1500,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `RESUME TEXT:\n${rawText}` },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Failed to generate extraction from resume");
  }

  const parsed = JSON.parse(content);

  const workExperience = Array.isArray(parsed.workExperience)
    ? parsed.workExperience.map((role: {
        company?: string;
        title?: string;
        startDate?: string;
        endDate?: string;
        current?: boolean;
        responsibilities?: string;
      }) => ({
        id: crypto.randomUUID(),
        company: role.company || "",
        title: role.title || "",
        startDate: role.startDate || "",
        endDate: role.endDate || "",
        current: Boolean(role.current),
        responsibilities: role.responsibilities || "",
      }))
    : [];

  return {
    fullName: parsed.fullName?.trim() || undefined,
    phone: parsed.phone?.trim() || undefined,
    location: parsed.location?.trim() || undefined,
    linkedinUrl: parsed.linkedinUrl?.trim() || undefined,
    portfolioUrl: parsed.portfolioUrl?.trim() || undefined,
    workAuthorization: parsed.workAuthorization || "Citizen",
    currentTitle: parsed.currentTitle?.trim() || undefined,
    experienceLevel: parsed.experienceLevel || "Mid",
    yearsExperience:
      parsed.yearsExperience !== undefined
        ? String(parsed.yearsExperience).trim()
        : undefined,
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    industries: Array.isArray(parsed.industries) ? parsed.industries : [],
    workExperience,
    highestDegree: parsed.highestDegree || "Bachelor's",
    fieldOfStudy: parsed.fieldOfStudy?.trim() || undefined,
    institutionName: parsed.institutionName?.trim() || undefined,
    graduationYear: parsed.graduationYear
      ? String(parsed.graduationYear).trim()
      : undefined,
    jobTitlesSeeking: parsed.jobTitlesSeeking?.trim() || undefined,
    remotePreference: parsed.remotePreference || "Remote",
  };
}
