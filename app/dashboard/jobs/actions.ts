'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type LogJobState = { error: string } | null;

/**
 * Server Action: log a completed job and schedule a review request.
 *
 * CRITICAL SEQUENCE:
 *  1. Validate inputs
 *  2. Insert job row (status: 'completed')
 *  3. Fetch user profile for delay_hours
 *  4. Calculate scheduled_at = completed_at + delay_hours
 *  5. Insert review_request row (status: 'pending')
 *  6. Revalidate jobs page
 */
export async function logJobAction(
  _prev: LogJobState,
  formData: FormData,
): Promise<LogJobState> {
  const customer_id = (formData.get('customer_id') as string | null)?.trim();
  const service_type = (formData.get('service_type') as string | null)?.trim();
  const completed_at_raw = (
    formData.get('completed_at') as string | null
  )?.trim();
  const notes = (formData.get('notes') as string | null)?.trim() || null;

  if (!customer_id) return { error: 'Please select a customer.' };
  if (!service_type) return { error: 'Service type is required.' };

  // Parse completed_at; fall back to now if blank
  const completed_at = completed_at_raw
    ? new Date(completed_at_raw).toISOString()
    : new Date().toISOString();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated.' };

  // Step 1: Insert the job row
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: jobData, error: jobError } = await (
    supabase.from('jobs') as any
  )
    .insert({
      user_id: user.id,
      customer_id,
      service_type,
      completed_at,
      status: 'completed',
      notes,
    })
    .select('id')
    .single();

  if (jobError) return { error: jobError.message };

  // Step 2: Fetch the user's delay_hours from their profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile, error: profileError } = (await (
    supabase.from('profiles') as any
  )
    .select('delay_hours')
    .eq('id', user.id)
    .single()) as {
    data: { delay_hours: number } | null;
    error: { message: string } | null;
  };

  if (profileError) return { error: profileError.message };

  const delayMs = (profile?.delay_hours ?? 2) * 3600 * 1000;
  const scheduled_at = new Date(
    new Date(completed_at).getTime() + delayMs,
  ).toISOString();

  // Step 3: Insert review_request row linked to the new job
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: rrError } = await (
    supabase.from('review_requests') as any
  ).insert({
    job_id: jobData.id,
    status: 'pending',
    scheduled_at,
  });

  if (rrError) return { error: rrError.message };

  revalidatePath('/dashboard/jobs');
  return null;
}
