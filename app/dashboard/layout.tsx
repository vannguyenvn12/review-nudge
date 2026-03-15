import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NavLinks } from "./components/nav-links";
import { LogoutButton } from "./components/logout-button";

/** Dashboard layout: auth guard + sticky top navbar */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users to login
  if (!user) {
    redirect("/auth/login");
  }

  const displayName = user.user_metadata?.full_name ?? user.email ?? "User";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky top navbar */}
      <header className="sticky top-0 z-50 bg-gray-900 shadow-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <span className="text-base font-semibold text-white tracking-tight">
            Review Nudge
          </span>

          {/* Nav links */}
          <NavLinks />

          {/* Logout */}
          <LogoutButton displayName={displayName} />
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
