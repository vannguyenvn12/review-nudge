import { NextRequest, NextResponse } from "next/server";
import { createUntypedAdminClient } from "@/lib/supabase/server";

/**
 * GET /api/track/[reviewRequestId]
 *
 * Click-tracking endpoint embedded in review request emails.
 * - Marks review_requests.status as 'clicked' (only when currently 'sent')
 * - Redirects the user to the business's Google review URL
 *
 * No auth required — link is opened by email recipients who have no session.
 * Uses the admin client to bypass RLS.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ reviewRequestId: string }> }
) {
  const { reviewRequestId } = await params;

  const supabase = createUntypedAdminClient();

  // Fetch the review request and the associated Google review URL via join
  const { data, error } = await supabase
    .from("review_requests")
    .select("id, status, jobs ( profiles!user_id ( google_review_url ) )")
    .eq("id", reviewRequestId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Review request not found." },
      { status: 404 }
    );
  }

  // Extract google_review_url from nested join.
  // Cast via unknown: untyped client infers arrays for relations, but .single()
  // + a to-one FK returns an object at runtime.
  type JobsShape = { profiles: { google_review_url: string | null } | null } | null;
  const jobs = (data.jobs as unknown) as JobsShape;
  const googleReviewUrl = jobs?.profiles?.google_review_url;

  if (!googleReviewUrl) {
    return NextResponse.json(
      { error: "No Google review URL configured for this business." },
      { status: 500 }
    );
  }

  // Update status to 'clicked' only when currently 'sent' (idempotent)
  if (data.status === "sent") {
    await supabase
      .from("review_requests")
      .update({ status: "clicked" })
      .eq("id", reviewRequestId);
  }

  return NextResponse.redirect(googleReviewUrl, 302);
}
