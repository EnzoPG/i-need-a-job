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
- **Classes**: `bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs`, dashed dropzone: `border-2 border-dashed rounded-xl p-8 text-center`, `bg-accent hover:bg-accent-dark text-accent-foreground text-xs font-medium px-4 py-2 rounded-lg`, active pill: `text-[11px] font-semibold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded uppercase tracking-wider`

### ProfileForm
- **File**: `components/profile/ProfileForm.tsx`
- **Classes**: `bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs`, input fields: `w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent`, save button: `w-full bg-accent hover:bg-accent-dark text-accent-foreground font-medium text-sm py-3 rounded-xl shadow-xs`, success notification: `p-3 rounded-lg border border-success/30 bg-success-lightest text-success-foreground text-xs`, error notification: `p-3 rounded-lg border border-error/30 bg-error/10 text-error text-xs`

### ProfilePage
- **File**: `app/profile/page.tsx`
- **Classes**: `min-h-screen bg-background flex flex-col`, `flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6`

