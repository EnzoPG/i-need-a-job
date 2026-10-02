# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 2 — Profile Page
**Last completed:** 05 Profile Page — Full UI
**Next:** 04 Database Schema & 06 Profile Save Logic

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [ ] 03 PostHog Initialization
- [ ] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [ ] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

- **Profile Page & Basic User Info Fetching:** Implemented [app/profile/page.tsx](file:///Users/enzogerola/Documents/GitHub/i-need-a-job/app/profile/page.tsx) as an authenticated Server Component querying `insforge.auth.getCurrentUser()`. Extracts the user's `email`, `profile.name`, and metadata to pre-populate the profile form while maintaining `email` as a read-only field.
- **Active Navigation Indicator:** Updated [components/layout/Navbar.tsx](file:///Users/enzogerola/Documents/GitHub/i-need-a-job/components/layout/Navbar.tsx) using Next.js `usePathname()` to dynamically highlight the active route (e.g. `/profile`).
- **UI Components:** Implemented `CompletionIndicator` (70% circular SVG meter + missing field tags), `ResumeUpload` (drag-and-drop PDF dropzone + action CTA), and `ProfileForm` (Personal Info, Professional Info, Work Experience with dynamic role cards, Education, and Job Preferences) using strictly design tokens.

---

## Notes

- Protected route `/profile` is guarded in `proxy.ts` to redirect unauthenticated sessions to `/login?redirect=/profile`.
- In Next.js 16 / React 19, InsForge user schema returns `{ email, profile: { name, avatar_url }, metadata }`.

