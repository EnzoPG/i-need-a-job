import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompletionIndicator } from "@/components/profile/CompletionIndicator";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar showSignOut />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        <CompletionIndicator
          completionPercentage={70}
          missingFields={["PHONE", "LOCATION", "EDUCATION"]}
        />

        <ResumeUpload />

        <ProfileForm
          initialData={{
            email: initialEmail,
            ...(initialFullName ? { fullName: initialFullName } : {}),
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
