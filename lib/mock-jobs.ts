import type { JobRow } from "@/types/database";

export type MockJob = JobRow & {
  displayDate?: string;
};

function createMockJob(
  data: Omit<JobRow, "run_id" | "user_id" | "source" | "source_url" | "external_apply_url" | "job_type" | "about_role" | "responsibilities" | "requirements" | "nice_to_have" | "benefits" | "about_company" | "company_research"> & {
    run_id?: string | null;
    user_id?: string;
    source?: "search" | "url";
    source_url?: string;
    external_apply_url?: string;
    job_type?: string;
    about_role?: string | null;
    responsibilities?: string[] | null;
    requirements?: string[] | null;
    nice_to_have?: string[] | null;
    benefits?: string[] | null;
    about_company?: string | null;
    company_research?: Record<string, unknown> | null;
    displayDate?: string;
  }
): MockJob {
  return {
    run_id: data.run_id ?? "run-mock-001",
    user_id: data.user_id ?? "user-mock",
    source: data.source ?? "search",
    source_url: data.source_url ?? `https://${data.company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/careers`,
    external_apply_url: data.external_apply_url ?? `https://${data.company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/careers`,
    job_type: data.job_type ?? "fulltime",
    about_role: data.about_role ?? `Join ${data.company} as a ${data.title}.`,
    responsibilities: data.responsibilities ?? [
      "Collaborate with cross-functional product and engineering teams",
      "Deliver reliable, well tested, and maintainable software features",
      "Continuously improve technical infrastructure and performance"
    ],
    requirements: data.requirements ?? [
      "Demonstrated experience in modern frontend web technologies",
      "Proficiency with TypeScript and modern component patterns",
      "Effective communication and problem solving abilities"
    ],
    nice_to_have: data.nice_to_have ?? null,
    benefits: data.benefits ?? ["Competitive compensation", "Health coverage", "Remote flexibility"],
    about_company: data.about_company ?? `${data.company} is an industry leader in modern technology products.`,
    company_research: data.company_research ?? null,
    ...data
  };
}

