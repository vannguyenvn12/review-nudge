import { resend } from '@/lib/resend/client';
import { ReviewRequestEmail } from '@/lib/resend/review-request-email';

/** Caller-supplied data needed to dispatch one review request email. */
export interface SendReviewRequestParams {
  /** review_requests.id — used as idempotency key to prevent duplicate sends */
  reviewRequestId: string;
  /** Recipient customer name */
  customerName: string;
  /** Recipient customer email */
  customerEmail: string;
  /** Business name shown in email copy */
  businessName: string;
  /**
   * Sender address. Defaults to Resend's shared test domain (dev/testing only).
   * Replace with a verified domain address before going to production.
   */
  fromEmail?: string;
  /** Direct Google review link from profiles.google_review_url */
  googleReviewUrl: string;
}

export interface SendReviewRequestResult {
  success: boolean;
  /** Resend email ID on success */
  emailId?: string;
  /** Error message on failure */
  error?: string;
}

/**
 * Sends a review request email via Resend.
 *
 * Uses review_requests.id as an idempotency key (pattern: review-request/<id>)
 * so retried calls won't dispatch duplicate emails within a 24-hour window.
 *
 * Does NOT throw — returns { success, emailId } or { success: false, error }.
 */
export async function sendReviewRequest(
  params: SendReviewRequestParams,
): Promise<SendReviewRequestResult> {
  const {
    reviewRequestId,
    customerName,
    customerEmail,
    businessName,
    fromEmail = "onboarding@resend.dev",
    googleReviewUrl,
  } = params;

  const { data, error } = await resend.emails.send(
    {
      from: `${businessName} <${fromEmail}>`,
      to: [customerEmail],
      subject: `How did your experience go, ${customerName}?`,
      react: ReviewRequestEmail({
        customerName,
        businessName,
        googleReviewUrl,
      }),
      tags: [
        { name: 'type', value: 'review-request' },
        { name: 'review_request_id', value: reviewRequestId },
      ],
    },
    // idempotencyKey as second arg (Resend v6+) — prevents duplicate sends on retry
    { idempotencyKey: `review-request/${reviewRequestId}` },
  );

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, emailId: data?.id };
}
