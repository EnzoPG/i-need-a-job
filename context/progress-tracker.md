# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 4 (Job Details Page)
**Last completed:** 11 Filter + Sort + Pagination
**Next:** 12 Job Details Page: Full UI

---

## Progress

### Phase 1: Foundation

- [X] 01 Homepage
- [X] 02 Auth
- [X] 03 PostHog Initialization
- [X] 04 Database Schema

### Phase 2: Profile Page

- [X] 05 Profile Page: Full UI
- [X] 06 Profile Save Logic
- [X] 07 AI Profile Extraction from Resume
- [X] 08 Resume PDF Generation from Profile

### Phase 3: Find Jobs Page

- [X] 09 Find Jobs Page: Full UI
- [X] 10 Adzuna Job Discovery
- [X] 11 Filter + Sort + Pagination

### Phase 4: Job Details Page

- [ ] 12 Job Details Page: Full UI
- [ ] 13 Company Research Agent

### Phase 5: Dashboard

- [ ] 14 Dashboard Page: Full UI
- [ ] 15 Stats Bar: Real Data
- [ ] 16 Recent Activity: Real Data
- [ ] 17 Analytics Charts: PostHog Data

---

* [ ] Decisions Made During Build

* PostHog setup: Configured through the PostHog wizard with client tracking in `instrumentation-client.ts`, server side event logging in `instrumentation.ts` using OpenTelemetry, and user identification on login, dashboard load, and sign out.
* Profile Page and basic user information: Built [app/profile/page.tsx](file:///Users/enzogerola/Documents/GitHub/i-need-a-job/app/profile/page.tsx) as an authenticated server component that fetches user data from `insforge.auth.getCurrentUser()`. Pre-fills full name and keeps email read only.
* Navigation indicator: Added route awareness to [components/layout/Navbar.tsx](file:///Users/enzogerola/Documents/GitHub/i-need-a-job/components/layout/Navbar.tsx) using `usePathname()` so active tabs receive accent styling.
* AI Resume Extraction: Implemented `POST /api/resume/extract` leveraging `unpdf` (worker-free PDF.js) and OpenAI `gpt-4o` with structured JSON schema. Built `ProfileContent` to coordinate extraction output, update form state in the browser before manual save, preserve read only session email, and provide interactive toast notifications.
* Profile State Architecture: Lifted form state to `ProfileContent` and eliminated synchronous `useEffect` calls, avoiding cascading renders and deriving completion metrics directly on render.
* Docker & Next.js Runtime: Standardized dependencies on Next.js 16.3.8 and ESLint 9, replacing worker-dependent PDF tools with `unpdf` to run cleanly across Turbopack and Docker containers.
* Resume PDF Generation: Built server side resume generation pipeline at `POST /api/resume/generate` using OpenAI `gpt-4o` to polish career content and `@react-pdf/renderer` to compile a single page A4 vector PDF directly to InsForge Storage, linking `resume_pdf_url` on the candidate profile and providing real time UI state feedback.
* Clean Architecture and SOLID Refactor: Decoupled UI presentation from server actions and utilities by creating dedicated domain contracts in `types/` (`profile.ts`, `resume.ts`, `database.ts`). Centralized database mapping into `lib/mappers/profile.ts` and unified PDF validation in `lib/validation/file.ts`. Decomposed monolithic `ProfileForm.tsx` from 785 lines into focused section subcomponents and extracted the reusable `TagInput` component, completely removing inverted dependencies.
* Find Jobs Page UI: Built full page UI with mock data matching `context/designs/find-jobs.png` per [docs/specs/0005-find-jobs-page-ui/index.md](file:///Users/enzogerola/Documents/GitHub/i-need-a-job/docs/specs/0005-find-jobs-page-ui/index.md). Implemented modular components in `components/find-jobs/` (`SearchControls`, `JobFilters`, `JobsTable`, `JobsPagination`), isolated mock dataset in `lib/mock-jobs.ts` matching `JobRow`, and client state coordination in `FindJobsContent` with active filtering, sorting, and pagination.
* Adzuna Job Discovery and AI Scoring: Implemented synchronous discovery and evaluation pipeline via `POST /api/agent/find` with Adzuna API client in `lib/services/adzuna.ts`, OpenAI GPT 4o structured scoring in `lib/services/job-scorer.ts`, InsForge database persistence for `agent_runs`, `jobs`, and `agent_logs`, PostHog telemetry, and interactive search integration in `FindJobsContent`.
* Filter, Sort, and Pagination on Find Jobs: Replaced mock data dependency on the Find Jobs page with live InsForge database queries driven by Next.js 16 App Router URL search parameters per [docs/specs/0007-filter-sort-pagination/index.md](file:///Users/enzogerola/Documents/GitHub/i-need-a-job/docs/specs/0007-filter-sort-pagination/index.md). Created query service in `lib/services/jobs.ts` with sanitized parameter clamping, exact counts, and user scoping. Added PostgreSQL composite indexes on `(user_id, match_score DESC)` and `(user_id, found_at DESC)`. Coordinated client updates with React 19 `useTransition` and `useRouter.replace({ scroll: false })` for smooth non blocking table updates, debounced keyword search, dual empty state messaging, and live Adzuna search synchronization with `router.refresh()`.

---

## Notes

* Protected routes `/profile`, `/dashboard`, and `/find-jobs` redirect unauthenticated visitors to `/login` via [proxy.ts](file:///Users/enzogerola/Documents/GitHub/i-need-a-job/proxy.ts).
* InsForge user object contains `{ email, profile: { name, avatar_url }, metadata }`.
