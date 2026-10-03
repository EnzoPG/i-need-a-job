import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompletionIndicator } from "@/components/profile/CompletionIndicator";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import { ProfileForm, type ProfileData } from "@/components/profile/ProfileForm";
import { computeProfileCompleteness } from "@/lib/profile-utils";

export default async function ProfilePage() {
  const insforge = await createInsforgeServer();
  const { data, error } = await insforge.auth.getCurrentUser();

  if (error || !data?.user) {
    redirect("/login?redirect=/profile");
  }

  const user = data.user;
  const initialEmail = user.email || "";
  const initialFullName =
    user.profile?.name ||
    (user.metadata?.full_name as string | undefined) ||
    (user.metadata?.name as string | undefined) ||
    "";

  // Query existing profile row from InsForge database
  const { data: profile } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const initialData: Partial<ProfileData> = profile
    ? {
        fullName: profile.full_name || initialFullName,
        email: initialEmail,
        phone: profile.phone || "",
        location: profile.location || "",
        linkedinUrl: profile.linkedin_url || "",
        portfolioUrl: profile.portfolio_url || "",
        workAuthorization: profile.work_authorization
          ? profile.work_authorization.charAt(0).toUpperCase() +
            profile.work_authorization.slice(1)
          : "Citizen",
        currentTitle: profile.current_title || "",
        experienceLevel: profile.experience_level
          ? profile.experience_level.charAt(0).toUpperCase() +
            profile.experience_level.slice(1)
          : "Junior",
        yearsExperience:
          profile.years_experience !== null &&
          profile.years_experience !== undefined
            ? String(profile.years_experience)
            : "",
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        industries: Array.isArray(profile.industries) ? profile.industries : [],
        workExperience:
          Array.isArray(profile.work_experience) &&
          profile.work_experience.length > 0
            ? profile.work_experience
            : [],
        highestDegree: profile.education?.highestDegree || "High School",
        fieldOfStudy: profile.education?.fieldOfStudy || "",
        institutionName: profile.education?.institutionName || "",
        graduationYear: profile.education?.graduationYear || "",
        jobTitlesSeeking: Array.isArray(profile.job_titles_seeking)
          ? profile.job_titles_seeking.join(", ")
          : "",
        remotePreference: profile.remote_preference
          ? profile.remote_preference.charAt(0).toUpperCase() +
            profile.remote_preference.slice(1)
          : "Any",
        salaryExpectation: profile.salary_expectation || "",
        preferredLocations: Array.isArray(profile.preferred_locations)
          ? profile.preferred_locations.join(", ")
          : "",
      }
    : {
        email: initialEmail,
        ...(initialFullName ? { fullName: initialFullName } : {}),
      };

  const { completionPercentage, missingFields } = computeProfileCompleteness(
    initialData,
    initialEmail
  );

  const resumeUrl = profile?.resume_pdf_url || null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar showSignOut />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        <CompletionIndicator
          completionPercentage={completionPercentage}
          missingFields={missingFields}
        />

        <ResumeUpload resumeUrl={resumeUrl} />

        <ProfileForm initialData={initialData} />
      </main>

      <Footer />
    </div>
  );
}

