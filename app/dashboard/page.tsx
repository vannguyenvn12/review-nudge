import { createClient } from "@/lib/supabase/server";
import type { JobStatus, ReviewRequestStatus } from "@/lib/types/database";
import StatsCard from "@/app/dashboard/components/stats-card";
import StatusBadge from "@/app/dashboard/components/status-badge";
import EmptyState from "@/app/dashboard/components/empty-state";

// Local shapes for the selected columns (avoids inference issues with FK joins)
interface JobStat { id: string; status: JobStatus }
interface RecentJob {
  id: string;
  service_type: string;
  completed_at: string | null;
  status: JobStatus;
  customers: { name: string } | null;
}
interface RRStat { id: string; status: ReviewRequestStatus }

export default async function DashboardPage() {
  const supabase = await createClient();

  // Parallel fetch: all jobs (stats), recent 10 jobs (table), all review_requests (stats)
  const [{ data: jobsRaw }, { data: recentJobsRaw }, { data: rrRaw }] =
    await Promise.all([
      supabase.from("jobs").select("id, status"),
      supabase
        .from("jobs")
        .select("id, service_type, completed_at, status, customers(name)")
        .order("completed_at", { ascending: false })
        .limit(10),
      supabase.from("review_requests").select("id, status"),
    ]);

  const jobs = (jobsRaw ?? []) as JobStat[];
  const recentJobs = (recentJobsRaw ?? []) as RecentJob[];
  const rr = (rrRaw ?? []) as RRStat[];

  // ─── Stats calculations ────────────────────────────────────────────────────
  const totalJobs = jobs.length;
  const sent = rr.filter((r) => !["pending", "failed"].includes(r.status)).length;
  const clicked = rr.filter((r) => ["clicked", "reviewed"].includes(r.status)).length;
  const reviewed = rr.filter((r) => r.status === "reviewed").length;
  const conversionPct = sent === 0 ? "—" : `${((reviewed / sent) * 100).toFixed(1)}%`;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Overview</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Jobs" value={totalJobs} />
        <StatsCard label="Emails Sent" value={sent} />
        <StatsCard label="Clicked" value={clicked} />
        <StatsCard label="Conversion" value={conversionPct} subtitle="reviewed / sent" />
      </div>

      {/* Recent jobs table */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Recent Jobs</h2>

        {recentJobs.length === 0 ? (
          <EmptyState
            message="No jobs logged yet"
            ctaLabel="Log your first job"
            ctaHref="/dashboard/jobs"
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Customer", "Service", "Completed At", "Status"].map((h) => (
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
                {recentJobs.map((job) => {
                  // customers is a single object from the FK join (typed as RecentJob)
                  const customerName = job.customers?.name ?? "—";

                  return (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{customerName}</td>
                      <td className="px-4 py-3 text-gray-600">{job.service_type}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {job.completed_at
                          ? new Date(job.completed_at).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={job.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
