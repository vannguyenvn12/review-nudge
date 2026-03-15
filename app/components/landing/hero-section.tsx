// Hero section — above the fold, primary conversion point
// 2-col layout: left = copy + CTAs, right = product mockup
// Server Component

import Link from "next/link";

// Simulated dashboard mockup — shows job list with review status
// No real screenshot needed; styled div communicates the product visually
function ProductMockup() {
  const jobs = [
    { name: "Mike Johnson", service: "HVAC Repair", status: "reviewed", label: "Reviewed ⭐" },
    { name: "Sarah Chen", service: "Plumbing", status: "sent", label: "Email Sent ✅" },
    { name: "Tom Williams", service: "Electrical", status: "pending", label: "Scheduled 🕐" },
  ];

  const statusColors: Record<string, string> = {
    reviewed: "bg-emerald-100 text-emerald-700",
    sent: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
      {/* Mockup header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: "var(--brand-navy)" }}>
          Recent Jobs
        </span>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={{ backgroundColor: "var(--brand-emerald)", color: "white" }}
        >
          3 reviews collected
        </span>
      </div>

      {/* Job rows */}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.name}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {job.name}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {job.service}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[job.status]}`}>
              {job.label}
            </span>
          </div>
        ))}
      </div>

      {/* Caption */}
      <p className="mt-4 text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Review emails sent automatically after every job
      </p>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="px-6 py-24"
      style={{ backgroundColor: "var(--brand-bg)" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        {/* Left — copy & CTAs */}
        <div className="flex flex-col gap-6">
          <h1
            className="text-5xl font-bold leading-tight tracking-tight"
            style={{ color: "var(--brand-navy)" }}
          >
            Your Customers Will Leave Reviews.{" "}
            <span className="block">Without You Asking.</span>
          </h1>

          <p className="text-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Log a completed job → Review Nudge emails your customer at the
            perfect moment, automatically.
          </p>

          {/* CTA group */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Primary — amber */}
            <Link
              href="/auth/signup"
              className="rounded-lg px-8 py-4 text-center text-base font-bold transition-all hover:scale-[1.03] hover:opacity-90"
              style={{
                backgroundColor: "var(--brand-amber)",
                color: "var(--brand-navy)",
              }}
            >
              Start Getting Reviews Free
            </Link>

            {/* Secondary — ghost */}
            <Link
              href="#how-it-works"
              className="rounded-lg border-2 px-8 py-4 text-center text-base font-semibold transition-colors hover:bg-black/5"
              style={{
                borderColor: "var(--brand-navy)",
                color: "var(--brand-navy)",
              }}
            >
              See How It Works ↓
            </Link>
          </div>

          {/* Trust micro-copy */}
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Free tier included · No credit card required · 5-minute setup
          </p>
        </div>

        {/* Right — product mockup */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