export const MOCK_JOBS: MockJob[] = [
  createMockJob({
    id: "job-001",
    title: "Senior Frontend Engineer",
    company: "Vercel",
    location: "Remote",
    salary: "$160k - $200k",
    match_score: 94,
    match_reason: "Strong alignment with candidate React and TypeScript experience, along with Next.js expertise.",
    matched_skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Web Performance"],
    missing_skills: ["Turborepo"],
    found_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    displayDate: "2 hours ago"
  }),
  createMockJob({
    id: "job-002",
    title: "Staff UI Engineer",
    company: "Stripe",
    location: "San Francisco, CA / Remote",
    salary: "$180k - $240k",
    match_score: 88,
    match_reason: "Excellent UI engineering background and design system proficiency.",
    matched_skills: ["TypeScript", "React", "Design Systems", "Accessibility", "Tailwind CSS"],
    missing_skills: ["Fintech Systems"],
    found_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    displayDate: "Yesterday"
  }),
  createMockJob({
    id: "job-003",
    title: "Product Engineer",
    company: "Linear",
    location: "Remote",
    salary: "$150k - $190k",
    match_score: 96,
    match_reason: "Near perfect match for product craftsmanship, React proficiency, and frontend speed.",
    matched_skills: ["React", "TypeScript", "UI Architecture", "Performance", "CSS"],
    missing_skills: ["Local First Sync"],
    found_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    displayDate: "Yesterday"
  }),
  createMockJob({
    id: "job-004",
    title: "Frontend Developer",
    company: "Notion",
    location: "New York, NY / Hybrid",
    salary: "$130k - $170k",
    match_score: 72,
    match_reason: "Solid skills fit for general frontend development, though document editor internals are absent.",
    matched_skills: ["TypeScript", "React", "Frontend Development"],
    missing_skills: ["Rich Text Editors", "CRDTs"],
    found_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    displayDate: "2 days ago"
  }),
  createMockJob({
    id: "job-005",
    title: "Design Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    salary: "$200k - $280k",
    match_score: 91,
    match_reason: "Outstanding alignment for design engineering, AI integration, and prototyping speed.",
    matched_skills: ["Design Engineering", "React", "TypeScript", "Prototyping", "UI Polish"],
    missing_skills: ["Streaming LLM Protocols"],
    found_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    displayDate: "3 days ago"
  }),
  createMockJob({
    id: "job-006",
    title: "Software Engineer, Editor",
    company: "Figma",
    location: "San Francisco, CA / Hybrid",
    salary: "$170k - $220k",
    match_score: 85,
    match_reason: "High score for web standards and frontend expertise; canvas engine internals require ramping.",
    matched_skills: ["TypeScript", "React", "State Management", "Performance"],
    missing_skills: ["WebGL", "WebAssembly"],
    found_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    displayDate: "4 days ago"
  }),
  createMockJob({
    id: "job-007",
    title: "Senior Web Developer",
    company: "GitHub",
    location: "Remote",
    salary: "$155k - $195k",
    match_score: 89,
    match_reason: "Strong match for web accessibility and developer platform tooling.",
    matched_skills: ["React", "TypeScript", "Accessibility", "Web Standards"],
    missing_skills: ["Ruby on Rails"],
    found_at: new Date(Date.now() - 100 * 60 * 60 * 1000).toISOString(),
    displayDate: "4 days ago"
  }),
  createMockJob({
    id: "job-008",
    title: "Full Stack UI Engineer",
    company: "Airbnb",
    location: "Remote",
    salary: "$165k - $215k",
    match_score: 82,
    match_reason: "Great match on web stack and search interface architecture.",
    matched_skills: ["React", "TypeScript", "Node.js", "REST"],
    missing_skills: ["GraphQL"],
    found_at: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    displayDate: "5 days ago"
  }),
  createMockJob({
    id: "job-009",
    title: "Merchant Experience Engineer",
    company: "Shopify",
    location: "Remote",
    salary: "$145k - $185k",
    match_score: 79,
    match_reason: "Good skills match; merchant platform specific domain requires onboarding.",
    matched_skills: ["React", "TypeScript", "Design Systems"],
    missing_skills: ["Polaris", "E-commerce APIs"],
    found_at: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(),
    displayDate: "6 days ago"
  }),
  createMockJob({
    id: "job-010",
    title: "Frontend Systems Engineer",
    company: "Supabase",
    location: "Remote",
    salary: "$160k - $210k",
    match_score: 93,
    match_reason: "Excellent match on Next.js, developer platform UX, and full stack knowledge.",
    matched_skills: ["Next.js", "React", "TypeScript", "SQL", "Tailwind CSS"],
    missing_skills: ["Go"],
    found_at: new Date(Date.now() - 160 * 60 * 60 * 1000).toISOString(),
    displayDate: "6 days ago"
  }),
  createMockJob({
    id: "job-011",
    title: "Software Engineer, Web",
    company: "Resend",
    location: "Remote",
    salary: "$140k - $180k",
    match_score: 95,
    match_reason: "High match on UI aesthetics, Next.js, and developer tooling focus.",
    matched_skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "UI Polish"],
    missing_skills: ["Email Protocol Internals"],
    found_at: new Date(Date.now() - 170 * 60 * 60 * 1000).toISOString(),
    displayDate: "7 days ago"
  }),
  createMockJob({
    id: "job-012",
    title: "Frontend Engineer, Telemetry",
    company: "Datadog",
    location: "New York, NY / Hybrid",
    salary: "$150k - $190k",
    match_score: 68,
    match_reason: "Moderate match; candidate lacks dedicated canvas charting and telemetry background.",
    matched_skills: ["React", "TypeScript", "Frontend Engineering"],
    missing_skills: ["D3.js", "Data Visualization", "Telemetry"],
    found_at: new Date(Date.now() - 190 * 60 * 60 * 1000).toISOString(),
    displayDate: "8 days ago"
  }),
  createMockJob({
    id: "job-013",
    title: "Client Engineer",
    company: "Slack",
    location: "Remote",
    salary: "$160k - $205k",
    match_score: 81,
    match_reason: "Good match on modern client architecture.",
    matched_skills: ["React", "TypeScript", "State Management"],
    missing_skills: ["Electron"],
    found_at: new Date(Date.now() - 200 * 60 * 60 * 1000).toISOString(),
    displayDate: "8 days ago"
  }),
  createMockJob({
    id: "job-014",
    title: "JavaScript Engineer",
    company: "Automattic",
    location: "Remote",
    salary: "$130k - $165k",
    match_score: 75,
    match_reason: "Solid JavaScript fundamentals, open source editor patterns require learning.",
    matched_skills: ["JavaScript", "React", "CSS"],
    missing_skills: ["Gutenberg Architecture", "PHP"],
    found_at: new Date(Date.now() - 220 * 60 * 60 * 1000).toISOString(),
    displayDate: "9 days ago"
  }),
  createMockJob({
    id: "job-015",
    title: "Frontend Engineer, Cloud UI",
    company: "HashiCorp",
    location: "Remote",
    salary: "$150k - $190k",
    match_score: 84,
    match_reason: "Strong fit for cloud developer consoles and clean design systems.",
    matched_skills: ["React", "TypeScript", "Design Systems", "Tailwind CSS"],
    missing_skills: ["Terraform Workflows"],
    found_at: new Date(Date.now() - 240 * 60 * 60 * 1000).toISOString(),
    displayDate: "10 days ago"
  }),
  createMockJob({
    id: "job-016",
    title: "Web Platform Engineer",
    company: "Cloudflare",
    location: "Austin, TX / Remote",
    salary: "$160k - $210k",
    match_score: 87,
    match_reason: "Great match on web platforms and edge developer workflows.",
    matched_skills: ["React", "TypeScript", "HTTP Protocols", "Web Performance"],
    missing_skills: ["Edge Workers SDK"],
    found_at: new Date(Date.now() - 260 * 60 * 60 * 1000).toISOString(),
    displayDate: "11 days ago"
  }),
  createMockJob({
    id: "job-017",
    title: "Product Engineer, Console",
    company: "PlanetScale",
    location: "Remote",
    salary: "$150k - $195k",
    match_score: 92,
    match_reason: "Excellent overlap with candidate developer tooling and Next.js background.",
    matched_skills: ["Next.js", "React", "TypeScript", "Developer Experience"],
    missing_skills: ["Vitess"],
    found_at: new Date(Date.now() - 280 * 60 * 60 * 1000).toISOString(),
    displayDate: "12 days ago"
  }),
  createMockJob({
    id: "job-018",
    title: "Frontend Engineer, Workflow",
    company: "Sentry",
    location: "San Francisco, CA / Remote",
    salary: "$145k - $185k",
    match_score: 86,
    match_reason: "High alignment with developer focused monitoring workflows.",
    matched_skills: ["React", "TypeScript", "Data Structures", "Tailwind CSS"],
    missing_skills: ["Python Backend"],
    found_at: new Date(Date.now() - 300 * 60 * 60 * 1000).toISOString(),
    displayDate: "12 days ago"
  }),
  createMockJob({
    id: "job-019",
    title: "UI Engineer, Workspaces",
    company: "Replit",
    location: "Remote",
    salary: "$160k - $210k",
    match_score: 90,
    match_reason: "Strong fit for AI assisted coding interfaces and reactive web UI.",
    matched_skills: ["React", "TypeScript", "AI Workflows", "Web APIs"],
    missing_skills: ["Monaco Editor Internals"],
    found_at: new Date(Date.now() - 320 * 60 * 60 * 1000).toISOString(),
    displayDate: "13 days ago"
  }),
  createMockJob({
    id: "job-020",
    title: "Web Applications Developer",
    company: "Docker",
    location: "Remote",
    salary: "$140k - $180k",
    match_score: 80,
    match_reason: "Good match for developer portal frontend work.",
    matched_skills: ["React", "TypeScript", "Docker"],
    missing_skills: ["Container Internals"],
    found_at: new Date(Date.now() - 340 * 60 * 60 * 1000).toISOString(),
    displayDate: "14 days ago"
  }),
  createMockJob({
    id: "job-021",
    title: "UI Component Specialist",
    company: "Tailwind Labs",
    location: "Remote",
    salary: "$150k - $190k",
    match_score: 97,
    match_reason: "Exceptional match for Tailwind CSS mastery, component craftsmanship, and clean design.",
    matched_skills: ["Tailwind CSS", "React", "TypeScript", "Accessibility", "Design Systems"],
    missing_skills: [],
    found_at: new Date(Date.now() - 360 * 60 * 60 * 1000).toISOString(),
    displayDate: "15 days ago"
  }),
  createMockJob({
    id: "job-022",
    title: "Frontend Engineer, Analytics",
    company: "Lattice",
    location: "San Francisco, CA / Remote",
    salary: "$140k - $175k",
    match_score: 76,
    match_reason: "Good web foundation; HR domain requires ramp up.",
    matched_skills: ["React", "TypeScript", "CSS"],
    missing_skills: ["GraphQL"],
    found_at: new Date(Date.now() - 380 * 60 * 60 * 1000).toISOString(),
    displayDate: "16 days ago"
  }),
  createMockJob({
    id: "job-023",
    title: "Customer Data UI Engineer",
    company: "Segment",
    location: "Remote",
    salary: "$155k - $195k",
    match_score: 83,
    match_reason: "Good alignment on complex integration configuration UI.",
    matched_skills: ["React", "TypeScript", "Integration UX"],
    missing_skills: ["Kafka"],
    found_at: new Date(Date.now() - 400 * 60 * 60 * 1000).toISOString(),
    displayDate: "17 days ago"
  }),
  createMockJob({
    id: "job-024",
    title: "API Platform Web Developer",
    company: "Postman",
    location: "Remote",
    salary: "$145k - $185k",
    match_score: 88,
    match_reason: "Strong fit for API client tooling and developer platforms.",
    matched_skills: ["React", "TypeScript", "API Design", "Performance"],
    missing_skills: ["Electron"],
    found_at: new Date(Date.now() - 420 * 60 * 60 * 1000).toISOString(),
    displayDate: "18 days ago"
  })
];
