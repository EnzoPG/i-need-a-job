# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Navbar
- **File**: `components/layout/Navbar.tsx`
- **Classes**: `w-full bg-surface border-b border-border`, `max-w-7xl mx-auto h-16 px-6 lg:px-8 flex items-center justify-between`, `text-sm font-medium text-text-secondary hover:text-text-primary`, `bg-text-darkest hover:bg-text-black text-white text-sm font-medium px-4 py-2 rounded-lg shadow-xs`

### Footer
- **File**: `components/layout/Footer.tsx`
- **Classes**: `w-full bg-surface border-t border-border py-8`, `max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4`, `text-sm text-text-secondary hover:text-text-primary`

### Hero
- **File**: `components/homepage/Hero.tsx`
- **Classes**: `relative overflow-hidden bg-surface bg-hero-gradient border-b border-border`, `text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary`, `text-base sm:text-lg text-text-secondary max-w-2xl mx-auto`, `bg-text-darkest hover:bg-text-black text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-xs`, `bg-surface hover:bg-surface-secondary text-text-primary border border-border text-sm font-medium px-5 py-2.5 rounded-lg shadow-xs`

### Features
- **File**: `components/homepage/Features.tsx`
- **Classes**: `w-full py-12 sm:py-16 bg-diagonal-stripes`, `bg-surface border border-border overflow-hidden grid grid-cols-1 md:grid-cols-2`, `p-8 sm:p-10 border-b border-border`, `border-l-2 border-l-accent`, `text-3xl sm:text-4xl font-bold tracking-tight text-text-primary`, `text-base font-semibold text-text-primary`, `text-sm text-text-secondary`

### HowItWorks
- **File**: `components/homepage/HowItWorks.tsx`
- **Classes**: `w-full py-12 sm:py-16 bg-diagonal-stripes`, `bg-surface border border-border overflow-hidden grid grid-cols-1 md:grid-cols-2`, `p-8 sm:p-10 border-b border-border`, `text-3xl sm:text-4xl font-bold tracking-tight text-text-primary`, `text-base font-semibold text-text-primary`, `text-sm text-text-secondary`

### Testimonial
- **File**: `components/homepage/Testimonial.tsx`
- **Classes**: `w-full py-12 sm:py-16 bg-diagonal-stripes`, `bg-surface border border-border p-10 sm:p-16 text-center`, `text-accent text-xs font-semibold tracking-widest uppercase`, `text-xl sm:text-2xl md:text-3xl font-medium text-text-primary max-w-3xl mx-auto`, `w-11 h-11 rounded-lg object-cover border border-border-light`

### BottomCta
- **File**: `components/homepage/BottomCta.tsx`
- **Classes**: `w-full bg-surface bg-cta-gradient border-y border-border py-20 px-6 sm:px-8 text-center`, `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary`, `text-base sm:text-lg text-text-secondary max-w-xl mx-auto`, `bg-text-darkest hover:bg-text-black text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-xs`, `bg-surface hover:bg-surface-secondary text-text-primary border border-border text-sm font-medium px-5 py-2.5 rounded-lg shadow-xs`

### OAuthButtons
- **File**: `components/auth/OAuthButtons.tsx`
- **Classes**: `w-full bg-surface hover:bg-surface-secondary border border-border text-text-primary font-medium text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-xs`, `w-5 h-5 border-2 border-border-muted border-t-accent rounded-full animate-spin`

### LoginPage
- **File**: `app/(auth)/login/page.tsx`
- **Classes**: `min-h-screen bg-diagonal-stripes flex flex-col justify-center items-center px-4 py-12`, `bg-surface border border-border rounded-2xl p-8 shadow-xs`, `text-2xl font-bold tracking-tight text-text-primary`, `text-xs text-text-muted`

### CompletionIndicator
- **File**: `components/profile/CompletionIndicator.tsx`
- **Classes**: `bg-surface border border-border rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs`, `text-error bg-error/10 border border-error/20 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider`, circular SVG meter with `stroke={isComplete ? "var(--color-success)" : "var(--color-error)"}`

### ResumeUpload
- **File**: `components/profile/ResumeUpload.tsx`
- **Classes**: `bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs`, dashed dropzone: `border-2 border-dashed rounded-xl p-8 text-center`, `bg-accent hover:bg-accent-dark text-accent-foreground text-xs font-medium px-4 py-2 rounded-lg`, active pill: `text-[11px] font-semibold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded uppercase tracking-wider`, extract and generate action buttons: `inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-accent-foreground text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`

### ProfileContent
- **File**: `components/profile/ProfileContent.tsx`
- **Classes**: Client state coordinator managing `CompletionIndicator`, `ResumeUpload`, and `ProfileForm` for live form state updates, AI extraction propagation, and real-time completeness percentage calculation.

