import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignupForm } from "./signup-form";

/**
 * Signup page — Server Component.
 * Redirects authenticated users straight to the dashboard.
 */
export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Create your account</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Start sending review requests in minutes
          </p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
