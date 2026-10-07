import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FindJobsContent } from "@/components/find-jobs/FindJobsContent";

export const metadata = {
  title: "Find Jobs | INeedAJob",
  description: "Search and inspect AI-scored job opportunities tailored to your career profile."
};

export default async function FindJobsPage() {
  const insforge = await createInsforgeServer();
  const { data, error } = await insforge.auth.getCurrentUser();

  if (error || !data?.user) {
    redirect("/login?redirect=/find-jobs");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar showSignOut />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <FindJobsContent />
      </main>

      <Footer />
    </div>
  );
}