### ProfileForm
- **File**: `components/profile/ProfileForm.tsx`
- **Classes**: `bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs`, input fields: `w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent`, save button: `w-full bg-accent hover:bg-accent-dark text-accent-foreground font-medium text-sm py-3 rounded-xl shadow-xs`, success notification: `p-3 rounded-lg border border-success/30 bg-success-lightest text-success-foreground text-xs`, error notification: `p-3 rounded-lg border border-error/30 bg-error/10 text-error text-xs`

### ProfilePage
- **File**: `app/profile/page.tsx`
- **Classes**: `min-h-screen bg-background flex flex-col`, `flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6`

### Toast
- **File**: `components/ui/Toast.tsx`
- **Classes**: container: `fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none`, toast card: `pointer-events-auto bg-surface border border-border rounded-xl p-4 shadow-md flex items-start gap-3 transition-all`, title: `text-sm font-semibold text-text-primary leading-tight`, message: `text-xs text-text-secondary mt-1 leading-relaxed`, dismiss: `text-text-muted hover:text-text-primary transition-colors cursor-pointer`
### TagInput
* **File**: `components/profile/TagInput.tsx`
* **Classes**: container `flex flex-wrap gap-2`, input `flex-1 bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent`, button `bg-surface hover:bg-surface-secondary border border-border text-text-primary text-xs font-medium px-4 py-2 rounded-lg`, tag chip `bg-surface-secondary border border-border text-text-primary text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs`

### ProfileForm Sections
* **Files**: `components/profile/sections/PersonalInfoSection.tsx`, `components/profile/sections/ProfessionalInfoSection.tsx`, `components/profile/sections/WorkExperienceSection.tsx`, `components/profile/sections/EducationSection.tsx`, `components/profile/sections/JobPreferencesSection.tsx`
* **Classes**: section wrapper `mb-8 pt-6 border-t border-border`, section title `text-sm font-semibold text-text-primary mb-4`, role card `border border-border rounded-xl p-5 sm:p-6 bg-surface space-y-4`

### SearchControls
* **File**: `components/find-jobs/SearchControls.tsx`
* **Classes**: container `w-full bg-surface border border-border rounded-2xl p-6 sm:p-7 shadow-xs`, label `text-xs font-semibold text-text-secondary tracking-wider uppercase`, inputs `w-full bg-surface border border-border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent`, button `w-full h-[42px] bg-accent hover:bg-accent-dark text-accent-foreground font-medium text-sm px-5 py-2.5 rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors`, success banner `mt-2 bg-success-lightest border border-success/20 rounded-xl px-4 py-3 flex items-center gap-2.5 text-success-foreground`

### JobFilters
* **File**: `components/find-jobs/JobFilters.tsx`
* **Classes**: container `w-full bg-surface border border-border rounded-2xl p-4 sm:px-6 sm:py-3.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4`, search input `w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none`, dropdown trigger `inline-flex items-center justify-between gap-2 bg-surface hover:bg-surface-secondary border border-border text-text-primary text-sm font-medium px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer`, dropdown menu `absolute right-0 top-full mt-1.5 w-48 bg-surface border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden`

### JobsTable
* **File**: `components/find-jobs/JobsTable.tsx`
* **Classes**: card container `w-full bg-surface border border-border rounded-2xl shadow-xs overflow-hidden`, header `border-b border-border bg-surface text-xs font-semibold text-text-secondary tracking-wider uppercase py-3.5 px-6`, row `hover:bg-surface-secondary transition-colors cursor-pointer group`, company avatar `w-9 h-9 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-text-muted shrink-0`, progress track `w-24 sm:w-32 h-1.5 bg-border rounded-full overflow-hidden shrink-0`, progress fill `h-full rounded-full transition-all duration-300`, score text `text-sm font-semibold text-text-primary`

### JobsPagination
* **File**: `components/find-jobs/JobsPagination.tsx`
* **Classes**: container `w-full bg-surface border border-border rounded-2xl px-6 py-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4`, counter `text-sm text-text-secondary font-semibold text-text-primary`, navigation button `px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-border bg-surface text-text-secondary hover:bg-surface-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer`, active page `border-accent bg-accent/10 text-accent font-semibold`, inactive page `border-border bg-surface text-text-secondary hover:bg-surface-secondary hover:text-text-primary`

### FindJobsContent
* **File**: `components/find-jobs/FindJobsContent.tsx`
* **Classes**: Client coordinator managing state for search keywords, match tier dropdown filtering, sorting, pagination slicing, and banner updates.

### FindJobsPage
* **File**: `app/find-jobs/page.tsx`
* **Classes**: `min-h-screen bg-background flex flex-col`, `flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6`
