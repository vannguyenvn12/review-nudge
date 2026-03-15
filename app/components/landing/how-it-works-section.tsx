// How It Works section — 3-step process, removes "is this complicated?" objection
// Scroll anchor: id="how-it-works" — targeted by navbar + hero secondary CTA
// Server Component

import Link from "next/link";

const steps = [
  {
    number: "1",
    title: "Add Your Google Review Link",
    description:
      "Paste your Google Review URL in settings. Takes 30 seconds — find it in your Google Business Profile.",
  },
  {
    number: "2",
    title: "Log a Completed Job",
    description:
      "After finishing a job, enter your customer's name and email. That's it — no CRM or integrations needed.",
  },
  {
    number: "3",
    title: "We Email Them For You",
    description:
      "Review Nudge sends a warm, personalized email at the right time. Your customer gets a direct link to leave a review.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2
            className="mb-4 text-4xl font-bold tracking-tight"
            style={{ color: "var(--brand-navy)" }}
          >
            Dead Simple. Works in 3 Steps.
          </h2>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            No integrations. No complicated setup. Works from day one.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-8"
            >
              {/* Amber numbered circle */}
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold"
                style={{
                  backgroundColor: "var(--brand-amber)",
                  color: "var(--brand-navy)",
                }}
              >
                {step.number}
              </div>
              <h3
                className="text-xl font-bold"
                style={{ color: "var(--brand-navy)" }}
              >
                {step.title}
              </h3>
              <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA below steps */}
        <div className="mt-12 text-center">
          <Link
            href="/auth/signup"
            className="inline-block rounded-lg px-10 py-4 text-base font-bold transition-all hover:scale-[1.03] hover:opacity-90"
            style={{
              backgroundColor: "var(--brand-amber)",
              color: "var(--brand-navy)",
            }}
          >
            Start Free →
          </Link>
        </div>
      </div>
    </section>
  );
}
