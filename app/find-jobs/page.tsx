import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FindJobsContent } from "@/components/find-jobs/FindJobsContent";
import { getUserJobs, type MatchFilterOption, type SortOption } from "@/lib/services/jobs";

export const metadata = {
  title: "Find Jobs | INeedAJob",
  description: "Search and inspect AI-scored job opportunities tailored to your career profile."
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function FindJobsPage({ searchParams }: Props) {
  const insforge = await createInsforgeServer();
  const { data, error } = await insforge.auth.getCurrentUser();

  if (error || !data?.user) {
    redirect("/login?redirect=/find-jobs");
  }

  const rawParams = await searchParams;

  const q = typeof rawParams.q === "string" ? rawParams.q : "";
  const match =
    typeof rawParams.match === "string" && (rawParams.match === "high" || rawParams.match === "low")
      ? (rawParams.match as MatchFilterOption)
      : "all";
  const sort =
    typeof rawParams.sort === "string" && (rawParams.sort === "newest" || rawParams.sort === "oldest")
      ? (rawParams.sort as SortOption)
      : "match-score";
  const page = typeof rawParams.page === "string" ? parseInt(rawParams.page, 10) : 1;

  const result = await getUserJobs(data.user.id, {
    q,
    match,
    sort,
    page: isNaN(page) ? 1 : page,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar showSignOut />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <FindJobsContent
          initialJobs={result.jobs}
          filteredCount={result.filteredCount}
          totalUserJobsCount={result.totalUserJobsCount}
          currentPage={result.currentPage}
          totalPages={result.totalPages}
          pageSize={result.pageSize}
          initialFilters={{
            q,
            match,
            sort,
          }}
          queryError={result.error}
        />
      </main>

      <Footer />
    </div>
  );
}
