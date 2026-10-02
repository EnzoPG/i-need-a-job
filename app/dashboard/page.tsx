import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createInsforgeServer } from "@/lib/insforge-server";

export default async function DashboardPage() {
  const insforge = await createInsforgeServer();
  const { data } = await insforge.auth.getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showSignOut />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Dashboard
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Welcome back{data?.user?.email ? `, ${data.user.email}` : ""}
            </p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 bg-accent-light text-accent rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
              ✓
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              Authentication Active
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              You are signed in to JobPilot. The full dashboard UI will be implemented in Phase 5.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
