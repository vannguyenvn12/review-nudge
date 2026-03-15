import { NextRequest, NextResponse } from 'next/server';
import { createUntypedAdminClient } from '@/lib/supabase/server';
import { sendReviewRequest } from '@/lib/resend/send-review-request';

/** Shape of each row returned by the nested select query. */
interface PendingReviewRow {
  id: string;
  jobs: {
    id: string;
    user_id: string;
    customers: { name: string; email: string } | null;
    profiles: {
      business_name: string | null;
      google_review_url: string | null;
    } | null;
  } | null;
}

/**
 * GET /api/send-pending-reviews
 *
 * Cron endpoint — called by Vercel Cron every 15 minutes (see vercel.json).
 * Queries pending review_requests whose scheduled_at <= now, sends each email,
 * and updates statuses on both review_requests and jobs tables.
 *
 * Auth: Bearer token matching CRON_SECRET env var.
 */
export async function GET(request: NextRequest) {
  // --- Auth guard ---
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');

  // TODO: Un comment
  // if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const supabase = createUntypedAdminClient();

  // --- Fetch all pending requests that are due ---
  // Cast to unknown first to bypass Supabase's inferred type for nested joins
  const { data: rawData, error: fetchError } = await supabase
    .from('review_requests')
    .select(
      `
      id,
      jobs (
        id,
        user_id,
        customers ( name, email ),
        profiles!user_id ( business_name, google_review_url )
      )
    `,
    )
    .eq('status', 'pending')
    .lte('scheduled_at', new Date().toISOString());

  if (fetchError) {
    console.error('Failed to fetch pending review requests:', fetchError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  const pending = (rawData ?? []) as unknown as PendingReviewRow[];

  let processed = 0;
  let failed = 0;

  console.log('pending', pending);

  for (const rr of pending) {
    const job = rr.jobs;

    // Guard: skip if joins are incomplete
    if (!job || !job.customers || !job.profiles) {
      console.warn(`Skipping review_request ${rr.id}: missing join data`);
      continue;
    }

    const { google_review_url, business_name } = job.profiles;

    // Skip if business hasn't configured their Google review URL
    if (!google_review_url) {
      console.warn(`Skipping review_request ${rr.id}: no google_review_url`);
      continue;
    }

    try {
      const result = await sendReviewRequest({
        reviewRequestId: rr.id,
        customerName: job.customers.name,
        // TODO: update later
        // customerEmail:  job.customers.email,
        customerEmail: 'vannguyenvn1212@gmail.com',
        businessName: business_name ?? 'Our team',
        googleReviewUrl: google_review_url,
      });

      if (!result.success) {
        throw new Error(result.error ?? 'Unknown send error');
      }

      // Mark review_request as sent
      await supabase
        .from('review_requests')
        .update({ status: 'sent' as const, sent_at: new Date().toISOString() })
        .eq('id', rr.id);

      // Update job status
      await supabase
        .from('jobs')
        .update({ status: 'review_sent' as const })
        .eq('id', job.id);

      processed++;
    } catch (err) {
      console.error(`Failed to send review_request ${rr.id}:`, err);
      // Mark as failed — don't throw; continue processing the rest
      await supabase
        .from('review_requests')
        .update({ status: 'failed' as const })
        .eq('id', rr.id);
      failed++;
    }
  }

  return NextResponse.json({ processed, failed });
}
