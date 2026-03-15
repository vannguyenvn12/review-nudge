import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { ProfileInsert } from "@/lib/types/database";

/**
 * Supabase auth callback handler.
 * Exchanges the one-time code for a session cookie, then redirects.
 * Handles: email confirmation links, magic links, OAuth flows.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  // Safety-net: ensure a profiles row exists for the confirmed user.
  // Covers the email-confirmation flow where signUp may have skipped the upsert.
  // Uses admin client to bypass RLS — identity already verified via code exchange.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profile: ProfileInsert = {
      id: user.id,
      email: user.email ?? "",
      full_name: null,
      business_name: null,
      google_review_url: null,
      delay_hours: 2,
    };
    const admin = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin.from("profiles") as any).upsert(profile, {
      onConflict: "id",
      ignoreDuplicates: true,
    });
  }

  return NextResponse.redirect(`${origin}${next}`);
}
