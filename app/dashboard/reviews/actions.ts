'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type MarkReviewedState = { error: string } | null;

/**
 * Server Action: manually mark a review request as 'reviewed'.
 *
 * Only transitions from 'clicked' → 'reviewed'.
 * Also updates the parent job's status to 'reviewed'.
 */
export async function markReviewedAction(
  reviewRequestId: string,
): Promise<MarkReviewedState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated.' };

  // Fetch the review request + parent job id (RLS ensures ownership)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rr, error: fetchError } = await (supabase.from('review_requests') as any)
    .select('id, status, job_id')
    .eq('id', reviewRequestId)
    .single() as { data: { id: string; status: string; job_id: string } | null; error: { message: string } | null };

  if (fetchError || !rr) return { error: 'Review request not found.' };
  if (rr.status === 'reviewed') return null; // Already reviewed — no-op

  // Update review_request status → 'reviewed'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: rrError } = await (supabase.from('review_requests') as any)
    .update({ status: 'reviewed' })
    .eq('id', reviewRequestId);

  if (rrError) return { error: rrError.message };

  // Update parent job status → 'reviewed'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: jobError } = await (supabase.from('jobs') as any)
    .update({ status: 'reviewed' })
    .eq('id', rr.job_id);

  if (jobError) return { error: jobError.message };

  revalidatePath('/dashboard/reviews');
  revalidatePath('/dashboard/jobs');
  return null;
}
