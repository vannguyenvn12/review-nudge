'use client';

import { useTransition } from 'react';
import { markReviewedAction } from '@/app/dashboard/reviews/actions';

interface MarkReviewedButtonProps {
  reviewRequestId: string;
}

/**
 * Client Component: button that calls markReviewedAction for a single review request.
 * Shown only for rows with status 'clicked' (enforced by the parent Server Component).
 */
export default function MarkReviewedButton({ reviewRequestId }: MarkReviewedButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await markReviewedAction(reviewRequestId);
      if (result?.error) {
        alert(result.error);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="ml-2 rounded-md bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
    >
      {isPending ? 'Saving…' : 'Mark Reviewed'}
    </button>
  );
}
