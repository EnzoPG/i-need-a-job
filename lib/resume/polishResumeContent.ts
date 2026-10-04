import OpenAI from "openai";
import type { PolishedResumeData } from "@/lib/pdf/ResumeDocument";

export type RawProfileInput = {
  fullName: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  currentTitle?: string | null;
  experienceLevel?: string | null;
  yearsExperience?: number | string | null;
  skills?: string[] | null;
  workExperience?: Array<{
    company?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    responsibilities?: string;
  }> | null;
  education?: {
    highestDegree?: string | null;
    fieldOfStudy?: string | null;
    institutionName?: string | null;
    graduationYear?: string | null;
  } | null;
};

export async function polishResumeContent(
  profile: RawProfileInput
): Promise<PolishedResumeData> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY environment variable is not configured on the server"
    );
  }

  const openai = new OpenAI({ apiKey });

  const systemPrompt = `You are an expert executive resume writer and career strategist.
Your task is to take a candidate's profile information and polish it into an exceptional, ATS-optimized, high-impact resume.

Layout & Space Rules:
- The resume MUST fit cleanly onto a single A4 page.
- Polish work experience into 2 to 3 concise, impactful bullet points per role (maximum 3 bullet points per role).
- Each bullet point must begin with a strong past or present action verb (e.g., "Architected", "Accelerated", "Delivered", "Optimized", "Engineered") and highlight quantifiable business or technical impact.
- Craft a compelling, concise 2 to 3 sentence Professional Summary showcasing the candidate's core strengths, years of expertise, and technical focus.
- Select and format the top 10-15 most relevant skills.
- Format dates consistently (e.g., "Jan 2022 - Present", "Aug 2019 - Dec 2021").

Return ONLY valid JSON matching this schema:
{
  "summary": string (2-3 sentences),
  "experience": [
    {
      "company": string,
      "title": string,
      "period": string,
      "bullets": string[] (2-3 bullets)
    }
  ],
  "skills": string[] (10-15 skills),
  "education": [
    {
      "degree": string (e.g. "Bachelor of Science in Computer Science"),
      "institution": string,
      "year": string (e.g. "2020")
    }
  ]
}`;

  const userContent = JSON.stringify(
    {
      fullName: profile.fullName,
      currentTitle: profile.currentTitle,
      experienceLevel: profile.experienceLevel,
      yearsExperience: profile.yearsExperience,
      rawSkills: profile.skills || [],
      rawWorkExperience: (profile.workExperience || []).slice(0, 4),
      rawEducation: profile.education || null,
    },
    null,
    2
  );

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1500,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `CANDIDATE PROFILE DATA:\n${userContent}` },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response while polishing resume");
  }

  const parsed = JSON.parse(content);

  const experience = Array.isArray(parsed.experience)
    ? parsed.experience.map(
        (exp: {
          company?: string;
          title?: string;
          period?: string;
          bullets?: string[];
        }) => ({
          company: exp.company || "",
          title: exp.title || "",
          period: exp.period || "",
          bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
        })
      )
    : [];

  const skills = Array.isArray(parsed.skills)
    ? parsed.skills
    : profile.skills || [];

  const education = Array.isArray(parsed.education)
    ? parsed.education.map(
        (edu: { degree?: string; institution?: string; year?: string }) => ({
          degree: edu.degree || "",
          institution: edu.institution || "",
          year: edu.year || "",
        })
      )
    : profile.education?.institutionName
      ? [
          {
            degree: `${profile.education.highestDegree || "Degree"} in ${
              profile.education.fieldOfStudy || "General Studies"
            }`,
            institution: profile.education.institutionName,
            year: profile.education.graduationYear || "",
          },
        ]
      : [];

  return {
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    linkedinUrl: profile.linkedinUrl,
    portfolioUrl: profile.portfolioUrl,
    currentTitle: profile.currentTitle,
    summary: parsed.summary || "",
    experience,
    skills,
    education,
  };
}
