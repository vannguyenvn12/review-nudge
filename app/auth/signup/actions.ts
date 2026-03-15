"use server";

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export type SignUpState =
  | { error: string }
  | { message: string }
  | null;

/**
 * Server Action: sign up with email + password, then upsert a profiles row.
 * - Returns { error } on failure.
 * - Returns { message } when email confirmation is required.
 * - Redirects to /dashboard when session is available immediately.
 *
 * Profile upsert uses the admin client (service role) because the anon client
 * has no session cookie yet at the time of insert — auth.uid() would be null,
 * causing an RLS violation. Identity is already verified from the signUp response.
 */
export async function signUpAction(
  _prev: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = (formData.get("full_name") as string) || null;
  const business_name = (formData.get("business_name") as string) || null;
  const google_review_url = (formData.get("google_review_url") as string) || null;
  const delay_hours_raw = formData.get("delay_hours") as string;
  const delay_hours = delay_hours_raw ? Number(delay_hours_raw) : 2;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  // 1. Create auth user.
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  const user = data.user;

  if (user) {
    // 2. Upsert business profile using admin client — bypasses RLS because the
    // anon client has no session yet (cookie not set within the same request).
    const admin = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (admin.from("profiles") as any).upsert(
      {
        id: user.id,
        email,
        full_name,
        business_name,
        google_review_url,
        delay_hours,
      },
      { onConflict: "id" }
    );

    if (profileError) {
      return { error: profileError.message };
    }
  }

  // 3. If email confirmation is required, session will be null.
  if (!data.session) {
    return { message: "Check your email to confirm your account." };
  }

  redirect("/dashboard");
}
