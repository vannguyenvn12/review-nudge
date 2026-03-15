import { createClient } from "@/lib/supabase/server";
import type { ReviewRequestStatus } from "@/lib/types/database";
import EmptyState from "@/app/dashboard/components/empty-state";
import StatusBadge from "@/app/dashboard/components/status-badge";

// Local shape for the nested join result
interface ReviewRequestRow {
  id: string;
  scheduled_at: string | null;
  sent_at: string | null;
  status: ReviewRequestStatus;
  jobs: {
    service_type: string;
    completed_at: string | null;
    customers: { name: string } | null;
  } | null;
}

/** Server Component: fetch review_requests → jobs → customers, render read-only table. */
export default async function ReviewsPage() {
  const supabase = await createClient();

  const { data: raw } = await supabase
    .from("review_requests")
    .select(`
      id,
      scheduled_at,
      sent_at,
      status,
      jobs (
        service_type,
        completed_at,
        customers ( name )
      )
    `)
    .order("scheduled_at", { ascending: false });

  const requests = (raw ?? []) as ReviewRequestRow[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>

      {requests.length === 0 ? (
        <EmptyState
          message="No review requests yet. Log a job to trigger one."
          ctaLabel="Log a Job"
          ctaHref="/dashboard/jobs"
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Customer", "Service", "Scheduled At", "Sent At", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((rr) => (
                <tr key={rr.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {rr.jobs?.customers?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {rr.jobs?.service_type ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {rr.scheduled_at
                      ? new Date(rr.scheduled_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {rr.sent_at
                      ? new Date(rr.sent_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={rr.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
