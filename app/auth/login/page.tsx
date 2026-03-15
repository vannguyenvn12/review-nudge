import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

/**
 * Login page — Server Component.
 * Redirects authenticated users straight to the dashboard.
 */
export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Welcome back</h1>
          <p className="mt-1 text-sm text-neutral-500">Sign in to Review Nudge</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
