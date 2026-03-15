import { createClient } from "@/lib/supabase/server";
import type { JobStatus, ReviewRequestStatus } from "@/lib/types/database";
import EmptyState from "@/app/dashboard/components/empty-state";
import StatusBadge from "@/app/dashboard/components/status-badge";
import LogJobForm from "./log-job-form";

// Local shape for the joined query result
interface JobRow {
  id: string;
  service_type: string;
  completed_at: string | null;
  status: JobStatus;
  customers: { name: string } | null;
  review_requests: { scheduled_at: string | null; status: ReviewRequestStatus }[];
}

/** Server Component: fetch jobs + customers, render form and jobs table. */
export default async function JobsPage() {
  const supabase = await createClient();

  const [{ data: jobsRaw }, { data: customersRaw }] = await Promise.all([
    supabase
      .from("jobs")
      .select("id, service_type, completed_at, status, customers(name), review_requests(scheduled_at, status)")
      .order("completed_at", { ascending: false }),
    supabase.from("customers").select("id, name").order("name"),
  ]);

  const jobs = (jobsRaw ?? []) as JobRow[];
  const customers = (customersRaw ?? []) as { id: string; name: string }[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>

      {/* Guard: need at least one customer before logging a job */}
      {customers.length === 0 ? (
        <EmptyState
          message="Add a customer before logging a job."
          ctaLabel="Add Customer"
          ctaHref="/dashboard/customers"
        />
      ) : (
        <LogJobForm customers={customers} />
      )}

      {/* Jobs table */}
      {jobs.length === 0 ? (
        <EmptyState message="No jobs logged yet." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Customer", "Service", "Completed At", "Status", "Review Scheduled At"].map((h) => (
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
              {jobs.map((job) => {
                // review_requests is an array from the FK join
                const rr = job.review_requests?.[0] ?? null;

                return (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {job.customers?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{job.service_type}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {job.completed_at
                        ? new Date(job.completed_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {rr?.scheduled_at
                        ? new Date(rr.scheduled_at).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
