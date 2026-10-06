import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileContent } from "@/components/profile/ProfileContent";
import type { ProfileData } from "@/types/profile";
import { computeProfileCompleteness } from "@/lib/profile-utils";
import { profileRowToDomain } from "@/lib/mappers/profile";

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

  const initialData: Partial<ProfileData> = profileRowToDomain(profile, {
    email: initialEmail,
    fullName: initialFullName,
  });

  const { completionPercentage, missingFields } = computeProfileCompleteness(
    initialData,
    initialEmail
  );

  const resumeUrl = profile?.resume_pdf_url || null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar showSignOut />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        <ProfileContent
          initialData={initialData}
          initialEmail={initialEmail}
          resumeUrl={resumeUrl}
          initialCompleteness={{ completionPercentage, missingFields }}
        />
      </main>

      <Footer />
    </div>
  );
}
