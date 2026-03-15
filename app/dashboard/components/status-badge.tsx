/** Coloured pill badge for job and review request statuses. */

import type { JobStatus, ReviewRequestStatus } from "@/lib/types/database";

type Status = JobStatus | ReviewRequestStatus;

const STATUS_STYLES: Record<Status, string> = {
  completed: "bg-yellow-100 text-yellow-800",
  review_sent: "bg-blue-100 text-blue-800",
  reviewed: "bg-green-100 text-green-800",
  pending: "bg-gray-100 text-gray-600",
  sent: "bg-blue-100 text-blue-800",
  failed: "bg-red-100 text-red-800",
  clicked: "bg-purple-100 text-purple-800",
};

const STATUS_LABELS: Record<Status, string> = {
  completed: "Completed",
  review_sent: "Review Sent",
  reviewed: "Reviewed",
  pending: "Pending",
  sent: "Sent",
  failed: "Failed",
  clicked: "Clicked",
};

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
